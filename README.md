# Spring Boot 源码解读与原理分析 · 学习仓库

> 本仓库是基于《Spring Boot 源码解读与原理分析》一书整理的学习型知识库，并配套构建了一个轻量级的 Web 阅读应用（`learning-app/`），用于系统化地学习 Spring Boot 的运行机制与底层原理。

## ✨ 项目亮点

- 📚 **14 章系统化知识库** — 从 Spring Boot 整体概述、自动装配、IOC 容器，到 AOP、嵌入式 Web 容器、JDBC、MyBatis、WebMvc、WebFlux，再到应用部署与优雅停机，覆盖 Spring Boot 核心知识点。
- 🌐 **Web 阅读应用 `learning-app/`** — 基于原生 JavaScript 构建的本地学习 App，提供阅读、测验、调用链、知识图谱等增强功能。
- 🧪 **配套章节测验** — 每章及每个篇章都提供题目，支持阶段练习与综合测试。
- 🔗 **源码调用链可视化** — 关键章节提供 `callchains` 数据，可按步骤追踪框架内部调用路径。
- 🧭 **知识图谱** — 把分散的概念、组件、流程串联起来，便于建立体系化认知。
- 📊 **Mermaid 架构图** — 每个核心模块都配有架构 / 时序图，沉淀在 `data/diagrams/` 中。
- 📖 **源码引用面板** — 关键论述附带 `source-refs`，方便直接跳到 Spring Boot / Spring Framework 源码位置。

## 🗂 目录结构

```
spring_source_code_learning/
├── README.md                     # 本文件
├── LICENSE                       # MIT 许可证
├── CLAUDE.md                     # 项目说明（供 Claude Code 协作使用）
├── SpringBoot知识库.md            # 完整知识库（合订本）
├── chapters/                     # 各章节独立 Markdown
│   ├── 00_前言与目录.md
│   ├── 00_章节概要.md
│   ├── 01_第1章_Spring_Boot整体概述.md
│   ├── 02_第2章_Spring_Boot的自动装配.md
│   ├── 03_第3章_Spring_Boot的IOC容器.md
│   ├── 04_第4章_Spring_Boot的核心引导_SpringApplication.md
│   ├── 05_第5章_Spring_Boot的AOP支持.md
│   ├── 06_第6章_Spring_Boot准备容器与环境.md
│   ├── 07_第7章_IOC容器的刷新.md
│   ├── 08_第8章_嵌入式Web容器.md
│   ├── 09_第9章_AOP模块的生命周期.md
│   ├── 10_第10章_Spring_Boot整合JDBC.md
│   ├── 11_第11章_Spring_Boot整合MyBatis.md
│   ├── 12_第12章_Spring_Boot整合WebMvc.md
│   ├── 13_第13章_Spring_Boot整合WebFlux.md
│   └── 14_第14章_运行Spring_Boot应用.md
├── docs/                         # 改进与设计文档（PRD）
│   ├── PRD_improvement_V2.0.md
│   └── PRD_learning-app-improvement_V1.0.md
└── learning-app/                 # Web 阅读应用
    ├── index.html
    ├── css/                      # 样式
    ├── js/                       # 应用逻辑（路由、存储、渲染、测验等）
    └── data/                     # 题库 / 知识图谱 / 图表 / 调用链 / 源码引用
```

## 📖 章节导览

| 部分 | 章节 | 主题 |
| ---- | ---- | ---- |
| **Part 1 核心容器** | 第 1 章 | Spring Boot 整体概述 |
| | 第 2 章 | Spring Boot 的自动装配 |
| | 第 3 章 | Spring Boot 的 IOC 容器 |
| | 第 4 章 | Spring Boot 的核心引导：SpringApplication |
| | 第 5 章 | Spring Boot 的 AOP 支持 |
| **Part 2 生命周期** | 第 6 章 | Spring Boot 准备容器与环境 |
| | 第 7 章 | IOC 容器的刷新 |
| | 第 8 章 | 嵌入式 Web 容器 |
| | 第 9 章 | AOP 模块的生命周期 |
| **Part 3 整合场景** | 第 10 章 | Spring Boot 整合 JDBC |
| | 第 11 章 | Spring Boot 整合 MyBatis |
| | 第 12 章 | Spring Boot 整合 WebMvc |
| | 第 13 章 | Spring Boot 整合 WebFlux |
| **Part 4 部署运维** | 第 14 章 | 运行 Spring Boot 应用（含优雅停机） |

## 🚀 快速开始

### 阅读 Markdown 知识库

直接用任意 Markdown 阅读器打开 `chapters/` 下的章节文件，或阅读合订本 `SpringBoot知识库.md`。

### 启动 Web 学习应用

`learning-app/` 是一个纯前端项目，无需任何构建步骤，任意静态服务器即可运行。

```bash
# 在仓库根目录
python -m http.server 8082

# 然后浏览器打开
# http://localhost:8082/learning-app/
```

> 任何静态服务器都可以（Nginx、`http-server`、`serve` 等），只要能从 URL 访问到 `chapters/` 和 `learning-app/` 目录即可。

## 🛠 技术栈

- **内容层**：纯 Markdown，使用 `marked.js` 解析、`highlight.js` 语法高亮
- **应用层**：原生 JavaScript（ES Modules）、HTML、CSS（无框架依赖）
- **数据层**：JSON（题库、知识图谱、调用链、源码引用、Mermaid 图）
- **可视化**：Mermaid 图表

## 🧭 学习路径建议

1. **入门**：第 1 章快速建立 Spring Boot 整体认知。
2. **核心**：第 2、3 章吃透自动装配与 IOC 容器。
3. **进阶**：第 4–9 章按启动流程顺序，跟随生命周期主线深入底层。
4. **整合**：第 10–13 章按需查阅 JDBC、MyBatis、WebMvc、WebFlux 场景。
5. **运维**：第 14 章了解部署与优雅停机。
6. **复习**：使用 `learning-app` 的测验与知识图谱巩固知识。

## 🤝 贡献

欢迎通过 Issue / PR 反馈以下内容：

- 章节内容中的笔误、错误或可补充的源码解读
- `learning-app/` 的功能改进（参见 `docs/PRD_learning-app-improvement_V1.0.md`）
- 新增题目、调用链、知识图谱节点

## 📄 License

本项目基于 **MIT License** 开源，详见 [LICENSE](./LICENSE) 文件。

Copyright (c) 2026 Haoran
