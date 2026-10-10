export const lecture06 = {
  slug: "lecture-6",
  number: 6,
  title: "Complete Java Course — Lecture 6: Object-Oriented Programming Part 2 — Inheritance, Polymorphism, Abstraction & Interfaces",
  summary: "Master Java inheritance, super, method overriding, runtime polymorphism and dynamic dispatch, abstract classes, interfaces with default, static and private methods, sealed classes (Java 17), composition over inheritance and SOLID principles, with interview questions and a hands-on payroll project.",
  readTime: "55 min read",
  difficulty: "Intermediate",
  date: "2026-10-09",
  sections: [
    {
      heading: "1. Introduction: Why Inheritance, Polymorphism, Abstraction and Interfaces Matter in Java",
      content: `In Lecture 5 you learned the first two pillars of object-oriented programming in Java: **classes and objects** (modelling real things as types) and **encapsulation** (hiding fields behind methods so an object controls its own state). This lecture covers the remaining pillars — **inheritance**, **polymorphism** and **abstraction** — plus the Java-specific tools that make them practical: \`super\`, \`@Override\`, abstract classes, interfaces, \`final\` and the modern **sealed** hierarchies introduced in Java 17.
Why does this matter beyond passing an exam? Almost every Java framework you will use in a job is built on these ideas:
• **Spring** injects an implementation of an **interface** (\`UserRepository\`, \`PaymentGateway\`) into your service, so you can swap a real database for a mock in tests. That is polymorphism.
• **JDBC** is nothing but interfaces (\`Connection\`, \`Statement\`, \`ResultSet\`); the MySQL or PostgreSQL driver supplies the concrete classes at runtime. That is abstraction.
• **Servlets, JUnit, Android** all ask you to extend a base class or implement an interface and override a few methods. That is inheritance with method overriding.
• **Domain models** such as \`Payment\` with \`UpiPayment\`, \`CardPayment\` and \`NetBankingPayment\` are expressed as sealed hierarchies in modern codebases and matched exhaustively with \`switch\`.
Interviewers for Java developer roles in India ask about these topics in nearly every round: "What is the difference between an abstract class and an interface?", "What is dynamic method dispatch?", "Why is composition preferred over inheritance?", "What are sealed classes?" By the end of this lecture you will be able to answer each one with a code example, and you will build a complete payroll system that uses every concept.
**Version note:** everything here is final, non-preview behaviour. Default and static interface methods arrived in **Java 8**, private interface methods in **Java 9**, pattern matching for \`instanceof\` in **Java 16**, sealed classes in **Java 17**, and pattern matching for \`switch\` plus record patterns in **Java 21**. Java 25 (September 2025) is the current LTS; Java 21 is the previous LTS. The examples compile on both.`
    },
    {
      heading: "2. Inheritance in Java: extends, the IS-A Relationship and What Gets Inherited",
      content: `**Inheritance** lets one class (the **subclass** or child) reuse and extend the fields and methods of another class (the **superclass** or parent). You declare it with the \`extends\` keyword. The subclass automatically receives every non-private member of its parent and can add its own members or change the behaviour of inherited methods.
The rule for deciding whether to use inheritance is the **IS-A test**: a \`SavingsAccount\` IS-A \`BankAccount\`, a \`Car\` IS-A \`Vehicle\`. If the sentence sounds wrong ("a \`Car\` IS-A \`Engine\`"), you want composition (HAS-A), which we cover in section 12.
What exactly is inherited?
• **public and protected** fields and methods — always inherited.
• **package-private** (no modifier) members — inherited only if the subclass is in the same package.
• **private** members — NOT inherited. The subclass object still contains the private field in memory (the parent's constructor initialises it), but the subclass code cannot name it directly; it must use the parent's getters or protected methods.
• **Constructors** — never inherited. Each class declares its own constructors, and the subclass must call a parent constructor (section 3).
• **static** members — accessible through the subclass name, but they belong to the class, not to the object, and they are not polymorphic (section 5).
Java supports **single inheritance of classes**: a class can extend exactly one class. This avoids the ambiguity of the "diamond problem" (section 8). Every class that does not declare \`extends\` implicitly extends \`java.lang.Object\`, which is why every object has \`toString()\`, \`equals()\`, \`hashCode()\` and \`getClass()\`.
Inheritance can be multi-level (\`Object\` → \`Vehicle\` → \`Car\` → \`ElectricCar\`) and hierarchical (one parent, many children), but keep hierarchies shallow — more than three levels usually signals a design that should use composition instead.
The \`protected\` modifier exists specifically for inheritance: a protected member is visible inside the same package and inside any subclass, even in another package. Use it for fields or helper methods that subclasses legitimately need but external callers should not touch.`,
      codeSnippet: `// File: InheritanceDemo.java — a small hierarchy with single and multi-level inheritance
class Vehicle {
    private String registrationNumber;   // NOT inherited (private)
    protected int wheels;                // inherited, visible to subclasses
    public String brand;                 // inherited

    public Vehicle(String registrationNumber, String brand, int wheels) {
        this.registrationNumber = registrationNumber;
        this.brand = brand;
        this.wheels = wheels;
    }

    public String getRegistrationNumber() {   // subclasses reach the private field via this
        return registrationNumber;
    }

    public void start() {
        System.out.println(brand + " (" + registrationNumber + ") started");
    }
}

class Car extends Vehicle {               // Car IS-A Vehicle
    private int seats;

    public Car(String reg, String brand, int seats) {
        super(reg, brand, 4);             // must call the parent constructor first
        this.seats = seats;
    }

    public void openBoot() {
        // wheels is accessible because it is protected; registrationNumber is not
        System.out.println(brand + " with " + wheels + " wheels and " + seats + " seats: boot opened");
    }
}

class ElectricCar extends Car {           // multi-level: ElectricCar -> Car -> Vehicle -> Object
    private int batteryKwh;

    public ElectricCar(String reg, String brand, int seats, int batteryKwh) {
        super(reg, brand, seats);
        this.batteryKwh = batteryKwh;
    }

    public void charge() {
        System.out.println("Charging " + batteryKwh + " kWh battery of " + getRegistrationNumber());
    }
}

public class InheritanceDemo {
    public static void main(String[] args) {
        ElectricCar nexon = new ElectricCar("MH12AB1234", "Tata Nexon EV", 5, 40);
        nexon.start();        // inherited from Vehicle
        nexon.openBoot();     // inherited from Car
        nexon.charge();       // its own method
        System.out.println(nexon instanceof Vehicle);   // true
    }
}
// Output:
// Tata Nexon EV (MH12AB1234) started
// Tata Nexon EV with 4 wheels and 5 seats: boot opened
// Charging 40 kWh battery of MH12AB1234
// true`
    },
    {
      heading: "3. The super Keyword and Constructor Chaining in Java Inheritance",
      content: `The keyword \`super\` is a reference to the **parent part** of the current object. It has three uses:
• **\`super(args)\`** — call a parent constructor. This must be the first statement of the subclass constructor (with one modern exception described below). If you do not write it, the compiler inserts \`super()\` with no arguments automatically. If the parent has no no-argument constructor, you get the classic compile error "constructor Vehicle in class Vehicle cannot be applied to given types".
• **\`super.method()\`** — call the parent's version of a method you have overridden. This is how you *extend* behaviour instead of replacing it, e.g. a subclass \`toString()\` that reuses the parent's \`toString()\` and appends its own fields.
• **\`super.field\`** — access a parent field hidden by a subclass field with the same name. Field hiding is poor practice; rename the field instead, but you should recognise the syntax in interviews.
**Constructor chaining** is the sequence in which constructors execute when you create an object. For \`new ElectricCar(...)\`, Java runs \`Object()\` → \`Vehicle(...)\` → \`Car(...)\` → \`ElectricCar(...)\`. The parent is always fully initialised before the child's constructor body runs. This guarantees that the inherited fields are in a valid state when the child uses them.
**Java 25 update — Flexible Constructor Bodies (JEP 513, final in Java 25):** you may now place statements *before* \`super(...)\` as long as they do not reference \`this\` (for example validating arguments or computing a value to pass to the parent). Before Java 25 any statement before \`super()\` was a compile error. On Java 21 you still need the old workaround of a static helper method. Label this correctly in interviews: it is a Java 25 feature, not a Java 21 one.
A related and important pitfall: **never call an overridable method from a constructor**. During \`Vehicle\`'s constructor the \`Car\` part of the object is not initialised yet, so if \`Vehicle\`'s constructor calls a method that \`Car\` overrides and that method reads a \`Car\` field, it sees \`null\` or \`0\`. We revisit this in Common Mistakes.`,
      codeSnippet: `// File: SuperDemo.java — super(), super.method() and the order of constructor execution
class BankAccount {
    protected String holder;
    protected double balance;

    public BankAccount(String holder, double openingBalance) {
        System.out.println("1. BankAccount constructor");
        this.holder = holder;
        this.balance = openingBalance;
    }

    public void withdraw(double amount) {
        if (amount > balance) throw new IllegalStateException("Insufficient balance");
        balance -= amount;
        System.out.println("Withdrew Rs." + amount + ", balance Rs." + balance);
    }

    @Override
    public String toString() {
        return "Account[holder=" + holder + ", balance=" + balance + "]";
    }
}

class SavingsAccount extends BankAccount {
    private final double minimumBalance;

    public SavingsAccount(String holder, double openingBalance, double minimumBalance) {
        super(holder, openingBalance);          // explicit parent call (must come first on Java 21)
        System.out.println("2. SavingsAccount constructor");
        this.minimumBalance = minimumBalance;
    }

    @Override
    public void withdraw(double amount) {
        if (balance - amount < minimumBalance) {
            throw new IllegalStateException("Minimum balance Rs." + minimumBalance + " must be maintained");
        }
        super.withdraw(amount);                 // reuse the parent's logic after the extra check
    }

    @Override
    public String toString() {
        return super.toString() + " Savings[minBalance=" + minimumBalance + "]";
    }
}

public class SuperDemo {
    public static void main(String[] args) {
        SavingsAccount acc = new SavingsAccount("Priya Sharma", 10000, 1000);
        acc.withdraw(5000);
        System.out.println(acc);
        try {
            acc.withdraw(4500);                 // would leave Rs.500, below minimum
        } catch (IllegalStateException e) {
            System.out.println("Error: " + e.getMessage());
        }
    }
}
// Output:
// 1. BankAccount constructor
// 2. SavingsAccount constructor
// Withdrew Rs.5000.0, balance Rs.5000.0
// Account[holder=Priya Sharma, balance=5000.0] Savings[minBalance=1000.0]
// Error: Minimum balance Rs.1000.0 must be maintained`
    },
    {
      heading: "4. Method Overriding in Java and the @Override Annotation",
      content: `**Method overriding** means a subclass provides its own implementation of a method that already exists in its superclass, using the **same name, same parameter list and a compatible return type**. When the method is called on an object, Java runs the *subclass* version even if the variable is declared with the parent type — this is the mechanism behind polymorphism (section 5).
The rules the compiler enforces for a valid override:
• **Signature must match exactly** — same method name and identical parameter types in the same order. Change a parameter type and you have created an *overload*, not an override (a classic interview trap).
• **Return type** must be the same or a subtype (**covariant return types**, since Java 5). \`Object clone()\` in the parent can become \`Car clone()\` in the child.
• **Access modifier cannot be more restrictive.** A \`public\` method cannot become \`protected\` in the subclass; a \`protected\` one may become \`public\`.
• **Checked exceptions** — the override may throw fewer or narrower checked exceptions, never broader or new ones. Unchecked exceptions are unrestricted.
• **\`final\` methods cannot be overridden**, \`static\` methods cannot be overridden (they are *hidden*), and \`private\` methods are invisible to the subclass so they cannot be overridden either.
• The override must not be \`static\` if the parent method is an instance method, and vice versa.
**\`@Override\`** is an annotation that tells the compiler "I intend this method to override a parent or interface method." It is optional for the JVM but you should treat it as mandatory, because it converts silent bugs into compile errors. If you type \`public boolean equals(Employee other)\` instead of \`equals(Object other)\`, without \`@Override\` Java quietly creates an overload and \`HashSet\` lookups break; with \`@Override\` the compiler refuses to build and shows exactly where you went wrong.
Overriding is also how you customise the methods inherited from \`Object\`: \`toString()\` for readable logs, \`equals()\` and \`hashCode()\` for correct behaviour in collections, and occasionally \`compareTo()\` from \`Comparable\`.`,
      codeSnippet: `// File: OverrideDemo.java — valid overrides, covariant return and the overload trap
class Shape {
    public double area() { return 0; }

    public Shape copy() { return new Shape(); }           // return type Shape

    @Override
    public String toString() { return getClass().getSimpleName() + " area=" + area(); }
}

class Circle extends Shape {
    private final double radius;
    public Circle(double radius) { this.radius = radius; }

    @Override
    public double area() { return Math.PI * radius * radius; }

    @Override
    public Circle copy() { return new Circle(radius); }   // covariant return: Circle is a Shape
}

class Rectangle extends Shape {
    private final double w, h;
    public Rectangle(double w, double h) { this.w = w; this.h = h; }

    @Override
    public double area() { return w * h; }

    // Uncomment to see the compiler protect you:
    // @Override
    // public double area(int precision) { return w * h; }   // error: method does not override
    //   -> without @Override this would silently be an OVERLOAD, and area() would still return 0
}

public class OverrideDemo {
    public static void main(String[] args) {
        Shape s = new Circle(7);          // parent-type variable, child object
        System.out.println(s);            // Circle area=153.93804002589985 (child's area() runs)
        Circle c = new Circle(2).copy();  // no cast needed thanks to covariant return
        System.out.println(c);            // Circle area=12.566370614359172
        System.out.println(new Rectangle(3, 4));   // Rectangle area=12.0
    }
}`
    },
    {
      heading: "5. Runtime Polymorphism and Dynamic Method Dispatch in Java",
      content: `**Polymorphism** ("many forms") means one reference type can point to objects of many concrete types, and the *same method call* behaves differently depending on the actual object. Java has two kinds:
• **Compile-time (static) polymorphism** — method **overloading**. The compiler picks the method based on the declared argument types. Resolved at compile time.
• **Runtime (dynamic) polymorphism** — method **overriding**. The JVM picks the method based on the *actual class of the object* at the moment of the call. This is called **dynamic method dispatch** (or late binding), and it is what people mean when they say "polymorphism" in OOP discussions.
How dynamic dispatch works under the hood: every class has a virtual method table (**vtable**) listing the implementation of each overridable method. When you write \`shape.area()\`, the bytecode instruction \`invokevirtual\` looks up \`area\` in the vtable of the *runtime* class of \`shape\`. If \`shape\` holds a \`Circle\`, the \`Circle\` slot points to \`Circle.area()\`. The JIT compiler optimises hot call sites with inline caches, so this costs almost nothing in practice.
Important consequences you must know:
• **Upcasting is implicit and always safe**: \`Shape s = new Circle(2);\` A \`Circle\` IS-A \`Shape\`.
• **Downcasting needs an explicit cast and can fail**: \`Circle c = (Circle) s;\` throws \`ClassCastException\` if \`s\` is actually a \`Rectangle\`. Guard it with \`instanceof\`. Since **Java 16**, pattern matching for \`instanceof\` lets you test and bind in one step: \`if (s instanceof Circle c) { c.radius(); }\`.
• **The declared type decides which methods you can call; the runtime type decides which implementation runs.** With \`Shape s = new Circle(2)\` you cannot call \`s.getRadius()\` even though the object has it — the compiler only knows \`Shape\`.
• **Fields are NOT polymorphic.** Field access is resolved by the declared type at compile time. If both parent and child declare \`String name\`, \`parentRef.name\` gives the parent's field. This is why you should never shadow fields.
• **Static methods are NOT polymorphic.** They are resolved by the declared type (method *hiding*). \`@Override\` on a static method is a compile error.
• **Private methods are NOT polymorphic.** A private method in the parent is invisible to the child, so a same-named private method in the child is unrelated.
The practical benefit is the ability to write code against the *abstraction* — \`List<Shape>\`, \`PaymentGateway\`, \`Repository\` — and add new concrete types later without touching that code. This is the **Open/Closed Principle** from SOLID (section 13).`,
      codeSnippet: `// File: DispatchDemo.java — dynamic dispatch, upcasting, downcasting and the non-polymorphic cases
import java.util.List;

class Employee {
    String role = "Employee";                                  // field (not polymorphic)
    static String company() { return "Generic Corp"; }         // static (hidden, not overridden)
    double monthlySalary() { return 30000; }                   // instance method (polymorphic)
}

class Manager extends Employee {
    String role = "Manager";                                   // hides the parent's field (bad practice, for demo)
    static String company() { return "Infosys"; }              // hides the parent's static method
    @Override double monthlySalary() { return 90000; }         // overrides
    void approveLeave() { System.out.println("Leave approved by manager"); }
}

public class DispatchDemo {
    public static void main(String[] args) {
        Employee e = new Manager();                            // upcasting: implicit

        System.out.println(e.monthlySalary());                 // 90000.0 -> runtime type (Manager) wins
        System.out.println(e.role);                            // Employee -> declared type wins for fields
        System.out.println(e.company());                       // Generic Corp -> declared type wins for statics

        // e.approveLeave();                                   // compile error: Employee has no approveLeave()

        if (e instanceof Manager m) {                          // Java 16+ pattern matching for instanceof
            m.approveLeave();                                  // safe downcast, bound to m
        }

        List<Employee> staff = List.of(new Employee(), new Manager(), new Employee());
        double payroll = 0;
        for (Employee emp : staff) {
            payroll += emp.monthlySalary();                    // each object picks its own implementation
        }
        System.out.println("Total payroll: Rs." + payroll);     // Total payroll: Rs.150000.0

        Employee plain = new Employee();
        try {
            Manager wrong = (Manager) plain;                   // compiles, but fails at runtime
        } catch (ClassCastException ex) {
            System.out.println("Cannot cast: " + ex.getMessage());
        }
    }
}`
    },
    {
      heading: "6. Abstract Classes and Abstract Methods in Java",
      content: `An **abstract class** is a class that cannot be instantiated and exists to be extended. It is declared with the \`abstract\` keyword and typically contains a mix of:
• **Abstract methods** — declared with \`abstract\` and no body (\`abstract double calculateSalary();\`). They form a contract: every concrete subclass *must* implement them or the subclass itself must be declared abstract.
• **Concrete methods** — ordinary methods with a body that all subclasses inherit, often implementing a shared algorithm that calls the abstract methods (the **Template Method** pattern).
• **Fields, constructors and state** — unlike interfaces, abstract classes can hold instance fields with any access modifier and define constructors that subclasses invoke via \`super(...)\`.
When should you reach for an abstract class? When several closely related classes share **common state and partial implementation** and you want to force them to fill in specific gaps. Examples: \`Employee\` with \`calculateSalary()\` filled in differently by \`FullTimeEmployee\` and \`Contractor\`; \`HttpServlet\` in Jakarta EE, which handles the request lifecycle and asks you to override \`doGet\`/\`doPost\`; \`AbstractList\` in the JDK, which implements iteration, \`contains\`, \`indexOf\` and more on top of just two abstract methods, \`get(int)\` and \`size()\`.
Rules to remember:
• A class with at least one abstract method must be declared abstract; the reverse is not required — an abstract class may have zero abstract methods (useful purely to block instantiation).
• Abstract methods cannot be \`private\`, \`static\` or \`final\` — each of those contradicts "must be overridden by a subclass".
• You *can* declare a variable of the abstract type (\`Employee e = new Contractor(...)\`) — you just cannot write \`new Employee()\`.
• Abstract classes can have \`main\` and static methods, and can implement interfaces without implementing all their methods (the burden passes to concrete subclasses).
The abstract class gives you a place to put shared logic once. Compare this with an interface, which (before default methods) could only *declare* behaviour. Section 9 gives a full comparison and decision guide.`,
      codeSnippet: `// File: AbstractDemo.java — Template Method: the abstract class owns the algorithm, subclasses fill the gaps
abstract class Employee {
    private final String name;
    private final String employeeId;

    protected Employee(String name, String employeeId) {   // constructor runs via super() from subclasses
        this.name = name;
        this.employeeId = employeeId;
    }

    public String getName() { return name; }

    // Abstract: each employee type computes gross pay differently
    public abstract double grossMonthlyPay();

    // Concrete + shared: tax logic is the same for everyone
    public double taxDeducted() {
        double gross = grossMonthlyPay();
        return gross > 100000 ? gross * 0.30 : gross > 50000 ? gross * 0.20 : gross * 0.05;
    }

    // Template method: fixed sequence, variable steps
    public final String payslip() {
        double gross = grossMonthlyPay();
        double tax = taxDeducted();
        return String.format("%s (%s): gross Rs.%.2f, tax Rs.%.2f, net Rs.%.2f",
                name, employeeId, gross, tax, gross - tax);
    }
}

class FullTimeEmployee extends Employee {
    private final double annualCtc;
    public FullTimeEmployee(String name, String id, double annualCtc) {
        super(name, id);
        this.annualCtc = annualCtc;
    }
    @Override
    public double grossMonthlyPay() { return annualCtc / 12; }
}

class Contractor extends Employee {
    private final double hourlyRate;
    private final int hoursThisMonth;
    public Contractor(String name, String id, double hourlyRate, int hours) {
        super(name, id);
        this.hourlyRate = hourlyRate;
        this.hoursThisMonth = hours;
    }
    @Override
    public double grossMonthlyPay() { return hourlyRate * hoursThisMonth; }
}

public class AbstractDemo {
    public static void main(String[] args) {
        // Employee e = new Employee("x", "y");   // compile error: Employee is abstract; cannot be instantiated
        Employee a = new FullTimeEmployee("Rahul Verma", "E101", 1200000);
        Employee b = new Contractor("Anjali Nair", "C202", 1500, 160);
        System.out.println(a.payslip());
        System.out.println(b.payslip());
    }
}
// Output:
// Rahul Verma (E101): gross Rs.100000.00, tax Rs.20000.00, net Rs.80000.00
// Anjali Nair (C202): gross Rs.240000.00, tax Rs.72000.00, net Rs.168000.00`
    },
    {
      heading: "7. Java Interfaces: Abstract, Default, Static and Private Methods",
      content: `An **interface** is a pure contract: it names the methods a type promises to provide, without saying how. A class **implements** an interface with the \`implements\` keyword and must supply bodies for all its abstract methods. Since a class can implement *many* interfaces, they are Java's mechanism for giving an object several capabilities (\`Comparable\`, \`Serializable\`, \`Runnable\`, \`AutoCloseable\`) regardless of its class hierarchy.
Over the years interfaces gained more member kinds. Know which Java version added each — interviewers ask:
• **Abstract methods** (Java 1.0) — implicitly \`public abstract\`. Writing \`public\` is redundant; writing \`private\` or \`protected\` is an error.
• **Constants** (Java 1.0) — any field is implicitly \`public static final\`. Interfaces cannot have instance state.
• **Default methods** (**Java 8**) — \`default void log(String msg) { ... }\` gives a method body inside the interface. Implementing classes inherit it and may override it. They were introduced so the JDK could add \`forEach\` and \`stream()\` to \`Collection\` without breaking millions of existing implementations — the "interface evolution" problem.
• **Static methods** (**Java 8**) — utility methods that belong to the interface itself, e.g. \`Comparator.comparing(...)\`. They are called as \`InterfaceName.method()\`, are *not* inherited by implementing classes and cannot be overridden.
• **Private methods** (**Java 9**) — \`private\` and \`private static\` helpers that let default methods share code without exposing it as part of the public API.
• **Functional interfaces** — an interface with exactly one abstract method (\`Runnable\`, \`Comparator\`, \`Function\`) can be implemented with a lambda expression. Mark them with \`@FunctionalInterface\` so the compiler enforces the single-method rule. Lambdas are covered in detail in a later lecture.
A few constraints: an interface cannot declare constructors, cannot be instantiated, and a default method cannot override \`Object\` methods such as \`toString()\` or \`equals()\` (compile error) — the class's own \`Object\` methods always win. Interfaces can extend other interfaces (even multiple ones), and an interface that extends another inherits its abstract and default methods.
Interfaces are also the natural home for **constants** shared across a module, though many teams prefer an enum or a final class for that purpose to avoid "constant interface" anti-patterns.
Best practice: name interfaces after the capability (\`Payable\`, \`Notifiable\`, \`Exportable\`) or the role (\`UserRepository\`, \`PaymentGateway\`), and keep them small — a client should never be forced to implement methods it does not need (the Interface Segregation Principle, section 13).`,
      codeSnippet: `// File: InterfaceDemo.java — all four kinds of interface members
interface Notifiable {
    String contactAddress();                                    // abstract (public abstract implied)

    int MAX_RETRIES = 3;                                        // public static final implied

    default void notify(String message) {                       // Java 8 default method
        String formatted = formatMessage(message);              // calls a private helper
        System.out.println("Sending to " + contactAddress() + ": " + formatted);
    }

    default void notifyUrgent(String message) {
        notify("[URGENT] " + message);                          // defaults can call other defaults
    }

    static boolean isValidEmail(String email) {                 // Java 8 static method
        return email != null && email.contains("@") && email.endsWith(".com");
    }

    private String formatMessage(String message) {              // Java 9 private method
        return message.trim() + " (max retries " + MAX_RETRIES + ")";
    }
}

class Customer implements Notifiable {
    private final String email;
    Customer(String email) { this.email = email; }

    @Override
    public String contactAddress() { return email; }            // MUST be public in the class
}

class SmsCustomer implements Notifiable {
    private final String phone;
    SmsCustomer(String phone) { this.phone = phone; }

    @Override
    public String contactAddress() { return "+91 " + phone; }

    @Override
    public void notify(String message) {                        // overriding a default method
        System.out.println("SMS to " + contactAddress() + ": " + message);
    }
}

public class InterfaceDemo {
    public static void main(String[] args) {
        Notifiable c1 = new Customer("rohit@example.com");
        Notifiable c2 = new SmsCustomer("9876543210");
        c1.notify("Your order #4512 has shipped");
        c2.notifyUrgent("OTP is 482913");
        System.out.println(Notifiable.isValidEmail("rohit@example.com"));   // true
        System.out.println(Notifiable.MAX_RETRIES);                         // 3

        Runnable task = () -> System.out.println("Lambda implementing a functional interface");
        task.run();
    }
}
// Output:
// Sending to rohit@example.com: Your order #4512 has shipped (max retries 3)
// SMS to +91 9876543210: [URGENT] OTP is 482913
// true
// 3
// Lambda implementing a functional interface`
    },
    {
      heading: "8. Multiple Inheritance in Java via Interfaces and the Diamond Problem",
      content: `Java deliberately forbids a class from extending more than one class. The reason is the **diamond problem**: if \`class D extends B, C\` and both \`B\` and \`C\` inherit from \`A\` and override the same method, which version should \`D\` get? Languages such as C++ allow this and need complicated rules; Java sidesteps it for classes entirely.
However, a class *can* implement **multiple interfaces**, and an interface can extend multiple interfaces. This is called **multiple inheritance of type** — one object can be treated as a \`Flyable\`, a \`Swimmable\` and a \`Comparable\` at the same time. Before Java 8 this created no ambiguity, because interfaces carried no implementation.
Default methods (Java 8) reintroduced a controlled form of the diamond problem, and Java resolves it with three clear rules:
• **Rule 1 — Classes win over interfaces.** If a superclass provides a concrete method with the same signature as an interface default, the superclass method is used. Interface defaults never override class methods.
• **Rule 2 — More specific interface wins.** If interface \`B extends A\` and both declare a default \`greet()\`, a class implementing \`B\` gets \`B.greet()\` because \`B\` is more specific.
• **Rule 3 — Otherwise, you must resolve it.** If two *unrelated* interfaces supply the same default method, the compiler reports "class X inherits unrelated defaults for greet() from types A and B". The class must override the method, and inside it may explicitly pick one with the special syntax \`A.super.greet()\`.
This is why default methods were designed to be "a little bit of implementation" and not a full replacement for abstract classes: they cannot hold state, and the conflict resolution forces the implementing class to make an explicit decision.
Two practical patterns that use multiple interfaces:
• **Mixins of capabilities** — a \`FileResource\` that is \`Readable\`, \`Writable\` and \`AutoCloseable\`. Callers that only need reading accept a \`Readable\`.
• **Marker interfaces** — interfaces with no methods, such as \`Serializable\` or \`Cloneable\`, that tag a class so frameworks or the JVM treat it specially. Today annotations usually replace markers, but you will meet them in legacy code and interviews.`,
      codeSnippet: `// File: DiamondDemo.java — the diamond problem with default methods and how Java resolves it
interface Vehicle {
    default String describe() { return "a vehicle"; }
}

interface Boat {
    default String describe() { return "a boat"; }
}

// Rule 3: two unrelated defaults -> must override or compile error
class AmphibiousCar implements Vehicle, Boat {
    @Override
    public String describe() {
        // choose one explicitly, or combine them
        return Vehicle.super.describe() + " that is also " + Boat.super.describe();
    }
}

// Rule 2: more specific interface wins
interface ElectricVehicle extends Vehicle {
    @Override
    default String describe() { return "an electric vehicle"; }
}
class Scooter implements Vehicle, ElectricVehicle { }     // gets ElectricVehicle.describe()

// Rule 1: class wins over interface
class Machine {
    public String describe() { return "a machine"; }
}
class Tractor extends Machine implements Vehicle { }       // gets Machine.describe()

public class DiamondDemo {
    public static void main(String[] args) {
        System.out.println(new AmphibiousCar().describe());   // a vehicle that is also a boat
        System.out.println(new Scooter().describe());         // an electric vehicle
        System.out.println(new Tractor().describe());         // a machine
    }
}`
    },
    {
      heading: "9. Abstract Class vs Interface in Java: Which One to Choose",
      content: `This is the single most common Java OOP interview question, and the answer has changed since Java 8. A precise comparison:
• **Methods** — an abstract class can have abstract, concrete, static, final and private methods with any access modifier. An interface can have abstract methods (implicitly public), default and static methods (Java 8), and private methods (Java 9). Interface methods can never be \`protected\` or \`final\`.
• **State** — an abstract class can declare instance fields (mutable, any modifier) and initialise them in a constructor. An interface can only declare \`public static final\` constants; it has no instance state and no constructors.
• **Inheritance** — a class extends exactly **one** abstract class but implements **any number** of interfaces.
• **Relationship** — an abstract class says "IS-A, and here is the shared skeleton" (\`Employee\`, \`Shape\`, \`HttpServlet\`). An interface says "CAN-DO" (\`Comparable\`, \`Runnable\`, \`Payable\`) or defines a **role** that many unrelated classes may play.
• **Evolution** — adding an abstract method to an abstract class or interface breaks all subclasses; adding a *default* method to an interface does not. Adding a concrete method to an abstract class does not break anything either.
• **Speed** — historically \`invokeinterface\` was slightly slower than \`invokevirtual\`; with modern JIT compilers the difference is negligible and must never drive the design decision.
A decision guide used in real teams:
1. Start with an **interface** for every public abstraction (\`PaymentGateway\`, \`OrderRepository\`). It keeps callers decoupled and makes mocking in tests trivial with Mockito.
2. If several implementations end up sharing fields and helper code, extract an **abstract base class** that implements the interface (\`AbstractPaymentGateway implements PaymentGateway\`). Callers still depend only on the interface. The JDK does exactly this: \`List\` (interface) → \`AbstractList\` (abstract class) → \`ArrayList\` (concrete).
3. Use an abstract class alone when the type is fundamentally a **hierarchy with shared state** and no one else will implement it (\`Employee\`, \`Account\`).
4. Consider a **sealed interface** (section 10) when the set of implementations is fixed and known, so \`switch\` can be exhaustive.
Framework examples to quote in interviews: Spring Data's \`JpaRepository\` is an interface you never implement by hand; \`java.util.TimerTask\` and \`InputStream\` are abstract classes because they carry state and partial behaviour; \`Comparable\` and \`Comparator\` are interfaces because any class, in any hierarchy, may want to be sortable.`,
      codeSnippet: `// File: InterfacePlusAbstractDemo.java — the JDK pattern: interface for callers, abstract class for implementers
import java.util.ArrayList;
import java.util.List;

interface PaymentGateway {                                   // callers depend on this
    boolean charge(String customerId, double amountInr);
    String name();
}

abstract class AbstractPaymentGateway implements PaymentGateway {   // shared plumbing for implementers
    private final List<String> auditLog = new ArrayList<>();          // state: not possible in an interface

    @Override
    public final boolean charge(String customerId, double amountInr) {
        if (amountInr <= 0) throw new IllegalArgumentException("Amount must be positive");
        boolean ok = doCharge(customerId, amountInr);                 // the varying step
        auditLog.add(name() + " charged " + customerId + " Rs." + amountInr + " -> " + (ok ? "OK" : "FAILED"));
        return ok;
    }

    protected abstract boolean doCharge(String customerId, double amountInr);

    public List<String> auditLog() { return List.copyOf(auditLog); }
}

class RazorpayGateway extends AbstractPaymentGateway {
    @Override protected boolean doCharge(String customerId, double amountInr) { return amountInr < 200000; }
    @Override public String name() { return "Razorpay"; }
}

class UpiGateway extends AbstractPaymentGateway {
    @Override protected boolean doCharge(String customerId, double amountInr) { return amountInr <= 100000; }
    @Override public String name() { return "UPI"; }
}

public class InterfacePlusAbstractDemo {
    static void checkout(PaymentGateway gateway, String customer, double amount) {   // depends on the interface only
        System.out.println(gateway.name() + ": " + (gateway.charge(customer, amount) ? "payment successful" : "declined"));
    }

    public static void main(String[] args) {
        RazorpayGateway rp = new RazorpayGateway();
        checkout(rp, "CUST-77", 150000);
        checkout(new UpiGateway(), "CUST-77", 150000);
        System.out.println(rp.auditLog());
    }
}
// Output:
// Razorpay: payment successful
// UPI: declined
// [Razorpay charged CUST-77 Rs.150000.0 -> OK]`
    },
    {
      heading: "10. final Classes, final Methods and Sealed Classes & Interfaces (Java 17)",
      content: `Inheritance is powerful, so Java gives you three ways to *limit* it. Choosing the right limit is part of good API design.
**\`final\` methods** cannot be overridden. Use them when a method implements an invariant that subclasses must not break — e.g. the \`payslip()\` template method in section 6, or security checks. The JIT can also inline them aggressively.
**\`final\` classes** cannot be extended at all. \`String\`, \`Integer\`, \`LocalDate\` and every **record** are final. Reasons to make a class final: guaranteeing immutability (a subclass could otherwise add mutable state or override \`equals\`), security (no one can subclass \`String\` to bypass checks), and signalling that the class was not designed for extension. Joshua Bloch's rule from *Effective Java*: "Design and document for inheritance, or else prohibit it."
**\`final\` variables** are different: they just cannot be reassigned. A \`final\` reference to a \`List\` can still have elements added.
**Sealed classes and interfaces (JEP 409, final in Java 17)** sit between "anyone can extend" and "no one can extend": the class or interface lists exactly which types may extend it with the \`permits\` clause. Every permitted subclass must then declare itself as one of:
• **\`final\`** — the hierarchy stops here.
• **\`sealed\`** — it has its own \`permits\` list, continuing the closed tree.
• **\`non-sealed\`** — it reopens the hierarchy; anyone may extend this one branch.
Additional rules: permitted subclasses must be in the same module (or the same package if you are not using modules), and if the subclasses are declared in the same source file as the sealed type you may omit \`permits\` — the compiler infers it. Records can implement sealed interfaces and are implicitly final, which makes **sealed interface + records** the idiomatic way to model algebraic data types ("a \`Payment\` is a \`Upi\` OR a \`Card\` OR a \`NetBanking\`").
The real payoff arrives with **pattern matching for \`switch\` (JEP 441, final in Java 21)**: because the compiler knows every permitted subtype, a \`switch\` over a sealed type can be **exhaustive without a \`default\` branch**. If a teammate adds a fourth payment type next year, every such \`switch\` fails to compile until it is updated — the compiler finds the missing case for you. Combine this with **record patterns (JEP 440, Java 21)** to destructure fields directly in the \`case\` label. You can use the reflection method \`Class.isSealed()\` and \`getPermittedSubclasses()\` to inspect a sealed hierarchy at runtime.`,
      codeSnippet: `// File: SealedDemo.java — sealed interface + records + exhaustive switch (Java 21+)
sealed interface Payment permits UpiPayment, CardPayment, NetBankingPayment, WalletPayment { }

record UpiPayment(String vpa, double amount) implements Payment { }              // records are implicitly final
record CardPayment(String last4, double amount, boolean international) implements Payment { }
record NetBankingPayment(String bankCode, double amount) implements Payment { }

non-sealed class WalletPayment implements Payment {                               // this branch is open again
    private final double amount;
    WalletPayment(double amount) { this.amount = amount; }
    double amount() { return amount; }
}
class PaytmWalletPayment extends WalletPayment {                                  // allowed because WalletPayment is non-sealed
    PaytmWalletPayment(double amount) { super(amount); }
}

final class FeeCalculator {                                                       // final: not designed for extension
    static double fee(Payment p) {
        return switch (p) {                                                       // exhaustive: no default needed
            case UpiPayment u -> 0.0;
            case CardPayment c when c.international() -> c.amount() * 0.035;      // guard clause
            case CardPayment c -> c.amount() * 0.02;
            case NetBankingPayment(String bank, double amt) -> bank.equals("SBI") ? 5 : 10;  // record pattern
            case WalletPayment w -> w.amount() * 0.01;                            // covers PaytmWalletPayment too
        };
    }
}

public class SealedDemo {
    public static void main(String[] args) {
        Payment[] payments = {
            new UpiPayment("ravi@okaxis", 2500),
            new CardPayment("4321", 10000, true),
            new NetBankingPayment("SBI", 50000),
            new PaytmWalletPayment(800)
        };
        for (Payment p : payments) {
            System.out.printf("%-20s fee = Rs.%.2f%n", p.getClass().getSimpleName(), FeeCalculator.fee(p));
        }
        System.out.println(Payment.class.isSealed());   // true
    }
}
// Output:
// UpiPayment           fee = Rs.0.00
// CardPayment          fee = Rs.350.00
// NetBankingPayment    fee = Rs.5.00
// PaytmWalletPayment   fee = Rs.8.00
// true`
    },
    {
      heading: "11. Composition over Inheritance in Java: HAS-A Beats IS-A",
      content: `**Composition** means building a class out of other objects it *holds* (HAS-A) rather than objects it *is* (IS-A). A \`Car\` has an \`Engine\`; an \`OrderService\` has a \`PaymentGateway\` and an \`InventoryRepository\`. The famous design guideline "favour composition over inheritance" (Gang of Four, *Design Patterns*, 1994) exists because inheritance has real costs that only show up as a codebase grows:
• **Tight coupling / fragile base class** — a subclass depends on implementation details of its parent. Changing the parent can silently break children. The JDK's own \`HashSet\`-counting example from *Effective Java* shows a subclass that double-counts because \`addAll\` internally calls \`add\`.
• **Inherits everything, including what you do not want** — \`java.util.Stack extends Vector\`, so a stack exposes \`get(int)\` and \`insertElementAt\`, letting callers violate LIFO. \`Properties extends Hashtable\` has the same flaw. These are acknowledged JDK design mistakes that remain for backward compatibility.
• **Static structure** — the parent is fixed at compile time. With composition you can swap the inner object at runtime (strategy pattern), choose it from configuration, or inject a mock in a test.
• **Single inheritance** — you only get one parent, so you cannot reuse two unrelated bases.
Composition avoids all four: the outer class exposes exactly the methods it chooses, delegates to the inner object, and can accept the inner object through its constructor (**dependency injection**). This is precisely how Spring applications are structured — a \`@Service\` holds references to interfaces and never extends framework classes.
A powerful hybrid is **composition + interfaces**: define the capability as an interface, implement it with small classes, and compose them. Java's \`java.io\` streams are the textbook example (the **Decorator** pattern): \`new BufferedReader(new InputStreamReader(new FileInputStream("data.txt")))\` — each wrapper HAS-A inner stream and adds one feature.
When is inheritance still right? When there is a true IS-A relationship, the parent was *designed* for extension (documented hooks, protected methods, no self-use surprises), and subclasses only *specialise* behaviour rather than removing it. Abstract base classes within your own module (\`Employee\`, \`Shape\`) and framework extension points (\`HttpServlet\`) are legitimate uses. For everything else, hold a reference and delegate.`,
      codeSnippet: `// File: CompositionDemo.java — a Stack built by composition (safe) vs inheritance (leaky)
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.List;

// BAD: inheritance leaks the whole List API, so callers can break the stack discipline
class LeakyStack<T> extends ArrayList<T> {
    void push(T item) { add(item); }
    T pop() { return remove(size() - 1); }
}

// GOOD: composition exposes only push/pop/peek and delegates to a private Deque
final class SafeStack<T> {
    private final Deque<T> items = new ArrayDeque<>();     // HAS-A

    void push(T item) { items.push(item); }
    T pop() { return items.pop(); }
    T peek() { return items.peek(); }
    int size() { return items.size(); }
}

// Composition with an interface: the behaviour can be swapped at runtime (Strategy pattern)
interface DiscountPolicy { double apply(double amount); }

class OrderService {
    private final DiscountPolicy discountPolicy;           // injected dependency, not a parent class
    OrderService(DiscountPolicy discountPolicy) { this.discountPolicy = discountPolicy; }
    double finalAmount(double cartTotal) { return discountPolicy.apply(cartTotal); }
}

public class CompositionDemo {
    public static void main(String[] args) {
        LeakyStack<String> leaky = new LeakyStack<>();
        leaky.push("A"); leaky.push("B");
        leaky.add(0, "Z");                                  // oops: inserted at the bottom, LIFO broken
        System.out.println("Leaky pop: " + leaky.pop());    // B (but the structure is now corrupt: [Z, A])

        SafeStack<String> safe = new SafeStack<>();
        safe.push("A"); safe.push("B");
        // safe.add(0, "Z");                                 // compile error: no such method
        System.out.println("Safe pop: " + safe.pop());      // B

        DiscountPolicy festive = amount -> amount * 0.80;   // 20% off during Diwali sale
        DiscountPolicy none = amount -> amount;
        System.out.println(new OrderService(festive).finalAmount(4999));   // 3999.2000000000003 (double arithmetic; use BigDecimal for money)
        System.out.println(new OrderService(none).finalAmount(4999));      // 4999.0
    }
}`
    },
    {
      heading: "12. SOLID Principles in Java: An Introduction",
      content: `**SOLID** is a set of five design principles, named by Robert C. Martin, that tell you *how* to use inheritance, polymorphism and interfaces so the code stays easy to change. Every principle maps directly to a concept from this lecture.
• **S — Single Responsibility Principle.** A class should have one reason to change. An \`Employee\` class that calculates salary, formats a PDF payslip and saves to the database has three reasons. Split into \`Employee\`, \`PayslipRenderer\` and \`EmployeeRepository\`. Symptom in code: a class with 40 methods and imports from \`java.sql\`, \`java.io\` and your domain all at once.
• **O — Open/Closed Principle.** Software entities should be *open for extension, closed for modification*. Instead of an \`if (type.equals("UPI")) ... else if (type.equals("CARD"))\` chain that you edit every time a payment method is added, define a \`Payment\` abstraction and add a new subclass. Polymorphism (section 5) is the mechanism; sealed types (section 10) add a compiler check for the cases where the set *is* meant to be closed.
• **L — Liskov Substitution Principle.** Any object of a subclass must be usable wherever the superclass is expected *without surprising the caller*. The classic violation is \`Square extends Rectangle\`: setting the width of a square changes its height, so code written for rectangles breaks. Another violation is a subclass that overrides a method to throw \`UnsupportedOperationException\` (\`List.of(...)\` returning an immutable list that throws on \`add\` is a deliberate, documented exception). LSP is the test that tells you whether your IS-A relationship is real.
• **I — Interface Segregation Principle.** Clients should not be forced to depend on methods they do not use. A \`Worker\` interface with \`work()\`, \`eat()\` and \`attendMeeting()\` forces a \`RobotWorker\` to implement \`eat()\`. Split into small, role-based interfaces (\`Workable\`, \`Feedable\`). Java's \`Readable\`, \`Appendable\`, \`Closeable\` follow this; the giant \`java.sql.ResultSet\` does not.
• **D — Dependency Inversion Principle.** High-level modules should depend on abstractions, not on concrete classes. \`OrderService\` should hold a \`PaymentGateway\` *interface*, never \`new RazorpayGateway()\` inside its own code. The concrete implementation is supplied from outside (constructor injection). This is the principle behind Spring's dependency injection and the reason unit tests can pass a Mockito mock.
You do not need to memorise definitions — you need to recognise the smells: a class that keeps growing (S), \`switch\` on a type string (O), subclass methods that throw or do nothing (L), fat interfaces with empty implementations (I), and \`new ConcreteThing()\` inside business logic (D). Later lectures on Spring Boot will show these principles applied to a real backend.`,
      codeSnippet: `// File: SolidDemo.java — before/after for the Open/Closed and Dependency Inversion principles
import java.util.List;

// ---- BEFORE: violates OCP (edit this method for every new type) and DIP (depends on strings/concretes)
class ShippingCalculatorBad {
    double cost(String type, double weightKg) {
        if (type.equals("STANDARD")) return 40 + weightKg * 10;
        else if (type.equals("EXPRESS")) return 99 + weightKg * 25;
        else throw new IllegalArgumentException("Unknown: " + type);   // every new carrier = modify here
    }
}

// ---- AFTER: abstraction + polymorphism; add a class, never edit the calculator
interface ShippingMethod {
    String label();
    double cost(double weightKg);
}

final class StandardShipping implements ShippingMethod {
    public String label() { return "Standard (5-7 days)"; }
    public double cost(double kg) { return 40 + kg * 10; }
}

final class ExpressShipping implements ShippingMethod {
    public String label() { return "Express (1-2 days)"; }
    public double cost(double kg) { return 99 + kg * 25; }
}

final class SameDayShipping implements ShippingMethod {        // new feature: zero changes elsewhere
    public String label() { return "Same day (metro only)"; }
    public double cost(double kg) { return 199 + kg * 40; }
}

class CheckoutService {
    private final List<ShippingMethod> methods;                 // DIP: depends on the interface, injected
    CheckoutService(List<ShippingMethod> methods) { this.methods = methods; }

    void showOptions(double weightKg) {
        for (ShippingMethod m : methods) {
            System.out.printf("%-24s Rs.%.0f%n", m.label(), m.cost(weightKg));
        }
    }
}

public class SolidDemo {
    public static void main(String[] args) {
        CheckoutService checkout = new CheckoutService(
            List.of(new StandardShipping(), new ExpressShipping(), new SameDayShipping()));
        checkout.showOptions(2.5);
    }
}
// Output:
// Standard (5-7 days)      Rs.65
// Express (1-2 days)       Rs.162
// Same day (metro only)    Rs.299`
    },
    {
      heading: "13. Real-World Use Cases: How Inheritance, Interfaces and Polymorphism Are Used in Production",
      content: `Knowing the syntax is step one; recognising these patterns in the frameworks you will work with is what makes you productive on day one of a job.
• **Spring Boot services and repositories.** You declare \`interface OrderRepository extends JpaRepository<Order, Long>\` and never implement it — Spring Data generates a proxy class at runtime that implements the interface. Your \`OrderService\` holds the interface, so in a JUnit 5 test you pass \`Mockito.mock(OrderRepository.class)\`. Interfaces plus dependency inversion are what make the service unit-testable without a database.
• **Spring Security.** \`UserDetailsService\` is an interface with one method, \`loadUserByUsername\`. You implement it for your user table; the framework calls it polymorphically during login. Authentication providers, password encoders (\`PasswordEncoder\` with \`BCryptPasswordEncoder\`, \`Argon2PasswordEncoder\`) all follow the same interface-driven design.
• **JDBC drivers.** Your code uses \`java.sql.Connection\`, \`PreparedStatement\` and \`ResultSet\` — all interfaces. The MySQL Connector/J jar on the classpath provides the concrete classes. Switching to PostgreSQL means changing a dependency and a URL, not your code.
• **Collections framework.** \`List\`, \`Set\`, \`Map\` are interfaces; \`ArrayList\`, \`LinkedList\`, \`HashSet\`, \`TreeMap\` are implementations; \`AbstractList\`, \`AbstractSet\`, \`AbstractMap\` are the abstract classes in between. Declaring variables as \`List<String>\` instead of \`ArrayList<String>\` is polymorphism in daily practice.
• **Exception hierarchy** (next lecture). \`Throwable\` → \`Exception\` → \`RuntimeException\` → \`IllegalArgumentException\`. Catching \`Exception\` catches every subclass; custom exceptions extend the right base. Inheritance is the entire design.
• **Domain modelling with sealed types.** Banking and fintech teams model \`Transaction\` as a sealed interface with \`Credit\`, \`Debit\`, \`Reversal\` records and switch over them exhaustively. An Indian UPI payment aggregator might model \`PaymentStatus\` as \`Pending\`, \`Success\`, \`Failed(reason)\` and be certain, at compile time, that every status is handled.
• **Android and GUI frameworks.** Every screen extends \`Activity\` or \`Fragment\` and overrides lifecycle methods (\`onCreate\`, \`onResume\`); click handlers implement \`View.OnClickListener\`. The framework calls your overrides polymorphically — the Hollywood principle: "don't call us, we'll call you."
• **Plugin and strategy systems.** Tax rules that differ per Indian state, pricing rules that differ per customer tier, notification channels (email, SMS, WhatsApp) — all are a single interface with many implementations selected at runtime, often via a \`Map<String, Strategy>\` populated by Spring.
• **Template Method in test frameworks.** JUnit 5's lifecycle (\`@BeforeEach\`, \`@Test\`, \`@AfterEach\`) and Spring's \`JdbcTemplate\` (\`query\` handles connections and exceptions; you supply the \`RowMapper\`) are the Template Method pattern you saw in section 6.
The pattern underneath all of these: the framework owns the algorithm and the abstraction, you own the concrete behaviour, and polymorphism connects the two.`
    },
    {
      heading: "14. Common Mistakes with Java Inheritance, Polymorphism and Interfaces — and How to Fix Them",
      content: `These mistakes appear constantly in student code and in code reviews. Each one comes with the fix.
• **Forgetting \`@Override\` and accidentally overloading.** Writing \`equals(Employee o)\` instead of \`equals(Object o)\` creates an overload; \`HashMap\` still calls the inherited \`Object.equals\`, and your lookups fail. **Fix:** always annotate with \`@Override\` so the compiler catches the wrong signature, and let your IDE generate \`equals\`/\`hashCode\`.
• **Calling an overridable method from a constructor.** The parent constructor runs before the child's fields are initialised, so the child's override sees \`null\` or \`0\` and may throw \`NullPointerException\`. **Fix:** constructors should call only \`private\` or \`final\` methods. Move the work into a factory method or an \`init()\` called after construction.
• **Missing parent constructor.** You add a parameterised constructor to the parent and every subclass stops compiling with "constructor cannot be applied to given types". **Fix:** either add \`super(args)\` to each subclass constructor or keep a no-arg constructor in the parent.
• **Shadowing fields.** Declaring \`String name\` in both parent and child creates two fields, and \`parentRef.name\` and \`childRef.name\` return different values. **Fix:** never redeclare a field; use the inherited one (make it \`protected\` or use a getter).
• **Expecting static methods to be polymorphic.** \`Employee e = new Manager(); e.company();\` runs \`Employee.company()\`. **Fix:** do not "override" statics; if behaviour varies per subclass it must be an instance method.
• **Reducing visibility in an override.** Implementing an interface method without \`public\` gives "attempting to assign weaker access privileges; was public". **Fix:** interface implementations must be \`public\`.
• **Unsafe downcasts.** \`(Manager) employee\` without checking throws \`ClassCastException\` at runtime. **Fix:** use \`if (employee instanceof Manager m)\` (Java 16+), or better, avoid the cast with polymorphism or a sealed \`switch\`.
• **Deep inheritance for code reuse.** \`ReportGenerator extends CsvWriter extends FileWriter\` just to reuse a method. **Fix:** composition — hold a \`CsvWriter\` field and delegate.
• **Breaking Liskov with \`UnsupportedOperationException\`.** A subclass that disables a parent method surprises every caller. **Fix:** rethink the hierarchy; the "subclass" probably is not an IS-A. Split the interface (ISP).
• **Abstract class with no abstract methods and no state used just as a namespace.** **Fix:** use a \`final\` class with a private constructor and static methods, or an interface with static methods.
• **Marking a sealed subclass with none of \`final\`, \`sealed\`, \`non-sealed\`.** Compile error "sealed, non-sealed or final modifiers expected". **Fix:** choose one deliberately; records and enums are implicitly final.
• **Adding a \`default\` branch to a \`switch\` over a sealed type.** It compiles, but you lose the exhaustiveness check — new subtypes silently fall into \`default\`. **Fix:** omit \`default\` for sealed types so missing cases become compile errors.
• **Trying to override \`toString()\` with an interface default method.** Compile error: default methods cannot override \`Object\` methods. **Fix:** implement \`toString()\` in the class, or provide a differently named default (\`describe()\`).`,
      codeSnippet: `// File: ConstructorPitfall.java — calling an overridable method from a constructor
class Parent {
    Parent() {
        System.out.println("Parent constructor calls describe()");
        describe();                                   // DANGER: dispatches to Child.describe()
    }
    void describe() { System.out.println("Parent"); }
}

class Child extends Parent {
    private String city = "Bengaluru";                // not yet assigned when Parent() runs

    Child() {
        super();
        System.out.println("Child constructor done, city=" + city);
    }

    @Override
    void describe() {
        System.out.println("Child in " + city.toUpperCase());   // city is null here -> NPE
    }
}

public class ConstructorPitfall {
    public static void main(String[] args) {
        try {
            new Child();
        } catch (NullPointerException e) {
            System.out.println("NullPointerException: child field read before initialisation");
        }
    }
}
// Output:
// Parent constructor calls describe()
// NullPointerException: child field read before initialisation
//
// FIX: make describe() final or private in Parent, or do not call it from the constructor.
// If the method must vary per subclass, call it after construction (e.g. from a static factory).`
    },
    {
      heading: "15. Frequently Asked Questions about Java Inheritance, Abstraction and Interfaces",
      content: `**What is the difference between an abstract class and an interface in Java?**
An abstract class can hold instance fields, constructors and methods with any access level, and a class can extend only one. An interface holds only constants and methods (abstract, default, static, private) and a class can implement many. Use an abstract class for a shared skeleton with state in an IS-A hierarchy; use an interface to define a capability or a role that unrelated classes can play. Since Java 8, default methods let interfaces carry some behaviour, but still no state.
**Why does Java not support multiple inheritance of classes?**
To avoid the diamond problem, where two parents provide different implementations of the same method and the language needs complex rules to pick one. Java allows multiple inheritance of *type* through interfaces, and since Java 8 resolves default-method conflicts with explicit rules: class wins, more specific interface wins, otherwise the class must override and may call \`A.super.method()\`.
**What is dynamic method dispatch in Java?**
It is the runtime mechanism that selects which overridden method to execute based on the actual object's class rather than the reference variable's declared type. \`Shape s = new Circle(); s.area();\` runs \`Circle.area()\`. It applies only to non-static, non-private, non-final instance methods; fields and static methods are resolved by the declared type at compile time.
**Can we override a static method in Java?**
No. A static method with the same signature in a subclass *hides* the parent method; the version called depends on the declared type of the reference, not the object. Putting \`@Override\` on a static method is a compile error. If behaviour must vary per subclass, make it an instance method.
**What are sealed classes in Java and when should I use them?**
Sealed classes and interfaces (Java 17) restrict which classes may extend or implement them via a \`permits\` list; each permitted subclass must be \`final\`, \`sealed\` or \`non-sealed\`. Use them when the set of subtypes is fixed by the domain — payment types, order states, AST nodes — so that \`switch\` pattern matching (Java 21) can be exhaustive and the compiler flags any missing case.
**Why is composition preferred over inheritance?**
Inheritance couples the subclass to the parent's implementation (fragile base class), exposes the entire parent API, fixes the relationship at compile time, and permits only one parent. Composition lets a class hold a reference to the behaviour it needs, expose only what it chooses, swap the implementation at runtime, and be tested with mocks. Use inheritance only for a genuine IS-A relationship with a parent designed for extension.
**Can an interface have a constructor or instance variables?**
No. Interfaces cannot be instantiated, so they have no constructors, and every field declared in an interface is implicitly \`public static final\` — a constant, not per-object state. If you need state shared by implementations, introduce an abstract class that implements the interface.
**Does Java 25 change anything about inheritance?**
Java 25 (JEP 513, Flexible Constructor Bodies) allows statements before \`super(...)\` in a constructor, as long as they do not touch \`this\`, which simplifies argument validation in subclasses. The core rules of inheritance, overriding, sealed types and interfaces are unchanged from Java 21.`
    },
    {
      heading: "16. Interview Questions and Answers on Java OOP: Inheritance, Polymorphism, Abstraction & Interfaces",
      content: `**Q1. What are the rules for method overriding in Java?**
Same name and parameter list; return type identical or a subtype (covariant); access level equal or wider; checked exceptions equal or narrower; the parent method must not be \`final\`, \`static\` or \`private\`. Use \`@Override\` so the compiler verifies all of this.
**Q2. What is the difference between method overloading and method overriding?**
Overloading: same method name, different parameter lists, within the same class (or inherited), resolved at compile time by argument types. Overriding: same signature in a subclass, resolved at runtime by the object's actual class. Overloading is compile-time polymorphism; overriding is runtime polymorphism.
**Q3. What is the output when a parent reference points to a child object and you access a field declared in both?**
The parent's field. Field access is resolved statically by the declared type; only instance methods are dispatched dynamically. This is why field hiding is considered a bug-prone practice.
**Q4. Can an abstract class have a constructor? What is it for?**
Yes. It cannot be called with \`new\`, but subclasses invoke it with \`super(...)\` to initialise the fields declared in the abstract class. It is also where you validate common invariants.
**Q5. What happens if a class implements two interfaces with the same default method?**
Compile error: "class inherits unrelated defaults". The class must override the method, and inside it may delegate to one or both using \`InterfaceName.super.method()\`.
**Q6. Explain the Liskov Substitution Principle with an example of a violation.**
A subclass must be usable anywhere its parent is expected without changing correctness. \`Square extends Rectangle\` violates it: code that sets width to 5 and height to 10 on a \`Rectangle\` expects area 50, but a \`Square\` forces both sides equal and returns 100. The fix is to model them as separate implementations of a \`Shape\` interface.
**Q7. What is the difference between \`final\`, \`finally\` and \`finalize\`?**
\`final\` is a modifier: a final variable cannot be reassigned, a final method cannot be overridden, a final class cannot be extended. \`finally\` is a block in exception handling that always runs. \`finalize()\` was a method on \`Object\` called before garbage collection; it is deprecated for removal and must not be used — use \`try-with-resources\` or \`Cleaner\` instead.
**Q8. What does \`non-sealed\` mean?**
In a sealed hierarchy, a permitted subclass must declare its own extensibility. \`non-sealed\` reopens that branch: any class may extend it, while the other permitted branches stay closed. It is used when one subtype is meant to be a general extension point.
**Q9. Why are interface methods implicitly public, and what happens if I implement one with default (package) access?**
An interface is a public contract, so every abstract method is \`public abstract\`. Implementing it with narrower access fails with "attempting to assign weaker access privileges; was public", because overriding can never reduce visibility.
**Q10. How does Spring use polymorphism and interfaces, and why does that matter for testing?**
Services depend on interfaces (\`OrderRepository\`, \`PaymentGateway\`) that Spring wires with concrete beans at runtime. Because the service only knows the interface, a JUnit 5 test can inject a Mockito mock and verify behaviour without a database or network. This is the Dependency Inversion Principle in practice.
**Q11. Can a sealed interface be implemented by a record or an enum?**
Yes. Records are implicitly \`final\` and enums are implicitly \`final\` (or sealed when they have constant-specific bodies), so both satisfy the sealed-subclass requirement without extra modifiers. Sealed interface plus records is the idiomatic way to model closed data types in modern Java.`
    },
    {
      heading: "17. Hands-On Exercise: Build a Payroll and Salary Disbursement System with Inheritance, Interfaces and Sealed Types",
      content: `Build a small but complete payroll system for a fictional Indian startup. The program should run on Java 21 or Java 25 with a single command: save it as \`PayrollSystem.java\` and run \`java PayrollSystem.java\` (the single-file source launcher compiles it in memory).
Requirements:
1. An **abstract class** \`Employee\` with private \`name\` and \`employeeId\`, an abstract \`grossMonthlyPay()\`, a concrete \`professionalTax()\` (₹200 if gross > ₹15,000, else ₹0, mirroring a typical state slab) and a **final template method** \`netPay()\`.
2. Three subclasses — \`FullTimeEmployee\` (annual CTC ÷ 12, plus HRA of 40% of basic where basic is 50% of gross), \`Contractor\` (hourly rate × hours) and \`Intern\` (fixed stipend) — each overriding \`grossMonthlyPay()\` and \`toString()\` using \`super.toString()\`.
3. An **interface** \`Taxable\` with an abstract \`taxableIncome()\` and a **default** \`incomeTax()\` applying slabs (0% up to ₹25,000 per month, 10% up to ₹1,00,000, 30% above) using a **private** helper. \`Intern\` must NOT implement \`Taxable\`; the others must.
4. A **sealed interface** \`DisbursementMode\` permitting records \`Neft(ifsc, account)\`, \`Upi(vpa)\` and \`Cheque(number)\`. A \`DisbursementService\` with a \`final\` method using an **exhaustive switch with record patterns** to print how each salary is paid and the processing fee (NEFT ₹2.50, UPI ₹0, cheque ₹25).
5. A \`PayrollRun\` class that is built by **composition**: it holds a \`List<Employee>\` and a \`Map<String, DisbursementMode>\` and never extends anything. Demonstrate **dynamic dispatch** by looping over \`List<Employee>\` and **pattern matching** by checking \`instanceof Taxable\` to compute tax only for taxable employees.
Expected output is shown in the comments at the bottom of the solution. Try writing it yourself first, then compare with the reference solution below. Extension ideas: add a \`non-sealed\` \`WalletTransfer\` mode and a fourth employee type, and watch the compiler tell you exactly which \`switch\` needs updating.`,
      codeSnippet: `// File: PayrollSystem.java — run with: java PayrollSystem.java   (Java 21 or 25)
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

// The launcher class comes first: "java PayrollSystem.java" runs the first top-level class in the file
public class PayrollSystem {
    public static void main(String[] args) {
        List<Employee> staff = List.of(
            new FullTimeEmployee("Rahul Verma", "E101", 1800000),
            new Contractor("Anjali Nair", "C202", 1200, 160),
            new Intern("Kabir Singh", "I303", 20000)
        );

        Map<String, DisbursementMode> modes = new LinkedHashMap<>();
        modes.put("E101", new Neft("HDFC0001234", "50100123456789"));
        modes.put("C202", new Upi("anjali@okicici"));
        modes.put("I303", new Cheque(100045));

        new PayrollRun(staff, modes).execute("October 2026");
    }
}

// ---------- 1. Abstract base class with a template method ----------
abstract class Employee {
    private final String name;
    private final String employeeId;

    protected Employee(String name, String employeeId) {
        if (name == null || name.isBlank()) throw new IllegalArgumentException("name required");
        this.name = name;
        this.employeeId = employeeId;
    }

    public String getName() { return name; }
    public String getEmployeeId() { return employeeId; }

    public abstract double grossMonthlyPay();

    public double professionalTax() {                       // shared concrete behaviour
        return grossMonthlyPay() > 15000 ? 200 : 0;
    }

    public final double netPay() {                          // template method: cannot be overridden
        double tax = (this instanceof Taxable t) ? t.incomeTax() : 0;   // Java 16+ pattern matching
        return grossMonthlyPay() - professionalTax() - tax;
    }

    @Override
    public String toString() {
        return String.format("%-6s %-14s", employeeId, name);
    }
}

// ---------- 3. Interface with abstract, default and private methods ----------
interface Taxable {
    double taxableIncome();

    default double incomeTax() {
        return slabTax(taxableIncome());
    }

    private static double slabTax(double income) {          // Java 9 private static helper
        if (income <= 25000) return 0;
        if (income <= 100000) return (income - 25000) * 0.10;
        return 7500 + (income - 100000) * 0.30;             // 7500 = tax on the 25k-100k band
    }
}

// ---------- 2. Concrete subclasses ----------
class FullTimeEmployee extends Employee implements Taxable {
    private final double annualCtc;

    FullTimeEmployee(String name, String id, double annualCtc) {
        super(name, id);
        this.annualCtc = annualCtc;
    }

    @Override
    public double grossMonthlyPay() { return annualCtc / 12; }

    public double hra() {                                   // HRA = 40% of basic; basic = 50% of gross
        return grossMonthlyPay() * 0.50 * 0.40;
    }

    @Override
    public double taxableIncome() { return grossMonthlyPay() - hra(); }   // HRA exempt (simplified)

    @Override
    public String toString() { return super.toString() + " Full-time CTC Rs." + (long) annualCtc; }
}

class Contractor extends Employee implements Taxable {
    private final double hourlyRate;
    private final int hours;

    Contractor(String name, String id, double hourlyRate, int hours) {
        super(name, id);
        this.hourlyRate = hourlyRate;
        this.hours = hours;
    }

    @Override
    public double grossMonthlyPay() { return hourlyRate * hours; }

    @Override
    public double taxableIncome() { return grossMonthlyPay(); }

    @Override
    public String toString() { return super.toString() + " Contractor " + hours + "h @ Rs." + (long) hourlyRate; }
}

class Intern extends Employee {                             // NOT Taxable
    private final double stipend;

    Intern(String name, String id, double stipend) {
        super(name, id);
        this.stipend = stipend;
    }

    @Override
    public double grossMonthlyPay() { return stipend; }

    @Override
    public String toString() { return super.toString() + " Intern stipend Rs." + (long) stipend; }
}

// ---------- 4. Sealed hierarchy + exhaustive switch ----------
sealed interface DisbursementMode permits Neft, Upi, Cheque { }
record Neft(String ifsc, String account) implements DisbursementMode { }
record Upi(String vpa) implements DisbursementMode { }
record Cheque(int number) implements DisbursementMode { }

final class DisbursementService {
    double fee(DisbursementMode mode) {
        return switch (mode) {                              // no default: compiler checks exhaustiveness
            case Neft n -> 2.50;
            case Upi u -> 0.0;
            case Cheque c -> 25.0;
        };
    }

    String describe(DisbursementMode mode, double amount) {
        return switch (mode) {
            case Neft(String ifsc, String account) ->
                String.format("NEFT Rs.%.2f to A/C %s (%s)", amount, account, ifsc);
            case Upi(String vpa) ->
                String.format("UPI  Rs.%.2f to %s", amount, vpa);
            case Cheque(int number) ->
                String.format("Cheque #%d for Rs.%.2f", number, amount);
        };
    }
}

// ---------- 5. Composition: PayrollRun HAS-A list, map and service ----------
final class PayrollRun {
    private final List<Employee> employees;
    private final Map<String, DisbursementMode> modes;
    private final DisbursementService disbursement = new DisbursementService();

    PayrollRun(List<Employee> employees, Map<String, DisbursementMode> modes) {
        this.employees = List.copyOf(employees);
        this.modes = Map.copyOf(modes);
    }

    void execute(String month) {
        System.out.println("=== Payroll for " + month + " ===");
        double totalNet = 0, totalTax = 0, totalFees = 0;

        for (Employee e : employees) {                      // dynamic dispatch on each subclass
            double gross = e.grossMonthlyPay();
            double tax = (e instanceof Taxable t) ? t.incomeTax() : 0;
            double net = e.netPay();
            DisbursementMode mode = modes.get(e.getEmployeeId());
            double fee = disbursement.fee(mode);

            System.out.println(e);
            System.out.printf("   gross Rs.%.2f | income tax Rs.%.2f | prof. tax Rs.%.2f | net Rs.%.2f%n",
                    gross, tax, e.professionalTax(), net);
            System.out.println("   " + disbursement.describe(mode, net) + " | fee Rs." + fee);

            totalNet += net; totalTax += tax; totalFees += fee;
        }
        System.out.printf("Total net payout Rs.%.2f | total income tax Rs.%.2f | bank fees Rs.%.2f%n",
                totalNet, totalTax, totalFees);
    }
}
// Output:
// === Payroll for October 2026 ===
// E101   Rahul Verma    Full-time CTC Rs.1800000
//    gross Rs.150000.00 | income tax Rs.13500.00 | prof. tax Rs.200.00 | net Rs.136300.00
//    NEFT Rs.136300.00 to A/C 50100123456789 (HDFC0001234) | fee Rs.2.5
// C202   Anjali Nair    Contractor 160h @ Rs.1200
//    gross Rs.192000.00 | income tax Rs.35100.00 | prof. tax Rs.200.00 | net Rs.156700.00
//    UPI  Rs.156700.00 to anjali@okicici | fee Rs.0.0
// I303   Kabir Singh    Intern stipend Rs.20000
//    gross Rs.20000.00 | income tax Rs.0.00 | prof. tax Rs.200.00 | net Rs.19800.00
//    Cheque #100045 for Rs.19800.00 | fee Rs.25.0
// Total net payout Rs.312800.00 | total income tax Rs.48600.00 | bank fees Rs.27.50`
    },
    {
      heading: "18. Summary",
      content: `• **Inheritance** (\`extends\`) models an IS-A relationship; a subclass inherits all non-private members, never constructors. Java allows single class inheritance; every class ultimately extends \`Object\`.
• **\`super\`** calls the parent constructor (first statement, except with Java 25's flexible constructor bodies), the parent's version of an overridden method, or a hidden field. Constructors chain from \`Object\` down to the concrete class.
• **Method overriding** requires the same signature, a covariant return type, equal-or-wider access and equal-or-narrower checked exceptions. Always use **\`@Override\`** to turn mistakes into compile errors.
• **Runtime polymorphism / dynamic dispatch** picks the implementation by the object's actual class. Fields, static methods and private methods are *not* polymorphic. Upcasting is implicit; downcasting needs a cast guarded by \`instanceof\` pattern matching (Java 16).
• **Abstract classes** cannot be instantiated, can hold state and constructors, and mix abstract methods with concrete ones — ideal for the Template Method pattern.
• **Interfaces** define capabilities: abstract methods, constants, **default** and **static** methods (Java 8), **private** methods (Java 9). A class can implement many; conflicts between defaults are resolved by "class wins, more specific wins, otherwise override and use \`A.super.m()\`".
• **Abstract class vs interface**: state and shared skeleton → abstract class; capability, role or test seam → interface; the JDK combines both (\`List\` → \`AbstractList\` → \`ArrayList\`).
• **\`final\`** blocks overriding or extension; **sealed** (Java 17) names the permitted subtypes (\`final\`, \`sealed\` or \`non-sealed\`), enabling **exhaustive \`switch\` with record patterns** (Java 21).
• **Composition over inheritance**: hold a reference and delegate; it avoids the fragile base class problem, leaked APIs and single-parent limits, and it is how Spring wires applications.
• **SOLID** — Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion — tells you *when* to apply each of the above.
• Framework reality: Spring Data repositories, JDBC, the collections framework, Spring Security and JUnit 5 are all interfaces and abstract classes that call *your* overrides polymorphically.
**Next lecture:** Exception Handling`
    }
  ]
};
