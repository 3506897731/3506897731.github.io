---
title: Flutter
createTime: 2026/02/04
permalink: /doc/Interview/mobile/framework/flutter/
---

# Flutter

## 核心概念

Flutter 是 Google 开发的跨平台 UI 框架，使用 Dart 语言，可构建高性能的移动、Web 和桌面应用。

## 核心特性

### 1. Everything is a Widget
Flutter 中一切都是 Widget：

```dart
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: Text('Flutter Demo')),
        body: Center(
          child: Text('Hello Flutter!'),
        ),
      ),
    );
  }
}
```

### 2. Widget 类型

#### StatelessWidget (无状态)
```dart
class Greeting extends StatelessWidget {
  final String name;
  
  const Greeting({required this.name});
  
  @override
  Widget build(BuildContext context) {
    return Text('Hello, $name!');
  }
}
```

#### StatefulWidget (有状态)
```dart
class Counter extends StatefulWidget {
  @override
  _CounterState createState() => _CounterState();
}

class _CounterState extends State<Counter> {
  int _count = 0;
  
  void _increment() {
    setState(() {
      _count++;
    });
  }
  
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text('Count: $_count'),
        ElevatedButton(
          onPressed: _increment,
          child: Text('Increment'),
        ),
      ],
    );
  }
}
```

## State 管理

### 1. setState (内置)
```dart
setState(() {
  _count++;
});
```

### 2. Provider (推荐)
```dart
class CounterModel with ChangeNotifier {
  int _count = 0;
  int get count => _count;
  
  void increment() {
    _count++;
    notifyListeners();
  }
}

// 使用
Consumer<CounterModel>(
  builder: (context, counter, child) {
    return Text('${counter.count}');
  },
)
```

### 3. Riverpod
```dart
final counterProvider = StateProvider((ref) => 0);

// 使用
Consumer(
  builder: (context, ref, child) {
    final count = ref.watch(counterProvider);
    return Text('$count');
  },
)
```

### 4. BLoC (Business Logic Component)
```dart
class CounterBloc extends Bloc<CounterEvent, int> {
  CounterBloc() : super(0) {
    on<IncrementEvent>((event, emit) => emit(state + 1));
  }
}

// 使用
BlocBuilder<CounterBloc, int>(
  builder: (context, count) {
    return Text('$count');
  },
)
```

## 布局系统

### 1. 常用布局 Widget
```dart
// Column (垂直)
Column(
  children: [
    Text('Item 1'),
    Text('Item 2'),
  ],
)

// Row (水平)
Row(
  children: [
    Icon(Icons.star),
    Text('Rating'),
  ],
)

// Stack (层叠)
Stack(
  children: [
    Image.asset('background.jpg'),
    Positioned(
      top: 10,
      left: 10,
      child: Text('Overlay'),
    ),
  ],
)

// ListView (列表)
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) {
    return ListTile(title: Text(items[index]));
  },
)
```

### 2. Flex 布局
```dart
Row(
  children: [
    Expanded(
      flex: 2,
      child: Container(color: Colors.red),
    ),
    Expanded(
      flex: 1,
      child: Container(color: Colors.blue),
    ),
  ],
)
```

## 渲染原理

### 1. 三棵树
- **Widget Tree**：配置信息（不可变）
- **Element Tree**：Widget 实例化（可变）
- **RenderObject Tree**：实际渲染（布局、绘制）

### 2. 渲染流程
```
Widget → Element → RenderObject → Layer → Scene
```

### 3. BuildContext
```dart
// BuildContext 是 Element 的抽象
Theme.of(context)  // 从树中查找
MediaQuery.of(context)
Navigator.of(context)
```

## 性能优化

### 1. const 构造函数
```dart
// 避免重新构建
const Text('Hello');
const Icon(Icons.star);
```

### 2. ListView.builder
```dart
// 懒加载，只构建可见项
ListView.builder(
  itemCount: 1000,
  itemBuilder: (context, index) {
    return ListTile(title: Text('Item $index'));
  },
)
```

### 3. RepaintBoundary
```dart
// 隔离重绘区域
RepaintBoundary(
  child: AnimatedWidget(),
)
```

### 4. 避免过度构建
```dart
// 好 - 只重建需要的部分
Consumer<Model>(
  builder: (context, model, child) {
    return Text(model.data);
  },
)

// 差 - 整个树重建
class MyWidget extends StatefulWidget {
  @override
  _MyWidgetState createState() => _MyWidgetState();
}
```

## 导航

### 1. 基础导航
```dart
// 跳转
Navigator.push(
  context,
  MaterialPageRoute(builder: (context) => SecondScreen()),
);

// 返回
Navigator.pop(context);
```

### 2. 命名路由
```dart
MaterialApp(
  routes: {
    '/': (context) => HomeScreen(),
    '/second': (context) => SecondScreen(),
  },
);

// 跳转
Navigator.pushNamed(context, '/second');
```

## Platform Channel

### 调用原生代码
```dart
static const platform = MethodChannel('com.example.app/channel');

Future<void> getBatteryLevel() async {
  try {
    final int result = await platform.invokeMethod('getBatteryLevel');
    print('Battery level: $result%');
  } catch (e) {
    print('Error: $e');
  }
}
```

## Flutter vs 其他框架

| 特性 | Flutter | React Native | Native |
|------|---------|--------------|--------|
| **语言** | Dart | JavaScript | Kotlin/Swift |
| **性能** | 高（原生渲染） | 中（桥接） | 最高 |
| **热重载** | 是 | 是 | 否 |
| **UI 一致性** | 完全一致 | 平台差异 | 平台原生 |
| **包大小** | 较大 | 中等 | 最小 |
| **学习曲线** | 中等 | 平缓 | 陡峭 |

## 优缺点

**优点**：
- **高性能**：自绘引擎，接近原生
- **热重载**：快速开发迭代
- **跨平台**：一套代码多端运行
- **UI 一致性**：所有平台表现一致
- **丰富的 Widget**：Material + Cupertino

**缺点**：
- **包体积大**：包含引擎（~4MB）
- **Dart 生态**：相对较小
- **原生功能**：需 Platform Channel
- **调试困难**：三层树结构复杂

## 适用场景

✅ **适合**：
- 跨平台移动应用
- 高性能 UI 应用
- 快速 MVP 开发
- 统一设计语言的应用

❌ **不适合**：
- 重度依赖原生功能
- 包体积敏感的应用
- 需要大量原生交互
- 团队不熟悉 Dart

## 常见面试问题

- Flutter 的渲染原理？三棵树是什么？
- StatelessWidget 和 StatefulWidget 的区别？
- setState 的工作原理？
- Flutter 如何实现热重载？
- 常用的 State 管理方案？
- Flutter 的性能优化方法？
- BuildContext 是什么？
- Flutter 和 React Native 的区别？
- 如何与原生代码交互？
- InheritedWidget 的作用？
