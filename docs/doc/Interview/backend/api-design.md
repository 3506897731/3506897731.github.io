---
title: API 设计
createTime: 2026/02/02
permalink: /doc/Interview/backend/api-design/
---

# API 设计

面试中常问：如何设计清晰、可演进、易用的 API。

## 要点

- **风格**：REST、GraphQL、gRPC、tRPC 的取舍与适用场景
- **版本化**：URL/Header/Query 版本策略与兼容策略
- **鉴权**：JWT、OAuth2、API Key、mTLS 等
- **文档与契约**：OpenAPI、代码即文档、兼容性测试
- **错误码与约定**：统一错误格式、幂等、重试与限流语义

## 扩展

可结合「语言与运行时」「架构」：不同语言/框架下的 API 设计习惯，以及 BFF、网关在 API 层的作用。
