---
title: Java Essentials
createTime: 2026/02/04 00:00:00
permalink: /doc/Interview/backend/language/java/essentials/
---

# Java Essentials

::: tabs

@tab Guava

```xml
<dependency>
    <groupId>com.google.guava</groupId>
    <artifactId>guava</artifactId>
    <version>32.1.3-jre</version>
</dependency>
```

@tab Apache

```xml
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-lang3</artifactId>
    <version>3.14.0</version>
</dependency>
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-collections4</artifactId>
    <version>4.4</version>
</dependency>
```

@tab Lombok

```xml
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.30</version>
    <scope>provided</scope>
</dependency>
```

@tab MapStruct

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

@tab Hutool

```xml
<dependency>
    <groupId>cn.hutool</groupId>
    <artifactId>hutool-all</artifactId>
    <version>5.8.24</version>
</dependency>
```

@tab JSON

```xml
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.16.0</version>
</dependency>
```

@tab SLF4J

```xml
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-api</artifactId>
    <version>2.0.11</version>
</dependency>
<dependency>
    <groupId>ch.qos.logback</groupId>
    <artifactId>logback-classic</artifactId>
    <version>1.4.14</version>
</dependency>
```

:::

## 1. ==核心库==

### 1.1 工具库 <Badge type="tip" text="通用工具" /> <Badge type="info" text="代码简化" />

#### 1.1.1 通用工具：Apache + Guava

Apache Commons 和 Guava 是 Java 开发中最常用的通用工具库。Apache Commons 更成熟稳定，Guava 更现代灵活。

##### Apache Commons Lang3

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

**数组工具**

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
    }
}
```

**对象工具**

```java
import org.apache.commons.lang3.ObjectUtils;

public class CommonsLangObjectExample {
    
    public static void main(String[] args) {
        // 默认值
        String result = ObjectUtils.defaultIfNull(null, "default");
        System.out.println(result);  // "default"
        
        // 判断所有参数是否为null
        boolean allNull = ObjectUtils.allNull(null, null, null);
        System.out.println(allNull);  // true
        
        // 返回第一个非null值
        String firstNonNull = ObjectUtils.firstNonNull(null, null, "hello", "world");
        System.out.println(firstNonNull);  // "hello"
    }
}
```

**日期工具**

```java
import org.apache.commons.lang3.time.DateUtils;
import org.apache.commons.lang3.time.DateFormatUtils;

public class CommonsLangDateExample {
    
    public static void main(String[] args) throws Exception {
        Date now = new Date();
        
        // 格式化日期
        String formatted = DateFormatUtils.format(now, "yyyy-MM-dd HH:mm:ss");
        System.out.println(formatted);
        
        // 日期加减
        Date tomorrow = DateUtils.addDays(now, 1);
        Date nextMonth = DateUtils.addMonths(now, 1);
        
        // 截断日期
        Date truncated = DateUtils.truncate(now, Calendar.DATE);
        System.out.println(truncated);
    }
}
```

##### Apache Commons Collections4

**集合操作**

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
    }
}
```

**Bag 使用**

```java
import org.apache.commons.collections4.Bag;
import org.apache.commons.collections4.bag.HashBag;

public class BagExample {
    
    public static void main(String[] args) {
        Bag<String> bag = new HashBag<>();
        
        // 添加元素（可重复）
        bag.add("apple", 3);
        bag.add("banana", 2);
        
        // 获取元素数量
        System.out.println(bag.getCount("apple"));   // 3
        System.out.println(bag.getCount("banana"));  // 2
    }
}
```

##### Guava

**集合工具**

```java
import com.google.common.collect.*;

public class GuavaCollectionExample {
    
    public static void main(String[] args) {
        // 创建不可变集合
        ImmutableList<String> list = ImmutableList.of("a", "b", "c");
        ImmutableMap<String, Integer> map = ImmutableMap.of("one", 1, "two", 2);
        
        // Multimap - 一个key对应多个value
        Multimap<String, String> multimap = ArrayListMultimap.create();
        multimap.put("fruit", "apple");
        multimap.put("fruit", "banana");
        System.out.println(multimap.get("fruit"));  // [apple, banana]
        
        // BiMap - 双向Map
        BiMap<String, Integer> biMap = HashBiMap.create();
        biMap.put("Alice", 1);
        biMap.put("Bob", 2);
        System.out.println(biMap.inverse().get(1));  // Alice
        
        // RangeSet - 区间集合
        RangeSet<Integer> rangeSet = TreeRangeSet.create();
        rangeSet.add(Range.closed(1, 10));
        System.out.println(rangeSet.contains(5));   // true
    }
}
```

**字符串处理**

```java
import com.google.common.base.*;

public class GuavaStringExample {
    
    public static void main(String[] args) {
        // Joiner - 连接字符串
        String result = Joiner.on(",").join("a", "b", "c");
        System.out.println(result);  // "a,b,c"
        
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
    }
}
```

**缓存**

```java
import com.google.common.cache.*;

public class GuavaCacheExample {
    
    public static void main(String[] args) throws Exception {
        LoadingCache<String, String> cache = CacheBuilder.newBuilder()
            .maximumSize(1000)
            .expireAfterWrite(10, TimeUnit.MINUTES)
            .build(new CacheLoader<String, String>() {
                @Override
                public String load(String key) throws Exception {
                    return "value-" + key;
                }
            });
        
        String value = cache.get("key1");
        cache.put("key2", "custom-value");
        System.out.println(value);
    }
}
```

#### 1.1.2 代码简化：Lombok + MapStruct

##### Lombok

**基本注解**

```java
import lombok.*;

// @Data = @Getter + @Setter + @ToString + @EqualsAndHashCode
@Data
public class User {
    private Long id;
    private String username;
    private String email;
}
```

**Builder 模式**

```java
@Builder
@Data
class Product {
    private Long id;
    private String name;
    private BigDecimal price;
}

// 使用
Product product = Product.builder()
    .id(1L)
    .name("iPhone")
    .price(new BigDecimal("999.99"))
    .build();
```

**日志注解**

```java
@Slf4j
@Service
class UserService {
    public void doSomething() {
        log.info("Info message");
        log.error("Error message", new Exception());
    }
}
```

##### MapStruct

**对象映射**

```java
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface UserMapper {
    
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);
    
    @Mapping(source = "createTime", target = "createTimeStr", dateFormat = "yyyy-MM-dd")
    UserDTO toDTO(UserEntity entity);
    
    List<UserDTO> toDTOList(List<UserEntity> entities);
}
```

#### 1.1.3 国产工具：Hutool

**说明**：国产的工具类库，优点是比较全，也比较实用。选它要注意下它的协议是中国第一个开源协议木兰宽松许可证，商业型项目最好咨询下相关法务部门。

**日期时间工具**

```java
import cn.hutool.core.date.*;

public class HutoolDateExample {
    
    public static void main(String[] args) {
        Date now = DateUtil.date();
        String formatted = DateUtil.format(now, "yyyy-MM-dd HH:mm:ss");
        System.out.println(formatted);
        
        Date parsed = DateUtil.parse("2026-02-04", "yyyy-MM-dd");
        long between = DateUtil.between(now, parsed, DateUnit.DAY);
        System.out.println("相差天数: " + between);
    }
}
```

**字符串工具**

```java
import cn.hutool.core.util.StrUtil;

public class HutoolStrExample {
    
    public static void main(String[] args) {
        System.out.println(StrUtil.isEmpty(""));      // true
        String formatted = StrUtil.format("Hello {}, age is {}", "Alice", 25);
        System.out.println(formatted);
    }
}
```

**集合工具**

```java
import cn.hutool.core.collection.*;

public class HutoolCollectionExample {
    
    public static void main(String[] args) {
        List<String> list = CollUtil.newArrayList("a", "b", "c");
        String joined = CollUtil.join(list, ",");
        System.out.println(joined);  // "a,b,c"
    }
}
```

**HTTP 工具**

```java
import cn.hutool.http.*;

public class HutoolHttpExample {
    
    public static void main(String[] args) {
        String result = HttpUtil.get("https://api.example.com/users");
        System.out.println(result);
    }
}
```

**加密解密**

```java
import cn.hutool.crypto.digest.*;

public class HutoolCryptoExample {
    
    public static void main(String[] args) {
        String text = "Hello World";
        String md5 = DigestUtil.md5Hex(text);
        String sha256 = DigestUtil.sha256Hex(text);
        System.out.println("MD5: " + md5);
        System.out.println("SHA-256: " + sha256);
    }
}
```

::: card title="总结" icon="twemoji:star"
- **通用工具**: Apache Commons（成熟稳定）推荐配合 Guava（现代灵活）使用
- **代码简化**: Lombok + MapStruct 搭配效果最佳，显著减少模板代码
- **国产方案**: Hutool 功能全面但需注意协议，商业项目需法务评估，小型项目可单用 Hutool
:::

### 1.2 数据库 <Badge type="tip" text="连接池" /> <Badge type="info" text="ORM框架" /> <Badge type="warning" text="SQL映射" />

| 库 | 功能 | 易用性 | 性能 | 适用场景 |
|----|------|--------|------|---------|
| **HikariCP** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | **数据库连接池首选** |
| **Druid** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 监控和性能分析 |
| **MyBatis** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 灵活 SQL 映射 |
| **JPA/Hibernate** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | 完整 ORM 框架 |
| **Spring Data** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 快速开发 CRUD |

#### 1.2.1 HikariCP

```java
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

public class HikariCPExample {
    
    public static void main(String[] args) {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl("jdbc:mysql://localhost:3306/db");
        config.setUsername("root");
        config.setPassword("password");
        config.setMaximumPoolSize(20);
        config.setMinimumIdle(5);
        
        HikariDataSource dataSource = new HikariDataSource(config);
        // 使用 dataSource
    }
}
```

#### 1.2.2 Druid

```java
import com.alibaba.druid.pool.DruidDataSourceFactory;
import javax.sql.DataSource;

public class DruidExample {
    
    public static void main(String[] args) throws Exception {
        Properties props = new Properties();
        props.setProperty("url", "jdbc:mysql://localhost:3306/db");
        props.setProperty("username", "root");
        props.setProperty("password", "password");
        props.setProperty("initialSize", "5");
        props.setProperty("maxActive", "20");
        
        DataSource dataSource = DruidDataSourceFactory.createDataSource(props);
    }
}
```

::: card title="总结" icon="twemoji:star"
- **连接池**: HikariCP（最高性能推荐）vs Druid（监控功能强），合理设置 maxPoolSize 和 minIdle
- **ORM 选择**: MyBatis（灵活 SQL）vs Hibernate（完整 ORM）vs Spring Data（快速开发）
:::

### 1.3 API库 <Badge type="tip" text="REST API" /> <Badge type="info" text="异步编程" /> <Badge type="warning" text="API文档" />

| 库 | 类型 | 易用性 | 功能 | 适用场景 |
|----|------|--------|------|---------|
| **Spring WebFlux** | 异步非阻塞 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | **高并发 API 开发** |
| **Spring Web MVC** | 同步阻塞 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 传统 REST API |
| **Swagger/OpenAPI** | API 文档 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | API 文档自动生成 |
| **RxJava** | 响应式编程 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 复杂异步流程 |
| **Project Reactor** | 响应式编程 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Spring 生态优先 |

#### 1.3.1 Spring Web MVC 基本示例

```java
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return new User(id, "Alice", "alice@example.com");
    }
    
    @PostMapping
    public User createUser(@RequestBody User user) {
        return user;
    }
    
    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User user) {
        user.setId(id);
        return user;
    }
    
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        // 删除用户
    }
}
```

#### 1.3.2 Swagger 文档

```java
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@Configuration
@EnableSwagger2
public class SwaggerConfig {
    
    @Bean
    public Docket api() {
        return new Docket(DocumentationType.SWAGGER_2)
            .apiInfo(new ApiInfoBuilder()
                .title("User API")
                .description("用户管理接口")
                .version("1.0")
                .build())
            .select()
            .apis(RequestHandlerSelectors.basePackage("com.example"))
            .paths(PathSelectors.any())
            .build();
    }
}
```

### 1.4 安全库 <Badge type="tip" text="认证授权" /> <Badge type="info" text="加密安全" /> <Badge type="warning" text="Token" />

| 库 | 功能 | 易用性 | 生态 | 适用场景 |
|----|------|--------|------|---------|
| **Spring Security** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | **企业级安全首选** |
| **JWT (jjwt)** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Token 认证 |
| **Apache Shiro** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | 轻量级安全 |
| **Bouncy Castle** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | 加密算法库 |
| **Jasypt** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | 数据加密 |

#### 1.4.1 Spring Security 基本配置

```java
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeRequests()
                .antMatchers("/public/**").permitAll()
                .anyRequest().authenticated()
                .and()
            .formLogin();
        return http.build();
    }
}
```

---

#### 1.4.2 JWT 认证

```java
import io.jsonwebtoken.*;
import java.util.Date;

public class JwtUtil {
    
    private static final String SECRET = "your-secret-key";
    private static final long EXPIRATION = 3600000; // 1 hour
    
    // 生成 Token
    public static String generateToken(String username) {
        return Jwts.builder()
            .setSubject(username)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
            .signWith(SignatureAlgorithm.HS512, SECRET)
            .compact();
    }
    
    // 解析 Token
    public static String getUsernameFromToken(String token) {
        return Jwts.parser()
            .setSigningKey(SECRET)
            .parseClaimsJws(token)
            .getBody()
            .getSubject();
    }
}
```

### 1.5 测试库 <Badge type="tip" text="单元测试" /> <Badge type="info" text="Mock框架" /> <Badge type="warning" text="集成测试" />

| 库 | 框架 | 类型 | 易用性 | 适用场景 |
|----|------|------|--------|---------|
| **JUnit 5** | ⭐⭐⭐⭐⭐ | 单元测试 | ⭐⭐⭐⭐⭐ | **单元测试首选** |
| **Mockito** | ⭐⭐⭐⭐⭐ | Mock 框架 | ⭐⭐⭐⭐⭐ | Mock 依赖对象 |
| **TestNG** | ⭐⭐⭐⭐ | 单元测试 | ⭐⭐⭐⭐ | 复杂测试场景 |
| **AssertJ** | ⭐⭐⭐⭐⭐ | 断言库 | ⭐⭐⭐⭐⭐ | 流式断言 |
| **Spring Boot Test** | ⭐⭐⭐⭐⭐ | 集成测试 | ⭐⭐⭐⭐⭐ | Spring 集成测试 |

#### 1.5.1 JUnit 5 单元测试

```java
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import static org.junit.jupiter.api.Assertions.*;

public class UserServiceTest {
    
    private UserService userService;
    
    @BeforeEach
    void setUp() {
        userService = new UserService();
    }
    
    @Test
    void testCreateUser() {
        User user = new User("Alice", "alice@example.com");
        User created = userService.create(user);
        
        assertNotNull(created);
        assertEquals("Alice", created.getName());
        assertNotNull(created.getId());
    }
    
    @Test
    void testUserNotFound() {
        assertThrows(UserNotFoundException.class, () -> {
            userService.getById(999L);
        });
    }
}
```

#### 1.5.2 Mockito 模拟

```java
import org.mockito.Mock;
import org.mockito.InjectMocks;
import static org.mockito.Mockito.*;

public class OrderServiceTest {
    
    @Mock
    private UserRepository userRepository;
    
    @InjectMocks
    private OrderService orderService;
    
    @Test
    void testCreateOrder() {
        User user = new User("Alice");
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        
        Order order = orderService.createOrder(1L, 100);
        
        assertEquals("Alice", order.getUser().getName());
        verify(userRepository, times(1)).findById(1L);
    }
}
```

#### 1.5.3 AssertJ 流式断言

```java
import static org.assertj.core.api.Assertions.*;

public class UserAssertionTest {
    
    @Test
    void testUserAssertions() {
        User user = new User("Alice", "alice@example.com");
        
        assertThat(user)
            .isNotNull()
            .extracting("name", "email")
            .contains("Alice", "alice@example.com");
        
        assertThat(user.getName())
            .isNotEmpty()
            .startsWith("Al")
            .hasSizeBetween(3, 10);
    }
}
```

#### 1.5.4 Spring Boot Test 集成测试

```java
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;

@SpringBootTest
public class UserControllerIntegrationTest {
    
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Test
    void testGetUser() {
        User user = restTemplate.getForObject("/api/users/1", User.class);
        
        assertNotNull(user);
        assertEquals("Alice", user.getName());
    }
}
```

## 2. ==JSON 库==

| 库 | 性能 | 易用性 | 功能完整性 | 生态 | 适用场景 |
|----|------|--------|-----------|------|---------|
| **Jackson** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | **工业开发首选** |
| **Fastjson2** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | 高性能需求 |
| **Gson** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | 简单场景 |
| **Protocol Buffers** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 微服务通信 |
| **Thrift** | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | 跨语言 RPC |

### 2.1 Jackson <Badge type="tip" text="工业首选" /> <Badge type="info" text="注解处理" /> <Badge type="warning" text="高性能" />

**基本序列化/反序列化**

```java
import com.fasterxml.jackson.databind.ObjectMapper;

public class JacksonExample {
    
    private static final ObjectMapper mapper = new ObjectMapper();
    
    public static void main(String[] args) throws Exception {
        // 对象 -> JSON
        Person person = new Person("Alice", 25, "alice@example.com");
        String json = mapper.writeValueAsString(person);
        System.out.println(json);
        
        // JSON -> 对象
        Person parsed = mapper.readValue(json, Person.class);
        System.out.println(parsed);
        
        // 集合
        List<Person> people = Arrays.asList(person);
        String listJson = mapper.writeValueAsString(people);
        List<Person> parsedList = mapper.readValue(
            listJson,
            new TypeReference<List<Person>>() {}
        );
    }
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class Person {
    private String name;
    private int age;
    private String email;
}
```

### 2.2 Fastjson2 <Badge type="tip" text="最高性能" /> <Badge type="info" text="国产方案" /> <Badge type="warning" text="易用性强" />

```java
import com.alibaba.fastjson2.JSON;

public class Fastjson2Example {
    
    public static void main(String[] args) {
        Person person = new Person("Alice", 25, "alice@example.com");
        
        // 对象 -> JSON
        String json = JSON.toJSONString(person);
        System.out.println(json);
        
        // JSON -> 对象
        Person parsed = JSON.parseObject(json, Person.class);
        System.out.println(parsed);
    }
}
```

### 2.3 Protocol Buffers / Thrift <Badge type="tip" text="跨语言" /> <Badge type="info" text="RPC框架" /> <Badge type="warning" text="微服务" />

这两个库主要用于微服务和跨语言通信，定义 `.proto` 文件后自动生成序列化代码。

::: card title="总结" icon="twemoji:star"
- **Spring Boot**: 默认 Jackson，无需额外配置
- **高性能需求**: Fastjson2 + Jackson 验证
- **微服务架构**: Protocol Buffers 或 gRPC
:::

## 3. ==日志库==

| 库 | 类型 | 性能 | 易用性 | 功能 | 适用场景 |
|----|------|------|--------|------|---------|
| **SLF4J** | ⭐⭐⭐⭐⭐ | 日志门面 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 日志抽象 |
| **Logback** | ⭐⭐⭐⭐⭐ | 日志框架 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | **日志框架首选** |
| **Log4j 2** | ⭐⭐⭐⭐⭐ | 日志框架 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 高性能场景 |
| **Tinylog** | ⭐⭐⭐⭐ | 日志框架 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 轻量级方案 |

### 3.1 SLF4J <Badge type="tip" text="日志门面" /> <Badge type="info" text="抽象层" />

SLF4J（Simple Logging Facade for Java）是一个日志抽象层，允许使用者在部署时选择自己想要的日志框架。

::: tabs

@tab Logback

啊叭叭叭叭

@tab Log4j 2

Log4j 2 是对 Log4j 的重大升级，提供了更好的性能和更多功能。

@tab Tinylog

Log4j 2 是对 Log4j 的重大升级，提供了更好的性能和更多功能。

:::

::: card title="总结" icon="twemoji:star"
- **新项目推荐**: SLF4J + Logback（简单快速）或 SLF4J + Log4j 2（高性能）
- **性能敏感**: 使用 Log4j 2 + 异步 Appender
- **过渡项目**: 使用 SLF4J，可灵活切换底层实现
:::