export const lecture05 = {
  slug: "lecture-5",
  number: 5,
  title: "Complete Next.js Course — Lecture 5: Server Components vs. Client Components",
  summary: "The core architecture of the App Router: how React Server Components work, the RSC Payload and hydration, when to use Server vs. Client Components, the 'use client' boundary, composition patterns, serializable props, context providers, third-party libraries, server-only code and the most common mistakes.",
  readTime: "29 min read",
  difficulty: "Intermediate",
  date: "2026-10-04",
  sections: [
    {
      heading: "1. Two Kinds of Components",
      content: `In the App Router every component is one of two kinds:
• **Server Components** — the **default**. They run only on the server (at build time or per request). Their code is **never sent to the browser**.
• **Client Components** — opted in with the \`"use client"\` directive. They are prerendered to HTML on the server **and** shipped to the browser as JavaScript, where they become interactive (hydration).
The name "Client Component" is a little misleading: it still renders on the server for the initial HTML. The difference is that its code **also** runs in the browser.
**Goal of the architecture:** keep as much as possible on the server (smaller bundles, direct data access, better security) and send JavaScript only for the parts users actually interact with.`
    },
    {
      heading: "2. How Server Components Work: The RSC Payload",
      content: `When a route renders, React splits the work:
1. **On the server**, React renders Server Components into a special compact format called the **RSC Payload** — a serialized description of the component tree, including the rendered output of Server Components and **placeholders** pointing to Client Component JavaScript files plus their props.
2. Next.js uses the RSC Payload **and** Client Component code to produce **HTML** for the initial page load.
3. **In the browser**, the HTML shows immediately (fast, non-interactive preview). The RSC Payload reconciles the tree, and JavaScript **hydrates** the Client Components — attaching event handlers so they become interactive.
4. On later **client-side navigations**, only the RSC Payload for the new route is fetched (and is often prefetched) — no full HTML document.
Because Server Components arrive as already-rendered output, their dependencies (a Markdown parser, a date library, a database client) add **0 KB** to the browser bundle.`
    },
    {
      heading: "3. When to Use Which",
      content: `**Use Server Components to:**
• Fetch data from databases or APIs close to the source.
• Use secrets — API keys, tokens, database credentials — without exposing them.
• Keep large dependencies off the client.
• Render static or mostly static content: text, lists, layouts, product details.
• Improve First Contentful Paint and stream content progressively.
**Use Client Components when you need:**
• **State and lifecycle**: \`useState\`, \`useReducer\`, \`useEffect\`, custom hooks that use them.
• **Event handlers**: \`onClick\`, \`onChange\`, \`onSubmit\` (except forms using Server Actions).
• **Browser-only APIs**: \`window\`, \`localStorage\`, \`navigator.geolocation\`, \`IntersectionObserver\`.
• **Context** consumers/providers and libraries that depend on them.
• **Class components** or libraries that use any of the above.`
    },
    {
      heading: "4. The \"use client\" Directive and the Client Boundary",
      content: `Write \`"use client"\` at the **very top** of a file, above imports. It declares a **boundary** between server and client module graphs.
The crucial rule: **everything imported into a Client Component file becomes part of the client bundle too.** You don't need \`"use client"\` in every interactive file — only at the **entry point** where server code hands off to client code.
• \`Counter.jsx\` has \`"use client"\` → \`Counter\` and anything it imports (\`Button.jsx\`, \`useCounter.js\`) ship to the browser.
• \`page.js\` (no directive) imports \`Counter\` → the page stays a Server Component and renders \`<Counter />\` as a client island.`,
      codeSnippet: `// app/components/Counter.jsx
"use client";                       // ← boundary: this file and its imports go to the client

import { useState } from "react";

export default function Counter({ initial = 0 }) {
  const [count, setCount] = useState(initial);
  return (
    <button onClick={() => setCount((c) => c + 1)}>
      Clicked {count} times
    </button>
  );
}

// app/page.js — still a Server Component
import Counter from "./components/Counter";
import { getStats } from "@/lib/db";

export default async function Page() {
  const stats = await getStats();          // runs on the server only
  return (
    <main>
      <h1>{stats.visitors} visitors today</h1>
      <Counter initial={stats.likes} />    {/* interactive island */}
    </main>
  );
}`
    },
    {
      heading: "5. Push Client Boundaries Down the Tree",
      content: `A common beginner mistake is putting \`"use client"\` on a whole page or layout because one small part needs interactivity. That turns **everything** below it into client JavaScript.
Instead, extract **only the interactive piece** into its own Client Component and keep the rest on the server.
**Example:** a navbar with a logo, links and a search box. Only the search box needs state — so only \`<Search />\` is a Client Component; the navbar, logo and links remain Server Components.`,
      codeSnippet: `// ❌ Whole layout becomes client JavaScript
"use client";
export default function Navbar() {
  const [query, setQuery] = useState("");
  return (
    <nav>
      <Logo /> <Links />                      {/* shipped to the client for no reason */}
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
    </nav>
  );
}

// ✅ Only the interactive leaf is a Client Component
// app/components/Navbar.jsx (Server Component)
import Search from "./Search";
export default function Navbar() {
  return (
    <nav>
      <Logo /> <Links />
      <Search />
    </nav>
  );
}

// app/components/Search.jsx
"use client";
import { useState } from "react";
export default function Search() {
  const [query, setQuery] = useState("");
  return <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search…" />;
}`
    },
    {
      heading: "6. Composition: Passing Server Components into Client Components",
      content: `A Client Component **cannot import** a Server Component (the import would pull it into the client bundle). But it **can render** Server Components passed to it as **props** — most commonly \`children\`.
This works because the Server Component is rendered on the server **first**; the Client Component just receives the finished output as a slot to place in its tree.
This pattern is how you build interactive **wrappers** — modals, tabs, accordions, carousels — around server-rendered content.`,
      codeSnippet: `// app/components/Collapsible.jsx — Client Component wrapper
"use client";
import { useState } from "react";

export default function Collapsible({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen(!open)}>{open ? "▼" : "▶"} {title}</button>
      {open && children}
    </div>
  );
}

// app/page.js — Server Component
import Collapsible from "./components/Collapsible";
import Comments from "./components/Comments"; // async Server Component that queries the DB

export default function Page() {
  return (
    <Collapsible title="Show comments">
      <Comments postId="42" />   {/* rendered on the server, slotted into the client wrapper */}
    </Collapsible>
  );
}`
    },
    {
      heading: "7. Props Across the Boundary Must Be Serializable",
      content: `Props passed from a Server Component to a Client Component travel over the network inside the RSC Payload, so they must be **serializable** by React.
**Allowed:** strings, numbers, booleans, \`null\`/\`undefined\`, plain objects and arrays of these, \`Date\`, \`Map\`, \`Set\`, typed arrays, **Promises**, JSX elements (Server Components), and **Server Functions** (functions marked \`"use server"\`).
**Not allowed:** regular functions and event handlers, class instances (e.g. a Mongoose document with methods), Symbols that aren't registered.
**Tips:**
• Convert database records to plain objects: \`JSON.parse(JSON.stringify(doc))\` or select only the fields you need.
• Pass **only what the client needs** — every prop is visible in the page source. Never pass a full user record containing a password hash.`,
      codeSnippet: `// ❌ Error: Functions cannot be passed directly to Client Components
<LikeButton onLike={() => console.log("liked")} />

// ✅ Pass data, define the handler inside the Client Component
<LikeButton postId={post.id} initialLikes={post.likes} />

// ✅ Or pass a Server Function (Lecture 8)
import { likePost } from "@/app/actions";
<LikeButton postId={post.id} action={likePost} />

// ✅ Send only the fields the client needs
const user = await db.user.findUnique({ where: { id } });
<ProfileCard name={user.name} avatar={user.avatarUrl} />  // not the whole record`
    },
    {
      heading: "8. Context Providers in the App Router",
      content: `React Context isn't available in Server Components (they have no state to share). To use a theme, auth or cart context:
1. Create a **Client Component provider** that holds the state and renders the context provider.
2. Render it in a layout, wrapping \`children\`.
Server Components passed as \`children\` still render on the server — wrapping the app in a provider does **not** turn the whole app into client code.
**Best practice:** render providers **as deep as possible**. If only the dashboard needs a context, put the provider in \`app/dashboard/layout.js\`, not the root layout. This lets Next.js optimize the static parts above it.`,
      codeSnippet: `// app/providers/ThemeProvider.jsx
"use client";
import { createContext, useContext, useState } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div data-theme={theme}>{children}</div>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

// app/layout.js (Server Component)
import { ThemeProvider } from "./providers/ThemeProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}`
    },
    {
      heading: "9. Using Third-Party Components",
      content: `Many npm packages use hooks or browser APIs but were published before \`"use client"\` existed, so they don't include the directive. Rendering them directly in a Server Component throws an error like *"useState only works in Client Components"*.
**Fix:** re-export them from your own file that has \`"use client"\`. Now they can be used anywhere, including inside Server Components.
You don't need to wrap them if you only use them inside your own Client Components — those are already on the client side of the boundary.`,
      codeSnippet: `// app/components/Carousel.jsx
"use client";
export { Carousel } from "acme-carousel"; // library uses useState internally

// app/page.js — Server Component
import { Carousel } from "./components/Carousel";

export default async function Page() {
  const slides = await getSlides();
  return <Carousel items={slides} />;
}`
    },
    {
      heading: "10. Keeping Server Code Off the Client: server-only",
      content: `Modules that use secrets or server-only APIs could accidentally be imported by a Client Component. Environment variables without the \`NEXT_PUBLIC_\` prefix are replaced with empty strings on the client, so the code would silently break — or worse, you might leak logic.
Protect such modules with the **\`server-only\`** package: importing it into any client-bound module causes a **build-time error**.
The mirror package **\`client-only\`** marks modules that must never run on the server (e.g. code touching \`window\`).`,
      codeSnippet: `// npm install server-only

// lib/data.js
import "server-only";

export async function getSecretReport() {
  const res = await fetch("https://internal.example.com/report", {
    headers: { Authorization: "Bearer " + process.env.INTERNAL_API_KEY },
  });
  return res.json();
}

// If a "use client" file imports lib/data.js:
// ✖ Build error: "This module cannot be imported from a Client Component module."`
    },
    {
      heading: "11. Sharing Data Between Server Components",
      content: `Because Server Components can't use Context, how does a layout and a page share data like the current user?
**Simply fetch it in both.** Next.js and React make this cheap:
• Identical \`fetch()\` GET calls in one render pass are **memoized** — the request happens once.
• For database or SDK calls, wrap the function in React's **\`cache()\`** so repeated calls with the same arguments during a request return the same result.
This keeps components independent and composable instead of threading props through many levels.`,
      codeSnippet: `// lib/user.js
import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { db } from "./db";

export const getCurrentUser = cache(async () => {
  const sessionId = (await cookies()).get("session")?.value;
  if (!sessionId) return null;
  return db.user.findFirst({ where: { sessionId } }); // runs once per request
});

// app/layout.js  → const user = await getCurrentUser();
// app/page.js    → const user = await getCurrentUser();  // cached, no second query`
    },
    {
      heading: "12. Common Mistakes and How to Fix Them",
      content: `• **"You're importing a component that needs useState..."** — you used a hook in a Server Component. Add \`"use client"\` to that component (or extract the interactive part).
• **Importing a Server Component into a Client Component** — it silently becomes a client component and can't use \`async\` or secrets. Pass it as \`children\` instead.
• **"Functions cannot be passed directly to Client Components"** — move the handler into the Client Component or use a Server Function.
• **\`"use client"\` on the root layout** — makes the whole app client-rendered. Push the boundary down.
• **Reading \`window\` during render in a Client Component** — it still prerenders on the server where \`window\` is undefined. Access browser APIs in \`useEffect\` or event handlers.
• **Hydration mismatch** — rendering different output on server and client (e.g. \`Date.now()\`, \`Math.random()\`, locale formatting). Render such values in \`useEffect\`, or make them deterministic.
• **Calling your own Route Handler from a Server Component** (\`fetch("/api/posts")\`) — unnecessary network hop. Call the data function directly.`
    },
    {
      heading: "13. Practical: A Blog Post with a Client Like Button",
      content: `This example combines everything: a server-rendered article (data fetched on the server, zero JS), with a small interactive like button as the only Client Component. The button calls a Server Function to persist the like and uses optimistic UI so it feels instant.`,
      codeSnippet: `// app/actions.js
"use server";
import { db } from "@/lib/db";

export async function likePost(postId) {
  const post = await db.post.update({
    where: { id: postId },
    data: { likes: { increment: 1 } },
  });
  return post.likes;
}

// app/components/LikeButton.jsx
"use client";
import { useState, useTransition } from "react";
import { likePost } from "@/app/actions";

export default function LikeButton({ postId, initialLikes }) {
  const [likes, setLikes] = useState(initialLikes);
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => {
        setLikes((l) => l + 1);                         // optimistic
        startTransition(async () => setLikes(await likePost(postId)));
      }}
    >
      ❤️ {likes}
    </button>
  );
}

// app/blog/[slug]/page.js — Server Component
import LikeButton from "@/app/components/LikeButton";
import { getPostBySlug } from "@/lib/posts";

export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
      <LikeButton postId={post.id} initialLikes={post.likes} />
    </article>
  );
}`
    },
    {
      heading: "14. Summary",
      content: `• Components are **Server Components by default**; \`"use client"\` opts a file (and everything it imports) into the client bundle.
• Server Components render to the RSC Payload, add zero client JS, and can access data and secrets directly.
• Client Components are prerendered to HTML and hydrated in the browser for state, effects, events and browser APIs.
• Keep client boundaries at the **leaves**; pass Server Components to Client Components as \`children\`.
• Props across the boundary must be serializable; pass only what the client needs.
• Wrap context providers in Client Components and render them as deep as possible.
• Wrap hook-based third-party components in a \`"use client"\` re-export; guard secret modules with \`server-only\`.
• Share data between Server Components by fetching in each place, using \`fetch\` memoization and React \`cache()\`.
**Next lecture:** data fetching patterns — parallel vs. sequential requests, streaming, the \`use\` hook, deduplication and preloading.`
    }
  ]
};
