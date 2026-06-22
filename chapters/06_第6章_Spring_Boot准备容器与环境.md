# 第6章 Spring Boot 准备容器与环境

## 本章主要内容

- SpringApplication 的创建流程全解析
- SpringApplication 的启动阶段
- 内置 IOC 容器的创建流程
- SpringApplication 的事件回调机制

## 概述

本书第1部分的内容系统地讲解了 Spring Boot 的核心容器设计，第2部分将针对 Spring Boot 的完整启动过程作一个全面、详细的全生命周期解析。本章先来探究 SpringApplication 这个核心引导类，它的设计在第4章已经详细探讨过，本章的重点是它的工作全流程。

按照 Spring Boot 推荐的主启动类编写方式，在主启动类的 main 方法中使用 SpringApplication 的静态 run 方法，以一行代码即可启动 Spring Boot 应用，如代码清单 6-1 所示。

**代码清单 6-1 经典的 Spring Boot 主启动类编写方式**

```java
public class SpringBootLifecycleApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringBootLifecycleApplication.class, args);
    }
}
```

本章研究的核心是 SpringApplication 的静态 run 方法，下面正式进入源码分析环节。

进入 run 方法后，可以发现最终调用的是下面重载的 run 方法，而重载的 run 方法又将启动的动作拆解为两步：创建 SpringApplication 对象；启动 SpringApplication（见代码清单 6-2）。针对这两个动作下面分别展开解析。

**代码清单 6-2 SpringApplication 的 run 方法调用**

```java
public static ConfigurableApplicationContext run(Class<?> primarySource, String... args) {
    return run(new Class<?>[] { primarySource }, args);
}

public static ConfigurableApplicationContext run(Class<?>[] primarySources, String[] args) {
    return new SpringApplication(primarySources).run(args);
}
```

## 6.1 创建 SpringApplication

静态 run 方法调用的 SpringApplication 构造方法中只传入了主启动类，但同时 SpringApplication 还支持传入特定的 ResourceLoader 以实现自定义的资源加载，通常情况下在项目开发中不会使用特殊定制的 ResourceLoader，故该部分可以忽略。由代码清单 6-3 可以看出，最终调用的是下面的两参数构造方法（关键步骤已标有注释）。

**代码清单 6-3 SpringApplication 的构造方法调用**

```java
private Set<Class<?>> primarySources;

public SpringApplication(Class<?>... primarySources) {
    this(null, primarySources);
}

public SpringApplication(ResourceLoader resourceLoader, Class<?>... primarySources) {
    this.resourceLoader = resourceLoader;

    Assert.notNull(primarySources, "PrimarySources must not be null");

    // 将传入的 SpringBootLifecycleApplication 启动类放入 primarySources 中
    // 这样 Spring Boot 应用就知道主启动类在哪里，名称是什么
    // Spring Boot 一般称呼这种主启动类叫 primarysource（主配置资源来源）
    this.primarySources = new LinkedHashSet<>(Arrays.asList(primarySources));

    // 判断应用环境
    this.webApplicationType = WebApplicationType.deduceFromClasspath();

    // 设置应用初始化器
    setInitializers((Collection) getSpringFactoriesInstances(ApplicationContextInitializer.class));

    // 设置 Spring Boot 全局监听器
    setListeners((Collection) getSpringFactoriesInstances(ApplicationListener.class));

    // 确定主启动类
    this.mainApplicationClass = deduceMainApplicationClass();
}
```

由代码清单 6-3 可以发现，SpringApplication 的构造方法中存储了传入的主配置资源来源 primarySources，后续还有几个复杂动作，逐一来拆解。

### 6.1.1 推断 Web 环境

SpringApplication 构造方法的第一步会从当前应用的类路径下尝试寻找一些特定的类，并以此推断当前应用适合使用哪种 Web 环境，如代码清单 6-4 所示。

**代码清单 6-4 Web 环境类型推断**

```java
// 全限定名常量有精简
private static final String[] SERVLET_INDICATOR_CLASSES = {
    "javax.servlet.Servlet",
    "org.springframework.web.context.ConfigurableWebApplicationContext"
};

private static final String WEBMVC_INDICATOR_CLASS = "org.springframework.web.servlet.DispatcherServlet";
private static final String WEBFLUX_INDICATOR_CLASS = "org.springframework.web.reactive.DispatcherHandler";
private static final String JERSEY_INDICATOR_CLASS = "org.glassfish.jersey.servlet.ServletContainer";

static WebApplicationType deduceFromClasspath() {
    if (ClassUtils.isPresent(WEBFLUX_INDICATOR_CLASS, null)
            && !ClassUtils.isPresent(WEBMVC_INDICATOR_CLASS, null)
            && !ClassUtils.isPresent(JERSEY_INDICATOR_CLASS, null)) {
        return WebApplicationType.REACTIVE;
    }

    for (String className : SERVLET_INDICATOR_CLASSES) {
        if (!ClassUtils.isPresent(className, null)) {
            return WebApplicationType.NONE;
        }
    }

    return WebApplicationType.SERVLET;
}
```

具体的推断规则如下：

1. 如果 WebFlux 的核心控制器 DispatcherHandler 存在，并且 WebMvc 的核心控制器 DispatcherServlet 不存在，则启用 Reactive 环境；
2. 如果 Servlet 类以及 ConfigurableWebApplicationContext 中有任何 一个不存在，则认为导入 WebMvc 相关的环境不全，从而启用 None 环境；
3. 否则，启用 Servlet 环境（包含只导入了 WebMvc 环境，以及 WebMvc 与 WebFlux 共存的情况）。

### 6.1.2 设置初始化器

```java
setInitializers((Collection) getSpringFactoriesInstances(ApplicationContextInitializer.class));
```

紧接着的第二步要利用 Spring Framework 的 SPI 机制，从 spring.factories 中加载一组 ApplicationContextInitializer 的初始化器并应用到当前项目中。首先读者要对 ApplicationContextInitializer 有一个认识。

#### 1. ApplicationContextInitializer 简介

参照文档注释可以对 ApplicationContextInitializer 有一个初步的了解：

> Callback interface for initializing a Spring ConfigurableApplicationContext prior to being refreshed. Typically used within web applications that require some programmatic initialization of the application context. For example, registering property sources or activating profiles against the context's environment.

ApplicationContextInitializer 是一个用于在刷新容器之前初始化 ConfigurableApplicationContext 的回调接口。通常在需要对应程序上下文进行某些编程初始化的 Web 应用程序中使用，例如根据上下文环境注册属性源或激活配置文件。

ApplicationContextInitializer 处理器鼓励检测是否已实现 Ordered 接口或者是否标注了 @Order 注解，并在调用之前相应地对实例进行排序。

文档注释理解起来有一些难度，不过第一段内容就已经表明，ApplicationContextInitializer 是一个在 IOC 容器刷新之前被回调的接口，这也意味着它可以在 IOC 容器创建之后、未触发刷新动作之前执行额外的逻辑处理。

借助 IDE 可以发现 ApplicationContextInitializer 是一个接口，并且只有一个 initialize 方法，该方法需要传入一个 ConfigurableApplicationContext 的实现类，用于在方法体内对 IOC 容器进行一些前置处理（只有传入 Configurable 前缀的 IOC 容器才允许对其进行修改），如代码清单 6-5 所示。

**代码清单 6-5 ApplicationContextInitializer**

```java
public interface ApplicationContextInitializer<C extends ConfigurableApplicationContext> {

    void initialize(C applicationContext);
}
```

下面介绍 ApplicationContextInitializer 的一个经典实现类，这个类来自 spring-boot-starter-web 的 ServletContextApplicationContextInitializer，它的作用是将 ApplicationContext 与 ServletContext 互相放置于对方容器中，以便可以互相查找获取，核心源码如代码清单 6-6 所示。

**代码清单 6-6 ServletContextApplicationContextInitializer 的实现**

```java
public class ServletContextApplicationContextInitializer
        implements ApplicationContextInitializer<ConfigurableWebApplicationContext>, Ordered {

    private final ServletContext servletContext;

    public ServletContextApplicationContextInitializer(ServletContext servletContext) {
        this(servletContext, false);
    }

    // ...

    @Override
    public void initialize(ConfigurableWebApplicationContext applicationContext) {
        applicationContext.setServletContext(this.servletContext);
        if (this.addApplicationContextAttribute) {
            this.servletContext.setAttribute(WebApplicationContext.ROOT_WEB_APPLICATION_CONTEXT_ATTRIBUTE,
                    applicationContext);
        }
    }
}
```

#### 2. 设置初始化器的逻辑

简单了解了 ApplicationContextInitializer 的设计之后，下面我们看一下 Spring Boot 是如何加载这些初始化器并且应用于 ApplicationContext 本身的。

```java
setInitializers((Collection) getSpringFactoriesInstances(ApplicationContextInitializer.class));
```

注意，setInitializers 方法中传入的 ApplicationContextInitializer 集合是由 getSpringFactoriesInstances 方法获取而来的，该方法明显是通过使用 Spring Framework 的 SPI 机制获取的，通过源码也可以明显看出，如代码清单 6-7 所示。

**代码清单 6-7 getSpringFactoriesInstances 的底层利用 Spring Framework 的 SPI 机制**

```java
private <T> Collection<T> getSpringFactoriesInstances(Class<T> type) {
    return getSpringFactoriesInstances(type, new Class<?>[] {});
}

private <T> Collection<T> getSpringFactoriesInstances(Class<T> type,
        Class<?>[] parameterTypes, Object... args) {
    ClassLoader classLoader = getClassLoader();

    // 此处使用了 Spring Framework 的 SPI 机制
    Set<String> names = new LinkedHashSet<>(
        SpringFactoriesLoader.loadFactoryNames(type, classLoader));

    List<T> instances = createSpringFactoriesInstances(type, parameterTypes,
            classLoader, args, names);

    AnnotationAwareOrderComparator.sort(instances);

    return instances;
}
```

### 6.1.3 设置监听器

ApplicationContextInitializer 设置完毕后，下一个核心动作是设置 ApplicationListener 监听器，设置的逻辑与上一步完全一致，不再赘述。下面简单介绍 Spring Framework 的事件驱动模型。

#### 1. Spring Framework 的事件驱动模型

Spring Framework 中体现观察者模式的特性是事件驱动和监听器。在事件驱动模型中监听器充当订阅者，监听特定的事件，事件源充当被观察的主题，用来发布事件；IOC 容器本身可以看作事件广播器，对应的角色是观察者。Spring Framework 的事件驱动核心概念分为4个：事件源、事件、广播器、监听器。

- **事件源**：发布事件的对象。
- **事件**：事件源发布的信息或作出的动作（即 ApplicationEvent）。
- **广播器**：事件真正广播给监听器的对象（即 ApplicationContext）。
    - ApplicationContext 接口实现了 ApplicationEventPublisher 接口，具备事件广播器发布事件的能力。
    - ApplicationEventMulticaster 组合了所有的监听器，具备事件广播器广播事件的能力。
- **监听器**：监听事件的对象（即 ApplicationListener）。

#### 2. ApplicationListener

ApplicationListener 接口的设计本身继承自 JDK 原生的观察者模式接口 EventListener，如代码清单 6-8 所示（其实 Spring Framework 中的很多组件设计都基于 JDK 原生的 API）。

**代码清单 6-8 ApplicationListener**

```java
public interface ApplicationListener<E extends ApplicationEvent> extends EventListener {

    void onApplicationEvent(E event);
}
```

有关 ApplicationListener 的描述，在 javadoc 中解释得言简意赅：

> Interface to be implemented by application event listeners. Based on the standard java.util.EventListener interface for the Observer design pattern. As of Spring 3.0, an ApplicationListener can generically declare the event type that it is interested in. When registered with a Spring ApplicationContext, events will be filtered accordingly, with the listener getting invoked for matching event objects only.

由应用程序事件监听器实现的接口直接继承自 JDK 中观察者模式的 java.util.EventListener 标准接口。

从 Spring 3.0 版本开始，ApplicationListener 可以使用泛型类型声明监听的事件类型。当监听器注册到 IOC 容器后，底层将相应地过滤事件，并且仅针对匹配的事件对象调用所有合适的监听器。

对于上述内容，读者可以先简单地对事件机制以及 ApplicationListener 有一个初步了解，至于事件机制在 Spring Framework 和 Spring Boot 底层如何运行，在第7章才能看到。

### 6.1.4 确定主启动类

创建 SpringApplication 的最后一步，deduceMainApplicationClass 方法会确定主启动类，对应的查找方式是借助方法调用栈，寻找触发方法名为 main 的所在类，如代码清单 6-9 所示。

**代码清单 6-9 确定主启动类的核心逻辑**

```java
private Class<?> deduceMainApplicationClass() {
    try {
        StackTraceElement[] stackTrace = new RuntimeException().getStackTrace();
        for (StackTraceElement stackTraceElement : stackTrace) {
            // 从本方法开始往上查找，哪一层调用栈上有 main 方法，方法对应的类就是主配置类
            if ("main".equals(stackTraceElement.getMethodName())) {
                return Class.forName(stackTraceElement.getClassName());
            }
        }
    }
    // catch ...
    return null;
}
```

借助 Debug 调试可以很清楚地发现，stackTrace 的内容就是正在触发的方法调用栈信息，而最终获取到的 main 方法所在类就是目前启动测试的主启动类 SpringBootLifecycleApplication。

### 6.1.5 与 Spring Boot 1.x 的区别

补充一下与 Spring Boot 1.x 版本的对比。

> 提示：由于本书在进行源码分析时主要采用 Spring Boot 2.3.x 版本的源码，而不同的版本中底层的实现会有一些差别，为了能更好地理解版本间的一些设计上的区别，在一些特殊的位置会引用其他版本的 Spring Boot 源码进行对比。

#### 1. 主配置类概念的引入

Spring Boot 2.x 中引入了一个新的概念：主配置类。这个设计与 Spring Boot 1.x 有区别，在 Spring Boot 1.x 中没有这个概念，所有的配置源都被视为 Object 类型，存放在 SpringApplication 的成员属性中：

```java
// Spring Boot 1.x
private final Set<Object> sources = new LinkedHashSet<Object>();
```

而到了 Spring Boot 2.x 版本后，Spring 团队认为项目应该全面支持注解配置类的方式，尽可能地不使用 XML 配置文件进行应用配置，于是在 SpringApplication 的属性成员中单独抽取了一个新的集合 primarySources，并将其命名为"主配置类"：

```java
// Spring Boot 2.x
private Set<Class<?>> primarySources;
private Set<String> sources = new LinkedHashSet<>();
```

注意，此处的 sources 的集合泛型被替换为 String 类型，这个设计又有什么特殊之处呢？

结合上面 Spring Boot 1.x 的 Object 泛型，读者可以大概猜测出来，利用两个 Set 集合就可以分离出两种不同的配置载体，而这两种载体就是 Spring Framework 支持的 XML 配置文件与注解配置类。因为 Spring Boot 1.x 中没有主配置类的概念，所以 sources 里既要存放注解配置类，又要考虑存入 XML 配置文件的路径（甚至一个包扫描的路径），因此被迫将 sources 集合的泛型置为 Object；而 Spring Boot 2.x 中引入了主配置类的概念，并且 Spring Boot 本身鼓励开发者使用注解配置类，尽量避免使用 XML 配置文件作为配置源（当然如果确实仍需要使用，它还予以支持），所以 Spring Boot 将重心放在 primarySources。

#### 2. Web 类型推断的区别

由于 Spring Boot 1.x 基于 Spring Framework 4.x，而 4.x 还没有 WebFlux 模块，因此在 Web 类型推断时只会在 Servlet 与 None 之间选择，并且推断的方法也是直接在 SpringApplication 中实现的。而到了 Spring Boot 2.x 后 Web 类型推断的逻辑被单独抽取为一个静态方法，如代码清单 6-10 所示。

**代码清单 6-10 Web 类型推断的区别**

```java
// Spring Boot 2.x
this.webApplicationType = WebApplicationType.deduceFromClasspath();

// Spring Boot 1.x
this.webEnvironment = deduceWebEnvironment();
```

### 6.1.6 与 Spring Boot 2.4.x 的区别

Spring Boot 版本升级到 2.4.x 之后，在创建 SpringApplication 的阶段引入了一个新的扩展切入机制：借助 BootstrapRegistry 实现重对象的预创建/共享。

#### 1. BootstrapRegistry

BootstrapRegistry 是 Spring Boot 2.4.0 版本后引入的全新 API，从类名上理解 BootstrapRegistry 有注册表的概念，同时又有启动器引导的概念，借助 javadoc 可以大体了解它的用途：

> A simple object registry that is available during startup and Environment post-processing up to the point that the ApplicationContext is prepared. Can be used to register instances that may be expensive to create, or need to be shared before the ApplicationContext is available. The registry uses Class as a key, meaning that only a single instance of a given type can be stored.

简单来说，BootstrapRegistry 是一个全新的对象容器，它内部存放的对象最终会传递给 ApplicationContext（即 IOC 容器），它可以用于提前创建一些重对象（创建成本高的对象）。这种设计不难理解，BootstrapRegistry 可以在 ApplicationContext 初始化之前预先初始化一些创建成本很高的对象，等到 ApplicationContext 真正需要初始化时，BootstrapRegistry 可以直接将这些重对象共享给 ApplicationContext，使得 IOC 容器不再需要初始化这些重对象，从而避免 IOC 容器初始化过程过慢的问题。

BootstrapRegistry 的唯一实现是 DefaultBootstrapContext，通过观察代码清单 6-11 可以进一步体会到，BootstrapRegistry 本身只是一个容器。

**代码清单 6-11 DefaultBootstrapContext 只是一个对象容器**

```java
public class DefaultBootstrapContext implements ConfigurableBootstrapContext {

    private final Map<Class<?>, InstanceSupplier<?>> instanceSuppliers = new HashMap<>();
    private final Map<Class<?>, Object> instances = new HashMap<>();
}
```

容器中只有两个 Map，其中 instances 负责存放对象，instanceSuppliers 则存放对象创建器。

#### 2. BootstrapRegistryInitializer

BootstrapRegistry 本身只是一个容器，要把对象注册到容器中，需要借助另一个 API：BootstrapRegistryInitializer（如代码清单 6-12 所示）。

**代码清单 6-12 BootstrapRegistryInitializer 接口**

```java
public interface BootstrapRegistryInitializer {

    void initialize(BootstrapRegistry registry);
}
```

第一眼看上去，BootstrapRegistryInitializer 的设计比较类似于 ApplicationContextInitializer，其实这两个接口的设计如出一辙，核心都是获取被初始化的目标后进行一些初始化动作（如注册对象、改变配置等）。

不过 Spring Boot 本身没有 BootstrapRegistryInitializer 的实现类，这就意味着 BootstrapRegistryInitializer 仅是 Spring Boot 为开发者预留的一个新扩展点，Spring Boot 本身并没有在此基础上扩展更多的底层逻辑实现。

#### 3. 初始化的区别

对比 2.3.x 版本 SpringApplication 的构造方法，可以发现构造方法的逻辑中额外添加了一个集合成员的赋值操作，如代码清单 6-13 所示。额外添加的方法会利用 Spring Framework 的 SPI 机制，从 spring.factories 中加载所有 BootstrapRegistryInitializer 的配置实现类，并在创建对象后保存到 SpringApplication 中。至于这些 BootstrapRegistryInitializer 何时发挥作用，下面在启动 SpringApplication 阶段马上就可以看到。

**代码清单 6-13 初始化 BootstrapRegistryInitializer**

```java
private List<BootstrapRegistryInitializer> bootstrapRegistryInitializers;

public SpringApplication(ResourceLoader resourceLoader, Class<?>... primarySources) {
    // ...
    this.bootstrapRegistryInitializers = getBootstrapRegistryInitializersFromSpringFactories();
}

private List<BootstrapRegistryInitializer> getBootstrapRegistryInitializersFromSpringFactories() {
    ArrayList<BootstrapRegistryInitializer> initializers = new ArrayList<>();

    // Bootstrapper 在2.4.5版本中被废弃，在2.6.0版本中被移除
    getSpringFactoriesInstances(Bootstrapper.class).stream()
        .map((bootstrapper) -> ((BootstrapRegistryInitializer) bootstrapper::initialize))
        .forEach(initializers::add);

    // 利用 SPI 加载 BootstrapRegistryInitializer
    initializers.addAll(getSpringFactoriesInstances(BootstrapRegistryInitializer.class));

    return initializers;
}
```

## 6.2 启动 SpringApplication

在 SpringApplication 的构造方法执行完毕后，SpringApplication 对象创建就绪了，下一步会执行 SpringApplication 的 run 方法，从而真正地启动 Spring Boot 应用。整个 run 方法的过程共包含13步，其中包含了 ApplicationContext 的最核心的刷新容器环节。为了能清楚划分整个 Spring Boot 应用启动的多个环节，接下来会在 6.2 ~ 6.4 节中解析整个 run 方法的启动过程。

本节先聚焦启动 SpringApplication 的一些准备工作，这部分涉及 run 方法的3个重要环节，如代码清单 6-14 所示。

**代码清单 6-14 SpringApplication#run 片段（1）**

```java
public ConfigurableApplicationContext run(String... args) {
    // 前置准备
    StopWatch stopWatch = new StopWatch();
    stopWatch.start();
    ConfigurableApplicationContext context = null;

    // 配置与 awt 相关的信息
    configureHeadlessProperty();

    // 获取 SpringApplicationRunListeners，并调用 starting 方法（回调机制）
    SpringApplicationRunListeners listeners = getRunListeners(args);

    // 【回调】首次启动 run 方法时立即调用。可用于非常早期的初始化（准备运行时环境之前）
    listeners.starting();

    try {
        // 将 main 方法的 args 参数封装到一个对象中
        ApplicationArguments applicationArguments = new DefaultApplicationArguments(args);

        // 准备运行时环境
        ConfigurableEnvironment environment = prepareEnvironment(listeners, applicationArguments);
        // ...
        // StopWatch 对象在此处被调用 stop 方法
        stopWatch.stop();
        // ...
    }
    // catch ...
}
```

下面逐一拆解来看。

### 6.2.1 前置准备

#### 1. 计时器对象的使用

run 方法的第一个步骤会初始化一个 StopWatch 对象，这个对象看上去与计时有关。文档注释中可以获取到的关键信息如下：

> This class is normally used to verify performance during proof-of-concepts and in development, rather than as part of production applications.

这段注释的重点是：仅用于验证性能。换言之，StopWatch 是用来监控启动时间的，它本身不太重要，读者只需留意一下它的使用位置。通过观察代码可以知道，在 run 方法刚启动执行其 start 方法时开始计时，当后面的 try 块即将执行完成而执行其 stop 方法时停止计时，由此可以计算出 Spring Boot 应用启动的大体耗时。

#### 2. AWT 的设置

第二个关键动作是 configureHeadlessProperty 方法，该方法的实现如代码清单 6-15 所示。

**代码清单 6-15 设置了一个特殊的系统配置变量**

```java
private void configureHeadlessProperty() {
    System.setProperty(SYSTEM_PROPERTY_JAVA_AWT_HEADLESS,
        System.getProperty(SYSTEM_PROPERTY_JAVA_AWT_HEADLESS, Boolean.toString(this.headless)));
}
```

方法的作用是从 System 中提取了一个配置属性 SYSTEM_PROPERTY_JAVA_AWT_HEADLESS，之后又重新设置回去。

这样做目的是什么呢？需要读者在 JDK 的 System 类中观察几个方法：

**代码清单 6-16 JDK 中 System 源码节选**

```java
public static String getProperty(String key) {
    checkKey(key);
    // JMX......
    // 从 Properties 中取值
    return props.getProperty(key);
}

public static String getProperty(String key, String def) {
    checkKey(key);
    // JMX.....
    // 从 Properties 中取值，如果没有取到，返回默认值
    return props.getProperty(key, def);
}

public static String setProperty(String key, String value) {
    checkKey(key);
    // JMX ....
    return (String) props.setProperty(key, value);
}
```

通过代码清单 6-16 读者可以发现，System 类中有两个重载的 getProperty 方法，但只有一个 setProperty 方法。仔细观察源码可以发现，两个重载的 getProperty 方法有一点微妙的区别。这里要提一下 Properties 的机制：setProperty 方法中调用的是 Properties 的两参数，分别为 key 和 value。而两个重载的 getProperty 方法的唯一区别是分别调用 Properties 的一参数和两参数，这种区别类似于 Map 中的 get 和 getOrDefault。换言之，两参数的 getProperty 方法如果没有取到指定的 key 则会返回给定的默认值；一参数的 getProperty 方法调用时如果没有取到值则返回 null。

经过代码清单 6-15 的设置后，无论怎样从 System 中获取都能取到 "SYSTEM_PROPERTY_JAVA_AWT_HEADLESS" 对应的值。

SYSTEM_PROPERTY_JAVA_AWT_HEADLESS 代表什么含义呢？观察源码中该常量的值：

```java
// 显示器缺失
private static final String SYSTEM_PROPERTY_JAVA_AWT_HEADLESS = "java.awt.headless";
```

由此可知代码清单 6-15 的真正作用是：设置该配置属性后，在启动 Spring Boot 应用时即使没有检测到显示器也允许其继续启动（对于服务器而言，没有显示器也可以运行）。

#### 3. 对比 Spring Boot 2.1.X

Spring Boot 2.0 到 2.2 版本中在前置准备阶段还预留了一个异常分析器的集合：

```java
Collection<SpringBootExceptionReporter> exceptionReporters = new ArrayList<>();
```

集合泛型中的 SpringBootExceptionReporter 就是 Spring Boot 的异常分析器，它是一个用于支持 SpringApplication 启动错误报告的自定义异常报告回调接口，它本身也利用 Spring Framework 的 SPI 机制加载。不过 Spring Boot 中默认只有一个实现类：FailureAnalyzers。注意观察类名，FailureAnalyzers 是一个具有复数概念的类，而且 FailureAnalyzers 的访问修饰符不是 public 类型，这就意味着 FailureAnalyzers 是一个组合的概念，它内部会集成一组 FailureAnalyzer。借助 IDE 可以发现设计确实如此，其对应的源码如代码清单 6-17 所示。

**代码清单 6-17 FailureAnalyzers 内部利用 SPI 机制集成一组 FailureAnalyzer**

```java
final class FailureAnalyzers implements SpringBootExceptionReporter {

    private final List<FailureAnalyzer> analyzers;

    FailureAnalyzers(ConfigurableApplicationContext context, ClassLoader classLoader) {
        this.analyzers = loadFailureAnalyzers(context, this.classLoader);
    }

    private List<FailureAnalyzer> loadFailureAnalyzers(ConfigurableApplicationContext context,
            ClassLoader classLoader) {
        List<String> classNames = SpringFactoriesLoader.loadFactoryNames(FailureAnalyzer.class, classLoader);
        // ...
        return analyzers;
    }
}
```

从代码清单 6-17 中可以体会到，设计 FailureAnalyzers 的意图是希望开发者关注如何实现内部集成的 FailureAnalyzer，而不是如何访问 FailureAnalyzers 本身。Spring Boot 已经内置了不少 FailureAnalyzer 的实现类，如果有特殊需求，开发者可以自行定制 FailureAnalyzer 的实现类，并配置到项目的 spring.factories 中，Spring Boot 都可以获取并整合到 SpringApplication 中。

#### 4. 对比 Spring Boot 2.4.X

由于 Spring Boot 2.4.0 版本后引入了新的 API：BootstrapRegistry 与 BootstrapContext。在 SpringApplication 启动的前置准备中会创建 DefaultBootstrapContext，并应用所有的 BootstrapRegistryInitializer，如代码清单 6-18 所示。

**代码清单 6-18 初始化 DefaultBootstrapContext**

```java
public ConfigurableApplicationContext run(String... args) {
    StopWatch stopWatch = new StopWatch();
    stopWatch.start();

    // 此处会创建 DefaultBootstrapContext
    DefaultBootstrapContext bootstrapContext = createBootstrapContext();
    ConfigurableApplicationContext context = null;
    // ...
}

private DefaultBootstrapContext createBootstrapContext() {
    DefaultBootstrapContext bootstrapContext = new DefaultBootstrapContext();
    this.bootstrapRegistryInitializers.forEach(initializer -> {
        initializer.initialize(bootstrapContext);
    });
    return bootstrapContext;
}
```

### 6.2.2 获取 SpringApplicationRunListeners

前置准备完成后，接下来 SpringApplication 会获取一组 SpringApplicationRunListener，如代码清单 6-19 所示。

**代码清单 6-19 获取 SpringApplicationRunListeners 的逻辑**

```java
// 获取 SpringApplicationRunListeners，并调用 starting 方法（回调机制）
SpringApplicationRunListeners listeners = getRunListeners(args);
listeners.starting();

private SpringApplicationRunListeners getRunListeners(String[] args) {
    Class<?>[] types = new Class<?>[] { SpringApplication.class, String[].class };

    // 依然使用 Spring Framework 的 SPI 机制加载
    return new SpringApplicationRunListeners(logger,
        getSpringFactoriesInstances(SpringApplicationRunListener.class, types, this, args));
}
```

有关 SpringApplicationRunListeners 的设计在第4章已经了解过，本节不再重复讲解，读者可以观察一下默认加载的监听器实现。借助 Debug 运行至此，发现在默认情况下可以加载到一个类型为 EventPublishingRunListener 的监听器。

#### 1. EventPublishingRunListener 与 Spring Boot 扩展事件

从类名上理解 EventPublishingRunListener 具备事件发布能力，那么发布事件必定要配合事件广播器来实现，观察 EventPublishingRunListener 的类成员结构以及构造方法，如代码清单 6-20 所示。

**代码清单 6-20 EventPublishingRunListener 的结构**

```java
public class EventPublishingRunListener implements SpringApplicationRunListener, Ordered {

    private final SpringApplication application;
    private final String[] args;
    private final SimpleApplicationEventMulticaster initialMulticaster;

    public EventPublishingRunListener(SpringApplication application, String[] args) {
        this.application = application;
        this.args = args;

        // 注意此处初始化了一个事件广播器，并存储了所有监听器
        this.initialMulticaster = new SimpleApplicationEventMulticaster();
        for (ApplicationListener<?> listener : application.getListeners()) {
            this.initialMulticaster.addApplicationListener(listener);
        }
        this.initialMulticaster.multicastEvent(new ApplicationEnvironmentPreparedEvent(this.application,
            this.args, environment));
    }
}
```

可以发现，在 EventPublishingRunListener 构造成功之后，其内部就已经初始化了一个事件广播器，并整合了现阶段能获取到的所有 ApplicationListener。紧接着，EventPublishingRunListener 实现 SpringApplicationRunListener 的每个方法中都有一个特殊的事件被广播，如代码清单 6-21 所示。

**代码清单 6-21 EventPublishingRunListener 的事件广播实现（节选）**

```java
@Override
public void starting() {
    this.initialMulticaster.multicastEvent(new ApplicationStartingEvent(this.application, this.args));
}

@Override
public void environmentPrepared(ConfigurableEnvironment environment) {
    this.initialMulticaster.multicastEvent(new ApplicationEnvironmentPreparedEvent(this.application,
        this.args, environment));
}

@Override
public void contextPrepared(ConfigurableApplicationContext context) {
    this.initialMulticaster.multicastEvent(new ApplicationContextInitializedEvent(this.application,
        this.args, context));
}
```

这就意味着借助 SpringApplicationRunListener 的事件扩展逻辑，除了可以直接编写 SpringApplicationRunListener 的实现类，也可以编写 ApplicationListener 的实现类监听这些 Spring Boot 扩展的事件，只不过监听 Spring Boot 事件的 ApplicationListener 同样需要将其配置到 spring.factories，或者在构造 SpringApplication 时编程式注册，仅通过组件扫描等方式注册的监听器无法监听到所有 Spring Boot 事件。

#### 2. 与其他版本的对比

Spring Boot 1.x 中并没有把所有的时机都考虑到位，所以当时的 SpringApplicationRunListener 中只支持前四个事件切入，不过事件本身的设计与 Spring Boot 2.x 的相同，在第4章也提到过。

在 Spring Boot 2.4.x 中，由于引入了 BootstrapContext，这个组件会在 ApplicationContext 初始化之前起作用，而 SpringApplicationRunListener 的前两个事件触发时 BootstrapContext 处于有效状态，因此 SpringApplicationRunListener 中将前两个事件的触发入参中添加了 BootstrapContext，以便开发者在扩展事件监听逻辑时有更多的 API 可以获取，进而有机会做更多的事情，如代码清单 6-22 所示。

**代码清单 6-22 2.4.x 版本之后的 SpringApplicationRunListener 源码（节选）**

```java
default void starting(ConfigurableBootstrapContext bootstrapContext) {
    starting();
}

default void environmentPrepared(ConfigurableBootstrapContext bootstrapContext,
        ConfigurableEnvironment environment) {
    environmentPrepared(environment);
}
```

### 6.2.3 准备运行时环境

获取监听器之后，下一个重要环节是准备运行时环境，这个步骤对应第3章中讲到的 Environment 抽象，如代码清单 6-23 所示。prepareEnvironment 方法的主要步骤是先创建 Environment，再配置，最后绑定到 SpringApplication 上。下面对这3个步骤逐一解释。

**代码清单 6-23 准备运行时环境 Environment**

```java
ApplicationArguments applicationArguments = new DefaultApplicationArguments(args);
ConfigurableEnvironment environment = prepareEnvironment(listeners, applicationArguments);

private ConfigurableEnvironment prepareEnvironment(SpringApplicationRunListeners listeners,
        ApplicationArguments applicationArguments) {

    // 创建、配置运行时环境
    ConfigurableEnvironment environment = getOrCreateEnvironment();
    configureEnvironment(environment, applicationArguments.getSourceArgs());
    ConfigurationPropertySources.attach(environment);

    // 此处回调 SpringApplicationRunListener 的 environmentPrepared 方法
    // Environment 构建完成，但在创建 ApplicationContext 之前触发
    listeners.environmentPrepared(environment);

    // 环境与应用绑定
    bindToSpringApplication(environment);

    if (!this.isCustomEnvironment) {
        environment = new EnvironmentConverter(getClassLoader())
            .convertEnvironmentIfNecessary(environment, deduceEnvironmentClass());
    }

    ConfigurationPropertySources.attach(environment);

    return environment;
}
```

#### 1. 创建运行时环境

前面在了解 Environment 的时候，借助 IDEA 生成继承和派生关系时，有3个 Environment 的落地实现类，分别对应普通环境的 StandardEnvironment、支持 Servlet 环境的 StandardServletEnvironment 和支持 Reactive 环境的 StandardReactiveWebEnvironment。具体到底层创建中，刚好是根据之前推断好的 Web 类型来决定使用何种 Environment 的实现，如代码清单 6-24 所示。

**代码清单 6-24 根据应用类型创建运行时环境**

```java
private ConfigurableEnvironment getOrCreateEnvironment() {
    if (this.environment != null) {
        return this.environment;
    }

    switch (this.webApplicationType) {
        case SERVLET:
            return new StandardServletEnvironment();
        case REACTIVE:
            return new StandardReactiveWebEnvironment();
        default:
            return new StandardEnvironment();
    }
}
```

> 提示：注意，当前方法是 SpringApplication 内部的，所以可以直接提取 webApplicationType 的值。

#### 2. 配置运行时环境

创建好 Environment 对象后，接下来要向 Environment 中配置一些组件，包括 ConversionService、命令行参数、编程式配置的 profile，如代码清单 6-25 所示。configureEnvironment 方法本身难度不大，内部调用方法的实现逻辑也比较容易理解。

**代码清单 6-25 配置运行时环境**

```java
protected void configureEnvironment(ConfigurableEnvironment environment, String[] args) {
    if (this.addConversionService) {
        // 获取全局共享的 ApplicationConversionService 实例
        ConversionService conversionService = ApplicationConversionService.getSharedInstance();
        environment.setConversionService((ConfigurableConversionService) conversionService);
    }

    // 将命令行参数封装为 PropertySource
    configurePropertySources(environment, args);

    // 支持编程式添加激活的 profile
    configureProfiles(environment, args);
}
```

#### 3. Environment 与 SpringApplication 绑定

在广播 environmentPrepared 事件后，prepareEnvironment 方法会将 Environment 中配置的一些属性值绑定到 SpringApplication 中，它的实现代码只有一行，如代码清单 6-26 所示。

**代码清单 6-26 Environment 的属性值绑定至 SpringApplication 对象**

```java
protected void bindToSpringApplication(ConfigurableApplicationContext context) {
    try {
        Binder.get(environment).bind("spring.main", Bindable.ofInstance(this));
    }
    // catch ...
}
```

有关 Binder 的使用在此不深入研究，读者只需要知道一点：Binder 可以将 Environment 中的一些属性值映射到某个类的属性中（类似于在 Spring Boot 中学过的 @ConfigurationProperties 注解的作用）。从源码中可以看到它绑定的属性都是以 spring.main 开头的配置属性，而这部分属性刚好与 SpringApplication 中的部分属性一一对应，如代码清单 6-27 所示。

**代码清单 6-27 以 spring.main 开头的属性与 SpringApplication 的属性一一对应**

```properties
# application.properties
spring.main.lazy-initialization = true
```

```java
public class SpringApplication {
    // ...
    private boolean lazyInitialization = false;
    // ...
}
```

总结起来，bindToSpringApplication 方法要做的事情，就是把 application.properties 中的属性赋值到 SpringApplication 对象中。

## 6.3 IOC 容器的创建与初始化

经过 6.2 节中的几个关键步骤后，SpringApplication 的启动前置准备工作已经基本完成，接下来要初始化的是 SpringApplication 内部的核 IOC 容器，也就是 ApplicationContext 的具体实现。本节涉及 run 方法的代码片段如代码清单 6-28 所示。

**代码清单 6-28 SpringApplication#run 片段（2）**

```java
configureIgnoreBeanInfo(environment);

// 打印 Banner
Banner printedBanner = printBanner(environment);

// 创建空的 IOC 容器
context = createApplicationContext();

context.setApplicationStartup(this.applicationStartup);

// IOC 容器的初始化
prepareContext(bootstrapContext, context, environment, listeners, applicationArguments,
        printedBanner);

// 刷新容器
refreshContext(context);
```

### 6.3.1 打印 Banner

在深入 printBanner 方法之前，需要读者先明确 Banner 到底是什么。

> 提示：如果读者认为 Banner 只是打印到控制台/日志的那段内容，不妨继续往下阅读。当然如果读者已经足够了解 Banner 的设计，那可以跳过本节。

#### 1. Banner 的设计

在 Spring Boot 的内部，Banner 被设计为一个接口，并且内置了一个枚举类型，代表 Banner 输出的模式（关闭、控制台打印、日志输出），如代码清单 6-29 所示。

**代码清单 6-29 Banner 是一个接口**

```java
public interface Banner {

    void printBanner(Environment environment, Class<?> sourceClass, PrintStream out);

    enum Mode {
        OFF,
        CONSOLE,
        LOG
    }
}
```

借助 IDE 可以发现 Banner 的几个实现类。其中读者第一眼关注的肯定是 SpringBootBanner，其对应的源码如代码清单 6-30 所示。

**代码清单 6-30 SpringBootBanner 的设计**

```java
class SpringBootBanner implements Banner {

    private static final String[] BANNER = { "", "  __  __",
        "  __  __",
        // ...
    };

    private static final String SPRING_BOOT = " :: Spring Boot :: ";
    private static final int STRAP_LINE_SIZE = 42;

    @Override
    public void printBanner(Environment environment, Class<?> sourceClass,
            PrintStream printStream) {
        // 先打印 Banner 的内容
        for (String line : BANNER) {
            printStream.println(line);
        }

        // 打印 Spring Boot 的版本
        String version = SpringBootVersion.getVersion();
        version = (version != null) ? " (v" + version + ")" : "";
        StringBuilder padding = new StringBuilder();
        while (padding.length() < STRAP_LINE_SIZE - (version.length() + SPRING_BOOT.length())) {
            padding.append(" ");
        }
        printStream.println(AnsiOutput.toString(AnsiColor.GREEN, SPRING_BOOT,
            AnsiColor.DEFAULT, padding.toString(), AnsiStyle.FAINT, version));
        printStream.println();
    }
}
```

从代码清单 6-30 中可以发现一些常量，而常量名是 BANNER，不难猜测出它就是在默认情况下打印在控制台的文字 Banner。对应实现的 printBanner 方法，就是用输出对象打印定义好的 Banner 和 Spring Boot 的版本号，逻辑上不难理解。

#### 2. printBanner

下面来看 printBanner 的具体实现逻辑。默认情况下 Banner 的输出模式是打印到控制台，后续它会获取一个 ResourceLoader，配合 SpringApplicationBannerPrinter 实现 Banner 的输出，如代码清单 6-31 所示。

**代码清单 6-31 打印 Banner 的底层逻辑**

```java
private Banner.Mode bannerMode = Banner.Mode.CONSOLE;

private Banner printBanner(ConfigurableEnvironment environment) {
    if (this.bannerMode == Banner.Mode.OFF) {
        return null;
    }

    // Banner 文件资源加载
    ResourceLoader resourceLoader = (this.resourceLoader != null)
        ? this.resourceLoader
        : new DefaultResourceLoader(getClassLoader());

    // 使用 BannerPrinter 打印 Banner
    SpringApplicationBannerPrinter bannerPrinter = new SpringApplicationBannerPrinter(
        resourceLoader, this.banner);

    if (this.bannerMode == Mode.LOG) {
        return bannerPrinter.print(environment, this.mainApplicationClass, logger);
    }
    return bannerPrinter.print(environment, this.mainApplicationClass, System.out);
}
```

这里涉及的两个 API，读者可以简单了解：

**ResourceLoader**

由类名不难理解，ResourceLoader 是一个资源加载器，这个组件其实在第3章中遇到过。ApplicationContext 本身实现了 ResourcePatternResolver 接口，而 ResourcePatternResolver 的父接口就是 ResourceLoader，所以 ApplicationContext 具备资源加载的能力。

默认情况下 SpringApplication 并没有预先设置的 ResourceLoader，所以最终它使用的是默认实现 DefaultResourceLoader，而默认实现中可以处理类路径、项目路径以及特定路径（如以 file: 为前缀）下的资源。

**SpringApplicationBannerPrinter**

ResourceLoader 的利用要配合 SpringApplicationBannerPrinter 才能达到效果，SpringApplicationBannerPrinter 打印 Banner 的逻辑本身不复杂，它会先获取到 Banner，再调用其 printBanner 方法，最后附加一层封装代表 Banner 已经打印过。

代码清单 6-32 中展示了一个完整的 Banner 打印逻辑调用，因为 Spring Boot 本身支持自定义的图片 Banner 和文本 Banner 两种方式，只要两者有其一，即可打印自定义的 Banner。

**代码清单 6-32 打印 Banner 的流程逻辑**

```java
Banner print(Environment environment, Class<?> sourceClass, PrintStream out) {
    Banner banner = getBanner(environment);
    banner.printBanner(environment, sourceClass, out);
    return new PrintedBanner(banner, sourceClass);
}

private Banner getBanner(Environment environment) {
    Banners banners = new Banners();
    banners.addIfNotNull(getImageBanner(environment));
    banners.addIfNotNull(getTextBanner(environment));

    if (banners.hasAtLeastOneBanner()) {
        return banners;
    }

    if (this.fallbackBanner != null) {
        return this.fallbackBanner;
    }

    return DEFAULT_BANNER;
}

static final String BANNER_LOCATION_PROPERTY = "spring.banner.location";
static final String DEFAULT_BANNER_LOCATION = "banner.txt";

private Banner getTextBanner(Environment environment) {
    String location = environment.getProperty(BANNER_LOCATION_PROPERTY,
            DEFAULT_BANNER_LOCATION);
    Resource resource = this.resourceLoader.getResource(location);
    if (resource.exists()) {
        return new ResourceBanner(resource);
    }
    return null;
}
```

### 6.3.2 创建 IOC 容器

Banner 打印完毕后，下一步到了创建 ApplicationContext 的环节。第3章中读者已经了解过 ApplicationContext 在 Spring Boot 中的特殊扩展，在该环节也是根据 Web 类型区分创建不同的 ApplicationContext 落地实现类对象。创建的逻辑非常简单，如代码清单 6-33 所示。

**代码清单 6-33 创建 IOC 容器的逻辑**

```java
public static final String DEFAULT_CONTEXT_CLASS =
    "org.springframework.context.annotation.AnnotationConfigApplicationContext";

public static final String DEFAULT_SERVLET_WEB_CONTEXT_CLASS =
    "org.springframework.boot.web.servlet.context.AnnotationConfigServletWebServerApplicationContext";

public static final String DEFAULT_REACTIVE_WEB_CONTEXT_CLASS =
    "org.springframework.boot.web.reactive.context.AnnotationConfigReactiveWebServerApplicationContext";

protected ConfigurableApplicationContext createApplicationContext() {
    // 先检查有没有显式指定 ApplicationContext 的实现类型
    Class<?> contextClass = this.applicationContextClass;

    if (contextClass == null) {
        try {
            // 根据 web 应用类型决定实例化哪个 IOC 容器
            switch (this.webApplicationType) {
                case SERVLET:
                    contextClass = Class.forName(DEFAULT_SERVLET_WEB_CONTEXT_CLASS);
                    break;
                case REACTIVE:
                    contextClass = Class.forName(DEFAULT_REACTIVE_WEB_CONTEXT_CLASS);
                    break;
                default:
                    contextClass = Class.forName(DEFAULT_CONTEXT_CLASS);
            }
        }
        // catch throw ex...
    }

    return (ConfigurableApplicationContext) BeanUtils.instantiateClass(contextClass);
}
```

注意观察源码中的一个细节，创建的 ApplicationContext 类型均为注解驱动类型，而注解驱动类型的 ApplicationContext 在父类 GenericApplicationContext 的构造方法中，BeanFactory 已经被创建出来了。

```java
public GenericApplicationContext() {
    this.beanFactory = new DefaultListableBeanFactory();
}
```

多说一句，该部分代码在 Spring Boot 2.4.0 后被抽取出了一个全新的 API：ApplicationContextFactory，它的实现更为简洁，但本质逻辑完全一致，如代码清单 6-34 所示。

**代码清单 6-34 Spring Boot 2.4.0 后的优化**

```java
protected ConfigurableApplicationContext createApplicationContext() {
    return this.applicationContextFactory.create(this.webApplicationType);
}

@FunctionalInterface
interface ApplicationContextFactory {

    ConfigurableApplicationContext create(WebApplicationType webApplicationType);

    ApplicationContextFactory DEFAULT = (webApplicationType) -> {
        try {
            switch (webApplicationType) {
                case SERVLET:
                    return new AnnotationConfigServletWebServerApplicationContext();
                case REACTIVE:
                    return new AnnotationConfigReactiveWebServerApplicationContext();
                default:
                    return new AnnotationConfigApplicationContext();
            }
        }
        // catch throw ex...
    };
}
```

### 6.3.3 初始化 IOC 容器

一个空的 IOC 容器创建完毕后，接下来是对容器进行必要的初始化处理，如代码清单 6-35 所示。prepareContext 方法的源码逻辑较多，下面有针对性地研究其中的关键逻辑部分。

**代码清单 6-35 初始化 IOC 容器的核心逻辑**

```java
private void prepareContext(ConfigurableApplicationContext context,
        ConfigurableEnvironment environment,
        SpringApplicationRunListeners listeners,
        ApplicationArguments applicationArguments, Banner printedBanner) {

    context.setEnvironment(environment);

    // IOC 容器的后置处理
    postProcessApplicationContext(context);

    // 应用 ApplicationContextInitializer
    applyInitializers(context);

    // 此处回调 SpringApplicationRunListeners 的 contextPrepared 方法
    // 在创建和准备 ApplicationContext 之后，但在加载之前触发
    listeners.contextPrepared(context);

    if (this.logStartupInfo) {
        // 打印当前应用激活的 profiles 信息
        logStartupInfo(context.getParent() == null);
        logStartupProfileInfo(context);
    }

    ConfigurableListableBeanFactory beanFactory = context.getBeanFactory();

    // 将打印过的 Banner 以及 main 方法传入的启动参数封装组件，注册到 IOC 容器中
    beanFactory.registerSingleton("springApplicationArguments", applicationArguments);
    if (printedBanner != null) {
        beanFactory.registerSingleton("springBootBanner", printedBanner);
    }

    if (beanFactory instanceof DefaultListableBeanFactory) {
        ((DefaultListableBeanFactory) beanFactory)
            .setAllowBeanDefinitionOverriding(this.allowBeanDefinitionOverriding);
    }

    if (this.lazyInitialization) {
        context.addBeanFactoryPostProcessor(new LazyInitializationBeanFactoryPostProcessor());
    }

    // 获取配置源（主启动类）
    Set<Object> sources = getAllSources();
    Assert.notEmpty(sources, "Sources must not be empty");

    // 加载配置源
    load(context, sources.toArray(new Object[0]));

    // 此处回调 SpringApplicationRunListeners 的 contextLoaded 方法
    // ApplicationContext 已加载但在刷新之前触发
    listeners.contextLoaded(context);
}
```

整体概括一下 prepareContext 方法的逻辑：首先 prepareContext 方法会利用预先准备好的一些组件先初始化 IOC 容器本身，之后再处理内部 BeanFactory 的一些逻辑，最后加载配置源，其间也穿插着一些事件广播的动作。下面拆解其中的几个核心步骤讲解。

#### 1. IOC 容器的后置处理

对 ApplicationContext 的后置处理，其实就是在底层注册和设置一些组件，包括 Bean 的名称生成器、资源加载器、类加载器和类型转换器，如代码清单 6-36 所示。默认情况下，此处 beanNameGenerator 与 resourceLoader 都为 null，只有 addConversionService 属性为 true，对应的逻辑是设置类型转换器。除此之外的逻辑均不会触发。

**代码清单 6-36 IOC 容器的后置处理**

```java
public static final String CONFIGURATION_BEAN_NAME_GENERATOR =
    "org.springframework.context.annotation.internalConfigurationBeanNameGenerator";

protected void postProcessApplicationContext(ConfigurableApplicationContext context) {
    // 注册 Bean 的名称生成器
    if (this.beanNameGenerator != null) {
        context.getBeanFactory().registerSingleton(
            AnnotationConfigUtils.CONFIGURATION_BEAN_NAME_GENERATOR,
            this.beanNameGenerator);
    }

    // 设置资源加载器和类加载器
    if (this.resourceLoader != null) {
        if (context instanceof GenericApplicationContext) {
            ((GenericApplicationContext) context).setResourceLoader(this.resourceLoader);
        }
        if (context instanceof DefaultResourceLoader) {
            ((DefaultResourceLoader) context).setClassLoader(this.resourceLoader.getClassLoader());
        }
    }

    // 设置类型转换器
    if (this.addConversionService) {
        context.getBeanFactory().setConversionService(
            ApplicationConversionService.getSharedInstance());
    }
}
```

#### 2. 应用 ApplicationContextInitializer

在 6.1.2 节中准备好的 ApplicationContextInitializer 在此处终于得到了应用，applyInitializers 方法会调用它的 initialize 方法，对 ApplicationContext 进行初始化操作，如代码清单 6-37 所示。

**代码清单 6-37 应用所有的 ApplicationContextInitializer**

```java
protected void applyInitializers(ConfigurableApplicationContext context) {
    for (ApplicationContextInitializer initializer : getInitializers()) {
        Class<?> requiredType = GenericTypeResolver.resolveTypeArgument(
            initializer.getClass(), ApplicationContextInitializer.class);
        Assert.isInstanceOf(requiredType, context, "Unable to call initializer.");
        initializer.initialize(context);
    }
}
```

#### 3. 获取配置源（主启动类）

前面提到，Spring Boot 2.x 引入了主配置类的概念。SpringApplication 中存储的配置源分为两部分，正常情况下使用最常用的 SpringApplication.run 方法传入的主启动类放在 primarySources 集合中，通过 XML 或者包扫描的方式传入的配置源一般不用，所以 getAllSources 方法最终返回的就是主启动类对应的 Class 类型，如代码清单 6-38 所示。

**代码清单 6-38 获取所有的配置源**

```java
public Set<Object> getAllSources() {
    Set<Object> allSources = new LinkedHashSet<>();
    if (!CollectionUtils.isEmpty(this.primarySources)) {
        allSources.addAll(this.primarySources);
    }
    if (!CollectionUtils.isEmpty(this.sources)) {
        allSources.addAll(this.sources);
    }
    return Collections.unmodifiableSet(allSources);
}
```

#### 4. 加载配置源

获取配置源之后，下一步要先将这些配置源进行加载和解析。对应的 load 方法实现比较复杂，为保证读者能对整体流程有一个把握，代码清单 6-39 中只展示了最值得关注的部分。

**代码清单 6-39 加载配置源的核心方法（节选）**

```java
protected void load(ApplicationContext context, Object[] sources) {
    BeanDefinitionLoader loader = createBeanDefinitionLoader(
        getBeanDefinitionRegistry(context), sources);
    // ...
    loader.load();
}
```

对于抽取核心逻辑后的 load 方法，不难看出其加载配置源的核心动作只有两步：创建一个用于解析配置源的 BeanDefinitionReader，然后加载和解析配置源。其中 createBeanDefinitionLoader 方法的底层会调用 BeanDefinitionLoader 的构造方法，返回一个 BeanDefinition 的加载器。这个 BeanDefinitionLoader 的类结构比较值得关注，如代码清单 6-40 所示。

**代码清单 6-40 BeanDefinitionLoader 的内部核心成员**

```java
class BeanDefinitionLoader {

    private final Object[] sources;
    private final AnnotatedBeanDefinitionReader annotatedReader;
    private final XmlBeanDefinitionReader xmlReader;
    private final ClassPathBeanDefinitionScanner scanner;
    private BeanDefinitionReader groovyReader;
    private ResourceLoader resourceLoader;
    // ...
}
```

由 BeanDefinitionLoader 的成员属性可以得知，BeanDefinitionLoader 内部组合了几个与 BeanDefinition 相关的核心组件，包括 AnnotatedBeanDefinitionReader（注解驱动的 BeanDefinition 解析器）、XmlBeanDefinitionReader（XML 定义的 BeanDefinition 解析器）、ClassPathBeanDefinitionScanner（类路径下的 BeanDefinition 包扫描器）。这种设计明显是外观模式的体现，即利用一个 BeanDefinitionLoader 充当统一入口，针对传入的配置源选择最合适的底层组件来进行实际处理。

具体从 BeanDefinitionLoader 的实现中可以看到，核心的 load 方法会不断测试传入的配置源类型，从而将配置源分配给合适的组件去处理。代码清单 6-41 中已经列出了不同的配置源对应的组件。

**代码清单 6-41 load 方法分发不同类型的配置源给合适的组件处理**

```java
private int load(Object source) {
    Assert.notNull(source, "Source must not be null");

    // AnnotatedBeanDefinitionReader
    if (source instanceof Class<?>) {
        return load((Class<?>) source);
    }

    // XmlBeanDefinitionReader
    if (source instanceof Resource) {
        return load((Resource) source);
    }

    // ClassPathBeanDefinitionScanner
    if (source instanceof Package) {
        return load((Package) source);
    }

    // ClassPathBeanDefinitionScanner
    if (source instanceof CharSequence) {
        return load((CharSequence) source);
    }

    throw new IllegalArgumentException("Invalid source type " + source.getClass());
}
```

### 6.3.4 刷新 IOC 容器

初始化 ApplicationContext 后，下面到了整个启动环节中最困难、最复杂的一步：IOC 容器的刷新，如代码清单 6-42 所示。由于该部分过于复杂，本书单独将其放到第7章详细讲解。

**代码清单 6-42 刷新 IOC 容器的最终是调用 ApplicationContext 的 refresh 方法**

```java
private void refreshContext(ConfigurableApplicationContext context) {
    // 注册关闭时回调的钩子.....
    refresh((ApplicationContext) context);
}

protected void refresh(ApplicationContext applicationContext) {
    ((AbstractApplicationContext) applicationContext).refresh();
}
```

### 6.3.5 Spring Boot 2.4.x 的新特性

Spring Boot 版本升级到 2.4.x 后，底层的 Spring Framework 也升级到了 5.3.x，这里引入了一些新的特性，读者可以简单了解。

#### 1. ApplicationStartup

在创建好 IOC 容器（createApplicationContext）之后初始化（prepareContext）之前，有这样一行代码：

```java
context.setApplicationStartup(this.applicationStartup); // ApplicationStartup.DEFAULT
```

这个 ApplicationStartup 是什么？引入它可以解决什么问题呢？

**性能分析**

在 Spring Boot 2.4（即 Spring Framework 5.3）之前，如果项目的启动速度很慢，是很难确定启动慢的根本原因的。Spring Framework 开发团队考虑到性能分析和优化的需求，于是在 Spring Framework 5.3 中引入了一个性能指标统计工具，也就是这个启动度量 ApplicationStartup，该指标可以准确地定位到应用启动的哪个环节耗时长，对分析慢启动问题非常有帮助。

**ApplicationStartup 的使用**

Spring Boot 考虑到 ApplicationStartup 在程序启动时的性能折损，默认情况下不会启用该性能分析器。如果需要启用则需要手动在主启动类中声明，如代码清单 6-43 所示。

**代码清单 6-43 使用 ApplicationStartup 的方式**

```java
public class SpringBootQuickstartApplication {

    public static void main(String[] args) {
        new SpringApplicationBuilder(SpringBootQuickstartApplication.class)
            .applicationStartup(new BufferingApplicationStartup(10000))
            .run(args);
    }
}
```

如此设置之后，还需要引入 Spring Boot 的监控依赖：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

最后在 application.properties 中配置暴露的监控端点，即可开启启动度量的信息获取接口：

```properties
management.endpoints.web.exposure.include=startup
```

准备工作完成后，即可启动 Spring Boot 应用。使用 Postman 等 HTTP 客户端工具，以 POST 方式访问 /actuator/startup 接口，即可获得有关启动阶段的所有环节的耗时。

请求访问 /actuator/startup 接口，可以获得有关启动阶段的所有环节的耗时。下面是一次实际运行生成的几段 JSON：

```json
// 配置类解析阶段，共耗费 0.656s，解析104个类
{
    "endTime": "2021-12-23T12:45:18.902Z",
    "duration": "P0.656S",
    "startTime": "2021-12-23T12:45:18.246Z",
    "startupStep": {
        "name": "spring.context.config-classes.parse",
        "id": 9,
        "tags": [
            {
                "key": "classCount",
                "value": "104"
            }
        ],
        "parentId": 8
    }
}

// HelloController 的创建，耗费 0.001s
{
    "endTime": "2021-12-23T12:45:19.428Z",
    "duration": "P0.001S",
    "startTime": "2021-12-23T12:45:19.427Z",
    "startupStep": {
        "name": "spring.beans.instantiate",
        "id": 98,
        "tags": [
            {
                "key": "beanName",
                "value": "helloController"
            }
        ],
        "parentId": 4
    }
}

// 整个 Bean 的后置处理阶段，共耗时 0.823s
{
    "endTime": "2021-12-23T12:45:19.014Z",
    "duration": "P0.823S",
    "startTime": "2021-12-23T12:45:18.191Z",
    "startupStep": {
        "name": "spring.context.beans.post-process",
        "id": 5,
        "parentId": 4
    }
}
```

通过这些指标就可以精准地定位到哪些环节耗时较长，从而采取合适的针对性手段优化应用。

#### 2. BootstrapRegistry 的关闭

读者已经了解到 BootstrapRegistry 与 BootstrapContext 是 Spring Boot 2.4.x 新引入的 API，之前的部分只介绍了初始化和应用逻辑的调用，那么关闭又在何时触发？

答案是在 ApplicationContext 的预初始化阶段。当 ApplicationContextInitializer 被应用并且 contextPrepared 事件触发（即 ApplicationContextInitializedEvent 事件广播）后，BootstrapRegistry 关闭，如代码清单 6-44 所示。

**代码清单 6-44 BootstrapContext 的关闭时机**

```java
private void prepareContext(DefaultBootstrapContext bootstrapContext,
        ConfigurableApplicationContext context,
        ConfigurableEnvironment environment,
        SpringApplicationRunListeners listeners,
        ApplicationArguments applicationArguments, Banner printedBanner) {

    context.setEnvironment(environment);
    postProcessApplicationContext(context);
    applyInitializers(context);

    // 此处回调运行器
    listeners.contextPrepared(context);

    // 此处关闭
    bootstrapContext.close(context);
    // ...
}
```

## 6.4 IOC 容器刷新后的回调

IOC 容器刷新完毕后仅剩余一些收尾工作，这部分的内容不多，对应 SpringApplication 的 run 方法中的源码如代码清单 6-45 所示。

**代码清单 6-45 SpringApplication#run 片段（3）**

```java
// ...
afterRefresh(context, applicationArguments);
stopWatch.stop();

// 打印启动耗时的日志
if (this.logStartupInfo) {
    new StartupInfoLogger(this.mainApplicationClass)
        .logStarted(getApplicationLog(), stopWatch);
}

// 此处回调 SpringApplicationRunListeners 的 started 方法
// IOC 容器已刷新但未调用 CommandLineRunners 和 ApplicationRunners 时触发
listeners.started(context);

// 回调所有的运行器
callRunners(context, applicationArguments);
// ...
// 此处回调 SpringApplicationRunListeners 的 running 方法
// 在 run 方法彻底完成之前触发
listeners.running(context);
```

可以看到 SpringApplicationRunListener 的所有方法均被调用（包括捕获异常后广播 failed 事件也在内）。除此之外，唯一值得关注的是 try-catch 块中的最后一行 callRunners 方法。

运行器是 Spring Boot 设计的用于应用完全启动后给开发者予以回调的两个扩展接口。观察 callRunners 方法的实现，可以发现这部分是以"妥协"的方式实现的，由于有两个接口，代码清单 6-46 展示了分别回调 ApplicationRunner 和 CommandLineRunner 的方式。

**代码清单 6-46 分别回调 ApplicationRunner 和 CommandLineRunner**

```java
// 从容器中获取所有的 ApplicationRunner 和 CommandLineRunner
private void callRunners(ApplicationContext context, ApplicationArguments args) {
    List<Object> runners = new ArrayList<>();
    runners.addAll(context.getBeansOfType(ApplicationRunner.class).values());
    runners.addAll(context.getBeansOfType(CommandLineRunner.class).values());

    AnnotationAwareOrderComparator.sort(runners);

    // 依次回调
    for (Object runner : new LinkedHashSet<>(runners)) {
        if (runner instanceof ApplicationRunner) {
            callRunner((ApplicationRunner) runner, args);
        }
        if (runner instanceof CommandLineRunner) {
            callRunner((CommandLineRunner) runner, args);
        }
    }
}

private void callRunner(ApplicationRunner runner, ApplicationArguments args) {
    try {
        runner.run(args);
    }
    // catch ...
}

private void callRunner(CommandLineRunner runner, ApplicationArguments args) {
    try {
        runner.run(args.getSourceArgs());
    }
    // catch ...
}
```

这里多解释一句，如果翻看这两个接口组件的文档注释中的 since，会发现一个没有标注，另一个是 Spring Boot 1.3.0，说明它们都来自 Spring Boot 1.x。它们本来是用于在特定的时机（应用完全启动后）执行一些操作，奈何 Spring Boot 2.x 后扩展了事件，可以通过监听 ApplicationStartedEvent 来实现与这两个组件一样的效果。换句话说，这两个组件已经被隐式"替代"，读者不必过多深究，平时在开发中还可以正常使用。

至此，一个完整的 Spring Boot 应用的启动流程完全结束，Spring Boot 应用启动成功。

## 6.5 小结

本章从 Spring Boot 主启动类的 main 方法开始，逐步剖析、拆解 Spring Boot 的启动全流程，并针对不同的 Spring Boot 版本对比了解不同时期的不同设计。Spring Boot 的核心还是依赖 Spring Framework 的 IOC 容器，即 ApplicationContext，而 ApplicationContext 的真正初始化是它的 refresh 刷新动作。第7章会针对 ApplicationContext 的核心 refresh 方法，全面剖析整个容器刷新的工作机制。
