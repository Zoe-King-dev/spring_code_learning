/**
 * router.js — 路由控制
 * 根据章节 ID 加载 md 文件，管理导航栈与缓存。
 * 依赖：config.js, renderer.js
 */
const Router = (() => {
  let currentId = null;
  const cache = new Map(); // id -> { html, headings, raw, title }
  const MAX_CACHE = 5;

  function urlFor(id) {
    const ch = CONFIG.getChapter(id);
    if (!ch) return null;
    return CONFIG.CONTENT_BASE + '/' + ch.file;
  }

  async function loadChapter(id) {
    const ch = CONFIG.getChapter(id);
    if (!ch) throw new Error(`Unknown chapter: ${id}`);

    if (cache.has(id)) {
      currentId = id;
      return cache.get(id);
    }

    const url = urlFor(id);
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Failed to load: ${url} (${resp.status})`);
    const raw = await resp.text();
    const { html, headings } = Renderer.render(raw);

    const data = { html, headings, raw, title: ch.title };
    if (cache.size >= MAX_CACHE) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    cache.set(id, data);

    currentId = id;
    return data;
  }

  async function preloadNeighbors(id) {
    const { prev, next } = CONFIG.getNeighbors(id);
    const tasks = [];
    for (const ch of [prev, next]) {
      if (!ch || cache.has(ch.id)) continue;
      tasks.push(
        fetch(urlFor(ch.id))
          .then(r => r.text())
          .then(raw => {
            const { html, headings } = Renderer.render(raw);
            cache.set(ch.id, { html, headings, raw, title: ch.title });
          })
          .catch(() => {})
      );
    }
    await Promise.allSettled(tasks);
  }

  function getCurrentId() { return currentId; }
  function clearCache() { cache.clear(); }

  return Object.freeze({ loadChapter, preloadNeighbors, getCurrentId, clearCache });
})();
