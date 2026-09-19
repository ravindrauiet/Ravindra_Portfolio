export const javaData = {
  id: "java",
  slug: "java",
  name: "Java",
  icon: "fab fa-java",
  iconColor: "#f89820",
  badge: "Enterprise Language",
  description: "Master Object-Oriented Programming (OOP), JVM Internals, Multithreading, Spring Boot REST APIs, and System Design.",
  totalLectures: 1,
  lectures: [
    {
      slug: "lecture-1",
      number: 1,
      title: "Java OOP Fundamentals, JVM Architecture & Core Syntax",
      summary: "Deep dive into Abstraction, Encapsulation, Inheritance, Polymorphism, Class Loaders, Garbage Collection, and Memory allocation.",
      readTime: "14 min read",
      difficulty: "Beginner to Intermediate",
      date: "2026-09-19",
      sections: [
        {
          heading: "1. Understanding JVM Architecture (JDK vs JRE vs JVM)",
          content: `• **JDK (Java Development Kit)**: Complete toolkit containing compiler (\`javac\`), debugger, and execution environment.
• **JRE (Java Runtime Environment)**: Environment that includes the JVM and standard Java libraries required to run compiled bytecodes.
• **JVM (Java Virtual Machine)**: Abstract machine that executes Java bytecode (.class files) and manages heap/stack memory, Just-In-Time (JIT) compilation, and Garbage Collection (GC).`
        },
        {
          heading: "2. Core Principles of Object-Oriented Programming (OOP)",
          content: `1. **Encapsulation**: Bundling data (variables) and methods that operate on data within a class while restricting direct access using private access modifiers.
2. **Inheritance**: Acquiring properties and behaviors of a parent class using the \`extends\` keyword.
3. **Polymorphism**: Ability for a method to behave differently based on the object calling it (Method Overloading & Method Overriding).
4. **Abstraction**: Hiding internal implementation details and exposing only essential interfaces using Interfaces and Abstract Classes.`,
          codeSnippet: `// Example: Java Encapsulation & Polymorphism
public class Developer {
    private String name;
    private String techStack;

    public Developer(String name, String techStack) {
        this.name = name;
        this.techStack = techStack;
    }

    public void code() {
        System.out.println(name + " is building solutions with " + techStack);
    }

    public String getName() {
        return name;
    }
}

public class Main {
    public static void main(String[] args) {
        Developer dev = new Developer("Ravindra", "Java & Spring Boot");
        dev.code();
    }
}`
        },
        {
          heading: "3. Memory Management: Heap vs. Stack",
          content: `• **Stack Memory**: Stores primitive values and references to objects residing in the Heap. Memory is allocated and deallocated in LIFO order per thread execution.
• **Heap Memory**: Stores all instantiated objects and instance variables shared across threads. Cleaned automatically by Garbage Collector (G1 GC / ZGC).`
        }
      ]
    }
  ]
};
