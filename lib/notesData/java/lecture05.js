export const lecture05 = {
  slug: "lecture-5",
  number: 5,
  title: "Complete Java Course — Lecture 5: Object-Oriented Programming Part 1 — Classes, Objects & Encapsulation",
  summary: "Learn Java classes and objects, fields and methods, constructors and overloading, the this keyword, access modifiers, encapsulation with getters and setters, static members, initialization blocks, object lifecycle, equals/hashCode/toString, Java records and packages — with examples and interview questions.",
  readTime: "55 min read",
  difficulty: "Beginner",
  date: "2026-10-09",
  sections: [
    {
      heading: "1. Introduction: What Is Object-Oriented Programming in Java and Why It Matters",
      content: `In Lecture 4 you learned to break logic into methods, store data in arrays and manipulate text with Strings. That is enough to write small programs, but real software — a UPI payment app, a railway booking system, an e-commerce backend — has hundreds of kinds of data that must travel together with the rules that govern them. A bank balance is not just a \`double\`; it is a number that can only change through deposits and withdrawals, that can never go negative, and that belongs to exactly one account holder. **Object-Oriented Programming (OOP)** is the way Java lets you model this: you bundle data (fields) and behaviour (methods) into a **class**, and create as many **objects** from that class as you need.
Java is an object-oriented language from the ground up. Every line of code you write lives inside a class, every value that is not a primitive is an object, and the entire standard library (Strings, Lists, files, HTTP clients) is built from classes. If you do not understand classes, constructors and encapsulation, you cannot read Spring Boot code, you cannot design a database entity, and you will struggle in any Java interview — "explain encapsulation" and "why override equals and hashCode together" are asked in almost every fresher and 2-to-5-year-experience round in India.
OOP has four pillars: **encapsulation, inheritance, polymorphism and abstraction**. This lecture covers the first pillar in depth along with everything you need to build well-formed classes: fields and methods, constructors and overloading, the \`this\` keyword, access modifiers, getters and setters, static members, initialization blocks, the object lifecycle, the \`equals\` / \`hashCode\` / \`toString\` trio, Java **records** (final since Java 16) and how packages and imports organise code. Lecture 6 builds on this with inheritance, polymorphism, abstract classes and interfaces.
Throughout, examples use Java 25 (the current LTS released in September 2025) and every modern feature is labelled with the version that finalised it, so you always know what works on the Java 17 or Java 21 build your company may still be using.`
    },
    {
      heading: "2. Classes and Objects in Java: Blueprint vs Instance",
      content: `A **class** is a blueprint. It describes what data every object of that kind will hold and what operations it can perform. An **object** (also called an **instance**) is a concrete thing created from that blueprint at runtime, with its own copy of the data. The class \`BankAccount\` describes "an account has a number, a holder and a balance, and can accept deposits". The objects are Priya's account and Rahul's account — two separate blocks of memory on the **heap**, each with its own balance.
You create an object with the \`new\` keyword: \`new BankAccount()\` allocates memory, initialises the fields and returns a **reference** to the object. The variable \`a1\` does not hold the object itself; it holds the reference (think of it as the address). This matters: when you write \`BankAccount a3 = a1;\` you copy the reference, not the object, so \`a1\` and \`a3\` point to the same account and a deposit through one is visible through the other. This is the single most important mental model in Java and it explains dozens of "bugs" beginners hit with lists, arrays and method parameters.
A few rules about classes:
• A Java source file can contain many classes but at most **one \`public\` top-level class**, and the file name must match it (\`BankAccount.java\`).
• Class names use **PascalCase** (\`BankAccount\`, \`OrderService\`); fields and methods use **camelCase** (\`accountNumber\`, \`deposit()\`).
• A class with a \`main\` method is just a class the JVM knows how to start; any class can have one.
• Since Java 25 (JEP 512, final) you can also write a **compact source file** with an instance \`main\` method and no class declaration for quick scripts, but production code always uses explicit classes, so that is what we practise here.
The example below defines the class, then creates two independent objects and a second reference to the first one. Study the output carefully: the deposit through \`a3\` changed \`a1\`.`,
      codeSnippet: `// BankAccount.java
public class BankAccount {
    // Fields: the STATE every account object carries
    String accountNumber;
    String holderName;
    double balance;

    // Methods: the BEHAVIOUR every account object can perform
    void deposit(double amount) {
        balance = balance + amount;
    }

    void showBalance() {
        System.out.println(holderName + " (" + accountNumber + ") has balance Rs " + balance);
    }
}

// Main.java
public class Main {
    public static void main(String[] args) {
        BankAccount a1 = new BankAccount();   // object 1 on the heap
        a1.accountNumber = "SBI10001";
        a1.holderName = "Priya Sharma";
        a1.deposit(5000);

        BankAccount a2 = new BankAccount();   // object 2 — completely separate memory
        a2.accountNumber = "SBI10002";
        a2.holderName = "Rahul Verma";
        a2.deposit(12000);

        a1.showBalance();   // Priya Sharma (SBI10001) has balance Rs 5000.0
        a2.showBalance();   // Rahul Verma (SBI10002) has balance Rs 12000.0

        BankAccount a3 = a1;   // NOT a copy: a3 and a1 refer to the SAME object
        a3.deposit(1000);
        a1.showBalance();   // Priya Sharma (SBI10001) has balance Rs 6000.0

        System.out.println(a1 == a3);   // true  (same reference)
        System.out.println(a1 == a2);   // false (different objects)
    }
}`
    },
    {
      heading: "3. Fields and Methods: State and Behaviour of a Java Object",
      content: `**Fields** (also called instance variables or member variables) are the variables declared directly inside a class, outside any method. Each object gets its own copy. **Methods** are the functions declared inside the class; they can read and modify the fields of the object they are called on without receiving them as parameters — that is the whole point of bundling data and behaviour together.
Three facts about fields that beginners must memorise:
• **Fields get default values automatically**: numeric types become \`0\` or \`0.0\`, \`boolean\` becomes \`false\`, \`char\` becomes \`'\\u0000'\`, and every reference type (\`String\`, arrays, your own classes) becomes \`null\`. This is why a freshly created \`Student\` prints \`null\` for the name.
• **Local variables do NOT get default values.** A variable declared inside a method must be assigned before it is read, or the compiler refuses with "variable might not have been initialized". Fields and local variables follow different rules because fields live on the heap as part of the object while locals live on the stack frame of one method call.
• **A field and a local variable can share a name** — the local one "shadows" the field inside that method. That is the situation the \`this\` keyword solves in Section 4.
Methods can call other methods of the same object directly (\`grade()\` inside \`printCard()\`), can return any type including objects, and can be overloaded (same name, different parameter lists). A method that only reads fields is often called a **query**; a method that changes them is a **command** — a useful distinction when you design APIs.
The example below shows default values in action, a method that computes a derived value from a field, and a local variable that must be initialised explicitly.`,
      codeSnippet: `// Student.java
public class Student {
    int rollNo;          // default 0
    String name;         // default null
    double cgpa;         // default 0.0
    boolean hostelite;   // default false

    // Query method: derives a value from the object's own state
    String grade() {
        if (cgpa >= 9.0) return "A+";
        if (cgpa >= 8.0) return "A";
        if (cgpa >= 7.0) return "B";
        return "C";
    }

    void printCard() {
        int batchYear = 2026;    // local variable: MUST be initialised before use
        System.out.println("Roll " + rollNo + " | " + name + " | CGPA " + cgpa
                + " | Grade " + grade() + " | Hostel: " + hostelite + " | Batch " + batchYear);
    }

    public static void main(String[] args) {
        Student s = new Student();
        s.printCard();
        // Roll 0 | null | CGPA 0.0 | Grade C | Hostel: false | Batch 2026

        s.rollNo = 42;
        s.name = "Ananya Iyer";
        s.cgpa = 8.7;
        s.hostelite = true;
        s.printCard();
        // Roll 42 | Ananya Iyer | CGPA 8.7 | Grade A | Hostel: true | Batch 2026
    }
}`
    },
    {
      heading: "4. Constructors, Constructor Overloading and the this Keyword in Java",
      content: `Setting fields one by one after \`new\` (as in Section 2) is error-prone: you can forget one, and the object is "half built" for a while. A **constructor** is a special method that runs exactly once when an object is created, so the object is valid from its very first moment. Rules: a constructor has the **same name as the class**, has **no return type** (not even \`void\`), and is invoked by \`new\`.
• **Default constructor**: if you write no constructor at all, the compiler generates a public no-argument one that does nothing. The moment you write any constructor yourself, that free one disappears — a classic compile error when some other code still calls \`new Employee()\`.
• **Parameterized constructor**: accepts arguments and assigns them to fields, often after validation. Throwing \`IllegalArgumentException\` from a constructor is the standard way to refuse to build an invalid object.
• **Constructor overloading**: a class can have several constructors with different parameter lists, so callers can provide as much or as little as they know. To avoid duplicating assignment logic, the smaller constructors delegate to the full one with \`this(...)\`, which is called **constructor chaining**. Up to Java 24, the \`this(...)\` or \`super(...)\` call had to be the very first statement. **Java 25 finalised Flexible Constructor Bodies (JEP 513)**, which allows statements that do not touch \`this\` (for example argument validation) before that call.
**The \`this\` keyword** is a reference to the current object — the one whose method or constructor is running. It has four everyday uses:
1. Disambiguate a field from a parameter with the same name: \`this.name = name;\` (field on the left, parameter on the right).
2. Call another constructor of the same class: \`this(name, "Bengaluru", salary);\`.
3. Pass the current object to another method: \`registry.add(this);\`.
4. Return the current object from a method so calls can be chained: \`return this;\` — the pattern behind builders and fluent APIs such as \`StringBuilder.append()\`.
\`this\` cannot be used inside a \`static\` method, because a static method runs without any current object (Section 7).`,
      codeSnippet: `// Employee.java
public class Employee {
    private String name;
    private String city;
    private double salary;

    // 1. No-arg constructor delegates to the full one (constructor chaining)
    public Employee() {
        this("Unknown", "Bengaluru", 0.0);
    }

    // 2. Overloaded: name + salary, city defaults to Bengaluru
    public Employee(String name, double salary) {
        this(name, "Bengaluru", salary);
    }

    // 3. The "real" constructor: validates and assigns every field
    public Employee(String name, String city, double salary) {
        if (salary < 0) {
            throw new IllegalArgumentException("Salary cannot be negative: " + salary);
        }
        this.name = name;        // this.name = the field, name = the parameter
        this.city = city;
        this.salary = salary;
    }

    // Returns 'this' so calls can be chained
    public Employee giveRaise(double percent) {
        this.salary = this.salary * (1 + percent / 100);
        return this;
    }

    public void print() {
        System.out.printf("%s from %s earns Rs %.2f%n", name, city, salary);
    }

    public static void main(String[] args) {
        Employee e1 = new Employee();
        Employee e2 = new Employee("Kiran Rao", 45000);
        Employee e3 = new Employee("Meera Nair", "Pune", 80000);

        e1.print();                               // Unknown from Bengaluru earns Rs 0.00
        e2.print();                               // Kiran Rao from Bengaluru earns Rs 45000.00
        e3.giveRaise(10).giveRaise(5).print();    // Meera Nair from Pune earns Rs 92400.00

        // new Employee("X", "Delhi", -1);        // throws IllegalArgumentException
    }
}`
    },
    {
      heading: "5. Access Modifiers in Java: private, default, protected and public",
      content: `Access modifiers decide **who is allowed to see a field, method, constructor or class**. They are the mechanism that makes encapsulation enforceable rather than a polite convention. Java has four levels, from most restrictive to least:
• **\`private\`** — visible only inside the same class. Use this for almost every field and for helper methods that are implementation details.
• **default (package-private)** — no keyword at all. Visible to every class in the **same package**, invisible outside it. Useful for classes and helpers that cooperate inside one package but should not become part of your public API.
• **\`protected\`** — visible in the same package **plus** in subclasses, even if those subclasses live in other packages. You will use it in Lecture 6 when designing class hierarchies; it is rarely the right choice for fields.
• **\`public\`** — visible everywhere. Reserve it for the operations you genuinely want the rest of the program (or other teams) to call.
For top-level classes only two options exist: \`public\` or package-private. For members all four apply. A practical rule used in most Indian product companies and in the Google Java Style Guide: **make everything as private as possible, then widen only when a real caller needs it**. Narrow visibility means fewer places can break your invariants, and it makes refactoring safe because the compiler tells you exactly who depends on what.
Notice in the example how \`Checkout\`, sitting in a different package, cannot touch \`costPrice\` or \`stock\` directly but can still get useful information through the public \`stockStatus()\` method. That is encapsulation at work: the data is hidden, the behaviour is exposed.`,
      codeSnippet: `// File: com/shop/Product.java
package com.shop;

public class Product {
    public String name;            // visible everywhere
    protected double costPrice;    // same package + subclasses anywhere
    int stock;                     // package-private: same package only
    private String supplierCode;   // this class only

    public Product(String name, double costPrice, int stock, String supplierCode) {
        this.name = name;
        this.costPrice = costPrice;
        this.stock = stock;
        this.supplierCode = supplierCode;
    }

    private boolean isLowStock() {          // internal helper
        return stock < 5;
    }

    public String stockStatus() {           // public behaviour built on private data
        return isLowStock() ? "Reorder soon" : "In stock";
    }
}

// File: com/shop/Inventory.java  (SAME package)
package com.shop;

public class Inventory {
    void audit(Product p) {
        System.out.println(p.name);          // ok: public
        System.out.println(p.costPrice);     // ok: protected, same package
        System.out.println(p.stock);         // ok: package-private, same package
        // System.out.println(p.supplierCode);  // COMPILE ERROR: private
    }
}

// File: com/billing/Checkout.java  (DIFFERENT package)
package com.billing;

import com.shop.Product;

public class Checkout {
    void bill(Product p) {
        System.out.println(p.name);          // ok: public
        // System.out.println(p.costPrice);  // COMPILE ERROR: not a subclass, other package
        // System.out.println(p.stock);      // COMPILE ERROR: package-private
        System.out.println(p.stockStatus()); // ok: public method
    }
}`
    },
    {
      heading: "6. Encapsulation in Java with Getters and Setters",
      content: `**Encapsulation** means keeping an object's data private and allowing access only through methods that the class controls. The benefit is not "hiding" for its own sake; it is that the class can **guarantee its own rules (invariants)**. If \`balance\` is private and can change only through \`addMoney()\` and \`pay()\`, then no code anywhere in a 500,000-line application can make the balance negative, because those two methods check. If \`balance\` were public, every one of those lines is a potential bug.
The conventional tools are **getters** and **setters** (together called accessors), which follow the **JavaBeans naming convention** that frameworks such as Spring, Hibernate and Jackson rely on through reflection:
• \`getXxx()\` returns the field; for a \`boolean\` field the getter is \`isXxx()\`.
• \`setXxx(value)\` assigns it, usually after validation.
Good encapsulation goes further than mechanically generating a getter and a setter for every field (your IDE can do that, and it often produces a class that is no better than public fields):
• **Omit setters for fields that should never change** after construction, and mark them \`final\` — like \`upiId\` below. A read-only property is a feature, not a limitation.
• **Replace generic setters with intention-revealing methods.** \`setBalance(x)\` says nothing; \`addMoney(amount)\` and \`pay(amount, to)\` say exactly what business operation is happening and can enforce rules for each.
• **Return defensive copies or unmodifiable views** of mutable internals such as lists, dates and arrays. If \`getHistory()\` returned the real \`ArrayList\`, a caller could add fake transactions. \`Collections.unmodifiableList()\` returns a read-only window; \`List.copyOf()\` (Java 10+) returns an independent immutable copy.
• **Validate in setters and constructors**, and throw \`IllegalArgumentException\` for bad input and \`IllegalStateException\` when the operation is not allowed right now (insufficient balance).
The \`UpiWallet\` class below applies all of these. Try to break its rules from \`main\` — you cannot, and that is the point.`,
      codeSnippet: `// UpiWallet.java
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class UpiWallet {
    private final String upiId;                           // read-only after construction
    private double balance;                               // only changed by addMoney / pay
    private final List<String> history = new ArrayList<>();

    public UpiWallet(String upiId) {
        if (upiId == null || !upiId.contains("@")) {
            throw new IllegalArgumentException("Invalid UPI id: " + upiId);
        }
        this.upiId = upiId;
    }

    public String getUpiId() {            // getter only — deliberately no setUpiId
        return upiId;
    }

    public double getBalance() {
        return balance;
    }

    public void addMoney(double amount) { // intention-revealing instead of setBalance()
        if (amount <= 0) throw new IllegalArgumentException("Amount must be positive");
        balance += amount;
        history.add(LocalDateTime.now() + " CREDIT " + amount);
    }

    public void pay(double amount, String to) {
        if (amount <= 0) throw new IllegalArgumentException("Amount must be positive");
        if (amount > balance) throw new IllegalStateException("Insufficient balance");
        balance -= amount;
        history.add(LocalDateTime.now() + " DEBIT " + amount + " to " + to);
    }

    public List<String> getHistory() {
        return Collections.unmodifiableList(history);     // caller gets a read-only view
    }

    public static void main(String[] args) {
        UpiWallet w = new UpiWallet("priya@okaxis");
        w.addMoney(2000);
        w.pay(499, "foodapp@ybl");
        System.out.println(w.getBalance());               // 1501.0
        w.getHistory().forEach(System.out::println);

        // w.balance = 1_00_000;              // COMPILE ERROR: balance is private
        // w.getHistory().add("fake");        // UnsupportedOperationException at runtime
        // w.pay(5000, "x@ybl");              // IllegalStateException: Insufficient balance
    }
}`
    },
    {
      heading: "7. Static Members in Java: Static Fields, Static Methods and Static Nested Classes",
      content: `Everything so far has been **instance-level**: each object has its own fields and methods operate on one object. Sometimes, however, a piece of data or behaviour belongs to the **class as a whole**, not to any single object. That is what the \`static\` keyword expresses.
• **Static fields** (class variables) exist exactly **once per class**, shared by all objects, and are created when the class is loaded. A ticket counter that must hand out unique IDs, a cache, or a constant such as \`GST_PERCENT\` are natural static fields. Constants are written \`public static final\` with an UPPER_SNAKE_CASE name.
• **Static methods** belong to the class and are called as \`Ticket.ticketsSold()\` without creating an object. Because there is no current object, a static method **cannot use \`this\` and cannot access instance fields or instance methods directly** — it can only touch static members or whatever it receives as parameters. \`main\` is static for exactly this reason: the JVM calls it before any object of your class exists. Utility classes such as \`Math\` (\`Math.max\`, \`Math.sqrt\`) and \`Collections\` consist entirely of static methods.
• **Static nested classes** are classes declared inside another class with the \`static\` modifier. They are just a namespacing tool — \`Ticket.PriceCalculator\` reads as "the price calculator that belongs with tickets" — and unlike inner (non-static) classes they do not need an enclosing instance. Prefer static nested classes unless the nested class genuinely needs the outer object's fields.
When should a method be static? Ask: "does this operation depend on the state of a particular object?" If yes, make it an instance method. If it only transforms its inputs (\`isValidPincode(String)\`, \`calculateGst(double)\`), make it static. Overusing static is a common anti-pattern because static state is global state: it is shared across threads, hard to test and impossible to replace with a mock. Frameworks such as Spring avoid static singletons for that reason and inject instances instead.
The example counts tickets with a static field, reads the count through a static method, and uses a static nested helper class.`,
      codeSnippet: `// Ticket.java
public class Ticket {
    private static int nextId = 1;               // ONE copy, shared by every Ticket
    public static final int GST_PERCENT = 18;    // constant: UPPER_SNAKE_CASE

    private final int id;                        // per-object
    private final String movie;
    private final double basePrice;

    public Ticket(String movie, double basePrice) {
        this.id = nextId++;                      // each object gets the next unique id
        this.movie = movie;
        this.basePrice = basePrice;
    }

    public static int ticketsSold() {            // static: no 'this' available here
        return nextId - 1;
        // return basePrice;   // COMPILE ERROR: non-static field in static context
    }

    public double finalPrice() {                 // instance: works on this.basePrice
        return basePrice * (100 + GST_PERCENT) / 100;
    }

    // Static nested class: lives inside Ticket for organisation, needs no Ticket object
    public static class PriceCalculator {
        public static double withConvenienceFee(double price) {
            return price + 30;
        }
    }

    public static void main(String[] args) {
        Ticket t1 = new Ticket("Monsoon Express", 250);
        Ticket t2 = new Ticket("Chennai Nights", 300);

        System.out.println(t1.finalPrice());                 // 295.0
        System.out.println(Ticket.ticketsSold());            // 2   (called on the class)
        System.out.println(Ticket.GST_PERCENT);              // 18
        System.out.println(
            Ticket.PriceCalculator.withConvenienceFee(t2.finalPrice()));   // 384.0
    }
}`
    },
    {
      heading: "8. Initialization Blocks and the Object Initialization Order in Java",
      content: `Besides constructors, Java offers two more places where initialisation code can live, and interviewers love asking in which order everything runs.
• A **static initialization block** — \`static { ... }\` — runs **once**, when the class is loaded and initialised by the JVM (the first time it is used: an object is created, a static method is called or a static field is accessed). Use it when a static field needs more than a one-line expression, for example loading a lookup table or reading a configuration file into a static map. A class may have several static blocks; they run in textual order.
• An **instance initialization block** — \`{ ... }\` with no keyword — runs **every time an object is created, before the constructor body**, after the field initialisers that precede it in the source. It is useful when several overloaded constructors need the same setup and you do not want to chain them, though in practice most developers just chain constructors with \`this(...)\`. Anonymous classes, which have no constructors, are the one place instance blocks are common.
The complete **initialisation order** for a single class (inheritance adds the superclass steps first; Lecture 6 covers that) is:
1. Static field initialisers and static blocks, in textual order, once per class.
2. When \`new\` runs: memory is allocated and every field gets its default value (0, false, null).
3. Instance field initialisers and instance blocks, in **textual order**.
4. The constructor body (after any \`this(...)\` chain completes).
Textual order matters: in the example the field initialiser \`label = compute(...)\` is written **above** the instance block, so it runs first; if you swap them, the numbers change. Run the program and compare its output with the comment at the bottom. Also note that the static block printed **before** \`main starts\` — the class had to be initialised before the JVM could call \`main\`.`,
      codeSnippet: `// InitOrder.java
public class InitOrder {
    static int counter;                                 // static field
    int id;                                             // instance field
    String label = compute("field initialiser");        // instance field initialiser

    static {                                            // static block: once per class
        System.out.println("1. static block runs once when the class loads");
        counter = 100;
    }

    {                                                   // instance block: before every constructor body
        System.out.println("3. instance block runs before every constructor body");
        id = ++counter;
    }

    InitOrder() {                                       // constructor
        System.out.println("4. constructor body: id = " + id + ", label = " + label);
    }

    static String compute(String what) {
        System.out.println("2. " + what);
        return "L-" + counter;
    }

    public static void main(String[] args) {
        System.out.println("main starts");
        new InitOrder();
        new InitOrder();
    }
}
/* Output:
1. static block runs once when the class loads
main starts
2. field initialiser
3. instance block runs before every constructor body
4. constructor body: id = 101, label = L-100
2. field initialiser
3. instance block runs before every constructor body
4. constructor body: id = 102, label = L-101
*/`
    },
    {
      heading: "9. Object Lifecycle in Java: Creation, Use, Unreachability and Garbage Collection",
      content: `Understanding what happens to an object from \`new\` to its disappearance explains memory leaks, \`NullPointerException\` and why Java does not have \`delete\`.
**1. Creation.** \`new Order()\` asks the JVM to allocate space on the **heap**, zero the fields, run the initialisers and the constructor (Section 8), and return a reference. The reference variable itself usually lives on the **stack** of the running method. Object creation in modern JVMs is very cheap — a few nanoseconds — so do not avoid creating small objects out of fear; the garbage collector is optimised for short-lived objects.
**2. Use.** As long as at least one live reference can reach the object (from a local variable, a field of another reachable object, or a static field), the object is **reachable** and stays alive. Passing the reference to a method, storing it in a list or assigning it to another variable just creates more paths to the same object.
**3. Unreachable.** When the last reference is gone — the method returns, you assign \`null\`, you remove the object from the list — the object becomes **eligible for garbage collection**. Nothing happens immediately.
**4. Garbage collection.** The JVM's **garbage collector (GC)** periodically finds unreachable objects and reclaims their memory. You never free memory by hand. \`System.gc()\` is only a hint and should not appear in production code. A **memory leak** in Java is therefore not "forgetting to free" but "keeping an unnecessary reference", typically in a static collection or a long-lived cache that grows forever.
**Do not use \`finalize()\`.** The \`Object.finalize()\` method was deprecated in Java 9 and marked **for removal in Java 18 (JEP 421)**; it is unreliable, slow and may never run. For resources that must be released deterministically — files, sockets, database connections — implement \`AutoCloseable\` and let callers use **try-with-resources**, which calls \`close()\` the moment the block exits, even when an exception is thrown. For rare cases where you need a safety net when an object is collected, \`java.lang.ref.Cleaner\` (Java 9+) is the supported replacement.`,
      codeSnippet: `// Lifecycle.java
public class Lifecycle {

    // A resource with deterministic cleanup
    static class Connection implements AutoCloseable {
        private final String name;

        Connection(String name) {
            this.name = name;
            System.out.println("open " + name);
        }

        void query(String sql) {
            System.out.println("running: " + sql);
        }

        @Override
        public void close() {              // called automatically by try-with-resources
            System.out.println("close " + name);
        }
    }

    public static void main(String[] args) {
        // 1. Creation: allocate on the heap, run initialisers + constructor
        StringBuilder order = new StringBuilder("order-");

        // 2. Use: the object is reachable through 'order'
        order.append(101);
        System.out.println(order);         // order-101

        // 3. Unreachable: no reference points to the StringBuilder any more
        order = null;                      // eligible for GC; the collector decides WHEN

        // 4. Resources: use try-with-resources, never finalize()
        try (Connection c = new Connection("db-primary")) {
            c.query("SELECT * FROM orders");
        }                                  // close() runs here, even if query() threw

        // Output:
        // order-101
        // open db-primary
        // running: SELECT * FROM orders
        // close db-primary
    }
}`
    },
    {
      heading: "10. equals, hashCode and toString in Java: Making Objects Behave Correctly",
      content: `Every class in Java implicitly extends \`java.lang.Object\`, which gives it a handful of methods. Three of them must be overridden in almost every class that represents data, and interviewers test this relentlessly.
**\`toString()\`** — the default returns something like \`Pincode@1b6d3586\` (class name plus a hex hash), which is useless in logs and debuggers. Override it to show the meaningful fields. \`System.out.println(obj)\`, string concatenation and most logging frameworks call it automatically.
**\`equals(Object)\`** — the default implementation is **reference equality**: \`a.equals(b)\` is true only if \`a == b\`. For value-like objects (a pincode, a money amount, a user ID) you want **content equality**: two \`Pincode\` objects with the same code and city should be equal even if they are different objects in memory. A correct \`equals\` is reflexive, symmetric, transitive, consistent and returns \`false\` for \`null\`. The idiomatic implementation first checks \`this == o\`, then uses an \`instanceof\` pattern (final in Java 16) which handles \`null\` and the type check in one line, then compares the fields.
**\`hashCode()\`** — returns an \`int\` used by hash-based collections (\`HashMap\`, \`HashSet\`, \`Hashtable\`) to decide which bucket an object goes into. The contract: **if two objects are equal according to \`equals\`, they MUST have the same \`hashCode\`.** The reverse is not required (unequal objects may collide). If you override \`equals\` but not \`hashCode\`, a \`HashSet\` will happily store two "equal" objects in different buckets, and \`map.get(key)\` will fail to find a key you just put in. \`Objects.hash(field1, field2, ...)\` builds a correct hash from the **same fields that \`equals\` compares**; always keep the two in sync.
Practical rules: override all three together or none; only use immutable (or at least never-changed) fields in \`equals\`/\`hashCode\`, because if a field changes after the object is placed in a \`HashSet\`, the object becomes unfindable; and use your IDE's generator or, better, a record (next section) which generates all three correctly for free.
The example shows the difference between \`==\` and \`equals\`, and proves that a \`HashSet\` deduplicates only because both methods are overridden consistently.`,
      codeSnippet: `// Pincode.java
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

public class Pincode {
    private final String code;
    private final String city;

    public Pincode(String code, String city) {
        this.code = Objects.requireNonNull(code, "code");
        this.city = Objects.requireNonNull(city, "city");
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;                       // same reference: fast path
        if (!(o instanceof Pincode other)) return false;  // null-safe + type check (Java 16 pattern)
        return code.equals(other.code) && city.equals(other.city);
    }

    @Override
    public int hashCode() {
        return Objects.hash(code, city);                  // SAME fields as equals
    }

    @Override
    public String toString() {
        return "Pincode{code='" + code + "', city='" + city + "'}";
    }

    public static void main(String[] args) {
        Pincode a = new Pincode("560001", "Bengaluru");
        Pincode b = new Pincode("560001", "Bengaluru");

        System.out.println(a == b);          // false — two different objects
        System.out.println(a.equals(b));     // true  — same content
        System.out.println(a.hashCode() == b.hashCode());   // true — contract satisfied
        System.out.println(a);               // Pincode{code='560001', city='Bengaluru'}

        Set<Pincode> set = new HashSet<>();
        set.add(a);
        set.add(b);
        System.out.println(set.size());      // 1 — duplicate detected via hashCode + equals
        System.out.println(set.contains(new Pincode("560001", "Bengaluru")));   // true
    }
}`
    },
    {
      heading: "11. Java Records: Immutable Data Carriers (Final Since Java 16)",
      content: `Writing a simple class that just holds a few values — a DTO, an API response, a coordinate, a money amount — used to take 40 to 60 lines: private final fields, a constructor, getters, \`equals\`, \`hashCode\`, \`toString\`. **Records** (previewed in Java 14 and 15, **final in Java 16 via JEP 395**, and therefore available on every supported LTS: 17, 21 and 25) reduce that to one line. A record is a class whose purpose is to be a **transparent, immutable carrier of data**.
When you write \`public record Money(long paise, String currency)\`, the compiler generates:
• A **private final field** for each component (\`paise\`, \`currency\`).
• A **canonical constructor** taking all components in order.
• A public **accessor** per component named exactly like the component — \`paise()\`, not \`getPaise()\`. This is the JavaBeans convention's one notable exception; Jackson, Spring and JPA-adjacent libraries understand it.
• **\`equals\`, \`hashCode\` and \`toString\`** based on all components, in the \`Money[paise=49950, currency=INR]\` format.
Rules and features to remember:
• A record is implicitly **\`final\`** and cannot extend another class (it already extends \`java.lang.Record\`), but it **can implement interfaces**.
• Records cannot declare additional instance fields; they can declare **static fields, static methods, instance methods and nested types**.
• The **compact canonical constructor** — written as \`public Money { ... }\` with no parameter list — runs before the fields are assigned and is the place for validation and normalisation. Reassigning a parameter there (\`currency = currency.toUpperCase();\`) changes what gets stored.
• You may override any generated method (we override \`toString\` below for a nicer format).
• **Shallow immutability**: the fields are final, but if a component is a mutable object (a \`List\`, a \`Date\`), its contents can still change. Use \`List.copyOf()\` in the compact constructor to defend against that.
• Records work beautifully with **pattern matching**: \`if (obj instanceof Money(long p, String c))\` (record patterns, final in Java 21, JEP 440) destructures them directly.
Use records for DTOs, request/response bodies, value objects, map keys, and multi-value returns from a method. Do not use them for JPA entities (which need mutable state and a no-arg constructor) or for anything that must change after creation.`,
      codeSnippet: `// Money.java — requires Java 16 or later
import java.util.List;

public record Money(long paise, String currency) {

    // Compact canonical constructor: validation + normalisation, no parameter list
    public Money {
        if (paise < 0) throw new IllegalArgumentException("Amount cannot be negative");
        if (currency == null || currency.length() != 3) {
            throw new IllegalArgumentException("Currency must be a 3-letter code");
        }
        currency = currency.toUpperCase();          // normalised value is what gets stored
    }

    // Static factory method
    public static Money rupees(double amount) {
        return new Money(Math.round(amount * 100), "INR");
    }

    // Records can have behaviour; every operation returns a NEW record (immutability)
    public Money plus(Money other) {
        if (!currency.equals(other.currency)) {
            throw new IllegalArgumentException("Currency mismatch: " + currency + " vs " + other.currency);
        }
        return new Money(paise + other.paise, currency);
    }

    @Override
    public String toString() {                      // overriding a generated method
        return String.format("%s %d.%02d", currency, paise / 100, paise % 100);
    }

    public static void main(String[] args) {
        Money fee = Money.rupees(499.50);
        Money gst = Money.rupees(89.91);
        Money total = fee.plus(gst);

        System.out.println(fee.paise());                      // 49950  (accessor: paise(), not getPaise())
        System.out.println(fee.currency());                   // INR
        System.out.println(total);                            // INR 589.41
        System.out.println(fee.equals(Money.rupees(499.50))); // true — value-based equality
        System.out.println(new Money(100, "inr"));            // INR 1.00  (normalised to upper case)
        System.out.println(List.of(fee, gst));                // [INR 499.50, INR 89.91]

        // fee.paise = 10;                // COMPILE ERROR: record components are final
        // new Money(-5, "INR");          // IllegalArgumentException
    }
}`
    },
    {
      heading: "12. Packages and Imports in Java: Organising Classes",
      content: `A **package** is a named group of related classes, and it is also a **directory** on disk. Packages solve two problems: they prevent **name clashes** (your \`Product\` and a library's \`Product\` can coexist) and they give you the package-private access level from Section 5 to keep internal classes internal.
Conventions and rules:
• Package names are all lowercase and use **reverse domain notation** to be globally unique: \`com.ravindra.shop.model\`. Students without a domain commonly use \`com.example\` or \`in.<yourname>\`.
• The first statement of a source file is \`package com.ravindra.shop.model;\` and the file must sit at \`src/com/ravindra/shop/model/\` relative to the source root. Maven and Gradle use \`src/main/java\` as that root.
• A class with no \`package\` statement is in the **default package**. Avoid it for anything beyond a scratch file: classes in the default package cannot be imported from named packages.
• Typical layering in a Spring Boot project: \`controller\`, \`service\`, \`repository\`, \`model\` (or \`entity\`), \`dto\`, \`config\`. Interviewers ask about this as "how do you structure a project".
**Imports** let you refer to a class by its simple name instead of its fully qualified name:
• \`import com.ravindra.shop.model.Product;\` — single-type import, the preferred style.
• \`import java.util.*;\` — on-demand (wildcard) import of every class in the package. It has no runtime cost, but it hides where names come from and can cause ambiguity (\`java.util.Date\` vs \`java.sql.Date\`), so most style guides and IDE defaults prefer explicit imports.
• \`import static java.lang.Math.max;\` — a **static import** lets you call \`max(a, b)\` without the \`Math.\` prefix. Great for test assertions (\`assertEquals\`) and constants; use sparingly elsewhere.
• The package **\`java.lang\`** (\`String\`, \`System\`, \`Math\`, \`Integer\`, \`Object\`, \`Exception\`...) is imported automatically into every file.
• Classes in the **same package** need no import.
• When two classes share a simple name, import one and use the **fully qualified name** for the other.
• **Java 25 (JEP 511, final)** adds **module import declarations**: \`import module java.base;\` imports every package exported by that module in one line. It is convenient for scripts and teaching; established codebases still use explicit imports.
The example shows a two-package layout, every import style, and the exact \`javac\` / \`java\` commands, which is what you need when there is no IDE or build tool.`,
      codeSnippet: `// Directory layout (source root = src):
//   src/com/ravindra/shop/model/Product.java
//   src/com/ravindra/shop/App.java

// ---------- src/com/ravindra/shop/model/Product.java ----------
package com.ravindra.shop.model;

public class Product {
    private final String name;
    private final double price;

    public Product(String name, double price) {
        this.name = name;
        this.price = price;
    }

    public String getName()  { return name; }
    public double getPrice() { return price; }
}

// ---------- src/com/ravindra/shop/App.java ----------
package com.ravindra.shop;

import com.ravindra.shop.model.Product;   // single-type import from our own package
import java.util.ArrayList;               // from the JDK
import java.util.List;
import static java.lang.Math.max;         // static import: call max(...) directly
// java.lang.* (String, System, Math, Integer ...) is imported automatically

public class App {
    public static void main(String[] args) {
        List<Product> cart = new ArrayList<>();
        cart.add(new Product("Mechanical Keyboard", 3499));
        cart.add(new Product("Wireless Mouse", 1299));

        double highest = 0;
        for (Product p : cart) {
            highest = max(highest, p.getPrice());        // static import in action
        }
        System.out.println("Most expensive item: Rs " + highest);   // Rs 3499.0

        // Fully qualified name: no import needed, useful when names clash
        java.time.LocalDate today = java.time.LocalDate.now();
        System.out.println("Cart created on " + today);
    }
}

// Compile and run from the project root (no IDE needed):
//   javac -d out src/com/ravindra/shop/model/Product.java src/com/ravindra/shop/App.java
//   java -cp out com.ravindra.shop.App`
    },
    {
      heading: "13. Real-World Use Cases: How Classes, Encapsulation and Records Are Used in Production",
      content: `Everything in this lecture maps directly onto the code you will write or read in your first Java job.
**Domain entities with enforced rules.** In a banking or fintech backend, an \`Account\` class keeps \`balance\` private and exposes \`debit()\` and \`credit()\` that check limits, KYC status and daily caps. Because the invariant lives in one place, auditors and reviewers can verify it once. JPA/Hibernate entities in Spring Boot follow the same shape — private fields, a protected or public no-arg constructor for the framework, getters, and selective setters or business methods.
**DTOs and API payloads as records.** A Spring Boot controller method such as \`public OrderResponse create(@RequestBody OrderRequest req)\` almost always uses records for \`OrderRequest\` and \`OrderResponse\` today. Jackson serialises them to JSON and back using the canonical constructor and accessors, and the generated \`equals\`/\`toString\` make tests and logs readable. Records also make excellent **map keys** and **multi-value return types** (\`record Stats(long count, double average)\`).
**Static factories and constants.** Classes like \`LocalDate.of(2026, 10, 9)\`, \`List.of(...)\`, \`Optional.empty()\` use static factory methods instead of public constructors because the method name documents intent, the method can cache instances, and it can return a subtype. Application-wide constants (\`MAX_RETRY = 3\`, \`DEFAULT_CURRENCY = "INR"\`) are \`public static final\` fields, usually in the class that uses them or in a dedicated constants class.
**Constructor injection in Spring.** A \`@Service\` class declares its dependencies as \`private final\` fields and receives them through a single constructor. That is nothing more than the encapsulation plus constructor pattern from Sections 4 and 6, and it is why understanding constructors matters before you touch Spring.
**equals/hashCode in collections and caches.** A cache keyed by \`(userId, productId)\` only works if the key type implements \`equals\` and \`hashCode\` correctly — which is exactly why such keys are usually records. The same applies to \`Set<Employee>\` deduplication and to JPA entity identity.
**Packages as architecture.** The package layout (\`controller\`, \`service\`, \`repository\`, \`model\`, \`dto\`) plus package-private classes is how teams keep a module's internals from leaking across the codebase, and tools such as ArchUnit enforce the rules in CI.
The snippet shows a compact Spring-style service to make the connection concrete; you do not need Spring installed to read it.`,
      codeSnippet: `// A typical Spring Boot slice built only from this lecture's concepts.
// (Annotations are shown for context; the OOP structure is what matters.)

// dto/CreateOrderRequest.java — record as an API payload
package com.ravindra.shop.dto;

public record CreateOrderRequest(long customerId, String sku, int quantity) {
    public CreateOrderRequest {
        if (quantity <= 0) throw new IllegalArgumentException("quantity must be > 0");
    }
}

// dto/OrderResponse.java
package com.ravindra.shop.dto;

public record OrderResponse(long orderId, String status, long totalPaise) { }

// service/OrderService.java — encapsulated dependencies, constructor injection
package com.ravindra.shop.service;

import com.ravindra.shop.dto.CreateOrderRequest;
import com.ravindra.shop.dto.OrderResponse;

// @Service
public class OrderService {
    private static final long FREE_DELIVERY_ABOVE_PAISE = 49_900;   // Rs 499

    private final PriceCatalog catalog;          // private final: cannot be swapped later
    private final OrderRepository repository;

    public OrderService(PriceCatalog catalog, OrderRepository repository) {   // Spring calls this
        this.catalog = catalog;
        this.repository = repository;
    }

    public OrderResponse create(CreateOrderRequest req) {
        long unit = catalog.pricePaise(req.sku());
        long total = unit * req.quantity();
        if (total < FREE_DELIVERY_ABOVE_PAISE) total += 4_000;      // Rs 40 delivery fee
        long id = repository.save(req.customerId(), req.sku(), req.quantity(), total);
        return new OrderResponse(id, "CREATED", total);
    }
}

// Minimal collaborators so the example is self-contained
interface PriceCatalog  { long pricePaise(String sku); }
interface OrderRepository { long save(long customerId, String sku, int qty, long totalPaise); }`
    },
    {
      heading: "14. Common Mistakes with Java Classes, Constructors and Encapsulation and How to Fix Them",
      content: `These are the errors that show up again and again in student projects, code reviews and interview whiteboards. Each one has a clear fix.
**1. Confusing a reference copy with an object copy.** \`BankAccount b = a;\` does not clone anything; both variables point to one object. Fix: if you need an independent copy, write a copy constructor (\`new BankAccount(a)\`) or a \`copy()\` method; better still, make the class immutable so copies are unnecessary.
**2. Writing \`name = name;\` in a constructor.** Without \`this.\`, the parameter is assigned to itself and the field silently stays \`null\`. IDEs warn about this, but it still slips through. Fix: \`this.name = name;\`, or use a record.
**3. Removing the default constructor by accident.** You add \`Employee(String, double)\` and every \`new Employee()\` in the codebase (and in frameworks such as JPA and Jackson that need a no-arg constructor) stops compiling or fails at runtime. Fix: add an explicit no-arg constructor when something needs it.
**4. Public fields "because it is simpler".** The moment two places modify a public field with different assumptions, you have a bug nobody can find. Fix: private fields + validated methods; use records when the data is immutable.
**5. Overriding \`equals\` without \`hashCode\` (or vice versa).** \`HashSet\` and \`HashMap\` break silently — duplicates appear, lookups miss. Fix: always override both using the same fields, or use a record. Also use \`equals(Object)\` with the exact signature and \`@Override\`; \`equals(Pincode)\` is an overload, not an override, and \`HashSet\` will never call it.
**6. Returning internal mutable collections from getters.** \`return history;\` lets any caller corrupt your object. Fix: \`Collections.unmodifiableList(history)\` or \`List.copyOf(history)\`.
**7. Using static fields for per-request or per-user data.** A \`static String currentUser\` in a web application is shared by every thread — users see each other's data. Fix: keep per-object data in instance fields; keep static only for true constants or genuinely class-wide state.
**8. Calling instance members from \`main\` (or any static method).** "non-static variable cannot be referenced from a static context" is one of the first compiler errors every student meets. Fix: create an object (\`new App().run()\`) or make the member static if it genuinely does not depend on an object.
**9. Comparing objects with \`==\`.** \`==\` compares references; use \`.equals()\` for content, including Strings. Only compare with \`==\` for primitives, enums and \`null\` checks.
**10. Forgetting that record immutability is shallow.** A \`record Cart(List<Item> items)\` can still have items added by a caller who kept the original list. Fix: \`items = List.copyOf(items);\` in the compact constructor.
The snippet contrasts three of these mistakes with their corrected versions.`,
      codeSnippet: `// MistakesFixed.java
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class MistakesFixed {

    // Mistake 2 and 5: self-assignment, equals without hashCode, wrong equals signature
    static class BrokenUser {
        private String email;
        BrokenUser(String email) { email = email; }                 // BUG: assigns parameter to itself
        public boolean equals(BrokenUser o) { return email.equals(o.email); }   // BUG: overload, not override
    }

    static class User {
        private final String email;
        User(String email) { this.email = Objects.requireNonNull(email); }   // FIX: this.
        @Override public boolean equals(Object o) {                           // FIX: equals(Object)
            return o instanceof User u && email.equalsIgnoreCase(u.email);
        }
        @Override public int hashCode() { return email.toLowerCase().hashCode(); }  // FIX: paired
    }

    // Mistake 6 and 10: leaking a mutable list
    record Cart(List<String> items) {
        Cart { items = List.copyOf(items); }                       // FIX: defensive copy
    }

    public static void main(String[] args) {
        List<String> raw = new ArrayList<>(List.of("pen"));
        Cart cart = new Cart(raw);
        raw.add("hacked");                                           // does NOT affect cart
        System.out.println(cart.items());                            // [pen]

        System.out.println(new User("A@X.com").equals(new User("a@x.com")));   // true
    }
}`
    },
    {
      heading: "15. Frequently Asked Questions about Java Classes, Objects and Encapsulation",
      content: `**What is the difference between a class and an object in Java?**
A class is the blueprint written in source code: it declares the fields and methods. An object is a runtime instance created from that class with \`new\`, occupying memory on the heap and holding its own values for the fields. One class, many objects — \`Student\` is one class; Ananya and Rahul are two objects.
**What is encapsulation in Java and why is it important?**
Encapsulation is bundling data and the methods that operate on it into a class, while keeping the data private so it can only be changed through those methods. It lets the class enforce its own rules (a balance never goes negative), hides implementation details so they can change without breaking callers, and makes code easier to test and reason about.
**What is the difference between a constructor and a method in Java?**
A constructor has the same name as the class, has no return type, cannot be called directly, and runs automatically exactly once when \`new\` creates an object. A method has its own name and a return type, can be called any number of times on an existing object, and may be static.
**Can a constructor be private in Java?**
Yes. A private constructor prevents code outside the class from calling \`new\`. It is used for utility classes that should never be instantiated (\`Math\`), for the singleton pattern, and for classes that expose static factory methods (\`LocalDate.of(...)\`) instead of public constructors.
**What is the difference between static and non-static (instance) members in Java?**
Static members belong to the class: there is one copy shared by all objects, they exist from the moment the class is loaded, and they are accessed as \`ClassName.member\`. Instance members belong to each object: every \`new\` creates a fresh copy, and they are accessed through a reference. A static method cannot use \`this\` or touch instance members directly.
**Why should you override hashCode when you override equals in Java?**
Because hash-based collections (\`HashMap\`, \`HashSet\`) first use \`hashCode\` to pick a bucket and only then call \`equals\` within that bucket. If two equal objects produce different hash codes they land in different buckets and the collection treats them as different, causing duplicate entries and failed lookups. The contract in \`Object\` requires equal objects to have equal hash codes.
**When should I use a record instead of a class in Java?**
Use a record when the type is just a transparent, immutable carrier of values: DTOs, API request/response bodies, value objects such as money or coordinates, map keys, and small multi-value results. Use a regular class when the object needs mutable state, hidden fields that are not part of its identity, inheritance from another class, or a framework such as JPA that requires a no-arg constructor and setters. Records require Java 16 or later.
**What is the default access modifier in Java?**
When you write no modifier at all, the member or class is package-private: visible to every class in the same package and invisible outside it. There is no keyword for it. Note that in interfaces, members are implicitly public, and in records the canonical constructor must be at least as accessible as the record itself.`
    },
    {
      heading: "16. Interview Questions and Answers on Java OOP: Classes, Constructors, static, equals and Records",
      content: `**Q1. What are the four pillars of OOP, and which one does encapsulation represent?**
The pillars are encapsulation, inheritance, polymorphism and abstraction. Encapsulation is bundling state and behaviour into a class and restricting direct access to the state (private fields, public methods). Inheritance reuses and extends a class, polymorphism lets one call behave differently depending on the runtime type, and abstraction hides complexity behind a simple interface — the next lecture covers those three.
**Q2. What happens if you write a parameterized constructor but no no-arg constructor?**
The compiler no longer generates the default no-arg constructor, so \`new ClassName()\` fails to compile and frameworks that instantiate the class reflectively (JPA, Jackson, many serialisation libraries) fail at runtime. The fix is to declare an explicit no-arg constructor if one is needed.
**Q3. Explain the \`this\` keyword and the \`this(...)\` call.**
\`this\` is a reference to the current object inside instance methods and constructors; it distinguishes a field from a same-named parameter, is passed to other methods, and is returned to enable method chaining. \`this(...)\` calls another constructor of the same class (constructor chaining). Before Java 25 it had to be the first statement; Java 25's Flexible Constructor Bodies (JEP 513) allow preliminary statements that do not reference \`this\`.
**Q4. Can a static method access an instance variable? Why or why not?**
No. A static method is invoked on the class without any specific object, so there is no \`this\` and no instance to read from. It can only use static members or data passed as parameters. To work with an instance, create one or receive it as an argument.
**Q5. In what order do a static block, an instance block, a field initialiser and a constructor execute?**
Static field initialisers and static blocks run once, in textual order, when the class is initialised. Then, for each \`new\`: fields get default values, instance field initialisers and instance blocks run in textual order, and finally the constructor body executes. With inheritance, the superclass completes its steps before the subclass.
**Q6. What is the contract between \`equals()\` and \`hashCode()\`?**
If \`a.equals(b)\` is true then \`a.hashCode() == b.hashCode()\` must be true. Unequal objects may share a hash code (a collision), but equal ones never may differ. Violating this breaks \`HashMap\` and \`HashSet\`. Both methods must use the same fields, and those fields should be effectively immutable.
**Q7. What is the difference between \`==\` and \`equals()\` for objects?**
\`==\` compares references: it is true only when both variables point to the same object in memory. \`equals()\` is a method that, when overridden, compares logical content. For Strings, \`"a" == "a"\` can be true only because of the string pool; always use \`equals\` for content comparison.
**Q8. What does the compiler generate for a record, and what can a record not do?**
For \`record Point(int x, int y)\` it generates private final fields, a canonical constructor, accessors \`x()\` and \`y()\`, and \`equals\`, \`hashCode\` and \`toString\` based on all components. A record is implicitly final, cannot extend a class, cannot declare extra instance fields, and its components cannot be reassigned after construction. It can implement interfaces, declare static members and instance methods, and use a compact constructor for validation. Records became final in Java 16.
**Q9. Why are getters and setters preferred over public fields, if a setter just assigns the value anyway?**
Because the setter is a seam: tomorrow it can add validation, logging, change notification or lazy computation without changing a single caller, whereas switching from a public field to a method breaks every caller. Frameworks also rely on the JavaBeans naming convention to discover properties reflectively. That said, a setter that will never do anything is a smell; consider dropping it and making the field final.
**Q10. Is \`finalize()\` a good place to release resources?**
No. \`Object.finalize()\` has been deprecated since Java 9 and marked for removal in Java 18 (JEP 421); it may run late or never, and it slows garbage collection. Implement \`AutoCloseable\` and release resources in \`close()\` via try-with-resources; use \`java.lang.ref.Cleaner\` only as a last-resort safety net.`
    },
    {
      heading: "17. Hands-On Exercise: Build a Library Management Mini-System with Classes, Records and Encapsulation",
      content: `Time to combine everything. You will build a small library system in a single file so it compiles with plain \`javac\` and runs with \`java\` on Java 17, 21 or 25. The program uses:
• A **record** \`Member\` with a compact constructor for validation and the generated \`equals\`/\`toString\`.
• A **class** \`Book\` with private fields, two overloaded constructors chained with \`this(...)\`, a static ID counter and a public constant, getters without setters, intention-revealing methods \`lendTo()\` and \`returnBook()\`, and \`equals\`/\`hashCode\`/\`toString\` based on the ISBN (two copies with the same ISBN are "the same book" for the catalogue).
• A **class** \`Library\` that encapsulates a list of books, exposes a read-only view of it, and uses \`contains()\` — which internally calls \`Book.equals\` — to reject duplicate ISBNs.
• A \`main\` class that exercises the whole thing and prints the expected output.
Save the code as \`LibraryApp.java\` (only \`LibraryApp\` is public, so the file is named after it), then run:
1. \`javac LibraryApp.java\`
2. \`java LibraryApp\`
Compare your output with the comment at the bottom. Observe one subtle point: the duplicate \`Effective Java (copy)\` was rejected by the library, but it was still **constructed**, so the static counter advanced to 3 and the next book got ID 4. That is the difference between creating an object and storing it.
**Extend it yourself (recommended):**
• Add a \`returnBook(String title)\` method to \`Library\` and a test for lending the same book twice after a return.
• Add a \`Loan\` record with \`book\`, \`member\` and \`dueDate\` (\`java.time.LocalDate\`), and a method \`overdueLoans(LocalDate today)\`.
• Move each type into its own file under a package \`in.library\` and compile with \`javac -d out\`.
• Make \`Book.equals\` compare both ISBN and title and watch the duplicate check change.`,
      codeSnippet: `// LibraryApp.java   —   compile: javac LibraryApp.java     run: java LibraryApp
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

// 1. Record: immutable data carrier with validation
record Member(int id, String name, String city) {
    Member {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Member name is required");
        }
    }
}

// 2. Class: encapsulation, overloaded constructors, static members, equals/hashCode/toString
class Book {
    private static int nextId = 1;                     // shared counter
    public static final int MAX_LOAN_DAYS = 14;        // constant

    private final int id;
    private final String isbn;
    private final String title;
    private final String author;
    private boolean available = true;
    private Member borrowedBy;                         // null while on the shelf

    Book(String isbn, String title, String author) {
        this.id = nextId++;
        this.isbn = Objects.requireNonNull(isbn, "isbn");
        this.title = Objects.requireNonNull(title, "title");
        this.author = (author == null) ? "Unknown" : author;
    }

    Book(String isbn, String title) {                  // overloaded, chained
        this(isbn, title, null);
    }

    int getId()              { return id; }
    String getIsbn()         { return isbn; }
    String getTitle()        { return title; }
    String getAuthor()       { return author; }
    boolean isAvailable()    { return available; }
    Member getBorrowedBy()   { return borrowedBy; }

    void lendTo(Member member) {                       // intention-revealing, enforces the rule
        if (!available) {
            throw new IllegalStateException(title + " is already borrowed by " + borrowedBy.name());
        }
        this.available = false;
        this.borrowedBy = member;
    }

    void returnBook() {
        this.available = true;
        this.borrowedBy = null;
    }

    static int totalBooksCreated() {
        return nextId - 1;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Book other)) return false;
        return isbn.equals(other.isbn);                // identity of a book = its ISBN
    }

    @Override
    public int hashCode() {
        return isbn.hashCode();
    }

    @Override
    public String toString() {
        String state = available ? "[available]" : "[with " + borrowedBy.name() + "]";
        return "#" + id + " " + title + " by " + author + " " + state;
    }
}

// 3. Class that owns a collection and exposes only a read-only view
class Library {
    private final String name;
    private final List<Book> books = new ArrayList<>();

    Library(String name) {
        this.name = name;
    }

    void addBook(Book book) {
        if (books.contains(book)) {                    // contains() uses Book.equals -> same ISBN
            System.out.println("Duplicate ISBN ignored: " + book.getIsbn());
            return;
        }
        books.add(book);
    }

    Book findByTitle(String title) {
        for (Book b : books) {
            if (b.getTitle().equalsIgnoreCase(title)) return b;
        }
        return null;
    }

    void issue(String title, Member member) {
        Book book = findByTitle(title);
        if (book == null) {
            System.out.println("No such book: " + title);
            return;
        }
        try {
            book.lendTo(member);
            System.out.println(member.name() + " borrowed " + book.getTitle()
                    + " for " + Book.MAX_LOAN_DAYS + " days");
        } catch (IllegalStateException e) {
            System.out.println("Cannot issue: " + e.getMessage());
        }
    }

    List<Book> getBooks() {
        return Collections.unmodifiableList(books);    // callers cannot add or remove
    }

    void printCatalogue() {
        System.out.println("--- " + name + " catalogue ---");
        for (Book b : books) {
            System.out.println(b);                     // uses Book.toString()
        }
    }
}

// 4. Entry point
public class LibraryApp {
    public static void main(String[] args) {
        Library lib = new Library("Jaipur City Library");
        lib.addBook(new Book("978-0134685991", "Effective Java", "Joshua Bloch"));
        lib.addBook(new Book("978-0596009205", "Head First Java", "Kathy Sierra"));
        lib.addBook(new Book("978-0134685991", "Effective Java (copy)"));   // duplicate ISBN
        lib.addBook(new Book("978-1234567890", "Java Programming Basics"));  // author unknown

        Member asha = new Member(1, "Asha Reddy", "Hyderabad");
        Member dev  = new Member(2, "Dev Malhotra", "Delhi");

        lib.issue("Effective Java", asha);
        lib.issue("effective java", dev);              // already borrowed
        lib.issue("Clean Code", dev);                  // not in the library
        lib.printCatalogue();

        System.out.println("Books created so far: " + Book.totalBooksCreated());
        System.out.println(asha);                      // record's generated toString
        System.out.println(asha.equals(new Member(1, "Asha Reddy", "Hyderabad")));   // true
        System.out.println(lib.getBooks().size());     // 3

        // lib.getBooks().add(new Book("x", "y"));     // UnsupportedOperationException
        // new Member(3, "  ", "Pune");                // IllegalArgumentException
    }
}
/* Expected output:
Duplicate ISBN ignored: 978-0134685991
Asha Reddy borrowed Effective Java for 14 days
Cannot issue: Effective Java is already borrowed by Asha Reddy
No such book: Clean Code
--- Jaipur City Library catalogue ---
#1 Effective Java by Joshua Bloch [with Asha Reddy]
#2 Head First Java by Kathy Sierra [available]
#4 Java Programming Basics by Unknown [available]
Books created so far: 4
Member[id=1, name=Asha Reddy, city=Hyderabad]
true
3
*/`
    },
    {
      heading: "18. Summary",
      content: `• A **class** is a blueprint; an **object** is an instance created with \`new\`. Variables hold **references**, so assigning one variable to another shares the same object.
• **Fields** get default values (0, false, null); **local variables** do not. Methods bundle behaviour with the data it operates on.
• **Constructors** run once per object, can be **overloaded**, and chain with \`this(...)\`. Writing any constructor removes the free default one. Java 25 (JEP 513) allows validation statements before \`this(...)\`/\`super(...)\`.
• **\`this\`** refers to the current object: disambiguate fields, chain constructors, pass or return the object.
• **Access modifiers**: \`private\` (class), package-private (package), \`protected\` (package + subclasses), \`public\` (everyone). Start private and widen only when needed.
• **Encapsulation**: private fields, validated intention-revealing methods, no setters for immutable properties, defensive copies for mutable internals.
• **\`static\`** members belong to the class, exist once, and cannot use \`this\`. Use for constants, counters and pure utility methods — not for per-user state.
• **Initialisation order**: static initialisers once per class, then default values, instance initialisers in textual order, then the constructor body.
• **Object lifecycle**: created on the heap, alive while reachable, reclaimed by the garbage collector. Release resources with \`AutoCloseable\` + try-with-resources, never \`finalize()\` (deprecated for removal since Java 18).
• Override **\`toString\`** for readable output and **\`equals\` + \`hashCode\` together**, using the same immutable fields, so hash collections work.
• **Records** (final in Java 16) generate the constructor, accessors, \`equals\`, \`hashCode\` and \`toString\` for immutable data carriers; validate in the compact constructor; remember immutability is shallow.
• **Packages** are directories in reverse-domain naming; **imports** bring simple names into scope; \`java.lang\` is automatic; Java 25 adds \`import module\` (JEP 511).
**Next lecture:** Object-Oriented Programming Part 2 — Inheritance, Polymorphism, Abstraction & Interfaces`
    }
  ]
};
