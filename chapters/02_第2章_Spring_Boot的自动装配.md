# 第2章 Spring Boot 的自动装配

## 本章主要内容

- 理解组件装配的概念和设计
- Spring Framework 的模块装配
- Spring Framework 的条件装配
- Spring Framework 3.2 特性——SPI 机制
- Spring Boot 的装配机制与 @EnableAutoConfiguration 核心注解分析
- WebMvc 场景下的自动装配原理分析

---

## 2.1 概述

Spring Boot 中最重要的特性之一是"约定大于配置"，这在第 1 章的简单示例项目中已经展现得淋漓尽致。仅需导入一个场景启动器，无须编写任何配置，应用即可运行在 8080 端口上。

为什么导入 WebMvc 场景启动器后，即使没有编写任何配置，应用也可以正常启动？Spring Boot 如何确定引入的技术场景中需要哪些重要组件？为什么项目在没有配置任何 Web 容器的情况下也可以正常启动 Web 服务？

想要了解 Spring Boot 底层完成的工作，最重要的是掌握 Spring Boot 的自动装配机制。自动装配本身是一个相对新的概念，它基于 Spring Framework 原生组件装配进行了延伸。

---

## 2.2 组件装配

Spring Framework 本身有一个 IOC 容器，该容器中会统一管理其中的 Bean 对象，Bean 对象即组件。组件装配就是将第三方框架中的核心 API 配置到 Spring Framework 的配置文件或注解配置类中，以供 Spring Framework 统一管理。

### 2.2.1 手动装配

所谓**手动装配**，指的是开发者在项目中通过编写 XML 配置文件、注解配置类、配合特定注解等方式，将所需的组件注册到 IOC 容器（即 ApplicationContext）中。

**三种手动装配方式**：

```xml
<!-- 方式一：基于 XML 配置文件的手动配置 -->
<bean id="person" class="com.linkedbear.springboot.component.Person" />
```

```java
// 方式二：基于注解配置类的手动装配
@Configuration
public class ExampleConfiguration {
    @Bean
    public Person person() {
        return new Person();
    }
}
```

```java
// 方式三：基于组件扫描的手动装配
@Component
public class DemoService {
}
```

### 2.2.2 自动装配

**自动装配**的核心是：本应该由开发者编写的配置，转为框架自动根据项目中整合的场景依赖，合理地做出判断并装配合适的 Bean 到 IOC 容器中的组件。

Spring Boot 的自动装配具有非侵扰性。例如，当整合 Spring-jdbc 时，如果项目中已经注册了 JdbcTemplate，则 Spring Boot 提供的默认的 JdbcTemplate 就不会再创建。

同时，Spring Boot 的自动装配可以实现配置禁用，通过在 `@SpringBootApplication` 或者 `@EnableAutoConfiguration` 注解上标注 `exclude`/`excludeName` 属性，可以禁用默认的自动配置类。这种禁用方式在 Spring Boot 的全局配置文件中声明 `spring.autoconfigure.exclude` 属性时同样适用。

---

## 2.3 Spring Framework 的模块装配

模块装配是自动装配的核心，它可以把一个模块所需的核心功能组件都装配到 IOC 容器中，并保证装配的方式尽可能简单。Spring Framework 中引入模块装配的表现形式是在 3.1 版本后引入大量 `@Enablexxx` 注解，通过标注 `@Enablexxx` 系列注解，可以实现快速激活和装配对应的模块。

> **提示**：由于 Spring Boot 本身已不推荐使用 XML 配置文件的方式构建应用，因此后续内容中如果没有特殊说明，所使用的所有配置均基于注解驱动。

### 2.3.1 模块的概念

**模块**可以理解成一个一个可以分解、组合、更换的独立单元。模块与模块之间可能存在一定的依赖，模块的内部通常是高度内聚的，一个模块通常用于解决一个独立的问题。

模块通常具有以下几个特性：
- 独立的
- 功能高度内聚
- 可相互依赖
- 目标明确

### 2.3.2 快速体会模块装配

使用模块装配的核心原则：**自定义注解 + @Import 导入组件**

下面通过一个场景来快速体会模块装配的设计：使用代码模拟构建一个酒馆，酒馆里有吧台、调酒师、服务员和老板 4 种不同的实体元素。在该场景中，酒馆可看作 ApplicationContext，酒馆里的吧台、调酒师、服务员、老板等元素可看作一个个组件。

#### 1. 声明自定义注解

定义一个自定义注解 `@EnableTavern`：

```java
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@Import(Boss.class)
public @interface EnableTavern {
}
```

#### 2. 导入普通类

定义一个"老板"类，该类中不需要标注 @Component 注解：

```java
public class Boss {
}
```

只需把 Boss 类标注到 `@EnableTavern` 注解的 `@Import` 中，这意味着如果一个配置类上标注了 `@EnableTavern` 注解，就会触发 `@Import` 的效果，向容器中导入一个 Boss 类的 Bean。

#### 3. 创建配置类

声明一个 `TavernConfiguration` 配置类，并标注 `@Configuration` 和 `@EnableTavern` 注解：

```java
@Configuration
@EnableTavern
public class TavernConfiguration {
}
```

#### 4. 测试运行

```java
public class TavernApplication {
    public static void main(String[] args) {
        ApplicationContext ctx = new AnnotationConfigApplicationContext(TavernConfiguration.class);
        Boss boss = ctx.getBean(Boss.class);
        System.out.println(boss);
    }
}
```

通过运行 main 方法，可以发现使用 `getBean` 能够正常提取 Boss 对象，说明 Boss 类已经被注册到 IOC 容器中，并创建了一个对象，以此就完成了最简单的模块装配。

### 2.3.3 导入配置类

使用 `@Import` 注解也可以直接导入项目中的配置类。假设有一个调酒师配置类：

```java
public class Bartender {
    private String name;

    public Bartender(String name) {
        this.name = name;
    }

    // getter...
}
```

通过注解配置类的方式，可以一次性注册多个相同类的 Bean 对象：

```java
@Configuration
public class BartenderConfiguration {
    @Bean
    public Bartender zhangxiaosan() {
        return new Bartender("张三三");
    }

    @Bean
    public Bartender zhangdasan() {
        return new Bartender("张大三");
    }
}
```

只需把 `BartenderConfiguration` 移至其他包中（使其不被组件扫描找到），然后在 `@EnableTavern` 的 `@Import` 中把这个配置类一并导入：

```java
@Import({Boss.class, BartenderConfiguration.class})
public @interface EnableTavern {
}
```

### 2.3.4 导入 ImportSelector

`ImportSelector` 是一个接口，它的实现类可以根据指定的筛选标准（通常是一个或多个注解属性）选择并返回要导入的类的全限定名。

```java
public class BarImportSelector implements ImportSelector {

    @Override
    public String[] selectImports(AnnotationMetadata importingClassMetadata) {
        return new String[] {Bar.class.getName(), BarConfiguration.class.getName()};
    }
}
```

`ImportSelector` 的核心是可以使开发者采用更灵活的声明式向 IOC 容器注册 Bean，其重点是可以灵活地指定要注册的 Bean 的类。由于是传入全限定名的字符串，如果这些全限定名以配置文件的形式存放在项目可以读取的位置，就可以避免组件导入的硬编码问题。

### 2.3.5 导入 ImportBeanDefinitionRegistrar

如果说 `ImportSelector` 是以声明式导入组件，那么 `ImportBeanDefinitionRegistrar` 可以解释为以编程式向 IOC 容器中注册 Bean 对象，不过它实际导入的是 BeanDefinition（Bean 的定义信息）。

```java
public class WaiterRegistrar implements ImportBeanDefinitionRegistrar {

    @Override
    public void registerBeanDefinitions(AnnotationMetadata metadata,
                                        BeanDefinitionRegistry registry) {
        registry.registerBeanDefinition("waiter", new RootBeanDefinition(Waiter.class));
    }
}
```

### 2.3.6 扩展：DeferredImportSelector

`DeferredImportSelector` 是 `ImportSelector` 的一个子接口，它提供了类似于 `ImportSelector` 的组件装配机制，但执行时机比普通的 `ImportSelector` 晚。

`ImportSelector` 接口的处理时机是在注解配置类的解析期间，此时配置类中的 `@Bean` 方法等还没有被解析，而 `DeferredImportSelector` 的处理时机是注解配置类完全解析后，此时配置类的解析工作已全部完成。

Spring Framework 5.0.5 中对 `DeferredImportSelector`加入了分组概念，简单理解：引入了分组的概念后可以对不同的 `DeferredImportSelector` 加以区分。

---

## 2.4 Spring Framework 的条件装配

模块装配可以一次性导入一个场景中所需的组件，但如果只靠模块装配的内容，还不足以实现完整的组件装配。条件装配可以根据不同场景/条件满足不同组件的装配。

Spring Framework 提供了两种条件装配的方式：**基于 Profile** 和 **基于 Conditional**。

### 2.4.1 基于 Profile 的装配

Spring Framework 3.1 中就引入了 Profile 的概念。`@Profile` 注解可以标注在组件上，当一个配置属性激活时，它才会起作用。

#### 使用 @Profile 注解

```java
@Configuration
@Profile("city")
public class BartenderConfiguration {
    @Bean
    public Bartender zhangxiaosan() {
        return new Bartender("张三三");
    }

    @Bean
    public Bartender zhangdasan() {
        return new Bartender("张大三");
    }
}
```

默认情况下，ApplicationContext 中的 Profile 为 "default"，如果直接运行，不满足 `@Profile("city")` 的条件，`BartenderConfiguration` 就不会生效。

可以通过编程式设置激活的 Profile：

```java
public static void main(String[] args) {
    AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext();
    ctx.getEnvironment().setActiveProfiles("city");
    ctx.register(TavernConfiguration.class);
    ctx.refresh();

    Stream.of(ctx.getBeanDefinitionNames()).forEach(System.out::println);
}
```

也可以通过命令行参数设置运行时环境：

```bash
java -Dspring.profiles.active=city -jar app.jar
```

#### Profile 运用于实际开发

Profile 机制在 Spring Boot 中使用得非常经典，使用 `spring.profiles.active` 属性可以激活指定的环境配置。可以通过加 profile 后缀来区分不同环境下的配置文件（如 `application-dev.properties`、`application-prod.properties`）。

### 2.4.2 基于 Conditional 的装配

`@Conditional` 是在 Spring Framework 4.0 版本正式推出的，它可以使 Bean 的装配基于一些指定的条件。换句话说，被标注 `@Conditional` 注解的 Bean 要注册到 IOC 容器时，必须满足 `@Conditional` 上指定的所有条件才允许注册。

#### @Conditional 的使用

```java
@Bean
@Conditional(ExistBossCondition.class)
public Bar bbbar() {
    return new Bar();
}
```

`ExistBossCondition` 条件判断类：

```java
public class ExistBossCondition implements Condition {

    @Override
    public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
        return context.getBeanFactory().containsBeanDefinition(Boss.class.getName());
    }
}
```

#### ConditionalOnxxx 系列注解

Spring Boot 中针对 `@Conditional` 注解扩展了一系列的条件注解：

- `@ConditionalOnClass` & `@ConditionalOnMissingClass`：检查当前项目的类路径下是否包含/缺少指定类
- `@ConditionalOnBean` & `@ConditionalOnMissingBean`：检查当前容器中是否注册/缺少指定 Bean
- `@ConditionalOnProperty`：检查当前应用的属性配置
- `@ConditionalOnWebApplication` & `@ConditionalOnNotWebApplication`：检查当前应用是否为 Web 应用
- `@ConditionalOnExpression`：根据指定的 SpEL 表达式确定条件是否满足

---

## 2.5 SPI 机制

SPI（Service Provider Interface）机制来源于设计模式的依赖倒置原则。SPI 是一种"服务寻找"的机制，动态地加载接口/抽象类对应的具体实现类。SPI 的确有 IOC 的"味道"，它把接口的具体实现类的定义和声明权交给了外部化的配置文件。

### 2.5.1 JDK 原生的 SPI

JDK 1.6 中新增了 SPI 的实现。JDK 的 SPI 需要遵循以下规范：
- 所有定义的 SPI 文件都必须放在项目的 `META-INF/services` 目录下
- 文件名必须命名为接口或抽象类的全限定名
- 文件内容为接口或抽象类的具体实现类的全限定名

#### 使用示例

定义接口和实现类：

```java
public interface DemoDao {
}

public class DemoMySQLDaoImpl implements DemoDao {
}

public class DemoOracleDaoImpl implements DemoDao {
}
```

声明 SPI 文件（文件名：`com.linkedbear.springboot.assemble.d_spi.bean.DemoDao`）：

```
com.linkedbear.springboot.assemble.d_spi.bean.DemoMySQLDaoImpl
com.linkedbear.springboot.assemble.d_spi.bean.DemoOracleDaoImpl
```

测试获取：

```java
public class JdkSpiApplication {
    public static void main(String[] args) {
        ServiceLoader<DemoDao> serviceLoader = ServiceLoader.load(DemoDao.class);
        serviceLoader.iterator().forEachRemaining(dao -> {
            System.out.println(dao);
        });
    }
}
```

### 2.5.2 Spring Framework 3.2 的 SPI

Spring Framework 中的 SPI 相较于 JDK 原生的 SPI 更加高级实用。因为它不仅限于接口或抽象类，而可以是任何一个类、接口或注解。也正是因为 Spring Framework 的 SPI 可以支持注解作为索引，所以在 Spring Boot 中大量用到 SPI 机制加载自动配置类和特殊组件。

#### 声明 SPI 文件

Spring Framework 的 SPI 文件需要放在项目的 `META-INF` 目录下，且文件名必须为 `spring.factories`。

```properties
com.linkedbear.springboot.assemble.d_spi.bean.DemoDao=\
com.linkedbear.springboot.assemble.d_spi.bean.DemoMySQLDaoImpl,\
com.linkedbear.springboot.assemble.d_spi.bean.DemoOracleDaoImpl
```

> **提示**：注意，`spring.factories` 文件中定义的 key 和 value 可以毫无关联，仅凭这一点就比 JDK 的 SPI 要灵活得多。

#### 测试获取

```java
public class SpringSpiApplication {
    public static void main(String[] args) {
        List<DemoDao> demoDaos = SpringFactoriesLoader
            .loadFactories(DemoDao.class, SpringSpiApplication.class.getClassLoader());

        demoDaos.forEach(dao -> {
            System.out.println(dao);
        });
    }
}
```

---

## 2.6 Spring Boot 的装配机制

了解了 Spring Framework 的组件装配和 SPI 机制，下面就可以正式进入 Spring Boot 的装配机制阶段。

Spring Boot 的自动装配实际就是**模块装配 + 条件装配 + SPI 机制**的组合使用，而这一切都凝聚在 Spring Boot 的主启动类的 `@SpringBootApplication` 注解上。

`@SpringBootApplication` 注解是由三个注解组合而来的复合注解：

```java
@SpringBootConfiguration
@EnableAutoConfiguration
@ComponentScan(excludeFilters = {
    @Filter(type = FilterType.CUSTOM, classes = TypeExcludeFilter.class),
    @Filter(type = FilterType.CUSTOM, classes = AutoConfigurationExcludeFilter.class)
})
public @interface SpringBootApplication {
}
```

### 2.6.1 @ComponentScan

`@ComponentScan` 组件扫描的意图是扫描主启动类所在包及其子包下的所有组件。这也解释了为什么 Spring Boot 的主启动类要放到所有类所在包的最外层。

`@ComponentScan` 在 `@SpringBootApplication` 注解组合时额外添加了两个过滤条件：
- `TypeExcludeFilter`：类型排除的过滤器
- `AutoConfigurationExcludeFilter`：自动配置类的排除过滤器

### 2.6.2 @SpringBootConfiguration

`@SpringBootConfiguration` 注解本身仅组合了一个 Spring Framework 的 `@Configuration` 注解，所以一个类标注了 `@SpringBootConfiguration` 注解也就是标注了 `@Configuration` 注解，代表这个类是一个注解配置类。

### 2.6.3 @EnableAutoConfiguration

`@EnableAutoConfiguration` 注解承载了 Spring Boot 自动装配的"灵魂"。

#### javadoc 解读

标注 `@EnableAutoConfiguration` 注解后，会启用 Spring 应用上下文（即 ApplicationContext）的自动配置，并且 Spring Boot 会尝试猜测和配置当前项目中可能需要的 Bean。自动配置类通常是根据项目的类路径和定义的 Bean 来应用的。

Spring Boot 的自动配置尽可能地智能化，并会在项目中注册更多自定义配置的时候自动退出（即被覆盖）。开发者也可以直接禁用某些不需要的自动配置（使用 `exclude` 属性，或者在使用 `excludeName` 属性）。

#### 核心结构

`@EnableAutoConfiguration` 本身是一个组合注解：

```java
@AutoConfigurationPackage
@Import(AutoConfigurationImportSelector.class)
public @interface EnableAutoConfiguration {
}
```

#### @AutoConfigurationPackage

`@AutoConfigurationPackage` 注解将主启动类所在的包记录下来，注册到 `AutoConfigurationPackages` 中。

`Registrar` 本身是一个 `ImportBeanDefinitionRegistrar`，它的作用是以编程式向 IOC 容器中注册 Bean 对象，而 Registrar 要注册的对象实际上是默认主启动类所在的包路径。

> **提示**：Spring Boot 2.3.0 版本以前，`@AutoConfigurationPackage` 注解没有任何属性，标注了该注解即确定了主启动类所在包（约定）。在 Spring Boot 2.3.0 版本及以后，注解中多了 `basePackages` 和 `basePackageClasses` 属性，可以手动指定应用的根包/根路径。

#### AutoConfigurationImportSelector

`@EnableAutoConfiguration` 的另一个导入组件是 `AutoConfigurationImportSelector`，它本身是一个 `DeferredImportSelector`。

真正起作用的方法不是 `selectImports`，而是 `DeferredImportSelector` 接口的 `getImportGroup` 方法返回的类——`AutoConfigurationGroup`。

`getAutoConfigurationEntry` 方法是加载自动配置类的核心逻辑，其源码步骤稍多，不过主干逻辑只有三步：
1. 加载自动配置类
2. 移除被去掉的自动配置类
3. 封装 Entry 返回

加载自动配置类的动作就是利用 Spring Framework 的 SPI 机制，从 `spring.factories` 中提取出所有 `@EnableAutoConfiguration` 对应的配置值。

### 2.6.4 小结

- `@SpringBootApplication` 包含 `@ComponentScan` 注解，可以默认扫描当前包及其子包下的所有组件
- `@EnableAutoConfiguration` 中包含 `@AutoConfigurationPackage` 注解，可以记录下最外层根包的位置，以便第三方框架整合使用
- `@EnableAutoConfiguration` 导入的 `AutoConfigurationImportSelector` 可以利用 Spring Framework 的 SPI 机制加载所有自动配置类

---

## 2.7 WebMvc 场景下的自动装配原理

了解了 Spring Boot 的自动装配机制后，下面研究一个实际且常见的场景：当项目整合 Spring WebMvc 后 Spring Boot 的自动装配都做了什么。

在引入 `spring-boot-starter-web` 的依赖后，Spring Boot 会进行 WebMvc 环境的自动装配，处理的核心是一个叫作 `WebMvcAutoConfiguration` 的类。

### 2.7.1 WebMvcAutoConfiguration 的生效条件

`WebMvcAutoConfiguration` 生效需要满足以下条件：

1. **当前环境必须是 WebMvc（即 Servlet 环境）**：导入了 WebMvc 的依赖后，该条件默认生效
2. **类路径下必须有指定的类**：必须有 `Servlet`、`DispatcherServlet`、`WebMvcConfigurer` 这几个类
3. **项目中未自定义注册 `WebMvcConfigurationSupport`**：如果未自定义，才会使用自动配置

### 2.7.2 Servlet 容器的装配

`ServletWebServerFactoryAutoConfiguration` 是嵌入式 Servlet 容器的配置类。

它导入了几个关键组件：
- `BeanPostProcessorsRegistrar`
- `EmbeddedTomcat`
- `EmbeddedJetty`
- `EmbeddedUndertow`

#### EmbeddedTomcat、EmbeddedJetty 和 EmbeddedUndertow

这三个容器配置类的设计是类似的。以 `EmbeddedTomcat` 为例：

```java
@Configuration(proxyBeanMethods = false)
@ConditionalOnClass({Servlet.class, Tomcat.class, UpgradeProtocol.class})
@ConditionalOnMissingBean(value = ServletWebServerFactory.class, search = SearchStrategy.CURRENT)
static class EmbeddedTomcat {

    @Bean
    TomcatServletWebServerFactory tomcatServletWebServerFactory(
            ObjectProvider<TomcatConnectorCustomizer> connectorCustomizers,
            ObjectProvider<TomcatContextCustomizer> contextCustomizers,
            ObjectProvider<TomcatProtocolHandlerCustomizer<?>> protocolHandlerCustomizers) {

        TomcatServletWebServerFactory factory = new TomcatServletWebServerFactory();
        // ... 定制化配置
        return factory;
    }
}
```

`EmbeddedTomcat` 上标注的 `@ConditionalOnClass` 注解确保了只有在当前项目的类路径下包含 Tomcat 类时，当前配置类才会生效。

### 2.7.3 DispatcherServlet 的装配

`DispatcherServlet` 的注册是通过 `DispatcherServletAutoConfiguration` 来完成的，它包含两个内部类：

1. **DispatcherServletConfiguration**：负责注册 `DispatcherServlet` 本身
2. **DispatcherServletRegistrationConfiguration**：负责将 `DispatcherServlet` 注册到 Web 容器中

```java
@Bean(name = DEFAULT_DISPATCHER_SERVLET_BEAN_NAME)
public DispatcherServlet dispatcherServlet(WebMvcProperties webMvcProperties) {
    DispatcherServlet dispatcherServlet = new DispatcherServlet();
    // DispatcherServlet 的定制化
    return dispatcherServlet;
}
```

### 2.7.4 SpringWebMvc 的装配

嵌入式 Web 容器和 DispatcherServlet 都装配完成后，最后是 WebMvc 的装配。这部分的主要装配内容都集中在 `WebMvcAutoConfiguration` 的两个内部类中：

1. **WebMvcAutoConfigurationAdapter**：一个以 WebMvc 配置为主的配置器，重写了 WebMvcConfigurer 的大量方法
2. **EnableWebMvcConfiguration**：注册了很多 WebMvc 会用到的核心组件

#### WebMvcAutoConfigurationAdapter 的主要配置

1. **配置 HttpMessageConverter**：配置默认的 `HttpMessageConverter`，用于处理 `@RequestBody` 和 `@ResponseBody`
2. **配置异步支持**：配置异步请求的支持，默认准备好了一个异步线程池
3. **注册视图解析器**：注册 `InternalResourceViewResolver` 和 `ContentNegotiatingViewResolver`
4. **国际化支持**：注册 `LocaleResolver`
5. **RequestContextHolder 的支持**：注册 `RequestContextFilter`

#### EnableWebMvcConfiguration 的主要组件

1. **注册 HandlerMapping**：注册 `RequestMappingHandlerMapping`
2. **注册 HandlerAdapter**：注册 `RequestMappingHandlerAdapter`
3. **静态资源加载配置**：配置几个常用的静态文件的存放位置

---

## 2.8 小结

本章主要讲解了有关 Spring Boot 的核心特性：自动装配的机制和原理。模块装配、条件装配、SPI 机制是自动装配的实现基础，掌握基础的装配方式才能更好地理解自动装配的设计和内涵。后续通过 WebMvc 场景的自动装配实例，进一步体会自动装配在具体场景中发挥的作用。
