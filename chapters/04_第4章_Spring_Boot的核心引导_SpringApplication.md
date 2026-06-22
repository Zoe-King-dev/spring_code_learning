# 第4章 Spring Boot 的核心引导：SpringApplication

## 4.1 总体设计

SpringApplication 是 Spring Boot 的核心引导类，负责启动整个 Spring Boot 应用。在深入了解其生命周期之前，我们先从宏观层面了解几个重要的设计特性。

### 4.1.1 启动失败报告

当 Spring Boot 应用启动失败时，框架会输出清晰的错误报告，帮助开发者快速定位问题。例如：

```
APPLICATION FAILED TO START
Port 8080 was already in use.
```

负责输出错误报告的是 **FailureAnalyzers** 组件。该组件实现了 `SpringBootExceptionReporter` 接口，它的内部集成了多个 `FailureAnalyzer`，用于分析不同类型的启动异常。

**代码清单 4-1 FailureAnalyzers 的内部结构**

```java
final class FailureAnalyzers implements SpringBootExceptionReporter {

    private final List<FailureAnalyzer> analyzers;

    FailureAnalyzers(ConfigurableApplicationContext context, ClassLoader classLoader) {
        this.analyzers = loadFailureAnalyzers(classLoader);
        prepareFailureAnalyzers(this.analyzers, context);
    }

    private List<FailureAnalyzer> loadFailureAnalyzers(ClassLoader classLoader) {
        List<String> analyzerNames = SpringFactoriesLoader
                .loadFactoryNames(FailureAnalyzer.class, classLoader);
        // 加载并实例化所有 FailureAnalyzer
    }
}
```

FailureAnalyzers 利用 Spring Framework 的 SPI 机制，从 `spring.factories` 中读取所有配置的 FailureAnalyzer。Spring Boot 在 `spring-boot-autoconfigure` 依赖的 `spring.factories` 文件中已经配置了默认的 FailureAnalyzer：

**代码清单 4-2 Spring Boot 默认的 FailureAnalyzer 配置**

```properties
# Failure Analyzers
org.springframework.boot.diagnostics.FailureAnalyzer=\
  org.springframework.boot.context.aop.NotConstructorBoundInjectionFailureAnalyzer,\
  org.springframework.boot.diagnostics.aop.BeanCurrentlyInCreationFailureAnalyzer,\
  org.springframework.boot.diagnostics.aop.BeanDefinitionOverrideFailureAnalyzer,\
  org.springframework.boot.diagnostics.aop.BeanNotOfRequiredTypeFailureAnalyzer,\
  org.springframework.boot.diagnostics.aop.BindFailureAnalyzer,\
  org.springframework.boot.diagnostics.aop.BindValidationFailureAnalyzer,\
  org.springframework.boot.diagnostics.aop.NoSuchMethodFailureAnalyzer,\
  org.springframework.boot.diagnostics.aop.InvalidConfigurationPropertyValueFailureAnalyzer,\
  org.springframework.boot.diagnostics.aop.NoUniqueBeanDefinitionFailureAnalyzer,\
  org.springframework.boot.diagnostics.aop.PortInUseFailureAnalyzer,\
  org.springframework.boot.diagnostics.aop.ValidationExceptionFailureAnalyzer,\
  org.springframework.boot.diagnostics.aop.InvalidConfigurationPropertyNameFailureAnalyzer
```

可以发现，Spring Boot 默认已经检查了多种常见的启动异常类型。如果默认检查的类型不够完善，开发者可以自行编写 `FailureAnalyzer` 的实现类来解析特定异常。

> **提示**：即使不扩展任何 FailureAnalyzer，依然可以通过将日志输出级别调整为 DEBUG，来获取更详细的调试信息。

### 4.1.2 Bean 的延迟初始化

默认情况下，如果没有任何特殊声明，ApplicationContext 中的 Bean 都会在应用程序启动阶段统一预先创建好。启用 Bean 的延迟初始化后，IOC 容器中的绝大多数 Bean 都会延迟到实际需要时才创建（只有 `SmartInitializingSingleton` 类型的 Bean 依然会提早初始化）。这种配置可以显著减少应用程序的启动耗时。

启用 Bean 的延迟初始化非常简单，只需在全局配置文件中添加一行配置：

```properties
spring.main.lazy-initialization=true
```

延迟初始化带来的问题是：一部分本应在应用程序启动阶段就能发现的问题，由于关键组件的 Bean 对象被延迟到应用程序运行阶段才初始化，要等到真正使用它的时候才会被发现。

> **提示**：如果在全局开启了 Bean 的延迟初始化，同时又需要某些 Bean 在应用程序启动阶段就初始化就绪，可以在类上标注 `@Lazy(false)` 注解。

### 4.1.3 SpringApplication 的定制

通常在编写 Spring Boot 应用程序主启动类时，会直接使用 `SpringApplication.run()` 方法用一行代码完成启动。但 SpringApplication 本身的设计非常灵活，可以利用相关 API 来定制化启动过程。Spring Boot 提供了两种定制化启动方式。

**方式一：直接操作 SpringApplication 的 API**

```java
public static void main(String[] args) {
    SpringApplication springApplication = new SpringApplication();
    springApplication.setMainApplicationClass(MySpringBootApplication.class);
    springApplication.setBannerMode(Banner.Mode.OFF);  // 关闭 Banner 打印
    springApplication.run(args);
}
```

**方式二：借助构建器实现链式定制**

```java
public static void main(String[] args) {
    new SpringApplicationBuilder(MySpringBootApplication.class)
            .bannerMode(Banner.Mode.OFF)
            .web(WebApplicationType.NONE)  // 指定 Web 应用类型为非 Web
            .run(args);
}
```

两种操作方式基本类似，不过有一点值得注意：利用 `SpringApplicationBuilder` 可以构建具有层次关系的 Spring Boot 应用程序：

```java
new SpringApplicationBuilder(...).parent(...).child(...).run(...);
```

这种构建完成后的效果是，应用程序内部会形成多个 ApplicationContext，且彼此之间是父子关系。官方文档说明：构建 ApplicationContext 层次结构时有一下限制，例如 Web 组件必须包含在子上下文中，并且 Environment 对于父上下文和子上下文是相同的。

### 4.1.4 Web 类型推断

Spring Boot 的一大优势是整合不同场景时的简单易操作性。当项目中需要整合 Spring WebMvc 时，只需引入 `spring-boot-starter-web` 依赖；整合 Spring WebFlux 时，只需引入 `spring-boot-starter-webflux` 依赖。Spring Boot 会在底层推断应用应该用哪种 IOC 容器实现来支撑整个应用的运转。

Spring Boot 2.x 基于 Spring Framework 5.x，Web 场景的解决方案有 WebMvc 和 WebFlux 两种，所以 Web 应用类型相应分为三种：

- **Servlet**（对应 WebMvc）
- **Reactive**（对应 WebFlux）
- **None**（非 Web 应用）

根据官方文档的描述，Web 类型的推断规则如下：

- 如果 `SpringWebMvc` 存在，则启用 Servlet 环境
- 如果 `SpringWebMvc` 不存在但 `SpringWebFlux` 存在，则启用 Reactive 环境
- 如果两者都不存在，则启用最原始的没有任何 Web 概念的 None 环境

> **注意**：推断规则中有一个细节：当 Spring WebMvc 与 Spring WebFlux 同时出现在项目中时，WebFlux 默认失效，除非我们手动定制 SpringApplication，指定 WebApplicationType 为 Reactive。

### 4.1.5 监听与回调

原生的 Spring Framework 中已经构建了一套完善的事件监听机制。开发者可以基于 Spring Framework 的应用程序中编写事件，配合广播器与监听器，实现自定义的事件监听。Spring Framework 已经预先构建了一些基于 ApplicationContext 的事件（如 `ContextRefreshedEvent` 等）。

Spring Boot 在此基础上进一步扩展了事件监听机制。由于 Spring Boot 的应用启动方式是通过 `SpringApplication` 这个核心 API，在这个 API 的调用期间也有属于它自己的生命周期。Spring Boot 在该部分生命周期中又扩展了新的可切入扩展点，也就是基于 SpringApplication 的事件监听。

核心事件监听类是 `SpringApplicationRunListener`，它是专门用于广播 Spring Boot 事件的监听器。

**1. SpringApplicationRunListener 接口详解**

官方文档中并没有给 `SpringApplicationRunListener` 留出太多篇幅，javadoc 中也只是简单地用一句话概括：SpringApplicationRunListener 是监听 SpringApplication 在 run 方法内的监听器。

其实 SpringApplicationRunListener 确实是只监听 run 方法的，只不过这个 run 方法内部逻辑非常复杂，涉及特别多的切入点和扩展点。留有一个监听器，可以在 SpringApplication 中预先定义好的切入点中扩展自定义逻辑。

`SpringApplicationRunListener` 本身是一个接口，它定义了 7 个事件回调的方法，如下表所示：

| 接口方法 | 可获得的组件 | 回调时机 |
|---------|-------------|---------|
| starting | - | 调用 SpringApplication 的 run 方法时 |
| environmentPrepared | ConfigurableEnvironment | Environment 构建完成，但在创建 ApplicationContext 之前 |
| contextPrepared | ConfigurableApplicationContext | 创建和准备 ApplicationContext 之后，但在加载之前 |
| contextLoaded | ConfigurableApplicationContext | ApplicationContext 已加载，但尚未刷新 IOC 容器之前 |
| started | ConfigurableApplicationContext | IOC 容器已刷新，但未调用 CommandLineRunners 和 ApplicationRunners 时 |
| running | ConfigurableApplicationContext | 在 run 方法彻底完成之前 |
| failed | ConfigurableApplicationContext, Throwable | run 方法执行过程中抛出异常时 |

如果需要自定义 `SpringApplicationRunListener` 的实现类，在注册时不能直接使用 `@Component` 等常规的 Bean 注册方式，而是需要配置到 `spring.factories` 文件中，利用 SPI 机制加载。

> **注意**：`SpringApplicationRunListener` 的实现类要求必须显式定义一个包含两个参数的构造方法。

**代码清单 4-3 SpringApplicationRunListener 的实现示例**

```java
public class TestRunListener implements SpringApplicationRunListener {

    public TestRunListener(SpringApplication application, String[] args) {
        // 虽然不编写任何逻辑，但构造方法必须存在
    }
}
```

**2. Spring Boot 新引入的事件**

与 `SpringApplicationRunListener` 的各个事件方法对应，Spring Boot 给每个方法都定义了一个新的事件模型，用于支撑普通的 `ApplicationListener` 使用：

- `starting` — `ApplicationStartingEvent`
- `contextPrepared` — `ApplicationContextInitializedEvent`
- `contextLoaded` — `ApplicationPreparedEvent`
- `started` — `ApplicationStartedEvent`
- `running` — `ApplicationReadyEvent`
- `failed` — `ApplicationFailedEvent`

> **注意**：部分事件在广播时，通过正常方式注册的监听器无法感知，因为这些事件广播的时候 ApplicationContext 还没有被创建出来，自然也就无法有效地初始化监听器。因此如果需要监听这些事件，需要通过调用 `SpringApplication` 或者 `SpringApplicationBuilder` 的 API 来编程式注册监听器，或者在 `spring.factories` 文件中配置监听器的实现类。

**代码清单 4-4 编程式注册监听器**

```java
new SpringApplicationBuilder(MySpringBootApplication.class)
        .listeners(new ApplicationStartingListener()).run(args);
```

### 4.1.6 应用退出

当 Spring Boot 应用启动成功后，内部的 ApplicationContext 会连带注册一个 shutdown hook 线程（准确的时机是在 IOC 容器刷新之前）。当 JVM 退出时，shutdown hook 线程可以确保 IOC 容器中的 Bean 执行销毁阶段生命周期回调（如被 `@PreDestroy` 注解标注的方法），从而合理地销毁 IOC 容器及其所有的 Bean。

从源码的角度看，它注册的关闭钩子的线程名称是固定的 `SpringContextShutdownHook`，并且线程中的执行逻辑就是关闭 IOC 容器本身，该方法会销毁 IOC 容器中的所有 Bean 并关闭 BeanFactory。

**代码清单 4-5 注册的关闭钩子用于关闭 IOC 容器**

```java
String SHUTDOWN_HOOK_THREAD_NAME = "SpringContextShutdownHook";

public void registerShutdownHook() {
    if (this.shutdownHook == null) {
        // 创建钩子
        this.shutdownHook = new Thread(SHUTDOWN_HOOK_THREAD_NAME) {
            @Override
            public void run() {
                synchronized (startupShutdownMonitor) {
                    doClose();
                }
            }
        };
        // 注册钩子
        Runtime.getRuntime().addShutdownHook(this.shutdownHook);
    }
}
```

## 4.2 生命周期概述

了解了 SpringApplication 的整体设计之后，下面从宏观层面了解一个 Spring Boot 应用从开始执行 main 方法到最终退出的整个生命周期都经历了哪些重要环节。

> **说明**：本节旨在让读者先了解大体环节，详细的原理和底层源码，我们统一放到本书第二部分展开讲解。

### 4.2.1 创建 SpringApplication

当执行 `SpringApplication.run` 方法时，底层实际上帮我们创建了一个 SpringApplication 对象并调用其 run 方法。

**代码清单 4-6 SpringApplication#run**

```java
public static ConfigurableApplicationContext run(Class<?>[] primarySources, String[] args) {
    return new SpringApplication(primarySources).run(args);
}
```

除了常规地使用 SpringApplication 的静态 run 方法，也可以自行创建 SpringApplication 对象。无论自行创建，还是借助 `SpringApplicationBuilder` 的流式 API 创建，最终得到的都是一个可以调用 run 方法的完整 SpringApplication 对象。

在创建 SpringApplication 的过程中，以下关键步骤值得注意：

- **Web 应用类型判断**：Spring Boot 会根据当前应用的类路径确定当前应用最匹配的 Web 类型，这个 Web 类型会影响到实际创建的 ApplicationContext 落地实现类的类型

- **初始化器与监听器的加载**：在启动 SpringApplication 之前，它会先收集一些前期准备好的 `ApplicationContextInitializer` 以及 `ApplicationListener`，这些组件会在启动 SpringApplication 的环节中发挥作用

- **确定主启动类**：Spring Boot 会根据当前应用的启动状态，从方法调用栈中找到主启动类并记录下来，这个主启动类会参与默认 Banner 的打印

### 4.2.2 启动 SpringApplication

SpringApplication 创建完毕后，下一步是应用启动。整个 SpringApplication 的启动逻辑非常复杂，核心步骤大概分为以下 8 步：

**1. 获取 SpringApplicationRunListener 监听器**

该监听器会贯穿整个 SpringApplication 的启动过程。

**2. 准备运行时环境**

即 ApplicationContext 中的 Environment。

**3. Banner 的加载与打印**

默认情况下打印的 Banner 是以文字形式打印到控制台。可以通过定制 SpringApplication 来自定义配置。

**4. 创建 ApplicationContext IOC 容器**

该步骤创建的依据是创建 SpringApplication 时推断的 Web 应用类型，不同的 Web 应用类型对应不同的 ApplicationContext 落地实现。

**5. 初始化 IOC 容器**

该步骤会应用前面步骤准备的 `ApplicationContextInitializer`，并获取和加载配置源（默认是主启动类）。

**6. 刷新 IOC 容器**

该步骤会触发 ApplicationContext 的核心 refresh 方法，逻辑极其复杂。

**7. 启动嵌入式 Web 容器（如果有的话）**

当 Web 应用类型不是 None 并且以独立运行的 jar 包运行 Spring Boot 时，底层会额外创建一个嵌入式 Web 容器（默认是 Tomcat）并启动。

**8. 回调 Spring Boot 的运行器**

包括 `ApplicationRunner` 和 `CommandLineRunner`。

### 4.2.3 应用退出

当应用被关闭时，Spring Boot 考虑到应用中可能会存在一些需要释放的资源，于是在 SpringApplication 启动时会额外向 JVM 中注册一个"钩子线程"。这个线程会专门监听应用是否被关闭，以及关闭应用时要执行的释放资源等操作（例如释放数据库连接池中的连接）。源码部分在前面的 4.1.6 节已经解释过，这里不再赘述。

## 4.3 小结

本章主要对 Spring Boot 的核心启动引导类 SpringApplication 有一个整体层面的介绍。

SpringApplication 中的结构、逻辑本质上都是基于 Spring Framework 中 ApplicationContext 之上的扩展。ApplicationContext 中除了 IOC 特性，另一个核心特性是 AOP，下一章会研究 Spring Boot 对 AOP 的支持。
