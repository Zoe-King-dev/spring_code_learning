/**
 * app.js — 应用入口 (增强版)
 * 初始化所有模块，事件总线协调，支持首页和学习模式。
 * 依赖：所有其他模块
 */
const App = (() => {
  // ---- 路径自诊断 ----
  const CANDIDATE_BASES = ['../chapters', 'chapters', '/chapters'];

  async function detectChaptersBase() {
    const testFile = '00_前言与目录.md';
    for (const base of CANDIDATE_BASES) {
      try {
        const url = base + '/' + testFile;
        const resp = await fetch(url, { method: 'HEAD' });
        if (resp.ok) {
          CONFIG.CONTENT_BASE = base;
          return true;
        }
      } catch { /* try next */ }
    }
    return false;
  }

  function diagnosticHTML() {
    const pagePath = location.pathname;
    return `
      <div style="text-align:center;padding:var(--space-2xl);max-width:600px;margin:0 auto;">
        <h2 style="color:#c62828;">⚠ 无法访问章节文件</h2>
        <p style="margin:var(--space-lg) 0;color:var(--color-text-muted);text-align:left;">
          当前页面路径：<code>${pagePath}</code><br><br>
          <strong>请确认：</strong>
        </p>
        <ol style="text-align:left;color:var(--color-text-muted);line-height:2;">
          <li>HTTP 服务必须从 <code>spring_source_code_learning/</code> 目录启动（不是 learning-app/）</li>
          <li>命令：<br><code style="background:var(--color-code-bg);color:var(--color-code-text);padding:4px 8px;border-radius:4px;">cd spring_source_code_learning && python -m http.server 8080</code></li>
          <li>浏览器访问：<br><code style="background:var(--color-code-bg);color:var(--color-code-text);padding:4px 8px;border-radius:4px;">http://localhost:8080/learning-app/</code></li>
        </ol>
        <button onclick="location.reload()" class="mark-done-btn" data-done="false" style="margin-top:var(--space-lg);">
          🔄 重新检测
        </button>
      </div>`;
  }

  // ---- 首页渲染 ----
  function renderHomePage() {
    const main = document.getElementById('main-content');
    const chapterIntros = {
      '01': {
        icon: '🏠',
        description: '从整体层面了解 Spring Boot 与 Spring Framework 的关系，掌握 Spring Boot 的核心特性和技术体系。',
        keyPoints: ['Spring Framework 核心特性：IOC 与 AOP', 'Spring Boot 四大核心特性', '快速创建第一个 Spring Boot 项目'],
      },
      '02': {
        icon: '⚙️',
        description: '深入理解 Spring Boot 自动装配的核心机制，包括模块装配、条件装配和 SPI 机制。',
        keyPoints: ['组件装配：手动装配 vs 自动装配', '模块装配：@Import 与四种导入方式', '条件装配：@Conditional 与 @Profile', 'SPI 机制：SpringFactoriesLoader'],
      }
    };

    const chaptersHtml = CONFIG.CHAPTERS
      .filter(ch => ch.id === '01' || ch.id === '02')
      .map(ch => {
        const intro = chapterIntros[ch.id] || {};
        return `
          <div class="chapter-card" data-chapter="${ch.id}">
            <div class="card-icon">${intro.icon || '📚'}</div>
            <div class="card-title">${ch.title}</div>
            <div class="card-desc">${intro.description || ''}</div>
            ${intro.keyPoints ? `
              <ul style="margin: 1rem 0 0 0; padding-left: 1.2rem; font-size: 0.85rem; color: var(--color-text-muted);">
                ${intro.keyPoints.map(p => `<li>${p}</li>`).join('')}
              </ul>
            ` : ''}
            <div class="card-meta">
              <span class="difficulty-tag ${CONFIG.difficultyClass(ch.difficulty)}">${ch.difficulty}</span>
            </div>
          </div>
        `;
      }).join('');

    // 计算进度
    const total = CONFIG.CHAPTERS.filter(ch => !ch.id.startsWith('00')).length;
    const doneCount = Storage.get('progress', []).length;
    const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;

    main.innerHTML = `
      <div class="hero-section">
        <h1>🧭 Spring Boot 源码学习指南</h1>
        <p>通过源码深入理解 Spring Boot 的设计思想与实现原理</p>
      </div>

      <div class="progress-tracker">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <span style="font-weight: 600;">学习进度</span>
          <span style="color: var(--color-text-muted);">${doneCount} / ${total} 章</span>
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar" style="width: ${pct}%"></div>
        </div>
      </div>

      <h2 style="margin: 2rem 0 1rem;">📖 选择章节开始学习</h2>
      <p style="color: var(--color-text-muted); margin-bottom: 1rem;">
        点击下方卡片进入学习，每章都配有详细的图解说明和代码示例。
      </p>

      <div class="chapter-cards">
        ${chaptersHtml}
      </div>

      <h2 style="margin: 2rem 0 1rem;">🎯 学习目标</h2>
      <div class="comparison-grid">
        <div class="comparison-item">
          <h4>理解核心机制</h4>
          <p>深入理解 IOC 容器、自动装配、AOP 等核心机制的设计与实现</p>
        </div>
        <div class="comparison-item">
          <h4>掌握关键流程</h4>
          <p>掌握 Spring Boot 启动流程、容器刷新、组件加载的完整流程</p>
        </div>
        <div class="comparison-item">
          <h4>提升架构能力</h4>
          <p>通过源码学习，提升对复杂系统的架构设计和问题解决能力</p>
        </div>
      </div>

      <h2 style="margin: 2rem 0 1rem;">📚 章节内容</h2>
      <div class="comparison-grid">
        <div class="comparison-item">
          <h4>第1部分：底层依赖的核心容器</h4>
          <p>IOC容器、自动装配、AOP支持、核心引导 SpringApplication</p>
        </div>
        <div class="comparison-item">
          <h4>第2部分：生命周期原理分析</h4>
          <p>准备容器与环境、IOC容器刷新、嵌入式Web容器、AOP生命周期</p>
        </div>
        <div class="comparison-item">
          <h4>第3部分：整合常用开发场景</h4>
          <p>JDBC、MyBatis、WebMvc、WebFlux 整合</p>
        </div>
      </div>
    `;

    // 绑定章节点击事件
    main.querySelectorAll('.chapter-card').forEach(card => {
      card.addEventListener('click', () => {
        const chapterId = card.dataset.chapter;
        navigateTo(chapterId);
      });
    });

    // Phase 3: 在首页底部注入学习路径区
    if (typeof LearningPath !== 'undefined') {
      LearningPath.renderHomeSection(main).catch(e => console.error('LearningPath render failed:', e));
    }
  }

  // ---- 章节内容增强 ----
  function enhanceChapterContent(chapterId) {
    const main = document.getElementById('main-content');
    const introData = {
      '01': {
        icon: '🏠',
        title: 'Spring Boot 整体概述',
        description: '从整体层面了解 Spring Boot 与 Spring Framework 的关系，掌握 Spring Boot 的核心特性和技术体系。',
        keyPoints: [
          'Spring Framework 核心特性：IOC 与 AOP',
          'Spring Boot 四大核心特性',
          '快速创建第一个 Spring Boot 项目'
        ]
      },
      '02': {
        icon: '⚙️',
        title: 'Spring Boot 的自动装配',
        description: '深入理解 Spring Boot 自动装配的核心机制，包括模块装配、条件装配和 SPI 机制。',
        keyPoints: [
          '组件装配：手动装配 vs 自动装配',
          '模块装配：@Import 与四种导入方式',
          '条件装配：@Conditional 与 @Profile',
          'SPI 机制：SpringFactoriesLoader'
        ]
      }
    };

    const intro = introData[chapterId];
    if (!intro) return;

    // 在内容前添加知识卡片
    const heroSection = document.createElement('div');
    heroSection.className = 'hero-inline';
    heroSection.innerHTML = `
      <h2>${intro.icon} ${intro.title}</h2>
      <p>${intro.description}</p>
      <div style="margin-top: 1rem;">
        <strong>本章重点：</strong>
        <ul style="margin: 0.5rem 0 0 1.5rem; text-align: left;">
          ${intro.keyPoints.map(p => `<li>${p}</li>`).join('')}
        </ul>
      </div>
    `;

    const firstHeading = main.querySelector('h2');
    if (firstHeading && firstHeading.id) {
      firstHeading.parentNode.insertBefore(heroSection, firstHeading);
    }

    // 渲染 Mermaid 图表
    setTimeout(() => {
      main.querySelectorAll('.mermaid:not([data-rendered])').forEach(async (el) => {
        el.setAttribute('data-rendered', 'true');
        try {
          if (typeof mermaid !== 'undefined') {
            const id = 'mermaid-' + Math.random().toString(36).substr(2, 9);
            const { svg } = await mermaid.render(id, el.textContent.trim());
            el.innerHTML = svg;
          }
        } catch (e) {
          console.error('Mermaid error:', e);
        }
      });
    }, 100);
  }

  // ---- 导航 ----
  async function navigateTo(id, addToHistory = true) {
    UI.setLoading(true);

    try {
      const data = await Router.loadChapter(id);
      UI.renderChapter(id, data.html, data.headings, data.title);

      if (!id.startsWith('00')) {
        Storage.setLastChapter(id);
      }

      if (addToHistory) {
        const url = '#' + id;
        if (location.hash !== url) {
          history.pushState({ id }, '', url);
        }
      }

      Router.preloadNeighbors(id);

      if (!Search.isReady()) {
        Search.buildIndex();
      }

      // 增强章节内容（章节介绍卡片 + 正文内嵌 Mermaid 渲染）
      if (id === '01' || id === '02') {
        setTimeout(() => enhanceChapterContent(id), 100);
      }

      // 注入章节图解与随堂测验（Phase 1 新增）
      const main = document.getElementById('main-content');
      if (typeof Diagrams !== 'undefined') {
        Diagrams.injectFor(id, main).catch(e => console.error('Diagrams injection failed:', e));
      }
      if (typeof Quiz !== 'undefined') {
        Quiz.injectFor(id, main).catch(e => console.error('Quiz injection failed:', e));
      }
      // Phase 3 注入
      if (typeof CallChain !== 'undefined') {
        CallChain.injectFor(id, main).catch(e => console.error('CallChain injection failed:', e));
      }
      if (typeof SourceRefs !== 'undefined') {
        SourceRefs.injectFor(id, main).catch(e => console.error('SourceRefs injection failed:', e));
      }
      if (typeof Notes !== 'undefined') {
        // 等待其它注入完成再贴回高亮（轻量延迟）
        setTimeout(() => Notes.applyAll(id, main), 300);
      }

    } catch (err) {
      console.error('Navigation error:', err);

      if (err.message.includes('404')) {
        const ok = await detectChaptersBase();
        if (ok) {
          Router.clearCache();
          try {
            const data = await Router.loadChapter(id);
            UI.renderChapter(id, data.html, data.headings, data.title);
            return;
          } catch (retryErr) {
            console.error('Retry failed:', retryErr);
          }
        }
      }

      UI.setError(err.message);
    }
  }

  function restoreFromHash() {
    const hash = location.hash.replace('#', '');
    if (hash === 'home') return 'home';
    if (hash && CONFIG.getChapter(hash)) return hash;
    return null;
  }

  function getInitialChapter() {
    const fromHash = restoreFromHash();
    if (fromHash === 'home') return null;
    if (fromHash) return fromHash;
    const last = Storage.getLastChapter();
    if (last && CONFIG.getChapter(last)) return last;
    return null; // 返回 null 表示显示首页
  }

  async function boot() {
    UI.init();

    document.addEventListener('navigate', (e) => {
      navigateTo(e.detail.id);
    });

    // Phase 2: 成就系统 + 测验中心
    if (typeof Achievement !== 'undefined') {
      Achievement.tickLoginStreak();
      Achievement.check();
      document.addEventListener('quiz:answered', () => Achievement.check());
      document.addEventListener('chapter:read', () => Achievement.check());
    }
    const qcBtn = document.getElementById('btn-quiz-center');
    if (qcBtn && typeof QuizCenter !== 'undefined') {
      qcBtn.addEventListener('click', () => QuizCenter.toggle());
    }

    // Phase 3: 笔记系统初始化
    if (typeof Notes !== 'undefined') {
      Notes.init();
    }

    window.addEventListener('popstate', () => {
      const id = restoreFromHash();
      if (id === 'home') {
        renderHomePage();
      } else if (id) {
        navigateTo(id, false);
      }
    });

    // 路径诊断
    const ok = await detectChaptersBase();
    if (!ok) {
      const main = document.getElementById('main-content');
      if (main) main.innerHTML = diagnosticHTML();
      return;
    }

    const initial = getInitialChapter();

    if (!initial) {
      // 显示首页
      history.replaceState({ id: 'home' }, '', '#home');
      renderHomePage();
      // 默认展开路线图
      document.getElementById('roadmap')?.classList.remove('collapsed');
    } else {
      if (!restoreFromHash()) {
        history.replaceState({ id: initial }, '', '#' + initial);
      }
      await navigateTo(initial, false);
    }

    setTimeout(() => { Search.buildIndex(); }, 800);
  }

  return Object.freeze({ boot, renderHomePage });
})();

document.addEventListener('DOMContentLoaded', () => App.boot());
