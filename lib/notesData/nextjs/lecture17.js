export const lecture17 = {
  slug: "lecture-17",
  number: 17,
  title: "Complete Next.js Course — Lecture 17: View Transitions, Activity & React 19.2 Features",
  summary: "Add polished, app-like motion and state handling: the browser View Transitions API, enabling React's <ViewTransition> in Next.js 16, shared-element morphs, animated Suspense reveals, directional navigation with Link transitionTypes, reduced-motion accessibility, React 19.2's <Activity> and useEffectEvent, and how Next.js 16 preserves page state with Activity when Cache Components is enabled.",
  readTime: "27 min read",
  difficulty: "Advanced",
  date: "2026-10-08",
  sections: [
    {
      heading: "1. Why Motion Matters in Navigation",
      content: `Without animation, a click on a thumbnail makes the grid **vanish** and a detail page **appear**. The user's brain has to re-orient: where am I, how did I get here, how do I go back?
Good motion design answers those questions:
• **Continuity** — a thumbnail that grows into the hero image shows the two pages are connected.
• **Direction** — sliding left for "forward" and right for "back" builds a mental map of the app.
• **Hierarchy** — content sliding up communicates arrival; a skeleton sliding down communicates it's being replaced.
Native mobile apps have done this for years. The **View Transitions API** brings it to the web, and React and Next.js 16 make it declarative.
**Rule of thumb:** motion should **explain**, not decorate. Keep it short (150–400ms) and always respect users who prefer reduced motion.`
    },
    {
      heading: "2. The Browser View Transitions API",
      content: `The View Transitions API is a web standard. When a transition starts, the browser:
1. Takes a **snapshot** of the current page (the "old" state).
2. Lets your code update the DOM.
3. Takes a snapshot of the **new** state.
4. Animates between them using special pseudo-elements you can style with CSS:
• \`::view-transition-old(name)\` — the outgoing snapshot.
• \`::view-transition-new(name)\` — the incoming snapshot.
• \`::view-transition-group(name)\` — the container that animates size and position between them.
• \`::view-transition-image-pair(name)\` — wraps old and new for blending.
Elements with the **same \`view-transition-name\`** in the old and new state are treated as the same element and **morph** between their positions and sizes — that's the "shared element" effect.
In plain JavaScript you'd call \`document.startViewTransition(() => updateDom())\`. In React and Next.js you don't call it yourself — the \`<ViewTransition>\` component does it for you at the right moment.`
    },
    {
      heading: "3. Enabling View Transitions in Next.js 16",
      content: `Two pieces work together:
• React's **\`<ViewTransition>\`** component, imported from \`react\`. The App Router runs on React **canary** releases, which include it — no extra install needed.
• Next.js's **\`experimental.viewTransition\`** flag, which integrates it with the router so **route navigations** trigger transitions.
**When do animations run?** \`<ViewTransition>\` animates only when updates happen inside a React **Transition** (\`startTransition\`, which Next.js uses for navigations), a **\`<Suspense>\`** reveal, or **\`useDeferredValue\`**. A plain \`setState\` doesn't animate — that's deliberate, so ordinary interactions stay instant.
Both the flag and the component are **experimental** — the API may change between releases, so pin your versions and test after upgrades.`,
      codeSnippet: `// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    viewTransition: true,
  },
};

export default nextConfig;

// Any component
import { ViewTransition } from "react";`
    },
    {
      heading: "4. Shared Element Morph: Thumbnail → Hero",
      content: `The most impressive effect needs the least code. Wrap the thumbnail on the grid page **and** the large image on the detail page in \`<ViewTransition>\` with the **same \`name\`**. When the user navigates, the browser morphs one into the other.
Names must be **unique on the page at any moment** — include the item ID (\`photo-42\`), otherwise two elements claim the same name and the transition is skipped.
No CSS is required for the default morph.`,
      codeSnippet: `// components/PhotoGrid.jsx
import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";

export default function PhotoGrid({ photos }) {
  return (
    <div className="grid">
      {photos.map((photo) => (
        <Link key={photo.id} href={"/photo/" + photo.id}>
          <ViewTransition name={"photo-" + photo.id}>
            <Image src={photo.src} alt={photo.alt} width={300} height={200} />
          </ViewTransition>
        </Link>
      ))}
    </div>
  );
}

// app/photo/[id]/PhotoHero.jsx
import Image from "next/image";
import { ViewTransition } from "react";

export default function PhotoHero({ photo }) {
  return (
    <ViewTransition name={"photo-" + photo.id}>
      <Image src={photo.src} alt={photo.alt} width={1200} height={800} preload />
    </ViewTransition>
  );
}`
    },
    {
      heading: "5. Customizing Animations with Classes",
      content: `\`<ViewTransition>\` props assign **CSS class names** to the transition, which you target with the pseudo-elements:
• **\`share\`** — class for shared-element morphs (\`share="morph"\`).
• **\`enter\`** — class when the element appears.
• **\`exit\`** — class when it disappears.
• **\`update\`** — class when its content changes in place.
• **\`default\`** — class for any other transition; \`default="none"\` disables animation for unrelated transitions, so one component doesn't animate every time something else on the page changes.
Then write normal CSS animations on \`::view-transition-old(.className)\`, \`::view-transition-new(.className)\` and \`::view-transition-group(.className)\`.`,
      codeSnippet: `<ViewTransition name={"photo-" + photo.id} share="morph">
  <Image src={photo.src} alt={photo.alt} width={1200} height={800} />
</ViewTransition>

/* app/globals.css — a slightly slower, softer morph */
::view-transition-group(.morph) {
  animation-duration: 400ms;
  animation-timing-function: cubic-bezier(0.2, 0.7, 0.2, 1);
}
::view-transition-image-pair(.morph) {
  isolation: isolate;
}`
    },
    {
      heading: "6. Animating Suspense Reveals",
      content: `Streaming (Lecture 6) swaps a skeleton for real content. Without motion, that swap is an abrupt pop. Wrap the **fallback** in a \`<ViewTransition>\` with an **exit** animation and the **content** in one with an **enter** animation: the skeleton slides down and fades out, then the content slides up and fades in.
Add \`default="none"\` on the content so it doesn't also animate during unrelated transitions like the shared morph.`,
      codeSnippet: `// app/photo/[id]/page.js
import { Suspense, ViewTransition } from "react";
import PhotoContent from "./PhotoContent";
import PhotoSkeleton from "./PhotoSkeleton";

export default async function PhotoPage({ params }) {
  const { id } = await params;
  return (
    <Suspense
      fallback={
        <ViewTransition exit="slide-down">
          <PhotoSkeleton />
        </ViewTransition>
      }
    >
      <ViewTransition enter="slide-up" default="none">
        <PhotoContent id={id} />
      </ViewTransition>
    </Suspense>
  );
}

/* app/globals.css */
::view-transition-old(.slide-down) {
  animation: 150ms ease-out both fade reverse, 150ms ease-out both slide-y reverse;
}
::view-transition-new(.slide-up) {
  animation: 210ms ease-in 150ms both fade, 400ms ease-in both slide-y;
}
@keyframes fade {
  from { filter: blur(3px); opacity: 0; }
  to { filter: blur(0); opacity: 1; }
}
@keyframes slide-y {
  from { transform: translateY(10px); }
  to { transform: translateY(0); }
}`
    },
    {
      heading: "7. Directional Navigation with Link transitionTypes",
      content: `To slide pages **left when going forward** and **right when going back**, tag navigations with a **transition type**. Next.js 16.2 added the \`transitionTypes\` prop on \`<Link>\`.
Then give the page's \`<ViewTransition>\` an \`enter\`/\`exit\` **map** from transition type to CSS class. When a navigation carries \`nav-forward\`, the \`nav-forward\` class is applied; otherwise \`default\` applies (here \`"none"\`).
You can also add types programmatically inside \`startTransition\` with React's \`addTransitionType()\`.`,
      codeSnippet: `// Forward link (grid → detail)
<Link href={"/photo/" + photo.id} transitionTypes={["nav-forward"]}>…</Link>

// Back link (detail → grid)
<Link href="/" transitionTypes={["nav-back"]}>← Gallery</Link>

// Page wrapper
<ViewTransition
  enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
  exit={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
  default="none"
>
  {children}
</ViewTransition>

/* app/globals.css */
::view-transition-old(.nav-forward) { --slide-offset: -60px; animation: 150ms ease-in both fade reverse, 400ms ease-in-out both slide reverse; }
::view-transition-new(.nav-forward) { --slide-offset: 60px;  animation: 210ms ease-out 150ms both fade, 400ms ease-in-out both slide; }
::view-transition-old(.nav-back)    { --slide-offset: 60px;  animation: 150ms ease-in both fade reverse, 400ms ease-in-out both slide reverse; }
::view-transition-new(.nav-back)    { --slide-offset: -60px; animation: 210ms ease-out 150ms both fade, 400ms ease-in-out both slide; }
@keyframes slide {
  from { translate: var(--slide-offset); }
  to { translate: 0; }
}`
    },
    {
      heading: "8. Accessibility: Respect Reduced Motion",
      content: `Large movements — especially **horizontal slides** across the viewport — can cause dizziness and nausea for people with vestibular disorders. Operating systems let users request reduced motion, exposed to CSS as \`prefers-reduced-motion: reduce\`.
**Minimum:** disable view transition animations when the user asks for reduced motion — content then swaps instantly, the browser default.
**Better:** keep gentle **opacity crossfades** (low risk) and remove **positional** movement (slides, big morphs).
Also: never put essential information only in an animation, keep durations short, and never auto-play long or looping motion.`,
      codeSnippet: `/* app/globals.css — simplest: turn view transition animations off */
@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(*),
  ::view-transition-new(*),
  ::view-transition-group(*) {
    animation-duration: 0s !important;
    animation-delay: 0s !important;
  }
}

/* Refined alternative: keep the fade, drop the slide */
@media (prefers-reduced-motion: reduce) {
  ::view-transition-new(.nav-forward),
  ::view-transition-new(.nav-back) {
    animation: 200ms ease-out both fade;
  }
  ::view-transition-old(.nav-forward),
  ::view-transition-old(.nav-back) {
    animation: 150ms ease-in both fade reverse;
  }
}`
    },
    {
      heading: "9. React 19.2: The <Activity> Component",
      content: `\`<Activity mode="visible" | "hidden">\` (stable in React 19.2) lets you **hide** part of the UI **without unmounting it**.
When \`mode="hidden"\`:
• The children are hidden with \`display: none\` — the **DOM stays** in the document.
• **React state is preserved** — inputs keep their values, scroll positions survive, a half-filled form is still there when it becomes visible again.
• **Effects are cleaned up** (subscriptions, timers stop), and re-created when visible again.
• Hidden content renders at **lower priority**, so it doesn't slow down what the user is looking at — you can even **pre-render** a tab the user is likely to open next.
Compared with conditional rendering (\`{tab === "a" && <A />}\`), which destroys state every time you switch, Activity gives you tab-switching that feels instant and never loses work.`,
      codeSnippet: `"use client";
import { Activity, useState } from "react";

export default function SettingsTabs() {
  const [tab, setTab] = useState("profile");

  return (
    <>
      <div role="tablist">
        <button role="tab" aria-selected={tab === "profile"} onClick={() => setTab("profile")}>Profile</button>
        <button role="tab" aria-selected={tab === "billing"} onClick={() => setTab("billing")}>Billing</button>
      </div>

      {/* Both stay mounted; the hidden one keeps its form state */}
      <Activity mode={tab === "profile" ? "visible" : "hidden"}>
        <ProfileForm />
      </Activity>
      <Activity mode={tab === "billing" ? "visible" : "hidden"}>
        <BillingForm />
      </Activity>
    </>
  );
}`
    },
    {
      heading: "10. How Next.js 16 Preserves Page State with Activity",
      content: `With **Cache Components enabled**, Next.js uses \`<Activity>\` for routing: when you navigate away from a page, it is **hidden instead of unmounted**. Navigate back, and the page reappears exactly as you left it — form inputs, expanded accordions, scroll position inside panels, results of previous actions.
This is usually what users want — but some state is **transient** and shouldn't survive: an open dropdown, a dialog, a "Saved!" success message, a form you already submitted.
**How to reset what shouldn't persist:** because Activity **runs effect cleanups when a page is hidden**, put the reset in a cleanup. Use \`useLayoutEffect\` so it runs synchronously before hiding, avoiding a flash of stale UI when the page is shown again.
Also reset form state **in the event handler** after a successful submit, rather than relying on unmounting.`,
      codeSnippet: `"use client";
import { useLayoutEffect, useState } from "react";

export function SettingsDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  // Close the dropdown when Activity hides this page
  useLayoutEffect(() => {
    return () => setIsOpen(false);
  }, []);

  return (
    <div>
      <button onClick={() => setIsOpen((o) => !o)}>Options</button>
      {isOpen && (
        <ul>
          <li><button>Edit profile</button></li>
          <li><button>Sign out</button></li>
        </ul>
      )}
    </div>
  );
}

// Reset a create-form after success instead of relying on unmount
async function handleSubmit(formData) {
  const result = await createItem(formData);
  if (result.ok) {
    formRef.current?.reset();
    router.push("/items/" + result.id);
  }
}`
    },
    {
      heading: "11. React 19.2: useEffectEvent",
      content: `A classic Effect problem: you want an Effect to **re-run only when some values change**, but it also needs to **read other values** that change often. Adding those to the dependency array causes unnecessary re-runs; leaving them out causes stale values and lint warnings.
\`useEffectEvent\` (stable in React 19.2) extracts the "event-like" part of an Effect into a function that **always sees the latest props and state** but is **not reactive** — it doesn't need to be a dependency.
**Example:** a chat room should reconnect when \`roomId\` changes, not when \`theme\` changes — but the "connected" notification should use the current theme.
Rules: only call Effect Events **from inside Effects**; don't pass them to other components or call them during render.`,
      codeSnippet: `"use client";
import { useEffect, useEffectEvent } from "react";

export default function ChatRoom({ roomId, theme }) {
  // Always reads the latest theme, but doesn't make the Effect re-run
  const onConnected = useEffectEvent(() => {
    showNotification("Connected to " + roomId, theme);
  });

  useEffect(() => {
    const connection = createConnection(roomId);
    connection.on("connected", () => onConnected());
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ theme is not a dependency — no reconnect when the theme changes

  return <h2>Welcome to {roomId}</h2>;
}`
    },
    {
      heading: "12. Other Modern React Features You'll Use in Next.js",
      content: `Next.js 16's App Router runs on React 19.2 (canary), so these features are available everywhere:
• **Actions** — functions passed to \`<form action>\` and used with \`useTransition\`, handling pending state and errors (Lecture 8).
• **\`useActionState\`**, **\`useFormStatus\`**, **\`useOptimistic\`** — form state, submit status and optimistic UI (Lecture 8).
• **\`use()\`** — read a Promise or Context during render, even conditionally (Lecture 6).
• **\`ref\` as a regular prop** — function components receive \`ref\` directly; \`forwardRef\` is no longer needed for new code.
• **\`<Context>\` as a provider** — render \`<ThemeContext value={...}>\` instead of \`<ThemeContext.Provider>\`.
• **Cleanup functions for ref callbacks** — return a function from a ref callback to clean up.
• **React Compiler** — automatic memoization, enabled with \`reactCompiler: true\` in Next.js 16 (Lecture 13).`,
      codeSnippet: `"use client";
import { createContext, use } from "react";

const ThemeContext = createContext("light");

// ref is just a prop now — no forwardRef
function TextInput({ ref, ...props }) {
  return <input ref={ref} {...props} />;
}

// Context can be rendered directly as a provider
export function App({ children }) {
  return <ThemeContext value="dark">{children}</ThemeContext>;
}

// use() can read context conditionally
function Banner({ show }) {
  if (!show) return null;
  const theme = use(ThemeContext);
  return <div data-theme={theme}>Hello</div>;
}`
    },
    {
      heading: "13. Practical: An Animated Photo Gallery",
      content: `Combine everything in a gallery that feels like a native app:
• Thumbnails **morph** into the detail hero (shared \`name\`).
• Forward navigation **slides left**, back navigation **slides right** (\`transitionTypes\`).
• The detail page's info panel **streams in** with a slide-up reveal (Suspense + enter/exit).
• A details/comments **tab switcher** keeps state with \`<Activity>\`.
• Everything respects **\`prefers-reduced-motion\`**.
Build it, then test with DevTools → Rendering → "Emulate CSS prefers-reduced-motion" to confirm the reduced-motion path works.`,
      codeSnippet: `next.config.mjs                 // experimental.viewTransition: true
app/globals.css                 // .morph, .slide-up/.slide-down, .nav-forward/.nav-back, reduced-motion rules
app/page.js                     // <PhotoGrid> with <ViewTransition name="photo-ID"> + Link transitionTypes={["nav-forward"]}
app/photo/[id]/page.js          // page <ViewTransition> enter/exit maps + Suspense reveal
app/photo/[id]/PhotoHero.jsx    // <ViewTransition name="photo-ID" share="morph">
app/photo/[id]/InfoTabs.jsx     // "use client" — <Activity> for Details / Comments tabs
app/photo/[id]/BackLink.jsx     // <Link href="/" transitionTypes={["nav-back"]}>`
    },
    {
      heading: "14. Summary",
      content: `• The View Transitions API snapshots old and new UI and animates between them; matching names create shared-element morphs.
• Enable \`experimental.viewTransition\` and import \`<ViewTransition>\` from \`react\`. Animations run for Transitions (including navigations), Suspense reveals and \`useDeferredValue\` — not plain \`setState\`.
• Use \`name\` for morphs, \`share\`/\`enter\`/\`exit\`/\`update\` to assign CSS classes, and \`default="none"\` to avoid unwanted animations.
• Animate streaming with exit on the fallback and enter on the content.
• Tag navigations with \`<Link transitionTypes>\` (Next.js 16.2+) and map types to classes for directional motion.
• Always handle \`prefers-reduced-motion\`.
• \`<Activity>\` hides UI while preserving state and cleaning up effects; with Cache Components, Next.js 16 uses it so pages keep their state across navigations — reset transient state in \`useLayoutEffect\` cleanups.
• \`useEffectEvent\` reads the latest values inside Effects without making them dependencies.
**Next lecture:** static exports, single-page apps and Progressive Web Apps — running Next.js without a server and installing it like a native app.`
    }
  ]
};
