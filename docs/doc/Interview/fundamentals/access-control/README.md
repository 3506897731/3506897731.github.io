---
title: Access Control 权限控制
createTime: 2026/02/04 00:00:00
permalink: /doc/Interview/fundamentals/access-control/
---

# Access Control 权限控制

权限控制是系统安全的核心组成部分,用于确定用户或服务对资源的访问权限。本文介绍四种主流的权限控制模型和机制。

## 1. RBAC (Role-Based Access Control) 基于角色的访问控制

### 核心概念

RBAC 是最常用的权限控制模型,通过角色来间接授予用户权限。

**核心要素:**
- **用户 (User)**: 系统的使用者
- **角色 (Role)**: 权限的集合
- **权限 (Permission)**: 对资源的操作许可
- **资源 (Resource)**: 系统中需要保护的对象

### 模型结构

```
用户 (User) ←→ 角色 (Role) ←→ 权限 (Permission) ←→ 资源 (Resource)
```

### 实现示例

```java
// 用户实体
public class User {
    private Long id;
    private String username;
    private Set<Role> roles;  // 用户拥有的角色
}

// 角色实体
public class Role {
    private Long id;
    private String name;  // admin, editor, viewer
    private String description;
    private Set<Permission> permissions;  // 角色拥有的权限
}

// 权限实体
public class Permission {
    private Long id;
    private String resource;  // 资源标识: user, article, order
    private String action;    // 操作: create, read, update, delete
    private String code;      // 权限码: user:create, article:read
}

// 权限检查服务
@Service
public class RbacService {
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * 检查用户是否有指定权限
     */
    public boolean hasPermission(Long userId, String permissionCode) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return false;
        
        return user.getRoles().stream()
            .flatMap(role -> role.getPermissions().stream())
            .anyMatch(permission -> permission.getCode().equals(permissionCode));
    }
    
    /**
     * 检查用户是否有指定角色
     */
    public boolean hasRole(Long userId, String roleName) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return false;
        
        return user.getRoles().stream()
            .anyMatch(role -> role.getName().equals(roleName));
    }
}

// 使用注解进行权限控制
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RequiresPermission {
    String value();  // 权限码
}

// AOP 切面实现
@Aspect
@Component
public class PermissionAspect {
    
    @Autowired
    private RbacService rbacService;
    
    @Around("@annotation(requiresPermission)")
    public Object checkPermission(ProceedingJoinPoint joinPoint, 
                                  RequiresPermission requiresPermission) throws Throwable {
        // 获取当前用户ID (从 SecurityContext 或 Session 中获取)
        Long userId = getCurrentUserId();
        
        String permissionCode = requiresPermission.value();
        if (!rbacService.hasPermission(userId, permissionCode)) {
            throw new AccessDeniedException("权限不足: " + permissionCode);
        }
        
        return joinPoint.proceed();
    }
    
    private Long getCurrentUserId() {
        // 从 Spring Security 或 Session 中获取当前用户
        return 1L; // 示例
    }
}

// 控制器使用示例
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @PostMapping
    @RequiresPermission("user:create")
    public Result createUser(@RequestBody UserDTO dto) {
        // 只有拥有 user:create 权限的用户才能执行
        return Result.success();
    }
    
    @DeleteMapping("/{id}")
    @RequiresPermission("user:delete")
    public Result deleteUser(@PathVariable Long id) {
        // 只有拥有 user:delete 权限的用户才能执行
        return Result.success();
    }
}
```

### RBAC 优势
- ✅ 简单易懂,易于管理
- ✅ 减少权限分配的复杂度
- ✅ 符合企业组织结构
- ✅ 权限变更只需修改角色

### RBAC 局限
- ❌ 角色爆炸问题 (角色过多难以管理)
- ❌ 不支持细粒度的动态权限
- ❌ 难以处理特殊场景 (如数据行级别权限)

---

## 2. ABAC (Attribute-Based Access Control) 基于属性的访问控制

### 核心概念

ABAC 通过评估属性来做访问决策,支持更灵活和细粒度的权限控制。

**四类属性:**
1. **主体属性 (Subject)**: 用户的属性 (部门、职位、等级)
2. **资源属性 (Resource)**: 资源的属性 (类型、创建者、状态)
3. **动作属性 (Action)**: 操作类型 (读、写、删除)
4. **环境属性 (Environment)**: 上下文信息 (时间、地点、IP)

### 实现示例

```java
// 属性实体
public class Attribute {
    private String name;   // 属性名: department, level, ip
    private Object value;  // 属性值: "IT", "senior", "192.168.1.1"
}

// 策略规则
public class PolicyRule {
    private String id;
    private String name;
    private String effect;  // ALLOW 或 DENY
    private List<Condition> conditions;  // 条件列表
}

// 条件
public class Condition {
    private String attribute;  // 属性名
    private String operator;   // 操作符: eq, gt, lt, in
    private Object value;      // 比较值
    
    public boolean evaluate(Map<String, Object> context) {
        Object actualValue = context.get(attribute);
        switch (operator) {
            case "eq":
                return Objects.equals(actualValue, value);
            case "gt":
                return ((Comparable) actualValue).compareTo(value) > 0;
            case "in":
                return ((List) value).contains(actualValue);
            default:
                return false;
        }
    }
}

// ABAC 策略引擎
@Service
public class AbacEngine {
    
    @Autowired
    private PolicyRepository policyRepository;
    
    /**
     * 评估访问请求
     */
    public boolean evaluate(AccessRequest request) {
        // 构建上下文
        Map<String, Object> context = buildContext(request);
        
        // 获取适用的策略
        List<PolicyRule> policies = policyRepository.findApplicablePolicies(
            request.getResource(), request.getAction()
        );
        
        // 评估策略
        for (PolicyRule policy : policies) {
            if (matchAllConditions(policy.getConditions(), context)) {
                return "ALLOW".equals(policy.getEffect());
            }
        }
        
        return false;  // 默认拒绝
    }
    
    private Map<String, Object> buildContext(AccessRequest request) {
        Map<String, Object> context = new HashMap<>();
        
        // 主体属性
        User user = request.getUser();
        context.put("user.department", user.getDepartment());
        context.put("user.level", user.getLevel());
        context.put("user.id", user.getId());
        
        // 资源属性
        Resource resource = request.getResource();
        context.put("resource.type", resource.getType());
        context.put("resource.owner", resource.getOwnerId());
        context.put("resource.status", resource.getStatus());
        
        // 环境属性
        context.put("env.time", LocalDateTime.now().getHour());
        context.put("env.ip", request.getIpAddress());
        
        return context;
    }
    
    private boolean matchAllConditions(List<Condition> conditions, 
                                       Map<String, Object> context) {
        return conditions.stream()
            .allMatch(condition -> condition.evaluate(context));
    }
}

// 访问请求
public class AccessRequest {
    private User user;
    private Resource resource;
    private String action;
    private String ipAddress;
    // getters...
}

// 使用示例
@RestController
@RequestMapping("/api/documents")
public class DocumentController {
    
    @Autowired
    private AbacEngine abacEngine;
    
    @GetMapping("/{id}")
    public Result getDocument(@PathVariable Long id, HttpServletRequest request) {
        Document doc = documentService.findById(id);
        
        // 构建访问请求
        AccessRequest accessRequest = AccessRequest.builder()
            .user(getCurrentUser())
            .resource(doc)
            .action("read")
            .ipAddress(request.getRemoteAddr())
            .build();
        
        // 评估权限
        if (!abacEngine.evaluate(accessRequest)) {
            throw new AccessDeniedException("无权访问该文档");
        }
        
        return Result.success(doc);
    }
}

// 策略配置示例 (JSON 格式)
{
  "id": "policy-001",
  "name": "部门经理可以查看本部门文档",
  "effect": "ALLOW",
  "conditions": [
    {
      "attribute": "user.level",
      "operator": "eq",
      "value": "manager"
    },
    {
      "attribute": "user.department",
      "operator": "eq",
      "value": "${resource.department}"  // 动态引用资源属性
    },
    {
      "attribute": "resource.type",
      "operator": "eq",
      "value": "document"
    }
  ]
}
```

### ABAC 优势
- ✅ 灵活性高,支持复杂场景
- ✅ 细粒度控制 (行级、字段级)
- ✅ 支持动态权限和上下文感知
- ✅ 减少角色数量

### ABAC 局限
- ❌ 实现复杂,学习成本高
- ❌ 性能开销较大
- ❌ 策略管理和调试困难

---

## 3. Authentication 认证机制

### 核心概念

认证 (Authentication) 是验证用户身份的过程,回答"你是谁?"的问题。

### 常见认证方式

#### 3.1 基于 Session 的认证

```java
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    /**
     * 登录
     */
    @PostMapping("/login")
    public Result login(@RequestBody LoginRequest request, HttpSession session) {
        // 验证用户名和密码
        User user = userService.authenticate(request.getUsername(), request.getPassword());
        
        if (user == null) {
            return Result.error("用户名或密码错误");
        }
        
        // 将用户信息存入 Session
        session.setAttribute("userId", user.getId());
        session.setAttribute("username", user.getUsername());
        
        return Result.success("登录成功");
    }
    
    /**
     * 登出
     */
    @PostMapping("/logout")
    public Result logout(HttpSession session) {
        session.invalidate();
        return Result.success("登出成功");
    }
    
    /**
     * 获取当前用户
     */
    @GetMapping("/current")
    public Result getCurrentUser(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return Result.error("未登录");
        }
        
        User user = userService.findById(userId);
        return Result.success(user);
    }
}
```

#### 3.2 基于 JWT 的认证

```java
@Service
public class JwtService {
    
    private static final String SECRET_KEY = "your-secret-key-change-in-production";
    private static final long EXPIRATION_TIME = 86400000; // 24小时
    
    /**
     * 生成 JWT Token
     */
    public String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        claims.put("username", user.getUsername());
        claims.put("roles", user.getRoles().stream()
            .map(Role::getName)
            .collect(Collectors.toList()));
        
        return Jwts.builder()
            .setClaims(claims)
            .setSubject(user.getUsername())
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
            .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
            .compact();
    }
    
    /**
     * 验证 Token
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    
    /**
     * 从 Token 中提取用户信息
     */
    public Claims getClaimsFromToken(String token) {
        return Jwts.parser()
            .setSigningKey(SECRET_KEY)
            .parseClaimsJws(token)
            .getBody();
    }
    
    /**
     * 从 Token 中获取用户ID
     */
    public Long getUserIdFromToken(String token) {
        Claims claims = getClaimsFromToken(token);
        return claims.get("userId", Long.class);
    }
}

// JWT 拦截器
@Component
public class JwtInterceptor implements HandlerInterceptor {
    
    @Autowired
    private JwtService jwtService;
    
    @Override
    public boolean preHandle(HttpServletRequest request, 
                            HttpServletResponse response, 
                            Object handler) throws Exception {
        // 从请求头获取 Token
        String token = request.getHeader("Authorization");
        
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
            
            // 验证 Token
            if (jwtService.validateToken(token)) {
                // 将用户信息存入请求属性
                Long userId = jwtService.getUserIdFromToken(token);
                request.setAttribute("userId", userId);
                return true;
            }
        }
        
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.getWriter().write("未授权访问");
        return false;
    }
}

// 登录控制器
@RestController
@RequestMapping("/api/auth")
public class JwtAuthController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtService jwtService;
    
    @PostMapping("/login")
    public Result login(@RequestBody LoginRequest request) {
        User user = userService.authenticate(request.getUsername(), request.getPassword());
        
        if (user == null) {
            return Result.error("用户名或密码错误");
        }
        
        // 生成 Token
        String token = jwtService.generateToken(user);
        
        return Result.success(Map.of(
            "token", token,
            "type", "Bearer",
            "expiresIn", 86400
        ));
    }
}
```

#### 3.3 OAuth 2.0 认证

```java
// OAuth 2.0 配置 (Spring Security)
@Configuration
@EnableWebSecurity
public class OAuth2SecurityConfig extends WebSecurityConfigurerAdapter {
    
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .authorizeRequests()
                .antMatchers("/", "/login**", "/error**").permitAll()
                .anyRequest().authenticated()
            .and()
            .oauth2Login()
                .loginPage("/login")
                .defaultSuccessUrl("/dashboard")
                .userInfoEndpoint()
                    .userService(customOAuth2UserService());
    }
    
    @Bean
    public OAuth2UserService<OAuth2UserRequest, OAuth2User> customOAuth2UserService() {
        return new CustomOAuth2UserService();
    }
}

// 自定义 OAuth2 用户服务
@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);
        
        // 获取 OAuth 提供商信息
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        String email = oauth2User.getAttribute("email");
        
        // 查找或创建用户
        User user = userRepository.findByEmail(email)
            .orElseGet(() -> {
                User newUser = new User();
                newUser.setEmail(email);
                newUser.setUsername(oauth2User.getAttribute("name"));
                newUser.setOauthProvider(registrationId);
                return userRepository.save(newUser);
            });
        
        return new CustomOAuth2User(oauth2User, user);
    }
}

// application.yml 配置
/*
spring:
  security:
    oauth2:
      client:
        registration:
          google:
            client-id: your-google-client-id
            client-secret: your-google-client-secret
            scope: profile, email
          github:
            client-id: your-github-client-id
            client-secret: your-github-client-secret
            scope: user:email
*/
```

### 认证方式对比

| 认证方式 | 优势 | 劣势 | 适用场景 |
|---------|------|------|---------|
| **Session** | 简单易用,服务端控制强 | 不适合分布式,占用服务器内存 | 传统单体应用 |
| **JWT** | 无状态,适合分布式,移动端友好 | 无法主动失效,Token 体积较大 | 微服务、移动应用 |
| **OAuth 2.0** | 第三方登录,安全性高,用户体验好 | 实现复杂,依赖第三方 | 社交登录,开放平台 |

---

## 4. Authorization 授权机制

### 核心概念

授权 (Authorization) 是确定用户能做什么的过程,回答"你能做什么?"的问题。

### 授权实现方式

#### 4.1 基于注解的授权

```java
// Spring Security 注解
@RestController
@RequestMapping("/api/admin")
public class AdminController {
    
    // 只有 ADMIN 角色可以访问
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public Result getAllUsers() {
        return Result.success(userService.findAll());
    }
    
    // 需要特定权限
    @PreAuthorize("hasAuthority('user:delete')")
    @DeleteMapping("/users/{id}")
    public Result deleteUser(@PathVariable Long id) {
        return Result.success();
    }
    
    // 复杂表达式
    @PreAuthorize("hasRole('ADMIN') or (hasRole('EDITOR') and #userId == principal.id)")
    @PutMapping("/users/{userId}")
    public Result updateUser(@PathVariable Long userId, @RequestBody UserDTO dto) {
        return Result.success();
    }
    
    // 方法执行后检查
    @PostAuthorize("returnObject.data.ownerId == principal.id")
    @GetMapping("/documents/{id}")
    public Result getDocument(@PathVariable Long id) {
        return Result.success(documentService.findById(id));
    }
}
```

#### 4.2 基于拦截器的授权

```java
// 权限拦截器
@Component
public class AuthorizationInterceptor implements HandlerInterceptor {
    
    @Autowired
    private RbacService rbacService;
    
    @Override
    public boolean preHandle(HttpServletRequest request, 
                            HttpServletResponse response, 
                            Object handler) throws Exception {
        if (!(handler instanceof HandlerMethod)) {
            return true;
        }
        
        HandlerMethod handlerMethod = (HandlerMethod) handler;
        
        // 检查是否有 @RequiresPermission 注解
        RequiresPermission annotation = handlerMethod.getMethodAnnotation(RequiresPermission.class);
        if (annotation == null) {
            return true;
        }
        
        // 获取当前用户
        Long userId = (Long) request.getAttribute("userId");
        if (userId == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return false;
        }
        
        // 检查权限
        String requiredPermission = annotation.value();
        if (!rbacService.hasPermission(userId, requiredPermission)) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.getWriter().write("权限不足: " + requiredPermission);
            return false;
        }
        
        return true;
    }
}

// 注册拦截器
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    
    @Autowired
    private AuthorizationInterceptor authorizationInterceptor;
    
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(authorizationInterceptor)
            .addPathPatterns("/api/**")
            .excludePathPatterns("/api/auth/**");
    }
}
```

#### 4.3 动态权限控制

```java
// 权限服务
@Service
public class DynamicAuthorizationService {
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * 检查用户是否可以访问指定资源
     */
    public boolean canAccessResource(Long userId, String resourceType, Long resourceId, String action) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return false;
        
        // 1. 检查全局权限
        if (hasGlobalPermission(user, resourceType, action)) {
            return true;
        }
        
        // 2. 检查资源所有者
        if (isResourceOwner(userId, resourceType, resourceId)) {
            return true;
        }
        
        // 3. 检查资源级别权限
        if (hasResourcePermission(userId, resourceType, resourceId, action)) {
            return true;
        }
        
        return false;
    }
    
    private boolean hasGlobalPermission(User user, String resourceType, String action) {
        String permissionCode = resourceType + ":" + action;
        return user.getRoles().stream()
            .flatMap(role -> role.getPermissions().stream())
            .anyMatch(p -> p.getCode().equals(permissionCode));
    }
    
    private boolean isResourceOwner(Long userId, String resourceType, Long resourceId) {
        // 查询资源的 owner_id 字段
        // 这里简化处理,实际应该根据 resourceType 查询不同的表
        return true; // 示例
    }
    
    private boolean hasResourcePermission(Long userId, String resourceType, 
                                         Long resourceId, String action) {
        // 检查资源级别的权限配置
        // 例如:文档分享、协作者权限等
        return false; // 示例
    }
}

// 使用示例
@RestController
@RequestMapping("/api/documents")
public class DocumentController {
    
    @Autowired
    private DynamicAuthorizationService authService;
    
    @GetMapping("/{id}")
    public Result getDocument(@PathVariable Long id, @RequestAttribute Long userId) {
        // 检查权限
        if (!authService.canAccessResource(userId, "document", id, "read")) {
            throw new AccessDeniedException("无权访问该文档");
        }
        
        Document doc = documentService.findById(id);
        return Result.success(doc);
    }
    
    @PutMapping("/{id}")
    public Result updateDocument(@PathVariable Long id, 
                                @RequestBody DocumentDTO dto,
                                @RequestAttribute Long userId) {
        // 检查编辑权限
        if (!authService.canAccessResource(userId, "document", id, "update")) {
            throw new AccessDeniedException("无权编辑该文档");
        }
        
        documentService.update(id, dto);
        return Result.success();
    }
}
```

### 授权最佳实践

1. **最小权限原则**: 默认拒绝,只授予必需的权限
2. **职责分离**: 关键操作需要多个权限组合
3. **权限继承**: 通过角色层级实现权限继承
4. **审计日志**: 记录所有权限检查和访问行为
5. **动态更新**: 支持权限的动态变更,无需重启服务

---

## 权限模型选择建议

| 场景 | 推荐模型 | 原因 |
|-----|---------|------|
| 企业内部系统 | RBAC | 组织结构清晰,角色稳定 |
| SaaS 多租户 | RBAC + 行级权限 | 需要租户隔离 |
| 复杂业务场景 | ABAC | 需要细粒度和动态控制 |
| 简单应用 | RBAC | 实现简单,满足基本需求 |
| 开放平台 | OAuth 2.0 + RBAC | 第三方接入 + 权限控制 |

---

## 面试常见问题

### 1. RBAC 和 ABAC 的区别?
- **RBAC**: 基于角色,适合静态权限场景
- **ABAC**: 基于属性,支持动态和细粒度控制

### 2. JWT 和 Session 的区别?
- **Session**: 有状态,服务端存储,不适合分布式
- **JWT**: 无状态,客户端存储,适合微服务

### 3. 如何实现数据行级权限?
结合 RBAC 和动态查询条件:
```java
// 在查询时添加数据权限过滤
SELECT * FROM orders 
WHERE department_id IN (用户可见的部门ID列表)
```

### 4. 如何防止权限绕过?
- 在服务端验证权限,不依赖前端
- 使用 AOP 或拦截器统一处理
- 对所有 API 进行权限检查
- 记录审计日志

### 5. OAuth 2.0 的四种授权模式?
1. **授权码模式 (Authorization Code)**: 最安全,适合 Web 应用
2. **简化模式 (Implicit)**: 适合纯前端应用
3. **密码模式 (Password)**: 适合信任的第一方应用
4. **客户端模式 (Client Credentials)**: 适合服务间调用

---

## 总结

- **RBAC**: 简单实用,适合大多数场景
- **ABAC**: 灵活强大,适合复杂需求
- **Authentication**: 身份验证,确认"你是谁"
- **Authorization**: 权限授权,确定"你能做什么"

选择合适的权限模型,需要根据业务复杂度、团队技术栈和性能要求综合考虑。
