---
title: Query Layer (查询层)
createTime: 2026/02/04
permalink: /doc/Interview/fundamentals/data-engineering/query/
---

# Query Layer (查询层)

查询层提供 SQL 接口，用于数据分析、OLAP 和即席查询。

## Apache Hive

### 核心概念
- **数据仓库工具**：将结构化数据映射为数据库表
- **SQL-on-Hadoop**：使用 SQL 查询 HDFS 数据
- **元数据管理**：Metastore 存储表结构

### 架构组件

#### 1. Metastore (元数据存储)
```
存储内容：
- 数据库、表、分区信息
- 列名、数据类型
- 存储位置、格式

后端数据库：
- MySQL / PostgreSQL
```

#### 2. HiveServer2
```
服务接口：
- JDBC/ODBC 连接
- Thrift 协议
- 多用户并发
```

#### 3. 执行引擎
```
- MapReduce (默认，已过时)
- Tez (内存计算，推荐)
- Spark (Spark on Hive)
```

### 数据模型

#### 1. 表类型
```sql
-- 内部表 (Managed Table)
CREATE TABLE users (
  id INT,
  name STRING,
  age INT
) STORED AS PARQUET;

-- 外部表 (External Table)
CREATE EXTERNAL TABLE logs (
  timestamp BIGINT,
  level STRING,
  message STRING
)
LOCATION '/data/logs/';

-- 分区表
CREATE TABLE sales (
  product STRING,
  amount DOUBLE
)
PARTITIONED BY (year INT, month INT);

-- 分桶表
CREATE TABLE users (
  id INT,
  name STRING
)
CLUSTERED BY (id) INTO 10 BUCKETS;
```

#### 2. 文件格式
```sql
-- Parquet (列式存储，推荐)
STORED AS PARQUET

-- ORC (优化的列式存储)
STORED AS ORC

-- Avro (行式存储，带 Schema)
STORED AS AVRO

-- TextFile (文本文件)
STORED AS TEXTFILE
```

### 核心特性

#### 1. 分区 (Partition)
```sql
-- 创建分区表
CREATE TABLE logs (
  message STRING
)
PARTITIONED BY (dt STRING, hour STRING);

-- 插入分区数据
INSERT INTO logs PARTITION(dt='2024-01-01', hour='00')
VALUES ('log message');

-- 查询分区
SELECT * FROM logs WHERE dt='2024-01-01' AND hour='00';

-- 动态分区
SET hive.exec.dynamic.partition=true;
SET hive.exec.dynamic.partition.mode=nonstrict;

INSERT OVERWRITE TABLE logs PARTITION(dt, hour)
SELECT message, dt, hour FROM source_logs;
```

#### 2. 分桶 (Bucket)
```sql
-- 作用：
- 数据均匀分布
- 高效 JOIN（bucket map join）
- 高效采样

-- 示例
CREATE TABLE users (
  id INT,
  name STRING
)
CLUSTERED BY (id) INTO 32 BUCKETS;
```

#### 3. 压缩
```sql
-- 启用压缩
SET hive.exec.compress.output=true;
SET mapreduce.output.fileoutputformat.compress.codec=
    org.apache.hadoop.io.compress.SnappyCodec;

-- 压缩算法对比
- Snappy: 快速压缩/解压，中等压缩率
- Gzip: 高压缩率，较慢
- LZO: 支持分片，平衡性能
```

### SQL 特性

#### 1. 窗口函数
```sql
SELECT 
  name,
  salary,
  ROW_NUMBER() OVER (PARTITION BY dept ORDER BY salary DESC) as rank,
  LAG(salary, 1) OVER (PARTITION BY dept ORDER BY hire_date) as prev_salary
FROM employees;
```

#### 2. Join 优化
```sql
-- Map Join (小表)
SELECT /*+ MAPJOIN(b) */ *
FROM large_table a
JOIN small_table b ON a.id = b.id;

-- Bucket Map Join
SET hive.optimize.bucketmapjoin=true;

-- SMB Join (Sort-Merge-Bucket Join)
SET hive.auto.convert.sortmerge.join=true;
```

#### 3. UDF (User Defined Function)
```java
// 自定义函数
public class MyUDF extends UDF {
    public String evaluate(String input) {
        return input.toUpperCase();
    }
}

-- 注册使用
ADD JAR /path/to/my-udf.jar;
CREATE TEMPORARY FUNCTION my_upper AS 'com.example.MyUDF';
SELECT my_upper(name) FROM users;
```

### 性能优化

#### 1. 向量化查询
```sql
SET hive.vectorized.execution.enabled=true;
SET hive.vectorized.execution.reduce.enabled=true;
```

#### 2. 成本优化器 (CBO)
```sql
-- 收集统计信息
ANALYZE TABLE users COMPUTE STATISTICS;
ANALYZE TABLE users COMPUTE STATISTICS FOR COLUMNS;

-- 启用 CBO
SET hive.cbo.enable=true;
```

#### 3. 执行引擎选择
```sql
-- 使用 Tez（推荐）
SET hive.execution.engine=tez;

-- 使用 Spark
SET hive.execution.engine=spark;
```

---

## Presto / Trino

### 核心概念
- **分布式 SQL 查询引擎**：低延迟、高并发
- **MPP 架构**：大规模并行处理
- **联邦查询**：跨数据源查询

### 架构组件

#### 1. Coordinator (协调器)
```
职责：
- 接收查询请求
- 解析 SQL
- 生成执行计划
- 调度 Task
```

#### 2. Worker (工作节点)
```
职责：
- 执行 Task
- 处理数据
- 返回结果
```

#### 3. Connector (连接器)
```
支持的数据源：
- Hive
- MySQL / PostgreSQL
- Kafka
- Elasticsearch
- Redis
- ...
```

### 核心特性

#### 1. 内存计算
```
特点：
- 数据在内存中流式处理
- 无磁盘 I/O（除 Spill）
- 亚秒级响应

限制：
- 查询复杂度受内存限制
- 不适合大 JOIN
```

#### 2. 执行模型
```
Pipeline 执行：
Stage → Task → Driver → Operator

数据流：
Source → Filter → Project → Aggregate → Sink

特点：
- 流式处理
- 无 Shuffle 落盘
```

#### 3. 联邦查询
```sql
-- 跨数据源 JOIN
SELECT 
  h.name,
  m.email
FROM hive.default.users h
JOIN mysql.prod.user_info m ON h.id = m.user_id;
```

### SQL 特性

#### 1. 复杂数据类型
```sql
-- Array
SELECT ARRAY[1, 2, 3] as arr;
SELECT arr[1] FROM table_with_array;

-- Map
SELECT MAP(ARRAY['key1', 'key2'], ARRAY['val1', 'val2']) as m;

-- Row (Struct)
SELECT CAST(ROW('Alice', 25) AS ROW(name VARCHAR, age INT));
```

#### 2. Lambda 表达式
```sql
-- filter
SELECT filter(arr, x -> x > 10) FROM table;

-- transform
SELECT transform(arr, x -> x * 2) FROM table;

-- reduce
SELECT reduce(arr, 0, (s, x) -> s + x, s -> s) FROM table;
```

### 性能优化

#### 1. 分区过滤
```sql
-- 分区裁剪
SELECT * FROM sales 
WHERE year = 2024 AND month = 1;
```

#### 2. Predicate Pushdown
```sql
-- 过滤条件下推到数据源
SELECT * FROM hive.default.logs
WHERE level = 'ERROR' AND dt = '2024-01-01';
```

#### 3. 资源组
```sql
-- 限制查询资源
CREATE RESOURCE GROUP low_priority WITH (
  softMemoryLimit = '10GB',
  maxQueued = 100
);
```

---

## Hive vs Presto 选型

| 维度 | Hive | Presto/Trino |
|------|------|--------------|
| **延迟** | 高（秒/分钟级） | 低（亚秒/秒级） |
| **并发** | 低 | 高 |
| **数据量** | 大（TB/PB） | 中（GB/TB） |
| **复杂查询** | 支持好 | 有限制 |
| **批处理** | 适合 | 不适合 |
| **即席查询** | 较慢 | 快 |
| **跨源查询** | 不支持 | 支持 |
| **成本** | 低 | 中等 |

### 选型建议

✅ **Hive 适合**：
- 离线批处理
- 大数据量 ETL
- 复杂聚合计算
- 成本敏感

✅ **Presto 适合**：
- 即席查询
- 数据探索
- BI 报表
- 跨数据源分析

---

## 常见面试问题

### Hive
- Hive 的执行流程？
- 内部表和外部表的区别？
- 分区和分桶的区别？
- Hive 如何优化 JOIN？
- 动态分区和静态分区？
- ORC 和 Parquet 的区别？
- Metastore 的作用？

### Presto
- Presto 和 Hive 的区别？
- Presto 的架构？
- 为什么 Presto 快？
- Presto 的局限性？
- Connector 的作用？
- 如何优化 Presto 查询？
