export const lecture13 = {
  slug: "lecture-13",
  number: 13,
  title: "Complete React Course — Module 4: Lecture 13: useEffect & Side Effects Fundamentals",
  summary: "Learn what side effects are and where they belong in a React component. Covers the render and commit phases, useEffect syntax, the three forms of the dependency array, when effects run relative to paint, cleanup functions, Strict Mode's extra setup and cleanup in development, and syncing with external systems such as document.title, timers, event listeners and subscriptions.",
  readTime: "30 min read",
  difficulty: "Intermediate",
  date: "2026-10-08",
  sections: [
    {
      heading: "1. What Is a Side Effect?",
      content: `In the last three lectures you learned to keep state immutable and let React re-render from it. A React component is meant to behave like a **pure function**: given the same props and state, it returns the same JSX and changes nothing outside itself.
Real apps, however, must touch the world outside React. Anything a component does **beyond calculating its JSX** is a **side effect**. Common examples:
• Changing the browser tab title with \`document.title\`.
• Starting a timer with \`setInterval\` or \`setTimeout\`.
• Adding an event listener to \`window\` or \`document\` (resize, scroll, keyboard shortcuts).
• Opening a WebSocket or subscribing to a chat room, a stock-price feed or the browser's online/offline events.
• Fetching data from an API, writing to \`localStorage\`, or controlling a non-React widget such as a map or video player.
React gives side effects two proper homes:
1. **Event handlers** — for effects caused by a specific user action ("when the user clicks Pay, send the payment request").
2. **Effects (\`useEffect\`)** — for effects caused by **rendering itself** ("while this chat screen is visible, stay connected to the room").
This lecture is about the second home. A useful one-line definition from the React team: **an Effect lets you synchronise a component with an external system.**`
    },
    {
      heading: "2. Why Side Effects Must Not Run During Render",
      content: `It is tempting to write side effects directly in the component body. Don't. The body of your component runs during the **render phase**, and React makes no promise about how often that happens:
• React may render a component many times — on every state change, every parent re-render, and twice in development under Strict Mode.
• React may start a render and throw it away without showing it (for example, during a transition that gets interrupted).
• During server rendering there is no \`window\` or \`document\` at all.
So if you start a timer in the body, you get a new timer on every render and nobody ever stops them. If you add an event listener in the body, you add duplicates that leak memory. The snippet shows the broken version — compare it with the correct version in the next section.
**Rule:** rendering must only calculate. Side effects go into event handlers or Effects.`,
      codeSnippet: `// src/BrokenClock.jsx — DO NOT do this
import { useState } from "react";

export default function BrokenClock() {
  const [time, setTime] = useState(new Date());

  // Runs on EVERY render: each render creates another interval,
  // each interval calls setTime, which triggers another render...
  setInterval(() => setTime(new Date()), 1000);

  return <p>{time.toLocaleTimeString("en-IN")}</p>;
}`
    },
    {
      heading: "3. Render Phase, Commit Phase and Effects",
      content: `Every update in React goes through the same pipeline. Understanding it explains exactly when your Effect code runs:
1. **Trigger** — something requests an update: the first mount, a \`setState\` call, or a parent re-rendering.
2. **Render phase** — React calls your component function to get JSX. This must be pure. Nothing on screen changes yet.
3. **Commit phase** — React compares the new JSX with the previous output and applies the minimum changes to the real DOM. Refs are attached here.
4. **Paint** — the browser draws the updated pixels on screen.
5. **Effects run** — React runs the Effects whose dependencies changed. Before running an Effect again, it first runs that Effect's previous cleanup.
Two consequences matter in practice:
• Inside an Effect the DOM is **already updated**, so you can safely read it, measure it or hand it to a third-party library.
• Effects run **only in the browser**. During server rendering (for example, in a Next.js app) components render to HTML but their Effects never run on the server.`,
      codeSnippet: `// src/Lifecycle.jsx — watch the console order
import { useEffect, useState } from "react";

export default function Lifecycle() {
  const [count, setCount] = useState(0);
  console.log("1. render phase, count =", count);

  useEffect(() => {
    console.log("3. effect ran, DOM shows", count);
    return () => console.log("2. cleanup for count =", count);
  }, [count]);

  return <button onClick={() => setCount((c) => c + 1)}>Clicked {count} times</button>;
}

// After one click the console shows (ignoring Strict Mode's extra run):
// 1. render phase, count = 1
// 2. cleanup for count = 0
// 3. effect ran, DOM shows 1`
    },
    {
      heading: "4. useEffect Syntax",
      content: `\`useEffect\` takes two arguments:
• **setup** — a function containing your effect code. It may optionally **return a cleanup function**.
• **dependencies** (optional) — an array of every reactive value (props, state, and variables or functions declared in the component body) that the setup code reads.
\`useEffect\` returns \`undefined\`. Like every Hook, call it at the **top level** of your component — never inside a condition, loop or nested function. If you need conditional behaviour, put the \`if\` **inside** the Effect.
The setup function must be **synchronous**: it returns either nothing or a cleanup function. Writing \`useEffect(async () => ...)\` is a mistake because an async function returns a Promise, and React cannot use a Promise as a cleanup. (Data fetching inside Effects is covered properly in the next lecture.)`,
      codeSnippet: `// src/Greeting.jsx
import { useEffect } from "react";

export default function Greeting({ name }) {
  useEffect(
    () => {
      // setup: connect / start / subscribe
      console.log(\`Hello, \${name}\`);

      return () => {
        // cleanup (optional): disconnect / stop / unsubscribe
        console.log(\`Goodbye, \${name}\`);
      };
    },
    [name] // dependencies: every reactive value the setup reads
  );

  return <h2>Welcome, {name}</h2>;
}`
    },
    {
      heading: "5. The Dependency Array: None, [] and [deps]",
      content: `The second argument controls **when** the Effect re-synchronises. There are three forms:
• **No array** — \`useEffect(fn)\` runs after the first render **and after every re-render**. Rarely what you want; occasionally useful for logging.
• **Empty array** — \`useEffect(fn, [])\` runs **once after mount** (and its cleanup runs on unmount). Use it when the setup reads no props or state.
• **Array of values** — \`useEffect(fn, [a, b])\` runs after mount and again **whenever \`a\` or \`b\` changed** since the last render.
React compares each dependency with its previous value using \`Object.is\`. Numbers, strings and booleans compare by value, but objects, arrays and functions compare **by reference**. An object created in the component body is a brand-new object on every render, so an Effect that depends on it re-runs every time.
The golden rule: **you don't choose the dependencies — your code does.** Every reactive value read inside the Effect must be listed. The \`react-hooks/exhaustive-deps\` rule of \`eslint-plugin-react-hooks\` (included in the Vite React template's ESLint setup) checks this for you. If you want an Effect to run less often, change the code so it needs fewer dependencies — never lie to the linter.`,
      codeSnippet: `// src/DependencyDemo.jsx
import { useEffect, useState } from "react";

export default function DependencyDemo({ city }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("A: after EVERY render");
  });

  useEffect(() => {
    console.log("B: once, after the first render (mount)");
  }, []);

  useEffect(() => {
    console.log(\`C: city is now \${city}\`);
  }, [city]); // re-runs only when city changes, not when count changes

  // Pitfall: a new object on every render, so D runs after every render too
  const options = { city, units: "metric" };
  useEffect(() => {
    console.log("D: options changed?", options);
  }, [options]);
  // Fix: depend on the primitive [city], and create the object inside the Effect.

  return <button onClick={() => setCount(count + 1)}>Re-render ({count})</button>;
}`
    },
    {
      heading: "6. When Exactly Does an Effect Run? (After Paint)",
      content: `Effects are designed **not to block the screen**. When an update was not caused by a user interaction — for example, the first mount or a timer firing — React generally lets the browser **paint first** and runs your Effect afterwards. The user sees the new UI immediately, and the Effect's work happens just after.
When the update comes from a discrete interaction such as a click, React may run the Effect before the browser paints so the result of the interaction is processed promptly. Either way, the DOM is already committed when your Effect runs, and your code should not depend on the exact paint timing.
Because Effects usually run after paint, an Effect that **measures layout and immediately changes it** (positioning a tooltip, for example) can cause a visible flicker: the user briefly sees the wrong position. For that narrow case React offers \`useLayoutEffect\`, which has the same signature but runs **before the browser paints**. It blocks painting, so use it only when you must measure and adjust layout; \`useEffect\` is the right default for everything else.`,
      codeSnippet: `// src/Tooltip.jsx — the rare case for useLayoutEffect
import { useLayoutEffect, useRef, useState } from "react";

export default function Tooltip({ text }) {
  const ref = useRef(null);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    // Runs after the DOM update but BEFORE paint: no flicker
    setHeight(ref.current.getBoundingClientRect().height);
  }, [text]);

  return (
    <div ref={ref} style={{ transform: \`translateY(-\${height}px)\` }}>
      {text}
    </div>
  );
}`
    },
    {
      heading: "7. Cleanup Functions",
      content: `Most external systems need to be **undone**: an interval must be cleared, a listener removed, a connection closed. Return a function from your setup and React calls it at the right time:
• **Before the Effect re-runs** — when a dependency changes, React first runs the cleanup with the **old** values, then the setup with the **new** values.
• **When the component unmounts** — the last cleanup runs once the component is removed from the screen.
Think of setup and cleanup as a matched pair: **connect / disconnect, add / remove, start / stop, subscribe / unsubscribe.** A good test: if the user could see a difference between "setup ran once" and "setup → cleanup → setup", your cleanup is incomplete.
The example connects to a chat room. When the user switches from "delhi" to "mumbai", the cleanup disconnects from Delhi before the setup connects to Mumbai, so there is never more than one open connection.`,
      codeSnippet: `// src/ChatRoom.jsx
import { useEffect, useState } from "react";

// A fake external system, standing in for a real WebSocket client
function createConnection(roomId) {
  return {
    connect: () => console.log(\`Connected to "\${roomId}"\`),
    disconnect: () => console.log(\`Disconnected from "\${roomId}"\`),
  };
}

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect(); // runs before reconnecting and on unmount
  }, [roomId]);

  return <h3>Welcome to the {roomId} room</h3>;
}

export default function App() {
  const [roomId, setRoomId] = useState("delhi");
  const [show, setShow] = useState(true);

  return (
    <>
      <select value={roomId} onChange={(e) => setRoomId(e.target.value)}>
        <option value="delhi">Delhi</option>
        <option value="mumbai">Mumbai</option>
        <option value="bengaluru">Bengaluru</option>
      </select>
      <button onClick={() => setShow(!show)}>{show ? "Close chat" : "Open chat"}</button>
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}`
    },
    {
      heading: "8. Strict Mode Runs Effects Twice in Development",
      content: `The Vite React template wraps your app in \`<StrictMode>\` in \`src/main.jsx\`. In **development only**, Strict Mode deliberately stress-tests your components. For Effects, it runs **one extra setup → cleanup cycle** right after a component first mounts, so the sequence becomes **setup → cleanup → setup**.
Students often see "Connected" printed twice and think React is broken. It isn't. React is simulating the user leaving and coming back, to expose Effects with a **missing or wrong cleanup**. If your cleanup correctly undoes the setup, the extra cycle is invisible to the user: you end up with exactly one connection, one interval and one listener.
Strict Mode also calls your component function and state updater functions an extra time in development, to catch impure rendering.
How to respond:
• **Do** fix the cleanup so setup → cleanup → setup behaves like a single setup.
• **Don't** remove \`<StrictMode>\` to make the warning go away.
• **Don't** use a ref flag such as \`didRun.current\` to skip the second run; it hides the bug instead of fixing it.
• Remember that **production builds run each Effect setup only once per mount**.
Some effects, like sending an analytics "page view" event, may legitimately fire twice in development; that is acceptable because production does not double-fire.`,
      codeSnippet: `// src/main.jsx — as generated by the Vite React template
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Console in development when <ChatRoom roomId="delhi" /> mounts:
// Connected to "delhi"
// Disconnected from "delhi"    <- Strict Mode's extra cleanup
// Connected to "delhi"         <- still exactly one open connection
//
// In production you would only see:
// Connected to "delhi"`
    },
    {
      heading: "9. Syncing with document.title",
      content: `The browser tab title lives outside React, which makes it a perfect first Effect. Gmail-style unread counts, "(3) Messages" or a running timer in the tab are all done this way.
The Effect reads \`unread\`, so \`unread\` is its dependency. It re-runs only when the count changes.
Note that React 19 also lets you render a \`<title>\` element anywhere in your component tree, and React hoists it into the document \`<head>\`. For a static page title that is often simpler. The Effect approach is still worth knowing because the same pattern applies to every external system that has no React component.`,
      codeSnippet: `// src/Inbox.jsx
import { useEffect, useState } from "react";

export default function Inbox() {
  const [unread, setUnread] = useState(3);

  useEffect(() => {
    document.title = unread > 0 ? \`(\${unread}) Inbox | MailKaro\` : "Inbox | MailKaro";
  }, [unread]);

  return (
    <div>
      <p>You have {unread} unread messages.</p>
      <button onClick={() => setUnread((n) => Math.max(n - 1, 0))}>Mark one as read</button>
      <button onClick={() => setUnread((n) => n + 1)}>Simulate new mail</button>
    </div>
  );
}`
    },
    {
      heading: "10. Syncing with Timers",
      content: `Timers are the classic Effect with cleanup. Two details matter:
• **Always clear the timer in the cleanup.** \`setInterval\` returns an ID; pass it to \`clearInterval\`. Otherwise the interval keeps firing after the component unmounts, and Strict Mode would leave you with two intervals.
• **Use the updater form of setState inside the callback.** If you write \`setSeconds(seconds + 1)\` with an empty dependency array, the callback captures \`seconds\` from the first render (a **stale closure**) and the value gets stuck at 1. Writing \`setSeconds((s) => s + 1)\` needs no dependency on \`seconds\`, so the interval is created once and never restarted.
The example is a simple stopwatch. Its Effect depends on \`isRunning\`: pressing Pause runs the cleanup (clearing the interval), and pressing Start runs the setup again.`,
      codeSnippet: `// src/Stopwatch.jsx
import { useEffect, useState } from "react";

export default function Stopwatch() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return; // nothing to set up, so no cleanup needed

    const id = setInterval(() => {
      setSeconds((s) => s + 1); // updater form: never stale
    }, 1000);

    return () => clearInterval(id);
  }, [isRunning]);

  return (
    <div>
      <h2>{seconds}s</h2>
      <button onClick={() => setIsRunning(!isRunning)}>{isRunning ? "Pause" : "Start"}</button>
      <button onClick={() => { setIsRunning(false); setSeconds(0); }}>Reset</button>
    </div>
  );
}`
    },
    {
      heading: "11. Syncing with Browser Event Listeners",
      content: `React's \`onClick\`, \`onChange\` and similar props only cover elements you render. To listen to the **window** or **document** — resize, scroll, keyboard shortcuts, clicks outside a dropdown — you need \`addEventListener\` inside an Effect.
The cleanup must call \`removeEventListener\` with **the same function reference** you added. That is why the handler is defined inside the Effect and stored in a variable, rather than written inline in both calls (two inline arrow functions are two different functions, so removal would silently fail).
The example tracks the window width to switch between a mobile and desktop layout, and closes a modal when the user presses Escape.`,
      codeSnippet: `// src/useWindowWidth.js — a custom hook (custom hooks get a full lecture later)
import { useEffect, useState } from "react";

export function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize); // same reference
  }, []);

  return width;
}

// src/Modal.jsx
import { useEffect } from "react";

export function Modal({ onClose, children }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]); // onClose is a prop read inside the Effect

  return <div role="dialog" aria-modal="true">{children}</div>;
}`
    },
    {
      heading: "12. Syncing with Subscriptions",
      content: `A **subscription** is any external source that pushes updates to you over time: a WebSocket, a Firebase listener, a stock-price feed, or the browser's own \`online\` and \`offline\` events. The pattern is always the same:
1. In the setup, subscribe and update state whenever the source reports a change.
2. In the cleanup, unsubscribe.
3. List every reactive value the subscription depends on (a room ID, a stock symbol) so React re-subscribes when it changes.
The example shows a network-status badge, useful in apps used on patchy mobile connections.
For subscribing to an external **store** whose value you read during render, React also provides \`useSyncExternalStore\`, which handles some concurrent-rendering edge cases for you. You will meet it later in the course; the Effect version below is the right place to start and is perfectly fine for learning.`,
      codeSnippet: `// src/NetworkStatus.jsx
import { useEffect, useState } from "react";

export default function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  return <span>{isOnline ? "Online" : "Offline: changes will sync when you reconnect"}</span>;
}`
    },
    {
      heading: "13. You Might Not Need an Effect & Common Mistakes",
      content: `Effects are an **escape hatch** for talking to systems outside React. If no external system is involved, you probably don't need one. Two very common unnecessary Effects:
• **Deriving data from state or props.** Don't store \`fullName\` in state and update it in an Effect when \`firstName\` changes. Calculate it during render: \`const fullName = firstName + " " + lastName;\`. The Effect version renders twice and can show stale values in between.
• **Responding to a user event.** If something should happen because the user clicked Buy, put it in the click handler, not in an Effect that watches a \`purchased\` flag.
**Common mistakes:**
1. **Side effects in the component body** — timers, listeners or \`document.title\` writes outside an Effect run on every render.
2. **Missing cleanup** — intervals and listeners that keep running after unmount, causing memory leaks and "updates on an unmounted component" bugs.
3. **Missing dependencies** — the Effect keeps using stale props or state. Trust the \`exhaustive-deps\` lint rule.
4. **Infinite loops** — an Effect that sets state which is also its own dependency, or no dependency array plus a \`setState\` call inside.
5. **Objects or functions created during render as dependencies** — new reference every render, so the Effect re-runs every render.
6. **Async setup function** — \`useEffect(async () => ...)\` returns a Promise instead of a cleanup.
7. **Removing a listener with a different function** — inline arrow functions in add and remove are not the same reference.
8. **"Fixing" Strict Mode's double run** with a ref flag or by removing \`<StrictMode>\` instead of writing proper cleanup.`,
      codeSnippet: `// src/Profile.jsx — unnecessary Effect vs. calculating during render
import { useEffect, useState } from "react";

// Avoid: extra state + extra render + a moment of stale UI
function ProfileBad({ firstName, lastName }) {
  const [fullName, setFullName] = useState("");
  useEffect(() => {
    setFullName(firstName + " " + lastName);
  }, [firstName, lastName]);
  return <h2>{fullName}</h2>;
}

// Prefer: derive it during render
export default function Profile({ firstName, lastName }) {
  const fullName = firstName + " " + lastName;
  return <h2>{fullName}</h2>;
}`
    },
    {
      heading: "14. Top React Interview Questions on useEffect",
      content: `**Q1: What is a side effect in React, and where should it go?**
Answer: Anything a component does besides calculating its JSX, such as timers, subscriptions, DOM APIs or network requests. Effects caused by a user action belong in event handlers; effects caused by the component being on screen belong in \`useEffect\`.
**Q2: What is the difference between no dependency array, \`[]\` and \`[a, b]\`?**
Answer: No array runs after every render. \`[]\` runs once after mount, with cleanup on unmount. \`[a, b]\` runs after mount and whenever \`a\` or \`b\` changes, compared with \`Object.is\`.
**Q3: When does the cleanup function run?**
Answer: Before the Effect runs again with new dependencies (using the previous render's values), and once when the component unmounts. In development, Strict Mode also runs one extra cleanup right after the first setup.
**Q4: Why does my Effect run twice in development?**
Answer: Strict Mode runs an extra setup → cleanup cycle on mount to reveal missing cleanups. It does not happen in production. The fix is a correct cleanup, not disabling Strict Mode.
**Q5: Does useEffect run before or after the browser paints?**
Answer: After React commits the DOM. For updates not caused by a user interaction, React usually lets the browser paint first. If you must measure and change layout before the user sees it, use \`useLayoutEffect\`.
**Q6: Why can't the setup function be async?**
Answer: The setup must return either nothing or a cleanup function. An async function always returns a Promise. Define an async function inside the Effect and call it instead.
**Q7: How do you avoid a stale value inside a setInterval callback?**
Answer: Use the updater form, \`setCount((c) => c + 1)\`, so the callback doesn't depend on the captured state, or list the value as a dependency so the interval is recreated.
**Q8: How is useEffect related to class lifecycle methods?**
Answer: Roughly, it covers \`componentDidMount\`, \`componentDidUpdate\` and \`componentWillUnmount\`. But the better mental model is **synchronisation**: describe how to start and stop syncing with an external system for the current props and state, and React decides when.`
    },
    {
      heading: "15. Practical Hands-On Exercise — Focus Timer with Tab Title, Keyboard Shortcut & Network Status",
      content: `Build a 25-minute focus (Pomodoro) timer that uses every Effect pattern from this lecture:
• **Timer** — an interval that ticks every second and stops automatically at 00:00.
• **document.title** — the tab shows the remaining time, so you can see it from another tab. The original title is restored when the component unmounts.
• **Event listener** — pressing the Space bar starts or pauses the timer.
• **Subscription** — a badge shows whether you are online.
Notice the design choice for stopping at zero: instead of an Effect that calls \`setIsRunning(false)\` when the time hits zero, the component **derives** \`isTicking\` during render. When \`secondsLeft\` reaches 0, \`isTicking\` becomes false, and React runs the interval Effect's cleanup automatically.
Replace \`src/App.jsx\` in your Vite project with the code below, run \`npm run dev\`, and open the console to watch Strict Mode's extra cycle. Then try these extensions:
1. Add buttons for 5-minute and 15-minute break modes.
2. Save completed sessions to \`localStorage\` in an Effect that depends on the count of completed sessions.
3. Play a sound when the timer finishes, triggered in the interval callback, not in a separate Effect.`,
      codeSnippet: `// src/App.jsx — Lecture 13: Focus Timer
import { useEffect, useState } from "react";

const FOCUS_SECONDS = 25 * 60;

function formatTime(totalSeconds) {
  const m = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const s = String(totalSeconds % 60).padStart(2, "0");
  return \`\${m}:\${s}\`;
}

export default function App() {
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_SECONDS);
  const [isRunning, setIsRunning] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Derived during render: no extra state, no extra Effect
  const isFinished = secondsLeft === 0;
  const isTicking = isRunning && !isFinished;

  // 1. Timer: start when ticking, clear when paused, finished or unmounted
  useEffect(() => {
    if (!isTicking) return;
    console.log("interval started");
    const id = setInterval(() => {
      setSecondsLeft((s) => Math.max(s - 1, 0));
    }, 1000);
    return () => {
      console.log("interval cleared");
      clearInterval(id);
    };
  }, [isTicking]);

  // 2a. Remember the original tab title and restore it on unmount
  useEffect(() => {
    const originalTitle = document.title;
    return () => {
      document.title = originalTitle;
    };
  }, []);

  // 2b. Keep the tab title in sync with the timer
  useEffect(() => {
    if (isFinished) {
      document.title = "Time's up! | Focus Timer";
    } else {
      document.title = \`\${isTicking ? "▶" : "⏸"} \${formatTime(secondsLeft)} | Focus Timer\`;
    }
  }, [secondsLeft, isTicking, isFinished]);

  // 3. Keyboard shortcut: Space toggles start/pause
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.code !== "Space") return;
      const tag = e.target.tagName;
      if (tag === "BUTTON" || tag === "INPUT" || tag === "TEXTAREA") return; // let the element handle it
      e.preventDefault(); // stop the page from scrolling
      setIsRunning((r) => !r); // updater form, so no dependencies needed
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // 4. Subscription: browser online/offline events
  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  function handleReset() {
    setIsRunning(false);
    setSecondsLeft(FOCUS_SECONDS);
  }

  const progress = ((FOCUS_SECONDS - secondsLeft) / FOCUS_SECONDS) * 100;

  return (
    <div style={{ maxWidth: "420px", margin: "40px auto", padding: "28px", background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "16px", fontFamily: "system-ui, sans-serif", textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ color: "#002057", margin: 0 }}>Focus Timer</h2>
        <span style={{ fontSize: "13px", padding: "4px 10px", borderRadius: "999px", background: isOnline ? "#dcfce7" : "#fee2e2", color: isOnline ? "#166534" : "#991b1b" }}>
          {isOnline ? "Online" : "Offline"}
        </span>
      </div>

      <p style={{ fontSize: "64px", fontWeight: 700, margin: "24px 0 8px", color: isFinished ? "#ea580c" : "#0f172a", fontVariantNumeric: "tabular-nums" }}>
        {formatTime(secondsLeft)}
      </p>

      <div style={{ height: "8px", background: "#e2e8f0", borderRadius: "999px", overflow: "hidden", marginBottom: "24px" }}>
        <div style={{ width: \`\${progress}%\`, height: "100%", background: "#2506ad", transition: "width 0.3s" }} />
      </div>

      <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
        <button
          onClick={() => setIsRunning(!isRunning)}
          disabled={isFinished}
          style={{ background: "#2506ad", color: "#fff", border: "none", padding: "10px 22px", borderRadius: "8px", fontWeight: 600, cursor: isFinished ? "not-allowed" : "pointer", opacity: isFinished ? 0.5 : 1 }}
        >
          {isFinished ? "Done" : isTicking ? "Pause" : "Start"}
        </button>
        <button
          onClick={handleReset}
          style={{ background: "#f1f5f9", color: "#0f172a", border: "1px solid #cbd5e1", padding: "10px 22px", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }}
        >
          Reset
        </button>
      </div>

      <p style={{ color: "#64748b", fontSize: "13px", marginTop: "20px" }}>
        Tip: press Space to start or pause. Switch tabs and watch the title.
      </p>
    </div>
  );
}`
    },
    {
      heading: "16. Summary",
      content: `• A **side effect** is anything beyond calculating JSX: timers, listeners, subscriptions, DOM APIs, network requests. Never run them in the component body.
• Updates flow through **render → commit → paint → Effects**. Rendering must be pure; Effects run after the DOM is updated and only in the browser.
• \`useEffect(setup, dependencies?)\` — the setup may return a **cleanup** function and must not be async.
• **No array** runs after every render, **\`[]\`** runs once after mount, **\`[deps]\`** runs when any dependency changes (\`Object.is\` comparison). List every reactive value you read and let \`exhaustive-deps\` check you.
• Effects usually run **after paint**; use \`useLayoutEffect\` only to measure and adjust layout before paint.
• **Cleanup** runs before each re-run (with old values) and on unmount. Pair every connect with a disconnect, add with remove, start with stop.
• **Strict Mode** runs an extra setup → cleanup → setup in development only, to reveal missing cleanups. Fix the cleanup; don't suppress it.
• Use Effects to sync with \`document.title\`, timers (with updater functions), window/document event listeners and subscriptions.
• If no external system is involved, you probably don't need an Effect: derive values during render and handle user actions in event handlers.
**Next lecture:** useEffect Deep Dive — Dependencies, Data Fetching, Race Conditions & useEffectEvent`
    }
  ]
};
