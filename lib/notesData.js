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
        title: "Complete React Course — Module 1: Lecture 1: Introduction to React",
        summary: "A comprehensive masterclass lecture covering What is React, Why React, History, Vanilla JS vs React, Angular vs Vue comparison, Core Features, SPA, CSR vs SSR, Ecosystem, Component Architecture, Library vs Framework, and Practical Project Setup.",
        readTime: "30 min read",
        difficulty: "Beginner to Advanced",
        date: "2026-09-19",
        sections: [
          {
            heading: "1. What is React?",
            content: `React is an open-source, component-based front-end JavaScript library maintained by Meta (formerly Facebook) alongside a vast global community of individual developers and corporations. It is specifically designed for building fast, scalable, and interactive user interfaces for single-page web applications (SPAs) and cross-platform mobile apps.

**Understanding the Core Philosophy:**
In traditional front-end engineering, UI development was **Imperative**. You had to manually query DOM elements, attach event handlers, and update HTML strings node by node.

React revolutionized web development by introducing **Declarative UI Programming**. Instead of describing *how* to mutate the DOM step-by-step, you describe *what* the UI should look like for a specific state, and React handles all underlying DOM reconciliation automatically.

\`UI = f(State)\`

Whenever your application state (\`State\`) changes, React automatically re-evaluates the function (\`f\`) and updates the user interface (\`UI\`) in the browser with precision.`
          },
          {
            heading: "2. Why React? Business & Engineering Advantages",
            content: `Why has React remained the industry standard front-end technology for over a decade?

• **1. High Performance via Virtual DOM**: Traditional DOM operations are notoriously slow. React maintains a lightweight, in-memory representation of the DOM (the Virtual DOM), performing hyper-fast diffing calculations before applying minimal necessary updates to the actual browser DOM.

• **2. Component Reusability & Maintainability**: Complex user interfaces are broken down into small, self-contained, reusable blocks of code called Components. A button, navbar, modal, or product card can be written once and reused across thousands of pages.

• **3. Unidirectional Data Flow**: Data flows in a single direction (top-down from parent to child components via props). This strict data flow eliminates unpredictable side effects and makes large-scale applications easier to reason about, debug, and test.

• **4. Massive Open-Source Ecosystem**: With over 20 million weekly NPM downloads, React possesses the largest ecosystem of third-party libraries (routing, state management, UI frameworks, form handlers, and build tools).

• **5. Career & Industry Demand**: Millions of technology companies worldwide actively hire React developers, making it the highest-demand front-end skill in software engineering.`
          },
          {
            heading: "3. History & Evolution of React",
            content: `Understanding how React evolved provides context into why modern web development looks the way it does today:

• **2011 (Origin at Facebook)**: Jordan Walke, a software engineer at Facebook, created **FaxJS** (the early prototype of React) to solve newsfeed synchronization bugs and cascading chat re-render issues.
• **2012 (Instagram Acquisition)**: When Facebook acquired Instagram, React was integrated into Instagram.com, proving its power outside Facebook's internal codebase.
• **2013 (Open Source Launch)**: React was open-sourced at JSConf US in May 2013. Initially met with skepticism due to mixing HTML into JavaScript (JSX), it quickly won over developer adoption.
• **2015 (React Native)**: Meta announced React Native at ReactConf, allowing web developers to build native iOS and Android apps using React principles.
• **2017 (React 16 & Fiber Architecture)**: Meta completely rewrote React's core reconciliation algorithm under code-name **Fiber**, introducing asynchronous rendering and error boundaries.
• **2019 (React 16.8 & Hooks)**: Introduced **React Hooks** (\`useState\`, \`useEffect\`, \`useContext\`), enabling functional components to manage state and side effects without writing class components.
• **2022 (React 18 & Concurrent Features)**: Introduced Concurrent React, Automatic Batching, \`useTransition\`, and official React Server Components (RSC) integration.`
          },
          {
            heading: "4. React vs. Traditional JavaScript (Vanilla JS)",
            content: `Let's compare building a simple counter application in Vanilla JavaScript vs. React to illustrate the paradigm shift:

**Vanilla JavaScript (Imperative Approach):**
To increment a counter in Vanilla JS, you must manually query the DOM node, parse its text content, increment the value, and set \`innerText\` back to the DOM node.

\`\`\`javascript
// Vanilla JS
const btn = document.getElementById("increment-btn");
const display = document.getElementById("count-display");
let count = 0;

btn.addEventListener("click", () => {
  count++;
  display.innerText = count; // Manual DOM Mutation
});
\`\`\`

**React.js (Declarative Approach):**
In React, you declare state. React automatically watches state changes and updates the browser DOM for you.

\`\`\`jsx
// React.js
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
\`\`\`

**Key Differences:**
• Vanilla JS requires direct, manual DOM manipulation; React abstracts DOM updates behind the Virtual DOM.
• Vanilla JS easily creates bug-prone state drift in large projects; React guarantees UI always stays synchronized with state.`
          },
          {
            heading: "5. React vs. Angular vs. Vue (Complete Comparison)",
            content: `When selecting a front-end technology, engineering teams evaluate three dominant platforms:

| Feature | React.js | Angular | Vue.js |
|---|---|---|---|
| **Type** | UI Library | Complete Framework | Progressive Framework |
| **Creator** | Meta (Facebook) | Google | Evan You |
| **Syntax** | JSX (JS + XML) | HTML + TS Directives | HTML Templates + Directives |
| **Data Binding** | Unidirectional (One-way) | Bidirectional (Two-way) | Bidirectional (Two-way) |
| **DOM Engine** | Virtual DOM | Incremental DOM | Virtual DOM |
| **Learning Curve** | Moderate | Steep | Gentle |
| **Flexibility** | Extremely High | Low (Opinionated) | High |
| **Ecosystem** | Community Driven | Built-in (All-in-one) | Official Ecosystem |`
          },
          {
            heading: "6. Core Features of React",
            content: `React's architecture is powered by 5 fundamental pillars:

1. **JSX (JavaScript XML)**: A syntax extension for JavaScript that allows writing HTML-like code inside JavaScript files. JSX gets compiled down to standard \`React.createElement()\` function calls by compilers like Babel or SWC.

2. **Virtual DOM**: A lightweight JavaScript object representing the actual browser DOM tree in memory. React compares the new Virtual DOM with the previous Virtual DOM snapshot (**Diffing Algorithm**) and applies only the changes (**Reconciliation**) to the real DOM.

3. **Component-Based Architecture**: Splitting UIs into independent, isolated, reusable components that manage their own logic and layout.

4. **One-Way Data Binding (Unidirectional Data Flow)**: Data flows exclusively from parent components to child components via \`props\`. Children communicate upwards by invoking callback functions passed down as props.

5. **React Hooks Ecosystem**: Built-in functions like \`useState\`, \`useEffect\`, \`useMemo\`, and \`useCallback\` allowing functional components to handle state, side effects, caching, and lifecycle events.`
          },
          {
            heading: "7. Single Page Application (SPA)",
            content: `A **Single Page Application (SPA)** is a web application that loads a single initial HTML file (\`index.html\`) from the server.

**How SPA Navigation Works:**
1. User requests \`http://example.com/\`. Server sends back a single \`index.html\` file and JavaScript bundle.
2. User clicks a link to \`/about\`. Instead of making an HTTP request to the server for a new HTML page, JavaScript intercepts the URL change.
3. React renders the \`<About />\` component dynamically inside the existing page.
4. Data is fetched asynchronously via JSON API calls (\`fetch\` / \`axios\`).

**Benefits of SPAs:**
• Instantaneous page transitions with zero screen flickering.
• Desktop app-like smooth user experience.
• Reduced server workload since the server only sends raw JSON data rather than rendering HTML pages on every click.`
          },
          {
            heading: "8. Client-Side Rendering (CSR) vs. Server-Side Rendering (SSR)",
            content: `Understanding CSR vs. SSR is crucial for modern full-stack development:

• **Client-Side Rendering (CSR - Standard React)**:
  - Browser receives a minimal HTML template containing \`<div id="root"></div>\` and a bundled JavaScript file.
  - The browser executes JavaScript to construct the DOM tree on the user's device.
  - **Pros**: Fast subsequent page interaction; low server CPU overhead.
  - **Cons**: Slower initial First Contentful Paint (FCP); web crawlers may index blank pages if not executed properly.

• **Server-Side Rendering (SSR - Next.js)**:
  - The server compiles React components into full HTML strings on every request and sends ready-to-render HTML to the browser.
  - **Pros**: Blazing-fast initial page load; 100% SEO friendly out-of-the-box for search engine crawlers.
  - **Cons**: Higher server compute load; potential delay before page becomes interactive (**Hydration**).`
          },
          {
            heading: "9. The Modern React Ecosystem Breakdown",
            content: `When building enterprise software, React developers assemble a stack from these industry-standard tools:

• **Build Tools & Bundlers**: Vite, Next.js, Turbopack, Webpack, ESBuild
• **State Management**: Zustand, Redux Toolkit, Context API, Recoil, Jotai
• **Data Fetching & Caching**: TanStack Query (React Query), SWR, Axios
• **Routing**: React Router DOM (v6+), Next.js App Router
• **Styling Solutions**: Tailwind CSS, Styled-Components, CSS Modules, Chakra UI, Shadcn UI
• **Form Management**: React Hook Form, Formik, Zod validation
• **Mobile Development**: React Native, Expo`
          },
          {
            heading: "10. Where React is Used in Production",
            content: `React powers the world's most heavily trafficked digital products:

• **Meta / Facebook**: Newsfeed, Facebook Web, Ads Manager, Workplace.
• **Instagram**: 100% of Instagram Web is built with React.
• **Netflix**: Client-side UI across web and TV streaming devices.
• **Airbnb**: Design system implementation, search UI, and booking workflows.
• **Uber**: Driver web dashboards and web booking clients.
• **WhatsApp Web**: Real-time web messaging web app.
• **Shopify**: Merchant dashboards and store customization tools.`
          },
          {
            heading: "11. React's Component-Based Architecture in Depth",
            content: `React applications follow a **Tree Data Structure** of components:

\`\`\`
          [ App Root ]
          /          \\
    [ Header ]      [ Main Content ]
                    /            \\
             [ Sidebar ]     [ ProductGrid ]
                                   |
                            [ ProductCard ]
\`\`\`

**Component Principles:**
1. **Functional Components**: Functions returning JSX elements (Standard since React 16.8).
2. **Component Hierarchy**: Parent components compose child components.
3. **Props vs. State**:
   - **Props (Properties)**: External, read-only inputs passed into a component (Immutable).
   - **State**: Internal, mutable data managed within a component. Changing state triggers a component re-render.`
          },
          {
            heading: "12. React Library vs. Framework Debate",
            content: `Is React a Library or a Framework?

• **React is a UI Library**:
React handles *only* the View layer (\`V\` in MVC). It gives developers complete freedom to pick their own router, data fetching strategy, state manager, and project folder structure.

• **Next.js is a Full Framework Built on React**:
Frameworks like **Next.js** or **Remix** take React and provide an all-in-one opinionated structure (built-in file-system routing, server components, API routes, image optimization, and SSR/SSG build engines).`
          },
          {
            heading: "13. Practical Step 1 — Create Your First React App (Vite)",
            content: `We will use **Vite** (the modern industry standard build tool for scaffolding lightning-fast React apps).

Open your terminal (PowerShell, Command Prompt, or Terminal) and run:

\`npm create vite@latest my-first-react-app -- --template react\`

Vite will create a clean, modern React project folder named \`my-first-react-app\`.`
          },
          {
            heading: "14. Practical Step 2 — Run the Development Server",
            content: `Navigate into your project folder and install the dependencies:

\`cd my-first-react-app\`
\`npm install\`

Now launch the Vite development server with Hot Module Replacement (HMR):

\`npm run dev\`

Open your browser and navigate to **http://localhost:5173** to view your running React application!`,
            codeSnippet: `// Step-by-Step Terminal Commands:

// 1. Create project with Vite template
npm create vite@latest my-first-react-app -- --template react

// 2. Change directory into app folder
cd my-first-react-app

// 3. Install required node dependencies
npm install

// 4. Start local development server
npm run dev`
          },
          {
            heading: "15. Practical Step 3 — Understand the React Project Structure",
            content: `Here is a complete breakdown of every file created inside your React application:

📁 **my-first-react-app/**
├── 📄 **index.html** — The single HTML entry page containing \`<div id="root"></div>\`.
├── 📁 **public/** — Contains static public assets (images, favicons, logos).
├── 📁 **src/** — Source code directory where you write React code:
│   ├── 📄 **main.jsx** — Entry JavaScript file that mounts React into the \`#root\` DOM node using \`createRoot()\`.
│   ├── 📄 **App.jsx** — Root React component rendering the user interface.
│   ├── 📄 **App.css** — Stylesheet specifically for App component.
│   └── 📄 **index.css** — Global styles for the whole application.
├── 📄 **package.json** — Lists project metadata, dependencies (\`react\`, \`react-dom\`), and npm scripts (\`dev\`, \`build\`, \`preview\`).
└── 📄 **vite.config.js** — Configuration file for the Vite build tool.`
          },
          {
            heading: "16. Practical Step 4 — Hands-On Code: Writing Your First Components",
            content: `Open \`src/App.jsx\` in your code editor (VS Code) and replace its contents with this complete, interactive React code example to build a Header, Feature List, and Interactive Counter component:`,
            codeSnippet: `// src/App.jsx — Complete Hands-on Component Architecture Example
import React, { useState } from 'react';
import './App.css';

// 1. Header Component (Receives title & subtitle via Props)
function Header({ title, subtitle }) {
  return (
    <header className="header-banner">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </header>
  );
}

// 2. Interactive Counter Component (Manages State with useState Hook)
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="counter-card">
      <h3>Interactive Counter Component</h3>
      <p className="count-display">Current Count: <strong>{count}</strong></p>
      <div className="button-group">
        <button onClick={() => setCount(count + 1)} className="btn add">+ Increment</button>
        <button onClick={() => setCount(count - 1)} className="btn sub">- Decrement</button>
        <button onClick={() => setCount(0)} className="btn reset">Reset Counter</button>
      </div>
    </div>
  );
}

// 3. Main Root Component
export default function App() {
  return (
    <div className="app-container">
      <Header 
        title="Welcome to React.js Lecture 1 🚀" 
        subtitle="Mastering React Fundamentals, Virtual DOM & Component Architecture" 
      />
      <main className="content-body">
        <section className="intro">
          <h2>Congratulations! 🎉</h2>
          <p>You have successfully launched your first React component architecture application!</p>
        </section>
        <Counter />
      </main>
    </div>
  );
}`
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
• **Colocated Data Fetching**: Fetch data directly inside async Server Components using standard fetch() with automatic caching.`
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
}`
          },
          {
            heading: "3. Dynamic Routing & Layout Architecture",
            content: `The App Router relies on folder-based conventions:
• \`app/page.js\` -> Home page (\`/\`)
• \`app/notes/page.js\` -> Notes hub (\`/notes\`)
• \`app/notes/[techStack]/page.js\` -> Dynamic Tech Stack Route (\`/notes/react\`)
• \`app/notes/[techStack]/[lectureSlug]/page.js\` -> Dynamic Lecture Route (\`/notes/react/lecture-1\`)`
          },
          {
            heading: "4. Summary & Production Tips",
            content: `• Keep components as Server Components by default; add \`"use client"\` at the very top of files only when interactivity is required.
• Leverage Next.js built-in \`Script\`, \`Image\`, and \`Font\` components for optimal Core Web Vitals scores.`
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
            content: `Python is a high-level, interpreted, dynamically typed programming language known for clean syntax, high readability, and a massive ecosystem of libraries (FastAPI, Django, NumPy, Pandas, PyTorch, Scikit-learn).`
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
print("Squares:", squares)`
          },
          {
            heading: "3. Context Managers (\`with\` statement)",
            content: `Context managers guarantee resource cleanup (e.g. opening files, managing database connections, acquiring locks) even if exceptions are raised.`
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
• **Generative AI & LLMs**: Transformer models trained on vast text corpora to generate text, code, images, and reason step-by-step.`
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
}`
          },
          {
            heading: "3. Best Practices in Prompt Engineering",
            content: `• **Assign a Clear Role**: "You are a Senior Full-Stack Engineer reviewing a React PR."
• **Provide Structural Output Format**: Request JSON schemas or Markdown tables.
• **Use Few-Shot Examples**: Include 2-3 sample input-output pairs to guide model output accuracy.`
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
