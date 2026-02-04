---
title: Dart
createTime: 2026/02/04
permalink: /doc/Interview/mobile/language/dart/
---

# Dart

## 核心概念

Dart 是 Google 开发的编程语言，专为构建快速、可移植的应用程序而设计，是 Flutter 框架的官方语言。

## 语言特性

### 1. 强类型与类型推断
```dart
// 显式类型
String name = 'Flutter';
int count = 10;

// 类型推断
var message = 'Hello';  // String
var number = 42;        // int
```

### 2. Null Safety
```dart
// 非空类型
String name = 'Flutter';  // 不能为 null

// 可空类型
String? nickname;  // 可以为 null

// null 检查
if (nickname != null) {
  print(nickname.length);
}

// null 感知运算符
print(nickname?.length);  // 安全访问
print(nickname ?? 'Default');  // 默认值
```

### 3. 异步编程

#### Future (单次异步)
```dart
Future<String> fetchData() async {
  await Future.delayed(Duration(seconds: 2));
  return 'Data loaded';
}

// 使用
void main() async {
  String result = await fetchData();
  print(result);
}
```

#### Stream (多次异步)
```dart
Stream<int> countStream() async* {
  for (int i = 1; i <= 5; i++) {
    await Future.delayed(Duration(seconds: 1));
    yield i;
  }
}

// 使用
await for (int value in countStream()) {
  print(value);
}
```

### 4. 类与继承
```dart
class Animal {
  String name;
  
  Animal(this.name);
  
  void makeSound() {
    print('Some sound');
  }
}

class Dog extends Animal {
  Dog(String name) : super(name);
  
  @override
  void makeSound() {
    print('Woof!');
  }
}
```

### 5. Mixin (混入)
```dart
mixin Flyable {
  void fly() {
    print('Flying...');
  }
}

mixin Swimmable {
  void swim() {
    print('Swimming...');
  }
}

class Duck with Flyable, Swimmable {
  String name;
  Duck(this.name);
}

void main() {
  var duck = Duck('Donald');
  duck.fly();
  duck.swim();
}
```

### 6. Extension (扩展)
```dart
extension StringExtension on String {
  String capitalize() {
    return '${this[0].toUpperCase()}${this.substring(1)}';
  }
}

void main() {
  print('hello'.capitalize());  // Hello
}
```

## 核心概念

### 1. Collection (集合)
```dart
// List
var fruits = ['apple', 'banana', 'orange'];
fruits.add('grape');

// Set (不重复)
var uniqueNumbers = {1, 2, 3, 4};

// Map
var userInfo = {
  'name': 'Alice',
  'age': 25,
  'email': 'alice@example.com'
};
```

### 2. 函数式编程
```dart
var numbers = [1, 2, 3, 4, 5];

// map
var doubled = numbers.map((n) => n * 2).toList();

// where (filter)
var evens = numbers.where((n) => n % 2 == 0).toList();

// reduce
var sum = numbers.reduce((a, b) => a + b);

// 链式调用
var result = numbers
  .where((n) => n > 2)
  .map((n) => n * 2)
  .toList();
```

### 3. Cascade Notation (级联操作)
```dart
var paint = Paint()
  ..color = Colors.blue
  ..strokeWidth = 5.0
  ..style = PaintingStyle.stroke;
```

### 4. 命名参数与可选参数
```dart
// 命名参数
void greet({required String name, int age = 18}) {
  print('Hello $name, age: $age');
}

greet(name: 'Alice');
greet(name: 'Bob', age: 25);

// 可选位置参数
void printInfo(String name, [int? age]) {
  print('$name${age != null ? ", age: $age" : ""}');
}
```

## 编译方式

### 1. JIT (Just-In-Time)
- **特点**：开发时使用，支持热重载
- **优势**：快速迭代、调试方便

### 2. AOT (Ahead-Of-Time)
- **特点**：生产环境使用，编译为原生代码
- **优势**：性能优秀、启动快

## 与其他语言对比

| 特性 | Dart | JavaScript | Kotlin | Swift |
|------|------|------------|--------|-------|
| **类型系统** | 强类型 | 弱类型 | 强类型 | 强类型 |
| **Null Safety** | 是 | 否 | 是 | 是 |
| **异步** | async/await | Promise | Coroutine | async/await |
| **跨平台** | 是 | 是 | 否 | 否 |
| **性能** | 高 | 中 | 高 | 高 |

## 优缺点

**优点**：
- **高性能**：AOT 编译为原生代码
- **类型安全**：null safety + 强类型
- **开发效率**：热重载、简洁语法
- **跨平台**：与 Flutter 配合完美
- **现代特性**：async/await、Stream、Extension

**缺点**：
- **生态较小**：相比 JavaScript/Java
- **学习曲线**：需要了解异步编程
- **主要用于 Flutter**：通用性相对较低

## 适用场景

✅ **适合**：
- Flutter 应用开发
- 跨平台移动应用
- 高性能 UI 应用
- 需要热重载的项目

❌ **不适合**：
- Web 后端（不如 Node.js/Java）
- 原生 iOS/Android 开发
- 系统级编程

## 常见面试问题

- Dart 的 null safety 是什么？
- Future 和 Stream 的区别？
- async/await 的工作原理？
- JIT 和 AOT 的区别？
- Dart 的 Mixin 是什么？
- Isolate 是什么？与线程有什么区别？
- Dart 如何实现热重载？
