# 第11章 Spring Boot 整合 MyBatis

第10章中系统地讲解了 Spring Boot 整合 JDBC 场景下的自动装配，以及注解声明式事务的底层原理。尽管 Spring Framework 和 Spring Boot 在简化与数据库的交互方面已经做了很大的努力，目前市面上比较流行的持久层框架包括 Spring Data JPA（底层默认依赖 Hibernate）和 MyBatis。

Spring Data 本身属于 Spring 生态的一部分，与 Spring Boot 的整合非常简单，本书不对此展开讲解。MyBatis 作为第三方框架，它与 Spring Boot 的整合方式是通过第三方框架编写 starter 场景启动器并配置相应的组件自动装配。本章内容会以 MyBatis 整合 Spring Boot 的核心场景启动器为切入点，研究 MyBatis 如何完成与 Spring Boot 的场景整合。

## 11.1 MyBatis 框架概述

MyBatis 是一款优秀的持久层框架，它支持自定义 SQL、存储过程以及高级映射。MyBatis 免除了几乎所有的 JDBC 代码以及设置参数和获取结果集的工作。MyBatis 可以通过简单的 XML 或注解来配置和映射原始类型、接口和普通老式 Java 对象（Plain Old Java Object, POJO）。

从整体上讲，MyBatis 的架构可以分为三层，如图11-1所示。

```
┌─────────────────────────────────────────────────────┐
│                    接⼝层                            │
│               SqlSession                            │
├─────────────────────────────────────────────────────┤
│                    核⼼层                            │
│  参数映射 │ SQL解析 │ SQL执⾏ │ 结果集映射 │ 插件   │
├─────────────────────────────────────────────────────┤
│                    ⽀持层                            │
│     ⽇志 │ 类型转换 │ 数据源 │ 事务管理              │
└─────────────────────────────────────────────────────┘
```

图 11-1 MyBatis 的整体架构

- **接口层**：SqlSession 是平时与 MyBatis 完成交互的核心接口（包括整合 Spring Framework 和 Spring Boot 后用到的 SqlSessionTemplate）。
- **核心层**：SqlSession 执行的方法，包括底层需要经过配置文件的解析、SQL 解析，以及执行 SQL 时的参数映射、SQL 执行、结果集映射，另外还有穿插其中的扩展插件。
- **支持层**：核心层的功能实现，它基于底层的各个模块，以共同协调完成。

总体来讲，使用 MyBatis 可以灵活、完整、相对轻量化地与数据库进行交互。

## 11.2 Spring Boot 整合 MyBatis 项目搭建

下面来搭建一个 Spring Boot 整合 MyBatis 的项目。由于 MyBatis 整合 Spring Boot 的场景启动器中已经对 Spring Boot 原生的 starter 做了整合，因此在导入依赖时，只需要引入 mybatis-spring-boot-starter 和具体的数据库连接驱动，如代码清单11-1所示。

**代码清单 11-1 引入 MyBatis 整合 Spring Boot 的必要依赖**

```xml
<dependencies>
    <dependency>
        <groupId>org.mybatis.spring.boot</groupId>
        <artifactId>mybatis-spring-boot-starter</artifactId>
        <version>2.1.3</version>
    </dependency>

    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <version>5.1.47</version>
    </dependency>
</dependencies>
```

> **提示**：mybatis-spring-boot-starter 2.1.3 版本底层依赖 Spring Boot 2.3.0，与本书研究的 Spring Boot 主要版本同属同一个中版本，整合的可靠性高。

有关数据库搭建的部分，可以直接使用第10章的 springboot-dao 作为连接库，本章不再重新创建；连接数据源的内容，同样参照第10章配置，具体可见代码清单10-3，本章不再赘述。

有关测试代码，部分内容与第10章类似，区别是 Dao 层的实现由依赖 JdbcTemplate 的 UserDao 替换为 Mapper 动态代理接口 UserMapper 以及对应的 XML 映射文件 UserMapper.xml，具体的代码如代码清单11-2和代码清单11-3所示。

**代码清单 11-2 UserMapper 接口**

```java
@Mapper
public interface UserMapper {
    void save(User user);
    List<User> findAll();
}
```

**代码清单 11-3 UserMapper.xml 映射文件**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.linkedbear.springboot.mapper.UserMapper">

    <insert id="save" parameterType="user">
        insert into tbl_user (name,tel) values (#{name}, #{tel})
    </insert>

    <select id="findAll" resultType="User">
        select * from tbl_user
    </select>

</mapper>
```

另外，为了能使 MyBatis 完成实体类别名的预处理以及 mapper.xml 文件的扫描，需要在 Spring Boot 全局配置文件中编写一些额外的配置，如代码清单11-4所示。

**代码清单 11-4 有关 MyBatis 的配置**

```properties
mybatis.type-aliases-package=com.linkedbear.springboot.entity
mybatis.mapper-locations=classpath:mapper/*.xml
mybatis.configuration.map-underscore-to-camel-case=true
```

最后编写 Spring Boot 主启动类，它的编写与第10章的内容几乎完全一致，仅是主启动类的类名不同而已，如代码清单11-5所示。

**代码清单 11-5 主启动类中获取 UserService 并调用**

```java
@SpringBootApplication
@EnableTransactionManagement
public class MyBatisSpringBootApplication {
    public static void main(String[] args) {
        ApplicationContext ctx = SpringApplication.run(MyBatisSpringBootApplication.class, args);
        UserService userService = ctx.getBean(UserService.class);
        userService.test();
    }
}
```

经过上述代码编写，就完成了 Spring Boot 与 MyBatis 的整合。

## 11.3 自动装配核心

在上面的项目搭建中，仅编写了少量的几行配置，便完成了与 MyBatis 框架的整合，而底层的自动配置类完成的大多数组件装配和默认配置的应用。接下来的内容会分析 MyBatis 的场景启动器，研究 MyBatis 在自动装配的部分做了哪些工作。

### 11.3.1 场景启动器的秘密

借助 IDE，观察 mybatis-spring-boot-starter 依赖，可以发现它仅是一个空的 jar 包，没有具体的内容，而这个依赖本身又依赖 mybatis-spring-boot-autoconfigure。

通过前面章节的学习，可以得知这个依赖中通常包含一个 spring.factories 文件。打开 jar 包依赖，可以发现它的确包含一个 spring.factories 文件，这个文件中仅定义了两个自动配置类，如代码清单11-6所示。

**代码清单 11-6 MyBatis 整合 Spring Boot 的自动配置类**

```properties
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
org.mybatis.spring.boot.autoconfigure.MybatisLanguageDriverAutoConfiguration,\
org.mybatis.spring.boot.autoconfigure.MybatisAutoConfiguration
```

由此可知，MyBatis 整合 SpringBoot 的核心装配就在这两个自动配置类上，下面逐一展开研究。

### 11.3.2 MybatisLanguageDriverAutoConfiguration

从 MybatisLanguageDriverAutoConfiguration 的类名中可以得知，它的配置与"语言驱动"有关。要理解"语言驱动"这个概念，需要读者先了解 MyBatis 中的设计。MyBatis 默认使用 XML 映射文件作为载体，且 XML 映射文件中的内容是固定的几个标签，从 MyBatis 3.2 版本开始支持使用第三方模板引擎框架作为编写映射文件的实现，而使用 XML 文件编写仅是 MyBatis 默认提供的映射文件实现。

从 MybatisLanguageDriverAutoConfiguration 的源码中可以发现，MyBatis 支持的第三方模板引擎框架包含 FreeMarker、Velocity、Thymeleaf 等，但是默认场景下 MyBatis 不会引入过多的依赖，这也使得开发者仅熟悉原生的 XML 映射文件编写即可。

### 11.3.3 MybatisAutoConfiguration

spring.factories 中的另一个自动配置类 MybatisAutoConfiguration 才是 MyBatis 整合 Spring Boot 的核心。MyBatis 内部支撑运行的所有组件都在这个配置类中创建。本节内容会完整讲解 MybatisAutoConfiguration 中的所有配置内容。

#### 1. SqlSessionFactory

熟悉 MyBatis 的读者一定清楚，MyBatis 的底层核心支撑是 SqlSessionFactory，有了 SqlSessionFactory 就可以创建 SqlSession，进而使用 SqlSession 进行 CRUD 操作。

MybatisAutoConfiguration 中注册的最关键组件就是这个 SqlSessionFactory，代码清单11-7中列举了创建 SqlSessionFactory 的部分核心逻辑。

**代码清单 11-7 SqlSessionFactory 的创建**

```java
@Bean
@ConditionalOnMissingBean
public SqlSessionFactory sqlSessionFactory(DataSource datasource) throws Exception {
    SqlSessionFactoryBean factory = new SqlSessionFactoryBean();
    
    // 数据源
    factory.setDataSource(dataSource);
    factory.setVfs(SpringBootVFS.class);
    
    // 外部 MyBatis 原生配置文件
    if (StringUtils.hasText(this.properties.getConfigLocation())) {
        factory.setConfigLocation(
            this.resourceLoader.getResource(this.properties.getConfigLocation()));
    }
    
    // 应用 properties 配置
    applyConfiguration(factory);
    if (this.properties.getConfigurationProperties() != null) {
        factory.setConfigurationProperties(this.properties.getConfigurationProperties());
    }
    
    // 设置插件
    if (!ObjectUtils.isEmpty(this.interceptors)) {
        factory.setPlugins(this.interceptors);
    }
    
    // 更多 set 操作......
    return factory.getObject();
}
```

总体看来，创建 SqlSessionFactory 的步骤只是把连接数据库的数据源、全局配置文件中提取出的配置对象、IOC 容器中注册的 MyBatis 拦截器等组件一一应用在 SqlSessionFactoryBean 中，而实际构建 SqlSessionFactory 的动作是最后一行 factory.getObject() 方法调用。这个方法中包含一个至关重要的方法 afterPropertiesSet，它会在经过一些前置判断后执行 buildSqlSessionFactory 方法，以构建实际的 SqlSessionFactory 对象，如代码清单11-8所示。

**代码清单 11-8 getObject 会触发 afterPropertiesSet 方法**

```java
public SqlSessionFactory getObject() throws Exception {
    if (this.sqlSessionFactory == null) {
        afterPropertiesSet();
    }
    return this.sqlSessionFactory;
}

@Override
public void afterPropertiesSet() throws Exception {
    // 判断......
    this.sqlSessionFactory = buildSqlSessionFactory();
}
```

正常情况下 afterPropertiesSet 是 InitializingBean 接口的方法，用于 Bean 初始化阶段的生命周期回调，而 SqlSessionFactoryBean 中调用 getObject 方法获取目标对象时主动回调的目的是，考虑到在 Spring Boot 的整合场景下 SqlSessionFactoryBean 本身不会注册到 IOC 容器中，因此需要手动调用 afterPropertiesSet 方法触发内置 SqlSessionFactory 对象的构建。

下面着重研究 buildSqlSessionFactory 方法。由于这个方法的源码篇幅非常多，为便于读者更好地阅读和理解源码，这里将其拆分为多个片段讲解。

**（1）处理 MyBatis 全局配置对象**

buildSqlSessionFactory 方法的第一部分内容的核心工作是预准备 MyBatis 的全局配置对象 Configuration，并根据是否事先传入外部 configuration 对象或者传入全局配置文件路径来决定是否准备 XMLConfigBuilder，如代码清单11-9所示。

**代码清单 11-9 buildSqlSessionFactory（1）**

```java
protected SqlSessionFactory buildSqlSessionFactory() throws Exception {
    final Configuration targetConfiguration;
    XMLConfigBuilder xmlConfigBuilder = null;
    
    // 如果构建 SqlSessionFactoryBean 时传入了外部 Configuration，则直接处理
    if (this.configuration != null) {
        targetConfiguration = this.configuration;
        if (targetConfiguration.getVariables() == null) {
            targetConfiguration.setVariables(this.configurationProperties);
        } else if (this.configurationProperties != null) {
            targetConfiguration.getVariables().putAll(this.configurationProperties);
        }
    } else if (this.configLocation != null) {
        // 如果传入全局配置文件路径，则封装 XMLConfigBuilder 对象以备加载
        xmlConfigBuilder = new XMLConfigBuilder(
            this.configLocation.getInputStream(), null, this.configurationProperties);
        targetConfiguration = xmlConfigBuilder.getConfiguration();
    } else {
        // 如果无外部 Configuration 对象，则执行默认策略
        targetConfiguration = new Configuration();
        Optional.ofNullable(this.configurationProperties)
            .ifPresent(targetConfiguration::setVariables);
    }
    // ...... 
}
```

**（2）处理内置组件**

紧接着的3个设置动作分别对应 MyBatis 中的三个组件，如代码清单11-10所示。简单解释一下：
- **对象工厂 ObjectFactory**：负责创建 MyBatis 查询包装结果集时创建结果对象（模型类对象、Map 等）
- **对象包装工厂 ObjectWrapperFactory**：负责对创建出的对象进行包装
- **虚拟文件系统 Vfs**：用于加载项目中的资源文件

**代码清单 11-10 buildSqlSessionFactory（2）**

```java
Optional.ofNullable(this.objectFactory)
    .ifPresent(targetConfiguration::setObjectFactory);
Optional.ofNullable(this.objectWrapperFactory)
    .ifPresent(targetConfiguration::setObjectWrapperFactory);
Optional.ofNullable(this.vfs)
    .ifPresent(targetConfiguration::setVfsImpl);
```

在这个环节中 Spring Boot 仅对虚拟文件系统部分进行了扩展，它额外定义了一个 SpringBootVFS 用于加载项目中的资源文件，除此之外没有任何多余的扩展。

**（3）处理别名**

代码清单11-11中的动作是别名的包扫描以及某些特定类的别名设置。MyBatis 允许在项目中为实体类定义别名，这种设计可以使得在映射文件 mapper.xml 中简化类型编写，使映射文件更清爽简洁。在默认情况下包扫描注册的别名就是类名本身（首字母大写），如果类上标注有 @Alias 注解，则会取注解属性值。

**代码清单 11-11 buildSqlSessionFactory（3）**

```java
if (hasLength(this.typeAliasesPackage)) {
    scanClasses(this.typeAliasesPackage, this.typeAliasesSuperType).stream()
        .filter(clazz -> !clazz.isAnonymousClass())
        .filter(clazz -> !clazz.isInterface())
        .filter(clazz -> !clazz.isMemberClass())
        .forEach(targetConfiguration.getTypeAliasRegistry()::registerAlias);
}

if (!isEmpty(this.typeAliases)) {
    Stream.of(this.typeAliases).forEach(typeAlias -> {
        targetConfiguration.getTypeAliasRegistry().registerAlias(typeAlias);
        // logger ......
    });
}
// ......
```

**（4）处理插件、类型处理器**

代码清单11-12的逻辑是处理 MyBatis 插件以及 TypeHandler。注意，此处的 this.plugins 是在 MybatisAutoConfiguration 中利用 ObjectProvider 从 IOC 容器中获取到的。由此就可以得出一个简单结论：Spring Boot 整合 MyBatis 后可以直接向 IOC 容器中注册 MyBatis 的关键组件，底层的自动装配可以将这些组件应用到 MyBatis 中。

**代码清单 11-12 buildSqlSessionFactory（4）**

```java
if (!isEmpty(this.plugins)) {
    Stream.of(this.plugins).forEach(plugin -> {
        targetConfiguration.addInterceptor(plugin);
        // logger ......
    });
}

if (hasLength(this.typeHandlersPackage)) {
    scanClasses(this.typeHandlersPackage, TypeHandler.class).stream()
        .filter(clazz -> !clazz.isAnonymousClass())
        .filter(clazz -> !clazz.isInterface())
        .filter(clazz -> !Modifier.isAbstract(clazz.getModifiers()))
        .forEach(targetConfiguration.getTypeHandlerRegistry()::register);
}

if (!isEmpty(this.typeHandlers)) {
    Stream.of(this.typeHandlers).forEach(typeHandler -> {
        targetConfiguration.getTypeHandlerRegistry().register(typeHandler);
        // logger ......
    });
}

targetConfiguration.setDefaultEnumTypeHandler(defaultEnumTypeHandler);
```

**（5）处理其他内部组件**

除了内部核心的对象工厂、插件、类型处理器等组件，MyBatis 还有一些相对不太重要的内部组件，如脚本语言驱动器（支持多种映射文件格式的编写）、数据库厂商标识器（为数据库可移植性提供了可能）等，如代码清单11-13所示。在构建 SqlSessionFactory 的过程中，这部分组件也会被初始化。

**代码清单 11-13 buildSqlSessionFactory（5）**

```java
if (!isEmpty(this.scriptingLanguageDrivers)) {
    Stream.of(this.scriptingLanguageDrivers).forEach(languageDriver -> {
        targetConfiguration.getLanguageRegistry().register(languageDriver);
        // logger ......
    });
}

Optional.ofNullable(this.defaultScriptingLanguageDriver)
    .ifPresent(targetConfiguration::setDefaultScriptingLanguage);

if (this.databaseIdProvider != null) {
    try {
        targetConfiguration.setDatabaseId(
            this.databaseIdProvider.getDatabaseId(this.dataSource));
    } // catch throwex......
}

Optional.ofNullable(this.cache)
    .ifPresent(targetConfiguration::addCache);
```

**（6）解析 MyBatis 全局配置文件**

在代码清单11-9中有一段配置文件处理，如果项目配置中传入了 configLocation，则此处会使用 XMLConfigBuilder 解析 MyBatis 配置文件，并应用于 MyBatis 全局配置对象 Configuration 中。Spring Boot 已经将 MyBatis 中的配置尽可能地移植到 application.properties 中，所以代码清单11-14中的内容可以忽略。

**代码清单 11-14 buildSqlSessionFactory（6）**

```java
if (xmlConfigBuilder != null) {
    try {
        xmlConfigBuilder.parse();
        // logger
    } // catch finally ......
}
```

**（7）处理数据源和事务工厂**

代码清单11-15中只有一行代码，但它完成了两个组件的初始化：数据源与事务工厂。默认情况下 MyBatis 与 Spring Boot 整合之后，底层使用的事务工厂是 SpringManagedTransactionFactory，了解 MyBatis 底层原理的读者可能会了解 JdbcTransactionFactory，它是 MyBatis 原生控制事务的事务工厂，SpringManagedTransactionFactory 与 JdbcTransactionFactory 的底层事务控制并无太大差别。

**代码清单 11-15 buildSqlSessionFactory（7）**

```java
targetConfiguration.setEnvironment(new Environment(
    this.environment,
    this.transactionFactory == null
        ? new SpringManagedTransactionFactory()
        : this.transactionFactory,
    this.dataSource));
// ......
```

**（8）处理 Mapper**

由于 SqlSessionFactoryBean 的构建中只能传入映射文件 mapper.xml 的路径，因此 SqlSessionFactoryBean 本身的逻辑中并无 Mapper 接口的扫描。从代码清单11-16可以发现，解析映射文件 mapper.xml 的逻辑是借助 XMLMapperBuilder 组件实现的，这个组件会逐个解析 mapper.xml，封装 MappedStatement 并注册到 MyBatis 的全局配置对象 Configuration 中。

**代码清单 11-16 buildSqlSessionFactory（8）**

```java
if (this.mapperLocations != null) {
    if (this.mapperLocations.length == 0) {
        // logger .....
    } else {
        for (Resource mapperLocation : this.mapperLocations) {
            if (mapperLocation == null) {
                try {
                    XMLMapperBuilder xmlMapperBuilder = new XMLMapperBuilder(
                        mapperLocation.getInputStream(),
                        targetConfiguration,
                        mapperLocation.toString(),
                        targetConfiguration.getSqlFragments());
                    xmlMapperBuilder.parse();
                } // catch finally ......
            } // else logger ......
        }
    }
}

return this.sqlSessionFactoryBuilder.build(targetConfiguration);
```

经过巨大的 afterPropertiesSet 方法处理后，SqlSessionFactory 被成功创建，MyBatis 的核心也就初始化完毕了。

#### 2. SqlSessionTemplate

相较于 SqlSessionFactory 的构建过程，SqlSessionTemplate 的构建逻辑非常简单，如代码清单11-17所示。SqlSessionTemplate 本身是一个实现了 SqlSession 接口的模板类，它可以非常简单地调用 MyBatis 的核心 CRUD 方法，而不必关心 SqlSession 的生命周期。在构建 SqlSessionTemplate 时，必传入的组件是 SqlSessionFactory，毕竟只有传入 SqlSessionFactory 之后，SqlSessionTemplate 才能获取到实际的 SqlSession 并调用其方法。除此之外，我们也可以关注一下构建方法的另一个参数，它的类型是一个枚举：ExecutorType。

**代码清单 11-17 SqlSessionTemplate 的创建**

```java
@Bean
@ConditionalOnMissingBean
public SqlSessionTemplate sqlSessionTemplate(SqlSessionFactory sqlSessionFactory) {
    ExecutorType executorType = this.properties.getExecutorType();
    if (executorType != null) {
        return new SqlSessionTemplate(sqlSessionFactory, executorType);
    } else {
        return new SqlSessionTemplate(sqlSessionFactory);
    }
}
```

从类名上理解，ExecutorType 指代的是 SQL 语句的执行类型。MyBatis 内置的 ExecutorType 有三种：

- **SIMPLE**：默认的模式，这种执行类型会在 SqlSession 执行具体的 CRUD 操作时每条 SQL 语句创建一个预处理对象 PreparedStatement 并逐条执行
- **REUSE**：会复用同一条 SQL 语句对应创建的 PreparedStatement，该模式会在一定程度上提高 MyBatis 的执行效率
- **BATCH**：模式下不仅会复用 PreparedStatement 对象，还会执行批量操作，这使得 BATCH 模式的执行效率是最高的。但是使用 BATCH 模式有一个缺陷，即在执行 insert 语句时，如果插入的数据库表的主键是自增序列，则在事务提交之前无法从数据库获得实际的自增 ID 值，这种设计在某些业务场景下是不符合要求的

#### 3. AutoConfiguredMapperScannerRegistrar

由于 SqlSessionFactory 的构建中没有处理 Mapper 接口的扫描，因此 MyBatis 在整合 Spring Boot 时专门提供了一个适配 Spring Boot 项目模式的 Mapper 接口扫描注册器，如代码清单11-18所示。这个扫描器会在 Spring Boot 项目中未标注 @MapperScan 注解时生效。

**代码清单 11-18 @MapperScan 与 Mapper 接口扫描注册器**

```java
@Configuration
@Import(AutoConfiguredMapperScannerRegistrar.class)
@ConditionalOnMissingBean({MapperFactoryBean.class, MapperScannerConfigurer.class})
public static class MapperScannerRegistrarNotFoundConfiguration implements InitializingBean {
    @Override
    public void afterPropertiesSet() {
    }
}

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@Import(MapperScannerRegistrar.class)
public @interface MapperScan {
    String[] value() default {};
}
```

由于 @MapperScan 注解会向 IOC 容器中导入一个 MapperScannerRegistrar 组件，当项目中没有标注该注解时，默认的 AutoConfiguredMapperScannerRegistrar 就会被导入并生效（约定大于配置）。而从代码清单11-19中可以看出，默认注册的 MapperScannerConfigurer 扫描器中的扫描规则是扫描 Spring Boot 主启动类所在包及其子包下所有标注了 @Mapper 注解的接口。

**代码清单 11-19 注册默认的 MapperScannerConfigurer**

```java
public static class AutoConfiguredMapperScannerRegistrar
        implements BeanFactoryAware, ImportBeanDefinitionRegistrar {
    
    private BeanFactory beanFactory;
    
    @Override
    public void registerBeanDefinitions(AnnotationMetadata importingClassMetadata,
            BeanDefinitionRegistry registry) {
        // logger ......
        
        // 取出 Spring Boot 主启动类所在包
        List<String> packages = AutoConfigurationPackages.get(this.beanFactory);
        
        BeanDefinitionBuilder builder = BeanDefinitionBuilder
            .genericBeanDefinition(MapperScannerConfigurer.class);
        builder.addPropertyValue("processPropertyPlaceHolders", true);
        
        // 扫描标识 @Mapper 接口的接口
        builder.addPropertyValue("annotationClass", Mapper.class);
        builder.addPropertyValue("basePackage",
            StringUtils.collectionToCommaDelimitedString(packages));
        
        BeanWrapper beanWrapper = new BeanWrapperImpl(MapperScannerConfigurer.class);
        Stream.of(beanWrapper.getPropertyDescriptors())
            .filter(x -> x.getName().equals("lazyInitialization"))
            .findAny()
            .ifPresent(x -> builder.addPropertyValue(
                "lazyInitialization", "${mybatis.lazy-initialization:}"));
        
        registry.registerBeanDefinition(
            MapperScannerConfigurer.class.getName(), builder.getBeanDefinition());
    }
}
```

以此法注册 MapperScannerConfigurer 后，在项目开发中只需要编写 Mapper 接口并标注 @Mapper 注解，即可被 MapperScannerConfigurer 自动扫描并注册到 IOC 容器中。

至此，MyBatis 整合 Spring Boot 的核心自动装配内容剖析完毕。

## 11.4 小结

本章主要研究了 Spring Boot 整合 MyBatis 持久层框架的自动装配核心，并简单了解了 MyBatis 中核心组件 SqlSessionFactory 的构建流程。MyBatis 的内部核心支撑是一个 SqlSessionFactory，在与 Spring Boot 框架整合时会借助 SqlSessionFactoryBean 的工厂 Bean 创建来完成 MyBatis 的框架初始化。此外，针对 Mapper 动态代理的开发，MyBatis 在整合 Spring Boot 时提供了默认的 Mapper 接口扫描器，以完成 Mapper 接口的代理装配。
