/**
 * config.js — 配置中心
 * 章节元数据、路径常量、书籍结构划分。
 * 无依赖，所有模块均可引用。
 */

// ---- 章节注册表（内部数据，供初始化使用） ----
const _CHAPTER_DEFS = [
  { id: '00a', file: '00_前言与目录.md', title: '前言与目录', part: 0, difficulty: null },
  { id: '00b', file: '00_章节概要.md', title: '章节概要', part: 0, difficulty: null },
  { id: '01',  file: '01_第1章_Spring_Boot整体概述.md', title: '第1章 Spring Boot 整体概述', part: 1, difficulty: '入门' },
  { id: '02',  file: '02_第2章_Spring_Boot的自动装配.md', title: '第2章 Spring Boot 的自动装配', part: 1, difficulty: '核心' },
  { id: '03',  file: '03_第3章_Spring_Boot的IOC容器.md', title: '第3章 Spring Boot 的IOC容器', part: 1, difficulty: '核心' },
  { id: '04',  file: '04_第4章_Spring_Boot的核心引导_SpringApplication.md', title: '第4章 核心引导：SpringApplication', part: 1, difficulty: '核心' },
  { id: '05',  file: '05_第5章_Spring_Boot的AOP支持.md', title: '第5章 Spring Boot 的AOP支持', part: 1, difficulty: '进阶' },
  { id: '06',  file: '06_第6章_Spring_Boot准备容器与环境.md', title: '第6章 准备容器与环境', part: 2, difficulty: '核心' },
  { id: '07',  file: '07_第7章_IOC容器的刷新.md', title: '第7章 IOC 容器的刷新', part: 2, difficulty: '难点' },
  { id: '08',  file: '08_第8章_嵌入式Web容器.md', title: '第8章 嵌入式Web容器', part: 2, difficulty: '核心' },
  { id: '09',  file: '09_第9章_AOP模块的生命周期.md', title: '第9章 AOP 模块的生命周期', part: 2, difficulty: '进阶' },
  { id: '10',  file: '10_第10章_Spring_Boot整合JDBC.md', title: '第10章 Spring Boot 整合JDBC', part: 3, difficulty: '应用' },
  { id: '11',  file: '11_第11章_Spring_Boot整合MyBatis.md', title: '第11章 Spring Boot 整合MyBatis', part: 3, difficulty: '应用' },
  { id: '12',  file: '12_第12章_Spring_Boot整合WebMvc.md', title: '第12章 Spring Boot 整合WebMvc', part: 3, difficulty: '应用' },
  { id: '13',  file: '13_第13章_Spring_Boot整合WebFlux.md', title: '第13章 Spring Boot 整合WebFlux', part: 3, difficulty: '进阶' },
  { id: '14',  file: '14_第14章_运行Spring_Boot应用.md', title: '第14章 运行 Spring Boot 应用', part: 4, difficulty: '应用' },
];

const _PART_DEFS = [
  { id: 0, title: '前言', icon: '📖', chapters: ['00a', '00b'] },
  { id: 1, title: '第1部分 底层依赖的核心容器', icon: '🧱', chapters: ['01', '02', '03', '04', '05'] },
  { id: 2, title: '第2部分 生命周期原理分析', icon: '🔄', chapters: ['06', '07', '08', '09'] },
  { id: 3, title: '第3部分 整合常用开发场景', icon: '🔌', chapters: ['10', '11', '12', '13'] },
  { id: 4, title: '第4部分 运行 Spring Boot 应用', icon: '🚀', chapters: ['14'] },
];

const DIFFICULTY_CLASS = {
  '入门': 'diff-easy',
  '核心': 'diff-core',
  '进阶': 'diff-advanced',
  '应用': 'diff-applied',
  '难点': 'diff-hard',
};

// ---- 构建公开 API ----
const CONFIG = {
  // 内容资源目录（相对于 index.html）
  CONTENT_BASE: '../chapters',

  PARTS: _PART_DEFS,
  CHAPTERS: _CHAPTER_DEFS,

  STORAGE_KEYS: {
    PROGRESS: 'sbl_progress',
    BOOKMARKS: 'sbl_bookmarks',
    THEME: 'sbl_theme',
    LAST_CHAPTER: 'sbl_last',
  },

  /** 按 ID 查找章节 */
  getChapter(id) {
    return _CHAPTER_DEFS.find(ch => ch.id === id);
  },

  /** 获取某部分的章节列表 */
  getPartChapters(partId) {
    return _CHAPTER_DEFS.filter(ch => ch.part === partId);
  },

  /** 获取相邻章节 */
  getNeighbors(id) {
    const idx = _CHAPTER_DEFS.findIndex(ch => ch.id === id);
    return {
      prev: idx > 0 ? _CHAPTER_DEFS[idx - 1] : null,
      next: idx < _CHAPTER_DEFS.length - 1 ? _CHAPTER_DEFS[idx + 1] : null,
    };
  },

  /** 难度标签 -> CSS 类 */
  difficultyClass(d) {
    return DIFFICULTY_CLASS[d] || '';
  },
};
