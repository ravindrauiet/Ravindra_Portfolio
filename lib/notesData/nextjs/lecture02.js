export const lecture02 = {
  slug: "lecture-2",
  number: 2,
  title: "Complete Next.js Course — Lecture 2: Routing Fundamentals — Pages, Layouts, Linking & Navigation",
  summary: "Master the App Router's file-system routing: pages, nested routes, root and nested layouts, the Link component and prefetching, active links, programmatic navigation with useRouter, server redirects, route groups, private folders and how client-side navigation works under the hood.",
  readTime: "26 min read",
  difficulty: "Beginner",
  date: "2026-10-04",
  sections: [
    {
      heading: "1. File-System Routing: Folders Are Routes",
      content: `In the App Router you never write a route table. The **folder structure inside \`app/\` is the route table**.
• Each **folder** represents a **route segment** that maps to a part of the URL.
• A folder becomes publicly accessible **only when it contains a \`page.js\`** file.
• Nested folders create nested URLs: \`app/blog/latest/page.js\` → \`/blog/latest\`.
• Files that are not special (\`Button.jsx\`, \`utils.js\`, \`styles.module.css\`) can live next to pages without becoming routes — this is called **colocation**.
**Mental model:** URL path = folder path. If you can read the folder tree, you can read the site map.`,
      codeSnippet: `app/
├── page.js                  →  /
├── about/
│   └── page.js              →  /about
├── blog/
│   ├── page.js              →  /blog
│   ├── PostCard.jsx         ✗  not a route (colocated component)
│   └── latest/
│       └── page.js          →  /blog/latest
└── dashboard/
    ├── settings/
    │   └── page.js          →  /dashboard/settings
    └── (no page.js here)    ✗  /dashboard returns 404`
    },
    {
      heading: "2. Creating Pages",
      content: `A page is the default export of a \`page.js\` file. It is a **Server Component** by default, which means:
• It can be an \`async\` function and \`await\` data directly.
• Its code never ships to the browser — only the resulting HTML / RSC payload.
• It cannot use \`useState\`, \`useEffect\` or event handlers (put those in Client Components — Lecture 5).
Pages receive two props, both **Promises** in Next.js 16: \`params\` (dynamic segments, Lecture 3) and \`searchParams\` (the query string).`,
      codeSnippet: `// app/blog/page.js  →  /blog
export const metadata = { title: "Blog" };

export default async function BlogPage({ searchParams }) {
  const { page = "1" } = await searchParams; // /blog?page=2
  const res = await fetch("https://jsonplaceholder.typicode.com/posts?_page=" + page);
  const posts = await res.json();

  return (
    <section>
      <h1>Blog — page {page}</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </section>
  );
}`
    },
    {
      heading: "3. Layouts: Shared UI That Persists",
      content: `A **layout** is UI shared by a segment and all of its children. It receives the active child page (or nested layout) through the \`children\` prop.
Why layouts matter:
• **They don't re-render on navigation.** Moving from \`/dashboard/settings\` to \`/dashboard/billing\` keeps the dashboard sidebar mounted — its state, scroll position and any open dropdowns survive.
• **They nest automatically.** \`app/layout.js\` wraps \`app/dashboard/layout.js\`, which wraps the dashboard pages.
• **They can fetch data** just like pages, because they are Server Components by default.
**The root layout** (\`app/layout.js\`) is mandatory and must include \`<html>\` and \`<body>\` tags — Next.js does not add them for you.`,
      codeSnippet: `// app/dashboard/layout.js — wraps every /dashboard/* page
import Link from "next/link";

export default function DashboardLayout({ children }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "2rem" }}>
      <aside>
        <h2>Dashboard</h2>
        <nav style={{ display: "grid", gap: "0.5rem" }}>
          <Link href="/dashboard">Overview</Link>
          <Link href="/dashboard/settings">Settings</Link>
          <Link href="/dashboard/billing">Billing</Link>
        </nav>
      </aside>
      <section>{children}</section>
    </div>
  );
}

// Rendered tree for /dashboard/settings:
// <RootLayout>
//   <DashboardLayout>
//     <SettingsPage />
//   </DashboardLayout>
// </RootLayout>`
    },
    {
      heading: "4. Layout Rules & Gotchas",
      content: `Layouts are powerful, but they have deliberate limits:
• **Layouts do not receive \`searchParams\`.** Because a layout is not re-rendered on navigation, its query string could become stale. Read search params in the page, or with \`useSearchParams()\` in a Client Component.
• **Layouts can't access the current pathname** on the server for the same reason. Use \`usePathname()\` in a Client Component for active-link styling.
• **Layouts receive \`params\`** for the segments above and including themselves (as a Promise).
• **You cannot pass data from a layout to its children via props.** Instead, fetch the same data in both places — identical \`fetch\` calls are deduplicated automatically, and you can wrap DB calls in React \`cache()\` (Lecture 6).
• **Multiple root layouts** are possible with route groups (section 10), e.g. a marketing site and an app with completely different \`<html>\` shells.`
    },
    {
      heading: "5. Linking Between Pages with <Link>",
      content: `\`<Link>\` from \`next/link\` extends the HTML \`<a>\` tag with **client-side navigation** and **prefetching**. Clicking a Link swaps only the parts of the page that changed — no full reload, layouts keep their state.
Useful props:
• **\`href\`** — a string (\`"/blog"\`) or an object (\`{ pathname: "/blog", query: { page: 2 } }\`).
• **\`replace\`** — replace the current history entry instead of pushing a new one.
• **\`scroll={false}\`** — keep the scroll position instead of scrolling to the top.
• **\`prefetch\`** — \`"auto"\`/\`null\` by default; \`true\` prefetches the full route; \`false\` disables prefetching (useful for huge lists of links).
**Prefetching** happens in production when a Link enters the viewport. For static routes the whole route is prefetched; for dynamic routes only the shared layout down to the first loading boundary. By the time the user clicks, the next page is usually already in the browser.
Use a plain \`<a>\` only for external URLs and downloads.`,
      codeSnippet: `import Link from "next/link";

export default function Links() {
  return (
    <nav>
      <Link href="/about">About</Link>

      {/* Object href → /blog?page=2 */}
      <Link href={{ pathname: "/blog", query: { page: 2 } }}>Next page</Link>

      {/* Don't add a history entry (e.g. tabs, filters) */}
      <Link href="/dashboard/settings?tab=billing" replace>Billing tab</Link>

      {/* Keep scroll position */}
      <Link href="#comments" scroll={false}>Jump to comments</Link>

      {/* Turn off prefetching for rarely visited links */}
      <Link href="/legal/terms" prefetch={false}>Terms</Link>

      {/* External links stay as normal anchors */}
      <a href="https://nextjs.org" target="_blank" rel="noreferrer">Docs</a>
    </nav>
  );
}`
    },
    {
      heading: "6. Active Links with usePathname",
      content: `To highlight the current page in a navbar you need the current URL, which is only available on the client. Create a small **Client Component** with \`"use client"\` and the \`usePathname()\` hook from \`next/navigation\`.
Keep this component small — only the nav links become client JavaScript; the rest of the layout stays a Server Component.`,
      codeSnippet: `// components/NavLink.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({ href, children }) {
  const pathname = usePathname();
  // Exact match for "/", prefix match for sections like /blog/*
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      style={{ fontWeight: isActive ? 700 : 400, color: isActive ? "#2506ad" : "inherit" }}
    >
      {children}
    </Link>
  );
}

// app/layout.js (still a Server Component)
// <NavLink href="/">Home</NavLink>
// <NavLink href="/blog">Blog</NavLink>`
    },
    {
      heading: "7. Showing Pending Navigation with useLinkStatus",
      content: `On slow networks a click may take a moment before the next route renders. \`useLinkStatus()\` (from \`next/link\`) tells a component rendered **inside** a \`<Link>\` whether that link's navigation is pending, so you can show a subtle spinner.
It only works in a Client Component that is a descendant of \`<Link>\`. Prefer \`loading.js\` (Lecture 4) for page-level loading states and use this for small inline hints.`,
      codeSnippet: `// components/LinkHint.jsx
"use client";
import { useLinkStatus } from "next/link";

export default function LinkHint() {
  const { pending } = useLinkStatus();
  return pending ? <span className="spinner" aria-label="Loading" /> : null;
}

// Usage inside any Link
// <Link href="/reports">
//   Reports <LinkHint />
// </Link>`
    },
    {
      heading: "8. Programmatic Navigation with useRouter",
      content: `Sometimes navigation must happen in code — after a button click, a successful login, or a keyboard shortcut. Use \`useRouter()\` from **\`next/navigation\`** (not \`next/router\`, which is the old Pages Router API) inside a Client Component.
Methods:
• **\`router.push(href)\`** — navigate and add a history entry.
• **\`router.replace(href)\`** — navigate without adding a history entry.
• **\`router.back()\` / \`router.forward()\`** — browser history.
• **\`router.refresh()\`** — re-fetch Server Components for the current route **without losing client state** (great after a mutation).
• **\`router.prefetch(href)\`** — manually prefetch a route.
Prefer \`<Link>\` whenever the user clicks something that looks like a link — it is accessible, prefetches, and works without JavaScript.`,
      codeSnippet: `"use client";
import { useRouter } from "next/navigation";

export default function CheckoutButton({ cartId }) {
  const router = useRouter();

  async function handleCheckout() {
    const res = await fetch("/api/checkout", {
      method: "POST",
      body: JSON.stringify({ cartId }),
    });
    if (res.ok) {
      router.push("/order/success");
    } else {
      router.refresh(); // re-render server data (e.g. updated stock)
    }
  }

  return <button onClick={handleCheckout}>Checkout</button>;
}`
    },
    {
      heading: "9. Redirecting on the Server",
      content: `Next.js offers several redirect tools — pick based on **where** the decision is made:
• **\`redirect(path)\`** from \`next/navigation\` — use in Server Components, Server Actions and Route Handlers. Returns a 307 (temporary). Calling it throws internally, so code after it does not run — don't wrap it in \`try/catch\`.
• **\`permanentRedirect(path)\`** — same, but 308 (permanent). Use when a URL has moved forever (SEO keeps the ranking).
• **\`redirects()\` in \`next.config.js\`** — static rules known at build time (old URLs → new URLs).
• **\`proxy.js\`** — conditional redirects before a route renders, e.g. based on a cookie (Lecture 9).
• **\`useRouter().push\`** — client-side, after user interaction.`,
      codeSnippet: `// app/profile/page.js
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?next=/profile"); // stops rendering here
  }
  return <h1>Hello, {user.name}</h1>;
}

// app/old-blog/[slug]/page.js — URL moved forever
import { permanentRedirect } from "next/navigation";

export default async function OldPost({ params }) {
  const { slug } = await params;
  permanentRedirect("/blog/" + slug);
}`
    },
    {
      heading: "10. Route Groups: Organize Without Changing URLs",
      content: `Wrap a folder name in parentheses — \`(marketing)\` — to create a **route group**. The group name is **omitted from the URL**.
Use route groups to:
• **Organize** a large app by team or feature without affecting URLs.
• **Give a set of routes its own layout**: \`app/(shop)/layout.js\` applies to shop pages only.
• **Create multiple root layouts**: remove \`app/layout.js\` and add \`(marketing)/layout.js\` and \`(app)/layout.js\`, each with its own \`<html>\` and \`<body>\`.
**Caution:** two groups must not resolve to the same URL — \`(marketing)/about/page.js\` and \`(shop)/about/page.js\` would both be \`/about\` and cause an error. Navigating between different root layouts triggers a full page load.`,
      codeSnippet: `app/
├── (marketing)/
│   ├── layout.js           # Marketing header + footer
│   ├── page.js             →  /
│   └── pricing/page.js     →  /pricing
├── (shop)/
│   ├── layout.js           # Shop layout with cart sidebar
│   ├── products/page.js    →  /products
│   └── cart/page.js        →  /cart
└── (auth)/
    ├── layout.js           # Centered card layout, no navbar
    ├── login/page.js       →  /login
    └── register/page.js    →  /register`
    },
    {
      heading: "11. Private Folders & Colocation",
      content: `Prefix a folder with an underscore — \`_components\` — to make it a **private folder**. It and all its children are excluded from routing, even if they contain a \`page.js\`.
Private folders are useful for:
• Keeping UI components, hooks and helpers next to the routes that use them.
• Making intent obvious to teammates ("this is not a route").
• Avoiding accidental naming conflicts with future Next.js special files.
**Project organization strategies** that all work well:
• Keep shared code **outside** \`app/\` (\`components/\`, \`lib/\`) and use \`app/\` purely for routing — this portfolio uses this approach.
• Keep everything **inside** \`app/\` using private folders.
• Split by **feature** using route groups, each with its own \`_components\`.`,
      codeSnippet: `app/
├── blog/
│   ├── _components/        # Private: never routable
│   │   ├── PostCard.jsx
│   │   └── page.js         ✗  ignored (inside a private folder)
│   ├── _lib/
│   │   └── formatDate.js
│   └── page.js             →  /blog
components/                 # Shared across the whole app
lib/                        # Data access, utilities`
    },
    {
      heading: "12. How Client-Side Navigation Works Under the Hood",
      content: `When you click a \`<Link>\`, Next.js does **not** download a new HTML document. Instead:
1. **Prefetching** already fetched the target route's **RSC Payload** — a compact description of the Server Component tree — when the link entered the viewport.
2. On click, the router renders the new segments into the existing tree. Shared layouts are **preserved**, so only the changed part of the page updates.
3. Browser history is updated and the scroll position is managed for you.
4. Client Components that stay on screen keep their React state.
**Next.js 16 improvements:** prefetches are **deduplicated by layout** (a shared layout is downloaded once even if 50 links point to pages under it) and **incremental** (only parts not already cached are requested). You may see more, smaller prefetch requests in DevTools — that's expected.`
    },
    {
      heading: "13. Practical: Build a Mini Documentation Site",
      content: `Put it all together: a docs section with its own layout, an active sidebar and three pages. Create the files below, run \`npm run dev\`, and click around — notice the sidebar never re-mounts and the active link updates instantly.
**Try these experiments:**
• Add \`console.log("layout render")\` to the docs layout and watch the server terminal while navigating between docs pages — it does not log again.
• Run \`npm run build && npm run start\` and open the Network tab: hover nothing, just scroll the sidebar into view and watch the prefetch requests.`,
      codeSnippet: `// app/docs/layout.js
import NavLink from "@/components/NavLink";

const pages = [
  { href: "/docs", label: "Introduction" },
  { href: "/docs/installation", label: "Installation" },
  { href: "/docs/routing", label: "Routing" },
];

export default function DocsLayout({ children }) {
  return (
    <div style={{ display: "flex", gap: "2rem" }}>
      <aside style={{ width: 200, display: "grid", gap: 8, alignContent: "start" }}>
        {pages.map((p) => (
          <NavLink key={p.href} href={p.href}>{p.label}</NavLink>
        ))}
      </aside>
      <article style={{ flex: 1 }}>{children}</article>
    </div>
  );
}

// app/docs/page.js
export default function DocsHome() {
  return <h1>Introduction</h1>;
}

// app/docs/installation/page.js
export default function Installation() {
  return <h1>Installation</h1>;
}

// app/docs/routing/page.js
export default function Routing() {
  return <h1>Routing</h1>;
}`
    },
    {
      heading: "14. Summary",
      content: `• Folders inside \`app/\` are route segments; a \`page.js\` makes a segment public.
• Layouts wrap child routes, persist across navigation and nest automatically. The root layout must render \`<html>\` and \`<body>\`.
• Layouts don't receive \`searchParams\` or the pathname — use the page or a Client Component.
• \`<Link>\` provides client-side navigation and automatic prefetching; \`usePathname\` powers active links; \`useLinkStatus\` shows pending state.
• \`useRouter\` (from \`next/navigation\`) navigates in code; \`redirect\` / \`permanentRedirect\` redirect on the server.
• Route groups \`(name)\` organize routes and enable multiple layouts without changing URLs; private folders \`_name\` are never routable.
**Next lecture:** dynamic routes — \`[slug]\`, catch-all segments, async \`params\` and \`searchParams\`, and generating static pages with \`generateStaticParams\`.`
    }
  ]
};
