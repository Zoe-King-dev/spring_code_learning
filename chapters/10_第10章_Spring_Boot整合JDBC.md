# 第10章 Spring Boot 整合JDBC

本章主要介绍 Spring Boot 整合 JDBC 的相关内容，包括 Spring Boot 项目创建后自动配置的组件、声明式事务的生效原理、控制全流程，以及事务传播行为的控制。

## 10.1 Spring Boot 项目创建与 JDBC 整合

在开始学习之前，读者需要先准备好一个 Spring Boot 整合 JDBC 的项目。如果已有项目，可以跳过本节；如果是初学者，建议先创建一个简单的 Spring Boot 项目，添加 JDBC 依赖和 MySQL 驱动依赖，然后运行项目确认正常。

## 10.2 自动配置：JDBC 整合后的组件装配

Spring Boot 整合 JDBC 后，会自动配置数据源、JdbcTemplate 以及事务管理器等核心组件。这些组件的自动配置是通过 Spring Boot 的自动配置机制完成的，开发者无需手动声明即可使用。

### 10.2.1 数据源的自动配置

Spring Boot 会根据配置文件（如 application.properties 或 application.yml）中的数据源配置信息，自动创建 DataSource 对象。默认情况下，如果引入的是 HikariCP 连接池，Spring Boot 会自动配置 HikariDataSource。

### 10.2.2 JdbcTemplate 的自动创建

自动配置的数据源会被 JdbcTemplate 组件使用，Spring Boot 会自动创建一个 JdbcTemplate Bean，开发者可以直接注入使用。

### 10.2.3 事务管理器的自动配置

整合 JDBC 后，Spring Boot 还会自动配置一个 DataSourceTransactionManager 作为默认的事务管理器。这个事务管理器负责管理数据源对应的事务，包括开启事务、提交事务、回滚事务等操作。

## 10.3 声明式事务的生效原理

声明式事务是指通过 `@Transactional` 注解声明事务控制的一种方式。本节将深入分析声明式事务的生效原理，涉及到几个核心的自动配置类和组件。

### 10.3.1 TransactionAutoConfiguration

TransactionAutoConfiguration 是事务自动配置的核心类，它封装了声明式事务启用所需的所有组件。当 Spring Boot 启动时，如果检测到 JDBC 整合，会自动触发这个配置类。

### 10.3.2 ConfigurationSelector 的选择机制

在 TransactionAutoConfiguration 中，有一个用于选择配置类的选择器。读者需要了解它是如何根据条件选择性地导入所需的配置类。

### 10.3.3 AutoProxyRegistrar 与代理创建器注册

AutoProxyRegistrar 负责注册 AOP 代理创建器相关的组件。具体来说，它会注册一个 InfrastructureAdvisorAutoProxyCreator 类型的代理创建器。

#### AopConfigUtils.registerAutoProxyCreatorIfNecessary 方法

AopConfigUtils.registerAutoProxyCreatorIfNecessary 方法用于注册 AOP 代理创建器。注册的核心组件类型是 InfrastructureAdvisorAutoProxyCreator，如代码清单 10-1 所示。

```java
public void registerBeanDefinitions(AnnotationMetadata importingClassMetadata,
        BeanDefinitionRegistry registry) {
    boolean candidateFound = false;
    Set<String> annTypes = importingClassMetadata.getAnnotationTypes();
    for (String annType : annTypes) {
        // 搜寻类上所有标注的注解，目的是找到 @EnableTransactionManagement
        AnnotationAttributes candidate = AnnotationConfigUtils.attributesFor(
                importingClassMetadata, annType);
        if (candidate == null) {
            continue;
        }
        // 获取注解上的 mode 和 proxyTargetClass 属性值
        Object mode = candidate.get("mode");
        Object proxyTargetClass = candidate.get("proxyTargetClass");
        if (mode != null && proxyTargetClass != null 
                && AdviceMode.class == mode.getClass() 
                && Boolean.class == proxyTargetClass.getClass()) {
            candidateFound = true;
            // 当 mode 为 PROXY 时，会注册额外的 BeanDefinition
            if (mode == AdviceMode.PROXY) {
                AopConfigUtils.registerAutoProxyCreatorIfNecessary(registry);
            }
            if ((Boolean) proxyTargetClass) {
                AopConfigUtils.forceAutoProxyCreatorToUseClassProxying(registry);
            }
        }
    }
}
```

#### InfrastructureAdvisorAutoProxyCreator 的特点

InfrastructureAdvisorAutoProxyCreator 与之前学习的 AOP 核心代理对象创建器 AnnotationAwareAspectJAutoProxyCreator 有些相似，它们的父类都是 AbstractAutoProxyCreator。两者的区别在于：InfrastructureAdvisorAutoProxyCreator 只会组合"基础类型"的增强器，而 AnnotationAwareAspectJAutoProxyCreator 可以处理所有类型的通知。

要理解"基础类型"这个概念，需要先了解 BeanDefinition 中定义的 3 种角色，如代码清单 10-2 所示。"基础类型"实际指的是 BeanDefinition 中的角色为 ROLE_INFRASTRUCTURE。

```java
public interface BeanDefinition {
    int ROLE_APPLICATION = 0;
    int ROLE_SUPPORT = 1;
    int ROLE_INFRASTRUCTURE = 2;
}
```

通常情况下，只有 Spring Framework 内部定义的 Bean 才可能被标注 ROLE_INFRASTRUCTURE 角色，而且这些 Bean 在应用程序中起到基础支撑的作用。

> **提示**：可能有读者会产生疑惑：如果 AOP 与事务在项目中同时存在，是否会导入两个代理对象创建器？答案是否定的。Spring Framework 在底层为两种代理对象创建器定义了优先级。当 AnnotationAwareAspectJAutoProxyCreator 先注册到 IOC 容器后再注册 InfrastructureAdvisorAutoProxyCreator 时，会比较两者的优先级。由于 AOP 的核心代理对象创建器可以处理所有角色的通知，因此它的优先级更高。在这种情况下，InfrastructureAdvisorAutoProxyCreator 就不会再注册。

### 10.3.4 ProxyTransactionManagementConfiguration

TransactionManagementConfigurationSelector 导入的另一个组件是 ProxyTransactionManagementConfiguration，它本身是一个配置类，其内部注册了 3 个与事务相关的核心组件。

#### 1. transactionAttributeSource：事务配置源

第一个注册的 Bean 类型为 TransactionAttributeSource。TransactionAttributeSource 接口在 Spring Framework 5.2 版本之前只有一个 getTransactionAttribute 方法。随着 Spring Framework 5.2 版本之后引入响应式事务控制，TransactionAttributeSource 接口才多了另一个 isCandidateClass 方法。不过这些细节不是需要重点关注的，getTransactionAttribute 方法才是重中之重。它可以将一个类+方法解析转换为 TransactionAttribute，而 TransactionAttribute 本身是 TransactionDefinition 的扩展。因此可以这样理解：TransactionAttributeSource 可以根据一个具体的类中的方法解析并转换为一个 TransactionDefinition。

借助 IDE 可以找到 TransactionAttributeSource 的几个实现类。实现类中包含了在配置类中创建的 AnnotationTransactionAttributeSource，如代码清单 10-3 所示。

```java
@Bean
@Role(BeanDefinition.ROLE_INFRASTRUCTURE)
public TransactionAttributeSource transactionAttributeSource() {
    return new AnnotationTransactionAttributeSource();
}

public interface TransactionAttributeSource {
    @Nullable
    TransactionAttribute getTransactionAttribute(Method method, 
            @Nullable Class<?> targetClass);
}
```

从 AnnotationTransactionAttributeSource 的 javadoc 中可以获取到关键信息：`This class reads Spring's JDK 1.5+ Transactional annotation`。这说明它解析事务信息的依据是读取 @Transactional 注解，这就是注解声明式事务的标注读取器。

#### 2. transactionInterceptor：事务拦截器

第二个注册的组件是事务切面的核心通知：TransactionInterceptor。它本身是一个 MethodInterceptor，通过之前的学习，我们知道 MethodInterceptor 接口是 AOP 增强的核心拦截器接口，利用 AOP 生成的代理对象中都会包含一组 MethodInterceptor 接口的实现类对象。

除此之外，TransactionInterceptor 还有一个父类 TransactionAspectSupport，这个父类中有一些与 Spring Framework 基础事务 API 的集成（如执行事务的核心方法 invokeWithinTransaction、创建事务、提交事务、回滚事务等）。

```java
@Bean
@Role(BeanDefinition.ROLE_INFRASTRUCTURE)
public TransactionInterceptor transactionInterceptor(
        TransactionAttributeSource attr) {
    TransactionInterceptor interceptor = new TransactionInterceptor();
    interceptor.setTransactionAttributeSource(attr);
    if (this.txManager != null) {
        interceptor.setTransactionManager(this.txManager);
    }
    return interceptor;
}
```

#### 3. transactionAdvisor：事务增强器

最后一个注册的组件是事务增强器。AOP 中除了有通知，还有一个核心要素就是增强器，它负责判断一个类或方法是否需要被增强并执行相应的事务控制。

注册的 BeanFactoryTransactionAttributeSourceAdvisor 从类名上看就是一个增强器，注意其内部组合了 TransactionInterceptor 事务拦截器和 TransactionAttributeSource 事务配置源，如代码清单 10-4 所示。

```java
@Bean(name = TransactionManagementConfigUtils.TRANSACTION_ADVISOR_BEAN_NAME)
@Role(BeanDefinition.ROLE_INFRASTRUCTURE)
public BeanFactoryTransactionAttributeSourceAdvisor transactionAdvisor(
        TransactionAttributeSource transactionAttributeSource,
        TransactionInterceptor transactionInterceptor) {
    BeanFactoryTransactionAttributeSourceAdvisor advisor = 
        new BeanFactoryTransactionAttributeSourceAdvisor();
    advisor.setTransactionAttributeSource(transactionAttributeSource);
    advisor.setAdvice(transactionInterceptor);
    // 提取 @EnableTransactionManagement 的 order 属性
    if (this.enableTx != null) {
        advisor.setOrder(this.enableTx.getNumber("order"));
    }
    return advisor;
}
```

既然是 AOP 中的增强器，那么切人点也必不可少。BeanFactoryTransactionAttributeSourceAdvisor 判断一个类是否可以被增强的依据是利用 TransactionAttributeSource 检查类和方法中是否标注有 @Transactional 注解。这个逻辑与读者所熟知的事务控制一致：如果 Service 类上或者方法上标注了 @Transactional 注解，则事务切面会介人并进行增强。

简单总结，ProxyTransactionManagementConfiguration 中注册了注解声明式事务中必备的组件。有了这些组件，就可以支撑注解事务的控制。

## 10.4 声明式事务的控制全流程

了解了声明式事务的生效原理后，本节结合实际项目，以 Debug 的方式研究事务控制的底层全流程。

借助 IDE 测试，将断点打在 `userService.test()` 方法上，以 Debug 的形式运行 Spring Boot JDBC 应用，等断点停在此处时 Debug 进入。

### 10.4.1 CglibAopProxy#intercept

由于默认情况下 Spring Boot 会使用代理目标类的方式创建代理对象，因此这里首先会进入 CglibAopProxy 的 intercept 方法。通过之前的学习，可以快速定位到代理对象中的增强器，即上面提到的 BeanFactoryTransactionAttributeSourceAdvisor。

这个增强器中组合的通知，刚好是上面提到的事务拦截器 TransactionInterceptor。

### 10.4.2 TransactionInterceptor

进入 TransactionInterceptor 的 invoke 方法，可以发现方法中直接调用了 invokeWithinTransaction 方法。而这个 invokeWithinTransaction 方法定义在 TransactionInterceptor 的父类 TransactionAspectSupport 中，如代码清单 10-5 所示。

```java
@Override
public Object invoke(MethodInvocation invocation) throws Throwable {
    Class<?> targetClass = (invocation.getThis() != null 
            ? AopUtils.getTargetClass(invocation.getThis()) : null);
    return invokeWithinTransaction(invocation.getMethod(), targetClass, 
            invocation::proceed);
}
```

### 10.4.3 事务控制核心流程

由于 invokeWithinTransaction 方法的篇幅很长，为便于读者更好地阅读和理解源码，本节将其拆分为多个片段讲解。

#### 1. 获取 TransactionAttribute

invokeWithinTransaction 方法的第一步工作是通过 TransactionAttributeSource 获取到 TransactionAttribute 事务定义信息，如代码清单 10-6 所示。

```java
@Nullable
protected Object invokeWithinTransaction(Method method, 
        @Nullable Class<?> targetClass,
        final InvocationCallback invocation) throws Throwable {
    // 如果事务属性为空，则方法非事务性的
    TransactionAttributeSource tas = getTransactionAttributeSource();
    final TransactionAttribute txAttr = (tas != null 
            ? tas.getTransactionAttribute(method, targetClass) : null);
    // ...
}
```

getTransactionAttribute 方法的内部有一个缓存机制。方法的核心工作是根据方法和方法所在的类获取并缓存对应的事务定义信息。如果没有获取到事务定义信息则会缓存 NULL_TRANSACTION_ATTRIBUTE 空定义并返回。

当 Debug 至此处时，可以发现缓存中已经成功获取到 TransactionAttribute。出现这种现象的原因是：事务通知在织入之前需要对每个正在创建的 bean 对象进行匹配，而匹配时需要使用 TransactionAttributeSource 检查方法或方法所在类上是否标注有 @Transactional 注解，以此来判断是否需要对当前正在创建的 bean 对象织入事务通知。而不管最终事务通知是否需要织入目标对象，TransactionAttributeSource 中都会留下被检查方法的判断痕迹。

#### 2. 获取 TransactionManager

获取到事务定义信息之后，接下来要做的是获取事务管理器。执行 determineTransactionManager 方法，而方法的最终实现是在源码最后的最深层 if 结构中从 BeanFactory 中获取 TransactionManager。

```java
protected TransactionManager determineTransactionManager(
        @Nullable TransactionAttribute txAttr) {
    // 不触发的部分已省略
    else {
        TransactionManager defaultTransactionManager = getTransactionManager();
        if (defaultTransactionManager == null) {
            defaultTransactionManager = this.transactionManagerCache
                    .get(DEFAULT_TRANSACTION_MANAGER_KEY);
            if (defaultTransactionManager == null) {
                defaultTransactionManager = this.beanFactory.getBean(
                        TransactionManager.class);
                this.transactionManagerCache.putIfAbsent(
                        DEFAULT_TRANSACTION_MANAGER_KEY, defaultTransactionManager);
            }
        }
        return defaultTransactionManager;
    }
}
```

Debug 至此处，可以从 BeanFactory 中成功获取到基于数据源的 DataSourceTransactionManager。

#### 3. 响应式事务管理器的处理

下一部分源码针对响应式事务。Spring Framework 5.2 版本之后引入了响应式事务的概念，所以源码中有响应式事务管理器的判断和处理。

```java
if (this.reactiveAdapterRegistry != null && tm instanceof ReactiveTransactionManager) {
    ReactiveTransactionSupport txSupport = transactionSupportCache.computeIfAbsent(method, key -> {
        // ...
        ReactiveAdapter adapter = this.reactiveAdapterRegistry.getAdapter(
                method.getReturnType());
        if (adapter == null) {
            // throw exception
        }
        return new ReactiveTransactionSupport(adapter);
    });
    return txSupport.invokeWithinTransaction(
            method, targetClass, invocation, txAttr, (ReactiveTransactionManager) tm);
}
```

> 本书不对响应式事务展开讨论，故跳过。

#### 4. 事务控制核心

下面的部分是事务控制的核心源码。通过代码清单 10-7 可以看出，注解声明式事务的核心是一个环绕通知。这部分核心源码的动作有 4 步：开启事务、执行 Service 方法、遇到异常就回滚事务和没有异常就提交事务。这个步骤对于原生 JDBC 事务同样适用，Spring Framework 也完全遵循该流程实现。

```java
PlatformTransactionManager ptm = asPlatformTransactionManager(tm);
final String joinpointIdentification = methodIdentification(method, targetClass, txAttr);
if (txAttr == null || !(ptm instanceof CallbackPreferringPlatformTransactionManager)) {
    // 1. 开启事务
    TransactionInfo txInfo = createTransactionIfNecessary(ptm, txAttr, 
            joinpointIdentification);
    Object retVal;
    try {
        // 2. 环绕通知执行 Service 方法
        retVal = invocation.proceedWithInvocation();
    } catch (Throwable ex) {
        // 3. 捕获到异常，回滚事务
        completeTransactionAfterThrowing(txInfo, ex);
        throw ex;
    } finally {
        cleanupTransactionInfo(txInfo);
    }
    // 4. Service 方法执行成功，提交事务
    commitTransactionAfterReturning(txInfo);
    return retVal;
}
```

##### （1）成功的事务提交

以当前的代码继续 Debug，当执行完 createTransactionIfNecessary 方法后，可以观察到此时事务的定义信息、事务的状态已经封装完毕，completed 属性为 false。

事务开启后，由于 UserService 的代码可以正常执行，会触发下面的 commitTransactionAfterReturning 方法提交事务。提交事务的逻辑是获取到事务管理器后执行提交逻辑。注意，事务管理器的 commit 方法并不会直接提交，而是会先进行一些异常情况的检查，确保无误后再执行 processCommit 方法提交事务，如代码清单 10-8 所示。

```java
protected void commitTransactionAfterReturning(
        @Nullable TransactionInfo txInfo) {
    if (txInfo != null && txInfo.getTransactionStatus() != null) {
        txInfo.getTransactionManager().commit(txInfo.getTransactionStatus());
    }
}

// AbstractPlatformTransactionManager
public final void commit(TransactionStatus status) throws TransactionException {
    // 如果事务已经完成，则无法提交，抛出异常
    if (status.isCompleted()) {
        // throw exception
    }
    DefaultTransactionStatus defStatus = (DefaultTransactionStatus) status;
    // 如果事务已被标记为需要回滚，则回滚事务
    if (defStatus.isLocalRollbackOnly()) {
        processRollback(defStatus, false);
        return;
    }
    // 全局事务的回滚标识判断（JTA）...
    // 正常的待提交事务可以执行提交
    processCommit(defStatus);
}
```

提交事务的 processCommit 方法内部实现比较复杂。代码清单 10-9 中只列举了最关键的几行源码，整个方法的核心提交动作是一个以 do 开头的 doCommit 方法。这个方法的实现在落地实现类 DataSourceTransactionManager 中，它会获取到原生 JDBC 的 Connection，执行 commit 方法完成事务提交。至此就可以看到 Spring Framework 封装的事务抽象在底层操控原生 JDBC 的核心实现。

```java
private void processCommit(DefaultTransactionStatus status) 
        throws TransactionException {
    if (status.hasSavepoint()) {
        // 如果当前事务存在保存点，则处理保存点的逻辑
    }
    // 对于新事务，直接提交事务即可
    else if (status.isNewTransaction()) {
        unexpectedRollback = status.isGlobalRollbackOnly();
        doCommit(status);
        // ...
    }
}

@Override
protected void doCommit(DefaultTransactionStatus status) {
    DataSourceTransactionObject txObject = 
            (DataSourceTransactionObject) status.getTransaction();
    Connection con = txObject.getConnectionHolder().getConnection();
    try {
        con.commit();
    } // catch ...
}
```

##### （2）异常的事务回滚

如果需要测试异常的事务回滚，需要在 UserService 的 test 方法中人为构造一个异常（如使用 `int i = 1/0;` 构造除零异常），并在 invokeWithinTransaction 方法的 try-catch 块中调用 completeTransactionAfterThrowing 方法处打断点。

捕获到异常后，底层会根据异常类型决定是否回滚异常。默认情况下 @Transactional 注解控制回滚的异常类型包括 Error 和 RuntimeException。对于普通的 Exception，默认策略不会回滚，而是选择继续提交事务。这也提示读者在日常开发中，给方法标注 @Transactional 注解时一定要显式地声明事务回滚的异常类型。

```java
protected void completeTransactionAfterThrowing(
        @Nullable TransactionInfo txInfo, Throwable ex) {
    if (txInfo != null && txInfo.getTransactionStatus() != null) {
        // 如果当前异常在回滚范围之内，则会调用事务管理器，回滚事务
        if (txInfo.transactionAttribute != null 
                && txInfo.transactionAttribute.rollbackOn(ex)) {
            try {
                txInfo.getTransactionManager()
                        .rollback(txInfo.getTransactionStatus());
            } // catch ...
        } else {
            // 如果不在回滚范围内，则依然会提交事务
            try {
                txInfo.getTransactionManager()
                        .commit(txInfo.getTransactionStatus());
            } // catch ...
        }
    }
}

// 默认的事务回滚捕获异常类型
public boolean rollbackOn(Throwable ex) {
    return (ex instanceof RuntimeException || ex instanceof Error);
}
```

由于测试代码 UserService 中标注的 @Transactional 注解已经显式声明了 `rollbackFor = Exception.class`，故此处可以正常回滚事务。而回滚事务时底层也有一些简单的判断，在判断无误时最终依然调用 DataSourceTransactionManager 的方法，不过这里调用的是 doRollback 方法。它的实现方式与 doCommit 方法如出一辙，都是获取到原生 JDBC 的 Connection 后执行提交/回滚动作，如代码清单 10-10 所示。

```java
public final void rollback(TransactionStatus status) throws TransactionException {
    // 如果事务已经完成，则无法继续回滚
    if (status.isCompleted()) {
        // throw exception
    }
    DefaultTransactionStatus defStatus = (DefaultTransactionStatus) status;
    // 回滚事务
    processRollback(defStatus, false);
}

private void processRollback(DefaultTransactionStatus status, boolean unexpected) {
    try {
        // 如果存在保存点，则直接回滚到保存点位置
        if (status.hasSavepoint()) {
            status.rollbackToHeldSavepoint();
        }
        // 对于新事务，直接回滚
        else if (status.isNewTransaction()) {
            doRollback(status);
        }
        // ...
    } // catch ...
}

@Override
protected void doRollback(DefaultTransactionStatus status) {
    DataSourceTransactionObject txObject = 
            (DataSourceTransactionObject) status.getTransaction();
    Connection con = txObject.getConnectionHolder().getConnection();
    try {
        con.rollback();
    } // catch ...
}
```

#### 5. 事务执行的后处理

无论是事务的提交还是回滚，在整个方法的最后都要执行一个 cleanupAfterCompletion 方法。这个方法用来清除整个事务执行过程中所需的 ConnectionHolder 等组件以及解除线程中同步的事务信息，如代码清单 10-11 所示。

```java
finally {
    cleanupAfterCompletion(status);
}

private void cleanupAfterCompletion(DefaultTransactionStatus status) {
    status.setCompleted();
    if (status.isNewSynchronization()) {
        TransactionSynchronizationManager.clear();
    }
    if (status.isNewTransaction()) {
        doCleanupAfterCompletion(status.getTransaction());
    }
    if (status.getSuspendedResources() != null) {
        // ...
        Object transaction = (status.hasTransaction() 
                ? status.getTransaction() : null);
        resume(transaction, 
                (SuspendedResourcesHolder) status.getSuspendedResources());
    }
}
```

cleanupAfterCompletion 方法中的前两个 if 结构都是与组件资源清除相关的工作，逻辑比较简单，感兴趣的读者可以自行深入研究。最后一个 if 结构中有一个 resume 的动作，它的作用是释放挂起的事务，这个逻辑在 10.5 节会讲到。

## 10.5 声明式事务的传播行为控制

在实际的项目开发中，难免会出现 Service 之间嵌套的场景。Spring Framework 通过事务传播行为可以控制一个 Service 中的事务传播到另一个 Service 方法中的方式。Spring Framework 中定义了 7 种传播行为，如表 10-1 所示。

**表 10-1 Spring Framework 中定义的事务传播行为**

| 传播行为 | 含义 |
|---------|------|
| PROPAGATION_REQUIRED | 如果当前没有事务运行，则会开启一个新的事务；如果当前已经有事务运行，则方法会运行在当前事务中 |
| PROPAGATION_REQUIRES_NEW | 如果当前没有事务运行，则会开启一个新的事务；如果当前已经有事务运行，则会将原事务挂起（暂停），重新开启一个新的事务。当新的事务运行完毕后，再将原来的事务释放 |
| PROPAGATION_SUPPORTS | 如果当前有事务运行，则方法会运行在当前事务中；如果当前没有事务运行，则不会创建新的事务（即不运行在事务中） |
| PROPAGATION_NOT_SUPPORTED | 如果当前有事务运行，则会将该事务挂起（暂停）；如果当前没有事务运行，则方法也不会运行在事务中 |
| PROPAGATION_MANDATORY | 当前方法必须运行在事务中，如果没有事务，则抛出异常 |
| PROPAGATION_NEVER | 当前方法不允许运行在事务中，如果当前已经有事务运行，则抛出异常 |
| PROPAGATION_NESTED | 如果当前没有事务运行，则开启一个新的事务；如果当前已经有事务运行，则会记录一个保存点，并继续运行在当前事务中。如果子事务运行中出现异常，则不会全部回滚，而是回滚到上一个保存点 |

> **提示**：本书不会讲解全部事务传播行为，而是选择最常见的 PROPAGATION_REQUIRED、比较有研究价值的 PROPAGATION_REQUIRES_NEW 讲解。对于比较简单的传播行为，在剖析 PROPAGATION_REQUIRED 传播行为时会一并讲解。

### 10.5.1 修改测试代码

为了演示事务传播行为在不同 Service 之间嵌套的效果，下面在示例项目中创建一个新的 DeptService，并使其依赖 UserService，如代码清单 10-12 所示。

```java
@Service
public class DeptService {
    @Autowired
    private UserService userService;
    
    @Transactional(rollbackFor = Exception.class)
    public void save() {
        System.out.println("DeptService save run ....");
        userService.test();
    }
}
```

随后修改 SpringBootJdbcApplication 的 main 方法，从 IOC 容器中获取 DeptService 并调用其 save 方法，如代码清单 10-13 所示。

```java
public static void main(String[] args) {
    ApplicationContext ctx = SpringApplication.run(
            SpringBootJdbcApplication.class, args);
    DeptService deptService = ctx.getBean(DeptService.class);
    deptService.save();
}
```

### 10.5.2 PROPAGATION_REQUIRED

默认情况下，标注 @Transactional 注解对应的事务传播行为是 PROPAGATION_REQUIRED。这种传播行为的特征是执行 Service 方法时必定确保事务的开启，而创建事务的位置是 createTransactionIfNecessary 方法。

```java
PlatformTransactionManager ptm = asPlatformTransactionManager(tm);
final String joinpointIdentification = methodIdentification(method, targetClass, txAttr);
if (txAttr == null || !(ptm instanceof CallbackPreferringPlatformTransactionManager)) {
    // 此处会创建/获取事务
    TransactionInfo txInfo = createTransactionIfNecessary(ptm, txAttr, 
            joinpointIdentification);
    Object retVal;
    try {
        retVal = invocation.proceedWithInvocation();
    } // ...
}
```

本节的研究重点是 createTransactionIfNecessary 方法中底层逻辑面对事务的不同传播行为时会如何进行处理。进入 createTransactionIfNecessary 方法，如代码清单 10-14 所示。

```java
protected TransactionInfo createTransactionIfNecessary(
        @Nullable PlatformTransactionManager tm,
        @Nullable TransactionAttribute txAttr, 
        final String joinpointIdentification) {
    // 如果事务定义中没有 name，则将方法名作为事务定义标识名
    if (txAttr != null && txAttr.getName() == null) {
        txAttr = new DelegatingTransactionAttribute(txAttr) {
            @Override
            public String getName() {
                return joinpointIdentification;
            }
        };
    }
    TransactionStatus status = null;
    if (txAttr != null) {
        if (tm != null) {
            // 获取事务定义信息对应的事务状态
            status = tm.getTransaction(txAttr);
        }
    }
    // 构建事务信息
    return prepareTransactionInfo(tm, txAttr, joinpointIdentification, status);
}
```

#### 1. tm.getTransaction

事务管理器的 getTransaction 方法定义在 DataSourceTransactionManager 的父类 AbstractPlatformTransactionManager 中。这个方法篇幅略长，为便于读者更好地理解，本节将其拆分为多个片段讲解。

##### （1）doGetTransaction

getTransaction 方法依然是一个需要转调 do 开头的 doGetTransaction 方法，而 doGetTransaction 方法本身是一个模板方法，它的实现又要回到 DataSourceTransactionManager 中。

```java
public final TransactionStatus getTransaction(
        @Nullable TransactionDefinition definition) throws TransactionException {
    TransactionDefinition def = (definition != null 
            ? definition : TransactionDefinition.withDefaults());
    Object transaction = doGetTransaction();
    // ...
}

protected Object doGetTransaction() {
    DataSourceTransactionObject txObject = new DataSourceTransactionObject();
    txObject.setSavepointAllowed(isNestedTransactionAllowed());
    ConnectionHolder conHolder = (ConnectionHolder) TransactionSynchronizationManager
            .getResource(obtainDataSource());
    txObject.setConnectionHolder(conHolder, false);
    return txObject;
}
```

从代码可以看出，即使大部分 API 都是陌生的，整体思路也比较清晰：doGetTransaction 方法会创建并返回一个 DataSourceTransactionObject，其中包含一个 Connection 对象。ConnectionHolder 的设计比较类似于 BeanDefinition 的持有者 BeanDefinitionHolder，它们的本质都是内部组合了一个对象。

doGetTransaction 方法执行完毕后，可以简单地理解为返回了一个 Connection 对象。

##### （2）传播行为处理（1）

紧接着的 if 结构看似简单，实际上 handleExistingTransaction 方法大有作用，它里面处理逻辑很复杂，都是当外部事务已经存在时的处理逻辑。

```java
if (isExistingTransaction(transaction)) {
    return handleExistingTransaction(def, transaction, debugEnabled);
}
```

具体的传播行为如何处理，在下面再展开讲解。

##### （3）超时检测

接着的 if 结构实际上是校验 @Transactional 注解中的 timeout 属性。Spring Framework 支持的事务模型可以设置事务方法最长执行时间。如果在 Service 方法中标注的 @Transactional 注解显式设置了 timeout 的最长耗时，则当方法执行时间过长时会由底层抛出异常。默认情况下 timeout 的值是 -1，表示不限制事务方法执行时间。但如果显式设置的 timeout 值比 -1 小，说明设置的值本身不合理，底层也会抛出异常。

```java
if (def.getTimeout() < TransactionDefinition.TIMEOUT_DEFAULT) {
    throw ex;
}
```

##### （4）传播行为处理（2）

getTransaction 方法的最后一个片段中，可以看到部分事务传播行为的处理逻辑。

```java
// 当前没有事务 -> 检查传播行为以决定如何向下执行
if (def.getPropagationBehavior() == TransactionDefinition.PROPAGATION_MANDATORY) {
    throw ex...;
} else if (def.getPropagationBehavior() == TransactionDefinition.PROPAGATION_REQUIRED
        || def.getPropagationBehavior() == TransactionDefinition.PROPAGATION_REQUIRES_NEW
        || def.getPropagationBehavior() == TransactionDefinition.PROPAGATION_NESTED) {
    SuspendedResourcesHolder suspendedResources = suspend(null);
    try {
        return startTransaction(def, transaction, debugEnabled, suspendedResources);
    } // catch
} else {
    boolean newSynchronization = (getTransactionSynchronization() == SYNCHRONIZATION_ALWAYS);
    return prepareTransactionStatus(def, null, true, newSynchronization, 
            debugEnabled, null);
}
```

请注意，如果程序进入该部分源码，说明线程中没有开启事务。此时如果方法的事务定义信息配置的传播行为是 MANDATORY，则直接抛出异常；如果传播行为配置了 REQUIRED、REQUIRES_NEW 或 NESTED，则会直接开启一个新的事务。

还剩下 3 种：SUPPORTS、NOT_SUPPORTED 和 NEVER，它们都可以在没有事务的情况下运行。如果代码运行至此，说明目前的确没有事务，无须做任何处理，因此 else 部分中不会有任何多余逻辑执行。

#### 2. startTransaction：开启事务

从代码清单 10-15 中可以发现一个特别显眼的方法 doBegin。相信根据前面探究源码的经验，读者可以马上反应过来，这个方法就是开启事务的核心逻辑。

```java
private TransactionStatus startTransaction(TransactionDefinition definition,
        Object transaction, boolean debugEnabled,
        @Nullable SuspendedResourcesHolder suspendedResources) {
    boolean newSynchronization = (getTransactionSynchronization() != SYNCHRONIZATION_NEVER);
    doBegin(transaction, definition);
    prepareSynchronization(status, definition);
}
```

进入 doBegin 方法中可以发现源码篇幅很长。代码清单 10-16 中只截取最吸引各位的一段。可以发现 doBegin 方法中的主要工作是从 DataSourceTransactionObject 内部组合的 ConnectionHolder 中提取出真正的 Connection 对象，随后执行 setAutoCommit(false) 方法关闭自动提交，即开启事务。由此可以了解到原生 JDBC 事务开启的位置。

```java
@Override
protected void doBegin(Object transaction, TransactionDefinition definition) {
    txObject.getConnectionHolder().setSynchronizedWithTransaction(true);
    // 获取到真正的 Connection 对象
    con = txObject.getConnectionHolder().getConnection();
    if (con.getAutoCommit()) {
        txObject.setMustRestoreAutoCommit(true);
        // 开启事务
        con.setAutoCommit(false);
    }
    // ...
}
```

#### 3. prepareTransactionInfo

从事务管理器中获取到 TransactionStatus 后，下一步要执行的是 prepareTransactionInfo 方法。这个方法仅创建一个 TransactionInfo，把事务状态信息放入其中，并将其绑定到当前线程中。当创建 TransactionInfo 并返回之后，整个 createTransactionIfNecessary 方法执行完毕，事务也就开启了。

```java
protected TransactionInfo prepareTransactionInfo(
        @Nullable PlatformTransactionManager tm,
        @Nullable TransactionAttribute txAttr, 
        String joinpointIdentification,
        @Nullable TransactionStatus status) {
    TransactionInfo txInfo = new TransactionInfo(tm, txAttr, joinpointIdentification);
    if (txAttr != null) {
        txInfo.newTransactionStatus(status);
    }
    txInfo.bindToThread();
    return txInfo;
}
```

#### 4. UserService.test

DeptService#save 方法的事务开启之后，它的内部会调用 UserService 的 test 方法。由于 userService 也是被 AOP 代理过的代理对象，在调用 test 方法时会再次进入代理为的部分。这里直接进入 tm.getTransaction -> doGetTransaction 的步骤。由于此时线程中已存在事务，因此 doGetTransaction 方法中的这个 if 分支会触发进入。

```java
if (isExistingTransaction(transaction)) {
    // 当前没有事务 -> 检查传播行为以决定如何向下执行
    return handleExistingTransaction(def, transaction, debugEnabled);
}
```

#### 5. handleExistingTransaction

handleExistingTransaction 方法中的所有分支均为事务传播行为的判断与行为动。

##### （1）NEVER 的处理

对于 NEVER 的传播行为，要求线程中不能有事务。所以如果线程中检测到事务，则抛出异常。

```java
private TransactionStatus handleExistingTransaction(
        TransactionDefinition definition, Object transaction, boolean debugEnabled) 
        throws TransactionException {
    if (definition.getPropagationBehavior() == TransactionDefinition.PROPAGATION_NEVER) {
        throw ex...;
    }
    // ...
}
```

##### （2）NOT_SUPPORTED 的处理

对于 NOT_SUPPORTED 的传播行为，要求方法执行不在事务中。所以此处会把当前事务挂起，并执行目标方法。

```java
if (definition.getPropagationBehavior() 
        == TransactionDefinition.PROPAGATION_NOT_SUPPORTED) {
    // 挂起当前事务
    Object suspendedResources = suspend(transaction);
    boolean newSynchronization = (getTransactionSynchronization() == SYNCHRONIZATION_ALWAYS);
    return prepareTransactionStatus(
            definition, null, false, newSynchronization, debugEnabled, 
            suspendedResources);
}
```

##### （3）REQUIRES_NEW 的处理

对于 REQUIRES_NEW 的传播行为，会开启一个新的事务，不过在此之前还要挂起已有事务。

```java
if (definition.getPropagationBehavior() 
        == TransactionDefinition.PROPAGATION_REQUIRES_NEW) {
    // 挂起当前外层事务
    SuspendedResourcesHolder suspendedResources = suspend(transaction);
    try {
        // 开启一个全新的事务
        return startTransaction(definition, transaction, debugEnabled, 
                suspendedResources);
    } catch (RuntimeException | Error beginEx) {
        // 还原外层事务
        resumeAfterBeginException(transaction, suspendedResources, beginEx);
        throw beginEx;
    }
}
```

##### （4）NESTED 的处理

对于 NESTED 嵌套事务的处理，除了需要允许嵌套事务在程序中启用，还需要连接的数据源支持基于保存点的嵌套事务。如果这两个条件都成立，则会创建保存点，否则会降级为 REQUIRES_NEW。

```java
if (definition.getPropagationBehavior() 
        == TransactionDefinition.PROPAGATION_NESTED) {
    // 检查是否允许嵌套事务
    if (!isNestedTransactionAllowed()) {
        throw ex;
    }
    // 判断是否支持保存点
    if (useSavepointForNestedTransaction()) {
        DefaultTransactionStatus status = prepareTransactionStatus(definition,
                transaction, false, false, debugEnabled, null);
        status.createAndHoldSavepoint();
        return status;
    } else {
        return startTransaction(definition, transaction, debugEnabled, null);
    }
}
```

##### （5）SUPPORTS & REQUIRED

最后的部分是处理 REQUIRED 和 SUPPORTS 的逻辑。由于 isValidateExistingTransaction() 方法在默认情况下返回 false，因此不会进入中间的 if 结构，而最后的两行源码仅是把现有的事务信息封装并返回，没有任何额外的逻辑。

```java
// Assumably PROPAGATION_SUPPORTS or PROPAGATION_REQUIRED.
if (isValidateExistingTransaction()) {
    boolean newSynchronization = (getTransactionSynchronization() != SYNCHRONIZATION_NEVER);
    return prepareTransactionStatus(definition, transaction, false,
            newSynchronization, debugEnabled, null);
}
// ...
```

### 10.5.3 PROPAGATION_REQUIRES_NEW

将 UserService 的 test 方法上的 @Transactional 注解事务传播行为改为 REQUIRES_NEW，并重新 Debug 测试。由上面的分析可知，REQUIRES_NEW 会在 handleExistingTransaction 方法中处理。

```java
if (definition.getPropagationBehavior() 
        == TransactionDefinition.PROPAGATION_REQUIRES_NEW) {
    // 挂起当前外层事务
    SuspendedResourcesHolder suspendedResources = suspend(transaction);
    try {
        // 开启一个全新的事务
        return startTransaction(definition, transaction, debugEnabled, 
                suspendedResources);
    } // catch ...
}
```

看似只是简单地开启和处理新事务，实际上里面有以下几个需要注意的细节，下面逐一讲解。

#### 1. 新事务的创建细节

新事务在创建之前会将外层的原事务挂起。挂起的逻辑中有一个细节值得关注，如代码清单 10-17 所示。仔细观察源码中的两行注释，标注的都是 doSuspend 方法，这就意味着真正挂起的动作在 doSuspend 方法中。

```java
protected final SuspendedResourcesHolder suspend(@Nullable Object transaction)
        throws TransactionException {
    if (TransactionSynchronizationManager.isSynchronizationActive()) {
        List<TransactionSynchronization> suspendedSynchronizations = 
                doSuspendSynchronization();
        try {
            Object suspendedResources = null;
            if (transaction != null) {
                // 注意此处：doSuspend
                suspendedResources = doSuspend(transaction);
            }
            // ...
        } catch (RuntimeException | Error ex) {
            // dosuspend failed - original transaction is still active...
            doResumeSynchronization(suspendedSynchronizations);
            throw ex;
        }
    } else if (transaction != null) {
        // 注意此处：doSuspend
        Object suspendedResources = doSuspend(transaction);
        return new SuspendedResourcesHolder(suspendedResources);
    }
    // else return null
}
```

由于 doxxx 方法一般都需要在具体的实现类中寻找，从 DataSourceTransactionManager 中可以找到 doSuspend 方法的实现，如代码清单 10-18 所示。方法的具体逻辑是移除 DataSourceTransactionObject 中的 Connection 对象，并且解除 TransactionSynchronizationManager 中的数据源绑定。

```java
@Override
protected Object doSuspend(Object transaction) {
    DataSourceTransactionObject txObject = 
            (DataSourceTransactionObject) transaction;
    txObject.setConnectionHolder(null);
    return TransactionSynchronizationManager.unbindResource(obtainDataSource());
}
```

实际 Debug 时可以发现，解绑之后返回的是组合了 Connection 的 ConnectionHolder。

随后回到上面的 suspend 方法中，注意观察最后方法的返回值，它将 ConnectionHolder 包装为一个 SuspendedResourcesHolder 之后返回。这个 SuspendedResourcesHolder 对象会在下面的两个环节发挥作用。

#### 2. 开启事务的细节

注意观察 startTransaction 方法中参数列表的最后一个参数。上面一步返回的 SuspendedResourcesHolder 对象会被一并传入，并且存入 TransactionStatus 中。这样做的目的是：当内层新事务执行完成后清理相关的线程同步等信息时可以获得事务状态信息，从中提取出被挂起的事务，然后继续恢复外层事务。

```java
private TransactionStatus startTransaction(TransactionDefinition definition,
        Object transaction, boolean debugEnabled,
        @Nullable SuspendedResourcesHolder suspendedResources) {
    boolean newSynchronization = (getTransactionSynchronization() != SYNCHRONIZATION_NEVER);
    DefaultTransactionStatus status = new DefaultTransactionStatus(
            definition, transaction, true, newSynchronization, debugEnabled, 
            suspendedResources);
    doBegin(transaction, definition);
    prepareSynchronization(status, definition);
    return status;
}
```

#### 3. 内层新事务执行完成后的细节

当事务执行完成之后，会执行 cleanupAfterCompletion 方法，以清除其中的线程同步信息等。

```java
private void cleanupAfterCompletion(DefaultTransactionStatus status) {
    status.setCompleted();
    if (status.isNewSynchronization()) {
        TransactionSynchronizationManager.clear();
    }
    if (status.isNewTransaction()) {
        doCleanupAfterCompletion(status.getTransaction());
    }
    if (status.getSuspendedResources() != null) {
        // ...
        Object transaction = (status.hasTransaction() 
                ? status.getTransaction() : null);
        resume(transaction, 
                (SuspendedResourcesHolder) status.getSuspendedResources());
    }
}
```

注意观察最下面的 if 部分，这个动作是恢复挂起事务的核心动作。resume 方法的逻辑非常像前面 suspend 方法的逆动作。上面的 doResume 方法对应 suspend 中的 doSuspend 方法，下面的 set 动作对应 suspend 中的 set(null)。另外，doResume 方法的逻辑更为简单，且刚好跟 doSuspend 方法相反，一个 bindResource，另一个是 unbindResource。

```java
protected final void resume(@Nullable Object transaction,
        @Nullable SuspendedResourcesHolder resourcesHolder) 
        throws TransactionException {
    Object suspendedResources = resourcesHolder.suspendedResources;
    doResume(transaction, suspendedResources);
    List<TransactionSynchronization> suspendedSynchronizations = 
            resourcesHolder.suspendedSynchronizations;
    if (suspendedSynchronizations != null) {
        TransactionSynchronizationManager.setActualTransactionActive(
                resourcesHolder.wasActive);
        TransactionSynchronizationManager.setCurrentTransactionIsolationLevel(
                resourcesHolder.isolationLevel);
        TransactionSynchronizationManager.setCurrentTransactionReadOnly(
                resourcesHolder.readOnly);
        TransactionSynchronizationManager.setCurrentTransactionName(
                resourcesHolder.name);
        doResumeSynchronization(suspendedSynchronizations);
    }
}

protected void doResume(@Nullable Object transaction, Object suspendedResources) {
    TransactionSynchronizationManager.bindResource(
            obtainDataSource(), suspendedResources);
}
```

当 resume 方法执行完毕后，原来的外层事务又重新被绑定到线程上，相当于恢复了被挂起之前的状态。这就体现了 REQUIRES_NEW 的处理逻辑。

## 10.6 小结

本章全方位研究了 Spring Boot 整合 JDBC 场景下的组件装配，以及注解声明式事务的生效原理、控制流程、事务传播行为等场景。Spring Boot 整合的事务场景底层依然是 Spring Framework 已有的功能，Spring Boot 做的事情仅是对默认场景下的组件自动进行装配，并为事务通知等重要组件提供支撑。

声明式事务管理的底层实现原理是 AOP 技术的经典应用。掌握事务管理底层的模型离不开 AOP 部分的后置处理器、增强器、通知器等核心概念。虽然在大多数的项目开发中，更多的选择是使用持久层框架 MyBatis 或 Spring Data（JPA），而不是原生的 Spring JDBC。但理解声明式事务的底层原理对于深入掌握 Spring Framework 来说非常重要。
