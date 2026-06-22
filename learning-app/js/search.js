/**
 * search.js — 搜索模块
 * 后台构建全文索引，支持跨章节关键词搜索。
 * 依赖：config.js, renderer.js
 */
const Search = (() => {
  // 索引结构：{ id, title, text }[]
  let index = null;
  let indexing = false;
  let indexPromise = null;

  /** 构建全文索引（后台异步） */
  async function buildIndex(progressCb) {
    if (index) return index;
    if (indexing) return indexPromise;

    indexing = true;
    indexPromise = (async () => {
      const chapters = CONFIG.CHAPTERS.filter(ch => !ch.id.startsWith('00'));
      const result = [];
      let done = 0;

      for (const ch of chapters) {
        try {
          const url = CONFIG.CONTENT_BASE + '/' + ch.file;
          const resp = await fetch(url);
          if (resp.ok) {
            const raw = await resp.text();
            const text = Renderer.stripMarkdown(raw);
            result.push({ id: ch.id, title: ch.title, text });
          }
        } catch { /* skip unavailable */ }
        done++;
        if (progressCb) progressCb(done, chapters.length);
      }

      index = result;
      indexing = false;
      return result;
    })();

    return indexPromise;
  }

  /** 执行搜索 */
  function search(query) {
    if (!index || query.trim().length < 2) return [];

    const q = query.toLowerCase().trim();
    const results = [];

    for (const entry of index) {
      const textLower = entry.text.toLowerCase();
      let pos = 0;
      while ((pos = textLower.indexOf(q, pos)) !== -1) {
        // 提取上下文
        const start = Math.max(0, pos - 30);
        const end = Math.min(entry.text.length, pos + q.length + 50);
        let excerpt = entry.text.slice(start, end).replace(/\s+/g, ' ');
        // 高亮关键词
        const hlRegex = new RegExp(`(${escapeRegex(q)})`, 'gi');
        excerpt = excerpt.replace(hlRegex, '<mark>$1</mark>');

        results.push({
          id: entry.id,
          title: entry.title,
          excerpt: (start > 0 ? '…' : '') + excerpt + (end < entry.text.length ? '…' : ''),
          pos,
        });
        pos += q.length;

        if (results.length >= 20) break; // 最多 20 条
      }
      if (results.length >= 20) break;
    }

    return results;
  }

  function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function isReady() {
    return index !== null;
  }

  return Object.freeze({ buildIndex, search, isReady });
})();
