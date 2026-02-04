---
title: RESTful API
createTime: 2026/02/04
permalink: /doc/Interview/backend/api/restful/
---

# RESTful API

## 核心概念

RESTful API 是基于 REST（Representational State Transfer）架构风格设计的 Web 服务接口。

## 设计原则

### 1. 资源命名
- 使用名词而非动词：`/users` 而不是 `/getUsers`
- 使用复数形式：`/users` 而不是 `/user`
- 层级关系：`/users/{id}/orders`
- 小写字母，使用连字符：`/user-profiles`

### 2. HTTP 方法
- **GET**：获取资源（幂等）
- **POST**：创建资源
- **PUT**：完整更新资源（幂等）
- **PATCH**：部分更新资源
- **DELETE**：删除资源（幂等）

### 3. 状态码
- **2xx 成功**：200 OK, 201 Created, 204 No Content
- **3xx 重定向**：301 Moved Permanently, 304 Not Modified
- **4xx 客户端错误**：400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found
- **5xx 服务器错误**：500 Internal Server Error, 503 Service Unavailable

### 4. 查询参数
- 过滤：`/users?role=admin`
- 排序：`/users?sort=created_at&order=desc`
- 分页：`/users?page=1&size=20`
- 字段选择：`/users?fields=id,name,email`

## 最佳实践

1. **版本控制**：`/v1/users` 或 Header: `API-Version: 1`
2. **HATEOAS**：返回相关资源链接
3. **幂等性设计**：确保 PUT/DELETE 可重复调用
4. **错误处理**：统一的错误响应格式
5. **内容协商**：支持 JSON/XML 等多种格式

## 优缺点

**优点**：
- 简单易懂，学习成本低
- 与 HTTP 协议天然契合
- 缓存友好（GET 请求）
- 工具链成熟

**缺点**：
- 过度获取/获取不足（Over-fetching/Under-fetching）
- 多次请求才能获取关联数据
- 难以表达复杂操作

---

## Authentication (认证)

### 常见认证方式

#### 1. JWT (JSON Web Token)
- **特点**：无状态、自包含、跨域友好
- **适用**：微服务、移动应用、前后端分离
- **结构**：Header.Payload.Signature

```json
{
  "alg": "HS256",
  "typ": "JWT"
}.
{
  "sub": "user123",
  "exp": 1234567890
}.
[signature]
```

**优点**：无需服务端存储、扩展性好  
**缺点**：无法主动失效、Payload 大小有限

#### 2. OAuth 2.0
- **特点**：授权框架、第三方登录
- **适用**：开放平台、第三方应用授权
- **流程**：授权码模式、隐式模式、密码模式、客户端模式

**角色**：
- Resource Owner（资源所有者）
- Client（客户端）
- Authorization Server（授权服务器）
- Resource Server（资源服务器）

#### 3. Session + Cookie
- **特点**：传统方式、服务端存储
- **适用**：传统 Web 应用、单体应用
- **流程**：登录 → 创建 Session → 返回 Session ID → Cookie 存储

**优点**：易于实现、易于控制  
**缺点**：扩展性差、CSRF 风险

#### 4. API Key
- **特点**：简单直接、静态密钥
- **适用**：服务间调用、简单场景
- **方式**：URL 参数、Header、Query String

**优点**：简单易用  
**缺点**：安全性较低、难以管理

#### 5. SSO (单点登录)
- **特点**：一次登录，多处使用
- **适用**：企业内部系统、多系统集成
- **实现**：CAS、SAML、OAuth 2.0

### 认证最佳实践

1. **使用 HTTPS**：加密传输
2. **Token 刷新机制**：Access Token + Refresh Token
3. **Token 存储**：HttpOnly Cookie（防 XSS）
4. **过期时间**：合理设置有效期
5. **多因素认证**：增强安全性（2FA/MFA）
6. **限流防刷**：防止暴力破解

---

## Security (安全)

### 常见安全威胁

#### 1. CORS (跨域资源共享)
**问题**：浏览器同源策略限制跨域请求

**解决方案**：
```http
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

**最佳实践**：
- 明确指定允许的域名（避免 `*`）
- 限制允许的 HTTP 方法
- 使用预检请求（OPTIONS）

#### 2. CSRF (跨站请求伪造)
**问题**：攻击者利用用户身份发起恶意请求

**解决方案**：
- **CSRF Token**：表单中包含随机 Token
- **SameSite Cookie**：`SameSite=Strict/Lax`
- **验证 Referer/Origin**：检查请求来源

#### 3. XSS (跨站脚本攻击)
**问题**：注入恶意脚本到页面

**解决方案**：
- **输入验证**：过滤/转义用户输入
- **CSP**：Content-Security-Policy 头
- **HttpOnly Cookie**：防止 JavaScript 访问
- **输出编码**：HTML/JavaScript/URL 编码

#### 4. SQL 注入
**问题**：恶意 SQL 代码注入

**解决方案**：
- **参数化查询**：使用预编译语句
- **ORM 框架**：避免直接拼接 SQL
- **输入验证**：严格验证用户输入
- **最小权限原则**：数据库用户权限最小化

#### 5. 其他注入攻击
- **NoSQL 注入**：MongoDB 等
- **命令注入**：系统命令执行
- **LDAP 注入**：目录服务查询
- **XML 注入**：XML 解析器漏洞

### 安全最佳实践

#### 1. 加密传输
- **HTTPS**：强制使用 TLS/SSL
- **HSTS**：强制 HTTPS 访问
- **证书验证**：验证服务器证书

#### 2. 限流与防刷
- **Rate Limiting**：限制请求频率
- **IP 黑名单**：封禁恶意 IP
- **验证码**：防止自动化攻击
- **滑动窗口**：限流算法

#### 3. 输入验证
- **白名单验证**：只允许合法输入
- **长度限制**：防止 DoS 攻击
- **类型检查**：验证数据类型
- **正则表达式**：格式验证

#### 4. 敏感数据保护
- **加密存储**：密码哈希（bcrypt/scrypt）
- **脱敏显示**：隐藏敏感信息
- **日志脱敏**：不记录敏感数据
- **最小化暴露**：只返回必要字段

#### 5. API 安全
- **认证授权**：严格的身份验证
- **API Key 管理**：定期轮换
- **请求签名**：防止重放攻击
- **HTTPS Only**：禁止 HTTP 访问

### 安全头配置

```http
# XSS 保护
X-XSS-Protection: 1; mode=block

# 防止点击劫持
X-Frame-Options: DENY

# 内容类型嗅探
X-Content-Type-Options: nosniff

# CSP 策略
Content-Security-Policy: default-src 'self'

# HSTS
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

---

## 常见面试问题

### RESTful 设计
- 如何设计 RESTful API 的资源命名？
- PUT 和 PATCH 的区别？
- 幂等性是什么？哪些方法是幂等的？

### 认证相关
- JWT 如何防止篡改？
- OAuth 2.0 的授权码模式流程？
- Session 和 JWT 的区别？
- 如何实现 Token 刷新？
- 如何处理 Token 泄露？

### 安全相关
- CORS 的原理和配置？
- 如何防止 CSRF 攻击？
- JWT 存储在哪里最安全？
- SQL 注入的原理和防范？
- 如何实现 API 限流？
