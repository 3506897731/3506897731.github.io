---
title: RPC (Remote Procedure Call)
createTime: 2026/02/04
permalink: /doc/Interview/backend/api/rpc/
---

# RPC (Remote Procedure Call)

## 核心概念

RPC 允许程序调用另一台机器上的函数/方法，就像调用本地函数一样。

## 常见 RPC 框架

### 1. gRPC
- **特点**：Google 开发，基于 HTTP/2，使用 Protobuf
- **适用**：微服务、高性能、跨语言
- **优势**：强类型、双向流、性能优秀

### 2. Thrift
- **特点**：Apache 项目，支持多种协议和传输层
- **适用**：跨语言服务、大规模系统
- **优势**：灵活性高、生态成熟

### 3. Dubbo
- **特点**：阿里巴巴开源，Java 生态
- **适用**：Java 微服务、分布式系统
- **优势**：服务治理功能强大

## 核心要点

### 1. IDL (接口定义语言)
```protobuf
service UserService {
  rpc GetUser(UserRequest) returns (UserResponse);
  rpc ListUsers(ListRequest) returns (stream User);
}
```

### 2. 序列化
- **Protobuf**：二进制，性能高，体积小
- **JSON**：可读性好，调试方便
- **Thrift Binary**：高性能二进制

### 3. 通信方式
- **Unary RPC**：单请求-单响应
- **Server Streaming**：单请求-多响应流
- **Client Streaming**：多请求流-单响应
- **Bidirectional Streaming**：双向流

## 与 RESTful 对比

| 特性 | RPC | RESTful |
|------|-----|---------|
| **通信方式** | 函数调用 | 资源操作 |
| **协议** | 多种（HTTP/2, TCP） | HTTP/HTTPS |
| **性能** | 更高（二进制） | 较低（文本） |
| **学习曲线** | 较陡 | 平缓 |
| **适用场景** | 内部微服务 | 公开 API |

## 最佳实践

1. **服务发现**：集成 Consul/Etcd
2. **负载均衡**：客户端/服务端负载均衡
3. **超时控制**：设置合理的超时时间
4. **错误处理**：使用 gRPC 状态码
5. **监控追踪**：集成分布式追踪系统
