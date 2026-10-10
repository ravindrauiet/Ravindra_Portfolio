export const lecture15 = {
  slug: "lecture-15",
  number: 15,
  title: "Complete Java Course — Lecture 15: Spring Data JPA, Spring Security with JWT & Deployment",
  summary: "Learn Spring Data JPA and Hibernate (entities, relationships, derived queries, pagination, the N+1 problem, Flyway migrations), then secure your Spring Boot REST API with Spring Security, BCrypt and JWT authentication, and finally package a jar, build a Docker image and deploy to production with a checklist and interview questions.",
  readTime: "55 min read",
  difficulty: "Advanced",
  date: "2026-10-09",
  sections: [
    {
      heading: "1. Introduction: From a REST Controller to a Production-Ready Spring Boot Application",
      content: `In Lecture 14 you built REST APIs with Spring Boot: controllers, request mapping, validation, exception handling and testing. But those APIs stored data in memory and anyone on the internet could call them. A real backend needs three more things, and this final lecture covers all of them end to end: **persistence** (storing data in a relational database with Spring Data JPA and Hibernate), **security** (authenticating users with Spring Security and JSON Web Tokens) and **deployment** (packaging the app as a jar, putting it in a Docker image and running it in production).
This is the lecture that turns course knowledge into job-ready skills. Almost every Java backend job description in India — from service companies in Bengaluru and Pune to product startups and fintechs — lists Spring Boot, Spring Data JPA, Spring Security, JWT and Docker. Interviewers ask about the N+1 problem, lazy loading, the Spring Security filter chain, how JWT differs from sessions, and how you would deploy a service. By the end of this lecture you will have built and secured a complete Task Manager API and know how to ship it.
**Versions used in this lecture (verified October 2026):**
• **Java 25** is the current LTS (September 2025); Java 21 is the previous LTS. Spring Boot 4 requires Java 17 or later, so both work; examples here compile on Java 21 and 25.
• **Spring Boot 4.x** — 4.0 shipped in November 2025 on Spring Framework 7, Spring Security 7, Jakarta EE 11 and Hibernate ORM 7; 4.1.1 (August 2026) is the latest release at the time of writing. Starters were modularised: the web starter is now \`spring-boot-starter-webmvc\` and Flyway has its own \`spring-boot-starter-flyway\`.
• **Spring Security 7** supports only the lambda configuration DSL; \`and()\`, \`authorizeRequests()\` and \`antMatchers()\` are gone.
• **JJWT 0.12.x** for token creation and parsing, with the Gson module so it stays independent of Spring Boot 4's move to Jackson 3.
• **PostgreSQL 16+** as the database and **Docker** for packaging. Everything also works with MySQL with minor SQL changes.
The lecture is long, so keep a project open and type the examples as you go. Each concept builds on the previous one, and the hands-on exercise at the end combines all of them into one runnable application.`,
      codeSnippet: `<!-- pom.xml — dependencies used throughout this lecture (Spring Boot 4.x) -->
<project xmlns="http://maven.apache.org/POM/4.0.0">
  <modelVersion>4.0.0</modelVersion>
  <parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>4.1.1</version>
  </parent>
  <groupId>in.ravindra</groupId>
  <artifactId>taskmanager</artifactId>
  <version>1.0.0</version>
  <properties>
    <java.version>25</java.version>   <!-- or 21; Spring Boot 4 needs 17+ -->
    <jjwt.version>0.12.6</jjwt.version>
  </properties>
  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-webmvc</artifactId>   <!-- was starter-web in Boot 3 -->
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-flyway</artifactId>
    </dependency>
    <dependency>
      <groupId>org.flywaydb</groupId>
      <artifactId>flyway-database-postgresql</artifactId>   <!-- DB-specific Flyway module -->
    </dependency>
    <dependency>
      <groupId>org.postgresql</groupId>
      <artifactId>postgresql</artifactId>
      <scope>runtime</scope>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-actuator</artifactId>
    </dependency>
    <!-- JJWT: api + impl + a JSON module. Gson avoids the Jackson 2 vs Jackson 3 clash in Boot 4 -->
    <dependency>
      <groupId>io.jsonwebtoken</groupId>
      <artifactId>jjwt-api</artifactId>
      <version>\${jjwt.version}</version>
    </dependency>
    <dependency>
      <groupId>io.jsonwebtoken</groupId>
      <artifactId>jjwt-impl</artifactId>
      <version>\${jjwt.version}</version>
      <scope>runtime</scope>
    </dependency>
    <dependency>
      <groupId>io.jsonwebtoken</groupId>
      <artifactId>jjwt-gson</artifactId>
      <version>\${jjwt.version}</version>
      <scope>runtime</scope>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-test</artifactId>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>org.springframework.security</groupId>
      <artifactId>spring-security-test</artifactId>
      <scope>test</scope>
    </dependency>
  </dependencies>
  <build>
    <plugins>
      <plugin>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-maven-plugin</artifactId>
      </plugin>
    </plugins>
  </build>
</project>`
    },
    {
      heading: "2. JPA and Hibernate Basics: Entities, the Persistence Context and the Entity Lifecycle",
      content: `**JPA (Jakarta Persistence API)** is a specification — a set of interfaces and annotations such as \`@Entity\`, \`@Id\` and \`EntityManager\` — that describes how Java objects map to relational tables. **Hibernate ORM** is the most popular implementation of that specification and is what Spring Boot uses by default (Hibernate ORM 7 with Spring Boot 4). **Spring Data JPA** sits on top of both and removes the boilerplate: you declare a repository interface and Spring generates the implementation. Think of it as three layers: Spring Data JPA (repositories) → JPA (the contract) → Hibernate (the engine that writes SQL).
**Why ORM matters.** Without it, every feature means hand-written SQL, manual \`ResultSet\` mapping and manual transaction handling. With JPA, you work with plain Java objects, and Hibernate generates the \`INSERT\`, \`UPDATE\` and \`SELECT\` statements, tracks changes and manages the connection. The trade-off: you must understand what happens underneath, or you will write code that fires hundreds of queries without noticing (Section 6).
**The persistence context** is the heart of JPA. It is a first-level cache owned by an \`EntityManager\` that lives for the duration of a transaction. Every entity loaded or saved inside the transaction is **managed**: Hibernate keeps a snapshot of it and, at commit time, compares the current state with the snapshot. Any difference becomes an \`UPDATE\` automatically. This is called **dirty checking**, and it is why a \`@Transactional\` method that calls \`product.setPrice(...)\` updates the database without calling \`save()\`.
**Entity lifecycle states:**
• **Transient** — a new object created with \`new\`; the database knows nothing about it.
• **Managed (persistent)** — attached to a persistence context after \`persist()\`, \`find()\` or a query. Changes are tracked.
• **Detached** — the persistence context closed (the transaction ended) but the object is still in memory. Changes are not tracked; calling a lazy getter now throws \`LazyInitializationException\`.
• **Removed** — scheduled for \`DELETE\` at flush.
**Key annotations:** \`@Entity\` marks a class, \`@Table\` names the table, \`@Id\` plus \`@GeneratedValue(strategy = GenerationType.IDENTITY)\` uses the database auto-increment column (PostgreSQL \`bigserial\`, MySQL \`AUTO_INCREMENT\`), \`@Column\` customises the column, \`@Version\` enables optimistic locking, \`@Enumerated(EnumType.STRING)\` stores enums by name (never by ordinal — reordering the enum would corrupt data), and \`@PrePersist\`/\`@PreUpdate\` are lifecycle callbacks. JPA requires a no-argument constructor (it may be \`protected\`) because Hibernate instantiates entities reflectively.`,
      codeSnippet: `// src/main/java/in/ravindra/shop/product/Product.java
package in.ravindra.shop.product;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Enumerated(EnumType.STRING)          // stores "ACTIVE", never 0/1
    @Column(nullable = false, length = 20)
    private ProductStatus status = ProductStatus.ACTIVE;

    @Version                              // optimistic locking: UPDATE ... WHERE id=? AND version=?
    private Long version;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected Product() { }               // required by JPA

    public Product(String name, BigDecimal price) {
        this.name = name;
        this.price = price;
    }

    @PrePersist
    void onCreate() { this.createdAt = Instant.now(); }

    public Long getId() { return id; }
    public String getName() { return name; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public ProductStatus getStatus() { return status; }
    public void setStatus(ProductStatus status) { this.status = status; }
}

enum ProductStatus { ACTIVE, DISCONTINUED }

// src/main/java/in/ravindra/shop/product/ProductService.java
package in.ravindra.shop.product;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class ProductService {
    private final ProductRepository repo;
    public ProductService(ProductRepository repo) { this.repo = repo; }

    @Transactional
    public void applyDiscount(Long id, int percent) {
        Product p = repo.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));   // p is MANAGED
        BigDecimal factor = BigDecimal.valueOf(100 - percent).movePointLeft(2);
        p.setPrice(p.getPrice().multiply(factor).setScale(2, RoundingMode.HALF_UP));
        // no repo.save(p) needed: dirty checking issues
        // UPDATE products SET price=?, version=? WHERE id=? AND version=? at commit
    }
}

// application.yml snippet to SEE the SQL while learning (turn off in production)
// spring:
//   jpa:
//     show-sql: true
//     properties:
//       hibernate.format_sql: true`
    },
    {
      heading: "3. JPA Entity Relationships: @ManyToOne, @OneToMany, @ManyToMany, Owning Side and Cascades",
      content: `Real data is connected: a customer places many orders, an order has many items, a product belongs to many categories. JPA models these as relationships, and understanding **which side owns the foreign key** is the single most important rule.
**@ManyToOne** is the simplest and most common mapping. The entity with the foreign key column (\`orders.customer_id\`) declares \`@ManyToOne @JoinColumn(name = "customer_id")\`. This side is always the **owning side** — Hibernate writes the foreign key based on it.
**@OneToMany(mappedBy = "customer")** is the inverse side: a \`List<Order> orders\` on \`Customer\`. \`mappedBy\` tells Hibernate "the mapping is defined by the \`customer\` field on \`Order\`; do not create a join table". If you forget \`mappedBy\`, Hibernate creates an unnecessary \`customers_orders\` join table — a classic beginner bug. Setting \`customer.getOrders().add(order)\` alone does **not** write the foreign key; you must also set \`order.setCustomer(customer)\`. That is why we write helper methods like \`addOrder()\` that keep both sides in sync.
**@ManyToMany** uses a join table (\`product_tags\`) declared with \`@JoinTable\`. In practice many teams avoid \`@ManyToMany\` and model the join table as its own entity (\`OrderItem\` with \`quantity\` and \`unitPrice\`), because join tables almost always grow extra columns.
**Cascade and orphan removal.** \`cascade = CascadeType.ALL\` propagates \`persist\`, \`merge\` and \`remove\` from parent to children, so saving an \`Order\` saves its items. \`orphanRemoval = true\` deletes an item when it is removed from the collection. Use cascades only for true parent–child ownership (Order → OrderItem). Never cascade \`REMOVE\` from \`Order\` to \`Customer\` — deleting one order would delete the customer.
**Fetch types.** \`@ManyToOne\` and \`@OneToOne\` default to **EAGER**; \`@OneToMany\` and \`@ManyToMany\` default to **LAZY**. Always set \`fetch = FetchType.LAZY\` explicitly on \`@ManyToOne\` as well; eager loading on every association is the main source of the N+1 problem (Section 6).
**equals and hashCode.** Do not use Lombok's \`@Data\` on entities. Generated \`hashCode\` over all fields (including lazy collections) causes stack overflows and broken \`Set\` semantics once the id changes from \`null\` to a value. Either skip overriding them, or base \`equals\` on the id when it is non-null.`,
      codeSnippet: `// src/main/java/in/ravindra/shop/order/Customer.java
package in.ravindra.shop.order;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "customers")
public class Customer {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    private String city;                                   // e.g. "Patna", "Hyderabad"

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Order> orders = new ArrayList<>();        // inverse side, LAZY by default

    protected Customer() { }
    public Customer(String email, String city) { this.email = email; this.city = city; }

    public void addOrder(Order order) {                    // keep both sides in sync
        orders.add(order);
        order.setCustomer(this);
    }
    public Long getId() { return id; }
    public String getEmail() { return email; }
    public List<Order> getOrders() { return orders; }
}

// src/main/java/in/ravindra/shop/order/Order.java
package in.ravindra.shop.order;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")                                    // "order" is an SQL keyword
public class Order {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)   // OWNING side: has the FK column
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Enumerated(EnumType.STRING) @Column(nullable = false)
    private OrderStatus status = OrderStatus.NEW;

    @Column(name = "total_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    protected Order() { }
    public Order(Customer customer) { this.customer = customer; }

    public void addItem(String productName, int qty, BigDecimal unitPrice) {
        OrderItem item = new OrderItem(this, productName, qty, unitPrice);
        items.add(item);
        totalAmount = totalAmount.add(unitPrice.multiply(BigDecimal.valueOf(qty)));
    }
    void setCustomer(Customer customer) { this.customer = customer; }
    public Long getId() { return id; }
    public Customer getCustomer() { return customer; }
    public OrderStatus getStatus() { return status; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public List<OrderItem> getItems() { return items; }
}

enum OrderStatus { NEW, PAID, SHIPPED, CANCELLED }

// src/main/java/in/ravindra/shop/order/OrderItem.java
package in.ravindra.shop.order;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
public class OrderItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(name = "product_name", nullable = false)
    private String productName;
    private int quantity;
    @Column(name = "unit_price", precision = 10, scale = 2)
    private BigDecimal unitPrice;

    protected OrderItem() { }
    OrderItem(Order order, String productName, int quantity, BigDecimal unitPrice) {
        this.order = order; this.productName = productName;
        this.quantity = quantity; this.unitPrice = unitPrice;
    }
    public String getProductName() { return productName; }
    public int getQuantity() { return quantity; }
}

// Usage inside a @Transactional service method:
// Customer c = new Customer("asha@example.in", "Pune");
// Order o = new Order(c);
// o.addItem("Mechanical keyboard", 1, new BigDecimal("3499.00"));
// c.addOrder(o);
// customerRepository.save(c);   // cascades: INSERT customers, INSERT orders, INSERT order_items`
    },
    {
      heading: "4. Spring Data JPA Repositories and Derived Queries: JpaRepository, @Query and Projections",
      content: `A **Spring Data repository** is an interface you declare; Spring creates a proxy implementation at startup. Extending \`JpaRepository<Order, Long>\` gives you \`save\`, \`saveAll\`, \`findById\`, \`findAll\`, \`count\`, \`existsById\`, \`deleteById\`, \`flush\` and more without writing a line of implementation code. The two type parameters are the entity type and the type of its \`@Id\`.
**Derived queries** are the feature everyone loves in interviews: Spring parses the **method name** and generates the JPQL. \`findByStatus(OrderStatus status)\` becomes \`select o from Order o where o.status = ?1\`. The grammar is: prefix (\`find…By\`, \`count…By\`, \`exists…By\`, \`delete…By\`), optional limiter (\`Top5\`, \`First\`, \`Distinct\`), then property expressions joined with \`And\`/\`Or\`, with operators such as \`GreaterThan\`, \`LessThanEqual\`, \`Between\`, \`Like\`, \`Containing\`, \`StartingWith\`, \`IgnoreCase\`, \`In\`, \`IsNull\`, \`True\`/\`False\`, and an \`OrderBy…Desc\` suffix. You can traverse associations: \`findByCustomer_Email(String email)\` joins through the \`customer\` relationship. If a property name in the method does not exist on the entity, the application **fails at startup** with a clear error, which is far better than failing at runtime.
**When to switch to @Query.** Derived names become unreadable beyond three conditions. Then write JPQL (entity-oriented, portable across databases) with \`@Query\`, using named parameters \`:status\`. For database-specific SQL use \`nativeQuery = true\`. Updates and deletes need \`@Modifying\` and must run inside a transaction.
**Return types.** Use \`Optional<T>\` for single results that may be absent, \`List<T>\` for collections, \`long\` for counts, \`boolean\` for exists checks, and \`Page<T>\`/\`Slice<T>\` for pagination. Return a **projection** (an interface with getters, or a Java record via a JPQL constructor expression) when the API needs only a few columns — this avoids loading whole entities and their associations.
**Transactions.** Repository methods are transactional by default (read-only for queries). Your own service methods that perform several repository calls should be annotated \`@Transactional\` so they execute atomically and share one persistence context — otherwise each call opens and closes its own transaction and lazy associations break.`,
      codeSnippet: `// src/main/java/in/ravindra/shop/order/OrderRepository.java
package in.ravindra.shop.order;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

    // ---- derived queries: Spring generates the JPQL from the method name ----
    List<Order> findByStatus(OrderStatus status);
    List<Order> findByCustomer_EmailIgnoreCase(String email);          // joins customer
    List<Order> findByStatusAndTotalAmountGreaterThan(OrderStatus status, BigDecimal min);
    List<Order> findTop5ByOrderByCreatedAtDesc();                      // latest 5 orders
    long countByStatus(OrderStatus status);
    boolean existsByCustomer_IdAndStatus(Long customerId, OrderStatus status);
    Optional<Order> findFirstByCustomer_IdOrderByCreatedAtDesc(Long customerId);

    // ---- JPQL when the name would get too long ----
    @Query("""
           select o from Order o
           where o.status = :status
             and o.createdAt between :from and :to
           order by o.totalAmount desc
           """)
    List<Order> findHighValueInPeriod(@Param("status") OrderStatus status,
                                      @Param("from") Instant from,
                                      @Param("to") Instant to);

    // ---- projection: only the columns the report needs ----
    @Query("""
           select new in.ravindra.shop.order.CityRevenue(c.city, sum(o.totalAmount))
           from Order o join o.customer c
           where o.status = 'PAID'
           group by c.city
           order by sum(o.totalAmount) desc
           """)
    List<CityRevenue> revenueByCity();

    // ---- bulk update: needs @Modifying and a transaction ----
    @Modifying
    @Query("update Order o set o.status = 'CANCELLED' where o.status = 'NEW' and o.createdAt < :cutoff")
    int cancelStaleOrders(@Param("cutoff") Instant cutoff);

    // ---- native SQL when you need a database-specific feature ----
    @Query(value = "select * from orders where created_at::date = current_date", nativeQuery = true)
    List<Order> todaysOrders();
}

// src/main/java/in/ravindra/shop/order/CityRevenue.java
package in.ravindra.shop.order;
import java.math.BigDecimal;
public record CityRevenue(String city, BigDecimal revenue) { }

// Sample output of revenueByCity() for a seeded database:
// [CityRevenue[city=Bengaluru, revenue=184250.00],
//  CityRevenue[city=Pune, revenue=97300.00],
//  CityRevenue[city=Patna, revenue=41900.00]]`
    },
    {
      heading: "5. Pagination and Sorting with Spring Data JPA: Pageable, Page and Slice",
      content: `Returning \`findAll()\` from an endpoint is fine with 50 rows and a disaster with 5 million. **Pagination** returns one slice of results at a time, and Spring Data makes it a one-line change: add a \`Pageable\` parameter to any repository method and return \`Page<T>\`.
**Pageable** describes what you want: page number (zero-based), page size and sorting, built with \`PageRequest.of(page, size, Sort.by("createdAt").descending())\`. **Page<T>** is what you get back: the content plus \`getTotalElements()\`, \`getTotalPages()\`, \`getNumber()\`, \`hasNext()\`. To fill the totals Spring runs **two queries**: the data query with \`limit\`/\`offset\` and a \`select count(*)\`. For an infinite-scroll UI that only needs to know "is there more?", return \`Slice<T>\` instead — it fetches \`size + 1\` rows and skips the count query, which is noticeably cheaper on large tables.
**In the controller**, Spring MVC can bind \`?page=1&size=20&sort=createdAt,desc\` directly to a \`Pageable\` method parameter. Two production rules: **cap the page size** (a client asking for \`size=100000\` must get at most, say, 100 — set \`spring.data.web.pageable.max-page-size=100\`) and **never expose the \`Page\` object directly** to the JSON response, because its serialised shape is not a stable API. Spring Data even logs a warning about this. Map it to your own \`PageResponse\` record.
**Sorting safety.** Sorting by a client-supplied property name is safe with JPQL (an unknown property throws \`PropertyReferenceException\`, which you translate to 400), but with native queries you must whitelist sortable columns yourself.
**Offset vs keyset pagination.** \`offset 1000000 limit 20\` makes the database scan and discard a million rows. For very large tables or feeds, use **keyset (seek) pagination**: \`where createdAt < :lastSeen order by createdAt desc limit 20\`. Spring Data also supports this via \`ScrollPosition.keyset()\` with \`Window<T>\` since Spring Data 3.1, but the manual JPQL version is easy to understand and works everywhere.`,
      codeSnippet: `// OrderRepository additions
Page<Order> findByStatus(OrderStatus status, Pageable pageable);
Slice<Order> findByCustomer_Id(Long customerId, Pageable pageable);   // no count query

// keyset pagination for a feed: "give me 20 orders older than the last one I saw"
@Query("select o from Order o where o.createdAt < :before order by o.createdAt desc")
List<Order> findOlderThan(@Param("before") Instant before, Pageable limit);

// src/main/java/in/ravindra/shop/order/PageResponse.java
package in.ravindra.shop.order;
import java.util.List;
import org.springframework.data.domain.Page;

public record PageResponse<T>(List<T> items, int page, int size, long totalElements, int totalPages, boolean hasNext) {
    public static <T> PageResponse<T> from(Page<T> p) {
        return new PageResponse<>(p.getContent(), p.getNumber(), p.getSize(),
                p.getTotalElements(), p.getTotalPages(), p.hasNext());
    }
}

// src/main/java/in/ravindra/shop/order/OrderController.java
package in.ravindra.shop.order;

import org.springframework.data.domain.*;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderRepository orders;
    public OrderController(OrderRepository orders) { this.orders = orders; }

    // GET /api/orders?status=PAID&page=0&size=20&sort=createdAt,desc
    @GetMapping
    public PageResponse<OrderSummary> list(
            @RequestParam(defaultValue = "PAID") OrderStatus status,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<OrderSummary> page = orders.findByStatus(status, pageable)
                .map(o -> new OrderSummary(o.getId(), o.getTotalAmount(), o.getStatus()));
        return PageResponse.from(page);
    }
}

record OrderSummary(Long id, java.math.BigDecimal total, OrderStatus status) { }

// application.yml
// spring:
//   data:
//     web:
//       pageable:
//         max-page-size: 100      # size=5000 from a client is silently capped to 100
//
// Response for page=0&size=2:
// {"items":[{"id":42,"total":3499.00,"status":"PAID"},{"id":41,"total":899.00,"status":"PAID"}],
//  "page":0,"size":2,"totalElements":57,"totalPages":29,"hasNext":true}`
    },
    {
      heading: "6. The N+1 Problem in Hibernate and Fetch Strategies: LAZY vs EAGER, JOIN FETCH, @EntityGraph and Batch Fetching",
      content: `The **N+1 select problem** is the most common performance bug in JPA applications and the most common JPA interview question. It happens when you load N parent rows with one query and then, while iterating, touch a lazy association on each one — triggering N additional queries. Loading 100 orders and printing each customer's email runs **1 + 100 = 101 SQL statements**. On a laptop with a local database you will not notice; in production with a 2 ms network round trip it adds 200 ms per request, and with 10,000 rows the endpoint times out.
**Why it happens.** With \`fetch = FetchType.LAZY\`, Hibernate puts a **proxy** in the \`customer\` field. The first call to \`order.getCustomer().getEmail()\` initialises the proxy with \`select ... from customers where id = ?\`. EAGER is not the fix: \`EAGER\` on \`@ManyToOne\` makes Hibernate load the customer **every time** an order is loaded anywhere in the app, even in code paths that never need it, and EAGER on collections multiplies queries in the same way when you use JPQL instead of \`findById\`.
**Four fixes, in order of preference:**
1. **JOIN FETCH in JPQL** — \`select o from Order o join fetch o.customer where ...\` loads orders and customers in one SQL join. Use \`distinct\` (or \`Set\`) when fetching a collection to avoid duplicate parents. Do not join-fetch two collections at once; Hibernate throws \`MultipleBagFetchException\` for two \`List\`s.
2. **@EntityGraph** — declarative version: \`@EntityGraph(attributePaths = {"customer", "items"})\` on a repository method, including derived ones. Great when the same query needs different fetch plans in different endpoints.
3. **Batch fetching** — \`spring.jpa.properties.hibernate.default_batch_fetch_size=50\` tells Hibernate to load lazy associations for up to 50 parents with one \`where id in (?, ?, ...)\` query. This turns 101 queries into 3 without changing any code. Set it globally; it is one of the best-value lines in any Spring Boot config.
4. **DTO projections** — for read-only screens, select exactly the columns you need (Section 4). No entities, no proxies, no N+1.
**Pair this with \`spring.jpa.open-in-view=false\`.** By default Spring Boot keeps the persistence context open for the whole HTTP request (Open Session In View), which hides \`LazyInitializationException\` but lets controllers and JSON serialisation silently trigger N+1 queries and hold database connections while the response is written. Spring Boot logs a warning on startup if you have not set it. Disable it, keep lazy loading inside \`@Transactional\` service methods, and return DTOs from controllers.
**How to detect it:** enable \`show-sql\` in development and count the statements; in tests use Hibernate statistics (\`hibernate.generate_statistics=true\` then \`sessionFactory.getStatistics().getPrepareStatementCount()\`) and assert the count.`,
      codeSnippet: `// 1) The bug: 1 query for orders + 1 query per order for the customer
@Transactional(readOnly = true)
public List<String> emailsOfPaidOrdersSlow() {
    return orderRepository.findByStatus(OrderStatus.PAID).stream()   // select ... from orders
            .map(o -> o.getCustomer().getEmail())                      // select ... from customers where id=?  (x N)
            .toList();
}
// Hibernate log for 100 paid orders: 101 statements

// 2) Fix A: JOIN FETCH
@Query("select o from Order o join fetch o.customer where o.status = :status")
List<Order> findWithCustomerByStatus(@Param("status") OrderStatus status);
// 1 statement: select o.*, c.* from orders o inner join customers c on c.id = o.customer_id where o.status=?

// 3) Fix B: @EntityGraph on a derived query (also works for collections)
@EntityGraph(attributePaths = {"customer", "items"})
List<Order> findDistinctByStatus(OrderStatus status);

// 4) Fix C: global batch fetching (no code change) — application.yml
// spring:
//   jpa:
//     open-in-view: false
//     properties:
//       hibernate:
//         default_batch_fetch_size: 50
// Now the slow version runs: 1 (orders) + ceil(100/50) = 3 statements:
// select ... from customers where id in (?,?,?,... 50 ids)

// 5) Assert the statement count in a test so the bug cannot come back
@SpringBootTest
class OrderQueryCountTest {
    @Autowired OrderService service;
    @Autowired EntityManagerFactory emf;

    @Test
    void paidOrderEmails_doesNotRunNPlusOneQueries() {
        var stats = emf.unwrap(org.hibernate.SessionFactory.class).getStatistics();
        stats.setStatisticsEnabled(true);
        stats.clear();

        service.emailsOfPaidOrdersSlow();   // passes only once batch fetching / join fetch is in place

        org.assertj.core.api.Assertions.assertThat(stats.getPrepareStatementCount()).isLessThanOrEqualTo(3);
    }
}`
    },
    {
      heading: "7. Database Migrations with Flyway in Spring Boot: Versioned Schema Changes",
      content: `While learning, many tutorials set \`spring.jpa.hibernate.ddl-auto=update\` and let Hibernate create tables from entities. **Never do this in production.** \`update\` cannot rename or drop columns safely, cannot add indexes or constraints the way your DBA wants, gives you no history of what changed, and a typo in an entity can silently alter a live schema. Production teams treat the schema like code: every change is a versioned SQL script, reviewed in a pull request and applied automatically by a migration tool. The two popular tools are **Flyway** and **Liquibase**; Flyway's plain-SQL approach is simpler and is what most Spring Boot teams use.
**How Flyway works.** On startup, Flyway looks in \`src/main/resources/db/migration\` for files named \`V<version>__<description>.sql\` (capital V, version, **two underscores**, description). It keeps a table \`flyway_schema_history\` recording every script applied, with a checksum. Scripts with a higher version than the last applied one run in order inside a transaction (on PostgreSQL DDL is transactional, so a failed script rolls back cleanly). If a previously applied script is edited, the checksum mismatch makes Flyway **refuse to start** — this is a feature: migrations are immutable; to change something, write a new migration.
**Set \`ddl-auto=validate\`.** With Flyway owning the schema, Hibernate should only **validate** that entities match the tables and fail fast at startup if they do not. This catches "I added a field but forgot the migration" before the first request.
**Spring Boot 4 setup:** add \`spring-boot-starter-flyway\` plus the database-specific module (\`flyway-database-postgresql\`, or \`flyway-mysql\`). Spring Boot manages the Flyway version — do not pin one. Flyway runs before Hibernate initialises, using the same \`DataSource\`. Useful properties: \`spring.flyway.locations\`, \`spring.flyway.baseline-on-migrate=true\` (for adopting Flyway on an existing database), and \`spring.flyway.clean-disabled=true\` (the default — \`clean\` drops everything).
**Naming and content tips:** one logical change per file, lowercase snake_case descriptions, always add indexes for foreign keys and columns you filter by, and write migrations that are backward compatible with the currently deployed code (add a nullable column first, deploy code that writes it, then add the NOT NULL constraint in a later migration). Repeatable migrations (\`R__refresh_views.sql\`) re-run whenever their checksum changes — handy for views and stored functions.`,
      codeSnippet: `-- src/main/resources/db/migration/V1__create_users_and_tasks.sql
create table app_users (
    id            bigserial primary key,
    email         varchar(160) not null unique,
    password_hash varchar(100) not null,          -- BCrypt hashes are 60 chars
    full_name     varchar(120) not null,
    role          varchar(20)  not null default 'USER',
    enabled       boolean      not null default true,
    created_at    timestamptz  not null default now()
);

create table tasks (
    id          bigserial primary key,
    owner_id    bigint       not null references app_users(id),
    title       varchar(200) not null,
    description text,
    status      varchar(20)  not null default 'TODO',
    due_date    date,
    version     bigint       not null default 0,
    created_at  timestamptz  not null default now()
);

create index idx_tasks_owner_status on tasks(owner_id, status);

-- src/main/resources/db/migration/V2__add_task_priority.sql
alter table tasks add column priority varchar(10) not null default 'MEDIUM';

-- src/main/resources/db/migration/V3__seed_admin.sql
-- Generate the hash once with: new BCryptPasswordEncoder().encode("Admin@123")
-- and paste the 60-character result below (the value here is a PLACEHOLDER, not a real hash).
insert into app_users (email, password_hash, full_name, role)
values ('admin@taskmanager.in',
        '$2a$10$REPLACE_WITH_REAL_BCRYPT_HASH_GENERATED_LOCALLY_000000',
        'System Admin', 'ADMIN');

# src/main/resources/application.yml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/taskmanager
    username: taskmanager
    password: \${DB_PASSWORD:secret}
  jpa:
    hibernate:
      ddl-auto: validate          # Flyway owns the schema; Hibernate only checks it
    open-in-view: false
    properties:
      hibernate:
        default_batch_fetch_size: 50
  flyway:
    enabled: true
    locations: classpath:db/migration

# Startup log you should see:
# o.f.c.i.c.DbMigrate : Migrating schema "public" to version "1 - create users and tasks"
# o.f.c.i.c.DbMigrate : Migrating schema "public" to version "2 - add task priority"
# o.f.c.i.c.DbMigrate : Successfully applied 3 migrations to schema "public", now at version v3`
    },
    {
      heading: "8. Spring Security Architecture: The Filter Chain, AuthenticationManager and UserDetailsService",
      content: `Add \`spring-boot-starter-security\` and restart: every endpoint now returns **401 Unauthorized**, a login form appears at \`/login\`, and the console prints a generated password. That default is the result of **auto-configuration** building a \`SecurityFilterChain\` with form login and HTTP Basic. To build a JWT-protected API you replace that default with your own chain. First understand the moving parts.
**Servlet filters.** Spring Security is not a controller feature; it is a chain of \`jakarta.servlet.Filter\`s that runs **before** the request reaches \`DispatcherServlet\`. Spring registers one filter with the container, \`DelegatingFilterProxy\`, which delegates to a Spring bean named \`springSecurityFilterChain\` (\`FilterChainProxy\`). That proxy holds one or more \`SecurityFilterChain\`s and picks the first whose request matcher matches the URL. Inside each chain, fifteen-odd filters run in a fixed order: \`CorsFilter\`, \`CsrfFilter\`, \`UsernamePasswordAuthenticationFilter\` (form login), \`BasicAuthenticationFilter\`, \`ExceptionTranslationFilter\` and finally \`AuthorizationFilter\`, which makes the allow/deny decision. Your JWT filter will be inserted into this chain.
**SecurityContextHolder** is a \`ThreadLocal\` that holds the current \`Authentication\` for the request. A request is "logged in" when something has put an authenticated \`Authentication\` object there. After the request, the context is cleared.
**AuthenticationManager** verifies credentials. The default implementation, \`ProviderManager\`, asks each \`AuthenticationProvider\`; \`DaoAuthenticationProvider\` loads the user through your **UserDetailsService** (\`loadUserByUsername\`) and compares the password with the **PasswordEncoder**. You implement \`UserDetailsService\` once, backed by your JPA repository, and both login and any future form of authentication reuse it.
**Spring Security 7 configuration style.** Everything is a lambda on \`HttpSecurity\`: \`http.authorizeHttpRequests(auth -> auth.requestMatchers("/api/auth/**").permitAll().anyRequest().authenticated())\`. Rules are evaluated **top to bottom, first match wins**, so put specific patterns before \`anyRequest()\`. Matchers use \`PathPattern\` syntax (\`/api/**\`, \`/api/tasks/{id}\`). The old \`and()\`, \`authorizeRequests()\` and \`antMatchers()\` no longer compile.
**For a stateless API:** disable CSRF (CSRF protects cookie-based sessions; a bearer token in a header is not sent automatically by browsers, so CSRF does not apply), set \`SessionCreationPolicy.STATELESS\` so no \`JSESSIONID\` is created, and return 401/403 JSON instead of redirecting to a login page.`,
      codeSnippet: `// src/main/java/in/ravindra/taskmanager/security/SecurityConfig.java
package in.ravindra.taskmanager.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity                      // turns on @PreAuthorize / @PostAuthorize
public class SecurityConfig {

    @Bean
    SecurityFilterChain apiSecurity(HttpSecurity http, JwtService jwtService) throws Exception {
        http
            .csrf(csrf -> csrf.disable())                                   // stateless bearer-token API
            .cors(Customizer.withDefaults())                                // uses the CorsConfigurationSource bean
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**", "/actuator/health").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/public/**").permitAll()
                .requestMatchers("/actuator/**").hasRole("ADMIN")
                .anyRequest().authenticated())                              // order matters: last rule
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))  // 401, no redirect
            .addFilterBefore(new JwtAuthFilter(jwtService), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();            // cost 10 by default
    }

    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();      // ProviderManager -> DaoAuthenticationProvider
    }
}

// src/main/java/in/ravindra/taskmanager/security/JpaUserDetailsService.java
package in.ravindra.taskmanager.security;

import in.ravindra.taskmanager.user.AppUserRepository;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
public class JpaUserDetailsService implements UserDetailsService {
    private final AppUserRepository users;
    public JpaUserDetailsService(AppUserRepository users) { this.users = users; }

    @Override
    public UserDetails loadUserByUsername(String email) {
        return users.findByEmailIgnoreCase(email)
                .map(u -> User.withUsername(u.getEmail())
                        .password(u.getPasswordHash())         // BCrypt hash from the DB
                        .roles(u.getRole().name())             // "USER" -> authority "ROLE_USER"
                        .disabled(!u.isEnabled())
                        .build())
                .orElseThrow(() -> new UsernameNotFoundException("No user with email " + email));
    }
}

// Request flow for GET /api/tasks with a valid token:
// Tomcat -> DelegatingFilterProxy -> FilterChainProxy -> [CorsFilter, JwtAuthFilter (sets Authentication),
// ..., AuthorizationFilter (anyRequest().authenticated() -> OK)] -> DispatcherServlet -> TaskController`
    },
    {
      heading: "9. Password Encoding with BCrypt in Spring Security and User Registration",
      content: `Storing passwords in plain text, or even as plain SHA-256 hashes, is how data breaches become credential-stuffing attacks. A general-purpose hash like SHA-256 is designed to be **fast** — a GPU computes billions per second, so an attacker with a leaked table tries every common password against every user in minutes. **BCrypt** is a deliberately **slow, salted, adaptive** hash: it takes a *cost factor* (work factor) and each increment doubles the time. With the default cost of 10, one hash takes roughly 50–100 ms on a modern server — negligible for one login, crippling for an attacker who needs billions.
**What a BCrypt hash looks like:** \`$2a$10$N9qo8uLOickgx2ZMRZoMye...\` — \`$2a$\` is the algorithm version, \`10\` the cost, the next 22 characters the random **salt**, and the rest the hash. Because the salt is random and stored inside the string, two users with the same password get different hashes, and rainbow tables are useless. You never "decrypt" BCrypt; \`PasswordEncoder.matches(raw, encoded)\` re-hashes the raw password with the stored salt and compares.
**In Spring Security**, declare a \`PasswordEncoder\` bean. \`new BCryptPasswordEncoder()\` is the common choice; \`PasswordEncoderFactories.createDelegatingPasswordEncoder()\` is the recommended one when you may change algorithms later: it prefixes hashes with \`{bcrypt}\`, \`{argon2}\` and so on, so old hashes keep working while new ones use a stronger algorithm. **Argon2** and **scrypt** are also supported and are memory-hard (better against GPUs); Argon2id is what OWASP currently recommends first, but BCrypt remains perfectly acceptable and is what most interviewers expect you to know.
**Registration flow:** validate the request (\`@Valid\`, \`@Email\`, \`@Size(min = 8)\`), check the email is not already used, hash the password with \`encoder.encode(raw)\`, save the entity, and return 201 **without** the password hash in the response. Never log the raw password. Keep the response for a duplicate email generic if the product is sensitive (an attacker should not be able to enumerate registered emails).
**Column size:** a BCrypt hash is 60 characters; with the \`{bcrypt}\` prefix 68. The \`varchar(100)\` in our migration leaves room for Argon2 hashes later.`,
      codeSnippet: `// src/main/java/in/ravindra/taskmanager/user/AppUser.java
package in.ravindra.taskmanager.user;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "app_users")
public class AppUser {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true, length = 160)
    private String email;
    @Column(name = "password_hash", nullable = false, length = 100)
    private String passwordHash;
    @Column(name = "full_name", nullable = false, length = 120)
    private String fullName;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20)
    private Role role = Role.USER;
    private boolean enabled = true;
    @Column(name = "created_at", nullable = false, updatable = false, insertable = false)
    private Instant createdAt;

    protected AppUser() { }
    public AppUser(String email, String passwordHash, String fullName) {
        this.email = email; this.passwordHash = passwordHash; this.fullName = fullName;
    }
    public Long getId() { return id; }
    public String getEmail() { return email; }
    public String getPasswordHash() { return passwordHash; }
    public String getFullName() { return fullName; }
    public Role getRole() { return role; }
    public boolean isEnabled() { return enabled; }
}

// src/main/java/in/ravindra/taskmanager/user/Role.java
package in.ravindra.taskmanager.user;
public enum Role { USER, ADMIN }

// src/main/java/in/ravindra/taskmanager/user/AppUserRepository.java
package in.ravindra.taskmanager.user;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findByEmailIgnoreCase(String email);
    boolean existsByEmailIgnoreCase(String email);
}

// src/main/java/in/ravindra/taskmanager/auth/RegisterRequest.java
package in.ravindra.taskmanager.auth;
import jakarta.validation.constraints.*;

public record RegisterRequest(
        @Email @NotBlank String email,
        @NotBlank @Size(min = 8, max = 72) String password,   // BCrypt uses at most 72 bytes
        @NotBlank @Size(max = 120) String fullName) { }

// src/main/java/in/ravindra/taskmanager/auth/AuthService.java (registration part)
package in.ravindra.taskmanager.auth;

import in.ravindra.taskmanager.user.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    private final AppUserRepository users;
    private final PasswordEncoder encoder;

    public AuthService(AppUserRepository users, PasswordEncoder encoder) {
        this.users = users; this.encoder = encoder;
    }

    @Transactional
    public Long register(RegisterRequest req) {
        if (users.existsByEmailIgnoreCase(req.email())) {
            throw new EmailAlreadyUsedException(req.email());      // -> 409 Conflict via @ControllerAdvice
        }
        String hash = encoder.encode(req.password());              // "$2a$10$..." 60 chars, new salt each time
        AppUser user = users.save(new AppUser(req.email().toLowerCase(), hash, req.fullName()));
        return user.getId();
    }
}

// Quick check in a JUnit 5 test:
// PasswordEncoder enc = new BCryptPasswordEncoder();
// String h1 = enc.encode("Admin@123");  String h2 = enc.encode("Admin@123");
// assertNotEquals(h1, h2);                    // different salts
// assertTrue(enc.matches("Admin@123", h1));   // both still verify
// assertTrue(enc.matches("Admin@123", h2));`
    },
    {
      heading: "10. JWT Authentication Flow in Spring Boot: Issuing, Validating and Filtering Tokens",
      content: `A **JSON Web Token (JWT)** is a compact, URL-safe string with three Base64URL parts separated by dots: \`header.payload.signature\`. The **header** names the algorithm (\`HS256\`), the **payload** holds *claims* (\`sub\` = subject/username, \`iat\` = issued at, \`exp\` = expiry, plus custom claims such as roles), and the **signature** is an HMAC (or RSA/EC signature) of the first two parts with a secret key. Anyone can **decode** a JWT (it is only Base64, not encrypted — never put passwords or Aadhaar numbers in one), but nobody can **modify** it without the key, because the signature would no longer match.
**Why JWT instead of sessions for an API?** With sessions, the server stores login state and the browser sends a cookie; that requires sticky sessions or a shared session store when you run multiple instances. A JWT is **self-contained**: any instance can verify it with the shared secret, which fits horizontally scaled, stateless REST services and mobile clients. The trade-off is **revocation**: a JWT is valid until it expires, so keep access tokens short-lived (15 minutes is common) and pair them with a longer-lived **refresh token** stored in the database that can be revoked.
**The flow in our app:**
1. \`POST /api/auth/login\` with email and password. The controller calls \`AuthenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password))\`; \`DaoAuthenticationProvider\` loads the user via \`UserDetailsService\` and checks BCrypt. Bad credentials throw \`BadCredentialsException\` → 401.
2. On success, \`JwtService.generate()\` builds a token with the subject, roles claim and expiry and signs it with the secret.
3. The client stores the token (memory or secure storage; for web apps an \`HttpOnly\` cookie is safer than \`localStorage\` against XSS) and sends \`Authorization: Bearer <token>\` on every request.
4. \`JwtAuthFilter\`, a \`OncePerRequestFilter\` placed before \`UsernamePasswordAuthenticationFilter\`, reads the header, verifies the signature and expiry with \`Jwts.parser().verifyWith(key)\`, builds an \`Authentication\` with the roles and stores it in \`SecurityContextHolder\`. If the token is missing or invalid, it simply continues the chain **unauthenticated**, and \`AuthorizationFilter\` rejects protected URLs with 401 via the entry point.
**Key size and storage.** HS256 needs a key of **at least 256 bits (32 bytes)**; JJWT throws \`WeakKeyException\` for shorter keys. Generate one with \`openssl rand -base64 48\` and inject it from an environment variable, never commit it. For multiple services verifying tokens issued by one auth server, prefer an asymmetric algorithm (RS256/ES256): the auth server signs with the private key and every other service verifies with the public key, so the signing secret is never shared.
**JJWT 0.12 API:** \`Jwts.builder().subject(..).claim(..).issuedAt(..).expiration(..).signWith(key).compact()\` to create; \`Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload()\` to verify and read claims. Verification throws \`ExpiredJwtException\`, \`SignatureException\` or \`MalformedJwtException\` (all subclasses of \`JwtException\`).`,
      codeSnippet: `// src/main/java/in/ravindra/taskmanager/security/JwtService.java
package in.ravindra.taskmanager.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;

@Service
public class JwtService {
    private final SecretKey key;
    private final long expiryMinutes;

    public JwtService(@Value("\${app.jwt.secret}") String secret,
                      @Value("\${app.jwt.expiry-minutes:15}") long expiryMinutes) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8)); // >= 32 bytes for HS256
        this.expiryMinutes = expiryMinutes;
    }

    public String generate(String email, List<String> authorities) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(email)
                .claim("roles", authorities)                       // e.g. ["ROLE_USER"]
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(expiryMinutes, ChronoUnit.MINUTES)))
                .signWith(key)                                     // HS256 chosen from the key size
                .compact();
    }

    /** Verifies signature + expiry; throws io.jsonwebtoken.JwtException when invalid. */
    public Claims parse(String token) {
        return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
    }
}

// src/main/java/in/ravindra/taskmanager/security/JwtAuthFilter.java
package in.ravindra.taskmanager.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

// NOT annotated with @Component on purpose: it is added to the chain in SecurityConfig.
// A @Component Filter would ALSO be registered by Spring Boot as a plain servlet filter and run twice.
public class JwtAuthFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    public JwtAuthFilter(JwtService jwtService) { this.jwtService = jwtService; }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (header != null && header.startsWith("Bearer ")
                && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                Claims claims = jwtService.parse(header.substring(7));
                @SuppressWarnings("unchecked")
                List<String> roles = claims.get("roles", List.class);
                var authorities = roles.stream().map(SimpleGrantedAuthority::new).toList();
                var auth = new UsernamePasswordAuthenticationToken(claims.getSubject(), null, authorities);
                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(auth);   // request is now authenticated
            } catch (JwtException | IllegalArgumentException e) {
                logger.debug("Rejected JWT: " + e.getMessage());               // stay unauthenticated -> 401 later
            }
        }
        chain.doFilter(request, response);
    }
}

// src/main/java/in/ravindra/taskmanager/auth/AuthController.java
package in.ravindra.taskmanager.auth;

import in.ravindra.taskmanager.security.JwtService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationManager authManager;
    private final JwtService jwtService;
    private final AuthService authService;

    public AuthController(AuthenticationManager authManager, JwtService jwtService, AuthService authService) {
        this.authManager = authManager; this.jwtService = jwtService; this.authService = authService;
    }

    public record LoginRequest(String email, String password) { }
    public record TokenResponse(String accessToken, String tokenType, long expiresInSeconds) { }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Long> register(@Valid @RequestBody RegisterRequest req) {
        return Map.of("id", authService.register(req));
    }

    @PostMapping("/login")
    public TokenResponse login(@RequestBody LoginRequest req) {
        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.email(), req.password())); // throws on bad password
        var roles = auth.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList();
        String token = jwtService.generate(auth.getName(), roles);
        return new TokenResponse(token, "Bearer", 15 * 60);
    }
}

// curl -s -X POST localhost:8080/api/auth/login -H 'Content-Type: application/json' \\
//   -d '{"email":"asha@example.in","password":"Asha@12345"}'
// {"accessToken":"eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhc2hhQGV4YW1wbGUuaW4iLCJyb2xlcyI6WyJST0xFX1VTRVIiXSwiaWF0IjoxNzkxNTM...","tokenType":"Bearer","expiresInSeconds":900}`
    },
    {
      heading: "11. Method Security, Roles and Authorities, CORS and Stateless Sessions in Spring Security",
      content: `URL rules in the filter chain are coarse: "anything under \`/api/admin\` needs ADMIN". Business rules are finer: "a user may delete a task only if they own it". **Method security** brings authorization into the service layer with annotations, evaluated by a Spring AOP proxy around the bean.
**Enable it** with \`@EnableMethodSecurity\` (in Spring Security 6/7 this is the replacement for the old \`@EnableGlobalMethodSecurity\`, and \`@PreAuthorize\` is on by default). Then annotate methods:
• \`@PreAuthorize("hasRole('ADMIN')")\` — checked before the method runs.
• \`@PreAuthorize("hasAnyRole('ADMIN','MANAGER')")\`, \`@PreAuthorize("isAuthenticated()")\`.
• \`@PreAuthorize("#ownerEmail == authentication.name")\` — SpEL can reference method parameters with \`#name\` and the current principal via \`authentication\`.
• \`@PostAuthorize("returnObject.ownerEmail == authentication.name")\` — checked after, against the return value; useful for \`findById\` style methods.
• \`@PreAuthorize("@taskSecurity.canEdit(#taskId, authentication)")\` — delegate complex checks to a bean, keeping SpEL short.
A failed check throws \`AccessDeniedException\`, which Spring Security translates into **403 Forbidden** (401 is "who are you?", 403 is "I know who you are and the answer is no").
**Roles vs authorities.** Spring has one concept, \`GrantedAuthority\`, a string. A **role** is just an authority with the \`ROLE_\` prefix: \`hasRole("ADMIN")\` checks for the authority \`ROLE_ADMIN\`; \`hasAuthority("ROLE_ADMIN")\` is the same check without the convenience. The most common bug: storing \`"ADMIN"\` in the token and calling \`hasRole("ADMIN")\` — which looks for \`ROLE_ADMIN\` and always fails. Decide on one convention. Our \`UserDetailsService\` uses \`.roles("ADMIN")\`, which adds the prefix, and the JWT carries the prefixed authority, so \`hasRole\` works everywhere. Fine-grained permissions (\`task:write\`) are plain authorities checked with \`hasAuthority\`.
**CORS (Cross-Origin Resource Sharing)** matters the moment a React or Next.js frontend on \`http://localhost:3000\` calls your API on \`http://localhost:8080\`. The browser sends a preflight \`OPTIONS\` request and refuses the real call unless the API answers with \`Access-Control-Allow-Origin\`. Configure it **inside Spring Security**, not only with \`@CrossOrigin\` on controllers, because the preflight must pass through the security filters before it ever reaches a controller. Declare a \`CorsConfigurationSource\` bean listing exact allowed origins (never \`*\` together with credentials), methods and headers (\`Authorization\`, \`Content-Type\`), and call \`http.cors(Customizer.withDefaults())\`.
**Stateless sessions.** \`SessionCreationPolicy.STATELESS\` means Spring Security neither creates nor reads an \`HttpSession\`; every request must carry its own token. Combined with CSRF disabled, this is the standard configuration for a JWT API consumed by SPAs and mobile apps. If you ever add server-rendered pages with form login, use a **second \`SecurityFilterChain\`** with \`securityMatcher("/web/**")\` that keeps sessions and CSRF on.`,
      codeSnippet: `// src/main/java/in/ravindra/taskmanager/task/TaskService.java (method security examples)
package in.ravindra.taskmanager.task;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TaskService {
    private final TaskRepository tasks;
    public TaskService(TaskRepository tasks) { this.tasks = tasks; }

    @PostAuthorize("returnObject.ownerEmail() == authentication.name or hasRole('ADMIN')")
    @Transactional(readOnly = true)
    public TaskDto get(Long id) {
        return tasks.findById(id).map(TaskDto::from).orElseThrow(() -> new TaskNotFoundException(id));
    }

    @PreAuthorize("@taskSecurity.isOwner(#id, authentication.name) or hasRole('ADMIN')")
    @Transactional
    public void delete(Long id) {
        tasks.deleteById(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional(readOnly = true)
    public long countAll() { return tasks.count(); }
}

// src/main/java/in/ravindra/taskmanager/task/TaskSecurity.java — a bean referenced from SpEL
package in.ravindra.taskmanager.task;
import org.springframework.stereotype.Component;

@Component("taskSecurity")
public class TaskSecurity {
    private final TaskRepository tasks;
    public TaskSecurity(TaskRepository tasks) { this.tasks = tasks; }
    public boolean isOwner(Long taskId, String email) {
        return tasks.existsByIdAndOwner_EmailIgnoreCase(taskId, email);
    }
}

// src/main/java/in/ravindra/taskmanager/security/CorsConfig.java
package in.ravindra.taskmanager.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.List;

@Configuration
public class CorsConfig {
    @Bean
    CorsConfigurationSource corsConfigurationSource(
            @Value("\${app.cors.allowed-origins}") List<String> origins) {   // e.g. https://tasks.ravindra.in
        CorsConfiguration cfg = new CorsConfiguration();
        cfg.setAllowedOrigins(origins);                                      // exact origins, never "*" with credentials
        cfg.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        cfg.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        cfg.setExposedHeaders(List.of("Location"));
        cfg.setMaxAge(3600L);                                                // cache the preflight for 1 hour
        var source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", cfg);
        return source;
    }
}

// Expected behaviour:
// DELETE /api/tasks/7 as the owner            -> 204
// DELETE /api/tasks/7 as another USER         -> 403 {"status":403,"error":"Forbidden"}
// DELETE /api/tasks/7 with no/expired token   -> 401
// OPTIONS /api/tasks from http://localhost:3000 -> 200 with Access-Control-Allow-Origin: http://localhost:3000`
    },
    {
      heading: "12. Packaging a Spring Boot Jar and Building a Docker Image: Fat Jars, Layers and Multi-Stage Builds",
      content: `Spring Boot applications ship as a single **executable ("fat") jar** that contains your classes, every dependency, and a small launcher. Run \`./mvnw clean package\` (or \`./gradlew bootJar\`) and you get \`target/taskmanager-1.0.0.jar\`, roughly 40–60 MB, started with \`java -jar target/taskmanager-1.0.0.jar\`. The \`spring-boot-maven-plugin\` repackages the plain jar into this format; tests run as part of \`package\` unless you pass \`-DskipTests\` (acceptable in CI only if tests ran in a previous stage).
**Configuration comes from outside the jar.** The same artifact must run in dev, staging and production. Spring Boot reads \`application.yml\` from the jar, then overrides it with profile files (\`application-prod.yml\`, selected by \`SPRING_PROFILES_ACTIVE=prod\`), then with **environment variables** (\`SPRING_DATASOURCE_URL\` maps to \`spring.datasource.url\` by relaxed binding), then with command-line flags. Secrets like \`DB_PASSWORD\` and \`JWT_SECRET\` are always environment variables or a secrets manager — never in the jar or the Git repository.
**Docker** packages the jar with a JRE so the image runs identically on your laptop, a colleague's Mac and a Linux server. Use a **multi-stage build**: the first stage uses a JDK image to compile and package; the final stage copies only the jar into a slim **JRE** image (for example \`eclipse-temurin:25-jre\`), which keeps the image around 250 MB instead of 700 MB and removes build tools from the production surface. Run as a **non-root user**, expose port 8080 and let the JVM read container memory limits (it does automatically since Java 10; tune with \`-XX:MaxRAMPercentage=75\`).
**Layered jars for fast rebuilds.** Each Docker \`COPY\` is a cached layer. If you copy the fat jar in one step, every one-line code change invalidates a 50 MB layer. Spring Boot's layer tools split the jar into \`dependencies\`, \`spring-boot-loader\`, \`snapshot-dependencies\` and \`application\` so that only the tiny application layer changes between builds: \`java -Djarmode=tools -jar app.jar extract --layers --destination extracted\` (the \`tools\` jar mode is available since Spring Boot 3.3; older versions used \`-Djarmode=layertools\`).
**Alternative: Buildpacks.** \`./mvnw spring-boot:build-image\` builds an optimised OCI image with no Dockerfile at all, using Cloud Native Buildpacks. It is excellent for teams that do not want to maintain Dockerfiles; the Dockerfile route gives you full control and is what most interviewers ask about.`,
      codeSnippet: `# Dockerfile — multi-stage build, layered jar, non-root user
# ---- stage 1: build ----
FROM eclipse-temurin:25-jdk AS build
WORKDIR /workspace
COPY mvnw pom.xml ./
COPY .mvn .mvn
RUN ./mvnw -q dependency:go-offline            # cache dependencies as their own layer
COPY src src
RUN ./mvnw -q clean package -DskipTests        # tests already ran in CI
RUN java -Djarmode=tools -jar target/*.jar extract --layers --destination extracted

# ---- stage 2: runtime ----
FROM eclipse-temurin:25-jre
RUN useradd --system --uid 1001 appuser
WORKDIR /app
COPY --from=build /workspace/extracted/dependencies/ ./
COPY --from=build /workspace/extracted/spring-boot-loader/ ./
COPY --from=build /workspace/extracted/snapshot-dependencies/ ./
COPY --from=build /workspace/extracted/application/ ./
USER appuser
EXPOSE 8080
ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=75 -XX:+UseZGC"
ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]

# .dockerignore
# target/
# .git/
# *.md

# docker-compose.yml — API + PostgreSQL for local/staging
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_DB: taskmanager
      POSTGRES_USER: taskmanager
      POSTGRES_PASSWORD: secret
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U taskmanager"]
      interval: 5s
      retries: 10
  api:
    build: .
    ports:
      - "8080:8080"
    environment:
      SPRING_PROFILES_ACTIVE: prod
      SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/taskmanager
      SPRING_DATASOURCE_USERNAME: taskmanager
      DB_PASSWORD: secret
      JWT_SECRET: change-me-to-a-random-48-byte-base64-string-from-openssl
      APP_CORS_ALLOWED_ORIGINS: http://localhost:3000
    depends_on:
      db:
        condition: service_healthy
volumes:
  pgdata:

# Commands
# ./mvnw clean package                         -> target/taskmanager-1.0.0.jar (~45 MB)
# docker build -t taskmanager:1.0.0 .          -> image ~260 MB
# docker compose up --build                    -> API on http://localhost:8080
# curl localhost:8080/actuator/health          -> {"status":"UP"}`
    },
    {
      heading: "13. Deploying a Spring Boot Application: Hosting Options, Production Checklist and Real-World Use Cases",
      content: `With an image built, deployment is about where to run it and how to run it safely. The common options, in increasing complexity:
• **A Linux VPS** (DigitalOcean, Hetzner, AWS Lightsail; ₹400–800 per month) running \`docker compose up -d\` behind **Nginx** or **Caddy** as a reverse proxy that terminates HTTPS with a free Let's Encrypt certificate. Perfect for portfolio projects and small products.
• **Platform-as-a-Service** (Render, Railway, Fly.io, AWS App Runner): push the Dockerfile or connect the Git repository; the platform builds, runs, scales and provides HTTPS. Pair it with a managed PostgreSQL (Neon, Supabase, RDS).
• **Kubernetes** (EKS, GKE, AKS) for teams running many services: Deployments, Services, Ingress, Horizontal Pod Autoscaler, liveness/readiness probes pointing at Actuator. Most Indian product companies and large service projects end up here.
**Production checklist for a Spring Boot API:**
1. **Profiles and secrets** — \`SPRING_PROFILES_ACTIVE=prod\`; \`JWT_SECRET\`, DB credentials from environment variables or a secrets manager; \`show-sql\` off; \`ddl-auto=validate\`; Flyway on.
2. **Health and metrics** — Actuator \`/actuator/health\` with liveness (\`/actuator/health/liveness\`) and readiness groups enabled (\`management.endpoint.health.probes.enabled=true\`); Prometheus metrics via Micrometer; restrict other Actuator endpoints to ADMIN or an internal port.
3. **Logging** — JSON structured logs (\`logging.structured.format.console=ecs\`, supported since Spring Boot 3.4) so a log aggregator can parse them; include a correlation/trace id; never log tokens or passwords.
4. **Connection pool** — HikariCP defaults to 10 connections; size it to roughly (CPU cores × 2) per instance and make sure instances × pool size stays below the database's \`max_connections\`.
5. **Graceful shutdown** — \`server.shutdown=graceful\` with \`spring.lifecycle.timeout-per-shutdown-phase=20s\` so in-flight requests finish during a rolling deploy.
6. **Timeouts and limits** — request body size, upstream HTTP client timeouts, pagination caps, rate limiting at the proxy or with Bucket4j.
7. **Security hardening** — HTTPS only (behind the proxy set \`server.forward-headers-strategy=framework\`), short-lived access tokens with refresh tokens, exact CORS origins, security headers (Spring Security adds \`X-Content-Type-Options\`, \`Cache-Control\`, HSTS by default), dependency scanning (OWASP Dependency-Check or GitHub Dependabot).
8. **Virtual threads** — on Java 21+, \`spring.threads.virtual.enabled=true\` lets Tomcat handle each request on a virtual thread (Lecture 11), greatly improving throughput for I/O-heavy APIs with no code changes. Keep the Hikari pool as the real limit.
9. **Backups and migrations** — automated database backups tested with a restore; migrations backward compatible with the previous version so rollbacks work.
10. **CI/CD** — GitHub Actions runs tests, builds the image, tags it with the Git SHA and deploys; no manual \`scp\` of jars.
**Real-world use cases: how this exact stack runs in production**
• **Fintech and payments** (UPI apps, lending platforms): Spring Data JPA with optimistic locking (\`@Version\`) on account and ledger entities to prevent double spends; Flyway for audited schema changes; JWT access tokens of 5–15 minutes with device-bound refresh tokens; method security for maker–checker approvals.
• **E-commerce and food delivery**: paginated catalogue and order history endpoints, \`@EntityGraph\` for the order-details screen, \`default_batch_fetch_size\` to kill N+1, read replicas for reporting projections, Kubernetes autoscaling during sale events.
• **EdTech and SaaS dashboards**: multi-tenant data with a \`tenant_id\` column and \`@PreAuthorize\` checks, role-based admin panels, CORS configured for the web app and the mobile app's web views, Docker images promoted from staging to production unchanged.
• **Internal enterprise tools** at service companies: the same Spring Boot + JPA + Security template reused across dozens of microservices, with the JWT verified by an API gateway and the roles claim propagated downstream.`,
      codeSnippet: `# src/main/resources/application-prod.yml — production profile (secrets come from the environment)
server:
  port: 8080
  shutdown: graceful
  forward-headers-strategy: framework        # trust X-Forwarded-* from Nginx/Ingress for HTTPS links

spring:
  lifecycle:
    timeout-per-shutdown-phase: 20s
  threads:
    virtual:
      enabled: true                          # Java 21+: one virtual thread per request
  datasource:
    url: \${SPRING_DATASOURCE_URL}
    username: \${SPRING_DATASOURCE_USERNAME}
    password: \${DB_PASSWORD}
    hikari:
      maximum-pool-size: 16
      connection-timeout: 5000
  jpa:
    show-sql: false
    open-in-view: false
    hibernate:
      ddl-auto: validate
  flyway:
    enabled: true

app:
  jwt:
    secret: \${JWT_SECRET}                   # openssl rand -base64 48
    expiry-minutes: 15
  cors:
    allowed-origins: \${APP_CORS_ALLOWED_ORIGINS}

management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  endpoint:
    health:
      probes:
        enabled: true                        # /actuator/health/liveness and /readiness

logging:
  structured:
    format:
      console: ecs                           # JSON logs for ELK / Loki / CloudWatch
  level:
    org.hibernate.SQL: warn

# .github/workflows/deploy.yml — minimal CI/CD
name: build-and-deploy
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { distribution: temurin, java-version: '25' }
      - run: ./mvnw -B verify                              # unit + integration tests
      - run: docker build -t ghcr.io/ravindra/taskmanager:\${{ github.sha }} .
      - run: echo "\${{ secrets.GITHUB_TOKEN }}" | docker login ghcr.io -u \${{ github.actor }} --password-stdin
      - run: docker push ghcr.io/ravindra/taskmanager:\${{ github.sha }}
      # deploy step: ssh to the VPS and run "docker compose pull && docker compose up -d",
      # or trigger the PaaS / kubectl rollout with the new tag`
    },
    {
      heading: "14. Common Mistakes with Spring Data JPA, Spring Security and JWT and How to Fix Them",
      content: `**1. \`LazyInitializationException: could not initialize proxy - no Session\`.** You accessed a lazy association outside a transaction — typically in a controller or during JSON serialisation after setting \`open-in-view=false\`. Fix: load what the use case needs inside a \`@Transactional\` service method with \`join fetch\` or \`@EntityGraph\`, and return a DTO. Do not "fix" it by switching to EAGER or turning Open Session In View back on.
**2. Returning entities directly from controllers.** Jackson serialises the whole object graph: \`Customer\` → \`orders\` → \`customer\` → infinite recursion (\`StackOverflowError\`) or, with \`@JsonIgnore\` sprinkled everywhere, an API shape tied to your table design. Fix: records as DTOs, mapped in the service.
**3. \`ddl-auto=update\` in production** — see Section 7. Fix: Flyway plus \`validate\`.
**4. Forgetting \`mappedBy\`** on \`@OneToMany\`, which creates a surprise join table; and forgetting to set the owning side (\`order.setCustomer(c)\`), which inserts a NULL foreign key. Fix: helper methods that set both sides.
**5. Lombok \`@Data\` on entities.** Generated \`toString\`/\`hashCode\` walk lazy collections, causing N+1 queries and recursion. Fix: \`@Getter\`/\`@Setter\` only, hand-written \`equals\` on the id, or no Lombok on entities.
**6. Annotating the JWT filter with \`@Component\` and also \`addFilterBefore\`.** Spring Boot registers every \`Filter\` bean with the servlet container, so the filter runs twice — once outside the security chain where \`SecurityContextHolder\` is not yet set up. Fix: construct it inside the security configuration (as in Section 8), or register a \`FilterRegistrationBean\` with \`setEnabled(false)\`.
**7. \`hasRole("ROLE_ADMIN")\`.** \`hasRole\` adds the prefix itself, producing \`ROLE_ROLE_ADMIN\`; Spring even throws an \`IllegalArgumentException\` for this in recent versions. Fix: \`hasRole("ADMIN")\` or \`hasAuthority("ROLE_ADMIN")\`.
**8. Weak or committed JWT secrets.** A 16-character secret fails JJWT's key check; a secret in \`application.yml\` in Git is a leak. Fix: 32+ random bytes from an environment variable; rotate on exposure.
**9. Long-lived access tokens with no revocation.** A 30-day access token means a stolen token works for 30 days and logout does nothing. Fix: 15-minute access tokens plus refresh tokens stored server-side (revocable), or a short denylist for critical cases.
**10. CORS configured only with \`@CrossOrigin\`.** The preflight \`OPTIONS\` never reaches the controller when Spring Security rejects it first, so the browser shows a CORS error even though the server "allows" it. Fix: the \`CorsConfigurationSource\` bean and \`http.cors(...)\`.
**11. Calling \`@Transactional\` or \`@PreAuthorize\` methods from inside the same class.** Both work through proxies; a self-call bypasses the proxy, so no transaction and no security check. Fix: move the method to another bean or restructure.
**12. Running the JVM as root in Docker with no memory limit awareness**, then being OOM-killed. Fix: non-root user, \`-XX:MaxRAMPercentage\`, container memory limits set explicitly.
**13. Catching \`BadCredentialsException\` and returning different messages for "no such user" and "wrong password".** This lets attackers enumerate accounts. Fix: one generic message, same response time.`,
      codeSnippet: `// Mistake 2 and 1 together: entity returned from a controller with lazy fields
@GetMapping("/{id}")
public Order get(@PathVariable Long id) {              // BAD: entity, lazy customer/items, recursion risk
    return orders.findById(id).orElseThrow();
}

// Fix: DTO built inside a transactional service
public record OrderDetails(Long id, String customerEmail, BigDecimal total, List<ItemLine> items) {
    public record ItemLine(String product, int qty) { }
}

@Service
public class OrderQueryService {
    private final OrderRepository orders;
    public OrderQueryService(OrderRepository orders) { this.orders = orders; }

    @Transactional(readOnly = true)
    public OrderDetails details(Long id) {
        Order o = orders.findWithCustomerAndItemsById(id)         // @EntityGraph(attributePaths = {"customer","items"})
                .orElseThrow(() -> new OrderNotFoundException(id));
        return new OrderDetails(o.getId(), o.getCustomer().getEmail(), o.getTotalAmount(),
                o.getItems().stream().map(i -> new OrderDetails.ItemLine(i.getProductName(), i.getQuantity())).toList());
    }
}

// Mistake 11: self-invocation bypasses the proxy
@Service
public class ReportService {
    public void nightlyJob() {
        generate();                         // BAD: @Transactional/@PreAuthorize on generate() are NOT applied
    }
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public void generate() { /* ... */ }
}
// Fix: put generate() in ReportGenerator and inject it into ReportService.

// Mistake 7: the ROLE_ prefix
// .requestMatchers("/api/admin/**").hasRole("ROLE_ADMIN")   // BAD -> IllegalArgumentException / never matches
// .requestMatchers("/api/admin/**").hasRole("ADMIN")        // GOOD
// .requestMatchers("/api/admin/**").hasAuthority("ROLE_ADMIN") // also GOOD`
    },
    {
      heading: "15. Frequently Asked Questions about Spring Data JPA, Spring Security and JWT",
      content: `**What is the difference between JPA, Hibernate and Spring Data JPA?**
JPA is the Jakarta specification (annotations and interfaces such as \`@Entity\` and \`EntityManager\`). Hibernate is the most widely used implementation of JPA and the default in Spring Boot. Spring Data JPA is a Spring layer on top of JPA that generates repository implementations, derived queries and pagination so you write interfaces instead of DAO classes.
**What is the N+1 problem in Hibernate and how do you fix it?**
Loading N parent entities with one query and then triggering one extra query per parent to load a lazy association, giving N+1 statements. Fix it with \`join fetch\` in JPQL, \`@EntityGraph\` on the repository method, Hibernate's \`default_batch_fetch_size\`, or DTO projections for read-only screens. Disabling Open Session In View helps you notice it early.
**Should I use FetchType.LAZY or EAGER in JPA?**
Default to LAZY for every association, including \`@ManyToOne\`, and fetch eagerly per use case with \`join fetch\` or an entity graph. EAGER is a global decision that loads data on every code path and still causes N+1 with JPQL queries.
**Is JWT better than session-based authentication?**
Neither is universally better. JWTs are stateless and scale across instances and mobile clients, but cannot be revoked before expiry without extra infrastructure. Sessions are simple to revoke and work well for server-rendered apps behind one domain. For REST APIs used by SPAs and mobile apps, short-lived JWTs with refresh tokens are the common choice.
**Where should a frontend store the JWT?**
For browser apps, an \`HttpOnly\`, \`Secure\`, \`SameSite\` cookie protects the token from XSS, at the cost of needing CSRF protection again. \`localStorage\` is simple but readable by any injected script. Mobile apps should use the platform's secure storage (Keychain/Keystore). Keep access tokens short-lived either way.
**Why does Spring Security return 403 instead of 401, or vice versa?**
401 means the request is unauthenticated (no or invalid token); it is produced by the \`AuthenticationEntryPoint\`. 403 means the user is authenticated but lacks the role or permission; it is produced by the \`AccessDeniedHandler\`. If you get 403 for unauthenticated requests, you have not configured an entry point for your stateless chain.
**Do I still need CSRF protection with JWT?**
If the token travels in the \`Authorization\` header, browsers do not attach it automatically to cross-site requests, so CSRF does not apply and you can disable it. If you put the JWT in a cookie, the browser does attach it automatically, and CSRF protection must stay on.
**Flyway or Liquibase for Spring Boot migrations?**
Both are well supported and auto-configured. Flyway uses plain SQL files with a versioned naming convention and is simpler to learn and review. Liquibase uses XML/YAML/JSON changelogs that are database-independent and supports rollbacks in the free edition. Pick Flyway unless you need multi-database portability from one changelog.`
    },
    {
      heading: "16. Interview Questions and Answers on Spring Data JPA, Spring Security, JWT and Deployment",
      content: `**Q1. Explain the entity lifecycle states in JPA and what dirty checking is.**
Transient (new object, unknown to the database), managed (attached to a persistence context, changes tracked), detached (context closed, changes not tracked) and removed (scheduled for deletion). Dirty checking is Hibernate comparing managed entities with their load-time snapshot at flush/commit and issuing \`UPDATE\`s automatically, which is why modifying a managed entity inside \`@Transactional\` needs no explicit \`save()\`.
**Q2. What is the owning side of a relationship and why does it matter?**
The owning side is the entity that holds the foreign key column (\`@ManyToOne\` with \`@JoinColumn\`). Hibernate writes the database relationship based on the owning side only; the inverse side (\`@OneToMany(mappedBy=...)\`) is just a view. Updating only the inverse side's collection does not persist the link.
**Q3. How does a derived query like \`findByCustomer_EmailAndStatus\` work?**
At startup Spring Data parses the method name into a query tree: it splits on \`By\`, then on \`And\`/\`Or\`, resolves each property path against the entity metamodel (\`customer.email\`, \`status\`) and builds a JPQL query. An invalid property fails application startup, not the first request.
**Q4. Difference between \`Page\` and \`Slice\` in Spring Data?**
Both return one page of results. \`Page\` additionally executes a count query to provide \`totalElements\` and \`totalPages\`; \`Slice\` only fetches one extra row to know whether a next page exists, so it is cheaper for infinite scroll.
**Q5. How does the Spring Security filter chain process a request?**
\`DelegatingFilterProxy\` hands the request to \`FilterChainProxy\`, which selects the matching \`SecurityFilterChain\`. Its filters run in order: CORS, CSRF, authentication filters (which populate \`SecurityContextHolder\`), \`ExceptionTranslationFilter\` (turns exceptions into 401/403) and \`AuthorizationFilter\` (applies the \`authorizeHttpRequests\` rules). Only then does the request reach \`DispatcherServlet\`.
**Q6. What does \`AuthenticationManager.authenticate()\` do?**
It accepts an unauthenticated \`Authentication\` (username and password) and delegates to \`AuthenticationProvider\`s. \`DaoAuthenticationProvider\` loads the \`UserDetails\` via \`UserDetailsService\`, checks the password using the \`PasswordEncoder\`, checks account flags, and returns an authenticated \`Authentication\` with authorities — or throws \`AuthenticationException\`.
**Q7. Why BCrypt instead of SHA-256 for passwords?**
SHA-256 is fast and unsalted by itself, so leaked hashes can be brute-forced at billions of guesses per second. BCrypt is salted (random salt embedded in the hash), slow by design, and adaptive via a cost factor that can be increased as hardware improves.
**Q8. Walk through JWT authentication in Spring Boot.**
Login endpoint authenticates credentials through \`AuthenticationManager\`, issues a signed JWT with subject, roles and expiry. Clients send \`Authorization: Bearer <token>\`. A \`OncePerRequestFilter\` before \`UsernamePasswordAuthenticationFilter\` verifies the signature and expiry, builds an \`Authentication\` with the roles and sets it in \`SecurityContextHolder\`. The session policy is STATELESS and CSRF is disabled. \`AuthorizationFilter\` and \`@PreAuthorize\` then enforce access.
**Q9. How do you revoke a JWT?**
You cannot invalidate a signed token itself. Options: keep access tokens short-lived and revoke the refresh token in the database; maintain a denylist of token ids (\`jti\`) until expiry; or include a per-user token version claim and compare it with the stored version on each request.
**Q10. What is the difference between \`@PreAuthorize("hasRole('ADMIN')")\` and \`hasAuthority('ROLE_ADMIN')\`?**
They check the same thing. \`hasRole\` automatically prefixes \`ROLE_\`; \`hasAuthority\` compares the raw string. Roles are a naming convention on top of the single \`GrantedAuthority\` concept.
**Q11. How do you deploy a Spring Boot application with Docker, and why multi-stage builds?**
Build the fat jar, create a multi-stage Dockerfile: a JDK stage compiles and extracts the layered jar, a slim JRE stage copies the layers and runs as a non-root user. Multi-stage builds keep build tools out of the runtime image, reduce size and attack surface, and layering makes rebuilds fast because unchanged dependency layers are cached. Configuration and secrets are injected through environment variables per environment.
**Q12. What would you check before calling a Spring Boot service production-ready?**
Externalised config and secrets, Flyway with \`ddl-auto=validate\`, health probes and metrics via Actuator, structured logging without sensitive data, correctly sized connection pool, graceful shutdown, HTTPS and CORS locked down, short-lived tokens, pagination limits, automated tests in CI, and backups with a tested restore.`
    },
    {
      heading: "17. Hands-On Exercise: A Secure Task Manager API with Spring Data JPA, JWT and Docker",
      content: `Build the complete **Task Manager API** that this lecture has been assembling. It combines a JPA entity with a relationship and optimistic locking, a Spring Data repository with derived queries and pagination, Flyway migrations, BCrypt registration, JWT login, a JWT filter, method security and a Docker image. Use the \`pom.xml\` from Section 1, the migrations and \`application.yml\` from Section 7, \`SecurityConfig\` and \`JpaUserDetailsService\` from Section 8, \`AppUser\`, \`Role\`, \`AppUserRepository\`, \`RegisterRequest\` and \`AuthService\` from Section 9, \`JwtService\`, \`JwtAuthFilter\` and \`AuthController\` from Section 10, \`CorsConfig\` from Section 11, and the Dockerfile and \`docker-compose.yml\` from Section 12. The snippet below adds the remaining files: the \`Task\` entity, repository, DTOs, service, controller, exception handling and the application class, followed by the exact commands and expected responses.
**Requirements:**
1. \`POST /api/auth/register\` creates a user (BCrypt-hashed password) and returns 201; a duplicate email returns 409.
2. \`POST /api/auth/login\` returns a JWT valid for 15 minutes; a wrong password returns 401.
3. \`POST /api/tasks\` creates a task owned by the caller; \`GET /api/tasks?status=TODO&page=0&size=10\` returns the caller's tasks paginated and sorted by due date.
4. \`PATCH /api/tasks/{id}/status\` changes the status; \`DELETE /api/tasks/{id}\` is allowed only for the owner or an ADMIN (403 otherwise).
5. \`GET /api/admin/stats\` returns counts per status and requires ADMIN.
6. All of this runs with \`docker compose up --build\` and \`/actuator/health\` reports UP.
**Stretch goals:** add a refresh-token endpoint backed by a \`refresh_tokens\` table (Flyway \`V4\`), add a \`@SpringBootTest\` with Testcontainers PostgreSQL that registers, logs in and creates a task using \`MockMvc\` and \`spring-security-test\`, and add an \`@EntityGraph\` so \`GET /api/admin/tasks\` lists tasks with owners in one query.`,
      codeSnippet: `// src/main/java/in/ravindra/taskmanager/TaskManagerApplication.java
package in.ravindra.taskmanager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TaskManagerApplication {
    public static void main(String[] args) {
        SpringApplication.run(TaskManagerApplication.class, args);
    }
}

// src/main/java/in/ravindra/taskmanager/task/Task.java
package in.ravindra.taskmanager.task;

import in.ravindra.taskmanager.user.AppUser;
import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "tasks")
public class Task {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_id", nullable = false)
    private AppUser owner;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "text")
    private String description;

    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20)
    private TaskStatus status = TaskStatus.TODO;

    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 10)
    private Priority priority = Priority.MEDIUM;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Version
    private long version;

    @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
    private Instant createdAt;

    protected Task() { }
    public Task(AppUser owner, String title, String description, Priority priority, LocalDate dueDate) {
        this.owner = owner; this.title = title; this.description = description;
        this.priority = priority == null ? Priority.MEDIUM : priority; this.dueDate = dueDate;
    }
    public Long getId() { return id; }
    public AppUser getOwner() { return owner; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public TaskStatus getStatus() { return status; }
    public void setStatus(TaskStatus status) { this.status = status; }
    public Priority getPriority() { return priority; }
    public LocalDate getDueDate() { return dueDate; }
}

// src/main/java/in/ravindra/taskmanager/task/TaskStatus.java
package in.ravindra.taskmanager.task;
public enum TaskStatus { TODO, IN_PROGRESS, DONE }

// src/main/java/in/ravindra/taskmanager/task/Priority.java
package in.ravindra.taskmanager.task;
public enum Priority { LOW, MEDIUM, HIGH }

// src/main/java/in/ravindra/taskmanager/task/TaskRepository.java
package in.ravindra.taskmanager.task;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    Page<Task> findByOwner_EmailIgnoreCase(String email, Pageable pageable);
    Page<Task> findByOwner_EmailIgnoreCaseAndStatus(String email, TaskStatus status, Pageable pageable);
    boolean existsByIdAndOwner_EmailIgnoreCase(Long id, String email);

    @EntityGraph(attributePaths = "owner")                    // admin list: tasks + owners in ONE query
    Page<Task> findAllBy(Pageable pageable);

    @Query("select t.status as status, count(t) as count from Task t group by t.status")
    List<StatusCount> countByStatusGrouped();

    interface StatusCount {                                   // interface projection
        TaskStatus getStatus();
        long getCount();
    }
}

// src/main/java/in/ravindra/taskmanager/task/TaskDtos.java
package in.ravindra.taskmanager.task;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record CreateTaskRequest(@NotBlank @Size(max = 200) String title,
                                @Size(max = 4000) String description,
                                Priority priority,
                                LocalDate dueDate) { }

public record UpdateStatusRequest(@NotNull TaskStatus status) { }

// src/main/java/in/ravindra/taskmanager/task/TaskDto.java
package in.ravindra.taskmanager.task;
import java.time.LocalDate;

public record TaskDto(Long id, String title, String description, TaskStatus status,
                      Priority priority, LocalDate dueDate, String ownerEmail) {
    static TaskDto from(Task t) {
        return new TaskDto(t.getId(), t.getTitle(), t.getDescription(), t.getStatus(),
                t.getPriority(), t.getDueDate(), t.getOwner().getEmail());
    }
}

// src/main/java/in/ravindra/taskmanager/task/TaskService.java  (full version)
package in.ravindra.taskmanager.task;

import in.ravindra.taskmanager.user.AppUserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class TaskService {
    private final TaskRepository tasks;
    private final AppUserRepository users;

    public TaskService(TaskRepository tasks, AppUserRepository users) {
        this.tasks = tasks; this.users = users;
    }

    @Transactional
    public TaskDto create(String ownerEmail, CreateTaskRequest req) {
        var owner = users.findByEmailIgnoreCase(ownerEmail).orElseThrow();
        Task saved = tasks.save(new Task(owner, req.title(), req.description(), req.priority(), req.dueDate()));
        return TaskDto.from(saved);
    }

    @Transactional(readOnly = true)
    public Page<TaskDto> listMine(String ownerEmail, TaskStatus status, Pageable pageable) {
        Page<Task> page = status == null
                ? tasks.findByOwner_EmailIgnoreCase(ownerEmail, pageable)
                : tasks.findByOwner_EmailIgnoreCaseAndStatus(ownerEmail, status, pageable);
        return page.map(TaskDto::from);          // owner is in the persistence context: no extra query
    }

    @PreAuthorize("@taskSecurity.isOwner(#id, authentication.name) or hasRole('ADMIN')")
    @Transactional
    public TaskDto updateStatus(Long id, TaskStatus status) {
        Task task = tasks.findById(id).orElseThrow(() -> new TaskNotFoundException(id));
        task.setStatus(status);                  // dirty checking + @Version -> UPDATE ... WHERE version=?
        return TaskDto.from(task);
    }

    @PreAuthorize("@taskSecurity.isOwner(#id, authentication.name) or hasRole('ADMIN')")
    @Transactional
    public void delete(Long id) {
        if (!tasks.existsById(id)) throw new TaskNotFoundException(id);
        tasks.deleteById(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional(readOnly = true)
    public Map<TaskStatus, Long> stats() {
        Map<TaskStatus, Long> result = new LinkedHashMap<>();
        for (TaskStatus s : TaskStatus.values()) result.put(s, 0L);
        tasks.countByStatusGrouped().forEach(c -> result.put(c.getStatus(), c.getCount()));
        return result;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional(readOnly = true)
    public Page<TaskDto> listAll(Pageable pageable) {
        return tasks.findAllBy(pageable).map(TaskDto::from);
    }
}

// src/main/java/in/ravindra/taskmanager/task/TaskController.java
package in.ravindra.taskmanager.task;

import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class TaskController {
    private final TaskService service;
    public TaskController(TaskService service) { this.service = service; }

    @PostMapping("/tasks")
    public ResponseEntity<TaskDto> create(@Valid @RequestBody CreateTaskRequest req, Authentication auth) {
        TaskDto dto = service.create(auth.getName(), req);
        var location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").build(dto.id());
        return ResponseEntity.created(location).body(dto);
    }

    @GetMapping("/tasks")
    public PageResponse<TaskDto> mine(@RequestParam(required = false) TaskStatus status,
                                      @PageableDefault(size = 10, sort = "dueDate", direction = Sort.Direction.ASC) Pageable pageable,
                                      Authentication auth) {
        return PageResponse.from(service.listMine(auth.getName(), status, pageable));
    }

    @PatchMapping("/tasks/{id}/status")
    public TaskDto updateStatus(@PathVariable Long id, @Valid @RequestBody UpdateStatusRequest req) {
        return service.updateStatus(id, req.status());
    }

    @DeleteMapping("/tasks/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) { service.delete(id); }

    @GetMapping("/admin/stats")
    public Map<TaskStatus, Long> stats() { return service.stats(); }

    @GetMapping("/admin/tasks")
    public PageResponse<TaskDto> all(@PageableDefault(size = 20) Pageable pageable) {
        return PageResponse.from(service.listAll(pageable));
    }
}

// src/main/java/in/ravindra/taskmanager/task/PageResponse.java
package in.ravindra.taskmanager.task;
import org.springframework.data.domain.Page;
import java.util.List;

public record PageResponse<T>(List<T> items, int page, int size, long totalElements, int totalPages, boolean hasNext) {
    public static <T> PageResponse<T> from(Page<T> p) {
        return new PageResponse<>(p.getContent(), p.getNumber(), p.getSize(), p.getTotalElements(), p.getTotalPages(), p.hasNext());
    }
}

// src/main/java/in/ravindra/taskmanager/common/ApiExceptionHandler.java
package in.ravindra.taskmanager.common;

import in.ravindra.taskmanager.auth.EmailAlreadyUsedException;
import in.ravindra.taskmanager.task.TaskNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(TaskNotFoundException.class)
    ProblemDetail notFound(TaskNotFoundException e) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage());
    }

    @ExceptionHandler(EmailAlreadyUsedException.class)
    ProblemDetail conflict(EmailAlreadyUsedException e) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, "Email already registered");
    }

    @ExceptionHandler(BadCredentialsException.class)
    ProblemDetail badCredentials(BadCredentialsException e) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.UNAUTHORIZED, "Invalid email or password"); // generic on purpose
    }

    @ExceptionHandler(AccessDeniedException.class)
    ProblemDetail forbidden(AccessDeniedException e) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.FORBIDDEN, "You do not have permission for this action");
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ProblemDetail invalid(MethodArgumentNotValidException e) {
        var pd = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Validation failed");
        pd.setProperty("errors", e.getBindingResult().getFieldErrors().stream()
                .map(f -> f.getField() + ": " + f.getDefaultMessage()).toList());
        return pd;
    }
}

// src/main/java/in/ravindra/taskmanager/task/TaskNotFoundException.java
package in.ravindra.taskmanager.task;
public class TaskNotFoundException extends RuntimeException {
    public TaskNotFoundException(Long id) { super("Task " + id + " not found"); }
}

// src/main/java/in/ravindra/taskmanager/auth/EmailAlreadyUsedException.java
package in.ravindra.taskmanager.auth;
public class EmailAlreadyUsedException extends RuntimeException {
    public EmailAlreadyUsedException(String email) { super("Email already used: " + email); }
}

// ------------------------------------------------------------------
// Try it (after: docker compose up --build)
// ------------------------------------------------------------------
// 1) Register
// curl -s -X POST localhost:8080/api/auth/register -H 'Content-Type: application/json' \\
//   -d '{"email":"asha@example.in","password":"Asha@12345","fullName":"Asha Verma"}'
// -> 201 {"id":2}
//
// 2) Login and keep the token
// TOKEN=$(curl -s -X POST localhost:8080/api/auth/login -H 'Content-Type: application/json' \\
//   -d '{"email":"asha@example.in","password":"Asha@12345"}' | sed 's/.*"accessToken":"\\([^"]*\\)".*/\\1/')
//
// 3) Create a task
// curl -s -X POST localhost:8080/api/tasks -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \\
//   -d '{"title":"Prepare Spring Security interview notes","priority":"HIGH","dueDate":"2026-10-15"}'
// -> 201 Location: /api/tasks/1
//    {"id":1,"title":"Prepare Spring Security interview notes","description":null,"status":"TODO",
//     "priority":"HIGH","dueDate":"2026-10-15","ownerEmail":"asha@example.in"}
//
// 4) List my TODO tasks, page 0
// curl -s "localhost:8080/api/tasks?status=TODO&page=0&size=10" -H "Authorization: Bearer $TOKEN"
// -> {"items":[{...}],"page":0,"size":10,"totalElements":1,"totalPages":1,"hasNext":false}
//
// 5) Move it to IN_PROGRESS
// curl -s -X PATCH localhost:8080/api/tasks/1/status -H "Authorization: Bearer $TOKEN" \\
//   -H 'Content-Type: application/json' -d '{"status":"IN_PROGRESS"}'
//
// 6) Admin-only stats with Asha's token -> 403; with admin@taskmanager.in / Admin@123 -> 200
// curl -s localhost:8080/api/admin/stats -H "Authorization: Bearer $TOKEN"
// -> 403 {"type":"about:blank","title":"Forbidden","status":403,"detail":"You do not have permission for this action"}
// -> 200 {"TODO":0,"IN_PROGRESS":1,"DONE":0}   (as admin)
//
// 7) No token -> 401 ; tampered token -> 401 ; after 15 minutes -> 401 (ExpiredJwtException)`
    },
    {
      heading: "18. Summary and Course Wrap-Up",
      content: `• **JPA** is the specification, **Hibernate** the implementation, **Spring Data JPA** the repository layer on top. The persistence context tracks managed entities and dirty checking writes \`UPDATE\`s automatically inside \`@Transactional\`.
• Relationships: the \`@ManyToOne\` side owns the foreign key; \`@OneToMany(mappedBy)\` is the inverse. Keep both sides in sync, default every association to LAZY, cascade only parent–child, and avoid \`@Data\` on entities.
• Repositories generate queries from **method names**; switch to \`@Query\` JPQL for complex cases, use projections for read-only data, and \`@Modifying\` for bulk updates.
• **Pagination**: \`Pageable\` in, \`Page\` or \`Slice\` out; cap page size; map to your own response record; use keyset pagination for huge feeds.
• The **N+1 problem** is fixed with \`join fetch\`, \`@EntityGraph\`, \`default_batch_fetch_size\` or DTO projections, and detected with query-count tests. Set \`open-in-view=false\`.
• **Flyway** owns the schema with versioned, immutable SQL migrations; Hibernate only validates.
• **Spring Security** is a filter chain. Configure a \`SecurityFilterChain\` with the Spring Security 7 lambda DSL, a \`UserDetailsService\` backed by JPA, a \`BCryptPasswordEncoder\`, STATELESS sessions and CSRF off for bearer-token APIs.
• **JWT** = header.payload.signature; sign with a 256-bit-plus secret from the environment, keep access tokens short, verify in a \`OncePerRequestFilter\` and populate \`SecurityContextHolder\`.
• **Method security** with \`@PreAuthorize\`/\`@PostAuthorize\`; remember the \`ROLE_\` prefix rules; configure **CORS** inside Spring Security.
• **Ship it**: fat jar → layered multi-stage Docker image → environment-based config → health probes, structured logs, graceful shutdown, virtual threads → CI/CD.
**Course wrap-up.** You started this course with \`public static void main\` and \`System.out.println("Hello, Java")\`. Fifteen lectures later you can write object-oriented, generic, functional and concurrent Java; use records, sealed types and pattern matching from Java 17 to 25; test with JUnit 5 and Mockito; build and document REST APIs with Spring Boot; persist data with Spring Data JPA; secure services with Spring Security and JWT; and deploy them with Docker. That is the complete skill set a Java backend developer is expected to bring to a job in 2026.
**What to do next:**
1. Finish the hands-on exercise, push it to GitHub with a README, a Dockerfile and a GitHub Actions workflow, and deploy it on a free tier so you have a live URL to show recruiters.
2. Extend it: refresh tokens, email verification, Testcontainers integration tests, Redis caching with \`@Cacheable\`, and OpenAPI docs with springdoc.
3. Learn the next layer: Spring Cloud and microservices (API gateway, config server, resilience with Resilience4j), messaging with Kafka, and observability with Micrometer tracing and Grafana.
4. Revise the interview sections of every lecture before interviews; they cover the questions asked most often in Indian product and service companies.
Thank you for completing the Complete Java Course. Keep building, keep reading source code, and keep your Java version current — Java 25 is the LTS today, and the language will keep moving. All the best for your interviews and projects.
**Next lecture:** none — this is the final lecture of the Complete Java Course. Return to the course index to revisit any topic.`
    }
  ]
};
