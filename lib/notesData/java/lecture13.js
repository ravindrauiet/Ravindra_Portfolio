export const lecture13 = {
  slug: "lecture-13",
  number: 13,
  title: "Complete Java Course — Lecture 13: Build Tools & Testing — Maven, Gradle, JUnit 5 & Mockito",
  summary: "Learn Java build tools and testing end to end: Maven pom.xml, lifecycle, dependencies and BOMs, Gradle with Kotlin DSL, JUnit 5 (Jupiter) assertions, lifecycle and parameterized tests, Mockito mocks and verification, AssertJ, JaCoCo code coverage and the TDD workflow, with interview questions.",
  readTime: "55 min read",
  difficulty: "Intermediate",
  date: "2026-10-09",
  sections: [
    {
      heading: "1. Introduction: Why Build Tools and Automated Testing Matter in Java Projects",
      content: `In the previous lecture you read files with NIO.2 and talked to a database with JDBC. Every example so far was compiled by hand with \`javac\` and run with \`java\`. That works for a 3-file program; it falls apart the moment a real project has 400 classes, 60 third-party JARs, a test suite, and five developers in Bengaluru, Pune and Hyderabad who all need the exact same build on their laptops and on the CI server.
A **build tool** automates everything between "source code in Git" and "deployable artifact": downloading libraries (dependencies) with the correct versions, compiling in the right order, running tests, measuring coverage, packaging a JAR or WAR, and publishing it. In the Java world two tools dominate: **Apache Maven** (XML configuration, convention over configuration, used by the majority of enterprise and Spring projects) and **Gradle** (Kotlin or Groovy DSL, faster incremental builds, the standard for Android and many large codebases). Every Spring Boot project you will build in the next lecture is a Maven or Gradle project, so this lecture is a prerequisite, not an optional detour.
**Automated testing** is the second half of professional Java. A unit test is a small program that calls your code with known inputs and checks the output automatically. The industry stack is:
• **JUnit 5 (Jupiter)** — the test framework that discovers and runs tests and provides assertions.
• **Mockito** — creates fake versions (mocks) of dependencies such as payment gateways or repositories so you can test one class in isolation.
• **AssertJ** — fluent, readable assertions (\`assertThat(list).containsExactly(...)\`).
• **JaCoCo** — measures which lines and branches your tests actually execute.
Why should a student care? Three reasons. First, **jobs**: "Have you written unit tests? Which build tool? What is the difference between \`@Mock\` and \`@InjectMocks\`?" are standard questions for freshers and 2 to 5 year developers alike. Second, **speed**: a team with a reliable test suite can refactor and ship daily; a team without one is afraid to touch its own code. Third, **correctness**: a GST calculation that is wrong by one paisa is invisible in a demo and a disaster in production, and a 10-line test catches it forever.
By the end of this lecture you will be able to create a Maven or Gradle project from scratch, understand every line of \`pom.xml\` and \`build.gradle.kts\`, write JUnit 5 tests with lifecycle hooks and parameterized data, mock collaborators with Mockito, assert fluently with AssertJ, enforce a coverage threshold with JaCoCo, and practice the test-driven development (TDD) loop.`
    },
    {
      heading: "2. Maven Fundamentals: pom.xml, Coordinates and the Standard Project Structure",
      content: `**Maven** is driven by one file at the project root: \`pom.xml\` (Project Object Model). It describes **what** the project is and **which** libraries it needs; Maven works out **how** to build it from conventions and plugins. Maven 3.9.x is the stable line used by almost every team; Maven 4 has been in release-candidate builds for a long time, so check maven.apache.org for its current status before adopting it. Maven itself needs only Java 8 to run, but your project can compile for Java 21 or 25 through the compiler settings shown below.
Every Maven project (and every library you depend on) is identified by three **coordinates**, often written \`groupId:artifactId:version\`:
• \`groupId\` — the organisation, usually a reversed domain such as \`in.ravindra\` or \`org.springframework.boot\`.
• \`artifactId\` — the project or module name, for example \`wallet-service\`.
• \`version\` — \`1.0.0\`, or \`1.0.0-SNAPSHOT\` for a version still under development (Maven re-downloads SNAPSHOTs; it caches release versions forever).
The \`packaging\` element (default \`jar\`; also \`war\`, \`pom\` for parent projects) decides what \`mvn package\` produces.
**Convention over configuration** is Maven's core idea. If you follow the standard layout, you need almost no configuration:
• \`src/main/java\` — production source code.
• \`src/main/resources\` — config files, \`application.properties\`, SQL scripts, templates.
• \`src/test/java\` — test code (never shipped in the JAR).
• \`src/test/resources\` — test-only config and fixture files.
• \`target/\` — everything Maven generates: compiled classes, test reports, the final JAR. Always in \`.gitignore\`.
The \`properties\` block is where you set the Java release and the UTF-8 encoding. \`maven.compiler.release\` (preferred over the older \`source\`/\`target\` pair) tells \`javac\` to compile against the API of that Java version, which catches accidental use of newer APIs. Use \`25\` for the current LTS (September 2025) or \`21\` for the previous LTS; both are fine for this course.
Finally, \`build/plugins\` is where you pin plugin versions. Maven warns if you leave them unpinned, and unpinned plugins make builds non-reproducible: the same commit can build differently next month. The snippet shows a minimal but production-grade \`pom.xml\` that you will extend in the following sections.`,
      codeSnippet: `<!-- pom.xml : minimal, production-grade Maven project -->
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
                             https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <!-- Coordinates: groupId:artifactId:version -->
  <groupId>in.ravindra</groupId>
  <artifactId>wallet-service</artifactId>
  <version>1.0.0-SNAPSHOT</version>
  <packaging>jar</packaging>

  <properties>
    <!-- Compile against the Java 25 API (use 21 if your JDK is 21) -->
    <maven.compiler.release>25</maven.compiler.release>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <junit.version>6.0.0</junit.version>
  </properties>

  <dependencies>
    <!-- JUnit Jupiter aggregator: api + engine + params -->
    <dependency>
      <groupId>org.junit.jupiter</groupId>
      <artifactId>junit-jupiter</artifactId>
      <version>\${junit.version}</version>
      <scope>test</scope>
    </dependency>
  </dependencies>

  <build>
    <plugins>
      <!-- Pin plugin versions for reproducible builds -->
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-compiler-plugin</artifactId>
        <version>3.14.0</version>
      </plugin>
      <plugin>
        <!-- Surefire runs unit tests during the "test" phase -->
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-surefire-plugin</artifactId>
        <version>3.5.3</version>
      </plugin>
    </plugins>
  </build>
</project>

<!-- Standard layout that Maven expects (no configuration needed):
wallet-service/
├── pom.xml
├── src/main/java/in/ravindra/wallet/Wallet.java
├── src/main/resources/application.properties
├── src/test/java/in/ravindra/wallet/WalletTest.java
└── target/            (generated, add to .gitignore)
-->`
    },
    {
      heading: "3. Maven Dependencies: Scopes, Transitive Resolution, dependencyManagement and BOMs",
      content: `A **dependency** is a library your code needs. You declare its coordinates; Maven downloads the JAR (and its own dependencies) from **Maven Central** into the local repository at \`~/.m2/repository\`, so the second build is offline and instant. Every dependency has a **scope** that controls where it is available:
• \`compile\` (default) — needed to compile and run; packaged with the app. Example: Jackson.
• \`test\` — only on the test classpath; never shipped. JUnit, Mockito, AssertJ.
• \`provided\` — needed to compile, but the runtime (an application server or Lombok's annotation processor) supplies it. Not packaged.
• \`runtime\` — not needed to compile, needed at runtime. The classic example is a JDBC driver such as \`postgresql\`: your code compiles against \`java.sql\` interfaces, the driver is only loaded at runtime.
• \`import\` — used only inside \`dependencyManagement\` to pull in a BOM (explained below).
**Transitive dependencies** are what makes Maven powerful and occasionally painful. If you depend on \`spring-boot-starter-web\`, Maven also pulls Spring MVC, Tomcat, Jackson and dozens of others. When two paths require different versions of the same library, Maven uses **nearest-wins** mediation: the version closest to your project in the dependency tree is chosen, and if two are equally close, the first declared wins. This is not "highest version wins", which surprises many developers. Run \`mvn dependency:tree\` to see the resolved graph, and use \`<exclusions>\` to remove a transitive dependency you do not want (for example, excluding \`commons-logging\` when you use SLF4J).
**dependencyManagement** lets a parent POM or your own POM declare versions in one place; child modules then list dependencies without a version. A **BOM** (Bill of Materials) is a special \`pom\`-packaged artifact that only contains a \`dependencyManagement\` block with a set of mutually compatible versions. JUnit publishes \`junit-bom\`, Spring Boot publishes \`spring-boot-dependencies\`, and importing one with \`<scope>import</scope>\` means you never fight version mismatches between, say, \`junit-jupiter-api\` and \`junit-jupiter-engine\`.
Two practical notes. First, since JUnit 6.0 (released 30 September 2025, requires Java 17) the Platform, Jupiter and Vintage artifacts share one version number; the Jupiter programming model and package names (\`org.junit.jupiter.api\`) are unchanged, so everything called "JUnit 5" in this lecture applies to JUnit 6, and the 5.13.x line remains for projects still on Java 8 to 16. Second, Mockito 5 requires Java 11 or newer and ships the inline mock maker by default, so you no longer add the separate \`mockito-inline\` artifact.`,
      codeSnippet: `<!-- pom.xml (excerpt): BOM import + managed versions + test stack -->
<properties>
  <maven.compiler.release>25</maven.compiler.release>
  <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
  <mockito.version>5.18.0</mockito.version>
  <assertj.version>3.27.3</assertj.version>
</properties>

<dependencyManagement>
  <dependencies>
    <!-- One BOM pins every JUnit artifact to a compatible version -->
    <dependency>
      <groupId>org.junit</groupId>
      <artifactId>junit-bom</artifactId>
      <version>6.0.0</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
  </dependencies>
</dependencyManagement>

<dependencies>
  <!-- No <version>: it comes from the BOM -->
  <dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <scope>test</scope>
  </dependency>
  <dependency>
    <groupId>org.mockito</groupId>
    <artifactId>mockito-junit-jupiter</artifactId>   <!-- brings mockito-core transitively -->
    <version>\${mockito.version}</version>
    <scope>test</scope>
  </dependency>
  <dependency>
    <groupId>org.assertj</groupId>
    <artifactId>assertj-core</artifactId>
    <version>\${assertj.version}</version>
    <scope>test</scope>
  </dependency>

  <!-- runtime scope: compiled against java.sql, driver loaded only at runtime -->
  <dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <version>42.7.7</version>
    <scope>runtime</scope>
  </dependency>

  <!-- Excluding an unwanted transitive dependency -->
  <dependency>
    <groupId>com.example</groupId>
    <artifactId>legacy-sdk</artifactId>
    <version>2.3.0</version>
    <exclusions>
      <exclusion>
        <groupId>commons-logging</groupId>
        <artifactId>commons-logging</artifactId>
      </exclusion>
    </exclusions>
  </dependency>
</dependencies>

<!-- Inspect what was actually resolved:
$ mvn dependency:tree
[INFO] in.ravindra:wallet-service:jar:1.0.0-SNAPSHOT
[INFO] +- org.junit.jupiter:junit-jupiter:jar:6.0.0:test
[INFO] |  +- org.junit.jupiter:junit-jupiter-api:jar:6.0.0:test
[INFO] |  +- org.junit.jupiter:junit-jupiter-params:jar:6.0.0:test
[INFO] |  \\- org.junit.jupiter:junit-jupiter-engine:jar:6.0.0:test
[INFO] +- org.mockito:mockito-junit-jupiter:jar:5.18.0:test
[INFO] |  \\- org.mockito:mockito-core:jar:5.18.0:test
[INFO] \\- org.assertj:assertj-core:jar:3.27.3:test
-->`
    },
    {
      heading: "4. The Maven Build Lifecycle: Phases, Plugins, Goals and Everyday Commands",
      content: `Maven does not have a script you write; it has a fixed **lifecycle** of **phases**, and plugins attach **goals** to those phases. When you run \`mvn package\`, Maven executes every phase of the default lifecycle up to and including \`package\`, in order. The phases you must know are:
1. \`validate\` — is the POM correct and complete?
2. \`compile\` — \`maven-compiler-plugin:compile\` compiles \`src/main/java\` into \`target/classes\`.
3. \`test-compile\` — compiles \`src/test/java\` into \`target/test-classes\`.
4. \`test\` — \`maven-surefire-plugin:test\` runs unit tests; a failure stops the build.
5. \`package\` — \`maven-jar-plugin:jar\` (or war) creates \`target/wallet-service-1.0.0-SNAPSHOT.jar\`.
6. \`verify\` — integration tests (\`maven-failsafe-plugin\`) and quality checks (JaCoCo thresholds) run here.
7. \`install\` — copies the artifact into \`~/.m2/repository\` so other local projects can depend on it.
8. \`deploy\` — uploads the artifact to a remote repository (Nexus, Artifactory, GitHub Packages).
There are three separate lifecycles: **default** (the list above), **clean** (deletes \`target/\`) and **site** (generates documentation). That is why the most common command is \`mvn clean verify\`: wipe the old output, then build and check everything. \`mvn clean install\` is the traditional "full build" but \`verify\` is enough unless another local project needs the JAR.
A **plugin goal** is a unit of work (\`compiler:compile\`, \`surefire:test\`, \`jacoco:report\`). Goals can be bound to phases (the defaults above) or invoked directly, for example \`mvn dependency:tree\` or \`mvn versions:display-dependency-updates\`, without running the lifecycle at all.
Useful flags you will use daily:
• \`-DskipTests\` — compile tests but do not run them (fast local packaging). \`-Dmaven.test.skip=true\` also skips compiling tests, which hides compile errors; avoid it.
• \`-Dtest=WalletServiceTest\` — run a single test class; \`-Dtest=WalletServiceTest#transfer*\` for matching methods.
• \`-o\` — offline mode, using only \`~/.m2\`.
• \`-pl module-name -am\` — build one module and the modules it depends on in a multi-module project.
• \`-q\` quiet, \`-X\` full debug output, \`-U\` force update of SNAPSHOT dependencies.
**Surefire test discovery**: by default Surefire runs classes whose names match \`Test*\`, \`*Test\`, \`*Tests\` or \`*TestCase\`. A class named \`WalletSpec\` is silently ignored, which is one of the most common "my tests do not run" problems. Reports land in \`target/surefire-reports/\` as plain text and XML that CI servers such as Jenkins and GitHub Actions parse.
The **Maven Wrapper** (\`mvnw\`, \`mvnw.cmd\`, generated by \`mvn wrapper:wrapper\`) downloads a pinned Maven version automatically, so every developer and the CI runner use the same Maven without installing anything. Spring Initializr projects ship with it; use \`./mvnw\` instead of \`mvn\` in scripts.`,
      codeSnippet: `# Everyday Maven commands and what they trigger

mvn clean verify            # clean lifecycle, then default lifecycle up to "verify"
mvn test                    # validate -> compile -> test-compile -> test
mvn package -DskipTests     # build the JAR without running tests
mvn -Dtest=WalletTest test  # run one test class
mvn dependency:tree         # plugin goal, no lifecycle
./mvnw clean verify         # same, via the wrapper (pinned Maven version)

# Typical output of "mvn clean verify" (trimmed):
# [INFO] Scanning for projects...
# [INFO] --- clean:3.4.1:clean (default-clean) @ wallet-service ---
# [INFO] --- resources:3.3.1:resources (default-resources) @ wallet-service ---
# [INFO] --- compiler:3.14.0:compile (default-compile) @ wallet-service ---
# [INFO] Compiling 6 source files with javac [debug release 25] to target/classes
# [INFO] --- compiler:3.14.0:testCompile (default-testCompile) @ wallet-service ---
# [INFO] --- surefire:3.5.3:test (default-test) @ wallet-service ---
# [INFO] Running in.ravindra.wallet.WalletTest
# [INFO] Tests run: 9, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.081 s
# [INFO] Running in.ravindra.wallet.WalletServiceTest
# [INFO] Tests run: 6, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.412 s
# [INFO] Results:
# [INFO] Tests run: 15, Failures: 0, Errors: 0, Skipped: 0
# [INFO] --- jar:3.4.2:jar (default-jar) @ wallet-service ---
# [INFO] Building jar: target/wallet-service-1.0.0-SNAPSHOT.jar
# [INFO] BUILD SUCCESS
# [INFO] Total time:  7.912 s`
    },
    {
      heading: "5. Gradle with Kotlin DSL: build.gradle.kts, Tasks, Toolchains and Why Teams Choose It",
      content: `**Gradle** solves the same problem as Maven with a different philosophy: the build is a **program** (written in Kotlin or Groovy) that builds a **task graph**, and Gradle only re-runs tasks whose inputs changed. On a large project this incremental model, plus the **build cache** and **configuration cache**, makes repeat builds dramatically faster than Maven's phase-by-phase approach. Gradle is the required build tool for Android and the default choice for Kotlin, Spring (both are supported by Spring Initializr), and many large companies' monorepos.
Gradle 9.0 (released 31 July 2025) requires Java 17 or newer to run the Gradle daemon; your code can still target other versions through **toolchains**. The **Kotlin DSL** (\`build.gradle.kts\`) has been the default for new projects generated by \`gradle init\` since Gradle 8.2; it gives you IDE autocompletion and compile-time checking that the older Groovy DSL (\`build.gradle\`) lacks. This lecture uses Kotlin DSL throughout.
A Gradle project has two files at the root:
• \`settings.gradle.kts\` — names the root project and lists subprojects (modules). Also the place for repository and plugin management.
• \`build.gradle.kts\` — the build script: plugins, group/version, repositories, dependencies, task configuration.
Key concepts mapped from Maven:
• **Plugins** add tasks and conventions. \`java\` gives you \`compileJava\`, \`test\`, \`jar\`; \`jacoco\` adds coverage; \`org.springframework.boot\` adds \`bootRun\` and \`bootJar\`.
• **Configurations** replace scopes: \`implementation\` (compile and runtime, not exposed to consumers), \`api\` (exposed; needs the \`java-library\` plugin), \`compileOnly\` (like \`provided\`), \`runtimeOnly\`, \`testImplementation\`, \`testRuntimeOnly\`.
• **Tasks** replace phases. \`./gradlew build\` runs \`assemble\` plus \`check\` (which includes \`test\`). \`./gradlew test --tests "in.ravindra.wallet.WalletTest"\` runs one class. \`./gradlew tasks\` lists everything.
• **Toolchains** (\`java { toolchain { languageVersion = JavaLanguageVersion.of(25) } }\`) make Gradle find or download a JDK 25 for compiling and testing even if the daemon runs on another JDK, so the whole team compiles identically.
Two Gradle-specific rules for JUnit: you must call \`useJUnitPlatform()\` in the \`test\` task, otherwise Gradle looks for JUnit 4 tests and reports "0 tests"; and since Gradle 9 you must declare \`testRuntimeOnly("org.junit.platform:junit-platform-launcher")\` explicitly, because Gradle no longer injects the launcher for you. Both omissions are silent and extremely common.
Like Maven, Gradle has a wrapper (\`gradlew\`, \`gradlew.bat\`, \`gradle/wrapper/gradle-wrapper.properties\`) that pins the Gradle version. Never commit a project without it, and always run \`./gradlew\`, not a globally installed \`gradle\`. Dependencies are cached in \`~/.gradle/caches\`, and \`build/\` is the output folder (the equivalent of Maven's \`target/\`).`,
      codeSnippet: `// settings.gradle.kts
rootProject.name = "wallet-service"

// build.gradle.kts  (Gradle 9.x, Kotlin DSL)
plugins {
    java          // compileJava, test, jar ...
    jacoco        // coverage tasks
}

group = "in.ravindra"
version = "1.0.0-SNAPSHOT"

repositories {
    mavenCentral()
}

java {
    // Gradle finds/downloads JDK 25 for compiling and running tests
    toolchain {
        languageVersion = JavaLanguageVersion.of(25)
    }
}

dependencies {
    // BOM via platform(): every org.junit.* artifact gets a consistent version
    testImplementation(platform("org.junit:junit-bom:6.0.0"))
    testImplementation("org.junit.jupiter:junit-jupiter")
    testImplementation("org.mockito:mockito-junit-jupiter:5.18.0")
    testImplementation("org.assertj:assertj-core:3.27.3")
    // Required explicitly since Gradle 9: the engine launcher
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")

    runtimeOnly("org.postgresql:postgresql:42.7.7")
}

tasks.test {
    useJUnitPlatform()                       // without this: "0 tests executed"
    testLogging {
        events("passed", "skipped", "failed")
    }
    finalizedBy(tasks.jacocoTestReport)      // always produce the coverage report
}

tasks.jacocoTestReport {
    dependsOn(tasks.test)
    reports {
        xml.required = true                   // for SonarQube / Codecov
        html.required = true                  // build/reports/jacoco/test/html/index.html
    }
}

// Commands:
// ./gradlew build                          -> compile, test, jar, coverage
// ./gradlew test --tests "*WalletTest"     -> one class
// ./gradlew dependencies --configuration testRuntimeClasspath
// ./gradlew build --scan                   -> shareable build report`
    },
    {
      heading: "6. JUnit 5 (Jupiter) Architecture and Writing Your First Unit Test",
      content: `**JUnit 5** is not one JAR but three sub-projects, and understanding them removes most dependency confusion:
• **JUnit Platform** — the foundation that discovers tests and launches them. Maven Surefire, Gradle and IntelliJ talk to the Platform, not to Jupiter directly. It defines the \`TestEngine\` API.
• **JUnit Jupiter** — the new programming model (annotations like \`@Test\`, \`@BeforeEach\`, assertions) and its \`TestEngine\`. "Writing JUnit 5 tests" means writing Jupiter tests. \`junit-jupiter-api\` is what you compile against; \`junit-jupiter-engine\` runs them; \`junit-jupiter-params\` adds parameterized tests. The \`junit-jupiter\` aggregator pulls all three.
• **JUnit Vintage** — an engine that runs old JUnit 3 and 4 tests on the Platform, for migration. It is deprecated as of JUnit 6.
JUnit 6.0 (September 2025) kept this architecture and these package names; it mainly raised the baseline to Java 17, unified version numbers and added Kotlin and nullability improvements. If a tutorial says JUnit 5, it still applies.
A **unit test** targets one unit (usually a class) in isolation, runs in milliseconds and needs no network, database or file system. The structure every good test follows is **Arrange, Act, Assert** (AAA): set up objects, call the method under test, check the result. One test should verify one behaviour; the name should state that behaviour so a failing test reads like a bug report: \`calculatesGstOnStandardRatedItem\` is far better than \`test1\`.
Jupiter conventions that differ from JUnit 4 and trip people up:
• Test classes and methods can be **package-private**; \`public\` is not required.
• \`@Test\` comes from \`org.junit.jupiter.api.Test\`, not \`org.junit.Test\` (JUnit 4). Mixing them means the test is never executed.
• Test classes must not be \`abstract\`, must have a single constructor, and \`@Test\` methods must return \`void\`.
• JUnit creates a **new instance of the test class for every test method** by default, so instance fields do not leak between tests.
The snippet shows a GST calculator and its first tests. Money is stored in paise as \`long\` (never \`double\`), the same discipline you will use in the hands-on exercise. Run \`mvn test\` and Surefire will find the class because its name ends in \`Test\`.`,
      codeSnippet: `// src/main/java/in/ravindra/billing/GstCalculator.java
package in.ravindra.billing;

public class GstCalculator {

    /** Returns GST in paise for an amount in paise at the given rate (e.g. 18 for 18%). */
    public long gstFor(long amountPaise, int ratePercent) {
        if (amountPaise < 0) throw new IllegalArgumentException("amount cannot be negative");
        if (ratePercent != 0 && ratePercent != 5 && ratePercent != 12
                && ratePercent != 18 && ratePercent != 28) {
            throw new IllegalArgumentException("invalid GST slab: " + ratePercent);
        }
        // Math.round avoids the truncation bug of plain integer division
        return Math.round(amountPaise * ratePercent / 100.0);
    }

    public long totalWithGst(long amountPaise, int ratePercent) {
        return amountPaise + gstFor(amountPaise, ratePercent);
    }
}

// src/test/java/in/ravindra/billing/GstCalculatorTest.java
package in.ravindra.billing;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class GstCalculatorTest {                       // package-private is fine in JUnit 5

    private final GstCalculator calculator = new GstCalculator();

    @Test
    @DisplayName("18% GST on Rs 1,000 is Rs 180")
    void calculatesGstOnStandardRatedItem() {
        // Arrange
        long amount = 1_000_00;                // Rs 1,000 in paise
        // Act
        long gst = calculator.gstFor(amount, 18);
        // Assert
        assertEquals(180_00, gst);
    }

    @Test
    void roundsHalfPaisaUp() {
        // Rs 0.05 at 5% = 0.25 paise -> rounds to 0; Rs 0.10 at 5% = 0.5 paise -> 1
        assertEquals(0, calculator.gstFor(5, 5));
        assertEquals(1, calculator.gstFor(10, 5));
    }

    @Test
    void rejectsNegativeAmount() {
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> calculator.gstFor(-1, 18));
        assertEquals("amount cannot be negative", ex.getMessage());
    }
}

// $ mvn -q test
// [INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0`
    },
    {
      heading: "7. JUnit 5 Assertions and Test Lifecycle Annotations: @BeforeEach, @BeforeAll, @AfterEach, @Nested",
      content: `The \`org.junit.jupiter.api.Assertions\` class is a set of static methods; import them with \`import static ...Assertions.*\`. The ones you will use daily:
• \`assertEquals(expected, actual)\` — order matters: expected first, so failure messages read correctly. For \`double\` always pass a delta: \`assertEquals(0.3, 0.1 + 0.2, 1e-9)\`.
• \`assertTrue\`, \`assertFalse\`, \`assertNull\`, \`assertNotNull\`, \`assertSame\` (same reference), \`assertNotEquals\`.
• \`assertArrayEquals\` and \`assertIterableEquals\` — compare contents, not references.
• \`assertThrows(ExceptionType.class, executable)\` — returns the exception so you can assert its message; \`assertDoesNotThrow\` is the opposite.
• \`assertAll("group", () -> ..., () -> ...)\` — runs every assertion and reports **all** failures together, instead of stopping at the first one. Use it when checking several fields of one object.
• \`assertTimeout(Duration, executable)\` runs in the same thread and reports after completion; \`assertTimeoutPreemptively\` aborts the executable when time is up.
• Every method accepts an optional last argument: a message \`String\` or a \`Supplier<String>\` (lazy, built only on failure).
• \`fail("reason")\` fails explicitly, and \`Assumptions.assumeTrue(condition)\` **skips** (does not fail) the test when a precondition is not met, for example "only run on CI".
**Lifecycle annotations** control setup and teardown:
• \`@BeforeEach\` / \`@AfterEach\` — run before and after **every** test method. Use them to create fresh fixtures so tests never depend on each other.
• \`@BeforeAll\` / \`@AfterAll\` — run **once** per class. Because JUnit creates a new instance per test, these must be \`static\` unless you annotate the class with \`@TestInstance(Lifecycle.PER_CLASS)\`. Use them for expensive shared resources: starting an embedded database, loading a large file.
• \`@Disabled("reason")\` — skip a test or class; always give the reason. \`@DisabledOnOs\`, \`@EnabledOnJre\`, \`@EnabledIfEnvironmentVariable\` give conditional execution.
• \`@DisplayName\` — a human-readable name in reports. \`@DisplayNameGeneration(ReplaceUnderscores.class)\` turns \`transfers_money_between_wallets\` into "transfers money between wallets" automatically.
• \`@Nested\` — inner classes group related tests and get their own \`@BeforeEach\`; outer setup runs first. This is how teams structure "when wallet is empty" vs "when wallet has balance" scenarios.
• \`@TestMethodOrder(MethodOrderer.OrderAnnotation.class)\` with \`@Order(n)\` — explicit ordering. Avoid it for unit tests; order dependence is a smell. The default order is deterministic but intentionally non-obvious.
Execution order for a nested test: outer \`@BeforeAll\` → outer \`@BeforeEach\` → inner \`@BeforeEach\` → test → inner \`@AfterEach\` → outer \`@AfterEach\` → outer \`@AfterAll\`.`,
      codeSnippet: `// src/test/java/in/ravindra/wallet/WalletLifecycleTest.java
package in.ravindra.wallet;

import org.junit.jupiter.api.*;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DisplayNameGeneration(DisplayNameGenerator.ReplaceUnderscores.class)
class WalletLifecycleTest {

    private static List<String> auditLog;      // shared, expensive resource
    private Wallet wallet;                     // fresh per test

    @BeforeAll
    static void openAuditLog() {               // static: runs once per class
        auditLog = new ArrayList<>();
        System.out.println("@BeforeAll  -> audit log opened");
    }

    @BeforeEach
    void freshWallet() {
        wallet = new Wallet("ravi@upi", 500_00); // Rs 500
        System.out.println("@BeforeEach -> new wallet");
    }

    @AfterEach
    void record(TestInfo info) {               // TestInfo is injected by JUnit
        auditLog.add(info.getDisplayName());
    }

    @AfterAll
    static void closeAuditLog() {
        System.out.println("@AfterAll   -> " + auditLog.size() + " tests logged");
    }

    @Test
    void deposit_increases_balance() {
        wallet.deposit(250_00);
        assertEquals(750_00, wallet.balancePaise());
    }

    @Test
    void several_fields_checked_together() {
        wallet.withdraw(100_00);
        assertAll("wallet after withdrawal",
                () -> assertEquals("ravi@upi", wallet.upiId()),
                () -> assertEquals(400_00, wallet.balancePaise()),
                () -> assertTrue(wallet.balancePaise() > 0));
    }

    @Test
    void finishes_quickly() {
        assertTimeoutPreemptively(Duration.ofMillis(200), () -> wallet.deposit(1));
    }

    @Nested
    class When_balance_is_zero {
        @BeforeEach
        void drain() { wallet.withdraw(500_00); }          // outer @BeforeEach ran first

        @Test
        void withdrawal_is_rejected() {
            var ex = assertThrows(InsufficientBalanceException.class,
                    () -> wallet.withdraw(1));
            assertTrue(ex.getMessage().contains("insufficient"));
        }
    }

    @Test
    @Disabled("Scheduled for Q4: interest feature not implemented yet")
    void accrues_interest() { fail("not implemented"); }
}

// Console (order of hooks):
// @BeforeAll  -> audit log opened
// @BeforeEach -> new wallet
// @BeforeEach -> new wallet
// ...
// @AfterAll   -> 4 tests logged
// Tests run: 5, Failures: 0, Errors: 0, Skipped: 1`
    },
    {
      heading: "8. Parameterized Tests, Repeated Tests, Tags, Timeouts and Dynamic Tests in JUnit 5",
      content: `Copy-pasting one test five times with different numbers is the most common beginner anti-pattern. **Parameterized tests** (from \`junit-jupiter-params\`) run the same method once per input set. Replace \`@Test\` with \`@ParameterizedTest\` and add a **source**:
• \`@ValueSource(ints = {5, 12, 18, 28})\` — one primitive or String argument per run. Also \`strings\`, \`longs\`, \`doubles\`, \`classes\`.
• \`@NullSource\`, \`@EmptySource\`, \`@NullAndEmptySource\` — the classic edge cases, combinable with \`@ValueSource\`.
• \`@EnumSource(PaymentMode.class)\` — every enum constant, or a subset with \`names = {...}\`.
• \`@CsvSource({"1000, 18, 180", "500, 5, 25"})\` — multiple arguments per row, parsed from text. Since JUnit 5.11 you can use \`textBlock = """..."""\` for a readable table. \`@CsvFileSource(resources = "/gst-cases.csv")\` reads from \`src/test/resources\`.
• \`@MethodSource("cases")\` — a \`static Stream<Arguments>\` method returns rich objects; this is the most flexible option and the right choice when inputs are not simple literals.
• \`@FieldSource\` (added in JUnit 5.11) — like \`@MethodSource\` but reads a static field.
JUnit converts String arguments to the parameter type automatically (\`"18"\` to \`int\`, \`"2026-10-09"\` to \`LocalDate\`, enum names to constants). The \`name\` attribute customises the report label: \`{index}\`, \`{0}\`, \`{1}\` and \`{displayName}\` placeholders, for example \`name = "[{index}] Rs {0} at {1}% -> GST {2}"\`.
Other execution-shaping tools:
• \`@RepeatedTest(50)\` — run a test many times, useful for flushing out flaky concurrency bugs. A \`RepetitionInfo\` parameter gives the current iteration.
• \`@Tag("slow")\` / \`@Tag("integration")\` — label tests; Surefire runs only some with \`-Dgroups=fast\` or excludes with \`-DexcludedGroups=slow\`; Gradle uses \`useJUnitPlatform { includeTags("fast") }\`. This is how CI runs a 10-second smoke suite on every commit and the 20-minute suite nightly.
• \`@Timeout(value = 2, unit = TimeUnit.SECONDS)\` — fail if the test (or every test in the class) exceeds the limit. Declarative and simpler than \`assertTimeout\`.
• \`@TestFactory\` — returns a \`Stream<DynamicTest>\` generated at runtime (for example one test per file in a folder). Dynamic tests do not get \`@BeforeEach\`/\`@AfterEach\`; prefer \`@ParameterizedTest\` unless you genuinely need runtime generation.
• Parallel execution: set \`junit.jupiter.execution.parallel.enabled=true\` in \`src/test/resources/junit-platform.properties\` and annotate with \`@Execution(CONCURRENT)\`. Only do this when tests share no mutable state.`,
      codeSnippet: `// src/test/java/in/ravindra/billing/GstCalculatorParamTest.java
package in.ravindra.billing;

import org.junit.jupiter.api.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.*;

import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.DynamicTest.dynamicTest;

@Timeout(value = 2, unit = TimeUnit.SECONDS)         // applies to every test here
class GstCalculatorParamTest {

    private final GstCalculator calc = new GstCalculator();

    @ParameterizedTest(name = "[{index}] slab {0}% is accepted")
    @ValueSource(ints = {0, 5, 12, 18, 28})
    void acceptsAllOfficialSlabs(int slab) {
        assertDoesNotThrow(() -> calc.gstFor(100_00, slab));
    }

    @ParameterizedTest
    @ValueSource(ints = {-5, 1, 10, 15, 30})
    void rejectsInvalidSlabs(int slab) {
        assertThrows(IllegalArgumentException.class, () -> calc.gstFor(100_00, slab));
    }

    @ParameterizedTest(name = "Rs {0} at {1}% -> GST {2} paise")
    @CsvSource(textBlock = """
            # amountPaise, rate, expectedGstPaise
            100000, 18, 18000
            50000,   5,  2500
            99900,  12, 11988
            1,      28,     0
            """)
    void computesGstFromTable(long amount, int rate, long expected) {
        assertEquals(expected, calc.gstFor(amount, rate));
    }

    // Rich objects: use @MethodSource
    record Invoice(String item, long paise, int rate) {}

    static Stream<Arguments> invoices() {
        return Stream.of(
                Arguments.of(new Invoice("Laptop", 65_000_00, 18), 76_700_00),
                Arguments.of(new Invoice("Tea", 250_00, 5), 262_50),
                Arguments.of(new Invoice("Textbook", 400_00, 0), 400_00));
    }

    @ParameterizedTest
    @MethodSource("invoices")
    void computesInvoiceTotals(Invoice inv, long expectedTotal) {
        assertEquals(expectedTotal, calc.totalWithGst(inv.paise(), inv.rate()));
    }

    @ParameterizedTest
    @NullAndEmptySource
    @ValueSource(strings = {" ", "abc"})
    void rejectsBlankOrNonNumericInput(String raw) {
        assertThrows(IllegalArgumentException.class, () -> parseRate(raw));
    }

    private int parseRate(String raw) {
        if (raw == null || raw.isBlank()) throw new IllegalArgumentException("blank");
        try { return Integer.parseInt(raw.trim()); }
        catch (NumberFormatException e) { throw new IllegalArgumentException("not a number", e); }
    }

    @RepeatedTest(5)
    @Tag("slow")
    void roundingIsStable(RepetitionInfo info) {
        assertEquals(18, calc.gstFor(100, 18), "repetition " + info.getCurrentRepetition());
    }

    @TestFactory
    Stream<DynamicTest> everySlabHasAtLeastZeroGst() {
        return List.of(0, 5, 12, 18, 28).stream()
                .map(slab -> dynamicTest("slab " + slab,
                        () -> assertTrue(calc.gstFor(1_000_00, slab) >= 0)));
    }
}

// Surefire report excerpt:
// [INFO] Tests run: 31, Failures: 0, Errors: 0, Skipped: 0
// Run only fast tests:   mvn test -DexcludedGroups=slow`
    },
    {
      heading: "9. Mockito: Mocks, Stubbing, Verification, ArgumentCaptor, Spies and Static Mocks",
      content: `A \`WalletService\` that calls a \`PaymentGateway\` (an HTTP call to NPCI or a bank) and a \`WalletRepository\` (a database) cannot be unit tested as-is: the test would be slow, need credentials, and move real money. **Mockito** creates a **mock**: an object that implements the same interface, records every call, and returns whatever you tell it to. Now you test \`WalletService\` logic in isolation and in milliseconds.
Vocabulary that interviewers love: a **dummy** is passed but never used; a **stub** returns canned answers; a **mock** is a stub that also verifies interactions; a **spy** wraps a real object and lets you override some methods; a **fake** is a working lightweight implementation (an in-memory repository). Mockito creates stubs, mocks and spies.
Setup with JUnit 5: add \`mockito-junit-jupiter\` and annotate the class with \`@ExtendWith(MockitoExtension.class)\`. Then:
• \`@Mock\` creates a mock field. \`@InjectMocks\` creates the real class under test and injects the mocks through its constructor (preferred), setter or field.
• **Stubbing**: \`when(gateway.transfer("a@upi", "b@upi", 500_00)).thenReturn("TXN123")\`; \`thenThrow(new GatewayException(...))\`; \`thenAnswer(inv -> ...)\` for computed results; chain \`thenReturn(a).thenReturn(b)\` for successive calls. For \`void\` methods use \`doThrow(...).when(mock).method()\`.
• **Argument matchers**: \`any()\`, \`anyString()\`, \`anyLong()\`, \`eq("x")\`, \`argThat(amount -> amount > 0)\`. Rule: if one argument uses a matcher, **all** must (\`eq()\` wraps literals).
• **Verification**: \`verify(gateway).transfer(...)\`, \`verify(gateway, times(2))\`, \`never()\`, \`atLeastOnce()\`, \`verifyNoInteractions(mock)\`, \`verifyNoMoreInteractions(mock)\`, and \`InOrder\` for sequence checks.
• **ArgumentCaptor** captures the actual argument passed to a mock so you can assert on its fields, which is ideal when the service builds an object internally (a \`Transaction\`) that you cannot reference from the test.
• **BDD style**: \`BDDMockito.given(...).willReturn(...)\` and \`then(mock).should().method()\` read naturally with Given/When/Then comments; many Spring teams use this style.
**Strict stubs**: \`MockitoExtension\` enables strictness by default, so a stub that is never used fails the test with \`UnnecessaryStubbingException\`. This is a feature: it keeps tests honest. Fix by removing the stub or, rarely, \`@MockitoSettings(strictness = Strictness.LENIENT)\`.
Mockito 5 (Java 11+) uses the **inline mock maker** by default, so it can mock \`final\` classes and methods, and \`mockStatic(Clock.class)\` or \`mockConstruction\` are available without extra artifacts. Static mocks are scoped: use try-with-resources so they are undone after the test. Mockito cannot mock \`private\` methods or constructors directly, which is deliberate: needing to is a design signal to extract a collaborator. On Java 21 and newer the JVM prints a warning when Mockito self-attaches its agent; section 14 shows the fix.`,
      codeSnippet: `// src/main/java/in/ravindra/wallet/PaymentGateway.java
package in.ravindra.wallet;
public interface PaymentGateway {
    /** Returns the gateway transaction id, or throws GatewayException. */
    String transfer(String fromUpi, String toUpi, long amountPaise);
}

// src/main/java/in/ravindra/wallet/NotificationService.java
package in.ravindra.wallet;
public interface NotificationService {
    void sendSms(String upiId, String message);
}

// src/test/java/in/ravindra/wallet/WalletServiceMockitoTest.java
package in.ravindra.wallet;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.*;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WalletServiceMockitoTest {

    @Mock WalletRepository repository;
    @Mock PaymentGateway gateway;
    @Mock NotificationService notifier;
    @InjectMocks WalletService service;            // new WalletService(repository, gateway, notifier)

    @Test
    void successfulTransferDebitsSourceAndNotifies() {
        // Arrange (stub)
        Wallet from = new Wallet("ravi@upi", 1_000_00);
        Wallet to   = new Wallet("priya@upi", 200_00);
        when(repository.findByUpi("ravi@upi")).thenReturn(Optional.of(from));
        when(repository.findByUpi("priya@upi")).thenReturn(Optional.of(to));
        when(gateway.transfer(eq("ravi@upi"), eq("priya@upi"), anyLong())).thenReturn("TXN-9001");

        // Act
        TransferResult result = service.transfer("ravi@upi", "priya@upi", 300_00);

        // Assert state
        assertEquals("TXN-9001", result.transactionId());
        assertEquals(700_00, from.balancePaise());
        assertEquals(500_00, to.balancePaise());

        // Assert interactions
        verify(gateway, times(1)).transfer("ravi@upi", "priya@upi", 300_00);
        verify(repository, times(2)).save(any(Wallet.class));
        verify(notifier).sendSms(eq("priya@upi"), contains("300"));
    }

    @Test
    void gatewayFailureRollsBackAndDoesNotNotify() {
        Wallet from = new Wallet("ravi@upi", 1_000_00);
        when(repository.findByUpi("ravi@upi")).thenReturn(Optional.of(from));
        when(repository.findByUpi("priya@upi")).thenReturn(Optional.of(new Wallet("priya@upi", 0)));
        when(gateway.transfer(anyString(), anyString(), anyLong()))
                .thenThrow(new GatewayException("NPCI timeout"));

        assertThrows(GatewayException.class,
                () -> service.transfer("ravi@upi", "priya@upi", 300_00));

        assertEquals(1_000_00, from.balancePaise(), "balance must be untouched");
        verify(repository, never()).save(any());
        verifyNoInteractions(notifier);
    }

    @Test
    void smsMessageContainsAmountInRupees() {
        when(repository.findByUpi(anyString()))
                .thenReturn(Optional.of(new Wallet("ravi@upi", 5_000_00)))
                .thenReturn(Optional.of(new Wallet("priya@upi", 0)));
        when(gateway.transfer(anyString(), anyString(), anyLong())).thenReturn("TXN-1");

        service.transfer("ravi@upi", "priya@upi", 1_250_50);

        ArgumentCaptor<String> message = ArgumentCaptor.forClass(String.class);
        verify(notifier).sendSms(eq("priya@upi"), message.capture());
        assertEquals("You received Rs 1250.50 from ravi@upi", message.getValue());
    }

    @Test
    void unknownWalletFailsBeforeTouchingGateway() {
        when(repository.findByUpi("ghost@upi")).thenReturn(Optional.empty());

        assertThrows(WalletNotFoundException.class,
                () -> service.transfer("ghost@upi", "priya@upi", 10_00));

        verifyNoInteractions(gateway, notifier);
    }

    @Test
    void staticMockFreezesTime() {
        Instant fixed = Instant.parse("2026-10-09T10:15:30Z");
        try (MockedStatic<Instant> instant = mockStatic(Instant.class)) {
            instant.when(Instant::now).thenReturn(fixed);
            assertEquals(fixed, Instant.now());
        }                                             // static mock removed here
        assertNotEquals(fixed, Instant.now());
    }

    @Test
    void spyCallsRealMethodsUnlessStubbed() {
        Wallet real = spy(new Wallet("spy@upi", 100_00));
        doReturn(999_99L).when(real).balancePaise();  // doReturn: avoids calling the real method
        real.deposit(50_00);                          // real deposit runs
        assertEquals(999_99, real.balancePaise());    // stubbed
        verify(real).deposit(50_00);
    }
}`
    },
    {
      heading: "10. AssertJ Fluent Assertions: Readable Checks for Objects, Collections and Exceptions",
      content: `JUnit's assertions are sufficient but verbose for collections and objects, and their argument order (\`expected, actual\`) is easy to reverse. **AssertJ** offers one entry point, \`assertThat(actual)\`, followed by type-aware, chainable methods that your IDE autocompletes. Spring Boot's test starter includes it, so it is the de facto standard in Spring projects. AssertJ 3.27.x is the current stable line and supports Java 8+; a 4.0 line with a Java 17 baseline was in milestone builds at the time of writing, with the same fluent API.
Why teams prefer it:
• **Readability**: \`assertThat(balance).isEqualTo(700_00)\` versus \`assertEquals(700_00, balance)\`. The subject comes first, as in English.
• **Collections**: \`contains\`, \`containsExactly\` (order matters), \`containsExactlyInAnyOrder\`, \`hasSize\`, \`isEmpty\`, \`allMatch\`, \`anySatisfy\`, \`extracting("field")\` to assert one property across a list, \`filteredOn\`.
• **Strings**: \`startsWith\`, \`containsIgnoringCase\`, \`matches(regex)\`, \`isBlank\`.
• **Numbers**: \`isBetween\`, \`isPositive\`, \`isCloseTo(100.0, within(0.01))\`, \`isGreaterThanOrEqualTo\`.
• **Optional**: \`isPresent\`, \`isEmpty\`, \`hasValue(x)\`, \`get()\` to continue asserting on the content.
• **Exceptions**: \`assertThatThrownBy(() -> ...).isInstanceOf(X.class).hasMessageContaining("...")\`, or \`assertThatExceptionOfType(X.class).isThrownBy(...)\`. Also \`assertThatCode(...).doesNotThrowAnyException()\`.
• **Objects**: \`usingRecursiveComparison()\` compares field by field (ideal for records and DTOs without \`equals\`), with \`ignoringFields("createdAt")\`; \`hasFieldOrPropertyWithValue\`; \`isEqualToComparingFieldByField\` is deprecated in favour of the recursive version.
• **Soft assertions**: \`SoftAssertions.assertSoftly(s -> { s.assertThat(...); ... })\` collects every failure and reports them together, like \`assertAll\` but fluent. \`@ExtendWith(SoftAssertionsExtension.class)\` with an \`@InjectSoftAssertions\` field automates it.
• **Failure messages** are descriptive by default: "Expecting ArrayList to contain exactly [a, b] but could not find [b]". Add \`.as("balance after refund")\` before the assertion for context.
You can mix AssertJ and JUnit assertions in one test class, but most teams standardise on AssertJ for everything except \`assertThrows\`, where either is fine. Import exactly one static: \`import static org.assertj.core.api.Assertions.*;\`. If IntelliJ offers \`org.assertj.core.api.AssertionsForClassTypes\`, pick the plain \`Assertions\` instead; the other one lacks collection assertions.`,
      codeSnippet: `// src/test/java/in/ravindra/wallet/WalletAssertJTest.java
package in.ravindra.wallet;

import org.assertj.core.api.SoftAssertions;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;

class WalletAssertJTest {

    record Txn(String id, String to, long paise) {}

    @Test
    void collectionsReadLikeEnglish() {
        List<Txn> txns = List.of(
                new Txn("T1", "priya@upi", 300_00),
                new Txn("T2", "amit@upi", 1_200_00),
                new Txn("T3", "priya@upi", 50_00));

        assertThat(txns)
                .hasSize(3)
                .extracting(Txn::to)
                .containsExactly("priya@upi", "amit@upi", "priya@upi");

        assertThat(txns)
                .filteredOn(t -> t.to().equals("priya@upi"))
                .extracting(Txn::paise)
                .containsExactlyInAnyOrder(300_00L, 50_00L);

        assertThat(txns).allSatisfy(t -> assertThat(t.paise()).isPositive());
        assertThat(txns).anyMatch(t -> t.paise() > 1_000_00);
    }

    @Test
    void stringsNumbersAndOptionals() {
        Wallet w = new Wallet("ravi@upi", 1_000_00);
        assertThat(w.upiId()).startsWith("ravi").endsWith("@upi").doesNotContain(" ");
        assertThat(w.balancePaise()).as("opening balance").isBetween(999_99L, 1_000_01L);

        Optional<Wallet> found = Optional.of(w);
        assertThat(found).isPresent().get().extracting(Wallet::upiId).isEqualTo("ravi@upi");
        assertThat(Optional.empty()).isEmpty();
    }

    @Test
    void exceptionsAreFluentToo() {
        Wallet w = new Wallet("ravi@upi", 10_00);
        assertThatThrownBy(() -> w.withdraw(50_00))
                .isInstanceOf(InsufficientBalanceException.class)
                .hasMessageContaining("insufficient")
                .hasMessageContaining("Rs 10.00");

        assertThatCode(() -> w.withdraw(5_00)).doesNotThrowAnyException();
    }

    @Test
    void recursiveComparisonForDtos() {
        Txn expected = new Txn("T1", "priya@upi", 300_00);
        Txn actual   = new Txn("T1-generated", "priya@upi", 300_00);
        assertThat(actual)
                .usingRecursiveComparison()
                .ignoringFields("id")
                .isEqualTo(expected);
    }

    @Test
    void softAssertionsReportEveryFailure() {
        Wallet w = new Wallet("ravi@upi", 1_000_00);
        w.withdraw(250_00);
        SoftAssertions.assertSoftly(softly -> {
            softly.assertThat(w.balancePaise()).isEqualTo(750_00);
            softly.assertThat(w.upiId()).isEqualTo("ravi@upi");
            softly.assertThat(w.balancePaise()).isLessThan(1_000_00);
        });
    }
}

// Example failure message (deliberately wrong expectation):
// java.lang.AssertionError: [opening balance]
// Expecting actual:
//   100000L
// to be between:
//   [200000L, 300000L]`
    },
    {
      heading: "11. Test Coverage with JaCoCo: Line, Branch and Instruction Coverage, Reports and Thresholds",
      content: `**Code coverage** answers: which parts of my production code were executed while the tests ran? **JaCoCo** (Java Code Coverage) is the standard tool. It attaches a Java agent to the test JVM, instruments bytecode as classes load, records which instructions ran, and after the tests writes \`target/jacoco.exec\`. A second goal turns that binary file into HTML, XML and CSV reports.
JaCoCo reports several counters; know the difference because interviewers ask:
• **Instruction coverage** — bytecode instructions executed. The most precise, independent of formatting.
• **Line coverage** — source lines with at least one executed instruction. The number most people quote ("we have 82% coverage").
• **Branch coverage** — for every \`if\`, \`switch\`, \`?:\` and short-circuit \`&&\`/\`||\`, were both outcomes exercised? A method with 100% line coverage can have 50% branch coverage if you only tested the happy path. Branch coverage is the one that finds missing edge-case tests.
• **Method** and **class** coverage, and **cyclomatic complexity** per method, which highlights code that needs more tests.
Maven setup needs three executions of \`jacoco-maven-plugin\`: \`prepare-agent\` (runs before \`test\`; it sets the \`argLine\` property that Surefire picks up to start the agent), \`report\` (bound to \`test\` or \`verify\`; produces \`target/site/jacoco/index.html\`), and optionally \`check\` (bound to \`verify\`; fails the build when a rule such as "line coverage of the bundle must be at least 80%" is violated). Open the HTML report: green lines ran, red lines never ran, yellow lines have partially covered branches with a tooltip saying "1 of 2 branches missed".
Use JaCoCo 0.8.14 or newer for Java 25 class files (0.8.14, released October 2025, is the first with official Java 25 support; 0.8.13 only had experimental support). An older JaCoCo on a newer JDK fails with "Unsupported class file major version".
Exclude generated code and trivial classes from coverage rules rather than writing pointless tests: configuration classes, the \`main\` method launcher, DTOs generated by MapStruct, and anything annotated with an annotation whose simple name contains "Generated" (Lombok's \`@Generated\` is skipped automatically for this reason).
**What coverage is not**: 90% coverage means 90% of lines executed, not that 90% of behaviour is verified. A test with no assertions still "covers" code. Teams that chase a number produce tests that execute code without checking anything. Use coverage to **find untested code**, set a realistic threshold (70 to 85% is typical for services), enforce it in CI so the number never silently drops, and review the red lines rather than celebrating the green percentage. Mutation testing tools such as PIT go further by changing your code and checking whether tests notice, but that is beyond this lecture.`,
      codeSnippet: `<!-- pom.xml (excerpt): JaCoCo with report + 80% line coverage gate -->
<build>
  <plugins>
    <plugin>
      <groupId>org.jacoco</groupId>
      <artifactId>jacoco-maven-plugin</artifactId>
      <version>0.8.14</version>     <!-- 0.8.14+ for Java 25 class files -->
      <executions>
        <!-- 1. Start the agent before Surefire runs (sets \${argLine}) -->
        <execution>
          <id>prepare-agent</id>
          <goals><goal>prepare-agent</goal></goals>
        </execution>
        <!-- 2. HTML/XML/CSV report after tests -->
        <execution>
          <id>report</id>
          <phase>test</phase>
          <goals><goal>report</goal></goals>
        </execution>
        <!-- 3. Fail the build in "verify" if coverage is too low -->
        <execution>
          <id>check</id>
          <phase>verify</phase>
          <goals><goal>check</goal></goals>
          <configuration>
            <rules>
              <rule>
                <element>BUNDLE</element>
                <limits>
                  <limit>
                    <counter>LINE</counter>
                    <value>COVEREDRATIO</value>
                    <minimum>0.80</minimum>
                  </limit>
                  <limit>
                    <counter>BRANCH</counter>
                    <value>COVEREDRATIO</value>
                    <minimum>0.70</minimum>
                  </limit>
                </limits>
              </rule>
            </rules>
            <excludes>
              <exclude>in/ravindra/wallet/WalletApplication.class</exclude>
              <exclude>**/config/**</exclude>
            </excludes>
          </configuration>
        </execution>
      </executions>
    </plugin>

    <!-- If you set your own argLine for Surefire, keep JaCoCo's with @{argLine} -->
    <plugin>
      <groupId>org.apache.maven.plugins</groupId>
      <artifactId>maven-surefire-plugin</artifactId>
      <version>3.5.3</version>
      <configuration>
        <argLine>@{argLine} -Xmx512m</argLine>
      </configuration>
    </plugin>
  </plugins>
</build>

<!--
$ mvn clean verify
[INFO] --- jacoco:0.8.14:prepare-agent (prepare-agent) @ wallet-service ---
[INFO] argLine set to -javaagent:.../org.jacoco.agent-0.8.14-runtime.jar=destfile=target/jacoco.exec
...
[INFO] --- jacoco:0.8.14:report (report) @ wallet-service ---
[INFO] Analyzed bundle 'wallet-service' with 7 classes
[INFO] --- jacoco:0.8.14:check (check) @ wallet-service ---
[INFO] All coverage checks have been met.
   or, when the gate fails:
[WARNING] Rule violated for bundle wallet-service: lines covered ratio is 0.74, but expected minimum is 0.80
[ERROR] Coverage checks have not been met.

Open target/site/jacoco/index.html in a browser for the per-class, per-line view.
-->`
    },
    {
      heading: "12. The TDD Workflow: Red, Green, Refactor, FIRST Principles and the Test Pyramid",
      content: `**Test-Driven Development (TDD)** inverts the usual order: you write a failing test **first**, then the minimum code to pass it, then clean up. The loop is:
1. **Red** — write one small test describing the next behaviour. Run it. It must fail (often it does not even compile). If it passes immediately, the test is not testing anything new.
2. **Green** — write the simplest code that makes the test pass. Resist generality; hard-coding is allowed at this step.
3. **Refactor** — with the safety net green, remove duplication, improve names, extract methods. Run the tests again; they must stay green.
Each loop takes 2 to 10 minutes. The output is not just code but a suite that documents exactly what the code promises, and a design shaped by usage (because you wrote the call before the implementation, APIs come out simpler). TDD is not mandatory everywhere; it shines for business logic with clear rules (pricing, validation, state machines) and is awkward for exploratory UI work. Many teams practise "test-first for logic, test-after for glue".
Good unit tests follow the **FIRST** principles:
• **Fast** — milliseconds, so you run them hundreds of times a day.
• **Independent** — no shared mutable state, any order, any subset.
• **Repeatable** — same result on every machine; no reliance on current time, random numbers, network or locale (inject a \`Clock\`, seed the \`Random\`).
• **Self-validating** — pass or fail without a human reading logs.
• **Timely** — written with (or before) the code, not months later.
The **test pyramid** describes the healthy mix in a service:
• Many **unit tests** (this lecture): one class, mocks for collaborators, milliseconds each.
• Fewer **integration tests**: real database via Testcontainers, real Spring context, \`@SpringBootTest\` or \`@DataJpaTest\`; seconds each. Run by Failsafe in the \`verify\` phase, named \`*IT\`.
• A handful of **end-to-end tests**: the deployed system through its public API or UI; minutes each; run nightly.
Inverting the pyramid (hundreds of slow end-to-end tests, few unit tests) produces suites that take an hour, fail randomly and get ignored.
Naming and structure conventions that make a suite maintainable: one test class per production class (\`WalletService\` → \`WalletServiceTest\`); method names of the form \`methodName_condition_expectedResult\` or readable sentences via \`ReplaceUnderscores\`; AAA sections separated by a blank line; one logical assertion per test (several \`assertAll\` checks of one outcome are fine; testing two behaviours is not). The snippet walks through three TDD cycles for an Indian PIN code validator, showing the failing test, the minimal code and the refactor at each step.`,
      codeSnippet: `// TDD walk-through: an Indian PIN code validator (6 digits, first digit 1-9)

// ----- Cycle 1: RED -----
// src/test/java/in/ravindra/address/PinCodeValidatorTest.java
package in.ravindra.address;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;

import static org.assertj.core.api.Assertions.assertThat;

class PinCodeValidatorTest {
    private final PinCodeValidator validator = new PinCodeValidator();

    @Test
    void acceptsAValidBengaluruPinCode() {
        assertThat(validator.isValid("560001")).isTrue();     // does not compile yet -> RED
    }
}

// ----- Cycle 1: GREEN (simplest thing that works) -----
// src/main/java/in/ravindra/address/PinCodeValidator.java
package in.ravindra.address;
public class PinCodeValidator {
    public boolean isValid(String pin) { return true; }        // hard-coded, and that is fine for now
}

// ----- Cycle 2: RED  (add to the test class) -----
//  @ParameterizedTest
//  @NullAndEmptySource
//  @ValueSource(strings = {"56001", "5600011", "ABCDEF", "012345", "56 001"})
//  void rejectsMalformedPinCodes(String pin) {
//      assertThat(validator.isValid(pin)).isFalse();          // fails: validator returns true
//  }

// ----- Cycle 2: GREEN -----
//  public boolean isValid(String pin) {
//      if (pin == null || pin.length() != 6) return false;
//      if (pin.charAt(0) == '0') return false;
//      for (char c : pin.toCharArray()) if (c < '0' || c > '9') return false;
//      return true;
//  }

// ----- Cycle 3: REFACTOR (tests stay green) -----
// Final version of src/main/java/in/ravindra/address/PinCodeValidator.java
package in.ravindra.address;

import java.util.regex.Pattern;

public class PinCodeValidator {
    private static final Pattern PIN = Pattern.compile("[1-9][0-9]{5}");

    public boolean isValid(String pin) {
        return pin != null && PIN.matcher(pin).matches();
    }
}

// ----- Cycle 4: RED -> GREEN  (new requirement: region from first digit) -----
//  @Test
//  void firstDigitIdentifiesPostalRegion() {
//      assertThat(validator.regionOf("110001")).isEqualTo("Delhi / North");   // 1
//      assertThat(validator.regionOf("400001")).isEqualTo("Maharashtra / West"); // 4
//  }
//  ... implement regionOf with a switch on pin.charAt(0), run, green, refactor.

// $ mvn -q test   (after cycle 3)
// [INFO] Tests run: 8, Failures: 0, Errors: 0, Skipped: 0`
    },
    {
      heading: "13. Real-World Use Cases: How Build Tools and Testing Are Used in Production Java Teams",
      content: `• **Continuous integration gate** — every pull request at a fintech in Mumbai runs \`./mvnw clean verify\` on GitHub Actions: compile, 1,800 unit tests in 40 seconds, JaCoCo check at 80%, then Failsafe integration tests against a PostgreSQL Testcontainer. A red build blocks the merge button. Nobody reviews code that has not passed the pipeline.
• **Multi-module Maven project** — an e-commerce backend is split into \`catalog-api\`, \`catalog-domain\`, \`catalog-persistence\` and \`catalog-app\` modules under one parent POM with \`dependencyManagement\`. Modules depend on each other by coordinates, and \`mvn -pl catalog-app -am verify\` builds only what changed. The same structure in Gradle uses \`include("catalog-api", ...)\` in \`settings.gradle.kts\` and \`implementation(project(":catalog-domain"))\`.
• **Reproducible builds with wrappers and lock files** — a bank's audit requires that the JAR built in 2026 can be rebuilt identically in 2028. The Maven Wrapper pins Maven, \`maven.compiler.release\` pins the Java API, every plugin version is explicit, and the Gradle projects commit \`gradle.lockfile\` from dependency locking.
• **Mocking external partners** — a UPI switch integration is tested with Mockito mocks of the NPCI client for unit tests (timeouts, declined transactions, duplicate reference numbers) and with WireMock stubs for integration tests. Real sandbox calls run only in a nightly job because they are slow and rate limited.
• **Parameterized regression suites** — a GST filing product keeps 400 real invoice cases in \`src/test/resources/gst-cases.csv\` driven by \`@CsvFileSource\`. Every government rule change adds rows, never new test methods.
• **Tagged test tiers** — \`@Tag("fast")\` tests run on every commit (under 1 minute), \`@Tag("slow")\` on merge to main, \`@Tag("contract")\` nightly against partner sandboxes, selected via Surefire \`groups\` or Gradle \`includeTags\`.
• **Coverage trend, not coverage target** — a SaaS team publishes JaCoCo XML to SonarQube. The quality gate is "coverage on new code must be at least 80%", which forces tests for new features without demanding retroactive tests for a ten-year-old module.
• **TDD for pricing engines** — an insurance company writes premium-calculation rules test-first because the rules are precise, the stakes are financial and the inputs are easy to tabulate. The resulting suite becomes the executable specification that actuaries review.
• **Spring Boot projects (next lecture)** — Spring Initializr generates a Maven or Gradle project whose \`spring-boot-starter-test\` already includes JUnit Jupiter, Mockito, AssertJ, Hamcrest and JSONassert, and whose parent POM or BOM manages all their versions. Everything in this lecture is what you will use inside \`@WebMvcTest\` and \`@DataJpaTest\` slices.`
    },
    {
      heading: "14. Common Mistakes with Maven, Gradle, JUnit 5 and Mockito and How to Fix Them",
      content: `**1. Tests silently not running (Surefire reports "Tests run: 0").** Causes: mixing JUnit 4 \`org.junit.Test\` with JUnit 5 engine; test class name not matching \`*Test\`/\`Test*\`/\`*Tests\`; an ancient Surefire (below 2.22) that does not understand the JUnit Platform; in Gradle, forgetting \`useJUnitPlatform()\` or (since Gradle 9) the \`junit-platform-launcher\` runtime dependency. Fix: use Jupiter imports only, follow naming conventions, pin Surefire 3.x, and add both Gradle lines.
**2. \`@BeforeAll\` method not static.** JUnit throws \`JUnitException: @BeforeAll method must be static\`. Make it static or annotate the class with \`@TestInstance(Lifecycle.PER_CLASS)\`.
**3. Mixing matchers with raw values in Mockito.** \`when(gateway.transfer("a", anyString(), 100L))\` throws \`InvalidUseOfMatchersException\`. Wrap every literal: \`eq("a"), anyString(), eq(100L)\`.
**4. \`UnnecessaryStubbingException\`.** Strict stubs flag a \`when(...)\` that the test never used. Delete the stub; it was documenting behaviour that does not happen. Do not reflexively switch to lenient mode.
**5. Stubbing a spy with \`when(spy.method())\`.** That line calls the real method first (possibly throwing or hitting a database). Use \`doReturn(x).when(spy).method()\`.
**6. Comparing doubles with \`assertEquals(a, b)\` and no delta, or storing money in \`double\`.** \`0.1 + 0.2 != 0.3\`. Store money as \`long\` paise or \`BigDecimal\`, and pass a delta for genuine floating-point values.
**7. Tests that depend on execution order or shared static state.** They pass alone and fail in the suite. Create fixtures in \`@BeforeEach\`, never mutate \`static\` fields, and never rely on \`@Order\` for unit tests.
**8. Asserting on \`System.out\` or using \`Thread.sleep\` in tests.** Both make tests slow and brittle. Return values instead of printing; use \`Awaitility\` or \`CompletableFuture.get(timeout)\` for asynchronous code.
**9. Nearest-wins surprise.** Two libraries bring \`jackson-databind\` 2.17 and 2.19, Maven picks the nearer (older) one and you get \`NoSuchMethodError\` at runtime. Run \`mvn dependency:tree -Dverbose\`, then pin the version in \`dependencyManagement\` or import a BOM.
**10. Using \`-Dmaven.test.skip=true\` in CI "to make it faster".** It skips compiling tests, so broken tests are merged. Use \`-DskipTests\` only for local packaging, and never skip tests in CI.
**11. Chasing 100% coverage.** Teams write tests for getters and toString to hit a number. Set a sensible gate (around 80%), exclude generated code, and read the red lines in the report instead.
**12. Mockito agent warning on Java 21+.** Since JDK 21 (JEP 451), dynamically loading an agent prints "WARNING: A Java agent has been loaded dynamically ... Mockito is currently self-attaching". It is only a warning today, but a future JDK will refuse. Fix: load the agent explicitly through Surefire's \`argLine\` (snippet), as the Mockito documentation recommends. Gradle: \`jvmArgs("-javaagent:" + mockitoAgent.asPath)\` with a dedicated \`mockitoAgent\` configuration.
**13. Running a globally installed \`mvn\` or \`gradle\` instead of the wrapper.** Different machines, different versions, "works on my laptop". Always \`./mvnw\` and \`./gradlew\`.
**14. Putting test fixtures in \`src/main/resources\`.** They get packaged into the production JAR. Test-only files belong in \`src/test/resources\`.`,
      codeSnippet: `<!-- pom.xml (excerpt): fix for the Mockito dynamic-agent warning on Java 21+ -->
<build>
  <plugins>
    <!-- Exposes \${org.mockito:mockito-core:jar} as a property -->
    <plugin>
      <groupId>org.apache.maven.plugins</groupId>
      <artifactId>maven-dependency-plugin</artifactId>
      <version>3.8.1</version>
      <executions>
        <execution>
          <goals><goal>properties</goal></goals>
        </execution>
      </executions>
    </plugin>

    <plugin>
      <groupId>org.apache.maven.plugins</groupId>
      <artifactId>maven-surefire-plugin</artifactId>
      <version>3.5.3</version>
      <configuration>
        <!-- @{argLine} keeps JaCoCo's agent; the second -javaagent attaches Mockito explicitly -->
        <argLine>@{argLine} -javaagent:\${org.mockito:mockito-core:jar}</argLine>
      </configuration>
    </plugin>
  </plugins>
</build>

<!-- Before the fix (JDK 21+ console):
WARNING: A Java agent has been loaded dynamically (.../byte-buddy-agent-1.17.5.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer
work in future releases of the JDK. Please add Mockito as an agent to your build ...
After the fix: no warning, tests unchanged.
-->

// Gradle equivalent (build.gradle.kts):
// val mockitoAgent by configurations.creating
// dependencies { mockitoAgent("org.mockito:mockito-core:5.18.0") { isTransitive = false } }
// tasks.test { jvmArgs("-javaagent:" + mockitoAgent.asPath) }`
    },
    {
      heading: "15. Frequently Asked Questions about Java Build Tools and Testing",
      content: `**What is the difference between Maven and Gradle?**
Maven uses declarative XML (\`pom.xml\`), a fixed lifecycle of phases and strong conventions; it is simpler to learn and extremely common in enterprise and Spring projects. Gradle uses a Kotlin or Groovy script that builds a task graph, runs only tasks whose inputs changed, and offers a build cache and configuration cache, so large builds are much faster. Both resolve dependencies from Maven Central and both are supported by Spring Boot; Android requires Gradle.
**What is the difference between JUnit 4 and JUnit 5?**
JUnit 5 is a complete rewrite split into Platform, Jupiter and Vintage. It replaces \`@Before\`/\`@After\` with \`@BeforeEach\`/\`@AfterEach\`, \`@BeforeClass\` with \`@BeforeAll\`, \`@Ignore\` with \`@Disabled\`, \`@RunWith\` with the more flexible \`@ExtendWith\`, adds \`assertThrows\`, \`assertAll\`, parameterized tests, nested classes and dynamic tests, drops the requirement that classes and methods be public, and supports lambdas and Java 8+ features. JUnit 6 (September 2025) continues the Jupiter API with a Java 17 baseline.
**What is the difference between @Mock and @InjectMocks in Mockito?**
\`@Mock\` creates a fake implementation of a dependency whose behaviour you stub and verify. \`@InjectMocks\` creates a real instance of the class under test and injects the \`@Mock\` fields into it through its constructor, setters or fields. You mock collaborators; you never mock the class you are testing.
**What is the difference between a mock and a spy in Mockito?**
A mock has no real behaviour: every method returns defaults (null, 0, false, empty) unless stubbed. A spy wraps a real object, so unstubbed methods execute the real code, and you selectively override methods with \`doReturn\`. Use spies sparingly, typically for legacy classes you cannot refactor.
**What does Maven's test scope mean, and why is JUnit test scoped?**
A \`test\`-scoped dependency is on the classpath only when compiling and running tests under \`src/test\`. It is not available to \`src/main\` code and is not packaged into the JAR or WAR, so test libraries never bloat or leak into production.
**How much code coverage is enough?**
There is no universal number. Around 80% line coverage with attention to branch coverage is a common gate for business services; critical modules such as payment calculation may demand more. Coverage shows which code is untested, not whether tested code is tested well, so review the uncovered lines and the quality of assertions rather than chasing 100%.
**What is the difference between unit tests and integration tests in Java?**
A unit test exercises one class with all collaborators mocked, needs no infrastructure and runs in milliseconds under Surefire in the \`test\` phase. An integration test exercises several real components together (a Spring context, a database in Testcontainers, an HTTP client), takes seconds, and runs under Failsafe in the \`verify\` phase with class names ending in \`IT\`.
**Do I need JUnit 5 if I use Spring Boot?**
Yes, and it is included. \`spring-boot-starter-test\` brings JUnit Jupiter, Mockito, AssertJ, Hamcrest, JSONassert and Spring Test, with versions managed by the Spring Boot BOM; you add the starter with \`test\` scope and write Jupiter tests exactly as shown in this lecture.`
    },
    {
      heading: "16. Interview Questions and Answers on Maven, Gradle, JUnit 5 and Mockito",
      content: `**Q1. Explain the Maven build lifecycle. What happens when you run \`mvn install\`?**
Maven has three lifecycles: clean, default and site. The default lifecycle's main phases are validate, compile, test-compile, test, package, verify, install and deploy. Running \`mvn install\` executes every phase up to and including install: it validates the POM, compiles main and test sources, runs unit tests with Surefire (failing the build on any failure), packages the JAR, runs verify-phase checks such as Failsafe integration tests and JaCoCo gates, and copies the artifact into the local repository \`~/.m2/repository\` so other local projects can depend on it.
**Q2. What are Maven dependency scopes?**
\`compile\` (default, everywhere, packaged), \`provided\` (compile only, the runtime supplies it, not packaged), \`runtime\` (not needed to compile, needed to run, packaged; JDBC drivers), \`test\` (tests only, not packaged), \`system\` (deprecated, local file path), and \`import\` (only in \`dependencyManagement\`, to import a BOM).
**Q3. How does Maven resolve version conflicts between transitive dependencies?**
By nearest-wins mediation: the declaration closest to the root of the dependency tree wins; at equal depth, the first declaration wins. To control the result, declare the version in \`dependencyManagement\`, import a BOM, or use \`<exclusions>\`. \`mvn dependency:tree -Dverbose\` shows omitted versions.
**Q4. What is a BOM and why use it?**
A Bill of Materials is a \`pom\`-packaged artifact containing only a \`dependencyManagement\` section that lists mutually compatible versions of a family of libraries (\`junit-bom\`, \`spring-boot-dependencies\`). Importing it with \`<scope>import</scope>\` lets you omit versions on those dependencies and guarantees they match, avoiding \`NoSuchMethodError\` from mismatched artifacts.
**Q5. How does Gradle achieve faster builds than Maven?**
Gradle models the build as a directed graph of tasks with declared inputs and outputs. It skips tasks whose inputs are unchanged (up-to-date checks), reuses outputs from a local or remote build cache, keeps a warm daemon JVM, runs independent tasks in parallel, and with the configuration cache even skips re-evaluating the build scripts. Maven re-runs every phase on each invocation.
**Q6. Describe the JUnit 5 architecture.**
JUnit Platform is the launcher and engine API that IDEs and build tools integrate with; JUnit Jupiter is the new programming model (annotations, assertions, extensions) plus its engine; JUnit Vintage is an engine that runs JUnit 3 and 4 tests on the Platform. This separation lets other frameworks (Spock, Cucumber) run as Platform engines.
**Q7. What is the difference between \`@BeforeEach\` and \`@BeforeAll\`?**
\`@BeforeEach\` runs before every test method on a fresh test-class instance, for per-test fixtures. \`@BeforeAll\` runs once before all tests in the class, must be static (unless \`@TestInstance(PER_CLASS)\`), and is for expensive shared setup such as starting an embedded server.
**Q8. How do you test that a method throws an exception in JUnit 5?**
\`assertThrows(IllegalArgumentException.class, () -> service.call(-1))\` returns the exception so you can assert on its message. AssertJ's \`assertThatThrownBy(...).isInstanceOf(...).hasMessageContaining(...)\` is the fluent alternative. The JUnit 4 \`@Test(expected = ...)\` attribute no longer exists.
**Q9. What are argument matchers in Mockito and what is the rule for using them?**
Matchers such as \`any()\`, \`anyString()\`, \`eq(x)\` and \`argThat(predicate)\` match arguments flexibly during stubbing and verification. If you use a matcher for one argument of a call, you must use matchers for all of them, wrapping literals in \`eq()\`; otherwise Mockito throws \`InvalidUseOfMatchersException\`.
**Q10. What is ArgumentCaptor and when would you use it?**
\`ArgumentCaptor<T>\` captures the actual argument passed to a mock during \`verify\`, so you can assert on an object the class under test constructed internally, for example checking that the \`Transaction\` saved to the repository has the right amount and timestamp. It is the alternative to writing a complex \`argThat\` lambda.
**Q11. What does JaCoCo measure, and what is the difference between line and branch coverage?**
JaCoCo instruments bytecode via a Java agent and reports instruction, line, branch, method and class coverage plus cyclomatic complexity. Line coverage is the fraction of source lines executed at least once; branch coverage is the fraction of decision outcomes (\`if\`, \`switch\`, ternaries, short-circuit operators) exercised. Code can have full line coverage with missed branches, so branch coverage better reveals untested edge cases.
**Q12. What is TDD and what are its benefits and limits?**
Test-Driven Development is the Red-Green-Refactor loop: write a failing test, write the minimum code to pass, refactor with tests green. Benefits: executable specification, safer refactoring, simpler APIs shaped by usage, immediate feedback. Limits: slower initial development for exploratory or UI-heavy work, and it does not replace integration or end-to-end tests.`
    },
    {
      heading: "17. Hands-On Exercise: A UPI Wallet Service with Maven, JUnit 5, Mockito, AssertJ and JaCoCo",
      content: `Build a complete, tested wallet transfer service from scratch. The project is a plain Maven project (no Spring) so you can see every moving part. It uses everything from this lecture: a BOM-managed test stack, lifecycle hooks, parameterized tests, Mockito mocks with verification and \`ArgumentCaptor\`, AssertJ assertions and a JaCoCo coverage gate.
**Business rules**
1. A \`Wallet\` holds a UPI id and a balance in paise (\`long\`). \`deposit\` and \`withdraw\` reject non-positive amounts; \`withdraw\` throws \`InsufficientBalanceException\` when the balance is too low.
2. \`WalletService.transfer(from, to, amountPaise)\` loads both wallets from a \`WalletRepository\`, throws \`WalletNotFoundException\` if either is missing, rejects transfers above Rs 1,00,000 (the daily UPI cap in this exercise) with \`IllegalArgumentException\`, calls \`PaymentGateway.transfer\`, and only after the gateway succeeds debits, credits, saves both wallets and sends an SMS to the receiver. If the gateway throws, nothing is saved and no SMS is sent.
3. Amounts in messages are formatted as rupees with two decimals: 125050 paise becomes "Rs 1250.50".
**Steps**
1. Create the folder layout from section 2 and copy the files below. The \`pom.xml\` combines sections 3, 11 and 14.
2. Run \`mvn clean verify\`. Expect 23 tests passing and the JaCoCo gate satisfied.
3. Open \`target/site/jacoco/index.html\`. Find any red or yellow lines and add a test for each.
4. Extend with TDD: add a 0.5% fee for transfers above Rs 10,000, test-first. Then add \`@Tag("slow")\` to one test and run \`mvn test -DexcludedGroups=slow\`.
5. Optional: recreate the same project with Gradle Kotlin DSL using section 5's \`build.gradle.kts\` and compare \`./gradlew build\` output.
The code below is complete and compiles as-is with JDK 21 or 25 (set \`maven.compiler.release\` accordingly).`,
      codeSnippet: `<!-- pom.xml -->
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>in.ravindra</groupId>
  <artifactId>wallet-service</artifactId>
  <version>1.0.0-SNAPSHOT</version>

  <properties>
    <maven.compiler.release>25</maven.compiler.release>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
  </properties>

  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>org.junit</groupId><artifactId>junit-bom</artifactId>
        <version>6.0.0</version><type>pom</type><scope>import</scope>
      </dependency>
    </dependencies>
  </dependencyManagement>

  <dependencies>
    <dependency><groupId>org.junit.jupiter</groupId><artifactId>junit-jupiter</artifactId><scope>test</scope></dependency>
    <dependency><groupId>org.mockito</groupId><artifactId>mockito-junit-jupiter</artifactId><version>5.18.0</version><scope>test</scope></dependency>
    <dependency><groupId>org.assertj</groupId><artifactId>assertj-core</artifactId><version>3.27.3</version><scope>test</scope></dependency>
  </dependencies>

  <build>
    <plugins>
      <plugin><groupId>org.apache.maven.plugins</groupId><artifactId>maven-compiler-plugin</artifactId><version>3.14.0</version></plugin>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId><artifactId>maven-dependency-plugin</artifactId><version>3.8.1</version>
        <executions><execution><goals><goal>properties</goal></goals></execution></executions>
      </plugin>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId><artifactId>maven-surefire-plugin</artifactId><version>3.5.3</version>
        <configuration><argLine>@{argLine} -javaagent:\${org.mockito:mockito-core:jar}</argLine></configuration>
      </plugin>
      <plugin>
        <groupId>org.jacoco</groupId><artifactId>jacoco-maven-plugin</artifactId><version>0.8.14</version>
        <executions>
          <execution><goals><goal>prepare-agent</goal></goals></execution>
          <execution><id>report</id><phase>test</phase><goals><goal>report</goal></goals></execution>
          <execution><id>check</id><phase>verify</phase><goals><goal>check</goal></goals>
            <configuration><rules><rule><element>BUNDLE</element><limits>
              <limit><counter>LINE</counter><value>COVEREDRATIO</value><minimum>0.80</minimum></limit>
            </limits></rule></rules></configuration>
          </execution>
        </executions>
      </plugin>
    </plugins>
  </build>
</project>

// src/main/java/in/ravindra/wallet/InsufficientBalanceException.java
package in.ravindra.wallet;
public class InsufficientBalanceException extends RuntimeException {
    public InsufficientBalanceException(String message) { super(message); }
}

// src/main/java/in/ravindra/wallet/WalletNotFoundException.java
package in.ravindra.wallet;
public class WalletNotFoundException extends RuntimeException {
    public WalletNotFoundException(String upiId) { super("wallet not found: " + upiId); }
}

// src/main/java/in/ravindra/wallet/GatewayException.java
package in.ravindra.wallet;
public class GatewayException extends RuntimeException {
    public GatewayException(String message) { super(message); }
}

// src/main/java/in/ravindra/wallet/Money.java
package in.ravindra.wallet;
public final class Money {
    private Money() {}
    /** 125050 -> "Rs 1250.50" */
    public static String rupees(long paise) {
        return String.format("Rs %d.%02d", paise / 100, paise % 100);
    }
}

// src/main/java/in/ravindra/wallet/Wallet.java
package in.ravindra.wallet;

public class Wallet {
    private final String upiId;
    private long balancePaise;

    public Wallet(String upiId, long openingBalancePaise) {
        if (upiId == null || upiId.isBlank()) throw new IllegalArgumentException("upiId required");
        if (openingBalancePaise < 0) throw new IllegalArgumentException("opening balance cannot be negative");
        this.upiId = upiId;
        this.balancePaise = openingBalancePaise;
    }

    public String upiId() { return upiId; }
    public long balancePaise() { return balancePaise; }

    public void deposit(long paise) {
        requirePositive(paise);
        balancePaise += paise;
    }

    public void withdraw(long paise) {
        requirePositive(paise);
        if (paise > balancePaise) {
            throw new InsufficientBalanceException(
                    "insufficient balance: have " + Money.rupees(balancePaise)
                            + ", need " + Money.rupees(paise));
        }
        balancePaise -= paise;
    }

    private static void requirePositive(long paise) {
        if (paise <= 0) throw new IllegalArgumentException("amount must be positive");
    }
}

// src/main/java/in/ravindra/wallet/WalletRepository.java
package in.ravindra.wallet;
import java.util.Optional;
public interface WalletRepository {
    Optional<Wallet> findByUpi(String upiId);
    void save(Wallet wallet);
}

// src/main/java/in/ravindra/wallet/PaymentGateway.java
package in.ravindra.wallet;
public interface PaymentGateway {
    String transfer(String fromUpi, String toUpi, long amountPaise);
}

// src/main/java/in/ravindra/wallet/NotificationService.java
package in.ravindra.wallet;
public interface NotificationService {
    void sendSms(String upiId, String message);
}

// src/main/java/in/ravindra/wallet/TransferResult.java
package in.ravindra.wallet;
public record TransferResult(String transactionId, String fromUpi, String toUpi, long amountPaise) {}

// src/main/java/in/ravindra/wallet/WalletService.java
package in.ravindra.wallet;

public class WalletService {
    static final long DAILY_CAP_PAISE = 1_00_000_00L;   // Rs 1,00,000

    private final WalletRepository repository;
    private final PaymentGateway gateway;
    private final NotificationService notifier;

    public WalletService(WalletRepository repository, PaymentGateway gateway, NotificationService notifier) {
        this.repository = repository;
        this.gateway = gateway;
        this.notifier = notifier;
    }

    public TransferResult transfer(String fromUpi, String toUpi, long amountPaise) {
        if (amountPaise <= 0) throw new IllegalArgumentException("amount must be positive");
        if (amountPaise > DAILY_CAP_PAISE) throw new IllegalArgumentException("amount exceeds daily cap");
        if (fromUpi.equals(toUpi)) throw new IllegalArgumentException("cannot transfer to self");

        Wallet from = repository.findByUpi(fromUpi).orElseThrow(() -> new WalletNotFoundException(fromUpi));
        Wallet to   = repository.findByUpi(toUpi).orElseThrow(() -> new WalletNotFoundException(toUpi));
        if (amountPaise > from.balancePaise()) {
            throw new InsufficientBalanceException("insufficient balance in " + fromUpi);
        }

        String txnId = gateway.transfer(fromUpi, toUpi, amountPaise);   // may throw GatewayException

        from.withdraw(amountPaise);
        to.deposit(amountPaise);
        repository.save(from);
        repository.save(to);
        notifier.sendSms(toUpi, "You received " + Money.rupees(amountPaise) + " from " + fromUpi);
        return new TransferResult(txnId, fromUpi, toUpi, amountPaise);
    }
}

// src/test/java/in/ravindra/wallet/WalletTest.java
package in.ravindra.wallet;

import org.junit.jupiter.api.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;

import static org.assertj.core.api.Assertions.*;

@DisplayNameGeneration(DisplayNameGenerator.ReplaceUnderscores.class)
class WalletTest {

    private Wallet wallet;

    @BeforeEach
    void setUp() { wallet = new Wallet("ravi@upi", 500_00); }

    @Test
    void deposit_increases_balance() {
        wallet.deposit(250_00);
        assertThat(wallet.balancePaise()).isEqualTo(750_00);
    }

    @Test
    void withdraw_decreases_balance() {
        wallet.withdraw(200_00);
        assertThat(wallet.balancePaise()).isEqualTo(300_00);
    }

    @Test
    void withdraw_more_than_balance_throws_with_helpful_message() {
        assertThatThrownBy(() -> wallet.withdraw(600_00))
                .isInstanceOf(InsufficientBalanceException.class)
                .hasMessage("insufficient balance: have Rs 500.00, need Rs 600.00");
        assertThat(wallet.balancePaise()).isEqualTo(500_00);
    }

    @ParameterizedTest(name = "amount {0} paise is rejected")
    @ValueSource(longs = {0, -1, -500_00})
    void non_positive_amounts_are_rejected(long paise) {
        assertThatThrownBy(() -> wallet.deposit(paise)).isInstanceOf(IllegalArgumentException.class);
        assertThatThrownBy(() -> wallet.withdraw(paise)).isInstanceOf(IllegalArgumentException.class);
    }

    @ParameterizedTest
    @ValueSource(strings = {"", "   "})
    void blank_upi_id_is_rejected(String upi) {
        assertThatThrownBy(() -> new Wallet(upi, 0)).isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void null_upi_id_is_rejected() {
        assertThatThrownBy(() -> new Wallet(null, 0)).isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void negative_opening_balance_is_rejected() {
        assertThatThrownBy(() -> new Wallet("x@upi", -1)).isInstanceOf(IllegalArgumentException.class);
    }

    @ParameterizedTest(name = "{0} paise -> {1}")
    @CsvSource({
            "125050, Rs 1250.50",
            "100,    Rs 1.00",
            "5,      Rs 0.05",
            "0,      Rs 0.00",
            "10000000, Rs 100000.00"
    })
    void money_formats_paise_as_rupees(long paise, String expected) {
        assertThat(Money.rupees(paise)).isEqualTo(expected);
    }
}

// src/test/java/in/ravindra/wallet/WalletServiceTest.java
package in.ravindra.wallet;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WalletServiceTest {

    @Mock WalletRepository repository;
    @Mock PaymentGateway gateway;
    @Mock NotificationService notifier;
    @InjectMocks WalletService service;

    private Wallet ravi;
    private Wallet priya;

    @BeforeEach
    void wallets() {
        ravi  = new Wallet("ravi@upi", 5_000_00);
        priya = new Wallet("priya@upi", 100_00);
    }

    private void stubBothWallets() {
        when(repository.findByUpi("ravi@upi")).thenReturn(Optional.of(ravi));
        when(repository.findByUpi("priya@upi")).thenReturn(Optional.of(priya));
    }

    @Nested
    class SuccessfulTransfer {
        @BeforeEach
        void happyGateway() {
            stubBothWallets();
            when(gateway.transfer("ravi@upi", "priya@upi", 1_250_50)).thenReturn("TXN-42");
        }

        @Test
        void movesMoneyAndReturnsResult() {
            TransferResult result = service.transfer("ravi@upi", "priya@upi", 1_250_50);

            assertThat(result).usingRecursiveComparison()
                    .isEqualTo(new TransferResult("TXN-42", "ravi@upi", "priya@upi", 1_250_50));
            assertThat(ravi.balancePaise()).isEqualTo(3_749_50);
            assertThat(priya.balancePaise()).isEqualTo(1_350_50);
        }

        @Test
        void savesBothWalletsAndNotifiesReceiver() {
            service.transfer("ravi@upi", "priya@upi", 1_250_50);

            verify(repository).save(ravi);
            verify(repository).save(priya);
            ArgumentCaptor<String> sms = ArgumentCaptor.forClass(String.class);
            verify(notifier).sendSms(eq("priya@upi"), sms.capture());
            assertThat(sms.getValue()).isEqualTo("You received Rs 1250.50 from ravi@upi");
            verifyNoMoreInteractions(notifier);
        }
    }

    @Nested
    class FailedTransfer {
        @Test
        void gatewayErrorLeavesBalancesUntouched() {
            stubBothWallets();
            when(gateway.transfer(anyString(), anyString(), anyLong()))
                    .thenThrow(new GatewayException("NPCI timeout"));

            assertThatThrownBy(() -> service.transfer("ravi@upi", "priya@upi", 500_00))
                    .isInstanceOf(GatewayException.class)
                    .hasMessage("NPCI timeout");

            assertThat(ravi.balancePaise()).isEqualTo(5_000_00);
            assertThat(priya.balancePaise()).isEqualTo(100_00);
            verify(repository, never()).save(any());
            verifyNoInteractions(notifier);
        }

        @Test
        void insufficientBalanceIsDetectedBeforeCallingGateway() {
            stubBothWallets();

            assertThatThrownBy(() -> service.transfer("ravi@upi", "priya@upi", 9_000_00))
                    .isInstanceOf(InsufficientBalanceException.class);

            verifyNoInteractions(gateway, notifier);
        }

        @Test
        void unknownSenderThrowsWalletNotFound() {
            when(repository.findByUpi("ghost@upi")).thenReturn(Optional.empty());

            assertThatThrownBy(() -> service.transfer("ghost@upi", "priya@upi", 10_00))
                    .isInstanceOf(WalletNotFoundException.class)
                    .hasMessage("wallet not found: ghost@upi");

            verify(repository, never()).findByUpi("priya@upi");
            verifyNoInteractions(gateway);
        }

        @Test
        void amountAboveDailyCapIsRejectedWithoutAnyLookup() {
            assertThatThrownBy(() -> service.transfer("ravi@upi", "priya@upi", 1_00_000_01L))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("daily cap");
            verifyNoInteractions(repository, gateway, notifier);
        }

        @Test
        void selfTransferIsRejected() {
            assertThatThrownBy(() -> service.transfer("ravi@upi", "ravi@upi", 10_00))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("self");
        }

        @Test
        void zeroAmountIsRejected() {
            assertThatThrownBy(() -> service.transfer("ravi@upi", "priya@upi", 0))
                    .isInstanceOf(IllegalArgumentException.class);
        }
    }
}

/* $ mvn clean verify
[INFO] Running in.ravindra.wallet.WalletTest
[INFO] Tests run: 15, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running in.ravindra.wallet.WalletServiceTest
[INFO] Tests run: 8, Failures: 0, Errors: 0, Skipped: 0
[INFO] Results:
[INFO] Tests run: 23, Failures: 0, Errors: 0, Skipped: 0
[INFO] --- jacoco:0.8.14:report (report) @ wallet-service ---
[INFO] Analyzed bundle 'wallet-service' with 9 classes
[INFO] --- jacoco:0.8.14:check (check) @ wallet-service ---
[INFO] All coverage checks have been met.
[INFO] BUILD SUCCESS
*/`
    },
    {
      heading: "18. Summary",
      content: `• **Build tools** turn source code into tested, packaged, reproducible artifacts. **Maven** (XML \`pom.xml\`, fixed lifecycle, convention over configuration) and **Gradle** (Kotlin DSL task graph, incremental and cached builds) both resolve dependencies from Maven Central; always use the wrapper (\`./mvnw\`, \`./gradlew\`).
• A Maven project is identified by \`groupId:artifactId:version\`, follows the \`src/main\` / \`src/test\` layout, and sets \`maven.compiler.release\` (25 for the current LTS, 21 for the previous).
• **Dependencies** have scopes (\`compile\`, \`test\`, \`provided\`, \`runtime\`, \`import\`); transitive conflicts are resolved nearest-wins; \`dependencyManagement\` and **BOMs** (\`junit-bom\`, \`spring-boot-dependencies\`) keep versions consistent; \`mvn dependency:tree\` shows the truth.
• The **default lifecycle** runs validate → compile → test-compile → test → package → verify → install → deploy; \`mvn clean verify\` is the everyday command; Surefire runs \`*Test\` classes, Failsafe runs \`*IT\` classes.
• **Gradle Kotlin DSL**: \`plugins\`, \`dependencies\` with \`implementation\`/\`testImplementation\`/\`testRuntimeOnly\`, toolchains, \`tasks.test { useJUnitPlatform() }\`, and since Gradle 9 an explicit \`junit-platform-launcher\` dependency.
• **JUnit 5 (Jupiter)**: Platform + Jupiter + Vintage; JUnit 6.0 (September 2025) keeps the API with a Java 17 baseline. Tests follow Arrange-Act-Assert; use \`assertEquals\`, \`assertThrows\`, \`assertAll\`, and lifecycle hooks \`@BeforeEach\`, \`@BeforeAll\` (static), \`@Nested\`, \`@Disabled\`, \`@Tag\`, \`@Timeout\`.
• **Parameterized tests** with \`@ValueSource\`, \`@CsvSource\`, \`@MethodSource\`, \`@EnumSource\`, \`@NullAndEmptySource\` replace copy-pasted tests; \`@RepeatedTest\` and \`@TestFactory\` cover the rest.
• **Mockito** isolates the class under test: \`@ExtendWith(MockitoExtension.class)\`, \`@Mock\`, \`@InjectMocks\`, \`when().thenReturn()\`, matchers (all or none), \`verify\`, \`ArgumentCaptor\`, spies with \`doReturn\`, scoped \`mockStatic\`; strict stubs catch unused stubbing; attach the agent explicitly on Java 21+.
• **AssertJ** gives fluent, type-aware assertions for collections, strings, optionals, exceptions, recursive object comparison and soft assertions.
• **JaCoCo** measures instruction, line and branch coverage via a Java agent; configure \`prepare-agent\`, \`report\` and \`check\`, use 0.8.14+ for Java 25, gate around 80%, and treat coverage as a map of untested code, not a trophy.
• **TDD** is Red → Green → Refactor; good tests are FIRST (Fast, Independent, Repeatable, Self-validating, Timely); keep the test pyramid upright with many unit tests, fewer integration tests and few end-to-end tests.
**Next lecture:** Building REST APIs with Spring Boot`
    }
  ]
};
