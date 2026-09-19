export const techStacks = [
  {
    id: "react",
    slug: "react",
    name: "React.js",
    icon: "fab fa-react",
    iconColor: "#61dafb",
    badge: "Frontend Library",
    description: "Master React 18+, Component Architecture, Hooks, Virtual DOM, State Management, and Production Optimization.",
    totalLectures: 1,
    lectures: [
      {
        slug: "lecture-1",
        number: 1,
        title: "React.js Fundamentals, JSX & Component Architecture",
        summary: "Understand the Virtual DOM, JSX syntax rules, functional components, props, state, and rendering lifecycle.",
        readTime: "12 min read",
        difficulty: "Beginner",
        date: "2026-09-19",
        sections: [
          {
            heading: "1. What is React and Why Use It?",
            content: `React is an open-source JavaScript library developed by Facebook for building fast, interactive user interfaces for web and mobile applications. Key reasons developers choose React include:
• **Component-Based Architecture**: Build encapsulated UI components that manage their own state and compose them to make complex UIs.
• **Declarative UI**: Design simple views for each state in your application, and React efficiently updates and renders the right components when data changes.
• **Virtual DOM**: React maintains a lightweight representation of the real DOM in memory, enabling hyper-fast diffing and minimal real DOM mutations.`,
          },
          {
            heading: "2. Understanding JSX (JavaScript XML)",
            content: `JSX is a syntax extension to JavaScript that allows you to write HTML-like markup inside JavaScript code. Babel compiles JSX down to standard React.createElement() function calls.

**Key JSX Rules:**
1. Components must return a single root element (or Fragment \`<>\`).
2. Close all tags explicitly (\`<img />\`, \`<br />\`).
3. Use camelCase for HTML attributes (\`className\`, \`onClick\`, \`htmlFor\`).`,
            codeSnippet: `// Example: Creating a Functional React Component in JSX
import React, { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="counter-card">
      <h2>Interactive Counter</h2>
      <p>Current Count: <strong>{count}</strong></p>
      <button onClick={() => setCount(count + 1)} className="btn-primary">
        Increment +1
      </button>
    </div>
  );
}`,
          },
          {
            heading: "3. Props vs. State in React",
            content: `• **Props (Properties)**: Read-only inputs passed from parent component to child component. Props are immutable.
• **State**: Internal data store managed locally within a component using the \`useState\` Hook. When state changes, React triggers a component re-render.`,
            codeSnippet: `// Passing Props to a Sub-Component
function UserProfile({ username, role }) {
  return (
    <div className="user-card">
      <h3>{username}</h3>
      <span className="badge">{role}</span>
    </div>
  );
}`,
          },
          {
            heading: "4. Key Takeaways & Best Practices",
            content: `• Keep components small, focused, and reusable.
• Always derive state when possible instead of duplicating props into state.
• Use React Fragments (\`<>\`) to group elements without adding extra nodes to the DOM.`,
          }
        ]
      }
    ]
  },
  {
    id: "nextjs",
    slug: "nextjs",
    name: "Next.js",
    icon: "fas fa-cubes",
    iconColor: "#ffffff",
    badge: "Full-Stack Framework",
    description: "Learn Next.js 16+ App Router, React Server Components (RSC), Server Actions, API Routes, and SSG/SSR performance tuning.",
    totalLectures: 1,
    lectures: [
      {
        slug: "lecture-1",
        number: 1,
        title: "Next.js App Router, Server Components & Dynamic Routing",
        summary: "Explore file-system routing, server vs client components, metadata SEO API, and server-side rendering advantages.",
        readTime: "15 min read",
        difficulty: "Intermediate",
        date: "2026-09-19",
        sections: [
          {
            heading: "1. Next.js App Router vs. Pages Router",
            content: `Next.js introduces the App Router built on React Server Components (RSC). Key benefits include:
• **Default Server Components**: Components render on the server by default, reducing client-side JavaScript bundle sizes.
• **Nested Layouts & Templates**: Shared UI wrappers across routes without unnecessary re-renders.
• **Colocated Data Fetching**: Fetch data directly inside async Server Components using standard fetch() with automatic caching.`,
          },
          {
            heading: "2. Server Components vs. Client Components",
            content: `• **Server Components (Default)**: Best for data fetching, backend security, reducing client bundle size, and SEO indexing. Cannot use React hooks (\`useState\`, \`useEffect\`) or browser event listeners.
• **Client Components (\`"use client"\`)**: Needed for interactive elements, event listeners (\`onClick\`, \`onChange\`), custom hooks, and browser APIs.`,
            codeSnippet: `// Server Component with Direct Data Fetching (app/projects/page.js)
import React from 'react';

export const metadata = {
  title: 'Projects | Full Stack Showcase',
};

export default async function ProjectsPage() {
  const res = await fetch('https://api.example.com/projects', { next: { revalidate: 3600 } });
  const projects = await res.json();

  return (
    <div className="container">
      <h1>My Projects</h1>
      {projects.map((proj) => (
        <div key={proj.id} className="project-card">
          <h3>{proj.title}</h3>
        </div>
      ))}
    </div>
  );
}`,
          },
          {
            heading: "3. Dynamic Routing & Layout Architecture",
            content: `The App Router relies on folder-based conventions:
• \`app/page.js\` -> Home page (\`/\`)
• \`app/notes/page.js\` -> Notes hub (\`/notes\`)
• \`app/notes/[techStack]/page.js\` -> Dynamic Tech Stack Route (\`/notes/react\`)
• \`app/notes/[techStack]/[lectureSlug]/page.js\` -> Dynamic Lecture Route (\`/notes/react/lecture-1\`)`,
          },
          {
            heading: "4. Summary & Production Tips",
            content: `• Keep components as Server Components by default; add \`"use client"\` at the very top of files only when interactivity is required.
• Leverage Next.js built-in \`Script\`, \`Image\`, and \`Font\` components for optimal Core Web Vitals scores.`,
          }
        ]
      }
    ]
  },
  {
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
• **JVM (Java Virtual Machine)**: Abstract machine that executes Java bytecode (.class files) and manages heap/stack memory, Just-In-Time (JIT) compilation, and Garbage Collection (GC).`,
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
}`,
          },
          {
            heading: "3. Memory Management: Heap vs. Stack",
            content: `• **Stack Memory**: Stores primitive values and references to objects residing in the Heap. Memory is allocated and deallocated in LIFO order per thread execution.
• **Heap Memory**: Stores all instantiated objects and instance variables shared across threads. Cleaned automatically by Garbage Collector (G1 GC / ZGC).`,
          }
        ]
      }
    ]
  },
  {
    id: "python",
    slug: "python",
    name: "Python",
    icon: "fab fa-python",
    iconColor: "#3776ab",
    badge: "Backend & Data Science",
    description: "Learn Python 3.12+, Data Structures, Decorators, Generators, Asyncio, FastAPIs, and Automation Scripts.",
    totalLectures: 1,
    lectures: [
      {
        slug: "lecture-1",
        number: 1,
        title: "Python Essentials, Data Structures & Object-Oriented Design",
        summary: "Master lists, dicts, tuples, sets, list comprehensions, decorators, context managers, and OOP design patterns.",
        readTime: "11 min read",
        difficulty: "Beginner",
        date: "2026-09-19",
        sections: [
          {
            heading: "1. Why Python for Modern Development?",
            content: `Python is a high-level, interpreted, dynamically typed programming language known for clean syntax, high readability, and a massive ecosystem of libraries (FastAPI, Django, NumPy, Pandas, PyTorch, Scikit-learn).`,
          },
          {
            heading: "2. Built-in Data Structures & List Comprehensions",
            content: `Python provides 4 core built-in data structures:
• **List**: Ordered, mutable collection (\`[1, 2, 3]\`).
• **Tuple**: Ordered, immutable sequence (\`(10, 20)\`).
• **Dictionary**: Key-value pairs for O(1) average hash lookups (\`{"name": "Ravindra"}\`).
• **Set**: Unordered collection of unique elements (\`{1, 2, 3}\`).`,
            codeSnippet: `# Pythonic Code: List Comprehensions & Decorators
import time

def timer_decorator(func):
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"[{func.__name__}] executed in {end - start:.4f}s")
        return result
    return wrapper

@timer_decorator
def process_data(numbers):
    # Filter even numbers and compute squares using list comprehension
    return [num ** 2 for num in numbers if num % 2 == 0]

data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
squares = process_data(data)
print("Squares:", squares)`,
          },
          {
            heading: "3. Context Managers (\`with\` statement)",
            content: `Context managers guarantee resource cleanup (e.g. opening files, managing database connections, acquiring locks) even if exceptions are raised.`,
          }
        ]
      }
    ]
  },
  {
    id: "ai",
    slug: "ai",
    name: "Artificial Intelligence",
    icon: "fas fa-robot",
    iconColor: "#ff7b00",
    badge: "AI & Machine Learning",
    description: "Understand Machine Learning models, Neural Networks, Large Language Models (LLMs), Prompt Engineering, and RAG Architecture.",
    totalLectures: 1,
    lectures: [
      {
        slug: "lecture-1",
        number: 1,
        title: "Introduction to AI, Machine Learning & LLM Integration",
        summary: "Explore Supervised vs Unsupervised Learning, Neural Network concepts, Vector Embeddings, and OpenAI/Gemini API integration.",
        readTime: "16 min read",
        difficulty: "Intermediate",
        date: "2026-09-19",
        sections: [
          {
            heading: "1. Core Categories of Artificial Intelligence",
            content: `Artificial Intelligence spans multiple paradigms:
• **Machine Learning (ML)**: Algorithms that learn patterns from training data to make predictions (Regression, Classification).
• **Deep Learning (DL)**: Multi-layer Artificial Neural Networks (ANNs, CNNs, Transformers) capable of feature extraction from unstructured data (images, text, audio).
• **Generative AI & LLMs**: Transformer models trained on vast text corpora to generate text, code, images, and reason step-by-step.`,
          },
          {
            heading: "2. Retrieval-Augmented Generation (RAG) Architecture",
            content: `RAG combines LLMs with custom enterprise document data to eliminate hallucinations and deliver accurate domain answers:
1. **Document Ingestion**: Chunk text files into smaller semantic snippets.
2. **Vector Embeddings**: Convert text chunks into numerical vectors using embedding models (e.g. text-embedding-3-small).
3. **Vector Database**: Store vectors in databases like Pinecone, ChromaDB, or Pgvector.
4. **Similarity Search**: Retrieve top matching snippets based on user query cosine similarity.
5. **Augmented Prompting**: Inject retrieved context into the LLM system prompt.`,
            codeSnippet: `// Example: AI API Integration with Vector Context
async function queryAIWithContext(userQuestion, contextSnippets) {
  const prompt = \`
    You are an AI assistant. Answer the user question based strictly on the provided context below:
    
    Context:
    \${contextSnippets.join("\\n\\n")}

    Question: \${userQuestion}
  \`;

  // Send request to LLM endpoint
  const response = await fetch('/api/ai-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });

  return await response.json();
}`,
          },
          {
            heading: "3. Best Practices in Prompt Engineering",
            content: `• **Assign a Clear Role**: "You are a Senior Full-Stack Engineer reviewing a React PR."
• **Provide Structural Output Format**: Request JSON schemas or Markdown tables.
• **Use Few-Shot Examples**: Include 2-3 sample input-output pairs to guide model output accuracy.`,
          }
        ]
      }
    ]
  }
];

export function getAllTechStacks() {
  return techStacks;
}

export function getTechStack(slug) {
  return techStacks.find((stack) => stack.slug.toLowerCase() === slug.toLowerCase());
}

export function getLecture(techSlug, lectureSlug) {
  const stack = getTechStack(techSlug);
  if (!stack) return null;
  return stack.lectures.find((l) => l.slug.toLowerCase() === lectureSlug.toLowerCase());
}
