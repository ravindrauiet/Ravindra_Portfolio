export const lecture14 = {
  slug: "lecture-14",
  number: 14,
  title: "Complete React Course — Module 4: Lecture 14: useEffect Deep Dive — Dependencies, Data Fetching, Race Conditions & useEffectEvent",
  summary: "Go beyond the basics of useEffect: the exhaustive-deps lint rule, stale closures, object and function dependencies, fetching data safely with AbortController and race-condition handling, loading and error states, useEffectEvent from React 19.2, the 'You Might Not Need an Effect' patterns (derived state, event handlers, resetting state with key), and useLayoutEffect.",
  readTime: "31 min read",
  difficulty: "Intermediate",
  date: "2026-10-08",
  sections: [
    {
      heading: "1. Where We Are and What This Lecture Covers",
      content: `In the previous lecture you learned what an Effect is: code that **synchronizes your component with something outside React** — a network request, a timer, a browser API, a WebSocket. You learned the three forms of the dependency array (none, empty, with values) and why cleanup functions matter.
That is enough to write Effects. It is not enough to write **correct** Effects. Most real bugs in React apps live inside \`useEffect\`: data that shows the wrong user, intervals stuck at an old value, requests that finish in the wrong order, and Effects that run on every render for no reason.
In this lecture you will learn:
• How React decides when to re-run an Effect, and why you should trust the **exhaustive-deps** lint rule.
• What a **stale closure** is and how to fix it.
• Why **objects and functions** in the dependency array cause infinite or excessive re-runs.
• How to fetch data with **loading and error states**, and how to prevent **race conditions** with an \`ignore\` flag or \`AbortController\`.
• How **\`useEffectEvent\`** (stable since React 19.2) separates "reactive" logic from "non-reactive" logic.
• When you **don't need an Effect at all**.
• When to reach for **\`useLayoutEffect\`** instead.
**Mental model for this whole lecture:** an Effect is not a lifecycle method. It describes how to start and stop synchronizing with an external system, given the current props and state.`
    },
    {
      heading: "2. The Dependency Array and the exhaustive-deps Rule",
      content: `After every render, React compares each value in the dependency array with its value from the previous render using \`Object.is\`. If **any** value changed, React runs the previous cleanup and then runs the Effect again.
The rule is simple: **every reactive value the Effect reads must be in the dependency array.** Reactive values are props, state, and any variable or function declared inside the component body. Values declared outside the component (constants, imported functions) and state setter functions from \`useState\` are stable, so they don't need to be listed.
Vite's React templates include **eslint-plugin-react-hooks**, which contains the \`react-hooks/exhaustive-deps\` rule. It reads your Effect, finds every reactive value used inside, and warns when one is missing.
**Treat that warning as a bug report, not a suggestion.** If you silence it with \`// eslint-disable-next-line\`, your Effect will read old values and you will spend hours debugging.
You do not "choose" dependencies. Your code determines them. If you want fewer dependencies, change the code so that it doesn't need them — the rest of this lecture shows how.`,
      codeSnippet: `// src/components/ChatRoom.jsx
import { useEffect, useState } from "react";
import { createConnection } from "../lib/chat"; // outside the component: not reactive

const SERVER_URL = "wss://chat.example.in"; // module constant: not reactive

export default function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]); // setMessages is stable

  useEffect(() => {
    const connection = createConnection(SERVER_URL, roomId);
    connection.on("message", (msg) => setMessages((prev) => [...prev, msg]));
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // roomId is a prop -> reactive -> must be listed

  return (
    <ul>
      {messages.map((m) => (
        <li key={m.id}>{m.text}</li>
      ))}
    </ul>
  );
}`
    },
    {
      heading: "3. Stale Closures — The Most Common useEffect Bug",
      content: `Every render creates a new set of functions, and each function "closes over" the props and state **of that render**. An Effect created during render 1 sees the values from render 1 forever.
A **stale closure** happens when an Effect keeps running code from an old render — usually because a dependency was left out — so it keeps reading old values.
The classic example is a counter with \`setInterval\` and an empty dependency array. The interval callback was created during the first render, when \`count\` was 0. Every tick it calculates \`0 + 1\`, so the counter gets stuck at 1.
There are two correct fixes:
1. **Use an updater function** — \`setCount(c => c + 1)\`. The Effect no longer reads \`count\`, so the empty array is honest. This is the best fix here.
2. **Add \`count\` to the dependencies** — correct, but the interval is torn down and recreated every second.
Stale closures also appear in event listeners added inside Effects (\`window.addEventListener\`), in \`setTimeout\` callbacks and in WebSocket handlers. The cure is always the same: either list the dependency, or restructure so the value isn't read.`,
      codeSnippet: `// src/components/Stopwatch.jsx
import { useEffect, useState } from "react";

export default function Stopwatch() {
  const [count, setCount] = useState(0);

  // BUG: stale closure. 'count' is always 0 inside this callback.
  // useEffect(() => {
  //   const id = setInterval(() => setCount(count + 1), 1000);
  //   return () => clearInterval(id);
  // }, []); // lint warning: missing dependency 'count'

  // FIX: updater function, no need to read 'count'
  useEffect(() => {
    const id = setInterval(() => setCount((c) => c + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return <h2>Seconds elapsed: {count}</h2>;
}`
    },
    {
      heading: "4. Object and Function Dependencies",
      content: `\`Object.is\` compares objects and functions by **reference**, not by content. An object or function created in the component body is a brand new value on every render, so an Effect that depends on it runs after **every** render.
If that Effect also sets state, you get an **infinite loop**: render → new object → Effect runs → setState → render → new object → ...
Fixes, in order of preference:
• **Move the object or function inside the Effect.** Then it's not a dependency at all; only the primitive values it uses are.
• **Move it outside the component** if it doesn't use props or state.
• **Depend on primitive values** (\`options.roomId\`) instead of the whole object.
• **Memoize** with \`useMemo\` or \`useCallback\` when the value must be created in the component (for example, passed down from a parent). If your project uses **React Compiler 1.0**, it memoizes many of these values automatically, but the first three fixes are still clearer.
Do not "fix" this by removing the object from the array and disabling the lint rule.`,
      codeSnippet: `// src/components/ProductList.jsx
import { useEffect, useState } from "react";

export default function ProductList({ category, maxPrice }) {
  const [products, setProducts] = useState([]);

  // BAD: 'filters' is a new object every render -> Effect runs every render
  // const filters = { category, maxPrice };
  // useEffect(() => { fetchProducts(filters).then(setProducts); }, [filters]);

  // GOOD: build the object inside the Effect, depend on primitives
  useEffect(() => {
    const filters = { category, maxPrice };
    const params = new URLSearchParams({
      category: filters.category,
      maxPrice: String(filters.maxPrice),
    });
    fetch("/api/products?" + params)
      .then((res) => res.json())
      .then(setProducts);
  }, [category, maxPrice]);

  return (
    <ul>
      {products.map((p) => (
        <li key={p.id}>{p.name} — ₹{p.price}</li>
      ))}
    </ul>
  );
}`
    },
    {
      heading: "5. Fetching Data in an Effect — Loading and Error States",
      content: `When you fetch inside an Effect you need to model three things in state: the **data**, whether it is **loading**, and any **error**. Without loading and error states, users stare at an empty screen or a crash.
Important details:
• \`fetch\` only rejects on network failures. A 404 or 500 response **resolves** normally, so check \`res.ok\` and throw yourself.
• The Effect function itself cannot be \`async\` (it must return nothing or a cleanup function). Define an async function inside and call it.
• Reset \`loading\` and \`error\` at the start of each new request.
• In development, **Strict Mode runs your Effect, cleans it up and runs it again** to surface missing cleanup. Seeing two requests in the Network tab during development is expected; the fix in the next sections makes it harmless.
This basic version still has a race-condition bug. We fix it in the next two sections.`,
      codeSnippet: `// src/components/UserProfile.jsx
import { useEffect, useState } from "react";

export default function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadUser() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("https://jsonplaceholder.typicode.com/users/" + userId);
        if (!res.ok) throw new Error("Request failed with status " + res.status);
        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [userId]);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p role="alert">Error: {error}</p>;
  return (
    <div>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
}`
    },
    {
      heading: "6. Race Conditions — Why Responses Arrive Out of Order",
      content: `Imagine the user clicks "User 1", then quickly "User 2". Two requests are in flight. Networks don't guarantee order: the response for User 2 might arrive **first**, and then the slower User 1 response arrives and overwrites it. The screen now shows User 1 while the selected tab says User 2.
This is a **race condition**. It happens in search boxes, tab switches, pagination and anywhere a dependency changes faster than the network responds.
The simplest fix uses the cleanup function. Each Effect run gets its own local \`ignore\` variable. When the dependency changes, React runs the cleanup of the **previous** Effect, which sets that run's \`ignore\` to \`true\`. When the old response finally arrives, it checks the flag and throws the result away.
This works with any async API (not just \`fetch\`), because it doesn't cancel anything — it simply ignores stale results.`,
      codeSnippet: `// src/components/UserProfile.jsx (race-safe with an ignore flag)
useEffect(() => {
  let ignore = false;

  async function loadUser() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/users/" + userId);
      if (!res.ok) throw new Error("Request failed with status " + res.status);
      const data = await res.json();
      if (!ignore) setUser(data);          // only the latest run may update state
    } catch (err) {
      if (!ignore) setError(err.message);
    } finally {
      if (!ignore) setLoading(false);
    }
  }

  loadUser();
  return () => {
    ignore = true; // runs when userId changes or the component unmounts
  };
}, [userId]);`
    },
    {
      heading: "7. Cancelling Requests with AbortController",
      content: `The \`ignore\` flag prevents wrong data, but the old request still downloads in the background. **\`AbortController\`** is a browser API that actually cancels the request, saving bandwidth on slow mobile connections.
How it works:
1. Create \`new AbortController()\` inside the Effect.
2. Pass \`controller.signal\` to \`fetch\`.
3. Call \`controller.abort()\` in the cleanup.
4. An aborted \`fetch\` rejects with an error whose \`name\` is \`"AbortError"\`. Ignore that error — it isn't a real failure.
It is a good idea to wrap this pattern in a **custom hook** so every component gets loading, error and cancellation for free. (Custom hooks get a full lecture later in the course; for now, a custom hook is just a function whose name starts with \`use\` and that calls other hooks.)
**Production note:** for real apps, a data-fetching library such as **TanStack Query v5** (or your framework's data loading, e.g. React Router v7 loaders) handles caching, deduplication, retries and race conditions for you. Learn the manual pattern first so you understand what those tools solve.`,
      codeSnippet: `// src/hooks/useFetch.js
import { useEffect, useState } from "react";

export function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function run() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error("HTTP " + res.status);
        setData(await res.json());
        setLoading(false);
      } catch (err) {
        if (err.name === "AbortError") return; // cancelled on purpose, not an error
        setError(err.message);
        setLoading(false);
      }
    }

    run();
    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
}

// Usage: src/components/Post.jsx
// const { data, loading, error } = useFetch("https://jsonplaceholder.typicode.com/posts/" + id);`
    },
    {
      heading: "8. useEffectEvent — Reading Latest Values Without Re-running (React 19.2)",
      content: `Sometimes an Effect needs to **read** a value without **reacting** to it. Example: a chat room connects when \`roomId\` changes, and when connected it shows a notification using the current \`theme\`. If you list \`theme\`, switching from light to dark mode reconnects the chat — clearly wrong. If you omit \`theme\`, the lint rule complains and you risk a stale closure.
**\`useEffectEvent\`**, stable in React 19.2, solves this. You wrap the non-reactive part in an **Effect Event**. Inside it, you always see the **latest** props and state, but it is not reactive, so it doesn't belong in the dependency array.
Rules for Effect Events:
• Import it from \`react\`: \`import { useEffectEvent } from "react"\`.
• Call Effect Events **only from inside Effects** (or from functions those Effects run, like a timer callback).
• **Don't pass them to other components or hooks**, and don't call them during render.
• Don't list them as dependencies. Recent versions of \`eslint-plugin-react-hooks\` understand \`useEffectEvent\` and won't ask you to.
• Don't use them just to hide dependencies you are too lazy to handle. Use them only for logic that is genuinely an "event" fired by the Effect — logging, notifications, reading a setting.
Before React 19.2, developers used a "latest ref" pattern (\`useRef\` updated on every render) for the same purpose. \`useEffectEvent\` is now the official replacement.`,
      codeSnippet: `// src/components/ChatRoom.jsx
import { useEffect, useEffectEvent } from "react";
import { createConnection } from "../lib/chat";
import { showNotification } from "../lib/notifications";

export default function ChatRoom({ roomId, theme }) {
  // Non-reactive: always reads the latest 'theme', never triggers a reconnect
  const onConnected = useEffectEvent(() => {
    showNotification("Connected to #" + roomId, theme);
  });

  useEffect(() => {
    const connection = createConnection("wss://chat.example.in", roomId);
    connection.on("connected", () => {
      onConnected(); // called from inside the Effect: allowed
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // only roomId: changing theme does NOT reconnect

  return <h2>Welcome to #{roomId}</h2>;
}`
    },
    {
      heading: "9. You Might Not Need an Effect — Derived State",
      content: `The official React docs have a whole page titled **"You Might Not Need an Effect"**, and it is one of the most important pages to read. Effects are an **escape hatch** for syncing with external systems. If no external system is involved, you probably don't need one.
The most common unnecessary Effect is **derived state**: copying a calculation into state with an Effect. For example, keeping \`fullName\` in state and updating it whenever \`firstName\` or \`lastName\` changes. This causes an extra render with stale data and adds code that can go wrong.
**Rule:** if a value can be calculated from props or state, **calculate it during render**.
If the calculation is expensive (filtering thousands of rows), wrap it in \`useMemo\` instead of moving it to an Effect. With React Compiler 1.0 enabled, many such calculations are memoized automatically.`,
      codeSnippet: `// src/components/Cart.jsx
import { useState } from "react";

export default function Cart({ items }) {
  const [coupon, setCoupon] = useState("");

  // BAD: derived state synced with an Effect (extra render, easy to get out of sync)
  // const [total, setTotal] = useState(0);
  // useEffect(() => {
  //   setTotal(items.reduce((sum, i) => sum + i.price * i.qty, 0));
  // }, [items]);

  // GOOD: calculate during render
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const discount = coupon === "DIWALI10" ? subtotal * 0.1 : 0;
  const total = subtotal - discount;

  return (
    <div>
      <input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Coupon code" />
      <p>Subtotal: ₹{subtotal.toLocaleString("en-IN")}</p>
      <p>Discount: ₹{discount.toLocaleString("en-IN")}</p>
      <h3>Total: ₹{total.toLocaleString("en-IN")}</h3>
    </div>
  );
}`
    },
    {
      heading: "10. You Might Not Need an Effect — Event Handlers Instead of Effects",
      content: `Ask one question about every piece of logic: **why does this code run?**
• If it runs **because the user did something** (clicked Buy, submitted a form), it belongs in the **event handler**.
• If it runs **because the component appeared on screen** or a value it displays changed, and it syncs with something external, it belongs in an **Effect**.
A common mistake is setting a flag in an event handler and then reacting to that flag in an Effect — for example, setting \`submitted\` to \`true\` and then sending a POST request in an Effect that watches \`submitted\`. This is indirect, runs again if the component re-mounts, and makes the flow hard to follow.
Another mistake is **chains of Effects** where one Effect sets state that triggers another Effect that sets more state. Each link adds a render. Calculate what you can during render and do the rest in a single event handler.`,
      codeSnippet: `// src/components/BuyButton.jsx
import { useState } from "react";

export default function BuyButton({ product }) {
  const [status, setStatus] = useState("idle");

  // BAD: event -> flag in state -> Effect sends the request
  // const [shouldBuy, setShouldBuy] = useState(false);
  // useEffect(() => { if (shouldBuy) { fetch("/api/orders", ...); } }, [shouldBuy]);

  // GOOD: the user clicked, so do the work in the click handler
  async function handleBuy() {
    setStatus("saving");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, qty: 1 }),
      });
      if (!res.ok) throw new Error("Order failed");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <button onClick={handleBuy} disabled={status === "saving"}>
      {status === "saving" ? "Placing order..." : "Buy for ₹" + product.price}
    </button>
  );
}`
    },
    {
      heading: "11. You Might Not Need an Effect — Resetting State with key",
      content: `Suppose a \`ProfilePage\` receives a \`userId\` and contains a comment box. When you switch to another user's profile, the half-typed comment from the previous user is still there, because React reuses the same component instance.
The tempting fix is an Effect: \`useEffect(() => setComment(""), [userId])\`. This renders once with the stale comment, then clears it — a flicker and an extra render. It also needs repeating for every piece of state.
The correct fix: **give the component a \`key\`**. When the \`key\` changes, React treats it as a **different component** — it unmounts the old one and mounts a fresh one, resetting all state inside it, including nested children.
You learned \`key\` for lists in an earlier lecture; this is the same mechanism used on a single component.
For the rarer case of adjusting **only part** of the state when a prop changes, prefer calculating the value during render (for example, store a selected \`id\` instead of the selected object) before considering anything else.`,
      codeSnippet: `// src/pages/ProfilePage.jsx
import { useState } from "react";

export default function ProfilePage({ userId }) {
  // key={userId}: a new user means a brand-new CommentBox with fresh state
  return <CommentBox key={userId} userId={userId} />;
}

function CommentBox({ userId }) {
  const [comment, setComment] = useState("");
  // No Effect needed to reset 'comment' when userId changes

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <label>
        Comment for user {userId}:
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
      </label>
      <button type="submit">Post</button>
    </form>
  );
}`
    },
    {
      heading: "12. useLayoutEffect — When the User Must Not See a Flicker",
      content: `\`useEffect\` runs **after the browser has painted** the screen. That's ideal for most work because it doesn't block the user from seeing the update.
\`useLayoutEffect\` has the same signature, but runs **after React updates the DOM and before the browser paints**. The browser waits for it to finish. If it sets state, React re-renders synchronously, and the user only ever sees the final result.
Use it when you must **measure layout and then change it** before the user sees anything:
• Positioning a tooltip above or below an element depending on available space.
• Reading an element's size to set a scroll position.
• Animations that need a starting measurement.
Cautions:
• It blocks painting, so slow code inside it makes the app feel sluggish. **Prefer \`useEffect\`** unless you see a visible flicker.
• It does not run during server rendering, so frameworks that render on the server can't use it for the initial HTML.
The example uses \`useRef\` to read a DOM element — you'll study refs in detail in the next lecture.`,
      codeSnippet: `// src/components/Tooltip.jsx
import { useLayoutEffect, useRef, useState } from "react";

export default function Tooltip({ targetRect, children }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  // Measure before paint, so the tooltip never appears in the wrong place
  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, [children]);

  // Not enough room above? Show it below the target instead.
  const fitsAbove = targetRect.top - tooltipHeight > 0;
  const top = fitsAbove ? targetRect.top - tooltipHeight : targetRect.bottom;

  return (
    <div
      ref={ref}
      style={{ position: "fixed", left: targetRect.left, top, background: "#002057", color: "#fff", padding: "6px 10px", borderRadius: "6px" }}
    >
      {children}
    </div>
  );
}`
    },
    {
      heading: "13. Common Mistakes with useEffect",
      content: `1. **Disabling the exhaustive-deps lint rule.** It hides stale closures. Restructure the code instead.
2. **Putting objects or inline functions in the dependency array.** They change every render and cause re-runs or infinite loops. Create them inside the Effect.
3. **Making the Effect function itself \`async\`.** \`useEffect(async () => ...)\` returns a Promise, not a cleanup function. Define an async function inside and call it.
4. **Not checking \`res.ok\`.** \`fetch\` does not reject on 404 or 500 responses.
5. **Ignoring race conditions.** Without an \`ignore\` flag or \`AbortController\`, fast-changing inputs show results for an old query.
6. **Treating an \`AbortError\` as a real error** and showing a red error message whenever the user types quickly.
7. **Syncing derived state with an Effect** instead of calculating it during render.
8. **Running user-triggered logic (POST requests, toasts) in Effects** instead of event handlers.
9. **Resetting state with an Effect** when a \`key\` would reset it cleanly.
10. **"Fixing" Strict Mode's double run** by adding a ref guard. The double run in development is there to reveal missing cleanup; add the cleanup instead.
11. **Using \`useLayoutEffect\` by default.** It blocks painting. Use it only for measure-then-adjust layout work.
12. **Using \`useEffectEvent\` to dodge dependencies** that should trigger re-synchronization.`
    },
    {
      heading: "14. Top React Interview Questions on useEffect",
      content: `**Q1: What does the exhaustive-deps rule check, and should you ever ignore it?**
*Answer*: It checks that every reactive value (props, state, values declared in the component) read inside an Effect is listed in its dependency array. Ignoring it leads to stale closures; the right fix is to change the code so the dependency isn't needed.

**Q2: What is a stale closure in React?**
*Answer*: A function that captured props or state from an earlier render and keeps using those old values, typically an interval or listener inside an Effect with missing dependencies. Fix it with an updater function, by adding the dependency, or with \`useEffectEvent\` for non-reactive reads.

**Q3: Why does passing an object as a dependency cause an Effect to run on every render?**
*Answer*: React compares dependencies with \`Object.is\`. A new object literal has a new reference on every render, so it is always "changed". Create the object inside the Effect or depend on its primitive fields.

**Q4: How do you prevent race conditions when fetching data in an Effect?**
*Answer*: In the cleanup, either set a local \`ignore\` flag so stale responses are discarded, or call \`abort()\` on an \`AbortController\` whose signal was passed to \`fetch\`, and ignore the resulting \`AbortError\`.

**Q5: Why can't the Effect callback be async?**
*Answer*: An async function always returns a Promise, but React expects the Effect to return either nothing or a cleanup function.

**Q6: What problem does useEffectEvent solve?**
*Answer*: It lets an Effect read the latest props and state without re-running when they change. The Effect Event is non-reactive, is called only from inside Effects, and is not listed as a dependency.

**Q7: Name three cases where you don't need an Effect.**
*Answer*: Calculating values from props or state (compute during render), handling user actions (use event handlers), and resetting state when a prop changes (use a \`key\`).

**Q8: What is the difference between useEffect and useLayoutEffect?**
*Answer*: \`useEffect\` runs after the browser paints; \`useLayoutEffect\` runs after DOM updates but before paint, blocking it. Use the layout version only to measure and adjust layout without a visible flicker.

**Q9: Why do Effects run twice in development?**
*Answer*: Strict Mode mounts, unmounts and remounts components in development to expose Effects that are missing cleanup. It doesn't happen in production builds.`
    },
    {
      heading: "15. Practical Hands-On Exercise — Race-Safe Product Search",
      content: `Build a product search page that brings together everything in this lecture:
• A search box with a **400 ms debounce** implemented with \`setTimeout\` and a cleanup function.
• **AbortController** to cancel in-flight requests when the query changes, with \`AbortError\` ignored.
• **Loading, error and empty** states.
• **Derived state** (the sorted list and result count) calculated during render, not in an Effect.
• **\`useEffectEvent\`** to log each search with the user's current "sort" choice, without the sort dropdown triggering a new request.
• A **\`key\`** on the results panel so its local "expanded" state resets for each new query.
It uses the free public DummyJSON API (prices there are sample values in USD; we just display them). Create a Vite React project, paste this into \`src/App.jsx\`, and try typing quickly with the Network tab open in DevTools and throttling set to "Slow 4G". You'll see older requests marked as cancelled.
**Stretch goals:** move the fetching logic into a \`useProductSearch(query)\` custom hook, add a "Retry" button in the error state, and rewrite it with TanStack Query later in the course to compare.`,
      codeSnippet: `// src/App.jsx — Lecture 14: Race-Safe Product Search
import { useEffect, useEffectEvent, useState } from "react";

function logSearch(query, sortBy, count) {
  console.log("[analytics] search", { query, sortBy, count });
}

export default function App() {
  const [input, setInput] = useState("phone");
  const [query, setQuery] = useState("phone");
  const [sortBy, setSortBy] = useState("relevance");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. Debounce: only update 'query' 400 ms after the user stops typing
  useEffect(() => {
    const id = setTimeout(() => setQuery(input.trim()), 400);
    return () => clearTimeout(id);
  }, [input]);

  // 2. Effect Event: reads the latest sortBy without being a dependency
  const onResults = useEffectEvent((count) => {
    logSearch(query, sortBy, count);
  });

  // 3. Fetch with AbortController; re-runs only when 'query' changes
  useEffect(() => {
    if (!query) {
      setProducts([]);
      setError(null);
      setLoading(false);
      return;
    }
    const controller = new AbortController();

    async function search() {
      setLoading(true);
      setError(null);
      try {
        const url = "https://dummyjson.com/products/search?q=" + encodeURIComponent(query);
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error("Server responded with " + res.status);
        const data = await res.json();
        setProducts(data.products);
        setLoading(false);
        onResults(data.products.length);
      } catch (err) {
        if (err.name === "AbortError") return; // superseded by a newer query
        setError(err.message);
        setLoading(false);
      }
    }

    search();
    return () => controller.abort();
  }, [query]);

  // 4. Derived state: computed during render, no Effect
  const sorted =
    sortBy === "price-asc"
      ? products.toSorted((a, b) => a.price - b.price)
      : sortBy === "rating"
      ? products.toSorted((a, b) => b.rating - a.rating)
      : products;

  return (
    <div style={{ maxWidth: "640px", margin: "30px auto", padding: "24px", background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "16px", fontFamily: "system-ui, sans-serif" }}>
      <h2 style={{ color: "#002057" }}>Lecture 14: Race-Safe Product Search</h2>

      <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search products (try: laptop, watch, perfume)"
          style={{ flex: 1, padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
        />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: "10px", borderRadius: "6px" }}>
          <option value="relevance">Relevance</option>
          <option value="price-asc">Price: low to high</option>
          <option value="rating">Top rated</option>
        </select>
      </div>

      {loading && <p style={{ color: "#2506ad" }}>Searching for "{query}"...</p>}
      {error && <p role="alert" style={{ color: "#b91c1c" }}>Something went wrong: {error}</p>}
      {!loading && !error && query && sorted.length === 0 && <p>No products found for "{query}".</p>}

      {!error && sorted.length > 0 && (
        <ResultsPanel key={query} query={query} items={sorted} />
      )}
    </div>
  );
}

// Local state resets automatically for every new query thanks to key={query}
function ResultsPanel({ query, items }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? items : items.slice(0, 5);

  return (
    <section>
      <p style={{ color: "#475569" }}>{items.length} results for "{query}"</p>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {visible.map((p) => (
          <li key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px", borderBottom: "1px solid #f1f5f9" }}>
            <span>{p.title}</span>
            <strong style={{ color: "#ea580c" }}>\${p.price} · ★ {p.rating}</strong>
          </li>
        ))}
      </ul>
      {items.length > 5 && (
        <button
          onClick={() => setExpanded((e) => !e)}
          style={{ background: "#2506ad", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer" }}
        >
          {expanded ? "Show less" : "Show all " + items.length}
        </button>
      )}
    </section>
  );
}`
    },
    {
      heading: "16. Summary",
      content: `• React re-runs an Effect when any dependency changes according to \`Object.is\`. Every reactive value the Effect reads must be listed, and the **exhaustive-deps** lint rule enforces this — never silence it.
• A **stale closure** is a callback stuck with values from an old render. Fix it with updater functions, correct dependencies, or \`useEffectEvent\`.
• **Objects and functions** created during render are new every time. Create them inside the Effect, move them outside the component, or depend on primitives.
• Data fetching needs **data, loading and error** state, a \`res.ok\` check, and protection against **race conditions** via an \`ignore\` flag or \`AbortController\` (ignoring \`AbortError\`).
• **\`useEffectEvent\`** (stable in React 19.2) reads the latest values without making the Effect re-run. Call it only from Effects and never list it as a dependency.
• **You might not need an Effect:** calculate derived values during render, run user-triggered logic in event handlers, and reset state with a \`key\`.
• **\`useLayoutEffect\`** runs before paint; use it only to measure and adjust layout without flicker.
• For production data fetching, libraries like TanStack Query handle caching and races for you — but now you know what they do under the hood.
**Next lecture:** useRef, the DOM & Portals`
    }
  ]
};
