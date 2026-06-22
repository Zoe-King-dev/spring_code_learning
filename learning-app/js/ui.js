/**
 * ui.js — UI 控制器
 * DOM 操作：路线图、章内 TOC、滚动监听、面板、搜索、主题。
 * 依赖：config.js, storage.js, Router, Search
 */
const UI = (() => {
  let dom = {};
  let scrollObserver = null;
  let currentChapterId = null;
  let currentHeadings = [];

  // ============ DOM 缓存 ============
  function cacheDom() {
    dom = {
      topbarLogo:     document.getElementById('topbar-logo'),
      // 路线图
      roadmap:        document.getElementById('roadmap'),
      roadmapInner:   document.getElementById('roadmap-inner'),
      roadmapToggle:  document.getElementById('roadmap-toggle'),
      // 阅读区
      tocSidebar:     document.getElementById('toc-sidebar'),
      tocNav:         document.getElementById('toc-nav'),
      tocProgress:    document.getElementById('toc-progress'),
      mainContent:    document.getElementById('main-content'),
      // 导航
      navPrev:        document.getElementById('nav-prev'),
      navNext:        document.getElementById('nav-next'),
      // 搜索
      searchInput:    document.getElementById('search-input'),
      searchPanel:    document.getElementById('search-panel'),
      // 面板
      bookmarkPanel:  document.getElementById('bookmark-panel'),
      bookmarkList:   document.getElementById('bookmark-list'),
      progressPanel:  document.getElementById('progress-panel'),
      progressDetail: document.getElementById('progress-detail'),
      // 按钮
      btnBookmarks:   document.getElementById('btn-bookmarks'),
      btnProgress:    document.getElementById('btn-progress-panel'),
      btnTheme:       document.getElementById('btn-theme'),
      backToTop:      document.getElementById('back-to-top'),
      toast:          document.getElementById('toast'),
    };
  }

  // ============ 路线图 ============
  function renderRoadmap(activeChapterId) {
    let html = '';
    for (const part of CONFIG.PARTS) {
      const partChs = CONFIG.getPartChapters(part.id);
      const allDone = partChs.every(ch => Storage.isComplete(ch.id));
      html += `<div class="part-card">`;
      html += `<div class="part-card-head" data-part="${part.id}">`;
      html += `<span class="part-icon">${part.icon}</span>`;
      html += `<span>${part.title}</span>`;
      html += `<span class="part-chevron">▾</span>`;
      html += `</div>`;
      html += `<div class="part-body">`;
      for (const ch of partChs) {
        const active = ch.id === activeChapterId ? ' active' : '';
        const done = Storage.isComplete(ch.id) ? ' completed' : '';
        const diff = ch.difficulty || '';
        html += `<div class="ch-card${active}${done}" data-chapter="${ch.id}">`;
        html += `<span class="ch-card-num">${ch.id.replace(/^00[a-b]/, '')}</span>`;
        html += `<span class="ch-card-title">${ch.title}</span>`;
        if (diff) html += `<span class="ch-card-badge ${CONFIG.difficultyClass(diff)}">${diff}</span>`;
        html += `<span class="ch-card-done">✓</span>`;
        html += `</div>`;
      }
      html += `</div></div>`;
    }
    dom.roadmapInner.innerHTML = html;

    // 事件绑定
    dom.roadmapInner.querySelectorAll('.part-card-head').forEach(head => {
      head.addEventListener('click', () => {
        head.closest('.part-card').classList.toggle('collapsed');
      });
    });
    dom.roadmapInner.querySelectorAll('.ch-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.chapter;
        if (id) emit('navigate', { id });
      });
    });
  }

  function toggleRoadmap() {
    const collapsed = dom.roadmap.classList.toggle('collapsed');
    dom.roadmapToggle.textContent = collapsed ? '▾ 展开路线图' : '▴ 收起路线图';
  }

  // ============ 章内 TOC ============
  function renderTOC(headings) {
    currentHeadings = headings;
    if (!headings || headings.length === 0) {
      dom.tocNav.innerHTML = '<div style="color:var(--color-text-muted);font-size:var(--fs-xs);padding:var(--space-sm) 0;">本章无小节</div>';
      dom.tocProgress.textContent = '';
      return;
    }
    dom.tocProgress.textContent = headings.length + ' 节';

    let html = '';
    for (const h of headings) {
      const cls = h.level === 3 ? ' toc-l3' : '';
      html += `<a href="#${h.id}" class="${cls}" data-id="${h.id}">${h.text}</a>`;
    }
    dom.tocNav.innerHTML = html;

    // 点击跳转
    dom.tocNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.getElementById(a.dataset.id);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          target.style.scrollMarginTop = '60px';
        }
      });
    });
  }

  function setupScrollSpy() {
    // 注销旧的 observer
    if (scrollObserver) scrollObserver.disconnect();

    // 收集内容区所有带 id 的标题
    const targets = [];
    dom.mainContent.querySelectorAll('h2[id], h3[id]').forEach(el => {
      targets.push(el);
    });

    if (targets.length === 0) return;

    scrollObserver = new IntersectionObserver(
      (entries) => {
        // 找到第一个"在视口上方或进入视口"的标题
        let activeId = null;
        for (const entry of entries) {
          if (entry.isIntersecting || entry.boundingClientRect.top < 100) {
            activeId = entry.target.id;
          }
        }
        if (activeId) highlightTOCItem(activeId);
      },
      { rootMargin: '-60px 0px -70% 0px', threshold: 0 }
    );

    targets.forEach(el => scrollObserver.observe(el));
  }

  function highlightTOCItem(id) {
    dom.tocNav.querySelectorAll('a').forEach(a => {
      a.classList.toggle('active', a.dataset.id === id);
    });
  }

  // ============ 章节渲染 ============
  function renderChapter(id, html, headings, title) {
    currentChapterId = id;

    // 更新标题
    document.title = title + ' — Spring Boot 源码学习';
    dom.topbarLogo.textContent = title;

    // 更新路线图
    renderRoadmap(id);

    // 更新章内 TOC
    renderTOC(headings);

    // 渲染正文
    dom.mainContent.innerHTML = html;
    dom.mainContent.scrollTop = 0;
    window.scrollTo({ top: 0, behavior: 'instant' });

    // 给内容区标题加 id
    dom.mainContent.querySelectorAll('h2, h3').forEach(h => {
      if (!h.id) {
        h.id = slugify(h.textContent);
      }
      h.style.scrollMarginTop = '60px';
    });

    // 代码高亮
    if (typeof hljs !== 'undefined') {
      dom.mainContent.querySelectorAll('pre code:not(.hljs)').forEach(block => {
        hljs.highlightElement(block);
      });
      dom.mainContent.querySelectorAll('pre code').forEach(block => {
        if (!block.parentElement.querySelector('.code-lang-tag')) {
          const lang = block.className.replace('hljs', '').replace('language-', '').trim();
          if (lang) {
            const tag = document.createElement('span');
            tag.className = 'code-lang-tag';
            tag.textContent = lang;
            block.parentElement.style.position = 'relative';
            block.parentElement.appendChild(tag);
          }
        }
      });
    }

    // 启动滚动监听
    setupScrollSpy();

    // 元信息栏
    renderMetaBar(id);

    // 底部导航
    renderNavButtons(id);
  }

  function renderMetaBar(id) {
    const ch = CONFIG.getChapter(id);
    const isMeta = id.startsWith('00');
    let meta = dom.mainContent.querySelector('.chapter-meta');
    if (!meta) {
      meta = document.createElement('div');
      meta.className = 'chapter-meta';
      dom.mainContent.prepend(meta);
    }

    if (isMeta) {
      meta.innerHTML = `<span style="color:var(--color-text-muted)">导航页</span>`;
    } else {
      const done = Storage.isComplete(id);
      meta.innerHTML = `
        <button class="mark-done-btn" data-done="${done}" id="mark-done-inline">
          ${done ? '✓ 已完成' : '○ 标记完成'}
        </button>
        <span style="font-size:var(--fs-sm);color:var(--color-text-muted)">难度：</span>
        <span class="ch-card-badge ${CONFIG.difficultyClass(ch.difficulty)}">${ch.difficulty}</span>
      `;
      const btn = meta.querySelector('#mark-done-inline');
      if (btn) btn.addEventListener('click', () => toggleComplete(id));
    }
  }

  function renderNavButtons(id) {
    const { prev, next } = CONFIG.getNeighbors(id);
    const setBtn = (btn, ch, label) => {
      if (ch) {
        btn.style.visibility = 'visible';
        btn.innerHTML = `<span class="nav-btn-label">${label}</span><span class="nav-btn-title">${ch.title}</span>`;
        btn.onclick = () => emit('navigate', { id: ch.id });
      } else {
        btn.style.visibility = 'hidden';
      }
    };
    setBtn(dom.navPrev, prev, '← 上一章');
    setBtn(dom.navNext, next, '下一章 →');
  }

  // ============ 进度 ============
  function toggleComplete(id) {
    if (Storage.isComplete(id)) {
      Storage.unmarkComplete(id);
    } else {
      Storage.markComplete(id);
      document.dispatchEvent(new CustomEvent('chapter:read', { detail: { id } }));
    }
    renderMetaBar(id);
    renderRoadmap(id);
    showToast(Storage.isComplete(id) ? '已标记完成 ✓' : '已取消标记');
  }

  function openProgressPanel() {
    const total = CONFIG.CHAPTERS.filter(ch => !ch.id.startsWith('00')).length;
    const doneCount = Storage.get('progress', []).length;
    const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;

    let html = `<div class="progress-overview">`;
    html += `<div class="progress-big-num">${pct}%</div>`;
    html += `<div style="color:var(--color-text-muted);font-size:var(--fs-sm);">${doneCount} / ${total} 章已完成</div>`;
    html += `<div class="progress-bar" style="margin-top:var(--space-sm);">`;
    html += `<div class="progress-bar__fill" style="width:${pct}%"></div></div>`;
    html += `</div>`;
    html += `<ul class="progress-ch-list">`;

    for (const ch of CONFIG.CHAPTERS) {
      if (ch.id.startsWith('00')) continue;
      const done = Storage.isComplete(ch.id);
      html += `<li class="progress-ch-item${done ? ' done' : ''}" data-chapter="${ch.id}">`;
      html += `<span class="ch-dot"></span>`;
      html += `<span class="ch-title">${ch.title}</span>`;
      html += `</li>`;
    }
    html += `</ul>`;

    dom.progressDetail.innerHTML = html;
    dom.progressPanel.classList.add('open');

    dom.progressDetail.querySelectorAll('.progress-ch-item').forEach(item => {
      item.addEventListener('click', () => {
        emit('navigate', { id: item.dataset.chapter });
        dom.progressPanel.classList.remove('open');
      });
    });
  }

  // ============ 书签 ============
  function openBookmarkPanel() {
    const bookmarks = Storage.getBookmarks();
    if (bookmarks.length === 0) {
      dom.bookmarkList.innerHTML = '<div class="bm-empty">暂无书签<br>阅读时按 B 键添加</div>';
    } else {
      dom.bookmarkList.innerHTML = bookmarks.map(b => `
        <div class="bm-item" data-chapter="${b.id}">
          <span>${b.title}</span>
          <button class="bm-remove" data-chapter="${b.id}">✕</button>
        </div>
      `).join('');
      dom.bookmarkList.querySelectorAll('.bm-item').forEach(el => {
        el.addEventListener('click', (e) => {
          if (e.target.classList.contains('bm-remove')) return;
          emit('navigate', { id: el.dataset.chapter });
          dom.bookmarkPanel.classList.remove('open');
        });
      });
      dom.bookmarkList.querySelectorAll('.bm-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          Storage.removeBookmark(btn.dataset.chapter);
          openBookmarkPanel();
        });
      });
    }
    dom.bookmarkPanel.classList.add('open');
  }

  function toggleBookmark(id) {
    if (!id) return;
    const ch = CONFIG.getChapter(id);
    if (!ch) return;
    if (Storage.isBookmarked(id)) {
      Storage.removeBookmark(id);
      showToast('已取消书签');
    } else {
      Storage.addBookmark(id, ch.title);
      showToast('已添加书签 🔖');
    }
  }

  // ============ 搜索 UI ============
  function showSearchResults(results, query) {
    if (!results || results.length === 0) {
      dom.searchPanel.innerHTML = `<div class="search-empty">未找到与 "${query}" 相关的内容</div>`;
    } else {
      dom.searchPanel.innerHTML = results.map(r => `
        <a class="search-result" href="#" data-chapter="${r.id}">
          <div class="sr-chapter">${r.title}</div>
          <div class="sr-excerpt">${r.excerpt}</div>
        </a>
      `).join('');
      dom.searchPanel.querySelectorAll('.search-result').forEach(el => {
        el.addEventListener('click', (e) => {
          e.preventDefault();
          dom.searchPanel.classList.remove('visible');
          dom.searchInput.value = '';
          emit('navigate', { id: el.dataset.chapter });
        });
      });
    }
    dom.searchPanel.classList.add('visible');
  }

  function hideSearchPanel() {
    dom.searchPanel.classList.remove('visible');
  }

  // ============ 主题 ============
  function initTheme() {
    const saved = Storage.getTheme();
    applyTheme(saved || 'light');
  }

  function toggleTheme() {
    const cur = document.documentElement.getAttribute('data-theme') || 'light';
    const next = cur === 'light' ? 'dark' : 'light';
    applyTheme(next);
    Storage.setTheme(next);
  }

  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    dom.btnTheme.textContent = t === 'dark' ? '☀️' : '🌙';
    dom.btnTheme.title = t === 'dark' ? '切换到浅色模式' : '切换到深色模式';
  }

  // ============ Toast ============
  let toastTimer;
  function showToast(msg) {
    dom.toast.textContent = msg;
    dom.toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => dom.toast.classList.remove('show'), 2000);
  }

  // ============ 状态方法 ============
  function setLoading(loading) {
    if (loading) {
      dom.mainContent.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;padding:var(--space-2xl);color:var(--color-text-muted);">加载中...</div>`;
    }
  }

  function setError(msg) {
    dom.mainContent.innerHTML = `<div class="callout callout--tip" style="margin-top:var(--space-xl);"><strong>加载失败</strong><br>${msg}<br><br>请确认 HTTP 服务运行在 spring_source_code_learning/ 目录下<br><code>cd spring_source_code_learning && python -m http.server 8080</code><br>然后访问 <code>http://localhost:8080/learning-app/</code></div>`;
  }

  // ============ 工具 ============
  function slugify(text) {
    return text.replace(/[^\w一-鿿]+/g, '-').replace(/^-|-$/g, '').slice(0, 60).toLowerCase();
  }

  function emit(name, detail) {
    document.dispatchEvent(new CustomEvent(name, { detail }));
  }

  // ============ 初始化 ============
  function init() {
    cacheDom();
    initTheme();

    // 路线图折叠
    dom.roadmapToggle.addEventListener('click', toggleRoadmap);

    // 主题
    dom.btnTheme.addEventListener('click', toggleTheme);

    // 书签面板
    dom.btnBookmarks.addEventListener('click', openBookmarkPanel);
    document.getElementById('bookmark-close').addEventListener('click', () => {
      dom.bookmarkPanel.classList.remove('open');
    });

    // 进度面板
    dom.btnProgress.addEventListener('click', openProgressPanel);
    document.getElementById('progress-close').addEventListener('click', () => {
      dom.progressPanel.classList.remove('open');
    });

    // 回到顶部
    dom.backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    window.addEventListener('scroll', () => {
      dom.backToTop.classList.toggle('visible', window.scrollY > 600);
    }, { passive: true });

    // 搜索
    let searchTimer;
    dom.searchInput.addEventListener('input', () => {
      clearTimeout(searchTimer);
      const q = dom.searchInput.value.trim();
      if (q.length < 2) { hideSearchPanel(); return; }
      searchTimer = setTimeout(() => {
        showSearchResults(Search.search(q), q);
      }, 250);
    });
    dom.searchInput.addEventListener('focus', () => {
      const q = dom.searchInput.value.trim();
      if (q.length >= 2) showSearchResults(Search.search(q), q);
    });

    // 全局点击：关闭面板
    document.addEventListener('click', (e) => {
      if (!dom.searchPanel.contains(e.target) && e.target !== dom.searchInput) {
        hideSearchPanel();
      }
      if (dom.bookmarkPanel.classList.contains('open') &&
          !dom.bookmarkPanel.contains(e.target) &&
          e.target !== dom.btnBookmarks) {
        dom.bookmarkPanel.classList.remove('open');
      }
      if (dom.progressPanel.classList.contains('open') &&
          !dom.progressPanel.contains(e.target) &&
          e.target !== dom.btnProgress) {
        dom.progressPanel.classList.remove('open');
      }
    });

    // 键盘快捷键
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      const id = currentChapterId;
      if (!id) return;

      switch (e.key) {
        case 'ArrowLeft':
          if (!e.metaKey && !e.ctrlKey) {
            const { prev } = CONFIG.getNeighbors(id);
            if (prev) emit('navigate', { id: prev.id });
          }
          break;
        case 'ArrowRight':
          if (!e.metaKey && !e.ctrlKey) {
            const { next } = CONFIG.getNeighbors(id);
            if (next) emit('navigate', { id: next.id });
          }
          break;
        case 'b':
          if (!e.metaKey && !e.ctrlKey) toggleBookmark(id);
          break;
        case 'Escape':
          dom.bookmarkPanel.classList.remove('open');
          dom.progressPanel.classList.remove('open');
          hideSearchPanel();
          break;
      }
    });

    renderRoadmap(null);
  }

  return Object.freeze({
    init,
    renderChapter,
    setLoading,
    setError,
    renderRoadmap,
  });
})();
