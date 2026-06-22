# 第14章 运行 Spring Boot 应用

本章将深入分析 Spring Boot 应用的运行机制。我们会探讨两种主要的部署方式：独立运行的 jar 包和部署到外部 Web 容器的 war 包，并详细讲解 Spring Boot 2.3 引入的优雅停机特性。通过本章的学习，读者将理解 Spring Boot 是如何实现一键启动的底层原理。

## 14.1 Spring Boot 应用的部署方式

Spring Boot 支持两种主要的部署打包方式：独立运行的 jar 包和部署到外部 Web 容器的 war 包。本节将介绍这两种方式的基本配置方法。

### 14.1.1 以 jar 包的方式

以 jar 包方式打包是 Spring Boot 的默认打包方式。当执行 `mvn package` 命令后，在项目的 `target` 目录下会生成一个可独立运行的 jar 包。

```
springboot-01-quickstart-1.0-RELEASE.jar
springboot-01-quickstart-1.0-RELEASE.jar.original
```

其中，`-original` 后缀的文件是未添加 Spring Boot loader 的原始 jar 包，而可执行的 jar 包包含了 Spring Boot 的引导类，可以通过 `java -jar` 命令直接启动。

### 14.1.2 以 war 包的方式

如果部署的目标环境是一个外部 Web 容器（如 Tomcat、Jetty 等），就需要以 war 包的方式打包项目。这种情况下，需要修改 `pom.xml` 文件添加一些配置，如代码清单 14-2 所示。

**代码清单 14-2 Spring Boot 以 war 打包时需要修改 pom.xml 文件的部分配置**

```xml
<packaging>war</packaging>

<!-- 在 dependencies 中添加 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-tomcat</artifactId>
    <scope>provided</scope>
</dependency>
```

除此之外，还需要修改主启动类或者添加新的类，使其继承 `SpringBootServletInitializer` 类，并重写 `configure` 方法指定配置源为 Spring Boot 主启动类，如代码清单 14-3 所示。

**代码清单 14-3 以 war 打包时需要修改主启动类添加新的继承**

```java
@SpringBootApplication
public class SpringBootQuickstartApplication extends SpringBootServletInitializer {

    public static void main(String[] args) {
        SpringApplication.run(SpringBootQuickstartApplication.class, args);
    }

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
        return builder.sources(SpringBootQuickstartApplication.class);
    }
}
```

上述修改完成后，重新执行 `mvn package` 命令，就会生成一个可以部署到外部 Web 容器的 war 包。接下来，将该 war 包部署至外部 Web 容器（如 Tomcat Server）中并启动，就可以运行 Spring Boot 应用了。

## 14.2 基于 jar 包的独立运行机制

想要搞明白基于 jar 包的独立运行机制，需要先了解可运行 jar 包的一些前置知识。

### 14.2.1 可运行 jar 包的前置知识

从 Oracle 的官网上可以找到有关 jar 文件规范的文档，文档中提到了一个核心目录 `META-INF`，这个目录中会存放当前 jar 包的扩展和配置数据，其中有一个核心配置文件 `MANIFEST.MF`，它以 properties 的配置形式保存了 jar 包的核心元信息。

`MANIFEST.MF` 文件中的核心配置项主要包含以下几个核心内容，如表 14-1 所示。

**表 14-1 MANIFEST.MF 中的核心配置项（节选）**

| 配置项 | 配置含义 | 配置值示例 |
|--------|----------|------------|
| Manifest-Version | 定义 MANIFEST.MF 文件的版本 | 1.0（通常） |
| Class-Path | 指定当前 jar 包所依赖的 jar 包路径（一般是相对路径） | servlet.jar、config/ |
| Main-Class | 对于可运行 jar 包中引导的主启动类的全限定类名 | org.springframework.boot.loader.JarLauncher |

重点关注最后一个配置项 `Main-Class`，它需要指定一个可以在 jar 包的顶层结构中直接找到的、带有 main 方法的启动类的全限定类名。

这里所谓的"顶层结构"是指 jar 包中可以直接在目录中找到的，不需要再解压/探寻 jar 包内部的文件。换句话说，被 `Main-Class` 配置项引用的类必须同它所属的包一起放在可运行 jar 包的顶层。

这里又出现了一个新的概念：jar 包中可能会嵌套 jar 包。这种类型的 jar 包被称为 **Fat Jar**（也称为 Uber Jar），可以解决第三方库不在 classpath 下的加载失败问题。Spring Boot 生成的可运行 jar 包本身就是一种 Fat Jar。

### 14.2.2 Spring Boot 的可运行 jar 包结构

对于 Spring Boot 通过 Maven/Gradle 插件打包的可运行 jar 包，它的内部由 3 个目录构成：

- **BOOT-INF**：存放项目编写且编译好的字节码文件、静态资源文件、配置文件，以及依赖的 jar 包。
- **META-INF**：存放 MANIFEST.MF 等配置元文件。
- **org.springframework.boot.loader**：Spring Boot loader 的核心引导类。

`META-INF` 中的 `MANIFEST.MF` 文件内容如代码清单 14-4 所示。

**代码清单 14-4 MANIFEST.MF 文件的内容**

```
Manifest-Version: 1.0
Spring-Boot-Classpath-Index: BOOT-INF/classpath.idx
Implementation-Version: 1.0-RELEASE
Start-Class: com.linkedbear.springboot.quickstart.SpringBootQuickstartApplication
Spring-Boot-Classes: BOOT-INF/classes/
Spring-Boot-Lib: BOOT-INF/lib/
Build-Jdk-Spec: 1.8
Spring-Boot-Version: 2.3.11.RELEASE
Created-By: Maven Jar Plugin 3.2.0
Main-Class: org.springframework.boot.loader.JarLauncher
```

注意其中的两个配置项：

- `Main-Class: org.springframework.boot.loader.JarLauncher`
- `Start-Class: com.linkedbear.springboot.quickstart.SpringBootQuickstartApplication`

这两个配置分别定义了两个类。其中 `SpringBootQuickstartApplication` 是项目的主启动类，它用一个特殊的配置项 `Start-Class` 来引用。这个配置项本身并不是 `MANIFEST.MF` 文件标准规范中的配置项，而是 Spring Boot 自行定义的。

这意味着，如果直接用 `SpringBootQuickstartApplication` 作为 `Main-Class` 来引导这个可运行 jar 包，是无法启动项目的。

如果我们尝试将 `MANIFEST.MF` 文件中 `Main-Class` 属性的值改为 `SpringBootQuickstartApplication` 并启动，会发现根本无法引导启动 Spring Boot 项目。

无法启动的原因是引导的 `SpringBootQuickstartApplication` 并没有完全放在 jar 包的顶层目录下，而是放在了 `BOOT-INF/classes/` 目录下，中间隔了两层包，所以无法引导。

如果用默认打包好的可运行 jar 包中的 `JarLauncher`，就可以正常引导 Spring Boot 项目启动，这说明 `JarLauncher` 是引导的核心，需要重点研究它的设计。

### 14.2.3 JarLauncher 的设计及工作原理

`JarLauncher` 本身是来自 `spring-boot-loader` 依赖中一个普通的带 main 方法的类，只不过 Spring Boot 需要它来引导可运行 jar 包启动，它才以一种特殊的方式"降临"到 jar 包中。

可以发现连同 `JarLauncher` 在内的非常多字节码文件直接存在于可运行 jar 包的顶层目录下，这是因为可运行 jar 包的规范要求如此，所以 Spring Boot 在打包时不得不将这些 `.class` 文件全部复制到 jar 包中。

#### 1. JarLauncher 的继承结构

借助 IDEA 可以生成包括 `JarLauncher` 在内的类继承关系图。从继承图可以看到，Spring Boot 项目的启动器是通过两个 Launcher 的落地子类实现的：

- `JarLauncher`：处理 jar 包启动
- `WarLauncher`：处理 war 包启动

这两个落地子类同时继承自 `ExecutableArchiveLauncher`。

**（1） Launcher**

`Launcher` 是所有启动 Spring Boot 项目的顶层引导类，它的内部定义了一个非常关键的 `launch` 方法，该方法就是用于启动 Spring Boot 应用的核心方法。

**（2） ExecutableArchiveLauncher**

`ExecutableArchiveLauncher` 从类名上可以理解为"可执行归档文件的启动器"。

这里涉及一个概念"归档文件"，读者可以简单地理解为 jar 包本身。Spring Boot 的独立可运行 jar 包就是一个归档文件，可以放在外部 Web 容器中运行的 war 包也是一个归档文件。

`ExecutableArchiveLauncher` 类中额外拥有的能力主要是可以从归档文件中检索到 Spring Boot 的主启动类，并提供给父类 `Launcher` 以完成主启动类的引导。

**（3） JarLauncher**

`JarLauncher` 是基于 Spring Boot 独立可运行 jar 包的启动引导器，它的内部定义了几个核心的常量，它们与打包好的 jar 包中 `BOOT-INF` 文件夹中的内容一一对应。

```java
public class JarLauncher extends ExecutableArchiveLauncher {

    private static final String DEFAULT_CLASSPATH_INDEX_LOCATION = "BOOT-INF/classpath.idx";

    static final EntryFilter NESTED_ARCHIVE_ENTRY_FILTER = (entry) -> {
        if (entry.isDirectory()) {
            return entry.getName().equals("BOOT-INF/classes/");
        }
        return entry.getName().startsWith("BOOT-INF/lib/");
    };
}
```

请注意，`classpath.idx` 是 Spring Boot 2.3.0 版本之后新添加的成员。在此版本之前的 `JarLauncher` 中的成员更简单清晰：

```java
public class JarLauncher extends ExecutableArchiveLauncher {

    static final String BOOT_INF_CLASSES = "BOOT-INF/classes/";
    static final String BOOT_INF_LIB = "BOOT-INF/lib/";
}
```

在 javadoc 中已经清楚地解释了这两个路径的作用：

> Launcher for JAR based archives. This launcher assumes that dependency jars are included inside a /BOOT-INF/lib directory and that application classes are included inside a /BOOT-INF/classes directory.

翻译：基于 jar 包归档文件的启动器。此启动器假设项目所依赖的 jar 包包含在 `/BOOT-INF/lib` 目录中，并且项目中所定义的类包含在 `/BOOT-INF/classes` 目录中。

依照 javadoc 中描述的规则，可以从打包好的 jar 包中定位到项目中编写的类、配置文件，以及所依赖的所有 jar 包。

**（4） WarLauncher**

`WarLauncher` 是基于 Spring Boot 以外部 Web 容器运行时打包 war 包的启动类引导器。请注意，它本身也是一个启动器，可以将打包好的 war 包使用 `java -jar` 命令引导启动 Spring Boot 应用。

与 jar 包不同，war 包对于所依赖的 jar 包和项目中的 class 有一定限制。对于一个标准 war 包而言，项目中定义的所有类应当放在 `WEB-INF/classes` 目录下，所依赖的 jar 包则放在 `WEB-INF/lib` 下。

除此之外，Spring Boot 为了使 war 包也能独立运行，会将所有作用域为 `provided` 的依赖统一放在 `WEB-INF/lib-provided` 中。这部分在独立运行时可以与 `WEB-INF/lib` 下的依赖同时被加载，而当 war 包放置于 Web 容器时，由于 Web 容器不会读取 `lib-provided` 目录，因此这部分不会被加载，这样就同时兼容了两种启动方式。

#### 2. JarLauncher 的引导原理

在 `JarLauncher` 内部定义了一个 main 方法，它就是整个可运行 jar 包运行时的入口。

```java
public JarLauncher() {}

public static void main(String[] args) throws Exception {
    new JarLauncher().launch(args);
}
```

`JarLauncher` 的构造方法中没有任何动作，也没有调用父类的构造方法，所以所有动作都在后面的 `launch` 方法中。注意，`launch` 方法没有在 `JarLauncher` 中定义，而是在顶层父类 `Launcher` 中定义。

```java
// 父类 Launcher
protected void launch(String[] args) throws Exception {
    // 注册 URL 协议并清除应用缓存
    if (!isExploded()) {
        JarFile.registerUrlProtocolHandler();
    }
    // 创建类加载器
    ClassLoader classLoader = createClassLoader(getClassPathArchivesIterator());
    String jarMode = System.getProperty("jarmode");
    // 获取主启动类的类名
    String launchClass = (jarMode != null && !jarMode.isEmpty())
            ? JAR_MODE_LAUNCHER : getMainClass();
    // 执行主启动类的 main 方法
    launch(args, launchClass, classLoader);
}
```

`launch` 方法的文档注释中有这么一句话：本方法是一个入口点，且应该被一个 `public static void main(String[] args)`（即 main 方法）调用。这句话刚好与上方 `JarLauncher` 中的 main 方法相呼应。

整个 `launch` 方法中的核心步骤可以拆分为 3 步，下面分步解释其原理。

**（1）创建 ClassLoader**

由于可独立运行的 jar 包中使用常规的类加载器无法加载内部 jar 包中的类，因此 Spring Boot 需要对其进行特殊处理。`createClassLoader` 方法中会创建一个特殊的类加载器 `LaunchedURLClassLoader`，它可以加载内部嵌套 jar 包中的类。

具体分析源码，需要进入 `createClassLoader` 方法中，但在此之前需要读者先关注 `createClassLoader` 方法中传入的参数：`getClassPathArchivesIterator()`。很明显这是将一个方法执行完毕后的返回值传入了 `createClassLoader` 方法中，所以需要先进入获取参数的 `getClassPathArchivesIterator` 方法中。

```java
protected Iterator<Archive> getClassPathArchivesIterator() throws Exception {
    Archive.EntryFilter searchFilter = this::isSearchCandidate;
    Iterator<Archive> archives = this.archive.getNestedArchives(searchFilter,
            (entry) -> isNestedArchive(entry) && !isEntryIndexed(entry));
    if (isPostProcessingClassPathArchives()) {
        archives = applyClassPathArchivePostProcessing(archives);
    }
    return archives;
}
```

通过 `getClassPathArchivesIterator` 方法，可以将当前 Spring Boot 应用中依赖的嵌套 jar 包和字节码文件都获取到，并且以迭代器的形式返回。获取的关键动作是中间的 `this.archive.getNestedArchives` 方法，它需要传入两个过滤器：一个是搜索范围，另一个是过滤条件。

对于可独立运行的 jar 文件来讲，搜索范围是所有路径以 `BOOT-INF` 开头的文件，而过滤条件是筛选所有 `BOOT-INF/lib` 目录下的文件以及 `BOOT-INF/classes` 目录下的所有文件。

```java
// 搜索范围
protected boolean isSearchCandidate(Archive.Entry entry) {
    return entry.getName().startsWith("BOOT-INF/");
}

// 过滤条件
protected boolean isNestedArchive(Archive.Entry entry) {
    return NESTED_ARCHIVE_ENTRY_FILTER.matches(entry);
}

static final EntryFilter NESTED_ARCHIVE_ENTRY_FILTER = (entry) -> {
    // 收集 BOOT-INF/classes 下的文件夹
    if (entry.isDirectory()) {
        return entry.getName().equals("BOOT-INF/classes/");
    }
    // 收集 BOOT-INF/lib 下的所有文件
    return entry.getName().startsWith("BOOT-INF/lib/");
};
```

通过观察源码，读者可以很明确地理解 Spring Boot 打包好的 jar 包中每个文件夹的含义：

- `BOOT-INF/classes` 目录存放的是当前 Spring Boot 项目中编写的所有类经过编译之后的字节码文件
- `BOOT-INF/lib` 目录存放的是当前 Spring Boot 项目所依赖的所有 jar 包

加载上述文件之后，就进入了创建 ClassLoader 的方法中。在创建类加载器之前，`createClassLoader` 方法会将上一步获取到的 Archive 对象转换成一个一个 URL 对象，每个 URL 对象对应一个 jar 包或者字节码文件目录的路径。转换完成后，最终要创建的 ClassLoader 实现类是 `LaunchedURLClassLoader`。

```java
protected ClassLoader createClassLoader(Iterator<Archive> archives) throws Exception {
    List<URL> urls = new ArrayList<>(guessClassPathSize());
    while (archives.hasNext()) {
        urls.add(archives.next().getUrl());
    }
    if (this.classPathIndex != null) {
        urls.addAll(this.classPathIndex.getUrls());
    }
    return createClassLoader(urls.toArray(new URL[0]));
}

protected ClassLoader createClassLoader(URL[] urls) throws Exception {
    return new LaunchedURLClassLoader(isExploded(), getArchive(), urls,
            getClass().getClassLoader());
}
```

`LaunchedURLClassLoader` 创建完成后，`launch` 的第一步就执行完毕了。

**（2）获取主启动类名**

`launch` 方法的倒数第二行会执行 `getMainClass` 方法，定位当前 Spring Boot 应用的主启动类，它的实现要向下找到 `Launcher` 的子类 `ExecutableArchiveLauncher`。

```java
private static final String START_CLASS_ATTRIBUTE = "Start-Class";

protected String getMainClass() throws Exception {
    Manifest manifest = this.archive.getManifest();
    String mainClass = null;
    if (manifest != null) {
        mainClass = manifest.getMainAttributes().getValue(START_CLASS_ATTRIBUTE);
    }
    if (mainClass == null) {
        throw new Exception("Main class not found");
    }
    return mainClass;
}
```

从源码中可以清晰地看出，解析 Spring Boot 主启动类的方式就是提取 `MANIFEST.MF` 文件中的 `Start-Class` 属性对应的值。

**（3）执行主启动类的 main 方法**

特殊的类加载器 `LaunchedURLClassLoader` 以及主启动类都获取到之后，最后一步是真正启动 Spring Boot 应用。进入重载的 `launch` 方法中，可以发现触发主启动类 main 方法的机制是借助 `MainMethodRunner`，利用反射机制调用 Spring Boot 主启动类的 main 方法。

```java
protected void launch(String[] args, String launchClass, ClassLoader classLoader) throws Exception {
    Thread.currentThread().setContextClassLoader(classLoader);
    // 创建 MainMethodRunner，并调用 run 方法
    createMainMethodRunner(launchClass, args, classLoader).run();
}

protected MainMethodRunner createMainMethodRunner(String mainClass, String[] args, ClassLoader classLoader) {
    return new MainMethodRunner(mainClass, args);
}

public void run() throws Exception {
    Class<?> mainClass = Class.forName(this.mainClassName, false,
            Thread.currentThread().getContextClassLoader());
    Method mainMethod = mainClass.getDeclaredMethod("main", String[].class);
    mainMethod.setAccessible(true);
    mainMethod.invoke(null, new Object[] {this.args});
}
```

当 Spring Boot 主启动类的 main 方法被反射调用成功后，Spring Boot 应用即可顺利启动，基于 `JarLauncher` 的启动引导完成。

#### 3. WarLauncher 的引导原理

使用 `WarLauncher` 的引导原理在本质上与 `JarLauncher` 并无太大区别，只是在定位 jar 包和字节码文件时搜索的目录不同。

```java
protected boolean isSearchCandidate(Entry entry) {
    return entry.getName().startsWith("WEB-INF/");
}

public boolean isNestedArchive(Archive.Entry entry) {
    if (entry.isDirectory()) {
        return entry.getName().equals("WEB-INF/classes/");
    }
    return entry.getName().startsWith("WEB-INF/lib/")
            || entry.getName().startsWith("WEB-INF/lib-provided/");
}
```

由于标准 war 包中项目编译后的字节码文件和 jar 包会分别放入 `WEB-INF/classes` 和 `WEB-INF/lib` 中，而部署到外部 Servlet 容器中解压后的 web 项目也是如此，因此 Spring Boot 为了同时兼容这两种情况，在搜索 Archive 归档文件时做出了一些调整。

除此之外，`WarLauncher` 的启动引导原理与 `JarLauncher` 并无区别，不再赘述。

## 14.3 基于 war 包的外部 Web 容器运行机制

基于 war 包的外部容器运行需要借助 Servlet 3.0 规范的一个引导机制，这个机制是引导 Spring Boot 应用启动的核心，我们需要先对它有所了解。

### 14.3.1 Servlet 3.0 规范中引导应用启动的说明

在 Servlet 3.0 规范文档的 8.2.4 节中有对运行时插件的描述，以下内容节选自该小节：

> An instance of the ServletContainerInitializer is looked up via the jar services API by the container at container / application startup time. The framework providing an implementation of the ServletContainerInitializer MUST bundle in the META-INF/services directory of the jar file a file called javax.servlet.ServletContainerInitializer, as per the jar services API, that points to the implementation class of the ServletContainerInitializer.

翻译：在容器/应用程序启动时，容器通过 SPI 机制查找 `ServletContainerInitializer` 的实例。提供 `ServletContainerInitializer` 实现的框架必须在 jar 包的 `META-INF/services` 目录中定义一个名为 `javax.servlet.ServletContainerInitializer` 的文件，根据 SPI 机制，找到对应的 `ServletContainerInitializer` 接口的实现类。

由该段描述可以得知，Servlet 容器启动应用时会扫描项目及依赖 jar 包中 `ServletContainerInitializer` 接口的实现类。如果项目依赖的框架需要在启动时初始化，就必须在 jar 包的 `META-INF/services` 目录中提供一个名为 `javax.servlet.ServletContainerInitializer` 的文件，文件内容要标明 `ServletContainerInitializer` 接口实现类的全限定名。

从代码清单 14-13 中可以发现，`ServletContainerInitializer` 本身是一个接口，它仅有一个 `onStartup` 方法。不难推测出 Servlet 容器启动时会回调 `onStartup` 方法以完成应用的初始化逻辑。

**代码清单 14-13 ServletContainerInitializer**

```java
public interface ServletContainerInitializer {
    void onStartup(Set<Class<?>> c, ServletContext ctx) throws ServletException;
}
```

此外，实现了 `ServletContainerInitializer` 接口的实现类可以在类上标注 `@HandlesTypes` 注解，并指定一些感兴趣的类（或接口类型）。Servlet 容器初始化时会将这些感兴趣的类（或接口的实现类）传入 `onStartup` 方法的第一个参数中，以此可以完成一些更高级的处理。

Spring Boot 为了适配外部 Servlet 容器启动的方式，提供了一个特殊的 `ServletContainerInitializer` 实现类 `SpringServletContainerInitializer`，这个类会使用上述 Servlet 规范中的特性。

### 14.3.2 SpringBootServletInitializer 的作用和原理

在研究 `SpringBootServletInitializer` 的作用机制之前，先请读者回想一下 Spring Boot 打包 war 包时的必要步骤。

除了修改 `pom.xml` 文件中的打包方式、修改嵌入式 Web 容器的作用域，还需要编写一个 `SpringBootServletInitializer` 的子类，指定 Spring Boot 主启动类作为启动源：

```java
public class ServletInitializer extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(SpringBootLaunchApplication.class);
    }
}
```

如此编写的目的是在当前的 Spring Boot 项目中提供一个 `SpringBootServletInitializer` 的子类，从而让外部 Servlet 容器在启动时可以加载该子类，从而初始化和启动 Spring Boot 应用。下面结合源码分析外部 Servlet 容器如何引导和启动 Spring Boot 应用。

#### 1. ServletContainerInitializer 的加载

当外部 Servlet 容器启动时，默认会加载 webapp 目录下的 war 包，此时被打包成 war 包的 Spring Boot 项目被解压，Servlet 容器会从当前项目及项目所依赖的 jar 包中搜索一个全路径名为 `META-INF/services/javax.servlet.ServletContainerInitializer` 的文件（该特性基于 JDK SPI 机制）。

如果可以成功搜索到该文件，则会加载文件中定义的全限定类名对应的类。从 spring-web 依赖中可以找到该文件，对应的类是 `SpringServletContainerInitializer`。这个类上标注了 `@HandlesTypes` 注解，它感兴趣的类型是 `WebApplicationInitializer`，这意味着 `SpringServletContainerInitializer` 的 `onStartup` 方法会获取当前项目中所有实现了 `WebApplicationInitializer` 接口的最终落地实现类。

**代码清单 14-15 SpringServletContainerInitializer**

```java
@HandlesTypes(WebApplicationInitializer.class)
public class SpringServletContainerInitializer implements ServletContainerInitializer {

    @Override
    public void onStartup(Set<Class<?>> webAppInitializerClasses, ServletContext servletContext) throws ServletException {
        // 加载、实例化 WebApplicationInitializer 对象 ...
        for (WebApplicationInitializer initializer : initializers) {
            initializer.onStartup(servletContext);
        }
    }
}
```

#### 2. SpringBootServletInitializer 的加载

请注意，上面提到的 `ServletInitializer` 本身就是一个 `WebApplicationInitializer`，所以在 `SpringServletContainerInitializer` 的 `onStartup` 方法中实际上获取的就是当前项目中定义的 `ServletInitializer` 类，并在实例化对象后调用其 `onStartup` 方法。

```java
public class ServletInitializer extends SpringBootServletInitializer {
    // ...
}

public abstract class SpringBootServletInitializer implements WebApplicationInitializer {
    // ...
}
```

由于 `onStartup` 方法定义在 `ServletInitializer` 的父类 `SpringBootServletInitializer` 中，下面的研究重点放在父类的源码上。

#### 3. SpringApplication 的构建与启动

`SpringBootServletInitializer` 的 `onStartup` 方法的核心动作是创建一个 `WebApplicationContext`，而创建的过程需要构建 `SpringApplication` 并启动。

```java
public void onStartup(ServletContext servletContext) throws ServletException {
    // ...
    WebApplicationContext rootApplicationContext = createRootApplicationContext(servletContext);
}

protected WebApplicationContext createRootApplicationContext(ServletContext servletContext) {
    SpringApplicationBuilder builder = createSpringApplicationBuilder();
    builder.main(getClass());
    ApplicationContext parent = getExistingRootWebApplicationContext(servletContext);
    // 存在父容器的处理
    builder.initializers(new ServletContextApplicationContextInitializer(servletContext));
    builder.contextClass(AnnotationConfigServletWebServerApplicationContext.class);
    // 【关键】注意此处会跳转至自定义的 ServletInitializer 子类
    builder = configure(builder);
    builder.listeners(new WebEnvironmentPropertySourceInitializer(servletContext));
    // 构建 SpringApplication
    SpringApplication application = builder.build();
    // 基于外部 Servlet 容器启动不需要注册回调钩子
    application.setRegisterShutdownHook(false);
    // 启动 SpringApplication
    return run(application);
}

protected WebApplicationContext run(SpringApplication application) {
    return (WebApplicationContext) application.run();
}
```

注意 `createRootApplicationContext` 方法的中间有 `configure` 方法的调用动作，该方法就是子类 `ServletInitializer` 中用来编程式指定 Spring Boot 主启动类的关键步骤。

经过 `SpringApplicationBuilder` 的构建并调用 `SpringApplication` 的 run 方法，Spring Boot 项目即可成功启动。

## 14.4 Spring Boot 2.3 新特性：优雅停机

在 Spring Boot 的应用运行需要停机时，如果直接关闭应用，会导致部分正在处理中的请求被强制中断，在某些特殊的业务场景中会产生脏数据。为了解决这一问题，Spring Boot 2.3 中引入了"优雅停机"（Graceful Shutdown）的新特性。

当 Spring Boot 应用被关闭时（注意此处的关闭可以是 `kill -2`，但不能是 `kill -9`），Spring Boot 会预留一小段时间，使应用内部的业务线程执行完毕，此时嵌入式 Web 容器不允许客户端有新的请求进入，以此达到优雅停机的效果。

### 14.4.1 测试优雅停机场景

下面通过一个简单的测试场景来体会优雅停机的作用效果。需要编写一个处理时间很长的接口，`Handler` 中使线程休眠 10 秒，模拟业务逻辑的处理，在线程休眠的前后添加时间戳的打印，以便于测试观察。

**代码清单 14-18 GracefulTestController 用于测试长时间响应接口**

```java
@RestController
public class GracefulTestController {

    @GetMapping("/test")
    public String test() throws Exception {
        System.out.println(System.currentTimeMillis());
        TimeUnit.SECONDS.sleep(10);
        System.out.println(System.currentTimeMillis());
        return "success";
    }
}
```

默认情况下 Spring Boot 的停机方式是立即停机（immediate），若想启用优雅停机，需要在 `application.properties` 中配置 `server.shutdown=graceful`，配置完毕即代表开启默认策略的优雅停机。此外还可以通过配置 `spring.lifecycle.timeout-per-shutdown-phase` 属性，自定义缓冲时间（默认为 30 秒）。

请注意，如果读者在学习时使用 IDE 测试优雅停机，需要修改主启动类的内容，或者引入 actuator 依赖实现优雅停机，而不是借助 IDE 的停止应用。如果直接点击 IDE 中的停止按钮，会直接关闭 JVM（类似于 `kill -9`），从而导致无法触发优雅停机的回调机制。

**代码清单 14-19 使用 IDE 测试优雅停机的必要修改**

```java
@SpringBootApplication
public class SpringBootLaunchApplication {

    public static void main(String[] args) {
        ApplicationContext ctx = SpringApplication.run(SpringBootLaunchApplication.class, args);
        // 借助 scanner 实现控制台软退出
        Scanner scanner = new Scanner(System.in);
        while (true) {
            String input = scanner.nextLine();
            if ("exit".equals(input)) {
                break;
            }
        }
        SpringApplication.exit(ctx);
    }
}
```

准备工作完成后启动项目，使用浏览器访问 `localhost:8080/test`，此时若不干预，浏览器在等待 10 秒后会接收到"success"的字符串响应。

若访问请求用手动停止 Spring Boot 项目，可以发现浏览器仍然在等待响应，并在 10 秒后接收到来自服务端的"success"响应。控制台日志如下：

```
DispatcherServlet: Completed initialization in 4 ms
// 此行为手动输入
exit
// 输入之后控制台会打印 GracefulShutdown 的缓冲等待
GracefulShutdown: Commencing graceful shutdown. Waiting for active requests to complete
GracefulShutdown: Graceful shutdown complete
ThreadPoolTaskExecutor: Shutting down ExecutorService 'applicationTaskExecutor'
```

不同的嵌入式 Web 容器在优雅停机期间应对客户端新请求的响应策略不同：

- **嵌入式 Tomcat 和 Netty**：不会接收请求，客户端会响应超时
- **嵌入式 Undertow**：则会直接响应 503 错误

### 14.4.2 优雅停机的实现原理

简单了解优雅停机的使用与现象后，下面解释优雅停机的实现原理。以嵌入式 Tomcat 为例。

在 `TomcatServletWebServerFactory` 创建 `TomcatWebServer` 时，传入的 `Shutdown` 枚举即代表停机策略。注意，此处的参数 `shutdown` 就是 Spring Boot 全局配置文件中 `server.shutdown` 的值。

```java
protected TomcatWebServer getTomcatWebServer(Tomcat tomcat) {
    return new TomcatWebServer(tomcat, getPort() >= 0, getShutdown());
}

public TomcatWebServer(Tomcat tomcat, boolean autostart, Shutdown shutdown) {
    Assert.notNull(tomcat, "Tomcat Server must not be null");
    this.tomcat = tomcat;
    this.autostart = autostart;
    // 此处会初始化优雅停机的回调钩子
    this.gracefulShutdown = (shutdown == Shutdown.GRACEFUL)
            ? new GracefulShutdown(tomcat) : null;
    initialize();
}
```

当 Spring Boot 项目关闭时，根据回调钩子机制，`WebServerGracefulShutdownLifecycle` 会被调用，触发停机逻辑判断。

```java
public void stop(Runnable callback) {
    this.running = false;
    this.webServer.shutDownGracefully((result) -> callback.run());
}

public void shutDownGracefully(GracefulShutdownCallback callback) {
    if (this.gracefulShutdown == null) {
        callback.shutdownComplete(GracefulShutdownResult.IMMEDIATE);
        return;
    }
    // 此处会执行优雅停机
    this.gracefulShutdown.shutDownGracefully(callback);
}
```

默认情况下停机的模式是 `IMMEDIATE`，对应的 if 结构会立即关闭；而如果在嵌入式 Web 容器初始化时设置了优雅停机，则会执行 if 结构下面的最后一行代码，即调用 `GracefulShutdown` 的 `shutDownGracefully` 方法。

`shutDownGracefully` 方法完成的工作是延迟关闭嵌入式 Web 容器，它会在内部启动一个新的线程，执行 `doShutdown` 方法。

```java
void shutDownGracefully(GracefulShutdownCallback callback) {
    logger.info("Commencing graceful shutdown. Waiting for active requests to complete");
    new Thread(() -> doShutdown(callback), "tomcat-shutdown").start();
}

private void doShutdown(GracefulShutdownCallback callback) {
    // 关闭 Connector，失去接收客户端新请求的能力
    List<Connector> connectors = getConnectors();
    connectors.forEach(this::close);

    try {
        for (Container host : this.tomcat.getEngine().findChildren()) {
            for (Container context : host.findChildren()) {
                // 每隔 50ms 检查一次 Container 是否停止
                while (isActive(context)) {
                    if (this.aborted) {
                        // logger ...
                        callback.shutdownComplete(GracefulShutdownResult.REQUESTS_ACTIVE);
                        return;
                    }
                    Thread.sleep(50);
                }
            }
        }
        logger.info("Graceful shutdown complete");
        callback.shutdownComplete(GracefulShutdownResult.IDLE);
    } // catch ...
}
```

`doShutdown` 方法中首先会关闭 Connector，由此 Tomcat 就失去了接收客户端新请求的能力。随后该方法中会提取出嵌入式 Tomcat 中所有 Engine 中的所有 Context，每隔 50ms 检查其是否停止，当所有 Context 中的线程全部执行完毕，即 Context 全部停止时，优雅停机流程执行完毕。

由上述代码中可以看到测试中打印的两行日志，证明优雅停机在底层的确生效了。

## 14.5 小结

本章从 Spring Boot 的部署运行出发，分别分析了可独立运行的 jar 包和借助外部 Web 容器的 war 包运行的底层机制，以及其中的特殊设计。

Spring Boot 的强大特性之一就是可独立运行，它通过定制的 jar/war 包目录规则，配合特殊的类加载器，可以实现项目的可独立运行。此外，Spring Boot 2.3 新提供的优雅停机特性，可以使项目更可靠地关闭，避免正在处理中的请求被强制中断而产生脏数据。
