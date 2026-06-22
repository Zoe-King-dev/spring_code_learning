/**
 * chapter-intros.js — 章节介绍数据
 *
 * 章节卡片、章节头部 hero 用到的介绍文案与图标。
 * 后续会按 PRD V2.0 A-06 补全到全部 14 章。
 *
 * 字段约定：
 *   icon        - 用于卡片 / hero 的 emoji 图标
 *   description - 一句话简介
 *   keyPoints   - 本章重点（数组，渲染为 <ul>）
 *   diagram     - 可选，Mermaid 源码，渲染到 hero 下方
 */
const CHAPTER_INTROS = {
  '01': {
    icon: '🏠',
    description: '从整体层面了解 Spring Boot 与 Spring Framework 的关系，掌握 Spring Boot 的核心特性和技术体系。',
    keyPoints: ['Spring Framework 核心特性：IOC 与 AOP', 'Spring Boot 四大核心特性', '快速创建第一个 Spring Boot 项目'],
    diagram: `
	graph TB
	    A[Spring Boot 应用] --> B[约定大于配置]
	    A --> C[自动装配]
	    A --> D[嵌入式容器]
	    A --> E[生产级特性]
	    B --> F[Starter 场景启动器]
	    C --> G[@EnableAutoConfiguration]
	    D --> H[Tomcat/Jetty/Undertow]
	    E --> I[健康检查/监控]`
  },
  '02': {
    icon: '⚙️',
    description: '深入理解 Spring Boot 自动装配的核心机制，包括模块装配、条件装配和 SPI 机制。',
    keyPoints: ['组件装配：手动装配 vs 自动装配', '模块装配：@Import 与四种导入方式', '条件装配：@Conditional 与 @Profile', 'SPI 机制：SpringFactoriesLoader'],
    diagram: `
	graph TB
	    A[自动装配] --> B[模块装配]
	    A --> C[条件装配]
	    A --> D[SPI机制]
	    B --> B1[@Import 导入普通类]
	    B --> B2[@Import 导入配置类]
	    B --> B3[@Import ImportSelector]
	    B --> B4[@Import ImportBeanDefinitionRegistrar]
	    C --> C1[@Conditional]
	    C --> C2[@Profile]
	    D --> D1[spring.factories]
	    D --> D2[SpringFactoriesLoader]`
  }
};
