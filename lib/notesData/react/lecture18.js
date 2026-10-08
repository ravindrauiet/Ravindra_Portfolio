export const lecture18 = {
  slug: "lecture-18",
  number: 18,
  title: "Complete React Course — Module 6: Lecture 18: Context API — Sharing State Without Prop Drilling",
  summary: "Learn how the Context API solves prop drilling. Covers createContext, rendering <Context> as a provider in React 19 (and the older .Provider), reading context with useContext and use(), default values, real theme/auth/language contexts, splitting and memoizing context values to avoid wasted re-renders, and when not to use context at all.",
  readTime: "30 min read",
  difficulty: "Intermediate",
  date: "2026-10-08",
  sections: [
    {
      heading: "1. The Problem: Prop Drilling",
      content: `In the previous lecture we lifted state up to the closest common parent so that siblings could share it. That works well — until the component that **owns** the data and the component that **needs** it are five or six levels apart.
Picture an e-commerce app. \`App\` knows the logged-in user. The avatar in the top-right corner needs the user's name. In between sit \`Layout\`, \`Header\`, \`NavBar\` and \`UserMenu\`. None of those middle components care about the user, yet each one must accept a \`user\` prop and pass it down. This is called **prop drilling**.
Why it hurts:
• **Noise** — middle components carry props they never use, so their signatures lie about what they really do.
• **Fragile refactors** — rename a prop or move a component and you edit every file in the chain.
• **Tight coupling** — a generic \`Layout\` now "knows" about users, themes and languages, so it is harder to reuse.
Two props through two levels is perfectly fine. Prop drilling becomes a real problem when **many** components at **different depths** need the **same** data. That is exactly the job of **Context**.`,
      codeSnippet: `// Prop drilling: user travels through components that never use it
function App() {
  const user = { name: "Ananya Sharma", plan: "Pro" };
  return <Layout user={user} />;
}

function Layout({ user }) {
  return <Header user={user} />;         // doesn't use user
}

function Header({ user }) {
  return <NavBar user={user} />;         // doesn't use user
}

function NavBar({ user }) {
  return <UserMenu user={user} />;       // doesn't use user
}

function UserMenu({ user }) {
  return <span>Namaste, {user.name}</span>; // finally used here
}`
    },
    {
      heading: "2. What Is Context?",
      content: `**Context** lets a parent component make a value available to **every component below it** in the tree, no matter how deep, without passing it through props.
Think of it like Wi-Fi in an office. Instead of running a cable (prop) from the router to every desk, the router broadcasts a signal and any device in range can connect. The **provider** is the router, and \`useContext\` is a device connecting to it.
Using context always takes three steps:
1. **Create** a context with \`createContext(defaultValue)\`.
2. **Provide** a value by wrapping part of the tree with that context.
3. **Consume** the value in any descendant with \`useContext(SomeContext)\` or \`use(SomeContext)\`.
Important mental model: context does **not** store state by itself. It is a **delivery mechanism**. The actual state still lives in a normal component using \`useState\` or \`useReducer\`; context just carries it down the tree.`
    },
    {
      heading: "3. Step 1 — createContext and Default Values",
      content: `\`createContext\` is imported from \`react\` and is called **outside** any component, usually in its own file so other files can import it.
The argument is the **default value**. React uses it **only** when a component reads the context and there is **no matching provider above it** in the tree. It is not an "initial state" and it never changes on its own.
Good defaults:
• A sensible fallback, such as \`"light"\` for a theme or \`"en"\` for a language.
• \`null\` when the context must always have a provider — then a custom hook can throw a helpful error if it is missing (we will build this in Section 8).
By convention, context names end with \`Context\` and use PascalCase, because you render them like components: \`ThemeContext\`, \`AuthContext\`, \`LanguageContext\`.`,
      codeSnippet: `// src/contexts/ThemeContext.js
import { createContext } from "react";

// "light" is used only if a component reads ThemeContext
// without any <ThemeContext> provider above it.
export const ThemeContext = createContext("light");

// src/contexts/AuthContext.js
import { createContext } from "react";

// null = "there must always be a provider"
export const AuthContext = createContext(null);`
    },
    {
      heading: "4. Step 2 — Providing a Value: <Context> in React 19 vs .Provider",
      content: `To give a value to a subtree, wrap it with the context and pass a \`value\` prop.
**React 19 and later:** you can render the context object itself as the provider: \`<ThemeContext value="dark">\`. This is the recommended syntax in new code.
**Before React 19:** you had to write \`<ThemeContext.Provider value="dark">\`. This still works in React 19, so older tutorials and codebases are not broken, but the React team has said \`.Provider\` will be deprecated in a future version. When you meet it in an existing project, know that both forms do exactly the same thing.
Rules to remember:
• Every component **inside** the provider (children, grandchildren, and so on) can read the value.
• Components **outside** the provider get the default value from \`createContext\`.
• Providers can be **nested**. A component reads the value from the **nearest** provider above it, so an inner provider overrides an outer one for its subtree.
• The \`value\` is usually state from the component that renders the provider, so updating that state updates every consumer.`,
      codeSnippet: `// src/App.jsx
import { useState } from "react";
import { ThemeContext } from "./contexts/ThemeContext";
import Page from "./Page";

export default function App() {
  const [theme, setTheme] = useState("light");

  return (
    // React 19+: render the context directly as the provider
    <ThemeContext value={theme}>
      <button onClick={() => setTheme(t => (t === "light" ? "dark" : "light"))}>
        Toggle theme
      </button>
      <Page />

      {/* Nested provider: this sidebar is always dark */}
      <ThemeContext value="dark">
        <aside>Sidebar</aside>
      </ThemeContext>
    </ThemeContext>
  );
}

// Older syntax (React 18 and earlier) — still works in React 19:
// <ThemeContext.Provider value={theme}> ... </ThemeContext.Provider>`
    },
    {
      heading: "5. Step 3 — Reading Context with useContext and use()",
      content: `**\`useContext(SomeContext)\`** is the classic way to read context. It returns the value from the nearest provider above, or the default value if there is none. Like every hook, it must be called at the **top level** of a component or custom hook — not inside \`if\` statements or loops.
**\`use(SomeContext)\`** is a newer API added in React 19. For context it returns the same value as \`useContext\`, but \`use\` is more flexible: it **can be called inside conditions and loops** (it still cannot be called inside a regular nested function or a try/catch block, and only from components or hooks). \`use\` can also read a Promise, which you will meet in the data-fetching lectures.
Which should you use?
• \`useContext\` is everywhere in existing code and is perfectly fine.
• \`use\` is useful when you only need the context in some branches, such as an early return.
Whichever you choose, any component that reads a context **re-renders when that context's value changes**.`,
      codeSnippet: `// src/components/ThemedCard.jsx
import { useContext, use } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

export function ThemedCard({ title }) {
  const theme = useContext(ThemeContext); // top level, always
  return (
    <div className={"card card-" + theme}>
      <h3>{title}</h3>
    </div>
  );
}

export function PriceTag({ price, hidden }) {
  if (hidden) return null;

  // use() is allowed after an early return / inside a condition
  const theme = use(ThemeContext);
  return (
    <strong style={{ color: theme === "dark" ? "#facc15" : "#002057" }}>
      ₹{price.toLocaleString("en-IN")}
    </strong>
  );
}`
    },
    {
      heading: "6. Passing State and Updater Functions Through Context",
      content: `A context value can be **anything**: a string, an object, an array or a function. Most real contexts pass **both the data and the functions that change it**, so deeply nested components can read and update shared state.
A common pattern is to bundle them into an object: \`{ theme, toggleTheme }\`. A button deep in the tree can then call \`toggleTheme()\` without the parent passing a callback through every level.
Even better, wrap the provider in its own component — a **provider component** such as \`ThemeProvider\` — that owns the state and renders the context. \`App\` stays clean, and all theme logic lives in one file.`,
      codeSnippet: `// src/contexts/ThemeContext.jsx
import { createContext, useState } from "react";

export const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  function toggleTheme() {
    setTheme(t => (t === "light" ? "dark" : "light"));
  }

  return (
    <ThemeContext value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext>
  );
}

// src/components/ThemeToggle.jsx (any depth)
import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <button onClick={toggleTheme}>
      Switch to {theme === "light" ? "dark" : "light"} mode
    </button>
  );
}`
    },
    {
      heading: "7. Real-World Example: Auth Context",
      content: `Authentication is the classic context use case. The header shows the user's name, protected pages check whether someone is logged in, and the profile page shows the plan — all in different parts of the tree.
The \`AuthProvider\` below owns the \`user\` state and exposes \`login\` and \`logout\`. In a real app, \`login\` would call your backend API; here it simulates that so the example runs on its own.
Notice that the context only stores **who is logged in** — it does not store passwords or tokens in plain component state for display. Treat anything in context as visible to every component below the provider.
A **language context** follows the same shape: a provider that holds \`lang\` in state and exposes \`setLang\` plus a small \`t(key)\` translation helper, so every label can switch between English and Hindi. You will build one in the hands-on exercise. Production apps usually use a library such as react-i18next or FormatJS for plurals and lazy-loaded translation files, but the provider-at-the-top idea is identical.`,
      codeSnippet: `// src/contexts/AuthContext.jsx
import { createContext, useState } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  function login(name) {
    // Real app: await fetch("/api/login", { method: "POST", ... })
    setUser({ name, city: "Pune", plan: "Free" });
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext value={{ user, login, logout }}>
      {children}
    </AuthContext>
  );
}

// src/components/Header.jsx
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export function Header() {
  const { user, login, logout } = useContext(AuthContext);

  return (
    <header>
      {user ? (
        <>
          <span>Welcome, {user.name} ({user.city})</span>
          <button onClick={logout}>Log out</button>
        </>
      ) : (
        <button onClick={() => login("Rahul Verma")}>Log in</button>
      )}
    </header>
  );
}`
    },
    {
      heading: "8. Best Practice: A Custom Hook with a Safety Check",
      content: `Importing both \`useContext\` and the context object in every consumer is repetitive, and if someone forgets the provider, the component silently receives \`null\` and crashes later with a confusing error like "Cannot destructure property 'user' of null".
The professional pattern is:
1. Create the context with \`null\` as the default.
2. Export a **custom hook** (\`useAuth\`, \`useTheme\`) that reads the context.
3. If the value is \`null\`, **throw a clear error** explaining which provider is missing.
Now consumers write one line — \`const { user } = useAuth();\` — and mistakes are caught immediately with a readable message. Many teams also stop exporting the raw context object so that the custom hook is the only way in.`,
      codeSnippet: `// src/contexts/AuthContext.jsx
import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null); // not exported

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const login = (name) => setUser({ name });
  const logout = () => setUser(null);

  return (
    <AuthContext value={{ user, login, logout }}>
      {children}
    </AuthContext>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === null) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}

// Anywhere below <AuthProvider>:
// const { user, logout } = useAuth();`
    },
    {
      heading: "9. How Context Re-renders & Memoizing Context Values",
      content: `To use context well you must understand **when** consumers re-render:
• When a provider re-renders, React compares the new \`value\` with the previous one using \`Object.is\` (reference equality for objects and functions).
• If the value is **different**, **every** component that reads that context re-renders — even if it only uses one field that did not change.
• Context updates **skip past \`memo\`**: a component wrapped in \`memo\` still re-renders when a context it reads changes. \`memo\` only protects against props changing.
This creates two common performance traps:
1. **New object every render** — \`value={{ user, login, logout }}\` creates a brand-new object each time the provider renders, even if \`user\` is the same. So every consumer re-renders whenever the provider's parent re-renders.
2. **One giant context** — if theme, user, cart and notifications all live in one value, toggling the theme re-renders every cart and notification component too.
For a small app this rarely matters. In a large app with many consumers or expensive components, it can make typing in an input or ticking a checkbox feel slow. Memoization fixes the first trap; splitting contexts (next section) fixes the second.
To stop the "new object every render" problem, keep the value's **reference stable** unless its contents really changed:
• Wrap functions in **\`useCallback\`** so they keep the same identity between renders.
• Wrap the value object in **\`useMemo\`** with the real dependencies.
Now when the provider's parent re-renders for an unrelated reason, \`value\` is the same object, \`Object.is\` returns true, and consumers are skipped.
**A note on React Compiler:** React Compiler 1.0 is stable and, when enabled in your Vite/Babel setup, automatically memoizes values and functions like these, so you often do not need to write \`useMemo\`/\`useCallback\` by hand. It is still important to understand **why** the memoization matters, because many codebases do not use the compiler yet and interviewers ask about it.`,
      codeSnippet: `// src/contexts/AuthContext.jsx (optimised)
import { createContext, useCallback, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = useCallback((name) => {
    setUser({ name, city: "Bengaluru" });
  }, []);

  const logout = useCallback(() => setUser(null), []);

  // Same object reference until user actually changes
  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}`
    },
    {
      heading: "10. Splitting Contexts to Avoid Unnecessary Re-renders",
      content: `Memoizing helps when the provider re-renders for **unrelated** reasons. But when the data **itself** changes often, every consumer of that context still re-renders. The fix is to **split** contexts:
• **Split by concern** — separate \`ThemeContext\`, \`AuthContext\` and \`CartContext\` instead of one \`AppContext\`. Changing the theme no longer touches cart components.
• **Split state from actions** — put the frequently changing data in one context and the stable updater functions in another. Components that only *trigger* changes (an "Add to cart" button) read the actions context and do not re-render when the cart contents change.
Setter functions returned by \`useState\` (and \`dispatch\` from \`useReducer\`) are guaranteed to be stable, so an actions context built from them never changes.
Below, \`AddToCartButton\` appears on every product card. Because it reads only \`CartActionsContext\`, adding an item re-renders the badge in the header, but not the hundreds of buttons.`,
      codeSnippet: `// src/contexts/CartContext.jsx
import { createContext, useContext, useMemo, useState } from "react";

const CartStateContext = createContext(null);
const CartActionsContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  // setItems is stable, so this object is created only once
  const actions = useMemo(() => ({
    addItem: (product) => setItems(prev => [...prev, product]),
    clearCart: () => setItems([]),
  }), []);

  return (
    <CartActionsContext value={actions}>
      <CartStateContext value={items}>
        {children}
      </CartStateContext>
    </CartActionsContext>
  );
}

export const useCartItems = () => useContext(CartStateContext);
export const useCartActions = () => useContext(CartActionsContext);

// Re-renders when items change
export function CartBadge() {
  const items = useCartItems();
  return <span>Cart ({items.length})</span>;
}

// Does NOT re-render when items change
export function AddToCartButton({ product }) {
  const { addItem } = useCartActions();
  return <button onClick={() => addItem(product)}>Add {product.name}</button>;
}`
    },
    {
      heading: "11. When NOT to Use Context",
      content: `Context is powerful, which makes it easy to overuse. Reach for it only after simpler options:
• **Just pass props** when data goes down one or two levels. Explicit props make data flow obvious and components easier to test.
• **Use composition first.** Often the middle components don't need the data — they just need to render something that does. Pass JSX as \`children\` (as covered in the previous lecture): \`<Layout><UserMenu user={user} /></Layout>\`. Now \`Layout\` never sees \`user\`, and no context is needed.
• **Don't put rapidly changing data in a widely used context** — mouse position, scroll offset, or every keystroke of a search box would re-render many consumers many times per second. Keep that state local.
• **Don't use context as a server cache.** Fetched data with loading, caching, refetching and invalidation is better handled by TanStack Query (covered later in the course).
• **Large, frequently updated global state** with many selectors (a complex dashboard, an editor) is often simpler with a store library such as **Zustand** or **Redux Toolkit**, where components subscribe only to the slice they need.
**Good fits for context:** theme, logged-in user, language/locale, feature flags, and state shared by one widget's internal components (like tabs or an accordion).`,
      codeSnippet: `// Composition instead of context: Layout no longer needs "user"
function App() {
  const user = { name: "Ananya Sharma" };
  return (
    <Layout header={<UserMenu user={user} />}>
      <Dashboard user={user} />
    </Layout>
  );
}

function Layout({ header, children }) {
  return (
    <div className="layout">
      <header>{header}</header>
      <main>{children}</main>
    </div>
  );
}`
    },
    {
      heading: "12. Common Mistakes with Context",
      content: `• **Reading context outside its provider** — the component silently gets the default value. Use a custom hook that throws when the value is \`null\`.
• **Calling \`useContext\` in the provider component itself** — \`useContext\` looks **above** the component, so a component cannot read the value it is providing. Read it in a child instead.
• **Forgetting the \`value\` prop** — \`<ThemeContext>\` without \`value\` passes \`undefined\`, not the default. The default is used only when there is **no provider at all**.
• **Passing a new object every render** without memoization in a large tree, causing every consumer to re-render.
• **One giant \`AppContext\`** holding everything, so any change re-renders the whole app.
• **Creating the context inside a component** — \`createContext\` must be called at module level, otherwise a new context is made on every render and consumers never match the provider.
• **Duplicate module copies** — if two copies of the context file get bundled (for example via mismatched import paths in a monorepo), the provider and consumer use different context objects and the consumer sees only the default.
• **Using context to avoid passing one prop one level** — that adds indirection for no benefit.`
    },
    {
      heading: "13. Top React Interview Questions on Context API",
      content: `**Q1. What problem does the Context API solve?**
It avoids prop drilling by letting a provider make a value available to any descendant, however deep, without passing it through intermediate components.
**Q2. What is the default value in \`createContext\` used for?**
Only when a component reads the context and there is no matching provider above it. It is not initial state and does not update.
**Q3. What changed about providers in React 19?**
You can render the context itself as a provider: \`<ThemeContext value={theme}>\`. The older \`<ThemeContext.Provider>\` still works but is expected to be deprecated in a future version.
**Q4. What is the difference between \`useContext\` and \`use\`?**
Both read the nearest provider's value. \`useContext\` must be called at the top level; \`use\` (React 19) can be called conditionally and in loops, and can also read Promises.
**Q5. When does a context consumer re-render?**
Whenever the provider's \`value\` changes by \`Object.is\` comparison. All consumers of that context re-render, even if wrapped in \`memo\`.
**Q6. How do you optimise context performance?**
Memoize the value with \`useMemo\`/\`useCallback\` (or let React Compiler do it), split unrelated data into separate contexts, and separate state from actions.
**Q7. Is Context a replacement for Redux or Zustand?**
Not exactly. Context is a dependency-injection mechanism; combined with \`useState\`/\`useReducer\` it handles moderate global state well. Store libraries add selective subscriptions, devtools and middleware, which help with large, frequently updated state.
**Q8. Can a component provide and consume the same context?**
It cannot read the value it provides itself; \`useContext\` reads from providers **above** it. Its children can read the new value.`
    },
    {
      heading: "14. Practical Hands-On Exercise — Theme + Auth + Language App",
      content: `Build a small dashboard that combines three contexts. Create a new Vite project (\`npm create vite@latest context-demo -- --template react\`), replace \`src/App.jsx\` with the code below, and run \`npm run dev\`.
What to observe:
• The theme toggle, login button and language selector live in different components, yet none of them receives props from \`App\`.
• Each context has its own provider, custom hook and memoized value.
• Open React DevTools, enable "Highlight updates when components render", and toggle the theme — only theme consumers flash.
**Challenge tasks:**
1. Persist the theme in \`localStorage\` (read it in the \`useState\` initializer).
2. Add a \`CartContext\` split into state and actions, as in Section 10.
3. Move each provider into its own file under \`src/contexts/\`.`,
      codeSnippet: `// src/App.jsx
import { createContext, useCallback, useContext, useMemo, useState } from "react";

/* ---------- Theme ---------- */
const ThemeContext = createContext(null);
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const toggleTheme = useCallback(
    () => setTheme(t => (t === "light" ? "dark" : "light")), []
  );
  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);
  return <ThemeContext value={value}>{children}</ThemeContext>;
}
function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}

/* ---------- Auth ---------- */
const AuthContext = createContext(null);
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const login = useCallback(() => setUser({ name: "Priya Nair", city: "Kochi" }), []);
  const logout = useCallback(() => setUser(null), []);
  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);
  return <AuthContext value={value}>{children}</AuthContext>;
}
function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

/* ---------- Language ---------- */
const messages = {
  en: { hello: "Hello", guest: "Guest", login: "Log in", logout: "Log out", theme: "Toggle theme" },
  hi: { hello: "नमस्ते", guest: "अतिथि", login: "लॉग इन", logout: "लॉग आउट", theme: "थीम बदलें" },
};
const LanguageContext = createContext(null);
function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en");
  const value = useMemo(
    () => ({ lang, setLang, t: (key) => messages[lang][key] ?? key }),
    [lang]
  );
  return <LanguageContext value={value}>{children}</LanguageContext>;
}
function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside <LanguageProvider>");
  return ctx;
}

/* ---------- UI components (no props drilled) ---------- */
function ThemeButton() {
  const { toggleTheme } = useTheme();
  const { t } = useLanguage();
  return <button onClick={toggleTheme}>{t("theme")}</button>;
}

function LanguageSelect() {
  const { lang, setLang } = useLanguage();
  return (
    <select value={lang} onChange={(e) => setLang(e.target.value)}>
      <option value="en">English</option>
      <option value="hi">हिन्दी</option>
    </select>
  );
}

function UserPanel() {
  const { user, login, logout } = useAuth();
  const { t } = useLanguage();
  return (
    <div>
      <p>{t("hello")}, {user ? user.name + " (" + user.city + ")" : t("guest")}</p>
      {user
        ? <button onClick={logout}>{t("logout")}</button>
        : <button onClick={login}>{t("login")}</button>}
    </div>
  );
}

function Dashboard() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  return (
    <div style={{
      minHeight: "100vh", padding: 24, fontFamily: "system-ui",
      background: dark ? "#0f172a" : "#f8fafc",
      color: dark ? "#e2e8f0" : "#002057",
    }}>
      <h2>Lecture 18: Context API Dashboard</h2>
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <ThemeButton />
        <LanguageSelect />
      </div>
      <UserPanel />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LanguageProvider>
          <Dashboard />
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}`
    },
    {
      heading: "15. Summary",
      content: `• **Prop drilling** means passing data through components that don't use it; it becomes painful when many components at different depths need the same data.
• **Context** delivers a value to any descendant: \`createContext\` → provide → consume. It carries state; it doesn't own it.
• The **default value** is used only when there is no provider above the consumer.
• In **React 19**, render \`<SomeContext value={...}>\` directly; \`<SomeContext.Provider>\` still works in older code.
• Read context with **\`useContext\`** (top level only) or **\`use\`** (can be called conditionally).
• Wrap providers in **provider components** and expose a **custom hook** that throws a clear error when the provider is missing.
• Every consumer re-renders when the value changes by \`Object.is\`, even through \`memo\`. **Memoize** the value and **split** contexts by concern and into state vs actions.
• Prefer **props and composition** first; use TanStack Query for server data and Zustand/Redux Toolkit for large, fast-changing global state.
• Good fits for context: theme, auth, language, feature flags and compound-component internals.
**Next lecture:** useReducer & Scalable State Architecture`
    }
  ]
};
