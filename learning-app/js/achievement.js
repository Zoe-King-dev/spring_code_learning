/**
 * achievement.js — 成就系统 (Phase 2)
 * 配置: data/achievements.json
 * 持久化: sbl_achievements = { [id]: { unlockedAt } }
 *         sbl_login_streak = { lastDay: 'YYYY-MM-DD', count, longest }
 * 事件:
 *   - 监听 quiz:answered （来自 quiz.js）→ 触发检测
 *   - 监听 chapter:read   （app.js 标记完成时分发）→ 触发检测
 *   - 启动时 tickLoginStreak() 维护登录连续天数
 */
const Achievement = (() => {
  let _defs = null;

  async function _loadDefs() {
    if (_defs !== null) return _defs;
    try {
      const res = await fetch('data/achievements.json');
      if (!res.ok) { _defs = []; return _defs; }
      const data = await res.json();
      _defs = data.achievements || [];
      return _defs;
    } catch (e) {
      _defs = [];
      return _defs;
    }
  }

  function _getUnlocks() {
    return Storage.get('achievements', {});
  }

  function _setUnlocked(id) {
    const all = _getUnlocks();
    if (all[id]) return false;
    all[id] = { unlockedAt: Date.now() };
    Storage.set('achievements', all);
    return true;
  }

  function _readChapters() {
    return new Set(Storage.get('progress', []));
  }

  function _evalQuizPerChapter() {
    // 聚合每章节答题统计：{ ch: { answered, correct } }
    const answers = Storage.get('quiz_answers', {});
    const byCh = {};
    Object.values(answers).forEach(a => {
      const c = a.chapterId || '';
      if (!c) return;
      if (!byCh[c]) byCh[c] = { answered: 0, correct: 0 };
      byCh[c].answered++;
      if (a.correct) byCh[c].correct++;
    });
    return byCh;
  }

  function _ruleMatch(rule) {
    const readSet = _readChapters();
    const byCh = _evalQuizPerChapter();
    switch (rule.type) {
      case 'chapter-read':
        return readSet.has(rule.chapter);
      case 'chapters-read':
        return rule.chapters.every(c => readSet.has(c));
      case 'all-chapters-read': {
        const all = (typeof CONFIG !== 'undefined' ? CONFIG.CHAPTERS : [])
          .filter(c => !c.id.startsWith('00'))
          .map(c => c.id);
        return all.length > 0 && all.every(id => readSet.has(id));
      }
      case 'quiz-accuracy': {
        const stat = byCh[rule.chapter];
        if (!stat || stat.answered < (rule.minAnswered || 1)) return false;
        return (stat.correct / stat.answered) >= (rule.minAccuracy || 0.8);
      }
      case 'any-perfect-chapter': {
        const min = rule.minAnswered || 1;
        return Object.values(byCh).some(s => s.answered >= min && s.correct === s.answered);
      }
      case 'login-streak': {
        const streak = Storage.get('login_streak', { count: 0 });
        return (streak.count || 0) >= (rule.days || 7);
      }
      default:
        return false;
    }
  }

  /** 重新评估所有成就，返回本次新解锁的成就数组 */
  async function check() {
    const defs = await _loadDefs();
    const unlocked = _getUnlocks();
    const newly = [];
    for (const def of defs) {
      if (unlocked[def.id]) continue;
      try {
        if (_ruleMatch(def.rule)) {
          if (_setUnlocked(def.id)) newly.push(def);
        }
      } catch (e) {
        console.error('Achievement rule eval failed:', def.id, e);
      }
    }
    newly.forEach(_showToast);
    if (newly.length > 0) {
      document.dispatchEvent(new CustomEvent('achievement:unlocked', { detail: { items: newly } }));
    }
    return newly;
  }

  function _showToast(def) {
    const t = document.createElement('div');
    t.className = 'achievement-toast';
    t.innerHTML = `
      <span class="toast-badge">${def.badge}</span>
      <div class="toast-text">
        <strong>成就解锁：${def.name}</strong>
        <span>${def.condition}</span>
      </div>
    `;
    document.body.appendChild(t);
    setTimeout(() => {
      t.style.transition = 'opacity 0.4s, transform 0.4s';
      t.style.opacity = '0';
      t.style.transform = 'translateY(20px)';
      setTimeout(() => t.remove(), 400);
    }, 4200);
  }

  /** 维护连续登录天数（每天第一次访问时计数） */
  function tickLoginStreak() {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const prev = Storage.get('login_streak', { lastDay: null, count: 0, longest: 0 });
    if (prev.lastDay === today) return prev;

    let count = 1;
    if (prev.lastDay) {
      const last = new Date(prev.lastDay);
      const diff = Math.round((new Date(today) - last) / 86400000);
      if (diff === 1) count = (prev.count || 0) + 1;
    }
    const next = {
      lastDay: today,
      count,
      longest: Math.max(prev.longest || 0, count)
    };
    Storage.set('login_streak', next);
    return next;
  }

  /** 列出所有成就（含未解锁），按 defs 顺序 */
  async function getAll() {
    const defs = await _loadDefs();
    const unlocked = _getUnlocks();
    return defs.map(d => ({
      ...d,
      unlocked: !!unlocked[d.id],
      unlockedAt: unlocked[d.id]?.unlockedAt || null
    }));
  }

  function getStreak() {
    return Storage.get('login_streak', { lastDay: null, count: 0, longest: 0 });
  }

  return Object.freeze({ check, tickLoginStreak, getAll, getStreak });
})();
