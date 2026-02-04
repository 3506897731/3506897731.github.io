---
title: Storage Layer (存储层)
createTime: 2026/02/04
permalink: /doc/Interview/fund/data-engineering/storage/
---

# Storage Layer (存储层)

存储层是数据工程的基础，负责数据的持久化、分布式存储和高可用性。

## HDFS (Hadoop Distributed File System)

### 核心概念
- **分布式文件系统**：Hadoop 生态的核心存储
- **设计目标**：高吞吐、大文件存储、容错性

### 架构组件

#### 1. NameNode (主节点)
- **职责**：管理文件系统元数据、目录树
- **元数据**：文件名、权限、block 位置
- **高可用**：支持 HA（主备切换）

#### 2. DataNode (数据节点)
- **职责**：存储实际数据块（block）
- **心跳机制**：定期向 NameNode 报告状态
- **副本管理**：默认 3 副本

#### 3. Secondary NameNode
- **职责**：定期合并 fsimage 和 edits
- **注意**：不是 NameNode 的热备

### 核心特性

#### 1. Block 机制
```
文件切分为固定大小的 block（默认 128MB）
每个 block 存储多个副本（默认 3 副本）

示例：
1GB 文件 → 8 个 block (128MB * 8)
每个 block × 3 副本 = 24 个数据块
```

#### 2. 副本放置策略
```
第一个副本：客户端所在节点（本地写入）
第二个副本：不同机架的随机节点
第三个副本：与第二个副本同机架的不同节点

目的：
- 性能：本地读写
- 可靠性：跨机架容灾
```

#### 3. 数据一致性
- **强一致性**：单 Writer，多 Reader
- **写入流程**：Pipeline 写入，ACK 确认
- **租约机制**：防止并发写入

### 读写流程

#### 写入流程
```
1. Client → NameNode：请求写入文件
2. NameNode → Client：返回 DataNode 列表
3. Client → DataNode1：建立 Pipeline
4. DataNode1 → DataNode2 → DataNode3：传输数据
5. ACK 确认：DataNode3 → DataNode2 → DataNode1 → Client
6. 完成后通知 NameNode
```

#### 读取流程
```
1. Client → NameNode：请求读取文件
2. NameNode → Client：返回 block 位置列表
3. Client → 最近的 DataNode：读取数据
4. 本地缓存：提高读取性能
```

### 优缺点

**优点**：
- 高吞吐量（适合大文件）
- 容错性强（多副本）
- 可扩展性好（线性扩展）
- 成本低（商用硬件）

**缺点**：
- 不适合小文件（元数据压力大）
- 低延迟访问差（非实时）
- 单点故障风险（NameNode）
- 不支持随机写入

---

## S3 (Amazon Simple Storage Service)

### 核心概念
- **对象存储**：云原生存储服务
- **无限容量**：按需扩展
- **高可用**：跨区域复制

### 核心特性

#### 1. Bucket (存储桶)
```
- 全局唯一的命名空间
- 区域隔离（Region）
- 访问控制（IAM/ACL）
```

#### 2. Object (对象)
```
- Key-Value 存储
- 单个对象最大 5TB
- 版本控制支持
```

#### 3. 存储类别
- **Standard**：频繁访问
- **IA (Infrequent Access)**：低频访问
- **Glacier**：归档存储（分钟到小时级恢复）
- **Deep Archive**：长期归档（12 小时恢复）

### S3 vs HDFS

| 特性 | HDFS | S3 |
|------|------|-----|
| **部署** | 自建集群 | 托管服务 |
| **扩展性** | 需规划容量 | 无限容量 |
| **成本** | 硬件 + 运维 | 按使用付费 |
| **一致性** | 强一致 | 最终一致（新版强一致） |
| **延迟** | 低（本地） | 较高（网络） |
| **适用** | Hadoop 生态 | 云原生应用 |

### 数据湖架构
```
S3 作为数据湖存储：
- Raw Data (Parquet/ORC)
- Delta Lake / Iceberg
- Spark/Presto 直接查询
```

---

## HBase (Hadoop Database)

### 核心概念
- **NoSQL 数据库**：基于 HDFS 的列式存储
- **设计目标**：随机读写、海量数据、低延迟

### 架构组件

#### 1. HMaster (主节点)
- **职责**：Region 分配、负载均衡
- **元数据**：表结构、Region 信息

#### 2. RegionServer (区域服务器)
- **职责**：处理读写请求
- **管理**：多个 Region

#### 3. ZooKeeper
- **职责**：协调服务、选举、配置管理

### 数据模型

#### 1. 表结构
```
Table
  ├── RowKey (行键，唯一标识)
  ├── Column Family (列族)
  │     ├── Column (列)
  │     └── Timestamp (时间戳)
  └── Cell (单元格，存储值)

示例：
RowKey: user_001
CF: info
  - name: "Alice"
  - age: "25"
CF: address
  - city: "Beijing"
```

#### 2. RowKey 设计
```
原则：
1. 唯一性
2. 散列性（避免热点）
3. 可排序

反模式：
- 时间戳开头（热点写入）
- 单调递增（Region 不均衡）

最佳实践：
- Hash + 业务 ID
- Reverse Timestamp
- 分区键 + 业务键
```

### 核心特性

#### 1. LSM-Tree 存储
```
写入流程：
1. WAL (Write-Ahead Log) → 持久化
2. MemStore → 内存写入
3. Flush → 刷新到 HFile (HDFS)
4. Compaction → 合并小文件

优势：
- 高写入性能
- 顺序写入磁盘
```

#### 2. Region 分区
```
表按 RowKey 范围分区：
Region1: [000, 100)
Region2: [100, 200)
Region3: [200, ...)

自动分裂：
- Region 大小达到阈值
- 动态负载均衡
```

#### 3. 数据版本
```
每个 Cell 存储多个版本（时间戳）
可配置保留版本数或 TTL

查询指定版本：
get 'table', 'rowkey', {COLUMN => 'cf:col', VERSIONS => 5}
```

### 读写优化

#### 1. 布隆过滤器
```
快速判断 RowKey 是否存在
减少磁盘 I/O
```

#### 2. 块缓存 (BlockCache)
```
LRU 缓存热点数据
加速读取
```

#### 3. 预分区
```
建表时指定分区：
create 'table', 'cf', SPLITS => ['100', '200', '300']

避免热点写入
```

### 优缺点

**优点**：
- 随机读写性能好
- 海量数据存储（PB 级）
- 自动分区与负载均衡
- 强一致性

**缺点**：
- 不支持 SQL（需 Phoenix）
- 不适合复杂查询
- RowKey 设计复杂
- 运维成本高

### 适用场景

✅ **适合**：
- 时序数据（监控、日志）
- 用户画像（海量用户）
- 消息存储（聊天记录）
- 实时查询（毫秒级）

❌ **不适合**：
- 复杂 SQL 查询
- 事务处理
- 小数据量（<TB）
- 频繁更新

---

## 存储选型对比

| 维度 | HDFS | S3 | HBase |
|------|------|-----|-------|
| **类型** | 文件系统 | 对象存储 | 数据库 |
| **访问方式** | 顺序读写 | REST API | 随机读写 |
| **延迟** | 中等 | 较高 | 低 |
| **吞吐量** | 高 | 高 | 中等 |
| **一致性** | 强一致 | 最终一致 | 强一致 |
| **适用场景** | 离线计算 | 数据湖 | 实时查询 |
| **成本** | 中等 | 按需付费 | 较高 |

---

## 常见面试问题

### HDFS
- HDFS 的读写流程？
- NameNode 的单点故障如何解决？
- 副本放置策略是什么？
- 小文件问题如何解决？
- HDFS 和 S3 的区别？

### HBase
- HBase 的数据模型？
- RowKey 如何设计？
- Region 分裂的原理？
- HBase 的写入流程？
- 如何避免热点问题？
- LSM-Tree 的优势？
