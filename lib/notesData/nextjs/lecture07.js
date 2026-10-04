export const lecture07 = {
  slug: "lecture-7",
  number: 7,
  title: "Complete Next.js Course — Lecture 7: Caching & Revalidation in Next.js 16",
  summary: "Understand both caching models in Next.js 16. The previous model (fetch cache options, unstable_cache, route segment config) and the new Cache Components model: 'use cache', cacheLife profiles, cacheTag, revalidateTag, updateTag, revalidatePath, refresh, runtime APIs inside Suspense, connection(), and Partial Prerendering.",
  readTime: "32 min read",
  difficulty: "Advanced",
  date: "2026-10-04",
  sections: [
    {
      heading: "1. Why Caching Matters",
      content: `Rendering a page can involve slow work: database queries, third-party APIs, heavy computation. **Caching** stores the result so the next visitor gets it instantly instead of repeating the work.
Good caching gives you:
• **Speed** — static HTML from a CDN loads in milliseconds.
• **Lower cost** — fewer database queries and API calls.
• **Resilience** — cached pages keep working when an upstream API is slow.
The challenge is **freshness**: cached data gets stale. **Revalidation** is how you decide when cached data is refreshed — after a time interval, or on demand when the data changes.
**Rule:** cache what's shared and changes rarely; render per request what's personal or real-time.`
    },
    {
      heading: "2. Two Caching Models in Next.js 16",
      content: `Next.js 16 supports two models. Know which one your project uses:
• **Previous model (default)** — caching is controlled with \`fetch\` options (\`cache: "force-cache"\`, \`next: { revalidate }\`), \`unstable_cache\` for non-fetch functions, and route segment config (\`export const revalidate\`, \`export const dynamic\`). Most existing apps — including this portfolio — use this model.
• **Cache Components (opt-in)** — enabled with \`cacheComponents: true\` in \`next.config.js\`. You mark cacheable code with the **\`"use cache"\`** directive, control lifetime with **\`cacheLife\`**, and tag entries with **\`cacheTag\`**. Pages are **partially prerendered** by default. This is where Next.js is heading, and it's recommended for new projects.
Both models share the same **revalidation APIs** (\`revalidateTag\`, \`revalidatePath\`) and the same request-time APIs (\`cookies\`, \`headers\`, \`searchParams\`). We'll cover the previous model briefly, then focus on Cache Components.`
    },
    {
      heading: "3. Previous Model: Caching fetch Requests",
      content: `Without Cache Components, \`fetch\` requests are **not cached** by default. Opt in per request:
• **\`cache: "force-cache"\`** — cache the response indefinitely (until revalidated).
• **\`next: { revalidate: 3600 }\`** — cache, then refresh in the background at most once per hour (time-based revalidation, like ISR).
• **\`next: { tags: ["posts"] }\`** — label the entry so you can invalidate it on demand later.
• **\`cache: "no-store"\`** — explicitly never cache.
For **non-fetch** work (database queries), wrap the function with \`unstable_cache(fn, keyParts, { revalidate, tags })\`.`,
      codeSnippet: `// Previous model (cacheComponents NOT enabled)
export default async function BlogPage() {
  // Cached, refreshed in the background at most every hour, tagged "posts"
  const posts = await fetch("https://api.example.com/posts", {
    next: { revalidate: 3600, tags: ["posts"] },
  }).then((r) => r.json());

  // Cached until manually revalidated
  const settings = await fetch("https://api.example.com/settings", {
    cache: "force-cache",
  }).then((r) => r.json());

  return <PostList posts={posts} siteName={settings.name} />;
}

// Non-fetch function
import { unstable_cache } from "next/cache";
export const getPosts = unstable_cache(
  async () => db.post.findMany(),
  ["posts"],                         // cache key parts
  { revalidate: 3600, tags: ["posts"] }
);`
    },
    {
      heading: "4. Previous Model: Static vs. Dynamic Rendering & Segment Config",
      content: `In the previous model, Next.js decides per route whether it can be **prerendered at build time (static)** or must render **per request (dynamic)**.
A route becomes **dynamic** when it uses:
• Request-time APIs: \`cookies()\`, \`headers()\`, \`searchParams\`, \`draftMode()\`, \`connection()\`.
• A \`fetch\` with \`cache: "no-store"\` or \`next: { revalidate: 0 }\`.
Otherwise it's **static** and served as prebuilt HTML.
**Watch out:** a plain \`fetch\` with no options does **not** make a route dynamic. If nothing else in the route is dynamic, the request runs once at build time and its result is baked into the static HTML. Add \`cache: "no-store"\` (or use a request-time API) when the data must be fresh on every request.
Override per route with **route segment config** exports:
• \`export const revalidate = 60\` — default revalidation time for the route (ISR).
• \`export const revalidate = 0\` — always render dynamically.
• \`export const dynamic = "force-static"\` — force static rendering (request APIs return empty values).
• \`export const dynamic = "force-dynamic"\` — force rendering on every request.
Check the result in the \`next build\` output: each route is labelled static, SSG or dynamic.`,
      codeSnippet: `// app/news/page.js — regenerate at most every 5 minutes (ISR)
export const revalidate = 300;

export default async function News() {
  const articles = await fetch("https://api.example.com/news", {
    cache: "force-cache",
  }).then((r) => r.json());
  return <ArticleList articles={articles} />;
}

// app/account/page.js — always fresh, per user
export const dynamic = "force-dynamic";`
    },
    {
      heading: "5. Enabling Cache Components",
      content: `Turn on the new model with one flag. (It replaces the old \`experimental.dynamicIO\`, \`experimental.useCache\` and \`experimental.ppr\` flags, which are deprecated or removed in Next.js 16.)
With Cache Components enabled, the mental model changes: **nothing is cached unless you say so**, and every route is **prerendered as much as possible** into a static shell. Any component that needs request-time data or uncached async work must either be **cached** with \`"use cache"\` or **streamed** inside \`<Suspense>\`. Next.js enforces this — you get a clear error in development and at build time if you forget.`,
      codeSnippet: `// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
};

export default nextConfig;`
    },
    {
      heading: "6. The \"use cache\" Directive",
      content: `\`"use cache"\` marks an **async function or component** whose return value should be cached. Place it at the top of the function body — or at the top of a file to cache every export.
Three levels of granularity:
• **Data-level** — cache a function such as \`getProducts()\`. Best when the same data feeds many components.
• **UI-level** — cache a component or an entire page/layout, including its rendered output.
• **File-level** — \`"use cache"\` as the first line of a file caches all its exported functions.
**Cache keys are automatic:** the function's arguments (and any variables it closes over) become part of the key, so \`getProduct("1")\` and \`getProduct("2")\` are stored separately. Arguments and return values must be **serializable**.`,
      codeSnippet: `// lib/data/products.js — data-level
import { cacheLife } from "next/cache";

export async function getProducts(category) {
  "use cache";
  cacheLife("hours");
  return db.product.findMany({ where: { category } }); // cached per category
}

// app/components/Footer.jsx — UI-level
export default async function Footer() {
  "use cache";
  const links = await getFooterLinks();   // rarely changes
  return <footer>{links.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}</footer>;
}

// app/lib/cms.js — file-level: every export is cached
"use cache";
export async function getHomepage() { /* ... */ }
export async function getPricing() { /* ... */ }`
    },
    {
      heading: "7. Controlling Lifetime with cacheLife",
      content: `\`cacheLife\` sets how long a cached entry lives. Each profile defines three timings:
• **\`stale\`** — how long the **browser** may reuse the data without asking the server.
• **\`revalidate\`** — after this time, the next request gets the cached version **immediately** while the server regenerates it **in the background** (stale-while-revalidate, like ISR).
• **\`expire\`** — the hard limit; after this long with no traffic, the next request waits for fresh content.
**Built-in profiles (stale / revalidate / expire):**
• \`default\` — 5 min / 15 min / never (used when you don't call \`cacheLife\`)
• \`seconds\` — 30 s / 1 s / 1 min — near real-time data
• \`minutes\` — 5 min / 1 min / 1 hour — frequently updated content
• \`hours\` — 5 min / 1 hour / 1 day — updated several times a day
• \`days\` — 5 min / 1 day / 1 week — updated daily
• \`weeks\` — 5 min / 1 week / 30 days — updated weekly
• \`max\` — 5 min / 30 days / 1 year — content that rarely changes
You can also pass an inline object, or define **custom named profiles** in \`next.config.js\`.`,
      codeSnippet: `import { cacheLife } from "next/cache";

// Built-in profile
export async function getExchangeRates() {
  "use cache";
  cacheLife("minutes");
  return fetch("https://api.example.com/rates").then((r) => r.json());
}

// Inline profile (seconds)
export async function getLeaderboard() {
  "use cache";
  cacheLife({ stale: 30, revalidate: 60, expire: 600 });
  return db.score.findMany({ orderBy: { points: "desc" }, take: 10 });
}

// Custom named profile — next.config.mjs
const nextConfig = {
  cacheComponents: true,
  cacheLife: {
    blog: { stale: 3600, revalidate: 900, expire: 86400 },
  },
};
// usage: cacheLife("blog")`
    },
    {
      heading: "8. Tagging Cache Entries with cacheTag",
      content: `Time-based revalidation is great when you don't know when data changes. When you **do** know — an editor publishes a post, a product price changes — invalidate exactly the affected entries **on demand**.
\`cacheTag("posts")\` labels a cached entry. One entry can have several tags (\`"posts"\`, \`"post-42"\`), and one tag can label many entries. Later, invalidating a tag refreshes every entry that carries it.`,
      codeSnippet: `import { cacheLife, cacheTag } from "next/cache";

export async function getPost(slug) {
  "use cache";
  cacheLife("days");
  cacheTag("posts", "post-" + slug);      // broad tag + specific tag
  return db.post.findUnique({ where: { slug } });
}

export async function getAllPosts() {
  "use cache";
  cacheLife("days");
  cacheTag("posts");
  return db.post.findMany({ orderBy: { publishedAt: "desc" } });
}`
    },
    {
      heading: "9. On-Demand Revalidation: updateTag, revalidateTag, revalidatePath, refresh",
      content: `Next.js 16 gives you four tools — choose by **who must see the change and how fast**:
• **\`updateTag(tag)\`** — **Server Actions only.** Expires the tag and refreshes the data **within the same request**, so the user who made the change sees it immediately (**read-your-writes**). Use for forms, settings, carts, comments.
• **\`revalidateTag(tag, profile)\`** — marks entries stale using **stale-while-revalidate**: visitors keep seeing the cached version while fresh data is generated in the background. In Next.js 16 the **second argument is required** — usually \`"max"\`. Works in Server Actions **and Route Handlers** (ideal for CMS webhooks).
• **\`revalidatePath(path, type?)\`** — invalidates everything cached for a URL path. Pass \`"page"\` or \`"layout"\` as the type for dynamic patterns like \`revalidatePath("/blog/[slug]", "page")\`.
• **\`refresh()\`** — Server Actions only; refreshes the client router (re-fetches Server Components) without touching cached data. Use for uncached UI like notification counts.`,
      codeSnippet: `// app/actions.js — editor updates a post
"use server";
import { updateTag, revalidatePath } from "next/cache";

export async function savePost(slug, formData) {
  await db.post.update({ where: { slug }, data: { title: formData.get("title") } });
  updateTag("post-" + slug);   // the editor sees the new title right away
  updateTag("posts");          // and the list is fresh too
}

// app/api/cms-webhook/route.js — CMS calls this after publishing
import { revalidateTag } from "next/cache";

export async function POST(request) {
  const secret = request.headers.get("x-webhook-secret");
  if (secret !== process.env.CMS_WEBHOOK_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { slug } = await request.json();
  revalidateTag("post-" + slug, "max");   // stale-while-revalidate
  return Response.json({ revalidated: true });
}`
    },
    {
      heading: "10. Runtime APIs Must Be Inside <Suspense>",
      content: `\`cookies()\`, \`headers()\`, \`searchParams\` and (un-prerendered) \`params\` depend on the incoming request, so they can't be part of the static shell. With Cache Components:
• Components that read them must be wrapped in **\`<Suspense>\`** — the fallback goes into the static shell, the real content streams at request time.
• A cached (\`"use cache"\`) scope **cannot call them directly**. Read the value **outside** the cache and **pass it in as an argument** — it then becomes part of the cache key.
If you forget, Next.js reports **"Uncached data was accessed outside of <Suspense>"** in development and fails the build, pointing at the exact component.`,
      codeSnippet: `import { Suspense } from "react";
import { cookies } from "next/headers";

export default function DashboardPage() {
  return (
    <>
      <h1>Dashboard</h1>                                  {/* static shell */}
      <Suspense fallback={<p>Loading your data…</p>}>
        <UserSection />                                    {/* streams per request */}
      </Suspense>
    </>
  );
}

async function UserSection() {
  const userId = (await cookies()).get("userId")?.value;  // runtime API, outside the cache
  return <CachedStats userId={userId} />;
}

async function CachedStats({ userId }) {
  "use cache";                                             // userId is part of the cache key
  const stats = await getStatsForUser(userId);
  return <p>{stats.orders} orders this month</p>;
}`
    },
    {
      heading: "11. Non-Deterministic Values and connection()",
      content: `\`Math.random()\`, \`Date.now()\` and \`crypto.randomUUID()\` produce different results each time. If they run during prerendering, every visitor would see the **same** "random" value frozen into the static shell. Cache Components makes you choose explicitly:
• **Per request:** call \`await connection()\` (from \`next/server\`) before the operation and wrap the component in \`<Suspense>\`. This defers it to request time.
• **Cached:** put it inside a \`"use cache"\` scope — the value is computed once and shared until revalidation.
\`connection()\` is also how you read **runtime environment variables** at request time instead of baking them in at build time.`,
      codeSnippet: `import { Suspense } from "react";
import { connection } from "next/server";

async function RequestId() {
  await connection();                     // opt into request time
  return <p>Request ID: {crypto.randomUUID()}</p>;
}

export default function Page() {
  return (
    <Suspense fallback={<p>…</p>}>
      <RequestId />
    </Suspense>
  );
}`
    },
    {
      heading: "12. Partial Prerendering: Static Shell + Dynamic Holes",
      content: `With Cache Components, every route is built using **Partial Prerendering (PPR)**:
• **Static content** (plain JSX, deterministic computations, module imports) → included in the **static shell**.
• **\`"use cache"\`** content → rendered at build time and included in the shell; refreshed according to its \`cacheLife\`.
• **\`<Suspense>\`** around runtime or uncached work → the **fallback** goes in the shell; the content streams in at request time.
The result: the browser receives a fully formed page shell **instantly** from the CDN — header, navigation, product info — while personalized parts (cart, recommendations, greeting) stream into their holes over the **same HTTP response**.
**Verify it:** run \`next build\` and check the route summary, or view the page source to see exactly what's in the static shell.`
    },
    {
      heading: "13. Choosing a Strategy: Cheat Sheet",
      content: `• **Marketing pages, docs, blog posts** → \`"use cache"\` + \`cacheLife("days")\` or \`"max"\`, \`cacheTag\` + \`revalidateTag\` from a CMS webhook.
• **Product catalog** → \`"use cache"\` + \`cacheLife("hours")\`, \`cacheTag("product-ID")\`; \`updateTag\` when admins edit.
• **Prices or stock that must be accurate** → don't cache; stream inside \`<Suspense>\`.
• **User dashboard, cart, profile** → read cookies inside \`<Suspense>\`; cache shared sub-parts by passing the user ID as an argument.
• **Forms where users expect to see their change** → Server Action + \`updateTag\`.
• **Real-time data (chat, live scores)** → client-side fetching with polling or websockets.
• **Content shared across many servers/serverless instances** → consider \`"use cache: remote"\` with a remote cache handler (e.g. Redis), since the default \`"use cache"\` store is in-memory per instance. (\`"use cache: private"\` is an experimental variant that allows runtime APIs for compliance cases.)`
    },
    {
      heading: "14. Practical: A Blog with Cached Posts, Personal Sidebar & Admin Publishing",
      content: `This page combines all three kinds of content on one route:
• **Static**: the header — prerendered automatically.
• **Cached**: the post list — \`"use cache"\`, revalidated hourly, tagged \`posts\`.
• **Dynamic**: the reader's preferences — reads cookies, streamed in \`<Suspense>\`.
• **Mutation**: an admin-only publish form whose Server Action calls \`updateTag("posts")\` so the new post appears immediately.`,
      codeSnippet: `// app/blog/page.js   (next.config: cacheComponents: true)
import { Suspense } from "react";
import { cookies } from "next/headers";
import { cacheLife, cacheTag, updateTag } from "next/cache";

export default function BlogPage() {
  return (
    <>
      <header><h1>Engineering Blog</h1></header>   {/* static */}
      <BlogPosts />                                  {/* cached */}
      <Suspense fallback={<p>Loading preferences…</p>}>
        <ReaderPreferences />                        {/* dynamic */}
      </Suspense>
      <Suspense fallback={null}>
        <PublishForm />                              {/* dynamic + mutation */}
      </Suspense>
    </>
  );
}

async function BlogPosts() {
  "use cache";
  cacheLife("hours");
  cacheTag("posts");
  const posts = await db.post.findMany({ orderBy: { createdAt: "desc" }, take: 10 });
  return <ul>{posts.map((p) => <li key={p.id}>{p.title}</li>)}</ul>;
}

async function ReaderPreferences() {
  const theme = (await cookies()).get("theme")?.value ?? "light";
  return <aside>Reading in {theme} mode</aside>;
}

async function PublishForm() {
  const isAdmin = (await cookies()).get("role")?.value === "admin";
  if (!isAdmin) return null;

  async function publish(formData) {
    "use server";
    await db.post.create({ data: { title: String(formData.get("title")) } });
    updateTag("posts");                // read-your-writes
  }

  return (
    <form action={publish}>
      <input name="title" placeholder="Post title" required />
      <button type="submit">Publish</button>
    </form>
  );
}`
    },
    {
      heading: "15. Summary",
      content: `• Next.js 16 has two caching models: the **previous model** (fetch options, \`unstable_cache\`, segment config) and **Cache Components** (\`cacheComponents: true\`).
• In both, \`fetch\` is **not cached by default** — caching is explicit.
• \`"use cache"\` caches functions, components or whole files; arguments form the cache key.
• \`cacheLife\` controls \`stale\` / \`revalidate\` / \`expire\` with built-in or custom profiles.
• \`cacheTag\` labels entries; \`updateTag\` gives read-your-writes in Server Actions; \`revalidateTag(tag, "max")\` gives stale-while-revalidate anywhere on the server; \`revalidatePath\` invalidates by URL; \`refresh\` re-renders the client router.
• Runtime APIs must be read inside \`<Suspense>\` and passed into cached scopes as arguments; use \`connection()\` for per-request values.
• The outcome is **Partial Prerendering**: an instant static shell with dynamic content streamed into it.
**Next lecture:** Server Actions and forms — mutating data, validation, \`useActionState\`, \`useFormStatus\`, optimistic updates and security.`
    }
  ]
};
