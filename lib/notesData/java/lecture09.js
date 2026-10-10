export const lecture09 = {
  slug: "lecture-9",
  number: 9,
  title: "Complete Java Course — Lecture 9: Lambdas, Functional Interfaces & the Streams API",
  summary: "Master functional programming in Java: lambda expressions, functional interfaces (Predicate, Function, Consumer, Supplier), method references, the Java Streams API with filter, map, flatMap, reduce and Collectors, Optional, parallel stream caveats and Stream Gatherers (final in Java 24, in Java 25 LTS).",
  readTime: "52 min read",
  difficulty: "Intermediate",
  date: "2026-10-09",
  sections: [
    {
      heading: "1. Introduction: What Is Functional Programming in Java and Why It Matters",
      content: `Until Java 7, Java was an almost purely object-oriented language. If you wanted to pass **behaviour** (not data) into a method, for example "sort these cities by name length", you had to write an anonymous inner class: five or six lines of ceremony to express a single comparison. Java 8 (released in 2014) changed that with three features that work together: **lambda expressions**, **functional interfaces** and the **Streams API**. Together they let you write Java in a **declarative** style: you describe *what* result you want ("filter the orders above ₹10,000, take the customer names, remove duplicates") instead of writing loops that spell out *how* to do it step by step.
Functional programming in Java is not about abandoning objects. It is about treating small pieces of behaviour as values you can pass around, combine and reuse. In practice this gives you:
• **Less boilerplate** — a comparator becomes one line instead of six.
• **Readable data pipelines** — \`filter → map → collect\` reads like a sentence, which matters when a colleague reviews your pull request six months later.
• **Safer code** — stream pipelines avoid index errors, off-by-one bugs and accidental mutation of shared lists.
• **Easy parallelism** — the same pipeline can run on multiple cores with one extra call (with caveats we will cover honestly).
• **Fluency with modern libraries** — Spring Data, \`CompletableFuture\`, \`Comparator\`, \`Map.computeIfAbsent\`, JUnit 5 assertions and almost every modern Java API expects you to pass lambdas.
This lecture builds on the Collections Framework from Lecture 8, because streams are the modern way to process collections. Everything here is final, non-preview API: lambdas and streams since **Java 8**, \`Optional\` improvements in **Java 9 to 11**, \`Stream.toList()\` in **Java 16**, and **Stream Gatherers**, which were finalized in **Java 24** (JEP 485) and are therefore part of **Java 25 LTS** but not of Java 21 LTS. We start with the problem lambdas solve.`,
      codeSnippet: `// SortDemo.java — the same task, three ways
import java.util.*;

public class SortDemo {
    public static void main(String[] args) {
        List<String> cities = new ArrayList<>(List.of("Mumbai", "Delhi", "Bengaluru", "Pune"));

        // Before Java 8: anonymous inner class (6 lines to say "compare by length")
        Collections.sort(cities, new Comparator<String>() {
            @Override
            public int compare(String a, String b) {
                return Integer.compare(a.length(), b.length());
            }
        });
        System.out.println(cities); // [Pune, Delhi, Mumbai, Bengaluru]

        // Java 8+: lambda expression
        cities.sort((a, b) -> Integer.compare(a.length(), b.length()));

        // Even shorter: Comparator.comparing + method reference
        cities.sort(Comparator.comparing(String::length));
        System.out.println(cities); // [Pune, Delhi, Mumbai, Bengaluru]
    }
}`
    },
    {
      heading: "2. Lambda Expressions in Java: Syntax, Rules and Variable Capture",
      content: `A **lambda expression** is an anonymous function: parameters, an arrow \`->\`, and a body. The general form is \`(parameters) -> expression\` or \`(parameters) -> { statements; }\`. The compiler infers the parameter types from the **target type**, the functional interface the lambda is assigned to or passed as, so you rarely need to write types at all.
The syntax rules you must know:
• **Zero parameters** need empty parentheses: \`() -> 42\`.
• **One parameter** may drop the parentheses: \`s -> s.length()\`.
• **Two or more parameters** need parentheses: \`(a, b) -> a + b\`.
• An **expression body** returns its value implicitly; a **block body** with braces needs an explicit \`return\` (unless the interface method returns \`void\`).
• You can write explicit types, \`(Integer a, Integer b) -> ...\`, when inference is ambiguous. Since **Java 11** you may also write \`(var a, var b)\`, which is mainly useful when you need to put an annotation such as \`@NonNull\` on a parameter.
**Variable capture** is where beginners get compile errors. A lambda can read local variables from the enclosing method, but only if they are **effectively final**: assigned exactly once and never changed afterwards. The reason is that the lambda may run later, on another thread, after the method has returned, so Java copies the value instead of sharing the variable. If you need a mutable counter, use an array, an \`AtomicInteger\`, or better, restructure the code as a stream reduction. Instance fields and static fields are not subject to this rule because they live on the heap, not the stack.
Two more differences from anonymous classes: inside a lambda, \`this\` refers to the **enclosing object**, not to the lambda itself, and a lambda does not introduce a new scope, so you cannot declare a lambda parameter with the same name as a local variable. Under the hood, lambdas do not generate extra \`.class\` files; they use the \`invokedynamic\` instruction, which is why they are lighter than anonymous classes.`,
      codeSnippet: `// LambdaSyntax.java
import java.util.function.*;

public class LambdaSyntax {
    public static void main(String[] args) {
        // 1. No parameters
        Runnable r = () -> System.out.println("Hello from a lambda");
        r.run();

        // 2. One parameter: parentheses optional
        Function<String, Integer> length = s -> s.length();
        System.out.println(length.apply("Chennai")); // 7

        // 3. Two parameters, expression body
        BiFunction<Integer, Integer, Integer> add = (a, b) -> a + b;
        System.out.println(add.apply(40, 2)); // 42

        // 4. Block body with return
        BiFunction<Double, Double, Double> gstInclusive = (price, rate) -> {
            double tax = price * rate / 100;
            return price + tax;
        };
        System.out.println(gstInclusive.apply(1000.0, 18.0)); // 1180.0

        // 5. Explicit parameter types (only needed in ambiguous cases)
        BiFunction<Integer, Integer, Integer> max = (Integer a, Integer b) -> Math.max(a, b);

        // 6. 'var' in lambda parameters (Java 11+), useful for annotations
        BiFunction<Integer, Integer, Integer> min = (var a, var b) -> Math.min(a, b);
        System.out.println(max.apply(3, 9) + " " + min.apply(3, 9)); // 9 3

        // 7. Effectively final capture
        int discount = 10;                      // never reassigned -> effectively final
        Function<Integer, Integer> applyDiscount = p -> p - p * discount / 100;
        System.out.println(applyDiscount.apply(500)); // 450
        // discount = 20;  // uncomment -> compile error: local variables referenced from a lambda must be effectively final
    }
}`
    },
    {
      heading: "3. Functional Interfaces in Java: Predicate, Function, Consumer, Supplier and BiFunction",
      content: `A lambda has no type of its own; it must be assigned to a **functional interface**, an interface with **exactly one abstract method** (the Single Abstract Method, or SAM). The interface may also have any number of \`default\` and \`static\` methods, and methods inherited from \`Object\` such as \`equals\` do not count. The \`@FunctionalInterface\` annotation is optional but recommended: the compiler then refuses to let anyone add a second abstract method and silently break every lambda in your codebase.
Java ships more than 40 ready-made functional interfaces in \`java.util.function\`. You should know these by heart, because interviewers ask about them and every stream method is defined in terms of them:
• **\`Predicate<T>\`** — \`boolean test(T t)\`. A yes/no check. Used by \`filter\`, \`anyMatch\`, \`removeIf\`. Combinators: \`and\`, \`or\`, \`negate\`, and the static \`Predicate.not(...)\` (Java 11).
• **\`Function<T, R>\`** — \`R apply(T t)\`. Transforms a value. Used by \`map\`, \`computeIfAbsent\`, \`Comparator.comparing\`. Combinators: \`andThen\` (f then g) and \`compose\` (g then f).
• **\`Consumer<T>\`** — \`void accept(T t)\`. Does something with a value and returns nothing. Used by \`forEach\`, \`ifPresent\`, \`peek\`. Combinator: \`andThen\`.
• **\`Supplier<T>\`** — \`T get()\`. Produces a value on demand with no input. Used by \`orElseGet\`, \`Collectors.toCollection\`, lazy initialization and factories.
• **\`BiFunction<T, U, R>\`** — \`R apply(T t, U u)\`. Two inputs, one output. Used by \`Map.merge\`, \`Map.compute\`, \`reduce\` combiners.
• **\`UnaryOperator<T>\`** and **\`BinaryOperator<T>\`** are specialisations where inputs and output share one type; \`List.replaceAll\` takes a \`UnaryOperator\`, \`reduce\` takes a \`BinaryOperator\`.
• **\`BiPredicate\`**, **\`BiConsumer\`** (used by \`Map.forEach\`), and primitive variants such as \`IntPredicate\`, \`IntFunction\`, \`ToIntFunction\`, \`IntBinaryOperator\` that avoid boxing.
Older interfaces such as \`Runnable\`, \`Callable\`, \`Comparator\` and \`ActionListener\` are also functional interfaces, which is why you can pass a lambda to \`new Thread(...)\` or \`executor.submit(...)\`. Write your own functional interface only when the built-in ones do not express the intent clearly, for example a domain-specific \`Validator<T>\` or \`PriceRule\`, or when you need to throw a checked exception.`,
      codeSnippet: `// FunctionalInterfacesDemo.java
import java.util.function.*;
import java.util.*;

public class FunctionalInterfacesDemo {

    @FunctionalInterface
    interface Validator<T> {
        boolean validate(T value);                          // exactly one abstract method
        default Validator<T> and(Validator<T> other) {      // default methods are allowed
            return v -> validate(v) && other.validate(v);
        }
    }

    public static void main(String[] args) {
        // Predicate<T>: T -> boolean
        Predicate<String> isLong = s -> s.length() > 5;
        Predicate<String> startsWithB = s -> s.startsWith("B");
        System.out.println(isLong.and(startsWithB).test("Bengaluru")); // true
        System.out.println(isLong.negate().test("Pune"));              // true
        System.out.println(Predicate.not(isLong).test("Pune"));        // true (Java 11)

        // Function<T, R>: T -> R, with andThen / compose
        Function<Integer, Integer> doubleIt = x -> x * 2;
        Function<Integer, Integer> addTen = x -> x + 10;
        System.out.println(doubleIt.andThen(addTen).apply(5));  // (5*2)+10 = 20
        System.out.println(doubleIt.compose(addTen).apply(5));  // (5+10)*2 = 30

        // Consumer<T>: T -> void
        Consumer<String> print = s -> System.out.println("Hello " + s);
        Consumer<String> shout = s -> System.out.println(s.toUpperCase() + "!");
        print.andThen(shout).accept("Ravi");   // Hello Ravi   then   RAVI!

        // Supplier<T>: () -> T  (lazy value or factory)
        Supplier<List<String>> listFactory = ArrayList::new;
        List<String> fresh = listFactory.get();
        fresh.add("item");
        System.out.println(fresh); // [item]

        // BiFunction<T, U, R>: (T, U) -> R
        BiFunction<String, Integer, String> repeat = (s, n) -> s.repeat(n);
        System.out.println(repeat.apply("ab", 3)); // ababab

        // UnaryOperator<T> and BinaryOperator<T>
        UnaryOperator<String> trim = String::trim;
        BinaryOperator<Integer> multiply = (a, b) -> a * b;
        System.out.println(trim.apply("  Delhi  ") + "|" + multiply.apply(6, 7)); // Delhi|42

        // Custom functional interface
        Validator<String> notBlank = s -> !s.isBlank();
        Validator<String> isEmail = s -> s.contains("@");
        System.out.println(notBlank.and(isEmail).validate("ravi@example.com")); // true
    }
}`
    },
    {
      heading: "4. Method References in Java: The Four Kinds and When to Use Them",
      content: `When a lambda does nothing except call one existing method, Java lets you write a **method reference** instead: \`String::length\` instead of \`s -> s.length()\`. Method references are not a new feature on top of lambdas; they are a shorthand that compiles to the same thing. They make pipelines shorter and, more importantly, make the intent obvious at a glance: \`map(Employee::name)\` says exactly what is happening.
There are **four kinds** of method references, and interviewers love to ask you to name them:
1. **Reference to a static method** — \`ClassName::staticMethod\`. \`Integer::parseInt\` is the same as \`s -> Integer.parseInt(s)\`.
2. **Reference to an instance method of a particular object** — \`object::method\`. \`System.out::println\` is the same as \`x -> System.out.println(x)\`; the object (\`System.out\`) is captured when the reference is created.
3. **Reference to an instance method of an arbitrary object of a given type** — \`Type::instanceMethod\`. \`String::toUpperCase\` is the same as \`s -> s.toUpperCase()\`: the **first parameter** of the lambda becomes the receiver. With two parameters, \`String::compareToIgnoreCase\` means \`(a, b) -> a.compareToIgnoreCase(b)\`.
4. **Reference to a constructor** — \`ClassName::new\`. \`ArrayList::new\` works as a \`Supplier<List<String>>\`, and \`Employee::new\` can work as a \`BiFunction<String, Double, Employee>\` if a matching two-argument constructor exists. Array constructors work too: \`String[]::new\` is what \`toArray(String[]::new)\` expects.
The compiler resolves which kind you mean from the target functional interface, so the same text \`String::valueOf\` could match different overloads in different contexts. If the compiler reports "ambiguous method reference", fall back to an explicit lambda.
**When not to use a method reference:** when you need to add even a tiny bit of logic, when the receiver is not the first parameter, or when the reference hurts readability (for example, chained \`this::helperMethodWithUnclearName\`). Prefer the form that a new team member can read fastest.`,
      codeSnippet: `// MethodReferences.java
import java.util.*;
import java.util.function.*;

public class MethodReferences {
    // Records are compact immutable classes; they are covered in depth in Lecture 10.
    record Employee(String name, double salary) {}

    static boolean isSenior(Employee e) { return e.salary() > 1_000_000; }

    static class Logger {
        void log(String s) { System.out.println("LOG: " + s); }
    }

    public static void main(String[] args) {
        List<Employee> staff = List.of(
            new Employee("Aisha", 1_200_000), new Employee("Rohan", 650_000), new Employee("Meera", 980_000));

        // 1. Static method:  ClassName::staticMethod
        Predicate<Employee> senior = MethodReferences::isSenior;            // e -> isSenior(e)

        // 2. Instance method of a PARTICULAR object:  object::method
        Logger logger = new Logger();
        Consumer<String> log = logger::log;                                 // s -> logger.log(s)

        // 3. Instance method of an ARBITRARY object of a type:  Type::instanceMethod
        Function<Employee, String> nameOf = Employee::name;                 // e -> e.name()
        Comparator<String> ignoreCase = String::compareToIgnoreCase;        // (a, b) -> a.compareToIgnoreCase(b)

        // 4. Constructor reference:  ClassName::new
        Supplier<ArrayList<String>> newList = ArrayList::new;
        BiFunction<String, Double, Employee> factory = Employee::new;
        IntFunction<String[]> arrayMaker = String[]::new;

        staff.stream().filter(senior).map(nameOf).forEach(log);             // LOG: Aisha
        System.out.println(factory.apply("Kabir", 500_000.0));              // Employee[name=Kabir, salary=500000.0]
        System.out.println(ignoreCase.compare("delhi", "DELHI"));           // 0
        System.out.println(newList.get().size() + " " + arrayMaker.apply(3).length); // 0 3
    }
}`
    },
    {
      heading: "5. Java Streams API: Pipelines, Laziness and Intermediate vs Terminal Operations",
      content: `A **stream** (\`java.util.stream.Stream\`) is a sequence of elements that supports aggregate operations. It is **not a data structure**: it does not store elements, it carries them from a **source** through a **pipeline** of operations to a **result**. Think of it as a conveyor belt in a factory, not a warehouse.
Every stream pipeline has three parts:
• **A source** — a \`Collection.stream()\`, \`Arrays.stream(array)\`, \`Stream.of(...)\`, \`IntStream.range\`, \`Files.lines(path)\`, \`String.chars()\`, \`Stream.iterate\` or \`Stream.generate\` for infinite streams, or \`Optional.stream()\`.
• **Zero or more intermediate operations** — \`filter\`, \`map\`, \`flatMap\`, \`sorted\`, \`distinct\`, \`limit\`, \`skip\`, \`peek\`, \`takeWhile\`. Each returns a **new stream** and is **lazy**: calling it does nothing yet, it only records what should happen.
• **Exactly one terminal operation** — \`collect\`, \`toList\`, \`forEach\`, \`reduce\`, \`count\`, \`findFirst\`, \`anyMatch\`, \`min\`, \`max\`. The terminal operation **triggers execution** and produces a value, a collection or a side effect. After it, the stream is consumed and cannot be reused.
**Laziness** has two practical consequences. First, if you forget the terminal operation, nothing runs, not even a \`peek\` with a \`println\`. Second, elements flow through the pipeline **one at a time, vertically**, not stage by stage. In the snippet below, "Ananya" goes through \`peek\`, \`filter\`, \`map\` and \`limit\` before "Bharat" even enters the pipeline. Combined with **short-circuiting** operations (\`limit\`, \`findFirst\`, \`anyMatch\`), this means a stream can stop early and never touch the remaining elements, which is also how infinite streams become usable.
Three more rules: a stream **does not modify its source** (\`sorted()\` returns sorted elements, the original list is unchanged); a stream can be traversed **only once**, a second terminal call throws \`IllegalStateException\`; and stream operations should be **stateless and side-effect free** so they behave identically whether run sequentially or in parallel.`,
      codeSnippet: `// StreamPipeline.java
import java.util.*;
import java.util.stream.*;

public class StreamPipeline {
    public static void main(String[] args) {
        List<String> names = List.of("Ananya", "Bharat", "Chitra", "Dev", "Esha");

        // Source -> intermediate (lazy) -> terminal (triggers execution)
        List<String> result = names.stream()
            .peek(n -> System.out.println("pipeline sees: " + n))
            .filter(n -> n.length() > 3)
            .map(String::toUpperCase)
            .limit(2)                 // short-circuits once 2 elements have passed
            .toList();                // Java 16+ (returns an unmodifiable List)

        System.out.println(result);
        // Output shows laziness + vertical flow + short-circuiting:
        // pipeline sees: Ananya
        // pipeline sees: Bharat
        // [ANANYA, BHARAT]          <- Chitra, Dev and Esha were never processed

        // A stream can be consumed only once
        Stream<String> s = names.stream();
        System.out.println(s.count());        // 5
        // s.forEach(System.out::println);    // IllegalStateException: stream has already been operated upon or closed

        // Other common sources
        IntStream.rangeClosed(1, 5).forEach(System.out::print);                        // 12345
        System.out.println();
        Stream.iterate(1, x -> x <= 100, x -> x * 2).forEach(n -> System.out.print(n + " ")); // 1 2 4 8 16 32 64 (Java 9 form)
        System.out.println();
        Arrays.stream(new int[]{3, 1, 2}).sorted().forEach(System.out::print);         // 123
        System.out.println();
        Stream.generate(() -> "ping").limit(3).forEach(System.out::println);           // ping ping ping (infinite source + limit)
    }
}`
    },
    {
      heading: "6. Intermediate Operations: filter, map, flatMap, sorted, distinct, limit and skip",
      content: `Intermediate operations transform one stream into another. Learn them by what they do to the **shape** of the stream:
• **\`filter(Predicate)\`** keeps elements that pass the test. Shape: same type, fewer (or equal) elements.
• **\`map(Function)\`** replaces each element with the function's result. Shape: possibly different type, exactly the same count. \`map(Order::customer)\` turns a \`Stream<Order>\` into a \`Stream<String>\`.
• **\`flatMap(Function<T, Stream<R>>)\`** is for one-to-many mappings. Each element produces a stream, and all those streams are **flattened** into one. If each order has a list of items, \`flatMap(o -> o.items().stream())\` gives a single stream of all items. Without \`flatMap\` you would get an unusable \`Stream<Stream<String>>\`. Since Java 16, \`mapMulti\` does the same job without creating a stream per element, which is faster when most elements produce zero or one output.
• **\`distinct()\`** removes duplicates using \`equals\` and \`hashCode\`, so your element class must implement them correctly (records do automatically).
• **\`sorted()\`** sorts by natural order (\`Comparable\`); **\`sorted(Comparator)\`** sorts by any key. This is a **stateful** operation: it must see every element before emitting the first one, so it breaks laziness for the rest of the pipeline and uses memory proportional to the stream size.
• **\`limit(n)\`** keeps the first n elements and **short-circuits**; **\`skip(n)\`** drops the first n. Together they implement pagination.
• **\`peek(Consumer)\`** lets you look at elements as they flow, mainly for debugging. Do not use it for business logic; some JDK optimizations may skip it when the result is not needed.
• **\`takeWhile\`** and **\`dropWhile\`** (Java 9) stop or start at the first element that fails the predicate. They are most useful on sorted input: \`takeWhile(price -> price < 1000)\` on a price-sorted stream stops scanning as soon as prices cross the threshold.
• **\`boxed()\`**, **\`mapToInt\`**, **\`mapToObj\`** convert between object streams and primitive streams (Section 10).
Order matters for performance: put **cheap, selective filters first** so that expensive \`map\` and \`sorted\` operations see fewer elements, and put \`limit\` as early as correctness allows.`,
      codeSnippet: `// IntermediateOps.java
import java.util.*;
import java.util.stream.*;

public class IntermediateOps {
    record Order(String customer, String city, List<String> items, double amount) {}

    public static void main(String[] args) {
        List<Order> orders = List.of(
            new Order("Ravi",  "Delhi",     List.of("Laptop", "Mouse"),   72_000),
            new Order("Priya", "Mumbai",    List.of("Phone"),             35_000),
            new Order("Ravi",  "Delhi",     List.of("Keyboard", "Mouse"),  3_500),
            new Order("Sneha", "Bengaluru", List.of("Monitor", "Cable"),  18_000),
            new Order("Arjun", "Mumbai",    List.of("Phone", "Case"),     36_500));

        // filter: keep orders above 10,000
        List<Order> big = orders.stream().filter(o -> o.amount() > 10_000).toList();
        System.out.println(big.size());                                                 // 4

        // map + distinct: unique customer names (encounter order preserved)
        System.out.println(orders.stream().map(Order::customer).distinct().toList());  // [Ravi, Priya, Sneha, Arjun]

        // flatMap: Stream<List<String>> -> Stream<String>
        System.out.println(orders.stream().flatMap(o -> o.items().stream()).distinct().sorted().toList());
        // [Cable, Case, Keyboard, Laptop, Monitor, Mouse, Phone]

        // sorted (descending by amount) + skip/limit = page 2 of size 2
        orders.stream()
            .sorted(Comparator.comparingDouble(Order::amount).reversed())
            .skip(1).limit(2)
            .forEach(o -> System.out.println(o.customer() + " " + o.amount()));
        // Arjun 36500.0
        // Priya 35000.0

        // mapMulti (Java 16): zero-to-many outputs per element without intermediate streams
        List<String> tagged = orders.stream()
            .<String>mapMulti((o, sink) -> {
                if (o.amount() > 30_000) sink.accept(o.customer() + ":premium");
                if (o.city().equals("Delhi")) sink.accept(o.customer() + ":delhi");
            }).toList();
        System.out.println(tagged); // [Ravi:premium, Ravi:delhi, Priya:premium, Ravi:delhi, Arjun:premium]

        // takeWhile / dropWhile (Java 9): best on sorted data
        System.out.println(IntStream.of(2, 4, 6, 7, 8).takeWhile(n -> n % 2 == 0).boxed().toList()); // [2, 4, 6]
        System.out.println(IntStream.of(2, 4, 6, 7, 8).dropWhile(n -> n % 2 == 0).boxed().toList()); // [7, 8]
    }
}`
    },
    {
      heading: "7. Terminal Operations: reduce, collect, count, min, max, anyMatch and findFirst",
      content: `A terminal operation ends the pipeline and produces something you can actually use. Group them by what they return:
• **Collections and lists** — \`toList()\` (Java 16, unmodifiable), \`collect(Collectors.toList())\` (modifiable in practice but not guaranteed by the spec), \`collect(Collectors.toSet())\`, \`collect(Collectors.toCollection(TreeSet::new))\`, \`toArray(String[]::new)\`.
• **A single value** — \`count()\`, \`sum()\` (primitive streams), \`min(Comparator)\`, \`max(Comparator)\`, \`average()\`, \`summaryStatistics()\`, and the general-purpose \`reduce\`.
• **A boolean** — \`anyMatch\`, \`allMatch\`, \`noneMatch\`. All three **short-circuit**: \`anyMatch\` stops at the first match, \`allMatch\` stops at the first failure. Note that \`allMatch\` on an empty stream returns \`true\` (vacuous truth) and \`anyMatch\` returns \`false\`.
• **An Optional** — \`findFirst()\`, \`findAny()\`, \`min\`, \`max\`, and \`reduce\` without an identity. They return \`Optional\` because the stream may be empty. \`findAny\` may return any element in a parallel stream and is faster there; in a sequential stream it behaves like \`findFirst\`.
• **Side effects** — \`forEach\` and \`forEachOrdered\`. In a parallel stream \`forEach\` runs in any order; \`forEachOrdered\` respects encounter order at a performance cost.
**\`reduce\`** deserves special attention because it is the most asked-about terminal operation. It combines all elements into one using a binary operation. There are three overloads: \`reduce(identity, accumulator)\` returns \`T\` and uses the identity as the starting value (0 for sum, 1 for product, "" for concatenation); \`reduce(accumulator)\` returns \`Optional<T>\` because without an identity an empty stream has no answer; and \`reduce(identity, accumulator, combiner)\` lets the accumulator produce a different type than the elements and supplies the **combiner** that merges partial results from parallel threads. The identity must truly be an identity (\`x op identity == x\`), otherwise parallel execution gives wrong answers because the identity is used once per chunk.
Use \`reduce\` for immutable reductions (sum, max, product). Use \`collect\` for **mutable** reductions that build a container (list, map, StringBuilder), because collecting into a list via \`reduce\` would copy the list on every step.`,
      codeSnippet: `// TerminalOps.java
import java.util.*;
import java.util.stream.*;

public class TerminalOps {
    public static void main(String[] args) {
        List<Integer> salaries = List.of(45_000, 82_000, 61_000, 120_000, 38_000);

        // reduce with identity: sum
        int total = salaries.stream().reduce(0, Integer::sum);
        System.out.println(total); // 346000

        // reduce without identity returns Optional (the stream could be empty)
        Optional<Integer> highest = salaries.stream().reduce(Integer::max);
        System.out.println(highest.orElse(0)); // 120000

        // three-argument reduce: identity, accumulator (Integer, String) -> Integer, combiner for parallel
        int totalChars = Stream.of("Java", "Streams", "Rock")
            .reduce(0, (sum, s) -> sum + s.length(), Integer::sum);
        System.out.println(totalChars); // 15

        // count / min / max / average in one pass
        IntSummaryStatistics stats = salaries.stream().mapToInt(Integer::intValue).summaryStatistics();
        System.out.println(stats);
        // IntSummaryStatistics{count=5, sum=346000, min=38000, average=69200.000000, max=120000}

        // matching: short-circuit terminal operations
        System.out.println(salaries.stream().anyMatch(s -> s > 100_000)); // true
        System.out.println(salaries.stream().allMatch(s -> s > 30_000));  // true
        System.out.println(salaries.stream().noneMatch(s -> s < 0));      // true
        System.out.println(Stream.<Integer>empty().allMatch(s -> s > 0)); // true (vacuous truth)

        // findFirst returns Optional
        System.out.println(salaries.stream().filter(s -> s > 60_000).findFirst().orElse(-1)); // 82000

        // collecting into different containers
        Set<Integer> sortedSet = salaries.stream().collect(Collectors.toCollection(TreeSet::new));
        List<Integer> unmodifiable = salaries.stream().sorted().toList();     // Java 16+
        Integer[] array = salaries.stream().toArray(Integer[]::new);
        System.out.println(sortedSet + " " + unmodifiable.get(0) + " " + array.length);
        // [38000, 45000, 61000, 82000, 120000] 38000 5

        // min / max with a Comparator
        System.out.println(Stream.of("Pune", "Hyderabad", "Goa").max(Comparator.comparingInt(String::length)).get()); // Hyderabad
    }
}`
    },
    {
      heading: "8. Collectors in Java: groupingBy, partitioningBy, joining, toMap, counting and teeing",
      content: `\`collect\` is the most powerful terminal operation, and the \`Collectors\` utility class supplies ready-made recipes. A **Collector** describes how to create a result container, how to add one element to it, how to merge two containers (for parallel streams) and how to finish. You will almost never implement one by hand; you compose the built-in ones.
The collectors you must know for interviews and daily work:
• **\`toList()\`, \`toSet()\`, \`toCollection(Supplier)\`** — basic containers. Prefer \`Stream.toList()\` when you just need an unmodifiable list.
• **\`joining(delimiter, prefix, suffix)\`** — concatenates a \`Stream<String>\` (use \`map(Object::toString)\` first for other types). Far cleaner than a loop with a \`StringBuilder\` and a trailing-comma check.
• **\`counting()\`, \`summingInt/Long/Double\`, \`averagingDouble\`, \`minBy\`, \`maxBy\`, \`summarizingDouble\`** — numeric aggregates. On their own they are rarely useful; their real power appears as **downstream collectors**.
• **\`groupingBy(classifier)\`** — the SQL \`GROUP BY\` of Java. Returns a \`Map<K, List<T>>\`. The three-argument form \`groupingBy(classifier, mapFactory, downstream)\` lets you choose the map type (\`TreeMap::new\` for sorted keys, \`LinkedHashMap::new\` for insertion order) and what to do with each group: \`counting()\`, \`summingDouble\`, \`mapping(fn, toSet())\`, \`maxBy\`, or even another \`groupingBy\` for multi-level grouping.
• **\`partitioningBy(predicate)\`** — a special \`groupingBy\` with a boolean key. It **always** has both \`true\` and \`false\` keys, even if one list is empty, which \`groupingBy\` does not guarantee. Use it for pass/fail, premium/regular, in-stock/out-of-stock splits.
• **\`toMap(keyMapper, valueMapper)\`** — builds a map. The two-argument version throws \`IllegalStateException: Duplicate key\` when two elements map to the same key, so in real code almost always use the three-argument form with a **merge function** such as \`Double::sum\` or \`(a, b) -> a\`, and the four-argument form to choose the map implementation. \`toMap\` also rejects \`null\` values.
• **\`mapping(fn, downstream)\`**, **\`filtering(pred, downstream)\`** (Java 9), **\`flatMapping\`** (Java 9) — adapt a downstream collector.
• **\`teeing(c1, c2, merger)\`** (Java 12) — runs two collectors over the same stream in one pass and merges their results, for example count and sum together, or min and max together.
• **\`collectingAndThen(downstream, finisher)\`** — post-process a result, for example wrap the list with \`Collections::unmodifiableList\` or take \`List::size\`.`,
      codeSnippet: `// CollectorsDemo.java
import java.util.*;
import java.util.stream.*;

public class CollectorsDemo {
    record Employee(String name, String dept, String city, double salary) {}

    public static void main(String[] args) {
        List<Employee> emps = List.of(
            new Employee("Aisha", "Engineering", "Bengaluru", 1_500_000),
            new Employee("Rohan", "Engineering", "Pune",        900_000),
            new Employee("Meera", "Sales",       "Mumbai",      700_000),
            new Employee("Kabir", "Sales",       "Delhi",       650_000),
            new Employee("Tara",  "HR",          "Bengaluru",   600_000));

        // groupingBy: Map<Dept, List<Employee>>
        Map<String, List<Employee>> byDept = emps.stream().collect(Collectors.groupingBy(Employee::dept));
        System.out.println(byDept.get("Sales").size());                                 // 2

        // groupingBy + map factory + downstream: count per department, keys sorted
        Map<String, Long> countByDept = emps.stream()
            .collect(Collectors.groupingBy(Employee::dept, TreeMap::new, Collectors.counting()));
        System.out.println(countByDept);                                                // {Engineering=2, HR=1, Sales=2}

        // groupingBy + averagingDouble
        Map<String, Double> avgSalary = emps.stream()
            .collect(Collectors.groupingBy(Employee::dept, Collectors.averagingDouble(Employee::salary)));
        System.out.println(avgSalary.get("Engineering"));                               // 1200000.0

        // groupingBy + mapping: Map<City, Set<Name>>
        Map<String, Set<String>> namesByCity = emps.stream()
            .collect(Collectors.groupingBy(Employee::city, Collectors.mapping(Employee::name, Collectors.toSet())));
        System.out.println(namesByCity.get("Bengaluru"));                               // [Aisha, Tara] (set order may vary)

        // partitioningBy: exactly two keys, true and false
        Map<Boolean, List<String>> highEarners = emps.stream()
            .collect(Collectors.partitioningBy(e -> e.salary() >= 700_000,
                     Collectors.mapping(Employee::name, Collectors.toList())));
        System.out.println(highEarners);                       // {false=[Kabir, Tara], true=[Aisha, Rohan, Meera]}

        // joining
        String csv = emps.stream().map(Employee::name).collect(Collectors.joining(", ", "[", "]"));
        System.out.println(csv);                               // [Aisha, Rohan, Meera, Kabir, Tara]

        // toMap: name -> salary (would throw IllegalStateException on duplicate names)
        Map<String, Double> salaryByName = emps.stream().collect(Collectors.toMap(Employee::name, Employee::salary));
        System.out.println(salaryByName.get("Tara"));          // 600000.0

        // toMap with merge function + map supplier: payroll per city, sorted by city
        Map<String, Double> payrollByCity = emps.stream()
            .collect(Collectors.toMap(Employee::city, Employee::salary, Double::sum, TreeMap::new));
        System.out.println(payrollByCity);                     // {Bengaluru=2100000.0, Delhi=650000.0, Mumbai=700000.0, Pune=900000.0}

        // teeing (Java 12): two collectors, one pass, one result
        String summary = emps.stream().collect(Collectors.teeing(
            Collectors.counting(),
            Collectors.summingDouble(Employee::salary),
            (count, sum) -> count + " employees, total payroll " + sum));
        System.out.println(summary);                           // 5 employees, total payroll 4350000.0

        // maxBy inside groupingBy: top earner per department
        Map<String, Optional<Employee>> topPerDept = emps.stream()
            .collect(Collectors.groupingBy(Employee::dept,
                     Collectors.maxBy(Comparator.comparingDouble(Employee::salary))));
        System.out.println(topPerDept.get("Sales").map(Employee::name).orElse("-"));   // Meera

        // collectingAndThen: unmodifiable result
        List<String> names = emps.stream().map(Employee::name)
            .collect(Collectors.collectingAndThen(Collectors.toList(), Collections::unmodifiableList));
        System.out.println(names.size());                      // 5
    }
}`
    },
    {
      heading: "9. Optional in Java: Avoiding NullPointerException the Right Way",
      content: `\`Optional<T>\` (Java 8) is a container that either holds a non-null value or is empty. Its purpose is narrow but important: to make "this might be absent" **visible in the method signature**. A method declared \`Optional<Customer> findById(long id)\` tells every caller, at compile time, that they must handle the missing case. A method returning \`Customer\` that sometimes returns \`null\` tells them nothing, and the \`NullPointerException\` shows up in production at 2 a.m.
**Creating an Optional:** \`Optional.of(value)\` (throws NPE if value is null, use when null is a bug), \`Optional.ofNullable(value)\` (empty if null), \`Optional.empty()\`.
**Reading an Optional, from best to worst:**
• \`map(fn)\` and \`flatMap(fn)\` — transform the value if present; \`map\` returns empty if the function returns null, which lets you chain through nested nullable fields with no \`if\` checks.
• \`filter(pred)\` — keeps the value only if it passes.
• \`orElse(default)\` — a default value; note the argument is **always evaluated**, even when the value is present.
• \`orElseGet(supplier)\` — a lazily computed default; use this when the default is expensive (database call, object creation).
• \`orElseThrow()\` (Java 10) and \`orElseThrow(supplier)\` — fail loudly with a meaningful exception.
• \`ifPresent(consumer)\` and \`ifPresentOrElse(consumer, runnable)\` (Java 9) — perform an action.
• \`or(supplier)\` (Java 9) — fall back to another Optional. \`stream()\` (Java 9) — turn an Optional into a 0-or-1 element stream, perfect with \`flatMap\`. \`isEmpty()\` (Java 11) complements \`isPresent()\`.
• \`get()\` — throws \`NoSuchElementException\` when empty. Calling \`get()\` without \`isPresent()\` is just a null check in disguise; the \`isPresent()/get()\` pair is better written as \`map/orElse\`.
**Where not to use Optional**, according to the JDK designers themselves: not as a **field** type (it is not \`Serializable\` and adds an object per field), not as a **method parameter** (callers end up writing \`Optional.ofNullable(x)\` everywhere; use overloads instead), not in **collections** (an empty list already expresses absence), and not for primitives (use \`OptionalInt\`, \`OptionalDouble\`, \`OptionalLong\`). Its sweet spot is **return types** of lookups that may legitimately find nothing. Spring Data JPA follows this convention: \`repository.findById(id)\` returns \`Optional<T>\`.`,
      codeSnippet: `// OptionalDemo.java
import java.util.*;
import java.util.stream.Stream;

public class OptionalDemo {
    record Customer(String name, String email) {}

    static final Map<Integer, Customer> DB = Map.of(
        1, new Customer("Neha", "neha@example.com"),
        2, new Customer("Vikram", null));

    static Optional<Customer> findById(int id) {
        return Optional.ofNullable(DB.get(id));          // never return null from a finder
    }

    public static void main(String[] args) {
        // Creating
        Optional<String> present = Optional.of("value");
        Optional<String> empty = Optional.empty();
        // Optional.of(null) -> NullPointerException; use ofNullable for possibly-null values

        // Reading safely
        System.out.println(findById(1).map(Customer::name).orElse("Guest"));   // Neha
        System.out.println(findById(99).map(Customer::name).orElse("Guest"));  // Guest

        // orElseGet is lazy: the supplier runs only when the Optional is empty
        String name = findById(99).map(Customer::name).orElseGet(() -> "Guest-" + System.nanoTime());
        System.out.println(name.startsWith("Guest-"));                          // true

        // orElseThrow: fail loudly with a meaningful exception
        Customer c = findById(1).orElseThrow(() -> new NoSuchElementException("Customer 1 not found"));
        System.out.println(c.name());                                           // Neha

        // ifPresentOrElse (Java 9)
        findById(2).ifPresentOrElse(
            cust -> System.out.println("Found " + cust.name()),
            () -> System.out.println("Not found"));                             // Found Vikram

        // Chaining through a nullable field without a single if
        String emailDomain = findById(2)
            .map(Customer::email)              // email is null -> map returns Optional.empty()
            .filter(e -> e.contains("@"))
            .map(e -> e.substring(e.indexOf('@') + 1))
            .orElse("no-email");
        System.out.println(emailDomain);                                        // no-email

        // or (Java 9): fallback Optional
        System.out.println(findById(99).or(() -> findById(1)).isPresent());    // true

        // Optional.stream (Java 9): flatten Optionals inside a stream
        List<String> names = Stream.of(1, 99, 2)
            .map(OptionalDemo::findById)
            .flatMap(Optional::stream)
            .map(Customer::name)
            .toList();
        System.out.println(names);                                              // [Neha, Vikram]

        System.out.println(empty.isEmpty() + " " + present.isPresent());        // true true (isEmpty since Java 11)
    }
}`
    },
    {
      heading: "10. Primitive Streams: IntStream, LongStream and DoubleStream for Performance",
      content: `\`Stream<Integer>\` stores **boxed** \`Integer\` objects. Every arithmetic step unboxes to \`int\`, computes, and boxes the result back into a new object. For a few hundred elements nobody notices; for a few million elements in a reporting job, the garbage collector does. Java therefore provides three **primitive stream** types: \`IntStream\`, \`LongStream\` and \`DoubleStream\`. They hold raw primitives, avoid boxing entirely, and add numeric operations that \`Stream<T>\` lacks: \`sum()\`, \`average()\`, \`min()\`, \`max()\`, \`summaryStatistics()\`, \`range\` and \`rangeClosed\`.
How to move between the two worlds:
• **Object stream to primitive**: \`mapToInt(ToIntFunction)\`, \`mapToLong\`, \`mapToDouble\`. For example \`orders.stream().mapToDouble(Order::amount).sum()\`.
• **Primitive to object**: \`boxed()\` gives \`Stream<Integer>\`, or \`mapToObj(IntFunction)\` to build objects directly, for example \`IntStream.range(0, 5).mapToObj(i -> new Seat(i))\`.
• **Between primitive types**: \`asLongStream()\`, \`asDoubleStream()\`.
Watch the return types: \`IntStream.sum()\` returns a plain \`int\` (0 for an empty stream), while \`average()\`, \`min()\` and \`max()\` return \`OptionalDouble\` / \`OptionalInt\` because an empty stream has no average. Also remember that \`sum()\` on an \`IntStream\` can silently **overflow** past 2,147,483,647; switch to \`LongStream\` or \`mapToLong\` when totals can be large, for example summing paise across a year of transactions.
Typical uses: generating index ranges (\`IntStream.range(0, list.size())\` when you need the index), numeric statistics, character processing via \`String.chars()\`, and any hot loop where boxing cost matters. In microbenchmarks a primitive stream pipeline is usually comparable to a hand-written \`for\` loop, while the boxed equivalent can be several times slower on large inputs.`,
      codeSnippet: `// PrimitiveStreams.java
import java.util.*;
import java.util.stream.*;

public class PrimitiveStreams {
    public static void main(String[] args) {
        List<Integer> marks = List.of(78, 92, 65, 88, 71);

        // Boxed: every step allocates Integer objects
        int boxedSum = marks.stream().reduce(0, Integer::sum);

        // Primitive: mapToInt gives an IntStream with sum(), average(), max() built in
        int sum = marks.stream().mapToInt(Integer::intValue).sum();
        OptionalDouble avg = marks.stream().mapToInt(Integer::intValue).average();
        System.out.println(boxedSum + " " + sum + " " + avg.getAsDouble());   // 394 394 78.8

        // Ranges
        System.out.println(IntStream.range(1, 5).boxed().toList());           // [1, 2, 3, 4]
        System.out.println(IntStream.rangeClosed(1, 5).sum());                // 15

        // Squares of even numbers up to 10
        System.out.println(IntStream.rangeClosed(1, 10).filter(n -> n % 2 == 0).map(n -> n * n).boxed().toList());
        // [4, 16, 36, 64, 100]

        // LongStream avoids int overflow for big products / sums
        long factorial20 = LongStream.rangeClosed(1, 20).reduce(1L, (a, b) -> a * b);
        System.out.println(factorial20);                                      // 2432902008176640000

        // DoubleStream statistics
        DoubleSummaryStatistics stats = DoubleStream.of(999.0, 1499.0, 249.5).summaryStatistics();
        System.out.printf("min=%.1f max=%.1f avg=%.2f%n", stats.getMin(), stats.getMax(), stats.getAverage());
        // min=249.5 max=1499.0 avg=915.83

        // mapToObj: build objects from an index range
        List<String> seats = IntStream.rangeClosed(1, 3).mapToObj(i -> "A" + i).toList();
        System.out.println(seats);                                            // [A1, A2, A3]

        // chars(): a String as an IntStream of UTF-16 code units
        long vowels = "Hyderabad".toLowerCase().chars().filter(ch -> "aeiou".indexOf(ch) >= 0).count();
        System.out.println(vowels);                                           // 3

        // Empty primitive streams: sum() is 0, average() is empty
        System.out.println(IntStream.empty().sum() + " " + IntStream.empty().average().isPresent()); // 0 false
    }
}`
    },
    {
      heading: "11. Parallel Streams in Java: When They Help and When They Hurt",
      content: `Calling \`.parallel()\` on a stream, or \`collection.parallelStream()\`, asks the JDK to split the source into chunks, process the chunks on multiple threads from the **common ForkJoinPool**, and merge the results. The pipeline code does not change. That simplicity is exactly why parallel streams are misused: it is very easy to make a program slower, or wrong, with one method call.
**When parallel streams help.** All of the following should be true: the source is **large** (tens of thousands of elements or more), the source **splits cheaply** (\`ArrayList\`, arrays, \`IntStream.range\`, \`HashMap\`; not \`LinkedList\`, \`Stream.iterate\` or I/O), the per-element work is **CPU-bound and non-trivial** (parsing, maths, hashing), the operations are **stateless** (no \`sorted\`, \`distinct\` or \`limit\` that require coordination), and the merge step is cheap (summing numbers is cheap; merging large maps from \`groupingBy\` is not; prefer \`groupingByConcurrent\` there). A useful rule of thumb from the Java team: parallelism pays off when **N × Q** (number of elements × cost per element) is large.
**When they hurt.** Small collections (thread hand-off costs more than the work), I/O-bound work (threads block, starving every other parallel stream in the JVM because they all share one common pool), operations that depend on **encounter order** (\`findFirst\`, \`limit\`, \`forEachOrdered\` must coordinate), and anything with **shared mutable state** inside the lambda. The classic bug is \`forEach(list::add)\` on an \`ArrayList\` from a parallel stream: it produces lost elements or an \`ArrayIndexOutOfBoundsException\`, because \`ArrayList\` is not thread-safe. The fix is never "add \`synchronized\`"; it is to let the stream build the result with \`toList()\` or \`collect\`.
**Operational caveats.** The common pool has \`availableProcessors() - 1\` threads by default, shared by every parallel stream and every \`CompletableFuture\` without an explicit executor in the whole JVM. A web application that runs parallel streams inside request handlers can therefore stall unrelated requests. Submitting the stream from a task inside your own \`ForkJoinPool\` makes it use that pool instead, but this is an implementation detail, not a documented guarantee. In a Spring Boot service, prefer explicit executors, \`@Async\`, or virtual threads (Java 21) for concurrency, and keep parallel streams for offline batch computations that you have **measured** with JMH or at least a timing run.`,
      codeSnippet: `// ParallelStreamsDemo.java
import java.util.*;
import java.util.concurrent.*;
import java.util.stream.*;

public class ParallelStreamsDemo {
    public static void main(String[] args) throws Exception {
        // 1. CPU-bound work on a large, cheaply splittable source: parallel can help
        long start = System.currentTimeMillis();
        long primes = LongStream.rangeClosed(2, 2_000_000).parallel()
            .filter(ParallelStreamsDemo::isPrime).count();
        System.out.println(primes + " primes in " + (System.currentTimeMillis() - start) + " ms");
        // 148933 primes; on a multi-core laptop the parallel version is several times faster than sequential

        // 2. WRONG: shared mutable state inside a parallel stream (data race)
        List<Integer> unsafe = new ArrayList<>();
        IntStream.range(0, 10_000).parallel().forEach(unsafe::add);
        System.out.println(unsafe.size()); // frequently < 10000, or ArrayIndexOutOfBoundsException

        // RIGHT: let the stream build the result
        List<Integer> safe = IntStream.range(0, 10_000).parallel().boxed().toList();
        System.out.println(safe.size()); // 10000

        // 3. Order: forEach is unordered in parallel; toList() / forEachOrdered preserve encounter order
        IntStream.range(0, 5).parallel().forEach(i -> System.out.print(i + " "));   // e.g. 3 0 4 1 2
        System.out.println();
        System.out.println(IntStream.range(0, 5).parallel().boxed().toList());       // [0, 1, 2, 3, 4]

        // 4. Grouping in parallel: groupingByConcurrent avoids expensive map merging
        ConcurrentMap<Integer, Long> byLastDigit = IntStream.range(0, 100_000).parallel().boxed()
            .collect(Collectors.groupingByConcurrent(n -> n % 10, Collectors.counting()));
        System.out.println(byLastDigit.get(7)); // 10000

        // 5. Running a parallel stream in a dedicated pool (implementation behaviour, not a spec guarantee)
        ForkJoinPool pool = new ForkJoinPool(4);
        try {
            long sum = pool.submit(() -> LongStream.rangeClosed(1, 1_000_000).parallel().sum()).get();
            System.out.println(sum); // 500000500000
        } finally {
            pool.shutdown();
        }
    }

    static boolean isPrime(long n) {
        if (n < 2) return false;
        for (long i = 2; i * i <= n; i++) if (n % i == 0) return false;
        return true;
    }
}`
    },
    {
      heading: "12. Stream Gatherers (Java 24, Final): Custom Intermediate Operations in Java 25",
      content: `For ten years the set of intermediate operations was fixed: if you needed "group consecutive elements into batches of 100" or "running total", you had to collect to a list and loop, or write awkward tricks with \`AtomicInteger\`. **Stream Gatherers** fix this. A **Gatherer** is to intermediate operations what a **Collector** is to terminal operations: a pluggable, composable building block. The API arrived as a preview in Java 22 (JEP 461), had a second preview in Java 23 (JEP 473), and was **finalized in Java 24 by JEP 485**. It is therefore a standard, non-preview feature of **Java 25 LTS**. It is **not available in Java 21 LTS**, so check your project's baseline before using it.
You apply a gatherer with the new \`Stream.gather(Gatherer)\` method, and the \`java.util.stream.Gatherers\` class provides five built-in ones:
• **\`windowFixed(n)\`** — groups elements into consecutive lists of size n (the last may be smaller). Perfect for batching database inserts or API calls.
• **\`windowSliding(n)\`** — overlapping windows that advance one element at a time: moving averages, "compare with previous" logic.
• **\`scan(initial, fn)\`** — like \`reduce\`, but emits every intermediate result: running totals, cumulative balances.
• **\`fold(initial, fn)\`** — an ordered reduction into a single value that emits once at the end; unlike \`reduce\`, it needs no combiner and no associativity, so it is the right tool when the operation is inherently sequential.
• **\`mapConcurrent(maxConcurrency, fn)\`** — runs the mapper on **virtual threads** with a concurrency limit, while **preserving encounter order**. This is the clean way to fan out a bounded number of I/O calls from a stream, something parallel streams were never good at.
A custom gatherer has four parts, mirroring a collector: an **initializer** (creates per-run state), an **integrator** (receives each element, may push zero or more results downstream, returns \`false\` to stop early), an optional **combiner** (for parallel use) and an optional **finisher** (runs at the end, may emit more). The factory \`Gatherer.ofSequential(initializer, integrator)\` covers most cases, and \`Gatherer.of(...)\` adds the combiner for parallel-capable gatherers. Gatherers also compose: \`g1.andThen(g2)\` builds a new gatherer, so teams can publish a library of reusable stream operations such as \`distinctBy(key)\`, \`chunkedBy(predicate)\` or \`throttle(ratePerSecond)\`.`,
      codeSnippet: `// GatherersDemo.java  — requires Java 24+ (JEP 485, final); included in Java 25 LTS
import java.util.*;
import java.util.stream.*;

public class GatherersDemo {
    public static void main(String[] args) {
        // windowFixed: batches of 3, e.g. send OTP SMS in batches
        System.out.println(Stream.of(1, 2, 3, 4, 5, 6, 7, 8).gather(Gatherers.windowFixed(3)).toList());
        // [[1, 2, 3], [4, 5, 6], [7, 8]]

        // windowSliding: 3-day moving average of daily sales
        List<Integer> sales = List.of(10, 20, 30, 40, 50);
        List<Double> movingAvg = sales.stream()
            .gather(Gatherers.windowSliding(3))
            .map(w -> w.stream().mapToInt(Integer::intValue).average().orElse(0))
            .toList();
        System.out.println(movingAvg);   // [20.0, 30.0, 40.0]

        // scan: running total (prefix sums), e.g. cumulative revenue
        System.out.println(Stream.of(100, 200, 300).gather(Gatherers.scan(() -> 0, Integer::sum)).toList());
        // [100, 300, 600]

        // fold: ordered reduction to one value, no combiner required
        System.out.println(Stream.of("a", "b", "c").gather(Gatherers.fold(() -> "", (acc, s) -> acc + s)).toList());
        // [abc]

        // mapConcurrent: run the mapper on virtual threads, at most 4 at a time, order preserved
        List<String> pages = Stream.of("/home", "/cart", "/orders", "/profile", "/help")
            .gather(Gatherers.mapConcurrent(4, GatherersDemo::fetch))
            .toList();
        System.out.println(pages);   // [fetched /home, fetched /cart, fetched /orders, fetched /profile, fetched /help]

        // Custom gatherer: distinctBy(category) keeps the first product of each category
        record Product(String name, String category) {}
        List<Product> products = List.of(
            new Product("Laptop", "Electronics"), new Product("Phone", "Electronics"),
            new Product("Shirt", "Fashion"),      new Product("Jeans", "Fashion"));

        Gatherer<Product, Set<String>, Product> distinctByCategory = Gatherer.ofSequential(
            HashSet::new,                                            // initializer: per-run state
            (seen, product, downstream) -> {                         // integrator
                if (seen.add(product.category())) return downstream.push(product);
                return true;                                         // true = keep consuming
            });
        System.out.println(products.stream().gather(distinctByCategory).map(Product::name).toList());
        // [Laptop, Shirt]

        // Composition: batch the distinct products in pairs
        System.out.println(products.stream()
            .gather(distinctByCategory.andThen(Gatherers.windowFixed(2)))
            .map(batch -> batch.stream().map(Product::name).toList())
            .toList());                                              // [[Laptop, Shirt]]
    }

    static String fetch(String path) {
        try { Thread.sleep(50); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        return "fetched " + path;
    }
}`
    },
    {
      heading: "13. Real-World Use Cases: How Lambdas and Streams Are Used in Production Java",
      content: `In a typical Spring Boot service you will see lambdas and streams in these places every single day:
• **Entity to DTO mapping.** A controller must not expose JPA entities directly. \`repository.findAll().stream().map(OrderMapper::toDto).toList()\` is the standard one-liner, often combined with a \`filter\` on status and a \`sorted\` by date.
• **Reports and dashboards.** Revenue per city, orders per day, top customers: \`groupingBy\` with \`summingDouble\` or \`counting\`, then a sort on the entries. For very large data the aggregation belongs in SQL (\`GROUP BY\`) and streams handle only the post-processing of the result page.
• **Validation pipelines.** Keeping business rules as a \`List<Predicate<Order>>\` and checking \`allMatch\` makes rules easy to add, reorder, unit test individually with JUnit 5 and Mockito, and even load from configuration.
• **Comparator building.** \`Comparator.comparing(Employee::dept).thenComparing(Employee::salary, Comparator.reverseOrder())\` replaces 20 lines of nested if-else in \`compareTo\`.
• **Map APIs.** \`map.computeIfAbsent(key, k -> new ArrayList<>()).add(value)\` for building indexes, \`map.merge(key, 1, Integer::sum)\` for counting, \`map.forEach((k, v) -> ...)\` for iteration.
• **Asynchronous code.** \`CompletableFuture.supplyAsync(() -> callPaymentGateway(), executor).thenApply(...).exceptionally(...)\`: every stage takes a lambda.
• **Spring Security and Spring Data.** \`http.authorizeHttpRequests(auth -> auth.requestMatchers("/admin/**").hasRole("ADMIN"))\` is a lambda DSL; \`Optional\` from \`findById\` is unwrapped with \`orElseThrow(() -> new ResourceNotFoundException(id))\`.
• **Testing.** \`assertThrows(IllegalArgumentException.class, () -> service.pay(-1))\` in JUnit 5 and \`when(repo.findById(1L)).thenAnswer(inv -> Optional.of(order))\` in Mockito.
• **Batch processing.** \`Files.lines(path)\` streams a 5 GB log file line by line without loading it into memory; with \`Gatherers.windowFixed(500)\` you can insert rows in batches of 500.
The example below is a self-contained slice of an order service showing DTO mapping, reporting, a predicate-based validation chain and a flatMap-based best-seller query. In a real project the \`List<Order>\` would come from a Spring Data JPA repository and the DTOs would be returned from a \`@RestController\`.`,
      codeSnippet: `// src/main/java/com/example/orders/OrderService.java  (framework-free slice of a Spring Boot service)
import java.util.*;
import java.util.function.Predicate;
import java.util.stream.*;

public class OrderService {
    record Order(long id, String customerEmail, String status, double amount, List<String> skus) {}
    record OrderSummaryDto(long id, String maskedEmail, double amount) {}

    // In Spring Boot this would be orderRepository.findAll() from Spring Data JPA
    private final List<Order> orderRepository = List.of(
        new Order(1, "ravi@example.com",  "DELIVERED",  2_499, List.of("SKU-1", "SKU-2")),
        new Order(2, "priya@example.com", "CANCELLED",    999, List.of("SKU-3")),
        new Order(3, "ravi@example.com",  "DELIVERED", 15_000, List.of("SKU-1")),
        new Order(4, "amit@example.com",  "SHIPPED",    4_200, List.of("SKU-4", "SKU-2")));

    // 1. Entity -> DTO mapping for an API response (never expose entities directly)
    public List<OrderSummaryDto> deliveredOrders() {
        return orderRepository.stream()
            .filter(o -> o.status().equals("DELIVERED"))
            .map(o -> new OrderSummaryDto(o.id(), mask(o.customerEmail()), o.amount()))
            .toList();
    }

    // 2. Reporting: revenue per customer, highest first, insertion-ordered map
    public Map<String, Double> revenueByCustomer() {
        return orderRepository.stream()
            .filter(o -> !o.status().equals("CANCELLED"))
            .collect(Collectors.groupingBy(Order::customerEmail, Collectors.summingDouble(Order::amount)))
            .entrySet().stream()
            .sorted(Map.Entry.<String, Double>comparingByValue().reversed())
            .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (a, b) -> a, LinkedHashMap::new));
    }

    // 3. Validation chain built from Predicates: easy to extend and unit test
    private static final List<Predicate<Order>> RULES = List.of(
        o -> o.amount() > 0,
        o -> !o.skus().isEmpty(),
        o -> o.customerEmail().contains("@"));

    public boolean isValid(Order order) {
        return RULES.stream().allMatch(rule -> rule.test(order));
    }

    // 4. Best-selling SKU: flatMap + groupingBy + max
    public Optional<String> bestSellingSku() {
        return orderRepository.stream()
            .flatMap(o -> o.skus().stream())
            .collect(Collectors.groupingBy(s -> s, Collectors.counting()))
            .entrySet().stream()
            .max(Map.Entry.comparingByValue())
            .map(Map.Entry::getKey);
    }

    private static String mask(String email) {
        return email.charAt(0) + "***" + email.substring(email.indexOf('@'));
    }

    public static void main(String[] args) {
        OrderService service = new OrderService();
        System.out.println(service.deliveredOrders());
        // [OrderSummaryDto[id=1, maskedEmail=r***@example.com, amount=2499.0], OrderSummaryDto[id=3, maskedEmail=r***@example.com, amount=15000.0]]
        System.out.println(service.revenueByCustomer());   // {ravi@example.com=17499.0, amit@example.com=4200.0}
        System.out.println(service.isValid(new Order(5, "x", "NEW", 10, List.of("SKU-9"))));  // false (no @)
        System.out.println(service.bestSellingSku());      // Optional[SKU-1] or Optional[SKU-2] (both sold twice)
    }
}`
    },
    {
      heading: "14. Common Mistakes with Java Lambdas and Streams and How to Fix Them",
      content: `These are the errors that show up in code reviews and interview coding rounds again and again:
• **Forgetting the terminal operation.** A pipeline ending in \`map\` or \`filter\` never runs. If a \`println\` inside a lambda never prints, this is the first thing to check. **Fix:** end with \`toList\`, \`collect\`, \`forEach\`, \`count\` or another terminal operation.
• **Reusing a stream.** \`IllegalStateException: stream has already been operated upon or closed\`. **Fix:** create a fresh stream from the source each time, or store the collected result, not the stream.
• **Side effects and shared mutable state.** Adding to an outer list inside \`forEach\`, incrementing a counter, or modifying the source collection while streaming it (\`ConcurrentModificationException\`). **Fix:** express the result as a \`collect\` or \`reduce\`; the stream builds the container for you, safely even in parallel.
• **\`toMap\` without a merge function.** Duplicate keys throw \`IllegalStateException: Duplicate key\`. **Fix:** always pass a merge function \`(a, b) -> ...\`, and remember \`toMap\` also rejects null values.
• **\`Optional.get()\` without a check.** Just a disguised NPE. **Fix:** \`orElse\`, \`orElseGet\`, \`orElseThrow\` or \`map\`.
• **Assuming \`Stream.toList()\` is modifiable.** Since Java 16 it returns an **unmodifiable** list; \`add\` throws \`UnsupportedOperationException\`. **Fix:** \`collect(Collectors.toCollection(ArrayList::new))\` when you really need to mutate.
• **Sorting the whole stream to take the top 3.** \`sorted().limit(3)\` on a million elements is O(n log n) and stateful. **Fix:** fine for small data; for large data use a database \`ORDER BY ... LIMIT\`, a bounded \`PriorityQueue\`, or \`Collectors.teeing\` tricks.
• **Checked exceptions inside lambdas.** \`Function\` and \`Consumer\` do not declare \`throws\`, so \`files.forEach(f -> Files.readString(f))\` does not compile. **Fix:** wrap in an unchecked exception (\`UncheckedIOException\`), write a small \`ThrowingFunction\` wrapper, or handle the exception inside the lambda.
• **Parallel by default.** Sprinkling \`.parallel()\` on small lists or I/O work makes things slower and can starve the common pool. **Fix:** measure first; keep parallel streams for large CPU-bound batch jobs.
• **Over-long pipelines.** A 15-line stream with nested lambdas is harder to read than two short methods. **Fix:** extract named predicates and functions (\`static Predicate<Order> isDelivered()\`), and give intermediate collections a name when it helps.
• **Boxing in hot loops.** \`Stream<Integer>\` for numeric crunching. **Fix:** \`mapToInt\` / \`IntStream\`.`,
      codeSnippet: `// StreamMistakes.java
import java.util.*;
import java.util.stream.*;

public class StreamMistakes {
    public static void main(String[] args) {
        List<String> cities = List.of("Delhi", "Mumbai", "Chennai", "Kolkata");

        // MISTAKE 1: no terminal operation, nothing runs
        cities.stream().map(c -> { System.out.println("mapping " + c); return c; });   // prints nothing
        cities.stream().map(String::toUpperCase).forEach(System.out::println);          // runs

        // MISTAKE 2: reusing a stream
        Stream<String> s = cities.stream();
        long count = s.count();
        // s.findFirst();   // IllegalStateException; create a new stream instead

        // MISTAKE 3: modifying the source while streaming it
        List<String> source = new ArrayList<>(cities);
        // source.stream().forEach(c -> source.add(c + "2"));   // ConcurrentModificationException
        List<String> copy = source.stream().map(c -> c + "2").toList();               // build a new list instead

        // MISTAKE 4: toMap without a merge function on duplicate keys
        List<String> words = List.of("apple", "avocado", "banana");
        // words.stream().collect(Collectors.toMap(w -> w.charAt(0), w -> w));        // IllegalStateException: Duplicate key a
        Map<Character, String> ok = words.stream()
            .collect(Collectors.toMap(w -> w.charAt(0), w -> w, (a, b) -> a + "|" + b));
        System.out.println(ok);   // {a=apple|avocado, b=banana}

        // MISTAKE 5: Optional.get() without checking
        Optional<String> none = cities.stream().filter(c -> c.startsWith("Z")).findFirst();
        // none.get();   // NoSuchElementException
        System.out.println(none.orElse("No city"));

        // MISTAKE 6: assuming toList() is modifiable (unmodifiable since Java 16)
        List<String> upper = cities.stream().map(String::toUpperCase).toList();
        // upper.add("PUNE");   // UnsupportedOperationException
        List<String> mutable = cities.stream().map(String::toUpperCase).collect(Collectors.toCollection(ArrayList::new));
        mutable.add("PUNE");
        System.out.println(mutable.size());   // 5

        // MISTAKE 7: checked exceptions inside lambdas: wrap them
        List<String> files = List.of("a.txt", "b.txt");
        files.forEach(f -> {
            try {
                readFile(f);
            } catch (java.io.IOException e) {
                throw new java.io.UncheckedIOException(e);
            }
        });

        // MISTAKE 8: unreadable mega-pipeline: extract named pieces instead
        java.util.function.Predicate<String> longName = c -> c.length() > 5;
        System.out.println(cities.stream().filter(longName).sorted().limit(2).toList());   // [Chennai, Kolkata]
    }

    static void readFile(String name) throws java.io.IOException { /* pretend to read */ }
}`
    },
    {
      heading: "15. Frequently Asked Questions about Java Lambdas and Streams",
      content: `**What is a lambda expression in Java and when should I use it?**
A lambda is an anonymous function, written as \`(params) -> body\`, that can be passed wherever a functional interface is expected. Use it whenever you would otherwise write a one-method anonymous class: comparators, event handlers, \`Runnable\` tasks, stream operations and callbacks. Use a method reference when the lambda only calls one existing method.
**What is the difference between a lambda and an anonymous inner class?**
A lambda needs a functional interface and compiles via \`invokedynamic\` with no extra class file; an anonymous class can implement any interface or extend a class and creates a \`.class\` file. Inside a lambda \`this\` means the enclosing object, inside an anonymous class it means the anonymous instance. Lambdas cannot declare fields or shadow local variables.
**What is the difference between map and flatMap in Java streams?**
\`map\` transforms each element into exactly one output element, so the count stays the same. \`flatMap\` transforms each element into a stream of zero or more elements and flattens them all into one stream. Use \`flatMap\` when each element contains a collection (orders with items, students with subjects) or an \`Optional\`.
**What is the difference between Collection and Stream in Java?**
A collection stores elements in memory and can be iterated many times; a stream does not store anything, it carries elements from a source through a pipeline, is evaluated lazily, and can be consumed only once. Collections are about data; streams are about computation on data.
**Is Stream.toList() the same as Collectors.toList()?**
No. \`Stream.toList()\` (Java 16) returns an unmodifiable list and allows nulls; \`collect(Collectors.toList())\` currently returns an \`ArrayList\` but the specification does not guarantee modifiability. Prefer \`toList()\` unless you need to mutate the result, in which case use \`Collectors.toCollection(ArrayList::new)\`.
**Are Java parallel streams faster than sequential streams?**
Only for large, cheaply splittable, CPU-bound workloads without shared state. For small lists, I/O work or order-dependent operations they are usually slower and can starve the shared ForkJoinPool. Always measure before switching.
**Are Stream Gatherers available in Java 21?**
No. Gatherers previewed in Java 22 and 23 and became final in Java 24 (JEP 485), so they are available in Java 25 LTS but not in Java 21 LTS. On Java 21 use \`collect\` plus a loop or a third-party library for batching and windowing.
**Should I use Optional as a field or method parameter?**
The JDK designers advise against it. Use \`Optional\` as a return type for lookups that may find nothing. For fields use a nullable reference with clear documentation, and for parameters use overloads or a builder.`
    },
    {
      heading: "16. Interview Questions and Answers on Java 8+ Functional Programming",
      content: `**Q1. What is a functional interface? Can it have more than one method?**
A functional interface has exactly one abstract method and can be the target of a lambda. It may have any number of \`default\` and \`static\` methods, and public methods of \`Object\` (\`equals\`, \`hashCode\`, \`toString\`) do not count. \`@FunctionalInterface\` makes the compiler enforce the single-abstract-method rule.
**Q2. Why must variables used inside a lambda be effectively final?**
Because the lambda captures a copy of the value, not a reference to the stack slot; the lambda may execute after the method returns or on another thread. Allowing reassignment would create confusing, non-thread-safe semantics. Use an array, \`AtomicInteger\` or a stream reduction if you need mutation.
**Q3. Explain the four types of method references with examples.**
Static: \`Integer::parseInt\`. Bound instance (particular object): \`System.out::println\`. Unbound instance (arbitrary object of a type): \`String::toUpperCase\`, where the first lambda parameter becomes the receiver. Constructor: \`ArrayList::new\`, \`String[]::new\`.
**Q4. What are intermediate and terminal operations? Why are streams lazy?**
Intermediate operations (\`filter\`, \`map\`, \`sorted\`) return a new stream and only record what to do; a terminal operation (\`collect\`, \`forEach\`, \`reduce\`) triggers execution. Laziness lets the JDK fuse operations into a single pass, process elements one at a time, short-circuit with \`limit\` or \`findFirst\`, and work with infinite streams.
**Q5. What is the difference between reduce and collect?**
\`reduce\` performs an immutable reduction: it combines elements into a new value each step, ideal for sums, max and products. \`collect\` performs a mutable reduction into a container (list, map, StringBuilder) using a \`Collector\` with supplier, accumulator, combiner and finisher. Building a list with \`reduce\` would copy it at every step, so use \`collect\`.
**Q6. What is the difference between groupingBy and partitioningBy?**
\`groupingBy\` groups by any key and returns a map with one entry per distinct key that actually occurred. \`partitioningBy\` takes a predicate, returns \`Map<Boolean, ...>\` and always contains both \`true\` and \`false\` keys, even when one group is empty.
**Q7. What happens if Collectors.toMap encounters duplicate keys?**
The two-argument version throws \`IllegalStateException: Duplicate key\`. Supply a merge function as the third argument, for example \`Integer::sum\` or \`(a, b) -> a\`, and optionally a map supplier as the fourth to choose \`TreeMap\` or \`LinkedHashMap\`.
**Q8. What is the difference between findFirst and findAny? And between forEach and forEachOrdered?**
\`findFirst\` returns the first element in encounter order; \`findAny\` may return any element and is faster in parallel streams. \`forEach\` in a parallel stream runs in arbitrary order; \`forEachOrdered\` enforces encounter order at the cost of parallel efficiency. In sequential streams the pairs behave the same.
**Q9. What are the pitfalls of parallel streams?**
Shared mutable state (data races), small or I/O-bound workloads (slower), order-dependent operations (\`limit\`, \`findFirst\` need coordination), expensive merges for \`groupingBy\`, and the shared common ForkJoinPool that can be starved by one blocking stream. Measure before using.
**Q10. What is Optional, and what is wrong with isPresent() followed by get()?**
\`Optional\` is a container that makes a possibly-absent return value explicit. \`isPresent()/get()\` is just a null check in a new costume; prefer \`map\`, \`orElse\`, \`orElseGet\`, \`orElseThrow\` or \`ifPresent\`, which express the intent in one expression and cannot forget the empty case.
**Q11. What are Stream Gatherers and which Java version finalized them?**
Gatherers (\`Stream.gather\`, \`java.util.stream.Gatherers\`) let you define custom intermediate operations such as fixed or sliding windows, running totals (\`scan\`), ordered folds and bounded concurrent mapping on virtual threads. They were finalized in Java 24 by JEP 485 and are part of Java 25 LTS.`
    },
    {
      heading: "17. Hands-On Exercise: Sales Analytics with Streams, Collectors, Optional and Gatherers",
      content: `Build a small analytics program for an Indian e-commerce store. The data is a list of ten sales records (customer, city, category, product, quantity, unit price). Write stream pipelines that answer eleven business questions, then compare your output with the comments in the code:
1. Total revenue using \`mapToDouble\` and \`sum\`.
2. Revenue per city, highest first, using \`groupingBy\` + \`summingDouble\` and sorting map entries.
3. Units sold per category in an \`EnumMap\` using the three-argument \`groupingBy\`.
4. Big-ticket (total ≥ ₹10,000) versus regular sales with \`partitioningBy\` + \`mapping\`.
5. Top 3 customers by spend using \`groupingBy\` + \`teeing\`, a record, \`sorted\` and \`limit\`.
6. The largest single sale using \`max\` and \`Optional.map\`.
7. A sorted, de-duplicated product catalogue string using \`distinct\`, \`sorted\` and \`joining\`.
8. A filter built by composing two \`Predicate\`s at runtime.
9. An \`anyMatch\` short-circuit question.
10. Running revenue after each sale with \`Gatherers.scan\` (Java 24+).
11. Processing the sales in batches of four with \`Gatherers.windowFixed\`.
Compile and run with \`javac SalesAnalytics.java\` and \`java SalesAnalytics\` on JDK 24 or 25. On JDK 21, delete steps 10 and 11 and everything else compiles unchanged. **Extension ideas:** add a \`LocalDate\` to each sale and group revenue by month; compute each customer's share of total revenue as a percentage; replace the \`double[]\` in step 5 with a dedicated record; and write JUnit 5 tests for each query by extracting them into methods that take \`List<Sale>\` as a parameter.`,
      codeSnippet: `// SalesAnalytics.java  — javac SalesAnalytics.java && java SalesAnalytics   (JDK 24+ for steps 10-11)
import java.util.*;
import java.util.function.Predicate;
import java.util.stream.*;

public class SalesAnalytics {

    enum Category { ELECTRONICS, FASHION, GROCERY, BOOKS }

    record Sale(int id, String customer, String city, Category category, String product, int quantity, double unitPrice) {
        double total() { return quantity * unitPrice; }
    }

    record CustomerStats(String customer, long orders, double spent) {}

    static List<Sale> loadSales() {
        return List.of(
            new Sale(1,  "Ravi",  "Delhi",     Category.ELECTRONICS, "Laptop",      1, 55_000),
            new Sale(2,  "Priya", "Mumbai",    Category.FASHION,     "Kurta",       3,  1_200),
            new Sale(3,  "Ravi",  "Delhi",     Category.GROCERY,     "Basmati 5kg", 2,    650),
            new Sale(4,  "Sneha", "Bengaluru", Category.BOOKS,       "Java Book",   1,    899),
            new Sale(5,  "Arjun", "Mumbai",    Category.ELECTRONICS, "Phone",       1, 32_000),
            new Sale(6,  "Priya", "Mumbai",    Category.ELECTRONICS, "Earbuds",     2,  2_500),
            new Sale(7,  "Kabir", "Pune",      Category.FASHION,     "Sneakers",    1,  4_500),
            new Sale(8,  "Sneha", "Bengaluru", Category.GROCERY,     "Tea 1kg",     4,    450),
            new Sale(9,  "Meera", "Hyderabad", Category.BOOKS,       "DSA Book",    2,    750),
            new Sale(10, "Ravi",  "Delhi",     Category.ELECTRONICS, "Monitor",     1, 14_000));
    }

    public static void main(String[] args) {
        List<Sale> sales = loadSales();

        // 1. Total revenue
        double revenue = sales.stream().mapToDouble(Sale::total).sum();
        System.out.printf("1. Total revenue: %.2f%n", revenue);
        // 1. Total revenue: 119599.00

        // 2. Revenue per city, highest first
        System.out.println("2. Revenue by city:");
        sales.stream()
            .collect(Collectors.groupingBy(Sale::city, Collectors.summingDouble(Sale::total)))
            .entrySet().stream()
            .sorted(Map.Entry.<String, Double>comparingByValue().reversed())
            .forEach(e -> System.out.printf("   %-10s %.0f%n", e.getKey(), e.getValue()));
        // Delhi 70300 / Mumbai 40600 / Pune 4500 / Bengaluru 2699 / Hyderabad 1500

        // 3. Units sold per category in an EnumMap
        Map<Category, Integer> unitsByCategory = sales.stream()
            .collect(Collectors.groupingBy(Sale::category, () -> new EnumMap<>(Category.class),
                                           Collectors.summingInt(Sale::quantity)));
        System.out.println("3. Units by category: " + unitsByCategory);
        // {ELECTRONICS=5, FASHION=4, GROCERY=6, BOOKS=3}

        // 4. Partition: big-ticket sales (total >= 10,000) vs the rest
        Map<Boolean, List<String>> bigTicket = sales.stream()
            .collect(Collectors.partitioningBy(s -> s.total() >= 10_000,
                                               Collectors.mapping(Sale::product, Collectors.toList())));
        System.out.println("4. Big-ticket: " + bigTicket.get(true) + " | regular count: " + bigTicket.get(false).size());
        // 4. Big-ticket: [Laptop, Phone, Monitor] | regular count: 7

        // 5. Top 3 customers by spend
        List<CustomerStats> top3 = sales.stream()
            .collect(Collectors.groupingBy(Sale::customer,
                     Collectors.teeing(Collectors.counting(), Collectors.summingDouble(Sale::total),
                                       (n, spent) -> new double[]{n, spent})))
            .entrySet().stream()
            .map(e -> new CustomerStats(e.getKey(), (long) e.getValue()[0], e.getValue()[1]))
            .sorted(Comparator.comparingDouble(CustomerStats::spent).reversed())
            .limit(3)
            .toList();
        System.out.println("5. Top customers: " + top3);
        // [CustomerStats[customer=Ravi, orders=3, spent=70300.0], CustomerStats[customer=Arjun, orders=1, spent=32000.0], CustomerStats[customer=Priya, orders=2, spent=8600.0]]

        // 6. Largest single sale (max + Optional)
        String priciest = sales.stream()
            .max(Comparator.comparingDouble(Sale::total))
            .map(s -> s.product() + " by " + s.customer())
            .orElse("no sales");
        System.out.println("6. Largest sale: " + priciest);   // Laptop by Ravi

        // 7. Distinct products, sorted, as one line
        System.out.println("7. Catalogue: " +
            sales.stream().map(Sale::product).distinct().sorted().collect(Collectors.joining(", ")));
        // Basmati 5kg, DSA Book, Earbuds, Java Book, Kurta, Laptop, Monitor, Phone, Sneakers, Tea 1kg

        // 8. Composed predicates
        Predicate<Sale> notGrocery = s -> s.category() != Category.GROCERY;
        Predicate<Sale> qtyAtLeast2 = s -> s.quantity() >= 2;
        System.out.println("8. Multi-qty non-grocery sale ids: " +
            sales.stream().filter(notGrocery.and(qtyAtLeast2)).map(Sale::id).toList());   // [2, 6, 9]

        // 9. anyMatch short-circuits
        boolean puneElectronics = sales.stream()
            .anyMatch(s -> s.city().equals("Pune") && s.category() == Category.ELECTRONICS);
        System.out.println("9. Pune electronics? " + puneElectronics);   // false

        // 10. Running revenue after each sale (Gatherers.scan, Java 24+)
        List<Double> running = sales.stream().map(Sale::total)
            .gather(Gatherers.scan(() -> 0.0, Double::sum)).toList();
        System.out.println("10. Running total after sale 5: " + running.get(4));   // 92799.0

        // 11. Process in batches of 4 (Gatherers.windowFixed), like batching DB inserts
        sales.stream().gather(Gatherers.windowFixed(4))
            .forEach(batch -> System.out.println("11. batch of " + batch.size() + ": ids " +
                                                 batch.stream().map(Sale::id).toList()));
        // 11. batch of 4: ids [1, 2, 3, 4]
        // 11. batch of 4: ids [5, 6, 7, 8]
        // 11. batch of 2: ids [9, 10]
    }
}`
    },
    {
      heading: "18. Summary",
      content: `• **Functional programming in Java** (since Java 8) lets you pass behaviour as values with lambdas, functional interfaces and method references, and process data declaratively with streams.
• A **lambda** is \`(params) -> body\`; it needs a target **functional interface** (one abstract method) and may only capture **effectively final** locals.
• Know the core interfaces: \`Predicate\` (test), \`Function\` (apply), \`Consumer\` (accept), \`Supplier\` (get), \`BiFunction\`, plus \`UnaryOperator\`, \`BinaryOperator\` and the primitive variants.
• **Method references** come in four kinds: static, bound instance, unbound instance (\`Type::method\`) and constructor (\`::new\`).
• A **stream pipeline** is source → lazy intermediate operations (\`filter\`, \`map\`, \`flatMap\`, \`sorted\`, \`distinct\`, \`limit\`, \`skip\`) → one terminal operation (\`collect\`, \`toList\`, \`reduce\`, \`count\`, \`anyMatch\`, \`findFirst\`). Streams are lazy, single-use and must not mutate their source.
• **Collectors** are the SQL of Java: \`groupingBy\`, \`partitioningBy\`, \`joining\`, \`toMap\` (always with a merge function), \`counting\`, \`summingDouble\`, \`mapping\`, \`teeing\`.
• **\`Optional\`** makes "maybe absent" explicit in return types; prefer \`map\`/\`orElse\`/\`orElseThrow\` over \`get()\`, and do not use it for fields or parameters.
• Use **primitive streams** (\`IntStream\`, \`LongStream\`, \`DoubleStream\`) to avoid boxing in numeric work.
• **Parallel streams** only help for large, splittable, CPU-bound, stateless work; never share mutable state, and measure before using.
• **Stream Gatherers** (\`Stream.gather\`, \`Gatherers.windowFixed\`, \`windowSliding\`, \`scan\`, \`fold\`, \`mapConcurrent\`) add custom intermediate operations; final in **Java 24** (JEP 485), available in **Java 25 LTS**, not in Java 21.
**Next lecture:** Modern Java (17 to 25) — Records, Sealed Types, Pattern Matching & More`
    }
  ]
};
