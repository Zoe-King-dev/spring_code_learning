# 第13章 Spring Boot 整合 WebFlux

本章内容将带你了解响应式编程的概念，以及 Spring Boot 如何整合 WebFlux 实现异步非阻塞的 Web 开发。我们会从响应式编程的基础概念讲起，逐步深入到 WebFlux 的自动配置和核心组件的工作原理。

## 13.1 快速了解响应式编程与 Reactor

### 13.1.1 从一个例子理解响应式编程

在正式开始学习之前，先通过一个生活中的例子理解响应式编程的核心思想。

假设你在一个知名手机生产大厂工作，你的职位是生产流水线上的一名普通工人。你的工作吞吐量有限，每次只能处理一定数量的半成品。与此同时，负责你上游工作的同事似乎并不清楚你负责环节的生产现状，而且由于上司的激励政策，上游同事的生产效率非常高，导致你的待加工区积压了非常多半成品。但由于你负责的工序耗时长，积压的半成品过多无法及时处理，于是你不得不向上游同事反馈：你们做慢点，我的工作吞吐量有限。上游同事了解你的现状后改变了半成品处理策略，他们将处理好的半成品不直接传递给你，而是暂时由上游同事保管，等你向他们反馈积压的半成品处理完毕后，再继续传递新的半成品。

一段时间之后，领导发现你的业绩非常好，于是你升职加薪，以经销商的身份销售该款手机。手机一上市就得到广大消费者的关注，你的店铺生意非常好。

正当你的生意做得风生水起时，这批手机在售卖后的一段时间后传出硬件问题，市面销量急剧下降，作为经销商，你自然也不想再销售该款手机，于是你向厂商反映：请不要再提供该款手机。厂商也非常无奈，手机还在正常生产，但经销商都不再提货，于是只好将这部分成品废弃。

从这个例子中可以总结出两个重要的策略：
- **背压的第一个策略**：数据提供方将数据暂存，不传递给下游消费者
- **背压的第二个策略**：数据提供方将数据丢弃

简单总结，背压是下游消费者"倒逼"上游数据生产者的数据提供速率，以避免被海量数据压垮，达到两者之间的动态平衡。

### 13.1.2 响应式流与背压

响应式流有别于 Java 8 中的 Stream。普通的 Stream 是同步阻塞的，在高并发场景下不能有效缓解压力大的问题，而响应式流可以做到异步非阻塞。另外，Stream 的一个关键特性是，一旦有了消费型方法，它就会将这个流中的所有方法处理完毕，如果这期间的数据量很大，Stream 就无法对海量数据进行妥善处理。

下面通过几个简单的示例体会响应式编程的具体落地使用。市面上流行的响应式编程框架包括 Reactor 与 ReactiveX（RxJava）。由于 WebFlux 底层使用 Reactor 提供响应式支撑，因此本书选择使用 Reactor 进行演示。

在具体的项目搭建中，无须导入特定版本的 Reactor 框架，而是直接导入 spring-boot-starter-webflux 依赖即可，根据 Maven 的依赖传递原则，Reactor 框架会一并导入。

### 13.1.3 快速体会 Reactor 框架

#### 1. 最简单的发布-订阅

下面先编写一个最简单的发布-订阅实现，如代码清单 13-2 所示。

```java
// 代码清单 13-2 基于响应式的最简单发布-订阅模型
public class QuickDemo {
    public static void main(String[] args) {
        Flux<Integer> flux = Flux.just(1, 2, 3);
        flux.subscribe(System.out::println);
    }
}
```

示例代码非常简单，发布-订阅模型需要一个数据的生产者，即 Publisher，这里为了编码方便，代码清单 13-2 中选用了 Reactor 中的实现类 Flux 作为数据生产者，数据接收者的类型是 Java 8 中的 Consumer，所以此处可以传入 Lambda 表达式或者方法引用。在这段代码中，生产者与接收者通过 subscribe 方法建立订阅关系（消费关系），一旦触发 subscribe 方法，接收者就可以接收生产者提供的数据并进行处理，直到生产者的数据全部处理完成或者出现异常终止。

#### 2. 响应式的核心规范组件

上述的发布-订阅模型中涉及响应式编程的 4 个核心规范组件，逐一来看看。

**（1）Publisher**

Publisher 作为数据生产者，它只有一个方法 subscribe，该方法会接收一个 Subscriber，构成"订阅"关系，如代码清单 13-3 所示。

```java
// 代码清单 13-3 Publisher 接口的方法
public void subscribe(Subscriber<? super T> s);
```

请注意，subscribe 方法是一个类似于"工厂"的方法，它可以被多次调用，但是每次调用时都会创建一个新的订阅关系，且一个订阅关系只能关联一个接收者（即下面的 Subscriber）。

**（2）Subscriber**

Subscriber 作为数据接收者，它的接口方法有 4 个，如代码清单 13-4 所示。

```java
// 代码清单 13-4 Subscriber 接口的方法
public void onSubscribe(Subscription s);
public void onNext(T t);
public void onError(Throwable t);
public void onComplete();
```

请注意，Subscriber 接口的方法都以 on 作为前缀，代表它属于事件形式（可以联想 JavaScript 中的 onclick 方法等），以此理解 Subscriber 接口的 4 个方法：

- `onSubscribe`：当触发订阅时触发
- `onNext`：当接收到下一个数据时触发
- `onComplete`：当生产者的数据都处理完成时触发
- `onError`：当出现异常时触发

**（3）Subscription**

Subscription 可以看作一个订阅"关系"，它归属于一个生产者和一个接收者（可以理解为关系型数据库的多对多中间表的一条数据）。Subscription 接口中有两个方法，如代码清单 13-5 所示。

```java
// 代码清单 13-5 Subscription 接口的方法
public void request(long n);
public void cancel();
```

request 方法的作用是主动请求/拉取数据，cancel 方法的作用是放弃/停止拉取数据，它完成了数据接收者与生产者的交互，背压也是基于 Subscription 接口来实现的。

**（4）Processor**

Processor 从类名上可以翻译为处理器，这些处理器的特点是有输入，有输出，对应到 Reactor 的概念中则是生产者和接收者的合体，如代码清单 13-6 所示。

```java
// 代码清单 13-6 Processor 接口
public interface Processor<T, R> extends Subscriber<T>, Publisher<R> {}
```

从代码清单 13-6 中可以发现，Processor 直接继承了 Publisher 接口和 Subscriber 接口，它一般用于数据的中间环节处理（如数据转换 map、数据过滤 filter 等）。

#### 3. Reactor 中的常用组件

上述 4 个响应式的核心规范组件对应到响应式编程的具体实现框架中，它们的实现类也需要简单了解。

**（1）Flux**

Flux 可以简单理解为"非阻塞的 Stream"，它实现了 Publisher 接口，它的内部定义了很多 subscribe 方法。

请注意，Flux 在实现 Publisher 原生的 subscribe 方法时，还扩展了几个方法，目的是简化操作，如代码清单 13-2 的简单示例中就使用了其中一个重载的方法，只传入一个 Consumer 的实现对象（该方法只处理正常情况下的数据接收）。

另外需要读者了解的是，Flux 本身拥有非常多 Java 8 中 Stream 的操作，代码清单 13-7 中是一个简单示例。

```java
// 代码清单 13-7 操作 Flux 的示例代码
public class FluxDemo {
    public static void main(String[] args) throws Exception {
        Flux<Integer> flux = Flux.just(1, 2, 3);
        flux.map(num -> num * 5)              // 将所有数据扩大5倍
            .filter(num -> num > 10)           // 只过滤出数值中超过10的数
            .map(String::valueOf)              // 将数据转换为 String 类型
            .publishOn(Schedulers.elastic())   // 使用弹性线程池来处理数据
            .subscribe(System.out::println);   // 消费数据
    }
}
```

**（2）Mono**

Mono 可以简单理解为"非阻塞的 Optional"，它也实现了 Publisher 接口，具备生产数据的能力。Mono 在特征上与 Java 8 中的 Optional 类似，都是内部包含至多一个对象实例。

```java
public abstract class Mono<T> implements Publisher<T> { ... }
```

**（3）Scheduler**

Scheduler 可以简单理解为"线程池"，响应式线程池有以下几种类型：

- `immediate`：与主线程一致
- `single`：只有一个线程的线程池（可类比 `Executors.newSingleThreadExecutor()`）
- `parallel`：并行线程池，线程池中的线程数量等于 CPU 的数量（JDK 中的 Runtime 类可以调用 `availableProcessors` 方法来获取 CPU 数量）
- `elastic`：弹性线程池，线程池中的线程数量原则上没有上限（最大容量为 `Integer.MAX_VALUE`）

线程池需要由 Schedulers 工具类产生（注意 Scheduler 不是 public 类型，只能由工具类产生）。

## 13.2 快速使用 WebFlux

通过 13.1 节的内容，想必读者已经对响应式编程和 Reactor 框架有了一个初步的了解。本节内容会搭建一个 Spring Boot 整合 WebFlux 的项目，以代替 WebMvc 进行实际的 Web 开发。

由于 WebFlux 是与 WebMvc 地位等同的框架，Spring Framework 的作者为了避免开发者因 WebFlux 的使用门槛过高而放弃，在 WebFlux 的使用过程中允许完全采用 WebMvc 的开发风格，使用 `@Controller` + `@RequestMapping` 注解组合即可实现基于 WebFlux 的前端控制与响应。

为了让读者也能循序渐进地了解 WebFlux，本节内容会先从读者熟悉的 WebMvc 编码风格讲起。

### 13.2.1 WebMvc 的开发风格

首先创建新的项目。注意，此处导入的依赖不再是 Web，而是 WebFlux，如代码清单 13-8 所示。

```xml
<!-- 代码清单 13-8 导入 WebFlux 的依赖 -->
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-webflux</artifactId>
    </dependency>
</dependencies>
```

当导入完成后，编写主启动类 `SpringBootWebFluxApplication` 并启动应用，如代码清单 13-9 所示。注意观察控制台的输出，可以发现应用启动的嵌入式 Web 容器不再是 Tomcat，而是 Netty（本书在讲解有关嵌入式容器时没有刻意指 Servlet 容器，而是统称为 Web 容器，因为 Netty 不属于 Servlet 容器）。

```java
// 代码清单 13-9 WebFlux 的启动类
@SpringBootApplication
public class SpringBootWebFluxApplication {
    public static void main(String[] args) {
        SpringApplication.run(SpringBootWebFluxApplication.class, args);
    }
}

@RestController
@RequestMapping
public class WebMvcStyleController {

    @GetMapping("/hello")
    public String hello() {
        return "Hello WebFlux";
    }

    @GetMapping("/list")
    public List<Integer> list() {
        return Arrays.asList(1, 2, 3);
    }
}
```

启动应用后，控制台输出类似如下：

```
[main] c.l.s.SpringBootWebFluxApplication : Netty started on port(s): 8080
[main] c.l.s.SpringBootWebFluxApplication : Started SpringBootWebFluxApplication in 2.306 seconds
```

接下来的内容与之前的 WebMvc 完全一致，编写一个 `WebMvcStyleController`，并声明两个方法。

```java
// 代码清单 13-10 基于 WebMvc 风格的 Controller 编写
@RestController
@RequestMapping
public class WebMvcStyleController {

    @GetMapping("/hello")
    public String hello() {
        return "Hello WebFlux";
    }

    @GetMapping("/list")
    public List<Integer> list() {
        return Arrays.asList(1, 2, 3);
    }
}
```

编写完成后，使用浏览器或 Postman 访问 `localhost:8080/hello`，客户端可以正常接收到服务端的"Hello WebFlux"字符串响应，说明 WebFlux 可以完美兼容 WebMvc 的编码方式。

### 13.2.2 逐步过渡到 WebFlux

从 13.1 节的内容中可以了解到，Reactor 中核心数据的封装模型是 Mono 和 Flux，下面根据该模型对 `WebMvcStyleController` 进行改造。当返回单个对象时，使用 Mono 封装；当返回一组数据时，使用 Flux 封装，如代码清单 13-11 所示。

```java
// 代码清单 13-11 使用 Reactor 的数据封装模型改造 Handler
@RestController
@RequestMapping
public class WebMvcStyleController {

    @GetMapping("/hello2")
    public Mono<String> hello2() {
        return Mono.just("Hello WebFlux");
    }

    @GetMapping("/list2")
    public Flux<Integer> list2() {
        return Flux.just(1, 2, 3);
    }
}
```

重新启动 `SpringBootWebFluxApplication`，并访问 `localhost:8080/hello2` 和 `/list2`，客户端仍然可以接收到服务端响应的正常数据，说明利用 Reactor 中的数据模型作为响应数据完全可行。

**提示**：留意一个细节，目前的改造中仍然使用 `@RestController` 注解中的 `@ResponseBody` 重新启动 SpringBootWebFluxApplication，并访问 localhost：8080/hello2 和 /list2，客户端仍然可以接收到服务端响应的正常数据，说明利用 Reactor 中的数据模型作为响应数据主体完全可行。

### 13.2.3 WebFlux 的函数式开发

如果想要完全丢弃 WebMvc 的编码方式，转而使用 WebFlux 的风格，需要使用 WebFlux 提供的全新函数式 API。在切换风格之前，先总结一下在 WebMvc 的开发中的关键点：

- Controller 类上要标注 `@Controller` 注解或其派生注解
- Controller 类中的 Handler 方法上要标注 `@RequestMapping` 注解或其派生注解

结合第 12 章 WebMvc 中的原理分析可以了解到，Controller 中标注了 `@RequestMapping` 注解的方法在底层会封装为一个个 Handler，每个 Handler 中都封装有 URL+执行方式以及具体要反射执行的 Method 对象，这两个核心要素在 WebFlux 的编码风格中会转换为两个核心组件：`HandlerFunction` 和 `RouterFunction`。下面将 `WebMvcStyleController` 重构为 WebFlux 的风格代码。

#### 1. Controller 转 Handler

WebFlux 的编码风格中不再有 Controller 的概念，容器中的一切 Bean 都可以视为处理客户端请求的 Handler，所以在声明具体的前端控制器时，将不再使用 `@Controller` 注解，而是使用原始的 `@Component` 注解，且内部的方法不再需要多余的注解，只需要按照 WebFlux 的规则编写方法，如代码清单 13-12 所示。

```java
// 代码清单 13-12 HelloHandler 的编写
@Component
public class HelloHandler {

    public Mono<ServerResponse> hello3(ServerRequest request) {
        return ServerResponse.ok()
            .contentType(MediaType.TEXT_PLAIN)
            .body(Mono.just("Hello Handler"), String.class);
    }

    public Mono<ServerResponse> list3(ServerRequest request) {
        return ServerResponse.ok()
            .contentType(MediaType.APPLICATION_JSON)
            .body(Flux.just(1, 2, 3), Integer.class);
    }
}
```

#### 2. RequestMapping 转 Router

注意对比 `HelloHandler` 与 `WebMvcStyleController` 的差别。由于 `HelloHandler` 中不再有 `@Controller` 注解，方法上也不再使用 `@RequestMapping` 注解封装 URL 信息，因此 Spring Framework 无法感知到 IOC 容器中的哪些 bean 对象具备 WebFlux 前端控制器的能力，此时就需要一个新的组件来定义 Bean 与具体路由的关系，这个组件就是 `RouterFunction`。

在编写具体的路由规则时，需要一个配置类来编程式创建 `RouterFunction` 对象，代码清单 13-13 展示了将 `HelloHandler` 应用到 WebFlux 的具体示例。

```java
// 代码清单 13-13 HelloRouterConfiguration 配置路由规则
import static org.springframework.web.reactive.function.server.RequestPredicates.*;

@Configuration(proxyBeanMethods = false)
public class HelloRouterConfiguration {

    @Autowired
    private HelloHandler helloHandler;

    @Bean
    public RouterFunction<ServerResponse> helloRouter() {
        return RouterFunctions.route(GET("/hello3")
            .and(accept(MediaType.TEXT_PLAIN)), helloHandler::hello3)
            .andRoute(GET("/list3")
            .and(accept(MediaType.APPLICATION_JSON)), helloHandler::list3);
    }
}
```

可能有部分读者不理解上述的配置方式，注意代码清单 13-13 中的第一行，它静态导入了 `RequestPredicates` 中的所有静态成员，所以下面的路由配置构造中会简洁许多。简单归纳路由配置类中的核心要素：

- 路由配置类也是一个配置类，其中包含 `@Bean` 注解标注的、返回值类型是 `RouterFunction` 的方法
- `RouterFunction` 的构造过程中，配置的核心要素也是 Handler 方法 + URL 路径和请求方式

至此，一个基于 WebFlux 编码风格的示例项目搭建完成。

### 13.2.4 WebMvc 与 WebFlux 的对比

示例项目搭建完毕后，下面简单对比一下 WebFlux 与传统的 WebMvc 的异同点。在 Spring Framework 的官方文档中有一张图，清楚直观地描述了 WebMvc 与 WebFlux 的共性和特性。

简单总结图 13-3 中的内容：

- **WebMvc**：基于原生 Servlet，它是命令式编程 + 声明式映射，编码简单、便于调试；Servlet 可以是阻塞的，它更适合与传统的关系型数据库等阻塞 I/O 的组件进行交互
- **WebFlux**：基于 Reactor，它是异步非阻塞的，使用函数式编程，相较于命令式编程和声明式映射更灵活，而且它可以运行在 Netty 等纯异步非阻塞的 Web 容器，以及同时支持同步阻塞和异步非阻塞的基于 Servlet 3.1 及以上规范的 Servlet 容器中（如高版本的 Tomcat、Undertow 等）
- **共同点**：WebMvc 和 WebFlux 都可以使用声明式映射注解编程，配置控制器和映射路径

在实际的項目技术选型中，需要综合考虑项目中使用的技术栈、用户群规模、开发团队能力等多方面因素决定使用 WebMvc 还是 WebFlux。

## 13.3 WebFlux 的自动装配

下面探讨 Spring Boot 整合 WebFlux 的底层原理。根据前面讲过的内容以及参考 WebMvc 的自动装配，不难得出 WebFlux 的核心自动装配类似于 WebMvc，对应的类名是 `WebFluxAutoConfiguration`。与 WebMvc 的自动装配类似，`WebFluxAutoConfiguration` 的装配也有几个前置的装配（如嵌入式容器、DispatcherHandler 等），下面对其中涉及的核心配置类逐一展开讲解。

### 13.3.1 ReactiveWebServerFactoryAutoConfiguration

与 WebMvc 中的 `ServletWebServerFactoryAutoConfiguration` 类似，它导入的核心配置类也是一个 `BeanPostProcessorsRegistrar` 和几个嵌入式 Web 容器的内部类，如代码清单 13-14 所示。

```java
// 代码清单 13-14 ReactiveWebServerFactoryAutoConfiguration
@AutoConfigureOrder(Ordered.HIGHEST_PRECEDENCE)
@Configuration(proxyBeanMethods = false)
@ConditionalOnClass(ReactiveHttpInputMessage.class)
@ConditionalOnWebApplication(type = ConditionalOnWebApplication.Type.REACTIVE)
@EnableConfigurationProperties(ServerProperties.class)
@Import({
    ReactiveWebServerFactoryAutoConfiguration.BeanPostProcessorsRegistrar.class,
    ReactiveWebServerFactoryConfiguration.EmbeddedJetty.class,
    ReactiveWebServerFactoryConfiguration.EmbeddedUndertow.class,
    ReactiveWebServerFactoryConfiguration.EmbeddedNetty.class
})
public class ReactiveWebServerFactoryAutoConfiguration {
    // ...
}
```

请注意，与 WebMvc 相比 WebFlux 中额外添加了 Netty 的内部容器支持，且 WebFlux 默认使用的嵌入式 Web 容器就是 Netty，所以这里重点展开 `EmbeddedNetty` 的源码研究，如代码清单 13-15 所示。

```java
// 代码清单 13-15 EmbeddedNetty 注册嵌入式 Netty
@Configuration(proxyBeanMethods = false)
@ConditionalOnMissingBean(ReactiveWebServerFactory.class)
@ConditionalOnClass(HttpServer.class)
static class EmbeddedNetty {

    @ConditionalOnMissingBean
    ReactorResourceFactory reactorServerResourceFactory() {
        return new ReactorResourceFactory();
    }

    @Bean
    NettyReactiveWebServerFactory nettyReactiveWebServerFactory(
            ReactorResourceFactory resourceFactory,
            ObjectProvider<NettyRouteProvider> routes,
            ObjectProvider<NettyServerCustomizer> serverCustomizers) {

        NettyReactiveWebServerFactory serverFactory = new NettyReactiveWebServerFactory();
        serverFactory.setResourceFactory(resourceFactory);
        routes.orderedStream().forEach(serverFactory::addRouteProviders);
        serverFactory.getServerCustomizers().addAll(
            serverCustomizers.orderedStream().collect(Collectors.toList()));
        return serverFactory;
    }
}
```

由 `EmbeddedNetty` 中注册的 Bean 来看，`NettyReactiveWebServerFactory` 相比于 WebMvc 中注册的 `TomcatServletWebServerFactory`，它会在 IOC 容器的初始化阶段创建嵌入式 Netty 服务器。

除此之外，另一个注册的 Bean 类型是 `ReactorResourceFactory`，它是一个可以管理 Reactor Netty 资源的工厂，这个设计类似于线程池。在 `ReactorResourceFactory` 的内部组合了一个 `ConnectionProvider`，它会初始化一个弹性连接提供者，而这个提供者的落地实现类是 `PooledConnectionProvider`，如代码清单 13-16 所示。

```java
// 代码清单 13-16 ReactorResourceFactory
public class ReactorResourceFactory implements InitializingBean, DisposableBean {

    private Supplier<ConnectionProvider> connectionProviderSupplier =
        () -> ConnectionProvider.elastic("webflux");

    // elastic 静态方法
    static ConnectionProvider elastic(String name) {
        return new PooledConnectionProvider(name,
            (bootstrap, handler, checker) -> new SimpleChannelPool(bootstrap,
                handler, checker, true, false));
    }
}
```

从类名上可以直观地体现出"池"的概念，由此可以简单理解 `ReactorResourceFactory` 就是 一个 Reactor Netty 的连接池。

此外，在 `ReactorResourceFactory` 中还有 select 与 worker 的概念，这些概念都是 Netty 的核心。

### 13.3.2 WebFluxAutoConfiguration

下面是自动配置类核心 `WebFluxAutoConfiguration`，如代码清单 13-17 所示。从它的类头可以看出，它生效的前提是当前项目的 Web 类型为 REACTIVE，以及需要当前项目类路径下存在 `WebFluxConfigurer` 类，这与 WebMvc 的判断条件相似（WebMvc 中判断的项目 Web 类型 SERVLET，而且检查的类是 Servlet、DispatcherServlet 等）。

```java
// 代码清单 13-17 WebFluxAutoConfiguration
@Configuration(proxyBeanMethods = false)
@ConditionalOnWebApplication(type = ConditionalOnWebApplication.Type.REACTIVE)
@ConditionalOnClass(WebFluxConfigurer.class)
@ConditionalOnMissingBean({ WebFluxConfigurationSupport.class })
@AutoConfigureAfter({
    ReactiveWebServerFactoryAutoConfiguration.class,
    CodecsAutoConfiguration.class,
    ValidationAutoConfiguration.class
})
@AutoConfigureOrder(Ordered.LOWEST_PRECEDENCE + 10)
public class WebFluxAutoConfiguration {
    // ...
}
```

在 `WebFluxAutoConfiguration` 的内部没有任何 Bean 的注册，而是由几个静态内部类根据不同功能和场景分别配置对应的组件，下面就其中重要的静态内部类展开讲解。

### 13.3.3 WebFluxConfig

`WebFluxConfig` 是 WebFlux 的第一个核心配置类，它本身导入了 `EnableWebFluxConfiguration`，如代码清单 13-18 所示。本节先关注 `WebFluxConfig` 的配置，13.3.4 节会对 `EnableWebFluxConfiguration` 展开研究。

```java
// 代码清单 13-18 WebFluxConfig
@EnableConfigurationProperties({ ResourceProperties.class, WebFluxProperties.class })
@Import(EnableWebFluxConfiguration.class)
@Configuration
public static class WebFluxConfig implements WebFluxConfigurer {
    // ...
}
```

`WebFluxConfig` 本身实现了 `WebFluxConfigurer` 接口，它具备配置 WebFlux 的能力。这个接口与 WebMvc 中的 `WebMvcConfigurer` 类似。`WebFluxConfig` 中配置了部分 WebFlux 的内容，下面就重点部分逐一来看。

#### 1. 静态资源映射

第一个重点关注的是静态资源映射。WebFlux 本身只是 WebMvc 的异步非阻塞替代品，它同样可以支持前后端不分离的 Web 项目开发，所以对于静态资源映射，WebFlux 同样需要配置。而可以支持的静态资源路径，除 webjars 之外，代码清单 13-19 的最后一个 if 结构中从 resourceProperties 提取出的静态路径与 WebMvc 完全一致。

```java
// 代码清单 13-19 addResourceHandlers 配置静态资源映射
public void addResourceHandlers(ResourceHandlerRegistry registry) {
    // 前置检查
    if (!registry.hasMappingForPattern("/webjars/**")) {
        registry.addResourceHandler("/webjars/**")
            .addResourceLocations("classpath:/META-INF/resources/webjars/");
    }

    String staticPathPattern = this.webFluxProperties.getStaticPathPattern();
    if (!registry.hasMappingForPattern(staticPathPattern)) {
        ResourceHandlerRegistration registration = registry
            .addResourceHandler(staticPathPattern)
            .addResourceLocations(this.resourceProperties.getStaticLocations());
    }
}

public class ResourceProperties {
    private static final String[] CLASSPATH_RESOURCE_LOCATIONS = {
        "classpath:/META-INF/resources/",
        "classpath:/resources/",
        "classpath:/static/",
        "classpath:/public/"
    };
    private String[] staticLocations = CLASSPATH_RESOURCE_LOCATIONS;
}
```

#### 2. 视图解析器

与 WebMvc 相同，WebFlux 默认也可以支持视图跳转，所以底层也有视图解析器的配置，如代码清单 13-20 所示。

```java
// 代码清单 13-20 视图解析器的配置
public void configureViewResolvers(ViewResolverRegistry registry) {
    this.viewResolvers.orderedStream().forEach(registry::viewResolver);
}
```

#### 3. 类型转换器和格式转换器

```java
// 代码清单 13-21 Converter 和 Formatter
public void addFormatters(FormatterRegistry registry) {
    for (Converter<?, ?> converter : getBeansOfType(Converter.class)) {
        registry.addConverter(converter);
    }
    for (GenericConverter converter : getBeansOfType(GenericConverter.class)) {
        registry.addConverter(converter);
    }
    for (Formatter<?> formatter : getBeansOfType(Formatter.class)) {
        registry.addFormatter(formatter);
    }
}
```

WebFlux 中的类型转换器和格式转换器与 WebMvc 部分的配置完全一致，不过对于这部分组件的功能读者可以不用过多关注，只需要体会 WebFlux 的大多数配置在本质上与 WebMvc 并无区别。

### 13.3.4 EnableWebFluxConfiguration

观察 `EnableWebFluxConfiguration` 的类名，它与 WebMvc 中的 `EnableWebMvcConfiguration` 非常相近，事实上它们继承的父类也非常类似，如代码清单 13-22 所示。

```java
// 代码清单 13-22 EnableWebFluxConfiguration 与 EnableWebMvcConfiguration
@Configuration(proxyBeanMethods = false)
public static class EnableWebFluxConfiguration extends DelegatingWebFluxConfiguration {
    // ...
}

@Configuration(proxyBeanMethods = false)
public static class EnableWebMvcConfiguration extends DelegatingWebMvcConfiguration
    implements ResourceLoaderAware {
    // ...
}
```

它们继承的父类 `Delegating***Configuration` 的作用在 2.6 节中讲过，它们是对应 `@EnableWebMvc` 或者 `@EnableWebFlux` 注解导入的配置类。如果 Spring Boot 的项目中显式标注了 `@EnableWebFlux` 注解，则 `WebFluxAutoConfiguration` 不会生效，改由项目自身接管 WebFlux，具体原因和底层机制可参照 2.6 节的提示。

下面简单列举 `EnableWebFluxConfiguration` 中注册的核心组件：

- `FormattingConversionService`：参数类型转换器，用于数据的类型转换，如日期与字符串之间的互相转换（在 WebMvc 中同样有注册）
- `Validator`：JSR-303 参数校验器（在 WebMvc 中同样有注册）
- `HandlerMapping` & `HandlerAdapter`：覆盖父类

### 13.3.5 WebFluxConfigurationSupport

`EnableWebFluxConfiguration` 继承自 `WebFluxConfigurationSupport`，这个父类中也有一些核心组件的注册，下面列举其中重要的几个组件。

#### 1. DispatcherHandler

WebFlux 中的核心前端控制器是 `DispatcherHandler`，对应到 WebMvc 中的组件是 `DispatcherServlet`，不过 `DispatcherHandler` 的注册逻辑比 `DispatcherServlet` 简单，如代码清单 13-23 所示。

```java
// 代码清单 13-23 DispatcherHandler 的注册
@Bean
public DispatcherHandler webHandler() {
    return new DispatcherHandler();
}
```

#### 2. WebExceptionHandler

WebFlux 的异常状态响应处理器用于处理异常情况下的 HTTP 状态码响应，如代码清单 13-24 所示。

```java
// 代码清单 13-24 WebFluxResponseStatusExceptionHandler
@Bean
@Order(0)
public WebExceptionHandler responseStatusExceptionHandler() {
    return new WebFluxResponseStatusExceptionHandler();
}
```

#### 3. RequestMappingHandlerMapping & RequestMappingHandlerAdapter

因为 WebFlux 可以完美支持 WebMvc 中使用标准 `@RequestMapping` 注解的方式定义 Handler，而支持的底层是与 WebMvc 中相同的 `RequestMappingHandlerMapping` 和 `RequestMappingHandlerAdapter`，如代码清单 13-25 所示。

```java
// 代码清单 13-25 RequestMappingHandlerMapping 的注册
@Bean
public RequestMappingHandlerMapping requestMappingHandlerMapping() {
    RequestMappingHandlerMapping mapping = createRequestMappingHandlerMapping();
    mapping.setOrder(0);
    // ...
    return mapping;
}

@Bean
public RequestMappingHandlerAdapter requestMappingHandlerAdapter() {
    RequestMappingHandlerAdapter adapter = createRequestMappingHandlerAdapter();
    return adapter;
}
```

#### 4. RouterFunctionMapping

`RouterFunctionMapping` 是基于函数式端点路由编程的 Mapping 处理器，如代码清单 13-26 所示。它的优先级高于 `RequestMappingHandlerMapping`，这意味着 WebFlux 倾向于开发中使用函数式端点的 Web 开发，而不是传统的 `@RequestMapping` 注解式开发。

```java
// 代码清单 13-26 RouterFunctionMapping 的注册
public RouterFunctionMapping routerFunctionMapping() {
    RouterFunctionMapping mapping = createRouterFunctionMapping();
    mapping.setOrder(-1);  // 注意此处设置的优先级高于 RequestMappingHandlerMapping
    mapping.setMessageReaders(serverCodecConfigurer().getReaders());
    mapping.setCorsConfigurations(getCorsConfigurations());
    return mapping;
}
```

#### 5. HandlerFunctionAdapter

函数式端点路由的处理器在底层也需要由具体的 HandlerAdapter 负责调用，对应的支撑组件是 `HandlerFunctionAdapter`，如代码清单 13-27 所示。它可以直接提取出 `HandlerFunction` 中的 Handler 方法进行调用。

```java
// 代码清单 13-27 HandlerFunctionAdapter 的注册
@Bean
public HandlerFunctionAdapter handlerFunctionAdapter() {
    return new HandlerFunctionAdapter();
}
```

#### 6. ResultHandler

WebFlux 中同样需要有对返回值进行处理的组件，在 WebMvc 中的类型是 `HandlerMethodReturnValueHandler`，对应到 WebFlux 中则是 `ResultHandler`。默认情况下 WebFlux 会注册 4 种不同的 `ResultHandler` 实现类：

- `ResponseEntityResultHandler`：处理 HttpEntity 和 ResponseEntity
- `ResponseBodyResultHandler`：处理 `@RequestMapping` 的标注了 `@ResponseBody` 注解的 Handler
- `ViewResolutionResultHandler`：处理逻辑视图返回值
- `ServerResponseResultHandler`：处理返回值类型为 ServerResponse 的（WebFlux 中可以直接返回 ServerResponse，如代码清单 13-12 所示）

## 13.4 DispatcherHandler 的传统方式工作原理

`DispatcherHandler` 作为 WebFlux 的核心前端控制器，它的作用必然与 `DispatcherServlet` 相同，都是负责统一接收客户端请求并处理，然后将结果响应给客户端。由于 WebFlux 可以完美兼容 `@RequestMapping` 注解式开发，本节内容先研究传统的开发方式下 `DispatcherHandler` 的工作原理。

以本章的示例项目 `springboot-13-webflux` 为调试基准，Debug 启动项目并将断点打在 `DispatcherHandler` 的 `handle` 方法中，随后用浏览器访问 `http://localhost:8080/hello`，待程序停在断点处时开始 Debug 调试。

### 13.4.1 handle 方法概览

进入 `DispatcherHandler` 的 `handle` 方法中，最直观的体现是源码篇幅更短，相较于 `DispatcherServlet` 的 `doDispatch` 方法实现更精炼，如代码清单 13-28 所示。

```java
// 代码清单 13-28 DispatcherHandler#handle
public Mono<Void> handle(ServerWebExchange exchange) {
    if (this.handlerMappings == null) {
        return createNotFoundError();
    }
    return Flux.fromIterable(this.handlerMappings)
        .concatMap(mapping -> mapping.getHandler(exchange))
        .next()
        .switchIfEmpty(createNotFoundError())
        .flatMap(handler -> invokeHandler(exchange, handler))
        .flatMap(result -> handleResult(exchange, result));
}
```

注意 `handle` 方法的入参是一个 `ServerWebExchange` 对象，联想 `DispatcherServlet` 中传入的是 `HttpServletRequest` 和 `HttpServletResponse` 对象，不难推测 `ServerWebExchange` 就是 request 和 response 的组合体。

```java
// 代码清单 13-29 ServerWebExchange 接口的方法定义
public interface ServerWebExchange {
    ServerHttpRequest getRequest();
    ServerHttpResponse getResponse();
    // ...
}
```

总观 `handle` 方法的实现，首先 if 分支中会检查 `DispatcherHandler` 中是否注册有 `HandlerMapping`，由于上面的自动配置类导入的配置类已经注册了必要的 HandlerMapping，所以不会进入该分支。后面的 return 结构是一串链式调用，源码本身的可读性比较高，可以结合第 12 章中 `DispatcherServlet` 的工作原理对应地分析 `DispatcherHandler` 中三个关键步骤的执行轨迹。

**提示**：由于函数式编程和响应式的设计问题，会导致实际调试程序时 Debug 难度非常大，在 Debug 的过程中随时可能出现来回跳转的情况，读者在结合 IDE 调试 WebFlux 相关源码时，一定要格外注意方法的执行轨迹。

### 13.4.2 筛选 HandlerMapping

`DispatcherHandler` 的 `handle` 方法的第一个动作与 `DispatcherServlet` 相同，都是寻找可以匹配当前请求的 `HandlerMapping` 对象，在 `handle` 方法中负责筛选 `HandlerMapping` 的步骤如代码清单 13-30 所示。首先会将 `DispatcherHandler` 中保存的所有 `HandlerMapping` 封装为一个 `Flux` 对象，之后使用 `concatMap` 方法使所有 `HandlerMapping` 都尝试匹配当前的请求，并将结果收集合并，最后调用 `next` 方法提取出第一个匹配成功的 `HandlerMapping` 解析后的对象。

```java
// 代码清单 13-30 DispatcherHandler 筛选 HandlerMapping
return Flux.fromIterable(this.handlerMappings)
    .concatMap(mapping -> mapping.getHandler(exchange))
    .next()
    // ...
```

对于源码中的第一步和最后一步都不难理解，中间的 `concatMap(mapping -> mapping.getHandler(exchange))` 需要重点理解。

#### 1. concatMap

`concatMap` 是 Flux 中的一个动作，执行 `concatMap` 方法可以将 Flux 管道中的对象转换为另一种类型的对象，该操作非常类似于 Stream 中的 map 方法，但又不完全相同。Stream 中的 map 方法执行完成后，整个管道中的元素个数不变，而 Flux 的 `concatMap` 方法执行完成后，管道中的元素个数可能会发生改变。

`DispatcherHandler` 之所以选择使用 `concatMap` 方法转换 HandlerMapping，是希望通过一个循环后将仅支持当前请求的 HandlerMapping 筛选出来，忽略不支持的。

#### 2. mapping.getHandler

筛选 HandlerMapping 的实际动作需要借助 `HandlerMapping` 的 `getHandler` 方法，如果 `getHandler` 方法返回的 Mono 对象中有具体值则认为匹配，反之不匹配。而 `getHandler` 方法定义在所有 HandlerMapping 实现类的基础父类 `AbstractHandlerMapping` 中，方法内部又会调用模板方法 `getHandlerInternal`，源码的设计与 WebMvc 中完全一致，如代码清单 13-31 所示。

```java
// 代码清单 13-31 getHandler 调用 getHandlerInternal
public Mono<Object> getHandler(ServerWebExchange exchange) {
    return getHandlerInternal(exchange).map(handler -> {
        // logger ...
        // 跨域相关处理
        return handler;
    });
}
```

基于 `@RequestMapping` 注解式开发的解析，底层由 `RequestMappingHandlerMapping` 负责匹配，而 `getHandlerInternal` 方法的实现逻辑在父类 `AbstractHandlerMethodMapping` 中，如代码清单 13-32 所示。

```java
// 代码清单 13-32 AbstractHandlerMethodMapping#getHandlerInternal
public Mono<HandlerMethod> getHandlerInternal(ServerWebExchange exchange) {
    this.mappingRegistry.acquireReadLock();
    try {
        HandlerMethod handlerMethod;
        try {
            // 搜索处理器方法（真正处理请求的 RequestMapping）
            handlerMethod = lookupHandlerMethod(exchange);
        }
        // 将方法分离出来，单独形成一个 Bean
        if (handlerMethod != null) {
            handlerMethod = handlerMethod.createWithResolvedBean();
            return Mono.justOrEmpty(handlerMethod);
        }
    }
    // finally ...
}
```

仔细观察代码清单 13-32 的获取逻辑，将这段源码与代码清单 12-16 对比，可以发现 WebFlux 中的 `RequestMappingHandlerMapping` 的实现逻辑与 WebMvc 完全一致，同样都是先搜索 Controller 方法，后封装为独立的 `HandlerMethod` 对象并返回。

通过 Debug，可以发现此处可以成功匹配到 `/hello` 请求对应的 Controller 方法。

### 13.4.3 搜寻 HandlerAdapter 并执行

HandlerMapping 获取完毕后，`DispatcherHandler` 的下一个步骤也是搜寻合适的 HandlerAdapter，用于执行目标 Handler。该步骤对应 `handle` 方法中的 `flatMap(handler -> invokeHandler(exchange, handler))` 步骤。

#### 1. 匹配合适的 HandlerAdapter

进入 `invokeHandler` 方法中，可以发现源码中会逐个检查 `DispatcherHandler` 中的 HandlerAdapter 是否支持执行当前的 Handler，如果支持，则会直接调用 HandlerAdapter 的 `handle` 方法执行目标 Handler，如代码清单 13-33 所示。

```java
// 代码清单 13-33 invokeHandler
private Mono<HandlerResult> invokeHandler(ServerWebExchange exchange, Object handler) {
    if (this.handlerAdapters != null) {
        for (HandlerAdapter handlerAdapter : this.handlerAdapters) {
            if (handlerAdapter.supports(handler)) {
                return handlerAdapter.handle(exchange, handler);
            }
        }
    }
    return Mono.error(new IllegalStateException("No HandlerAdapter: " + handler));
}
```

整个逻辑与 WebMvc 中的逻辑有一点区别，`DispatcherServlet` 会逐个检查 HandlerAdapter，在找到合适的 HandlerAdapter 后会返回，之后再执行 Handler；而 `DispatcherHandler` 中会遍历检查，检查到 HandlerAdapter 支持执行当前 Handler 时会直接执行，不再添加额外的动作。

#### 2. 执行 Handler

基于 `@RequestMapping` 注解式开发的 Handler，底层使用 `RequestMappingHandlerAdapter` 执行，进入其 `handle` 方法中可以发现，在 WebMvc 的 `RequestMappingHandlerAdapter` 中处理的逻辑对应到 WebFlux 中基本上都会执行，只是执行顺序和方式不同。核心 Handler 执行的动作是在封装好 `InvocableHandlerMethod` 之后在 return 部分的链式调用中执行 `invocableMethod.invoke(exchange, bindingContext)` 方法，利用反射机制执行目标 Controller 方法，如代码清单 13-34 所示。

```java
// 代码清单 13-34 RequestMappingHandlerAdapter#handle
public Mono<HandlerResult> handle(ServerWebExchange exchange, Object handler) {
    HandlerMethod handlerMethod = (HandlerMethod) handler;
    // 检查 ...

    // 初始化参数绑定上下文
    InitBinderBindingContext bindingContext = new InitBinderBindingContext(
        getWebBindingInitializer(),
        this.methodResolver.getInitBinderMethods(handlerMethod));

    // 创建方法执行对象
    InvocableHandlerMethod invocableMethod =
        this.methodResolver.getRequestMappingMethod(handlerMethod);

    // 异常处理器的准备
    Function<Throwable, Mono<HandlerResult>> exceptionHandler =
        ex -> handleException(ex, handlerMethod, bindingContext, exchange);

    // 执行目标方法，处理返回值和异常
    return this.modelInitializer
        .initModel(handlerMethod, bindingContext, exchange)
        .then(Mono.defer(() -> invocableMethod.invoke(exchange, bindingContext)))
        .doOnNext(result -> result.setExceptionHandler(exceptionHandler))
        .doOnNext(result -> bindingContext.saveModel())
        .onErrorResume(exceptionHandler);
}
```

源码中的其余部分基本与 WebMvc 中的对应，部分 API 甚至直接复制了 WebMvc 中的源码。

### 13.4.4 返回值处理

`InvocableHandlerMethod` 的 `invoke` 方法执行完成后会返回一个 `HandlerResult` 对象，其中封装了执行 Controller 方法后返回的真实值。`DispatcherHandler` 的最后一个关键步骤是对该返回值进行处理，对应源码的动作是 `flatMap(result -> handleResult(exchange, result))`，如代码清单 13-35 所示。

```java
// 代码清单 13-35 handleResult 处理返回值
private Mono<Void> handleResult(ServerWebExchange exchange, HandlerResult result) {
    return getResultHandler(result).handleResult(exchange, result)
        .onErrorResume(ex -> result.applyExceptionHandler(ex)
            .flatMap(exceptionResult ->
                getResultHandler(exceptionResult).handleResult(exchange, exceptionResult)));
}
```

`handleResult` 本身定义在 `DispatcherHandler` 中，它的筛选逻辑与返回值处理逻辑与 HandlerMapping 和 HandlerAdapter 不太相同。进入获取 `ResultHandler` 的方法 `getResultHandler` 中，如代码清单 13-36 所示。通过 Debug 观察到 `DispatcherHandler` 中默认组合了 4 种不同的 ResultHandler。

```java
// 代码清单 13-36 getResultHandler 匹配 ResultHandler
private HandlerResultHandler getResultHandler(HandlerResult handlerResult) {
    if (this.resultHandlers != null) {
        for (HandlerResultHandler resultHandler : this.resultHandlers) {
            if (resultHandler.supports(handlerResult)) {
                return resultHandler;
            }
        }
    }
    throw new IllegalStateException("No HandlerResultHandler for " + handlerResult.getReturnValue());
}
```

由于 `WebMvcStyleController` 类中标注了 `@RestController` 注解，因此此处匹配的值处理器一定是 `ResponseBodyResultHandler`，而它的 `handleResult` 方法中会将 Handler 的返回值取出，并执行 `writeBody` 方法将返回值结果写入响应流，如代码清单 13-37 所示。

```java
// 代码清单 13-37 ResponseBodyResultHandler#handleResult
public Mono<Void> handleResult(ServerWebExchange exchange, HandlerResult result) {
    Object body = result.getReturnValue();
    MethodParameter bodyTypeParameter = result.getReturnTypeSource();
    return writeBody(body, bodyTypeParameter, exchange);
}
```

`ResultHandler` 的工作处理完成后，`handle` 方法的链式调用执行完毕，一次完整的请求处理结束。

### 13.4.5 工作流程小结

本节的最后，以流程图的形式总结上述 `DispatcherHandler` 处理的全流程。

使用传统的 `@RequestMapping` 注解式开发与使用函数式端点开发的最大区别在于，底层支持的 HandlerMapping 与 HandlerAdapter 的实现类不同。对于整体的请求处理流程而言，依然是遵循 `DispatcherHandler` 的 `handle` 方法。

## 13.5 DispatcherHandler 的函数式端点工作原理

本节中着重研究基于函数式端点的开发中底层 HandlerMapping 与 HandlerAdapter 的工作原理。

为测试函数式端点的底层执行流程，下面使用浏览器访问 `http://localhost:8080/hello3`，待程序停在 `DispatcherHandler` 的 `handle` 方法中断点处时开始 Debug 调试。

### 13.5.1 HandlerMapping 的不同

对于使用函数式端点开发的 Handler，底层使用的 HandlerMapping 不再是 `RequestMappingHandlerMapping`，而是在 13.3.5 节中提到的 `RouterFunctionMapping`，这个类的内部会收集所有注册的函数式端点，并组合为一个 `RouterFunction` 对象。下面先简单了解 `RouterFunctionMapping` 的初始化逻辑，相关源码如代码清单 13-38 所示。

```java
// 代码清单 13-38 RouterFunctionMapping 的初始化动作
public void afterPropertiesSet() throws Exception {
    if (this.routerFunction == null) {
        initRouterFunctions();
    }
}

protected void initRouterFunctions() {
    List<RouterFunction<?>> routerFunctions = routerFunctions();
    this.routerFunction = routerFunctions.stream()
        .reduce(RouterFunction::andOther)
        .orElse(null);
    logRouterFunctions(routerFunctions);
}

private List<RouterFunction<?>> routerFunctions() {
    List<RouterFunction<?>> functions = obtainApplicationContext()
        .getBeanProvider(RouterFunction.class)
        .orderedStream()
        .map(router -> (RouterFunction<?>) router)
        .collect(Collectors.toList());
    return (!CollectionUtils.isEmpty(functions) ? functions : Collections.emptyList());
}
```

`RouterFunctionMapping` 本身实现了 `InitializingBean`，对应的 `afterPropertiesSet` 方法中有一个 `initRouterFunctions` 的动作，该动作会提取出 IOC 容器中注册的所有 `RouterFunction` 对象，并收集为一个 List，之后借助 Stream 的 `reduce` 方法，调用 `RouterFunction` 的 `andOther` 方法将所有 `RouterFunction` 组合为一个 `RouterFunction` 对象。这个处理逻辑非常类似于 `RequestMappingHandlerMapping` 的 `detectHandlerMethods` 方法将所有的 Controller 方法存入 `MappingRegistry` 中。

通过实际 Debug，当 `DispatcherHandler` 中的 `getHandler` 方法执行完毕后，获取的 Handler 已经可以定位到注册函数式端点的配置类 `HelloRouterConfiguration` 中。

### 13.5.2 HandlerAdapter 的不同

HandlerMapping 的工作处理完成后，下面是 HandlerAdapter 执行 Handler 的步骤。函数式端点开发中，底层配合完成 Handler 调用的 HandlerAdapter 也发生了变化，具体的实现类是 `HandlerFunctionAdapter`，从它的 `handle` 方法实现来看，核心动作是获取 `HandlerFunction` 并调用其 `handle` 方法，如代码清单 13-39 所示。

```java
// 代码清单 13-39 HandlerFunctionAdapter#handle
public boolean supports(Object handler) {
    return handler instanceof HandlerFunction;
}

public Mono<HandlerResult> handle(ServerWebExchange exchange, Object handler) {
    HandlerFunction<?> handlerFunction = (HandlerFunction<?>) handler;
    ServerRequest request = exchange.getRequiredAttribute(RouterFunctions.REQUEST_ATTRIBUTE);
    return handlerFunction.handle(request).map(response ->
        new HandlerResult(handlerFunction, response, HANDLER_FUNCTION_RETURN_TYPE));
}
```

到这里可能有读者会产生疑问，为什么进入 `handle` 方法的 handler 参数类型是 `HandlerFunction`？除了 `HandlerFunctionAdapter` 是否可以处理当前 Handler 的检查（supports 方法），更重要的其实是在注册函数式端点的配置类中。注意观察代码清单 13-40 中注册 `RouterFunction` 时传入的方法引用 `helloHandler::hello3`，它的本质是一个简化版的 Lambda 表达式，或者从原始的角度说，它的本质是一个匿名内部类，而该匿名内部类的类型就是 `HandlerFunction`。

```java
// 代码清单 13-40 HelloRouterConfiguration 中注册函数式端点路由
@Bean
public RouterFunction<ServerResponse> helloRouter() {
    // 注意下面
    .route(GET("/hello3").and(accept(MediaType.TEXT_PLAIN)), helloHandler::hello3)
    .andRoute(GET("/list3").and(accept(MediaType.APPLICATION_JSON)), helloHandler::list3);
}

// RouterFunctions#route
public static <T extends ServerResponse> RouterFunction<T> route(
        RequestPredicate predicate, HandlerFunction<T> handlerFunction) {
    return new DefaultRouterFunction<>(predicate, handlerFunction);
}

@FunctionalInterface
public interface HandlerFunction<T extends ServerResponse> {
    Mono<T> handle(ServerRequest request);
}
```

通过观察 `RouterFunctions` 的静态方法 `route` 也能获取到该信息，该方法的第二个参数会传入一个 `HandlerFunction` 类型的对象，而 `HandlerFunction` 本身是一个函数式接口，所以可以使用 Lambda 表达式或方法引用进行简化。

如果不对其进行简化，则注册 `RouterFunction` 的代码如代码清单 13-41 所示。

```java
// 代码清单 13-41 不使用方法引用注册 RouterFunction
@Bean
public RouterFunction<ServerResponse> helloRouter() {
    return RouterFunctions.route(GET("/hello3").and(accept(MediaType.TEXT_PLAIN)),
        new HandlerFunction<ServerResponse>() {
            @Override
            public Mono<ServerResponse> handle(ServerRequest request) {
                return helloHandler.hello3(request);
            }
        });
}
```

由以上分析，回到 `HandlerFunctionAdapter` 中，显然 `HandlerFunctionAdapter` 的 `handle` 方法所做的工作就是直接调用项目中编写的具体 Controller 方法，相较于 `RequestMappingHandlerAdapter` 的处理方式更简单直接。

### 13.5.3 返回值处理的不同

对于基于函数式端点的开发方式，因为 Handler 最终返回的对象是 `Mono<ServerResponse>`，所以负责返回值处理的 ResultHandler 不再是 `ResponseBodyResultHandler`，而是 `ServerResponseResultHandler`，而它处理返回值的方式仅是把方法返回的 ServerResponse 对象写入 ServerWebExchange 中，如代码清单 13-42 所示（由于 ServerResponse 的构建中一般会向响应体中写入数据，因此该步骤相当于将响应体的数据写入 ServerWebExchange 中）。

```java
// 代码清单 13-42 handleResult 处理 Handler 的返回值
public Mono<Void> handleResult(ServerWebExchange exchange, HandlerResult result) {
    ServerResponse response = (ServerResponse) result.getReturnValue();
    Assert.state(response != null, "No ServerResponse");
    return response.writeTo(exchange, new ServerResponse.Context() {
        @Override
        public List<HttpMessageWriter<?>> messageWriters() {
            return messageWriters;
        }
        @Override
        public List<ViewResolver> viewResolvers() {
            return viewResolvers;
        }
    });
}
```

返回值处理完成后，一次完整的请求处理流程结束。

### 13.5.4 工作流程小结

同样，对于基于函数式端点的工作全流程，本节的最后也以流程图的形式总结。

## 13.6 小结

本章从 WebFlux 的底层思想响应式编程以及底层框架 Reactor 着手，通过简单示例体会 WebFlux 的几种开发方式，之后从 WebFlux 的自动装配切入，研究 WebFlux 中注册的核心组件，以及与 WebMvc 中注册组件的对比，最后以两种不同的开发方式，结合两个示例 Debug 分析和研究 WebFlux 的核心前端控制器 `DispatcherHandler` 的工作全流程。

WebFlux 的核心设计与 WebMvc 并无太大差别，本质上还是通过一个核心前端控制器 + 周边核心组件的方式共同完成请求的接收、处理和响应。
