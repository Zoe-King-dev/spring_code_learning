/**
 * storage.js — 数据持久层
 * 封装 localStorage 读写，提供类型安全的存取 API。
 * 无依赖。
 */
const Storage = (() => {
  const PREFIX = 'sbl_';

  function safeParse(json, fallback) {
    try { return JSON.parse(json); } catch { return fallback; }
  }

  return {
    get(key, fallback = null) {
      const raw = localStorage.getItem(PREFIX + key);
      if (raw === null) return fallback;
      return safeParse(raw, fallback);
    },

    set(key, value) {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    },

    remove(key) {
      localStorage.removeItem(PREFIX + key);
    },

    /** 标记章节为已完成 */
    markComplete(chapterId) {
      const set = new Set(this.get('progress', []));
      set.add(chapterId);
      this.set('progress', [...set]);
    },

    /** 取消章节完成标记 */
    unmarkComplete(chapterId) {
      const set = new Set(this.get('progress', []));
      set.delete(chapterId);
      this.set('progress', [...set]);
    },

    /** 检查章节是否已完成 */
    isComplete(chapterId) {
      const set = new Set(this.get('progress', []));
      return set.has(chapterId);
    },

    /** 获取整体进度百分比 */
    getProgressPercent(total) {
      const done = this.get('progress', []).length;
      return total > 0 ? Math.round((done / total) * 100) : 0;
    },

    /** 书签操作 */
    addBookmark(chapterId, title) {
      const list = this.get('bookmarks', []);
      if (!list.some(b => b.id === chapterId)) {
        list.push({ id: chapterId, title, time: Date.now() });
        this.set('bookmarks', list);
      }
    },

    removeBookmark(chapterId) {
      const list = this.get('bookmarks', []);
      this.set('bookmarks', list.filter(b => b.id !== chapterId));
    },

    isBookmarked(chapterId) {
      return this.get('bookmarks', []).some(b => b.id === chapterId);
    },

    getBookmarks() {
      return this.get('bookmarks', []);
    },

    /** 主题偏好 */
    getTheme() {
      return this.get('theme', 'light');
    },

    setTheme(theme) {
      this.set('theme', theme);
    },

    /** 上次阅读位置 */
    setLastChapter(id) {
      this.set('lastChapter', id);
    },

    getLastChapter() {
      return this.get('lastChapter', null);
    },
  };
})();
