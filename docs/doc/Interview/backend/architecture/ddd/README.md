---
title: DDD 领域驱动设计
createTime: 2026/02/04 00:00:00
permalink: /doc/Interview/backend/architecture/ddd/
---

# DDD 领域驱动设计 (Domain-Driven Design)

DDD 是一种软件设计方法论,强调将业务领域的复杂性通过领域模型来管理,是复杂业务系统架构的最佳实践之一。

## 核心概念

DDD 的核心思想是:
1. **领域模型优先**: 业务逻辑集中在领域模型中
2. **统一语言**: 开发人员和业务专家使用相同的术语
3. **分层架构**: 清晰的职责划分
4. **领域隔离**: 通过限界上下文隔离不同的子域

---

## 1. DDD 分层架构

### 标准四层架构

```
┌─────────────────────────────────────┐
│     用户界面层 (User Interface)      │  ← Controller, DTO, VO
├─────────────────────────────────────┤
│     应用层 (Application Layer)       │  ← ApplicationService, 编排
├─────────────────────────────────────┤
│     领域层 (Domain Layer)            │  ← Entity, ValueObject, 
│                                     │     DomainService, Repository接口
├─────────────────────────────────────┤
│     基础设施层 (Infrastructure)      │  ← RepositoryImpl, 外部服务
└─────────────────────────────────────┘
```

### 项目结构示例

```
com.example.order/
├── interfaces/              # 用户界面层
│   ├── dto/                # 数据传输对象
│   ├── assembler/          # DTO 转换器
│   └── facade/             # 对外接口/Controller
│       └── OrderController.java
│
├── application/            # 应用层
│   ├── service/           # 应用服务
│   │   └── OrderApplicationService.java
│   └── event/             # 应用事件
│
├── domain/                # 领域层 (核心)
│   ├── model/            # 领域模型
│   │   ├── order/        # 订单聚合
│   │   │   ├── Order.java              # 聚合根
│   │   │   ├── OrderItem.java          # 实体
│   │   │   ├── OrderStatus.java        # 值对象
│   │   │   └── OrderId.java            # 标识符
│   │   └── customer/     # 客户聚合
│   ├── service/          # 领域服务
│   │   └── PricingService.java
│   ├── repository/       # 仓储接口
│   │   └── OrderRepository.java
│   └── event/            # 领域事件
│       └── OrderCreatedEvent.java
│
└── infrastructure/        # 基础设施层
    ├── persistence/      # 持久化实现
    │   ├── po/          # 持久化对象
    │   └── repository/  # 仓储实现
    │       └── OrderRepositoryImpl.java
    ├── config/          # 配置
    └── client/          # 外部服务客户端
```

---

## 2. 核心概念详解

### 2.1 实体 (Entity)

实体具有唯一标识,生命周期内属性可能变化,但标识不变。

```java
/**
 * 订单实体 - 聚合根
 */
@Getter
public class Order {
    
    // 唯一标识
    private OrderId orderId;
    
    // 客户ID
    private CustomerId customerId;
    
    // 订单项列表
    private List<OrderItem> items;
    
    // 订单状态 (值对象)
    private OrderStatus status;
    
    // 总金额
    private Money totalAmount;
    
    // 创建时间
    private LocalDateTime createdAt;
    
    // 构造函数 - 确保对象创建时处于有效状态
    public Order(CustomerId customerId, List<OrderItem> items) {
        this.orderId = OrderId.generate();
        this.customerId = Objects.requireNonNull(customerId, "客户ID不能为空");
        this.items = new ArrayList<>(items);
        this.status = OrderStatus.PENDING;
        this.createdAt = LocalDateTime.now();
        
        // 业务规则验证
        if (items.isEmpty()) {
            throw new IllegalArgumentException("订单必须包含至少一个商品");
        }
        
        // 计算总金额
        this.calculateTotalAmount();
    }
    
    // 业务方法 - 确认订单
    public void confirm() {
        if (this.status != OrderStatus.PENDING) {
            throw new IllegalStateException("只有待支付订单才能确认");
        }
        this.status = OrderStatus.CONFIRMED;
    }
    
    // 业务方法 - 取消订单
    public void cancel() {
        if (this.status == OrderStatus.COMPLETED) {
            throw new IllegalStateException("已完成的订单不能取消");
        }
        this.status = OrderStatus.CANCELLED;
    }
    
    // 业务方法 - 添加订单项
    public void addItem(OrderItem item) {
        this.items.add(item);
        this.calculateTotalAmount();
    }
    
    // 私有方法 - 计算总金额
    private void calculateTotalAmount() {
        this.totalAmount = items.stream()
            .map(OrderItem::getSubtotal)
            .reduce(Money.ZERO, Money::add);
    }
    
    // 领域事件 - 订单创建
    public OrderCreatedEvent createEvent() {
        return new OrderCreatedEvent(this.orderId, this.customerId, this.totalAmount);
    }
}

/**
 * 订单项实体
 */
@Getter
@AllArgsConstructor
public class OrderItem {
    
    private OrderItemId id;
    private ProductId productId;
    private String productName;
    private Money unitPrice;
    private int quantity;
    
    public Money getSubtotal() {
        return unitPrice.multiply(quantity);
    }
}
```

### 2.2 值对象 (Value Object)

值对象没有唯一标识,由属性值决定相等性,不可变。

```java
/**
 * 金额值对象
 */
@Value
@AllArgsConstructor
public class Money {
    
    public static final Money ZERO = new Money(BigDecimal.ZERO, Currency.CNY);
    
    private BigDecimal amount;
    private Currency currency;
    
    public Money add(Money other) {
        if (this.currency != other.currency) {
            throw new IllegalArgumentException("货币类型不匹配");
        }
        return new Money(this.amount.add(other.amount), this.currency);
    }
    
    public Money multiply(int multiplier) {
        return new Money(this.amount.multiply(BigDecimal.valueOf(multiplier)), this.currency);
    }
    
    public boolean greaterThan(Money other) {
        return this.amount.compareTo(other.amount) > 0;
    }
}

/**
 * 订单状态值对象
 */
public enum OrderStatus {
    PENDING("待支付"),
    CONFIRMED("已确认"),
    SHIPPED("已发货"),
    COMPLETED("已完成"),
    CANCELLED("已取消");
    
    private final String description;
    
    OrderStatus(String description) {
        this.description = description;
    }
    
    public String getDescription() {
        return description;
    }
}

/**
 * 地址值对象
 */
@Value
@AllArgsConstructor
public class Address {
    
    private String province;
    private String city;
    private String district;
    private String street;
    private String zipCode;
    
    public String getFullAddress() {
        return province + city + district + street;
    }
    
    public void validate() {
        if (province == null || city == null || street == null) {
            throw new IllegalArgumentException("地址信息不完整");
        }
    }
}
```

### 2.3 聚合 (Aggregate)

聚合是一组相关对象的集合,作为数据修改的单元,有聚合根控制。

```java
/**
 * 订单聚合根
 */
public class Order {
    
    // 订单ID (聚合根标识)
    private OrderId id;
    
    // 聚合内的实体
    private List<OrderItem> items;
    
    // 聚合内的值对象
    private ShippingAddress shippingAddress;
    private Money totalAmount;
    
    // 聚合根负责维护聚合内对象的一致性
    public void addItem(ProductId productId, int quantity, Money unitPrice) {
        // 业务规则检查
        if (this.status != OrderStatus.PENDING) {
            throw new IllegalStateException("只有待支付订单才能添加商品");
        }
        
        // 检查是否已存在该商品
        Optional<OrderItem> existingItem = findItemByProductId(productId);
        if (existingItem.isPresent()) {
            // 更新数量
            existingItem.get().increaseQuantity(quantity);
        } else {
            // 添加新商品
            OrderItem item = new OrderItem(
                OrderItemId.generate(),
                productId,
                quantity,
                unitPrice
            );
            this.items.add(item);
        }
        
        // 重新计算总金额
        recalculateTotalAmount();
    }
    
    // 聚合根控制对聚合内对象的访问
    public List<OrderItem> getItems() {
        return Collections.unmodifiableList(items);  // 返回不可变列表
    }
    
    private Optional<OrderItem> findItemByProductId(ProductId productId) {
        return items.stream()
            .filter(item -> item.getProductId().equals(productId))
            .findFirst();
    }
    
    private void recalculateTotalAmount() {
        this.totalAmount = items.stream()
            .map(OrderItem::getSubtotal)
            .reduce(Money.ZERO, Money::add);
    }
}
```

### 2.4 仓储 (Repository)

仓储提供聚合的持久化和查询能力,封装数据访问逻辑。

```java
/**
 * 订单仓储接口 (在领域层定义)
 */
public interface OrderRepository {
    
    // 保存聚合
    Order save(Order order);
    
    // 根据ID查询
    Optional<Order> findById(OrderId orderId);
    
    // 根据客户ID查询
    List<Order> findByCustomerId(CustomerId customerId);
    
    // 删除聚合
    void delete(OrderId orderId);
    
    // 生成下一个ID
    OrderId nextId();
}

/**
 * 订单仓储实现 (在基础设施层实现)
 */
@Repository
public class OrderRepositoryImpl implements OrderRepository {
    
    @Autowired
    private OrderJpaRepository jpaRepository;
    
    @Autowired
    private OrderConverter converter;
    
    @Override
    public Order save(Order order) {
        // 领域对象 -> 持久化对象
        OrderPO po = converter.toPO(order);
        
        // 保存到数据库
        OrderPO saved = jpaRepository.save(po);
        
        // 持久化对象 -> 领域对象
        return converter.toDomain(saved);
    }
    
    @Override
    public Optional<Order> findById(OrderId orderId) {
        return jpaRepository.findById(orderId.getValue())
            .map(converter::toDomain);
    }
    
    @Override
    public List<Order> findByCustomerId(CustomerId customerId) {
        return jpaRepository.findByCustomerId(customerId.getValue())
            .stream()
            .map(converter::toDomain)
            .collect(Collectors.toList());
    }
    
    @Override
    public OrderId nextId() {
        return OrderId.generate();
    }
}

/**
 * JPA Repository (数据访问接口)
 */
@Repository
public interface OrderJpaRepository extends JpaRepository<OrderPO, Long> {
    
    List<OrderPO> findByCustomerId(Long customerId);
    
    List<OrderPO> findByStatus(String status);
}
```

### 2.5 领域服务 (Domain Service)

当某个业务逻辑不适合放在单个实体中时,使用领域服务。

```java
/**
 * 订单定价领域服务
 */
@Service
public class OrderPricingService {
    
    @Autowired
    private DiscountRepository discountRepository;
    
    /**
     * 计算订单价格 (涉及多个聚合的业务逻辑)
     */
    public Money calculateOrderPrice(Order order, Customer customer) {
        // 计算商品总价
        Money subtotal = order.getItems().stream()
            .map(OrderItem::getSubtotal)
            .reduce(Money.ZERO, Money::add);
        
        // 获取客户折扣
        Discount discount = discountRepository.findByCustomerLevel(customer.getLevel());
        
        // 应用折扣
        Money discountAmount = subtotal.multiply(discount.getRate());
        Money finalAmount = subtotal.subtract(discountAmount);
        
        // 运费计算
        Money shippingFee = calculateShippingFee(order.getShippingAddress());
        
        return finalAmount.add(shippingFee);
    }
    
    private Money calculateShippingFee(Address address) {
        // 根据地址计算运费
        return new Money(BigDecimal.TEN, Currency.CNY);
    }
}

/**
 * 转账领域服务 (涉及多个聚合)
 */
@Service
public class TransferService {
    
    /**
     * 转账操作涉及两个账户聚合
     */
    @Transactional
    public void transfer(Account fromAccount, Account toAccount, Money amount) {
        // 业务规则验证
        if (amount.lessThanOrEqual(Money.ZERO)) {
            throw new IllegalArgumentException("转账金额必须大于0");
        }
        
        // 扣款
        fromAccount.debit(amount);
        
        // 入账
        toAccount.credit(amount);
        
        // 发布领域事件
        // eventPublisher.publish(new MoneyTransferredEvent(...));
    }
}
```

### 2.6 领域事件 (Domain Event)

领域事件表示领域中发生的重要事情,用于解耦聚合之间的依赖。

```java
/**
 * 订单创建事件
 */
@Getter
@AllArgsConstructor
public class OrderCreatedEvent implements DomainEvent {
    
    private OrderId orderId;
    private CustomerId customerId;
    private Money totalAmount;
    private LocalDateTime occurredOn;
    
    public OrderCreatedEvent(OrderId orderId, CustomerId customerId, Money totalAmount) {
        this.orderId = orderId;
        this.customerId = customerId;
        this.totalAmount = totalAmount;
        this.occurredOn = LocalDateTime.now();
    }
}

/**
 * 事件发布器
 */
@Component
public class DomainEventPublisher {
    
    @Autowired
    private ApplicationEventPublisher eventPublisher;
    
    public void publish(DomainEvent event) {
        eventPublisher.publishEvent(event);
    }
}

/**
 * 事件监听器
 */
@Component
@Slf4j
public class OrderEventListener {
    
    @Autowired
    private InventoryService inventoryService;
    
    @Autowired
    private NotificationService notificationService;
    
    /**
     * 监听订单创建事件 - 扣减库存
     */
    @EventListener
    @Transactional
    public void handleOrderCreated(OrderCreatedEvent event) {
        log.info("订单创建,开始扣减库存: {}", event.getOrderId());
        
        // 扣减库存
        inventoryService.decreaseStock(event.getOrderId());
    }
    
    /**
     * 监听订单创建事件 - 发送通知
     */
    @EventListener
    @Async
    public void sendNotification(OrderCreatedEvent event) {
        log.info("订单创建,发送通知: {}", event.getOrderId());
        
        // 发送通知
        notificationService.notifyCustomer(event.getCustomerId(), "订单创建成功");
    }
}
```

---

## 3. 应用层

应用服务负责编排领域对象,不包含业务逻辑。

```java
/**
 * 订单应用服务
 */
@Service
@Transactional
@Slf4j
public class OrderApplicationService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private CustomerRepository customerRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private OrderPricingService pricingService;
    
    @Autowired
    private DomainEventPublisher eventPublisher;
    
    /**
     * 创建订单
     */
    public OrderId createOrder(CreateOrderCommand command) {
        // 1. 获取客户
        Customer customer = customerRepository.findById(command.getCustomerId())
            .orElseThrow(() -> new CustomerNotFoundException());
        
        // 2. 构建订单项
        List<OrderItem> items = command.getItems().stream()
            .map(item -> {
                Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new ProductNotFoundException());
                
                return new OrderItem(
                    OrderItemId.generate(),
                    product.getId(),
                    product.getName(),
                    product.getPrice(),
                    item.getQuantity()
                );
            })
            .collect(Collectors.toList());
        
        // 3. 创建订单聚合
        Order order = new Order(customer.getId(), items);
        order.setShippingAddress(command.getShippingAddress());
        
        // 4. 计算价格 (领域服务)
        Money finalPrice = pricingService.calculateOrderPrice(order, customer);
        order.setTotalAmount(finalPrice);
        
        // 5. 保存订单
        order = orderRepository.save(order);
        
        // 6. 发布领域事件
        eventPublisher.publish(order.createEvent());
        
        log.info("订单创建成功: {}", order.getId());
        
        return order.getId();
    }
    
    /**
     * 确认订单
     */
    public void confirmOrder(OrderId orderId) {
        // 1. 获取订单
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new OrderNotFoundException());
        
        // 2. 执行业务逻辑 (在聚合根中)
        order.confirm();
        
        // 3. 保存
        orderRepository.save(order);
        
        // 4. 发布事件
        eventPublisher.publish(new OrderConfirmedEvent(orderId));
    }
    
    /**
     * 查询订单
     */
    @Transactional(readOnly = true)
    public OrderDTO getOrder(OrderId orderId) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new OrderNotFoundException());
        
        return OrderAssembler.toDTO(order);
    }
}

/**
 * 创建订单命令
 */
@Data
public class CreateOrderCommand {
    private CustomerId customerId;
    private List<OrderItemCommand> items;
    private Address shippingAddress;
}

@Data
class OrderItemCommand {
    private ProductId productId;
    private int quantity;
}
```

---

## 4. 接口层 (用户界面层)

```java
/**
 * 订单控制器
 */
@RestController
@RequestMapping("/api/orders")
@Slf4j
public class OrderController {
    
    @Autowired
    private OrderApplicationService orderService;
    
    /**
     * 创建订单
     */
    @PostMapping
    public Result<OrderId> createOrder(@RequestBody @Valid CreateOrderRequest request) {
        // 请求 -> 命令
        CreateOrderCommand command = OrderAssembler.toCommand(request);
        
        // 执行业务
        OrderId orderId = orderService.createOrder(command);
        
        return Result.success(orderId);
    }
    
    /**
     * 查询订单
     */
    @GetMapping("/{orderId}")
    public Result<OrderDTO> getOrder(@PathVariable Long orderId) {
        OrderDTO order = orderService.getOrder(new OrderId(orderId));
        return Result.success(order);
    }
    
    /**
     * 确认订单
     */
    @PostMapping("/{orderId}/confirm")
    public Result<Void> confirmOrder(@PathVariable Long orderId) {
        orderService.confirmOrder(new OrderId(orderId));
        return Result.success();
    }
}

/**
 * DTO 转换器
 */
public class OrderAssembler {
    
    public static CreateOrderCommand toCommand(CreateOrderRequest request) {
        CreateOrderCommand command = new CreateOrderCommand();
        command.setCustomerId(new CustomerId(request.getCustomerId()));
        command.setShippingAddress(new Address(/* ... */));
        command.setItems(request.getItems().stream()
            .map(item -> {
                OrderItemCommand itemCommand = new OrderItemCommand();
                itemCommand.setProductId(new ProductId(item.getProductId()));
                itemCommand.setQuantity(item.getQuantity());
                return itemCommand;
            })
            .collect(Collectors.toList()));
        return command;
    }
    
    public static OrderDTO toDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setOrderId(order.getId().getValue());
        dto.setStatus(order.getStatus().name());
        dto.setTotalAmount(order.getTotalAmount().getAmount());
        // ...
        return dto;
    }
}
```

---

## 5. DDD 最佳实践

### 5.1 聚合设计原则

1. **在边界内保护业务规则**: 所有修改必须通过聚合根
2. **小聚合优于大聚合**: 减少并发冲突
3. **通过ID引用其他聚合**: 不要直接持有其他聚合的引用
4. **使用最终一致性**: 跨聚合的一致性通过事件实现

```java
// ❌ 错误示例: 聚合间直接引用
public class Order {
    private Customer customer;  // 不要直接引用其他聚合
}

// ✅ 正确示例: 通过ID引用
public class Order {
    private CustomerId customerId;  // 通过ID引用
}
```

### 5.2 值对象不可变

```java
// ✅ 正确: 不可变值对象
@Value  // Lombok 的 @Value 注解会生成不可变类
public class Money {
    private BigDecimal amount;
    private Currency currency;
    
    public Money add(Money other) {
        return new Money(this.amount.add(other.amount), this.currency);
    }
}

// ❌ 错误: 可变值对象
public class Money {
    private BigDecimal amount;
    
    public void setAmount(BigDecimal amount) {  // 不应该有 setter
        this.amount = amount;
    }
}
```

### 5.3 充血模型 vs 贫血模型

```java
// ❌ 贫血模型: 只有数据,没有行为
public class Order {
    private Long id;
    private String status;
    private BigDecimal amount;
    
    // 只有 getter/setter
}

public class OrderService {
    public void confirmOrder(Order order) {
        order.setStatus("CONFIRMED");  // 业务逻辑在服务中
    }
}

// ✅ 充血模型: 数据 + 行为
public class Order {
    private OrderId id;
    private OrderStatus status;
    private Money amount;
    
    // 业务方法封装在实体中
    public void confirm() {
        if (this.status != OrderStatus.PENDING) {
            throw new IllegalStateException("只有待支付订单才能确认");
        }
        this.status = OrderStatus.CONFIRMED;
    }
}
```

---

## 6. DDD 与微服务

### 限界上下文 (Bounded Context)

每个微服务对应一个限界上下文,拥有独立的领域模型。

```
订单上下文 (Order Context)
├── Order (订单)
├── OrderItem (订单项)
└── ShippingAddress (收货地址)

用户上下文 (User Context)
├── User (用户)
├── UserProfile (用户资料)
└── Address (地址)

库存上下文 (Inventory Context)
├── Product (商品)
├── Stock (库存)
└── Warehouse (仓库)
```

### 上下文映射 (Context Mapping)

不同上下文通过事件和API通信。

```java
// 订单上下文发布事件
public class OrderService {
    public void createOrder(CreateOrderCommand command) {
        Order order = new Order(/* ... */);
        orderRepository.save(order);
        
        // 发布事件到消息队列
        eventPublisher.publish(new OrderCreatedEvent(order.getId()));
    }
}

// 库存上下文监听事件
@Component
public class InventoryEventListener {
    
    @KafkaListener(topics = "order-created")
    public void handleOrderCreated(OrderCreatedEvent event) {
        // 扣减库存
        inventoryService.decreaseStock(event.getOrderId());
    }
}
```

---

## 面试常见问题

### 1. DDD 和传统三层架构的区别?
- **传统三层**: 以数据库为中心,贫血模型
- **DDD**: 以领域模型为中心,充血模型,业务逻辑在领域层

### 2. 什么时候使用 DDD?
- 业务逻辑复杂
- 需要长期维护演进
- 团队对业务理解深入
- 不适合 CRUD 型简单应用

### 3. 实体和值对象的区别?
- **实体**: 有唯一标识,可变,关注连续性
- **值对象**: 无标识,不可变,关注描述性

### 4. 聚合的边界如何划分?
- 遵循事务一致性边界
- 一个聚合对应一个事务
- 通过领域事件实现跨聚合一致性

### 5. DDD 如何与微服务结合?
- 一个微服务对应一个限界上下文
- 通过事件实现上下文间通信
- 每个上下文有独立的数据库

---

## 总结

DDD 核心要点:

1. **分层架构**: 用户界面层 → 应用层 → 领域层 → 基础设施层
2. **核心概念**: 实体、值对象、聚合、仓储、领域服务、领域事件
3. **设计原则**: 充血模型、小聚合、ID引用、最终一致性
4. **适用场景**: 复杂业务系统、微服务架构
5. **统一语言**: 技术人员和业务人员使用相同术语

DDD 不是银弹,但对于复杂业务系统是非常有效的架构方法。
