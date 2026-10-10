export const lecture10 = {
  slug: "lecture-10",
  number: 10,
  title: "Complete Java Course — Lecture 10: Modern Java (17 to 25) — Records, Sealed Types, Pattern Matching & More",
  summary: "Learn modern Java from 17 to 25: records and compact constructors, sealed classes, pattern matching for instanceof and switch, record patterns, unnamed variables, text blocks, var, sequenced collections, virtual threads and the new Java 25 features, with a clear final-vs-preview map, interview questions and a hands-on exercise.",
  readTime: "52 min read",
  difficulty: "Intermediate",
  date: "2026-10-09",
  sections: [
    {
      heading: "1. Introduction: What Is Modern Java (17 to 25) and Why It Matters",
      content: `For almost a decade, "Java" in most Indian colleges and many service companies meant Java 8: anonymous classes, getters and setters written by the IDE, long \`if (obj instanceof X) { X x = (X) obj; ... }\` chains and a thread pool for everything. That Java still runs, but it is no longer the Java that companies hire for. Since Java 9, the JDK ships a new feature release every six months (March and September), and every two years one of those releases becomes a **Long-Term Support (LTS)** version. The LTS versions that matter today are **Java 17 (September 2021)**, **Java 21 (September 2023)** and **Java 25 (September 2025)**, the current LTS.
"Modern Java" is the collection of language and library features that arrived between Java 10 and Java 25 and changed how everyday code looks:
• **Records** remove the boilerplate of data classes (constructor, getters, \`equals\`, \`hashCode\`, \`toString\`).
• **Sealed classes and interfaces** let you say exactly which types belong to a hierarchy, so the compiler can check that a \`switch\` handles every case.
• **Pattern matching** for \`instanceof\`, \`switch\` and records lets you test a type, extract its parts and bind variables in one expression.
• **Text blocks, var and switch expressions** make ordinary code shorter and clearer.
• **Sequenced collections and virtual threads** modernise the core library and the concurrency model.
Why should you care, beyond nicer syntax? Three practical reasons. First, **frameworks have moved on**: Spring Boot 3.x and 4.x both require Java 17 as the minimum, and Spring Boot 3.2+ supports virtual threads out of the box. Second, **code reviews and interviews** now expect you to know when a record is appropriate, what \`sealed\` buys you and how exhaustive \`switch\` works; "What is a record in Java?" is one of the most common questions for 2 to 6 year developers. Third, **correctness**: many modern features move checks from runtime to compile time, which means fewer production bugs.
This lecture builds on the previous one (lambdas, functional interfaces and streams) and goes feature by feature. For each one you will learn what it is, which Java version introduced it and finalised it, how the syntax works, a realistic example, the pitfalls, and how to adopt it in an existing codebase. We will be strict about one thing throughout: **preview features are labelled as preview**, so you never ship code that depends on something that may change.`,
      codeSnippet: `// Before (Java 8 style) vs After (Java 21+) — the same logic
// File: Before.java
import java.util.Objects;

final class MoneyOld {
    private final long paise;
    private final String currency;
    MoneyOld(long paise, String currency) { this.paise = paise; this.currency = currency; }
    long getPaise() { return paise; }
    String getCurrency() { return currency; }
    @Override public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof MoneyOld)) return false;
        MoneyOld m = (MoneyOld) o;
        return paise == m.paise && currency.equals(m.currency);
    }
    @Override public int hashCode() { return Objects.hash(paise, currency); }
    @Override public String toString() { return "MoneyOld[paise=" + paise + ", currency=" + currency + "]"; }
}

// File: After.java (Java 16+ for records, Java 21+ for the switch below)
record Money(long paise, String currency) { }

public class After {
    static String describe(Object o) {
        return switch (o) {
            case Money(long p, String c) when p == 0 -> "zero " + c;
            case Money(long p, String c) -> "₹" + (p / 100.0) + " in " + c;
            case null -> "nothing";
            default -> "unknown: " + o;
        };
    }
    public static void main(String[] args) {
        System.out.println(describe(new Money(12_50, "INR"))); // ₹12.5 in INR
        System.out.println(describe(null));                    // nothing
    }
}`
    },
    {
      heading: "2. Modern Java Version Map: What Is Final in Java 17, 21 and 25 vs Preview",
      content: `Before touching any feature, you need an accurate map of **which version introduced it and in which version it became final**. Each feature is tracked as a **JEP (JDK Enhancement Proposal)**. A feature may go through one or more **preview** rounds (you must compile and run with \`--enable-preview\`, and the syntax may change) before it becomes **final** (standard, safe to use in production). Some features are also **incubator** modules (API experiments in \`jdk.incubator.*\` packages) or **experimental** JVM options.
**Final before Java 17 (available in all three LTS versions):**
• \`var\` for local variables — Java 10 (JEP 286); \`var\` in lambda parameters — Java 11 (JEP 323).
• Switch expressions with arrow labels and \`yield\` — Java 14 (JEP 361).
• Helpful NullPointerException messages — Java 14, on by default since 15.
• Text blocks — Java 15 (JEP 378).
• Records — Java 16 (JEP 395). Pattern matching for \`instanceof\` — Java 16 (JEP 394).
**Final in Java 17 (LTS):** sealed classes and interfaces (JEP 409). Java 17 also removed the experimental AOT/JIT compiler and strongly encapsulated JDK internals (JEP 403).
**Final in Java 21 (LTS):** record patterns (JEP 440), pattern matching for \`switch\` (JEP 441), virtual threads (JEP 444), sequenced collections (JEP 431), generational ZGC (JEP 439). **Preview in 21 (not final):** unnamed patterns and variables (JEP 443), unnamed classes and instance main methods (JEP 445), string templates (JEP 430), scoped values (JEP 446), structured concurrency (JEP 453).
**Final between 22 and 24:** unnamed variables and patterns (Java 22, JEP 456), Foreign Function & Memory API (Java 22, JEP 454), Markdown documentation comments (Java 23, JEP 467), stream gatherers (Java 24, JEP 485), class-file API (Java 24, JEP 484), synchronize virtual threads without pinning (Java 24, JEP 491). **Removed:** string templates were withdrawn in Java 23 and do not exist in Java 25; do not learn them from old tutorials.
**Final in Java 25 (LTS):** compact source files and instance main methods (JEP 512), flexible constructor bodies (JEP 513), module import declarations (JEP 511), scoped values (JEP 506), key derivation function API (JEP 510), compact object headers (JEP 519), generational Shenandoah (JEP 521), plus AOT ergonomics and profiling (JEPs 514, 515). **Still preview in 25:** primitive types in patterns, \`instanceof\` and \`switch\` (JEP 507, third preview), structured concurrency (JEP 505, fifth preview), stable values (JEP 502), PEM encodings (JEP 470). The Vector API is still an incubator (JEP 508).
Keep this map handy: when an interviewer asks "Is pattern matching for switch a preview feature?", the correct answer is "It was preview in 17 to 20 and final since Java 21."`,
      codeSnippet: `// Check which Java you are running and whether preview features are enabled
// File: VersionCheck.java
public class VersionCheck {
    public static void main(String[] args) {
        System.out.println("java.version      = " + System.getProperty("java.version"));
        System.out.println("feature version   = " + Runtime.version().feature());
        System.out.println("vendor            = " + System.getProperty("java.vendor"));
    }
}
// $ javac VersionCheck.java && java VersionCheck
// java.version      = 25.0.1
// feature version   = 25
//
// Preview features require BOTH flags at the same version:
// $ javac --release 25 --enable-preview Demo.java
// $ java --enable-preview Demo
//
// Maven: <maven.compiler.release>25</maven.compiler.release>
// Gradle (Kotlin DSL): java { toolchain { languageVersion = JavaLanguageVersion.of(25) } }`
    },
    {
      heading: "3. Foundation Syntax: var, Text Blocks and Enhanced switch Expressions",
      content: `Three smaller features appear inside almost every modern Java example, so we cover them first.
**\`var\` — local variable type inference (Java 10, final).** \`var\` lets the compiler infer the type of a **local variable** from its initialiser. It is not dynamic typing: \`var list = new ArrayList<String>();\` makes \`list\` an \`ArrayList<String>\` forever. Rules: only for local variables, for-loop variables, try-with-resources variables and (since Java 11) lambda parameters; you must initialise it; you cannot use it for fields, method parameters or return types; \`var x = null;\` is an error. Use \`var\` when the type is obvious from the right-hand side (\`var customer = new Customer(...)\`) and avoid it when it hides information (\`var result = service.process();\`).
**Text blocks (Java 15, final).** A text block starts with three double quotes followed by a newline and ends with three double quotes. It preserves line breaks, strips the common leading indentation (determined by the least-indented line, including the closing delimiter) and removes trailing spaces. You no longer need \`+ "\\n" +\` concatenation for JSON, SQL or HTML. Escape sequences still work; \`\\\` at the end of a line suppresses the newline, and \`\\s\` is a single space that survives stripping. Combine with \`String.formatted(...)\` (Java 15) for placeholders.
**Enhanced switch / switch expressions (Java 14, final).** The arrow form \`case A, B -> expr;\` has no fall-through, multiple labels per case, and can be used as an **expression** that returns a value. A switch expression must be **exhaustive**: for \`enum\` types the compiler checks every constant; otherwise you need \`default\`. For a block body use \`yield value;\`. Old colon-style \`case X:\` still works but mixing the two styles in one switch is a compile error. Switch expressions on \`String\`, \`int\`, \`char\` and \`enum\` are the foundation on which pattern matching for \`switch\` (Section 8) was built.`,
      codeSnippet: `// File: FoundationDemo.java  (Java 17+)
import java.util.List;
import java.util.Map;

public class FoundationDemo {
    enum Day { MON, TUE, WED, THU, FRI, SAT, SUN }

    public static void main(String[] args) {
        // var: type is inferred once, then fixed
        var cities = List.of("Mumbai", "Pune", "Chennai");
        var prices = Map.of("Mumbai", 5_500, "Pune", 3_200);
        for (var city : cities) {
            System.out.println(city + " -> " + prices.getOrDefault(city, 0));
        }

        // Text block: JSON without escaping every quote
        String json = """
            {
              "name": "Ravindra",
              "city": "Bengaluru",
              "skills": ["Java", "Spring Boot"]
            }
            """;
        System.out.print(json);

        // Text block + formatted()
        String sql = """
            SELECT id, name FROM customers
            WHERE city = '%s' AND active = %b
            """.formatted("Hyderabad", true);
        System.out.print(sql);

        // Switch expression: exhaustive over the enum, no break needed
        Day today = Day.SAT;
        int workingHours = switch (today) {
            case MON, TUE, WED, THU, FRI -> 8;
            case SAT -> {
                System.out.println("Half day");
                yield 4;
            }
            case SUN -> 0;
        };
        System.out.println("Working hours: " + workingHours);
    }
}
// Output:
// Mumbai -> 5500
// Pune -> 3200
// Chennai -> 0
// {  "name": "Ravindra", ... }   (printed as 5 lines)
// SELECT id, name FROM customers
// WHERE city = 'Hyderabad' AND active = true
// Half day
// Working hours: 4`
    },
    {
      heading: "4. Records in Java: Immutable Data, Compact Constructors and Validation (Java 16)",
      content: `A **record** is a class whose purpose is to carry data. You declare the **components** in the header, and the compiler generates everything a well-written data class needs: a private final field per component, a **canonical constructor** that takes all components in order, an **accessor** method per component named exactly like the component (\`name()\`, not \`getName()\`), and \`equals\`, \`hashCode\` and \`toString\` based on all components. Records were previewed in Java 14 and 15 and became **final in Java 16 (JEP 395)**, so they are available in every current LTS.
Rules you must know: a record is **implicitly final** and extends \`java.lang.Record\`, so it cannot extend another class and cannot be extended. It **cannot declare instance fields** other than the components, but it can have static fields, static methods, instance methods, nested types and can implement interfaces (including \`Comparable\` and \`Serializable\`). Records can be generic (\`record Pair<A, B>(A first, B second)\`) and can be declared **locally** inside a method, which is handy in stream pipelines. A nested record is implicitly static.
Records are **shallowly immutable**: the fields are final, but if a component is a mutable \`List\`, callers can still mutate it. The fix is to copy in the constructor (\`List.copyOf(items)\`), as shown below.
**Compact constructors** are the most important customisation. Writing \`record Money(long paise, String currency) { Money { ... } }\` declares a compact canonical constructor: it has no parameter list, runs **before** the fields are assigned, and the fields are assigned automatically at the end from the (possibly reassigned) parameters. Use it for validation (\`if (paise < 0) throw new IllegalArgumentException(...)\`) and normalisation (\`currency = currency.toUpperCase()\`). You cannot write \`this.paise = paise\` in a compact constructor; that is a compile error. You can also declare extra constructors, but each must delegate to the canonical constructor with \`this(...)\`. You may override an accessor (for example to return a defensive copy) and override \`toString\` if the default is too verbose.
When should you **not** use a record? When the object has identity and changes over time (a JPA entity with a database-generated id, a mutable shopping cart), when you need inheritance between data types (use a sealed interface implemented by several records instead), or when the class has behaviour that is not derived purely from its data. Records are ideal for DTOs, API request/response bodies, value objects (Money, Address, GeoPoint), map keys, compound return values and configuration snapshots. With Jackson 2.12+ (bundled in Spring Boot 3 and 4) records serialise and deserialise without any annotations.`,
      codeSnippet: `// File: RecordDemo.java  (Java 16+)
import java.util.List;

public class RecordDemo {

    // Value object with validation and normalisation
    record Money(long paise, String currency) implements Comparable<Money> {
        Money {                                     // compact canonical constructor
            if (paise < 0) throw new IllegalArgumentException("Amount cannot be negative: " + paise);
            if (currency == null || currency.isBlank()) throw new IllegalArgumentException("currency required");
            currency = currency.trim().toUpperCase(); // reassign the PARAMETER; field is set after this block
        }
        Money(long paise) { this(paise, "INR"); }   // extra constructor must delegate

        static Money ofRupees(double rupees) { return new Money(Math.round(rupees * 100)); }
        Money plus(Money other) {
            if (!currency.equals(other.currency)) throw new IllegalArgumentException("currency mismatch");
            return new Money(paise + other.paise, currency);
        }
        @Override public int compareTo(Money o) { return Long.compare(paise, o.paise); }
        @Override public String toString() { return String.format("%s %.2f", currency, paise / 100.0); }
    }

    // Defensive copy to keep the record deeply immutable
    record Order(String id, List<String> items) {
        Order {
            items = List.copyOf(items);           // throws NPE on null, copies otherwise
        }
    }

    // Generic record
    record Pair<A, B>(A first, B second) { }

    public static void main(String[] args) {
        Money fee = new Money(2_50, " inr ");
        Money gst = Money.ofRupees(0.45);
        System.out.println(fee);                      // INR 2.50
        System.out.println(fee.plus(gst));            // INR 2.95
        System.out.println(fee.equals(new Money(250, "INR"))); // true
        System.out.println(new Pair<>("Delhi", 110001));       // Pair[first=Delhi, second=110001]

        var original = new java.util.ArrayList<>(List.of("pen", "book"));
        var order = new Order("ORD-1", original);
        original.add("hacked");
        System.out.println(order.items());            // [pen, book]  (copy is unaffected)

        try {
            new Money(-5, "INR");
        } catch (IllegalArgumentException e) {
            System.out.println("Rejected: " + e.getMessage()); // Rejected: Amount cannot be negative: -5
        }
    }
}`
    },
    {
      heading: "5. Sealed Classes and Interfaces: Closed Type Hierarchies (Java 17)",
      content: `Inheritance in classic Java is open-ended: any class in any jar can implement your \`PaymentMethod\` interface. That is great for plugins but terrible when you want to reason about **all the cases** of a domain concept. A **sealed** class or interface (previewed in Java 15 and 16, **final in Java 17, JEP 409**) restricts which classes may extend or implement it. You list them with the \`permits\` clause, and every permitted subclass must declare itself as one of:
• \`final\` — no further subclassing (records are implicitly final, so they fit naturally);
• \`sealed\` — it continues the closed hierarchy with its own \`permits\` list;
• \`non-sealed\` — it deliberately re-opens the hierarchy from that point down.
Constraints: permitted subclasses must be in the **same module**, or in the **same package** if you are in the unnamed module (a typical non-modular project). If all the subclasses are declared in the **same compilation unit (file)** as the sealed type, you may omit \`permits\` and the compiler infers it. A permitted class must directly extend the sealed class. Enums were already closed sets of constants; sealed types are closed sets of **types**, each of which can carry different data.
Why does this matter? Because the compiler now knows the complete set of subtypes, **switch over a sealed type can be checked for exhaustiveness**: if you add a new \`UpiPayment\` next quarter, every \`switch\` that forgot to handle it fails to compile instead of silently falling into \`default\`. This is the Java equivalent of algebraic data types (sum types) in Kotlin, Scala and Rust, and it is the reason sealed types and pattern matching are always taught together.
Sealed types also document intent and improve API security. A library can expose a sealed interface \`Result<T>\` with exactly two cases, \`Success\` and \`Failure\`, and no caller can inject a third. Reflection reports the information too: \`Class.isSealed()\` and \`Class.getPermittedSubclasses()\`.
Design tip: model **domain events, API responses, parser tokens, UI states and commands** as a sealed interface plus records. Keep the \`switch\` logic in services; keep the records free of behaviour except simple validation. Avoid \`default\` branches in such switches so that you benefit from the compile-time check.`,
      codeSnippet: `// File: PaymentDemo.java  (Java 17+ for sealed; Java 21+ for the pattern switch)
public class PaymentDemo {

    sealed interface PaymentMethod permits Upi, Card, NetBanking, Wallet { }

    record Upi(String vpa) implements PaymentMethod { }
    record Card(String last4, String network, boolean international) implements PaymentMethod { }
    record NetBanking(String bankCode) implements PaymentMethod { }

    // non-sealed: wallets are re-opened; anyone may add wallet providers
    non-sealed interface Wallet extends PaymentMethod { String provider(); }
    record PaytmWallet(String mobile) implements Wallet {
        public String provider() { return "Paytm"; }
    }

    // Exhaustive: no default needed; adding a new permitted type breaks compilation here
    static double feePercent(PaymentMethod pm) {
        return switch (pm) {
            case Upi u                               -> 0.0;
            case Card c when c.international()       -> 3.5;
            case Card c                              -> 1.8;
            case NetBanking nb                       -> 1.0;
            case Wallet w                            -> 2.0;
        };
    }

    public static void main(String[] args) {
        System.out.println(feePercent(new Upi("ravi@okaxis")));                // 0.0
        System.out.println(feePercent(new Card("4242", "VISA", true)));       // 3.5
        System.out.println(feePercent(new PaytmWallet("98xxxxxx10")));        // 2.0
        System.out.println(PaymentMethod.class.isSealed());                   // true
        for (Class<?> c : PaymentMethod.class.getPermittedSubclasses()) {
            System.out.println("permits " + c.getSimpleName());
        }
    }
}`
    },
    {
      heading: "6. Pattern Matching for instanceof (Java 16)",
      content: `The classic test-and-cast idiom is three steps: test with \`instanceof\`, declare a variable, cast. It is verbose and the cast can drift out of sync with the test. **Pattern matching for \`instanceof\`** (previewed in 14 and 15, **final in Java 16, JEP 394**) merges all three: \`if (obj instanceof String s)\` tests whether \`obj\` is a \`String\` and, if so, binds the **pattern variable** \`s\` of type \`String\` for use inside the block. No explicit cast, no chance of a \`ClassCastException\`.
The important concept is **flow scoping**: the pattern variable is in scope wherever the compiler can prove the test succeeded. That includes the right side of \`&&\` (\`obj instanceof String s && s.length() > 5\`), the if-body, and even the code **after** an if-statement that returns or throws when the match fails (\`if (!(obj instanceof String s)) return; // s is usable here\`). It does **not** include the right side of \`||\`, because the test may have failed there.
Pattern variables are ordinary local variables: you can reassign them (not recommended), they can shadow fields, and they can be declared with \`final\`. The pattern type can be generic, with the usual unchecked-cast rules: \`obj instanceof List<?> list\` is fine, \`obj instanceof List<String> list\` is an error unless the compiler can prove it safe. Since Java 21, patterns in \`instanceof\` may also be **record patterns** (\`obj instanceof Point(int x, int y)\`), covered in Section 9.
The most common real-world use is in \`equals\` methods, where \`if (!(o instanceof Customer other)) return false;\` replaces two lines and reads naturally. Other uses: handling heterogeneous JSON values, visitor-free tree walking, and checking a \`Throwable\` cause chain. Remember that if you find yourself writing **many** \`instanceof\` checks over the same value, a \`switch\` with patterns (next section) is clearer and can be checked for exhaustiveness.`,
      codeSnippet: `// File: InstanceofPatternDemo.java  (Java 16+)
import java.util.Objects;

public class InstanceofPatternDemo {

    static final class Customer {
        private final String email;
        private final int tier;
        Customer(String email, int tier) { this.email = email; this.tier = tier; }

        @Override public boolean equals(Object o) {
            // One line replaces: instanceof check + declaration + cast
            return o instanceof Customer other
                && tier == other.tier
                && email.equalsIgnoreCase(other.email);
        }
        @Override public int hashCode() { return Objects.hash(email.toLowerCase(), tier); }
    }

    static String format(Object value) {
        if (value instanceof Integer i && i > 1000) {
            return String.format("%,d (large)", i);        // i is an Integer here
        }
        if (!(value instanceof CharSequence text)) {
            return String.valueOf(value);                   // text NOT in scope here
        }
        // text IS in scope here: the previous if returned when the match failed
        return text.length() > 10 ? text.subSequence(0, 10) + "..." : text.toString();
    }

    public static void main(String[] args) {
        System.out.println(new Customer("A@x.com", 2).equals(new Customer("a@x.com", 2))); // true
        System.out.println(format(125000));                       // 1,25,000 (large) in en-IN; 125,000 in en-US
        System.out.println(format("Gurugram Cyber Hub"));        // Gurugram C...
        System.out.println(format(3.14));                         // 3.14
    }
}`
    },
    {
      heading: "7. Pattern Matching for switch, Guards and Exhaustiveness (Java 21)",
      content: `**Pattern matching for \`switch\`** (previewed in Java 17 to 20, **final in Java 21, JEP 441**) is the centrepiece of modern Java. A \`switch\` can now select over **any reference type**, not just \`int\`, \`String\` and enums, and its case labels can be **type patterns** (\`case Circle c\`), **record patterns** (\`case Point(int x, int y)\`), **\`null\`** (\`case null\`) and the familiar constants. Each case binds variables you can use in its body.
Four rules make it work:
• **Guards:** \`case Card c when c.international() -> ...\` adds a boolean condition after the pattern. If the guard is false, matching continues with the next case. The keyword is \`when\`, and it is a contextual keyword (you can still name a variable \`when\`).
• **Dominance:** a case that would never be reached because an earlier case already matches everything it could match is a **compile error**. So \`case Shape s\` must come **after** \`case Circle c\`, and an unguarded pattern must come after guarded patterns of the same type. Constant labels for a type must come before a type pattern for that type.
• **Exhaustiveness:** a pattern switch (statement or expression) must cover every possible value. For a sealed type, listing all permitted subtypes is exhaustive; for other types you need \`default\` or a total pattern like \`case Object o\`. The compiler enforces this at compile time; if a sealed hierarchy is later changed and only partly recompiled, the JVM throws \`MatchException\` at runtime.
• **Null handling:** a pattern switch throws \`NullPointerException\` on a \`null\` selector **unless** you add \`case null\` (or the combined \`case null, default\`). Previously, every switch on a reference type did that; now you can opt in.
Java 21 also allows **qualified enum constants** in case labels (\`case Suit.HEARTS\`) and lets a switch over a sealed interface mix enum constants and type patterns.
A good mental model: a pattern switch is a **type-safe visitor** without the visitor interface. In pre-21 code you either wrote long \`instanceof\` chains or the Visitor pattern with \`accept\`/\`visit\` methods in every class. Both scatter logic. With sealed types plus pattern switch, each operation (pricing, rendering, validation) is one method with one exhaustive switch, and the data types stay small records. Compiler support means that adding a case to the domain surfaces every switch that needs updating.`,
      codeSnippet: `// File: ShapeSwitchDemo.java  (Java 21+)
public class ShapeSwitchDemo {

    sealed interface Shape permits Circle, Rectangle, Triangle { }
    record Circle(double radius) implements Shape { }
    record Rectangle(double width, double height) implements Shape { }
    record Triangle(double base, double height) implements Shape { }

    static double area(Shape shape) {
        return switch (shape) {                     // exhaustive over the sealed interface
            case Circle c    -> Math.PI * c.radius() * c.radius();
            case Rectangle r -> r.width() * r.height();
            case Triangle t  -> 0.5 * t.base() * t.height();
        };
    }

    // Guards, null handling, constants and dominance in one switch
    static String classify(Object o) {
        return switch (o) {
            case null                       -> "null value";
            case String s when s.isBlank()  -> "blank string";
            case String s                   -> "string of length " + s.length();
            case Integer i when i < 0       -> "negative int";
            case Integer i                  -> "int " + i;
            case Circle c when c.radius() > 100 -> "huge circle";
            case Shape s                    -> "shape with area " + String.format("%.1f", area(s));
            default                         -> "something else: " + o.getClass().getSimpleName();
        };
    }

    public static void main(String[] args) {
        System.out.println(area(new Rectangle(4, 2.5)));       // 10.0
        System.out.println(classify(null));                      // null value
        System.out.println(classify("   "));                     // blank string
        System.out.println(classify(-7));                        // negative int
        System.out.println(classify(new Circle(1)));             // shape with area 3.1
        System.out.println(classify(new Circle(500)));           // huge circle
        System.out.println(classify(java.time.LocalDate.now())); // something else: LocalDate
        // Compile error if uncommented: 'case Shape s' already dominates Circle
        // switch (o) { case Shape s -> ...; case Circle c -> ...; }
    }
}`
    },
    {
      heading: "8. Record Patterns and Unnamed Variables and Patterns (Java 21 and 22)",
      content: `**Record patterns** (previewed in Java 19 and 20, **final in Java 21, JEP 440**) let you **deconstruct** a record into its components inside \`instanceof\` or \`switch\`. Instead of \`case Point p -> use(p.x(), p.y())\` you write \`case Point(int x, int y) -> use(x, y)\`. The pattern \`Point(int x, int y)\` matches a non-null \`Point\` and binds \`x\` and \`y\` from its accessors. Component patterns can be type patterns, \`var\` patterns (\`Point(var x, var y)\`, type inferred) or **nested record patterns**: \`case Line(Point(var x1, var y1), Point(var x2, var y2))\` extracts four values from a two-level structure in one line. Generic records are inferred too: \`case Box(String s)\` works for \`Box<String>\`.
Two details matter. First, a record pattern is **never total**: \`case Box(var content)\` does not match \`null\`, so a null \`Box\` still needs \`case null\`. Second, a nested pattern must be exhaustive in each position; with sealed component types the compiler checks all combinations, which is extremely powerful for interpreters and rule engines (\`case Add(Num(var a), Num(var b)) -> a + b\`).
**Unnamed variables and patterns** (preview in Java 21 as JEP 443, **final in Java 22, JEP 456**) add the underscore \`_\` for things you must declare but never read. \`_\` was reserved as a keyword back in Java 9 precisely for this use. You can use it for: unused lambda parameters (\`(k, _) -> k\`), unused catch parameters (\`catch (NumberFormatException _)\`), enhanced for-loop variables, try-with-resources variables, and local variables (\`var _ = queue.poll();\`). The same name may appear several times in one scope because \`_\` creates no binding.
Inside patterns, \`_\` is an **unnamed pattern** that matches anything in that position: \`case Card(var last4, _, _)\` ignores the network and the international flag; \`case Circle _\` matches a Circle without binding it. Unnamed patterns also unlock **multiple patterns in one case label**: \`case Circle _, Rectangle _ -> "simple shape"\` is legal because neither branch declares a variable (bindings are not allowed in a multi-pattern case). This removes a lot of noise from switches over sealed hierarchies and keeps your IDE free of "unused variable" warnings. Because this feature is final only from Java 22, projects pinned to Java 21 must write a throwaway name instead (\`case Circle ignored\`).`,
      codeSnippet: `// File: RecordPatternDemo.java  (Java 22+ because of the unnamed patterns; remove '_' for Java 21)
import java.util.List;
import java.util.Map;

public class RecordPatternDemo {

    sealed interface Expr permits Num, Add, Mul, Neg { }
    record Num(double value) implements Expr { }
    record Add(Expr left, Expr right) implements Expr { }
    record Mul(Expr left, Expr right) implements Expr { }
    record Neg(Expr inner) implements Expr { }

    // Nested record patterns make a tiny interpreter trivial
    static double eval(Expr e) {
        return switch (e) {
            case Num(var v)                       -> v;
            case Add(Num(var a), Num(var b))      -> a + b;          // fast path, no recursion
            case Add(var l, var r)                -> eval(l) + eval(r);
            case Mul(var l, var r)                -> eval(l) * eval(r);
            case Neg(Neg(var inner))              -> eval(inner);    // double negation cancels
            case Neg(var inner)                   -> -eval(inner);
        };
    }

    record Point(int x, int y) { }
    record Line(Point from, Point to) { }

    static String describe(Object o) {
        return switch (o) {
            case Point(var x, var y) when x == 0 && y == 0 -> "origin";
            case Point(var x, _)                           -> "point at x=" + x;      // y ignored
            case Line(Point(var x1, var y1), Point(var x2, var y2)) ->
                "line length " + Math.hypot(x2 - x1, y2 - y1);
            case Num _, Neg _                              -> "unary-ish expression"; // multi-pattern case
            case null, default                             -> "unknown";
        };
    }

    public static void main(String[] args) {
        Expr e = new Add(new Mul(new Num(2), new Num(3)), new Neg(new Neg(new Num(4)))); // 2*3 + 4
        System.out.println(eval(e));                                            // 10.0
        System.out.println(describe(new Point(0, 0)));                          // origin
        System.out.println(describe(new Point(7, 99)));                         // point at x=7
        System.out.println(describe(new Line(new Point(0, 0), new Point(3, 4)))); // line length 5.0
        System.out.println(describe(new Neg(new Num(1))));                      // unary-ish expression

        // Unnamed variables outside patterns
        Map<String, Integer> stock = Map.of("pen", 10, "book", 0);
        stock.forEach((name, _) -> System.out.println("item: " + name));     // value unused
        int parsed;
        try { parsed = Integer.parseInt("12x"); }
        catch (NumberFormatException _) { parsed = -1; }                       // exception unused
        System.out.println(parsed);                                             // -1
        for (var _ : List.of(1, 2, 3)) System.out.print("tick ");             // tick tick tick
    }
}`
    },
    {
      heading: "9. Sequenced Collections: First, Last and Reversed Views (Java 21)",
      content: `Before Java 21, "give me the last element" depended on the collection type: \`list.get(list.size() - 1)\`, \`deque.getLast()\`, \`sortedSet.last()\`, and for a \`LinkedHashSet\` there was no direct way at all; people iterated to the end or used streams. **Sequenced collections (JEP 431, final in Java 21)** fix this by adding three interfaces to the collections framework that describe collections with a **defined encounter order**:
• **\`SequencedCollection<E>\`** adds \`addFirst\`, \`addLast\`, \`getFirst\`, \`getLast\`, \`removeFirst\`, \`removeLast\` and \`reversed()\`. \`List\`, \`Deque\` and \`LinkedHashSet\` (via \`SequencedSet\`) implement it.
• **\`SequencedSet<E>\`** extends \`SequencedCollection\` and \`Set\`; \`reversed()\` returns a \`SequencedSet\`. \`LinkedHashSet\` and \`SortedSet\`/\`TreeSet\` implement it.
• **\`SequencedMap<K, V>\`** adds \`firstEntry\`, \`lastEntry\`, \`pollFirstEntry\`, \`pollLastEntry\`, \`putFirst\`, \`putLast\`, \`sequencedKeySet\`, \`sequencedValues\`, \`sequencedEntrySet\` and \`reversed()\`. \`LinkedHashMap\` and \`SortedMap\`/\`TreeMap\` implement it.
Key behaviours: \`getFirst()\` and \`getLast()\` throw \`NoSuchElementException\` on an empty collection (no \`Optional\`). \`reversed()\` returns a **live view**, not a copy: changes to the view write through to the original, and iterating the view is the cheapest way to walk a list backwards or stream it in reverse (\`list.reversed().stream()\`). For \`LinkedHashSet\` and \`LinkedHashMap\`, \`addFirst\`/\`putFirst\` on an existing element **moves** it to the front instead of duplicating it, which is exactly what an LRU-style structure needs. For \`SortedSet\` and \`SortedMap\`, the \`addFirst\`/\`addLast\`/\`putFirst\`/\`putLast\` methods throw \`UnsupportedOperationException\` because the order is defined by the comparator, not by insertion.
\`Collections\` gained \`unmodifiableSequencedCollection\`, \`unmodifiableSequencedSet\` and \`unmodifiableSequencedMap\`. Immutable lists from \`List.of\` are sequenced too, so \`List.of(1, 2, 3).reversed()\` works, while \`List.of(1, 2, 3).addFirst(0)\` throws \`UnsupportedOperationException\`.
In production this feature mostly shows up in method signatures: accept a \`SequencedCollection<Order>\` when your method needs "the most recent order" but does not care whether the caller passes a list or a linked set. It also removes a whole class of off-by-one bugs from \`size() - 1\` indexing.`,
      codeSnippet: `// File: SequencedDemo.java  (Java 21+)
import java.util.*;

public class SequencedDemo {

    // Accept any ordered collection; no need to force callers into List
    static <T> T latest(SequencedCollection<T> history) {
        return history.getLast();
    }

    public static void main(String[] args) {
        List<String> stations = new ArrayList<>(List.of("Dadar", "Thane", "Kalyan"));
        stations.addFirst("CSMT");
        stations.addLast("Kasara");
        System.out.println(stations);                  // [CSMT, Dadar, Thane, Kalyan, Kasara]
        System.out.println(stations.getFirst() + " -> " + stations.getLast()); // CSMT -> Kasara
        System.out.println(stations.reversed());       // [Kasara, Kalyan, Thane, Dadar, CSMT]
        stations.reversed().removeFirst();             // live view: removes "Kasara" from the ORIGINAL
        System.out.println(stations);                  // [CSMT, Dadar, Thane, Kalyan]

        // LinkedHashSet: addFirst moves an existing element to the front (LRU-friendly)
        SequencedSet<String> recent = new LinkedHashSet<>(List.of("pen", "book", "bag"));
        recent.addFirst("bag");
        System.out.println(recent);                    // [bag, pen, book]

        // SequencedMap on LinkedHashMap
        SequencedMap<String, Integer> scores = new LinkedHashMap<>();
        scores.put("Asha", 88);
        scores.put("Vikram", 92);
        scores.putFirst("Meera", 95);
        System.out.println(scores.firstEntry());       // Meera=95
        System.out.println(scores.lastEntry());        // Vikram=92
        System.out.println(scores.reversed());         // {Vikram=92, Asha=88, Meera=95}
        System.out.println(latest(stations));          // Kalyan

        // TreeSet is sequenced but insertion-position methods are not allowed
        SequencedSet<Integer> sorted = new TreeSet<>(List.of(5, 1, 9));
        System.out.println(sorted.getFirst() + ".." + sorted.getLast()); // 1..9
        try { sorted.addFirst(42); } catch (UnsupportedOperationException ex) {
            System.out.println("addFirst not supported on a sorted set");
        }
        try { new ArrayList<Integer>().getFirst(); } catch (NoSuchElementException ex) {
            System.out.println("getFirst on empty list throws NoSuchElementException");
        }
    }
}`
    },
    {
      heading: "10. Virtual Threads: An Introduction (Java 21, Improved in Java 24)",
      content: `A classic Java thread (**platform thread**) is a thin wrapper over an operating-system thread: it costs around 1 MB of stack reservation and is expensive to create, so servers keep a **pool** of a few hundred and queue requests behind them. The problem is that a typical web request spends most of its life **waiting** (for a database, an HTTP call to a payment gateway, a Kafka broker), and a waiting platform thread still occupies its OS thread. This is why Java backends traditionally hit a wall at a few hundred concurrent requests per instance and why reactive programming (WebFlux, RxJava) became popular despite its difficult debugging story.
**Virtual threads (JEP 444, final in Java 21)** are lightweight threads managed by the JVM rather than the OS. They are cheap: a few hundred bytes of stack on the heap that grows as needed, so a single JVM can run **millions** of them. When a virtual thread blocks on I/O, a lock or \`sleep\`, the JVM **unmounts** it from its **carrier thread** (a platform thread in a \`ForkJoinPool\` sized to the CPU count) and mounts another virtual thread. Your code stays plain, blocking, sequential Java with normal stack traces and debugger support; the scheduler does the switching. This is the "thread-per-request, but cheap" model.
How to create one: \`Thread.ofVirtual().start(runnable)\`, \`Thread.startVirtualThread(runnable)\`, or, most commonly, \`Executors.newVirtualThreadPerTaskExecutor()\`, which creates a fresh virtual thread for every submitted task. **Do not pool virtual threads**; they are meant to be created per task and thrown away. Virtual threads are always daemon threads, have a fixed priority and are not returned by \`Thread.currentThread().isVirtual() == false\` checks you might find in old monitoring code.
Limitations to know: in Java 21 a virtual thread that blocked **inside a \`synchronized\` block** or method got **pinned** to its carrier (the carrier could not be reused), which reduced throughput in code with heavy \`synchronized\` usage; **Java 24 (JEP 491) fixed this**, so on Java 25 \`synchronized\` no longer pins. \`ReentrantLock\` never pinned. Native calls and some file-system operations can still pin briefly. Heavy use of \`ThreadLocal\` is discouraged because millions of threads mean millions of copies; the replacement is **scoped values**, final in Java 25 (next section). Virtual threads do **not** speed up CPU-bound work; they increase the number of concurrent I/O-bound tasks.
In Spring Boot 3.2 and later (including 4.x), setting \`spring.threads.virtual.enabled=true\` makes the embedded Tomcat and the default task executor use virtual threads; Spring Boot 4 also configures the JDK \`HttpClient\` for them. A full treatment of thread safety, executors, locks and structured concurrency comes in the next lecture.`,
      codeSnippet: `// File: VirtualThreadDemo.java  (Java 21+)
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.*;

public class VirtualThreadDemo {

    // Simulates calling a slow external service (e.g. a payment gateway, ~200 ms)
    static String fetchStatus(int orderId) throws InterruptedException {
        Thread.sleep(Duration.ofMillis(200));
        return "ORD-" + orderId + ":PAID";
    }

    static void runWith(ExecutorService executor, String label, int tasks) throws Exception {
        Instant start = Instant.now();
        List<Future<String>> futures = new ArrayList<>();
        try (executor) {                              // ExecutorService is AutoCloseable since Java 19
            for (int i = 1; i <= tasks; i++) {
                int id = i;
                futures.add(executor.submit(() -> fetchStatus(id)));
            }
            for (Future<String> f : futures) f.get(); // wait for all
        }
        System.out.printf("%-18s %5d tasks in %4d ms%n", label,
                tasks, Duration.between(start, Instant.now()).toMillis());
    }

    public static void main(String[] args) throws Exception {
        System.out.println("virtual? " + Thread.currentThread().isVirtual()); // false (main is a platform thread)

        Thread vt = Thread.ofVirtual().name("greeter").start(() ->
                System.out.println("hello from " + Thread.currentThread()));
        vt.join();  // hello from VirtualThread[#29,greeter]/runnable@ForkJoinPool-1-worker-1

        runWith(Executors.newFixedThreadPool(50),            "platform pool(50)", 2_000);
        runWith(Executors.newVirtualThreadPerTaskExecutor(), "virtual per task",  2_000);
    }
}
// Typical output on a laptop (numbers vary by machine):
// platform pool(50)  2000 tasks in 8120 ms   (2000 / 50 = 40 rounds x 200 ms)
// virtual per task   2000 tasks in  230 ms   (all 2000 waits overlap)`
    },
    {
      heading: "11. What Is New in Java 25: Final Features and Previews You Should Know",
      content: `Java 25 (released September 2025) is the current LTS and the version new projects should target. It contains no single headline language change like records or virtual threads; instead it **finalises several features that were previewed during the 21 to 24 cycle**. Verified status for each:
**Final in Java 25:**
• **Compact source files and instance main methods (JEP 512).** A beginner program no longer needs \`public class\`, \`public static void main(String[] args)\` or \`System.out\`. A file containing just \`void main() { IO.println("Hello"); }\` compiles and runs with \`java Hello.java\`. The new \`java.lang.IO\` class provides \`println\`, \`print\` and \`readln\`, and compact source files implicitly import the whole \`java.base\` module. This went through four previews (JEPs 445, 463, 477, 495) and is now standard.
• **Flexible constructor bodies (JEP 513).** Statements may appear **before** \`super(...)\` or \`this(...)\` as long as they do not use \`this\` (except to assign fields). You can validate arguments before calling the superclass constructor and initialise fields before a superclass constructor calls an overridable method. Previewed as JEPs 447, 482 and 492.
• **Module import declarations (JEP 511).** \`import module java.base;\` imports every package the module exports, which makes scripts and small programs much shorter. Ambiguities are resolved by a single-type import.
• **Scoped values (JEP 506).** An immutable, inheritable alternative to \`ThreadLocal\` designed for virtual threads: \`ScopedValue.where(USER, user).run(() -> ...)\` binds \`USER\` for the duration of the lambda, including child threads created with structured concurrency.
• JVM and library: compact object headers (JEP 519, reduces per-object memory by up to 8 bytes), generational Shenandoah (JEP 521), key derivation function API (JEP 510), AOT command-line ergonomics and method profiling (JEPs 514, 515), JFR CPU-time profiling (experimental, JEP 509), removal of the 32-bit x86 port (JEP 503).
**Preview in Java 25 (needs \`--enable-preview\`; syntax may change; not for production):**
• **Primitive types in patterns, \`instanceof\` and \`switch\` (JEP 507, third preview):** \`if (value instanceof int i)\` and \`case int i when i > 0\` will eventually remove the gap between primitives and patterns.
• **Structured concurrency (JEP 505, fifth preview):** \`StructuredTaskScope\` treats a group of subtasks as one unit with a common lifetime, cancellation and error handling. The API was reworked again in 25 (\`StructuredTaskScope.open()\`), which is exactly why you should wait for the final version.
• **Stable values (JEP 502, first preview):** lazily initialised, JIT-constant-folded holders (\`StableValue<T>\`) for expensive singletons.
• **PEM encodings of cryptographic objects (JEP 470, preview)** and the **Vector API (JEP 508, tenth incubator)**.
Practical advice: write production code against the **final** features of 21 and 25, try previews in a scratch project, and keep an eye on primitive patterns and structured concurrency because they are the two most likely to be finalised in the next LTS.`,
      codeSnippet: `// File: Hello.java  -- compact source file + instance main (FINAL in Java 25)
// Run directly: java Hello.java
import module java.base;      // module import declaration (FINAL in Java 25)

void main() {
    var name = IO.readln("Your name: ");     // java.lang.IO, final in 25
    IO.println("Namaste, " + name + "! Today is " + LocalDate.now());
    IO.println(List.of("Java 21", "Java 25").reversed());
}

// File: Account.java -- flexible constructor bodies (FINAL in Java 25)
class Account {
    final long balancePaise;
    Account(long balancePaise) { this.balancePaise = balancePaise; }
}
class SavingsAccount extends Account {
    final double ratePercent;
    SavingsAccount(long balancePaise, double ratePercent) {
        if (ratePercent < 0 || ratePercent > 15)            // statement BEFORE super(...)
            throw new IllegalArgumentException("Invalid rate: " + ratePercent);
        this.ratePercent = ratePercent;                       // early field assignment is allowed
        super(balancePaise);
    }
}

// File: Audit.java -- scoped values (FINAL in Java 25)
import java.util.concurrent.Executors;

public class Audit {
    static final ScopedValue<String> REQUEST_ID = ScopedValue.newInstance();

    static void handle(String requestId) {
        ScopedValue.where(REQUEST_ID, requestId).run(() -> {
            log("received order");                  // readable anywhere in this call tree
            try (var ex = Executors.newVirtualThreadPerTaskExecutor()) {
                ex.submit(() -> log("child task")); // NOTE: plain executors do NOT inherit the binding
            }
        });
        System.out.println(REQUEST_ID.isBound());   // false: binding ended with run()
    }
    static void log(String msg) {
        System.out.println("[" + REQUEST_ID.orElse("no-request") + "] " + msg);
    }
    public static void main(String[] args) { handle("REQ-7781"); }
}
// [REQ-7781] received order
// [no-request] child task      <- inheritance into subtasks needs StructuredTaskScope (preview in 25)
// false

// PREVIEW ONLY in Java 25 (compile with --enable-preview) -- primitive patterns, JEP 507:
// Object o = 42;
// if (o instanceof int i && i > 0) System.out.println("positive int " + i);`
    },
    {
      heading: "12. How to Adopt Modern Java Features in Real Code and Spring Boot Projects",
      content: `Knowing a feature and introducing it into a ten-year-old codebase with forty developers are different skills. Here is a migration path that works in Indian product and services companies alike.
**Step 1: Pick the runtime.** Upgrade the JDK before changing the code. Go to **Java 21 at minimum** and **Java 25 if your frameworks support it** (Spring Boot 3.x and 4.x require Java 17 and are tested on 21 and 25; Spring Boot 4.0 shipped in November 2025 with a Java 17 baseline and first-class Java 25 support). Set \`<maven.compiler.release>\` (Maven) or a Gradle toolchain so that the compiler **and** the runtime agree; \`--release\` also stops you from accidentally calling APIs that do not exist in your target. Run the full test suite and the application on the new JDK with **zero code changes** first; most problems at this stage come from old libraries (Lombok, Mockito, ByteBuddy, Hibernate) that need a bump.
**Step 2: Low-risk syntax first.** Use your IDE's inspections ("Convert to switch expression", "Replace with pattern variable", "Convert to text block", "Convert to record") in small, reviewed commits. These are pure refactorings with no semantic change.
**Step 3: Records for DTOs and value objects.** Start with request/response bodies in your REST layer and with immutable config objects. Keep JPA entities as classes (records cannot have a no-arg constructor or mutable id). Spring Data JPA **projections** and \`@ConfigurationProperties\` classes work beautifully as records; Jackson handles them without annotations.
**Step 4: Sealed types plus pattern switch for business rules.** Find the \`instanceof\` chains and the Visitor implementations in the domain layer, model the alternatives as a sealed interface with records, and replace each visitor with one exhaustive switch. Remove \`default\` branches so that the compiler helps you when the domain grows.
**Step 5: Virtual threads where the service is I/O-bound.** For a Spring MVC service, set \`spring.threads.virtual.enabled=true\`, remove any \`synchronized\`-heavy hot paths (or upgrade to Java 24+ where pinning is fixed), check connection-pool sizes (HikariCP still limits database concurrency to \`maximumPoolSize\`), and load test. Replace \`ThreadLocal\` request context with scoped values on Java 25.
**Rules of thumb:** never enable preview features in \`pom.xml\` for a product build; agree on a team style for \`var\`; add a CI check that the build runs on the LTS you target. Modern Java adoption is incremental, and each step pays for itself with less code to review.`,
      codeSnippet: `<!-- pom.xml: Maven setup for a Spring Boot 4 service on Java 25 -->
<project>
  <parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>4.0.7</version>   <!-- use the latest 4.0.x patch available -->
  </parent>
  <properties>
    <java.version>25</java.version>   <!-- parent maps this to maven.compiler.release -->
  </properties>
  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-test</artifactId>  <!-- JUnit 5 + Mockito -->
      <scope>test</scope>
    </dependency>
  </dependencies>
</project>

# src/main/resources/application.properties
spring.threads.virtual.enabled=true

// src/main/java/com/example/orders/api/CreateOrderRequest.java -- record as a request DTO
package com.example.orders.api;

import jakarta.validation.constraints.*;
import java.util.List;

public record CreateOrderRequest(
        @NotBlank String customerId,
        @NotEmpty List<@NotBlank String> skus,
        @Min(1) int quantity) { }

// src/main/java/com/example/orders/api/OrderController.java
package com.example.orders.api;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    public record OrderResponse(String orderId, String status, long totalPaise) { }

    @PostMapping
    public OrderResponse create(@Valid @RequestBody CreateOrderRequest req) {
        // ... call the service; records serialise to JSON automatically
        return new OrderResponse("ORD-1001", "CREATED", 49_900L * req.quantity());
    }
}

// Spring Data JPA interface projection as a record (no entity exposure)
// public record CustomerSummary(String id, String name) { }
// interface CustomerRepository extends JpaRepository<Customer, String> {
//     List<CustomerSummary> findByCityOrderByName(String city);
// }`
    },
    {
      heading: "13. Real-World Use Cases: How Modern Java Is Used in Production",
      content: `Here is how the features in this lecture show up in real systems, so you can recognise the patterns in code reviews and describe them in interviews.
**1. API layer DTOs (records).** Every request and response body in a Spring Boot service becomes a record. Validation annotations sit on the components, Jackson maps JSON automatically, and the compact constructor normalises input (trim, lower-case e-mail). A fintech team migrating a UPI collection service reported removing roughly 40 percent of the lines in its \`api\` package simply by converting DTOs to records.
**2. Domain events and messaging (sealed interface + records + switch).** A Kafka consumer receives \`OrderEvent\` messages that may be \`OrderPlaced\`, \`OrderPaid\`, \`OrderShipped\` or \`OrderCancelled\`. Modelling them as a sealed interface means the consumer's \`switch\` is exhaustive, and when \`OrderReturned\` is added, every consumer that forgot about it fails the build instead of silently dropping messages.
**3. Result and error types without exceptions.** A sealed \`Result<T>\` with \`Success(T value)\` and \`Failure(ErrorCode code, String message)\` replaces checked exceptions in service layers, and callers deconstruct it with record patterns. This is common in payment and KYC flows where failures are expected business outcomes, not bugs.
**4. Parsers, rule engines and interpreters (nested record patterns).** Pricing rules, feature flags and search filters are naturally trees. With sealed expression types and nested patterns, the evaluator is a single readable method instead of a Visitor hierarchy. Build tools and static analysers use the same approach for ASTs.
**5. High-concurrency I/O services (virtual threads).** Gateways that fan out to many downstream services per request, notification senders, web scrapers and chat backends move from thread pools of 200 to virtual threads, keeping synchronous code while handling tens of thousands of in-flight requests. Scoped values carry request ids and tenant ids through the call tree for logging.
**6. SQL, JSON and templates (text blocks).** Repository classes with native queries, test fixtures with JSON payloads and e-mail templates all read better as text blocks; \`formatted()\` injects values in tests (never in production SQL, where you use parameters).
**7. Ordered caches and histories (sequenced collections).** Recently-viewed products, undo stacks and audit trails use \`LinkedHashMap\` and \`LinkedHashSet\` with \`putFirst\`/\`getLast\`/\`reversed()\` and no manual index arithmetic.
**8. Scripts and learning (compact source files).** Operations teams write one-file Java utilities (\`java Cleanup.java\`) with \`void main()\` and \`import module java.base;\` on Java 25 instead of reaching for Python or shell when they need the JDK's libraries.`,
      codeSnippet: `// File: OrderEventConsumer.java  (Java 21+) -- a typical event-handling pattern in production
import java.time.Instant;

public class OrderEventConsumer {

    sealed interface OrderEvent permits OrderPlaced, OrderPaid, OrderShipped, OrderCancelled { }
    record OrderPlaced(String orderId, long amountPaise, Instant at) implements OrderEvent { }
    record OrderPaid(String orderId, String paymentRef, Instant at) implements OrderEvent { }
    record OrderShipped(String orderId, String awb, String courier, Instant at) implements OrderEvent { }
    record OrderCancelled(String orderId, String reason, Instant at) implements OrderEvent { }

    sealed interface Result<T> permits Ok, Err { }
    record Ok<T>(T value) implements Result<T> { }
    record Err<T>(String code, String message) implements Result<T> { }

    // Exhaustive handling: adding OrderReturned to the sealed interface breaks this compile
    Result<String> handle(OrderEvent event) {
        return switch (event) {
            case OrderPlaced(var id, var amount, _) when amount <= 0 ->
                new Err<>("INVALID_AMOUNT", "Order " + id + " has non-positive amount");
            case OrderPlaced(var id, var amount, _)       -> new Ok<>("reserved stock for " + id + " (₹" + amount / 100 + ")");
            case OrderPaid(var id, var ref, _)            -> new Ok<>("payment " + ref + " recorded for " + id);
            case OrderShipped(var id, var awb, var courier, _) -> new Ok<>(id + " shipped via " + courier + " AWB " + awb);
            case OrderCancelled(var id, var reason, _)    -> new Ok<>(id + " cancelled: " + reason);
        };
    }

    public static void main(String[] args) {
        var consumer = new OrderEventConsumer();
        OrderEvent[] events = {
            new OrderPlaced("ORD-9", 1_29_900, Instant.now()),
            new OrderShipped("ORD-9", "DL123456789IN", "Delhivery", Instant.now()),
            new OrderPlaced("ORD-10", 0, Instant.now())
        };
        for (OrderEvent e : events) {
            String line = switch (consumer.handle(e)) {
                case Ok<String>(var v)        -> "OK   " + v;
                case Err<String>(var c, var m) -> "FAIL " + c + " - " + m;
            };
            System.out.println(line);
        }
    }
}
// OK   reserved stock for ORD-9 (₹1299)
// OK   ORD-9 shipped via Delhivery AWB DL123456789IN
// FAIL INVALID_AMOUNT - Order ORD-10 has non-positive amount`
    },
    {
      heading: "14. Common Mistakes with Modern Java Features and How to Fix Them",
      content: `**1. Assigning fields inside a compact constructor.** \`record Money(long paise) { Money { this.paise = Math.abs(paise); } }\` does not compile. In a compact constructor you reassign the **parameter** (\`paise = Math.abs(paise);\`); the field assignment happens automatically afterwards.
**2. Treating records as deeply immutable.** A record holding an \`ArrayList\` can still be mutated through the list. Copy in the compact constructor with \`List.copyOf(...)\` or \`Map.copyOf(...)\` and return copies from custom accessors if needed.
**3. Using records as JPA entities.** Hibernate needs a no-arg constructor, mutable state and proxies; records provide none of these. Use records for DTOs and projections and keep entities as classes.
**4. Putting a supertype pattern before a subtype pattern.** \`case Shape s -> ...; case Circle c -> ...\` fails with "this case label is dominated by a preceding case label". Order cases from most specific to least specific, and put guarded cases before unguarded ones of the same type.
**5. Adding \`default\` to a switch over a sealed type.** It compiles, but you lose the exhaustiveness check: when a new permitted subtype is added, the \`default\` branch swallows it at runtime. Omit \`default\` and let the compiler point you to every switch that needs a new case.
**6. Forgetting that a pattern switch throws on \`null\`.** \`switch (obj) { case String s -> ...; default -> ... }\` throws \`NullPointerException\` when \`obj\` is null. Add \`case null ->\` or \`case null, default ->\` when null is a legal input.
**7. Using \`_\` (unnamed variables) on Java 21.** Unnamed variables and patterns are final only from Java 22. On 21 they are a preview feature; without \`--enable-preview\` you get a compile error. Use a throwaway name like \`ignored\` if you must stay on 21.
**8. Shipping preview features.** Code compiled with \`--enable-preview\` is tied to that exact JDK feature version; a class file built with preview on Java 25 will refuse to load on Java 26. Keep previews out of production builds and CI pipelines.
**9. Pooling virtual threads or using them for CPU-bound work.** \`Executors.newFixedThreadPool(200, Thread.ofVirtual().factory())\` defeats the purpose. Use \`newVirtualThreadPerTaskExecutor()\` and keep CPU-heavy tasks on a bounded platform pool.
**10. Blocking inside \`synchronized\` on Java 21 with virtual threads.** This pins the carrier thread and can collapse throughput under load. Replace with \`ReentrantLock\` or upgrade to Java 24+ where JEP 491 removed the pinning.
**11. Misreading text block indentation.** The closing \`"""\` position determines the stripped indentation. If you place it at column 0 you keep all leading spaces; if the content is less indented than the closing delimiter, nothing is stripped. Trailing spaces on each line are removed, which breaks tests that expect them; use \`\\s\` to keep a space.
**12. Overusing \`var\`.** \`var data = repo.load();\` hides the type from readers and reviewers. Use \`var\` when the type is visible on the same line (\`new\`, a literal, a cast, a factory with an obvious name) and spell the type out otherwise.`,
      codeSnippet: `// File: MistakesFixed.java  (Java 22+)
import java.util.List;

public class MistakesFixed {

    // Mistake 1 & 2 fixed: reassign the parameter, copy the list
    record Invoice(String number, List<Long> linesPaise) {
        Invoice {
            number = number.trim().toUpperCase();     // not this.number = ...
            linesPaise = List.copyOf(linesPaise);     // defensive copy; rejects null
        }
        long totalPaise() { return linesPaise.stream().mapToLong(Long::longValue).sum(); }
    }

    sealed interface Notification permits Sms, Email, Push { }
    record Sms(String mobile) implements Notification { }
    record Email(String address) implements Notification { }
    record Push(String deviceToken) implements Notification { }

    // Mistake 4, 5, 6 fixed: specific-before-general, no default, explicit null case
    static String route(Notification n) {
        return switch (n) {
            case null                                   -> "nothing to send";
            case Sms(var mobile) when mobile.startsWith("+91") -> "send via Indian SMS gateway";
            case Sms _                                  -> "send via international SMS gateway";
            case Email(var address)                     -> "send via SES to " + address;
            case Push(var token)                        -> "send via FCM to " + token;
        };
    }

    public static void main(String[] args) {
        var inv = new Invoice("  inv-42 ", List.of(10_000L, 2_500L));
        System.out.println(inv.number() + " total ₹" + inv.totalPaise() / 100); // INV-42 total ₹125
        System.out.println(route(new Sms("+919876543210")));   // send via Indian SMS gateway
        System.out.println(route(new Sms("+14155550123")));    // send via international SMS gateway
        System.out.println(route(null));                        // nothing to send
    }
}`
    },
    {
      heading: "15. Frequently Asked Questions about Modern Java (17 to 25)",
      content: `**What is a record in Java and when should I use it?**
A record is a compact class for immutable data. You declare the components, and the compiler generates the constructor, accessors, \`equals\`, \`hashCode\` and \`toString\`. Use records for DTOs, value objects, map keys and multi-value returns; do not use them for JPA entities or any object whose state changes over time.
**What is the difference between a sealed class and an abstract class in Java?**
An abstract class can be extended by any class anywhere, while a sealed class (or interface) names its permitted subclasses, and each of them must be \`final\`, \`sealed\` or \`non-sealed\`. Sealing gives the compiler a closed set of types so that pattern-matching switches can be checked for exhaustiveness. A sealed class can also be abstract.
**Is pattern matching for switch final in Java 21?**
Yes. Pattern matching for \`switch\` (JEP 441) and record patterns (JEP 440) were previewed from Java 17 to 20 and became final in Java 21. Unnamed patterns using \`_\` became final later, in Java 22 (JEP 456).
**Which Java version should I use in 2026: Java 21 or Java 25?**
For new projects, Java 25, the current LTS released in September 2025, with support from all major vendors. Java 21 remains fully supported and is a safe choice if a dependency does not yet certify 25. Spring Boot 3.x and 4.x run on both; the minimum they require is Java 17.
**Are virtual threads faster than platform threads?**
Not for CPU-bound code. Virtual threads make blocking I/O cheap, so a server can keep many more concurrent requests in flight with simple synchronous code. Throughput improves because waiting threads no longer occupy OS threads, not because each task runs faster.
**What is the difference between var and dynamic typing?**
\`var\` only asks the compiler to infer the static type from the initialiser; the variable's type is fixed at compile time and all type checks still apply. It is not like JavaScript's \`var\` or Python variables, which can hold values of different types over time.
**Do records work with Jackson, Spring Boot and JUnit 5?**
Yes. Jackson 2.12+ serialises and deserialises records without annotations, Spring Boot uses them for request bodies, \`@ConfigurationProperties\` and Spring Data projections, and JUnit 5 tests can assert on them directly because \`equals\` is value-based.
**What happened to string templates in Java?**
String templates (\`STR."Hello \\{name}"\`) were previewed in Java 21 and 22 and then withdrawn in Java 23 for redesign. They do not exist in Java 25. Use \`String.formatted\`, \`String.format\`, \`MessageFormat\` or text blocks instead.`
    },
    {
      heading: "16. Interview Questions and Answers on Modern Java Features",
      content: `**Q1. What does the compiler generate for a record, and what can you still customise?**
It generates a private final field per component, a canonical constructor, a public accessor per component (\`x()\`, not \`getX()\`), and \`equals\`, \`hashCode\` and \`toString\` over all components. You can add a compact constructor for validation, extra constructors that delegate with \`this(...)\`, static factory methods, instance methods, static fields, nested types and interface implementations, and you can override accessors and the three \`Object\` methods. You cannot add instance fields, extend a class or make the record non-final.
**Q2. What is a compact constructor and how does it differ from the canonical constructor?**
The canonical constructor has the full parameter list and assigns fields explicitly. A compact constructor has no parameter list, runs before the fields are assigned, may validate and reassign the parameters, and the field assignments are inserted automatically at its end. You cannot assign fields explicitly in it.
**Q3. Explain \`sealed\`, \`non-sealed\` and \`final\` in the context of sealed hierarchies.**
A \`sealed\` type lists its permitted direct subtypes. Each permitted subtype must be \`final\` (ends the hierarchy), \`sealed\` (continues it with its own permits list) or \`non-sealed\` (re-opens it to arbitrary subclassing). Permitted subtypes must live in the same module, or the same package in the unnamed module.
**Q4. What is exhaustiveness in a pattern switch, and what is MatchException?**
A pattern switch must cover every possible value of the selector type, either with a \`default\`, a total pattern or, for sealed types and enums, by listing all cases. If a sealed hierarchy is changed and only some classes are recompiled, a value with no matching case can reach the switch at runtime, and the JVM throws \`MatchException\`.
**Q5. What is dominance in switch patterns?**
A case label is dominated if an earlier label matches everything it could match, for example \`case Shape s\` before \`case Circle c\`, or an unguarded \`case String s\` before \`case String s when s.isEmpty()\`. Dominated labels are a compile-time error, so cases must be ordered from specific to general.
**Q6. How does a pattern switch handle null?**
It throws \`NullPointerException\` unless there is an explicit \`case null\` (or \`case null, default\`). A \`default\` branch alone does not catch null. Record patterns never match null either.
**Q7. What is a record pattern, and can it be nested?**
A record pattern such as \`case Point(int x, int y)\` matches a non-null \`Point\` and binds its components. Components can themselves be record patterns (\`case Line(Point(var x1, var y1), Point(var x2, var y2))\`), \`var\` patterns or, since Java 22, the unnamed pattern \`_\`. Nested patterns are checked for exhaustiveness per position.
**Q8. What is the difference between a virtual thread and a platform thread?**
A platform thread wraps an OS thread and is expensive, so it is pooled. A virtual thread is scheduled by the JVM onto a small pool of carrier threads, has a heap-allocated growable stack, is cheap enough to create per task, and is unmounted from its carrier when it blocks. Both run the same \`Runnable\` code; virtual threads are final since Java 21, and Java 24 removed the pinning caused by \`synchronized\`.
**Q9. What are sequenced collections and why were they added?**
Java 21 added \`SequencedCollection\`, \`SequencedSet\` and \`SequencedMap\` to give every ordered collection uniform \`getFirst\`, \`getLast\`, \`addFirst\`, \`addLast\`, \`removeFirst\`, \`removeLast\` and \`reversed()\` methods. Previously each type had different or missing methods (for example \`LinkedHashSet\` had no way to get its last element).
**Q10. Name features that are final in Java 25 and features that are still preview.**
Final in 25: compact source files and instance main (JEP 512), flexible constructor bodies (JEP 513), module import declarations (JEP 511), scoped values (JEP 506), compact object headers (JEP 519). Still preview in 25: primitive types in patterns (JEP 507), structured concurrency (JEP 505), stable values (JEP 502), PEM encodings (JEP 470). The Vector API is still incubating.`
    },
    {
      heading: "17. Hands-On Exercise: An Order Processing Engine with Records, Sealed Types and Pattern Matching",
      content: `Build a small but complete order-pricing engine for an Indian e-commerce checkout that uses every feature from this lecture. Requirements:
1. Model \`Item\` as a record (\`sku\`, \`name\`, \`unitPaise\`, \`quantity\`) with a compact constructor that validates positive values and trims the SKU.
2. Model \`Discount\` as a sealed interface with records \`Percent(double percent)\`, \`Flat(long paise)\`, \`BuyXGetY(int buy, int free)\` and \`None()\`.
3. Model \`Shipping\` as a sealed interface with records \`Standard(String pincode)\` and \`Express(String pincode, boolean cod)\`.
4. Write a \`price(Order)\` method that computes the subtotal with a stream, applies the discount with an exhaustive pattern switch (use a guard so a \`Percent\` above 100 is rejected), computes GST at 18 percent, and picks a shipping charge with record patterns: free standard shipping above ₹999, ₹99 for standard otherwise, ₹199 for express plus ₹49 for cash-on-delivery, and 0 charge for pincodes starting with "11" (Delhi) on standard.
5. Keep an audit trail in a \`LinkedHashMap<String, Long>\` of each pricing step and print it, then print it reversed using the sequenced-collection API.
6. Price three orders concurrently with a virtual-thread-per-task executor and print each result as a text block.
Compile and run with Java 21 or newer (\`javac OrderPricing.java && java OrderPricing\`). The reference solution below uses no preview features and no third-party libraries. Extend it: add a \`Coupon(String code, long paise, LocalDate expiry)\` discount and watch the compiler show you the exact switch that must handle it.`,
      codeSnippet: `// File: OrderPricing.java   (Java 21+; no preview features, no libraries)
import java.util.*;
import java.util.concurrent.*;

public class OrderPricing {

    // ---- Domain model: records with validation ----
    record Item(String sku, String name, long unitPaise, int quantity) {
        Item {
            if (sku == null || sku.isBlank()) throw new IllegalArgumentException("sku required");
            if (unitPaise <= 0) throw new IllegalArgumentException("unitPaise must be positive");
            if (quantity <= 0) throw new IllegalArgumentException("quantity must be positive");
            sku = sku.trim().toUpperCase();
        }
        long linePaise() { return unitPaise * quantity; }
    }

    sealed interface Discount permits Percent, Flat, BuyXGetY, None { }
    record Percent(double percent) implements Discount { }
    record Flat(long paise) implements Discount { }
    record BuyXGetY(int buy, int free) implements Discount { }
    record None() implements Discount { }

    sealed interface Shipping permits Standard, Express { }
    record Standard(String pincode) implements Shipping { }
    record Express(String pincode, boolean cod) implements Shipping { }

    record Order(String id, List<Item> items, Discount discount, Shipping shipping) {
        Order { items = List.copyOf(items); }
    }

    record Quote(String orderId, long subtotal, long discount, long gst, long shipping,
                 SequencedMap<String, Long> audit) {
        long total() { return subtotal - discount + gst + shipping; }
    }

    // ---- Pricing rules: exhaustive pattern switches, guards, record patterns ----
    static final long FREE_SHIPPING_THRESHOLD = 999_00;

    static long discountFor(Discount d, List<Item> items, long subtotal) {
        return switch (d) {
            case Percent(var p) when p < 0 || p > 100 ->
                throw new IllegalArgumentException("Invalid percent: " + p);
            case Percent(var p)      -> Math.round(subtotal * p / 100.0);
            case Flat(var paise)     -> Math.min(paise, subtotal);
            case BuyXGetY(var buy, var free) -> items.stream()
                    .mapToLong(it -> (it.quantity() / (buy + free)) * free * it.unitPaise())
                    .sum();
            case None()              -> 0L;
        };
    }

    static long shippingFor(Shipping s, long afterDiscount) {
        return switch (s) {
            case Standard(var pin) when pin.startsWith("11")     -> 0L;        // Delhi: free
            case Standard _ when afterDiscount >= FREE_SHIPPING_THRESHOLD -> 0L;
            case Standard _                                       -> 99_00L;
            case Express(_, var cod)                              -> 199_00L + (cod ? 49_00L : 0L);
        };
    }

    static Quote price(Order order) {
        var audit = new LinkedHashMap<String, Long>();
        long subtotal = order.items().stream().mapToLong(Item::linePaise).sum();
        audit.put("subtotal", subtotal);
        long discount = discountFor(order.discount(), order.items(), subtotal);
        audit.put("discount", discount);
        long taxable = subtotal - discount;
        long gst = Math.round(taxable * 0.18);
        audit.put("gst@18%", gst);
        long shipping = shippingFor(order.shipping(), taxable);
        audit.put("shipping", shipping);
        audit.put("total", taxable + gst + shipping);
        return new Quote(order.id(), subtotal, discount, gst, shipping, audit);
    }

    static String rupees(long paise) { return String.format("₹%,.2f", paise / 100.0); }

    static String render(Quote q) {
        return """
            ---- Quote %s ----
            Subtotal : %s
            Discount : -%s
            GST 18%%  : %s
            Shipping : %s
            TOTAL    : %s
            """.formatted(q.orderId(), rupees(q.subtotal()), rupees(q.discount()),
                          rupees(q.gst()), rupees(q.shipping()), rupees(q.total()));
    }

    public static void main(String[] args) throws Exception {
        var orders = List.of(
            new Order("ORD-1",
                List.of(new Item(" sku-101 ", "Wireless Mouse", 799_00, 1),
                        new Item("SKU-202", "USB-C Cable", 299_00, 3)),
                new Percent(10), new Standard("560001")),
            new Order("ORD-2",
                List.of(new Item("SKU-303", "Notebook", 120_00, 6)),
                new BuyXGetY(2, 1), new Express("400001", true)),
            new Order("ORD-3",
                List.of(new Item("SKU-404", "Laptop Stand", 1_499_00, 1)),
                new Flat(200_00), new Standard("110001"))
        );

        // Price concurrently on virtual threads; preserve order of results
        List<Future<Quote>> futures = new ArrayList<>();
        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            for (Order o : orders) futures.add(executor.submit(() -> price(o)));
        }
        for (Future<Quote> f : futures) {
            Quote q = f.get();
            System.out.print(render(q));
            System.out.println("audit          : " + q.audit());
            System.out.println("audit reversed : " + q.audit().reversed());
            System.out.println("first step     : " + q.audit().firstEntry()
                    + ", last step: " + q.audit().lastEntry());
            System.out.println();
        }

        // Validation in action
        try {
            price(new Order("BAD", List.of(new Item("X", "Y", 100, 1)), new Percent(150), new Standard("1")));
        } catch (IllegalArgumentException e) {
            System.out.println("Rejected: " + e.getMessage());   // Rejected: Invalid percent: 150.0
        }
    }
}
/* Expected output (en-IN grouping may differ by locale):
---- Quote ORD-1 ----
Subtotal : ₹1,696.00
Discount : -₹169.60
GST 18%  : ₹274.75
Shipping : ₹0.00
TOTAL    : ₹1,801.15
audit          : {subtotal=169600, discount=16960, gst@18%=27475, shipping=0, total=180115}
audit reversed : {total=180115, shipping=0, gst@18%=27475, discount=16960, subtotal=169600}
first step     : subtotal=169600, last step: total=180115

---- Quote ORD-2 ----
Subtotal : ₹720.00
Discount : -₹240.00
GST 18%  : ₹86.40
Shipping : ₹248.00
TOTAL    : ₹814.40
...
---- Quote ORD-3 ----
Subtotal : ₹1,499.00
Discount : -₹200.00
GST 18%  : ₹233.82
Shipping : ₹0.00
TOTAL    : ₹1,532.82
...
Rejected: Invalid percent: 150.0
*/`
    },
    {
      heading: "18. Summary",
      content: `• **Modern Java** means the language and library features finalised between Java 10 and Java 25; the LTS versions to know are 17, 21 and 25 (current LTS, September 2025).
• **\`var\`** (Java 10), **text blocks** (Java 15) and **switch expressions** (Java 14) are the everyday syntax improvements; use \`var\` only when the type is obvious.
• **Records** (Java 16) generate constructor, accessors, \`equals\`, \`hashCode\` and \`toString\`; use **compact constructors** for validation and normalisation, copy mutable components, and keep JPA entities as classes.
• **Sealed classes and interfaces** (Java 17) restrict subtypes with \`permits\`; subtypes are \`final\`, \`sealed\` or \`non-sealed\`, enabling compile-time exhaustiveness.
• **Pattern matching for \`instanceof\`** (Java 16) merges test, cast and binding with flow scoping.
• **Pattern matching for \`switch\`** (Java 21) supports type patterns, \`when\` guards, \`case null\`, dominance ordering and exhaustiveness; **record patterns** (Java 21) deconstruct records, including nested ones.
• **Unnamed variables and patterns** with \`_\` are final from Java 22; on Java 21 they are preview only.
• **Sequenced collections** (Java 21) add \`getFirst\`, \`getLast\`, \`addFirst\`, \`addLast\` and live \`reversed()\` views to lists, linked sets and linked maps.
• **Virtual threads** (Java 21) make blocking I/O cheap; create one per task, never pool them, and note that Java 24 removed \`synchronized\` pinning. Spring Boot 3.2+ enables them with one property.
• **Java 25 finals:** compact source files with instance \`main\` and \`IO\`, flexible constructor bodies, module import declarations, scoped values, compact object headers. **Java 25 previews:** primitive patterns, structured concurrency, stable values; string templates were removed.
• Adopt incrementally: upgrade the JDK first, then syntax refactorings, then records for DTOs, then sealed types with exhaustive switches, then virtual threads for I/O-bound services; never ship preview features.
**Next lecture:** Concurrency & Multithreading`
    }
  ]
};
