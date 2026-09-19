export const reactData = {
  id: "react",
  slug: "react",
  name: "React.js",
  icon: "fab fa-react",
  iconColor: "#61dafb",
  badge: "Frontend Library",
  description: "Master React 18+, Component Architecture, Hooks, Virtual DOM, State Management, and Production Optimization.",
  totalLectures: 5,
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
    },
    {
      slug: "lecture-2",
      number: 2,
      title: "Complete React Course — Module 1: Lecture 2: Setting Up React",
      summary: "A comprehensive masterclass guide covering Node.js & npm, npm vs npx, Vite build tool, deep project folder structure breakdown (package.json, package-lock.json, node_modules, src, public, index.html), development vs production builds, and hands-on practical setup.",
      readTime: "25 min read",
      difficulty: "Beginner to Intermediate",
      date: "2026-09-19",
      sections: [
        {
          heading: "1. Understanding Node.js and NPM",
          content: `Before creating a modern React application, we must understand the environment that powers modern JavaScript toolchains: **Node.js** and **NPM**.

• **What is Node.js?**
Node.js is an open-source, cross-platform JavaScript runtime environment built on Google Chrome's V8 engine. It allows developers to run JavaScript code *outside* the web browser (on your computer's operating system or server).

• **Why Do We Need Node.js for React Development?**
React code runs inside the browser. However, during development, we write modern JSX, ES6+ modules, and CSS preprocessors that browsers cannot parse natively. We need Node.js to run build tools (like Vite, SWC, or Babel) that transpile, bundle, and serve our React code during development.

• **What is NPM (Node Package Manager)?**
NPM is the default package manager for Node.js and the world's largest software registry. It allows developers to install third-party open-source libraries (such as \`react\`, \`react-dom\`, \`react-router-dom\`, \`tailwindcss\`, and \`axios\`) directly into their projects.`
        },
        {
          heading: "2. NPM vs. NPX: Key Differences & When to Use Which",
          content: `Developers often confuse \`npm\` and \`npx\`. Let's clarify the fundamental differences:

• **NPM (Node Package Manager)**:
  - **Purpose**: Installs, updates, and manages project dependencies.
  - **Behavior**: Downloads packages into your project's local \`node_modules/\` folder or global computer path (\`npm install -g\`).
  - **Example**: \`npm install react\`

• **NPX (Node Package Execute)**:
  - **Purpose**: Executes Node binaries directly without permanently installing them on your machine.
  - **Behavior**: Downloads a package to a temporary cache, executes the CLI binary command, and cleans up afterwards.
  - **Example**: \`npx create-react-app my-app\` or \`npx tailwindcss init\`

| Feature | NPM | NPX |
|---|---|---|
| **Primary Function** | Package Management (Install/Uninstall) | Package Execution (Run CLI commands) |
| **Storage** | Saves packages in \`node_modules/\` | Temporarily caches and cleans up |
| **Global Install Needed?** | Yes, if running CLI commands | No, runs latest CLI on-demand |
| **Best Used For** | Adding libraries like React, Axios, Lodash | Running setup scripts like \`vite\` or \`tailwindcss\` |`
        },
        {
          heading: "3. What is Vite & Why Vite Over Create React App (CRA)?",
          content: `**What is Vite?**
Vite (French for "fast", pronounced */veet/*) is a next-generation front-end build tool created by Evan You (the creator of Vue.js). It provides an ultra-fast local development server and optimized production bundler.

**Why Has the Industry Abandoned Create React App (CRA) for Vite?**

• **The Problem with Create React App (Webpack)**:
CRA uses **Webpack** as its bundler. When you run \`npm start\` in CRA, Webpack must scan, compile, and bundle *every single file* in your entire application before the local server can start. As your project grows to hundreds of components, server startup time degrades to 30-60 seconds, and Hot Module Replacement (HMR) slows down.

• **How Vite Solves This (Native ES Modules + ESBuild)**:
1. **Instant Dev Server Start**: Vite takes advantage of native browser **ES Modules (ESM)**. It doesn't bundle your code on startup. Instead, it serves source code on-demand as the browser requests each file!
2. **Lightning-Fast Pre-bundling**: Vite uses **ESBuild** (written in Go), which pre-bundles dependencies 10x-100x faster than traditional JavaScript-based bundlers.
3. **Instant Hot Module Replacement (HMR)**: Editing a file updates only that specific component in the browser in less than 50 milliseconds regardless of application size.`
        },
        {
          heading: "4. Creating a React Project Step-by-Step",
          content: `Let's walk through the standard terminal setup for creating a new React application with Vite:

**Step 1: Open Your Terminal**
Open VS Code Terminal, Windows PowerShell, Command Prompt, or macOS Terminal.

**Step 2: Run the Vite Creation Command**
\`npm create vite@latest my-app -- --template react\`

**Step 3: Interactive Prompts (if omitting \`--template react\`)**:
1. Project name: \`my-app\`
2. Select a framework: **React**
3. Select a variant: **JavaScript** (or **TypeScript** / **React + SWC**)

This command instantly creates a directory named \`my-app/\` populated with the modern React template.`
        },
        {
          heading: "5. Deep Dive into React Project Folder Structure",
          content: `Let's examine the generated file tree of a modern Vite React application:

\`\`\`
my-app/
├── 📁 node_modules/       # Installed open-source dependencies
├── 📁 public/             # Static un-bundled assets (favicons, public images)
├── 📁 src/                # Primary application source code
│   ├── 📁 assets/         # Imported component images and SVGs
│   ├── 📄 App.css         # Styling for App component
│   ├── 📄 App.jsx         # Root React UI Component
│   ├── 📄 index.css       # Global baseline CSS stylesheet
│   └── 📄 main.jsx        # JavaScript entry point mounting React
├── 📄 .gitignore          # Files excluded from Git version control
├── 📄 index.html          # Root HTML document shell
├── 📄 package.json        # Project manifest & dependency configuration
├── 📄 package-lock.json   # Deterministic version lockfile
└── 📄 vite.config.js      # Vite bundler configuration
\`\`\``
        },
        {
          heading: "6. Understanding package.json",
          content: `The \`package.json\` file is the heart of any Node.js & React project. It contains metadata, CLI scripts, and project dependencies.

**Key Sections in package.json:**

1. **\`scripts\`**: Short commands executed via \`npm run <script-name>\`:
   - \`"dev": "vite"\` — Launches local dev server with HMR.
   - \`"build": "vite build"\` — Compiles optimized production bundle into \`dist/\`.
   - \`"lint": "eslint ."\` — Runs ESLint code quality checks.
   - \`"preview": "vite preview"\` — Serves production build locally for testing.

2. **\`dependencies\`**: Packages required for the application to function in production (e.g. \`react\`, \`react-dom\`).

3. **\`devDependencies\`**: Packages required only during development and build compilation (e.g. \`vite\`, \`eslint\`, \`@vitejs/plugin-react\`).`,
          codeSnippet: `// Example package.json breakdown
{
  "name": "my-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "vite": "^5.4.1"
  }
}`
        },
        {
          heading: "7. Understanding package-lock.json",
          content: `While \`package.json\` specifies version ranges using caret symbols (\`^18.3.1\`), **\`package-lock.json\`** records the **exact, literal version numbers** of every single installed package and nested sub-dependency tree.

**Why package-lock.json is Critical:**
• **Deterministic Builds**: Ensures that every team member and deployment server (Vercel, Netlify, AWS) installs the exact same dependency tree, preventing "works on my machine" bugs.
• **Security & Integrity**: Stores cryptographic SHA hashes for installed package tarballs.

⚠️ **Golden Rule**: Never delete or manually modify \`package-lock.json\`. Let NPM update it automatically when running \`npm install\` or \`npm update\`.`
        },
        {
          heading: "8. Understanding node_modules/",
          content: `The \`node_modules/\` folder contains the actual compiled JavaScript code of all third-party libraries listed in \`package.json\` and \`package-lock.json\`.

**Important Rules for node_modules:**
• **Extremely Heavy**: Can contain thousands of files and consume hundreds of megabytes.
• **Never Commit to Git**: \`node_modules/\` is automatically added to \`.gitignore\`.
• **Recreatable**: Anyone who clones your repository can recreate \`node_modules/\` simply by running \`npm install\`.`
        },
        {
          heading: "9. Understanding the src/ Directory (main.jsx & App.jsx)",
          content: `The \`src/\` folder is where you write 99% of your React application code:

• **\`src/main.jsx\` (The Bridge):**
\`main.jsx\` is the entry JavaScript file. It selects the \`<div id="root"></div>\` from \`index.html\` and uses React 18's \`createRoot()\` API to mount the root \`<App />\` component:

\`\`\`jsx
// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
\`\`\`

• **\`src/App.jsx\` (The Root Component):**
\`App.jsx\` is the top-level parent component that renders your application UI layout.`
        },
        {
          heading: "10. Understanding public/ Directory & index.html",
          content: `• **\`public/\` Directory**:
Files in \`public/\` are served directly by the web server at root URL path without being processed or transformed by Vite's bundler. Use \`public/\` for static assets like \`favicon.ico\` or \`robots.txt\`.

• **\`index.html\` Shell**:
In Vite, \`index.html\` is placed in the project root directory (unlike CRA where it was inside \`public/\`). It contains the root mount point:

\`\`\`html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>My React App</title>
  </head>
  <body>
    <!-- React mounts the UI inside this div -->
    <div id="root"></div>
    <!-- Vite loads main.jsx as an ES Module -->
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
\`\`\``
        },
        {
          heading: "11. Development Build vs. Production Build",
          content: `React applications execute in two distinct modes:

• **1. Development Mode (\`npm run dev\`)**:
  - Optimized for developer speed and debugging.
  - Includes detailed warnings, stack trace overlays, and \`<React.StrictMode>\` double-rendering checks.
  - Uses un-minified code with Source Maps for easy browser debugging.
  - Runs local HMR dev server.

• **2. Production Mode (\`npm run build\`)**:
  - Optimized for end-user load speed and security.
  - Code is tree-shaken (unused code removed), minified, and obfuscated.
  - CSS is extracted into separate compressed bundles.
  - JavaScript is split into cacheable chunk files.
  - Outputs output files into a static \`dist/\` folder ready to deploy on any hosting provider (Vercel, Netlify, AWS S3, Nginx).`
        },
        {
          heading: "12. Practical Hands-On Exercise — Complete Project Setup",
          content: `Follow this step-by-step practical walk-through to create, run, and build your React application:`,
          codeSnippet: `// Terminal Practical Guide:

// Step 1: Create React App with Vite
npm create vite@latest my-app -- --template react

// Step 2: Navigate into the newly created folder
cd my-app

// Step 3: Install all node dependencies
npm install

// Step 4: Run local development server
npm run dev
// Local server URL: http://localhost:5173

// Step 5: Test Production Build
npm run build
// Compiles production bundle into /dist folder

// Step 6: Preview Production Build locally
npm run preview`
        }
      ]
    },
    {
      slug: "lecture-3",
      number: 3,
      title: "Complete React Course — Module 1: Lecture 3: JSX Deep Dive",
      summary: "A masterclass tutorial covering What is JSX, Why JSX, Babel Compilation, Embedding JS Expressions ({}), Attributes & className, Inline Styles, Self-Closing Tags, Fragment Rules, Comments, JSX vs HTML comparison, Common Pitfalls, Interview Questions, and Hands-on Coding.",
      readTime: "30 min read",
      difficulty: "Beginner to Intermediate",
      date: "2026-09-19",
      sections: [
        {
          heading: "1. What is JSX? (Concept & Definition)",
          content: `**JSX** stands for **JavaScript XML**. It is a syntax extension for JavaScript created by Meta for use with React.

JSX allows developers to write HTML-like markup directly inside JavaScript files alongside logic, variables, and event handlers.

**Syntax Example:**
\`const element = <h1>Hello, World!</h1>;\`

Although JSX looks like HTML, it is **not HTML**. It is full-fledged JavaScript code syntactically disguised as HTML to make user interface development intuitive and expressive.`
        },
        {
          heading: "2. Why JSX? (Engineering Benefits & Security)",
          content: `Before JSX, template engines (like Handlebars or Angular templates) separated HTML logic from JS files. Meta engineers realized that UI rendering logic is inherently coupled with other UI logic (event handling, state changes, formatting).

**Key Advantages of JSX:**
1. **Visual Clarity**: HTML-like structures are vastly easier to read, write, and maintain than deeply nested JavaScript function calls.
2. **Full Power of JavaScript**: You have access to native JavaScript expressions, array methods (\`map\`, \`filter\`), and ternary operators inside your templates.
3. **Compile-Time Error Checking**: Syntax errors and unclosed tags are caught instantly during compilation before reaching production.
4. **Built-in Security Against XSS (Cross-Site Scripting)**: By default, React DOM escapes any values embedded in JSX before rendering them. Everything is converted to a string, preventing malicious script injection.`
        },
        {
          heading: "3. How JSX Works Under the Hood (Babel/SWC Compilation)",
          content: `Browsers **cannot read JSX directly**. When you run your application, build tools like Babel or SWC compile every JSX element down to standard JavaScript function calls (\`React.createElement()\`).

**What You Write in JSX:**
\`\`\`jsx
const element = (
  <h1 className="title" style={{ color: "blue" }}>
    Hello, Ravindra!
  </h1>
);
\`\`\`

**What Babel Compiles It To:**
\`\`\`javascript
const element = React.createElement(
  'h1',
  { className: 'title', style: { color: 'blue' } },
  'Hello, Ravindra!'
);
\`\`\`

**React.createElement Signature:**
\`React.createElement(type, [props], [...children])\`
• \`type\`: HTML tag string ('h1', 'div') or component function.
• \`props\`: Object containing attributes and inline styles.
• \`children\`: Inner content or child elements.`
        },
        {
          heading: "4. JSX Expressions & Embedding JavaScript inside JSX ({})",
          content: `You can embed any valid **JavaScript Expression** inside JSX by wrapping it in curly braces \`{}\`.

**What Counts as a JavaScript Expression?**
An expression is any piece of code that evaluates to a single value (e.g. variables, math operations, string concatenation, function calls, ternary operators).

\`\`\`jsx
const userName = "Ravindra Nath Jha";
const userAge = 25;
const isLoggedIn = true;

function calculateScore(a, b) {
  return a * b;
}

export default function UserCard() {
  return (
    <div className="card">
      <h2>Developer: {userName.toUpperCase()}</h2>
      <p>Age: {userAge + 1} years old</p>
      <p>Status: {isLoggedIn ? "Active Member ✅" : "Guest ❌"}</p>
      <p>Calculated Score: {calculateScore(10, 5)}</p>
    </div>
  );
}
\`\`\`

⚠️ **Note**: Statements (like \`if/else\` blocks, \`for\` loops, or \`while\` loops) are NOT expressions and cannot be placed directly inside \`{}\`. Use ternary operators or logical \`&&\` instead.`
        },
        {
          heading: "5. JSX Attributes & CamelCase Naming Convention",
          content: `Because JSX is closer to JavaScript than HTML, React uses **camelCase** property naming for DOM attributes instead of HTML attribute names.

**Common Attribute Translations:**
• \`class\` ➔ **\`className\`**
• \`for\` ➔ **\`htmlFor\`**
• \`tabindex\` ➔ **\`tabIndex\`**
• \`onclick\` ➔ **\`onClick\`**
• \`onchange\` ➔ **\`onChange\`**
• \`autocomplete\` ➔ **\`autoComplete\`**

\`\`\`jsx
<label htmlFor="user-email">Email Address:</label>
<input id="user-email" className="input-field" tabIndex={1} onChange={handleChange} />
\`\`\``
        },
        {
          heading: "6. Why className Instead of class?",
          content: `In standard JavaScript (ES6+), **\`class\`** is a reserved language keyword used to declare JavaScript classes (\`class Car {}\`).

If React allowed \`class="title"\` inside JSX (which is JavaScript under the hood), the JavaScript parser would throw a syntax conflict. Therefore, React uses **\`className\`** to assign CSS classes to elements.`
        },
        {
          heading: "7. Inline Styles in JSX",
          content: `Inline styles in JSX are not passed as CSS strings. Instead, they are passed as **JavaScript Objects** where property names use camelCase.

Notice the outer \`{}\` opens JavaScript mode, and the inner \`{}\` creates the object:

\`\`\`jsx
const cardStyle = {
  backgroundColor: "#002057",
  color: "#ffffff",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
};

function StyledCard() {
  return (
    <div style={cardStyle}>
      <h3 style={{ fontSize: "24px", marginTop: 0 }}>Inline Style Example</h3>
      <p style={{ color: "#ff7b00", fontWeight: "bold" }}>Highlighted Accent Text</p>
    </div>
  );
}
\`\`\``
        },
        {
          heading: "8. Self-Closing Tags Rule",
          content: `In HTML5, self-closing tags like \`<img>\`, \`<input>\`, and \`<br>\` do not require a closing slash.

In JSX, **ALL self-closing tags MUST be explicitly closed with \`/>\`**. Forgetting the slash will cause a compilation syntax error!

\`\`\`jsx
// ❌ WRONG (HTML style - Error in JSX)
<img src="avatar.jpg" alt="User">
<input type="text">
<br>

// ✅ CORRECT (JSX style)
<img src="avatar.jpg" alt="User" />
<input type="text" />
<br />
\`\`\``
        },
        {
          heading: "9. Single Root Element Rule & Parent Containers",
          content: `A React component **MUST return a single root element**.

**Why?**
Remember that JSX transpile to \`React.createElement()\`. A JavaScript function cannot return two values simultaneously without wrapping them in an array or container.

\`\`\`jsx
// ❌ WRONG (Multiple adjacent root elements)
return (
  <h1>Title</h1>
  <p>Paragraph</p>
);

// ✅ CORRECT (Wrapped in a parent div)
return (
  <div>
    <h1>Title</h1>
    <p>Paragraph</p>
  </div>
);
\`\`\``
        },
        {
          heading: "10. React Fragments (<React.Fragment> & <>)",
          content: `Wrapping elements in extra \`<div>\` tags can pollute your HTML DOM tree, breaking CSS Flexbox/Grid layouts.

**React Fragments** allow you to group multiple adjacent elements without adding extra nodes to the DOM.

\`\`\`jsx
// 1. Shorthand Syntax (Most Common)
function ProductDetails() {
  return (
    <>
      <h2>iPhone 15 Pro</h2>
      <p>Price: $999</p>
    </>
  );
}

// 2. Explicit Syntax (Required when passing a key in map loops)
import { Fragment } from 'react';

function ProductList({ products }) {
  return (
    <div>
      {products.map((item) => (
        <Fragment key={item.id}>
          <h3>{item.name}</h3>
          <p>{item.price}</p>
        </Fragment>
      ))}
    </div>
  );
}
\`\`\``
        },
        {
          heading: "11. JSX Comments Syntax",
          content: `To write comments inside JSX, you must use JavaScript block comment syntax inside curly braces: \`{/* Comment here */}\`.

\`\`\`jsx
function App() {
  return (
    <div>
      {/* This is a single-line comment inside JSX */}
      <h1>Welcome to React JSX</h1>
      
      {/* 
        This is a multi-line comment 
        explaining the layout structure 
      */}
      <p>Paragraph content</p>
    </div>
  );
}
\`\`\``
        },
        {
          heading: "12. JSX vs. HTML (Complete Comparison Matrix)",
          content: `| Feature | HTML | JSX |
|---|---|---|
| **Attribute Names** | Lowercase (\`class\`, \`for\`, \`onclick\`) | CamelCase (\`className\`, \`htmlFor\`, \`onClick\`) |
| **Self-Closing Tags** | Optional (\`<img>\`, \`<br>\`) | Mandatory (\`<img />\`, \`<br />\`) |
| **Inline Styles** | String: \`style="color: red;"\` | Object: \`style={{ color: "red" }}\` |
| **JS Expressions** | Not Supported | Embedded via \`{expression}\` |
| **Root Requirement** | Multiple tags allowed at root | Must return a Single Root or Fragment |
| **Comments** | \`<!-- Comment -->\` | \`{/* Comment */}\` |
| **XSS Prevention** | None by default | Automatically Escaped by React |`
        },
        {
          heading: "13. Common Mistakes & Gotchas in JSX",
          content: `1. **Using \`class\` instead of \`className\`**: Throws browser console warnings.
2. **Forgetting curly braces for non-string values**: \`<Card count="5" />\` passes a string \`"5"\`. Use \`<Card count={5} />\` to pass a number.
3. **Placing \`if/else\` inside \`{}\`**: Use ternary operators (\`condition ? a : b\`) or logical AND (\`condition && <Component />\`).
4. **Unclosed Tags**: Forgetting \`/>\` on \`<input />\` or \`<img />\`.
5. **Lowercase Component Names**: Component tags MUST start with a Capital letter (\`<UserCard />\`). Lowercase tags (\`<userCard />\`) are treated as built-in HTML tags.`
        },
        {
          heading: "14. Top React Interview Questions on JSX",
          content: `**Q1: Can browsers read JSX directly?**
*Answer*: No. Browsers can only read standard JavaScript objects. JSX must be transpiled by build tools (Babel or SWC) into \`React.createElement()\` calls before execution.

**Q2: What is the difference between \`React.Fragment\` and a \`<div>\`?**
*Answer*: A \`<div>\` adds a real DOM node to the browser page, which can break CSS Grid/Flexbox layouts. A \`React.Fragment\` is invisible in the DOM tree and adds zero extra HTML nodes.

**Q3: How does JSX prevent XSS (Cross-Site Scripting) attacks?**
*Answer*: React DOM automatically escapes any values embedded in JSX before rendering them. Everything is converted to a string, preventing malicious script tag execution.`
        },
        {
          heading: "15. Practical Task 1 — Dynamic User Profile Card Example",
          content: `Here is a complete, real-world JSX component demonstrating expressions, ternary conditions, camelCase attributes, and inline styles:`,
          codeSnippet: `// Dynamic User Profile Card in JSX
import React from 'react';

const user = {
  name: "Ravindra Nath Jha",
  role: "Full Stack Developer",
  experience: 4,
  isAvailable: true,
  skills: ["React.js", "Node.js", "Python", "Next.js"]
};

export default function UserProfileCard() {
  return (
    <div className="user-profile-card" style={{ padding: "20px", background: "#f8fafc", borderRadius: "12px" }}>
      <h2 style={{ color: "#002057" }}>{user.name}</h2>
      <p style={{ color: "#2506ad", fontWeight: "bold" }}>{user.role}</p>
      
      <p>Experience: {user.experience} Years</p>
      <p>Status: {user.isAvailable ? "Available for Hire 💼" : "Busy 🔴"}</p>

      <h4>Core Tech Stack ({user.skills.length}):</h4>
      <ul>
        {user.skills.map((skill, index) => (
          <li key={index}>{skill}</li>
        ))}
      </ul>
    </div>
  );
}`
        },
        {
          heading: "16. Practical Task 2 — Complete Interactive JSX Showcase",
          content: `Replace \`src/App.jsx\` with this code to test and verify all JSX rules, comments, fragments, and dynamic bindings in your live development server:`,
          codeSnippet: `// src/App.jsx — Complete JSX Masterclass Verification Component
import React from 'react';

export default function App() {
  const developerName = "Ravindra Nath Jha";
  const currentYear = new Date().getFullYear();
  const isOnline = true;

  const cardStyle = {
    backgroundColor: "#ffffff",
    border: "2px solid #e2e8f0",
    borderRadius: "16px",
    padding: "24px",
    marginTop: "20px"
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      {/* Header Banner Fragment */}
      <>
        <h1 style={{ color: "#2506ad" }}>JSX Masterclass Demo 🚀</h1>
        <p>Mastering Expressions, Attributes, Fragments, and Rules in React</p>
      </>

      <div style={cardStyle}>
        <h2>Developer: {developerName}</h2>
        <p className="status-badge">
          Status: {isOnline ? "Online 🟢" : "Offline 🔴"}
        </p>
        <p>Copyright © {currentYear} Ravindra Portfolio</p>
        
        <label htmlFor="feedback-input">Feedback:</label>
        <br />
        <input 
          id="feedback-input"
          type="text" 
          placeholder="Enter your thoughts on JSX..." 
          style={{ width: "100%", padding: "10px", marginTop: "8px" }}
        />
      </div>
    </div>
  );
}`
        }
      ]
    },
    {
      slug: "lecture-4",
      number: 4,
      title: "Complete React Course — Module 1: Lecture 4: React Components Architecture",
      summary: "A masterclass tutorial on What is a Component, Functional Components, PascalCase Naming Conventions, Composition, Reusability, Parent-Child Hierarchy, Default vs Named Exports, Common Mistakes, Interview Questions, and Building a Full Multi-Component Layout Architecture.",
      readTime: "30 min read",
      difficulty: "Beginner to Intermediate",
      date: "2026-09-19",
      sections: [
        {
          heading: "1. What is a React Component?",
          content: `A **Component** is the fundamental building block of a React user interface.

In traditional web development, a webpage is built as one monolithic HTML file. In React, a webpage is broken down into small, isolated, reusable pieces of UI called **Components**.

**Analogy:**
Think of a React component like a **LEGO brick**. You can create individual bricks (buttons, headers, cards) and assemble them together to build complex structures (dashboards, e-commerce stores, social media feeds).

Technically, a React Component is a JavaScript function that accepts inputs (called **Props**) and returns a React element tree (written in **JSX**).`
        },
        {
          heading: "2. Functional Components vs. Class Components",
          content: `React components can be written in two ways:

• **1. Functional Components (Modern Standard)**:
Simple JavaScript functions that return JSX. Since React 16.8, functional components can manage state and side effects using **React Hooks**.
\`\`\`jsx
function Welcome() {
  return <h1>Welcome to React!</h1>;
}
\`\`\`

• **2. Class Components (Legacy / Historical)**:
ES6 JavaScript classes extending \`React.Component\` requiring a \`render()\` method.
\`\`\`jsx
class Welcome extends React.Component {
  render() {
    return <h1>Welcome to React!</h1>;
  }
}
\`\`\`

⚠️ **Industry Standard**: Modern React codebases exclusively use **Functional Components with Hooks**. Class components are considered legacy.`
        },
        {
          heading: "3. Component Naming Conventions (PascalCase Rule)",
          content: `React Component names MUST start with a **Capital Letter (PascalCase)**.

• **Correct**: \`<Navbar />\`, \`<ProductCard />\`, \`<UserProfile />\`
• **Incorrect**: \`<navbar />\`, \`<productCard />\`, \`<user_profile />\`

**Why PascalCase is Mandatory:**
React uses the first letter of a JSX tag to determine whether it is dealing with a built-in HTML tag or a custom React component:
• Lowercase tags (\`<div />\`, \`<button />\`, \`<p />\`) are compiled to standard HTML strings: \`React.createElement('div')\`.
• Capitalized tags (\`<Navbar />\`) are compiled as JavaScript component functions: \`React.createElement(Navbar)\`.`
        },
        {
          heading: "4. Component Composition & Reusability",
          content: `**Component Composition** is the practice of combining small components to form larger components.

**Why Reusability Matters:**
Imagine you need to display 100 product items on an e-commerce website. Without components, you would duplicate 100 blocks of HTML code. With a reusable \`<ProductCard />\` component, you write the layout once and reuse it 100 times with different data.`
        },
        {
          heading: "5. Parent and Child Components & Component Hierarchy",
          content: `React components organize into a **Parent-Child Tree Hierarchy**:

• **Parent Component**: A component that renders another component inside its return statement.
• **Child Component**: A component nested inside a parent component.

\`\`\`
          [ App (Parent Root) ]
           /        |        \\
    [ Navbar ]  [ Hero ]  [ Footer ]
                    |
            [ ProductList ]
                    |
            [ ProductCard ] (Child)
\`\`\``
        },
        {
          heading: "6. Importing and Exporting Components (Modules)",
          content: `React applications use ES6 JavaScript modules (\`import\` and \`export\`) to split code across separate files.`
        },
        {
          heading: "7. Default Exports (export default)",
          content: `A file can have only **ONE default export**.

**Export Syntax:**
\`\`\`jsx
// Navbar.jsx
export default function Navbar() {
  return <nav>My Navbar</nav>;
}
\`\`\`

**Import Syntax:**
When importing a default export, you do not use curly braces. You can even rename the imported component if desired:
\`\`\`jsx
// App.jsx
import Navbar from './Navbar';
// OR import MyCustomNavbar from './Navbar';
\`\`\``
        },
        {
          heading: "8. Named Exports (export const)",
          content: `A file can have **MULTIPLE named exports**.

**Export Syntax:**
\`\`\`jsx
// Buttons.jsx
export function PrimaryButton() {
  return <button className="btn-primary">Click Me</button>;
}

export function SecondaryButton() {
  return <button className="btn-secondary">Cancel</button>;
}
\`\`\`

**Import Syntax:**
Named exports MUST be imported inside curly braces \`{}\` matching the exact exported name:
\`\`\`jsx
// App.jsx
import { PrimaryButton, SecondaryButton } from './Buttons';
\`\`\``
        },
        {
          heading: "9. Default vs. Named Exports Comparison",
          content: `| Feature | Default Export | Named Export |
|---|---|---|
| **Exports per file** | Exactly One (\`1\`) | Unlimited (\`N\`) |
| **Export Syntax** | \`export default ComponentName\` | \`export const ComponentName\` |
| **Import Syntax** | \`import ComponentName from './file'\` | \`import { ComponentName } from './file'\` |
| **Rename on Import?** | Yes (\`import Custom from './file'\`) | No (Requires \`as\` syntax: \`import { A as B }\`) |`
        },
        {
          heading: "10. Common Mistakes with Components",
          content: `1. **Defining a Component inside another Component**: Never nest component function definitions inside another component function; it causes full component re-instantiation on every render.
2. **Forgetting to return JSX**: A component must return valid JSX or \`null\`.
3. **Using Lowercase Names**: Writing \`<buttonCard />\` instead of \`<ButtonCard />\`.`
        },
        {
          heading: "11. Top React Interview Questions on Components",
          content: `**Q1: What is a Component in React?**
*Answer*: A component is a self-contained, reusable block of UI logic and template written in JavaScript (JSX) that returns React elements.

**Q2: What is the difference between Default Export and Named Export?**
*Answer*: A file can have only one default export (imported without \`{}\`), whereas a file can have multiple named exports (imported with \`{}\` using exact names).`
        },
        {
          heading: "12. Practical Hands-On Exercise — Building App Component Architecture Tree",
          content: `Let's build a complete multi-component application matching this exact architecture hierarchy:

📁 **src/**
├── 📄 **App.jsx** (Root Parent)
├── 📁 **components/**
│   ├── 📄 **Navbar.jsx**
│   ├── 📄 **Hero.jsx**
│   ├── 📄 **ProductList.jsx**
│   ├── 📄 **ProductCard.jsx**
│   └── 📄 **Footer.jsx**`,
          codeSnippet: `// 1. src/components/Navbar.jsx
import React from 'react';

export default function Navbar() {
  return (
    <nav className="navbar" style={{ padding: "15px", background: "#002057", color: "#fff" }}>
      <h2>E-Commerce Store</h2>
    </nav>
  );
}

// 2. src/components/Hero.jsx
import React from 'react';

export default function Hero() {
  return (
    <div className="hero" style={{ padding: "30px", background: "#f1f5f9", textAlign: "center" }}>
      <h1>Featured Deals 🛍️</h1>
      <p>Explore high quality tech gadgets built with React Component Architecture!</p>
    </div>
  );
}

// 3. src/components/ProductCard.jsx
import React from 'react';

export function ProductCard({ name, price }) {
  return (
    <div style={{ border: "1px solid #cbd5e1", borderRadius: "10px", padding: "15px", margin: "10px 0" }}>
      <h4>{name}</h4>
      <p>Price: ₹{price}</p>
    </div>
  );
}

// 4. src/components/ProductList.jsx
import React from 'react';
import { ProductCard } from './ProductCard';

export default function ProductList() {
  return (
    <div className="product-list" style={{ padding: "20px" }}>
      <h3>Product Catalog</h3>
      <ProductCard name="iPhone 15 Pro" price={129999} />
      <ProductCard name="MacBook Air M3" price={114900} />
    </div>
  );
}

// 5. src/components/Footer.jsx
import React from 'react';

export default function Footer() {
  return (
    <footer style={{ padding: "15px", background: "#0f172a", color: "#fff", textAlign: "center" }}>
      <p>Copyright © 2026 Ravindra Portfolio Store</p>
    </footer>
  );
}

// 6. src/App.jsx (Root Composition)
import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductList from './components/ProductList';
import Footer from './components/Footer';

export default function App() {
  return (
    <div>
      <Navbar />
      <Hero />
      <ProductList />
      <Footer />
    </div>
  );
}`
        }
      ]
    },
    {
      slug: "lecture-5",
      number: 5,
      title: "Complete React Course — Module 1: Lecture 5: React Props Deep Dive",
      summary: "A masterclass tutorial covering What are Props, Passing & Receiving Props, Destructuring, Default Values, Read-Only Immutability, Passing Objects, Arrays, Functions (Callbacks), Components, the Children Prop, and Full Code Practice.",
      readTime: "30 min read",
      difficulty: "Beginner to Intermediate",
      date: "2026-09-19",
      sections: [
        {
          heading: "1. What are Props?",
          content: `**Props** (short for *Properties*) are read-only inputs passed from a **Parent Component** down to a **Child Component**.

**Analogy:**
Think of props like **arguments passed into a JavaScript function**.

Just as function \`add(a, b)\` receives arguments \`a\` and \`b\` to perform work, a React component \`<ProductCard name="iPhone" price={79999} />\` receives props to render dynamic UI content.`
        },
        {
          heading: "2. Passing and Receiving Props",
          content: `• **Passing Props (in Parent Component)**:
You pass props into a component using HTML-like attribute syntax:

\`<ProductCard name="iPhone 15 Pro" price={79999} category="Mobile" />\`

• **Receiving Props (in Child Component)**:
The child component receives a single object argument (conventionally named \`props\`) containing all passed attributes:

\`\`\`jsx
function ProductCard(props) {
  return (
    <div>
      <h3>{props.name}</h3>
      <p>Price: ₹{props.price}</p>
      <span>Category: {props.category}</span>
    </div>
  );
}
\`\`\``
        },
        {
          heading: "3. Destructuring Props",
          content: `Instead of typing \`props.name\`, \`props.price\`, and \`props.category\` repeatedly, modern React developers use **ES6 Object Destructuring** directly inside the function signature.

\`\`\`jsx
// Cleaner & Most Popular Syntax:
function ProductCard({ name, price, category }) {
  return (
    <div className="card">
      <h3>{name}</h3>
      <p>Price: ₹{price}</p>
      <span>{category}</span>
    </div>
  );
}
\`\`\``
        },
        {
          heading: "4. Default Prop Values",
          content: `You can specify **Default Values** for props in case the parent component forgets to pass them.

\`\`\`jsx
// Assigning Default Values via Destructuring:
function ProductCard({ name, price, category = "General Electronics", isAvailable = true }) {
  return (
    <div className="card">
      <h3>{name}</h3>
      <p>Price: ₹{price}</p>
      <p>Category: {category}</p>
      <p>Status: {isAvailable ? "In Stock ✅" : "Out of Stock ❌"}</p>
    </div>
  );
}
\`\`\``
        },
        {
          heading: "5. Props are Read-Only (Immutability)",
          content: `⚠️ **GOLDEN RULE OF REACT**: **Props are Immutable (Read-Only)**. A child component MUST NEVER attempt to mutate or modify its own props!

\`\`\`jsx
// ❌ WRONG (Mutating props throws errors or causes unexpected bugs)
function ProductCard(props) {
  props.price = 50000; // NEVER DO THIS!
  return <div>{props.price}</div>;
}
\`\`\`

**Why are Props Read-Only?**
React relies on **Pure Functions**. A component must behave like a pure function with respect to its props: given the same props, it must always render the exact same UI output.`
        },
        {
          heading: "6. Passing Data Types: Strings, Numbers, Booleans, Objects & Arrays",
          content: `You can pass ANY JavaScript data type as a prop:

\`\`\`jsx
const productObj = { id: 101, brand: "Apple", rating: 4.8 };
const tagsArray = ["5G", "OLED", "A17 Pro"];

<ProductCard 
  name="iPhone 15 Pro"            // String
  price={79999}                    // Number (Wrapped in {})
  isAvailable={true}               // Boolean (Wrapped in {})
  details={productObj}             // Object (Wrapped in {})
  features={tagsArray}             // Array (Wrapped in {})
/>
\`\`\``
        },
        {
          heading: "7. Passing Functions as Props (Callback Functions)",
          content: `You can pass **Functions** as props! This allows a **Child Component to communicate back up to its Parent Component**.

\`\`\`jsx
// Parent Component (App.jsx)
function App() {
  const handleAddToCart = (productName) => {
    alert(\`Added \${productName} to Cart!\`);
  };

  return <ProductCard name="iPhone 15 Pro" onAddToCart={handleAddToCart} />;
}

// Child Component (ProductCard.jsx)
function ProductCard({ name, onAddToCart }) {
  return (
    <div>
      <h3>{name}</h3>
      <button onClick={() => onAddToCart(name)}>Add to Cart 🛒</button>
    </div>
  );
}
\`\`\``
        },
        {
          heading: "8. The Special children Prop",
          content: `The **\`children\`** prop is a special built-in prop in React that receives whatever JSX elements are placed between the opening and closing tags of a custom component.

**Creating Wrapper / Container Components:**
\`\`\`jsx
// CardWrapper Component
function ContainerCard({ children, title }) {
  return (
    <div style={{ border: "2px solid #2506ad", borderRadius: "16px", padding: "20px" }}>
      <h2 style={{ color: "#2506ad" }}>{title}</h2>
      <div className="card-body">
        {children} {/* Renders inner nested JSX */}
      </div>
    </div>
  );
}

// Usage in App.jsx:
export default function App() {
  return (
    <ContainerCard title="Featured Offer">
      <p>Get 20% discount on all React & Full-Stack development courses!</p>
      <button className="btn-buy">Claim Offer Now</button>
    </ContainerCard>
  );
}
\`\`\``
        },
        {
          heading: "9. Common Mistakes with Props",
          content: `1. **Mutating Props**: Attempting \`props.price = 1000\`.
2. **Forgetting Curly Braces for Non-String Types**: Writing \`<Card price="79999" />\` passes the string \`"79999"\` instead of the number \`79999\`.
3. **Misspelling Prop Names**: Passing \`<Card cost={100} />\` but reading \`{price}\` inside the child component (returns \`undefined\`).`
        },
        {
          heading: "10. Top React Interview Questions on Props",
          content: `**Q1: What are Props in React?**
*Answer*: Props (properties) are read-only data inputs passed from a parent component to a child component to configure its layout and behavior.

**Q2: Can a child component modify its props?**
*Answer*: No. Props are strictly immutable. To change data over time, the component should use **State** or ask the parent component to pass a new prop value.

**Q3: What is the \`children\` prop?**
*Answer*: \`children\` is a built-in prop that captures and renders whatever elements are nested inside the opening and closing tags of a component.`
        },
        {
          heading: "11. Practical Hands-On Exercise — E-Commerce ProductCard Component",
          content: `Here is a complete, production-ready React component demonstrating all prop types: strings, numbers, objects, arrays, functions, default values, and the \`children\` prop:`,
          codeSnippet: `// Complete Masterclass Props Demo Component (src/App.jsx)
import React from 'react';

// 1. Reusable ProductCard Component
function ProductCard({
  name,
  price = 0,
  category = "General",
  isAvailable = true,
  tags = [],
  onAddToCart
}) {
  return (
    <div style={{ border: "1px solid #cbd5e1", borderRadius: "12px", padding: "20px", marginBottom: "15px", background: "#fff" }}>
      <span style={{ background: "#2506ad", color: "#fff", padding: "2px 8px", borderRadius: "4px", fontSize: "12px" }}>
        {category}
      </span>
      <h3 style={{ margin: "10px 0 5px 0", color: "#002057" }}>{name}</h3>
      <p style={{ fontSize: "18px", fontWeight: "bold", color: "#059669" }}>₹{price.toLocaleString('en-IN')}</p>
      <p>Status: {isAvailable ? "In Stock 🟢" : "Out of Stock 🔴"}</p>

      <div style={{ display: "flex", gap: "6px", margin: "10px 0" }}>
        {tags.map((tag, idx) => (
          <span key={idx} style={{ background: "#f1f5f9", padding: "2px 8px", borderRadius: "4px", fontSize: "12px" }}>
            #{tag}
          </span>
        ))}
      </div>

      <button 
        onClick={() => onAddToCart(name)}
        disabled={!isAvailable}
        style={{
          background: isAvailable ? "#2506ad" : "#cbd5e1",
          color: "#fff",
          border: "none",
          padding: "10px 18px",
          borderRadius: "6px",
          cursor: isAvailable ? "pointer" : "not-allowed",
          fontWeight: "bold"
        }}
      >
        {isAvailable ? "Add to Cart 🛒" : "Sold Out"}
      </button>
    </div>
  );
}

// 2. Main App Parent Component
export default function App() {
  const handleAddToCart = (item) => {
    alert(\`Added "\${item}" to your shopping cart!\`);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "30px auto", padding: "20px", background: "#f8fafc", borderRadius: "16px" }}>
      <h2 style={{ color: "#002057" }}>Module 1 Complete: Masterclass Props Showcase</h2>
      
      <ProductCard
        name="iPhone 15 Pro Max"
        price={159900}
        category="Mobile Electronics"
        isAvailable={true}
        tags={["Apple", "Titanium", "A17 Pro", "5G"]}
        onAddToCart={handleAddToCart}
      />

      <ProductCard
        name="MacBook Pro M3 Max"
        price={319900}
        category="Laptops"
        isAvailable={false}
        tags={["Apple", "M3 Max", "32GB RAM"]}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}`
        }
      ]
    }
  ]
};
