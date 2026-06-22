# Spring Boot 源码解读与原理分析 - 知识库

> 本知识库基于《Spring Boot 源码解读与原理分析》一书整理

## 目录




# 前言

启动引导方式。



内容提要

Spring Boot 是目前 Java EE 开发中颇受欢迎的框架之⼀。依托于底层 Spring Framework 的基础⽀

撑，以及完善强大的特性设计，Spring Boot 已成为业界流⾏的应用和微服务开发基础框架。

本书共14章，分为4个部分。第1部分介绍 Spring Boot 底层依赖的核心容器，以及底层 Spring

Framework 的两大核心特性IOC AOP；第2部分从底层源码⾓度深入剖析 Spring Boot 的全方位⽣

命周期，包括 SpringApplication、IOC容器、嵌入式Web 容器和AOP 模块的⽣命周期；第3部分针对

项目开发中整合的主流场景，介绍场景模块中的核心装配和关键机制原理，如JDBC中的事务、Web

中的核心控制器等；第4 部分与 Spring Boot 的运⾏部署相关，针对不同运⾏场景讲解 Spring Boot 的

阅读本书之前，读者需要先对 Spring Framework 和 Spring Boot 有基本的理解与简单的框架使用经

验或项目开发经验。本书的重点是 Spring Boot 的设计、思想和原理，⽆论是对于已经有⼀定基础的开

发者还是已熟练使用 Spring Boot 并希望进⼀步提升技能和⽔平的开发者，本书都是他们透彻研究

Spring Boot 源码和原理的理想选择。



本书组织结构

Spring Boot 从诞⽣⾄今已有数个年头，依托其简单易用、覆盖场景⼴泛、满⾜分布式应用

快速开发等特性，迅速成为互联网软件开发的⾸选基础框架。Spring Boot 本⾝设计强大、巧妙，

研究 Spring Boot 与 Spring Framework 的源码与底层设计，都会使能⼒得到不同程度的提升。但

• 阅读源码是⼀件难度极大且费时费⼒的工作，对开发者⽽⾔，单枪匹马深人底层研究的

投入产出⽐太低。

• 框架源码的底层过于复杂，尤其是对于经历了近20年迭代的经典框架，其内部设计之

• 借助网络可以找到与源码解读相关的资料和博客，但由于大多不成体系、没有来龙去脉

等，引发读者“读不懂”“没听说过”等尴尬体验，长期出现这种情况会引起深人学习

基于以上原因，开发者对于学习 Spring Boot 与Spring Framework 的原理与设计是有意愿的，

Spring Boot 与 Spring Framework 的研究和理解，希望能对正在探究和准备开始学习 Spring Boot

本书分为4个部分，包括 Spring Boot 底层依赖的核心容器、Spring Boot 的⽣命周期原理分

析、Spring Boot 整合常用开发场景，以及 Spring Boot 应用的运⾏。具体内容如下。

• 第1章， “Spring Boot 整体概述”：从整体层⾯回顾 Spring Boot 与底层依赖的 Spring

Framework，以及 Spring Boot 的核心特性、Spring Boot 原⽣⽀持的技术场景整合等。

• 第2章， “Spring Boot 的⾃动装配”：从组件装配开始，讲解 Spring Boot ⾃动装配的

技术基础⽀撑，随后拆解分析 Spring Boot 核心主启动类注解@SpringBootApplication，

配合常见的 WebMvc 场景进⾏⾃动装配的实例分析。

• 第3章，“Spring Boot 的IOC 容器”：全方⾯讲解 Spring Boot 底层依赖的IOC容器模型，

以及IOC 容器中的关键组件与设计，包括 Environment、BeanDefinition 和后置处理器等。

• 第4章，“Spring Boot 的核心引导：SpringApplication”：从宏观⾓度理解 Spring Boot

的核心引导启动类 SpringApplication，并初步了解内部的关键设计和总体⽣命周期。

• 第5章，“Spring Boot的AOP ⽀持”：回顾Spring Framework 的AOP 模块，以及 Spring

Boot整合 AOP后的关键开关和装配底层。

设计、初始化机制和启动流程等。

以及整合事务模块后的⽣效原理、控制原理和事务传播⾏为原理。

DispatcherServlet 的工作全流程。

表达约定

本书中出现的部分名词可能会出现多种不同的称呼，以下是部分专有名词的映射关系。

|前⾔

• 第6章， “'Spring Boot 准备容器与环境”：完整地讲解⼀个 Spring Boot 应用的启动流

程中的 SpringApplication 部分，包含创建 SpringApplication、启动 SpringApplication 的

关键逻辑，以及不同 Spring Boot 版本间设计的对⽐与扩展。

• 第7章，“IOC 容器的刷新”：全方位讲解 ApplicationContext 的容器初始化全流程，

该部分对原⽣ Spring Framework 的IOC 容器初始化逻辑进⾏深度剖析和原理解读。



# 第8章，“Spring Boot 容器刷新扩展：嵌人式Web 容器”：针对Spring Boot 的关键特


## 第8章，“Spring Boot 容器刷新扩展：嵌人式Web 容器”：针对Spring Boot 的关键特

性“嵌人式 Web 容器”展开讲解，以嵌入式 Tomcat 为例讲解嵌入式Web 容器的模型

• 第9章，“AOP 模块的⽣命周期”：从AOP 模块的核心后置处理器切人，讲解 AOP

机制在收集增强器、代理bean 对象的创建过程以及调用代理对象时内部的执⾏机制。

• 第10章，“Spring Boot整合JDBC”：讲解 Spring Boot 整合JDBC场景的⾃动装配，

• 第11章，“Spring Boot 整合 MyBatis”：讲解 Spring Boot整合MyBatis 操控数据库的

⾃动装配，以及 MyBatis 的核心组件 SqISessionFactory 的初始化流程。

• 第12章， “Spring Boot 整合WebMve”：讲解 Spring Boot 整合WebMvc场景的⾃动

装配，以及 WebMve 中的核心组件，随后通过具体的场景讲解核心控制器

• 第13章， “Spring Boot整合WebFlux”：从响应式编程开始讲解 WebFlux 的基础和快

速使用，随后讲解 Spring Boot 整合 WebFlux 场景的⾃动装配，以及核心控制器

DispatcherHandler 的工作全流程。

• 第14章，“运⾏ Spring Boot 应用”：通过不同的 Spring Boot 应用打包方式分别讲解

应用的引导启动流程，并讲解 2.3版本引入的优雅停机特性。

目标读者

本书并不是⼀本Spring Boot 的人门书，因此需要读者⾄少了解 Spring Boot 和 Spring

Framework，并有基本的使用经验。除此之外，还希望读者对Java SE、Java EE 的相关基础知识

有⼀定的掌握。因此本书更适合以下读者阅读：

• 会使用 Spring Boot、Spring Framework；

• 有实际项目的开发经验，但不满⾜于浅层次使用现状；

• 能熟练使用 Spring Boot，但没有深人挖掘深层次特性和⾼层级使用；

• 职业规划目标为技术总监、架构师等⾼级技术岗位；

• 技术⼴度⾜够，但深度有限；

• 被 Spring Boot、Spring Framework 问题困扰的求职者；

• 有意向对 Spring ⽣态深入探究的研究者。

• Spring Framework： 指 Spring 框架，简称 Spring。

在源码分析的过程中，考虑到框架底层的源码实现可能⽐较复杂，为了使读者把控源

码的整体逻辑，不在细节上消耗过多精⼒，本书中出现的框架源码部分会有适当省略与删

减。以下是⼏个源码⽚段的省略示例。

源码版本

的添加和优化，不会使内部⾻架和核心产⽣很大变动。基于以上⼏种情况，本书最终定稿

人的技术⽔平有限，所以书中出现错误在所难免。虽然作者在编写本书时已经对每个知识点反

前⾔I

• Bean:Spring Framework 中管理的组件对象（概念）。_bean 对象：容器中真实存在的组件对象实例。

IOC 容器：泛指 ApplicationContext，当上下⽂讲解 BeanFactory 时则指代 BeanFactory。

• Web 容器：Servlet 容器与 NIO 容器的统称，⽽不仅限于 Tomcat、Jetty 等 Servlet 容器。




目录


## 第1部分 Spring Boot 底层依赖的核心容器



# 第1章 Spring Boot 整体概述


## 第1章 Spring Boot 整体概述


## 1.1 Spring Framework




## 1.1.1 Spring Framework 的历史．


## 1.1.2 IOC 与 AOP


## 1.2 Spring Boot 与 Spring Framework


## 1.3Spring Boot的核心特性

Spring Boot 的体系……


## 1.5 开发第⼀个 Spring Boot 应用


## 1.5.1 创建项目


## 1.5.2 编写简单代码


## 1.6 小结



# 第2章 Spring Boot 的⾃动装配


## 第2章 Spring Boot 的⾃动装配


## 2.1 组件装配


## 2.1.1 组件


## 2.1.2 ⼿动装配


## 2.1.3 ⾃动装配










## 2.2 Spring Framework 的模块


## 2.2.1 模块


## 2.2.2 快速体会模块装配

导入配置类…


## 2.2.4导入 ImportSelector




## 2.2.5 导入ImportBeanDefinitionRegistrar


## 2.2.6 扩展：DeferredlmportSelector


## 2.3 Spring Framework 的条件装配


## 2.3.1 基于 Profile的装配


## 2.3.2 基于 Conditional 的装配

SPI 机制…


## 2.4.1 JDK 原⽣的 SPI 


## 2.4.2 Spring Framework 3.2的SPI


## 2.5 Spring Boot 的装配机制


## 2.5.1 @ComponentScan


## 2.5.2 @SpringBootConfiguration


## 2.5.3 @EnableAutoConfiguration


## 2.6 WebMvc 场景下的⾃动装配


## 2.6.1 Servlet 容器的装配


## 2.6.2 DispatcherServlet 的装配


## 2.6.3 SpringWebMvc的装配


## 2.7 小结



# 第3章 Spring Boot 的IOC 容器


## 第3章 Spring Boot 的IOC 容器


## 3.1 Spring Framework 的IOC容器


## 3.1.1 BeanFactory


## 3.1.2 ApplicationContext










## 3.1.3 选择 ApplicationContext⽽

不是 BeanFactory...


## 3.2 Spring Boot 对IOC容器的扩展


## 3.2.1 WebServerApplicationContext


## 3.2.2 AnnotationConfigServletWeb

ServerApplicationContext•75


## 3.2.3 Reactive WebApplicationContext


## 3.3 选用注解驱动 IOC容器的原因


## 3.3.1 配置方式的对⽐


## 3.3.2 约定大于配置下的选择


## 3.4 Environment 


## 3.4.1 Environment 概述






## 3.4.2 Environment 的结构与设计


## 3.4.3 Environment 与 IOC容器的

关系…… ⋯80


## 3.5 BeanDefinition


## 3.5.1 理解元信息


## 3.5.2 BeanDefinition 概述


## 3.5.3 BeanDefinition 的结构与设计


## 3.5.4 体会 BeanDefinition


## 3.5.5 BeanDefinitionRegistry


## 3.5.6 设计 BeanDefinition 的意义 


## 3.6 后置处理器


## 3.6.1 理解后置处理器


## 3.6.2 BeanPostProcessor


## 3




## 6


## 6


## 6


## 6



## 3.6.3 BeanPostProcessor 的扩展


## 3.6.4 BeanFactoryPostProcessor

BeanDefinitionRegistryPost

Processor.••...


## 3.6.6 后置处理器对⽐


## 3.7 IOC容器的启动流程


## 3.8 小结



# 第4章 Spring Boot 的核心


## 第4章 Spring Boot 的核心

引导：SpringApplication


## 4.1 总体设计


## 4.1.1 启动失败的错误报告


## 4.1.2 Bean的延迟初始化


## 4.1.3 SpringApplication 的


## 4.1.4 Web 类型推断


## 4.1.5 监听与回调


## 4.1.6 应用退出









• 104


## 4.2 ⽣命周期概述


## 4.2.1 创建 SpringApplication


## 4.2.2 启动 SpringApplication


## 4.2.3 应用退出


## 4.3 小结



# 第5章 Spring Boot 的AOP ⽀持


## 第5章 Spring Boot 的AOP ⽀持







## 5.1 Spring Framework 的AOP

回顾⋯


## 5.1.1 AOP 术语


## 5.1.2 通知类型


## 5.2 Spring Boot 使用 AOP






## 5.3 AOP 的开关

@EnableAspect/AutoProxy.•111


## 5.3.1 AspectAutoProxyRegistrar


## 5.3.2 AnotationAwareAspect/Auto

ProxyCreator：


## 5.4 小结




## 第2部分 Spring Boot 的⽣命周期原理分析



# 第6章 Spring Boot 准备容器与环境


## 第6章 Spring Boot 准备容器与环境

创建 SpringApplication：


## 6.1.1 推断Web 环境




## 6.1.2 设置初始化器


## 6.1.3 设置监听器


## 6.1.4 确定主启动类


## 6.1.5 与 Spring Boot 1.x 的区别


## 6.1.6与 Spring Boot 2.4.x的

区别…

启动 SpringApplication、


## 6.2.1 前置准备





## 6.2.2 获取 SpringApplicationRun

Listeners…•••••••••

准备运⾏时环境…


## 6.3IOC 容器的创建与初始化

打印Banner…••••


## 6.3.2 创建IOC容器


## 6.3.3初始化IOC容器


## 6.3.4 刷新IOC容器







## 6.3.5 Spring Boot 2.4.x 的

新特性…


## 6.4 IOC容器刷新后的回调




## 6.5 小结



# 第7章IOC 容器的刷新


## 第7章IOC 容器的刷新


## 7.1 初始化前的预处理


## 7.1.1 初始化属性配置


## 7.1.2 初始化早期事件的集合







## 7.2 obtainFreshBeanFactory

初始化 BeanFactory… 154


## 7.2.1 注解驱动的 refreshBean

Factory•.• …155


## 7.2.2 XML 驱动的 refreshBean

Factory.•••••• …155


## 7.3 prepareBeanFactory -BeanFactory

的预处理动作⋯ ⋯•••••••••••⋯156


## 7.3.1 ApplicationContextAware

Processor…••••.•. •157


## 7.3.2 ⾃动注入的⽀持


## 7.3.3 ApplicationListenerDetector 


## 7.4 postProcessBeanFactory

BeanFactory的后置处理•


## 7.4.1 回调⽗类方法


## 7.4.2 组件扫描&解析⼿动传入的

配置类……





## 7.5.5 BeanFactoryPostProcessor


## 7.5

重要的后置处理器：Configuration


## 7


## 7.6

子类扩展的


## 7

清除缓存


## 7.5 invokeBeanFactoryPost

Processors—执⾏ BeanFactory

PostProcessor.…………………164


## 7.5.1 现有的后置处理器分类


## 7.5.2 执⾏最⾼优先级的 BeanDefinition

RegistryPostProcessor•••. ••165


## 7.5.3 执⾏其他 BeanDefinition

RegistryPostProcessor . … 166


## 7.5.4 回调 postProcessBeanFactory

方法…… ：167


执⾏ BeanFactoryPostProcessor•168


## 7.5

ClassPostProcessor ••••••• …•169

registerBeanPostProcessors

初始化 BeanPostProcessor…185


## 7.6.1 BeanPostProcessorChecker


## 7.6.2 MergedBeanDefinitionPost

Processor 被重复注册...⋯187

PriorityOrdered 类型的后置

处理器…….........................….188


## 7.7 initMessageSource- -初始化

国际化组件… ：188


## 7.8initApplicationEventMulticaster

初始化事件⼴播器… ：190


## 7.9 onRefresh

刷新动作… ：191


## 7.10registerListeners -注册



## 7.11finishBeanFactoryInitialization-

初始化剩余的单实例bean对象…••192


## 7.11.1 beanFactory preInstantiate

Singletons… ：193


## 7.11.2 getBean


## 7.11.3 createBean


## 7.11.4 doCreateBean


## 7.11.5 SmartinitializingSingleton


## 7.12 finishRefresh

动作…

-刷新后的


## 7.12.1 LifecycleProcessor




## 7.12.2 getLifecycleProcessor0

oonRefresh0 .... …217

resetCommonCaches-


目录I


## 7.14 ApplicationContext 初始化中

的扩展点… ：218


## 7.14.1 invokeBeanFactoryPost

Processors .••••• …218


## 7.14.2 finishBeanFactoryInitialization


## 7.15 循环依赖的解决方案


## 7.15.1 循环依赖的产⽣


## 7.15.2 循环依赖的解决模型


## 7.15.3基于 setter/@Autowired 的



## 7.15.4 基于构造方法的循环依赖


## 7.15.5 基于原型Bean 的循环依赖


## 7.15.6 引入AOP的额外设计



# 第8章 Spring Boot 容器刷新扩展


## 第8章 Spring Boot 容器刷新扩展

嵌入式Web 容器⋯ •233


## 8.1 嵌入式 Tomcat简介


## 8.1.1 嵌入式 Tomcat 与普通Tomcat


## 8.1.2 Tomcat 整体架构


## 8.1.3 Tomcat 的核心工作流程 


## 8.2 Spring Boot 中嵌入式容器


## 8.2.1 WebServer


## 8.2.2 WebServerFactory





## 8.2.3ServletWeb ServerFactory 和

ReactiveWebServerFactory.237


## 8.2.4ConfigurableServletWebServer

Factory...... ：237


## 8.3 嵌入式 Web 容器的初始化


## 8.3.1 创建 WebServer


## 8.3.2 Web 容器关闭相关的回调


## 8.4 嵌入式 Tomcat 的初始化


## 8.4.1 获取 Context


## 8.4.2 阻⽌ Connector 初始化


## 8.4.3 启动 Tomcat


## 8.4.4 阻⽌ Tomcat结束


## 8.5 嵌入式 Tomcat 的启动


## 8.6 小结



# 第9章 AOP模块的⽣命周期


## 第9章 AOP模块的⽣命周期













## 9.1 @EnableAspectJAutoProxy-250


## 9.2AnotationAwareAspectJAuto

ProxyCreator.


## 9.2.1 类继承结构




## 9


## 9


## 10


## 10.2


## 10.2


## 10.3


## 10


## 10


## 10.3.2 TransactionManagement


## 10.3


## 10.3

声明式事务的控制全流程


## 10.4


## 10.4


## 10.5


## 11


## 12



## 9.2.2 初始化时机


## 9.2.3 作用时机


## 9.3 Advisor 与切⾯类的收集… 257


## 9.3.1 收集增强器的逻辑


## 9.3.2 收集原⽣增强器


## 9.3.3 解析 Aspect］切⾯封装增强器259

TargetSource 的设计… …266


## 9.4.1 TargetSource 的设计 267


## 9.4.2 TargetSource 的好处： 267


## 9.4.3 TargetSource 的结构


## 9.4.4 Spring Framework 中提供的

TargetSource …•••••• …268


## 9.5 代理对象⽣成的核心

wraplfNecessary … …268


## 9.5.1 getAdvicesAndAdvisorsFor

Bean…...... •269


## 9.5.2 createProxy 


## 9.6 代理对象的底层执⾏逻辑


## 9.6.1 DemoService#save• 277


## 9.6.2 获取增强器链


## 9.6.3 执⾏增强器


## 9.6.4 JDK 动态代理的执⾏底层


## 9.6.5 AspectJ 中通知的底层实现


## 9.7AOP通知的执⾏顺序对⽐


## 9.7.1 测试代码编写


## 9.7.2 Spring Framework 5.x 的顺序


## 9.7.3 Spring Framework 4.x 的顺序291

小结… •292


## 第3部分 Spring Boot 整合常用开发场景



# 第10章 SpringBoot 整合 JDBC


## 第10章 SpringBoot 整合 JDBC


## 10.1 Spring Boot 整合JDBC

项目搭建⋯•


## 10.1.1 初始化数据库


## 10.1.2 整合项目


## 10.1.3 编写测试代码

整合JDBC后的⾃动装配

配置数据源.…

创建 JdbcTemplate


## 10.2.3 配置事务管理器


## 10.3 声明式事务的⽣效原理

TransactionAutoConfigur-












ConfigurationSelector： …305

AutoProxyRegistrar… …305

ProxyTransactionManagement

Configuration••. •307


CglibAopProxy#intercept •••309

TransactionInterceptor ••••310

声明式事务的传播⾏为控制•319


## 10.5.1 修改测试代码

PROPAGATION_REQUIRED.321


## 10.5.3 PROPAGATION_REQUIRES_

NEW… …327


## 10.6 小结



# 第11章 Spring Boot 整合 MyBatis


## 第11章 Spring Boot 整合 MyBatis


## 11.1 MyBatis 框架概述

Spring Boot 整合 MyBatis

项目搭建…


## 11.3 ⾃动装配核心


## 11.3.1 场景启动器的秘密





## 11.3.2 MybatisLanguageDriverAuto

Configuration⋯ ⋯335


## 11.3.3 MybatisAutoConfiguration 


## 11.4 小结• 342

第12 章 Spring Boot 整合 WebMvC.…343


## 12.1 整合 WebMvc 的核心

⾃动装配……

WebMvc 的核心组件


## 12.2.1 DispatcherServlet


## 12.2.2 Handler


## 12.2.3 HandlerMapping


## 12.2.4 HandlerAdapter


## 12.2.5 ViewResolver









## 12.3 @Controller 控制器装配原理


## 12.3.1 初始化 RequestMapping

的入⼜……


## 12.3.2 processCandidateBean


## 12.3.3 detectHiandlerMethods





## 13


## 12.4 DispatcherServlet 的工作

全流程解析…•••• …352


## 12.4.1 DispatcherServletfservice


## 12.4.2 processRequest


## 12.4.3 doService 


## 12.4.4 doDispatch


## 12.4.5 DispatcherServlet 工作

全流程小结⋯


## 12.5 小结





# 第13章 Spring Boot 整合 WebFlux374


## 第13章 Spring Boot 整合 WebFlux374


## 13.1 快速了解响应式编程与



## 13.1.1 命令式与响应式


## 13.1.2 概念和思想的回顾与引入


## 13.1.3 快速体会 Reactor 框架

快速使用 WebFlux… …380


## 13.2.1 WebMvc的开发风格


## 13.2.2 逐步过渡到 WebFlux


## 13.2.3 WebFlux 的函数式开发 


## 13.2.4 WebMvc与 WebFlux的

对⽐… …383

目录I


## 13.3 WebFlux 的⾃动装配


## 13.3.1 Reactive WebServerFactory

AutoConfiguration• …384


## 13.3.2 WebFluxAutoConfiguration385


## 13.3.3 WebFluxConfig


## 13.3.4 EnableWebFlux Configuration


## 13.3.5 WebFlux ConfigurationSupport


## 13.4 DispatcheriHandler 的传统

方式工作原理…


## 13.4.1 handle 方法概览


## 13.4.2 筛选 HandlerMapping 


## 13.4.3 搜寻 HandlerAdapter 并执⾏


## 13.4.4 返回值处理


## 13.4.5 工作流程小结.39S


## 13.5 DispatcherHiandler 的函数式

端点工作原理…


## 13.5.1 HandlerMapping的不同


## 13.5.2 HandlerAdapter 的不同


## 13.5.3 返回值处理的不同


## 13.5.4 工作流程小结


## 13.6 小结

• 396








# 第14章 运行 Spring Boot 应用


## 第14章 运行 Spring Boot 应用


## 14.1 部署打包的两种方式


## 14.1.1 以可独⽴运行jar包的





## 14.1.2 以war包的方式


## 14.2 基于jar 包的独⽴运行机制


## 14.2.1 可运行jar 包的前置知识


## 14.2.2 Spring Boot的可运行jar



## 14.2.3 JarLauncher 的设计及

工作原理… …407


## 第4部分 Spring Boot 应用的运行


## 14.3 基于 war 包的外部 Web 容器

运⾏机制……•


## 14.3.1 Servlet 3.0规范中引导应用


## 14.3.2 Spring BootServletlnitializer

的作用和原理…


## 14.4 Spring Boot 2.3 新特性

优雅停机…•••••••


## 14.4.1 测试优雅停机场景


## 14.4.2 优雅停机的实现原理


## 14.5 小结







## 1.1 Spring Framework

Spring Framework 是由 Rod Johnson 与 Juergen Hoeller 为⾸发起的⼀个开源的、松耦合的、

分层的、可配置的⼀站式企业级 Java 开发框架。它的核心是IOC与AOP，可以更容易地构建

企业级Java 应用，并且可以根据应用开发组件的需要，整合对应的技术。为了使读者更容易理

• IOC 与 AOP:Spring Framework 的两大核心特性，即控制反转（Inverse of Control,IOC）、

⾯向切⾯编程（Aspect Oriented Programming,AOP）。

• 松耦合：IOC 和AOP 两大特性可以尽可能地将对象之间的关系解耦。

• 可配置：提供外部化配置的方式，可以灵活地配置容器及容器中的 Bean。

• ⼀站式：覆盖企业级开发中的所有领域（包括 JavaWeb、分布式、微服务，甚⾄ Java SE、

GUI 项目等）。

• 第三方整合：Spring Framework 可以很方便地整合第三方技术（如持久层框架 MyBatis

和 Hibernate、表现层框架 Spring WebMvc 和 Struts2、权限校验框架 Spring Security 和

Shiro 等）。

的架构和框架存在的臃肿、低效等问题提出了质疑，并且积极寻找和探索解决方案。2004年

|第1章 Spring Boot 整体概述

总的来看，Spring Framework 是⼀个功能极其强大的基础框架，其设计考虑之周全，使得

⼏乎任何 Java 应用都可以从中受益。


## 1.1.1|Spring Framework 的历史

Spring Framework 的诞⽣是为了替代J2EE 时期的EJB 规范体系。EJB 作为初期流⾏的J2BE

企业级项目开发技术解决方案，设计过于复杂和笨重，导致当时的Java 开发者对EJB 不满，并

造成了⼀种自盾的现象：大家怀疑 EJB 难用，但又不敢说 EJB 难用。

在这些开发者中，有⼀小部分优秀且大胆的开发者敢于发声、敢于质疑，他们认为EJB的

确复杂且笨重，于是 Rod Johnson（也就是 Spring Framework 的创始人之⼀）在2002年写了

•本书，书名内 Expert One-on-One J2EE Design and Development，其中对当时 J2EE应用

Spring Framework 1.0.0横空出世。随后 Rod Johnson ⼜写了⼀本书，这本书在当时的J2EE开

发界引起了巨大轰动，它就是著名的 Expert One-on-One J2EE Development without EJB.Rod

Johnson 在这本书中直接指明完全可以不使用EJB 开发J2BE 应用，⽽是可以用⼀种更轻量级、

更简单的框架来代替，这就是 Spring Framework。

时间证明，使用了 Spring Framework 后的项目，在开发阶段的效率的确⽐EJB⾼，⽽且 Spring

Framework 提供的⼀些特性也⽐ EJB 强大。于是开发者开始慢慢转用 Spring Framework，并逐

步淘汰了 EJB。随着后续 Spring Framework 版本的迭代，加上越来越多的开发者使用和认可 Spring

Framework，如今它已经成⼒现代 Java EE 开发的标杆。


## 1.1.2 IOC与AOP

Spring Framework 的两大核心特性，分别是控制反转 （Inverse of Control, IOC）、⾯向切

⾯编程 （Aspect Oriented Programming,AOP）。

IOC的 直接体现，就是作为Spring Framework 的核心容器，这个核心容器⼜被称为IOC

容器，它在内部管理了基于 Spring Framework 的应用中会用到的所有组件（即Bean）。在实际

的项目开发中，可以通过⼀些模式注解（如ecomponent 等）标注在指定的类上，配合组件扫

描，可以实现组件装配到核心容器。如果使用带有特定意义的模式注解，则 Spring Framework

会认定其有特功能（如对于@Controller 注解标注的类，SpringWebMvc会认定其为⼀个 Web

Controller，具有请求处理、视图跳转等功能）。

容器除了可以管理bean 对象，还可以对这些对象进⾏增强，使其具有⼀些其他的特性（如

对于@Transactiona1 注解标注的类，在引入和开启事务管理期间，其方法执⾏时会⾃动应

用事务），⽽增强的核心就是依赖 AOP 技术。使用AOP 技术可以通过预编译/运⾏时动态代理

的方式，对目标对象动态添加功能特性。AOP 的应用可以使核心业务逻辑与系统级服务（如事

务控制、日志审计、权限校验等）分离，从⽽实现组件功能的“可插拔”。


## 1.2 Spring Boot 与 Spring Framework

简单了解 Spring Framework 后，下⾯聚焦 Spring Boot 框架。Spring Boot 本⾝不是⼀个新的

框架，⽽是基于 Spring Framework 之上进⾏的“⼆次封装”，因此 Spring Boot 的底层还是 Spring

⽽⽆须把⼀部分精⼒浪费在项目环境搭建和琐碎的配置上。

项目的运⾏。

置，以及构建企业级应用。

场景都提供了约定的默认配置，并基于⾃动装配机制，将场景中通常必需的组件都注册

好，以此来达到少配置、甚⾄不配置就能正常启动项目的效果。

赖都收集整理到⼀个依赖中，并在其中添加默认的配置，使项目开发中只需要导人⼀个

依赖，即可实现场景技术的整合。

查、监控指标、外部化配置等。


## 1.4 Spring Boot 的体系

Framework，基于 Spring Boot 的应用仍然是 Spring Framework 的应用，Spring Boot 做的只是帮

助开发者整合不同场景下的依赖，以及提供默认的配置等。可以这样理解，Spring Boot 是开发

者与 Spring Framework 之间的⼀道中间层，它帮助开发者完成部分基于 Spring Framework 的项

目的配置、管理、部署等工作，目的是为开发者“减负”，让开发者专注于项目中的业务开发，

另外注意⼀点，WebMvc 对于 Spring Boot ⽽⾔只是⽣态中的⼀个模块，通过引入 WebMvc

的依赖，可以使项目⽀持 SpringWebMvc 的开发，同时也会引入对应的嵌人式Web 容器来⽀撑

•Spring Boot 的核心特性

Spring Boot 设计之初的目的是简化基于 Spring Framework 的项目搭建和应用开发，⽽不

是替代 Spring Framework，因此Spring Boot 提供了以下⼏个核心特性来帮助开发者省略/简化配

• 约定大于配置（convention over configuration）：Spring Boot 对日常开发中⽐较常见的

• 场景启动器 starter:Spring Boot 对常用的场景都进⾏了整合，将这些场景中所需的依

• ⾃动装配：Spring Boot 基于 Spring Framework 的模块装配＋条件装配，可以在具体场景

下⾃动引入所需的配置类并解析执⾏，⽽且可以根据项目代码中已经配置的内容，动态

注册缺少/必要的组件，以此实现约定大于配置的效果。

• 嵌入式 Web 容器：Spring Boot 在运⾏时可以不依赖外部的web 容器，⽽是使用内部嵌

入式 Web 容器来⽀撑应用的运⾏。也正因如此，基于 Spring Boot 的应用可以直接以⼀

个单体应用的jar 包运⾏。

• ⽣产级的特性：Spring Boot 提供了⼀些很有用的⽣产运维型的功能特性，⽐如健康检


## 1.4 Spring Boot 的体系

截⾄编写本书时，Spring Boot 的版本已经发展到 2.5.x和2.6.x（2.7.x 和3.x也发布了⾥程

碑版本），已经整合了⾮常多的技术场景。以下内容列举了 Spring Boot ⽀持的常见场景整合。

• Spring WebMvc & SpringWebFlux- -Web 应用开发。

• Thymeleaf & Freemarker—Web 视图渲染。

• Spring Security—安全控制。

• Spring Data Access—数据访问（SQL & NOSQL）。

• Spring Cache—_缓存实现。

• Spring Message——消息中间件（JMS & AMQP）。

• Spring Quartz- ⼀定时任务。

只需导入对应的启动器依赖，之后编写少量配置甚⾄不配置，就可以达到场景整合的效果。另

所舌的表单。

|第1章 Spring Boot 整体概述

• Spring Distribution Transaction—分布式事务（JTA）。

• Spring Session分布式 Session。

• Container Image—容器镜像构建⽀持。

可以发现，Spring Boot 可以整合的技术场景⾮常多，项目需要用到特定的场景或技术时，

外，基于 starter 场景启动器的整合不需要开发者考虑版本问题，Spring Boot 早已帮助开发者考

虑并适配好，开发者只需导入后使用即可。

国提舌：本书使用 SpringWebMvc 指代基于 Servlet 的Web 开发，读者可能对 SpringWebMvc 的更熱悉

的叫法是 SpringMVC，这两者指代的是同⼀项技术。为了更好、更清楚地区分 WebMvc 与 WebFlux，

本书后续提到的所有 SpringMVC 统称 SpringWebMvC。


## 1.5 开发第⼀个 Spring Boot 应用

在本章的最后⼀节中，我们来构建⼀个最基本的 Spring Boot 应用。

②提舌：在开始进⾏第⼀个 Spring Boot 应用开发之前，先强调⼀下使用的 Spring Boot 版本。本书使用

的Spring Boot 版本主要有两个：2.3.11 与 2.5.3。之所以选择这两个版本，是考虑到两个重要的原

因。其⼀，Spring Boot 2.3.11 是基于 Spring Framework 5.2.x 的较新版本，⽽ Spring Boot 2.5.3 是基于

Spring Framework 5.3.x 的现⾏较新版本，两个 Spring Framework版本之间会有⼀些差异，因此本书

通过两个 Spring Boot 版本来顺势区分 Spring Framework 的版本。其⼆，Spring Boot 2.4.x 推出了⼀些

新的特性，这些特性与 Spring Boot 2.3.x 及之前版本的开发方式、底层实现有所不同，因此读者也需

要分别研究这两个 Spring Boot 大版本的底层设计。综合以上两个因素，加上本书编写的时间，最终

选择2.3.11和2.5.3这两个版本作为研究对象。


## 1.5.1 创建项目

创建基于 Spring Boot 项目的方式有很多种，本书主要回顾两种常用的方式。

1. 基于 Spring Initializer

在 Spring Boot 的官方网站中，OVERVIEW选项卡的底部有⼀个醒目的板块（⻅图1-1），它

告诉我们可以通过 Spring Initializer 来初始化基于 Spring Boot 的项目。

Quickstart Your Project

Bootstrap your application with Spring Initializr.

图 1-1 Spring Boot 的官方网站下方有跳转⾄ Spring Initializer 的入口

单击 Spring Initializr 即可跳转到在线的Spring 项目初始化向导网站，网站的界⾯是如图1-2

Project Language

表单中的可选项较多，简单说明如下。

Lombok


## 1.5 开发第⼀个 Spring Boot 应用|

= C spring initializr

C Maven Prya%

O Gradle Proiect

Dependencies ADD. CTRL +B

O Kotin

O Groovy

wa aependency selected

Spring Boot

200（5NAPSHOD O 2.6.0（M）

⑤254（NA-3HO2

O 2.4.10 （SNAPSHOT） 0 249

Prolect Metadata

croup cofn.example

Artiact Gemd

Name

⑦

GENERATE CTRL +9 EXPLORE CTRL + SPACE SHARE.•

图 1-2 Spring Initializer 的初始界⾯

• Project：项目创建工具，可选 Maven 或 Gradle。

• Language：项目编码所使用的开发语⾔，可选 Java、Kotlin、Groovy。

• Spring Boot：选择所使用的 Spring Boot版本（注意此处只能选择最新的3个大版本的

最新 RELEASE 版和紧跟着要“转正”的 SNAPSHOT版）。

• Project Metadata：项目的基本信息，包含 Group、Artifact、Spring Boot 启动类所在的

包、打包方式、Java语⾔版本等。

• Dependencies：项目所使用的依赖，这个位置可以搜索并选择 Spring Boot 预先准备好

的⼀些 starter 场景启动器（见图1-3）。

Web, secuity JPA, Actuator, Devtoos. Press Ctrl for multiple adds

Spring Native ［Experimental］

ICIAET SAIDDOET TCA COITICHBNCLSDIO CPHCaL

Spring Boot DevTools

Provides fast application restarts, LiveReload, and configurations for enhanced developmant experience

Java annotation ibrary which helps to reduice broilerplate code.

Spring Configuration Processor

Generate metadata for developers to offer contextual help and "code completior when working with

custcoaioh Kevs fek.dawcaionooDetesBmes

Spring Web

图1-3 搜索、选择项目所需的依赖

|第1章 Spring Boot 整体概述

选择好所需的依赖，之后就可以单击图1-2最下方的GENERATE 按钮了，⽣成的代码会以

［工程名.zip］的压缩包形式下载⾄本地。压缩包内的目录结构如图 1-4所舌。

之后解压该压缩包，用 IDE（Eclipse 或者 Intellij IDEA 等）导人项目即可。

当然，使用在线初始化向导的方式未免有些⿇烦，因此 Spring Boot 的开发团队给目前市场

上主流的 IDE 都做了内置的插件，可以使用 Spring Initializer 插件来更方便地创建基于 Spring

Boot 的项目。图1-5展舌了基于IDEA 的 Spring Initializer 项目创建入⼜。

國 D！\下載idemo.zipldemal

編 （E）查看（V）书笠（A）工興（T）帮助（H）

中 了. X

测试 复制

D：下或ldemo.zipldemol

Project sDK 1.8（w8 veraon 21.80.1612New

Cnoose Initializr Service URL

（# Default: mtos//start.sgnng.o

• Custon

Make sure vour nenc

1.gitignore

S Static Web

Tvnw

Ba Empty Project

2mvnw.cmd

com.ym

Cancel

图1-4 ⽣成的代码目录结构 图 1-5 IDEA 中整合的 Spring Initializer

后续的操作与在线 Spring Initializer 基本⼀致，包括填写的项目信息与依赖的选项也⾮常相

似（见图1-6），这⾥不再赘述。

lescripti lo project for Spring 8o0t

图1-6 项目的基本信息填写与在线 Spring Initializer ⼀致

2. 使用 Maven/Gradle ⼿动创建

使用 Spring Initializer 的方式本质上是使用初始化向导的固定代码模板⽣成 Maven/Gradle

项目。在实际的项目开发中更多的情况是⾃⾏⼿动创建。下⾯使用 IDEA 开发工具新建⼀个简

单的 Spring Boot 项目。

？提舌：本书后续的所有项目都使用本节创建的目录作为基准。了统⼀维护项目，此处会创建两个

项目（包含⼀个 parent 项目，用于统⼀管理版本）。

在 IDEA 中先创建⼀个空项目 Empty Project，再依次创建⼀个 parent模块和 quickstart模块。

创建完成后的项目结构如图1-7所示。


## 1.5 开发第⼀个 Spring Boot 应用|

~springboot-00-parent

>翻src

m pom.xml

~ Ba springboot-01-quickstart

vasrc

•翻main

M ajava

~ Bw com.linkedbear springboot.quickstart

@SpringBootQuickstartApplication

v aresources

sdapplication.properties

>翻test

mpom.xml

图1-7 最终创建完成的项目结构

其中 parent 模块的 pom.xm1 只需要继承 spring-boot-starter-parent 项目，定义

模块所使用的 Java 版本，如代码清单1-1所示。

】代码清单 1-1 springboot-00-parent的pom.xml 定义

<？xml version="1.0"encoding="UTF-8"？>

<project xmlns="http://maven.apache.org/POM/4.0.0"

xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"

xsi:schemaLocation="http://maven.apache.org/POM/4.0.0

http://maven.apache.org/xsd/maven-4.0.0.xsd">

<mode1version>4.0.0</modelVersion>

<Parent>

<grouPId>org.springframework.boot</groupId>

<artifactId>spring-boot-starter-parent</artifactId>

<version>2.3.11.RELEASE</version>

</parent>

<groupId>com.linkedbear.springboot</groupId>

<artifactid>springboot-00-parent</artifactId>

<version>1.0-RELEASE</version>

<Packaging>pom /packaging>

<modules>

</modules>

<module>../springboot-01-quickstart</module>

<Properties>

</properties>

</project>

<java.version>1.8</java.version>

代码清单1-2的quickstart模块继承⾃ parent 模块，并添加了 spring-boot-starter-web

依赖，即可完成基于 Webive 的场景整合，如代码清单1-2所舌。


## 1 代码清单 1-2 springboot-01-quickstart 的pom.xml定义

：？xml version="1.0"encoding="UTF-8"？>

project xmlns="http://maven.apache.org/POM/4.0.0'

@SpringBootApplication

1第1章 Spring Boot 整体概述

xmlns:xsi="http://www.w3.org/2001/XML.Schema-instance"

xsi:schemaLocation="http://maven.apache.org/POM/4.0.0

http://maven.apache.org/xsd/maven-4.0.0.xsd">

<parent>

<artifactId>springboot-00-parent</artifactid>

<groupId>com.linkedbear.springboot</groupId>

<version>1.0-RELEASE</version>

<relativePath>../springboot-00-parent/pom.xml</relativePath>

</parent>

<modelVersion>4.0.0</modelVersion>

<artifactId>springboot-01-quickstart</artifactId>

<Properties>

</properties>

<java.version>1.8</java.version>

<dependencies>

<dependency>

<groupId>org.springframework.boot</groupId>

<artifactid>spring-boot-starter-web</artifactId>

</dependency〉

</dependencies>

<build>

<Plugins>

<Plugin>

<groupid>org.springframework.boot</groupId>

<artifactId>spring-boot-maven-Plugin</artifactId>

</plugin>

</Plugins>

</build>

</project>

Spring Boot 主启动类⾮常简单，不再详细介绍，如代码清单1-3所舌。

1代码清单 1-3 Spring Boot 主启动类

public class springBootQuickstartApplication ｛

public static void main （Stringl］args）｛

springApplication.run（SpringBootQuickstartApplication.class, args）；

经过以上步骤后，⼀个最简单的Spring Boot 项目创建完成。


## 1.5.2 编写简单代码

下⾯编写⼀个简单的 Controller 来测试 WebMvc 场景的效果。在 com.linkedbear.

springboot.quickstart 包下新建⼀个 controller 包，并添加 Hel 1oController 类，

定义hel1o方法用于接受请求并响应，如代码清单1-4所示。

@RestController

项目已经正确创建完成。

需要极少量的配置甚⾄不需要任何配置，就可以成功整合所需的开发场景。


## 1.6 小结1

【代码清单 1-4 HelloController.java

public class HelloController ｛

@GetMapping（"/hel1o"）

public String hel10（）｛

return "he1l0 springboot"；

Q提示：使用@RestController 后 Controller 中所有被@RequestMapping 标注的方法相当于添加

了@ResponseBody注解，会将方法的返回值序列化沩 JSON 响应给客户端。

代码编写完成后，程序运⾏的预期是启动项目，访问/he11o 请求，可以响应"he110

springboot"的字符串内容。

运⾏ SpringBootQuickstartApplication 主启动类，控制台会打印 Tomcat started

on port （S）：8080 （http）with context path''，说明项目已经成功启动。在浏览器

中访问 http://ocalhost:8080/hello，可以成功响应（见图1-8），说明 springboot-01-quickstart

③ lacalhost:8080/hello ×

localhost:8080/hello

hello springboot

图1-8 hello 请求可以成功响应


## 1.6 小结

本章主要回顾了 Spring Framework 的基本知识与核心特性、Spring Boot的体系与核心特

性，以及使用 IDEA 创建简单的 Spring Boot 项目。Spring Boot 本⾝是基于 Spring Framework 之

上封装的更易于开发的〝脚⼿架”，借助Spring Boot约定大于配置的原则，在创建项目时，只

第

章

在进入本章的介绍之前，请先⾃⾏思考下⾯这⼏个问题。

先了解组件装配及相关概念。

可以理解为组件。要理解组件装配，⾸先需要理解组件的概念。

Spring Boot 的⾃动装配


本章主要内容：

◎理解组件装配的概念和设计；

今 Spring Framework 的模块装配；

今 Spring Framework 的条件装配；

今 Spring Framework 3.2 特性——SPI 机制；

今 Spring Boot 的装配机制与@EnableAutoConfiguration 核心注解分析；

◎ WebMvc 场景下的⾃动装配原理分析。

Spring Boot 中最重要的特性之⼀是“约定大于配置”，这在第1章的简单舌例项目中已经

展现得淋漓尽致。仅需导入⼀个场景启动器，⽆须编写任何配置，应用即可运⾏在8080端⼜上。

• 为什么导人WebMvc场景启动器后，即使没有编写任何配置代码，应用也可以正常启动？

• Spring Boot 如何确定引入的技术场景中需要哪些重要组件？

• 为什么项目在没有配置任何Web 容器的情况下也可以正常启动Web 服务？

提舌：上述提到的Web 容器指的是包括 Tomcat、Jetty、Undertow 等 Servlet 容器以及 Netty 等⾮阻

塞 Web 容器在内的所有能部署 Web 项目的应用服务器。由于 Spring Boot 2.x 不仅⽀持基于 Servlet

的 Web 开发，还引入了 SpringWebFlux 的异步⾮阻塞式 Web 开发，因此此处不单指 Servlet 容器或

者 NIO 容器，⽽是以 Web 容器统称。

如果没有特殊说明，本书后续出现的所有 Web 容器均指代 Servlet 容器和 NIO 容器。

想要了解 Spring Boot 底层完成的工作，最重要的是掌握 Spring Boot 的⾃动装配机制。⾃

动装配本⾝是⼀个相对新的概念，它基于 Spring Framework 原⽣组件装配进⾏了延伸。下⾯⾸


## 2.1 组件装配

Spring Framework 本⾝有⼀个IOC容器，该容器中会统⼀管理其中的bean 对象，bean 对象


## 2.1.1 组件

基于 Spring Framework 的应用在整合第三方技术时，要把第三方框架中的核心API 配置到

件或注解配置类的⾏为称为组件装配。

装配和⾃动装配的概念简单展开解释。

的三种方式都是⼿动装配的体现。

@Component

从上述代码中可以提取出⼀个共性：⼿动装配都需要亲⾃编写配置信息，将组件注册到

容器中。相较于⼿动装配，⾃动装配关注的重点是整合的场景，⽽不是每个具体的场景中所需

以基于开发者⾃定义注册的组件装配其他必要的组件，并合理地替换默认的组件注册（即覆盖


## 2.1 组件装配|

Spring Framework 的配置⽂件或注解配置类中，以供 Spring Framework 统⼀管理。此处的配置

是关键，通过编写 XML 配置⽂件或注解配置类，将第三方框架中的核心API 以对象的形式注

册到IOC 容器中。这些核心API 对象会在适当的位置发挥其作用，以⽀撑项目的正常运⾏。IOC

容器中的核心API 对象本⾝就是⼀个个的bean 对象，即组件；将核心API 配置到 XML 配置⽂

Spring Framework 本⾝只有⼀种组件装配方式，即⼿动装配，⽽ Spring Boot 基于原⽣的⼿

动装配，通过模块装配+条件装配+SPI 机制，可以完美实现组件的⾃动装配。下⾯分别就⼿动


## 2.1.2 ⼿动装配

所谓⼿动装配，指的是开发者在项目中通过编写 XMIL 配置⽂件、注解配置类、配合特定注

解等方式，将所需的组件注册到IOC 容器（即 ApplicationContext）中。代码清单2-1中

代码清单2-1 三种⼿动装配方式

<！-- 基于 XMI 配置⽂件的⼿动配置—->

<bean id="person" class="com.linkedbear.springboot.component.Person" />

// 基于注解配置类的⼿动装配

@Configuration

public class Exampleconfiguration ｛

dean

public Person person （）｛

return new Person（）；

// 基于组件扫描的⼿动装配

public class DemoService ｛

@Configuration

@ComponentScan（"com.linkedbear.springboot"）

public class ExampleConfiguration ｛｝

IOC容器中。


## 2.1.3 ⾃动装配

Spring Boot 的核心特性之⼀是组件的⾃动装配。⾃动装配的核心是，本应该由开发者编写

的配置，转为框架⾃动根据项目中整合的场景依赖，合理地做出判断并装配合适的Bean 到10C

的组件。鉴于关注的重点和粒度，⾃动装配更应该考虑应用全局的组件配置。Spring Boot 利用

模块装配+条件装配的机制，可以在开发者不进⾏任何⼲预的情况下注册默认所需的组件，也可

有特殊说明，所使用的所有配置均基于注解驱动。

的模块。

上述的部分注解会在后续章节中出现，目前暂不介绍。

模块可以理解成⼀个个可以分解、组合、更换的独⽴单元。模块与模块之间可能存在⼀定

的依赖，模块的内部通常是⾼内聚的，⼀个模块通常用于解决⼀个独⽴的问题（⽐如引入事务

看作⼀个个模块，项目底层封装的⼀个个组件也可以看作模块。

简单总结起来，模块通常具有以下⼏个特性：

I第2章 Spring Boot 的⾃动装配

默认配置）。由此可以概括⼀点：Spring Boot 的⾃动装配具有⾮侵入性。

例如，当整合 sPring-jdbc 时，如果项目中已经注册了 Jdbcremplate，则 Spring Boot

提供的默认的 JdbcTemplate 就不会再创建。

同时，Spring Boot 的⾃动装配可以实现配置禁用，通过在@SpringBootApplication

或者@EnableAutoConfiguration 注解上标注 exclude/excludeName 属性，可以禁用默

认的⾃动配置类。这种禁用方式在 Spring Boot 的全局配置⽂件中声明spring.autoconfigure.

exclude 属性时同样适用。

Spring Boot 的⾃动装配所用的底层机制全部来⾃ Spring Framework。下⾯先了解和回顾

Spring Framework 的基础知识。

提舌：由于 Spring Boot 本⾝已不推荐使用XML 配置⽂件的方式构建应用，因此后续内容中如果没


## 2.2 Spring Framework 的模块装配

模块装配是⾃动装配的核心，它可以把⼀个模块所需的核心功能组件都装配到IOC 容器中，

并保证装配的方式尽可能简单。Spring Framework 中引入模块装配的表现形式是在3.1 版本后

引入大量Enablexxx注解，通过标注@EnablexXx 系列注解，可以实现快速激活和装配对应

当下主流的 Spring Boot 版本是2.x，对应的 Spring Framework 版本是5.x，但是从5.x 的官

方⽂档中已经很难找到@EnablexxX的介绍，读者可以在 Spring Framework 3.1.0的官方⽂档的


## 3.1.5 节中找到介绍@Enablexxx注解的使用，该⽂档中提供了⼀些舌例，舌例中不乏有读者可

能熟悉的以下注解。

• @EnablerransactionManagement： 开启注解事务驱动。

• EnableWebMvc：激活 SpringWebMvc 整合 Web 开发。

• EnableAspectJAutoProxy：开启注解 AOP编程。

• @EnableScheduling：开启调度功能（定时任务）。

模块装配围绕的核心是“模块”。下⾯先理解模块的概念。


## 2.2.1 模块

模块是为了处理数据库操作的ACID特性）。按照上述理解，可以将项目开发中编写的功能代码

• 独⽴的；

• 功能⾼内聚；

理解模块的概念后，下⾯通过⼏个舌例快速体会模块装配的设计。在开始之前请读者记住

为了更好地让读者体会模块装配的设计，这⾥假设⼀个场景：使用代码模拟构建⼀

作⼀个个组件。使用代码模拟实现的最终目的是，可以通过⼀个注解，把以上元素全部

填充到酒馆中。

者可以在练习时⾃⾏发挥。

现类，以及普通类。

@Documented


## 2.2 Spring Framework 的模块装配|

• 可相互依赖；

• 目标明确。


## 2.2.2 快速体会模块装配

使用模块装配的核心原则：⾃定义注解+@Import导入组件。

1.模块装配场景

个酒馆，酒馆⾥有吧台、调酒师、服务员和⽼板 4种不同的实体元素。在该场景中，酒

馆可看作 ApplicationContext，酒馆⾥的吧台、调酒师、服务员、⽼板等元素可看

提舌：假设的场景仅配合代码完成演舌，对于其中具体的结构设计，本书不过多深入，感兴趣的读

目标明确后，下⾯开始动⼿实操。⾸先实现最简单的装配方式：普通 Bean 的装配。

2. 声明⾃定义注解

示例场景的目标是构建⼀个酒馆，根据 Spring Framework 对于模块装配的注解命名⻛格，

此处定义⼀个⾃定义注解EnableTavern，如代码清单2-2所示。

代码清单 2-2 @EnableTavern 注解的声明

aDocumented

@Retention （RetentionPolicy.RUNTIME）

@rarget （ElementType.TYPE）// 该注解只能标注在类上

public einterface EnableTavern ｛

W 提示：⾃定义注解上应标注必要的元注解，代表该注解在运⾏时起效，并且只能标注在类上。

要使EnableTavern注解发挥作用，需要配合模块装配中的最核心注解@Import，该注

解要标注在@Enableravern上，且注解中需要传入value 属性的值。借助IDE 可以了解@Import

注解的使用方式，如代码清单2-3所示。value 属性的⽂档注释中已经写明，@Import注解可

以导人配置类、ImportSelector 的实现类、ImportBeanDefinitionRegistrar 的实

代码清单2-3 @Import 注解

@Target （ElementType.TYPE）

@Retention（RetentionPolicy.RUNTIME）

public einterface Import ｛

/**

要声明任何属性和方法。

使用的，⽽本节内容不会涉及组件扫描机制。

@Documented

核心代码编写完毕，最后编写⼀个测试启动类，以检验组件装配的效果。测试启动类如代

【第2章 Spring Boot 的⾃动装配

*｛@link Configuration @Configuration｝， ｛@link ImportSelector｝，

*｛@link ImportBeanDefinitionRegistrar｝，or regular component classes to import.

*/

Class<?>［lvalue （）；

3. 声明⽼板类

本节先演示普通类的导人。酒馆必须由⽼板经营，下⾯定义⼀个“⽼板”类，该类中不需

public class Boss ｛｝

w提示：注意Boss类中不需要标注@Component 注解，因汐@Component是需要配合@ComponentScan

接下来在@Enableravern 的@Import注解中填入Boss 类，如代码清单2-4所示，这就

意味着如果⼀个配置类上标注了@Enableravern 注解，就会触发@Import 的效果，向容器中

导入⼀个 Boss 类的 Bean。

I代码清单2-4 将 Boss 类标注到@EnableTavern注解中，代表装配⼀个 Boss 类对象

@Retention （RetentionPolicy.RUNTIME）

@Target （ElementType.TYPE）

@Import （Boss.class）

public @interface EnableTavern｛

4. 创建配置类

注解驱动的测试离不开配置类。接下来声明⼀个 TavernConfiguration 配置类，并标

注@Configuration 和EnableTavern 注解。TavernConfiguration 中不需要定义其他

内容，也⽆须注册其他 bean 对象，如代码清单2~5所示。

代码清单2-5 添加新的注解配置类 TavernConfiguration

@Configuration

EnableTavern

public class TavernConfiguration ｛ ｝

5. 编写启动类测试

码清单2-6所示。

1代码清单2-6 测试装配普通类

public class TavernApplication ｛

Pubiie static void main（stringllargs）！ApplicationContext ctx = new AnnotationConfigApplicationContext （TavernConfiguration.

class）；

⽽其余⼏种类型更为重要。

考虑到在真实场景中，酒吧的调酒师通常不⽌⼀位，因此调酒师的模型类中需要定义⼀个

@Configuration


## 2.2 Spring Framework 的模块装配|

Boss boss = ctx.getBean （Boss.class）；

System.out.println （boss）；

通过运⾏ main 方法，可以发现使用getBean 能够正常提取 Boss 对象，说明Boss 类已

经被注册到IOC容器中，并创建了⼀个对象，以此就完成了最简单的模块装配。

com.linkedbear.springboot.assemble.a_module.component.Boss@b9afc07


## 2.2.3 导人配置类

到这⾥可能有读者会产⽣疑惑：原本通过@Configuration + @Bean 注解就能完成的工

作，换用@Import 注解后代码量却增加了，这不是“徒增功耗”吗？如果你也有这种疑问，请

不要着急，仔细观察@Import 的value 属性允许传入的类，可以发现普通类是最简单的方式，

如果需要直接导入项目中现有的⼀些配置类，使用@Import也可以直接加载进来。本节会

编写⼀个有关调酒师的独⽴配置类，并通过@Import 注解导人。

1.声明调酒师类

name 属性，以对不同的调酒师加以区分，如代码清单2-7所示。

代码清单 2-7 调酒师的模型类

public class Bartender｛

Private String name；

public Bartender （String name）｛

this.name = name；

1/ getter ……•

2. 注册调酒师对象

通过注解配置类的方式，可以⼀次性注册多个相同类的 bean 对象。下⾯编写⼀个配置类

BartenderConfiguration，并用@Bean注册两个不同的Bartender 类，如代码清单 2-8

所示。

代码清单 2-8 注册调酒师的配置类 BartenderConfiguration

public class BartenderConfiguration ｛

@Bean

public Bartender zhangxiaosan（）｛

return new Bartender（"张小三"）；

只需把BartenderConfiguration 移⾄其他包中，从⽽使组件扫描时找不到它。

tavernConfiguration

zhangdasan

I第2章 Spring Boot 的⾃动装配

@Bean

Public Bartender zhangdasan （）｛

return new Bartender（"张大三"）；

此处注意，如果读者用IDEA编码开发，此时这个类会有⻩⾊警告，提示配置类 Bartender

Contiguration 还没有被使用（事实也确实如此，目前的代码中并没有用到它）。想让

BartenderConfiguration 起作用，只需在@EnableTavern 的@Import 中把这个配置类

⼀并导人，如代码清单2-9所示。

1代码清单 2-9 在@EnableTavern 注解中添加 BartenderConfiguration 配置类

@Import （｛Boss.class, BartenderConfiguration.class｝）

Public @interface Enableravern ｛｝

w提示：注意此处有⼀个细节，如果读者在⾃⾏练习时编写的启动类或者配置类上使用了组件扫描（包

扫描），恰好把这个配置类扫描到了，就会导致即使没有使用@Import 导入配置类

BartenderConfiguration, Bartender 调酒师也会被注册到IOC容器中。这⾥⼀定要细心，组件扫

描本身会扫描配置类，并且会使其⽣效。如果既想用包扫描⼜不想扫描到 BartenderConfiguration，

3.测试运⾏

修改启动类，使用ApplicationContext 的 getBeansOfType 方法可以⼀次性提取出

IOC 容器中指定类的所有 bean 对象，如代码清单2-10所示。

代码清单2-10 测试装配配置类

public static void main （String［］ args） ｛

AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext（Tavern

ConiiguLation.CLass）i

stream.of （ctx.getBeanDefinitionNames （））.forEach （System.out： ：println）；

System.out.println（"------------------- ------"）；

Map<String， Bartender> bartenders = ctx.getBeansOfType （Bartender.class）；

bartenders.forEach （（name,bartender）-> System.out.println （bartender））；

通过运⾏ main 方法，可以发现控制台成功打印出两个调酒师对象，说明注解配置类的装

配正确完成。

// IOC 内部的组件已省略打印

com.linkedbear.springboot.assemble.a_module.component.Boss

com.linkedbear.springboot .assemble.a_module.config.BartenderConfiguration

Zhangxiaosan

com.linkedbear.springboot.assenble.a_module.component.Bartender@23bb8443

com.linkedbear.springboot .assemble.a_module.component.Bartender@1176dcec

多个注解）决定导入哪些配置类。

吧台的模型类设计也是定义⼀个最简单的类即可，⽆须过度设计。

的配置类，演示两种类皆可。

@Configuration


## 2.2 Spring Framework 的模块装配|

提示：注意⼀个细节，BartenderConfiguration 配置类也被注册到 IOC 容器中，并成为⼀个

Beano.


## 2.2.4 导人 ImportSelector

借助 IDE 打开 ImportSelector，会发现它是⼀个接⼜，它的功能可以从javadoc 中读到

-些信息：

Interface to be implemented by types that determine which @Configuration class（es） should be

imported based on a given selection criteria, usually one or more annotation attributes.

ImportSelector 是⼀个接⼜，它的实现类可以根据指定的筛选标准（通常是⼀个或者

⽂档注释阐述的关键是 ImportSelector 可以导人配置类，但其实它也可以导入普通类。

被 ImportSelector 导人的类，最终会在 IOC 容器中以单实例 Bean的形式创建并保存。下

⾯演舌 ImportSelector 如何使用。

1. 声明吧台类+配置类

Public class Bar ｛

ImportSelector 不仅可以导人配置类，也可以导人普通类，代码清单2-11 中是⼀个新

代码清单 2-11 BarConfiguration 配置类中注册Bar

public class BarConfiguration ｛

@Bean

Public Bar bbbar（）｛

return new Bar （）；

2. 编写 ImportSelector 的实现类

接下来是 ImportSelector的实现类，新定义⼀个 BarImportSelector，以实现

ImportSelector 接口并实现对应的 selectImports 方法，如代码清单2-12所示。

1代码清单 2-12 BarlmportSelector 实现 ImportSelector 接口

public class BarImportSelector implements ImportSelector ｛

@override

public stringl］ selectImports（AnnotationMetadata importingClassMetadata）｛

return new string［01；

注意，selectImports 方法的返回值是⼀个 String类型的数组，要获知这样设计的目

的，需要参考 selectImports 方法的⽂档注释：

类名。

tavernConfiguration

zhangxiaosan

bbbar

到这⾥读者可能会觉得很奇怪：上⾯示例中是直接取现有类的全限定名，这种设计似乎使

|第2章 Spring Boot 的⾃动装配

Select and return the names of which class（es） should be imported based on the AnnotationMetadata

of the importing @Configuration class.

根据导入的@Configuration 类的 AnnotationMetadata 选择并返回要导入的类的

这⾥要强调的重点是：返回⼀组类名（⼀定是全限定类名，因为如果没有全限定类名就⽆法

定位具体的类）。由此就在这⾥把上⾯定义的Bar 和BarConfiguration 的类名写人，如代码清

单2-13所示。

】代码清单2-13 selectlmports 方法返回要注册的 Bean 的全限定类名

Public Stringl］ selectImports （AnnotationMetadata importingClassMetadata）｛

return nev Stringll ｛Bar.class.getName（），BarConfiguration.class.getName （）｝；

最后在@EnableTavern 的@Import注解中将 BarImportSelector 导人即可，如代码清

单2-14所舌。

』代码清单 2-14 在@EnableTavern 注解中添加 BarlmportSelector 导入

@Import （｛Boss.class, BartenderConfiguration.class, BarImportSelector.class｝）

public @interface EnableTavern ｛｝

3.测试运⾏

修改启动类的 main 方法。为了更明显地体现出容器中的bean 对象，这次只打印 IOC容

器中所有 bean 对象的名称。运⾏ main 方法，控制台会打印出两个 Bar（下列代码中倒数第⼀

⾏和第三⾏），说明 ImportSelector 可以导入普通类和配置类。


## 11 IOC 内部的组件已省略打印 

com.linkedbear.springboot.assemble.a_module.component.Boss

com.linkedbear.springboot.assemble.a_module.config.BartenderConfiguration

2aaac0asan

com.linkedbear.springboot.assemble.a_module.component.Bar

com.linkedbear.springboot.assemble.a_module.config.BarConfiguration

Q提示：注意⼀个细节，BarImportSelector 本身没有注册到IOC容器中。

4. ImportSelector 的灵活性

复杂度变⾼了！但是请读者明⽩⼀点：ImportSelector 的核心是可以使开发者采用更灵活

的声明式向IOC 容器注册 Bean，其重点是可以灵活地指定要注册的Bean 的类。由于是传入

全限定名的字符串，那么如果这些全限定名以配置⽂件的形式存放在项目可以读取的位置，是

不是可以避免组件导入的硬编码问题？因此 ImportSelector 的作用⾮常大，在 Spring Boot 的

⾃动装配中，底层就是利用了 ImportSelector，实现从 spring.factories ⽂件中读取

⾃动配置类，2.5节中将会讲到。

离最后的酒馆建成只剩下⼀组服务员类，同样以最简单的模型类定义即可。

对于这⾥的写法读者先不必仔细研究，可以先跟着示例代码写⼀遍。这⾥简单解释⼀下


## 2.2 Spring Framework 的模块装配|


## 2.2.5 导人 ImportBeanDefinitionRegistrar

如果说 ImportSelector 是以声明式导人组件，那么 ImportBeanDefinitionRegistrar

可以解释为以编程式向 IOC容器中注册 bean 对象，不过它实际导人的是 BeanDefinition

（Bean 的定义信息）。有关BeanDefinition 的详细讲解可以参考3.5节，此处不展开讲解，

读者在这⾥先对 ImportBeanDefinitionRegistrar 有⼀些快速的了解即可，后⾯在第7

章中会详细讲解 ImportBeanDefinitionRegistrar 的获取和引导回调的原理。

1. 声明服务员类

Public class Waiter ｛｝

提示：这⾥没有把服务员的模型类设计得很复杂，因为本节的目的是使读者了解和学会模块装配，

⽽不是仔细研究 BeanDefinition 的复杂Bean定制。

2. 编写 ImportBeanDefinitionRegistrar 的实现类

接下来编写 WaiterRegistrar，使它实现 ImportBeanDefinitionRegistrar 接口，

如代码清单2-15所示。

代码清单 2-15 WaiterRegistrar 实现 ImportBeanDefinitionRegistrar

public class WaiterRegistrar implements ImportBeanDefinitionRegistrar｛

COverride

public void registerBeanDefinitions （Annotat ionMetadata metadata, BeanDefinitionRegistry registry） ｛

registry.registerBeanDefinition（"waiter"， new RootBeanDefinition（Waiter.class））；

registerBeanDefinition 方法传人的两个参数，第⼀个参数是 Bean 的名称（即id），第⼆

个参数中传人的 RootBeanDefinition 要指定 Bean 的字节码（.class），这种方式相当于

向IOC容器中注册了⼀个普通的单实例bean（最终效果与组件扫描、@Bean 注解注册 Bean 的

效果相同）。

提舌：有关 BeanDefinition 的相关讲解，可参考3.5节。

最后把waiterRegistrar 标注在@Enableravern的@Import 注解中，即完成了

ImportBeanDefinitionRegistrar 的导人，如代码清单2-16所示。

代码清单 2-16 在@EnableTavern 注解中添加 ImportBeanDefinitionRegistrar 导入

@Import （｛Boss.class,BartenderConfiguration.class, BarImportSelector.class, WaiterRegistrar.class｝）

public @interface Enableravern ｛｝

3. 测试运⾏

直接重新运⾏ main 方法，控制台可以打印出服务员对象（下列代码中的最后⼀⾏），证明

使用 ImportBeanDefinitionRegistrar 的组件装配也成功了。

tavernConfiguration

zhangxiaosan

zhangdasan

bbbar

waiter

DeferredImportSelector 的处理时机是注解配置类完全解析后，此时配置类的解析工作已

所示。

⾏时机。



# 第2章 Spring Boot 的⾃动装配


## 第2章 Spring Boot 的⾃动装配

// IOC 内部的组件已省略打印……

com.Linkeaoear.Springboot.assemole.a module.component.Boss

Coll.LLnkeaoear.Springooot.asselore.a moauLe.component.bar

com.linkedbear.springboot .assemble.a_module.config.BarConfiguration

②提示：WaiterRegistrar 也没有注册到IOC容器中。


## 2.2.6 扩展：DeferredImportSelector

本节的最后扩展是 ImportSelector 的⼀个子接口 DeferredImportSelector，这个

接口来⾃ Spring Framework 4.0，它提供了类似于 ImportSelector 的组件装配机制，但执⾏

时机⽐普通的 ImportSelector 晚。这⾥先解释⼀下执⾏时机，ImportSelector 接⼜

的处理时机是在注解配置类的解析期间，此时配置类中的@Bean 方法等还没有被解析，⽽

全部完成，这样做的目的主要是为了配合下⾯要提到的条件装配（条件装配也来⾃ Spring

Framework 4.0，所以可以理解为它是配合工作的）。

下⾯通过⼀个简单的测试示例，体会 DeferredImportSelector 的执⾏时机。

1. DeferredlmportSelector 的执⾏时机

在上述测试代码中编写⼀个新的 WaiterDeferredImportSelector，使它实现

DeferredImportSelector，其作用是导人新的服务员 bean 对象，如代码清单 2-17

代码清单2-17 新增 WaiterDeferredlmportSelector 导入服务员

public class WaiterDeferredImportSelector implements DeferredImportSelector｛

@Override

public stringl］ selectImports （AnnotationMetadata importingClassMetadata） ｛

system.out.println（"WaiterDeferredImportSelector invoke ......"）；

return new Stringl］ ｛Waiter.class.getName （） ｝；

Q提示：注意代码中添加了⼀⾏控制台打印，这样可以便于观察到 DeferredImportSelector 的执

同样，为其余的两种组件 ImportSelector 和 ImportBeanDefinitionRegistrar

也添加上控制台打印，如代码清单2-18所示。

的条件装配时再来说明。

DeferredImportSelector 可以分组。

别提到。


## 2.2 Spring Framework 的模块装配|

代码清单 2-18 补充其他组件的控制台打印

public class BarImportSelector implements ImportSelector ｛

Boverride

public Stringl］ selectImports （AnnotationMetadata importingClassMetadata）｛

system.out.println（"BarImportselector invoke ••.."）；

return new Stringl］ ｛Bar.class.getName（），BarConfiguration.class.getName （）｝；

｝

public class WaiterRegistrar implements ImportBeanDefinitionRegistrar ｛

@Override

public void registerBeanDefinitions （AnnotationMetadata metadata, BeanDefinitionRegistry registry）｛

system.out.printIn（"WaiterRegistrar invoke ⋯…."）；

registry.registerBeanDefinition （"waiter"，new RootBeanDefinition （Waiter.class））；

测试之前，不要忘记给@Enableravern 注解的@Import 上补充 WaiterDeferred

ImportSelector 的导人。

如此编写完成后，重新运⾏ TavernAPP1ication，观察控制台的打印：

BarImportSelector invoke •

WaiterDeferredImportSelector invoke …..

WaiterRegistrar invoke….

可以发现，DeferredImportSelector 的执⾏时机⽐ ImportSelector 的确晚，但⽐

ImportBeanDefinitionRegistrar 早。⾄于什么要这样设计，下⾯讲到基于 Conditional

2. 扩展：DeferredlmportSelector 的分组概念

Spring Framework 5.0.5 中对 DeferredImportSelector 加入了新的概念：分组。简

单地理解，引入了分组的概念后可以对不同的DeferredImportSelector 加以区分。上

⾯在编写代码时读者可能没有感知到，实际上 DeferredImportSelector 有⼀个默认的

getImportGroup 方法，如代码清单 2-19 所示。

代码清单 2-19 DeferredlmportSelector 中添加了分组的概念

default Class<？ extends Group> getImportGroup （）｛

return null：

这个 getImportGroup 方法可以指定⼀个实现了 DeferredImportSelector.Group

接口的类型，其可以对 DeferredImportSelector 加以区分。不过读者不必对它

过于在意，在 Spring Framework 和 Spring Boot 中使用它的地方⾮常少，因此只需要了解

提示：Spring Boot 的⾃动装配部分有⼀个 DeferredImportSelector 分组特性的使用，2.5.3节会特

模块装配可以⼀次性导人⼀个场景中所需的组件，但如果只靠模块装配的内容，还不⾜以

实现完整的组件装配。仍以酒馆为例，如果将这套代码模拟的环境放到⼀⽚荒野，此时吧台还

在，⽼板还在，但是调酒师会因为环境恶劣⽽跑掉（荒郊野外不会有闲情逸致的人去喝酒），所


## 2.3

可以动态地注册与当前运⾏环境匹配的组件。

需求描述中提到，荒郊野外下调酒师不会再工作，在这种假设下调酒师就不会在荒郊野外

I第2章 Spring Boot 的⾃动装配


## 2.3 Spring Framework 的条件装配

以在这种场景下，调酒师就不应该注册到IOC容器了。在这种模拟的场景中，如果只使用模块

装配是⽆法实现的，因为只要配置类中声明了@Bean注解的方法，这个方法的返回值就⼀定会

被注册到IOC容器中，并最终成为⼀个 bean 对象。

因此，为了解决在不同场景/条件下满⾜不同组件的装配，Spring Framework 提供了两种条

件装配的方式：基于 Profile 和基于 Conditional。

基于 Profile 的装配

Spring Framework 3.1 中就已经引入了 Profile 的概念，下⾯先了解⼀下 Profile 的定义。

1. 理解 Profile

Spring Framework 的官方⽂档中并没有对Profile 进⾏过多描述，⽽是借助⼀篇官网的博客

⽂章来详细介绍 Profile 的使用，此外在@Profile 注解的javadoc 上也有⼀些简短的描述：

@Profile 注解可以标注在组件上，当⼀个配置属性（并不是⽂件）激活时，它才会起作用，

⽽激活这个属性的方式有很多种（启动参数、环境变量、web.xm］ 配置等）。

简单概括⼀下，Profile 提供了⼀种“基于环境的配置”：根据当前项目的不同运⾏时环境，

2. 使用@Profile 注解

下⾯来实际使用⼀下 Profile 机制，以满⾜上⾯提到的新需求：城市与荒野。

（1） Bartender 添加@Profile

的环境下存在，⽽只会在城市存在。用代码来表达，就是在注册调酒师的配置类上标注

@Profile，如代码清单 2-20所示。

1代码清单 2-20 为注册调酒师的配置类添加@Profile 注解

@Configuration

@Profile（"city"）

public class BartenderConfiguration ｛

4P2n

public Bartender zhangxiaosan（）｛

return new Bartender（"张小三"）；

@Bean

Public Bartender zhangdasan（）｛

return new Bartender（"张大三"）；

tavernConfiguration

bbbar

waiter

tavernConfiguration

com.linkedbear.springboot.assemble.b_profile.component.Boss

zhangxiaosan

zhangdasan

bbbar


## 2.3 Spring Framework 的条件装配|

（2）编程式设置运⾏时环境

如果现在直接运⾏ TavernProfileApPlication 的main 方法，控制台中不会打印

zhangxiaosan 和 zhangdasan（已省略⼀些内部的组件打印）：

com.linkedbear.springboot.assemble.b_profile.component.Boss

com.linkedbear.springboot.assemble.b_profile.component.Bar

com.linkedbear.springboot.assemble.b_profile.config.BarConfiguration

为什么会出现这种情况呢？默认情况下，ApP1icationContext 中的Profile 为“default”，

与上⾯@Profile （"city"）不匹配，BartenderConfiguration 就不会⽣效，这两个调酒

师也不会被注册到IOC容器中。要想让调酒师注册到 IOC容器中，就需要给 ApPlication

Context 中设置⼀下激活的 Profile，如代码清单 2-21 所舌。

代码清单 2-21 为 ApplicationContext 设置 Profile

public static void main （String［］ args）｛

AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext（）；

// 为ApplicationContext 的环境设置正在激活的 Profile

ctx.getEnvironment（）.setActiveProfiles （"city"）；

ctx.register （TavernConfiguration.class）；

ctx.refresh （）；

Stream.of （ctx.getBeanDefinitionNames（））.forEach（System.out：：println）；

注意，代码清单2-21 中初始化 Applicationcontext 的逻辑与之前不同。Annotation

ConfigApplicationcontext 在创建对象时，如果直接传入了配置类，则会⽴即初始化IOC

容器，在不传入配置类的情况下，内部不会执⾏初始化逻辑，⽽是要等到⼿动调用其 refresh

方法后才会初始化IOC 容器，在初始化IOC 容器的过程中，会顺便将环境配置⼀井处理，因此，

为了避免不必要的麻烦，这⾥使用⼿动初始化IOC容器的方式。

修改完成后，重新运⾏ main 方法，控制台可以成功打印 zhangxiaosan和 zhangdasan。

com.linkedbear.springboot.assemble.b_profile.config.BartenderConfiguration

com.linkedbear.springboot.assemble.b_profile.component.Bar

com.linkedbear.springboot.assemble.b_profile.config.BarConfiguration

waLcel

（3）命令⾏参数设置运⾏时环境

上⾯编程式配置虽然已经可以使用，但这种方式并不实用。将 Profile 硬编码在 Java 代码

中本⾝就是⼀种“坏味道”，如果需要切换 Profile，则需要修改Java 代码后重新编译。Spring

Framework 考虑到了这种情况，所以它提供了很多灵活的 Profile 配置方式。下⾯演舌最容易实

现的⼀种：命令⾏参数配置。

要测试命令⾏参数的环境变量，需要在 IDEA 中配置启动选项，如图2-1所舌。

Logs

|第2章 Spring Boot 的⾃动装配

按照图 2-1 的方式配置好之后，在main 方法中改回原来的构造方法传入配置类的形式并

运⾏，控制台仍然会打印 zhangxiaosan 和 zhangdasan。

修改传入的JVM参数，将 city改成wilderness，重新运⾏main 方法，发现控制台不

再打印 zhangxiaosan 和 zhangdasan，说明使用 JM 命令⾏参数也可以控制 Profile。

Name：TavernProfileApplication 口share 口Allow parallel run

Configuration Code Coverage

Main class： com.linkedbear.springboot.assemble.b_profile.TavernProfileApplication

M OUOnS！ Dst1u8.plor1Les.act:ecl0

Program arguments：

图2-1 IDEA 设置命令⾏启动参数

3.@Profile 运用于实际开发

Profile 机制在 Spring Boot 中使用得⾮常经典，使用spring•profiles.active 属性可以激

活指定的环境配置，application.properties ⽂件都可以通过加 profile 后缀来区分不同环境

下的配置⽂件（app1ication-dev.properties、application-prod.properties）。

举⼀个简单的例子，如果需要根据不同的环境配置不同的嵌入式Web 容器端口，则可以声

明⼏个不同的配置⽂件，以分别定义不同的端口配置，如代码清单2-22所示。当全局 application.

properties 中激活 dev 环境时，application-dev.properties 中的配置⽣效，项目就

会运⾏在 8787 端口。

1代码清单 2-22 Spring Boot 中 Profile 的应用

# application-dev.properties

server.port=8787

# application-prod.properties

server.port=8989

# application.properties

spring.profiles.active=dev # 激活 dev 的配置

4. Profile 的不⾜

Profile 固然很强大，但它仍有⼀些⽆法控制的地方。下⾯将场景进⼀步复杂化：吧台应由

⽼板安置，如果酒馆中连⽼板都没有，那么吧台也不应该存在。在这种情况下，只使用Profile

机制便⽆法实现，因为 Profile 控制的是整个项目的运⾏环境，⽆法根据单个 Bean 的因素决定

是否装配。基于这种情况，出现了第⼆种条件装配的方式：基于@Conditiona1 注解。


## 2.3.2 基于 Conditional 的装配

Conditional，意为条件，这个概念⽐ Profile 更直接明了。按照惯例，⾸先对 Conditional 有

个清楚的认识。

1. 理解 Conditional

Conditional 是在 Spring Framework 4.0版本正式推出的，它可以使 Bean的装配基于⼀

指定的所有条件，才会被创建/解析。

bbbar

waiter

注解⽣效。


## 2.3 Spring Framework 的条件装配|

些指定的条件。换句话说，被标注@Conditiona1注解的Bean 要注册到IOC容器时，必须满

⾜eConditiona1上指定的所有条件才允许注册。

在 Spring Framework 的官方⽂档中没有对@Conditiona1的介绍，⽽是引导读者直接参考

javadoc，⽽javadoc 中描述的内容大致可以总结为：eConditiona1注解可以指定匹配条件，

⽽被@Conditiona1 注解标注的“组件类/配置类/组件工⼚方法”必须满⾜Conditional 中

2. @Conditional 的使用

继续实现上⾯的需求：吧台依赖⽼板的存在。在BarConfiguration 的Bar 注册中，要

指定 Bar 的创建需要 Boss 的存在，反映到代码上就是在 bbbar 方法上标注@Conditional，

如代码清单 2-23所示。

代码清单 2-23 在 BarConfiguration 中为 bbbar 添加装配条件

@Bean

@Conditional （？？？）

public Bar bbbar （）｛

return new Bar（）；

注意，Conditional注解中需要传入⼀个condition接⼜的实现类数组，说明使用原

⽣条件装配还需要编写条件判断类作为匹配依据。下⾯声明⼀个 ExistBossCondition 条件

判断类，用来判断 IOC容器中是否存在Boss对象，如代码清单2-24所舌。编写完成后将该条

件判断类放人@Conditiona1 注解中。

代码清单 2-24判断 Boss 是否存在的条件判断类

public class ExistBossCondition implements Condition ｛

@Override

Public boolean matches （Conditioncontext context, AnnotatedzypeMetadata metadata） 1

return context .getBeanFactory （）.containsBeanDefinition （Boss .class.getName （））；

Q提示：matches 方法中使用 BeanDefinition ⽽不是Bean做判断，这是因为考虑的是当条件匹

配时 Boss 对象可能尚未创建，导致条件匹配出现偏差。

下⾯重新运⾏测试启动类的 main 方法，发现吧台被成功创建：

taverncontiguration

com.linkedbear.springboot.assemble.c_conditional.component.Boss

com.linkedbear.springboot .assemble.c_conditional.component.Bar

com.linkedbear.springboot.assemble.c_conditional.config.BarConfiguration

为了检验上⾯的@Conditiona1 的确起了作用，可以将@Enableravern 注解中导人的

Boss 类去掉，重新运⾏测试启动类，会发现 Boss 和bbbar 均不会被打印，说明@conditiona1

判断偏差。

⼜⽽不是实现类，但接⼜最终要有实现类落地。如果程序因业务调整，需要替换某个接⼜的实

现类，就不得不改动实现类的创建，也就是修改源码。SPI 机制的出现解决了这个问题，它通过⼀

明权交给了外部化的配置⽂件。

实现类的对象进⾏创建并返回。

实现类B

实现类C

实现类B 实现类C

1第2章 Spring Boot 的⾃动装配

3. ConditionalOnxxx系列注解

Spring Boot 中针对@conditiona1注解扩展了⼀系列的条件注解，下⾯是⼏个常用的条件

装配注解。

• @ConditionalOnClass & @ConditionalOnMissingClass：检查当前项目的类

路径下是否包含/缺少指定类。

• @ConditionalOnBean & @conditiona10nMissingBean：检查当前容器中是否

注册/缺少指定 Bean。

• @Conditiona1OnProperty：检查当前应用的属性配置。

• @ConditionalOnWebApplication & @ConditionalOnNotWebApplication：

检查当前应用是否为 Web 应用。

• @Conditional0nExpression：根据指定的 SpEL 表达式确定条件是否满⾜。

Q 提示：注意，在 Spring Boot 的官方⽂档中针对@ConditionalOnBean 注解的特別说明是，这些

Conditional0nxxx 注解通常都用在⾃动配置类中，对于普通的配置类最好避免使用，以免出现

以上注解在2.6节研究 Spring Boot 的⾃动装配场景实例中会遇到，读者⼀定要熟记

于心。


## 2.4 SPI 机制

下⾯继续扩展与⾃动装配相关的服务提供方接⼜（Service Provider Interface, SPI）机制。

关于 SPI 的来源，需要读者熟悉设计模式的依赖倒转原则。依赖倒转原则中提到，应该依赖接

种“服务寻找”的机制，动态地加载接⼜/抽象类对应的具体实现类。简单了解 SPI 的概念后，

读者是否联想到了1OC？的确，SPI 的确有1OC的“味道”，它把接⼜的具体实现类的定义和声

通过图 2-2来更简单地理解SPI 机制，图2-2中的接⼜可以有多个实现类，通过SPI 机制，

可以将⼀个接⼜需要创建的实现类的对象都罗列在⼀个特殊的⽂件中，SPI 机制会依次将这些

接⼜

接⼜名

实现类A

实现类A

图2-2 SPI设计示意

原⽣JDK 的SPI 机制可以通过⼀个指定的接口/抽象类找到预先配置好的实现类（并创建

实现类的对象）。JDK 1.6中新增了SPI 的实现，Spring Framework 3.2也引人了SPI 的实现，⽽

且⽐JDK 的实现更加强大。下⾯分别讲解两种SPI 的实现。

加以区分即可。

目录下，且⽂件名必须命名为接口或抽象类的全限定名，⽂件内容为接口或抽象类的具体实现

类的全限定名；如果出现多个具体实现类，则每⾏声明⼀个类的全限定名，多个类之间没有分

具体实现类的全限定名。


## 2.4 SPI 机制|


## 2.4.1 JDK 原⽣的 SPI

对于JDK 原⽣的SPI，读者只需简单了解，因为它的使用范围相对有限，只能通过接⼜或

抽象类来加载具体的实现类，所以很多框架没有直接采用JDK 的SPI，⽽是⾃定义了⼀套更强

大的实现（Spring Framework、Dubbo 等框架都有⾃定义的SPI 机制）。

下⾯通过⼀个简单的舌例讲解使用JDK 原⽣的SPI 机制。

1. 定义接⼜+实现类

简单舌例不侧重于代码的复杂度，只需要定义⼀个接⼜+两个实现类，并模拟⼀套Dao 接

⼜的不同数据库访问⽀持，如代码清单2-25所舌。⽆须定义接⼜的方法，只从类名上对实现类

代码清单2-25 定义 SPI 机制测试的接⼜＋实现类

Public interface DemoDao ｛｝

public class DemoMySQLDaoImpl implements DemoDao ｛｝

Public class DemoOracleDaoImpl implements DemoDao ｛｝

2. 声明SPI⽂件

JDK的SPI需要遵循以下规范：所有定义的SPI⽂件都必须放在项目的META-INE/services

隔符。

如果要给上⾯定义的DemoDao接口声明SPI⽂件，则⽂件名应该是全限定名：com.linkedbear.

springboot.assemble.d_spi.bean.DemoDao（注意没有后缀名），⽽⽂件的内容是这些

com.linkedbear.springboot.assemble.d_spi.bean.DemoMySQLDaoImpl

com.linkedbear.springboot.assemble.d_spi.bean.DemoOracleDaoImpl

3. 测试获取

接下来编写测试启动类，使用JDK 提供的⼀个 Serviceloader 类来加载SPI ⽂件中定义

的实现类，并直接打印到控制台，如代码清单2-26所舌。

代码清单2-26 测试JDK 原⽣的SPI机制

Public class JdkSpiApplication ｛

public static void main （String［］ args） throws Exception ｛

Serviceloader<DemoDao> serviceloader = Serviceloader.Load （DemoDao.CLass）i

serviceloader.iterator（）.forEachRemaining （dao ->｛

System.out.println （dao）；

｝）；

运⾏测试启动类的 main 方法，控制台可以成功打印出DemoDao 的两个实现类对象，这说

值得读者认真学习。

⽂逗号分隔。

FactoriesLoader，它不仅可以加载声明的类的对象，⽽且可以直接把预先定义好的全限定

|第2章 Spring Boot 的⾃动装配

明JDK 原⽣的SPI 机制已成功使用。

com.linkedbear.springboot.assemble.d_spi.bean.DemoMySQLDaoImp1@50040f0c

com.linkedbear.springboot .assemble.d_spi.bean.DemooracleDaoImp1@2dda6444


## 2.4.2 Spring Framework 3.2的 SPI

Spring Framework 中的SPI 相较于JDK 原⽣的SPI 更加⾼级实用，因为它不仅限于接⼜或

抽象类，⽽可以是任何⼀个类、接⼜或注解。也正是因为 Spring Framework 的SPI 可以⽀持注

解作为索引，所以在 Spring Boot 中大量用到 SPI 机制加载⾃动配置类和特殊组件等（即2.5节

中即将讲到的大名⿍⿍的@EnableAutoConfiguration）。因此 Spring Framework 的SPI更

1. 声明SPI ⽂件

Spring Framework 的SPI ⽂件也有相应的规范，需要将 SPI ⽂件放在项目的 MIETA-INE 目

录下，且⽂件名必须 spring.Eactories。该⽂件其实是⼀个 properties ⽂件，如代码

清单 2-27所舌。

代码清单 2-27 spring.factories ⽂件

com.linkedbear.springboot.assemble.d_spi.bean.DemoDao=\

com.linkedbear.springboot.assemble.d_spi.bean.DemoMySQLDaoImpl，\

com.linkedbear.springboot.assemble.d_spi.bean.DemooracleDaoImpl

可以发现，spring.factories ⽂件定义的规则是：被检索的类/接口/注解的全限定名作

为 properties 的key，具体要检索的类（注意不是实现类）的全限定名作value，多个类之间英

@提示：注意，spring.factories⽂件中定义的key 和value 可以毫⽆关联，仅凭这⼀点就⽐JDK

的SPI 要灵活得多。

2. 测试获取

使用 Spring Framework 的SPI 机制时，加载 spring.factories ⽂件的 API是 Spring

名都提取出来，如代码清单2-28所示。

1代码清单 2-28 使用 Spring Framework SPI 加载

public class SpringSpiApplication ｛

public static void main （Stringl］ args） ｛

List<DemoDao> demoDaos = SpringFactoriesLoader

.loadFactories （DemoDao.class, SpringSpiApplication.class.getClassLoader （））；

demoDaos.forEach （dao ->｛

system.out.printIn （dao）；

｝；

System.out.println（"- --"）；

List<String> daoClassNames = SpringFactoriesLoader


## 2.4 SPI机制I

•loadFactoryNames （DemoDao.class, SpringSpiApplication.class.getClassLoader （））；

daoClassNames .forEach （className -> ｛

System.out.println （className）；

｝；

运⾏测试运⾏类的main 方法，控制台也可以正常打印对象与全限定名，说明 Spring

Framework 的SPI 机制已正确使用。

com.linkedbear.springboot.assemble.d_spi.bean.DemoMySQLDaoImp1@763d9750

com.linkedbear.springboot.assemble.d_spi.bean.DemooracleDaoImp1@5c0369c4

com.linkedbear.springboot.assemble.d_spi.bean.DemoMySQLDaoImp1

com.linkedbear.springboot.assemble.d spi.bean.DemoOracleDaoImpl

3. Spring SPI 机制的实现原理

下⾯深入底层源码，以了解 Spring Framework 的SPI 机制是如何实现的，这部分有助于读

者更好地理解 SPI 以及它的利用方式。

SPI 的核心使用方法是 SpringFactoriesloader.loadFactoryNames 方法，通过这个

方法可以获得指定全限定名对应配置的所有类的全限定类名，loadFactoryNames 方法实现的

底层逻辑如代码清单2-29所舌（关键注释已在其中标注）。

1代码清单 2-29 SpringFactoriesLoader.loadFactoryNames 底层实现

// 存储SPI机制加载的类及其映射

private static final Map<ClassLoader,MultiValueMap<string,String>> cache

= new ConcurrentReferenceHashMap<>（）；

1/ SPI 的⽂件名必须为spring.factories

Public static final String FACTORTES_RESOURCE_LOCATION = "MBIA-INE/spring.factories"；

public static List<String> loadFactoryNames （Class<?> factoryrype，

@Nullable ClassLoader classLoader）｛

String factoryTypeName = factoryType.getName （）；

// 利用缓存机制提⾼加载速度

return loadSpringFactories （classLoader）.getOrDefault （factoryTypeName,Collections.emptyList （））；

Private static Map<String, List<String>> 1oadSpringFactories （@Nullable Classloader classLoader）｛

1/ 解析之前先检查缓存，有则直接返回

MultiValueMap<String, String> result = cache.get （classLoader）；

if （result！= null） ｛

return resulti

tzy｛

1/ 真正的加载动作，利用类加载器加载所有的 spring.factories（多个），并逐个配置解析

Enumeration<URL> urls = （classloader ！= nul1？

classLoader.getResources （FACTORIES_RESOURCE_LOCATION）：

classLoader.getSystenResources （FACTORIES_RESOURCE_LOCATION））；

result = new LinkedMultiValueMap<>（）；

while（ur1s.hasMoreElements（））｛

⽂件都加载并解析、存入缓存区（空间换时间的思想）。解析的逻辑也不难，它会将每⼀个

讲解这三个注解的作用。

I第2章 Spring Boot 的⾃动装配

// 提取出每个 spring.factories ⽂件

URL url = urls.nextElement （）；

UrlResource resource = new UrlResource （ur1）；

1/ 以Properties 的方式读取 spring.factories

Properties properties = PropertiesLoaderUtils.loadProperties （resource） ；

for （Map.Entry<？，？> entry :properties.entrySet （））｛

1/ 逐个收集配置项映射

String factoryTypeName =（ （String）entry.getKey（））.trim（）；

// 如果⼀个 key 配置了多个 value，则用英⽂逗号隔开，此处会做分隔

Eor （String factoryImplementationName:StringUtils.commaDelimitedListroString

Array （（String）entry.getValue （）））｛

result.add （factoryTypeName,factoryImplementationName.trim （））；

cache.put （classloader, result）；

recurn resuLt：

｝// catch

下⾯简单介绍 loadFactoryNames 方法的逻辑。SpringFactoriesLoader 中有⼀块

缓存区，这块缓存区会在SPI 机制第⼀次被利用时将项目类路径下所有的spring.factories

spring.factories ⽂件当作 properties ⽂件解析，并提取每⼀对映射关系，保存到Map 中，

最终存入全局缓存。

整体逻辑不算很难，读者可以对照源码注释，配合IDE 的Debug运⾏⼏次加以体会。


## 2.5 Spring Boot 的装配机制

了解了 Spring Framework 的组件装配和SPI 机制，下⾯就可以正式进入 Spring Boot 的装配

机制阶段。Spring Boot 的⾃动装配实际就是模块装配+条件装配+SPI 机制的组合使用，⽽这⼀

切都凝聚在 Spring Boot 的主启动类的@SpringBootAPPlication 注解上。

@SpringBootApplication 注解是由三个注解组合⽽来的复合注解，它来源于 Spring

Boot 1.2.0，在此之前，代码清单2-30中的这三个注解需要开发者⾃⼰⼿动声明。

1代码清单 2-30 @SpringBootApplication 注解的组成

@SpringBootConfiguration

@EnableAutoConfiguration

@ComponentScan（excludFilters =｛

@Filter（type = FilterType.CUSTOM, classes = TypeExcludFilter.class），

@Filter （type = FilterType.CUSTOM, classes = AutoConfigurationExcludFilter.class）

｝）

public einterface SpringBootApplication

只要在 Spring Boot 的主启动类上标注@SpringBootApplication 注解，就会触发组件

的⾃动装配（@EnableAutoConfiguration） 和组件扫描（@ComponentScan）。下⾯分别


## 2


## 2.5.1@ComponentScan

的启动类要放到所有类所在包的最外层。不过跟平时项目开发中使用的方式有点不同的是，在

演示。下⾯重点研究底层的运⾏原理和机制。

Spring Boot 的装配机制|

@ComponentScan组件扫描，其本身来⾃ Spring Framework，放在@SpringBootApplication

注解上组合的意图是扫描主启动类所在包及其子包下的所有组件，这也解释了为什么 Spring Boot

@SpringBootApplication 注解组合时@ComponentScan 额外添加了两个过滤条件：

@ComponentScan（excludFilters = ｛

Filter （type = Filterrype.CUSTOM, classes = TypeExcludFilter.class），

@Filter （type = FilterType.CUSTOM， CLasses = AutocontigurationLxcluder LLter.CLass）

既然 Spring Boot 有意设置了排除过滤器，那么它⼀定有特殊的作用，值得探究。

1. TypeExcludFilter

由类名理解 TypeExcludFilter 是⼀个类型排除的过滤器，它提供了⼀种扩展机制，可以

让开发者向IOC容器中注册⼀些⾃定义的组件过滤器，以便在组件扫描的过程中过滤它们。⽂档注

释中特意说明了 TypeExcludFilter 的使用方式：只需要在应用上下⽂中注册

TypeExcludFilter 类的子类，并重写 match 方法，Spring Boot 会⾃动找到这些TypeExc

1udFilter 的子类并调用它们。有关效果的测试读者可以⾃⾏编写测试代码体会，本书不再

具体来看，TypeExcludFilter 的底层实现是从 BeanFactory，即IOC 容器中找出所

有类为 TypeExcluderilter 的Bean，并依次调用它们匹配，如代码清单2-31所示。

代码清单 2-31 TypeExcludFilter 的核心逻辑实现

public boolean match （MetadataReader metadataReader，

MetadataReaderFactory metadataReaderFactory）throws IOException ｛

if（this.beanFactory instanceof ListableBeanFactory && getClass（）== TypeExcludFilter.

class）｛

for（TypeExcludFilter delegate : getDelegates （））｛

// 提取出所有 Typezxcluderilter 并依次调用其 match 方法检查是否匹配

if （delegate.match （metadataReader,metadataReaderFactory））｛

return true；

return false：

Private Collection<TypeExcludFilter> getDelegates（）｛

Collection<TypeExcludFilter> delegates = this.delegates；

if （delegates == nul1）｛

1/ 此处会从 BeanFactory 中提取出所有类为 TypeExcludFilter 的 Bean

delegates =《（ListableBeanFactory）this.beanFactory） .getBeansOfType （TypeExclude

Filter.class）.values （）；

this.delegates = delegates；

除⾃动配置类的过滤器。注意，它是在组件扫描阶段排除⾃动配置类，⽽不是放弃⾃动配置类

不管。它的底层过滤逻辑中要判断的规则有两条：⼀个类是配置类；且是⾃动配置类。

配置类。

I第2章 Spring Boot 的⾃动装配

整个处理逻辑⽐较简单，它会从 BeanFactory 中提取出所有类为TypeExcludFilter

的 Bean，并缓存到本地（空间换时间的设计体现），后续在进⾏组件扫描时会依次调用这些

TypeExcludFilter 对象，检查被扫描的类是否符合匹配规则。

Q提示：由于 Spring Boot 中设置的 TypeExcludFilter 属于排除性质的过滤器，因此被匹配到的

Bean 不会被注册到 IOC 容器中。

2. AutoConfigurationExcludFilter

AutoConfigurationExcludFilter 的类名已经将其作用体现得很明确，它是用来排

检查的规则在源码中设计得⽐较简单，如代码清单2-32所示。被@Configuration 注解标注

的类都是注解配置类；同时，被定义在 spring.factories 中@EnableAutoConfiguration

注解的配置类为⾃动配置类。可能读者看到这⾥有点费解，2.5.3节中将进⾏解释，这⾥只需要

知道 AutoConfigurationExcludFilter 这个类型过滤器会在组件扫描阶段过滤掉⾃动

代码清单 2-32 AutoConfigurationExcludFilter 的核心逻辑实现

public boolean match （MetadataReader metadataReader，

private boolean isConfiguration （MetadataReader metadataReader）｛

1/ 检查是配置类的原则：是否被@Configuration 注解修饰

return metadataReader.getAnnotationMetadata （）.isAnnotated （Configuration.class.getName （））；

Private boolean isAutoConfiguration （MetadataReader metadataReader） ｛

1/ 检查是⾃动配置类的原则：是否被定义在 spring.factories 中的EnableAutoConfiguration 中

return getAutoConfigurations （）.contains （metadataReader .getClassMetadata （）.getClassName （））；

Protected List<String> getAutoConfigurations（）｛

if（this.autoConfigurations == nul1） ｛

this.autoConfigurations = SpringFactoriesLoader

•loadFactoryNames （EnableAutoConfiguration.class, this.beanClassLoader）；

return this.autoConfigurations；


## 2.5.2 @SpringBootConfiguration

@SpringBootConfiguration 注解并不是⼀个神秘的扩展，它本⾝仅组合了⼀个 Spring

Framework 的@Configuration 注解⽽已。

CConfiguration

public einterface SpringBootConfiguration

述的内容相吻合。

⾃动装配的。

javadoc，本节会将注释拆分为多段解读。


## 2.5 Spring Boot 的装配机制|

所以简单地理解，⼀个类标注了@springBootConfiguration 注解也就是标注了

@Configuration 注解，代表这个类是⼀个注解配置类。

如果读者要探究@SpringBootConfiguration 有什么额外的作用，本书可以提供⼀个

线索以供参考。在 Spring Boot 的官方⽂档 Spring Boot Features 部分中有⼀节 “features.

testing.spring-boot-applications.detecting-configuration” 提及了 espring

BootConfiguration 注解。⽂档中提到，Spring Boot 运⾏测试时会寻找被@Spring

BootApP1ication或者@SpringBootConfiguration 注解标注的类，之后开始测试工作。

⽽在 Spring Boot 的源码中，如果读者引入了 spring-boot-starter-test 的依赖，可以

发现这个注解在 SpringBootTestContextBootstrapper 的 getorFindConfiguration

Classes 方法中被调用，⽽这个方法的名称恰好就叫“寻找配置类”，由此推断与官方⽂档描


## 2.5.3@EnableAutoConfiguration

最后⼀个注解是重头戏，@EnableAutoConfiguration 注解承载了 Spring Boot ⾃动装

配的“灵魂”。不必着急阅读源码的结构，先请读者仔细解读 Spring Boot的开发者是如何描述

1. javadoc 的描述

为了方便读者能更方便、更容易地阅读和理解@EnableAutoConfiguration 注解的

Enable auto-configuration of the Spring Application Context, attempting to guess and configure

beans that you are likely to need. Auto-configuration classes are usually applied based on your classpath

and what beans you have defined. For example, if you have tomcat-embedded.jar on your

classpath you are likely to want a TomcatServletWebServerFactory （unless you have defined

your own ServletWebServerFactory bean）. When using SpringBootApplication, the

auto-configuration of the context is automatically enabled and adding this annotation has therefore no

additional effect.

第⼀段主要讲解的是注解本身的作用。标注@EnableAutoConfiguration 注解后，会启用

Spring 应用上下⽂（即 ApplicationContext）的⾃动配置，并且 Spring Boot 会尝试猜测和

配置当前项目中可能需要的Bean。通常根据项目的类路径和定义的Bean 就可以合理地应用⾃

动配置类。例如，如果项目的类路径下引用了tomcat-embedded.jar 包，则当前项目很有

可能需要配置⼀个 TomcatServletWebserverFactory（除⾮项目中已经⼿动注册了⼀个

ServletWebServerFactory 类型的Bean）。另外，当使用@springBootApplication 注解

时，将⾃动启用上下⽂的⾃动装配，因此也就不需要再声明@EnableAutoConfiguration 了（本

身@SpringBootApplication 注解已经组合了@EnableAutoConfiguration）。

Auto-configuration tries to be as intelligent as possible and will back-away as you define more of

vour own configuration. You can always manually exclude （）any configuration that you never

want to apply （use excludeName （）ifyou don' have access to them）. You can also exclude them

via the spring.autoconfigure.exclude property. Auto-configuration is always applied after

user-defined beans have been registered.

会尽可能地智能化，并会在项目中注册更多⾃定义配置的时候⾃动退出（即被覆盖）。开发者也

mechanism auto-

的⾃动装配，根据导入的依赖、上下⽂配置合理加载默认的⾃动配置。

来解释。

【第2章 Spring Boot 的⾃动装配

紧接着的⼀段主要解释了 Spring Boot ⾃动配置的机制和禁用方法。Spring Boot 的⾃动配置

可以直接禁用某些不需要/不想用的⾃动配置（使用 exclude 属性，或者在⽆法访问时使用

excludeName 属性），或者通过全局配置⽂件的 spring.autoconfigure.exclude 属性

排除这些⾃动配置类。最后⼀点，Spring Boot 的⾃动配置类的触发时机是在项目中⾃定义的配

置加载完毕后应用。

The package of the class that is annotated with @EnableAutoConfiguration, usually via

@SpringBootApplication, has specific significance and is often used as a ddefault'.For

example, it will be used when scanning for @Entity classes. lt is generally recommended that you

place CEnableAutoConfiguration （if you're not using @SpringBootApplication） in a

root package so that all sub-packages and classes can be searched.

接下来的⼀段阐述了组件扫描的相关事宜：被@EnableAutoConfiguration 或

@SpringBootApplication 注解标注的类，其所在的包有特殊含义，通常被定义为“默认值”。

这个默认值体现在组件扫描、JPA 实体类扫描、Mapper 接⼜扫描等。Spring Boot 默认扫描被

@EnableAutoConfiguration 注解标注的类所在包及其子包的所有组件。

Auto-configuration classes are regular Spring Contiguration beans. They are located using

theSpringFactoriesloader （keyedagainst this class）. Generally

configuration beans are @Conditional beans （most often using @ConditionalOnClass and

CConditionalOnMissingBean annotations）.

最后⼀段提到了⾃动配置类与 Spring Framework SPI 机制的关系。Spring Boot 的⾃动

配置类本⾝也是⼀些普通的配置类，只不过它们的加载是通过 Spring Framework 的SPI 机

制（即 SpringFactoriesLoader）。另外，Spring Boot 的⾃动配置类也是条件配置类

（被Conditional 系列注解标注，其最常见的如使用@ConditionalOnClass 和

eConditiona10nMissingBean标注）。

通读下来，读者是否可以体会到⼀点：Spring Boot的⽂档注释写得相当好，⾮常清晰。最

后简单总结@EnableAutoConfiguration 注解的作用：标注该注解后，会启用 Spring Boot

@EnableAutoConfiguration 本身是⼀个组合注解，它还包含了两个注解，下⾯逐⼀

@AutoConfigurationPackage

@Import （AutoConfigurationImportSelector.class）

2.@AutoConfigurationPackage

@AutoConfigurationPackage 注解本身组合了⼀个@Import 注解，它导入了⼀个内

部类 AutoConfigurationPackages.Registrar。

@Import （AutoConfigurationPackages.Registrar.class）

public einterface AutoConfigurationPackage

@AutoConfigurationPackage 注解所做的是将主启动类所在的包记录下来，注册到

AutoConfigurationPackages 中。由于eSpringBootApP1ication 注解中已经组合了


## 2.5 Spring Boot 的装配机制|

这个@AutoConfigurationPackage，因此在此处也可以提取到主启动类所在的包。

提示：在 Spring Boot 2.3.0版本以前，@AutoConfigurationPackage 注解没有任何属性，标注

了该注解即确定了主启动类所在包（约定）。在 Spring Boot 2.3.0版本及以后，注解中多了两个属性：

basePackages 和 basePackageClasses。它们可以⼿动指定应用的根包/根路径（配置）。如

果没有⼿动指定，则仍然采用默认的主启动类所在包（约定大于配置）。 什么 Spring Boot 要执着

于记录应用的根包呢？因为这个根包路径在整合第三方 starter 时有特殊作用，下⾯会讲到。

简单介绍了@AutoConfigurationPackage 注解本⾝，下⾯把目标转移到导人的内部类

Registrar 上o Registrar 本身是⼀个 ImportBeanDefinitionRegistrar，它的作用是以

编程式向IOC 容器中注册 bean 对象，⽽ Registrar 要注册的对象实际上是默认主启动类所在的

包路径（也就是@AutoConfigurationPackage 注解要记录的根包），如代码清单2-33所示。

代码清单 2-33 AutoConfigurationPackages.Registrar

static class Registrar implements ImportBeanDefinitionRegistrar, DeterminableImports ｛

COverride

public void registerBeanDefinitions （AnnotationMetadata metadata，

BeanDefinitionRegistry registry）｛

register （registry, new PackageImports （metadata）.getPackageNames （） .toArray （new String ［01））；

@Override

Public Set<Object>determineImports （AnnotationMetadata metadata） ｛

return Collections.singleton （new PackageImports （metadata））；

观察代码清单 2-33中的两个方法，其中 determineImports 方法暂且不提，主要关注

ImportBeanDefinitionRegistrar 的核心 registerBeanDefinitions 方法。这⾥有

两点要注意，分别是 register 方法本身，以及传入的⼀个包名数组。

（1） PackageImports

注意 register 方法的第⼆个参数，它利用 PackageImports 导出了⼀组包名，⽽包

名的来源是⼀个 AnnotationMetadata，这个 AnnotationMetadata 本质上可以理解为

@AutoConfigurationPackage 注解本身。换句话说，这个 PackageImports 类提取出

@AutoConfigurationPackage 注解中定义的两个属性（basePackages 与

basePackageClasses）。实际上源码也是如此，它做了⼀个约定大于配置的设计，

PackageImports 的构造方法中会先提取注解中的这两个属性，如果两个属性都没有定义则

会提取主启动类所在的包名，具体逻辑如代码清单2-34所舌。

1代码清单 2-34 Packagelmports 中提取应用的根包名，体现了约定大于配置

PrLvace static TinaL Class rackageLmports｛

PrIvate tinal ulstsotring> packageNames：

PackageImports （AnnotationMetadata metadata）｛

I第2章 Spring Boot 的⾃动装配

AnnotationAttributes attributes = AnnotationAttributes.fromap （metadata

•getAnnotationAttributes （AutoConfigurationPackage.class.getName （）， false））；

List<String> packageNames = new ArrayList<>（）；

// 先提取两个属性

for（String basePackage :attributes.getStringArray（"basePackages"））｛

packageNames.add （basePackage）：

for （Class<?> basePackageClass : attributes.getClassArray （"basePackageClasses"））｛

packageNames.add （basePackageClass.getPackage （）•getName （））；

1/ 如未提取到，则提取被注解标注的类的所在包，即 spring Boot 的主启动类所在的包

iE （packageNames.isEmpty（））｛

packageNames.add （ClassUtils.getPackageName （metadata.getClassName （）））；

this.packageNames = Collections.unmodifiableList （packageNames）；

提取出根包路径后，下⾯是调用外层的 register 方法。

（2） register 方法

请读者注意⼀点，这个 register 方法并没有定义在 Registrar 内部类上，⽽是外部

AutoConfigurationPackages 的⼀个静态方法，如代码清单 2-35所示。

1代码清单 2-35 register 方法注册根包路径

Private static final String BEAN = AutoConfigurationPackages.class.getName （）；

public static void register（BeanDefinitionRegistry registry, String...packageNames）｛

// 检查 IOC 容器中是否包含指定的 Bean，即 AutoConfigurationPackages

L（registry.containsbeanpetin1tion （BEAN））｛

BeanDefinition beanDefinition = registry.getBeanDefinition （BEAN）；

ConstructorArgumentValues constructorArguments = beanDefinition.getConstructorArgument

Values （）；

1/ 添加构造方法的参数：应用的根包路径

constructorArguments.addLndexeahrgumentvaLue （0.addbaserackages （constructorArguments，

packageNames））；

｝else｛

// 如果没有 Bean，则此处构造定义信息，并注册到 IOC 容器中

GenericBeanDefinition beanDefinition = new GenericBeanDefinition（）；

Deanverinitlon.setbeancLass（baserackages.CLass）；

beanDefinition.getConstructorArgumentValues （）.addIndexedArgumentValue （0，

PackageNames）：

beanDetinltion.setkole（Beanbetinltion.KOLE LNERASTKUCIURE：

registry.registerBeanDefinition（BEAN,beanDefinition）；

注意观察这部分逻辑：register 方法要先判断 IOC 容器中是否包含⼀个名 Auto

ConfigurationPackages 的 Bean，如果有则给这个 Bean 添加构造方法的参数，如果没有

则创建⼀个全新的Bean注册到IOC容器中。这⾥暂且不提Bean 注册的逻辑，将重点放在这两

个分⽀逻辑中的共性：添加构造方法的参数。这个构造方法的参数就是上⾯在 Package

Imports 中刚提取出的 packageNames，即应用的根包路径。


## 2.5 Spring Boot 的装配机制|

⾄于最终这些根包路径放到哪⾥了，可以关注⼀下 else 分⽀中的 BeanClass：

BasePackages.class，它的结构相当简单，内部只维护了⼀个 packages集合存放这些根

包路径，如代码清单2-36所示。

代码清单 2-36 BasePackages 的结构相当简单

static final class BasePackages｛

private final List<String> packages；

BasePackages （String... names）｛

List<String> packages = new ArrayList<>（）；

for （String name :names）｛

i （Stringutils.hasText （name））｛

packages.add （name）；

this.packages = packages；

如果保存当前 Spring Boot 应用的根包路径仅仅是为了提供给Spring Boot 内部使用，那么这个

设计似乎有⼀点多余。回想⼀下，Spring Boot的强大之处中⾮常重要的⼀点是更方便地整合第三方

技术。以读者⾮常熟悉的 MyBatis 例，当项目中引入 mybatis-spring-boot-starter

依赖后，可以在 IDE 中打开 MyBatisAutoConfiguration 类。在这个配置类中可以找到

AutoConfiguredMapperScannerRegistrar 这样⼀个组件，如代码清单 2-37所示。

1代码清单 2-37 AutoConfiguredMapperScannerRegistrar 中使用了 basePackages（节选）

ublic static class AutoConfiguredMapperScannerRegistra

mplements BeanFactoryAware,ImportBeanDefinitionRegistrar

Private BeanFactory beanFactory；

@Override

public void registerBeanDefinitions （AnnotationMetadata importingClassMetadata，

BeanDefinitionRegistry registry） ｛

1…….

List<String> packages = AutoConfigurationPackages.get （this.beanFactory）；

1…….

BeanDefinitionBuilder builder = BeanDefinitionBuilder

•genericBeanDefinition （MapperScannerConfigurer.class）；

builder.addPropertyValue（"processPropertyPlaceHolders"，true）；

builder.addPropertyValue （"annotationClass"， Mapper.class）；

builder.addPropertyValue （"basePackage"，stringUtils.collectionToCommaDelimitedString

（packages））；

1….….

registry.registerBeanDefinition （MapperscannerConfigurer.class.getName（），builder.get

BeanDefinition （））；

注意，AutoConfiguredMapperScannerRegistrar 是⼀个 ImportBeanDefinition

时机更晚，所以更适合做⼀些补充性工作，正好⾃动装配的设计就是约定大于配置，项目中已

经有的配置不会重复注册，项目中没有配置的部分会予以补充，⽽负责补充的任务就交给了⾃

这就形成了⼀条很清晰的逻辑链条。

|第2章 Spring Boot 的⾃动装配

Registrar，它会向 IOC 容器中注册⼀个 MapperScannerConfigurer，熟悉 MyBatis

的读者肯定对它不陌⽣，它是用于整合 Spring Framework 进⾏ Mapper 接⼜扫描的组件。

在 AutoConfiguredMapperScannerRegistrar 中会将 basePackages 提取出并设置到

MapperScannerConfigurer 中，以备后续 MapperScannerConfigurer 的 Mapper 接口

扫描工作，由此也就体现出 basePackages 的作用了。

有了对EAutoConfigurationPackage 和@ComponentScan 注解的了解，也就理解了

为什么 Spring Boot 的主启动类要在所有类的最外层。

3. AutoConfigurationlmportSelector

@EnableAutoConfiguration 的另⼀个导人组件是 AutoConfigurationImport

Selector，它本身是⼀个 DeferredImportSelector，除了具备 ImportSelector 的作

用，2.2.6 节中曾讲到，实现了 DeferredImportSelector 接口的 ImportSelector 执⾏

动配置类，AutoConfigurationImportSelector 的作用就是加载这些⾃动配置类，所以

下⾯聚焦 AutoConfigurationImportSelector 本身，在2.2.6 节中提到过⾼版本的

Spring Framework 中给 DeferredImportSelector 添加了分组的概念，所以真正起作用的方

法不是selectImports，⽽是DeferredImportSelector接口的另⼀个方法getImportGroup

返回的类，如代码清单 2-38所示（这个返回的 AutoConfigurationGroup 才是真正起作

用的）。

代码清单 2-38 AutoConfigurationlmportSelector 中声明了导入所属组

Public Class<？ extends Group> getImportGroup （）｛

return AutoConfigurationGroup.class；

AutoConfigurationGroup 本身实现了 DeferredImportSelector.Group 接口，

这个接口中⼜定义了⼀个 process 方法，这个方法才是真正负责加载所有⾃动配置类的入口。

AutoConfigurationGroup 中的实现逻辑如代码清单2-39所示。

代码清单 2-39 AutoConfigurationGroup 中包含加载⾃动配置类的方法实现

Public void process （AnnotationMetadata annotationMetadata，

DeferredImportSelector deferredImportSelector）｛

1/ 断⾔⋯…

AutoConfigurationEntry autoConfigurationEntry = （（AutoConfigurationImportSelector） deferred

ImportSelector）.getAutocontiguratlonintry（annotatlonmetaaata）：

this.autoConfigurationEntries.add （autoConfigurationEntry）；

for（String importClassName :autoConfigurationEntry.getConfigurations （））｛

this.entries.putIfAbsent （importClassName,annotationMetadata）；

这个方法⾸先会检查传入的 deferredImportSelector 是否由 AutoConfiguration

ImportSelector 导入⽽来，该细节通常不会受影响，所以这⾥必然会通过。下⾯的

protected AutoConfigurationEntry getAutoConfigurationEntry（AnnotationMetadata annotation


## 2.5 Spring Boot 的装配机制|

getAutoConfigurationEntry 方法是加载⾃动配置类的核心逻辑（⻅代码清单 2-40），其

源码步骤稍多，不过主⼲逻辑只有三步：加载⾃动配置类⼀移除被去掉的⾃动配置类⼀封装

Entry 返回。这⾥加载⾃动配置类的动作就是利用 Spring Framework 的SPI 机制，从

spring.factories 中提取出所有@EnableAutoConfiguration 对应的配置值（⻅代码清

单2-41）。可以通过三种途径移除被去掉的⾃动配置类：@springBootApplication 或

@EnableAutoConfiguration 注解的 exclude、excludeName 属性，以及全局配置⽂件

的 spring.autoconfigure.exclude 属性配置。底层源码会提取出这三个位置配置的⾃动

配置类并移除（见代码清单2-42）。

代码清单 2-40getAutoConfigurationEntry 获取要加载的⾃动配置类

metadata）

i （！isEnabled （annotationMetadata））｛

return EMPTY_ENTRY；

// 加载注解属性配置

AnnotationAttributes attributes = getAttributes （annotationMetadata）；

1/ 真正加载⾃动配置类的动作

List<String> configurations = getCandidateconfigurations （annotationMetadata, attributes）：

// ⾃动配置类去重

configurations = removeDuplicates （configurations）；

// 获取显式配置了要移除的⾃动配置类

set<String> exclusions = getExclusions （annotationMetadata,attributes）；

checkExcludedClasses （configurations,exclusions）；

1/ 移除动作

configurations.removeA11 （exclusions）；

configurations = getConfigurationClassFilter（）.filter（configurations）；

1/ ⼴播 AutoConfigurationImportEvent 事件

fireAutoConfigurationImportEvents （configurations,exclusions）；

return new AutoConfigurationEntry（configurations,exclusions）；

代码清单2-41 利用SPI 机制加载所有配置了@EnableAutoConfiguration 的⾃动配置类

protected List<String> getCandidateConfigurations （AnnotationMetadata metadata，

AnnotationAttributes attributes） ｛

List<String> configurations = SpringFactoriesLoader

.loadFactoryNames （getSpringFactoriesLoaderFactoryClass（），getBeanClassLoader（））；

1/ 断⾔……

return configurations；

protected Class<?> getSpringFactoriesLoaderFactoryClass （）｛

return EnableAutoConfiguration.class；

代码清单 2-42 getExclusions 获取被显式移除的⾃动配置类

protected Set<String> getExclusions （AnnotationMetadata metadata，

AnnotationAttributes attributes） ｛

经过如上所述的流程后，需要被加载的⾃动配置类会全部收集完毕，并在最后返回这些⾃

取出这些⾃动配置类并解析，完成⾃动装配的加载。

子包下的所有组件。

记录下最外层根包的位置，以便第三方框架整合使用。

ValidationAutoConfiguration.class｝）

|第2章Spring Boot 的⾃动装配

Set<String> excluded = new LinkedHashSet<> （）；

excluded.addA11 （asList （attributes， "exclude"））；

excluded.addA11 （Arrays.asList （attributes.getstringArray （"excludeName"）））；

excluded.addA11 （getExcludeAutoConfigurationsProperty （））；

return excluded；

动配置类的全限定名，存入 AutoConfigurationGroup 的⼀个缓存中，后续IOC容器会提

g提示：Spring Boot 官方⽀持的场景启动器中，对应的⾃动配置类通常都放到 spring-boot-

autoconfigure 依赖的 spring.factories ⽂件中统⼀管理。读者在⾃⾏探究场景启动器时，可以

尝试以该⽂件中EnableAutoConfiguration 配置的⾃动配置类⼒切入点学习。

4. 小结

简单总结⼀下 Spring Boot 的核心@SpringBootApp1ication 和⾃动装配机制。

• @springBootApplication 包含@componentscan 注解，可以默认扫描当前包及

• @EnableAutoConfiguration 中包含@AutoConfigurationPackage 注解，可以

• @EnableAutoConfiguration 导人的AutoconfigurationImportSelector 可

以利用 Spring Framework 的SPI 机制加载所有⾃动配置类。


## 2.6 WebMvc 场景下的⾃动装配原理

了解了 Spring Boot 的⾃动装配机制后，下⾯研究⼀个实际且常见的场景：当项目整合

Spring WebMvc 后 Spring Boot 的⾃动装配都做了什么。

在引入 spring-boot-starter-web 的依赖后，Spring Boot 会进⾏ WebMvc 环境的⾃动

装配，处理的核心是⼀个叫作 WebMvcAutoConfiguration 的类，⾸先观察这个类做了什么，

如代码清单2-43所示。

代码清单 2-43 WebMvcAutoConfiguration 的类头定义

@Configuration （proxyBeanMethods = false）

1/ 当前环境必须是 WebMvc（Servlet）环境

@Conditional0nwebApplication （type = Type.SERVLET）

// 当前运⾏环境的 classpath 中必须有 Servlet 类、DispatcherServlet 类和 WebMvcConfigurer 类

@ConditionalonClass（｛ Servlet.class, DispatcherServlet .class, WebMvcConfigurer.class｝）

// 如果没有⾃定义WebMvc 的配置类，则使用本⾃动配置

@ConditionalOnMissingBean （WebMvcConfigurationSupport.class）

@AutoConfigureorder （Ordered.HIGHEST_PRECEDENCE + 10）

// 当前⾃动配置会在以下⼏个配置类的解析后再处理

@AutoConfigureAfter （｛ DispatcherServletAutoConfiguration.class，

TaskExecutionAutocontiquration.CLass，

public class WebMvcAutoConfiguration

才会⽣效。

所示。


## 2.6 WebMvc 场景下的⾃动装配原理|

由代码清单 2-43 可以发现，要想使 WebMvcAutoConfiguration 配置类⽣效，需要满

⾜以下⼏个条件：

• 当前环境必须是 WebMvc（即 Servlet 环境），导入了 WebMvc 的依赖后，该条件默认

⽣效；

• 当前类路径下必须有 Servlet、DispatcherServlet、WebMvcConfigurer这⼏

个类，如果缺少其中任何⼀个类，WebMvc的⾃动装配就⽆效（即上述⼏个类是构造

WebMvc 环境的重要成员）；

• 只有项目中未⾃定义注册 webMvcConfigurationsupport 的类或者子类，⾃动装配

针对第⼀个条件，这⾥先解释⼀下，当同时导入WebMvc和WebFlux时，则WebMve⽣效，

WebFlux ⽆效，有关这部分内容会在6.1.1节中讲解。

关于最后⼀个条件，这⾥有必要展开解释。WebMvcAutoConfiguration 之所以要检查

容器中是否未包含 WebMvcConfigurationSupport，是为了避免与@EnableWebMvc 注

解冲突，因为查看源码时可以发现，@EnablewebMvc 注解本身导入了⼀个

WebMvcConfigurationsupport 的子类 DelegatingwebMvcConfiguration，它可以⽀

持使用 WebMvcConfigurer 配合完成 WebMve 的组件定制化和扩展配置，⽽不需要⼿动注

册 WebMvc 的核心组件。WebMvcAutoConfiguration 本身就已经⽀持了这种方式，不需要

再额外标注EnableWebMvc 注解，因此这⾥就做了⼀个约定大于配置的设计：如果项目的配

置类中没有标注@EnablevebMvc注解，则 Spring Boot 认采用约定的配置；⽽标注了

@EnableWebMvc注解后，Spring Boot 认为项目中需要覆盖约定的⾃动装配，转⽽使用⾃定义

的配置，所以此处不再使WebMvcAutoConfiguration ⽣效。

WebMvcAutoConfiguration 在解析之前，注解中提到了另⼀个⾮常重要的配置类

DispatcherServletAutoConfiguration，显然它是 DispatcherServlet 相关的⾃动

配置类，⽽ DispatcherServletAutoConfiguration ⼜不是排序最靠前的，它排在另⼀

个⾃动配置类 ServletWebServerFactoryAutoConfiguration 之后，如代码清单 2-44

1代码清单 2-44 ServletWebServerFactoryAutoConfiguration 处理排序更靠前

@AutoConfigureorder （Ordered.HIGHEST_PRECEDENCE）

Configuration （proxyBeanethods = taLse）

EConditionalOnWebApplication （type = Type.SERVLET）

@Conditional0nClass （DispatcherServlet.class）

1/ ServletWebserverFactoryAutoConfiguration 解析完后才能轮到它

@AutoConfigureAfter（ServletWebServerFactoryAutoConfiguration.class）

Public class DispatcherServletAutoConfiguration

所以大体上可以梳理出 WebMvc 场景的⾃动装配环节：Servlet 容器的装配⼀

DispatcherServlet 的装配⼀WebMvc核心组件的装配。下⾯就这三个环节逐⼀展开讲解。


## 2.6.1 Servlet 容器的装配

⾸先来看嵌人式 Servlet 容器的装配，这⾥又导人了⼏个组件，分别是⼀个 BeanPost

ProcessorsRegistrar 和⼏个 Embedded 容器内部类，如代码清单 2-45所示。

<artifactId>spring-boot-starter-web</artifactId>

<artifactId>spring-boot-starter-tomcat</artifactId>

<artifactId>spring-boot-starter-jetty</artifactid>

【第2章 Spring Boot 的⾃动装配

•代码清单 2-45 ServletWebServerFactoryAutoConfiguration 的类头定义

@Configuration （proxyBeanMethods = false）

@AutoConfigureorder （Ordered.HIGHEST_PRECEDENCE）

@ConditionalOnClass （ServletRequest.class）

ConditionalOnwebApP1ication （type = Type.SERVLET）

@EnableConfigurationProperties （ServerProperties.class）

@Import（｛ServletWebServerFactoryAutoConfiguration.BeanPostProcessorsRegistrar.class，

ServletWebServerFactoryConfiguration.EmbeddedTomcat.class，

ServletWebServerFactoryConfiguration.EmbeddedJetty.class，

ServletWebServerFactoryConfiguration.EmbeddedUndertow.class｝）

PubLic class ServletWebServerFactoryAutoConfiguration

1. EmbeddedTomcat、EmbeddedJetty 和 EmbeddedUndertow

这三个容器其实是⼀码事。学过 Spring Boot 整合 WebMvc开发的读者都清楚，默认情况下

Spring Boot 会整合嵌入式 Tomcat （EmbeddedTomcat）作可独⽴运⾏jar ⽂件的嵌人式 web 容

器。如果需要切换嵌入式 Web 容器，只需要把原本的嵌入式 Tomcat 依赖移除掉，再添加新的

嵌人式 Servlet 容器依赖，如代码清单2-46所舌。

代码清单 2-46 切换嵌入式 Servlet 容器为 Jetty 的方法

<dependency>

<groupId>org.springframework.boot</groupId>

<exclusions>

<exclusion>

<qroupId>org.springframework.boot</groupId>

</exclusion>

</exclusions>

</dependency>

<dependency>

<groupId>org.springframework.boot</groupId>

<scope>provided</scope>

</dependency〉

底层真正确定应该实例化哪个嵌人式 wWeb 容器，这在本质上是由这⼏个嵌入式内部类决定

的。下⾯以EmbeddedTomcat 为例，以查看它的内部设计，如代码清单 2-47所舌。

1代码清单 2-47 EmbeddedTomcat 处理的组件

@Configuration （proxyBeanMethods = false）

@ConditionalonClass（｛ Servlet.class,romcat.class, UpgradeProtocol.class｝）

eConditiona10nMissingBean（value = ServletwebServerFactory.class，

search = Searchstrategy .CURRENT）

static class EmbeddedTomcat｛

EBean

TomcatServletWebServerFactory tomcatServletWebServerFactory（

ObjectProvider<TomcatConnectorCustomizer> connectorCustomizers，

化流程，在第8章中将详细展开讲解。

ServletWebServerFactoryAutoConfiguration 导人的另⼀个组件是⼀个后置处

理器的注册器，读者可能还不了解后置处理器的概念和使用，不过这不妨碍理解


## 2.6 WebMvc 场景下的⾃动装配原理|

vDJectrroviaersLomcatvontextustowzzer contextwustomz2eLs，

ObjectProvider<TomcatProtocolHandlerCustomizer<？>> protocolHandlerCustomizers）｛

TomcatServletWebServerFactory factory = new TomcatServletWebServerFactory（）；

factory.getromcatConnectorCustomizers （）.addA11（connectorCustomizers.orderedStream （）

• ColLeCt（Colrectors.touist（））

ractorY.getromcatcontextcustomizers（.adoALL（contextcustomlzers.orderedstream（）.

collect （Collectors.toList （）））；

factory.getTomcatProtocolHandlerCustomizers （）.addA11（protocolHandlerCustomizers.

orderedStream（）.collect （Collectors.toList （）））；

return factoryi

注意 EmbeddedTomcat 上⾯标注的注解，它需要只有在当前项目的类路径下包含Tomcat

类时，当前配置类才会⽣效，⽽配置类中注册的是⼀个 TomcatServletWebserverFactory，

它负责创建嵌人式 Tomcat 容器。具体嵌入式 Tomcat 是如何创建的，以及嵌入式 Tomcat 的初始

扩展⼀个小细节，代码清单2-47的TomcatServletWebServerFactory 的定制器中，

最下⾯的 TomcatProtocolHandlerCustomi zer 是在 Spring Boot 2.2.0版本后才有的，低

版本的 Spring Boot 中并没有这个扩展点，其余两种定制器是⾃2.0.0版本出现的。在之前的版

本中，只能通过定义WebServerFactoryCustomi zer 的实现类来传入这些特殊的定制器，

⽽ Spring Boot 2.2.0版本之后可以直接定义这些定制器，并标注@Component 注册到IOC 容器

中，Spring Boot 会⾃动应用这些定制器。

2. BeanPostProcessorsRegistrar

BeanPostProcessorsRegistrar 本身的作用，如代码清单 2-48所示。

代码清单 2-48 BeanPostProcessorsRegistrar

public static class BeanPostProcessOrsRegistrar implements ImportBeanDefinitionRegistrar，

BeanFactoryAware ｛

private ConfigurableListableBeanFactory beanFactory：

// setBeanFactory ⋯.

@Override

Public void registerBeanDefinitions （AnnotationMetadata importingClassMetadata，

BeanDefinitionRegistry registry） ｛

i （this.beanFactory == nu11）｛

LeCUL

registerSyntheticBeanIfMissing （registry，"webServerFactoryCustomi zerBeanPostProcessor"，

WebServerFactoryCustomi zerBeanPostProcessor.class）；

registerSyntheticBeanIfMissing（registry， "errorPageRegistrarBeanPostProcessor"，

ErrorPageRegistrarBeanPostProcessor.class）；

Private void registerSyntheticBeanIfMissing（BeanDefinitionRegistry registry，

String name,Class<?> beanClass）｛

ImportBeanDefinitionRegistrar，它注册的组件是两个后置处理器，简单解释它们的作

中会提到。

I第2章 Spring Boot 的⾃动装配

i£ （ObjectUti1s.isBmpty（this.beanFactory.getBeanNamesForType （beanClass, true, false）））｛

RootBeanDefinition beanDefinition = new RootBeanDefinition （beanClass）；

beanDefinition .setSynthetic （true）；

registry.registerBeanDefinition（name,beanDefinition）；

注意观察代码清单 2-48的结构与实现，BeanPostProcessorsRegistrar 本身是⼀个

用：WebServerFactoryCustomizerBeanPostProcessor 负责执⾏所有 WebServer

FactoryCustomizer（嵌人式Web 容器的定制器），ErrorPageRegistrarBeanPostProcessOr

负责向嵌人式Web 容器中注册默认的错误提示⻚⾯。有关这两个组件的底层设计，读者可以结

合IDE⾃⾏查看，这⾥不再展开。

3. 两个定制器的注册

除了 ServletWebServerFactoryAutoConfiguration 上⾯的@Import 注解导入的

组件，这个⾃动配置类中还注册了两个定制器，如代码清单 2-49所示。

】代码清单 2-49 ServletWebServerFactoryAutoConfiguration 注册的两个定制器

11方法名、变量名有精简

@Bean

public servletWebServerFactoryCustomizer WebserverCustomi zer （ServerProperties prop） ｛

return new ServletWebServerFactoryCustomizer （prop）；

CBean

Conditional0nClass （name = "org.apache.catalina.startup. Tomcat"）

public romcatServletwebserverFactoryCustonizer tomcatCustomizer （ServerProperties PrOp）｛

return nev TomcatServletWebServerFactoryCustomizer （prop）：

注意观察这两个定制器，它们都把 ServerProperties 作构造方法的参数传入到定制

器中，⽽ ServerProperties 本身定义了有关 Web 容器的⼀些配置（如端口、上下⽂路径、

开启 SSL 等），这些配置对应 Spring Boot 全局配置⽂件的server.*部分。实质上，此处注册

的两个定制器是在底层将全局配置⽂件中定义的配置属性实际应用在嵌入式Web 容器中，达到

“外部配置内部⽣效”的效果。有关定制器在底层是如何运⾏的，在8.3.1 节讲解嵌人式 Tomcat

⾄此，有关 ServletWebServerFactoryAutoConfiguration 的装配内容全部完成。


## 2.6.2 DispatcherServlet 的装配

接下来是有关DispatcherServlet 的装配。在讲解 DispatcherServlet 相关的组件

装配之前，需要读者回顾 Spring Boot 如何注册 Servlet 原⽣三大组件。

1. Spring Boot 注册 Servlet 原⽣组件

基于 Spring Boot的项目，其底层都会采用 Servlet 3.0及以上的规范。Servlet 3.0 规范中不

再使用web.xml，⽽是使用注解的方式配合 Servlet 容器扫描完成原⽣组件的注册。Spring Boot

RegistrationBean 辅助注册。


## 2.6 WebMvc 场景下的⾃动装配原理|

本身并不默认⽀持扫描 Servlet 三大组件，所以它提供了另外两种注册方式。

• Servlet 原⽣组件扫描@ServletComponentScan

原⽣组件扫描适用于项目中存在⾃定义的Servlet 原⽣组件。它的使用方式是，在 Spring

Boot 的主启动类上标注@ServletComponentScan 注解后，即可像@ComponentScan

那样⾃动扫描主启动类所在包及其子包下的所有Servlet 原⽣组件。这种扫描方式需要

配合 Servlet 3.0 规范中引人的@WebServlet、@webFilter、ewebListener 注解才

能完成原⽣组件的扫描与装配（就像@ComponentScan 配合@Component 注解⼀样）。

• 借助辅助注册器 RegistrationBean

辅助注册器的方式适用于引入项目依赖的jar 包中存在 Servlet 原⽣组件。由于所

依赖的第三方库中的代码不可修改，因此靠 Servlet 组件扫描的方式是不现实的。由

此 Spring Boot 引入了⼀种注册器机制，针对 Servlet 原⽣三大组件提供了三个对应的

代码清单 2-50中提供了⼀个辅助注册器的简单舌例。

代码清单 2-50 RegistrationBean 的简单使用示例

public class DemoServlet extends HttpServlet ｛

protected void doGet （HttpServletRequest req, HttpervletResponse resp）

throws ServletException,IOException ｛

resp.getWriter （）•println （"demo servlet"）；

｝

public class DemoServletRegistryBean extends ServletRegistrationBean<DemoServlet>｛

public DemoServletRegistryBean（Demoservlet servlet,String.•.ur1Mappings）｛

super （servlet,ur1Mappings）；

｝

｝

@Configuration

public class ServletConfiguration ｛

@Bean

public DemoServletRegistryBean demoServletRegistryBean（）｛

return new DemoServletRegistryBean （new DemoServlet （），"/demo/servlet"）；

2. DispatcherServlet 的注册

回顾了 Servlet 原⽣组件的注册方式，下⾯紧接着了解 DispatcherServlet 的注册。代

码清单 2-51展示了 DispatcherServletAutoConfiguration 中的核心源码，其中包含上

述提到的 RegistrationBean 辅助注册器。

代码清单 2-51 注册 DispatcherServlet

EnableConfigurationProperties （WebMvcProperties.class

orotected static class DispatcherServletConfiguration｛

EBean （name = DEFAULT_DISPATCHER_SERVLET_BEAN_NAME）

的动作，还有对其进⾏的⼀些定制化操作；DispatcherServletRegistrationConfiguration

有关源码中具体的实现细节，感兴趣的读者可以⾃⾏研究，本书不展开讨论。



# 第2章 Spring Boot 的⾃动装配


## 第2章 Spring Boot 的⾃动装配

public DispatcherServlet dispatcherServlet （WebMvcProperties webMvcProperties）｛

DispatcherServlet dispatcherServlet = new DispatcherServlet （）；

// Dispatcherservlet 的定制化 ⋯..•.

return dispatcherServlet；

05eaa

@ConditionalOnBean （MultipartResolver.class）

@ConditionalOnMissingBean （name = DispatcherServlet .MULTIPART_RESOLVER_BEAN_NAME）

public MultipartResolver multipartResolver （MultipartResolver resolver）｛

return resolver；

CEnableConfigurationProperties （WebMvcProperties .class）

@Import （DispatcherServletConfiguration.class）

protected static class DispatcherServletRegistrationConfiguration ｛

@Bean （name = DEFAULT_DISPATCHER_SERVLET_REGISTRATION_BEAN_NAME）

@Conditional0nBean （value = Dispatcherservlet.class，

name = DEFAULT_DISPATCHER_SERVLET_BEAN_NAME）

public DispatcherservletRegistrationBean registration （Dispatcherservlet dispatcherServlet，

webMvcProperties webMvcProperties,objectProvider<MultipartConfigBlement> multipartConfig）｛

DispatcherServletRegistrationBean registration = new DispatcherServletRegistrationBean

（dispatcherServlet,webMvcProperties.getServlet （）.getPath （））；

registration.setName （DEFAULT_DISPATCHER_SERVLET_BEAN_NAME）；

registration.setLoadonStartup （webMvcProperties.getServlet （）.getLoadonStartup （））；

multipartConfig.ifAvailable （registration：：setMultipartConfig）；

return registration；

整体来看，注册 Dispatcherservlet 的核心源码包含两部分：DispatcherServlet

Configuration负责注册 DispatcherServlet 本身，其中有实例化 Dispatcher Servlet

负责将 DispatcherServlet 注册到 Web 容器中，它利用 ServletRegistrationBean 的派

⽣类 DispatcherServletRegistrationBean 将 DispatcherServlet 注册到 Web 容器

中，以完成 DispatcherServlet 的装配工作。


## 2.6.3 SpringWebMvc的装配

嵌人式 Web 容器和 Dispatcherservlet 都装配完成后，最后是WebMvc 的装配，

这部分的主要装配内容都集中在 WebMvcAutoConfiguration 的两个内部类 WebMvcAuto

ConfigurationAdapter 与 EnablewebMvcConfiguration 中，所以研究重点是这两

个内部类。

器的实现。

以结合源码⾃⾏探究，这⾥不作为重点展开讲解。


## 2.6 WebMvc场景下的⾃动装配原理|

1. WebMvcAutoConfigurationAdapter

⾸先来看WebMvcAutoConfigurationAdapter，这个类本身是⼀个 WebMvcConfigurer。

WebMvcAutoConfigurationAdapter 整体可以理解为⼀个以 WebMvc 配置主的配置器。

WebMvcAutoConfigurationAdapter 重写了 WebMvcConfigurer 的大量方法，也注册了

⼀些新的 Bean，拆分来看各组件。

（1）配置 HttpMessageConverter

重写 configureMessageConverters 方法，目的是配置默认的 HttpMessageConverter，

如代码清单2-52所舌。HttpMessageConverter 是⼀个消息转换器，它的作用对象是Request

Body 和@ResponseBody 注解标注的Controller 方法，分别完成请求体到参数对象的转换以及

响应对象到响应体的转换。默认情况 下 Spring Boot 整合 WebMvc 时，底层会⾃动依赖 Jackson 作为

JSON ⽀持，所以这⾥会配置⼀个MappingJackson2HttpMessageConverter 作消息转换

代码清单 2-52配置 HttpMessageConverter

Coverride

public void configureMessageConverters （List<HttpMessageConverter<？>> converters）｛

this.messageConvertersProvider.ifAvailable（（customConverters）->

Converters.addhlL（customconverters.getconverters（））；

（2）异步⽀持

configureAsyncSupport 的作用是配置异步请求的⽀持。Spring Boot 在底层已经默认

准备好了⼀个异步线程池，⽀持Controller 层使用异步处理的方式接收请求。线程池在另⼀个

⾃动配置类 TaskExecutionAutoConfiguration 中已经创建完成，⽽且 Bean 的名称刚好

是applicationTaskExecutor，所以这⾥可以顺利地获取并设置，如代码清单2-53所舌。

异步⽀持的最终落地会在RequestMappingHandlerAdapter 中得以体现，感兴趣的读者可

代码清单 2-53 configureAsyncSupport 配置异步⽀持

Public static final string APPL.ICATION_TASK_EXECUTOR_ BEAN_NANE = " apPlicationTaskExecutor"；

dOTeYY10e

public void configureAsyncsupport （AsyncSupportConfigurer configurer）1

i （this.beanFactory.containsBean （TaskExecutionAutoConfiguration.APPLICATION_TASK_EXECUTOR_

BEAN_NAME））｛

Object taskExecutor = this.beanFactory

• getBean （TaskExecutionAutoConfiguration. APPL.ICATION_TASK_EXECUTOR_BEAN_NAME）；

if（taskExecutor instanceof AsyncTaskExecutor）｛

configurer.setTaskExecutor （ （（AsyncTaskExecutor） taskExecutor））；

Duration timeout = this.mvcProperties.getAsync （）.getRequestTimeout （）；

if （timeout ！= nul1）｛

contigurer.setDetauLtlimeout（timeout.tomi--1s（：

ViewResolver，想必读者都不陌⽣，它通过路径前后缀拼接的方式解析逻辑视图名称，常⻅

ContentNegotiatingViewResolver，它是顶层级的视图解析器，负责将视图解析的工作

|第2章 Spring Boot 的⾃动装配

四 提示：SpringWebMvc 在 4.0及以后的版本⽀持异步请求，使用方式是在 Controller 方法中不再直接返回

响应对象，⽽是返回Callable或者 DeferredResu1t 对象，具体可以参照官方⽂档，本书不再展开。

（3）注册视图解析器

接下来是视图解析器的注册。源码中⼀共注册了3个视图解析器，之所以没有全部展舌出

来，是因为BeanNameViewResolver 已⼏乎不再使用（⼀个Bean只能处理⼀个⻚⾯，放在当下

的大环境下⾮常不实用）。代码清单 2-54 中列举的两个视图解析器中，对于 InternalResource

于原⽣ Spring Framework+SpringWebMvc+MyBatis 的项目技术栈中配置，用于处理JSP 页⾯配

置，不过 Spring Boot 默认已经不⽀持 JSP，所以不必再研究这个视图解析器。另⼀个是

交由不同的代理 ViewResolver 来实现，以处理不同的逻辑视图。换⾔之，Content

NegotiatingViewResolver 做的核心工作是中心转发。

最代码清单2-54 注册默认的视图解析器

@Bean

@Conditional0nMissingBean

pubLiC LnternalkesourceVlewkeSO_ver detaultViewkeSOLver（｛

InternalResourceViewResolver resolver = new InternalResourceViewResolver（）；

resolver.setPrefix （this.mvcProperties.getView（）.getPrefix （））；

resolver.setSuffix （this.mvcProperties.getView （）.getSuffix （））；

cecu LesoLver：

ebean

@ConditionalOnBean （ViewResolver.class）

@ConditionalOnMissingBean（name = "viewResolver"，

value = ContentNegotiatingViewResolver.class）

Public ContentNegotiatingViewResolver viewResolver （BeanFactory beanFactory）｛

ContentNegotlatingViewresoLver resoLver = new ContentNegotlatingViewkesoLver（）；

resolver.setContentNegotiationManager（beanFactory.getBean （ContentNegotiationManager.

CLGSS

resolver.setOrder （Ordered.HIGHEST_PRECEDENCE）；

return resolver；

提示：如果项目中整合 Thymeleaf 或 FreeMarker 作为⻚⾯模板引擎，默认的⻚⾯路径也不会在

InternalResourceViewResolver 配置，⽽是在具体的⻚⾯模板引擎对应的⾃动配置类中体现（如

Thymeleaf 对应的 ThymeleafAutoConfiguration 中注册了⼀个 SpringResourceTemplate

Resolver 专⻔负责解析逻辑视图）。

（4）国际化的⽀持

LocaleResolver 是 SpringWebMvc 针对国际化⽀持的核心接口，它主要的作用是解析请

求中的语⾔标志参数或者请求头中的Accept-Language 参数，并将解析的参数存放到指定的

位置中，它通常配合 LocaleChangeInterceptor 使用，如代码清单 2-55所示。注意，只

@Bean


## 2.6 WebMvc 场景下的⾃动装配原理 |

有配置了 spring.mvc.locale 配置项后，LocaleResolver 才会被创建。

代码清单 2-55 注册国际化⽀持组件

@ConditionalOnMissingBean

@Conditiona1onProperty（prefix = "spring.nvc"， name = "1ocale"）

public LocaleResolver 1ocaleResolver （）｛

i£（this.mvcProperties.getLocaleResolver（）== WebMvcProperties.LocaleResolver.FIXED）｛

return new FixedLocaleResolver（this.mvcProperties.getLocale （））；

AcceptHeaderLocaleResolver localeResolver = new AcceptHeaderLocaleResolver（）；

localeResolver.setDefaultLocale （this.mvcProperties.getLocale （））；

return localeResolver；

（5） RequestContextHolder 的⽀持

最后⼀个⽐较值得关注的组件是 RequestContextFilter，如代码清单2-56所示。乍⼀

看会感觉⽐较眼熟，因为读者可能或多或少地用到过⼀个可以全局获取到 HttpServlet

Request 和 HttpServletResponse 的API:RequestContextHolder。⽽⽀撑 Request

ContextHolder 获取的组件就是 RequestContextFilter.

代码清单 2-56RequestContextHolder 的⽀持

@Bean

@Conditional0nMissingBean（｛ RequestContextListener.class,RequestContextFilter.class ｝）

CConditionalOnMissingFilterBean （RequestContextFilter.class）

Public static RequestContextFilter requestContextFilter（）｛

return new OrderedRequestContextFilter （）；

代码清单 2-57 中展示了 RequestContextFilter 的核心过滤辑，doFilterInternal

方法是 RequestContextFilter 的核心过滤方法，其中调用了下方的initContextHolders

方法，将 requestAttributes 放入 RequestContextHolder 中，这样后续在 Controller

层的任意位置都可以获取 HttpServletRequest 和 HttpServletResponse 对象（异步线

程例外）。

代码清单 2-57 RequestContextFilter 的核心工作逻辑

COverride

protected void doFilterInternal（HttpServletRequest request,HttpServletResponse response，

FilterChain filterChain）throws ServletException,I0Exception ｛

ServletRequestAttributes attributes = new ServletRequestAttributes （request, response）；

// 初始化 ContextHolder

initContextHolders （request,attributes）；

try｛

filterChain.doFilter （request,response）；

H// finally ⋯..

private void initContextHolders （HttpServletRequest request，

ServletRequestAttributes requestAttributes）｛



# 第2章 Spring Boot 的⾃动装配


## 第2章 Spring Boot 的⾃动装配

LocaleContextHolder.setLocale （request.getlocale （），this.threadContextInheritable）；

RequestContextHolder.setRequestAttributes（requestAttributes,this.threadContextInheritable）；

// Logger..

2. EnableWebMvcConfiguration

WebMvcAutoConfigurationAdapter 的类头上使用@Import 注解导人了 Enableweb

MvcConfiguration，所以EnablewebMvcConfiguration 也会随之⽣效，这个类中注册

了很多 WebMve 会用到的核心组件，同样值得关注。

（1） 注册 HandlerMapping

HandlerMapping 处理器映射器的作用是根据请求的URI 去匹配查找能处理的Handler，如

代码清单 2-58 所示。目前主流的使用 WebMvc的方式都是使用@RequestMapping 注解定义的

Handler 请求处理器，所以这⾥默认直接注册了⼀个 RequestMappingHandlerMapping。

】代码清单 2-58 注册 HandlerMapping

// 参数名有精简

@Bean

@Primary

public RequestMappingHandlerMapping requestMappingHandlerMapping（

@Qualifier（"mvcContentNegotiationanager"） ContentNegotiationanager manager，

@Qualifier （"mvcConversionService"）FormattingConversionService conversionService，

BQualifier（"mvcResourceUr1Provider"）ResourceUrlProvider resourceUr1Provider）｛

// Must be @Primary for MvcUriComponentsBuilder to work

return super.requestMappingHandlerMapping （manager, conversionService,resourceUrlProvider）；

（2） 注册 HandlerAdapter

处理器适配器 HandlerAdapter 会拿到 HandlerMapping 匹配成功的 Handler，并用合

适的方式执⾏ Handler 的逻辑，如代码清单 2-59 所示。使用@RequestMapping 注解定义的

Handler，其底层负责执⾏的适配器就是 RequestMappingHandlerAdapter。

1代码清单 2-59 注册 HandlerAdapter

// 参数名有精筒

@Bean

COverride

public RequestMappingHandlerAdapter requestMappingHandlerAdapter （

@Qualifier（"mvcContentNegotiationManager"） ContentNegotiationManager manager，

@Qualifier（"mvcConversionService"）FormattingConversionService conversionService，

@Qualifier（"mvcValidator"） Validator validator）｛

RequestMappingHandlerAdapter adapter = super .requestMappingHandlerAdapter（manager，

conversionService,validator）；

adapter.setIgnoreDefaultModel0nRedirect （

this.mvcProperties == null || this.mvcProperties.isIgnoreDefaultMode1OnRedirect （））；

return adapter；

⾯⽂件就可以直接引用这些路径下的静态⽂件了。

关于其他组件和配置，感兴趣的读者可以结合源码⾃⾏查看，本书不过多展开。


## 2.7 小结I

（3）静态资源加载配置

WebMvc 整合页⾯时静态资源必不可少，addResourceHandlers 方法中会默认配置⼏个

常用的约定好的静态⽂件的存放位置，其中不乏读者熟悉的/resources、/static，以及依

赖了 webjars 的/webjars/**，如代码清单2-60所舌。配置好这些静态⽂件的存放路径后，页

代码清单2-60 静态资源加载配置

private static final StringI］ CLASSPATH_RESOURCE_LOCATIONS =｛ "classpath:/META-INF/resources/"，

"classpath:/resources/"，"classpath:/static/"，"classpath:/public/"｝；

Private Stringl］ staticLocations = CIASSPATH_ RESOURCE_LOCATIONS；

BOverride

protected void addResourceHandlers（ResourceHandlerRegistry registry） ｛

super.addResourceHandlers （registry）；

i£（！this.resourceProperties.isAddMappings（））｛

logger.debug （"Default resource handling disabled"）；

return；

addResourceHandler （registry，"/webjars/**"，"classpath:/META-INE/resources/webjars/"）；

addResourceHandler（registry, this.mvcProperties.getStaticPathPattern（），

this.resourceProperties.getStaticLocations （））；


## 2.7 小结

本章主要讲解了有关Spring Boot 的核心特性：⾃动装配的机制和原理。模块装配、条件装

配、SPI 机制是⾃动装配的实现基础，掌握基础的装配方式才能更好地理解⾃动装配的设计和

内涵。后续通过WebMvc 场景的⾃动装配实例，进⼀步体会⾃动装配在具体场景中发挥的作用。

第


本章主要内容：

⽂档中，有⼀个⽚段解释了这两者的关系：

Spring Boot 的IOC 容器

章

◎理解、对⽐ Spring Framework 中的IOC容器；

今 了解 Spring Boot 对IOC 容器模型的扩展；

•理解Environment的设计以及与IOC 容器的关系；

今 理解 BeanDefinition的设计；

今 理解各种后置处理器的设计；

• 了解APPlicationContext 的容器核心启动流程。

第2 章中系统地讲解了 Spring Boot 的⾃动装配机制，⽆论是原⽣的装配，还是⾃动装配，

最终组件都会装配到 IOC容器中。Spring Framework 的IOC容器设计复杂且强大，如果要在整

体层⾯把控 Spring Boot，理解 IOC容器的设计是必不可少的⼀环。本章会系统地剖析 Spring

Framework 中的IOC容器设计，以及 Spring Boot 对其的利用与扩展。


## 3.1 Spring Framework 的IOC 容器

有关 Spring Framework 中的IOC 容器模型，读者都知道有⼀个 ApplicationContext

接口，不过它不是顶层接口，它还有⼀个⽗接口 BeanFactory。在 Spring Framework 的官方

The org.springframework.beans and org.springframework.context packages

are the basis for Spring Framework's IoC container. The BeanFactory interface provides an advanced

configuration mechanism capable of managing any type of object. App1icationContext is a

subinterface of BeanFactory. It adds：

Easier integration with Spring's AOP features

• Message resource handling （for use in internationalization）

• Event publication

• Application-layer specific contexts such as the WebApplicationContext for use in web

applications.

org.springframework.beans 和 org.springframework.context 包是 Spring

Framework 的IOC容器的基础。BeanFactory 接口提供了⼀种⾼级配置机制，能够管理任何

类型的对象。ApplicationContext 是BeanFactory 的子接口，它增加了以下⼏个特性：

常⾼，建议各位读者对该部分深入学习时，⼀定要结合javadoc 来学习。


## 3.1 Spring Framework 的 IOC容器|

• 与 Spring Framework 的AOP 功能轻松集成；

• 消息资源处理（用于国际化）；

• 事件发布；

• 应用层特定的上下⽂，例如 Web 应用程序中使用的WebApplicationContext。

由这段⽂档的描述可以初步得到⼀个结论：BeanFactory 是 IOC 容器的基础抽象，

ApplicationContext 包含BeanFactory的所有功能，且扩展了更多实用特性。下⾯分别

来了解 BeanFactory 与 ApplicationContext 的抽象设计。

？提示：下⾯的部分会大量引用 Spring Framework 中的 javadoc，Spring Framework 的javadoc 质量⾮


## 3.1.1 BeanFactory

BeanFactory 是IOC 容器的顶层抽象，它仅定义最基础的bean 对象的管理。借助 IDEA

可以⽣成原⽣Spring Framework 中 BeanFactory及其派⽣接口的继承结构，如图3-1所示。

HierarchicalBeanFactory

總；ConfigurableBeanFactory

apabiebeanracom

Applicationcontext

》 ConfigurableApplica

图 3-1BeanFactory 和它的子接口

注意观察图3-1中的继承关系，BeanFactory 的扩展接口中有部分ApplicationContext

相关的子接⼜，有关这部分内容放在3.1.2节讲解。为了能让读者更清楚地分辨和学习

BeanFactory 与 ApplicationContext 的体系，下⾯重点来看只与 BeanFactory 相关的

接口与实现类，如图3-2所示。

Penoefin toeelstny

*•confieurableleanfectory

Defau_tSingle

©、FactoryBeanRegistrysupporl

•• ConfigvrablelistableBeanFactory

奶w Abctmactau *；Serlalizable

參》SuppresSwarnings

图 3-2BeanFactory 的实现类

实现类做重点介绍。

可搜索性、可配置性等）。

@Component

1第3章 Spring Boot 的IOC 容器

由图 3-2可以发现 BeanFactory的结构体系⾮常庞大。下⾯就其中 核心的⼏个接口和

1. BeanFactory 根接口

作为 Spring Framework 中顶层的容器接口，BeanFactory 的作用⼀定是 简单、 核心

的。以下内容会结合javadoc 分段讲解。

The root interface for accessing a Spring bean container: This is the basic client view of a bean

container; further interfaces such as ListableBeanFactory and ConfigurableBeanFactory

are available for specific purposes.

本段内容来⾃BeanFactory ⽂档注释的开始，解释了 BeanFactory是Spring Framework

中用于访问 Bean 容器的 基本的根接口，下⾯的扩展都是为了实现某些额外的特性（层次性、

This interface is implemented by objects that hold a number of bean definitions, each uniquely

identified by a String name. Depending on the bean definition, the factory will return either an

independent instance of a contained object （the Prototype design pattern）， or a single shared instance

（a superior alternative to the Singleton design pattern, in which the instance is a singleton in the

scope of the factory）. Which bype of instance will be returned depends on the bean factory

configuration: the APl is the same. Since Spring 2.0, further scopes are available depending on the

concrete application context （e.g. "request" and "session" scopes in a web environment）.

这⼀段紧接着讲述了BeanFactory中定义的作用域概念。BeanFactory由包含多个bean

对象的定义（即 BeanDefinition）实现，每个 bean 对象的定义信息均由 name 进⾏唯⼀标

识。根据 bean 对象的定义，Spring Framework 中的工⼚会返回所包含对象的独⽴实例原型模式

（prototype），或者返回单个共享实例，即单实例模式（singleton）的替代方案，其中实例是工⼚

作用域中的单实例。返回 bean 对象的实例类型取决于 bean 对象工⼚的配置：API 是相同的。

从 Spring Framework 2.0开始，根据具体的Applicationcontext 落地实现，可以使用更多

作用域（例如 Web 环境中的 request 和 session 作用域）。

请注意，⽂档注释中的⼀句话⽐较难理解“返回 bean 的实例类型取决于 bean 对象工⼚的

配置：API 是相同的”。如何理解后半句“API 是相同的”？这需要读者回顾⼀下定义 Bean 的

时候，作用域的配置方式，如代码清单3-1所舌。

代码清单3-1 定义作用域的方式

@Scope （"prototype"）// 或者 singleton

public class Person｛｝

可以发现，⽆论是声明单实例 Bean 还是原型 Bean， 终都是用@scope 注解标注；在配

置类中用@Bean 注册组件，如果要显式声明作用域，也是用@Scope 注解。由此就可以解释产

⽣单实例 Bean 和原型 Bean 所用的 API是相同的，都是用@Scope 注解来声明，然后由

BeanFactory 来创建。

The point of this approach is that the BeanFactory isa central registry of application

components, and centralizes configuration of application components （no more do individual objects


## 3

对象中。

储的容器。

依赖注入和依赖查找。

Spring Framework 的IOC 容|

need to read properties files, for example）. See chapters 4 and 11 of "Expert One-on-One J2EE

Design and Development" for a discussion of the benefits of this approach.

这⼀段内容重点强调了BeanFactory与环境配置的继承。BeanFactory本身是所有bean

对象的注册中心，所有的 bean 最终都在 BeanFactory 中创建和保存。另外 BeanFactory

中还集成了配置信息，它可以通过加载外部的 properties ⽂件，将配置⽂件的属性值设置到bean

不过请读者注意，这⾥有关集成配置的概念其实是相对陈旧的。⾃ Spring Framework 3.1

之后出现了⼀个新的概念 Environment（3.4 节会展开讲解），它才是真正实现环境和配置存

Note that it isgenerally better to rely on Dependency Injection （"push" configuration） to

configure application objects through setters or constructors, rather than use any form of "pull”

configuration like a BeanFactory lookup. Spring's Dependency Injection functionality is implemented

using this BeanFactory interface and its subinterfaces.

这部分内容跟BeanFactory的关系不是特别大，它阐述的是Spring Framework 官方在IOC

的两种实现上的权衡：推荐使用依赖注入（DI）、尽可能避免依赖查找（DL）。⽂档中提示我们，

通常最好使用依赖注入（“推”的配置），通过 setter 方法或构造方法注入的方式配置应用程序

对象，⽽不是使用任何“拉”形式的配置（如借助BeanFactory 进⾏依赖查找）。这⾥的⼀对

概念特别经典：依赖注入的思想是“推”，它主张把组件所需的依赖“推”到组件的成员上；依

赖查找的思想是“拉”，组件需要哪些依赖需要组件⾃⼰去1OC容器中“拉取”，这对概念有助

于我们理解和对⽐IOC的两种实现方式

这段注释的最后补充了⼀句，Spring Framework 的依赖注入特性是使用BeanFactory接

口及其子接口实现的，这个在后⾯的 AbstractAutowireCapableBeanFactory 中会提到。

Normally a BeanFactory will load bean definitions stored in a configuration source （such as an

XML document）， and use the org.springframework.beans package to configure the beans. However, an

implementation could simply return Java objects it creates as necessary directly in Java code. There

are no constraints on how the definitions could be stored: LDAP, RDBMS, XML, properties file, etc.

Implementations are encouraged to support references amongst beans （Dependency Injection）.

这⼀段主要说明的是 BeanFactory ⽀持多种类型的 Bean 配置源。通常情况下

BeanFactory 会加载存储在配置源（例如 XML 配置⽂件）中Bean的定义，并使用

org.springframework.beans 包的 API 来配置 Bean。然⽽ BeanFactory 的实现可以根

据需要直接在 Java 代码中返回它创建的Java 对象。Bean 定义的存储方式没有任何限制，它可

以是LDAP（轻型目录访问协议）、RDBMS（关系型数据库系统）、XML、properties ⽂件等。对于

这些存储方式读者只需要知道最常用的方式：XML. 配置⽂件、注解配置类、模式注解＋组件扫描。

In contrast to the methods in ListableBeanFactory, all of the operations in this interface will also

check parent factories if this is a HierarchicalBeanFactory. If a bean is not found in this factory

instance, the immediate parent factory will be asked. Beans in this factory instance are supposed to

override beans of the same name in any parent factory.

这⼀段注释说明的是 BeanFactory 可实现层次性。与 ListableBeanFactory 中的方

法相⽐，BeanFactory 中的所有操作还将检查⽗级工⼚（BeanFactory 本身可以⽀持⽗子

对于上述的部分特性，读者可能在现阶段理解起来⽐较吃⼒，随着后⾯学习的不断深入，

这些特性会逐⼀得到解释。

较简单，我们简单介绍⼀下。

BeanFactory 方法设置⽗级容器。

如果找不到就依次向上查找⽗级 BeanFactory，直到找到为⽌返回，或者最终找不到⽽抛出

答案是可能有，因为即便存在⽗子关系，它们在本质上也是不同的容器。因此有可能找到



# 第3章 Spring Boot 的IOC 容器


## 第3章 Spring Boot 的IOC 容器

结构，这个⽗子结构的概念和实现由 HierarchicalBeanFactory 完成）。如果在

BeanFactory 实例中没有找到指定的bean 对象，则会在⽗工⼚中搜索查找。BeanFactory

实例中的Bean 应该覆盖任何⽗工⼚中的同名 Bean。

Bean factory implementations should support the standard bean lifecycle interfaces as far as

possible. The full set of initialization methods and their standard order is：

• BeanNameAware's setBeanName

• BeanClassLoaderAware's setBeanClassLoader

On shutdown of a bean factory, the following lifecycle methods apply： .

最后⼀段注释粗略说明了⼀件事情：BeanFactory 中设有完整的⽣命周期控制机制。

BeanFactory 接口的内部实现了尽可能⽀持标准 Bean 的⽣命周期接口（Aware 系列接口、

用于初始化的 InitializingBean接口、用于容器初始化完成后启动的Lifecycle接口等）。

最后简单总结⼀下 BeanFactory 的基础特性：

• 基础的容器；

• 定义了作用域的概念；

• 集成环境配置；

• ⽀持多种类型的配置源；

• 层次性的设计；

• 完整的⽣命周期控制机制。

2. HierarchicalBeanFactory

从HierarchicalBeanFactory这个类的名称上可以很容易地理解，它是⼀个体现了层

次性的BeanFactory。有了层次性的特性，BeanFactory就有了⽗子结构。它的 javadoc ⽐

Sub-interface implemented by bean factories that can be part of a hierarchy.

The corresponding setParentBeanFactory method for bean factories that allow setting the parent

in a configurable fashion can be found in the ConfigurableBeanFactory interface.

javadoc 解释得⾮常清楚，HierarchicalBeanFactory 是BeanFactory 的子接⼜，实

现了HierarchicalBeanFactory 接口的IOC 容器具有层次性。它本身有⼀个 getPar

entBeanFactory 方法可以获取⽗级容器，用 ConfigurableBeanFactory 的 setParent

另外请读者注意⼀点：当调用BeanFactory的getBean方法时，如果这个BeanFactory

是具有层次性的 Bean,getBean 方法会从当前 BeanFactory 开始查找是否存在指定的 Bean，

NoSuchBeanDefinitionException.

到这⾥，请读者思考⼀个问题：如果当前 BeanFactorY 中有指定的 Bean，⽗级 Bean

Factory 中可能还有 Bean 吗？


## 3

的，但有了层次性结构后，对于整体的多个容器就不是单实例的了。

clients.

全部列举，这样的设计是否存在问题？还是这样的设计蕴含着特的设计？下⾯通过⼀个小测

Spring Framework 的IOC容 |

多个相同的 Bean。换⾔之，@Scope 中声明的singleton只是在单独某⼀个容器中是单实例

3. ListableBeanFactory

ListableBeanFactory 这个类名称的前缀已经体现出它的特性：可列举。实现了

ListableBeanFactory接口的IOC容器具有的最关键能⼒是，可以将容器中的所有bean对

象都列举出来。下⾯分段解读 javadoc。

Extension of the BeanFactory interface to be implemented by bean factories that can enumerate

all their bean instances, rather than attempting bean lookup by name one by one as requested by

BeanFactory implementations that preload all their bean definitions （such as XML-based

factories） may implement this interface.

第⼀段注释⽐较好理解，ListableBeanFactory 本身也是 BeanFactory 接口的扩展

实现，它的扩展功能是能在获得 BeanFactory 时直接把容器中的 Bean 全部取出（相当于提

供了可选代的特性），⽽不是逐⼀用 name 获取（逐⼀获取很⿇烦，⽽且可能取不全）。

Ifthis is a HierarchicalBeanFactory, the return values will not take any BeanFactory hierarchy

into account, but will relate only to the beans defined in the current factory. Use the BeanFactory Uris

helper class to consider beans in ancestor factories too.

紧接着的这⼀段给我们提供了⼀个关键信息：如果当前 BeanFactory 同时也是

HierarchicalBeanFactorY，则返回值会忽略 BeanFactory 的层次性结构，⽽仅与当前

BeanFactory 中定义的Bean 有关。换⾔之，ListableBeanFactory 只会列举当前容器的

bean 对象，上⽂中提到 BeanFactorY 具有层次性，在这种前提下，在列举所有bean 对象时，

就需要斟酌到底是获取包括⽗级容器在内的所有 bean 对象，还是只获取当前容器中的 bean 对

象。Spring Framework 在斟酌之后选择了只获取当前容器中的bean 对象。如果的确想获取所有

bean 对象。可以借助 BeanFactoryUtils 工具类来实现（工具类中有不少名称以"Inclu

dingAncestors"结尾的方法，表舌可以同时获取⽗级容器）

The methods in this interface will just respect bean definitions of this factory. They will ignore

any singleton beans that have been registered by other means like org.spring framework.beans.factory.

config. ConfigurableBeanFactory's registerSingleton method, with the exception of getBeanNames For Type

and getBeansOfType which will check such manually registered singletons too. Of course, BeanFactoryy's

getBean does allow transparent access to such special beans as well. However, in typical scenarios，

all beans will be defined by external bean definitions anyway, so most applications don't need to

worry about this differentiation.

本段注释强调了⼀点：ListableBeanFactory 会有选择性地列举。ListableBean

FactorY 中的方法将仅遵循当前工⼚的 Bean 定义，它们将忽略通过其他方式（例如

ConfigurableBeanFactory 的 registersingleton 方法）注册的任何单实例 Bean（但

getBeanNamesForType 和getBeansOfType 除外，它们也会检查这种⼿动注册的单实例Bean）。

⽂档注释⽐较难理解，我们换⼀种说法：作为⼀个“可迭代”的 BeanFactory，按理来

讲⾄少应该把当前容器中的所有bean 对象都列举出来，但是有些 Bean 在迭代期间会被忽略掉

⽽不列举。这似乎有点让人摸不着头脑，明明是可以列举出容器中的所有bean对象，但⼜不能

我们可以定义两个简单类：猫和狗。

I第3章 Spring Boot 的IOC 容器

试来解释 Spring Framework 的这⼀设计。

（1）⽆法迭代的 Bean？

Public class Cat｛ ｝

public class Dog ｛ ｝

之后编写XMIL 配置⽂件，只将 Cat注册到IOC 容器中，如代码清单3-2所示。

代码清单 3-2 测试只将 Cat 注册到 IOC 容器中

<？xml version="1.o" encoding="UTF-8"？>

<beans xmlns="http://www.springframework.org/schema/beans"

xmlns:xsi="http://www.w3.org/2001/XML.Schema-instance"

xsi:schemaLocation="http://www.springframework.org/schema/beans

https://www.springframework.org/schema/beans/spring-beans.xsd">

<bean class="com.linkedbear.springboot.container.beanfactory.bean.Cat"/>

<1022n8

下⾯的代码清单3-3是使用 XML 配置⽂件加载BeanFactory，注意此处不能使用 App1i

cationContext，⽽只能选择BeanFactory的最终实现 DefaultListableBeanFactory

（虽然超出了目前介绍的范围，但是不要担心，下⾯会讲解），使用这种方式，也可以加载XML

配置⽂件，以完成 BeanFactory的构建。

1代码清单3-3 测试打印容器中的所有 Bean

public class ListableBeanFactoryApplication ｛

public static void main （String［］ args） throws Exception｛

ClassPathResource resource = new ClassPathResource（"container/listable-container.xml"）；

DefaultListableBeanFactory beanFactory = new DefaultListableBeanFactory（）；

XmlBeanDefinitionReader beanDefinitionReader = new XmlBeanDefinitionReader （beanFactory）；

beanDefinitionReader.loadBeanDefinitions （resource）；

// 直接打印容器中的所有 Bean

System.out.println（"加载 XML ⽂件后容器中的Bean 如下："）；

Stream.of （beanFactory.getBeanDefinitionNames （））.forEach （System.out： ：println）；

此时如果直接打印 BeanFactory 中的Bean，可以发现只有⼀个Cat：

加载 XML ⽂件后容器中的Bean 如下：

com.linkedbear.springboot.container.beanfactory.bean.Cat#0

目前为⽌这些操作都是我们极为熟悉的，接下来我们在main 方法中添加⼏⾏代码，以完

成 Dog 的注册，如代码清单3-4所示。

1代码清单3-4 ⼿动注册 Dog 后测试打印所有 Bean

Public static void main （Stringl］ args） throws Exception ｛

希望用户随意改动系统内部使用的⼀些⽂件，因此会在⽂件资源管理器中设置⼀个选项，以隐


## 3.1Spring Framework 的IOC 容器|

1/ ⼿动注册⼀个单实例 Bean

beanFactory.registersingleton （"doggg"，new Dog（））；

// 再打印容器中的所有 Bean

system.out.println（"⼿动注册单实例 Bean 后容器中的所有 Bean 如下：“）；

Stream.of （beanFactory.getBeanDefinitionNames（））.forEach（System.out：：println）；

再次运⾏ ListableBeanFactoryApPlication 的main 方法，会发现控制台仍然只打

印了⼀个Cat：

加载 XML ⽂件后容器中的 Bean 如下：

com.linkedbear.springboot.container.beanfactory.bean.Cat#0

⼿动注册单实例 Bean 后容器中的所有 Bean 如下：

com.linkedbear.springboot.container.beanfactory.bean.Cat#0

这个运⾏结果似乎与我们预期的不符，代码清单3-4中显式地构建了⼀个 Dog 对象，并注

册到 BeanFactory 中，但是迭代打印容器中的bean 对象时却没有打印 Dog 对象。这就印证

了上⾯⽂档注释中的那句话：ListableBeanFactory 在获取容器内的所有 bean 对象时，不

会把⼿动注册（即使用 registerSingleton 方法）的bean 对象取出，也就是⽂档注释中所

说的“忽略通过其他方式”。

不过这个时候可能会有读者提出疑问：容器中真的有Dog 吗？答案是肯定的，我们可以通

过BeanFactory 的getBean方法成功获取（读者可以⾃⾏测试），说明Dog对象本身是存在的。

（2）设计选择性列举的目的

⽆法迭代的现象出现了，Spring Framework 为什么要如此设计呢？借助IDE，查看

ConfigurableBeanFactory 的 registersingleton 方法调用，可以发现在 Abstract

ApplicationContext 的prepareBeanFactory 方法中有⼀些使用，如代码清单3-5所示。

1代码清单3-5 底层注册特殊类型的 Bean

//注册默认的环境 Bean

if （！beanFactory.containsLocalBean （ENVIRONMENT_BEAN_NAME））

beanFactory.registersingleton （ENVIRONMENT_BEAN_NAME，gettnvironment（i

if （！beanFactory.containsLocalBean （SYSTEM_PROPERTIES_BEAN_NAME））｛

beanFactory.registerSingleton （SYSTEM_PROPERTIES_BEAN_NAME，

getEnvironment （）.getSystemProperties （））；

i （！beanFactory.containsLocal Bean （SYSTEM_ENVIRONMENT_BEAN_NAME））！

beanFactory.registersingleton （SYSTEN_ENVIRONMENT_BEAN_NAME，

gettnvLronment（•getoystemtnvironment（）；

可以发现，源码在此处使用 beanFactory.registersingleton 的方式注册了⼏个组

件，⽽这些组件仅供 Spring Framework 内部使用，这样做的目的是 Spring Framework 不希望

开发者直接操控它们，于是就使用了这种设计方式来隐藏这些内部组件。

如果这种设计不是很好理解，我们可以举另外⼀个例子，在Windows 操作系统中，系统不

⾼级设置：

些操作系统⽂件，但倘若我们不懂操作系统，要是真的改动了它们，则计算机可能会出现⼀些

意外的错误或故障。



# 第3章 Spring Boot 的IOC 容器


## 第3章 Spring Boot 的IOC 容器

藏受保护的操作系统⽂件（在控制⾯板⼀⽂件资源管理器选项中），如图3-3所示。

回显示状态栏

⻛隐藏空的驱动器

口 隐藏受保护的操作系统⽂件（推荐）

隐藏⽂件和⽂件実

◎ 不显示隐藏的⽂件、⽂件夹或驱动器

• 显示隐藏的⽂件、⽂件夹和驱动器

回 隐藏⽂件来合并冲突

图 3-3 Windows 默认隐藏受保护的系统⽂件

默认情况下这个选项是勾选的（意思就是 Windows 默认会隐藏这些⽂件，由 Windows和软

件⾃⾏管理，不希望用户⼲涉），当然我们可以取消勾选它，这样⽂件资源管理器中也能显示那

4. AutowireCapableBeanFactory

AutowireCapableBeanFactory 这个类的名称中有⼀个熟悉的概念：autowire（⾃动

注入）。可⻅ AutowireCapableBeanFactory是⼀个⽀持⾃动注人的BeanFactory，同时

也意味着 AutowireCapableBeanFactory 可以⽀持依赖注人。⽂档注释中下了很大的功夫

解释 AutowireCapableBeanFactory 的作用，分段来看。

Extension of the BeanFactory interface to be implemented by bean factories that are capable of

autowiring, provided that they want to expose this finctionality for existing bean instances.

This subinterface of BeanFactory is not meant to be used in normal application code: stick to

BeanFactory or ListableBeanFactory for typical use cases.

Integration code for other frameworks can leverage this interface to wire and populate existing

bean instances that Spring does not control the lifecycle of. This is particularly useful for Web Work

Actions and Tapestry Page objects, for example.

前两段注释最为重要，不过直接理解可能会有些困难，这⾥换⼀种方式来理解：

AutowirecapableBeanFactorY可以⽀持组件的⾃动注人，⽽且可以为⼀些现有的、没

有被 Spring Framework 统⼀管理的 Bean 提供组件⾃动注入的⽀持。紧接着⽂档解释了

AutowirecapableBeanFactory 如何使用，⼀般情况下，在正常的项目开发中不会接触到

AutowireCapableBeanFactorY，⽽是在第三方框架与 Spring Framework 整合时才可能会

用到。注意⽂档注释的描述：利用此接⼜来连接和注入那些 Spring Framework ⽆法控制其⽣

命周期的现有 bean 实例。这其实已经把 AutowireCapableBeanFactory 的作用完整地描

述出来了：AutowireCapableBeanFactory 通常用于与其他框架集成的场景，如果其他框

架的某些 bean 实例⽆法让 Spring Framework 接管，但⼜需要注入⼀些由 Spring Framework 管理

的 bean 对象，就可以使用 AutowireCapableBeanFactory 辅助完成注人。

可能有读者不理解，在什么样的具体场景中会用到 AutowireCapableBeanFactory 的

这个特性呢？试想如果我们要编写⼀个⾃定义的 Servlet，在这个 Servlet 中需要注入 Spring

Framework 中管理的 Bean，应该如何实现呢？根据IOC 的两种实现方式，Spring Framework 均

可以提供解决方案。

所示。

读者务必先理解清楚这⼀对概念，之后我们就可以往下阅读了。


## 3.1 Spring Framework 的IOC 容器|

• 依赖查找：由 Servlet 获取到 HttpServletRequest 后取得 ServletContext，

借助 webAppliCationContextUtils 可以获取。

• 依赖注人：给需要注人的组件上标注@Autowired 注解，借助 AutowireCapable

BeanFactory 辅助注人。

依赖查找的方式⽐较容易理解，在 Spring Framework 整合 Web 开发的场景中都有涉及；依

赖注人的方式在下⾯⼀段javadoc 中有解释。

Note that this interface is not implemented by ApplicationContext facades, as it is hardly ever

used by application code. That said, it is available from an application context too, accessible through

ApplicationContext's getAutowire CapableBeanFactory（ method.

⽂档注释请我们注意，ApplicationContext 本身并没有实现 AutowireCapable

BeanFactory 接口，需要我们通过 ApplicationContext 的方法间接获取 Autowire

CapableBeanFactory。如果需要给⾃定义的 Servlet 等没有被 Spring Framework 统⼀管理

的 Bean 注入组件，可以在获取 AutowirecapableBeanFactory 后调用其 API 实现依赖

注入。

最后简单总结⼀下，AutowirecapableBeanFactory 这个 API⼀般不需要我们去操纵，

因为正常的项目开发中不会使用，但如果需要获取 AutowirecapableBeanFactory，可以

通过ApplicationContext 间接获取。

5. ConfigurableBeanFactory

这个接⼜需要引起重视，Spring Framework 中对于核心AP1 的命名有⾮常强的规律性。当

我们看到类名带有 Configurable 前缀时，意味着这个接⼜的⾏为有“写”的动作，⽽去掉

Configurable 前缀的接⼜只有“读”的动作。这⾥要提到⼀对概念：可写与可读。回想⾯向对象

编程中，⼀个类的属性设置为 private 后，提供 get 方法意味着该属性可读，提供 set 方法意味

着该属性可写。同样，Spring Framework 的这些 BeanFactory，包括后⾯的 Application

Context 中，都会有这样的设计：普通的 BeanFactory 只有 get 相关的操作，⽽ Configurable

前缀的 BeanFactory 或者Applicationcontext 就具有了 set 相关的操作，如代码清单3-6

代码清单 3-6 ConfigurableBeanFactory 中的部分 set 方法

void setBeanClassLoader （@Nullable Classloader beanClassLoader）；

vo1a setlYpeconverter （ YPeconverter tYpeconverter）i

void addBeanPostProcessor （BeanPostProcessor beanPostProcesSOr）；

Configuration interface to be implemented by most bean factories. Provides facilities to

configure a bean factory, in addition to the bean factory client methods in the BeanFactory interface.

This bean factory interface is not meant to be used in normal application code: Stick to

BeanFactory or org.springframework.beans.factory. ListableBeanFactory for bypical needs. This

extended interface is just meant to allow for framework-internal plug'n Pplay and for special access to

bean factory configuration methods.

⽂档注释并没有占很大篇幅，不过已经讲得很清楚了。⽂档中提到 Configurable

有部分功能，并不是完整的实现。下⾯分段阅读⽂档注释。

and

件。它的设计思路是：⽗类提供逻辑规范，子类提供具体步骤的实现。在⽂档注释中，我们可

提示：



# 第3章Spring Boot 的IOC 容器


## 第3章Spring Boot 的IOC 容器

BeanFactory 已经提供了带配置的功能，可以调用它定义的方法对 BeanFactory 进⾏修改、

扩展等操作。但是紧接着⽂档又提到 SpringFramework 不希望开发者用 Configurable

BeanFactory，⽽是坚持使用最基础的 BeanFactory，原因是原则上程序在运⾏期间不应该

对BeanFactory再进⾏频繁的变动，此时只应该有读的动作，⽽不应该出现写的动作（除⾮

是确定要有对BeanFactory 进⾏写的操作，且有把握）。

6. AbstractBeanFactory

上⾯介绍的都是有关 BeanFactory 接口部分的内容，接下来我们来看两个抽象实现和⼀

个落地实现。⾸先是 BeanFactory 的最基础的抽象实现 AbstractBeanFactory，它只具

Abstract base class for BeanFactory implementations, providing the full capabilities of the

ConfigurableBeanFactory SPl. Does not assume a listable bean factory: can therefore also be used as

base class for bean factory implementations which obtain bean definitions from some backend

resource （where bean definition access is an expensive operation）.

第⼀段注释中解释了 AbstractBeanFactory作BeanFactory接口下⾯第⼀个抽象的实

现类，具有最基础的功能且可以从配置源（XMIL、LDAP、RDBMS 等）获取Bean 的定义信息（即

BeanDefinition，要查看有关BeanDefinition 的讲解请参阅3.5节，这⾥不作展开）。

This class provides a singleton cache （through its base class DefaultSingletonBeanRegistryy），

singleton/prototype determination, Factory,Bean handling, aliases, bean definition merging for child

bean definitions, and bean destruction （org.springframework.beans.factory DisposableBean interface，

custom destroy methods）. Furthermore, it can manage a bean factory hierarchy （delegating to the

parent in case of an unknown bean）， through implementing the org.springframework.beans.factory.

HierarchicalBeanFactory interface.

紧接着的⼀段中解释了 AbstractBeanFactory 对Bean 的⽀持。AbstractBean

Factory 可以提供单实例 Bean 的缓存（通过其⽗类 DefaultSingletonBeanRegistry）、

单实例/原型 Bean 的裁定 FactoryBean 处理、Bean 对象的别名存储、用于子 Bean定义的

BeanDefinition 合并，以及 Bean销毁（DisposableBean 接口，⾃定义 destroy 方法）。

此外，AbstractBeanFactory 可以通过实现 HierarchicalBeanFactory 接⼜来管理

BeanFactory 的层次性结构（在未知 Bean 的情况下委托给⽗级工⼚）。

The main template methods to be implemented by subclasses are getBeanDefinition

createBean, retrieving a bean definition for a given bean name and creating a bean instance for a

given bean definition, respectively. Default implementations of those operations can be found in

DefaultListableBeanFactory and AbstractAutowireCapableBeanFactory.

最后⼀段提到了⼀个关键信息：Spring Framework 中大量使用模板方法模式来设计核心组

以看到 AbstractBeanFactory 中对 getBeanDefinition 和 createBean这两个方法进

⾏了规范上的定义，分别代表获取Bean 的定义信息，以及创建bean对象，这两个方法在 Spring

Framework 的IOC 容器初始化阶段起着⾄关重要的作用。

createBean 是 Spring Framework 能管控的所有 Bean的创建入口。

javadoc。

底层实现，在第7章会有详细讲解，此处不作展开。

resolveDependency

中真正实现。


## 3.1 Spring Framework 的IOC容器|

7. AbstractAutowireCapableBeanFactory

从 AbstractAutowireCapableBeanFactory 的类名可以看出，它是 Autowire

CapableBeanFactory 接口的具体实现，也意味着它的内部实现组件⾃动装配的逻辑。其实

AbstractAutowirecapableBeanFactory 的作用不仅是这些，我们仔细阅读下⾯的

Abstract bean factory superclass that implements default bean creation, with the full capabilities

specified by the RootBeanDefinition class. Implements the AutowireCapableBeanFactory interface in

addition to AbstractBeanFactory's createBean method.

第⼀段注释提到 AbstractAutowireCapableBeanFactory 是实现了默认 bean 对象

创建逻辑的 BeanFactory 接口的抽象类，它除了实现 AbstractBeanFactory 的

createBean 方法，还额外实现了 AutowireCapableBeanFactory 接口的方法，这就意味

着bean 对象真正的创建动作都在 AbstractAutowireCapableBeanFactory 中完成。

提示：其实 createBean 方法也不是最终实现 Bean 创建的方法，⽽是由另⼀个叫作

doCreateBean 的方法实现的，它同样在 AbstractAutowireCapableBeanFactory 中

定义，⽽且是 protected 方法，没有子类重写它。有关 createBean 与 doCreateBean 方法的

Provides bean creation （with constructor resolution）， property population, wiring （including

autowiring）， and initialization. Handles runtime bean references, resolves managed collections, calls

initialization methods, etc. Supports autowiring constructors, properties by name, and properties by type.

紧接着的⼀段列出了 AbstractAutowireCapableBeanFactory 中实现的核心功能：

bean 对象的创建、属性的赋值和依赖注入和 Bean 的初始化逻辑执⾏。这⼏个步骤即是创建

Bean 的最核心的三个步骤。

The main template methodto be implementedby subclasses is

（DependencyDescriptor, String, Set, TypeConverter）， used for autowiring by type. In case of a factory

which is capable of searching its bean definitions, matching beans will typically be implemented

through such a search. For other factory styles, simplified matching algorithms can be implemented.

这⼀段内容告诉我们 AbstractAutowireCapableBeanFactory 并没有把所有的模板

方法都实现，它保留了⽂档注释中提到的 resolveDependency 方法，这个方法的作用是解

析 Bean 的成员中定义的属性依赖关系，会在下⾯提到的 DefaultListableBeanFactory

Note that this class does not assume or implement bean definition registry capabilities. See

DefaultListableBeanFactory for an implementation of the ListableBeanFactory and BeanDefinition

Registry interfaces, which represent the APl and SPl view of such a factory, respectively.

最后⼀段阐述的是 AbstractAutowireCapableBeanFactory 实现了对 Bean 的创建、

赋值、注入和初始化的逻辑，但对于 Bean 的定义信息是如何进入 BeanFactory 的部分没有涉

及。这其中包含两个流程：Bean 的创建和 Bean 定义的注册。这在后⾯涉及 BeanDefinition

的章节以及本书第2部分会详细讲解。

Factory的落地实现。它的设计相当重要，读者⼀定要对它⾜够重视。

post-processors.

次提到。

【第3章Spring Boot 的IOC 容器

8. DefaultListableBeanFactory

最后要介绍的 DefaultListableBeanFactory 是唯⼀目前底层正在使用的Bean

Spring's default implementation of the ConfigurableListableBeanFactory and BeanDefinition

Registry interfaces: a full-fledged bean factory based on bean definition metadata, extensible through

第⼀段内容提到，DefaultListableBeanFactory 是 BeanFactory 最终的默认实现，

通过源码可以了解，DefaultListableBeanFactory 已经没有 abstract 关键字的标注，说

明 DefaultListableBeanFactory 是⼀个成熟的落地实现类。另外，DefaultListable

BeanFactory 还实现了 BeanDefinitionRegistry 接口，具有 Bean定义信息（即 Bean

Definition）的统⼀管理能⼒。

提示：这⾥我们多注意⼀点：BeanDefinitionRegistry 从字⾯意思理解是⼀个 “Bean定义

的注册器”，⽽且我们能强烈地感受到它与 BeanDefinition的关系极紧密，在3.5节中会再

Typical usage is registering all bean definitions first （possibly read from a bean definition file），

before accessing beans. Bean lookup by name is therefore an inexpensive operation in a local bean

definition table, operating on pre-resolved bean definition metadata objects.

注意理解这⼀段内容，当 DefaultListableBeanFactory 要取指定的 Bean 之前，

应该先把 Bean 的定义信息注册进去，由此可知，DefaultListableBeanFactory 在

AbstractAutowirecapableBeanFactory 的基础上完成了注册 Bean 定义信息的动作，⽽这个

动作就是通过 BeanDefinitionRegistry 实现的。由此可以总结出⼀点：完整的BeanFactory

对 Bean 的管理应该是，先注册 Bean 的定义信息，再完成 Bean 的创建和初始化动作。

Note that readers for specific bean definition formats are typically implemented separately rather

than asbean factory subclasses: see for example PropertiesBeanDefinitionReader and org.

springframework.beans.factor.xml.XmlBeanDefinitionReader.

最后⼀段内容是⼀个小提舌：特定的 Bean定义信息格式的解析器通常是单独实现的，⽽不

是作为 BeanFactory 的子类实现的，有关这部分的内容参⻅ PropertiesBean

DefinitionReader 和 XmlBeanDefinitionReader。由此可以体现出，Spring Framework

对于组件的单⼀职责把控得⾮常好。BeanFactory 作为⼀个统⼀管理Bean组件的容器，它的

核心工作就是控制 Bean 在创建阶段的⽣命周期与 bean 对象的统⼀管理，⽽对于 Bean 从哪⾥

来、如何被创建、有哪些依赖要被注入，这些都与 BeanFactory ⽆关，⽽是有专⻔的组件来

处理（包括上⾯提到的 BeanDefinitionReader 在内的⼀些其他组件）。

⾄此，有关 BeanFactory相关的重要接口和实现类全部讲解完毕。了解 BeanFactory

的相关扩展和实现后，接下来是更复杂的Applicationcontext体系。


## 3.1.2 ApplicationContext

APPlicationcontext 是基于BeanFactory的扩展，它提供了更为强大的特性。我们

性。下⾯逐⼀展开讲解。

用程序运⾏时，它是只读的，但是如果⽀持的话，它可以重新加载。注意重新加载这个概念，

Publisher interface.

上下⽂要区分理解。上下⽂中包含容器，但⼜不仅仅是容器。容器只负责管理 Bean，但上下⽂

中还包括动态增强、资源加载、事件监听机制等多方⾯扩展功能。


## 3.1 Spring Framework 的IOC容！

照例先看 ApplicationContext 接口和它的⽗接口、扩展接口之间的关系，如图3-4所示。

a1Tntonfac：

：hica Beanfactory電、 Resoure

*ConfigurableApplicationcontext

图 3-4 ApplicationContext 和它的子接口

从图3-4中可以清楚地看到，ApPlicationContext 除了继承 BeanFactory接口，还

额外继承了⼏个功能性接口，这些接口共同组成了 ApPlicationcontext 扩展的⼏个核心特

1. ApplicationContext 的根接口

ApplicationContext 作为日常操作 Spring Framework 的核心API，它必然是主⻆，然

⽽javadoc 的篇幅并不⽐ BeanFactory ⻓，下⾯分段讲解。

Central interface to provide configuration for an application. This is read-only while the

application is running, but may be reloaded ifthe implementation supports this.

第⼀段话⾔简意赅，ApP1icationcontext 是Spring Framework 的核心中央接口。在应

在下⾯的 AbstractRefreshableApplicationContext 中会体现。

An ApplicationContext provides：

• Bean factory methods for accessing application components. Inherited from Listable

BeanFactory.

• The ability to load file resources in a generic fashion. Inherited from the ResourceLoader

interface.

• The ability to publish events to registered listeners. Inherited from the ApplicationEvent

• The ability to resolve messages, supporting internationalization. Inherited from the Message

Source interface.

• Inheritance from a parent context. Definitions in a descendant context will always take

priority. This means, for example, that a single parent context can be used by an entire web

application, while each servlet has its own child context that is independent of that of any

other servlet.

紧跟着的⼀段内容列出了 ApplicationContext 的核心功能，大致包含访问 Bean 的能

⼒、加载⽂件资源、事件发布、国际化⽀持、层级关系⽀持。注意“层级关系⽀持” 的概念，

Applicationcontext 也是⽀持层级结构的，但这⾥⽂档注释的描述是⽗子上下⽂，容器与

In addition to standard BeanFactory lifecycle capabilities, ApplicationContext implementations

最后⼀段注释解释了⼀个设计，即除了标准的

的实现类可以由客户端代码修改其内部的某些配置。⽂档注释不算⻓，分段来看。

客户端方法，还提供了用于配置应用程序上下⽂的功能。这可以从接口方法中得以体现，

⼀来看。

【第3章 Spring Boot 的IOC 容器

detect and invoke ApplicationContextAware beans as well as ResourceLoaderAware, Application

EventPublisherAware and MessageSourceAware beans.

BeanFactory ⽣命周期功能，

Applicationcontext 的实现类还检测并调用实现了 ApplicationContextAware、

ResourceloaderAware、ApplicationEventPublisherAware 以及 MessageSource

Aware 接口的 Bean。这句话的理解要结合图3-4 的接口继承关系，从图3-4中明显可以发现

Applicationcontext 还额外继承了⼏个⽗接口，⽽这⼏个接口都有对应的Aware 接口实现

回调注入，只不过由于 ApplicationContext 继承了这⼏个⽗接口，因此最终回调注人的都

是ApplicationContext 本身。

2. ConfigurableApplicationContext

与上⾯提到的 BeanFactory 与 ConfigurableBeanFactory 相似，Configurable

Applicationcontext 也为 Applicationcontext 提供了“可写”的功能，实现了该接口

SPI interface to be implemented by most if not all application contexts. Provides facilities to

configure an application context inaddition tothe application context client methods in the

ApplicationContext interface.

第⼀段注释提到 ConfigurableApplicationContext 会被绝大多数 Application

Context 的最终实现类实现。除了 ApplicationContext 接口中的应用程序上下⽂

ConfigurableApplicationContext 接口中扩展了 setParent、setEnvironment、

addBeanFactoryPostProcessor、addApPlicationlistener 等方法，这都是可以改变

ApplicationContext 本身的方法。

Configuration and lifecycle methods are encapsulated here to avoid making them obvious to

ApplicationContext client code. The present methods should only be used by startup and shutdown

code.

这段注释告诉我们，配置和与⽣命周期相关的方法都封装在 ConfigurableApplication

Context 中，目的是避免暴露给 ApplicationContext 的调用者。Configurable

ApplicationContext 的方法仅应该由启动和关闭代码使用。由这段话可以看出，虽然

ConfigurableApplicationContext 本身扩展了⼀些方法，但是⼀般情况下它不希望让开

发者调用，⽽是只允许调用刷新容器（refresh）和关闭容器（close）方法。注意，这个“⼀般

情况”是在程序运⾏期间的业务代码中，如果是 了定制化 Applicationcontext 或者对其

进⾏扩展，ConfigurableApplicationContext 的扩展则会成为切入的主目标。

3. ApplicationContext 的⽗接口

ApPlicationContext 的子接口只有ContigurableApplicationContext，但它还

实现了⼏个⽗接口，这些接口共同组成了 ApPlicationcontext 扩展的⼏个核心特性，我们

（1） EnvironmentCapable

capable 意为“有能⼒的”，在这⾥解释为“携带/组合”更为合适。这⾥有⼀个有助于理解

Spring Framework 源码的规律：在 Spring Framework 的底层源码中，如果⼀个接口的名称以

本身和应用程序的运⾏时环境。

提供对应的符合用户阅读习惯（语⾔）的页⾯和数据。对于不同地区、使用不同语⾔的用户，

的落地实现类对象中，以此完成国际化⽀持。

播器和监听器。

事件⼴播器⼴播事件的能⼒。


## 3.1 Spring Framework 的IOC 容器|

Capable 结尾，通常意味着可以通过这个接口的某个特定的方法（通常是 getxxx（））获取特定

的组件。根据这个概念，EnvironmentCapable 接口中就应该通过 getEnvironment（）方

法获取 Environment，事实上也确实如此。

EnvironmentCapable 接口与 Environment 强关联。Environment 本身也是 Spring

Framework中的⼀个很重要的设计，这个组件的设计在3.4 节会讲到，这⾥先简单提⼀下。

Environment 是 Spring Framework 中抽象出来的类似于运⾏环境的独⽴抽象，它内部存放着

应用程序运⾏所需的⼀些配置。基于 Spring Framework 的项目在运⾏时包含两部分：应用程序

EnvironmentCapable 与 ApplicationContext 的关系是：只要取到 Application

Context 的实例，就可以借助EnvironmentCapable 接口获取到Environment。如果是

ConfigurableApplicationContext，则可以获取到 ConfigurableEnvironment。

（2） MessageSource

MessageSource 是国际化⽀持的组件。国际化是针对不同地区、不同国家的访问，可以

需要分别提供对应语⾔环境的描述。ApPlicationContext 使用委托机制对国际化予以⽀持。

在 ApplicationContext 实现类的内部整合了⼀个 Messagesource 的真正实现，当我们调

用 ApplicationContext 的国际化相关方法时，内部直接将调用转发到 MessageSource

（3）ApplicationEventPublisher

从类名上理解，ApplicationEventPublisher 是⼀个事件发布器。Spring Framework

内部⽀持强大的事件监听机制，⽽ApP1icationcontext 作容器的顶层，⾃然也要实现观

察者模式中⼴播器的⻆⾊。这⾥我们简单提⼀下 Spring Framework 中设计的事件驱动机制。

Spring Framework 中，体现观察者模式的特性就是事件驱动和监听器。监听器充当订阅者，

监听特定的事件；事件源充当被观察的主题，用来发布事件；IOC 容器本身也是事件⼴播器，

可以理解成观察者。Spring Framework 的事件驱动核心可以划分为4部分：事件源、事件、⼴

• 事件源：发布事件的对象。

• 事件：事件源发布的信息/做出的动作。

• ⼴播器：事件真正⼴播给监听器的对象。

• 监听器：监听事件的对象。

在这个模型中，ApplicationContext 的⻆⾊是⼴播器：ApplicationContext 实现

T ApplicationEventPublisher 接口，具有事件⼴播器发布事件的能⼒；ApP1ication

Context 的内部组合了 ApplicationEventMulticaster，它组合了所有的监听器，具有

（4）ResourcePatternResolver

ResourcePatternResolver 接口是ApplicationContext继承的功能性接口中最复

杂的⼀个，从类名理解可以解释为“资源模式解析器”，实际上ResourcePatternResolver

的作用是根据特定的路径解析资源⽂件。ResourcePatternResolver 本身是 Resource

Loader 的扩展，它可以⽀持 Ant形式的带星号（*）的路径解析。另外，ResourcePattern

件加载到应用程序中，从⽽完成功能配置、属性赋值等工作。

定义和实现了绝大部分应用上下⽂的特性和功能，⼀定要重视。下⾯是⽂档注释的内容，分段

来解读。

|第3章 Spring Boot 的IOC 容

Resolver 本身是基于路径匹配的解析器，这种扩展实现的特点是可以根据特殊的路径返回多

个匹配到的资源⽂件。借助⽂件匹配的机制，ApplicationContext 可以将所需要的资源⽂

？提示：补充关于 Ant形式的路径匹配写法。

• /WEB-INE/*.xml：匹配/WEB-INE 目录下的任意 XML ⽂件。

• /WEB-INF/**/beans-*.xml：匹配/WEB-INE 目录下任意层级目录的 beans-开头的

XMIL ⽂件。

• /**/*.xml：匹配任意 XML ⽂件。

以上是三种常用的Ant形式的路径匹配写法，感兴趣的读者可以从网上搜索学习更多关于 Ant风格的写法。

4. AbstractApplicationContext

介绍完接口，接下来是 ApplicationContext 的⼏个重要的实现类。我们先将 Spring

Framework 中ApplicationContext 的重要实现类都罗列出来，如图3-5所示。

wApplicationContext

$sConfigurableApplicationContext

繳wAbstractApplicationcontext

《“AbstractRefreshableApplicationContext ©wGenericApplicationContext

wAbstractRefreshableConfigApplicationContext ©wAnnotationConfigApplicationContext

繳wAbstractxmlApplicationContext

©wFilesystemxmlApplicationcontext ClassPathxnlApplicationcontext

图 3-5 ApplicationContext 的实现类

从图3-5中可以发现，ApplicationContext 接口的众多实现类中，顶层的抽象类是

AbstractApp1icationContext，这个类极为重要。AbstractApPlicationContext 中

Abstract implementation of the ApplicationContext interface. Doesn't mandate the bype of storage

used for configuration; simply implements common context functionality. Uses the Template Method

design pattern, requiring concrete subclasses to implement abstract methods.

第⼀段⽂档提到 AbstractApplicationContext 是ApplicationContext 接口的抽

象实现，它只是简单地实现了应用上下⽂的基本功能，并不强制约束配置的承载形式（XMIL、

注解驱动等）。AbstractApplicationContext 的内部会使用大量模板方法规范整体功能逻

我们也要重点关注。


## 3.1 Spring Framework 的 IOC 容器 |

辑，具体的实现由子类负责。总结⼀下，AbstractApplicationcontext 只构建功能抽象。

In contrast to a plain BeanFactory, an ApplicationContext is supposed to detect special beans

defined in its internal bean factory: Therefore, this class automatically registers BeanFactory

PostProcessors, BeanPostProcessors, and ApplicationListeners which are defined as beans in the

context.

紧跟着的⼀段解释了 ApplicationContext 相较于 BeanFactory 对于特殊类型 Bean

处理的扩展。与普通的 BeanFactory相⽐，ApplicationContext 应当能够检测在其内部

bean 对象工⼚中定义的特殊 Bean，这类⾃动注册在上下⽂中定义为 Bean 的包括 Bean

FactoryPostProcesSOrs、BeanPostProcesSOrs 和 ApplicationListeners。其实

这⼏种 Bean 本身也是⼀些组件对象，只不过在 ApplicationContext 中它们会发挥更重要

的作用，所以 ApplicationContext 将它们区分出来，并且给予它们发挥特殊功能的机会。

A MessageSource may also be supplied as a bean in the context, with the name "messageSource"；

otherwise, message resolution is delegated to the parent context. Furthermore, a multicaster for

application eventscan be supplied as an"applicationEventMulticaster"bean of bype

ApplicationEventMulticaster in the context; otherwise, a default multicaster of type

SimpleApplicationEventMulticaster will be used.

这⼀段内容描述了对功能性接⼜扩展的⽀持，Applicationcontext 实现了国际化接⼜

MessageSource、事件⼴播器接口 ApplicationEventMulticaster，作为容器，它也会

把⾃⼰看成⼀个 Bean，以⽀持不同类型的组件注入需要。

Implements resource loading by extending DefauliResourceLoader. Consequently treats non-URL

resource paths as class path resources （supporting full class path resource names that include the

package path, e.g. "mypackage/myresource.dat'"）， unless the getResourceByPath method is overridden

in a subclass.

最后⼀段⽂档注释中解释了 AbstractApplicationContext 提供默认的加载资源⽂件

策略。默认情况下，AbstractApplicationContext 加载资源⽂件的策略是直接继承

DefaultResourceloader 的策略，从类路径下加载；但在Web 项目中加载策略可能会发⽣

改变，AbstractApplicationcontext 的 Web 场景实现类可以从 ServletContext 中加

载（扩展的子类 ServletContextResourceloader 等）。

提示：有关 AbstractApplicationContext，这⾥再多提⼀句。AbstractApplication

Context 中定义了⼀个特别重要的方法，它是控制 ApplicationContext ⽣命周期的核心方

法：refresh。这个方法分为 13 步，包含⼀个 Spring Framework 应用上下⽂的所有重要步骤处理。

关于这部分内容，我们先在3.6节简单接触，第7章IOC容器的⽣命周期中会详细展开讲解。

5. GenericApplicationContext

Spring Framework 的IOC 容器最终落地有基于 XML 配置⽂件和注解驱动两种实现方式。

Spring Boot 已经放弃了基于XML 配置⽂件的实现方式，所以我们着重研究与注解驱动相关的

ApplicationContext 实现。GenericApplicationContext 是注解驱动 IOC 容器的第⼀

个⾮抽象实现类，它已经具备 ApplicationContext 所有的基本能⼒了。对于它的⽂档注释

它没有对此做任何扩展，仅仅是委托机制的体现。

【第3章Spring Boot 的IOC容器

Generic ApplicationContext implementation that holds a single internal DefaultListableBean

Factory instanceand does not assume a specific bean definition format. Implements the

BeanDefinitionRegistry interface in order to allow for applying any bean definition readers to it.

第⼀段注释中提到 GenericApplicationContext 是⼀个通用 Application

Context 的实现，该实现拥有⼀个内部 DefaultlistableBeanFactory 实例，并且不采用

特定的Bean 定义格式。另外它还实现了 BeanDefinitionRegistry 接⼜，以便允许将任何

Bean 定义读取器应用于该容器中。

这段注释的信息量很大，我们要把握两个重点：GenericApplicationContext 中组合

了⼀个 DefaultListableBeanFactory，由此可以得到⼀个重要信息，即 Application

Context 并不是继承⾃BeanFactory 的容器，⽽是组合了 BeanFactory；Generic

APPlicationContext 实现了 BeanDefinitionRegistry，所以 Bean 的定义信息可以由

GenericApplicationContext 注册到容器中。

Typical usage is to register a variety of bean definitions via the BeanDefinitionRegistry interface

and then call refreshO to initialize those beans with application context semantics（handling

org.springframework.context.ApplicationContextAware, auto-detecting BeanFactoryPostProcessors, etc）.

第⼆段注释中⼜提到了 BeanDefinitionRegistry,GenericApplicationContext

实现了 BeanDefinitionRegistry 接口，可以⾃定义注册⼀些 Bean。然⽽在 Generic

ApplicationContext 中，它实现的定义注册方法 registerBeanDefinition，在底层还

是调用的 DefaultListableBeanFactory 执⾏ registerBeanDefinition 方法，说明

In contrast to other ApplicationContext implementations that create a new internal BeanFactory

instance for each refresh, the internal BeanFactory of this context is available right from the start, to

be able to register bean definitions on it. refresh（ may only be called once.

这段注释中解释了重复刷新的设计。由于 GenericApplicationcontext 中组合了⼀个

DefaultListableBeanFactorY，⽽这个 BeanFactory 在GenericApplicationContext

的构造方法中就已经初始化完毕，⽽初始化完毕的BeanFactory 不允许在运⾏期间被重复刷

新。具体源码实现如代码清单3-7所示。

代码清单 3-7 GenericApplicationContext 不允许重复刷新的底层逻辑

public GenericApplicationContext （）｛


## 11 内置的 beanFactory 在GenericApplicationContext 创建时就已经初始化完毕

this.beanFactory = new DefaultListableBeanFactory（）；

Protected final void refreshBeanFactory（）throws I1legalStateException ｛

if（！this.refreshed.compareAndSet （false，true））⼀

1/ 利用CAS，保证只能设置⼀次true，如果出现第⼆次，就抛出重复刷新异常

throw new I1legalStateException （"GenericApplicationContext does not support multiple

refresh attempts: just call 'refresh'once"）；

this.beanFactory.setSerializationId（getId（））；

formats.

速了解即可。

置类就是驱动加载源。


## 3.1 Spring Framework 的IOC 容器】

如果在⽂档注释中没有直接说不允许重复刷新，⽽是在段落开头加⼀个“与.相反”的前

缀，那么是因为有另⼀类 ApplicationContext 的设计不是这样的，它就是 Abstract

RefreshableApplicationContext，下⾯会简单提⼀下。

For the typical case of XML bean definitions, simply use ClassPathXmlApplicationContext or

FileSy;stemXmlApplicationContext, which are easier to set up - but less flexible, since you can just use

standard resource locations for XML bean definitions, rather than mixing arbitrary bean definition

The equivalent in a web environment is org.springframework.web.context.support.

Xml WebApplicationContext.

最后⼀段内容提到了 Web 环境相关的配置。对于 XML Bean 定义的典型情况，只需使用

ClassPathxm1ApplicationContext 或FilesystemxmlApplicationContext，因内

它们更易于设置（但灵活性较差，只能从标准的资源配置⽂件中读取 XML Bean 定义，⽽不能

混合使用任意 Bean 定义的格式）。在 Web 环境中，GenericApplicationContext 的替代

方案是 xmlWebApplicationContext。

6. AnnotationConfigApplicationContext

AnnotationConfigApplicationContext 是 Spring Framework 中 常使用的注解驱

动IOC容器，它本⾝继承⾃ GenericApplicationContext，那么⾃然它也只能刷新⼀次。

⽂档注释中并没有花太多篇幅去描述 AnnotationConfigApplicationContext，我们快

Standalone application context，accepting component Classes as input-in particular

@Configuration-annotated classes, but also plain @Component types and JSR-330 compliant classes

using javax.inject annotations.

第⼀段注释中说明 AnnotationConfigApplicationContext 是⼀个独⽴的注解驱动

的 ApplicationContext，它接受组件类作输入（特别是使用@Configuration 注解的

类），还可以使用普通的@Component 类和符合 JSR-330规范（使用javax.inject 包的注解）

的类。注意⽂档注释的措辞，它更重视的是被@Configuration 注解标注的类，因为⼀个被

@Configuration 标注的类相当于⼀个 XML ⽂件，对⼀个注解驱动的IOC容器来讲，注解配

Allows for registering classes one by one using register（Class..） as well as for classpath

scanning using scan（String..）.

In case of multiple @Configuration classes，@Bean methods defined in later classes will

override those defined in earlier classes. This can be leveraged to deliberately override certain bean

definitions via an extra @Configuration class.

这段⽂档注释告诉我们，AnnotationconfigApplicationContext 允许使用

register （Class •••）方法直接传入指定的配置类，以及使用 scan（String ••.）方法进

⾏类路径的包扫描。如果有多个@Configuration 类，则在后⾯的类中定义的@Bean 方法将

覆盖在先前的类中定义的方法。这可以通过⼀个额外的@Configuration 类来故意覆盖某些

BeanDefinition。

7. AbstractRefreshableApplicationContext

后简单了解⼀下基于XML 配置⽂件驱动的IOC容器。之所以是简单了解，是因为 Spring

置源承载的⾸选。

不对这些实现类展开讨论，感兴趣的读者可以⾃⾏翻阅源码学习。

考观点。

特性

⽣命周期管理

BeanFactory后置处理器的⽀持

事件发布机制（事件驱动）

BeanFactory

是

否

否

是

是

是

是

是

【第3章 Spring Boot 的IOC 容器

Boot 扩展出的IOC 容器全都是基于注解驱动的，Spring Boot已经不再将 XML 配置⽂件作⼒配

基于 XMI 配置⽂件的IOC 容器有⼀个特殊的特性：可重复刷新。得益于内部的设计，基于

XML 配置⽂件的IOC 容器会在加载配置⽂件时才初始化内部的BeanFactory，然后是解析配置

⽂件、注册bean 对象等动作。基于 XML 配置⽂件的IOC 容器般运用在传统的 Spring Framework +

Spring WebMve+ MyBatis 技术栈的项目中，它们通常都使用XML作为配置源驱动项目运⾏。

基于 XML 配置⽂件的IOC 容器的最终落地实现有我们熟悉的ClassPathXml

ApplicationContext 和 FilesystemXm1ApplicationContext，还有⽀持Web 环境的

xnlWebApP1icationContext，只是在 Spring Boot 中这些落地实现都不再使用，所以本书


## 3.1.3 选择 ApplicationContext ⽽不是 BeanFactory

丁解 BeanFactory 与Applicationcontext 的介绍与对⽐之后，有关实际项目开发中

应该选择使用 BeanFactory还是 ApPlicationContext 的问题，官方⽂档中提供了⼀个参

You should use an ApplicationContext unless you have a good reason for not doing so，

with GenericApplicationContext and its subclass AnnotationConfigApplication

Context as the common implementations for custom bootstrapping. These are the primary entry

points to Spring's core container for all common purposes: loading of configuration files, triggering a

classpath scan, programmatically registering bean definitions and annotated classes, and （as of 5.0）

registering functional bean definitions.

你应该使用 ApplicationContext，除⾮有充分的理由能解释不使用它的原因。⼀般

情况下，我们推荐将 GenericApplicationContext 及其子类 AnnotationConfig

ApplicationContext 作为⾃定义引导的常⻅实现。这些实现类是用于所有常⻅目的的

Spring Framework 核心容器的主要入口点：加载配置⽂件，触发类路径扫描，编程式注册 Bean

定义和带注解的类，以及（从5.0版本开始）注册功能性 Bean的定义。

这段话的下⾯还提供了⼀张表，对⽐了 BeanFactory 与 ApplicationContext 的不同

特性，如表3-1 所示。

表 3-1

Bean instantiation/wiring Bean 的实例化和属性注入

Integrated lifecycle management-

Automatic BeanPost Processor registration-

Bean 后置处理器的⽀持

Automatic BeanFactoryPostProcessor registration-

Convenient MessageSource access （for internalization）-

消息转换服务（国际化）

Built-in ApplicationEvent publication mechanism-

BeanFactory 与 ApplicationContext 的特性对⽐

否

否

否

APPlicationContext

是

扩展的。


## 3.2


## 3.2 Spring Boot 对IOC 容器的扩展|

由表3-1可⻅，APPlicationContext 相较于 BeanFactory 功能更强大，这也解释了

为什么日常开发中都是使用 ApplicationContext ⽽很少接触BeanFactory。


## 3.2 Spring Boot 对IOC 容器的扩展

Spring Boot 本⾝并没有直接利用 Spring Framework 现有的IOC容器，⽽是针对嵌入式Web

容器的这⼀核心特性扩展了更强大的IOC 容器。另外，在 Spring Boot 2.x 中，底层依赖了 Spring

Framework 5.x，这个大版本下⼀个典型的特性是新增了WebFlux 模块，其与WebMvc平级，用

于构建异步⾮阻塞式 Web 应用。Spring Boot 针对 WebMvc 与 WebFlux 这两种 Web 应用的搭建

基础分别扩展了不同的IOC容器。本节我们简单了解⼀下 Spring Boot 针对IOC容器是如何

提示：本节我们只简单了解，不再像上⾯那样展开讲解和讨论，因为IOC容器的根本设计还是 Spring

Framework 的模型，SpringBoot仅进⾏了扩展，读者⼀定要把握好重点。

WebServerApplicationContext

⾸先请读者了解⼀个概念：Webserver，这个概念来⾃ Spring Boot 2.x （在 Spring Boot 1.x

中称为 EmbeddedServletContainer，因为 Spring Boot 1.x 基于 Spring Framework4.x，当时

还没有 WebFlux）。WebServer 可以简单理解嵌入式Web 容器（即便类名中没有体现嵌人

式，依照 Spring Boot 1.x 的历史以及 javadoc 的描述也可以理解为有嵌入式的意思）。Spring

Boot 为了设计和⽀持嵌人式 Web 容器，在 Applicationcontext 的基础上又扩展了⼀个

WebServerAPPlicationcontext 子接口，如代码清单3-8所示。

•代码清单 3-8 WebServerApplicationContext 扩展的核心方法

PuoLLC Lacerrace wepserverAppLicationcontext extcenos App-icatloncontext，

// 获取嵌入式 web 容器

WebServer getWebServer （）；

WebServerApplicationContext 的接口源码中有⼀个重要方法：getWebServer。这个方

法可以获取当前应用的嵌入式 Web 容器实例，换⾔之，Spring Boot 中的ApplicationContext

可以获取正在运⾏的Web 容器。⾄于内部的WebServer 是如何创建的，我们放到第8章专⻔来

讲解 Spring Boot 嵌入式容器的⽣命周期。


## 3.2.2 AnnotationConfigServletWebServerApplicationContext

WebServerApplicationContext 的下⾯有⼏个扩展和落地实现，本书选择最常⻅的 Spring

Boot 整合 WebMvc 场景的 IOC容器最终落地实现 AnnotationConfigservletWebServer

Applicationcontext 来简单讲解。该类名虽然很⻓，但结构很完整也容易理解：注解驱动

的、基于 Servlet 环境的、⽀持嵌人式 web 容器的应用上下⽂。Spring Boot 默认使用注解驱动，

所以落地实现都是用 AnnotationConfig 前缀的 ApplicationContext 实现类作为IOC

容器⽀撑（具体的实现和引用见第4章）。既然是注解驱动，那么实现类中⼀定有类似于

原则和迪⽶特法则（又称为最少知识原则）。

容器也不难。



# 第3章 Spring Boot 的IOC 容器


## 第3章 Spring Boot 的IOC 容器

AnnotationconfigApplicationcontext 的特性：注解配置类的注册、模式注解的扫描

等。⽽这些特性的底层⽀撑还是依靠 Spring Framework 的现有组件辅助完成。

另外，AnnotationConfigServletWebServerApplicationContext 继承的⽗类

ServletWebServerApplicationContext 中组合了嵌人式容器 Webserver 对象以及

ServletConfig 配置对象，并且也有创建嵌人式容器的逻辑。代码清单 3-9展示了内部创建

嵌入式Web 容器的方法。

1代码清单3-9 ServletWebServerApplicationContext 中组合了嵌入式容器

public class ServletWebServerApplicationContext

extenas GenerlcwepApLiCationcontext

implements ConfigurableWebServerApplicationContext ｛

prLvate voLatlle Webserver webserver；

private ServletConfig servletConfig；

// 内部有定义创建嵌入式web 容器的方法

private void createWebServer（）｛••｝

由此可以体现出，Spring 团队对于每个类的职责划分层次相当清晰，充分体现了单⼀职责


## 3.2.3 Reactive WebApplicationContext

Spring Boot 2.x 基于 Spring Framework 5.x，⽽5.x 版本中引入了新的WebFlux 模块，所以

IOC 容器就不只有基于 Servlet 环境的最终实现，Spring Boot 同样 ReactiveWeb 扩展了

ApplicationContext 的⽀持：ReactiveWebServerApplicationContext。同样，它

也有⼀套类似的“接口-实现类”体系，包括中间的GenericReactiveWebApplicationContext

（类⽐ GenericWebApplicationContext）、最终的落地实现 AnnotationConfig

ReactivewebServerApplicationContext，与基于 Servlet 环境的命名方式如出⼀辙。

对于这⼏种基于 Reactive 环境的IOC容器，读者只需大概了解。对于IOC容器本身的设计，

两种环境下的差距不大，如果充分掌握了 Servlet 环境下的IOC容器实现，Reactive 下环境的IOC


## 3.3 选用注解驱动IOC容器的原因

下⾯我们讨论⼀个话题：Spring Boot 为什么选用注解驱动的IOC容器，⽽放弃了曾经主推

的 XML 配置？

要讨论这个话题，⾸先要明⽩注解驱动配置（即 JavaConfig）与XML配置⽂件的方式分别

有什么特点，以及各⾃的优劣势。然后再根据 Spring Boot的设计理念，体会两者的差异，揣度

Spring 团队当时选择注解驱动IOC容器的想法和动机。


## 3.3.1 配置方式的对⽐

要想搞明⽩ XMIL 配置⽂件与注解配置类的区别，最好先了解⼀下历史背景。Spring


## 3.4 Environment

类则相对晚⼀些。

配置⽂件更为灵活。

册不同类型的组件。因此，从配置内容的编写上讲，注解配置类更胜⼀筹。

与⾃定义配置间的配合协作（已经配置的不重复注册，没有配置的⾃动补充）。基于这种设计，

级特性，依据这些⾼级特性，在整合具体场景制作启动器时，完全可以实现与项目中⾃定义配

推荐使用注解驱动的配置方式。

下⾯我们拆解出其中的要素分别解释。

Framework 刚出现的时候，只能使用 XML 配置⽂件的方式驱动IOC 容器，直到Spring Framework 3.x

后才⽀持注解驱动配置，所以⾸要的⼀点是：XML 配置⽂件是早期采用的配置方式，注解配置

其次，XMIL 配置⽂件的方式本身修改起来灵活，⽆须重新编译，⽽且基于 XMIL 配置⽂件

驱动的IOC容器可以反复刷新加载配置⽂件；⽽注解配置类在修改上就没那么灵活了，每次修

改后都需要重新编译、打包运⾏，⽽且通过上⾯了解 Applicationcontext 的实现类我们知

道，注解驱动的 IOC 容器只能加载⼀次，⽆法反复刷新。因此，从修改灵活性的⾓度上讲，XMIL

最后要对⽐的是配置内容的编写，XMIL 配置⽂件的内容编写要符合相关的规范，对于规范

以外的内容 Spring Framework 是不认可的。即便要扩展 XML 配置⽂件声明的内容，也需要配

合 XML 解析逻辑⽀持才能运⾏。⽽注解配置类的方式就灵活多了，Spring Framework 3.1 提供

的模块装配、4.0提供的条件装配可以使配置的编写⾮常灵活，且可以根据不同场景的要求注


## 3.3.2 约定大于配置下的选择

简单对⽐ XML 配置⽂件与注解配置类之后，我们回到 Spring Boot 上。考虑⼀个问题：⼀

开始设计 Spring Boot 的时候，它的核心设计之⼀是约定大于配置，这种设计更加强调项目环境

我们再考虑 XMIL 配置⽂件与注解配置类是否可以满⾜约定大于配置的实现条件。

虽然基于 XML 配置⽂件的方式对于配置的编写更灵活、易修改，但整合具体场景制作为

启动器时，这种优势会荡然⽆存，毕竟在实际项目开发中，我们不会轻易改动现有 jar 包中的

⽂件（何况它还是配置⽂件），⽽且 XML ⽂件中定义了组件，会实实在在地注册到应用上下⽂

中，运⾏时的灵活性较差；⽽基于注解配置类的方式⽀持模块装配、条件装配、SPI 机制等⾼

置相互配合，即实现了约定大于配置。经过这样的分析后，我们就更能理解为什么 Spring Boot


## 3.4 Environment

接下来要讲解的内容是与 ApplicationContext 紧密相关的概念：Environment（环境）。


## 3.4.1 Environment 概述

⾸先整体了解⼀下Environment，它是从 Spring Framework 3.1 开始引入的⼀个抽象模型，

包含 Proflle 与 Property 配置的信息，可以实现统⼀的配置存储和注入、配置属性的解析等⾏为。

其中 Profile 实现了基于模式的环境配置（即条件装配），Property 则多用于外部化配置。

1. Profile

在第2 章的条件装配中，我们已经讲过 Profile 的使用，当时推荐读者理解 Profile 是“基

于环境的配置”，到了 Environment这⾥，想必读者更能理解“环境”这个概念了。Environment

PropertyResolver

Environment

StandardReactiveWebEnvironment

的信息。

I第3章 Spring Boot 的IOC 容器

本身就组合了 Profile的特性，用于区分不同的环境模式。根据不同的环境模式，Spring Framework

可以装配特定的bean 对象（以及配置属性的注入）。

2. Property

Property 作为键值对形式的数据结构，⾮常适合存储配置信息。在学习 Spring Framework

时我们就接触过，在 Property ⽂件中存储JDBC 连接参数，并通过@PropertySource 注解或

<context:property-Placeholder>标签引入这些 Property ⽂件到IOC容器中，以实现配

置项分离的目的。在这种设计中，利用@PropertySource 注解或<Property-

Placeholder>标签，将 Property ⽂件导人目标位置，其实就是Environment 中，⽽导人配

置后，最终解析配置项、给 Bean 组件注入属性值的⾏ 都由 Environment负责。


## 3.4.2 Environment 的结构与设计

简单了解 Environment 的概念和设计思想后，下⾯结合 API，了解⼀下 Environment

的上下级继承关系。借助 IDEA 可以形成 Environment 接口的上下级继承和派⽣关系，

如图3-6所示。

wConfigurablePropertyResolver

*ConfigurableEnvironment

conTiauhaoleweomvronmen

參 StandardServletEnvironment

图3-6 Environment 的类继承结构关系

从图3-6中可以得到两个简单的结论：Environment 不是顶层的根接口；Environment

的落地实现有3种，分别适应不同的场景。既然Environment 不是顶层接口，中间也有⼀些

派⽣和落地实现，我们选择其中⼏个重要的接口讲解。

1. PropertyResolver

从类名上看，PropertyResolver 是⼀个属性解析器，它可以处理 XML 配置⽂件、注解

配置类、普通 Bean 中用到的$1｝属性配置占位符。Environment 继承⾃ PropertySource，

并且 Environment 中存放了 Profile 和 Property 属性配置，这就意味着 PropertyResolver

可以解析$｛｝占位符，并提取出 Environment 中的 Property 配置完成赋值操作。

借助IDE，可以大致浏览 PropertyResolver 接⼜的部分核心方法，如代码清单3-10所

舌。PropertyResolver 接⼜完成的工作主要包含两部分：配置属性的获取；占位符的解析。

由此也就可以得出另⼀个结论：Environment 可以获取属性配置元信息，同时也可以解析占位符

组合封装。


## 3.4 Environment|

代码清单 3-10 PropertyResolver 接口的部分方法

public interface PropertyResolver ｛

1/ 检查所有配置属性中是否包含指定key

boolean containsProperty （String key）；

1/ 以string形式返回指定的配置属性的值

String getProperty （String key）；

1/ 带默认值的获取

String getProperty（String key, String defaultValue）；

// 指定返回类型的配置属性值获取

<T> T getProperty （String key, Class<T> targetType）；

1/ 解析占位符

string resolvePlaceholders （String text）；

2. ConfigurableEnvironment

经过对上⾯ BeanFactory 和 Applicationcontext 接口的分析和了解，看到

ConfigurableEnvironment 后，想必读者可以快速意识到它的特性：具备可配置的能⼒，

接⼜中大概率会有 set 之类的方法。借助IDE 看⼀下它的⼏个核心方法，如代码清单3-11

所舌。

代码清单3-11 ConfigurableEnvironment 接口的部分方法

public interface ConfigurableEnvironment extends Environment,ConfigurablePropertyResolver ｛

// 激活指定 profiles

void setActiveProfiles （String.. profiles）；

1/ 追加激活指定 profile

void addActiveProfile （String profile）：

// 设置默认情况下激活的 profiles

void setDefaultProfiles （String... profiles）；

// 获取 PropertySource 的组合体

MutablePropertySources getPropertySources （）；

前三个方法可以很容易地理解，它可以编程式设置 activeProfiles 和 defaultProfiles；最后⼀

个方法 getPropertySources ⽐较特别，它用来获取所有的 PropertySource 对象，但返

回值的类型是 MutablePropertySources，这个类型内部是⼀个 List 封装。

public class MutablePropertySources implements PropertySources ｛

private final List<PropertySource<？>> propertySourceList = new CopyOnWriteArrayList<>（）；

由此可以总结出⼀个小结论：以Mutable 开头的类名，通常可能是⼀个类型的 List

抽象⽽不看实现，是因为实现类中的代码量相当少，⽽且没有很重要的逻辑，大多数的实现都

读者注意还有⼀个很重要的成员：PropertySourcesPropertyResolver。它也是⼀个

者不同：委派仅仅是将方法的执⾏工作移交给另⼀个对象，⽽代理则可能会在此做额外的处理，

装饰者会在方法执⾏前后做增强。

⽽已。



# 第3章 Spring Boot 的IOC 容器


## 第3章 Spring Boot 的IOC 容器

提示：可以简单理解为⼀个 PropertySource 对象对应了⼀个配置源，这个配置源可能来⾃

Property ⽂件，可能来⾃系统环境变量、项目信息，也可能是⾃定义的加载方式（如数据库），但不

管来⾃哪⾥，最终都会封装为键值对的形式存储在⼀个 PropertySource 对象中，统⼀由

Environment 管理。

3. AbstractEnvironment

最后了解⼀下所有 Environment 落地实现的⽗类 AbstractEnvironment。之所以看

在 AbstractEnvironment 中体现。对于了解 AbstractEnvironment 的方式，读者不必

过于深人，了解其中的核心设计即可，如代码清单3-12 所示。

】代码清单3-12 AbstractEnvironment 的部分核心成员

Public abstract class AbstractEnvironment implements ConfigurableEnvironment｛

private final Set<String> activeProfiles = new LinkedHashSet<>（）；

Private final Set<String> defaultProfiles = new LinkedHashSet<>（getReservedDefault

Profiles （））；

Private final MutablePropertySources propertySources = new MutablePropertySources （）；

Private final ConfigurablePropertyResolver propertyResolver =

new PropertySourcesPropertyResolver （this.propertySources）；

代码清单 3-12列出的是 AbstractEnvironment 的部分成员属性，它会存储默认的

Profile，以及声明激活的所有 Profile，所有的PropertySource 也在这⾥存储。除此之外，请

PropertyResolver, AbstractEnvironment 在此处组合了⼀个 PropertyResolver 的

实现类，意图也很明显：只要是 PropertyResolver 接口下的方法要做的工作，全部交予

PropertySourcesPropertyResolver 完成，我们称这种设计为“委派”，它与代理、装饰


## 3.4.3 Environment 与 IOC 容器的关系

本节的最后，我们探讨⼀下 Environment 与IOC容器的关系。我个人倾向于如下的结构

和关系理解：

• Environment 中包含 Profile 和 Property，这些配置信息会影响IOC容器中的Bean的

注册与创建；

• Environment 是在 ApplicationContext 创建后才创建的，所以 Environment

应该伴随着 Applicationcontext 的存在⽽存在；

• ApplicationContext 中同时包含 Environment 和普通的 Bean 组件对象，从

BeanFactory 的视⻆来看，Environment 也是⼀个 Bean，只不过它的地位⽐较特殊


## 3

组件和Bean

的框中。

下⾯我们继续了解⼀个更为重要的类：BeanDefinition。这个类的设计相当重要，理解

相关概念。

元信息，又可以理解为元定义，简单地说，它就是定义的定义。其概念⽐较难理解，我们

可以举⼀个例子说明。

master｝

在这个简单的示例中，可以体现出对象和类的关系：对象的属性由类定义，类中包含对象

的元信息。


## 3.5

的方法定义整体上包含以下⼏个部分。

BeanDefinition|

基于这三点，Environment 与IOC容器以及内部的组件之间的结构关系如图3-7所示。

ApplicationContext

Environment

图 3-7 Environment 与 ApplicationContext 的结构关系

图3-7中Environment 覆盖的范围⽐较大，这是因考虑到 Environment 还要辅助处

理配置属性值的解析和注入工作，需要它配合 ApplicationContext 协同完成，所有的组件、

Bean 都可能需要 Environment 参与处理，所以这⾥将组件和 Bean 放人Environment 所在


## 3.5 BeanDefinition

BeanDefinition 对后续学习 Spring Boot 的扩展点、⽣命周期等部分有很大帮助。


## 3.5.1 理解元信息

提舌：本节提及的元信息仅针对 Spring Framework 和 Spring Boot，不会涉及数据分析、数据挖掘等

• 张三，男，18岁

- 它的元信息就是它的属性：Person ｛name,age,sex｝

• 味咪，美国短⽑，⿊⽩⽑，主人是张三

- 它的元信息就是它的属性：Cat｛name,type,color，

再往深层次想⼀步，类有元信息吗？当然有，Class 这个类中就包含⼀个类的所有定义（属

性、方法、继承实现、注解等），所以我们可以说：Class 中包含类的元信息。

既然对象、类都有⾃⼰的元信息，IOC容器中的bean 对象是否也有呢？当然也是有的，描

述 Bean 的元信息的模型就是 BeanDefinition。

BeanDefinition 概述

BeanDefinition 描述了 Spring Framework 中Bean 的元信息，包含Bean 的类信息、属

性、⾏为、依赖关系、配置信息等，并且可以在IOC容器的初始化阶段被拦截处理。

这句话很精炼，读者理解起来可能稍有困难，我们可以借助 IDE 大体浏览⼀下

BeanDefinition 读者的接口定义，从接口的方法定义上加以理解。BeanDefinition 接口

AttributeAccessorsupport

ScannedGenericBeanDefinition

些扩展实现，我们选择其中⽐较重要的⼏个接口和类简单了解⼀下。



# 第3章 Spring Boot 的IOC容器


## 第3章 Spring Boot 的IOC容器

• Bean 的类信息：全限定名（beanClassName）。

• Bean 的属性：作用域（scope）、是否默认 Bean （primary）、描述信息（description） 等。

• Bean 的⾏为特性：是否延迟加载（lazy）、是否⾃动注入（autowireCandidate）、初始

化/销毁方法 （initMethod / destroyMethod）等。

• Bean 与其他 Bean 的关系：⽗ Bean 名称（parentName）、依赖的 Bean（dependsOn） 等。

• Bean 的配置属性：构造方法参数（constructorArgumentValues）、属性变量值

（propertyValues）等。

由此可⻅，BeanDefinition ⼏乎能把 Bean 的所有信息收集并封装起来，⾮常全⾯。


## 3.5.3BeanDefinition 的结构与设计

大体理解 BeanDefinition 的基本概念后，下⾯我们来研究 BeanDefinition 接口的

上下级继承和派⽣关系，借助IDEA 可以形成如图3-8所舌的继承关系图。

w seammetaoatae ement

BeanDefinition

象》AbstractBeanDefinition

$wcener1cseangetin1t10n s Amnotateaseanbetinitaon w R00tBean et n tion

，AnotatedGenericBeanDefinition 粉*ConfigurationClassBeanDefinition *xClassDerivedBeanDefinition

图 3-8 BeanDefinition 的类继承结构关系

可以发现 BeanDefinition 并不是顶层接口，它的上层还有其他的⽗接口，下层也有⼀

1. AttributeAccessor

AttributeAccessor 类名直译属性访问器。了解Java 内省机制的读者可能会对此产

⽣⼀个猜测：这其中会不会定义了⼀些类似于bean 对象中 getset 方法的接⼜方法？确实如此，

只不过 AttributeAccessor 设计得更全⾯，它不仅有获取和写人的操作，还能移除Bean 的

属性。从整体上看，它的设计与 Map 有些相似（都有 get、set、remove、contains 等操

作），如代码清单3-13所舌。

代码清单 3-13 AttributeAccessor 接口的方法定义

Public interface AttributeAccessor ｛

// 设置bean 对象中属性的值

vo1a setAttrloute （string name，cNuLLale Oo ect TaLue

现中已经完成了相当⼀部分属性组成和逻辑实现。

所舌。


## 3.5 BeanDefinition I

// 获取bean 对象中指定属性的值

Object getAttribute （String name）；

// 移除bean 对象中的属性

Object removeAttribute （String name）；

1/ 判断bean 对象中是否存在指定的属性

boolean hasAttribute （String name） ；

1/ 获取 bean 对象的所有属性

Stringl］ attributeNames（）；

由 AttributeAccessor 接口，我们可以总结出 BeanDefinition 的第⼀个特性：

BeanDefinition 继承⾃ AttributeAccesSOr接口，具有配置 Bean 属性的功能。

提示：补充⼀点，在配置 Bean 的属性时，会涉及访问、修改、移除等操作。

2. BeanMetadataElement

BeanMetadataElement 作为 BeanDefinition 的另⼀个⽗接口，它的类名中包含

metadata 的概念，类名直译为存放Bean 的元信息的元素。这个接口只有⼀个方法，其作用是

获取 Bean 的资源来源，如代码清单3-14所示。

代码清单3-14 BeanMetadataElement

public interface BeanMetadataElement ｛

default Object getSource （） ｛

return null；

所谓的资源来源，就是Bean 的⽂件/url 路径。⼀般情况下项目中所编写的所有注册到IOC

容器中的 Bean，都是从本地磁盘上的.class ⽂件加载进来的，所以此处获取的其实是⼀个

Resource 对象（或者可以理解为⼀个Eile对象）。

3. AbstractBeanDefinition

AbstractBeanDefinition 作 BeanDefinition 的基本抽象实现，与前⾯的

BeanFactory、ApplicationContext、Environment 等核心组件相似，都是基本抽象实

借助 IDE 翻看 AbstractBeanDefinition 的成员，可以发现跟上⾯概述部分提到

的核心组件基本吻合（类信息、作用域、属性、构造方法、⽣命周期等），如代码清单3-15

1代码清单 3-15 AbstractBeanDefinition 的部分核心成员

// Bean 的全限定类名

private volatile Object beanClass；

// 默认的作用域为单实例

Private String scope = SCOPE_DEFAULT：

I第3章 Spring Boot 的IOC 容器

1/ 默认 Bean 都不是抽象的

private boolean abstractFlag = false；


## 11 是否延迟初始化

Private Boolean lazyInit：

1/ 同类型的⾸选Bean

private boolean primary = false；

// Bean 的构造方法参数和参数值列表

private ConstructorArgumentValues constructorArgumentValues；

// Bean 的属性和属性值集合

private MutablePropertyValues propertyValues；

1/ Bean 的初始化方法、销毁方法

private String initMethodName；

Private string destroyMethodName；

1/ Bean 的资源来源

private Resource resource：

可能有读者会对此产⽣困惑：既然 AbstractBeanDefinition 中的成员已经⻬全了，

为什么还要单独抽取为⼀个抽象类呢？AbstractBeanDefinition的 javadoc中给我们提供

了⼀个解释：

Base class for concrete, full-fledged BeanDefinition classes, factoring out common properties of

GenericBeanDefinition, RootBeanDefinition, and ChildBeanDefinition.

如⽂档注释所述，它是 BeanDefinition 接口的抽象实现类，它剔除了 GenericBean

Definition,RootBeanDefinition 和 ChildBeanDefinition 的共有属性。换⾔之，

不同的 BeanDefinition 落地实现，其内部的属性还是有差异的，这也就是

AbstractBeanDefinition 存在的意义。

4.⼏个落地实现类

下⾯我们看⼏个 BeanDefinition 的落地实现类。⾸先来看 GenericBeanDefinition，

它的前缀 Generic代表“通用的”“⼀般的”，所以我们可以理解为 GenericBeanDefinition

具有⼀般性。GenericBeanDefinition 的源码实现⾮常简单，仅⽐ AbstractBean

Definition 多了⼀个parentName 属性。恰恰是由于这个设计，我们可以得出以下⼏个结论：

• AbstractBeanDefinition 已经完全可以构成 BeanDefinition 的实现；

• GenericBeanDefinition 就是 AbstractBeanDefinition 的⾮抽象扩展；

• GenericBeanDefinition 具有层次性（parentName 已经告诉了我们⼀切）。

与 GenericBeanDefinition 类似的⼀个设计是 ChildBeanDefinition，从类名上

看 ChildBeanDefinition ⼀定是⼀个子定义信息，所以 ChildBeanDefinition 也有⼀

个 parentName 的内部成员。不过 ChildBeanDefinition 与 GenericBeanDefinition

之间有⼀个小区别，因为 ChildBeanDefinition 已经在类名上体现出“子定义”的概

念，所以它只有⼀个带 parentName 参数的构造方法（GenericBeanDefinition 有两个


## 3

Bean、工⼚类、工⼚方法等）。⽽且这其中把⼀些反射相关的元素直接组合进来，可⻅

BeanDefinition|

构造方法）。•

最后⼀个是 RootBeanDefinition，类名中有“根”的概念，这就意味着

RootBeanDefinition 只能作单独的 BeanDefinition 或者⽗ BeanDefinition 出现

（不能继承其他 BeanDefinition）。RootBeanDefinition 中的设计相对复杂，从源码的

篇幅上就能看出来（接近500⾏，⽽ GenericBeanDefinition 只有100多⾏），这⾥我们

关注⼀些重要的内部成员即可，如代码清单3-16所示。

代码清单 3-16 RootBeanDefinition 的部分核心成员

// BeanDefinition 的引用持有，存放了 Bean 的别名

Private BeanDefinitionHolder decoratedDefinition：

// Bean 上⾯的注解信息

Private AnnotatedElement qualifiedElement：

// Bean 中的泛型

volatile Resolvablerype targetType；

// BeanDefinition 对应的真实 Bean

volatile Class<?> resolvedTargetType；

// 是否是 FactoryBean

volatile Boolean isFactoryBean；

// 工⼚Bean 方法返回的类型

volatile Resolvablerype factoryMethodReturnType；

// 工⼚ Bean 对应的方法引用

volatile Method factoryMethodToIntrospect；

从代码清单 3-16中可以发现，RootBeanDefinition 在 AbstractBeanDefinition

的基础上⼜扩展了⼀些 Bean 的其他信息：id 和别名、注解信息、工⼚相关信息（是否为工⼚

BeanDefinition 在底层做的事情更多。⾄于 RootBeanDefinition 都发挥了哪些更强大

的作用，在本书第2部分会有更深入的讲解。


## 3.5.4 体会 BeanDefinition

下⾯我们结合⼀些简单的 Demo，帮助读者体会BeanDefinition 的设计，以及其中封

装 Bean的相关内容。

1. 基于组件扫描的 BeanDefinition

使用模式注解＋组件扫描的方式，每扫描到⼀个类，就相当于构建了⼀个

BeanDefinition。为了方便演示扫描的效果，我们来构建⼀个简单的 Person类，并标注

@Component 注解，如代码清单3-17所示。

代码清单3-17 定义简单类 Person 并标注模式注解

@Component

public class Person ｛

@Configuration

|第3章 Spring Boot 的IOC 容器

Private String name；

Public String getName（）｛

return name；

Public void setName （String name）｛

this.name = name；

｝

使用 AnnotationConfigApplicationContext 可以在不编写注解配置类的情况下，

直接扫描所有标注了@Component 及派⽣注解的组件，扫描完成后直接从 APPlication

Context 中提取出 person 的BeanDefinition，并打印出来查看其信息以及 BeanDefinition

的类型，如代码清单3-18所示。

代码清单3-18 测试获取 Person 的 BeanDefinition 信息

Public class ComponentScanBeanDefinitionApplication 1

public static void main（Stringl］ args） ｛

AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext （

"com.linkedbear.springboot .beandefinition.bean"）；

BeanDefinition personBeanDefinition = ctx.getBeanDefinition（"person"）；

System.out.println （personBeanDefinition）；

System.out .println （personBeanDefinition.getClass （） .getName （））；

运⾏测试程序的main 方法，控制台打印出来的是⼀个 GenericBeanDefinition 的

派⽣类（用来标注它是⼀个被扫描到的Bean），并且 person 对象的基本信息都已经收集并封

装完成。

Generic bean: class ［com.linkedbear.springboot.beandefinition.bean.Person］； scope= singleton; abstract=

false; lazyInit=nul1; autowireMode=0:dependencyCheck=0; autowire Candidate=true; primary=

false; factoryBeanName=nu11; factoryMethodName=nu11; initMethodName= nul1; destroyMethodName=

null; defined in file ［E：\IDEA\spring-boot-source-analysis-epubit \springboot-03-ioccontainer\

target \classes \com\linkedbear\springboot \beandefinition \bean\Person.class］

org.springframework.context.annotation.ScannedGenericBeanDefinition

？ 提示：留意⼀个细节，基于@Component 注解解析出的 Bean，定义来源在类的.class ⽂件中。

2. 基于@Bean 的 BeanDefinition

要演舌@Bean 注解的BeanDefinition 构造，就必须要编写注解配置类，我们可以声明

⼀个最简单的配置类，并注册⼀个 Person 对象，如代码清单3-19所舌。

1代码清单3-19 编写注册了 Person 的注解配置类

public class BeanDefinitionConfiguration ｛

@Bean

public Person person（）｛

com.linkedbear.springboot.beandefinition.config.BeanDefinitionConfiguration

具体区别如下。

创建。

底层逻辑，具体的内容会在第⼆部分⽣命周期中展开探讨。

ClassPathBeanDefinitionScanner，扫描器会扫描指定包路径下包含特定模式注

解析。配置类的解析要追踪到


## 3.5 BeanDefinition /

return new Person（）；

随后，用这个注解配置类驱动IOC 容器，从中获取 person 的BeanDefinition 信息并

打印，如代码清单3-20所示。

1代码清单3-20 测试获取 Person 的 BeanDefinition 信息

public class AnnotationConfigBeanDefinitionConfiguration ｛

public static void main （Stringl］ args）｛

AnnotationconfigApplicationcontext ctx = new AnnotationConfigApplicationcontext （

BeanDefinitionconfiguration.class）；

BeanDefinition personBeanDefinition = ctx.getBeanDefinition（"person"）；

system.out.printIn（personBean Definition）；

system. out.pr intIn（personBeanDefinition.getClass（）.getName （））；

编写完成后运⾏测试程序的 main 方法，可以发现控制台打印的内容与前⾯基于组件扫描

的BeanDefinition 有很大区别：

Root bean: class ［nu11］； scope=； abstract=false; lazyInit=nu11;autowireMode=3;dependencyCheck=0；

autowireCandidate=true; primary=false; factoryBeanName=beanDefinitionConfiguration；

factoryMethodName=person；initMethoaName=nu11; destroyMethodName=（inferred）； defined in

org.Springtramework.context.annotation.Contigurationc_assbeanbetin1tlonkeadericont1guration

ClassBeanDefinition

• BeanDefinition 的类型是 Root Bean （ConfigurationClassBeanDefinition

继承⾃ RootBeanDefinition）。

• bean 对象的 className 不⻅了。

• ⾃动注入模式 AUTOWIRE_CONSTRUCTOR（构造方法⾃动注入）。

• 有 factoryBean 属性：person 由 BeanDefinitionConfiguration 的person 方法

为什么两种不同的Bean 定义方式在实际运⾏时会有如此大的差别呢？这⾥先简单提⼀下

• 通过模式注解＋组件扫描的方式构造的 BeanDefinition，它的扫描工具是

解的类，扫描器的核心工作方法是doscan，它会调用⽗类 ClassPathScanning

CandidateComponent Provider 的 findCandidateComponents 方法，创建

ScannedGenericBeanDefinition 并返回；

• 通过配置类 +@Bean 注解的方式构造的BeanDefinition 最复杂，它涉及配置类的

ConfigurationClassPostProcessor 的

processConfigBeanDefinitions 方法，该方法会处理配置类，并交给 Config

的注册器，

⽀撑其他组件运⾏。

⼀管理容器。

1第3章 Spring Boot 的IOC 容器

urationClassParser 来解析配置类，提取出所有标注了@Bean 的方法。随后这些

方法又被 ConfigurationClassBeanDefinitionReader 解析，最终在底层创建

ConfigurationClassBeanDefinition 并返回。

提示：目前读者只需对这些内容有⼀个最简单的了解和认知，不需要关心其内部的具体实现，切勿

本末倒置。


## 3.5.5 BeanDefinitionRegistry

BeanDefinition 解析完成后，最终转化bean 对象，这之间有⼀个 BeanDefinition存

储（注册）、随后解析 BeanDefinition ⽣成bean 对象的过程，⽽统⼀管理 BeanDefinition

的核心就是本节要讲解的 BeanDefinitionRegistry。 BeanDefinitionRegistry 是维护

BeanDefinition 的注册中心，它内部存放了IOC 容器中 Bean 的定义信息，同时

BeanDefinitionRegistry也是⽀撑其他组件和动态注册 Bean 的重要组件。

⾸先，Registry 有注册表的意思，联想⼀下 Windows 中的注册表，它存放了 Windows 系统

中应用程序和配置的信息。从底层源码的设计来看，BeanDefinitionRegistry 本质上是⼀

个存放 BeanDefinition 的容器。

1/ 源⾃ DefaultListableBeanFactory

Private final Map<String, BeanDefinition> beanDefinitionMap = new ConcurrentHashMap<> （256）；

其次，Registry 还有注册器的意思。既然Map 有增删改查，那么作为BeanDefinition

BeanDefinitionRegistry ⾃然也有 BeanDefinition 的注册功能。

BeanDefinitionRegistry 中有3个方法，刚好对应了 BeanDefinition 的增、

删、查：

void registerBeanDefinition （String beanName,BeanDefinition beanDefinition）

throws BeanDefinitionStoreException；

void removeBeanDefinition （String beanName）throws NoSuchBeanDefinitionException；

BeanDefinition getBeanDefinition（String beanName） throws NoSuchBeanDefinitionException；

另外，请读者回顾⼀下 ImportBeanDefinitionRegistrar 的核心 registerBean

Definitions 方法，它的人参就有⼀个 BeanDefinitionRegistry，我们取得

BeanDefinitionRegistry 后，就可以在方法体内⾃⾏构造 BeanDefinition 后注册到

BeanDefinitionRegistry。由此⼜说明了⼀点：BeanDefinitionRegistry 在底层会

void registerBeanDefinitions （Annotationetadata metadata,BeanDefinitionRegistry registry）；

最后我们要留意⼀点，BeanDefinitionRegistry 的主要实现是 DefaultListable

BeanFactorY，它也是 BeanFactory 的最核心落地实现，所以我们要意识到⼀点：Default

ListableBeanFactory 不仅是bean 对象的统⼀管理容器，⽽且是 BeanDefinition 的统

打交道。


## 3.5

过程任意扩展。

后置处理器

要学习后置处理器，⾸先要对这个概念有⼀个基础的认识。

以切入的部分，尽管具体的后置处理器名称对于读者可能还很陌⽣，但仅从切入点上看，我们

置处理器。


## 3.6后置处理器I

Q提示：对于 BeanDefinitionRegistry，读者目前⽆须掌握太多有关它的具体使用，只

需了解它是什么就够了，随着后⾯深入到 Spring Boot 的⽣命周期部分，我们还会频繁地与它

设计 BeanDefinition 的意义

最后我们讨论⼀个小问题：Spring Framework 为什么会设计 BeanDefinition？ 为什么

没有选择直接注册 Bean 的方式？

的确，如果直接创建出bean 对象，放人IOC容器，这样的设计简单，但同时对应了另⼀个

问题：Bean 的管理机制过于简单，⽆法应对各种复杂的场景，⽽且⽆法针对某些特殊的 Bean

进⾏附加的处理（如 AOP 代理、事务增强⽀持等）。设计 BeanDefinition，其本质上⽐较

接近⾯向对象开发中先编写 Class 类，再new 出对象。Spring Framework ⾯对⼀个应用程序，

也需要对其中的 Bean 进⾏定义抽取，只有抽取成可以统⼀类型/格式的模型，才能在后续的

bean 对象管理时进⾏统⼀管理，或者是对特定的 Bean 进⾏特殊化处理。⽽这⼀切最终落地到

统⼀类型上就是 BeanDefinition 这个抽象化的模型。换⼀种更简单的说法，有了定义信息，

按照既定的规则，就可以任意解析⽣成 bean 对象，也可以根据实际需求对解析和⽣成对象的


## 3.6）

介绍完 BeanDefinition 后，接下来是本章最后⼀个⾮常重要的知识点：后置处理器。


## 3.6.1 理解后置处理器

Spring Framework 中设计的后置处理器主要分为两种类型：针对bean 对象的后置处理器

BeanPostProcessOr ；针对 BeanDefinition 的后置处理器 BeanFactory

PostProceSSOr。这两种都是主要针对IOC容器中的Bean，在其⽣命周期中进⾏⼀些切人处

理和⼲预。BeanPostProcessor 切入的时机是在bean 对象的初始化阶段前后添加⾃定义处

理逻辑。⽽ BeanFactoryPostProcessor 切入的时机是在IOC 容器的⽣命周期中，所有

BeanDefinition 都注册到 BeanDefinitionRegistry 后切入回调，它的主要工作是访问

/修改已经存在的 BeanDefinition。

另外，BeanPostProcessor 与BeanFactoryPostProcessor 都有⼀些扩展的子接口，

它们切人的时机也不尽相同，图3-9从整体上描述了IOC容器与bean 对象的初始化过程中后置

处理器的切人扩展时机。

从图3-9中可以看出，后置处理器在整个 IOC 容器以及 bean 对象的⽣命周期中有⾮常多可

可以直观地感受到⼀点：IOC 容器的可扩展性⾮常强，⽽扩展的⼿段中很大⼀部分就是借助后

应用启动

解析注解配置类

加载BeanDefinition

初始化bean对象

实例化对象

InstantiationAwareBeanPostProcessor

初始化逻辑回调 BeanPostProcessor

I第3章 Spring Boot 的IOC 容器

IOC容器初始化（刷新）

eanDefimtionRcestyPosfrocestleanFactoryPostProcess（

InstantiationAwareBeanPostProcessor

MergedBeanDefinitionPostProcessor

属性赋值&依赖注入

InstantiationAwareBeanPostProcessor

SmartInitializingSingleton

IOC容器初始化完毕

图3-9 后置处理器在IOC 容器与bean 对象⽣命周期的切入时机


## 3.6.2 BeanPostProcessor

BeanPostProcessor 是针对bean 对象的后置处理器，它本⾝的设计是⼀个包含两个方

法的接⼜，如代码清单 3-21所舌。

1代码清单3-21 BeanPostProcessor

Public interface BeanPostProcessor ｛

default Object postProcessBeforeInitialization （Object bean, String beanName）

throws BeansException｛

return bean；

default Object postProcessAfterInitialization （Object bean,String beanName）

throws BeansException ｛

return bean；

提示：Spring Framework 5.x 版本之前由于最低⽀持Java 6，此处并没有默认的方法实现。

这两个方法的⽂档注释写得⾮常完善。Post ProcessBeforeInitialization 方法会

实例化bean对象

BeanPostProcessor

postProcessBeforeInitialization

初始化逻辑回调

BeanPostProcessor

bean对象创建完成

创建出的真实对象进⾏后置处理。

下⾯我们逐⼀介绍其中重要的派⽣接口。

所示。


## 3.6 后置处理器|

在任何 bean 对象的初始化回调逻辑（例如 InitializingBean afterPropertiesSet

或⾃定义 init-method）之前执⾏，⽽ postProcessAfterInitialization 方法会在任

何 bean 对象的初始化回调逻辑之后执⾏。整个 bean 对象的⽣命周期中 BeanPostProcessor

的切入时机如图3-10所示。

属性赋值&依赖注入

（1） @PostConstruct

（2） InitializingBean

（3） init-method

postProcessAfterlnitialization

图 3-10 BeanPostProcessor 的切入时机

此外，对于 postProcessAfterInitialization 方法，还可以对那些 FactoryBean


## 3.6.3BeanPostProcessor 的扩展

借助 IDEA，可以发现 BeanRostProcessor 只是⼀个根接⼜，它的下⾯还有⼏个派⽣

的子接⼜，具体的派⽣关系如图 3-11 所舌。

導：BeanPostProcessor

：InstantiationAwareBeanPostProcessor $*DestructionAwareBeanPostProcessor $×MergedBeanDefinitionPostProcessor

拿*SmartInstantiationAwareBeanPostProcessor

图3-11 BeanPostProcessor 的扩展接口

1. InstantiationAwareBeanPostProcessor

InstantiationAwareBeanPostProcesSOr 的类名中带有⼀个 instantiation，这意味着

InstantiationAwareBeanPostProcessOr 会⼲预对象的实例化阶段。参照 javadoc 的描

述，我们可以大体了解到，InstantiationAwareBeanPostProcessOr 会拦截并替換 bean

对象的默认实例化动作，也会拦截 bean 对象的属性注入和⾃动装配，并在此控制流程。从接口

的方法设计上看，它在BeanPostProcessor 的基础上扩展了3个新的方法，如代码清单 3-22

初始化所有bean对象

实例化bean对象

postProcessAfterInstantiation

postProcessProperties

BeanPostProcessor

初始化逻辑回调

BeanPostProcessor

postProcessAfterInitialization

bean对象创建完成

分⽣命周期中展开讲解。

用时执⾏。

I第3章 Spring Boot 的IOC 容器

1代码清单 3-22 InstantiationAwareBeanPostProcessor

default object postrocessBeforeInstantiation （Class<?> beanClass, String beanName）

throws BeansException｛

return null；

default boolean postProcessAfterInstantiation （Object bean, String beanName）

throws BeansException ｛

return true；

default PropertyValues postProcessProperties （PropertyValues pvs, Object bean,String beanName）

throws BeansException ｛

return null；

通过代码清单 3-22 可以发现，三个方法分别⼲预 Bean 的实例化动作前后以及切入属性赋

值的动作。加入 InstantiationAwareBeanPostProcessor 后 Bean 的初始化阶段就变为

图3-12 所示的流程。

属性赋值&依赖注入

InstantiationAwareBeanPostProcessor

postrTocessberorelnitalzaton

（1） @PostConstruct

（2） InitializingBean

（3） init-method

图 3-12 InstantiationAwareBeanPostProcessor 的切入时机

对于这些切人的方法具体会做什么，3.7节会先简单提⼀下，详细的内容会统⼀放在第⼆部

2. DestructionAwareBeanPostProcessor

与初始化相反，DestructionAwareBeanPostProcessor 切人的时机是bean 对象的销

毁阶段。当IOC容器关闭时，会先销毁容器中的所有单实例Bean，⽽销毁的过程中，除了回调

bean 对象本身定义的@PreDestroy 注解标注的方法、destory-method 等方法，还会回调

所有DestructionAwareBeanPostProcessOr 类型的后置处理器来⼲预。简⾔之，

DestructionAwareBeanPostProcessor 会在 ApplicationContext 的 close 方法调

容器销毁之前，就需要将这些引用断开，这样才可以进⾏对象的销毁和回收。


## 3.6 后置处理器I

Spring Framework 中有⼀个 DestructionAwareBeanPostProcessor 的内置实现：监

听器的引用释放回调。由于 ApplicationContext 中会注册⼀些 ApplicationListener，

⽽这些 ApplicationListener 与 ApplicationContext 互相依赖（引用），因此在 IOC

？ 提示：这个实现相对来讲不是很重要，读者了解⼀下即可，不必耗费太多精⼒。

3. MergedBeanDefinitionPostProcessor

MergedBeanDefinitionPostProcessor 的类名中带有“合并”的概念，这⾥要解释

⼀下 BeanDefinition 的合并。如果我们向IOC容器中注册的 Bean 是⼀个有⽗类的派⽣

类（子类），那么 Spring Framework 在收集 Bean 中的信息时，不仅要收集当前类，还应该

收集它的⽗类，⽽负责⽗类收集的工作，就交给 MergedBeanDefinitionPostProcesSor

来完成。

MergedBeanDefinitionPostProcessOr 接口中只额外扩展了⼀个方法，用于在bean

对象的⽣命周期阶段中属性赋值和⾃动注入之前提前收集好 bean 对象需要注入的属性。只有提

前收集好要注人的属性，IOC容器底层才会把需要注入的属性都处理好。

void postProcessMergedBeanDefinition （RootBeanDefinition beanDefinition，Class<?> beanType，

String beanName）；

提示：注意 postProcessMergedBeanDefinition 方法只传入了 BeanDefinition，没

有传入实例化后的空 bean 对象，这体现了迪⽶特法则（最少知识原则），即处理BeanDefinition

的时候不应该知道bean对象的存在。

Spring Framework 中有⼀个⾮常重要的MergedBeanDefinitionPostProcessor 的实

现，它就是 AutowiredAnnotationBeanPostProcesSOr，它负责给bean 对象实现基于注

解的⾃动注入（@Autowired、@Resource、@Inject 等），⽽注人的依据是 postProcess

MergedBeanDefinition 方法执⾏后整理的⼀组标记，后续的注入工作会根据这组打好的标

记为 bean 对象依次注入属性值Jbean 对象。


## 3.6.4 BeanFactoryPostProcessor

下⾯我们再来了解 BeanFactoryPostProcesSOr，它是针对 BeanDefinition 的后置

处理器，当然也可以理解针对 BeanFactory 的后置处理器，只不过在 BeanFactoryPost

Processor 的回调阶段前后，都是在围绕着 BeanDefinition 做⽂章。

官方⽂档中有对 BeanFactoryPostProcesSOr 的描述，其中解释了 BeanFactory

PostProcessor 操作的是 Bean 的配置元信息（即 BeanDefinition）。⽽且这⾥还有⼀个

关键的点：BeanFactoryPostProcessor 可以在bean 对象的初始化之前修改Bean 的定义

信息。换句话说，它可以对原有的 BeanDefinition 进⾏修改。由于 Spring Framework 中设

计的所有 bean 对象在没有实例化之前都是以 BeanDefinition 的形式存在的，如果提前修

改了 BeanDefinition，那么在Bean的实例化时，最终创建出的bean 对象就会受到影响。

BeanFactoryPostProcessor 中只定义了⼀个方法，就是对 BeanFactory 的后置处

应用启动

加载BeanDefinition

BeanFactoryPostProcessor

IOC容器初始化完毕

I第3章 Spring Boot 的IOC 容器

理，它会在标准初始化之后修改 ApPlicationContext 内部的 BeanFactory。在

BeanFactoryPostProcessor 触发时，所有BeanDefinition 都已经被加载，但此时还没

有实例化任何 bean 对象，在这个阶段中 BeanFactoryPostProcessor 可以给 Bean 覆盖或

添加属性，甚⾄可以用于初始化 bean 对象（当然这种做法是不推荐的）。

void postProcessBeanFactory （ConfigurableListableBeanFactory beanFactory） throws BeansException；

提示：注意这⾥的设计，即便 ConfigurableListableBeanFactory 的最终实现类只有

DefaultListableBeanFactorY，这⾥的入参也是接口，可⻅依赖倒转的设计在 Spring

Framework 中体现得淋漓尽致。

如果用 Applicationcontext 的⽣命周期来体现 BeanFactoryPostProcessor 的切

人时机，它出现在“解析注解配置类”与“初始化 bean 对象”之间，如图3-13所示。

IOC容器初始化（刷新）

解析注解配置类

〇00

$00

初始化bean对象

图 3-13 BeanFactoryPostProcessor 的切入时机

图 3-13中的实线圆代表已经注册到 BeanFactory 中的 BeanDefinition，经过

BeanFactoryPostProcessor 的⼲预后，可能部分 BeanDefinition 会被改变（即变为虚

线圆），但 BeanDefinition 的数量不会变化。


## 3.6.5 BeanDefinitionRegistryPostProcessor

如果需要在 BeanFactory 的后置处理阶段动态注册新的 BeanDefinition，除了用第2章

我们讲到的 ImportBeanDefinitionRegistrar，另⼀种方案就是使用 BeanDefinition

RegistryPostProcesSOr。从类名上可以看出，它是针对 BeanDefinitionRegistry 的

后置处理器，它的执⾏时机⽐ BeanFactoryPostProcesSOr 早，这就意味着

BeanDefinitionRegistryPostProcessor 允许在 BeanFactoryPostProcessor 之前

注册新的 BeanDefinition。从设计上讲，BeanFactoryPostProcessor 只用来修改、

扩展 BeanDefinition 中的信息，⽽BeanDefinitionRegistryPostProcessor 则可

以在 BeanFactoryPostProcessor 处理 BeanDefinition 之前向 BeanFactory注册新的

应用启动

解析注解配置类

BeanFactoryPostProcessor

初始化bean对象

IOC容器初始化完毕

BeanPostProcessor BeanFactoryPostProcessor

目标

BeanDefinition

执⾏

对象）

配置⽂件、配置类已解析完毕并注册进


## 3.6 后置处理器|

BeanDefinition，甚⾄注册新的BeanFactoryPostProcessOr 用于下⼀个阶段的回调。

BeanDefinitionRegistryPostProcessor 在1OC 容器⽣命周期中应当出现在“解析

注解配置类”之后、BeanFactoryPostProcessor 的集中回调之前，如图3-14所示。图3-14

中 BeanDefinitionRegistryPostProcesSOr 执⾏之前，IOC 容器中只有两个

BeanDefinition，但经过 BeanDefinitionRegistryPostProcessOr 的处理之后，

BeanDefinition 的数量变为三个，这就充分体现了 BeanDefinitionRegistry

PostProcessor 有增删BeanDefinition 的能⼒。

IOC容器初始化（刷新）

加载BeanDefinition

BeanDefinitionRegistryPostProcessor

图3-14 BeanDefinitionRegistryPostProcessor 的切入时机

提示：补充⼀点，由于实现了 BeanDefinitionRegistryPostProcessor 的类同时也实现了

BeanFactoryPostProcesSor 的 postProcessBeanFactorY 方法，因此在执⾏完所有

BeanDefinitionRegistryPostProcesSOr 的接口方法后，会⽴即执⾏这些类的

postProcessBeanFactory 方法，之后再执⾏那些普通的只实现了 BeanFactory

PostProceSSOr 的 postProcesSBeanFactory方法。


## 3.6.6 后置处理器对⽐

最后我们简单对⽐⼀下上述提到的三种核心后置处理器，总结内容如表3-2所示。

表3-2 Spring Framework 中三种后置处理器的对⽐

BeanDefinitionRegistryPostProcessor

处理 bean 对象 BeanDefinition、•class ⽂件等

时机

bean 对象的初始化阶

段前后（已创建 bean

BeanDefinition 解析完毕并注册

进 BeanFactory 之后（此时bean对

象未实例化）

BeanFactory，但还没有被 Bean

FactoryPostProcesSor 处理

可操

BeanPostProcessor

值、创建代理对象等

续表

BeanDefinitionRegistryPostProcessor

Definition

I第3章 Spring Boot 的IOC 容器

作的

空间

给bean 对象的属性赋

BeanFactoryPostProcessor

在 BeanDefinition 中增删属性、移

除 BeanDefinition等

向 BeanFactory 中注册新的 Bean


## 3.7 IOC 容器的启动流程

在本节，我们⼀起探讨⼀下 IOC容器的启动流程。由于 IOC容器会在创建时顺便初始化好，

这个初始化的动作⾮常复杂，在了解IOC容器的同时，如果读者先对内部的初始化机制有⼀个

整体的认识，到后⾯学习IOC容器的⽣命周期时就不会⼿⾜⽆措。

ApplicationContext 的启动，其核心是内部的⼀个刷新容器的动作，也就是3.1.2 节中

提到的 AbstractApplicationContext 中的 refresh 方法，如代码清单3-23所示。

代码清单 3-23 AbstractApplicationContext 的核心 refresh 方法

Public void refresh（） throws BeansException,I1legalStateException｛

synchronized（this.startupShutdownMonitor） ｛

// Prepare this context for refreshing.


## 11 1. 初始化前的预处理

prepareRefresh（）；

/ Tell the subclass to refresh the internal bean factory.

/1 2. 获取 BeanFactory，加载所有bean 的定义信息（未实例化）

ConfigurableListableBeanFactory beanFactory = obtainFreshBeanFactory （）；


## 11 Prepare the bean factory for use in this context

1/ 3. BeanFactory 的预处理配置

prepareBeanFactory（beanFactory）：

try｛

1/ Allows post-processing of the bean factory in context subclasses.

1/ 4.准备 BeanFactory 完成后进⾏的后置处理

postProcessBeanFactory （beanFactory）；

1/ Invoke factory processors registered as beans in the context.

1/ 5. 执⾏BeanFactory 创建后的后置处理器

invokeBeanFactoryPostProcessors （beanFactory）；


## 1 Register bean processors that intercept bean creation

// 6. 注册 Bean 的后置处理器

registerBeanPostProcessors （beanFactory）；

1/ Initialize message source for this context.

1/ 7.初始化 MessageSource

initMessageSource （）；

// Initialize event multicaster for this context.

// 8. 初始化事件⼴播器

initApplicationEventMulticaster （）；


## 11 Initialize other special beans in specific context subclasses

'/ 9. 子类的多态 onRefresh

细节，我们统⼀放到本书第2部分详细展开。

置、属性校验、早期事件容器准备等动作。


## 3.7 IOC容器的启动流程|

onRefresh（）；


## 11 Check for 1istener beans and register them

10.注册监听器

registerlisteners （）；

1/⾄此，BeanFactory创建完成

1/ Instantiate all remaining （non-lazy-init）singletons.

1/ 11. 初始化所有剩下的单实例

BeanfinishBeanFactoryInitialization （beanFactory）；

// Last step: publish corresponding event.

1/ 12.完成容器的创建工作

finishRefresh （）；

H/ catch ...

finally/

1/ Reset common introspection caches in Spring's core,since we

1/ might not ever need metadata for singleton beans anymore...


## 11 13.清除缓存

resetCommonCaches（）；

整个 refresh 方法分为13步，本章我们只关心每⼀步都做了哪些事情，对于其中涉及的

1.prepareRefresh—初始化前的预处理

• 这⼀步大多数的动作都是前置性准备，包含切换IOC容器启动状态、初始化属性配

2. obtainFreshBeanFactory—初始化 BeanFactory

• 该步骤在不同的 ApplicationContext 落地实现中⾏为不同：基于注解配置类的

ApplicationContext，在基础实现类 GenericApplicationContext 的

refreshBeanFactory 方法中有⼀个CAS 判断的动作，它控制 Generic

ApplicationContext 不能反复刷新；⽽基于 XML 配置⽂件的 Application

Context 中，在该步骤会解析 XML 配置⽂件，封装 BeanDefinition 注册到

BeanDefinitionRegistry中。

由此可以得出⼀个结论：基于 XML 配置⽂件的 ApplicationContext 可以反复

刷新，基于注解配置类的 ApplicationContext 只能刷新⼀次。

3.prepareBeanFactory—BeanFactory 的预处理动作

• 这个方法内部处理的内容看似⽐较多，但总体⾮常有条理，主要包含三件事情：

- 设置⼀些默认组件（类加载器、表达式解析器等），并注册 Environment 抽象

（Environment 也是IOC 容器中的⼀个 Bean）；

- 编程式注册 ApplicationContextAwareProcessor，它负责⽀持6个

Aware 回调注人接口（包含 EnvironmentAware、ApplicationContext

Aware 在内的6个 Aware 系列接口）；

- 绑定 BeanFactory 与 ApplicationContext 的依赖注入映射，当其他 Bean

身注人。

与

实现是注解配置类的解析与组件导人。

中会详细展开。

增强逻辑。

DelegatingMessageSource 在不作任何附加配置的情况下不会处理任何国际化

I第3章 Spring Boot 的IOC 容器

需要注入 BeanFactory 时，IOC 容器会⾃动将当前正在处理的 BeanFactory

注入，当其他 Bean 需要注入 ApplicationContext 时，IOC 容器会⾃动将⾃

• 总的来看，这三件事情都是在BeanFactory的初始化做⼀些准备，即预处理工作。

4. postProcessBeanFactory—BeanFactory 的后置处理

• 这个方法本身是⼀个模板方法，在 AbstractApplicationcontext 中没有具体

实现，在基于 Web 环境的 Applicationcontext 实现 GenericNeb

Applicationcontext 中有扩展⾏为：

- 编程式注册 ServletContextAwareProcessor，用于⽀持 ServletContext

的回调注人；

- 注册新的 Bean 的作用域（request、session、application），并关联绑定

ServletRequest、ServletResponse 等多个类型的依赖注人映射；

- 注册 ServletContext、ServletConfig 对象到IOC 容器中。

在 Spring Boot 的⽀持嵌人式容器的 ServletWebServer ApplicationContext

实现基类中它覆盖了原有的实现，主要变化的是没有注册 application 作用域（因为

此时嵌人式 Web 容器还没有初始化，没有 ServletContext 可获取）。

5. invokeBeanFactoryPostProcesSOrs 执⾏ BeanFactoryPostProcessor

• 该步骤会回调执⾏所有的 BeanDefinitionRegistryPostProcessor

BeanFactorYPostProcesSOro

- BeanDefinitionRegistryPostProcessor 的主要工作是，对BeanDefinition

Registry 中存放的 BeanDefinition进⾏处理（可以注册新的

BeanDefinition，也可以移除现有的BeanDefinition），其中⼀个典型的

- BeanFactoryPostProcessor 的主要工作是对 BeanDefinitionRegistry

中现有的 BeanDefinition 进⾏修改操作（注意只限于修改，原则上不允许再

注册新的/移除现有的BeanDefinition），它的执⾏时机较 BeanDefinition

Registry PostProcessor 更晚。

• 回调这两种后置处理器涉及的核心工作是组件扫描、注解配置类解析，在第2部分

6. registerBeanPostProcessors- -初始化 BeanPostProcessor

• 该步骤会初始化所有注册的 BeanPostProcesSOr。

BeanPostProcessor 是针对 Bean 的⽣命周期流程中的重要扩展点，它可以⼲预

bean 对象的实例化、初始化等过程，⼀个典型的体现是给初始化好的对象织人AOP

• 当前步骤初始化 BeanPostProcessor 时，容器中还没有初始化任何业务相关的

bean 对象，所以后续初始化的所有 bean 对象都会经过 BeanPostProcessor 的⼲预。

7. initMessageSource—初始化国际化组件

• 该步骤会初始化默认的国际化组件MessageSource，默认的实现类

能⼒。

都没有扩展它。

的

没有用了。


## 3.7 IOC 容器的启动流程

的工作，只有⼿动向IOC容器注册具体的国际化组件，应用上下⽂才具备国际化的

8. initApplicationEventMulticaster—初始化事件⼴播器

• 该步骤默认会初始化⼀个 ApplicationEventMulticaster 的简单实现

SimpleApplicationEventMulticaster 并注册到IOC容器中。

• Applicationcontext 本身具备的事件⼴播能⼒是依赖 ApplicationEvent

Multicaster 实现的（功能组合的体现）。

9. onRefresh—子类扩展的刷新动作

• 该方法也是⼀个模板方法，默认 Spring Framework 范围的ApplicationContext

• Spring Boot 中⽀持嵌人式 Web 容器的ApplicationContext 在此处有扩展，它

用于初始化嵌入式Web 容器。

10. registerListeners—注册监听器

• 该步骤会将 BeanDefinitionRegistry 中注册的所有监听器（Application

Listener）的 beanName 取出，绑定到事件⼴播器 ApplicationEvent

Multicaster 中。

• 只绑定 beanName⽽不直接取出监听器对象的原因是，考虑到 Application

Listener 作为IOC容器中的Bean，应该放在⼀起统⼀创建和初始化（也就是下⾯

finishBeanFactoryInitialization 动作，目的是希望 BeanPost

Processor 有机会去⼲预它们）。

11. finishBeanFactoryInitialization—初始化剩余的单实例 bean 对象

• 该步骤主要完成两件事：

- 初始化用于类型转换和表达式的解析器（ConversionService 与 Embedded

ValueResolver）；

- 初始化所有⾮延迟加载的单实例bean 对象。

• 该步骤执⾏完毕后，BeanFactory 的初始化工作结束。

• 该步骤包含⼀个 bean 对象的主要⽣命周期过程，内容很复杂，在本书第2部分会详

细展开。

12. finishRefresh—刷新后的动作

• 该步骤的工作相对⽐较零散，包含以下⼏个小动作：

-清除资源缓存；

- 初始化⽣命周期处理器；

- 传播⽣命周期动作，回调所有Lifecycle 类型 Bean 的start 方法；

-⼴播 ContextRefreshedEvent 事件。

13. resetCommonCaches—清除缓存

• 最后的步骤会清除⼀切⽆用的缓存，因为IOC容器的刷新工作已经完成，缓存也就

纵观整个 refresh 方法，每个动作的职责都很清晰，⽽且⾮常有条理。这个过程中，有

对BeanFactory 的处理，有对 ApplicationContext 的处理，有处理

者⼀定要仔细学习和探究。

I第3章 Spring Boot 的 IOC 容器

BeanPostProcessor的逻辑，有准备 APPlicationListener 的逻辑，最后它会初始化那

些⾮延迟加载的单实例 bean 对象。refresh 方法执⾏完毕后，也就宣告

ApplicationContext 初始化完成。


## 3.8 小结

本章主要讲解了 Spring Boot 的IOC 容器 BeanFactory 与 ApplicationContext 的层

次化设计，以及 Spring Boot 对IOC容器模型的扩展。随后我们讲解了 Spring Framework 内部

⼏个⾮常关键的设计—Environment、BeanDefinition、后置处理器。最后我们整体了

解了IOC容器的启动流程。掌握整体的设计，对理解 Spring Boot的整体流程把握⾮常重要，读

第


章

特性来研究。

Spring Boot 的核心引导：SpringApplication

本章主要内容：

• 理解 SpringApplication的设计；

《 SpringApplication的启动阶段引导流程。

经过对第2、3章 Spring Framework ⾼级特性的回顾和温习，本章会深入 Spring Boot 的核

心源码，研究具体的底层实现。Spring Boot 的主启动类中使用 SpringApP1ication 类来引

导 Spring Boot 项目启动，这个类本身的设计就⾮常重要。本章内容会着重研究 Spring

Application 的作用，以及 Spring Boot 的主线应用⽣命周期。


## 4.1 总体设计

要想了解 SpringApplication 的设计，最好的两个切人点是javadoc 和官方⽂档。本节

内容将以 Spring Boot 的官方⽂档为主，从整体上剖析 SpringApplication的设计。

参考 Spring Boot 2.5.x 版本的官方⽂档的 features 部分，第1节介绍的就是Spring

Application.

The SpringApplication class provides a convenient way to bootstrap a Spring application

that is started from a main（ method. In many situations, you can delegate to thestatic

SpringApplication.run method.

SpringApplication 类提供了⼀个⾮常方便的方式，利用main 方法来引导 Spring Boot应

用程序。大多数情况下，启动 Spring Boot 应用程序只需要委托给静态的 Spring

APPlication.run 方法。

官方⽂档只是用两句话概述了 SpringApplication 的整体作用：Spring

APPlication 的核心是简化 Spring Boot 应用程序的启动。后⾯的各节中，它针对 Spring

Application 背后的⾮常多的特性进⾏⽐较详细的解释，本书中挑选了其中⼀些⽐较重要的


## 4.1.1 启动失败的错误报告

使用 Spring Boot 开发过项目的读者⼀定不陌⽣，当我们编写的 Spring Boot 应用程序启动

失败时，控制台会打印关于本次启动失败的信息（诸如 Bean 不存在、端⼜被占用、初始化逻辑

执⾏报错等）。下⾯是⼀个 8080 端⼜被占用时 Spring Boot 打印的错误报告：


Description：

Action：

的全限定类名已作省略处理）。

o.s.b.d.a.UnboundConfigurationPropertyFailureAnalyzer，

o.s.b.d.a.ConnectorStartFailureAnalyzer，



# 第4章 Spring Boot 的核心引导：SpringApplication


## 第4章 Spring Boot 的核心引导：SpringApplication


APPLICATION FAILED TO START

Embedded servlet container failed to start. Port 8080 was already in use.

Identify and stop the process that's listening on port 8080 or configure this application to

1isten on another port.

负责输出错误报告的是⼀个名为 FailureAnalyzers 的组件，这个组件实现了 Spring

BootExceptionReporter，顾名思义，它就是负责异常报告输出的。注意这个类名是⼀个复

数的概念，它的内部集成了⼀组FailureAnalyzer，如代码清单4-1所示。

1代码清单 4-1 FailureAnalyzers 的内部集成了⼀组 FaillureAnalyzer

final class FailureAnalyzers implements springBootExceptionReporter ｛

Private final List<FailureAnalyzer>analyzers；

FailureAnalyzers （ConfigurableApplicationContext context, Classloader classLoader）｛

this.analyzers = 10adFailureAnalyzers （this.classLoader）；

prepareFailureAnalyzers （this.analyzers, context）；

Private List<FailureAnalyzer> loadFailureAnalyzers （ClassLoaderclassLoader）｛

LLstsotring> analyzerNames = springractorlesuoaaer

.loadFactoryNames （FailureAnalyzer.class, classLoader）；

由代码清单4-1 可知，FailureAnalyzers 的集成方式是利用 Spring Framework SPI 的方

式，从 spring.factories 中读取所有 FailureAnalyzer，⽽在 spring-boot 依赖的

spring.factories ⽂件中就已经有配置了，如代码清单 4-2 所示（为保证阅读体验，下⾯

代码清单 4-2 Spring Boot 中默认已有的 FailureAnalyzer 配置

# Failure Analyzers

org.springframework.boot.diagnostics.FailureAnalyzer=

o.s.b.C.P.NotConstructorBoundInjectionFailureAnalyzer，

o.s.b.d.a.BeanCurrentlyInCreationFailureAnalyzer，

o.s.b.d.a.BeanDefinitionoverrideFailureAnalyzer，

o.s.b.d.a.BeanNotOfRequiredTypeFailureAnalyzer，

o.s.b.d.a.BindFailureAnalyzer，

o.s.b.d.a.BindValidationFailureAnalyzer，

o.s.b.d.a.NoSuchMethodFailureAnalyzer，

o.s.b.d.a.InvalidConfigurationPropertyValueFailureAnalyzer

跟踪错误。

运⾏阶段⽽导致真正要用它的时候才发现组件不可用。简⾔之，延迟初始化会导致发现问题的

时机延后。

spring.main.lazy-initialization=true


## 4.1 总体设计！

o.s.b.d.a.NoUniqueBeanDefinitionFailureAnalyzer，

o.s.b.d.a.PortInUseFailureAnalyzer，

o.s.b.d.a.ValidationExceptionFailureAnalyzer，

o.s.b.d.a.InvalidConfigurationPropertyNameFailureAnalyzer，

可以发现，在默认情况下 Spring Boot 已经检查了⼀些常见的异常类型。如果在实际开发中发

现默认检查的类型不够完善，可以⾃⾏编写FailureAnalyzer 的实现类，⾃⾏解析异常和输出。

②提示：即便不扩展任何FailureAnalyzer，依然可以通过调整日志输出级别为 DEBUG，来


## 4.1.2 Bean 的延迟初始化

默认情况下，如果没有特殊声明，ApplicationContext 中的Bean 需要延迟初始化时都

会在应用程序启动阶段统⼀预先创建好。启用 Bean 的延迟初始化，会使得IOC 容器中绝大部

分的 Bean 都变需要时才创建（只有 SmartInitializingsingleton 类型的Bean 依然会

提早初始化），这样配置可以显著减少应用程序的启动耗时。但延迟初始化伴随的问题是，⼀些

本应该可以在应用程序启动阶段发现的问题，由于关键组件bean 对象的初始化延迟到应用程序

启用 Bean 的延迟初始化很简单，只需在全局配置⽂件中添加⼀⾏配置：

『 提示：如果在全局开启 Bean的延迟初始化的同时，⼜需要某些bean 对象在应用程序启动阶段初始

化就绪，可以在类上标注@Lazy（false）注解。


## 4.1.3 SpringApplication 的定制

通常在编写 Spring Boot 应用程序主启动类时，会直接使用 SpringApplication 的静态

run 方法用⼀⾏代码实现，但 SpringApplication 本⾝的设计很灵活，可以利用与它相关

的API 来定制化启动 Spring Boot 应用程序。Spring Boot 为我们提供了两种定制化启动方式，

⼀种是直接创建SpringApplication 对象，调用其 API 进⾏定制，另⼀种方式是借助

SpringApplicationBuilder 实现链式定制，如代码清单 4-3所示。

代码清单 4-3 定制化启动 Spring Boot 应用程序的两种方式

public static void main （String［］ args） ｛

1/ 方式1：直接操作 SpringApplication 的API

SpringApplication springApplication = new SpringApplication（）；

springApplication.setMainApplicationClass （SpringApplicationApplication.class）；

springApplication.setBannerMode （Banner.Mode.OFF）；// 关闭Banner 打印

springApplication.run （args）；

1/ 方式2：借助构建器

new SpringApplicationBuilder（SpringApplicationApplication.class）

1第4章 Spring Boot 的核心引导：SpringApplication

.bannerMode （Banner.Mode.OFF）

.web （WebApplicationType.NONE）// 指定 Web 应用类型为⾮web

两种操作方式基本类似，不过请留意⼀点，利用 SpringApplicationBuilder 可以构

建具有层次关系的 Spring Boot 应用程序：

new SpringApplicationBuilder （.•.）•parent （.•.）.child（.•.）.run（.•.）；

这种构建完成后的效果是，应用程序的内部会形成多个 ApPlicationContext 且彼此之间

是⽗子关系。官方⽂档对此也作了说明：构建 ApplicationContext 层次结构时有⼀些限制，

例如 Web 组件必须包含在子上下⽂中，并且 Environment 对于⽗上下⽂和子上下⽂都相同。


## 4.1.4 Web 类型推断

Spring Boot 的⼀大优势是整合不同场景时的简单易操作。当项目中需要整合 SpringWebMvc

时，只需引入 spring-boot-starter-web 依赖，整合 SpringWebFlux 时，只需引入

spring-boot-starter-webflux 依赖，Spring Boot 会在底层推断应用应该用哪种1OC容

器实现来⽀撑整个应用的运转。Spring Boot 2.x 基于 SpringFramework 5.x，Web 场景的解决方

案有 WebMvc 和 WebFlux 两种，所以在 Spring Boot 中对于 web 应用的类型也相应分为

Servlet（ WebMvc）、Reactive （ WebFlux）和 None 三种。

根据官方⽂档的描述，可以得知Web 类型的推断规则如下：

• 如果 SpringWebMvc 存在，则启用 Servlet 环境；

• 如果 SpringWebMvc 不存在并且 SpringWebFlux 存在，则启用 Reactive 环境；

• 如果两者都不存在，则启用最原始的没有任何web 概念的None 环境。

注意推断规则中有⼀个细节：当 Spring WebMvc 与 SpringWebFlux 同时出现在项目中时，

WebFlux 默认失效（除⾮我们⼿动定制 SpringApplication，指定 WebApplicationType

为 Reactive）。


## 4.1.5 监听与回调

原⽣的 Spring Framework 中已经构建了⼀套强大且完善的事件监听机制，开发者可以在基

于 Spring Framework 的应用程序中任意编写事件，配合⼴播器与监听器，可以实现⾃定义的事

件监听，⽽且 Spring Framework 已经预先构建了⼀些基于 ApplicationContext 的事件（如

ContextRefreshedEvent 等）。

Spring Boot 中将事件监听机制进⼀步扩展。由于 Spring Boot 的应用启动方式是通过

SpringApplication 这个核心 API，在这个API 的调用期间也会有属于它⾃⼰的⽣命周期，

Spring Boot 在该部分⽣命周期中⼜扩展了新的可切人扩展点，也就是基于 Spring

APPlication 的事件监听。

Spring Boot 中新引入的核心事件监听类是 SpringApplicationRunListener，它是专

门用于⼴播 Spring Boot 事件的监听器。

1. SpringApplicationRunListener

官方⽂档中并没有给 SpringApplicationRunListener 留出篇幅讲解，javadoc 中也

接口方法 可获得的组件

contextPrepared

contextLoaded

ConfigurableApplicationContext

ConfigurableApplicationContext

started

running

回调时机

⽴即调用

新容器时

failed

ConfigurableApplicationContext

ConfigurableApplicationContext，

Throwable

类对应如下。

environmentPrepared—ApplicationEnvironmentPreparedEvent


## 4.1 总体设计1

只是简单地用⼀句话概括：SpringApplicationRunListener 是监听 Spring

Application 在run 方法内的监听器。这句话本⾝不太好理解，按照常理来讲⼀个监听器通

常会对应⼀个或多个事件，此处监听⼀个方法的确有些反常。其实 SpringApplication

RunListener 的确是只监听 run 方法的，只不过这个 run 方法实在是太复杂了，⽽且整个

SpringApplication 的 run 方法中涉及特别多的切入点和扩展点，留有⼀个监听器可以在

SpringApplication 中预先定义好的切人点中扩展⾃定义逻辑。

SpringApplicationRunlistener 本身是⼀个接口，它定义了7个事件回调的方法，

如表4-1所示。

表4-1 SpringApplicationRunListener 的接口方法详解

starting

environmentPrepared ConfigurableEnvironment

ConfigurableApplicationContext

调用 SpringApplication 的run 方法时

Environment 构建完成，但在创建

ApplicationContext 之前

在创建和准备 ApplicationContext 之

后，但在加载之前

Applicationcontext 已加载，但尚未刷

IOC 容器已刷新，但未调用 Command

LineRunners 和ApplicationRunners时

在run 方法彻底完成之前

run 方法执⾏过程中抛出异常时

如果需要⾃定义 SpringApplicationRunListener 的实现类，在注册时不能直接使用

@Component 等常规的 Bean 注册方式，⽽是需要配置到 spring.factories ⽂件中，利用

SPI 机制加载。

请注意，SpringApplicationRunListener 的实现类要求必须显式定义⼀个包含两参

数的构造方法（哪怕不编写构造方法的具体逻辑），如代码清单4-4所示。

代码清单 4-4 SpringApplicationRunListener 的实现类必须定义特定的构造方法

Public class TestRunListener implements SpringApplicationRunListener ｛

public TestRunListener（SpringApplication application,String［］ args） ｛｝

2. Spring Boot 新引入的事件

与 SpringApplicationRunListener 的各个事件方法对应，Spring Boot 给每个方法都

定义了⼀个新的事件模型，用于⽀撑普通的Applicationlistener 使用。方法与事件模型

• starting- -ApplicationStartingEvent

• contextPrepared—ApP1icationContextInitializedEvent

ApplicationPreparedEvent

请注意，部分事件在⼴播时，通过正常方式注册的监听器⽆法感知，因为这些事件⼴播的

1第4章 Spring Boot 的核心引导：SpringApplication

• contextLoaded-

• started—ApplicationStartedEvent

• running—ApplicationReadyEvent

• Eailed—ApplicationFailedEvent

时候 APP1icationcontext 还没有被创建出来，⾃然也就⽆法有效地初始化监听器。因此如

果需要监听这些事件，需要通过调用 SpringApplication 或者 SpringApplication

Builder 的 API 来编程式注册监听器，或者是在 spring.factories ⽂件中配置监听器的

实现类，如代码清单 4-5所示。

代码清单4-5 编程式注册监听器

new SpringApplicationBuilder（SpringApplicationApplication.class）

•listeners （new App1icationStartingListener （））.run （args）；

org.springframework.context.ApplicationListener=\

coll.1nkeooear.springooot.Listener.AppLicationstartinguistener


## 4.1.6 应用退出

当 Spring Boot 应用启动成功后，内部的 ApplicationContext 会连带注册⼀个

shutduwnhook线程（准确的时机是在IOC容器刷新之前）。当JM退出时，shutduwnhook

线程可以确保 IOC容器中的 Bean 被IOC 容器的销毁阶段⽣命周期回调（如被@PreDestroy

注解标注的方法），从⽽合理地销毁IOC容器及其所有的Bean。

从源码的⻆度看，它注册的关闭钩子的线程名称是固定的 SpringContextShutdown

Hook，并且线程中的执⾏逻辑就是关闭IOC容器本身，该方法会销毁IOC容器中的所有Bean，

关闭BeanFactory，如代码清单4-6所示。

1代码清单4-6 注册的关闭钩子，用于关闭IOC 容器

String SHUTDOWN_HOOK_THREAD_NAME = "SpringContextShutdownHook"；

public void registerShutdownHook （）｛

if（this.shutdownHook == nu11）｛

1/ 创建钩子

this.shutdownHook = new rhread（SHUTDOWN_HOOK_THREAD_NAME）1

@Override

public void run（）｛

synchronized （startupShutdownMonitor） ｛

doclose （）；

｝；

// 注册钩子

Runtime.getRuntime （）.addShutdownHook （this.shutdownHook）；

Boot

启动逻辑⾮常复杂，核心步骤大概分为以下8步，读者可以先大体有⼀个了解，详细的源码分


## 4.2 ⽣命周期概述I


## 4.2 ⽣命周期概述

了解了 SpringApplication 的整体设计之后，下⾯先从宏观层⾯了解⼀个 Spring

的应用从开始执⾏ main 方法到最终退出的整个⽣命周期都经历了哪些重要的环节。

本节旨在先了解大体环节，详细的原理和底层源码，我们统⼀放到本书第2部分展开讲解。


## 4.2.1 创建 SpringApplication

当执⾏ SpringApplication.run 方法时，底层实际上帮我们创建了⼀个

SpringApplication 对象并调用其run 方法，如代码清单4-7所示。

代码清单 4-7 SpringApplication#run

public static ConfigurableApplicationContext run （Class<?>［］ primarySources, String［］ args）｛

return new SpringApplication （primarySources）.run （args）；

除了常规地使用 SpringApplication 的静态 run 方法，也可以⾃⾏创建 Spring

Application。⽆论是⾃⾏创建，还是借助 SpringApplicationBuilder 的流式 API 创

建 SpringApplication 对象，最终得到的都是⼀个可以调用 run 方法的、完整的

SpringApPlication对象。在创建 SpringApplication 的过程中有以下关键步骤值得注意。

• Web 应用类型判断：Spring Boot 会根据当前应用的类路径确定当前应用最匹配的Web

类型，这个 Web 类型会影响到实际创建的 Applicationcontext 落地实现类的类型；

• 初始化器&监听器的加载：在启动 springApplication 之前，它会先收集⼀些前期

准备好的 ApplicationContextInitializer 以及 ApplicationListener，这

些组件会在启动 SpringApplication 的环节中发挥作用（组件的具体作用放在第6

章讲解）；

• 确定主启动类：Spring Boot 会根据当前应用的启动状态，从方法调用栈中找到主启动

类并记录下来，这个主启动类会参与默认 Banner 的打印。


## 4.2.2 启动 SpringApplication

SpringApplication 创建完毕后，下⼀步是应用启动。整个 SpringApplication 的

析放到第6 章深入探究。

1.获取 SpringApplicationRunlistener 监听器，该监听器会贯穿整个 Spring

Application 的启动过程。

2. 准备运⾏时环境，即 ApplicationContext 中的 Environment。

3.Banner 的加载与打印，默认情况下打印的Banner 是以⽂字形式打印到控制台，可以

通过定制 SpringApplication 来⾃定义配置。

4. 创建 ApplicationContext IOC 容器，该步骤创建的依据是创建 Spring

Application 时推断的 Web 应用类型，不同的 Web 应用类型对应不同的 ApPlication

Context 落地实现。

用是否被关闭，以及关闭应用时要执⾏的释放资源等操作（⼀个典型的例子是释放数据库连接

【第4章 Spring Boot 的核心引导：SpringApplication

5. 初始化IOC 容器，该步骤会应用前⾯步骤准备的 APPlicationContext

Initializer，并获取和加载配置源（默认是主启动类）。

6. 刷新IOC容器，该步骤会触发 APPlicationContext 的核心 refresh 方法，逻辑

极其复杂，该部分内容放到第7章讲解。

7.启动嵌人式 Web 容器（如果有的话），当Web 应用类型不是 None 并且以独⽴运⾏的jar

包运⾏ Spring Boot 时，底层会额外创建⼀个嵌人式Web 容器（默认是 Tomcat）并启动。

8. 回调 Spring Boot 的运⾏器，包括 ApplicationRunner 和CommandLineRunner。


## 4.2.3 应用退出

当应用被关闭时，Spring Boot 考虑到应用中可能会存在⼀些需要释放的资源，于是它在

springApplication 启动时会额外向JVM 中注册⼀个“钩子线程”，这个线程会专⻔监听应

池中的连接）。源码部分在前⾯4.1.6 节已经解释过，这⾥不再赘述。


## 4.3 小结

本章主要对 Spring Boot的核心启动引导类springApplication 有⼀个整体层⾯的介绍。

SpringApplication 中的结构、逻辑本质上都是基于 Spring Framework 中 Application

Context之上的扩展。ApPlicationContext 中除了第3章讲过的IOC特性，另⼀个核心

特性是 AOP，第5 章会研究 Spring Boot 对AOP 的⽀持。

第


章

的结果）。

接点的组合。

Spring Boot 的AOP ⽀持

本章主要内容：

今 Spring Framework 的 AOP；

• 注解驱动 AOP的核心组件研究。

Spring Framework 的两大核心特性中，除了IOC，⾯向切⾯编程（AOP）也⾮常重要。AOP

是OOP的补充，OOP的核心是对象，AOP的核心是切⾯（Aspect）。AOP 可以在不修改功能代

码本⾝的前提下，使用运⾏时动态代理技术对已有代码逻辑进⾏增强。AOP 可以实现组件化、

可插拔式的功能扩展，通过简单配置即可将功能增强到指定的切人点。


## 5.1 Spring Framework 的AOP 回顾

⾸先回顾 Spring Framework 阶段的AOP核心内容，这对于后⾯研究源码有很大的帮助。


## 5.1.1 AOP术语

AOP 的基本术语包含以下8点。

• Target：目标对象，即被代理的对象。

• Proxy：代理对象，即经过代理后⽣成的对象（如 Proxy.newProxyInstance 返回

• JoinPoint：连接点，即目标对象的所属类中定义的所有方法。

Pointcut：切入点，即那些被拦截/被增强的连接点。

- 切人点与连接点的关系应该是包含关系：切入点可以是0个或多个（甚⾄全部）连

- 注意，切入点⼀定是连接点，连接点不⼀定是切入点。

• Advice：通知，即增强的逻辑，也就是增强的代码。

- Proxy（代理对象）=Target（目标对象）+Advice（通知）

• Aspect：切⾯，即切人点与通知组合之后形成的产物。

- Aspect（切⾯）= Pointcut（切人点）+Advice（通知）

- 实际上切⾯不仅包含通知，还有⼀个不常⻅的部分是引介。

• Weaving：织入，这是⼀个动词，它是将 Advice（通知）应用到 Target（目标对象），

进⽽⽣成 Proxy（代理对象）的过程。

是织入。

时为原始类动态添加新的属性/方法。

⼀列出。

有返回值；如果方法抛出了异常，则不会有返回值。

环绕通知是所有通知类型中可操作范围最大的⼀种，因为它可以直接获取目标对象

以及要执⾏的方法，所以环绕通知可以任意在目标对象的方法调用前后扩展逻辑，

甚⾄不调用目标对象的方法。

1第5章 Spring Boot 的AOP ⽀持

- Proxy（代理对象）=Target（目标对象）+Advice（通知）。这个算式中的加号，就

• Introduction：引介，这个概念对标的是 Advice（通知），通知是针对切入点提供增强

的逻辑，⽽引介是针对Class（类），它可以在不修改原有类的代码的前提下，在运⾏


## 5.1.2 通知类型

Spring Framework 中⽀持的通知类型包含5种，这些通知类型是基于 AspectJ的。下⾯逐

• Before 前置通知：目标对象的方法调用之前触发。

• After 后置通知：目标对象的方法调用之后触发。

• AfterReturning 返回通知：目标对象的方法调用成功，在返回结果值之后触发。

• AfterThrowing 异常通知：目标对象的方法在运⾏中抛出/触发异常后触发。

- 注意，AfterReturning 与 AfterThrowing是互斥的。如果方法调用成功⽆异常，则会

• Around 环绕通知：编程式控制目标对象的方法调用。


## 5.2 Spring Boot 使用AOP

下⾯简单回顾⼀下 Spring Boot 整合AOP场景。Spring Boot整合AOP场景的步骤⾮常简单，

只需在项目依赖中导人 sPring-boot-starter-aop 依赖，并在主启动类上标注@Enable

AspectJAutOPrOxY 注解，即可开启基于注解驱动的AOP，如代码清单5-1所示。

】代码清单5-1 导入并开启注解驱动 AOP

<dependencies>

<dependency>

<groupId>org.springframework.boot</groupId>

<artifactId>spring-boot-starter-web</artifactId>

</dependency>

<dependency>

<groupId>org.springframework.boot</groupId>

<artifactId>spring-boot-starter-aop</artifactId>

</dependency>

</dependencies>

@EnableAspectJAutoProxy

@SpringBootApplication

public class SpringBootAOpAPPlication 1

public static void main （Stringl］ args） ｛

@Service

下⾯深入剖析该注解的作用。有了模块装配、条件装配的基础，再来分析注解会更容易。


## 5.3 AOP的开关：@EnableAspectJAutoProxy I

springApplication.run （SpringBootAopApplication.class,args）；

下⼀步是编写测试的切⾯类和组件类。本章只是简单回顾基于 AspectJ 的AOP 场景使用，

所以快速编写⼀个舌例，如代码清单 5-2所舌。

】代码清单 5-2 DemoService 与增强它的切⾯类 DemoAspect

public class Demoservice ｛

public void save（）｛

System.out.printIn （"DemoService save run ...."）；

@Aspect

@Component

Public class ServiceAspect ｛

@Before（"execution （public * com. linkedbear.springboot.service. *.*（..））"）

public void beforePrint （）｛

system.out.printIn（"Service Aspect before advice run ..."）；

要测试 AOP 是否⽣效，可以直接在主启动类处获取 IOC容器，并提取出 DemoService

对象，调用其 save 方法，如代码清单 5-3所舌。

代码清单 5-3 通过 SpringApplication 得到 IOC 容器并调用 Service

Public static void main （Stringl］ args）｛

Application Context ctx = SpringApplication.run （SpringBootAopApplication.class,args）；

ctx.getBean （DemoService.class）.save （）；

运⾏主启动类，控制台可以正确打印两⾏输出，说明Spring Boot 整合AOP 场景顺利完成。

verVice Aspect Derore aavice run....

DemoService save run..


## 5.3 AOP的开关：@EnableAspectJAutoProxy

开启注解驱动 AOP 的核心是@EnableAspectJAutOPrOxY 注解，如代码清单5-4所舌。

代码清单 5-4 @EnableAspectJAutoProxy 的核心源码

@Import （AspectJAutoProxyRegistrar.Class）

public einterface EnableAspectJAutoProxy ｛

boolean proxyTargetClass（） default false；

boolean exposeProxy（） default false：

I第5章 Spring Boot 的AOP ⽀持

EnableAspectJAutoProxy注解中包含两个属性，分别是 proxyTargetClass 是否

直接代理目标类（即强制使用 Cglib 代理），以及 exposeProxy 是否暴露当前线程的AOP 上

下⽂（开启后，通过 AopContext 可以获取到当前的代理对象本身）。

除了注解属性，@EnableAspectJAutoProxy最重要的作用是使用@Import 注解导入了

⼀个 AspectJAutoProxyRegistraro


## 5.3.1 AspectJAutoProxyRegistrar

从类名上可以简单理解为，它是⼀个基于 Aspect］ ⽀持的⾃动代理注册器，那它注册了什

么呢？通过javadoc 我们可以看到端倪：

Registers an AnnotationAwareAspectJAutoProxyCreator against the current BeanDefinition

Registry as appropriate based on a given @EnableAspectJAutoProxy annotation.

基于给定的EnableAspectJAutoProxy注解，根据当前 BeanDefinitionRegistry

在适当的位置注册 AnnotationAwareAspectJAutoProxYCreatoro

从javadoc 中可以看到，AspectJAutoProxyRegistrar 注册的组件是⼀个 Annotation

AwareAspectJAutoProxyCreator，这个类的作用稍后再展开讨论。⾸先看⼀下

AspectJAutoProxyRegistrar 的导入逻辑。

1. AspectJAutoProxyRegistrar 注册核心代理组件

AspectJAutoProxyRegistrar 注册核心代理组件的逻辑如代码清单5-5所示。

1代码清单 5-5 AspectJAutoProxyRegistrar 注册核心代理组件的逻辑

class AspectJAutoProxyRegistrar implements ImportBeanDefinitionRegistrar｛

@Override

public void registerBeanDefinitions （AnnotationMetadata importingClassMetadata，

BeanDefinitionRegistry registry）｛

1/ 此处会有注册新 BeanDefinition 的动作

AopConfigUtils.registerAspectJAnnotationAutoProxyCreatorlfNecessary（registry）；

AnnotatlonAttrioutes enapLeAspeCtuAuLOLrOXY = Annotat1oncont19UC14S

.attributesFor （importingClassMetadata,EnableAspectJAutoProxY.Class）；


## 11 给 AnnotationAwareAspectJAutoProxyCreator 设置属性值

if （enableAspectJAutoProxy ！ =null）｛

i£ （enableAspectJAutoPrOXY.getBoolean（"proxyTargetClass"））｛

AopConfigutils.forceAutoPrOxYCreatorTouseClassProxying（registry）；

i£ （enableAspect JAutoProxy.getBoolean（"exposeProxy"））｛

AopConfigutils.forceAutoProxyCreatorToExposeProxy （registry）；

注意观察代码清单5-5的关键点，AspectJAutoProxyRegistrar 实现了 ImportBean

DefinitionRegistrar 接口，具备编程式注册新 BeanDefinition 的能⼒，核心的

registerBeanDefinitions 方法中，除后⾯对@EnableAspectJALtOPrOxY 注解的属性

@Nullable


## 5.3 AOP 的开关：@EnableAspectJAutoProxy I

进⾏获取和设置以外，注册组件的核心逻辑是方法体中的第⼀⾏：AopConfigUtils.

registerAspectJAnnotationAutoProxyCreatorlfNecessarY。

2. 注册核心代理创建器

编程式注册核心 AutoProxyCreator 如代码清单5-6所舌。

代码清单 5-6 编程式注册核心 AutoProxyCreator

public static BeanDefinition registerAspectJAnnotationAutoProxyCreatorIfNecessary（BeanDefinition

Registry registry） ｛

return registerAspectJAnnotationAutoProxyCreatorIfNecessary（registry,null）；

@Nullable

public static BeanDefinition registerAspectJAnnotationAutoProxyCreatorlfNecessary（

BeanDefinitionRegistry registry，@Nullable Object source）｛

// 注意在这个方法中已经把 AnnotationAwareAspectJAutoProxyCreator 的字节码类型传入方法了

return registerorEscalateApcAsRequired（AnnotationAwareAspectJAutoProxyCreator.class，

registry, source）；

public static final String AUTO_PROXY_CREATOR_BEAN_NAME =

"org.springframework.aop.config.internalAutoProxyCreator"；

private static BeanDefinition registerorEscalateApcAsRequired （Class<?> cls，

BeanDefinitionRegistry registry， @Nullable Object source）｛

Assert.notNu11（registry，"BeanDefinitionRegistry must not be nu1］"）；

iE （registry.containsBeanDefinition （AUTO_PROXY_CREATOR_BEAN_NAME））｛

BeanDefinition apcDefinition = registry.getBeanDefinition （AUTO_PROXY_CREATOR_BEAN_

NAME）；

if （！cls.getName （）.equals （apcDefinition.getBeanClassName （）））｛

intcurrentPriority = findPriorityForClass （apcDefinition.getBeanClassName （））；

int requiredPriority = findPriorityForClass （cls）；

if（currentPriority < requiredPriority）｛

apcDefinition.setBeanClassName （cls.getName （））：

return null：

RootBeanDefinitionbeanDefinition = new RootBeanDefinition （cls）：

oeanberinition.setoource （source）：

beanDefinition.getPropertyValues（）.add（"order"，Ordered. HIGHEST_PRECEDENCE）；

beanDefinition.setRole （BeanDefinition.ROLE_INERASTRUCTURE）；

registry.registerBeanDefinition （AUTO_PROXY_CREATOR_BEAN_NAME,beanDefinition）；

return beanDefinition；

静态的方法调用中，它已经指明了最终要注册的 AOP 代理创建器的落地实现 Annotation

AwareAspectJAutoProxyCreator，⽽在下⾯最终注册的方法 registerorEscalate

ApcAsRequired 中，⼿动创建了⼀个 RootBeanDefinition，将 AOP 代理创建器的类型传入，

并设置了最⾼级别的优先级等其他属性和配置项，随后注册到 BeanDefinitionRegistry 中。

AspectJAwareAdvisorAuto

强方法将被⾃动识别。这涵盖了方法执⾏的切入点表达式。

的规则。

已基本不用，故此部分本书不再展开。

观察顶层的接⼜，其中有⼏个重要的根接⼜值得关注。

代理对象。

创建流程。

1第5章 Spring Boot 的AOP ⽀持

提示：对于上述源码的内部组件注册逻辑，后续还会遇到类似的情况，各位读者注意整理和总结。


## 5.3.2 AnnotationAwareAspectJAutoProxyCreator

注册的核心动作本⾝没有太多的研究价值，重点还是 AOP 动态代理创建器本⾝。借助

javadoc 可以获取到以下的⼀段描述。

AspectJAwareAdvisorAutoProxyCreator subclass that processes all AspectJ annotation aspects in

the current application context, as well as Spring Advisors.

Any AspectJ annotated classes will automatically be recognized, and their advice applied if

Spring AOP's proxy-based model is capable of applying it. This covers method execution joinpoints.

If the <aop:include> element is used, only @AspectJ beans with names matched by an

include pattern will be considered as defining aspects to use for Spring auto-proxying.

Processing of Spring Advisors follows the rules established in org.springframework.aop.

framework.autoproxy.AbstractAdvisorAutoProxyCreator.

AnnotationAwareAspectJAutoProxyCreator 是

PrOXYCreator 的子类，用于处理当前 ApplicationContext 中的所有基于 AspectJ注解的

切⾯，以及 Spring 原⽣的Advisor。

如果 SpringAOP 基于代理的模型能够应用任何被@AspectJ注解标注的类，那么它们的增

如果使用<aop:include>元素，则只有名称与包含模式匹配的被@AspectJ标注的Bean

将被视为定义要用于 Spring ⾃动代理的切⾯。

Spring 中内置的 Advisor 的处理遵循 AbstractAdvisorAutoProxyCreator 中建⽴

拆解来看，javadoc 中解释的核心内容是，AnnotationAwareAspectJAutoProxyCreator

可以兼顾 Aspect］ ⻛格的切⾯声明，以及 Spring Framework 原⽣的AOP编程。

提示：目前主流的 AOP 开发都是基于 AspectJ 的⾯使用，有关 Spring Framework 原⽣的AOP编程

1．继承结构

借助IDEA 可以很清楚地看到 AnnotationAwareAspectJAutoProxyCreator 的继承

结构，以及其中的重要核心接⼜，如图 5-1 所舌。

BeanPostProcessor：用于在 postProcessAfterInitialization 方法中⽣成

• InstantiationAwareBeanPostProcessOr：拦截 Bean 的正常 doCreateBean

• smartInstantiationAwareBeanPostProcessor：提前预测Bean 的类型、暴露

Bean 的引用（AOP、循环依赖等在现阶段解释起来过于复杂，故此处暂时略过）。

理导致逻辑死循环）。

nPostProcessor BeanFactoryAware

遇到它。


## 5.3 AOP 的开关：@EnableAspectJAutoProxyI

• AopInfrastructureBean：实现了该接口的 Bean 永远不会被代理（防⽌反复被代

像w BeanPostProcessor

sstProcessor ProxyConfig

。 SmartInsta

常xAbstr

wAbstrac ProxyCreator

券* AspectJAwareAdvisorAutoProxyCreator

，AnnotationAwareAspectJAutoProxyCreator

图5-1 AnnotationAwareAspectJAutoProxyCreator 的类继承结构

除此之外，AnnotationAwareAspectJAutoProxyCreator 的顶层抽象实现类

AbstractAutoProxyCreator 也需要读者引起重视，在第9章⽣命周期AOP环节中会频繁

2. 初始化时机

AnnotationAwareAspectJAutoProxyCreator 本身是⼀个后置处理器，在第3章中

已经提到了，后置处理器的初始化时机是在 AbstractApplicationContext 刷新动作的

第6步 registerBeanPostProcessors 方法中，如代码清单 5-7所示。

【代码清单 5-7 AOP 代理创建器的初始化时机

public void refresh（） throws BeansException,I1legalStateException ｛

synchronized（this.startupShutdownMonitor） ｛...

try｛

postProcessBeanFactory （beanFactory）；

invokeBeanFactoryPostProcessors （beanFactory）；

1/ 6. 注册、初始化 BeanPostProcessor

registerBeanPostProcessors （beanFactory）；

initMessageSource （）；

initApplicationEventMulticaster （）；

1….

registerBeanPostProcessOr 方法会按照既定的排序规则初始化所有

BeanPostProcessor。此处有⼀个细节，AnnotationAwareAspectJAutOPrOxyCreator

实现了 Ordered 接口，并且声明了最⾼优先级，这就意味着它会提前于其他

BeanPostProcessOr 创建，从⽽也会⼲预这些普通 BeanPostProcesSOr 的初始化（即也

有可能被 AOP 代理增强）。

｝

|第5章 Spring Boot 的AOP ⽀持

3. 作用时机

与其他BeanPostProcessOr 相似，AnnotationAwareAspectJAutoProxyCreator

的作用时机通常是在bean 对象的初始化阶段时介入处理，⽽代理对象的创建时机在初始化逻辑

之后执⾏（即 postProcessAfterInitialization），这是由于 Spring Framework 考虑到

尽可能保证Bean 的完整性，如代码清单5-8所示。

】代码清单 5-8 AOP 代理创建器的后置处理逻辑

public Object postProcessAfterInitialization（@Nullable Object bean, String beanName）｛

i£ （bean ！= nul1）｛

Object cacheKey = getCacheKey （bean.getClass （），beanName）；

if（this.earlyProxyReferences.remove （cacheKey）！= bean）｛

// 核心：构造代理

return wrapIfNecessary （bean,beanName,cacheKey）；

return bean；

postProcessAfterInitialization 方法中的核心动作是中间的 wrapIfNecessary，

这个动作从方法名上就很容易理解，如果有必要的话，wrapIfNecessary 方法会给当前对象

包装⽣成代理对象。下⾯进入源码部分，如代码清单 5-9所示（现阶段读者只需关注标有注释

的部分）。

1代码清单 5-9⽣成代理对象的主⼲逻辑

Protected Object wrapIfNecessary（Object bean, StringbeanName,Object cacheKey）/

i （Stringutils.hasLength （beanName） && this.targetSourcedBeans.contains （beanName））｛

return bean；

i£ （Boolean.FAL.SE.equals （this.advisedBeans.get （cacheKey）））｛

return bean；

｝

if （isInfrastructureClass （bean.getClass （））1| shouldskip （bean.getClass （），beanName））｛

this.advisedBeans.put （cacheKey, Boolean.FALSE）；

return bean；


## 11 Create proxy if we have advice

// 如果上⾯的判断都没有成⽴，则决定是否需要进⾏代理对象的创建

Object ［］ specificInterceptors = getAdvicesAndAdvisorsForBean （bean.getClass （），beanName,nu11）；

if （specificInterceptors ！= DO_NOT_PROXY）1

this.advisedBeans.put （cacheKey, Boolean.TRUE）；

1/创建代理对象的动作

Object proxy = createProxy （bean.getClass （），beanName，

specificInterceptors,new SingletonTargetSource （bean））；

this.proxyrypes.put （cacheKey,proxy.getClass（））；

return proxy；

1/ 记录缓存

this.advisedBeans.put （cacheKey,Boolean.FALSE）；

return bean；

从源码逻辑中概括起来，创建代理对象的核心动作分为三个步骤。


## 5.4 小结】

1. 判断决定是否是⼀个不会被增强的bean 对象。

2. 根据当前正在创建的bean对象去匹配增强器。

3. 如果有增强器，创建bean 对象的代理对象。

Q提舌：本章只是先熟悉整体流程，创建代理对象的具体动作及细节在第9章中会详细讲解和剖析。


## 5.4 小结

本章主要回顾了 Spring Boot 对AOP的⽀持，初步了解了注解驱动 AOP的核心组件与⽣效

机制。AnnotationAwareAspectJAutoProxYCreator 作⼒ AOP 的核心后置处理器，掌握

其代理增强逻辑⾄关重要，在第9章中还会进⼀步展开分析。


## 第2部分

Spring Boot 的⽣命周期原理分析

• 第6章 Spring Boot 准备容器与环境

＞第7章 IOC容器的刷新

•第8章 Spring Boot 容器刷新扩展：嵌入式 Web 容器



# 第9章 AOP 模块的⽣命周期


## 第9章 AOP 模块的⽣命周期

第

章

所示。

@SpringBootApplication

Spring Boot 准备容器与环境

本章主要内容：

今 SpringApplication 的创建流程全解析；

• SpringApplication 的启动阶段；

• 内置 IOC容器的创建流程；

• SpringApplication 的事件回调机制。

本书第1部分的内容系统地讲解了Spring Boot的核心容器设计，第2部分将针对 Spring Boot

的完整启动过程作⼀个全⾯、详细的全⽣命周期解析。本章先来探究 SpringApplication

这个核心引导类，它的设计在第4章已经详细探讨过，本章的重点是它的工作全流程。

按照 Spring Boot 推荐的主启动类编写方式，在主启动类的 main 方法中使用Spring

ApPlication 的静态 run 方法，以⼀⾏代码即可启动 Spring Boot 应用，如代码清单6-1

代码清单6-1 经典的Spring Boot 主启动类编写方式

Public class SpringBootLifecycleApplication ｛

public static void main （String［］ args）｛

SpringApplication.run（SpringBootLifecycleApplication.class, args）；

本章研究的核心是 SpringApplication的静态 run 方法，下⾯正式进入源码分析环节。

进入 run 方法后，可以发现最终调用的是下⾯重载的run 方法，⽽重载的run 方法又将

启动的动作拆解两步：创建 SpringApplication 对象；启动 SpringApplication（⻅

代码清单6-2）。针对这两个动作下⾯分别展开解析。

代码清单 6-2 SpringApplication 的run 方法调用

public static ConfigurableApplicationContext run （Class<?> primarySource,String...args）｛

return run （new Class<?>I］ | PrimarySource ），args）；

public static ConfigurableApplicationcontext run （Class<?>［］ primarysources,String［］ args）｛

return new SpringApplication （PrimarySources） .run （args）；


## 6

（即普遍认为的主启动类），后续还有⼏个复杂动作，逐⼀拆解来看。

官方⽂档的内容，再结合源码来阅读，这部分逻辑会更加容易理解。

|第6章 Spring Boot 准备容器与环境

创建 SpringApplication

静态 run 方法调用的 SpringApplication 构造方法中只传人了主启动类，但同时

SpringApplication 还⽀持传人特定的Resourceloader 以实现⾃定义的资源加载，通常

情况下在项目开发中不会使用特殊定制的 ResourceLoader，故该部分可以忽略。由代码清

单6-3 可以看出，最终调用的是下⾯的两参数构造方法（关键步骤已标有注释）。

代码清单 6-3 SpringApplication 的构造方法调用

Private Set<Class<?>> primarySources；

public SpringApplication （Class<?>..PrimarySources）｛

this （nu11,primarySources）；

public SpringApplication （Resourceloader resourceloader,Class<?>..PrimarySources）｛

this,resourceloader = resourceLoader：

Assert.notNu11（primarySources，"PrimarySources must not be nul1"）；

1/ 将传入的 SpringBootLifecycleApplication 启动类放入 primarySources 中

1/ 这样spring Boot 应用就知道主启动类在哪⾥，名称是什么

// Spring Boot ⼀般称呼这种主启动类叫 primarysource（主配置资源来源）

this.primarySources = new LinkedHashSet<>（Arrays.asList （primarySources））；

1/ 判断应用环境

this.webApplicationType = WebApplicationType.deduceFromClasspath （）；

// 设置应用初始化器

setInitializers （（Collection）getSpringFactoriesInstances（ApplicationContextInitializer

•class））；

// 设置 Spring Boot 全局监听器

setListeners （（Collection）getSpringFactoriesInstances （Applicationlistener.class））；

// 确定主启动类

this.mainApplicationClass = deduceMainApplicationClass （）；

由代码清单6-3可以发现，SpringApplication 的构造方法中存储了传入的主配置资源


## 6.1.1 推断 Web 环境

SpringApplication 构造方法的第⼀步会从当前应用的类路径下尝试寻找⼀些特定的

类，并以此推断当前应用适合使用哪种Web 环境，如代码清单6-4所示。参考第4章中提到的

1代码清单 6-4 Web 环境类型推断

// 全限定名常量有精简

Private static final Stringl］ SERVLET_INDICATOR_CLASSES = ｛ "javax.servlet.Servlet"，

"org.springframework.web.context.ConfigurablewebApplicationContext" ｝；

private static final String WEBMVC_INDICATOR_CLASS = "o.s.web.servlet.DispatcherServlet"；

private static final String WEBFLUX_INDICATOR_CIASS = "o.s.web.reactive.DispatcherHandler"；

private static final String JERSEY_INDICATOR_CLASS = "o.g.jersey.servlet .ServletContainer"；

可以看到源码的推断规则与之前总结的顺序有⼀些小差别，具体如下：

的情况）。

接口。

上下⽂环境注册属性源或激活配置⽂件。


## 6.1 创建 SpringApplication|

static WebApplicationrype deduceFromClasspath （）｛

i£ （ClassUtils.isPresent （WEBFLUX_INDICATOR_CLASS,nul1）

&& ！ClassUtils.isPresent （WEBNVC_INDICATOR_CLASS, nu11）

&& ！ClassUti1s.isPresent （JERSEY_INDICATOR_CLASS, nu11））｛

return NebApplicationType.REACTIVE；

For（String className :SERVLET_INDICATOR_CLASSES）｛

if（！ClassUtils.isPresent （className,null））｛

return WebApplicationrype.NONE；

return WebApplicationrype.SERVIET；

• 如果 WebFlux 的核心控制器 DispatcherHandler 存在并且 WebMvc的核心控制器

Dispatcherservlet 不存在，则启用 Reactive 环境；

• 如果Servlet类以及ConfigurableNebApplicationcontext 中有任何⼀个不存

在，则认⼒导入 WebMvc 相关的环境不全，从⽽启用 None 环境；

• 否则，启用 Servlet 环境（包含只导人了 WebMvc 环境，以及 WebMvc与WebFlux 共存


## 6.1.2 设置初始化器

setInitializers （（Collection）getSpringFactoriesInstances （ApplicationContextInitializer.class））；

紧接着的第⼆步要利用 Spring Framework 的 SPI 机制，从 spring.factories 中加载⼀

组 ApPlicationContext 的初始化器并应用到当前项目中。⾸先读者要对 Application

ContextInitializer 有⼀个认识。

1. ApplicationContext/nitializer

参照⽂档注释可以对 ApplicationContextInitializer 有⼀个初步的了解：

Callback interface for initializing a Spring ConfigurableApplicationContext prior to being

refreshed.

Typically used within web applications that require some programmatic initialization of the

application context. For example, registering property sources or activating profiles against the

context's environment.

ApplicationContextInitializerprocessors are encouraged to detect whether Spring's Ordered

interface has been implemented or if the @Order annotation is present and to sort instances

accordingly if so prior to invocation.

它是⼀个用于在刷新容器之前初始化 ConfigurableApplicationcontext 的回调

通常在需要对应用程序上下⽂进⾏某些编程初始化的Web 应用程序中使用，例如根据

|第6章 Spring Boot 准备容器与环境

⿎励 ApplicationContextInitializer 处理器检测是否已实现 Ordered接口或者

是否标注了BOrder注解，并在调用之前相应地对实例进⾏排序。

⽂档注释理解起来有⼀些难度，不过第⼀段内容就已经表明，Application

ContextInitializer 是⼀个在IOC 容器刷新之前被回调的接口，这也意味着它可以在IOC

容器创建之后、未触发刷新动作之前执⾏额外的逻辑处理。借助IDE 可以发现 Application

ContextInitializer 是⼀个接口，并且只有⼀个 initialize 方法，该方法需要传人⼀个

ConfigurableApplicationContext 的实现类，用于在方法体内对IOC容器进⾏⼀些前置

处理（只有传入 Configurable 前缀的IOC容器才允许对其进⾏修改），如代码清单6-5所示。

代码清单 6-5 ApplicationContextlnitializer

public interface ApplicationContextInitializer<C extends ConfigurableApplicationContext>｛

void initialize（C applicationContext）；

下⾯介绍 ApplicationContextInitializer 的⼀个经典实现类，这个类来⾃ spring-

boot-starter-web 的 ServletContextApplicationContextInitializer，它的作用

是将 ApplicationContext 与 ServletContext 互相放置于对方容器中，以便可以互相查

找获取，核心源码如代码清单6-6所示。

代码清单 6-6 ServletContextApplicationContextlnitializer 的实现

public class ServletContextApplicationContextInitializer

implements ApplicationContextInitializer<ConfigurableWebApplicationContext>， Ordered｛

Private final ServletContext servletContext ；

public ServletContextApp1icationContextInitializer （ServletContext servletContext）｛

this （servletContext,false）；

1..

@Override

Public void initialize （ConfigurablevebApPlicationContext applicationcontext）｛

applicationcontext .setServletContext （this.servletContext）；

if（this.addApplicationContextAttribute） ｛

this.servletContext.setAttribute （WebApplicationContext.ROOT_WEB_APPLICATION_CON

TEXT_ATTRIBUTE,aPPlicationContext）；

2. 设置初始化器的逻辑

简单了解了 ApplicationContextInitializer 的设计之后，下⾯我们看⼀下 Spring

Boot 是如何加载这些初始化器并且应用于 ApplicationContext 本身的。

setInitializers （（Collection）getSpringFactoriesInstances （ApPlicationContextInitializer. class））；

注意，setInitializers 方法中传入的 ApplicationContextInitializer 集合是

由 getSpringFactoriesInstances 方法获取⽽来的，该方法明显是通过使用 Spring Framework

设置监听器

有关监听器和事件驱动的内容。

事件⼴播器发布事件的能⼒。

件的能⼒。


## 6.1 创建 SpringApplication】

的SPI机制获取的，通过源码也可以明显看出，如代码清单6-7所示。

代码清单 6-7 getSpringFactorieslnstances 的底层利用 Spring Framework 的SPI 机制

private <T> Collection<T>getSpringFactoriesInstances （Class<T> type）｛

return getSpringFactoriesInstances （type,new Class<?>［］ ｛｝）：

Private <T> Collection<T> getSpringFactoriesInstances （Class<T> type，

Class<?>［］ parameterrypes,Object.••args）｛

ClassLoader classloader = getClassLoader （）；

// 此处使用了 SpringFramework 的SPI 机制

Set<String> names = new LinkedHashSet<>（SpringFactoriesloader.loadFactoryNames （type，

classLoader））；

List<T> instances = createspringFactoriesInstances （type, ParameterTypes，

classLoader,args,names）；

AnnotationAwareOrderComparator.sort （instances）；

Lecura instances：


## 6.1

ApplicationContextInitializer 设置完毕后，下⼀个核心动作是设置

APPlicationListener 监听器，设置的逻辑与上⼀步完全⼀致，不再赘述。下⾯简单介绍

1. Spring Framework 的事件驱动模型

Spring Framework 中体现观察者模式的特性是事件驱动和监听器。在事件驱动模型中监听

器充当订阅者，监听特定的事件，事件源充当被观察的主题，用来发布事件；IOC 容器本身可

以看作事件⼴播器，对应的⻆⾊是观察者。我个人倾向于把 Spring Framework 的事件驱动核心

概念分为4个：事件源、事件、⼴播器、监听器。

• 事件源：发布事件的对象。

• 事件：事件源发布的信息/作出的动作（即 ApplicationBvent）。

⼴播器：事件真正⼴播给监听器的对象（即 Applicationcontext）。

- ApplicationContext 接口实现了 ApplicationEventPublisher 接口，具备

- ApplicationEventMulticaster 组合了所有的监听器，具备事件⼴播器⼴播事

• 监听器：监听事件的对象（即 ApplicationListener）。

2. ApplicationListener

ApplicationListener接口的设计本身继承⾃JDK 原⽣的观察者模式接口EventListener，

如代码清单6-8所舌（其实 Spring Framework 中的很多组件设计都基于JDK 原⽣的API）。

代码清单 6-8 ApplicationListener

public interface ApplicationListener<E extends ApplicationEvent>extends EventListener｛

void onApplicationEvent （E event）；

配的监听器。

【第6章 Spring Boot 准备容器与环境

有关ApplicationListener 的描述，在javadoc 中解释得⾔简意赅：

Interface to be implemented by application event listeners. Based on the standard java.util.

EventListener interface for the Observer design pattern.

As of Spring 3.0, an ApplicationListener can generically declare the event type that it is

interested in. When registered with a Spring ApplicationContext, events will be filtered accordingly，

with the listener getting invoked for matching event objects only.

由应用程序事件监听器实现的接口直接继承⾃ JDK 中观察者模式的 java.util.

EventListener 标准接口。

从Spring3.0版本开始，App1icationListener 可以使用泛型类型声明监听的事件类型。

当监听器注册到IOC容器后，底层将相应地过滤事件，并且仅针对匹配的事件对象调用所有适

对于上述内容，读者可以先简单地对事件机制以及 ApplicationListener 有⼀个初步

了解，⾄于事件机制在 Spring Framework 和 Spring Boot 底层如何运⾏，在第7章才能看到。


## 6.1.4 确定主启动类

创建 SpringApplication 的最后⼀步，deduceMainApplicationClass 方法会确定主启

动类，对应的查找方式是借助方法调用栈，寻找触发方法名为main 的所在类，如代码清单6-9所示。

代码清单 6-9确定主启动类的核心逻辑

private Class<?> deduceMainApplicationClass（）｛

tryl

StackTraceElement ［］ stackTrace = new RuntimeException （）.getStackTrace （）；

for（StackTraceElement stackTraceElement:stackTrace）｛

// 从本方法开始往上查找，哪⼀层调用栈上有 main 方法，方法对应的类就是主配置类

if （"main" .equals （stackTraceElement .getMethodName （）））｛

return Class.forName （stackTraceElement .getClassName （））；

｝ // catch

return null；

借助Debug 调试可以很清楚地发现，stackTrace 的内容就是正在触发的方法调用栈信息，

⽽最终获取到的 main 方法所在类就是目前启动测试的主启动类 SpringBootLifecycle

Application，如图6-1所示。

ts stackirace =ibia袋xiraCeug


## 4 declaringClass = "org.springframework.boot.SpringApplication'

declaringClass = 'com.linkedbear.springboot. SpringBootLifecycleApplicatioi

業 flleName =*SpringBootlifecycleApplication.jeva"

图 6-1 stackTrace 即方法调用栈本身

现会有⼀些差别，了能更好地理解版本间的⼀些设计上的区别，在⼀些特殊的位置会引用其他版


## 6.1 创建 SpringApplication /


## 6.1.5 与 Spring Boot 1.x 的区别

补充⼀下与 Spring Boot 1.x 版本的对⽐。

提舌：由于本书在进⾏源码分析时主要采用 Spring Boot 2.3.x 版本的源码，⽽不同的版本中底层的实

本的 Spring Boot 源码进⾏对⽐。

1. 主配置类概念的引入

Spring Boot2.x 中引入了⼀个新的概念：主配置类。这个设计与Spring Boot 1.x 有区别，在

Spring Boot 1.x 中没有这个概念，所有的配置源都被视为object 类型（读者可以先思考⼀下

为什么会被设置Object 类型），存放在 SpringApplication 的成员属性中：


## 11 Spring Boot 1.x

private final Set<Object> sources = new LinkedHashSet<Object>（）；

⽽到了 Spring Boot 2.x 版本后，Spring 团队认为项目应该全⾯⽀持注解配置类的方式，尽

可能地不使用 XML 配置⽂件进⾏应用配置，于是在 SpringApplication 的属性成员中单独

抽取了⼀个新的集合primarysources，并将其命名“主配置类”：

// spring Boot 2.x

Private Set<Class<?>> primarySources；

private Set<String> sources = new LinkedHashSet<>（）：

注意，此处的sources 的集合泛型被替换为 String类型，这个设计⼜有什么特殊之处呢？

结合上⾯ Spring Boot 1.x 的Object 泛型，读者可以大概猜测出来，利用两个 Set集

合就可以分离出两种不同的配置载体，⽽这两种载体就是 Spring Framework ⽀持的XML 配

置⽂件与注解配置类。因为 Spring Boot 1.x 中没有主配置类的概念，所以 sources ⾥既要

存放注解配置类，⼜要考虑存人 XML 配置⽂件的路径（甚⾄⼀个包扫描的路径），因此被

迫将 sources 集合的泛型置为 Object；⽽ Spring Boot 2.x中引入了主配置类的概念，并

且 Spring Boot 本身⿎励开发者使用注解配置类，尽量避免使用XML 配置⽂件作为配置源

（当然如果确实仍需要使用，它还予以⽀持），所以 SpringBoot 将重心放在

PrimarySources。

2. Web 类型推断的区别

由于 Spring Bootl.x 基于 Spring Framework 4.x，⽽4.x 还没有 WebFlux 模块，因此在进⾏

Web 类型推断时只会在Servlet 与None之间选择，并且推断的方法也是直接在 SpringApplication

中实现的。⽽到了 Spring Boot 2.x后Web 类型推断的逻辑被单独抽取为⼀个静态方法，如代码

清单6-10所示。

代码清单 6-10 Web 类型推断的区别

1/ Spring Boot 2.x

this.webApplicationType = WebApplicationrype.deduceFromClasspath （）；

1/ Spring Boot 1.x

this.webEnvironment = deduceWebEnvironment （）；

了解它的用途。

它是⼀个简单的对象注册表，在启动和环境后置处理期间可用，直到准备好

ApplicationContext。

象创建器，但⽆论怎样设计，最终都可以根据类型获取到⼀个对象。

|第6章 Spring Boot 准备容器与环境


## 6.1.6 与 Spring Boot 2.4.x 的区别

Spring Boot 版本升级到2.4.x 之后，在创建SpringApplication 的阶段引入了⼀个新的

扩展切入机制：借助 BootstrapRegistry 实现重对象的预创建/共享。

1. BootstrapRegistry

BootstrapRegistry 是 Spring Boot 2.4.0版本后引入的全新 API，从类名上理解

BootstrapRegistry 有注册表的概念，同时⼜有启动器引导的概念，借助javadoc 可以大体

A simple object registry that is available during startup and Environment post-processing up to

the point that the ApplicationContext is prepared.

Can be used to register instances that may be expensive to create, or need to be shared before the

ApplicationContext is available.

The registry uses Class as a key, meaning that only a single instance of a given type can be stored.

可用于注册创建成本⾼的实例，或需要在 ApplicationContext 可用之前共享的实例。

注册表使用Class 作为键，这意味着只能存储给定类型的单个实例。

抽取 javadoc 中想表达的核心内容：BootstrapRegistry 是⼀个全新的对象容器，它内部

存放的对象最终会传递给 ApplicationContext（即IOC容器），它可以用于提前创建⼀些重

对象。这种设计不难理解，BootstrapRegistry 可以在 ApplicationContext 初始化之前

预先初始化⼀些创建成本很⾼的对象（即重对象），等到 APP1icationContext 真正需要初始

化时，BootstrapRegistry 可以直接将这些重对象共享给 Application Context，使得IOC

容器不再需要初始化这些重对象，从⽽避免IOC容器初始化过程过慢的问题。

BootstrapRegistry 的唯⼀实现是 DefaultBootstrapContext，通过观察代码

清单 6-11 可以进⼀步体会到，BootstrapRegistry 本身只是⼀个容器。

1代码清单 6-11 DefaultBootstrapContext 只是⼀个对象容器

public class DefaultBootstrapContext implements ConfigurableBootstrapContext ｛

private final Map<Class<?>，InstanceSupplier<？>> instanceSuppliers = new HashMap<>（）：

private final Map<Class<?>， Object> instances = new HashMap<>（）；

容器中只有两个 Map，其中instances 负责存放对象，instanceSuppliers 则存放对

2. BootstrapRegistryInitializer

BootstrapRegistry本身只是⼀个容器，要把对象注册到容器中，需要借助另⼀个API：

BootstrapRegistryInitializer（前身是 Bootstrapper，在2.4.5版本中被废弃，在


## 2.6.0版本中被移除），如代码清单6-12所舌。

代码清单 6-12 BootstrapRegistryInitializer 接⼜

public interface BootstrapRegistryInitializer ｛

void initialize（BootstrapRegistry registry）；

进⾏⼀些初始化动作（如注册对象、改变配置等）。


## 6.2 启动 SpringApplication 】

第⼀眼看上去，BootstrapRegistryInitializer 的设计⽐较类似于 Application

ContextInitializer，其实这两个接⼜的设计如出⼀辙，核心都是获取被初始化的目标后

不过 Spring Boot 本⾝没有 BootstrapRegistryInitializer 的实现类，这就意味着

BootstrapRegistryInitializer 仅是 Spring Boot 为开发者预留的⼀个新扩展点，Spring

Boot 本身并没有在此基础上扩展更多的底层逻辑实现（对⽐⽼版本的逻辑只是扩展，但没有更

复杂）。

3. 初始化的区别

对⽐2.3.x 版本 SpringApplication 的构造方法，可以发现构造方法的逻辑中额外添加

了⼀个集合成员的赋值操作，如代码清单6-13所舌。额外添加的方法会利用 Spring Framework

的SPI 机制，从 spring.factories 中加载所有 BootstrapRegistryInitializer 的配

置实现类，并在创建对象后保存到 SpringApplication 中。⾄于这些 BootstrapRegistry

Initializer 何时发挥作用，下⾯在启动 SpringApplication 阶段⻢上就可以看到。

代码清单 6-13初始化 BootstrapRegistryInitializer

Private List<BootstrapRegistryInitializer> bootstrapRegistryInitializers；

public SpringApplication （ResourceLoader resourceLoader，Class<?>.primarySources）｛

this.bootstrapRegistryInitializers = getBootstrapRegistryInitializersFromSpringFactories （）；

private List<BootstrapRegistryInitializer> getBootstrapRegistryInitializersFromSpringFactories

（）｛

ArrayList<BootstrapRegistryInitializer> initializers = new ArrayList<>（）；

1/ Bootstrapper 在2.4.5版本中被废弃，在2.6.0版本中被移除

getSpringFactoriesInstances （Bootstrapper.class）.stream（）

.map（（bootstrapper）->（（BootstrapRegistryInitializer） bootstrapper：：initialize））

•forEach （initializers：：add）；

// 利用 SPI 加载BootstrapRegistryInitializer

initializers.addA11 （getSpringFactoriesInstances （BootstrapRegistryInitializer.class））；

return initializers；


## 6.2 启动 SpringApplication

在 SpringApplication 的构造方法执⾏完毕后，SpringApplication 对象创建就绪

了，下⼀步会执⾏ SpringApplication 的run 方法，从⽽真正地启动 Spring Boot 应用。整

个 run 方法的过程共包含13步，其中包含了 ApplicationContext 的最核心的刷新容器环

节。为了能清楚划分整个 Spring Boot 应用启动的多个环节，接下来会在6.2~6.4 节中解析整个

run 方法的启动过程。

本节先聚焦启动 SpringApplication 的⼀些准备工作，这部分涉及 run 方法的3个重

要环节，如代码清单6-14所示。

下⾯逐⼀拆解来看。

⽂档注释中可以获取到的关键信息如下：

常用于在概念验证和开发过程中验证性能，⽽不是作为⽣产应用的⼀部分。



# 第6章 Spring Boot 准备容器与环境


## 第6章 Spring Boot 准备容器与环境

】代码清单6-14 SpringApplication#run ⽚段（1）

Public ConfigurableApplicationcontext run （String.•.args） 1

// 前置准备

Stopwatch stopwatch = new StopWatch （）；

stopwatch.start （）；

ConfigurableApplicationContext context = nul1；

// 配置与 awt 相关的信息

configureHeadlessProperty（）；

1/ 获取 springApplicationRunListeners，并调用 starting 方法（回调机制）

SpringApplicationRunListeners listeners = getRunListeners （args）；

// 【回调】⾸次启动run 方法时⽴即调用。可用于⾮常早期的初始化（准备运⾏时环境之前）

1isteners.starting（）；

try｛

// 将main 方法的 args 参数封装到⼀个对象中

ApplicationArguments applicationArguments = new DefaultApplicationArguments （args）；


## 11 准备运行时环境

ConfigurableEnvironment environment = prepareEnvironment （1isteners,applicationArguments）；

11……..

// StopWatch 对象在此处被调用 stop 方法

stopWatch.stop （）；

11….…...


## 6.2.1 前置准备

1.计时器对象的使用

run 方法的第⼀个步骤会初始化⼀个 stopwatch 对象，这个对象看上去与计时有关，从

This class is normally used to verify performance during proof-of-concepts and in development，

rather than as part of production applications.

这段注释的重点是：仅用于验证性能。换⾔之，StopWatch 是用来监控启动时间的，它

本身不太重要，读者只需留意⼀下它的使用位置。通过观察代码清单 6-15 可知，在run 方法

刚启动执⾏其 start 方法时开始计时，当后⾯的try 块即将执⾏完成⽽执⾏其 stop 方法时停

⽌计时，由此可以计算出 Spring Boot 应用启动的大体耗时。

1代码清单6-15 设置了⼀个特殊的系统配置变量

Private void configureHeadlessProperty（） ｛

System. setProperty （SYSTEM_PROPERTY_JAVA_AWT_HEADLESS，

System.getProperty （SYSTEM_PROPERTY_JAVA_AWT_HEADLESS, Boolean.tostring（this.headless）））；

2. awt 的设置

第⼆个关键动作是 configureHeadlessProperty 方法，该方法的实现如代码清单6-15

使没有检测到显示器也允许其继续启动（对于服务器⽽⾔，没有显示器也可以运⾏）。


## 6.2 启动 SpringApplication l

所示。方法的实现⽐较诡昇，它从 System 中提取了⼀个配置属性 SYSTEM_PROPERTY

JAVA_ANT_HEADLESS，之后⼜重新设置回去。

这样做的目的是什么呢？需要读者在JDK 的System类中观察代码清单6-16中的⼏个方法。

【代码清单 6-16 JDK 中 System 源码节选

public static string getProperty （String key）｛

checkKey （key）；

1/ JMX......

// 从Properties 中取值

return props.getProperty （key）；

public static String getProperty （String key, String def）｛

checkKey （key）：

1/ JMX.....

// 从Properties 中取值，如果没有取到，返回默认值

return props.getProperty（key,def）；

public static String setProperty（String key, String value） ｛

checkKey （key）；

1/ JMX ....

return （String）props.setProperty （key, value）；

通过代码清单6-16 读者可以发现，System 类中有两个重载的 getProperty 方法，但只

有⼀个 setProperty方法。仔细观察源码可以发现，两个重载的 getProperty方法有⼀点

微妙的区别。这⾥要提⼀下 Properties的机制：setProperty方法中调用的是Properties

的两参数，分别为 key 和 value。⽽两个重载的 getProperty 方法的唯⼀区别是分别调用

Properties 的⼀参数和两参数，这种区别类似于 Map 中的 get 和 getOrDefault。换⾔之，

两参数的 getProperty 方法如果没有取到指定的 key 则会返回给定的默认值；⼀参数的

getProperty 方法调用时如果没有取到值则返回 nul1。

经过代码清单 6-15 的设置后，⽆论怎样从 System 中获取都能取到"SYSTEM_PROPERTY_

JAVA_AWT_HEADLESS”对应的值。为什么 Spring Boot 要设置这个特殊的属性值？

SYSTEM PROPERTY_JAVA_AWT_HEADLESS 代表什么含义呢？观察源码中该常量的值：

// 显示器缺失

private static final String SYSTEM_PROPERTY_JAVA_AWT_HEADLESS = "java.awt.headless"；

由此可知代码清单6-15 的真正作用是：设置该配置属性后，在启动 Spring Boot 应用时即

3. 对⽐ Spring Boot 2.1.X

Spring Boot 2.0到2.2版本中在前置准备阶段还预留了⼀个异常分析器的集合：

Collection<SpringBootExceptionReporter> exceptionReporters = new ArrayList<>（）；

集合泛型中的SpringBootExceptionReporter 就是Spring Boot 的异常分析器，它是⼀个

用于⽀持 SpringApplication 启动错误报告的⾃定义异常报告回调接口，它本身也利用 Spring

|第6章 Spring Boot 准备容器与环境

Framework 的SPI 机制加载。不过 Spring Boot 中默认只有⼀个实现类：FailureAnalyzers。注

意观察类名，FailureAnalyzers 是⼀个具有复数概念的类，⽽且 FailureAnalyzers 的访问

修饰符不是 public类型，这就意味着 FailureAnalyzers 是⼀个组合的概念，它内部会集成⼀组

FailureAnalyzer。借助 IDE 可以发现设计确实如此，其对应的源码如代码清单6-17所舌。

1代码清单 6-17 FailureAnalyzers 内部利用 SPI 机制集成⼀组 FailureAnalyzer

final class FailureAnalyzers implements SpringBootExceptionReporter ｛

private final List<FailureAnalyzer> analyzers；

FailureAnalyzers （ConfigurableApplicationContext context，Classloader classLoader）｛

this.analyzers = 1oadFailureAnalyzers （context,this.classLoader）；

private List<FailureAnalyzer> 1oadFailureAnalyzers （ConfigurableApplicationContext context，

ClassLoader classLoader）｛

List<String>C.assNaneS =SpringFactoriesloader .loadFactoryNames （FailureAnalyzer.

Class, ClassLoader）；

return analyzers；

从代码清单6-17中可以体会到，设计FailureAnalyzers 的意图是希望开发者关注如何

实现内部集成的FailureAnalyzer，⽽不是如何访问FailureAnalyzers 本身。Spring Boot

已经内置了不少 FailureAnalyzer 的实现类，如果有特殊需求，开发者可以⾃⾏定制

FailureAnalyzer 的实现类，并配置到项目的spring.factories 中，Spring Boot 都可以

获取并整合到 SpringApplication中。

4. 对⽐ Spring Boot 2.4.X

由于 Spring Boot 2.4.0版本后引入了新的 API:BootstrapRegistry 与 Bootstrap

Context。在 SpringApplication 启动的前置准备中会创建 DefaultBootstrap

Context，并应用所有的 BootstrapRegistryInitializer，如代码清单6-18 所示。

代码清单 6-18 初始化 DefaultBootstrapContext

public ConfigurableApplicationContext run （String... args）｛

StopWatch stopWatch = new StopWatch （）；

stopWatch.start （）；

1/ 此处会创建 DefaultBootstrapContext

DefaultBootstrapContext bootstrapContext = createBootstrapContext （）；

ConfigurableApplicationContext context = null；

Private DefaultBootstrapContext createBootstrapContext （）｛

DefaultBootstrapContext bootstrapContext = new DefaultBootstrapContext （）；

this.bootstrapRegistryInitializers.forEach（initializer）-> ｛

LnLtLaLLzer•Lnitlarlue loootstraptontextl.

）；

return bootstrapContext；


## 6.2


## 6.2 启动 SpringApplication|

获取 SpringApplicationRunListeners

前置准备完成后，接下来 SpringApplication 会获取⼀组 SpringApplication

RunListener，如代码清单 6-19 所示。

代码清单 6-19 获取 SpringApplicationRunListeners 的逻辑

// 获取 SpringApplicationRunListeners，并调用 starting 方法（回调机制）

SpringApplicationRunListeners 1isteners = getRunListeners （args）；

listeners .starting（）；

private SpringApplicationRunListeners getRunListeners （String［］ args）

Class<?>［］ types = new Class<?>［］ ｛ SpringApplication.class,Stringl］.class｝；

// 依然使用 SpringFramework 的SPI 机制加载

return new SpringApplicationRunListeners （logger，

getSpringFactoriesInstances （SpringApplicationRunListener.class, types, this, args））；

有关 SpringApplicationRunListeners 的设计在第4章已经了解过，本节不再重复

讲解，读者可以观察⼀下默认加载的监听器实现。借助 Debug 运⾏⾄此，发现在默认情况下可

以加载到⼀个类型内 EventPublishingRunListener 的监听器，如图6-2所示。

listeners = （SpringApplicationRunListeners@1700｝

> log = ｛LogAdapter$Slf4jLocationAwarel.og@1712）

~f listeners = （ArrayList@1713） size= 1


## 0 = ｛EventPublishingRunListener@1715｝

图 6-2 默认有⼀个 SpringApplicationRunListeners

1. EventPublishingRunListener 与 Spring Boot 扩展事件

从类名上理解 EventPublishingRunListener 具备事件发布能⼒，那么发布事件必定

要配合事件⼴播器来实现，观察 EventPublishingRunListener 的类成员结构以及构造方

法，如代码清单6-20 所示。

代码清单 6-20 EventPublishingRunListener 的结构

public class EventPublishingRunListener implements SpringApplicationRunListener, Ordered｛

Private final SpringApplication application；

Private final Stringll args；

private final SimpleApplicationEventMulticaster initialMulticaster：

Public EventPublishingRunListener （SpringApplication application, String［］ args） ｛

this.application = application；

this.args = args；

1/ 注意此处初始化了⼀个事件⼴播器，并存储了所有监听器

this.initialMulticaster = new SimpleApplicationEventMulticaster （）；

for （ApplicationListener<？> 1istener : application.getListeners （））｛

this.initialMulticaster.addApplicationListener（1istener）；

this.initialMulticaster.multicastEvent （new ApplicationEnvironmentPreparedEvent （this.

虽然读者之前没有⻅过这些事件，但通过事件的类名就可以领会到，它们分别对应 Spring

间的设计对⽐。

个事件触发时

所示。

1第6章 Spring Boot 准备容器与环境

可以发现，在EventPublishingRunlistener 构造成功之后，其内部就已经初始化了

⼀个事件⼴播器，并整合了现阶段能获取到的所有 ApplicationListener。紧接着，

EventPublishingRunListener 实现 springApplicationRunListener 的每个方法中

都有⼀个特殊的事件被⼴播，如代码清单 6-21 所示。

代码清单 6-21 EventPublishingRunListener 的事件⼴播实现（节选）

Boverride

public voidstarting（）｛

this.initialMulticaster.multicastEvent （new ApplicationstartingEvent（this.application,this.

args））；

Coverride

public void environmentPrepared（Configurableinvironment environment）｛

application,this.args, environment））：

@override

public void context Prepared（ConfigurableApplicationContext context）｛

this.initialMulticaster.multicastEvent（new ApplicationContextInitializedEvent（this.

application,this.args, context））；

ApplicationRunListener 的各个事件切入点的方法。这就意味着借助 Spring

ApplicationRunListener 的事件扩展逻辑，除了可以直接编写 SpringApplication

RunListener 的实现类，也可以编写 ApplicationListener 的实现类监听这些 Spring Boot

扩展的事件，只不过监听 Spring Boot 事件的 ApplicationListener 同样需要将其配置到

spring.factories，或者在构造SpringApPlication 时编程式注册，仅通过组件扫描等

方式注册的监听器⽆法监听到所有 Spring Boot 事件。

2. 与其他版本的对⽐

了解了 SpringApplicationRunListener 的实现后，按照惯例再了解⼀下不同版本之

Spring Boot 1.x 中并没有把所有的时机都考虑到位，所以当时的 SpringApp1i

cationRunListener 中只⽀持前四个事件切人，不过事件本身的设计与 Spring Boot 2.x 的相同，

在第 4 章也提到过。

在 Spring Boot 2.4.x 中，由于引入了 BootstrapContext，这个组件会在

ApplicationContext 初始化之前起作用，⽽ SpringApplicationRunListener 的前两

BootstrapContext 处于有效状态，因此 SpringApplication

RunListener 中将前两个事件的触发人参中添加了 BootstrapContext，以便开发者

在扩展事件监听逻辑时有更多的API 可以获取，进⽽有机会做更多的事情，如代码清单6-22

环境的 StandardReactive


## 6.2 启动 SpringApplication【

代码清单6-22 2.4.x版本之后的 SpringApplicationRunListener 源码（节选）

default void starting（ConfigurableBootstrapContext bootstrapContext）｛

starting （）；

default void environmentPrepared（ConfigurableBootstrapContext bootstrapContext，

ConfigurableEnvironment environment）｛

environmentPrepared （environment）；


## 6.2.3 准备运行时环境

获取监听器之后，下⼀个重要环节是准备运⾏时环境，这个步骤对应第3章中讲到的

Environment 抽象，如代码清单 6-23所舌。prepareEnvironment 方法的主要步骤是先创建

Environment，再配置，最后绑定到 SpringApplication 上。下⾯对这3个步骤逐⼀解释。

代码清单 6-23 准备运⾏时环境 Environment

ApplicationArguments applicationArguments = new DefaultApplicationArguments （args）；

ConfigurableEnvironment environment = prepareEnvironment （1isteners,applicationArguments）；

Private ConfigurableEnvironment prepareEnvironment （SpringApplicationRunListeners 1isteners，

ApplicationArguments applicationArguments）｛

1/ 创建、配置运⾏时环境

ConfigurableEnvironment environment = getOrCreateEnvironment （）；

configureEnvironment（environment,applicationArguments.getSourceArgs（））；

ConfigurationPropertySources.attach （environment）；

// 此处回调 SpringApplicationRunListener 的 environmentPrepared 方法

// Environment 构建完成，但在创建 ApplicationContext 之前触发

listeners.environmentPrepared （environment）；

// 环境与应用绑定

bindToSpringApplication （environment）；

if （！this.isCustomEnvironment）｛

environment = new EnvironmentConverter（getClassLoader（））.convertEnvironmentIfNecessary

（environment, deduceEnvironmentClass （））；

ConfigurationPropertySources.attach （environment）；

return environment；

1.创建运⾏时环境

前⾯在了解 Environment 的时候，借助 IDEA ⽣成继承和派⽣关系时，图3-6中有3个

Environment 的落地实现类，分别对应普通环境的 StandardEnvironment、⽀持 Servlet

StandardServletEnvironment 和⽀持 Reactive 环境的

WebEnvironment。具体到底层创建中，刚好是根据之前推断好的 Web 类型来决定使用何种

Environment 的实现，如代码清单 6-24 所示。

代码清单6-24 根据应用类型创建运⾏时环境

Private ConfigurableEnvironment getOrCreateEnvironment（）｛

i£ （this.environment！= nu11） ｛

读者可以结合源码⾃⾏阅读。

I第6章 Spring Boot 准备容器与环境

return this.environment；

switch（this.webApplicationType）｛

case SERVLET：

return new StandardServletEnvironment （）；

case REACTIVE：

return new StandardReactiveWebEnvironment （）；

default：

return new StandardEnvironment （）；

提示：注意，当前方法是 SpringApplication 内部的，所以可以直接提取 web

ApplicationType 的值。

2. 配置运⾏时环境

创建好 Environment 对象后，接下来要向 Environment 中配置⼀些组件，包括

ConversionService、命令⾏参数、编程式配置的 profile，如代码清单 6-25所舌。Configure

Environment 方法本身难度不大，内部调用方法的实现逻辑也⽐较容易理解，这⾥不再展开，

1代码清单6-25 配置运⾏时环境

Protected void configureEnvironment（ConfigurableEnvironment environment,String［］ args）｛

i£（this.addConversionService）｛

// 获取全局共享的 ApplicationConversionService 实例

ConversionService conversionService = ApplicationConversionService.getSharedInstance （）；

environment.setConversionService （（ConfigurableConversionService） conversionService）；

1/ 将命令⾏参数封装⼒ PropertySource

configurePropertySources （environment,args）；

// ⽀持编程式添加激活的 profile

configureProfiles （environment,args）；

3. Environment 与 SpringApplication 绑定

在⼴播 environmentPrepared 事件后，PrepareEnvironment 方法会将

Environment 中配置的⼀些属性值绑定到 SpringApplication 中，它的实现代码只有⼀

⾏，如代码清单 6-26所示。

代码清单 6-26 Environment 的属性值绑定⾄ SpringApplication 对象

Protected void bindToSpringApplication（ConfigurableEnvironment environment）｛

try！

Binder.get （environment）.bind（"spring.main"，Bindable.ofInstance （this））；

•// Catcn

有关 Binder 的使用在此不深人研究，读者只需要知道⼀点：Binder 可以将

Environment 中的⼀些属性值映射到某个类的属性中（类似于在 Spring Boot 中学过的

下⾯就其中的重要环节⼀⼀拆解。


## 6.3 IOC 容器的创建与初始化|

@ConfigurationProperties 注解的作用）。从源码中可以看到它绑定的属性都是以

spring.main 开头的配置属性，⽽这部分属性刚好与 SpringApPlication 中的部分属性⼀

⼀对应，如代码清单6-27所示。

代码清单 6-27 以 spring.main 开头的属性与 SpringApplication 的属性⼀⼀对应

// application.properties

spring.main.lazy-initialization = true

public class SpringApplication ｛


private boolean lazyInitialization = false；

总结起来，bindToSpringApplication 方法实要做的事情，就是把 application.

Properties 中的属性赋值到 SpringApplication 对象中。


## 6.3 IOC容器的创建与初始化

经过6.2节中的⼏个关键步骤后，SpringApplication 的启动前置准备工作已经基本完

成，接下来要初始化的是 SpringApplication 内部的核心 IOC 容器，也就是

ApplicationContext 的具体实现。本节涉及 run 方法的代码⽚段如代码清单 6-28所示。

代码清单 6-28 SpringApplication#run ⽚段（2）

configureIgnoreBeanInfo （environment）；

// 打印 Banner

Banner printedBanner = printBanner （environment）；

// 创建空的 IOC 容器

context = createAppLicationContext（）：

context.setApplicationstartup （this.applicationstartup）；

1/ IOC 容器的初始化

prepareContext （bootstrapContext, context,environment,listeners, applicationArguments，

printedBanner）；

/刷新容器

refreshContext （context）；


## 6.3.1 打印 Banner

在深人 printBanner 方法之前，需要读者先明确 Banner 到底是什么。

提示：如果读者认为 Banner 只是打印到控制台/日志的那段内容，不妨继续往下阅读。当然如果

读者已经⾜够了解Banner的设计，那可以跳过本节。

1. Banner 的设计

在Spring Boot的内部，Banner被设计为⼀个接口，并且内置了⼀个枚举类型，代表Banner

输出的模式（关闭、控制台打印、日志输出），如代码清单6-29 所示。

I第6章 Spring Boot 准备容器与环境

代码清单 6-29Banner 是⼀个接口

public interface Banner｛

void printBanner （Environment environment,Class<?> sourceClass, PrintStream out）；

enum Mode ｛

OFF，

CONSOLE，

LOG

借助 IDE 可以发现Banner 的⼏个实现类，如图6-3所示。其中读者第⼀眼关注的肯定是

SpringBootBanner，其对应的源码如代码清单6-30所示。

［pub11c Interface Banner｛

Choose tmplementation of

Banners in SeringApplication8anerprinter （org.springframevork.boot）

Lmagebahner（Cra.sgraharrencwcrk.woo：

袋PrintedBanner in SpringApplicationBannerPrinter （org-springframework.boot）

wwKesourcebannertOre,sgranaTre路e207k.200

繳SpringBootBanner （org.springfranesork.boot）

图6-3 Banner 的实现类

1代码清单 6-30 SpringBootBanner 的设计

class SpringBootBanner implements Banner｛

private static final String［］ BANNER = ｛""， " -_"，

private static final String SPRING_BOOT = " ：：Spring Boot ：："；

Private static final int STRAP_LINE_SIZE = 42；

COverride

public void printBanner （Environment environment,Class<?> sourceClass，

上LLncotLeal prlntotreal）1

// 先打印 Banner 的内容

for （String line :BANNER）｛

printStream.println （1ine）；

// 打印 Spring Boot 的版本

string version = SpringBootVersion.getVersion （）；

version = （version ！= nu11）？ " （v" + version + "）"：""；

stringBuilder padding - new StringBuilder（）；

while（padding.length（）<STRAP_LINE_SIZE - （version.length（）+ SPRING_BOOT.length（）））｛

padding.append（""）；

printotream.printin （Ansioutput.totring （AnSiCOLOr.GKEEN, SEKLNG BUULI ANSICOLOL•DLEAULL

padding.tostring（），AnsiStyle.FAINT,version））；

printStream.println （）；

辑上不难理解。

Loader，

印过。


## 6.3 IOC.容器的创建与初始化|

从代码清单 6-30 中可以发现⼀些奇怪但又有些似曾相识的东西，⽽且常量名是

BANNER，不难猜测出它就是在默认情况下打印在控制台的⽂字 Banner。对应实现的

PrintBanner 方法，就是用输出对象打印定义好的 Banner 和 Spring Boot 的版本号，逻

有关Banner 的其他实现类，读者可以⾃⾏参考源码实现，这⾥不作为重点讲解。

2. printBanner

下⾯来看 printBanner 的具体实现逻辑。默认情况下 Banner 的输出模式是打印到控制

台，后续它会获取⼀个 Resourceloader，配合 SpringApplicationBannerPrinter 实

现Banner 的输出，如代码清单 6-31 所示。

代码清单6-31 打印 Banner 的底层逻辑

private Banner.Mode bannerMode = Banner.Mode.CONSOLE；

Private Banner printBanner （ConfigurableEnvironment environment）｛if（this.bannerMode == Banner.Mode.OFF）｛

return null：

// Banner ⽂件资源加载

ResourceLoader resourceloader =（this.resourceLoader ！= nu11）？ this.resourceloader

：new DefaultResourceLoader （getClassLoader （））；

1/ 使用 BannerPrinter 打印 Banner

SpringApplicationBannerPrinter bannerPrinter = new SpringApplicationBannerPrinter（resource

this.banner）；

if（this.bannerMode == Mode.LOG）｛

return bannerPrinter.print （environment,this.mainApplicationClass,logger）；

return bannerPrinter.print （environment,this.mainApPlicationClass,System.out）；

这⾥涉及的两个 API，读者可以简单了解。

（1） ResourceLoader

由类名不难理解，Resourceloader 是⼀个资源加载器，这个组件其实在第 3章中遇到

过。ApplicationContext 本身实现了 ResourcePatternResolver 接口，⽽

ResourcePatternResolver 的⽗接口就是 Resourceloader，所以 Application

Context 具备资源加载的能⼒。

默认情况下 SpringApplication 并没有预先设置的Resourceloader，所以最终它使

用的是默认实现 DefaultResourceloader，⽽默认实现中可以处理类路径、项目路径以及

特定路径（如以file：为前缀）下的资源。

（2） SpringApplicationBannerPrinter

ResourceLoader 的利用要配合 SpringApplicationBannerPrinter 才能达到

效果，SpringApplicationBannerPrinter 打印Banner 的逻辑本身不复杂，它会先

获取到 Banner，再调用其 printBanner 方法，最后附加⼀层封装代表 Banner 已经打

代码清单6-32 中展示了⼀个完成的banner 打印逻辑调用，因为 Spring Boot 本身⽀持⾃定

义的图⽚ banner 和⽂本 banner 两种方式，只要两者有其⼀，即可打印⾃定义的banner。我们以

|第6章 Spring Boot 准备容器与环境

⾃定义⽂本 banner 打印为例，可以看到最终加载⽂本 banner 的时候，会利用 Resourceloader

获取 banner.txt ⽂件（默认情况，也可以⾃⾏指定 banner ⽂件的路径）的内容后，封装

为 ResourceBanner 返回，完成后续打印动作。

代码清单 6-32 打印 Banner 的流程逻辑

Banner print （Environment environment,Class<?> sourceClass,PrintStream out）｛

Banner banner = getBanner （environment）；

banner.printBanner （environment,sourceClass,out）；

return new PrintedBanner （banner,sourceClass）；

private banner getbanner（tnvironment environment）｛

Banners banners = new Banners （）；

banners.addIfNotNu11 （getImageBanner （environment））；

banners.addIfNotNu11 （getTextBanner （environment））；

if （banners.hasAtLeastoneBanner（））｛

return banners；

if （this.fallbackBanner ！= nu11）｛

return this.fallbackBanner；

return DEFAULT_BANNER；

static final String BANNER_LOCATION_PROPERTY = "sPring.banner.location"；

static final String DEFAULT_BANNER_LOCATION = "baner.txt"；

private Banner getTextBanner（Environment environment）｛

string location = environment.getProperty（BANNER_LOCATION_PROPERTY，

DEFAULT_BANNER_LOCATION）；

Resource resource = this.resourceloader.getResource （location）；

if （resource.exists （））｛

return new ResourceBanner （resource）；

return null；


## 6.3.2 创建IOC容器

Banner 打印完毕后，下⼀步到了创建 Applicationcontext 的环节。第3章中读者

已经了解过 App1i.cationContext 在 Spring Boot 中的特殊扩展，在该环节也是根据 Web

类型区分创建不同的 ApplicationContext 落地实现类对象。创建的逻辑⾮常简单，如

代码清单 6-33所舌。

】代码清单 6-33 创建 IOC 容器的逻辑

Public static final String DEFAULT_CONTEXT_CLASS = "org.SPringframework.context.annotation.

AnnotationConfigApplicationContext"；

Public static final String DEEAULT_SERVIET_WEB_CONTEXT_CLASS = "org.springframework.boot.

web.servlet.context .AnnotationConfigServletWebServerApplicationContext"；

public static final String DEFAULT_REACTIVE_WEB_CONTEXT_CLASS = "org.springframework.

boot.web.reactive.context.AnnotationConfigReactiveWebServerApplicationContext"；

default：

default：


## 6.3 IOC 容器的创建与初始化|

protected ConfigurableApplicationContext createApplicationContext （）｛

1/ 先检查有没有显式指定 Applicationcontext 的实现类型

Class<?> contextClass = this.applicationcontextClass；

if （contextClass == nul1）｛

try｛

// 根据 web 应用类型决定实例化哪个 IOC容器

switch（this.webApplicationType）｛

case SERVLET：

contextClass = Class.forName （DEFAULT_SERVLET_NEB_CONTEXT_CIASS）；

break；

case REACTIVE：

contextClass - Class.forName （DEFAULT_REACTIVE_WEB_ CONTEXT_CLASS） ；

break；

contextClass = Class.forName （DEFAULT_CONTEXT_CLASS）；

｝1/ catch throw ex....

return （ConfigurableApplicationContext）BeanUtils.instantiateClass （contextClass）；

注意观察源码中的⼀个细节，创建的ApPlicationContext 类型均为注解驱动类型，⽽

注解驱动类型的 ApplicationContext 在⽗类 GenericApplicationContext 的构造方

法中，BeanFactory已经被创建出来了。

public GenericApplicationContext （）｛

this.beanFactory = new DefaultListableBeanFactory （）；

多说⼀句，该部分代码在 Spring Boot 2.4.0后被抽取出了⼀个全新的 APl:ApPlication

ContextFactory，它的实现更为简洁，但本质逻辑完全⼀致，如代码清单6-34所示。

1代码清单6-34 Spring Boot 2.4.0后的优化

Protected ConfigurableApplicationContext createApplicationContext （）｛

return this.applicationContextFactory.create （this.webApplicationType） ；

ConfigurableApplicationContext create（WebApplicationType webApplicationType）；

ApplicationContextFactory DEFAULT =（webApplicationType）-> ｛

try｛

switch（webApplicationType）｛

case SERVLET：

case REACTIVE：

return new AnnotationContigServletWebServerApplicationContext（）；

return new AnnotationConfigReactiveWebServerApplicationContext （）；

return new AnnotationConfigApplicationContext （）：

｝ 1/ catch throw ex •..

｝；

加载配置源，其间也穿插着⼀些事件⼴播的动作。下⾯拆解其中的⼏个核心步骤讲解。

|第6章 Spring Boot 准备容器与环境


## 6.3.3 初始化IOC容器

⼀个空的IOC容器创建完毕后，接下来是对容器进⾏必要的初始化处理，如代码清单6-35

所舌。PrepareContext 方法的源码逻辑较多，下⾯有针对性地研究其中的关键逻辑部分。

代码清单 6-35 初始化 IOC 容器的核心逻辑

Private void prepareContext （ConfigurableApplicationContext context，

ConfigurableEnvironment environment，

SpringApplicationRunListeners 1isteners，

ApplicationArguments applicationArguments, Banner printedBanner）｛

context.setEnvironment （environment）；

// IOC 容器的后置处理

PostrrocessAPPLLcationvontext（context）：

1/ 应用 ApplicationContextInitializer

applyInitializers （context）；

// 此处回调 SpringApplicationRunListeners 的 contextPrepared 方法

// 在创建和准备ApplicationContext 之后，但在加载之前触发

listeners.contextPrepared （context）；

if（this.logStartupInfo）｛

/1 打印当前应用激活的 profiles 信息

logStartupInfo（context.getParent （）== mul1）；

logStartupProfileInfo （context）；

ConfigurablelistableBeanFactory beanFactory = context.getBeanFactory（）；

// 将打印过的Banner 以及main 方法传入的启动参数封装组件，注册到IOC 容器中

beanFactory.registersingleton （"'springApplicationArguments"，applicationArguments）；

i£（printedBanner ！= null）｛

beanFactory.registersingleton（"springBootBanner"，printedBanner）；

（beanFactory instanceof DefaultListableBeanFactory）｛

（（DetauLtulstaolebeanractory） beanractory）

.setA110wBeanDefinitionoverriding（this.allowBeanDefinitionOverriding）；

if（this.lazyInitialization）｛

context.addBeanFactoryPostProcessOr （new LazyInitializationBeanFactoryPostProcessor （））：

// 获取配置源（主启动类）

Set<Object> sources = getAl1Sources （）；

Assert.notEmpty（sources， "Sources must not be empty"）；

// 加载配置源

load（context,sources.toArray （new Object ［0］））：

// 此处回调 SpringApplicationRunListeners 的 contextLoaded 方法

// ApplicationContext 已加载但在刷新之前触发

1isteners.contextLoaded （context）；

整体概括⼀下 prepareContext 方法的逻辑：⾸先 prepareContext 方法会利用预先

准备好的⼀些组件先初始化 IOC容器本⾝，之后再处理内部BeanFactory的⼀些逻辑，最后

1. IOC 容器的后置处理

对 ApplicationContext 的后置处理，其实就是在底层注册和设置⼀些组件，包括Bean

的名称⽣成器、资源加载器、类加载器和类型转换器，如代码清单6-36所舌。默认情况下，此

所示。


## 6.3 IOC 容器的创建与初始化|

处beanNameGenerator 与 resourceloader 都为nul1，只有 addConversionService

属性为 true，对应的逻辑是设置类型转换器。除此之外的逻辑均不会触发。

代码清单 6-36 IOC 容器的后置处理

public static final String CONFIGURATION_BEAN_NAME_GENERATOR =

"org.springframework.context.annotation.internalConfigurationBeanNameGenerator"；

protected void postProcessApplicationContext（ConfigurableApplicationContext context）｛

1/ 注册 Bean 的名称⽣成器

if（this.beanNameGenerator ！= null）｛

context.getBeanFactory（）.registersingleton（AnnotationConfigUtils.CONFIGURATION_BEAN

_NAME_GENERATOR,this.beanNameGenerator）；

// 设置资源加载器和类加载器

if （this.resourceloader ！= nu11）｛

if （context instanceof GenericApplicationContext）｛

（（GenericApplicationcontext）context）.setResourceloader （this.resourceloader）；

if （context instanceof DefaultResourceLoader）｛

（（DefaultResourceloader） context）.setClassLoader （this.resourceloader.getClassLoader（））；

// 设置类型转换器

if （this.addConversionService）｛

context .getBeanFactory（）.setConversionService （ApplicationConversionService

.getSharedInstance （））；

2. 应用 ApplicationContextlnitializer

在 6.1.2 节中准备好的 ApplicationContextInitializer 在此处终于得到了应用，

applyInitializers 方法会调用它的initialize 方法，对 ApplicationContext 进⾏

初始化操作，如代码清单 6-37所示。

代码清单 6-37 应用所有的 ApplicationContextInitializer

protected vold applyinltlallzers （ContigurableAppllcationcontext context）

for（ApplicationContextInitializer initializer : getInitializers（））｛

Class<?> requiredType = GenericrypeResolver.resolveTypeArgument（initializer.get

Class（），ApplicationContextInitializer.class）；

Assert.isInstanceOf （requiredType,context，"Unable to call initializer."）；

initializer.initialize（context）；

3. 获取配置源（主启动类）


## 6.1.5 节中提到，Spring Boot 2.x 引入了主配置类的概念。SpringApplication 中存储的

配置源分为两部分，正常情况下使用最常用的 SpringApplication.run 方法传入的主启

动类放在 primarySources 集合中，通过XML 或者包扫描的方式传入的配置源⼀般不用，

所以 getA11Sources 方法最终返回的就是主启动类对应的Class 类型，如代码清单6-38

了最值得关注的部分。

|第6章 Spring Boot 准备容器与环境

【代码清单6-38 获取所有的配置源

Public Set<Object> getA11Sources（）｛

Set<Object>al1Sources = new LinkedHashSet<>（）；

i （！CollectionUtils.isEmpty（this.primarySources））｛

al1Sources.addA11 （this.primarySources）；

if（！CollectionUtils.isEmpty （this.sources））｛

allSources.addA11 （this.sources）；

return CoLLections.unmooltlaoLeset （aLlsources）i

4. 加载配置源

获取配置源之后，下⼀步要先将这些配置源进⾏加载和解析。对应的1oad方法实现⽐较

复杂，为保证读者能对整体流程有⼀个把握，⽽不在细节处停留太久，代码清单6-39 中只展示

1代码清单 6-39 加载配置源的核心方法（节选）

protected void load（ApplicationContext context, Object ［］ sources）｛

BeanDefinitionLoader loader = createBeanDefinitionLoader（getBeanDefinitionRegistry

（contextr sourcesl：

// setter •..

loader.load（）：

对于抽取核心逻辑后的1oad 方法，不难看出其加载配置源的核心动作只有两步：创建⼀

个用于解析配置源的BeanDefinitionReader，然后加载和解析配置源。其中

createBeanDefinitionLoader 方法的底层会调用 BeanDefinitionLoader 的构造方

法，返回⼀个 BeanDefinition 的加载器。这个 BeanDefinitionLoader 的类结构⽐较值

得关注，如代码清单6-40所示。

代码清单6-40 BeanDefinitionLoader 的内部核心成员

class BeanDefinitionLoader ｛

private final Object ［］ sources；

private final AnnotatedBeanDefinitionReader annotatedReader：

private final xmlBeanDefinitionReader xmlReader；

private final ClassPathBeanDefinitionScanner scanner；

private BeanDefinitionReader groovyReader：

private Resourceloader resourceLoader；

由 BeanDefinitionLoader 的成员属性可以得知，BeanDefinitionLoader 内部组

合了⼏个与 BeanDefinition 相关的核心组件，包括 AnnotatedBeanDefinitionReader

（注解驱动的 BeanDefinition 解析器）、XmlBeanDefinitionReader（XML 定义的

BeanDefinition 解析器）、ClassPathBeanDefinitionscanner（类路径下的

BeanDefinition 包扫描器）。这种设计明显是外观模式的体现，即利用⼀个

BeanDefinitionLoader 充当统⼀人口，针对传入的配置源选择最合适的底层组件来进⾏实

际处理。

本章不作展开。


## 6.3 IOC 容器的创建与初始化|

具体从 BeanDefinitionLoader 的实现中可以看到，核心的1oad 方法会不断测试传入

的配置源类型，从⽽将配置源分配给合适的组件去处理。代码清单 6-41 中已经列出了不同的配

置源对应的组件，感兴趣的读者可以⾃⾏借助IDE 在源码中查看，这⾥不再展开解读。

代码清单6-41 load 方法分发不同类型的配置源给合适的组件处理

private int load （Object source）｛

Assert.notNu11（source，"Source must not be null"）；

// AnnotatedBeanDefinitionReader

if（source instanceof Class<?>）｛

return load （ （Class<?>） source）；

// XmlBeanDefinitionReader

i （source instanceof Resource）｛

return Load （（kesource） source）i

// ClassPathBeanDefinitionScanner

if （source instanceof Package）｛

return load （ （Package） source）；

// ClassPathBeanDefinitionScanner

if（source instanceof CharSequence）｛

return load （（CharSequence） source）；

thzow new I1legalArgumentException（"Invalid source type " + source.getClass（））；


## 6.3.4刷新IOC容器

初始化 ApPlicationContext 后，下⾯到了整个启动环节中最困难、最复杂的⼀步：10C

容器的刷新，如代码清单6-42所舌。由于该部分过于复杂，本书单独将其放到第7章详细讲解，

代码清单 6-42 刷新 IOC 容器的最终是调用 ApplicationContext 的 refresh 方法

private void refreshContext （ConfigurableApplicationContext context）｛

1/ 注册关闭时回调的钩子…….

refresh （ （Applicationcontext） context）；

otected void refresh （ConfigurableApplicationContext applicationContext

Dlicationcontext.refresh（


## 6.3.5 Spring Boot 2.4.x 的新特性

Spring Boot 版本升级到2.4.x后，底层的 Spring Framework 也升级到了 5.3.x，这⾥引人了

-些新的特性，读者可以简单了解。

1. ApplicationStartup

在创建好IOC 容器（createApplicationContext）之后初始化（prepareContext）

该指标可以准确地定位到应用启动的哪个环节耗时⻓，对分析慢启动问题⾮常有帮助。

@SpringBootApplication

请求访问/actuator/startup 接口，即可获得有关启动阶段的所有环节的耗时。



# 第6章 Spring Boot 准备容器与环境


## 第6章 Spring Boot 准备容器与环境

之前，有这样⼀⾏代码：

context.setApplicationstartup（this.applicationstartup）；// Applicationstartup.DEFAULT

这个 Applicationstartup 是什么？引入它可以解决什么问题呢？

（1）性能分析

在 Spring Boot 2.4（即 Spring Framework 5.3）之前，如果项目的启动速度很慢，是很难确

定启动慢的根本原因的。Spring Framework 开发团队考虑到性能分析和优化的需求，于是在Spring

Framework 5.3 中引入了⼀个性能指标统计工具，也就是这个启动度量 ApplicationStartup，

（2） ApplicationStartup 的使用

Spring Boot 考虑到 ApplicationStartup 在程序启动时的性能折损，默认情况下不会启

用该性能分析器。如果需要启用则需要⼿动在主启动类中声明，如代码清单6-43所舌。

代码清单 6-43 使用 ApplicationStartup 的方式

public class Spring BootQuickstartApplication ｛

public static void main （Stringl］ args） ｛

new SpringApplicationBuilder（SpringBootQuickstartApplication.class）

• aPPlicationStartup （new BufferingApplicationStartup （10000））

•run （args）；

如此设置之后，还需要引入Spring Boot 的监控依赖。

<dependency>

<groupId>org.springframework.boot</groupId>

<artifactId>spring-boot-starter-actuator</artifactId>

</dependency>

最后在 apPlication.properties 中配置暴鑫的监控端点，即可开启启动度量的信息

狭取接口。

management.endpoints.web.exposure.include=startup

准备工作完成后，即可启动 Spring Boot 应用。使用 Postman 等HTTP 客户端工具，以POST

下⾯的⼀次实际运⾏⽣成的⼏段 JSON：

//配置类解析阶段，共耗费 0.656s，解析104个类

"endTime"："2021-12-23T12:45:18.902z"，

"duration"： "Pr0.656S"，

"startTime"："2021-12-23T12:45:18.246Z"，

"startupstep"：｛

"name"： "spring.context.config-classes.parse"，

"id"：9，

"tags"：

"key"："classCount"，

通过这些指标就可以精准地定位到哪些环节耗时较⻓，从⽽采取合适的针对性⼿段优化应用。


## 6.3 IOC 容器的创建与初始化|

」.

］，

"parentId"：8

//He11oController 的创建，耗费 0.001s

"endTime"："2021-12-23T12:45:19.4282"，

"duration"： "Pr0.001s"，

"startrime"： "2021-12-23T12:45:19.4272"，

"startupstep"：｛

"name"："spring.beans.instantiate"，

"id"：98，

"tags"：［

"key"："beanName"，

"value"："helloController"

］，

"parentId"： 4

//整个 Bean 的后置处理阶段，共耗时 0.8233

"endTime"： "2021-12-23T12:45:19.0142"，

"duration"： "Pr0.823S"，

"startrime"： "2021-12-23T12:45:18.191Z"，

"startupStep"：｛

"name"："spring.context.beans.post-process"，

"id"：5，

"tags"：［，

"parentId"：4

2. BootstrapRegistry 的关闭

读者已经了解到BootstrapRegistry 与BootstrapContext 是 Spring Boot 2.4.x 新引

人的API，之前的部分只介绍了初始化和应用逻辑的调用，那么关闭⼜在何时触发？

答案是在ApplicationContext 的预初始化阶段。当 ApplicationContextInitializer

被应用并且 contextPrepared 事件触发（即 ApplicationContextInitializedEvent 事

件⼴播）后，BootstrapRegistry 关闭，如代码清单 6-44 所示。

代码清单 6-44 BootstrapContext 的关闭时机

Private void prepareContext （DefaultBootstrapContext bootstrapContext，

ConfigurableApplicationContext context，

ConfigurableEnvironment environment，

SpringApplicationRunListeners listeners，

ApplicationArguments applicationArguments, Banner printedBanner） ｛

context.setEnvironment （environment）；

postProcessApplicationContext （context）；

applyInitializers （context）；

回调运⾏器

本身没有对应的详细解释，甚⾄官方⽂档中也只是写明了如何使用，⽽没有解释设计这两个接

种不同的接口，⽽两种接口的设计⼜极其相似，因此不得不先全部收集，再分别调用，如代码

|第6章 Spring Boot 准备容器与环境

1isteners.contextPrepared （context）；

// 此处关闭

bootstrapContext.close （context）；

11….…..


## 6.4 IOC容器刷新后的回调

IOC 容器刷新完毕后仅剩余⼀些收尾工作，这部分的内容不多，对应 SpringApplication 的

run 方法中的源码如代码清单6-45所示。

代码清单6-45 SpringApplication#run ⽚段（3）

1...

afterRefresh （context, applicationArguments）；

stopWatch.stop （）；

1/ 打印启动耗时的日志

i£（this.logstartupInfo） 1

nev StartupInfologger（this.mainApplicationClass） .1ogStarted（getApPlicationlog （），

stopWatch）；

// 此处回调 springApplicationRunListeners 的 started 方法

// IOC 容器已刷新但未调用 CommandLineRunners 和 ApplicationRunners 时触发

listeners.started （context）；

// 回调所有的运⾏器

callRunners （context,applicationArguments）；

｝ 1/ catch⼴播Eailed事件

// 此处回调 SpringApplicationRunListeners 的 running 方法

// 在run 方法彻底完成之前触发

listeners.running （context）；

｝ // catch

可以看到 springApplicationRunListener 的所有方法均被调用（包括捕获异常后⼴播

failed 事件也在内）。除此之外，唯⼀值得关注的是 try-catch 块中的最后⼀⾏ cal1Runners 方法。

运⾏器是 Spring Boot 设计的用于应用完全启动后给开发者予以回调的两个扩展接口。它们

口的缘由，好在学习 Spring Boot时读者都知道如何使用。

观察ca1lRunners 方法的实现，可以发现这部分是以“妥协”的方式实现的，由于有两

清单6-46所示。

代码清单 6-46 分别回调 ApplicationRunner 和 CommandLineRunner

/1 从容器中获取所有的 ApplicationRunner 和 commandLineRunner

private void callRunners （App1icationContext context,ApplicationArguments args）｛

方法，全⾯剖析整个容器刷新的工作机制。


## 6.5 小结1

List<Object> runners = new ArrayList<>（）；

runners.addA11 （context.getBeansofType （ApP1icationRunner.class）.values（））：

runners.addA11 （context . getBeansofType （CommandL.ineRunner.class）.values（））；

AnnotationAwareordercomparator.sort （runners）；

/1依次回调

for （object runner :new LinkedHashSet>（runners））！

i£ （runner instanceof ApplicationRunner）1

callRunner （（ApPlicationRunner）runner,args）；

iE （runner instanceof CommandL.ineRunner）！

cal1Runner （（CommandLineRunner）zunner, args）：

｝

private void callRunner （ApPlicationRunner runner,ApPlicationArguments args）｛

try｛

（runner）.run（args）：｝1/ catch ...

private void callRunner （CommandLineRunner runner,ApplicationArguments args） ｛

try ｛

（runner）.run （args.getSourceArgs（））；

｝1/ catch ...

这⾥多解释⼀句，如果翻看这两个接口组件的⽂档注释中的 since，会发现⼀个没有标注，

另⼀个是 spring Boot1.3.0，说明它们都来⾃ Spring Boot1.x。它们本来是用于在特定

的时机（应用完全启动后）执⾏⼀些操作，奈何Spring Boot2.x 后扩展了事件，可以通过

监听 App1icationstartedEvent 来实现与这两个组件⼀样的效果。换句话说，这两个组件

已经被隐式“替代”，读者不必过多深究，平时在开发中还可以正常使用。

⾄此，⼀个完整的 Spring Boot 应用的启动流程完全结束，Spring Boot 应用启动成功。


## 6.5 小结

本章从 Spring Boot 主启动类的main 方法开始，逐步剖析、拆解 Spring Boot 的启动全流

程，并针对不同的Spring Boot 版本对⽐了解不同时期的不同设计。Spring Boot 的核心还是依赖

Spring Framework 的IOC 容器，即 APPlicationContext，⽽ApplicationContext 的真

正初始化是它的refresh刷新动作。第7章会针对 ApplicationContext 的核心 refresh

第

章

IOC 容器的刷新


本章主要内容：

© APPlicationContext 的容器刷新全流程机制解析；

© BeanDefinitionRegistryPostProcessor 与 BeanFactoryPostProcesSOr 的

加载机制；

© BeanPostProcesSOr、ApplicationListener 等核心组件的注册；

◎ ⼀个bean对象的完整创建与初始化流程。

通过第6章的内容，想必读者已经完整地了解⼀个 Spring Boot 应用的启动过程的原理。整

个过程中有⼀个关键步骤，其内部相当复杂⽽庞大，它就是IOC 容器初始化环节的刷新动作，

如代码清单7-1所示。

1代码清单 7-1 SpringApplication 中IOC 容器刷新的环节

context = createApplicationContext （）；

prepareContext （context,environment,1isteners,applicationArguments,printedBanner）；


## 11 刷新 ApplicationContext

refreshContext （context）；

afterRefresh （context,applicationArguments）：

这个 refreshContext 方法的核心会在底层调用 AbstractApplicationContext 的

refresh 方法，⽽refresh 方法的逻辑相当复杂，⼀共包含13步，如代码清单7-2所示。

1代码清单 7-2 AbstractApplicationContext 的 refresh 方法概览

Public void refresh （）throws BeansException,I1legalStateException ｛

synchronized （this.startupShutdownMonitor） ｛

// Prepare this context for refreshing.

// 1.初始化前的预处理

PrepareRefresh（）；

1/ Tell the subclass to refresh the internal bean factory•

// 2. 获取 BeanFactory，加载所有Bean 的定义信息（未实例化）

ConfigurablelistableBeanFactory beanFactory = obtainFreshBeanFactory （）；

// Prepare the bean factory for use in this context.


## 1 3. BeanFactory 的预处理配置

prepareBeanFactory （beanFactory）；

义的源码，本章中会尽可能地省略⽆关的日志打印、异常捕获的源码。

下⾯对方法逐个拆解、剖析。


## 7.1 初始化前的预处理I

try｛

1/ Allows post-processing of the bean factory in context subclasses.

// 4. 准备BeanFactory完成后进⾏的后置处理

postProcessBeanFactory （beanFactory）；

1/ Invoke factory processors registered as beans in the context.


## 11 5. 执⾏BeanFactory创建后的后置处理器

invokeBeanFactoryPost Processors （beanFactory）；

// Register bean Processors that intercept bean creation.


## 11 6. 注册 Bean 的后置处理器

registerBeanPostProcessors （beanFactory）；

/1 Initialize message source for this context.

1/ 7. 初始化 Messagesource

initMessageSource （）；

1/ Initialize event multicaster for this context.


## 11 8. 初始化事件⼴播器

initApplicationEventMulticaster （）；

1/ Initialize other special beans in specific context subclasses.

/1 9. 供子类扩展的模板方法 onRefresh

onRefresh （）；

/1 Check for listener beans and register them.

// 10. 注册监听器

registerListeners （）；

1/ ⾄此，BeanFactory 已创建并初始化完成


## 11 Instantiate all remaining （non-lazy-init）singletons

// 11. 初始化所有剩下的单实例bean 对象

finishBeanFactoryInitialization （beanFactory）；

1/ Last step: publish corresponding event.

// 12. 完成容器的创建工作

finishRefresh（）；

｝l catch......

finally｛

// Reset common introspection caches in Spring's core,since we

1/ might not ever need metadata for singleton beans anymore..

// 13. 清除缓存

resetCommonCaches （）；

本章会用⼀整章的内容，⼒求把 refresh 方法彻底讲明⽩。读者在学习IOC容器的⽣命

周期时，要注意先学习整体框架流程，再深入细节讨论，切勿本末倒置。

提示：本章涉及的源码⾮常多，源码中不乏有日志打印的内容，为了在有限的篇幅内展现更多有意

I第7章 IOC 容器的刷新


## 7.1 初始化前的预处理

初始化前的预处理如代码清单7-3所示。

代码清单7-3 prepareRefresh初始化前的预处理

protected void prepareRefresh（）｛

1/ 记录刷新动作执⾏的时间

this.startupDate = System.currentTimeMi11is（）；


## 11 标记当前 IOC 容器已激活

this.closed.set （false）；

this.active.set （true）；

/1 7.1.1 初始化属性配置

initPropertySources（）：

1/ 属性校验（通常⽆实际操作）

getEnvironment（）.validateRequiredProperties （）；

// 监听器的初始化（兼顾可以反复刷新的IOC容器）

if （this.earlyApplicationListeners == nul1）｛

this.earlyApplicationtisteners = new LinkedHashSet<>（this.applicationlisteners）；

｝ else｛

this.applicationlisteners.clear（）；

this.applicationListeners.addA11（this.earlyApplicationListeners）；

// 7.1.2 初始化早期事件的集合

this.earlyApplicationEvents = new LinkedHashSet<>（）；

整个 refresh 方法的第⼀步是在容器刷新核心动作开始前的⼀些预处理，粗略地来看，

prepareRefresh 方法中大多数的动作都是前置性的准备，有两个步骤⽐较关键。


## 7.1.1 初始化属性配置

初始化属性配置的方法如代码清单7-4所舌。

代码清单7-4 初始化属性配置的方法

protected void initPropertySources（）｛

//对于子类，默认情况下不执⾏任何操作

初始化 PropertySources 的动作是想预先初始化⼀些属性配置（properties）到IOC 容

器中（实际是存放到 Environment 中）。通过代码清单 7-4 可以明显地看出

initPropertySources 是⼀个模板方法，注释也说明了默认不会做任何事情，可以留给子

类重写。借助IDE 发现这个方法在基于 Web 环境的ApplicationContext 子类中进⾏了重

写，由于默认情况下引入 spring-boot-starter-web 依赖时创建的 IOC 容器实现是

AnnotationconfigServletWebServerApPlicationContext，⽽这个实现类继承⾃


## 7.1 初始化前的预处理！

GenericWebApplicationcontext，因此下⾯来看 GenericWebApplicationContext

的 initPropertySources 方法，如代码清单7-5所示。

1代码清单 7-5 GenericWebApplicationContext 初始化属性配置源

protected void initPropertySources （）｛

ConfigurableEnvironment env = getEnvironment （）；

if （env instanceof ConfigurableWebEnvironment）｛

（（ConfigurableWebEnvironment）env）.initPropertySources （this.servletContext,mul1）；

Pubblic void initPropertySources （@Nullable ServletContext servletContext，

@Nullable ServletConfig servletConfig）｛

webApPlicationContextUti1s.initServletPropertySources （getPropertySources（），

servletContext,servletConfig）；

可以发现，initPropertySources 方法希望获取⼀个 ConfigurablewebEnvi

ronment，并配置当前的 ServletContext。⽽ WebApplicationContextUtils 的静态

initServletPropertySources 方法中做的事情是将 ServletContext 以及 Servlet

Contig 当作⼀个属性配置源注入 Environment 中，如代码清单 7-6所舌。后续从 Envi

ronment 中获取属性时，不仅会加载 application.properties 等常规配置⽂件的内容，

还会加载 ServletContext 以及 ServletConfig 的初始化属性（init-param）。

代码清单 7-6 将 ServletContext 当作属性配置源注入 Environment 中

public static final String SERVLET_CONTEXT_PROPERTY_SOURCE_NAME = "serVletContext Init Params"；

public static final String SERVLET_CONFIG_PROPERTY_SOURCE_NAME = "servletConfigInitParams"；

public static void initServletPropertySources （MutablePropertySources sources，

@Nullable ServletContext servletContext， @Nullable ServletConfig servletConfig）｛

Assert.notNul1（sourceS， "'propertySources'must not be nul1"）；

String name = StandardServletEnvironment.SERVLET_CONTEXT_PROPERTY_SOURCE_NAME；

if （servletContext ！= nu11 && sources.contains （name）

&& sources.get （name）instanceof StubPropertySource）｛

sources .replace （name,new ServletContextPropertySource （name, servletContext））；

name = StandardServletEnvironment.SERVI.ET_CONFIG_PROPERTY_SOURCE_NAME；

if（servletConfig ！= null && sources.contains （name）

&& sources.get（name） instanceof StubPropertySource）｛

sources .replace （name,new ServletConfigPropertySource （name, servletConfig））；

public class ServletContextPropertySource extends EnumerablePropertySource<ServletContext>｛

Public ServletContextPropertySource （String name, ServletContext servletContext）｛

super （name,serVletContext）；

Public String getProperty（String name）｛

1/ 获取属性的源头是 ServletContext 的初始化参数

事件”的集合，那么早期事件又是什么？它解决了什么问题呢？

器都监听到⾃⼰本应该监听到的事件。

I第7章 IOC 容器的刷新

return this.source.getInitParameter （name）；

1….....

由代码清单7-6可以看出，initServletPropertySources 方法会将 Servlet

Context 与 ServletConfig 封装为⼀个 PropertySource，存人Environment 内置的聚

合对象 MutablePropertySources 中。每次从 Environment 中获取配置属性时，实际上

是从 MutablePropertySources 中取值，⽽MutablePropertySources 做的事情是遍历

⾃身聚合的所有 PropertySource 并尝试获取指定的配置属性，直到找到配置属性的值时返

回，或者找不到配置属性⽽返回nu11（或预先指定的默认值）。当 ServletContext 聚合到

MutablePropertySources 中后，就相当于 ServletContext 的初始化参数也成为“属性

配置源”的⼀部分。


## 7.1.2 初始化早期事件的集合

prepareRefresh 方法的最后⼀⾏代码是⼀个 earlyApplicationEvent 集合的初始

化动作，如代码清单7-7所示。从变量名上理解，earlyApplicationEvents 是⼀个“早期

代码清单 7-7earlyApplicationEvents 的初始化

Private Set<App1icationEvent> earlyApplicationEvents；

this.earlyApplicationEvents = new LinkedHashSet<>（）：

其实 earlyApplicationBvent 的设计目的是解决 Spring Framework 3.x 的⼀个场景

bug。如果⼀个类同时实现了 ApplicationEventPublisherAware 与 BeanPostProcessor

（或其他后置处理器接口），会因 BeanPostProcessor 的创建时机靠前（后⾯会讲到）⽽

导致提前回调 ApplicationEventPublisherAware 的 setter 方法，但是⼜因为此时

ApplicationEventMulticaster 还没有初始化，所以导致如果在此期间⼴播事件，则事件

暂时⽆法⼴播给监听器，监听器⽆法接收到事件，从⽽产⽣bug。earlyApplicationEvent

的设计是在所有 ApplicationListener 还没有创建之前把该阶段之前的事件都保存起来，

等到所有 ApplicationListener 都创建完成后再逐个⼴播，如此操作就可以确保所有监听


## 7.2 obtainFreshBeanFactory 初始化 BeanFactory

代码清单 7-8所示为初始化 BeanFactory 的代码。

【代码清单 7-8 初始化 BeanFactory

protected ConfigurableListableBeanFactory obtainFreshBeanFactory （）｛

1/ 刷新 BeanFactory

refreshBeanFactory （）；

return getBeanFactory （）；

单了解，对于方法内部的具体实现本书不再展开。


## 7.2 obtainFreshBeanFactory⼀—初始化 BeanFactoryl

public final ConfigurablelistableBeanFactory getBeanFactory（）｛

recuth caLs.oeantactory：

obtainFreshBeanFactory 方法的动作⾮常简单：先刷新 BeanFactory 再获取它。获

取的动作相当简单，该方法会返回当前 ApplicationContext 中内嵌的BeanFactory（即

DefaultListableBeanFactory）。本节主要探究 BeanFactory 是如何刷新的。


## 7.2.1 注解驱动的 refreshBeanFactory

refreshBeanFactory 方法本身是⼀个抽象方法，需要子类去实现：

Protected abstract void refreshBeanFactory（）throws BeansException,IllegalStateException；

对于 XML 配置⽂件驱动的IOC 容器和注解驱动的IOC 容器，它们分别有⼀个具体的

实现。借助 IDE 可以发现 GenericApplicationContext 和 AbstractRefreshable

ApplicationContext 分别重写了这个方法。默认引入 WebMvc 依赖时对应的 Annotation

ConfigServletWebServerApp1icationContext 继承⾃ GenericApplicationContext，

所以接下来先看它的具体方法实现，如代码清单7-9所舌。

代码清单 7-9 GenericApplicationContext 的 refreshBeanFactory 方法实现

protected final void refreshBeanFactory（）throws I1legalStateException｛

i （！this.refreshed.compareAndSet （false,true））｛

throw new I1legalstateException （"GenericApplicationContext does not support multiple

refresh attempts: just call 'refresh'once"）；

this.beanFactory.setSerializationId （getId （））；

通过代码清单 7-9可以发现方法逻辑很简单，仅仅是设置了BeanFactory的序列化ID ⽽已。


## 7.2.2 XMIL 驱动的 refreshBeanFactory

基于 XML 配置⽂件的IOC容器在这⼀步要做的事情更复杂，不过由于 Spring Boot 全系使

用注解驱动的 IOC 容器，因此读者对于这部分可以参照代码清单 7-10 的内容，配合注释作简

代码清单7-10 AbstractRefreshableApplicationContext 的refreshBeanFactory 方法实现

protected final void refreshBeanFactory（）throws BeansException ｛

if （hasBeanFactory（））｛

1/ 允许重复刷新的IOC 容器，内部的Bean 也是可以重新加载的


## 11 故此处有销毁 Bean 和关闭BeanFactory 的动作

destroyBeans （）；

closeBeanFactory （）；

try｛

1/ 创建 BeanFactory（会组合⽗BeanFactory 形成层级关系）

DefaultListableBeanFactory beanFactory = createBeanFactory （）；

beanFactory.setSerializationld（getId （））；

|第7章 IOC 容器的刷新

// ⾃定义配置 BeanFactory

customi zeBeanFactory （beanFactory）；

// 解析、加载 XML 中定义的BeanDefinition

loadBeanDefinitions （beanFactory）；

synchronized （this.beanFactoryMonitor） ｛

this.beanFactory = beanFactory；

1/ catch•


## 7.3 prepareBeanFactory-

BeanFactory 的预处理动作如代码清单7-11 所示。

-BeanFactory 的预处理动作

1代码清单7-11 BeanFactory 的预处理动作

Protected void prepareBeanFactory（ConfigurablelistableBeanFactory beanFactory）｛

1/ 设置 BeanFactory 的类加载器、表达式解析器等

beanFactory.setBeanClassLoader （getClassLoader （））；

beanFactory.setBeanExpressionResolver （new StandardBeanExpressionResolver （beanFactory.

getBeanClassloader （）））；

beanFactory.addPropertyEditorRegistrar（new ResourceEditorRegistrar（this, getEnvironment

（）））；

// 7.3.1 配置⼀个可回调注入 ApplicationContext 的 BeanPostProcessor

beanFactory.addBeanPostProcessor （new ApplicationContextAwareProcesSOr （this））；

beanFactory.ignoreDependencyInterface （EnvironmentAware.class）；

beanFactory.ignoreDependencyInterface （EmbeddedValueResolverAware.class）；

beanFactory.ignoreDependencyInterface （ResourceloaderAware.class）；

beanFactory.ignoreDependencyInterface （ApplicationEventPublisherAware.class）；

beanFactory.ignoreDependencyInterface （MessageSourceAware.class）；

beanFactory.ignoreDependencyInterface （ApplicationContextAware.class）；


## 11 7.3.2 ⾃动注入的⽀持

beanFactory.registerResolvableDependency（BeanFactory.class,beanFactory）；

beanFactory.registerResolvableDependency（ResourceLoader.class, this）；

beanFactory.registerResolvableDependency（ApplicationEventPublisher.class, this）；

beanFactory.registerResolvableDependency（ApplicationContext.class, this）；

// 7.3.3 配置⼀个可加载所有监听器的组件

beanFactory.addBeanPostProcesSOr （new ApplicationListenerDetector （this））；


## 11 LoadTimeWeaving 的⽀持

i£ （beanFactory.containsBean （LOAD_TIME_WEAVER_BEAN_NAME））｛

beanFactory.addBeanPostProcessor （new LoadTimeNeaverAwareProcessor （beanFactory））；

beanFactory.setTempClassloader （new ContextTypeMatchClassLoader （beanFactory.getBeanClass

Loader （）））；

1/ 向BeanFactory 中注册 Environment、系统配置属性、系统环境的信息

1/ Environment 本身对于 BeanFactory 来讲也是⼀个Bean

i£ （！beanFactory.containsLocalBean （ENVIRONMENT_BEAN_NAME））⼀

beanFactory.registerSingleton （ENVIRONMENT_BEAN_NAME, getEnvironment （））；


## 7

方法做的事情看上去很多，但仔细观察⼜不是很多？如果你也这样认为，说明你的感觉是对的。

看似很⻓的源码，只要做好分段和提取，prepareBeanFactory 方法就很容易理解。

解这两步。

prepareBeanFactory-

—BeanFactory 的预处理动作|

if（！beanFactory.containsLocalBean （SYSTEM_PROPERTIES_BEAN_NAME））｛

beanFactory.registerSingleton （SYSTEN_PROPERTIES_BEAN_NAME，

gettnvironent（.getoystelrropertLes（））

iE（！beanFactory.containsLocalBean （SYSTEM_ENVIRONMENT_BEAN_NAME））｛

beanFactory.registersingleton （SYSTEN_ENVIRONMENT_BEAN_NAME，

getEnvironment （）.getSystemEnvironment （））；

纵观 prepareBeanFactory 方法的逻辑，读者是否有⼀种感觉：prepareBeanFactory


## 7.3.1 ApplicationContextA wareProcessor

在设置了 BeanFactory 的类加载器等组件后，第⼀个关键动作是注册 Application

ContextAwareProcesSOr，并且让 BeanFactory 忽略⼏种依赖的接口。下⾯我们分别拆

1. ApplicationContextAwareProcessor 的作用

ApplicationContextAwareProcessOr 本身是⼀个 BeanPostProcesSOr，它的作

用是给需要注入 ApplicationContext 或其他相关的 bean 对象注入对应的组件。通过分析其

postProcessBeforeInitialization 方法可以快速理解它的作用，如代码清单7-12所示。

1代码清单 7-12 ApplicationContextAwareProcessor 的核心源码

Public Object postProcessBeforeInitialization （Object bean,String beanName）

throws BeansException｛

// 如果被处理的Bean 不是指定的Aware类型接口，则不予处理

if（！（bean instanceof EnvironmentAware

II bean instanceof EmbeddedValueResolverAware

I bean instanceof ResourceloaderAware

II bean instanceof ApplicationEventPublisherAware

⼀| beaninstanceof MessageSourceAware

II bean instanceof ApplicationContextAware））｛

return bean；

// 执⾏ Aware 接口的回调注入

invokeAwareInterfaces （bean）；

return bean；

Private void invokeAwareInterfaces （Object bean）｛

1/ 判断实现的接口，进⾏强转，调用其 setter 方法

if （bean instanceof EnvironmentAware）｛

（（EnvironmentAware） bean） . setEnvironment （this.applicationcontext.getEnvironment （））；

i£ （bean instanceof EmbeddedValueResolverAware）｛

（（EmbeddedValueResolverAware） bean）.setEmbeddedValueResolver （this.embeddedValue Resolver）；

时将不予注人。

【第7章 IOC 容器的刷新

if （bean instanceof ResourceLoaderAware）｛

（（ResourceLoaderAware）bean）.setResourceLoader（this.applicationContext）：

if （bean instanceof ApplicationEventPublisherAware） ｛

（（ApplicationEventPublisherAware） bean）.setApplicationEventPublisher（this.application

Context）；

if （bean instanceof MessageSourceAware）｛

（（MessageSourceAware） bean）.setMessageSource（this.applicationContext）；

if （bean instanceof ApPlicationContextAware）｛

（（ApplicationContextAware）bean）.setApplicationContext （this.applicationContext）；

postProcessBeforeInitialization 方法中会判断⼀个bean 对象的所属类是否实现

了指定的内置 Aware 系列接口。只要检测到 bean 对象所属类有⼀个 Aware 系列接口实现，

Appli cationcontextAwareProcessor 就会尝试将其强转为对应的Aware 接口，并调用

接口对应的 setter 方法完成 Aware 接口的回调注人。

提示：留意⼀点，由于 ApplicationContext 本身已经继承了 Resourceloader、

ApplicationEventPublisher 和MessageSource 接口，因此当注入这些⽗接口类型时，

本质上还是注入了 ApplicationContext 本身。

2. ignoreDependencyInterface 的作用

ApplicationContext 的内部既有BeanPostProcessor的增强设计，⼜有BeanFactory

负责⾃动依赖注人，这就意味着在 Aware 系列接口上必然会产⽣选择。Spring Framework 选择

使用 BeanPostProcessor 作为注入的逻辑，⽽放弃这些Aware 接口在 BeanFactory 中实

现的⾃动依赖注入。换句话说，当使用BeanFactory 的⾃动依赖注人，遇到 Aware 系列接口


## 7.3.2 ⾃动注人的⽀持

处理完Aware 类型的接口后，下⾯它向 BeanFactory中注册了⼏个接口与对象的对应关

系，如代码清单7-13所示。

代码清单 7-13 registerResolvableDependency 设置⾃动注入的⽀持

// ⾃动注入的⽀持

beanFactory.registerResolvableDependency （BeanFactorY.class,beanFactory）；

peantactory.registerkeso vaoLeDependency （kesourceuoader.CLass, CaLs）i

beanFactory.registerResolvableDependency （ApplicationEventPublisher.class， this）；

beanFactory.registerResolvableDependency （ApplicationContext.class, this）；

从方法名和传入参数的特性可以理解，registerResolvableDependency 方法的作用是使

BeanFactory遇到指定的类型需要注入时，直接使用指定的对象进⾏注入。方法的参数明显是⼀

对映射，BeanFactory的内部就应该有⼀个 Map 专⻔负责存储这些被指定的接口和对应实现类的

对象之间的映射关系，以备后续进⾏依赖注入时遇到这些类型就可以直接从 Map 中提取。


## 7.3 prepareBeanFactory—BeanFactory 的预处理动作|

进入 registerResolvableDependency 方法的内部，该方法由 BeanFactory 的最终

落地 DefaultListableBeanFactory 实现，如代码清单 7-14所示。ResolvableDepen

dencies 集合就是负责存储类型和对应实现类的集合，该集合主要记录⼀些特殊的bean 对象

类型（大多是 Spring Framework 内置的核心功能型 API）。

』代码清单7-14 注册类型与注入对象的映射关系

/**从依赖项类型映射到相应的⾃动装配值*/

private final Map<Class<?>，Object>resolvableDependencies = new ConcurrentHashMap<>（16）；

public void registerResolvableDependency （Class<?> dependencyType，

@Nullable Object autowired Value）｛

// validate

if （autowiredValue ！= mull） ｛

// validate

this.resolvableDependencies.put （dependencyType,autowiredValue）；


## 7.33 ApplicationListenerDetector

处理完依赖类型后，prepareBeanFactory方法最后会向BeanFactorY 中注册—-个后

置处理器 ApplicationlistenerDetector，之前的章节中没有接触过它，但从类名上可以

看出 ApplicationlistenerDetector 是⼀个检测 ApplicationListener 接口的组件，

借助 javadoc 可以获取⼀点信息。

BeanPostProcessorthat detects beans which implement the ApplicationListener interface. This

catches beans that can't reliably be detected by getBeanNamesFor Type and related operations which

only work against top-level beans.

ApplicationListenerDetector 是⼀个用于检测实现 ApplicationListener 类型

Bean 的后置处理器，它可以捕获 getBeanNamesForType 以及仅对顶级 Bean 有效的相关操

作⽆法可靠检测到的 Bean。

⽂档注释虽然不太容易理解，但基本信息已经清楚，ApplicationListenerDetector

负责的工作是在bean 对象的初始化阶段检测当前 bean 对象是否 ApplicationListener，

如果是则会进⾏⼀些额外的处理。对应的处理逻辑如代码清单 7-15所示。

代码清单 7-15 初始化回调时检测当前 bean 对象是否为 ApplicationListener

public Object postProcessAfterInitialization （Object bean,String beanName）｛

if（bean instanceof ApplicationListener）｛

Boolean flag = this.singletonNames .get （beanName）；

i （Boolean.TRUE.equals （flag））｛

this.applicationContext.addApplicationListener （（ApplicationListener<？>）bean）；

｝ else if （Boolean.FALSE.equals （flag））｛

1/ logger

this.singletonNames.remove （beanName）；

return bean：

单实例监听器应用到事件⼴播机制中，在监听器创建时注册到事件⼴播器，监听器销毁时从事

件⼴播器移除。



# 第7章 IOC容器的刷新


## 第7章 IOC容器的刷新

由代码清单 7-15的实现逻辑可以发现，ApplicationListenerDetector 会检查被后

置处理的bean 对象是否 ApplicationListener 类型，如果是并且当前 bean 对象同时是

⼀个单实例 bean 对象，则会加入 ApplicationContext 的监听器集合中（Application

Context 本身也是事件发布器，内部组合了事件⼴播器）。

另外，留意⼀个细节，ApplicationListenerDetector 直接实现的接口是

DestructionAwareBeanPostProcesSOr，说明它还有对bean 对象销毁阶段的处理。观察

对应实现的 postProcessBeforeDestruction 方法可以发现，ApplicationListener

Detector 会在bean 对象的销毁阶段将监听器类型的 bean 对象逐个从事件⼴播器中移除，如

代码清单 7-16 所舌。

代码清单7-16 监听器销毁时从事件⼴播器中移除

public void postProcessBeforeDestruction （Object bean，String beanName）

i （bean instanceof ApplicationListener）

try｛

ApplicationEventMulticaster multicaster = this.applicationContext.getApplication

EventMulticaster （）；

// 将监听器从事件⼴播器中移除

muLuicaster.removeAppLicationuistener（（AppLicationuisteners：>） Dean）：

multicaster.removeApplicationListenerBean （beanName）；

｝// catch ex ignore.....

简单总结，ApplicationListenerDetector 的核心作用是将IOC 容器中注册的所有


## 7.4 postProcess BeanFactory BeanFactory 的后置处理

在 AbstractApplicationContext 中，这个方法也是‘个模板方法，如代码清单7-17所示。

1代码清单 7-17 postProcessBeanFactory 默认是空实现

Protected void postProcessBeanFactory（ConfigurableListableBeanFactory beanFactory）｛

在默认整合 WebMvc 时，启用的 AnnotationConfigServletWebServer

Applicationcontext 中重写了 postProcessBeanFactory 方法并做了三件事情：回调⽗类

ServletWebServerApplicationContext 的postProcessBeanFactory方法；组件扫

描；注册解析⼿动传人的配置类。对应的实现如代码清单7-18所示。

】代码清单 7-18 AnnotationConfigServletWebServerApplicationContext 的后置处理

protected void postProcessBeanFactory（ConfigurablelistableBeanFactory beanFactory）｛

1/ 7.4.1 回调⽗类方法

super.postProcessBeanFactory （beanFactory）；

// 7.4.2 组件扫描

i（this.basePackages ！= null && this.basePackages.length >0） ｛


## 7.4 postProcessBeanFactory—BeanFactory 的后置处理|

this.scanner.scan （this.basePackages）；


## 11 7.4.2 解析配置类

if（！this.annotatedClasses.isEmpty （））｛

this.reader.register （ClassUtils.toClassArray （this.annotatedClasses））；


## 7.4.1 回调⽗类方法

第-步回调的⽗类是来⾃继承的 ServletWebServerApplicationcontext，它的 post

ProcessBeanFactory 方法中注册了⼀个后置处理器和⼀组基于Web 应用的作用域，如代码

清单7-19所舌。

【代码清单 7-19 ServletWebServerApplicationContext 的后置处理

protected void postProcessBeanFactory （ConfigurablelistableBeanFactory beanFactory） ｛

// 注册 ServletContext 回调注入器

beanFactory.addBeanPostProcessor（new WebApplicationContextServletContextAwareProcessor

（this））；

beanFactory.ignoreDependencyInterface （ServletContextAware.class）；

// 注册web 相关的作用域

registerWebApplicationscopes （）；

1. ServletContextAwareProcessor

即便读者不看 ServletContextAwareProcessor 的源码，仅通过类名和它下⾯的

ignoreDependencyInterface 操作也能推测出来，它的作用类似于 Application

ContextAwareProcesSOr，通过配合 ServletContextAware 接口可以实现 Aware 系列

接口的回调注人功能。事实上ServletContextAwareProcessor 的确负责这部分工作，只

不过逻辑都在其⽗类 ServletContextAwareProcessor 中，透过源码可以很清楚地看到类

似于 ApplicationContextAwareProcessor 的实现逻辑，如代码清单7-20所示。

代码清单 7-20 ServletContextAwareProcessor 的核心回调注入功能

1/ ⽗类 ServletContextAwareProcessor

PuoLic Oo］ect postrrocessberoreLnitlalization （0bect pean, string beanName）

throws BeansException ｛

if（getServletContext（）！= null && bean instanceof ServletContextAware）｛

（（vervletcontextAware） bean.setservLetcontext（getservLetcontext（）；

if （getServletConfig（）！= null && bean instanceof ServletConfigAware）｛

（（ServletConfigAware） bean）.setServletConfig （getServletConfig （））；

return bean：

2. 注册 Web 应用的作用域

注册 Web 类型的作用域实际上是让 Applicationcontext 认识读者熟悉的 request、

session、application 等Web 应用才会涉及的作用域，⽽让 ApPlicationcontext 认

｝



# 第7章 IOC 容器的刷新


## 第7章 IOC 容器的刷新

识的方式是，在registerWebApPlicationScopes 方法中将这些作用域注册到IOC容器中。

不过源码的设计可能跟读者预想的不太⼀样，如代码清单7-21 所示（这部分需要详细研究⼀下）。

1代码清单 7-21 注册 Web 应用的作用域

Private void registerWebApplicationScopes（）｛

ExistingWebApplicationScopes existingScopes = new ExistingWebpplicationScopes （getBean

Factory （））；

WebApplicationContextUti1s.registerwebApplicationScopes （getBeanFactory（））；

existingScopes.restore （）：

registerWebApplicationScopes 方法中涉及⼀个很奇怪的 API:Existingweb

Applicationscopes，由类名直译“已存在的作用域”，这个设计可能与读者目前掌握的

知识有冲突：Spring Boot 应用刚开始初始化的IOC容器何来“已存在的作用域”呢？带着这个

问题，请读者深入ExistingWebApp1icationScopes 的源码中尝试寻求⼀些思路，如代码

清单7-22所示。

1代码清单 7-22 ExistingWebApplicationScopes 的结构

public static class ExistingwebApplicationScopes ｛

private static final Set<String> SCOPES；

static

1/ 预初始化了两个内置⽀持的作用域 REQUEST 和 SESSION

Set<String> scopes = new LinkedHashSet<>（）；

scopes.add （WebApPlicationContext .SCOPE_REQUEST）；

scopes.add （WebApP1icationContext .SCOPE_SESSION）；

SCOPES = Collections.unmodifiableset （scopes）；

private final ConfigurablelistableBeanFactory beanFactoryi

private final Map<String, Scope> scopes = new HashMap<>（）；

public ExistingwebApplicationScopes （ConfigurablelistableBeanFactory beanFactory）｛

this.beanFactory = beanFactoryi

Eor （String scopeName :SCOPES）｛

// 创建对象时，从BeanFactory 中检查是否有已经定义过的默认作用域

scope scope = beanFactory.getRegisteredScope （scopeName）；

if （scope ！= nu11）｛

this.scopes.put （scopeName,scope）；

Public void restore（）｛

// 如果前期已经定义了内置作用域，则此处重新注册

this.scopes.forEach（（key,value）-> ｛

this.beanFactory.registerscope （key, value）；

｝）；

但是请读者思考，如果从构造方法中真的提取到了不为空的值，说明什么？说明项目中提前注


## 7.4 postProcessBeanFactory—BeanFactory 的后置处理|

下⾯结合代码清单 7-22 中简要标注的注释解释 ExistingWebApplicationScopes 的

作用。ExistingwebApplicationScopes 在创建完成时会检查 BeanFactory 中是否已经

注册过 request 和 session 的作用域。由于默认情况下项目代码中不会重新定义这两种Web 应用

中的默认作用域，因此在 ExistingwebApplicationScopes 的构造方法中不会提取到值。

册过 request 或者 session 的作用域。换句话说，如果提取到不为空的作用域值，说明项目中需

要重写 WebMvc 中默认的 request 或者 session 作用域的策略。ExistingwebApP

1icationScopes 的设计相当于给开发者提供了重写默认作用域的机会，其构造方法中从

BeanFactory 中提取的动作相当于暂存了项目中⾃定义重写的作用域策略（不然后续执⾏

WebApplicationContextUtils.registerWebApplicationScopes 时会覆盖⾃定义

的作用域策略），等默认的 request 和 session 作用域注册完毕后，再提取出暂存的⾃定义作用域

策略，并重新注册到 BeanFactory 中（即覆盖默认的作用域策略），以此过程就可以实现默认

Web 作用域的重写。

除这个特殊的设计之外，默认的 web 应用作用域注册是在 WebApplicationContext

Utils.registerWebApplicationScopes 静态方法中实现，对应的实现逻辑如代码清单

7-23 所示。registerWebApplicationScopes 方法前两⾏的注册 Web 类型作用域部分有⼀

个细节需要注意，默认情况下 ServletWebServerApplicationContext 不会注册

application 作用域，出现这种设计的原因是考虑到 Spring Boot 应用以独⽴jar 包运⾏时，嵌人

式 Web 容器还没有初始化，Servletcontext 也尚未创建，所以这⾥⽆法获取到，也就不会

注册 application 作用域。

】代码清单 7-23 注册默认 Web 应用作用域

public static void registerWebApPlicationScopes （ConfigurableListableBeanFactory beanFactory） ｛

registerWebApPlicationscopes （beanFactory, nu11）；

public static void registerWebApplicationScopes （ConfigurablelistableBeanFactory beanFactory，

@Nullable ServletContext sc）｛

// 注册默认的作用域策略

beanFactory.registerscope （WebApPlicationContext.SCOPE_REQUEST,new RequestScope （））；

beanFactory.registerScope （WebApP1icationContext.SCOPE_SESSION,new SessionScope （））；

// 默认情况下 application 作用域不会注册

iE （sC！= nul1）｛

ServletContextScope appScope = new ServletContextScope （sc）；

beanFactory.registerScope（WebApplicationContext.SCOPE_APPLICATION,appScope）；

sc.setAttribute （ServletContextScope.class.getName （），appScope）；

// 依赖注入的⽀持

beanFactory.registerResolvableDependency （ServletRequest .class,new RequestObjectFactory （））；

beanFactory.registerResolvable Dependency （ServletResponse.class, new ResponseObjectFactory （））：

beanFactory.registerResolvableDependency （HttpSession.class, new SessionObjectFactory （））；

beanFactory.registerResolvableDependency （WebRequest.class, new WebRequestObjectFactory （））；


## 1 jsf

的两个步骤实质上是这两个集成的组件在工作。

的执⾏。

大，它的源码⾮常⻓，为了便于读者阅读，本节会将这部分源码尽可能地拆解开来。

【第7章IOC容器的刷新


## 7.4.2 组件扫描&解析⼿动传入的配置类

回调⽗类 ServletWebServerApplicationContext 的方法后，接下来 Annotation

ConfigServletWebServerApplicationcontext 要处理编程式指定的组件扫描。由于

IOC容器的内部已经集成了注解类解析器和组件包扫描器，如代码清单7-24所示，因此接下来

1代码清单7-24 AnnotationConfigServletWebServerApplicationContext 集成了两个组件

public class AnnotationConfigServletWebServerApplicationContext

extends ServletWebServerApplicationContext

implements AnnotationConfigRegistry ｛

private final AnnotatedBeanDefinitionReader reader：

private final ClassPathBeanDefinitionScanner scanner；

默认情况下 AnnotationConfigServletWebServerApplicationContext 中

basePackages 属性的值为空，在项目开发中⼏乎不会直接获取到IOC容器的落地实现类进

⾏操作（通常只能获取到 ConfigurableApplicationContext，⽽其中没有 scan 和 reg

ister 方法），所以对于这部分读者可以忽略。


## 7.5 invokeBeanFactoryPostProcessors 执⾏ BeanFactoryPost

Processor

BeanFactory的内部编程式后置处理完成后，接下来进人IOC容器刷新的第⼀个超级复

杂的重难点：BeanFactoryPostProcessor 和 BeanDefinitionRegistryPostProcesSOr

invokeBeanFactoryPostProcessors 方法的实现看上去⾮常简单，核心动作只有⼀

⾏代码，如代码清单7-25所舌。

1代码清单 7-25 转调 invokeBeanFactoryPostProcessors 静态方法

protected void invokeBeanFactoryPostProcessors （ConfigurableListableBeanFactory beanFactory）｛

// 执⾏ BeanFactory 的后置处理器

PostProcessorRegistrationDelegate.invokeBeanFactoryPostProcessors （beanFactory，

getBeanFactoryPostProcessors （））；

// AOP 的⽀持…

注意 invokeBeanFactoryPostProcessors 静态方法的第⼆个参数中当前阶段现有的

BeanFactoryPostProcessor 传入（注意这组 BeanFactoryPostProcessor 不是通过

@Bean 或者@Component 注解注册的，⽽是通过 ConfigurableApplicationContext 的

addBeanFactoryPostProcessor 方法编程式⼿动注册），⽽调用的 PostProcessor

RegistrationDelegate 中的invokeBeanFactoryPostProcessors 静态方法难度⾮常

invokeBeanFactoryPostProcessors-


## 7.5

BeanDefinitionRegistry

通，其优先级依次降低。


## 7.5 -执⾏ BeanFactoryPost Processor|


## 7.5.1 现有的后置处理器分类

invokeBeanFactoryPostProcessors 方法会⾸先检查当前 BeanFactory 是否同时

是⼀个 BeanDefinitionRegistry。由于目前的 BeanFactory 落地实现只有⼀个 Default

ListableBeanFactorY，因此该逻辑判断必定为 true。判断完成后的if结构中需要对方法参

数中传入的beanFactoryPostProcessors 集合元素进⾏类型分离，并最终分离出两个集合

registryProcessors 和 regularPostProcessOrS，分别对应存放编程式传人的 Bean

DefinitionRegistryPostProcessor 和 BeanFactoryPostProcesSOr，如代码清

单 7-26所示。其中 BeanDefinitionRegistryPostProcesSor 的 postProcessBean

DefinitionRegistry 方法会⽴即执⾏（由此也可以了解到，通过编程式注册的 Bean

DefinitionRegistryPostProcesSOr，其执⾏优先级是最⾼的）。

代码清单 7-26 invokeBeanFactoryPostProcessors （1）

Public static void invokeBeanFactoryPostProcessors （ConfigurablelistableBeanFactory beanFactory，

List<BeanFactoryPostProcessor> bean FactoryPostProcessors）｛

Set<String> processedBeans = new HashSet<>（）：

i£（beanFactory instanceof BeanDefinitionRegistry）｛

BeanDefinitionRegistry registry =（BeanDefinitionRegistry） beanFactory；

List<BeanFactoryPostProcessor> regularPostProcessors = new ArrayList<>（）；

List<BeanDefinitionRegistryPostProcessor> registryProcessors = new ArrayList<>（）；

// 该部分会将方法参数中传入的 BeanFactoryPostProcessor 分离开

for（BeanFactoryPostProcessor postProcessor: beanFactoryPostProcessorS）｛

if （postProcesSor instanceof BeanDefinitionRegistryPostProcesSOr） ｛

beanperinitlonkegistryrostrrocessor registrYrrocessor =

（beanlerinitlonkegistrYrostrrocessor） Postrrocessor：

registryProcessor.postProcessBeanDefinitionRegistry（registry）；

registryProcessors.add （registryProcesSOr）；

Else｛

reguLarrostrLocessors.aod （postrrocessori

执⾏最⾼优先级的 BeanDefinitionRegistryPostProcessor

处理好编程式注入的后置处理器后，下⾯要处理 IOC 容器中已有的后置处理器。由于

BeanDefinitionRegistryPostProcessor 的执⾏优先级较 BeanFactoryPostProcessor

靠前，因此BeanDefinitionRegistryPostProcessor 先执⾏，⽽每种后置处理器（包括

BeanPostProcessor、BeanFactoryPostProcessor、

PostProcesSor） 都有三种不同类型的优先级，分别是 Priorityordered、Ordered 和普

具体到某⼀个优先级的后置处理器回调逻辑，⾸先会从 BeanFactory 中提取出所有Bean

所有执⾏过的后置处理器全部保存下来，这样做的原因下⾯⻢上就会看到。

执⾏其他 BeanDefinitionRegistryPostProcessor

方法。

|第7章 IOC容器的刷新

DefinitionRegistryPostProcessOr，并检查这些后置处理器是否实现了 Priority

Ordered 接口，如果实现了则创建这些后置处理器，并在排序完成后按序依次调用。依照

Priorityordered 接口中的getOrder 方法的返回值进⾏排序，返回值越小则排序越靠前，

如代码清单7-27 所示。

除了主⼲动作，请读者留意⼀个小动作：processedBeans.add （ppName）；，这⾥会将

代码清单 7-27 invokeBeanFactoryPostProcessors （2）

List<BeanDefinitionRegistryPostProcessor>currentRegistryProcessors = new ArrayList<>（）；

// ⾸先，执⾏实现了 Priorityordered 接口的 BeanDefinitionRegistryPostProcessors

Stringl］ postProcessorNames = beanFactory

•getBeanNamesForType（BeanDefinitionRegistryPostProcessor.class, true,false）；

for（String ppName :postProcessorNames）｛

（beanFactory.isTypeMatch （ppame,Priorityordered.class））｛

currentRegistryProcessors.add （beanFactory.getBean（ppName，

BeanDefinitionRegistryPostProcessor.class））；

processedBeans.add （ppName）；

sortrostErocessors （currentkeglstrYrrocessors, DeanractorY）

registryProcessors.addA11 （currentRegistryProcesSOrS）；

invokeBeanDefinitionRegistryPostProcessors（currentRegistryProcessors,registry）；

currentRegistryProcessors.clear（）；

11.

②提示：在本环节中有⼀个内置的极其重要的、执⾏时机最靠前的后置处理器 Configuration

ClassPostProcesSOr，在7.5.7 节会单独研究它的作用。


## 7.5

执⾏完最⾼优先级的 BeanDefinitionRegistryPostProcesSOr 后，接下来要执⾏的

是实现了 Ordered 接口的后置处理器，执⾏的逻辑与前⼀阶段完全⼀致，如代码清单7-28所

示。注意，代码清单 7-28 的后半部分执⾏其余普通的 BeanDefinitionRegistry

PostProcessor 时有⼀个循环的动作，为什么会出现这种设计呢？请读者回想⼀下，

BeanDefinitionRegistryPostProcessor 的核心功能是向 BeanDefinition

Registry 中注册新的BeanDefinition，如果注册的新 BeanDefinition 对应的刚好也是

BeanDefinitionRegistryPostProcessOr，则该后置处理器也应该参与到当前步骤的执

⾏过程中。因此，此处循环的作用是穷尽当前项目中会注册的所有 BeanDefinition

RegistryPostProcesSOr，并执⾏它们的 postProcessBeanDefinitionRegistry

另外，注意观察 processedBeans 集合的使用，因为 BeanDefinitionRegistryPost

Processor 的postProcessBeanDefinitionRegistry 方法只能执⾏⼀次，⽽之前执⾏

过的后置处理器后续允许重复执⾏，所以 processedBeans 集合起到了防重复执⾏的作用。

currentRegistryProcessors.add （beanFactory

也在该阶段触发执⾏，下⾯会讲到）。


## 7.5 invokeBeanFactoryPostProcessors—执⾏ BeanFactoryPost Processor /

1代码清单 7-28 invokeBeanFactoryPostProcessors （3）

1....

// 接下来执⾏实现了 Ordered 接口的BeanDefinitionRegistryPostProcessors

postProcessorNames = beanFactory

•getBeanNamesForType （BeanDefinitionRegistryPostProcessor.class, true, false）；

for （String PpName :postProcesSOrNames）｛

i（！processedBeans.contains （PpName）&& beanFactory.isTypeMatch （ppName,Ordered.class））｛

currentRegistryProcessors.add（beanFactory

•getBean （PpName,BeanDefinitionRegistryPostProcessor.class））；

processedBeans .add （ppName）；

sortPostProcessors （currentRegistryProcessors, beanFactory）；

registryProcessors.addA11 （currentRegistryProcessors）；

invokeBeanDefinitionRegistryPostProcessors （currentRegistryProcessors, registry）；

currentRegistryProcessors.clear （）；

// 最后执⾏所有其他BeanDefinitionRegistryPostProcessor

boolean relterate = Cruei

while （reiterate）｛ // 注意此处有⼀个循环动作

reiterate = false；

postProcessorNames = beanFactory

•getBeanNamesForType （BeanDefinitionRegistryPostProcessor.class,true，false）；

for （String PpName :postProcesSOrNames）｛

if （！processedBeans.contains （ppName））｛

• getBean （PpName,BeanDefinitionRegistryPostProcessor.class））；

ProcessedBeans.add（PpName）；

reiterate = true；

sortPostProcessors （currentRegistryProcessors,beanFactory）；

registryProcessors.addA11 （currentRegistryProcessors）；

invokeBeanDefinitionRegistryPostProcessors （currentRegistryProcessors,registry）；

currentRegistryProcessors.clear（）；

代码清单7-28 的逻辑执⾏完毕后，原则上BeanDefinitionRegistry 中的BeanDefinition

已经全部注册完毕，不会再有新的 BeanDefinition 注册（ImportBeanDefinitionRegistrar


## 7.5.4 回调 postProcessBeanFactory 方法

所有 BeanDefinitionRegistryPostProcessor 的 postProcessBeanDefinition

Registry 方法执⾏完毕后，还需要回调它们的postProcessBeanFactory 方法（不要忘记

BeanDefinitionRegistryPostProcessor 本身继承⾃ BeanFactoryPostProcessor），

如代码清单7-29所示。这部分依然按照 Prorityordered、Ordered 接口的优先级顺序区分


## 7.5


## 7.5

|第7章 IOC 容器的刷新

（记录到 registryProcessors 集合时已经包含了排序），⽽且依然是 BeanDefinition

RegistryPostProcessor 的执⾏优先级⽐ BeanFactoryPostProcessor ⾼。

代码清单 7-29 invokeBeanFactoryPostProcessors （4）

1/

1/ 先回调 BeanDefinitionRegistryPostProcessor 的postProcessBeanFactory 方法

invokeBeanFactoryPostProcessors （registryProcessors,beanFactory）；

// 再调用编程式注入的BeanFactoryPostProcessor

invokeBeanFactoryPostProcessors （regularPostProcessors,beanFactory）；

// 如果 BeanFactory 没有实现BeanDefinitionRegistry 接口，则进入下⾯的流程

else｛

// 仅调用编程式注册的 BeanFactoryPostProcessor

invokeBeanFactoryPostProcessors （beanFactoryPostProcessors,beanFactory）；

BeanFactoryPostProcessor 的分类

执⾏完所有 BeanDefinitionRegistryPostProcessor 之后，接下来轮到所有的普通

BeanFactoryPostProcessor 了。⾸先它也是把所有的 BeanFactoryPostProcessor

根据是否实现了 Priorityordered、Ordered 接口进⾏优先级的区分，最终分离出三个集

合，如代码清单 7-30所示。

代码清单 7-30 invokeBeanFactoryPostProcessors （5）

1…....

1/下⾯的部分是回调 BeanFactoryPostProcessor，思路与上⾯的⼏乎⼀样

String［］ postProcessorNames =

beanFactory.getBeanNamesForType （BeanFactoryPostProcessor.class, true, false）；

List<BeanFactoryPostProcessor> priorityorderedPostProcessors = new ArrayList<>（）；

List<String> orderedPostProcessorNames = new ArrayList<>（）；

List<String> nonorderedPostProcesSOrNames = new ArrayList<>（）；

for （String PpName :postProcessorNames）｛

if （ProcessedBeans.contains （PPName））｛


## 11 skip - already processed in first phase above

｝ else if （beanFactory.isTypeMatch （ppName,PriorityOrdered.class））｛

priorityorderedPostProcessors.add （beanFactory

•getBean （PpName,BeanFactoryPostProcessor.class））；

｝ else if （beanFactory.isTypeMatch（PpName,Ordered.class））｛

orderedPostProcessorNames.add（ppName）；

else。

nonOrderedPostProcessorNames.add（ppName）；

执⾏ BeanFactoryPostProcessor

分离好三个集合后，后续的动作依然是按照既定的顺序逐个执⾏，如代码清单 7-31所示。逻

辑上与BeanDefinitionRegistryPostProcessor 的执⾏机制⼀致，都是先排序后执⾏。

orderedPostProcessors.add （beanFactory

⾄此，整个后置处理器的执⾏流程全部结束，整体流程总结如下。

方法。


## 7.5 invokeBeanFactoryPostProcessors—执⾏ BeanFactoryPost Processor|

代码清单 7-31 invokeBeanFactoryPostProcessors （6）

人…....

1/ ⾸先，执⾏实现 Priorityordered接口的BeanFactoryPostProcessor

sortPostProcessors（priorityOrderedPostProcessors,beanFactory）；

invokeBeanFactoryPostProcessors （priorityorderedPostProcessors,beanFactory）：

// 然后，执⾏实现 Ordered 接口的 BeanFactoryPostProceSSor

List<BeanFactoryPostProcessor> orderedPostProcessors = new ArrayList<>（）；

for （String postProcessorName :orderedPostProcesSorNames）｛

• getBean （PostProcessorName,BeanFactoryPostProcessor.class））；

sortPostProcessors （orderedPostProcessors,beanFactory）；

invokeBeanFactoryPostProcessors （orderedPostProcessors,beanFactory）；

// 最后，执⾏普通的 BeanFactoryPostProcessor

List<BeanFactoryPostProcessor> nonOrderedPostProcessors = new ArrayList<>（）；

for（String postProcessorName :nonOrderedPostProcessOrNames）｛

nonorderedPostProcessors.add （beanFactory

.getBean （postProcesSOrName,BeanFactoryPostProcessor.class））；

invokeBeanFactoryPostProcessors （nonOrderedPostProcessors,beanFactory）；

// 清理缓存

beanFactory.clearMetadataCache （）；

注意⼀点，因为BeanFactoryPostProcesSOr 原则上只有对 BeanDefinition 的修改、移

除能⼒，不会再注册新的 BeanDefinition，所以这⾥不再需要循环执⾏。也正是因这个机制，

提醒读者最好不要在 BeanFactoryPostProcesSOr 的执⾏期间注册新的BeanDefinition，否

则会因为没有穷尽加载的逻辑，导致注册的 BeanFactoryPostProcessor 不能⽣效。

1. 回调编程式注人的BeanDefinitionRegistryPostProcesSOr。

2. 回调实现 Priorityordered 接口的 BeanDefinitionRegistryPostProcesSOr。

3. 回调实现 Ordered 接口的 BeanDefinitionRegistryPostProcessor。

4. 回调普通的 BeanDefinitionRegistryPostProcesSOr。

5. 回调 BeanDefinitionRegistryPostProcesSOr 的 postProcessBeanFactory

6. 回调编程式注入的 BeanFactoryPostProcesSOr。

7. 回调实现 PriorityOrdered 接口的 BeanFactoryPostProcesSOr。

8. 回调实现 Ordered 接口的 BeanFactoryPostProcessOr。

9. 回调普通的 BeanFactoryPostProcessOr。


## 7.5.7 重要的后置处理器：ConfigurationClassPostProcessor

在后置处理器执⾏的阶段中有⼀个极其重要的内置的 BeanDefinitionRegistryPost

ProcesSOr: ConfigurationClassPostProcessOr。它的核心作用是解析、处理所有被

会注册⽣效。

细展开讲解。

1第7章 IOC 容器的刷新

@Configuration 标注的配置类，并向 BeanDefinitionRegistry 中注册新的 Bean

Definition。这个后置处理器在注解驱动的IOC容器中默认⽣效，在基于 XML 配置⽂件的

IOC 容器中，只要配置⽂件声明<context:annotation-config/>标签，该后置处理器就

ConfigurationClassPostProcessor 的核心功能是解析注解配置类并注册 Bean

Definition，下⾯直接切入它的 postProcessBeanDefinitionRegistry 方法中⼀探究

竟，如代码清单 7-32所示。

代码清单 7-32 ConfigurationClassPostProcessor 的核心后置处理方法（节选）

public void postProcessBeanDefinitionRegistry （BeanDefinitionRegistry registry） ｛

int registryld = System.identityHashCode （registry）；

/check throw ex......

this.registriesPostProcessed.add （registryId）；

//【解析配置类】

processConfigBeanDefinitions （registry）；

由代码清单7-31可以发现，PostProcesSBeanDefinitionRegistry 方法的最后⼀⾏

就是解析注解配置类中的 Bean 定义信息，并封装⼒ BeanDefinition。由于 process

ConfigBeanDefinitions 方法的复杂度相当⾼，为厘清 ConfigurationClassPost

ProceSSOr 的核心功能，本节中涉及的源码会重点展示出核心逻辑，对于其他逻辑本书不详

1. processConfigBeanDefinitions 主体

对于 processConfigBeanDefinitions 方法的主体逻辑，本书不过多展开，读者可以

对照代码清单的注释内容参考了解。代码清单7-33的篇幅⾮常长，读者可以分段理解。

1代码清单 7-33 解析注解配置类的核心方法（节选）

public void processConfigBeanDefinitions （BeanDefinitionRegistry registry）｛

List<BeanDefinitionHolder> configCandidates = new ArrayList<>（）；

Stringll candidateNames = registry•getBeanDefinitionNames（）；

// 筛选出所有的配置类

for（String beanName :candidateNames） ｛

BeanDefinition beanDef = registry.getBeanDefinition （beanName）；

i£ （beanDef.getAttribute（ConfigurationClassUtiIs.CONFIGURATION_CLASS_ATTRIBUTE）！=nu11）｛

// 重复注册的检查，直接跳过 ⋯•.

｝ else if （ConfigurationClassUtils.checkConfigurationClassCandidate （beanDef，

this.metadataReaderFactory））｛

// 如果检查的bean 是⼀个配置类（被@Configuration 注解标注）

1/ 则加入到候选配置类集合中，并添加⼀个特殊标记 CONFIGURATION_CLASS_ATTRIBUTE

configCandidates.add （new BeanDefinitionHolder （beanDef,beanName））；


## 11 ⽆配置类的返回逻辑 

1/ 配置类排序

configCandidates.sort （（bd1,bd2） -> ｛

ClassBeanDefinitionReader，以下内容就这两个组件分别来看它们负责的工作内容。


## 7.5 invokeBeanFactoryPostProcessors—执⾏ BeanFactoryPost Processor|

int i1.= ConfigurationClassUti1s.getorder （bdl.getBeanDefinition （））；

int i2 = ConfigurationClassUtils.getorder （bd2.getBeanDefinition （））；

return Integer.compare （i1,i2）；

｝）；

// 如果有的话，应用⾃定义的 BeanNameGenerator（默认没有）

SingletonBeanRegistry sbr = nu11；

if （registry instanceof SingletonBeanRegistry）｛

sbr = （SingletonBeanRegistry）registryi

i£ （！this.localBeanNameGeneratorSet）｛

BeanNameGenerator generator =

（BeanNameGenerator）sbr.getSingleton （CONFIGURATION_BEAN_NAME_GENERATOR）；

if （generator ！= nul1）｛

this.componentscanbeanNamegenerator = generatori

this.importBeanNameGenerator = generator；

// 真正解析配置类的组件：ConfigurationClassParser

ConfigurationClassParser parser = new ConfigurationClassParser （

this.metadataReaderFactory,this.problemReporter,this.environment，

this.resourceLoader,this.componentscanBeanNameGenerator,registry）：

Set <BeanDefinitionHolder> candidates = new LinkedHashSet<>（configCandidates）；

Set<ConfigurationClass> alreadyParsed = new HashSet<>（configCandidates.size （））；

d｛

1/【解析配置类】

Parser.parse （candidates）；

parser.validate（）；

Set<ConfigurationClass> configClasses =

new LinkedHashSet<>（parser.getConfigurationClasses （））；

configClasses.removeA11 （alreadyParsed）；

i （this.reader == nul1）｛

1/ 真正读取配置类的组件：ConfigurationClassBeanDefinitionReader

this.reader = new ConfigurationClassBeanDefinitionReader （

registry,this.sourceExtractor,this.resourceloader,this.environment，

this.importBeanNameGenerator,parser.getImportRegistry（））；

//【加载配置类的内容】

this.reader.loadBeanDefinitions （configClasses）；

alreadyParsed.addA11 （configClasses）；


## 11 ⼀些额外的处理

while （！candidates.isEmpty（））；


## 11 ⼀些额外的处理

通读⼀遍后，想必读者对 processConfigBeanDefinitions 方法的工作内容有了⼀个

基本的了解，方法中除了⼀些辅助检查、控制的逻辑，核心重点由两个核心API 完成，分别是

负责解析配置类的 ConfigurationClassParser 以及读取配置类内容的 Configuration

所舌。

说明。

个原理）。

I第7章IOC 容器的刷新

2. ConfigurationClassParser

ConfigurationClassParser 的作用是解析配置类，针对不同的配置源加载来源，

它可以提供不同的解析逻辑（即重载的parse 方法），其核心 parse 方法如代码清单7-34

】代码清单 7-34 ConfigurationClassParser 的核心 parse 策略方法

private final DeferredImportSelectorHandler deferredImportSelectorHandler =

new DeferredImportSelectorHandler（）；

public void parse （Set<BeanDefinitionHolder> configCandidates）｛

for （BeanDefinitionHolder holder :configcandidates）｛

BeanDefinition bd = holder.getBeanDefinition（）；

try｛

// 注解配置类

if （bd instanceof AnnotatedBeanDefinition） ｛

parse （ （ （AnnotatedBeanDefinition） bd） .getMetadata （），holder.getBeanName （））；

//编程式注入配置类

else if （bd instanceof AbstractBeanDefinition

&& （（AbstractBeanDefinition） bd）.hasBeanClass （））｛

parse （ （（AbstractBeanDefinition） bd） .getBeanClass（），holder.getBeanName （））；

｝

1/ 其他情况

else｛

parse （bd.getBeanClassName （）、holder.getBeanName （））；

catcn.....

1/ 回调特殊的 ImportSelector

this.deferredImportSelectorHandler.process （）；

parse 方法的整体逻辑是，上⾯的 for 循环体会提取出配置类的全限定名，并根据配置类

的BeanDefinition类型转调不同的重载parse 方法中（注意⽆论执⾏ if-else-if 的哪个分⽀，

最终都是执⾏重载的 parse 方法）；for 循环调用完成后，最后执⾏ deferredImportSele

ctorHandler 的process 方法，对于这个组件我们之前没有接触过，这⾥有必要对其进⾏

（1） ImportSelector 的扩展

在 Spring Framework 4.0 中 ImportSelector 扩展了⼀个子接口 DeferredImport

Selector，它的执⾏时机⽐ ImportSelector 晚。普通的 ImportSelector 会在注解

配置类的解析期间⽣效，⽽ DeferredImportSelector 会在注解配置类的解析工作完成

后才执⾏（其实上⾯ ConfigurationClassParser 的核心 parse 方法就已经解释了这

⼀般情况下，DeferredImportSelector会跟eConditiona1注解配合使用完成条件装配。

（2） DeferredImportSelectorHandler 的处理逻辑

DeferredImportSelectorHandler 的处理逻辑如代码清单 7-35所示。

因此这个设计还是不错的。

种类似的方法设计⾮常多，读者在阅读源码时⼀定要多加注意。


## 7.5 invokeBeanFactoryPostProcessors⼀ ⼀执⾏ BeanFactoryPost Processor/

代码清单 7-35 DeferredlImportSelectorHandler 的 process 方法

Public void Process（）｛

List<DeferredImportSelectorHolder> deferredImports = this.deferredImportSelectors；

this.deferredImportSelectors = null；

try｛

i£（deferredImports ！= nul1）｛

DeferredImportSelectorGroupingHandler handler

= new DeferredImportSelectorGroupingHandler （）；

deferredImports.sort （DEFERRED_IMPORT_COMPARATOR）；

deferredImports.forEach （handler：：register）；

handler.processGroupImports（）；

｝ Einally｛

this.deferredImportSelectors = new ArrayList<>（）；

由代码清单7-35可以发现，DeferredImportSelectorHandler 的处理逻辑相对简单，

它会提取出所有解析阶段中存储好的 DeferredImportSelector 并依次执⾏。由于 Defe

rredImportSelector 的执⾏时机⽐较晚，对于@Conditiona1 条件装配的处理会更有利，

3. ConfigurationClassParser 的落地方法

回到主线流程中，上⾯的parse （Set<BeanDefinitionHolder>）方法中，最终动作会

把注解配置类传入重载的parse 方法中，注意方法中的参数类型是⼀个 ConfigurationClass

包装对象，如代码清单 7-36所示。

代码清单 7-36processConfigurationClass 解析配置类的动作

Protected final void parse （AnnotationMetadata metadata,String beanName）throws

IOException ｛

ProcessConfigurationClass （new ConfigurationClass （metadata,beanName））；

protected void processConfigurationClass （ConfigurationClass configClass） throws IOException ｛

// 前置校验 ⋯••

SourceClass sourceClass = asSourceClass （configClass）；

do｛

1/ 真正的解析动作

sourceClass = doProcessConfigurationclass （configClass, sourceClass）；

｝ while （sourceClass ！= nu11）；

this.configurationClasses.put （configClass,configClass）；

可以发现解析配置类的动作是⼀个 “xxx 方法转 doxxx 方法”的过程。Spring Framework 中这

在进⾏前置校验后，do-while 循环结构中真正解析配置类的 doProcessConfiguration

Class 方法实现⾮常复杂，好在源码的逻辑步骤都⽐较清晰，下⾯分段研究核心的逻辑。

部有定义配置类则会递归解析。经过该方法的处理，当前配置类内部定义的内容会被全部

解析。

I第7章IOC容器的刷新

（1） 处理@Component 注解

doProcessConfigurationClass 方法在开始部分会判断当前被解析的类是否标注了

ecomponent 注解，因为所有标注了@Configuration 注解的类必定标注了@Component 注

解，因⽽ processMemberClasses 方法必定会触发，如代码清单 7-37所舌。⽽ process

MemberClasses 方法的核心动作是解析当前类⾃⾝以及当前类中嵌套的内部类，如果内

1代码清单 7-37 doProcessConfigurationClass 方法 （1）

Protected final SourceClass doProcessConfigurationClass （ConfigurationClass configClass，

SourceClass sourceClass）throws IOException ｛

if （configClass.getMetadata（）.isAnnotated （Component.class.getName （）））｛

processMemberClasses （configClass, sourceClass）；

（2）处理@PropertySource 注解

紧接着的第⼆步是处理@PropertySource 注解，如代码清单 7-38 所示。借助 Annot

ationConfigUtils 工具类可以很容易地提取出配置类上标注的所有注解信息，然后筛选出

指定的注解属性。⽽ for 循环内部的 processPropertySource 方法会真正地封装 Property

Source 导入的资源⽂件，如代码清单7-39所示。该方法会在⼀些前置处理完毕后将资源⽂件

的内容解析出来，并存入Environment 中。


## 1 代码清单 7-38 doProcessConfigurationClass 方法 （2）

// 处理 @PropertySource 注解

Eor（AnnotationAttributes propertysource :AnnotationConfigUtils.attributesForRepeatable （

sourceClass.getMetadata （），Propertysources.class，

org.springframework.context.annotation.Propertysource.class））｛

if（this.environment instanceof ConfigurableEnvironment）｛

processPropertySource （propertySource）；

// else logger ••

1代码清单 7-39 processPropertySource 解析 properties ⽂件

private void processPropertySource （AnnotationAttributes propertySource） throws

IOException｛

1/ 前置处理…

String［］ locations = propertySource.getStringArray（"value"）；

11…….

Eor （String location :locations）｛

trY｛

// 处理路径，加载资源⽂件，并添加到 Environment 中

String resolvedLocation = this.environment.resolveRequiredPlaceholders （1ocation）；


## 7.5 invokeBeanFactoryPostProcessors- ⼀执⾏ BeanFactoryPost Processor l

Resource resource = this.resourceloader.getResource （resolvedLocation）；

addPropertySource （factory.createPropertySource （name，

new EncodedResource （resource,encoding）））；

｝// catch

（3）处理@ComponentScan 注解

第三个处理的注解是@ComponentScan 组件扫描，整体流程不太复杂，核心动作是检查

到有@ComponentScan 注解之后进⾏组件扫描，并相应地封装⽣成 BeanDefinition，随后注

册到 BeanDefinitionRegistry 中，如代码清单7-40所示。注意代码清单7-40中的⼀个细节：

@ComponentScan 可以标注多个，并且 Spring Framework 4.3后新引入了ComponentScans

注解，它可以组合多个@ComponentScan 注解，所以这⾥会使用 for 循环解析所有的

@ComponentScan 注解。

代码清单 7-40 doProcessConfigurationClass 方法 （3）....

1/ 检查配置类上是否标注了@ComponentScan或@ComponentScans

Set<AnnotationAttributes> componentScans = AnnotationConfigUtils.attributesForRepeatable

（sourceClass.getMetadata （），ComponentScans.class, ComponentScan.class）；

i£ （！componentScans.isEmpty（）&& ！this.conditionEvaluator.shouldskip （sourceClass.getMetadata （），

ConfigurationPhase. REGISTER_BEAN））｛

// 如果有@Componentscans，则要提取出⾥⾯所有的@componentScan依次扫描

for（AnnotationAttributes componentscan :componentScans）｛

// 【复杂】借助 ComponentScanAnnotationParser 扫描

/ private final ComponentScanAnnotationParser componentScanParser；

Set<BeanDefinitionHolder> scannedBeanDefinitions = this.componentScanParser

. parse （componentScan,sourceclass.getMetadata （） .getClassName （））；

//是否扫描到了其他的注解配置类

for（BeanDefinitionHolder holder : scannedBeanDefinitions）｛

BeanDefinition bdCand = holder.getBeanDefinition（）.getOriginatingBeanDefinition（）；

i£ （bdCand == nul1）｛

bdcand = holder.getBeanDefinition（）；

iE （ConfigurationClassUtils.checkConfigurationClassCandidate （bdCand，

this.metadataReaderFactory））｛

// 如果扫描到了，递归解析

parse （bdCand.getBeanClassName （），holder.getBeanName （））；

1…….

扫描的核心动作会借助⼀个 ComponentScanAnnotationParser 来委托处理包扫描的

工作，但它的内部还集成了⼀个 ClassPathBeanDefinitionscanner，它们分别完成不同

的职责，代码清单 7-41 可以解释这⼀点。



# 第7章IOC容器的刷新


## 第7章IOC容器的刷新

署代码清单 7-41 ComponentScanAnnotationParser 委托实现组件扫描的预备动作

public Set <BeanDefinitionHolder> parse （AnnotationAttributes componentScan，

final String declaringClass）｛

// 构造 ClassPathBeanDefinitionScanner

ClassPathBeanDefinitionScanner scanner = new ClassPathBeanDefinitionScanner （this.registry，

componentScan.getBoolean （"useDefaultFilters"），this.environment,this.resourceloader）；


## 11 解析ecomponentScan 中的属性

Class<？ extends BeanNameGenerator> generatorClass = componentScan.getClass（"nameGenerator"）；

// 整理要扫描的basePackages

Set<String> basePackages = new LinkedHashSet<>（）：

String［］ basePackagesArray = componentScan.getStringArray（"basePackages"）；

for （String pkg :basePackagesArray） ｛

Stringl］ tokenized = Stringutils.tokenizerostringArray（this.environment.resolve

Placeholders （pkg），ConfigurableApp1icationContext.CONFIG_LOCATION_DELIMITERS）；

Collections.addA11 （basePackages, tokenized）；

Eor （Class<?> clazz : componentscan.getClassArray（"basePackageClasses"））｛

basePackages.add （ClassUtils.getPackageName （clazz））；

1/ 没有声明basePackages，则当前配置类所在的包即为根包

iE （basePackages.isEmpty （））｛

basePackages.add （ClassUtils.getPackageName （declaringClass））；

1…...

// 【扫描】执⾏组件扫描动作

return scanner.doScan （Stringutils.toStringArray （basePackages））；

整个方法的逻辑总结下来，可以概括为3个步骤。

1. 构造 ClassPathBeanDefinitionScanner，并封装@ComponentScan 注解中的属性。

2. 整理要进⾏包扫描的basePackages，以及 include 和 exclude 的过滤器。

3. 调用 ClassPathBeanDefinitionScanner 执⾏实际的组件扫描的动作。

前两个步骤都相对简单，真正的组件扫描动作在 ClassPathBeanDefinitionscanner

的doscan 方法中（方法名也体现出它的确是真正起作用的），如代码清单 7-42 所示。

代码清单 7-42 ClassPathBeanDefinitionScanner 的真正的组件扫描动作

Protected Set<BeanDefinitionHolder> doScan（String... basePackages）｛

assert.....

vetsbeanperinitlonholder beanverinitions - new uinkeahasnoets>：

for （String basePackage :basePackages）｛

// 【真正的组件扫描动作在这⾥】

Set <BeanDefinition> candidates = findCandidateComponents （basePackage）；

for（BeanDefinition candidate : candidates）｛

// 处理scope（默认情况下是 singleton）

ScopeMetadata scopeMetadata = this.scopeMetadataResolver

•resolveScopeMetadata （candidate）；

return beanDefinitions；

解的处理完成。


## 7.5 invokeBeanFactoryPostProcessors⼀⼀执⾏ BeanFactoryPost Processor|

candidate.setScope （scopeMetadata.getScopeName （））；

// ⽣成Bean 的名称

String beanName = this.beanNameGenerator.generateBeanName （candidate，

this.registry）；

if （candidate instanceof AbstractBeanDefinition）｛

postProcessBeanDefinition （（AbstractBeanDefinition） candidate,beanName）；

1/ 处理 Bean 中的@Lazy、@Primary等注解

iE （candidate instanceof AnnotatedBeanDefinition）｛

AnnotationConfigUtils.processCommonDefinitionAnnotations （（AnnotatedBean

Definition） candidate）；

if （checkCandidate （beanName,candidate））｛

BeanDefinitionHolder definitionHolder =

new BeanDefinitionHolder （candidate, beanName）；

// 设置AOP 相关的属性（如果⽀持的话）

definitionHolder = AnnotationConfigUtils.applyscopedProxyMode （scopeMetadata，

definitionHolder,this.registry）；

beanDefinitions.add（definitionHolder）；

// 注册到BeanDefinitionRegistry中

registerBeanDefinition（definitionHolder,this.registry）；

代码清单 7-42 已经基本展示了组件扫描逻辑的全貌，只要符合之前设置好的匹配规则，find

Candidatecomponents 方法就可以成功扫描到，进⽽封装⼒BeanDefinition（具体的实现类

是 scannedGenericBeanDefinition），随后设置Bean 的名称、作用域、延迟加载、是否⾸选

等信息，BeanDefinition 的上述信息设置完成后即会注册到 BeanDefinitionRegistry 中。

BeanDefinition 注册的动作全部完成后，即代表组件扫描完毕，ComponentScan 注

（4）处理@Import 注解

代码清单 7-43所舌为处理@Import 注解的代码。

代码清单 7-43 doProcessConfigurationClass 方法 （4）

/1处理@Import 注解

processImports （configClass, sourceClass,getImports （sourceClass），true）；

处理@Import 注解的方法是被封装过的，需要进人 ProcessImports 方法实现中来看。

processImports 方法的实现⾮常规整，它会针对@Import 注解中⽀持的4种类型分别应用

不同的处理逻辑（如 ImportSelector 会直接调用其 selectImports 方法加载所需加载的

类的全限定名，ImportBeanDefinitionRegistrar 会在全部收集完成后依次调用），相应

的源码如代码清单7-44所舌。



# 第7章 IOC容器的刷新


## 第7章 IOC容器的刷新

提示：对于该部分内容，读者应该掌握的是方法本身，⽽不是具体的实现机制，这个方法在深入研

究时通常伴随着排查问题，源码学习阶段可以仅关注方法主体架构。

代码清单 7-44 processlmports 处理@Import 注解

Private void processImports （ConfigurationClass configClass，

SourceClass currentSourceClass, Collection<SourceClass> importCandidates，

Predicate<String> exclusionFilter,boolean checkForCircularImports）｛

// 前置判断

1/ 防⽌循环@Import 导入

i£ （checkForcircularImports && isChainedImportOnStack （configClass））｛

this.problemReporter.error （new CircularImportProblem （configClass,this.importStack））；

｝ else｛

// importstack 的控制

for（SourceClass candidate：importCandidates）｛

// 处理 ImportSelector

if （candidate.isAssignable （ImportSelector.class））｛

CLasss：> Candidatetiass = Candidate.LoadcLass（）：

ImportSelector selector = ParserstrategyUtils.instantiateClass （candidateClass，

ImportSelector.class, this.environment，this.resourceLoader,this.registry）；

Predicate<String> selectorFilter = selector.getExclusionFilter （）；

i£（selectorFilter ！= nul1） ｛

exclusionFilter = exclusionFilter.or （selectorFilter）；

// DeferredImportSelector 的执⾏时机后延

if （selector instanceof DeferredImportSelector）｛

this.deferredImportselectorHandler.handle （configClass，

（DeferredImportSelector）selector）；

｝ else｛

1/ 执⾏ ImportSelector 的selectImports 方法，并注册导入的类

Stringl］ importClassNames = selector.selectImports

（currentSourceClass.getMetadata （））；

Collection<SourceClass> importSourceClasses =

asSourceClasses （importClassNames,exclusionFi1ter）；

processImports （configClass, currentSourceClass, importSourceClasses，

exclusionFilter,false）；

1/ 处理 ImportBeanDefinitionRegistrar

else if （candidate.isAssignable （ImportBeanDefinitionRegistrar.class））｛

Class<?> candidateClass = candidate.loadClass （）；

ImportBeanDefinitionRegistrar registrar =

ParserstrateqyUtils.instantiateClass （candidateClass，

ImportBeanDefinitionRegistrar.class, this.environment，

this.resourceloader,this.registry）；

configClass.addImportBeanDefinitionRegistrar（registrar，

currentSourceClass .getMetadata （））；

1/ 导入普通类/配置类

else｛

探究。

的原因会在后⾯讲解。


## 7.5 invokeBeanFactoryPostProcessors- ⼀执⾏ BeanFactoryPost Processor/

this.importStack.registerImport （

currentSourceClass.getMetadata （），candidate.getMetadata （） •getClassName （））；

processConfigurationClass （candidate.asConfigClass （configClass），exclusionFilter）；

（5）处理@ImportResource 注解

Spring Framework 在使用注解驱动IOC容器的场景中，当需要导入XML 配置⽂件时

可以借助@ImportResource 注解进⾏导人，代码清单 7-45的逻辑会将这些配置⽂件收

集好，并在配置类解析完成后统⼀加载。本段源码只需要读者了解@ImportResource 注

解在此处处理，由于 Spring Boot 已不推荐使用XML 配置⽂件作为配置源，本书不再深入

』代码清单 7-45 doProcessConfigurationClass 方法 （5）

//处理@ImportResource 注解

AnnotationAttributes importResource = AnnotationConfigUtils.attributesFor

（sourceClass.getMetadata（），ImportResource.class）；

if （importResource ！= nul1）｛

Stringl］ resources = importResource.getStringArray（"locations"）；

Class<？ extends BeanDefinitionReader> readerClass = importResource.getClass （"reader"）；

for（String resource :resources）｛

string resolvedResource = this.environment.resolveRequiredPlaceholders （resource）；

configClass.addImportedResource （resolvedResource,readerClass）；

（6） 处理@Bean 注解

注意观察代码清单 7-46中的逻辑，retrieveBeanMethodMetadata 方法会扫描所有标

注了@Bean 注解的方法，但是它跟上⾯的大多数处理⼀样，没有⽴即封装 BeanDefinition

并注册到 BeanDefinitionRegistry 中，⽽是先存入 ConfigurationClass 中，这样做


## 1 代码清单 7-46 doProcessConfigurationClass 方法 （6）

1.....

/1处理被注解@Bean 标注的方法

Set<MethodMetadata> beanMethods = retrieveBeanMethodMetadata （sourceClass）；

tOK（Methodmetadata methodmetadata: beanmethods）

configClass.addBeanMethod （new BeanMethod （methodMetadata,configClass））；

1•••••

有关 retrieveBeanMethodMetadata 方法对标注了@Bean 注解的方法的筛选，读者可

以深入源码简单探究，如代码清单7-47所舌。

1第7章IOC 容器的刷新

代码清单 7-47 retrieveBeanMethodMetadata 筛选出标注了@Bean 注解的方法

Private Set<MethodMetadata> retrieveBeanMethodMetadata （SourceClass sourceClass） ｛

AnnotationMetadata original = sourceClass.getMetadata （）；

// 获取被@Bean 注解标注的方法

Set<MethodMetadata> beanMethods = original .getAnnotatedMethods （Bean.class.getName （））；

if（beanMethods .size（）>1 && original instanceof StandardAnnotationMetadata） ｛

try｛

AnnotationMetadata asm = this.metadataReaderFactory

.getMetadataReader （original.getClassName （））.getAnnotationMetadata （）；

set<MethodMetadata> asmMethods = asm.getAnnotatedMethods （Bean.class.getName （））；

if （asmMethods.size（）>= beanMethods.size （））｛

Set<MethodMetadata> selectedMethods = new LinkedHashSet<> （asmMethods .size （））；

1/ 筛选每个方法

for（MethodMetadata asmMethod : asmMethods）｛

for（MethodMetadata beanMethod:beanMethods）｛

if （beanMethod.getMethodName （）.equals （asmMethod.getMethodName （）））

selectedMethods .add （beanMethod）；

break；

｝

iE （selectedMethods.size （）== beanMethods.size （））｛

beanMethods = selectedMethods；

｝// catch

beanMethodsi

retrieveBeanMethodMetadata 方法⼀开始会筛选出被@Bean 注解标注的方法。请注

意观察源码中的变量名 asm，明明依靠反射机制就可以得到这些被@Bean 注解标注的方法，⽽

读取方法的部分使用了 ASM（⼀种读取字节码的技术），Spring Framework 为什么要如此大动

⼲⼽呢？这⾥要多解释⼀下：使用JVM 的标准反射，在不同的JVM 或者同⼀个 JVM 上的不同

应用中返回的方法列表顺序可能是不同的。简⾔之，JVM 的标准反射不保证方法列表返回的顺

序⼀致。若想保证程序在任何JVM上、任何应用中加载同⼀个字节码⽂件的方法列表时都返回

相同的顺序，就只能通过读取字节码来解决，⽽读取字节码的技术中 Spring Framework 选择了

ASM。简单总结，Spring Framework 使用ASM 读取字节码的目的是保证加载配置类中标注了

@Bean 的方法的从上到下的顺序与源⽂件.java 中的⼀致。

4. ConfigurationClassBeanDefinitionReader

注解配置类全部解析完成后，可以看到有很多需要注册的Bean信息被记录在 Configura

tionclass 这个对象中。接下来的步骤会将这些记录的内容依次转换为 BeanDefinition，

并注册到 BeanDefinitionRegistry中。

this.reader. loadBeanDefinitions （configClasses）；

上⾯代码中使用的 reader 就是接下来要讲的 ConfigurationClassBeanDefini

tionReader，从类名上可以⾮常直观地读懂它的功能，它是⼀个可以读取配置类的

方法


## 7.5 invokeBeanFactoryPostProcessors—执⾏ BeanFactoryPost Processor】

BeanDefinition 读取器。它要做的工作是将 ConfigurationClass 中的内容逐个读取并

封装⼒ BeanDefinition，随后注册到 BeanDefinitionRegistry 中，对应的关键方法

loadBeanDefinitions 的实现如代码清单 7-48 所示。

代码清单 7-48 ConfigurationClassBeanDefinitionReader 的核心 loadBeanDefinitions

public void loadBeanDefinitions （Set<ConfigurationClass> configurationModel）｛

TrackedConditionEvaluator trackedConditionEvaluator = new TrackedConditionEvaluator （）；

for （ConfigurationClass configclass :configurationModel）｛

loadBeanDefinitionsForConfigurationClass （configClass, trackedConditionEvaluator）；

｝

private void loadBeanDefinitionsForConfigurationClass （ConfigurationClass configClass，

TrackedConditionEvaluator trackedConditionEvaluator）｛


## 11 与条件装配有关的逻辑 

1/ 如果当前配置类是被@Import标注的，则要把配置类⾃身注册到 BeanDefinitionRegistry中

i£ （configClass.isImported （））｛

registerBeanDefinitionForImportedConfigurationClass （configClass）；

1/ 注册被@Bean 注解标注的 Bean

for （BeanMethod beanMethod :configClass.getBeanMethods （））｛

LoaabeanDetinltlonsrorbeanmetnoa （beanmetnoa）；

// 注册来⾃ XMI. 配置⽂件的 Bean

loadBeanDefinitionsFromImportedResources （configClass.getImportedResources （））；

// 注册来⾃ ImportBeanDefinitionRegistrar 的 Bean

loadBeanDefinitionsFromRegistrars （configClass.getImportBeanDefinitionRegistrars （））；

注意观察代码清单 7-48中注册 BeanDefinition 的部分，它共包含下⾯4个步骤，每个

步骤的 BeanDefinition 加载源都不⼀样，下⾯分别来看。

（1）注册配置类⾃身

第⼀步是将配置类⾃身对应的定义信息注册到 BeanDefinitionRegistry 中。按照组

件扫描的原则，只要⼀个类标注了@Configuration 注解，就相当于标注了@Component 注

解，当该类被成功扫描时就应该注册到 BeanDefinitionRegistry 中。但有⼀种特殊情况，

如果配置类通过@Import 注解的方式导人，这种情况下配置类不会主动将⾃身注册到 Bean

DefinitionRegistry 中，因此在 registerBeanDefinitionForImportedConfigura

tionclass 方法中需要将那些被@Import 导入的配置类也全部注册到 BeanDefinition

Registry 中。

从代码清单 7-49来看，registerBeanDefinitionForImportedConfiguration

Class 方法仅是⼀个普通的BeanDefinition 的注册，没有任何多余的操作，读者仅需要对

该机制简单了解。

者尽可能地配合源码中标注的注释来阅读）。

I第7章 IOC 容器的刷新

1代码清单 7-49 被@Import 导入的配置类注册到 BeanDefinitionRegistry 中

private void registerBeanDefinitionForImportedConfigurationClass （ConfigurationClass configClass）｛

AnnotationMetadata metadata = configClass.getMetadata （）；

1/ 构造 BeanDefinition

AnnotatedGenericBeanDefinition configBeanDef = new AnnotatedGenericBeanDefinition （metadata）；


## 11 作用域、Bean 名称的处理 

// 包裝 BeanDefinitionHolder

BeanDefinitionHolder definitionHolder = new BeanDefinitionHolder （configBeanDef，

configBeanName）；

definitionHolder = AnnotationConfigUtils.applyScopedProxyMode （scopeMetadata，

definitionHolder,this.registry）；

1/ 注册到 BeanDefinitionRegistry 中

this.registry.registerBeanDefinition （definitionHolder.getBeanName （）、

definitionHolder.getBeanDefinition （））；

configClass.setBeanName （configBeanName）；

// Logger......

（2）注册@Bean 注解的bean

紧接着的第⼆步是加载 ConfigurationClass 中存储的标注了@Bean注解的方法，对应

的 loadBeanDefinitionsForBeanMethod 方法篇幅⽐较⻓，如代码清单 7-50所示（请读

】代码清单 7-50 注册@Bean 注解的 bean

private void loadBeanDefinitionsForBeanMethod（BeanMethod beanMethod）｛

Contigurationclass configClass = beanMethod.getConfigurationClass （）；

MethodMetadata metadata = beanMethod.getMetadata （）；

String methodName = metadata.getMethodName （）；

// 如果条件装配将其跳过，则该@Bean 标注的方法对应的 BeanDefinition

// 不会注册到 BeanDefinition Registry

i （this.conditionEvaluator.shouldSkip （metadata, ConfigurationPhase.REGISTER_BEAN））｛

configClass.skippedBeanMethods .add （methodName）；

return；

i£ （configClass.skippedBeanethods.contains （methodName））｛

return；

1/ 校验 ....

1/处理 Bean的name、alias...

// 注解中配置了@Bean，与 xm1 中的Bean 出现完全⼀致，会抛出异常

i£ （isOverriddenByExistingDefinition （beanMethod,beanName））｛

i （beanName.equals （beanMethod.getConfigurationClass （）•getBeanName （）））｛

// throw ex ⋯..

return；

的全限定名、属性注入等，⽽且最终创建的对象⼀定是通过反射创建的。⽽在注解配置类中的

对象并返回。


## 7.5 invokeBeanFactoryPostProcessors—执⾏ BeanFactoryPost Processor/

// 构造 BeanDefinition

ConfigurationClassBeanDefinition beanDef = new ConfigurationClassBeanDefinition （configclass，

metadata）：

beanDef.setSource （this.sourceExtractor.extractSource （metadata, configclass.getResource（）））；

//【复杂】解析@Bean 所在方法的修饰符

if （metadata.isStatic（））｛

// 静态@Bean 方法

if （configClass.getMetadata （） instanceof StandardAnnotationMetadata） ｛

beanDef.setBeanclass （（ （StandardAnnotationMetadata） configClass.getMetadata（））.get

IntrospectedClass （））：

｝ else｛

beanDef .setBeanClassName （configClass.getMetadata （）•getClassName （））；

beanDef.setUniqueFactoryMethodName （methodName）；

｝else｛

1/ 实例@Bean 方法

beanDef.setFactoryBeanName （configClass.getBeanName （））；

beanDef.setUniqueFactoryMethodName （methodName）；

1/处理@Bean 的属性（name、initMethod 等）、额外的注解（@Lazy、@Dependson 等）⋯..

// 注册到 BeanDefinitionRegistry中

this.registry.registerBeanDefinition （beanName,beanDefToRegister）；

整个处理过程分4步：检查⼀构造 BeanDefinition⼀封装信息⼀注册到BeanDefinition

Registry 中。代码清单 7-50 中靠下方的部分中有关处理@Bean 的属性、额外的注解信息解

析的逻辑相对简单，读者可以⾃⾏借助IDE 去看看，这⾥不展开解释。

另外，注意代码清单7-50的中间部分还有⼀个标注有【复杂】的metadata.isStatic（）

方法，它的判断逻辑中会使用 setBeanClassName/setFactoryBeanName 以及 setUnique

FactoryMethodName 方法给 BeanDefinition 封装两个属性，对应的两个属性分别指定了

当前@Bean 方法所在的配置类以及方法名。这个设计需要与前⾯通过@Component 注解配合组

件扫描构建的 BeanDefinition 进⾏对⽐。这种 BeanDefinition 在构建时会指定 Bean

@Bean 方法有实际的代码执⾏，属于编程式创建，⽆法使用（也不适合用）反射创建 bean 对

象，所以为了在后⾯能正常创建出bean 对象，此处就需要记录该 Bean 的定义源（包含注解配

置类和方法名），以确保在创建 bean 对象时，能够使用反射调用该注解配置类的方法⽣成 bean

（3）解析 XML 配置⽂件

所有用@Bean 注解标注的方法封装完成后，下⼀步是将之前解析@ImportResource 注解

时保存的 XMIL 配置⽂件路径逐个加载并解析，对应的逻辑如代码清单7-51所示。对于这部分

读者可以不用了解太多，只需知道负责处理 XML 配置⽂件的核心组件是 Xm1Bean

DefinitionReader。⾄于 XML 配置⽂件是如何解析的，本书不再展开讲解，感兴趣的读者

可以⾃⾏深入了解。

｝

this.registry，

BeanDefinitionRegistryPost

I第7章 IOC 容器的刷新

代码清单 7-51 借助 XmIBeanDefinitionReader 解析 XML配置⽂件

Private void loadBeanDefinitionsFromImportedResources （

Map<string, Class<？ extends BeanDefinitionReader>> importedResources）｛

Map<Class<?>，BeanDefinitionReader> readerInstanceCache = new HashMap<>（）；

importedResources.forEach（（resource,readerClass）->｛

iE （BeanDefinitionReader.class == readerClass）｛

if （Stringutils.endswithIgnoreCase （resource，".groovy"））｛

readerClass = GroovyBeanDefinitionReader.class；

｝ else｛

// 创建 xm1BeanDefinitionReader，以备下⾯的解析

readerClass = XmlBeanDefinitionReader.class；

｝

BeanDefinitionReader reader = readerInstanceCache .get （readerClass）；

// reader 的缓存等

1/ 调用 xm1BeanDefinitionReader 解析资源⽂件

reader.loadBeanDefinitions （resource）：

｝；

（4）回调 ImportBeanDefinitionRegistrar

最后⼀步是回调所有的 ImportBeanDefinitionRegistrar，既然是回调，就只需

把所有的 ImportBeanDefinitionRegistrar 都提取出来，逐个调用其 registerBean

Definitions。源码的逻辑也⾮常简单，如代码清单7-52所示。

1代码清单 7-52 回调所有的 ImportBeanDefinitionRegistrar

Private void loadBeanDefinitionsFromRegistrars （Map<ImportBeanDefinitionRegistrar,Annotation

Metadata> registrars）｛

registrars.forEach（（registrar,metadata）->

Legistiar.Legisterbeanverinitlons（metaaata/

this.importBeanNameGenerator））；

5. ConfigurationClassPostProcess 功能小结

经过上述步骤后，ConfigurationClassPostProcess 的工作全部完成，简单总结

ConfigurationClassPostProcess 中的重要功能。

• ConfigurationclassPostProcess 实现了

Processor，它会向 BeanDefinitionRegistry 中注册新的 BeanDefinition。

• ConfigurationClassPostProcess 中组合了⼀个 ConfigurationClassParser，

其具备解析配置类的能⼒，ConfigurationClassParser 会具体负责注解配置类的

解析并提取关键注解的信息，封装到 ConfigurationClass 对象中。

• ConfigurationClassPostProcess 中利用 ConfigurationClassBeanDefinition

Reader，其具备读取配置类、封装 BeanDefinition 的能⼒，经过 Confi

gurationClassParser 处理后，ConfigurationClassBeanDefinitionReader 会

将提取的信息转换⼒ BeanDefinition，并注册到BeanDefinitionRegistry 中。


## 7.6 registerBeanPostProcessors—初始化 BeanPostProcessorl


## 7.6 registerBeanPostProcessors 初始化 BeanPostProcessor

BeanFactoryPostProcessor 处理完成之后，紧接着要初始化的是所有的 Bean

PostProcessor，它的初始化逻辑整体看起来与 BeanFactoryPostProcesSOr极其相似，

如代码清单 7-53所示。

1代码清单 7-53 初始化所有 BeanPostProcessor

protected void registerBeanPostProcessors （ConfigurablelistableBeanFactory beanFactory） ｛

1/ 依然借助 PostProcessorRegistrationDelegate完成

PostProcessorRegistrationDelegate.registerBeanPostProcessors （beanFactory,this）；

public static void registerBeanPostProcessors （ConfigurableListableBeanFactory beanFactory，

AbstractApplicationContext applicationContext）｛

String［］ postProcessorNames = beanFactory

•getBeanNamesForType （BeanPostProcessor.class,true,false）；

1/ 此处会先注册⼀个 BeanPostProcessorChecker

int beanProcessorTargetCount = beanFactory.getBeanPostProcessorCount （）

+ 1 + PostProcessor Names.length：

beanFactory.addBeanPostProcesSor（new BeanPostProcessorChecker （beanFactory，

beanProcesSorTargetCount））；

// 根据排序规则，给所有的后置处理器分类

List<BeanPostProcessor>priorityOrderedPostProcessors = new ArrayList<>（）；

List<BeanPostProcesSOr> internalPostProcessors = new ArrayList<>（）；

List<String> orderedPostProcessorNames = new ArrayList<>（）；

List<String> nonorderedPostProcessOrNames = new ArrayList<>（）；

for （String ppName :postProcessorNames）｛

iE（beanFactory.isTypeMatch（ppName,Priorityordered.class））｛

1/注意此处，Priorityordered类型的后置处理器被提前初始化了

BeanPostProcessor PP = beanFactory.getBean（ppName,BeanPostProcessor.class）；

PriorityorderedPostProcessors.add（PP）；

// MergedBeanDefinitionPostProcessor 类型的后置处理器被单独放在⼀个集合中，

// 说明该接⼜⽐较特殊

if （PP instanceof MergedBeanDefinitionPostProcesSOr）｛

internalPostProcessors.add （PP）；

｝ else if （beanFactory.isTypeMatch （ppName,Ordered.class））｛

orderedPostProcessorNames.add （ppName）；

｝else｛

nonorderedrostrrocessorNames.add （ppName）；

1/ 注册实现了 Priorityordered接口的 BeanPostProcessor

sortPostProcessors（priorityorderedPostProcessors,beanFactory）；

registerBeanPostProcessors （beanFactorY,PriorityorderedPostProcessors）；

// 注册实现了 Ordered 接口的 BeanPostProcessor

List<BeanPostProcesSOr> orderedPostProcessors = new ArrayList<>（）；

Eor （String ppName : orderedPostProcesSOrNames）｛

BeanPostProcessor Pp = beanFactory.getBean （ppName,BeanPostProcessor.class）；

重点关注方法中的⼏个细节。

中尝试获取⼀点线索。

I第7章 IOC容器的刷新

orderedPostProcessors.add （pp）；

if （PP instanceof MergedBeanDefinitionPostProcessor）｛

internalPostProcessors.add（pp）；

sortrostELocessors （orQerearostrrocessors, DeanractorY），

registerBeanPostProcessors （beanFactory, orderedPostProcesSOrs）；

// 注册普通的 BeanPostProcessor

List<BeanPostProcessor> nonorderedPostProcessors = new ArrayList<>（）；

for（String PpName : nonOrderedPostProcesSOrNames）｛

BeanPostProcessor PP = beanFactory.getBean（PpName,BeanPostProcessor.class）；

nonorderedPostProcessors.add （pp）；

i£ （PP instanceof MergedBeanDefinitionPostProcesSOr）｛

internalPostProcessors.add （pp）；

registerBeanPostProcessors （beanFactory,nonOrderedPostProcesSors）；

// 最后，重新注册被单独分离出来的 MergedBeanDefinitionPostProcessor

sortPostProcessors （internalPostProcessors, beanFactory）；

registerBeanPostProcessors （beanFactory,internalPostProcesSOrS）；

// ⼿动注册 ApplicationListenerDetector（参⻅7.3.3节）

beanFactory.addBeanPostProcessor （new ApplicationListenerDetector （applicationContext））；

registerBeanPostProcessorS 方法的篇幅很⻓，但通读下来，读者的感受应该是⾮

常熟悉，整体步骤与 BeanFactoryPostProcessor 的执⾏极其相似，最大的区别是 Bean

FactoryPostProcesSor 需要在提取出后⽴即执⾏，⽽BeanPostProcessor 是先注册到

IOC容器中，等待 bean 对象的初始化后再执⾏。对于整体的流程这⾥不再重复讲解，读者需要


## 7.6.1 BeanPostProcessorChecker

由类名理解 BeanPostProcessorChecker 是⼀个后置处理器的检查器。作为⼀个后置

处理器，它还要检查后置处理器，这看起来有些奇烃。如何理解该组件的设计，可以从 javadoc

BeanPostProcessor that logs an info message when a bean is created during BeanPostProcessor

instantiation, i.e. when a bean is not eligible for getting processed by all BeanPostProcessors.

它是⼀个 BeanPostProceSSOr，当在 BeanPostProcesSOr 实例化期间创建 Bean，即

当某个 Bean 不能被所有 BeanPostProcessor 处理时，它会记录⼀条信息。

通过 javadoc 可以明⽩，BeanPostProcessorChecker 的作用是检查 BeanPost

Processoz 的初始化阶段中是否有bean 对象的意外创建。注意“意外创建”这个概念，其实

它并不意外，如果在 BeanPostProcessor 中注入了其他的普通bean 对象，根据依赖注入的

原则，会在BeanPostProcessor 创建之前先把这些注入的普通 bean 对象初始化，⼜因为当

前阶段 BeanPostProcessor 还没有初始化完毕，这些普通 bean 对象还没有来得及被

BeanPostProcessor 处理，导致出现 bean 对象的“残缺不全”。BeanPostProcessor


## 7

ApplicationListenerDetector：

ListenerDetector，为什么此处还要重复注册呢？重复注册是否会存在相同类型的后置处

置处理器时，在底层不是⼿动添加⽽是重新注册，使其位于所有后置处理器的末尾位置，如

registerBeanPostProcessors—初始化 BeanPostProcessor|

checker 的作用就是用来提醒开发者对该问题引起注意。

有关“残缺不全的bean对象”这种情况，其实并不少⻅，读者在开发时可能会遇到这种日

志：xXxXXX is not eligible for getting processed by al1 BeanPostProcessors

（for example:not eligible for auto-proxying）。这就意味着你的 BeanPost

Processor 中注人了普通bean 对象，属于不合理设计，需要对代码做出调整。

另外，在BeanPostProcessorChecker 的 postProcesSAfterInitialization 方

法中会检查当前 BeanFactory 中的后置处理器数量是否少于⼀开始计算的预计后置处理器数

量，如果是则代表有 bean 对象被提前创建。对应的逻辑如代码清单7-54所舌。

代码清单 7-54 postProcessAfterInitialization 中回调检查

public Object postProcessAfterInitialization （Object bean,String beanName）｛

// 此处判断是否有普通bean 对象被提前创建

if（！（bean instanceof BeanPostProcessOr） && ！isInfrastructureBean （beanName）&&

this.beanFactory.getBeanPostProcessorCount （）< this.beanPostProcesSOrTargetCount）｛

// 打印异常警告日志•.

return bean；


## 7.6.2 Merged BeanDefinitionPostProcessor 被重复注册

在整个 registerBeanPostProcessors 方法接近最后的部分会⼿动注册⼀个

1/ ⼿动注册 ApplicationListenerDetector（参⻅7.3.3节）

beanFactory.addBeanPostProcesSOr （new ApplicationListenerDetector （applicationContext））；

仔细回忆7.3.3节的内容，当时prepareBeanFactory方法中已经注册过这个Application

理器呢？如果读者也有这种疑问，其实是多虑了。作为普通开发者能想到的问题，Spring

Framework 的作者⼀定也会想到。实际上 addBeanPostProcessor 方法注册相同类型的后

代码清单 7-55所舌。

1代码清单 7-55 addBeanPostProcessor 会将已经注册过的后置处理器移⾄末尾

PrLvate static Volo registerbeanrosLrLocessorS（

ConfigurablelistableBeanFactory beanFactory, List<BeanPostProcessor> postProcessors）｛

for（BeanPostProcessor postProcessor : postProcessors）｛

beanFactory.addBeanPostProcessor （postProcesSOr）；

public void addBeanPostProcessor （BeanPostProcessor beanPostProcesSOr）｛

Assert.notNu11 （beanPostProcessor， "BeanPostProcessor must not be nul1"）；

// 如果后置处理器已经存在，则移除

this.beanPostProcessors.remove （beanPostProcesSOr）；

⽽已。

简单了解。

I第7章 IOC 容器的刷新

i （beanPostProcessor instanceof InstantiationAwareBeanPostProcessor）｛

this.hasInstantiationAwareBeanPostProcessors = true；

if（beanPostProcessor instanceof DestructionAwareBeanPostProcesSOr） ｛

this.hasDestructionAwareBeanPostProcessors = true；

// 添加⾄后置处理器列表的末尾

this.beanPostProcessors.add （beanPostProcessor）；

由此可知，重复注册 ApplicationListenerDetector 以及 internalPostProce

ssors集合中后置处理器的目的是将这些后置处理器都放到整个后置处理器列表的末尾，仅此

在第3章中讲解 MergedBeanDefinitionPostProcessor 时提到了⼀个⾮常重要的实

现类 AutowiredAnnotationBeanPostProcesSOr，它会根据合并后的BeanDefinition

为bean 对象进⾏依赖注入。这个策略是 Spring Framework 内置的既定策略，下⾯介绍 bean对

象依赖注入的部分会讲到。


## 7.6.3 PriorityOrdered 类型的后置处理器


## 7.5节中已经提到过⼀个设计，Priorityordered 接口代表最⾼优先级，实现它的类⼀

般都是 Spring Framework 内置的极重要的组件。本节列举两个关键的后置处理器，读者可以先

• AutowiredAnnotationBeanPostProcessOr—处理@Autowired 注解。

• ConmonAnnotationBeanPostProcesSOr—处理JSR-250 规范的注解。

这两个极重要的内置后置处理器都是用于解析和处理bean 对象上的注解，如果这两个后置

处理器不先初始化好，后⾯的bean 对象中使用的@Autowired、@PostConstruct 等注解将

会失效。由此可知，这些实现了 Priorityordered 接口的组件通常都是内置的核心组件，Spring

Framework 为了确保功能的正常使用，就必须让这些核心组件都率先准备就绪。


## 7.7 initMessageSource—初始化国际化组件

在第3章讲解 ApplicationContext 的结构时提到⼀点，Applicationcontext 本⾝

实现了 MessageSource 接口，具备国际化的能⼒。ApplicationContext 初始化国际化组

件的逻辑如代码清单7-56所示。

【代码清单 7-56 初始化国际化组件

Public static final String MESSAGE_SOURCE_BEAN_NAME = "messageSource"；

protected void initMessageSource（）｛

ConfigurablelistableBeanFactory beanFactory = getBeanFactory（）；

// 检查是否已经存在 MessageSource 组件，如果存在，直接赋值

if （beanFactory.containsLocal Bean （ME.SSAGE_SOURCE_BEAN_NAME））！

this.messageSource = beanFactory. getBean （ME.SSAGE_SOURCE_BEAN_NAME,MessageSource.class）；

if（this.parent ！= null && this.messageSource instanceof HierarchicalMessageSource）｛

可以委托完成具体工作的落地实现，即便这个落地实现不会进⾏任何处理。

件与参数绑定特性，在特定条件下预先创建⼀个 MessageSource，对于具体的逻辑可以查看


## 7.7 initMessageSource—初始化国际化组件I

HierarchicalMessageSource hms = （HierarchicalMessageSource）this.messageSource；

i （hms.getParentMessageSource （）== nul1）｛

hms.setParentMessageSource （get InternalParentMessageSource （））；

/ Logger.••••.

1/ 如果不存在，则会创建⼀个全新的对象并注册到 BeanFactory中

else｛

DelegatingMessageSource dms = new DelegatingMessageSource（）；

dms. setParentMessageSource （getInternalParentMessageSource （））；

this.messageSource = dms；

beanFactory.registerSingleton （MESSAGE_SOURCE_BEAN_NAME, this.messageSource）；

// logger •.

初始化 MessageSource 的逻辑本身不复杂，initMessageSource 方法⾸先会检查

BeanFactory 中是否已经存在⼀个 MessageSource 类型的对象，如果存在则会直接提取，

并在特定情况下进⾏⼀些额外的操作；如果没有注册过 MessageSource 对象，下方的else 结

构中会初始化⼀个默认的 DelegatingMessageSource 实现，这个实现类本身不会进⾏任何

国际化操作（输入即输出），这样做的原因是配合 APplicationContext 的功能做出的兜底

处理，因为 ApplicationContext 本身实现了 MessageSource，所以在底层必然需要⼀个

此处读者还需要注意，如果是纯Spring Framework 应用的话，默认没有预先注册的

MessageSource 对象，所以会创建 else结构中的空实现 DelegatingMessageSource，但

由于我们目前探究的是 Spring Boot 应用，Spring Boot 考虑到国际化相关的配置可以借助

application.properties 实现配置内容外部化，因此它会借助 Spring Boot 的全局配置⽂

⾃动配置类 MessageSourceAutoConfiguration，如代码清单7-57所示。

代码清单 7-57 MessageSource 的⾃动配置类会注册⼀个 MessageSource

@ConditionalOnMissingBean （name = AbstractApPlicationContext .MESSAGE_SOURCE_BEAN_NAME，

search = SearchStrategy.CURRENT）

Public class MessageSourceAutoConfiguration ｛

DCai

Public MessageSource messageSource （MessageSourceProperties properties）｛

ResourceBundleMessageSource messageSource = new ResourceBundleMessageSource （）；

1/ 应用 application.properties 外部化的配置内容

return messageSource；

由代码清单 7-57可以看到，MessageSourceAutoConfiguration 中定义了⼀个@Bean

方法，该方法会注册⼀个 ResourceBundleMessageSource 对象，这就是 Spring Boot ⾃动

类，从⽽使⾃动配置类⽣效。

初始化事件⼴播器

EventMulticaster 不是⼀回事，事件发布器用来接受事件，并交给事件⼴播器处理；事件

⼴播器取得事件发布器的事件，并⼴播给监听器。在观察者模式中，观察者是这两者的合体，

I第7章 IOC 容器的刷新

装配的 MessageSource 实现。请读者注意，若想触发该⾃动装配，需要满⾜两个条件：

• IOC 容器中不存在⼀个名称⼒"messageSource"的 Bean；

• 类路径下可以找到⼀个默认的名称为 messages.properties 的⽂件（properties ⽂

件名称会随 spring.messages.basename 的属性值改变）。

只有满⾜以上两个条件，Spring Boot 才认定当前应用⽀持它装载 MessageSource 的实现


## 7.8 initA pplicationEventMulticaster

处理完 ApplicationContext ⽀持的国际化功能后，下⼀个动作是初始化内置的事件⼴

播器。ApplicationContext 接口实现了 ApplicationEventPublisher，具备事件发布

的能⼒，注意事件发布器 ApplicationEventPublisher 与事件⼴播器 Application

在 Spring Framework 中将该职责拆分为两部分。

Applicationcontext 内部初始化事件⼴播器的逻辑如代码清单 7-58 所示。初始化

ApplicationEventMulticaster 的逻辑与初始化 MessageSource 类似，都是先判断是

否已经在 BeanFactory 中有注册，如果有则直接取并应用，否则创建默认的实现。注意，

initApplicationEventMulticaster 方法默认创建的事件⼴播器类型 simple

ApplicationEventMulticaster，这是 Spring Framework 中唯⼀具体的 Application

EventMulticaster 落地实现，因此在没有额外扩展的前提下，负责⼴播的事件⼴播器⼀定

是 SimpleApplicationEventMulticaster。

1代码清单 7-58 初始化事件⼴播器

private ApplicationEventMulticaster applicationEventMulticaster；

public static final String APPLICATION_EVENT_MULTICASTER_BEAN_NAME = "aPPlicationEventMulticaster"；

protected void initApplicationEventMulticaster（） ｛

ConfigurableListableBeanFactory beanFactory = getBeanFactory （）；

if （beanFactory.containsLocalBean （APPLICATION_EVENT_MULTICASTER_BEAN_NAME））｛

this.applicationEventMulticaster =

beanFactory•getBean （APPLICATION_EVENT_MULTICASTER_BEAN_NAME，

ApplicationEventMulticaster.class）；

1/ logger ⋯..

｝ else｛

this.applicationEventMulticaster = new SimpleApplicationEventMulticaster （beanFactory）；

beanFactory.registersingleton （APPL.ICATION_EVENT_MULTICASTER_BEAN_NAME，

this.applicationEventMulticaster）；

1/ logger …

下⾯的步骤是注册事件监听器，注意此处只是将监听器注册到事件⼴播器，并没有初始化


## 7.10 registerListeners—⼀注册监听器I


## 7.9 onRefresh- ⼀子类扩展的刷新动作

接下来的 onRetresh 方法⼜是⼀个模板方法，如代码清单7-59 所示。在Spring Framework

的基本IOC容器实现中该方法并没有值得关注的扩展，不过 Spring Boot 在此处扩展了嵌人式

Web 容器的初始化。有关嵌人式 Web 容器的内容会统⼀放到第8章中讲解。

代码清单 7-59 onRefresh 子类扩展的刷新动作

protected void onRefresh（）throws BeansException ｛

// 对于子类：默认没有任何操作


## 7.10 registerListeners -注册监听器

这些监听器对象，对应的逻辑如代码清单7-60所舌。

代码清单 7-60 注册监听器

protected void registerListeners（）｛

// 把所有的IOC容器中以前缓存好的⼀组ApplicationListener 提取出来，添加到事件⼴播器中

for（ApplicationListener<？> listener : getApplicationListeners （）） ｛

getApplicationEventMulticaster（）.addApplicationListener（1istener）；

// 将BeanFactory 中定义的所有 ApplicationListener 类型的组件全部提取出，添加到事件⼴播器中

Stringl］ 1istenerBeanNames = getBeanNamesForType （ApP1icationlistener .class, true, false）；

for（String listenerBeanName :1istenerBeanNames）｛

getApplicationEventMulticaster（）.addApplicationListenerBean （1istenerBeanName）；

// ⼴播早期事件

Set<ApplicationEvent> earlyEventsToProcess = this.earlyApplicationEvents；

this.earlyApplicationEvents = null；

i£ （earlyEventsToProcess ！= nul1）｛

for（ApplicationEvent earlyEvent ：earlyEventsToProcess） ｛

getApplicationEventMulticaster（）.multicastEvent （earlyEvent）；

public Collection<ApplicationListener<？>> getApplicationListeners （）｛

return this.applicationListeners；

所有监听器的来源包含两部分：⼀部分是在 ApplicationContext 初始化（刷新）之前

⼿动注册的；另⼀部分是在IOC容器中通过组件注册的方式添加的。对于前者只需⼀次性提取

出，并关联到事件⼴播器中；⽽对于通过组件注册的方式注册到IOC容器中的监听器，在关联

事件⼴播器时关联的是 Bean 的名称⽽不是bean对象本身，这样做的目的是防⽌监听器被不合

理地提早初始化（单实例Bean 的统⼀初始化动作在下⼀步）。

另外，请读者注意 registerListeners 方法的最后⼀个环节中会⼴播所有的早期事件，

播器后，早期事件就可以被正常⼴播了。

初始化剩余的单实例 bean

对象

借助⼀个实际的应用同步阅读。



# 第7章 IOC 容器的刷新


## 第7章 IOC 容器的刷新

这在7.1.2 节中提到过，早期事件是记录 ApplicationEventMulticaster 尚未初始化时被

⼴播的事件，当 ApPlicationEventMulticaster 被初始化完成且监听器也关联到事件⼴


## 7.11 finishBeanFactoryInitialization

接下来我们要进入IOC容器刷新的第⼆个超级复杂的重难点：初始化剩余的⾮延迟加载的

单实例bean 对象。在该阶段中，项目中定义的所有普通的单实例 bean 对象均会被创建和初始

化。本方法涉及的原理⾮常多且复杂，建议读者在阅读本节内容时最好配合 TDE 的Debug 调试，

⾸先简单介绍finishBeanFactoryInitialization 方法的总体实现，除了最后⼀⾏

方法，其余部分的所有工作都是预备性的，读者不需要在这部分投人过多精⼒。整个finish

BeanFactoryInitialization 方法的重中之重，当属最后⼀⾏ beanFactory.pre

Instantiatesingletons （），如代码清单7-61所示。

代码清单 7-61 finishBeanFactoryInitialization 初始化剩余的单实例 bean 对象

Protected void finishBeanFactoryInitialization （ConfigurablelistableBeanFactory beanFactory）｛


## 11 初始化 ConversionService，这个 ConversionService 是用于类型转换的服务接口

// 它的工作是将配置⽂件/properties 中的数据进⾏类型转换，得到真正想要的数据类型

if （beanFactory.containsBean （CONVERSION_SERVICE_BEAN_NAME）& &

beanFactory.isTypeMatch （CONVERSION_SERVICE_BEAN_NAME,Conversionservice.class））｛

beanFactory.setConversionService （

beanFactory.getBean （CONVERSION_SERVICE_BEAN_NAME,ConversionService.class））；

// 嵌入式值解析器 EmbeddedValueResolver 的组件注册，它负责解析占位符和表达式

i （！beanFactory.hasEmbeddedValueResolver （））｛

beanFactory.addEmbeddedValueResolver （strVal ->

getEnvironment（）.resolvePlaceholders （strVal））；

1/ 与LoadrimeWeaverAware 有关的部分

stringl］ weaverAwareNames = beanFactory

•getBeanNamesForType （LoadTimeWeaverAware.class, false, false）；

for （String weaverAwareName : weaverAwareNames）｛

getBean （weaverAwareName）；

beanFactory.setTempClassLoader（nu11）；

1/ 冻结配置，此时⽆论如何获取 BeanDefinition 的名称集合，

// 获取到的都是同样的（除⾮增减新的BeanDefinition）

beanFactory.freezeConfiguration（）；

//【初始化】实例化所有⾮延迟加载的单实例 Bean

beanFactory.preInstantiateSingletons （）；

以底层的初始化方法用的反⽽是最朴素的方式，这也告诉各位研讨源码的开发者，底层源码并

不神秘，很多有趣的设计本质上还是对基础部分学过的知识的运用。


## 7.11


## 7.11 finishBeanFactoryInitialization—初始化剩余的单实例 bean对象|


## 7.11.1 beanFactory.preInstantiateSingletons

preInstantiatesingletons 方法的定义来⾃ ConfigurablelistableBeanFactory，

最终实现在 DefaultListableBeanFactory 中。这个方法的分⽀逻辑⽐较多，如代码清

单7-62所舌（可以只关注源码中标有注释的部分，对于没有标注注释的源码，在第⼀次深入底

层时可以暂时忽略）。

代码清单 7-62 preInstantiateSingletons 初始化所有单实例 Bean

Public void preInstantiatesingletons（）throws BeansException （

// logger

List<String> beanNames = new ArrayList<>（this.beanDefinitionNames）；

1/ 触发所有⾮延迟加载的单实例 Bean 的初始化

// 此处循环初始化剩余的⾮延迟加载的单实例 Bean

for （String beanName :beanNames）｛

// 先合并 BeanDefinition

RootBeanDefinition bd = getMergedlocalBeanDefinition （beanName）；

// 不是抽象的、不是延迟加载的单实例 Bean 需要初始化

i （！bd.isAbstract （）&& bd.issingleton（）&& ！bd.isLazyInit（））｛


## 11 FactoryBean 默认不⽴即初始化，除⾮指定 isEagerInit=true

iE （isFactoryBean （beanName））｛

Object bean = getBean （FACTORY_BEAN_PREFIX + beanName）；

if （bean instanceof FactoryBean）｛

// FactoryBean 的处理

｝ else｛

// 普通的初始化就是getBean 方法

getBean （beanName）；

1/ 初始化的最后阶段⋯•••

简单概括代码清单 7-62 中的逻辑，在初始化所有⾮延迟加载的单实例 bean 对象时会根据

bean 对象的类型分别处理。如果 bean 对象的类型是 FactoryBean，会有单独的处理逻辑；⽽

初始化普通 bean 对象时，采用的方法是在刚开始学习 Spring Framework 时使用的 getBean 方

法！这⾥读者可以体会⼀下：Spring Framework 的底层在进⾏bean 对象的初始化时，采用的是

最基本的 getBean 方法，⽽getBean 方法本身来⾃ IOC容器的顶层接口 BeanFactory，所

getBean

BeanFactory 中的 getBean 方法在底层会转调 doGetBean 方法，这种设计是 Spring

Framework 中⾮常常⻅的方法命名⻛格，读者只需跟随方法调用步步跟进。

为多个⽚段讲解。

|第7章IOC 容器的刷新

由于 doGetBean 方法的篇幅⾮常长，为方便读者更好地阅读和理解源码，本节将其拆分

1. 别名的解析处理

在使用 Spring Framework 的注解配置类时，如果要向 IOC容器中注册新的Bean，可以使用

@Bean 注解标注到方法上进⾏定义注册。用这种方式定义时，如果显式定义@Bean 注解中的name

或 value 属性，可以为 Bean 指定名称，但请读者注意的是，name 和 value 属性可以传入

⼀个数组，这就意味着⼀个 bean 对象可以有多个名称，默认情况下传人的第⼀个名称是 bean

对象的name，其余的名称都以别名（即 alias）的方式记录在IOC容器中。⽽代码清单7-63中

的逻辑就是针对调用getBean 方法传入Bean 的别名时的处理，经过transformedBeanName

方法即可准确定位到 bean 对象的 name，进⽽继续向下执⾏获取动作。

代码清单 7-63 doGetBean （1）

Protected <T> r doGetBean （Class<T> requiredType，@Nullable Object ［］ args，

boolean typeCheckOnly）throws BeansException｛

String beanName = transformedBeanName （name）；

Object bean；

1………..

Protected String transformedBeanName （String name）

return canonicalName （BeanFactoryUtils.transformedBeanName （name））；

public String canonicalName （String name） ｛

String canonicalName = name；

vtring resoLveaName，

do｛

reSOlvedName = this.allasmap.get （canonlcaLName）；

it resolvedName：= nuLL）

canonicalName = resolvedName；

｝ while （resolvedName ！= null）；

return canonicalName；

2. 循环依赖的解决处理

紧接着的环节是尝试获取 IOC 容器中是否已经创建并缓存当前正在获取的单实例 bean 对

象，如代码清单7-64所舌。这⾥的 getSingleton 方法会针对循环依赖的情况进⾏额外处理，

有关循环依赖的内容会在7.15 节中讲解。如果可以成功获取到 bean 对象，会对 FactoryBean

类型进⾏额外处理。读者都清楚如果 IOC容器中注册了⼀个 FactoryBean，实际获取到的对

象是通过 FactoryBean的getObject 方法⽽不是 FactoryBean 本身得到的对象，此处的

getObjectForBeanInstance 方法就是调用 FactoryBean 的 getobject 方法获取真正

的对象。该方法的调用链较⻓，读者可以借助IDE 按照以下方法链寻找踪迹：getObjectFor

BeanInstance-getObjectFromFactoryBean-doGetObjectFromFactoryBean。最

终可以找到代码清单7-65中FactoryBean的getObject 方法调用。


## 7.11 finishBeanFactoryInitialization—初始化剩余的单实例 bean 对象 |

1代码清单 7-64 doGetBean （2）

// 先尝试从之前实例化好的 Bean 中找有没有当前Bean

// 如果能找到，说明Bean 已经被实例化，可以直接返回

Object sharedInstance = getsingleton （beanName）；

iE（sharedInstance ！= null && args == nul1） ｛

1/ logger•.

1/ 如果是 FactoryBean，则会调用 getObject 获取真正创建的对象

bean = getObjectForBeanInstance （sharedInstance,name,beanName,nul1） ；

11…..

代码清单 7-65 FactoryBean#getObject 方法调用

Private Object doGetObjectFromFactoryBean （FactoryBean<？> factory, String beanName）

throws BeanCreationException ｛

Object object；

try｛

1/ JMX 监控 •••••.

else｛

object = factory.getObject （）；

｝// catch throw ex ...

11…….

return object；

3. 创建前的检查

如果代码清单7-64中的getsingleton 方法没有获取到正在创建的单实例 bean 对象，说

明当前获取的bean 对象尚未创建，则执⾏下⾯的else 结构部分。⾸先 else 结构中会判断当前创

建的bean 对象是否是⼀个原型Bean 并且这个 bean 对象正在创建，如果的确正在创建则说明当

前原型Bean 在⼀次获取中即将产⽣两个对象，这种现象不合理，所以会抛出异常。

提示：有关不合理的原因，请读者思考，如果执⾏⼀次获取bean 对象的动作会产⽣两个 bean对象，

说明在创建过程中有其他机制引导IOC容器重新创建当前正在获取的bean 对象，⽽这个机制通常是

有其他原型Bean依赖了当前正在获取的bean 对象，在这种情况下如果 IOC容器不加以检查和拦截，

后果是会不断创建新的bean 对象以注入给另外的 bean 对象，最终导致内存溢出。

原型 Bean 的循环依赖检查完毕后，下⼀步要做的事情是检查⽗容器中是否包含当前 bean

对象对应的 BeanDefinition 信息。Spring Framework 为了确保IOC容器存在⽗子关系时各

司其职，底层会让每个 BeanFactory初始化⾃身持有的BeanDefinition 对应的bean 对象，

⽽不是将所有的 bean 对象集中存放在顶层容器中，这可以进⼀步体现出 BeanFactory 的层次

性。这种设计在源码中的体现是，在检查⾃身容器中不包含当前正在获取的bean 对象时调用⽗

容器的 doGetBean 方法，由⽗容器获取后返回，如代码清单7-66所示。

代码清单 7-66 doGetBean （3）


else｛

多次创建的问题。

I第7章 IOC容器的刷新

// 如果原型Bean 之间互相依赖，则⼀定会引发⽆限循环，此处会抛出循环依赖异常

i£ （isPrototypeCurrentlyInCreation （beanName））｛

throw new BeanCurrentlyInCreationException （beanName）；

// 如果本地不存在当前Bean 的定义信息，则尝试让⽗容器实例化 Bean

// 此举可以确保每个 BeanFactory 持有它应该有的 Bean，⽽不是所有的 Bean 都集中在某⼀个 BeanFactory 中

BeanFactory parentBeanFactory = getParentBeanFactory （）；

i£ （parentBeanFactory ！= null && ！containsBeanDefinition （beanName））｛

String nameToLookup = originalBeanName （name）；

if（parentBeanFactory instanceof AbstractBeanFactory）｛

return （（AbstractBeanFactory） parentBeanFactory）.doGetBean（

nameToLookup,requiredType,args, typeCheckOnly）；

｝1/ else if •.

4. 标记准备创建的 bean 对象

源码继续往下进⾏会有⼀个 bean 对象名称的标记动作，这个 markBeanAsCreated 方法

会将当前正在获取的 bean 对象的名称放人 alreadyCreated 集合中，代表当前 bean 对象已

经被创建。请注意代码清单 7-67 中 markBeanAsCreated 方法内部的设计，它使用双检锁的

机制检查当前创建的 bean 对象的名称，目的是防⽌多线程同时进⾏到该步骤⽽引发 bean 对象

1代码清单 7-67 doGetBean （4）

// 程序运⾏⾄此处，证明Bean 确需创建

if（！typeCheckOnly）｛

markBeanAsCreated（beanName）；

protected void markBeanAsCreated（String beanName）｛

if（！this.alreadyCreated.contains （beanName））｛

synchronized （this.mergedBeanDefinitions）｛

if（！this.alreadyCreated.contains （beanName））｛

clearMergedBeanDefinition （beanName）；

this.alreadyCreated.add （beanName）；

5. 合并 BeanDefinition

标记当前正在创建的bean 对象名称之后，下⼀个环节是合并 BeanDefinition，如代码

清单 7-68所示。这个合并 BeanDefinition 的动作⾮常重要。通过合并 BeanDefinition

信息，IOC 容器即可知晓当前正在创建的bean 对象需要依赖哪些bean对象，进⽽⽀撑后续的

依赖注入动作。执⾏完 getMergedlocalBeanDefinition 方法后，返回的RootBean

Definition对象中会⼀并收集当前创建的bean 对象中显式标注了@DependsOn 注解的属性。

由于标注了DependsOn 注解的属性代表强制依赖，因此IOC容器在此处会优先处理这些被强


## 7.11 finishBeanFactoryInitialization—初始化剩余的单实例 bean对象 |

制依赖的 bean 对象并将其初始化，⽽初始化的方式依然是 getBean 方法。

1代码清单 7-68doGetBean （5）

try｛

RootBeanDefinition mbd = getMergedLocalBeanDefinition （beanName）：

checkMergedBeanDefinition （mbd, beanName,args）；

// 处理当前 bean 对象的bean 对象依赖（@DependsOn 注解的依赖）

String ［］ dependson = mbd.getDependsOn（）；

if （dependsOn ！= nu11）｛

for（String dep :dependsOn）｛


## 1 1 循环依赖的检查

registerDependentBean （dep,beanName）；

try｛

getBean （dep）；

｝ // catch throw ex ⋯.....

6. bean 对象的创建

连续⼏步检查和前置处理后，代码清单7-69展示了最重要的创建对象环节。IOC容器会根据当

前正在创建的bean 对象的作用域决定如何创建对象，默认情况下IOC容器只有两种作用域：单实

例 singleton 和原型 prototype。⽽对于两者的创建机制⽽⾔，底层均通过调用 createBean方法

完成创建，说明实际创建对象的方法就是 createBean。请读者注意观察 createBean的调用方

法，对于原型 Bean，每次调用都会创建⼀个全新的对象实例，⽽对于单实例Bean，⽆论调用多少

次 getBean 方法，底层始终保持只能有⼀个对象实例，⽽IOC容器中控制单实例对象的方式是使

用getsingleton 方法配合 ObjectFactory实现，读者需要先了解这个单实例对象的控制机制。

代码清单 7-69 doGetBean（6）

1.....

i£（mbd.isSingleton （））｛

sharedInstance = getSingleton （beanName，（） ->｛

try｛

return createBean （beanName,mbd,args）；

｝ // catch throw ex •••

｝）；

bean = getObjectForBeanInstance （sharedInstance,name,beanName,mbd）；

｝ else if （mbd.isPrototype （））｛

Object prototypeInstance = nul1；

try/

beforePrototypeCreation （beanName）；

prototypeInstance = createBean （beanName,mbd， args）；

｝ Einally｛

artererototypevreation （oeanName）

bean = getObjectForBeanInstance （prototypeInstance，name，beanName,mbd）；

｝// else 其他作用域类型 bean 对象的创建.....1.....

|第7章 IOC 容器的刷新

7. getSingleton 控制单实例对象

IOC 容器控制单实例 bean 对象的最有效方式是使用缓存，在第⼀次创建好单实例bean对

象后会将其放人IOC容器中的缓存区，后续再获取该bean对象时可直接从缓存区中取出并返回。

代码清单7-70展示了 getsingleton 方法的大体脉络。

代码清单 7-70 getSingleton 控制单实例对象

private final Map<String, Object> singletonobjects - new ConcurrentHashMap<>（256）；

public Object getsingleton （String beanName,ObjectFactory<？> singletonFactory）｛

Assert.notNu11 （beanName，"Bean name must not be nu11"）；

synchronized （this.singletonobjects）｛

// 加锁后再查⼀次单实例bean 对象的缓存

Object singletonobject = this.singletonobjects.get （beanName）；

i£（singletonobject == null）｛

iE（this.singletonsCurrentlyInDestruction）｛

/ throw ex ⋯•

// 控制循环依赖的关键步骤

beforeSingletonCreation （beanName）；

try｛

1/ 【createBean】如果单实例bean 对象的缓存中没有，就创建对象

singletonobject = singletonFactory.getObject （）；

newSingleton = true；

｝ 1/ catch finally …....


## 11 新创建的单实例bean要存入单实例 bean 的缓存中

iE（newSingleton）｛

addSingleton （beanName,singletonObject）；

return singletonObject；

通读 getSingleton 方法的实现可以得知，底层控制单实例 bean 对象的方式是借助⼀个

名为 singletonobjects 的Map 充当缓存区，在获取单实例 bean 对象时，会先从缓存区中

尝试获取，如果没有获取到则会调用 singletonFactory，即代码清单 7-69 中的lambda 表

达式的 getObject方法执⾏实际创建对象的动作，⽽单实例bean对象的创建动作与原型bean

对象的⼀致（都是 createBean 方法），所以简单总结：单实例bean 对象在第⼀次创建时会调用

createBean 方法真正地创建对象，创建完毕后会存入IOC容器底层的 singletonobjects缓

存区中，后续再次获取时会直接从缓存区中取出 bean 对象并返回。

@提示：注意在singletonFactorY.getObject（）方法调用之前，还有⼀步 before

SingletonCreation 的动作，该动作是IOC 容器处理循环依赖的关键动作，具体处理流程会

在7.15节中讲解。

简单了解IOC容器中控制单实例对象的机制后，下⾯的重点环节是 createBean 方法。

try

return beanInstance；

resolveBeforelnstantiation


## 7.11 finishBeanFactoryInitialization—初始化剩余的单实例bean对象|


## 7.11.3 createBean

经过 doGetBean 方法没有实际获取到bean 对象之后，createBean负责真正的bean 对

象的创建工作。经过 createBean 方法之后必定会创建⼀个全新的对象。createBean 方法

的底层源码不复杂，抽取核心逻辑后的源码如代码清单 7-71 所示。

【代码清单 7-71 createBean 的核心逻辑

protected Object createBean （String beanName,RootBeanDefinition mbd， @Nullable ObjectI］ args）

throws BeanCreationException ｛

1/ logger ....

RootBeanDefinition nbdTouse = mbd；

1/ 根据 BeanDefinition 获取当前正在创建的bean 对象的类型

Class<?> resolvedClass = resolveBeanClass （mbd, beanName）；

if （resolvedClass ！= nu11 && ！mbd.hasBeanClass（）&& mbd.getBeanClassName（）！= nul1）｛

mbdTouse = new RootBeanDefinition（mbd）；

mbdToUse.setBeanClass （resolvedClass）；

try｛


## 1 后置处理器拦截创建 bean对象

Object bean = resolveBeforeInstantiation （beanName,mbdToUse）；

if （bean ！= null）｛

return bean；

｝1/ catch


## 11 真正创建bean对象

Object beanInstance = doCreateBean （beanName,mbdTouse,args）；

catch.....

根据 createBean 方法的主⼲逻辑，可以提取出实际创建bean 对象的两个切人点：通过

resolveBeforeInstantiation 方法创建 bean对象；通过 doCreateBean 方法创建bean

对象。根据以往阅读源码的经验，此处更为明显的方法是doCreateBean，但是

resolveBeforeInstantiation 方法同样值得关注，下⾯先来看 resolveBefore

Instantiation 方法的实现。

resolveBeforeInstantiation 方法可以理解为“实例化之前的处理”，由方法名可以

获取到⼀点额外信息：doCreateBean 的确是创建 bean 对象的核心逻辑，resolve

BeforeInstantiation 只是核心逻辑之前的拦截⽽已。通过代码清单 7-72可以了解到，拦

截 bean 对象的创建⾏通过 InstantiationAwareBeanPostProcessOr 实现，如果容器

中包含这类后置处理器，则会执⾏拦截动作尝试创建bean 对象，反之则不会拦截。

代码清单 7-72 resolveBeforelnstantiation

Protected Object resolveBeforeInstantiation（String beanName, RootBeanDefinition mod）｛

着重观察拦截的动作，它共有两个回调后置处理器的方法，分别是使用 Instantiation

必须回调

AutoProxyCreator 的逻辑进⽽⽣成代理对象。

|第7章 IOC容器的刷新

Object bean = null；

i （！Boolean.FALSE.equals （mbd.beforeInstantiationResolved））｛

i£ （！mbd.isSynthetic（） && hasInstantiationAwareBeanPostProcessors （））｛

Class<?> targetType = determineTargetType （beanName,mbd） ；

if （targetType ！= nul1）｛

// 执⾏所有 InstantiationAwareBeanPostProcessor

bean = applyBeanPostProcessorsBeforeInstantiation （targetType，beanName）：

if （bean！= nul1）｛

// 如果成功创建了 bean 对象，则执⾏ BeanPostProcessor 的后置初始化

bean = applyBeanPostProcessorsAfterInitialization （bean,beanName）；

mbd.beforeInstantiationResolved=（bean ！= nu11）；

return bean；

AwareBeanPostProcesSOr 的 postProcessBeforeInstantiation 方法创建对象以及

使用 BeanPostProcessor 的postProcessAfterInitialization 方法增强对象。可能

有读者会不理解，为什么通过 postProcessBeforeInstantiation 方法创建出对象后，还

需要回调 BeanPostProcessor 的 postProcesSAfterInitialization 进⾏后置处理

呢？这个问题要结合 BeanPostProcessor 的经典应用 AOP 来解释。BeanPostProcessor 的

postProcesSAfterInitialization 方法可以用于⽣成代理对象，如果⼀个 bean 对象被

InstantiationAwareBeanPostProcessOr 提前创建之后，还需要被AOP 增强，这时就

BeanPostProcessor 的 postProcesSAfterInitialization 方法，触发

实际的回调后置处理器的方法的底层逻辑基本⼀致，都是获取到IOC容器中注册的所有后置处

理器并⼀⼀回调，代码清单 7-73 展示了所有回调 InstantiationAwareBeanPostProc

essor 的postProcessBeforeInstantiation 方法的实现（逻辑本身很简单，不再展开）。

代码清单 7-73 回调 postProcessBeforelnstantiation 方法

Protected Ob］ect appLybeanrostrrocessorsberoreLnstantlation （CLasss:2 beancLass，

String beanName）｛

Eor （BeanPostProcessor bp : getBeanPostProcessors （））｛

// 循环找出所有的 InstantiationAwareBeanPostProcessor

if （bp instanceof InstantiationAwareBeanPostProcesSOr）｛

// 调用它们的postProcessBeforeInstantiation 尝试实例化 bean 对象

InstantiationAwareBeanPostProcessor ibp =（InstantiationAwareBeanPostProcessor）bp；

Object result = ibp.postProcessBeforeInstantiation（beanClass， beanName）；

if （result ！= nul1）｛

return result：

return null；

由于每⼀步的逻辑都⾮常复杂，所以本节内容会⾮常长，读者需要细心跟进。

读和理解源码，本节将其拆分为多个⽚段讲解。


## 7.11 fnishBeanFactoryInitialization—初始化剩余的单实例 bean对象|


## 7.11.4 doCreateBean

如果 InstantiationAwareBeanPostProcessor 没有创建出bean 对象，则需要执⾏

docreateBean 方法创建bean 对象的实例。doCreateBean 方法从主⼲逻辑上可抽取为三大

步骤。

1.实例化 bean 对象（此时 bean 对象中所有属性均为空）。

2. 属性赋值&依赖注人。

3. bean 对象的初始化（执⾏完该步骤后 bean 已经完整）。

1. 实例化 bean 对象

实例化 bean 对象是创建对象的第⼀步，只有创建出对象之后才能进⾏后续的赋值、依赖注

人、初始化逻辑回调等方法。创建 bean 对象的动作在代码清单 7-74 中体现为 create

BeanInstance 方法。由于 createBeanInstance 方法篇幅⾮常⻓，为便于读者更好地阅

代码清单 7-74 doCreateBean （1）

protected Object doCreateBean （String beanName,RootBeanDefinition mbd，

@Nullable Object ［］ args） throws BeanCreationException ｛

BeanWrapper instanceNrapper = null；

i£ （instanceWrapper == nul1）｛

1/ 真正的bean 对象创建动作

instanceNrapper = createBeanInstance （beanName,mbd,args）；

// 得到真实的bean 对象引用

Object bean = instancewrapper.getWrappedInstance （）；

Class<?> beanType = instanceNrapper.getWrappedClass （）：

if （beanType ！= Nul1Bean.class）｛

mbd.resolvedTargetType= beanrype；

11….

（1）解析 bean 对象的类型

createBeanInstance 方法的第⼀环节会先检验当前要创建的bean 对象所属类型是否可

以被正常访问，如果 bean 对象所属类型本⾝⽆法被 Spring Framework 底层正常访问，则会因为

⽆法创建对象⽽抛出异常。

代码清单 7-75 createBeanlnstance （1）

Protected BeanNrapper createBeanInstance （String beanName,RootBeanDefinition mbd，

@Nullable Object ［］ args）｛

1/ 解析出bean 对象的类型

Class<?> beanClass = resolveBeanClass （mbd,beanName）；

// 如果bean 对象⽆法被访问，则抛出异常

iE （beanClass ！= null && ！Modifier.isPublic（beanClass.getModifiers （））

&& ！mbd.isNonPublicAccessA11owed （））｛

// throw ex ⋯

工⼚类型的创建逻辑，则会直接执⾏工⼚创建逻辑。注意，这⾥的工⼚包含两种情况，下⾯分

别解释。

需⼀般了解。

I第7章 IOC 容器的刷新

11….…...

（2） 工⼚方法创建

代码清单7-76中的两段逻辑本质上是做同⼀件事情：如果在 BeanDefinition 中指定了

1代码清单 7-76 createBeanlnstance （2）

11⋯...

// Spring Framework 5.x 的新特性

Supplier<？> instanceSupplier = mbd.getInstanceSupplier（）；

i£（instanceSupplier ！= nu11）1

return obtainFromsupplier （instancesupplier, beanName）；

// 工⼚方法创建

if（mbd.getFactoryMethodName （）！= nul1）｛

return instantiateUsingFactoryMethod （beanName,mbd, args）；

InstanceSupplier

InstanceSupp1ier 的设计来⾃ AbstractBeanDefinition，是 Spring Framework 5.0

之后出现的新API。JDK 8之后多了⼏个很重要很实用的函数式接口，Supplier 作为⽣产型

接口，与工⼚的思路类似，Supplier 可以完成构造bean对象的工作，所以在BeanDefinition

中加入了 Instancesupplier 的设计，作 factory-method 的⼀个替代方案。不过⼀般

情况下项目开发中不会直接操作 BeanDefinition，所以对于 Instancesupplier 读者只

factoryMethod

基于 Spring Boot的项目开发中更多接触到的是 factoryMethod，注解配置类中被@Bean

注解标注的方法，其本质就是工⼚方法。代码清单 7-84的逻辑中会执⾏ instantiateUsing

FactoryMethod 方法来触发 factoryMethod，底层会根据工⼚名称找到对应的静态工⼚/实例

工⼚/注解配置类对象（如果是注解配置类的话，还需要解析@Bean 方法上的参数列表注人对应

的依赖），随后反射执⾏工⼚方法⽣成 bean 对象。整体方法的逻辑很复杂，感兴趣的读者可以

借助 IDE 深入研究，本书不再附源码。

（3）原型 Bean 的创建优化

当程序运⾏⾄代码清单 7-77处，意味着当前需要创建的bean 对象是使用普通的构造方法

创建。对于单实例 Bean ⽽⾔，代码清单 7-77中的逻辑在程序运⾏期间只会执⾏⼀次，这部分

工作显得⽐较多余。⽽对于原型Bean ⽽⾔，该部分工作就可以发挥其价值，由于原型Bean 在

程序运⾏期间每次创建的过程通常是相同的，IOC容器考虑到执⾏效率的问题后权衡利弊，

终选择以空间换时间的策略，在第⼀次原型 bean 对象创建完成后，将创建过程中引用的构造方

法参数缓存到 BeanDefinition 中，以备后续创建时可以直接取出。


## 7.11 finishBeanFactoryInitialization—初始化剩余的单实例 bean对象|

】 代码清单 7-77 createBeanlnstance （3）

/1 这⼀步是为原型Bean 创建的优化

boolean resolved = false；

boolean autowireNecessary = false；

if （args == null）｛

synchronized（mbd.constructorArgumentLock）｛

i （mbd.resolvedConstructorOrFactoryMethod！= nu11）｛

resolved = true；

autowireNecessary = mbd.constructorArgumentsResolved；

if （resolved）｛

if （autowireNecessary）｛

return autowireConstructor （beanName,mbd, null,nu11）；

｝ else｛

return instantiateBean （beanName,mbd）；

（4）实例化 bean 对象的真实动作

如果程序运⾏⾄代码清单 7-78 处，代表当前是IOC容器第⼀次创建 bean对象，需要严格

遵循构造方法的创建原则。对象的基本创建流程是解析构造方法⼀构造方法参数注入⼀反射调

用构造方法创建对象实例。如果当前创建的 bean 对象所属类型中有显式定义带参数的构造方法，

则会依次解析构造方法参数列表，并⼀⼀进⾏依赖注人。

1代码清单 7-78 createBeanlnstance （4）

// 回调 SmartInstantiationAwareBeanPostProcessor 寻找构造方法

Constructor<？>［］ ctors = determineConstructorsFromBeanPostProcessors （beanClass,beanName）；

// 触发执⾏基于构造方法的实例化判断

i （ctors ！= nu11 || mbd.getResolvedAutowireMode（）== AUTOWIRE_CONSTRUCTOR

I mbd.hasConstructorArgumentValues （） I| ！ObjectUtils.isEmpty （args））｛

// 此处会额外缓存创建当前 bean 对象所需的构造方法参数

recuth autowireconstructor （oeanName, moar Ctors args）i

ctors = mbd.getPreferredConstructors （）；

if （ctors ！= null）｛

return autowireConstructor （beanName,mbd, ctors,nul1）；

return instantiateBean （beanName,mbd）；

请读者注意，当触发以下任意条件时，IOC容器会选择使用显式构造方法的对象实例化方

式：1）通过 SmartInstantiationAwareBeanPostProcessor 找到了构造方法；2）配置

⾃动注人方式为 AUTOWIRE_CONSTRUCTOR; 3）使用 XML 配置⽂件的方式定义Bean 时指定了

constructor-arg 标签；4）调用getBean 方法获取 bean 对象时传人了 args 参数。

核心的赋值和注入动作。

I第7章 IOC 容器的刷新

如果当前正在创建的bean 对象没有指定任何构造方法，则会使用默认的⽆参构造方法创建

对象，具体的逻辑在最后⼀⾏代码 instantiateBean 方法中，如代码清单 7-79 所示。

instantiateBean 方法的核心动作是获取 InstantiationStrategy，调用 BeanUtils.

instantiateClass 方法反射实例化 bean 对象。


## 1 代码清单 7-79 instantiateBean 使用默认构造方法创建对象

protected BeanWrapper instantiateBean（final String beanName,final RootBeanDefinition mbd）｛

try｛

Object beanInstance；

final BeanFactory parent = this；

i£ /

// 借助 InstantiationStrategy

beanInstance = getInstantiationstrategy（）.instantiate （mbd, beanName,parent）；

BeanWrapper bw = new BeanWrapperImp1（beanInstance）；

initBeanWrapper （bw）；

return bw：

经过 createBeanInstance 方法后，即可得到⼀个对象内部没有任何额外注人的bean

对象，bean 对象的实例化完毕。

2. 属性赋值前的收集

进入属性赋值与依赖注人的核心逻辑之前，在 doCreateBean 方法中还有⼀个额外的逻

辑：属性赋值前的注解信息收集。这⾥先对该逻辑进⾏讲解，如代码清单7-80所示。之后才是

代码清单 7-80 doCreateBean （2）

11....

synchronized（mbd.postProcessingLock）｛

if （！mbd.postProcessed）｛

try｛

applyMergedBeanDefinitionPostProcessors （mbd, beanType,beanName）；

｝ // catch⋯

mbd.PostProcessed = true；

1…...

代码清单 7-80 中的核心方法是 try-catch 结构中的 applyMergedBeanDefinitionPost

Processors 方法，该动作会回调 IOC 容器中的所有 MergedBeanDefinitionPost

ProcesSOr，其中有⼏个重要的后置处理器需要了解，下⾯⼀⼀列举。

（1） InitDestroyAnnotationBeanPostProcessor

由类名可知，InitDestroyAnnotationBeanPostProcessOr 的核心处理工作与Bean

的初始化和销毁动作有关，它的逻辑在 postProcessMergedBeanDefinition 方法中，该

｝

final


## 7.11 finishBeanFactoryInitialization—初始化剩余的单实例bean 对象 |

方法会扫描和收集当前正在创建的bean 对象中标注了@PostConstruct 和@PreDestroy 注

解的方法。代码清单 7-81中简要展示了 InitDestroyAnnotationBeanPostProcesSOr 的

核心方法实现。源码中匹配注解时使用的 initAnnotationType 与 destroyAnnotation

Type 刚好分别对应@PostConstruct 与@PreDestroy 注解。

代码清单 7-81 InitDestroyAnnotationBeanPostProcessor 源码（节选）

private LifecycleMetadata buildLifecycleMetadata （final Class<?> clazz） ｛


List<LifecycleElement> initMethods = new ArrayList<>（）；

List<LifecycleElement> destroyMethods = new ArrayList<>（）；

Class<?> targetClass = clazz：

ao1

finalList<LifecycleElement> currInitMethods = new ArrayList<>（）：

finalList<LifecycleElement> currDestroyMethods = new ArrayList<>（）；

// 反射所有的public 方法

ReflectionUtils.dowithlocalMethods （targetClass,method -> ｛

// 寻找所有被初始化注解@PostConstruct 标注的方法

if（this.initAnnotationType ！= nul1

&& method.isAnnotationPresent（this.initAnnotationType））｛

LifecycleElement element = new LifecycleElement （method）；

currInitMethods.add（element）；

1/ 寻找所有被销毁注解@PreDestroy 标注的方法

i （this.destroyAnnotationType ！= nul1

&& method.isAnnotationPresent （this.destroyAnnotationType））｛

currDestroyMethods.add（new LifecycleElement （method））；

｝）；.....

｝// 依次向上寻找⽗类

while （targetClass！= nu11&& targetClass ！= Object.class）；

// return..

（2）CommonAnnotationBeanPostProcessor

CommonAnnotationBeanPostProcessOr 的作用是收集当前正在创建的bean 对象中标

注了 JSR-250 规范注解的元信息，这个后置处理器扩展⾃ InitDestroyAnnotationBean

PostProcesSOr，所以它也具备收集@PostConstruct 和@PreDestroy 注解的能⼒。除此

之外，CommonAnnotationBeanPostProcessor 还可以额外收集JSR-250规范中的其他注

解信息（如@Resource 注解），其核心收集逻辑如代码清单 7-82所舌。

代码清单 7-82 CommonAnnotationBeanPostProcessor 源码（节选）

do｛

List<InjectionMetadata.InjectedElement> currElements = new ArrayList<>（）；

Reflectionutils.dowithlocalFields （targetClass, field -> ｛

if（webServiceRefClass ！= null && field.isAnnotationPresent （webServiceRefClass））｛

1/ 检查…

currElements.add （new WebServiceRefElement （field, field, nu11））；

人有关的注解信息，它的底层收集原理与上述两种后置处理器基本⼀致，因此这⾥不再展示收



# 第7章 IOC 容器的刷新


## 第7章 IOC 容器的刷新

｝ else if （ejbClass ！= null && field.isAnnotationPresent （ejbClass））｛


## 11 检查

CurrElements.add （new EjbRefElement（field, field, nul1））；

｝ else if （field.isAnnotationPresent （Resource.class））｛

//检查⋯•⋯...

if （！this.ignoredResourceTypes.contains （field.getrype （）.getName （）））｛

CurrElements.add （new ResourceElement （field, field,null））；

｝）；

（3） AutowiredAnnotationBeanPostProcessor

由类名可知 AutowiredAnnotationBeanPostProcessor 具备的能⼒是收集与⾃动注

集相关的逻辑，⽽重点观察 AutowiredAnnotationBeanPostProcesSOr ⽀持的注解类型，

如代码清单 7-83所示。可以发现 AutowiredAnnotationBeanPostProcessor 在构造方法

中已经指定好默认⽀持的两个注解，分别是@Autowired 与@Value 注解，此外，如果当前项

目中有来⾃JSR-330规范的@Inject 注解，则会⼀并⽀持。

代码清单 7-83 AutowiredAnnotationBeanPostProcessor ⽀持的注解

public AutowiredAnnotationBeanPostProcessor （）｛

this.autowiredAnnotationTypes.add （Autowired.class）；

this.autowiredAnnotationTypes.add （Value.class）；

try｛

this.autowiredAnnotationTypes.add（（

Class<？ extends Annotation>）ClassUtils.forName （"javax.inject.Inject"，

AutowiredAnnotationBeanPostProcessor.Class .getClassLoader （）））；

3. 早期bean 对象引用的获取与缓存

Bean 中的注解信息收集完毕后，接下来有⼀个获取早期bean对象引用的动作，如代码清

单7-84所示。该步骤是为了解决 bean 对象之间循环依赖的问题，这⾥先就“早期bean 对象的

引用”这个概念简单解释，完整的循环依赖解决方案会在7.15 节中讲解。

1代码清单 7-84 doCreateBean （3）

11..

boolean earlysingletonExposure =（mbd.isSingleton（）&& this.allowCircularReferences &&

isSingletonCurrentlyInCreation （beanName））；

if （earlysingletonExposure）｛

// 处理循环依赖的问题

addSingletonFactory （beanName， （）-> getEarlyBeanReference （beanName,mbd,bean））；

从 doCreateBean 方法的前半段逻辑中可以发现，bean 对象被创建之后尚未进⾏属性赋

值和依赖注入的动作，但此时的bean对象已经实实在在地存在。如果在此期间有另外的bean

对象⼜需要依赖它时，就不应该再创建同样的⼀个 bean 对象，⽽是直接获取当前 bean 对象的

引用即可，“早期bean 对象的引用”的设计就是为了解决bean 之间的循环依赖⽽产⽣的。


## 7

中间的两部分逻辑执⾏完毕后，接下来到了创建对象的第⼆个核心步骤：属性赋值与依赖

读和理解源码，这⾥将其拆分为多个⽚段讲解。

finishBeanFactoryInitialization- -初始化剩余的单实例bean 对象|

4.属性赋值与依赖注入

注入。从代码清单7-85中可以发现该步骤与下⾯的初始化bean 对象步骤紧挨着。⾸先介绍

populateBean 方法的逻辑。由于 populateBean 方法的篇幅⾮常⻓，为便于读者更好地阅

【代码清单 7-85 doCreateBean （4）

Object exposedObject = bean；

try｛

populateBean （beanName,mbd,instanceWrapper）；

exposeaulJect = LhitlalLzebean （oeanName， exposedObject,mbd）；

（1）回调 InstantiationAwareBeanPostProcessor

第⼀个重点关注的源码⽚段是代码清单 7-86 中回调所有的 InstantiationAwareBean

PostProcesSOr，注意此处回调的方法是 postProcesSAfterInstantiation，⽽且在这

段源码的上方有⼀段注释，原⽂及翻译如下：

Give any InstantiationAwareBeanPostProcessors the opportunity to modify the state of the bean

before properties are set. This can be used, for example, to support styles of field injection.

在设置属性之前，让任何 InstantiationAwareBeanPostProcesSOr 都有机会修改

Bean 的状态，例如⽀持属性字段的注入。

从注释中可以得到的关键信息是，postProcessAfterInstantiation 方法是⼀个可

以⼲预 Bean 的属性、状态等信息的扩展点。另外请读者注意⼀个细节，postProcess

AfterInstantiation 方法的返回值是 boolean 类型，当 postProcessAfterInst

antiation 返回 false 时会直接返回，不再执⾏真正的属性赋值+组件依赖注入的逻辑，这就

意味着 postProcesSAfterInstantiation 提供了流转控制的能⼒，它可以决定当前创建

的bean 对象是否可以执⾏IOC容器默认的属性赋值和依赖注人的逻辑。

【代码清单 7-86 populateBean （1）

protected void populateBean（String beanName,RootBeanDefinition mbd， @Nullable BeanWrapper bw）｛

1/ 前置检

if（！mbd.isSynthetic（） && hasInstantiationAwareBeanPostProcessOrs （））｛

for （BeanPostProcessor bp :getBeanPostProcessors（））｛

if （bp instanceof InstantiationAwareBeanPostProcesSOr）｛

InstantiationAwareBeanPostProcessor ibp =

（InstantiationAwareBeanPostProcessor）bp；

i£ （！ibp.postProcessAfterInstantiation （bw.getWrappedInstance （），beanName）） ｛

对象已经实例化完毕但还没有开始属性赋值和依赖注入时切入⾃定义逻辑。

这⾥不再展开。

组件的依赖注入动作，⽽负责依赖注入的后置处理器是前⾯提到过的 AutowiredAnnotation

【第7章 IOC 容器的刷新

此外可能有读者会产⽣疑问，该扩展点有何实际意义？请读者思考，当bean 对象的创建逻

辑执⾏⾄此，此时bean 对象的内部所有需要赋值和注入的属性全部空，⽽且尚未执⾏任何初

始化逻辑，所以postProcessAfterInstantiation方法回调的意义是，允许开发者在bean

（2）⾃动注人的⽀持

紧接着的第⼆段源码是对早期IOC中⾃动注人的⽀持，如代码清单 7-87 所示。在Spring

Framework 5.1 之前的版本中，可以使用@Bean 注解中的 autowire 属性指定 bean 对象的⾃动

注入模式。⾃动注入模式指的是组件中的类型/属性名与需要注入的bean 对象的类型/name完全

⼀致，⽆须标注@Autowired 等注解就能实现依赖注入的效果。由于 Spring Framework 5.1 及

之后的版本对于@Bean注解标注的方法提供了@Autowired 注解的⽀持，⾃动注入的特性便被

Spring Framework 废弃，因此该特性仅供了解，感兴趣的读者可以⾃⾏借助IDE 深入源码了解，

1代码清单7-87 populateBean （2）

1..

PropertyValues pvs =（mbd.hasPropertyValues（）？ mbd.getPropertyValues（）：nul1）；

// 解析出当前bean ⽀持的⾃动注入模式

int resolvedAutowireMode = mbd.getResolvedAutowireMode （）；

i （resolvedAutowireMode == AUTONIRE_BY_NAME I1 resolvedAutowireMode == AUTOWIRE_BY_ TYPE）1

MutablePropertyvalues newPvs = new MutablePropertyValues （pvs）；

i （resolvedAutowireMode == AUTONIRE_BY_NAME）｛

autowireByName （beanName,mbd,bw,newPvs）；

i£ （resolvedALtowireMode == AUTONIRE_BY_TYPE）｛

autowireByType （beanName,mbd,bw, newPvs）；

pvs = newPvs；

（3） 回调 InstantiationAwareBeanPostProcessor

⾃动注入匹配完成后，代码清单7-88中的逻辑会再⼀次提取出所有的Instantiation

AwareBeanPostProcessor 并回调其 postProcessProperties 方法，该方法中包含了所有

BeanPostProcessOr，对应的逻辑源码如代码清单7-89所舌。

代码清单 7-88 populateBean （3）

for（BeanPostProcessor bp : getBeanPostProcessors （））｛

i （bp instanceof InstantiationAwareBeanPostProcesSOr）｛

InstantiationAwareBeanPostProcessor ibp = （InstantiationAwareBeanPostProcesSor）bp；

// 回调 postProcessProperties

PropertyValues pvsrouse = ibp.postProcessProperties （pvs，

bw.getWrappedInstance（），beanName）；

1…••


## 7

方法在执⾏时会对这些元素逐个进⾏依赖注入。具体到单个元素的注入逻辑，本质上是使用反

细展开。

finishBeanFactoryInitialization——初始化剩余的单实例bean 对象 |

代码清单 7-89 AutowiredAnnotationBeanPostProcessor#postProcessProperties

Public PropertyValues postProcessProperties （PrOpertyvalues pvs, Object bean, String beanName）！

InjectionMetadata metadata = findAutowiringMetadata（beanName,bean.getClass （），pvs）；

try｛

metadata.inject （bean,beanName,Pvs）；

｝// catch…..

Lecuc Pvs：

public void inject （Object target， @Nullable String beanName，@Nullable PropertyValues pvs）

throws Throwable ｛

Collection<InjectedElement> checkedElements = this.checkedElements；

1/ 收集所有要注入的信息

Collection<InjectedElement> elementsToIterate =

（checkedElements ！= nul1 ? checkedElements :this.injectedElements）：

if （！elementsToIterate.isEmpty（））｛


## 11 迭代，依次注入

for（InjectedElement element :elementsToIterate） ｛

// logger ⋯

element.inject （target,beanName,pvs）；

观察 AutowiredAnnotationBeanPostProcessor 的 postProcessProperties方

法实现，可以发现方法内部会提取出属性赋值前收集的所有标注了@Autowired、@value、

@Inject 注解的方法信息封装对象 InjectionMetadata，并调用其 inject 方法进⾏实际

的依赖注入。由于 InjectionMetadata 中已经组合了所有需要被注入的元素，因此 inject

射机制将需要注入的bean 对象设置到对应的成员属性，或反射调用 setter 方法进⾏赋值。具体

的底层实现⽐较复杂，感兴趣的读者可以借助IDE 深人探究，这⾥不对单个元素的注入逻辑详

提示：BeanFactoryPostProcessor 与BeanDefinitionRegistryPostProcessor

⽆法被@Autowired 等注解⽀持，其原因就在于，在 BeanFactoryPostProcesSOr 初始化

阶段，容器中尚不存在 BeanPostProcesSOr，所以用于⽀持依赖注入的后置处理器

AutowiredAnnotationBeanPostProcesSOr 尚未初始化，⾃然⽆法提供依赖注入的⽀持。

如果需要在 BeanFactoryPostProcessor，和 BeanDefinitionRegistryPost

ProcesSOr 中注入 BeanFactory 或 ApplicationContext 等核心组件，正确的做法是使

用Aware 接口的回调注入。

（4）属性赋值

经过前⾯⼏个步骤后，最终⽣成的是⼀个 PropertyValues 对象，该对象中封装了当前

经过该阶段后，bean 对象的属性赋值和依赖注入工作完成。

的所有核心逻辑。

步骤讲解。

I第7章IOC 容器的刷新

正在创建的 bean 对象中需要依赖的所有属性赋值类元素，最后执⾏的 applyProperty

Values 方法实际上就是把前⾯准备好的 PropertyValues 对象封装的内容应用到当前正在

创建的bean 对象实例中，如代码清单 7-9所示。由于 applyPropertyValues 方法的源码篇

幅较长且可研究价值不⾼，感兴趣的读者可以借助 IDE ⾃⾏深人调试，这⾥只简单概述

applyPropertyValues 方法的作用，不再展开详细讲解。

】代码清单 7-90 populateBean （4）

if （needsDepCheck）｛

if （EilteredPds == nul1）｛

filteredPds = filterPropertyDescriptorsForDependencyCheck （bw, mbd.al1owCaching）；

checkpependencles （beanName, moar L1Lterearas, Pvs）；

i£ （pvs ！=nul1）｛

// 将 PropertyValues 应用到 Bean

applyPropertyValues （beanName,mbd,bw,Pvs）；

applyPropertyValues 方法在底层会依次进⾏预检查、缓存预处理、属性值解析器的

初始化、属性类型转换，以及最终将属性值反射注入 bean 对象的成员属性这5个步骤，其中属

性值解析器要依赖 Spring Framework 中的⼀个核心 API—-TypeConverter。利用 Type

Converter 可以将⼀个 String 类型的数据转换为特定的所需的类型的值，⽽ Bean

DefinitionValueResolver 利用 TypeConverter 可以完成对 bean 对象实例中需要注人

的属性值进⾏解析，并适配为 bean 对象成员属性所需的类型（如 String-int、依赖 bean 对象的

名称转换为实际 bean 对象的引用等）。

5. bean 对象的初始化

当 bean 对象的创建过程进入 initializeBean 方法时，意味着 bean 对象中的属性已基

本⻬全，但⽣命周期相关的逻辑都还没有回调，下⾯展开讲解 initializeBean 方法中回调

由代码清单 7-91可以总体了解到，initializeBean 方法中包含4个回调逻辑，下⾯分

代码清单 7-91 initializeBean

protected Object initializeBean （String beanName, Object bean， @Nullable RootBeanDefinition mbd）｛

if（...）｛...｝ else｛

// 执⾏ Aware 类型接口的回调

invokeAwareMethods （beanName,bean）；

Object wrappedBean = beani

// 执⾏ BeanPostProcessor 的前置回调

i（mbd == nul1 || ！mbd.isSynthetic（））｛

理器，应当联想到它的作用，下⾯⻢上就可以看到。


## 7.11 finishBeanFactoryInitialization——初始化剩余的单实例 bean 对象|

wrappedBean = applyBeanPostProcessorsBeforeInitialization（wrappedBean,beanName）；

try｛

// 执⾏⽣命周期回调

invokeInitMethods （beanName,wrappedBean,mbd）；

｝// catch…...

// 执⾏ BeanPostProcessor 的后置回调

if （mbd == nul1 I1 !mbd.issynthetic（））｛

wrappedBean = applyBeanPostProcessorsAfterInitialization （wrappedBean,beanName）；

return wrappedBean；

（1） invokeAwareMethods—执⾏ Aware 回调

第⼀个回调的初始化逻辑是有关 Aware 回调注入的动作。请注意，由此处可以总结⼀点：

Bean 的所有依赖注入动作不全都是在populateBean 方法中实现的。

从代码清单7-92 中可以发现，invokeAwareMethods 的实现方式⾮常简单，只需判断当

前bean 对象是否实现了特定的Aware 接口方法以及强转后的接口方法调用。另外请读者注意，

有关ApplicationContext接口及相关组件的注入逻辑没有在invokeAwareMethods方法

中体现，如果读者还记得在7.3 节中提到的 ApplicationContextAwareProcessor 后置处

代码清单 7-92 invokeAwareMethods

Private void invokeAwareMethods （String beanName,Object bean）｛

if （bean instanceof Aware）｛

if（bean instanceof BeanNameAware）｛

（（BeanNameAware）bean）. setBeanName （beanName）；

if （bean instanceof BeanClassLoaderAware）｛

ClassLoader bcl = getBeanClassLoader （）；

if （bcl ！= nul1）｛

（（BeanClassloaderAware） bean）.setBeanClassLoader （bcl）；

i£（bean instanceof BeanFactoryAware）｛

（（BeanFactoryAware） bean）.setBeanFactory （AbstractAutowireCapableBeanFactory.this）；

（2） applyBeanPostProcessorsBeforeInitialization

紧接着执⾏的初始化⽣命周期回调逻辑是执⾏ BeanPostProcessor 的 postProcess

BeforeInitialization 方法，如代码清单7-93所示。回调逻辑本身很简单，但是中间有⼀

个分⽀设计需要注意。如果⼀个 BeanPostProcessor 处理bean 对象后返回的结果为 nu11，

则不再执⾏剩余的BeanPostProcessOr，⽽直接返回上⼀个 BeanPostProcesSOr处理之

后的bean 对象并返回。由此特性可以提示开发者在设计后置处理器时，通过设计 post

特殊的拦截处理。

下⾯简单了解在此处有关键作用的两个后置处理器实现类。

InitDestroyAnnotationBeanPostProcessor 不仅在属性赋值之前收集所有标注了

【第7章 IOC 容器的刷新

ProcessBeforeInitialization 方法的返回值可以针对项目中某些特定的 bean 对象设计

1代码清单 7-93 applyBeanPostProcessorsBeforelnitialization

public Object applyBeanPostProcessorsBeforeInitialization （Object existingBean, String beanName）

throws BeansException ｛

Object result = existingBean；

for （BeanPostProcesSOr ProcesSOr : getBeanPostProcessors （））｛

Object current = processor.PostProcessBeforeInitialization （result, beanName）；

1/ 注意此处做了⼀个分⽀控制

// 如果处理完的结果返回nu11，则认为停⽌ BeanPostProcessor 的处理，返回 bean 对象

i£ （current == nul1）｛

return result；

result = current；

return resulti

InitDestroyAnnotationBeanPostProcessor

@PostConstruct 和@PreDestroy 的方法，还负责在 postProcessBeforeInitialization 方

法中回调 bean 对象中所有标注了@PostConstruct 注解的方法。底层回调方法的机制是获取

到 applyMergedBeanDefinitionPostProcessors 方法中缓存好的方法集合，并利用反

射机制对方法逐个回调，如代码清单7-94所示。

1代码清单7-94 回调所有@PostConstruct 注解标注的方法

public object postProcessBeforeInitialization （Object bean,String beanName）

throws BeansException ｛

LifecycleMetadata metadata = findLifecycleMetadata （bean.getClass（））；

metadata.invokeInitMethods （bean, beanName）；

catch......

return bean；

public void invokeInitMethods （Object target,String beanName）throws Throwable ｛

Collection<LifecycleElement> checkedInitMethods = this.checkedInitMethods；

Collection<LifecycleElement> initMethodsToIterate =

（checkedInitMethods ！= null ? checkedInitMethods : this.initMethods）；

i£ （！initMethodsToIterate.isEmpty（））｛

for（LifecycleElement element : initMethodsToIterate）｛

element.invoke （target）；

public void invoke （Object target）throws Throwable ｛

ReflectionUtils.makeAccessible （this.method）；

this.method.invoke （target， （0bject ［］）nu11）；

获取其访问权，这也意味着对于方法的访问修饰符没有强限制。


## 7.11 finishBeanFactoryInitialization—初始化剩余的单实例 bean 对象 |

这⾥注意两点：最终回调方法时传入的参数是空对象，这也解释了为什么在使用

@PostConstruct 注解标注方法时方法⼀定要设置为空参数方法；反射执⾏目标方法时会先

ApplicationContextAwareProcessor

对于所有与ApplicationContext 相关的Aware 接口回调注人，在底层会由Application

ContextAwareProcessor 统⼀负责，它本身⽀持6个 Aware 子接口的回调注入，具体如代

码清单7-95所示。invokeAwareInterfaces 方法中回调的实现与 invokeAwareMethods 如

出⼀辙，这⾥不再展示，读者可以借助 IDE ⾃⾏翻阅源码。

代码清单 7-95 ApplicationContextAwareProcessor ⽀持回调注入逻辑

Public Object PostProcessBeforeInitialization （Object bean, String beanName）

Carows beans bxceptiont

if（！（bean instanceof EnvironmentAware |I bean instanceof EmbeddedValueResolverAware

| bean instanceof ResourceloaderAware |I bean instanceof ApplicationEventPublisherAware

I bean instanceof MessageSourceAware II bean instanceof ApplicationContextAware））｛

此处重点关注两个后置处理器的实现。

AbstractAutoProxyCreator

部分的内容本书放到第9章详细讲解，此处读者只需要大概了解。

事件⼴播器。

【第7章 IOC 容器的刷新

&& ！（isInitializingBean && "afterPropertiesSet" .equals （initMethodName））

&& ！mbd.isExternallyManagedInitMethod （initMethodName））｛

// 回调 init-method 方法（同样是反射调用）

invokeCustomInitMethod （beanName,bean,mbd）；

（4） applyBeanPostProcessorsAfterInitialization

最后⼀步是回调所有 BeanPostProcessor 的后置拦截处理，回调的机制与前置拦截⼏

平完全⼀致，所以 applyBeanPostProcessOrsAfterInitialization 的源码不再展示，

所有以 AutoProxyCreator 结尾的类通常都与AOP相关，且都是具备代理对象创建能⼒

的后置处理器，可以在bean 对象本身的初始化逻辑回调完成后根据需要创建代理对象。有关该

ApplicationListenerDetector

ApplicationListenerDetector 在7.3.3节中提到过，它的作用是关联所有监听器的

引用，在ApplicationListener 类型的bean 对象创建时 ApplicationListenerDetector

会检测并将其添加到 ApplicationContext 中，关联 ApplicationEventMulticaster

6. 注册销毁时的回调

initializeBean 方法执⾏后，bean 对象的创建逻辑已基本执⾏完毕，在doCreateBean

方法的最后有⼀个对 DisposableBean 类型的bean 对象的处理逻辑。如果⼀个 bean 对象的

所属类型实现了 DisposableBean接口，或者内部方法中标注了@PreDestroy 注解，或者

声明了 destroy-method 方法，则会在 doCreateBean 方法的最后阶段注册⼀个销毁 bean

对象的回调钩子，如代码清单7-97所示。

代码清单 7-97 doCreateBean （5）

try｛

registerDisposableBeanIfNecessary （beanName,bean,mbd）；

｝ // catch⋯

return exposedObject；

protected void registerisposableBeanIfNecessary （String beanName,Object bean，

RootBeanDefinition mbd）｛

AccesscontrolContext acc = （System.getSecurityManager（）！= nul1

？ getAccessCont rolContext（）：nu11）；

1/ 不是原型bean，且有定义销毁类型的方法

i （！mbd.isPrototype （）&& requiresDestruction （bean, mbd））｛

if （mbd.isSingleton （））｛

registerDisposableBean （beanName,new DisposableBeanAdapter （bean，

beanName,mbd,getBeanPostProcessors （），acc））；


## 7

finishBeanFactoryInitialization—初始化剩余的单实例bean 对象|

1/ 处理特殊的 scope⋯•••.

由代码清单7-97 可知，通常情况下记录销毁bean 对象的回调原则是单实例bean 对象，

并且有定义销毁类型的方法。该部分被记录的 bean 对象将在IOC容器关闭时回调其⾃定义销

毁逻辑。

⾄此，doCreateBean 方法执⾏完毕，⼀个 bean 对象被创建完成并返回。


## 7.11.5 SmartInitializingSingleton

所有⾮延迟加载的单实例 bean 对象创建完成后，在preInstantiatesingletons 方法

的最后有⼀段额外的逻辑，这段逻辑是 Spring Framework 4.1 之后新添加的回调处理，用于触发

所有实现了 SmartInitializingsingleton 接⼜的bean 对象的额外初始化逻辑。从源码⾓

度分析可知，SmartInitializingsingleton 的设计是为了让 BeanFactory 也有机会控

制和回调 bean 对象的额外扩展的⽣命周期逻辑，⽽不再强依赖于 ApplicationContext 控

制；从使用⻆度看，SmartInitializingsingleton 接口的引入实际上是在⾮延迟加载的

单实例 bean 对象全部创建完成后提供⼀个统⼀的扩展回调时机，利用这个回调时机在

Application Context 的初始化完成之前可以处理⼀些特殊的逻辑。回调

SmartInitializingsingleton 类型 bean 对象的逻辑⾮常简单，仅仅是遍历后回调其

aftersingletonsInstantiated 方法，如代码清单 7-98所示。

1代码清单 7-98 回调 SmartInitializingSingleton 类型的方法

else｛

getBean （beanName）；

for （String beanName :beanNames）｛

object singletonInstance = getsingleton （beanName）；

iE （singletonInstance instanceof smartInitializingsingleton）｛

SmartInitializingsingleton smartsingleton =（SmartInitializingSingleton）

singletonInstance；

1/ JMX 相关⋯•

else ｛

smartsingleton.aftersingletonsInstantiated（）；

｝

｝

｝

经过上述⼀系列复杂逻辑后，finishBeanFactoryInitialization 方法执⾏完毕，

所有⾮延迟加载的单实例bean 对象全部完成创建并初始化。

个步骤值得关注，分别展开讲解。

I第7章 IOC 容器的刷新


## 7.12 finishRefresh- -刷新后的动作

所有⾮延迟加载的单实例bean 对象初始化完毕后，后续的动作相对⽐较简单。finish

Refresh 方法负责的工作基本以收尾性质为主，如代码清单 7-99所示。方法内部实现中有两

代码清单7-99 刷新后的动作

Protected void finishRefresh（）｛

// 清除资源缓存（如扫描的 ASM 元数据）

clearResourceCaches（）；

// 初始化⽣命周期处理器

initLifecycleProcessor （）；

// 回调 LifecycleProcessor 的刷新动作

getLifecycleProcessor （）.onRefresh（）；

// 发布容器刷新完成的事件，触发特定的监听器

publishEvent （new ContextRefreshedEvent （this））；

LiveBeansView.registerApplicationContext （this）；


## 7.12.1 LifecycleProcessor

对于 bean 对象的⽣命周期⽽⾔，除了在 initializeBean 方法中会执⾏的 init-

method、@PostConstruct 等扩展点，Spring Framework 还通过Lifecycle 接口提供了⼀

个更晚的时机。这个接口为 bean 对象提供了新的⽣命周期回调切人时机，可以在IOC容器的启

动、停⽌时⾃动触发Lifecycle 接口中的start 方法和 stop 方法。代码清单7-100展示了

LifecycleProcessor 的初始化动作，默认注册的⽣命周期处理器类型⼒ Default

LifecycleProcessor。

】代码清单 7-100 初始化⽣命周期处理器

public static final String LIFECYCLE_PROCESSOR_BEAN_NAME = "1ifecycleProcessor"；

protected void initLifecycleProcessor（）｛

ConfigurableListableBeanFactory beanFactory = getBeanFactory（）；

i£ （beanFactory.containsLocalBean （LIFECYCLE_PROCESSOR_BEAN_NAME））｛

this.lifecycleProcessor =

beanFactory.getBean （LIFECYCLE_PROCESSOR_BEAN_NAME, LifecycleProcessor.class）；

// logger

｝ else｛

DefaultLifecycleProcessor defaultProcessor = new DefaultLifecycleProcessor （）；

aelauLtrrocessor.seLbeanractory （oeantactory）；

this.lifecycleProcessor = defaultProcessor；

beanFactory.registerSingleton （LIFECYCLE_PROCESSOR_BEAN_NAME,this.lifecycleProcessor）；

// logger ••


## 7.13 -清除缓存


## 7.13 resetCommonCaches—清除缓存I


## 7.12.2 getiL.ifecycleProcessor0.onRefresh（

LifecycleProcessor 初始化完毕后，紧接着会执⾏其 onRefresh 方法，如代码

清单 7-101 所舌。注意这个方法的内部有⼀个⽐较难理解的设计，需要读者仔细观察和理解。

代码清单 7-101回调 Lifecycle 类型的 Bean

public void onRefresh（）｛

startBeans （true）；

this.running = true；

Private void startBeans （boolean autoStartuponly） ｛

Map<String,Lifecycle> 1ifecycleBeans = getLifecycleBeans （）；

Map<Integer, LifecycleGroup> phases = new HashMap<>（）；

1ifecycleBeans.forEach（（beanName,bean）->｛

// 注意此处，如果 autostartuponly 为true，则不会执⾏

if（！autoStartupOnly

I （bean instanceof SmartLifecycle && （（SmartLifecycle） bean）.isAutoStartup（）））｛

int phase = getPhase （bean）；

LifecycleGroup group = phases.get （phase）；

i£ （group == nul1）｛

group = new LifecycleGroup（phase,this.timeoutPerShutdownPhase，

1ifecycleBeans,autostartupOnly）；

Phases.Put （Phase,group）；

group.add （beanName,bean）；

｝）；

i£ （！phases.isEmpty（））｛

List<Integer> keys = new Arraylist<>（phases.keySet （））；

Collections.sort （keys）；

EOr（Integer key :keys）｛

1/ 依次调用Lifecycle 的start 方法

phases.get （key）.start（）；

观察代码清单 7-101中的逻辑，由于 onRefresh 方法中调用的 startBeans （true）；传

人的参数是 true,1ifecycleBeans.forEach 部分不会执⾏，因此在该阶段不会回调

Lifecycle 的start 方法。如果要触发回调Lifecycle接口的 start 方法，需要显式调用

ApplicationContext 的start 方法。由于在 Spring Boot 的启动过程中没有回调start 方

法，所以仅实现 Lifecycle 接口的bean 对象并不会被回调。如果需要在IOC容器的刷新过程中

⾃动回调，需要实现 Lifecycle 的子接口 SmartLifecycle，并确保 isAutostartup 方法的

返回值 true（底层默认 true），以此法编写的bean 对象即可实现 start 方法的⾃动回调。

resetCommonCaches—

refresh 方法的最后⼀步是收尾相关的动作，该方法会清除整个IOC 容器刷新期间的缓

开发者切入利用。理解这些扩展点，可以在构建实际项目的底层架构和扩展时更加容易和游刃

有余。

读者看到第⼀个步骤可能会有⼀些诧异，第⼀个扩展点竟然不是 BeanFactory

|第7章 IOC 容器的刷新

存，如代码清单7-102 所示。从源码⻆度讲已⽆研究价值，故不再展开。

1代码清单7-102 清除缓存

protected void resetCommonCaches （）｛

ReflectionUtils.clearCache （）；

AnnotationUtils.clearCache （）；

Resolvablerype.clearCache （）；

CachedIntrospectionResults.clearClassLoader （getClassLoader （））；

⾄此，ApplicationContext 的刷新动作执⾏完毕。


## 7.14 ApplicationContext 初始化中的扩展点

介绍了整个 refresh 方法后，想必读者已经清楚地理解 ApP1icationContext 中容器

刷新的逻辑。本节内容会梳理整个 APp1icationContext 的初始化逻辑中有哪些扩展点可供

提舌：基于 Spring Boot 的应用包含ApplicationContextInitializer 等组件，在第6章

已经讲过，所以本节只讨论原⽣ Spring Framework 有关的部分。对于原⽣ Spring Framework 来讲，

⼀般情况下不会在 ApplicationContext 的初始化和 refresh 动作之间进⾏太多的处理，⽽

主要从refresh 方法本身考虑，所以以下梳理的扩展点都来⾃ refresh 方法开始触发时。


## 7.14.1 invokeBeanFactoryPostProcessors

refresh 方法的前四个步骤中，在普通的 ApplicationContext 下都⽆法切入，所以

第⼀个可切人的步骤是第五步的 invokeBeanFactoryPostProcessors 方法，这个方法中

可供切入的点⾮常多，下⾯⼀⼀列举。

1. ImportSelector 和 ImportBeanDefinitionRegistrar

PostProcessor 或者 BeanDefinitionRegistryPostProcesSOr，其原因是它们的执⾏

时机通常都在 ConfigurationClassPostProcessor 之后，⽽ ConfigurationClass

PostProcesSor 的执⾏过程中会解析@Import 注解，提取出其中的 ImportBeanDef

initionRegistrar 并执⾏，所以第⼀个扩展点是 ImportSelector 和 ImportBeanDef

initionRegistrar 接口。

注意对⽐这两者的区别，ImportSelector 在该阶段只能获取当前@Import 标注的注解

配置类的信息，⽽ ImportBeanDefinitionRegistrar 在该阶段除了可以获取当前

@Import 标注的注解配置类的信息，更重要的是能获取 BeanDefinitionRegistry，由此可供

扩展的动作主要是给 BeanDefinitionRegistry 中编程式注册新的 BeanDefinition。

？ 提示：此处把 BeanDefinitionRegistry 看作 DefaultListableBeanFactory 也可以。

2. BeanDefinitionRegistryPostProcessor

入的注解，且不会产⽣任何代理对象。


## 7.14


## 7.14 ApplicationContext 初始化中的扩展点|

最特殊的 ConfigurationClassPostProcessOr 执⾏完成后才是普通的 BeanDefi

nitionRegistryPostProcessor 接口。使用 BeanDefinitionRegistryPostProc

essor 可以获取 BeanDefinitionRegistry 对象，利用 BeanDefinitionRegistry 可

以直接向 IOC 容器中编程式注册新的 BeanDefinition，以及移除容器中已有的

BeanDefinitiono

请注意，⼀般情况下，⾃定义的 BeanDefinitionRegistryPostProcessOr 的执⾏时

机⽐内置的 ConfigurationClassPostProcessOr 晚，这也是 Spring Framework 最开始的

设计（ConfigurationClassPostProcessor 实现了 Priorityordered接口，这个接口

的优先级最⾼）。

提示：注意此处的措辞是“⼀般情况下”，说明可以出现例外情况。如果确需编写⼀个执⾏时机⽐

ConfigurationClassPostProcesSOr 早的 BeanDefinitionRegistryPost

ProceSSOr，可以让 BeanDefinitionRegistryPostProcesSOr 实现 Priority

Ordered 接口，声明较⾼执⾏优先級（不能是 Ordered.LOWEST_PRECEDENCE，否则排序

规则会变成字⺟表顺序）。经过此设计之后，⾃定义的BeanDefinitionRegistryPostPro

cessor 即可在 ConfigurationClassPostProcesSOr 之前执⾏。

3. BeanFactoryPostProcessor

BeanFactoryPostProcessor 的切入时机紧随 BeanDefinitionRegistryPost

Processor 之后。请注意，BeanFactoryPostProcessor 与 BeanDefinition

RegistryPostProcessOr 的⼀个核心区别在于，在 BeanFactoryPostProcesSOr 的切

入回调中，可以获取的参数是 ConfigurableListableBeanFactory ⽽不再是 Bean

DefinitionRegistry，这就意味着在当前阶段原则上不应向 BeanFactory 中注册新的

BeanDefinition，只能获取和修改现有的 BeanDefinition。

另外还需要关注javadoc 中提到的⼀点，BeanFactoryPostProcesSOr 的处理阶段中允

许提早初始化 bean 对象，但是这个阶段中只有 ApPlicationContextAwareProcesSor 注

册到了 BeanFactory 中，没有其余关键的 BeanPostProcessOr，所以这个阶段初始化的

bean 对象有⼀个共同的特点：可以使用 Aware 回调注入，但⽆法使用@Autowired 等依赖注

finish BeanFactoryInitialization

下⾯来到最复杂的环节：初始化⾮延迟加载的单实例 bean 对象。这⾥⾯的切人时机⾮常多，

前⾯通过研究 getBean 方法的⼀系列调用中，可以看到 bean 对象的实例化和初始化过程中有

⾮常多可供切入的时机，逐个来看。

©提示：本方法中涉及的所有切入，点均 针对单个 bean 对象的扩展。

1. InstantiationAwareBeanPostProcessor#postProcessBeforelnstantiation

在 bean 对象的实例化阶段之前，InstantiationAwareBeanPostProcessor 可以前

那么选择合适的构造方法去创建对象就是很重要的⼀步。筛选构造方法的核心动作会在底层寻

⽆返回值的结果。

内部未内置使用逻辑，项目开发中只有在极特的场景中才可能会对该方法加以利用，所以

可以进⾏属性赋值等动作，但考虑到职责分离原则，该步骤通常不会进⾏赋值和注人动作）。

类型中的信息已收集完毕。下⼀个步骤需要根据 InstantiationAwareBeanPostProcessor

作用。

I第7章 IOC 容器的刷新

置拦截 bean 对象的实例化动作，IOC 容器中的任何bean对象在创建之前都会尝试使用

InstantiationAwareBeanPostProcesSor 来代替创建，如果没有任何 Instantiation

AwareBeanPostProcessor 可以拦截创建，则会执⾏真正的bean 对象实例化流程。

请注意，在 InstantiationAwareBeanPostProcesSor 的 postProcessBefore

Instantiation 方法中，只能取 bean 对象对应的Class 类型以及 bean 对象的名称（由于

InstantiationAwareBeanPostProcessOr 实例化对象本身是凭空创建的，因此仅需

Class 类型就⾜够了）。如果 postProcessBeforeInstantiation 方法返回 nu11，则代

表 InstantiationAwareBeanPostProcessor 不参与拦截bean 对象创建的动作。

2. SmartlnstantiationAwareBeanPostProcessor#determineCandidateConstructors

如果在实例化 bean 对象之前 InstantiationAwareBeanPostProcessor 没有拦截创

建成功，就会通过构造方法创建对象。如果⼀个 bean 对象的所属类型中定义了多个构造方法，

找所有 SmartInstantiationAwareBeanPostProcesSOr，回调 determineCandidate

constructors 方法获取可选择的构造方法。如果在这⾥打入Debug 断点，程序运⾏时可以

停在断点但不会有具体的返回值，该现象产⽣的原因是，默认情况下Configuration

ClassPostProcessor 会向 IOC 容器中注册⼀个 ImportAwareBeanPostProcesSOr，但

该后置处理器未重写 determineCandidateConstructors 方法，这就造成了方法会执⾏但

⼀般情况下，SmartInstantiationAwareBeanPostProcesSOr 在 Spring Framework

SmartInstantiationAwareBeanPostProcesSOr 仅供了解。

3. MergedBeanDefinitionPostProcessor#postProcessMergedBeanDefinition

在 doCreateBean 方法中的 createBeanInstance 执⾏完毕之后，此时 bean 对象已经

实例化并返回，但需要属性赋值和依赖注入的成员属性空。之后 doCreateBean 方法会执

⾏到 applyMergedBeanDefinitionPostProcessors 步骤，回调所有 MergedBeanDefi

nitionPostProcessor 收集 bean 对象所属Class 中的注解信息。在7.11.4节中列出了三个

关键的 MergedBeanDefinitionPostProcessor，它们分别是 InitDestroyAnno

tationBeanPostProcessor（收集@PostConstruct 与@PreDestroy 注解）、Common

AnnotationBeanPostProcessOr（收集 JSR-250的其他注解）、AutowiredAnnotation

BeanPostProcessor（收集⾃动注入相关的注解）。

在此处切入扩展，意味着可以对bean 对象所属的Class执⾏⼀些处理或者收集的动作（也

4. InstantiationAwareBeanPostProcessor#postProcessAfterlInstantiation

所有MergedBeanDefinitionPostProcesSOr 执⾏完成后，此时 bean 对象所属的Class

的 postProcessAfterInstantiation 方法的返回值决定是否继续执⾏后续的

populateBean 和 initializeBean 方法初始化 bean 对象。

所以在 postProcessAfterInstantiation 方法切入扩展逻辑只能起到流程控制的

postProcessPro

对象的初始化动作结束。

完成后进⾏统⼀回调，这⼜属于⼀个整体动作，读者要仔细体会 SmartInitializing

循环依赖的解决方案

的处理方案。


## 7.15 循环依赖的解决方案I

5. InstantiationAwareBeanPostProcessor#postProcessProperties

下⼀个切入点在 InstantiationAwareBeanPostProcesSOr 的

perties 方法中，这个步骤会将 bean 对象对应的 PropertyValues 中封装赋值和注入的属

性和依赖对象实际应用到 bean对象的实例中。通常情况下，在该阶段内部起作用的后置处理器

是 AutowiredAnnotationBeanPostProcesSOr，它会搜集 bean 对象所属的Class 类型

中标注了@Autowired、@Value、@Resource 等注解的属性和方法，并反射赋值/调用。

在此处扩展逻辑相当于扩展了后置处理器的属性赋值＋依赖注入逻辑。当 post

ProcessProperties 方法执⾏完毕后，将不再有新的属性赋值和组件注入的回调动作产⽣。

6. BeanPostProcessor

属性赋值和依赖注入完成后，下⼀个核心步骤是 initializeBean 方法，该方法中包含

BeanPostProcessOr 的前后两个执⾏动作 postProcessBeforeInitialization 和

postProcessAfterInitialization。进入 initializeBean 方法后，bean 对象的⽣命

周期已经到了初始化逻辑回调阶段，此时 bean 对象中注入的属性均已完备，Bean

PostProcessor 的切人大多是给 bean 对象添加⼀些额外的属性的赋值、回调以及⽣成代理对

象等动作。

在 BeanPostProcessor 中切入扩展逻辑相当于针对⼀个接近完善的bean 对象进⾏扩展

或包装。当后置处理器执⾏完 post ProcessAfterInitialization 方法后，意味着 bean

7. SmartinitializingSingleton

IOC 容器中的最后⼀个扩展动作是 SmartInitializingsingleton，它会在所有⾮延

迟加载的单实例 bean 对象全部初始化完成后回调扩展。在该阶段中会提取出所有实现了

SmartInitializingsingleton 接口的 bean 对象，回调其 aftersingletonsInstan

tiated 方法。请注意，SmartInitializingsingleton 接口的设计是为了让 Bean

Factory 也能参与bean 对象初始化完成后的扩展处理，并没有太深层⾯的考虑。

另外注意⼀个细节，SmartInitializingsingleton 这个扩展本身是针对单个 bean对

象的，⽽不是切入所有 bean 对象，所以严格意义上讲它属于 bean对象初始化的扩展点，但是

SmartInitializingsingleton 的处理时机是在 BeanFactory 把单实例bean 对象初始化

singleton 的设计，理解上不要产⽣偏差。


## 7

IOC 容器初始化 bean 对象的逻辑中可能会遇到 bean 对象之间循环依赖的问题。Spring

Framework 不提倡在实际开发中设计bean 对象之间的循环依赖，但是当循环依赖的场景出现时，

IOC 容器内部可以恰当地予以解决。本节内容会全⾯讲解不同场景下的循环依赖以及IOC容器


## 7.15.1 循环依赖的产⽣

循环依赖，简单理解就是两个或多个 bean 对象之间互相引用（互相持有对方的引用）。以

PersonCat

循环依赖的产⽣通常与具体业务场景有关，例如在电商系统中，用户服务和订单服务之间

就会存在循环依赖：用户服务需要依赖订单服务查询指定用户的订单列表，订单服务需要根据

的处理策略，下⾯逐个展开讲解。

的容器，它用来解决循环依赖。

须重复设计。

理的时机。下⾯通过⼀个具体的舌例来讲解循环依赖的处理思路。

I第7章 IOC容器的刷新

下假定⼀个场景，人（Person）与猫（Cat）之间相互引用，人养猫，猫依赖人，用UML.类图

可以抽象为图7-1所舌。

.Use.

Y

+ person:Person

+ getPerson（）：Person

+ setPerson（Person）：void

+ cat: Cat

+getCal（）：Cat

+setCat（Cat）： void

*uise'

图7-1 循环依赖的简单示意

用户的详细信息对商品订单分类处理。Spring Framework 会针对不同类型的循环依赖实⾏不同


## 7.15.2 循环依赖的解决模型

IOC容器内部对于解决循环依赖主要使用了三级缓存的设计，其中的核心成员如下。

• singletonobjects：⼀级缓存，存放完全初始化好的bean 对象容器，从这个集合

中提取出来的 bean 对象可以⽴即返回。

• earlysingletonobjects：⼆级缓存，存放创建好但没有初始化属性的bean 对象

• singletonFactories：三级缓存，存放单实例 Bean 工⼚的容器。

• singletonsCurrentlyInCreation：存放正在被创建的bean 对象名称的容器。

上述成员均在 DefaultListableBeanFactory 的⽗类 DefaultsingletonBeanReg

istry中。DefaultSingletonBeanRegistry 本身是⼀个单实例 bean 对象的管理容器，

DefaultListableBeanFactory继承它之后可以直接获得单实例bean 对象的管理能⼒⽽⽆


## 7.15.3 基于 setter/@Autowired 的循环依赖

Spring Framework 可以解决的循环依赖类型是基于 setter 方法或@Autowired 注解实现属

性注入的循环依赖，整个 bean 对象的创建阶段和初始化阶段是分开的，这给了IOC 容器插⼿处

1. 编写测试代码

为了单独研究IOC容器处理循环依赖的场景，下⾯的源码不再依赖Spring Boot，⽽是使用

原始的 Spring Framework 注解驱动IOC 容器测试。所有涉及的测试代码如代码清单 7-103所舌。

@Component

@Autowired

｝


## 7.15 循环依赖的解决方案|

1代码清单 7-103 循环依赖的测试代码

public class Person｛

Cat cat；

@Component

public class Cat 1

@Autowired

Person person；

Public class App1

public static void main（Stringl］ args） ｛

Applicationcontext ctx - new AnnotationconfigApplicationcontext

（"com. 1inkedbear.springframework.bean"）；

｝

由于 AnnotationConfigApplicationcontext 在创建时传入了组件扫描的根包，底

层会在扫描后⾃动刷新 IOC容器，由此就可以触发 person 与 cat 对象的初始化动作。

2. 初始化 Cat

由于在字⺟表中 cat ⽐ person 的⾸字⺟靠前，IOC 容器会先初始化 cat对象。

（1） getSingleton 中的处理

从7.11.2 节中的bean 对象创建流程中可以得知，在 doGetBean 和 createBean 方法之

间有⼀个特殊的步骤beforesingletonCreation，如代码清单7-104 中的中间部分。

】代码清单 7-104 getSingleton 方法中的关键处理步骤

private final Map<string, object> singletonobjects = new ConcurrentHashMap<>（256）；

Public Object getSingleton （String beanName,ObjectFactory<？>singletonFactory） ｛

Assert.notNu11 （beanName，"Bean name must not be nul1"）；

synchronized（this.singletonObjects）｛

Object singletonobject = this.singletonobjects.get （beanName）；

i£ （singletonObject == nul1）｛

// 【控制循环依赖的关键步骤】

beforeSingletonCreation （beanName）；

11…….

try ｛

singletonobject = singletonFactory.getObject （）；

newSingleton = true；

｝// catch finally …..

beforeSingletoncreation 方法⾮常关键，它会检查当前正在获取的 bean 对象是否存

中已经存在，说明出现了循环依赖（同⼀个对象在⼀个创建流程中被创建了两次），则抛出

I第7章IOC容器的刷新

在于 singletonsCurrentlyInCreation 集合中。如果当前 bean 对象对应的名称在该集合

BeanCurrentlyInCreationException 异常如代码清单 7-105所示。

代码清单 7-105 检查当前正在获取的bean 对象是否已经在创建中

protected void beforeSingletonCreation（String beanName）｛

if （！this.inCreationCheckExclusions.contains （beanName）

&& ！this.singletonsCurrentlyInCreation.add （beanName））｛

throw new BeanCurrentlyInCreationException （beanName）；

（2）对象创建完毕后的处理

第⼀次进入 doGetBean 方法汇总，此时 cat 对象对应的名称不在 singletonsCurrently

Increation 集合中，可以顺利进入 createBean-doCreateBean 方法中，⽽

doCreateBean 方法⼜分为3个步骤，其中第⼀个步骤 createBeanInstance 方法执⾏完

毕后，⼀个空的 cat 对象已经被成功创建，如图7-2所示。此时这个 cat 对象被称为“早期

Bean”，⽽且被 BeanWrapper 包装。

~ = instanceWrapper = ｛BeanWrapperimp/@1786）

f cachedlntrospectionResults = null

f acc= null


## 4 autoGrowCollectionLimit = 2147483647

>f wrappedObject = ｛Cat@1792）

>nestedPath= "

v f rootObject = （Cat@1792）

person = null

图 7-2 createBeanInstance 方法执⾏后产⽣属性均为空的cat 对象

接下来进入 populateBean 方法之前，源码中⼜设计了⼀个逻辑，该逻辑会提前暴簬当

前正在创建的bean 对象引用，如代码清单 7-106所示。

1代码清单 7-106 earlySingletonExposure 的设计

Protected Object doCreateBean （finalString beanName,final RootBeanDefinition mbd，

final @Nullable Object［］ args）throws BeancreationException ｛


boolean earlySingletonExposure =（mbd.isSingleton（）&& this.allowCircularReferences

&& issingletonCurrentlyInCreation （beanName））；

if （earlysingletonExposure）｛

addsingletonFactory （beanName，（）-> getEarlyBeanReference （beanName,mbd,bean））；

11…….

注意源码中的 earlysingletonExposure 变量，它的值需要由三部分判断结果共同计

算产⽣，包括：

• 当前创建的bean 对象是⼀个单实例bean 对象；


## 7.15 循环依赖的解决方案|

• IOC 容器本⾝允许出现循环依赖（默认为 true，在 Spring Boot 2.6.0 之后默认为 false）；

• 正在创建的单实例 bean 对象名称中存在当前bean 对象的名称。

前两个条件的判断结果在当前测试场景中显然可知为 true，⽽第三个判断条件中，由于在

上⼀个环节中看到 singletonsCurrentlyInCreation 集合中已经放入了当前正在创建的

"cat"名称，因此第三个条件的判断结果也为 true。三个条件的判断结果全部 true，所以会执

⾏ if结构中的 addSingletonFactory 方法，如代码清单 7-107所舌。

代码清单 7-107 addSingletonFactory

addSingletonFactory （beanName，（） -> getEarlyBeanReference （beanName,mbd,bean））；

protected void addSingletonFactory （String beanName，ObjectFactory<？> singletonFactory）｛

Assert.notNull（singletonFactory，"Singleton factory must not be null"）；

synchronized （this.singletonobjects）｛

if（！this.singletonobjects.containsKey （beanName））｛

this.singLetonractories.Put（oeanName, SingLetonractory）：

this.earlySingletonobjects.remove （beanName）；

this.registeredSingletons.add （beanName）；

请注意，addsingletonFactory 方法的第⼆个参数是⼀个 ObjectFactory，在方法

调用时以 Lambda 表达式传入。⽽方法的内部实现逻辑是将当前正在创建的bean 对象名称保存

到三级缓存 singletonFactories 中，并从⼆级缓存 earlySingletonobjects 中移除。

此处由于⼆级缓存中没有正在创建的"cat"名称，因此当前环节可以简单理解为仅将 cat 对象

的名称"cat"放入了三级缓存 singletonFactories 中。

（3）依赖注入时的处理

下⼀个处理的时机是在 cat 对象的依赖注入时。由于使用@Autowired 注解注入了 Person

对象，AutowiredAnnotationBeanPostProcessor 会在 postProcessProperties 方

法回调时将 person 对象提取出并注入 cat 对象中。⽽注入的底层逻辑依然是使用 Bean

Factory 的getBean 方法，如代码清单7-108中的⼀系列方法调用所示。

代码清单 7-108 被依赖对象的底层获取逻辑

Public PropertyValues postProcessProperties （PropertyValues pvs, object bean, String beanName）｛

InjectionMetadata metadata = findAutowiringMetadata （beanName,bean.getClass（），Pvs）；

try｛

metadata.inject （bean,beanName,Pvs）；

｝// catch

PV I

protected void inject （Object bean，@Nullable String beanName，@Nullable PropertyValues pvs）

throws Throwable ｛

Field field = （Field） this.member；

1/ 从BeanFactory 中获取被依赖对象

//【此处源码有调整】

Object value = beanFactory.resolveDependency （desc,beanName，

autowiredBeanNames,typeConverter）；

法中有⼀个⾮常关键的环节：getsingleton。注意方法名与上⾯讲解的⼀致，但它是另⼀个

|第7章 IOC 容器的刷新

i （value ！= null） ｛

// 反射注入属性

ReflectionUtils.makeAccessible （field）；

field.set （bean,value）；

public object resolveDependency （DependencyDescriptor descriptor，

@Nu1lable String requesting BeanName，@Nullable Set<String> autowiredBeanNames，

@Nullable TypeConverter typeconverter）throws BeansException ｛

// if-else ••

//【此处源码有调整】

Object result = doResolveDependency （descriptor,requestingBeanName，

autowiredBeanNames,typeConverter）；

return result；

Public Object doResolveDependency （DependencyDescriptor descriptor，@Nullable String beanName，

@Nullable Set<String> autowiredBeanNames，@Nullable TypeConverter typeConverter）

throws BeansException ｛

// try•..

if（instanceCandidate instanceof Class）｛

instanceCandidate = descriptor.resolveCandidate （autowiredBeanName,type,this）；

public Object resolveCandidate （String beanName,Class<?> requiredrype，

BeanFactory beanFactory） throws BeansException｛

return beanFactory.getBean （beanName）；

当执⾏到最后⼀个方法 resolveCandidate 时，会触发 person 对象的初始化全流程。

3. 初始化 Person

创建 person 对象的过程与创建 cat 类似，都是执⾏getBean-doGetBean，其中包含

getsingleton 的处理，以及对象创建完毕后将 Person 对象包装为 ObjectFactory 后放

入三级缓存 singletonFactories 中，最后到了依赖注入的环节。由于 person 中使用

@Autowired 注解注人了 cat，因此 AutowiredAnnotationBeanPostProcessor 处理注

人的逻辑与代码清单7-107 中⼀样，从 BeanFactory 中获取 cat 对象。

（1） 再次获取 cat 对象的细节

再次获取 cat 对象时执⾏的方法依然是 getBean-doGetBean，但是在 doGetBean 方

重载方法，如代码清单 7-109所示。

1代码清单 7-109 getSingleton 检查正在创建中的bean 对象

Protected Object getSingleton （String beanName，

boolean allowEarlyReference）｛

Object singletonObject = this.singletonobjects.get （beanName）；

// 检查当前获取的bean 对象是否正在创建

的特殊作用。

初始化逻辑相关处理，该动作也与循环依赖⽆关，⼀并跳过。


## 7.15 循环依赖的解决方案|

iE（singletonObject == nul1 && isSingletonCurrentlyInCreation （beanName））｛

synchronized（this.singletonobjects）｛

// 检查⼆级缓存中是否包含当前正在创建的bean 对象

singletonobject = this.earlysingletonobjects.get （beanName）；

if（singletonobject == nul1 && allowEarlyReference）｛

// 检查三级缓存中是否包含当前正在创建的bean 对象

ObjectFactory<？> singletonFactory = this.singletonFactories.get （beanName）；

if （singletonFactory ！= null）｛

// 将bean 对象放入⼆级缓存，并从三级缓存中移除

singletonobject = singletonFactory.getObject （）；

this.earlysingletonobjects .put （beanName,singletonObject）；

this.singletonFactories.remove （beanName）；

return singletonObject；

仔细观察代码清单7-109中的逻辑，IOC 容器为了确保⼀个单实例bean 对象不被多次创建，

在此处下了⾮常大的检查成本，检查的范围如下：如果当前获取的bean 对象正在创建，并且⼆

级缓存 earlysingletonobjects 中没有正在创建的 bean 对象以及三级缓存 sing

letonFactories 中存在正在创建的bean 对象，说明当前获取的bean 对象是⼀个没有完成

依赖注入的不完全对象。即便当前 cat 是⼀个不完全对象，它也真实地存在于IOC容器中，不

会影响 cat 与 person 对象之间的依赖注入（即属性成员的引用），所以 getsingleton 方法

会在判断条件成⽴后，将当前正在获取的cat对象从三级缓存singletonFactories中移除，

并放人⼆级缓存 earlysingletonObjects 中，最后返回 cat 对象。

getsingleton 方法执⾏完成后的状态如图7-3所示。

f singletonFactories = （HashMap@1779） size = 1

“person"-> ｛AbstractAutowireCapableBeanFactory$lambda@1854｝

f earlySingletonObjects = （HashMap@1780｝ size = 1

“cat"-> （Cat@1701｝

图 7-3 getSingleton 方法执⾏完毕后缓存的状态

提示：注意⼀点，此处如果仅有⼀级缓存，也可以处理循环依赖，Spring Framework 在此处设计了

两级缓存，是考虑到AOP的情况，7.15.6节会分析AOP场景下第三级缓存singletonFactories

（2）Person 初始化完成后的处理

通过 getsingleton 方法获取到 cat 对象后，doGetBean 方法的后续动作与循环依赖

⽆关，此处不再提及。person 对象的 populateBean 方法执⾏完毕后，意味着 person 对

象的属性赋值和依赖注人工作完成。后续的 initializeBean 方法中会对 person 对象进⾏

当 doCreateBean-createBean 方法执⾏完毕后，回到 getsingleton 方法（即代码

清单7-104）中，在方法的最后有两个关键动作，如代码清单7-110所示。

｝

synchronized

I第7章 IOC 容器的刷新

1代码清单7-110 getSingleton 方法的最后处理动作

public Object getsingleton （String beanName,ObjectFactory<？>singletonFactory）｛

try｛


## 11 此处的 singletonFactory.getobject （）即 createBean 方法

singletonobject = singletonFactory•getobject （）；

newSingleton = true；

｝ // catch …

Einally ｛

aftersingletonCreation （beanName）；

if （newSingleton）1

addsingleton （beanName,singletonObject）；

return singletonobject；

Protected void afterSingletoncreation （String beanName）1

iE 《！this.increationCheckExclusions.contains （beanName）

&& ！this.singletonsCurrentlyIncreation.remove （beanName））｛

1/ throw ex ......

protected void addsingleton （String beanName,object singletonobject）｛

（this.singletonobjects）｛

this.singletonobjects.put （beanName,singletonObject）；

this.sinqletonFactories.remove （beanName）；

this.earlysingletonObjects.remove （beanName）；

this.registeredSingletons.add （beanName）；

由上述源码可以发现，aftersingletonCreation 方法的作用是将当前正在获取的 bean

对象名称从 singletonsCurrentlyInCreation 中移除（移除后即代表当前环节中该

bean 对象未正在创建），⽽ addsingleton 方法的作用则是将创建好的 bean 对象放入

⼀级缓存 singletonObjects 中，且从⼆级缓存 earlysingletonobjects 和三级缓存

singletonFactories 中移除，并记录已经创建的单实例 bean 对象。

⾄此，⼀个 person 对象的创建流程完全结束。

4. 回到 Cat 的创建流程

person 对象创建完成后，回到 cat 对象的创建流程中，此时 cat 对象的依赖注入工作尚

未完成，此处会将完全创建好的person 对象进⾏依赖注入。请注意，该动作完成后，即代表

Cat 与 Person循环依赖的场景处理完毕。

后续的动作与 Person⼀致，最终会将 cat 对象放人⼀级缓存 singletonObjects，并

从其他⼏个缓存集合中移除，从⽽完成 cat 对象的创建。

5. 小结

基于 setter 方法或@Autowired 属性注入的循环依赖，IOC容器的解决流程如下。

额外的处理逻辑。

中移除。

正在创建的bean对象

person对象初始化完毕后


## 7.15 循环依赖的解决方案|

（1）创建 bean 对象之前，将该 bean 对象的名称放人“正在创建的 bean 对象”集合

singletonsCurrentlyInCreation 中。

（2） doCreateBean 方法中的 createBeanInstance 方法执⾏完毕后，会将当前 bean

对象放人三级缓存中。注意此处放人的是经过封装后的 ObjectFactory 对象，在该对象中有

（3）对bean 对象进⾏属性赋值和依赖注入时，会触发循环依赖的对象注入。

（4）被循环依赖的对象创建时，会检查三级缓存中是否包含且⼆级缓存中不包含正在创建

的、被循环依赖的对象。如果三级缓存中存在且⼆级缓存不存在，则会将三级缓存的 bean对象

移入⼆级缓存，并进⾏依赖注人。

（5）被循环依赖的 bean 对象创建完毕后，会将该 bean 对象放入⼀级缓存，并从其他缓存

（6）所有循环依赖的 bean 对象均注入完毕后，⼀个循环依赖的处理流程结束。

图7-4 中展舌了上述流程，流程图中简化了源码中方法调用的级别，读者只需关注主⼲逻辑。

Aostracppicationcontex 注：虛线椭（

fefeshe - （nisngean-acom.nae za10ne

celbeahitat - tooebeanCal SingletonsCurrentiyInCreation

createBean（） - doCreateBean（） - createBeanlnstancef

将cat对象封装为ObiectFactory后放入【三级缓存】中

Slkeiollracones. ⼀班费仔

^person”

beanFactory resolve Dependency（）- doResolveDependency（）

W +=wicoe2nracor detbeaniseamaamer.

将"person”放入【正在创建的Bean】中

createBean（）- doCreateBean（） - createBeaninstance（）

将person对象封装为ObjectFactory后放入【三级缓存】中

populatebean ⾼e e⼟A

oeanracofyfesoweDepelsenty - sokesoivevesendene

该步骤会再次触发getBean（"cat"）

检查发现［三级缓存］中包含ObjectFactory

从【三级缓存】中取出，井将实际cat 象放入【⼆级缓存】

earlySingletonObjects：⼆级缓存

calitA peis0h Xa

000uaieseanw人元

将person放入【⼀级缓存】 （Person）

singletonObjects：⼀级缓存

person 对象注入

IOC容品初始化完毕，循环依赖处理完成

图7-4 IOC 容器解决循环依赖的流程

方法没有执⾏完毕时，bean 对象尚未真正创建完毕并返回，此时若不加⼲预，会导致参与循环

异常，表示出现了不可解决的循环依赖。

I第7章 IOC 容器的刷新


## 7.15.4 基于构造方法的循环依赖

对于基于构造方法的循环依赖场景，IOC 容器⽆法给予合理的处理，只能抛出

BeanCurrentlyInCreationException 异常，原因是通过构造方法进⾏循环依赖，在构造

依赖的对象产⽣构造方法循环调用闭环，从⽽⼀直在轮流创建对象，直⾄内存溢出。IOC容器

为了避免对象的⽆限创建，采用 singletonsCurrentlyInCreation 集合记录正在创建的

bean 对象名称，当⼀个bean 对象名称出现两次时，IOC容器会认为出现了不可解决的循环依赖，

从⽽抛出 BeanCurrentlyInCreationException 异常。下⾯通过⼀个例子简要分析，如

代码清单7-111所舌。

代码清单 7-111 基于构造方法的循环依赖舌例代码

public class Cat｛

private final Person person；

PuoLic Cat （rerson person）1

this.person = person；

Public class Person｛

Private final Cat cat；

public Person （Cat cat）｛

this.cat = cat；

通过代码清单7-111 中的两个循环依赖的类，可以推演以下步骤。

1. IOC容器⾸先创建 cat 对象，由于调用cat 的构造方法需要依赖 person 对象，从⽽

引发 person 对象的创建。

2. IOC 容器创建 person 对象，由于调用 person 的构造方法需要依赖 cat 对象，从⽽

引发 cat 对象的创建。

3. IOC 容器第⼆次创建 cat 对象，由于第⼀次创建 cat 对象时在singletonsCurrently

InCreation 集合中存放了"cat"的名称，因此当第⼆次创建 cat 对象时，singletonsCurrently

InCreation 集合中已存在"cat"名称，从⽽抛出 BeanCurrentlyIncreationException


## 7.15.5 基于原型 Bean 的循环依赖

对于基于原型 Bean 之间循环依赖的场景，IOC 容器也⽆法合理解决，因为IOC 容器不会

对原型 Bean 进⾏缓存，只会像记录单实例 Bean 的创建时那样记录正在创建的 bean 对象名称。

这种设计会导致即使原型bean 对象已经实例化完毕，也⽆法通过有效⼿段将该bean 对象的引

用暴露，从⽽引发原型 bean 对象的⽆限创建。以下是⼀个原型Bean 场景的推漢，测试代码可

以选择代码清单7-112 的代码，只需给两个类声明@Scope （"prototype"）注解。

出现了不可解决的循环依赖。

的过渡期间进⾏额外的检查，该环节的检查会提前创建代理对象，并替换原始对象。经过此法


## 7.15 循环依赖的解决方案|

1. IOC 容器⾸先创建 cat 对象，之后进⾏ person 对象的依赖注入，由于 person 被定

义原型 Bean，触发 person 对象的创建。

2. IOC容器创建 person 对象，之后进⾏ cat 对象的依赖注入，由于 cat 对象也被定义

为原型 Bean，触发 cat 对象的全新创建。

3.IOC 容器再次创建 cat 对象，由于第⼀次创建 cat 对象时 prototypesCurrently

InCreation 原型bean 对象名称集合（注意与 singletonsCurrentlyInCreation 集合区

分）中已经存放了"cat"名称，因此当第⼆次创建时，PrototypesCurrentlyInCreation

集合中已存在"cat"名称，从⽽抛出 BeanCurrentlyInCreationException 异常，表示


## 7.15.6 引人AOP的额外设计

对于在 7.15.3节中提到的 getsingleton 方法中将三级缓存中的bean 对象放入⼆级缓存

的动作，其实如果读者仔细观察会发现，三级缓存中存放的是被封装过的 ObjectFactory 对

象，⽽⼆级缓存中存放的是真正的bean 对象，为什么会有 ObjectFactory 到 bean 对象之间

的过渡呢？这就是 Spring Framework 设计的⾼深之处。Spring Framework 的两大核心特性中，

除IOC 之外还有⼀个重要特性是 AOP，在 bean 对象创建完成后，IOC 容器会指派

BeanPostProcessor 对需要进⾏ AOP 增强的bean 对象进⾏代理对象的创建。原始的目标

对象和被 AOP增强的代理对象本质上是两个完全不同的对象，IOC 容器为了确保bean 对象中

最终注入的是 AOP 增强后的代理对象⽽不是原始对象，会在 ObjectFactory 到 bean对象

处理后的 bean 对象就是⼀个被 AOP增强后的代理对象，即便后续执⾏属性赋值和依赖注入，

最终也是给内层的目标对象赋值和注入，⽽不会有任何副作用，但是从IOC容器的整体⾓度⽽

⾔，IOC 容器内部的所有bean 对象通过依赖注人后的属性成员都是正确的 bean 对象（此处的

正确是指如果⼀个 bean 对象的确需要被AOP增强，则注入的是正确的代理对象⽽不是错误的

原始对象）。

下⾯从源码的⻆度简单了解引入AOP 之后的额外逻辑触发。通过代码清单7-112可以发现，

getEarlyBeanReference 方法的实现是回调 IOC 容器中所有 SmartInstantiation

AwareBeanPostProcessor 的 getEarlyBeanReference 方法，该方法可以获得单实例

bean 对象的引用，也正是通过该方法IOC容器可以有机会将⼀个普通 bean 对象转化被 AOP

增强的代理对象。

代码清单 7-112 getEarlyBeanReference 方法的实现

Protected Object doCreateBean （final String beanName,final RootBeanDefinition mbd，

final @Nullable Object［］ args） throws BeanCreationException ｛

boolean earlysingletonExposure =（mbd.issingleton（）&& this.allowCircularReferences

&& 1SsingLetoncurrentLYinvreation （beanName））

if （earlySingletonExposure）｛

addSingletonFactory （beanName，（）-> getEarlyBeanReference （beanName，mbd,bean））；

对象的确需要创建代理对象（即有必要），则会先⾏创建代理对象，并替换原始对象。由此就解

逻辑显得格外重要。

I第7章IOC容器的刷新

Protected Object getEarlyBeanReference （String beanName,RootBeanDefinition mbd, Object bean）｛

Object exposedObject = bean；

iE（！mbd.isSynthetic（） && hasInstantiationAwareBeanPostProcessors（））｛

for （BeanPostProcessor bp : getBeanPostProcessors （））｛

if （bp instanceot SmartInstantiationAwareBeanPostProcessOr）｛

omartLnstantLationAwarebeanrostrrocessor 10p =

（SmartInstantiationAwareBeanPostProcessor） bp；

exposedobject = ibp.getEarlyBeanReference （exposedObject,beanName）；

return exposedObject；

目前还没有讲到具体实现AOP 代理增强的后置处理器，这⾥先简单提⼀下，所有实现AOP

增强的后置处理器都继承⾃ AbstractAutoProxyCreator，⽽它本身实现了 Smart Inst

antiationAwareBeanPostProcessor 接口，内部⾃然有 getEarlyBeanReference 方法

的实现，如代码清单7-113所示。

代码清单 7-113 AbstractAutoProxyCreator 中实现的 getEarlyBeanReference 方法

public Object getEarlyBeanReference （Object bean,String beanName）｛

Object cacheKey = getCacheKey （bean.getClass （），beanName）；

this.earlyProxyReferences.put （cacheKey,bean）；

// 必要时创建代理对象

return wrapIfNecessary（bean,beanName, cacheKey）；

由 AbstractAutoProxyCreator 实现的逻辑可以明显看出，如果当前正在创建的bean

释了为什么IOC 容器解决循环依赖需要使用三级缓存⽽不是⼆级。

⾄此，IOC 容器解决循环依赖的方案全部讲解完毕，读者 好能⾃⾏编写⼀些实际的测试

代码，配合 Debug 体会⼀遍，以加深印象。


## 7.16 小结

本章中我们全⾯、深入地了解了 Applicationcontext 的核心初始化动作 refresh，

并重点剖析了各类后置处理器的加载、应用以及容器中 bean 对象的初始化流程。Spring Boot

的底层核心容器建⽴在 Spring Framework 的原⽣ Applicationcontext 之上，⼀切核心底层

动作还是基于 Spring Framework 的原⽣IOC容器，所以掌握 ApplicationContext 的初始化



# 第8章我们将关注 Spring Boot 的⼀个重要特性：嵌入式Web 容器。从底层深入探究 Spring


## 第8章我们将关注 Spring Boot 的⼀个重要特性：嵌入式Web 容器。从底层深入探究 Spring

Boot 是如何将嵌入式Web 容器集成到项目中，并在底层引导启动嵌入式容器的。

第


本章主要内容：

Spring Boot 容器刷新扩展：嵌人式 Web 容器

-章

• 嵌入式 Tomcat 容器简介；

• Tomcat 的整体架构与核心工作流程；

• 嵌入式 Web 容器的模型设计；

• 嵌入式 Web 容器的初始化时机；

◎ 嵌入式 Tomcat 的回调启动。

对于 Web 应用的项目开发，Spring Boot 提供了WebMvc 和WebFlux 的⽀持，以帮助开发

者更快速、简单地构建和开发，⽽Web 应用需要部署运⾏时，传统的方式是将项目打包成war

包后部署到外置的 Web 容器（如Tomcat、Jetty、Undertow 等传统 Servlet 容器，以及⽀持异步

⾮阻塞的 Netty 等容器）。Spring Boot 的⼀大重要特性是⽀持嵌人式Web 容器，有了嵌人式Web

容器的⽀持，基于 Spring Boot 的Web 应用仅凭⼀个单独的jar 包即可独⽴运⾏。本章内容会从

嵌人式 Web 容器开始，逐步深入研究嵌人式Web 容器的设计，以及在Spring Boot 应用启动过

程中嵌入式 Web 容器的构建、初始化、回调启动等重要环节。


## 8.1 嵌人式 Tomcat 简介

对于 Apache Tomcat 想必读者都不陌⽣，它是⼀个使用范围极⼴的Servlet 容器。⾃ Tomcat 7.0

开始，普通的 Tomcat Server 与嵌人式 Tomcat（Embedded Tomcat） 同步发⾏。从 Tomcat 的官方网

站下载页⾯中可以看到，普通的Tomcat Server 与 Embedded Tomcat 都可以下载，如图8-1所舌。


## 9.0

Piease see the README fie for packaging in

Binary Distributions

• zip （DgR Sha512）


## 32 biuS4DIK KInSOWS S6CAKE InStaler （05Q. Sha5:12）

• Embeddee （88e.stastz）

图 8-1 Tomcat Server 与 Embedded Tomcat 的下载

器实现。

了⼀些额外的限制，对此读者也需要简单了解。


## 8.1

Connector

Host Host

接收客户端的请求

转发Engine

响应给客户端

Context

Host

|第8章 Spring Boot 容器刷新扩展：嵌入式 Web 容器


## 8.1.1 嵌人式 Tomcat 与普通 Tomcat

嵌人式 Tomcat 是⼀种可以嵌入 Java Web 应用中，⽽⽆须单独部署的 Tomcat 容器。整

合嵌入式 Tomcat 后的应用可以在编写少量代码后，不借助外部容器和资源即可独⽴启动

Web 应用。也正因如此，嵌人式 Tomcat 成为 Spring Boot 予以⽀持和⾸选的嵌人式 Web 容

普通的外置 Tomcat 与嵌人式 Tomcat 从核心、本质上看没有任何区别，它们都可以承载Web

应用的运⾏。但是 Spring Boot 整合嵌人式 Tomcat 容器时考虑到⼀些特殊的因素，在底层设定

• 部署应用的限制：由于嵌人式 Tomcat 不是独⽴的Web 容器，⽽是嵌入特定应用中的，

此特性使得嵌入式 Tomcat⼀次只能部署⼀个web 应用。基于该限制也可以推理延伸⼀

些其他限制，例如数据库连接池⽆法在多个 Web 应用中共享等。

• web.xm1 的限制：Spring Boot 整合嵌人式 Tomcat 后不再对web.xm1 ⽂件予以⽀持，

转⽽替代的方案是使用@Bean 注解配合 ServletRegistrationBean 实现 Servlet、

Filter、Listener 的编程式注册。

Servlet 原⽣三大组件的限制：原⽣的基于 Servlet 3.0及以上规范的Web 项目，其类路

径下的 Servlet、Filter、Listener 可以被⾃动扫描并注册，⽽ Spring Boot 整合

嵌人式 Tomcat 后该特性会消失，如果需要开启此特性，需要配合 @Servlet

Componentscan 注解使用。

• JSP 的限制：Spring Boot 整合嵌人式 Tomcat 后，如果以独⽴jar 包的方式启动项目，则

项目中编写的JSP ⻚⾯会失效；如果以 war 包的方式部署到外置 Tomcat 容器，则JSP

可以正常运⾏（出现该现象的原因是嵌人式 Tomcat 没有引入 JSP 引擎依赖 tomcat-

embed-jasper）。

Tomcat 整体架构

Tomcat 的核心整体架构如图8-2 所舌。

（默认提供的Service是Catalina，可以处理HTTP请求）

Container Engine

接收Engine的响应

⼀个Web应用

图 8-2 Tomcat 的核心整体架构

响应结果；

以⾃⾏查阅相关资料。

方法进⾏逻辑处理。

Connector

Tomcat

根据URI定位Servlet

Servlet

处理请求、返回结果


## 8.1 嵌入式 Tomcat 简介I

从图8-2中可以提取出以下关键信息：

• ⼀个Tomcat 服务器是⼀个 Server；

• ⼀个 Server 中包含多个服务 Service，其中默认提供HTTP 请求响应服务的是

Catalina；

• ⼀个 service 中包含⼀组 Connector，用于与客户端交互，实现HTTP 接收请求和

• ⼀个 Service 中还包含⼀个 Container Engine，用于真正处理客户端的请求，并

响应结果；

• ⼀个 Container Engine 中包含⼀组 Host，每个 Host 可以装载⼀组 Web 应用；

• ⼀个 Web 应用对应⼀个 Context，⼀个 Context 中包含多个 Servlet。


## 8.1.3 Tomcat 的核心工作流程

Tomcat 作为⼀个 Web 服务器，它的核心工作是接收客户端发起的 HTTP请求，转发给服务

器端的Web 应用处理，处理完成后将结果响应给客户端。大致的工作流程分步骤解析如下。

1. 当请求进入 Tomcat 容器后，Tomcat 内部根据请求的URL，判断该请求应该由哪个应用

处理（⼀个 Tomcat 中可以部署多个 Web 应用），并将请求封装⼒ ServletRequest 对象，转

发⾄对应 Web 应用中的 Context。

提示：从 Tomcat 的 Server 接收到请求到转发给Context 的过程中还包含⼏个步骤，由于这⼏

个步骤对于理解和把控 Tomcat 整体工作流程不会有太大影响，因此本节没有提及，感兴趣的读者可

2. Context 接收到servletRequest 后，根据请求的URI定位可以接收当前请求的Servlet，

并将请求转发给具体的 Servlet 进⾏处理。该阶段定位 Servlet 的依据是请求的URI以及

Servlet 的 URI 映射关系。

3. Servlet 容器在转发 Servlet 之前会检查 Servlet 是否已经加载，如果没有加载，则

会利用反射机制创建 Servlet 的对象，并调用其init 方法完成初始化，之后再调用其 service

4. Servlet 处理完成后，将响应结果以 ServletResponse 对象响应给 Service 中的

Connector，由 Connector 响应给客户端，⾄此完成⼀次请求处理。

整体的工作流程图如图8-3所示。

ServletRequesth

ServletResponse

Engine⼀Context

StandardWrapper

客户端啊应

图8-3Tomcat 的核心工作流程



# 第8章 Spring Boot 容器刷新扩展：嵌入式 Web 容器


## 第8章 Spring Boot 容器刷新扩展：嵌入式 Web 容器


## 8.2 Spring Boot 中嵌人式容器的模型

Spring Boot 对嵌入式 Web 容器的默认⽀持包含 Tomcat、Jetty、Undertow、Netty 等。为确

保对不同嵌入式 Web 容器的统⼀⽀持，Spring Boot 制定了有关嵌入式 Web 容器的⼀些接⼜和

实现类，本节简单介绍 Spring Boot提供的⽀持嵌人式Web 容器的模型。


## 8.2.1 WebServer

WebServer 是 Spring Boot针对所有嵌人式 Web 容器制定的顶级接口，它本身仅定义了嵌

人式 Web 容器的启动和停⽌动作。实现 WebServer 接口的实现类通常会在内部组合⼀个真正

的嵌入式容器（例如 TomcatWebServer 中包含⼀个 Tomcat 对象），并且会在 start 方

法中实现嵌人式 web 容器的启动逻辑，以及在 stop 方法中实现停⽌和销毁逻辑，如代码

清单8-1 所舌。

【代码清单 8-1 WebServer 接⼜与实现类 TomcatWebServer 的核心成员

public interface WebServer ｛

void start （） throws WebServerException；

void stop（） throws WebServerException；

int getPort （）；


public class TomcatWebServer implements WebServer｛

private final romcat tomcat；

11…….


## 8.2.2 WebServerFactory

WebServerFactory 是所有具备创建 WebServer 能⼒的工⼚根接口，该接口没有定义

任何方法，仅为标记性接口。ConfigurablewebServerFactory 内 WebServerFactory

的扩展接口，它具备对 webServerFactory的配置能⼒（包括配置端口、SSL 等），如代码清

单8-2所示。

1代码清单8-2 Configurable WebServerFactory 定义的部分方法

public interface ConfigurableWebServerFactory extends WebServerFactory,ErrorPageRegistry ｛

void setPort （int Port）；

void setssl （Ssl ssl）；

void setHttp2 （Http2 http2）；

11⋯...

1/ 优雅停机的开关设置，⾃2.3.0开始

default void setshutdown （Shutdown shutdown）｛ ）

值得注意的是，⾃ Spring Boot 2.3.0之后嵌入式 Web 容器多了⼀个额外的特性：优雅停

机。该特性可以使得嵌入式Web 容器在关闭时不直接终⽌进程，⽽是预留⼀些时间使容器

最后讲解。


## 8.3 嵌入式 Web 容器的初始化时机|

内部的业务线程全部处理完毕之后才关停容器服务。有关优雅停机的研究会放到第14章的


## 8.2.3 ServletWebServerFactory 和 ReactiveWebServerFactory

Spring Boot 2.0之后，构建 Web 应用的基础框架可选择WebMvc 和 WebFlux，对应的 Web

容器也就分别变成了传统 Servlet 容器和异步⾮阻塞Web 容器。由于不同类型的Web 容器在创

建时传入的初始化组件不同，因此 Spring Boot 定义了两个平级的接⼜，分别处理 Servlet 和 Reactive

场景下的嵌入式容器创建工⼚，如代码清单8-3所舌。

代码清单 8-3 ServletWebServerFactory 和 ReactiveWebServerFactory

@FunctionalInterface

public interface ServletWebServerFactory ｛

webserver getwebserver（servLetcontextLnitlaLlZer.•• 1n1L1aL1ZerS）i

CFunctionalInterface

public interface ReactivevebServerFactory ｛

WebServer getWebServer（HttpHandler httpHandler）；

由上述源码可以发现，两个接⼜的方法定义仅是人参不同，返回的都是 webServer 对象。


## 8.2.4 ConfigurableServletWebServerFactory

当ConfigurablevebServerFactory接口与 ServletWebServerFactory组合后产

⽣的子接口会具备更多能⼒。从代码清单8-4 中可以发现，ConfigurableServletWebServer

Factory 中可以设置访问 Web 应用所需的 context-path，以及设置 ServletContext

Initializer、初始化参数 init-paran等。

代码清单 8-4 ConfigurableServletWebServerFactory 定义的部分方法

Public interface ConfigurableServletWebServerFactory extends ConfigurableWebServerFactory，

ServletWebServerFactory ｛

void setContextPath （String contextPath）；

void setInitializers （List<？ extends ServletContextInitializer> initializers）；

void addInitializers （ServletContextInitializer... initializers）；

void setInitParameters （Map<String, String> initParameters）；

再往下扩展就到了具体某个嵌人式Web 容器的实现类，这部分内容会在下⾯分析嵌入式

Tomcat 的初始化、回调启动等流程时展开讲解。


## 8.3 嵌人式 Web 容器的初始化时机

在7.9节中提到了 App1icationContext 的refresh 方法的第9步。该方法本身是⼀

个模板方法，AbstractApplicationContext 对此没有逻辑实现（见代码清单 8-5），⽽在

始化的核心步骤。

子，下⾯逐⼀展开讲解。

|第8章 Spring Boot 容器刷新扩展：嵌入式 Web 容器

Spring Boot 中⽀持嵌入式 Web 容器的⾼级 IOC 容器实现中，该步骤是触发嵌入式Web 容器初

1代码清单 8-5 AbstractApplicationContext#onRefresh

Protected void onRefresh（） throws BeansException ｛

//对于子类：默认没有任何操作

⽽ 3.2.2 节中重点提到了 AnnotationConfigServletWebServerApplication

Context，它就是基于 WebMvc 的⽀持嵌入式Web 容器的IOC容器最终实现类，在它的⽗类

ServletWebServerApplicationContext 中有 onRefresh 方法的重写逻辑，其内部的实

现就是嵌入式 Web 容器的创建，如代码清单8-6所示（请注意源码中标注的注释）。

】 代码清单 8-6 onRefresh 触发 WebServer 的创建

protected void onRefresh （）｛

super.onRefresh（）；

try｛

CeaLeNeloerver

｝// catch throw ex......

private vold createwebserver（）｛

WebServer webServer = this.webServer：

ServletContext servletContext = getServletContext （）；

1/ 如果 webServer 和 servletContext 均nul1，则需要创建嵌入式 web 容器

if（webServer == null && servletContext == nul1） ｛

1/ 获取 WebServerFactory

ServletWebserverFactory factory = getWebserverFactory（）；

1/ 使用 webServerFactory 创建 WebServer

this.webServer = factory.getWebServer （getSelfInitializer（））；

// 回调优雅停机的钩子

getBeanFactory （）.registersingleton （"webServerGracefulShutdown"，

nev WebServerGracefulShutdownLifecycle （this.webServer））；

// 回调嵌入式 web 容器启停的⽣命周期钩子

getBeanFactory（）.registersingleton（"webServerstartStop"，

new WebServerStartStopLifecycle （this, this.webServer））；

1// else if…

initPropertySources （）；

createWebServer 方法中包含WebServer 的创建，还有两个与⽣命周期回调相关的钩


## 8.3.1 创建 WebServer

创建嵌人式 Tomcat 容器的入口是 ServletWebServerFactory 的实现类 TomcatServlet

WebServerFactory，在 getWebServerFactory 方法中可以获取到，如代码清单8-7所示。

【代码清单 8-7 获取 ServletWebServerFactory

Protected ServletWebServerFactory getWebServerFactory（）｛


## 8.3 嵌入式 Web 容器的初始化时机|

Stringl］ beanNames = getBeanFactory（） .getBeanNamesForType （ServletWebServerFactorY.class）；

//位⾷…•••••

return getBeanFactory（）•getBean （beanNames ［0］，ServletWebServerFactory.class）；

从源码中观察，getWebserverFactory 方法仅是⼀个 getBean 的动作，但这其中还暗

藏⽞机。在第2 章介绍 TomcatServletWebServerFactory 的注册时提到了 WebServer

FactoryCustomi zer 的定制器，其通过向IOC容器中添加 WebServerFactoryCustomi zer，

可以编程式地对 WebServerFactory 的配置进⾏修改，⽽ WebServerFactoryCustomizer

的执⾏位置在后置处理器 WebServerFactoryCustomi zerBeanPostProcessOr 中，对应

的处理逻辑如代码清单8-8所示（源码逻辑很简单，不再展开）。

代码清单 8-8 应用所有 WebServerFactoryCustomizer

public Object postProcessBeforeInitialization （Object bean, String beanName）

throws BeansException ｛

if（bean instanceof WebServerFactory）｛

postProcessBeforeInitialization （（WebServerFactory） bean）；

return bean：

private void postProcessBeforeInitialization （WebserverFactory webServerFactory）｛

LambdaSafe.callbacks （WebServerFactoryCustomizer.class,getCustomizers （），webServerFactory）

•withLogger （WebServerFactoryCustomi zerBeanPostProcessor.class）

// 注意看这⼀⾏：customizer.customize

.invoke（（customizer）-> customizer.customize （webServerFactory））；

获取到 webServerFactory 后，下⼀步会执⾏其 getWebServer 方法创建嵌人式 Tomcat，

方法实现如代码清单8-9所示。纵观整个方法实现，核心步骤分为三步：创建 Tomcat 对象，并

初始化基础的 Connector 和Engine（该步骤包含整个 getWebServer 方法的大部分内容）；

prepareContext 方法初始化 Context，用于构建当前 Spring Boot 应用的上下⽂；

getTomcatWebserver 方法创建最终的 TomcatWebServer 对象。

代码清单 8-9 TomcatServletWebServerFactory#getWebServer

public static final String DEFAULT_PROTOCOL = "org.apache.coyote.http11.Http11NioProtocol"；

Private String protocol = DEEAULT_PROTOCOL；

public WebServer getWebServer（ServletContextInitializer... initializers） ｛


## 11 JMX 相关 

Tomcat tomcat = new Tomcat （）；

// 给嵌入式 romcat 创建⼀个临时⽂件夹，用于存放Tomcat运⾏中需要的⽂件

File baseDir =（this.baseDirectory ！= null）？this.baseDirectory :createrempDir（"tomcat"）；

tomcat .setBaseDir （baseDir.getAbsolutePath （））；

// Connector 中默认放入的protoco1 为 NIO 模式

Connector connector = new Connector （this.protocol）；

connector.setThrowOnFailure （true）；

// 向 Service 中添加 Connector，并执⾏定制规则（修改端口号等）

tomcat.getService （）.addConnector （connector）；

|第8章 Spring Boot 容器刷新扩展：嵌入式Web 容器

CustolLzetonnector （connector）：

tomcat.setConnector （connector）；

// 关闭热部署（嵌入式romcat 不存在修改 web.xml、war 包等情况）

tomcat.getHost （）.setAutoDeploy （false）；

configureEngine （tomcat .getEngine （））；

for （Connector additionalConnector :this.additionalTomcatConnectors）｛

tomcat .getService （）.addConnector （additionalConnector）；

1/ 该动作会⽣成 TomcatEmbeddedContext

PrepareContext （tomcat .getHost （），initializers）；

// 创建 TomcatWebServer

return getromcatWebServer （tomcat）；

其中第⼀步⽐较容易理解，第三步会真正创建嵌人式Tomcat 并初始化，⽽中间的第⼆步

PrepareContext 方法会根据当前的 Spring Boot 应用加载其中的 Servlet 三大核心组件、

配置⽣命周期监听器、应用 ServletContextInitializer 等，注意该环节中的 Servlet

ContextInitializer，这个组件相当关键，Spring Boot 中注册的所有 Servlet 三大核心

组件均会通过该组件与嵌人式 Tomcat 对接。

1. ServetContextInitializer 的设计

ServletContextInitializer 本身不是 Servlet 相关规范中定义的 API，它是 Spring

Boot 1.4.0以后定义的 API 接口（这也说明 ServletContextInitializer 与某个具体的

Web 容器没有任何关系）。借助IDE 搜索 ServletContextInitializer 的实现类，可以发

现有⼀个抽象类 RegistrationBean，⽽它又有对应 Servlet 三大核心组件的注册实现类

ServletRegistrationBean、FilterRegistrationBean 以及 ServletListener

RegistrationBean。从接口设计上看，ServletContextInitializer 发挥作用的时机

是 ServletContext 的初始化阶段，即 Servlet 容器加载 ServletContainerInitializer

的阶段（有关 ServletContainerInitializer 的内容会在第 14 章讲解），如代码清单 8-10

所示。

代码清单 8-10 ServletContextInitializer

@FunctionalInterface

puoLic intertace servLetcontextinltlaLlzer t

void onStartup（ServletContext servletContext） throws ServletException；

2. ServletContextlnitializer 应用于嵌入式 Tomcat

ServletContextInitializer 作注册 Servlet 原⽣三大核心组件的切入点，其应用时

机在初始化 Tomcat 内部Context 的阶段，即 prepareContext 方法中。代码清单8-11 展示

了调用流程，prepareContext 方法的最后有对 ServletContextInitializer 的配置应

用，其调用的 configureContext 方法会在内部实例化⼀个 TomcatStarter 对象，⽽

TomcatStarter 对象本身是⼀个 ServletContainerInitializer，它就是上⾯提到的可

以被 Servlet 容器加载的组件，加载后调用的逻辑刚好是下⾯的onStartUP 方法，该方法会循

环调用所有 ServletContextInitializer 的 onStartUp 方法，由此完成 Servlet 原⽣三

大核心组件的注册（也包含 DispatcherServlet）。

要简单了解⼀下。


## 8.3 嵌入式 Web 容器的初始化时机 ！

代码清单 8-11 ServletContextlnitializer 被触发调用的逻辑

protected void prepareContext （Host host,ServletContextInitializer［］ initializers） ｛

ServletContextInitializer［］ initializersrouse = mergeInitializers （initializers）；

host.addChild（context）；

configurecontext （context,initializersTouse）；

postProcessContext （context）；

；otected void configureContext （Context context, ServletContextInitializerl］ initializers）

mcatStarter starter = new TomcatStarter（initializers）

class TomcatStarter implements ServletContainerInitializer ｛

private final ServletContextInitializerl］ initializers；

@Override

blic void onstartup （Set<Class<?>> classes,ServletContext servletContex

hrows ServletException

try｛

Eor （ServletContextInitializer initializer :this.initializers）1

initializer.onstartup （servletContext） ；

｝ 1/ catch...

3. Context 的初始化细节

注意 preparecontext 方法中的细节，在方法的开始会创建⼀个 TomcatEmbedded

Context，它就是 Host 中的Context 落地实现，⽽且从方法的最后也可以看到，Tomcat

EmbeddedContext 对象被添加到 Host 中（这个添加的 Context 在8.4 节中会被提取出），

如代码清单8-12所示。

代码清单 8-12 prepareContext 中创建 Context 并放入 Host

protected void prepareContext （Host host,ServletContextInitializer［］ initializers） ｛

File documentRoot = getValidDocumentRoot （）；

// 创建 Context

TomcatEmbeddedContext context = new TomcatEmbeddedContext （）；1......

// 添加到 Host中

host.addChild（context）；1…..


## 8.3.2 Web 容器关闭相关的回调

回到代码清单8-6的 createWebServer 方法中。除了创建 TomcatWebServer, create

webserver 方法还会向 BeanFactory 中注册两个与⽣命周期相关的回调钩子，这部分也需

2. WebServerStartStopLifecycle

I第8章 Spring Boot 容器刷新扩展：嵌入式Web 容器

1.WebServerGraceful ShutdownLifecycle

WebServerGracefulShutdownLifecycle 用于触发嵌入式 Web 容器优雅停机的

核心⽣命周期回调，它实现了 SmartLifecycle 接口，可以在IOC 容器销毁阶段回调其

stop 方法以触发销毁逻辑。WebServerGracefulShutdownLifecycle 中实现的stop 方

法会回调 WebServer的 shutDownGracefully方法，实现优雅停机，如代码清单8-13所示。

代码清单 8-13 WebServerGracefuIShutdownLifecycle 可使嵌入式 Web 容器优雅停机

class WebServerGracefu1ShutdownLifecycle implements SmartLifecycle｛

private final WebServer webServer；

webserverGracetuLsnutdownultecycLe （webserver weoserver）！

this.webServer = webServer：

@Override

public void stop （Runnable callback）｛

this.running = false；

this.webServer.shutDownGracefully（（result）-> callback.run（））；

WebServerStartStopLifecycle 的作用是启动和关闭嵌人式Web 容器，它会在10C

容器刷新即将完成/销毁时被回调，从⽽回调 webserver 的start/stop 方法，真正启动/关

闭嵌入式 Web 容器，如代码清单 8-14 所示。

1代码清单 8-14 WebServerStartStopLifecycle 关闭嵌入式 Web 容器

class WebserverStartstoplifecycle imp lements SmartLifecycle 1

Private final webserver webserver；

@override

public void start（）1

this.webServer.start （）；

this.running = true；

this.applicationContext.publishEvent

（new ServletWebServerInitializedRvent （this.webserver,this.applicationContext））；

@override

public void stop（）｛

this.webserver.stop （）；

｝


## 8.4 嵌人式 Tomcat的初始化

当 createwebServer 方法的前置逻辑执⾏完毕后，最后⼀⾏的 return 会调用 get

initialize 方法⾄关重要，且内部源码篇幅较⻓，为了便于读者更好地阅读和理解源码，本

节将其拆分为多个⽚段讲解。


## 8.4 嵌入式 Tomcat 的初始化|

TomcatWebserver 方法，以创建 romcatWebServer 对象，⽽这个创建逻辑内部蕴藏着嵌

入式 Tomcat 的内部初始化逻辑，如代码清单8-15 中最后⼀⾏的 initia1ize 方法所示。这个

【代码清单 8-15 创建 TomcatWebServer

Protected TomcatWebServer getTomcatWebServer（Tomcat tomcat）｛

return new TomcatWebServer （tomcat,getPort （）>= 0,getShutdown （））；

public TomcatWebServer （Tomcat tomcat,boolean autostart,Shutdown shutdown）｛

Assert.notNu11 （tomcat，"Tomcat Server must not be nul1"）；

this.tomcat = tomcat；

this.autostart = autostart；

this.gracefu1Shutdown -（shutdown == Shutdown.GRACEFUL）

？ new GracefulShutdown （tomcat）：null；

initialize（）；


## 8.4.1获取 Context

initialize 方法的第⼀个核心动作是获取 Tomcat 中第⼀个可用的context，如代码清

单8-16所示。获取逻辑本身很简单，此处仅是从 Host 中获取第⼀个类型为 Context 的子元

素，如代码清单 8-17所示。

1代码清单 8-16 initialize（1）

private void initialize（）throws WebserverException ｛

logger.info（"Tomcat initialized with port （s）： " + getPortsDescription （false））；

synchronized （this.monitor）｛

try｛

addInstanceIdToEngineName （）；

// 获取第⼀个可用的 Context

Context context = findContext （）；

】代码清单 8-17 获取第⼀个可用的 Context

private Context findContext（）｛

for （Container child :this.tomcat.getHost （）.findChildren （））｛

i （child instanceof Context）｛

return （Context）child；

throw new I1 legalstateException （"The host does not contain a Context"）；

请注意，在该环节获取的 Context 是在 getWebserver 环节中 prepareContext 方法

内创建的 romcatEmbeddedContext，在此处会被提取并返回，如图8-4所示。


## 8.4

|第8章 Spring Boot 容器刷新扩展：嵌入式 Web 容器

eaaedcontext

rLvateconexl

wolcar.gethos（）.TinacnaiarenC））

图 8-4 提取的 Context 是 prepareContext 创建的 Context

阻⽌ Connector 初始化

获取到 Context 后，接下来执⾏的这个步骤是添加⼀个 LifecycleListener。这个监

听器的功能是移除 Service 中的Connector，如代码清单8-18所示。读者读到此处可能会

产⽣疑惑：在 getWebServer 方法中创建 romcatWebserver 之前已经创建了 Connector，

并且将 Connector放人了 Service 中，为何此处还要把这些Connector 移除呢？

，代码清单 8-18 initialize （2）


context.addLifecyclelistener（（event）->｛

if （context.equals （event.getSource （））&& Lifecycle.START_EVENT.equals （event.getType （）））｛

removeServiceConnectors （）；

｝）；

要消除这个疑惑，需要读者回想⼀下创建嵌人式Web 容器的时机，此时进⾏到

ApplicationContext 的refresh 的第⼏步？第9步 onRefresh 方法。由于执⾏ onRefresh

方法早于 finishBeanFactoryInitialization 方法，此时IOC 容器中的绝大多数单实例

bean 对象尚未初始化，⽽ Connector 的功能是与客户端交互，⼀旦 Connector 初始化完成，

就意味着 Tomcat 可以对外提供服务，即客户端可以成功访问到 Tomcat 的服务。但是显然初始

化嵌人式 Tomcat 的时机下当前应用还不具备提供服务的能⼒，所以需要先将 Connector 移除，

以防⽌客户端成功访问到 Tomcat 服务。

回到代码清单 8-18 中，Spring Boot 对该情况的处理是在嵌人式Tomcat⼴播事件时检查事

件类型是否为"START_EVENT"，如果是则会将所有 Connector移除。


## 8.4.3 启动 Tomcat

Connector 的准备工作完成后，下⼀个核心动作是启动 Tomcat 服务，如代码清单8-19所

示。该步骤会从嵌入式 Tomcat 中的 Server层级开始，逐个组件进⾏初始化和启动这两个步骤的

和启动有⼀个整体的认识。

法更像是制定所有组件⽣命周期流程的规范型方法，其内部的很多方法都是抽象的，这跟


## 8.4 嵌入式 Tomcat 的初始化|

执⾏。源码的内部⽐较复杂，读者可以先参照图8-5，通过时序图对 Tomcat 内部的组件初始化

代码清单 8-19 initialize （3）

// 启动服务器以触发初始化监听器

this.tomcat.start （）；

Tomcet T0locolnanale

host.init）

executor start（） •coment siamlga7

cohiecror Stam

图 8-5 Tomcat 的组件初始化与启动流程时序图

熟悉 Tomcat 内部启动流程的读者可能看到图8-5的起点时会感到困惑：外置 Tomcat 通过

startup.bat 或 startup.sh 启动时内部会初始化⼀个 Catalina 对象，由它引导 Server

的初始化和启动，为什么在图8-5中是直接由 Tomcat 来引导启动呢？其实这就是外置 Tomcat

与嵌人式Tomcat 的区别。Spring Boot 整合嵌人式 Tomcat 时，考虑到 Tomcat 只会为当前项目提

供服务，加上嵌入式 Tomcat 本身的机制，于是在内部创建 TomcatWebserver 对象时，直接

使用 Tomcat 对象的 start 方法来引导内部组件的初始化和启动流程。

下⾯以 tomcat.start（）方法为例，分析 Tomcat 引导 Server 初始化和启动的源码执⾏

逻辑，如代码清单8-20所示。Tomcat 类的内部会调用 Server 的start 方法，⽽start 方

法定义在所有Tomcat 核心组件的共同⽗类 LifecycleBase 上。从方法实现上看，start 方

WebMvc的设计⾮常类似：⽗类制定流程的抽象定义，子类负责具体的步骤实现。

1代码清单 8-20 tomcat.start（）方法引发 Server 的初始化和启动

public void start（） throws LifecycleException ｛

getServer（）；

server.start（）；

// LifecycleBase

PuoLiC tinal sacnronizeo Yola start（throws LifecycleException｛

1/ 前置判断

if（state.equals （LifecycleState.NEW））｛

// 初始化

对于后续的所有核心组件的初始化和启动，源码中的逻辑⼏乎完全相同，读者可以借助

两个关键点，下⾯⼀⼀解读。

I第8章 Spring Boot 容器刷新扩展：嵌入式Web 容器

init （）；

｝// else if⋯…..

try｛

setstateInterna1 （Lifecyclestate.STARTING_PRBP,nu11,false）；

// 启动⾃身

startInternal（）；

1…….｝//catch ..

进入init方法，该方法依然由⽗类 LifecycleBase 定义，如代码清单8-21 所示。请注

意init 方法中 try块的中间⼀⾏调用的方法initInternal，这个方法是⼀个模板方法，在

⽗类 LifecycleBase 中没有定义关键逻辑，所以这部分需要向下跳转到 Server 的实现类

Standardserver 中，⽽server的实现类中会触发 Service的初始化，通过代码清单8-21

的下半部分源码即可清楚地看到显式的init方法调用。

1代码清单 8-21 LifecycleBase#init

public final aynchronized void init（）throws LifecycleException ｛

if （！state.equals （Lifecyclestate.NEW））｛

invalidTransition （Lifecycle.BEFORE_INIT_EVENT）；

try｛

setstateInternal（Lifecyclestate.INITIALIZING, nu11, false）；

initInternal （）；

setStateInterna1 （Iifecyclestate.INITIALIZBD,nu11,false）；

｝// catch...

1/ StandardServer

protected void initInternal（）throws Lifecyclezxception ｛

super.initInternal（）；

Eor （int i = 0; i < services.length;i++）｛

services ［i］ .init （）；

｝

IDE ⾃⾏翻阅源码，本节不再过多展开。


## 8.4.4 阻⽌ Tomcat 结束

TomcatWebServer 的 initialize 方法中最后⼀个关键步骤是startDaemon

AwaitThread，如代码清单8-22所示。该步骤会启动⼀个新的 awaitrhread 线程，以阻⽌

Tomcat 的进程结束。注意观察代码清单 8-23 中创建 avaitrhread 线程的细节，它内部实现

的run 方法是回调Server 的await 方法，并且还设置了Daemon 属性为false。这其中涉及


## 8.4 嵌入式 Tomcat 的初始化I


## 1 代码清单 8-22 initialize （4）

1…….

startDaemonAwaitThread（）；


## 11 catch throw ex 

1代码清单 8-23 startDaemonAwaitThread

private void startDaemonAwaitThread （）｛

Thread awaitrhread = new Thread（"container-" + （containerCounter.get （）））｛

@Override

public void run（）｛

TomcatWebServer.this.tomcat .getServer （） .await （）；

｝；

awaitrhread.setContextClassLoader （getClass （）.getClassloader （））；

awaitThread.setDaemon （false）；

awaitThread.start （）；

其⼀是 Daemon 线程，Tomcat 中的所有进程都是 Daemon 线程。在⼀个 Java 应用中，只要

有⼀个⾮ Daemon线程在运⾏，Daemon线程就不会停⽌，整个应用也不会终⽌。如果 Tomcat

需要⼀直运⾏以接收客户端请求，就必须让 Tomcat 内部的 Daemon 线程都存活，⾄少需要⼀个

能阻⽌ Tomcat 进程停⽌的⾮ Daemon 线程，代码清单8-23 中新创建的 awaitrhread 线程就

是负责阻⽌ Tomcat 进程停⽌的线程。

其⼆是 await方法，这⾥调用的是 Server 中的await 方法，核心源码如代码清单8-24

所舌。重点关注退出 Tomcat 的端⼜的判断逻辑为-1的分⽀，退出端⼜-1代表当前启动的是⼀

个嵌人式 Tomcat，阻塞 Tomcat 进程结束的方式是每隔10s检查⼀次stopAwait 的值，只要该

值⼀直为 false，Tomcat 就不会退出，否则反之。

代码清单 8-24 await 阻塞 Tomcat 进程结束的实现

public void await（）｛

11-2时的处理⋯•.

1/ 如果关闭 romcat 的端口是-1，代表是入式romcat

if （getPortWithOffset （）== -1）｛

try｛

awaitThread = Thread.currentThread （）；

while（！stopAwait）｛

try｛

rhread.sleep （10000）；

｝ 11 catch ignore ⋯

｝ Einally｛

awaitThread = null；

return；

// 退出端口正常的处理（属于外置Tomcat 逻辑）⋯•.

|第8章 Spring Boot 容器刷新扩展：嵌入式 Web 容器

可能熟悉 Tomcat 的读者会好奇，默认情况下 Tomcat 的退出端⼜是8005，为什么在此处是

判断-1呢？其实在 Tomcat 调用getServer 方法中给 Server 设置的端⼜号就是-1，如代码清

单8-25所舌。

代码清单 8-25 嵌入式 Tomcat 的端⼜号为-1

public Server getServer（）｛

iE （server ！= null）｛

return server；

11….…...

server = new StandardServer （）；

1/ 设置端口号为-1，代表嵌入式

server.setPort （-1）；

return server；

通过上述⼀系列核心组件的初始化和启动，嵌入式 Tomcat 容器初始化完成。请注意，

onRefresh 方法执⾏完毕后，Tomcat 还不能提供服务（因次 Connector 在该阶段被移除，

⽆法与客户端建⽴有效连接）。


## 8.5 嵌人式 Tomcat 的启动

当 onRefresh 方法执⾏完毕，并且后续 finishBeanFactoryInitialization 方法

执⾏完毕，IOC容器中所有⾮延迟加载的单实例bean 对象均初始化完毕，此时会执⾏ refresh

方法的第12 步 finishRefresh 方法，该方法中会回调所有 SmartLifecycle，其中包含


## 8.3.2节中提到的回调钩子 webServerStartStopLifecycle，它会在该阶段回调嵌人式Web

容器的 start 方法，从⽽让容器可以正常接收客户端的请求，如代码清单 8-26所示。

代码清单 8-26 WebServerStartStopLifecycle#start

public void start（）｛

this.webServer.start （）；

this.running = true；

this.applicationContext .publishEvent（

new ServletWebServerInitializedEvent （this.webServer,this.applicationContext））；

进入实现类romcatWebServer 的start 方法，由于在之前初始化时移除了Connector，

此处会使用addPreviouslyRemovedConnectors 方法将之前移除的Connector 还原并启

动，如代码清单8-27所示。请注意，在addPreviouslyRemovedConnectors 方法中，向 Service

中添加 Connector 的addConnector 方法会顺带启动Connector 使其⽣效并工作。

代码清单 8-27 TomcatWebServer#start

public void start （）throws WebServerException ｛

synchronized （this.monitor）｛

1/ started 的检查 ⋯••••


## 8.6 小结|

try1.

1/ 还原、启动 Connector

addPreviouslyRemovedConnectors（）；

Connector connector = this.tomcat.getConnector（）；

1/ ⽼框架兼容、启动后检查等⋯••

this.started = true；

1/ 1ogger ….

1// catch finally ….

orivate void addPreviouslyRemovedConnectors（）｛

service［］ services = this.tomcat.getServer（）.findServices （）；

for （Service service : services） ｛

// 之前移除的 Connector 在 serviceConnectors 中

connectorl］ connectors = this.serviceConnectors.get （service）；

i£ （connectors ！= nu1l）｛

Eor （Connector connector :connectors）｛

1/ 此处添加并启动

service.addConnector （connector）；

iE （！this.autostart）（

stopProtocolHandler （connector）；

this .serviceConnectors.remove （service）；

⾄此，嵌入式 Tomcat完整启动。


## 8.6 小结

本章主要围绕 Spring Boot 的可独⽴运⾏特性的底层⽀撑—嵌人式 Web 容器，展开讲解了

嵌入式Tomcat的设计、模型、架构、工作流程，以及 Spring Boot如何引导启动⼀个嵌人式 Tomcat。

Tomcat 作为经典的 Servlet 容器，它的架构⾮常值得深入探究。Spring Boot 在⾯对不同类型的

嵌入式web 容器时，通过构建全新的嵌入式容器模型以适配不同的容器实现，并配合

Applicationcontext 的⽣命周期，对嵌人式 web 容器予以合理的初始化和启动处理。



# 第9章会围绕Spring Framework 的另⼀个核心特性 AOP 展开讲解，探讨 Spring Boot 中的


## 第9章会围绕Spring Framework 的另⼀个核心特性 AOP 展开讲解，探讨 Spring Boot 中的

AOP 相关⽣命周期原理。

章

⽣效、运⾏机制进⾏全⾯讲解。


## 9

所舌。

@EnableAspectJAutoProxy

第

AOP模块的⽣命周期


本章主要内容：

今 AOP 的核心后置处理器 AnnotationAwareAspectJAutoPrOxyCreator；

今 AOP底层收集切⾯类的机制；

今 Bean 被 AOP代理的过程原理；

◎ 代理对象执⾏的全流程分析。

前⾯三章的内容从 Spring Boot 的主线引导人⼿，逐步剖析 SpringApplication 的工作

原理、APPlicationContext IOC容器的初始化流程，以及在独⽴运⾏时启用的嵌入式Web

容器的底层机制。本章重点研究 Spring Framework 中AOP 模块的全⽣命周期。Spring Framework

的两大核心特性是IOC 和AOP，前⾯三章主要是围绕IOC 容器展开的，本章就AOP的启用、

@EnableAspect.JAutoProxy

对于启用 AOP 特性的核心注解读者都⾮常清楚，在 Spring Boot 主启动类上标注@Enable

AspectJAutOPrOXY 即可开启基于 AspectJ 的AOP 动态代理。借助IDE 查看@EnableAspect

JAutoProxY注解的源码，可以发现它使用@Import 注解导人了⼀个注册器，如代码清单9-1

1代码清单 9-1

@Import （AspectJAutoProxyRegistrar.class）

public einterface EnableAspectJAutoProxy ｛

boolean proxyTargetClass（）defaultfalse；

boolean exposeProxy（） defaultfalse；

这个 AspectJAutoProxyRegistrar 的⽂档注释中已经解释了它的核心工作内容：

Registers an AnnotationAwareAspectJAutoProxyCreator against the current BeanDefinition

Registry as appropriate based on a given @EnableAspectJAutoProxy annotation.

对于给定的@EnableAspectJAutOProxy 注解，根据当前 BeanDefinitionRegistry

在适当的位置注册 AnnotationAwareAspectJAutoProxyCreator.

由此可知实现 AOP 特性的核心后置处理器是 AnnotationAwareAspectJAutoProxy

BeanDefinitionRegistry registry，


## 9.1 @EnableAspectJAutoProxyI

Creator。在深入该后置处理器之前，先请读者快速了解 AspectJAutoProxyRegistrar

注册 AnnotationAwareAspectJAutoProxyCreator 的时机。由于 AspectJAutoProxy

Registrar 实现了 ImportBeanDefinitionRegistrar 接口，可以直接定位到 register

BeanDefinitions 方法去寻找注册的逻辑，如代码清单9-2 所示。

代码清单 9-2 AspectJAutoProxyRegistrar 的核心方法

Public void registerBeanDefinitions（

AnnotationMetadata importingClassMetadata, BeanDefinitionRegistry registry） ｛

// 核心注册后置处理器的动作

AopConfigUtils.registerAspectJAnnotationAutoProxyCreatorlfNecessary （registry）；

// 解析@EnableAspectJAutoProxy 的属性并配置

AnnotationAttributes enableAspectJAutoProxy = AnnotationConfigUtils

•attributesFor （importingClassMetadata,EnableAspectJAutOPrOXY.Class）；

i£ （enableAspectJAutOPrOXY！= nul1）｛

if（enableAspectJAutoProxy.getBoolean（"proxyTargetClass"））｛

AopConfigUtils.forceAutoProxyCreatorToUseClassProxying （registry）；

if （enableAspectJAutoProxY.getBoolean（"exposeProxy"））｛

AopConfigUtils.forceAutoProxyCreatorToExposeProxy（registry）；

注意 registerBeanDefinitions 方法的第⼀⾏逻辑就已经表明，它要注册⼀个 Auto

ProxYCreator 后置处理器，也就是上⾯提到的代理对象创建器，从代码清单9-3中可以看到，

这个方法也明确指定了注册的 bean 对象类型就是 AnnotationAwareAspect JAuto

ProxyCreator。后续的方法调用就是根据这个类型构建 BeanDefinition 并注册到

BeanDefinitionRegistry 中的动作，这部分逻辑相对简单，读者可以简单浏览⼀遍，主要

的核心是注册的代理对象创建器的类型 AnnotationAwareAspectJAutoProxyCreatoro

代码清单9-3 注册 AnnotationAwareAspectJAutoProxyCreator 的动作

public static BeanDefinition registerAspectJAnnotationAutoProxyCreatorIfNecessary（

BeanDefinitionRegistry registry） ｛

return registerAspectJAnnotationAutoProxyCreatorIfNecessary （registry, null）；

Public static BeanDefinition registerAspectJAnnotationAutoProxYCreatorIfNecessary（

BeanDefinitionRegistry registry， @Nullableobject source）

// 此处已指定类型

return registerOrEscalateApcAsRequired （AnnotationAwareAspectJAutoProxyCreator.class，

registry, source）；

Private static BeanDefinition registerOrEscalateApCAsRequired（

Class<?> cls， @Nullable Object source）｛

Assert.notNul1（registry，"BeanDefinitionRegistry must not be nu11"）；

// 后置处理器的等级升级机制（关联10.3.3节）

i£ （registry.containsBeanDefinition （AUTO_PROXY_CREATOR_BEAN_NAME））｛

强方法将被⾃动识别。这涵盖了方法执⾏的切入点表达式。

1第9章 AOP模块的⽣命周期

BeanDefinition apcDefinition =

registry.getBeanDefinition （AUTO_PROXY_CREATOR_BEAN_NAME）；

iE （！cls.getName （）.equals （apcDefinition.getBeanClassName （）））｛

int currentPriority = findPriorityForClass （apcDefinition.getBeanClassName （））；

int requiredPriority = findPriorityForClass （cls）；

i£ （currentPriority <requiredPriority） ｛

apcDefinition.setBeanClassName （cls.getName （））；

return null；

1/ 构建 BeanDefinition，注册到BeanDefinitionRegistry 中

RootBeanDefinition beanDefinition = new RootBeanDefinition （cls）；

beanDefinition.setSource （source）；

// 注意代理对象创建器的优先级是 BeanPostProcessor 中最⾼的

beanDefinition.getPropertyvalues （） .add （"order"，Ordered.HIGHEST_PRECEDENCE）；

beanDefinition.setRole （BeanDefinition.ROLE_INERASTRUCTURE）；

registry.registerBeanDefinition （AUTO_PROXY_CREATOR_BEAN_NAME,beanDefinition）；

return beanDefinition；


## 9.2 AnnotationA wareAspectJAutoProxyCreator

由类名可知，AnnotationAwareAspectJAutoProxyCreator 是基于注解驱动的 AspectJ

的代理对象创建器。类名涵盖的要素⽐较多，下⾯借助 javadoc 对其有⼀个初步的了解。

AspectJAwareAdvisorAutoProxyCreator subclass that processes all AspectJ annotation aspects in

the current application context, as well as Spring Advisors.

Any AspectJ annotated classes will automatically be recognized, and their advice applied if

Spring AOP's proxy-based model is capable of applying it.This covers method execution joinpoints.

If the <aop:include>element is used, only @AspectJ beans with names matched by an

include pattern will be considered as defining aspects to use for Spring auto-proxying.

Processing of Spring Advisors follows the rules established in org.springframework.aop.

framework.autoproxy.AbstractAdvisorAutoProxyCreator.

它是 AspectJAwareAdvisorAutOPrOxYCreator 的子类，用于处理当前 Applica

tionContext 中的所有基于EAspectJ注解的切⾯，以及 Spring 原⽣的Advisor。

如果 SpringAOP 基于代理的模型能够应用任何被@AspectJ注解标注的类，那么它们的增

如果使用<aop:include>元素，则只有名称与包含模式匹配的被@AspectJ标注的 Bean

将被视为定义要用于 Spring Framework ⾃动代理的切⾯。

Spring Framework 中内置Advisor的处理遵循AbstractAdvisorAutoProxyCreator

中建⽴的规则。

提取 javadoc 中解释的核心内容：AnnotationAwareAspectJAutoProxyCreator 兼

顾 AspectJ⻛格的切⾯声明和 Spring Framework 原⽣的AOP。

要的接口。

代理对象。

创建流程。

源码分析中会频繁遇到它。

接下来的后置处理器初始化部分中它⼀定会被创建，⽽这个时机在第7章讲过了，读者可以快


## 9.2 AnnotationAwareAspectJAutoProxyCreator /


## 9.2.1 类继承结构

借助IDEA 可以很清楚地看到 AnnotationAwareAspectJAutoProxYCreator 的继承

结构，以及其中的重要核心，如图9-1所舌。

滲，BeanPostProcessor

多、InstantiationAwareBeanPostProcessor 缘*AopInfrastructureBean

會-BeanclessloaderAwars

第Ordered ProxyConfig

#。SmartInstantiationAwareBeanPostProcessor 繳* ProxyProcessorsupport

FaCtoryAWBT

数×AbstractAutoP

象*AbstractAdvisorAutoProxyCreator

AdvisorAutoProxyCreaton

AspectJAutoProxyCreator

图 9-1 AnnotationAwareAspectJAutoProxyCreator 的类继承结构

注意观察顶级接口 AnnotationAwareAspectJAutoProxyCreator，它实现了⼏个重

• BeanPostProcesSOr：用于在 postProcesSAfterInitialization 方法中⽣成

• InstantiationAwareBeanPostProcessor：拦截 Bean 的正常 doCreateBean

• SmartInstantiationAwareBeanPostProcesSOr：提前预测 Bean 的类型、暴露

Bean 的引用（AOP、循环依赖等），其过于复杂，此处不作解释。

• AopInfrastructureBean：实现了该接口的Bean 永远不会被代理（防⽌⽆限套用）。

除此之外还有⼀点要注意的是，AnnotationAwareAspectJAutoProxyCreator 继承

的顶级的抽象实现类是 AbstractAutoProxyCreator，它本身的重要程度⾮常⾼，后⾯的


## 9.2.2 初始化时机

既然在 AspectJAutoProxyRegistrar 中已经把 AnnotationAwareAspectJAuto

ProxyCreator 的 BeanDefinition 信息注册到 BeanDefinitionRegistry 中，那么在

速回忆⼀下，如代码清单9-4所示。

代码清单9-4 refresh 的部分源码

public void refresh（）throws BeansException,I1legalStateException ｛

synchronized （this.startupShutdownMonitor）｛

try｛

测试⼀下。

I第9章 AOP模块的⽣命周期

postErocessbeanractory（beanractory）；

invokeBeanFactoryPostProcessors （beanFactory）；

// 6.注册、初始化 BeanPostProcessor

registerBeanPostProcessors （beanFactory）；

initMessageSource （）；

initApplicationEventMulticaster （）；1......

｝

注意设计上的⼀个细节，AnnotationAwareAspectJAutoProxyCreator 实现了Ordered

接口（并且设置了最⾼优先级），它会提前于普通的BeanPostProcessOr 创建，那么普通的

BeanPostProcessor 是否也会被 AOP 代理呢？答案是肯定的。读者如果感兴趣，可以⾃⾏


## 9.2.3 作用时机

既然IOC容器的刷新动作中的第六步 registerBeanPostProcessors 方法已经把

AnnotationAwareAspectJAutoProxyCreator 创建就绪，接下来的bean 对象在初始化阶

段中它就会⼲预。我们以第5章中编写的示例代码为例，观察 DemoService 对象的创建流程

中 AnnotationAwareAspectJAutoProxyCreator 是如何切人逻辑进⾏⼲预的。

1. getBean - doCreateBean

bean 对象的创建流程在第7章中已经讲过，从 getBean 开始依次是 doGetBean、create

Bean 和 doCreateBean，在 doCreateBean 方法中会真正地创建对象、属性赋值、依赖注人，

以及初始化流程的执⾏。在 bean 对象本身的初始化流程全部执⾏完毕后，下⼀步要执⾏的是

BeanPostProcessor 的 postProcessAfterIntialization 方法。在这之前有⼀个小插

曲，即 createBean 到 doCreateBean 的环节，该环节有⼀个 InstantiationAwareBean

PostProcessor 的拦截初始化动作，读者需要先注意⼀下这个动作。

2. postProcessBeforelnstantiation

PostProcessBeforeInstantiation 如代码清单9-5所示。

代码清单 9-5 AnnotationAwareAspectJAutoProxyCreator#postProcessBeforelnstantiation

PuoLie Oblect postrrocessbetorelnstantiation （Classs：> beancLass, string beanName）

Object cacheKey = getCacheKey （beanClass,beanName）；

1/ 决定是否要提前增强当前 bean 对象

if（！StringUtils.hasLength（beanName）II !this.targetSourcedBeans.contains （beanName））｛

1/ 被增强过的bean 对象不会再次被增强

if（this.advisedBeans.containsKey （cacheKey））｛

return null；

// 基础类的bean 对象不会被提前增强，被跳过的bean 不会被提前增强

if （isInfrastructureClass （beanClass）I| shouldSkip （beanClass，beanName））｛

this.advisedBeans.put （cacheKey, Boolean.FALSE）；

return null；

通读整个方法后，读者可能会有⼀种感觉：整体方法的逻辑大体清晰，但具体到某⼀个细

节会⽐较迷茫。出现该感觉是正常的，因为这⾥⾯有⼏个小概念在之前的学习中没有接触过，

了解这些概念和设计之后，读者再理解这部分逻辑就容易多了。

解


## 9.2 AnnotationAwareAspectJAutoProxyCreator|

1/ 原型bean 对象的额外处理：TargetSource

1/ 此处的设计与⾃定义TargetSource 相关，单实例 bean 对象必定返回 nu11

TargetSource targetSource = getCustomTargetSource （beanclass,beanName）；

if （targetSource ！= nu11）｛

if （StringUtils.hasLength （beanName））｛

this.targetSourcedBeans.add （beanName）；

Object ［］ specificInterceptors = getAdvicesAndAdvisorsForBean （beanClass，

beanName,targetSource）；

Object proxy = createProxy （beanClass,beanName,specificInterceptors,targetSource）；

this.proxyTypes.put （cacheKey,proxy.getClass （））；

Leturn PrOXY：

return null；

（1） InfrastructureClass

InfrastructureClass 直译为“基础类型”，它指代的是 TOC 容器中注册的基础类，包

括切⾯类、切入点、增强器等 bean 对象。通过代码清单9-6就可以了解到，如果⼀个 bean对

象本⾝是切⾯类/切入点/增强器等，那么它本⾝是参与AOP 底层的成员，不应该参与具体的被

增强对象中。

代码清单 9-6 isInfrastructureClass 过滤基础类的 bean 对象

protected boolean isInfrastructureClass （Class<?> beanClass）｛

return（super.isInfrastructureClass （beanClass）||

（this.aspectJAdvisorFactory！= null && this.aspectJAdvisorFactory.isAspect （beanClass）））；

Protected boolean isInfrastructureClass （Class<?> beanClass）｛

boolean retVal = Advice.class.isAssignableFrom （beanClass）

|| Pointcut.class.isAssignableFrom （beanClass）

I| Advisor.class.isAssignableFrom （beanClass）

I| AopInfrastructureBean.class.isAssignableFrom （beanClass）；

1/ logger

return retVal；

（2）被跳过的bean对象

检查完基础类的 bean 对象，紧接着要检查准备增强的bean对象是否需要被跳过，如何理

：“被跳过的bean 对象”？读者可以先结合代码清单9-7简单梳理⼀遍逻辑。

1代码清单 9-7 shouldSkip 检查⼀个 bean 对象是否需要被跳过


## 11 ⽗类AspectJAwareAdvisorAutoProxyCreator

protected boolean shouldSkip （Class<?> beanClass,String beanName）｛

// 加载增强器

List<Advisor> candidateAdvisors = findCandidateAdvisors （）；

强器名称⼀致。

所舌，请读者对这个细节先有⼀个印象。



# 第9章AOP 模的⽣命周期


## 第9章AOP 模的⽣命周期

Eor（Advisor advisor :candidateAdvisors）｛

//逐个匹配，如果发现当前bean 对象的名称与增强器的名称⼀致，则认为不能被增强

if （advisor instanceof AspectJPointcutAdvisor &&

（（AspectJPointcutAdvisor） advisor）.getAspectName （）.equals （beanName））｛

return true：

super.shouldSkip （beanClass，

1/ AbstractAutoProxyCreator

protected boolean shouldSkip（Class<?> beanClass,String beanName）｛

// 检查 beanName 代表的是不是原始对象（以.ORIGINAL结尾）

return AutoProxyUtils.isoriginalInstance （beanName， beanClass）；

代码清单9-7中已经辅助有代码注释，想必读者可以大体把控这段逻辑的用意，它要检

查的点是当前对象的名称是否与增强器的名称⼀致，换句话说，shouldSkip 方法要检查当

前准备增强的 bean 对象是不是⼀个还没有经过任何代理的原始对象，⽽检查的规则是观察

bean 对象的名称是否带有.ORIGINAL 的后缀，⼀般情况下项目中创建的bean 不可能带

有.ORIGINAL 后缀，所以 shouldSkip 方法相当于判断当前创建的bean 对象名称是否与增

可能有部分读者不了解增强器的概念，这⾥简单解释⼀下。⼀个 Advisor 可以视⼀个

切入点+⼀个通知方法的结合体，对于 Aspect 切⾯类中定义的通知方法，方法体+方法上的通知

注解就可以看作⼀个 Advisor 增强器，关于更详细的解释会在9.3节中展开。

注意，实际在此处 Debug 时可以发现，findCandidateAdvisors 加载增强器的方法执

⾏完成后能获取到⼀个增强器，也就是 ServiceAspect 中定义的beforePrint 方法，如图9-2

candidateAdvisors = ｛ArrayList@3961） size = 1

w =instanuauonoaeiAwareronntcutAdvsorimpig s9o.）instantationModelAwar

> declaredPointcut = （AspectExpressionPointcut@3965）..toStringO

declaringClass = （Class@3904）. Navigate

methodName = "beforePrint"

parameterTypes = （Class［0j@3967）

t aspect/AdviceMethod = （Method@3968）.. toStringo

> aspect Advisorfactory = （ReflectiveAspect/AdvisorFactory@3890）

aspectlnstancefactory = （LarySingletonAspectinstancefactoryDecorator@3969）

declarationOrder = 0

>M aspectName = 'serviceAspect"

> Y pointcut = （AspectJExpressionPointcut@3965）.. toString0

图 9-2 candidateAdvisors 中存放了 Aspect 切⾯类的方法

（3） TargetSource

有关rargetSource 的设计，这⾥只简单解释⼀句：AOP的代理其实不是代理目标对象

本身，⽽是目标对象经过包装后的 TargetSource 对象。关于 Spring Framework 这样做的理

由以及这样做的好处，在9.4节中我们会展开讲解。

3. postProcessAfterInitialization

前⾯的 postProcessBeforeInstantiation 方法拦截判断结束后，Annotation

先简单概括⼀下创建代理对象核心动作的三个步骤。

源码分别来看。


## 9.3 Advisor 与切⾯类的收集！

AwareAspectJAutoProxyCreator 再发挥作用就要等到最后⼀步的 postProcess

AfterInitialization 方法，该方法是真正地⽣成代理对象，如代码清单9-8所示。

代码清单9-8 核心后置处理动作：创建代理对象

Public Object postProcessAfterInitialization （@Nullable Object bean,String beanName）｛

if （bean ！= nul1）｛

Object cacheKey = getCacheKey （bean.getClass（），beanName）；

If（this.earlyProxyReferences.remove （cacheKey）！= bean）｛

// 核心：构造代理

return wrapIfNecessary （bean,beanName,cacheKey）；

return bean；

postProcessAfterInitialization 方法内部的代码量看上去不多，但这个方法的难

度⾮常⾼，核心的动作在中间的wraPIfNecessary中，这部分在9.5节中会详细展开，这⾥

（1）判断决定是否是不会被增强的bean对象。

（2）根据当前正在创建的 bean 对象去匹配增强器。

（3）如果有增强器，创建bean 对象的代理对象。

整体了解了 AnnotationAwareAspectJAutoProxyCreator 的设计后，下⾯分阶段讲

解整个 AOP ⽣命周期中的核心步骤。


## 9.3 Advisor 与切⾯类的收集

上⾯在分析 shouldSkip 方法时提到了⼀个⾮常重要的名次 Advisor 增强器的概念，如

何理解“增强器”的概念以及 Spring Framework 中设计的增强器的类型是我们探讨的重点。


## 9.3.1 收集增强器的逻辑

回到 AnnotationAwareAspectJAutoProxyCreator 的 postProcessBeforeInst

antiation 方法中，前⾯已经提到了 findCandidateAdvisors 方法是收集候选增强器的

动作，⽽这个方法本身⼜分为两个部分，分别是收集 Spring Framework 原⽣的增强器以及

BeanFactory 中所有Aspect】 形式的切⾯并封装为增强器，如代码清单 9-9所示。下⾯结合

代码清单 9-9 findCandidateAdvisors 收集候选的增强器

// AspectJAwareAdvisorAutoProxyCreator

Protected boolean shouldSkip （Class<?> beanClass,String beanName）｛

List<Advisor> candidateAdvisors - findCandidateAdvisors （）；

1…....

protected List<Advisor> findCandidateAdvisors（）｛

// 根据⽗类的规则添加所有找到的Spring 原⽣的增强器

所示。

|第9章AOP模块的⽣命周期

List<Advisor> advisors = super.findCandidateAdvisors （）；


## 11 解析 BeanFactory 中所有的 AspectJ切⾯，并构建增强器

i （this.aspectJAdvisorsBuilder ！= null）｛

advisors.addA11 （this.aspectJAdvisorsBuilder.buildAspectJAdvisors （））；

return advisors：


## 9.3.2 收集原⽣增强器

通过观察⽗类 AbstractAdvisorAutoProxyCreator，可以发现它委托了⼀个

advisorRetrievalHelper 来处理 Spring Framework 原⽣的 AOP 增强器，这个 find

AdvisorBeans 方法的篇幅⽐较⻓，下⾯拆解出核心的主⼲逻辑研究，如代码清单9-10

|代码清单9-10 收集原⽣增强器借助了 BeanFactoryAdvisorRetrievalHelper

Private BeanFactoryAdvisorRetrievalHelper advisorRetrievalHelper；

protected List<Advisor>findCandidateAdvisors（）｛

Assert.state（this.advisorRetrievalHelper ！= null，

"No BeanFactoryAdvisorRetrievalHelper available"）；

return this.advisorRetrievalHelper.findAdvisorBeans （）；

1. 检查现有的增强器 bean对象

findAdvisorBeans 方法的第⼀部分源码主要是将 IOC 容器中所有类型为 Advisor 的

实现类对象都获取到，并检查IOC容器内部是否注册有增强器，如果没有注册增强器则不会执

⾏后续逻辑，如代码清单9-11所示。注意这个 BeanFactoryUtils的beanNamesForType

IncludingAncestors 方法，底层会使用 getBeanNamesForType 方法来寻找bean 对象的

名称（单纯地寻找bean 对象的名称不会创建具体的bean 对象，Spring Framework 在此设计得很

谨慎），感兴趣的读者可以借助IDE ⾃⾏研究，这⾥不展开探讨。

1代码清单 9-11 findAdvisorBeans （1）

public List<Advisor> findAdvisorBeans （）｛

// 确定增强器bean 对象名称的列表（如果尚未缓存）

Stringl］ advisorNames = this.cachedAdvisorBeanNames；

if （advisorNames == nul1）｛

1/ 不要在这⾥初始化 FactoryBeans：

// 我们需要保留所有未初始化的常规 bean 对象，以使⾃动代理创建者对其应用

advisorNames = BeanFactoryUtils.beanNamesForTypeIncludingAncestors（

this.beanFactory,Advisor.class, true, false）；

this.cachedAdvisorBeanNames = advisorNames；

1/ 如果当前IOC容器中没有任何增强器类型的bean 对象，直接返回

iE （advisorNames.length == 0）｛

return new ArrayList<>（）；

1….

所以这⾥读者仅需⼀般了解。

构造等步骤，这部分逻辑更加复杂，下⾯逐步探究。


## 9.3 Advisor 与切⾯类的收集|

2. 初始化原⽣增强器

如果上⾯检查到 IOC容器中注册有原⽣的 Advisor 增强器，则下⾯会使用BeanFactory

的 getBean 方法初始化这些增强器，如代码清单9-12所示。Spring Framework 原⽣的增强器

模型因其设计和编写⽐较复杂，目前已经被淘汰，主流的通知编写还是以 AspectJ 形式为主，

代码清单9-12 findAdvisorBeans （2）

List<Advisor> advisors = new ArrayList<>（）；

for （String name : advisorNames）｛

iE（isEligibleBean （name））｛

if（this.beanFactory.isCurrentlyIncreation （name））｛

// logger ..

｝ else｛

try｛

advisors.add （this.beanFactory•getBean （name,Advisor.class））；

）// catch •.

return advisors；

实际通过 Debug 也可以发现并没有原⽣的增强器被创建，如图9-3所示。

protected ListsAdvisor>findcandidateAdvisors（）｛

L256$A0V25062 a9v25053

aavisors.addAll this.aspectiAdVisorsBu1laer.oullaAspectJAdv1

图9-3 默认情况下没有原⽣的增强器

以上就是在⽗类 AbstractAdvisorAutoProxyCreator 中的 findCandidateAdvisors

方法的逻辑，下⾯来看另⼀部分的委托 aspectJAdvisorsBuilder。


## 9.3.3 解析 Aspect】切⾯封装增强器

从方法名上理解，aspectJAdvisorsBuilder.buildAspectJAdvisors 方法可以将

Aspect 切⾯类转换为⼀个个增强器。既然是转换切⾯类，就必然有通知方法的解析、增强器的

1. 逐个解析 IOC 容器中所有的 Bean 类型

呵 提示：buildAspectJAdvisors 方法的源码缩进层数⽐较多，为保证源码的阅读体验，代码清

单9-13的缩进会以两个空格为主。

buildAspectJAdvisors 方法的第⼀部分核心逻辑是将IOC容器以及⽗容器中所有bean 对

象的名称全部提取出（直接声明⽗类为 Object，显然是全部提取），之后会逐个解析这些 bean对

象对应的 Class，如代码清单9-13所示。通过 Debug 可以发现，获取的bean 对象名称中包括10C

容器内部的⼀些组件（主启动类、⾃动配置类等）在内的所有 bean对象名称，如图9-4所示。

｝

|第9章 AOP模块的⽣命周期

1代码清单 9-13 buildAspectJAdvisors （1）

Public List<Advisor> buildAspectJAdvisors（）｛

List<String> aspectNames = this.aspectBeanNames；

if （aspectNames == nu11）｛

synchronized （this）｛

aspectNames = this.aspectBeanNames；

if （aspectNames == nul1）｛

List<Advisor> advisors = new ArrayList<>（）；

aspectNames = new ArrayList<>（）；

// 获取 IOC 容器中的所有 bean 对象

String［］ beanNames = BeanFactoryUtils.beanNamesForTypeIncludingAncestors（

this.beanFactory,Object.class, true, false）；

for（String beanName :beanNames）｛

if （！isEligibleBean （beanName））｛

continue；

/1 原⽂注释：我们必须小心，不要急于实例化bean，因为在这种情况下，IOC容器会缓存它们，但不会被

// 织入增强器

Class<?> beanrype =this.beanFactory•getType （beanName）；

i£ （beanType == null）｛

continue；

11…..

E beanNames = （String［140］@3889）

o= org.springiramework.context.annotaton.internalcongurationAnnotationrrocessor

1= 'org.springframework.context.annotation.internalAutowiredAnnotationProcessor'

繳 2='org.springframework.context.annotation.internalCommonAnnotationProcessor"

s= org.spnngiramework.context.event.internaltventListenerrrocessor

E 4='org.springframework.context.event.internalEventListenerFactory"

E 5 ='springBootAopApplication"


## 6 = "org.springframework.boot.autoconfigure.internalCachingMetadataReaderFactory


## 2 7= "serviceAspect"

8= 'demoService”


## 9 ='org.springframework.aop.config internalAutoProxyCreator"


## 10 ='org.springframework.boot.autoconfigure.AutoConfigurationPackages

鐵 11= "org.springframework.boot.autoconfigure.context.PropertyPlaceholderAutoConfiguration'


## 12 = *nrnnerh/Snurcecplacahnlderfnnfinurerm

图9-4 获取 IOC 容器中的所有 bean 对象名称

请读者注意⼀个细节，Spring Framework 在这⾥控制得很好，它借助BeanFactory 提取

bean 对象的类型，⽽不是先 getBean 后再提取类型，这样可以确保 bean对象不会被提前创建。

⽽要在没有初始化 bean 对象的前提下获取 bean 对象的 Class，只能依靠 BeanDefinition

中封装的信息，所以在 AbstractBeanFactory 的 getType 方法中可以看到合并 RootBean

Definition 的动作，随后调用 RootBeanDefinition 的 getBeanClass 方法获取 bean

对象的Class（关于具体源码读者可以⾃⾏借助IDE 翻阅，这⾥不再展开）。

2. 解析 Aspect 切⾯类，构造增强器

w 提示：以下源码的缩进过大，为方便读者阅读，代码清单9-14中的缩进有调整。


## 9

从⽂档注释中可以获取到⼀些信息：

Advisor 与切⾯类的收集|

紧接着第⼆部分逻辑要完成的工作是判断当前解析的bean 对象的所属类型是否为切⾯类，

如果是则会进入if结构内部，将这个类中的通知方法都转换为 Advisor增强器，如代码清

单9-14所示。这⾥⾯的⼀些细节值得继续深入探究。

代码清单 9-14 buildAspectJAdvisors （2）


if（this.advisorFactory.isAspect （beanType））

// 当前解析 bean 对象的所属类型是⼀个切⾯类

aspectNames .add （beanName）；

AspectMetadata amd = new AspectMetadata （beanType,beanName）：

// 下⾯是单实例切⾯ bean 对象会执⾏的流程

if （amd.getAjType （）.getPerClause （）.getKind（）== PerClauseKind.SINGLETON）｛

MetadataAwareAspectinstanceractory tactory =

new BeanFactoryAspectInstanceFactory（this.beanFactory,beanName）；

// 解析⽣成增强器

List<Advisor> classAdvisors = this.advisorFactory.getAdvisors （factory）；

if（this.beanFactory.isSingleton （beanName））｛

this.advisorsCache.Put （beanName,classAdvisors）；

｝ else｛

this.aspectFactoryCache.put （beanName,factory）；

advisors.addA11 （classAdvisors）；

（1） 判断 Class 是否是通知类

代码清单9-14中最上⾯的if结构中 advisorFactory.isAspect （beanType） 用来判断

当前 Class 是不是通知类（切⾯类），除了检查类上是否标注了@Aspect 注解，源码中还多判

断了⼀步，如代码清单 9-15 所舌。

1代码清单 9-15 isAspect 判断⼀个 Class 是否为通知类

public boolean isAspect （Class<?> clazz）｛

// @Aspect 注解并且不是被ajc 编译器编译的

return （hasAspectAnnotation （clazz）&& ！compiledByAjc （clazz））；

请注意，isAspect 方法额外判断了是不是被 ajc 编译器编译，为什么要额外多⼀步判断？

We consider something to be an AspectJ aspect suitable for use by the Spring AOP system if it

has the @Aspect annotation, and was not compiled by ajc. The reason for this latter test is that aspects

written in the code-style （AspectJ language） also have the annotation present when compiled by ajc

with the - 1.5 flag, yet they cannot be consumed by Spring AOP.

只有当它有@Aspect 注解并且不是由ajc编译的，我们才认为这个 Class 是适合 SpringAOP

系统使用的 Aspect］切⾯。不用ajc 编译的原因是，以代码风格（AspectJ语⾔）编写的切⾯在由带

有-1.5标志的 ajc 编译时也存在注解，但它们不能被 SpringAOP 使用。

简单地说，Spring Framework 的AOP 有整合 AspectJ的部分，⽽原⽣的 AspectJ 也可以

编写 Aspect 切⾯类，⽽这种切⾯在特殊的编译条件下⽣成的字节码中在类上也会标注@Aspect

方法的源码⽐较⻓，读者在阅读时要结合注释来理解。

下⽂的逻辑中补充了⼀些额外的校验、处理等逻辑。这⾥⾯重点关注两个小动作：通知方法是

如何收集的；增强器的创建需要哪些关键信息。

I第9章AOP 模块的⽣命周期

注解，但是 Spring Framework 并不能利用它，所以 isAspect 方法做了⼀个额外的判断处理，

避免了这种Class被误加载。

（2）构造增强器

构造增强器的调用动作是 if结构中的 advisorFactory•getAdvisors，这部分需要跳

转到 ReflectiveAspectJAdvisorFactory 中来看，如代码清单9-16所示。getAdvisors

1代码清单 9-16 ReflectiveAspectJAdvisorFactory#getAdvisors

public List<Advisor> getAdvisors （MetadataAwareAspectInstanceFactory aspectInstanceFactory）｛

// Aspect 切⾯类的 Class

Class<?> aspectClass = aspectInstanceFactory.getAspectMetadata （）•getAspectClass（）：

String aspectName = aspectInstanceFactory.getAspectMetadata （）.getAspectName （）；

1/ 校验

1/此处利用 Decorator 装饰者模式，目的是确保 Advisor 增强器不会被多次实例化

MetadataAwareAspectInstanceFactory lazySingletonAspectInstanceFactory =

nev LazysingletonAspectInstanceFactoryDecorator （aspectInstanceFactory）；

List<Advisor> advisors = new ArrayList<>（）；

// 逐个解析通知方法，并封装为增强器

for（Method method : getAdvisorMethods （aspectClass））｛

Advisor advisor = getAdvisor（method, lazySingletonAspectInstanceFactory, 0, aspectName）；

if （advisor ！= null）｛

advisors.add （advisor）；

｝

// 通过在装饰者内部的开始加入SyntheticInstantiationAdvisor 增强器，

// 达到延迟初始化切⾯ bean 对象的目的

if （！advisors.isEmpty（）

&& lazysingletonAspectInstanceFactory.getAspectMetadata（）.isLazilyInstantiated（））｛

Advisor instantiationAdvisor =

new SyntheticInstantiationAdvisor （1azysingletonAspectInstanceFactory）；

advisors.add （0,instantiationAdvisor）；

// 对DeclareParent 注解功能的⽀持（AspectJ的引介）

for （Field field :aspectClass.getDeclaredFields （））｛

Advisor advisor = getDeclareParentsAdvisor （field）；

if （advisor ！= nul1）｛

advisors.add （advisor）；

return advisors；

整段源码阅读下来，方法执⾏的核心逻辑是解析 Aspect 切⾯类中的通知方法，只不过在上


## 9

最后将通知方法返回。

MetadataAwareAspectInstanceFactory aspectInstanceFactory，

别如下。

Advisor 与切⾯类的收集|

（3）收集切⾯类中的通知方法

对于通知方法的收集动作，需要进入 getAdvisorMethods 方法中分析，如代码清单9-17

所示。getAdvisorMethods 方法本身不难，就是把开发者定义的切⾯类中除通用的切入点表

达式以外的所有方法都提取出来，并且在取出之后进⾏排序（排序的原则是按照 Unicode 编码），

代码清单9-17 获取⼀个切⾯类的所有通知方法

private List<Method> getAdvisorMethods （Class<?> aspectClass）｛

final List<Method> methods = new ArrayList<>（）；

ReflectionUtils.dowithMethods （aspectClass, method -> ｛

/ 除 pointcut 之外

if （AnnotationUtils.getAnnotation（method,Pointcut.class） == nul1）｛

methods.add （method）；

｝，ReflectionUtils.USER_DECLARED_METHODS）；

if（methods.size（）>1）｛

methods.sort （METHOD_COMPARATOR）；

return methods；

（4）创建增强器

getAdvisor 方法对应的逻辑是创建 Advisor增强器。读者可能在此处会产⽣疑惑，上

⾯的 getAdvisorMethods 方法仅提取了当前类中定义的⾮@Pointcut 方法，对于没有声明

切人点表达式的方法是否会⼀并返回？对于这个问题其实读者不必多虑，源码在此处⼜做了⼀

次过滤，如代码清单 9-18 所示。

代码清单9-18 创建增强器时进⾏⼀次额外的过滤

uoLic AaVisor getAavisor （Metnod CanaiaateAavicemethod，

int declarationorderinAspect, string aspectName）

validate （aspectInstanceFactory.getAspectMetadata （）.getAspectClass （））；

// 解析切入点表达式

AspectJExpressionPointcut expressionPointcut = getPointcut （candidateAdviceMethod，

aspect InstanceFactory.getAspectMetadata （）•getAspectClass （））；

// 没有声明通知注解的方法也会被过滤

if （expressionPointcut == nul1）｛

return null；

return new InstantiationModelAwarePointcutAdvisorImp1（expressionPointcut，

candidateAdviceMethod, this,aspectInstanceFactory，

declarationorderInAspect,aspectName）；

Spring Framework 本身设计得很严谨，注意看最后⼀⾏的构造方法中传入的关键参数，分

•expressionPointcut: AspectJ切入点表达式的封装。

测完全⼀致。

⾄此其实增强器本身已经没有什么问题，除此之外读者可以再关注⼀下创建增强器时

所示。

I第9章AOP模块的⽣命周期

• candidateAdviceMethod：通知方法本体。

• this：当前的ReflectiveAspectJAdvisorFactoryo

• aspectInstanceFactory：上⾯的装饰者MetadataAwareAspectInstanceFactory。

去掉工⼚本身后，其实增强器的结构就是⼀个切入点表达式+⼀个通知方法，与之前的推

（5）解析通知注解上的切人点表达式

getPointcut 方法对应的切人点表达式解析，进入getPointcut 方法中，如代码清单9-19

代码清单 9-19 获取、解析切入点表达式

private AspectJExpressionPointcut getPointcut （Method candidateAdviceMethod，

Class<?> candidateAspectClass）1

1/ 检索通知方法上的注解

AspectJAnnotation<？> aspectJAnnotation =

AbstractAspectJAdvisorFactory.findAspectJAnnotationonMethod （candidateAdviceMethod）；

iE （aspectJAnnotation == null） ｛

return null；

// 根据注解的类型，构造切入点表达式模型

AspectJExpressionPointcut ajexp =

new AspectJExpressionPointcut （candidateAspectClass,new String［0l,new Class<?>［01）；

ajexp.setExpression （aspectJAnnotation.getPointcutExpression （））；

if （this.beanFactory ！= nul1）｛

ajexp.setBeanFactory （this.beanFactory）；

return ajexp；

private static final Class<?>I］ ASPECTJ_ANNOTATION_CLASSES = new Class<?>［］｛

Pointcut.class,Around.class,Before.class,After.class，

AfterReturning.class, AfterThrowing.class｝；

protected static AspectJAnnotation<？> findAspect JAnnotationOnMethod （Method method）｛

Eoz （Class<?> clazz :ASPECTJ_ANNOTATION_CIASSES）｛

AspectJAnnotation<？> foundAnnotation =

findAnnotation（method，（Class<Annotation>） clazz）；

i£ （foundAnnotation ！= null）｛

return foundAnnotation；

return null；

getPointcut 方法的步骤很简单，它⾸先会搜寻通知方法上标注的注解，然后提取切人点

表达式的信息并返回，⽽寻找Aspect］ 注解的findAspectJAnnotationOnMethod方法逻辑，

则是直接在 AbstractAspectJAdvisorFactory 中提前定义好了所有可以声明切人点表达

返回。

最后⼀部分是整理的环节，前⾯已经把所有的切⾯类都解析完毕，最后只需把这些构造好


## 9.3 Advisor 与切⾯类的收集|

式的注解（@Around、@Before、BAfter 等），并在此处⼀⼀寻找，如果可以成功找到则

在调用 getPointcut 方法的位置打入 Debug 断点，待程序停在断点时可以发现，

getPointcut 方法只是把切人点表达式的内容以及参数等信息封装到 AspectJExpr

essionPointcut 中⽽已，如图9-5所示。

P candidateAdviceMethod = （Method@3907）..toString0

P aspectInstancefactory = （LazySingletonAspectlnstancefactoryDecorator@3932）. toString0

p declarationOrderinAspect=0

p aspectName = "serviceAspect"

expressionPointcut = （AspecUExpressionPointcut@3926）.. toStringO

> pointcutDeclarationScope = ｛Class@3883）.. Navigate


## 1 pointcutParameterNames = ｛String［0］@3927）

f pointcutParameterTypes = （Class/0］@3928）

> beanFactory = （DefaultListableBeanFactory@3910）.. toStringO

f pointcutClassLoader = null

f pointcutExpression = null

f shadowMatchCache = （ConcurrentHashMap @3929｝ size =0

location = null

a expression = "execution（public * com.linkedbear.springboot.service.*.*（.））

图9-5 封装好的切入点表达式模型

3. 原型切⾯ Bean 的处理

上⾯的逻辑只是对单实例切⾯ Bean 的处理和解析，下⾯的 else 部分是原型切⾯Bean 的处

理逻辑，如代码清单 9-20所示。对于原型切⾯Bean 的解析，核心解析动作依然是 advisor

Factory.getAdvisors 方法，只是原型切⾯ Bean 的解析不会再使用 advi sorsCache 这个

缓存区，这也说明原型切⾯ Bean 的解析是多次执⾏的。

代码清单9-20 原型切⾯ Bean 的处理

1..

else｛

// 检查单实例 Bean 并抛出异常 …•…••.

MetadataAwareAspectInstanceFactory factory =

new PrototypeAspectInstanceFactory （this.beanFactory,beanName）；

this.aspectFactoryCache.Put （beanName,factory）；

1/ 解析 Aspect 切⾯类，构造增强器

advisors.addA11 （this.advisorFactory.getAdvisors （factory））；

this.aspectBeanNames = aspectNames；

retur a0v1s0rs

4.增强器汇总

I第9章AOP模块的⽣命周期

的增强器都集中到⼀个List 中返回，如代码清单9-21所示。经过以上⼀系列的步骤后，切入

点表达式解析完毕，通知方法收集完毕，Advisor 增强器也顺利地创建完毕。创建好的增强器

将会在普通bean 对象的初始化阶段中待命，等待织人的动作。

】代码清单 9-21 收集好的增强器汇总

if （aspectNames.isEmpty（））｛

return Collections.emptyList （）；

List<Advisor> advisors = new ArrayList<>（）；

for （String aspectName :aspectNames）｛

List<Advisor> cachedAdvisors = this.advisorsCache.get （aspectName）；

if （cachedAdvisors ！= null）｛

advisors.addA11 （cachedAdvisors）；

｝ else｛

MetadataAwareAspectInstanceFactory factory = this.aspectFactoryCache.get （aspectName）；

advisors.addA11 （this.advisorFactory.getAdvisors （factory））；

return advisors；

在整个方法最后打入 Debug 断点，待程序停在断点时可以发现Logger 中的5个增强器都

封装好了，如图9-6所舌。

aspectNames = （ArrayList@3944） size =1

advisors = ｛ArrayList@3945｝ size = 1

Y =0= ｛nstantiationModelAwarePointcutAdvisorimp@3955）.. toStringO

>“ declaredPointcut = （AspectJExpressionPointcut@3956）.. toStringo

> declaringClass = （Class@3883. Navigate

>“methodName = "beforePrint*

parameterTypes = （Class/01@3958）

>f aspectAdviceMethod = （Method@3959）... toString0

>'f aspectJAdvisorFactory = （ReflectiveAspectAdvisorFactory@ 3946）

>“ aspectistanceFactory = （LazySingletonAspectinstanceFactoryDecorator@3960）

“declarationOrder =0

>f aspectName = "serviceAspect"

>' pointcut = （AspectExpressionPointcut @3956）.. toString0

lazy = false

> f instantiatedAdvice = ｛AspectMethodBeforeAdvice@3962）..tostringO

f isBeforeAdvice = null

f isAfterAdvice =null

图9-6 封装好的增强器就是项目中定义好的


## 9.4 TargetSource 的设计

在9.2.3 节中提到过⼀点，AOP 的代理其实代理的不是目标对象本⾝，⽽是目标对象经过

包装后的 TargetSource 对象。Spring Framework 为什么要这样做？这样做有什么好处？本节

来深入研究。

proxy

target

target

体对象实例，从⽽让方法的调用更加灵活。


## 9.4 TargetSource 的设计|


## 9.4.1 TargetSource 的设计

在 Java 原⽣的动态代理中，代理对象中直接组合了原始对象，可以通过图9-7直观地理解。

图9-7 动态代理中 target 与 proxy的关系

但是在 Spring Framework 的AOP 中，代理对象并没有直接代理 target，⽽是给 target 加了

⼀个“壳”，⽽这个“壳” 就是 TargetSource，如图9-8 所示。

proxy

； Targetsource

图9-8 AOP 中 target 与 proxy 的关系

将图9-7与图9-8对⽐来看，想必读者可以更直观地理解两者的差异。TargetSource 可以

看作目标对象 target 的⼀个包装、容器，原本代理对象在执⾏ method.invoke （target,args）

这样的逻辑时，要取的是目标对象，但被TargetSource 包装之后，就只能改用 method.

invoke （targetSource.getTarget（）， args）进⾏方法的反射执⾏。


## 9.4.2 TargetSource 的好处

既然每次调用代理对象的方法时最终会调用 TargetSource 的 getrarget 方法，⽽

getTarget 方法决定了 TargetSource 如何返回目标对象，这就出现了可供扩展的切入点。

举个最简单的例子：每次 getTarget 的值可以不⼀样，或者每次执⾏ getTarget 的时候可

以从⼀个对象池中获取（读者是否突然想到了数据库连接池），其实 TargetSource 也有基于

池的实现。

简单总结起来，让 AOP 代理TargetSource 的好处是可以控制每次方法调用时作用的具


## 9.4.3 TargetSource 的结构

通过查看 TargetSource 的源码可以发现它是⼀个接口，如代码清单9-22 所示。

代码清单 9-22 TargetSource 本身是⼀个接口

public interface TargetSource extends TargetClassAware ｛

Class<?> getTargetClass （）；

boolean isStatic（）；

Object getTarget （） throws Exception；

法名上就能很快地理解该方法的作用是交回/释放目标对象，也用于那些基于对象池的

可以简单了解⼀下。

所示。



# 第9章 AOP 模块的⽣命周期


## 第9章 AOP 模块的⽣命周期

void releaseTarget （Object target） throws Exception；

除了 getrarget 方法，TargetSource 接口还有⼀个 releaseTarget 方法，仅从方

TargetSource，在目标对象调用方法完成后紧接着调用 releaseTarget 方法释放目标对象。

另外 TargetSource 接口还有⼀个 isstatic 方法，对此读者可能会疑惑：如何理解 bean

对象的动态和静态之分？对于Java 来讲，通过c1ass 与对象的作用域可以区分出静态和⾮静

态（Class级的成员是静态的，对象级的成员是⾮静态的）。对于 Spring Framework 来讲，通

过单实例bean 对象与原型bean 对象的作用域也可以区分出静态和⾮静态：单实例bean 对象是

⼀个 Applicationcontext 中只有⼀个实例，原型 bean对象是每次获取都会得到⼀个全新

的实例，所以单实例 bean 对象就为“静态 bean 对象”，原型 bean 对象则为⾮静态bean 对象。


## 9.4.4 Spring Framework 中提供的 TargetSource

Spring Framework 中针对不同场景和不同需求，预设了⼏个 TargetSource的实现，读者

• SingletonTargetSource：每次调用 getTarget 方法都会返回同⼀个目标 bean

对象（与直接代理 target ⽆任何区别）。

PrototypeTargetSource： 每次调用 getTarget 方法都会从 BeanFactory 中创

建⼀个全新的bean 对象（被它包装的bean 对象必须原型bean对象）。

CommonsPoo12TargetSource：内部维护⼀个对象池，每次调用 getTarget 方

法时从对象池中提取出对象（底层使用 Apache 的 objectPoo1）。

ThreadLocalTargetSource：每次调用 getTarget 方法都会从它所处的线程中提

取目标对象（由于每个线程都有⼀个 TargetSource，因此被它包装的bean 对象也必

须是原型 bean 对象）。

HotSwappableTargetSource：内部维护了⼀个可以热替换的目标对象引用，每次

调用 getTarget 方法时都返回它（它提供了⼀个线程安全的swap 方法，以热替换

TargetSource 中被代理的目标对象）。

以上设计在底层都不算复杂，感兴趣的读者可以⾃⾏借助 IDE 阅读源码，这⾥不再展开。


## 9.5 代理对象⽣成的核心：wraplfNecessary

在9.2.3 节中读者已经了解到， 终 bean 对象的初始化会被 BeanPostProcessor 的post

ProcessAfterInitialization 方法处理，进人 AnnotationAwareAspectJAutoPrOxy

Creator 的 postProcessAfterInitialization 方法中，它⼜要调用 wrapIfNecessary

方法来尝试创建代理，本节内容就深入探究 wrapIfNecessary 方法的脉络，如代码清单9-23

1代码清单 9-23 wraplfNecessary 决定是否⽣成代理对象

Protected Object wrapIfNecessary （Object bean,String beanName，Object cacheKey）｛

// 判断决定是否是不会被增强的bean 对象

return bean；

者可以简单梳理⼀遍，重点关注中间的两个重要步骤：1）获取增强器；2）创建代理对象。

下⾯逐个展开。


## 9.5 代理对象⽣成的核心：wraplfNecessaryl

if （Stringutils.hasLength （beanName）&& this.targetSourcedBeans.contains （beanName））（

return bean；

｝

if （Boolean.FALSE.equals （this.advisedBeans.get （cacheKey）））｛

return bean；

｝

i （isInfrastructureClass （bean.getClass （））I| shouldSkip （bean.getClass（），beanName））（

this.advisedBeans .put （cacheKey,Boolean .FALSE）；

return bean：

// 如果上⾯的判断条件都不成⽴，则决定是否需要进⾏代理对象的创建

Object ［］ specificInterceptors =getAdvicesAndAdvisorsForBean（bean.getClass （），beanName,nu11）；

if（specificInterceptors ！= DO_NOT_PROXY） ｛

this.advisedBeans.put（cacheKey,Boolean.TRUE）；

// 创建代理对象的动作

1/ 注意此处它创建了⼀个 singletonTargetSource，将bean 对象包装起来了

object proxy = createProxy（bean.getClass（），

beanName,specificInterceptors,new SingletonTargetSource （bean））；

this.proxyTypes.put （cachekey,proxy . getClass（））；

return proxyi

this.advisedBeans.Put （cacheKey,Boolean.FAL.SE）；

由代码清单9-23可以看出，整个 wrapIfNecessarY方法的主⼲逻辑是⾮常清晰的，读


## 9.5.1 getAdvicesAndAdvisorsForBean

仅从方法名上就可以理解 getAdvicesAndAdvisorsForBean 方法要完成的工作，该方

法会根据当前正在初始化的bean 对象，匹配可供织入通知的增强器，如代码清单9-24所示。

这个方法⼜会调用下⾯的 EindE1igibleAdvisors 方法，⽽findE1igibleAdvisors 方

法⼜分为3个步骤：获取增强器；筛选对当前 bean 对象有效的增强器；附加⼀些额外的增强

器。虽然 findB1igibleAdvisors 方法的篇幅不⻓，但其中调用的每个方法都是被封装过的，

1代码清单 9-24 getAdvicesAndAdvisorsForBean 获取可以切入逻辑的增强器

Protected Object I］ getAdvicesAndAdvisorsForBean（

Class<?> beanClass,String beanName，@Nullable TargetSource targetSource）｛

List<Advisor> advisors = findBligibleAdvisors （beanClass,beanName）；

i （advisors.isEmpty（））｛

return DO_NOT_PROXY；

return advisors.toArray（）；

protected List<Advisor> findEligibleAdvisors （Class<?> beanClass,String beanName）｛

continue；

I第9章 AOP模块的⽣命周期

// 获取所有增强器（9.3.1节）

List<Advisor> candidateAdvisors = findCandidateAdvisors（）；

//筛选出可以切入当前bean 对象的增强器

List<Advisor> eligibleAdvisors = findAdvisorsThatCanApply （candidateAdvisors，

beanClass,beanName）；

// 添加额外的增强器

extendAdvisors （eligibleAdvisors）；

i （！eligibleAdvisors.isEmpty （））｛

1/ 增强器排序

eligibleAdvisors = sortAdvisors （eligibleAdvisors）；

return eligibleAdvisors；

1. findCandidateAdvisors

findCandidateAdvisors 方法就是9.3.1 节中刚研究过的收集增强器的逻辑，这个方法

返回的结果即所谓的“候选增强器”。

2. findAdvisorsThatCanApply

获取到所有候选增强器之后，下⾯需要匹配可以切入当前 bean 对象的增强器。进入

findAdvisorsThatCanApply 方法中可以发现该方法⼜将参数移交到工具类 AopUtils 的

findAdvisorsThatCanApP1y方法中，如代码清单9-25所示。

代码清单 9-25 findAdvisorsThatCanApply 匹配可以织入通知的增强器

protected List<Advisor> findAdvisorsThatCanApply（

List<Advisor> candidateAdvisors,Class<?> beanClass,String beanName）｛

ProxyCreationContext .setCurrentProxiedBeanName （beanName）；

try｛

return AopUtils.findAdvisorsThatCanApplY（candidateAdvisors,beanClass）；

｝ // finally⋯.

// AopUtils

public static List<Advisor> findAdvisorsThatCanApply （List<Advisor> candidateAdvisors，

Class<?> clazz）｛

if （candidateAdvisors.isEmpty（））｛

return candidateAdvisors：

LIStsAdVISOr> el1g1bLeAdVisorS = new Arrayulsts>（）：

// 先匹配引介增强器

for （Advisor candidate : candidateAdvisors） ｛

if （candidate instanceof IntroductionAdvisor && canApply（candidate, clazz））｛

eligibleAdvisors.add （candidate）；

boolean hasIntroductions = ！eligibleAdvisors.isEmpty （）：

// 再匹配普通方法增强器

Eor（Advisor candidate :candidateAdvisors） ｛

if （candidate instanceof IntroductionAdvisor） ｛

// already processed

i （canApply（candidate,clazz,hasIntroductions））｛

针对引介通知的增强器进⾏筛选，后⼀部分则是过滤普通的方法通知封装的增强器。有关引介

增强器的部分本书不作过多探究，在实际的项目开发时⼏乎不会用到引介通知，读者可以把重


## 9.5 代理对象⽣成的核心：wraplfNecessaryl

eligibleAdvisors.add （candidate）；

return eligibleAdvisors；

整个 findAdvisorsThatCanApplY方法的逻辑分为两个部分且⾮常明确，前⼀部分是

点放在普通方法通知封装的增强器，观察源码如何进⾏匹配，如代码清单9-26所示。

代码清单 9-26 canApply 匹配方法增强器的逻辑

Public static boolean canApply（Advisor advisor, Class<?> targetClass,boolean hasIntroductions）｛

// 对于引介增强器，它会直接强转，使用类级的过滤器去匹配

if（advisor instanceof IntroductionAdvisor）｛

return（（IntroductionAdvisor） advisor）.getClassFilter （）.matches （targetClass）；

｝ else if （advisor instanceof PointcutAdvisor）｛

// 方法切入点的增强器匹配逻辑

PointcutAdvisor pca = （RointcutAdvisor） advisor；

return canApply（pca.getPointcut （），targetClass,hasIntroductions）；

｝ else｛

// 未知类型，默认可以使用

return true；

Public static boolean canApPly（Pointcut pc, Class<?> targetClass, boolean hasIntroductions）

Assert.notNu11（pc， "Pointcut must not be nul1"）；

// 如果切入点⽆法应用于当前类，则直接返回 false

if （！pc.getClassFilter（）.matches （targetClass））｛

return false；

MethodMatcher methodMatcher = pc.getMethodMatcher（）；

// 收集继承的⽗类和实现的接口（有可能切入点表达式切的是⽗类/接口）

Set<Class<?>> classes = new LinkedHashSet<>（）；

if （！ProxY.isProxyClass （targetClass））｛

classes.add （ClassUtils.getUserClass （targetClass））；

classes.addA11 （ClassUtils.getAl1InterfacesForClassAsSet （targetClass））；

Eor （Class<?> clazz :classes）｛

// 逐个判断每个方法能否被当前切入点表达式切入，能则⽴即返回true

Method［］ methods = ReflectionUtils.getA11DeclaredMethods （clazz）；

for（Method method: methods）｛

if （introductionAwareMethodMatcher ！= nul1

？ introductionAwareMethodMatcher.matches （method, targetClass, hasIntroductions）

： methodMatcher.matches （method,targetClass））｛

return true；

同类型的增强器分别采用不同的判断逻辑。对于方法增强器的判断会转调下⾯的重载

I第9章 AOP模块的⽣命周期

return false：

匹配的核心方法是if结构中的canApP1y方法，从方法的实现中可以看出，底层会针对不

canApply 方法，⽽重载canApply方法中的整体思路⽐较清晰，各位要理解的核心部分是最

下⾯的双重循环，利用MethodMatcher 方法匹配器就能根据切人点表达式，判断出⼀个增强

器是否能对当前 bean 对象进⾏增强。

实际测试时，在整个 findAdvisorsThatCanApply 方法的最后⼀⾏打入 Debug 断点，

可以发现示例代码中编写的 Aspect］通知已经被成功筛选出来，如图9-9所示。

eligibieAdvisors = （ArrayList@4795） size = 1

0=w:dnwctonwocewoteronw.uAavsornp24/0020490

>f declaredPointcut = （AspecUExpressionPointcut@4804｝.. toString0

> declaringClass = IClass@3885）.Navigate

>methodName = "beforePrint*

parameterTypes = （Class［0）@4806）

V aspecUAdviceMethod = （Method@4807） 'public voidcom.linkedbear.springboot.aspect.ServiceAspect.beforePrintO*

> W aspect/AdvisorFactory = （ReflectiveAspectlAdvisorfactory@4808）

>• aspectinstancefactory = （LazySingletonAspectnstanceFactoryDecorator（4809）. L5tring0

declarationOrder = 0

>袋 aspectName = 'serviceAspect"

> pointcut = ｛AspectfExpressionPointcut4804） "AspectExpressionPointcut: 0 execution（public* com.linkedbear.springboot.service.*.*（.））

（ lazy = false

> 《 instantiatedAdvice = （AspecUIMethodBeforeAdvice@4811） 'org.springframework.aop.aspecti AspectMethodBeforeAdvice: advice methoo

图9-9 筛选后的可以应用于 DemoService 的增强器

3. extendAdvisors

接着上⾯的 Debug 继续进⾏，当执⾏完 extendAdvisors 方法后可以发现eligible

Advisors 集合中多了⼀个增强器，如图9-10 所示。

eligibleAdvisors = ｛ArrayList@4795） size = 2

v wo= ｛Exposeinvocationlnterceptor$1@4840｝..toStringO

>f pointcut = ｛TruePointcut@4842｝ "Pointcut.TRUE"

>f advice = ｛Exposelnvocationlnterceptor@4843）

f order = null

> 8 1= ｛nstantiationModelAwarePointcutAdvisorimp/@4798｝.. toStringO

图9-10 额外添加了⼀个增强器

为什么会添加额外的增强器呢？这需要深入 extendAdvisors 方法中⼀探究竟，如代码

清单9-27所示。

代码清单 9-27 extendAdvisors 添加额外的增强器

Protected void extendAdvisors （List<Advisor> candidateAdvisors） ｛

AspectJProxyUtils.makeAdvisorChainAspectJCapableIfNecessary （candidateAdvisors）；


## 9.5 代理对象⽣成的核心：wraplfNecessaryI

// AspectJProxyUtils

public static boolean makeAdvisorChainAspectJCapableIfNecessary （List<Advisor> advisors）｛

i£（！advisors.isEmpty（））｛

boolean foundAspectJAdvice = false；

for（Advisor advisor : advisors）｛

if （iSAspectJAdvice （advisor））｛

foundAspectJAdvice = true；

break；

1/ 如果发现有 AspectJ封装的增强器，则添加⼀个 ExposeInvocationInterceptor

if（foundAspectJAdvice && ！advisors.contains （ExposeInvocationInterceptor. ADVISOR））｛

advisors.add （0,ExposeInvocationInterceptor.ADVISOR）；

return true；

return false；

extendadvisors 方法的逻辑不算复杂，关键是判断当前可用的增强器中是否存在

Aspectl 类型的增强器，如果有则会在整个增强器的列表最前端添加⼀个 ExposeInvocation

Interceptor.ADVISOR。这个 ADVISOR 是什么？ExposeInvocationInterceptor ⼜是

什么呢？读者也需要简单了解⼀下，如代码清单9-28所示。

代码清单 9-28 Exposelnvocationlnterceptor.ADVISOR

public static final ExposeInvocationInterceptor INSTANCE = new ExposeInvocationInterceptor （）；

Public static final Advisor ADVISOR = new DefaultPointcutAdvisor （INSTANCE）｛

@Override

public string tostring（）｛

return ExposeInvocationInterceptor.class.getName （）+" .ADVISOR"；

｝；

观察代码清单 9-28 中 ADVISOR 的初始化，可以发现它是⼀个对所有bean 对象都⽣效的

增强器，传入的 INSTANCE 很明显是单实例设计，核心的通知逻辑由 ExposeInvocation

Interceptor 本身实现，继续往下阅读源码，如代码清单9-29所示。

代码清单 9-29 Exposelnvocationlnterceptor 的核心 invoke 方法

private static final ThreadLocal<MethodInvocation> invocation =

new NamedThreadLocal<>（"Current AOP method invocation"）；

Public Object invoke （MethodInvocation mi）throws Throwable ｛

MethodInvocation oldInvocation = invocation.get （）；

invocation.set （mi）；

try｛

return mi.proceed（）；

finally ｛

invocation.set （oldInvocation）；

的代理对象的方法执⾏包装，它每次都是增强器链中的第⼀个被执⾏的，并且放入


## 9.5.2 createProxy

准备就绪，接下来是创建代理对象的部分。创建代理对象的整个方法逻辑⽐较长，如代码清单9-30

所舌（读者只需要关注源码中标有注释的部分）。

I第9章 AOP模块的⽣命周期

在 ExposeInvocationInterceptor 的核心 invoke 方法中，可以发现 Expose

InvocationInterceptor 的核心功能是向当前线程的ThreadLoca1 中放人当前正在执⾏

ThreadLoca1变量中，由此可见 ExposeInvocationInterceptor 的意图⾮常明显：可以

让后⾯的增强器都取当前正在执⾏的 MethodInvocation 对象。该设计通常是为 Spring

Framework 内部使用，读者不必过多关注，仅作了解即可。

注意此处读者可能会产⽣疑惑：MethodInvocation oldInvocation

invocation.get （）；这⾏代码的设计意图是什么？正常情况下成员属性中 invocation 本

身没有任何 MethodInvocation，为什么还要在方法的第⼀⾏代码中获取⼀次？其实这是由

于 Spring Framework 考虑到多个代理对象之间互相调用的场景，如果是⼀个 AOP 代理对象调用

了另⼀个 AOP 代理对象，整个过程在⼀个线程中执⾏，当第⼆个代理对象的方法被调用时，底

层也会经过 ExposeInvocationInterceptor 的逻辑处理，此时从 rhreadLoca1 中就可

以提取出 MethodInvocation，以暂存上⼀个执⾏的MethodInvocation。

整个 getAdvicesAndAdvisorsForBean 方法执⾏完毕后，所有可以应用的增强器也都

代码清单 9-30 createProxy 创建代理对象

Protected Object createProxy （Class<?> beanClass，@Nullablestring beanName，

@Nullable Object ［］ specificInterceptors, TargetSource targetSource） ｛


// 代理工⼚的初始化

ProxyFactory proxyFactory = new ProxyFactory（）；

proxyFactory.copyFrom（this）；

1/ 根据AOP的设计，决定是否强制使用cg1ib

i（！proxyFactory.isProxyTargetClass （））｛

if （shouldProxyTargetClass （beanClass, beanName））｛

1/ Cglib 动态代理直接记录被代理bean 对象的所属类即可

proxyFactory.setProxyTargetClass （true）；

｝ else｛

// 解析被代理 bean 对象所属类的所有实现的接口

evaluateProxyInterfaces （beanClass,ProxyFactory）；

// 构造整合所有增强器

Advisorl］ advisors = buildAdvisors （beanName,specificInterceptors）；

proxyFactory.addAdvisors （advisors）；

ProxyFactory.setTargetSource （targetSource）；

customizeProxyFactory（proxyFactory）；.....

该方法的核心动作有两步：收集整理要织入目标对象的通知增强器；创建代理对象。前⾯的细

节处理相对⽐较简单，感兴趣的读者可以⾃⾏研究，下⾯重点讲解这两个核心动作。

读者只需要了解，不必过度深入研究。

经历了增强器的构造后，下⾯是真正创建代理对象的逻辑，如代码清单9-32所示。这个方

法⼜分为两个步骤，继续分解来看。


## 9.5 代理对象⽣成的核心：wraplfNecessary |

// 创建代理对象

return proxyFactory.getProxy （getProxyClassloader （））；

从代理对象的构造流程来看，当前步骤其实是整个 wrapIfNecessary 方法的最后⼀步，

1. buildAdvisors

buildAdvisors 方法中⼀开始整合 Spring Framework 原⽣ AOP 的 MethodInte

rceptor 部分，对于这部分，因为年代过于久远且主流开发中已不再使用，故本书不再展开讲

解，读者需要重点关注的是下⾯ AspectJ 的部分，如代码清单9-31所示。有⼀个细节要注意，

buildAdvisors 方法的参数中传进来的specificInterceptors 就是收集好的增强器，中

间部分会将这部分放入 allInterceptors 中。最下⾯有⼀个 advisorAdapterRegistry.

wrap 的方法调用，这个方法内部会将“可以⽀持转换/包装为 Advisor 类型的对象”适配成

Advisor，所谓“可以⽀持的类型”有两种：MethodInterceptor 和 AdvisorAdapter。

代码清单 9-31 buildAdvisors 构造增强器

Protected Advisor［］ buildAdvisors （@Nullable String beanName，

@Nullable Object ［］ specificInterceptors） ｛

1/ Handle prototypes correctly...

1/ 此处是为适配 spring 原⽣AOR 的MethodInterceptor，感兴趣的读者可⾃⾏研究

Advisor［］ commonInterceptors = resolveInterceptorNames （）；

List<Object> allInterceptors = new ArrayList<>（）；

if （specificInterceptors ！= nul1）｛

allInterceptors.addA11 （Arrays.asList （specificInterceptors））；

1/ 组合原⽣的方法拦截器，共同作为AOP 的通知织入

if （commonInterceptors.length>0） ｛

i£（this.applyCommonInterceptorsFirst）｛

allInterceptors.addA11（0,Arrays.asList （commonInterceptors））；

｝else｛

allInterceptors.addA11 （Arrays .asList （commonInterceptors））；

1/ logger ⋯..

Advisorll advisors = new Advisor［allInterceptors.size （）］；

for （int i = 0;i <allInterceptors.size （）；i++）｛

// 此处有⼀个原⽣AOP 的适配动作

advisorsli］ = this.advisorAdapterRegistry.wrap （allInterceptors.get （i））；

return advisors；

2. proxyFactory.getProxy

I第9章AOP模块的⽣命周期

1代码清单 9-32 getProxy 创建代理对象

public Object getProxy （@Nu1lable Classloader classLoader）｛

return createAopProxy（）.getProxy （classLoader）：

（1） createAopProxy

创建AOP代理的方法如代码清单9-33所示。

代码清单 9-33createAopProxy 创建 AOP 代理

protected final synchronized AopProxy createAopProxy （）｛

1/ 监听器的通知动作

return getAopProxyFactory （）.createAopProxY （this）；

createAopPrOxY 方法的上⾯有⼀个监听器的通知动作，由于这个动作涉及的监听器

AdvisedsupportListener 只在 ProxyCreatorsupport 这个类中使用，在日常开发中⼏

乎不会触及，故对于该部分直接跳过。下⾯ getAopProxyFactory（）.createAopProxy

（this）；方法的执⾏是关键，其中 getAopProxyFactory 方法返回的是当前 Proxy

CreatorSupport 的成员 aopProxyFactory，借助 Debug 可以发现它的类型是 Default

AopProxyFactory，如图9-11所示。

this = ｛ProxyFactory@2058）..toStringo

>《aopProxyFactory = ｛DefaultAopProxyFactory@2062）

图9-11 默认的 AopProxyFactory 类型

进入 DefaultAopProxyFactory的 createAopProxY方法中，可以发现之前在学习动

态代理中读者熟悉的JDK、Cglib 等，如代码清单9-34所示。⾄此可以了解到，AOP底层使用

jdk 动态代理或者Cglib 动态代理的选择动作在此处进⾏。


## 1 代码清单9-34 根据配置与原始对象的情况选择动态代理方式

public AopProxy createAopProxy （Advisedsupport config） throws AopConfigException ｛

if （config.isoptimize（）|| config.isProxyTargetClass （）

II hasNoUserSuppliedProxyInterfaces （config））｛

Class<?> targetClass = config.getTargetClass（）；

i£ （targetClass == null）｛

1/ 如果要代理的本身就是接口，或者已经是被JDK 动态代理的代理对象，则使用JDK 动态代理

if （targetClass.isInterface（）I| Proxy.isProxyClass （targetClass））｛

return new JdkDynamicAopProxy （config）：

1/ 否则使用cg1ib动态代理

return new ObjenesisCglibAopProxy （config）；

｝ else｛

return new JdkDynamicAopProxy （config）；

所有代理对象也全部创建完毕。


## 9.6 代理对象的底层执⾏逻辑|

（2） AopProxy#getProxy

创建完 AOpPrOxY对象后，下⾯是创建代理对象的动作。分别来看使用JDK 动态代理和

Cglib 动态代理的底层创建动作。⾸先是基于JDK 动态代理的JdkDynamicAopProxy，如代码清

单 9-35所舌。注意观察方法的最后⼀⾏，它调用的 API 就是读者熟悉的 Proxy.newProxy

Instance 方法。所以读者应该体会到，代理对象的底层创建还是依赖JDK 动态代理或者Cglib

动态代理的核心 API。

代码清单9-35 getProxy 执⾏最终的代理对象创建方法

Public Object getProxy （@Nullable Classloader classloader）｛


## 11 logger 

Class<?>I］ ProxiedInterfaces =

AopProxyUtils.completeProxiedInterfaces （this.advised, true）；

findDefinedEqualsAndHashCodeMethods （ProxiedInterfaces）；


## 11 jdk 动态代理的API

return Proxy.newProxyInstance （classloader,proxiedInterfaces， this）；

⾄于 Cglib 动态代理的创建逻辑，这⾥不深人探究，底层源码中添加的额外处理⽐较多，

不过核心的动作还是对Cglib 中的Enhancer 进⾏操作，如代码清单9-36所示。源码核心的思

路不变，只是在框架上⽐普通开发者考虑得更多、更周全。

代码清单9-36 Cglib 创建代理对象的核心逻辑

Public Object getProxy （@Nu1lable Classloader classloader）

1……...

// Configure CGLIB Enhancer

Enhancer enhancer = createEnhancer （）；

// 设置类加载器、⽗类、接⼜等信息…••••

1/ 获取到的Cal1back 即增加器

Callback［］ callbacks = getCallbacks （rootClass）；

1/ 对 callback 进⾏处理⋯••

1/ 调用 enhancer.create 创建代理

return createProxyClassAndInstance （enhancer,callbacks）；

⾄此，代理对象被成功创建，整个 AOP 通知织人的流程结束。随着 IOC 容器刷新完成，


## 9.6 代理对象的底层执⾏逻辑

IOC容器刷新完毕后，下⼀部分的内容会探讨程序运⾏期间，被 AOP 代理的对象执⾏被增

强的方法时内部的调用机制。本节内容依然使用第5章中的舌例代码，研究当 DemoService

的save 方法执⾏时，内部执⾏了哪些重要环节的操作。


## 9.6.1 DemoService#save

将断点打在 SpringBootAopAPP1ication 的save 方法调用上，Debug 启动后可以发

的注释删掉，只留下重要的⼏个环节，读者在阅读时重点关注即可。

通读整段源码，提取两个核心步骤：获取增强器链、执⾏增强器（同时这⾥也发现了前⾯

核心方法分别讲解。

|第9章 AOP模块的⽣命周期

现程序会先运⾏到cg1ibAopProxy的内部类 DynamicAdvisedInterceptor 中。由于执

⾏的核心 intercept 方法很长，为体现方法内部的核心逻辑，代码清单9-37中已把不太重要

1代码清单 9-37 DynamicAdvisedInterceptor#intercept

public Object intercept （Object proxy,Method method, Object ［］ args, MethodProxy methodProxy）

throws Throwable｛

Object oldProxy = nul1；

boolean setProxyContext = false；

Object target = null；

TargetSource targetSource - this.advised.getTargetsource （）；

try｛

1/ 如果在@EnableAspectJAutoProxy 注解上配置了 exposeProxy 属性为true，

1/ 则会把当前代理对象放入AOP上下⽂中

i （this.advised.exposeProxy）｛

o1dProxY = AopContext.setCurrentProxy（proxy）；

setProxyContext = true；

1/ 从TargetSource 中提取出目标对象

target = targetSource.getTarget （）；

Class<?> targetClass =（target ！= nul1 ? target .getClass（）：nul1）；

// 根据当前执⾏的方法，获取要执⾏的增强器，并以列表返回（链的思想）

List<Object>chain = this.advised.getInterceptorsAndDynamicInterceptionAdvice（

method,targetClass）；

Object retVal；

// 如果没有要执⾏的增强器，则直接执⾏目标方法

if （chain.isEmpty（） && Modifier.isPublic （method.getModifiers （）））｛

Object ［］ argsTouse = AopProxyUti1s.adaptArgumentsIfNecessary （method, args）；

retVal = methodProxy.invoke （target,argsToUse）；

｝else｛

// 否则，构造增强器链，执⾏增强器的逻辑

retVal = nev CglibMethodInvocation （proxy,target,method,args，

targetClass,chain,methodProxy）.proceed （）；

retVal = processReturnType （proxy, target,method, retVal）；

return retVal；

｝// finally ....

讲过的⼀些细节：exposeProxy 的实现、TargetSource 的使用等）。下⾯就这两个重要的


## 9.6.2 获取增强器链

获取增强器链的方法如代码清单9-38所示。

代码清单 9-38 getlnterceptorsAndDynamiclnterceptionAdvice 获取增强器链

Public List<object>getInterceptorsAndDynamicInterceptionAdvice （Method method，.

@Nu1lable Class<?> targetClass）｛

设计，当方法第⼀次调用完成后，当前方法涉及的增强器链就会被缓存，后续再执⾏被增强的

方法时⽆须再次获取和解析。⽽中间的核心逻辑会将获取增强器链的工作交给

前置准备完成后开始循环匹配增强器，匹配逻辑本身不难，会把上⾯取出的增强器依次与


## 9.6 代理对象的底层执⾏逻辑|

MethodCacheKey cacheKey = new MethodCacheKey （method）；

List<Object> cached = this.methodCache.get （cacheKey）；

if （cached == nul1）｛

// 核心逻辑

cached = this.advisorChainFactory.getInterceptorsAndDynamicInterceptionAdvice （

this,method, targetClass）；

this.methodCache.put （cacheKey, cached）；

return cached；

getInterceptorsAndDynamicInterceptionAdvice 方法中使用了⾮常经典的缓存

advisorChainFactory 完成，继续向下深入。

1. 前置准备

在循环处理增强器之前，getInterceptorsAndDynamicInterceptionAdvice 方法

的开始先进⾏⼀些基本的前置处理，⾸先初始化⼀个 AdvisorAdapterRegistry，意内增强

器适配器的注册器，它的主要作用是将 AspectJ类型的增强器转換内 MethodInterceptor

（AOP联盟的 MethodInterceptor）并返回，如代码清单9-39所舌。这⼀处理的目的会在接

下来的 CglibMethodInvocation 中得以体现，读者在此处先有印象即可。

1代码清单 9-39 advisorChainFactory 获取增强器链（1）

Public List<Object> getInterceptorsAndDynamicInterceptionAdvice （

Advised config,Method method，@Nullable Class<?> targetClass）｛

//增强器适配器的注册器，它会根据增强器来解析，返回拦截器数组

AdvisorAdapterRegistry registry = GlobalAdvisorAdapterRegistry.getInstance （）；

Advisor［］ advisors = config.getAdvisors （）；

List<Object> interceptorList = new ArrayList<>（advisors.length）；

Class<?> actualClass =（targetClass ！= nul1 ? targetClass :method.getDeclaringClass （））；

Boolean hasIntroductions = nul1；

2. 匹配增强器

提示：接下来的源码部分缩进⾮常大，为确保阅读效果，下⾯⼏部分的源码缩进会被适当调整。

当前正在调用的目标对象进⾏匹配，匹配的方式与之前⼀样，也是借助MethodMatcher 进⾏，

如代码清单9-40所示。

代码清单 9-40 advisorChainFactory 获取增强器链（2）

for （Advisor advisor :advisors）｛

if （advisor instanceof PointcutAdvisor）｛

// 此处获取的就是 AspectJ形式的通知方法封装

PointcutAdvisor pointcutAdvisor = （PointcutAdvisor） advisor；

if （config.isPrFiltered （） ||

pointcutAdvisor.getPointcut （） .getClassFilter（）.matches （actualClass））｛

|第9章 AOP模块的⽣命周期

1/ 根据通知方法上的切入点表达式，判断是否可以匹配当前要执⾏的目标对象所属类

MethodMatcher mm = pointcutAdvisor.getPointcut （） .getMethodMatcher （）；

boolean match；

/1 引介匹配

if（mm instanceof IntroductionAwareMethodMatcher）｛

iE （hasIntroductions == nul1） ｛

hasIntroductions = hasMatchingIntroductions （advisors, actualClass）；

match =（（IntroductionAwareMethodMatcher）mm）

.matches （method, actualClass, hasIntroductions）；

｝else｛

// 方法匹配

match = mm.matches （method, actualClass）；

实际在 Debug 时可以发现，此处把 ServiceAspect 中声明的前置通知方法以及 Spring

Framework 内置的ADVISOR增强器起收集为⼀个 Advisor 数组，如图9-12所示。

$0= lxposeinvocationinterceptor$1@5449） 'orq.springframework.aop.interceptor.Exposeinvocationlnterceptor.ADVISOR"

25450） *InstantiationModelAwarePointcutAdvisor expression fexecution（pubic * com.linkedbear.springboot.service

图 9-12 DemoService 获取的增强器有两个

3. 匹配后的处理

匹配到增强器之后，接下来是决定如何封装为 MethodInterceptor，如代码清单9-41

所舌。这部分本⾝并不难，不过这段源码中有⼀个 runtime 的概念，这⾥解释⼀下。通常情况

下，MethodMatcher 都是静态匹配器，但 Spring Framework 在此处做了⼀个设计，如果

MethodMatcher 被设置为动态匹配器，则每次调用匹配方法时，可以提前获取方法调用的参数

值列表。这样解释可能有些难以理解，我们可以先看两个方法的签名，如代码清单9-42所舌。

代码清单 9-41 advisorChainFactory 获取增强器链（3）

if（match）｛

MethodInterceptor［］ interceptors = registry•getInterceptors （advisor）；

// runtime 的概念

if （mm.isRuntime （））｛

for（MethodInterceptor interceptor :interceptors） ｛

interceptorList.add （new InterceptorAndDynamicMethodMatcher （interceptor, mm））；

｝ else ｛

interceptorList.addA11 （Arrays.asList （interceptors））；

代码清单9-42 两个重载的 matches 方法签名

boolean matches （Method method, Class<?> targetClass）：

boolean matches （Method method, Class<?> targetClass, Object.•• args）；

由上述两个方法的参数列表，想必读者应该可以理解上⾯的解释：静态匹配器只会做基本

的方法匹配，⽽动态匹配器可以提前获取方法调用的参数值列表并进⾏深度匹配（注意是参数

获取增强器链的最后部分还要处理引介增强器以及其他类型的增强器，如代码清单9-43所舌。

强器在项目开发中⼀般不会触及，因此对于这部分本书不再展开，感兴趣的读者可以⾃⾏了解。

对象要执⾏的方法被全部筛选出来，接下来的环节是构建方法执⾏器。

这⾥可以依次执⾏增强器链中的每个 MethodInvocation 对象。


## 9.6 代理对象的底层执⾏逻辑|

值）。具体的使用会在9.6.3节中得以体现。

4. 其他增强器的处理

由于 AspectJ风格的声明均执⾏上⾯的PointcutAdvisor 判断逻辑，引介以及其他特殊类型的增

1代码清单 9-43 advisorChainFactory 获取增强器链 （4）


else if （advisor instanceof IntroductionAdvisor） ｛

// 处理引介增强器

IntroductionAdvisor ia =（IntroductionAdvisor） advisor；

if （config.isPrFiltered（）I| ia.getClassFilter （）.matches （actualClass））｛

Interceptor［］ interceptors = registry.getInterceptors （advisor）；

interceptorList.addA11（Arrays.asList （interceptors））；

｝ else｛

// 处理其他类型的增强器

Interceptor［］ interceptors = registry.getInterceptors （advisor）；

interceptorulst.aaaAlL（Arrays.asulst（interceptorS）；

return interceptorList；

经过 getInterceptorsAndDynamicInterceptionAdvice 方法的处理后，当前目标


## 9.6.3 执⾏增强器

回到 DynamicAdvisedInterceptor 的 intercept 方法，下⾯的步骤是调用构造好的

CglibMethodInvocation 的proceed方法。不过在进人proceed 方法之前，先请读者了

解⼀下 cglibMethodInvocation 的设计，对应的类继承层次如代码清单9-44所示。

代码清单 9-44 CglibMethodlnvocation 的继承结构

private static class CglibMethodInvocation extends ReflectiveMethodInvocation

public class ReflectiveMethodInvocation implements ProxyMethodInvocation, Cloneable

Public interface ProxyMethodInvocation extends MethodInvocation

从类继承层次上看，CglibMethodInvocation 最终是⼀个 AOP 联盟定义的 Method

Invocation，由于前⾯的步骤中已经完成了不同类型到 MethodInvocation 的适配，因此

简单了解之后，下⾯ Debug 往下执⾏ proceed 方法，在CglibMethodInvocation 内

部只是单纯地调用⽗类的 proceed 方法，⽽向上调用⽗类的 proceed 方法则会进入

ReflectiveMethodInvocation 类中，如代码清单 9-45所示。

接下来的调用过程可能会很复杂，本节尝试用过程的方式记录每⼀步的执⾏动作和逻辑，

以方便读者体会这⾥⾯的⾼深设计。

如果动态匹配器在匹配方法调用的参数值列表时发现匹配不上，则这个增强器不会执⾏。所以

上⾯提到的动态匹配器会深度匹配方法的参数，作用时机就在这⾥。

|第9章 AOP模块的⽣命周期

代码清单 9-45 CglibMethodlInvocation 的proceed 直接调用的⽗类

public Object proceed（）throws Throwable ｛

try｛

return super.proceed（）；

｝// catch.

先简单通读 Proceed 方法的设计，如代码清单9-46所示（重要的逻辑环节在代码中均已

标有注释）。

1代码清单 9-46 ReflectiveMethodlnvocation 的 proceed 方法执⾏拦截器链

protected final List<？> interceptorsAndDynamicMethodMatchers；

private int currentInterceptorIndex = -1；

Public Object proceed（） throws Throwable /

i£ （this.currentInterceptorIndex == this.interceptorsAndDynamicMethodMatchers.size （）- 1） ｛

//增强器全部执⾏完毕后，会执⾏目标方法

return invokeJoinpoint （）；

// 依次取出增强器封装的拦截器并执⾏

Object interceptororInterceptionAdvice =

this.interceptorsAndDynamicMethodMatchers.get （++this.currentInterceptorIndex）；

if（interceptororInterceptionAdvice instanceof InterceptorAndDynamicMethodMatcher）｛

// 此处是动态匹配器构造的特殊逻辑

InterceptorAndDynamicMethodMatcher dm =

（InterceptorAndDynamicMethodMatcher）interceptorOrInterceptionAdvice；

Class<?> targetClass = （this.targetClass ！= null

？this.targetClass :this.method.getDeclaringClass （））；

// 动态匹配器必须将参数⼀并纳入匹配规则中

i£ （dm.methodMatcher.matches （this.method,targetClass,this.arguments）） ｛

return dm.interceptor.invoke （this）；

euse（

recur proceea（：

｝ else ｛

// 此处会调用增强器的逻辑

return（（MethodInterceptor） interceptorOrInterceptionAdvice）.invoke （this）；

这⾥额外解释⼀下 9.6.2 节中提到的动态匹配器。观察中间的 if结构部分，如果 Method

Matcher 被封装为动态匹配器，则此处会调用dm.methodMatcher.matches 方法继续匹配，

其余的逻辑部分，结合 Debug 的效果—⼀来看。


## 9.6 代理对象的底层执⾏逻辑|

1. 执⾏ proceed 方法

第⼀次进人 proceed 方法，⾸先执⾏第⼀个i判断，这⾥它需要⽐对当前已经执⾏过的

增强器在增强器链的下标位置，如代码清单9-47所示。

代码清单 9-47 判断 currentInterceptorlndex 与当前执⾏增强器链下标

Public Object proceed（）throws Throwable ｛

i£ （this.currentInterceptorIndex == this.interceptorsAndDynamicMethodMatchers.size （）- 1）｛

return invokeJoinpoint （）；

此时 Debug 可以发现 currentInterceptorIndex 值为-1，如图9-13所示。

aothis.currentinterceptorlndex =-1

co this.interceptorsAndDynamicMethodMatchers = ｛ArrayList@5321） size =2

> #0= ｛Exposelnvocationinterceptor@5327）

1= （MethodBeforeAdviceinterceptor@5328）

v fadvice = ｛AspectMethodBeforeAdvice@5329｝.. toStringO

> declaringClass = ｛Class@3883｝.Navigate

>methodName = "beforePrint"


## 4 parameterTypes = ｛Class［01@5331｝

> aspectAdviceMethod = （Method@5332）.. toStringO

>1 pointcut = ｛AspectExpressionPointcut@5333）.toStringO

>《 aspectinstanceFactory = （LazySingletonAspectinstanceFactoryDed


## 4 aspectName = "serviceAspect"

图 9-13 第⼀次 Debug ⾄ proceed 方法时索引下标为-1

判断-1*2-1，因此不进入 invokeJoinpoint 方法，继续往下执⾏。

2. 下标值++

接下来执⾏下⾯的this.interceptorsAndDynamicMethodMatchers.get 动作，如

代码清单 9-48所示。注意此时 this.currentInterceptorIndex 变量执⾏了⼀次⾃增操

作，⾃增后的 currentInterceptorIndex 值0。

1代码清单9-48 currentInterceptorlndex ⾃增后取出增强器

if（this.currentInterceptorIndex == this.interceptorsAndDynamicMethodMatchers.size （）- 1） ｛

return invokeJoinpoint （）；

Object interceptororInterceptionAdvice =

this.interceptorsAndDynamicMethodMatchers.get（++this.currentInterceptorIndex）；

3. 执⾏第⼀个增强器

从 9.5.1 节的内容以及图 9-13 中可以了解到，第⼀次获取到的增强器的类型是 Expose

InvocationInterceptor.ADVISOR，此处会执⾏它对应的通知逻辑，⽽ Expose

InvocationInterceptor 内部的 invoke 方法可以妥善处理好多个代理对象之间互相调用

的问题，此处不讨论有关话题，直接进入 MethodInvocation 的 proceed 方法，如代码清

单9-49所示。

所示。

I第9章 AOP模块的⽣命周期

』代码清单 9-49 Exposelnvocationlnterceptor 的执⾏源码

public Object invoke （MethodInvocation mi）throws Throwable ｛

MethodInvocation oldInvocation = invocation.get （）；

invocation.set （mi）；

try｛

return mi.proceed（）；

｝ finally ｛

invocation.set （01dInvocation）；

｝

4. 继续执⾏ proceed 方法

保存好 MethodInvocation 后继续向下执⾏ proceed 方法，Debug 执⾏后发现程序回

到了上⾯的第⼀步，不同的是此时 currentInterceptorIndex 值不再是-1，⽽是0，如图9-14

oothis.currentinterceptorindex =0

cothis.interceptorsAndDynamicMethodMatchers = （ArrayList@5321｝ size = 2

> 0= ｛Exposelnvocationinterceptor@5327）

v #1= （MethodBeforeAdviceinterceptor@5328）

~' advice = ｛Aspect/MethodBeforeAdvice@5329）.. toString0

>h declaringClass = （Class@3883）. Navigate

>fmethodName = "beforePrint"

图 9-14 第⼆次 Debug ⾄ proceed 方法时索引下标为0

判断 0*2-1，因此不进入 invokeJoinpoint 方法，继续向下执⾏增强器的逻辑。

5. 进入 MethodBeforeAdvicelnterceptor 中

下⼀个要执⾏的通知方法是 ServiceAspect 的beforePrint 方法，它本身是⼀个前置

通知，具体到 MethodInterceptor 的实现类在 MethodBeforeAdviceInterceptor 中。

具体的底层实现⾮常简单，MethodBeforeAdviceInterceptor 会直接调用 advice 的before

方法，⽽追踪调用的底层方法，则会⼀直调用到 invokeAdviceMethodWithGivenArgs 方

法中，最终借助反射调用 Aspect 切⾯类的通知方法，如代码清单9-50所舌。通知方法执⾏完成

后，会继续执⾏ MethodInvocation 的proceed方法，推动增强器链的执⾏流程。

代码清单 9-50 MethodBeforeAdvicelnterceptor 的执⾏源码

public Object invoke （MethodInvocation mi） throws Throwable ｛

this.advice.before （mi.getMethod （），mi.getArguments （），mi.getThis（））；

return mi.proceed（）；

public void before （Method method, Object ［］ args， @Nullableobject target）throws Throwable ｛

invokeAdviceMethod（getJoinPointMatch （），nul1,null）；

protected Ob］ect invokeAdvicemethod （eNu_Laore voinroincMaton pMatcn，

@Nullable Object returnValue，@Nullable Throwable ex） throws Throwable｛

return invokeAdviceMethodWithGivenArgs （argBinding （getJoinPoint（），

jpMatch,returnValue, ex））；

借助反射执⾏目标对象的目标方法。

目标方法执⾏完毕后，⼀个代理对象的方法调用流程结束。

经过⼀轮代理对象的方法调用全流程后，可以总结出代理对象的底层执⾏算法逻辑：利用

⼀个全局索引值决定每次执⾏的拦截器，当所有拦截器都执⾏完时，索引值刚好等于

所舌，读者只需关注标注了注释的核心源码。


## 9.6 代理对象的底层执⾏逻辑I

protected Object invokeAdviceMethodWithGivenArgs （Object ［］ args） throws Throwable ｛

Object［］ actualArgs = args：

if （this.aspectJAdviceMethod.getParameterCount（）== 0）｛

actualArgs = null；

try｛

1/ 反射执⾏通知方法

ReflectionUtils.makeAccessible （this.aspectJAdviceMethod）；

return this.aspectJAdviceMethod.invoke （

this.aspectInstanceFactory.getAspectInstance （），actualArgs）；

｝// catch throw ex.....

6. 执⾏目标对象方法

MethodBeforeAdviceInterceptor 执⾏完毕后，⼜回到 proceed方法，此时 current

InterceptorIndex 值为1，如图9-15所示。

public Object proceed（） throws Throwable ｛

// we stantt witn an inaex or mL ana Lncremen caray.

1f（this.currentInterceptorIndex == this.interceptorsAndDynamicMethodMatchers.size（）-1）｛

invokeJoinpoint （）；

fotAopApplication

ole Endpoints

三 varables

Go this.currentlnterceptorlndex = 1

cothis.interceptorsAndDynamicMethodMatchers = ｛Artaylist @5321） Size = 2

wocanonmnterceptortsseh

图9-15第三次 Debug⾄proceed 方法时索引下标为1，进入目标方法

判断 1=2-1，因此进入内部的invokeJoinpoint 方法，⽽ invokeJoinpoint 方法会

7. 流程小结

size（）-1，此时就可以执⾏真正的目标方法。

最后使用⼀个执⾏流程图来更好地理解这段逻辑，如图9-16所示。


## 9.6.4 JDK 动态代理的执⾏底层

下⾯继续研究JDK 动态代理的执⾏。要想在 Spring Boot 2.x中激活JDK 的动态代理，必须

在application.properties中显式配置 spring.aop.proxy-target-class=false，

才会禁用默认全Cglib 的配置，即激活JDK 动态代理的方式。执⾏JDK 动态代理的底层 Invo

cationHandler 是JdkDynamicAopProxY，它的核心invoke 方法很⻓，如代码清单9-51



# 第9章 AOP 模的⽣命周期


## 第9章 AOP 模的⽣命周期

DynamicAdvisedInterceptor#invoka

advised.getInterceptorsAndDynamicInterceptionAdvice

adv1sorchainractory.getinterceptorsAnddynamicinterceptionAdvice

GiobalAdvisorAdapterReg1stry-getinstance（）：犹取王同上強飯取活-

newsg ionetnodinvocation •> invocation.oroceeg

获取目标对象的调用链逻辑，并且对该增强器链进⾏调用

tnis.index se this.matchers.s1zef） method.invoke（target, args）

（（MethodInterceptor） InterceptororinterceptionAdvice）.Invoke （this）

图 9-16 Cglib 的AOP代理对象方法执⾏流程

代码清单 9-51 JdkDynamicAopProxy 的核心源码（节选）

public Object invoke（Object proxy,Method method,Object［］ args） throws Throwable｛

Object oldProxy = null；

boolean setProxyContext = false；

TargetSource targetSource = this.advised.targetSource；

Object target = null；

try｛

// equals 方法不代理

i£ （！this.equalsDefined && AopUtils.isEqualsMethod （method））｛

return equals （args［0］）；

｝ else if （！this.hashCodeDefined && AopUtils.isHashCodeMethod （method））｛

1/ hashcode 方法不代理

return hashCode （）；

｝ else if （method.getDeclaringClass （）== DecoratingProxy.class）｛

1/ 方法来⾃ DecoratingProxy接口的也不代理

return AopProxyUtils.ultimaterargetClass （this.advised）；

｝ else if （！this.advised.opaque && method.getDeclaringClass （）.isInterface （）

&& method.getDeclaringclass （） .isAssignableFrom（Advised.class））｛

// 目标对象本身实现了 Advised 接口的也不代理

return AopUtils.invokeJoinpointUsingReflection （this.advised, method,args）；

Object retVal；

if （this.advised.exposeProxy）｛

O1dPrOXY = AopContext .setCurrentProxy （Proxy）；

setProxyContext = true；

target = targetSource.getTarget （）；

Class<?> targetClass =（target ！= nul1? target .getClass（）：nu11）；

// 根据当前执⾏的方法获取要执⾏的增强器，并以列表返回（链的思想）

method，

method，


## 9.6


## 9.6 代理对象的底层执⾏逻辑I

List<Object> chain = this.advised.getInterceptorsAndDynamicInterceptionAdvice （

targetClass）；

i£ （chain.isEmpty （））｛

Object ［］ argsTouse = AopProxyUtils.adaptArgumentsIfNecessary （method, args）；

retVal = AopUtils.invokeJoinpointUsingReflection （target,method, argsToUse）；

｝ else｛

MethodInvocation invocation = new ReflectiveMethodInvocation （proxy, target，

args,targetClass,chain）；

// 构造增强器链，执⾏增强器的逻辑

retVal = invocation.proceed（）；

1/ 返回值的处理 …

return retVaLi

TinaL-y.....

先看下⾯的部分，读者可以发现JdkDynamicAopProxy跟CglibAopProxy 的实现逻辑

完全⼀致，两者在底层实现中也都⼀样，包括创建的方法执⾏器对象直接是 Reflective

MethodInvocation，与上⾯的⽗类是同⼀个。由此可以推断，JDK 动态代理的核心底层执

⾏逻辑也大同小异，感兴趣的读者可以⾃⾏编写接口+实现类的方式，配合 Debug 加以体会，

本节只提供⼀个类似的执⾏流程图供读者参考，如图9-17所示。

JCKDS BaIECAODFTOXYWLRVOKE

aovised.getinterceptorsAnauynamicunterceptionAavice

advisorchainFactory.BetInterceptorsAndDynamicInterceptionAdvice

invocation.proceed

获取目标对象的调用链逻辑，井且对该塔虽銀链进⾏调用

sethod .invokeltarget, args：

m1.proceed（）

图9-17 JDK的AOP代理对象方法执⾏流程

AspectJ中通知的底层实现

最后还需要读者了解 Aspect］ 中提到的5种声明式的通知方法的底层执⾏逻辑。

1.@Before 前置通知：先执⾏前置通知，再执⾏目标方法，如代码清单9-52所示。

代码清单 9-52 @Before 前置通知

Public class MethodBeforeAdviceInterceptor implements MethodInterceptor,Serializable ｛

Private MethodBeforeAdvice advice；

COverride

I第9章 AOP模块的⽣命周期

public Object invoke （MethodInvocation mi） throws Throwable ｛

this.advice.before （mi.getMethod （），mi.getArguments （），mi.getThis（））；

return mi.proceed （）；

2. @After 后置通知：执⾏目标方法后，在 finally 中执⾏后置方法（由此也说明了它的通

知时机更靠后），如代码清单9-53所舌。

1代码清单9-53 @After 后置通知

public class AspectJAfterAdvice extends AbstractAspectJAdvice

implements MethodInterceptor,AfterAdvice,Serializable ｛

@Override

public object invoke （MethodInvocation mi）throws Throwable ｛

try｛

return mi.proceed（）；

｝ Einally1

invokeAdviceMethod （getJoinPointMatch （），nu1l,nul1）；

3. QAfterReturning返回通知：返回值后置处理中不设置 try-catch 结构，说明不出现

任何异常时才会触发该后置通知，如代码清单9-54所示。

1代码清单9-54 @AfterReturning 返回通知

public class AfterReturningAdviceInterceptor implements MethodInterceptor，

AfterAdvice,Serializable ｛

private final AfterReturningAdvice advice；

@Override

public Objectinvoke （MethodInvocation mi）throws Throwable ｛

Object retVal = mi.proceed（）；

this.advice.afterReturning（retVal, mi.getMethod （），mi.getArguments （），mi.getThis（））；

return retVal；

4. @AfterThrowing 异常通知：出现异常时，进入该后置通知，因为设置了try-catch 结

构，所以这⾥ catch 中根据是否标注了异常通知进⾏相应的后置处理，如代码清单9-55所示。

代码清单 9-55 @AfterThrowing 异常通知

public class AspectJAfterThrowingAdvice extends AbstractAspectJAdvice

implements MethodInterceptor,AfterAdvice,Serializable ｛

COverride

public Object invoke（MethodInvocation mi）throws Throwable｛

try｛

return mi.proceed（）；

｝ catch （Throwable ex）｛

i（shouldInvokeOnThrowing（ex））｛

@Aspect


## 9.7 AOP 通知的执⾏顺序对⽐|

invokeAdviceMethod （getJoinPointMatch（），null,ex）；

throw ex；

5. @Around 环绕通知：通过构建 ProceedingJoinPoint 对象，直接以参数形式传入

通知方法的方法参数中（如果需要的话），反射执⾏通知方法，如代码清单9-56所示。

代码清单 9-56 @Around 环绕通知

Public class AspectJAroundAdvice extends AbstractAspectJAdvice

implements MethodInterceptor,Serializable ｛

1…….

Public Object invoke （MethodInvocation mi） throws Throwable ｛

if （！（mi instanceof ProxyMethodInvocation））｛

throw new I1legalStateException（"MethodInvocation is not a Spring ProxyMethod

Invocation："+ mi）；

ProxyMethodInvocation pmi =（ProxyMethodInvocation）mi；

ProceedingJoinPoint pjp = lazyGetProceedingJoinPoint（pmi）；

JoinPointMatch jpm = getJoinPointMatch （pmi）；

return invokeAdviceMethod （pjp,jpm,nu11,nu11）；


## 9.7 AOP通知的执⾏顺序对⽐

本章的最后⼀节我们再扩展⼀个知识点，即不同的Spring Framework 版本中AOP 通知的执

⾏顺序对⽐。由于 Spring Boot 2.x 底层基于 Spring Framework 5.x，⽽ Spring Boot 1.x 底层基于

Spring Framework 4.x，不同的大版本之间 AOP通知的顺序是有差异的，本节通过⼀个舌例来探

究该差异。


## 9.7.1 测试代码编写

为了能测试出尽可能多的通知执⾏顺序差别，在编写 Aspect 切⾯类时，需要覆盖所有类型

的通知，如代码清单9-57所舌。

【代码清单9-57 覆盖全部类型通知的切⾯类 ServiceAspect

@Component

public class ServiceAspect ｛

@Before（"execution （public * com. linkedbear.springboot.service.*.*（..））"）

public void beforePrint （）｛

system.out.printIn（"Service Aspect before advice run...."）；

@SpringBootApplication

准备工作完成后，下⾯开始测试。

|第9章 AOP模块的⽣命周期

@After （"execution（public * com.linkedbear.springboot.service.*.*（..））"）

public void afterPrint （）｛

System.out.printIn（"Service Aspect after advice run ..."）；

@AfterReturning（"execution （public * com.linkedbear.springboot.service.*.*（..））"）

public void afterReturningPrint （）｛

System.out.println（"Service Aspect afterReturning advice run ....."）；

@AfterThrowing（"execution（public * com.linkedbear.springboot.service.*. * （..））"）

public void afterThrowingPrint（）1

system.out.println（"Service Aspect afterThrowing advice run ....."）；

@Around （"execution （Public * com.linkedbear.springboot.service.*.*（..））"）

public Object aroundPrint （ProceedingJoinPoint joinPoint）throws Throwable ｛

system.out.printIn（"Service Aspect around before run .•.."）；

Object ret = joinPoint.proceed（）；

system.out.printin（"Service Aspect around after run ......"）；

return ret；

Spring Boot 主启动类中，需要在 SpringApplication.run 方法后接收IOC容器本⾝，

获取 DemoService 对象并调用其 save 方法，以触发所有可以织入 DemoService 的 AOP

切⾯通知逻辑，如代码清单9-58所示。

代码清单9-58 主启动类

@EnableAspectJAutoProxy

public class SpringBootAopApplication ｛

Public static void main （Stringl］ args） ｛

ApplicationContext ctx = SpringApPlication.run （SpringBootAopAPP1ication.class,args）；

ctx.getBean （DemoService.class）.save （）；


## 9.7.2 Spring Framework 5.x 的顺序

运⾏ SpringBootAOPApPLication 的main 方法，观察控制台的输出如下所舌。

Service Aspect around before run….

Service Aspect before advice run ..

DemoService save run •

Service Aspect afterReturning advice run ….

Service Aspect after advice run.Service Aspect around after run …

<artifactId>spring-boot-starter-aop</artifactId>


## 9.7 AOP 通知的执⾏顺序对⽐I

由输出结果可以总结出 Spring Framework 5.x 中通知的执⾏顺序：

1. 环绕通知中joinPoint.proceed（）；之前的逻辑；

2. 前置通知；

3. 目标对象的目标方法；

4. 返回通知；

5.后置通知；

6. 环绕通知中 joinPoint.proceed（）；之后的逻辑。


## 9.7.3 Spring Framework 4.x 的顺序

要测试基于 Spring Framework 4.x 的AOP 顺序，需要改变当前项目依赖的 Spring Boot版本。

Spring Boot 1.x 的底层依赖 Spring Framework 4.x，所以只需将 pom.xm1 中 spring-boot-

starter-parent 的版本调整为1.5.22.RELEASE，如代码清单9-59所示。

1代码清单 9-59 调整 pom.xml

<parent>

<groupId>org.springframework.boot</groupId>

<artifactId>spring-boot-starter-parent</artifactId>

<version>1.5.22.RELEASE</version>

</parent>

<！--…-->

<dependencies>

<dependency>

<groupId>org.springframework.boot</groupId>

<version>1.5.22.RELEASE</version>

</dependency〉

</dependencies>

修改 Spring Boot版本后，不需要修改其他任何代码，等待 IDE 重新导人依赖后，再次运⾏

SpringBootAopApplication 的main 方法即可，控制台输出的切⾯执⾏顺序如下所示。

Service Aspect around before run .•.

Service Aspect before advice run .....

DemoService Save Lun••••••

Service Aspect around after run .....

Service Aspect after advice run ••

Service Aspect afterReturning advice run ….

由输出结果可以总结出 Spring Framework 4.x 中通知的执⾏顺序：

1. 环绕通知中joinPoint.proceed（）；之前的逻辑；

2． 前置通知；

3. 目标对象的目标方法；

4. 环绕通知中 joinPoint.proceed（）；之后的逻辑；

5. 后置通知；

6． 返回通知。

重点总结：Spring Framework 5.x 与4.x 中AOP通知顺序的不同之处在于环绕通知可以覆盖

绕通知只会包含前置通知，后置通知和返回通知会在环绕通知执⾏完成后执⾏。

|第9章 AOP模块的⽣命周期

的范围。Spring Framework 5.x 中环绕通知会包含其他所有通知，⽽ Spring Framework 4.x 中环


## 9.8小结

本章从 AOP 的开启注解@EnableAspectJAutoProxy 出发，详细探讨注解驱动 AOP底

层的⽀撑组件，并针对核心组件 AnnotationAwareAspectJAutoProxyCreator 的初始化

时机、作用机制进⾏深入剖析。AOP代理对象的工作离不开增强器、代理对象执⾏链等核心组

件的⽀撑，掌握核心组件的工作时机和作用机制可以更容易地理解 AOP 的工作原理。


## 第3部分

Spring Boot 整合常用开发场景

• 第10章 Spring Boot 整合JDBC

• 第11章 Spring Boot 整合 MyBatis

• 第12章 Spring Boot 整合 WebMvc



# 第13章 Spring Boot 整合 WebFlux


## 第13章 Spring Boot 整合 WebFlux

如何⽣效、控制的。

整合。

第

-章

Spring Boot 整合 JDBC

本章主要内容：

今 Spring Boot 整合 JDBC的核心⾃动装配内容；

今 声明式事务的⽣效原理；

今 声明式事务的控制原理；

◎ 声明式事务的事务传播⾏为原理。

在日常项目开发中，用到 Spring Boot 的场景通常都离不开与数据层的交互，⽽交互的基础

组件是来⾃ Spring Framework 的 spring-jdbc 包。本章重点研究的内容是 Spring Boot 整合

JDBC 后，⽣效的⾃动装配中做了哪些核心工作，以及引入的事务模块对于注解声明式事务是


## 10.1 Spring Boot 整合JDBC 项目搭建

⾸先搭建⼀个最基础的 Spring Boot整合JDBC的项目。Spring Boot 整合原⽣JDBC 的步

骤很简单，导入 spring-boot-starter-jdbc 以及连接数据库的驱动即可完成最基本的


## 10.1.1 初始化数据库

本书选择使用MySQL 作为演舌用数据库。⾸先创建⼀个新的数据库和⼀张用于演舌的表

tbl_user，对应的SQL 脚本如代码清单10-1 所舌。

代码清单 10-1 初始化数据库的 SQL 脚本

CREATE DATABASE springboot-dao CHARACTER SET 'utf8mb4'；

CREATE TABLE tbl_user（

id int （11） NOT NULI AUTO_INCREMENT，

name varchar （20） NOT NULL，

tel varchar （20） NULL，

PRIMARY KEY （id）

呵 提示：为了便于演示和调试代码，对于数据库部分建议读者从简设计，切勿本末倒置。

不过多讲解。

@Repository

I第10章 Spring Boot 整合JDBC


## 10.1.2 整合项目

整合JDBC模块以及编写对应的配置都⾮常简单，如代码清单 10-2~代码清单10-4所舌，

1代码清单10-2 导入整合 JDBC 的依赖

<dependencies>

<dependency>

<groupid>org.springframework.boot</groupid>

<artifactId>spring-boot-starter-jabc/aztifactId>

</dependency>

<dependency>

<groupId>mysql</groupid

<artifactId>mysql-connector-java</artifactId>

<version>5.1.47</version>

</dependency〉

</dependencies>

1代码清单 10-3 配置数据源

spring.datasource.driver-class-name=com.mysql.jdbc.Driver

spring.datasource.ur1=jdbc:mysql://1ocalhost:3306/spring-dao?characterEncoding=utf8

spring.datasource.username=root

spring.datasource.password=123456

】代码清单 10-4 开启注解式声明式事务

@SpringBootApplication

@EnableTransactionManagement

public class SpringBootJdbcApplication ｛

public static void main （Stringl］ args） ｛

SpringApplication.run （SpringBootJdbcApplication.class, args）；


## 10.1.3 编写测试代码

整合项目完毕后，下⼀步可以编写相应的实体类、Dao 层和 Service 层代码，本节仅快速实

现⼏个简单方法，如代码清单10-5~代码清单 10-7所舌。

1代码清单 10-5 与 tbL_user 对应的实体类 User

public class User｛

private Integer id；

Private String name；

Private String tel；

1/ getter setter tostring •

】代码清单 10-6 数据访问层 UserDao

利完成。


## 10.2 整合JDBC 后的⾃动装配！

public class UserDao ｛

@Autowired

private JdbcTemplate jabcTemplate：

public void save （User user）｛

jdbcremplate.update （"insert into tbl_user （name, tel） values （3，？）"，

user.getName （），user.getTel （））；

public List<User> findA11（）1

return jabcremplate.query（''select * from tbl_user"，

BeanPropertyRowMapper.newInstance （User.class））；

】代码清单 10-7 业务层 UserService

@Service

public class UserService1

@Autowired

private UserDao userDao；

cansactiona1 （rollbackFor = Exception.clas

blic void test （）

User user = new User （）；

user.setName （"test dao"）；

user.setTel （"1234567"）；

userDao.save （user）；

List<User> userList = userDao.findA11（）；

userList.forEach （System.out ：：println）；

要想测试整合是否成功，可以在主启动类中获取IOC容器，并提取出 UserService类调

用其 test 方法，测试是否可以成功保存并打印，如代码清单10-8所舌。

代码清单 10-8 通过 SpringApplication 获取到 IOC 容器后测试整合

public static void main （Stringl］ args） ｛

ApPlicationContext ctx = SpringApplication.run （SpringBoot JdbcApplication.class,args）；

UserService userService = ctx.getBean （UserService.class）；

userService.test （）；

运⾏主启动类，控制台可以正确打印出⼀条用户信息，证明 Spring Boot 整合 JDBC 场景顺

User｛id=l，name='test dao'，tel='1234567'｝


## 10.2 整合 JDBC后的⾃动装配

对于原⽣JDBC的整合后，主启动类中并没有声明与之相关的注解，所以有关JDBC的组

保阅读体验，全限定名已经过简化处理）。

兴趣的读者可以⾃⾏探究。

的关键源码。

I第10章 Spring Boot 整合JDBC

件装配都是以⾃动配置类的方式实现。借助 IDE 通过spring-boot-autoconfigure 依赖

的spring.factories ⽂件可以找到有关JDBC的⾃动配置类，如代码清单10-9所示（为确

代码清单10-9 有关JDBC 的⾃动配置类

O.S.b.autocontigure.unableAutocontiguration=

o.s.b.a.jdbc.DataSourceAutoConfiguration，\

o.s.b.a.jdbc.JdbcremplateAutoConfiguration，\

o.s.b.a.jdbc.JndiDataSourceAutoConfiguration，\

o.s.b.a.jdbc.XADataSourceAutoConfiguration，\

o.s.b.a.jdbc.DataSourceTransactionManagerAutoConfiguration，

可以发现 Spring Boot 默认⽀持的⾃动配置包含数据源、Jdbcremplate、事务管理器，以

及对 JNDI 和XA 协议的⽀持。本书只对日常开发中最常用的场景进⾏讲解，对于其余部分感


## 10.2.1 配置数据源

Spring Boot 除了拥有最原始的 DriverManagerDataSource，还默认⽀持 Hikari、DBCP、

EmbeddedTomcat 等数据库连接池，Spring Boot 2.x 在整合JDBC场景时，默认会导人 HikariCP

数据库连接池，所以在 DataSourceAutoConfiguration 的静态内部类中 PooledData

SourceConfiguration 会⽣效，并导人 DataSourceConfiguration 下的⼀些子配置

类，这些配置类同时只会有⼀个⽣效。代码清单 10-10 中列举了默认场景下激活 HikariCP

1代码清单 10-10 数据库连接池的配置激活

econtiguration （proxybeanmethoas = taLse）

@Conditional （PooledDataSourceCondition.class）

@ConditionalOnMissingBean （｛ DataSource.class, XADataSource.class ｝）

@Import（｛DataSourceConfiguration.Hikari.class, DataSourceConfiguration.Tomcat.class，

DataSourceConfiguration.Dbcp2.class, DataSourceConfiguration.Generic.class，

DataSourceJmxConfiguration.class｝）

protected static class PooledDataSourceConfiguration ｛

@Configuration （proxyBeanMethods = false）

aConditionalOnclass （HikariDataSource Class）

@Conditiona10nMissingBean （DataSource.class）

@Conditiona10nProperty（name = "spring.datasource.type"，

havingValue = "com.zaxxer.hikari.HikariDataSource"，matchIfMissing = true）

static class Hikari ｛

@Bean

@ConfigurationProperties（prefix = "spring.datasource.hikari"）

HikariDataSource dataSource （DataSourceProperties properties） ｛

HikariDataSource dataSource = createDataSource （properties,HikariDataSource.class）；

i （StringUtils.hasrext（properties.getName （）））｛

dataSource.setPoolName （properties .getName （））：


## 10.2

所示。

类名前⾯的DataSourceInitializer。借助IDE查看DataSourceInitializerInvoker

整合JDBC 后的⾃动装配|

return dataSource；

此外 DataSourceAutoConfiguration 中还使用@Import 注解导人了⼀个 Data

SourceInitializationConfiguration 配置类，⽽这个配置类⼜导人了⼀个 Data

SourceInitializerInvoker 和⼀个 Registrar 注册器，注册器中⼜向 BeanDefini

tionRegistry 中注册了⼀个 DataSourceInitializerPostProcessOr，如代码清单10-11

1代码清单 10-11 注册 DataSourcelnitializerlnvoker

@Configuration （proxyBeanMethods = false）

@Import （｛ DataSourceInitializerInvoker.class，

DataSourceInitializationConfiguration.Registrar.class｝）

class DataSourceInitializationConfiguration ｛

static class Registrar implements ImportBeanDefinitionRegistrar ｛

private static final String BEAN_NAME = "dataSourceInitializerPostProcessor"；

aOverride

Puosic vola registerbeanverinltions （Annotationmetadata 1mportingtLassmetaaa ta/

BeanDefinitionRegistry registry） ｛

i£ （！registry.containsBeanDefinition（BEAN_NAME））｛

GenericBeanDefinition beanDefinition = new GenericBeanDefinition（）；

beanDefinition.setBeanClass（DataSourceInitializerPostProcessor.class）；

beanDefinition.setRole （BeanDefinition.ROLE_INERASTRUCTURE）；

beanDefinition.setSynthetic （true）；

registry.registerBeanDefinition （BEAN_NAME,beanDefinition）；

下⾯简单探究 DataSourceInitializerInvoker 与 DataSourceInitializerPost

ProcesSor 的作用。

1. DataSourcelnitializerlnvoker

由类名理解 DataSourceInitializerInvoker 是⼀个执⾏器，⽽这个执⾏器刚好就是

的源码，可以发现它是⼀个监听器，监听的事件是 DataSourceSchemaCreatedEvent。此

外，DataSourceInitializerInvoker 还实现了 InitializingBean接口，它会在对象

创建后回调 afterPropertiesSet 方法执⾏初始化逻辑，如代码清单10-12所示。

代码清单 10-12 DataSourcelnitializerlnvoker 的重要结构

class DataSourceInitializerInvoker implements ApplicationListener<DatasourceschemaCreatedEvent>，

InitializingBean ｛


// 内部组合了⼀个 DataSourceInitializer

private DataSourceInitializer dataSourceInitializer；

@Override

1第10章 Spring Boot 整合 JDBC

PuoLic vola arterrropertlesoet（ t

Datasourcelnitlallzer inltlallzer = getlatasourcernitlalizer（，

if （initializer ！= null）｛

boolean schemaCreated = this.dataSourceInitializer.createSchema（）；

i£（schemaCreated）｛

initialize （initializer）；

重点关注 afterPropertiesSet 方法的实现，当初始化回调逻辑执⾏时，afterProper

tiesSet 方法会先调用 getDataSourceInitializer 方法获取 DataSourceInitializer

实例，随后执⾏ DataSourceInitializer 的 createSchema 方法，如果 createSchema

方法执⾏成功，则继续执⾏后续的initialize 方法以初始化数据。整个方法中有两个重要的

初始化动作，分别是 createSchema 与 initialize 方法，逐⼀来看。

（1） createSchema

createschema 方法名直译为“创建约束”，它要完成的创建工作主要是对于数据库中的

表结构，即执⾏ DDL 语句。createschema 方法的执⾏机制是，通过读取 Spring Boot 全局配

置⽂件 application.properties中的spring.datasource.schema 属性或者在没有任

何配置的情况下执⾏ getScripts 方法的下半部分逻辑，加载名为 schema.sql 或 schema-

a11.sq1 的⽂件，如代码清单 10-13所示。

代码清单 10-13 createSchema 执⾏ DDL 语句

boolean createSchema （）｛

List<Resource> scripts = getScripts（"spring.datasource.schema"，this.properties.getSchema（），

"schema"）；

if （！scripts.isEmpty（））｛

（.1Stnaolea（1

return false；

string username = this.properties.getSchemaUsername （）；

String password = this.properties.getSchemaPassword （）；

runScripts （scripts,username,password）；

return !scripts.isEmpty（）；

private List<Resource> getScripts（String propertyName,List<String> resources,String fallback）｛

if （resources ！= nul1）｛

return getResources （propertyName,resources,true）；

1/ 默认返回字符串“a11"

String Platform = this.Properties.getPlatform（）；

List<String> fallbackResources = new ArrayList<>（）；

fallbackResources.add （"classpath*：" + fallback + "_" + platform + ".sql"）；

fallbackResources.add（"classpath*：" + fallback + ".sql"）；

return getResources （propertyName,fallbackResources,false）；

目启动时⾃动初始化数据库表结构和数据的效果。

Initializer 定制的后置处理器，但是从源码中可以得知，DataSourceInitializer


## 10.2 整合 JDBC 后的⾃动装配|

（2） initialize

initialize 方法的执⾏时机在 createSchema 后，它要做的事情是执⾏ DML 语句，

初始化数据库中实际的数据。触发 initialize 方法的方式是通过⼴播 DataSourceschema

CreatedEvent 事件，回调下方 onApplicationEvent 方法执⾏，⽽最终执⾏的逻辑是

DataSourceInitializer 中的 initschema 方法。从方法实现上看，initschema 方法的

逻辑与 createschema 大同小异，但是initSchema 方法寻找SQL ⽂件的依据是全局配置⽂

件中的 spring.datasource.data 配置项，或者在没有任何配置的情况下加载名为

data.sql 或data-al1.sq1 的⽂件，如代码清单 10-14所示。

代码清单 10-14 initialize 执⾏ DML 语句

private void initialize（DatasourceInitializer initializer）｛

try｛

this.applicationContext.publishEvent（

new DataSourceSchemaCreatedEvent （initializer.getDataSource （）））；


｝1/ catch throw ex •..

public void onApplicationEvent （DatasourceschemaCreatedEvent event）｛

DataSourceInitializer initializer = getDataSourceInitializer （）；

if（！this.initialized && initializer ！= null） ｛

initializer.initSchema （）；

this.initialized = true：

vo1a inicochema（t

"data"）；

i£ （！scripts.isEmpty（））｛

iE （！isEnabled（））｛

List<Resource> scripts = getScripts （"spring.datasource.data"，this.properties.getData（），

String username = this.properties.getDataUsername （）；

string password = this.properties.getDataPassword（）；

runScripts （scripts,username,Password）；

简单总结，有了 DataSourceInitializerInvoker 的设计，使得在项目开发中可以通

过⾃定义DDL 语句和 DML 语句并封装SQL ⽂件放置于项目的resources 目录下，达到项

2. DataSourcelnitializerPostProcessor

由类名理解，DataSourceInitializerPostProcessor 是专⻔为 DataSource

PostProcesSOr 的作用是在 DataSource 的初始化阶段即时创建 DataSourceInitializer

Invoker 对象，如代码清单10-15所示。

@Autowired

|第10章 Spring Boot 整合 JDBC

【代码清单 10-15 DataSourcelnitializerPostProcessor 的核心后置处理方法

class DataSourceInitializerPostProcessor implements BeanPostProcesSor, Ordered｛

private BeanFactory beanFactory；

Boverride

public object postProcessAfterInitialization （Object bean,String beanName）

throws BeansException ｛

iE （bean instanceof DataSource）｛

this.beanFactory.getBean （DataSourceInitializerInvoker.class）；

return bean；

｝

注意观察 postProcesSAfterInitialization 方法的逻辑，当 DataSourceInitia

1izerPostProcessor 检测到当前正在初始化的对象类型是 Datasource 时，会主动调用

BeanFactory 的getBean 方法⽴即加载 DatasourceInitializerInvoker，此举的目的是

使预先定义好的SQL 脚本⽴即执⾏，以确保DataSource 与数据库表结构、数据的同步初始化。


## 10.2.2 创建 JdbcTemplate

默认情况下 Spring Boot 会在项目中创建⼀个 JdbcTemplate，用于与数据库简单交互。

之后还会向容器中注册⼀个 NamedParameterJdbcTemplate，用于⽀持参数命名化的

Jdbcremplate 增强，如代码清单 10-16所示（源码逻辑很简单，不再展开）。

】代码清单10-16 默认的 JdbcTemplate 创建（部分注解已省略）

@Configuration （proxyBeanMethods = false）

Import（｛ JdbcremplateConfiguration.class,NamedParameterJdbcremplateConfiguration.Class ｝

ublic class JabcTemplateAutoconfiguration｛

class JdbcremplateConfiguration ｛

@Bean

@Primary

Jdbcremplate jdbcremplate （Datasource datasource,JdbcProperties properties）｛

JdbcTemplate jdbcremplate = new JdbcTemplate （dataSource）；/......

return jdbcTemplate；

class NamedParameterJdbcremplateConfiguration ｛

@Bean

@Primary

NamedParameterJdbcTemplate namedParameterJdbcTemplate （Jdbcremplate jdbcTemplate）｛

return new NamedParameterJabcTemplate （jdbcTemplate）；

配置事务管理器


## 10.3 声明式事务的⽣效原理』


## 10.2.3

引人JDBC数据访问场景后，必不可少地要用到事务。DataSource 创建完成后 Spring Boot

还会默认创建⼀个 DatasourceTransactionManager，用于⽀持基于数据源的事务控制，

如代码清单 10-17所舌。

代码清单 10-17 配置事务管理器（部分注解已省略）

@Configuration （proxyBeanMethods = false）

@Conditional0nclass （｛Jdbcremplate.class,PlatformTransactionManager.class｝）

public class DataSourceTransactionManagerAutoConfiguration ｛

static class DataSourceTransactionManagerConfiguration ｛

@Bean

@ConditionalOnMissingBean （PlatformTransactionManager.class）

DataSourceTransactionManager transactionManager （DataSource dataSource，

ObjectProvider<TransactionManagerCustomizers> transactionManagerCustomizers）｛

DataSourceTransactionManager transactionManager =

new DataSourceTransactionManager （dataSource）；

transactionManagerCustomizers.ifAvailable （（customizers） ->

customizers.customize （transactionManager））；

return transactionManager；


## 10.3 声明式事务的⽣效原理

Spring Boot 整合JDBC 的场景中，除了引入 spring-jdbc，还会引入 spring-tx 实现

事务控制。默认情况下 Spring Boot会⾃动配置并开启注解声明式事务，本节内容将详细探究 Spring

Boot 配置的注解声明式事务是如何⽣效的。

回顾10.1 节的示例项目中，在 SpringBootJdbcApP1ication 主启动类中显式标注了

EnableTransactionManagement 注解用于开启注解声明式事务，但即便不进⾏标注，底

层仍然会使用⾃动配置类的方式开启，具体的开启位置在⾃动配置类 Transaction

AutoConfiguration中。


## 10.3.1 TransactionAutoConfiguration

TransactionAutoConfiguration 如代码清单 10-18所示。

代码清单 10-18TransactionAutoConfiguration

@Configuration （proxyBeanMethods = false）.....

public class TransactionAutoConfiguration ｛

@Configuration （proxyBeanMethods = false）

@ConditionalOnBean （TransactionManager.class）

@ConditionalOnMissingBean （AbstractTransactionManagementConfiguration.class）

所示。

|第10章 Spring Boot 整合 JDBC

public static class EnablerransactionManagementConfiguration ｛

@Configuration （proxyBeanMethods = false）

@EnablerransactionManagement （proxyTargetClass = false）

@ConditionalonProperty（prefix = "spring.aop"，name = "proxy-target-class"，

havingvalue = "false"， matchIfMissing = false）

public static class JdkDynamicAutoProxyConfiguration｛

@Configuration （proxyBeanMethods = false）

@EnableTransactionManagement （proxyTargetClass = true）

@ConditionalOnProperty（prefix = "spring.aop"，name = "proxy-target-class"，

havingValue = "true"， matchIfMissing =true）

public static class CqlibAutoProxyConfiguration ｛

通过代码清单 10-18 可以发现，即使项目中没有显式地标注@EnableTransactionMana

gement 注解，底层的配置类中也会协助开启，唯⼀的可变项是根据项目中配置的AOP 是否强

制代理目标类对象（proxyTargetClass）来决定如何创建事务代理对象。

既然注解声明式事务的最终开关是@EnableTransactionManagement 注解，根据前⾯

⼏章的内容就可以断定，@EnableTransactionManagement 注解的内部⼀定是使用

@Import 注解导人了⼀些特殊的组件，以此实现模块装配。借助 IDE 打开@Enable

TransactionManagement 的源码，可以发现它导人了⼀个 TransactionManagement

ConfigurationSelector，⽽且这个注解中还包含三个属性，如代码清单 10-19所示。


## 1 代码清单 10-19 @EnableTransactionManagement 注解

@Import （TransactionManagementConfigurationSelector.class）

public @interface EnablerransactionManagement｛

boolean proxyTargetClass（）default false；

AdviceMode mode （）default AdviceMode.PROXY：

int order （）default Ordered.LOWEST_PRECEDENCE；

注解属性中 ProxyTargetClass 与order 都是我们⽐较熟悉的属性，本节不再解释。有

关mode 属性的设计，读者可以简单了解⼀下。

mode 属性的取值有两个，分别是 PROXY 和 ASPECTJ。注意这两个概念不同于 AOP 部分

中的原⽣ AOP 和基于 AspectJ的AOP。PROXY的含义是事务通知会在程序运⾏期使用动态代

理的方式向目标对象织人通知，⽽ASPECTJ代表的是在类加载期织入事务通知（类似于

load-time-weaving）。⼀般情况下，使用注解声明式事务时都是使用运⾏期的动态代理来实现

AOP 或者事务控制，实际上也可以⼿动调整通知织人的时机为类加载期。如果要把mode 改为

ASPECTJ的话，需要额外导入⼀个依赖，并开启 load-time-weaving，如代码清单 10-20

织入，因此对于这个知识点读者只需简单了解。


## 10.3 声明式事务的⽣效原理I

1代码清单 10-20 ⽀持类加载期的事务通知需要额外导入 spring-aspects 依赖

<dependency〉

<groupId>org.springframework</groupId>

<artifactId>spring-aspects</artifactid>

</dependency〉

q 提示：由于目前的主流项目开发中不会使用@EnableLoadTimeWeaving 进⾏类加载期的通知


## 10.3.2 TransactionManagementConfigurationSelector

简单了解了@EnableTransactionManagement 注解的属性后，下⾯重点关注导人的

TransactionManagementConfigurationSelector 组件。从类名上不难得知该组件是⼀

个 ImportSelector，从代码清单 10-21 中的 selectImports 方法中可以得知，它会根据

@EnableTransactionManagement注解的mode属性的值决定导人哪些组件，对于PROXY，

导人的两个组件是 AutoProxyRegistrar 和 ProxyTransactionManagementConfigu

ration，下⾯我们重点研究这两个组件的作用。

代码清单 10-21 TransactionManagementConfigurationSelector

public class TransactionManagementConfigurationSelector

extends AdviceModeImportSelector <EnableTransactionManagement>｛

BOverride

protected Stringl］ selectImports （AdviceMode adviceMode）｛

switch（adviceMode）｛

case PROXY：

return new Stringl］ ｛AutoProxyRegistrar.class.getName （），

ProxyTransactionManagementConfiguration.class.getName （）｝；

case ASPECTJ：

default：

return null；

return new Stringl］ ｛deternineTransactionAspectClass（）｝；

｝


## 10.3.3 AutoProxyRegistrar

由源码可知 AutoProxyRegistrar本⾝是⼀个 ImportBeanDefinitionRegistrar，

它的作用是向 BeanDefinitionRegistrY 中编程式注册新的 BeanDefinition。从核心实

现方法 registerBeanDefinitions 中可以看出，AutoProxyRegistrar 会根据@Ena

blerransactionanagement 注解中的属性决定是否注册额外的组件。通常情况下项目中

使用的都是运⾏期 AOP 的声明式事务，因此提取的 mode 值⼀定是 PROXY，后续会调用

AbstractAdvisorAutoProxyCreator，所以它们都可以创建代理对象，不过两者最大的区

⽽不会整合项目中⾃定义的增强器。



# 第10章 Spring Boot 整合JDBC


## 第10章 Spring Boot 整合JDBC

AopConfigUtils.registerAutoProxyCreatorIfNecessary 方法注册有关 AOP 的组

件，继续往下深入可以发现，实际注册的组件类型是 InfrastructureAdvisorAuto

ProxyCreator，如代码清单 10-22 所示。

喜代码清单 10-22 AutoProxyRegistrar 中注册新 BeanDefinition 的核心逻辑

public void registerBeanDefinitions （AnnotationMetadata importingClassMetadata，

BeanDefinitionRegistry registry） ｛

boolean candidateFound = false；

Set<String> annTypes = importingClassMetadata.getAnnotationTypes （）；

for （String annrype :annTypes）｛

1/ 搜寻类上所有标注的注解

// 目的是找到@EnableTransactionManagement

AnnotationAttributes candidate = AnnotationConfigutils.attributesFor（

importingClassMetadata,annType）；

if （candidate == nul1）｛

CO LJUe

1/ 获取注解上的mode 和 proxyTargetClass 属性值

Object mode = candidate.get （"mode"）：

Object proxyTargetClass = candidate.get （"proxyTargetClass"）：

if（mode ！= nu11 && proxyTargetClass ！= nul1 && AdviceMode.class == mode.getClass （）

&& Boolean.class == proxyTargetClass.getClass （））｛

candidateFound = true；

// 当mode 为 PROXY 时，会注册额外的 BeanDefinition

if （mode == AdviceMode.PROXY）1

AopConfigutils.registerAutoProxyCreatorIfNecessary （registry）；

i （（Boolean）proxyTargetClass）｛

AopConfigutils.forceAutoProxyCreatorToUseclassProxying （registry）；


## 11 logger •

public static BeanDefinition registerAutoProxyCreatorIfNecessary （

BeanDefinitionRegistry registry） ｛

return registerAutoProxyCreatorIfNecessary（registry, null）；

public static BeanDefinition registerAutoProxyCreatorIfNecessary （

BeanDefinitionRegistry registry， @Nullable Object source）｛

return registerorEscalateApcAsRequired（InfrastructureAdvisorAutoProxyCreator.class，

registry,source）；

这个 InfrastructureAdvisorAutoProxyCreator 与第9章中学习的AOP 核心代理

对象创建器 AnnotationAwareAspectJAutoProxyCreator 有些相似，它们的⽗类都是

别在于，InfrastructureAdvisorAutoProxyCreator 只会组合“基础类型”的增强器，

务控制相关的核心组件，逐⼀来看。


## 10.3 声明式事务的⽣效原理|

要理解“基础类型”这个概念，需要读者先了解 BeanDefinition 中给Bean 定义的3种

⻆⾊，如代码清单10-23所示。“基础类型”实际指的是BeanDefinition 中的⻆⾊为 ROLE_

INFRASTRUCTURE。通常情况下只有 Spring Framework 内部定义的 Bean 才可能被标注

ROLE_INFRASTRUCTURE ⻆⾊，⽽且这些 Bean 在应用程序中起到基础⽀撑的作用。

代码清单 10-23 BeanDefinition 中定义的3种⻆⾊

int ROLE_APPLICATION = 0；

int ROLE SUPPORT = 1；

int ROLE_INFRASTRUCTURE = 2；

由上述理论，读者可以大胆猜想：事务控制的核心是AOP中的⼀个MethodInterceptor，

它的⻆⾊刚好是 ROLE_INFRASTRUCTURE。InfrastructureAdvisorAutoProxyCreator

可以在 bean 对象的初始化期间搜寻到这个 MethodInterceptor 并包装⼒ Advisor，给需要

进⾏注解事务控制的bean 对象构造代理对象。

提示：可能有读者在此处会产⽣疑惑：如果 AOP 与事务在项目中同时存在，是否会导入两个代理对

象创建器？答案是否定的。Spring Framework 在底层为两种代理对象创建器定义了优先级，当

AnnotationAwareAspectJAutoProxyCreator 先注册到 IOC 容器后再注册 Infras

tructureAdvisorAutoProxYCreator 时，会⽐对两者的优先级，由于 AOP 的核心代理对

象创建器可以处理所有⻆⾊的通知，因此它的优先级更⾼，在这种场景下 Infrastructure

AdvisorAutoProxYCreator 就不会再注册（相关源码可参照代码清单9-3）。


## 10.3.4 ProxyTransactionManagementConfiguration

TransactionManagementConfigurationSelector 导人的另⼀个组件是 Proxy

TransactionManagementConfiguration，它本身是⼀个配置类，其内部注册了3个与事

1. transactionAttributeSource： 事务配置源

第⼀个注册的Bean类型为TransactionAttributesource，我们有必要先了解⼀下这

个接口。TransactionAttributesource 接口在 Spring Framework 5.2版本之前只有⼀个

getTransactionAttribute 方法。随着 Spring Framework 5.2版本之后引入响应式事务控

制，TransactionAttributesource 接口才多了另⼀个 isCandidateclass 方法。不过

这些细节不是需要重点关注的，getTransactionAttribute 方法才是重中之重，它可以将

⼀个类+方法解析转换内 TransactionAttribute，⽽ TransactionAttribute 本身是

TransactionDefinition，所以可以这样理解：TransactionAttributeSource 可以根

据⼀个具体的类中的方法解析并转换为⼀个 TransactionDefinition （Transaction

Attribute）.

借助IDE 可以找到TransactionAttributeSource 的⼏个实现类，如图10-1所示。实

现类中包含了在配置类中创建的 AnnotationTransactionAttributeSource，如代码清

单10-24所示。除此之外，TransactionAttributeSource 还有⼀些其他的实现，感兴趣

的读者可以⾃⾏了解，本节只讲解 AnnotationTransactionAttributeSource。

第⼆个注册的组件是事务切⾯的核心通知：TransactionInterceptor 事务拦截器，如

1第10章 Spring Boot 整合 JDBC

【代码清单 10-24 注册 AnnotationTransactionAttributeSource

@Bean

Role （BeanDefinition.ROLE_INFRASTRUCTURE）

oublic TransactionAttributeSource transactionAttributeSource（）｛

return new AnnotationTransactionAttributeSource （）；

Public interface TransactionAttributeSource ｛

// isCandidateClass

@Nullable

TransactionAttribute getrransactionAttribute（Method method，@Nullable Class<?> targetClass）；

）

public interface TransactionAttributeSource ｛

AbstractFal1backTransactionAttributesource （org

©AnnotationTransactionAttributeSource （org.sprin


## 9 CompositeTransactionAttributeSource （org.spring

© MatchAlwaysTransactionAttributeSource （org.spri

©MethodMapTransactionAttributesource （org.spring

©NameMatchTransactionAttributesource （org.spring

图 10-1 TransactionAttributeSource 的实现类

从 AnnotationTransactionAttributeSource 的 javadoc 中可以获取到关键信息：

This class reads Spring's JDK 1.5+ Transactional annotation。这说明它解析事务信息的依据是读取

@Transactiona1 注解，这就是注解声明式事务的标注读取器。⾄于其中如何读取、解析，

将在10.4节中讲解。

2. transactionlnterceptor：事务拦截器

代码清单 10-25所示。它本身是⼀个 MethodInterceptor，通过第9章的学习，我们知道

MethodInterceptor 接口是AOP增强的核心拦截器接口，利用AOP ⽣成的代理对象中都会

包含⼀组 MethodInterceptor 接口的实现类对象。除此之外，TransactionInterceptor

还有⼀个⽗类 TransactionAspectSupport，这个⽗类中有⼀些与 Spring Framework 基础事务

API 的集成（如执⾏事务的核心方法 invokeWithinrransaction、创建事务、提交事务、回滚

事务等）。有关这些事务控制动作的触发位置，同样也放到10.4 节中讲解。

1代码清单 10-25 注册 TransactionInterceptor

1/ 参数名有精简

@Bean

@Role （BeanDefinition. ROLE_INERASTRUCTURE）

public TransactionInterceptor transactionInterceptor （TransactionAttributeSource attr）｛

TransactionInterceptor interceptor = new TransactionInterceptor（）；

interceptor.setlransactlonAttrloutesource （attr）：

i£ （this.txManager ！= nul1）｛

interceptor.setTransactionManager（this.txManager）；

最后⼀个注册的组件是事务增强器。AOP 中除了有通知，还有⼀个核心要素就是增强器，

控制。

务中必备的组件，有了这些组件，就可以⽀撑注解事务的控制。

制的底层全流程。


## 10.4 声明式事务的控制全流程！

return interceptor；

3. transactionAdvisor： 事务增强器

⽽注册的 BeanFactoryTransactionAttributeSourceAdvisor 从类名上看就是⼀个增

强器，注意其内部组合了 TransactionInterceptor 事务拦截器和 TransactionAttribute

Source 事务配置源，如代码清单 10-26所舌。

代码清单 10-26 注册 TransactionAttributeSourceAdvisor

@Bean （name = TransactionManagementConfigUti1s.TRANSACTION_ADVISOR_BEAN_NAME）

Role （BeanDefinition.ROLE_INFRASTRUCTURE）

public BeanFactoryTransactionAttributeSourceAdvisor transactionAdvisor （

TransactionAttributeSource transactlonAttrloutesource，

TransactionInterceptor transactionInterceptor）｛

BeanFactoryTransactionAttributeSourceAdvisor advisor =

new beanractoryiransactionAttrioutesourceAaViSor（）；

advisor.setTransactionAttributeSource （transactionAttributeSource）；

advisor.setAdvice （transactionInterceptor）；

//提取@EnableTransactionManagement 的 order 属性

if（this.enablerx ！= null）｛

advisor.setorder （this.enableTx. <Integer>getNumber （"order"））；

既然是AOP 中的增强器，那么切人点也必不可少。BeanFactoryTransactionAttribute

SourceAdvisor 判断⼀个类是否可以被增强的依据是利用 TransactionAttribute

Source，检查类和方法中是否标注有eTransactiona1注解，这个逻辑与读者所熟知的事务

控制⼀致，即如果 Service类上或者方法上标注了erransactiona1注解，则事务切⾯会介入

简单总结，ProxyTransactionManagementConfiguration 中注册了注解声明式事


## 10.4 声明式事务的控制全流程

了解了声明式事务的⽣效原理，本节结合10.1 节的整合项目，以Debug的方式研究事务控

借助 IDE 测试，将断点打在 userService.test（）；方法上，以 Debug 的形式运⾏

springBootJdbcApplication，等断点停在此处时 Debug进入。


## 10.4.1 CglibAopProxy#intercept

由于默认情况下 Spring Boot 会使用代理目标类的方式创建代理对象，因此这⾥⾸先会

进入 CglibAopProxY的 intercept 方法，通过第9章的内容可以快速定位到代理对象

中的增强器，即上⾯提到的 BeanFactoryTransactionAttributeSourceAdviSor，

本节将其拆分为多个⽚段讲解。



# 第10章 Spring Boot 整合JDBC


## 第10章 Spring Boot 整合JDBC

⽽这个增强器中组合的通知，刚好是上⾯提到的事务拦截器 TransactionInterceptor，

如图10-2所示。

this= ｛CglibAopProxy$DynamicAdvisedinterceptor@3910｝

v 'f advised = （ProxyFactory@3914）..toStringo

>• aopProxyFactory = ｛DefaultAopProxyfactory@3915｝

listeners = ｛LinkedList@3916｝ size =0

f active = true

> f targetSource = ｛SingletonTargetSource@3917｝.. toString（

f prFiltered = true

>f advisorChainFactory = ｛DefaultAdvisorChainFactory@3918｝

f methodCache = ｛ConcurrentHashMap@3919） size = 0

interfaces = （ArrayList@3920｝ size =0

f advisors = （ArTayList@3921） size = 1

= 0 = ｛BeanFactoryTransactionAttributeSourceAdvisor@3925）..toStringo

>f transactionAttributeSource = ｛AnnotationTransactionAttrbuteSource@3926）

> f pointcut = ｛BeanfactoryTransactionAttributesourceAdvisor$1@3927｝. toString0

f adviceBeanName = null

>f beanFactory = ｛DefaultListableBeanFactory@3184｝.. toString0

> advice = （Transactioninterceptor@3928）

>《f adviceMonitor = ｛ConcurrentHashMap@3929） size = 86

> order = ｛integer@3930） 2147483647

f advisorArray =｛Advisor［1］@3922）

proxyTargetClass = true

ontimniza - falca

图 10-2 UserService 代理对象中有⼀个增强器

明确了通知方法的位置，下⾯直接将断点打在 TransactionInterceptor 的invoke

方法上，并放⾏当前的断点调试，使程序停在 invoke 方法。


## 10.4.2 Transactionlnterceptor

进入 TransactionInterceptor 的invoke 方法，可以发现方法中直接调用了 invoke

withinTransaction 方法，⽽这个 invokewithinTransaction 方法定义在Transaction

Interceptor 的⽗类 TransactionAspectSupport 中，如代码清单 10-27所示。

代码清单 10-27 Transactionlnterceptor 的核心通知方法

@override

public Object invoke （MethodInvocation invocation）throvs Throwable ｛

Class<?> targetClass = （invocation.getThis（）！= mull

？AopUtils.getrargetClass （invocation.getrhis（））：nul1）；

return invokewithinTransaction （invocation.getMethod （），targetClass, invocation： ：proceed）；

由于 invokewithinTransaction 方法的篇幅很⻓，为便于读者更好地阅读和理解源码，


## 10.4 声明式事务的控制全流程|

1. 获取 TransactionAttribute

invokewithinTransaction 方法的第⼀步工作是通过 TransactionAttributeSource

获取到 TransactionAttribute 事务定义信息，如代码清单 10-28 所示。getTran

sactionAttribute 方法的内部有⼀个缓存机制，方法的核心工作是根据方法和方法所在

的类获取并缓存对应的事务定义信息，如果没有获取到事务定义信息则会缓存 NULI_

TRANSACTION_ATTRIBUTE 空定义并返回，如代码清单10-29所示。

【代码清单 10-28 invokeWithinTransaction（1）

@Nullable

Protected Object invokewithinrransaction （Method method， @Nullable Class<?> targetClass，

final InvocationCallback invocation）throws Throwable ｛

//如果事务属性为空，则方法⾮事务性的

TransactionAttributeSource tas = getTransactionAttributeSource （）；

Einal TransactionAttribute txAttr = （tas ！= nul1

？tas.getTransactionAttribute （method, targetClass）：nu11）；

1代码清单 10-29 getTransactionAttribute 获取事务定义信息

Private final Map<Object, TransactionAttribute> attributeCache =new ConcurrentHash Map<>（1024）；

Public TransactionAttribute getrransactionAttribute （Method method，

@NullableClass<?> target Class）｛

if（method.getDeclaringClass（）== Object.class）｛

ce cuti auk i

// 根据 method 和 targetClass 构造⼀个缓存key

Object cacheKey = getCacheKey （method,targetClass）：

// 如果能从缓存中获取到事务定义信息，则直接返回

TransactionAttribute cached = this.attributeCache.get （cacheKey）；

if （cached ！= nul1）｛

1/（此处简化了i结构）

return cached == NULL_TRANSACTION_ATTRIBUTE ?nu11 :cached；｝ else｛

1/ 如果没有获取到事务定义信息，则需要根据方法和方法所在类的信息构造事务定义信息

TransactionAttribute txAttr = computeTransactionAttribute （method, targetClass）；

// ⽆论是否构造成功，最终都会将该方法缓存⾄ attributeCache 中

if （txAttr == nul1） ｛

this.attributeCache.put （cacheKey, NULL_TRANSACTION_ATTRIBUTE）；

｝ else｛

String methodIdentification = ClassUtils.getQualifiedMethodName （method, target Class）；

if（txAttr instanceof DefaultTransactionAttribute）｛

（（DefaultrransactionAttribute）txAttr） .setDescriptor （methodIdentification）；

ogger....

ihis.attributecache.put （cacheKey,txAttz）；

注意这⾥有⼀个问题，当 Debug ⾄此处，可以发现缓存中已经成功获取到Transaction

【第10章Spring Boot 整合 JDBC

Attribute，如图10-3 所示。出现这种现象的原因是，事务通知在织入之前需要对每个正在

创建的 bean 对象进⾏匹配，⽽匹配时需要使用 TransactionAttributeSource 检查方法

或方法所在类上是否标注有@rransactiona1 注解，以此来判断是否需要对当前正在创建的

bean 对象织入事务通知。⽽不管最终事务通知是否需要织入目标对象，Transaction

AttributeSource 中都会留下被检查方法的判断痕迹。

/ rirst, see ir we nave a cacnea vaiue.

Object cacheKey = getCacheKey（method, targetClass）； Methodcia：

TransactionAttribute cached = this.attributeCache.get （cacheKey）； cached：

/Value wiil either be canonical value indicating tnere is no transa

ronon ecua. ransaceion arraoue

1f （cached == NULL_TRANSACTION_ATTRIBUTE）｛

图10-3 第⼀次获取事务定义信息即可成功获取

既然所有的事务定义信息已经在 bean 对象的初始化阶段被后置处理器扫描并封装过，如果

读者想探究封装的过程，需要重新 Debug 启动程序，并使用条件断点打在 Abstract

FallbackTransactionAttributesource 的第112⾏，如图10-4所示。

else｛

TransactionAttrlbute txAtt

ache.ou

Mouspena：.Al Cnread

conaition：

Demeservice.class.equals（targetC10ss）

wore tri+Shitt+f5

J lentifici

图10-4 使用条件断点调试 DemoService 的事务定义信息封装

标注好断点后，重新 Debug运⾏ springBootJdbcApplication，待程序停在条件断点

处时就可以获得此时正在创建的UserService 对象，如图 10-5所示。

method = （Method@4477）'public void com.linkedbear.springboot.service.UserService.test0*

slot= 1

>《name = "test'

t return ype = os9@444.Navgard

图10-5 使用条件断点的效果

有了业务层对象，下⼀步就可以进入 computeTransactionAttribute 方法实际地解

析和封装事务定义信息。方法逻辑本身不难，它会寻找方法上是否标注了@Transactional

注解，以及寻找类上是否标注了@Transactional 注解，从源码的搜寻顺序上明显可知是先

找方法后找类，由此可⻅方法级的优先级更⾼，如代码清单 10-30所示。

代码清单 10-30 computeTransactionAttribute 解析和封装事务定义信息

Protected TransactionAttribute computerransactionAttribute （Method method，

@Nullable Class<?> targetClass）｛

1/ ⾮public 方法不处理

i£（allowPublicMethodsonly（）&& ！Modifier.isPublic（method.getModifiers（）））｛

return null；

信息的解析和封装。

正触发事务拦截器的逻辑⽽需要取出事务定义信息时，可以直接从缓存中取出⽽不需要重新解析。


## 10.4 声明式事务的控制全流程|

Method specificMethod = AopUtils.getMostSpecificMethod（method, targetClass）；

// ⾸先寻找方法上是否标注了@Transactional 注解

TransactionAttribute txAttr = findTransactionAttribute （specificMethod）；

if（txAttr ！= nul1）｛

return txAttr；

// 如果方法上没有，则接下来寻找类上是否标注了eTransactiona1 注解

txAttr = findTransactionAttribute（specificMethod.getDeclaringClass（））；

iE（txAttr！= null && ClassUtils.isuserLevelMethod （method））｛

return txAttri

return null；

下⾯ findTransactionAttribute 方法的实现会将@Transactiona1 注解中的属性

逐⼀获取，封装⼒ RuleBasedIransactionAttribute 对象并返回，以完成整个事务定义

简单总结，当应用启动时，由于⾃动配置类中默认标注有@EnableTransaction

Management 注解，该注解会向 IOC 容器中注册 InfrastructureAdvisorAutoProxy

Creator 事务通知增强器，这个增强器会参与bean 对象初始化的AOP后置处理逻辑中，检查

被创建的bean 对象中是否可以织入事务通知（标注@Transactiona1注解），检查的动作会同

时保存到 AbstractFallbackTransactionAttributeSource 的本地缓存中，因此在真

2. 获取 TransactionManager

获取到事务定义信息之后，接下来要做的是获取事务管理器。执⾏ determineTran

sactionManager 方法，⽽方法的最终实现是在源码最后的最深层的 if 结构中从 Bean

Factory 中获取 TransactionManager，如代码清单 10-31 所示。

代码清单 10-31invokeWithinTransaction （2）

1....

TransactionAttributeSource tas = getTransactionAttributeSource （）；

final TransactionAttribute txAttr = （tas ！= null

？tas.getTransactionAttribute （method,targetClass）：nu11）；

final TransactionManager tm = determineTransactionManager （txAttr）；

protected TransactionManager determineTransactionManager（@Nullable TransactionAttribute txAttr） ｛

1/ 不触发的部分⼰省略

else｛

TransactionManager defaultrransactionManager = getTransactionManager（）；

iE （defaultTransactionManager == nul1）｛

defaultTransactionManager = this.transactionManagerCache

• get （DEFAULT_TRANSACTION_MANAGER_KEY）；

i£ （defaultTransactionManager == nul1） ｛

defaultTransactionManager = this.beanFactory.getBean （TransactionManager.class）；

this.transactionManagerCache.putIfAbsent （

舌（本书不对响应式事务展开讨论，故跳过）。

也完全遵循该流程实现。

【第10章 Spring Boot 整合 JDBC

return defaultTransactionManager；

DEFAULT_TRANSACTION_MANAGER_KEY, defaultrransactionManager）：

Debug ⾄此处，可以从 BeanFactory 中成功获取到基于数据源的 DataSource

TransactionManager，如图10-6所示。

鐵 defaultTransactionManager = （DataSource TransactionManager@3927）

> （dataSource = （HikariDataSource@3928）.. toString（）


## 1 enforceReadOnly = false

图 10-6 从 BeanFactory 中获取到的事务管理器

3. 响应式事务管理器的处理

下⼀部分源码针对响应式事务，如代码清单10-32 所示。Spring Framework 5.2版本之后引

入了响应式事务的概念，所以源码中有响应式事务管理器的判断和处理，如代码清单 10-32所


## 1 代码清单 10-32 invokeWithinTransaction （3）

if （this.reactiveAdapterRegistry ！= nul1 && tm instanceof ReactiveTransactionManager）｛

ReactiveTransactionSupport txSupport = transactionSupportCache.computeIfAbsent（method,key ->1

1/ kotlin ….

ReactiveAdapter adapter = this.reactiveAdapterRegistry.getAdapter （method.getReturn Type （））；

if （adapter == nul1） ｛

1/ throw ex ⋯.

return new ReactiverransactionSupport （adapter）；

｝）；

return txSupport.invokeWithinrransaction（

method,targetClass,invocation,txAttr，（ReactiveTransactionManager）tm）；

1.…..

4. 事务控制核心

下⾯的部分是事务控制的核心源码。通过代码清单 10-33可以看出，注解声明式事务的核

心是⼀个环绕通知。这部分核心源码的动作有4步：开启事务、执⾏ Service 方法、遇到异常

就回滚事务和没有异常就提交事务。这个步骤对于原⽣JDBC事务同样适用，Spring Framework

代码清单 10-33 invokeWithinTransaction （4）

PlatformTransactionManager ptm = asPlatformTransactionManager （tm）；

Einal String joinpointIdentification = methodIdentification（method, targetClass,txAttr）；

if（txAttr == nul1 II ！（ptm instanceof CallbackPreferringPlatformrransactionManager））｛

// 1. 开启事务

下⾯通过整合项目中的正常执⾏代码以及抛出异常的代码分别测试事务的成功提交与失败回滚。


## 10.4 声明式事务的控制全流程I

object retval；

try｛

1/ 2. 环绕通知执⾏ Service 方法

retVal = invocation.proceedithInvocation （）；

｝ catch（Throwable ex）｛

// 3. 捕获到异常，回滚事务

completerransactionAfterThrowing （txInfo,ex）；

throw ex；

｝ Einally ｛

cleanupTransactionInfo （txInfo）；

｝

1/ 4. Service 方法执⾏成功，提交事务

commitTransactionAfterReturning （txInfo）；

return retVal；

1/ 下⾯的逻辑基本⼀致，不再展开⋯⋯•

（1）成功的事务提交

以当前的代码继续 Debug，当执⾏完 createTransactionIfNecessary 方法后，观察

txInfo 的属性，如图10-7所示。此时事务的定义信息、事务的状态已经封装完毕，completed

属性为false。

事务开启后，由于 Userservice 的代码可以正常执⾏，会触发下⾯的 commit

TransactionAfterReturning 方法提交事务。提交事务的逻辑是获取到事务管理器后执⾏

提交逻辑。注意，事务管理器的commit 方法并不会直接提交，⽽是会先进⾏⼀些异常情况的

检查，确保⽆误后再执⾏ processCommit 方法提交事务，如代码清单 10-34所示。

txinfo = ｛TransactionAspectSupport$Transactioninfo@4140｝..toStringO

>f transactionManager = （DataSourceTransactionManager@3917）

>f transactionAttribute = （TransactionAspectSupport$1@4141）.. toString0

> joinpointidentification = "com.linkedbear.springboot.service.UserService.test"

f transactionStatus = ｛DefaultTransactionStatus@4142）

>f transaction = ｛DataSourceTransactionManager$DataSourceTransactionObject@4143｝

f newTransaction = true

f newSynchronization = true

f readOnly = false

f debug = false

f suspendedResources = null

f rollbackOnly = false

f completed = false

f savepoint= null

f oldTransactionlnfo = null

图 10-7 开启事务后的 TransactionInfo

I第10章 Spring Boot 整合JDBC

1代码清单10-34 调用事务管理器提交事务

Protected void commitTransactionAfterReturning （Nullable TransactionInfo txInfo） ｛

iE（txInfo ！= nu11 && txInfo.getrransactionstatus （）！= nu11）｛

txInfo.getTransactionManager （）.commit （txInfo.getTransactionstatus（））；

// AbstractPlatformTransactionManager

public final void comnit （Transactionstatus status）throws rransactionBxception ｛

// 如果事务已经完成，则⽆法提交，抛出异常

if （status.iscompleted（））｛

1/ throw ex •••

Defaultrransactionstatus defStatus = （Defaultrransactionstatus）status；


## 11 如果事务已被标记为需要回滚，则回滚事务

i£ （defstatus.isLocalRol1backonly（））｛

processRoL1back （defStatus, false）；

return；


## 11 全局事务的回滚标识判断（JTA）⋯

1/正常的待提交事务可以执⾏提交

processCommit （defStatus）；

提交事务的 processComit 方法内部实现⽐较复杂，代码清单 10-35 中只列举了最关键

的⼏⾏源码，整个方法的核心提交动作是⼀个以 do开头的docommit 方法，这个方法的实现

在落地实现类 DataSourceTransactionManager 中，它会获取到原⽣ JDBC的Connection，

执⾏ commit方法完成事务提交。⾄此就可以看到Spring Framework 封装的事务抽象在底层操

控原⽣ JDBC的核心实现。

代码清单 10-35 提交事务的底层核心源码

private void processCommit （DefaultTransactionstatus status） throws rransactionException ｛

if （status.hasSavepoint （））｛

// 如果当前事务存在保存点，则处理保存点的逻辑

1/ 对于新事务，直接提交事务即可

else if（status.isNewTransaction（））｛

unexpectedRol1back = status.isGlobalRo11backOnly （）；

doCommit （status）；


@Override

protected void doCommit （Defaultrransactionstatus status） ｛

DataSourceTransactionobject txobject =

（DataSourceTransactionobject）status.getrransaction（）；

Connection con = txObject.getConnectionHolder（）•getConnection（）；

try｛

根据抛出异常类型和事务定义信息决定是否回滚事务


## 10.4 声明式事务的控制全流程I

con.commit （）；

｝// catch

（2）异常的事务回滚

如果需要测试异常的事务回滚，需要在 UserService 的test 方法中人为构造⼀个异常

（如使用int i=1/ 0；构造除零异常），并在invokewithTransaction 方法的try-catch

块中调用 completeTransactionAfterThrowing 方法处打断点，之后重新 Debug 执⾏

SpringBootJdbcApPlication。等程序运⾏⾄ completeTransactionAfterThrowing

方法即将调用时，除零异常已经抛出，如代码清单10-36所示。

1代码清单10-36 打断点的位置是下⾯的 catch部分

try｛

1/ 2. 环绕通知执⾏ Service 方法

retVal = invocation .proceedWithInvocation （）；

） catch （Throwable ex）！

// 3. 捕获到异常，回滚事务

completeTransactionAfterThrowing（txInfo,ex）；

throw ex；

此时 Debug 的状态中，Transactionstatus 中已经封装了异常信息，如图10-8所示。

txinfo = ｛TransactionAspectSupport$Transactioninfo@4172）..tostring0

>transactionManager = （DataSourceTransactionManager @4170）

•transactionAttrbute =.ransactonAspectsupport$1@4180.totmg0

>《joinpointidentification = "com.linkedbear.springboot.service.UserService.test"

oldTransactioninfo = null

> detaillMessage ="/ by zero*

cause = fnwmeactxcepuon4s.sa300

stackTrace = （StackTraceElement［13］@4186）

suppressedExceptions = （CollectionssunmodifiableRandomAccessList@4187｝ size =0

图 10-8 触发异常时异常信息已被捕获并记录

狭取到异常后，底层会根据异常类型决定是否回滚异常。默认情况下erransactional

注解控制回滚的异常类型包括Error 和 RuntimeException，对于普通的Exception，默

认策略不会回滚，⽽是选择继续提交事务，如代码清单 10-37所舌。这也提舌读者在日常开发

中，给方法标注@rransactiona1 注解时⼀定要显式地声明事务回滚的异常类型。

代码清单 10-37

protected void completeTransactionAfterThrowing （@Nullable TransactionInfo txInfo, Throwable ex）｛

i£（txInfo ！= null && txInfo.getTransactionStatus （） ！= nul1）｛

// logger

// 如果当前异常在回滚范围之内，则会调用事务管理器，回滚事务

i（txInfo.transactionAttribute ！= null && txInfo.transactionAttribute.rollbackon （ex））｛

try｛

txInfo.getTransactionManager（）.rollback （txInfo.getTransactionstatus （））；

｝1/ catch ⋯

｝ else ｛

|第10章 Spring Boot 整合 JDBC

1/ 如果不在回滚范围内，则依然会提交事务

try｛

txInfo.getTransactionManager（）.commit （txInfo.getTransactionStatus （））；

｝// catch .....

//默认的事务回滚捕获异常类型

public boolean rollbackon（Throwable ex）｛

return （ex instanceof RuntimeExceptionl | ex instanceof ErrOr）；

由于测试代码 UserService 中标注的@rransactiona1 注解已经显式声明了 rol1back

For=Exception.class，故此处可以正常回滚事务，⽽回滚事务时底层也有⼀些简单的判断，

在判断⽆异常时最终依然调用 DataSourceTransactionanager 的方法，不过这⾥调用的

是doRollback 方法，它的实现方式与 doComit 方法如出⼀辙，都是获取到原⽣JDBC的

Connection 后执⾏提交/回滚动作，如代码清单10-38所示。

代码清单 10-38 回滚的底层源码逻辑

public final void rollback（TransactionStatus status） throws TransactionException ｛

1/ 如果事务已经完成，则⽆法继续回滚

iE （status.isCompleted （））｛

// throw ex ⋯..

DefaultTransactionStatus defStatus = （DefaultrransactionStatus）status；

1/ 回滚事务

processRo11back（defStatus, false）；

Private void processRollback （Defaultrransactionstatus status, boolean unexpected）｛

try｛

1/ 如果存在保存点，则直接回滚到保存点位置

if （status.hasSavepoint （））｛

status.rollbackToHeldSavepoint （）；

1/ 对于新事务，直接回滚

else if （status.isNewTransaction（））｛

doRo11back （status）；

11…….

@override

protected void doRollback（DefaultTransactionstatus status） ｛

DataSourceTransactionobject txObject =

（DataSourceTransactionObject）status.getrransaction（）；

Connection con = txobject .getConnectionHolder（）.getConnection （）；

try｛

con.rollback （）；

⾄此，整个事务控制全流程执⾏完毕，底层的控制原理也完整介绍了⼀遍。建议读者实际

事务传播⾏为指的是外层事务传播到内层事务后内层事务做出的⾏为（持有的态度）。实际

传播⾏为 含义

如果当前没有事务运⾏，则会开启⼀个新的事务；如果当前已经有事务运

⾏，则方法会运⾏在当前事务中


## 10.5 声明式事务的传播⾏为控制|

｝// catch. ••.

⾄此，昇常的事务回滚也测试完成。

5. 事务执⾏的后处理

⽆论是事务的提交还是回滚，在整个方法的最后都要执⾏⼀个 cleanupAfter

Completion 方法，这个方法用来清除整个事务执⾏过程中所需的ConnectionHo1der 等组

件以及解除线程中同步的事务信息，如代码清单 10-39所示。CleanupAfterCompletion 方

法中的前两个 if结构都是与组件资源清除相关的工作，逻辑⽐较简单，感兴趣的读者可以⾃⾏

深入研究；最后⼀个i结构中有⼀个resume的动作，它的作用是释放挂起的事务，这个逻辑

在10.5节会讲到。

代码清单 10-39 invokeWithinTransaction （5）


finally ｛

cleanupAfterCompletion （status）；

private void cleanupAfterCompletion（DefaultTransactionStatus status）｛

status.setCompleted （）；

i （status.isNewSynchronization（））｛

TransactionSynchronizationManager.clear（）；

i£ （status.isNewTransaction （））｛

doCleanupAfterCompletion （status.getTransaction （））；

if （status.getsuspendedResources （）！= nul1） ｛

// logger……..

Object transaction = （status.hasTransaction（）？ status.getTransaction（）：nu11）；

resume （transaction，（SuspendedResourcesHolder） status.getSuspendedResources（））；

动⼿结合代码 Debug 跟进⼏遍逻辑，以加深印象。


## 10.5 声明式事务的传播⾏为控制

的项目开发中难免会出现 Service 之间嵌套的场景，Spring Framework 通过事务传播⾏为可以控

制⼀个 Service 中的事务传播到另⼀个 Service 方法中的方式。Spring Framework 中定义了7种

传播⾏为，如表10-1所舌。

表 10-1

PROPAGATION_REQUIRED：必需的

Spring Framework 中定义的事务传播⾏为

事务

不⽀持

续表

含义

如果当前没有事务运⾏，则会开启⼀个新的事务；如果当前已经有事务运

⾏，则会将原事务挂起（暂停），重新开启⼀个新的事务。当新的事务运

⾏完毕后，再将原来的事务释放

如果当前有事务运⾏，则方法会运⾏在当前事务中；如果当前没有事务运

⾏，则不会创建新的事务（即不运⾏在事务中）

如果当前有事务运⾏，则会将该事务挂起（暂停）；如果当前没有事务运

⾏，则方法也不会运⾏在事务中

当前方法必须运⾏在事务中，如果没有事务，则抛出异常

当前方法不允许运⾏在事务中，如果当前已经有事务运⾏，则抛出异常

如果当前没有事务运⾏，则开启⼀个新的事务；如果当前已经有事务运⾏，

则会记录⼀个保存点，并继续运⾏在当前事务中。如果子事务运⾏中出现

异常，则不会全部回滚，⽽是回滚到上⼀个保存点

@Service

@Autowired

｝

|第10章 Spring Boot 整合JDBC

传播⾏为

PROPAGATION_REQUIRES_NEW ：新

PROPAGATION_SUPPORTS： ⽀持

PROPAGATION_NOT_SUPPORTED：

PROPAGATION MANDATORY：强制

PROPAGATION_NEVER：不允许

PROPAGATION_NESTED：嵌套

提舌：本书不会讲解全部事务传播⾏为，⽽是选择最常见的 PROPAGATION_REQUIRED、⽐较有

研究价值的 PROPAGATION_REQUIRES_NEW 讲解，对于⽐较简单的传播⾏为，在剖析

PROPAGATION_REOUIRED 传播⾏为时会⼀并讲解。


## 10.5.1 修改测试代码

为了演舌事务传播⾏为在不同 Service 之间嵌套的效果，下⾯在舌例项目中创建⼀个新的

DeptService，并使其依赖 UserService，如代码清单 10-40所示。

1代码清单 10-40 DeptService 用于测试事务传播⾏为

public class DeptService ｛

private UserService userService；

@Transactional （ro11backFor = Exception.class）

public void save （）｛

system.out.printIn（"DeptService save run ...."）；

userService.test （）；

随后修改 SpringBootJdbcApplication的main 方法，从IOC 容器中获取 DeptService

并调用其 save 方法，如代码清单 10-41所舌。

【代码清单 10-41 获取 DeptService 触发事务控制

public static void main （String［］ args） ｛

ApplicationContext ctx = SpringApplication.run （SpringBootJdbcApplication.class, args）；

DeptService deptService = ctx.getBean （DeptService.class）；

deptService.save （）；

方法有两个核心动作：根据事务定义信息获取事务状态，以及获取事务状态后的事务信息构建，


## 10.5 声明式事务的传播⾏为控制！


## 10.5.2 PROPAGATION_REQUIRED

默认情况下，标注@Transactional注解对应的事务传播⾏为是 PROPAGATION_

REQUIRED，这种传播⾏为的特征是执⾏ Service 方法时必定确保事务的开启，⽽创建事务的位

置是 10.4节中提到的 createTransactionIfNecessary 方法，如代码清单10-42 所示。

1代码清单 10-42 创建/获取事务的核心动作 createTransactionlfNecessary

PlatformTransactionManager ptm = asPlatformTransactionManager （tm）；

finalString joinpointIdentification = methodIdentification （method, targetClass,txAttr）；

if （txAttr == nu11 || ！（ptm instanceof CallbackPreferringPlatformTransactionManager））｛

// 此处会创建/获取事务

TransactionInfo txInfo = createTransactionlfNecessary（ptm, txAttr，

joinpointIdentification）；

Object retVal；

try｛

retVal = invocation.proceedWithInvocation （）；

本节的研究重点是 createTransactionIfNecessary方法中底层逻辑⾯对事务的不同

传播⾏时会如何进⾏处理。进入 createTransactionIfNecessary 方法，可以发现整个

如代码清单 10-43所示。下⾯分别深入研究。

代码清单 10-43 createTransactionlfNecessary 的方法实现

protected TransactionInfo createrransactionIfNecessary（

@Nullable PlatformTransactionManager tm，

@Nullable TransactionAttribute txAttr, final String joinpointIdentification）｛

// 如果事务定义中没有 name，则将方法名作为事务定义标识名

if（txAttr ！= null && txAttr.getName（）== nul1）｛

txAttr = new DelegatingTransactionAttribute （txAttr）｛

@override

Public String getName （）｛

return joinpointIdentification；

｝；

TransactionStatus status = null；

i£（txAttr！= null）｛

if （tm ！= nul1）｛

// 获取事务定义信息对应的事务状态

status = tm.getTransaction （txAttr）；

｝ 1/ else logger ••

// 构建事务信息

return prepareTransactionInfo（tm,txAttr, joinpointIdentification,status）；

阅读和理解源码，本节将其拆分为多个⽚段讲解。

1第10章 Spring Boot 整合JDBC

1. tm.getTransaction

事务管理器的 getTransaction 方法定义在 DataSourceTransactionManager 的⽗

类 AbstractPlatformTransactionManager 中，这个方法篇幅略⻓，为便于读者更好地

（1） doGetTransaction

getTransaction 方法依然是⼀个需要转调 do开头的 doGetTransaction 方法，⽽

doGetTransaction 方法本身是⼀个模板方法，它的实现⼜要回到 DataSourceTran

saction Manager 中。从代码清单10-44 的下半部分来看，即使大部分API 都是陌⽣的，整

体思路也⽐较清晰：doGetTransaction 方法会创建并返回⼀个 DataSourceTransaction

Object，其中包含⼀个 Connection 对象。ConnectionHolder 的设计⽐较类似于

BeanDefinition 的持有者 BeanDefinitionHolder，它们的本质都是内部组合了⼀个对象。

1代码清单 10-44 getTransaction （1）

Public final TransactionStatus getTransaction （@Nullable TransactionDefinition definition）

throws TransactionException｛

TransactionDefinition def = （definition l= mull

？ definition : TransactionDefinition.withDefaults （））；

Object transaction = doGetTransaction （）；

protected Object doGetTransaction（）｛

DataSourceTransactionobject txObject = new DataSourceTransactionObject （）；

txObject .setSavepointA11owed （isNestedTransactionA11owed （））；

ConnectionHolder conHolder =（ConnectionHolder）TransactionSynchronizationManager

•getResource （obtainDataSource （））；

txObject.setConnectionHolder （conHolder,false）；

return txobject；

doGetTransaction 方法执⾏完毕后，可以简单地理解为返回了⼀个Connection对象。

（2） 传播⾏为处理（1）

紧接着的if结构看似简单，实际上这个 handleExistingTransaction 方法大有作，

它⾥⾯的处理逻辑很复杂，都是当外部事务已经存在时的处理逻辑，如代码清单 10-45所舌。

1代码清单 10-45 getTransaction （2）

if（isExistingTransaction （transaction））｛

return handleExistingTransaction（def,transaction,debugEnabled）；

1...

具体的传播⾏为如何处理，在下⾯再展开讲解。

（3）超时检测

接着的 if结构实际上是校验@Transactional注解中的timeout 属性，如代码清

⼏种情况，即使没有显式列举其他传播⾏为，也可以推断出来，除去上⾯列举的4种传播⾏为，

有任何多余逻辑执⾏。

要开启⼀个新的事务。


## 10.5 声明式事务的传播⾏为控制|

单10-46所示。Spring Framework ⽀持的事务模型可以设置事务方法最⻓执⾏时间，如果在

Service 方法中标注的eTransactiona1 注解显式设置了timeout 的最⻓耗时，则当方法

执⾏时间过⻓时会由底层抛出异常。默认情况下 timeout 的值是-1，表示不限制事务方法

执⾏时间，但如果显式设置的timeout 值⽐-1小，说明设置的值本身不合理，底层也会

抛出异常。

1代码清单 10-46 getTransaction （3）

if （def.getTimeout （）< TransactionDefinition.TIMEOUT_DEFAULT）

throv ex

（4）传播⾏为处理（2）

getrransaction 方法的最后⼀个⽚段中，可以看到部分事务传播⾏为的处理逻辑，如

代码清单 10-47所示。请注意，如果程序进入该部分源码，说明线程中没有开启事务，此时如

果方法的事务定义信息配置的传播⾏为是 MANDATORY，则直接抛出异常；如果传播⾏为配置

了 REQUIRED、REQUIRES_NEW 或 NESTED，则会直接开启⼀个新的事务；如果是最后的

还剩下3种：SUPPORTS、NOT_SUPPORTED 和 NEVER，它们都可以在没有事务的情况下

运⾏。如果代码运⾏⾄此处，说明目前的确没有事务，⽆须做任何处理，因此 else 部分中不会

代码清单 10-47 getTransaction （4）

1/ 当前没有事务-＞检查传播⾏为以决定如何向下执⾏

i£ （def.getPropagationBehavior（）== TransactionDefinition.PROPAGATION_MANDATORY）！

throw ex....

｝ else if （def.getPropagationBehavior（）== TransactionDefinition.PROPAGATION_REQUIRED

I def.getPropagationBehavior（）=- TransactionDefinition.PROPAGATION_REQUIRES_NEW

I def.getPropagationBehavior（）== TransactionDefinition.PROPAGATION_NESTED）｛

SuspendedResourcesHolder suspendedResources = suspend （nul1）；

try｛

return startTransaction（def,transaction,debugEnabled,suspendedResources）；

｝ 1/ catch

｝ else｛

boolean newSynchronization = （getTransactionSynchroni zation （）-= SYNCHRONIZATION_ ALMAYS）；

return prepareTransactionStatus （def,null,true,newSynchronization，

debugEnabled,null）；

实际 Debug ⾄此处，程序会进人 else-if 分⽀，如图10-9所示。不难理解，此时线程中没

有事务，⽽ DeptService 的 save 方法中事务传播⾏为是默认的 REQUIRED，所以此处需

return status；

I第10章 Spring Boot 整合JDBC

else if （def.getPropagationBehavior（） == TransactionDefinition.PROPAGATION_ REQUIRED |I

def.getPropagationBehavior（）== TransactionDefinition.PROPAGATION_ REQUIRES_NEW |I

det.getPropagationBehavior（） == TransactionDetinition.PROPAGATION_NESTED）

SuspendedResourcesHolder suspendedResources = suspend（null）； suspendedResources: nule

1t（ceougtnablea）t.

tartTransaction（def, transection, debugEnabled, suspendedResources）a

catch （RuntimeException | Error ex） ｛

图 10-9 DeptService 的save 方法执⾏时进入 else-if 块

下⾯继续深入开启事务的startTransaction 方法。

2. startTransaction：开启事务

从代码清单 10-48中可以发现⼀个特别显眼的方法 doBegin。根据探究前⾯源码的经验，

想必读者可以马上反应过来，这个方法就是开启事务的核心逻辑，如代码清单 10-48所舌。

【代码清单 10-48 startTransaction 开启⼀个新的事务

Private TransactionStatus startTransaction（TransactionDefinition definition，

Object transaction,boolean debugEnabled，

@Nullable SuspendedResourcesHolder suspendedResources）｛

boolean newSynchronization- （getTransactionsynchronization （）！= SYNCHRONIZATION_ NEVER）；

aobegin（transactlon, detin1tlon）：

preparesynchronization（status, definition）；

进入doBegin 方法中可以发现源码篇幅很⻓，代码清单10-49中只截取最吸引各位的⼀段，

可以发现doBegin 方法中的主要工作是从 DatasourceTransactionobject 内部组合的

ConnectionHolder 中提取出真正的Connection对象，随后执⾏ setAutoCommit （false）

方法关闭⾃动提交，即开启事务，由此可以了解到原⽣JDBC事务开启的位置。

代码清单 10-49 doBegin 开启事务的核心

eoverride

protected void doBegin （Object transaction,TransactionDefinition definition） ｛

txObject.getConnectionHolder（）.setSynchronizedWithTransaction （true）；

1/ 荻取到真正的 Connection 对象

con = txObject.getConnectionHolder（）•getConnection（）；

if （con.getAutoCommit （））｛

txObject.setMustRestoreAutoCommit （true）；

1/ 开启事务

con.setAutoCommit （false）；

TransactionInterceptor，⽽调用逻辑还是之前的那些环节，为了快速定位到事务传播⾏

作，逐⼀来看。


## 10.5 声明式事务的传播⾏为控制I

3. prepareTransactionlnfo

从事务管理器中获取到 Transactionstatus 后，下⼀步要执⾏的是 prepare

TransactionInfo 方法，⽽这个方法仅创建⼀个 TransactionInfo，把事务状态信息放人

其中，并将其绑定到当前线程中，如代码清单10-50所舌。当创建 TransactionInfo 并返回

之后，整个 createTransactionIfNecessary 方法执⾏完毕，事务也就开启了。

1代码清单 10-50 prepareTransactionlnfo 封装事务状态信息到当前线程中

if （tm ！= null）｛

status = tm.getTransaction （txAttr）；

｝ // else logger ⋯

return prepareTransactionInfo（tm,txAttr, joinpointIdentification,status）；

protected TransactionInfo prepareTransactionInfo （@Nullable PlatformTransactionManager tm，

@Nullable TransactionAttribute txAttr,String joinpointIdentification，

@Nullable TransactionStatus status） ｛

rransactionInfo txInfo = new TransactionInfo（tm,txAttr,joinpointIdentification）；

if（txAttr ！= null）｛

txInfo.newTransactionStatus （status）；

｝ // else logger

txInfo.bindTorhread（）；

return txInfo：

4. UserService.test

DeptService#save 方法的事务开启之后，它的内部会调用 UserService 的 test 方

法，由于 userService 也是被 AOP 代理过的代理对象，在调用 test 方法时会再次进人

为的部分，这⾥直接进入 tm.getTransaction->doGetTransacation 的步骤。由于此时

线程中已存在事务，因此 doGetTransacation 方法中的这个 if 分⽀会触发进入，如代码清

单10-51所舌。

1代码清单 10-51 UserService 的 test 方法执⾏时线程中已有事务

if （isExistingTransaction （transaction））｛

// 当前没有事务->检查传播⾏为以决定如何向下执⾏

return handleExistingrransaction （def,transaction,debugEnabled）；

5. handleExistingTransaction

handleixistingrransaction 方法中的所有分⽀均为事务传播⾏为的判断与⾏为动

（1） NEVER 的处理

对于 NEVER 的传播⾏为，要求线程中不能有事务，所以如果线程中检测到事务，则抛出

异常，如代码清单 10-52 所舌。

的外层事务。除此之外，从源码中可以发现，如果新事务抛出异常，会恢复之前的外层事务。

对于 NESTED 嵌套事务的处理，除了需要允许嵌套事务在程序中启用，还需要连接的数据

库⽀持基于保存点的嵌套事务。如果这两个条件都成⽴，则会创建保存点，否则会降级为

【第10章 Spring Boot 整合 JDBC

代码清单 10-52 NEVER 的处理

private TransactionStatus handleExistingTransaction （TransactionDefinition definition，

object transaction,boolean debugBnabled）throws TransactionBxception ｛

i£ （definition.getPropagationBehavior（）=- TransactionDefinition.PROPAGATION_NEVER）1

throw ex•.

（2） NOT_SUPPORTED 的处理

对于NOT_SUPPORTED 的传播⾏为，要求方法执⾏不在事务中，所以此处会把当前事务

挂起，并执⾏目标方法，如代码清单 10-53所示。

1代码清单 10-53 NOT_SUPPORTED 的处理

iE （definition.getPropagationBehavior（）=- TransactionDefinition.PROPAGATION_NOT_SUPPORTED） ！


## 11 logger ⋯

1/ 挂起当前事务

Object suspendedResources = suspend （transaction）；

boolean newsynchronization = （getTransactionsynchroni zation （）=- SYNCHRONIZATION_ALWAYS）；

return prepareTransactionstatus （

definition,nu1l,false,newSynchronization,debugEnabled, suspendedResources）；

（3）REQUIRES_NEW 的处理

对于 REQUIRES_NEW 的传播⾏为，会开启⼀个新的事务，不过在此之前还要挂起已有


## 1 代码清单 10-54 REQUIRES_NEW 的处理


iE （definition.getPropagationBehavior（）== TransactionDefinition.PROPAGATION_REQUIRES_NEW） ｛

// logger…..

// 挂起当前外层事务

SuspendedResourcesHolder suspendedResources = suspend （transaction）；

try｛

1/ 开启⼀个全新的事务

return startTransaction （definition,transaction, debugEnabled,suspendedResources）；

｝ catch（RuntimeException | Error beginEx）｛

1/ 还原外层事务

resumeAfterBeginException （transaction,suspendedResources,beginEx）；

throw beginEx；

（4） NESTED 的处理

由上述两部分传播⾏为的源码分析，想必读者应该对大部分传播⾏为的底层逻辑有了⼀个


## 10.5 声明式事务的传播⾏为控制！

REQUIRES_NEW 的传播⾏为，开启⼀个全新的事务，如代码清单 10-55所示。

【代码清单 10-55 NESTED 的处理

if （definition.getPropagationBehavior（） == rransactionDefinition. PROPAGATION_NESTED）1

1/ 检查是否允许嵌套事务

i（！isNestedTransactionA11owed（））｛

throw ex

1/ logger ⋯...

// 判断是否⽀持保存点

i （useSavepointForNestedTransaction （））｛

Defaultrransactionstatus status = prepareTransactionstatus （definition，

transaction, false,false, debugBnabled, nu11）；

status.createAndHoldSavepoint （）；

return status；

｝ else｛

return startTransaction（definition, transaction,debugEnabled, nu11）；

（5） SUPPORTS&REQUIRED

最后的部分是处理 REQUIRED 和 SUPPORTS 的逻辑。由于 isValidateExisting

nransaction（）方法在默认情况下返回false，因此不会进入中间的i结构，⽽最后的两⾏

源码仅是把现有的事务信息封装并返回，没有任何额外的逻辑，如代码清单 10-56所示。

代码清单 10-56 SUPPORTS&REQUIRED 的处理

// Assumably PROPAGATION_SUPPORTS Or PROPAGATION_REQUIRED.

if （isValidateExistingTransaction（））｛

boolean newSynchronization =（getTransactionSynchronization（）！= SYNCHRONIZATION_NEVER） ；

return prepareTransactionstatus （definition,transaction,false，

newSynchronization,debugEnabled, nul1）；

大概的认识。下⾯再着重研究 PROPAGATION_REQUIRES_NEW 的传播⾏为。


## 10.5.3 PROPAGATION_REQUIRES_NEW

将UserService的test 方法上的enransactiona1 注解事务传播⾏为改为 REQUIRES_

NEW，并重新 Debug 测试。由上⾯的分析可知，REQUIRES_NEW 会在 handleExisting

Transaction 方法中暂停并检查，如代码清单 10-57所示。

代码清单 10-57 检查 PROPAGATION_REQUIRES_NEW

/…...

iE （definition.getPropagationBehavior （） == TransactionDefinition.PROPAGATION_REQUIRES_NEW）1

// logger..•..•

看似只是简单地开启和处理新事务，实际上⾥⾯有⼏个需要注意的细节，下⾯逐⼀讲解。

新事务在创建之前会将外层的原事务挂起，挂起的逻辑中有⼀个细节值得关注，如代码清

|第10章 Spring Boot 整合 JDBC

1/ 挂起当前外层事务

SuspendedResourcesHolder suspendedResources = suspend （transaction）；

try｛

// 开启⼀个全新的事务

return startTransaction（definition,transaction, debugEnabled, suspendedResources）；

｝// catch 还原外层事务 throw ex ⋯•..

1.新事务的创建细节

单 10-58所示。仔细观察源码中的两⾏注释，标注的都是 dosuspend 方法，这就意味着真正

挂起的动作在 doSuspend 方法中。

代码清单 10-58 suspend 方法转调 doSuspend 方法

protected final SuspendedResourcesHolder suspend（@NullableObject transaction）

throws LransactiontxceptionL

i£（TransactionSynchronizationManager.isSynchronizationActive （））｛

List<TransactionSynchronization> suspendedSynchronizations =

dosuspendSynchronization （）；

try｛

Object suspendedResources = null；

i （transaction ！= mu11）｛

1/ 注意此处：dosuspend

suspendedResources = doSuspend （transaction）；

1…….

｝ catch（RuntimeException |Error ex）｛

// dosuspend failed - original transaction is still active...

doResumeSynchronization （suspendedsynchronizations）；

throw ex；

｝ else if（transaction ！= null）｛


## 11 Transaction active but no synchronization active.


## 11 注意此处：dosuspend

object suspendedResources =doSuspend （transaction）；

return new suspendedResourcesHolder （suspendedResources）；

｝ // else return nul1

由于 doxxx 方法⼀般都是模板方法，具体的实现需要最终的落地实现类，从

DataSourceTransactionManager 中可以找到doSuspend 方法的实现，如代码清单10-59

所示。方法的具体逻辑是移除 DataSourceTransactionobject 中的 Connection 对象，

并且解除TransactionSynchronizationManager 中的数据源绑定。

代码清单 10-59 DataSourceTransactionManager 中 doSuspend 方法的实现

@override

Protected Object doSuspend （Object transaction） ｛

DataSourceTransactionobject txobject =（DataSourceTransactionObject）transaction：

txObject.setConnectionHolder （nu11） ；

对象会在下⾯的两个环节发挥作用。

时可以获得事务状态信息，从中提取出被挂起的事务，然后继续恢复外层事务。

如果读者没有⽴即理解也不要紧张，下⾯⻢上讲解。


## 10.5 声明式事务的传播⾏为控制|

return TransactionSynchroni zationManager .unbindResource （obtainDataSource （））；

实际Debug时可以发现，解绑之后返回的是组合了 Connection 的ConnectionHolder，

如图10-10所示。

Object suspendedResources = null； suspendedResources: ConnectionHolder@2950

1f （transaction ！= null）｛

suspendedResources = doSuspend（transaction）；suspendedResources:connectionHolder@2950

图 10-10 解除绑定后返回的是 ConnectionHolder

随后回到上⾯的suspend 方法中，注意观察最后方法的返回值，它将 ConnectionHolder

包装为⼀个 SuspendedResourcesHolder 之后返回，这个 SuspendedResourcesHolder

2. 开启事务的细节

注意观察代码清单 10-60中执⾏的 startTransaction 方法中参数列表的最后⼀个参数，

上⼀步返回的 SuspendedResourcesHolder 对象会在此处被⼀并传人，并且存人 Tran

sactionStatus 中。这样做的目的是，当内层新事务执⾏完成后清理相关的线程同步等信息

代码清单 10-60 startTransaction 方法的参数中包含 SuspendedResourcesHolder

private TransactionStatus startTransaction （TransactionDefinition definition,Object transaction，

boolean debugEnabled，@Nullable SuspendedResourcesHolder suspendedResources）｛

boolean newSynchronization = （getTransactionSynchronization （）！= SYNCHRONIZATTON_NEVER）；

DefaultTransactionstatus status = newTransactionstatus （definition，

transaction,true,newSynchronization,debugEnabled, suspendedResources） ；

doBegin （transaction,definition）；

preparesynchronization （status, definition）；

return status；

3. 内层新事务执⾏完成后的细节

当事务执⾏完成之后，会执⾏ cleanupAfterCompletion 方法，以清除其中的线程同

步信息等，如代码清单10-61 所示。

代码清单 10-61 cleanupAfterCompletion 方法清除信息

private void cleanupAfterCompletion （DefaultTransactionStatus status） ｛

status.setCompleted（）；

i£ （status.isNewSynchronization（））｛

TransactionSynchronizationManager.clear（）；

i£ （status.isNewTransaction（））｛

doCleanupAftercompletion （status.getTransaction （））；

if（status.getSuspendedResources（）！= mul1）｛

【第10章 Spring Boot 整合JDBC

1/ logger ⋯.

Object transaction =（status.hasTransaction（）？status.getrransaction（）：null）；

resume （transaction，（SuspendedResourcesHolder）status.getSuspendedResources （））；

注意观察最下⾯的i部分，这个动作是恢复挂起事务的核心动作，10.4 节中未展开，此处

展开解读⼀下源码的核心内容，如代码清单10-62 所示。resume 方法的逻辑⾮常像前⾯ suspend

方法的逆动作，上⾯的doResume 方法对应 suspend 中的doSuspend 方法，下⾯的set 动作

对应 suspend 中的 set（nu11）。另外，doResume 方法的逻辑更为简单，且刚好跟代码清单

10-59⼀样，⼀个是bindResource，另⼀个是 unbindResource。

】代码清单 10-62 resume 释放事务

Protected final void resume （@Nullable Object transaction，

@Nullable suspendedResourcesHolder resourcesHolder）throws TransactionException ｛

O］ect suspendeakesources = resourceshoLaer.suspendeokesources：

doResume （transaction,suspendedResources）；

List<rransactionSynchronization>suspendedSynchronizations =

resourcesHolder.suspendedSynchronizations；

if（suspendedSynchronizations ！= nul1） ｛

TransactionSynchronizationManager.setActualTransactionActive （

resourcesHolder.wasActive）；

TransactionsynchronizationManager.setCurrentrransactionIsolationLevel （

resourcesHolder.isolationLevel）；

TransactionsynchronizationManager.setCurrentTransactionReadonly（

resourcesHolder.readOnly）；

TransactionSynchronizationManager.setCurrentTransactionName （resourcesHolder.name）；

doResumeSynchronization （suspendedSynchronizations）；

protected void doResume （@Nullable Object transaction, Object suspendedResources）｛

TransactionSynchronizationManager.bindResource （obtainDataSource （），suspendedResources）；

等resume 方法执⾏完毕后，原来的外层事务⼜重新被绑定到线程上，相当于恢复了被挂

起之前的状态，这就体现了 REQUIRES_NEW 的处理逻辑。


## 10.6 小结

本章全方位研究了Spring Boot 整合JDBC场景下的组件装配，以及注解声明式事务的⽣效

原理、控制流程、事务传播⾏为等场景。Spring Boot 整合的事务场景底层依然是 Spring

Framework 已有的功能，Spring Boot 做的事情仅是对默认场景下的组件⾃动进⾏装配。事务管

通知等重要组件的⽀撑。

的装配工作。


## 10.6 小结|

理是 AOP 技术的经典应用，掌握事务管理底层的模型离不开AOP 部分后置处理器、增强器、

大多数的项目开发中，更多的选择是使用持久层框架 MyBatis 或 Spring Data （Hibernate），

⽽不是原⽣的 spring-jdbc。第11 章会重点研究 Spring Boot 整合 MyBatis 持久层框架后底层完成

第

努⼒，但是在实际的项目开发中更多的场景是整合成熟的持久层框架来完成与数据库的交互。

为数据库中的记录。

接口层

配置解析 SQL解析

核心层

结果集映射 插件体系 SQL执⾏

数据源 事务 缓存 反射 解析器

⽀持层

数据绑定 资源加载

Spring Boot 整合 MyBatis

⼀章

本章主要内容：

< MyBatis 框架概述与工程整合；

令 Spring Boot 整合 MyBatis 的核心⾃动装配。



# 第10章中系统地讲解了 Spring Boot 整合JDBC 场景下的⾃动装配，以及注解声明式事务


## 第10章中系统地讲解了 Spring Boot 整合JDBC 场景下的⾃动装配，以及注解声明式事务

的底层原理。尽管 Spring Framework 和SpringBoot 在简化与数据库的交互方⾯已经做了很大的

目前市⾯上⽐较流⾏的持久层框架包括 Spring Data JPA（底层默认依赖 Hibernate）和 MyBatis。

Spring Data 本⾝属于 Spring ⽣态的⼀部分，与Spring Boot的整合⾮常简单，本书不对此展开讲

解。MyBatis 作为第三方框架，它与 Spring Boot的整合方式是通过第三方框架编写 starter 场景

启动器并配置相应的组件⾃动装配。本章内容会以MyBatis 整合 Spring Boot 的核心场景启动器

为切入点，研究 MyBatis 如何完成与 Spring Boot 的场景整合。


## 11.1 MyBatis 框架概述

MyBatis 是⼀款优秀的持久层框架，它⽀持⾃定义SQL、存储过程以及⾼级映射。MyBatis

免除了⼏乎所有的JDBC 代码以及设置参数和获取结果集的工作。MyBatis 可以通过简单的

XML 或注解来配置和映射原始类型、接⼜和普通⽼式 Java 对象（Plain Old Java Object, POJO）

从整体上讲，MyBatis 的架构可以分为三层，如图11-1 所舌。

SqISession

参数映射

类型转换 日志

图 11-1 MyBatis 的整体架构

<artifactId>mybatis-spring-boot-starter</artifactId>

<artifactId>mysql-connector-java</artifactId>


## 11.2 Spring Boot 整合 MyBatis 项目搭建|

• 接口层：Sq1Session 是平时与 MyBatis 完成交互的核心接口（包括整合 Spring Framework

和 Spring Boot 后用到的 sqlSessionTemplate）。

• 核心层：SqlSession 执⾏的方法，包括底层需要经过配置⽂件的解析、SQL解析，

以及执⾏SQL 时的参数映射、SQL 执⾏、结果集映射，另外还有穿插其中的扩展插件。

• ⽀持层：核心层的功能实现，它基于底层的各个模块，以共同协调完成。

总体来讲，使用 MyBatis 可以灵活、完整、相对轻量化地与数据库进⾏交互。


## 11.2 Spring Boot 整合MyBatis 项目搭建

下⾯来搭建⼀个 Spring Boot整合 MyBatis 的项目。由于 MyBatis 整合 Spring Boot 的场景

启动器中已经对 Spring Boot 原⽣的 starter 做了整合，因此在导入依赖时，只需要引入mybatis-

sPring-boot-starter 和具体的数据库连接驱动，如代码清单11-1 所示。

代码清单 11-1 引入 MyBatis 整合 Spring Boot 的必要依赖

<dependencies>

<dependency>

<groupId>org.mybatis.spring.boot</groupId>

<version>2.1.3</version>

</dependency>

<dependency>

<groupId>mysql</groupId>

<version>5.1.47</version>

</dependency>

</dependencies〉

提示：mybatis-spring-boot-starter 2.1.3 版本底层依赖 Spring Boot 2.3.0，与本书研究

的 Spring Boot 主要版本同属⼀个中版本，整合的可靠性⾼。

有关数据库搭建的部分，可以直接使用第10章的springboot-dao 作为连接库，本

章不再重新创建；连接数据源的内容，同样参照第10章配置，具体可见代码清单10-3，本

章不再赘述。

有关测试代码，部分内容与第10章类似，区别是 Dao 层的实现由依赖 JdbcTemplate 的

UserDao 替换 Mapper 动态代理接口 UserMapper 以及对应的XML 映射⽂件UserMapper.

XML，具体的代码如代码清单11-2 和代码清单11-3所示。

代码清单 11-2 UserMapper 接口

@Mapper

public interface UserMapper ｛

void save （User user）；

List<User> findA11（）；

mybatis.configuration.map-underscore-to-camel-case=true

层整合的核心部分，⼀定是⾃动配置类完成的大多数组件装配和默认配置的应用。接下来的内

|第11章 Spring Boot 整合 MyBatis


## 1 代码清单 11-3 UserMapper.XML 映射⽂件

<？xml version="1.0" encoding="UTF-8"？>

<！DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"

"http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="com.linkedbear.springboot.mapper.UserMapper">

<insert id="save" parameterType="user">

insert into tbl_user （name,tel）values （#｛name），#｛tel｝）

</insert>

<select id="findA11"resultType="User">

select * from tbl_user

</select>

</mapper>

另外，为了能使 MyBatis 完成实体类别名的预处理以及 mapper.xml ⽂件的扫描，需要在

Spring Boot 全局配置⽂件中编写⼀些额外的配置，如代码清单11-4所舌。

1代码清单 11-4 有关 MyBatis 的配置

mybatis.type-aliases-package=com.linkedbear.springboot.entity

mybatis.mapper-locations=classpath:mapper/*.xml

最后编写 Spring Boot 主启动类，它的编写与第10章的内容⼏乎完全⼀致，仅是主启动类

的类名不同⽽已，如代码清单 11-5所示。

】代码清单 11-5 主启动类中获取 UserService 并调用

@SpringBootApplication

@EnableTransactionManagement

public class MyBatisSpringBootApplication ｛

public static void main （String［］ args）｛

ApplicationContext ctx = SpringApplication.run（MyBatisspringBootApplication.class, args）；

UserService userService = ctx.getBean （UserService.class）；

userService.test （）；

经过上述代码编写，就完成了 Spring Boot 与 MyBatis 的整合。


## 11.3 ⾃动装配核心

在上⾯的项目搭建中，仅编写了少量的⼏⾏配置，便完成了与MyBatis 框架的整合，⽽底

容会分析 MyBatis 的场景启动器，研究 MyBatis 在⾃动装配的部分做了哪些工作。


## 11.3.1 场景启动器的秘密

借助 IDE，观察 mybatis-sPring-boot-starter依赖，可以发现它仅是⼀个空的jar

包，没有具体的内容，⽽这个依赖本身⼜依赖 mybatis-spring-boot-autoconfigure。

org.mybatis.spring.boot.autoconfigure.MybatisLanguageDriverAutoConfiguration，

org.mybatis.spring.boot.autoconfigure.MybatisAutoConfiguration

不重要，读者不必在此耗费过多的精⼒。


## 11.3 ⾃动装配核心！

通过前⾯章节的学习，可以得知这个依赖中通常包含⼀个 spring.Eactories ⽂件。打开jar

包依赖，可以发现它的确包含⼀个 spring.factories ⽂件，这个⽂件中仅定义了两个⾃动

配置类，如代码清单11-6所示。

代码清单 11-6 MyBatis 整合 SpringBoot 的⾃动配置类

org•Springrramework.boot.autoconrigure.tnaoLeAutocont1gurat1on=

由此可知，MyBatis 整合 SpringBoot 的核心装配就在这两个⾃动配置类上，下⾯逐⼀展开

研究。


## 11.3.2 MybatisLanguageDriverAutoConfiguration

从MybatisLanguageDriverAutoConfiguration的类名中可以得知，它的配置与“语

⾔驱动”有关。要理解“语⾔驱动”这个概念，需要读者先了解 MyBatis 中的设计。MyBatis

默认使用 XML 映射⽂件作为载体，且 XML 映射⽂件中的内容是固定的⼏个标签，从MyBatis


## 3.2版本开始⽀持使用第三方模板引擎框架作为编写映射⽂件的实现，⽽使用 XML ⽂件编写仅

是MyBatis 默认提供的映射⽂件实现。

从 MybatisLanguageDriverAutoConfiguration 的源码中可以发现，MyBatis ⽀持

的第三方模板引擎框架包含 FreeMarker、Velocity、Thymeleaf 等，但是默认场景下 MyBatis 不

会引入过多的依赖，这也使得开发者仅熟悉原⽣的 XML 映射⽂件编写即可。这个配置类本⾝


## 11.3.3 MybatisAutoConfiguration

spring.factories 中的另⼀个⾃动配置类 MybatisAutoConfiguration 才是 MyBatis

整合 Spring Boot 的核心。MyBatis 内部⽀撑运⾏的所有组件都在这个配置类中创建。本节内容

会完整讲解 MybatisAutoConfiguration 中的所有配置内容。

1. SqISessionFactory

熟悉 MyBatis 的读者⼀定清楚，MyBatis 的底层核心⽀撑是 SqlSessionFactory，有了

SqlSessionFactory 就可以创建 SqlSession，进⽽使用SqlSession 进⾏CRUD操作。

MybatisAutoConfiguration 中注册的最关键组件就是这个 SqlSessionFactory，代码

清单 11-7中列举了创建 SqlSessionFactory 的部分核心逻辑。

代码清单 11-7 SqISessionFactory 的创建

@Bean

@ConditionalOnMissingBean

public sqlSessionFactory sqlSessionFactory （Datasourcedatasource）throws Exception ｛

SqlSessionFactoryBean factory = new SqlSessionFactoryBean （）；

1/ 数据源

factory.setDataSource （dataSource）；

factory.setVfs （SpringBootVFS.class）；

了便于读者更好地阅读和理解源码，这⾥将其拆分为多个⽚段讲解。

I第11章 Spring Boot 整合MyBatis

// 外部MyBatis 原⽣配置⽂件

iE （Stringutils.hasrext （this.properties.getConfigLocation （）））｛

factory.setConfigLocation（

this.resourceloader .getResource （this.properties.getConfiglocation （）））；

1/ 应用 properties 配置

applyConfiguration （factory）；

if（this.properties.getConfigurationProperties（）！= nul1）｛

factory.setConfigurationProperties （this.properties.getConfigurationProperties （））；

// 设置插件

i£ （！ObjectUtils.isEmpty（this.interceptors））｛

factory.setPlugins （this.interceptors）；

1/ 更多 set 操作⋯⋯.

return factory.getObject （）；

总体看来，创建 Sq1 SessionFactorY 的步骤只是把连接数据库的数据源、全局配置⽂

件中提取出的配置对象、IOC 容器中注册的 MyBatis 拦截器等组件⼀⼀应用在

Sql SessionFactoryBean 中，⽽实际构建 SqlSessionFactory 的动作是最后⼀⾏的

factory.getObject（）；方法调用，这个方法中包含⼀个⾄关重要的方法 afterProper

tiesSet，它会在经过⼀些前置判断后执⾏ buildSqlSessionFactory 方法，以构建实际

的 SqlSessionFactory 对象，如代码清单11-8所示。

代码清单 11-8 getObject 会触发 afterPropertiesSet 方法

public SqlSessionFactory getobject（） throws Exception ｛

i£ （this.sqlSessionFactory == mu11） ｛

afterPropertiesSet （）；

return this.sqlSessionFactory；

euostc vola arterrLopertlesoet（ Carows txceptlon t


## 11 判断……..

this.sqlSessionFactory=buildsqlSessionFactory （）；

正常情况下 afterPropertiesSet 是 InitializingBean接口的方法，用于 Bean 初

始化阶段的⽣命周期回调，⽽ SqlSessionFactoryBean 中调用 getObject 方法获取目标

对象时主动回调的目的是，考虑到在 Spring Boot 的整合场景下 SqlSessionFactoryBean 本

⾝不会注册到 IOC 容器中，因此需要⼿动调用 afterPropertiesSet 方法触发内置 Sql

SessionFactory 对象的构建。

下⾯着重研究 buildsqlsessionFactory 方法。由于这个方法的源码篇幅⾮常⻓，为

（1） 处理 MyBatis 全局配置对象

buildSqlSessionFactory方法的第⼀部分内容的核心工作是预准备MyBatis 的全局配


## 11.3 ⾃动装配核心|

置对象 Configuration，并根据是否事先传入外部 configuration 对象或者传入全局配置

⽂件路径来决定是否准备 XMIConfigBuilder，如代码清单 11-9 所示。如果确实需要

XMI.ConfigBuilder 的处理，在第6 步会有配置⽂件解析。

1代码清单 11-9 buildSqISessionFactory （1）

Protected SqlSessionFactory buildSqlSessionFactory（） throws Exception ｛

final Configuration targetConfiguration；

xmLcont1gbu1Lder xmucont1gbulLder = 20s：

1/ 如果构建 Sq1SessionFactoryBean 时传入了外部Configuration，则直接处理

if（this.configuration ！= null）｛

targetConfiguration = this.configuration；

if （targetConfiguration.getVariables（）== nul1）｛

targetConfiguration.setVariables （this.configurationProperties）；

｝ else if（this.configurationProperties ！= null） ｛

targetConfiguration.getVariables （）.putA11（this.configurationProperties）；

｝ else if（this.configLocation ！= null） ｛

// 如果传入全局配置⽂件路径，则封装 xMI.ConfigBuilder 对象以备加载

xmlConfigBuilder = new XMLConfigBuilder（this.configLocation.getInputStream（）、nu11，

this.configurationProperties）；

targetConfiguration = xnlConfigBuilder.getConfiguration （）；

｝ else｛

// 如果⽆外部Configuration 对象，则执⾏默认策略

targetConfiguration = new Configuration（）；

Optional.ofNullable （this.configurationProperties）

.ifPresent （targetConfiguration：：setVariables）；

（2）处理内置组件

紧接着的3个设置动作分别对应MyBatis 中的三个组件，如代码清单11-10 所舌。这⾥简

单解释⼀下。对象工⼚ ObjectFactory 负责创建MyBatis 查询包装结果集时创建结果对象（模

型类对象、Map 等），对象包装工⼚ ObjectWrapperFactory 负责对创建出的对象进⾏包装，

虚拟⽂件系统 Vfs 用于加载项目中的资源⽂件。

【代码清单 11-10buildSqlSessionFactory （2）

Optional.ofNullable （this.objectFactory）.ifPresent（targetConfiguration：：setObjectFactory）；

Optional.ofNullable（this.objectWrapperFactory）

•ifPresent （targetConfiguration： ：setObjectWrapperFactory）；

Optional.ofNullable （this.vfs）.ifPresent（targetConfiguration： ：setVfsImp1）；

11.

在这个环节中 Spring Boot 仅对虚拟⽂件系统部分进⾏了扩展，它额外定义了⼀个 Spring

BootVFS 用于加载项目中的资源⽂件，除此之外没有任何多余的扩展。

（3）处理别名

代码清单11-11中的动作是别名的包扫描以及某些特定类的别名设置。MyBatis 允许在项目

中为实体类定义别名，这种设计可以使得在映射⽂件 mapper.xml 中简化类型编写，使映射⽂件

更清爽简洁。在默认情况下包扫描注册的别名就是类名本身（⾸字⺟大写），如果类上标注有

【第11章 Spring Boot 整合MyBatis

@Alias 注解，则会取注解属性值。

代码清单 11-11 buildSqISessionFactory （3）


if （hasLength （this.typeAliasesPackage））｛

scanClasses （this.typeAliasesPackage，this.typeAliasesSuperType）.stream （）

.filter（clazz -> ！clazz.isAnonymousClass （））.filter（clazz -> ！clazz.isInterface （））

.filter （clazz -> ！clazz.isMemberClass （））

•forEach （targetConfiguration.getTypeAliasRegistry （）：：registerAlias）；

i （！isEmpty（this.typeAliases））｛

stream.of （this.typeAliases）.forEach （typeAlias -> ｛

targetConfiguration.getTypeAliasRegistry（）.registerAlias （typeAlias）；

// logger ••

｝；


（4）处理插件、类型处理器

代码清单 11-12的逻辑是处理 MyBatis 插件以及 TypeHandler。注意，此处的 this.

Plugins 是在MybatisAutoConfiguration 中利用 ObjectProvider 从IOC 容器中获取

到的。由此就可以得出⼀个简单结论：Spring Boot整合 MyBatis 后可以直接向IOC容器中注册

MyBatis 的关键组件，底层的⾃动装配可以将这些组件应用到MyBatis 中。

代码清单 11-12 buildSqISessionFactory （4）

//

if （！isEmpty （this.plugins））｛

Stream.of （this.plugins）.forEach（plugin -> ｛

targetConfiguration.addInterceptor （plugin）；

// logger •

｝；

i （hasLength（this.typeHandlersPackage））｛

scanClasses （this.typeHandlersPackage,TypeHandler.class）.stream （）

.filter （clazz -> ！clazz.is AnonymousClass （））

.filter （clazz -> ！clazz.isInterface （））

.filter（clazz -> ！Modifier.isAbstract （clazz. getModifiers （）））

.forEach （targetConfiguration.getTypeHandlerRegistry （） ：：register）；

i£ （！isEmpty（this.typeHandlers））｛

Stream.of （this.typeHandlers）.forEach （typeHandler ->｛

targetConfiguration.getTypeHandlerRegistry （）.register （typeHandler）；


## 11 logger ⋯

｝）；

targetConfiguration.setDefaultEnumTypeHandler（defaultEnumTypeHandler）；


## 11.3 ⾃动装配核心！

（5）处理其他内部组件

除了内部核心的对象工⼚、插件、类型处理器等组件，MyBatis 还有⼀些相对不太重要的

内部组件，如脚本语⾔驱动器（⽀持多种映射⽂件格式的编写）、数据库⼚商标识器（为数据库

可移植性提供了可能）等，如代码清单 11-13所示。在构建 SqlSessionFactory 的过程中，

这部分组件也会被初始化。

1代码清单 11-13 buildSqISessionFactory （5）

i£ （！isEmpty（this.scriptingLanguageDrivers））｛

Stream.of （this.scriptingLanguageDrivers） .forEach （languageDriver -> ｛

targetConfiguration.getLanguageRegistry （）.register （languageDriver） ；


## 11 logger ⋯..

｝）；

Optional.ofNullable（this.defaultscriptingLanguageDriver）

•ifPresent （targetConfiguration：：setDefaultScriptingLanguage） ；

if（this.databaseldProvider ！= nul1） ｛

try｛

targetConfiguration.setDatabaseId（

this.databaseIdProvider.getDatabaseId （this.dataSource））；

I/ cateh throwex.....•

Optional.ofNullable （this.cache）•ifPresent （targetConfiguration：：addCache）；

（6）解析 MyBatis 全局配置⽂件

在代码清单 11-9中有⼀段配置⽂件的处理，如果项目配置中传入了 configLocation，

则此处会使用 XMIConfigBuilder解析 MyBatis 配置⽂件，并应用于 MyBatis 全局配置对象

Configuration 中。Spring Boot 已经将 MyBatis 中的配置尽可能地移植到 application.

Properties 中，所以代码清单 11-14 中的内容可以忽略。

代码清单 11-14 buildSqISessionFactory （6）

i£（XMLConfigBuilder ！= nul1）｛

try｛

xmlConfigBuilder.parse （）；

// logger

｝// catch finally ⋯.

（7）处理数据源和事务工⼚

代码清单 11-15中只有⼀⾏代码，但它完成了两个组件的初始化：数据源与事务工⼚。默

认情况下 MyBatis 与 Spring Boot 整合之后，底层使用的事务工⼚是 SpringManaged

TransactionFactory，了解 MyBatis 底层原理的读者可能会了解 JdbcTransaction

Factory，它是 MyBatis 原⽣控制事务的事务工⼚，SpringManagedIransactionFactory

continue；

I第11章 Spring Boot 整合MyBatis

与 JdbcrransactionFactory 的底层事务控制并⽆太大差别。

1代码清单 11-15 buildSqISessionFactory （7）

targetConfiguration.setEnvironment （new Environment（this.environment，

this.transactionFactory == null

？ new SpringManagedTransactionFactory （）

：this.transaction Factory，

this.dataSource））；

1..…..

（8）处理 Mapper

由于 Sql SessionFactoryBean 的构建中只能传入映射⽂件 mapper.xml 的路径，因此

SqlSessionFactorYBean 本身的逻辑中并⽆ Mapper 接口的扫描。从代码清单11-16可以发

现，解析映射⽂件 mapper.xml 的逻辑是借助XMLMapperBuilder组件实现的，这个组件会逐

个解析 mapper.xml，封装 Mappedstatement 并注册到 MyBatis 的全局配置对象 Config

uration中。

1代码清单 11-16 buildSqlSessionFactory （8）

11.

i£ （this.mapperLocations ！= nu11） ｛

if （this.mapperlocations.length == 0） ｛

// logger •.

｝ else｛

for（ResourcemapperLocation : this.mapperLocations）｛

i（mapperLocation == nu11） ｛

try｛

XMLMapperBuilder xmlMapperBuilder = new XMLMapperBuilder （

mapperLocation.getInputstream（），targetConfiguration，

mapperLocation.tostring（），targetConfiguration.getSqlFragments （））；

xm1MapperBuilder.parse （）；

｝ 1/ catch finally ......


## 11 logger ⋯.

｝ // else logger ⋯••

return this.sqlSessionFactoryBuilder.build（targetConfiguration）；

经过庞大的 afterPropertiesSet 方法处理后，SqlSessionFactory 被成功创建，

MyBatis 的核心也就初始化完毕了。

2. SqlSession Template

相较于 SqlSessionFactory 的构建过程，Sql SessionTemplate 的构建逻辑⾮常简

单，如代码清单 11-17所示。SqlSessionTemplate 本身是⼀个实现了 SqlSession 接口的

模板类，它可以⾮常简单地调用MyBatis 的核心CRUD 方法，⽽不必关心SqlSession 的⽣


## 11.3 ⾃动装配核心|

命周期。在构建 Sql SessionTemplate 时，必传人的组件是SqlSessionFactorY，毕竟

只有传人 SqlSessionFactory 之后，SqlSessionTemplate 才能获取到实际的

SqlSession 并调用其方法。除此之外，我们也可以关注⼀下构建方法的另⼀个参数，它的类

型是⼀个枚举：ExecutorType。

代码清单 11-17 SqISessionTemplate 的创建

@Bean

@Conditional0nMissingBean

public SqlSessionTemplate sqlSessionTemplate （SqlSessionFactory sqlSessionFactory）｛

ExecutorType executorrype = this.properties.getExecutorType （）：

if （executorType ！= null）｛

return new SqlSessionTemplate（sqlSessionFactory,executorType）；

｝ else｛

return new SqlSessionTemplate （sqlSessionFactory）；

从类名上理解，ExecutorType 指代的是 SQL 语句的执⾏类型。MyBatis 内置的Executor

Type 有三种，其中默认的模式是 SIMPIE，这种执⾏类型会在SqlSession 执⾏具体的CRUD

操作时每条 SQL 语句创建⼀个预处理对象 Preparedstatement 并逐条执⾏；REUSE模式

会复用同⼀条 SQL 语句对应创建的 Preparedstatement，该模式会在⼀定程度上提⾼

MyBatis 的执⾏效率；BATCH 模式下不仅会复用 Preparedstatement 对象，还会执⾏批量

操作，这使得 BATCH 模式的执⾏效率是最⾼的。但是使用BATCH 模式有⼀个缺陷，即在执⾏

insert 语句时，如果插人的数据库表的主键是⾃增序列，则在事务提交之前⽆法从数据库获得实

际的⾃增ID 值，这种设计在某些业务场景下是不符合要求的。

3. AutoConfiguredMapperScannerRegistrar

由于 SqlSessionFactory 的构建中没有处理 Mapper接口的扫描，因此 MyBatis 在整合

Spring Boot 时专门提供了⼀个适配 Spring Boot 项目模式的Mapper接⼜扫描注册器，如代码

清单 11-18所舌，这个扫描器会在 Spring Boot 项目中未标注@MapperScan 注解时⽣效。

代码清单11-18 @MapperScan 与 Mapper 接⼜扫描注册器

@Configuration

@Import （AutoConfiguredMapperScannerRegistrar.class）

@Conditional0nMissingBean（｛MapperFactoryBean.class，MapperScannerConfigurer.class｝）

public static class MapperScannerRegistrarNotFoundConfiguration implements InitializingBean ｛

@Import （MapperScannerRegistrar.class）

public @interface MapperScan

由于MapperScan 注解会向 IOC 容器中导人⼀个 MapperScannerRegistrar 组件，

当项目中没有标注该注解时，默认的 AutoConfiguredMapperScannerRegistrar 就会被

导人并⽣效（约定大于配置）。⽽从代码清单 11-19 中可以看出，默认注册的MapperScanner

Configurer 扫描器中的扫描规则是扫描 Spring Boot 主启动类所在包及其子包下所有标注了

@Mapper 注解的接口。

|第11章 Spring Boot 整合MyBatis

1代码清单 11-19 注册默认的 MapperScannerConfigurer

public static class AutoConfiguredMapperScannerRegistrar

implements BeanFactoryAware,ImportBeanDefinitionRegistrar ｛

Private BeanFactory beanFactory；

@Override

public void registerBeanDefinitions （AnnotationMetadata importingClassMetadata，

BeanDefinitionRegistry registry）｛

// logger

// 取出 SpringBoot 主启动类所在包

List<string> packages = AutoConfigurationPackages.get （this.beanFactory）；

BeanDefinitionBuilder builder = BeanDefinitionBuilder

•genericBeanDefinition （MapperScannerConfigurer.class）；

builder.addPropertyValue （"processPropertyPlaceHolders"，true）；

// 扫描标识@Mapper 接口的接口

builder.addPropertyValue （"annotationclass"，Mapper.class）；

builder.addPropertyValue （"basePackage"，

StringUtils.collectionToCommaDelinitedString（packages））；

BeanWrapper beanWrapper= new BeanWrapperImpl （MapperScannerConfigurer.class）；

Stream.of （beanWrapper.getPropertyDescriptors （））

.filter （x ->x.getName （）.equals （"lazyInitialization"））.findAny （）

•ifPresent （x -> builder.addPropertyValue （

"lazyInitialization"，"simybatis.lazy-initialization: false｝"））；

registry.registerBeanDefinition （MapperScannerConfigurer.class.getName （），builder.

getBeanDefinition（））；

以此法注册 MapperScannerConfigurer 后，在项目开发中只需要编写 Mapper 接口并

标注@Mapper 注解，即可被 MapperScannerConfigurer ⾃动扫描并注册到IOC容器中。

⾄此，MyBatis 整合 SpringBoot 的核心⾃动装配内容剖析完毕。


## 11.4 小结

本章主要研究了 Spring Boot 整合MyBatis 持久层框架的⾃动装配核心，并简单了解了

MyBatis 中核心组件 SqlSessionFactory 的构建流程。MyBatis 的内部核心⽀撑是⼀个

SqlSessionFactory，在与 Spring Boot 框架整合时会借助 SqlSessionFactoryBean 的

工⼚ Bean创建来完成 MyBatis 的框架初始化。此外，针对 Mapper 动态代理的开发，MyBatis

在整合 Spring Boot 时提供了默认的 Mapper 接口扫描器，以完成 Mapper接口的代理装配。

配内容。

主导创建。

第

-章

Spring Boot 整合 WebMvc

本章主要内容：

< Spring Framework 与 Spring Boot 概述；

◎ Spring Boot 整合 WebMvc 的核心⾃动装配；

◎ WebMvc 核心组件的功能剖析；

今 DispatcherServlet的初始化原理与工作全流程解析。

除了与数据层的交互，Spring Boot 经常整合的另⼀个核心场景就是Web 开发了。Spring

Framework 5.x 中对于 Web 场景的开发提供了两套实现方案：WebMvc 与WebFlux。本章先讲解

读者所熟知的WebMvc 部分。


## 12.1 整合 WebMvc 的核心⾃动装配

有关整合WebMvc的⾃动装配，我们在第2章已经大体了解，本节来回顾⼀下核心的装

• WebMvcAutoConfiguration

WebMvcAutoConfiguration 主配置类中核心注册的组件包括来⾃ WebMvcAuto

ConfigurationAdapter 的消息转换器 HttpMessageConverter、视图解析器 Content

NegotiatingViewResolver、国际化组件 LocaleResolver，以及来⾃ EnableWebMvc

Configuration 的 RequestMappingHandlerMapping、RequestMappingHandler

Adapter 和静态资源配置。

• DispatcherServletAutoConfiguration

DispatcherServletAutoConfiguration 的核心装配就是 DispatcherServlet 本

身，另外它还注册了⼀个 ServletRegistrationBean将DispatcherServlet 注册到1OC

容器中，以使 Servlet ⽣效。

？提舌：了解原⽣ SpringWebMvc原理的读者可能知道，DispatcherSerVlet 的初始化逻辑中有

⼀段默认的组件初始化逻辑，用于⽆配置的项目中初始化默认组件实现，这部分在 Spring Boot 中是

否也会⽣效？这个疑虑是完全可以打消的，因为 Spring Boot 针对 WebMve 场景已经在

WebMvcAutoConfiguration 中注册了默认的组件，所以不再需要DispatcherServlet

官方⽂档列举的组件如下，列举的组件基本上都在官方⽂档中有相应的描述：


## 12.2

I第12章 Spring Boot 整合WebMvc

• ServletWebServerFactoryAutoConfiguration

ServletWebServerFactoryAutoConfiguration 注册的内容是有关嵌人式 Web 容

器的，它会根据当前项目中导入的项目式 Web 容器依赖决定选择装配何种容器实例，另外它还

注册了 BeanPostProcessorsRegistrar 用于导人两个处理定制器的后置处理器、两个

WebServerFactoryCustomi zer 用于将 server.*系列配置应用到嵌人式 Web 容器中。

最后结合 Spring Boot 的官方⽂档，在 spring-boot-features 板块的7.1.1 节有对 SpringWebMvc

⾃动装配的描述，这⾥截取出核心部分简单总结，⽂档原⽂如图12-1所舌。


## 7.1.1. Spring MVC Auto-configuration

Spring Boot provides auto-configuration for Spring MVC that works well with most applications.

The auto-configuration adds the following features on top of Spring's defaults：

• Incluslon Or ContenthegotiatingViewResolver and BeanHameViewReso ver Deans.

• Support for serving static resources, including support for webjars （covered later in this document））.

• Automatic registration of Converter, GenericConverter, and Formatter beans.

• Support for HttpiessageConverters （covered later in this document）.

• Automatic registration of MessageCodesResolver （covered fater in this document）.

• olauic index.htm support

• Custom favicon support （Covered later in tns aocument）.

• Automatic use of a ConfigurablewebBindingInitializer bean （covered later in this document）.

If you want to keep those Spring Boot MVC customizations and make more MvCcustomizations （interceptors, formatters, viev

controllers, and other features）， you can add your own @Configuration class of type webmvcConfigurer but without

oenabieweDivc.

图 12-1 Spring Boot 官方⽂档中描述的⾃动装配内容

• 视图解析器；

• WebJars 的资源映射；

• ⾃动配置的转换器（Converter）、格式化器（Formatter）；

• HTTP 请求转换器（HttpMessageConverter）；

• 响应代码解析器；

• 静态主⻚映射；

• 网站图标映射；

• 可配置的Web 初始化绑定器。

WebMvc的核心组件

下⾯重点了解⼀些 WebMvc中的核心组件的设计和作用，从SpringWebMvc的整体上了解

WebMvc 的架构设计以及整体的工作流程。通过学习本节的内容，可以帮助读者从宏观层⾯重

新认识⼀下 WebMvc。


## 12.2.1 DispatcherServlet

DispatcherServlet 是读者最熟悉的WebMvc核心前端控制器，它统⼀接收客户端（浏


## 12.2

下⾯介绍核心组件的时候，读者可以试着体会⼀下。

Handler

浏览器 DispatcherServlet Handler

Handler

DispatcherServlet

返回

HandlerMapping Handler

Handler

WebMvc 的核心组件|

览器）的所有请求，并根据请求的URI 转发给项目中编写好的Controller 中的方法。有⼀点请

注意，有关匹配寻找和请求转发的工作，以及返回视图、响应 JSON 数据的处理，都不由

DispatcherServlet 完成，⽽是委托给其他组件，这些组件与 Dispatcherservlet 共同

协作完成整个 MVC的工作。

这⾥需要读者认识到，WebMvc 中对于各组件作用的划分是很清晰的，每个组件各司其职，


## 12.2.2 Handler

⾸先解释 Handler 的概念。其实在项目开发中编写的 Controller 方法中，⼀个标注了

@RequestMapping 注解（或派⽣注解）的方法就是⼀个 Handler。很明显，Handler 中要做的

事情就是处理客户端发送的请求，并声明响应视图/响应 JSON 数据。DispatcherServlet

在接收到请求后，只要能匹配到声明的那些标注了@RequestMapping 注解的方法，最终就会

将这些请求转发给编写好的Handler。上述的处理逻辑如图12-2所舌。

清求

胸应

manomen

图12-2 DispatcherServlet 与 Handler 的交互


## 12.2.3 HandlerMapping

上⾯已经解释过，WebMvc 的组件都是各司其职，根据@RequestMapping 去匹配 Handler

的工作，DispatcherServlet 不会⾃⼰去做，⽽是委托给 HandlerMapping 来负责。

HandlerMapping意为处理器映射器，它的作用是根据URI，去匹配查找能处理请求的

Handler。注意，HandlerMapping 查找到可以处理请求的Handler 之后，并不是⽴即将其返

回，⽽是先组合了⼀个 HandlerExecutionChain，这样处理的原因是，如果⼀个请求要被

拦截器处理的话，则在执⾏ Handler 之前需要先执⾏这些拦截器，之后再执⾏ Handler 本身，

HandlerMapping 在封装的时候考虑到这⼀点，于是它把当前这次请求会涉及的拦截器和

Handler ⼀起封装起来组成⼀个 HandlerExecutionChain 的对象，交给 Dispatcher

Servlet，具体逻辑如图 12-3所示。

请求

浏览器

委托查找Handler

图12-3 DispatcherServlet 委托 HandlerMapping 完成 Handler 匹配

发中不再使用。

的映射关系，因此也被淘汰。

I第 12章Spring Boot 整合WebMvc

从源码的⻆度看，HandlerMapping 的接口定义刚好符合以上描述，如代码清单 12-1

所示。

1代码清单 12-1 HandlerMapping 的接口定义

public interface HandlerMapping ｛

HandlerExecutionChain getHandler（HttpServletRequest request）throws Exception；

HandlerMapping接口有⼏个主要的落地实现，读者可以简单了解。

• RequestMappingHandlerMapping：⽀持@RequestMapping 注解的处理器映射器

【最常用】。这种 HandlerMapping 是项目开发中最常用的，⽆须多⾔。

• BeanNameUr1HandlerMapping：使用 bean 对象的名称作Handler 接收请求路径

的处理器映射器。需要编写 Controller 类实现 Controller接口（WebMvc 中有⼀个名

为controller 的接口）。代码清单 12-2中提供了⼀个简单示例。

代码清单12-2 使用 Controller 接口的编写

public class DepartmentListController implements Controller ｛

eoverride

public Mode1AndView handlRequest （HttpServletRequest request,HttpServletResponse response）

throws Exception ｛

return null；

使用该方式编写的Controller，⼀个类只能接收⼀个请求路径，目前已被淘汰，实际项目开

• SimpleUr1HandlerMapping：集中配置请求路径与 Controller 的对应关系的处理器

映射器。这种 HandlerMapping 可以配置请求路径与 Controller 的映射关系，例如代

码清单 12-3 定义了⼀个简单的 simpleUr1HandlerMapping 配置。

•代码清单 12-3 SimpleUrlHandlerMapping 的配置

<bean class="org.springframework.web.servlet.handler.SimpleUrlHandlerMapping">

<property name="mappings">

<PIOPs>

<ProP key="/department/1ist">departmentListController</prop>

<prop key="/department/save">departmentSaveController</prop>

</props>

</property>

</bean>

使用该方式，依然需要编写 Controller 类实现接口，并且需要额外配置 URI 与 Controller

后两种编写方式都是早期发现的，⾃从 Spring Framework 升级到3.0版本全⾯⽀持注解驱

动开发之后，传统的开发方式就用得越来越少了，读者不必深入了解它们，只需要记住 Request

MappingHandlerMapping 就可以了。

Handler

浏览器

Handler

HandlerAdapter

从接口名上看，HandlerAdapter 蕴含着适配器模式，对于这个设计读者也需要了解⼀下。

⼜的方式（当然可能还有别的方式）。要实现用⼀个接⼜同时兼顾这两种方式，很明显适配器是


## 12.2 WebMvc 的核心组件|


## 12.2.4 HandlerAdapter

Dispatcherservlet 获取到 HandlerExecutionChain 后，接下来要执⾏这些拦截器和

Handler, Di spatcherServlet 依然选择交给 HandlerAdapter 去执⾏。HandlerAdapter

意为处理器适配器，它的作用是执⾏上⾯封装好的 HandlerExecutionChain。加入

HandlerAdapter 后的流程图如图12-4所示。

请求 委托查找Handler

DispatcherServlet HandlerMapping Hanaler

响应

返口

HandilenFxecutioncnaiy

HandlerExecutionChain

ModelAndView 执⾏Handler

返IMode1AndView

图 12-4 DispatcherServlet 委托 HandlerAdapter 执⾏ HandlerExecutionChain

注意 HandlerAdapter 与 Handler 的交互：执⾏ Handler之后，虽然编写的返回值基本都

是视图名称或者借助@ResponseBody 的响应 JSON 数据，但在WebMvc 的框架内部，最终都

是封装了⼀个 ModelAndView 对象返回给 HandlerAdapter。HandlerAdapter 再把这个

ModelAndView 对象交给 Dispatcher Servlet，这部分的工作就完成了。

1. 适配器模式

适配器模式可以简单地理解为，将⼀堆不兼容的产品通过⼀个中间“桥梁”整合好。举个

例子：现实中的U盘和 TF 卡都是外置闪存设备，但是U 盘可以直接插入USB 口，TF 卡不可

以，这个时候就需要⼀个读卡器作为中间“桥梁”，将 TF卡插人读卡器⾥，读卡器就可以插入

USB ⼜了。

关于 HandlerAdapter 如何体现适配器模式，需要结合上⾯的 HandlerMapping 来看。

Handler 的编写不仅有@Controller+@RequestMapping 的方式，还有实现Controller 接

⼀个不错的选择。将不同类型的 Handler 以 Object 的形式接收进来，再针对不同的 Handler

编写方式匹配对应的 HandlerAdapter 实现即可。

2. WebMvc中的 HandlerAdapter 实现

WebMvc 中对于 HandlerAdapter 的核心实现主要有以下⼏种方式。

• RequestMappingHandlerAdapter：基于@RequestMapping 的处理器适配器，底

层使用反射机制调用 Handler的方法【最常见】。

• SimpleControllerHandlerAdapter：基于 Contro1ler 接口的处理器适配器，

底层会将 Handler 强转为 Controller，调用其 handlRequest 方法。

SimpleServletHandlerAdapter:i基于 Servlet 的处理器适配器，底层会将

Handler 强转⼒ Servlet，调用其 service 方法。

理的编码复杂度反⽽更⾼，所以这种写法在实际开发中也不会被采用，更多的方式是整合其他

Handler

浏览器 DispatcherServlet HandlerMapping

HandlerAdapter

执⾏Handler

Handler

ViewResolver

|第12章 Spring Boot 整合WebMvc

可以发现 WebMvc 中兼顾了多种编写 Handler 的方式，读者只需要重点关注 Request

MappingHandlerAdapter。

3. WebMvc 管理 Servlet

注意，Servlet 对于 WebMvc来讲也可以是⼀个 Handler，并且 WebMvc为之提供了适配

器，这就意味着在 WebMvc 的整合过程中，可以把 Servlet 直接注入 WebMvc 的IOC 容器中，

⽽不需要通过 web.xml 或者ewebServlet 的方式注册到 ServletContext 中。

但是适配也有两⾯性，如果使用 Servlet 作为请求处理的载体，就只能利用 Bean

NameUr1HandlerMapping 或者 SimpleUrlHandlerMapping 声明请求映射路径，这样处

框架（将其他框架中的 Servlet 纳入 WebMvc 的IOC容器以实现统⼀管理）。


## 12.2.5 ViewResolver

DispatcherServlet 获取到 HandlerAdapter 返回的Mode1AndView 之后，接下来

的工作是响应视图，DispatcherServlet 会将这部分工作委托给 ViewResolver 来处理。

ViewResolver 会根据 Mode1AndView 中存放的视图名称到预先配置好的位置去查找对应的

视图⽂件（jsp、.html 等），并进⾏实际的视图渲染。渲染完成后，将视图响应给

DispatcherServlet。具体的完整流程如图 12-5所舌。

濤求

响应

View Mode1AndView

委托查找Handl er

返回

hanalercxeutioncnaln

HandlerExecutionChain

返回ModelAndView

图12-5 DispatcherServlet 委托 ViewResolver 处理视图和 JSON 数据响应

⾄此，Dispatcherservlet 的核心工作流程已经处理完毕，这样看来 Dispatcher

servlet 其实没有做具体工作，⽽是扮演⼀个类似于“调度者”的⻆⾊，在不同的环节分发不

同的工作给其他核心组件，由此读者也应该体会到，WebMvc 中的各组件是职责分明的。

回到本节的主题上，视图解析器 ViewResolver，顾名思义，它是解析和⽣成视图用的，

默认情况下 WebMvc 只会初始化⼀个 ViewReso1ver，即在原⽣SSM 框架组合开发中配置的

InternalResourceViewResolver，这个类继承⾃ Ur1BasedViewResolver，它可以方

便地声明⻚⾯路径的前后缀，以便于开发者在返回视图（JSP ⻚⾯）的时候编写视图名称。除

了 InternalResourceViewResolver，WebMvc 还⼀些模板引擎提供了⽀持类，例如

FreeMarker—FreeMarkerViewResolver, GroovyXML -GroOvyMarkupViewResolver 等。


## 12.3

@Controller 控制器装配原理|

②提示：可能有读者会产⽣疑惑，既然 Controller 不仅可以跳转视图，还可以响应 JSON数据，那么响

应 JSON 数据是否也由ViewResolver 处理呢？答案是否定的，12.4节会讲解该部分内容。


## 12.3 @Controller 控制器装配原理

当编写的 Controller 类中标注有@Controller 或派⽣注解并声明@RequestMapping 注

解的方法时，即可装载到 WebMvc 中完成视图跳转/数据响应的功能。本节内容会深入初始化的

流程中，探究这些 WebMvc 的 Handler 是如何被识别并装载到 WebMvc 中的。


## 12.3.1 初始化 RequestMapping 的人⼜

使用@RequestMapping 的方式声明的 Handler，底层⼀定会与 RequestMapping

HandlerMapping 有关联，⽽ WebMvcAutoConfiguration 中已经初始化了 Request

MappingHandlerMapping，下⾯会沿着这个思路深入分析。

借助 IDE 观察 RequestMappingHandlerMapping 的方法实现，可以发现有⼀个

afterPropertiesSet 方法，它来⾃ InitializingBean接口，说明在 RequestMapping

HandlerMapping 的对象初始化阶段有额外的扩展逻辑，⽽对应的 afterPropertiesSet

方法就是初始化 RequestMapping 的核心逻辑，通过⼀直向下调用，可以找到⼀个名为

initHandlerethods 的方法，如代码清单 12-4所示。

1代码清单 12-4 RequestMappingHandlerMapping的初始化逻辑

Public void afterPropertiesSet （）｛

this.config = new RequestMappingInfo.BuilderConfiguration （）；

this.config.setUrlPathHelper （getUr1PathHelper （））；

// this.config.set...

super.afterPropertiesSet （）；

public void afterPropertiesSet （）｛

initHandlerMethods （）；

Private static final String SCOPED_TARGET_NAME_PREFIX - "scopedTarget."；

Protected void initHandlerMethods （）｛

// 此处会获取 IOC容器中的所有 Bean

for （String beanName :getCandidateBeanNames （））｛

主£ （！ beanName. startsWith （SCOPED_TARGET_NAME_PREEIX））！

processCandidateBean （beanName）；

handlerMethodsInitialized （getHandlerMethods （））；

从initHandlerMethods 的方法名就可以知道，该方法会初始化所有 HandlerMethod，

即可以处理请求的 Controller 方法。从方法的实现上看，initHandlerMethods 方法会提取

出IOC容器中所有名称前缀不是"scopedTarget."的bean对象，并逐⼀进⾏解析。

detectHandlerMethods

|第12章 Spring Boot 整合WebMvc


## 12.3.2 process CandidateBean

要判断⼀个 Bean 是否是⼀个 WebMve的 Controller，只需要判断类上是否标注了

@Controller 注解（或派⽣注解）或者@RequestMapping 注解（或派⽣注解），只要⼆

者中存在⼀个，就可判定当前Bean 是⼀个前端控制器，如代码清单 12-5所示。如果判断⼀

个 Bean 的确是⼀个 Controller，则继续向下执⾏ detectHandlerMethods 方法，处理

Handler 方法。

【代码清单 12-5 检查和处理候选的 bean 对象

protected void processCandidateBean （String beanName）｛

Class<?> beanType = null；

try｛

beanType =obtainApplicationContext （）.getType （beanName）；

｝1/ catch .....

i£ （beanType ！= nu11 && isHandler （beanType））｛

detectHandlerMethods （beanName）；

｝

Protected boolean isHandler （Class<?> beanType）｛

return （AnnotatedElementUtils.hasAnnotation （beanrype, Controller.class）

I AnnotatedElementUti ls.hasAnnotation （beanType,RequestMapping.class））；

w提示：可能有读者会产⽣疑惑，为什么⼀个类上只标注了@RequestMapping 注解，也会判定为

Controller？如果这个类没有注册成为IOC容器的Bean 怎么办？其实有这个想法是多虑了。注意观

察代码清单12-5 中的try 块，beanType 是通过调用 ApplicationContext 的getType 方

法获取的，既然能从 ApplicationContext 中获取到 Bean 的类型，那么它必然是容器中的⼀

个实际存在的 bean 对象。Spring Framework 在此处认为只要⼀个 bean 对象上标注了

@RequestMapping 注解，它就可以充当 Controller，⽽⽆须限定是否真的标注了@Controller

注解，只是在实际项目开发中通常都是@Controller 配合@RequestMapping 同时出现⽽已。


## 12.3.3

继续向下执⾏ detectHandlerMethods 方法，这个方法整体分为两个步骤，⾸先会将⼀

个 Controller 中的方法全部检查⼀遍，并提取出标注了@RequestMapping 注解的方法，随后

封装映射信息并注册方法映射，如代码清单 12-6所舌。

代码清单 12-6 解析 Controller 类型提取 Handler 方法

Protected void detectHandlerMethods （Object handler）｛

Class<?> handlerType= （handler instanceof String

？ obtainApplicationContext （）•getType （ （String） handler）：handler.getClass （））；

i （handlerType ！= null）｛

Class<?> userType = ClassUtils.getUserClass （handlerTyPe）；


## 11 解析筛选方法

并执⾏


## 12.3 @Controller 控制器装配原理1

Map<Method,T> methods = MethodIntrospector.selectMethods （userType，

（MethodIntrospector.MetadataLookup<T>）method -> ｛

try｛

return getMappingForMethod （method, userType）；

｝1/ catch •.

｝）；

1/ logger ⋯..

注册方法映射

methods.forEach（（method,mapping）->｛

Method invocableMethod = AopUtils.selectInvocableMethod （method, userType）；

registerHandlerMethod （handler,invocableMethod, mapping）；

｝

））；

第⼀步检查筛选 Handler 方法的逻辑中利用了 MethodIntrospector 进⾏方法遍历，

⽽ MethodIntrospector 的底层会利用反射机制逐个遍历⼀个 Class 中的所有方法，

selectMethods 方法参数中的 lambda 表达式，⽽lambda 表达式中调用的

getMappingForMethod 方法检查方法上是否标注了@RequestMapping 注解（或派⽣注

解），如果有标注则会封装⼀个 RequestMappingInfo 对象，如代码清单 12-7所示。

1代码清单 12-7 检查方法并封装 RequestMappingInfo 对象

protected RequestMappingInfo getMappingForMethod（Method method,Class<?> handlerType）｛

// 创建方法级的 RequestMappingInfo

RequestMappingInfo info = creatRequestMappingInfo （method）；

if （info ！= nul1）｛

1/ 创建类级的 RequestMappingInfo

RequestMappingInfo typeInfo = creatRequestMappingInfo（handlerType）；

if （typeInfo ！= null）｛

1/ 拼接类级的 RequestMapping uri

info = typeInfo.combine （info）；

1/ 拼接路径前缀

String prefix = getPathPrefix（handlerType）；

if（prefix！= null）｛

info = RequestMappingInfo.paths （prefix）.build（）.combine （info）；

return info；

private RequestMappingInfo creatRequestMappingInfo（AnnotatedElement element）｛

RequestMapping requestMapping = AnnotatedElementUtils

.findMergedAnnotation （element, RequestMapping.class）；

RequestCondition<？> condition =lelement instanceof Class

？ getCustomTypeCondition（（Class<?>）element）：getCustonMethodCondition（（Method） element））；

return（requestMapping ！= null ?creatRequestMappingInfo（requestMapping,condition）：nul1）；

经过 getMappingForethod 方法的处理后，就可以获得⼀个包含映射URI、请求方式

等信息的 RequestMappingInfo 对象。回到代码清单 12-6的 detectHandlerMethods 方

|第12章 Spring Boot 整合 WebMvc

法的下半段，它会将 Handler 方法逐个与 RequestMappingInfo 对象⼀⼀映射并注册到

MappingRegistry 中，如代码清单 12-8 所示。

代码清单 12-8 注册 Handler 方法映射到 MappingRegistry

Protected void detectHandlerMethods （Object handler）｛

Class<?> handlerType = （handler instanceof String

？ obtainApplicationContext （）.getrype （ （String） handler）：handler.getClass （））；

i£ （handlerType ！= null）｛

methods.forEach（（method,mapping）->｛

Method invocableMethod = AopUtils.selectInvocableMethod（method, userType）：

registerHandlerMethod （handler,invocableMethod, mapping）；

｝冫

Protected void registerHandlerMethod （Object handler,Method method,T mapping） ｛

this.mappingRegistry.register（mapping,handler, method）；

MappingRegistry 中存放了 URI 与 HandlerMethod 的映射关系，在Dispatcher

Servlet 接收到客户端请求时，可以根据 URI 找到合适的HandlerMethod，进⽽定位到可

以处理请求的Handler，将请求转发到实际的 Controller 中。

IOC 容器中的 bean 对象全部检查完成后，所有 Controller 中的 Handler 方法全部装载到

RequestMappingHandlerMapping中，HandlerMapping 的初始化动作就完成了。


## 12.4 DispatcherServlet 的工作全流程解析

本节内容是本章的重点和难点，我们来探讨 WebMvc 在实际运⾏期间 DispatcherServlet

对于请求处理和响应的全流程执⾏原理。作 WebMvc的核心前端控制器，Dispatcher

Servlet 默认会接收所有请求并分发处理。本节内容使用 springboot-01-quickstart 的

示例项目，实际调试 DispatcherServlet 的核心工作全流程。

启动 springboot-01-quickstart 示例项目，并在 Dispatcherservlet 的⽗类

FrameworkServlet 的 service 方法上打入断点，随后使用浏览器访问 http://localhost：

8080/hello，待程序停在断点处，开始Debug 调试。


## 12.4.1 DispatcherServlet#service

调试从 FrameworkServlet 开始，⾸先 service 方法会对 PATCH类型的请求单独处理，

PATCH 类型的请求本⾝是对PUT 类型的补充，⼀般用于资源的局部更新。通常在项目开发中

不会使用 PATCH 类型的请求。继续向下执⾏ else 块的 super.service 方法，⽽

FrameworkServlet 的⽗类 HttpServlet 会根据不同的请求类型将方法转发⾄ doxxx 方

法中，所以最终执⾏的是 FrameworkServlet 中重写的doGet、doPost 等方法，⽽这些

方法最终调用的都是⼀个名为 processRequest 的方法，如代码清单 12-9所示。


## 12.4 DispatcherServet 的工作全流程解析|

1代码清单 12-9 FrameworkServlet#service

@Override

protected void service （HttpServletRequest request, HttpservletResponse response）

throws ServletException, IOException 1

HttpMethod httpMethod = HttpMethod.resolve （request.getMethod （））；

if（httpMethod == HttpMethod.PATCH II httpMethod == nul1） ｛

processRequest （request,response）；

｝else｛

super.service （request,response）；

｝

｝

protected final void doGet （HttpservletRequest request,HttpservletResponse response）

thzows ServletException,IOException ｛

processRequest （request,response）；

protected final void doPost （HttpservletRequest request, HttpservletResponse response）

throws ServletException, IoException（

ProcessRequest （request, response）；


## 12.4.2 processRequest

processRequest 方法中会对请求进⾏⼀些前置处理，随后转调doService 方法处理请

求。请注意代码清单 12-10 中标有注释的部分，这⾥⾯有⼀个细节：线程隔离。

【代码清单 12-10 processRequest 预处理请求

protected final void processRequest （HttpServletRequest request,HttpServletResponse response）

throws ServletException,IOException ｛

1/ 记录接收请求的时间

long startTime = System.currentrimeMi1lis （）；

Throwable failureCause = null；

// 获取当前线程的 LocaleContext，并创建当前线程的 Localecontext

LocaleContext previouslocaleContext = LocaleContextHolder.getLocaleContext （）；

LocaleContext localeContext = buildLocaleContext （request）；

1/ 获取当前线程的 RequestAttributes，并创建当前线程对应的 ServletRequestAttributes

RequestAttributes previousAttributes = RequestContextHolder.getRequestAttributes （）；

ServletRequestAttributes requestAttributes =

buildRequestAttributes （request,response,previousAttributes）；

WebAsyncManager asyncManager = WebAsyncUtils.getAsyncManager （request） ；

asyncManager.registerCallableInterceptor （FramewOrkServlet.class.getName（），

new RequestBindingInterceptor （））；

// 初始化ContextHolder，传入新封装好的请求参数和上下⽂，目的是隔离线程

initContextHolders（request,localeContext,requestAttributes）；

try｛

1/ 子类的模板方法

doService （request,response）；

｝1/ catch

|第12章 Spring Boot 整合 WebMvc

finally ｛

// 重新设置当前线程的 LocaleContext 和 RequestAttributes

resetContextHolders （request,previouslocaleContext,PreviousAttributes）；

i£ （requestAttributes ！= nul1）｛

requestAttributes.requestCompleted （）；

logResult （request,response, failureCause,asyncManager）：

1/ 发布 ServletRequestHandledEvent 事件

publishRequestHandledEvent （request, response,startrime,failureCause）；

protected abstract void doService （HttpServletRequest request, HttpServletResponse response）

throws Exception；

注意，在 initContextHolders 方法执⾏之前，processRequest 方法中会获取当前

线程的 Localecontext 和 RequestAttributes 并暂存到方法中，随后使用当前请求的

REQUEST与 RESPONSE 对象构造全新的Localecontext 与 RequestAttributes，并设置

到当前线程上下⽂中（⻅代码清单 12-11），以此完成线程之间的隔离。

代码清单 12-11 initContextHolders 设置当前请求对应的模型

private void initContextHolders （HttpServletRequest request，

@Nullable Localecontext localecontext，@Nullable RequestAttributesrequestAttributes）｛

if（localeContext ！= nu11）｛

LocalecontextHolder.setLocalecontext （1ocalecontext,this.threadContextInheritable）；

i （requestAttributes ！=nu11） ｛

RequestContextHolder.setRequestAttributes （requestAttributes，

this.threadContext Inheritable）：


## 12.4.3 doService

ProcessRequest 方法的前置方法处理完成后，下⼀步的核心动作是 doService 方法，

但是请注意，doService 方法仍然不是真正处理请求的方法，如代码清单12-12 所舌。

•代码清单 12-12 doService 预处理请求

protected void doService （HttpServletRequest request, HttpServletResponse response）

throws Exception｛

logRequest （request）；

/1 判断请求参数中是否存在 javax.servlet.include.request_uri

Map<String,Object> attributesSnapshot = null；

i （Webutils.isIncludRequest （request））｛

attributesSnapshot = new HashMap<>（）：

Enumeration<？> attrNames = request .getAttributeNames （）；

while （attrNames.hasMoreElements （））｛

string attrName = （String）attrNames.nextElement （）；

if （this.cleanupAfterInclude I| attrName.startswith （DEFAULT_STRATEGIES_PREFIX））！

attributesSnapshot.put （attrName,request.getAttribute （attrName））；

下⾯简单解释这两个动作对应的源码的作用。

所示。

传入后端以供认证，当登录成功后使用重定向将客户端引导⾄系统主页。在这个前提下有⼀个

特殊的场景：如果用户登录时提交的登录表单中有⼀些需要在跳转⾄主页时渲染的数据，则仅


## 12.4 DispatcherServlet 的工作全流程解析|

1……

// flashMapManager

if （this.flashMapManager ！= nul1）｛

FlashMap inputFlashMap = this.flashMapManager.retrieveAndUpdate （request, response）；

if （inputFlashMap ！= nu11）｛

request.setAttribute （INPUT_FLASH_MAP_ ATTRIBUTE，

collections.unmodifiableMap （inputFlashMap））；

quest.setAttribute （OUTPUT_FLASH_MAP_ATTRIBUTE,new FLashMap（）

quest .setAttribute （FLASH_MAP_MANAGER_ATTRIBUTE, this.flashMapManager

try｛

// 真正处理请求的方法

doDispatch （request,response）；

｝// Einally ⋯.....

由代码清单 12-12 中可以大体了解doService执⾏的请求预处理逻辑，这⾥有两个动作，

1. islncludRequest 的判断

在doService 的第⼀个if判断结构中会调用WebUtils.isInclude Request （request）

方法检查当前的 HttpServletRequest 是否是“include” 请求，⽽方法的实现中会判断请求

中是否包含名为"javax.servlet.include.request_ur⽴"的属性，如代码清单 12-13

代码清单 12-13 检查请求是否为 “include” 请求

Public static final String INCLUDE_REQUEST_URI_ATTRIBUTE = "javax.servlet.include.request_uri"；

Public static boolean isIncludRequest （ServletRequest request）

return （request.getAttribute （INCLUDE_REQUEST_URI_ATTRIBUTE）

！= mu11）；

有关"javax.servlet.include.request_uri "属性的含义，在 Servlet 3.0 规范中有

这样⼀段描述：已经被另⼀个 Servlet 使用 RequestDispatcher 的include 方法调用过

的 servlet，有权访问被调用过的Servlet 的路径。这段描述中的include 方法，其实指

代的是在JSP 中使用的<jsp:incluedepage="xxx.jsp"/>标签，使用该标签可以组合其他

⻚⾯以完成⻚⾯共用部分的抽取。所以 isIncludRequest 方法的作用是区别⻚⾯的加载是

否由<jsp:include>标签⽽来。

2. flashMapManager 的设计

有关 flashMapManager 的设计，需要读者回顾⼀个经典的业务场景：用户登录。在传统

的前后端不分离的开发场景中，用户登录的场景通常是使用 POST请求将用户名、密码等信息

放入 request 域中⽆法解决问题。SpringWebMve 在3.1 版本后引入了 FlashMapManager 来解

该设计仅需了解，感兴趣的读者可以⾃⾏翻阅相关资料和⽂档加以了解。


## 12.4.4doDispatch

为多个部分研究。

下改变具体的实现类。

】第12章Spring Boot 整合 WebMvc

决该问题，可以在⻚⾯重定向发⽣跳转时将需要渲染的数据暂时放入 session 中，这样浏览器即

便刷新也不会影响数据渲染。

doservice 的预处理完成后，下⼀步是⾄关重要的核心处理请求和响应的方法：

doDispatch。由于 doDispatch 方法的篇幅⾮常⻓，为了确保阅读体验和理解，下⾯会拆分

1． ⽂件上传解析

doDispatch 方法的第⼀段源码是处理带有⽂件上传的请求，如代码清单 12-14所示。请

注意，核心处理⽂件上传请求的 checkMultipart 方法传入⼀个 HttpServletRequest 对

象，再返回⼀个 HttpServletRequest 对象，这⼀动作的目的是在保持接口类型不变的前提

1代码清单 12-14 doDispatch （1）

Protected void doDispatch （HttpServletRequest request, HttpServletResponse response）

throws Exception ｛

HttpServletRequest processedRequest = request ；

HandlerExecutionChain mappedHandler = nu11；

boolean multipartRequestParsed = false；

WebAsyncManager asyncManager = WebAsyncUtils.getAsyncManager （request）；

try｛

ModelAndView mv = nul1；

Exception dispatchException = null；

try｛

1/ 此处会处理⽂件上传的情况

processedRequest = checkMultipart （request）；

multipartRequestParsed =（processedRequest ！= request）；


protected HttpServletRequest checkMultipart （HttpServletRequest request）

throws MultipartException ｛

i£（this.multipartResolver ！= nul1 && this.multipartResolver.isMultipart （request））｛

i（WebUtils.getNativRequest （request,MultipartHttpServletRequest.class）！= nul1）｛

if （request.getDispatcherType （）.equals （DispatcherType.REQUEST））｛

/1 logger •

｝ else if （hasMultipartException （request））｛

1/ logger ⋯...

｝ else｛

try｛

return this.multipartResolver.resolveMultipart （request）；

｝1/ catch •.

return request；


## 12.4 DispatcherServlet 的工作全流程解析|

通过代码清单 12-15 的下半部分可以看到，处理⽂件上传请求的核心组件是 multipart

Resolver，它可以将⼀个由 Servlet 容器处理的HttpServletRequest 对象转换为可以访问

请求中⽂件对象的 MultipartHttpServletRequest 子接口对象。⽽判断⼀个请求是否为

multipart 请求的依据是 content-type 是否以"multipart/"开头，由于当前正在 Debug 的

请求很明显只是⼀个普通的GET请求，因此不会进入该部分。

【代码清单 12-15 doDispatch （2）

1/ Determine handler for the current request.

mappedlandler - getHandler（processedRequest）；

if（mappedHandler == null）｛

noHandlerFound（processedRequest, response）；

protected HandlerExecutionChain getHandler （HttpServletRequest request）throws Exception ｛

i£ （this.handlerMappings ！= null）｛

for（HandlerMapping mapping :this.handlerMappings）｛

HandlerExecutionChain handler = mapping.getHandler （request）；

i£（handler ！= null）｛

return handleri

return null；

感兴趣的读者可以将当前项目整合视图模板引擎（如 Thymeleaf 或 FreeMarker 等）后，编写

带有⽂件上传的表单⻚⾯，配合后端 Controller 编写的方法进⾏处理和调试，本书不对此展开。

2. 获取第⼀个可用的 Handler

紧接着的部分是 DispatcherServlet 核心处理流程的第⼀步：搜索 Handler。代码清单12-14

的 getHandler 方法的核心逻辑是从所有 HandlerMapping 中寻找可以返回⾮空 Handler

ExecutionChain 对象的 HandlerMapping，逻辑与 12.2.3 节相呼应。

Debug ⾄ getHandler 方法的内部，可以发现 DispatcherServlet 中有 5个 Handler

Mapping。由于在示例项目中编写的Handler 都是以@Controller+ @RequestMapping 注解

实现的，因此对应的关键实现是在 WebMvcAutoConfiguration 中注册的 RequestMapping

HandlerMapping，它位于 handlerMappings 的第0位，如图12-6所示。

oo this.handlerMappings = ｛ArrayList @5274） size = 5

> = 0 = ｛RequestMappingHandlerMapping@5308｝

> 1= ｛BeanNameUrlHandlerMapping@5309｝

> 2= ｛RouterFunctionMapping@5310｝

> • 3 = ｛SimpleUriHandlerMapping@5311｝


## 0 4 = （WelcomePageHandlerMapping@5312）

图 12-6 Debug 可⻅有5个 HandlerMapping

子类负责具体的功能实现。

|第12章 Spring Boot 整合WebMvc

将断点打在 return handler：⼀⾏并放⾏程序，断点停在 RequestMappingHlandler

Mapping 的循环中，说明以@Controller + @RequestMapping 注解编写的 Handler 底层由

RequestMappingHandlerMapping 负责处理。下⾯进入 RequestMappingHandler

Mapping 的getHandler 方法中。

提示：从此处开始，读者可以⾮常强烈地感受到 WebMvC 中源码的⻛格，⽗类提供流程的抽象定义，

进入 getHandler 方法后，发现程序实际进人的类是 RequestMappingHandlerMapping

的⽗类 AbstractHandlerMapping，⽽⽗类的方法中⼜定义了需要子类实现具体功能的

getHandlerInterna1 方法，由此就体现出了上⾯提到的⽗类定义流程，子类负责实现，如

代码清单 12-16所舌。

1代码清单 12-16 AbstractHandlerMapping#getHandler

public final HandlerExecutionChain getHandler （HttpServletRequest request）throws Exception｛

// 留给子类的模板方法

Object handler = getHandlerInternal （request）；

// 构建HandlerExecutionchain

HandlerExecutionChain executionChain = getHandlerExecutionChain （handler,request）；

return executionChain；

抽取 getHandler 方法的核心逻辑有两步：由子类具体获取 Handler 的具体对象；根据

Handler 对象构建 HandlerExecutionChain 对象。逐⼀来看。

（1） getHandlerInternal

Debug进入getHandlerInterna1方法，发现程序会先进入RequestMappingHandler

Mapping 的直接⽗类 RequestMappingInfoHandlerMapping 中，不过⽗类的方法实现是

直接调用 super.getHandlerInternal（request），⽽继续往上调用，会来到抽象⽗类

AbstractHandlerMethodMapping 中，如代码清单12-17 所示。

代码清单 12-17 AbstractHandlerMethodMapping#getHandlerInternal

Procectea HanaLermetnoo gethanoLerlnterla上（htupoervLetkeguest Leguest/ Curows txceptLon

String lookupPath = getUr1PathHelper （）.getLookupPathForRequest （request）；

request.setAttribute （LOOKUP_PATH,100kupPath）；

this.mappingRegistry.acquireReadLock （）；

try｛

HandlerMethod handlerMethod =1ookupHandlerMethod（1ookupPath,request）；

return（handlerMethod！= nul1 ? handlerMethod.createWithResolvedBean（）：null）；tinally..

⽗类的实现有必要详细研究，第⼀⾏源码会借助Ur1PathHelper 获取到本次请求的URI，

即"/he11o"，接下来进入 try-finally 结构中执⾏ 1ookupHandlerMethod 方法，从本⾝的

HandlerMethod 集合中检查是否有可以处理当前 URI 请求的HandlerMethod 对象。

并重新封装。


## 12.4 DispatcherServlet 的工作全流程解析|

经过 1ookupHandlerMethod 方法检索后，可以成功获取到 Hel1oController 中的

hel1o方法，如图 12-7所示。

0oKuprath =ello

nanale/metod =$ateimeino0622/3203m2a0

T logger = （LogAdapterSsif4jL.ocationAwarelog@5309）

bean = 'helloController"

•beanFactory =｛DetautListabieBeanfactory@53iwi..tosminag

>beanfype = IClass@4492）.. Navigate

>method = （Method@5312） "public java.lang.String com.linkedbear.springboot.quickstart.controller.HelloController.hello0'

>V bridgedMethod = （Method@5312｝ 'public java.lang.string com.linkedbear.springboot.quickstart.controller.HelloController.hello0"

parameters= （MethodParameter［0）@5313）

* responseStatus = null

f responseStatusReason = null

. resoivearfomhianalerethod = nuul

s.. mtenacerafamererAnnotations = nui

description = "com.jinkedbear.sorinaboot.avickstart.controller HelloController#hello0"

图12-7 依据 URI 可以检索到 HelloController 的hello 方法

获取到 HandlerMethod 对象之后，下⼀步还要执⾏ createWithResolvedBean 方法

创建⼀个全新的 HandlerMethod 对象。可能有读者不理解为什么还要再次创建，有这个疑惑

的读者可以仔细观察图12-7中 handlerMethod 对象的bean 属性，它是⼀个字符串⽽不是

BeanFactory 中真实存在的 HelloController 对象，⽽且其余的属性中也没有 He110

controller 对象的持有，所以为了获取HelloControler 对象，需要执⾏代码清单12-18

中的 createWithResolvedBean 方法，从 BeanFactory 中取出 HelloController 对象

代码清单 12-18 createWithResolvedBean 从 BeanFactory 中取出 bean 对象

public HandlerMethod createwithResolvedBean（）｛

Object handler = this.bean；

if（this.bean instanceof String）｛

Assert.state（this.beanFactory ！= null， "Cannot resolve bean name without BeanFactory"）；

String beanName = （String）this.bean；

handler = this.beanFactory.getBean （beanName）；

return new HandlerMethod（this,handler）；

重新封装完成后，获取 Handler 的动作结束。

（2） 构建 HandlerExecutionChain

检索并封装 HandlerMethod 之后，getHandler 方法并不会将其返回，⽽是会组合

WebMvc 中注册的拦截器，因为每个请求对应的所需执⾏的拦截器不同，需要在处理请求之前

再匹配。构建 HandlerExecutionChain 的流程不太复杂，getHandlerExecutionChain

方法会根据HandlerInterceptor 的类型分别处理，如代码清单 12-19所示。

代码清单 12-19 根据当前请求构建 HandlerExecutionChain

Protected HandlerExecutionChain getHlandlerExecutionchain （Object handler，

HttpServletRequest request）｛

HandlerExecutionChain chain = （handler instanceof HandlerExecutionChain ？

（HandlerExecutionChain） handler :new HandlerExecutionChain （handler））；

【第12章 Spring Boot 整合 WebMvc

string lookupPath = this.urlPathHelper.getLookupPathForRequest （request,LOOKUP_PATH）；

for （HandlerInterceptor interceptor : this.adaptedInterceptors）｛

if （interceptor instanceof MappedInterceptor）｛

MappedInterceptor mappedInterceptor =（MappedInterceptor） interceptor；

// 匹配路径的拦截器

i （mappedInterceptor.matches （1ookupPath,this.pathMatcher））｛

chain.addInterceptor （mappedInterceptor.getInterceptor （））；

｝ else｛

// 普通拦截器

chain.addInterceptor （interceptor）；

return chain：

匹配并组合拦截器后，HandlerMapping 的工作全部完成，接下来回到 Dispatcher

Servlet 中。

3. 获取 HandlerAdapter

下⾯是 DispatcherServlet 核心处理流程的第⼆步，会根据 HandlerMapping 匹配到

的Handler 对象，寻找可以执⾏它的HandlerAdapter，对应的流程参⻅ 12.2.4节。⽽

getHandlerAdapter 的方法实现与 getHandler 如出⼀辙，如代码清单 12-20所示。

代码清单 12-20 doDispatch （3）


1/ 为当前请求确定 HandleraAdapter

HandlerAdapter ha = getHandlerAdapter （mappedHandler .getHandler（））；

Protected HandlerAdapter getHandlerAdapter （Object handler） throws ServletException ｛

i （this.handlerAdapters ！= nul1）｛

Eor（HandlerAdapter adapter : this.handlerAdapters）｛

if （adapter.supports （handler））｛

return adapter；

throw ex.•.•..

Debug ⾄此，可以发现有4个 HandlerAdapter 的实现类对象，如图12-8所示。

oo this.handlerAdapters = （ArrayList@5327） size = 4

> 0 = （RequestMappingHandlerAdapter@5427）

> 8 1= （HandlerFunctionAdapter@5428｝

>：2= （HttpRequestHandlerAdapter@5429）

• 2 3= （SimpleControllerHandlerAdapter@5430）

图 12-8 Debug 可见有4个 HandlerAdapter

实际负责匹配的实现对象显然是 RequestMappingHandlerAdapter，⽽它的匹配规则


## 12.4 DispatcherServlet 的工作全流程解析|

仅是判断 Handler 的类型是不是 HandlerMethod，如代码清单 12-21 所示。根据设计，Request

MappingHandlerMapping 与 RequestMappingHandlerAdapter 本身就是互相匹配的，

所以这⾥的匹配结果必定返回 true。

1代码清单 12-21 RequestMappingHandlerAdapter 的匹配规则

Public final boolean supports （Object handler）｛

return （handler instanceof HandlerMethod && supportsInternal（（HandlerMethod）handler））；

protected boolean supportsInternal（HandlerMethod handlerMethod）｛

return true；

4. 回调拦截器

经过 HandlerMapping 的检索和 HandlerAdapter 的适配后，下⾯的动作是执⾏

Handler 的逻辑。不过在执⾏Handler 的逻辑之前，先要执⾏项目中注册的可以匹配当前请求的

拦截器。根据HandlerInterceptor 的设计规则，⾸先会执⾏ preHandle 方法的拦截，对

应到代码清单12-22 中可以发现，它的触发方式仅是简单的循环依次调用。

代码清单 12-22 doDispatch （4）

if （！mappedHandler.applyPreHandle （processedRequest, response）） ｛

return；

1……..

boolean applyPreHandle （HttpservletRequest request, HttpservletResponse response）

throws Exception｛

HandlerInterceptor［］ interceptors = getInterceptors （）；

if（！ObjectUtils.isEmpty（interceptors））｛

Eor （int i = 0; i < interceptors.length; i++）｛

HandlerInterceptor interceptor = interceptors ［i］；

if（！interceptor.preHandle （request,response,this.handler））｛

triggerAfterCompletion （request,response,nul1）；

return false；

this.interceptorIndex = i；

｝

return true；

另外请注意，从 applyPreHandle 方法的逻辑中可以看到，如果 preHandle 方法返回

了 false，则内部的if结构会触发并返回 false。如果 mappedHandler.apPlyPreHandle 方

法返回 false，则会直接返回，不会继续执⾏ doDispatch 方法的后续逻辑。

5. 执⾏ Handler+回调拦截器

接下来是执⾏ Di spatcherServlet 核心处理流程的第三步，Dispatcherservlet 会

委托HandlerAdapter 执⾏具体的 Handler 方法，⽽执⾏ Handler 方法的 HandlerAdapter

部，继续往下跟进。

码，下⾯将其拆分为多个⽚段讲解。

|第12章 Spring Boot 整合WebMvc

是 RequestMappingHandlerAdapter 的⽗类 AbstractHandlerMethodAdapter，其

handle 方法⼜会转调模板方法 handleInterna1 方法，如代码清单 12-23所示。

1代码清单 12-23 doDispatch （5）

1/

1/ 实际调用Handler

mv = ha.handle （processedRequest，response,mappedHandler.getHandler（））；

// AbstractHandlerMethodAdapter

public final ModelAndView handle （HttpServletRequest request，

HttpServletResponse response,Object handler）throws Exception ｛

return handleInternal （request, response，（HandlerMethod） handler）；

？提示：可能有读者会发现 WebMvc 中的源码⻛格与核心包不同，在前⾯有关IOC 和 AOP的章节中，

⽗类调用子类的方法的命名规范通常是 xxx -doxxx 方法，但是在 WebMvc 中大多数情况是 xxx

-XxxInternal 方法，读者在阅读源码时⼀定要多加注意。

（1） handleInternal

进入 RequestMappingHandlerAdapter 的handleInterna1 方法，如代码清单 12-24

所示。忽略与主线逻辑⽆关的源码后，可以提取出的最核心方法是 else 块中的 invokeHandler

Method方法，这个方法相当于将 Handler 方法的执⾏转移⾄ invokeHandlerMethod 方法内

代码清单 12-24 RequestMappingHandlerAdapter 的 handlelnternal 方法

Protected ModelAndView handleInternal （HttpServletRequest request，

HttpServletResponse response,HandlerMethod handlerMethod）throws Exception ｛

ModelAndView mav；

checkRequest （request）；

1/ 同步 session 的配置，默认不同步，执⾏下⾯的invokeHandlerMethod方法

if （this.synchronizeonSession）｛

Else|

mav = invokeHandlerMethod （request, response,handlerMethod）；

1/ Cache-Contro1 相关的处理 ⋯••.

return mav；

（2） invokeHandlerMethod

接下来研究的 invokeHandlerMethod 方法篇幅较⻓，为便于读者更好地阅读和理解源

（a）参数绑定器初始化

第⼀个要重点研究的方法是 getDataBinderFactorY，这个方法会初始化⼀个参数绑定

器，用于将客户端请求中参数和请求体的数据映射到Handler 的形参中，如代码清单 12-25所示。

WebMvc中有⼀个注解@InitBinder，它可以单独声明在⼀个 Controller 中，执⾏当前 Controller


## 12.4 DispatcherServlet 的工作全流程解析|

中的方法时，会先执⾏标注了@InitBinder 注解的方法，初始化⼀些参数绑定器的逻辑。另

外，熟悉 WebMvc 的读者⼀定会了解注解BControllerAdvice，这个注解可以配合

@InitBinder 注解标注的方法，实现全局的参数绑定器预初始化。代码清单 12-26展示了⼀

个简单的@InitBinder 注解的使用。

代码清单 12-25 初始化 WebDataBinderFactory

Protected ModelAndView invokeHandlerMethod （HttpServletRequest request，

HttpservletResponse response,HandlerMethod handlerMethod）throws Exception ｛

ServletWebRequest webRequest = new ServletWebRequest （request,response）；

try｛

1/ 参数绑定器初始化

WebDataBinderFactory binderFactory = getDataBinderFactory （handlerMethod）；

代码清单12-26 @ControllerAdvice + @InitBinder 注解的使用

@ControllerAdvice

public class ConversionBinderAdvice ｛

aInitBinder

public void addDateBinder （WebDataBinder dataBinder）｛

dataBinder.addCustomFormatter（new DateFormatter（"yyyy 年MM 月dd 日"））；

底层收集和执⾏@InitBinder 注解标注方法的逻辑就是这个 getDataBinderFactory

方法，该方法中会将当前请求的 Handler 所在 Controller 中标注了@InitBinder 注解的方法全

部取出，之后组合所有标注了@ControllerAdvice 注解的 Controller 类中标注了@InitBinder

注解的方法，共同组成参数绑定器的初始化器，如代码清单 12-27所示。

1代码清单 12-27 getDataBinderFactory 组合所有参数绑定器的初始化器

private WebDataBinderFactory getDataBinderFactory （HandlerMethod handlerMethod）

throws Exception｛

Class<?> handlerType = handlerMethod.getBeanType （）；

Set<Method> methods = this.initBinderCache.get （handlerType）：

i（methods == nul1）｛

// 筛选当前 Controller 中被@InitBinder 注解标注的方法

methods = MethodIntrospector.selectMethods （handlerType,INIT_BINDER_METHODS）；

this.initBinderCache.put （handlerType,methods）；

List<InvocableHandlerMethod> initBinderMethods = new ArrayList<> （）；

// 组合全局的被@InitBinder 注解标注的方法

this.initBinderAdviceCache.forEach （（controllerAdviceBean, methodset）->｛

i£ （controllerAdviceBean.isApp1icableToBeanType （handlerType））｛

Object bean = controllerAdviceBean.resolveBean （）；

for（Method method :methodSet）｛

initBinderMethods.add （createInitBinderMethod （bean,method））；

｝）；

况下的数据回显，还拥有公有数据暴簬、请求数据处理的能⼒，它的收集规则与@InitBinder

|第12章 Spring Boot 整合WebMvc

for（Method method:methods）｛

Object bean = handlerMethod.getBean （）；

initBinderMethods.add （createInitBinderMethod （bean,method））；

return createDataBinderFactory （initBinderMethods）；

（b）参数预绑定

紧接着的初始化逻辑是参数预绑定部分，如代码清单 12-28 所示，预绑定这个概念不是很

好理解，可能读者会更熟悉@Mode1Attribute 注解，这个注解除了可以⽀持前后端不分离情

注解大同小异，如代码清单 12-29所示，不再赘述。

1代码清单 12-28 参数预绑定的初始化


// 参数预绑定

ModelFactory modelFactory = getModelFactory（handlerMethod,binderFactory）；

代码清单 12-29 getModelFactory 收集所有标注了@ModelAttribute 注解的方法

public static final MethodFilter MODEL_ATTRIBUTE_METHODS = method ->

（！AnnotatedElementUtils.hasAnnotation （method,RequestMapping.class）

&& AnnotatedBlementUtils.hasAnnotation（method,ModelAttribute.class））；

private ModelFactory getModelFactory（HandlerMethod handlerMethod，

WebDataBinderFactory binderFactory）｛

SessionAttributesHandler sessionAttrHandler =

getSessionAttributesHandler （handlerMethod）；

Class<?> handlerrype = handlerMethod.getBeanType （）；

Set<Method> methods = this.mode1Attributecache.get （handlerType）；

if （methods == nul1）｛

1/ 筛选出被@Mode1Attribute 标注且没有被@RequestMapping标注的方法

methods = MethodIntrospector. selectMethods （handlerType,MODEL_ATTRIBUTE_METHODS）；

this.modelAttributeCache.put （handlerType,methods）；

1/ 组合全局的被@ModelAttribute 标注的方法⋯

return new ModelFactory（attrMethods,binderFactory,sessionAttrHandler）；

（c）创建方法执⾏对象

下⼀个动作是创建 ServletInvocableHandlerMethod 对象，源码中仅是对Handler

Method 进⾏⼆度封装，如代码清单12-30所示，封装后的模型会在下⾯执⾏ Controller 方法时

用到。

代码清单 12-30 创建 ServletlnvocableHandlerMethod 对象


1/ 创建方法执⾏对象

11…....

ServLetinvocabLeHandlermethod invocabLemethod = CreatelnvocabLehandLermethod （handLermethod）：

调试源码，这⾥不再展开。

方法。

分为多个⽚段讲解。

返回值的处理。


## 12.4 DispatcherServlet 的工作全流程解析|

protected Servlet InvocableHandlerMethod createInvocableHandle rMethod （Handlerwethod handlerMethod） ！

return new ServletInvocableHandlerMethod （handlerMethod）；

（d） ModelAndView、异步请求的处理

紧跟着的两段源码中完成的工作是创建 Mode1AndView 的容器Mode1AndViewContainer

以及对异步请求的⽀持。由于这部分源码不是很重要，感兴趣的读者可以⾃⾏借助IDE 翻阅和

（e）执⾏ Controller 的方法

接下来执⾏的核心逻辑就是上⾯创建的 ServletInvocableHandlerMethod 中的 invoke

AndHandle 方法，如代码清单12-31 所示。由于这个方法内部很⻓，因此下⾯单独讲解该

】代码清单 12-31 执⾏ Controller 的方法

11….

1/ 执⾏ controller的方法

invocableMethod.invokeAndHandle（webRequest, mavContainer）；

i£ （asyncManager.isconcurrentHandlingstarted（））｛

return null；

// 包装 ModelAndView

return getModelAndView （mavContainer, modelFactory, webRequest）；

｝// finally⋯.

（3） invokeAndHandle（反射）

下⼀个步骤是利用反射机制调用 Handler 的方法，对应的invokeAndHandle 方法（⻅代

码清单 12-32）及后续涉及的环节篇幅较长，为了便于读者更好地阅读和理解源码，下⾯将其拆

代码清单 12-32 invokeAndHandle

public void invokeAndHandle （ServletWebRequest webRequest,ModelAndViewContainer mavContainer，

Object.•providedArgs） throws Exception ｛

Object returnValue = invokeForRequest （webRequest,mavContainer,ProvidedArgs）；

（a）反射执⾏ Controller 方法

由代码清单12-33中可以明显看到，RequestMappingHandlerAdapter 执⾏ Controller

方法的核心是，在收集好执⾏ Handler 方法所需的参数列表后利用反射机制执⾏目标 Controller

的方法。doInvoke 方法执⾏完毕后，就意味着 Controller 的工作已经完成，下⾯的部分是对

代码清单 12-33 invokeForRequest 反射执⾏ Handler

public Object invokeForRequest（NativeWebRequest request，

@Nullable ModelAndViewContainer mavContainer,object..providedArgs）throws Exception｛

Object I］ args = getMethodArgumentValues （request,mavContainer,providedArgs）；

1第12章 Spring Boot 整合 WebMvc

return dolnvoke（aras）：

Procectea Vl］ect aornvoke （UoJect••args） curons LxceptLon 1

try｛

return getBridgedMethod （）.invoke （getBean （），args）；

/l Catcn......

（b）处理方法返回值

invokeAndHandle 方法最后的 try-catch 部分是解析并处理返回值的逻辑，如代码清单12-34

所示。由于 returnValueHandlers 是⼀个复合对象，它的内部组合了⼀组 HandlerMethod

ReturnValueHandler，根据之前阅读源码的经验不难得知，它的内部会使用 for 循环去匹配

可以处理当前 Controller 返回值的 HandlerMethodReturnValueHandler 并实际处理，如

代码清单 12-35所舌。

代码清单 12-34 invokeAndHandle 中处理返回值的部分

private HandlerMethodReturnValueHandlerComposite returnValueHandlers；

public void invokeAndHandle （ServletWebRequest webRequest,ModelAndViewContainer mavContainer，

Object.•ProvidedArgs）throws Exception ｛

Object returnValue = invokeForRequest（webRequest, mavContainer,providedArgs）；

11….

try｛

1/ 处理返回值

this.returnValueHandlers.handleReturnValue （

returnValue,getReturnValuerype （returnValue），mavContainer,webRequest）；

｝// catch •.

代码清单 12-35 利用 HandlerMethodReturnValueHandler 处理返回值

public void handleReturnValue （@Nullable Object returnValue,MethodParameter returnrype，

ModelAndViewContainer mavContainer,NativewebRequest webRequest）throws Exception ｛

1/ 选择合适的返回值处理器

HandlerMethodReturnValueHandler handler = selectHandler （returnValue, returnType）；


## 11 检查为空…….

handler.handleReturnValue （returnvalue,returnType,mavContainer,webRequest）；

private HandlerMethodReturnValueHandler selectHandler （@Nullable Object value，

MethodParameter returnType）｛

boolean isAsyncValue = isAsyncReturnValue （value,returnType）：

Eor（HandlerMethodReturnValueHandler handler :this.returnValueHandlers）｛

1/ 前置检查……•.

1/ 匹配⽀持处理返回值类型的HandlerMethodReturnValueHandler

if（handler.supportsReturnType （returnType））｛

ViewNameMethodReturnValueHandler，从它的类名上就可以直观地理解其作用，它处理


## 12.4 DispatcherServlet 的工作全流程解析！

return handler；

return null；

注意，对于返回视图和返回 JSON 数据，底层使用的 HandlerMethodReturnValue

Handler并不相同。下⾯分别就视图返回和 JSON 数据响应这两种常⻅场景展开讲解。

（c）处理视图返回

如果⼀个 Controller 方法最后要跳转视图，则方法的返回值⼀定是⼀个字符串，并且方法

和类上都没有标注@ResponseBody 注解，这种情况下对应的视图返回值处理器是

视图名称的逻辑是，通过执⾏ setViewName 方法将 Handler 返回的逻辑视图名放入 Model

AndViewContainer 中，如代码清单 12-36 的 handleReturnValue 方法所示。

代码清单 12-36 ViewNameMethodReturnValueHandler ⽀撑视图返回

Public boolean supportsReturnType （MethodParameter returnType）｛

Class<?> paramType = returnType.getParameterType （）；

// 判断返回值是不是 CharSequence （String）

return （void.class == Paramrype I| CharSequence.class.isAssignableFrom （paramType））；

Public void handleReturnValue （@Nullable Object returnValue,MethodParameter returnType，

ModelAndViewContainer mavContainer,NativewebRequest webRequest）throws Exception ｛

if （returnValue instanceof CharSequence）｛

String viewName = returnValue.toString （）；

mavContainer.setViewName （viewName）；

iE （isRedirectViewName （viewName））

mavContainer.setRedirectModelScenario （true）；

// else if throw ex ⋯•.

请注意，这个操作⾮常类似于直接操作 ModelAndView 对象的 API，但⼜不完全相同，

Mode1AndViewContainer 的内部并没有直接组合ModelAndView 对象，⽽是存储了⼀套与

Mode1AndView 相同的内部结构（包括 Mode1Map 集合以及VIEW视图对象）。此处执⾏的

setViewName 方法是将视图名称放入 Mode1AndViewContainer 的内部，在下⾯即将看到

的getModelAndView方法中会将ModelAndViewContainer转換为ModelAndView对象，

此时视图名称会转移到 ModelAndView 对象中。

（d）处理JSON 数据响应

如果⼀个 Controller 方法需要响应 JSON 数据，则需要在方法或方法所在类上标注

@ResponseBody 注解。处理 JSON 数据响应的底层实现是 RequestResponseBodyMethod

Processor，它在 handleReturnValue 方法中会执⾏ writewithMessageConverters

方法，使用JSON 序列化的方式将方法返回的数据（即 returnValue）转化⽂本，并直接

写人HttpServletResponse 的输出流中，如代码清单 12-37 所示。

对此展开。

|第 12 章 Spring Boot 整合 WebMvc

代码清单 12-37 RequestResponseBodyMethodProcessor ⽀撑 JSON 数据响应

public boolean supportsReturnType （MethodParameter returnType）｛

return （AnnotatedElementUti1s.hasAnnotation （returnType.getContainingClass （），

ResponseBody.class） I| returnType.hasMethodAnnotation （ResponseBody. class））；

public void handleReturnValue （@Nullable Object returnValue, MethodParameterreturnType，

ModelAndViewContainer mavContainer, NativeWebRequest webRequest）

throws IOException,HttpMediarypeNotAcceptableException，

HttpMessageNotWritableException ｛

mavContainer.setRequestHandled （true）；

ServletServerHttpRequest inputMessage = createInputMessage （webRequest）；

ServletServerHttpResponse outputMessage = createOutputMessage （webRequest）；

writeWithMessageConverters （returnValue,returnType, inputMessage, outputMessage）；

有关核心的JSON写人方法 writewithMessageConverters 的内部逻辑相对复杂，

感兴趣的读者可以借助IDE ⾃⾏深人探究，由于该部分内容相对不是重点，因此本书不再

（4） getModelAndView

invokeAndHandle 方法执⾏完成后，ModelAndViewContainer 中已经封装了数据对

象和视图响应，或是将需要响应的数据写人了 HttpServletResponse 中。回到 Request

MappingHlandlerAdapter 的 invokeHandlerMethod 方法中，最后⼀步需要执⾏的方法

是 getMode1AndView，如代码清单 12-38所示。getMode1AndView 方法的核心动作是将

ModelAndViewContainer 中的 ModelMap 与 View 对象取出，以此构建⼀个全新的

ModelAndView 对象，并在⼀些简单的后置逻辑处理动作后返回。


## 1 代码清单 12-38 invokeHandlerMethod 的最后执⾏ getModelAndView 方法

11……...

1/ 执⾏ Controller 的方法

invocableMethod.invokeAndHandle （webRequest,mavContainer）；

// 封装 ModelAndView

return getMode1AndView（mavContainer, modelFactory, webRequest）；

｝ // finally…....

Private ModelAndView getModelAndView （ModelAndViewContainer mavContainer，

ModelFactory modelFactory,NativeWebRequest webRequest）throws Exception ｛

1/ 前置准备逻辑⋯

1/ 注意此处将 ModelMap 取出

ModelMap model = mavContainer.getModel （）；

// 注意此处把视图名称取出，并组合⽣成 ModelAndView

Mode1AndView mav = new ModelAndView （mavContainer .getViewName （），model，

mavContainer.getStatus （））；

if （！mavContainer.isViewReference （））｛

mav.setView （（View） mavContainer.getView （））；

对象的转换。

法分为三个步骤，为了便于读者更好地阅读和理解源码，下⾯将拆分每个步骤分别研究。


## 12.4 DispatcherServlet 的工作全流程解析|

1…….

return mav：

简⾔之，getMode1AndView 方法完成了 Mode1AndViewContainer到ModelAndView

⾄此，HandlerAdapter 的工作全部完成，下⾯回到 DispatcherServlet 中。

（5）回调拦截器

执⾏完 HandlerAdapter 的handle 方法（⻅代码清单 12-39）后，下⼀步的核心动作是

调用所有HandlerInterceptor 的postHandle 方法，进⾏请求的后置拦截。从代码清单 12-40

的方法实现上可以看出，它的调用机制与 applyPreHandle ⼏乎完全⼀致，唯⼀不同的是回

调的顺序与 applyPreHandle 方法刚好相反。

1代码清单 12-39 doDispatch （6）

/1

// 实际调用 Handler

mv = ha.handle （processedRequest,response,mappedHandler .getHandler （））；

applyDefaultViewName （processedRequest, mv）；

mappedHandler.applyPostHandle （processedRequest, response,mv）：

11…….


## 1 代码清单 12-40 倒序回调所有 HandlerInterceptor

void applyPostHandle （HttpServletRequest request, HttpServletResponse response，

@Nullable ModelAndView mv） throws Exception ｛

HandlerInterceptor ［］ interceptors = getInterceptors （）；

iE （！ObjectUtils.isEmpty （interceptors））｛

// 注意此处是倒序回调

for （int i = interceptors.length - 1; i >= 0;i--）｛

HandlerInterceptor interceptor = interceptors ［i］；

interceptor.postHandle（request, response,this.handler,mv）；

6. 处理视图、解析异常

doDispatch 方法的核心 try-catch 块逻辑执⾏完毕后，进入 DispatcherServlet 核心

工作流程的最后⼀个关键步骤 processDispatchResult 方法，如代码清单 12-41 所示。该

方法会进⾏视图处理，以及解析整个请求处理中抛出的异常。processDispatchResult 方

代码清单 12-41 doDispatch （7）

人.....

mappedHandler.applyPostHandle （processedRequest, response, mv）；

1/ catch ….

1第12章 Spring Boot 整合WebMvc

processDispatchResult（processedRequest,response,mappedHandler,mv,dispatchException）；

（1）处理异常

DispatcherServlet 在处理客户端发起的请求时，中间调用 Controller 或者 Service 等组

件时抛出的异常⼏乎不可能是 ModelAndViewDefiningException（源码也没有任何构建

ModelAndViewDefiningException 的部分），所以代码清单 12-42中判断异常类型的if结

构可以忽略。在 else 块中的内部会调用 processHandlerException 方法，替换 Handler

Adapter 返回的ModelAndView 对象，可想⽽知这个 processHandlerException 方法就

是处理异常的核心逻辑，并针对异常情况重新⽣成 Mode1AndView 对象。

代码清单 12-42 processDispatchResult（1）

Private void processDispatchResult （HttpServletRequest request,HttpServletResponse response，

@Nullable HandlerExecutionChain mappedHandler，@Nullable ModelAndView mv，

@Nullable Exception exception） throws Exception ｛

boolean errorView = false；

// 处理异常

if （exception ！= nu11）｛

if （exception instanceof ModelAndViewDefiningException） ｛


｝else｛

Object handler =（mappedHandler ！= nul1 ? mappedHandler.getHandler（）：nul1）：

mv = ProcessHandlerException （request,response,handler,exception）；

errorView= （mv ！= null）；

ProcessHandlerException 方法的内部实现逻辑与其他核心组件⾮常相似，主⼲逻辑

都是从⼀组核心处理对象中筛选出⼀个可以处理当前逻辑的对象并返回，如代码清单12-43所

舌。不过在当前 Debug 调试的 springboot-01-quickstart 的舌例项目中并没有定义异常

处理器，Spring Boot 内置处理的异常处理器对于项目中出现的异常处理也只是简单抛出异常。

如果在舌例项目中添加⼀个标注有@ControllerAdvice 注解的 Controller，并声明标注有

@ExceptionHandler 注解的方法，就可实现全局统⼀异常处理。

代码清单 12-43 processHandlerException 处理异常

protected ModelAndView processHandlerException（HttpServletRequest request，

HttpServletResponse response，@Nullable Object handler,Exception ex）throws Exception ｛.....

ModelAndView exMv = null；

if（this.handlerExceptionResolvers ！= nul1）｛

Eor （HandlerExceptionResolver resolver : this.handlerExceptionResolvers）｛

exMv = resolver.resolveException （request,response,handler,ex）；

if （exMv！= null）｛

break；

方法中⾃⾏调试源码，本书不再对此展开。

｝


## 12.4 DispatcherServlet 的工作全流程解析|

throw ex；

本部分的源码底层逻辑与 HandlerAdapter 相似，感兴趣的读者可以⾃⾏编写带有抛出异常

的 Controller 方法，并配合统⼀异常处理完成异常处理的构建，在 processHandlerException

（2）渲染视图

⽆论是 HandlerAdapter 调用实际处理请求的Handler 正常响应，还是抛出异常后被统

⼀异常处理，最终都会⽣成⼀个 ModelAndView 对象。紧接着要处理的逻辑是视图的渲染，

⽽渲染视图的核心方法是在代码清单12-44 中迁块的render 方法。这个方法源码篇幅不⻓，

读者只需要关注代码清单 12-45中带有注释的源码，对于不重要的源码已进⾏了省略。

代码清单 12-44 processDispatchResult （2）

11…....

if （mv！= null && ！mv.wasCleared（））｛

render （mv,request,response）；

if （errorView）｛

Webutils.clearErrorRequestAttributes （request）；

1代码清单 12-45 render 渲染视图

protected void render（Mode1AndView mv,HttpServletRequest request,HttpservletResponse response）

throws Exception ｛


## 1 国际化处理 …•••

View view：

String viewName = mv .getViewName （）；

i£ （viewName ！= null）｛

1/ 如果有视图名，则解析出视图

view = resolveViewName （viewName,mv.getModelInternal （），locale,request）；

｝ else｛

// 否则，直接获取视图。如果还没有视图，则抛出异常

view = mv.getView （）；

try｛

if （mv.getStatus （）！= nu11） ｛

response.setStatus （mv.getstatus （）.value （））；

1/ 带入Model，渲染视图

view.render （mv.getModelInternal（），request,response）；

｝// catch …….

通读整段源码可以发现，render 方法会从 Mode1AndView 中获取逻辑视图的名称，如果

可以成功获取到逻辑视图名称，则会借助 ViewResolver 去匹配视图（最常⻅的实现是拼接

前后缀的 InternalResourceViewResolver），如果可以成功匹配到视图⽂件，则成功返回；

⾄此，ViewResolver 部分的工作执⾏完成。

Mapping 的场景总结。

负责响应视图。

|第12章 Spring Boot 整合WebMvc

如果匹配不到则抛出异常。匹配⽣成 View 对象后，会在最下⾯的try 块中执⾏view.render

方法，该方法在整合不同的前端模板引擎（如 Thymeleaf、FreeMarker 等）时会有不同的实现，

具体的实现不需要了解，读者只需要知道View 对象的render 方法可以实际渲染视图。

（3）回调拦截器

视图渲染完成后，最后的收尾动作是回调拦截器的 aftercompletion 方法，如代码

清单 12-46所舌，其底层实现与前置、后置拦截相似，这⾥不再展开。

』代码清单 12-46 processDispatchResult （3）

// 回调拦截器的 afterCompletion

if（mappedHandler ！= nul1） ｛

mappedHandler.triggerAfterCompletion （request, response,nu11）；

processDispatchResult 方法执⾏完毕后，整个 doDispatch 方法的主⼲逻辑全部执

⾏完毕，⼀次完整的 DispatcherServlet 请求处理与响应就完成了。


## 12.4.5 DispatcherServlet 工作全流程小结

简单总结⼀下 DispatcherServlet 的工作全流程，以下的全流程是针对@Request

1.客户端向服务端发起请求，由 DispatcherServlet 接收请求。

2. DispatcherServlet 委托 HandlerMapping，根据本次请求的 URL 匹配合适的

Controller 方法。

3. HandlerMapping 找到合适的 Controller 方法后，组合可以应用于当前请求的拦截器，

并封装为⼀个 Handler 对象返回给 DispatcherServlet。

4. DispatcherServlet 接收到 Handler 后委托 HandlerAdapter，将该请求转发给

HandlerMapping 选定的 Controller 中的 Handler。

5. Handler 接收到请求后，实际执⾏ Controller 中的方法。

6. Controller 方法执⾏完毕后返回 ModelAndView 对象。

7. HandlerAdapter 接收到 Handler 返回的 ModelAndView 后返回给 Dispatcher

Servlet。

8. DispatcherServlet 获取ModelAndView 后委托ViewResolver，由View Resolver

负责渲染视图。

9. ViewResolver 渲染视图完成后返回给 DispatcherServlet，由 DispatcherServlet


## 12.5 小结

本章从 WebMvc 的⾃动装配开始，回顾 WebMvc中的核心组件及用途。然后研究WebMvc

中 Controller 中可以处理请求的 Handler 方法的收集逻辑。最后从⼀个舌例出发，结合 Debug


## 12.5 小结|

研究 Dispatcherservlet 的工作全流程。WebMvc 本质是以 Dispatcherservlet 为核心

组合⼏个关键功能组件，共同构成 WebMvc的底层⽀撑。

在 Spring Framework 5.0版本之后 WebMvc多了⼀个孪⽣兄弟WebFlux， 它基于异步⾮阻塞

场景的开发，第13 章会从相关概念开始，逐步深入底层探究 WebFlux 的使用与原理。


章

本章主要内容：

容器处理客户端请求时，会为每⼀个请求分配⼀个工作线程进⾏处理。这样带来的后果是，

层原理展开探讨和讲解。

新的编程风格，下⾯就这两种编程风格进⾏简单对⽐。

使用命令式编程的代码更像是⼀组前后联系紧密的任务，它们有明确的先后执⾏顺序，后⾯的

任务通常需要依赖前⾯任务⽣成的结果才可以正确执⾏。命令式编程的特点是串⾏、阻塞。

响应式编程中不再将这些前后关联的任务看作⼀个整体，⽽是将其拆分为⼀个个可以并⾏

执⾏的工作任务，这些工作任务之间互不⼲扰。每个工作任务都可以接收特定的数据，并在处

理完成后传递给整体流程中的下⼀个任务，同时继续处理下⼀组数据。请注意，响应式编程中，

每个工作任务不会主动获取数据，⽽是被动地等待数据提供方给它提供数据，这种设计的核心思想

第

Spring Boot 整合 WebFlux

の 响应式编程与 Reactive；

《 Spring Boot 整合 WebFlux 的快速使用；

< Spring Boot 整合 WebFlux 的核心⾃动装配；

◎ DispatcherHandler 的工作全流程。

在第12 章我们了解了 Spring Boot 整合WebMvc 场景下的⾃动装配，WebMvc 的本质是

基于 Servlet，⽆论设计得多强大，其本质都是阻塞的，每个连接都会占用⼀个线程。在 Servlet

基于 Servlet 的阻塞式Web 框架在⾯对海量请求时性能上会捉襟见肘。为了解决该问题，在

Spring Framework 5.0版本后引入了WebMvc的孪⽣兄弟 webFlux，它是⼀个异步⾮阻塞式

Web 框架，且 Spring Framework 5.x 基于JDK1.8，Java 底层就已经⽀持了函数式编程，这就

为 WebFlux 提供了强有⼒的语⾔级⽀撑。本章就 WebFlux 的核心知识和 Spring Boot 整合的底


## 13.1 快速了解响应式编程与 Reactor

WebFlux 的底层核心技术是响应式编程，这种编程思想和方式区别于命令式编程，是⼀种


## 13.1.1 命令式与响应式

在基于 WebMvc的项目开发中，通过编写 Controller 前端控制器，注入 Service业务逻辑类

进⾏处理，Service 中包含与数据库的交互、与中间件的通信等，这种编码风格就是命令式编程。

是“被动接收”⽽不是“主动获取”，它主张数据以订阅的方式推送，⽽不是以请求的方式拉取。

简单总结，响应式编程本⾝是⼀种代替命令式编程的范式，它并不能完美应对所有业务场

景。通过合理选择编码方式，可以在实际的项目开发中实现最优效果。


## 13.1.2

简单对⽐命令式与响应式编程之后，下⾯需要读者回顾⼀些概念和思想，它们会在后续了

解响应式编程时起到引导作用。之后本节还会引人⼀些有关响应式编程的新概念，理解这些概

念后，在学习响应式编程时会更加顺利。

有关对异步⾮阻塞概念的解释，有⼀个⾮常经典的舌例，此处引用该舌例并加以解释。

假设有⼀个⽼张烧⽔的场景，⽼张有两把烧⽔壶，分别是没有哨的普通⽔壶以及壶盖上带

到⽔壶冒热⽓，壶⾥的⽔沸腾，⽼张将⽔壶离火，烧⽔结束。在该场景中，由于⽼张在烧⽔

期间⽆法完成其他工作，只能等待⽔烧开，烧⽔占据了⽼张的注意⼒和时间，构成同步阻塞。

⽼张选择同时打游戏，每隔⼀小段时间就去看⼀下⽔壶⾥的⽔是否烧开，如果⽔还没有

烧开就继续打游戏，⽔烧开则将⽔壶离火，烧⽔结束。在该场景中，⽼张没有⼀直盯着

用全部精⼒和时间，构成同步⾮阻塞。

⼀次使用响⽔壶烧⽔，⽼张不确定⽔壶上的哨是否好用，于是他像第⼀次烧⽔那样在⽔

壶旁观察，等到⽔壶冒热⽓，同时哨声响起，⽼张将⽔壶离火，烧⽔结束。在该场景中，

⽼张不再主动关心⽔壶的状态，但精⼒和时间仍然被⽔壶占用，构成异步阻塞。

消耗精⼒和时间，于是后续烧⽔时，⽼张都是准备好后直接去打游戏，等到⽔壶哨声响

要间歇性检查⽔壶内⽔的状态，⽽只需要在⽔壶的哨声响起时处理⽔壶离火的任务，此

场景就是异步⾮阻塞。

听器模式”。观察者模式中关注的点是，某⼀个对象被修改/做出某些反应/发布⼀个信息等时会

⾃动通知依赖它的对象（订阅者）。观察者模式的三大核心是观察者、被观察主题和订阅者。观


## 13.1 快速了解响应式编程与 Reactor|

概念和思想的回顾与引人

1. 异步⾮阻塞

哨的响⽔壶。烧⽔的场景包含以下4种，逐⼀来看。

• 同步阻塞式：使用普通⽔壶烧⽔，由于不清楚⽔烧开的时间，因此需要⽼张在⽔壶旁观察，等

• 同步⾮阻塞：经过上⼀次烧⽔后，⽼张发现烧⽔太浪费⾃⼰的时间，于是下⼀次烧⽔时

⽔壶，但还是会间歇性消耗精⼒，只不过在整个烧⽔的过程中，⽼张没有⼀直被⽔壶占

• 异步阻塞式：间歇性观察⽔壶仍然不是最佳选择，⽼张选择使用响⽔壶烧⽔，但由于第

• 异步⾮阻塞：烧完⽔后⽼张发现⾃⼰很傻，因为哨声响起就意味着⽔已烧开，⽆须⾃⼰

起，再将⽔壶离火，烧⽔结束。在最终的场景中，⽼张不再主动关心⽔壶状态，也不需

2. 观察者模式

观察者模式是 GoF23中⾮常经典的设计模式之⼀，它也被称为“发布-订阅模式”或“监

察者（Observer）需要绑定要通知的订阅者（Subscriber），并且要观察指定的主题（Subject）。

3. 前端框架的双向绑定

在 Vue、React、AngularJS 中有⼀个很基本的概念：双向绑定。修改输入框中的表单值时上

方的p标签内容也会随之变化，如图13-1 所舌，这就是响应式的体现。

SpringBoot good！ SpringBoot nice！

SpringBoot good！ 修改输入框，SomgBoot nce）

图13-1 Vue 的双向绑定

仔细分析双向绑定的现象，可以从中提取出⼏个关键的信息。

变化时，段落的内容也会随之变化，这本身就是观察者模式的体现。由此可以引出响应

⾄p标签段落中。

果将这组变化的内容全部列举，可以形成⼀组表单输入框内容的变化事件记录。由此就

可以引出响应式编程的第⼆个关键概念：数据流。事件源的每⼀次变化连起来就是⼀个

事件流。

的第三个关键概念：声明式。不需要编写命令式代码，仅靠声明两者之间的关系就可以

形成双向绑定。

简单总结，响应式编程的三个关键点是变化传递、数据流和声明式。这⾥最关键的围绕着

响应式编程的核心概念是事件，事件是观察者模式的核心，响应式也是观察者模式，⾃然响应

式编程也需要依赖事件。

函数对集合进⾏迭代）；⽽响应式流可以通过背压对海量数据（甚⾄是⽆限量数据）进⾏流量控

制，以确保数据的接收速度在处理能⼒之内。简单总结，响应式流的关键点是异步⾮阻塞和数

据流速控制。

上⾯提到了背压是控制数据流速的关键⼿段，下⾯通过⼀个模拟场景来讲解背压。

作是负责流⽔线上的⼀个关键环节，该环节需要的加工时间⽐较⻓，⽽恰好近期与你共同负责

相同工作的同事都请假了，剩下你单枪匹⻢仍然战⽃在⽣产⼀线。



# 第13章 Spring Boot 整合 WebFlux


## 第13章 Spring Boot 整合 WebFlux

• p标签段落部分的内容更像是“观察”着下方表单输入框的内容，当输人框的内容发⽣

式编程的第⼀个关键概念：变化传递。当表单输入框的内容变化时，输入框的值会传递

• 在实际测试中，每修改⼀次表单输入框的内容，P标签段落中的内容就会随之改变，如

• 在Vuc.js 的实现方案中，双向绑定的舌例代码如代码清单 13-1 所舌。除了必要的页⾯

元素和 Vue 对象的构建，没有任何多余绑定关系的代码，由此就可以引出响应式编程

代码清单 13-1 Vue.js 中实现最简单的双向绑定

<div id="app">

<p>i｛ message｝｝</p>

<input v-model="message">

</div>

var app = new Vue （｛

el：'#app'，

data：｛

message：'SpringBoot good！'

4. 响应式流

下⾯的两个概念是有关响应式编程的新概念。响应式流有别于 Java 8中的Stream，普通的

Stream 是同步阻塞的，在⾼并发场景下不能有效缓解压⼒大的问题，⽽响应式流可以做到异步

⾮阻塞。另外，Stream 的⼀个关键特性是，⼀旦有了消费型方法，它就会将这个流中的所有方

法处理完毕，如果这期间的数据量很大，Stream 就⽆法对海量数据进⾏妥善处理（相当于使用

5. 背压

假设你在⼀个知名⼿机⽣产大⼚工作，你的职位是⽣产流⽔线上的⼀名普通工人，你的工

与此同时，负责你上游工作的同事似乎并不清楚你负责环节的⽣产现状，⽽且由于上司的

激励政策，上游同事的⽣产效率⾮常⾼，导致你的待加工区积压了⾮常多半成品，但由于你负

责的工序耗时⻓，积压的半成品过多⽆法及时处理，于是你不得不向上游同事反馈：你们做慢

点，我的工作吞吐量有限。上游同事了解你的现状后改变了半成品处理策略，他们将处理好的

半成品不直接传递给你，⽽暂时由上游同事保管，等你向他们反馈积压的半成品处理完毕后，

再继续传递新的半成品。

⼀段时间之后，领导发现你的业绩⾮常好，于是你升职加薪，以经销商的⾝份销售该款⼿

机。⼿机⼀上市就得到⼴大消费者的关注，你的店铺⽣意⾮常好。

正当你的⽣意做得风⽣⽔起时，这批⼿机在售卖后的⼀段时间后传出硬件问题，市⾯销量

据压垮，达到两者之间的动态平衡。

下⾯通过⼏个简单的示例体会响应式编程的具体落地使用。市⾯上流⾏的响应式编程框架

接收者就可以接收⽣产者提供的数据并进⾏处理，直到⽣产者的数据全部处理完成或者出现异

常终⽌。


## 13.1 快速了解响应式编程与 Reactor|

提舌：由此可以体现出背压的第⼀个策略，即数据提供方将数据暂存，不传递给下游消费者。

急剧下降，作决经销商，你⾃然也不想再销售该款⼿机，于是你向⼚商反映：请不要再提供该款⼿

机。⼚商也⾮常⽆奈，⼿机还在正常⽣产，但经销商都不再提货，于是只好将这部分成品废弃。

Q提示：由此可以体现出背压的第⼆个策略：数据提供方将数据丢弃。

简单总结，背压是下游消费者“倒逼”上游数据⽣产者的数据提供速率，以避免被海量数


## 13.1.3 快速体会 Reactor 框架

包括 Reactor 与 ReactiveX（RxJava）。由于 WebFlux 底层使用Reactor 提供响应式⽀撑，因此本

书选择使用 Reactor 进⾏演示。

具体的项目搭建中，⽆须导人特定版本的 Reactor 框架，⽽是直接导入 spring-boot-

starter-webflux 依赖即可，根据 Maven 的依赖传递原则，Reactor 框架会⼀并导人。

1. 最简单的发布-订阅

下⾯先编写⼀个最简单的发布-订阅实现，如代码清单 13-2所舌。

代码清单 13-2 基于响应式的最简单发布-订阅模型

Public class QuickDemo ｛

public static void main （Stringll args） ｛

r LuxsLntegerflux = Flux.just （1,2,3）；

TLuX.suoscrloe （oystem.out: princLn）：

示例代码⾮常简单，发布-订阅模型需要⼀个数据的⽣产者，即Publisher，这⾥为了编

码方便，代码清单13-2 中选用Reactor 中的实现类 F1ux作为数据⽣产者，数据接收者的类型

是Java 8中的Consumer，所以此处可以传入Lambda 表达式或者方法引用。在这段代码中，

⽣产者与接收者通过subscribe 方法建⽴订阅关系（消费关系），⼀旦触发 subscribe 方法，

I第13章 Spring Boot 整合WebFlux

2. 响应式的核心规范组件

上述的发布-订阅模型中涉及响应式编程的4个核心规范组件，逐⼀来看。

（1） Publisher

Publisher 作为数据⽣产者，它只有⼀个方法 subcribe，该方法会接收⼀个 Subscriber，

构成“订阅” 关系，如代码清单13-3所舌。


## 1 代码清单 13-3 Publisher 接口的方法

public void subscribe （Subscriber<？ super T> s）；

请注意，subscribe 方法是⼀个类似于“工⼚”的方法，它可以被多次调用，但是每次调用

时都会创建⼀个新的订阅关系，且⼀个订阅关系只能关联⼀个接收者（即下⾯的 Subscriber）。

（2） Subscriber

Subscriber 作为数据接收者，它的接口方法有4个，如代码清单13-4 所示。

代码清单 13-4 Subscriber 接口的方法

public void onsubscribe （Subscription s）：

public void onNext （T t）：

Public void onErrOr （Throwable t）；

Public void onComplete （）；

请注意，Subscriber 接口的方法都以 on 作为前缀，代表它属于事件形式（可以联想

JavaScript 中的 onclick 方法等），以此理解 Subscriber 接口的4个方法。

onsubscribe：当触发订阅时触发。

onNext：当接收到下⼀个数据时触发。

onComplete：当⽣产者的数据都处理完成时触发。

• onErrOr：当出现异常时触发。

（3）Subscription

Subscription 可以看作⼀个订阅“关系”，它归属于⼀个⽣产者和⼀个接收者（可以理

解为关系型数据库的多对多中间表的⼀条数据）。Subscription 接口中有两个方法，如代码

清单13-5所示。

1代码清单 13-5 Subscription 接口的方法

public void request （1ong n）；

public void cancel （）；

request 方法的作用是主动请求/拉取数据，cancel 方法的作用是放弃/停⽌拉取数据，它

完成了数据接收者与⽣产者的交互，背压也是基于 Subscription 接口来实现的。

（4） Processor

Processor 从类名上可以翻译为处理器，这些处理器的特点是有输入，有输出，对应到

Reactor 的概念中则是⽣产者和接收者的合体，如代码清单 13-6所示。

1代码清单 13-6 Processor 接口

public interfac ProcesSOr<T,R> extends Subscriber<T>，Publisher<R> ｛｝

展开。


## 13.1 快速了解响应式编程与 Reactor|

从代码清单 13-6中可以发现，Processor 直接继承了 Publisher 接口和 Subscriber

接口，它⼀般用于数据的中间环节处理（如数据转换 map、数据过滤 filter等）。

3. Reactor 中的常用组件

上述4 个响应式的核心规范组件对应到响应式编程的具体实现框架中，它们的实现类也需

要简单了解。

（1） Flux

F1ux可以简单理解为“⾮阻塞的Stream”，它实现了 Publisher 接口，它的内部定义了

很多 subscribe 方法，如图13-2所示。

subscribeO: Disposable

subscribe（Consumer<？super T>）： Disposable

suDscfle（Consumers: suoen t>. Consumers: suoer tnrowabez: Disoosabie

subscribe（Consumer<？ super T>， Consumer <？ super Throwable>， Runnable）： Disposable

subscribe（Consumer <？ super T>， Consumer <？ super Throwable>， Runnable, Consumer<？ super Subscription>）： Disposable

subscribefCoreSubscriber <？ super T>）：void

subscribe（Subscriber <？super T>）：void

subscribeOn（Scheduler）：Flux<T>

subscribeOn（Scheduler, boolean）： Flux<T>

图13-2 Flux 中定义的 subscribe 方法

请注意，Flux 在实现 Publisher 原⽣的 subscribe 方法时，还扩展了⼏个方法，目的

是简化操作，如代码清单13-2 的简单舌例中就使用了图 13-2 中的第⼆个重载的方法，只传人

⼀个 Consumer 的实现对象（该方法只处理正常情况下的数据接收）。

另外需要读者了解的是，Flux 本身拥有⾮常多Java 8中 Stream 的操作，代码清单13-7中

是⼀个简单舌例。要学习多更具体的API 操作，读者可以参照 javadoc 和官方⽂档，本书不再

代码清单 13-7 操作 Flux 的舌例代码

public class FluxDemo ｛

public static void main （String［］ args） throws Exception ｛

FIux<Integer> flux = Flux.just （1,2,3）；

flux.map（num ->num *5）// 将所有数据扩大5倍

•filter （num -> num >10）// 只过滤出数值中超过10 的数

.map （String：：valueOf）// 将数据转换为 String 类型

.publishon （Schedulers.elastic（））// 使用弹性线程池来处理数据

.subscribe （System.out： ：println）；// 消费数据

（2） Mono

Mono 可以简单理解为“⾮阻塞的 Optional”，它也实现了 Publisher 接口，具备⽣产数

据的能⼒。Mon。在特征上与 Java8中的 Optional类似，都是内部包含⾄多⼀个对象实例。

Mono的 API 具体操作与F1ux 相似，不再赘述。

public abstract class Mono<T> implements Publisher<T>｛.•.｝

（3） Scheduler

scheduler 可以简单理解为“线程池”，从代码清单 13-7 的倒数第⼆⾏中可以看到，线

⽣）。响应式线程池有以下⼏种类型。

elastic：弹性线程池，线程池中的线程数量原则上没有上限（底层创建线程池时指定了

开始讲解。

</dependencies>

1第13章Spring Boot 整合WebFlux

程池需要由 schedulers 工具类产⽣（注意 Scheduler 不是public 类型，只能由工具类产

• immediate：与主线程⼀致。

single：只有⼀个线程的线程池（可类⽐ Executors.new Singlerhread Executor （））。

最大容量为 Integer.MAX_VALUE）。

• parallel： 并⾏线程池，线程池中的线程数量等于CPU 的数量（JDK 中的Runtime类

可以调用 availableProcessors 方法来获取CPU数量）。


## 13.2'快速使用 WebFlux

通过13.1节的内容，想必读者已经对响应式编程和 Reactor 框架有了⼀个初步的了解。本

节内容会搭建⼀个 Spring Boot整合 WebFlux 的项目，以代替 WebMvc 进⾏实际的Web 开发。

由于 WebFlux 是与 WebMve地位等同的框架，Spring Framework 的作者为了避免开发者因

WebFlux 的使用门槛过⾼⽽放弃，在WebFlux 的使用过程中允许完全采用 WebMvc的开发风格，

使用@Controller+@RequestMapping 注解组合即可实现基于 WebFlux 的前端控制与响应。

为了让读者也能循序渐进地了解 WebFlux，本节内容会先从读者熟悉的 WebMvC编码风格


## 13.2.1 WebMvc的开发风格

⾸先创建新的项目。注意，此处导入的依赖不再是Web，⽽是WebFlux，如代码清单13-8

所舌。

代码清单 13-8 导入 WebFlux的依赖

<dependencies>

<dependency〉

<groupId>org.springframework.boot</groupId>

<artifactId>spring-boot-starter-webflux</artifactId

</dependency〉

当导人完成后，编写主启动类 SpringBootwebF1uxApP1ication 并启动应用，如代码

清单 13-9所舌。注意观察控制台的输出，可以发现应用启动的嵌人式Web 容器不再是 Tomcat，

⽽是 Netty（本书在讲解有关嵌人式容器时没有刻意指 Servlet 容器，⽽是统称为Web 容器，因

为 Netty 不属于 Servlet 容器）。

代码清单13-9 WebFlux 的启动类

@SpringBootApPlication

public class SpringBootWebF1uxApplication ｛

Public static void main （string［］ args）f

SpringApplication.run （SpringBootWebF1uxApPlication.class,args）；

@RestController

码方式。

@RestController


## 13.2 快速使用 WebFluxI

［mainl c.1.s.SpringBootWebF1uxApplication

Bear with PID 780..

［main］ c.1.s.SpringBootWebF1uxApplication

：Starting SpringBootWebF1uxAPPlication on Linked

：No active profile set, falling back to default

Profiles:default

［mainl o.s.b.web.embedded.netty.NettywebServer : Netty started on port （s）：8080

［main］ c.l.s.SpringBootWebF1uxApplication ：Started SpringBootWebFluxApplication in 2.306

seconds..

接下来的内容与之前的WebMvc 完全⼀致，⾸先简单编写⼀个 WebmvcStyleController，

并声明两个方法，如代码清单 13-10所示。

冒代码清单 13-10 基于 WebMvc⻛格的 Controller 编写

public class Webmvcstylecontroller ｛

@GetMapping（"/he11o"）

public string hel10（）｛

return "Hel1o WebFlux"；

@GetMapping（"/1ist"）

public List<Integer>1ist （）｛

return Arrays.asList （1,2,3）；

编写完成后，使用浏览器或 Postman 访问 localhost:8080/he11o，客户端可以正常

接收到服务端的“HelloebF1ux"字符串响应，说明WebFlux 可以完美兼容 WebMvc 的编


## 13.2.2 逐步过渡到WebFlux

从13.1 节的内容中可以了解到，Reactor 中核心数据的封装模型是Mono和F1u>，下⾯根

据该模型对 webmvcStylecontroller 进⾏改造。当返回单个对象时，使用Mono 封装；当

返回⼀组数据时，使用F1u× 封装，如代码清单 13-11 所示。

代码清单 13-11 使用 Reactor 的数据封装模型改造 Handler

Public class WebmvcstyleController ｛

@GetMapping（"/he1102"）

Public Mono<String>hel102（）｛

return Mono.just （"Hel1o WebFlux"）；

@GetMapping （"/1ist2"）

public Flux<Integer> 1ist2（）｛

return Flux.just （1,2,3）；

响应数据。

响应主体完全可⾏。

@Component

1第13章 Spring Boot 整合WebFlux

？ 提示：留意⼀个细节，目前的改造中仍然使用@RestController 注解中的@ResponseBody

重新启动 SpringBootWebF1uxAPP1ication，并访问 localhost：8080/he1102和

/1ist2，客户端仍然可以接收到服务端响应的正常数据，说明利用 Reactor 中的数据模型作


## 13.2.3 WebFlux 的函数式开发

如果想要完全丢弃 WebMvc 的编码方式，转⽽使用 WebFlux 的风格，需要使用 WebFlux 提

供的⼀套全新的函数式 API。在切换风格之前，先总结⼀下在WebMvc 的开发中的关键点。

• Controller 类上要标注@Contro1ler 注解或其派⽣注解。

• Controller 类中的 Handler 方法上要标注@RequestMapping 注解或其派⽣注解。

结合第12章 WebMvc 中的原理分析可以了解到，Controller 中标注了@RequestMapping

注解的方法在底层会封装为⼀个个 Handler，每个 Handler 中都封装有 URL+执⾏方式以及具体

要反射执⾏的Method 对象，这两个核心要素在 WebFlux 的编码⻛格中会转换为两个核心组件：

HandlerFunction 和 RouterFunction。下⾯将 WebmvcstyleController 重构

WebFlux 的⻛格代码。

1. Controller 转 Handler

WebFlux 的编码风格中不再有 Controller 的概念，容器中的⼀切Bean 都可以视为处理客户

端请求的 Handler，所以在声明具体的前端控制器时，将不再使用@Controller 注解，⽽是使

用原始的@Component注解，且内部的方法不再需要多余的注解，只需要按照 WebFlux的规则

编写方法，如代码清单 13-12 所示。

代码清单 13-12 HelloHandler 的编写

PuoLic cLass HeLLohanoLer 1

public Mono<ServerResponse〉 hel103（ServerRequest request）｛

return ServerResponse.ok（） .contentType （MediaType.TEXT_PLAIN）

•body （Mono.just （"Hello Handler"），String.class）；

public Mono<ServerResponse> 1ist3（ServerRequest request）｛

return ServerResponse.ok （）.contentType （Mediarype.APPLICATION_JSON）

.body （Flux.just （1, 2, 3），Integer.class）；

2. RequestMapping 转 Router

注意对⽐ HelloHandler 与 WebmvcStyleController 的差别。由于 HelloHandler

中不再有@Controller 注解，方法上也不再使用@RequestMapping 注解封装 URL 信息，因

此 Spring Framework ⽆法感知到 IOC容器中的哪些 bean 对象具备 WebFlux 前端控制器的能⼒，

此时就需要⼀个新的组件来定义 Bean 与具体路由的关系，这个组件就是RouterFunction。

@Controller

Undertow


## 13.2 快速使用WebFlux/

在编写具体的路由规则时，需要⼀个配置类来编程式创建 RouterFunction 对象，代码

清单 13-13展示了将 Hel1oHandler 应用到 WebFlux 的具体示例。

【代码清单 13-13 HelloRouterConfiguration 配置路由规则

import static org.springframework.web.reactive.function.server.RequestPredicates.*；

@Configuration （proxyBeanMethods = false）

public class HelloRouterConfiguration ｛

@Autowired

Private HelloHandler hel1oHandler；

PuoLic Kouterrunctlonsoerverkesponse, nerLokoucerO t

2et1 K te nCLlOnS

.route （GET（"/he1103"）

•and （accept （MediaType.TEXT_PIAIN）），helloHandler：：he1103）

.andRoute （GET （"/1ist3"）

•and （accept （MediaType.APPLICATION_JSON）），helloHandler：：1ist3）；

可能有部分读者不理解上述的配置方式，注意代码清单 13-13中的第⼀⾏，它静态导入了

RequestPredicates 中的所有静态成员，所以下⾯的路由配置构造中会简清许多。简单归纳

路由配置类中的核心要素：路由配置类也是⼀个配置类，其中包含@Bean注解标注的、返回值

类型是 RouterFunction 的方法；RouterFunction 的构造过程中，配置的核心要素也是

Handler 方法+URL 路径和请求方式。

⾄此，⼀个基于 WebFlux 编码⻛格的示例项目搭建完成。


## 13.2.4 WebMvc 与 WebFlux 的对⽐

舌例项目搭建完毕后，下⾯简单对⽐⼀下 WebFlux 与传统的WebMvc 的异同点。在 Spring

Framework 的官方⽂档中有⼀张图，清楚直观地描述了 WebMvc与WebFlux 的共性和特性，如

图 13-3所舌。

Spring MVC

Imperative logic，

simple to write

an0 ce0uO

JDBC, JPA，

blocking deps

Spring WebFlux

keaaive Cienis

Tomcat, Jetty，

wunct0naonooomt

Event loop

concurrency model

Netty

图 13-3 WebMvc 与 WebFlux 的共性和个性

简单总结⼀下图13-3中的内容。

• WebMvc 基于原⽣ Servlet，它是命令式编程+声明式映射，编码简单、便于调试；Servlet

在实际的项目技术选型中，需要综合考虑项目中使用的技术栈、用户群规模、开发团队能

配置类逐⼀展开讲解。

ReactiveWebServerFactoryConfiguration.EmbeddedTomcat.class，

public class ReactiveWebServerFactoryAutoConfiguration

1第13章Spring Boot 整合 WebFlux

可以是阳塞的，它更适合与传统的关系型数据库等阻塞1/O 的组件进⾏交互。

• WebFlux基于 Reactor，它是异步⾮阻塞的，使用函数式编程，相较于命令式编程和声

明式映射更灵活，⽽且它可以运⾏在 Netty 等纯异步⾮阻塞的Web 容器，以及同时⽀持

同步阻塞和异步⾮阻塞的基于 Servlet 3.1 及以上规范的 Servlet 容器中（如⾼版本的

Tomcat、Undertow 等）。

• WebMvc 和 WebFlux 都可以使用声明式映射注解编程，配置控制器和映射路径。

⼒等多方⾯因素决定使用 WebMvc 还是 WebFlux。


## 13.3 WebFlux 的⾃动装配

下⾯探讨 Spring Boot 整合WebFlux 的底层原理。根据前⾯讲过的内容以及参考WebMvc

的⾃动装配，不难得出 WebFlux 的核心⾃动装配类似于 WebMvc，对应的类名是 WebFlux

AutoConfiguration。与WebMvc 的⾃动装配类似，WebEluxAutoConfiguration 的装

配也有⼏个前置的装配（如嵌人式容器、DispatcherHandler 等），下⾯对其中涉及的核心


## 13.3.1 ReactiveWebServerFactoryAutoConfiguration

与 WebMve 中的 ServletWebServerFactoryAutoConfiguration 类似，它导人的

核心配置类也是⼀个 BeanPostProcessorsRegistrar 和⼏个嵌人式 Web 容器的内部类，

如代码清单 13-14所示。

代码清单 13-14 ReactiveWebServerFactoryAutoConfiguration

@AutoConfigureorder （Ordered.HIGHEST_PRECEDENCE）

@Configuration （proxyBeanMethods = false）

ConditionalOnClass（keactlventtpLnputessage.Crass）

@Conditional0nWebApplication（type = Conditional0nWebApplication.rype.REACTIVE）

@EnableConfigurationProperties （ServerProperties.class）

@Import（｛ ReactiveWebServerFactoryAutoConfiguration.BeanPostProcessorsRegistrar.class，

ReactiveWebServerFactoryConfiguration.EmbeddedJetty.class，

ReactiveWebServerFactoryConfiguration.EmbeddedUndertow.class，

ReactiveWebServerFactoryConfiguration.EmbeddedNetty.class｝）

请注意，与WebMvc 相⽐WebFlux 中额外添加了 Netty 的内部容器⽀持，且 WebFlux 默认

使用的嵌人式 Web 容器就是 Netty，所以这⾥重点展开 EmbeddedNetty的源码研究，如代码

清单 13-15所舌。

1代码清单 13-15 EmbeddedNetty 注册嵌入式 Netty

@Configuration （proxyBeanMethods = false）

@Conditional0nMissingBean （ReactiveWebServerFactory.class）

@ConditionalOnClass （HttpServer.class）

static class EmbeddedNetty｛

NettyReactiveWebServerFactory nettyReactiveWebServerFactory（

ReactorResourceFactory 中组合的核心成员

本书不对此展开讲解。


## 13.3 WebFlux的⾃动装配|

95ea。

@Conditional0nMissingBean

ReactorResourceFactory reactorserverResourceFactory（）｛

return new ReactorResourceFactory （）；

@Bean

ReactorResourceFactory resourceFactory,ObjectProvider<NettyRouteProvider> routes，

ObjectProvider<NettyServerCustomizer> serverCustomizers）｛

NettyReactiveWebServerFactory serverFactory = new NettyReactiveWebServerFactory（）；

serverFactory.setResourceFactory （resourceFactory）；

routes.orderedStream（）.forEach （serverFactory： ：addRouteProviders）；

serverFactory.getServerCustomi zers（）.addA11（

serverCustomizers.orderedStream （）.collect （Collectors.toList （）））；

tecur serverractory，

由 EmbeddedNetty 中注册的Bean来看，NettyReactiveWebServerFactory 显然类

⽐于 WebMvc中注册的 TomcatServletWebServerFactory，它会在IOC容器的初始化阶

段创建嵌入式 Netty 服务器。除此之外，另⼀个注册的 Bean 类型是 ReactorResource

Factory，它是⼀个可以管理 Reactor Netty 资源的工⼚，这个设计类似于线程池。在

ReactorResourceFactory 的内部组合了⼀个 ConnectionProvider，它会初始化⼀个弹

性连接提供者，⽽这个提供者的落地实现类是 PooledConnectionProvider，如代码清单13-16

所示。从类名上可以直观地体现出“池”的概念，由此可以简单理解 ReactorResource

Factory 就是⼀个 Reactor Netty 的连接。

代码清单 13-16

public class ReactorResourceFactory implements InitializingBean,DisposableBean｛

private suppLlersconnectionrroviaer> connectionrrovidersuppLler =

（） -> ConnectionProvider.elastic（"webflux"）；

1/ elastic静态方法

static ConnectionProvider elastic（String name）｛

return new PooledConnectionProvider （name，

（bootstrap,handler,checker）-> new SimpleChane1Pool （bootstrap，

handler,checker,true, false））；

此外，在 ReactorResourceFactory 中还有 select 与 worker 的概念，这些概念都是

Netty 的核心。有关 Netty的相关知识，读者可以⾃⾏借助搜索引擎，查询相关资料进⾏学习，


## 13.3.2 WebFluxAutoConfiguration

下⾯是⾃动配置类核心WebFluxAutoConfiguration，如代码清单13-17所示。从它的

类头可以看出，它⽣效的前提是当前项目的Web 类型为 REACTIVE，以及需要当前项目类路径

根据不同功能和场景分别配置对应的组件，下⾯就其中重要的静态内部类展开讲解。


## 13.3.3

@Configuration

ResourceHandlerRegistration registration =

【第13章 Spring Boot 整合 WebFlux

下存在WebFluxConfigurer 类，这与WebMvc 的判断条件相似（WebMvc中判断的项目Web

类型 SERVLET，⽽且检查的类是 Servlet、DispatcherServlet 等）。

代码清单 13-17 WebFluxAutoConfiguration

@Configuration （proxyBeanMethods = false）

@ConditionalOnwebApplication （type = ConditionalOnwebApplication.Type.REACTIVE）

@Conditional0nClass （WebFluxConfigurer.class）

@Conditional0nMissingBean（｛ WebFluxConfigurationSupport.class ｝）

CAutoConfigureAfter（｛ ReactiveWebServerFactoryAutoContiguration.Class，

CodecsAutoConfiguration.class, ValidationAutoConfiguration.class ｝）

AutoConfigureOrder （ordered.HLGHLsL EKECEDENCE+LU）

Puos1c cLass weorLuxAucoconriguration

在 WebFluxAutoConfiguration 的内部没有任何Bean 的注册，⽽是由⼏个静态内部类

WebFluxConfig

WebFluxConfig 是 WebFlux 的第⼀个核心配置类，它本⾝导人了 EnablewebFlux

Configuration，如代码清单 13-18所舌。本节先关注 WebFluxConfig 的配置，13.3.4 节

会对 EnablewebFluxConfiguration 展开研究。

代码清单 13-18 WebFluxConfig

@EnableConfigurationProperties（｛ ResourceProperties.class,WebFluxProperties.class ｝）

eimporL（t EhaoLeweprLuxconrLguratLon.cLass」）

PuoL1c static class weorLuxconrig LupLemencs wept Luxconrigurer.••」

WebFluxConfig 本⾝实现了webFluxConfigurer 接⼜，它具备配置 WebFlux 的能⼒。

这个接⼜与 WebMvc 中的WebMvcConfigurer 类似，在编程式定制WebMvc 中编写的配置类

就是实现webMvcConfigurer 接⼜，配置 WebMve 中的静态资源映射、拦截器等。WebFlux

Config 中配置了部分 WebFlux的内容，下⾯就重点部分逐⼀来看。

1. 静态资源映射

第⼀个重点关注的是静态资源映射。WebFlux 本⾝只是WebMvc的异步⾮阻塞替代品，它

同样可以⽀持前后端不分离的 web 项目开发，所以对于静态资源映射，WebFlux 同样需要配置。

⽽可以⽀持的静态资源路径，除 webjars 之外，代码清单13-19的最后⼀个if结构中从 resource

Properties 提取出的静态路径与 WebMvc 完全⼀致，如代码清单13-19所示。

代码清单 13-19 addResourceHandlers 配置静态资源映射

public void addResourceHandlers（ResourceHandlerRegistry registry） ｛

// 前置检

if （！registry.hasMappingForPattern（"/webjars/**"））｛

registry.addResourceHandler （"/webjars/** "）.

addResourcelocations （"classpath:/META-INE/resources/webjars/"）；


## 13.3 WebFlux 的⾃动装配|

String staticPathPattern = this.webFluxProperties.getStaticPathPattern （）；

i£ （！registry.hasMappingForPattern （staticPathPattern））｛

ResourceHandlerRegistration registration = registry

•addResourceHandler （staticPathPattern）

.addResourceLocations （this.resourceProperties.getstaticLocations （））；

1…….

Public class ResourceProperties ｛

Private static final String［］ CLASSPATH_RESOURCE_LOCATIONS = ｛

"classpath:/META-INE/resources/"，"classpath:/resources/"，

"classpath:/static/"，"classpath:/public/"｝；

private stringl］ staticLocations = CLASSPATH_RESOURCE_LOCATIONS；

2. 视图解析器

与 WebMvc 相同，WebFlux 默认也可以⽀持视图跳转，所以底层也有视图解析器的配置，

如代码清单 13-20所示。源码逻辑相对简单，不再展开。

代码清单13-20 视图解析器的配置

public void configureviewResolvers （ViewResolverRegistry registry）｛

this.viewResolvers.orderedstream（）.forEach（registry： ：viewResolver）；

3. 类型转換器和格式转換器

代码清单 13-21 Converter 和 Formatter

public void addFormatters（FormatterRegistry registry） ｛

Eor （Converter<？，？> converter : getBeansOfType （Converter.class））｛

registry.addConverter （converter）；

Eor （GenericConverter converter : getBeansOfType （Generi.cConverter.class））｛

registry.addConverter （converter）；

for （Formatter<？> formatter : getBeansOfType （Formatter.class））｛

registry.addFormatter （formatter）；

WebFlux 中的类型转换器和格式转换器与WebMve 部分的配置完全⼀致，不过对于这部分组件的

功能读者可以不用过多关注，只需要体会WebFlux 的大多数配置在本质上与WebMve并⽆区别。


## 13.3.4 Enable WebFluxConfiguration

观察 EnablewebF1uxConfiguration 的类名，它与 WebMvc 中的 EnablewebMvc

Configuration ⾮常相近，事实上它们继承的⽗类也⾮常类似，如代码清单 13-22所示。

代码清单 13-22 EnableWebFluxConfiguration 与 EnableWebMvcConfiguration

@Configuration （proxyBeanMethods = false）

public static class EnablewebFluxConfiguration extends DelegatingWebFluxConfiguration

@Configuration （proxyBeanMethods = false）


## 13.3.5

类中也有⼀些核心组件的注册，下⾯列举其中重要的⼏个组件。

所示。

I第13章Spring Boot 整合 WebFlux

public static class EnablewebMvcConfiguration extends DelegatingwebMvcConfiguration

imLements ResourceLoaderAware

它们继承的⽗类 Delegating***Configuration 的作用在2.6节中讲过，它们是对应

EnableWebMvc或者EnableWebFlux 注解导人的配置类。如果 Spring Boot 的项目中显式

标注了EnableWebFlux 注解，则webFluxAutoConfiguration 不会⽣效，改由项目⾃身

接管WebFlux，具体原因和底层机制可参照2.6节的提示，此处不再赘述。

下⾯简单列举EnablewebF1uxConfiguration 中注册的核心组件。由于源码中注册组

件的逻辑相对简单，故本节中不再展示具体源码，感兴趣的读者可以借助 IDE ⾃⾏查阅。

• FormattingConversionservice：参数类型转换器，用于数据的类型转换，如日

期与字符串之间的互相转换（在WebMvc中同样有注册）。

• Validator: JSR-303 参数校验器（在 WebMvc 中同样有注册）。

HandlerMapping & HandlerAdapter：覆盖⽗类。

nebFluxConfigurationsupport 的注册逻辑（可以忽略不看）。

WebFluxConfigurationSupport

EnableWebFluxConfiguration 继承⾃WebFluxConfigurationSupport，这个⽗

1. DispatcherHandler

WebFlux 中的核心前端控制器是 DispatcherHandler，对应到 WebMvc 中的组件是

DispatcherServlet，不过 DispatcherHandler 的注册逻辑⽐ DispatcherServlet

简单，如代码清单 13-23所舌。

1代码清单 13-23 DispatcherHandler 的注册

@Bean

public DispatcherHandler webHandler（）｛

return new DispatcherHandler （）；

2. WebExceptionHandler

WebFlux 的异常状态响应处理器用于处理异常情况下的HTTP 状态码响应，如代码清单13-24

1代码清单 13-24 WebFluxResponseStatusExceptionHandler

@Bean

Corder （0）

Public WebExceptionHandler responseStatusExceptionHandler （）｛

return new WebFluxResponseStatusExceptionHandler （）；

3. RequestMappingHandlerMapping&RequestMappingHandlerAdapter

因为 WebFlux 可以完美⽀持 WebMvc中使用标准@RequestMapping 注解的方式定义 Handler，

⽽⽀持的底层是与 WebMvc 中相同的 RequestMappingHandlerMapping 和 RequestMapping

HandlerAdapter，如代码清单 13-25所示。

@Bean

@Bean

中讲解。


## 13.3 WebFlux 的⾃动装配！

1代码清单 13-25 RequestMappingHandlerMapping 的注册

public RequestMappingHandlerMapping requestMappingHandlerMapping （）｛

RequestMappingHandlerMapping mapping = creatRequestMappingHandlerMapping（）；

mapping.setOrder （0）；

1…….

return mapping：

｝

@Bean

public RequestMappingHandlerAdapter requestMappingHandlerAdapter （）｛

RequestMappingHandlerAdapter adapter = creatRequestMappingHandlerAdapter（）；

return adapter；

4. RouterFunctionMapping

RouterFunctionMapping 是基于函数式端点路由编程的 Mapping 处理器，如代码

清单 13-26所示。它的优先级⾼于 RequestMappingHandlerMapping，这意味着 WebFlux

倾向于开发中使用函数式端点的 Web 开发，⽽不是传统的@RequestMapping 注解式开发。有

关RouterFunctionMapping的作用，在13.5 节中会讲解。

1代码清单 13-26 RouterFunctionMapping 的注册

public RouterFunctionMapping routerFunctionMapping（）｛

RouterFunctionMapping mapping = createRouterFunctionMapping（）；

mapping.setOrder（-1）：// 注意此处设置的优先级⾼于 RequestMappingHandlerMapping

mapping.setMessageReaders （serverCodecConfigurer（）.getReaders （））；

mapping.setCorsConfigurations （getCorsConfigurations （））：

return mapping：

5. HandlerFunctionAdapter

函数式端点路由的处理器在底层也需要由具体的 HandlerAdapter 负责调用，对

应的⽀撑组件是 HandlerFunctionAdapter，如代码清单 13-27所示。它可以直接提

取出 HandlerFunction 中的Handler 方法进⾏调用，具体的调用逻辑统⼀放在13.5节

代码清单 13-27 HandlerFunctionAdapter 的注册

@Bean

PuoLic HanaLerrunctionAdapter nandlerrunctionAdapter（）｛

return new HandlerFunctionAdapter（）；

6. ResultHandler

WebFlux 中同样需要有对返回值进⾏处理的组件，在 WebMvc中的类型是 Handler

MethodReturnValueHandler，对应到 WebFlux 中则是 ResultHandler。默认情况下

提到的组件注册。

I第13章 Spring Boot 整合WebFlux

WebFlux 会注册4种不同的ResultHandler 实现类。

• ResponseEntityResultHandler：处理HttpEntity 和 ResponseEntityo

• ResponseBodyResultHandler：处理@RequestMapping 的标注了@Response

Body 注解的 Handler。

• ViewResolutionResultHandler：处理逻辑视图返回值。

ServerResponseResultHandler：处理返回值类型为 ServerResponse 的

（WebFlux 中可以直接返回 ServerResponse，如代码清单13-12所不）。

本节中没有提到的组件相对⽽⾔重要程度不⾼，感兴趣的读者可以借助IDE ⾃⾏翻阅没有


## 13.4 DispatcherHandler 的传统方式工作原理

DispatcherHandler 作次 WebFlux 的核心前端控制器，它的作用必然与 Dispatcher

Servlet 相同，都是负责统⼀接收客户端请求并处理，然后将结果响应给客户端。由于WebFlux

可以完美兼容 @RequestMapping 注解式开发，本节内容先研究传统的开发方式下

DispatcherHandler 的工作原理。

以本章的示例项目 springboot-13-webflux 为调试基准，Debug 启动项目并将断点打

在 DispatcherHandler 的handle 方法中，随后用浏览器访问 http://ocalhost:8080/hello，待

程序停在断点处时开始 Debug 调试。


## 13.4.1 handle 方法概览

进入 DispatcherHandler 的handle 方法中，最直观的体现是源码篇幅更短，相较于

DispatcherServlet 的doDispatch 方法实现更精炼，如代码清单 13-28所示。

1代码清单 13-28 DispatcherHandler#handle

public Mono<Void> handle （ServerWebExchange exchange）｛

i£（this.handlerMappings == null）｛

return createNotFoundError （）；

return Flux.fromIterable （this.handlerMappings）

.concatMap （mapping -> mapping.getHandler （exchange））

.next（）

.switchIfEmpty （createNotFoundErrOr （））

.flatMap （handler -> invokeHandler （exchange,handler））

.flatMap （result -> handleResult （exchange, result））：

注意 handle 方法的人参是⼀个 ServerWebExchange 对象，联想 DispatcherServlet

中传入的是 HttpServletRequest 和HttpServletResponse 对象，不难推测 ServerWeb

Exchange 就是 request 和 response 的组合体，如代码清单 13-29所示。

【代码清单 13-29 ServerWebExchange 接口的方法定义

Public interface ServerWebExchange｛

中的三个关键步骤。

意方法的执⾏轨迹。


## 13.4.2

concatMap


## 13.4 DispatcherHandler 的传统方式工作原理|

ververntcpkeguest getreguest（.

ververhtcpkesponse gecresponse（）.

1.

总观 handle 方法的实现，⾸先 if 分⽀中会检查 DispatcherHandler 中是否注册有

HandlerMapping，由于上⾯的⾃动配置类导人的配置类已经注册了必要的 Handler

Mapping，所以不会进人该分⽀。后⾯的 retur 结构是⼀串链式调用，源码本⾝的可读性⽐较

⾼，可以结合第12 章中 DispatcherServlet 的工作原理对应地分析 DispatcherHandler

W 提舌：由于函数式编程和响应式的设计问题，会导致实际调试程序时 Debug 难度⾮常大，在 Debug

的过程中随时可能出现来回跳转的情况，读者在结合 IDE 调试 WebFlux 相关源码时，⼀定要格外注

筛选 HandlerMapping

DispatcherHandler 的handle 方法的第⼀个动作与 DispatcherServlet 相同，都

是寻找可以匹配当前请求的 HandlerMapping 对象，在 handle 方法中负责筛选

HandlerMapping 的步骤如代码清单 13-30所舌。⾸先会将 DispatcherHandler 中保存

的所有 HandlerMapping 封装为⼀个 Flux 对象，之后使用 concatMap 方法使所有

HandlerMapping 都尝试匹配当前的请求，并将结果收集合并，最后调用next 方法提取出第

⼀个匹配成功的 HandlerMapping 解析后的对象。

代码清单 13-30DispatcherHandler 筛选 HandlerMapping

return Flux.fromlterable （this.handlerMappings）

•concatMap （mapping -> mapping.getHandler （exchange））

.next（）......

对于源码中的第⼀步和最后⼀步都不难理解，中间的 concatMap （mapping-> mapping.

getHandler （exchange））需要重点理解。

1. concatMap

concatMap 是F1ux中的⼀个动作，执⾏ concatMap 方法可以将 F1ux 管道中的对象转

换为另⼀种类型的对象，该操作⾮常类似于 stream 中的map 方法，但⼜不完全相同。Stream

中的map 方法执⾏完成后，整个管道中的元素个数不变，⽽E1ux 的 concatMap 方法执⾏完

成后，管道中的元素个数可能会发⽣改变。concatMap 的逻辑示意如图13-4所示。

图 13-4concatMap 方法示意

HandlerMapping.

所示。

|第13章 Spring Boot 整合 WebFlux

DispatcherHandler 之所以选择使用 concatMap 方法转换 HandlerMapping，是希

望通过⼀个循环后将仅⽀持当前请求的 HandlerMapping 筛选出来，忽略不⽀持的

2. mapping.getHandler

筛选 HandlerMapping 的实动作需要借助 HandlerMapping 的 getHandler 方法，

如果getHandler 方法返回的Mono对象中有具体值则认为匹配，反之不匹配。⽽ getHandler

方法定义在所有 HandlerMapping 实现类的基础⽗类 AbstractHandlerMapping 中，方法

内部⼜会调用模板方法 getHandlerInternal，源码的设计与WebMvc 中完全⼀致，如代码

清单 13-31所舌。

1代码清单 13-31 getHandler 调用 getHandlerInternal

public Mono<Object>getHandler （ServerWebExchange exchange）｛

return getHandlerInternal （exchange）.map （handler ->｛

1/ logger …

1/ 跨域相关处理

return handler：

｝）；

基于 @RequestMapping 注解式开发的解析，底层由 RequestMappingHandler

Mapping 负责匹配，⽽ getHandlerInterna1 方法的实现逻辑在⽗类 AbstractHandler

MethodMapping 中，如代码清单 13-32所示。


## 1 代码清单 13-32 AbstractHandlerMethodMapping#getHandlerInternal

public Mono<HandlerMethod> getHandlerInternal（ServerWebExchange exchange）｛

this.mappingRegistry.acquireReadLock （）；

try｛

HandlerMethod handlerMethod；

try｛

// 搜索处理器方法（真正处理请求的 RequestMapping）

handlerMethod = 1ookupHandlerMethod （exchange）；

｝ // catch

1/ 将方法分离出来，单独形成⼀个 Bean

if（handlerMethod ！= null）｛

handlerMethod = handlerMethod.createWithResolvedBean（）；

return Mono.justOrEmpty （handlerMethod）；

｝ // Einally•.

仔细观察代码清单 13-32 的获取逻辑，将这段源码与代码清单 12-16对⽐，可以发现 WebFlux

中的RequestMappingHandlerMapping 的实现逻辑与 WebMvc完全⼀致，同样都是先搜索

Controller 方法，后封装为独⽴的HandlerMethod 对象并返回。整体逻辑可以完全参照 12.4.4

节的内容，本节不再赘述。

通过 Debug，可以发现此处可以成功匹配到/he11o请求对应的Controller 方法，如图13-5

直接执⾏，不再添加额外的动作。


## 13.4DispatcherHandler 的传统方式工作原理 |

¢L0834 30

method = Metnog DS41

%bridgedMethod = （Method@5479］

图 13-5 通过 RequestMapping 匹配到的 HandlerMethod


## 13.4.3 搜寻HandlerAdapter 并执⾏

HandlerMapping 获取完毕后，DispatcherHandler 的下⼀个步骤也是搜寻合适的

HandlerAdapter，用于执⾏目标 Handler。该步骤对应 handle 方法中的flatMap（handler

-> invokeHandler （exchange,handler））步骤。

1. 匹配合适的 HandlerAdapter

进入invokeHandler 方法中，可以发现源码中会逐个检查 DispatcherHandler 中的

HandlerAdapter 是否⽀持执⾏当前的 Handler，如果⽀持，则会直接调用HandlerAdapter

的handle 方法执⾏目标 Handler，如代码清单 13-33所示。

1代码清单 13-33 invokeHandler

private Mono<HandlerResult> invokeHandler（ServerWebExchange exchange,Object handler）｛

i （this.handlerAdapters ！= null） ｛

for （HandlerAdapter handlerAdapter :this.handlerAdapters）｛

i （handlerAdapter .supports （handler））｛

return handlerAdapter.handle （exchange,handler）；

return Mono.error （new I1legalStateException （"No HandlerAdapter： " + handler））：

整个逻辑与 WebMvc 中的逻辑有⼀点区别，Dispatcherservlet 会逐个检查

HandlerAdapter，在找到合适的 HandlerAdapter 后会返回，之后再执⾏ Handler；⽽

DispatcherHandler 中会遍历检查，检查到 HandlerAdapter ⽀持执⾏当前 Handler 时会

2. 执⾏ Handler

基于@RequestMapping 注解式开发的 Handler，底层使用 RequestMappingHandler

Adapter 执⾏，进入其 handle 方法中可以发现，在 WebMvc 的 RequestMappingHandler

Adapter 中处理的逻辑对应到WebFlux 中基本上都会执⾏，只是执⾏顺序和方式不同。核心Handler

执⾏的动作是在封装好 InvocableHandlerMethod 之后在 return 部分的链式调用中执⾏

invocableMethod.invoke （exchange,bindingContext）方法，利用反射机制执⾏目标

Controller 方法，如代码清单13-34所示。

代码清单 13-34 RequestMappingHandlerAdapter#handle

Public Mono<HandlerResult>handle （ServerWebExchange exchange, Object handler）｛

HandlerMethod handlerMethod = （HandlerMethod） handler；

// 检查 …•….

handle

的筛选逻辑都是边检查边执⾏，⽽返回值处理逻辑是获取和处理分开为两步执⾏。

|第13章 Spring Boot 整合 WebFlux

1/ 初始化参数绑定上下⽂

InitBinderBindingContext bindingContext = new InitBinderBindingContext（

getWebBindingInitializer（）、

this.methodResolver.getInitBinderMethods （handlerMethod））；

// 创建方法执⾏对象

InvocableHandlerMethod invocableMethod =

this.methodResolver.getRequestMappingMethod （handlerMethod）；

// 异常处理器的准备

Function<Throwable,Mono<HandlerResult>> exceptionHandler =

ex -> handleException （ex,handlerethod,bindingContext,exchange）；

// 执⾏目标方法，处理返回值和异常

return this.modelInitializer

•initModel （handlerMethod,bindingContext,exchange）

•then （Mono.defer （（）-> invocableMethod.invoke （exchange,bindingContext）））

.doOnNext （result -> result.setExceptionHandler （exceptionHandler））

.doOnNext （result -> bindingContext.saveModel （））

.onErrorResume （exceptionHandler）；

源码中的其余部分基本与 WebMvC中的对应，部分API甚⾄直接复制了WebMvc 中的源码，

感兴趣的读者可以借助 IDE ⾃⾏翻阅和调试，本节不再过多展开。


## 13.4.4 返回值处理

InvocableHandlerMethod 的 invoke 方法执⾏完成后会返回⼀个 HandlerResult

对象，其中封装了执⾏ Controller 方法后返回的真实值。DispatcherHandler 的最后⼀个关

键步骤是对该返回值进⾏处理，对应源码的动作是 flatMap（result->

Result （exchange,result）），如代码清单 13-35所示。

代码清单 13-35 handleResult 处理返回值

PrLVate Monosvoia> nanolekesuLt （serverweotxchange exchange, HandLerkesuLt resuLt）

return getResultHandler （result）.handleResult （exchange, result）

.onErrorResume （ex -> result.applyExceptionHandler（ex）.flatMap（exceptionResult ->

getResultHandler （exceptionResult）.handleResult （exchange,exception Result）））；

handleResult 本身定义在DispatcherHandler 中，它的筛选逻辑与返回值处理逻辑

HandlerMapping 和 HandlerAdapter 不太相同。HandlerMapping 和 HandlerAdapter

进入获取 ResultHandler 的方法 getResultHandler 中，如代码清单 13-36所示。通

过 Debug 观察到 DispatcherHandler 中默认组合了4种不同的ResultHandler，刚好与


## 13.3.5 中看到的部分⼀样，如图 13-6所舌。

【 代码清单 13-36 getResultHandler 匹配 ResultHandler

Private HandlerResultHandler getResultHandler （HandlerResult handlerResult）

if（this.resultHandlers ！= nul1）｛

for （HandlerResultHandler resultHandler :this.resultHandlers）｛

i£ （resultHandler .supports （handlerResult））｛

return resultHandler；

求处理结束。

RequestMappingHandlerMapping

数据

DispatcherHandler

ResponseBodyResultHandler


## 13.4 DispatcherHandler 的传统方式工作原理|

throw new I1legalStateException （"No HandlerResultHandler for "+ handlerResult.get

Returnvalue （））；

oo this.resultHandlers = ｛ArfayList@5737｝ size = 4

> m0 = （ResponseEntityResultHandler @7247｝

>發 1= （ServerResponseResultHandler@7248）


## 2 = ｛ResoonseBoovResuitHiandfer7242l

. 3 = （ViewResolutionResultHandler@7249）

图 13-6 DispatcherHandler 中组合的 ResultHandler

由于 WebnvcstyleController 类中标注了@RestController 注解，因此此处匹配的

返回值处理器⼀定是 ResponseBodyResultHandler，⽽它的 handleResult 方法中会将

Handler 的返回值取出，并执⾏ writeBody 方法将返回值结果写人响应流，如代码清单13-37所舌。

代码清单 13-37 ResponseBodyResultHandler#handleResult

public Mono<Void> handleResult（ServerWebExchange exchange,HandlerResult result）｛

Object body = result.getReturnValue （）；

MethodParameter bodyTypeParameter = result.getReturnTypeSource （）；

return writeBody （body,bodyTypeParameter, exchange）；

ResultHandler 的工作处理完成后，handle 方法的链式调用执⾏完毕，⼀次完整的请


## 13.4.5 工作流程小结

本节的最后，以流程图的形式总结上述DispatcherHandler 处理的全流程，如图13-7所舌。

3.HendlerNag ing 找到合適的Controller后，

2. DispatcherHandler委托

根据wrl

选择⼀个合适（

謇户端

1.浏览器向服务器发起请求

DispatcherHandler接收请$

8. ResponseBodyResultHandler

付分花帶入網尼現

DispatcherHandler验成给客户條

nanoLey

KecuestMappingnanaierAQaoren

4. DispatcherHlandler 收到 Handler

代理给 HandlerMapping选定的

Mono / FIux

5. Handler 收到请求后

实际执⾏ Controller 中的

Mon0/PUX

图13-7

6. HandlerAdapter 收到

Handler 返回的 Mono/

Flux 后返回给

Ulsatcneinaiaici

HHandler 拿到

Kes Poaseb0a Kesuihanaie

DispatcherHandler 工作流程：传统模式

使用传统的@RequestMapping 注解式开发与使用函数式端点开发的最大区别在于，底层

I第13章 Spring Boot 整合WebFlx


## 13.5 DispatcherHandler 的函数式端点工作原理

⽀持的HandlerMapping 与 HandlerAdapter 的实现类不同。对于整体的请求处理流程⽽

⾔，依然是遵循 DispatcherHandler 的 handle 方法。本节中着重研究基于函数式端点的

开发中底层 HandlerMapping 与 HandlerAdapter 的工作原理。

为测试函数式端点的底层执⾏流程，下⾯使用浏览器访问 http://localhost:8080/hello3，待程

序停在 DispatcherHandler 的handle 方法中标注的断点处时开始 Debug 调试。


## 13.5.1 HandlerMapping 的不同

对于使用函数式端点开发的 Handler，底层使用的 HandlerMapping 不再是 Request

MappingHandlerMapping，⽽是在13.3.5 节中提到的 RouterFunctionMapping，这个类

的内部会收集所有注册的函数式端点，并组合为⼀个 RouterFunction 对象。下⾯先简单了

解 RouterFunctionMapping 的初始化逻辑，相关源码如代码清单 13-38所示。

代码清单 13-38 RouterFunctionMapping 的初始化动作

public void afterPropertiesSet（） throws Exception ｛

if（this.routerFunction == nul1）｛

initRouterFunctions（）；

Protected void initRouterFunctions（）f

List<RouterFunction<？>> routerFunctions = routerFunctions （）；

this.routerFunction = routerFunctions.stream（）.reduce （RouterFunction：：andOther）

•Or lse（mU上上：

logRouterFunctions （routerFunctions）；

Private List<RouterFunction<？>> routerFunctions（）｛

List<RouterFunction<？>> functions = obtainApplicationcontext （）

•getBeanProvider （RouterFunction.class）

.orderedStream （）

.map （router ->（RouterFunction<？>） router）

.collect （Collectors.toList （））；

return（！CollectionUtils.isEmpty（functions）？ functions :Collections.emptyList （））；

RouterFunctionMapping 本身实现了 InitializingBean，对应的 afterProper

tiesset 方法中有⼀个 initRouterFunctions 的动作，该动作会提取出IOC容器中注册的

所有 RouterFunction 对象，并收集为⼀个 List，之后借助stream 的reduce 方法，调

用 RouterFunction 的 andother 方法将所有 RouterFunction 组合为⼀个

RouterFunction 对象。这个处理逻辑⾮常类似于 RequestMappingHandlerMapping 的

detectHandlerMethods 方法将所有的 Controller 方法存人 MappingRegistry 中（参⻅


## 12.3.3节）。

所示。

return RouterFunctions


## 13.5 DispatcherHandler 的函数式端点工作原理|

通过实际 Debug，当DispatcherHandler 中的 getHandler 方法执⾏完毕后，获取的

Handler 已经可以定位到注册函数式端点的配置类 Hel1oRouterConfiguration 中，如图 13-8

p exchange = （DefaultServerWebExchange@5335）

p handler = （HelloRouterConfiguration$lambda@5399）

>1arg$1 = （HelloHandler@5409）

图 13-8 RouterFunctionMapping 可以找到具体的 Handler 方法


## 13.5.2 HandlerAdapter 的不同

HandlerMapping 的工作处理完成后，下⾯是 HandlerAdapter 执⾏ Handler 的步骤。

函数式端点开发中，底层配合完成 Handler 调用的HandlerAdapter 也发⽣了变化，具体的

实现类是 HandlerFunctionAdapter，从它的handle 方法实现来看，核心动作是获取

HandlerFunction 并调用其 handle 方法，如代码清单 13-39所示。

代码清单 13-39 HandlerFunctionAdapter#handle

public boolean supports （Object handler）｛

return handler instanceof HandlerFunction；

Public Mono<HandlerResult> handle （ServerWebExchange exchange,Object handler）｛

HandlerFunction<？> handlerFunction =（HandlerFunction<？>） handler；

ServerRequest request = exchange.getRequiredAttribute （RouterFunctions.REQUEST_ATTRIBUTE）；

return handlerFunction.handle （request）.map （response ->

new HandlerResult （handlerFunction,response，

HANDLER_FUNCTION_RETURN_TYPE））；

到这⾥可能有读者会产⽣疑问，为什么进入 handle 方法的 handler 参数类型是

HandlerFunction？除了 HandlerFunctionAdapter 是否可以处理当前 Handler 的检查

（supports 方法），更重要的其实是在注册函数式端点的配置类中。注意观察代码清单 13-40

中注册 RouterFunction 时传人的方法引用 helloHandler：：he1103，它的本质是⼀个简

化版的Lambda 表达式，或者从原始的⾓度说，它的本质是⼀个匿名内部类，⽽该匿名内部类

的类型就是 HandlerFunction。

代码清单 13-40 HelloRouterConfiguration 中注册函数式端点路由

@Bean

public RouterFunction<ServerResponse> helloRouter（）｛

// 注意下⾯

•route （GET （"/he1103"）.and （accept （MediaType.TEXT_PLAIN）），helloHandler：：hel103）

•andRoute （GET（"/1ist3"）.and （accept （Mediarype. APPLICATION_JSON）），hel1oHandler：：1ist3）；

// RouterFunctions#route

public static <T extends ServerResponse> RouterFunction<T> route （

RequestPredicate predicate, HandlerFunction<T> handlerFunction）｛

return new DefaultRouterFunction<>（predicate, handlerFunction）；

ServerResponseHandlerResult，⽽它处理返回值的方式仅是把方法返回的 Server

I第13章 Spring Boot 整合WebFlux

@FunctionalInterface

public interface HandlerFunction<T extends ServerResponse>｛

Mono<T> handle （ServerRequest request）；

通过观察 RouterFunctions 的静态方法 route 也能获取到该信息，该方法的第⼆个参

数会传入⼀个 HandlerFunction 类型的对象，⽽HandlerFunction 本身是⼀个函数式接

⼜，所以可以使用Lambda 表达式或方法引用进⾏简化。如果不进⾏简化，则注册

RouterFunction 的代码如代码清单 13-41 所示。

】代码清单 13-41 不使用方法引用注册 RouterFunction

@Bean

ublic RouterFunction<ServerResponse>hel1oRouter（）

eturn RouterFunctions.route （GET（"/he11o3"）.and（accept （Mediarype.TEXT PLAIN））.

new HandlerFunction<ServerResponse>（）｛

@override

public Mono<ServerResponse> handle （ServerRequest request）｛

return helloHandler.he1103（request）；

｝）；

由以上分析，回到HandlerFunctionAdapter 中，显然 HandlerFunctionAdapter

的handle方法所做的工作就是直接调用项目中编写的具体的Controller 方法，相较于 Request

MappingHandlerAdapter 的处理方式更简单直接。


## 13.5.3 返回值处理的不同

对于基于函数式端点的开发方式，因为 Handler 最终返回的对象是Mono<Server Response>，

所以负责返回值处理的 ResultHandler 不再是 ResponseBodyResult Handler，⽽是

Response 对象写人 ServerWebExchange 中，如代码清单 13-42 所示（由于 Server

Response 的构建中⼀般会向响应体中写入数据，因此该步骤相当于将响应体的数据写入

ServerWebExchange 中）。

代码清单 13-42 handleResult 处理 Handler 的返回值

public Mono<Void> handleResult （ServerWebExchange exchange,HandlerResult result）｛

ServerResponse response =（ServerResponse） result.getReturnValue （）；

Assert.state （response ！= nul1，"No ServerResponse"）；

return response.writero （exchange,new ServerResponse.Context （）｛

@Override

public List<HttpMessageWriter<？>> messageWriters（）｛

return messageWriters；

@override

public List<ViewResolver> viewResolvers（）｛

return viewResolvers；

返回值处理完成后，⼀次完整的请求处理流程结束。

数据

Handler

DispatcherHandler

HandlerFunctionAdapter

让它实际执⾏目标方法

Handler

ServerResponseResultHandler

完成与客户端之间的请求响应处理。


## 13.6 小结|

｝）；


## 13.5.4 工作流程小结

同样，对于基于函数式端点的工作全流程，本节的最后也以流程图的形式总结，如图13-9

所舌。

2Dsoatcnerandler

andlerMapping，根据 uI

选择⼀个合适B

manaleretnoa

客户端

1.浏览器向服务器发起请求，

DispatcherHandlier接收请求

8. ServerResponseResultHandler将

数据写入响应流后，由DispatcherHandler响应给客户端 Mono

RouteFunctionMapping

3. HandlerMapping找到 Handler

后，会返回⼀个 HandlerFunction

给 Uispatchernanaler

4. DispatcherHandler 收到

HandlerFunctionAdapter，

6. HandlerAdapter 收到

Mono / Flux 后返回给

DispatcherHandler

Mono / FIux-

5. 执⾏目标的Handler中

方法，并返回Mono / Flu：

Mono / FIux

7. DispatcherHandler 拿到

Mono / Fiux 后戎到

ServerResponseResultHandler

，团⼔更⻚与人鹏迎名来

图 13-9 DispatcherHandler 工作流程：函数式端点


## 13.6 小结

本章从 webFlux 的底层思想响应式编程以及底层框架 Reactor 着⼿，通过简单舌例体会

WebFlux 的⼏种开发方式，之后从WebFlux 的⾃动装配切人，研究 WebFlux 中注册的核心组件，

以及与 WebMvc中注册组件的对⽐，最后以两种不同的开发方式，结合两个舌例Debug 分析和

研究 WebFlux 的核心前端控制器 DispatcherHandler 的工作全流程。WebFlux 的核心设计

与 WebMvc并⽆太大差别，本质上还是通过⼀个核心前端控制器＋周边核心组件的方式共同


## 第4部分

Spring Boot 应用的运⾏

• 第14 章 运⾏ Spring Boot 应用

第

心底层的研究已基本结束。在⼀个项目开发完成后，最终需要将应用部署到服务器使其正常运

⾏，以提供功能服务使用。

项目打包方式。

-章

运⾏ Spring Boot 应用

本章主要内容：

◎ Spring Boot 应用的项目打包方式；

《 基于jar包独⽴运⾏的核心底层解析；

今 基于war 包运⾏的引导机制解析；

今 Spring Boot 的优雅停机。

通过前⾯3个部分的学习，有关 Spring Boot 以及 Spring Framework相关的设计、开发、核

部署运⾏ Spring Boot 的方式⼀般采用打包部署为主。下⾯先回顾⼀下 Spring Boot 应用的


## 14.1 部署打包的两种方式

大多数情况下，通常会选择将 Spring Boot 打包为⼀个可运⾏的jar 包，或者去掉内置的嵌

入式 Web 容器，以 war 包形式部署到外置的容器中，这取决于开发者最终要部署的目标环境。


## 14.1.1 以可独⽴运⾏jar 包的方式

Spring Boot 默认以独⽴可运⾏的jar 包方式运⾏，当使用 Spring Initializer 创建 Spring Boot 应用

时，可以在 pom.xml ⽂件中找到 spring-boot-maven-Plugin插件，如代码清单14-1所舌。

代码清单 14-1 项目中默认会引入⼀个 Spring Boot 集成 Maven 的插件

<build>

<Plugins>

<Plugin>

<groupId>org.springframework.boot</groupId>

<artifactid>spring-boot-maven-plugins/artifactid>

</plugin>

</Plugins>

</build>

在这种情况下，执⾏mvn package 命令，就可以在项目根目录的target 下获得⼀个jar

包，如图14-1所示。

classes

generated-sources

成实践。

所示。

I第14章 运⾏ Spring Boot 应用

Developer （E） >IDEA >spring-boot-source-analysis-epubit >springboot-01-quickstart>target

generated-test-sources

maven-archiver

maven-status

test-classes

區 springboot-01-quickstart-1.0-RELEASEjor

口 springboot-01-quickstart-1.0-RELEASEjar.original

图14-1 打包完成后⽣成的可独⽴运⾏jar包

在该目录下，可以直接执⾏ java -jar 命令启动该项目。关于具体操作读者可以⾃⾏完


## 14.1.2 以war 包的方式

如果部署的目标环境是⼀个外置的Web 容器，就需要以war 包的方式打包项目，在这种情

况下，需要修改pom.xm］⽂件添加⼀些配置，如代码清单14-2所示。

1代码清单 14-2 Spring Boot 以 war 打包时需要修改 pom.xml ⽂件的部分配置

<Packaging>war</packaging>

<！-- 在 dependencies 中添加 -->

<dependency>

<groupId>org.springframework.boot</groupId>

<artifactId>spring-boot-starter-tomcat</artifactId>

<scope>provided</scope>

</dependency>

除此之外，还需要修改主启动类或者添加新的类，使其继承 SpringBootServlet

Initializer类，并重写 configure 方法指定配置源为 Spring Boot 主启动类，如代码清单 14-3

』代码清单14-3 以war 打包时需要修改主启动类添加新的继承

SpringBootApplicatior

public class springBootQuickstartApplication extends springBootServletInitializer｛

public static void main（String［］ args） ｛

SpringApplication.run （SpringBootQuickstartApplication.class,args）；

@override

protected springApplicationBuilder configure （SpringApplicationBuilder builder） ｛

return builder.sources （SpringBootQuickstartApplication.class）；

以上修改完成后，重新执⾏ nvn package命令，就⽣成⼀个可以部署到外置 Web 容器的

简单回顾两种最常⻅的打包方式后，下⾯分别解读这两种方式的运⾏机制和底层原理。

个下⾯会提到的配置，有关完整的配置读者可以参照规范⽂档⾃⾏了解）。

Class-Path

JarLauncher

研究。

其中不乏有⼀些熟悉的⾝影。


## 14.2 基于jar 包的独⽴运⾏机制】

war 包了。接下来，将该 war 包部署⾄外置的Web 容器（如 Tomcat Server）中并启动，就可以

运⾏ Spring Boot 应用了。


## 14.2 基于jar 包的独⽴运⾏机制

想要搞明⽩基于jar 包的独⽴运⾏机制，需要先了解可运⾏jar 包的⼀些前置知识。


## 14.2.1 可运⾏jar 包的前置知识

从 Oracle 的官网上可以找到有关 jar ⽂件规范的⽂档，⽂档中提到了⼀个核心的目录

META-INE，这个目录中会存放当前 jar 包的⼀些扩展和配置数据，其中有⼀个核心配置⽂件

MANIFEST.ME，它以 properties 的配置形式保存了jar包的⼀些核心元信息。MANIFEST.ME ⽂

件中的核心配置项主要包含以下⼏个核心内容，如表14-1 所示（配置项⽐较多，本书只挑选⼏

表14-1 MANIFEST.MF 中的核心配置项（节选）

配置项 配置含义

Manifest-Version 定义 MANIFEST.MF ⽂件的版本

指定当前 jar 包所依赖的jar 包路径（⼀般是相对路径）

Main-Class 对于可运⾏jar包中引导的主启动类的全限定类名

配置值示例


## 1.0（通常）

servlet.jar、config/

org.springframework.boot.loader.

重点关注最后⼀个配置项 Main-Class，它需要指定⼀个可以在jar 包的顶层结构中可以

直接找到的、带有 main 方法的启动类的全限定类名。注意，这⾥所谓的顶层结构是指jar 包中

可以直接在目录中找到的，不需要再解压/探寻 jar 包内部（換句话说，被Main-Class 配置项

引用的类必须同它所属的包⼀起放在可运⾏jar 包的顶层）。这⾥又出现了⼀个新的概念：jar 包

中可能会嵌套jar 包。这种类型的jar 包被称为 Fat Jar，可以解决第三方库不在 classpath 下的加

载失败问题。Spring Boot ⽣成的可运⾏jar 包本⾝就是⼀种 Fat Jar，下⾯通过⼀个舌例来具体


## 14.2.2 Spring Boot的可运⾏ jar 包结构

对于 Spring Boot 通过Maven/ Gradle 插件打包的可运⾏jar 包，它的内部由3个目录构成，

如图14-2 所舌。

• BOOT-INF：存放项目编写且编译好的字节码⽂件、静态资源⽂件、配置⽂件，以及依

赖的jar包。

• META-INE：存放 MANIFEST.MF 等配置元⽂件。

• org.springframework.boot.loader:spring-boot-loader 的核心引导类。

其中 META-INE 中的 MANIFEST.MF ⽂件如代码清单 14-4所舌。它的内容⽐较多，⽽且

Implementation-Title: springboot-01-quickstart

【第14章 运⾏ Spring Boot 应用

~ springboot-01-quickstart-1.0-RELEASE

•B00 -IN

~ classes

~wcom

~ linkedbear

~ wspringboot

~ aquickstart

> controller

貓SpringBootQuickstartApplication.class

tapplication.properties

>翻lib（所有依赖的jar包）

classpath.idx

w發 META-INF

> maven

MANIFES.Mt

~ org

vspringframework

• 縱boot

~ 繳loader

>archive

• data>jar

>jarmode

〉util

wassrathindexrile.Cass

© ExecutableArchivelauncher.class

©larlauncher.class

© LaunchedURLClassloader.class

© Launcher.class

©MainlethodRunner.class

©PropertiesLauncher.class

©warlauncher.class

图 14-2 Spring Boot 打包好的jar 包解压结构

1代码清单 14-4 MANIFEST.MF ⽂件的内容

Manifest-Version:1.0

Spring-Boot-Classpath-Index: BOOT-INF/classpath.idx

Implementation-Version: 1.0-RELEASE

Start-Class:com.linkedbear.springboot.quickstart.SpringBootQuickstartApplication

Spring-Boot-Classes: BOOT-INE/classes/

Spring-Boot-Lib: BOOT-INF/1ib/

Build-Jdk-Spec: 1.8

Spring-Boot-Version:2.3.11.RELEASE

Created-By: Maven Jar Plugin 3.2.0

Main-Class: org.springframework.boot.loader.Jarlauncher

注意其中的两个配置项：Main-Class:org.springframework.boot.loader.

JarLauncher 以及 Start-Class:com.linkedbear.springboot .quickstart.Spring

BootQuickstartApplication。这两个配置分别定义了两个类，其中 SpringBoot

QuickstartApplication 是我们在第1 章中编写的示例项目的主启动类，这⾥它用了⼀个

特殊的配置项 start-C1ass 来引用，这个配置项本身并不是MANIFEST.ME ⽂件标准规范中

的配置项，⽽是 Spring Boot ⾃⾏定义的，因此我们有理由认为，如果直接用

SpringBootQuickstartApplication 来引导这个可运⾏jar 包，是⽆法启动项目的。

将 MANIFEST.ME ⽂件中 Main-Class 属性的值改 SpringBootQuickstart

启动。


## 14.2.3

JarLauncher 的继承关系

Archivelauncher。下⾯先简单了解⼀下这⼏个类的设计。

⾥涉及⼀个概念“归档⽂件”，虽然陌⽣，但理解起来相对容易。读者可以简单地理解为，⼀个


## 14.2 基于jar 包的独⽴运⾏机制|

APplication，并执⾏java-jar 命令，发现直接使用SpringBootQuickstartApplication

根本⽆法引导启动 Spring Boot 项目，如图 14-3所示。

Main-Class: com.linkedbear.springboot.quickstart.SpringBootQuickstartApplication

图 14-3 Spring BootQuickstartApplication ⽆法引导 jar 包启动

⽆法启动的原因是引导的 SpringBootQuickstartApplication 并没有完全放在 jar

包的顶层目录下，⽽是放在了BOOT-INE/classes/目录下，中间隔了两层包，所以⽆法引导

如果用默认打包好的可运⾏jar 包中的JarLauncher，就可以正常引导 Spring Boot 项目

启动，这说明这个 Jarlauncher 是引导的核心，需要重点研究它的设计。

JarLauncher 的设计及工作原理

JarLauncher 本身是来⾃ spring-boot-1oader 依赖中⼀个普通的带main方法的类，

只不过 Spring Boot 需要它来引导可运⾏ jar 包启动，它才以⼀种特殊的方式“降临”到jar 包中。

可以发现连同 JarLauncher 在内的⾮常多字节码⽂件直接存在于可运⾏jar 包的顶层目录之

下，这是因为可运⾏jar 包的规范要求如此，所以 Spring Boot 在打包时不得不将这些.class ⽂

件全部复制到jar 包中。

1. JarLauncher 的继承结构

借助IDEA 可以⽣成包括 JarLauncher 在内的类继承关系图，如图 14-4 所舌。

Ss JarLauncner WarLauncher

图 14-4

从图14-4 中可以看到，Spring Boot 项目的启动器是通过两个 Launcher 的落地子类实现

的，它们分别处理 jar 包启动和 war 包启动，⽽这两个落地子类又同时继承⾃ Executable

（1） Launcher

Launcher 是所有启动Spring Boot 项目的顶层引导类，它的内部定义了⼀个⾮常关键的

launch 方法，该方法就是用于启动 Spring Boot 应用的核心方法。

（2） ExecutableArchiveLauncher

ExecutableArchivelauncher 从类名上可以理解为“可执⾏归档⽂件的启动器”，这

它们的对应关系。

classes directory.

1第14章 运⾏ Spring Boot 应用

Spring Boot 的独⽴可运⾏jar 包就是⼀个归档⽂件，可以放在外置的Web 容器中运⾏的war 包

也是⼀个归档⽂件。ExecutableArchivelauncher 类中额外拥有的能⼒主要是可以从归档

⽂件中检索到 Spring Boot 的主启动类，并提供给⽗类 Launcher 以完成主启动类的引导。

（3） JarLauncher

JarLauncher 是基于 Spring Boot 独⽴可运⾏jar 包的启动引导器，它的内部定义了⼏个核心

的常量，它们与打包好的jar 包中 BOOT-INE ⽂件夹中的内容⼀⼀对应，从图14-5中可以看出

public class JarLauncher extends ExecutableArchivelauncher ｛

private static final String DEFAULT_CLASSPATHL_INDEX_ LOCATION = "BO0T -INF/class

static tinal EntryFiLter NESTED_AKCHIVE_ENTK'_FLLTER = （entry）•

1f （entry.isDirectory（））｛

reuurn enthy.geuNameC.equaist bovi-iNh/Cidsses/.

return entrv.getName.startswitn（8001-1Nf/aib/

图 14-5 JarLauncher 的常量与 BOOT-INF 中的成员⼀⼀对应

请注意，classpath.idx 是 Spring Boot 2.3.0版本之后新添加的成员，在此版本之前的

Jarlauncher 中的成员更简单清晰，如代码清单 14-5所示。

代码清单 14-5 Spring Boot 2.3.0版本之前的JarLauncher 定义的常量

public class JarLauncher extends ExecutableArchiveLauncher｛

static final String BOOT_INF_CLASSES = "BOOT-INE/classes/"；

static final String BOOT_INE_LIB = "BOOT-INE/1ib/"；

由此可见，⽆论 Spring Boot 版本的⾼低，这两个指定 BOOT-INE 目录的路径都是关键。

在javadoc 中已经清楚地解释了这两个路径的作用：

Launcher for JAR based archives. This launcher assumes that dependency jars are included

inside a /BOOT-INF/lib directory and that application classes are included inside a /BOOT-INF/

基于jar 包归档⽂件的启动器。此启动器假设项目所依赖的 jar 包包含在/BOOT-INE/1ib

目录中，并且项目所中定义的类包含在/BOOT-INE/classes 目录中。

依照 javadoc 中描述的规则，可以从打包好的jar 包中定位到项目中编写的类、配置⽂件，

以及所依赖的所有jar 包。

（4） WarLauncher

WarLauncher 是基于 Spring Boot 以外置Web 容器运⾏时打包 war 包的启动类引导器，请

注意它本⾝也是⼀个启动器，可以将打包好的war 包使用 java-jar 命令引导启动 Spring Boot

应用，如图14-6所舌。

图14-6 打包好的 war 包也可以独⽴运⾏


## 14.2 基于jar 包的独⽴运⾏机制|

与jar 包不同，war 包对于所依赖的jar 包和项目中的 class 有⼀定限制，对于⼀个标准 war

包⽽⾔，项目中定义的所有类应当放在 WEB-INE/classes 目录下，所依赖的 jar 包则放在

WEB-INE/1ib 下。除此之外，Spring Boot 为了使war 包也能独⽴运⾏，会将所有作用范围

provided 的依赖统⼀放在 WEB-INF/1ib-provided 中，这部分在独⽴运⾏时可以与

WEB-INE/1ib 下的依赖同时被加载，⽽当war 包放置于 Web 容器时，由于 Web 容器不会读取

1ib-provided 目录，因此这部分不会被加载，这样就同时兼容了两种启动方式。

通过外置 Web 容器引导的机制会在 14.3 节中讲解，⽽独⽴ war 包运⾏的引导机制与

JarLauncher 基本⼀致。下⾯会分别讲解 JarLauncher 与Warlauncher 的引导原理。

2. JarLauncher 的引导原理

在 JarLauncher 内部定义了⼀个 main 方法，它就是整个可运⾏jar 包在运⾏时的入口。

JarLauncher 的构造方法中没有任何动作，也没有调用⽗类的构造方法，所以所有动作都在

后⾯的1aunch 方法中，如代码清单14-6所示。注意，launch 方法没有在 Jarlauncher 中

定义，⽽是在顶层⽗类 Launcher 中定义。

代码清单 14-6 JarLauncher 的引导入口

public JarLauncher （）｛｝

public static void main （String［］ args） throws Exception ｛

new JarLauncher （）.launch （args）；

1/ ⽗类 Launcher

protected void launch （String［］ args） throws Exception ｛

1/ 注册URL 协议并清除应用缓存

if （！isExploded （））｛

JarFile.registerUrlProtocolHandler （）；

// 创建类加载器

ClassLoader classLoader = createClassLoader （getClassPathArchivesIterator （））；

String jarMode = System.getProperty（"jarmode"）；

// 获取主启动类的类名

String launchClass =ljarMode ！= null && ！jarMode.isEmpty（））

？ JAR_MODE_LAUNCHER: getMainClass（）；

// 执⾏主启动类的main 方法

launch （args,launchClass,classLoader）：

launch 方法的⽂档注释中有⼀句话：本方法是⼀个人口点，且应该被⼀个 public

static void main （Stringl］ args）（即main 方法）调用。这句话刚好与代码清单 14-7

上方的 main 方法相呼应（WarLauncher 中也是如此）。整个 1aunch 方法中的核心步骤可以

拆分为3步，下⾯分步解释其原理。

（1） 创建 ClassLoader

由于可独⽴运⾏的jar包中使用常规的类加载器⽆法加载内部jar 包中的类，因此 Spring Boot

需要对其进⾏特殊处理。createClassLoader 方法中会创建⼀个特殊的类加载器

LaunchedURLC1assLoader，它可以加载内部嵌套jar 包中的类。

具体分析源码，需要进人 createClassLoader 方法中，但是在此之前需要读者先关注

|第14章 运⾏ Spring Boot 应用

createClassLoader 方法中传人的参数：getClassPathArchivesIterator（）。很明显

这是将⼀个方法执⾏完毕后的返回值传入了 createClassLoader 方法中，所以需要先进人

获取参数的 getClassPathArchivesIterator 方法中，如代码清单 14-7所示。

代码清单 14-7 ExecutableArchiveLauncher#getClassPathArchiveslterator

protected Iterator<Archive> getClassPathArchivesIterator（） throws Exception ｛

Archive.EntryFilter searchFilter = this：：isSearchCandidate；

Iterator<Archive> archives = this.archive.getNestedArchives （searchFilter，

（entry） -> isNestedArchive （entry） && ！isEntryIndexed（entry））；

iE （isPostProcessingClassPathArchives （））｛

archives = applyClassPathArchivePostProcessing （archives）；

LenL arChLves

从代码清单 14-7中来看，getClassPathArchivesIterator 方法的可读性并不强，大

概总结下来可以理解，通过 getClassPathArchivesIterator 方法，可以将当前 Spring

Boot 应用中依赖的嵌套jar 包和字节码⽂件都获取到，并且以迭代器的形式返回。获取的关键

动作是中间的this.archive.getNestedArchives 方法，它需要传入两个过滤器，⼀个是

搜索范围，另⼀个是过滤条件。对于可独⽴运⾏的 jar ⽂件来讲，搜索范围是所有路径以

BOOT-INE 开头的⽂件，⽽过滤条件是筛选所有 BOOT-INE/1ib 目录下的⽂件以及

BOOT-INE/classes 目录下的所有⽂件夹，相关源码如代码清单 14-8所示。

1代码清单 14-8 从 BOOT-INF 下搜索 jar 包和字节码⽂件

1/ 搜索范围

protected boolean isSearchCandidate （Archive.Entry entry） ｛

return entry.getName （）.startsWith （"BOOT-INE/"）；

// 过滤条件

protected boolean isNestedArchive （Archive.Entry entry）｛

return NESTED_ARCHIVE_ENTRY_FILTER.matches （entry）；

static final EntryFilter NESTED_ARCHIVE_ENTRY_EILTER = （entry）->｛

// 收集 BOOT-INF/classes 下的⽂件夹

if （entry.isDirectory（））｛

return entry.getName （）.equals （"BOOT-INF/classes/"）；

1/ 收集 BOOT-INE/1ib 下的所有⽂件

return entry.getName （）.startswith（"BOOT-INF/1ib/"）；

通过观察源码，读者可以很明确地理解 Spring Boot 打包好的jar 包中每个⽂件夹的含义：

BOOT-INE/classes 目录存放的是当前 Spring Boot 项目中编写的所有类经过编译之后的字

节码⽂件，BOOT-INF/1ib 目录存放的是当前 Spring Boot 项目所依赖的所有jar包。

加载上述⽂件之后，就进入了创建Classloader 的方法中，如代码清单14-9所示。在创

建类加载器之前，createClassLoader 方法会将上⼀步获取到的 Archive 对象转换⼀个

个 URL 对象，每个 URL 对象对应⼀个jar 包或者字节码⽂件目录的路径。转换完成后，最终要


## 14.2 基于jar 包的独⽴运⾏机制|

创建的ClassLoader 实现类是LaunchedURIClassLoader，虽然它的构造方法中传人的参

数⽐较多，但读者只需要关心 urls 数组。

代码清单 14-9 createClassLoader 创建特殊的类加载器

Protected Classloader createClassloader（Iterator<Archive> archives） throws Exception｛

List<URL> urls = new ArrayList<>（guessClassPathsize （））；

while （archives.hasNext （））｛

urls.add （archives.next（）•getUrl（））；

if （this.classPathIndex ！= null）｛

ur1s.addA11 （this.classPathIndex .getUrls （））；

return createClassLoader （urls.toArray （new URL ［0］））；

protected ClassLoader createClassLoader （URL［］ urls） throws Exception｛

return new LaunchedURLClassLoader（isExploded（），getArchive（），urls，

getulass （.getvlassuoader（）：

LaunchedURIClassloader 创建完成后，launch 的第⼀步就执⾏完毕了。

（2）获取主启动类名

launch 方法的倒数第⼆⾏会执⾏ getMainClass 方法，定位当前 Spring Boot 应用的主

启动类，它的实现要向下找到Launcher 的子类 ExecutableArchivelauncher，如代码清

单14-10所示。

代码清单 14-10 ExecutableArchiveLauncher#getMainClass

private static final String START_CLASS_ATTRIBUTE = "Start-Class"；

protected String getMainClass （）throws Exception ｛

Manifest manifest = this.archive.getManifest （）；

String mainClass = null；

iE（manifest ！= nul1） ｛

mainclass = manifest .getMainAttributes （） .getValue （START_CLASS_ATTRIBUTE）；

iE （mainClass == nul1）｛


## 1 throw ex ...

return mainClass；

从源码中可以清晰地看出，解析 Spring Boot 主启动类的方式就是提取 MANIFEST.ME ⽂件

中的“Start-C1ass”属性对应的值，⽽在代码清单14-4中读者已经看到过 MANIFEST. ME ⽂

件的内容，Start-Class 刚好就是定义了 Spring Boot 应用主启动类的全限定类名。

（3）执⾏主启动类的 main 方法

特殊的类加载器 LaunchedURIClassLoader 以及主启动类都获取到之后，最后⼀步是

真正启动 Spring Boot 应用。进入重载的1aunch 方法中，可以发现触发主启动类main 方法的

机制是借助 MainMethodRunner，利用反射机制调用 Spring Boot 主启动类的main方法，如

代码清单 14-11所舌。

【第14章 运⾏ Spring Boot 应用

1代码清单 14-11 launch 借助反射机制启动 Spring Boot 主启动类

protected void launch （Stringl］ args,String launchClass,ClassLoader classLoader）

throws Exception ｛

Thread.currentThread （） .setContextClassLoader （classLoader）；

// 创建 MainMethodRunner，并调用run方法

createMainMethodRunner （launchClass,args, classLoader）.run （）；

protected MainMethodRunner createMainMethodRunner （String mainClass,String［］ args，

Classloader classLoader）｛

retuzn new MainethodRunner（mainClass,args）；

public void run（） throws Exception ｛

Class<?> mainclass = Class.forName （this.mainClassName,false，

Thread.currentrhread （） .getContextClassLoader （））；

Method mainethod = mainclass.get DeclaredMethod （"main"， string I.class）；

mainMethod.setAccessible （true）；

mainMethod.invoke （nu11, new object ［］ （this.args｝）；

当 Spring Boot 主启动类的main 方法被反射调用成功后，Spring Boot 应用即可顺利启动，

基于 JarLauncher 的启动引导完成。

3. WarLauncher 的引导原理

使用warLauncher的引导原理在本质上与 JarLauncher并⽆太大区别，只是在定位jar

包和字节码⽂件时搜索的目录不同，如代码清单 14-12所示。

代码清单 14-12 WarLauncher 中搜索 jar 包和字节码⽂件的规则

protected boolean isSearchCandidate（Entry entry）｛

return entry.getName（）.startsWith（"WEB-INE/"）；

public boolean isNestedArchive （Archive.Entry entry） ｛

if（entry.isDirectory（））｛

return entry.getName（）.equals（"WEB-INE/classes/"）；

return entry.getName（）.startsWith（"WEB-INF/1ib/"）

I entry.getName （）.startswith（"WEB-INF/1ib-provided/"）；

由于标准 war 包中项目编译后的字节码⽂件和 jar 包会分别放人 WEB-INE/classes 和

WEB-INE/1ib中，⽽部署到外置 Servlet 容器中解压后的web 项目也是如此，因此 Spring Boot

为了同时兼容这两种情况，在搜索 Archive 归档⽂件时做出了⼀些调整。

除此之外，WarLauncher 的启动引导原理与 JarLauncher 并⽆区别，不再赘述。


## 14.3 基于 war 包的外部 Web 容器运⾏机制

基于 war 包的外置容器运⾏需要借助 Servlet 3.0 规范的⼀个引导机制，这个机制是引导

Spring Boot 应用启动的核心，我们需要先对它有所了解。

Servlet

更⾼级的处理。


## 14.3 基于 war 包的外部 Web 容器运⾏机制|


## 14.3.1 Servlet 3.0规范中引导应用启动的说明

在Servlet 3.0规范⽂档的8.2.4节中有对运⾏时插件的描述，以下内容节选⾃该小节。

An instance of the ServletContainerInitializer is looked up via the jar services API by the

container at container / application startup time. The framework providing an implementation of the

ServletContainerInitializer MUST bundle in the META-INF/services directory of the jar file a file

called javax.servlet.ServletContainerInitializer, as per the jar services APl, that points to the

implementation class of the ServletContainerInitializer.

在容器/应用程序启动时，容器通过 SPI 机制查找 ServletContainerInitializer 的

实例。提供 ServletContainerInitializer 实现的框架必须在 jar 包的 META-INF/

services 目录中定义⼀个名为 javax.servlet.ServletContainerInitializer 的⽂

件，根据 SPI 机制，找到对应的 ServletContainerInitializer 接口的实现类。

由该段描述可以得知，Servlet 容器启动应用时会扫描项目及依赖 jar 包中

ContainerInitializer 接口的实现类，如果项目依赖的框架需要在启动时初始化，就必须

在 jar 包的META-INF/services 目录中提供⼀个名为 javax.servlet.Servlet

ContainerInitializer 的⽂件，⽂件内容要标明 ServletContainerInitializer 接

口实现类的全限定名。从代码清单 14-13中可以发现，ServletContainerInitializer 本

身是⼀个接口，它仅有⼀个 onstartUp 方法，不难推测出 Servlet 容器启动时会回调

onstartUp 方法以完成应用的初始化逻辑。

代码清单 14-13 ServletContainerInitializer

public interface ServletContainerInitializer ｛

void onstartup （Set<Class<?>> c,ServletContext ctx） throws ServletException；

此外，实现了 ServletContainerInitializer 接口的实现类可以在类上标注

HandlesTypes 注解，并指定⼀些感兴趣的类（或接口类型），Servlet 容器初始化时会将这

些感兴趣的类（或接口的实现类）传入 onStartUp 方法的第⼀个参数中，以此可以完成⼀些

Spring Boot 为了适配外置 Servlet 容器启动的方式，提供了⼀个特殊的ServletContainer

Initializer 实现类 SpringServletContainerInitializer，这个类会使用上述

Servlet 规范中的特性。


## 14.3.2 Spring BootServletInitializer 的作用和原理

在研究 SpringBootServletInitializer 的作用机制之前，先请读者回想⼀下 Spring

Boot 打包 war 包时的必要步骤。除了修改pom.xm1 ⽂件中的打包方式、修改嵌人式Web 容器

的作用域，还需要编写⼀个 SpringBootServletInitializer 的子类，指定 Spring Boot

主启动类作为启动源，如代码清单14-14所示。

|第14章 运⾏ Spring Boot 应用

代码清单 14-14SpringBootServletlnitializer 的子类用于配置主启动类

pubLic cLass servLetinitlallzer extenas springbootservLetinitlaLizer L

Protected SpringApplicationBuilder configure（SpringApplicationBuilder application）｛

return application.sources （SpringBootLaunchApplication.class）；

如此编写的目的是在当前的Spring Boot 项目中提供⼀个 SpringBootServletInitializer

的子类，从⽽让外置 Servlet 容器在启动时可以加载该子类，从⽽初始化和启动 Spring Boot 应

用。下⾯结合源码分析外置 Servlet 容器如何引导和启动 Spring Boot 应用。

1. ServletContainerInitializer 的加载

当外置 Servlet 容器启动时，默认会加载webapp 目录下的war 包，此时被打包成war包的

Spring Boot 项目被解压，Servlet 容器会从当前项目及项目所依赖的jar 包中搜索⼀个全路径名

内 META-INF/services/javax.servlet.servletContainerInitializer 的⽂件

（该特性基于 JDK SPI 机制）。如果可以成功搜索到该⽂件，则会加载⽂件中定义的全限定类名

对应的类。从 spring-web 依赖中可以找到该⽂件，对应的类是 SpringServlet

ContainerInitializer，这个类上标注了HandlesTypes 注解，它感兴趣的类型是

WebApP1icationInitializer，这意味着 SpringServletContainerInitializer 的

onStartUp 方法会获取当前项目中所有实现了 WebApplicationInitializer 接口的最终

落地实现类，如代码清单14-15所示。

代码清单 14-15 SpringServletContainerlnitializer

@HandlesTypes （WebApplicationInitializer.class）

public class SpringServletContainerInitializer implements ServletContainerInitializer｛

@Override

Public void onStartup （Set<Class<?>> webAppInitializerClasses，

ServletContext servletContext）throws ServletException ｛

1/ 加载、实例化 WebApplicationInitializer 对象 ⋯.

for（WebApplicationInitializer initializer :initializers）｛

initlalizer.Onotartup （servLetcontext：

2. SpringBootServetinitializer 的加载

请注意，上⾯提到的ServletInitializer 本身就是个 webApplicationInitializer，

如代码清单 14-16所舌。所以在 SpringServletContainerInitializer 的 onStartUp

方法中实际上获取的就是当前项目中定义的 ServletInitializer类，并在实例化对象后调

用其 onstartup 方法。

1代码清单 14-16 ServletInitializer 本身是⼀个 WebApplicationlnitializer

public class ServletInitializer extends SpringBootServletInitializer

public abstract class SpringBootServletInitializer implements webApplicationInitializer


## 14.4 Spring Boot 2.3 新特性：优雅停机|

由于 onStartUp 方法定义在 ServletInitializer 的⽗类 SpringBootServlet

Initializer 中，下⾯的研究重点放在⽗类的源码上。

3. SpringApplication 的构建与启动

SpringBootServletInitializer 的 onstartUp 方法的核心动作是创建⼀个

WebApplicationContext，⽽创建的过程需要构建 SpringApPlication 并启动，具体的

逻辑如代码清单 14-17所示（难度不大，读者通读⼀遍即可）。注意 createRootApplication

Context 方法的中间有 configure 方法的调用动作，该方法就是子类 Servlet

Initializer 中用来编程式指定 Spring Boot 主启动类的关键步骤。

代码清单 14-17 SpringBootServletInitializer#onStartUp

public void onStartup （ServletContext servletContext） throws ServletException｛

1….....

WebApplicationContext rootApplicationContext = createRootApplicationContext （servletContext）；

protected webApplicationContext createRootApplicationContext （ServletContext servletContext）｛

SpringApplicationBuilder builder = createSpringApplicationBuilder（）；

builder.main （getClass （））；

ApplicationContext parent = getExistingRootWebApplicationContext （servletContext）；

// 存在⽗容器的处理

builder.initializers（new ServletContextApplicationContextInitializer（servletContext））；

builder.contextClass （AnnotationConfigServletWebServerApplicationContext.class）；

//【关键】注意此处会跳转⾄⾃定义的 ServletInitializer子类

builder = configure （builder）；

builder.listeners （new WebEnvironmentPropertysourceInitializer （servletContext））；

1/ 构建 SpringApplication

SpringApplication application = builder.build（）；

// 基于外置 Servlet 容器启动不需要注册回调钩子

application.setRegisterShutdownHook （false）；

// 启动 SpringApplication

return run （application）；

protected WebApplicationContext run （SpringApplication application）｛

return（WebApplicationContext）application.run （）；

经过 SpringApplicationBuilder 的构建并调用SpringApplication 的run 方法，

Spring Boot 项目即可成功启动。


## 14.4 Spring Boot 2.3新特性：优雅停机

在 Spring Boot 的应用运⾏需要停机时，如果直接关闭应用，会导致部分正在处理中的请求

被强制中断，在某些特妹的业务场景中会产⽣脏数据。为了解决这⼀问题，Spring Boot 2.3中

引入了“优雅停机”的新特性，在 Spring Boot 应用被关闭时（注意此处的关闭可以是ki11-2，

但不能是ki11 -9），Spring Boot 会预留⼀小段时间，使应用内部的业务线程执⾏完毕，此时

下⾯通过⼀个简单的测试场景来体会优雅停机的作用效果。想要模拟优雅停机的效果，只

业务逻辑的处理，在线程休眠的前后添加时间戳的打印，以便于测试观察。

@RestController

回调机制。

|第14章 运⾏ Spring Boot 应用

嵌人式 Web 容器不允许客户端有新的请求进人，以此达到优雅停机的效果。


## 14.4.1 测试优雅停机场景

需要编写⼀个处理时间很长的接⼜，如代码清单 14-18所舌，Handler 中使线程休眠10s，模拟

代码清单 14-18 GracefulTestController 用于测试⻓时间响应接口

public class GracefulTestController ｛

@GetMapping （"/test"）

Public String test （）throws Exception ｛

System.out.println （System.currentTimeMillis （））；

TimeUnit .SECONDS.sleep （10）；

System.out.println（System.currentTimeMillis （））；

return "success"；

默认情况下 Spring Boot 的停机方式是⽴即停机（immediate），若想启用优雅停机，需要在

application.properties 中配置 server.shutdown=gracefu1，配置完毕即代表开启

默认策略的优雅停机。此外还可以通过配置 spring.lifecycle.timeout-per-

shutdown-phase 属性，⾃定义缓冲时间（默认为30s）。

请注意，如果读者在学习时使用 IDE 测试优雅停机，需要修改主启动类的内容（见代码清

单14-19），或者引入 actuator 依赖实现优雅停机，⽽不是借助IDE 的停⽌应用。如果直接单

击IDE 中的停⽌按钮，会直接关闭JVM（类似于 ki11-9），从⽽导致⽆法触发优雅停机的

喜代码清单14-19 使用IDE 测试优雅停机的必要修改

@springBootApplication

public class SpringBootLaunchApplication ｛

public static void main （String［］ args） ｛

ApplicationContext ctx = SpringApplication.run （SpringBootLaunchApPlication.class, args）；

// 借助 scanner 实现控制台软退出

Scanner scanner = new Scanner（System.in）；

while （true）｛

String input = scanner.nextLine （）；

if （"exit".equals （input））｛

break；

SpringApplication.exit （ctx）；


exit


准备工作完成后启动项目，使用浏览器访问 localhost:8080/test，此时若不加⼲

预，浏览器在等待 10s后会接收到“success”的字符串响应；若访问请求用⼿动停⽌ Spring

Boot 项目，可以发现浏览器仍然在等待响应，并在 10s后接收到来⾃服务端的"success"

响应。

DispatcherServlet:Completed initialization in 4 ms

// 此⾏为⼿动输入

1/ 输入之后控制台会打印 GracefulShutdown 的缓冲等待

GracefulShutdown :Commencing graceful shutdown. Waiting for active requests to complete

GracefulShutdown :Graceful shutdown complete

ThreadPoolTaskExecutor :Shutting down Executorservice'applicationTaskExecutor'

不同的嵌人式 Web 容器在优雅停机期间应对客户端新请求的响应策略不同：嵌入式 Tomcat

和 Netty 不会接收请求，客户端会响应超时；嵌入式 Undertow 则会直接响应 503错误。


## 14.4.2 优雅停机的实现原理

简单了解优雅停机的使用与现象后，下⾯解释优雅停机的实现原理。以嵌人式 Tomcat 为例，

在 TomcatServletWebServerFactory 创建 TomcatWebServer 时，传入的 Shutdown

枚举即代表停机策略，如代码清单 14-20所舌。注意，此处的参数 shutdown 就是 Spring Boot

全局配置⽂件中 server.shutdown 的值。

代码清单 14-20 创建 TomcatWebServer 时指定停机策略

protected TomcatWebServer getTomcatWebserver （Tomcat tomcat）｛

return new TomcatWebServer （tomcat, getPort （） >= 0, getShutdown （））；

public TomcatWebServer （Tomcat tomcat,boolean autostart,Shutdown shutdown）｛

Assert.notNu11 （tomcat，"Tomcat Server must not be nu11"）；

this.tomcat = tomcat；

this.autostart = autostart；

// 此处会初始化优雅停机的回调钩子

this.gracefulShutdown=（shutdown == Shutdown.GRACEFUL）？new GracefulShutdown（tomcat）：null；

initialize（）；

当 Spring Boot 项目关闭时，根据第8章中了解的回调钩子，WebserverGraceful

ShutdownLifecycle 会被调用，触发停机逻辑判断，如代码清单14-21所示。默认情况下停

机的模式是 IMMEDIATE，对应的if结构会⽴即关闭；⽽如果在嵌人式Web 容器初始化时设置

了优雅停机，则会执⾏ if 结构下⾯的最后⼀⾏代码，即调用 GracefulShutdown 的

shutDownGracefully方法。

代码清单 14-21 WebServerGracefuIShutdownLifecycle 的关闭回调

public void stop（Runnable callback）｛

this.running = falsei

效了。

I第14章 运⾏ Spring Boot 应用

this.webServer.shutDownGracefully （（result）-> callback.run （））；

｝

public void shutDownGracefully（GracefulShutdownCal1back callback）｛

if（this.gracefulShutdown == nul1） ｛

callback.shutdownComplete （GracefulShutdownResult .IMMEDIATE）；

return；

// 此处会执⾏优雅停机

this.gracefulShutdown.shutDownGracefully （callback）；

shutDownGraceful1y方法完成的工作是延迟关闭嵌人式 Web 容器，它会在内部启动⼀

个新的线程，执⾏ doShutdown 方法，如代码清单14-22所舌。doshutdown 方法中⾸先会关

闭Connector，由此 Tomcat 就失去了接收客户端新请求的能⼒；随后该方法中会提取出嵌入

式 Tomcat 中所有Engine 中的所有 Context，每隔50ms 检查其是否停⽌，当所有 Context

中的线程全部执⾏完毕，即 Context 全部停⽌时，优雅停机流程执⾏完毕。

1代码清单 14-22 doShutdown 方法实现优雅停机

void shutDownGracefully（GracefulShutdownCallback callback）｛

logger.info（"Conmencing graceful shutdown.Naiting for active requests to complete"）；

new Thread（（） -> doshutdown （callback），"tomcat-shutdown"）.start （）；

Private void doShutdown （GracefulShutdownCallback callback）1

// 关闭Connector，失去接收客户端新请求的能⼒

List<Connector> connectors = getConnectors （）；

connectors.forEach （this： ：close）；

try｛

Eor （Container host :this.tomcat.getEngine （）.findChildren（））｛

Eor （Container context ： host.findChildren （））｛

1/ 每隔 50ms 检查⼀次 Container 是否停⽌

while （isActive （context））｛

iE（this.aborted）｛

// logger ⋯.

callback.shutdownComplete （GracefulShutdownResult.REQUESTS ACTIVE）；

return；

Thread.sleep （50）；

｝ // catch …

logger.info （"Graceful shutdown complete"）；

callback.shutdownComplete （GracefulShutdownResult .IDLE）；

由代码清单 14-22中可以看到上述测试中打印的两⾏日志，证明优雅停机在底层的确⽣


## 14.5 小结|


## 14.5 小结

本章从 Spring Boot 的部署运⾏出发，分别分析了可独⽴运⾏的jar 包和借助外置Web 容器

的war包运⾏的底层机制，以及其中的特殊设计。Spring Boot 的强大特性之⼀就是可独⽴运⾏，

它通过定制的 jar/war 包目录规则，配合特殊的类加载器，可以实现项目的可独⽴运⾏。此外

Spring Boot 2.3新提供的优雅停机特性，可以使项目更可靠地关闭。


