---
title: Java 编码规范
createTime: 2026/02/02
permalink: /doc/Interview/backend/language/java/coding-standards/
---

# Java 编码规范

面试与协作中常用的 Java 编码约定（命名、格式、异常、注释等）。

## 一、 ==编码格式==

- **行宽**：建议 100–120 字符，超长换行时参数/链式调用对齐或缩进一致。

```java
// Good.
Iterable<Module> modules = ImmutableList.<Module>builder()
    .add(new LifecycleModule())
    .add(new AppLauncherModule())
    .addAll(application.getModules())
    .build();
```

- **修饰语顺序**： 

```java
// Good.
private final volatile String value;
```

- **变量名**：变量名要包含单位

```java
// Good.
long pollIntervalMs;
int fileSizeGb.
```

- **通配符导入**：通配符导入会使导入类的来源变得不那么清晰。它们也往往会隐藏高层级的扇出

```java
// Good.
import com.twitter.baz.foo.BazFoo;
import com.twitter.Foo;

interface Bar extends Foo {
  ...
}
```

## 二、 ==注释文档==

- **公共 API**：类、公开方法用 Javadoc，说明用途、参数、返回值、异常。
- **@Nullable**：明确 null 语义；可选 `Optional` 或注解（如 `@Nullable`）配合静态检查。

```java
class Database {
  @Nullable private Connection connection;

  @Nullable
  Connection getConnection() {
    return connection;
  }

  void setConnection(@Nullable Connection connection) {
    this.connection = connection;
  }
}
```

- - **TODO**：待办事项应该有负责人，包含`(标记人，标记时间，[预计处理时间])`内容。

```java
// Good.
// TODO(George Washington, 2026-02-02, [2h]): Implement request backoff.
```

- **复杂逻辑**：注释「为什么」而非「做什么」；避免过期注释。

## 三、 ==异常日志==

- **不吞异常**：catch 后至少打日志或再抛出；避免空 catch。
- **慎用 checked exception**：对外 API 可优先用返回值或 unchecked，减少调用方负担。
- **SLF4J**【强制】应用中不可直接使用日志系统(Log4j、Logback)中的 API，而应依赖使用日志框架 SLF4J 中的 API，使用门面模式的日志框架，有利于维护和各个类的日志处理方式统一。
- **日志命名**【强制】应用中的扩展日志(如打点、临时监控、访问日志等)命名方式: appName_logType_logName.log。logType:日志类型，推荐分类有 stats/desc/monitor/visit 等；logName:日志描述。这种命名的好处: 通过文件名就可知道日志文件属于什么应用，什么类型，什么目的，也有利于归类查找。
- **日志输出**【强制】对 trace/debug/info 级别的日志输出，必须使用条件输出形式或者使用占位符的方 式。logger.debug("Processing trade with id: " + id + " symbol: " + symbol);如果日志级别是 warn，上述日志不会打印，但是会执行字符串拼接操作，如果 symbol 是对象，会执行 toString() 方法，浪费了系统资源，执行了上述操作，最终日志却没有打印。

## 四、 ==线程安全==

- **线程安全**：标明是否线程安全；共享可变状态用锁或并发容器，避免无谓同步。许多阻塞操作会抛出InterruptedException 异常。在新窗口打开这样，你就能在发生 JVM 关闭等事件时被唤醒。捕获到中断时InterruptedException，最佳实践是确保线程中断状态得以保留。

```java
// Good.
//   - Interrupted state is preserved.
try {
  lock.tryLock(1L, TimeUnit.SECONDS)
} catch (InterruptedException e) {
  LOG.info("Interrupted while doing x");
  Thread.currentThread().interrupt();
}
```

- **线程创建**【强制】线程资源必须通过线程池提供，不允许在应用中自行显式创建线程。
- **ThreadPoolExecutor**【强制】线程池不允许使用 Executors 去创建，而是通过 ThreadPoolExecutor 的方式**，这样的处理方式让写的同学更加明确线程池的运行规则，规避资源耗尽的风险。
- **switch 块**【强制】在一个 switch 块内，每个 case 要么通过 break/return 等来终止，要么注释说明程序将继续执行到哪一个 case 为止；在一个 switch 块内，都必须包含一个 default 语句并且放在最后，即使它什么代码也没有。

## 五、 ==安全规约==

- **SQL注入**：【强制】用户输入的 SQL 参数严格使用参数绑定或者 METADATA 字段值限定，防止 SQL 注入， 禁止字符串拼接 SQL 访问数据库。
- **Web输入**：【强制】表单、AJAX 提交必须执行 CSRF 安全过滤。
- **Web输出**：【强制】禁止向 HTML 页面输出未经安全过滤或未正确转义的用户数据。
- **限制**：【强制】在使用平台资源，譬如短信、邮件、电话、下单、支付，必须实现正确的防重放限制， 如数量限制、疲劳度控制、验证码校验，避免被滥刷、资损。 说明: 如注册时发送验证码到手机，如果没有限制次数和频率，那么可以利用此功能骚扰到其 它用户，并造成短信平台资源浪费。
- **风控**：发贴、评论、发送即时消息等用户生成内容的场景必须实现防刷、文本内容违禁词过 滤等风控策略。

## 扩展

可结合「架构」「高可用」：分层与包结构、异常与监控、日志与追踪的约定。
