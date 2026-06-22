/**
 * renderer.js — 渲染引擎 (增强版)
 * 支持 Markdown 渲染、Mermaid 图表、代码高亮
 */
const Renderer = (() => {
  let hljsReady = false;
  let mermaidReady = false;

  function initMarked() {
    if (typeof marked === 'undefined') return false;
    if (typeof hljs !== 'undefined') hljsReady = true;
    if (typeof mermaid !== 'undefined') mermaidReady = true;

    marked.setOptions({ breaks: false, gfm: true });

    // 代码块渲染
    const origCode = marked.Renderer.prototype.code;
    marked.Renderer.prototype.code = function(code, lang, isEscaped) {
      // 支持 mermaid 图表
      if (lang === 'mermaid') {
        return `<div class="mermaid">${escapeHtml(code)}</div>`;
      }

      if (hljsReady && lang && hljs.getLanguage(lang)) {
        try {
          return `<pre><code class="hljs language-${lang}">${hljs.highlight(code, { language: lang }).value}</code></pre>`;
        } catch { /* fall through */ }
      }
      if (lang) {
        return `<pre><code class="language-${lang}">${escapeHtml(code)}</code></pre>`;
      }
      return origCode.call(this, code, lang, isEscaped);
    };

    // 表格渲染
    const origTable = marked.Renderer.prototype.table;
    marked.Renderer.prototype.table = function(header, body) {
      return '<div class="table-wrap">' + origTable.call(this, header, body) + '</div>';
    };

    // 链接渲染 - 新窗口打开
    const origLink = marked.Renderer.prototype.link;
    marked.Renderer.prototype.link = function(href, title, text) {
      const html = origLink.call(this, href, title, text);
      return html.replace(/<a /, '<a target="_blank" rel="noopener" ');
    };

    return true;
  }

  /** 从 markdown 文本中提取所有 ## / ### 标题 */
  function extractHeadings(mdText) {
    const headings = [];
    const lines = mdText.split('\n');
    for (const line of lines) {
      const m2 = line.match(/^##\s+(.+)/);
      if (m2) {
        headings.push({ level: 2, text: m2[1].trim(), id: slugify(m2[1].trim()) });
        continue;
      }
      const m3 = line.match(/^###\s+(.+)/);
      if (m3) {
        headings.push({ level: 3, text: m3[1].trim(), id: slugify(m3[1].trim()) });
      }
    }
    return headings;
  }

  /** 处理特殊的内容块 */
  function processSpecialBlocks(html) {
    // 为代码块添加复制按钮
    html = html.replace(/<pre><code class="(language-[^"]+)">/g, (match, lang) => {
      return `<pre class="code-with-copy"><button class="copy-btn" onclick="copyCode(this)">复制</button><code class="${lang}">`;
    });

    // 为表格添加响应式包装
    html = html.replace(/<table>/g, '<div class="table-responsive"><table>');
    html = html.replace(/<\/table>/g, '</table></div>');

    return html;
  }

  /** 为标题添加锚点 */
  function addHeadingAnchors(html) {
    // 处理 h2
    html = html.replace(/<h2>([^<]+)<\/h2>/g, (match, text) => {
      const id = slugify(text);
      return `<h2 id="${id}"><a href="#${id}" class="heading-anchor">#</a>${text}</h2>`;
    });

    // 处理 h3
    html = html.replace(/<h3>([^<]+)<\/h3>/g, (match, text) => {
      const id = slugify(text);
      return `<h3 id="${id}"><a href="#${id}" class="heading-anchor">#</a>${text}</h3>`;
    });

    return html;
  }

  /** 将 markdown 文本转为 HTML */
  function render(mdText) {
    if (!initMarked()) {
      return { html: `<pre>${escapeHtml(mdText)}</pre>`, headings: [] };
    }

    // 预处理：移除文件首行 H1
    const lines = mdText.split('\n');
    if (lines[0] && lines[0].startsWith('# ')) {
      lines.shift();
      while (lines[0] === '') lines.shift();
    }

    const body = lines.join('\n');

    // 提取标题信息
    const headings = extractHeadings(mdText);

    // 渲染
    let html = marked.parse(body);

    // 后处理
    html = processSpecialBlocks(html);
    html = addHeadingAnchors(html);

    return { html, headings };
  }

  /** 渲染 Mermaid 图表 */
  async function renderMermaid(container) {
    if (!mermaidReady) return;

    const mermaidBlocks = container.querySelectorAll('.mermaid:not([data-rendered]');
    for (const block of mermaidBlocks) {
      block.setAttribute('data-rendered', 'true');
      try {
        const code = block.textContent.trim();
        const id = 'mermaid-' + Math.random().toString(36).substr(2, 9);
        const { svg } = await mermaid.render(id, code);
        block.innerHTML = svg;
      } catch (e) {
        console.error('Mermaid render error:', e);
        block.innerHTML = `<div class="diagram-error">图表渲染失败: ${e.message}</div>`;
      }
    }
  }

  /** 提取纯文本（用于搜索索引） */
  function stripMarkdown(mdText) {
    let text = mdText.replace(/```[\s\S]*?```/g, ' ');
    text = text.replace(/`[^`]+`/g, ' ');
    text = text.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
    text = text.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ');
    text = text.replace(/^#{1,6}\s/gm, '');
    text = text.replace(/[*_~>|]/g, ' ');
    return text;
  }

  function slugify(text) {
    return text
      .replace(/[^\w一-龥]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 60)
      .toLowerCase();
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  return Object.freeze({
    render,
    renderMermaid,
    extractHeadings,
    stripMarkdown,
    slugify,
    escapeHtml
  });
})();

// 复制代码功能
function copyCode(btn) {
  const pre = btn.closest('pre');
  const code = pre.querySelector('code');
  const text = code.textContent;

  navigator.clipboard.writeText(text).then(() => {
    btn.textContent = '已复制!';
    setTimeout(() => { btn.textContent = '复制'; }, 2000);
  }).catch(() => {
    btn.textContent = '复制失败';
    setTimeout(() => { btn.textContent = '复制'; }, 2000);
  });
}
