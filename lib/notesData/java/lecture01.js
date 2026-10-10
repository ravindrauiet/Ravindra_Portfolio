export const lecture01 = {
  slug: "lecture-1",
  number: 1,
  title: "Complete Java Course — Lecture 1: Introduction to Java, JDK, JVM & Your First Program",
  summary: "Learn what Java is, how write-once-run-anywhere works, the difference between JDK, JRE and JVM, bytecode, JIT compilation and garbage collection. Install a JDK, set JAVA_HOME, write your first Hello World with javac and java, use jshell, and try Java 25 compact source files.",
  readTime: "65 min read",
  difficulty: "Beginner",
  date: "2026-10-09",
  sections: [
    {
      heading: "1. What Is Java, Where It Is Used, and Why Learn It in 2026",
      content: `**Java** is a general-purpose, object-oriented, strongly typed programming language created by James Gosling at Sun Microsystems and released in 1995. Oracle acquired Sun in 2010 and now leads Java's development through the open-source **OpenJDK** project, with contributions from Red Hat, Amazon, Microsoft, SAP, Google and many others. Java source code is compiled into an intermediate form called **bytecode**, which runs on the **Java Virtual Machine (JVM)**. That one design decision is the reason Java programs run unchanged on Windows, Linux and macOS.
Why does a 30-year-old language still matter? Because an enormous share of the world's serious software runs on it:
• **Enterprise backends and banking** — core banking systems, payment gateways, insurance platforms and most large systems built by Indian IT services companies (TCS, Infosys, Wipro, HCL) are Java and Spring Boot.
• **Internet-scale companies** — Netflix, LinkedIn, Amazon, Uber, Flipkart and Paytm run large parts of their backends on Java.
• **Big data and infrastructure** — Apache Hadoop, Kafka, Elasticsearch, Cassandra and Spark's core are written in Java or other JVM languages.
• **Android** — the Android SDK is Java-based; Kotlin is now preferred for new apps, but Kotlin itself compiles to JVM bytecode and interoperates with Java.
• **Desktop and games** — Minecraft Java Edition, IntelliJ IDEA and many trading terminals are Java applications.
• **Government and public sector** — large tax, railway and identity systems in India and abroad are built on Java EE / Jakarta EE stacks.
For a student or working developer in India, Java is one of the safest career investments: the hiring demand for **Java + Spring Boot + microservices** is consistently among the highest on Naukri and LinkedIn, and Java is a standard interview language at product companies and service companies alike. The language is also the foundation for Kotlin, Scala, Groovy and Clojure, so learning the JVM pays off beyond Java itself.
This course takes you from your very first program to Spring Boot, JPA, testing with JUnit 5 and Mockito, and interview preparation. This lecture builds the foundation: how Java runs, how to install it, and how to write and execute a program three different ways.`
    },
    {
      heading: "2. Write Once, Run Anywhere: How Java Achieves Platform Independence",
      content: `The slogan **"Write Once, Run Anywhere" (WORA)** describes Java's biggest architectural idea. In languages like C or C++, the compiler produces machine code for one specific CPU and operating system. A Windows x86 binary will not run on a Linux ARM server; you must recompile for every platform and deal with platform-specific differences in your code.
Java splits the process into two stages:
1. The **Java compiler (\`javac\`)** converts your \`.java\` source file into a \`.class\` file containing **bytecode** — a compact, platform-neutral instruction set designed for a virtual CPU.
2. The **Java Virtual Machine (\`java\`)** installed on the target machine loads that bytecode and executes it, translating it into real machine instructions for whatever CPU and OS it is running on.
Because the bytecode format is standardized, the same \`Hello.class\` file compiled on your Windows laptop in Pune runs without modification on a Linux server in a Mumbai data centre or a MacBook. The platform-specific work is done once, by the people who build the JVM for each platform, not by every application developer.
WORA also covers more than the CPU: the Java standard library hides OS differences in file paths, threads, networking, time zones and character encodings behind one consistent API. That is why a Spring Boot application developed on Windows is routinely deployed inside a Linux Docker container with zero code changes.
**Where WORA has limits:** GUI look-and-feel differs slightly across operating systems, native libraries accessed through JNI or the Foreign Function & Memory API (final in Java 22) are platform-specific, and file-system behaviour (case sensitivity, path separators) can still surprise you if you hard-code \`C:\\\` style paths. The rule of thumb: stay inside the standard library and your code stays portable.`,
      codeSnippet: `// The same bytecode runs on every platform that has a JVM.
//
//   Hello.java  --javac-->  Hello.class (bytecode)
//
//   Hello.class --java (Windows JVM)--> runs on Windows
//   Hello.class --java (Linux JVM)  --> runs on Linux
//   Hello.class --java (macOS JVM)  --> runs on macOS
//
// Inspect the bytecode yourself with the javap disassembler:
//   javap -c Hello
//
// Sample (abridged) output for System.out.println("Hello"):
//   0: getstatic     #7   // Field java/lang/System.out
//   3: ldc           #13  // String Hello
//   5: invokevirtual #15  // Method java/io/PrintStream.println
//   8: return`
    },
    {
      heading: "3. JDK vs JRE vs JVM: The Difference Explained",
      content: `These three acronyms are asked in almost every fresher interview, and beginners mix them up constantly. Think of them as three nested boxes.
**JVM (Java Virtual Machine)** is the engine that runs bytecode. It is a specification (a document describing how bytecode must behave) plus concrete implementations. The most common implementation is **HotSpot**, which ships with OpenJDK builds from Oracle, Eclipse Temurin, Amazon Corretto and others. The JVM is responsible for loading classes, verifying bytecode for safety, interpreting or JIT-compiling it, managing memory and running garbage collection. The JVM alone cannot run a program; it needs the class library.
**JRE (Java Runtime Environment)** = JVM + the Java standard class library (\`java.lang\`, \`java.util\`, \`java.io\`, \`java.net\` and so on) + supporting files. A JRE is enough to **run** Java applications but cannot compile them because it has no \`javac\`. Important: since Java 11, Oracle and most vendors **no longer ship a separate JRE download**. Instead you install a full JDK, and if you need a slim runtime for deployment you create one with the \`jlink\` tool (Java 9+) containing only the modules your app uses.
**JDK (Java Development Kit)** = JRE + development tools: \`javac\` (compiler), \`java\` (launcher), \`jshell\` (REPL), \`javadoc\` (documentation generator), \`jar\` (packaging), \`javap\` (disassembler), \`jdb\` (debugger), \`jlink\`, \`jpackage\`, and diagnostic tools such as \`jcmd\`, \`jstack\` and \`jconsole\`. As a developer you always install a JDK.
A one-line way to remember it: **JDK is for developing, JRE is for running, JVM is what actually runs it.**
When a recruiter asks "Is the JVM platform independent?", the correct answer is **no** — the JVM is platform *specific* (there is a different JVM build for Windows, Linux and macOS). It is the **bytecode** that is platform independent, and that is exactly what makes Java programs portable.`,
      codeSnippet: `// Check what is installed on your machine (run in a terminal)
//
//   java -version      -> prints the runtime (JVM + class library) version
//   javac -version     -> prints the compiler version (exists only in a JDK)
//   jshell -version    -> REPL (Java 9+)
//
// Typical output on a machine with Eclipse Temurin 25:
//
//   openjdk version "25.0.1" 2025-10-21 LTS
//   OpenJDK Runtime Environment Temurin-25.0.1+8 (build 25.0.1+8-LTS)
//   OpenJDK 64-Bit Server VM Temurin-25.0.1+8 (build 25.0.1+8-LTS, mixed mode, sharing)
//
// "Server VM"  = HotSpot JVM tuned for long-running applications
// "mixed mode" = interpreter + JIT compiler both active
// "sharing"    = Class Data Sharing archive in use (faster startup)`
    },
    {
      heading: "4. Bytecode and the JIT Compiler: How Java Code Actually Runs",
      content: `Beginners often hear "Java is interpreted, so it is slow" or "Java is compiled, so it is fast". The truth is more interesting: Java is **both**, in stages, and that is why modern Java performance is close to C++ for long-running server workloads.
**Step 1 — Compilation to bytecode.** \`javac\` performs syntax checking, type checking and produces \`.class\` files. Bytecode is a stack-based instruction set with around 200 opcodes (\`iload\`, \`iadd\`, \`invokevirtual\`, \`return\` ...). It is not machine code and no CPU executes it directly.
**Step 2 — Class loading and verification.** When you run \`java Hello\`, the JVM's class loader reads \`Hello.class\`, and the bytecode verifier checks it is well-formed and type-safe (no stack overflows, no illegal casts, no access to private fields). This is part of why Java is considered a secure runtime.
**Step 3 — Interpretation.** The JVM starts by **interpreting** bytecode instruction by instruction. Interpretation starts instantly but is relatively slow.
**Step 4 — Just-In-Time (JIT) compilation.** HotSpot counts how often each method and loop runs. Code that becomes "hot" is compiled to native machine code at runtime by the JIT compiler and cached, so later calls run at native speed. HotSpot uses **tiered compilation** (default since Java 8): the fast **C1** compiler produces quickly-optimised code first, and the slower but smarter **C2** compiler re-compiles the hottest methods with aggressive optimisations such as method inlining, loop unrolling, escape analysis and dead-code elimination. Because the JIT sees real runtime behaviour (which branch is actually taken, which subclass is actually used), it can sometimes optimise better than a static C++ compiler.
This is why a Java server that feels slightly slow in the first few seconds gets faster as it "warms up" — a key concept in performance tuning and benchmarking (always warm up before measuring).
**Alternative: ahead-of-time compilation.** GraalVM Native Image compiles a Java application to a native executable before deployment, trading peak throughput for millisecond startup and lower memory — popular for serverless functions and CLI tools. Spring Boot 3+ supports it officially. We will revisit this when we study deployment.`,
      codeSnippet: `// WarmUp.java — watch the JIT kick in
// Run with:  java -XX:+PrintCompilation WarmUp
// The JVM prints a line each time it compiles a method to native code.

public class WarmUp {

    static long sumOfSquares(int n) {
        long total = 0;
        for (int i = 1; i <= n; i++) {
            total += (long) i * i;
        }
        return total;
    }

    public static void main(String[] args) {
        long start = System.nanoTime();
        long result = 0;
        for (int round = 0; round < 20_000; round++) {
            result += sumOfSquares(1_000);   // becomes "hot" -> JIT compiles it
        }
        long elapsedMs = (System.nanoTime() - start) / 1_000_000;
        System.out.println("Result: " + result);
        System.out.println("Elapsed: " + elapsedMs + " ms");
    }
}

// Try:  java -Xint WarmUp   (interpreter only, no JIT)
// You will see the pure-interpreter run is many times slower.`
    },
    {
      heading: "5. Garbage Collection in Java: An Overview",
      content: `In C and C++ you allocate memory with \`malloc\`/\`new\` and must release it yourself with \`free\`/\`delete\`. Forget to release it and you get a **memory leak**; release it twice or use it after release and you get crashes and security holes. Java removes this entire class of bugs with **automatic garbage collection (GC)**.
Here is the model in brief. Every object you create with \`new\` lives on the **heap**, a region of memory managed by the JVM. Local variables and method call frames live on each thread's **stack**. The garbage collector periodically finds objects that are no longer **reachable** — not referenced from any live stack variable, static field or other reachable object — and reclaims their memory. You never call \`free\`; you simply stop referencing an object.
Modern collectors are **generational**: they observe that most objects die young (a request object, a temporary string) while a few live long (caches, configuration). The heap is split into a **young generation** (collected often and cheaply) and an **old generation** (collected rarely). Objects that survive several young collections are promoted to the old generation.
HotSpot ships several collectors, each with a different trade-off between throughput, pause time and memory:
• **G1 (Garbage-First)** — the default since Java 9 for most machines; balances throughput and pause times, good for heaps from a few hundred MB to tens of GB.
• **Serial GC** — single-threaded; the JVM picks it automatically on small containers with limited CPUs and memory. Ideal for tiny microservices.
• **Parallel GC** — maximises throughput, accepts longer pauses; common for batch jobs.
• **ZGC** and **Shenandoah** — ultra-low-pause collectors (sub-millisecond pauses even on very large heaps). ZGC became generational by default in Java 23.
You choose a collector with a JVM flag such as \`-XX:+UseZGC\`, and size the heap with \`-Xms\` (initial) and \`-Xmx\` (maximum). For now the key takeaway is: **you do not free memory in Java, but you can still leak it** by keeping references alive accidentally (for example, adding objects to a static list forever). We will cover memory management, \`finalize\` deprecation and Cleaner objects in a dedicated lecture.`,
      codeSnippet: `// MemoryDemo.java — observing the heap and garbage collection
public class MemoryDemo {

    public static void main(String[] args) {
        Runtime rt = Runtime.getRuntime();
        long mb = 1024 * 1024;

        System.out.println("Max heap     : " + rt.maxMemory() / mb + " MB");
        System.out.println("Used before  : " + (rt.totalMemory() - rt.freeMemory()) / mb + " MB");

        // Create a lot of short-lived garbage
        for (int i = 0; i < 2_000_000; i++) {
            String temp = "order-" + i;      // becomes unreachable immediately
        }

        System.out.println("Used after   : " + (rt.totalMemory() - rt.freeMemory()) / mb + " MB");

        System.gc();   // a HINT to the JVM, never a guarantee; avoid in production code
        System.out.println("After GC hint: " + (rt.totalMemory() - rt.freeMemory()) / mb + " MB");
    }
}

// Run with GC logging to watch collections happen:
//   java -Xlog:gc MemoryDemo
// Sample log line:
//   [0.085s][info][gc] GC(0) Pause Young (Normal) (G1 Evacuation Pause) 24M->2M(256M) 1.9ms`
    },
    {
      heading: "6. Java Release Cadence and LTS Versions (8, 11, 17, 21, 25)",
      content: `Until 2017 a new Java version arrived every three to five years, each one a giant release. Since Java 9 (September 2017) Oracle moved to a **time-based cadence**: a new feature release ships **every six months**, in March and September, no matter which features are ready. Features that need more feedback ship as **preview features** (you must pass \`--enable-preview\` to use them, and they can change) and become **final** in a later release. This course always tells you whether a feature is preview or final and in which version.
Because upgrading every six months is unrealistic for enterprises, certain releases are designated **Long-Term Support (LTS)** and receive security and bug-fix updates for many years:
• **Java 8** (March 2014) — the release that introduced lambdas and streams; still running in many legacy Indian banking and government systems. End of free public updates from Oracle was long ago, though other vendors still patch it.
• **Java 11** (September 2018) — first LTS of the new cadence; removed the separate JRE, added \`var\`, the HTTP client and single-file source launch.
• **Java 17** (September 2021) — sealed classes, records, pattern matching for \`instanceof\`, text blocks. Spring Boot 3 requires Java 17 or newer.
• **Java 21** (September 2023) — virtual threads, record patterns, pattern matching for \`switch\`, sequenced collections. The most widely deployed modern LTS today.
• **Java 25** (September 2025) — the **current LTS**: compact source files and instance main methods, module import declarations, flexible constructor bodies, scoped values and more. New projects should target Java 25 or 21.
Since Java 17, Oracle designates an LTS **every two years**, so the next LTS is expected to be Java 29 in September 2027. Non-LTS versions (22, 23, 24, 26...) are supported only until the next release six months later. In practice, production systems run LTS versions, and job descriptions will say "Java 17/21".
Which version should you learn? **Learn on Java 25**, but know what exists in 17 and 21 because that is what most companies run. This course flags the version for every modern feature so you can use it correctly in interviews ("records were finalised in Java 16", "virtual threads were finalised in Java 21").`,
      codeSnippet: `// Preview vs final: how a feature matures across releases
//
// Feature: "Compact Source Files and Instance Main Methods"
//   Java 21  -> preview  (JEP 445)   needs: javac --enable-preview --release 21
//   Java 22  -> preview  (JEP 463)
//   Java 23  -> preview  (JEP 477)
//   Java 24  -> preview  (JEP 495)
//   Java 25  -> FINAL    (JEP 512)   no flag required
//
// Feature: "Virtual Threads"
//   Java 19, 20 -> preview
//   Java 21     -> FINAL (JEP 444)
//
// Feature: "Records"
//   Java 14, 15 -> preview
//   Java 16     -> FINAL (JEP 395)
//
// Rule: in production code, use only FINAL features of the LTS you deploy on.`
    },
    {
      heading: "7. Installing a JDK (Eclipse Temurin or Oracle JDK) and Setting JAVA_HOME",
      content: `There is one Java specification but many **JDK distributions**, all built from the same OpenJDK source and all passing the same compatibility test kit (TCK). The two you will meet most often:
• **Eclipse Temurin** (from the Adoptium project) — free, open source, production-ready, no licence headaches, long-term updates for LTS versions. This is the safest default and what most Docker images use (\`eclipse-temurin:25-jdk\`).
• **Oracle JDK** — Oracle's own build. Since Java 17 it is free for production under the "No-Fee Terms and Conditions", but free updates for an LTS stop about a year after the next LTS ships; after that you need a paid subscription for Oracle's patches. Perfectly fine for learning.
Other good options: Amazon Corretto (used on AWS), Microsoft Build of OpenJDK, Azul Zulu, Red Hat build of OpenJDK, and GraalVM (adds native-image support).
**Installation steps (Windows):**
1. Download the Temurin 25 LTS \`.msi\` installer for Windows x64 from adoptium.net.
2. In the installer, enable the options **"Add to PATH"** and **"Set JAVA_HOME variable"** — the installer then does the next step for you.
3. Open a new Command Prompt or PowerShell and run \`java -version\` and \`javac -version\`.
**macOS:** download the \`.pkg\` from adoptium.net, or use Homebrew: \`brew install --cask temurin@25\`. **Linux (Ubuntu/Debian):** add the Adoptium apt repository and run \`sudo apt install temurin-25-jdk\`, or use **SDKMAN** (\`sdk install java 25-tem\`), which also lets you switch between multiple JDKs — very handy when one project needs 17 and another 25.
**What is JAVA_HOME and why set it?** \`JAVA_HOME\` is an environment variable that points to the JDK installation folder (the one containing \`bin\`, \`lib\` and \`conf\`). Build tools such as Maven and Gradle, application servers like Tomcat, and IDEs read it to find the JDK. \`PATH\` must additionally include \`%JAVA_HOME%\\bin\` (Windows) or \`$JAVA_HOME/bin\` (macOS/Linux) so the terminal can find \`java\` and \`javac\`. The two most common installation problems are exactly these: \`JAVA_HOME\` pointing to a JRE-only folder (so Maven cannot find \`javac\`) and a stale \`PATH\` entry from an old Java 8 install that shadows the new one.`,
      codeSnippet: `# ---------- Windows (PowerShell, run as the normal user) ----------
# Set JAVA_HOME permanently for your user account
setx JAVA_HOME "C:\\Program Files\\Eclipse Adoptium\\jdk-25.0.1.8-hotspot"
# Add the bin folder to PATH (only if the installer did not do it)
setx PATH "%PATH%;%JAVA_HOME%\\bin"
# Close and reopen the terminal, then verify:
java -version
javac -version
echo %JAVA_HOME%

# ---------- macOS / Linux (add to ~/.zshrc or ~/.bashrc) ----------
export JAVA_HOME=$(/usr/libexec/java_home -v 25)      # macOS
# export JAVA_HOME=/usr/lib/jvm/temurin-25-jdk-amd64  # Linux
export PATH="$JAVA_HOME/bin:$PATH"

# Reload the shell config and verify
source ~/.zshrc
java -version
echo $JAVA_HOME

# ---------- SDKMAN (macOS/Linux/WSL) — manage many JDKs ----------
curl -s "https://get.sdkman.io" | bash
sdk list java                 # shows available vendors and versions
sdk install java 25-tem       # Temurin 25
sdk use java 25-tem           # switch for the current shell`
    },
    {
      heading: "8. Choosing an IDE: IntelliJ IDEA vs VS Code for Java",
      content: `You can write Java in Notepad and compile from the terminal — and in this lecture you will, because understanding \`javac\` and \`java\` is essential. For real projects, though, an IDE multiplies your productivity with code completion, instant error highlighting, refactoring, debugging and test running.
**IntelliJ IDEA** (JetBrains) is the industry standard for Java. The **Community Edition is free** and includes everything a learner needs: a superb editor, Maven and Gradle integration, a visual debugger, JUnit integration and Git support. The paid Ultimate edition adds Spring Boot tooling, database tools and JavaScript support; students can get it free with a college email through the JetBrains student programme. Most Indian product companies and startups use IntelliJ, and interviewers often watch you work in it during live coding rounds, so learn its shortcuts: \`psvm\` + Tab expands to a main method, \`sout\` + Tab to \`System.out.println()\`, \`Ctrl+Alt+L\` formats code, \`Shift+F10\` runs the program.
**Visual Studio Code** with the **Extension Pack for Java** (published by Microsoft; it bundles Red Hat's language server, a debugger, a test runner, Maven support and a project manager) is lighter, starts faster and is great if you already use VS Code for JavaScript or Python. It is fully capable for this course and for Spring Boot work with the additional Spring Boot Extension Pack. The trade-off is slightly weaker refactoring and inspections compared to IntelliJ.
**Eclipse** is still common in older enterprise teams and some colleges; it is free and powerful but has a steeper learning curve. **NetBeans** (Apache) is simpler and ships with good Maven support.
Our recommendation: install **IntelliJ IDEA Community** as your main IDE, and keep a terminal open so you always understand what the IDE is doing on your behalf. When the IDE shows a red underline, hover over it — the error message is the same one \`javac\` would print.
Whatever IDE you choose, point it to the JDK you installed in the previous section (IntelliJ: File → Project Structure → SDK; VS Code: the \`java.configuration.runtimes\` setting or simply \`JAVA_HOME\`).`,
      codeSnippet: `// Creating your first project in IntelliJ IDEA Community (step by step)
//
// 1. File -> New -> Project
// 2. Name: hello-java   |  Language: Java  |  Build system: IntelliJ (or Maven)
// 3. JDK: select "25" (Temurin). If it is not listed, choose
//    "Add JDK..." and browse to your JAVA_HOME folder.
// 4. Tick "Add sample code" -> IntelliJ generates src/Main.java
// 5. Press Shift+F10 (Run). Output appears in the Run tool window.
//
// Useful live templates (type the abbreviation, then press Tab):
//    psvm  ->  public static void main(String[] args) { }
//    sout  ->  System.out.println();
//    fori  ->  for (int i = 0; i < ; i++) { }
//
// VS Code: install "Extension Pack for Java", open a folder,
// create Hello.java, and click the "Run" link that appears above main.`
    },
    {
      heading: "9. Your First Java Program: Hello World with javac and java, and the Anatomy of main",
      content: `Create a folder, say \`C:\\java-course\\lecture01\`, and inside it a file named **\`Hello.java\`** — the file name must exactly match the public class name, including capitalisation. Type the program from the snippet, then open a terminal in that folder.
**Compile:** \`javac Hello.java\` — if successful, it prints nothing and creates \`Hello.class\` in the same folder. If there is an error, \`javac\` prints the file name, line number and a message; fix it and compile again.
**Run:** \`java Hello\` — note there is **no \`.class\` extension**. You give the launcher the *class name*, and it looks for \`Hello.class\` on the **classpath** (by default the current directory). You should see \`Hello, World!\` on the screen.
Now let's dissect every token, because interviewers love asking what each one means:
• **\`public class Hello\`** — declares a class named \`Hello\`. In Java every line of code lives inside a class. \`public\` means it is visible to every other class; a public class must be in a file called \`Hello.java\`.
• **\`public static void main(String[] args)\`** — the **entry point**. The JVM looks for a method with exactly this shape when you run \`java Hello\`.
  – \`public\`: the JVM, which is outside your class, must be able to call it.
  – \`static\`: the JVM calls it **without creating an object** of \`Hello\` first — there is nothing to create it with yet.
  – \`void\`: it returns nothing to the JVM. To signal failure to the operating system you call \`System.exit(1)\` instead.
  – \`main\`: the fixed name the launcher looks for.
  – \`String[] args\`: command-line arguments. \`java Hello Ravindra Delhi\` gives \`args[0] = "Ravindra"\`, \`args[1] = "Delhi"\`. The parameter name can be anything; \`String... args\` (varargs) is also accepted.
• **\`System.out.println("Hello, World!");\`** — \`System\` is a class in \`java.lang\` (imported automatically), \`out\` is its static field of type \`PrintStream\` connected to standard output, and \`println\` prints the text followed by a newline. Every statement ends with a semicolon.
• **Braces \`{ }\`** group the class body and the method body. Indentation is for humans; Java ignores whitespace.
The order of modifiers \`static public void main\` is legal but unconventional; \`final\` and \`synchronized\` are allowed too. What is **not** allowed: a non-void return type, or a different parameter type — the launcher will reject it with "Main method not found".`,
      codeSnippet: `// Hello.java  — the file name MUST be Hello.java
public class Hello {

    // Entry point: the JVM calls this method first.
    public static void main(String[] args) {
        System.out.println("Hello, World!");

        // Command-line arguments
        if (args.length > 0) {
            System.out.println("Namaste, " + args[0] + "!");
        }

        // Escape sequences: \n = newline, \t = tab, \" = quote
        System.out.println("Line 1\\nLine 2\\tTabbed \\"quoted\\"");

        // Arithmetic and string concatenation
        int price = 499;
        int qty = 3;
        System.out.println("Total: Rs. " + (price * qty));
    }
}

/* Terminal session:
   > javac Hello.java
   > java Hello Priya
   Hello, World!
   Namaste, Priya!
   Line 1
   Line 2   Tabbed "quoted"
   Total: Rs. 1497
*/`
    },
    {
      heading: "10. Running Single-File Source Programs Directly (java Hello.java) and Multi-File Launch",
      content: `Typing \`javac\` and then \`java\` every time is tedious for small experiments. Since **Java 11 (JEP 330)**, the \`java\` launcher can compile and run a source file in one step: \`java Hello.java\`. The launcher compiles the file **in memory** — no \`.class\` file is written to disk — and immediately runs the **first top-level class** declared in the file. This is called **source-file mode**.
Points to remember about source-file mode:
• You pass the **file name with the \`.java\` extension**. \`java Hello\` (no extension) is class mode and expects a compiled \`Hello.class\`.
• Arguments after the file name go to \`main\`: \`java Hello.java Priya\`.
• The file may contain several classes; the first one is launched and may use the others.
• The class name does not have to match the file name in source-file mode, though keeping them equal is still good practice.
• Compile-time errors are reported just like \`javac\` would, and the program does not run.
• On Linux/macOS you can create executable Java "scripts" with a shebang line \`#!/usr/bin/env -S java --source 25\` on the first line, make the file executable, and run it like a shell script. The \`--source\` option is required when the file does not end in \`.java\`.
**Multi-file programs (Java 22, JEP 458):** source-file mode originally handled only one file. Since Java 22, when the launched file references classes in other \`.java\` files in the same directory tree (following the package-to-folder convention), the launcher compiles those files on demand too. So \`java Main.java\` works even when \`Main\` uses \`Helper\` from \`Helper.java\`. This is ideal for small utilities and teaching, but it does **not** handle third-party library dependencies — for anything with dependencies you will use Maven or Gradle, which we cover later in the course.
Use source-file mode for quick tests, scripts and interview practice. Use \`javac\` + \`java\` (or a build tool) when you need \`.class\` files to package into a JAR for deployment.`,
      codeSnippet: `// Greeter.java — run with:  java Greeter.java Rahul Bengaluru
// (Java 11+; no javac step, no .class file created)

public class Greeter {
    public static void main(String[] args) {
        String name = args.length > 0 ? args[0] : "friend";
        String city = args.length > 1 ? args[1] : "your city";
        System.out.println(Message.build(name, city));
    }
}

// A second class in the same file is fine; only the first is launched.
class Message {
    static String build(String name, String city) {
        return "Hello " + name + " from " + city + "! Welcome to Java 25.";
    }
}

/* Output:
   Hello Rahul from Bengaluru! Welcome to Java 25.

   Java 22+ multi-file launch: if Message lived in its own Message.java
   next to Greeter.java, "java Greeter.java" would still work (JEP 458).

   Shebang script on Linux/macOS (file named "greet", no extension):
     #!/usr/bin/env -S java --source 25
     ...same code...
   then:  chmod +x greet && ./greet Rahul Pune
*/`
    },
    {
      heading: "11. jshell: The Java REPL for Instant Experiments",
      content: `Python and JavaScript developers are used to typing an expression and seeing its value immediately. Java gained the same ability in **Java 9** with **jshell**, a **REPL (Read-Eval-Print Loop)** shipped in every JDK. Type \`jshell\` in a terminal and you get a prompt where you can enter expressions, statements, variables, methods and even classes without writing a \`main\` method, a class or a semicolon (semicolons are optional for single expressions).
jshell is perfect for:
• Checking how an API behaves — "what does \`"Hyderabad".substring(2, 5)\` return?" — before writing it in a real file.
• Learning operators, type conversions and String methods while reading this course.
• Trying a regular expression or a date-time calculation quickly.
• Interview preparation: verify an answer in seconds instead of creating a project.
Useful commands (all start with a forward slash): \`/vars\` lists variables, \`/methods\` lists methods you defined, \`/list\` shows all snippets entered so far, \`/imports\` shows active imports (\`java.util.*\`, \`java.io.*\` and several others are pre-imported), \`/edit\` opens an editor, \`/save file.jsh\` and \`/open file.jsh\` persist a session, \`/reset\` clears everything, \`/help\` lists commands and \`/exit\` quits. Press **Tab** for auto-completion, and after a method name press **Shift+Tab then I** to import its class.
Values that you do not assign are stored in automatic variables named \`$1\`, \`$2\` and so on, which you can reuse. Exceptions are printed with a stack trace, but the session keeps running, so you can learn from mistakes without restarting.
One limitation: jshell is for experiments, not for programs. There is no \`main\`, you cannot easily add external JARs without \`--class-path\`, and nothing is saved unless you ask. Once a snippet works, move it into a real \`.java\` file.`,
      codeSnippet: `// A jshell session (type "jshell" in your terminal to start)
//
// jshell> int price = 1250
// price ==> 1250
//
// jshell> price * 18 / 100
// $2 ==> 225                      <- GST amount, stored in $2
//
// jshell> String city = "Hyderabad"
// city ==> "Hyderabad"
//
// jshell> city.toUpperCase().substring(0, 3)
// $4 ==> "HYD"
//
// jshell> int square(int n) { return n * n; }
// |  created method square(int)
//
// jshell> square(12)
// $6 ==> 144
//
// jshell> java.time.LocalDate.now().getDayOfWeek()
// $7 ==> THURSDAY
//
// jshell> /vars
// |    int price = 1250
// |    int $2 = 225
// |    String city = "Hyderabad"
// |    String $4 = "HYD"
// |    int $6 = 144
//
// jshell> 10 / 0
// |  Exception java.lang.ArithmeticException: / by zero
// |        at (#8:1)                       <- session keeps running
//
// jshell> /exit
// |  Goodbye`
    },
    {
      heading: "12. Compact Source Files and Instance Main Methods (Final in Java 25)",
      content: `For 30 years the first Java program every student wrote contained \`public static void main(String[] args)\` — seven concepts (access modifiers, static, return types, arrays, parameters) before printing a single word. **Java 25** finally fixes this on-ramp with **JEP 512: Compact Source Files and Instance Main Methods**, a **final (non-preview) feature**. It was previewed in Java 21 (JEP 445, under the name "Unnamed Classes and Instance Main Methods"), Java 22 (JEP 463), Java 23 (JEP 477) and Java 24 (JEP 495); on those versions you need \`--enable-preview\`, on Java 25 you need nothing.
Three things changed:
**1. Instance main methods.** \`main\` no longer has to be \`public\`, \`static\`, or take \`String[] args\`. If the launched class has no classic \`public static void main(String[])\`, the launcher looks for alternatives in this order: \`static void main(String[])\`, \`static void main()\`, instance \`void main(String[])\`, instance \`void main()\`. For an instance method, the launcher creates an object using the class's no-argument constructor and calls \`main\` on it. The method must not be \`private\`.
**2. Compact source files.** A source file can contain methods and fields **without any class declaration**. The compiler wraps them in an **implicitly declared class** named after the file (for \`Hello.java\`, the class is \`Hello\`). This class is final, lives in the unnamed package, cannot be referenced by name from other files, and must declare a launchable \`main\`. Other classes in the file are allowed and the implicit class can use them. Compact source files also implicitly import the whole \`java.base\` module (via Module Import Declarations, JEP 511, also final in Java 25), so \`List\`, \`Map\`, \`LocalDate\` and \`Scanner\` work without import statements.
**3. The \`java.lang.IO\` class.** A small console utility with static methods \`IO.println(Object)\`, \`IO.println()\`, \`IO.print(Object)\`, \`IO.readln()\` and \`IO.readln(String prompt)\`. Because it is in \`java.lang\` it needs no import, but in the final Java 25 version its methods are **not** statically imported — you write \`IO.println("Hi")\` (or add \`import static java.lang.IO.*;\`). In the Java 24 preview they were implicitly imported; that changed in the final version, so update any tutorials you find online.
Compact source files are meant for scripts, learning and small utilities. When a program grows, you add a class declaration and a package, and everything else stays the same — the migration is just wrapping the code in \`public class Name { ... }\`. In production codebases built with Maven or Gradle you will still see the classic form, and in interviews you should be able to write and explain both.`,
      codeSnippet: `// Hello.java — Java 25 compact source file (JEP 512, final)
// Run with:  java Hello.java
// No class declaration, no "public static", no imports needed.

void main() {
    IO.println("Hello from Java 25!");

    String name = IO.readln("What is your name? ");
    IO.println("Welcome, " + name + "!");

    // java.base is auto-imported in compact source files (JEP 511)
    List<String> cities = List.of("Mumbai", "Delhi", "Bengaluru");
    IO.println("Cities: " + cities);
    IO.println("Today: " + LocalDate.now());
}

// A helper method in the same implicit class
int add(int a, int b) {
    return a + b;
}

/* ---- Same idea inside an ordinary class (also Java 25) ----
   public class Calculator {
       void main() {                   // instance main, no static, no args
           System.out.println(add(2, 3));
       }
       int add(int a, int b) { return a + b; }
   }

   ---- On Java 21-24 the feature is PREVIEW; run with: ----
   java --enable-preview --source 24 Hello.java
   (and on 24 and earlier println() was implicitly imported; on 25 use IO.println)
*/`
    },
    {
      heading: "13. How This Is Used in Production: Real-World Use Cases",
      content: `Everything in this lecture maps to decisions you will make on real projects.
**Choosing and pinning a JDK version.** A production Spring Boot service declares its Java version in \`pom.xml\` (\`<maven.compiler.release>21</maven.compiler.release>\`) or \`build.gradle\` (\`toolchain { languageVersion = JavaLanguageVersion.of(21) }\`), and its Dockerfile starts \`FROM eclipse-temurin:21-jre\` or \`21-jdk\`. Teams standardise on an LTS, upgrade every two to four years, and use Temurin or Corretto to avoid licensing issues. Knowing the JDK/JRE/JVM distinction tells you why the runtime image can be the smaller \`-jre\` variant (no compiler needed in production) and why a custom \`jlink\` runtime can shrink an image from 300 MB to under 100 MB.
**Container memory and GC flags.** Microservices in Kubernetes run with flags such as \`-Xmx512m\` or \`-XX:MaxRAMPercentage=75\` and sometimes \`-XX:+UseZGC\` for latency-sensitive APIs. Understanding the heap, generations and collectors (Section 5) is the basis of every memory-related production incident you will debug, from OutOfMemoryError to long GC pauses that trip load-balancer health checks.
**JIT warm-up in performance testing.** Load testers at fintech companies discard the first minute of results because the JIT has not yet compiled the hot paths. If you ever benchmark Java with a single quick loop and conclude "Java is slow", you have been fooled by the interpreter phase. JMH (Java Microbenchmark Harness) exists precisely to handle warm-up correctly.
**Source-file mode for ops scripts.** Many teams now write small operational tools — log parsers, data fixers, migration checks — as single \`.java\` files run with \`java Tool.java\`, replacing fragile shell scripts with type-safe code that any Java developer can read.
**jshell in debugging and code review.** When reviewing a pull request that uses an unfamiliar String or date-time API, developers open jshell to confirm exact behaviour (does \`split\` drop trailing empty strings? what does \`LocalDate.plusMonths\` do on the 31st?). It is faster than writing a throwaway test.
**JAVA_HOME in CI pipelines.** GitHub Actions and Jenkins jobs use \`actions/setup-java\` with \`distribution: temurin\` and \`java-version: 21\`, which does exactly what you did manually: install a JDK and export \`JAVA_HOME\` and \`PATH\` so Maven picks the right compiler.`,
      codeSnippet: `# Dockerfile — a typical two-stage build for a Spring Boot service
# Stage 1: build with a full JDK (needs javac via Maven)
FROM eclipse-temurin:25-jdk AS build
WORKDIR /app
COPY . .
RUN ./mvnw -q -DskipTests package

# Stage 2: run with a smaller JRE-only image (no compiler needed)
FROM eclipse-temurin:25-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Memory and GC flags: let the JVM use 75% of the container's RAM
ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=75 -XX:+UseG1GC"
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

# ---- GitHub Actions snippet: the CI equivalent of setting JAVA_HOME ----
# - uses: actions/setup-java@v4
#   with:
#     distribution: temurin
#     java-version: 25`
    },
    {
      heading: "14. Common Mistakes with Java Setup and Your First Program, and How to Fix Them",
      content: `Almost every beginner hits a few of these in the first week. Learn to recognise the error text.
**1. "'javac' is not recognized as an internal or external command" (Windows) or "javac: command not found" (Linux/macOS).** The JDK's \`bin\` folder is not on \`PATH\`, or you installed a JRE instead of a JDK. Fix: install a JDK, set \`JAVA_HOME\`, add \`%JAVA_HOME%\\bin\` to \`PATH\`, and **open a new terminal** — environment changes do not apply to terminals that were already open.
**2. "Error: Could not find or load main class Hello".** Usually you typed \`java Hello.class\` (wrong — drop the extension), or you are in a different folder from \`Hello.class\`, or the class declares a \`package\` and you ran it from inside the package folder instead of the source root (\`java com.example.Hello\` from the root). Also check for a classpath that no longer includes the current directory.
**3. "class Hello is public, should be declared in a file named Hello.java".** The file name and the public class name differ, often only in case (\`hello.java\` vs \`Hello\`). Rename the file to match exactly.
**4. "Main method not found in class Hello" or "Main method is not static".** The signature is wrong: \`public void main(String[] args)\` without \`static\` fails on Java 24 and below, \`public static int main\` fails everywhere, \`public static void main(String args)\` (missing \`[]\`) fails. On Java 25 an instance \`void main()\` is legal; on older versions it is not — know which version you are on.
**5. Missing semicolon or unbalanced braces: "';' expected" / "reached end of file while parsing".** Every statement ends with \`;\`, every \`{\` needs a \`}\`. Let the IDE auto-format (\`Ctrl+Alt+L\`) so the structure becomes visible.
**6. Case sensitivity: "cannot find symbol: variable system".** Java is case-sensitive: \`System\`, \`String\`, \`println\` must be spelt exactly. \`system.out.println\` or \`System.out.Println\` will not compile.
**7. Saving as Hello.java.txt.** Windows hides known extensions, so Notepad silently appends \`.txt\`. Enable "File name extensions" in Explorer, or save with quotes: \`"Hello.java"\`.
**8. Two Java versions fighting.** \`java -version\` shows 8 while \`javac -version\` shows 25, leading to "class file has wrong version 69.0, should be 52.0". An old Java 8 entry sits earlier on \`PATH\` (often \`C:\\Program Files (x86)\\Common Files\\Oracle\\Java\\javapath\`). Remove or reorder it so both commands report the same version.
**9. Expecting \`System.gc()\` to free memory immediately.** It is only a request; the JVM may ignore it. Never call it in application code to "fix" memory problems — fix the references instead.
**10. Using preview features without the flag.** Copying a Java 24 compact-file example that calls \`println()\` directly fails on Java 25 with "cannot find symbol". Use \`IO.println\` on Java 25, and use \`--enable-preview\` only on the preview versions.`,
      codeSnippet: `// Buggy.java — find all five errors before reading the fixes below
public class buggy {                                  // (1)
    public void main(String args) {                    // (2) (3)
        system.out.println("Hello, World!")            // (4) (5)
    }
}

/* javac output (Java 25):
   Buggy.java:1: error: class buggy is public, should be declared in a file named buggy.java
   Buggy.java:3: error: ';' expected
   Buggy.java:3: error: package system does not exist
   ... and at run time: "Main method not found" for main(String)

   Fixes:
   (1) class name must match the file name exactly: public class Buggy
   (2) main must be static on Java 24 and below (or use instance main on Java 25
       with a valid signature)
   (3) parameter must be String[] args (an array), not String args
   (4) System with a capital S (Java is case-sensitive)
   (5) every statement ends with a semicolon
*/

// Fixed version:
// public class Buggy {
//     public static void main(String[] args) {
//         System.out.println("Hello, World!");
//     }
// }`
    },
    {
      heading: "15. Frequently Asked Questions about Java, JDK and JVM",
      content: `**What is the difference between JDK, JRE and JVM?**
The JVM is the virtual machine that executes bytecode. The JRE is the JVM plus the standard class library — enough to run Java programs. The JDK is the JRE plus developer tools such as \`javac\`, \`jshell\`, \`javadoc\` and \`jar\` — what you install to write Java. Since Java 11, vendors ship only the JDK; a slim runtime is built with \`jlink\` if needed.
**Is Java compiled or interpreted?**
Both. \`javac\` compiles source to bytecode ahead of time; the JVM first interprets that bytecode and then JIT-compiles frequently executed methods to native machine code at runtime. GraalVM Native Image additionally offers full ahead-of-time compilation to a native executable.
**Which Java version should I learn in 2026?**
Learn on Java 25, the current LTS, but be aware of what was added in Java 17 and 21 because most companies still run those in production. Avoid depending on preview features; in interviews, mention the version in which a feature became final.
**Is Java free to use?**
Yes. OpenJDK is open source under GPL with Classpath Exception. Builds such as Eclipse Temurin, Amazon Corretto and Microsoft's OpenJDK are free for development and production. Oracle JDK is also free under its No-Fee terms, with the caveat that free updates for an LTS end roughly a year after the next LTS ships.
**Why is main static in Java?**
Because the JVM must call \`main\` before any object of your class exists; a static method belongs to the class itself and needs no instance. Since Java 25 the launcher can also create an instance and call a non-static \`void main()\` for you, which is why the \`static\` keyword is now optional for simple programs.
**Can I run a Java program without compiling it first?**
Yes. Since Java 11, \`java Hello.java\` compiles the file in memory and runs it; since Java 22 it also compiles other source files that the program references. For experiments without any file at all, use \`jshell\`.
**What is bytecode in Java?**
Bytecode is the platform-neutral instruction set stored in \`.class\` files, produced by \`javac\` and executed by the JVM. It is what makes Java portable: the same \`.class\` file runs on any operating system with a JVM. You can view it with \`javap -c ClassName\`.
**What is JAVA_HOME and do I need to set it?**
\`JAVA_HOME\` is an environment variable pointing to your JDK folder. The \`java\` command itself does not need it, but Maven, Gradle, Tomcat, IDEs and most CI tools read it to locate the JDK. Set it once, add \`JAVA_HOME/bin\` to \`PATH\`, and most "command not found" problems disappear.`
    },
    {
      heading: "16. Interview Questions and Answers on Java Basics, JDK and JVM",
      content: `**Q1. Explain how a Java program executes from source code to output.**
\`javac\` compiles \`.java\` files into \`.class\` files containing bytecode. The \`java\` launcher starts a JVM, whose class loader loads the main class, the bytecode verifier validates it, and the execution engine runs it — initially via the interpreter, and for hot methods via the C1/C2 JIT compilers that emit native code. Memory for objects is allocated on the heap and reclaimed by the garbage collector. The JVM calls \`main\` to start the program.
**Q2. Is the JVM platform independent?**
No. The JVM is platform dependent — there are separate builds for Windows, Linux and macOS. The bytecode is platform independent, and that is what gives Java its write-once-run-anywhere property.
**Q3. What are the differences between JIT compilation and interpretation, and why does HotSpot use both?**
The interpreter executes bytecode instruction by instruction with no start-up cost but low throughput. The JIT compiler translates hot methods to optimised native code, which costs time up front but runs much faster. HotSpot's tiered compilation starts in the interpreter so programs start instantly, then compiles only the code that matters, using runtime profiling data to optimise better than a static compiler could.
**Q4. What is the role of the garbage collector, and can you force it to run?**
The GC automatically reclaims heap memory from objects that are no longer reachable from any live reference. You cannot force it; \`System.gc()\` is only a suggestion that the JVM may ignore. Memory leaks are still possible in Java when reachable structures (static collections, listeners, caches) hold references to objects that are no longer needed.
**Q5. Why can a Java source file contain only one public class, and why must the file name match it?**
The compiler and launcher locate a public class by file name: \`com.example.Hello\` is expected at \`com/example/Hello.java\` and \`Hello.class\`. Allowing one public class per file keeps this mapping unambiguous. A file may contain additional non-public (package-private) classes.
**Q6. What happens if you declare main as private or give it a non-void return type?**
The code compiles, because \`main\` is an ordinary method to the compiler, but the launcher will not find a valid entry point and reports "Main method not found in class X" (or "Main method must return a value of type void"). On Java 25, a non-private instance \`void main()\` is accepted; a private one is not.
**Q7. What is an LTS release, and why do companies prefer it?**
Feature releases arrive every six months but are supported only until the next one. LTS releases (8, 11, 17, 21, 25) receive security and bug-fix updates for years from Oracle and other vendors, so enterprises can stay on one version safely. Since Java 17, Oracle designates an LTS every two years.
**Q8. What is the difference between \`java Hello\` and \`java Hello.java\`?**
\`java Hello\` runs an already compiled \`Hello.class\` found on the classpath. \`java Hello.java\` (Java 11+) compiles the source in memory and runs its first class without writing a \`.class\` file. The first is used for packaged applications; the second for scripts and quick experiments.
**Q9. What is a preview feature in Java?**
A preview feature is fully implemented but not yet permanent; its design may change based on feedback. It must be enabled explicitly with \`--enable-preview\` at compile time and run time, and class files compiled with it run only on the same JDK version. Compact source files were previews in Java 21-24 and became final in Java 25.
**Q10. What does \`jlink\` do and why is it relevant now that there is no separate JRE?**
\`jlink\` (Java 9+) assembles a custom runtime image containing only the JDK modules your application needs. Since vendors stopped shipping a stand-alone JRE in Java 11, \`jlink\` is the standard way to create a small runtime for containers and desktop installers (together with \`jpackage\`).`
    },
    {
      heading: "17. Hands-On Exercise: Build a Java Environment Report Program",
      content: `Time to apply everything. Create a file called \`EnvReport.java\` with the code in the snippet. The program prints a report about the JVM it is running on (version, vendor, JDK home, operating system, CPU count, heap limits), greets the user by name from the command line or by asking interactively, and demonstrates the two argument-handling styles you learned.
Run it in all three ways from this lecture and compare:
1. **Classic:** \`javac EnvReport.java\` then \`java EnvReport Ananya\`. Confirm that \`EnvReport.class\` appears in the folder, then inspect it with \`javap -c EnvReport | more\`.
2. **Source-file mode:** delete \`EnvReport.class\` and run \`java EnvReport.java Ananya\`. Confirm no \`.class\` file is created.
3. **JIT experiment:** run \`java -Xint EnvReport.java\` (interpreter only) and \`java -XX:+PrintCompilation EnvReport.java\` and compare the "Loop time" line.
**Stretch goals:**
• Rewrite the program as a Java 25 **compact source file** using \`void main()\` and \`IO.println\` / \`IO.readln\`, and confirm it runs with plain \`java EnvReportCompact.java\`.
• Add a line that prints \`System.getProperty("java.class.path")\` and run the program from a different directory with \`java -cp path/to/folder EnvReport\` to see how the classpath works.
• Open jshell and reproduce the GST calculation using \`$\` variables, then \`/save gst.jsh\`.
Expected output is shown in the comment at the end of the snippet; your numbers will differ.`,
      codeSnippet: `// EnvReport.java
// Compile & run:  javac EnvReport.java && java EnvReport Ananya
// Or directly:    java EnvReport.java Ananya

import java.util.Scanner;

public class EnvReport {

    public static void main(String[] args) {
        printHeader("JAVA ENVIRONMENT REPORT");

        // --- 1. JVM and OS information from system properties ---
        System.out.println("Java version : " + System.getProperty("java.version"));
        System.out.println("Vendor       : " + System.getProperty("java.vendor"));
        System.out.println("JDK home     : " + System.getProperty("java.home"));
        System.out.println("VM name      : " + System.getProperty("java.vm.name"));
        System.out.println("OS           : " + System.getProperty("os.name")
                + " " + System.getProperty("os.version")
                + " (" + System.getProperty("os.arch") + ")");
        System.out.println("User dir     : " + System.getProperty("user.dir"));

        // --- 2. Hardware and memory seen by this JVM ---
        Runtime rt = Runtime.getRuntime();
        long mb = 1024L * 1024L;
        System.out.println("CPU cores    : " + rt.availableProcessors());
        System.out.println("Max heap     : " + rt.maxMemory() / mb + " MB");
        System.out.println("Used heap    : " + (rt.totalMemory() - rt.freeMemory()) / mb + " MB");

        // --- 3. Command-line arguments vs interactive input ---
        printHeader("GREETING");
        String name;
        if (args.length > 0) {
            name = args[0];
            System.out.println("(name taken from command-line argument)");
        } else {
            Scanner in = new Scanner(System.in);
            System.out.print("Enter your name: ");
            name = in.nextLine().trim();
            if (name.isEmpty()) name = "Learner";
        }
        System.out.println("Namaste, " + name + "! You are ready for Java " + Runtime.version().feature() + ".");

        // --- 4. A small computation: course fee with 18% GST ---
        int baseFee = 4999;
        int gst = baseFee * 18 / 100;
        System.out.println("Course fee   : Rs. " + baseFee + " + GST Rs. " + gst
                + " = Rs. " + (baseFee + gst));

        // --- 5. A hot loop so you can observe JIT warm-up ---
        long start = System.nanoTime();
        long acc = 0;
        for (int i = 0; i < 50_000_000; i++) {
            acc += i % 7;
        }
        long elapsedMs = (System.nanoTime() - start) / 1_000_000;
        System.out.println("Loop time    : " + elapsedMs + " ms (checksum " + acc + ")");
    }

    static void printHeader(String title) {
        System.out.println();
        System.out.println("=== " + title + " ===");
    }
}

/* Sample output (Windows laptop, Temurin 25):

   === JAVA ENVIRONMENT REPORT ===
   Java version : 25.0.1
   Vendor       : Eclipse Adoptium
   JDK home     : C:\\Program Files\\Eclipse Adoptium\\jdk-25.0.1.8-hotspot
   VM name      : OpenJDK 64-Bit Server VM
   OS           : Windows 11 10.0 (amd64)
   User dir     : C:\\java-course\\lecture01
   CPU cores    : 8
   Max heap     : 4064 MB
   Used heap    : 2 MB

   === GREETING ===
   (name taken from command-line argument)
   Namaste, Ananya! You are ready for Java 25.
   Course fee   : Rs. 4999 + GST Rs. 899 = Rs. 5898
   Loop time    : 41 ms (checksum 149999997)

   With -Xint the loop takes several hundred ms or more: that is the JIT difference.
*/

// ---- Stretch goal: EnvReportCompact.java (Java 25 compact source file) ----
// void main() {
//     IO.println("Java " + Runtime.version().feature() + " on " + System.getProperty("os.name"));
//     String name = IO.readln("Enter your name: ");
//     IO.println("Namaste, " + name + "!");
// }`
    },
    {
      heading: "18. Summary",
      content: `• **Java** is a compiled-and-interpreted, object-oriented language whose source is compiled by \`javac\` into platform-neutral **bytecode** that the **JVM** executes — the basis of **write once, run anywhere**.
• **JDK** = JRE + developer tools; **JRE** = JVM + class library; **JVM** = the execution engine. Since Java 11 you install a JDK and build slim runtimes with \`jlink\`.
• The JVM interprets bytecode first, then the **JIT compiler** (C1 and C2, tiered) compiles hot methods to native code, which is why Java programs get faster after warm-up.
• **Garbage collection** frees unreachable heap objects automatically; G1 is the default collector, ZGC and Shenandoah give ultra-low pauses, and leaks are still possible through lingering references.
• Java ships a **feature release every six months** and an **LTS every two years**: 8, 11, 17, 21 and **25 (current LTS, September 2025)**. Use only final features of your deployed LTS in production.
• Install **Eclipse Temurin** (or Oracle JDK), set **JAVA_HOME** and add its \`bin\` to \`PATH\`; use **IntelliJ IDEA Community** or **VS Code with the Extension Pack for Java**.
• A classic program needs \`public class Name\` in \`Name.java\` and \`public static void main(String[] args)\`; compile with \`javac Name.java\`, run with \`java Name\`.
• \`java Name.java\` runs source directly (**Java 11**, multi-file since **Java 22**); **jshell** (Java 9) is the REPL for instant experiments.
• **Java 25** finalises **compact source files and instance main methods** (JEP 512): \`void main() { IO.println("Hi"); }\` is a complete program.
**Next lecture:** Variables, Data Types, Operators & Type Casting`
    }
  ]
};
