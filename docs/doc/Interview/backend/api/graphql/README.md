---
title: GraphQL
createTime: 2026/02/04
permalink: /doc/Interview/backend/api/graphql/
---

# GraphQL

## 核心概念

GraphQL 是一种 API 查询语言和运行时，由 Facebook 开发，用于更高效、强大和灵活的数据获取。

## 核心特性

### 1. 声明式数据获取
客户端精确指定需要的数据：

```graphql
query {
  user(id: "123") {
    id
    name
    email
    posts {
      title
      createdAt
    }
  }
}
```

### 2. 单一端点
所有请求通过一个端点：`POST /graphql`

### 3. 强类型系统
使用 Schema Definition Language (SDL) 定义类型：

```graphql
type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]!
}

type Post {
  id: ID!
  title: String!
  content: String
  author: User!
  createdAt: DateTime!
}

type Query {
  user(id: ID!): User
  users: [User!]!
  post(id: ID!): Post
}

type Mutation {
  createUser(name: String!, email: String!): User!
  updateUser(id: ID!, name: String, email: String): User!
  deleteUser(id: ID!): Boolean!
}
```

## GraphQL vs RESTful

| 特性 | GraphQL | RESTful |
|------|---------|---------|
| **端点** | 单一端点 | 多个端点 |
| **数据获取** | 按需精确获取 | 固定结构 |
| **Over-fetching** | 无 | 有 |
| **Under-fetching** | 无 | 有（需多次请求） |
| **版本管理** | 无需版本 | 需要版本控制 |
| **学习曲线** | 较陡 | 平缓 |
| **缓存** | 复杂 | 简单（HTTP 缓存） |

## 核心操作

### 1. Query (查询)
读取数据：

```graphql
query GetUser($userId: ID!) {
  user(id: $userId) {
    id
    name
    email
  }
}
```

### 2. Mutation (变更)
修改数据：

```graphql
mutation CreatePost($title: String!, $content: String!) {
  createPost(title: $title, content: $content) {
    id
    title
    createdAt
  }
}
```

### 3. Subscription (订阅)
实时数据推送：

```graphql
subscription OnPostCreated {
  postCreated {
    id
    title
    author {
      name
    }
  }
}
```

## Resolver（解析器）

Resolver 是实际执行数据获取的函数：

```javascript
const resolvers = {
  Query: {
    user: async (parent, { id }, context) => {
      return await context.db.user.findById(id);
    },
    users: async (parent, args, context) => {
      return await context.db.user.findAll();
    }
  },
  
  Mutation: {
    createUser: async (parent, { name, email }, context) => {
      return await context.db.user.create({ name, email });
    }
  },
  
  User: {
    posts: async (parent, args, context) => {
      return await context.db.post.findByUserId(parent.id);
    }
  }
};
```

## N+1 问题

### 问题
```graphql
query {
  users {        # 1 次查询
    id
    name
    posts {      # 每个 user 查询一次 posts (N 次)
      title
    }
  }
}
```

### 解决方案：DataLoader
```javascript
const DataLoader = require('dataloader');

const postLoader = new DataLoader(async (userIds) => {
  const posts = await db.post.findByUserIds(userIds);
  return userIds.map(id => posts.filter(post => post.userId === id));
});

const resolvers = {
  User: {
    posts: (user) => postLoader.load(user.id)
  }
};
```

## 分页

### Cursor-based (推荐)
```graphql
type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

type UserConnection {
  edges: [UserEdge!]!
  pageInfo: PageInfo!
}

type UserEdge {
  node: User!
  cursor: String!
}

type Query {
  users(first: Int, after: String): UserConnection!
}
```

### Offset-based
```graphql
type Query {
  users(limit: Int, offset: Int): [User!]!
}
```

## 错误处理

GraphQL 返回部分成功：

```json
{
  "data": {
    "user": null,
    "posts": [...]
  },
  "errors": [
    {
      "message": "User not found",
      "locations": [{ "line": 2, "column": 3 }],
      "path": ["user"],
      "extensions": {
        "code": "NOT_FOUND"
      }
    }
  ]
}
```

## 安全最佳实践

### 1. 查询复杂度限制
```javascript
const depthLimit = require('graphql-depth-limit');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  validationRules: [depthLimit(5)]
});
```

### 2. 查询成本分析
```javascript
const costAnalysis = require('graphql-cost-analysis');

const server = new ApolloServer({
  validationRules: [
    costAnalysis({
      maximumCost: 1000,
    })
  ]
});
```

### 3. 禁用 Introspection（生产环境）
```javascript
const server = new ApolloServer({
  introspection: process.env.NODE_ENV !== 'production'
});
```

### 4. 认证授权
```javascript
const resolvers = {
  Query: {
    me: (parent, args, context) => {
      if (!context.user) {
        throw new AuthenticationError('Must be logged in');
      }
      return context.user;
    }
  }
};
```

## 常用框架

### 1. Apollo Server (Node.js)
```javascript
const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello world!'
  }
};

const server = new ApolloServer({ typeDefs, resolvers });
server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
```

### 2. GraphQL Java
```java
@Component
public class UserResolver implements GraphQLQueryResolver {
    public User user(Long id) {
        return userService.findById(id);
    }
}
```

### 3. Strawberry (Python)
```python
import strawberry

@strawberry.type
class User:
    id: int
    name: str
    email: str

@strawberry.type
class Query:
    @strawberry.field
    def user(self, id: int) -> User:
        return get_user(id)
```

## 优缺点

**优点**：
- **按需获取**：避免 Over-fetching/Under-fetching
- **强类型**：类型安全、自动补全、文档生成
- **单一端点**：简化 API 管理
- **实时订阅**：内置 WebSocket 支持
- **快速迭代**：无需版本控制

**缺点**：
- **学习成本**：概念较多，上手较难
- **缓存复杂**：难以利用 HTTP 缓存
- **性能问题**：需要优化 N+1 问题
- **文件上传**：需额外处理
- **查询复杂度**：需防止恶意查询

## 适用场景

✅ **适合**：
- 移动应用（减少网络请求）
- 复杂前端应用（灵活数据需求）
- 微服务聚合（统一数据层）
- 实时应用（Subscription）

❌ **不适合**：
- 简单 CRUD 应用
- 需要复杂缓存策略
- 团队不熟悉 GraphQL
- 文件上传为主的服务

## 常见面试问题

- GraphQL 和 REST 的区别？
- 什么是 N+1 问题？如何解决？
- GraphQL 如何处理错误？
- 如何防止恶意查询？
- Subscription 的实现原理？
- 如何在 GraphQL 中实现分页？
- DataLoader 的作用是什么？
