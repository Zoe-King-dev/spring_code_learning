# 第5章 Spring Boot 的 AOP 支持

本章介绍 Spring Boot 对 AOP 的支持，包括 AOP 术语回顾、Spring Boot 整合 AOP 的使用方法，以及核心组件 `@EnableAspectJAutoProxy`、`AspectJAutoProxyRegistrar` 和 `AnnotationAwareAspectJAutoProxyCreator` 的工作原理。

## 5.1 Spring Framework 的 AOP 回顾

在深入 Spring Boot 的 AOP 源码之前，先回顾 Spring Framework 阶段的核心 AOP 概念，这对于后续理解源码很有帮助。

### 5.1.1 AOP 术语

AOP（面向切面编程）的基本术语包含以下 8 个核心概念：

- **Target（目标对象）**：被代理的原对象，即需要被增强的对象。

- **Proxy（代理对象）**：经过代理后生成的对象。JDK 动态代理通过 `Proxy.newProxyInstance` 生成，CGlib 代理通过继承实现。

- **JoinPoint（连接点）**：目标对象的所属类中定义的所有方法，这些方法都可以被拦截。

- **Pointcut（切入点）**：被拦截、被增强的连接点。切入点与连接点是包含关系：切入点可以是 0 个或多个（甚至全部）连接点。

  **重要区别**：切入点一定是连接点，但连接点不一定是切入点。

- **Advice（通知）**：增强的逻辑，也就是增强的代码。通知分为多种类型（详见下一节）。

  关系公式：**Proxy（代理对象）= Target（目标对象）+ Advice（通知）**

- **Aspect（切面）**：切入点与通知组合之后形成的产物。

  关系公式：**Aspect（切面）= Pointcut（切入点）+ Advice（通知）**

  实际上，切面不仅包含通知，还有一个不常见的部分是引介（Introduction）。

- **Weaving（织入）**：将通知应用到目标对象，进而生成代理对象的过程。这个过程可以是编译期织入、类加载期织入或运行期织入。

- **Introduction（引介）**：针对类层面的增强，可以在不修改原有类的前提下，在运行期为原始类动态添加新的属性或方法。

### 5.1.2 通知类型

Spring Framework 支持 5 种通知类型，这些通知类型基于 AspectJ：

| 通知类型 | 说明 |
|---------|------|
| **Before（前置通知）** | 目标对象的方法调用之前触发 |
| **After（后置通知）** | 目标对象的方法调用之后触发 |
| **AfterReturning（返回通知）** | 目标对象的方法调用成功返回结果后触发 |
| **AfterThrowing（异常通知）** | 目标对象的方法运行中抛出异常后触发 |
| **Around（环绕通知）** | 编程式控制目标对象的方法调用 |

**注意**：AfterReturning 与 AfterThrowing 是互斥的。如果方法调用成功无异常，则会执行返回通知；如果方法抛出异常，则执行异常通知。

环绕通知是所有通知类型中操作范围最大的一种，因为它可以直接获取目标对象以及要执行的方法，所以可以在目标对象的方法调用前后任意扩展逻辑，甚至可以选择不调用目标对象的方法。

## 5.2 Spring Boot 使用 AOP

Spring Boot 整合 AOP 场景的步骤非常简单，只需两步即可开启基于注解驱动的 AOP：

1. 在项目依赖中导入 `spring-boot-starter-aop`
2. 在主启动类上标注 `@EnableAspectJAutoProxy` 注解

### 导入依赖并开启 AOP

```xml
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
```

```java
@EnableAspectJAutoProxy
@SpringBootApplication
public class SpringBootAopApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringBootAopApplication.class, args);
    }
}
```

### 编写切面类和组件

下面的示例演示了如何创建一个被增强的服务类和一个切面类：

```java
public class DemoService {

    public void save() {
        System.out.println("DemoService save run ....");
    }
}
```

```java
@Aspect
@Component
public class ServiceAspect {

    @Before("execution(public * com.example.demo.service.*.*(..))")
    public void beforePrint() {
        System.out.println("Service Aspect before advice run ...");
    }
}
```

### 测试 AOP 是否生效

可以通过主启动类获取 IOC 容器，提取出 DemoService 对象并调用其方法来验证 AOP 是否生效：

```java
public static void main(String[] args) {
    ApplicationContext ctx = SpringApplication.run(SpringBootAopApplication.class, args);
    ctx.getBean(DemoService.class).save();
}
```

运行主启动类，控制台输出两行内容，说明 Spring Boot 整合 AOP 场景成功：

```
Service Aspect before advice run ...
DemoService save run ....
```

## 5.3 AOP 的开关：@EnableAspectJAutoProxy

开启注解驱动 AOP 的核心是 `@EnableAspectJAutoProxy` 注解。

### 注解源码

```java
@Import(AspectJAutoProxyRegistrar.class)
public @interface EnableAspectJAutoProxy {

    boolean proxyTargetClass() default false;

    boolean exposeProxy() default false;
}
```

`@EnableAspectJAutoProxy` 包含两个属性：

- **proxyTargetClass**：是否直接代理目标类（强制使用 CGLib 代理），默认为 false（优先使用 JDK 动态代理）。

- **exposeProxy**：是否暴露当前线程的 AOP 上下文。开启后，可以通过 `AopContext.currentProxy()` 获取到当前的代理对象本身。

除了注解属性，`@EnableAspectJAutoProxy` 最重要的作用是使用 `@Import` 注解导入了一个 `AspectJAutoProxyRegistrar`。

## 5.3.1 AspectJAutoProxyRegistrar

从类名可以理解，它是基于 AspectJ 支持的自动代理注册器。根据 Javadoc 描述：

> Registers an AnnotationAwareAspectJAutoProxyCreator against the current BeanDefinitionRegistry as appropriate based on a given @EnableAspectJAutoProxy annotation.

基于给定的 `@EnableAspectJAutoProxy` 注解，在适当的位置向 `BeanDefinitionRegistry` 注册 `AnnotationAwareAspectJAutoProxyCreator`。

### 注册核心代理组件

```java
class AspectJAutoProxyRegistrar implements ImportBeanDefinitionRegistrar {

    @Override
    public void registerBeanDefinitions(AnnotationMetadata importingClassMetadata,
                                        BeanDefinitionRegistry registry) {
        // 注册新 BeanDefinition 的动作
        AopConfigUtils.registerAspectJAnnotationAutoProxyCreatorIfNecessary(registry);

        AnnotationAttributes enableAspectJAutoProxy =
            AnnotationAttributes.forImportableClass(importingClassMetadata,
                EnableAspectJAutoProxy.class);

        // 给 AnnotationAwareAspectJAutoProxyCreator 设置属性值
        if (enableAspectJAutoProxy != null) {
            if (enableAspectJAutoProxy.getBoolean("proxyTargetClass")) {
                AopConfigUtils.forceAutoProxyCreatorToUseClassProxying(registry);
            }
            if (enableAspectJAutoProxy.getBoolean("exposeProxy")) {
                AopConfigUtils.forceAutoProxyCreatorToExposeProxy(registry);
            }
        }
    }
}
```

**关键点分析**：

1. `AspectJAutoProxyRegistrar` 实现了 `ImportBeanDefinitionRegistrar` 接口，具备编程式注册新 BeanDefinition 的能力。

2. 核心逻辑是方法体中的第一行：`AopConfigUtils.registerAspectJAnnotationAutoProxyCreatorIfNecessary(registry)`。

3. 后续代码处理 `@EnableAspectJAutoProxy` 注解的属性，根据属性值决定是否强制使用 CGLib 代理或暴露代理对象。

### 注册核心代理创建器

`AopConfigUtils` 中定义了注册核心代理创建器的方法：

```java
public static BeanDefinition registerAspectJAnnotationAutoProxyCreatorIfNecessary(
        BeanDefinitionRegistry registry) {
    return registerAspectJAnnotationAutoProxyCreatorIfNecessary(registry, null);
}

public static BeanDefinition registerAspectJAnnotationAutoProxyCreatorIfNecessary(
        BeanDefinitionRegistry registry, @Nullable Object source) {
    return registerOrEscalateApcAsRequired(
        AnnotationAwareAspectJAutoProxyCreator.class, registry, source);
}

public static final String AUTO_PROXY_CREATOR_BEAN_NAME =
    "org.springframework.aop.config.internalAutoProxyCreator";

private static BeanDefinition registerOrEscalateApcAsRequired(
        Class<?> cls, BeanDefinitionRegistry registry, @Nullable Object source) {
    Assert.notNull(registry, "BeanDefinitionRegistry must not be null");

    if (registry.containsBeanDefinition(AUTO_PROXY_CREATOR_BEAN_NAME)) {
        BeanDefinition apcDefinition =
            registry.getBeanDefinition(AUTO_PROXY_CREATOR_BEAN_NAME);
        if (!cls.getName().equals(apcDefinition.getBeanClassName())) {
            int currentPriority = findPriorityForClass(apcDefinition.getBeanClassName());
            int requiredPriority = findPriorityForClass(cls);
            if (currentPriority < requiredPriority) {
                apcDefinition.setBeanClassName(cls.getName());
                return null;
            }
        }
        return null;
    }

    RootBeanDefinition beanDefinition = new RootBeanDefinition(cls);
    beanDefinition.setSource(source);
    beanDefinition.getPropertyValues().add("order", Ordered.HIGHEST_PRECEDENCE);
    beanDefinition.setRole(BeanDefinition.ROLE_INFRASTRUCTURE);
    registry.registerBeanDefinition(AUTO_PROXY_CREATOR_BEAN_NAME, beanDefinition);

    return beanDefinition;
}
```

**关键点分析**：

1. 方法中已经把 `AnnotationAwareAspectJAutoProxyCreator` 的字节码类型传入。

2. 在 `registerOrEscalateApcAsRequired` 中手动创建了 `RootBeanDefinition`，设置了最高级别的优先级（`Ordered.HIGHEST_PRECEDENCE`）和其他配置项。

3. 如果已存在同名的 AutoProxyCreator，会比较优先级，决定是否替换。

## 5.3.2 AnnotationAwareAspectJAutoProxyCreator

注册的核行动作本身没有太多研究价值，重点是 AOP 动态代理创建器本身。

### 类作用

根据 Javadoc 描述：

> AspectJAwareAdvisorAutoProxyCreator subclass that processes all AspectJ annotation aspects in the current application context, as well as Spring Advisors. Any AspectJ annotated classes will automatically be recognized, and their advice applied if Spring AOP's proxy-based model is capable of applying it.

`AnnotationAwareAspectJAutoProxyCreator` 是 `AspectJAwareAdvisorAutoProxyCreator` 的子类，用于处理当前 ApplicationContext 中的所有基于 AspectJ 注解的切面，以及 Spring 原生的 Advisor。

**核心能力**：

- 兼顾 AspectJ 风格的切面声明
- 支持 Spring Framework 原生的 AOP 编程
- 自动识别被 `@AspectJ` 注解标注的类，并应用其通知

### 继承结构

`AnnotationAwareAspectJAutoProxyCreator` 的继承结构中包含几个重要的接口：

- **BeanPostProcessor**：用于在 `postProcessAfterInitialization` 方法中生成代理对象。

- **InstantiationAwareBeanPostProcessor**：拦截 Bean 的正常 `doCreateBean` 创建流程。

- **SmartInstantiationAwareBeanPostProcessor**：提前预测 Bean 的类型、暴露 Bean 的引用（AOP、循环依赖等场景需要）。

- **AopInfrastructureBean**：实现了该接口的 Bean 永远不会被代理（防止反复被代理导致逻辑死循环）。

继承层次：

```
AbstractAutoProxyCreator
    └── AspectJAwareAdvisorAutoProxyCreator
            └── AnnotationAwareAspectJAutoProxyCreator
```

### 初始化时机

`AnnotationAwareAspectJAutoProxyCreator` 本身是一个后置处理器，后置处理器的初始化时机是在 `AbstractApplicationContext.refresh()` 的第 6 步 `registerBeanPostProcessors` 方法中：

```java
public void refresh() throws BeansException, IllegalStateException {
    synchronized (this.startupShutdownMonitor) {
        try {
            postProcessBeanFactory(beanFactory);
            invokeBeanFactoryPostProcessors(beanFactory);

            // 6. 注册、初始化 BeanPostProcessor
            registerBeanPostProcessors(beanFactory);

            initMessageSource();
            initApplicationEventMulticaster();
            // ...
        }
    }
}
```

**细节说明**：`AnnotationAwareAspectJAutoProxyCreator` 实现了 `Ordered` 接口，并且声明了最高优先级（`HIGHEST_PRECEDENCE`），这意味着它会提前于其他 BeanPostProcessor 创建，从而也会干预这些普通 BeanPostProcessor 的初始化（即也有可能被 AOP 代理增强）。

### 作用时机

与其他 BeanPostProcessor 相似，`AnnotationAwareAspectJAutoProxyCreator` 的作用时机是在 Bean 对象的初始化阶段介入处理，而代理对象的创建在初始化逻辑之后执行（即 `postProcessAfterInitialization`）。这是由于 Spring Framework 考虑到尽可能保证 Bean 的完整性：

```java
public Object postProcessAfterInitialization(@Nullable Object bean, String beanName) {
    if (bean != null) {
        Object cacheKey = getCacheKey(bean.getClass(), beanName);
        if (this.earlyProxyReferences.remove(cacheKey) != bean) {
            // 核心：构造代理
            return wrapIfNecessary(bean, beanName, cacheKey);
        }
    }
    return bean;
}
```

### 生成代理对象的主干逻辑

`wrapIfNecessary` 方法是生成代理对象的核心：

```java
protected Object wrapIfNecessary(Object bean, String beanName, Object cacheKey) {
    // 判断是否是目标源 bean
    if (StringUtils.hasLength(beanName) && this.targetSourcedBeans.contains(beanName)) {
        return bean;
    }

    // 判断是否不需要代理
    if (Boolean.FALSE.equals(this.advisedBeans.get(cacheKey))) {
        return bean;
    }

    // 判断是否是基础设施类或应该跳过的类
    if (isInfrastructureClass(bean.getClass()) || shouldSkip(bean.getClass(), beanName)) {
        this.advisedBeans.put(cacheKey, Boolean.FALSE);
        return bean;
    }

    // 如果上面的判断都没有成立，则决定是否需要创建代理对象
    Object[] specificInterceptors =
        getAdvicesAndAdvisorsForBean(bean.getClass(), beanName, null);
    if (specificInterceptors != DO_NOT_PROXY) {
        this.advisedBeans.put(cacheKey, Boolean.TRUE);
        // 创建代理对象的动作
        Object proxy = createProxy(bean.getClass(), beanName,
            specificInterceptors, new SingletonTargetSource(bean));
        this.proxyTypes.put(cacheKey, proxy.getClass());
        return proxy;
    }

    // 记录缓存
    this.advisedBeans.put(cacheKey, Boolean.FALSE);
    return bean;
}
```

**创建代理对象的三个核心步骤**：

1. **判断决定**：判断当前 Bean 是否是一个不会被增强的 Bean 对象。

2. **匹配增强器**：根据当前正在创建的 Bean 对象去匹配对应的增强器（Advisors）。

3. **创建代理**：如果匹配到增强器，则创建 Bean 对象的代理对象。

## 5.4 小结

本章主要回顾了 Spring Boot 对 AOP 的支持，初步了解了注解驱动 AOP 的核心组件与生效机制。

**核心要点**：

- `@EnableAspectJAutoProxy` 通过 `@Import` 导入 `AspectJAutoProxyRegistrar`
- `AspectJAutoProxyRegistrar` 负责注册 `AnnotationAwareAspectJAutoProxyCreator`
- `AnnotationAwareAspectJAutoProxyCreator` 是 AOP 的核心后置处理器，掌握其代理增强逻辑至关重要

关于创建代理对象的具体动作及细节，将在第 9 章生命周期 AOP 环节中详细讲解和剖析。

---

**第二部分预告**

Spring Boot 的生命周期原理分析

- 第 6 章 Spring Boot 准备容器与环境
- 第 7 章 IOC 容器的刷新
- 第 8 章 Spring Boot 容器刷新扩展：嵌入式 Web 容器
