# 第3章 Spring Boot 的 IOC 容器

## 3.1 Spring Framework 的 IOC 容器

### 3.1.1 BeanFactory

BeanFactory 是 Spring Framework 中 IOC 容器的底层实现，也是最基础的容器接口。它的设计理念是作为 Spring 容器的根接口，为依赖注入提供基础支撑。

#### BeanFactory 的核心特性

从 BeanFactory 的接口定义和文档注释中，我们可以总结出以下核心特性：

1. **基础容器**：BeanFactory 提供了管理 Bean 的最基本功能
2. **作用域概念**：支持定义 Bean 的作用域（如 singleton、prototype）
3. **环境配置集成**：集成了环境配置功能
4. **多种配置源支持**：支持从多种来源加载 Bean 定义
5. **层次性设计**：支持父子容器结构
6. **完整的生命周期控制**：支持 Bean 的初始化和销毁回调

#### HierarchicalBeanFactory

HierarchicalBeanFactory 是 BeanFactory 的子接口，它体现了容器的层次性设计。有了层次性特性，BeanFactory 就有了父子结构。

HierarchicalBeanFactory 接口中定义了 `getParentBeanFactory()` 方法，用于获取父级容器。这种设计使得子容器可以访问父容器中的 Bean，而父容器无法访问子容器中的 Bean。

**关键点**：当调用 BeanFactory 的 `getBean` 方法时，如果当前 BeanFactory 是具有层次性的，会从当前 BeanFactory 开始查找指定的 Bean，如果找不到，则继续向父级容器搜索。

#### ListableBeanFactory

ListableBeanFactory 实现了容器中所有 Bean 的枚举能力。与通过名称逐一查找不同，ListableBeanFactory 可以一次性获取容器中的所有 Bean 定义信息。

**注意事项**：
- 如果 ListableBeanFactory 同时也是 HierarchicalBeanFactory，那么返回值只与当前工厂中定义的 Bean 有关，不会考虑父工厂的层次结构
- `getBeanNamesForType` 和 `getBeansOfType` 方法会检查手动注册的单例
- 通过 `registerSingleton()` 方法注册的单例不会出现在 `getBeanDefinitionNames()` 返回的列表中

这种设计的原因：Spring Framework 内部使用 `registerSingleton` 注册了一些仅供内部使用的组件（如 Environment、SystemProperties 等），这些组件不希望被开发者直接访问，因此设计了这种"选择性列举"的机制。

#### AutowireCapableBeanFactory

AutowireCapableBeanFactory 提供了自动注入能力的支持。这个接口主要用于第三方框架与 Spring 集成时，对现有 Bean 实例进行依赖注入。

**典型使用场景**：
- 在自定义 Servlet 中注入 Spring 管理的 Bean
- 集成其他框架的组件到 Spring 容器中

**注意**：ApplicationContext 本身没有实现 AutowireCapableBeanFactory 接口，但可以通过 `ApplicationContext.getAutowireCapableBeanFactory()` 方法间接获取。

#### ConfigurableBeanFactory

ConfigurableBeanFactory 提供了"可写"的能力。当类名带有 Configurable 前缀时，意味着这个接口的行为包含"写"的动作，而去掉 Configurable 前缀的接口只有"读"的动作。

这种设计遵循了面向对象编程的原则：
- 提供 get 方法意味着属性可读
- 提供 set 方法意味着属性可写

#### AbstractBeanFactory

AbstractBeanFactory 是 BeanFactory 接口的第一个抽象实现类，具有最基础的功能。它可以：

- 提供单实例 Bean 的缓存（通过 DefaultSingletonBeanRegistry）
- 支持单实例/原型 Bean 的判定
- 处理 FactoryBean
- 存储 Bean 的别名
- 合并子 BeanDefinition
- 管理 Bean 的销毁（DisposableBean 接口，自定义 destroy 方法）
- 通过 HierarchicalBeanFactory 接口管理 BeanFactory 的层次结构

**关键模板方法**：
- `getBeanDefinition()`：获取 Bean 的定义信息
- `createBean()`：创建 Bean 实例

`createBean` 方法是 Spring Framework 能管控的所有 Bean 的创建入口。

#### AbstractAutowireCapableBeanFactory

AbstractAutowireCapableBeanFactory 实现了默认的 Bean 创建逻辑，具有以下核心功能：

- Bean 对象的创建（包含构造方法解析）
- 属性赋值
- 依赖注入和自动装配
- Bean 的初始化逻辑执行

**注意**：`createBean` 方法也不是最终实现 Bean 创建的方法，而是由 `doCreateBean` 方法实现的，它同样是 AbstractAutowireCapableBeanFactory 中的 protected 方法。

`resolveDependency` 方法用于解析 Bean 的成员中定义的属性依赖关系，在 DefaultListableBeanFactory 中有具体实现。

#### DefaultListableBeanFactory

DefaultListableBeanFactory 是 BeanFactory 最终的默认实现，也是唯一一个目前底层正在使用的 BeanFactory 落地实现。它实现了：

- ConfigurableListableBeanFactory 接口
- BeanDefinitionRegistry 接口

**设计理念**：在获取 Bean 之前，应该先把 Bean 的定义信息注册进去。完整的 BeanFactory 对 Bean 的管理应该是：先注册 Bean 的定义信息，再完成 Bean 的创建和初始化动作。

**单一职责**：BeanFactory 作为统一管理 Bean 组件的容器，核心工作是控制 Bean 在创建阶段的生命周期与 Bean 对象的统一管理。而 Bean 从哪里来、如何被创建、有哪些依赖要被注入，这些都与 BeanFactory 无关，而是由专门的组件来处理（包括 BeanDefinitionReader 等）。

### 3.1.2 ApplicationContext

ApplicationContext 是基于 BeanFactory 的扩展，提供了更为强大的特性。从类比角度来说：
- BeanFactory 类似一个简单的储物柜，只负责存放物品
- ApplicationContext 类似一个完整的办公系统，不仅能存放物品，还提供物品登记、借出记录、事件通知等多种服务

#### ApplicationContext 的核心功能

ApplicationContext 除了继承 BeanFactory 接口外，还额外继承了以下功能性接口：

1. **ListableBeanFactory**：继承自 ListableBeanFactory，具备列举容器中所有 Bean 的能力
2. **ResourceLoader**：提供加载文件资源的能力
3. **ApplicationEventPublisher**：提供事件发布能力
4. **MessageSource**：支持国际化（i18n）消息解析
5. **HierarchicalBeanFactory**：支持父子容器结构

#### ConfigurableApplicationContext

与 BeanFactory 和 ConfigurableBeanFactory 的关系类似，ConfigurableApplicationContext 为 ApplicationContext 提供了"可写"的功能。

扩展的方法包括：
- `setParent()`：设置父容器
- `setEnvironment()`：设置环境配置
- `addBeanFactoryPostProcessor()`：添加 BeanFactory 后置处理器
- `addApplicationListener()`：添加应用监听器

**设计原则**：配置和与生命周期相关的方法都封装在 ConfigurableApplicationContext 中，目的是避免暴露给 ApplicationContext 的调用者。ConfigurableApplicationContext 的方法仅应该由启动和关闭代码使用。

#### EnvironmentCapable

EnvironmentCapable 接口提供了获取 Environment 的能力。在 Spring Framework 中，如果接口名称以 Capable 结尾，通常意味着可以通过这个接口的某个特定方法（通常是 `getXxx()`）获取特定的组件。

EnvironmentCapable 与 ApplicationContext 的关系是：只要获取到 ApplicationContext 的实例，就可以借助这个接口获取到 Environment。如果是 ConfigurableApplicationContext，则可以获取到 ConfigurableEnvironment。

#### MessageSource

MessageSource 是国际化支持的组件。国际化是针对不同地区、不同国家的访问，提供了对应语言环境的描述。ApplicationContext 使用委托机制对国际化予以支持，内部整合了 MessageSource 的真正实现。

#### ApplicationEventPublisher

ApplicationEventPublisher 是事件发布器接口。Spring Framework 内部支持强大的事件监听机制，ApplicationContext 作为容器的顶层，自然也要实现观察者模式中广播器的角色。

Spring Framework 的事件驱动核心可以划分为 4 部分：
- **事件源**：发布事件的对象
- **事件**：事件源发布的信息/做出的动作
- **广播器**：事件真正广播给监听器的对象
- **监听器**：监听事件的对象

#### ResourcePatternResolver

ResourcePatternResolver 接口用于根据特定的路径解析资源文件。它是 ResourceLoader 的扩展，支持 Ant 形式的带星号（*）的路径匹配。

**Ant 风格的路径匹配示例**：
- `/WEB-INF/*.xml`：匹配 /WEB-INF 目录下的任意 XML 文件
- `/WEB-INF/**/beans-*.xml`：匹配 /WEB-INF 目录下任意层级目录的 beans- 开头的 XML 文件
- `/**/*.xml`：匹配任意 XML 文件

#### AbstractApplicationContext

AbstractApplicationContext 是 ApplicationContext 接口的抽象实现，它只是简单地实现了应用上下文的基本功能，并不强制约束配置的承载形式（XML、注解驱动等）。

**核心特性**：
- 使用模板方法设计模式，具体的实现由子类负责
- 与普通的 BeanFactory 相比，ApplicationContext 能够自动检测并注册特殊的 Bean（BeanFactoryPostProcessor、BeanPostProcessor、ApplicationListener）
- 实现了国际化接口 MessageSource
- 实现了事件广播器 ApplicationEventMulticaster

**重要方法**：`refresh()` 方法是控制 ApplicationContext 生命周期的核心方法，分为 13 个步骤，包含 Spring Framework 应用上下文的所有重要步骤处理。

#### GenericApplicationContext

GenericApplicationContext 是注解驱动 IOC 容器的第一个非抽象实现类。关键信息：

- 拥有一个内部的 DefaultListableBeanFactory 实例
- 实现了 BeanDefinitionRegistry 接口，允许将任何 Bean 定义读取器应用于该容器
- **重要限制**：由于内部的 BeanFactory 在构造方法中就已经初始化完毕，所以 refresh 只能调用一次

```java
public GenericApplicationContext() {
    this.beanFactory = new DefaultListableBeanFactory();
}

@Override
protected final void refreshBeanFactory() throws IllegalStateException {
    if (!this.refreshed.compareAndSet(false, true)) {
        throw new IllegalStateException(
            "GenericApplicationContext does not support multiple refresh attempts");
    }
}
```

#### AnnotationConfigApplicationContext

AnnotationConfigApplicationContext 是 Spring Framework 中常使用的注解驱动 IOC 容器，本身继承自 GenericApplicationContext。

**特点**：
- 接受组件类作为输入，特别是使用 `@Configuration` 注解的类
- 也接受普通的 `@Component` 类和符合 JSR-330 规范的类
- 允许使用 `register(Class<?>...)` 方法直接传入指定的配置类
- 允许使用 `scan(String...)` 方法进行类路径的包扫描
- 如果有多个 `@Configuration` 类，则在后面类中定义的 `@Bean` 方法将覆盖先前类中定义的方法

#### AbstractRefreshableApplicationContext

与 GenericApplicationContext 不同，AbstractRefreshableApplicationContext 支持重复刷新。这种设计主要用于基于 XML 配置文件驱动的 IOC 容器。

在 Spring Boot 中，由于已经完全转向注解驱动，这种基于 XML 的实现类已经不再使用。

### 3.1.3 选择 ApplicationContext 而不是 BeanFactory

根据 Spring Framework 官方文档的建议：

> You should use an ApplicationContext unless you have a good reason for not doing so.

**BeanFactory 与 ApplicationContext 的特性对比**：

| 特性 | BeanFactory | ApplicationContext |
|------|-------------|---------------------|
| Bean 实例化和属性注入 | 是 | 是 |
| 生命周期管理 | 否 | 是 |
| 自动 BeanPostProcessor 注册 | 否 | 是 |
| 自动 BeanFactoryPostProcessor 注册 | 否 | 是 |
| 消息转换服务（国际化） | 否 | 是 |
| 内置事件发布机制 | 否 | 是 |

从表中可见，ApplicationContext 相比 BeanFactory 功能更强大，这也是日常开发中都使用 ApplicationContext 而很少接触 BeanFactory 的原因。

## 3.2 Spring Boot 对 IOC 容器的扩展

Spring Boot 本身并没有直接利用 Spring Framework 现有的 IOC 容器，而是针对嵌入式 Web 容器的核心特性扩展了更强大的 IOC 容器。

### 3.2.1 WebServerApplicationContext

WebServerApplicationContext 是 Spring Boot 2.x 在 ApplicationContext 基础上扩展的接口，用于支持和管理嵌入式 Web 容器。

**核心方法**：
```java
public interface WebServerApplicationContext extends ApplicationContext {
    WebServer getWebServer();
}
```

`getWebServer()` 方法可以获取当前应用的嵌入式 Web 容器实例。这意味着 Spring Boot 中的 ApplicationContext 可以获取正在运行的 Web 容器。

### 3.2.2 AnnotationConfigServletWebServerApplicationContext

这是 Spring Boot 最常见的 IOC 容器最终落地实现，用于 Spring Boot 整合 WebMvc 场景。

**命名解读**：
- `AnnotationConfig`：注解驱动
- `Servlet`：基于 Servlet 环境
- `WebServer`：支持嵌入式 Web 容器
- `ApplicationContext`：应用上下文

**设计特点**：
- 继承了 GenericWebApplicationContext
- 组合了嵌入式容器 WebServer 对象以及 ServletConfig 配置对象
- 具有创建嵌入式容器的逻辑

### 3.2.3 ReactiveWebApplicationContext

Spring Boot 2.x 基于 Spring Framework 5.x，而 5.x 引入了 WebFlux 模块。因此 Spring Boot 也扩展了 Reactive 环境的 ApplicationContext 支持：

- ReactiveWebServerApplicationContext
- GenericReactiveWebApplicationContext
- AnnotationConfigReactiveWebServerApplicationContext

两种环境下的 IOC 容器设计差距不大，如果充分掌握了 Servlet 环境下的 IOC 容器实现，Reactive 环境下的实现也很好理解。

## 3.3 选用注解驱动 IOC 容器的原因

### 3.3.1 配置方式的对比

**历史背景**：
- Spring Framework 早期只能使用 XML 配置文件的方式驱动 IOC 容器
- Spring Framework 3.x 开始支持注解驱动配置

**XML 配置文件的特点**：
- 修改灵活，无须重新编译
- 可以反复刷新加载配置文件
- 但整合具体场景制作启动器时，灵活性优势会荡然无存

**注解配置类的特点**：
- 支持模块装配、条件装配、SPI 机制等高级特性
- 可以与自定义配置间配合协作
- 只能加载一次，无法反复刷新

**配置内容的编写对比**：
- XML 配置文件需要符合相关规范，扩展性受限
- 注解配置类更灵活，可以根据不同场景的要求注册不同类型的组件

### 3.3.2 约定大于配置下的选择

Spring Boot 的核心设计理念之一是"约定大于配置"。基于这种设计：

- XML 配置文件方式虽然灵活，但在制作启动器时优势不明显
- 注解配置方式支持模块装配、条件装配、SPI 机制等高级特性
- 这些高级特性可以与项目中的自定义配置相互配合，即实现了约定大于配置

因此，Spring Boot 推荐使用注解驱动的配置方式。

## 3.4 Environment

### 3.4.1 Environment 概述

Environment 是从 Spring Framework 3.1 开始引入的抽象模型，包含 Profile 与 Property 配置的信息，可以实现统一的配置存储和注入、配置属性的解析等行为。

#### Profile

Profile 实现了基于模式的环境配置（即条件装配）。Environment 本身就组合了 Profile 的特性，用于区分不同的环境模式。根据不同的环境模式，Spring Framework 可以装配特定的 Bean 对象（以及配置属性的注入）。

#### Property

Property 作为键值对形式的数据结构，非常适合存储配置信息。通过 `@PropertySource` 注解或 `<context:property-placeholder>` 标签，可以将 Property 文件导入 IOC 容器中。导入配置后，最终解析配置项、给 Bean 组件注入属性值的行为都由 Environment 负责。

### 3.4.2 Environment 的结构与设计

#### PropertyResolver

PropertyResolver 是一个属性解析器，可以处理 XML 配置文件、注解配置类、普通 Bean 中用到的 `${}` 属性配置占位符。

**核心功能**：
- 配置属性的获取
- 占位符的解析

```java
public interface PropertyResolver {
    boolean containsProperty(String key);
    String getProperty(String key);
    String getProperty(String key, String defaultValue);
    <T> T getProperty(String key, Class<T> targetType);
    String resolvePlaceholders(String text);
}
```

#### ConfigurableEnvironment

ConfigurableEnvironment 继承了 Environment 和 ConfigurablePropertyResolver 接口，提供了可配置的能力。

```java
public interface ConfigurableEnvironment extends Environment, ConfigurablePropertyResolver {
    void setActiveProfiles(String... profiles);
    void addActiveProfile(String profile);
    void setDefaultProfiles(String... defaultProfiles);
    MutablePropertySources getPropertySources();
}
```

**MutablePropertySources** 内部使用 List 封装了多个 PropertySource 对象：
```java
public class MutablePropertySources implements PropertySources {
    private final List<PropertySource<?>> propertySourceList = new CopyOnWriteArrayList<>();
}
```

**概念解释**：一个 PropertySource 对象对应了一个配置源，可能来自：
- Property 文件
- 系统环境变量
- 项目信息
- 自定义的加载方式（如数据库）

不管来自哪里，最终都会封装为键值对的形式存储在 PropertySource 对象中，统一由 Environment 管理。

#### AbstractEnvironment

AbstractEnvironment 是所有 Environment 落地实现的父类。

```java
public abstract class AbstractEnvironment implements ConfigurableEnvironment {
    private final Set<String> activeProfiles = new LinkedHashSet<>();
    private final Set<String> defaultProfiles = new LinkedHashSet<>();
    private final MutablePropertySources propertySources = new MutablePropertySources();
    private final ConfigurablePropertyResolver propertyResolver =
        new PropertySourcesPropertyResolver(this.propertySources);
}
```

**设计模式**：AbstractEnvironment 中组合了 PropertySourcesPropertyResolver，所有 PropertyResolver 接口下的方法工作都交由它完成，这种设计称为"委派"。

### 3.4.3 Environment 与 IOC 容器的关系

**核心结论**：

1. **Environment 中包含 Profile 和 Property**，这些配置信息会影响 IOC 容器中的 Bean 的注册与创建

2. **Environment 是在 ApplicationContext 创建后才创建的**，Environment 应该伴随着 ApplicationContext 的存在而存在

3. **ApplicationContext 中同时包含 Environment 和普通的 Bean 组件对象**，从 BeanFactory 的视角来看，Environment 也是一个 Bean，只不过它的地位比较特殊

**结构关系图**：
```
ApplicationContext
├── Environment
│   ├── Profile（环境配置）
│   └── Property（配置属性）
└── Bean 组件
```

## 3.5 BeanDefinition

### 3.5.1 理解元信息

**元信息概念**：元信息是描述数据的数据，在 Spring Framework 中可以理解为"定义的定义"。

**示例**：
- 张三的属性：name、age、sex
- 猫的属性：name、type、color

**更深入的理解**：类也有元信息。Class 这个类中就包含一个类的所有定义（属性、方法、继承实现、注解等）。所以 Class 中包含类的元信息。

既然对象、类都有自己的元信息，IOC 容器中的 Bean 对象自然也有，描述 Bean 的元信息的模型就是 BeanDefinition。

### 3.5.2 BeanDefinition 概述

BeanDefinition 描述了 Spring Framework 中 Bean 的元信息，包含：

- **Bean 的类信息**：全限定类名（beanClassName）
- **Bean 的属性**：作用域（scope）、是否默认 Bean（primary）、描述信息（description）等
- **Bean 的行为特性**：是否延迟加载（lazy）、是否自动注入（autowireCandidate）、初始化/销毁方法等
- **Bean 与其他 Bean 的关系**：父 Bean 名称（parentName）、依赖的 Bean（dependsOn）等
- **Bean 的配置属性**：构造方法参数（constructorArgumentValues）、属性变量值（propertyValues）等

BeanDefinition 几乎能把 Bean 的所有信息收集并封装起来，非常全面。

### 3.5.3 BeanDefinition 的结构与设计

#### AttributeAccessor

AttributeAccessor 类名直译为"属性访问器"，与 Map 有些相似（都有 get、set、remove、contains 等操作）：

```java
public interface AttributeAccessor {
    void setAttribute(String name, Object value);
    Object getAttribute(String name);
    Object removeAttribute(String name);
    boolean hasAttribute(String name);
    String[] attributeNames();
}
```

BeanDefinition 继承自 AttributeAccessor 接口，具有配置 Bean 属性的功能。

#### BeanMetadataElement

BeanMetadataElement 作为 BeanDefinition 的另一个父接口，类名直译为存放 Bean 的元信息的元素。这个接口只有一个方法，用于获取 Bean 的资源来源：

```java
public interface BeanMetadataElement {
    default Object getSource() {
        return null;
    }
}
```

资源来源就是 Bean 的文件/URL 路径。一般情况下项目中所有注册到 IOC 容器中的 Bean 都是从本地磁盘上的 .class 文件加载进来的，所以此处获取的其实是一个 Resource 对象。

#### AbstractBeanDefinition

AbstractBeanDefinition 是 BeanDefinition 的基本抽象实现，剔除了 GenericBeanDefinition、RootBeanDefinition 和 ChildBeanDefinition 的共有属性。

**核心成员**：
```java
public abstract class AbstractBeanDefinition {
    private volatile Object beanClass;
    private String scope = SCOPE_DEFAULT;
    private boolean abstractFlag = false;
    private Boolean lazyInit;
    private boolean primary = false;
    private ConstructorArgumentValues constructorArgumentValues;
    private MutablePropertyValues propertyValues;
    private String initMethodName;
    private String destroyMethodName;
    private Resource resource;
}
```

#### GenericBeanDefinition

GenericBeanDefinition 是 AbstractBeanDefinition 的非抽象扩展，只比父类多了一个 `parentName` 属性。

**特点**：
- 具有一般性
- 具有层次性（通过 parentName）

#### ChildBeanDefinition

ChildBeanDefinition 一定是子定义信息，也有 parentName 的内部成员。它只有一个带 parentName 参数的构造方法。

#### RootBeanDefinition

RootBeanDefinition 类名中有"根"的概念，意味着它只能作单独的 BeanDefinition 或者父 BeanDefinition 出现（不能继承其他 BeanDefinition）。

**扩展信息**：
- id 和别名
- 注解信息
- 工厂相关信息（是否为工厂 Bean）
- 工厂方法返回类型
- 工厂 Bean 对应的方法引用

### 3.5.4 体会 BeanDefinition

#### 基于组件扫描的 BeanDefinition

使用 `@Component` + 组件扫描的方式，扫描到的每个类都相当于构建了一个 BeanDefinition。

```java
@Component
public class Person {
    private String name;
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}
```

通过 AnnotationConfigApplicationContext 可以扫描并获取 BeanDefinition 信息：

```java
public class ComponentScanBeanDefinitionApplication {
    public static void main(String[] args) {
        AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext(
            "com.example.bean");
        BeanDefinition personBeanDefinition = ctx.getBeanDefinition("person");
        System.out.println(personBeanDefinition);
        System.out.println(personBeanDefinition.getClass().getName());
    }
}
```

**输出结果**：
- 类型：`ScannedGenericBeanDefinition`（GenericBeanDefinition 的派生类）
- Bean 的 className、scope 等信息都已被收集并封装

#### 基于 @Bean 的 BeanDefinition

通过 `@Configuration` + `@Bean` 的方式注册的 Bean，生成的 BeanDefinition 类型是 `ConfigurationClassBeanDefinition`（继承自 RootBeanDefinition）。

**主要区别**：
- BeanDefinition 类型是 RootBeanDefinition
- Bean 对象的 className 不见了（因为通过工厂方法创建）
- 自动注入模式为 AUTOWIRE_CONSTRUCTOR
- 有 factoryBean 属性和 factoryMethodName

**底层区别**：
- 组件扫描方式：通过 `ClassPathBeanDefinitionScanner` 扫描，调用 `doScan` 方法，创建 `ScannedGenericBeanDefinition`
- @Bean 方式：通过 `ConfigurationClassPostProcessor` 处理，调用 `processConfigBeanDefinitions` 方法，最终创建 `ConfigurationClassBeanDefinition`

### 3.5.5 BeanDefinitionRegistry

BeanDefinitionRegistry 是维护 BeanDefinition 的注册中心，内部存放了 IOC 容器中 Bean 的定义信息。

**核心实现**（来自 DefaultListableBeanFactory）：
```java
private final Map<String, BeanDefinition> beanDefinitionMap = new ConcurrentHashMap<>(256);
```

**三个核心方法**（对应增删查）：
```java
void registerBeanDefinition(String beanName, BeanDefinition beanDefinition)
    throws BeanDefinitionStoreException;
void removeBeanDefinition(String beanName) throws NoSuchBeanDefinitionException;
BeanDefinition getBeanDefinition(String beanName) throws NoSuchBeanDefinitionException;
```

**重要结论**：DefaultListableBeanFactory 不仅是 Bean 对象的统一管理容器，而且是 BeanDefinition 的统一管理容器。

### 3.5.6 设计 BeanDefinition 的意义

**为什么 Spring Framework 要设计 BeanDefinition？**

如果没有 BeanDefinition，直接创建 Bean 对象放入 IOC 容器的设计虽然简单，但会面临以下问题：

1. **管理机制过于简单**：无法应对各种复杂的场景
2. **无法进行特殊处理**：如 AOP 代理、事务增强支持等

**BeanDefinition 的设计意义**：
- 比较接近面向对象开发中先编写 Class 类，再 new 出对象
- 将 Bean 的定义抽取为统一类型/格式的模型
- 可以在后续的 Bean 对象管理时进行统一管理
- 可以对特定的 Bean 进行特殊化处理

换一种更简单的说法：有了定义信息，按照既定的规则，就可以任意解析生成 Bean 对象，也可以根据实际需求对解析和生成对象的过程进行任意扩展。

## 3.6 后置处理器

### 3.6.1 理解后置处理器

Spring Framework 中设计的后置处理器主要分为两种类型：

1. **BeanPostProcessor**：针对 Bean 对象的后置处理器
2. **BeanFactoryPostProcessor**：针对 BeanDefinition 的后置处理器

**切入时机**：
- BeanPostProcessor：切入的时机是在 Bean 对象的初始化阶段前后添加自定义处理逻辑
- BeanFactoryPostProcessor：切入的时机是在 IOC 容器的生命周期中，所有 BeanDefinition 都注册到 BeanDefinitionRegistry 后切入回调，主要工作是访问/修改已经存在的 BeanDefinition

### 3.6.2 BeanPostProcessor

BeanPostProcessor 是针对 Bean 对象的后置处理器，接口定义：

```java
public interface BeanPostProcessor {
    default Object postProcessBeforeInitialization(Object bean, String beanName)
            throws BeansException {
        return bean;
    }

    default Object postProcessAfterInitialization(Object bean, String beanName)
            throws BeansException {
        return bean;
    }
}
```

**方法说明**：
- `postProcessBeforeInitialization`：在任何 Bean 对象的初始化回调逻辑之前执行
- `postProcessAfterInitialization`：在任何 Bean 对象的初始化回调逻辑之后执行

**初始化回调逻辑包括**：
1. `@PostConstruct` 注解标注的方法
2. `InitializingBean.afterPropertiesSet()`
3. 自定义的 init-method

### 3.6.3 BeanPostProcessor 的扩展

#### InstantiationAwareBeanPostProcessor

InstantiationAwareBeanPostProcessor 会干预对象的实例化阶段，会拦截并替换 Bean 对象的默认实例化动作，也会拦截 Bean 对象的属性注入和自动装配。

**扩展的三个方法**：
```java
default Object postProcessBeforeInstantiation(Class<?> beanClass, String beanName)
        throws BeansException {
    return null;
}

default boolean postProcessAfterInstantiation(Object bean, String beanName)
        throws BeansException {
    return true;
}

default PropertyValues postProcessProperties(PropertyValues pvs, Object bean,
        String beanName) throws BeansException {
    return null;
}
```

**方法说明**：
- `postProcessBeforeInstantiation`：在 Bean 实例化之前调用，可以返回代理对象
- `postProcessAfterInstantiation`：在 Bean 实例化之后调用，返回 false 可以跳过属性赋值
- `postProcessProperties`：在属性赋值之前处理 PropertyValues

#### DestructionAwareBeanPostProcessor

 DestructionAwareBeanPostProcessor 切入的时机是 Bean 对象的销毁阶段。当 IOC 容器关闭时，会先销毁容器中的所有单实例 Bean，在这个过程中会回调所有 DestructionAwareBeanPostProcessor 类型的后置处理器来干预。

**使用场景**：监听器的引用释放回调。由于 ApplicationContext 中会注册一些 ApplicationListener，而这些 ApplicationListener 与 ApplicationContext 互相依赖，因此在 IOC 容器销毁之前，需要将这些引用断开。

#### MergedBeanDefinitionPostProcessor

MergedBeanDefinitionPostProcessor 负责处理 BeanDefinition 的合并。如果向 IOC 容器中注册的 Bean 是一个有父类的派生类，那么 Spring Framework 在收集 Bean 中的信息时，不仅要收集当前类，还要收集它的父类。

**关键方法**：
```java
void postProcessMergedBeanDefinition(RootBeanDefinition beanDefinition,
        Class<?> beanType, String beanName);
```

**重要实现**：AutowiredAnnotationBeanPostProcessor，负责给 Bean 实现基于注解的自动注入（@Autowired、@Resource、@Inject 等）。

### 3.6.4 BeanFactoryPostProcessor

BeanFactoryPostProcessor 是针对 BeanDefinition 的后置处理器。它的特点是：

- 可以在 Bean 对象的初始化之前修改 Bean 的定义信息
- 可以对原有的 BeanDefinition 进行修改
- 所有 Bean 在没有实例化之前都是以 BeanDefinition 的形式存在的

```java
void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory)
        throws BeansException;
```

**执行时机**：在标准初始化之后修改 ApplicationContext 内部的 BeanFactory。在 BeanFactoryPostProcessor 触发时，所有 BeanDefinition 都已经被加载，但此时还没有实例化任何 Bean 对象。

### 3.6.5 BeanDefinitionRegistryPostProcessor

BeanDefinitionRegistryPostProcessor 是针对 BeanDefinitionRegistry 的后置处理器，执行时机比 BeanFactoryPostProcessor 更早。

**核心能力**：
- 可以在 BeanFactoryPostProcessor 处理 BeanDefinition 之前向 BeanFactory 注册新的 BeanDefinition
- 甚至可以注册新的 BeanFactoryPostProcessor 用于下一阶段的回调

```java
void postProcessBeanDefinitionRegistry(BeanDefinitionRegistry registry)
        throws BeansException;
```

**注意**：由于实现了 BeanDefinitionRegistryPostProcessor 的类同时也实现了 BeanFactoryPostProcessor 的 `postProcessBeanFactory` 方法，因此在执行完所有 BeanDefinitionRegistryPostProcessor 的接口方法后，会立即执行这些类的 `postProcessBeanFactory` 方法，之后再执行那些普通的只实现了 BeanFactoryPostProcessor 的 `postProcessBeanFactory` 方法。

### 3.6.6 后置处理器对比

| 对比项 | BeanPostProcessor | BeanFactoryPostProcessor | BeanDefinitionRegistryPostProcessor |
|--------|-------------------|-------------------------|-------------------------------------|
| 处理目标 | Bean 对象 | BeanDefinition | BeanDefinition |
| 执行时机 | Bean 对象的初始化阶段前后（已创建 Bean 对象） | BeanDefinition 解析完毕并注册进 BeanFactory 之后（Bean 对象未实例化） | BeanDefinition 解析完毕但还没有被 BeanFactoryPostProcessor 处理 |
| 可操作空间 | 给 Bean 对象的属性赋值、创建代理对象等 | 在 BeanDefinition 中增删属性、移除 BeanDefinition 等 | 向 BeanFactory 中注册新的 BeanDefinition |

## 3.7 IOC 容器的启动流程

ApplicationContext 的启动核心是内部的 `refresh()` 方法。这个初始化动作非常复杂，但在了解 IOC 容器之前，如果先对内部的初始化机制有一个整体的认识，后续学习 IOC 容器的生命周期时就不会手足无措。

### AbstractApplicationContext 的 refresh 方法

```java
public void refresh() throws BeansException, IllegalStateException {
    synchronized (this.startupShutdownMonitor) {
        // 1. 初始化前的预处理
        prepareRefresh();

        // 2. 获取 BeanFactory，加载所有 Bean 的定义信息（未实例化）
        ConfigurableListableBeanFactory beanFactory = obtainFreshBeanFactory();

        // 3. BeanFactory 的预处理配置
        prepareBeanFactory(beanFactory);

        try {
            // 4. 准备 BeanFactory 完成后进行的后置处理
            postProcessBeanFactory(beanFactory);

            // 5. 执行 BeanFactory 创建后的后置处理器
            invokeBeanFactoryPostProcessors(beanFactory);

            // 6. 注册 Bean 的后置处理器
            registerBeanPostProcessors(beanFactory);

            // 7. 初始化 MessageSource
            initMessageSource();

            // 8. 初始化事件广播器
            initApplicationEventMulticaster();

            // 9. 子类的多态 onRefresh 细节
            onRefresh();

            // 10. 注册监听器
            registerListeners();

            // 11. 初始化所有剩下的单实例 Bean
            finishBeanFactoryInitialization(beanFactory);

            // 12. 完成容器的创建工作
            finishRefresh();

        } finally {
            // 13. 清除缓存
            resetCommonCaches();
        }
    }
}
```

### 各步骤详解

#### 1. prepareRefresh - 初始化前的预处理

大多数的动作都是前置性准备，包含切换 IOC 容器启动状态、初始化属性配置、属性校验、早期事件容器准备等动作。

#### 2. obtainFreshBeanFactory - 初始化 BeanFactory

该步骤在不同的 ApplicationContext 落地实现中行为不同：

- **基于注解配置类的 ApplicationContext**（如 GenericApplicationContext）：在 refreshBeanFactory 方法中有一个 CAS 判断的动作，控制 GenericApplicationContext 不能反复刷新
- **基于 XML 配置文件的 ApplicationContext**：在该步骤会解析 XML 配置文件，封装 BeanDefinition 注册到 BeanDefinitionRegistry 中

**结论**：基于 XML 配置文件的 ApplicationContext 可以反复刷新，基于注解配置类的 ApplicationContext 只能刷新一次。

#### 3. prepareBeanFactory - BeanFactory 的预处理动作

主要包含三件事情：

1. **设置默认组件**：类加载器、表达式解析器等，并注册 Environment 抽象（Environment 也是 IOC 容器中的一个 Bean）
2. **编程式注册 ApplicationContextAwareProcessor**：用于支持 6 个 Aware 回调注入接口（包含 EnvironmentAware、ApplicationContextAware 在内的 6 个 Aware 系列接口）
3. **绑定依赖注入映射**：当其他 Bean 需要注入 BeanFactory 时，IOC 容器会自动将当前正在处理的 BeanFactory 注入；当其他 Bean 需要注入 ApplicationContext 时，IOC 容器会自动将自身注入

#### 4. postProcessBeanFactory - BeanFactory 的后置处理

这个方法本身是一个模板方法，在 AbstractApplicationContext 中没有具体实现，在基于 Web 环境的 ApplicationContext 实现 GenericWebApplicationContext 中有扩展行为：

- 编程式注册 ServletContextAwareProcessor，用于支持 ServletContext 的回调注入
- 注册新的 Bean 的作用域（request、session、application），并关联绑定 ServletRequest、ServletResponse 等多个类型的依赖注入映射
- 注册 ServletContext、ServletConfig 对象到 IOC 容器中

在 Spring Boot 的支持嵌入式容器的 ServletWebServerApplicationContext 实现基类中，主要变化是没有注册 application 作用域（因为此时嵌入式 Web 容器还没有初始化，没有 ServletContext 可获取）。

#### 5. invokeBeanFactoryPostProcessors - 执行 BeanFactoryPostProcessor

该步骤会回调执行所有的 BeanDefinitionRegistryPostProcessor 和 BeanFactoryPostProcessor：

- **BeanDefinitionRegistryPostProcessor** 的主要工作是：对 BeanDefinitionRegistry 中存放的 BeanDefinition 进行处理（可以注册新的 BeanDefinition，也可以移除现有的 BeanDefinition），典型实现是 ConfigurationClassPostProcessor
- **BeanFactoryPostProcessor** 的主要工作是对 BeanDefinitionRegistry 中现有的 BeanDefinition 进行修改操作（注意只限于修改，原则上不允许再注册新的/移除现有的 BeanDefinition），执行时机较 BeanDefinitionRegistryPostProcessor 更晚

回调这两种后置处理器涉及的核心里是组件扫描、注解配置类解析。

#### 6. registerBeanPostProcessors - 初始化 BeanPostProcessor

该步骤会初始化所有注册的 BeanPostProcessor。BeanPostProcessor 是针对 Bean 的生命周期流程中的重要扩展点，可以干预 Bean 对象的实例化、初始化等过程。典型的体现是给初始化好的对象织入 AOP 增强逻辑。

当前步骤初始化 BeanPostProcessor 时，容器中还没有初始化任何业务相关的 Bean 对象，所以后续初始化的所有 Bean 对象都会经过 BeanPostProcessor 的干预。

#### 7. initMessageSource - 初始化国际化组件

该步骤会初始化默认的国际化组件 MessageSource，默认的实现类是 DelegatingMessageSource，在不作任何附加配置的情况下不会处理任何国际化能力。

#### 8. initApplicationEventMulticaster - 初始化事件广播器

该步骤默认会初始化一个 ApplicationEventMulticaster 的简单实现 SimpleApplicationEventMulticaster 并注册到 IOC 容器中。

ApplicationContext 本身具备的事件广播能力是依赖 ApplicationEventMulticaster 实现的（功能组合的体现）。

#### 9. onRefresh - 子类扩展的刷新动作

该方法也是一个模板方法，默认 Spring Framework 范围的 ApplicationContext 实现没有做什么。

Spring Boot 中支持嵌入式 Web 容器的 ApplicationContext 在此处有扩展，用于初始化嵌入式 Web 容器。

#### 10. registerListeners - 注册监听器

该步骤会将 BeanDefinitionRegistry 中注册的所有监听器（ApplicationListener）的 beanName 取出，绑定到事件广播器 ApplicationEventMulticaster 中。

只绑定 beanName 而不直接取出监听器对象的原因是：考虑到 ApplicationListener 作为 IOC 容器中的 Bean，应该放在一起统一创建和初始化（也就是下面 finishBeanFactoryInitialization 动作），目的是希望 BeanPostProcessor 有机会去干预它们。

#### 11. finishBeanFactoryInitialization - 初始化剩余的单实例 Bean

该步骤主要完成两件事：

1. 初始化用于类型转换和表达式的解析器（ConversionService 与 EmbeddedValueResolver）
2. 初始化所有非延迟加载的单实例 Bean 对象

该步骤执行完毕后，BeanFactory 的初始化工作结束。该步骤包含 Bean 对象的主要生命周期过程，内容很复杂。

#### 12. finishRefresh - 刷新后的动作

该步骤的工作相对比较零散，包含以下小动作：

- 清除资源缓存
- 初始化生命周期处理器
- 传播生命周期动作，回调所有 Lifecycle 类型 Bean 的 start 方法
- 广播 ContextRefreshedEvent 事件

#### 13. resetCommonCaches - 清除缓存

最后的步骤会清除一切无用的缓存，因为 IOC 容器的刷新工作已经完成，缓存也就没有用了。

---

纵观整个 refresh 方法，每个动作的职责都很清晰，而且非常有条理。这个过程中有对 BeanFactory 的处理，有对 ApplicationContext 的处理，有处理 BeanPostProcessor 的逻辑，有准备 ApplicationListener 的逻辑，最后初始化那些非延迟加载的单实例 Bean 对象。refresh 方法执行完毕后，也就宣告 ApplicationContext 初始化完成。

## 3.8 小结

本章主要讲解了 Spring Boot 的 IOC 容器 BeanFactory 与 ApplicationContext 的层次化设计，以及 Spring Boot 对 IOC 容器模型的扩展。

**主要内容**：

1. **BeanFactory 与 ApplicationContext**：介绍了 BeanFactory 的核心接口和实现类，以及 ApplicationContext 的扩展特性和选择依据

2. **Spring Boot 的扩展**：讲解了 WebServerApplicationContext 和 AnnotationConfigServletWebServerApplicationContext

3. **Environment**：阐述了 Environment 的概念，以及它与 IOC 容器的关系

4. **BeanDefinition**：深入分析了 BeanDefinition 的设计理念和结构，以及 BeanDefinitionRegistry 的作用

5. **后置处理器**：详细介绍了 BeanPostProcessor、BeanFactoryPostProcessor、BeanDefinitionRegistryPostProcessor 三种后置处理器的作用和区别

6. **IOC 容器启动流程**：通过 refresh 方法的 13 个步骤，整体把握了 IOC 容器的初始化过程

掌握整体的设计，对理解 Spring Boot 的整体流程把握非常重要，读者一定要仔细学习和探究。
