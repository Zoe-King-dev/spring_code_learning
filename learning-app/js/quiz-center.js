/**
 * quiz-center.js — 测验中心面板 (Phase 2)
 * 三个 Tab：综合测验 / 错题本 / 成就
 * 由 topbar 上的 🏆 按钮触发开关
 */
const QuizCenter = (() => {
  const TESTS = [
    { id: 'part1', icon: '🧱', title: '第 1 部分综合测验', desc: 'Ch01-Ch05 · 自动装配 / IOC / AOP' },
    { id: 'part2', icon: '🔄', title: '第 2 部分综合测验', desc: 'Ch06-Ch09 · 生命周期 / 嵌入式容器' },
    { id: 'part3', icon: '🔌', title: '第 3 部分综合测验', desc: 'Ch10-Ch13 · JDBC / MyBatis / MVC / Flux' },
    { id: 'part4', icon: '🚀', title: '第 4 部分综合测验', desc: 'Ch14 · 打包部署 / 优雅停机' },
    { id: 'final', icon: '🎓', title: '全书综合测评', desc: '跨章节挑战所有核心机制' }
  ];

  let _panel = null;
  let _currentTab = 'tests';

  function _ensurePanel() {
    if (_panel) return _panel;
    _panel = document.createElement('aside');
    _panel.className = 'quiz-center-panel';
    _panel.innerHTML = `
      <div class="quiz-center-head">
        <h3>🏆 测验中心</h3>
        <button class="btn btn--ghost btn--sm" id="qc-close">✕</button>
      </div>
      <nav class="quiz-center-tabs">
        <button class="quiz-center-tab active" data-tab="tests">测验</button>
        <button class="quiz-center-tab" data-tab="wrongs">错题</button>
        <button class="quiz-center-tab" data-tab="achievements">成就</button>
        <button class="quiz-center-tab" data-tab="graph">图谱</button>
        <button class="quiz-center-tab" data-tab="notes">笔记</button>
      </nav>
      <div class="quiz-center-body" id="qc-body"></div>
    `;
    document.body.appendChild(_panel);

    _panel.querySelector('#qc-close').addEventListener('click', close);
    _panel.querySelectorAll('.quiz-center-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        _panel.querySelectorAll('.quiz-center-tab').forEach(b => b.classList.toggle('active', b === btn));
        _currentTab = btn.dataset.tab;
        _renderTab();
      });
    });

    document.addEventListener('quiz:answered', () => {
      if (_panel.classList.contains('open') && _currentTab === 'wrongs') _renderTab();
    });
    document.addEventListener('achievement:unlocked', () => {
      if (_panel.classList.contains('open') && _currentTab === 'achievements') _renderTab();
    });
    document.addEventListener('notes:changed', () => {
      if (_panel.classList.contains('open') && _currentTab === 'notes') _renderTab();
    });
    return _panel;
  }

  function open() {
    _ensurePanel();
    _panel.classList.add('open');
    _renderTab();
  }

  function close() {
    if (_panel) _panel.classList.remove('open');
  }

  function toggle() {
    _ensurePanel();
    if (_panel.classList.contains('open')) close(); else open();
  }

  function _renderTab() {
    const body = _panel.querySelector('#qc-body');
    if (_currentTab === 'tests') _renderTests(body);
    else if (_currentTab === 'wrongs') _renderWrongs(body);
    else if (_currentTab === 'achievements') _renderAchievements(body);
    else if (_currentTab === 'graph') _renderGraphTab(body);
    else if (_currentTab === 'notes') _renderNotesTab(body);
  }

  function _renderGraphTab(body) {
    body.innerHTML = `
      <div class="test-card" data-action="open-graph">
        <span class="test-card-icon">🧠</span>
        <div>
          <div class="test-card-title">打开知识图谱</div>
          <div class="test-card-desc">力导向图展示 50+ 概念及它们之间的依赖关系</div>
        </div>
        <span class="test-card-meta">→</span>
      </div>
      <p style="color:var(--color-text-muted);font-size:0.82rem;margin-top:1rem;line-height:1.6;">
        提示：图谱中可拖拽节点、滚轮缩放、章节过滤；点击节点可跳转到对应章节。
      </p>
    `;
    body.querySelector('[data-action="open-graph"]').addEventListener('click', async () => {
      close();
      const main = document.getElementById('main-content');
      if (main && typeof KnowledgeGraph !== 'undefined') {
        const toc = document.getElementById('toc-nav');
        if (toc) toc.innerHTML = '<div style="padding:1rem;color:var(--color-text-muted);font-size:0.85rem;">知识图谱模式</div>';
        await KnowledgeGraph.open(main);
        window.scrollTo({ top: 0, behavior: 'instant' });
        history.pushState({ view: 'graph' }, '', '#graph');
      }
    });
  }

  function _renderNotesTab(body) {
    if (typeof Notes === 'undefined') {
      body.innerHTML = '<div class="wrong-empty">笔记模块未加载</div>';
      return;
    }
    const all = Notes.listAll();
    if (all.length === 0) {
      body.innerHTML = `
        <div class="wrong-empty">
          📝 暂无笔记<br><br>
          <span style="font-size:0.82rem;">在章节正文中选中文本即可弹出工具栏，标记三色高亮或添加笔记。</span>
        </div>
      `;
      return;
    }
    body.innerHTML = `
      <div style="margin-bottom:0.85rem;font-size:0.82rem;color:var(--color-text-muted);">
        共 ${all.length} 条 · 点击文本跳到对应章节 · 点击 ✕ 删除
      </div>
      <div>
        ${all.map(n => `
          <div class="note-item note-item-${n.color}" data-note-id="${n.id}" data-chapter="${n.chapterId}">
            <div class="note-item-text">"${_escapeHtml(n.text)}"</div>
            ${n.note ? `<div class="note-item-note">📝 ${_escapeHtml(n.note)}</div>` : ''}
            <div class="note-item-meta">
              <span>${_chapterLabel(n.chapterId)}</span>
              <span>·</span>
              <span>${new Date(n.at).toLocaleString('zh-CN')}</span>
              <button class="btn btn--ghost btn--sm" style="margin-left:auto;padding:0 0.4rem;" data-act="del">✕</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    body.querySelectorAll('.note-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (e.target.dataset.act === 'del') {
          Notes.remove(item.dataset.chapter, item.dataset.noteId);
          _renderNotesTab(body);
          return;
        }
        document.dispatchEvent(new CustomEvent('navigate', { detail: { id: item.dataset.chapter } }));
        close();
      });
    });
  }

  function _renderTests(body) {
    const answers = Storage.get('quiz_answers', {});
    body.innerHTML = TESTS.map(t => {
      const answered = Object.values(answers).filter(a => a.chapterId === t.id).length;
      return `
        <div class="test-card" data-test="${t.id}">
          <span class="test-card-icon">${t.icon}</span>
          <div>
            <div class="test-card-title">${t.title}</div>
            <div class="test-card-desc">${t.desc}</div>
          </div>
          <span class="test-card-meta">${answered > 0 ? `已答 ${answered}` : '未开始'}</span>
        </div>
      `;
    }).join('');
    body.querySelectorAll('.test-card').forEach(card => {
      card.addEventListener('click', () => {
        const testId = card.dataset.test;
        _openTest(testId);
      });
    });
  }

  async function _openTest(testId) {
    close();
    const main = document.getElementById('main-content');
    if (!main) return;
    // 隐藏侧栏中"本章目录"内容
    const toc = document.getElementById('toc-nav');
    if (toc) toc.innerHTML = '<div style="padding:1rem;color:var(--color-text-muted);font-size:0.85rem;">综合测验进行中</div>';

    main.innerHTML = '<div class="quiz-loading">加载题库...</div>';
    await Quiz.renderTest(testId, main);
    window.scrollTo({ top: 0, behavior: 'instant' });
    // 注册到 hash 以便回退
    history.pushState({ test: testId }, '', `#test-${testId}`);
  }

  function _renderWrongs(body) {
    const wrongs = Quiz.getWrongAnswers();
    if (wrongs.length === 0) {
      body.innerHTML = '<div class="wrong-empty">🎉 暂无错题。继续保持！</div>';
      return;
    }

    // 按章节分组
    const chapterFilter = body.querySelector('#wrong-filter')?.value || '';
    const filtered = chapterFilter ? wrongs.filter(w => w.chapterId === chapterFilter) : wrongs;
    const chapterIds = [...new Set(wrongs.map(w => w.chapterId).filter(Boolean))].sort();

    body.innerHTML = `
      <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.85rem;">
        <select id="wrong-filter" style="flex:1;padding:0.4rem 0.6rem;border-radius:6px;border:1px solid var(--color-border);background:var(--color-bg);color:var(--color-text);">
          <option value="">全部章节 (${wrongs.length})</option>
          ${chapterIds.map(c => `<option value="${c}" ${c === chapterFilter ? 'selected' : ''}>${_chapterLabel(c)} (${wrongs.filter(w => w.chapterId === c).length})</option>`).join('')}
        </select>
        <button class="btn btn--ghost btn--sm" id="wrong-clear" style="white-space:nowrap;">清空</button>
      </div>
      <div id="wrong-list">
        ${filtered.map(w => `
          <div class="wrong-item">
            <div class="wrong-item-q">${_escapeHtml(w.q || '(题目数据丢失)')}</div>
            <div class="wrong-item-meta">
              <span>${_chapterLabel(w.chapterId)}</span>
              <span>·</span>
              <span>${new Date(w.at).toLocaleString('zh-CN')}</span>
              <span style="margin-left:auto;font-family:monospace;">#${w.qid}</span>
            </div>
            <div class="wrong-item-correct">✓ 正确答案：${_formatCorrect(w)}</div>
          </div>
        `).join('')}
      </div>
    `;

    body.querySelector('#wrong-filter')?.addEventListener('change', () => _renderWrongs(body));
    body.querySelector('#wrong-clear')?.addEventListener('click', () => {
      if (confirm('确定清空错题本（仅删除错误答题记录）？')) {
        const all = Storage.get('quiz_answers', {});
        Object.keys(all).forEach(k => { if (all[k].correct === false) delete all[k]; });
        Storage.set('quiz_answers', all);
        _renderWrongs(body);
      }
    });
  }

  function _formatCorrect(w) {
    if (!w.correctAnswer) return '(未知)';
    if (w.type === 'fill-blank' && w.blanks) {
      return w.blanks.map((b, i) => `${i + 1}.<code>${_escapeHtml(b.answer)}</code>`).join(' ');
    }
    return _escapeHtml(w.correctAnswer.join('、'));
  }

  function _chapterLabel(id) {
    if (!id) return '未分类';
    if (id.startsWith('part')) return `第 ${id.slice(4)} 部分`;
    if (id === 'final') return '全书测评';
    const ch = (typeof CONFIG !== 'undefined') ? CONFIG.getChapter(id) : null;
    return ch ? ch.title : `Ch${id}`;
  }

  async function _renderAchievements(body) {
    const all = await Achievement.getAll();
    const streak = Achievement.getStreak();
    const unlockedCount = all.filter(a => a.unlocked).length;
    body.innerHTML = `
      <div style="margin-bottom:1rem;padding:0.75rem 0.9rem;background:var(--color-bg);border-radius:8px;font-size:0.85rem;">
        <div><b>解锁进度</b> ${unlockedCount} / ${all.length}</div>
        <div style="color:var(--color-text-muted);margin-top:0.25rem;">
          连续学习 ${streak.count || 0} 天（最长 ${streak.longest || 0} 天）
        </div>
      </div>
      <div class="achievement-grid">
        ${all.map(a => `
          <div class="achievement-item ${a.unlocked ? 'unlocked' : ''}" title="${a.condition}">
            <div class="achievement-badge">${a.badge}</div>
            <div class="achievement-name">${a.name}</div>
            <div class="achievement-cond">${a.condition}</div>
            ${a.unlocked ? `<span class="achievement-time">${new Date(a.unlockedAt).toLocaleDateString('zh-CN')}</span>` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  function _escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  return Object.freeze({ open, close, toggle });
})();
