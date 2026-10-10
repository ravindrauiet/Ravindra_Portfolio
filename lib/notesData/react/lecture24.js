export const lecture24 = {
  slug: "lecture-24",
  number: 24,
  title: "Complete React Course — Module 8: Lecture 24: React 19 Features Masterclass — Actions, use(), useOptimistic, Activity & More",
  summary: "A complete React 19 tutorial covering Actions and async transitions, useActionState, useFormStatus, useOptimistic, the use() hook for promises and context, ref as a prop, the <Context> provider shorthand, document metadata, stylesheets, <Activity>, useEffectEvent, React Server Components and the experimental ViewTransition.",
  readTime: "55 min read",
  difficulty: "Advanced",
  date: "2026-10-09",
  sections: [
    {
      heading: "1. Introduction: What React 19 Changed and Why It Matters",
      content: `In the previous lecture you learned how React re-renders and how React Compiler 1.0 removes most manual memoization. This lecture covers the other big story of modern React: the **React 19 feature set**, which is the largest change to the library since hooks arrived in 16.8.
React 19.0 shipped in December 2024, 19.1 followed in March 2025, and **React 19.2** (October 2025) added \`<Activity>\`, \`useEffectEvent\` and several performance tools. Together these releases solve a set of problems every React developer has fought by hand:
• **Form submission boilerplate.** Before React 19, every form needed its own \`isSubmitting\` state, \`error\` state, a \`try/catch\` and a manual reset. **Actions**, \`useActionState\` and \`useFormStatus\` make that pattern built in.
• **Slow-feeling UIs.** Users wait for the server before they see their change. \`useOptimistic\` shows the expected result instantly and rolls back automatically if the request fails.
• **Reading async data in render.** The \`use()\` hook lets a component read a promise (or a context) during render, integrated with \`<Suspense>\` and error boundaries.
• **API ceremony.** \`forwardRef\` wrappers, \`<Context.Provider>\` nesting and separate head-management libraries all become unnecessary.
• **State loss when hiding UI.** \`<Activity>\` keeps the state of hidden tabs or routes alive and even pre-renders content the user is likely to open next.
• **Effects that re-subscribe too often.** \`useEffectEvent\` lets an effect read the latest props and state without listing them as dependencies.
• **Server-side rendering of components.** React Server Components (RSC) let frameworks such as Next.js run part of the component tree on the server with zero client JavaScript.
Everything in this lecture, except \`<ViewTransition>\`, is stable in React 19.2. The examples assume a Vite project (\`npm create vite@latest my-app -- --template react\`) with \`react\` and \`react-dom\` at version 19.2 or later. Where a feature needs a framework (Server Components, Server Functions), the lecture says so explicitly.`
    },
    {
      heading: "2. Actions and Async Transitions in React 19",
      content: `In React 18, \`startTransition\` accepted only a synchronous function. React 19 lets you pass an **async function**, and React calls that function an **Action**. While the Action runs, the transition stays **pending**, and any state updates made inside it are rendered as non-urgent transition updates. This small change is the foundation for every form feature in this lecture.
What React gives you when you use an Action instead of a hand-written \`async\` handler:
• **Pending state for free.** \`useTransition\` returns \`isPending\`, which stays \`true\` until the async function resolves, including the network time.
• **Error handling.** If the Action throws, the error propagates to the nearest **error boundary**, or you can return it as state with \`useActionState\` (section 3).
• **Ordering.** Multiple Actions are queued; React applies their results in order, so a slow earlier request cannot overwrite a faster later one.
• **Optimistic updates.** \`useOptimistic\` only works inside a transition or Action, which is why Actions are the entry point for instant feedback (section 5).
A realistic scenario: a "Save profile" button in an admin panel for a Mumbai-based delivery startup. The user clicks, the request takes 900 ms, and during that time the button must be disabled and the input must stay editable. With an Action, that is three lines.
One documented limitation to remember: a state update placed **after an \`await\`** inside the async function is not automatically part of the transition. Wrap such updates in another \`startTransition\` call. The React team has said this will be fixed in a future release, but today it is required.`,
      codeSnippet: `// src/SaveProfile.jsx — an async transition (Action) with useTransition
import { useState, useTransition, startTransition } from "react";

async function updateProfile(name) {
  await new Promise((r) => setTimeout(r, 900));          // simulated network call
  if (!name.trim()) throw new Error("Name cannot be empty");
  return { name, savedAt: new Date().toLocaleTimeString("en-IN") };
}

export default function SaveProfile() {
  const [name, setName] = useState("Ravindra Nath Jha");
  const [saved, setSaved] = useState(null);
  const [isPending, startSaving] = useTransition();

  function handleSave() {
    startSaving(async () => {                             // an Action: async function in a transition
      const result = await updateProfile(name);
      // After an await, wrap further updates in startTransition (React 19 limitation)
      startTransition(() => setSaved(result));
    });
  }

  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={handleSave} disabled={isPending}>
        {isPending ? "Saving…" : "Save profile"}
      </button>
      {saved && <p>Saved "{saved.name}" at {saved.savedAt}</p>}
    </div>
  );
}
// Output: button shows "Saving…" for ~900 ms, then "Saved "Ravindra Nath Jha" at 10:42:17 am"`
    },
    {
      heading: "3. Form Actions and useActionState",
      content: `React 19 extends the HTML \`<form>\` element: the \`action\` prop can now be a **function**. When the form is submitted, React prevents the default navigation, builds a \`FormData\` object from the inputs, and calls your function inside a transition. After the function resolves successfully, React **resets uncontrolled fields automatically**, exactly like a native form would after a full-page submit.
On its own that already removes \`e.preventDefault()\` and the manual \`new FormData(e.target)\` dance. The hook that makes it complete is **\`useActionState\`** (imported from \`react\`; it replaces the earlier \`useFormState\` from \`react-dom\`, which is deprecated).
\`useActionState(actionFn, initialState, permalink?)\` returns three values:
• **\`state\`** — whatever your action returned last time (an error message, a success flag, a list of validation issues). Starts as \`initialState\`.
• **\`formAction\`** — a wrapped action to pass to \`<form action>\` or to a button's \`formAction\` prop.
• **\`isPending\`** — \`true\` while the action runs.
Your action function receives **two arguments**: the previous state and the \`FormData\`. Returning a value (instead of throwing) is the recommended way to report validation errors, because the component can render them without an error boundary. The optional \`permalink\` is used by frameworks for progressive enhancement: if the form submits before JavaScript loads, the browser navigates to that URL.
The example below is a feedback form for a Hyderabad coaching institute. Notice that the component holds **no \`useState\` at all**: pending, error and success states all come from the hook.`,
      codeSnippet: `// src/FeedbackForm.jsx — useActionState with validation and success state
import { useActionState } from "react";

async function sendFeedback(prevState, formData) {
  const email = formData.get("email")?.toString().trim();
  const message = formData.get("message")?.toString().trim();

  if (!email || !email.includes("@")) return { error: "Enter a valid email", sent: prevState.sent };
  if (!message || message.length < 10) return { error: "Message must be at least 10 characters", sent: prevState.sent };

  await new Promise((r) => setTimeout(r, 1000));          // POST /api/feedback
  return { error: null, sent: prevState.sent + 1 };       // new state
}

export default function FeedbackForm() {
  const [state, formAction, isPending] = useActionState(sendFeedback, { error: null, sent: 0 });

  return (
    <form action={formAction}>
      <input name="email" type="email" placeholder="you@example.com" />
      <textarea name="message" placeholder="Tell us about the Hyderabad batch…" />
      <button type="submit" disabled={isPending}>
        {isPending ? "Sending…" : "Send feedback"}
      </button>
      {state.error && <p style={{ color: "crimson" }}>{state.error}</p>}
      {state.sent > 0 && <p style={{ color: "green" }}>Thanks! Feedback sent {state.sent} time(s).</p>}
    </form>
  );
}
// After a successful submit the inputs are cleared automatically by React.`
    },
    {
      heading: "4. useFormStatus: Pending State Inside the Form",
      content: `\`useActionState\` gives the pending flag to the component that **owns** the form. Design systems usually have a reusable \`<SubmitButton>\` component that lives **inside** many different forms and should not need a \`pending\` prop drilled into it. That is the job of **\`useFormStatus\`**, imported from \`react-dom\`.
\`useFormStatus()\` returns an object with four fields:
• **\`pending\`** — \`true\` while the parent form's action is running.
• **\`data\`** — the \`FormData\` being submitted, or \`null\`.
• **\`method\`** — \`"get"\` or \`"post"\`.
• **\`action\`** — a reference to the function passed to the form's \`action\` prop.
The one rule that trips up most people: \`useFormStatus\` only reports the status of a **parent** \`<form>\`. The hook behaves like a context consumer, so it must be called from a component **rendered inside** the form, not from the component that renders the \`<form>\` tag itself. If you call it in the same component as the form, \`pending\` is always \`false\`.
Because the button reads the status itself, it can show a spinner, disable itself and even display what is being submitted (\`data.get("email")\`) without any props. The same \`<SubmitButton>\` works in a login form, a checkout form and a search box.`,
      codeSnippet: `// src/SubmitButton.jsx — a reusable button that knows the form's status
import { useFormStatus } from "react-dom";

export function SubmitButton({ children }) {
  const { pending, data } = useFormStatus();            // reads the nearest parent <form>
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Submitting " + (data?.get("city") ?? "") + "…" : children}
    </button>
  );
}

// src/CityForm.jsx — the form itself; no pending prop needed
import { SubmitButton } from "./SubmitButton";

async function saveCity(formData) {
  await new Promise((r) => setTimeout(r, 800));
  console.log("Saved city:", formData.get("city"));   // "Saved city: Bengaluru"
}

export default function CityForm() {
  return (
    <form action={saveCity}>
      <input name="city" placeholder="Your city" defaultValue="Bengaluru" />
      <SubmitButton>Save city</SubmitButton>             {/* must be INSIDE the form */}
    </form>
  );
}`
    },
    {
      heading: "5. useOptimistic: Instant UI Feedback with Automatic Rollback",
      content: `An **optimistic update** shows the result the user expects **before** the server confirms it. Likes on Instagram, sent messages in WhatsApp and items added to a Flipkart cart all appear instantly; the request completes in the background. Before React 19 you had to copy the state, apply the change, remember the old copy, and restore it in a \`catch\` block. **\`useOptimistic\`** turns this into one hook call.
\`useOptimistic(actualState, updateFn)\` returns \`[optimisticState, addOptimistic]\`:
• While no Action is running, \`optimisticState\` **equals** \`actualState\`.
• When you call \`addOptimistic(value)\` inside an Action or transition, React computes \`updateFn(actualState, value)\` and renders that temporarily.
• When the Action finishes (success **or** failure), React **discards** the optimistic value and renders whatever \`actualState\` is now. If your Action updated the real state on success, the UI stays the same; if it failed, the UI simply snaps back. There is no manual rollback code.
Two practical rules: call \`addOptimistic\` only inside an Action, a form action or \`startTransition\` (React warns otherwise), and keep the optimistic item visually marked (for example at 50% opacity with a "sending" label) so users understand it is not yet confirmed.
The example is a comment thread for a Chennai food-delivery app. The new comment appears immediately, greyed out; after 1.5 seconds the real server copy replaces it. Type the word "fail" to see the rollback.`,
      codeSnippet: `// src/CommentThread.jsx — optimistic comments with automatic rollback
import { useOptimistic, useState, useRef } from "react";

let nextId = 3;
async function postComment(text) {
  await new Promise((r) => setTimeout(r, 1500));
  if (text.includes("fail")) throw new Error("Network error");
  return { id: nextId++, text, author: "You" };
}

export default function CommentThread() {
  const [comments, setComments] = useState([
    { id: 1, text: "Biryani arrived hot, 10/10", author: "Meera" },
    { id: 2, text: "Delivery took 55 minutes in T. Nagar", author: "Arjun" },
  ]);
  const [error, setError] = useState(null);
  const formRef = useRef(null);

  const [optimisticComments, addOptimisticComment] = useOptimistic(
    comments,
    (current, newText) => [...current, { id: "pending", text: newText, author: "You", pending: true }]
  );

  async function submitAction(formData) {                 // runs inside a transition automatically
    const text = formData.get("text").toString();
    setError(null);
    addOptimisticComment(text);                           // shown instantly
    try {
      const saved = await postComment(text);
      setComments((prev) => [...prev, saved]);            // confirmed: real state updated
    } catch (err) {
      setError(err.message);                              // failed: optimistic item disappears by itself
    }
  }

  return (
    <div>
      <ul>
        {optimisticComments.map((c) => (
          <li key={c.id} style={{ opacity: c.pending ? 0.5 : 1 }}>
            <b>{c.author}:</b> {c.text} {c.pending && <small>(sending…)</small>}
          </li>
        ))}
      </ul>
      <form action={submitAction} ref={formRef}>
        <input name="text" placeholder="Write a comment" required />
        <button type="submit">Post</button>
      </form>
      {error && <p style={{ color: "crimson" }}>{error} — your comment was not saved.</p>}
    </div>
  );
}`
    },
    {
      heading: "6. The use() Hook: Reading Promises and Context During Render",
      content: `\`use\` is a new React 19 API that reads the value of a **promise** or a **context** during render. It is called like a hook, but it deliberately breaks one hook rule: **you may call \`use\` inside \`if\` statements and loops**. You still cannot call it inside a \`try/catch\` block, and it must be called from a component or a hook.
**use(promise).** When the promise is still pending, the component **suspends**: React shows the nearest \`<Suspense>\` fallback and resumes rendering when the promise settles. If it rejects, the error goes to the nearest **error boundary**. The result is data fetching with no \`useEffect\`, no \`loading\` state and no \`error\` state inside the component.
The single most important rule: **do not create the promise during render**. A component re-renders many times; a new \`fetch()\` on each render means a new promise each time, so the component suspends forever and React warns "A component was suspended by an uncached promise". Create the promise **outside** render: in a Server Component and pass it as a prop (the primary use case in Next.js), in a module-level cache, in a parent's state, or through a library such as TanStack Query (v5 exposes promises you can pass to \`use\`).
**use(Context).** \`use(ThemeContext)\` behaves like \`useContext(ThemeContext)\` with one advantage: because \`use\` can run conditionally, you can read a context only when a condition is met, or return early before reading it. This makes code paths like "if the user is not logged in, skip the heavy settings context" legal.
The example shows both forms. The promise is created once at module level (a simple cache) so that \`use\` always receives the same promise object.`,
      codeSnippet: `// src/WeatherCard.jsx — use() with a promise and a context
import { use, Suspense, createContext } from "react";

const UnitContext = createContext("celsius");

// Promise created ONCE, outside render (a tiny cache keyed by city)
const cache = new Map();
function fetchWeather(city) {
  if (!cache.has(city)) {
    cache.set(city, new Promise((resolve) =>
      setTimeout(() => resolve({ city, tempC: city === "Delhi" ? 34 : 27 }), 1200)
    ));
  }
  return cache.get(city);
}

function Temperature({ weatherPromise, showUnit }) {
  const weather = use(weatherPromise);                  // suspends until resolved
  if (!showUnit) return <p>{weather.city}: {weather.tempC}°</p>;
  const unit = use(UnitContext);                         // conditional context read is allowed with use()
  const value = unit === "fahrenheit" ? Math.round(weather.tempC * 9 / 5 + 32) : weather.tempC;
  return <p>{weather.city}: {value}° {unit === "fahrenheit" ? "F" : "C"}</p>;
}

export default function WeatherCard() {
  return (
    <UnitContext value="fahrenheit">                       {/* React 19 provider shorthand */}
      <Suspense fallback={<p>Loading weather…</p>}>
        <Temperature weatherPromise={fetchWeather("Delhi")} showUnit />
        <Temperature weatherPromise={fetchWeather("Goa")} showUnit={false} />
      </Suspense>
    </UnitContext>
  );
}
// Output after ~1.2 s:  Delhi: 93° F   /   Goa: 27°`
    },
    {
      heading: "7. Simpler APIs: ref as a Prop and <Context> as a Provider",
      content: `React 19 removed two pieces of ceremony that every intermediate developer had memorised.
**ref as a regular prop.** In React 18, a function component could not receive \`ref\`; you had to wrap it in \`forwardRef((props, ref) => ...)\`. In React 19, \`ref\` arrives like any other prop: \`function Input({ ref, ...props })\`. \`forwardRef\` still works but is **deprecated** and will be removed in a future major version; an official codemod listed in the React 19 upgrade guide converts existing code. Class components still receive \`ref\` the old way, pointing at the instance.
**Ref callback cleanup.** A ref callback can now **return a cleanup function**. React calls it when the element is removed from the DOM, which makes refs a natural place to attach observers (\`ResizeObserver\`, \`IntersectionObserver\`) or third-party widgets. Previously React called the callback with \`null\` on unmount; with a cleanup function present, it no longer does.
**<Context> as the provider.** Instead of \`<ThemeContext.Provider value="dark">\` you now write \`<ThemeContext value="dark">\`. \`.Provider\` keeps working for now but is on the deprecation path. Combined with \`use(Context)\` from section 6, context code becomes noticeably shorter.
Smaller but related changes in React 19: \`useDeferredValue(value, initialValue)\` accepts an initial value for the first render; **custom elements** (web components) are fully supported with correct property-versus-attribute handling; and the legacy APIs \`propTypes\`, \`defaultProps\` on function components, string refs, legacy context and \`ReactDOM.render\` were removed, so upgrade with the official codemods.`,
      codeSnippet: `// src/TextField.jsx — ref as a prop, ref cleanup, <Context> shorthand
import { createContext, use, useRef } from "react";

const ThemeContext = createContext("light");

// React 19: no forwardRef needed
function TextField({ ref, label, ...props }) {
  const theme = use(ThemeContext);
  return (
    <label style={{ color: theme === "dark" ? "#eee" : "#111" }}>
      {label} <input ref={ref} {...props} />
    </label>
  );
}

// Ref callback that returns a cleanup function
function AutoWidthBox() {
  const attachObserver = (node) => {
    const observer = new ResizeObserver(([entry]) => {
      console.log("Box width:", Math.round(entry.contentRect.width));
    });
    observer.observe(node);
    return () => observer.disconnect();                   // called when the node unmounts
  };
  return <div ref={attachObserver} style={{ resize: "horizontal", overflow: "auto" }}>Resize me</div>;
}

export default function Demo() {
  const inputRef = useRef(null);
  return (
    <ThemeContext value="dark">                           {/* instead of ThemeContext.Provider */}
      <TextField ref={inputRef} label="Name" placeholder="Priya Sharma" />
      <button onClick={() => inputRef.current?.focus()}>Focus name</button>
      <AutoWidthBox />
    </ThemeContext>
  );
}`
    },
    {
      heading: "8. Document Metadata, Stylesheets, Scripts and Resource Preloading",
      content: `Single-page apps have always struggled with the \`<head>\`: the page title, meta description and Open Graph tags live outside the React tree, so teams installed \`react-helmet\` or wrote imperative \`document.title = ...\` effects. React 19 handles this natively.
**Metadata hoisting.** When a component renders \`<title>\`, \`<meta>\` or \`<link>\` tags, React **hoists** them into the document \`<head>\` automatically. This works on the client, during server-side rendering (streaming included) and in Server Components. A product page can declare its own title and description right next to the product markup. One caveat: if your framework has a dedicated metadata API (Next.js has \`export const metadata\` and \`generateMetadata\`), prefer it, because the framework also handles things like default templates and social images.
**Stylesheets with precedence.** \`<link rel="stylesheet" href="/table.css" precedence="default">\` rendered inside a component is deduplicated (rendered once even if ten components ask for it), inserted in the \`<head>\` in an order controlled by \`precedence\`, and React **waits for it to load** before revealing the content that depends on it, so there is no flash of unstyled content. This is the official answer to "my lazily loaded component needs its own CSS".
**Async scripts.** \`<script async src="https://checkout.razorpay.com/v1/checkout.js">\` inside a component is also deduplicated and loaded once, no matter how many components render it or how often they re-render.
**Preloading APIs.** \`react-dom\` exports \`preload\` (fetch a resource early), \`preinit\` (fetch and execute a script or insert a stylesheet), \`preconnect\` and \`prefetchDNS\`. Call them during render or in event handlers to warm up resources the user will need in a moment, for example preloading a font or preconnecting to a payment gateway when the user opens the cart.`,
      codeSnippet: `// src/ProductPage.jsx — metadata, stylesheet, async script and preloading in one component
import { preconnect, preload } from "react-dom";

export default function ProductPage({ product }) {
  preconnect("https://images.example.com");                       // open the connection early
  preload("/fonts/Inter-Variable.woff2", { as: "font", type: "font/woff2", crossOrigin: "anonymous" });

  return (
    <article>
      {/* hoisted into <head> automatically */}
      <title>{product.name + " — ₹" + product.price.toLocaleString("en-IN") + " | ShopKart"}</title>
      <meta name="description" content={product.description.slice(0, 155)} />
      <meta property="og:image" content={product.image} />
      <link rel="canonical" href={"https://shopkart.example.com/p/" + product.slug} />

      {/* deduplicated stylesheet; content is revealed only after it loads */}
      <link rel="stylesheet" href="/styles/product.css" precedence="default" />

      {/* deduplicated async script: loaded once even if rendered by many components */}
      <script async src="https://checkout.razorpay.com/v1/checkout.js" />

      <h1>{product.name}</h1>
      <img src={product.image} alt={product.name} width={480} />
      <p>₹{product.price.toLocaleString("en-IN")}</p>
    </article>
  );
}

// Usage: <ProductPage product={{ name: "Noise-cancelling Headphones", price: 7999, slug: "nc-headphones",
//   image: "https://images.example.com/nc.jpg", description: "40-hour battery, ANC, ..." }} />
// Browser tab shows: "Noise-cancelling Headphones — ₹7,999 | ShopKart"`
    },
    {
      heading: "9. <Activity>: Hide UI Without Losing State (React 19.2)",
      content: `Consider a dashboard with "Orders", "Customers" and "Reports" tabs. The classic implementation, \`{tab === "orders" && <Orders />}\`, **unmounts** the inactive tab. The user loses scroll position, half-typed filters and fetched data, and switching back re-fetches everything. The alternative, hiding with \`display: none\`, keeps the state but also keeps the hidden tab's effects, subscriptions and timers running and makes the first render of the page do all the work at once.
**\`<Activity>\`**, stable since React 19.2, is the middle path. It takes one prop, \`mode\`, with two values:
• **\`"visible"\`** — children render and behave normally.
• **\`"hidden"\`** — children are hidden with \`display: none\`, their **effects are cleaned up** (as if unmounted), but their **state and DOM are preserved**. Any rendering the hidden subtree needs is done at a **lower priority**, after the visible content, so it never blocks what the user is looking at.
When the mode flips back to \`"visible"\`, effects run again (subscriptions re-attach) and the UI appears instantly with all its state intact. Three production uses:
• **Tabs and multi-step wizards** where users move back and forth.
• **Pre-rendering likely next screens.** Render the next route or the search results panel as \`hidden\`; its data fetches and code splitting happen in the background, so opening it later is instant.
• **Back/forward navigation** in client-side routers that want to restore the previous page exactly as it was.
Because effects are unmounted while hidden, components must already be written correctly: every \`useEffect\` that creates something must return a cleanup. React Strict Mode's double-invocation of effects exists precisely to surface the bugs that \`<Activity>\` would otherwise expose.`,
      codeSnippet: `// src/Dashboard.jsx — tabs that keep state while hidden
import { Activity, useEffect, useState } from "react";

function Orders() {
  const [filter, setFilter] = useState("");
  useEffect(() => {
    console.log("Orders: subscribed to live updates");
    return () => console.log("Orders: unsubscribed");     // runs when the tab is hidden
  }, []);
  return (
    <div>
      <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Filter orders" />
      <p>Showing orders matching "{filter}"</p>
    </div>
  );
}

function Reports() {
  const [period, setPeriod] = useState("month");
  return (
    <select value={period} onChange={(e) => setPeriod(e.target.value)}>
      <option value="week">This week</option>
      <option value="month">This month</option>
    </select>
  );
}

export default function Dashboard() {
  const [tab, setTab] = useState("orders");
  return (
    <div>
      <nav>
        <button onClick={() => setTab("orders")}>Orders</button>
        <button onClick={() => setTab("reports")}>Reports</button>
      </nav>
      <Activity mode={tab === "orders" ? "visible" : "hidden"}>
        <Orders />                                        {/* keeps its filter text when hidden */}
      </Activity>
      <Activity mode={tab === "reports" ? "visible" : "hidden"}>
        <Reports />                                       {/* pre-rendered at low priority */}
      </Activity>
    </div>
  );
}
// Console when switching Orders -> Reports -> Orders:
//   Orders: unsubscribed
//   Orders: subscribed to live updates      (filter text is still there)`
    },
    {
      heading: "10. useEffectEvent: Reading Latest Values in Effects (React 19.2)",
      content: `Every React developer has hit this dilemma. An effect connects to a chat room when \`roomId\` changes, and inside the connection's \`onMessage\` callback you want to show a notification using the current \`theme\`. The lint rule says \`theme\` must be in the dependency array, but adding it **reconnects the chat every time the theme changes**, which is nonsense. Leaving it out gives a **stale closure**: the callback sees the theme from when the effect ran.
**\`useEffectEvent\`**, stable since React 19.2, separates the two concerns. It returns a function (an "Effect Event") that **always sees the latest props and state** but is **not reactive**: calling it from an effect does not add anything to the dependency array. Think of it as "an event handler that is triggered by an effect rather than by the user".
Rules that the updated \`eslint-plugin-react-hooks\` (v6.1 and later) enforces:
• Call an Effect Event **only from inside an effect** (or from code the effect calls), never during render or from a regular event handler.
• **Never list it in dependencies.** It is intentionally excluded; the linter will flag it.
• **Do not pass it to other components or hooks.** It is local to the component that declares it.
Typical uses: analytics logging inside an interval, reading the latest callback prop inside a WebSocket \`onmessage\`, using current form values in a debounce timer, and the chat-room example below. The effect's dependency list now contains only the values that should genuinely restart it.`,
      codeSnippet: `// src/ChatRoom.jsx — reconnect only when roomId changes, but always use the latest theme
import { useEffect, useEffectEvent, useState } from "react";

function createConnection(roomId, onMessage) {
  const id = setInterval(() => onMessage("New message in " + roomId), 2000);  // fake socket
  return { close: () => clearInterval(id) };
}

export default function ChatRoom({ roomId }) {
  const [theme, setTheme] = useState("light");
  const [log, setLog] = useState([]);

  // Effect Event: non-reactive, always sees the current theme
  const onMessage = useEffectEvent((text) => {
    setLog((prev) => [...prev.slice(-4), text + " [" + theme + " theme]"]);
  });

  useEffect(() => {
    const conn = createConnection(roomId, (text) => onMessage(text));
    return () => conn.close();
  }, [roomId]);                                           // theme is NOT a dependency; no reconnect on theme change

  return (
    <div>
      <button onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}>
        Theme: {theme}
      </button>
      <ul>{log.map((line, i) => <li key={i}>{line}</li>)}</ul>
    </div>
  );
}
// Toggle the theme: no reconnect happens, yet new log lines show the NEW theme.`
    },
    {
      heading: "11. React Server Components Overview and How Next.js Uses Them",
      content: `**React Server Components (RSC)** are components that run **only on the server**, either at build time or per request. They never ship to the browser, so their code and their dependencies (a Markdown parser, a database client, a 200 KB date library) add **zero bytes** to the client bundle. RSC is a stable React 19 feature, but it needs a bundler and a server integration, so in practice you use it through a framework: Next.js App Router, React Router v7 in framework mode (RSC support has been rolling out there), or custom setups built on Vite plugins.
How a Server Component differs from the components you have written so far:
• It can be an **\`async\` function** and \`await\` a database query, a file read or a \`fetch\` directly in the body.
• It **cannot use state, effects or browser APIs** (\`useState\`, \`useEffect\`, \`window\`, \`onClick\`). It renders once on the server and produces output.
• Its output is not HTML but the **RSC payload**, a compact serialized description of the UI that the client runtime merges into the React tree without losing client state.
• It can render **Client Components**, which are files marked with the \`"use client"\` directive at the top. The client/server boundary is a file, and everything imported by a Client Component is also client code.
• Props passed from server to client must be **serializable**: plain objects, arrays, strings, numbers, Dates, and also **promises**, which is why \`use(promise)\` in a Client Component is so useful (the server starts the fetch and streams the result).
**Server Functions** (called Server Actions in earlier docs) complete the picture: an async function marked with \`"use server"\` runs on the server but can be imported into a Client Component and passed to \`<form action>\` or called from an event handler. React serializes the arguments, calls the function over an HTTP POST, and returns the result. Everything from sections 2 to 5 (\`useActionState\`, \`useFormStatus\`, \`useOptimistic\`) works unchanged with Server Functions, which is exactly why those hooks were designed together.
**In Next.js**, every component inside the \`app/\` directory is a Server Component **by default**. You add \`"use client"\` only to the leaves that need interactivity. A typical product page is a Server Component that queries the database, renders static markup, and passes data (or a promise) to a small Client Component for the "Add to cart" button. The Next.js course on this site covers data fetching, caching and Server Actions in depth; this lecture gives you the React-side mental model.`,
      codeSnippet: `// app/products/[slug]/page.jsx — Next.js App Router (Server Component by default)
import { Suspense } from "react";
import { db } from "@/lib/db";                       // server-only: never reaches the browser
import AddToCart from "./AddToCart";
import Reviews from "./Reviews";

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await db.product.findUnique({ where: { slug } });   // direct DB access
  const reviewsPromise = db.review.findMany({ where: { productId: product.id } }); // NOT awaited

  return (
    <main>
      <h1>{product.name}</h1>
      <p>₹{product.price.toLocaleString("en-IN")}</p>
      <AddToCart productId={product.id} />                             {/* Client Component */}
      <Suspense fallback={<p>Loading reviews…</p>}>
        <Reviews reviewsPromise={reviewsPromise} />                    {/* promise streamed to the client */}
      </Suspense>
    </main>
  );
}

// app/products/[slug]/Reviews.jsx
"use client";
import { use } from "react";
export default function Reviews({ reviewsPromise }) {
  const reviews = use(reviewsPromise);                                 // suspends until the server resolves it
  return <ul>{reviews.map((r) => <li key={r.id}>{r.rating}★ {r.text}</li>)}</ul>;
}

// app/products/[slug]/actions.js — Server Function
"use server";
export async function addToCart(prevState, formData) {
  const productId = formData.get("productId");
  await db.cart.add({ productId });                                    // runs on the server only
  return { added: prevState.added + 1 };
}

// app/products/[slug]/AddToCart.jsx
"use client";
import { useActionState } from "react";
import { addToCart } from "./actions";
export default function AddToCart({ productId }) {
  const [state, formAction, isPending] = useActionState(addToCart, { added: 0 });
  return (
    <form action={formAction}>
      <input type="hidden" name="productId" value={productId} />
      <button disabled={isPending}>{isPending ? "Adding…" : "Add to cart (" + state.added + ")"}</button>
    </form>
  );
}`
    },
    {
      heading: "12. ViewTransition (Experimental) and Other React 19.x Upgrades",
      content: `**\`<ViewTransition>\`** wraps the browser's View Transitions API so that React can animate elements when they **enter, exit, change position or update** as a result of a transition (\`startTransition\`, \`useDeferredValue\`, Suspense reveals, or navigations in frameworks). You wrap the parts of the tree you want animated, optionally give them a \`name\` so React can animate the same element moving between two places (the classic list-to-detail "shared element" animation), and style the animation with CSS \`::view-transition-*\` pseudo-elements. The companion \`addTransitionType\` lets you tag a transition ("nav-forward", "nav-back") and pick a different animation per type.
**Status, stated precisely:** as of React 19.2, \`<ViewTransition>\` is **not** in the stable release. It is available only in the **canary and experimental** channels, imported with an \`unstable_\` prefix, and its API may still change. Use it in side projects or behind a flag; do not build a production design system on it yet. Check the \`<ViewTransition>\` page on react.dev for the current import name before using it.
Other React 19.x improvements worth knowing for interviews and upgrades:
• **Better error reporting** (19.0): hydration mismatches print a single diff instead of a wall of warnings; \`createRoot\` accepts \`onCaughtError\`, \`onUncaughtError\` and \`onRecoverableError\` options for central logging.
• **Owner Stacks** (19.1): \`captureOwnerStack()\` in development tells you which component *rendered* the component that threw, which is more useful than the plain component stack.
• **Performance Tracks** (19.2): React adds its own tracks ("Scheduler" and "Components") to the Chrome DevTools Performance panel, showing priorities, render and effect timings.
• **Batched Suspense reveals during SSR** (19.2): boundaries that resolve at nearly the same time are revealed together, matching client behaviour and reducing layout jumps.
• **\`cacheSignal\`** (19.2, Server Components only): an \`AbortSignal\` that fires when the render's \`cache()\` lifetime ends, so you can cancel in-flight requests.
• **\`useId\` format** (19.2): generated IDs now look like \`«r1»\` instead of \`:r1:\`, which are valid in CSS selectors such as \`view-transition-name\`. Do not hard-code ID formats in tests.
• **eslint-plugin-react-hooks v6**: flat config by default and the React Compiler rules included, so the linter catches mutations and Rules-of-React violations early.`,
      codeSnippet: `// src/Gallery.jsx — EXPERIMENTAL: requires react@canary / react@experimental, API may change
import { unstable_ViewTransition as ViewTransition, startTransition, useState } from "react";

const cities = ["Jaipur", "Kochi", "Shillong", "Udaipur"];

export default function Gallery() {
  const [selected, setSelected] = useState(null);

  return (
    <div>
      {selected === null ? (
        <ul>
          {cities.map((city) => (
            <li key={city} onClick={() => startTransition(() => setSelected(city))}>
              {/* same name on both screens => shared-element animation */}
              <ViewTransition name={"city-" + city}>
                <h3>{city}</h3>
              </ViewTransition>
            </li>
          ))}
        </ul>
      ) : (
        <section>
          <ViewTransition name={"city-" + selected}>
            <h1>{selected}</h1>
          </ViewTransition>
          <button onClick={() => startTransition(() => setSelected(null))}>Back</button>
        </section>
      )}
    </div>
  );
}

/* src/index.css — customise the animation
::view-transition-old(*), ::view-transition-new(*) { animation-duration: 300ms; }
*/`
    },
    {
      heading: "13. Real-World Use Cases for React 19 Features",
      content: `How teams actually combine these features in production applications:
• **Checkout and payment forms (e-commerce).** \`useActionState\` holds server-side validation errors (card declined, pincode not serviceable), \`useFormStatus\` powers a shared \`<PayButton>\`, and the form resets automatically after success. In Next.js the action is a Server Function that talks to Razorpay or Stripe directly, so no API keys reach the browser.
• **Social feeds and chat (consumer apps).** \`useOptimistic\` makes likes, follows and sent messages appear in under 16 ms while the request completes. Automatic rollback replaces custom undo logic. Combined with \`<Activity>\`, switching between "Chats" and "Calls" tabs keeps scroll positions and drafts.
• **Admin dashboards (SaaS).** \`<Activity>\` pre-renders the next most likely tab in the background, so heavy charts open instantly. \`useEffectEvent\` keeps WebSocket subscriptions stable while filters, themes and column choices change.
• **Content sites and marketplaces (SEO-driven).** Server Components render listings with direct database access and zero client JavaScript for the static parts; metadata tags rendered in components (or the framework's metadata API) give every product page a unique \`<title>\` and description, which is what makes pages rank individually. This portfolio's course pages work on the same principle.
• **Design systems.** Components accept \`ref\` directly without \`forwardRef\`, \`<Context value>\` shortens theme and locale providers, and stylesheet \`precedence\` lets each lazily loaded component ship its own CSS without flashes.
• **Data-heavy pages.** A Server Component starts several queries without awaiting them, passes the promises down, and Client Components call \`use(promise)\` inside separate \`<Suspense>\` boundaries. The page streams: header first, product second, reviews last, all in one HTTP response.
• **Migration projects.** Teams upgrading from React 17/18 run the official codemods to remove \`forwardRef\`, \`defaultProps\` and \`propTypes\`, switch \`useFormState\` to \`useActionState\`, and then adopt React Compiler, since compiler-friendly code and React 19 features reinforce each other.`
    },
    {
      heading: "14. Common Mistakes with React 19 Features and How to Fix Them",
      content: `• **Creating a promise inside render and passing it to \`use()\`.** Each render makes a new promise, so the component suspends forever and React warns about an uncached promise. **Fix:** create the promise in a Server Component, a parent's state, a module-level cache or a data library, and pass the same object down.
• **Calling \`useFormStatus\` in the component that renders the \`<form>\`.** It always returns \`pending: false\` because the hook reads a *parent* form. **Fix:** move the button (or status indicator) into its own child component rendered inside the form.
• **Calling \`addOptimistic\` outside a transition or action.** React warns and the optimistic state may be discarded immediately. **Fix:** call it inside a form action, a \`useActionState\` action or \`startTransition(async () => ...)\`.
• **Forgetting that optimistic state reverts to the real state.** If the action succeeds but you never update the real state, the UI "flickers back". **Fix:** on success, update the underlying state (\`setComments\`) or refetch the data; the optimistic value is only a placeholder.
• **Setting state after an \`await\` in \`startTransition\` and expecting it to be a transition.** It is treated as an urgent update. **Fix:** wrap updates after \`await\` in another \`startTransition\` call (documented React 19 limitation).
• **Throwing for validation errors inside \`useActionState\`.** The error reaches an error boundary and unmounts the form. **Fix:** return \`{ error: "..." }\` as state and render it; throw only for truly unexpected failures.
• **Using \`use()\` inside \`try/catch\`.** It is not allowed; the hook relies on throwing to suspend. **Fix:** handle rejections with an error boundary, or catch inside the promise chain (\`promise.catch(...)\`) before passing it down.
• **Listing an Effect Event in the dependency array or calling it during render.** The linter flags both. **Fix:** call it only from inside the effect body or callbacks created there; keep it out of \`deps\`.
• **Effects without cleanup inside \`<Activity>\`.** Hidden subtrees unmount their effects; a timer or socket without cleanup leaks and fires while hidden. **Fix:** every effect that creates something returns a cleanup; verify with Strict Mode.
• **Expecting \`<Activity mode="hidden">\` to skip rendering entirely.** It still renders at low priority to preserve state and pre-render. **Fix:** if you want to avoid the work completely, conditionally render instead.
• **Importing \`useActionState\` from \`react-dom\` or using \`useFormState\`.** The former does not exist; the latter is deprecated. **Fix:** \`import { useActionState } from "react"\` and \`import { useFormStatus } from "react-dom"\`.
• **Using \`<title>\` in components when the framework has a metadata API.** You can end up with duplicated or conflicting tags. **Fix:** in Next.js prefer \`export const metadata\`/\`generateMetadata\`; use rendered metadata tags in Vite SPAs or frameworks without such an API.
• **Shipping \`<ViewTransition>\` from a stable \`react\` install.** It is not exported there. **Fix:** treat it as experimental, use a canary build only in non-critical code, and plan to revisit when it stabilises.`
    },
    {
      heading: "15. Frequently Asked Questions about React 19",
      content: `**What is new in React 19?**
React 19 adds Actions (async functions in transitions) with the \`useActionState\`, \`useFormStatus\` and \`useOptimistic\` hooks, the \`use()\` API for reading promises and context, \`ref\` as a normal prop, \`<Context>\` as its own provider, automatic hoisting of \`<title>\`/\`<meta>\`/\`<link>\`, stylesheet precedence, deduplicated async scripts, resource preloading APIs and stable React Server Components. React 19.2 added \`<Activity>\`, \`useEffectEvent\`, Performance Tracks and partial pre-rendering APIs.
**What is the difference between useActionState and useFormStatus?**
\`useActionState\` wraps an action and returns its latest result, a form action and a pending flag; it is used by the component that owns the form. \`useFormStatus\` is read by a child component inside the form and only reports whether the parent form is submitting. Use the first for data and errors, the second for reusable buttons and indicators.
**Can I use React Server Components with Vite?**
Not out of the box. RSC requires bundler and server support. Use Next.js App Router, React Router v7 in framework mode where RSC support is available, or an RSC-capable Vite plugin. A plain Vite SPA can still use every other React 19 feature in this lecture.
**Is use() a replacement for useEffect data fetching?**
For reading data, yes, as long as the promise is created outside render (by a Server Component, a cache or a library such as TanStack Query). \`use\` does not replace effects for subscriptions or side effects, and it does not handle caching or deduplication by itself.
**Does useOptimistic roll back automatically on error?**
Yes. The optimistic value is discarded when the action finishes, whether it succeeded or failed, and React renders the real state again. You only need to show an error message; no manual revert code is required.
**Is forwardRef removed in React 19?**
No, it is deprecated but still works. Function components now receive \`ref\` as a regular prop, so new code should not use \`forwardRef\`, and a codemod can migrate existing code. Removal is planned for a future major version.
**What is the difference between Activity and conditional rendering?**
Conditional rendering (\`cond && <X />\`) unmounts the component and destroys its state. \`<Activity mode="hidden">\` hides it with \`display: none\`, cleans up its effects but keeps state and DOM, and pre-renders it at low priority so showing it again is instant.
**Is ViewTransition stable in React 19.2?**
No. \`<ViewTransition>\` and \`addTransitionType\` are available only in the canary and experimental channels and are imported with an \`unstable_\` prefix. The API may change before it reaches a stable release.`
    },
    {
      heading: "16. Top React Interview Questions on React 19 Features",
      content: `**Q1. What is an Action in React 19?**
An async function passed to \`startTransition\`, a form's \`action\` prop or \`useActionState\`. React tracks its pending state, queues multiple Actions in order, routes thrown errors to error boundaries and allows optimistic updates while it runs.
**Q2. Explain the three values returned by \`useActionState\`.**
\`[state, formAction, isPending]\`: the last value returned by the action (or the initial state), a wrapped action to pass to \`<form action>\`, and a boolean that is true while the action runs. The action itself receives \`(previousState, formData)\`.
**Q3. Why does \`useFormStatus\` return \`pending: false\` in my form component?**
Because it reads the status of a parent \`<form>\`, like a context consumer. It must be called from a component rendered inside the form, not from the one that renders the form tag.
**Q4. How does \`useOptimistic\` work internally, at a high level?**
It keeps a queue of optimistic updates applied on top of the real state while a transition is in progress. Once the transition completes, the queue is cleared and the component renders the real state, so success and failure both end in a consistent state.
**Q5. What rules does \`use()\` relax compared to other hooks, and what rules remain?**
\`use\` can be called conditionally and inside loops. It still must be called in a component or hook, not inside \`try/catch\`, and a promise passed to it should be stable across renders.
**Q6. What happens to effects and state inside \`<Activity mode="hidden">\`?**
Effects are cleaned up as if the subtree unmounted; state and DOM are preserved; the subtree is hidden with \`display: none\` and any pending rendering is done at lower priority. On \`"visible"\`, effects re-run.
**Q7. When would you use \`useEffectEvent\` instead of adding a dependency?**
When an effect needs to *read* the latest value of something without *reacting* to it, such as using the current theme inside a socket's message handler without reconnecting when the theme changes.
**Q8. What can a Server Component not do, and why?**
It cannot use state, effects, event handlers or browser APIs, because it runs once on the server and its output is serialized to the client. Interactivity lives in Client Components marked with \`"use client"\`.
**Q9. How do Server Functions relate to \`useActionState\`?**
A Server Function (\`"use server"\`) is an async function that runs on the server but can be passed directly to \`useActionState\` or \`<form action>\` from a Client Component; React handles the network call. The hooks were designed to work identically with client-side and server-side actions.
**Q10. Name three APIs removed in React 19 and their replacements.**
\`propTypes\` (use TypeScript), \`defaultProps\` on function components (use default parameter values), and \`ReactDOM.render\`/\`hydrate\` (use \`createRoot\`/\`hydrateRoot\`). String refs and legacy context were also removed.`
    },
    {
      heading: "17. Practical Hands-On Exercise: Order Tracker with Actions, useOptimistic and Activity",
      content: `Build a small order-tracking screen that exercises the main React 19 APIs in one place. Requirements:
1. An **Order** tab that loads order details with \`use(promise)\` inside \`<Suspense>\`; the promise must be created outside render.
2. A **Comments** tab with a form powered by \`useActionState\`, a reusable \`<SubmitButton>\` using \`useFormStatus\`, and \`useOptimistic\` so new comments appear instantly and roll back when the fake server rejects them (type the word "fail").
3. Both tabs wrapped in \`<Activity>\` so the comment draft and the loaded order survive tab switches.
4. A \`<title>\` that updates with the active tab, rendered inside the component.
5. A \`LiveTicker\` that uses \`useEffectEvent\` to read the current tab inside a \`setInterval\` without restarting the interval.
6. A \`TextField\` component that receives \`ref\` as a plain prop and is focused after a successful post.
Create the project with \`npm create vite@latest react19-tracker -- --template react\`, make sure \`react\` and \`react-dom\` are 19.2 or newer, replace \`src/App.jsx\` with the code below and run \`npm run dev\`. Open the console to watch the ticker and effect cleanup logs.`,
      codeSnippet: `// src/App.jsx — React 19.2 Order Tracker (Vite). Requires react@^19.2 and react-dom@^19.2
import {
  Activity, Suspense, use, useActionState, useEffect, useEffectEvent,
  useOptimistic, useRef, useState,
} from "react";
import { useFormStatus } from "react-dom";

// ---------- fake backend ----------
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchOrder() {
  await wait(900);
  return { id: 4512, customer: "Rahul Verma", city: "Jaipur", total: 2499, status: "In transit" };
}

async function postComment(text) {
  await wait(1200);
  if (text.toLowerCase().includes("fail")) throw new Error("Server rejected the comment");
  return { id: Date.now(), author: "You", text };
}

// Promise created ONCE at module level so use() receives the same object every render
const orderPromise = fetchOrder();

// ---------- components ----------
function OrderSummary() {
  const order = use(orderPromise);                          // suspends until fetchOrder resolves
  return (
    <section>
      <h2>Order #{order.id}</h2>
      <p>{order.customer}, {order.city} · ₹{order.total.toLocaleString("en-IN")} · {order.status}</p>
    </section>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();                      // reads the parent <form>
  return <button type="submit" disabled={pending}>{pending ? "Posting…" : "Post comment"}</button>;
}

function TextField({ ref, ...props }) {                     // ref as a plain prop (no forwardRef)
  return <input ref={ref} style={{ width: "70%", padding: 8 }} {...props} />;
}

function Comments() {
  const [comments, setComments] = useState([
    { id: 1, author: "Priya", text: "Picked up from Pune warehouse" },
  ]);
  const inputRef = useRef(null);

  const [optimisticComments, addOptimistic] = useOptimistic(
    comments,
    (current, text) => [...current, { id: "pending-" + text, author: "You", text, pending: true }]
  );

  const [state, formAction, isPending] = useActionState(
    async (prev, formData) => {
      const text = formData.get("text")?.toString().trim();
      if (!text) return { ...prev, error: "Comment cannot be empty" };
      addOptimistic(text);                                  // instant feedback
      try {
        const saved = await postComment(text);
        setComments((c) => [...c, saved]);                  // confirmed by "server"
        return { error: null, posted: prev.posted + 1 };
      } catch (err) {
        return { ...prev, error: err.message };             // optimistic item rolls back automatically
      }
    },
    { error: null, posted: 0 }
  );

  useEffect(() => {
    if (state.posted > 0) inputRef.current?.focus();        // focus after each successful post
  }, [state.posted]);

  useEffect(() => {
    console.log("Comments tab: effect mounted");
    return () => console.log("Comments tab: effect cleaned up (hidden by Activity)");
  }, []);

  return (
    <section>
      <h3>Comments ({optimisticComments.length})</h3>
      <ul>
        {optimisticComments.map((c) => (
          <li key={c.id} style={{ opacity: c.pending ? 0.5 : 1 }}>
            <strong>{c.author}:</strong> {c.text} {c.pending && <small>(sending…)</small>}
          </li>
        ))}
      </ul>
      <form action={formAction}>
        <TextField ref={inputRef} name="text" placeholder="Add a comment (type 'fail' to see rollback)" />
        <SubmitButton />
      </form>
      {state.error && <p style={{ color: "crimson" }}>{state.error}</p>}
      <p>Posted this session: {state.posted} {isPending && "· working…"}</p>
    </section>
  );
}

function LiveTicker({ tab }) {
  const [ticks, setTicks] = useState(0);
  const onTick = useEffectEvent(() => {                     // always sees the latest tab
    console.log("tick " + (ticks + 1) + ": user is on the " + tab + " tab");
    setTicks((t) => t + 1);
  });
  useEffect(() => {
    const id = setInterval(() => onTick(), 3000);           // created once; never restarted by tab changes
    return () => clearInterval(id);
  }, []);
  return <small>Ticker fired {ticks} times (interval created once)</small>;
}

export default function App() {
  const [tab, setTab] = useState("order");
  return (
    <main style={{ fontFamily: "system-ui", maxWidth: 640, margin: "40px auto", padding: 16 }}>
      <title>{"Order Tracker — " + (tab === "order" ? "Order" : "Comments")}</title>
      <h1>React 19 Order Tracker</h1>
      <nav style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button onClick={() => setTab("order")} disabled={tab === "order"}>Order</button>
        <button onClick={() => setTab("comments")} disabled={tab === "comments"}>Comments</button>
      </nav>

      <Suspense fallback={<p>Loading order…</p>}>
        <Activity mode={tab === "order" ? "visible" : "hidden"}>
          <OrderSummary />
        </Activity>
      </Suspense>

      <Activity mode={tab === "comments" ? "visible" : "hidden"}>
        <Comments />                                        {/* draft text survives tab switches */}
      </Activity>

      <LiveTicker tab={tab} />
    </main>
  );
}

// Expected behaviour:
// 1. "Loading order…" for ~0.9 s, then "Order #4512 / Rahul Verma, Jaipur · ₹2,499 · In transit".
// 2. Comments tab: a new comment appears greyed out instantly, becomes solid after ~1.2 s.
// 3. Typing "fail": the greyed comment disappears and "Server rejected the comment" is shown.
// 4. Switch tabs: console logs the Comments effect cleanup; the typed draft is still there on return.
// 5. Browser tab title changes with the active tab; the ticker keeps counting without restarting.`
    },
    {
      heading: "18. Summary",
      content: `• **Actions** are async functions run inside transitions; React tracks pending state, queues them in order and routes errors to error boundaries. Wrap state updates after an \`await\` in another \`startTransition\`.
• **\`<form action={fn}>\`** receives \`FormData\` and resets the form on success. **\`useActionState\`** returns \`[state, formAction, isPending]\`; return validation errors as state instead of throwing.
• **\`useFormStatus\`** (from \`react-dom\`) gives \`pending\`, \`data\`, \`method\` and \`action\` to any component rendered **inside** a form.
• **\`useOptimistic\`** shows the expected result immediately and discards it when the action settles; update the real state on success and the UI stays consistent.
• **\`use(promise)\`** suspends until the promise resolves and works with \`<Suspense>\` and error boundaries; never create the promise during render. **\`use(Context)\`** can be called conditionally.
• \`ref\` is a normal prop (no \`forwardRef\`), ref callbacks can return cleanups, and \`<Context value>\` replaces \`<Context.Provider>\`.
• \`<title>\`, \`<meta>\` and \`<link>\` rendered in components are hoisted to \`<head>\`; stylesheets with \`precedence\` and async scripts are deduplicated; \`preload\`/\`preinit\`/\`preconnect\`/\`prefetchDNS\` warm up resources.
• **\`<Activity mode="hidden">\`** (19.2) hides UI, cleans up effects, preserves state and pre-renders at low priority. **\`useEffectEvent\`** (19.2) reads the latest values in effects without adding dependencies.
• **React Server Components** run only on the server, can be async and ship zero client JavaScript; \`"use client"\` marks the interactive boundary and \`"use server"\` marks Server Functions. Next.js App Router makes every component a Server Component by default.
• **\`<ViewTransition>\`** is still experimental (canary channel, \`unstable_\` prefix); everything else in this lecture is stable in React 19.2.
**Next lecture:** Global State Management — Zustand & Redux Toolkit`
    }
  ]
};
