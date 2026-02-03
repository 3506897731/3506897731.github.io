---
title: API 设计
createTime: 2026/02/02
permalink: /doc/Interview/backend/api-design/
---

# API 设计

面试中常问：如何设计清晰、可演进、易用的 API。

---

### ==风格==

**REST**：资源导向、HTTP 动词（GET/POST/PUT/PATCH/DELETE）、无状态、常用 JSON。适合 CRUD、开放 API、前后端分离；弱点是「过度 GET」与接口膨胀。

**GraphQL**：单一端点、客户端按需查询、强类型 schema。适合多端（Web/App）、复杂关联与灵活查询；需注意 N+1、缓存与权限。

**gRPC**：基于 HTTP/2、Protocol Buffers、流式。适合微服务间、高性能、多语言；浏览器支持需网关或 grpc-web。

**tRPC**：端到端类型安全、无 schema 手写、与 TypeScript 深度集成。适合全栈 TS 项目、内部 API；生态与跨语言不如 gRPC。

**取舍**：对外/开放优先考虑 REST 或 GraphQL；服务间、性能敏感选 gRPC；全栈 TS 可考虑 tRPC。

---

### ==版本化==

**URL 版本**：`/v1/users`、`/v2/users`。直观、易路由；路径膨胀，需网关或路由规则。

**Header 版本**：`Accept: application/vnd.api+v1+json` 或自定义 `X-API-Version: 1`。路径干净；客户端与缓存需显式带版本。

**Query 版本**：`/users?version=1`。实现简单；不利于缓存与语义化。

**兼容策略**：向后兼容优先（新字段可选、旧字段废弃不删）；废弃期与公告；契约测试（如 OpenAPI diff）保证不破坏客户端。

---

### ==鉴权==

**JWT**：无状态、自包含声明、适合分布式；需注意过期、刷新与存储（避免 XSS）。常用于 B2B、移动端、前后端分离。

**OAuth2**：委托授权、多端与第三方登录；角色多（Client/Resource Owner/Server），实现与配置较重。适合开放平台、SSO。

**API Key**：简单、易集成；需防泄露与轮换。适合内部、机器对机器、简单场景。

**mTLS**：双向 TLS、证书即身份；运维与证书生命周期复杂。适合服务间、高安全要求。

**组合**：常见为「OAuth2/JWT 拿身份 + API Key 做限流/审计」或「网关验 JWT，下游服务信网关」。

---

### ==文档与契约==

**OpenAPI (Swagger)**：与 REST 配套、可生成文档与客户端、便于契约测试。保持 spec 与实现同步（代码生成或先写 spec）。

**代码即文档**：tRPC、GraphQL schema、gRPC proto 即契约；类型与文档一体，减少漂移。

**兼容性测试**：发布前用旧版客户端契约或 snapshot 对新版做回归；OpenAPI diff、gRPC 兼容规则避免破坏性变更。

---

### ==错误码与约定==

**统一错误体**：如 `{ code, message, details?, requestId? }`；HTTP 状态码与业务码分离（如 200 + 业务 code 表示业务失败）。

**幂等**：写操作提供 `Idempotency-Key` 或唯一请求号，重复请求返回同一结果。

**重试**：约定可重试错误（如 5xx、429）与不可重试（如 4xx 业务错误）；客户端退避与最大重试次数。

**限流语义**：`429 Too Many Requests`、`Retry-After` 或响应头如 `X-RateLimit-*`，便于客户端限流与降级。

---

## 扩展

可结合「语言与运行时」「架构」：不同语言/框架下的 API 设计习惯，以及 BFF、网关在 API 层的作用（聚合、鉴权、协议转换、限流）。
