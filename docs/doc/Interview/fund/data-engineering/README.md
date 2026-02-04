---
title: Data Engineering
createTime: 2026/02/04
permalink: /doc/Interview/fund/data-engineering/
---

# Data Engineering (数据工程)

数据工程是构建和维护数据基础设施的核心技能，涵盖数据存储、计算、查询和调度等多个层面。

## 数据工程架构层次

:::: card-grid

::: card title="Storage Layer (存储层)" icon="mdi:database"

**核心组件**：HDFS、S3、HBase

**职责**：数据持久化、分布式存储、高可用性、可扩展性

[More →](/doc/Interview/fund/data-engineering/storage/)
:::

::: card title="Compute Layer (计算层)" icon="mdi:cpu-64-bit"

**核心组件**：Spark、Flink

**职责**：批处理、流处理、数据转换、复杂计算

[More →](/doc/Interview/fund/data-engineering/compute/)
:::

::: card title="Query Layer (查询层)" icon="mdi:database-search"

**核心组件**：Hive、Presto

**职责**：SQL 查询、数据分析、OLAP、即席查询

[More →](/doc/Interview/fund/data-engineering/query/)
:::

::: card title="Scheduling Layer (调度层)" icon="mdi:clock-outline"

**核心组件**：Airflow、DolphinScheduler

**职责**：任务编排、依赖管理、监控告警、重试机制

[More →](/doc/Interview/fund/data-engineering/scheduling/)
:::

::::

## 数据工程技术栈

```
┌─────────────────────────────────────────┐
│        Scheduling Layer (调度层)         │
│    Airflow / DolphinScheduler          │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         Query Layer (查询层)             │
│         Hive / Presto / Trino           │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│        Compute Layer (计算层)            │
│       Spark / Flink / MapReduce         │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│        Storage Layer (存储层)            │
│     HDFS / S3 / HBase / Hive Metastore │
└─────────────────────────────────────────┘
```

## 典型数据工程流程

1. **数据采集** → Kafka/Flume
2. **数据存储** → HDFS/S3/HBase
3. **数据处理** → Spark/Flink
4. **数据查询** → Hive/Presto
5. **任务调度** → Airflow/DolphinScheduler
6. **数据可视化** → BI 工具

## 扩展

可结合「数据库」「分布式系统」一起准备：存储、计算、查询的底层原理与优化方法。
