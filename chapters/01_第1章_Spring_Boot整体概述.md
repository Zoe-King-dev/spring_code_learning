# 第1章 Spring Boot 整体概述

## 本章主要内容

- Spring Framework 与 Spring Boot 概述
- Spring Boot 与 Spring Framework 的关系
- Spring Boot 的核心特性
- Spring Boot 的体系
- 构建和开发第一个基于 Spring Boot 的应用

---

## 1.1 Spring Framework 概述

### 1.1.1 Spring Framework 的历史

Spring Framework 的诞生是为了替代 J2EE 时期的 EJB（Enterprise JavaBeans）规范体系。EJB 作为初期流行的企业级项目开发技术解决方案，设计过于复杂和笨重，导致当时的 Java 开发者对 EJB 不满。

在众多开发者中，有一位优秀且大胆的开发者敢于发声——Rod Johnson（Spring Framework 的创始人之一）。他在 2002 年写了《Expert One-on-One J2EE Design and Development》一书，在书中对当时 J2EE 应用的设计和框架臃肿、低效等问题提出了质疑，并积极寻找解决方案。

2004 年，Spring Framework 1.0.0 横空出世。随后 Rod Johnson 又写了《Expert One-on-One J2EE Development without EJB》一书，直接指明完全可以不使用 EJB 开发 J2EE 应用，而是可以用一种更轻量级、更简单的框架来代替——这就是 Spring Framework。

时间证明，使用 Spring Framework 后的项目在开发阶段的效率比 EJB 高很多，而且 Spring Framework 提供的特性也比 EJB 更强大。于是开发者开始慢慢转用 Spring Framework，并逐步淘汰了 EJB。如今 Spring Framework 已经成为现代 Java EE 开发的标杆。

### 1.1.2 IOC 与 AOP

Spring Framework 的两大核心特性，分别是**控制反转（Inverse of Control, IOC）**和**面向切面编程（Aspect Oriented Programming, AOP）**。

**IOC**的直接体现就是 Spring Framework 的核心容器，这个核心容器又被称为 IOC 容器。它在内部管理了基于 Spring Framework 的应用中会到的所有组件（即 Bean）。在实际的项目开发中，可以通过一些模式注解（如 @Component 等）标注在指定的类上，配合组件扫描，可以实现组件装配到核心容器。如果使用带有特定意义的模式注解，Spring Framework 会认定其有特定功能——例如，对于 @Controller 注解标注的类，Spring WebMvc 会认定其为一个 Web Controller，具有请求处理、视图跳转等功能。

容器除了可以管理 Bean 对象，还可以对这些对象进行增强，使其具有一些其他的特性——例如，对于 @Transactional 注解标注的类，在引入和开启事务管理期间，其方法执行时会自动应用事务。而增强的核心就是依赖 AOP 技术。使用 AOP 技术可以通过预编译/运行时动态代理的方式，对目标对象动态添加功能特性。AOP 的应用可以使核心业务逻辑与系统级服务（如事务控制、日志审计、权限校验等）分离，从而实现组件功能的"可插拔"。

---

## 1.2 Spring Boot 与 Spring Framework 的关系

简单了解 Spring Framework 后，下面聚焦 Spring Boot 框架。Spring Boot 本身不是一个新的框架，而是基于 Spring Framework 之上进行的"二次封装"，因此 Spring Boot 的底层还是 Spring Framework。

Spring Boot 的设计初衷是简化基于 Spring Framework 的项目搭建和应用开发，让开发者不必再纠结烦琐的配置、环境的部署等琐碎问题，而只需专注于业务的开发。

可以这样理解：Spring Boot 是开发者与 Spring Framework 之间的一道中间层，它帮助开发者完成部分基于 Spring Framework 的项目的配置、管理、部署等工作，目的是为开发者"减负"，让开发者专注于项目中的业务开发。

---

## 1.3 Spring Boot 的核心特性

Spring Boot 设计之初的目的是简化基于 Spring Framework 的项目搭建和应用开发，而不是替代 Spring Framework。Spring Boot 提供了以下几个核心特性来帮助开发者省略/简化配置：

### 1.3.1 约定大于配置（Convention Over Configuration）

Spring Boot 对日常开发中比较常见的配置都提供了约定的默认配置，并基于自动装配机制，将场景中通常必需的组件都注册好，以此来达到少配置、甚至不配置就能正常启动项目的效果。

### 1.3.2 场景启动器 Starter

Spring Boot 对常用的场景都进行了整合，将这些场景中所需的依赖都收集整理到一个依赖中，并在其中添加默认的配置，使项目开发中只需要导入一个依赖，即可实现场景技术的整合。

### 1.3.3 自动装配

Spring Boot 基于 Spring Framework 的模块装配 + 条件装配，可以在具体场景下自动引入所需的配置类并解析执行，而且可以根据项目代码中已经配置的内容，动态注册缺少/必要的组件，以此实现约定大于配置的效果。

### 1.3.4 嵌入式 Web 容器

Spring Boot 在运行时可以不依赖外部的 Web 容器，而是使用内部嵌入式 Web 容器来支撑应用的运行。也正因如此，基于 Spring Boot 的应用可以直接以一个单体应用的 jar 包运行。

### 1.3.5 生产级的特性

Spring Boot 提供了一些很有用的生产运维型的功能特性，比如健康检查、监控指标、外部化配置等。

---

## 1.4 Spring Boot 的体系

基于 Spring Boot 的应用仍然是 Spring Framework 的应用，Spring Boot 做的只是帮助开发者整合不同场景下的依赖，以及提供默认的配置等。

Spring Boot 可以整合的技术场景非常多，项目需要用到特定场景或技术时，只需导入对应的启动器依赖，之后编写少量配置甚至不配置，就可以达到场景整合的效果。另外，基于 Starter 场景启动器的整合不需要开发者考虑版本问题，Spring Boot 早已帮助开发者考虑并适配好，开发者只需导入后使用即可。

以下是 Spring Boot 支持的常见场景整合：

- **Spring WebMvc & Spring WebFlux** — Web 应用开发
- **Thymeleaf & FreeMarker** — Web 视图渲染
- **Spring Security** — 安全控制
- **Spring Data Access** — 数据访问（SQL & NOSQL）
- **Spring Cache** — 缓存实现
- **Spring Message** — 消息中间件（JMS & AMQP）
- **Spring Quartz** — 定时任务
- **Spring Distribution Transaction** — 分布式事务（JTA）
- **Spring Session** — 分布式 Session
- **Container Image** — 容器镜像构建支持

> **提示**：本书使用 SpringWebMvc 指代基于 Servlet 的 Web 开发，读者可能对 SpringWebMvc 的更熟悉叫法是 SpringMVC，这两者指代的是同一技术。为了更好地区分 WebMvc 与 WebFlux，本书后续提到的所有 SpringMVC 统称 SpringWebMvc。

---

## 1.5 开发第一个 Spring Boot 应用

在本章的最后一节中，我们来构建一个最基本的 Spring Boot 应用。

> **提示**：在开始第一个 Spring Boot 应用开发之前，先强调一下使用的 Spring Boot 版本。本书使用的 Spring Boot 版本主要有两个：2.3.11 与 2.5.3。之所以选择这两个版本，是考虑到两个重要的原因。其一，Spring Boot 2.3.11 是基于 Spring Framework 5.2.x 的较新版本，而 Spring Boot 2.5.3 是基于 Spring Framework 5.3.x 的现行较新版本，两个 Spring Framework 版本之间会有一些差异，因此本书通过两个 Spring Boot 版本来顺势区分 Spring Framework 的版本。其二，Spring Boot 2.4.x 推出了一些新的特性，这些特性与 Spring Boot 2.3.x 及之前版本的开发方式、底层实现有所不同，因此读者也需要分别研究这两个 Spring Boot 大版本的底层设计。

### 1.5.1 创建项目

创建基于 Spring Boot 项目的方式有很多种，本书主要回顾两种常用的方式。

#### 方式一：基于 Spring Initializer

在 Spring Boot 的官方网站中，有一个醒目的板块可以跳转到 Spring Initializer 来初始化基于 Spring Boot 的项目。

单击 Spring Initializer 即可跳转到在线的 Spring 项目初始化向导网站。

表单中的可选项较多，简单说明如下：

- **Project**：项目创建工具，可选 Maven 或 Gradle
- **Language**：项目编码所使用的开发语言，可选 Java、Kotlin、Groovy
- **Spring Boot**：选择的 Spring Boot 版本
- **Project Metadata**：项目的基本信息，包含 Group、Artifact、Spring Boot 启动类所在的包、打包方式、Java 语言版本等
- **Dependencies**：项目所使用的依赖，这个位置可以搜索并选择 Spring Boot 预先准备好的一些 Starter 场景启动器

选择好所需的依赖后，单击 GENERATE 按钮，生成的代码会以 [工程名.zip] 的压缩包形式下载至本地。之后解压该压缩包，用 IDE（Eclipse 或者 IntelliJ IDEA 等）导入项目即可。

当然，使用在线初始化向导的方式未免有些麻烦，因此 Spring Boot 的开发团队给目前市场上主流的 IDE 都做了内置的插件，可以使用 Spring Initializer 插件来更方便地创建基于 Spring Boot 的项目。

#### 方式二：使用 Maven/Gradle 手动创建

使用 Spring Initializer 的方式本质上是使用初始化向导的固定代码模板生成 Maven/Gradle 项目。在实际的项目开发中更多的情况是自行手动创建。下面使用 IDEA 开发工具新建一个简单的 Spring Boot 项目。

> **提示**：本书后续的所有项目都使用本节创建的目录作为基准。为了统一维护项目，此处会创建两个项目（包含一个 parent 项目，用于统一管理版本）。

在 IDEA 中先创建一个空项目 Empty Project，再依次创建一个 parent 模块和 quickstart 模块。

**parent 模块的 pom.xml 定义**：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.3.11.RELEASE</version>
    </parent>

    <groupId>com.linkedbear.springboot</groupId>
    <artifactId>springboot-00-parent</artifactId>
    <version>1.0-RELEASE</version>
    <packaging>pom</packaging>

    <modules>
        <module>../springboot-01-quickstart</module>
    </modules>

    <properties>
        <java.version>1.8</java.version>
    </properties>
</project>
```

**quickstart 模块的 pom.xml 定义**：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>springboot-00-parent</artifactId>
        <groupId>com.linkedbear.springboot</groupId>
        <version>1.0-RELEASE</version>
        <relativePath>../springboot-00-parent/pom.xml</relativePath>
    </parent>

    <modelVersion>4.0.0</modelVersion>
    <artifactId>springboot-01-quickstart</artifactId>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

### 1.5.2 编写简单代码

下面编写一个简单的 Controller 来测试 WebMvc 场景的效果。在主启动类所在包下新建一个 Controller 包，并添加 HelloController 类：

```java
@RestController
public class HelloController {

    @GetMapping("/hello")
    public String hello() {
        return "hello springboot";
    }
}
```

> **提示**：使用 @RestController 后 Controller 中所有被 @RequestMapping 标注的方法相当于添加了 @ResponseBody 注解，会将方法的返回值序列化为 JSON 响应给客户端。

代码编写完成后，程序运行的预期是启动项目，访问 `/hello` 请求，可以响应 "hello springboot" 的字符串内容。

运行 SpringBootQuickstartApplication 主启动类，控制台会打印 `Tomcat started on port(s): 8080 (http) with context path ''`，说明项目已经成功启动。在浏览器中访问 `http://localhost:8080/hello`，可以成功响应。

---

## 1.6 小结

本章主要回顾了 Spring Framework 的基本知识与核心特性、Spring Boot 的体系与核心特性，以及使用 IDEA 创建简单的 Spring Boot 项目。Spring Boot 本身是基于 Spring Framework 之上封装的更易于开发的"脚手架"，借助 Spring Boot 约定大于配置的原则，在创建项目时，只需导入一个场景启动器，无须编写任何配置，应用即可运行。
