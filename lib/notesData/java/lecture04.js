export const lecture04 = {
  slug: "lecture-4",
  number: 4,
  title: "Complete Java Course — Lecture 4: Methods, Arrays & Strings",
  summary: "Learn Java methods (parameters, return types, pass-by-value, overloading, varargs, recursion), one and two-dimensional arrays with the Arrays utility class, and Strings: immutability, the string pool, equals vs ==, common String methods, StringBuilder, text blocks and String.format.",
  readTime: "60 min read",
  difficulty: "Beginner",
  date: "2026-10-09",
  sections: [
    {
      heading: "1. Why Methods, Arrays and Strings Are the Core of Everyday Java",
      content: `In Lecture 3 you learned to control the flow of a program with conditionals, switch expressions and loops. This lecture adds the three building blocks that every real Java program is made of: **methods** (named, reusable blocks of logic), **arrays** (fixed-size containers that hold many values of one type) and **Strings** (text, which is what almost all business data eventually becomes: names, addresses, JSON, SQL, log lines).
Open any production codebase, whether it is a Spring Boot microservice at a Bengaluru fintech, an Android app or a batch job at a bank, and you will find the same pattern everywhere: methods that accept parameters, work on arrays or collections, and build or parse strings. A controller method validates a request string, a service method computes totals over an array of amounts, and a repository method builds a query string. If you are weak on these fundamentals, every later topic (OOP, collections, streams, Spring) feels harder than it should.
These topics are also an interview favourite because they expose whether you really understand the JVM. Classic questions include: is Java pass-by-value or pass-by-reference? Why is \`String\` immutable? What is the difference between \`==\` and \`equals()\`? Why is \`StringBuilder\` faster inside a loop? What is the string pool? By the end of this lecture you will be able to answer all of them with confidence and with code.
We will go step by step: define methods, understand how arguments are passed, overload them, accept variable arguments, write recursive methods, then move to arrays and the \`Arrays\` helper class, and finally spend a large part of the lecture on Strings, because that is where beginners make the most expensive mistakes.`,
      codeSnippet: `// Preview.java — the three building blocks in one tiny program
public class Preview {

    // a method: takes an array of marks, returns the average
    static double average(int[] marks) {
        int total = 0;
        for (int m : marks) total += m;
        return marks.length == 0 ? 0 : (double) total / marks.length;
    }

    public static void main(String[] args) {
        int[] marks = {78, 92, 65, 88};                 // an array
        String student = "Priya Sharma";                // a String
        double avg = average(marks);                    // a method call
        System.out.println(student + " scored " + avg); // Priya Sharma scored 80.75
    }
}`
    },
    {
      heading: "2. Defining Methods in Java: Signature, Parameters and Return Types",
      content: `A **method** is a named block of code that performs one task. Instead of copying the same ten lines in five places, you write them once and call the method by name. The general form is: modifiers, then the **return type**, then the **method name**, then a **parameter list** in parentheses, then the body in braces.
• **Return type** — the type of value the method gives back, or \`void\` if it gives back nothing. A non-void method must end every path with a \`return\` statement of that type, otherwise the code does not compile.
• **Parameters** — typed variables declared in the parentheses. The values you pass when calling the method are called **arguments**. Parameter names are local to the method.
• **Method signature** — the method name plus the ordered list of parameter types. The return type and parameter names are **not** part of the signature. This matters for overloading, which we cover next.
• **static** — for now all our methods are \`static\`, which means they belong to the class and can be called without creating an object. Instance methods come in the next lecture on OOP.
Naming conventions: method names are verbs in \`camelCase\` such as \`calculateGst\`, \`isValidPan\`, \`findCustomerById\`. A good method does one thing, has a name that says what it does, and is short enough to read on one screen. Prefer **early returns** for guard conditions instead of deeply nested \`if\` blocks.
Calling a method pushes a new **stack frame** onto the call stack holding its parameters and local variables; when the method returns, the frame is discarded. This is why local variables of one method are invisible to another.`,
      codeSnippet: `// Billing.java
public class Billing {

    // returns a value; parameters are copies of the arguments
    static double applyGst(double amount, double ratePercent) {
        return amount + amount * ratePercent / 100;
    }

    // void method: performs an action, returns nothing
    static void printInvoice(String customer, double total) {
        System.out.println("Customer: " + customer);
        System.out.println("Total   : Rs " + total);
    }

    // early return keeps the logic flat and readable
    static boolean isEligibleForEmi(int age, double monthlyIncome) {
        if (age < 21) return false;
        if (monthlyIncome < 15000) return false;
        return true;
    }

    public static void main(String[] args) {
        double total = applyGst(1000, 18);        // 1180.0
        printInvoice("Rahul Verma", total);
        System.out.println(isEligibleForEmi(25, 32000)); // true
        System.out.println(isEligibleForEmi(19, 50000)); // false
    }
}`
    },
    {
      heading: "3. Pass-by-Value Semantics in Java: Primitives vs Object References",
      content: `This is one of the most misunderstood topics in Java interviews, so let us be precise: **Java is always pass-by-value.** When you call a method, the value of each argument is **copied** into the parameter. There is no pass-by-reference in Java at all.
The confusion comes from what the "value" is:
• For a **primitive** (\`int\`, \`double\`, \`boolean\`, \`char\`...), the value is the number itself. The method gets a copy; changing the parameter never affects the caller's variable.
• For an **object** (arrays, Strings, your own classes), the variable holds a **reference** (think of it as the address of the object on the heap). The method receives a **copy of that reference**. Both the caller and the method now point to the **same object**, so if the method modifies the object's contents (for example sets \`arr[0] = 99\`), the caller sees the change. But if the method **reassigns** its parameter to a new object (\`arr = new int[5]\`), only the method's local copy of the reference changes; the caller's variable still points to the original object.
A simple mental model: the method gets a photocopy of your key, not your key. With the photocopy it can open your locker and rearrange things inside (modify the object), but if it throws the photocopy away and picks up another key (reassignment), your original key is unaffected.
This is also why a classic \`swap(int a, int b)\` method does nothing in Java, and why \`String\` parameters appear "unchangeable" inside methods: Strings are immutable, so there is nothing to modify in place, and reassigning the parameter is invisible to the caller.`,
      codeSnippet: `// PassByValue.java
public class PassByValue {

    static void tryToSwap(int a, int b) {
        int temp = a; a = b; b = temp;       // swaps the local copies only
    }

    static void modifyContents(int[] arr) {
        arr[0] = 99;                          // same object as the caller's -> visible
    }

    static void reassign(int[] arr) {
        arr = new int[]{7, 7, 7};             // local reference now points elsewhere
        arr[0] = 100;                         // caller's array untouched
    }

    static void changeName(String name) {
        name = name.toUpperCase();            // new String assigned to the local copy
    }

    public static void main(String[] args) {
        int x = 1, y = 2;
        tryToSwap(x, y);
        System.out.println(x + " " + y);      // 1 2  (unchanged)

        int[] nums = {1, 2, 3};
        modifyContents(nums);
        System.out.println(nums[0]);          // 99  (contents changed)

        reassign(nums);
        System.out.println(nums[0]);          // 99  (still the original object)

        String city = "pune";
        changeName(city);
        System.out.println(city);             // pune (unchanged)
    }
}`
    },
    {
      heading: "4. Method Overloading and Varargs in Java",
      content: `**Method overloading** means defining several methods with the **same name but different parameter lists** in one class. The parameter lists must differ in the **number**, **types** or **order** of parameters. Changing only the return type is not overloading and will not compile, because the return type is not part of the signature.
Overloading is everywhere in the JDK: \`System.out.println\` has versions for \`int\`, \`double\`, \`char[]\`, \`String\`, \`Object\` and more, so you never have to remember separate method names. Use it when the operation is conceptually the same and only the input differs.
How does the compiler choose? At **compile time** (not runtime) it looks for the most specific match in three phases: first exact matches and primitive **widening** (\`int\` to \`long\` to \`double\`), then **autoboxing** (\`int\` to \`Integer\`), and only then **varargs**. So \`print(5)\` with overloads \`print(long)\` and \`print(Integer)\` picks \`print(long)\`. If two candidates are equally specific, you get an "ambiguous method call" compile error. A famous case is calling \`m(null)\` when both \`m(String)\` and \`m(Integer)\` exist.
**Varargs** (variable-length arguments, since Java 5) let a method accept zero or more values of one type with the syntax \`type... name\`. Inside the method the parameter is simply an **array**. Rules: a method can have **only one** varargs parameter and it must be the **last** parameter. \`String.format\`, \`List.of\`, \`Arrays.asList\` and most logging frameworks use varargs, which is why you can write \`List.of(1, 2, 3)\`. Avoid overloading a varargs method with a single-argument version of the same type; the resolution rules become confusing for readers.`,
      codeSnippet: `// Overloading.java
public class Overloading {

    static int area(int side)                  { return side * side; }
    static int area(int length, int breadth)   { return length * breadth; }
    static double area(double radius)          { return Math.PI * radius * radius; }

    static void show(long n)    { System.out.println("long " + n); }
    static void show(Integer n) { System.out.println("Integer " + n); }

    // varargs: zero or more ints, received as int[]
    static int sum(int... numbers) {
        int total = 0;
        for (int n : numbers) total += n;
        return total;
    }

    // a normal parameter before the varargs parameter is allowed
    static String tag(String prefix, String... items) {
        return prefix + ": " + String.join(", ", items) + " (" + items.length + ")";
    }

    public static void main(String[] args) {
        System.out.println(area(4));          // 16
        System.out.println(area(4, 5));       // 20
        System.out.println(area(2.0));        // 12.566370614359172
        show(10);                             // long 10   (widening beats boxing)
        System.out.println(sum());            // 0
        System.out.println(sum(10, 20, 30));  // 60
        System.out.println(sum(new int[]{1, 2})); // 3 (an array works too)
        System.out.println(tag("Cities", "Delhi", "Mumbai", "Chennai"));
        // Cities: Delhi, Mumbai, Chennai (3)
    }
}`
    },
    {
      heading: "5. Recursion in Java: Base Case, Recursive Case and the Call Stack",
      content: `A **recursive method** is a method that calls itself. It solves a problem by reducing it to a smaller version of the same problem until it reaches a case so simple that the answer is known directly. Every correct recursive method has two parts:
• **Base case** — the condition that stops the recursion and returns a direct answer (for example, factorial of 0 is 1).
• **Recursive case** — the method calls itself with an input that moves **closer to the base case** (for example, \`n * factorial(n - 1)\`).
Each call creates a new stack frame, so a recursion that is 10,000 levels deep holds 10,000 frames at once. If you forget the base case, or the input never shrinks, the JVM throws a \`StackOverflowError\`. With the default thread stack size, even a simple recursive method usually fails after a few tens of thousands of nested calls, so recursion is not a tool for iterating over a million-element array. Use a loop for that.
Where recursion shines is **naturally recursive data**: directory trees, nested JSON, organisation charts, linked structures, and divide-and-conquer algorithms such as binary search, merge sort and quicksort. In those cases the recursive solution is shorter and clearer than the iterative one.
Watch out for **exponential recursion**. The naive Fibonacci implementation recomputes the same values millions of times; \`fib(45)\` takes seconds while the memoised version is instant. **Memoisation** (caching results in an array or map) turns exponential time into linear time. Interviewers love asking you to spot this.`,
      codeSnippet: `// Recursion.java
import java.util.Arrays;

public class Recursion {

    static long factorial(int n) {
        if (n <= 1) return 1;                 // base case
        return n * factorial(n - 1);          // recursive case
    }

    static int sumOfDigits(int n) {
        if (n < 10) return n;
        return n % 10 + sumOfDigits(n / 10);
    }

    // naive: exponential time, recomputes fib(n-2) again and again
    static long fibSlow(int n) {
        if (n < 2) return n;
        return fibSlow(n - 1) + fibSlow(n - 2);
    }

    // memoised: each fib(k) computed once
    static long fibFast(int n, long[] memo) {
        if (n < 2) return n;
        if (memo[n] != 0) return memo[n];
        return memo[n] = fibFast(n - 1, memo) + fibFast(n - 2, memo);
    }

    // recursive binary search on a sorted array; returns index or -1
    static int binarySearch(int[] a, int target, int low, int high) {
        if (low > high) return -1;
        int mid = (low + high) >>> 1;
        if (a[mid] == target) return mid;
        return a[mid] < target
                ? binarySearch(a, target, mid + 1, high)
                : binarySearch(a, target, low, mid - 1);
    }

    public static void main(String[] args) {
        System.out.println(factorial(10));            // 3628800
        System.out.println(sumOfDigits(98765));       // 35
        System.out.println(fibFast(50, new long[51])); // 12586269025
        int[] sorted = {3, 8, 15, 21, 42, 57, 90};
        System.out.println(binarySearch(sorted, 42, 0, sorted.length - 1)); // 4
        System.out.println(Arrays.toString(sorted));
    }
}`
    },
    {
      heading: "6. One-Dimensional Arrays in Java: Declaration, Default Values and Iteration",
      content: `An **array** is a fixed-size, ordered container of elements that all have the **same type**. Once created, its length can never change; if you need a growable list you will use \`ArrayList\` (covered in the Collections lecture). Arrays are **objects** that live on the heap, even when they hold primitives, so an array variable is a reference.
Three ways to create one:
• \`int[] marks = new int[5];\` — five slots, each filled with the **default value**: \`0\` for numeric types, \`false\` for \`boolean\`, \`'\\u0000'\` for \`char\`, and \`null\` for every reference type including \`String\`.
• \`int[] marks = {78, 92, 65};\` — an **array initialiser**, allowed only at the point of declaration.
• \`marks = new int[]{78, 92, 65};\` — the form you use when assigning later or passing an array as an argument.
Indexes start at **0** and end at \`length - 1\`. \`length\` is a **field**, not a method (compare \`String.length()\`, which is a method, and \`List.size()\`). Reading \`marks[5]\` on a five-element array throws \`ArrayIndexOutOfBoundsException: Index 5 out of bounds for length 5\`, which is probably the single most common runtime exception beginners see.
Iterate with a classic \`for\` loop when you need the index (to modify elements or print positions), and with the **enhanced for** loop (\`for (int m : marks)\`) when you only need the values. Note that assigning to the loop variable in an enhanced for loop does **not** change the array.
Because arrays are objects, \`int[] copy = marks;\` does not copy the data; both variables point at the same array. Use \`marks.clone()\` or \`Arrays.copyOf\` for a real copy. The style \`int marks[]\` is legal but discouraged; always write \`int[] marks\` so the type reads as "int array".`,
      codeSnippet: `// ArrayBasics.java
public class ArrayBasics {
    public static void main(String[] args) {
        int[] marks = new int[5];               // [0, 0, 0, 0, 0]
        marks[0] = 78; marks[1] = 92; marks[2] = 65; marks[3] = 88; marks[4] = 71;

        String[] cities = new String[3];        // [null, null, null]
        cities[0] = "Hyderabad";

        // index-based loop: find the highest mark and its position
        int maxIndex = 0;
        for (int i = 1; i < marks.length; i++) {
            if (marks[i] > marks[maxIndex]) maxIndex = i;
        }
        System.out.println("Top mark " + marks[maxIndex] + " at index " + maxIndex); // 92 at index 1

        // enhanced for loop: values only
        int total = 0;
        for (int m : marks) total += m;
        System.out.println("Average: " + (double) total / marks.length); // 78.8

        // reference semantics vs real copy
        int[] alias = marks;                    // same array
        int[] copy = marks.clone();             // independent copy
        alias[0] = 0;
        System.out.println(marks[0] + " " + copy[0]); // 0 78

        // System.out.println(marks[5]);        // ArrayIndexOutOfBoundsException
    }
}`
    },
    {
      heading: "7. Two-Dimensional Arrays and the java.util.Arrays Utility Class",
      content: `Java has no true matrix type; a **two-dimensional array** is simply an **array of arrays**. \`int[][] grid = new int[3][4];\` creates one outer array holding three references, each pointing to an inner array of four ints. \`grid.length\` is the number of rows (3) and \`grid[0].length\` is the number of columns in row 0 (4). You access an element as \`grid[row][col]\`, and you walk the whole thing with nested loops.
Because rows are independent arrays, they can have **different lengths**. Such a **jagged array** is created by allocating only the outer dimension (\`new int[3][]\`) and then assigning each row separately. This is handy for triangular data such as Pascal's triangle or a list of marks where each student took a different number of tests. Printing a 2D array directly gives something like \`[[I@1b6d3586\`; use \`Arrays.deepToString\` instead.
The \`java.util.Arrays\` class is a toolbox of static helper methods you will use daily:
• \`Arrays.toString(a)\` and \`Arrays.deepToString(a2d)\` — readable output.
• \`Arrays.sort(a)\` — in-place sort; a Dual-Pivot Quicksort for primitives and a stable TimSort for objects. \`Arrays.sort(a, from, to)\` sorts a range.
• \`Arrays.binarySearch(a, key)\` — O(log n) search, **only on a sorted array**; returns a negative insertion point when not found.
• \`Arrays.fill(a, value)\`, \`Arrays.setAll(a, i -> i * i)\` — bulk initialisation.
• \`Arrays.copyOf(a, newLength)\` and \`Arrays.copyOfRange(a, from, to)\` — copies, padding with defaults if longer.
• \`Arrays.equals(a, b)\` and \`Arrays.deepEquals(a2d, b2d)\` — element-wise comparison; the inherited \`a.equals(b)\` only compares references.
• \`Arrays.asList(T...)\` — a **fixed-size** list view backed by the array (works for object arrays, not \`int[]\`), and \`Arrays.stream(a)\` — the entry point to the Stream API.`,
      codeSnippet: `// Matrix.java
import java.util.Arrays;

public class Matrix {
    public static void main(String[] args) {
        // 3 students x 4 subjects
        int[][] marks = {
            {78, 92, 65, 88},
            {55, 70, 81, 60},
            {95, 89, 91, 97}
        };
        for (int r = 0; r < marks.length; r++) {
            int rowTotal = 0;
            for (int c = 0; c < marks[r].length; c++) rowTotal += marks[r][c];
            System.out.println("Student " + (r + 1) + " total = " + rowTotal);
        }
        // Student 1 total = 323, Student 2 total = 266, Student 3 total = 372

        // jagged array: Pascal's triangle, 5 rows
        int[][] pascal = new int[5][];
        for (int r = 0; r < pascal.length; r++) {
            pascal[r] = new int[r + 1];
            pascal[r][0] = pascal[r][r] = 1;
            for (int c = 1; c < r; c++) pascal[r][c] = pascal[r - 1][c - 1] + pascal[r - 1][c];
        }
        System.out.println(Arrays.deepToString(pascal));
        // [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]]

        // Arrays utility class
        int[] scores = {42, 7, 19, 88, 3};
        Arrays.sort(scores);
        System.out.println(Arrays.toString(scores));            // [3, 7, 19, 42, 88]
        System.out.println(Arrays.binarySearch(scores, 42));    // 3
        System.out.println(Arrays.binarySearch(scores, 50));    // -5 (insertion point 4)
        int[] bigger = Arrays.copyOf(scores, 7);
        System.out.println(Arrays.toString(bigger));            // [3, 7, 19, 42, 88, 0, 0]
        int[] squares = new int[5];
        Arrays.setAll(squares, i -> i * i);
        System.out.println(Arrays.toString(squares));           // [0, 1, 4, 9, 16]
        System.out.println(Arrays.equals(scores, scores.clone())); // true
        System.out.println(scores.equals(scores.clone()));         // false (reference compare)
    }
}`
    },
    {
      heading: "8. String Immutability and the Java String Pool",
      content: `A \`String\` in Java is an **object** of the final class \`java.lang.String\`, and it is **immutable**: once created, its characters can never change. Every method that looks like it modifies a string (\`toUpperCase\`, \`replace\`, \`concat\`, \`substring\`, \`trim\`) actually returns a **brand-new** String and leaves the original untouched. Beginners write \`name.toUpperCase();\` on its own line and wonder why nothing happened: you must assign the result, \`name = name.toUpperCase();\`.
Why did the designers choose immutability?
• **Security** — file paths, URLs, class names and database connection strings are passed as Strings. If they could be mutated after validation, a check could be bypassed.
• **Thread safety** — an object that cannot change can be shared between threads without locks.
• **Hash caching** — \`String\` caches its \`hashCode()\` after the first call, which makes it a fast and reliable \`HashMap\` key. That only works because the content cannot change.
• **The string pool** — immutability makes it safe for many variables to share one String object.
The **string pool** (also called the intern pool) is a special area on the heap where the JVM keeps one copy of each distinct **string literal**. When you write \`String a = "Java";\` and later \`String b = "Java";\`, both variables point to the **same pooled object**, so \`a == b\` is true. But \`new String("Java")\` always creates a fresh object outside the pool, so \`a == c\` is false even though the contents are identical. Calling \`c.intern()\` returns the pooled instance. Since Java 7 the pool lives in the main heap (earlier it was in PermGen), and since Java 9 strings that contain only Latin-1 characters are stored as one byte per character ("compact strings"), halving memory for typical English and ASCII text.
Two more subtle facts: concatenating **compile-time constants** (\`"Ja" + "va"\`) is folded by the compiler into the literal \`"Java"\`, so it is pooled; but concatenating a non-final variable happens at runtime and produces a new object. You almost never need \`intern()\` in application code; it mainly exists for memory optimisation in very specific situations.`,
      codeSnippet: `// StringPool.java
public class StringPool {
    public static void main(String[] args) {
        String a = "Java";
        String b = "Java";                   // same literal -> same pooled object
        String c = new String("Java");       // new heap object, not pooled
        String d = c.intern();               // returns the pooled "Java"

        System.out.println(a == b);          // true
        System.out.println(a == c);          // false (different objects)
        System.out.println(a.equals(c));     // true  (same characters)
        System.out.println(a == d);          // true

        final String part = "Ja";
        String e = part + "va";              // compile-time constant -> pooled
        String f = "Ja";
        String g = f + "va";                 // runtime concatenation -> new object
        System.out.println(a == e);          // true
        System.out.println(a == g);          // false

        // immutability: methods return new strings
        String name = "ravindra";
        name.toUpperCase();                  // result thrown away!
        System.out.println(name);            // ravindra
        name = name.toUpperCase();
        System.out.println(name);            // RAVINDRA
    }
}`
    },
    {
      heading: "9. Common String Methods Every Java Developer Must Know",
      content: `The \`String\` class has well over sixty methods. You do not need to memorise them all, but the following group covers 95% of day-to-day work and shows up constantly in interviews and coding tests.
**Inspecting:** \`length()\` returns the number of \`char\` units; \`charAt(i)\` returns the character at index i (0-based, throws \`StringIndexOutOfBoundsException\` if out of range); \`isEmpty()\` is true for \`""\`; \`isBlank()\` (Java 11) is true for empty **or whitespace-only** strings, which is what you usually want for form validation.
**Searching:** \`indexOf(str)\` and \`lastIndexOf(str)\` return the position or -1; \`contains(str)\`, \`startsWith(prefix)\`, \`endsWith(suffix)\` return booleans. Searching is case-sensitive, so normalise with \`toLowerCase()\` first when needed.
**Extracting:** \`substring(begin)\` and \`substring(begin, end)\` — the end index is **exclusive**, so \`"Mumbai".substring(0, 3)\` is \`"Mum"\`. \`toCharArray()\` gives a mutable \`char[]\`, useful for in-place algorithms such as reversing or counting characters. \`chars()\` returns an \`IntStream\` of code points for stream-style processing.
**Transforming:** \`toUpperCase()\`, \`toLowerCase()\`, \`trim()\` (removes ASCII whitespace up to U+0020), \`strip()\`, \`stripLeading()\`, \`stripTrailing()\` (Java 11, Unicode-aware, preferred), \`replace(old, new)\` replaces **all** literal occurrences, \`replaceAll(regex, replacement)\` uses a regular expression, \`repeat(n)\` (Java 11), \`concat(other)\`.
**Splitting and joining:** \`split(regex)\` returns a \`String[]\`; because the argument is a regex, splitting on a dot must be written \`split("\\\\.")\` and splitting on a pipe as \`split("\\\\|")\`. \`String.join(delimiter, parts...)\` is the inverse. \`lines()\` (Java 11) streams the lines of a multi-line string.
**Converting:** \`String.valueOf(42)\` turns anything into a String; \`Integer.parseInt("42")\` and \`Double.parseDouble("3.14")\` go the other way and throw \`NumberFormatException\` on bad input. Remember that \`"" + 42\` also works but is considered sloppy for anything beyond quick debugging.`,
      codeSnippet: `// StringMethods.java
import java.util.Arrays;

public class StringMethods {
    public static void main(String[] args) {
        String s = "  Bengaluru, Karnataka  ";

        System.out.println(s.length());                 // 24
        System.out.println(s.strip());                  // Bengaluru, Karnataka
        System.out.println(s.isBlank());                // false
        System.out.println("   ".isBlank());            // true

        String city = s.strip().substring(0, 9);        // Bengaluru
        System.out.println(city.charAt(0));             // B
        System.out.println(city.indexOf("ga"));         // 3
        System.out.println(city.toUpperCase());         // BENGALURU
        System.out.println(city.contains("lur"));       // true
        System.out.println(city.startsWith("Ben"));     // true
        System.out.println(city.replace("u", "U"));     // BengalUrU

        String csv = "Amit,Neha,Rohit";
        String[] names = csv.split(",");
        System.out.println(names.length + " " + names[1]);        // 3 Neha
        System.out.println(String.join(" | ", names));            // Amit | Neha | Rohit

        String ip = "192.168.1.10";
        System.out.println(Arrays.toString(ip.split("\\\\.")));     // [192, 168, 1, 10]
        System.out.println(Arrays.toString(ip.split(".")).length()); // 2 -> "[]" (regex mistake!)

        System.out.println("ab".repeat(3));                        // ababab
        System.out.println("PIN: " + Integer.parseInt("560001") + 1); // PIN: 5600011 (string concat!)
        System.out.println("PIN: " + (Integer.parseInt("560001") + 1)); // PIN: 560002

        // reverse using toCharArray
        char[] chars = "madam".toCharArray();
        for (int i = 0, j = chars.length - 1; i < j; i++, j--) {
            char t = chars[i]; chars[i] = chars[j]; chars[j] = t;
        }
        System.out.println(new String(chars).equals("madam"));    // true -> palindrome
    }
}`
    },
    {
      heading: "10. Comparing Strings in Java: equals vs == vs compareTo",
      content: `The single most common String bug in beginner code is comparing with \`==\`. Learn the difference once and never make the mistake again:
• \`==\` compares **references**: are these two variables pointing at the **same object**? Because of the string pool this sometimes accidentally returns true for literals, which is exactly why the bug hides during testing and appears in production when the string comes from user input, a file, a database or \`new String(...)\`.
• \`equals(Object)\` compares **contents**, character by character. This is what you want almost every time.
• \`equalsIgnoreCase(String)\` compares contents ignoring case, ideal for email addresses, usernames and commands.
• \`compareTo(String)\` returns a negative number, zero or a positive number depending on **lexicographic (dictionary) order** based on Unicode values, so uppercase letters sort before lowercase (\`"Zebra".compareTo("apple")\` is negative). Use \`compareToIgnoreCase\` for human-friendly sorting, or a \`Collator\` for locale-aware ordering. \`compareTo\` is what \`Arrays.sort\` and \`Collections.sort\` use for Strings.
Two defensive habits: first, when comparing with a constant, put the **constant first**, \`"ADMIN".equals(role)\`, so that a \`null\` role returns false instead of throwing \`NullPointerException\`. Second, when both sides may be null, use \`Objects.equals(a, b)\`, which treats two nulls as equal and never throws.
Good news: \`switch\` on a String (allowed since Java 7, including the switch expressions you learned in Lecture 3) uses \`equals\` internally, so it is safe. \`contains\`, \`startsWith\` and \`indexOf\` also compare by content. Only the bare \`==\` operator is the trap.`,
      codeSnippet: `// StringCompare.java
import java.util.Objects;
import java.util.Scanner;

public class StringCompare {
    public static void main(String[] args) {
        String literal = "admin";
        String built = new StringBuilder("ad").append("min").toString(); // runtime object

        System.out.println(literal == built);                 // false  (trap!)
        System.out.println(literal.equals(built));            // true
        System.out.println("ADMIN".equalsIgnoreCase(built));  // true

        String role = null;
        System.out.println("admin".equals(role));             // false, no exception
        // System.out.println(role.equals("admin"));          // NullPointerException
        System.out.println(Objects.equals(role, null));       // true

        System.out.println("apple".compareTo("banana"));      // negative (-1)
        System.out.println("Zebra".compareTo("apple"));       // negative: 'Z' (90) < 'a' (97)
        System.out.println("Zebra".compareToIgnoreCase("apple")); // positive
        System.out.println("java".compareTo("java"));         // 0

        // switch on a String uses equals internally
        String command = "stop";
        String message = switch (command) {
            case "start" -> "Starting service";
            case "stop"  -> "Stopping service";
            default      -> "Unknown command";
        };
        System.out.println(message);                          // Stopping service
    }
}`
    },
    {
      heading: "11. StringBuilder: Efficient String Building in Loops",
      content: `Because Strings are immutable, every \`+=\` on a String inside a loop creates a **new String** and copies all the previous characters into it. Building a 10,000-line report that way performs roughly 10,000 copies of ever-growing text, which is **O(n²)** work and produces mountains of garbage for the collector. On a real project this is the difference between a report that renders in 20 milliseconds and one that takes several seconds.
\`java.lang.StringBuilder\` solves this. It is a **mutable** sequence of characters backed by an internal array (default capacity 16) that grows automatically when needed. Appending is amortised O(1), so building the same report is O(n). The key methods are:
• \`append(x)\` — accepts every primitive, \`char[]\`, \`String\`, and any \`Object\` (via \`toString()\`); it returns the builder itself so calls can be **chained**.
• \`insert(index, x)\`, \`delete(start, end)\`, \`deleteCharAt(i)\`, \`replace(start, end, str)\`, \`setCharAt(i, c)\` — in-place edits.
• \`reverse()\` — the standard way to reverse a string in Java.
• \`length()\`, \`setLength(n)\` (truncate), \`charAt(i)\`, \`indexOf(str)\`.
• \`toString()\` — produce the final immutable String when you are done.
If you know the final size, pass it to the constructor, \`new StringBuilder(4096)\`, to avoid repeated resizing. \`StringBuffer\` is the older, **synchronised** twin from Java 1.0; it is slower and almost never the right choice today because you rarely share a builder across threads. Prefer \`StringBuilder\` and mention \`StringBuffer\` only when an interviewer asks about the difference.
One clarification: a **single** expression such as \`"Hello, " + name + "!"\` is fine. Since Java 9 (JEP 280) the compiler translates such expressions into an efficient \`invokedynamic\` call that builds the result in one step. The problem is specifically **repeated concatenation in a loop**, and \`String.join\` or a \`StringBuilder\` is the fix. Also remember that \`StringBuilder\` does not override \`equals\`, so compare builders by calling \`toString()\` first.`,
      codeSnippet: `// BuilderDemo.java
public class BuilderDemo {

    // builds a CSV line for every row: 3 columns -> "id,name,amount"
    static String buildCsv(String[][] rows) {
        StringBuilder sb = new StringBuilder(rows.length * 32);
        sb.append("id,name,amount\\n");
        for (String[] row : rows) {
            sb.append(String.join(",", row)).append('\\n');
        }
        sb.setLength(sb.length() - 1);        // drop the trailing newline
        return sb.toString();
    }

    public static void main(String[] args) {
        String[][] rows = {
            {"1", "Amit", "2500"},
            {"2", "Neha", "4200"},
            {"3", "Rohit", "1800"}
        };
        System.out.println(buildCsv(rows));
        // id,name,amount
        // 1,Amit,2500
        // 2,Neha,4200
        // 3,Rohit,1800

        // chaining and in-place edits
        StringBuilder sb = new StringBuilder("Hello World");
        sb.insert(5, ",").append("!").setCharAt(0, 'h');
        System.out.println(sb);                // hello, World!
        System.out.println(sb.reverse());      // !dlroW ,olleh

        // timing: 100,000 appends vs 100,000 concatenations
        long t0 = System.nanoTime();
        StringBuilder fast = new StringBuilder();
        for (int i = 0; i < 100_000; i++) fast.append(i);
        long t1 = System.nanoTime();
        String slow = "";
        for (int i = 0; i < 100_000; i++) slow += i;
        long t2 = System.nanoTime();
        System.out.println("StringBuilder: " + (t1 - t0) / 1_000_000 + " ms"); // a few ms
        System.out.println("String +=    : " + (t2 - t1) / 1_000_000 + " ms"); // hundreds of ms or more
    }
}`
    },
    {
      heading: "12. Text Blocks, String.format and formatted() in Modern Java",
      content: `**Text blocks** (finalised in Java 15, JEP 378) are multi-line string literals delimited by three double quotes. Before them, embedding a JSON payload, an SQL query or an HTML fragment meant a painful chain of \`+ "...\\n"\` with escaped quotes. A text block keeps the text readable exactly as it will appear.
The rules you must know:
• The opening \`"""\` must be followed by a **line break**; content starts on the next line.
• **Incidental indentation** is removed automatically: the compiler finds the least-indented line (including the line with the closing \`"""\`) and strips that many leading spaces from every line. Moving the closing delimiter left or right therefore controls the indentation that is preserved.
• Each line ends with \`\\n\` unless you end it with a backslash (\`\\\`), which joins it to the next line. Use \`\\s\` to keep a trailing space that would otherwise be stripped.
• Double quotes inside the block need no escaping; only a run of three quotes does.
**\`String.format(pattern, args...)\`** builds a string from a pattern with **format specifiers**. The most useful ones: \`%s\` (any value via \`toString\`), \`%d\` (integers), \`%f\` with a precision such as \`%.2f\` (two decimals), \`%,d\` (thousands separators), \`%05d\` (zero-padded to width 5), \`%-10s\` (left-aligned in a 10-character column), \`%10s\` (right-aligned), \`%x\` (hex), \`%b\` (boolean), \`%c\` (char), \`%e\` (scientific) and \`%n\` (platform line separator). \`System.out.printf\` uses the same syntax and prints directly. A mismatch between the specifier and the argument type, such as \`%d\` with a \`double\`, throws \`IllegalFormatConversionException\` at runtime, not compile time.
**\`formatted(args...)\`** (Java 15) is an instance method that does the same thing as \`String.format\` but reads naturally when the pattern is a text block: \`template.formatted(name, amount)\`. Numeric formatting with \`%,d\` or \`%.2f\` follows the JVM's default locale; for currency and Indian lakh/crore grouping in real applications, use \`java.text.NumberFormat\` with an explicit locale instead of relying on defaults.`,
      codeSnippet: `// TextBlocks.java
public class TextBlocks {
    public static void main(String[] args) {
        // JSON without a single escaped quote
        String json = """
                {
                  "name": "Ananya",
                  "city": "Kolkata",
                  "active": true
                }
                """;
        System.out.print(json);

        // SQL: readable, and the closing delimiter position controls indentation
        String sql = """
            SELECT id, name, salary
            FROM employees
            WHERE city = ? \\
            AND salary > ?
            """;                          // the backslash joins two lines into one
        System.out.print(sql);

        // String.format and printf
        String name = "Vikram";
        double balance = 125430.5;
        int orders = 7;
        System.out.println(String.format("%-10s|%10.2f|%05d", name, balance, orders));
        // Vikram    | 125430.50|00007
        System.out.printf("Orders: %,d   Balance: Rs %,.2f%n", 1234567, balance);
        // Orders: 1,234,567   Balance: Rs 125,430.50
        System.out.printf("Hex %x, bool %b, char %c, sci %.3e%n", 255, true, 'J', 123456.789);
        // Hex ff, bool true, char J, sci 1.235e+05

        // formatted() with a text block template (Java 15+)
        String receipt = """
                Customer : %s
                Items    : %d
                Total    : Rs %.2f
                """.formatted(name, orders, balance);
        System.out.print(receipt);
    }
}`
    },
    {
      heading: "13. Real-World Use Cases: How Methods, Arrays and Strings Are Used in Production",
      content: `Here is where this lecture's material shows up in real Indian software projects, so you can see why it is worth mastering:
• **Request validation in Spring Boot controllers** — a \`validatePan(String pan)\` method checks \`length() == 10\`, \`matches("[A-Z]{5}[0-9]{4}[A-Z]")\` and returns a clear error message. \`isBlank()\`, \`strip()\` and \`toUpperCase()\` normalise user input before it reaches the database.
• **Parsing files and messages** — bank statements, UPI reconciliation files and GST returns arrive as CSV or fixed-width text. \`split\`, \`substring\`, \`Integer.parseInt\` and \`BigDecimal\` constructors turn each line into typed data; a \`String[]\` per line is the natural intermediate step.
• **Building output** — HTML emails, SMS templates, log messages and reports are assembled with \`StringBuilder\`, text blocks and \`formatted()\`. A payment gateway that formats "Rs 1,20,000.00 debited from A/c XX1234" uses exactly these APIs.
• **Game boards, images and grids** — a Sudoku validator, a Snake and Ladder board, a seating chart in a movie-ticket app and raw image pixels are all 2D arrays walked with nested loops.
• **Tree-shaped data** — recursion walks a folder tree to compute its size, flattens nested JSON for search indexing, or renders a category tree in an e-commerce catalogue.
• **Flexible APIs** — varargs power \`log.info("User {} placed order {}", userId, orderId)\`, \`List.of(...)\`, \`EnumSet.of(...)\` and \`Stream.of(...)\`.
• **Sorting and ranking** — leaderboards, top-N products and percentile calculations start with \`Arrays.sort\` or \`Arrays.stream\` over a primitive array because they are the fastest option for numeric data.
The snippet below is a realistic helper you might find in a fintech codebase: it parses a transaction record, validates it and formats it for display, using almost everything from this lecture.`,
      codeSnippet: `// TransactionParser.java
import java.util.Arrays;

public class TransactionParser {

    // record format: TXN_ID|UPI_ID|AMOUNT|STATUS   e.g. T1001|rahul@okaxis|2500.50|SUCCESS
    static String parseAndFormat(String line) {
        if (line == null || line.isBlank()) return "Skipped: empty line";

        String[] parts = line.strip().split("\\\\|");          // '|' is a regex metacharacter
        if (parts.length != 4) return "Rejected: expected 4 fields, got " + parts.length;

        String txnId = parts[0], upi = parts[1].toLowerCase(), status = parts[3].toUpperCase();
        if (!upi.contains("@")) return "Rejected: invalid UPI id " + upi;

        double amount;
        try {
            amount = Double.parseDouble(parts[2]);
        } catch (NumberFormatException e) {
            return "Rejected: bad amount " + parts[2];
        }

        String masked = upi.substring(0, 2) + "***" + upi.substring(upi.indexOf('@'));
        return "%-6s %-18s Rs %,10.2f  %s".formatted(txnId, masked, amount, status);
    }

    public static void main(String[] args) {
        String[] lines = {
            "T1001|rahul@okaxis|2500.50|success",
            "T1002|neha@ybl|120000|FAILED",
            "T1003|badrecord|10",
            "   ",
            "T1004|amit@paytm|abc|SUCCESS"
        };
        Arrays.stream(lines).map(TransactionParser::parseAndFormat).forEach(System.out::println);
        // T1001  ra***@okaxis       Rs   2,500.50  SUCCESS
        // T1002  ne***@ybl          Rs 120,000.00  FAILED
        // Rejected: expected 4 fields, got 3
        // Skipped: empty line
        // Rejected: bad amount abc
    }
}`
    },
    {
      heading: "14. Common Mistakes with Java Methods, Arrays and Strings, and How to Fix Them",
      content: `• **Comparing strings with \`==\`.** Works by accident for literals, fails for input read from a user, file or database. Fix: \`equals\`, \`equalsIgnoreCase\` or \`Objects.equals\`; put the constant first to be null-safe.
• **Ignoring the return value of a String method.** \`s.trim();\` on its own line does nothing because Strings are immutable. Fix: \`s = s.trim();\`.
• **String concatenation in a loop.** \`result += line\` inside a loop is O(n²). Fix: \`StringBuilder\` or \`String.join\` / \`Collectors.joining\`.
• **Off-by-one errors.** Looping with \`i <= arr.length\` throws \`ArrayIndexOutOfBoundsException\` on the last iteration. Fix: \`i < arr.length\`. The same applies to \`charAt(s.length())\`.
• **Forgetting that \`split\` takes a regex.** \`split(".")\` and \`split("|")\` silently give wrong results, and \`split("*")\` throws \`PatternSyntaxException\`. Fix: escape with two backslashes in source (\`"\\\\."\`) or use \`Pattern.quote(".")\`.
• **Expecting the caller to see a reassigned parameter.** Assigning \`arr = new int[3]\` or \`name = "x"\` inside a method never changes the caller's variable. Fix: return the new value and assign it at the call site.
• **Recursion without a correct base case** or with an input that does not shrink, causing \`StackOverflowError\`. Fix: write the base case first and make sure every recursive call moves towards it; use iteration for large flat inputs.
• **Comparing arrays with \`equals\`.** \`a.equals(b)\` compares references. Fix: \`Arrays.equals\` for 1D and \`Arrays.deepEquals\` for nested arrays.
• **\`Arrays.asList\` on a primitive array.** \`Arrays.asList(new int[]{1,2,3})\` gives a \`List<int[]>\` with one element. Fix: use \`Integer[]\` or \`Arrays.stream(arr).boxed().toList()\`.
• **Using \`length\` and \`length()\` interchangeably.** Arrays have the field \`length\`; Strings have the method \`length()\`; collections have \`size()\`.
• **Ambiguous overloads.** Having both \`process(int...)\` and \`process(Integer...)\` makes \`process(1)\` fail to compile. Fix: keep overload sets simple and avoid mixing boxed and primitive varargs.
• **Modifying a String through the enhanced for loop.** \`for (String s : names) s = s.trim();\` changes only the loop variable. Fix: use an index loop and assign \`names[i] = names[i].trim()\`.`,
      codeSnippet: `// MistakesFixed.java
import java.util.Arrays;
import java.util.Objects;

public class MistakesFixed {
    public static void main(String[] args) {
        // 1. equals, not ==
        String input = new String("yes");
        if ("yes".equals(input)) System.out.println("Confirmed");   // correct

        // 2. assign the result of immutable operations
        String raw = "  hello  ";
        raw = raw.strip();
        System.out.println("[" + raw + "]");                        // [hello]

        // 3. StringBuilder in loops
        StringBuilder sb = new StringBuilder();
        for (int i = 1; i <= 5; i++) sb.append(i).append(i < 5 ? "," : "");
        System.out.println(sb);                                     // 1,2,3,4,5

        // 4. i < length, never <=
        int[] data = {4, 8, 15};
        for (int i = 0; i < data.length; i++) System.out.print(data[i] + " ");
        System.out.println();

        // 5. regex-safe split
        System.out.println(Arrays.toString("a|b|c".split("\\\\|")));  // [a, b, c]
        System.out.println(Arrays.toString("a.b.c".split(java.util.regex.Pattern.quote("."))));

        // 6. compare arrays by content
        int[] x = {1, 2}, y = {1, 2};
        System.out.println(x.equals(y) + " " + Arrays.equals(x, y));  // false true

        // 7. enhanced-for cannot modify the array; use an index loop
        String[] names = {" Amit ", " Neha "};
        for (int i = 0; i < names.length; i++) names[i] = names[i].strip();
        System.out.println(Arrays.toString(names));                   // [Amit, Neha]

        // 8. null-safe comparison
        String a = null, b = null;
        System.out.println(Objects.equals(a, b));                     // true
    }
}`
    },
    {
      heading: "15. Frequently Asked Questions about Java Methods, Arrays and Strings",
      content: `**Is Java pass-by-value or pass-by-reference?**
Java is strictly pass-by-value. For primitives the value itself is copied; for objects the reference is copied. A method can change the contents of the object the reference points to, but it cannot make the caller's variable point to a different object. The classic failing \`swap(int, int)\` proves it.
**Why is String immutable in Java?**
For security (paths, URLs and class names cannot be changed after validation), thread safety (shared without locks), performance (the hash code is cached, making Strings ideal HashMap keys) and to make the string pool possible, since pooled objects can only be shared safely if nobody can modify them.
**What is the difference between String, StringBuilder and StringBuffer?**
\`String\` is immutable; every modification creates a new object. \`StringBuilder\` is mutable and fast, intended for single-threaded use, and is the right choice for building text in loops. \`StringBuffer\` is the older synchronised version; it is thread-safe but slower and rarely needed in modern code.
**What is the difference between == and equals() for Strings?**
\`==\` checks whether two references point to the same object; \`equals()\` checks whether two strings have the same characters. Because of the string pool, \`==\` may be true for identical literals but false for strings created at runtime, so always use \`equals()\` for content comparison.
**How do I convert a String to an int in Java and what if it fails?**
Use \`Integer.parseInt(str)\` (or \`Integer.valueOf\` for an \`Integer\` object). If the text is not a valid number, a \`NumberFormatException\` is thrown, so wrap the call in a try-catch when the input comes from users or files. \`Double.parseDouble\` and \`Long.parseLong\` follow the same pattern.
**What is the difference between an array and an ArrayList in Java?**
An array has a fixed length chosen at creation, can hold primitives directly and is slightly faster and more memory-efficient. An \`ArrayList\` grows automatically, offers methods like \`add\`, \`remove\` and \`contains\`, but can only hold objects (primitives are boxed). Use arrays for fixed-size numeric data and \`ArrayList\` for most application-level lists.
**When should I use recursion instead of a loop in Java?**
Use recursion when the data is naturally recursive (trees, nested structures, divide-and-conquer algorithms) and the depth is modest. Use a loop for flat, large inputs, because each recursive call consumes stack space and deep recursion throws \`StackOverflowError\`. Java does not perform tail-call optimisation.
**What are text blocks in Java and which version introduced them?**
Text blocks are multi-line string literals written between triple double quotes. They were previewed in Java 13 and 14 and became a standard feature in Java 15 (JEP 378), so they are available in every current LTS release including Java 21 and Java 25. They are ideal for JSON, SQL and HTML inside Java code.`
    },
    {
      heading: "16. Interview Questions and Answers on Java Methods, Arrays and Strings",
      content: `**Q1. What is a method signature, and is the return type part of it?**
The signature is the method name plus the ordered parameter types. The return type, parameter names, access modifiers and thrown exceptions are not part of it. That is why two methods differing only in return type cannot coexist in one class.
**Q2. Explain method overloading resolution when both \`print(long)\` and \`print(Integer)\` exist and you call \`print(5)\`.**
The compiler resolves overloads in phases: first without boxing or varargs (allowing primitive widening), then with boxing, then with varargs. \`int\` widens to \`long\` in phase one, so \`print(long)\` is chosen. Boxing to \`Integer\` is only considered if no phase-one candidate exists.
**Q3. Why does \`"Ja" + "va" == "Java"\` return true but \`s + "va" == "Java"\` return false when \`s = "Ja"\`?**
The first expression consists of compile-time constants, so the compiler folds it into the literal \`"Java"\`, which lives in the string pool. The second involves a non-final variable, so the concatenation happens at runtime and creates a new String object outside the pool. Declaring \`s\` as \`final\` would make it a constant and restore the folding.
**Q4. What does \`String.intern()\` do and when would you use it?**
It returns the canonical pooled instance of a string, adding it to the pool if necessary. It can save memory when millions of duplicate strings are read from a file or database, but it is rarely needed and misuse can hurt performance, so most application code never calls it.
**Q5. How does the JVM store a two-dimensional array?**
As an array of references, each pointing to a separate inner array. The rows are independent objects that may have different lengths (jagged arrays) and are not guaranteed to be contiguous in memory. That is why \`grid[0].length\` must be used for the column count of a specific row.
**Q6. What happens if a recursive method has no base case?**
Each call pushes a new frame until the thread's stack is exhausted and the JVM throws \`StackOverflowError\`, which is an \`Error\`, not an \`Exception\`, so it should not be caught as a normal error-handling strategy. The fix is a correct base case and inputs that strictly move towards it.
**Q7. Why is \`String\` a good HashMap key?**
It is immutable, so its hash code cannot change while it sits in the map; the hash code is computed once and cached; and \`equals\` and \`hashCode\` are correctly implemented and consistent with each other. Mutable keys can get "lost" in a map after modification.
**Q8. What is the time complexity of building a String with \`+=\` in a loop versus \`StringBuilder\`?**
Repeated \`+=\` is O(n²) because each step copies all previous characters into a new String. \`StringBuilder.append\` is amortised O(1) per call, so the whole build is O(n). Since Java 9, a single concatenation expression is compiled to an efficient \`invokedynamic\` call, so the problem is specifically concatenation repeated across loop iterations.
**Q9. Can a varargs method be called with an array? Can it be overloaded?**
Yes, you can pass an array directly because the varargs parameter is an array. It can be overloaded, but the varargs version is chosen only in the last resolution phase, and mixing \`int...\` with \`Integer...\` overloads leads to ambiguity errors, so keep such overload sets simple.
**Q10. What is the difference between \`trim()\` and \`strip()\`?**
\`trim()\` removes characters with code points up to U+0020 (ASCII whitespace and control characters) from both ends. \`strip()\`, added in Java 11, uses \`Character.isWhitespace\`, so it also removes Unicode whitespace such as non-breaking or ideographic spaces. Prefer \`strip()\` in new code.`
    },
    {
      heading: "17. Hands-On Exercise: Student Marks Report with Methods, Arrays and Strings",
      content: `Build a small command-line **marks report** that uses every concept from this lecture. Create a file named \`MarksReport.java\`, compile it with \`javac MarksReport.java\` and run it with \`java MarksReport\`. The program should:
1. Store the marks of five students in four subjects in a **2D array** and their names in a parallel **String array**.
2. Provide a **method** \`total(int[] marks)\` and an **overloaded** \`average\` for a single row and for the whole class.
3. Use a **varargs** method \`highest(int... values)\` to find the top mark of a row.
4. Use a **recursive** method to compute the sum of digits of each total (a common check-digit exercise).
5. Rank students with \`Arrays.sort\` on a copy of the totals and use \`Arrays.binarySearch\` to find each student's rank.
6. Build the report with a **StringBuilder**, a **text block** header and \`String.format\` / \`formatted\` columns.
7. Validate names with \`isBlank\` and normalise them with \`strip\` and \`toUpperCase\`, comparing with \`equals\` only.
Study the expected output in the comments, then extend the program: add a \`grade(double average)\` method that returns A, B, C or F using a switch expression, and a \`search(String name)\` method that uses \`equalsIgnoreCase\` to print one student's row. Try changing one student's marks to see the ranking update.`,
      codeSnippet: `// MarksReport.java  (compile: javac MarksReport.java   run: java MarksReport)
import java.util.Arrays;

public class MarksReport {

    static final String[] SUBJECTS = {"Maths", "Physics", "Chem", "English"};

    // ---------- methods, overloading, varargs, recursion ----------
    static int total(int[] marks) {
        int sum = 0;
        for (int m : marks) sum += m;
        return sum;
    }

    static double average(int[] marks) {                // one student
        return marks.length == 0 ? 0 : (double) total(marks) / marks.length;
    }

    static double average(int[][] all) {                // whole class (overloaded)
        int sum = 0, count = 0;
        for (int[] row : all) { sum += total(row); count += row.length; }
        return count == 0 ? 0 : (double) sum / count;
    }

    static int highest(int... values) {                 // varargs
        int max = Integer.MIN_VALUE;
        for (int v : values) if (v > max) max = v;
        return max;
    }

    static int digitSum(int n) {                        // recursion
        return n < 10 ? n : n % 10 + digitSum(n / 10);
    }

    static String grade(double avg) {
        return switch ((int) avg / 10) {
            case 10, 9 -> "A";
            case 8, 7  -> "B";
            case 6, 5  -> "C";
            default    -> "F";
        };
    }

    static String normalise(String name) {
        if (name == null || name.isBlank()) return "UNKNOWN";
        return name.strip().toUpperCase();
    }

    // ---------- report building ----------
    static String buildReport(String[] names, int[][] marks) {
        int n = names.length;
        int[] totals = new int[n];
        for (int i = 0; i < n; i++) totals[i] = total(marks[i]);

        int[] sortedDesc = totals.clone();              // never sort the original
        Arrays.sort(sortedDesc);                        // ascending

        StringBuilder sb = new StringBuilder(512);
        sb.append("""
                ==================================================
                           CLASS 10-B  MARKS REPORT
                ==================================================
                """);
        sb.append(String.format("%-4s %-10s %-20s %5s %6s %5s %4s%n",
                "Rank", "Name", "Marks", "Total", "Avg", "Best", "Grd"));

        for (int i = 0; i < n; i++) {
            int rank = n - Arrays.binarySearch(sortedDesc, totals[i]);   // 1 = highest
            double avg = average(marks[i]);
            sb.append(String.format("%-4d %-10s %-20s %5d %6.2f %5d %4s%n",
                    rank, normalise(names[i]), Arrays.toString(marks[i]),
                    totals[i], avg, highest(marks[i]), grade(avg)));
        }

        sb.append("--------------------------------------------------\\n");
        sb.append("Class average: %.2f%n".formatted(average(marks)));
        sb.append("Check digits : ");
        for (int t : totals) sb.append(digitSum(t)).append(' ');
        return sb.toString().strip();
    }

    static void search(String[] names, int[][] marks, String query) {
        for (int i = 0; i < names.length; i++) {
            if (names[i].strip().equalsIgnoreCase(query.strip())) {
                System.out.println("Found " + normalise(names[i]) + " -> " + Arrays.toString(marks[i]));
                return;
            }
        }
        System.out.println("No student named " + query);
    }

    public static void main(String[] args) {
        String[] names = {"Ananya", " rohit ", "Kavya", "Dev", "Meera"};
        int[][] marks = {
            {88, 92, 79, 85},
            {56, 61, 70, 65},
            {95, 97, 93, 90},
            {72, 68, 75, 80},
            {40, 52, 47, 58}
        };

        System.out.println(buildReport(names, marks));
        /*
        ==================================================
                   CLASS 10-B  MARKS REPORT
        ==================================================
        Rank Name       Marks                Total    Avg  Best  Grd
        2    ANANYA     [88, 92, 79, 85]       344  86.00    92    B
        4    ROHIT      [56, 61, 70, 65]       252  63.00    70    C
        1    KAVYA      [95, 97, 93, 90]       375  93.75    97    A
        3    DEV        [72, 68, 75, 80]       295  73.75    80    B
        5    MEERA      [40, 52, 47, 58]       197  49.25    58    F
        --------------------------------------------------
        Class average: 73.15
        Check digits : 11 9 15 16 17
        */

        search(names, marks, "ROHIT");     // Found ROHIT -> [56, 61, 70, 65]
        search(names, marks, "Priya");     // No student named Priya
    }
}`
    },
    {
      heading: "18. Summary",
      content: `• A **method** is a named, reusable block with a return type, a name and typed parameters; its **signature** is the name plus parameter types, not the return type.
• Java is **always pass-by-value**: primitives are copied, and object references are copied, so methods can modify an object's contents but cannot reassign the caller's variable.
• **Overloading** lets several methods share a name with different parameter lists; the compiler resolves them by exact match and widening first, then boxing, then **varargs** (\`type... name\`, always last, received as an array).
• **Recursion** needs a base case and a shrinking input; it is perfect for trees and divide-and-conquer, but deep recursion causes \`StackOverflowError\`, so use loops for large flat data and memoisation to avoid exponential recomputation.
• **Arrays** are fixed-size objects with default values, 0-based indexes and a \`length\` field; 2D arrays are arrays of arrays and can be jagged. \`java.util.Arrays\` provides \`toString\`, \`sort\`, \`binarySearch\`, \`fill\`, \`setAll\`, \`copyOf\`, \`equals\`, \`deepEquals\` and \`stream\`.
• **Strings are immutable**; every "modifying" method returns a new String. Literals are shared through the **string pool**, which is why \`==\` is unreliable and \`equals\` / \`equalsIgnoreCase\` / \`compareTo\` must be used for comparison.
• Key String methods: \`length\`, \`charAt\`, \`substring\`, \`indexOf\`, \`contains\`, \`startsWith\`, \`strip\`, \`isBlank\`, \`replace\`, \`split\` (regex!), \`join\`, \`repeat\`, \`toCharArray\`, \`valueOf\`, \`parseInt\`.
• Use **StringBuilder** for building text in loops (O(n) instead of O(n²)); \`StringBuffer\` is its synchronised, older twin.
• **Text blocks** (Java 15) make multi-line JSON, SQL and HTML readable; \`String.format\`, \`printf\` and \`formatted()\` (Java 15) format values with specifiers such as \`%s\`, \`%d\`, \`%.2f\`, \`%,d\`, \`%-10s\` and \`%n\`.
**Next lecture:** Object-Oriented Programming Part 1 — Classes, Objects & Encapsulation`
    }
  ]
};
