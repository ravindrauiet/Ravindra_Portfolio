export const lecture02 = {
  slug: "lecture-2",
  number: 2,
  title: "Complete Java Course — Lecture 2: Variables, Data Types, Operators & Type Casting",
  summary: "Learn Java variables, the eight primitive data types and their ranges, wrapper classes and autoboxing, var type inference, literals, final constants, operators and precedence, integer division and overflow, implicit vs explicit type casting, and Scanner input — with examples and interview questions.",
  readTime: "65 min read",
  difficulty: "Beginner",
  date: "2026-10-09",
  sections: [
    {
      heading: "1. Introduction: Why Variables, Data Types and Operators Are the Foundation of Java",
      content: `In Lecture 1 you installed the JDK, understood how the JVM runs bytecode and printed "Hello, World". Every program after that point does one thing at its core: it **stores data in variables, describes that data with types, and transforms it with operators**. A banking app stores a balance, a food delivery app stores a distance and a price, a railway booking site stores seat numbers. Before Java can do anything useful with that data, it needs to know exactly what kind of data it is.
Java is a **statically typed** language. That means the type of every variable is known at compile time, and the compiler refuses to build your program if you try to put a decimal number into an integer box or add a boolean to a string. This strictness feels annoying in week one and becomes a superpower by month three: entire categories of bugs that crash Python or JavaScript programs at runtime are caught by \`javac\` before the program ever runs.
This lecture is long on purpose. Data types, operators and casting are the topics that interviewers love for freshers (campus placements, service-company aptitude rounds, and the first ten minutes of almost every Java interview), and they are also the topics where real production bugs hide: a salary calculation that silently overflows an \`int\`, a percentage that prints \`0\` because of integer division, or an \`Integer\` comparison with \`==\` that works in testing and fails in production.
By the end you will be able to:
• Choose the right primitive type for any value and explain its exact range.
• Explain the difference between \`int\` and \`Integer\`, and why autoboxing can throw a \`NullPointerException\`.
• Use \`var\`, numeric literals with underscores, binary and hexadecimal literals, and \`final\` constants correctly.
• Read any Java expression and predict its result using operator precedence.
• Explain integer division, the modulus operator, overflow, and the exact rules of implicit (widening) and explicit (narrowing) casting.
• Read user input with \`Scanner\` without falling into the famous newline trap.
Every code example in this lecture compiles with Java 21 and Java 25 (the current LTS, released September 2025). Where a feature was introduced in a specific version, the version is named so you can answer "since which Java version?" questions confidently.`
    },
    {
      heading: "2. Declaring Variables in Java: Syntax, Initialization, Scope and Naming Conventions",
      content: `A **variable** is a named location in memory that holds a value of a specific type. In Java a declaration always has the shape **type name;** or **type name = initialValue;**. You can declare several variables of the same type in one statement, but readable code usually declares one per line.
Java has three kinds of variables, and the difference matters in interviews:
• **Local variables** are declared inside a method, constructor or block. They live on the stack, exist only while that block runs, and **must be explicitly initialized before use** — the compiler reports "variable x might not have been initialized" otherwise.
• **Instance variables (fields)** are declared inside a class but outside any method. Each object gets its own copy. They receive **default values** if you do not initialize them: \`0\` for numeric types, \`false\` for \`boolean\`, \`'\\u0000'\` (the null character) for \`char\`, and \`null\` for reference types.
• **Static variables (class variables)** are declared with the \`static\` keyword. One copy is shared by every object of the class. They also receive default values.
**Scope** is the region of code where a variable is visible. A variable declared inside an \`if\` block or a \`for\` loop disappears at the closing brace. Java does not allow a local variable to shadow another local variable of the same name in an enclosing block, which prevents a whole family of confusing bugs.
**Naming conventions** are not enforced by the compiler but are enforced by every code reviewer and every hiring manager:
• Variables and methods use **camelCase**: \`totalAmount\`, \`customerName\`, \`calculateEmi()\`.
• Classes and interfaces use **PascalCase**: \`BankAccount\`, \`OrderService\`.
• Constants (\`static final\`) use **UPPER_SNAKE_CASE**: \`MAX_RETRY_COUNT\`, \`GST_RATE\`.
• Packages are all lowercase: \`com.ravindra.billing\`.
• Names must start with a letter, underscore or dollar sign, cannot start with a digit, and cannot be a reserved keyword such as \`int\`, \`class\` or \`new\`. Avoid \`$\` in your own code (it is used by generated code) and avoid single-letter names except for loop counters like \`i\` and \`j\`.
Choose names that describe **meaning**, not type: \`retryCount\` is better than \`intValue\`, and \`isActive\` is better than \`flag\`.`,
      codeSnippet: `// VariablesDemo.java
public class VariablesDemo {

    // Instance variable: each object gets its own copy; defaults to 0
    int accountNumber;

    // Static variable: shared by every object; defaults to null
    static String bankName;

    // Constant: UPPER_SNAKE_CASE, assigned once
    static final double MIN_BALANCE = 1000.0;

    public static void main(String[] args) {
        int age = 24;                      // declaration + initialization
        double salary = 45000.50;
        boolean isEmployed = true;
        char grade = 'A';
        String city = "Bengaluru";         // String is a class, not a primitive

        int x, y, z;                       // multiple declarations (allowed, less readable)
        x = y = z = 10;                    // chained assignment, right to left

        // int uninitialized;              // declaring without a value is fine...
        // System.out.println(uninitialized); // ...but using it is a compile error

        {
            int blockScoped = 99;          // visible only inside these braces
            System.out.println(blockScoped);
        }
        // System.out.println(blockScoped); // compile error: cannot find symbol

        VariablesDemo demo = new VariablesDemo();
        System.out.println("Default accountNumber: " + demo.accountNumber); // 0
        System.out.println("Default bankName: " + bankName);                // null
        System.out.println(city + ", age " + age + ", grade " + grade);
    }
}
// Output:
// 99
// Default accountNumber: 0
// Default bankName: null
// Bengaluru, age 24, grade A`
    },
    {
      heading: "3. Java Primitive Data Types and Their Ranges (byte, short, int, long, float, double, char, boolean)",
      content: `Java has exactly **eight primitive types**. They are not objects: a primitive variable holds the value directly, which makes them fast and memory-efficient. Everything else in Java (\`String\`, arrays, your own classes) is a **reference type**. Memorize this table; it is asked in almost every fresher interview.
**Integer types (whole numbers, signed, two's complement):**
• \`byte\` — 8 bits, range **-128 to 127**. Used for raw binary data (file bytes, network packets), rarely for arithmetic.
• \`short\` — 16 bits, range **-32,768 to 32,767**. Rare in application code; appears in some legacy and embedded APIs.
• \`int\` — 32 bits, range **-2,147,483,648 to 2,147,483,647** (roughly ±2.14 billion). The default choice for whole numbers. Integer literals like \`42\` are \`int\` by default.
• \`long\` — 64 bits, range **-9,223,372,036,854,775,808 to 9,223,372,036,854,775,807** (roughly ±9.2 quintillion). Use for timestamps in milliseconds, file sizes, Aadhaar-style 12-digit numbers, population counts and any money amount stored in paise.
**Floating-point types (IEEE 754):**
• \`float\` — 32 bits, about **6–7 significant decimal digits**, maximum roughly 3.4 × 10^38. Literals need the \`f\` suffix: \`3.14f\`.
• \`double\` — 64 bits, about **15–16 significant decimal digits**, maximum roughly 1.8 × 10^308. The default for decimal literals like \`3.14\`. Prefer \`double\` over \`float\` unless memory is critical (graphics, large sensor arrays).
**Other types:**
• \`char\` — 16 bits, an **unsigned** UTF-16 code unit, range **0 to 65,535**. Written in single quotes: \`'A'\`. Because it is numeric underneath, \`'A' + 1\` is \`66\`.
• \`boolean\` — holds only \`true\` or \`false\`. Its size is JVM-dependent (conceptually 1 bit, practically 1 byte). Unlike C, you **cannot** use \`0\` and \`1\` as booleans.
Two facts interviewers probe: the **size of each type is fixed by the Java specification** and does not change with the operating system (unlike C's \`int\`), and **floating-point types cannot represent most decimal fractions exactly** — \`0.1 + 0.2\` prints \`0.30000000000000004\`. That is why financial code uses \`BigDecimal\` or stores money as a \`long\` number of paise.
Every primitive has \`MIN_VALUE\` and \`MAX_VALUE\` constants on its wrapper class, so you never need to memorize the exact digits in real code — but you do need to know the approximate magnitude to choose a type.`,
      codeSnippet: `// PrimitiveRanges.java
public class PrimitiveRanges {
    public static void main(String[] args) {
        byte  b = 127;                  // max byte
        short s = 32_767;               // max short
        int   i = 2_147_483_647;        // max int
        long  l = 9_223_372_036_854_775_807L;  // max long, note the L suffix
        float  f = 3.4028235e38f;       // approx max float, note the f suffix
        double d = 1.7976931348623157e308;     // approx max double
        char   c = 'A';                 // 65 underneath
        boolean flag = true;

        System.out.println("byte   : " + Byte.MIN_VALUE + " to " + Byte.MAX_VALUE);
        System.out.println("short  : " + Short.MIN_VALUE + " to " + Short.MAX_VALUE);
        System.out.println("int    : " + Integer.MIN_VALUE + " to " + Integer.MAX_VALUE);
        System.out.println("long   : " + Long.MIN_VALUE + " to " + Long.MAX_VALUE);
        System.out.println("float  : " + Float.MIN_VALUE + " to " + Float.MAX_VALUE);
        System.out.println("double : " + Double.MIN_VALUE + " to " + Double.MAX_VALUE);
        System.out.println("char   : " + (int) Character.MIN_VALUE + " to " + (int) Character.MAX_VALUE);

        System.out.println("'A' + 1 = " + (c + 1));          // 66  (int arithmetic)
        System.out.println("(char)('A' + 1) = " + (char) (c + 1)); // B
        System.out.println("0.1 + 0.2 = " + (0.1 + 0.2));    // 0.30000000000000004
        System.out.println("float precision: " + (1.0f / 3));  // 0.33333334
        System.out.println("double precision: " + (1.0 / 3));  // 0.3333333333333333
    }
}
// Output (abridged):
// byte   : -128 to 127
// short  : -32768 to 32767
// int    : -2147483648 to 2147483647
// long   : -9223372036854775808 to 9223372036854775807
// char   : 0 to 65535
// 'A' + 1 = 66
// (char)('A' + 1) = B
// 0.1 + 0.2 = 0.30000000000000004`
    },
    {
      heading: "4. Java Literals and Constants: Underscores, Binary, Hex, char Escapes and final",
      content: `A **literal** is a fixed value written directly in source code: \`42\`, \`3.14\`, \`'x'\`, \`"hello"\`, \`true\`, \`null\`. Each literal has a type, and knowing those defaults explains several compile errors beginners hit.
**Integer literals** are \`int\` by default. Writing \`long big = 3000000000;\` fails with "integer number too large" even though the target is \`long\`, because the literal itself is checked as an \`int\` first. Add the suffix: \`3000000000L\` (use uppercase \`L\`; lowercase \`l\` looks like the digit 1). Java supports four bases:
• Decimal: \`255\`
• Hexadecimal, prefix \`0x\`: \`0xFF\` — common for colours (\`0xFF5733\`), bit masks and memory addresses.
• Binary, prefix \`0b\` (**since Java 7**): \`0b11111111\` — great for teaching bitwise operators and defining permission flags.
• Octal, prefix \`0\`: \`0377\`. This is a trap: \`int pin = 0123;\` is **83**, not 123. Never write a leading zero on a decimal literal.
**Underscores in numeric literals** (**since Java 7**) make large numbers readable: \`1_00_00_000\` for one crore, \`1_000_000\` for one million, \`0b1111_0000\` for a byte mask. Rules: underscores may appear only **between digits** — not at the start or end, not next to a decimal point, not before an \`L\`/\`f\` suffix, and not right after \`0x\` or \`0b\`.
**Floating-point literals** are \`double\` by default, so \`float price = 99.99;\` is a compile error ("possible lossy conversion from double to float"). Write \`99.99f\`. Scientific notation is allowed: \`6.022e23\`, \`1e-9\`. A trailing \`d\` or \`D\` is legal but redundant.
**char literals** use single quotes and can be a plain character \`'A'\`, an escape sequence (\`'\\n'\` newline, \`'\\t'\` tab, \`'\\''\` single quote, \`'\\\\'\` backslash), or a Unicode escape \`'\\u0905'\` (the Devanagari letter अ). Since \`char\` is numeric, \`char c = 65;\` is also legal and gives \`'A'\`.
**String literals** use double quotes and are objects, not primitives. Java 15 finalized **text blocks** (\`"""\`) for multi-line strings; we will use them in the String lecture.
**Constants with final:** the \`final\` keyword means a variable can be **assigned exactly once**. A \`static final\` field is the Java idiom for a named constant such as \`GST_RATE\` or \`MAX_LOGIN_ATTEMPTS\`. Benefits: the value has a meaningful name instead of a "magic number", it is shared by all objects, and the compiler can inline primitive and String constants. Two subtleties: a **blank final** can be declared without a value and assigned later (once) in a constructor or initializer, and \`final\` on a reference variable only freezes the reference, **not** the object it points to — a \`final List\` can still have elements added. Immutability of objects is a separate topic.`,
      codeSnippet: `// LiteralsAndConstants.java
public class LiteralsAndConstants {

    // Named constants replace "magic numbers" scattered through code
    static final double GST_RATE = 0.18;
    static final int MAX_LOGIN_ATTEMPTS = 3;
    static final long ONE_CRORE = 1_00_00_000L;      // Indian digit grouping

    public static void main(String[] args) {
        int decimal = 255;
        int hex     = 0xFF;          // 255
        int binary  = 0b1111_1111;   // 255
        int octal   = 0377;          // 255 — leading zero means octal!
        int trap    = 0123;          // 83, NOT 123
        long population = 1_428_000_000L;   // L suffix needed beyond int range
        float price  = 99.99f;       // f suffix needed, 99.99 alone is a double
        double avogadro = 6.022e23;  // scientific notation
        char letterA = 'A';
        char fromCode = 65;          // also 'A'
        char devanagariA = '\\u0905'; // Unicode escape
        char tab = '\\t';

        System.out.println(decimal + " " + hex + " " + binary + " " + octal);
        System.out.println("0123 is actually " + trap);
        System.out.println("Population: " + population);
        System.out.println("GST on 1000 = " + (1000 * GST_RATE));
        System.out.println(letterA + " " + fromCode + " " + devanagariA);
        System.out.println("Hex of 255: " + Integer.toHexString(255));
        System.out.println("Binary of 255: " + Integer.toBinaryString(255));

        final int attempts = 0;
        // attempts = 1;              // compile error: cannot assign a value to final variable

        final StringBuilder sb = new StringBuilder("final ");
        sb.append("reference, mutable object");   // allowed! only the reference is final
        System.out.println(sb);
    }
}
// Output:
// 255 255 255 255
// 0123 is actually 83
// Population: 1428000000
// GST on 1000 = 180.0
// A A अ
// Hex of 255: ff
// Binary of 255: 11111111
// final reference, mutable object`
    },
    {
      heading: "5. Wrapper Classes, Autoboxing and Unboxing in Java",
      content: `Primitives are fast, but they are not objects. Java's collections framework (\`ArrayList\`, \`HashMap\`), generics (\`List<T>\`) and many library methods work only with objects. For that reason every primitive has a matching **wrapper class** in \`java.lang\`: \`Byte\`, \`Short\`, \`Integer\`, \`Long\`, \`Float\`, \`Double\`, \`Character\` and \`Boolean\`. Note the spelling: \`int\` becomes \`Integer\` and \`char\` becomes \`Character\`; the other six simply capitalize the name.
Wrapper classes give you three things primitives cannot:
• The ability to be \`null\` — useful for "value not provided yet" in databases and JSON, dangerous when forgotten.
• Storage in collections: \`List<Integer>\` works, \`List<int>\` does not compile.
• Utility methods: \`Integer.parseInt("42")\`, \`Integer.valueOf(42)\`, \`Integer.MAX_VALUE\`, \`Integer.toBinaryString(10)\`, \`Character.isDigit('7')\`, \`Double.isNaN(x)\`, \`Integer.compare(a, b)\`.
**Autoboxing** (**since Java 5**) is the compiler automatically converting a primitive to its wrapper: \`Integer count = 10;\` silently becomes \`Integer.valueOf(10)\`. **Unboxing** is the reverse: \`int n = count;\` becomes \`count.intValue()\`. This happens in assignments, method arguments, arithmetic and collection calls, which is why \`list.add(5)\` just works.
Three behaviours you must understand before an interview:
**1. The Integer cache.** \`Integer.valueOf()\` caches values from **-128 to 127**. So \`Integer a = 127, b = 127; a == b\` is \`true\` (same cached object) but \`Integer c = 128, d = 128; c == d\` is \`false\` (two different objects). Comparing wrappers with \`==\` compares references; **always use \`.equals()\`** or unbox to primitives first. \`Long\`, \`Short\`, \`Byte\` and \`Character\` (0–127) have the same cache; \`Double\` and \`Float\` have none.
**2. NullPointerException on unboxing.** If a \`Integer\` is \`null\` and you write \`int n = obj;\` or \`obj + 1\`, the JVM calls \`intValue()\` on \`null\` and throws \`NullPointerException\`. This is the number one cause of NPEs in code that maps database columns (which can be NULL) to primitive fields.
**3. Performance.** Each boxing creates an object (outside the cache). A loop that does \`Long sum = 0L; sum += i;\` a million times allocates a million \`Long\` objects. Use primitives for arithmetic and wrappers only where an object is required.
Also know the difference between \`parseInt\` and \`valueOf\`: \`Integer.parseInt("42")\` returns a primitive \`int\`; \`Integer.valueOf("42")\` returns an \`Integer\` object. Both throw \`NumberFormatException\` on bad input such as \`"42abc"\` or \`""\`.`,
      codeSnippet: `// WrapperDemo.java
import java.util.ArrayList;
import java.util.List;

public class WrapperDemo {
    public static void main(String[] args) {
        Integer boxed = 42;             // autoboxing: Integer.valueOf(42)
        int unboxed = boxed;            // unboxing: boxed.intValue()

        List<Integer> marks = new ArrayList<>();
        marks.add(88);                  // autoboxing inside a collection
        marks.add(92);
        int total = marks.get(0) + marks.get(1);   // unboxing, then int addition
        System.out.println("Total marks: " + total);

        // The Integer cache: -128 to 127 are shared objects
        Integer a = 127, b = 127;
        Integer c = 128, d = 128;
        System.out.println("127 == 127 : " + (a == b));        // true
        System.out.println("128 == 128 : " + (c == d));        // false  (different objects)
        System.out.println("128 equals : " + c.equals(d));     // true   (always use equals)

        // Utility methods
        int parsed = Integer.parseInt("2024");                  // primitive
        Integer valued = Integer.valueOf("2024");               // object
        System.out.println(parsed + 1);                         // 2025
        System.out.println(Integer.toBinaryString(10));         // 1010
        System.out.println(Character.isDigit('7'));             // true
        System.out.println(Integer.compare(5, 9));              // -1

        // NullPointerException on unboxing
        Integer fromDatabase = null;                            // e.g. a NULL column
        try {
            int age = fromDatabase;                             // calls null.intValue()
            System.out.println(age);
        } catch (NullPointerException e) {
            System.out.println("Unboxing null threw NullPointerException");
        }

        try {
            Integer.parseInt("42abc");
        } catch (NumberFormatException e) {
            System.out.println("Bad number: " + e.getMessage());
        }
    }
}
// Output:
// Total marks: 180
// 127 == 127 : true
// 128 == 128 : false
// 128 equals : true
// 2025
// 1010
// true
// -1
// Unboxing null threw NullPointerException
// Bad number: For input string: "42abc"`
    },
    {
      heading: "6. Local Variable Type Inference with var in Java (Java 10+)",
      content: `**Java 10** introduced \`var\` through **JEP 286 (Local-Variable Type Inference)**, and it has been a final, standard feature since then. With \`var\`, the compiler **infers the type from the initializer** so you do not have to repeat it: \`var customers = new ArrayList<Customer>();\` instead of \`ArrayList<Customer> customers = new ArrayList<Customer>();\`.
The most important thing to understand: **\`var\` does not make Java dynamically typed.** The type is fixed at compile time from the right-hand side and never changes. \`var count = 10;\` makes \`count\` an \`int\` forever; writing \`count = "ten";\` afterwards is a compile error exactly as it would be with \`int count\`. There is no runtime cost and no change to the generated bytecode. \`var\` is also a **reserved type name**, not a keyword, so old code that used \`var\` as a variable name still compiles.
**Where \`var\` is allowed:**
• Local variables with an initializer inside methods, constructors and initializer blocks.
• Loop variables in \`for\` and enhanced \`for\` loops: \`for (var entry : map.entrySet())\`.
• Resources in try-with-resources: \`try (var in = new FileInputStream(path))\`.
• Lambda parameters (**since Java 11**, JEP 323): \`(var x, var y) -> x + y\`, mainly so you can attach annotations to them.
**Where \`var\` is NOT allowed:**
• Fields, method parameters and return types — the type must be visible in the API.
• Declarations without an initializer: \`var x;\` is an error.
• Initializing with \`null\`: \`var x = null;\` is an error because there is nothing to infer.
• Array initializers without a type: \`var arr = {1, 2, 3};\` is an error; write \`var arr = new int[]{1, 2, 3};\`.
• Lambdas or method references on the right side without a target type: \`var f = () -> 5;\` is an error.
**Inference details that surprise people:** \`var n = 10;\` is \`int\`, not \`Integer\` or \`long\`. \`var price = 9.99;\` is \`double\`. \`var list = new ArrayList<>();\` infers \`ArrayList<Object>\`, which is rarely what you want — put the type argument on the right side. Also, \`var\` always infers the **concrete** type of the initializer, so \`var list = new ArrayList<String>();\` has type \`ArrayList<String>\`, not \`List<String>\`; if you want to program to the interface, declare it explicitly.
**Style guidance (from the official JDK style guidelines):** use \`var\` when the type is obvious from the right-hand side (constructors, factory methods like \`Path.of(...)\`, literals) or when the explicit type is noisy (nested generics, iterator types). Avoid \`var\` when the initializer hides the type, such as \`var result = service.process();\` — the reader cannot tell what \`result\` is without opening another file.`,
      codeSnippet: `// VarDemo.java
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class VarDemo {
    public static void main(String[] args) {
        var count = 10;                       // inferred as int
        var price = 499.0;                    // inferred as double
        var city = "Hyderabad";               // inferred as String
        var names = new ArrayList<String>();  // inferred as ArrayList<String>
        var stock = new HashMap<String, Integer>();

        names.add("Asha");
        names.add("Rohit");
        stock.put("Laptop", 12);
        stock.put("Mouse", 150);

        count = count + 5;                    // still an int, arithmetic works
        // count = "fifteen";                 // compile error: incompatible types

        for (var name : names) {              // var in enhanced for loop
            System.out.println("Hello, " + name);
        }

        for (var entry : stock.entrySet()) {  // saves typing Map.Entry<String, Integer>
            System.out.println(entry.getKey() + " -> " + entry.getValue());
        }

        // Not allowed (uncomment to see the compile errors):
        // var nothing;                 // cannot infer type
        // var unknown = null;          // cannot infer type
        // var arr = {1, 2, 3};         // array initializer needs explicit type
        // var fn = () -> 42;           // lambda needs an explicit target type

        var okArray = new int[]{1, 2, 3};     // fine: type is on the right
        System.out.println(okArray.length + " " + count + " " + price + " " + city);
    }
}
// Output:
// Hello, Asha
// Hello, Rohit
// Laptop -> 12
// Mouse -> 150
// 3 15 499.0 Hyderabad`
    },
    {
      heading: "7. Arithmetic Operators, Integer Division, Modulus and Integer Overflow in Java",
      content: `Java's arithmetic operators are \`+\`, \`-\`, \`*\`, \`/\` and \`%\`, plus the unary \`++\`, \`--\`, \`+\` and \`-\`. They look identical to school mathematics, and that similarity hides three behaviours that cause real bugs.
**1. Integer division truncates toward zero.** When **both** operands are integer types, \`/\` throws away the fractional part: \`7 / 2\` is \`3\`, \`-7 / 2\` is \`-3\` (not -4), and \`1 / 2\` is \`0\`. The classic bug: \`double percentage = marks / total * 100;\` prints \`0.0\` when \`marks\` and \`total\` are \`int\`, because \`marks / total\` is computed as an integer first. Fix it by making one operand a double: \`marks * 100.0 / total\` or \`(double) marks / total\`. If **either** operand is floating-point, the whole operation is floating-point.
**2. The modulus operator \`%\` returns the remainder, and its sign follows the dividend (left operand).** \`7 % 3\` is \`1\`, \`-7 % 3\` is \`-1\`, \`7 % -3\` is \`1\`. For a mathematically correct non-negative result (needed for circular buffers, clock arithmetic, hashing) use \`Math.floorMod(-7, 3)\`, which returns \`2\`. \`%\` also works on doubles: \`7.5 % 2\` is \`1.5\`. The common uses are checking even/odd (\`n % 2 == 0\`), extracting the last digit (\`n % 10\`), and wrapping an index (\`(i + 1) % length\`).
**3. Division by zero behaves differently for integers and floating-point.** \`10 / 0\` throws \`ArithmeticException: / by zero\` at runtime. \`10.0 / 0\` returns \`Infinity\`, \`-10.0 / 0\` returns \`-Infinity\` and \`0.0 / 0\` returns \`NaN\` (Not a Number) — no exception. \`NaN\` is not equal to anything, even itself, so test it with \`Double.isNaN(x)\`.
**Increment and decrement:** \`++i\` (prefix) increments first and then yields the new value; \`i++\` (postfix) yields the old value and then increments. In a statement by itself there is no difference; inside a larger expression there is. Interview puzzle: \`int i = 5; int j = i++ + ++i;\` gives \`j = 12\` (5 + 7) and \`i = 7\`.
**Compound assignment** (\`+=\`, \`-=\`, \`*=\`, \`/=\`, \`%=\`) has a hidden cast: \`a += b\` means \`a = (TypeOfA)(a + b)\`. That is why \`byte b = 10; b += 5;\` compiles while \`b = b + 5;\` does not (the second is an \`int\` expression assigned to a \`byte\`).
**Integer overflow** is the most dangerous behaviour. Java integers are fixed-width and **wrap around silently** — there is no exception and no warning. \`Integer.MAX_VALUE + 1\` is \`-2147483648\`. \`Math.abs(Integer.MIN_VALUE)\` is still negative. A famous real-world case: multiplying \`days * 24 * 60 * 60 * 1000\` to get milliseconds overflows \`int\` after just 24 days. Defences: use \`long\` when values can exceed about 2 billion, put the \`L\` suffix on at least one literal so the multiplication happens in \`long\`, and in money or security-sensitive code use the **exact** methods added in Java 8 — \`Math.addExact\`, \`Math.subtractExact\`, \`Math.multiplyExact\`, \`Math.toIntExact\` — which throw \`ArithmeticException\` instead of wrapping. For arbitrary size use \`BigInteger\`.`,
      codeSnippet: `// ArithmeticDemo.java
public class ArithmeticDemo {
    public static void main(String[] args) {
        int marks = 45, total = 60;

        System.out.println("7 / 2 = " + (7 / 2));            // 3   (integer division)
        System.out.println("-7 / 2 = " + (-7 / 2));          // -3  (truncates toward zero)
        System.out.println("7 / 2.0 = " + (7 / 2.0));        // 3.5 (one double operand)
        System.out.println("Wrong %: " + (marks / total * 100));          // 0
        System.out.println("Right %: " + (marks * 100.0 / total));        // 75.0

        System.out.println("7 % 3 = " + (7 % 3));            // 1
        System.out.println("-7 % 3 = " + (-7 % 3));          // -1 (sign of dividend)
        System.out.println("floorMod(-7, 3) = " + Math.floorMod(-7, 3)); // 2
        System.out.println("Last digit of 2026: " + (2026 % 10));        // 6

        System.out.println("10.0 / 0 = " + (10.0 / 0));      // Infinity
        System.out.println("0.0 / 0 = " + (0.0 / 0));        // NaN
        try {
            System.out.println(10 / 0);
        } catch (ArithmeticException e) {
            System.out.println("10 / 0 -> " + e.getMessage()); // / by zero
        }

        int i = 5;
        int j = i++ + ++i;                                   // 5 + 7
        System.out.println("i = " + i + ", j = " + j);       // i = 7, j = 12

        byte b = 10;
        b += 5;                     // compiles: hidden cast to byte
        // b = b + 5;               // compile error: int cannot be assigned to byte
        System.out.println("b = " + b);

        // Silent overflow
        int max = Integer.MAX_VALUE;
        System.out.println("MAX + 1 = " + (max + 1));                       // -2147483648
        System.out.println("abs(MIN) = " + Math.abs(Integer.MIN_VALUE));    // -2147483648
        int days = 30;
        System.out.println("30 days in ms (int)  = " + (days * 24 * 60 * 60 * 1000)); // wrong
        System.out.println("30 days in ms (long) = " + (days * 24L * 60 * 60 * 1000)); // right

        try {
            Math.multiplyExact(days, 24 * 60 * 60 * 1000);  // detects overflow
        } catch (ArithmeticException e) {
            System.out.println("multiplyExact -> " + e.getMessage()); // integer overflow
        }
    }
}
// Output (abridged):
// 7 / 2 = 3
// -7 / 2 = -3
// 7 / 2.0 = 3.5
// Wrong %: 0
// Right %: 75.0
// floorMod(-7, 3) = 2
// 10.0 / 0 = Infinity
// 0.0 / 0 = NaN
// 10 / 0 -> / by zero
// i = 7, j = 12
// MAX + 1 = -2147483648
// 30 days in ms (int)  = -1702967296
// 30 days in ms (long) = 2592000000
// multiplyExact -> integer overflow`
    },
    {
      heading: "8. Relational, Logical and Ternary Operators in Java",
      content: `**Relational (comparison) operators** compare two values and always produce a \`boolean\`: \`==\`, \`!=\`, \`<\`, \`>\`, \`<=\`, \`>=\`. They work on all numeric types and \`char\` (which compares Unicode values, so \`'a' > 'A'\` is \`true\`). \`==\` and \`!=\` also work on \`boolean\` and on references, where they compare **identity** (same object), not content. For \`String\`, \`Integer\` and every other object, use \`.equals()\` to compare content. The \`"hello" == "hello"\` case appears to work because of the String pool, which makes it an even more dangerous habit; the String lecture covers that in depth.
**Logical operators** combine booleans:
• \`&&\` (AND) — true only if both sides are true.
• \`||\` (OR) — true if either side is true.
• \`!\` (NOT) — flips the value.
• \`^\` (XOR) — true if exactly one side is true.
\`&&\` and \`||\` are **short-circuit** operators: if the left side already decides the result, the right side is **not evaluated at all**. This is not just an optimization; it is how you write safe null checks: \`if (name != null && name.length() > 3)\` never calls \`length()\` on \`null\`. The non-short-circuit versions \`&\` and \`|\` also work on booleans but **always evaluate both sides** — use them only when the right side has a side effect you need, which is rare and usually a code smell.
**The ternary (conditional) operator** \`condition ? valueIfTrue : valueIfFalse\` is the only Java operator with three operands. It is an **expression**, so it produces a value and can be used anywhere a value is expected: assignments, return statements, method arguments, string concatenation. Use it for simple two-way choices such as \`String label = age >= 18 ? "Adult" : "Minor";\`. Avoid nesting ternaries more than one level — \`a ? b : c ? d : e\` is legal but unreadable; use \`if-else\` or, from Java 14 onwards, a \`switch\` expression (next lecture).
Two subtle rules: both branches must produce compatible types, and if they are different numeric types Java applies **binary numeric promotion**. So \`Object o = true ? 1 : 2.0;\` stores \`1.0\`, not \`1\`, because the \`int\` is promoted to \`double\` to match the other branch. Also, a ternary that mixes an \`Integer\` and an \`int\` unboxes the \`Integer\` — if it is \`null\`, you get a \`NullPointerException\` even if that branch is not selected.`,
      codeSnippet: `// LogicalDemo.java
public class LogicalDemo {
    static boolean expensiveCheck() {
        System.out.println("  expensiveCheck() was called");
        return true;
    }

    public static void main(String[] args) {
        int age = 20;
        double balance = 2500.0;
        String name = null;

        System.out.println(age >= 18 && balance > 1000);   // true
        System.out.println(age < 18 || balance > 1000);    // true
        System.out.println(!(age >= 18));                  // false
        System.out.println(true ^ true);                   // false (XOR)
        System.out.println('a' > 'A');                     // true (97 > 65)

        // Short-circuit protects against NullPointerException
        if (name != null && name.length() > 3) {
            System.out.println("Long name");
        } else {
            System.out.println("Name is null or short");   // length() never called
        }

        System.out.println("Short-circuit && :");
        boolean r1 = false && expensiveCheck();            // right side skipped
        System.out.println("Non-short-circuit & :");
        boolean r2 = false & expensiveCheck();             // right side evaluated
        System.out.println(r1 + " " + r2);

        // Ternary operator
        String category = age >= 60 ? "Senior" : age >= 18 ? "Adult" : "Minor";
        System.out.println("Category: " + category);
        int fare = balance > 1000 ? 50 : 20;
        System.out.println("Fare: " + fare);

        // Numeric promotion inside ternary
        Object o = true ? 1 : 2.0;
        System.out.println("true ? 1 : 2.0 gives " + o);   // 1.0, not 1

        // Reference comparison vs equals
        String s1 = new String("Delhi");
        String s2 = new String("Delhi");
        System.out.println(s1 == s2);        // false (different objects)
        System.out.println(s1.equals(s2));   // true  (same content)
    }
}
// Output:
// true
// true
// false
// false
// true
// Name is null or short
// Short-circuit && :
// Non-short-circuit & :
//   expensiveCheck() was called
// false false
// Category: Adult
// Fare: 50
// true ? 1 : 2.0 gives 1.0
// false
// true`
    },
    {
      heading: "9. Bitwise and Shift Operators in Java",
      content: `**Bitwise operators** work on the individual binary digits of integer types (\`int\` and \`long\`; smaller types are promoted to \`int\` first). They appear less often in business code but are essential for permissions and feature flags, networking, image processing, compression, hashing, competitive programming and many interview puzzles.
The operators:
• \`&\` AND — bit is 1 only if both bits are 1. \`12 & 10\` = \`1100 & 1010\` = \`1000\` = \`8\`.
• \`|\` OR — bit is 1 if either bit is 1. \`12 | 10\` = \`1110\` = \`14\`.
• \`^\` XOR — bit is 1 if the bits differ. \`12 ^ 10\` = \`0110\` = \`6\`.
• \`~\` NOT (complement) — flips every bit. \`~12\` = \`-13\` (because of two's complement, \`~n\` is always \`-n - 1\`).
• \`<<\` left shift — shifts bits left, filling with zeros; each shift multiplies by 2. \`5 << 2\` = \`20\`.
• \`>>\` signed (arithmetic) right shift — shifts right, filling with the **sign bit**, so negative numbers stay negative; each shift divides by 2 rounding toward negative infinity. \`-8 >> 1\` = \`-4\`.
• \`>>>\` unsigned (logical) right shift — shifts right, filling with **zeros**, so a negative number becomes a large positive one. \`-8 >>> 1\` = \`2147483644\`. Java has \`>>>\` because, unlike C, all Java integer types are signed.
Shift distance is taken modulo 32 for \`int\` and modulo 64 for \`long\`, so \`1 << 33\` is the same as \`1 << 1\` = \`2\` — a classic trick question.
**Practical patterns you will actually use:**
• **Even/odd check:** \`(n & 1) == 0\` is even. Slightly faster than \`%\` and the standard idiom in low-level code.
• **Permission flags:** define \`READ = 1\`, \`WRITE = 2\`, \`EXECUTE = 4\` (powers of two), combine with \`|\`, test with \`&\`, remove with \`& ~FLAG\`. Linux file permissions, Android view flags and Java's own \`Modifier\` class all work this way.
• **Fast multiply/divide by powers of two:** \`n << 3\` is \`n * 8\`. The JIT compiler does this optimization automatically, so write \`n * 8\` for readability unless you are deliberately working in bits.
• **Extracting bytes:** \`(colour >> 16) & 0xFF\` pulls the red channel out of an RGB integer.
• **XOR tricks:** \`a ^ a\` is \`0\` and \`a ^ 0\` is \`a\`, which is why XOR-ing all elements of an array finds the single non-repeated number — a very common coding-round question.
To see what is happening, print values with \`Integer.toBinaryString(n)\`; for negative numbers it shows all 32 bits of the two's complement representation.`,
      codeSnippet: `// BitwiseDemo.java
public class BitwiseDemo {
    static final int READ = 1;      // 001
    static final int WRITE = 2;     // 010
    static final int EXECUTE = 4;   // 100

    public static void main(String[] args) {
        int a = 12, b = 10;         // 1100 and 1010
        System.out.println("a & b  = " + (a & b));    // 8   (1000)
        System.out.println("a | b  = " + (a | b));    // 14  (1110)
        System.out.println("a ^ b  = " + (a ^ b));    // 6   (0110)
        System.out.println("~a     = " + (~a));       // -13
        System.out.println("5 << 2 = " + (5 << 2));   // 20
        System.out.println("-8 >> 1  = " + (-8 >> 1));    // -4
        System.out.println("-8 >>> 1 = " + (-8 >>> 1));   // 2147483644
        System.out.println("1 << 33  = " + (1 << 33));    // 2  (shift distance mod 32)

        System.out.println("Binary of 12 : " + Integer.toBinaryString(12));
        System.out.println("Binary of -8 : " + Integer.toBinaryString(-8));

        // Permission flags
        int perms = READ | WRITE;                          // 011 = 3
        System.out.println("Can write?   " + ((perms & WRITE) != 0));    // true
        System.out.println("Can execute? " + ((perms & EXECUTE) != 0));  // false
        perms |= EXECUTE;                                  // grant execute -> 111
        perms &= ~WRITE;                                   // revoke write   -> 101
        System.out.println("perms = " + perms);            // 5

        // Even/odd and RGB extraction
        System.out.println("17 is even? " + ((17 & 1) == 0));            // false
        int colour = 0xFF5733;
        int red = (colour >> 16) & 0xFF, green = (colour >> 8) & 0xFF, blue = colour & 0xFF;
        System.out.println("RGB = " + red + ", " + green + ", " + blue); // 255, 87, 51

        // XOR trick: find the element that appears once
        int[] arr = {4, 7, 4, 9, 7};
        int single = 0;
        for (int n : arr) single ^= n;
        System.out.println("Single element: " + single);               // 9
    }
}
// Output:
// a & b  = 8
// a | b  = 14
// a ^ b  = 6
// ~a     = -13
// 5 << 2 = 20
// -8 >> 1  = -4
// -8 >>> 1 = 2147483644
// 1 << 33  = 2
// Binary of 12 : 1100
// Binary of -8 : 11111111111111111111111111111000
// Can write?   true
// Can execute? false
// perms = 5
// 17 is even? false
// RGB = 255, 87, 51
// Single element: 9`
    },
    {
      heading: "10. Java Operator Precedence and Associativity Explained",
      content: `When an expression contains several operators, **precedence** decides which operator binds tighter, and **associativity** decides the order among operators of the same level. Getting this wrong produces code that compiles perfectly and computes the wrong answer. Here is the Java precedence table from highest to lowest; you do not need to memorize every row, but you must know the groups and the famous traps.
• **1. Postfix:** \`expr++\`, \`expr--\`
• **2. Unary:** \`++expr\`, \`--expr\`, \`+\`, \`-\`, \`!\`, \`~\`, and casts \`(type)\`
• **3. Multiplicative:** \`*\`, \`/\`, \`%\`
• **4. Additive:** \`+\`, \`-\`
• **5. Shift:** \`<<\`, \`>>\`, \`>>>\`
• **6. Relational:** \`<\`, \`>\`, \`<=\`, \`>=\`, \`instanceof\`
• **7. Equality:** \`==\`, \`!=\`
• **8. Bitwise AND:** \`&\`
• **9. Bitwise XOR:** \`^\`
• **10. Bitwise OR:** \`|\`
• **11. Logical AND:** \`&&\`
• **12. Logical OR:** \`||\`
• **13. Ternary:** \`? :\`
• **14. Assignment:** \`=\`, \`+=\`, \`-=\`, \`*=\`, \`/=\`, \`%=\`, \`&=\`, \`|=\`, \`^=\`, \`<<=\`, \`>>=\`, \`>>>=\`
**Associativity:** almost everything is **left-to-right**, so \`100 / 10 / 2\` is \`(100 / 10) / 2 = 5\`, not \`100 / (10 / 2) = 20\`. The exceptions are **unary operators, casts, the ternary operator and assignment**, which are **right-to-left**: \`a = b = c = 5\` assigns 5 to \`c\`, then to \`b\`, then to \`a\`.
**Traps interviewers love:**
• \`a + b / 2\` is \`a + (b / 2)\`. To average two numbers you need \`(a + b) / 2\`.
• A cast binds tighter than arithmetic: \`(int) 3.7 + 1.5\` is \`3 + 1.5 = 4.5\`, whereas \`(int) (3.7 + 1.5)\` is \`5\`.
• Bitwise operators have **lower** precedence than comparison: \`flags & MASK == 0\` is parsed as \`flags & (MASK == 0)\`, which is a compile error (int & boolean). Always write \`(flags & MASK) == 0\`.
• String concatenation is just \`+\` at the additive level, evaluated left to right: \`"Sum: " + 1 + 2\` is \`"Sum: 12"\`, while \`"Sum: " + (1 + 2)\` is \`"Sum: 3"\` and \`1 + 2 + "Sum"\` is \`"3Sum"\`.
• Operands are evaluated left to right **before** precedence applies the operators, which is why \`int i = 5; i = i++ + ++i;\` yields 12.
**Practical rule:** when an expression mixes more than two levels of the table, add parentheses even when they are technically unnecessary. Parentheses cost nothing at runtime and save your reviewer (and future you) from re-deriving the table.`,
      codeSnippet: `// PrecedenceDemo.java
public class PrecedenceDemo {
    public static void main(String[] args) {
        int a = 10, b = 4;

        System.out.println(a + b / 2);          // 12  : a + (b / 2)
        System.out.println((a + b) / 2);        // 7   : average
        System.out.println(100 / 10 / 2);       // 5   : left-to-right
        System.out.println(2 + 3 * 4 - 1);      // 13
        System.out.println((int) 3.7 + 1.5);    // 4.5 : cast binds first
        System.out.println((int) (3.7 + 1.5));  // 5

        System.out.println("Sum: " + 1 + 2);    // Sum: 12
        System.out.println("Sum: " + (1 + 2));  // Sum: 3
        System.out.println(1 + 2 + "Sum");      // 3Sum

        int flags = 0b0110, mask = 0b0010;
        // System.out.println(flags & mask == 0);   // compile error: int & boolean
        System.out.println((flags & mask) == 0);    // false

        int x, y, z;
        x = y = z = 7;                          // right-to-left assignment
        System.out.println(x + y + z);          // 21

        int i = 5;
        i = i++ + ++i;                          // operands: 5, then 7
        System.out.println("i = " + i);         // 12

        boolean result = a > 5 && b < 5 || a == 0;   // (a>5 && b<5) || (a==0)
        System.out.println(result);             // true
        System.out.println(-a * b % 3);         // (-10 * 4) % 3 = -40 % 3 = -1
    }
}
// Output:
// 12
// 7
// 5
// 13
// 4.5
// 5
// Sum: 12
// Sum: 3
// 3Sum
// false
// 21
// i = 12
// true
// -1`
    },
    {
      heading: "11. Type Casting in Java: Implicit Widening vs Explicit Narrowing Conversion",
      content: `**Type casting** (type conversion) is converting a value from one type to another. Java has two kinds for primitives, and the distinction is one of the most reliably asked interview topics.
**Implicit casting (widening conversion)** happens automatically when you move a value to a type that can hold **every** value of the source type, so nothing is lost in range. The widening chain is:
**byte → short → int → long → float → double**, and separately **char → int** (and onward). The compiler inserts these silently: \`long big = 42;\`, \`double d = 'A';\` (gives 65.0), \`float f = 100L;\`. A method that takes a \`double\` will happily accept an \`int\` argument.
Two surprises inside widening: \`long → float\` and \`int → float\` are allowed even though they can lose **precision** (a \`float\` has only 24 bits of mantissa, so \`16777217\` becomes \`16777216.0f\`), because no **magnitude** is lost. Also, \`byte\`, \`short\` and \`char\` do not widen to each other: \`char c = someByte;\` and \`short s = someChar;\` are both compile errors because \`char\` is unsigned and the others are signed.
**Explicit casting (narrowing conversion)** is required when the target type is smaller or cannot represent every source value. You write the target type in parentheses: \`int n = (int) 3.99;\`. The compiler trusts you, so **you** are responsible for the consequences:
• \`double → int\` **truncates toward zero**, it does not round: \`(int) 3.99\` is \`3\`, \`(int) -3.99\` is \`-3\`. To round, use \`Math.round(3.99)\` (returns \`long\` for a \`double\`, \`int\` for a \`float\`).
• \`int → byte\` keeps only the **low 8 bits**, so the value wraps: \`(byte) 200\` is \`-56\`, \`(byte) 300\` is \`44\`, \`(byte) 128\` is \`-128\`. Same idea for \`long → int\` (low 32 bits kept).
• Out-of-range \`double → int\` **saturates**: \`(int) 1e20\` is \`Integer.MAX_VALUE\`, \`(int) -1e20\` is \`Integer.MIN_VALUE\`, and \`(int) Double.NaN\` is \`0\`. Note that \`double → long → int\` and \`double → int\` can give **different** results for huge values, which is why the JLS defines the direct conversion precisely.
• \`int → char\`: \`(char) 66\` is \`'B'\`; \`(char) 2325\` is \`'क'\`.
**Three places casting hides:**
• **Binary numeric promotion:** in any arithmetic, operands smaller than \`int\` are promoted to \`int\`, and if either operand is \`long\`/\`float\`/\`double\` both are promoted to that. So \`byte + byte\` is an \`int\`, and \`short s = 1; s = s + 1;\` fails to compile — you need \`s = (short) (s + 1)\` or \`s += 1\`.
• **Compound assignment** silently casts: \`s += 1\` is \`s = (short) (s + 1)\`.
• **Constant expressions** get a special rule: \`byte b = 100;\` compiles without a cast because the compiler can prove the constant fits, but \`int n = 100; byte b = n;\` does not.
Finally, **casting is not parsing**. \`(int) "42"\` is a compile error because \`String\` is not a numeric type. Convert text with \`Integer.parseInt("42")\` and numbers to text with \`String.valueOf(42)\` or \`Integer.toString(42)\`. Casting between **object** types (\`(Dog) animal\`) is a different mechanism tied to inheritance and is covered in the OOP lectures.`,
      codeSnippet: `// CastingDemo.java
public class CastingDemo {
    public static void main(String[] args) {
        // ---- Implicit widening: no cast needed, no data lost in range ----
        int i = 100;
        long l = i;                 // int -> long
        float f = l;                // long -> float (precision may drop)
        double d = f;               // float -> double
        double fromChar = 'A';      // char -> double = 65.0
        System.out.println(l + " " + f + " " + d + " " + fromChar);
        System.out.println("16777217 as float = " + (float) 16777217);  // 1.6777216E7

        // ---- Explicit narrowing: cast required, data may be lost ----
        double price = 3.99;
        int truncated = (int) price;          // 3  (truncation, not rounding)
        long rounded = Math.round(price);     // 4
        int negative = (int) -3.99;           // -3 (toward zero)
        System.out.println(truncated + " " + rounded + " " + negative);

        byte b1 = (byte) 200;                 // -56  (low 8 bits of 11001000)
        byte b2 = (byte) 300;                 // 44   (300 - 256)
        byte b3 = (byte) 128;                 // -128
        System.out.println(b1 + " " + b2 + " " + b3);

        int saturated = (int) 1e20;           // 2147483647 (Integer.MAX_VALUE)
        int fromNaN = (int) Double.NaN;       // 0
        int lowBits = (int) 4_294_967_297L;   // 1  (low 32 bits)
        System.out.println(saturated + " " + fromNaN + " " + lowBits);

        char letter = (char) 66;              // B
        char hindi = (char) 2325;             // क
        System.out.println(letter + " " + hindi);

        // ---- Hidden promotions ----
        byte x = 10, y = 20;
        // byte sum = x + y;                  // compile error: byte + byte is int
        byte sum = (byte) (x + y);            // 30
        short s = 1;
        // s = s + 1;                         // compile error
        s += 1;                               // hidden cast, compiles
        byte constantFits = 100;              // allowed: compile-time constant fits
        System.out.println(sum + " " + s + " " + constantFits);

        // ---- Casting is not parsing ----
        // int wrong = (int) "42";            // compile error
        int parsed = Integer.parseInt("42");  // 42
        String text = String.valueOf(42) + "0";
        System.out.println(parsed + 1 + " " + text);   // 43 420
    }
}
// Output:
// 100 100.0 100.0 65.0
// 16777217 as float = 1.6777216E7
// 3 4 -3
// -56 44 -128
// 2147483647 0 1
// B क
// 30 2 100
// 43 420`
    },
    {
      heading: "12. Reading User Input with Scanner in Java",
      content: `Programs become interesting when they react to input. The standard beginner-to-intermediate tool for console input is \`java.util.Scanner\`, which wraps an input source (\`System.in\` for the keyboard, but also a \`File\` or a \`String\`) and parses **tokens** separated by whitespace.
Create one with \`Scanner sc = new Scanner(System.in);\` and read with the typed methods:
• \`nextInt()\`, \`nextLong()\`, \`nextDouble()\`, \`nextBoolean()\` — read one token and parse it; throw \`InputMismatchException\` if the token is not a valid value of that type (for example typing \`abc\` when \`nextInt()\` is waiting).
• \`next()\` — read one whitespace-delimited word as a \`String\`.
• \`nextLine()\` — read everything up to the end of the current line, including spaces, and consume the newline.
• \`hasNextInt()\`, \`hasNextDouble()\`, \`hasNext()\` — peek at the next token so you can validate before reading.
**The newline trap** is the single most common Scanner bug, and it appears in every first-year lab: after \`int age = sc.nextInt();\` the user pressed Enter, and that newline character is **still waiting in the buffer** because \`nextInt()\` reads only the digits. A following \`String name = sc.nextLine();\` returns an **empty string** immediately, consuming just the leftover newline. Fix: call \`sc.nextLine()\` once to discard the leftover line before reading the real one, or read everything with \`nextLine()\` and parse with \`Integer.parseInt()\`.
**Validation:** never trust input. Use \`hasNextInt()\` in a loop to re-prompt, or catch \`InputMismatchException\`. After a failed \`nextInt()\` the bad token is still in the buffer, so call \`sc.next()\` to throw it away before trying again.
**Closing:** call \`sc.close()\` when you are completely done. Be aware that closing a \`Scanner\` on \`System.in\` also closes \`System.in\` for the rest of the program, so create **one** \`Scanner\` per program and share it; do not create and close a new one in every method.
**Alternatives:** for competitive programming and large inputs, \`BufferedReader\` with \`InputStreamReader\` is several times faster than \`Scanner\` because it does no regex-based tokenizing. And **Java 25 finalized JEP 512 (Compact Source Files and Instance Main Methods)**, which added the \`java.lang.IO\` class with \`IO.println(...)\` and \`IO.readln("prompt")\` for simple console programs without any imports. It is great for quick scripts, but \`Scanner\` remains the tool you must know for exams, interviews and older codebases, so we use it throughout this course.`,
      codeSnippet: `// ScannerDemo.java
import java.util.InputMismatchException;
import java.util.Scanner;

public class ScannerDemo {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Enter your age: ");
        int age = sc.nextInt();             // reads "24", leaves the newline behind
        sc.nextLine();                      // discard the leftover newline (the trap!)

        System.out.print("Enter your full name: ");
        String fullName = sc.nextLine();    // now correctly reads "Ravindra Nath Jha"

        System.out.print("Enter your city (one word): ");
        String city = sc.next();            // reads a single token

        // Validated numeric input with re-prompt
        double salary;
        while (true) {
            System.out.print("Enter monthly salary: ");
            if (sc.hasNextDouble()) {
                salary = sc.nextDouble();
                break;
            }
            System.out.println("That is not a number, try again.");
            sc.next();                      // throw away the bad token
        }

        // Same idea using exceptions
        int pin = 0;
        try {
            System.out.print("Enter 4-digit PIN: ");
            pin = sc.nextInt();
        } catch (InputMismatchException e) {
            System.out.println("PIN must be numeric.");
        }

        System.out.println();
        System.out.println("Name   : " + fullName);
        System.out.println("Age    : " + age + (age >= 18 ? " (adult)" : " (minor)"));
        System.out.println("City   : " + city);
        System.out.printf("Salary : Rs %.2f per month%n", salary);
        System.out.println("PIN ok : " + (pin >= 1000 && pin <= 9999));

        sc.close();   // only once, at the very end
    }
}
// Sample session:
// Enter your age: 24
// Enter your full name: Ravindra Nath Jha
// Enter your city (one word): Patna
// Enter monthly salary: abc
// That is not a number, try again.
// Enter monthly salary: 45000.50
// Enter 4-digit PIN: 1234
//
// Name   : Ravindra Nath Jha
// Age    : 24 (adult)
// City   : Patna
// Salary : Rs 45000.50 per month
// PIN ok : true`
    },
    {
      heading: "13. Real-World Use Cases: How Data Types, Operators and Casting Are Used in Production",
      content: `These topics sound academic until you see how often they decide whether production code is correct. Here is how experienced Java developers apply them in real systems.
**Money is never a double.** Every payments team learns this once. \`0.1 + 0.2 != 0.3\` means that adding up a cart of items in \`double\` can be off by a paisa, and a paisa across ten million UPI transactions is a reconciliation nightmare. Production code stores amounts as a \`long\` number of **paise** (\`4999900L\` for ₹49,999.00) and converts to rupees only for display, or uses \`java.math.BigDecimal\` with an explicit \`RoundingMode\`. Interest and tax calculations use \`BigDecimal\` with scale 2 or 4.
**Identifiers are long, not int.** A database auto-increment primary key passes 2.1 billion sooner than you think (Twitter tweet IDs crossed the \`int\` limit in 2009). Aadhaar numbers have 12 digits, mobile numbers have 10, order numbers often embed timestamps. All of these need \`long\` or \`String\` (if arithmetic is never performed on them, a phone number should be a \`String\` — leading zeros and country codes are data, not digits).
**Time is a long.** \`System.currentTimeMillis()\` returns milliseconds since 1 January 1970 as a \`long\`; a 32-bit value would have overflowed in 1970 itself. Timeouts, TTLs and cache expiry are typically \`long\` milliseconds or \`java.time.Duration\`. The "30 days in milliseconds" overflow from Section 7 has shipped to production in more than one company.
**Flags and permissions use bitwise operators.** Linux file modes, Spring Security's bitmask-style permission ACLs, Android's \`View\` flags and the JDK's own \`java.lang.reflect.Modifier\` all pack many booleans into one \`int\`. One \`int\` column in a database can store 32 independent on/off settings, and checking one is a single \`&\`.
**Configuration lives in final constants** (or better, an enum or a config file): \`static final int MAX_RETRIES = 3;\`, \`static final Duration CONNECT_TIMEOUT = Duration.ofSeconds(5);\`. The compiler inlines primitive constants, and reviewers can change a policy in one place.
**Wrappers at the boundaries, primitives inside.** JPA entity fields mapped to nullable columns are declared \`Integer\` or \`Long\` so that NULL can be represented; JSON DTOs likewise. Internal services then unbox once, with an explicit null check or \`Objects.requireNonNullElse(value, 0)\`, and do arithmetic in primitives.
**Casting appears in every data pipeline.** Reading a CSV gives you strings, so you parse (\`Long.parseLong\`), validate the range, and only then narrow. Sensor data from IoT devices arrives as \`float\` to save bandwidth and is widened to \`double\` for calculation. Image libraries pull colour channels with shifts and masks exactly like Section 9.
**Scanner and input parsing** show up in CLI tools, batch jobs that read parameters, coding-round solutions and every automation script a support engineer writes. Knowing \`hasNextInt()\` and the newline trap separates a tool that works from a tool that eats the first line of its own input.`,
      codeSnippet: `// ProductionPatterns.java — idioms you will see in real codebases
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Objects;

public class ProductionPatterns {
    static final int MAX_RETRIES = 3;
    static final long MS_PER_DAY = 24L * 60 * 60 * 1000;   // L on the first literal

    // Money as paise (long) - exact, fast, no rounding drift
    static long applyGstPaise(long amountPaise, int gstPercent) {
        return Math.addExact(amountPaise, amountPaise * gstPercent / 100);
    }

    // Money as BigDecimal - exact with explicit rounding
    static BigDecimal applyGst(BigDecimal amount, BigDecimal rate) {
        return amount.multiply(BigDecimal.ONE.add(rate)).setScale(2, RoundingMode.HALF_UP);
    }

    public static void main(String[] args) {
        // 1. Why double fails for money
        double cart = 0.1 + 0.2;
        System.out.println("double cart total = " + cart);                 // 0.30000000000000004
        System.out.println("paise total       = " + (10L + 20L) + " paise");

        // 2. GST on Rs 49,999.00
        long pricePaise = 4_999_900L;
        long withGst = applyGstPaise(pricePaise, 18);
        System.out.println("With 18% GST: Rs " + withGst / 100 + "." + String.format("%02d", withGst % 100));
        System.out.println("BigDecimal   : Rs " + applyGst(new BigDecimal("49999.00"), new BigDecimal("0.18")));

        // 3. Timestamps and durations are long
        long now = System.currentTimeMillis();
        long expiry = now + 30 * MS_PER_DAY;                               // no overflow
        System.out.println("Cache expires after 30 days: " + (expiry > now));

        // 4. Nullable wrapper from a database row -> safe primitive
        Integer loyaltyPointsFromDb = null;
        int points = Objects.requireNonNullElse(loyaltyPointsFromDb, 0);
        System.out.println("Loyalty points: " + points);

        // 5. Identifiers beyond int range
        long aadhaarLike = 1234_5678_9012L;
        String mobile = "09876543210";    // leading zero matters -> String, not a number
        System.out.println(aadhaarLike + " " + mobile + " retries=" + MAX_RETRIES);
    }
}
// Output:
// double cart total = 0.30000000000000004
// paise total       = 30 paise
// With 18% GST: Rs 58998.82
// BigDecimal   : Rs 58998.82
// Cache expires after 30 days: true
// Loyalty points: 0
// 123456789012 09876543210 retries=3`
    },
    {
      heading: "14. Common Mistakes with Java Variables, Operators and Casting — and How to Fix Them",
      content: `Each of these mistakes compiles (or fails with a confusing message) and has cost real teams real time. Learn to recognise them on sight.
**Mistake 1: Integer division where a fraction was expected.** \`double avg = sum / count;\` with \`int\` operands gives \`3.0\` instead of \`3.5\`. **Fix:** make one operand floating-point — \`(double) sum / count\` — and note the cast applies to \`sum\` only because the cast has higher precedence than \`/\`.
**Mistake 2: Comparing wrapper objects with ==.** \`if (orderId == cachedId)\` on two \`Long\` values works for small IDs (cached) and silently fails above 127. **Fix:** \`orderId.equals(cachedId)\` or \`Objects.equals(a, b)\` (null-safe), or unbox to \`long\` first.
**Mistake 3: Overflow in int arithmetic before assignment to long.** \`long ms = days * 86_400_000;\` overflows in \`int\` and the garbage is then widened. **Fix:** make the first literal \`long\` (\`86_400_000L\`) or cast the first operand (\`(long) days * 86_400_000\`). Casting the whole result afterwards is too late.
**Mistake 4: Forgetting the L or f suffix.** \`long n = 10000000000;\` → "integer number too large". \`float f = 1.5;\` → "possible lossy conversion from double to float". **Fix:** \`10000000000L\` and \`1.5f\`.
**Mistake 5: Expecting (int) to round.** \`(int) 4.99\` is \`4\`. **Fix:** \`Math.round(4.99)\` for nearest, \`Math.ceil\` or \`Math.floor\` for a direction, and remember \`Math.round(double)\` returns a \`long\`.
**Mistake 6: Unboxing a null.** \`int qty = item.getQuantity();\` throws \`NullPointerException\` when the getter returns a null \`Integer\`. **Fix:** check for null or use a default: \`int qty = item.getQuantity() == null ? 0 : item.getQuantity();\`.
**Mistake 7: Scanner newline trap.** \`nextInt()\` followed by \`nextLine()\` returns an empty string. **Fix:** add a throwaway \`sc.nextLine()\` after the numeric read.
**Mistake 8: Leading-zero literals.** \`int code = 0755;\` is octal 493. **Fix:** never write a leading zero on a decimal; if you need octal, say so in a comment.
**Mistake 9: Using = instead of ==.** In Java this is a compile error for \`int\` (\`if (x = 5)\` is not boolean), but for booleans it compiles: \`if (isActive = true)\` always runs. **Fix:** write \`if (isActive)\`, and let the compiler help you by comparing constants on the left in older codebases.
**Mistake 10: Bitwise precedence.** \`if (flags & MASK == 0)\` does not compile; \`if (flags & MASK != 0 || other)\` compiles with a different meaning in some combinations. **Fix:** always parenthesise bitwise sub-expressions.
**Mistake 11: Using float or double for money.** **Fix:** \`long\` paise or \`BigDecimal\`, as shown in Section 13.
**Mistake 12: Declaring everything as int by reflex.** Populations, file sizes, epoch milliseconds, primary keys and factorials all exceed \`int\`. **Fix:** ask "can this ever pass two billion?" and reach for \`long\` when the answer is "maybe".`,
      codeSnippet: `// CommonMistakes.java — each pair shows the bug and the fix
import java.util.Objects;

public class CommonMistakes {
    public static void main(String[] args) {
        // 1. Integer division
        int sum = 7, count = 2;
        double wrongAvg = sum / count;              // 3.0
        double rightAvg = (double) sum / count;     // 3.5
        System.out.println(wrongAvg + " vs " + rightAvg);

        // 2. Wrapper comparison
        Long id1 = 1000L, id2 = 1000L;
        System.out.println("== : " + (id1 == id2) + ", equals: " + Objects.equals(id1, id2));

        // 3. Overflow before widening
        int days = 30;
        long wrongMs = days * 86_400_000;           // overflows in int first
        long rightMs = days * 86_400_000L;          // computed in long
        System.out.println(wrongMs + " vs " + rightMs);

        // 5. Cast does not round
        System.out.println((int) 4.99 + " vs " + Math.round(4.99));

        // 6. Unboxing null safely
        Integer quantity = null;
        int qty = quantity == null ? 0 : quantity;
        System.out.println("qty = " + qty);

        // 8. Leading zero literal
        int code = 0755;
        System.out.println("0755 is " + code);      // 493

        // 9. Assignment inside condition (compiles for booleans!)
        boolean isActive = false;
        if (isActive = true) {                      // always true - bug
            System.out.println("Oops, assignment not comparison");
        }
        if (isActive) {                             // correct
            System.out.println("Correct check");
        }

        // 10. Bitwise precedence
        int flags = 0b0110, mask = 0b0010;
        System.out.println("masked: " + ((flags & mask) != 0));
    }
}
// Output:
// 3.0 vs 3.5
// == : false, equals: true
// -1702967296 vs 2592000000
// 4 vs 5
// qty = 0
// 0755 is 493
// Oops, assignment not comparison
// Correct check
// masked: true`
    },
    {
      heading: "15. Frequently Asked Questions about Java Data Types, Variables and Casting",
      content: `**What is the difference between int and Integer in Java?**
\`int\` is a primitive type that stores a 32-bit value directly, cannot be null, and is fast. \`Integer\` is a class in \`java.lang\` that wraps an \`int\` inside an object so it can be null, stored in collections such as \`List<Integer>\`, and used with generics. Java converts between them automatically through autoboxing and unboxing, but comparing two \`Integer\` objects with \`==\` compares references and only works reliably for values from -128 to 127.
**What are the 8 primitive data types in Java and their sizes?**
\`byte\` (8-bit), \`short\` (16-bit), \`int\` (32-bit), \`long\` (64-bit), \`float\` (32-bit IEEE 754), \`double\` (64-bit IEEE 754), \`char\` (16-bit unsigned Unicode) and \`boolean\` (true/false, size not specified by the language). Their sizes are fixed by the Java Language Specification on every platform, unlike C.
**Why does 0.1 + 0.2 not equal 0.3 in Java?**
\`float\` and \`double\` store numbers in binary, and 0.1 and 0.2 have no exact binary representation, just as 1/3 has no exact decimal representation. The tiny rounding errors add up to \`0.30000000000000004\`. For money and other exact decimal values use \`BigDecimal\` or integer paise; for scientific work compare doubles with a tolerance instead of \`==\`.
**What is the difference between implicit and explicit type casting in Java?**
Implicit (widening) casting is done automatically by the compiler when moving to a larger type that can hold every value, for example \`int\` to \`long\` or \`float\` to \`double\`. Explicit (narrowing) casting requires you to write the target type in parentheses, for example \`(int) 3.99\`, because data can be lost — fractions are truncated and out-of-range values wrap or saturate.
**What happens when an int overflows in Java?**
The value wraps around silently with no exception: \`Integer.MAX_VALUE + 1\` becomes \`Integer.MIN_VALUE\`. To detect overflow use \`Math.addExact\`, \`Math.multiplyExact\` and related methods (since Java 8), which throw \`ArithmeticException\`, or move to \`long\` or \`BigInteger\`.
**Is var in Java the same as var in JavaScript?**
No. JavaScript's \`var\` is dynamically typed and the variable can hold any type over time. Java's \`var\` (Java 10, JEP 286) is only a shorthand: the compiler infers one fixed type from the initializer, and the variable is as strictly typed as if you had written the type yourself. It works only for local variables with an initializer.
**Why does Scanner nextLine() return an empty string after nextInt()?**
\`nextInt()\` reads only the digits and leaves the Enter key's newline in the input buffer. The next \`nextLine()\` sees that newline, treats it as the end of an (empty) line, and returns \`""\`. Call \`sc.nextLine()\` once to discard the leftover newline before reading the real line.
**What is the difference between & and && in Java?**
\`&&\` is a logical AND that short-circuits: if the left operand is false the right is never evaluated, which makes null checks safe. \`&\` works as a bitwise AND on integers and as a non-short-circuit AND on booleans that always evaluates both sides. Use \`&&\` for conditions and \`&\` only for bit manipulation.`
    },
    {
      heading: "16. Interview Questions and Answers on Java Variables, Operators and Type Casting",
      content: `**Q1. Why is the size of Java primitive types fixed, unlike C?**
Because Java's promise is "write once, run anywhere". The Java Language Specification fixes \`int\` at 32 bits and \`long\` at 64 bits on every JVM, so arithmetic behaves identically on a Windows laptop, a Linux server and an Android phone. In C the sizes depend on the compiler and platform, which makes porting error-prone.
**Q2. What is the output of \`Integer a = 127, b = 127; System.out.println(a == b);\` and why does it change for 128?**
It prints \`true\` for 127 and \`false\` for 128. Autoboxing calls \`Integer.valueOf()\`, which returns cached objects for -128 to 127, so both variables point to the same object. For 128 two separate objects are created and \`==\` compares references. The lesson: use \`equals()\` for wrapper comparison.
**Q3. What is the difference between \`i++\` and \`++i\`?**
Both increment \`i\` by one. \`++i\` increments first and the expression evaluates to the new value; \`i++\` evaluates to the old value and then increments. In \`int j = i++ + ++i;\` with \`i = 5\`, the left operand is 5 (i becomes 6), the right is 7 (i becomes 7), so \`j = 12\`.
**Q4. Why does \`byte b = 10; b = b + 1;\` fail to compile but \`b += 1;\` works?**
Arithmetic on types smaller than \`int\` is promoted to \`int\`, so \`b + 1\` is an \`int\` and cannot be assigned to a \`byte\` without a cast. Compound assignment operators include an implicit cast to the left-hand type: \`b += 1\` means \`b = (byte) (b + 1)\`.
**Q5. What is the difference between \`>>\` and \`>>>\`?**
\`>>\` is the arithmetic right shift: it fills vacated bits with the sign bit, so negative numbers remain negative (\`-8 >> 1\` is \`-4\`). \`>>>\` is the logical right shift: it fills with zeros, so a negative \`int\` becomes a large positive value (\`-8 >>> 1\` is \`2147483644\`). Java needs both because all its integer types are signed.
**Q6. What does \`(int) 3.99\` return, and how would you round instead?**
It returns \`3\` because narrowing from \`double\` to \`int\` truncates toward zero. To round to the nearest integer use \`Math.round(3.99)\`, which returns the \`long\` value 4; \`Math.ceil\` and \`Math.floor\` give 4.0 and 3.0 as doubles.
**Q7. How would you store ₹1,23,456.78 in a Java program, and why not as a double?**
As \`long amountPaise = 12_345_678L;\` or \`new BigDecimal("123456.78")\`. \`double\` cannot represent most decimal fractions exactly, so repeated additions and percentage calculations drift by a paisa and break reconciliation. \`BigDecimal\` provides exact decimal arithmetic with explicit rounding modes.
**Q8. What is the result of \`"5" + 3 + 2\` versus \`5 + 3 + "2"\`?**
\`"5" + 3 + 2\` is \`"532"\` because \`+\` is left-associative and the first operand is a String, so every subsequent \`+\` is concatenation. \`5 + 3 + "2"\` is \`"82"\` because \`5 + 3\` is computed as integer addition before the String is encountered.
**Q9. What does \`Math.abs(Integer.MIN_VALUE)\` return?**
It returns \`Integer.MIN_VALUE\` (-2147483648). The positive value 2147483648 does not fit in an \`int\`, so the negation overflows and wraps back to the minimum. This is a classic example of silent integer overflow; \`Math.absExact\` (Java 15) throws instead.
**Q10. Can you use \`var\` for a field or a method parameter? Why not?**
No. \`var\` is only for local variables (and lambda parameters since Java 11) because the type must be inferred from an initializer that is visible right there. Fields and parameters form the public API of a class and must declare their types explicitly so callers, documentation tools and the compiler can rely on them.`
    },
    {
      heading: "17. Hands-On Exercise: Build a Salary Slip and Loan EMI Calculator in Java",
      content: `Put everything from this lecture together in one realistic program. The calculator reads an employee's details with \`Scanner\`, builds a salary slip and computes the EMI for a home or car loan.
**What the program must do:**
1. Read the employee name (with spaces), basic salary (\`int\`), loan amount (\`long\`), annual interest rate (\`double\`) and tenure in years (\`int\`). Handle the Scanner newline trap.
2. Use \`static final\` constants for HRA 40%, DA 10% and PF 12% — no magic numbers.
3. Compute HRA, DA, gross, PF and net salary. Notice how \`int * double\` widens automatically.
4. Compute annual gross as a \`long\` using an explicit cast **before** multiplying, and label the tax position with a ternary operator.
5. Compute the EMI with the standard formula EMI = P × r × (1 + r)^n ÷ ((1 + r)^n − 1), where \`r\` is the monthly rate and \`n\` the number of months. Round it with \`Math.round\` (a \`double → long\` narrowing) and compute total payment with \`Math.multiplyExact\` so an overflow can never slip through silently.
6. Use one bitwise operation (is the tenure in months even?) and one autoboxing conversion, and print everything with \`printf\` using \`%,d\` for Indian-style readable numbers.
**Try these extensions after it runs:** switch the money calculations to \`BigDecimal\`; validate every input with \`hasNextInt()\`/\`hasNextDouble()\` loops; add a \`char\` grade based on net salary using nested ternaries, then rewrite that part with \`if-else\` and compare readability; and replace \`Scanner\` with Java 25's \`IO.readln()\` to see the difference.
Compile and run with \`javac SalaryAndEmiCalculator.java\` followed by \`java SalaryAndEmiCalculator\`, or simply \`java SalaryAndEmiCalculator.java\` (single-file source launcher, standard since Java 11).`,
      codeSnippet: `// SalaryAndEmiCalculator.java
import java.util.Scanner;

public class SalaryAndEmiCalculator {

    // Named constants: UPPER_SNAKE_CASE, assigned exactly once
    static final double HRA_PERCENT = 40.0;
    static final double DA_PERCENT = 10.0;
    static final double PF_PERCENT = 12.0;
    static final int MONTHS_IN_YEAR = 12;
    static final long TAX_FREE_LIMIT = 12_00_000L;   // Rs 12 lakh, underscores for readability

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Employee name           : ");
        String name = sc.nextLine();                     // read first, no trap yet

        System.out.print("Basic salary per month  : ");
        int basic = sc.nextInt();

        System.out.print("Loan amount (rupees)    : ");
        long loanAmount = sc.nextLong();                 // long: loans exceed int easily

        System.out.print("Annual interest rate %  : ");
        double annualRate = sc.nextDouble();

        System.out.print("Tenure in years         : ");
        int years = sc.nextInt();
        sc.nextLine();                                   // clear leftover newline (good habit)

        // ---------- Part 1: salary slip (implicit widening, operators) ----------
        double hra = basic * HRA_PERCENT / 100;          // int * double -> double
        double da = basic * DA_PERCENT / 100;
        double gross = basic + hra + da;
        double pf = basic * PF_PERCENT / 100;
        double net = gross - pf;

        long annualGross = (long) gross * MONTHS_IN_YEAR; // cast FIRST, then multiply
        String taxStatus = annualGross > TAX_FREE_LIMIT ? "taxable" : "likely nil (new regime)";

        // ---------- Part 2: EMI (explicit narrowing, overflow-safe math) ----------
        double monthlyRate = annualRate / MONTHS_IN_YEAR / 100;   // 9.0 -> 0.0075
        int months = years * MONTHS_IN_YEAR;
        double factor = Math.pow(1 + monthlyRate, months);
        double emiExact = monthlyRate == 0
                ? (double) loanAmount / months                    // zero-interest loan
                : loanAmount * monthlyRate * factor / (factor - 1);

        long emi = Math.round(emiExact);                           // double -> long, rounded
        long totalPayment = Math.multiplyExact(emi, (long) months); // throws on overflow
        long totalInterest = totalPayment - loanAmount;

        // ---------- Part 3: bitwise + wrapper usage ----------
        boolean evenTenure = (months & 1) == 0;                    // bitwise even check
        Integer boxedMonths = months;                              // autoboxing
        String tenureText = boxedMonths.toString() + " months";

        // ---------- Output ----------
        System.out.println();
        System.out.println("========== Salary Slip: " + name + " ==========");
        System.out.printf("Basic            : Rs %,12d%n", basic);
        System.out.printf("HRA (%.0f%%)        : Rs %,12.2f%n", HRA_PERCENT, hra);
        System.out.printf("DA  (%.0f%%)        : Rs %,12.2f%n", DA_PERCENT, da);
        System.out.printf("Gross            : Rs %,12.2f%n", gross);
        System.out.printf("PF  (%.0f%%)        : Rs %,12.2f%n", PF_PERCENT, pf);
        System.out.printf("Net in hand      : Rs %,12.2f%n", net);
        System.out.printf("Annual gross     : Rs %,12d  (%s)%n", annualGross, taxStatus);

        System.out.println();
        System.out.println("========== Loan EMI ==========");
        System.out.printf("Principal        : Rs %,12d%n", loanAmount);
        System.out.printf("Rate / tenure    : %.2f%% for %s (even tenure: %b)%n",
                annualRate, tenureText, evenTenure);
        System.out.printf("Monthly EMI      : Rs %,12d%n", emi);
        System.out.printf("Total payment    : Rs %,12d%n", totalPayment);
        System.out.printf("Total interest   : Rs %,12d%n", totalInterest);

        sc.close();
    }
}
// Sample run:
// Employee name           : Priya Sharma
// Basic salary per month  : 50000
// Loan amount (rupees)    : 500000
// Annual interest rate %  : 9
// Tenure in years         : 5
//
// ========== Salary Slip: Priya Sharma ==========
// Basic            : Rs       50,000
// HRA (40%)        : Rs    20,000.00
// DA  (10%)        : Rs     5,000.00
// Gross            : Rs    75,000.00
// PF  (12%)        : Rs     6,000.00
// Net in hand      : Rs    69,000.00
// Annual gross     : Rs      900,000  (likely nil (new regime))
//
// ========== Loan EMI ==========
// Principal        : Rs      500,000
// Rate / tenure    : 9.00% for 60 months (even tenure: true)
// Monthly EMI      : Rs       10,379
// Total payment    : Rs      622,740
// Total interest   : Rs      122,740`
    },
    {
      heading: "18. Summary",
      content: `• Java is statically typed: every variable has a fixed type checked by the compiler. Locals must be initialized; fields get defaults (\`0\`, \`false\`, \`null\`).
• The eight primitives are \`byte\`, \`short\`, \`int\`, \`long\`, \`float\`, \`double\`, \`char\`, \`boolean\`, with sizes fixed by the specification. Default to \`int\` and \`double\`; use \`long\` for IDs, timestamps and money in paise; never use \`double\` for currency.
• Literals: \`int\` and \`double\` by default, so add \`L\` and \`f\` suffixes when needed; \`0x\` hex, \`0b\` binary (Java 7), underscores between digits (Java 7); beware the leading-zero octal trap.
• \`final\` makes a variable assignable once; \`static final\` in UPPER_SNAKE_CASE is the idiom for constants. \`final\` on a reference does not make the object immutable.
• Wrapper classes (\`Integer\`, \`Double\`, ...) let primitives act as objects. Autoboxing and unboxing are automatic (Java 5); compare wrappers with \`equals()\` because of the -128..127 cache, and guard against unboxing \`null\`.
• \`var\` (Java 10) infers a fixed static type for local variables with an initializer; it is not dynamic typing and is not allowed for fields or parameters.
• Integer division truncates toward zero; \`%\` keeps the sign of the dividend (use \`Math.floorMod\` for a non-negative result); integer division by zero throws, floating-point gives \`Infinity\`/\`NaN\`.
• Integer overflow wraps silently; defend with \`long\`, the \`L\` suffix on the first literal, or \`Math.addExact\`/\`multiplyExact\`.
• \`&&\` and \`||\` short-circuit; \`&\`, \`|\`, \`^\`, \`~\`, \`<<\`, \`>>\`, \`>>>\` work on bits; the ternary operator is an expression with numeric promotion between its branches.
• Precedence: postfix, unary/cast, multiplicative, additive, shift, relational, equality, bitwise, logical, ternary, assignment. Parenthesise anything mixing more than two levels, especially bitwise operations.
• Widening conversions (\`byte → short → int → long → float → double\`, \`char → int\`) are implicit; narrowing needs an explicit cast and truncates or wraps. Compound assignment hides a cast; \`byte + byte\` is an \`int\`.
• \`Scanner\` reads typed tokens from \`System.in\`; discard the leftover newline after \`nextInt()\`, validate with \`hasNextInt()\`, and create one Scanner per program. Java 25's \`IO.readln()\` is a lighter alternative for simple scripts.
**Next lecture:** Control Flow — Conditionals, Switch Expressions & Loops`
    }
  ]
};
