---
title: Scheduling Layer (调度层)
createTime: 2026/02/04
permalink: /doc/Interview/fund/data-engineering/scheduling/
---

# Scheduling Layer (调度层)

调度层负责任务编排、依赖管理、监控告警和重试机制，是数据工程的控制中心。

## Apache Airflow

### 核心概念
- **工作流编排平台**：DAG（有向无环图）定义任务
- **Python 编写**：代码即配置
- **丰富的 Operator**：支持各种数据源和计算引擎

### 核心组件

#### 1. Scheduler (调度器)
```
职责：
- 解析 DAG 文件
- 触发任务执行
- 管理任务状态
```

#### 2. Executor (执行器)
```
类型：
- SequentialExecutor: 单线程（开发测试）
- LocalExecutor: 多进程（单机）
- CeleryExecutor: 分布式（生产推荐）
- KubernetesExecutor: K8s 原生
```

#### 3. Web Server (Web UI)
```
功能：
- DAG 可视化
- 任务监控
- 日志查看
- 手动触发
```

#### 4. Metastore (元数据库)
```
存储：
- DAG 信息
- 任务状态
- 执行历史
```

### DAG 定义

#### 基础 DAG
```python
from airflow import DAG
from airflow.operators.bash import BashOperator
from datetime import datetime, timedelta

default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'start_date': datetime(2024, 1, 1),
    'email_on_failure': True,
    'email_on_retry': False,
    'retries': 3,
    'retry_delay': timedelta(minutes=5),
}

dag = DAG(
    'example_dag',
    default_args=default_args,
    description='A simple DAG',
    schedule_interval='0 0 * * *',  # 每天 00:00
    catchup=False,
)

# 定义任务
task1 = BashOperator(
    task_id='print_date',
    bash_command='date',
    dag=dag,
)

task2 = BashOperator(
    task_id='sleep',
    bash_command='sleep 5',
    dag=dag,
)

# 设置依赖
task1 >> task2  # task1 完成后执行 task2
```

#### 常用 Operator
```python
# PythonOperator
from airflow.operators.python import PythonOperator

def my_function():
    print("Hello Airflow!")

python_task = PythonOperator(
    task_id='python_task',
    python_callable=my_function,
    dag=dag,
)

# SparkSubmitOperator
from airflow.providers.apache.spark.operators.spark_submit import SparkSubmitOperator

spark_task = SparkSubmitOperator(
    task_id='spark_job',
    application='/path/to/spark_job.py',
    conn_id='spark_default',
    dag=dag,
)

# HiveOperator
from airflow.providers.apache.hive.operators.hive import HiveOperator

hive_task = HiveOperator(
    task_id='hive_query',
    hql='SELECT * FROM table WHERE dt={{ ds }}',
    dag=dag,
)
```

### 依赖管理

#### 1. 任务依赖
```python
# 线性依赖
task1 >> task2 >> task3

# 并行依赖
task1 >> [task2, task3] >> task4

# 分支
from airflow.operators.python import BranchPythonOperator

def choose_branch(**context):
    if context['ds'] == '2024-01-01':
        return 'task_a'
    else:
        return 'task_b'

branch = BranchPythonOperator(
    task_id='branching',
    python_callable=choose_branch,
    provide_context=True,
    dag=dag,
)

branch >> [task_a, task_b]
```

#### 2. 外部依赖
```python
# ExternalTaskSensor: 等待其他 DAG 的任务
from airflow.sensors.external_task import ExternalTaskSensor

wait_for_upstream = ExternalTaskSensor(
    task_id='wait_for_upstream',
    external_dag_id='upstream_dag',
    external_task_id='upstream_task',
    dag=dag,
)
```

### 调度策略

#### 1. 时间调度
```python
# Cron 表达式
schedule_interval='0 0 * * *'     # 每天 00:00
schedule_interval='0 */4 * * *'   # 每 4 小时
schedule_interval='0 0 * * 1'     # 每周一 00:00

# Timedelta
schedule_interval=timedelta(hours=1)  # 每小时
```

#### 2. 数据分区
```python
# 使用宏变量
hql = """
INSERT OVERWRITE TABLE target PARTITION(dt='{{ ds }}')
SELECT * FROM source WHERE dt='{{ ds }}'
"""

# ds: YYYY-MM-DD
# ds_nodash: YYYYMMDD
# yesterday_ds: 昨天日期
```

### 监控告警

#### 1. 邮件告警
```python
default_args = {
    'email': ['admin@example.com'],
    'email_on_failure': True,
    'email_on_retry': False,
}
```

#### 2. SLA 监控
```python
task = BashOperator(
    task_id='sla_task',
    bash_command='echo "hello"',
    sla=timedelta(minutes=30),  # 超过 30 分钟告警
    dag=dag,
)
```

### 优化实践

#### 1. 动态 DAG 生成
```python
# 根据配置生成多个相似 DAG
configs = [
    {'name': 'dag1', 'schedule': '0 1 * * *'},
    {'name': 'dag2', 'schedule': '0 2 * * *'},
]

for config in configs:
    dag = DAG(
        config['name'],
        schedule_interval=config['schedule'],
        default_args=default_args,
    )
    globals()[config['name']] = dag
```

#### 2. TaskGroup
```python
from airflow.utils.task_group import TaskGroup

with dag:
    with TaskGroup('group1') as group1:
        task1 = BashOperator(task_id='task1', bash_command='echo 1')
        task2 = BashOperator(task_id='task2', bash_command='echo 2')
        task1 >> task2
```

---

## DolphinScheduler (海豚调度)

### 核心概念
- **分布式易扩展的可视化 DAG 工作流任务调度系统**
- **国产开源**：Apache 顶级项目
- **低代码**：拖拽式 DAG 编排

### 核心特性

#### 1. 可视化 DAG
```
特点：
- 拖拽式编排
- 无需编写代码
- 实时预览
```

#### 2. 多租户
```
功能：
- 租户隔离
- 资源配额
- 权限管理
```

#### 3. 高可用
```
架构：
- Master 集群（主备）
- Worker 集群（负载均衡）
- ZooKeeper 协调
```

### 任务类型

#### 1. Shell 任务
```bash
#!/bin/bash
echo "Hello DolphinScheduler"
```

#### 2. SQL 任务
```sql
-- 支持多种数据库
SELECT * FROM users WHERE dt='${ds}';
```

#### 3. Spark 任务
```
配置：
- Spark 版本
- 主函数类
- JAR 包路径
- 参数
```

#### 4. Python 任务
```python
#!/usr/bin/python
print("Hello DolphinScheduler")
```

### 依赖管理

#### 1. 任务依赖
```
类型：
- 串行依赖
- 并行依赖
- 分支依赖
```

#### 2. 工作流依赖
```
跨工作流依赖：
- 前置工作流
- 依赖检查
```

### 监控告警

#### 1. 告警方式
```
- 邮件告警
- 企业微信
- 钉钉
- Webhook
```

#### 2. 告警规则
```
触发条件：
- 任务失败
- 任务超时
- 工作流失败
```

---

## Airflow vs DolphinScheduler

| 维度 | Airflow | DolphinScheduler |
|------|---------|------------------|
| **编程方式** | 代码（Python） | 可视化 + 代码 |
| **学习曲线** | 陡峭 | 平缓 |
| **灵活性** | 高 | 中等 |
| **社区生态** | 成熟 | 发展中 |
| **国际化** | 英文 | 中文友好 |
| **多租户** | 弱 | 强 |
| **可视化** | 基础 | 强大 |
| **适用场景** | 复杂流程 | 通用场景 |

### 选型建议

✅ **Airflow 适合**：
- Python 技术栈团队
- 复杂的任务逻辑
- 需要高度定制
- 国际化团队

✅ **DolphinScheduler 适合**：
- 快速上手
- 可视化需求强
- 中文环境
- 多租户场景

---

## 调度系统设计要点

### 1. 依赖管理
```
- 任务间依赖
- 工作流依赖
- 时间依赖
- 数据依赖
```

### 2. 容错机制
```
- 任务重试
- 失败告警
- 断点续跑
- 超时控制
```

### 3. 资源管理
```
- 并发控制
- 优先级队列
- 资源隔离
- 动态扩缩容
```

### 4. 监控可观测
```
- 任务执行状态
- 运行时长统计
- 失败率分析
- 资源使用监控
```

---

## 常见面试问题

### Airflow
- Airflow 的架构？
- DAG 和 Task 的区别？
- Executor 的类型和区别？
- 如何处理任务失败？
- 如何实现任务依赖？
- Sensor 的作用？
- XCom 是什么？

### DolphinScheduler
- DolphinScheduler 的架构？
- Master 和 Worker 的职责？
- 如何保证高可用？
- 如何实现多租户？
- 告警机制？

### 通用
- 如何设计一个调度系统？
- 如何处理任务的依赖关系？
- 如何保证任务的幂等性？
- 如何监控任务执行？
- 数据回刷如何实现？
