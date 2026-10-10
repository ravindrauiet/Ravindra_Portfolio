export const lecture07 = {
  slug: "lecture-7",
  number: 7,
  title: "Complete Java Course — Lecture 7: Exception Handling",
  summary: "Master Java exception handling: the Throwable hierarchy, checked vs unchecked exceptions, try-catch-finally, multi-catch, try-with-resources, throw vs throws, custom exceptions, exception chaining, helpful NullPointerException messages and Optional, with best practices and interview questions.",
  readTime: "55 min read",
  difficulty: "Intermediate",
  date: "2026-10-09",
  sections: [
    {
      heading: "1. Introduction: What Is Exception Handling in Java and Why It Matters",
      content: `In the last two lectures you built class hierarchies with inheritance, polymorphism, abstract classes and interfaces. Those tools describe how a program behaves when everything goes right. Real programs spend a surprising amount of effort on what happens when things go wrong: a file is missing, the network drops in the middle of a payment, a user types "abc" where a number was expected, a database connection pool is exhausted at 9 PM on a sale day. **Exception handling** is Java's structured mechanism for detecting these abnormal situations, moving control to code that can deal with them, and cleaning up resources on the way.
An **exception** is an event that disrupts the normal flow of instructions. In Java it is also an **object**: every exception is an instance of a class that extends \`java.lang.Throwable\`. When something goes wrong, code **throws** that object; the JVM unwinds the call stack method by method until it finds a **catch** block that can handle it. If nothing handles it, the thread dies and you see the familiar stack trace.
Why is this such a big deal in real projects?
• **Correctness** — without a clear error path, a failed step silently corrupts data. A money transfer that debits one account and crashes before crediting the other is the classic example.
• **Robustness** — a web server must keep serving other users even when one request fails.
• **Debuggability** — a good exception carries a message, a cause and a stack trace, which is often the only evidence you have at 2 AM in production logs.
• **Interviews** — checked vs unchecked, \`finally\` behaviour, try-with-resources and custom exceptions appear in almost every Java interview for freshers and 2–5 year developers alike.
Java's design here is older than most languages' (1995) and has some sharp edges — notably checked exceptions, which no other mainstream language copied. This lecture explains the whole model from the hierarchy upward, then covers modern additions: multi-catch (Java 7), try-with-resources (Java 7, improved in Java 9), helpful \`NullPointerException\` messages (Java 14, on by default since Java 15), the unnamed \`_\` catch parameter (Java 22), and \`Optional\` (Java 8, with additions in Java 9–11) as a way to avoid throwing at all.`
    },
    {
      heading: "2. The Java Exception Hierarchy: Throwable, Error, Exception and RuntimeException",
      content: `Everything you can throw or catch in Java descends from one class: \`java.lang.Throwable\`. It has two direct subclasses, and the split between them is the single most important fact in this lecture.
• **\`Throwable\`** — the root. It holds the message, the cause, the stack trace and the list of suppressed exceptions. You can technically throw a raw \`Throwable\`, but you never should.
• **\`Error\`** — serious problems in the JVM or environment that a normal application should **not** try to recover from. Examples: \`OutOfMemoryError\`, \`StackOverflowError\` (both under \`VirtualMachineError\`), \`NoClassDefFoundError\` (under \`LinkageError\`) and \`AssertionError\`. Catching these is usually pointless because the JVM may already be in an unstable state.
• **\`Exception\`** — conditions an application might reasonably want to catch. This branch has two flavours.
• **Checked exceptions** — direct subclasses of \`Exception\` that are not \`RuntimeException\`: \`IOException\`, \`FileNotFoundException\`, \`SQLException\`, \`InterruptedException\`, \`ClassNotFoundException\`, \`ParseException\`. The compiler forces you to handle or declare them.
• **\`RuntimeException\`** and its subclasses — **unchecked** exceptions that usually signal a programming bug: \`NullPointerException\`, \`ArrayIndexOutOfBoundsException\`, \`ArithmeticException\` (division by zero), \`ClassCastException\`, \`IllegalArgumentException\`, \`NumberFormatException\` (a subclass of \`IllegalArgumentException\`), \`IllegalStateException\`, \`UnsupportedOperationException\`, \`ConcurrentModificationException\`.
A useful mental picture: \`Error\` means "the JVM is in trouble", \`RuntimeException\` means "the programmer made a mistake", and checked exceptions mean "the outside world did something you must plan for". The program below prints the inheritance chain of a few well-known types so you can see the hierarchy with your own eyes instead of memorising it.`,
      codeSnippet: `// ExceptionHierarchyDemo.java
public class ExceptionHierarchyDemo {

    static void printChain(Class<?> type) {
        StringBuilder sb = new StringBuilder();
        for (Class<?> c = type; c != null; c = c.getSuperclass()) {
            sb.append(c.getSimpleName());
            if (c.getSuperclass() != null) sb.append(" -> ");
        }
        System.out.println(sb);
    }

    public static void main(String[] args) {
        printChain(java.io.FileNotFoundException.class);
        printChain(NumberFormatException.class);
        printChain(StackOverflowError.class);
        printChain(java.util.ConcurrentModificationException.class);

        // Checking the category at runtime
        Throwable t = new java.sql.SQLException("connection refused");
        boolean isChecked = t instanceof Exception && !(t instanceof RuntimeException);
        System.out.println("SQLException is checked? " + isChecked);
    }
}

/* Output:
FileNotFoundException -> IOException -> Exception -> Throwable -> Object
NumberFormatException -> IllegalArgumentException -> RuntimeException -> Exception -> Throwable -> Object
StackOverflowError -> VirtualMachineError -> Error -> Throwable -> Object
ConcurrentModificationException -> RuntimeException -> Exception -> Throwable -> Object
SQLException is checked? true
*/`
    },
    {
      heading: "3. Checked vs Unchecked Exceptions in Java",
      content: `The checked/unchecked distinction is enforced by the **compiler**, not the JVM. At runtime every exception behaves identically — it propagates up the stack until caught. The difference is purely about what the compiler demands from you while writing code.
**Checked exceptions** (everything under \`Exception\` except \`RuntimeException\`) follow the **"handle or declare" rule**: any method that can throw one must either catch it with \`try/catch\` or announce it with a \`throws\` clause in its signature. If you do neither, compilation fails with "unreported exception X; must be caught or declared to be thrown". The intent is to force callers to think about recoverable, external failures: the file might not exist, the socket might close, the thread might be interrupted.
**Unchecked exceptions** (\`RuntimeException\`, \`Error\` and their subclasses) need no declaration. They represent conditions that a correct program should never hit — dereferencing \`null\`, indexing past an array, passing an invalid argument. You *can* catch them, but the right fix is usually to correct the bug, not to add a catch block.
When should your own code throw which kind? The JDK guideline (Effective Java, Item 70) is:
• Use a **checked** exception when the caller can realistically **recover** — for example, an \`InsufficientFundsException\` where the UI can ask the user to choose another account.
• Use an **unchecked** exception for **programming errors** and precondition violations — \`IllegalArgumentException\` for a negative amount, \`IllegalStateException\` for calling \`withdraw\` on a closed account.
In practice, modern frameworks lean strongly toward unchecked: Spring wraps every \`SQLException\` in the unchecked \`DataAccessException\`, and Hibernate, JPA and most HTTP clients do the same. The reason is that checked exceptions do not compose well with lambdas and streams (a \`Function\` cannot throw a checked exception) and tend to produce long, meaningless \`throws\` lists. You will still meet checked exceptions constantly in \`java.io\`, \`java.nio.file\`, \`java.sql\` and \`java.net\`, so you must know the rules cold.`,
      codeSnippet: `// CheckedVsUnchecked.java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class CheckedVsUnchecked {

    // 1. Checked: the compiler forces 'throws' or try/catch
    static String readConfig(String fileName) throws IOException {
        return Files.readString(Path.of(fileName));   // declared: throws IOException
    }

    // 2. Unchecked: no declaration needed, but the bug is still there
    static int average(int[] marks) {
        int sum = 0;
        for (int m : marks) sum += m;
        return sum / marks.length;                      // ArithmeticException if length == 0
    }

    public static void main(String[] args) {
        // Handling the checked exception
        try {
            System.out.println(readConfig("app.properties"));
        } catch (IOException e) {
            System.out.println("Config missing, using defaults: " + e.getMessage());
        }

        // The unchecked one compiles fine and explodes at runtime
        try {
            System.out.println(average(new int[0]));
        } catch (ArithmeticException e) {
            System.out.println("Bug caught: " + e);     // java.lang.ArithmeticException: / by zero
        }

        // This line would NOT compile - uncomment to see the error:
        // String s = readConfig("x.txt");
        // error: unreported exception IOException; must be caught or declared to be thrown
    }
}`
    },
    {
      heading: "4. try, catch and finally: The Core Syntax of Java Exception Handling",
      content: `The basic structure has three parts:
• **\`try\`** — wraps the code that might throw. The moment an exception occurs, the remaining statements in the \`try\` block are skipped.
• **\`catch (Type name)\`** — runs only if an exception assignable to \`Type\` escaped the \`try\` block. You can stack several \`catch\` blocks; the JVM picks the **first** one whose type matches, so order them from most specific to most general.
• **\`finally\`** — runs **always**: after a normal completion, after a caught exception, after an uncaught exception, even after a \`return\` statement inside \`try\` or \`catch\`. Its purpose is cleanup: closing files, releasing locks, resetting state.
There are only a few situations where \`finally\` does not execute: the JVM exits (\`System.exit()\`), the thread is killed, or the machine loses power. Otherwise you can rely on it.
Two subtle rules trip people up in interviews:
1. **Order of execution with return**: when \`try\` executes \`return x;\`, the value of \`x\` is evaluated and saved, then \`finally\` runs, then the method actually returns the saved value. Modifying a local variable inside \`finally\` therefore does not change what is returned.
2. **A \`return\` or \`throw\` inside \`finally\` wins** — it overrides whatever the \`try\` or \`catch\` was about to return or throw, silently swallowing the original exception. Never return from \`finally\`; most IDEs and static analysers flag it.
A \`try\` must be followed by at least one \`catch\` or a \`finally\` (or be a try-with-resources). \`try { } finally { }\` with no \`catch\` is perfectly legal and common when you only need cleanup and want the exception to keep propagating.`,
      codeSnippet: `// TryCatchFinallyDemo.java
public class TryCatchFinallyDemo {

    static int parseAndDivide(String a, String b) {
        try {
            int x = Integer.parseInt(a);
            int y = Integer.parseInt(b);
            System.out.println("Dividing " + x + " by " + y);
            return x / y;
        } catch (NumberFormatException e) {          // most specific first
            System.out.println("Not a number: " + e.getMessage());
            return -1;
        } catch (ArithmeticException e) {
            System.out.println("Cannot divide by zero");
            return -2;
        } finally {
            System.out.println("finally runs for (" + a + ", " + b + ")");
        }
    }

    // Interview classic: what does this return?
    @SuppressWarnings("finally")
    static int finallyOverridesReturn() {
        try {
            return 1;
        } finally {
            return 2;      // overrides the 1 - never do this in real code
        }
    }

    public static void main(String[] args) {
        System.out.println(parseAndDivide("100", "4"));
        System.out.println(parseAndDivide("ten", "4"));
        System.out.println(parseAndDivide("100", "0"));
        System.out.println(finallyOverridesReturn());
    }
}

/* Output:
Dividing 100 by 4
finally runs for (100, 4)
25
Not a number: For input string: "ten"
finally runs for (ten, 4)
-1
Dividing 100 by 0
Cannot divide by zero
finally runs for (100, 0)
-2
2
*/`
    },
    {
      heading: "5. Multi-Catch Blocks and Catch Ordering (Java 7+)",
      content: `Before Java 7, handling three exception types the same way meant three identical \`catch\` blocks or a lazy \`catch (Exception e)\`. **Multi-catch**, added in Java 7, lets one block handle several unrelated types with the pipe operator: \`catch (IOException | SQLException e)\`.
Rules you must know:
• The alternatives **cannot be related by inheritance**. \`catch (FileNotFoundException | IOException e)\` is a compile error because \`FileNotFoundException\` already is an \`IOException\` — the compiler reports "Alternatives in a multi-catch statement cannot be related by subclassing".
• The catch parameter \`e\` is **implicitly final**. You cannot reassign it inside the block.
• The static type of \`e\` is the **nearest common supertype** of the alternatives (often \`Exception\`), so you can only call methods available on that type without a cast.
• Multi-catch produces smaller bytecode than duplicated blocks and keeps logging consistent.
**Catch ordering** matters whenever you have multiple \`catch\` blocks: the compiler rejects a general type placed before a specific subtype with "exception X has already been caught", because the later block would be unreachable. Always go from specific to general: \`FileNotFoundException\`, then \`IOException\`, then \`Exception\`.
**Java 22 addition — unnamed catch parameter.** JEP 456 (final in Java 22) lets you write \`catch (NumberFormatException _)\` when you do not use the exception object at all. The underscore makes the intent explicit — "I know an exception can occur here, and I am deliberately ignoring its details" — and silences unused-variable warnings. Use it sparingly; usually you should at least log.
**Precise rethrow (Java 7).** If you catch \`Exception e\` and simply \`throw e;\` without reassigning it, the compiler is smart enough to know that only the checked exceptions the \`try\` block can actually throw will escape, so your \`throws\` clause can stay specific instead of becoming \`throws Exception\`.`,
      codeSnippet: `// MultiCatchDemo.java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.SQLException;

public class MultiCatchDemo {

    static void loadReport(String path, boolean simulateDb) throws IOException, SQLException {
        if (simulateDb) throw new SQLException("ORA-12541: no listener");
        Files.readString(Path.of(path));
    }

    // Precise rethrow: catching Exception but still declaring the specific types
    static void loadWithLogging(String path, boolean simulateDb) throws IOException, SQLException {
        try {
            loadReport(path, simulateDb);
        } catch (Exception e) {
            System.out.println("Logging before rethrow: " + e.getClass().getSimpleName());
            throw e;   // compiler knows only IOException / SQLException can escape
        }
    }

    public static void main(String[] args) {
        String[] inputs = {"42", "4x2", "999999999999"};
        for (String in : inputs) {
            try {
                int value = Integer.parseInt(in);
                System.out.println("Parsed " + value);
            } catch (NumberFormatException _) {          // Java 22+: unnamed variable
                System.out.println("Skipping invalid input: " + in);
            }
        }

        try {
            loadWithLogging("missing-report.csv", false);
        } catch (IOException | SQLException e) {         // one block, two unrelated types
            System.out.println("Report unavailable: " + e.getClass().getSimpleName());
        }

        try {
            loadWithLogging("report.csv", true);
        } catch (IOException | SQLException e) {
            System.out.println("Report unavailable: " + e.getMessage());
        }
    }
}

/* Output:
Parsed 42
Skipping invalid input: 4x2
Skipping invalid input: 999999999999
Logging before rethrow: NoSuchFileException
Report unavailable: NoSuchFileException
Logging before rethrow: SQLException
Report unavailable: ORA-12541: no listener
*/`
    },
    {
      heading: "6. try-with-resources and AutoCloseable (Java 7+, Improved in Java 9)",
      content: `Resources such as files, sockets, database connections and JDBC statements must be released even when an exception occurs, or your application slowly leaks handles until it hits "Too many open files" or exhausts the connection pool. The pre-Java 7 pattern — declare the variable outside, open in \`try\`, close in \`finally\` with a null check and a nested try/catch around \`close()\` — was eight lines of boilerplate per resource and still easy to get wrong.
**try-with-resources** (Java 7) fixes this. Declare the resource inside parentheses after \`try\`, and the compiler generates the \`finally\` block for you. Any class that implements **\`java.lang.AutoCloseable\`** (a single method: \`void close() throws Exception\`) can be used. \`java.io.Closeable\` extends it with a narrower \`throws IOException\`. All JDK streams, readers, writers, channels, \`Scanner\`, JDBC \`Connection\`, \`Statement\`, \`ResultSet\` and \`ExecutorService\` (since Java 19) implement one of them.
Key behaviours:
• **Multiple resources** are separated by semicolons and closed in **reverse order** of declaration (last opened, first closed) — exactly what you want when one resource wraps another.
• **Resources are closed before any \`catch\` or \`finally\` attached to the same \`try\` runs.**
• **Suppressed exceptions**: if the \`try\` body throws and \`close()\` also throws, the body's exception is the one propagated, and the close exception is attached to it via \`addSuppressed()\`. You can inspect it with \`getSuppressed()\`. In the old manual pattern the close exception would silently replace the real one.
• **Java 9 improvement** (JEP 213): you can use an existing **final or effectively final** variable directly — \`try (existingReader)\` — instead of having to declare a new one in the header.
• The resource variable is implicitly \`final\`.
The demo below defines a custom \`AutoCloseable\` so you can watch the ordering and suppression happen.`,
      codeSnippet: `// TryWithResourcesDemo.java
import java.io.BufferedReader;
import java.io.IOException;
import java.io.StringReader;

public class TryWithResourcesDemo {

    static class Resource implements AutoCloseable {
        private final String name;
        private final boolean failOnClose;

        Resource(String name, boolean failOnClose) {
            this.name = name;
            this.failOnClose = failOnClose;
            System.out.println("open  " + name);
        }

        void use() { System.out.println("use   " + name); }

        @Override
        public void close() {
            System.out.println("close " + name);
            if (failOnClose) throw new IllegalStateException("close failed for " + name);
        }
    }

    public static void main(String[] args) {
        // 1. Reverse-order closing
        try (Resource db = new Resource("db-connection", false);
             Resource file = new Resource("export-file", false)) {
            db.use();
            file.use();
        }

        System.out.println("---");

        // 2. Suppressed exception: body throws AND close() throws
        try (Resource r = new Resource("flaky", true)) {
            r.use();
            throw new RuntimeException("body failed");
        } catch (RuntimeException e) {
            System.out.println("caught: " + e.getMessage());
            for (Throwable s : e.getSuppressed()) {
                System.out.println("suppressed: " + s.getMessage());
            }
        }

        System.out.println("---");

        // 3. Java 9+: effectively final variable used directly
        BufferedReader reader = new BufferedReader(new StringReader("Pune\\nJaipur"));
        try (reader) {
            System.out.println(reader.readLine());
        } catch (IOException e) {
            System.out.println("read failed: " + e.getMessage());
        }
    }
}

/* Output:
open  db-connection
open  export-file
use   db-connection
use   export-file
close export-file
close db-connection
---
open  flaky
use   flaky
close flaky
caught: body failed
suppressed: close failed for flaky
---
Pune
*/`
    },
    {
      heading: "7. throw vs throws: Raising and Declaring Exceptions",
      content: `Beginners mix these two keywords constantly, and interviewers know it.
**\`throw\`** is a **statement** that raises an exception right now. It takes exactly one operand — an instance of \`Throwable\` — and the statements after it in the same block never run. You almost always write \`throw new SomethingException("message")\`, but you can also rethrow an existing object: \`throw e;\`. It appears **inside** a method body.
**\`throws\`** is a **clause** in a method signature that declares which **checked** exceptions the method may let escape. It is a contract with callers: "I may fail in these ways; you must handle or declare them." You may list several types separated by commas. Declaring an unchecked exception in \`throws\` is legal but optional and mostly used for documentation.
Rules around \`throws\` and inheritance (connecting to Lecture 6):
• An overriding method may declare **the same, fewer, or narrower** checked exceptions than the parent method — never new or broader ones. Otherwise code written against the parent type would be surprised by an exception it did not handle.
• An overriding method may freely declare any unchecked exceptions.
• A constructor is not overridden, so a subclass constructor may declare more exceptions than the parent constructor.
• An interface method's \`throws\` clause restricts implementations in the same way. This is why \`Runnable.run()\`, which declares nothing, cannot run code that throws checked exceptions without wrapping them, while \`Callable.call()\` declares \`throws Exception\`.
A practical note on **fail-fast validation**: throw early, at the boundary where bad data enters (constructor, public method), rather than letting a \`null\` or negative value travel deep into your code where the eventual \`NullPointerException\` says nothing about the real cause. \`Objects.requireNonNull(x, "message")\` is the idiomatic one-liner for this.`,
      codeSnippet: `// ThrowVsThrowsDemo.java
import java.util.Objects;

public class ThrowVsThrowsDemo {

    static class Payment {
        private final String upiId;
        private final double amount;

        Payment(String upiId, double amount) {
            // throw: fail fast at the boundary
            this.upiId = Objects.requireNonNull(upiId, "upiId must not be null");
            if (amount <= 0) {
                throw new IllegalArgumentException("amount must be positive, got " + amount);
            }
            this.amount = amount;
        }
    }

    // throws: declares a checked exception to callers
    static void sendToBank(Payment p) throws java.io.IOException {
        if (p.amount > 1_00_000) {
            throw new java.io.IOException("Bank gateway rejected amount above 1,00,000");
        }
        System.out.println("Sent " + p.amount + " to " + p.upiId);
    }

    // Overriding rule: narrower is allowed, broader is not
    static class Gateway {
        void connect() throws java.io.IOException { }
    }
    static class SecureGateway extends Gateway {
        @Override
        void connect() throws java.io.FileNotFoundException { }   // narrower: OK
        // void connect() throws Exception { }                      // broader: compile error
    }

    public static void main(String[] args) {
        try {
            sendToBank(new Payment("ravi@upi", 2500));
            sendToBank(new Payment("ravi@upi", 2_50_000));
        } catch (java.io.IOException e) {
            System.out.println("Gateway error: " + e.getMessage());
        }

        try {
            new Payment(null, 100);
        } catch (NullPointerException e) {
            System.out.println("Validation: " + e.getMessage());
        }

        try {
            new Payment("ravi@upi", -5);
        } catch (IllegalArgumentException e) {
            System.out.println("Validation: " + e.getMessage());
        }
    }
}

/* Output:
Sent 2500.0 to ravi@upi
Gateway error: Bank gateway rejected amount above 1,00,000
Validation: upiId must not be null
Validation: amount must be positive, got -5.0
*/`
    },
    {
      heading: "8. Creating Custom Exceptions in Java",
      content: `The JDK's built-in exceptions describe generic problems. Your domain has specific ones: insufficient balance, seat already booked, OTP expired, KYC not verified. A **custom exception** gives these failures a name that callers can catch selectively, and a place to carry structured data (account number, required amount, error code) instead of stuffing everything into a message string that someone later parses with regex.
How to write one properly:
1. **Choose the parent.** Extend \`Exception\` for a checked exception the caller is expected to recover from, or \`RuntimeException\` for an unchecked one. Never extend \`Throwable\` or \`Error\` directly.
2. **Name it with the \`Exception\` suffix** — \`InsufficientFundsException\`, not \`InsufficientFunds\` or \`FundsError\`.
3. **Provide the standard constructors**: \`(String message)\` and \`(String message, Throwable cause)\` at minimum, so the exception can participate in chaining. A no-arg constructor is optional.
4. **Add domain fields** as \`private final\` with getters, and include them in the message so logs are self-explanatory.
5. **Consider a base exception for your module** (for example \`BankingException\`) so callers can catch the whole family in one block while still being able to catch specific subclasses.
6. Because \`Throwable\` implements \`Serializable\`, add a \`private static final long serialVersionUID = 1L;\` if the exception might cross a serialisation boundary (RMI, some messaging systems). Otherwise it is optional and many teams omit it.
One performance detail worth knowing: constructing any \`Throwable\` captures the full stack trace (\`fillInStackTrace()\`), which costs microseconds and can dominate hot paths that throw thousands of times per second. If you need a lightweight exception used purely for control flow (rare, and generally discouraged), use the protected constructor \`Throwable(String, Throwable, boolean enableSuppression, boolean writableStackTrace)\` added in Java 7 and pass \`false\` for the last argument.`,
      codeSnippet: `// CustomExceptionsDemo.java

// Base exception for the whole module (checked)
class BankingException extends Exception {
    private final String errorCode;

    public BankingException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public BankingException(String errorCode, String message, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }

    public String getErrorCode() { return errorCode; }
}

// Specific, recoverable failure with structured data
class InsufficientFundsException extends BankingException {
    private final double balance;
    private final double requested;

    public InsufficientFundsException(double balance, double requested) {
        super("BANK-001", String.format(
            "Insufficient funds: balance is %.2f but %.2f was requested", balance, requested));
        this.balance = balance;
        this.requested = requested;
    }

    public double getShortfall() { return requested - balance; }
}

// Programming error -> unchecked
class AccountClosedException extends RuntimeException {
    public AccountClosedException(String accountId) {
        super("Account " + accountId + " is closed; no operations allowed");
    }
}

public class CustomExceptionsDemo {
    static double balance = 1500.00;
    static boolean closed = false;

    static void withdraw(String accountId, double amount) throws BankingException {
        if (closed) throw new AccountClosedException(accountId);
        if (amount > balance) throw new InsufficientFundsException(balance, amount);
        balance -= amount;
        System.out.printf("Withdrew %.2f, new balance %.2f%n", amount, balance);
    }

    public static void main(String[] args) {
        try {
            withdraw("SB-1001", 500);
            withdraw("SB-1001", 5000);
        } catch (InsufficientFundsException e) {
            System.out.println(e.getErrorCode() + " -> " + e.getMessage());
            System.out.printf("You need %.2f more%n", e.getShortfall());
        } catch (BankingException e) {       // catches any other subclass of the family
            System.out.println("Banking problem: " + e.getMessage());
        }
    }
}

/* Output:
Withdrew 500.00, new balance 1000.00
BANK-001 -> Insufficient funds: balance is 1000.00 but 5000.00 was requested
You need 4000.00 more
*/`
    },
    {
      heading: "9. Exception Chaining and Wrapping: Preserving the Root Cause",
      content: `Layered applications translate exceptions as they cross boundaries. A repository catches \`SQLException\` and throws \`DataAccessException\`; a service catches that and throws \`OrderNotSavedException\`; a controller turns it into an HTTP 500. If each layer throws a brand-new exception and discards the one it caught, the log at the top shows "order not saved" and nothing else — the fact that the real cause was "ORA-00001: unique constraint violated" is lost forever.
**Exception chaining** (available since Java 1.4) solves this. Every \`Throwable\` has a **cause** field, set either through the constructor \`(String message, Throwable cause)\` or by calling \`initCause(cause)\` once. \`getCause()\` returns it, and \`printStackTrace()\` prints the full chain with "Caused by:" lines, so the root cause is always visible.
Guidelines:
• **Always pass the original exception as the cause** when you wrap. The pattern \`catch (SQLException e) { throw new DataAccessException("Failed to save order", e); }\` is correct; omitting \`e\` is the single most common chaining mistake.
• **Wrap to translate abstraction level**, not for fun. Callers of \`OrderService\` should not need to know JDBC exists. Each wrap should add context the lower layer could not know (which order, which customer).
• **Do not wrap when the existing exception already says exactly the right thing** — rethrow it.
• To find the root cause programmatically, walk \`getCause()\` until it returns \`null\`. Apache Commons Lang's \`ExceptionUtils.getRootCause\` and Spring's \`NestedExceptionUtils\` do this for you.
• **Suppressed exceptions** (Java 7, see section 6) are a second kind of attachment: they are not the cause, they are additional failures that happened while handling the first one, and they print as "Suppressed:" lines.
The wrapping is also how you escape the **checked-exception-in-lambda** problem: inside a \`Stream.map\` you cannot throw \`IOException\`, so you catch it and rethrow an \`UncheckedIOException\` (a JDK class added in Java 8 specifically for this) with the original as cause.`,
      codeSnippet: `// ExceptionChainingDemo.java
import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.SQLException;
import java.util.List;

class DataAccessException extends RuntimeException {
    DataAccessException(String message, Throwable cause) { super(message, cause); }
}

class OrderService {
    void saveOrder(int orderId) {
        try {
            insertRow(orderId);
        } catch (SQLException e) {
            // Translate to the service layer's language, keep the cause
            throw new DataAccessException("Failed to save order #" + orderId, e);
        }
    }

    private void insertRow(int orderId) throws SQLException {
        throw new SQLException("ORA-00001: unique constraint (ORDERS_PK) violated", "23000", 1);
    }
}

public class ExceptionChainingDemo {

    static Throwable rootCause(Throwable t) {
        while (t.getCause() != null) t = t.getCause();
        return t;
    }

    public static void main(String[] args) {
        try {
            new OrderService().saveOrder(7781);
        } catch (DataAccessException e) {
            System.out.println("Top:  " + e.getMessage());
            System.out.println("Root: " + rootCause(e).getMessage());
            System.out.println("Root type: " + rootCause(e).getClass().getSimpleName());
        }

        // Checked exception inside a lambda: wrap as UncheckedIOException
        List<String> files = List.of("a.txt", "b.txt");
        try {
            files.stream()
                 .map(name -> {
                     try {
                         return Files.readString(Path.of(name));
                     } catch (IOException ioe) {
                         throw new UncheckedIOException("Cannot read " + name, ioe);
                     }
                 })
                 .forEach(System.out::println);
        } catch (UncheckedIOException e) {
            System.out.println(e.getMessage() + " (cause: " + e.getCause().getClass().getSimpleName() + ")");
        }
    }
}

/* Output:
Top:  Failed to save order #7781
Root: ORA-00001: unique constraint (ORDERS_PK) violated
Root type: SQLException
Cannot read a.txt (cause: NoSuchFileException)
*/`
    },
    {
      heading: "10. Helpful NullPointerException Messages (Java 14, Default Since Java 15)",
      content: `\`NullPointerException\` is the most common exception in Java history, and for 25 years its message was useless. A line like \`order.getCustomer().getAddress().getCity().toUpperCase()\` could fail with a plain "NullPointerException at line 42" and you had to guess which of the four calls returned \`null\`.
**JEP 358, Helpful NullPointerExceptions**, shipped in **Java 14** behind the flag \`-XX:+ShowCodeDetailWithExceptionMessage\` and was turned **on by default in Java 15**. On any modern JDK (including Java 21 and Java 25 LTS) the JVM now analyses the bytecode at the failing instruction and tells you exactly **what was null** and **what it was trying to do with it**:
• \`Cannot invoke "String.toUpperCase()" because the return value of "Address.getCity()" is null\`
• \`Cannot read field "city" because "this.address" is null\`
• \`Cannot load from int array because "marks" is null\`
• \`Cannot assign field "name" because "customer" is null\`
• \`Cannot invoke "java.util.List.size()" because "<local2>" is null\`
Two practical details:
1. **Local variable names** appear only if the class was compiled with debug information (\`javac -g\`). Without it, you see placeholders like \`<local2>\` (the second local-variable slot). Maven's compiler plugin passes \`-g\` by default, so in most real projects you get real names; if you compile by hand, add \`-g\`.
2. The helpful message is computed lazily, only when \`getMessage()\` is called, so there is no runtime cost for NPEs that are thrown and caught without inspecting them. Exceptions created explicitly with \`new NullPointerException("...")\` keep your custom message instead.
Helpful messages make debugging faster, but the real goal is to **not throw NPEs at all**. The next section shows \`Optional\`, and the Common Mistakes section lists the usual sources.`,
      codeSnippet: `// HelpfulNpeDemo.java   (compile with: javac -g HelpfulNpeDemo.java)
public class HelpfulNpeDemo {

    static class Address {
        String city;
        String getCity() { return city; }
    }

    static class Customer {
        Address address;
        Address getAddress() { return address; }
    }

    public static void main(String[] args) {
        Customer customer = new Customer();
        customer.address = new Address();          // city is still null

        try {
            String upper = customer.getAddress().getCity().toUpperCase();
            System.out.println(upper);
        } catch (NullPointerException e) {
            System.out.println("1: " + e.getMessage());
        }

        Customer nobody = null;
        try {
            System.out.println(nobody.address);
        } catch (NullPointerException e) {
            System.out.println("2: " + e.getMessage());
        }

        int[] marks = null;
        try {
            System.out.println(marks[0]);
        } catch (NullPointerException e) {
            System.out.println("3: " + e.getMessage());
        }
    }
}

/* Output on Java 15+ (compiled with -g):
1: Cannot invoke "String.toUpperCase()" because the return value of "HelpfulNpeDemo$Address.getCity()" is null
2: Cannot read field "address" because "nobody" is null
3: Cannot load from int array because "marks" is null
*/`
    },
    {
      heading: "11. Avoiding null with Optional (Java 8+)",
      content: `Many exceptions are really **missing values** in disguise. A method like \`findCustomerById(id)\` that returns \`null\` when nothing is found forces every caller to remember a null check; forget once and you get an NPE three layers away. \`java.util.Optional<T>\` (Java 8) is a container that holds either one non-null value or nothing, making the possibility of absence **visible in the method signature** so the compiler and your IDE remind you to deal with it.
Creating an Optional:
• \`Optional.of(value)\` — throws NPE if \`value\` is null (use when null would be a bug).
• \`Optional.ofNullable(value)\` — empty if null.
• \`Optional.empty()\` — the empty instance.
Consuming it safely (prefer these over \`get()\`):
• \`orElse(default)\` — returns the value or a default. The default expression is **always evaluated**, even when the Optional is non-empty.
• \`orElseGet(supplier)\` — lazy; the supplier runs only when empty. Use this when the default is expensive (database call, object creation).
• \`orElseThrow(() -> new NotFoundException(id))\` — convert absence back into an exception at the boundary where that is the right outcome. The no-argument \`orElseThrow()\` (Java 10) throws \`NoSuchElementException\` and is the preferred replacement for \`get()\`.
• \`map(fn)\` / \`flatMap(fn)\` / \`filter(pred)\` — transform without unwrapping; a null anywhere in the chain just yields an empty Optional instead of an NPE.
• \`ifPresent(consumer)\` and \`ifPresentOrElse(consumer, runnable)\` (Java 9).
• \`isPresent()\` and \`isEmpty()\` (Java 11), \`or(supplier)\` (Java 9), \`stream()\` (Java 9).
Where **not** to use Optional (the designers were explicit about this):
• Not as a **field** in an entity or DTO — it is not \`Serializable\` and adds an object per field.
• Not as a **method parameter** — it forces callers to wrap; use overloads or nullable parameters.
• Not for **collections** — return an empty \`List\`, never \`Optional<List<T>>\`.
• Not with \`isPresent()\` followed by \`get()\` — that is just a null check with extra steps; use \`map\`/\`orElse\`.
Optional is a **return-type** tool. Spring Data JPA's \`findById\` returns \`Optional<T>\`, which is why you will write \`repository.findById(id).orElseThrow(() -> new ResourceNotFoundException(...))\` hundreds of times in Spring Boot projects.`,
      codeSnippet: `// OptionalDemo.java
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;

public class OptionalDemo {

    record Address(String city, String pincode) {}
    record Customer(String name, Address address) {}

    static final Map<Integer, Customer> DB = Map.of(
        1, new Customer("Ananya", new Address("Bengaluru", "560001")),
        2, new Customer("Rahul", null)                      // address not yet filled
    );

    // Absence is visible in the signature
    static Optional<Customer> findById(int id) {
        return Optional.ofNullable(DB.get(id));
    }

    static String cityOf(int id) {
        return findById(id)
            .map(Customer::address)        // empty if customer or address is null
            .map(Address::city)
            .filter(c -> !c.isBlank())
            .orElse("Unknown");
    }

    public static void main(String[] args) {
        System.out.println(cityOf(1));                          // Bengaluru
        System.out.println(cityOf(2));                          // Unknown  (no NPE!)
        System.out.println(cityOf(99));                         // Unknown

        // orElse vs orElseGet: watch which default gets built
        findById(1).map(Customer::name).orElse(buildDefault("orElse"));
        findById(1).map(Customer::name).orElseGet(() -> buildDefault("orElseGet"));

        // Turning absence into an exception at the API boundary
        try {
            Customer c = findById(99).orElseThrow(
                () -> new NoSuchElementException("Customer 99 not found"));
            System.out.println(c);
        } catch (NoSuchElementException e) {
            System.out.println("404: " + e.getMessage());
        }

        findById(2).ifPresentOrElse(
            c -> System.out.println("Found " + c.name()),
            () -> System.out.println("Nobody"));
    }

    static String buildDefault(String caller) {
        System.out.println("building default for " + caller);
        return "Guest";
    }
}

/* Output:
Bengaluru
Unknown
Unknown
building default for orElse
404: Customer 99 not found
Found Rahul
*/`
    },
    {
      heading: "12. Java Exception Handling Best Practices for Production Code",
      content: `These rules are distilled from Effective Java, the Google Java Style Guide and years of production incidents. Interviewers for 2+ year roles expect you to know most of them.
• **Catch the most specific type you can handle, and only where you can actually handle it.** A catch block that cannot fix, retry, fall back or meaningfully translate the problem should not exist; let the exception propagate to a layer that can.
• **Never swallow exceptions.** An empty \`catch\` block, or one that only prints to \`System.out\`, hides failures until they become data corruption. If you truly intend to ignore an exception, comment why and name the parameter \`ignored\` (or use \`_\` on Java 22+).
• **Log or rethrow — not both.** Logging at every layer produces the same stack trace five times and drowns the real signal. Log once at the top (controller advice, main loop, thread's uncaught exception handler) and let lower layers add context by wrapping.
• **Include context in messages**: identifiers, values, limits. "Invalid amount" is useless; "amount 2,50,000 exceeds per-transaction limit 1,00,000 for account SB-1001" tells the on-call engineer everything.
• **Prefer unchecked exceptions for programming errors, checked for recoverable conditions** — and in APIs consumed through lambdas and streams, lean unchecked.
• **Do not use exceptions for normal control flow.** Checking \`map.containsKey\` or \`Optional\` is 100–1000x cheaper than throwing and catching, because each throw fills a stack trace.
• **Always close resources with try-with-resources**, never manual \`finally\` blocks.
• **Never catch \`Throwable\` or \`Error\`** in ordinary code — you will catch \`OutOfMemoryError\` and continue in a broken state. The only legitimate place is a top-level handler that logs and exits.
• **Never return from \`finally\`**, and avoid throwing from it.
• **Preserve the cause when wrapping** (\`new X(msg, e)\`), and preserve the stack trace when rethrowing (\`throw e;\`, not \`throw new SameType(e.getMessage())\`).
• **Validate early with precise exceptions**: \`IllegalArgumentException\` for bad input, \`IllegalStateException\` for calling a method at the wrong time, \`NullPointerException\` via \`Objects.requireNonNull\` for null arguments, \`UnsupportedOperationException\` for optional operations.
• **Document exceptions with \`@throws\`** in Javadoc for every public method, including unchecked ones that callers should know about.
• **Handle \`InterruptedException\` correctly**: either rethrow it or call \`Thread.currentThread().interrupt()\` before continuing, so the interrupt flag is not lost.
• **Set a default uncaught-exception handler** (\`Thread.setDefaultUncaughtExceptionHandler\`) in long-running services so a crash in a background thread is logged instead of silently killing the thread.`,
      codeSnippet: `// BestPracticesDemo.java
import java.util.concurrent.TimeUnit;

public class BestPracticesDemo {

    // Correct InterruptedException handling: restore the flag
    static void waitForRetry(long millis) {
        try {
            TimeUnit.MILLISECONDS.sleep(millis);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();      // do not swallow the interrupt
            throw new IllegalStateException("Retry wait interrupted", e);
        }
    }

    // Retry with a bounded loop: exception handled where it can be handled
    static String callGateway(int attempt) {
        if (attempt < 3) throw new IllegalStateException("gateway timeout (attempt " + attempt + ")");
        return "SUCCESS";
    }

    static String callWithRetry(int maxAttempts) {
        IllegalStateException last = null;
        for (int attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                return callGateway(attempt);
            } catch (IllegalStateException e) {
                last = e;
                System.out.println("Attempt " + attempt + " failed: " + e.getMessage());
                waitForRetry(50L * attempt);
            }
        }
        throw new IllegalStateException("Gave up after " + maxAttempts + " attempts", last);
    }

    public static void main(String[] args) {
        // Log once, at the top, for background threads
        Thread.setDefaultUncaughtExceptionHandler((thread, ex) ->
            System.out.println("[" + thread.getName() + "] crashed: " + ex));

        System.out.println(callWithRetry(5));

        Thread worker = new Thread(() -> { throw new RuntimeException("boom in worker"); }, "worker-1");
        worker.start();
    }
}

/* Output:
Attempt 1 failed: gateway timeout (attempt 1)
Attempt 2 failed: gateway timeout (attempt 2)
SUCCESS
[worker-1] crashed: java.lang.RuntimeException: boom in worker
*/`
    },
    {
      heading: "13. Real-World Use Cases: How Exception Handling Is Used in Production Java",
      content: `Here is where the concepts above show up in a typical Indian fintech, e-commerce or SaaS codebase.
**1. REST APIs with Spring Boot.** Controllers never catch exceptions themselves. A single class annotated \`@RestControllerAdvice\` holds \`@ExceptionHandler\` methods that map each exception family to an HTTP status and a JSON body: \`ResourceNotFoundException\` → 404, \`MethodArgumentNotValidException\` (Bean Validation) → 400 with field errors, \`AccessDeniedException\` (Spring Security) → 403, \`DataIntegrityViolationException\` → 409, everything else → 500 with a correlation ID. Since Spring Framework 6 / Spring Boot 3, the standard body is \`ProblemDetail\` (RFC 9457 "problem details"), which Spring Boot 4 continues to support.
**2. Database transactions.** With Spring's \`@Transactional\`, an **unchecked** exception escaping the method triggers rollback; a **checked** exception does **not** roll back unless you add \`rollbackFor = Exception.class\`. Many production bugs trace back to a developer throwing a custom checked exception and wondering why the half-finished insert was committed.
**3. Payment gateways and retries.** Calls to Razorpay, PayU or a bank's UPI switch distinguish **transient** failures (timeouts, 503 — retry with backoff) from **permanent** ones (invalid VPA, insufficient funds — fail immediately and notify the user). This is modelled as two exception types, with libraries like Resilience4j configured to retry only the transient one.
**4. File and batch processing.** A nightly job reading 10 lakh rows of a CSV catches per-row parse exceptions, writes the bad rows to an error file with line numbers, and continues — rather than aborting the whole job at row 3,412. Try-with-resources guarantees the reader and the error writer are closed.
**5. Microservice resilience.** Circuit breakers convert a flood of \`ConnectException\`s into a fast \`CallNotPermittedException\` so a dead downstream service does not tie up all your threads. Fallback methods return cached or default data.
**6. Logging and observability.** Structured logging (Logback + JSON) records \`exception.class\`, \`exception.message\` and the root cause as fields, so tools like ELK, Datadog or Grafana Loki can group incidents by exception type. Error-tracking services (Sentry) deduplicate by stack trace fingerprint.
**7. Android and desktop apps.** Uncaught exceptions crash the app; a global handler captures them, writes a crash report and restarts gracefully. Network calls on background threads surface errors to the UI through result types rather than exceptions.
The snippet shows a compact Spring Boot global handler so you recognise the pattern when you see it at work.`,
      codeSnippet: `// src/main/java/com/example/shop/api/GlobalExceptionHandler.java
package com.example.shop.api;

import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

class ResourceNotFoundException extends RuntimeException {
    ResourceNotFoundException(String what, Object id) {
        super(what + " " + id + " not found");
    }
}

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(ResourceNotFoundException.class)
    ProblemDetail handleNotFound(ResourceNotFoundException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ProblemDetail handleValidation(MethodArgumentNotValidException ex) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(
            HttpStatus.BAD_REQUEST, "Request validation failed");
        pd.setProperty("errors", ex.getBindingResult().getFieldErrors().stream()
            .map(fe -> fe.getField() + ": " + fe.getDefaultMessage())
            .toList());
        return pd;
    }

    @ExceptionHandler(Exception.class)
    ProblemDetail handleUnexpected(Exception ex) {
        String correlationId = UUID.randomUUID().toString();
        log.error("Unhandled exception, correlationId={}", correlationId, ex);   // log ONCE, here
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(
            HttpStatus.INTERNAL_SERVER_ERROR, "Something went wrong. Quote id " + correlationId);
        pd.setProperty("correlationId", correlationId);
        return pd;
    }
}

// Example 404 response body (application/problem+json):
// { "type": "about:blank", "title": "Not Found", "status": 404,
//   "detail": "Order 7781 not found", "instance": "/api/orders/7781" }`
    },
    {
      heading: "14. Common Mistakes with Java Exception Handling and How to Fix Them",
      content: `**Mistake 1: The empty catch block.** \`catch (Exception e) { }\` is the number one source of "it works on my machine but data is missing in production". Fix: handle it, log it with the stack trace, or let it propagate. If you must ignore, write a comment explaining why.
**Mistake 2: Catching \`Exception\` or \`Throwable\` everywhere.** A blanket catch also grabs \`NullPointerException\` and \`ClassCastException\`, hiding bugs as if they were expected failures. Fix: catch the specific types your code can actually recover from, and reserve a broad catch for the single top-level handler.
**Mistake 3: Losing the cause.** \`throw new ServiceException("save failed");\` inside a catch block throws away the original stack trace. Fix: \`throw new ServiceException("save failed", e);\`.
**Mistake 4: Losing the stack trace on rethrow.** \`throw new RuntimeException(e.getMessage());\` creates a new trace pointing at the catch block. Fix: \`throw e;\` or wrap with the cause.
**Mistake 5: \`return\` inside \`finally\`.** It silently discards any exception thrown in \`try\`. Fix: never return or throw from \`finally\`; use it only for cleanup.
**Mistake 6: Manual resource closing.** Forgetting the null check, forgetting to close on the exception path, or letting \`close()\` replace the real exception. Fix: try-with-resources, always.
**Mistake 7: Using exceptions for flow control.** Parsing user input with \`try { Integer.parseInt(s) } catch (NumberFormatException e) { return default; }\` in a loop over a million rows is slow because every throw captures a stack trace. Fix: validate with a regex or a scanner first, or accept the cost only when invalid input is genuinely rare.
**Mistake 8: Wrong catch order.** Placing \`catch (Exception e)\` before \`catch (IOException e)\` is a compile error ("exception IOException has already been caught"). Fix: specific first, general last.
**Mistake 9: Declaring \`throws Exception\` on everything.** It pushes the problem to the caller, who then also declares \`throws Exception\`, until \`main\` does. Fix: declare the specific types, or wrap in a meaningful unchecked exception at the layer boundary.
**Mistake 10: Checked exception rolls back nothing in Spring.** \`@Transactional\` only rolls back on unchecked exceptions by default. Fix: \`@Transactional(rollbackFor = BankingException.class)\` or make the exception unchecked.
**Mistake 11: Swallowing \`InterruptedException\`.** Catching it and doing nothing means the thread can never be stopped cleanly. Fix: call \`Thread.currentThread().interrupt()\` and stop the work.
**Mistake 12: \`Optional.get()\` without checking**, or \`isPresent()\` + \`get()\`. Fix: \`orElse\`, \`orElseGet\`, \`orElseThrow\`, \`map\`.
**Mistake 13: Logging and rethrowing at every layer.** One failure appears five times in the log, each with a full stack trace. Fix: wrap with context at lower layers, log once at the top.
**Mistake 14: Exposing stack traces to users.** Returning \`e.toString()\` in an HTTP response leaks class names, SQL and file paths. Fix: return a generic message plus a correlation ID; keep the trace in the server log.`,
      codeSnippet: `// CommonMistakesFixed.java - before/after pairs
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.OptionalInt;

public class CommonMistakesFixed {

    // BEFORE (mistake 3 + 4): cause and trace lost
    static String loadBad(String file) {
        try {
            return Files.readString(Path.of(file));
        } catch (IOException e) {
            throw new RuntimeException("load failed: " + e.getMessage());   // no cause!
        }
    }

    // AFTER: cause preserved, meaningful type
    static String loadGood(String file) {
        try {
            return Files.readString(Path.of(file));
        } catch (IOException e) {
            throw new java.io.UncheckedIOException("Cannot load " + file, e);
        }
    }

    // BEFORE (mistake 7): exceptions as flow control in a hot loop
    static int parseBad(String s) {
        try { return Integer.parseInt(s); } catch (NumberFormatException e) { return 0; }
    }

    // AFTER: validate first, throw only for truly unexpected input
    static OptionalInt parseGood(String s) {
        if (s == null || !s.matches("-?\\\\d{1,9}")) return OptionalInt.empty();
        return OptionalInt.of(Integer.parseInt(s));
    }

    public static void main(String[] args) {
        try {
            loadBad("nope.txt");
        } catch (RuntimeException e) {
            System.out.println("bad:  cause = " + e.getCause());            // null
        }
        try {
            loadGood("nope.txt");
        } catch (RuntimeException e) {
            System.out.println("good: cause = " + e.getCause().getClass().getSimpleName());
        }

        System.out.println(parseBad("12x"));                 // 0  (silently wrong?)
        System.out.println(parseGood("12x").isPresent());    // false (explicit)
        System.out.println(parseGood("450").getAsInt());     // 450
    }
}

/* Output:
bad:  cause = null
good: cause = NoSuchFileException
0
false
450
*/`
    },
    {
      heading: "15. Frequently Asked Questions about Java Exception Handling",
      content: `**What is the difference between checked and unchecked exceptions in Java?**
Checked exceptions extend \`Exception\` (but not \`RuntimeException\`) and the compiler forces you to catch or declare them; they represent recoverable external failures like \`IOException\` and \`SQLException\`. Unchecked exceptions extend \`RuntimeException\` or \`Error\`, need no declaration, and usually indicate programming bugs such as \`NullPointerException\` or \`ArrayIndexOutOfBoundsException\`.
**What is the difference between throw and throws in Java?**
\`throw\` is a statement inside a method that actually raises an exception object right now. \`throws\` is part of the method signature that declares which checked exceptions the method may propagate to its caller. One throws, the other warns.
**Does finally always execute in Java?**
Yes, in every normal case: after success, after a caught exception, after an uncaught exception, and even after a \`return\` in \`try\`. It is skipped only if the JVM terminates (\`System.exit()\`, a fatal crash) or the thread is killed before reaching it.
**What is the difference between final, finally and finalize in Java?**
\`final\` is a modifier that prevents reassignment of a variable, overriding of a method or subclassing of a class. \`finally\` is the block that always runs after \`try\`/\`catch\` for cleanup. \`finalize()\` was a method on \`Object\` called by the garbage collector before reclaiming an object; it has been deprecated since Java 9 and deprecated for removal since Java 18 — never use it.
**What is try-with-resources in Java and when should I use it?**
It is a \`try\` statement that declares one or more \`AutoCloseable\` resources in parentheses; the compiler automatically closes them in reverse order when the block exits, whether normally or by exception. Use it for every file, stream, socket, JDBC object or lock-like resource — it replaces manual \`finally\` blocks and correctly handles exceptions thrown by \`close()\`.
**Can we have a try block without catch in Java?**
Yes. \`try { } finally { }\` is valid when you only need cleanup and want the exception to propagate, and a try-with-resources statement needs neither \`catch\` nor \`finally\`. A plain \`try\` with nothing after it is a compile error.
**How do I create a custom exception in Java?**
Create a class that extends \`Exception\` (checked) or \`RuntimeException\` (unchecked), name it with the \`Exception\` suffix, and provide constructors that accept a message and a cause so it can be chained. Add fields for structured data such as error codes, and consider a common base class for your module.
**What are helpful NullPointerException messages?**
Starting with Java 14 (JEP 358) and enabled by default since Java 15, the JVM describes exactly which expression was null and what operation failed, for example \`Cannot invoke "String.length()" because "name" is null\`. Compile with \`-g\` (Maven does by default) to see local-variable names instead of \`<local1>\` placeholders.`
    },
    {
      heading: "16. Interview Questions and Answers on Java Exception Handling",
      content: `**Q1. Explain the Java exception hierarchy.**
\`Throwable\` is the root with two children: \`Error\` (JVM-level problems like \`OutOfMemoryError\` and \`StackOverflowError\`, not meant to be caught) and \`Exception\` (application-level problems). Under \`Exception\`, \`RuntimeException\` and its subclasses are unchecked; all other \`Exception\` subclasses are checked.
**Q2. What happens if an exception is thrown in a catch block?**
The new exception propagates out of the method just as if it had been thrown in \`try\`, after the \`finally\` block (if any) executes. The original exception is lost unless you pass it as the cause of the new one.
**Q3. What does this code print: try returns 1, finally sets a variable to 2 and does not return?**
It returns 1. The return value is evaluated and saved before \`finally\` runs; later changes to the local variable inside \`finally\` do not affect the saved value. If \`finally\` itself contains \`return 2;\`, then 2 is returned and any pending exception is discarded.
**Q4. Can an overriding method throw a broader checked exception than the overridden method?**
No. It may throw the same, narrower or fewer checked exceptions, or none. It may throw any unchecked exception. This preserves substitutability: code written against the parent type cannot be surprised by a new checked exception.
**Q5. What are the restrictions on multi-catch?**
The alternative types must not be subclasses of one another, the catch parameter is implicitly final, and its static type is the closest common supertype. Multi-catch was introduced in Java 7.
**Q6. In what order are resources closed in try-with-resources, and what happens if both the body and close() throw?**
Resources are closed in reverse declaration order, before any \`catch\` or \`finally\` of the same \`try\`. If the body throws and \`close()\` also throws, the body's exception propagates and the close exception is attached via \`addSuppressed()\`, retrievable with \`getSuppressed()\`.
**Q7. Why does Spring prefer unchecked exceptions?**
Checked exceptions do not work in lambdas and functional interfaces, pollute method signatures through every layer, and most persistence failures are not recoverable at the call site anyway. Spring wraps \`SQLException\` into the unchecked \`DataAccessException\` hierarchy, and \`@Transactional\` rolls back by default only on unchecked exceptions.
**Q8. Is it a good idea to catch OutOfMemoryError?**
Generally no. By the time it is thrown the heap is exhausted, and your catch block may itself fail to allocate. The sensible response is to let the process die and restart (container orchestrators do this), after logging if possible. The exception is a narrowly scoped case such as freeing a large cache you own and retrying once.
**Q9. What is exception chaining and why does it matter?**
Chaining attaches the original exception as the \`cause\` of a new, higher-level exception via the constructor or \`initCause()\`. It lets each layer speak its own language (\`SQLException\` → \`DataAccessException\` → \`OrderNotSavedException\`) while \`printStackTrace()\` still shows the full "Caused by" chain down to the root.
**Q10. What is the cost of throwing an exception, and how does it affect design?**
Creating a \`Throwable\` captures the whole stack trace, which costs roughly a microsecond or more depending on stack depth, far slower than a branch. Hence exceptions should not be used for expected control flow (loop termination, "not found" lookups); use return values, \`Optional\`, or validate before parsing. In rare hot paths you can disable the stack trace with the Java 7 \`writableStackTrace=false\` constructor.`
    },
    {
      heading: "17. Hands-On Exercise: A Bank Transfer Service with Custom Exceptions, try-with-resources and Optional",
      content: `Build a small in-memory banking module that demonstrates every concept in this lecture together:
1. A checked \`InsufficientFundsException\` and an unchecked \`AccountNotFoundException\`, both built on a base \`BankingException\` carrying an error code.
2. A \`TransactionLog\` that implements \`AutoCloseable\` and is used with try-with-resources, so it is flushed even when a transfer fails.
3. A repository that returns \`Optional<Account>\` so callers decide how to treat a missing account.
4. A \`transfer\` method that validates inputs with \`IllegalArgumentException\`, debits and credits atomically (restoring the balance if the credit fails), and wraps a low-level \`IOException\` from the audit step as the cause of a \`BankingException\`.
5. A \`main\` that runs four scenarios — success, insufficient funds, unknown account, and an audit failure — printing a clear result for each, and finally reads the suppressed/cause chain.
Save the file as \`BankTransferExercise.java\`, compile with \`javac BankTransferExercise.java\` and run with \`java BankTransferExercise\`. Then extend it: add a daily transfer limit of ₹1,00,000 that throws \`DailyLimitExceededException\`, and make \`AccountNotFoundException\` include the list of valid account IDs in its message.`,
      codeSnippet: `// BankTransferExercise.java
import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

// ---------- Exceptions ----------
class BankingException extends Exception {
    private final String code;
    BankingException(String code, String message) { super(message); this.code = code; }
    BankingException(String code, String message, Throwable cause) { super(message, cause); this.code = code; }
    String code() { return code; }
}

class InsufficientFundsException extends BankingException {
    InsufficientFundsException(String accountId, double balance, double requested) {
        super("BANK-001", String.format("Account %s has %.2f, cannot transfer %.2f",
              accountId, balance, requested));
    }
}

class AccountNotFoundException extends RuntimeException {
    AccountNotFoundException(String accountId) { super("No account with id " + accountId); }
}

// ---------- Domain ----------
class Account {
    final String id;
    private double balance;
    Account(String id, double balance) { this.id = id; this.balance = balance; }
    double balance() { return balance; }
    void debit(double amount) { balance -= amount; }
    void credit(double amount) { balance += amount; }
}

class AccountRepository {
    private final Map<String, Account> store = new LinkedHashMap<>();
    void save(Account a) { store.put(a.id, a); }
    Optional<Account> findById(String id) { return Optional.ofNullable(store.get(id)); }
}

// AutoCloseable resource: collects entries, flushes on close
class TransactionLog implements AutoCloseable {
    private final List<String> entries = new ArrayList<>();
    void record(String entry) { entries.add(entry); }
    @Override public void close() {
        System.out.println("  [log flushed: " + entries.size() + " entries] " + entries);
    }
}

// Simulates writing to an audit system that may fail
class AuditService {
    void audit(String from, String to, double amount) throws IOException {
        if (amount == 13) throw new IOException("audit service unreachable (timeout 5000 ms)");
    }
}

// ---------- Service ----------
class TransferService {
    private final AccountRepository repo;
    private final AuditService audit;
    TransferService(AccountRepository repo, AuditService audit) { this.repo = repo; this.audit = audit; }

    void transfer(String fromId, String toId, double amount) throws BankingException {
        if (amount <= 0) throw new IllegalArgumentException("amount must be positive: " + amount);
        if (fromId.equals(toId)) throw new IllegalArgumentException("cannot transfer to the same account");

        Account from = repo.findById(fromId).orElseThrow(() -> new AccountNotFoundException(fromId));
        Account to   = repo.findById(toId).orElseThrow(() -> new AccountNotFoundException(toId));

        try (TransactionLog log = new TransactionLog()) {
            log.record("BEGIN " + fromId + " -> " + toId + " : " + amount);
            if (from.balance() < amount) {
                log.record("ABORT insufficient funds");
                throw new InsufficientFundsException(fromId, from.balance(), amount);
            }
            from.debit(amount);
            log.record("DEBIT " + fromId);
            try {
                audit.audit(fromId, toId, amount);
                to.credit(amount);
                log.record("CREDIT " + toId);
            } catch (IOException e) {
                from.credit(amount);                      // compensate: restore balance
                log.record("ROLLBACK " + fromId);
                throw new BankingException("BANK-500", "Transfer could not be audited", e);
            }
            log.record("COMMIT");
        }
    }
}

// ---------- Runner ----------
public class BankTransferExercise {
    public static void main(String[] args) {
        AccountRepository repo = new AccountRepository();
        repo.save(new Account("SB-1001", 5000));
        repo.save(new Account("SB-2002", 1200));
        TransferService service = new TransferService(repo, new AuditService());

        run(service, "SB-1001", "SB-2002", 1500);   // success
        run(service, "SB-2002", "SB-1001", 9000);   // insufficient funds (checked)
        run(service, "SB-1001", "SB-9999", 100);    // unknown account (unchecked)
        run(service, "SB-1001", "SB-2002", 13);     // audit failure -> wrapped, rolled back
        run(service, "SB-1001", "SB-2002", -50);    // validation

        repo.findById("SB-1001").ifPresent(a -> System.out.printf("Final SB-1001: %.2f%n", a.balance()));
        repo.findById("SB-2002").ifPresent(a -> System.out.printf("Final SB-2002: %.2f%n", a.balance()));
    }

    static void run(TransferService service, String from, String to, double amount) {
        System.out.printf("Transfer %.2f from %s to %s%n", amount, from, to);
        try {
            service.transfer(from, to, amount);
            System.out.println("  OK");
        } catch (InsufficientFundsException e) {
            System.out.println("  DECLINED " + e.code() + ": " + e.getMessage());
        } catch (BankingException e) {
            System.out.println("  FAILED " + e.code() + ": " + e.getMessage()
                + " | cause: " + e.getCause().getMessage());
        } catch (AccountNotFoundException | IllegalArgumentException e) {
            System.out.println("  REJECTED: " + e.getMessage());
        }
    }
}

/* Output:
Transfer 1500.00 from SB-1001 to SB-2002
  [log flushed: 4 entries] [BEGIN SB-1001 -> SB-2002 : 1500.0, DEBIT SB-1001, CREDIT SB-2002, COMMIT]
  OK
Transfer 9000.00 from SB-2002 to SB-1001
  [log flushed: 2 entries] [BEGIN SB-2002 -> SB-1001 : 9000.0, ABORT insufficient funds]
  DECLINED BANK-001: Account SB-2002 has 2700.00, cannot transfer 9000.00
Transfer 100.00 from SB-1001 to SB-9999
  REJECTED: No account with id SB-9999
Transfer 13.00 from SB-1001 to SB-2002
  [log flushed: 3 entries] [BEGIN SB-1001 -> SB-2002 : 13.0, DEBIT SB-1001, ROLLBACK SB-1001]
  FAILED BANK-500: Transfer could not be audited | cause: audit service unreachable (timeout 5000 ms)
Transfer -50.00 from SB-1001 to SB-2002
  REJECTED: amount must be positive: -50.0
Final SB-1001: 3500.00
Final SB-2002: 2700.00
*/`
    },
    {
      heading: "18. Summary",
      content: `• Every exception is an object under \`Throwable\`: \`Error\` for JVM-level failures you should not catch, \`Exception\` for application failures, and \`RuntimeException\` for programming bugs.
• **Checked** exceptions (non-\`RuntimeException\` subclasses of \`Exception\`) must be caught or declared with \`throws\`; **unchecked** ones need not be. Use checked for recoverable external conditions, unchecked for bugs and most framework code.
• \`try\` / \`catch\` / \`finally\`: catch specific types first; \`finally\` always runs; never \`return\` from \`finally\`.
• **Multi-catch** (Java 7) handles unrelated types in one block; alternatives cannot be subclass-related; Java 22 allows \`catch (Type _)\` for unused parameters.
• **try-with-resources** (Java 7, Java 9 for effectively final variables) closes \`AutoCloseable\` resources in reverse order and attaches \`close()\` failures as **suppressed** exceptions.
• \`throw\` raises; \`throws\` declares. Overriding methods may narrow but never broaden checked exceptions.
• **Custom exceptions** extend \`Exception\` or \`RuntimeException\`, provide message-and-cause constructors, and carry structured fields like error codes.
• **Chain** exceptions with the cause constructor so the root cause survives every layer; use \`UncheckedIOException\` to escape checked exceptions inside lambdas.
• **Helpful NPE messages** (JEP 358, Java 14, default since Java 15) tell you exactly which expression was null; compile with \`-g\` for local-variable names.
• **\`Optional\`** (Java 8+) makes absence explicit in return types; prefer \`map\`, \`orElseGet\` and \`orElseThrow\` over \`get()\`, and never use it for fields, parameters or collections.
• Production rules: catch only what you can handle, never swallow, log once at the top, preserve causes, use exceptions for exceptional cases only, and map exceptions to HTTP responses in one \`@RestControllerAdvice\`.
**Next lecture:** Collections Framework & Generics`
    }
  ]
};
