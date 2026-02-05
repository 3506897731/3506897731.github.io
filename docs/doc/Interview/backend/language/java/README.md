---
title: Java
createTime: 2026/02/02
permalink: /doc/Interview/backend/language/java/
---

# Java

::: card title="目录导航" icon="noto-v1:cat-with-wry-smile"

[Java 编码规范](/doc/Interview/backend/language/java/coding-standards/)：命名、格式、异常、注释、强制规定与常用约定

[Java 常用类库](/doc/Interview/backend/language/java/essentials/)：核心库、工具库、数据库、API 库、安全库、测试库
:::

@startmindmap
* Java Essentials
  * 核心库
    * 工具库
      * 通用工具
        * Guava
        * Apache Commons Lang3
        * Apache Commons Collections4
      * 代码简化
        * Lombok + MapStruct
      * 国产工具
        * Hutool
    * 数据库
    * API库
    * 安全库
    * 测试库
  * JSON库
    * Jackson
      * 序列化/反序列化 + 注解处理
    * Fastjson2
      * 高性能
    * Protocol/Thrift
      * 跨语言 + RPC框架
  * 日志库
    * SLF4J
      * 日志门面
    * Logback
      * 日志框架
@endmindmap

## ==JVM==

- **类加载**：双亲委派、类加载器（Bootstrap/Extension/App）、自定义类加载器与打破双亲委派
- **内存**：堆（新生代/老年代）、方法区/元空间、栈、直接内存；OOM 与 dump 分析
- **GC**：分代、标记-清除/复制/整理、常见收集器（Serial、ParNew、CMS、G1、ZGC）、STW 与调优思路
- **字节码**：javap、常量池、指令与 JIT
- **反射**：Class、Method、Field；性能与安全注意点

## ==并发==

- **synchronized**：对象头、锁升级（偏向/轻量/重量）、锁粗化/消除
- **JUC**：Lock、ReentrantLock、ReadWriteLock；Condition、AQS 思想
- **线程池**：ThreadPoolExecutor 参数（核心/最大/队列/拒绝策略）、Executors 风险、合理配置
- **并发集合**：ConcurrentHashMap、CopyOnWriteArrayList、BlockingQueue
- **原子类**：CAS、Atomic*；LongAdder 与高并发计数
- **并发工具**：CountDownLatch、CyclicBarrier、Semaphore、Phaser

## ==Spring==

- **IoC**：容器、Bean 生命周期、依赖注入（构造/设值/字段）、@Autowired 与歧义
- **AOP**：切面、切点、通知类型、代理（JDK/CGLIB）与事务
- **Web**：MVC、DispatcherServlet、参数绑定、异常处理、拦截器
- **Data**：JPA/MyBatis、事务（@Transactional 传播与隔离）、缓存抽象
- **Cloud**：微服务组件（注册/配置/网关/熔断）与常用生态

## ==工程==

- **构建**：Maven/Gradle、依赖管理、多模块与 BOM
- **模块化**：JPMS（Java 9+）、模块路径与未命名模块
- **与 Kotlin 互操作**：空安全、扩展、协程与 Spring 支持
- **常用库**：Lombok、Guava、工具类与规范使用

## 扩展

可结合「API 设计」「架构」「高可用」：接口与分层、异常与监控、线程池与限流熔断。
