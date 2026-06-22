/**
 * learning-path.js — 学习路径推荐 (Phase 3)
 * 数据: data/learning-paths.json
 * 持久化: sbl_path_id = 当前选中的路径 id
 * 入口: renderHomeSection(container) 由 app.js 在首页注入
 */
const LearningPath = (() => {
  let _paths = null;

  async function _load() {
    if (_paths) return _paths;
    try {
      const res = await fetch('data/learning-paths.json');
      const data = await res.json();
      _paths = data.paths || [];
      return _paths;
    } catch (e) {
      _paths = [];
      return _paths;
    }
  }

  function getCurrentPathId() {
    return Storage.get('path_id', 'standard');
  }

  function setCurrentPathId(id) {
    Storage.set('path_id', id);
    document.dispatchEvent(new CustomEvent('path:changed', { detail: { id } }));
  }

  async function getCurrentPath() {
    const paths = await _load();
    const id = getCurrentPathId();
    return paths.find(p => p.id === id) || paths[0];
  }

  /** 根据已读章节推断当前路径下一章 */
  async function getNextChapter() {
    const path = await getCurrentPath();
    if (!path) return null;
    const read = new Set(Storage.get('progress', []));
    return path.chapters.find(c => !read.has(c)) || null;
  }

  /** 完成度（按当前路径分母） */
  async function getProgress() {
    const path = await getCurrentPath();
    if (!path) return { done: 0, total: 0, pct: 0 };
    const read = new Set(Storage.get('progress', []));
    const done = path.chapters.filter(c => read.has(c)).length;
    return {
      done,
      total: path.chapters.length,
      pct: path.chapters.length > 0 ? Math.round((done / path.chapters.length) * 100) : 0
    };
  }

  async function renderHomeSection(container) {
    if (!container) return;
    const paths = await _load();
    if (paths.length === 0) return;
    const current = await getCurrentPath();
    const progress = await getProgress();
    const next = await getNextChapter();
    const nextCh = next ? (typeof CONFIG !== 'undefined' ? CONFIG.getChapter(next) : null) : null;

    const html = `
      <section class="lp-section">
        <div class="lp-head">
          <h2>🛤️ 学习路径</h2>
          <p>选择适合你的学习路径，应用会按路径推荐下一章。</p>
        </div>
        <div class="lp-grid">
          ${paths.map(p => `
            <div class="lp-card ${p.id === current.id ? 'lp-card-active' : ''}" data-path="${p.id}">
              <div class="lp-card-icon">${p.icon}</div>
              <div class="lp-card-title">${p.name}</div>
              <div class="lp-card-desc">${p.description}</div>
              <div class="lp-card-meta">
                <span>📚 ${p.chapters.length} 章</span>
                <span>⏱ 预计 ${p.estimatedDays} 天</span>
              </div>
              <div class="lp-card-audience">适合：${p.audience}</div>
            </div>
          `).join('')}
        </div>
        <div class="lp-current">
          <div class="lp-current-info">
            <div class="lp-current-title">当前路径：${current.icon} ${current.name}</div>
            <div class="lp-current-progress">
              <div class="lp-progress-bar"><div class="lp-progress-fill" style="width:${progress.pct}%"></div></div>
              <span>${progress.done} / ${progress.total} · ${progress.pct}%</span>
            </div>
          </div>
          ${nextCh ? `
            <button class="lp-next-btn" data-go="${nextCh.id}">
              <span class="lp-next-label">推荐下一章</span>
              <span class="lp-next-title">${nextCh.title} →</span>
            </button>
          ` : `<div class="lp-done">🎉 该路径已全部完成</div>`}
        </div>
      </section>
    `;
    container.insertAdjacentHTML('beforeend', html);

    container.querySelectorAll('.lp-card').forEach(card => {
      card.addEventListener('click', () => {
        setCurrentPathId(card.dataset.path);
        // 重渲染整段
        container.querySelector('.lp-section')?.remove();
        renderHomeSection(container);
      });
    });
    const nextBtn = container.querySelector('.lp-next-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        document.dispatchEvent(new CustomEvent('navigate', { detail: { id: nextBtn.dataset.go } }));
      });
    }
  }

  return Object.freeze({
    getCurrentPathId, setCurrentPathId, getCurrentPath,
    getNextChapter, getProgress, renderHomeSection
  });
})();
