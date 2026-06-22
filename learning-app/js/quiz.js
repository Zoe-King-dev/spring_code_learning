/**
 * quiz.js — 随堂测验引擎 (Phase 2)
 * 题型: single / multiple / fill-blank
 * 数据源: data/quizzes/{name}.json  (ch01.json / part1.json / final.json ...)
 * 持久化: sbl_quiz_answers = { [qid]: snapshot }
 *   snapshot = { picked, correct, at, q, type, options?, correctAnswer, explanation, chapterId }
 */
const Quiz = (() => {
  const _cache = {};

  async function _loadFile(name) {
    if (_cache[name] !== undefined) return _cache[name];
    try {
      const res = await fetch(`data/quizzes/${name}.json`);
      if (!res.ok) { _cache[name] = null; return null; }
      const data = await res.json();
      _cache[name] = data;
      return data;
    } catch (e) {
      _cache[name] = null;
      return null;
    }
  }

  async function load(chapterId) {
    return _loadFile(`ch${chapterId}`);
  }

  function _getAllAnswers() {
    return Storage.get('quiz_answers', {});
  }

  function _saveAnswer(question, picked, correct, chapterId) {
    const all = _getAllAnswers();
    all[question.id] = {
      picked,
      correct,
      at: Date.now(),
      q: question.question,
      type: question.type,
      options: question.options || null,
      blanks: question.blanks || null,
      correctAnswer: question.correctAnswer || question.blanks?.map(b => b.answer) || [],
      explanation: question.explanation || '',
      chapterId: chapterId || question.chapterId || ''
    };
    Storage.set('quiz_answers', all);
    document.dispatchEvent(new CustomEvent('quiz:answered', {
      detail: { question, picked, correct, chapterId }
    }));
  }

  function _isCorrectChoice(picked, correctAnswer) {
    if (picked.length !== correctAnswer.length) return false;
    const sp = [...picked].sort();
    const sc = [...correctAnswer].sort();
    return sp.every((v, i) => v === sc[i]);
  }

  function _normBlank(s, caseSensitive) {
    const t = (s || '').trim();
    return caseSensitive ? t : t.toLowerCase();
  }

  function _isCorrectBlank(picked, question) {
    const cs = question.caseSensitive === true;
    if (picked.length !== question.blanks.length) return false;
    return question.blanks.every((b, i) => _normBlank(picked[i], cs) === _normBlank(b.answer, cs));
  }

  function _difficultyLabel(d) {
    return { easy: '简单', medium: '中等', hard: '困难' }[d] || '';
  }

  function _typeLabel(t) {
    return { single: '单选', multiple: '多选', 'fill-blank': '填空' }[t] || t;
  }

  function _escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  function _renderChoice(question) {
    const inputType = question.type === 'multiple' ? 'checkbox' : 'radio';
    return question.options.map(opt => `
      <label class="quiz-option" data-opt="${opt.id}">
        <input type="${inputType}" name="quiz-${question.id}" value="${opt.id}">
        <span class="quiz-option-id">${opt.id}.</span>
        <span class="quiz-option-text">${opt.text}</span>
      </label>
    `).join('');
  }

  function _renderFillBlank(question) {
    const lang = question.lang || 'java';
    const code = question.code || '';
    const escaped = _escapeHtml(code);
    // 替换 ___N___ 为 input
    const withInputs = escaped.replace(/___(\d+)___/g, (m, n) => {
      const blank = question.blanks.find(b => String(b.id) === n);
      const hint = blank && blank.hint ? _escapeHtml(blank.hint) : '';
      return `<input class="quiz-blank" data-blank-id="${n}" placeholder="${hint || '?'}" autocomplete="off" spellcheck="false">`;
    });
    return `<pre class="quiz-code language-${lang}"><code>${withInputs}</code></pre>`;
  }

  function _renderCard(question, chapterId) {
    const diffLabel = _difficultyLabel(question.difficulty);
    const typeLabel = _typeLabel(question.type);
    const body = question.type === 'fill-blank'
      ? _renderFillBlank(question)
      : `<div class="quiz-card-options">${_renderChoice(question)}</div>`;

    return `
      <div class="quiz-card" data-qid="${question.id}" data-chapter="${chapterId || ''}" data-type="${question.type}">
        <div class="quiz-card-head">
          <span class="quiz-tag quiz-tag-type">${typeLabel}</span>
          ${diffLabel ? `<span class="quiz-tag quiz-tag-diff quiz-diff-${question.difficulty}">${diffLabel}</span>` : ''}
          <span class="quiz-card-id">#${question.id}</span>
        </div>
        <div class="quiz-card-question">${question.question}</div>
        ${body}
        <div class="quiz-card-actions">
          <button class="quiz-btn quiz-submit">提交答案</button>
          <button class="quiz-btn quiz-reset" hidden>重新作答</button>
        </div>
        <div class="quiz-card-feedback" hidden></div>
      </div>
    `;
  }

  function _bindChoiceCard(cardEl, question, chapterId) {
    const submitBtn = cardEl.querySelector('.quiz-submit');
    const resetBtn = cardEl.querySelector('.quiz-reset');
    const feedback = cardEl.querySelector('.quiz-card-feedback');
    const inputs = cardEl.querySelectorAll('input[type="radio"], input[type="checkbox"]');

    function setLocked(locked) {
      inputs.forEach(i => { i.disabled = locked; });
      submitBtn.hidden = locked;
      resetBtn.hidden = !locked;
    }

    function showFeedback(picked, correct) {
      const correctStr = question.correctAnswer.join('、');
      const refLink = question.referenceAnchor
        ? `<a href="#${question.referenceAnchor}" class="quiz-ref-link">→ 跳转原文</a>`
        : '';
      feedback.innerHTML = `
        <div class="quiz-verdict ${correct ? 'quiz-verdict-ok' : 'quiz-verdict-bad'}">
          ${correct ? '✅ 正确！' : '❌ 错误'}
          <span class="quiz-correct-answer">正确答案：${correctStr}</span>
        </div>
        <div class="quiz-explanation">${question.explanation || ''}</div>
        ${refLink}
      `;
      feedback.hidden = false;
      cardEl.querySelectorAll('.quiz-option').forEach(label => {
        const opt = label.dataset.opt;
        const isCorrectOpt = question.correctAnswer.includes(opt);
        const isPicked = picked.includes(opt);
        label.classList.remove('quiz-opt-correct', 'quiz-opt-wrong');
        if (isCorrectOpt) label.classList.add('quiz-opt-correct');
        if (isPicked && !isCorrectOpt) label.classList.add('quiz-opt-wrong');
      });
    }

    submitBtn.addEventListener('click', () => {
      const picked = [...cardEl.querySelectorAll('input:checked')].map(i => i.value);
      if (picked.length === 0) {
        feedback.innerHTML = '<div class="quiz-warning">⚠️ 请先选择答案</div>';
        feedback.hidden = false;
        return;
      }
      const correct = _isCorrectChoice(picked, question.correctAnswer);
      _saveAnswer(question, picked, correct, chapterId);
      setLocked(true);
      showFeedback(picked, correct);
    });

    resetBtn.addEventListener('click', () => {
      inputs.forEach(i => { i.checked = false; });
      feedback.hidden = true;
      feedback.innerHTML = '';
      cardEl.querySelectorAll('.quiz-option').forEach(l => {
        l.classList.remove('quiz-opt-correct', 'quiz-opt-wrong');
      });
      setLocked(false);
    });

    const prior = _getAllAnswers()[question.id];
    if (prior) {
      prior.picked.forEach(v => {
        const input = cardEl.querySelector(`input[value="${v}"]`);
        if (input) input.checked = true;
      });
      setLocked(true);
      showFeedback(prior.picked, prior.correct);
    }
  }

  function _bindFillBlankCard(cardEl, question, chapterId) {
    const submitBtn = cardEl.querySelector('.quiz-submit');
    const resetBtn = cardEl.querySelector('.quiz-reset');
    const feedback = cardEl.querySelector('.quiz-card-feedback');
    const inputs = cardEl.querySelectorAll('.quiz-blank');

    function readPicked() {
      const arr = [];
      question.blanks.forEach(b => {
        const inp = cardEl.querySelector(`.quiz-blank[data-blank-id="${b.id}"]`);
        arr.push(inp ? inp.value : '');
      });
      return arr;
    }

    function setLocked(locked) {
      inputs.forEach(i => { i.disabled = locked; });
      submitBtn.hidden = locked;
      resetBtn.hidden = !locked;
    }

    function showFeedback(picked, correct) {
      const cs = question.caseSensitive === true;
      const perBlank = question.blanks.map((b, i) => {
        const ok = _normBlank(picked[i], cs) === _normBlank(b.answer, cs);
        cardEl.querySelector(`.quiz-blank[data-blank-id="${b.id}"]`)
          ?.classList.add(ok ? 'quiz-blank-ok' : 'quiz-blank-bad');
        return `<li>${b.id}. <code>${_escapeHtml(b.answer)}</code> ${ok ? '✅' : '❌'}</li>`;
      }).join('');
      const refLink = question.referenceAnchor
        ? `<a href="#${question.referenceAnchor}" class="quiz-ref-link">→ 跳转原文</a>`
        : '';
      feedback.innerHTML = `
        <div class="quiz-verdict ${correct ? 'quiz-verdict-ok' : 'quiz-verdict-bad'}">
          ${correct ? '✅ 全部正确！' : '❌ 存在错误'}
        </div>
        <ul class="quiz-blank-list">${perBlank}</ul>
        <div class="quiz-explanation">${question.explanation || ''}</div>
        ${refLink}
      `;
      feedback.hidden = false;
    }

    submitBtn.addEventListener('click', () => {
      const picked = readPicked();
      if (picked.every(v => !v.trim())) {
        feedback.innerHTML = '<div class="quiz-warning">⚠️ 请至少填写一个空</div>';
        feedback.hidden = false;
        return;
      }
      const correct = _isCorrectBlank(picked, question);
      _saveAnswer(question, picked, correct, chapterId);
      setLocked(true);
      showFeedback(picked, correct);
    });

    resetBtn.addEventListener('click', () => {
      inputs.forEach(i => {
        i.value = '';
        i.classList.remove('quiz-blank-ok', 'quiz-blank-bad');
      });
      feedback.hidden = true;
      feedback.innerHTML = '';
      setLocked(false);
    });

    const prior = _getAllAnswers()[question.id];
    if (prior) {
      prior.picked.forEach((v, i) => {
        const b = question.blanks[i];
        if (!b) return;
        const inp = cardEl.querySelector(`.quiz-blank[data-blank-id="${b.id}"]`);
        if (inp) inp.value = v;
      });
      setLocked(true);
      showFeedback(prior.picked, prior.correct);
    }
  }

  function _bindCard(cardEl, question, chapterId) {
    if (question.type === 'fill-blank') {
      _bindFillBlankCard(cardEl, question, chapterId);
    } else {
      _bindChoiceCard(cardEl, question, chapterId);
    }
  }

  /** 把题库注入到章节内容末尾 */
  async function injectFor(chapterId, mainContainer) {
    if (!mainContainer) return;
    const data = await load(chapterId);
    if (!data || !data.sections || data.sections.length === 0) return;

    const old = mainContainer.querySelector('.quiz-section');
    if (old) old.remove();

    const allQuestions = data.sections.flatMap(s => s.questions || []);
    if (allQuestions.length === 0) return;

    const section = document.createElement('section');
    section.className = 'quiz-section';
    section.innerHTML = `
      <h2 class="quiz-section-title">✏️ 随堂测验</h2>
      <p class="quiz-section-desc">完成下方题目即时检验本章学习效果。答题记录会自动保存在浏览器中。</p>
      <div class="quiz-list">
        ${allQuestions.map(q => _renderCard(q, chapterId)).join('')}
      </div>
    `;
    mainContainer.appendChild(section);

    allQuestions.forEach(q => {
      const card = section.querySelector(`.quiz-card[data-qid="${q.id}"]`);
      if (card) _bindCard(card, q, chapterId);
    });
  }

  /** 渲染独立测验集（Part / Final）到指定容器，可指定 chapterId 上下文 */
  async function renderTest(testName, container, opts = {}) {
    container.innerHTML = '<div class="quiz-loading">加载中...</div>';
    const data = await _loadFile(testName);
    if (!data) {
      container.innerHTML = `<div class="quiz-error">⚠️ 题库 ${testName} 加载失败</div>`;
      return;
    }
    const allQuestions = (data.sections || []).flatMap(s => s.questions || []);
    if (allQuestions.length === 0) {
      container.innerHTML = `<div class="quiz-error">该测验暂无题目</div>`;
      return;
    }
    const chapterId = opts.chapterId || data.chapterId || testName;
    const title = data.title || testName;
    container.innerHTML = `
      <div class="quiz-test-head">
        <h2>${_escapeHtml(title)}</h2>
        <p class="quiz-section-desc">${_escapeHtml(data.description || `共 ${allQuestions.length} 题`)}</p>
        <div class="quiz-test-stats" id="quiz-test-stats-${testName}"></div>
      </div>
      <div class="quiz-list">
        ${allQuestions.map(q => _renderCard(q, chapterId)).join('')}
      </div>
    `;
    allQuestions.forEach(q => {
      const card = container.querySelector(`.quiz-card[data-qid="${q.id}"]`);
      if (card) _bindCard(card, q, chapterId);
    });
    _updateTestStats(testName, allQuestions);
    document.addEventListener('quiz:answered', () => _updateTestStats(testName, allQuestions));
  }

  function _updateTestStats(testName, questions) {
    const el = document.getElementById(`quiz-test-stats-${testName}`);
    if (!el) return;
    const answers = _getAllAnswers();
    let answered = 0, correct = 0;
    questions.forEach(q => {
      if (answers[q.id]) {
        answered++;
        if (answers[q.id].correct) correct++;
      }
    });
    const pct = answered > 0 ? Math.round((correct / answered) * 100) : 0;
    el.innerHTML = `已答 <b>${answered}</b> / ${questions.length} · 正确 <b>${correct}</b> · 正确率 <b>${pct}%</b>`;
  }

  /** 获取某章节答题统计 */
  function getChapterStats(chapterId) {
    const data = _cache[`ch${chapterId}`];
    if (!data) return { total: 0, answered: 0, correct: 0 };
    const allQ = data.sections.flatMap(s => s.questions || []);
    const answers = _getAllAnswers();
    let answered = 0, correct = 0;
    for (const q of allQ) {
      if (answers[q.id]) {
        answered++;
        if (answers[q.id].correct) correct++;
      }
    }
    return { total: allQ.length, answered, correct };
  }

  /** 获取错题列表（按时间倒序） */
  function getWrongAnswers(filterChapter) {
    const all = _getAllAnswers();
    return Object.entries(all)
      .filter(([, v]) => v.correct === false)
      .filter(([, v]) => !filterChapter || v.chapterId === filterChapter)
      .map(([qid, v]) => ({ qid, ...v }))
      .sort((a, b) => b.at - a.at);
  }

  function getAllAnswers() { return _getAllAnswers(); }

  function clearAnswers(qid) {
    const all = _getAllAnswers();
    if (qid) delete all[qid]; else Object.keys(all).forEach(k => delete all[k]);
    Storage.set('quiz_answers', all);
  }

  return Object.freeze({
    load, injectFor, renderTest,
    getChapterStats, getWrongAnswers, getAllAnswers, clearAnswers
  });
})();
