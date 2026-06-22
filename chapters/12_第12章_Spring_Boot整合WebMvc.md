# 第12章 Spring Boot 整合 WebMvc

## 12.1 自动配置核心

Spring Boot 为 Spring MVC 提供了自动配置功能，在大多数应用场景下开箱即用。自动配置的核心是 `ServletWebServerFactoryAutoConfiguration`，它主要完成以下工作：

- 注册嵌入式 Web 容器的相关配置，根据项目依赖决定使用哪种容器（Tomcat、Jetty 等）
- 注册 `BeanPostProcessorsRegistrar`，用于导入处理定制器的后置处理器
- 注册 `WebServerFactoryCustomizer`，用于将 `server.*` 系列配置应用到嵌入式 Web 容器中

### 12.1.1 Spring MVC 自动装配内容

根据 Spring Boot 官方文档的描述，Spring MVC 自动配置包含以下核心功能：

**视图解析器**
- 自动配置 `InternalResourceViewResolver`、`BeanNameViewResolver` 等视图解析器

**静态资源支持**
- 支持静态资源的自动处理
- 支持 WebJars 资源映射

**数据转换与格式化**
- 自动注册 `Converter`、`GenericConverter`、`Formatter` 等转换器和格式化器
- 支持 `HttpMessageConverter` 用于请求/响应数据的转换

**其他功能**
- 自动注册 `MessageCodesResolver` 用于国际化消息处理
- 支持静态首页（index.html）映射
- 支持网站图标（favicon）映射
- 自动使用 `ConfigurableWebBindingInitializer` 进行数据绑定

### 12.1.2 自定义配置

如果需要在保留 Spring Boot MVC 自动配置的基础上进行更多自定义（如添加拦截器、格式化器、视图控制器等），可以添加自定义的 `@Configuration` 类实现 `WebMvcConfigurer` 接口，但**不要**使用 `@EnableWebMvc` 注解。

```java
@Configuration
public class CustomWebMvcConfigurer implements WebMvcConfigurer {
    // 自定义配置
}
```

## 12.2 WebMvc 的核心组件

下面我们来了解 WebMvc 中的核心组件的设计和作用，从宏观层面认识 WebMvc 的架构设计以及整体工作流程。

### 12.2.1 DispatcherServlet

`DispatcherServlet` 是 WebMvc 最核心的前端控制器，它统一接收客户端（浏览器）的所有请求，并根据请求的 URI 转发给项目中编写好的 Controller 中的方法。

需要特别注意：**匹配寻找和请求转发的工作，以及返回视图、响应 JSON 数据的处理，都不由 DispatcherServlet 直接完成，而是委托给其他组件协作完成**。

WebMvc 中各组件职责划分清晰，每个组件各司其职：

```
浏览器 ──────► DispatcherServlet ──────► Handler
                      │                     │
                      │                     ▼
                      │               HandlerMapping
                      │                     │
                      │                     ▼
                      │                HandlerAdapter
                      │                     │
                      ▼                     ▼
                   视图渲染            ViewResolver
```

### 12.2.2 Handler

**Handler 的概念**：在项目开发中，标注了 `@RequestMapping` 注解（或其派生注解如 `@GetMapping`、`@PostMapping` 等）的方法就是一个 Handler。

Handler 的主要工作：
1. 处理客户端发送的请求
2. 声明响应视图或响应 JSON 数据

`DispatcherServlet` 接收到请求后，只要能匹配到标注了 `@RequestMapping` 注解的方法，就会将请求转发给相应的 Handler 处理。

```
┌─────────┐      请求       ┌─────────────────┐
│  浏览器  │ ─────────────► │ DispatcherServlet │
└─────────┘                └────────┬─────────┘
                                      │ 转发请求
                                      ▼
                            ┌─────────────────────┐
                            │ @RequestMapping     │
                            │   Handler (Controller方法) │
                            └─────────────────────┘
                                      │ 响应
                                      ▼
                               ┌──────────────┐
                               │    视图/JSON   │
                               └──────────────┘
```

### 12.2.3 HandlerMapping

**HandlerMapping** 是处理器映射器，它的作用是根据 URI 去匹配查找能处理请求的 Handler。

`DispatcherServlet` 本身不做匹配工作，而是委托给 `HandlerMapping` 完成。

匹配到 Handler 后，`HandlerMapping` 并不是直接返回 Handler，而是将其与该请求涉及的拦截器一起封装成 `HandlerExecutionChain` 对象返回。这样做的好处是：如果请求需要被拦截器处理，则在执行 Handler 之前会先执行这些拦截器。

```java
public interface HandlerMapping {
    HandlerExecutionChain getHandler(HttpServletRequest request) throws Exception;
}
```

**HandlerMapping 的主要实现**：

| 实现类 | 说明 | 使用场景 |
|--------|------|----------|
| `RequestMappingHandlerMapping` | 支持 `@RequestMapping` 注解 | **最常用**，项目开发首选 |
| `BeanNameUrlHandlerMapping` | 使用 Bean 名称作为请求路径 | 需要 Controller 实现 `Controller` 接口，已淘汰 |
| `SimpleUrlHandlerMapping` | 集中配置请求路径与 Controller 的映射 | 早期 XML 配置方式，已淘汰 |

**RequestMappingHandlerMapping 的优势**：
- 基于注解驱动开发，灵活方便
- 一个 Controller 类可以定义多个请求路径
- 与 `@Controller` 和 `@RequestMapping` 注解配合使用

### 12.2.4 HandlerAdapter

`DispatcherServlet` 获取到 `HandlerExecutionChain` 后，下一步是执行这些拦截器和 Handler。它选择委托给 **HandlerAdapter** 来执行。

**HandlerAdapter** 意为处理器适配器，它的作用是执行封装好的 Handler。

```
┌─────────────┐      HandlerExecutionChain       ┌──────────────────┐
│DispatcherServlet│ ─────────────────────────► │   HandlerAdapter   │
└─────────────┘                                └────────┬─────────┘
                                                         │
                                                         ▼
                                                 ┌──────────────────┐
                                                 │      Handler      │
                                                 └──────────────────┘
```

**适配器模式的意义**：

现实中的例子：U 盘和 TF 卡都是外置闪存设备，但 U 盘可以直接插入 USB 口，TF 卡不可以。这时需要一个读卡器作为"桥梁"，将 TF 卡插入读卡器，读卡器就可以插入 USB 口了。

在 WebMvc 中，Handler 的编写方式有多种：
- `@Controller` + `@RequestMapping` 注解方式
- 实现 `Controller` 接口方式
- 实现 `Servlet` 接口方式

`HandlerAdapter` 使用适配器模式，将不同类型的 Handler 以 `Object` 形式接收，再针对不同的 Handler 匹配对应的适配器执行。

**WebMvc 中的 HandlerAdapter 实现**：

| 实现类 | 说明 |
|--------|------|
| `RequestMappingHandlerAdapter` | 基于 `@RequestMapping` 的适配器，底层使用反射调用【**最常用**】 |
| `SimpleControllerHandlerAdapter` | 基于 `Controller` 接口的适配器 |
| `SimpleServletHandlerAdapter` | 基于 `Servlet` 接口的适配器 |

**WebMvc 管理 Servlet**：

Servlet 也可以作为 Handler 的一员，WebMvc 提供了对应的适配器。这意味着可以把 Servlet 直接注入 WebMvc 的 IOC 容器中，而不需要通过 `web.xml` 或 `@WebServlet` 的方式注册。

### 12.2.5 ViewResolver

`DispatcherServlet` 获取到 HandlerAdapter 返回的 `ModelAndView` 后，接下来的工作是响应视图，这部分委托给 **ViewResolver** 处理。

`ViewResolver` 会根据 `ModelAndView` 中存放的视图名称到预先配置好的位置查找对应的视图文件（如 JSP、HTML 等），并进行实际的视图渲染。

```
┌─────────────┐    ModelAndView     ┌──────────────────┐
│DispatcherServlet│ ──────────────► │   ViewResolver   │
└─────────────┘                      └────────┬─────────┘
                                                │
                                                ▼
                                         ┌──────────────┐
                                         │     View      │
                                         └──────────────┘
```

**ViewResolver 的实现**：

| 实现类 | 说明 |
|--------|------|
| `InternalResourceViewResolver` | 最常用，支持视图路径前后缀配置（继承自 `UrlBasedViewResolver`） |
| `FreeMarkerViewResolver` | 支持 FreeMarker 模板引擎 |
| `GroovyMarkupViewResolver` | 支持 Groovy 模板引擎 |

**视图解析流程**：
1. 根据逻辑视图名获取视图对象
2. 调用 View 的 `render()` 方法进行渲染
3. 将渲染结果返回给 DispatcherServlet

**注意**：响应 JSON 数据不由 ViewResolver 处理，而是由 `HttpMessageConverter` 处理（后续章节讲解）。

## 12.3 @Controller 控制器装配原理

当编写的 Controller 类中标注有 `@Controller` 或其派生注解，并声明 `@RequestMapping` 注解的方法时，即可装载到 WebMvc 中完成视图跳转/数据响应的功能。本节深入初始化的流程，探究这些 Handler 是如何被识别并装载到 WebMvc 中的。

### 12.3.1 初始化 RequestMapping 的入口

使用 `@RequestMapping` 声明的 Handler，底层一定会与 `RequestMappingHandlerMapping` 关联。`WebMvcAutoConfiguration` 中已经初始化了 `RequestMappingHandlerMapping`。

观察 `RequestMappingHandlerMapping` 的方法实现，发现它实现了 `InitializingBean` 接口，在对象初始化阶段会调用 `afterPropertiesSet` 方法，这个方法就是初始化 RequestMapping 的核心逻辑。

```java
public void afterPropertiesSet() {
    this.config = new RequestMappingInfo.BuilderConfiguration();
    this.config.setUrlPathHelper(getUrlPathHelper());
    // ... 其他配置

    super.afterPropertiesSet();  // 调用父类方法
}

// 父类 AbstractHandlerMethodMapping 中的实现
public void afterPropertiesSet() {
    initHandlerMethods();  // 核心初始化方法
}
```

`initHandlerMethods` 方法的逻辑：

```java
private static final String SCOPED_TARGET_NAME_PREFIX = "scopedTarget.";

protected void initHandlerMethods() {
    // 获取 IOC 容器中的所有 Bean 名称
    for (String beanName : getCandidateBeanNames()) {
        // 排除 scopedTarget 前缀的 Bean（通常是 Spring Cloud 中的代理对象）
        if (!beanName.startsWith(SCOPED_TARGET_NAME_PREFIX)) {
            processCandidateBean(beanName);
        }
    }
    handlerMethodsInitialized(getHandlerMethods());
}
```

### 12.3.2 processCandidateBean

判断一个 Bean 是否是 WebMvc 的 Controller，只需判断类上是否标注了 `@Controller` 注解（或派生注解）或者 `@RequestMapping` 注解（或派生注解）。

```java
protected void processCandidateBean(String beanName) {
    Class<?> beanType = null;
    try {
        beanType = obtainApplicationContext().getType(beanName);
    } catch (Throwable ex) {
        // 忽略异常
    }

    // 判断是否是 Handler
    if (beanType != null && isHandler(beanType)) {
        detectHandlerMethods(beanName);
    }
}

// 判断是否是 Handler 的标准
protected boolean isHandler(Class<?> beanType) {
    return (AnnotatedElementUtils.hasAnnotation(beanType, Controller.class)
            || AnnotatedElementUtils.hasAnnotation(beanType, RequestMapping.class));
}
```

**为什么只标注 @RequestMapping 的类也会被判定为 Controller？**

因为 `beanType` 是通过 `ApplicationContext.getType()` 获取的，既然能从 ApplicationContext 中获取到 Bean 的类型，说明它必然是容器中实际存在的 Bean。Spring 认为只要标注了 `@RequestMapping` 注解就可以充当 Controller，而无需限定是否标注了 `@Controller` 注解。

### 12.3.3 detectHandlerMethods

这个方法整体分为两个步骤：
1. 检查 Controller 中的所有方法，提取标注了 `@RequestMapping` 注解的方法
2. 封装映射信息并注册方法映射

```java
protected void detectHandlerMethods(Object handler) {
    // 获取处理器的类型
    Class<?> handlerType = (handler instanceof String
            ? obtainApplicationContext().getType((String) handler)
            : handler.getClass());

    if (handlerType != null) {
        // 获取用户定义的类（避免 CGLIB 代理类的问题）
        Class<?> userType = ClassUtils.getUserClass(handlerType);

        // 解析筛选方法并执行
        Map<Method, T> methods = MethodIntrospector.selectMethods(userType,
                (MethodIntrospector.MetadataLookup<T>) method -> {
                    try {
                        return getMappingForMethod(method, userType);
                    } catch (Throwable ex) {
                        // 忽略异常
                        return null;
                    }
                });

        // 注册方法映射
        methods.forEach((method, mapping) -> {
            Method invocableMethod = AopUtils.selectInvocableMethod(method, userType);
            registerHandlerMethod(handler, invocableMethod, mapping);
        });
    }
}
```

**getMappingForMethod 方法**：

这个方法检查方法上是否标注了 `@RequestMapping` 注解，如果有标注则封装成 `RequestMappingInfo` 对象。

```java
protected RequestMappingInfo getMappingForMethod(Method method, Class<?> handlerType) {
    // 创建方法级的 RequestMappingInfo
    RequestMappingInfo info = createRequestMappingInfo(method);
    if (info != null) {
        // 创建类级的 RequestMappingInfo
        RequestMappingInfo typeInfo = createRequestMappingInfo(handlerType);
        if (typeInfo != null) {
            // 拼接类级的 URI
            info = typeInfo.combine(info);
        }
        // 拼接路径前缀
        String prefix = getPathPrefix(handlerType);
        if (prefix != null) {
            info = RequestMappingInfo.paths(prefix).build().combine(info);
        }
        return info;
    }
    return null;
}

private RequestMappingInfo createRequestMappingInfo(AnnotatedElement element) {
    RequestMapping requestMapping = AnnotatedElementUtils
            .findMergedAnnotation(element, RequestMapping.class);
    RequestCondition<?> condition = (element instanceof Class
            ? getCustomTypeCondition((Class<?>) element)
            : getCustomMethodCondition((Method) element));
    return (requestMapping != null ? createRequestMappingInfo(requestMapping, condition) : null);
}
```

**MappingRegistry 的作用**：

所有 Handler 方法解析并注册后，存放在 `MappingRegistry` 中。当 `DispatcherServlet` 接收到客户端请求时，可以根据 URI 找到合适的 `HandlerMethod`，进而定位到可以处理请求的 Handler。

IOC 容器中的 Bean 全部检查完成后，所有 Controller 中的 Handler 方法全部装载到 `RequestMappingHandlerMapping` 中，HandlerMapping 的初始化动作完成。

## 12.4 DispatcherServlet 的工作全流程解析

本节是本章的重点，我们来探讨 WebMvc 在实际运行期间 `DispatcherServlet` 对于请求处理和响应的全流程执行原理。

作为 WebMvc 的核心前端控制器，`DispatcherServlet` 默认会接收所有请求并分发处理。

启动示例项目后，在 `FrameworkServlet` 的 `service` 方法上打断点，使用浏览器访问 `http://localhost:8080/hello`，开始 Debug 调试。

### 12.4.1 DispatcherServlet#service

调试从 `FrameworkServlet` 开始。首先 `service` 方法会对 PATCH 类型的请求单独处理（PATCH 是对 PUT 的补充，一般用于资源局部更新）。然后执行 `super.service` 方法，`HttpServlet` 会根据不同的请求类型将方法转发至 `doGet`、`doPost` 等方法，这些方法最终都调用 `processRequest` 方法。

```java
@Override
protected void service(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException {
    HttpMethod httpMethod = HttpMethod.resolve(request.getMethod());
    if (httpMethod == HttpMethod.PATCH || httpMethod == null) {
        processRequest(request, response);
    } else {
        super.service(request, response);
    }
}

// doGet、doPost 等方法都调用 processRequest
protected final void doGet(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException {
    processRequest(request, response);
}

protected final void doPost(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException {
    processRequest(request, response);
}
```

### 12.4.2 processRequest

`processRequest` 方法对请求进行一些前置处理，然后转调 `doService` 方法。

```java
protected final void processRequest(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException {
    // 记录接收请求的时间
    long startTime = System.currentTimeMillis();

    Throwable failureCause = null;

    // 获取当前线程的 LocaleContext，并创建当前线程的 LocaleContext
    LocaleContext previousLocaleContext = LocaleContextHolder.getLocaleContext();
    LocaleContext localeContext = buildLocaleContext(request);

    // 获取当前线程的 RequestAttributes，并创建当前线程对应的 ServletRequestAttributes
    RequestAttributes previousAttributes = RequestContextHolder.getRequestAttributes();
    ServletRequestAttributes requestAttributes =
            buildRequestAttributes(request, response, previousAttributes);

    WebAsyncManager asyncManager = WebAsyncUtils.getAsyncManager(request);
    asyncManager.registerCallableInterceptor(FrameworkServlet.class.getName(),
            new RequestBindingInterceptor());

    // 初始化 ContextHolder，传入新封装好的请求参数和上下文，目的是隔离线程
    initContextHolders(request, localeContext, requestAttributes);

    try {
        // 子类的模板方法
        doService(request, response);
    } catch (Throwable ex) {
        failureCause = ex;
    } finally {
        // 重新设置当前线程的 LocaleContext 和 RequestAttributes
        resetContextHolders(request, previousLocaleContext, previousAttributes);

        if (requestAttributes != null) {
            requestAttributes.requestCompleted();
            logResult(request, response, failureCause, asyncManager);
            // 发布 ServletRequestHandledEvent 事件
            publishRequestHandledEvent(request, response, startTime, failureCause);
        }
    }
}

protected abstract void doService(HttpServletRequest request, HttpServletResponse response)
        throws Exception;
```

**线程隔离机制**：

在 `initContextHolders` 方法执行之前，`processRequest` 方法会：
1. 获取当前线程的 `LocaleContext` 和 `RequestAttributes` 并暂存
2. 使用当前请求的 REQUEST 与 RESPONSE 对象构造全新的 `LocaleContext` 与 `RequestAttributes`
3. 设置到当前线程上下文中

这样每个请求都有自己独立的上下文，互不干扰。

### 12.4.3 doService

`doService` 仍然不是真正处理请求的方法，它是请求预处理的地方。

```java
protected void doService(HttpServletRequest request, HttpServletResponse response)
        throws Exception {
    logRequest(request);

    // 判断请求参数中是否存在 javax.servlet.include.request_uri
    Map<String, Object> attributesSnapshot = null;
    if (WebUtils.isIncludeRequest(request)) {
        attributesSnapshot = new HashMap<>();
        Enumeration<?> attrNames = request.getAttributeNames();
        while (attrNames.hasMoreElements()) {
            String attrName = (String) attrNames.nextElement();
            if (this.cleanupAfterInclude || attrName.startsWith(DEFAULT_STRATEGIES_PREFIX)) {
                attributesSnapshot.put(attrName, request.getAttribute(attrName));
            }
        }
    }

    // FlashMapManager - 用于重定向时的数据传递
    if (this.flashMapManager != null) {
        FlashMap inputFlashMap = this.flashMapManager.retrieveAndUpdate(request, response);
        if (inputFlashMap != null) {
            request.setAttribute(INPUT_FLASH_MAP_ATTRIBUTE,
                    Collections.unmodifiableMap(inputFlashMap));
        }
        request.setAttribute(OUTPUT_FLASH_MAP_ATTRIBUTE, new FlashMap());
        request.setAttribute(FLASH_MAP_MANAGER_ATTRIBUTE, this.flashMapManager);
    }

    try {
        // 真正处理请求的方法
        doDispatch(request, response);
    } finally {
        // ...
    }
}
```

**FlashMapManager 的设计**：

考虑一个经典业务场景：用户登录。通常使用 POST 请求将用户名、密码等信息传入后端认证，登录成功后使用重定向将客户端引导至系统主页。如果用户登录时提交的登录表单中有一些需要在跳转至主页时渲染的数据，仅靠重定向无法解决。

Spring WebMvc 在 3.1 版本后引入了 `FlashMapManager` 来解决该问题。它可以在页面重定向发生时将需要渲染的数据暂时放入 session 中，这样即使用户刷新页面也不会影响数据渲染。

### 12.4.4 doDispatch

`doService` 完成后，下一步是核心的 `doDispatch` 方法。由于篇幅较长，我们拆分为多个部分讲解。

#### 1. 文件上传解析

`doDispatch` 方法的第一段源码是处理带有文件上传的请求。

```java
protected void doDispatch(HttpServletRequest request, HttpServletResponse response)
        throws Exception {
    HttpServletRequest processedRequest = request;
    HandlerExecutionChain mappedHandler = null;
    boolean multipartRequestParsed = false;

    WebAsyncManager asyncManager = WebAsyncUtils.getAsyncManager(request);

    try {
        ModelAndView mv = null;
        Exception dispatchException = null;

        try {
            // 此处会处理文件上传的情况
            processedRequest = checkMultipart(request);
            multipartRequestParsed = (processedRequest != request);

            // ...后续代码

        } finally {
            // ...
        }
    }
}

protected HttpServletRequest checkMultipart(HttpServletRequest request)
        throws MultipartException {
    if (this.multipartResolver != null
            && this.multipartResolver.isMultipart(request)) {
        if (WebUtils.getNativeRequest(request, MultipartHttpServletRequest.class) != null) {
            if (request.getDispatcherType().equals(DispatcherType.REQUEST)) {
                // ...
            }
        } else {
            try {
                return this.multipartResolver.resolveMultipart(request);
            } catch (Throwable ex) {
                // ...
            }
        }
    }
    // 返回原始请求
    return request;
}
```

**multipartResolver 的作用**：

处理文件上传请求的核心组件是 `multipartResolver`，它可以将 Servlet 容器处理的 `HttpServletRequest` 对象转换为可以访问请求中文件对象的 `MultipartHttpServletRequest`。

判断请求是否为 multipart 请求的依据是 `content-type` 是否以 "multipart/" 开头。

#### 2. 获取第一个可用的 Handler

`DispatcherServlet` 核心处理流程的第一步：搜索 Handler。

```java
// Determine handler for the current request.
mappedHandler = getHandler(processedRequest);
if (mappedHandler == null) {
    noHandlerFound(processedRequest, response);
}

protected HandlerExecutionChain getHandler(HttpServletRequest request) throws Exception {
    if (this.handlerMappings != null) {
        for (HandlerMapping mapping : this.handlerMappings) {
            HandlerExecutionChain handler = mapping.getHandler(request);
            if (handler != null) {
                return handler;
            }
        }
    }
    return null;
}
```

`DispatcherServlet` 中有 5 个 `HandlerMapping`：

| 索引 | HandlerMapping 类型 |
|------|---------------------|
| 0 | `RequestMappingHandlerMapping` |
| 1 | `BeanNameUrlHandlerMapping` |
| 2 | `RouterFunctionMapping` |
| 3 | `SimpleUrlHandlerMapping` |
| 4 | `WelcomePageHandlerMapping` |

由于项目中使用 `@Controller` + `@RequestMapping` 注解编写 Handler，对应的是 `WebMvcAutoConfiguration` 中注册的 `RequestMappingHandlerMapping`。

**AbstractHandlerMapping#getHandler 的实现**：

```java
public final HandlerExecutionChain getHandler(HttpServletRequest request) throws Exception {
    // 留给子类的模板方法
    Object handler = getHandlerInternal(request);

    // 构建 HandlerExecutionChain
    HandlerExecutionChain executionChain = getHandlerExecutionChain(handler, request);

    return executionChain;
}
```

核心逻辑分两步：
1. 由子类具体获取 Handler 的具体对象
2. 根据 Handler 对象构建 `HandlerExecutionChain` 对象

**getHandlerInternal 方法**：

```java
protected HandlerMethod getHandlerInternal(HttpServletRequest request) throws Exception {
    // 获取请求的 URI 路径
    String lookupPath = getUrlPathHelper().getLookupPathForRequest(request);
    request.setAttribute(LOOKUP_PATH, lookupPath);

    this.mappingRegistry.acquireReadLock();
    try {
        // 从 HandlerMethod 集合中查找匹配的处理器方法
        HandlerMethod handlerMethod = lookupHandlerMethod(lookupPath, request);
        return (handlerMethod != null ? handlerMethod.createWithResolvedBean() : null);
    } finally {
        this.mappingRegistry.releaseReadLock();
    }
}
```

经过 `lookupHandlerMethod` 方法检索后，可以成功获取到对应的 Controller 方法。

**构建 HandlerExecutionChain**：

```java
protected HandlerExecutionChain getHandlerExecutionChain(Object handler,
        HttpServletRequest request) {
    HandlerExecutionChain chain = (handler instanceof HandlerExecutionChain
            ? (HandlerExecutionChain) handler
            : new HandlerExecutionChain(handler));

    String lookupPath = this.urlPathHelper.getLookupPathForRequest(request, LOOKUP_PATH);
    for (HandlerInterceptor interceptor : this.adaptedInterceptors) {
        if (interceptor instanceof MappedInterceptor) {
            MappedInterceptor mappedInterceptor = (MappedInterceptor) interceptor;
            // 匹配路径的拦截器
            if (mappedInterceptor.matches(lookupPath, this.pathMatcher)) {
                chain.addInterceptor(mappedInterceptor.getInterceptor());
            }
        } else {
            // 普通拦截器
            chain.addInterceptor(interceptor);
        }
    }
    return chain;
}
```

#### 3. 获取 HandlerAdapter

根据 `HandlerMapping` 匹配到的 Handler 对象，寻找可以执行它的 `HandlerAdapter`。

```java
// 为当前请求确定 HandlerAdapter
HandlerAdapter ha = getHandlerAdapter(mappedHandler.getHandler());

protected HandlerAdapter getHandlerAdapter(Object handler) throws ServletException {
    if (this.handlerAdapters != null) {
        for (HandlerAdapter adapter : this.handlerAdapters) {
            if (adapter.supports(handler)) {
                return adapter;
            }
        }
    }
    throw new ServletException("...");
}
```

`DispatcherServlet` 中有 4 个 `HandlerAdapter`：

| 索引 | HandlerAdapter 类型 |
|------|---------------------|
| 0 | `RequestMappingHandlerAdapter` |
| 1 | `HandlerFunctionAdapter` |
| 2 | `HttpRequestHandlerAdapter` |
| 3 | `SimpleControllerHandlerAdapter` |

实际负责匹配的是 `RequestMappingHandlerAdapter`，它的匹配规则是判断 Handler 的类型是不是 `HandlerMethod`：

```java
public final boolean supports(Object handler) {
    return (handler instanceof HandlerMethod && supportsInternal((HandlerMethod) handler));
}

protected boolean supportsInternal(HandlerMethod handlerMethod) {
    return true;
}
```

#### 4. 回调拦截器（preHandle）

在执行 Handler 之前，先要执行匹配当前请求的拦截器的 `preHandle` 方法。

```java
if (!mappedHandler.applyPreHandle(processedRequest, response)) {
    return;
}

boolean applyPreHandle(HttpServletRequest request, HttpServletResponse response)
        throws Exception {
    HandlerInterceptor[] interceptors = getInterceptors();
    if (!ObjectUtils.isEmpty(interceptors)) {
        for (int i = 0; i < interceptors.length; i++) {
            HandlerInterceptor interceptor = interceptors[i];
            if (!interceptor.preHandle(request, response, this.handler)) {
                triggerAfterCompletion(request, response, null);
                return false;
            }
            this.interceptorIndex = i;
        }
    }
    return true;
}
```

**注意**：如果 `preHandle` 方法返回 `false`，则 `applyPreHandle` 方法会返回 `false`，后续的 `doDispatch` 逻辑将不会继续执行。

#### 5. 执行 Handler + 回调拦截器

`DispatcherServlet` 委托 `HandlerAdapter` 执行具体的 Handler 方法。

```java
// 实际调用 Handler
mv = ha.handle(processedRequest, response, mappedHandler.getHandler());

// AbstractHandlerMethodAdapter 的实现
public final ModelAndView handle(HttpServletRequest request,
        HttpServletResponse response, Object handler) throws Exception {
    return handleInternal(request, response, (HandlerMethod) handler);
}
```

**handleInternal 方法**：

```java
protected ModelAndView handleInternal(HttpServletRequest request,
        HttpServletResponse response, HandlerMethod handlerMethod) throws Exception {
    ModelAndView mav;
    checkRequest(request);

    // 同步 session 的配置，默认不同步，执行下面的 invokeHandlerMethod 方法
    if (this.synchronizeOnSession) {
        // ...
    } else {
        mav = invokeHandlerMethod(request, response, handlerMethod);
    }

    // Cache-Control 相关的处理 ...
    return mav;
}
```

**invokeHandlerMethod 方法**：

这个方法篇幅较长，我们分几个部分讲解：

**（a）参数绑定器初始化**：

```java
protected ModelAndView invokeHandlerMethod(HttpServletRequest request,
        HttpServletResponse response, HandlerMethod handlerMethod) throws Exception {
    ServletWebRequest webRequest = new ServletWebRequest(request, response);

    try {
        // 参数绑定器初始化
        WebDataBinderFactory binderFactory = getDataBinderFactory(handlerMethod);
        // ...
    } catch (Exception ex) {
        // ...
    }
}
```

`@InitBinder` 注解可以单独声明在 Controller 中，执行当前 Controller 方法时会先执行标注了 `@InitBinder` 的方法。而 `@ControllerAdvice` 可以配合 `@InitBinder` 实现全局的参数绑定器预初始化。

```java
@ControllerAdvice
public class ConversionBinderAdvice {
    @InitBinder
    public void addDateBinder(WebDataBinder dataBinder) {
        dataBinder.addCustomFormatter(new DateFormatter("yyyy-MM-dd"));
    }
}
```

**（b）参数预绑定**：

```java
// 参数预绑定
ModelFactory modelFactory = getModelFactory(handlerMethod, binderFactory);
```

`@ModelAttribute` 注解除了支持前后端不分离场景下的数据回显，还拥有公有数据暴露、请求数据处理的能力。

```java
public static final MethodFilter MODEL_ATTRIBUTE_METHODS = method ->
        (!AnnotatedElementUtils.hasAnnotation(method, RequestMapping.class)
                && AnnotatedElementUtils.hasAnnotation(method, ModelAttribute.class));
```

**（c）创建方法执行对象**：

```java
// 创建方法执行对象
ServletInvocableHandlerMethod invocableMethod =
        createInvocableHandlerMethod(handlerMethod);
```

**（d）执行 Controller 的方法**：

```java
// 执行 Controller 的方法
invocableMethod.invokeAndHandle(webRequest, mavContainer);

if (asyncManager.isConcurrentHandlingStarted()) {
    return null;
}

// 包装 ModelAndView
return getModelAndView(mavContainer, modelFactory, webRequest);
```

**invokeAndHandle（反射执行）**：

```java
public void invokeAndHandle(ServletWebRequest webRequest,
        ModelAndViewContainer mavContainer, Object... providedArgs) throws Exception {
    Object returnValue = invokeForRequest(webRequest, mavContainer, providedArgs);
    // ...
}

public Object invokeForRequest(NativeWebRequest request,
        @Nullable ModelAndViewContainer mavContainer, Object... providedArgs) throws Exception {
    // 获取方法参数值
    Object[] args = getMethodArgumentValues(request, mavContainer, providedArgs);

    return doInvoke(args);
}

protected Object doInvoke(Object... args) throws Exception {
    try {
        // 使用反射调用目标方法
        return getBridgedMethod().invoke(getBean(), args);
    } catch (Throwable ex) {
        // ...
    }
}
```

**处理方法返回值**：

```java
private HandlerMethodReturnValueHandlerComposite returnValueHandlers;

public void invokeAndHandle(ServletWebRequest webRequest,
        ModelAndViewContainer mavContainer, Object... providedArgs) throws Exception {
    Object returnValue = invokeForRequest(webRequest, mavContainer, providedArgs);

    try {
        // 处理返回值
        this.returnValueHandlers.handleReturnValue(
                returnValue, getReturnValueType(returnValue), mavContainer, webRequest);
    } catch (Throwable ex) {
        // ...
    }
}
```

**处理视图返回**：

如果 Controller 方法要跳转视图，返回值是字符串，且没有标注 `@ResponseBody`，则使用 `ViewNameMethodReturnValueHandler` 处理。

```java
public boolean supportsReturnType(MethodParameter returnType) {
    Class<?> paramType = returnType.getParameterType();
    // 判断返回值是不是 CharSequence (String)
    return (void.class == paramType
            || CharSequence.class.isAssignableFrom(paramType));
}

public void handleReturnValue(@Nullable Object returnValue, MethodParameter returnType,
        ModelAndViewContainer mavContainer, NativeWebRequest webRequest) throws Exception {
    if (returnValue instanceof CharSequence) {
        String viewName = returnValue.toString();
        mavContainer.setViewName(viewName);
        if (isRedirectViewName(viewName)) {
            mavContainer.setRedirectModelScenario(true);
        }
    }
}
```

**处理 JSON 数据响应**：

如果 Controller 方法需要响应 JSON 数据，则需要在方法或类上标注 `@ResponseBody` 注解。处理 JSON 数据响应的是 `RequestResponseBodyMethodProcessor`。

```java
public boolean supportsReturnType(MethodParameter returnType) {
    return (AnnotatedElementUtils.hasAnnotation(returnType.getContainingClass(), ResponseBody.class)
            || returnType.hasMethodAnnotation(ResponseBody.class));
}

public void handleReturnValue(@Nullable Object returnValue, MethodParameter returnType,
        ModelAndViewContainer mavContainer, NativeWebRequest webRequest)
        throws IOException, HttpMediaTypeNotAcceptableException, HttpMessageNotWritableException {

    mavContainer.setRequestHandled(true);

    ServletServerHttpRequest inputMessage = createInputMessage(webRequest);
    ServletServerHttpResponse outputMessage = createOutputMessage(webRequest);

    // 使用 JSON 序列化方式将方法返回的数据写入 Response
    writeWithMessageConverters(returnValue, returnType, inputMessage, outputMessage);
}
```

**getModelAndView**：

```java
private ModelAndView getModelAndView(ModelAndViewContainer mavContainer,
        ModelFactory modelFactory, NativeWebRequest webRequest) throws Exception {
    // 前置准备逻辑 ...

    // 注意此处将 ModelMap 取出
    ModelMap model = mavContainer.getModel();

    // 注意此处把视图名称取出，并组合生成 ModelAndView
    ModelAndView mav = new ModelAndView(mavContainer.getViewName(), model,
            mavContainer.getStatus());

    if (!mavContainer.isViewReference()) {
        mav.setView((View) mavContainer.getView());
    }

    return mav;
}
```

#### 6. 回调拦截器（postHandle）

执行完 `HandlerAdapter` 的 `handle` 方法后，下一步是调用所有 `HandlerInterceptor` 的 `postHandle` 方法进行请求的后置拦截。

```java
// 实际调用 Handler
mv = ha.handle(processedRequest, response, mappedHandler.getHandler());

applyDefaultViewName(processedRequest, mv);

mappedHandler.applyPostHandle(processedRequest, response, mv);
```

**倒序回调拦截器**：

```java
void applyPostHandle(HttpServletRequest request, HttpServletResponse response,
        @Nullable ModelAndView mv) throws Exception {
    HandlerInterceptor[] interceptors = getInterceptors();
    if (!ObjectUtils.isEmpty(interceptors)) {
        // 注意：此处是倒序回调
        for (int i = interceptors.length - 1; i >= 0; i--) {
            HandlerInterceptor interceptor = interceptors[i];
            interceptor.postHandle(request, response, this.handler, mv);
        }
    }
}
```

#### 7. 处理视图、解析异常

`doDispatch` 方法的核心 try-catch 块执行完毕后，进入最后一个关键步骤：`processDispatchResult` 方法。该方法会进行视图处理，以及解析整个请求处理中抛出的异常。

```java
mappedHandler.applyPostHandle(processedRequest, response, mv);

// catch .....

processDispatchResult(processedRequest, response, mappedHandler, mv, dispatchException);
```

**处理异常**：

```java
private void processDispatchResult(HttpServletRequest request,
        HttpServletResponse response, @Nullable HandlerExecutionChain mappedHandler,
        @Nullable ModelAndView mv, @Nullable Exception exception) throws Exception {

    boolean errorView = false;

    // 处理异常
    if (exception != null) {
        if (exception instanceof ModelAndViewDefiningException) {
            // ...
        } else {
            Object handler = (mappedHandler != null ? mappedHandler.getHandler() : null);
            mv = processHandlerException(request, response, handler, exception);
            errorView = (mv != null);
        }
    }

    // 渲染视图
    if (mv != null && !mv.wasCleared()) {
        render(mv, request, response);

        if (errorView) {
            WebUtils.clearErrorRequestAttributes(request);
        }
    }
}
```

**渲染视图**：

```java
protected void render(ModelAndView mv, HttpServletRequest request,
        HttpServletResponse response) throws Exception {

    // 国际化处理 ...

    View view;
    String viewName = mv.getViewName();

    if (viewName != null) {
        // 如果有视图名，则解析出视图
        view = resolveViewName(viewName, mv.getModelInternal(), locale, request);
    } else {
        // 否则，直接获取视图。如果还没有视图，则抛出异常
        view = mv.getView();
    }

    try {
        if (mv.getStatus() != null) {
            response.setStatus(mv.getStatus().value());
        }
        // 带入 Model，渲染视图
        view.render(mv.getModelInternal(), request, response);
    } catch (Throwable ex) {
        // ...
    }
}
```

**回调拦截器（afterCompletion）**：

视图渲染完成后，最后的收尾动作是回调拦截器的 `afterCompletion` 方法。

```java
if (mappedHandler != null) {
    mappedHandler.triggerAfterCompletion(request, response, null);
}
```

`processDispatchResult` 方法执行完毕后，整个 `doDispatch` 方法的主干逻辑全部执行完毕，一次完整的 DispatcherServlet 请求处理与响应完成。

### 12.4.5 DispatcherServlet 工作全流程小结

简单总结一下 `DispatcherServlet` 的工作全流程：

1. 客户端向服务端发起请求，由 `DispatcherServlet` 接收请求
2. `DispatcherServlet` 委托 `HandlerMapping`，根据本次请求的 URL 匹配合适的 Controller 方法
3. `HandlerMapping` 找到合适的 Controller 方法后，组合可以应用于当前请求的拦截器，并封装为 `HandlerExecutionChain` 返回给 `DispatcherServlet`
4. `DispatcherServlet` 接收到 Handler 后委托 `HandlerAdapter`，将请求转发给选定的 Controller 中的 Handler
5. `Handler` 接收到请求后，实际执行 Controller 中的方法
6. Controller 方法执行完毕后返回 `ModelAndView` 对象
7. `HandlerAdapter` 接收到 Handler 返回的 `ModelAndView` 后返回给 `DispatcherServlet`
8. `DispatcherServlet` 获取 `ModelAndView` 后委托 `ViewResolver`，由 `ViewResolver` 负责渲染视图
9. `ViewResolver` 渲染视图完成后返回给 `DispatcherServlet`，由 `DispatcherServlet` 响应客户端

**工作流程图**：

```
┌──────────────────────────────────────────────────────────────────────┐
│                        DispatcherServlet                              │
│                                                                      │
│  1. 接收请求 ──► 2. HandlerMapping 匹配 Handler                      │
│                      │                                               │
│                      ▼                                               │
│                 3. 获取 HandlerAdapter                               │
│                      │                                               │
│                      ▼                                               │
│                 4. preHandle 拦截器                                  │
│                      │                                               │
│                      ▼                                               │
│                 5. HandlerAdapter 执行 Handler                       │
│                      │                                               │
│                      ▼                                               │
│                 6. postHandle 拦截器                                 │
│                      │                                               │
│                      ▼                                               │
│                 7. ViewResolver 渲染视图                            │
│                      │                                               │
│                      ▼                                               │
│                 8. afterCompletion 拦截器                           │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

## 12.5 小结

本章从 WebMvc 的自动装配开始，回顾了 WebMvc 中的核心组件及用途。然后研究了 WebMvc 中 Controller 的 Handler 方法的收集逻辑。最后从示例出发，结合 Debug 调试深入研究了 `DispatcherServlet` 的工作全流程。

WebMvc 本质是以 `DispatcherServlet` 为核心组合几个关键功能组件，共同构成 WebMvc 的底层支撑。

**核心组件职责回顾**：

| 组件 | 职责 |
|------|------|
| `DispatcherServlet` | 前端控制器，统一接收请求并分发 |
| `HandlerMapping` | 根据 URI 匹配 Handler，封装拦截器 |
| `HandlerAdapter` | 执行 Handler，反射调用 Controller 方法 |
| `ViewResolver` | 解析视图名，渲染视图 |
| `HandlerInterceptor` | 请求预处理和后处理拦截 |

**WebMvc vs WebFlux**：

在 Spring Framework 5.0 版本之后，WebMvc 多了一个孪生兄弟 WebFlux。WebFlux 是基于异步非阻塞的 Web 框架，可以应对海量请求的高并发场景。下一章我们会从相关概念开始，逐步深入探究 WebFlux 的使用与原理。
