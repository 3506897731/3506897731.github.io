---
title: Java Essentials
createTime: 2026/02/04 00:00:00
permalink: /doc/Interview/backend/language/java/essentials/
---

# Java Essentials

本文介绍 Java 开发中最常用的第三方库,每个库都提供实际的代码示例。

---

## 1. Guava - Google 核心库

Google 的 Java 核心库,提供集合、缓存、并发、字符串处理等增强工具。

### Maven 依赖

```xml
<dependency>
    <groupId>com.google.guava</groupId>
    <artifactId>guava</artifactId>
    <version>32.1.3-jre</version>
</dependency>
```

### 1.1 集合工具

```java
import com.google.common.collect.*;

public class GuavaCollectionExample {
    
    public static void main(String[] args) {
        // 创建不可变集合
        ImmutableList<String> immutableList = ImmutableList.of("a", "b", "c");
        ImmutableSet<String> immutableSet = ImmutableSet.of("x", "y", "z");
        ImmutableMap<String, Integer> immutableMap = ImmutableMap.of(
            "one", 1,
            "two", 2,
            "three", 3
        );
        
        // Multimap - 一个key对应多个value
        Multimap<String, String> multimap = ArrayListMultimap.create();
        multimap.put("fruit", "apple");
        multimap.put("fruit", "banana");
        multimap.put("vegetable", "carrot");
        System.out.println(multimap.get("fruit"));  // [apple, banana]
        
        // BiMap - 双向Map
        BiMap<String, Integer> biMap = HashBiMap.create();
        biMap.put("Alice", 1);
        biMap.put("Bob", 2);
        System.out.println(biMap.get("Alice"));      // 1
        System.out.println(biMap.inverse().get(1));  // Alice
        
        // Table - 双键Map
        Table<String, String, Integer> table = HashBasedTable.create();
        table.put("Alice", "Math", 90);
        table.put("Alice", "English", 85);
        table.put("Bob", "Math", 88);
        System.out.println(table.get("Alice", "Math"));  // 90
        
        // RangeSet - 区间集合
        RangeSet<Integer> rangeSet = TreeRangeSet.create();
        rangeSet.add(Range.closed(1, 10));
        rangeSet.add(Range.closed(15, 20));
        System.out.println(rangeSet.contains(5));   // true
        System.out.println(rangeSet.contains(12));  // false
        
        // 集合分区
        List<Integer> numbers = Lists.newArrayList(1, 2, 3, 4, 5, 6, 7);
        List<List<Integer>> partitions = Lists.partition(numbers, 3);
        System.out.println(partitions);  // [[1, 2, 3], [4, 5, 6], [7]]
    }
}
```

### 1.2 字符串处理

```java
import com.google.common.base.*;

public class GuavaStringExample {
    
    public static void main(String[] args) {
        // Joiner - 连接字符串
        List<String> list = Arrays.asList("a", "b", "c");
        String result = Joiner.on(",").join(list);
        System.out.println(result);  // "a,b,c"
        
        // 跳过null值
        String result2 = Joiner.on(",").skipNulls().join("a", null, "b");
        System.out.println(result2);  // "a,b"
        
        // Splitter - 分割字符串
        String input = "a,b,,c,  d";
        Iterable<String> parts = Splitter.on(',')
            .trimResults()
            .omitEmptyStrings()
            .split(input);
        System.out.println(parts);  // [a, b, c, d]
        
        // CaseFormat - 命名转换
        String camelCase = CaseFormat.LOWER_UNDERSCORE.to(
            CaseFormat.LOWER_CAMEL, "user_name");
        System.out.println(camelCase);  // "userName"
        
        // Strings 工具
        String padded = Strings.padEnd("hello", 10, '!');
        System.out.println(padded);  // "hello!!!!!"
        
        boolean empty = Strings.isNullOrEmpty("");
        System.out.println(empty);  // true
    }
}
```

### 1.3 缓存

```java
import com.google.common.cache.*;

public class GuavaCacheExample {
    
    public static void main(String[] args) throws Exception {
        // 创建缓存
        LoadingCache<String, User> cache = CacheBuilder.newBuilder()
            .maximumSize(1000)                    // 最大容量
            .expireAfterWrite(10, TimeUnit.MINUTES)  // 写入后10分钟过期
            .recordStats()                        // 开启统计
            .build(new CacheLoader<String, User>() {
                @Override
                public User load(String userId) throws Exception {
                    // 缓存未命中时的加载逻辑
                    return loadUserFromDatabase(userId);
                }
            });
        
        // 使用缓存
        User user = cache.get("user123");
        
        // 手动添加
        cache.put("user456", new User("456", "Bob"));
        
        // 移除
        cache.invalidate("user123");
        
        // 查看统计
        CacheStats stats = cache.stats();
        System.out.println("命中率: " + stats.hitRate());
        System.out.println("平均加载时间: " + stats.averageLoadPenalty());
    }
    
    private static User loadUserFromDatabase(String userId) {
        // 模拟数据库查询
        return new User(userId, "User-" + userId);
    }
}

@Data
@AllArgsConstructor
class User {
    private String id;
    private String name;
}
```

### 1.4 函数式编程

```java
import com.google.common.base.*;
import com.google.common.collect.*;

public class GuavaFunctionalExample {
    
    public static void main(String[] args) {
        // Optional - 处理null值
        Optional<String> optional = Optional.of("hello");
        System.out.println(optional.isPresent());  // true
        System.out.println(optional.or("default"));  // "hello"
        
        // Predicate - 过滤
        Predicate<Integer> isEven = num -> num % 2 == 0;
        List<Integer> numbers = Lists.newArrayList(1, 2, 3, 4, 5, 6);
        Iterable<Integer> evenNumbers = Iterables.filter(numbers, isEven);
        System.out.println(evenNumbers);  // [2, 4, 6]
        
        // Function - 转换
        Function<String, Integer> strLength = String::length;
        List<String> words = Lists.newArrayList("hello", "world", "guava");
        Iterable<Integer> lengths = Iterables.transform(words, strLength);
        System.out.println(lengths);  // [5, 5, 5]
    }
}
```

---

## 2. Apache Commons Lang3 - 通用工具库

提供字符串、数组、日期、数字等常用操作。

### Maven 依赖

```xml
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-lang3</artifactId>
    <version>3.14.0</version>
</dependency>
```

### 2.1 字符串工具

```java
import org.apache.commons.lang3.StringUtils;

public class CommonsLangStringExample {
    
    public static void main(String[] args) {
        // 判空
        System.out.println(StringUtils.isEmpty(""));      // true
        System.out.println(StringUtils.isBlank("  "));    // true
        System.out.println(StringUtils.isNotBlank("a"));  // true
        
        // 默认值
        String result = StringUtils.defaultIfEmpty(null, "default");
        System.out.println(result);  // "default"
        
        // 缩写
        String abbr = StringUtils.abbreviate("This is a long text", 10);
        System.out.println(abbr);  // "This is..."
        
        // 首字母大写
        String capitalized = StringUtils.capitalize("hello");
        System.out.println(capitalized);  // "Hello"
        
        // 删除空白
        String trimmed = StringUtils.strip("  hello  ");
        System.out.println(trimmed);  // "hello"
        
        // 重复字符串
        String repeated = StringUtils.repeat("*", 5);
        System.out.println(repeated);  // "*****"
        
        // 反转字符串
        String reversed = StringUtils.reverse("hello");
        System.out.println(reversed);  // "olleh"
        
        // 统计子串出现次数
        int count = StringUtils.countMatches("hello world", "l");
        System.out.println(count);  // 3
    }
}
```

### 2.2 数组工具

```java
import org.apache.commons.lang3.ArrayUtils;

public class CommonsLangArrayExample {
    
    public static void main(String[] args) {
        // 数组拼接
        int[] arr1 = {1, 2, 3};
        int[] arr2 = {4, 5, 6};
        int[] merged = ArrayUtils.addAll(arr1, arr2);
        System.out.println(Arrays.toString(merged));  // [1, 2, 3, 4, 5, 6]
        
        // 判断是否包含
        boolean contains = ArrayUtils.contains(arr1, 2);
        System.out.println(contains);  // true
        
        // 查找索引
        int index = ArrayUtils.indexOf(arr1, 2);
        System.out.println(index);  // 1
        
        // 反转数组
        ArrayUtils.reverse(arr1);
        System.out.println(Arrays.toString(arr1));  // [3, 2, 1]
        
        // 移除元素
        int[] removed = ArrayUtils.removeElement(arr2, 5);
        System.out.println(Arrays.toString(removed));  // [4, 6]
        
        // 数组转字符串
        String str = ArrayUtils.toString(arr2, "[]");
        System.out.println(str);  // "[4,5,6]"
    }
}
```

### 2.3 对象工具

```java
import org.apache.commons.lang3.ObjectUtils;

public class CommonsLangObjectExample {
    
    public static void main(String[] args) {
        // 默认值
        String result = ObjectUtils.defaultIfNull(null, "default");
        System.out.println(result);  // "default"
        
        // 比较 (null安全)
        int compare = ObjectUtils.compare(null, "abc");
        System.out.println(compare);  // -1
        
        // 判断所有参数是否为null
        boolean allNull = ObjectUtils.allNull(null, null, null);
        System.out.println(allNull);  // true
        
        // 判断任一参数是否为null
        boolean anyNotNull = ObjectUtils.anyNotNull(null, "a", null);
        System.out.println(anyNotNull);  // true
        
        // 返回第一个非null值
        String firstNonNull = ObjectUtils.firstNonNull(null, null, "hello", "world");
        System.out.println(firstNonNull);  // "hello"
    }
}
```

### 2.4 日期工具

```java
import org.apache.commons.lang3.time.DateUtils;
import org.apache.commons.lang3.time.DateFormatUtils;

public class CommonsLangDateExample {
    
    public static void main(String[] args) throws Exception {
        Date now = new Date();
        
        // 格式化日期
        String formatted = DateFormatUtils.format(now, "yyyy-MM-dd HH:mm:ss");
        System.out.println(formatted);  // "2026-02-04 12:30:45"
        
        // 日期加减
        Date tomorrow = DateUtils.addDays(now, 1);
        Date nextWeek = DateUtils.addWeeks(now, 1);
        Date nextMonth = DateUtils.addMonths(now, 1);
        
        // 截断日期
        Date truncated = DateUtils.truncate(now, Calendar.DATE);
        System.out.println(truncated);  // 2026-02-04 00:00:00
        
        // 判断是否同一天
        boolean sameDay = DateUtils.isSameDay(now, tomorrow);
        System.out.println(sameDay);  // false
    }
}
```

---

## 3. Apache Commons Collections4 - 集合增强

### Maven 依赖

```xml
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-collections4</artifactId>
    <version>4.4</version>
</dependency>
```

### 示例

```java
import org.apache.commons.collections4.*;

public class CommonsCollectionsExample {
    
    public static void main(String[] args) {
        // 判断集合是否为空
        List<String> list = Arrays.asList("a", "b", "c");
        boolean empty = CollectionUtils.isEmpty(list);
        System.out.println(empty);  // false
        
        // 集合交集
        List<Integer> list1 = Arrays.asList(1, 2, 3, 4);
        List<Integer> list2 = Arrays.asList(3, 4, 5, 6);
        Collection<Integer> intersection = CollectionUtils.intersection(list1, list2);
        System.out.println(intersection);  // [3, 4]
        
        // 集合并集
        Collection<Integer> union = CollectionUtils.union(list1, list2);
        System.out.println(union);  // [1, 2, 3, 4, 5, 6]
        
        // 集合差集
        Collection<Integer> subtract = CollectionUtils.subtract(list1, list2);
        System.out.println(subtract);  // [1, 2]
        
        // 过滤集合
        Predicate<Integer> greaterThan3 = num -> num > 3;
        Collection<Integer> filtered = CollectionUtils.select(list1, greaterThan3);
        System.out.println(filtered);  // [4]
        
        // 转换集合
        Transformer<Integer, String> toString = Object::toString;
        Collection<String> transformed = CollectionUtils.collect(list1, toString);
        System.out.println(transformed);  // ["1", "2", "3", "4"]
        
        // Bag - 允许重复的Set
        Bag<String> bag = new HashBag<>();
        bag.add("apple", 3);
        bag.add("banana", 2);
        System.out.println(bag.getCount("apple"));  // 3
    }
}
```

---

## 4. Jackson - JSON 处理

### Maven 依赖

```xml
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.16.0</version>
</dependency>
```

### 示例

```java
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.annotation.*;

public class JacksonExample {
    
    private static final ObjectMapper mapper = new ObjectMapper();
    
    public static void main(String[] args) throws Exception {
        // 对象 -> JSON
        Person person = new Person("Alice", 25, "alice@example.com");
        String json = mapper.writeValueAsString(person);
        System.out.println(json);
        // {"name":"Alice","age":25,"email":"alice@example.com"}
        
        // JSON -> 对象
        Person parsed = mapper.readValue(json, Person.class);
        System.out.println(parsed);
        
        // 美化输出
        String prettyJson = mapper.writerWithDefaultPrettyPrinter()
            .writeValueAsString(person);
        System.out.println(prettyJson);
        
        // 集合
        List<Person> people = Arrays.asList(
            new Person("Alice", 25, "alice@example.com"),
            new Person("Bob", 30, "bob@example.com")
        );
        String listJson = mapper.writeValueAsString(people);
        System.out.println(listJson);
        
        // JSON -> List
        List<Person> parsedList = mapper.readValue(
            listJson,
            new TypeReference<List<Person>>() {}
        );
        
        // JSON -> Map
        Map<String, Object> map = mapper.readValue(
            json,
            new TypeReference<Map<String, Object>>() {}
        );
        System.out.println(map);
    }
}

// 使用注解
@Data
@NoArgsConstructor
@AllArgsConstructor
class Person {
    
    @JsonProperty("name")  // 指定JSON字段名
    private String name;
    
    private int age;
    
    @JsonProperty("email")
    private String email;
    
    @JsonIgnore  // 序列化时忽略
    private String password;
    
    @JsonFormat(pattern = "yyyy-MM-dd")  // 日期格式
    private Date birthDate;
}
```

---

## 5. Lombok - 代码简化

### Maven 依赖

```xml
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.30</version>
    <scope>provided</scope>
</dependency>
```

### 示例

```java
import lombok.*;

// @Data = @Getter + @Setter + @ToString + @EqualsAndHashCode + @RequiredArgsConstructor
@Data
public class User {
    private Long id;
    private String username;
    private String email;
}

// @Builder - 构建器模式
@Builder
@Data
class Product {
    private Long id;
    private String name;
    private BigDecimal price;
    private String description;
}

// 使用
Product product = Product.builder()
    .id(1L)
    .name("iPhone")
    .price(new BigDecimal("999.99"))
    .description("Smartphone")
    .build();

// @Slf4j - 日志
@Slf4j
@Service
class UserService {
    
    public void doSomething() {
        log.info("Info message");
        log.error("Error message", new Exception());
        log.debug("Debug message");
    }
}

// @AllArgsConstructor - 全参构造器
@AllArgsConstructor
class Order {
    private Long id;
    private String orderNo;
    private BigDecimal amount;
}

// @NoArgsConstructor - 无参构造器
@NoArgsConstructor
class Customer {
    private Long id;
    private String name;
}

// @RequiredArgsConstructor - 必需参数构造器 (final字段)
@RequiredArgsConstructor
class OrderService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
}

// @Value - 不可变类
@Value
class Money {
    BigDecimal amount;
    String currency;
}

// @SneakyThrows - 隐式抛出异常
class FileUtils {
    
    @SneakyThrows
    public static String readFile(String path) {
        return Files.readString(Paths.get(path));
    }
}
```

---

## 6. Hutool - 国产工具库

### Maven 依赖

```xml
<dependency>
    <groupId>cn.hutool</groupId>
    <artifactId>hutool-all</artifactId>
    <version>5.8.24</version>
</dependency>
```

### 6.1 日期时间工具

```java
import cn.hutool.core.date.*;

public class HutoolDateExample {
    
    public static void main(String[] args) {
        // 获取当前时间
        Date now = DateUtil.date();
        
        // 格式化
        String formatted = DateUtil.format(now, "yyyy-MM-dd HH:mm:ss");
        System.out.println(formatted);
        
        // 解析
        Date parsed = DateUtil.parse("2026-02-04", "yyyy-MM-dd");
        
        // 计算时间差
        long between = DateUtil.between(now, parsed, DateUnit.DAY);
        System.out.println("相差天数: " + between);
        
        // 偏移日期
        Date tomorrow = DateUtil.offsetDay(now, 1);
        Date nextWeek = DateUtil.offsetWeek(now, 1);
        
        // 获取年月日
        int year = DateUtil.year(now);
        int month = DateUtil.month(now) + 1;  // 0-based
        int day = DateUtil.dayOfMonth(now);
        
        // 判断是否为周末
        boolean isWeekend = DateUtil.isWeekend(now);
        System.out.println("是否周末: " + isWeekend);
        
        // 获取一天的开始和结束
        Date beginOfDay = DateUtil.beginOfDay(now);
        Date endOfDay = DateUtil.endOfDay(now);
    }
}
```

### 6.2 字符串工具

```java
import cn.hutool.core.util.StrUtil;

public class HutoolStrExample {
    
    public static void main(String[] args) {
        // 判空
        System.out.println(StrUtil.isEmpty(""));      // true
        System.out.println(StrUtil.isBlank("  "));    // true
        
        // 格式化
        String formatted = StrUtil.format("Hello {}, age is {}", "Alice", 25);
        System.out.println(formatted);  // "Hello Alice, age is 25"
        
        // 驼峰转下划线
        String underline = StrUtil.toUnderlineCase("userName");
        System.out.println(underline);  // "user_name"
        
        // 下划线转驼峰
        String camel = StrUtil.toCamelCase("user_name");
        System.out.println(camel);  // "userName"
        
        // 去除前后缀
        String result = StrUtil.removeSuffix("test.txt", ".txt");
        System.out.println(result);  // "test"
        
        // 重复字符串
        String repeated = StrUtil.repeat("*", 5);
        System.out.println(repeated);  // "*****"
    }
}
```

### 6.3 集合工具

```java
import cn.hutool.core.collection.*;

public class HutoolCollectionExample {
    
    public static void main(String[] args) {
        // 快速创建
        List<String> list = CollUtil.newArrayList("a", "b", "c");
        Set<String> set = CollUtil.newHashSet("x", "y", "z");
        
        // 判空
        boolean empty = CollUtil.isEmpty(list);
        
        // 集合交集
        List<Integer> list1 = CollUtil.newArrayList(1, 2, 3);
        List<Integer> list2 = CollUtil.newArrayList(2, 3, 4);
        Collection<Integer> intersection = CollUtil.intersection(list1, list2);
        System.out.println(intersection);  // [2, 3]
        
        // 集合并集
        Collection<Integer> union = CollUtil.union(list1, list2);
        System.out.println(union);  // [1, 2, 3, 4]
        
        // 集合转字符串
        String joined = CollUtil.join(list, ",");
        System.out.println(joined);  // "a,b,c"
        
        // 分组
        List<User> users = CollUtil.newArrayList(
            new User(1L, "Alice", 25),
            new User(2L, "Bob", 25),
            new User(3L, "Charlie", 30)
        );
        Map<Integer, List<User>> grouped = CollUtil.groupingBy(
            users, User::getAge);
        System.out.println(grouped);
    }
}
```

### 6.4 HTTP 工具

```java
import cn.hutool.http.*;

public class HutoolHttpExample {
    
    public static void main(String[] args) {
        // GET 请求
        String result = HttpUtil.get("https://api.example.com/users");
        System.out.println(result);
        
        // GET 请求带参数
        Map<String, Object> params = new HashMap<>();
        params.put("page", 1);
        params.put("size", 10);
        String result2 = HttpUtil.get("https://api.example.com/users", params);
        
        // POST 请求
        String result3 = HttpUtil.post(
            "https://api.example.com/users",
            "{\"name\":\"Alice\",\"age\":25}"
        );
        
        // 下载文件
        HttpUtil.downloadFile(
            "https://example.com/file.pdf",
            new File("/tmp/downloaded.pdf")
        );
        
        // 高级用法
        HttpResponse response = HttpRequest.post("https://api.example.com/login")
            .header("Content-Type", "application/json")
            .body("{\"username\":\"alice\",\"password\":\"123456\"}")
            .timeout(5000)
            .execute();
        
        System.out.println("Status: " + response.getStatus());
        System.out.println("Body: " + response.body());
    }
}
```

### 6.5 加密解密

```java
import cn.hutool.crypto.*;
import cn.hutool.crypto.digest.*;

public class HutoolCryptoExample {
    
    public static void main(String[] args) {
        String text = "Hello World";
        
        // MD5
        String md5 = DigestUtil.md5Hex(text);
        System.out.println("MD5: " + md5);
        
        // SHA-256
        String sha256 = DigestUtil.sha256Hex(text);
        System.out.println("SHA-256: " + sha256);
        
        // Base64
        String base64 = SecureUtil.base64Encode(text);
        System.out.println("Base64: " + base64);
        String decoded = SecureUtil.base64Decode(base64);
        System.out.println("Decoded: " + decoded);
        
        // AES 加密
        String key = "1234567890123456";  // 16字节密钥
        AES aes = SecureUtil.aes(key.getBytes());
        String encrypted = aes.encryptHex(text);
        System.out.println("AES加密: " + encrypted);
        String decrypted = aes.decryptStr(encrypted);
        System.out.println("AES解密: " + decrypted);
        
        // RSA 加密
        RSA rsa = SecureUtil.rsa();
        byte[] encrypted2 = rsa.encrypt(text.getBytes(), KeyType.PublicKey);
        byte[] decrypted2 = rsa.decrypt(encrypted2, KeyType.PrivateKey);
        System.out.println("RSA解密: " + new String(decrypted2));
    }
}
```

---

## 7. MapStruct - 对象映射

### Maven 依赖

```xml
<dependency>
    <groupId>org.mapstruct</groupId>
    <artifactId>mapstruct</artifactId>
    <version>1.5.5.Final</version>
</dependency>
<dependency>
    <groupId>org.mapstruct</groupId>
    <artifactId>mapstruct-processor</artifactId>
    <version>1.5.5.Final</version>
    <scope>provided</scope>
</dependency>
```

### 示例

```java
import org.mapstruct.*;

// 实体类
@Data
class UserEntity {
    private Long id;
    private String username;
    private String email;
    private Date createTime;
}

// DTO
@Data
class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String createTimeStr;
}

// Mapper 接口
@Mapper(componentModel = "spring")
public interface UserMapper {
    
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);
    
    // 基本映射
    @Mapping(source = "createTime", target = "createTimeStr", dateFormat = "yyyy-MM-dd")
    UserDTO toDTO(UserEntity entity);
    
    @Mapping(target = "createTime", ignore = true)
    UserEntity toEntity(UserDTO dto);
    
    // 批量映射
    List<UserDTO> toDTOList(List<UserEntity> entities);
}

// 使用
public class MapStructExample {
    
    public static void main(String[] args) {
        UserEntity entity = new UserEntity();
        entity.setId(1L);
        entity.setUsername("Alice");
        entity.setEmail("alice@example.com");
        entity.setCreateTime(new Date());
        
        // 转换
        UserDTO dto = UserMapper.INSTANCE.toDTO(entity);
        System.out.println(dto);
    }
}
```

---

## 总结

| 库 | 用途 | 核心功能 |
|----|------|---------|
| **Guava** | Google核心库 | 集合增强、缓存、并发、字符串 |
| **Commons Lang3** | 通用工具 | 字符串、数组、日期、对象操作 |
| **Commons Collections** | 集合增强 | 集合运算、特殊集合类型 |
| **Jackson** | JSON处理 | 序列化/反序列化 |
| **Lombok** | 代码简化 | 自动生成getter/setter/构造器 |
| **Hutool** | 国产工具库 | 日期、HTTP、加密、文件 |
| **MapStruct** | 对象映射 | DTO转换 |

这些库基本覆盖了 Java 日常开发的常见需求,建议熟练掌握。
