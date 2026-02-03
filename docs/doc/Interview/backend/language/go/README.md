---
title: Go
createTime: 2026/02/02
permalink: /doc/Interview/backend/language/go/
---

# Go

## 适用场景

云原生/微服务、CLI、高并发网络服务、DevOps/基础设施工具（K8s、Docker 等）。

## 要点

- 并发：goroutine、channel、sync 包
- 标准库：net/http、context、encoding、testing
- 工程：模块、单二进制部署、与 CGO

## 优缺点

**优点**：并发简单（goroutine）、部署简单（单二进制）、性能好。  
**缺点**：泛型与生态相对保守，错误处理略啰嗦。
