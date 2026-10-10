export const lecture14 = {
  slug: "lecture-14",
  number: 14,
  title: "Complete Java Course — Lecture 14: Building REST APIs with Spring Boot",
  summary: "Build REST APIs with Spring Boot 4: Spring ecosystem, dependency injection and IoC, Spring Initializr, @RestController, path variables and request params, DTOs with records, Jakarta Bean Validation, service and repository layers, @ControllerAdvice with ProblemDetail, profiles and MockMvc tests.",
  readTime: "54 min read",
  difficulty: "Advanced",
  date: "2026-10-09",
  sections: [
    {
      heading: "1. Introduction: What Is Spring Boot and Why REST APIs with Spring Boot Matter",
      content: `In the previous lecture you learned how a Java project is built with Maven or Gradle and tested with JUnit 5 and Mockito. From this lecture onward we use those tools to build what most Java developers in India are actually paid to build: **backend REST APIs** that power mobile apps, web frontends and other services.
A **REST API** (Representational State Transfer) exposes resources such as \`/api/students\` or \`/api/orders/42\` over HTTP. Clients use standard HTTP methods (GET to read, POST to create, PUT/PATCH to update, DELETE to remove), send and receive **JSON**, and rely on **status codes** (200 OK, 201 Created, 400 Bad Request, 404 Not Found, 500 Internal Server Error) to understand what happened. Whether you look at Zomato, Paytm, Flipkart, HDFC Bank or a two-person startup in Bengaluru, their Java backends are REST (or REST-like) services, and the overwhelming majority of them are built with **Spring Boot**.
**Spring Boot** is an opinionated layer on top of the Spring Framework. Plain Spring is extremely powerful but historically required a lot of XML or Java configuration before a single request could be served. Spring Boot fixes that with three ideas:
• **Starters** — a single dependency such as \`spring-boot-starter-webmvc\` pulls in Spring MVC, Jackson (JSON), an embedded Tomcat server and sensible logging, all with compatible versions.
• **Auto-configuration** — Spring Boot looks at the classpath and configures beans for you. If it sees Spring MVC and Jackson, it wires a JSON message converter; if it sees a JDBC driver and a datasource URL, it creates a connection pool.
• **Embedded server** — the application is a plain executable JAR with Tomcat inside. \`java -jar app.jar\` starts the API on port 8080; no separate application server to install.
**Versions used in this lecture.** The current major release is **Spring Boot 4.0** (general availability November 2025), built on **Spring Framework 7.0**, **Jakarta EE 11** APIs (Servlet 6.1, Bean Validation 3.1) and **Jackson 3** for JSON. Spring Boot 4 requires **Java 17 as the minimum** and fully supports **Java 21 and Java 25**; we write everything for Java 25, the current LTS, so records, sealed types, pattern matching, text blocks and virtual threads are all available. If your company is still on Spring Boot 3.x, the concepts are identical and we point out the few naming differences where they appear.
By the end of this lecture you will be able to create a project with Spring Initializr, understand its structure, write controllers that map URLs to Java methods, accept and validate JSON input, separate the code into controller, service and repository layers, return clean RFC 9457 error responses, configure the app per environment, and test it with MockMvc, which is exactly the checklist a hiring manager uses for a Java backend role.`
    },
    {
      heading: "2. Spring Ecosystem Overview: Spring Framework, Spring Boot, Spring MVC, Spring Data and Spring Security",
      content: `Beginners are often confused by the number of "Spring" names. Here is the map.
**Spring Framework** (2003, Rod Johnson) is the foundation. Its core module is the **IoC container** that creates and wires your objects (section 3). On top of the core sit modules for web applications (**Spring MVC** for servlet-based apps and **Spring WebFlux** for reactive, non-blocking apps), data access (JDBC templates, transaction management), AOP (aspect-oriented programming, used for \`@Transactional\` and caching) and testing. Spring Framework 7.0, released November 2025, is the current generation.
**Spring Boot** (2014) is not a replacement for the Spring Framework; it is the **packaging and configuration layer** that makes it productive: starters, auto-configuration, an embedded server, the \`application.properties\` / \`application.yml\` configuration model, **Actuator** for health checks and metrics, and a unified test support library. Spring Boot 4.0 is built on Spring Framework 7.0, and the version pairs always move together (Boot 3.x on Framework 6.x, Boot 4.x on Framework 7.x).
**Spring Data** removes repository boilerplate: with **Spring Data JPA** you declare an interface \`StudentRepository extends JpaRepository<Student, Long>\` and get CRUD, paging and derived queries like \`findByCityOrderByNameAsc\` without writing SQL. Spring Data also has modules for MongoDB, Redis, Elasticsearch and more. That is the next lecture.
**Spring Security** handles authentication (who are you: login, JWT, OAuth2) and authorisation (what may you do: roles, method security). Also the next lecture.
**Spring Cloud** adds microservice patterns: config servers, service discovery, API gateways, circuit breakers. Worth knowing by name for interviews.
**What changed in Spring Boot 4.0 that you must know.** Several starters were renamed to make the technology explicit: \`spring-boot-starter-web\` is now **\`spring-boot-starter-webmvc\`**, \`spring-boot-starter-aop\` became \`spring-boot-starter-aspectj\`, and each technology got a test companion such as \`spring-boot-starter-webmvc-test\`. The old names still work as deprecated "classic" starters, so older tutorials will not break immediately, but new projects should use the new names. The JSON library moved from Jackson 2 to **Jackson 3** (package \`tools.jackson\`, while the annotations such as \`@JsonProperty\` stay in \`com.fasterxml.jackson.annotation\`). The test annotation \`@MockBean\` was deprecated in Boot 3.4 and **removed in 4.0** in favour of Spring Framework's \`@MockitoBean\`. Also, Spring Boot 4 only supports Java 17 and above; Boot 3.x had the same baseline, so the real breaking change was from Boot 2.x (Java 8, \`javax.*\`) to Boot 3.x (Java 17, \`jakarta.*\`).
**Supported versions matter for interviews.** Spring Boot 3.5 open-source support ended on 30 June 2026, so a project starting today should be on Spring Boot 4.x. Being able to state these versions and baselines accurately is a small thing that signals you keep up with the ecosystem.`
    },
    {
      heading: "3. Dependency Injection and Inversion of Control in Spring: Beans, @Component and Constructor Injection",
      content: `Everything in Spring rests on two linked ideas.
**Inversion of Control (IoC)** means that your classes do not create their collaborators; a **container** creates them and hands them over. Without IoC, a \`StudentService\` would write \`this.repository = new JdbcStudentRepository(dataSource)\`, which hard-codes the implementation, makes unit testing painful and spreads construction logic everywhere. With IoC, the service just declares "I need a \`StudentRepository\`", and the container decides which implementation to supply. Control over object creation is inverted from your code to the framework.
**Dependency Injection (DI)** is the mechanism that implements IoC: the container **injects** the dependency, usually through the constructor. The objects managed by the container are called **beans**, and the container itself is the \`ApplicationContext\`.
How does Spring know which classes are beans? Through **component scanning**. \`@SpringBootApplication\` on your main class enables scanning of its package and all sub-packages for classes annotated with:
• \`@Component\` — a generic bean.
• \`@Service\` — a component that holds business logic (semantically the same as \`@Component\`, but clearer).
• \`@Repository\` — a data access component; Spring also translates database exceptions into its \`DataAccessException\` hierarchy for these.
• \`@Controller\` / \`@RestController\` — web request handlers.
• \`@Configuration\` classes containing \`@Bean\` methods — for beans you cannot annotate, such as a third-party \`ObjectMapper\`, \`RestClient\` or \`Clock\`.
**Constructor injection is the standard.** Since Spring 4.3, a class with exactly one constructor needs no \`@Autowired\`; Spring uses that constructor automatically. Make the fields \`final\`, and your class is immutable, impossible to construct in an invalid state, and trivial to unit test with \`new StudentService(new FakeRepository())\`. **Field injection** (\`@Autowired private StudentRepository repo;\`) still works but is discouraged: it hides dependencies, allows null fields, and forces reflection in tests. Setter injection is reserved for optional dependencies.
**Bean scope** is **singleton** by default: one instance per \`ApplicationContext\`, shared across all requests and threads. That is why a bean must not keep per-request state in instance fields (section 14). Other scopes (\`prototype\`, \`request\`, \`session\`) exist but are rare in REST APIs.
**Choosing between implementations.** If two beans implement the same interface, Spring throws \`NoUniqueBeanDefinitionException\` at startup. Resolve it with \`@Primary\` on the default, or \`@Qualifier("sms")\` at the injection point, or make one conditional with \`@Profile\` (section 11).
**Circular dependencies** (A needs B, B needs A) fail fast with constructor injection and \`BeanCurrentlyInCreationException\`. That failure is a feature: it tells you the design is wrong. Extract the shared logic into a third bean instead of enabling \`spring.main.allow-circular-references\`.`,
      codeSnippet: `// src/main/java/in/ravindra/campus/notify/Notifier.java
package in.ravindra.campus.notify;

public interface Notifier {
    void send(String mobile, String message);
}

// src/main/java/in/ravindra/campus/notify/SmsNotifier.java
package in.ravindra.campus.notify;

import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

@Component
@Primary                       // chosen when two Notifier beans exist
public class SmsNotifier implements Notifier {
    @Override
    public void send(String mobile, String message) {
        System.out.println("SMS to " + mobile + ": " + message);
    }
}

// src/main/java/in/ravindra/campus/notify/WhatsAppNotifier.java
package in.ravindra.campus.notify;

import org.springframework.stereotype.Component;

@Component("whatsapp")
public class WhatsAppNotifier implements Notifier {
    @Override
    public void send(String mobile, String message) {
        System.out.println("WhatsApp to " + mobile + ": " + message);
    }
}

// src/main/java/in/ravindra/campus/admission/AdmissionService.java
package in.ravindra.campus.admission;

import in.ravindra.campus.notify.Notifier;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

@Service
public class AdmissionService {

    private final Notifier primaryNotifier;     // SmsNotifier (@Primary)
    private final Notifier whatsAppNotifier;    // picked by name

    // Single constructor: @Autowired is implicit since Spring 4.3
    public AdmissionService(Notifier primaryNotifier,
                            @Qualifier("whatsapp") Notifier whatsAppNotifier) {
        this.primaryNotifier = primaryNotifier;
        this.whatsAppNotifier = whatsAppNotifier;
    }

    public void admit(String name, String mobile) {
        primaryNotifier.send(mobile, "Welcome " + name + ", your admission is confirmed.");
        whatsAppNotifier.send(mobile, "Fee receipt will be shared on WhatsApp.");
    }
}

// src/main/java/in/ravindra/campus/config/AppConfig.java
package in.ravindra.campus.config;

import java.time.Clock;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {
    @Bean
    public Clock clock() {           // a bean for a class you did not write
        return Clock.systemUTC();    // tests can replace it with Clock.fixed(...)
    }
}

// Unit test without Spring at all — this is why constructor injection wins:
// var service = new AdmissionService(new SmsNotifier(), new WhatsAppNotifier());
// service.admit("Priya", "+91-98xxxxxx12");`
    },
    {
      heading: "4. Creating a Project with Spring Initializr and Understanding the Spring Boot Project Structure",
      content: `**Spring Initializr** (start.spring.io) generates a ready-to-run project. It is also built into IntelliJ IDEA (New Project > Spring Boot) and VS Code (Spring Initializr extension). Choose:
• **Project:** Maven (or Gradle - Groovy/Kotlin). We use Maven here; the Gradle equivalent is a one-to-one mapping.
• **Language:** Java. **Spring Boot:** 4.0.x (the latest stable, not a SNAPSHOT or milestone).
• **Group:** \`in.ravindra\`, **Artifact:** \`campus\`, **Packaging:** Jar, **Java:** 25 (Initializr offers 17, 21 and 25).
• **Dependencies:** Spring Web (which adds \`spring-boot-starter-webmvc\`), Validation, and optionally Spring Boot DevTools for automatic restarts and Actuator for health endpoints.
Click Generate, unzip, open in your IDE and run \`./mvnw spring-boot:run\` (or \`mvnw.cmd\` on Windows). Within a few seconds you will see "Tomcat started on port 8080" and the API is live. The **Maven wrapper** (\`mvnw\`) downloads the exact Maven version the project needs, so teammates do not need Maven installed.
**Project structure** (Maven standard layout from the previous lecture, plus Spring conventions):
• \`pom.xml\` — inherits from \`spring-boot-starter-parent\`, which manages hundreds of dependency versions so you never write a version number for Spring-managed libraries.
• \`src/main/java/in/ravindra/campus/CampusApplication.java\` — the entry point with \`@SpringBootApplication\` and a \`main\` method calling \`SpringApplication.run\`.
• \`src/main/resources/application.properties\` (or \`.yml\`) — configuration.
• \`src/main/resources/static/\` and \`templates/\` — static files and server-rendered templates; mostly empty for a pure REST API.
• \`src/test/java/...\` — tests, including a generated \`contextLoads\` smoke test.
**Package layout is a design decision.** Two common styles: **layer-based** (\`controller\`, \`service\`, \`repository\`, \`dto\`, \`model\` packages) and **feature-based** (\`student\`, \`course\`, \`enrollment\` packages, each containing its own controller, service and repository). Layer-based is what most tutorials show; feature-based scales better because related code stays together and package-private visibility can hide internals. The hands-on exercise uses feature-based packaging.
The one hard rule: keep \`CampusApplication\` in the **root package** (\`in.ravindra.campus\`). Component scanning starts there; a controller placed in \`in.ravindra.web\` (a sibling, not a child) will silently never be registered, and every request will return 404.
**\`@SpringBootApplication\`** is a shortcut for three annotations: \`@SpringBootConfiguration\` (it is a configuration class), \`@EnableAutoConfiguration\` (turn on auto-configuration) and \`@ComponentScan\` (scan this package and below). Interviewers love this one.`,
      codeSnippet: `<!-- pom.xml (generated by Spring Initializr, trimmed) -->
<project xmlns="http://maven.apache.org/POM/4.0.0">
  <modelVersion>4.0.0</modelVersion>

  <parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>4.0.6</version>   <!-- use the latest 4.0.x shown on start.spring.io -->
    <relativePath/>
  </parent>

  <groupId>in.ravindra</groupId>
  <artifactId>campus</artifactId>
  <version>0.0.1-SNAPSHOT</version>

  <properties>
    <java.version>25</java.version>
  </properties>

  <dependencies>
    <!-- Spring MVC + Jackson 3 + embedded Tomcat (was spring-boot-starter-web in Boot 3.x) -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-webmvc</artifactId>
    </dependency>
    <!-- Jakarta Bean Validation 3.1 + Hibernate Validator -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    <!-- JUnit 5, Mockito, AssertJ, Spring Test -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-test</artifactId>
      <scope>test</scope>
    </dependency>
    <!-- Boot 4 test companion for Spring MVC: @WebMvcTest, MockMvc auto-config -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-webmvc-test</artifactId>
      <scope>test</scope>
    </dependency>
  </dependencies>

  <build>
    <plugins>
      <plugin>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-maven-plugin</artifactId>  <!-- builds the fat, runnable JAR -->
      </plugin>
    </plugins>
  </build>
</project>

// src/main/java/in/ravindra/campus/CampusApplication.java
package in.ravindra.campus;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication   // = @SpringBootConfiguration + @EnableAutoConfiguration + @ComponentScan
public class CampusApplication {
    public static void main(String[] args) {
        SpringApplication.run(CampusApplication.class, args);
    }
}

// Run:   ./mvnw spring-boot:run
// Build: ./mvnw clean package  ->  java -jar target/campus-0.0.1-SNAPSHOT.jar
// Expected log line: Tomcat started on port 8080 (http) with context path '/'`
    },
    {
      heading: "5. @RestController and Request Mappings: Mapping HTTP Methods to Java Methods in Spring MVC",
      content: `A **controller** is a bean whose methods handle HTTP requests. In Spring MVC two annotations do the job:
• \`@Controller\` marks the class as a web component; a method's return value is interpreted as a **view name** (for server-rendered HTML with Thymeleaf).
• \`@RestController\` = \`@Controller\` + \`@ResponseBody\`. Return values are written **directly to the response body**, serialised to JSON by Jackson. For REST APIs you always use \`@RestController\`.
**Request mappings** connect a URL and an HTTP method to a handler method:
• \`@RequestMapping("/api/students")\` on the class sets a common prefix.
• \`@GetMapping\`, \`@PostMapping\`, \`@PutMapping\`, \`@PatchMapping\`, \`@DeleteMapping\` on methods are shortcuts for \`@RequestMapping(method = ...)\`.
• Mappings can narrow further with \`consumes = "application/json"\`, \`produces = "application/json"\`, \`params\` or \`headers\`.
**The request flow.** An HTTP request reaches embedded Tomcat, which hands it to Spring's \`DispatcherServlet\` (the "front controller"). The dispatcher asks the \`HandlerMapping\` which controller method matches the URL and HTTP method, converts the request (JSON body, path variables, params) into method arguments via \`HttpMessageConverter\` and argument resolvers, invokes the method, and converts the return value back into an HTTP response. If an exception escapes, the dispatcher consults the \`HandlerExceptionResolver\` chain, which is where \`@ControllerAdvice\` plugs in (section 10). Being able to narrate this flow is a classic interview question.
**Return types.** Returning a POJO, record or list produces a 200 response with a JSON body. Returning \`ResponseEntity<T>\` gives you full control over the status code and headers: \`ResponseEntity.created(location).body(dto)\` for 201, \`ResponseEntity.noContent().build()\` for 204, \`ResponseEntity.notFound().build()\` for 404. Alternatively annotate the method with \`@ResponseStatus(HttpStatus.CREATED)\` and return the body directly, which is cleaner when the status never varies.
**Use the right verb and status.** GET must be safe (no side effects) and idempotent. PUT replaces a resource and is idempotent; PATCH partially updates. POST creates and is not idempotent. DELETE returns 204 with no body (or 200 with the deleted resource if the client needs it). Returning 200 for every outcome with an \`"error": true\` field in the body is the single most common API design mistake we see in code reviews.
**Naming.** URLs name resources as plural nouns (\`/api/students\`, \`/api/students/17/enrollments\`), never verbs (\`/getStudent\`). Version your API in the path (\`/api/v1/...\`) or a header from day one; retrofitting versioning is painful.`,
      codeSnippet: `// src/main/java/in/ravindra/campus/student/StudentController.java
package in.ravindra.campus.student;

import java.net.URI;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController                         // @Controller + @ResponseBody
@RequestMapping("/api/v1/students")     // common prefix for every method below
public class StudentController {

    private final StudentService service;

    public StudentController(StudentService service) {
        this.service = service;
    }

    // GET /api/v1/students  -> 200 OK with a JSON array
    @GetMapping
    public List<StudentResponse> all() {
        return service.findAll();
    }

    // GET /api/v1/students/17  -> 200 OK, or 404 via the exception handler
    @GetMapping("/{id}")
    public StudentResponse one(@PathVariable long id) {
        return service.findById(id);
    }

    // POST /api/v1/students  -> 201 Created + Location header
    @PostMapping(consumes = "application/json", produces = "application/json")
    public ResponseEntity<StudentResponse> create(@RequestBody StudentRequest request) {
        StudentResponse created = service.create(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(created.id()).toUri();
        return ResponseEntity.created(location).body(created);   // 201
    }

    // PUT /api/v1/students/17  -> 200 OK with the replaced resource
    @PutMapping("/{id}")
    public StudentResponse replace(@PathVariable long id, @RequestBody StudentRequest request) {
        return service.replace(id, request);
    }

    // DELETE /api/v1/students/17  -> 204 No Content
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable long id) {
        service.delete(id);
    }
}

/* Try it with curl once the app is running:
   curl -i http://localhost:8080/api/v1/students
   HTTP/1.1 200
   Content-Type: application/json
   [{"id":1,"name":"Priya Sharma","email":"priya@example.in","city":"Pune","age":21}]

   curl -i -X POST http://localhost:8080/api/v1/students \\
        -H "Content-Type: application/json" \\
        -d '{"name":"Arjun Mehta","email":"arjun@example.in","city":"Jaipur","age":22}'
   HTTP/1.1 201
   Location: http://localhost:8080/api/v1/students/2
*/`
    },
    {
      heading: "6. Path Variables, Request Parameters, Request Body and Headers in Spring Boot",
      content: `A handler method needs data from the request. Spring MVC supplies it through **argument annotations**, each converting raw strings into typed Java values.
**\`@PathVariable\`** binds a segment of the URL. \`@GetMapping("/{id}")\` with \`@PathVariable long id\` turns \`/students/17\` into \`id = 17\`. If the segment cannot be converted (\`/students/abc\`), Spring throws \`MethodArgumentTypeMismatchException\`, which maps to 400. Since Java 8 the parameter name is read from bytecode when compiled with \`-parameters\` (the Spring Boot Maven/Gradle plugins enable this automatically); if the names differ, use \`@PathVariable("studentId") long id\`. Path variables identify **which resource**: use them for IDs and natural keys.
**\`@RequestParam\`** binds query-string parameters: \`/students?city=Pune&page=0&size=20\`. Parameters are required by default; set \`required = false\` (then use \`Optional<String>\` or a nullable wrapper) or \`defaultValue = "0"\`. A missing required param throws \`MissingServletRequestParameterException\` (400). Request params are for **filtering, sorting and paging**, not for identifying a resource. Spring also binds multi-valued params (\`?tag=a&tag=b\`) into a \`List<String>\`.
**\`@RequestBody\`** deserialises the JSON body into an object using Jackson. The target can be a class with getters/setters or, better, a **record** (section 7). Malformed JSON throws \`HttpMessageNotReadableException\` (400). Only POST, PUT and PATCH should carry a body; a GET with a body is ignored by many proxies.
**\`@RequestHeader\`** reads a header, for example \`@RequestHeader("X-Request-Id") String requestId\` or \`@RequestHeader(value = "Accept-Language", defaultValue = "en-IN")\`. \`@CookieValue\` works the same way for cookies.
**Binding many params to an object.** When a search endpoint has eight optional filters, do not declare eight \`@RequestParam\` arguments. Declare a record \`StudentFilter(String city, Integer minAge, Integer maxAge)\` and accept it with \`@ModelAttribute StudentFilter filter\`; Spring binds query params to the record's components by name (constructor binding works for records since Spring 6.1).
**Pagination convention.** Accept \`page\` (0-based) and \`size\` with a sensible maximum (cap \`size\` at 100 to protect the database), and return metadata (\`totalElements\`, \`totalPages\`) alongside the \`content\` list. Spring Data's \`Pageable\` and \`Page<T>\` formalise this in the next lecture.
**Type conversion** is handled by Spring's \`ConversionService\`. Enums (\`?status=ACTIVE\`), \`LocalDate\` (\`?from=2026-10-01\`, with \`@DateTimeFormat(iso = DateTimeFormat.ISO.DATE)\`), \`UUID\` and numbers all convert automatically.`,
      codeSnippet: `// src/main/java/in/ravindra/campus/student/StudentQueryController.java
package in.ravindra.campus.student;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/students")
public class StudentQueryController {

    private final StudentService service;

    public StudentQueryController(StudentService service) {
        this.service = service;
    }

    // GET /api/v1/students/search?city=Pune&minAge=18&page=0&size=20
    @GetMapping("/search")
    public PagedResult<StudentResponse> search(
            @RequestParam(required = false) String city,          // optional filter
            @RequestParam(required = false) Integer minAge,
            @RequestParam(defaultValue = "0") int page,           // paging defaults
            @RequestParam(defaultValue = "20") int size,
            @RequestHeader(value = "X-Request-Id", required = false) String requestId) {

        int safeSize = Math.min(size, 100);                      // never trust client sizes
        return service.search(Optional.ofNullable(city), Optional.ofNullable(minAge), page, safeSize);
    }

    // GET /api/v1/students/admitted?from=2026-06-01&to=2026-06-30
    @GetMapping("/admitted")
    public List<StudentResponse> admittedBetween(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return service.admittedBetween(from, to);
    }

    // GET /api/v1/students/filter?city=Jaipur&minAge=20  -> bound to a record
    @GetMapping("/filter")
    public List<StudentResponse> filter(@ModelAttribute StudentFilter filter) {
        return service.filter(filter);
    }

    // GET /api/v1/students/17/enrollments/3  -> two path variables
    @GetMapping("/{studentId}/enrollments/{enrollmentId}")
    public String enrollment(@PathVariable long studentId, @PathVariable long enrollmentId) {
        return "student " + studentId + ", enrollment " + enrollmentId;
    }
}

// src/main/java/in/ravindra/campus/student/StudentFilter.java
package in.ravindra.campus.student;

public record StudentFilter(String city, Integer minAge, Integer maxAge) { }

// src/main/java/in/ravindra/campus/student/PagedResult.java
package in.ravindra.campus.student;

import java.util.List;

public record PagedResult<T>(List<T> content, int page, int size, long totalElements) {
    public int totalPages() {                        // serialised by Jackson as "totalPages"
        return size == 0 ? 0 : (int) Math.ceil((double) totalElements / size);
    }
}

/* Example response for /search?city=Pune&size=2
   {"content":[{"id":1,"name":"Priya Sharma","email":"priya@example.in","city":"Pune","age":21},
               {"id":4,"name":"Neha Kulkarni","email":"neha@example.in","city":"Pune","age":23}],
    "page":0,"size":2,"totalElements":5,"totalPages":3}
*/`
    },
    {
      heading: "7. DTOs with Java Records: Separating the API Contract from the Domain Model",
      content: `A **DTO (Data Transfer Object)** is a class whose only job is to carry data across a boundary, here between the HTTP layer and your service layer. Beginners often expose the domain or JPA entity directly from the controller. It works for a demo and causes real damage in production:
• **Over-exposure.** A \`User\` entity has \`passwordHash\`, \`aadhaarNumber\`, \`createdBy\`. Return the entity and Jackson serialises all of it.
• **Mass assignment.** If the entity is also the request type, a client can POST \`{"role":"ADMIN","balance":999999}\` and your \`save\` persists it.
• **Coupling.** Renaming a database column renames a JSON field and breaks every mobile app in the field. The API contract and the storage model must evolve independently.
• **Lazy-loading surprises.** Serialising a JPA entity with lazy relations triggers extra queries or \`LazyInitializationException\` inside Jackson.
So we define **request DTOs** (what the client may send) and **response DTOs** (what the client may see), and map between them and the domain model in the service layer.
**Java records are perfect DTOs.** A record (final since Java 16) gives you an immutable class with a canonical constructor, accessors, \`equals\`, \`hashCode\` and \`toString\` in one line. Jackson 3 (and Jackson 2.12+) deserialises records through the canonical constructor with no extra annotations, and the compact constructor is the place for normalisation such as trimming strings.
**Jackson essentials for DTOs.**
• \`@JsonProperty("full_name")\` renames a field; or set \`spring.jackson.property-naming-strategy=SNAKE_CASE\` globally.
• \`@JsonInclude(JsonInclude.Include.NON_NULL)\` omits null fields from the output.
• \`@JsonFormat(pattern = "dd-MM-yyyy")\` controls date formatting; by default Spring Boot writes \`LocalDate\` as ISO \`2026-10-09\`, which you should keep.
• \`@JsonIgnore\` hides a field; prefer a separate DTO over sprinkling ignores on the entity.
• Unknown properties in incoming JSON are **ignored** by default in Spring Boot (\`spring.jackson.deserialization.fail-on-unknown-properties=false\`), which is forgiving for clients but hides typos; some teams turn it on in dev.
**Mapping.** For a handful of DTOs, write static factory methods (\`StudentResponse.from(Student)\`) by hand; they are explicit, debuggable and fast. For dozens of DTOs, **MapStruct** generates the mapping code at compile time. Avoid reflection-based mappers (ModelMapper) in hot paths; they are slow and fail silently on renamed fields.
**One DTO per use case** is fine: \`CreateStudentRequest\`, \`UpdateStudentRequest\` (where every field is optional for PATCH) and \`StudentResponse\` may all differ slightly. Sharing one class with "sometimes required" fields leads to validation groups and confusion.`,
      codeSnippet: `// src/main/java/in/ravindra/campus/student/Student.java  (domain model — never leaves the service layer)
package in.ravindra.campus.student;

import java.time.LocalDate;

public class Student {
    private Long id;
    private String name;
    private String email;
    private String city;
    private int age;
    private String aadhaarNumber;     // sensitive — must never appear in API output
    private LocalDate admittedOn;

    public Student(Long id, String name, String email, String city, int age,
                   String aadhaarNumber, LocalDate admittedOn) {
        this.id = id; this.name = name; this.email = email; this.city = city;
        this.age = age; this.aadhaarNumber = aadhaarNumber; this.admittedOn = admittedOn;
    }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getCity() { return city; }
    public int getAge() { return age; }
    public String getAadhaarNumber() { return aadhaarNumber; }
    public LocalDate getAdmittedOn() { return admittedOn; }
}

// src/main/java/in/ravindra/campus/student/StudentRequest.java  (what the client may SEND)
package in.ravindra.campus.student;

public record StudentRequest(String name, String email, String city, int age) {
    public StudentRequest {                        // compact constructor: normalise input
        name = name == null ? null : name.strip();
        email = email == null ? null : email.strip().toLowerCase();
    }
}

// src/main/java/in/ravindra/campus/student/StudentResponse.java  (what the client may SEE)
package in.ravindra.campus.student;

import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)       // skip null fields in output
public record StudentResponse(Long id, String name, String email, String city,
                              int age, LocalDate admittedOn) {

    public static StudentResponse from(Student s) {   // explicit, hand-written mapping
        return new StudentResponse(s.getId(), s.getName(), s.getEmail(),
                                   s.getCity(), s.getAge(), s.getAdmittedOn());
        // aadhaarNumber is deliberately absent
    }
}

/* Serialised by Jackson 3:
   {"id":1,"name":"Priya Sharma","email":"priya@example.in","city":"Pune","age":21,"admittedOn":"2026-07-15"}
*/`
    },
    {
      heading: "8. Validation with Jakarta Bean Validation: @Valid, Constraint Annotations and Custom Validators",
      content: `Never trust input. A REST API receives JSON from browsers, mobile apps, scripts and attackers, and every field must be checked before it reaches the business logic. Java's standard for this is **Jakarta Bean Validation** (specification version 3.1 in Jakarta EE 11, implemented by **Hibernate Validator**), which Spring Boot wires up when \`spring-boot-starter-validation\` is on the classpath.
**Declaring constraints.** Annotate DTO fields (record components) with constraints from \`jakarta.validation.constraints\`:
• \`@NotNull\`, \`@NotBlank\` (non-null and at least one non-whitespace character; for strings), \`@NotEmpty\` (for collections).
• \`@Size(min = 2, max = 60)\`, \`@Min(16)\`, \`@Max(60)\`, \`@Positive\`, \`@PositiveOrZero\`, \`@DecimalMin("0.0")\`.
• \`@Email\`, \`@Pattern(regexp = "^[6-9]\\\\d{9}$")\` for an Indian mobile number.
• \`@Past\`, \`@PastOrPresent\`, \`@Future\` for dates.
• Each takes a \`message\` attribute; messages can be externalised to \`ValidationMessages.properties\` for localisation.
**Triggering validation.** Put \`@Valid\` on the \`@RequestBody\` parameter. Spring validates the object before calling your method; on failure it throws \`MethodArgumentNotValidException\`, which Spring Boot turns into a **400 Bad Request**. With \`spring.mvc.problemdetails.enabled=true\` (section 10) the response is already an RFC 9457 problem; the handler in section 10 adds the per-field messages.
**Nested objects and collections** need \`@Valid\` on the field too (\`@Valid List<AddressRequest> addresses\`), otherwise only the top level is checked.
**Validating path variables and request params.** Add constraints directly to the parameters: \`@PathVariable @Positive long id\`, \`@RequestParam @Min(1) @Max(100) int size\`. Since Spring Framework 6.1 (Boot 3.2+) this **built-in method validation** is applied automatically to controllers whenever a Validator is present and constraints are declared on parameters; you no longer need \`@Validated\` on the class for this. Failures raise \`HandlerMethodValidationException\` (400). On service-layer beans you still use \`@Validated\` on the class to enable method validation, and violations there raise \`ConstraintViolationException\`.
**\`@Valid\` versus \`@Validated\`.** \`@Valid\` is the Jakarta annotation that cascades validation to an object; \`@Validated\` is Spring's annotation that enables method-level validation on a bean and supports **validation groups** (for example \`OnCreate\` versus \`OnUpdate\` rules). Interviewers ask this frequently.
**Custom constraints.** When the built-ins are not enough, write your own: an annotation plus a \`ConstraintValidator\` implementation. The example below defines \`@IndianPincode\`. Custom validators are Spring beans, so they can inject repositories to check, for example, that an email is not already registered, though uniqueness checks under concurrency still need a database constraint as the final guard.
**Where validation belongs.** Syntactic rules (format, length, range) belong on DTOs at the boundary. Business rules ("a student cannot enrol in more than 6 courses") belong in the service layer and throw domain exceptions, not validation annotations.`,
      codeSnippet: `// src/main/java/in/ravindra/campus/student/StudentRequest.java  (validated version)
package in.ravindra.campus.student;

import in.ravindra.campus.validation.IndianPincode;
import jakarta.validation.constraints.*;

public record StudentRequest(
        @NotBlank(message = "name is required")
        @Size(min = 2, max = 60, message = "name must be 2 to 60 characters")
        String name,

        @NotBlank @Email(message = "email must be valid")
        String email,

        @NotBlank String city,

        @Min(value = 16, message = "age must be at least 16")
        @Max(value = 60, message = "age must be at most 60")
        int age,

        @Pattern(regexp = "^[6-9]\\\\d{9}$", message = "mobile must be a 10-digit Indian number")
        String mobile,

        @IndianPincode                                 // custom constraint below
        String pincode
) { }

// src/main/java/in/ravindra/campus/validation/IndianPincode.java
package in.ravindra.campus.validation;

import java.lang.annotation.*;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

@Documented
@Constraint(validatedBy = IndianPincodeValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER, ElementType.RECORD_COMPONENT})
@Retention(RetentionPolicy.RUNTIME)
public @interface IndianPincode {
    String message() default "pincode must be 6 digits and cannot start with 0";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

// src/main/java/in/ravindra/campus/validation/IndianPincodeValidator.java
package in.ravindra.campus.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class IndianPincodeValidator implements ConstraintValidator<IndianPincode, String> {
    @Override
    public boolean isValid(String value, ConstraintValidatorContext ctx) {
        if (value == null) return true;           // let @NotNull decide null-ness
        return value.matches("^[1-9][0-9]{5}$");
    }
}

// In the controller: @Valid triggers validation of the body,
// constraints on params are validated automatically (Spring 6.1+)
//
// @PostMapping
// public ResponseEntity<StudentResponse> create(@Valid @RequestBody StudentRequest request) { ... }
//
// @GetMapping("/{id}")
// public StudentResponse one(@PathVariable @Positive long id) { ... }

/* POST with {"name":"A","email":"not-an-email","city":"","age":12,"mobile":"12345","pincode":"012345"}
   -> 400 Bad Request. After section 10's handler the body looks like:
   {"type":"about:blank","title":"Validation failed","status":400,
    "detail":"6 field(s) are invalid","instance":"/api/v1/students",
    "errors":{"name":"name must be 2 to 60 characters","email":"email must be valid",
              "city":"must not be blank","age":"age must be at least 16",
              "mobile":"mobile must be a 10-digit Indian number",
              "pincode":"pincode must be 6 digits and cannot start with 0"}}
*/`
    },
    {
      heading: "9. Service and Repository Layers: Layered Architecture in a Spring Boot REST API",
      content: `A controller that talks to the database directly is easy to write and impossible to maintain. Production Spring Boot APIs use a **three-layer architecture**, and each layer has a single responsibility:
**Controller (web layer).** Knows about HTTP and nothing else: parses the request, validates the DTO, calls one service method, maps the result to a response and status code. A controller method should be 3 to 10 lines. It never contains \`if (student.getAge() < 18)\` logic and never touches a repository.
**Service (business layer).** Contains the use cases: "admit a student", "enrol in a course", "generate a fee receipt". It orchestrates repositories, enforces business rules, throws domain exceptions (\`StudentNotFoundException\`, \`DuplicateEmailException\`) and defines **transaction boundaries** with \`@Transactional\` once a database is involved. Services are plain Java, which is why they are the easiest layer to unit test with Mockito, as you learned in Lecture 13.
**Repository (persistence layer).** Knows how to load and store domain objects. In this lecture it is an in-memory \`ConcurrentHashMap\` behind an interface; in the next lecture it becomes a Spring Data JPA interface. Because the service depends on the **interface** \`StudentRepository\`, swapping the implementation changes nothing above it. That is dependency inversion in practice.
**Why the separation pays off.**
• **Testability** — each layer is tested in isolation: controllers with MockMvc and a mocked service (section 12), services with Mockito, repositories with a real database in a \`@DataJpaTest\`.
• **Reuse** — the same \`EnrollmentService\` serves the REST controller, a scheduled job and a Kafka listener.
• **Changeability** — replacing the in-memory store with PostgreSQL, or adding a REST client for a payment gateway, touches one layer.
**Exceptions as the contract between layers.** The service throws meaningful unchecked exceptions; it does not return \`null\` or a magic \`-1\`. The web layer translates those exceptions into HTTP status codes in one central place (section 10). This keeps controllers free of try/catch blocks.
**Thread safety.** Services and repositories are singletons shared by all request threads (Tomcat uses a pool of 200 by default, or one virtual thread per request when \`spring.threads.virtual.enabled=true\` on Java 21+). The in-memory repository therefore uses \`ConcurrentHashMap\` and \`AtomicLong\` for the ID sequence; a plain \`HashMap\` would corrupt under load.
**A note on "anemic" versus "rich" domain models.** In the simple style shown here the domain class is mostly data and the service holds the rules. As systems grow, pushing invariants into the domain objects themselves (so a \`Student\` cannot exist with a negative age) is worth learning under the name Domain-Driven Design. For a first API, the layered style is exactly what interviewers expect.`,
      codeSnippet: `// src/main/java/in/ravindra/campus/student/StudentRepository.java
package in.ravindra.campus.student;

import java.util.List;
import java.util.Optional;

public interface StudentRepository {
    Student save(Student student);          // insert or update
    Optional<Student> findById(long id);
    List<Student> findAll();
    boolean existsByEmail(String email);
    void deleteById(long id);
}

// src/main/java/in/ravindra/campus/student/InMemoryStudentRepository.java
package in.ravindra.campus.student;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.stereotype.Repository;

@Repository
public class InMemoryStudentRepository implements StudentRepository {

    private final Map<Long, Student> store = new ConcurrentHashMap<>();   // shared by all threads
    private final AtomicLong sequence = new AtomicLong();

    @Override
    public Student save(Student student) {
        if (student.getId() == null) student.setId(sequence.incrementAndGet());
        store.put(student.getId(), student);
        return student;
    }
    @Override public Optional<Student> findById(long id) { return Optional.ofNullable(store.get(id)); }
    @Override public List<Student> findAll() { return List.copyOf(store.values()); }
    @Override public boolean existsByEmail(String email) {
        return store.values().stream().anyMatch(s -> s.getEmail().equalsIgnoreCase(email));
    }
    @Override public void deleteById(long id) { store.remove(id); }
}

// src/main/java/in/ravindra/campus/student/StudentNotFoundException.java
package in.ravindra.campus.student;

public class StudentNotFoundException extends RuntimeException {
    public StudentNotFoundException(long id) { super("Student " + id + " not found"); }
}

// src/main/java/in/ravindra/campus/student/DuplicateEmailException.java
package in.ravindra.campus.student;

public class DuplicateEmailException extends RuntimeException {
    public DuplicateEmailException(String email) { super("Email already registered: " + email); }
}

// src/main/java/in/ravindra/campus/student/StudentService.java
package in.ravindra.campus.student;

import java.time.Clock;
import java.time.LocalDate;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class StudentService {

    private final StudentRepository repository;
    private final Clock clock;                         // injected so tests can freeze time

    public StudentService(StudentRepository repository, Clock clock) {
        this.repository = repository;
        this.clock = clock;
    }

    public List<StudentResponse> findAll() {
        return repository.findAll().stream().map(StudentResponse::from).toList();
    }

    public StudentResponse findById(long id) {
        return repository.findById(id).map(StudentResponse::from)
                .orElseThrow(() -> new StudentNotFoundException(id));
    }

    public StudentResponse create(StudentRequest req) {
        if (repository.existsByEmail(req.email())) {            // business rule
            throw new DuplicateEmailException(req.email());
        }
        Student student = new Student(null, req.name(), req.email(), req.city(),
                                      req.age(), null, LocalDate.now(clock));
        return StudentResponse.from(repository.save(student));
    }

    public StudentResponse replace(long id, StudentRequest req) {
        Student existing = repository.findById(id).orElseThrow(() -> new StudentNotFoundException(id));
        Student updated = new Student(existing.getId(), req.name(), req.email(), req.city(),
                                      req.age(), existing.getAadhaarNumber(), existing.getAdmittedOn());
        return StudentResponse.from(repository.save(updated));
    }

    public void delete(long id) {
        repository.findById(id).orElseThrow(() -> new StudentNotFoundException(id));
        repository.deleteById(id);
    }
}`
    },
    {
      heading: "10. Exception Handling in Spring Boot with @ControllerAdvice, @ExceptionHandler and ProblemDetail (RFC 9457)",
      content: `When something goes wrong, the client needs a response that is **consistent**, **machine-readable** and **does not leak internals**. Spring gives you three building blocks.
**\`@ExceptionHandler\`** on a method says "when this exception type escapes a handler, call me instead". Inside a controller it applies only to that controller.
**\`@ControllerAdvice\`** (or \`@RestControllerAdvice\`, which adds \`@ResponseBody\`) is a bean whose \`@ExceptionHandler\` methods apply to **every controller**. This is where all exception-to-HTTP translation lives, in one file, so controllers stay clean.
**\`ProblemDetail\`** (Spring Framework 6.0+) is a standard body shape defined by **RFC 9457 "Problem Details for HTTP APIs"** (the successor of RFC 7807). It has five standard fields, \`type\` (a URI identifying the problem category), \`title\`, \`status\`, \`detail\` and \`instance\` (the request path), plus any extra properties you add with \`setProperty\`. Its content type is \`application/problem+json\`. Using a standard shape means frontend and mobile teams write one error parser for all your services.
**Turn on built-in problem details** with \`spring.mvc.problemdetails.enabled=true\`. Spring Boot then registers a \`ResponseEntityExceptionHandler\` that converts framework exceptions (unsupported media type, missing parameter, malformed JSON, no handler found, validation failure) into \`ProblemDetail\` responses automatically. Your own advice class should **extend \`ResponseEntityExceptionHandler\`** so you can override specific hooks (for example to add field errors to validation failures) while inheriting the rest.
**Mapping domain exceptions.** For each business exception write an \`@ExceptionHandler\` returning a \`ProblemDetail\` (Spring picks the status from it) or a \`ResponseEntity<ProblemDetail>\`. Alternatively make the exception itself extend \`ErrorResponseException\`, which carries a status and \`ProblemDetail\`; Spring then needs no handler at all. Both approaches are valid; the advice class is more explicit and keeps HTTP concerns out of the domain.
**The catch-all.** A final handler for \`Exception\` returns a 500 with a generic detail ("An unexpected error occurred") and logs the stack trace with a correlation id. Never put \`ex.getMessage()\` from an unknown exception into the response: SQL fragments, file paths and class names are exactly what an attacker wants. Spring Boot also hides the \`message\` field in its default error body for the same reason (\`server.error.include-message=never\` is the default).
**Status code cheat sheet.** 400 malformed or invalid input; 401 not authenticated; 403 authenticated but not allowed; 404 resource not found; 405 wrong method; 409 conflict (duplicate email, optimistic lock failure); 415 unsupported media type; 422 is sometimes used for semantic validation errors, but Spring Boot's default for validation failures is 400 and consistency matters more than the choice; 500 unexpected error; 503 downstream dependency unavailable.
**Ordering.** When several handlers could match, Spring picks the most specific exception type, so the \`Exception\` catch-all does not swallow \`StudentNotFoundException\`.`,
      codeSnippet: `# src/main/resources/application.properties
spring.mvc.problemdetails.enabled=true

// src/main/java/in/ravindra/campus/web/GlobalExceptionHandler.java
package in.ravindra.campus.web;

import java.net.URI;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;
import in.ravindra.campus.student.DuplicateEmailException;
import in.ravindra.campus.student.StudentNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // 404 — domain "not found"
    @ExceptionHandler(StudentNotFoundException.class)
    ProblemDetail handleNotFound(StudentNotFoundException ex) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
        pd.setTitle("Student not found");
        pd.setType(URI.create("https://api.example.in/problems/student-not-found"));
        pd.setProperty("timestamp", Instant.now());
        return pd;                                   // Spring uses pd.getStatus() -> 404
    }

    // 409 — business conflict
    @ExceptionHandler(DuplicateEmailException.class)
    ProblemDetail handleDuplicate(DuplicateEmailException ex) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, ex.getMessage());
        pd.setTitle("Duplicate email");
        pd.setType(URI.create("https://api.example.in/problems/duplicate-email"));
        return pd;
    }

    // 400 — @Valid failures: override the inherited hook to add per-field messages
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
                                                                  HttpHeaders headers,
                                                                  HttpStatusCode status,
                                                                  WebRequest request) {
        Map<String, String> errors = new LinkedHashMap<>();
        for (FieldError fe : ex.getBindingResult().getFieldErrors()) {
            errors.putIfAbsent(fe.getField(), fe.getDefaultMessage());
        }
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST,
                errors.size() + " field(s) are invalid");
        pd.setTitle("Validation failed");
        pd.setProperty("errors", errors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(pd);
    }

    // 500 — catch-all: log everything, reveal nothing
    @ExceptionHandler(Exception.class)
    ProblemDetail handleUnexpected(Exception ex) {
        String errorId = UUID.randomUUID().toString();
        log.error("Unhandled error {}", errorId, ex);
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR,
                "An unexpected error occurred. Quote error id " + errorId + " to support.");
        pd.setTitle("Internal error");
        pd.setProperty("errorId", errorId);
        return pd;
    }
}

/* GET /api/v1/students/999
   HTTP/1.1 404
   Content-Type: application/problem+json
   {"type":"https://api.example.in/problems/student-not-found","title":"Student not found",
    "status":404,"detail":"Student 999 not found","instance":"/api/v1/students/999",
    "timestamp":"2026-10-09T08:15:42.117Z"}
*/`
    },
    {
      heading: "11. Spring Boot Configuration: application.properties, YAML, Profiles and @ConfigurationProperties",
      content: `Code should not change between your laptop, the test server and production; **configuration** should. Spring Boot's externalised configuration model is one of its best features.
**Property sources and precedence.** Spring Boot reads configuration from many places and later sources override earlier ones. From lowest to highest priority (simplified): defaults in code, \`application.properties\` / \`application.yml\` inside the JAR, the same files next to the JAR or in a \`config/\` folder, profile-specific files (\`application-prod.yml\`), OS **environment variables**, Java system properties (\`-Dserver.port=9090\`) and command-line arguments (\`--server.port=9090\`). Environment variables use **relaxed binding**: \`SPRING_DATASOURCE_URL\` maps to \`spring.datasource.url\`, which is how Docker and Kubernetes inject secrets.
**Properties or YAML?** Both work identically. YAML is more readable for nested keys and lists, but is indentation-sensitive. Pick one per project; do not mix.
**Placeholders and defaults.** \`\${APP_SMS_API_KEY:dev-key}\` reads an environment variable and falls back to \`dev-key\`. This is the standard way to keep secrets out of source control. Never commit real credentials; use environment variables, a secrets manager or Spring Cloud Config / Vault.
**Profiles** select a set of beans and properties per environment. Activate with \`spring.profiles.active=dev\` (property, env var \`SPRING_PROFILES_ACTIVE\`, or \`--spring.profiles.active=prod\`). Then \`application-dev.yml\` overrides \`application.yml\`. Several profiles can be active (\`dev,local\`), and **profile groups** (\`spring.profiles.group.prod=prod-db,prod-mail\`) bundle them. Mark beans with \`@Profile("dev")\` or \`@Profile("!prod")\` to include them only in some environments, for example an in-memory repository in dev and a JPA one in prod. In YAML, \`---\` separates documents and \`spring.config.activate.on-profile\` ties a document to a profile, so one file can hold all environments for small projects.
**Reading properties in code.** \`@Value("\${app.max-page-size}")\` works for single values but scatters string keys. The better approach is **\`@ConfigurationProperties(prefix = "app")\`** bound to a **record**: all related settings in one typed, validated, immutable object. Since Spring Boot 3.0, records bind through their constructor without \`@ConstructorBinding\`; add \`@Validated\` and constraint annotations so a wrong value fails at startup rather than at 2 a.m. Register the record with \`@EnableConfigurationProperties(AppProperties.class)\` on a configuration class or \`@ConfigurationPropertiesScan\` on the application class. Add \`spring-boot-configuration-processor\` as an optional dependency to get IDE autocompletion for your keys.
**Useful web properties.** \`server.port\`, \`server.servlet.context-path=/campus\`, \`spring.jackson.default-property-inclusion=non_null\`, \`spring.mvc.problemdetails.enabled=true\`, \`spring.threads.virtual.enabled=true\` (one virtual thread per request on Java 21+), \`logging.level.in.ravindra=DEBUG\`, \`management.endpoints.web.exposure.include=health,info,metrics\` for Actuator.
**Startup check.** Spring logs "The following 1 profile is active: prod" at boot. If you see "No active profile set, falling back to 1 default profile: default", your activation did not take; that single log line has ended many deployment debugging sessions.`,
      codeSnippet: `# src/main/resources/application.yml  (shared defaults)
spring:
  application:
    name: campus
  mvc:
    problemdetails:
      enabled: true
  jackson:
    default-property-inclusion: non_null
  threads:
    virtual:
      enabled: true          # Java 21+: one virtual thread per request
server:
  port: 8080
app:
  max-page-size: 100
  sms:
    sender-id: CAMPUS
    api-key: \${APP_SMS_API_KEY:dev-key}    # env var with a fallback — never commit real keys
logging:
  level:
    in.ravindra: INFO

---
# profile-specific document (same file) — or put it in application-dev.yml
spring:
  config:
    activate:
      on-profile: dev
server:
  port: 8081
logging:
  level:
    in.ravindra: DEBUG
    org.springframework.web: DEBUG

---
spring:
  config:
    activate:
      on-profile: prod
app:
  max-page-size: 50

// src/main/java/in/ravindra/campus/config/AppProperties.java
package in.ravindra.campus.config;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "app")
public record AppProperties(
        @Min(1) @Max(500) int maxPageSize,     // binds app.max-page-size (relaxed binding)
        Sms sms) {

    public record Sms(@NotBlank String senderId, @NotBlank String apiKey) { }
}

// src/main/java/in/ravindra/campus/config/AppConfig.java  (registration)
package in.ravindra.campus.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties(AppProperties.class)
public class AppConfig { }

// Profile-specific bean: only in the "dev" profile
// @Repository
// @Profile("dev")
// public class InMemoryStudentRepository implements StudentRepository { ... }

// Run with a profile:
//   ./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
//   java -jar target/campus-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
//   SPRING_PROFILES_ACTIVE=prod APP_SMS_API_KEY=real-key java -jar target/campus-0.0.1-SNAPSHOT.jar
// Log: The following 1 profile is active: "prod"`
    },
    {
      heading: "12. Testing Spring Boot Controllers with MockMvc, @WebMvcTest and @MockitoBean",
      content: `Lecture 13 covered unit tests with JUnit 5 and Mockito. Controllers need something more: the request must travel through Spring MVC's real machinery (routing, JSON conversion, validation, exception handlers) without starting a network server. That is what **MockMvc** does.
**\`@WebMvcTest(StudentController.class)\`** starts a **slice** of the application context containing only the web layer: the named controller, \`@ControllerAdvice\` beans, Jackson, validation and MVC configuration. Services, repositories and data sources are **not** loaded, so the test starts in about a second instead of ten. Dependencies the controller needs are replaced with mocks using **\`@MockitoBean\`** (Spring Framework 6.2+). The older \`@MockBean\` was deprecated in Spring Boot 3.4 and **removed in Spring Boot 4.0**; if you see it in a tutorial, that tutorial predates 2025.
**Writing a MockMvc test.** Inject \`MockMvc\`, then \`mockMvc.perform(get("/api/v1/students/1"))\` and chain expectations: \`.andExpect(status().isOk())\`, \`.andExpect(jsonPath("$.name").value("Priya Sharma"))\`, \`.andExpect(header().exists("Location"))\`. Static imports from \`MockMvcRequestBuilders\` and \`MockMvcResultMatchers\` keep the code readable. \`andDo(print())\` dumps the full request and response when a test fails.
**JsonPath** expressions query the JSON body: \`$.id\`, \`$.errors.email\`, \`$[0].city\`, \`$.length()\`. They let you assert on structure without deserialising the whole response.
**What to test at this layer.** Status codes, the Location header on create, JSON field names and values, validation failures producing 400 with the right field messages, exception translation (404 and 409 bodies), content negotiation. Do not retest business logic here; that belongs in the service unit tests with Mockito.
**MockMvcTester (AssertJ style).** Spring Framework 6.2 added \`MockMvcTester\`, an AssertJ-based fluent API that is auto-configured by \`@WebMvcTest\` alongside \`MockMvc\`: \`assertThat(mvc.get().uri("/api/v1/students/1")).hasStatusOk().bodyJson().extractingPath("$.name").isEqualTo("Priya Sharma")\`. Both styles are supported; MockMvc with Hamcrest matchers is still the most common in codebases and interviews.
**Full-stack tests.** \`@SpringBootTest(webEnvironment = RANDOM_PORT)\` boots the entire application on a real port, and you call it with \`TestRestTemplate\` or \`RestClient\`. Use it sparingly for a few end-to-end "happy path" checks; the web slice plus service unit tests give better feedback at a fraction of the cost. With a real database, **Testcontainers** spins up PostgreSQL in Docker for these tests (next lecture).
**Test naming and structure.** Follow the Given/When/Then layout and name tests after behaviour: \`create_returns400_whenEmailInvalid\`. Interviewers reading your GitHub profile notice this.`,
      codeSnippet: `// src/test/java/in/ravindra/campus/student/StudentControllerTest.java
package in.ravindra.campus.student;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDate;
import java.util.List;
import in.ravindra.campus.web.GlobalExceptionHandler;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;   // Boot 4 package
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(StudentController.class)          // web slice: controller + advice + Jackson + validation
@Import(GlobalExceptionHandler.class)         // advice beans in other packages are picked up anyway; explicit is clearer
class StudentControllerTest {

    @Autowired MockMvc mockMvc;
    @MockitoBean StudentService service;      // replaces the real bean inside the slice

    @Test
    void getById_returns200AndJson_whenStudentExists() throws Exception {
        given(service.findById(1L)).willReturn(
                new StudentResponse(1L, "Priya Sharma", "priya@example.in", "Pune", 21, LocalDate.of(2026, 7, 15)));

        mockMvc.perform(get("/api/v1/students/1").accept(MediaType.APPLICATION_JSON))
               .andDo(print())
               .andExpect(status().isOk())
               .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
               .andExpect(jsonPath("$.id").value(1))
               .andExpect(jsonPath("$.name").value("Priya Sharma"))
               .andExpect(jsonPath("$.admittedOn").value("2026-07-15"))
               .andExpect(jsonPath("$.aadhaarNumber").doesNotExist());
    }

    @Test
    void getById_returns404ProblemDetail_whenMissing() throws Exception {
        given(service.findById(999L)).willThrow(new StudentNotFoundException(999L));

        mockMvc.perform(get("/api/v1/students/999"))
               .andExpect(status().isNotFound())
               .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON))
               .andExpect(jsonPath("$.title").value("Student not found"))
               .andExpect(jsonPath("$.detail").value("Student 999 not found"))
               .andExpect(jsonPath("$.instance").value("/api/v1/students/999"));
    }

    @Test
    void create_returns201WithLocation_whenValid() throws Exception {
        given(service.create(any(StudentRequest.class))).willReturn(
                new StudentResponse(2L, "Arjun Mehta", "arjun@example.in", "Jaipur", 22, LocalDate.of(2026, 10, 9)));

        String body = """
                {"name":"Arjun Mehta","email":"arjun@example.in","city":"Jaipur",
                 "age":22,"mobile":"9876543210","pincode":"302001"}
                """;

        mockMvc.perform(post("/api/v1/students").contentType(MediaType.APPLICATION_JSON).content(body))
               .andExpect(status().isCreated())
               .andExpect(header().string("Location", "http://localhost/api/v1/students/2"))
               .andExpect(jsonPath("$.id").value(2));

        verify(service).create(any(StudentRequest.class));
    }

    @Test
    void create_returns400WithFieldErrors_whenInvalid() throws Exception {
        String body = """
                {"name":"A","email":"not-an-email","city":"","age":12,"mobile":"123","pincode":"012345"}
                """;

        mockMvc.perform(post("/api/v1/students").contentType(MediaType.APPLICATION_JSON).content(body))
               .andExpect(status().isBadRequest())
               .andExpect(jsonPath("$.title").value("Validation failed"))
               .andExpect(jsonPath("$.errors.email").value("email must be valid"))
               .andExpect(jsonPath("$.errors.age").value("age must be at least 16"))
               .andExpect(jsonPath("$.errors.pincode").exists());
        // the service is never called when validation fails
    }

    @Test
    void getAll_returnsArray() throws Exception {
        given(service.findAll()).willReturn(List.of(
                new StudentResponse(1L, "Priya Sharma", "priya@example.in", "Pune", 21, null),
                new StudentResponse(2L, "Arjun Mehta", "arjun@example.in", "Jaipur", 22, null)));

        mockMvc.perform(get("/api/v1/students"))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.length()").value(2))
               .andExpect(jsonPath("$[1].city").value("Jaipur"));
    }
}

// Run: ./mvnw test        Expected: Tests run: 5, Failures: 0, Errors: 0`
    },
    {
      heading: "13. Real-World Use Cases: How Spring Boot REST APIs Are Used in Production",
      content: `The patterns in this lecture are not academic. Here is how they appear in real Indian and global systems.
**Fintech and banking.** UPI apps, payment gateways and bank middleware expose REST APIs for balance enquiry, fund transfer and statement download. Validation is strict (IFSC format, amount limits, mandatory fields), every error is a ProblemDetail with a stable \`type\` URI that the mobile app maps to a localised message, and idempotency keys on POST prevent double debits when a client retries. Profiles separate UAT (connected to a sandbox bank switch) from production.
**E-commerce and food delivery.** Catalogue, cart, order and delivery-tracking services are separate Spring Boot applications. Controllers are thin; services enforce rules such as "an order can be cancelled only before it is picked up". DTOs decouple the mobile app's JSON contract from the database schema, which lets the backend team refactor tables without a forced app update.
**Government and education platforms.** Admission portals, scholarship systems and exam-result APIs see enormous traffic spikes on result day. Pagination limits, virtual threads (\`spring.threads.virtual.enabled=true\`) and stateless singletons let a modest cluster absorb the load; Actuator health endpoints feed the Kubernetes liveness and readiness probes.
**Microservices and API gateways.** A Spring Boot service is typically one bounded context (students, courses, payments). An API gateway (Spring Cloud Gateway) routes \`/api/v1/students/**\` to the student service. Consistent error formats across services are what make a gateway able to pass errors through untouched.
**Internal tools and integrations.** HR, CRM and reporting dashboards call REST endpoints built exactly as in this lecture. Many "AI" features in Indian startups are a Spring Boot API that validates input, calls a model provider over HTTP with \`RestClient\`, and returns a DTO.
**Mobile and frontend backends.** React, Angular, Flutter and React Native apps consume these APIs. The frontend course on this site (Next.js lectures) shows the client side; the \`fetch("/api/v1/students")\` there lands on the \`@GetMapping\` you wrote here.
**Interview reality.** Backend rounds at Indian product companies and service companies routinely include a live task: "build a CRUD API for X with validation and proper error handling, and show me a test". Everything needed for that 45-minute task is in sections 4 to 12.`
    },
    {
      heading: "14. Common Mistakes with Spring Boot REST APIs and How to Fix Them",
      content: `**1. Controllers outside the root package.** Symptom: every endpoint returns 404 and no "Mapped ... onto" lines appear in the debug log. Fix: keep \`@SpringBootApplication\` in the top package and all components below it, or add \`scanBasePackages\`.
**2. Field injection everywhere.** \`@Autowired private StudentService service;\` hides dependencies, allows nulls and blocks plain unit tests. Fix: constructor injection with \`final\` fields; one constructor needs no annotation.
**3. Returning entities from controllers.** Leaks sensitive columns, enables mass assignment, and couples JSON to the schema. Fix: request and response DTOs as records, mapped in the service.
**4. Forgetting \`@Valid\`.** Constraints on the DTO are silently ignored without \`@Valid\` on the \`@RequestBody\` parameter, and nested objects need \`@Valid\` on the field too. Fix: add \`@Valid\`; write a 400 test so it can never regress.
**5. Business logic in controllers.** \`if (repository.existsByEmail(...))\` in a controller cannot be reused by a scheduled job and is hard to unit test. Fix: move rules to the service and expose them through domain exceptions.
**6. try/catch in every controller method.** Duplicated, inconsistent error bodies. Fix: one \`@RestControllerAdvice\` with \`ProblemDetail\`; controllers never catch.
**7. Leaking exception messages in 500 responses.** Stack traces and SQL in JSON are a security finding. Fix: catch-all handler with a generic detail and an error id; log the stack trace server-side.
**8. Returning 200 for everything.** \`{"success":false,"error":"not found"}\` with status 200 breaks HTTP clients, caches and monitoring. Fix: correct status codes (201, 204, 400, 404, 409) and \`ResponseEntity\` when the status varies.
**9. Mutable state in singletons.** A \`List<Order> currentOrders\` field in a \`@Service\` is shared by all request threads and will corrupt. Fix: keep services stateless; per-request data lives in method parameters and local variables; shared caches use concurrent structures.
**10. Using \`@MockBean\` with Spring Boot 4.** Compilation error: the annotation was removed. Fix: \`@MockitoBean\` from \`org.springframework.test.context.bean.override.mockito\`.
**11. Old starter names and Jackson 2 imports after upgrading.** \`spring-boot-starter-web\` still resolves as a deprecated classic starter, but mixing it with the new modules causes confusion; Jackson's core classes moved to \`tools.jackson\`. Fix: follow the Spring Boot 4.0 migration guide and the OpenRewrite recipes, and rename to \`spring-boot-starter-webmvc\`.
**12. Unbounded page sizes.** \`?size=1000000\` can take down the database. Fix: clamp the size and read the limit from \`@ConfigurationProperties\`.
**13. Secrets in application.yml committed to Git.** Fix: placeholders with environment variables (\`\${DB_PASSWORD}\`), and a \`.gitignore\` for local override files.
**14. Trailing-slash and case assumptions.** Since Spring Framework 6.0, \`/students\` and \`/students/\` are different URLs (trailing-slash matching is off by default). Fix: be consistent in the API and document it; do not re-enable the deprecated matching option.`,
      codeSnippet: `// Mistake 2 and 9 together, then the fix

// BAD
// @Service
// public class ReportService {
//     @Autowired private StudentRepository repository;   // field injection
//     private List<String> lines = new ArrayList<>();      // shared mutable state!
//
//     public String build(long id) {
//         lines.clear();                                   // two requests clear each other's data
//         lines.add("Report for " + repository.findById(id).orElseThrow().getName());
//         return String.join("\\n", lines);
//     }
// }

// GOOD
package in.ravindra.campus.report;

import java.util.ArrayList;
import java.util.List;
import in.ravindra.campus.student.StudentNotFoundException;
import in.ravindra.campus.student.StudentRepository;
import org.springframework.stereotype.Service;

@Service
public class ReportService {

    private final StudentRepository repository;        // constructor injection, immutable

    public ReportService(StudentRepository repository) {
        this.repository = repository;
    }

    public String build(long id) {
        List<String> lines = new ArrayList<>();        // per-request state is local
        var student = repository.findById(id).orElseThrow(() -> new StudentNotFoundException(id));
        lines.add("Report for " + student.getName());
        lines.add("City: " + student.getCity());
        return String.join("\\n", lines);
    }
}`
    },
    {
      heading: "15. Frequently Asked Questions about Building REST APIs with Spring Boot",
      content: `**What is the difference between Spring and Spring Boot?**
Spring (the Spring Framework) is the core container and the libraries built on it: dependency injection, Spring MVC, transactions, AOP. Spring Boot sits on top and removes the setup work with starters, auto-configuration, an embedded server and externalised configuration. You always use Spring when you use Spring Boot; Boot simply decides sensible defaults so you can focus on your endpoints.
**Which Java version do I need for Spring Boot 4?**
Spring Boot 4.0 requires Java 17 at minimum and officially supports Java 21 and Java 25. Use Java 25, the current LTS, for new projects so you get records, pattern matching, virtual threads and the latest performance work. Spring Boot 3.x also needs Java 17+; only Spring Boot 2.x supported Java 8 and 11, and it is out of open-source support.
**What is the difference between @Controller and @RestController?**
\`@Controller\` returns view names that a template engine renders into HTML. \`@RestController\` combines \`@Controller\` with \`@ResponseBody\`, so return values are written straight to the HTTP body as JSON. For a REST API use \`@RestController\`; for Thymeleaf pages use \`@Controller\`.
**What is the difference between @PathVariable and @RequestParam?**
\`@PathVariable\` reads a segment of the URL path, such as the \`17\` in \`/students/17\`, and identifies a specific resource. \`@RequestParam\` reads a query-string parameter such as \`?city=Pune\` and is used for filtering, sorting and pagination. Path variables are required by nature; request params can be optional with defaults.
**How do I handle exceptions globally in Spring Boot?**
Create a class annotated with \`@RestControllerAdvice\` and give it \`@ExceptionHandler\` methods that return \`ProblemDetail\`. Enable \`spring.mvc.problemdetails.enabled=true\` and extend \`ResponseEntityExceptionHandler\` to get RFC 9457 responses for the framework's own exceptions as well. Keep a catch-all for \`Exception\` that logs and returns a generic 500.
**What is the difference between @Valid and @Validated?**
\`@Valid\` is the Jakarta Bean Validation annotation that triggers validation of an object and cascades into nested objects. \`@Validated\` is Spring's annotation that turns on method-level validation for a bean and supports validation groups. In controllers you use \`@Valid\` on the request body; on service classes you use \`@Validated\` to validate method parameters.
**Why should I use DTOs instead of returning entities?**
Entities mirror the database and often contain sensitive or internal fields; returning them leaks data, allows clients to set fields they should not, and couples your API contract to your schema. DTOs, ideally Java records, define exactly what goes in and out, so each can evolve independently and validation lives on the request DTO.
**How do I test a Spring Boot REST controller without starting the server?**
Use \`@WebMvcTest(YourController.class)\` to load only the web layer, inject \`MockMvc\`, and replace the service with \`@MockitoBean\`. Then \`perform(get(...))\` and assert on \`status()\`, \`header()\` and \`jsonPath()\`. It runs in about a second and exercises routing, JSON, validation and your exception handlers.`
    },
    {
      heading: "16. Interview Questions and Answers on Spring Boot REST APIs",
      content: `**Q1. What does @SpringBootApplication do?**
It is a meta-annotation combining \`@SpringBootConfiguration\` (marks the class as a configuration source), \`@EnableAutoConfiguration\` (activates Spring Boot's conditional auto-configuration based on the classpath and properties) and \`@ComponentScan\` (scans the class's package and sub-packages for components). Placing it in the root package is what makes the whole application discoverable.
**Q2. Explain Inversion of Control and Dependency Injection, and why constructor injection is preferred.**
IoC means the container, not your code, creates and wires objects; DI is the technique of handing collaborators to a class from outside. Constructor injection is preferred because dependencies become explicit and mandatory, fields can be \`final\` (immutability and thread safety), circular dependencies fail fast, and the class can be unit tested with \`new\` and no Spring context. Since Spring 4.3 a single constructor needs no \`@Autowired\`.
**Q3. How does Spring Boot auto-configuration work?**
Auto-configuration classes are listed in \`META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports\` inside each module. Each is guarded by conditions such as \`@ConditionalOnClass\`, \`@ConditionalOnMissingBean\` and \`@ConditionalOnProperty\`. If the condition holds and you have not defined your own bean, Boot creates the default one. You can see the decisions with \`--debug\` (the condition evaluation report) and exclude classes with \`@SpringBootApplication(exclude = ...)\`.
**Q4. Describe the request flow for GET /api/v1/students/17 in Spring MVC.**
Tomcat accepts the connection and passes the request to \`DispatcherServlet\`. It consults \`RequestMappingHandlerMapping\` to find the handler method, then \`RequestMappingHandlerAdapter\` resolves arguments (\`@PathVariable\` via conversion, \`@RequestBody\` via an \`HttpMessageConverter\`), applies validation, invokes the method, and writes the return value through a message converter (Jackson) to the response. Exceptions are routed through \`HandlerExceptionResolver\`s, including your \`@ControllerAdvice\`.
**Q5. What is ProblemDetail and why use it?**
\`ProblemDetail\` is Spring's implementation of RFC 9457, a standard JSON error shape with \`type\`, \`title\`, \`status\`, \`detail\`, \`instance\` and custom properties, served as \`application/problem+json\`. It gives every service the same error contract, so clients and gateways parse errors uniformly, and the \`type\` URI acts as a stable error code that survives message wording changes.
**Q6. How do you validate request data and return meaningful errors?**
Annotate DTO fields with Jakarta Bean Validation constraints, add \`@Valid\` on the \`@RequestBody\` parameter, and override \`handleMethodArgumentNotValid\` in a \`ResponseEntityExceptionHandler\` subclass to collect \`FieldError\`s into a \`ProblemDetail\` property. For path variables and request params, constraints on the parameters are validated automatically since Spring 6.1 and raise \`HandlerMethodValidationException\`.
**Q7. What is the default bean scope and what does it imply for a REST service?**
Singleton: one instance per application context shared across all threads. Therefore services and controllers must be stateless; mutable per-request data must not live in fields. Other scopes exist (prototype, request, session, application) but are rare in stateless APIs.
**Q8. Difference between @WebMvcTest and @SpringBootTest?**
\`@WebMvcTest\` loads only the web slice (controllers, advice, converters, validation) with mocked dependencies via \`@MockitoBean\`; it is fast and focused on HTTP behaviour. \`@SpringBootTest\` loads the entire context and optionally a real server (\`webEnvironment = RANDOM_PORT\`); it is slow and used for a few integration or end-to-end checks.
**Q9. How do profiles work and how would you keep secrets out of Git?**
Profiles are named sets of configuration and beans activated by \`spring.profiles.active\`; \`application-{profile}.yml\` overrides the base file and \`@Profile\` conditions include or exclude beans. Secrets are injected through environment variables or a secrets manager and referenced with placeholders like \`\${DB_PASSWORD}\`, never written in committed files.
**Q10. What changed between Spring Boot 3 and Spring Boot 4 that affects a REST API?**
Spring Boot 4 (November 2025) is built on Spring Framework 7 and Jakarta EE 11, still requiring Java 17 and supporting Java 25. Starters were renamed (\`spring-boot-starter-web\` to \`spring-boot-starter-webmvc\`, plus per-technology test starters), Jackson 3 replaced Jackson 2 as the default JSON library, auto-configuration was split into technology-specific modules, and \`@MockBean\` was removed in favour of \`@MockitoBean\`. Annotations such as \`@RestController\`, \`@Valid\` and \`ProblemDetail\` are unchanged.`
    },
    {
      heading: "17. Hands-On Exercise: A Complete Course Catalogue REST API with Validation, ProblemDetail and MockMvc Tests",
      content: `Build a small but production-shaped API for a coaching institute's course catalogue. Requirements:
1. Create a Spring Boot 4 project on start.spring.io with Java 25, Maven, and the dependencies Spring Web and Validation (the \`pom.xml\` from section 4 is exactly right).
2. Resource: \`Course\` with \`id\`, \`code\` (like \`JAVA-101\`), \`title\`, \`feeInInr\`, \`seats\` and \`startDate\`.
3. Endpoints under \`/api/v1/courses\`: list (with optional \`?maxFee=\` filter), get by id, create (201 + Location), update (PUT), delete (204), and \`POST /{id}/enroll\` which decrements seats and returns 409 when the course is full.
4. Validate every input; respond with ProblemDetail for 400, 404 and 409.
5. Keep the code in one feature package, use records for DTOs, constructor injection, and an in-memory repository.
6. Write MockMvc tests for the create and enroll endpoints.
The complete solution follows. Each file is labelled with its path; type them into the generated project, run \`./mvnw spring-boot:run\`, then exercise the API with curl or Postman and run \`./mvnw test\`. Extend it afterwards: add pagination to the list endpoint, a \`PATCH\` for partial updates, and a \`@ConfigurationProperties\` record for the default seat count. In the next lecture this same project gets a real database with Spring Data JPA and JWT security.`,
      codeSnippet: `// ===== src/main/java/in/ravindra/campus/CampusApplication.java =====
package in.ravindra.campus;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CampusApplication {
    public static void main(String[] args) {
        SpringApplication.run(CampusApplication.class, args);
    }
}

// ===== src/main/resources/application.properties =====
// spring.application.name=campus
// spring.mvc.problemdetails.enabled=true
// spring.jackson.default-property-inclusion=non_null

// ===== src/main/java/in/ravindra/campus/course/Course.java =====
package in.ravindra.campus.course;

import java.math.BigDecimal;
import java.time.LocalDate;

public class Course {
    private Long id;
    private String code;
    private String title;
    private BigDecimal feeInInr;
    private int seats;
    private LocalDate startDate;

    public Course(Long id, String code, String title, BigDecimal feeInInr, int seats, LocalDate startDate) {
        this.id = id; this.code = code; this.title = title;
        this.feeInInr = feeInInr; this.seats = seats; this.startDate = startDate;
    }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCode() { return code; }
    public String getTitle() { return title; }
    public BigDecimal getFeeInInr() { return feeInInr; }
    public int getSeats() { return seats; }
    public LocalDate getStartDate() { return startDate; }

    public synchronized boolean tryEnroll() {          // guarded: no double-booking of the last seat
        if (seats <= 0) return false;
        seats--;
        return true;
    }
}

// ===== src/main/java/in/ravindra/campus/course/CourseRequest.java =====
package in.ravindra.campus.course;

import java.math.BigDecimal;
import java.time.LocalDate;
import jakarta.validation.constraints.*;

public record CourseRequest(
        @NotBlank @Pattern(regexp = "^[A-Z]{2,6}-\\\\d{3}$", message = "code must look like JAVA-101") String code,
        @NotBlank @Size(max = 80) String title,
        @NotNull @DecimalMin(value = "0.0") @DecimalMax(value = "500000.00") BigDecimal feeInInr,
        @Min(1) @Max(500) int seats,
        @NotNull @FutureOrPresent LocalDate startDate) { }

// ===== src/main/java/in/ravindra/campus/course/CourseResponse.java =====
package in.ravindra.campus.course;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CourseResponse(Long id, String code, String title, BigDecimal feeInInr,
                             int seatsLeft, LocalDate startDate) {
    static CourseResponse from(Course c) {
        return new CourseResponse(c.getId(), c.getCode(), c.getTitle(), c.getFeeInInr(),
                                  c.getSeats(), c.getStartDate());
    }
}

// ===== src/main/java/in/ravindra/campus/course/CourseRepository.java =====
package in.ravindra.campus.course;

import java.util.List;
import java.util.Optional;

public interface CourseRepository {
    Course save(Course course);
    Optional<Course> findById(long id);
    List<Course> findAll();
    boolean existsByCode(String code);
    void deleteById(long id);
}

// ===== src/main/java/in/ravindra/campus/course/InMemoryCourseRepository.java =====
package in.ravindra.campus.course;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.stereotype.Repository;

@Repository
class InMemoryCourseRepository implements CourseRepository {
    private final Map<Long, Course> store = new ConcurrentHashMap<>();
    private final AtomicLong seq = new AtomicLong();

    @Override public Course save(Course c) {
        if (c.getId() == null) c.setId(seq.incrementAndGet());
        store.put(c.getId(), c);
        return c;
    }
    @Override public Optional<Course> findById(long id) { return Optional.ofNullable(store.get(id)); }
    @Override public List<Course> findAll() {
        return store.values().stream().sorted(Comparator.comparing(Course::getId)).toList();
    }
    @Override public boolean existsByCode(String code) {
        return store.values().stream().anyMatch(c -> c.getCode().equalsIgnoreCase(code));
    }
    @Override public void deleteById(long id) { store.remove(id); }
}

// ===== src/main/java/in/ravindra/campus/course/CourseExceptions.java =====
package in.ravindra.campus.course;

public final class CourseExceptions {
    private CourseExceptions() { }

    public static class CourseNotFound extends RuntimeException {
        public CourseNotFound(long id) { super("Course " + id + " not found"); }
    }
    public static class DuplicateCode extends RuntimeException {
        public DuplicateCode(String code) { super("Course code already exists: " + code); }
    }
    public static class CourseFull extends RuntimeException {
        public CourseFull(String code) { super("No seats left in " + code); }
    }
}

// ===== src/main/java/in/ravindra/campus/course/CourseService.java =====
package in.ravindra.campus.course;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import in.ravindra.campus.course.CourseExceptions.*;
import org.springframework.stereotype.Service;

@Service
public class CourseService {
    private final CourseRepository repo;

    public CourseService(CourseRepository repo) { this.repo = repo; }

    public List<CourseResponse> list(Optional<BigDecimal> maxFee) {
        return repo.findAll().stream()
                .filter(c -> maxFee.map(m -> c.getFeeInInr().compareTo(m) <= 0).orElse(true))
                .map(CourseResponse::from).toList();
    }

    public CourseResponse get(long id) {
        return CourseResponse.from(find(id));
    }

    public CourseResponse create(CourseRequest r) {
        if (repo.existsByCode(r.code())) throw new DuplicateCode(r.code());
        Course c = new Course(null, r.code().toUpperCase(), r.title(), r.feeInInr(), r.seats(), r.startDate());
        return CourseResponse.from(repo.save(c));
    }

    public CourseResponse replace(long id, CourseRequest r) {
        Course existing = find(id);
        Course updated = new Course(existing.getId(), r.code().toUpperCase(), r.title(),
                                    r.feeInInr(), r.seats(), r.startDate());
        return CourseResponse.from(repo.save(updated));
    }

    public void delete(long id) {
        find(id);
        repo.deleteById(id);
    }

    public CourseResponse enroll(long id) {
        Course c = find(id);
        if (!c.tryEnroll()) throw new CourseFull(c.getCode());
        return CourseResponse.from(c);
    }

    private Course find(long id) {
        return repo.findById(id).orElseThrow(() -> new CourseNotFound(id));
    }
}

// ===== src/main/java/in/ravindra/campus/course/CourseController.java =====
package in.ravindra.campus.course;

import java.math.BigDecimal;
import java.net.URI;
import java.util.List;
import java.util.Optional;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/api/v1/courses")
public class CourseController {
    private final CourseService service;

    public CourseController(CourseService service) { this.service = service; }

    @GetMapping
    public List<CourseResponse> list(@RequestParam(required = false) BigDecimal maxFee) {
        return service.list(Optional.ofNullable(maxFee));
    }

    @GetMapping("/{id}")
    public CourseResponse get(@PathVariable @Positive long id) {
        return service.get(id);
    }

    @PostMapping
    public ResponseEntity<CourseResponse> create(@Valid @RequestBody CourseRequest request) {
        CourseResponse created = service.create(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(created.id()).toUri();
        return ResponseEntity.created(location).body(created);
    }

    @PutMapping("/{id}")
    public CourseResponse replace(@PathVariable @Positive long id, @Valid @RequestBody CourseRequest request) {
        return service.replace(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable @Positive long id) {
        service.delete(id);
    }

    @PostMapping("/{id}/enroll")
    public CourseResponse enroll(@PathVariable @Positive long id) {
        return service.enroll(id);
    }
}

// ===== src/main/java/in/ravindra/campus/web/ApiExceptionHandler.java =====
package in.ravindra.campus.web;

import java.net.URI;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;
import in.ravindra.campus.course.CourseExceptions.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@RestControllerAdvice
public class ApiExceptionHandler extends ResponseEntityExceptionHandler {
    private static final Logger log = LoggerFactory.getLogger(ApiExceptionHandler.class);
    private static final String BASE = "https://api.example.in/problems/";

    @ExceptionHandler(CourseNotFound.class)
    ProblemDetail notFound(CourseNotFound ex) {
        return problem(HttpStatus.NOT_FOUND, "Course not found", ex.getMessage(), "course-not-found");
    }

    @ExceptionHandler(DuplicateCode.class)
    ProblemDetail duplicate(DuplicateCode ex) {
        return problem(HttpStatus.CONFLICT, "Duplicate course code", ex.getMessage(), "duplicate-code");
    }

    @ExceptionHandler(CourseFull.class)
    ProblemDetail full(CourseFull ex) {
        return problem(HttpStatus.CONFLICT, "Course full", ex.getMessage(), "course-full");
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
            HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        Map<String, String> errors = new LinkedHashMap<>();
        for (FieldError fe : ex.getBindingResult().getFieldErrors()) {
            errors.putIfAbsent(fe.getField(), fe.getDefaultMessage());
        }
        ProblemDetail pd = problem(HttpStatus.BAD_REQUEST, "Validation failed",
                errors.size() + " field(s) are invalid", "validation");
        pd.setProperty("errors", errors);
        return ResponseEntity.badRequest().body(pd);
    }

    @ExceptionHandler(Exception.class)
    ProblemDetail unexpected(Exception ex) {
        String errorId = UUID.randomUUID().toString();
        log.error("Unhandled error {}", errorId, ex);
        ProblemDetail pd = problem(HttpStatus.INTERNAL_SERVER_ERROR, "Internal error",
                "Unexpected error. Quote id " + errorId, "internal");
        pd.setProperty("errorId", errorId);
        return pd;
    }

    private static ProblemDetail problem(HttpStatus status, String title, String detail, String type) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(status, detail);
        pd.setTitle(title);
        pd.setType(URI.create(BASE + type));
        return pd;
    }
}

// ===== src/test/java/in/ravindra/campus/course/CourseControllerTest.java =====
package in.ravindra.campus.course;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import in.ravindra.campus.course.CourseExceptions.CourseFull;
import in.ravindra.campus.web.ApiExceptionHandler;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(CourseController.class)
@Import(ApiExceptionHandler.class)
class CourseControllerTest {

    @Autowired MockMvc mvc;
    @MockitoBean CourseService service;

    @Test
    void create_returns201_whenValid() throws Exception {
        given(service.create(any())).willReturn(new CourseResponse(
                1L, "JAVA-101", "Core Java", new BigDecimal("4999.00"), 30, LocalDate.of(2026, 11, 1)));

        mvc.perform(post("/api/v1/courses").contentType(MediaType.APPLICATION_JSON).content("""
                {"code":"JAVA-101","title":"Core Java","feeInInr":4999.00,"seats":30,"startDate":"2026-11-01"}
                """))
           .andExpect(status().isCreated())
           .andExpect(header().string("Location", "http://localhost/api/v1/courses/1"))
           .andExpect(jsonPath("$.code").value("JAVA-101"))
           .andExpect(jsonPath("$.seatsLeft").value(30));
    }

    @Test
    void create_returns400_whenCodeAndSeatsInvalid() throws Exception {
        mvc.perform(post("/api/v1/courses").contentType(MediaType.APPLICATION_JSON).content("""
                {"code":"java101","title":"Core Java","feeInInr":4999.00,"seats":0,"startDate":"2026-11-01"}
                """))
           .andExpect(status().isBadRequest())
           .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON))
           .andExpect(jsonPath("$.errors.code").value("code must look like JAVA-101"))
           .andExpect(jsonPath("$.errors.seats").exists());
    }

    @Test
    void enroll_returns409_whenCourseFull() throws Exception {
        given(service.enroll(7L)).willThrow(new CourseFull("JAVA-101"));

        mvc.perform(post("/api/v1/courses/7/enroll"))
           .andExpect(status().isConflict())
           .andExpect(jsonPath("$.title").value("Course full"))
           .andExpect(jsonPath("$.type").value("https://api.example.in/problems/course-full"));
    }
}

/* Manual run:
   ./mvnw spring-boot:run
   curl -i -X POST localhost:8080/api/v1/courses -H "Content-Type: application/json" \\
        -d '{"code":"JAVA-101","title":"Core Java","feeInInr":4999.00,"seats":1,"startDate":"2026-11-01"}'
   -> HTTP/1.1 201, Location: http://localhost:8080/api/v1/courses/1
   curl -i -X POST localhost:8080/api/v1/courses/1/enroll   -> 200 {"id":1,...,"seatsLeft":0}
   curl -i -X POST localhost:8080/api/v1/courses/1/enroll   -> 409 {"title":"Course full",...}
   curl -i localhost:8080/api/v1/courses/42                 -> 404 {"title":"Course not found",...}
   ./mvnw test                                              -> Tests run: 3, Failures: 0
*/`
    },
    {
      heading: "18. Summary",
      content: `• **Spring Boot** packages the Spring Framework with starters, auto-configuration and an embedded server; **Spring Boot 4.0** (November 2025) runs on Spring Framework 7, Jakarta EE 11 and Jackson 3, needs **Java 17+** and fully supports **Java 25**, the current LTS.
• **IoC and DI**: the container creates beans found by component scanning (\`@Component\`, \`@Service\`, \`@Repository\`, \`@RestController\`, \`@Configuration\` + \`@Bean\`) and injects them; use **constructor injection** with \`final\` fields; beans are **singletons** and must be stateless.
• **Spring Initializr** generates the project; keep the \`@SpringBootApplication\` class in the root package; \`spring-boot-starter-webmvc\` (renamed from \`spring-boot-starter-web\`) brings Spring MVC, JSON and Tomcat.
• **\`@RestController\`** + \`@GetMapping\` / \`@PostMapping\` / \`@PutMapping\` / \`@DeleteMapping\` map HTTP to methods; use \`ResponseEntity\` or \`@ResponseStatus\` for 201, 204 and friends.
• **\`@PathVariable\`** identifies a resource; **\`@RequestParam\`** filters and pages; **\`@RequestBody\`** carries JSON; bind many filters with \`@ModelAttribute\` to a record.
• **DTOs as records** separate the API contract from the domain model and prevent data leaks and mass assignment.
• **Jakarta Bean Validation 3.1**: constraints on DTOs, \`@Valid\` on the body, automatic parameter validation since Spring 6.1, custom \`ConstraintValidator\`s for domain formats.
• **Layers**: thin controllers, services with business rules and domain exceptions, repositories behind interfaces.
• **\`@RestControllerAdvice\` + \`ProblemDetail\`** (RFC 9457) centralise error handling; enable \`spring.mvc.problemdetails.enabled=true\`, extend \`ResponseEntityExceptionHandler\`, never leak internals in 500s.
• **Configuration**: \`application.yml\`, placeholders with environment variables for secrets, **profiles** per environment, typed \`@ConfigurationProperties\` records.
• **Testing**: \`@WebMvcTest\` + \`MockMvc\` + \`@MockitoBean\` (\`@MockBean\` is gone in Boot 4) for fast web-slice tests; \`@SpringBootTest\` for a few end-to-end checks.
**Next lecture:** Spring Data JPA, Spring Security with JWT & Deployment`
    }
  ]
};
