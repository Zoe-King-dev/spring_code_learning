/**
 * source-refs.js — 源码路径追踪标签 (Phase 3)
 * 数据: data/source-refs.json
 * 入口: 章节正文末尾注入"📎 源码位置"折叠卡片
 */
const SourceRefs = (() => {
  let _data = null;

  async function _load() {
    if (_data) return _data;
    try {
      const res = await fetch('data/source-refs.json');
      _data = await res.json();
      return _data;
    } catch (e) {
      _data = { refs: {} };
      return _data;
    }
  }

  function _buildUrl(data, ref) {
    if (ref.repo === 'external' || /^https?:/.test(ref.path)) return ref.path;
    const base = ref.repo === 'framework' ? data.frameworkBase : data.githubBase;
    return `${base}/${ref.path}`;
  }

  async function injectFor(chapterId, mainContainer) {
    if (!mainContainer) return;
    const data = await _load();
    const refs = data.refs?.[chapterId];
    if (!refs || refs.length === 0) return;

    const old = mainContainer.querySelector('.srcref-section');
    if (old) old.remove();

    const section = document.createElement('section');
    section.className = 'srcref-section';
    section.innerHTML = `
      <h2 class="srcref-title">📎 关键源码位置</h2>
      <p class="srcref-desc">直接跳转到 GitHub 上的对应源码。点击外链在新窗口打开。</p>
      <ul class="srcref-list">
        ${refs.map(r => `
          <li class="srcref-item">
            <a class="srcref-link" target="_blank" rel="noopener" href="${_buildUrl(data, r)}">
              <span class="srcref-icon">📎</span>
              <span class="srcref-label">${r.label}</span>
              <span class="srcref-repo srcref-repo-${r.repo}">${_repoLabel(r.repo)}</span>
            </a>
            <code class="srcref-path">${_shortenPath(r.path)}</code>
          </li>
        `).join('')}
      </ul>
    `;
    mainContainer.appendChild(section);
  }

  function _repoLabel(repo) {
    return { boot: 'spring-boot', framework: 'spring-framework', external: '外部' }[repo] || repo;
  }

  function _shortenPath(p) {
    if (/^https?:/.test(p)) return p.replace(/^https?:\/\/github\.com\//, '');
    // 保留最后 3 段
    const parts = p.split('/');
    return parts.length > 4 ? '.../' + parts.slice(-3).join('/') : p;
  }

  return Object.freeze({ injectFor });
})();
