/**
 * diagrams.js — 章节图解加载器 (Phase 1)
 * 从 data/diagrams/index.json 读取每章图表清单，按需 fetch 对应 .mmd 文件，
 * 注入为 .mermaid 容器后调用 Renderer.renderMermaid 触发渲染。
 */
const Diagrams = (() => {
  let _manifest = null;
  const _fileCache = {};

  async function _loadManifest() {
    if (_manifest !== null) return _manifest;
    try {
      const res = await fetch('data/diagrams/index.json');
      if (!res.ok) { _manifest = {}; return _manifest; }
      _manifest = await res.json();
      return _manifest;
    } catch (e) {
      _manifest = {};
      return _manifest;
    }
  }

  async function _loadFile(filename) {
    if (_fileCache[filename] !== undefined) return _fileCache[filename];
    try {
      const res = await fetch(`data/diagrams/${filename}`);
      if (!res.ok) { _fileCache[filename] = null; return null; }
      const text = await res.text();
      _fileCache[filename] = text;
      return text;
    } catch (e) {
      _fileCache[filename] = null;
      return null;
    }
  }

  function _escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  async function injectFor(chapterId, mainContainer) {
    if (!mainContainer) return;
    const manifest = await _loadManifest();
    const items = manifest[chapterId];
    if (!items || items.length === 0) return;

    // 移除旧的图解区（章节切换时）
    const old = mainContainer.querySelector('.diagram-section');
    if (old) old.remove();

    // 加载所有 .mmd 文件
    const loaded = await Promise.all(items.map(async item => ({
      ...item,
      content: await _loadFile(item.file)
    })));

    const valid = loaded.filter(it => it.content);
    if (valid.length === 0) return;

    const section = document.createElement('section');
    section.className = 'diagram-section';
    section.innerHTML = `
      <h2 class="diagram-section-title">📊 本章图解</h2>
      <p class="diagram-section-desc">下方图表帮助你建立对核心概念的视觉化心智模型。</p>
      ${valid.map((it, idx) => `
        <div class="diagram-item">
          <div class="diagram-item-title">${idx + 1}. ${it.title || '图解'}</div>
          ${it.description ? `<div class="diagram-item-desc">${it.description}</div>` : ''}
          <div class="mermaid">${_escapeHtml(it.content)}</div>
        </div>
      `).join('')}
    `;
    mainContainer.appendChild(section);

    // 触发 mermaid 渲染（renderer.js 已提供）
    if (typeof Renderer !== 'undefined' && Renderer.renderMermaid) {
      await Renderer.renderMermaid(section);
    } else if (typeof mermaid !== 'undefined') {
      // fallback: 直接调用 mermaid API
      const blocks = section.querySelectorAll('.mermaid:not([data-rendered])');
      for (const block of blocks) {
        block.setAttribute('data-rendered', 'true');
        try {
          const id = 'mermaid-' + Math.random().toString(36).slice(2, 11);
          const { svg } = await mermaid.render(id, block.textContent.trim());
          block.innerHTML = svg;
        } catch (e) {
          block.innerHTML = `<div class="diagram-error">图表渲染失败: ${e.message}</div>`;
        }
      }
    }
  }

  return Object.freeze({ injectFor });
})();
