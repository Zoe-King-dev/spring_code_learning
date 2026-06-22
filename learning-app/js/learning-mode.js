/**
 * learning-mode.js — 阅读/学习模式切换
 *
 * 顶部 [阅读｜学习] tab 的行为控制。当前学习模式的差异化能力
 * 仍在规划中（见 PRD V2.0 C-307），切换"学习"时只做最小反馈：
 *   1) 重渲染当前内容中未渲染的 .mermaid 块
 *   2) 弹 toast 提示"学习模式尚在开发中"
 *
 * 依赖：全局 #toast 元素（index.html:514）
 */
const LearningMode = {
  currentMode: 'read',

  init() {
    const toggle = document.getElementById('mode-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', (e) => {
      const btn = e.target.closest('.mode-btn');
      if (btn) this.setMode(btn.dataset.mode);
    });
  },

  setMode(mode) {
    this.currentMode = mode;
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === mode);
    });

    if (mode === 'learn') {
      this.enhanceContent();
      this._showDevHint();
    }
  },

  // 学习模式尚在开发中；这里给用户一个明确反馈，避免按钮看似"无响应"
  _showDevHint() {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = '学习模式尚在开发中，当前与阅读模式相同';
    toast.classList.add('show');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
  },

  enhanceContent() {
    // 为内容添加交互元素
    const content = document.getElementById('main-content');
    if (!content) return;

    // 渲染未渲染的 Mermaid 图表
    content.querySelectorAll('.mermaid:not([data-rendered])').forEach(async (el) => {
      el.setAttribute('data-rendered', 'true');
      try {
        const id = 'mermaid-' + Math.random().toString(36).substr(2, 9);
        const { svg } = await mermaid.render(id, el.textContent);
        el.innerHTML = svg;
      } catch (e) {
        console.error('Mermaid error:', e);
      }
    });
  }
};
