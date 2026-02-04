---
title: Compute Layer (计算层)
createTime: 2026/02/04
permalink: /doc/Interview/fund/data-engineering/compute/
---

# Compute Layer (计算层)

计算层负责数据处理、转换和复杂计算，支持批处理和流处理两种模式。

## Apache Spark

### 核心概念
- **统一计算引擎**：批处理 + 流处理 + SQL + ML
- **内存计算**：比 MapReduce 快 10-100 倍
- **DAG 执行引擎**：优化执行计划

### 核心组件

#### 1. Spark Core
- **RDD (Resilient Distributed Dataset)**：弹性分布式数据集
- **DAG Scheduler**：任务调度
- **Task Scheduler**：任务执行

#### 2. Spark SQL
- **DataFrame/Dataset API**：结构化数据处理
- **Catalyst 优化器**：查询优化
- **支持多种数据源**：Parquet、JSON、Hive、JDBC

#### 3. Spark Streaming
- **Micro-batch 流处理**：小批量处理
- **DStream**：离散化流

#### 4. Structured Streaming
- **真正的流处理**：事件驱动
- **端到端精确一次语义**

### RDD 编程模型

#### 创建 RDD
```python
# 从集合创建
rdd = sc.parallelize([1, 2, 3, 4, 5])

# 从文件创建
rdd = sc.textFile("hdfs://path/to/file")
```

#### Transformation (转换)
```python
# map
rdd2 = rdd.map(lambda x: x * 2)

# filter
rdd3 = rdd.filter(lambda x: x > 2)

# flatMap
rdd4 = rdd.flatMap(lambda x: x.split(" "))

# reduceByKey
rdd5 = rdd.reduceByKey(lambda a, b: a + b)

# join
rdd6 = rdd1.join(rdd2)
```

#### Action (动作)
```python
# collect
result = rdd.collect()

# count
count = rdd.count()

# reduce
sum = rdd.reduce(lambda a, b: a + b)

# saveAsTextFile
rdd.saveAsTextFile("hdfs://output/path")
```

### DataFrame/Dataset API

```python
# 创建 DataFrame
df = spark.read.json("path/to/json")
df = spark.read.parquet("path/to/parquet")

# SQL 查询
df.createOrReplaceTempView("users")
result = spark.sql("SELECT name, age FROM users WHERE age > 18")

# DataFrame 操作
df.select("name", "age") \
  .filter(df.age > 18) \
  .groupBy("department") \
  .agg({"salary": "avg"}) \
  .show()
```

### 执行流程

```
1. Job → DAG (有向无环图)
2. DAG → Stages (按 Shuffle 边界划分)
3. Stage → Tasks (按分区数量)
4. Task → Executor 执行
```

### Shuffle 机制

```
MapReduce 风格的数据重分区：

Map 阶段：
- 数据分区写入本地磁盘
- 生成索引文件

Reduce 阶段：
- 从各个 Map 拉取数据
- 排序、聚合

优化：
- 减少 Shuffle（broadcast join）
- 调整分区数
- 使用 Tungsten（内存管理）
```

### 内存管理

```
Spark 内存分为三部分：
1. Storage Memory (60%)：缓存 RDD
2. Execution Memory (20%)：Shuffle、Join
3. Other Memory (20%)：用户代码、元数据

优化：
- persist/cache 热点数据
- 选择合适的序列化方式（Kryo）
- 调整 spark.memory.fraction
```

### 优化技巧

#### 1. 避免 Shuffle
```python
# 使用 broadcast join（小表）
from pyspark.sql.functions import broadcast
df1.join(broadcast(df2), "key")

# 使用 reduceByKey 代替 groupByKey
rdd.reduceByKey(lambda a, b: a + b)  # 好
rdd.groupByKey().mapValues(sum)       # 差
```

#### 2. 数据倾斜处理
```python
# 加盐（Salt）
df = df.withColumn("salt", (rand() * 10).cast("int"))
df = df.withColumn("salted_key", concat(col("key"), lit("_"), col("salt")))

# 两阶段聚合
```

#### 3. 资源调优
```
spark.executor.memory = 4g
spark.executor.cores = 2
spark.executor.instances = 10
spark.default.parallelism = 200
```

---

## Apache Flink

### 核心概念
- **真正的流处理**：事件驱动，非 Micro-batch
- **精确一次语义**：Exactly-Once
- **低延迟**：毫秒级

### Flink vs Spark

| 特性 | Flink | Spark Streaming |
|------|-------|-----------------|
| **处理模型** | 纯流处理 | Micro-batch |
| **延迟** | 毫秒级 | 秒级 |
| **吞吐量** | 高 | 更高 |
| **状态管理** | 原生支持 | 需额外处理 |
| **窗口** | 更灵活 | 较简单 |
| **Exactly-Once** | 原生支持 | 需配置 |

### 核心组件

#### 1. DataStream API
```java
// 基础流处理
DataStream<String> stream = env.readTextFile("input.txt");

stream.filter(line -> line.contains("error"))
      .map(line -> line.toUpperCase())
      .print();
```

#### 2. Window (窗口)
```java
// 滚动窗口
stream.keyBy(0)
      .window(TumblingEventTimeWindows.of(Time.seconds(5)))
      .sum(1);

// 滑动窗口
stream.keyBy(0)
      .window(SlidingEventTimeWindows.of(Time.seconds(10), Time.seconds(5)))
      .sum(1);

// 会话窗口
stream.keyBy(0)
      .window(EventTimeSessionWindows.withGap(Time.minutes(10)))
      .sum(1);
```

#### 3. Time (时间)
```java
// Event Time（事件时间）
env.setStreamTimeCharacteristic(TimeCharacteristic.EventTime);

// Watermark（水印）
stream.assignTimestampsAndWatermarks(
    WatermarkStrategy.<Event>forBoundedOutOfOrderness(Duration.ofSeconds(5))
        .withTimestampAssigner((event, timestamp) -> event.getTimestamp())
);
```

### 状态管理

#### 1. Keyed State
```java
// ValueState
ValueStateDescriptor<Integer> descriptor = 
    new ValueStateDescriptor<>("count", Integer.class);
ValueState<Integer> state = getRuntimeContext().getState(descriptor);

// ListState
ListStateDescriptor<String> descriptor = 
    new ListStateDescriptor<>("list", String.class);
ListState<String> state = getRuntimeContext().getListState(descriptor);
```

#### 2. Operator State
```java
// CheckpointedFunction
public class MyFunction implements CheckpointedFunction {
    private ListState<Long> checkpointedState;
    
    @Override
    public void snapshotState(FunctionSnapshotContext context) {
        // 保存状态
    }
    
    @Override
    public void initializeState(FunctionInitializationContext context) {
        // 初始化状态
    }
}
```

### Checkpoint 机制

```
Flink 的容错机制：

1. Checkpoint Barrier
   - JobManager 定期发送 Barrier
   - Barrier 随数据流传递

2. 异步快照
   - Operator 接收 Barrier 时保存状态
   - 不阻塞数据处理

3. 恢复
   - 从最近的 Checkpoint 恢复
   - 重放数据

配置：
env.enableCheckpointing(60000);  // 60秒
env.getCheckpointConfig().setCheckpointingMode(CheckpointingMode.EXACTLY_ONCE);
```

### 背压 (Backpressure)

```
自动流控机制：
- 下游处理慢 → 上游自动减速
- 基于 TCP 流控
- 无需额外配置

监控：
- Flink Web UI 查看背压指标
```

### Exactly-Once 语义

```
实现方式：
1. Checkpoint + 状态恢复
2. 两阶段提交（2PC）
3. 幂等写入

支持的 Sink：
- Kafka（事务写入）
- HDFS（临时文件 + Rename）
- JDBC（事务）
```

### 优化技巧

#### 1. 并行度设置
```java
env.setParallelism(10);  // 全局并行度
stream.map(...).setParallelism(20);  // 算子并行度
```

#### 2. State Backend 选择
```java
// MemoryStateBackend（小状态）
env.setStateBackend(new MemoryStateBackend());

// FsStateBackend（中等状态）
env.setStateBackend(new FsStateBackend("hdfs://..."));

// RocksDBStateBackend（大状态）
env.setStateBackend(new RocksDBStateBackend("hdfs://..."));
```

#### 3. 资源调优
```
taskmanager.numberOfTaskSlots = 2
parallelism.default = 1
taskmanager.memory.process.size = 2048m
```

---

## Spark vs Flink 选型

| 场景 | 推荐 | 原因 |
|------|------|------|
| **批处理** | Spark | 成熟、生态丰富 |
| **实时流处理** | Flink | 低延迟、Exactly-Once |
| **SQL 分析** | Spark | SQL 引擎强大 |
| **复杂事件处理** | Flink | CEP 支持好 |
| **机器学习** | Spark | MLlib 成熟 |
| **状态管理** | Flink | 原生支持 |

---

## 常见面试问题

### Spark
- RDD、DataFrame、Dataset 的区别？
- Spark 的执行流程（Job → Stage → Task）？
- Shuffle 的原理和优化？
- 数据倾斜如何处理？
- Spark 内存管理？
- broadcast join 的原理？

### Flink
- Flink 和 Spark Streaming 的区别？
- Watermark 的作用？
- Checkpoint 的实现原理？
- Exactly-Once 如何保证？
- 背压机制？
- State Backend 的选择？
- 如何处理延迟数据？
