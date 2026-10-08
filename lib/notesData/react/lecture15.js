export const lecture15 = {
  slug: "lecture-15",
  number: 15,
  title: "Complete React Course — Module 4: Lecture 15: useRef, the DOM & Portals",
  summary: "Learn React's escape hatches for working outside the render cycle: useRef for mutable values that don't trigger re-renders, DOM refs for focusing, scrolling and measuring, ref as a regular prop in React 19 (no forwardRef), ref callback cleanup functions, useImperativeHandle, createPortal for modals and tooltips, and safely integrating non-React libraries like Chart.js.",
  readTime: "30 min read",
  difficulty: "Intermediate",
  date: "2026-10-08",
  sections: [
    {
      heading: "1. Why React Needs Escape Hatches",
      content: `So far, everything we have built has been **declarative**: you describe what the UI should look like for a given state, and React figures out how to update the DOM. That covers most of an app.
But some jobs are naturally **imperative** — you need to tell the browser to *do* something right now:
• Put the cursor in a search box when a page opens.
• Scroll a chat window to the newest message.
• Read the width of a card to position a tooltip.
• Store a timer ID so you can cancel it later.
• Hand a \`<canvas>\` element to a charting or map library that knows nothing about React.
React gives you **escape hatches** for these cases. The main ones are \`useRef\` (this lecture), \`useEffect\` (last lecture) and \`createPortal\` (also this lecture).
**Rule of thumb:** reach for an escape hatch only when you are stepping outside React. If something can be expressed with state and props, keep it declarative.`
    },
    {
      heading: "2. useRef Basics — A Box That Survives Re-renders",
      content: `\`useRef(initialValue)\` returns a plain object with a single property: \`{ current: initialValue }\`.
Three facts define how it behaves:
• **It persists** — React gives you the *same* object on every render of that component, for as long as the component is mounted.
• **It is mutable** — you can freely assign \`ref.current = somethingNew\`.
• **Changing it does not re-render** — React does not track \`ref.current\`. Updating it is invisible to the UI until something else causes a render.
Think of a ref as a pocket attached to your component where you can keep a value that React doesn't need to know about.
**Important:** do not read or write \`ref.current\` *during rendering* (in the body of your component that produces JSX). Rendering must be pure. Read and write refs inside **event handlers** and **effects**. The one accepted exception is lazy initialisation: \`if (ref.current === null) ref.current = createExpensiveThing();\`.
If you use TypeScript, note that React 19's types require you to pass an argument to \`useRef\` — write \`useRef(null)\`, not \`useRef()\`.`,
      codeSnippet: `// src/ClickTracker.jsx
import { useRef } from "react";

export default function ClickTracker() {
  const clickCount = useRef(0); // { current: 0 }

  function handleClick() {
    clickCount.current = clickCount.current + 1; // mutate freely
    console.log("Clicked " + clickCount.current + " times");
    // The screen does NOT update — refs don't trigger re-renders
  }

  return <button onClick={handleClick}>Click me (check the console)</button>;
}`
    },
    {
      heading: "3. Refs vs State — Choosing the Right Tool",
      content: `Both refs and state remember values between renders. The difference is **whether the UI depends on the value**.
• **State** (\`useState\`): changing it re-renders the component. Use it for anything shown on screen. Values are a snapshot per render — reading state right after \`setState\` still gives you the old value.
• **Ref** (\`useRef\`): changing it does not re-render. Use it for values that only event handlers or effects need: timer and interval IDs, the previous value of a prop, an \`AbortController\`, a WebSocket instance, a DOM node. \`ref.current\` always gives you the latest value immediately.
**Quick test:** "If this value changes, should the screen change?" Yes → state. No → ref.
The stopwatch below uses **both**: the elapsed time is shown on screen, so it is state; the interval ID is only needed to stop the timer, so it is a ref. Storing the interval ID in a regular \`let\` variable would not work — the variable would be recreated as \`undefined\` on every render, and the Stop button could never clear the interval.`,
      codeSnippet: `// src/Stopwatch.jsx
import { useState, useRef, useEffect } from "react";

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null); // shown on screen -> state
  const [now, setNow] = useState(null);             // shown on screen -> state
  const intervalRef = useRef(null);                 // not shown -> ref

  function handleStart() {
    setStartTime(Date.now());
    setNow(Date.now());
    clearInterval(intervalRef.current); // avoid stacking intervals
    intervalRef.current = setInterval(() => setNow(Date.now()), 10);
  }

  function handleStop() {
    clearInterval(intervalRef.current);
  }

  // Clear the interval if the component unmounts while running
  useEffect(() => () => clearInterval(intervalRef.current), []);

  const seconds = startTime && now ? (now - startTime) / 1000 : 0;

  return (
    <div>
      <h2>Time passed: {seconds.toFixed(2)}s</h2>
      <button onClick={handleStart}>Start</button>
      <button onClick={handleStop}>Stop</button>
    </div>
  );
}`
    },
    {
      heading: "4. DOM Refs — Getting Hold of a Real Element",
      content: `The most common use of \`useRef\` is to access a **DOM node** that React created.
1. Create a ref with \`useRef(null)\`.
2. Pass it to a JSX element: \`<input ref={inputRef} />\`.
3. After React creates the DOM node and commits it to the page, it sets \`inputRef.current\` to that node. When the node is removed, React sets it back to \`null\`.
Now you can call any browser DOM API on it: \`focus()\`, \`select()\`, \`scrollIntoView()\`, \`getBoundingClientRect()\`, \`play()\` / \`pause()\` on a \`<video>\`, \`showModal()\` on a \`<dialog>\`, and so on.
Because \`current\` is only filled in after the commit, it is \`null\` during the first render. That's another reason to use refs only in event handlers and effects — by then the node exists.
**Focus on mount:** for the simple case of focusing an input when it first appears, the \`autoFocus\` prop is enough. Use a ref when focus depends on user actions, such as "focus the search box when the user presses /".`,
      codeSnippet: `// src/SearchBox.jsx
import { useRef, useEffect } from "react";

export default function SearchBox() {
  const inputRef = useRef(null);

  // Keyboard shortcut: press "/" anywhere to jump to the search box
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current.focus();
        inputRef.current.select();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div>
      <input ref={inputRef} placeholder="Search courses... (press /)" />
      <button onClick={() => inputRef.current.focus()}>Focus search</button>
    </div>
  );
}`
    },
    {
      heading: "5. Scrolling to Elements — and When to Use flushSync",
      content: `\`element.scrollIntoView()\` scrolls the page (or a scrollable container) until the element is visible. It accepts options such as \`{ behavior: "smooth", block: "nearest" }\`.
A classic case is a chat window that should jump to the newest message. There is a catch: when you call \`setMessages(...)\` in an event handler, React has **not** updated the DOM yet — state updates are queued and batched, as you learned in Lecture 10. If you scroll on the very next line, you scroll to the *old* last message.
Two clean solutions:
• **Scroll in an effect** that runs after the DOM updates, e.g. \`useEffect(() => { bottomRef.current.scrollIntoView(); }, [messages]);\`. This is the most common approach and also handles messages that arrive from a server.
• **\`flushSync\`** from \`react-dom\`: wrapping the state update in \`flushSync(() => setMessages(...))\` forces React to update the DOM synchronously before the next line runs. Use it sparingly — it opts out of batching and can hurt performance.
The example uses the effect approach with a "bottom sentinel" \`<div>\` at the end of the list.`,
      codeSnippet: `// src/ChatWindow.jsx
import { useState, useRef, useEffect } from "react";

export default function ChatWindow() {
  const [messages, setMessages] = useState([
    { id: 1, from: "Priya", text: "Is the React meetup in Pune on Saturday?" },
  ]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  // Runs after React has updated the DOM with the new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  function handleSend(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { id: Date.now(), from: "You", text }]);
    setText("");
  }

  return (
    <div>
      <div style={{ height: 200, overflowY: "auto", border: "1px solid #cbd5e1", padding: 8 }}>
        {messages.map((m) => (
          <p key={m.id}><strong>{m.from}:</strong> {m.text}</p>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSend}>
        <input value={text} onChange={(e) => setText(e.target.value)} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}`
    },
    {
      heading: "6. Measuring Elements with useLayoutEffect",
      content: `Sometimes you need an element's size or position: to place a tooltip above a button, to decide whether text is truncated, or to size a chart to its container.
\`element.getBoundingClientRect()\` returns \`width\`, \`height\`, \`top\`, \`left\`, \`bottom\` and \`right\` relative to the viewport. \`offsetWidth\`, \`offsetHeight\` and \`scrollHeight\` are also handy.
**Which effect?** If you measure in \`useEffect\` and then update state based on the measurement, the browser may briefly paint the "wrong" layout before your correction — a visible flicker. \`useLayoutEffect\` runs after React updates the DOM but **before the browser paints**, so measure-then-adjust happens invisibly. It blocks painting, so use it only when you actually need layout information before the user sees the screen.
**Elements that resize:** a one-time measurement goes stale when the window or content changes. The browser's \`ResizeObserver\` API notifies you whenever an element's size changes; set it up in an effect and disconnect it in the cleanup.`,
      codeSnippet: `// src/useElementSize.js — a reusable hook built on ResizeObserver
import { useRef, useState, useLayoutEffect } from "react";

export function useElementSize() {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Measure once before paint
    const rect = node.getBoundingClientRect();
    setSize({ width: rect.width, height: rect.height });

    // Keep measuring as the element resizes
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, size];
}

// Usage: src/Banner.jsx
// const [ref, { width }] = useElementSize();
// return <div ref={ref}>{width < 500 ? "Compact view" : "Full view"}</div>;`
    },
    {
      heading: "7. Ref as a Regular Prop in React 19 (No More forwardRef)",
      content: `Refs on built-in elements like \`<input>\` give you the DOM node. But what about your **own** components? Suppose you build a styled \`<TextInput>\` and a parent wants to focus it.
**Before React 19**, \`ref\` was a special prop that was *not* passed to function components. You had to wrap the component in \`forwardRef((props, ref) => ...)\` to receive it.
**In React 19**, function components receive \`ref\` as a **normal prop**. Just destructure it and pass it to the DOM element you want to expose:
• \`function TextInput({ label, ref, ...rest }) { return <input ref={ref} {...rest} />; }\`
• The parent writes \`<TextInput ref={inputRef} />\` exactly as before.
\`forwardRef\` still works in React 19, so existing code keeps running, but it is no longer needed for function components and the React team has said it will be deprecated in a future release. Write new components with \`ref\` as a prop.
Two things stay the same: class components still do **not** receive \`ref\` as a prop (a ref on a class component points to the instance), and a ref is still only useful once the component actually attaches it to something.`,
      codeSnippet: `// src/TextInput.jsx — React 19 style
export default function TextInput({ label, ref, ...rest }) {
  return (
    <label style={{ display: "block", marginBottom: 12 }}>
      {label}
      <input ref={ref} {...rest} style={{ display: "block", padding: 8 }} />
    </label>
  );
}

// src/SignupForm.jsx
import { useRef } from "react";
import TextInput from "./TextInput";

export default function SignupForm() {
  const emailRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    const email = emailRef.current.value;
    if (!email.includes("@")) {
      emailRef.current.focus(); // focus the real <input> inside TextInput
      return;
    }
    alert("Welcome aboard, " + email);
  }

  return (
    <form onSubmit={handleSubmit}>
      <TextInput label="Email" name="email" ref={emailRef} />
      <button type="submit">Sign up</button>
    </form>
  );
}

// The old way (still works, no longer necessary):
// const TextInput = forwardRef(function TextInput({ label, ...rest }, ref) { ... });`
    },
    {
      heading: "8. Ref Callbacks and Their Cleanup Functions",
      content: `Instead of a ref object, you can pass a **function** to the \`ref\` attribute. React calls it with the DOM node when the node is attached.
Ref callbacks are useful when \`useRef\` is not enough:
• You need refs for a **dynamic list** of items (you can't call \`useRef\` inside a loop — hooks must be called at the top level).
• You want to run setup code exactly when a node appears, e.g. attach an observer.
**New in React 19 — cleanup functions:** a ref callback can **return a cleanup function**. React calls the cleanup when the element is removed (or when the callback changes), just like an effect cleanup. Before React 19, React instead called your callback a second time with \`null\`; with a cleanup function returned, React skips that \`null\` call.
**Things to know:**
• If you pass a new inline function on each render, React cleans up the old callback and calls the new one on every render. That's usually harmless, but for expensive setup, keep the callback stable (define it outside the component or wrap it in \`useCallback\`).
• In development, Strict Mode runs an extra setup + cleanup cycle for ref callbacks, so bugs in your cleanup show up early.
• Use a block body (\`ref={(node) => { list.push(node); }}\`) rather than an arrow that implicitly returns a value — React 19 treats a returned value as the cleanup function, and TypeScript will flag non-function returns.`,
      codeSnippet: `// src/CityGallery.jsx — refs for a dynamic list using a Map
import { useRef } from "react";

const cities = ["Delhi", "Mumbai", "Bengaluru", "Kolkata", "Chennai", "Jaipur"];

export default function CityGallery() {
  const itemsRef = useRef(null);

  function getMap() {
    if (!itemsRef.current) itemsRef.current = new Map(); // lazy init
    return itemsRef.current;
  }

  function scrollToCity(city) {
    getMap().get(city)?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }

  return (
    <div>
      <nav>
        {cities.map((city) => (
          <button key={city} onClick={() => scrollToCity(city)}>{city}</button>
        ))}
      </nav>
      <ul style={{ display: "flex", gap: 16, overflowX: "auto", listStyle: "none", padding: 0 }}>
        {cities.map((city) => (
          <li
            key={city}
            style={{ minWidth: 240, height: 140, background: "#e0e7ff", borderRadius: 12, padding: 16 }}
            ref={(node) => {
              getMap().set(city, node);          // setup: store the node
              return () => getMap().delete(city); // cleanup (React 19)
            }}
          >
            {city}
          </li>
        ))}
      </ul>
    </div>
  );
}`
    },
    {
      heading: "9. useImperativeHandle — Exposing a Custom API Instead of the DOM Node",
      content: `Passing a ref straight to an \`<input>\` gives the parent the **entire DOM node**. The parent could change styles, remove children or set values behind React's back. Often you want to expose only a few safe actions.
\`useImperativeHandle(ref, createHandle, dependencies?)\` lets a component decide what the parent's \`ref.current\` will be:
• \`ref\` — the ref received as a prop (React 19).
• \`createHandle\` — a function returning the object you want to expose, e.g. \`{ focus, clear }\`.
• \`dependencies\` — optional; the handle is recreated when they change.
Inside, keep your own private ref to the real DOM node and expose methods that use it.
**Use it sparingly.** Imperative handles are for actions that cannot be expressed as props: focus, scroll, play/pause animation, open a native dialog. If you find yourself exposing \`open()\` and \`close()\` for something that could simply be an \`isOpen\` prop, use the prop instead — it keeps data flowing one way.`,
      codeSnippet: `// src/OtpInput.jsx — exposes only focus() and clear()
import { useRef, useImperativeHandle } from "react";

export default function OtpInput({ ref, length = 6 }) {
  const inputRef = useRef(null); // private ref to the real DOM node

  useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current.focus();
    },
    clear() {
      inputRef.current.value = "";
      inputRef.current.focus();
    },
  }), []);

  return (
    <input
      ref={inputRef}
      inputMode="numeric"
      maxLength={length}
      placeholder={"Enter " + length + "-digit OTP"}
      style={{ letterSpacing: 8, padding: 8, fontSize: 18 }}
    />
  );
}

// src/VerifyPhone.jsx
import { useRef } from "react";
import OtpInput from "./OtpInput";

export function VerifyPhone() {
  const otpRef = useRef(null);
  return (
    <div>
      <OtpInput ref={otpRef} />
      <button onClick={() => otpRef.current.clear()}>Resend OTP</button>
      {/* otpRef.current.style is undefined here — the DOM node stays private */}
    </div>
  );
}`
    },
    {
      heading: "10. createPortal — Rendering Outside the Parent DOM Node",
      content: `Modals, tooltips, dropdown menus and toast notifications have a layout problem: they must appear **on top of everything**, but the component that owns them may sit inside a container with \`overflow: hidden\`, a \`transform\`, or a low \`z-index\`. Those styles can clip the popup or trap it below other content.
\`createPortal(children, domNode, key?)\` from \`react-dom\` renders \`children\` into a **different DOM node** — usually \`document.body\` or a dedicated \`<div id="modal-root">\` in \`index.html\`.
The key insight: a portal changes only where the **DOM nodes** go. In the **React tree**, the portal content is still a child of the component that rendered it. That means:
• It reads **context** from its React parents (theme, auth, language).
• **Events bubble through the React tree**, not the DOM tree. A click inside a portalled modal triggers \`onClick\` handlers on React ancestors — even though, in the DOM, the modal lives in \`<body>\`. If a parent's click handler closes something, call \`e.stopPropagation()\` where needed.
• Its state lives in the parent component as usual.
**Accessibility checklist for modals:** give the dialog \`role="dialog"\` and \`aria-modal="true"\`, label it with \`aria-labelledby\`, move focus into it when it opens, close it with Escape, and return focus to the button that opened it. The native \`<dialog>\` element with \`showModal()\` handles much of this for you (it renders in the browser's top layer, traps focus and closes on Escape) and is a good alternative to a hand-built portal modal.`,
      codeSnippet: `// src/Modal.jsx
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function Modal({ title, onClose, children }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    closeButtonRef.current?.focus(); // move focus into the modal

    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      previouslyFocused?.focus?.(); // return focus on close
    };
  }, [onClose]);

  return createPortal(
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", display: "grid", placeItems: "center", zIndex: 1000 }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()} // clicks inside don't close it
        style={{ background: "#fff", padding: 24, borderRadius: 12, maxWidth: 420, width: "90%" }}
      >
        <h2 id="modal-title">{title}</h2>
        {children}
        <button ref={closeButtonRef} onClick={onClose}>Close</button>
      </div>
    </div>,
    document.body
  );
}`
    },
    {
      heading: "11. Integrating Non-React Libraries",
      content: `Many excellent libraries were written for plain JavaScript: charting (Chart.js), maps (Leaflet), rich-text editors, video players, date pickers. They want a DOM element and then manage it themselves. React's job is to give them that element and stay out of the way.
The pattern has four parts:
1. **Render an empty container** (\`<canvas>\` or \`<div>\`) and attach a ref.
2. **Create the library instance in an effect** using \`ref.current\`, and store the instance in another ref so later code can talk to it.
3. **Destroy it in the cleanup** (\`chart.destroy()\`, \`map.remove()\`, \`editor.dispose()\` — whatever the library provides). Without this you leak memory and, in Strict Mode, you will see the library initialise twice on the same node.
4. **Sync props into the instance in a separate effect** — when data changes, call the library's update API instead of recreating everything.
**Never let React render children inside the container the library controls.** If both React and the library modify the same DOM nodes, they will overwrite each other. Keep the library's container empty from React's point of view.
Before writing a wrapper yourself, check whether a maintained React wrapper already exists (for example \`react-chartjs-2\` or \`react-leaflet\`) — but knowing this pattern lets you integrate anything.`,
      codeSnippet: `// npm install chart.js
// src/SalesChart.jsx
import { useRef, useEffect } from "react";
import Chart from "chart.js/auto"; // registers all chart types

export default function SalesChart({ labels, values }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  // 1. Create once, destroy on unmount
  useEffect(() => {
    chartRef.current = new Chart(canvasRef.current, {
      type: "bar",
      data: { labels: [], datasets: [{ label: "Sales (₹ lakh)", data: [] }] },
      options: { responsive: true },
    });
    return () => {
      chartRef.current.destroy();
      chartRef.current = null;
    };
  }, []);

  // 2. Push new data into the existing chart when props change
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    chart.data.labels = labels;
    chart.data.datasets[0].data = values;
    chart.update();
  }, [labels, values]);

  return <canvas ref={canvasRef} />; // React never renders children here
}

// Usage:
// <SalesChart labels={["Q1", "Q2", "Q3", "Q4"]} values={[12.5, 18.2, 15.9, 22.4]} />`
    },
    {
      heading: "12. Common Mistakes with Refs and Portals",
      content: `1. **Expecting a ref change to update the screen**: \`countRef.current++\` changes the value but the UI stays the same. If it is displayed, it belongs in state.
2. **Reading or writing \`ref.current\` during render**: \`return <p>{countRef.current}</p>\` makes your component impure and unpredictable, and it breaks the assumptions of tools like the React Compiler. Use refs in event handlers and effects.
3. **Using a DOM ref before it is attached**: \`inputRef.current.focus()\` in the component body throws because \`current\` is still \`null\`. Do it in an effect or a handler, and use optional chaining (\`?.\`) when the node may be absent (for example, conditionally rendered).
4. **Calling \`useRef\` inside a loop or condition**: hooks must be called at the top level. For lists, use a ref callback with a \`Map\` (Section 8).
5. **Wrapping new components in \`forwardRef\` out of habit**: in React 19 function components can accept \`ref\` as a prop directly.
6. **Exposing the whole DOM node when a small API would do**: use \`useImperativeHandle\` to expose \`focus()\` or \`scrollToTop()\`, not the raw node.
7. **Forgetting the cleanup for third-party libraries**: no \`destroy()\` means memory leaks and "canvas is already in use" style errors when the component remounts.
8. **Assuming portal events bubble through the DOM**: they bubble through the **React** tree. A click inside a portalled modal will reach a parent's \`onClick\`.
9. **Implicitly returning a value from a ref callback**: \`ref={(n) => (nodes[i] = n)}\` returns the node; React 19 treats returned values as cleanup functions. Use a block body.`
    },
    {
      heading: "13. Top React Interview Questions on useRef, the DOM & Portals",
      content: `**Q1: What is the difference between \`useRef\` and \`useState\`?**
*Answer*: Both persist values across renders. Updating state schedules a re-render and the new value is visible in the next render; updating \`ref.current\` is a synchronous mutation that does not re-render. Use state for values shown in the UI, refs for values only handlers and effects need (timer IDs, DOM nodes, library instances).

**Q2: Why can't you just use a regular variable instead of a ref?**
*Answer*: A local variable is recreated on every render, so its value is lost. A ref object is kept by React for the lifetime of the component.

**Q3: When is \`ref.current\` set for a DOM element?**
*Answer*: During the commit phase, after React has created or updated the DOM node and before effects run. It is \`null\` during the first render, and React sets it back to \`null\` when the node is removed.

**Q4: How do you pass a ref to a custom component in React 19?**
*Answer*: Pass it like any prop (\`<TextInput ref={r} />\`) and destructure \`ref\` in the function component, then attach it to an element. \`forwardRef\` is no longer required for function components.

**Q5: What does a ref callback cleanup function do?**
*Answer*: In React 19 a callback ref can return a function. React calls it when the element is detached, so you can undo setup such as removing the node from a Map or disconnecting an observer. When a cleanup is returned, React doesn't call the callback with \`null\`.

**Q6: What is \`useImperativeHandle\` for?**
*Answer*: It customises the value a parent receives through a ref, letting a component expose a limited API (\`focus\`, \`clear\`) instead of its raw DOM node.

**Q7: Why use a portal for a modal, and how do events behave?**
*Answer*: A portal renders into a different DOM node (often \`document.body\`) so the modal isn't clipped by \`overflow\`, \`transform\` or \`z-index\` of its ancestors. It stays in the same React tree, so it receives context, and events bubble to React ancestors.

**Q8: \`useEffect\` or \`useLayoutEffect\` for measuring an element?**
*Answer*: \`useLayoutEffect\` when you measure and then update layout, because it runs before the browser paints and prevents flicker. For everything else prefer \`useEffect\`.`
    },
    {
      heading: "14. Practical Hands-On Exercise — Course Enrolment Page with Refs and a Portal Modal",
      content: `Build a small page that combines the main ideas from this lecture. It has:
• A custom \`<TextInput>\` that receives \`ref\` as a prop (React 19 style).
• Validation that **focuses** the first invalid field.
• A **stopwatch-style timer ref** that tracks how long the user took to fill the form (not displayed until submit, so it's a ref).
• A **portal modal** confirming enrolment, closing with Escape and returning focus.
Create a Vite React project (\`npm create vite@latest\`, choose React), replace \`src/App.jsx\` with the code below and run \`npm run dev\`.
**Extend it:** add a \`useImperativeHandle\` to \`TextInput\` that exposes only \`focus()\` and \`shake()\`, and add an FAQ list using `ref` callbacks with cleanup (Section 8) and "jump to" buttons.`,
      codeSnippet: `// src/App.jsx — Lecture 15 exercise
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

function TextInput({ label, error, ref, ...rest }) {
  return (
    <label style={{ display: "block", marginBottom: 14, fontWeight: 600, color: "#0f172a" }}>
      {label}
      <input
        ref={ref}
        {...rest}
        style={{ display: "block", width: "100%", padding: 10, marginTop: 4, borderRadius: 6,
          border: error ? "2px solid #dc2626" : "1px solid #cbd5e1", boxSizing: "border-box" }}
      />
      {error && <span style={{ color: "#dc2626", fontSize: 13, fontWeight: 400 }}>{error}</span>}
    </label>
  );
}

function Modal({ title, onClose, children }) {
  const closeRef = useRef(null);
  useEffect(() => {
    const opener = document.activeElement;
    closeRef.current?.focus();
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      opener?.focus?.();
    };
  }, [onClose]);

  return createPortal(
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,32,87,0.55)",
      display: "grid", placeItems: "center", zIndex: 1000 }}>
      <div role="dialog" aria-modal="true" aria-labelledby="dlg-title" onClick={(e) => e.stopPropagation()}
        style={{ background: "#fff", padding: 24, borderRadius: 12, width: "90%", maxWidth: 400 }}>
        <h2 id="dlg-title" style={{ color: "#002057", marginTop: 0 }}>{title}</h2>
        {children}
        <button ref={closeRef} onClick={onClose}
          style={{ background: "#2506ad", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 6 }}>
          Close
        </button>
      </div>
    </div>,
    document.body
  );
}

export default function App() {
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);
  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const startedAtRef = useRef(null);  // when the user first typed

  function handleFirstInput() {
    if (startedAtRef.current === null) startedAtRef.current = Date.now();
  }

  function handleSubmit(e) {
    e.preventDefault();
    const name = nameRef.current.value.trim();
    const phone = phoneRef.current.value.trim();
    const next = {};
    if (name.length < 2) next.name = "Please enter your full name.";
    if (!/^[6-9]\\d{9}$/.test(phone)) next.phone = "Enter a valid 10-digit Indian mobile number.";
    setErrors(next);

    if (next.name) return nameRef.current.focus();
    if (next.phone) return phoneRef.current.focus();

    const seconds = startedAtRef.current ? Math.round((Date.now() - startedAtRef.current) / 1000) : 0;
    setResult({ name, seconds });
    e.target.reset();
    startedAtRef.current = null;
  }

  return (
    <div style={{ maxWidth: 520, margin: "30px auto", padding: 24, fontFamily: "system-ui",
      background: "#fff", border: "1px solid #cbd5e1", borderRadius: 16 }}>
      <h1 style={{ color: "#002057", fontSize: 24 }}>Enrol in the React Course</h1>

      <form onSubmit={handleSubmit} onInput={handleFirstInput} noValidate>
        <TextInput label="Full name" name="name" ref={nameRef} error={errors.name} placeholder="Ananya Sharma" />
        <TextInput label="Mobile number" name="phone" ref={phoneRef} error={errors.phone} placeholder="9876543210" inputMode="numeric" />
        <button type="submit" style={{ background: "#f97316", color: "#fff", border: "none",
          padding: "10px 20px", borderRadius: 6, fontWeight: 700 }}>
          Enrol now
        </button>
      </form>

      {result && (
        <Modal title="You're enrolled!" onClose={() => setResult(null)}>
          <p>Welcome, {result.name}. You completed the form in {result.seconds} seconds.</p>
        </Modal>
      )}
    </div>
  );
}`
    },
    {
      heading: "15. Summary",
      content: `• \`useRef\` returns a persistent \`{ current }\` object; mutating it does **not** re-render. Use it for timer IDs, previous values, controllers, DOM nodes and library instances.
• **State vs ref:** if the screen should change when the value changes, use state; otherwise a ref.
• Don't read or write \`ref.current\` during rendering — use event handlers and effects.
• **DOM refs** let you call browser APIs: \`focus()\`, \`scrollIntoView()\`, \`getBoundingClientRect()\`. \`current\` is \`null\` until the element is committed.
• Scroll after state changes in an effect (or with \`flushSync\` sparingly); measure layout in \`useLayoutEffect\` and track size changes with \`ResizeObserver\`.
• **React 19:** function components receive \`ref\` as a normal prop — \`forwardRef\` is no longer needed.
• **Ref callbacks** handle dynamic lists and can now **return a cleanup function**.
• \`useImperativeHandle\` exposes a small, safe API instead of the raw DOM node.
• \`createPortal\` renders into another DOM node (great for modals, tooltips, toasts) while staying in the React tree for context and event bubbling.
• Integrate non-React libraries by giving them an empty container via a ref, creating the instance in an effect, syncing props in a separate effect, and destroying it in cleanup.
**Next lecture:** Forms in React — Controlled Inputs, Validation & React 19 Form Actions`
    }
  ]
};
