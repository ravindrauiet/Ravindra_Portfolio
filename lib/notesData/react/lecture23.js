export const lecture23 = {
  slug: "lecture-23",
  number: 23,
  title: "Complete React Course — Module 8: Lecture 23: Performance Optimization — memo, useMemo, useCallback & the React Compiler",
  summary: "Learn how React re-renders and how to measure it with the React DevTools Profiler before optimizing. Covers React.memo, useMemo, useCallback, when memoization is wasted, automatic memoization with React Compiler 1.0, code splitting with lazy() and Suspense, useTransition and useDeferredValue, list virtualization, avoiding layout thrash and keeping your bundle small.",
  readTime: "32 min read",
  difficulty: "Advanced",
  date: "2026-10-08",
  sections: [
    {
      heading: "1. How React Re-renders",
      content: `In the previous lecture TanStack Query took care of fetching and caching server data. Now we turn to the other half of a fast app: making sure React does not do more work than it needs to.
First, get the vocabulary right. When React updates the screen it goes through two phases:
• **Render phase** — React calls your component functions to get fresh JSX, then compares (diffs) it with the previous result.
• **Commit phase** — React applies only the actual differences to the real DOM.
A "re-render" means React **called your function again**. It does not mean the DOM changed. If the JSX comes out the same, the commit does nothing.
A component re-renders when:
1. Its own **state** changes (\`useState\`, \`useReducer\`).
2. Its **parent re-renders** — by default every child re-renders too, whether its props changed or not.
3. A **context** it reads changes.
4. A store hook it uses (Zustand, Redux, TanStack Query) reports new data.
Notice what is missing: "its props changed" does not trigger a render by itself. Props change *because* the parent re-rendered, and rule 2 already re-renders the child.
**Key idea:** re-renders are normal and usually cheap. A render becomes a problem only when it is **slow** (heavy calculation, thousands of elements) or **frequent** (every keystroke, every scroll event).`,
      codeSnippet: `// src/App.jsx — watch the console while typing
import { useState } from "react";

function Header() {
  console.log("Header rendered");      // logs on EVERY keystroke
  return <h1>Ravindra's Store</h1>;
}

export default function App() {
  const [query, setQuery] = useState("");
  console.log("App rendered");
  return (
    <>
      <Header />                          {/* no props, still re-renders */}
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
    </>
  );
}`
    },
    {
      heading: "2. Measure First: React DevTools Profiler",
      content: `The first rule of performance work: **never optimize without measuring.** Guessing leads to memo wrappers everywhere and no real speed-up.
Your main tool is the **Profiler** tab in the React Developer Tools browser extension:
1. Open DevTools, choose the **Profiler** tab and click record.
2. Do the slow interaction (type in the search box, switch a tab).
3. Stop recording. The **flame graph** shows every component that rendered in each commit and how long it took. Grey bars did not render; yellow bars are the slowest.
4. Click a component to see **"Why did this render?"** (enable "Record why each component rendered while profiling" in the Profiler settings).
Two more tools help:
• In the extension's settings, turn on **"Highlight updates when components render"** to see coloured outlines flash on every re-render.
• React 19.2 adds **Performance Tracks** to the Chrome DevTools Performance panel, showing React's scheduler and component work on the same timeline as network and JavaScript.
For numbers inside your own code, React has a built-in \`<Profiler>\` component. Always profile a **production build** (\`npm run build\` then \`npm run preview\` in Vite) before drawing conclusions — development mode adds extra checks and Strict Mode double renders, so it is noticeably slower.`,
      codeSnippet: `// src/main.jsx — logging render times with <Profiler>
import { Profiler } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

function onRender(id, phase, actualDuration, baseDuration) {
  // phase: "mount" | "update" | "nested-update"
  // actualDuration: ms spent rendering this commit
  // baseDuration: estimated ms to render the whole tree without memoization
  if (actualDuration > 16) {
    console.warn(\`[\${id}] slow \${phase}: \${actualDuration.toFixed(1)}ms\`);
  }
}

createRoot(document.getElementById("root")).render(
  <Profiler id="App" onRender={onRender}>
    <App />
  </Profiler>
);`
    },
    {
      heading: "3. React.memo — Skip Re-rendering When Props Are the Same",
      content: `\`memo\` wraps a component and tells React: "if the props are the same as last time, reuse the previous result and skip calling me."
React compares each prop with \`Object.is\` — a **shallow** comparison. Primitives (strings, numbers, booleans) compare by value. Objects, arrays and functions compare by **reference**: two objects with identical contents are still "different" if they were created separately.
That is the catch. In the example below, \`ProductCard\` is memoized, but the parent creates a new \`style\` object and a new \`onAdd\` function on every render. The props never look equal, so \`memo\` does nothing — it only adds the cost of comparing.
\`memo\` also does not block re-renders caused by the component's **own** state or a **context** it reads.
You can pass a custom comparison as the second argument, \`memo(Component, arePropsEqual)\`, but this is rarely needed and easy to get wrong (forgetting to compare a function prop gives you stale callbacks).`,
      codeSnippet: `// src/ProductCard.jsx
import { memo } from "react";

const ProductCard = memo(function ProductCard({ name, price, style, onAdd }) {
  console.log("render", name);
  return (
    <div style={style}>
      <h3>{name}</h3>
      <p>₹{price.toLocaleString("en-IN")}</p>
      <button onClick={() => onAdd(name)}>Add to cart</button>
    </div>
  );
});

export default ProductCard;

// In the parent — this DEFEATS memo:
// <ProductCard
//   name="Kurta" price={1499}
//   style={{ padding: 12 }}             // new object every render
//   onAdd={(n) => addToCart(n)}          // new function every render
// />`
    },
    {
      heading: "4. useMemo — Cache an Expensive Calculation",
      content: `\`useMemo(calculate, dependencies)\` runs \`calculate\` on the first render and caches the result. On later renders it returns the cached value unless one of the dependencies changed (again compared with \`Object.is\`).
It has two legitimate uses:
• **Skipping slow work** — filtering or sorting thousands of rows, building chart data, parsing a large file.
• **Keeping a stable reference** — so an object or array passed to a \`memo\` child, or used in another hook's dependency array, does not change on every render.
How slow is "slow"? Wrap the calculation in \`console.time\` / \`console.timeEnd\`. If it takes about **1 ms or more** in a production build, memoizing is worth considering. Below that, the bookkeeping costs about as much as it saves.
\`useMemo\` is a performance hint, not a guarantee. Your code must still work correctly if React throws the cache away and recalculates.`,
      codeSnippet: `// src/OrderTable.jsx
import { useMemo, useState } from "react";

export default function OrderTable({ orders, theme }) {
  const [city, setCity] = useState("All");

  // Recalculates only when orders or city change — NOT when theme changes
  const visibleOrders = useMemo(() => {
    console.time("filter+sort");
    const result = orders
      .filter((o) => city === "All" || o.city === city)
      .toSorted((a, b) => b.amount - a.amount);
    console.timeEnd("filter+sort");
    return result;
  }, [orders, city]);

  return (
    <div className={theme}>
      <select value={city} onChange={(e) => setCity(e.target.value)}>
        {["All", "Delhi", "Mumbai", "Pune", "Bengaluru"].map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>
      <ul>
        {visibleOrders.map((o) => (
          <li key={o.id}>{o.customer} — ₹{o.amount}</li>
        ))}
      </ul>
    </div>
  );
}`
    },
    {
      heading: "5. useCallback — Keep a Function's Identity Stable",
      content: `Every render creates brand-new function objects. Usually that is fine. It matters in two cases:
• You pass the function to a component wrapped in \`memo\`.
• The function is a dependency of \`useEffect\`, \`useMemo\` or another \`useCallback\`.
\`useCallback(fn, dependencies)\` returns the **same function object** between renders until a dependency changes. It is exactly \`useMemo(() => fn, dependencies)\` with nicer syntax.
A useful trick: use the **updater form** of \`setState\` (\`setCart(prev => ...)\`) inside the callback. Then the callback does not need \`cart\` in its dependencies, so it can stay stable for the lifetime of the component.
Remember: \`useCallback\` on its own speeds up nothing. It only pays off when something downstream **compares** the function — a \`memo\` child or a dependency array.`,
      codeSnippet: `// src/Shop.jsx — memo + useMemo + useCallback working together
import { useCallback, useMemo, useState } from "react";
import ProductCard from "./ProductCard";

const PRODUCTS = [
  { id: 1, name: "Kurta", price: 1499 },
  { id: 2, name: "Saree", price: 3299 },
  { id: 3, name: "Jutti", price: 899 },
];

export default function Shop() {
  const [cart, setCart] = useState([]);
  const [note, setNote] = useState("");

  // Stable: depends on nothing because it uses the updater form
  const handleAdd = useCallback((name) => {
    setCart((prev) => [...prev, name]);
  }, []);

  const cardStyle = useMemo(() => ({ padding: 12, border: "1px solid #ddd" }), []);

  return (
    <>
      <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Gift note" />
      <p>Cart: {cart.length} items</p>
      {/* Typing in the note no longer re-renders the cards */}
      {PRODUCTS.map((p) => (
        <ProductCard key={p.id} name={p.name} price={p.price} style={cardStyle} onAdd={handleAdd} />
      ))}
    </>
  );
}`
    },
    {
      heading: "6. When Memoization Is Wasted",
      content: `Memoization has a cost: extra memory, dependency comparisons on every render, and code that is harder to read. It is **wasted** when:
• The component is cheap to render anyway (a button, a label).
• The props change on almost every render, so the comparison always fails.
• One prop is a new object, array, function or **JSX element** (\`children\`) every time, which silently breaks \`memo\`.
• You \`useCallback\` a function that is only passed to a plain DOM element like \`<button>\` — DOM elements do not compare props.
• The dependency array contains an object created during render, so the cache never hits.
Before reaching for \`memo\`, try these structural fixes. They are free and often remove the problem completely:
1. **Move state down.** If only the search box needs \`query\`, put \`query\` in a \`SearchBox\` component. Typing then re-renders \`SearchBox\` alone, not the whole page.
2. **Lift content up as children.** A component that owns fast-changing state can receive the slow part as \`children\`. The \`children\` element was created by the parent, so it is the same object and React skips it.
3. **Keep effects and state minimal.** Derive values during render instead of syncing them with \`useEffect\` + \`setState\`, which causes an extra render each time.`,
      codeSnippet: `// Fix by composition — no memo needed
import { useState } from "react";

function MouseTracker({ children }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  return (
    <div onPointerMove={(e) => setPos({ x: e.clientX, y: e.clientY })} style={{ height: "100vh" }}>
      <p>Pointer: {pos.x}, {pos.y}</p>
      {children /* created by App, same object on every MouseTracker render */}
    </div>
  );
}

function ExpensiveDashboard() {
  // pretend this renders charts and tables
  return <section>Sales dashboard</section>;
}

export default function App() {
  return (
    <MouseTracker>
      <ExpensiveDashboard />   {/* does NOT re-render when the pointer moves */}
    </MouseTracker>
  );
}`
    },
    {
      heading: "7. React Compiler 1.0 — Automatic Memoization",
      content: `Writing \`memo\`, \`useMemo\` and \`useCallback\` by hand is tedious and easy to get wrong. **React Compiler** is a build-time tool, stable since version 1.0, that analyses your components and hooks and inserts memoization for you. It can even memoize values after an early return or inside conditions, which hooks cannot do.
What it means for you:
• In new code you can usually **stop writing \`useMemo\`, \`useCallback\` and \`memo\`** for performance. Keep them where you need precise control, for example a value used as an effect dependency.
• It only works on code that follows the **Rules of React**: components are pure, props and state are never mutated, and hooks are called unconditionally at the top level. Components it cannot safely optimize are **skipped**, not broken.
• It works best with React 19. React 17 and 18 are supported through the \`react-compiler-runtime\` package and a \`target\` option.
• In React DevTools, compiled components show a **"Memo ✨"** badge.
• To exclude a single component while you debug, add the \`"use no memo"\` directive at the top of its function.
• The latest \`eslint-plugin-react-hooks\` includes compiler-powered lint rules in its recommended config. Fix what they report; it makes your code compiler-friendly.
**Setup in Vite.** Recent \`@vitejs/plugin-react\` (v6, used with Vite 8) no longer bundles Babel, so the compiler runs through \`@rolldown/plugin-babel\` with the \`reactCompilerPreset\` helper, as shown below. Older projects on plugin-react v5 pass the compiler as a Babel plugin instead: \`react({ babel: { plugins: ["babel-plugin-react-compiler"] } })\`. Check the React Compiler installation guide for your exact versions. Next.js has its own \`reactCompiler\` config option.
Adopt it gradually on a large codebase: enable it, run your tests, profile, and keep the hand-written memoization until you have confirmed it is no longer needed.`,
      codeSnippet: `# Terminal — Vite 8 + @vitejs/plugin-react v6
npm install -D babel-plugin-react-compiler @rolldown/plugin-babel @babel/core

// vite.config.js
import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";

export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
});

// src/LegacyWidget.jsx — opt one component out while debugging
export default function LegacyWidget({ data }) {
  "use no memo";
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}`
    },
    {
      heading: "8. Code Splitting with lazy() and Suspense",
      content: `Memoization makes renders cheaper. **Code splitting** makes the first load faster by not downloading code the user does not need yet.
By default Vite bundles every imported module into the main JavaScript file. With \`lazy\` and a dynamic \`import()\`, Vite creates a **separate chunk** that is fetched only when the component first renders. While it loads, the nearest \`<Suspense>\` boundary shows its \`fallback\`.
Good candidates:
• **Routes** — a user on the home page does not need the admin dashboard's code. (React Router v7 also supports a \`lazy\` property on route objects.)
• **Heavy widgets** — charts, rich-text editors, maps, PDF viewers.
• **Rarely opened UI** — modals, settings panels.
Rules: declare \`lazy\` components at the **top level of a module**, never inside a component (that would reset its state on every render). The lazily imported module must have a **default export**. Wrap lazy sections in an error boundary too, so a failed network request shows a friendly message instead of a blank screen.
You can **preload** a chunk on hover by calling the same \`import()\` early, so it is already cached when the user clicks.`,
      codeSnippet: `// src/App.jsx
import { lazy, Suspense, useState } from "react";

// Each becomes its own chunk in the production build
const SalesChart = lazy(() => import("./SalesChart"));
const ReportModal = lazy(() => import("./ReportModal"));

const preloadModal = () => import("./ReportModal");

export default function App() {
  const [showModal, setShowModal] = useState(false);
  return (
    <main>
      <h1>Dashboard</h1>
      <Suspense fallback={<p>Loading chart…</p>}>
        <SalesChart />
      </Suspense>

      <button onMouseEnter={preloadModal} onClick={() => setShowModal(true)}>
        Download report
      </button>
      {showModal && (
        <Suspense fallback={<p>Opening…</p>}>
          <ReportModal onClose={() => setShowModal(false)} />
        </Suspense>
      )}
    </main>
  );
}`
    },
    {
      heading: "9. useTransition and useDeferredValue — Keep the UI Responsive",
      content: `Sometimes a render is genuinely heavy and cannot be avoided — filtering 10,000 products, drawing a large chart. React's **concurrent features** let you mark that work as **non-urgent** so typing and clicking stay smooth.
• **\`useTransition\`** gives you \`[isPending, startTransition]\`. State updates inside \`startTransition\` become low priority: React can interrupt them if the user types again, and \`isPending\` lets you show a subtle loading hint. Use it when **you own the state setter**, for example switching tabs.
• **\`useDeferredValue(value)\`** returns a copy of a value that "lags behind" during heavy renders. The input updates instantly with the real value; the expensive list renders with the deferred one. Use it when **you receive a value** (such as a prop) and cannot wrap its setter.
Important: the slow child must be wrapped in \`memo\` (or compiled by React Compiler). Otherwise it re-renders with the urgent update anyway and you gain nothing.
These features do **not** make code faster. They change **priority** so the slow work no longer blocks the user. Do not use a transition for a controlled text input's own value — that must update urgently.`,
      codeSnippet: `// src/TabSwitcher.jsx
import { useState, useTransition } from "react";
import { AboutTab, PostsTab, ContactTab } from "./tabs"; // PostsTab is slow

export default function TabSwitcher() {
  const [tab, setTab] = useState("about");
  const [isPending, startTransition] = useTransition();

  function selectTab(next) {
    startTransition(() => setTab(next)); // non-urgent: clicks stay responsive
  }

  return (
    <>
      {["about", "posts", "contact"].map((t) => (
        <button key={t} onClick={() => selectTab(t)} disabled={tab === t}>
          {t}
        </button>
      ))}
      <div style={{ opacity: isPending ? 0.6 : 1 }}>
        {tab === "about" && <AboutTab />}
        {tab === "posts" && <PostsTab />}
        {tab === "contact" && <ContactTab />}
      </div>
    </>
  );
}`
    },
    {
      heading: "10. List Virtualization (Windowing)",
      content: `Memoization cannot save you if you render **10,000 rows** into the DOM. Each one is a real DOM node the browser must create, lay out and keep in memory.
**Virtualization** renders only the rows visible in the viewport (plus a few extra above and below, called **overscan**). As the user scrolls, the same handful of DOM nodes are reused for different data. A list of 50,000 transactions then costs about as much as a list of 30.
Popular libraries are **TanStack Virtual** (\`@tanstack/react-virtual\`, headless and flexible) and **react-window** (small and simple). The pattern is the same:
1. A scrollable container with a fixed height.
2. An inner element whose height equals the **total** list height, so the scrollbar looks right.
3. Absolutely positioned rows, each moved to its \`start\` offset.
Trade-offs: browser find-in-page (Ctrl+F) cannot see rows that are not rendered, and variable-height rows need measuring. Use virtualization once a list reaches several hundred complex rows; for 50 rows it is unnecessary complexity.`,
      codeSnippet: `// npm install @tanstack/react-virtual
// src/TransactionList.jsx
import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

const rows = Array.from({ length: 50000 }, (_, i) => ({
  id: i,
  label: \`UPI payment #\${i + 1}\`,
  amount: ((i * 37) % 5000) + 10,
}));

export default function TransactionList() {
  const parentRef = useRef(null);
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,   // row height in px
    overscan: 8,
  });

  return (
    <div ref={parentRef} style={{ height: 400, overflow: "auto", border: "1px solid #ccc" }}>
      <div style={{ height: virtualizer.getTotalSize(), position: "relative" }}>
        {virtualizer.getVirtualItems().map((item) => {
          const row = rows[item.index];
          return (
            <div
              key={item.key}
              style={{
                position: "absolute", top: 0, left: 0, width: "100%",
                height: item.size, transform: \`translateY(\${item.start}px)\`,
                display: "flex", justifyContent: "space-between", padding: "0 12px",
              }}
            >
              <span>{row.label}</span>
              <span>₹{row.amount}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}`
    },
    {
      heading: "11. Avoiding Layout Thrash",
      content: `Not every slowdown is React's fault. The browser itself can be forced into expensive work.
When you **write** to the DOM (change a style or class) and then immediately **read** a layout property (\`offsetHeight\`, \`getBoundingClientRect()\`, \`scrollTop\`), the browser must recalculate layout synchronously to give you an accurate answer. Doing write-read-write-read in a loop forces a layout on every iteration. This is **layout thrashing** (also called forced synchronous layout), and it shows up as long purple "Layout" blocks in the Performance panel.
How to avoid it:
• **Batch reads, then writes.** Read every measurement first, then apply all the changes.
• **Animate with \`transform\` and \`opacity\`**, which the browser can handle on the compositor without recalculating layout. Animating \`top\`, \`left\`, \`width\` or \`height\` triggers layout on every frame.
• Measure DOM elements in \`useLayoutEffect\` only when you must position something before paint (a tooltip, a popover). Prefer \`useEffect\` otherwise — \`useLayoutEffect\` blocks painting.
• Throttle scroll and resize handlers with \`requestAnimationFrame\`, or use \`IntersectionObserver\` and \`ResizeObserver\` instead of reading positions on every event.
• Reserve space for images and ads with \`width\`/\`height\` or CSS \`aspect-ratio\` to prevent layout shift.`,
      codeSnippet: `// Thrashing vs batched — equalising card heights
function equaliseBad(cards) {
  cards.forEach((card) => {
    card.style.height = "auto";                  // write
    const h = card.offsetHeight;                 // read -> forced layout EVERY loop
    card.style.height = \`\${Math.ceil(h / 8) * 8}px\`; // write
  });
}

function equaliseGood(cards) {
  cards.forEach((card) => (card.style.height = "auto"));   // all writes
  const heights = cards.map((card) => card.offsetHeight);  // all reads: ONE layout
  cards.forEach((card, i) => {
    card.style.height = \`\${Math.ceil(heights[i] / 8) * 8}px\`; // all writes
  });
}

// In React, measure before paint only when needed:
// useLayoutEffect(() => {
//   const { height } = tooltipRef.current.getBoundingClientRect();
//   setTop(anchorTop - height - 8);
// }, [anchorTop]);`
    },
    {
      heading: "12. Keeping the Bundle Small",
      content: `On a mid-range Android phone over a patchy 4G connection, every extra 100 KB of JavaScript means more time downloading, parsing and executing before the page responds. Bundle size is often the biggest performance win of all.
Practical steps:
• **See what is inside.** A bundle visualizer such as \`rollup-plugin-visualizer\` draws a treemap of your production build so you can spot oversized dependencies.
• **Import only what you use.** \`import { debounce } from "lodash-es"\` lets the bundler drop unused code (tree shaking); \`import _ from "lodash"\` pulls in the whole library.
• **Prefer the platform.** \`Intl.NumberFormat\` and \`Intl.DateTimeFormat\` replace many date and number libraries; \`fetch\` replaces many HTTP clients.
• **Check before installing.** Look up a package's size on a site such as bundlephobia.com and compare lighter alternatives.
• **Split by route and feature** with \`lazy\` (section 8).
• **Optimize images**: modern formats (WebP, AVIF), correct dimensions and \`loading="lazy"\` for images below the fold.
• **Ship production builds only.** \`vite build\` minifies the code and removes development-only warnings.`,
      codeSnippet: `# Terminal
npm install -D rollup-plugin-visualizer

// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    // Writes stats.html after "npm run build" and opens it in the browser
    visualizer({ filename: "stats.html", open: true, gzipSize: true }),
  ],
});

// Platform API instead of a formatting library
const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" });
console.log(inr.format(1250000)); // ₹12,50,000.00`
    },
    {
      heading: "13. Common Mistakes",
      content: `• **Optimizing without profiling.** You speed up a component that took 0.2 ms while the real bottleneck sits elsewhere.
• **Profiling in development mode.** Strict Mode double rendering and dev-only checks distort the numbers. Measure a production build.
• **\`memo\` with unstable props.** Inline objects, arrays, arrow functions or \`children\` JSX make the comparison fail every time.
• **Wrong or missing dependencies.** Leaving a value out of \`useMemo\`/\`useCallback\` dependencies returns stale data. Let the ESLint hooks plugin guide you.
• **Using \`useMemo\` for side effects.** It must be a pure calculation. Data fetching and subscriptions belong in effects or a library like TanStack Query.
• **Declaring \`lazy\` inside a component**, which creates a new component type on every render and remounts it.
• **Expecting \`useTransition\` to speed up a non-memoized child.** Without \`memo\` or the compiler, the slow child still renders on the urgent update.
• **Mutating state or props.** Besides causing bugs, it makes React Compiler skip that component.
• **Rendering huge lists without virtualization** and then trying to fix it with \`memo\`.
• **Animating \`width\`, \`top\` or \`left\`** instead of \`transform\`, causing layout work on every frame.`
    },
    {
      heading: "14. Top React Interview Questions on Performance",
      content: `**Q1. What causes a React component to re-render?**
A change in its own state, a re-render of its parent, a change in a context it reads, or an update from an external store it subscribes to. Prop changes are a consequence of the parent re-rendering.
**Q2. Is a re-render the same as a DOM update?**
No. Rendering calls the component to produce JSX. React then diffs it and commits only the differences, so a re-render may change nothing in the DOM.
**Q3. Difference between \`memo\`, \`useMemo\` and \`useCallback\`?**
\`memo\` wraps a component and skips its render when props are shallowly equal. \`useMemo\` caches a computed value. \`useCallback\` caches a function reference. \`useCallback(fn, deps)\` equals \`useMemo(() => fn, deps)\`.
**Q4. Why might \`React.memo\` not prevent a re-render?**
A prop is a new object, array, function or JSX element on every render; the component's own state changed; or a context it consumes changed.
**Q5. What does React Compiler do, and does it replace manual memoization?**
It is a build-time tool that automatically memoizes components and values in code that follows the Rules of React. In most new code it removes the need for manual \`memo\`/\`useMemo\`/\`useCallback\`; you keep them only for precise control, such as stable effect dependencies.
**Q6. \`useTransition\` vs \`useDeferredValue\`?**
Both mark work as non-urgent. \`useTransition\` wraps the state update you control and gives an \`isPending\` flag. \`useDeferredValue\` defers a value you receive when you cannot access its setter.
**Q7. What is list virtualization and when would you use it?**
Rendering only visible rows of a long list and reusing DOM nodes while scrolling. Use it for lists of hundreds or thousands of rows.
**Q8. How does code splitting work in React?**
\`lazy(() => import("./X"))\` creates a component whose code is a separate chunk, loaded on first render. \`<Suspense>\` shows a fallback while it loads.
**Q9. What is layout thrashing?**
Interleaving DOM writes and layout reads so the browser must recalculate layout repeatedly. Fix it by batching reads before writes and animating \`transform\`/\`opacity\`.`
    },
    {
      heading: "15. Practical Hands-On Exercise: A Fast Product Search",
      content: `Build a product search over **5,000 products** that stays smooth while typing. Paste the component into \`src/App.jsx\` of a Vite project.
What it practises:
• **\`useDeferredValue\`** so the input updates instantly while the heavy list catches up.
• **\`memo\`** on \`ProductList\` so it re-renders only when the deferred query or the wishlist change.
• **\`useMemo\`** for the filter calculation.
• **\`useCallback\`** with the updater form so the toggle handler stays stable.
• A dimmed list while results are stale.
Try this:
1. Open the Profiler, record while typing fast, and look at how often \`ProductList\` renders.
2. Replace \`deferredQuery\` with \`query\` in the JSX and record again. Typing should feel noticeably slower, with longer commits.
3. Bonus: remove \`memo\`, \`useMemo\` and \`useCallback\`, enable React Compiler (section 7), and compare the Profiler results.
4. Bonus: render the list with TanStack Virtual (section 10) and remove the artificial slowdown.`,
      codeSnippet: `// src/App.jsx
import { memo, useCallback, useDeferredValue, useMemo, useState } from "react";

const CITIES = ["Delhi", "Mumbai", "Pune", "Jaipur", "Kolkata", "Chennai"];
const ITEMS = ["Kurta", "Saree", "Jutti", "Dupatta", "Sherwani", "Lehenga"];
const PRODUCTS = Array.from({ length: 5000 }, (_, i) => ({
  id: i + 1,
  name: \`\${ITEMS[i % ITEMS.length]} #\${i + 1}\`,
  city: CITIES[i % CITIES.length],
  price: 299 + ((i * 53) % 4700),
}));

function SlowRow({ product, saved, onToggle }) {
  const start = performance.now();
  while (performance.now() - start < 0.05) {} // artificial slowdown for practice
  return (
    <li style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
      <span>{product.name} · {product.city}</span>
      <span>
        ₹{product.price.toLocaleString("en-IN")}{" "}
        <button onClick={() => onToggle(product.id)}>{saved ? "♥ Saved" : "♡ Save"}</button>
      </span>
    </li>
  );
}

const ProductList = memo(function ProductList({ query, wishlist, onToggle }) {
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter(
      (p) => p.name.toLowerCase().includes(q) || p.city.toLowerCase().includes(q)
    ).slice(0, 300);
  }, [query]);

  return (
    <>
      <p>{results.length} results (showing up to 300)</p>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {results.map((p) => (
          <SlowRow key={p.id} product={p} saved={wishlist.has(p.id)} onToggle={onToggle} />
        ))}
      </ul>
    </>
  );
});

export default function App() {
  const [query, setQuery] = useState("");
  const [wishlist, setWishlist] = useState(() => new Set());
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;

  const toggleWishlist = useCallback((id) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  return (
    <main style={{ maxWidth: 640, margin: "24px auto", fontFamily: "system-ui", padding: "0 16px" }}>
      <h2 style={{ color: "#002057" }}>Lecture 23: Fast Product Search</h2>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search kurta, saree, Pune…"
        style={{ width: "100%", padding: 10, fontSize: 16 }}
      />
      <p>Wishlist: {wishlist.size} items</p>
      <div style={{ opacity: isStale ? 0.5 : 1, transition: "opacity 0.2s" }}>
        <ProductList query={deferredQuery} wishlist={wishlist} onToggle={toggleWishlist} />
      </div>
    </main>
  );
}`
    },
    {
      heading: "16. Summary",
      content: `• A re-render means React called your component again; React commits only real DOM differences. Components re-render on own state, parent render, context change or store updates.
• **Measure first** with the React DevTools Profiler, Performance Tracks or \`<Profiler>\`, on a production build.
• \`memo\` skips renders when props are shallowly equal; \`useMemo\` caches values; \`useCallback\` caches function identity. They only help when references are stable and work is genuinely expensive.
• Try structural fixes first: move state down and pass slow parts as \`children\`.
• **React Compiler 1.0** memoizes automatically for code that follows the Rules of React, so new code rarely needs manual memoization.
• \`lazy\` + \`<Suspense>\` split code into chunks loaded on demand.
• \`useTransition\` and \`useDeferredValue\` mark heavy updates as non-urgent so input stays responsive.
• Virtualize long lists; batch DOM reads before writes and animate with \`transform\`/\`opacity\`.
• Watch your bundle with a visualizer, import selectively and prefer platform APIs.
**Next lecture:** React 19 Features Masterclass — Actions, use(), useOptimistic, Activity & More`
    }
  ]
};
