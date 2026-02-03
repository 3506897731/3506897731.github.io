---
title: 语言
createTime: 2026/01/29
permalink: /doc/Interview/backend/language/
---

# 语言

:::: card-grid

::: card title="Java / Kotlin" icon="logos:java"

**适用场景**：Android、高吞吐稳定服务、大数据（Spark/Flink[^1]）。

**优缺点**：JVM 成熟、工具链与监控完善；启动与内存占用较大，Kotlin[^2] 更简洁。

[More →](/doc/Interview/backend/language/java/)
:::

::: card title="Scala" icon="logos:scala"

**适用场景**：大数据（Spark）、高并发/响应式（Akka[^3]）、DSL[^4] 与领域建模。

**优缺点**：表达力强、与 Java 互操作、Spark/Akka 等生态。

[More →](/doc/Interview/backend/language/scala/)
:::

::: card title="SQL" icon="devicon:mysql-wordmark"

**适用场景**：关系型数据存储与查询、报表与分析、OLTP/OLAP、数据建模与约束。

**优缺点**：声明式、标准化、与各类存储/数仓兼容；复杂分析需优化，方言差异需注意。

[More →](/doc/Interview/backend/language/sql/)
:::

::: card title="Python" icon="logos:python"

**适用场景**：脚本、粘合剂、运维与爬虫、Django[^5]/FastAPI[^6] 小型 Web。

**优缺点**：库多、AI 生态强；GIL 限制多线程 CPU 并行，性能与类型需补强。

[More →](/doc/Interview/backend/language/python/)
:::

::: card title="TypeScript" icon="logos:typescript-icon"

**适用场景**：大型前端/全栈工程、类型安全需求高的项目。

**优缺点**：类型安全、IDE 体验好、与 JS 生态无缝兼容。

[More →](/doc/Interview/backend/language/typescript/)
:::

::: card title="Rust" icon="logos:rust"

**适用场景**：高性能中间件、WebAssembly[^7]、嵌入式、与 C/FFI 交互、安全性能要求高。

**优缺点**：内存安全无 GC、零成本抽象、并发安全。

[More →](/doc/Interview/backend/language/rust/)
:::

::: card title="Go" icon="logos:go"

**适用场景**：云原生/微服务、CLI、高并发服务、DevOps[^8]/基础设施工具（K8s、Docker 等）。

**优缺点**：并发简单（goroutine）、部署简单（单二进制）、性能好。

[More →](/doc/Interview/backend/language/go/)
:::

::::

## 扩展

可结合「API 设计」「架构」「高可用」一起准备：语言选型如何影响接口设计、可观测性与容错。

[^1]: 实时计算：实时流处理框架，专注于低延迟的流式计算。
[^2]: Android/后端：JVM 平台的现代编程语言，由 JetBrains 开发。
[^3]: JVM 平台上的并发框架（主要用于 Scala/Java），基于 Actor 模型。
[^4]: 领域特定语言，为特定问题领域设计的编程语言。
[^5]: 全栈应用：全栈 Web 开发框架，提供完整的 Web 应用解决方案。
[^6]: 微服务：现代高性能 Web 框架，专注于构建 RESTful API。
[^7]: 浏览器高性能：浏览器中的二进制指令格式，允许高性能代码在 Web 中运行。
[^8]: 开发与运维一体化的实践方法论，强调自动化和协作。
