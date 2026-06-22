/**
 * knowledge-graph.js — 概念知识图谱 (Phase 3)
 * 基于 D3.js v7 力导向图
 * 数据: data/knowledge-graph/{nodes,edges}.json
 * 入口: 由 KnowledgeGraph.open() 调用，渲染到 #main-content（替换正文）
 */
const KnowledgeGraph = (() => {
  let _data = null;

  const TYPE_COLORS = {
    concept:    '#4caf50',
    mechanism:  '#ff9800',
    annotation: '#9c27b0',
    class:      '#2196f3'
  };

  const TYPE_LABELS = {
    concept: '概念',
    mechanism: '机制',
    annotation: '注解',
    class: '类'
  };

  async function _load() {
    if (_data) return _data;
    try {
      const [nodesRes, edgesRes] = await Promise.all([
        fetch('data/knowledge-graph/nodes.json'),
        fetch('data/knowledge-graph/edges.json')
      ]);
      const nodesJson = await nodesRes.json();
      const edgesJson = await edgesRes.json();
      _data = { nodes: nodesJson.nodes, edges: edgesJson.edges };
      return _data;
    } catch (e) {
      console.error('Failed to load knowledge graph', e);
      return null;
    }
  }

  async function open(container, opts = {}) {
    if (typeof d3 === 'undefined') {
      container.innerHTML = '<div class="kg-error">⚠️ D3.js 未加载，请检查网络。</div>';
      return;
    }
    const data = await _load();
    if (!data) {
      container.innerHTML = '<div class="kg-error">⚠️ 知识图谱数据加载失败。</div>';
      return;
    }
    const highlightChapter = opts.highlightChapter || null;

    container.innerHTML = `
      <section class="kg-section">
        <div class="kg-head">
          <h2>🧠 概念知识图谱</h2>
          <p>${data.nodes.length} 个概念 · ${data.edges.length} 条关系。${highlightChapter ? `当前高亮：第 ${highlightChapter} 章相关` : '拖拽节点、滚轮缩放、点击节点跳章'}</p>
        </div>
        <div class="kg-toolbar">
          <label class="kg-filter">章节过滤
            <select id="kg-filter-chapter">
              <option value="">全部</option>
              ${[...new Set(data.nodes.map(n => n.chapterId))].sort().map(c => `<option value="${c}" ${c === highlightChapter ? 'selected' : ''}>${_chapterLabel(c)}</option>`).join('')}
            </select>
          </label>
          <span class="kg-legend">
            ${Object.entries(TYPE_COLORS).map(([t, c]) => `<span class="kg-legend-item"><i style="background:${c}"></i>${TYPE_LABELS[t]}</span>`).join('')}
          </span>
          <button class="quiz-btn" id="kg-reset">重置布局</button>
        </div>
        <div class="kg-canvas-wrap">
          <svg class="kg-canvas" id="kg-canvas"></svg>
        </div>
        <div class="kg-detail" id="kg-detail">
          <div class="kg-detail-hint">点击节点查看详情</div>
        </div>
      </section>
    `;

    _render(data, highlightChapter);

    container.querySelector('#kg-filter-chapter').addEventListener('change', (e) => {
      _render(data, e.target.value || null);
    });
    container.querySelector('#kg-reset').addEventListener('click', () => {
      _render(data, container.querySelector('#kg-filter-chapter').value || null);
    });
  }

  function _chapterLabel(c) {
    const ch = (typeof CONFIG !== 'undefined') ? CONFIG.getChapter(c) : null;
    return ch ? ch.title : `第${c}章`;
  }

  function _render(data, highlightChapter) {
    const svg = d3.select('#kg-canvas');
    svg.selectAll('*').remove();

    const wrap = svg.node().parentElement;
    const W = wrap.clientWidth || 800;
    const H = 540;
    svg.attr('viewBox', `0 0 ${W} ${H}`).attr('width', '100%').attr('height', H);

    // 拷贝数据避免 D3 修改原对象
    const nodes = data.nodes.map(n => ({ ...n }));
    const links = data.edges.map(e => ({ ...e }));

    const matched = new Set(highlightChapter ? nodes.filter(n => n.chapterId === highlightChapter).map(n => n.id) : []);

    const g = svg.append('g');
    svg.call(d3.zoom().scaleExtent([0.3, 3]).on('zoom', (ev) => g.attr('transform', ev.transform)));

    // 箭头
    svg.append('defs').selectAll('marker')
      .data(['default'])
      .enter().append('marker')
      .attr('id', d => `arrow-${d}`)
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 18)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#999');

    const sim = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(85).strength(0.4))
      .force('charge', d3.forceManyBody().strength(-220))
      .force('center', d3.forceCenter(W / 2, H / 2))
      .force('collide', d3.forceCollide(28));

    const link = g.append('g').attr('class', 'kg-links')
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('stroke', '#bbb')
      .attr('stroke-width', 1.2)
      .attr('marker-end', 'url(#arrow-default)');

    const node = g.append('g').attr('class', 'kg-nodes')
      .selectAll('g')
      .data(nodes)
      .enter().append('g')
      .attr('class', 'kg-node')
      .style('cursor', 'pointer')
      .call(d3.drag()
        .on('start', (ev, d) => { if (!ev.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
        .on('drag', (ev, d) => { d.fx = ev.x; d.fy = ev.y; })
        .on('end', (ev, d) => { if (!ev.active) sim.alphaTarget(0); d.fx = null; d.fy = null; }));

    node.append('circle')
      .attr('r', d => (matched.size === 0 || matched.has(d.id)) ? 14 : 9)
      .attr('fill', d => TYPE_COLORS[d.type] || '#888')
      .attr('opacity', d => (matched.size === 0 || matched.has(d.id)) ? 0.95 : 0.25)
      .attr('stroke', d => matched.has(d.id) ? '#ff5722' : '#fff')
      .attr('stroke-width', d => matched.has(d.id) ? 3 : 1.5);

    node.append('text')
      .text(d => d.label)
      .attr('x', 18).attr('y', 4)
      .attr('fill', 'var(--color-text)')
      .attr('font-size', 11)
      .attr('opacity', d => (matched.size === 0 || matched.has(d.id)) ? 1 : 0.4);

    node.on('click', (ev, d) => _showDetail(d));

    sim.on('tick', () => {
      link
        .attr('x1', d => d.source.x).attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x).attr('y2', d => d.target.y);
      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });
  }

  function _showDetail(node) {
    const detail = document.getElementById('kg-detail');
    if (!detail) return;
    const chLabel = _chapterLabel(node.chapterId);
    detail.innerHTML = `
      <div class="kg-detail-card">
        <div class="kg-detail-head">
          <span class="kg-detail-type" style="background:${TYPE_COLORS[node.type]}">${TYPE_LABELS[node.type] || node.type}</span>
          <h3>${node.label}</h3>
        </div>
        <p class="kg-detail-desc">${node.description || ''}</p>
        <div class="kg-detail-actions">
          <button class="quiz-btn" id="kg-goto">📖 跳到 ${chLabel}</button>
        </div>
      </div>
    `;
    detail.querySelector('#kg-goto').addEventListener('click', () => {
      document.dispatchEvent(new CustomEvent('navigate', { detail: { id: node.chapterId } }));
    });
  }

  return Object.freeze({ open });
})();
