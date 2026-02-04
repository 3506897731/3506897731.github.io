---
title: API Design
createTime: 2026/02/04
permalink: /doc/Interview/backend/api/
---

# API Design

API 设计是后端开发的核心技能之一，选择合适的 API 风格对系统架构有重要影响。

:::: card-grid

::: card title="RESTful" icon="mdi:api"

**适用场景**：CRUD 操作、资源型服务、Web/移动应用、公开 API。

**核心要点**：资源命名、HTTP 方法、状态码、幂等性、认证与安全。

[More →](/doc/Interview/backend/api/restful/)
:::

::: card title="RPC" icon="carbon:api"

**适用场景**：微服务内部通信、高性能要求、强类型接口、跨语言调用。

**核心要点**：gRPC/Thrift/Dubbo、Protobuf、流式传输、服务发现。

[More →](/doc/Interview/backend/api/rpc/)
:::

::: card title="GraphQL" icon="logos:graphql"

**适用场景**：复杂前端应用、移动应用、数据聚合、实时订阅。

**核心要点**：Schema、Query/Mutation、Resolver、N+1 问题、DataLoader。

[More →](/doc/Interview/backend/api/graphql/)
:::

::::

## API 风格对比

| 特性 | RESTful | RPC | GraphQL |
|------|---------|-----|---------|
| **设计理念** | 资源导向 | 函数调用 | 查询语言 |
| **端点** | 多个（按资源） | 多个（按方法） | 单一端点 |
| **数据获取** | 固定结构 | 固定结构 | 按需精确 |
| **性能** | 中等 | 高 | 中等 |
| **学习曲线** | 平缓 | 中等 | 陡峭 |
| **缓存** | 友好 | 一般 | 复杂 |
| **适用场景** | 公开 API | 内部服务 | 复杂前端 |

## 扩展

可结合「架构」「高可用」一起准备：API 设计如何影响系统可扩展性、容错性与可维护性。
