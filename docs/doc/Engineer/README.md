---
title: 工程实践
createTime: 2026/01/29
permalink: /doc/Engineer/
---

# 工程实践

::: note NOTE
📄 欢迎来到工程实践板块！这里记录了软件工程中的实践经验和技术总结。
:::

按「从上到下」大致分层，并标出当前常用、较新的技术方向。

:::: steps
1. **应用层**

   用户直接使用的软件、界面、业务逻辑。主流/常用技术举例：Web（React/Vue/Next/Nuxt）、移动端（React Native/Flutter）、桌面（Electron/Tauri）、低代码/无代码

2. **API / 服务层**

   业务服务、接口、领域逻辑。主流/常用技术举例：REST、GraphQL、gRPC、tRPC、BFF、Serverless（Lambda/云函数）

3. **应用框架与运行时**

   语言运行时、Web/服务框架。主流/常用技术举例：Node.js、Deno/Bun、Go（Gin/Fiber）、Rust（Actix/Axum）、Java（Spring Boot）、Python（FastAPI）

4. **数据与存储**

   持久化、缓存、搜索。主流/常用技术举例：PostgreSQL、MySQL、MongoDB、Redis、Elasticsearch、向量库（Pinecone/Milvus/pgvector）

5. **消息与流**

   异步、解耦、事件流。主流/常用技术举例：Kafka、RabbitMQ、Redis Streams、Pulsar、云消息队列（SQS/SNS 等）

6. **容器与编排**

   部署、调度、资源隔离。主流/常用技术举例：Docker、Kubernetes、Podman、K3s、Serverless 容器（如 AWS Fargate）

7. **云与 IaaS**

   计算、网络、存储资源。主流/常用技术举例：AWS、GCP、Azure、阿里云、腾讯云；虚拟机、对象存储、VPC、负载均衡

8. **操作系统**

   进程、内存、文件系统、网络栈。主流/常用技术举例：Linux（主流服务器）、Windows Server、macOS（部分开发/部署）

9. **运行时与语言**

   内存管理、并发模型、类型系统。主流/常用技术举例：V8/SpiderMonkey、Go runtime、JVM、CPython、Rust（无 GC）、WASM

10. **系统软件与中间件**

    协议、代理、网关。主流/常用技术举例：Nginx、Envoy、Traefik、Service Mesh（Istio/Linkerd）

11. **网络协议栈**

    传输、路由、安全。主流/常用技术举例：TCP/UDP、QUIC、TLS、HTTP/2、HTTP/3、mTLS

12. **硬件抽象**

    驱动、虚拟化、资源抽象。主流/常用技术举例：虚拟化（KVM/VMware）、Hypervisor、裸金属、GPU 虚拟化

13. **硬件**

    CPU、内存、存储、网络设备。主流/常用技术举例：x86/ARM、SSD/NVMe、GPU（CUDA/ROCm）、DPU、智能网卡
::::

### ==补充说明== （「新」且「常用」）

- **应用层**：AI 增强的 Web/App、Agent 式交互、低代码搭建、跨端（Flutter/RN）仍是主流。
- **服务层**：Serverless、边缘计算、BFF + 微前端 很常见；gRPC/GraphQL 在复杂系统里多用。
- **数据层**：向量数据库、图数据库在 RAG、推荐、风控里用得越来越多。
- **基础设施**：K8s 已是事实标准；GitOps（Argo CD/Flux）、IaC（Terraform/Pulumi）是常规配置。
- **底层/性能**：Rust、Go 写系统组件和中间件；WASM 用于高性能前端或边缘计算；QUIC/HTTP3 逐渐普及。
