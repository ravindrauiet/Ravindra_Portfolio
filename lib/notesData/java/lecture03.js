export const lecture03 = {
  slug: "lecture-3",
  number: 3,
  title: "Complete Java Course — Lecture 3: Control Flow — Conditionals, Switch Expressions & Loops",
  summary: "Master Java control flow: if/else and nested conditions, classic switch vs switch expressions with arrow labels and yield, pattern matching for switch (Java 21), for, enhanced for, while and do-while loops, break, continue and labels, common loop patterns and interview pattern-printing programs.",
  readTime: "58 min read",
  difficulty: "Beginner",
  date: "2026-10-09",
  sections: [
    {
      heading: "1. What Is Control Flow in Java and Why It Matters",
      content: `By default, a Java program runs from the first statement of \`main\` to the last, one line after another. That is enough for a Hello World, but no real program is a straight line. A banking app must ask "is the balance sufficient?" before allowing a withdrawal. A railway booking system must loop over every passenger in a group. A grading program must map a score to a letter grade. All of these need **control flow** — the statements that decide **which** code runs and **how many times** it runs.
Java gives you three families of control-flow statements:
• **Conditionals** — \`if\`, \`else if\`, \`else\` and the ternary operator \`? :\` choose between branches based on a \`boolean\` condition.
• **Switch** — the classic \`switch\` statement (since Java 1.0) and the modern **switch expression** with arrow labels and \`yield\` (final in Java 14), extended by **pattern matching for switch** (final in Java 21) select one branch out of many based on a value.
• **Loops** — \`for\`, the enhanced \`for\` (for-each), \`while\` and \`do-while\` repeat a block, while \`break\`, \`continue\` and **labels** fine-tune the repetition.
Why spend a whole lecture on this? Three reasons. First, control flow is where most **beginner bugs** live: off-by-one errors, missing \`break\` in a switch, infinite loops, and conditions that use \`=\` where \`==\` was intended. Second, every **Java interview** for freshers — at TCS, Infosys, Wipro, Capgemini, Accenture and product start-ups alike — includes at least one loop-based problem such as printing a pyramid pattern, reversing a number or checking a prime. Third, the modern switch syntax is one of the most visible changes in Java since Java 8, and knowing the difference between a switch **statement** and a switch **expression** is now a standard interview question.
In the previous lecture you learned variables, data types, operators and casting. Those are the raw materials; in this lecture we use them to make decisions and repeat work. Every example is complete and compilable with any JDK 21 or JDK 25 installation, and version-specific features are labelled so you know exactly what works where.`
    },
    {
      heading: "2. The if, else if and else Statements in Java",
      content: `The \`if\` statement is the simplest decision-maker. It evaluates a condition that **must be of type \`boolean\`** and runs the following block only when that condition is \`true\`. Unlike C or JavaScript, Java does not treat \`0\`, \`null\` or an empty string as "falsy": writing \`if (count)\` where \`count\` is an \`int\` is a **compile-time error**. This strictness is a feature — it catches the classic mistake \`if (x = 5)\` (assignment instead of comparison) at compile time, because the expression \`x = 5\` has type \`int\`, not \`boolean\`.
The full form is an **if / else-if / else ladder**. Java evaluates the conditions **top to bottom** and runs the **first** block whose condition is true; all remaining branches are skipped, even if their conditions would also be true. The final \`else\` (optional) is the catch-all. Because of this top-to-bottom rule, **order matters**: when checking score ranges, test the highest range first or every score will match the lowest range.
Three style rules will save you from real bugs:
• **Always use braces**, even for a single statement. Java allows \`if (x > 0) System.out.println("positive");\` without braces, but when someone later adds a second line, it silently runs outside the \`if\`. Google, Oracle and most Indian IT companies' coding standards mandate braces.
• **Put the most likely or cheapest condition first** in an else-if ladder when the branches are mutually exclusive — it makes the code both faster and easier to read.
• **Prefer \`else if\` over a series of separate \`if\` statements** when only one branch should run. Separate \`if\`s are evaluated independently and several can execute.
The example below implements an Indian income-tax-style slab check and a simple login check. Notice how the ladder tests the higher thresholds first and how the \`else\` handles everything that falls through.`,
      codeSnippet: `// IfElseDemo.java
public class IfElseDemo {
    public static void main(String[] args) {
        int marks = 78;

        // Simple if
        if (marks >= 40) {
            System.out.println("Pass");          // runs because 78 >= 40
        }

        // if / else
        if (marks % 2 == 0) {
            System.out.println("Even marks");
        } else {
            System.out.println("Odd marks");     // 78 % 2 == 0 -> "Even marks"
        }

        // if / else-if / else ladder: order matters, highest range first
        String grade;
        if (marks >= 90) {
            grade = "A+";
        } else if (marks >= 75) {
            grade = "A";                         // first true branch wins
        } else if (marks >= 60) {
            grade = "B";
        } else if (marks >= 40) {
            grade = "C";
        } else {
            grade = "F";
        }
        System.out.println("Grade: " + grade);   // Grade: A

        // Simplified tax-slab style ladder (illustrative numbers, in rupees)
        double income = 9_50_000;                // underscores are allowed in numeric literals
        double tax;
        if (income <= 4_00_000) {
            tax = 0;
        } else if (income <= 8_00_000) {
            tax = (income - 4_00_000) * 0.05;
        } else if (income <= 12_00_000) {
            tax = 20_000 + (income - 8_00_000) * 0.10;
        } else {
            tax = 60_000 + (income - 12_00_000) * 0.15;
        }
        System.out.printf("Tax on Rs. %.0f = Rs. %.0f%n", income, tax);
        // Tax on Rs. 950000 = Rs. 35000

        // int x = 5;
        // if (x = 10) { }   // COMPILE ERROR: int cannot be converted to boolean
    }
}`
    },
    {
      heading: "3. Nested Conditions, Boolean Logic, Guard Clauses and the Ternary Operator",
      content: `An \`if\` inside another \`if\` is a **nested condition**. Nesting is natural when a second decision only makes sense after the first one passes — for example, "if the user is logged in, then if the balance is sufficient, allow the withdrawal". Two or three levels of nesting are fine; beyond that the code becomes an "arrow" that is hard to read and test. There are three standard tools for flattening deep nesting:
• **Combine conditions with logical operators.** \`&&\` (AND), \`||\` (OR) and \`!\` (NOT) let you write \`if (loggedIn && balance >= amount)\` instead of two nested \`if\`s. Java's \`&&\` and \`||\` are **short-circuit** operators: in \`a != null && a.length() > 0\`, the right side is never evaluated when \`a\` is \`null\`, which prevents a \`NullPointerException\`. The order of the operands therefore matters.
• **Use guard clauses.** Check the failure conditions first and \`return\` (or throw) immediately, so the "happy path" stays at the top indentation level. This is the style used in most professional Java code bases.
• **Extract a method** with a descriptive name such as \`isEligibleForLoan(applicant)\` when a condition grows beyond one line.
The **ternary (conditional) operator** \`condition ? valueIfTrue : valueIfFalse\` is a compact expression form of if/else that **produces a value**. It is ideal for simple assignments like \`String status = age >= 18 ? "Adult" : "Minor";\`. Do not nest ternaries more than one level deep, and never use a ternary for side effects (printing, calling methods) — use \`if\` for that. Note the **dangling else** rule as well: an \`else\` always pairs with the **nearest** unmatched \`if\`, which is another reason to always use braces.`,
      codeSnippet: `// NestedConditions.java
public class NestedConditions {

    // Deeply nested version: hard to read
    static String withdrawNested(boolean loggedIn, double balance, double amount) {
        if (loggedIn) {
            if (amount > 0) {
                if (balance >= amount) {
                    return "Dispensed Rs. " + amount;
                } else {
                    return "Insufficient balance";
                }
            } else {
                return "Invalid amount";
            }
        } else {
            return "Please log in";
        }
    }

    // Same logic with guard clauses: flat and readable
    static String withdrawGuarded(boolean loggedIn, double balance, double amount) {
        if (!loggedIn) return "Please log in";
        if (amount <= 0) return "Invalid amount";
        if (balance < amount) return "Insufficient balance";
        return "Dispensed Rs. " + amount;
    }

    public static void main(String[] args) {
        System.out.println(withdrawNested(true, 5000, 2000));   // Dispensed Rs. 2000.0
        System.out.println(withdrawGuarded(true, 1000, 2000));  // Insufficient balance
        System.out.println(withdrawGuarded(false, 1000, 200));  // Please log in

        // Short-circuit evaluation protects against NullPointerException
        String name = null;
        if (name != null && name.length() > 3) {
            System.out.println("Long name");
        } else {
            System.out.println("Name missing or short");         // printed, no NPE
        }

        // Ternary operator produces a value
        int age = 17;
        String category = age >= 18 ? "Adult" : "Minor";
        System.out.println(category);                            // Minor

        // Leap year check combining && and ||
        int year = 2024;
        boolean leap = (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
        System.out.println(year + " leap year? " + leap);        // 2024 leap year? true
    }
}`
    },
    {
      heading: "4. The Classic switch Statement in Java and the Fall-Through Trap",
      content: `When you need to compare **one value** against **many constants**, a long else-if ladder becomes noisy. The classic \`switch\` **statement** (available since Java 1.0) compares a selector expression against a list of \`case\` labels and jumps directly to the matching one. The selector can be a \`byte\`, \`short\`, \`char\`, \`int\`, their wrapper classes, an \`enum\` (Java 5) or a \`String\` (Java 7). Classic \`switch\` does **not** accept \`long\`, \`float\`, \`double\` or \`boolean\`.
The most important thing to understand about the classic form is **fall-through**. After a matching \`case\` label, execution continues **downward through every following case** until it hits a \`break\` or the end of the switch. This was inherited from C, and it is responsible for an enormous number of bugs: forget one \`break\` and your "Tuesday" branch also prints "Wednesday". Occasionally fall-through is used deliberately to group labels (\`case 1: case 7:\` → both weekend), but the intention is invisible to readers.
Other rules of the classic switch:
• \`case\` labels must be **compile-time constants** (literals, \`final\` variables, enum constants) and must be **unique**.
• \`default\` is optional and can appear anywhere, though convention puts it last.
• Since the classic switch is a **statement**, it does not produce a value; you must assign a variable inside each branch, which makes it easy to forget one.
• If the selector is a \`String\` or wrapper and its value is \`null\`, the classic switch throws a \`NullPointerException\` (Java 21 added \`case null\` for the modern form, covered in section 6).
The example shows a day-number-to-name converter with a deliberately missing \`break\` so you can see fall-through in action.`,
      codeSnippet: `// ClassicSwitch.java
public class ClassicSwitch {
    public static void main(String[] args) {
        int day = 3;
        String name;

        switch (day) {
            case 1:
                name = "Monday";
                break;
            case 2:
                name = "Tuesday";
                break;
            case 3:
                name = "Wednesday";
                break;                    // without this break, execution falls into case 4
            case 4:
                name = "Thursday";
                break;
            case 5:
                name = "Friday";
                break;
            case 6:
            case 7:                       // intentional grouping via fall-through
                name = "Weekend";
                break;
            default:
                name = "Invalid day";
        }
        System.out.println(name);         // Wednesday

        // Fall-through bug demo: no break statements at all
        int level = 1;
        switch (level) {
            case 1:
                System.out.println("Bronze");
            case 2:
                System.out.println("Silver");   // also printed!
            case 3:
                System.out.println("Gold");     // also printed!
            default:
                System.out.println("Unknown");  // also printed!
        }
        // Output: Bronze, Silver, Gold, Unknown (all four lines)

        // String switch (Java 7+)
        String city = "Pune";
        switch (city) {
            case "Mumbai":
            case "Pune":
                System.out.println("Maharashtra");
                break;
            case "Bengaluru":
                System.out.println("Karnataka");
                break;
            default:
                System.out.println("Unknown state");
        }
        // Maharashtra
    }
}`
    },
    {
      heading: "5. Switch Expressions with Arrow Labels and yield (Final in Java 14)",
      content: `**Switch expressions** were previewed in Java 12 and 13 and became a **final, standard feature in Java 14** (JEP 361). They fix every pain point of the classic form at once:
• **Arrow labels** \`case X ->\` run exactly one branch and **never fall through**. No \`break\` needed.
• **Multiple labels per case** are written with commas: \`case SATURDAY, SUNDAY -> "Weekend"\`.
• The switch can be used **as an expression** that **returns a value**, so you write \`String name = switch (day) { ... };\` and assign once.
• When used as an expression, the switch **must be exhaustive**: every possible value must be covered. For \`int\` or \`String\` selectors that means a \`default\` branch is mandatory; for an \`enum\`, listing every constant is enough and the compiler will complain if you miss one. This turns a whole category of runtime bugs into compile errors.
• When a branch needs several statements, write a block \`{ ... }\` and produce the result with the **\`yield\`** keyword. \`yield\` is a contextual keyword: it is only special inside a switch, so existing variables named \`yield\` keep compiling.
You can also use **arrow labels in a switch statement** (one that does not return a value) purely to avoid fall-through — the right side is then a statement or block. And the old colon form can be used inside a switch expression with \`yield\` instead of \`break\`, but mixing arrow and colon labels inside the same switch is a compile error. The recommended modern style, used throughout Spring and most new Java code, is: **arrow labels everywhere, switch expressions whenever you need a value**. Compare the day-name example from the previous section — it shrinks from 25 lines to 7 and cannot fall through.`,
      codeSnippet: `// SwitchExpressions.java  (requires Java 14 or newer)
public class SwitchExpressions {

    enum Plan { FREE, BASIC, PRO, ENTERPRISE }

    public static void main(String[] args) {
        int day = 3;

        // 1. Switch expression with arrow labels and multiple labels per case
        String name = switch (day) {
            case 1 -> "Monday";
            case 2 -> "Tuesday";
            case 3 -> "Wednesday";
            case 4 -> "Thursday";
            case 5 -> "Friday";
            case 6, 7 -> "Weekend";
            default -> "Invalid day";       // required: int selector must be exhaustive
        };
        System.out.println(name);           // Wednesday

        // 2. Enum selector: exhaustive without default when all constants are listed
        Plan plan = Plan.PRO;
        int monthlyPriceInr = switch (plan) {
            case FREE -> 0;
            case BASIC -> 499;
            case PRO -> 1499;
            case ENTERPRISE -> 9999;
        };
        System.out.println("Price: Rs. " + monthlyPriceInr);   // Price: Rs. 1499

        // 3. Block body with yield when a branch needs more than one statement
        int quantity = 12;
        double discount = switch (quantity / 10) {
            case 0 -> 0.0;
            case 1 -> {
                System.out.println("Bulk tier 1 applied");
                yield 0.05;
            }
            default -> {
                double d = 0.05 * (quantity / 10);
                yield Math.min(d, 0.25);    // cap at 25 percent
            }
        };
        System.out.println("Discount: " + discount);   // Bulk tier 1 applied / Discount: 0.05

        // 4. Arrow labels in a switch STATEMENT (no value) just to avoid fall-through
        String command = "stop";
        switch (command) {
            case "start" -> System.out.println("Starting");
            case "stop" -> System.out.println("Stopping");
            default -> System.out.println("Unknown command");
        }
        // Stopping
    }
}`
    },
    {
      heading: "6. Pattern Matching for switch, case null and Guards (Final in Java 21)",
      content: `Java 21 (September 2023, LTS) finalized **pattern matching for switch** (JEP 441) together with **record patterns** (JEP 440). Together they turn \`switch\` from a constant-comparison tool into a full type-dispatch tool. The selector may now be **any reference type**, and case labels may be **type patterns** such as \`case Integer i ->\` that both test the type and bind a variable in one step. This replaces chains of \`instanceof\` checks and casts.
The key additions, all **final in Java 21** and therefore safe to use in production:
• **Type patterns**: \`case String s -> s.length()\`. The variable \`s\` is in scope only in that branch.
• **Guards with \`when\`**: \`case Integer i when i > 0 -> "positive"\` adds a boolean condition to a pattern. Guards are checked in order, so put the specific guarded case before the general one.
• **\`case null\`**: for the first time a switch can handle a \`null\` selector instead of throwing \`NullPointerException\`. You can also write \`case null, default ->\` to treat null and everything unmatched together.
• **Exhaustiveness and dominance checks**: a pattern switch must cover all possibilities (use \`default\` or a sealed hierarchy), and a case that can never match because an earlier case already covers it (for example \`case Object o\` placed before \`case String s\`) is a **compile error**. The compiler enforces the order for you.
• **Record patterns**: \`case Point(int x, int y) ->\` deconstructs a record directly in the label.
Two version notes you should state precisely in interviews. First, this feature is **not available in Java 17**; Java 17 only has pattern matching for \`instanceof\` (Java 16). Second, **primitive type patterns** in switch (allowing \`switch\` on \`long\`, \`double\` or \`boolean\` with patterns, JEP 455 → JEP 507) are still a **preview feature in Java 25** — they are not final, require \`--enable-preview\`, and must not be used in production code. Classic constant switches on \`long\`, \`float\`, \`double\` and \`boolean\` therefore remain a compile error in standard Java 25.`,
      codeSnippet: `// PatternSwitch.java  (requires Java 21 or newer)
public class PatternSwitch {

    record Point(int x, int y) { }

    sealed interface Shape permits Circle, Rectangle { }
    record Circle(double radius) implements Shape { }
    record Rectangle(double w, double h) implements Shape { }

    static String describe(Object obj) {
        return switch (obj) {
            case null -> "null value";                               // Java 21: case null
            case Integer i when i < 0 -> "negative int " + i;        // guard with when
            case Integer i -> "int " + i;
            case String s when s.isBlank() -> "blank string";
            case String s -> "string of length " + s.length();
            case Point(int x, int y) -> "point at (" + x + ", " + y + ")";  // record pattern
            case int[] arr -> "int array of length " + arr.length;
            default -> "something else: " + obj.getClass().getSimpleName();
        };
    }

    // Sealed hierarchy: exhaustive without default, compiler verifies every subtype
    static double area(Shape shape) {
        return switch (shape) {
            case Circle c -> Math.PI * c.radius() * c.radius();
            case Rectangle r -> r.w() * r.h();
        };
    }

    public static void main(String[] args) {
        System.out.println(describe(42));                 // int 42
        System.out.println(describe(-7));                 // negative int -7
        System.out.println(describe("Chennai"));          // string of length 7
        System.out.println(describe("   "));              // blank string
        System.out.println(describe(new Point(3, 4)));    // point at (3, 4)
        System.out.println(describe(new int[5]));         // int array of length 5
        System.out.println(describe(null));               // null value
        System.out.println(describe(3.14));               // something else: Double

        System.out.printf("%.2f%n", area(new Circle(1)));         // 3.14
        System.out.printf("%.2f%n", area(new Rectangle(2, 3)));   // 6.00
    }
}`
    },
    {
      heading: "7. The for Loop in Java: Counting, Stepping and Multiple Variables",
      content: `The **\`for\` loop** is the loop you reach for when you know, or can compute, **how many times** the body should run. Its header has three parts separated by semicolons: **initialization** (runs once, before the loop), **condition** (checked **before every iteration**; the loop ends when it is \`false\`) and **update** (runs **after each iteration**). The sequence is: init → check → body → update → check → body → update → ... → check fails → exit.
Important details that interviewers probe:
• A variable declared in the initialization (\`int i = 0\`) is **scoped to the loop**. It does not exist after the closing brace, so you can reuse the name \`i\` in the next loop.
• The condition is checked **before** the first iteration, so a \`for\` loop can run **zero times** (for example \`for (int i = 5; i < 3; i++)\`).
• All three parts are optional. \`for (;;)\` is a legal infinite loop that must be exited with \`break\` or \`return\`.
• The initialization and update parts may contain **several comma-separated expressions** of the same type: \`for (int i = 0, j = n - 1; i < j; i++, j--)\` walks inward from both ends, which is the standard way to check a palindrome or reverse an array in place.
• The step does not have to be \`++\`. Use \`i += 2\` for even numbers, \`i--\` to count down, or \`i *= 2\` for powers of two.
• **Nested for loops** run the inner loop completely for every iteration of the outer loop. Two nested loops over \`n\` items execute the inner body \`n × n\` times — this is the O(n²) you will meet in data-structure interviews.
A note on performance: the JVM's JIT compiler optimizes simple counted loops extremely well, so there is no need for tricks like caching \`array.length\` in a variable; write the clear version.`,
      codeSnippet: `// ForLoopDemo.java
public class ForLoopDemo {
    public static void main(String[] args) {
        // Multiplication table of 7
        for (int i = 1; i <= 10; i++) {
            System.out.println("7 x " + i + " = " + (7 * i));
        }

        // Counting down with a custom step: 100, 90, ..., 10
        for (int n = 100; n >= 10; n -= 10) {
            System.out.print(n + " ");
        }
        System.out.println();

        // Powers of two below 1000
        for (int p = 1; p < 1000; p *= 2) {
            System.out.print(p + " ");           // 1 2 4 8 16 32 64 128 256 512
        }
        System.out.println();

        // Two loop variables: check whether a string is a palindrome
        String word = "malayalam";
        boolean palindrome = true;
        for (int i = 0, j = word.length() - 1; i < j; i++, j--) {
            if (word.charAt(i) != word.charAt(j)) {
                palindrome = false;
                break;
            }
        }
        System.out.println(word + " palindrome? " + palindrome);   // true

        // Zero-iteration loop: body never runs
        for (int i = 5; i < 3; i++) {
            System.out.println("never printed");
        }

        // Nested loops: 3 x 3 grid of coordinates
        for (int row = 1; row <= 3; row++) {
            for (int col = 1; col <= 3; col++) {
                System.out.print("(" + row + "," + col + ") ");
            }
            System.out.println();
        }
        // (1,1) (1,2) (1,3)
        // (2,1) (2,2) (2,3)
        // (3,1) (3,2) (3,3)

        // Sum of first 100 natural numbers
        int sum = 0;
        for (int i = 1; i <= 100; i++) {
            sum += i;
        }
        System.out.println("Sum 1..100 = " + sum);   // 5050
    }
}`
    },
    {
      heading: "8. The Enhanced for Loop (for-each) in Java",
      content: `Java 5 introduced the **enhanced for loop**, usually called **for-each**, with the syntax \`for (Type element : collectionOrArray)\`. Read the colon as "in": "for each \`element\` in \`collection\`". It iterates over every element of an **array** or any object that implements \`Iterable\` (all \`List\`, \`Set\` and \`Queue\` implementations, but **not** \`Map\` directly — iterate over \`map.entrySet()\`, \`keySet()\` or \`values()\`).
Use the enhanced for loop whenever you simply need **every element, in order, without the index**. It is shorter, cannot produce an \`ArrayIndexOutOfBoundsException\`, and expresses intent clearly. It is the default choice in professional code; the classic indexed \`for\` loop is reserved for cases where you genuinely need the index.
Limitations you must know:
• **No index.** If you need the position (to print "item 3 of 10", or to compare adjacent elements), use the classic \`for\` loop.
• **The loop variable is a copy.** For an \`int[]\`, assigning \`element = 0\` inside the loop does not change the array. For an object array or list, you can call methods that mutate the object (\`student.setMarks(90)\`) but reassigning the variable does nothing to the collection.
• **You cannot add or remove elements** of the collection you are iterating. Doing so on an \`ArrayList\` throws \`ConcurrentModificationException\` on the next iteration. Use an explicit \`Iterator\` with \`iterator.remove()\`, or the \`removeIf\` method, instead.
• It always goes **forward from the first element**. To iterate backwards or skip elements, use a classic loop.
Since Java 10 you can declare the loop variable with \`var\` (\`for (var city : cities)\`), which is handy for long generic types like \`Map.Entry<String, List<Integer>>\`.`,
      codeSnippet: `// ForEachDemo.java
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class ForEachDemo {
    public static void main(String[] args) {
        int[] marks = {72, 88, 95, 64, 79};

        // Array: compute average without touching an index
        int total = 0;
        for (int m : marks) {
            total += m;
        }
        System.out.println("Average: " + (double) total / marks.length);   // Average: 79.6

        // Loop variable is a copy for primitives: this does NOT reset the array
        for (int m : marks) {
            m = 0;
        }
        System.out.println("First mark still: " + marks[0]);               // 72

        // List of strings
        List<String> cities = List.of("Delhi", "Mumbai", "Kolkata", "Chennai");
        for (String city : cities) {
            System.out.print(city.toUpperCase() + " ");
        }
        System.out.println();   // DELHI MUMBAI KOLKATA CHENNAI

        // Map: iterate over entries with var (Java 10+)
        Map<String, Integer> pinCodes = Map.of("Pune", 411001, "Jaipur", 302001);
        for (var entry : pinCodes.entrySet()) {
            System.out.println(entry.getKey() + " -> " + entry.getValue());
        }

        // Removing while iterating: WRONG way throws ConcurrentModificationException
        List<Integer> numbers = new ArrayList<>(List.of(1, 2, 3, 4, 5, 6));
        // for (Integer n : numbers) { if (n % 2 == 0) numbers.remove(n); }  // throws!

        // RIGHT way: removeIf (Java 8+)
        numbers.removeIf(n -> n % 2 == 0);
        System.out.println(numbers);   // [1, 3, 5]

        // Need the index? Use the classic loop
        for (int i = 0; i < marks.length; i++) {
            System.out.println("Subject " + (i + 1) + ": " + marks[i]);
        }
    }
}`
    },
    {
      heading: "9. while and do-while Loops in Java",
      content: `A **\`while\` loop** repeats its body **as long as a condition stays true**, and it checks that condition **before every iteration**. Use it when you do **not** know the number of iterations in advance: reading input until the user types "quit", retrying a network call until it succeeds, or stripping digits off a number until nothing is left. Any \`for\` loop can be rewritten as a \`while\` loop and vice versa; choose the one that reads most naturally. The rule of thumb used in code reviews is: **counted repetition → \`for\`; condition-driven repetition → \`while\`**.
Because the condition is tested first, a \`while\` loop may run zero times. You are responsible for making sure something inside the body eventually makes the condition false; otherwise you have an **infinite loop** — the single most common beginner bug with \`while\`. Always ask: "which statement in the body changes the variables used in the condition?"
A **\`do-while\` loop** moves the check to the **end**: the body runs **at least once**, and then the condition decides whether to repeat. This is exactly what menu-driven programs need — show the menu, read the choice, and keep going until the user picks "Exit". It is also the natural fit for input validation ("ask for a number between 1 and 10; ask again if it is out of range"). Note the **semicolon after \`while (condition)\`** in a do-while — forgetting it is a compile error, and adding one after a normal \`while (condition);\` creates an empty infinite loop.
Both loops work with \`break\` (exit immediately) and \`continue\` (skip to the next check), which the next section covers in detail.`,
      codeSnippet: `// WhileDemo.java
import java.util.Scanner;

public class WhileDemo {
    public static void main(String[] args) {
        // 1. while: count the digits and sum them, iteration count unknown up front
        int number = 90210;
        int digits = 0, digitSum = 0;
        int temp = number;
        while (temp > 0) {
            digitSum += temp % 10;     // last digit
            temp /= 10;                // drop the last digit: this makes the loop terminate
            digits++;
        }
        System.out.println(number + " has " + digits + " digits, digit sum " + digitSum);
        // 90210 has 5 digits, digit sum 12

        // 2. while: compound interest, how many years to double Rs. 1,00,000 at 8%?
        double amount = 1_00_000;
        int years = 0;
        while (amount < 2_00_000) {
            amount *= 1.08;
            years++;
        }
        System.out.println("Doubles in " + years + " years");   // Doubles in 10 years

        // 3. do-while: input validation, body runs at least once
        Scanner sc = new Scanner(System.in);
        int choice;
        do {
            System.out.print("Enter a number between 1 and 5: ");
            choice = sc.nextInt();
            if (choice < 1 || choice > 5) {
                System.out.println("Out of range, try again.");
            }
        } while (choice < 1 || choice > 5);   // note the semicolon
        System.out.println("You chose " + choice);

        // 4. Difference demo: while may run zero times, do-while always runs once
        int k = 10;
        while (k < 5) {
            System.out.println("while body");      // never printed
        }
        do {
            System.out.println("do-while body");   // printed once
        } while (k < 5);

        sc.close();
    }
}`
    },
    {
      heading: "10. break, continue and Labeled Statements in Java",
      content: `Inside any loop, two statements change the normal flow:
• **\`break\`** terminates the **innermost** enclosing loop (or switch) immediately. Execution continues with the first statement after that loop. Use it when you have found what you were searching for and further iterations are pointless — this is also an optimization, because a linear search over a million records should stop at the first hit.
• **\`continue\`** skips the **rest of the current iteration** and jumps to the next one: in a \`for\` loop it runs the update part and then the condition; in a \`while\` loop it goes straight to the condition. Use it to skip invalid or irrelevant items without wrapping the whole body in an \`if\`.
Both statements only affect **one level** of loop. In nested loops, \`break\` leaves just the inner loop and the outer loop continues. When you need to escape **several levels** at once, Java provides **labeled statements**: write an identifier followed by a colon before the outer loop (\`outer:\`), then use \`break outer;\` or \`continue outer;\`. This is far cleaner than the alternatives (boolean flags checked at every level, or throwing an exception for control flow). Labeled breaks are common in matrix searches — "find the first cell equal to the target and stop both loops".
Two cautions. First, \`break\` inside a \`switch\` that is itself inside a loop exits only the switch, not the loop; use a label if you need to leave the loop from inside the switch. Second, labels are not \`goto\`: you cannot jump to arbitrary places, only break out of or continue a labeled enclosing loop, so they stay structured and readable. Use them sparingly, and prefer extracting the nested loops into a method that simply \`return\`s when you can.`,
      codeSnippet: `// BreakContinueLabels.java
public class BreakContinueLabels {
    public static void main(String[] args) {
        // break: linear search stops at the first match
        int[] rollNumbers = {101, 105, 110, 115, 120};
        int target = 110;
        int foundAt = -1;
        for (int i = 0; i < rollNumbers.length; i++) {
            if (rollNumbers[i] == target) {
                foundAt = i;
                break;                           // no need to check the remaining elements
            }
        }
        System.out.println("Found at index " + foundAt);   // Found at index 2

        // continue: skip negative readings when averaging sensor data
        int[] readings = {23, -1, 25, 27, -1, 24};
        int sum = 0, count = 0;
        for (int r : readings) {
            if (r < 0) {
                continue;                        // bad reading, skip to next
            }
            sum += r;
            count++;
        }
        System.out.println("Average valid reading: " + (double) sum / count);   // 24.75

        // Plain break in a nested loop only exits the inner loop
        for (int i = 1; i <= 3; i++) {
            for (int j = 1; j <= 3; j++) {
                if (j == 2) break;
                System.out.print("(" + i + "," + j + ") ");
            }
        }
        System.out.println();   // (1,1) (2,1) (3,1)

        // Labeled break: find the first cell equal to 7 in a 2D array and stop both loops
        int[][] grid = {
            {1, 2, 3},
            {4, 7, 6},
            {7, 8, 9}
        };
        int foundRow = -1, foundCol = -1;
        search:
        for (int r = 0; r < grid.length; r++) {
            for (int c = 0; c < grid[r].length; c++) {
                if (grid[r][c] == 7) {
                    foundRow = r;
                    foundCol = c;
                    break search;                // leaves BOTH loops
                }
            }
        }
        System.out.println("7 found at row " + foundRow + ", col " + foundCol);   // row 1, col 1

        // Labeled continue: abandon a row as soon as an even number appears
        int[][] rows = {
            {1, 3, 5},
            {2, 4},
            {7, 9}
        };
        rowLoop:
        for (int[] row : rows) {
            for (int value : row) {
                if (value % 2 == 0) {
                    continue rowLoop;            // skip the rest of this row, go to the next row
                }
                System.out.print(value + " ");
            }
            System.out.println("<- all odd");
        }
        // 1 3 5 <- all odd
        // 7 9 <- all odd        (the {2, 4} row is skipped entirely)
    }
}`
    },
    {
      heading: "11. Common Loop Patterns Every Java Developer Should Know",
      content: `Most loop code in real projects and in interviews is a variation of a dozen patterns. Learn them as building blocks and you will rarely be stuck on a loop problem again:
• **Accumulate** — start with an identity value (\`0\` for sum, \`1\` for product, empty string or \`StringBuilder\` for concatenation) and fold each element into it.
• **Track the best so far** — initialise \`max\` with the first element (not with \`0\`, which fails for all-negative data) and update it when a larger value appears. Keep the index too if you need "which" element.
• **Count matches** — a counter incremented inside an \`if\`.
• **Search with early exit** — \`break\` or \`return\` on the first match; return a sentinel like \`-1\` when nothing matches.
• **Digit processing** — \`n % 10\` extracts the last digit, \`n / 10\` removes it; reverse a number, sum digits, count digits, check an Armstrong number.
• **Reverse in place** — two indices moving toward each other, swapping elements.
• **Prime check** — test divisors from \`2\` to \`sqrt(n)\` only; one hit means not prime.
• **Fibonacci / running state** — keep two variables and shift them each iteration.
• **Nested loop over pairs** — \`for i, for j = i + 1\` visits every unordered pair exactly once (duplicate detection, bubble sort).
• **Sentinel-controlled input** — read until a special value like \`-1\` or "quit".
The program below implements the most-asked ones with expected outputs in comments. Type them out yourself; muscle memory for these patterns is what makes a 30-minute coding round comfortable. In later lectures the Streams API will give you a declarative way to write several of these (\`sum()\`, \`max()\`, \`filter().count()\`), but interviewers still expect you to write the loop version on a whiteboard.`,
      codeSnippet: `// LoopPatterns.java
public class LoopPatterns {

    static int reverseNumber(int n) {
        int reversed = 0;
        while (n != 0) {
            reversed = reversed * 10 + n % 10;
            n /= 10;
        }
        return reversed;
    }

    static boolean isPrime(int n) {
        if (n < 2) return false;
        for (int d = 2; (long) d * d <= n; d++) {   // only up to sqrt(n)
            if (n % d == 0) return false;
        }
        return true;
    }

    static boolean isArmstrong(int n) {            // 153 = 1^3 + 5^3 + 3^3
        int digits = String.valueOf(n).length();
        int sum = 0;
        for (int t = n; t > 0; t /= 10) {
            sum += (int) Math.pow(t % 10, digits);
        }
        return sum == n;
    }

    static long factorial(int n) {
        long result = 1;
        for (int i = 2; i <= n; i++) result *= i;
        return result;
    }

    public static void main(String[] args) {
        int[] data = {34, -5, 78, 12, 78, 3};

        // Max with index (initialise from the first element)
        int max = data[0], maxIndex = 0;
        for (int i = 1; i < data.length; i++) {
            if (data[i] > max) { max = data[i]; maxIndex = i; }
        }
        System.out.println("Max " + max + " at index " + maxIndex);   // Max 78 at index 2

        // Count elements above a threshold
        int above20 = 0;
        for (int v : data) if (v > 20) above20++;
        System.out.println("Values above 20: " + above20);           // 3

        // Reverse an array in place
        for (int i = 0, j = data.length - 1; i < j; i++, j--) {
            int tmp = data[i]; data[i] = data[j]; data[j] = tmp;
        }
        System.out.println(java.util.Arrays.toString(data));         // [3, 78, 12, 78, -5, 34]

        // Duplicate detection over all pairs
        boolean hasDuplicate = false;
        outer:
        for (int i = 0; i < data.length; i++) {
            for (int j = i + 1; j < data.length; j++) {
                if (data[i] == data[j]) { hasDuplicate = true; break outer; }
            }
        }
        System.out.println("Has duplicate: " + hasDuplicate);        // true

        // Fibonacci: first 10 terms
        int a = 0, b = 1;
        for (int i = 0; i < 10; i++) {
            System.out.print(a + " ");
            int next = a + b; a = b; b = next;
        }
        System.out.println();                                        // 0 1 1 2 3 5 8 13 21 34

        System.out.println(reverseNumber(12345));                    // 54321
        System.out.println(isPrime(97) + " " + isPrime(91));         // true false
        System.out.println(isArmstrong(153) + " " + isArmstrong(154)); // true false
        System.out.println(factorial(20));                           // 2432902008176640000

        // Primes between 1 and 50
        for (int n = 1; n <= 50; n++) if (isPrime(n)) System.out.print(n + " ");
        System.out.println();   // 2 3 5 7 11 13 17 19 23 29 31 37 41 43 47

        // GCD with while (Euclid)
        int x = 84, y = 36;
        while (y != 0) { int r = x % y; x = y; y = r; }
        System.out.println("GCD = " + x);                            // GCD = 12
    }
}`
    },
    {
      heading: "12. Pattern Printing Programs in Java for Interviews (Pyramids, Diamonds, Floyd's Triangle)",
      content: `**Pattern printing** questions are a rite of passage in Indian campus placements and first-round interviews at service companies. They are not about stars; they test whether you can **translate a picture into nested loops**, reason about **rows and columns**, and handle **spaces** correctly. Every pattern follows the same recipe:
1. **The outer loop is the row.** Count the rows in the picture: that is the outer loop's range (\`i = 1..n\`).
2. **Find the formula for each row.** Ask: how many spaces come first on row \`i\`? How many symbols? What value is printed at column \`j\`? Write those as expressions of \`i\`, \`j\` and \`n\`. For a right triangle, row \`i\` has \`i\` stars. For a centred pyramid of height \`n\`, row \`i\` has \`n - i\` leading spaces and \`2i - 1\` stars.
3. **One inner loop per segment.** Spaces loop, then symbols loop (sometimes a third loop for the decreasing half of a number pattern).
4. **End the row with \`println()\`.** Inside the inner loops use \`print\`, never \`println\`.
5. **Trace for n = 3 by hand** before running. Most mistakes are off-by-one in the ranges.
Helpful tools: \`" ".repeat(k)\` (Java 11) prints \`k\` spaces without an extra loop, and \`(char) ('A' + j)\` converts a column index to a letter for alphabet patterns. For an inverted shape, run the outer loop from \`n\` down to \`1\` or replace \`i\` with \`n - i + 1\` in the formulas. For a **diamond**, print a pyramid of height \`n\` followed by an inverted pyramid of height \`n - 1\`. For **Floyd's triangle**, keep a running counter that is printed and incremented rather than deriving the value from \`i\` and \`j\`.
The program below prints the six patterns that appear most often: right triangle, inverted triangle, centred pyramid, diamond, Floyd's triangle and the number pyramid (\`1 / 1 2 1 / 1 2 3 2 1\`). Compare each loop header against the output in the comments.`,
      codeSnippet: `// PatternPrinting.java
public class PatternPrinting {
    public static void main(String[] args) {
        int n = 4;

        // 1. Right triangle: row i has i stars
        // *
        // * *
        // * * *
        // * * * *
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= i; j++) {
                System.out.print("* ");
            }
            System.out.println();
        }

        // 2. Inverted right triangle: row i has n - i + 1 stars
        for (int i = n; i >= 1; i--) {
            for (int j = 1; j <= i; j++) {
                System.out.print("* ");
            }
            System.out.println();
        }

        // 3. Centred pyramid: n - i spaces, then 2i - 1 stars
        //    *
        //   ***
        //  *****
        // *******
        for (int i = 1; i <= n; i++) {
            System.out.print(" ".repeat(n - i));
            for (int j = 1; j <= 2 * i - 1; j++) {
                System.out.print("*");
            }
            System.out.println();
        }

        // 4. Diamond: pyramid of height n + inverted pyramid of height n - 1
        for (int i = 1; i <= n; i++) {
            System.out.println(" ".repeat(n - i) + "*".repeat(2 * i - 1));
        }
        for (int i = n - 1; i >= 1; i--) {
            System.out.println(" ".repeat(n - i) + "*".repeat(2 * i - 1));
        }

        // 5. Floyd's triangle: running counter
        // 1
        // 2 3
        // 4 5 6
        // 7 8 9 10
        int counter = 1;
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= i; j++) {
                System.out.print(counter++ + " ");
            }
            System.out.println();
        }

        // 6. Number pyramid 1 2 3 2 1
        //    1
        //   121
        //  12321
        // 1234321
        for (int i = 1; i <= n; i++) {
            System.out.print(" ".repeat(n - i));
            for (int j = 1; j <= i; j++) System.out.print(j);        // increasing half
            for (int j = i - 1; j >= 1; j--) System.out.print(j);    // decreasing half
            System.out.println();
        }

        // 7. Alphabet triangle using char arithmetic
        // A
        // A B
        // A B C
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j <= i; j++) {
                System.out.print((char) ('A' + j) + " ");
            }
            System.out.println();
        }
    }
}`
    },
    {
      heading: "13. Real-World Use Cases: How Control Flow Is Used in Production Java",
      content: `Control flow is not an academic topic — it is the skeleton of every service you will write. Here is how each construct shows up in production code, so you can recognise good usage when you read Spring Boot projects on GitHub or at work:
• **Validation with guard clauses.** A REST controller or service method typically begins with a stack of \`if (...) throw new IllegalArgumentException(...)\` lines. Flat guard clauses are preferred over nested ifs because they keep the business logic un-indented and make each rule testable.
• **State machines with switch expressions.** Order processing (\`CREATED → PAID → SHIPPED → DELIVERED\`), payment status handling and workflow engines use \`switch\` over an \`enum\` to decide the next state. Because an enum switch expression is exhaustive, adding a new state like \`REFUNDED\` makes the compiler flag every switch that has not handled it — a huge safety net in large code bases.
• **Dispatching on message types with pattern matching.** Kafka consumers and event handlers that receive a sealed \`Event\` hierarchy use Java 21 pattern switch: \`case OrderPlaced op -> ...\`, \`case PaymentFailed pf -> ...\`. This replaces fragile \`instanceof\` chains.
• **Batch processing loops.** Nightly jobs iterate over thousands of records with an enhanced for loop, \`continue\` past rows that fail validation (logging them), and \`break\` when a hard limit or deadline is hit.
• **Retry with backoff.** A \`while (attempt < maxAttempts)\` or \`do-while\` loop wraps a network call, sleeping between attempts; resilience libraries such as Resilience4j do this internally.
• **Pagination.** "Fetch a page, process it, fetch the next page until the page is empty" is a \`do-while\` loop by nature: you always fetch at least once.
• **Rate and slab calculations.** GST slabs, electricity tariffs, income-tax brackets and shipping charges by weight are if-else ladders or switch expressions. Writing them with the highest threshold first and covering the default is exactly the ordering discipline from section 2.
• **Console tools and CLIs.** Internal admin tools, migration scripts and interview take-home assignments use a \`do-while\` menu loop with a switch over the user's choice — the structure you will build in the hands-on exercise.
One production rule above all: **keep loop bodies small and give them a name.** If the body of a loop is longer than about 15 lines, extract it into a method such as \`processOrder(order)\`. The loop then reads like a sentence, and the method can be unit-tested with JUnit 5 in isolation.`
    },
    {
      heading: "14. Common Mistakes with Java Conditionals, Switch and Loops, and How to Fix Them",
      content: `These are the mistakes that appear again and again in beginner code, code reviews and failed interview submissions. Each one comes with the fix.
• **Missing \`break\` in a classic switch.** Symptom: several branches run. Fix: add \`break\`, or better, switch to **arrow labels** (\`case 1 -> ...\`) which never fall through.
• **Comparing strings with \`==\`.** \`if (city == "Pune")\` compares references and is often \`false\` even when the text matches (for example when the value came from user input). Fix: \`city.equals("Pune")\` or \`"Pune".equals(city)\` (null-safe), or use a \`switch\` on the String, which uses \`equals\` internally.
• **Off-by-one errors.** \`for (int i = 0; i <= arr.length; i++)\` throws \`ArrayIndexOutOfBoundsException\` on the last iteration. Fix: use \`<\` with zero-based indices and \`<=\` only when counting from 1. Trace the first and last iteration by hand.
• **Infinite loops.** The condition variable is never updated (\`while (i < 10) { System.out.println(i); }\`) or is updated in the wrong direction. Fix: identify the statement that moves the loop toward termination and make sure it runs on every path, including after a \`continue\`.
• **Floating-point loop counters.** \`for (double d = 0; d != 1.0; d += 0.1)\` never terminates because \`0.1\` is not exactly representable and \`d\` skips over \`1.0\`. Fix: loop with an \`int\` counter and compute the double inside, or use \`<\` rather than \`!=\`.
• **Integer overflow in a counter.** \`for (byte b = 0; b < 200; b++)\` loops forever because a \`byte\` wraps from 127 to -128 and never reaches 200. Fix: use \`int\`, and use \`long\` for sums that may exceed about 2.1 billion.
• **Semicolon after the loop header.** \`for (int i = 0; i < 5; i++);\` followed by a block runs the block only once; \`while (cond);\` is an infinite empty loop. Fix: never put \`;\` directly after \`for\`/\`while\`/\`if\` headers; modern IDEs warn about this.
• **Modifying a list inside an enhanced for loop.** Throws \`ConcurrentModificationException\`. Fix: \`removeIf\`, an explicit \`Iterator\`, or collect items to remove in a separate list first.
• **Non-exhaustive switch expression.** Compile error "the switch expression does not cover all possible input values". Fix: add a \`default\` for int/String selectors; for enums, list every constant (preferable, because the compiler then guards future additions).
• **Mixing arrow and colon labels** in the same switch, or using \`break\` with a value inside a switch expression. Fix: use \`yield\` to produce a value from a block, and pick one label style per switch.
• **Wrong \`else if\` order.** Testing \`marks >= 40\` before \`marks >= 90\` makes every passing student a "C". Fix: order ranges from most specific or highest to lowest.
• **Unreachable code after \`break\` or \`continue\`.** Java reports a compile error, not a warning. Fix: remove the dead statements.`,
      codeSnippet: `// CommonMistakes.java  (each mistake shown with its fix)
import java.util.ArrayList;
import java.util.List;

public class CommonMistakes {
    public static void main(String[] args) {
        // 1. String comparison
        String input = new String("Pune");
        System.out.println(input == "Pune");        // false (different objects)
        System.out.println(input.equals("Pune"));   // true

        // 2. Off-by-one
        int[] arr = {10, 20, 30};
        // for (int i = 0; i <= arr.length; i++) System.out.println(arr[i]);  // crashes at i = 3
        for (int i = 0; i < arr.length; i++) System.out.print(arr[i] + " ");
        System.out.println();

        // 3. Floating-point counter: use an int counter instead
        for (int step = 0; step <= 10; step++) {
            double d = step / 10.0;
            System.out.print(d + " ");
        }
        System.out.println();

        // 4. Integer overflow in a sum: use long
        long sum = 0;
        for (int i = 1; i <= 100_000; i++) sum += i;
        System.out.println(sum);                     // 5000050000 (would overflow an int)

        // 5. Removing while iterating
        List<String> names = new ArrayList<>(List.of("Amit", "Bhavna", "Chirag"));
        names.removeIf(n -> n.startsWith("B"));
        System.out.println(names);                   // [Amit, Chirag]

        // 6. Exhaustive switch expression with default
        int code = 404;
        String message = switch (code) {
            case 200 -> "OK";
            case 404 -> "Not Found";
            case 500 -> "Server Error";
            default -> "Unknown status";             // without this: compile error
        };
        System.out.println(message);
    }
}`
    },
    {
      heading: "15. Frequently Asked Questions about Java Control Flow",
      content: `**What is the difference between a switch statement and a switch expression in Java?**
A switch statement (Java 1.0) executes code but produces no value, uses colon labels and falls through between cases unless you write \`break\`. A switch expression (final in Java 14, JEP 361) produces a value that you can assign or return, uses arrow labels (\`case X ->\`) that never fall through, allows comma-separated labels, and must be exhaustive. Use \`yield\` inside a block branch to return its value.

**Which Java version introduced switch expressions, and which added pattern matching for switch?**
Switch expressions were previewed in Java 12 and 13 and became final in Java 14. Pattern matching for switch (type patterns, guards with \`when\`, \`case null\`) and record patterns became final in Java 21. Neither is available in Java 8 or 11; Java 17 has switch expressions but not pattern matching for switch.

**When should I use a while loop instead of a for loop in Java?**
Use \`for\` when the number of iterations is known or derived from a size (arrays, "n times"). Use \`while\` when the loop is driven by a condition whose end is unknown in advance, such as reading input until a sentinel, retrying until success or reducing a number until it reaches zero. Use \`do-while\` when the body must run at least once, like a menu or an input prompt.

**What is the difference between break and continue in Java?**
\`break\` exits the innermost loop (or switch) entirely and resumes after it. \`continue\` abandons only the current iteration and jumps to the next condition check (running the update part of a \`for\` loop first). Both affect one level unless you use a labeled statement such as \`break outer;\`.

**Can we use a switch on a String, long, double or boolean in Java?**
A switch on \`String\` is allowed since Java 7 and uses \`equals\` semantics. Classic constant switches on \`long\`, \`float\`, \`double\` and \`boolean\` are not allowed in standard Java, including Java 25. Primitive type patterns in switch (JEP 507) are only a preview feature in Java 25 and require \`--enable-preview\`, so do not rely on them in production.

**Why does Java not allow if (number) like C or JavaScript?**
Java requires the condition of \`if\`, \`while\`, \`for\` and the ternary operator to be of type \`boolean\`. There is no implicit conversion from \`int\`, \`null\` or empty strings to a boolean. This prevents the classic \`if (x = 5)\` bug and makes intent explicit: write \`if (number != 0)\`.

**What is a labeled break in Java and when should I use it?**
A label is an identifier followed by a colon placed before a loop (\`outer:\`). \`break outer;\` exits that specific loop even from inside nested inner loops, and \`continue outer;\` moves to its next iteration. Use it for multi-level searches in matrices; otherwise prefer extracting the nested loops into a method that returns.

**Is the enhanced for loop slower than the classic for loop?**
No. For arrays the compiler generates nearly identical bytecode, and for collections it uses an \`Iterator\`, which is the correct and efficient way to traverse a \`LinkedList\` or \`Set\`. Choose the enhanced for loop for readability whenever you do not need the index.`
    },
    {
      heading: "16. Interview Questions and Answers on Java Conditionals, Switch and Loops",
      content: `**Q1. Explain fall-through in a switch statement. How do you avoid it?**
In a classic switch with colon labels, after a matching case the execution continues into the following cases until a \`break\` is reached. It is avoided by writing \`break\` at the end of every case or, in Java 14 and later, by using arrow labels (\`case 1 -> ...\`), which execute exactly one branch and never fall through.

**Q2. What is yield in Java and when is it required?**
\`yield\` is a contextual keyword introduced with switch expressions in Java 14. It returns a value from a block-bodied case in a switch expression (\`case 2 -> { ...; yield 10; }\`), or from colon-label cases inside a switch expression. It is not used in switch statements and is not a reserved word, so a variable can still be named \`yield\`.

**Q3. What does it mean that a switch expression must be exhaustive?**
Every possible value of the selector must be matched by some case. For \`int\`, \`char\` or \`String\` selectors this requires a \`default\`. For an \`enum\` or a sealed type, covering all constants or permitted subtypes is sufficient, and the compiler reports an error if one is missing — which is why switch expressions over enums are safer than if-else ladders.

**Q4. What is the output of a loop that declares \`for (int i = 0; i < 5; i++);\` followed by a block?**
The semicolon ends the loop with an empty body, so the loop runs five times doing nothing, and the block runs once afterwards. Note that \`i\` is out of scope in the block, so referencing it there is a compile error.

**Q5. Difference between while and do-while, with a real use case.**
\`while\` checks the condition before each iteration and may run zero times; \`do-while\` checks after the body and always runs at least once. Menu-driven programs and input validation loops are the classic use cases for \`do-while\` because the prompt must be shown at least once.

**Q6. How do you break out of two nested loops in Java?**
Use a labeled break: place \`outer:\` before the outer loop and write \`break outer;\` inside the inner loop. Alternatives are a boolean flag checked by both loops, or moving the loops into a method and using \`return\`. Java has no \`goto\`.

**Q7. Why does \`for (double d = 0; d != 1; d += 0.1)\` never end?**
Because \`0.1\` cannot be represented exactly in binary floating point, after ten additions \`d\` is approximately \`0.9999999999999999\`, then \`1.0999999999999999\`, never exactly \`1.0\`. Use an integer counter or a \`<\` comparison.

**Q8. Can you modify an ArrayList inside an enhanced for loop?**
Not structurally: adding or removing elements throws \`ConcurrentModificationException\` on the next iteration because the list's modification count no longer matches the iterator's. Use \`Iterator.remove()\`, \`removeIf\`, or iterate over a copy. Changing the state of the element objects themselves is fine.

**Q9. What is pattern matching for switch and which Java version made it final?**
It lets case labels be type patterns (\`case String s\`), record patterns (\`case Point(int x, int y)\`) and guarded patterns (\`case Integer i when i > 0\`), with support for \`case null\`. The selector can be any reference type. It became final in Java 21 (JEP 441 and JEP 440).

**Q10. Write the logic for a centred star pyramid of height n.**
For row \`i\` from 1 to n, print \`n - i\` spaces followed by \`2i - 1\` stars, then a newline. In Java 11+: \`System.out.println(" ".repeat(n - i) + "*".repeat(2 * i - 1));\`. Interviewers then often ask for the inverted version (loop \`i\` from n down to 1) or a diamond (pyramid plus inverted pyramid of height n - 1).`
    },
    {
      heading: "17. Hands-On Exercise: Menu-Driven Number Toolkit Using Every Control-Flow Construct",
      content: `Build a console program that brings together everything in this lecture: a \`do-while\` menu loop, a **switch expression** to map the user's choice to an action, \`if/else\` validation, classic and enhanced \`for\` loops, a \`while\` digit loop, \`break\`, \`continue\` and a **labeled break**. The program offers these options:
1. Check whether a number is prime.
2. Print the multiplication table of a number.
3. Reverse a number and report whether it is a palindrome.
4. Print a centred star pyramid of a given height.
5. Convert marks to a grade with a switch expression.
6. Find a value in a 3 × 3 matrix using a labeled break.
7. Exit.
Save the file as \`NumberToolkit.java\`, compile with \`javac NumberToolkit.java\`, and run with \`java NumberToolkit\` (or simply \`java NumberToolkit.java\` on Java 11+). The program uses only standard-library classes and runs on **Java 21 and Java 25**. After it works, extend it yourself: add an option that prints Floyd's triangle, add input validation that rejects negative numbers with \`continue\`, and convert the grade logic to use an \`enum\` so the switch becomes exhaustive without a \`default\`. Those three extensions are typical follow-up questions in a practical interview round.`,
      codeSnippet: `// NumberToolkit.java  (Java 17+ for switch expressions; tested on Java 21 and 25)
import java.util.Scanner;

public class NumberToolkit {

    static boolean isPrime(int n) {
        if (n < 2) return false;
        for (int d = 2; (long) d * d <= n; d++) {
            if (n % d == 0) return false;
        }
        return true;
    }

    static void printTable(int n) {
        for (int i = 1; i <= 10; i++) {
            System.out.printf("%d x %2d = %3d%n", n, i, n * i);
        }
    }

    static int reverse(int n) {
        int reversed = 0;
        while (n > 0) {
            reversed = reversed * 10 + n % 10;
            n /= 10;
        }
        return reversed;
    }

    static void printPyramid(int height) {
        for (int i = 1; i <= height; i++) {
            System.out.println(" ".repeat(height - i) + "*".repeat(2 * i - 1));
        }
    }

    static String gradeFor(int marks) {
        if (marks < 0 || marks > 100) {
            return "Invalid marks";
        }
        return switch (marks / 10) {
            case 10, 9 -> "A+";
            case 8 -> "A";
            case 7 -> "B";
            case 6 -> "C";
            case 5, 4 -> "D";
            default -> "F";
        };
    }

    static String locate(int[][] matrix, int target) {
        search:
        for (int r = 0; r < matrix.length; r++) {
            for (int c = 0; c < matrix[r].length; c++) {
                if (matrix[r][c] == target) {
                    return "Found " + target + " at row " + r + ", column " + c;
                }
                if (matrix[r][c] > target) {
                    break search;              // rows are sorted ascending: stop early
                }
            }
        }
        return target + " not found";
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int[][] matrix = {
            {2, 5, 8},
            {11, 14, 17},
            {20, 23, 26}
        };
        int choice = 0;

        do {
            System.out.println();
            System.out.println("===== Number Toolkit =====");
            System.out.println("1. Prime check");
            System.out.println("2. Multiplication table");
            System.out.println("3. Reverse and palindrome check");
            System.out.println("4. Star pyramid");
            System.out.println("5. Marks to grade");
            System.out.println("6. Search the matrix");
            System.out.println("7. Exit");
            System.out.print("Enter choice: ");

            if (!sc.hasNextInt()) {              // non-numeric input: discard and re-prompt
                System.out.println("Please enter a number.");
                sc.next();
                choice = 0;
                continue;
            }
            choice = sc.nextInt();

            String result = switch (choice) {
                case 1 -> {
                    System.out.print("Enter a number: ");
                    int n = sc.nextInt();
                    yield n + (isPrime(n) ? " is prime" : " is not prime");
                }
                case 2 -> {
                    System.out.print("Enter a number: ");
                    printTable(sc.nextInt());
                    yield "Table printed";
                }
                case 3 -> {
                    System.out.print("Enter a positive number: ");
                    int n = sc.nextInt();
                    if (n < 0) {
                        yield "Negative numbers are not supported";
                    }
                    int rev = reverse(n);
                    yield "Reversed: " + rev + (rev == n ? " (palindrome)" : " (not a palindrome)");
                }
                case 4 -> {
                    System.out.print("Enter height (1-20): ");
                    int h = sc.nextInt();
                    if (h < 1 || h > 20) {
                        yield "Height must be between 1 and 20";
                    }
                    printPyramid(h);
                    yield "Pyramid printed";
                }
                case 5 -> {
                    System.out.print("Enter marks (0-100): ");
                    yield "Grade: " + gradeFor(sc.nextInt());
                }
                case 6 -> {
                    System.out.print("Enter value to find: ");
                    yield locate(matrix, sc.nextInt());
                }
                case 7 -> "Goodbye!";
                default -> "Invalid choice, pick 1 to 7";
            };
            System.out.println(result);

        } while (choice != 7);

        sc.close();
    }
}

/* Sample session:
===== Number Toolkit =====
...
Enter choice: 1
Enter a number: 97
97 is prime

Enter choice: 3
Enter a positive number: 12321
Reversed: 12321 (palindrome)

Enter choice: 4
Enter height (1-20): 3
  *
 ***
*****
Pyramid printed

Enter choice: 5
Enter marks (0-100): 83
Grade: A

Enter choice: 6
Enter value to find: 14
Found 14 at row 1, column 1

Enter choice: 7
Goodbye!
*/`
    },
    {
      heading: "18. Summary",
      content: `• **Control flow** decides which statements run and how many times: conditionals (\`if\`/\`else\`, ternary), selection (\`switch\`) and loops (\`for\`, enhanced \`for\`, \`while\`, \`do-while\`).
• Java conditions must be **\`boolean\`**; there is no truthy/falsy conversion, which stops \`if (x = 5)\` at compile time. Always use braces and order else-if ladders from the most specific range downward.
• Flatten deep nesting with **short-circuit \`&&\`/\`||\`**, **guard clauses** and extracted methods; use the **ternary operator** only for simple value selection.
• The **classic switch** falls through without \`break\`, accepts only constants, and throws on a \`null\` String selector.
• **Switch expressions** (final in **Java 14**) use arrow labels with no fall-through, allow multiple labels per case, must be **exhaustive**, return a value and use **\`yield\`** inside block branches.
• **Pattern matching for switch** (final in **Java 21**) adds type patterns, record patterns, \`when\` guards and \`case null\`. Primitive type patterns are still **preview** in Java 25 — do not use them in production.
• Use **\`for\`** for counted loops, **enhanced \`for\`** to visit every element without an index, **\`while\`** for condition-driven loops and **\`do-while\`** when the body must run at least once (menus, validation).
• **\`break\`** exits the innermost loop, **\`continue\`** skips to the next iteration, and **labels** (\`break outer;\`) control nested loops without flags.
• Know the standard loop patterns — accumulate, max-so-far, search with early exit, digit processing, two-pointer reverse, prime check, Fibonacci, pairwise nested loops — and the pattern-printing recipe: outer loop = row, formulas for spaces and symbols in terms of \`i\` and \`n\`.
• Avoid the classic mistakes: missing \`break\`, \`==\` on strings, off-by-one, floating-point counters, overflowing counters, stray semicolons after loop headers and modifying a list inside a for-each loop.
**Next lecture:** Methods, Arrays & Strings`
    }
  ]
};
