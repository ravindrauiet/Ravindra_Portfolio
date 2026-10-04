export const lecture04 = {
  slug: "lecture-4",
  number: 4,
  title: "Complete Next.js Course — Lecture 4: Loading, Errors, Not Found, Templates & Advanced Routing",
  summary: "Handle every UI state of a route with special files: loading.js and streaming with Suspense, error.js and global-error.js with unstable_retry, not-found.js, template.js vs layout.js, then advanced patterns — parallel routes with slots and default.js, and intercepting routes for modals.",
  readTime: "27 min read",
  difficulty: "Intermediate",
  date: "2026-10-04",
  sections: [
    {
      heading: "1. The Component Hierarchy of a Route Segment",
      content: `Each special file in a segment is wrapped around the next in a fixed order. Understanding this nesting explains every loading and error behaviour you will see:
• **\`layout.js\`** — outermost, persists across navigations.
• **\`template.js\`** — re-mounted on every navigation.
• **\`error.js\`** — a React error boundary around everything below it.
• **\`loading.js\`** — a React \`<Suspense>\` boundary around everything below it.
• **\`not-found.js\`** — rendered when \`notFound()\` is thrown below.
• **\`page.js\`** — the innermost content.
**Consequence:** an \`error.js\` catches errors from \`loading.js\`, \`not-found.js\` and \`page.js\` of its segment and all child segments — but **not** from the \`layout.js\` in the same segment, because the layout sits outside the boundary. To catch layout errors, put \`error.js\` in the parent segment.`,
      codeSnippet: `// What Next.js effectively renders for one segment:
<Layout>
  <Template>
    <ErrorBoundary fallback={<Error />}>
      <Suspense fallback={<Loading />}>
        <NotFoundBoundary fallback={<NotFound />}>
          <Page />
        </NotFoundBoundary>
      </Suspense>
    </ErrorBoundary>
  </Template>
</Layout>`
    },
    {
      heading: "2. loading.js: Instant Loading UI",
      content: `Add a \`loading.js\` file to a folder and Next.js automatically wraps that segment's page in \`<Suspense>\` with your component as the fallback.
What the user experiences:
• Navigation feels **instant** — the shared layout stays and the loading UI appears immediately while the page's data loads on the server.
• The loading UI is **prefetched** together with the layout, so it shows even before the server responds.
• When the page is ready, it **streams in** and replaces the fallback.
Keep loading UIs lightweight: skeletons that match the final layout's shape prevent layout shift and feel faster than spinners.`,
      codeSnippet: `// app/dashboard/loading.js
export default function DashboardLoading() {
  return (
    <div aria-busy="true" aria-label="Loading dashboard">
      <div className="skeleton" style={{ height: 32, width: 240 }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 24 }}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton" style={{ height: 120 }} />
        ))}
      </div>
    </div>
  );
}

/* globals.css
.skeleton {
  border-radius: 12px;
  background: linear-gradient(90deg, #eee 25%, #f5f5f5 50%, #eee 75%);
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite;
}
@keyframes shimmer { to { background-position: -200% 0; } } */`
    },
    {
      heading: "3. Streaming Sections with Manual <Suspense>",
      content: `\`loading.js\` covers a whole page. For finer control, wrap **individual slow components** in \`<Suspense>\` yourself. The page shell and fast components render immediately; each slow part streams in independently as soon as its data is ready.
This is **streaming** — the server sends HTML in chunks over a single response. The user sees useful content in milliseconds even if one widget takes three seconds.
Rule of thumb: put the Suspense boundary **around the component that awaits the slow data**, not around the whole page.`,
      codeSnippet: `// app/dashboard/page.js
import { Suspense } from "react";

async function Revenue() {
  const data = await fetch("https://api.example.com/revenue").then((r) => r.json()); // slow: 2s
  return <p>Revenue: ₹{data.total}</p>;
}

async function LatestOrders() {
  const orders = await fetch("https://api.example.com/orders").then((r) => r.json()); // slow: 3s
  return <ul>{orders.map((o) => <li key={o.id}>{o.customer}</li>)}</ul>;
}

export default function DashboardPage() {
  return (
    <>
      <h1>Dashboard</h1> {/* sent immediately */}
      <Suspense fallback={<p>Loading revenue…</p>}>
        <Revenue />
      </Suspense>
      <Suspense fallback={<p>Loading orders…</p>}>
        <LatestOrders />
      </Suspense>
    </>
  );
}`
    },
    {
      heading: "4. error.js: Recovering from Errors",
      content: `\`error.js\` defines an **error boundary** for a segment. If anything below it throws during rendering (a failed fetch, a bug, a database timeout), the boundary shows your fallback instead of crashing the whole app — the layout and navigation keep working.
Key facts:
• It **must be a Client Component** (\`"use client"\`) because error boundaries rely on client-side React features.
• It receives **\`error\`** — an \`Error\` object. In production, errors from Server Components have their message replaced with a generic one (so secrets never leak) plus an \`error.digest\` hash you can match against your server logs.
• It receives **\`unstable_retry()\`** — re-fetches and re-renders the segment. This is the recommended way to offer "Try again" in current Next.js 16 releases. The older **\`reset()\`** prop still exists; it only clears the error state and re-renders without re-fetching, so prefer \`unstable_retry\`.
• Errors **bubble up** to the nearest parent \`error.js\`, so you can have one generic boundary at the top and specific ones deeper.`,
      codeSnippet: `// app/dashboard/error.js
"use client";

import { useEffect } from "react";

export default function DashboardError({ error, unstable_retry }) {
  useEffect(() => {
    // Send to your error tracking service (Sentry, LogRocket, ...)
    console.error(error);
  }, [error]);

  return (
    <div role="alert">
      <h2>Something went wrong loading your dashboard.</h2>
      {error.digest && <p>Reference: {error.digest}</p>}
      <button onClick={() => unstable_retry()}>Try again</button>
    </div>
  );
}`
    },
    {
      heading: "5. global-error.js: The Last Line of Defense",
      content: `An \`error.js\` in \`app/\` cannot catch errors thrown by the **root layout** itself (the layout is outside the boundary). For that, Next.js provides \`app/global-error.js\`.
Because it **replaces the root layout** when active, it must define its own \`<html>\` and \`<body>\` tags. It's also a Client Component. It only appears in production — in development you'll see the error overlay instead.
Keep it extremely simple and dependency-free: if your root layout crashed, your shared components might be broken too.`,
      codeSnippet: `// app/global-error.js
"use client";

export default function GlobalError({ error, unstable_retry }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui", padding: 40 }}>
        <h1>Sorry — the site hit an unexpected error.</h1>
        <p>Our team has been notified.</p>
        <button onClick={() => unstable_retry()}>Reload</button>
      </body>
    </html>
  );
}`
    },
    {
      heading: "6. Expected Errors vs. Uncaught Exceptions",
      content: `Not every problem should throw. Next.js distinguishes two kinds:
• **Expected errors** — validation failures, "email already taken", "out of stock". These are part of normal app flow. **Return** them as values (e.g. from a Server Action with \`useActionState\`, Lecture 8) and render a message. Don't throw.
• **Uncaught exceptions** — bugs and outages you didn't anticipate. Let them throw and be caught by \`error.js\`.
• **Not found** — call \`notFound()\` (section 7).
This separation keeps error boundaries for truly exceptional situations and gives users precise feedback for normal mistakes.`
    },
    {
      heading: "7. not-found.js & the 404 Experience",
      content: `\`not-found.js\` renders when \`notFound()\` is called in a segment, and \`app/not-found.js\` also handles **any URL that matches no route** in the whole app.
• It returns a **404 status** for streamed responses too (a \`noindex\` meta tag is added when the status can't be changed).
• It can be a Server Component and fetch data — e.g. suggest popular posts.
• Place segment-level versions for contextual messages: \`app/shop/not-found.js\` for missing products.`,
      codeSnippet: `// app/not-found.js — site-wide 404
import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ textAlign: "center", padding: "6rem 1rem" }}>
      <h1>404 — Page not found</h1>
      <p>The page you're looking for doesn't exist or has moved.</p>
      <Link href="/">Back to home</Link>
    </main>
  );
}`
    },
    {
      heading: "8. forbidden() and unauthorized() (Experimental)",
      content: `Next.js 16 includes two experimental helpers for auth-related responses, similar to \`notFound()\`:
• **\`forbidden()\`** — renders \`forbidden.js\` with a **403** status (user is logged in but not allowed).
• **\`unauthorized()\`** — renders \`unauthorized.js\` with a **401** status (user must log in).
Enable them with \`experimental.authInterrupts: true\` in \`next.config.js\`. Because they are experimental, their API may change — for production apps many teams still use \`redirect("/login")\` for unauthenticated users.`,
      codeSnippet: `// next.config.mjs
const nextConfig = { experimental: { authInterrupts: true } };
export default nextConfig;

// app/admin/page.js
import { forbidden } from "next/navigation";
import { verifySession } from "@/lib/dal";

export default async function AdminPage() {
  const session = await verifySession();
  if (session.role !== "admin") forbidden(); // renders app/forbidden.js (403)
  return <h1>Admin panel</h1>;
}`
    },
    {
      heading: "9. template.js vs. layout.js",
      content: `\`template.js\` wraps children exactly like a layout, but it **re-mounts on every navigation** — a fresh instance is created, state is reset and effects run again.
Use a template when you specifically want that reset:
• **Enter animations** on every page change.
• **Per-page analytics** effects (\`useEffect\` that logs a page view).
• **Forms or widgets** that must start empty on each route.
For everything else use a layout — preserving state is usually what users want.`,
      codeSnippet: `// app/blog/template.js — fades in each blog page on navigation
"use client";
import { useEffect } from "react";

export default function BlogTemplate({ children }) {
  useEffect(() => {
    // Runs on every navigation between blog pages
    console.log("blog page viewed", window.location.pathname);
  }, []);

  return <div className="fade-in">{children}</div>;
}`
    },
    {
      heading: "10. Parallel Routes: Multiple Pages in One Layout",
      content: `**Parallel routes** render two or more pages **simultaneously** in the same layout, each with its own loading and error states. Create them with **slots**: folders prefixed with \`@\`, like \`@analytics\` and \`@team\`.
• Each slot is passed to the parent layout as a **prop** with the same name (\`analytics\`, \`team\`), alongside \`children\`.
• Slots are **not** URL segments — \`app/@analytics/page.js\` doesn't change the URL.
• Each slot can have its own \`loading.js\` and \`error.js\`, so one slow or broken widget never blocks the others.
• Great for dashboards, split views and conditional UI (show \`@admin\` or \`@user\` based on role).`,
      codeSnippet: `app/dashboard/
├── layout.js
├── page.js                  # → children
├── @analytics/
│   ├── page.js              # → analytics prop
│   ├── loading.js
│   └── default.js           # required in Next.js 16
└── @team/
    ├── page.js              # → team prop
    └── default.js

// app/dashboard/layout.js
export default function DashboardLayout({ children, analytics, team }) {
  return (
    <>
      {children}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {analytics}
        {team}
      </div>
    </>
  );
}`
    },
    {
      heading: "11. default.js: Required for Every Slot in Next.js 16",
      content: `When you navigate to a sub-route that a slot doesn't have, Next.js needs to know what to show in that slot.
• On **client-side navigation**, Next.js keeps showing the slot's previously active page (soft navigation).
• On a **hard load or refresh**, it can't recover that state, so it renders the slot's **\`default.js\`**.
**Breaking change in Next.js 16:** every parallel route slot **must** have an explicit \`default.js\` — builds fail without one. To keep the old behaviour, return \`null\` or call \`notFound()\`.`,
      codeSnippet: `// app/dashboard/@analytics/default.js — render nothing when unmatched
export default function Default() {
  return null;
}

// Or show a 404 for unmatched slot routes
import { notFound } from "next/navigation";
export default function Default() {
  notFound();
}`
    },
    {
      heading: "12. Intercepting Routes: Show a Route in a Modal",
      content: `**Intercepting routes** let you load a route **inside the current layout** during client-side navigation, while the real URL still works on its own. The classic example: clicking a photo in a feed opens it in a **modal** with the URL \`/photo/123\`; refreshing or sharing that URL shows the full photo page.
Conventions (based on **route segments**, not the file system):
• **\`(.)folder\`** — intercept a segment at the **same** level.
• **\`(..)folder\`** — one level **above**.
• **\`(..)(..)folder\`** — two levels above.
• **\`(...)folder\`** — from the **root** \`app\` directory.
Intercepting routes are almost always combined with a **parallel route slot** (\`@modal\`) so the modal renders on top of the current page.`
    },
    {
      heading: "13. Practical: Photo Gallery with a Modal",
      content: `This is the complete modal pattern. Clicking a thumbnail opens \`/photo/[id]\` in a modal over the gallery; closing it goes back; refreshing \`/photo/3\` renders the standalone page.
Files involved:
• \`app/@modal/(.)photo/[id]/page.js\` — the intercepted (modal) version.
• \`app/photo/[id]/page.js\` — the real, full page for direct visits.
• \`app/@modal/default.js\` — renders nothing when no modal is open.
• \`app/layout.js\` — renders \`{modal}\` next to \`{children}\`.`,
      codeSnippet: `// app/layout.js
export default function RootLayout({ children, modal }) {
  return (
    <html lang="en">
      <body>
        {children}
        {modal}
      </body>
    </html>
  );
}

// app/@modal/default.js
export default function Default() {
  return null;
}

// app/page.js — gallery
import Link from "next/link";
export default function Gallery() {
  return [1, 2, 3, 4].map((id) => (
    <Link key={id} href={"/photo/" + id}>
      <img src={"/photos/" + id + ".jpg"} alt={"Photo " + id} width={200} />
    </Link>
  ));
}

// app/@modal/(.)photo/[id]/page.js — modal version
import Modal from "@/components/Modal";
export default async function PhotoModal({ params }) {
  const { id } = await params;
  return (
    <Modal>
      <img src={"/photos/" + id + ".jpg"} alt={"Photo " + id} />
    </Modal>
  );
}

// components/Modal.jsx
"use client";
import { useRouter } from "next/navigation";
export default function Modal({ children }) {
  const router = useRouter();
  return (
    <div className="backdrop" onClick={() => router.back()}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}

// app/photo/[id]/page.js — full page on refresh / direct visit
export default async function PhotoPage({ params }) {
  const { id } = await params;
  return <img src={"/photos/" + id + ".jpg"} alt={"Photo " + id} style={{ width: "100%" }} />;
}`
    },
    {
      heading: "14. Summary",
      content: `• Special files nest in a fixed order: layout → template → error → loading → not-found → page.
• \`loading.js\` gives instant loading UI; manual \`<Suspense>\` boundaries stream slow sections independently.
• \`error.js\` (Client Component) catches render errors below it; use \`unstable_retry()\` for "Try again". \`global-error.js\` covers the root layout and must render \`<html>\`/\`<body>\`.
• Return expected errors as values; throw only for unexpected failures.
• \`not-found.js\` handles \`notFound()\` and unknown URLs with a 404.
• \`template.js\` re-mounts on every navigation; layouts persist.
• Parallel routes (\`@slot\`) render multiple pages at once and need \`default.js\` in Next.js 16. Intercepting routes (\`(.)\`, \`(..)\`, \`(...)\`) power modals with shareable URLs.
**Next lecture:** Server Components vs. Client Components — the most important architectural concept in modern Next.js.`
    }
  ]
};
