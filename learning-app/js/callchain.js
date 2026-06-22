/**
 * callchain.js — 步进式调用链 (Phase 3)
 * 数据: data/callchains/ch{id}.json
 * 入口: CallChain.injectFor(chapterId, mainContainer)
 */
const CallChain = (() => {
  const _cache = {};
  const _autoplayState = {};

  async function _load(chapterId) {
    if (_cache[chapterId] !== undefined) return _cache[chapterId];
    try {
      const res = await fetch(`data/callchains/ch${chapterId}.json`);
      if (!res.ok) { _cache[chapterId] = null; return null; }
      const data = await res.json();
      _cache[chapterId] = data;
      return data;
    } catch (e) {
      _cache[chapterId] = null;
      return null;
    }
  }

  function _escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  async function injectFor(chapterId, mainContainer) {
    if (!mainContainer) return;
    const data = await _load(chapterId);
    if (!data || !data.steps || data.steps.length === 0) return;

    const old = mainContainer.querySelector('.callchain-section');
    if (old) old.remove();

    const section = document.createElement('section');
    section.className = 'callchain-section';
    section.dataset.chapter = chapterId;
    section.innerHTML = _renderShell(data);
    mainContainer.appendChild(section);

    let idx = 0;
    _renderStep(section, data, idx);

    section.querySelector('.cc-prev').addEventListener('click', () => {
      idx = Math.max(0, idx - 1);
      _renderStep(section, data, idx);
    });
    section.querySelector('.cc-next').addEventListener('click', () => {
      idx = Math.min(data.steps.length - 1, idx + 1);
      _renderStep(section, data, idx);
    });
    section.querySelector('.cc-auto').addEventListener('click', () => {
      _toggleAutoplay(section, data, () => idx, (v) => { idx = v; });
    });
    // 点击底部步骤序号跳转
    section.querySelectorAll('.cc-dot').forEach((dot, i) => {
      dot.addEventListener('click', () => { idx = i; _renderStep(section, data, idx); });
    });
  }

  function _renderShell(data) {
    return `
      <h2 class="callchain-title">🔄 ${data.title}</h2>
      <p class="callchain-desc">${data.description || ''}</p>
      <div class="callchain-frame">
        <div class="cc-step-head">
          <span class="cc-step-counter" id="cc-counter">1 / ${data.steps.length}</span>
          <span class="cc-step-method" id="cc-method"></span>
        </div>
        <pre class="cc-code"><code id="cc-code"></code></pre>
        <div class="cc-step-note" id="cc-note"></div>
        <div class="cc-controls">
          <button class="quiz-btn quiz-reset cc-prev">◀ 上一步</button>
          <button class="quiz-btn cc-auto">▶▶ 自动播放</button>
          <button class="quiz-btn cc-next">下一步 ▶</button>
        </div>
        <div class="cc-dots">
          ${data.steps.map((s, i) => `<span class="cc-dot" data-i="${i}" title="${_escapeHtml(s.method)}"></span>`).join('')}
        </div>
      </div>
    `;
  }

  function _renderStep(section, data, idx) {
    const step = data.steps[idx];
    section.querySelector('#cc-counter').textContent = `${idx + 1} / ${data.steps.length}`;
    section.querySelector('#cc-method').textContent = step.method;
    const codeEl = section.querySelector('#cc-code');
    codeEl.innerHTML = _escapeHtml(step.code || '');
    if (typeof hljs !== 'undefined') {
      try { hljs.highlightElement(codeEl); } catch {}
    }
    section.querySelector('#cc-note').innerHTML = step.note || '';
    section.querySelectorAll('.cc-dot').forEach((d, i) => d.classList.toggle('cc-dot-active', i <= idx));
    section.querySelector('.cc-prev').disabled = idx === 0;
    section.querySelector('.cc-next').disabled = idx === data.steps.length - 1;
  }

  function _toggleAutoplay(section, data, getIdx, setIdx) {
    const btn = section.querySelector('.cc-auto');
    const key = section.dataset.chapter;
    if (_autoplayState[key]) {
      clearInterval(_autoplayState[key]);
      _autoplayState[key] = null;
      btn.textContent = '▶▶ 自动播放';
      return;
    }
    btn.textContent = '⏸ 暂停';
    _autoplayState[key] = setInterval(() => {
      const cur = getIdx();
      if (cur >= data.steps.length - 1) {
        clearInterval(_autoplayState[key]);
        _autoplayState[key] = null;
        btn.textContent = '▶▶ 自动播放';
        return;
      }
      setIdx(cur + 1);
      _renderStep(section, data, cur + 1);
    }, 2500);
  }

  return Object.freeze({ injectFor });
})();
