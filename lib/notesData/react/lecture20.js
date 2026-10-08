export const lecture20 = {
  slug: "lecture-20",
  number: 20,
  title: "Complete React Course — Module 6: Lecture 20: Custom Hooks — Reusing Stateful Logic",
  summary: "Learn how to extract repeated stateful logic into your own hooks. Covers the rules of hooks, naming, building useToggle, useLocalStorage, useDebounce, useFetch, useMediaQuery and useOnClickOutside, composing hooks together, testing them with renderHook, and the key idea that custom hooks share logic, not state.",
  readTime: "29 min read",
  difficulty: "Intermediate",
  date: "2026-10-08",
  sections: [
    {
      heading: "1. The Problem: Copy-Pasted Effects",
      content: `In the previous lecture we organised complex state with \`useReducer\`. But some logic is not complex, just **repeated**. Look at a typical app after a few months:
• The product page debounces the search box with a \`setTimeout\` inside \`useEffect\`.
• The orders page does the same thing, copied and slightly changed.
• Three components fetch data with \`useState\` + \`useEffect\` + a loading flag + an error flag.
• Two dropdowns each add a \`mousedown\` listener to \`document\` to close when you click outside.
Every copy is a chance for a bug: one copy forgets to clear the timer, another forgets to remove the event listener. When you fix a bug, you must fix it everywhere.
For plain calculations you would extract a **function**. But this logic uses hooks (\`useState\`, \`useEffect\`), and a normal function cannot call hooks. The answer is a **custom hook**: a JavaScript function whose name starts with \`use\` and which calls other hooks.`
    },
    {
      heading: "2. The Rules of Hooks (Recap and Why They Exist)",
      content: `Custom hooks are built from built-in hooks, so the same two rules apply:
1. **Only call hooks at the top level.** Never inside conditions, loops, nested functions, or after an early \`return\`.
2. **Only call hooks from React functions**: function components or other custom hooks. Not from regular functions, class components or event handlers.
**Why?** React does not identify hooks by name. It identifies them by **call order**. On every render React walks through the hooks in the same order and says "first hook → this state slot, second hook → that state slot". If a condition skips a hook on one render, every hook after it reads the wrong slot.
The one exception is \`use()\` (React 19), which may be called inside conditions and loops, though still only inside a component or hook.
Install \`eslint-plugin-react-hooks\` (Vite's React template includes it). Its \`rules-of-hooks\` and \`exhaustive-deps\` rules catch most mistakes before you even run the app. The React Compiler also relies on these rules: code that breaks them is skipped rather than optimised.`,
      codeSnippet: `// ❌ Wrong: hook called conditionally
function Profile({ userId }) {
  if (!userId) return <p>Please log in</p>;
  const [tab, setTab] = useState("posts"); // runs on some renders only
  // ...
}

// ✅ Right: hooks first, conditions after
function Profile({ userId }) {
  const [tab, setTab] = useState("posts");
  if (!userId) return <p>Please log in</p>;
  return <Tabs value={tab} onChange={setTab} />;
}`
    },
    {
      heading: "3. Your First Custom Hook: Extracting useToggle",
      content: `The recipe for extracting a hook is always the same:
1. Find the repeated block of hook code in a component.
2. Move it into a function named \`useSomething\`.
3. Turn the values it needs into **parameters**.
4. **Return** whatever the component needs: a value, an array, or an object.
A toggle is the smallest useful example. Modals, sidebars, "show password" buttons and accordions all need a boolean that flips.
**What to return?** Return an **array** when there are one or two values that callers will want to rename (like \`useState\`). Return an **object** when there are three or more values, so callers can pick what they need by name.`,
      codeSnippet: `// src/hooks/useToggle.js
import { useState, useCallback } from "react";

export function useToggle(initialValue = false) {
  const [on, setOn] = useState(initialValue);

  // Stable function identities, safe to pass to memoised children
  const toggle = useCallback(() => setOn((v) => !v), []);
  const setTrue = useCallback(() => setOn(true), []);
  const setFalse = useCallback(() => setOn(false), []);

  return [on, { toggle, setTrue, setFalse }];
}

// src/components/PasswordInput.jsx
import { useToggle } from "../hooks/useToggle";

export function PasswordInput() {
  const [visible, { toggle }] = useToggle();
  return (
    <div>
      <input type={visible ? "text" : "password"} placeholder="Password" />
      <button type="button" onClick={toggle}>
        {visible ? "Hide" : "Show"}
      </button>
    </div>
  );
}`
    },
    {
      heading: "4. Naming and Design Guidelines",
      content: `• **Always start with \`use\`** followed by a capital letter: \`useCart\`, \`useOnlineStatus\`. The prefix tells React's linter to check the rules of hooks inside the function and at every call site.
• **Don't add \`use\` to functions that call no hooks.** A function \`useFormatPrice\` that only formats a number should just be \`formatPrice\`. Otherwise you force callers to follow hook rules for no reason.
• **Name the purpose, not the implementation.** \`useOnlineStatus\` is better than \`useWindowEventListener\` when the component only cares whether the user is online.
• **Avoid "lifecycle" hooks** like \`useMount\` or \`useEffectOnce\`. They hide dependencies from the linter and encourage thinking in lifecycles instead of synchronisation.
• **Keep inputs and outputs small.** If a hook takes eight parameters, it probably does two jobs.
• **One folder:** put shared hooks in \`src/hooks/\`, one hook per file, named exports.`
    },
    {
      heading: "5. useLocalStorage — State That Survives a Refresh",
      content: `A cart, theme or draft form should survive a page reload. The pattern is: read from \`localStorage\` on the first render, write back whenever the value changes.
Important details:
• Use a **lazy initialiser** (\`useState(() => ...)\`) so \`localStorage\` is read once, not on every render.
• Wrap reads and writes in **try/catch**: storage can be full, disabled in private mode, or hold invalid JSON.
• Values are stored as strings, so use \`JSON.stringify\` and \`JSON.parse\`.
• The hook has the **same API as \`useState\`**, so you can swap one for the other without touching the rest of the component.`,
      codeSnippet: `// src/hooks/useLocalStorage.js
import { useState, useEffect } from "react";

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage full or blocked: keep working in memory
    }
  }, [key, value]);

  return [value, setValue];
}

// Usage: identical to useState
// const [cart, setCart] = useLocalStorage("cart", []);
// setCart((items) => [...items, { id: 7, name: "Masala Chai", price: 120 }]);`
    },
    {
      heading: "6. useDebounce — Waiting Until the User Stops Typing",
      content: `Searching "bangalore" should not fire nine API requests, one per letter. **Debouncing** delays a value until it has stopped changing for a set time.
The hook keeps its own copy of the value and updates it only after \`delay\` milliseconds of quiet. The **cleanup function** cancels the pending timer whenever the value changes again, which is the whole trick.
Note that React's \`useDeferredValue\` solves a different problem: it keeps the UI responsive during heavy rendering, but it does not reduce the number of network requests. For API calls, debounce.`,
      codeSnippet: `// src/hooks/useDebounce.js
import { useState, useEffect } from "react";

export function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id); // cancel if value changes before delay
  }, [value, delay]);

  return debounced;
}

// Usage
// const [query, setQuery] = useState("");
// const debouncedQuery = useDebounce(query, 400);
// useEffect(() => { if (debouncedQuery) search(debouncedQuery); }, [debouncedQuery]);`
    },
    {
      heading: "7. useFetch — Loading, Error and Data in One Place",
      content: `Almost every component that loads data needs the same three pieces of state: \`data\`, \`loading\` and \`error\`. A \`useFetch\` hook removes that boilerplate.
Two bugs a good version must avoid:
• **Race conditions.** If the URL changes quickly (page 1 → page 2), the slower first response can arrive last and overwrite the correct data. We use an \`AbortController\` to cancel the old request in the cleanup function.
• **Updating after unmount.** Aborting also stops the request when the component leaves the screen.
**Production note:** this hook is great for learning and small apps. Real apps need caching, deduplication, background refetching and retries, which is exactly what **TanStack Query** (v5) gives you. We cover it later in the course. The \`useFetch\` pattern teaches you what such libraries do internally.`,
      codeSnippet: `// src/hooks/useFetch.js
import { useState, useEffect } from "react";

export function useFetch(url) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    if (!url) return;
    const controller = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(\`Request failed: \${res.status}\`);
        return res.json();
      })
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((err) => {
        if (err.name === "AbortError") return; // ignore cancelled requests
        setState({ data: null, loading: false, error: err.message });
      });

    return () => controller.abort();
  }, [url]);

  return state;
}

// Usage
// const { data: users, loading, error } = useFetch("https://jsonplaceholder.typicode.com/users");`
    },
    {
      heading: "8. useMediaQuery — Responsive Logic in JavaScript",
      content: `CSS media queries handle most responsive design. But sometimes JavaScript must know the screen size, for example to render a bottom sheet on mobile and a modal on desktop.
\`window.matchMedia\` gives us the answer and fires a \`change\` event when it flips. Because this is an **external store** (the browser owns the value, not React), the correct built-in hook is \`useSyncExternalStore\`. It subscribes, reads a snapshot, and avoids the "tearing" bugs that a hand-written \`useState\` + \`useEffect\` version can have.
The third argument, \`getServerSnapshot\`, is used during server rendering (Next.js or React Router framework mode) where \`window\` does not exist.`,
      codeSnippet: `// src/hooks/useMediaQuery.js
import { useSyncExternalStore, useCallback } from "react";

export function useMediaQuery(query) {
  const subscribe = useCallback(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query]
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches, // client snapshot
    () => false                              // server snapshot
  );
}

// Usage
// const isMobile = useMediaQuery("(max-width: 640px)");
// return isMobile ? <BottomSheet /> : <Modal />;`
    },
    {
      heading: "9. useOnClickOutside — Closing Dropdowns and Modals",
      content: `Dropdowns, menus and popovers should close when the user clicks anywhere else. The hook takes a **ref** to the element and a **handler** to call when a click lands outside it.
A subtle problem: if the caller passes an inline arrow function, the handler changes on every render. Putting it in the effect's dependency array would remove and re-add the document listener on every render. React 19.2's stable \`useEffectEvent\` fixes this cleanly: it wraps the handler so the effect always calls the **latest** version without listing it as a dependency.
We listen to \`pointerdown\` so that mouse, touch and pen all work.`,
      codeSnippet: `// src/hooks/useOnClickOutside.js
import { useEffect, useEffectEvent } from "react";

export function useOnClickOutside(ref, handler) {
  // Always sees the latest handler, never triggers re-subscription
  const onOutside = useEffectEvent((event) => handler(event));

  useEffect(() => {
    function listener(event) {
      const el = ref.current;
      if (!el || el.contains(event.target)) return; // click was inside
      onOutside(event);
    }
    document.addEventListener("pointerdown", listener);
    return () => document.removeEventListener("pointerdown", listener);
  }, [ref]);
}

// Usage
// const menuRef = useRef(null);
// useOnClickOutside(menuRef, () => setOpen(false));
// <div ref={menuRef}>...</div>`
    },
    {
      heading: "10. Custom Hooks Share Logic, Not State",
      content: `This is the most misunderstood point about custom hooks, and a favourite interview question.
When two components call \`useToggle()\`, they do **not** share one boolean. Each call creates its **own, completely independent** state, exactly as if each component had written \`useState\` itself. A custom hook is a reusable **recipe**, not a shared **store**.
Think of it like a recipe for dal: two kitchens following the same recipe cook two separate pots.
So how do you share actual state between components?
• **Lift state up** to a common parent (Lecture 17).
• Put it in **Context** (Lecture 18), often wrapped in a custom hook like \`useAuth()\`.
• Use an **external store** such as Zustand v5 or Redux Toolkit 2, covered later in the course.
Also remember: every time the component re-renders, the hook's code runs again. Hooks are just functions called during render, so keep them pure apart from their effects.`,
      codeSnippet: `// Two independent toggles: clicking one does NOT affect the other
function Faq() {
  const [shippingOpen, shipping] = useToggle();
  const [refundOpen, refund] = useToggle();

  return (
    <>
      <button onClick={shipping.toggle}>Shipping {shippingOpen ? "−" : "+"}</button>
      {shippingOpen && <p>Free delivery across India above ₹499.</p>}

      <button onClick={refund.toggle}>Refunds {refundOpen ? "−" : "+"}</button>
      {refundOpen && <p>Refunds are processed within 7 working days.</p>}
    </>
  );
}`
    },
    {
      heading: "11. Composing Hooks: Hooks That Use Hooks",
      content: `Custom hooks can call other custom hooks. This is where they become really powerful: you build small, tested pieces and combine them into higher-level, feature-specific hooks.
Below, \`useProductSearch\` combines \`useDebounce\` and \`useFetch\`. The component that uses it does not know (or care) about timers, abort controllers or URLs. It just gets results.
Notice how data flows: \`query\` is the input, \`useDebounce\` returns a slower copy, which builds the URL, which \`useFetch\` loads. Each hook re-runs on every render and receives the latest values, so changes flow through the chain automatically.
Rule of thumb: generic hooks (\`useDebounce\`, \`useFetch\`) live in \`src/hooks/\`; feature hooks (\`useProductSearch\`, \`useCart\`) live next to the feature that uses them.`,
      codeSnippet: `// src/features/products/useProductSearch.js
import { useDebounce } from "../../hooks/useDebounce";
import { useFetch } from "../../hooks/useFetch";

export function useProductSearch(query) {
  const debounced = useDebounce(query.trim(), 400);
  const url = debounced
    ? \`https://dummyjson.com/products/search?q=\${encodeURIComponent(debounced)}\`
    : null;

  const { data, loading, error } = useFetch(url);

  return {
    products: data?.products ?? [],
    loading: Boolean(url) && loading,
    error,
    isTyping: query.trim() !== debounced,
  };
}`
    },
    {
      heading: "12. Testing Custom Hooks with Vitest and React Testing Library",
      content: `Hooks can only run inside a component, so you can't simply call \`useToggle()\` in a test. React Testing Library provides \`renderHook\`, which renders a tiny test component for you and exposes the hook's return value on \`result.current\`.
Key tools:
• **\`renderHook(() => useX(args))\`** returns \`{ result, rerender, unmount }\`.
• **\`act(() => ...)\`** wraps anything that updates state, so React finishes processing before you assert.
• **\`vi.useFakeTimers()\`** lets you jump time forward for debounce tests instead of really waiting.
• **\`rerender(newProps)\`** passes new arguments, useful for hooks whose input changes.
Install with: \`npm i -D vitest @testing-library/react jsdom\` and set \`test: { environment: "jsdom" }\` in \`vite.config.js\`.
Often the best test is still a **component test**: render a component that uses the hook and assert on what the user sees. Use \`renderHook\` for generic hooks shared across many components.`,
      codeSnippet: `// src/hooks/useDebounce.test.js
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { useDebounce } from "./useDebounce";
import { useToggle } from "./useToggle";

afterEach(() => vi.useRealTimers());

describe("useToggle", () => {
  it("flips the value", () => {
    const { result } = renderHook(() => useToggle(false));
    act(() => result.current[1].toggle());
    expect(result.current[0]).toBe(true);
  });
});

describe("useDebounce", () => {
  it("updates only after the delay", () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: "del" } }
    );

    rerender({ value: "delhi" });
    expect(result.current).toBe("del");   // not yet

    act(() => vi.advanceTimersByTime(500));
    expect(result.current).toBe("delhi"); // now updated
  });
});`
    },
    {
      heading: "13. Common Mistakes with Custom Hooks",
      content: `• **Expecting shared state.** Calling \`useCart()\` in the header and in the cart page gives two separate carts unless the hook reads from Context or a store.
• **Calling a hook conditionally** (\`if (isLoggedIn) useFetch(...)\`). Instead, pass a flag or \`null\` URL into the hook and let it skip the work internally, as our \`useFetch\` does.
• **Missing cleanup.** Forgetting \`clearTimeout\`, \`removeEventListener\` or \`controller.abort()\` causes memory leaks and stale updates.
• **Returning new objects or functions every render** from hooks used in dependency arrays, causing effects to re-run endlessly. Use \`useCallback\`/\`useMemo\` for returned functions, or let the React Compiler handle it.
• **Silencing the \`exhaustive-deps\` lint rule** instead of fixing the cause. Use \`useEffectEvent\` for "latest callback" cases.
• **Prefixing plain utilities with \`use\`.** If it calls no hooks, it's a normal function.
• **Hooks that do too much**, like a \`usePage\` that fetches, validates forms and tracks analytics. Split it.
• **Reading \`window\` or \`localStorage\` during server rendering** without a guard, which crashes in Next.js or React Router framework mode.`
    },
    {
      heading: "14. Top React Interview Questions on Custom Hooks",
      content: `**Q1. What is a custom hook?**
A JavaScript function whose name starts with \`use\` and which calls one or more other hooks. It lets you reuse stateful logic between components without changing the component tree.
**Q2. Do two components using the same custom hook share state?**
No. Each call gets its own independent state. Hooks share logic, not state. To share state, use Context, lifted state or an external store.
**Q3. Why must hooks be called in the same order on every render?**
React tracks hook state by call order, not by name. Changing the order makes hooks read another hook's state.
**Q4. Why must a custom hook's name start with "use"?**
It is a convention the linter (and the React Compiler) relies on to know the function may call hooks, so it can enforce the rules inside it and at its call sites.
**Q5. How are custom hooks different from Higher-Order Components and render props?**
They reuse logic without adding wrapper components, avoid "wrapper hell" and prop-name collisions, and compose with plain function calls.
**Q6. How do you test a custom hook?**
With \`renderHook\` from React Testing Library, wrapping state updates in \`act\`, and using fake timers for time-based hooks.
**Q7. How do you prevent race conditions in a data-fetching hook?**
Cancel the previous request in the effect cleanup using \`AbortController\`, or ignore stale responses with a flag. Better still, use TanStack Query.
**Q8. When would you use useSyncExternalStore in a custom hook?**
When subscribing to a value owned outside React, such as \`matchMedia\`, \`navigator.onLine\` or a third-party store.`
    },
    {
      heading: "15. Practical Hands-On Exercise — City Search with Saved Favourites",
      content: `Build a small app that uses **five** custom hooks together:
1. Create \`src/hooks/\` and copy in \`useToggle\`, \`useLocalStorage\`, \`useDebounce\`, \`useMediaQuery\` and \`useOnClickOutside\` from this lecture.
2. Paste the component below into \`src/App.jsx\` of a Vite React project.
3. Type in the search box: filtering waits until you pause typing (debounce).
4. Star a few cities, then refresh the page. Your favourites remain (localStorage).
5. Open the "Favourites" dropdown and click outside it to close it.
6. Resize the window below 640px and watch the layout switch.
**Challenges:** add a \`useFetch\` call to load cities from an API, write a \`renderHook\` test for \`useLocalStorage\`, and move favourites into Context so that two components share them.`,
      codeSnippet: `// src/App.jsx
import { useState, useRef } from "react";
import { useToggle } from "./hooks/useToggle";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useDebounce } from "./hooks/useDebounce";
import { useMediaQuery } from "./hooks/useMediaQuery";
import { useOnClickOutside } from "./hooks/useOnClickOutside";

const CITIES = [
  "Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Chennai", "Kolkata",
  "Pune", "Ahmedabad", "Jaipur", "Lucknow", "Kochi", "Indore",
];

export default function App() {
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 300);
  const [favourites, setFavourites] = useLocalStorage("fav-cities", []);
  const [menuOpen, menu] = useToggle(false);
  const menuRef = useRef(null);
  const isMobile = useMediaQuery("(max-width: 640px)");

  useOnClickOutside(menuRef, menu.setFalse);

  const results = CITIES.filter((c) =>
    c.toLowerCase().includes(debounced.toLowerCase())
  );

  function toggleFavourite(city) {
    setFavourites((list) =>
      list.includes(city) ? list.filter((c) => c !== city) : [...list, city]
    );
  }

  return (
    <main style={{ maxWidth: 640, margin: "2rem auto", padding: "0 16px", fontFamily: "system-ui" }}>
      <h2 style={{ color: "#002057" }}>Lecture 20: City Finder</h2>
      <p>{isMobile ? "Mobile layout" : "Desktop layout"}</p>

      <div style={{ display: "flex", gap: 8, flexDirection: isMobile ? "column" : "row" }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a city..."
          style={{ flex: 1, padding: 8 }}
        />
        <div ref={menuRef} style={{ position: "relative" }}>
          <button onClick={menu.toggle}>Favourites ({favourites.length})</button>
          {menuOpen && (
            <ul style={{ position: "absolute", right: 0, background: "#fff", border: "1px solid #ccc", padding: 8, margin: 0, listStyle: "none", minWidth: 160 }}>
              {favourites.length === 0 && <li>No favourites yet</li>}
              {favourites.map((c) => <li key={c}>{c}</li>)}
            </ul>
          )}
        </div>
      </div>

      {query !== debounced && <p style={{ color: "#888" }}>Searching...</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {results.map((city) => (
          <li key={city} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #eee" }}>
            {city}
            <button onClick={() => toggleFavourite(city)}>
              {favourites.includes(city) ? "★ Saved" : "☆ Save"}
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}`
    },
    {
      heading: "16. Summary",
      content: `• A **custom hook** is a function starting with \`use\` that calls other hooks. It reuses **stateful logic** between components.
• The **rules of hooks** (top level only, only in components or hooks) exist because React tracks hooks by call order.
• Extract a hook by moving repeated hook code into a function, turning inputs into parameters and returning what callers need.
• We built \`useToggle\`, \`useLocalStorage\`, \`useDebounce\`, \`useFetch\` (with \`AbortController\`), \`useMediaQuery\` (with \`useSyncExternalStore\`) and \`useOnClickOutside\` (with \`useEffectEvent\`).
• Custom hooks **share logic, not state**: every call gets independent state. Use Context or a store to share data.
• Compose small generic hooks into feature hooks like \`useProductSearch\`.
• Test hooks with \`renderHook\`, \`act\` and Vitest fake timers.
• For serious data fetching, prefer TanStack Query over a hand-rolled \`useFetch\`.
**Next lecture:** Routing with React Router v7`
    }
  ]
};
