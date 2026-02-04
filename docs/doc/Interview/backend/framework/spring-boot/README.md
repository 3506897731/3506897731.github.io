---
title: Spring Boot Framework
createTime: 2026/02/04 00:00:00
permalink: /doc/Interview/backend/framework/spring-boot/
---

# Spring Boot 框架

Spring Boot 是目前 Java 后端开发最流行的框架,它简化了 Spring 应用的初始搭建以及开发过程。

## 核心特性

1. **自动配置 (Auto-Configuration)**: 根据依赖自动配置 Spring 应用
2. **起步依赖 (Starter Dependencies)**: 简化 Maven/Gradle 配置
3. **内嵌服务器**: 无需部署 WAR 文件,直接运行 JAR
4. **生产就绪特性**: 提供监控、健康检查等功能
5. **无代码生成**: 不生成代码,不需要 XML 配置

---

## 1. 项目结构

### 标准项目结构

```
project-root/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com.example.demo/
│   │   │       ├── DemoApplication.java          # 启动类
│   │   │       ├── controller/                   # 控制器层
│   │   │       ├── service/                      # 服务层
│   │   │       ├── repository/                   # 数据访问层
│   │   │       ├── model/entity/                 # 实体类
│   │   │       ├── model/dto/                    # 数据传输对象
│   │   │       ├── model/vo/                     # 视图对象
│   │   │       ├── config/                       # 配置类
│   │   │       ├── exception/                    # 异常处理
│   │   │       └── util/                         # 工具类
│   │   └── resources/
│   │       ├── application.yml                   # 配置文件
│   │       ├── application-dev.yml               # 开发环境配置
│   │       ├── application-prod.yml              # 生产环境配置
│   │       ├── static/                           # 静态资源
│   │       └── templates/                        # 模板文件
│   └── test/                                     # 测试代码
├── pom.xml                                       # Maven 配置
└── README.md
```

---

## 2. 启动类与自动配置

### 启动类示例

```java
package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Spring Boot 启动类
 * 
 * @SpringBootApplication 包含:
 *   - @SpringBootConfiguration: 配置类
 *   - @EnableAutoConfiguration: 自动配置
 *   - @ComponentScan: 组件扫描
 */
@SpringBootApplication
@EnableAsync          // 启用异步方法
@EnableScheduling     // 启用定时任务
public class DemoApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}
```

### 自定义自动配置

```java
// 自定义配置属性
@ConfigurationProperties(prefix = "my.app")
@Data
public class MyAppProperties {
    private String name;
    private String version;
    private boolean enabled = true;
}

// 自动配置类
@Configuration
@EnableConfigurationProperties(MyAppProperties.class)
@ConditionalOnProperty(prefix = "my.app", name = "enabled", havingValue = "true")
public class MyAppAutoConfiguration {
    
    @Autowired
    private MyAppProperties properties;
    
    @Bean
    @ConditionalOnMissingBean
    public MyService myService() {
        return new MyServiceImpl(properties);
    }
}
```

---

## 3. 配置文件

### application.yml 示例

```yaml
# 服务器配置
server:
  port: 8080
  servlet:
    context-path: /api

# Spring 配置
spring:
  application:
    name: demo-service
  
  # 数据源配置
  datasource:
    url: jdbc:mysql://localhost:3306/demo?useUnicode=true&characterEncoding=utf8
    username: root
    password: password
    driver-class-name: com.mysql.cj.jdbc.Driver
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 30000
  
  # JPA 配置
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        format_sql: true
  
  # Redis 配置
  redis:
    host: localhost
    port: 6379
    password: 
    database: 0
    lettuce:
      pool:
        max-active: 8
        max-idle: 8
        min-idle: 0
  
  # 缓存配置
  cache:
    type: redis
    redis:
      time-to-live: 3600000  # 1小时

# 日志配置
logging:
  level:
    root: INFO
    com.example.demo: DEBUG
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n"
  file:
    name: logs/application.log

# 自定义配置
my:
  app:
    name: Demo Application
    version: 1.0.0
    enabled: true
```

### 多环境配置

```java
// 配置类
@Configuration
@Profile("dev")  // 只在 dev 环境生效
public class DevConfig {
    
    @Bean
    public DataSource dataSource() {
        // 开发环境数据源
        return DataSourceBuilder.create()
            .url("jdbc:h2:mem:testdb")
            .build();
    }
}

@Configuration
@Profile("prod")  // 只在 prod 环境生效
public class ProdConfig {
    
    @Bean
    public DataSource dataSource() {
        // 生产环境数据源
        return DataSourceBuilder.create()
            .url("jdbc:mysql://prod-db:3306/app")
            .build();
    }
}
```

---

## 4. 控制器层 (Controller)

### RESTful API 示例

```java
@RestController
@RequestMapping("/api/users")
@Slf4j
@Validated
public class UserController {
    
    @Autowired
    private UserService userService;
    
    /**
     * 查询用户列表
     */
    @GetMapping
    public Result<Page<UserVO>> list(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String keyword) {
        
        Page<UserVO> users = userService.findUsers(page, size, keyword);
        return Result.success(users);
    }
    
    /**
     * 根据ID查询用户
     */
    @GetMapping("/{id}")
    public Result<UserVO> getById(@PathVariable Long id) {
        UserVO user = userService.findById(id);
        if (user == null) {
            return Result.error("用户不存在");
        }
        return Result.success(user);
    }
    
    /**
     * 创建用户
     */
    @PostMapping
    public Result<UserVO> create(@RequestBody @Valid UserCreateDTO dto) {
        UserVO user = userService.createUser(dto);
        return Result.success(user);
    }
    
    /**
     * 更新用户
     */
    @PutMapping("/{id}")
    public Result<UserVO> update(
            @PathVariable Long id,
            @RequestBody @Valid UserUpdateDTO dto) {
        UserVO user = userService.updateUser(id, dto);
        return Result.success(user);
    }
    
    /**
     * 删除用户
     */
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        userService.deleteUser(id);
        return Result.success();
    }
    
    /**
     * 批量删除
     */
    @DeleteMapping("/batch")
    public Result<Void> batchDelete(@RequestBody List<Long> ids) {
        userService.batchDelete(ids);
        return Result.success();
    }
}

// 统一响应结果
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Result<T> {
    private Integer code;
    private String message;
    private T data;
    
    public static <T> Result<T> success() {
        return new Result<>(200, "success", null);
    }
    
    public static <T> Result<T> success(T data) {
        return new Result<>(200, "success", data);
    }
    
    public static <T> Result<T> error(String message) {
        return new Result<>(500, message, null);
    }
}
```

---

## 5. 服务层 (Service)

### 服务接口与实现

```java
// 服务接口
public interface UserService {
    Page<UserVO> findUsers(Integer page, Integer size, String keyword);
    UserVO findById(Long id);
    UserVO createUser(UserCreateDTO dto);
    UserVO updateUser(Long id, UserUpdateDTO dto);
    void deleteUser(Long id);
    void batchDelete(List<Long> ids);
}

// 服务实现
@Service
@Slf4j
@Transactional
public class UserServiceImpl implements UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UserMapper userMapper;
    
    @Override
    @Transactional(readOnly = true)
    public Page<UserVO> findUsers(Integer page, Integer size, String keyword) {
        Pageable pageable = PageRequest.of(page - 1, size);
        
        Page<User> userPage;
        if (StringUtils.hasText(keyword)) {
            userPage = userRepository.findByUsernameContainingOrEmailContaining(
                keyword, keyword, pageable);
        } else {
            userPage = userRepository.findAll(pageable);
        }
        
        return userPage.map(userMapper::toVO);
    }
    
    @Override
    @Transactional(readOnly = true)
    public UserVO findById(Long id) {
        return userRepository.findById(id)
            .map(userMapper::toVO)
            .orElse(null);
    }
    
    @Override
    public UserVO createUser(UserCreateDTO dto) {
        // 检查用户名是否存在
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new BusinessException("用户名已存在");
        }
        
        // DTO -> Entity
        User user = userMapper.toEntity(dto);
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setCreateTime(LocalDateTime.now());
        
        // 保存
        User saved = userRepository.save(user);
        
        // 发送欢迎邮件 (异步)
        emailService.sendWelcomeEmail(saved.getEmail());
        
        return userMapper.toVO(saved);
    }
    
    @Override
    public UserVO updateUser(Long id, UserUpdateDTO dto) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new BusinessException("用户不存在"));
        
        // 更新字段
        if (StringUtils.hasText(dto.getEmail())) {
            user.setEmail(dto.getEmail());
        }
        if (StringUtils.hasText(dto.getPhone())) {
            user.setPhone(dto.getPhone());
        }
        user.setUpdateTime(LocalDateTime.now());
        
        User updated = userRepository.save(user);
        return userMapper.toVO(updated);
    }
    
    @Override
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new BusinessException("用户不存在");
        }
        userRepository.deleteById(id);
    }
    
    @Override
    public void batchDelete(List<Long> ids) {
        userRepository.deleteAllByIdInBatch(ids);
    }
}
```

---

## 6. 数据访问层 (Repository)

### JPA Repository

```java
@Repository
public interface UserRepository extends JpaRepository<User, Long>, 
                                        JpaSpecificationExecutor<User> {
    
    // 方法名查询
    Optional<User> findByUsername(String username);
    
    Optional<User> findByEmail(String email);
    
    boolean existsByUsername(String username);
    
    Page<User> findByUsernameContainingOrEmailContaining(
        String username, String email, Pageable pageable);
    
    List<User> findByCreateTimeBetween(LocalDateTime start, LocalDateTime end);
    
    // @Query 查询
    @Query("SELECT u FROM User u WHERE u.status = :status AND u.createTime > :time")
    List<User> findActiveUsers(@Param("status") Integer status, 
                               @Param("time") LocalDateTime time);
    
    @Query(value = "SELECT * FROM user WHERE department_id = ?1", nativeQuery = true)
    List<User> findByDepartmentNative(Long departmentId);
    
    // 更新操作
    @Modifying
    @Query("UPDATE User u SET u.status = :status WHERE u.id = :id")
    int updateStatus(@Param("id") Long id, @Param("status") Integer status);
}

// 实体类
@Entity
@Table(name = "user")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true, length = 50)
    private String username;
    
    @Column(nullable = false)
    private String password;
    
    @Column(unique = true, length = 100)
    private String email;
    
    @Column(length = 20)
    private String phone;
    
    @Column(nullable = false)
    private Integer status = 1;  // 1-正常, 0-禁用
    
    @Column(name = "create_time")
    private LocalDateTime createTime;
    
    @Column(name = "update_time")
    private LocalDateTime updateTime;
}
```

### MyBatis 使用

```java
// Mapper 接口
@Mapper
public interface UserMapper {
    
    User findById(@Param("id") Long id);
    
    List<User> findAll();
    
    List<User> findByCondition(UserQuery query);
    
    int insert(User user);
    
    int update(User user);
    
    int deleteById(@Param("id") Long id);
    
    Page<User> findPage(IPage<User> page, @Param("query") UserQuery query);
}

// XML 映射文件 (UserMapper.xml)
/*
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" 
    "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.example.demo.mapper.UserMapper">
    
    <select id="findById" resultType="com.example.demo.entity.User">
        SELECT * FROM user WHERE id = #{id}
    </select>
    
    <select id="findByCondition" resultType="com.example.demo.entity.User">
        SELECT * FROM user
        <where>
            <if test="username != null and username != ''">
                AND username LIKE CONCAT('%', #{username}, '%')
            </if>
            <if test="email != null and email != ''">
                AND email = #{email}
            </if>
            <if test="status != null">
                AND status = #{status}
            </if>
        </where>
        ORDER BY create_time DESC
    </select>
    
    <insert id="insert" useGeneratedKeys="true" keyProperty="id">
        INSERT INTO user (username, password, email, phone, status, create_time)
        VALUES (#{username}, #{password}, #{email}, #{phone}, #{status}, #{createTime})
    </insert>
    
</mapper>
*/
```

---

## 7. 异常处理

### 全局异常处理器

```java
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    
    /**
     * 业务异常
     */
    @ExceptionHandler(BusinessException.class)
    public Result<Void> handleBusinessException(BusinessException e) {
        log.error("业务异常: {}", e.getMessage());
        return Result.error(e.getMessage());
    }
    
    /**
     * 参数校验异常
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Result<Void> handleValidationException(MethodArgumentNotValidException e) {
        BindingResult result = e.getBindingResult();
        String message = result.getFieldErrors().stream()
            .map(error -> error.getField() + ": " + error.getDefaultMessage())
            .collect(Collectors.joining(", "));
        
        log.error("参数校验失败: {}", message);
        return Result.error("参数校验失败: " + message);
    }
    
    /**
     * 数据库异常
     */
    @ExceptionHandler(DataAccessException.class)
    public Result<Void> handleDataAccessException(DataAccessException e) {
        log.error("数据库异常", e);
        return Result.error("数据库操作失败");
    }
    
    /**
     * 未知异常
     */
    @ExceptionHandler(Exception.class)
    public Result<Void> handleException(Exception e) {
        log.error("系统异常", e);
        return Result.error("系统异常,请联系管理员");
    }
}

// 自定义业务异常
public class BusinessException extends RuntimeException {
    
    private Integer code;
    
    public BusinessException(String message) {
        super(message);
        this.code = 500;
    }
    
    public BusinessException(Integer code, String message) {
        super(message);
        this.code = code;
    }
}
```

---

## 8. 参数校验

### 使用 Bean Validation

```java
// DTO 类
@Data
public class UserCreateDTO {
    
    @NotBlank(message = "用户名不能为空")
    @Size(min = 3, max = 20, message = "用户名长度必须在3-20之间")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "用户名只能包含字母、数字和下划线")
    private String username;
    
    @NotBlank(message = "密码不能为空")
    @Size(min = 6, max = 20, message = "密码长度必须在6-20之间")
    private String password;
    
    @NotBlank(message = "邮箱不能为空")
    @Email(message = "邮箱格式不正确")
    private String email;
    
    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "手机号格式不正确")
    private String phone;
    
    @Min(value = 18, message = "年龄必须大于18岁")
    @Max(value = 100, message = "年龄不能超过100岁")
    private Integer age;
}

// 自定义校验注解
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = UsernameValidator.class)
public @interface ValidUsername {
    String message() default "用户名格式不正确";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

// 自定义校验器
public class UsernameValidator implements ConstraintValidator<ValidUsername, String> {
    
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.isEmpty()) {
            return false;
        }
        // 自定义校验逻辑
        return value.matches("^[a-zA-Z0-9_]{3,20}$");
    }
}
```

---

## 9. 缓存

### Spring Cache 抽象

```java
@Service
@CacheConfig(cacheNames = "users")
public class UserService {
    
    /**
     * 缓存结果
     */
    @Cacheable(key = "#id")
    public User findById(Long id) {
        return userRepository.findById(id).orElse(null);
    }
    
    /**
     * 缓存结果,条件缓存
     */
    @Cacheable(key = "#username", condition = "#username != null")
    public User findByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }
    
    /**
     * 更新缓存
     */
    @CachePut(key = "#user.id")
    public User updateUser(User user) {
        return userRepository.save(user);
    }
    
    /**
     * 删除缓存
     */
    @CacheEvict(key = "#id")
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
    
    /**
     * 清空所有缓存
     */
    @CacheEvict(allEntries = true)
    public void clearCache() {
        // 清空 users 缓存空间
    }
}

// Redis 缓存配置
@Configuration
@EnableCaching
public class CacheConfig {
    
    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory factory) {
        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofHours(1))  // 缓存1小时
            .serializeKeysWith(
                RedisSerializationContext.SerializationPair.fromSerializer(
                    new StringRedisSerializer()))
            .serializeValuesWith(
                RedisSerializationContext.SerializationPair.fromSerializer(
                    new GenericJackson2JsonRedisSerializer()))
            .disableCachingNullValues();
        
        return RedisCacheManager.builder(factory)
            .cacheDefaults(config)
            .build();
    }
}
```

---

## 10. 异步任务

### @Async 异步方法

```java
@Service
@Slf4j
public class EmailService {
    
    /**
     * 异步发送邮件
     */
    @Async
    public CompletableFuture<Boolean> sendEmail(String to, String subject, String content) {
        log.info("开始发送邮件: {}", to);
        
        try {
            // 模拟发送邮件
            Thread.sleep(2000);
            log.info("邮件发送成功: {}", to);
            return CompletableFuture.completedFuture(true);
        } catch (Exception e) {
            log.error("邮件发送失败", e);
            return CompletableFuture.completedFuture(false);
        }
    }
    
    @Async
    public void sendWelcomeEmail(String email) {
        sendEmail(email, "欢迎注册", "感谢您的注册!");
    }
}

// 异步配置
@Configuration
@EnableAsync
public class AsyncConfig implements AsyncConfigurer {
    
    @Override
    public Executor getAsyncExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);
        executor.setMaxPoolSize(10);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("async-");
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        executor.initialize();
        return executor;
    }
    
    @Override
    public AsyncUncaughtExceptionHandler getAsyncUncaughtExceptionHandler() {
        return (ex, method, params) -> {
            log.error("异步方法执行异常: {}", method.getName(), ex);
        };
    }
}
```

---

## 11. 定时任务

### @Scheduled 定时任务

```java
@Component
@Slf4j
public class ScheduledTasks {
    
    /**
     * 每5秒执行一次
     */
    @Scheduled(fixedRate = 5000)
    public void reportCurrentTime() {
        log.info("当前时间: {}", LocalDateTime.now());
    }
    
    /**
     * 每天凌晨1点执行
     */
    @Scheduled(cron = "0 0 1 * * ?")
    public void cleanupOldData() {
        log.info("开始清理旧数据...");
        // 清理逻辑
    }
    
    /**
     * 上次执行完毕后,延迟10秒再执行
     */
    @Scheduled(fixedDelay = 10000)
    public void processTask() {
        log.info("处理任务...");
        // 任务逻辑
    }
    
    /**
     * 首次延迟5秒,然后每10秒执行一次
     */
    @Scheduled(initialDelay = 5000, fixedRate = 10000)
    public void initializeTask() {
        log.info("初始化任务...");
    }
}
```

---

## 12. 事件机制

### Spring Event

```java
// 自定义事件
public class UserRegisteredEvent extends ApplicationEvent {
    
    private final User user;
    
    public UserRegisteredEvent(Object source, User user) {
        super(source);
        this.user = user;
    }
    
    public User getUser() {
        return user;
    }
}

// 事件发布者
@Service
public class UserService {
    
    @Autowired
    private ApplicationEventPublisher eventPublisher;
    
    public User register(UserCreateDTO dto) {
        // 创建用户
        User user = createUser(dto);
        
        // 发布事件
        eventPublisher.publishEvent(new UserRegisteredEvent(this, user));
        
        return user;
    }
}

// 事件监听器
@Component
@Slf4j
public class UserEventListener {
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private PointService pointService;
    
    /**
     * 监听用户注册事件 - 发送欢迎邮件
     */
    @EventListener
    @Async
    public void handleUserRegistered(UserRegisteredEvent event) {
        User user = event.getUser();
        log.info("用户注册成功,发送欢迎邮件: {}", user.getEmail());
        emailService.sendWelcomeEmail(user.getEmail());
    }
    
    /**
     * 监听用户注册事件 - 赠送积分
     */
    @EventListener
    @Async
    public void giveWelcomePoints(UserRegisteredEvent event) {
        User user = event.getUser();
        log.info("用户注册成功,赠送欢迎积分: {}", user.getId());
        pointService.addPoints(user.getId(), 100, "注册奖励");
    }
    
    /**
     * 条件监听
     */
    @EventListener(condition = "#event.user.email != null")
    public void onUserWithEmail(UserRegisteredEvent event) {
        log.info("用户有邮箱: {}", event.getUser().getEmail());
    }
}
```

---

## 13. Actuator 监控

### 启用 Actuator

```yaml
# application.yml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,env,loggers
  endpoint:
    health:
      show-details: always
  metrics:
    export:
      prometheus:
        enabled: true
```

### 常用端点

```bash
# 健康检查
GET /actuator/health

# 应用信息
GET /actuator/info

# 指标数据
GET /actuator/metrics
GET /actuator/metrics/jvm.memory.used

# 环境变量
GET /actuator/env

# 日志级别
GET /actuator/loggers
POST /actuator/loggers/com.example.demo
{
  "configuredLevel": "DEBUG"
}
```

### 自定义健康检查

```java
@Component
public class CustomHealthIndicator implements HealthIndicator {
    
    @Override
    public Health health() {
        // 检查外部服务
        boolean externalServiceUp = checkExternalService();
        
        if (externalServiceUp) {
            return Health.up()
                .withDetail("externalService", "Available")
                .build();
        } else {
            return Health.down()
                .withDetail("externalService", "Unavailable")
                .build();
        }
    }
    
    private boolean checkExternalService() {
        // 检查逻辑
        return true;
    }
}
```

---

## 面试常见问题

### 1. Spring Boot 的自动配置原理?
- 通过 `@EnableAutoConfiguration` 导入 `AutoConfigurationImportSelector`
- 读取 `META-INF/spring.factories` 文件中的自动配置类
- 根据 `@Conditional` 注解条件决定是否生效

### 2. Spring Boot 启动流程?
1. 创建 `SpringApplication` 实例
2. 准备环境 (Environment)
3. 创建 `ApplicationContext`
4. 刷新上下文 (加载 Bean)
5. 执行 Runner (CommandLineRunner, ApplicationRunner)

### 3. Spring Boot 和 Spring 的区别?
- **Spring**: 需要大量 XML 配置
- **Spring Boot**: 自动配置,开箱即用,内嵌服务器

### 4. 如何优化 Spring Boot 启动速度?
- 减少不必要的自动配置
- 使用懒加载 (`spring.main.lazy-initialization=true`)
- 使用 Spring Boot 2.2+ 的启动优化
- 减少扫描的包范围

### 5. Spring Boot 如何实现热部署?
使用 `spring-boot-devtools`:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <optional>true</optional>
</dependency>
```

---

## 总结

Spring Boot 是 Java 后端开发的首选框架,掌握以下核心内容:

1. **自动配置原理**: 理解 `@SpringBootApplication` 和条件注解
2. **三层架构**: Controller → Service → Repository
3. **数据访问**: JPA 或 MyBatis
4. **异常处理**: 全局异常处理器
5. **参数校验**: Bean Validation
6. **缓存**: Spring Cache + Redis
7. **异步任务**: `@Async`
8. **定时任务**: `@Scheduled`
9. **事件机制**: ApplicationEvent
10. **监控运维**: Actuator

这些知识点基本覆盖了 Spring Boot 日常开发和面试的核心内容。
