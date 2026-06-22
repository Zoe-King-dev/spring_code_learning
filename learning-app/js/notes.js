/**
 * notes.js — 笔记与高亮系统 (Phase 3)
 * 持久化: sbl_notes = { [chapterId]: [ { id, text, color, note, at } ] }
 * 颜色: yellow(重点) / green(已掌握) / red(疑问)
 * 工作流:
 *   1. 用户在 #main-content 选中文本 → 弹浮动工具栏
 *   2. 选三种颜色或"添加笔记"
 *   3. 高亮持久化到 localStorage
 *   4. 切章重新渲染时把保存的高亮再贴回去（基于文本匹配）
 */
const Notes = (() => {
  const COLORS = ['yellow', 'green', 'red'];
  let _toolbar = null;
  let _currentChapter = null;

  function _getAll() {
    return Storage.get('notes', {});
  }

  function _getChapter(id) {
    return _getAll()[id] || [];
  }

  function _saveChapter(id, list) {
    const all = _getAll();
    all[id] = list;
    Storage.set('notes', all);
    document.dispatchEvent(new CustomEvent('notes:changed', { detail: { chapterId: id } }));
  }

  function init() {
    _toolbar = document.createElement('div');
    _toolbar.className = 'notes-toolbar';
    _toolbar.hidden = true;
    _toolbar.innerHTML = `
      ${COLORS.map(c => `<button class="notes-color notes-color-${c}" data-color="${c}" title="${_colorTitle(c)}"></button>`).join('')}
      <button class="notes-tool-btn" data-action="note" title="添加笔记">📝</button>
    `;
    document.body.appendChild(_toolbar);

    _toolbar.addEventListener('mousedown', (e) => e.preventDefault()); // 防止失去选区
    _toolbar.addEventListener('click', _onToolbarClick);

    document.addEventListener('mouseup', _onMouseUp);
    document.addEventListener('mousedown', (e) => {
      if (!_toolbar.contains(e.target)) _hideToolbar();
    });
    document.addEventListener('scroll', _hideToolbar, true);
  }

  function _colorTitle(c) {
    return { yellow: '黄 · 重点', green: '绿 · 已掌握', red: '红 · 疑问' }[c];
  }

  function _onMouseUp() {
    setTimeout(() => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) { _hideToolbar(); return; }
      const text = sel.toString().trim();
      if (text.length < 2 || text.length > 500) { _hideToolbar(); return; }
      const range = sel.getRangeAt(0);
      const main = document.getElementById('main-content');
      if (!main || !main.contains(range.commonAncestorContainer)) { _hideToolbar(); return; }
      const rect = range.getBoundingClientRect();
      _showToolbar(rect, text);
    }, 10);
  }

  function _showToolbar(rect, text) {
    _toolbar.dataset.text = text;
    _toolbar.hidden = false;
    const t = _toolbar;
    const top = window.scrollY + rect.top - t.offsetHeight - 10;
    const left = window.scrollX + rect.left + (rect.width / 2) - (t.offsetWidth / 2);
    t.style.top = Math.max(8, top) + 'px';
    t.style.left = Math.max(8, left) + 'px';
  }

  function _hideToolbar() {
    if (_toolbar) _toolbar.hidden = true;
  }

  function _onToolbarClick(e) {
    const btn = e.target.closest('button');
    if (!btn) return;
    const text = _toolbar.dataset.text;
    if (!text) return;
    if (btn.dataset.color) {
      _addHighlight(text, btn.dataset.color, '');
    } else if (btn.dataset.action === 'note') {
      const note = prompt('添加笔记内容：', '');
      if (note !== null) _addHighlight(text, 'yellow', note);
    }
    _hideToolbar();
    window.getSelection()?.removeAllRanges();
  }

  function _addHighlight(text, color, note) {
    if (!_currentChapter) return;
    const list = _getChapter(_currentChapter);
    list.push({
      id: 'n-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
      text, color, note, at: Date.now()
    });
    _saveChapter(_currentChapter, list);
    applyAll(_currentChapter, document.getElementById('main-content'));
    if (typeof UI !== 'undefined' && UI.showToast) UI.showToast(note ? '已添加笔记 📝' : '已高亮');
  }

  /** 给当前章节贴回所有高亮（基于文本匹配） */
  function applyAll(chapterId, container) {
    if (!container) return;
    _currentChapter = chapterId;
    const list = _getChapter(chapterId);
    if (list.length === 0) return;

    // 先移除旧 mark
    container.querySelectorAll('mark.notes-hl').forEach(m => {
      const parent = m.parentNode;
      parent.replaceChild(document.createTextNode(m.textContent), m);
      parent.normalize();
    });

    list.forEach(entry => _wrapText(container, entry));
  }

  function _wrapText(container, entry) {
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue || node.nodeValue.indexOf(entry.text) === -1) return NodeFilter.FILTER_REJECT;
        const p = node.parentElement;
        if (!p) return NodeFilter.FILTER_REJECT;
        if (p.closest('.notes-toolbar, script, style, pre, code, mark.notes-hl')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const target = walker.nextNode();
    if (!target) return;
    const idx = target.nodeValue.indexOf(entry.text);
    if (idx === -1) return;

    const before = target.nodeValue.slice(0, idx);
    const mid = target.nodeValue.slice(idx, idx + entry.text.length);
    const after = target.nodeValue.slice(idx + entry.text.length);

    const mark = document.createElement('mark');
    mark.className = `notes-hl notes-hl-${entry.color}`;
    mark.dataset.noteId = entry.id;
    if (entry.note) mark.title = entry.note;
    mark.textContent = mid;
    mark.addEventListener('click', () => _onMarkClick(entry));

    const frag = document.createDocumentFragment();
    if (before) frag.appendChild(document.createTextNode(before));
    frag.appendChild(mark);
    if (after) frag.appendChild(document.createTextNode(after));
    target.parentNode.replaceChild(frag, target);
  }

  function _onMarkClick(entry) {
    const action = entry.note
      ? confirm(`📝 笔记：\n\n${entry.note}\n\n点击"确定"删除此高亮；"取消"保留。`)
      : confirm('删除此高亮？');
    if (!action) return;
    const list = _getChapter(_currentChapter).filter(n => n.id !== entry.id);
    _saveChapter(_currentChapter, list);
    applyAll(_currentChapter, document.getElementById('main-content'));
  }

  /** 列出全部笔记（用于测验中心面板） */
  function listAll() {
    const all = _getAll();
    const flat = [];
    Object.entries(all).forEach(([cid, list]) => {
      list.forEach(n => flat.push({ ...n, chapterId: cid }));
    });
    return flat.sort((a, b) => b.at - a.at);
  }

  function remove(chapterId, noteId) {
    const list = _getChapter(chapterId).filter(n => n.id !== noteId);
    _saveChapter(chapterId, list);
    if (_currentChapter === chapterId) {
      applyAll(chapterId, document.getElementById('main-content'));
    }
  }

  return Object.freeze({ init, applyAll, listAll, remove });
})();
