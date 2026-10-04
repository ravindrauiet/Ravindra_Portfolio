export const lecture06 = {
  slug: "lecture-6",
  number: 6,
  title: "Complete Next.js Course — Lecture 6: Data Fetching Patterns",
  summary: "Fetch data the Next.js way: async Server Components with fetch, ORMs and databases, sequential vs. parallel requests and waterfalls, streaming with Suspense, passing promises to Client Components with React's use(), request memoization and React cache(), preloading, client-side libraries, and robust error handling.",
  readTime: "26 min read",
  difficulty: "Intermediate",
  date: "2026-10-04",
  sections: [
    {
      heading: "1. The Big Shift: Fetch Where You Render",
      content: `In a classic React SPA, data fetching happens **after** the page loads: component mounts → \`useEffect\` → loading spinner → \`fetch\` → state update → render. Each nested component repeats the cycle.
In the App Router, **Server Components are async functions**. They \`await\` data during rendering on the server — close to your database — and send finished UI to the browser.
Benefits:
• **No client-side loading waterfalls** for initial data.
• **No API layer required** for reading data — query the database directly.
• **Secrets stay on the server** (API keys, DB credentials).
• **Less JavaScript** — no data-fetching libraries in the bundle for server-rendered data.
• **Colocation** — each component fetches exactly what it needs.`
    },
    {
      heading: "2. Fetching with the fetch API",
      content: `Call \`fetch\` directly in an async Server Component. Next.js extends the native Web \`fetch\` with extra options, but the basics are standard.
Important defaults in Next.js 16:
• \`fetch\` responses are **not stored in a data cache** by default. Opt into caching explicitly with \`"use cache"\` (Cache Components) or \`cache: "force-cache"\` (previous model). One nuance: without Cache Components, if the whole route is prerendered at build time, a plain \`fetch\` runs during the build and its result is baked into the static page — add \`cache: "no-store"\` when it must be fresh per request. Lecture 7 explains both models in detail.
• Identical \`fetch\` GET requests in the **same render** are **memoized** — called once even if many components request the same URL.
• An awaited \`fetch\` **blocks** rendering of that component until it resolves — wrap slow components in \`<Suspense>\` to stream.`,
      codeSnippet: `// app/posts/page.js
export default async function PostsPage() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=10");

  if (!res.ok) {
    // Thrown errors are caught by the nearest error.js
    throw new Error("Failed to load posts: " + res.status);
  }

  const posts = await res.json();

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.body}</p>
        </li>
      ))}
    </ul>
  );
}`
    },
    {
      heading: "3. Fetching with an ORM or Database",
      content: `Because Server Components run on the server, you can talk to your database directly — Prisma, Drizzle, Mongoose, the native \`pg\` or \`mysql2\` drivers, or a hosted SDK.
**Best practice:** don't scatter queries across components. Create a **data access layer** — a folder like \`lib/data/\` with functions such as \`getProducts()\` and \`getUser(id)\`. Mark it \`import "server-only"\` and put authorization checks there (Lecture 12). Components then call clean functions instead of raw queries.`,
      codeSnippet: `// lib/data/products.js
import "server-only";
import { db } from "@/lib/db"; // e.g. Prisma client

export async function getFeaturedProducts() {
  return db.product.findMany({
    where: { featured: true },
    select: { id: true, name: true, price: true, imageUrl: true }, // only what the UI needs
    orderBy: { createdAt: "desc" },
    take: 8,
  });
}

// app/page.js
import { getFeaturedProducts } from "@/lib/data/products";

export default async function Home() {
  const products = await getFeaturedProducts();
  return (
    <section className="grid">
      {products.map((p) => (
        <article key={p.id}>
          <h3>{p.name}</h3>
          <p>₹{p.price}</p>
        </article>
      ))}
    </section>
  );
}`
    },
    {
      heading: "4. Sequential Fetching and the Waterfall Problem",
      content: `**Sequential** fetching means each request starts after the previous one finishes. Sometimes that's required — you need the artist's ID before you can load the artist's playlists.
But accidental waterfalls are a common performance bug: awaiting independent requests one after another adds their durations together.
• Request A: 600ms, Request B: 800ms → sequential total ≈ **1400ms**.
When a dependency is real, **stream** the dependent part with \`<Suspense>\` so the first data shows immediately while the second loads.`,
      codeSnippet: `// app/artist/[id]/page.js — dependent data, streamed
import { Suspense } from "react";

async function Playlists({ artistId }) {
  const playlists = await getPlaylists(artistId);   // needs artistId first
  return <ul>{playlists.map((p) => <li key={p.id}>{p.name}</li>)}</ul>;
}

export default async function ArtistPage({ params }) {
  const { id } = await params;
  const artist = await getArtist(id);               // 1st request

  return (
    <>
      <h1>{artist.name}</h1>                         {/* shows as soon as artist loads */}
      <Suspense fallback={<p>Loading playlists…</p>}>
        <Playlists artistId={artist.id} />           {/* 2nd request streams in */}
      </Suspense>
    </>
  );
}`
    },
    {
      heading: "5. Parallel Fetching with Promise.all",
      content: `When requests don't depend on each other, **start them all at once** and await them together. Total time becomes the duration of the **slowest** request, not the sum.
• Request A: 600ms, Request B: 800ms → parallel total ≈ **800ms**.
The trick: **create** the promises before awaiting any of them.
If one request failing shouldn't break the whole page, use \`Promise.allSettled\` and handle each result individually.`,
      codeSnippet: `// app/user/[id]/page.js
export default async function UserPage({ params }) {
  const { id } = await params;

  // ✅ Both requests start immediately
  const userPromise = getUser(id);
  const postsPromise = getUserPosts(id);
  const [user, posts] = await Promise.all([userPromise, postsPromise]);

  // ❌ Waterfall: posts wait for user even though they don't need it
  // const user = await getUser(id);
  // const posts = await getUserPosts(id);

  return (
    <>
      <h1>{user.name}</h1>
      <p>{posts.length} posts</p>
    </>
  );
}

// Tolerate partial failure
const [userResult, postsResult] = await Promise.allSettled([getUser(id), getUserPosts(id)]);
const posts = postsResult.status === "fulfilled" ? postsResult.value : [];`
    },
    {
      heading: "6. Streaming: Show Content as Soon as It's Ready",
      content: `\`Promise.all\` still makes the user wait for the slowest request before **anything** shows. **Streaming** goes further: render each section independently and let it appear the moment its data arrives.
Two tools:
• **\`loading.js\`** — a fallback for the whole page segment (Lecture 4).
• **\`<Suspense>\`** — fallbacks around individual components.
Design meaningful fallbacks: skeletons with the same dimensions as the real content avoid layout shift. Group things that should appear together inside one boundary so the page doesn't "pop" in too many pieces.`,
      codeSnippet: `// app/product/[id]/page.js
import { Suspense } from "react";

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = await getProduct(id);           // fast, needed for the main content

  return (
    <>
      <ProductDetails product={product} />

      <Suspense fallback={<ReviewsSkeleton />}>
        <Reviews productId={id} />                 {/* slow: third-party reviews API */}
      </Suspense>

      <Suspense fallback={<RecommendationsSkeleton />}>
        <Recommendations productId={id} />         {/* slow: ML service */}
      </Suspense>
    </>
  );
}`
    },
    {
      heading: "7. Streaming Data to Client Components with use()",
      content: `What if an **interactive** Client Component needs server data? Instead of fetching in \`useEffect\`, start the request in a Server Component and **pass the promise** (not the result) as a prop. The Client Component unwraps it with React's **\`use()\`** hook.
• The Server Component doesn't \`await\`, so it doesn't block.
• The Client Component suspends until the promise resolves, showing the nearest \`<Suspense>\` fallback.
• Promises are serializable, so they can cross the server/client boundary.`,
      codeSnippet: `// app/blog/page.js — Server Component
import { Suspense } from "react";
import PostFilter from "./PostFilter";
import { getPosts } from "@/lib/data/posts";

export default function BlogPage() {
  const postsPromise = getPosts();            // ← not awaited
  return (
    <Suspense fallback={<p>Loading posts…</p>}>
      <PostFilter postsPromise={postsPromise} />
    </Suspense>
  );
}

// app/blog/PostFilter.jsx — Client Component
"use client";
import { use, useState } from "react";

export default function PostFilter({ postsPromise }) {
  const posts = use(postsPromise);            // suspends until resolved
  const [query, setQuery] = useState("");
  const visible = posts.filter((p) => p.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter…" />
      <ul>{visible.map((p) => <li key={p.id}>{p.title}</li>)}</ul>
    </>
  );
}`
    },
    {
      heading: "8. Request Memoization: fetch and React cache()",
      content: `Fetching "where you render" means several components may need the same data. Next.js and React prevent duplicate work **within a single request**:
• **\`fetch\` memoization** — identical GET \`fetch\` calls (same URL and options) during one render pass run **once**; later calls reuse the result. This applies to the React component tree (layouts, pages, \`generateMetadata\`, \`generateStaticParams\`), not to Route Handlers.
• **React \`cache()\`** — for anything that isn't \`fetch\` (database queries, SDK calls), wrap the function in \`cache()\` to get the same per-request memoization.
Both are **request-scoped**: nothing is shared between different users or requests. For data that should persist across requests, you need caching (Lecture 7).`,
      codeSnippet: `// lib/data/posts.js
import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";

export const getPost = cache(async (slug) => {
  console.log("DB query for", slug);   // logs once per request, even if called 3 times
  return db.post.findUnique({ where: { slug } });
});

// app/blog/[slug]/page.js
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);    // 1st call → query
  return { title: post.title };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);    // 2nd call → memoized, no query
  return <h1>{post.title}</h1>;
}`
    },
    {
      heading: "9. The Preload Pattern",
      content: `Sometimes a component conditionally renders a child that fetches data. The child's fetch can't start until the parent finishes its own work — another hidden waterfall.
**Preloading** starts the request early without awaiting it. Because the data function is wrapped in \`cache()\`, the child's later call reuses the in-flight request.`,
      codeSnippet: `// lib/data/item.js
import "server-only";
import { cache } from "react";

export const getItem = cache(async (id) => {
  const res = await fetch("https://api.example.com/items/" + id);
  return res.json();
});

export const preloadItem = (id) => {
  void getItem(id); // start fetching, don't wait
};

// app/item/[id]/page.js
import { preloadItem } from "@/lib/data/item";

export default async function Page({ params }) {
  const { id } = await params;
  preloadItem(id);                       // kick off the request immediately
  const isAvailable = await checkIsAvailable(); // meanwhile do other work
  return isAvailable ? <ItemDetails id={id} /> : <SoldOut />;
}
// <ItemDetails> calls getItem(id) and receives the already-running request`
    },
    {
      heading: "10. Client-Side Fetching: When You Still Need It",
      content: `Server-side fetching is the default, but some data genuinely belongs on the client:
• Data that changes **after** the page loads based on user input (live search suggestions, infinite scroll).
• **Real-time** or polling data (notifications, stock tickers, chat).
• Data that depends on **browser-only** information (geolocation, local storage).
For these, use a client data library like **SWR** or **TanStack Query**. They handle caching, revalidation on focus, retries and deduplication — much better than hand-written \`useEffect\` fetching.
You can combine both: server-render the initial data and pass it as \`fallbackData\` / \`initialData\` so the page is complete on first load and live afterwards.`,
      codeSnippet: `// npm install swr
"use client";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function Notifications({ initialData }) {
  const { data, error, isLoading } = useSWR("/api/notifications", fetcher, {
    fallbackData: initialData,   // server-rendered first paint
    refreshInterval: 15000,      // poll every 15s
  });

  if (error) return <p>Couldn't load notifications.</p>;
  if (isLoading) return <p>Loading…</p>;
  return <p>You have {data.unread} unread notifications</p>;
}`
    },
    {
      heading: "11. Anti-Pattern: Calling Your Own API from Server Components",
      content: `A very common mistake when coming from SPAs: creating \`app/api/posts/route.js\` and then calling \`fetch("http://localhost:3000/api/posts")\` from a Server Component.
Why it's wrong:
• It adds an **extra HTTP round trip** from your server to itself.
• It **breaks at build time**, because the server isn't running while pages are prerendered.
• It needs an absolute URL that differs per environment.
**Fix:** extract the logic into a function in your data access layer and call that function directly from both the Server Component and (if you still need a public API) the Route Handler.`,
      codeSnippet: `// ❌ Don't
export default async function Page() {
  const posts = await fetch("http://localhost:3000/api/posts").then((r) => r.json());
}

// ✅ Do
import { getPosts } from "@/lib/data/posts";
export default async function Page() {
  const posts = await getPosts();
}

// app/api/posts/route.js — only if external clients need it
import { getPosts } from "@/lib/data/posts";
export async function GET() {
  return Response.json(await getPosts());
}`
    },
    {
      heading: "12. Handling Errors and Empty States",
      content: `Robust data fetching handles three outcomes: success, empty, and failure.
• **Check \`res.ok\`** — \`fetch\` does not throw on HTTP 404 or 500; it only throws on network failure.
• **Missing resource** → call \`notFound()\` for a proper 404.
• **Unexpected failure** → throw; the nearest \`error.js\` shows a recovery UI with "Try again".
• **Empty results** → render a helpful empty state instead of a blank list.
• **Timeouts** → use \`AbortSignal.timeout(ms)\` so one slow upstream can't hang your page.`,
      codeSnippet: `import { notFound } from "next/navigation";

export async function getProduct(id) {
  const res = await fetch("https://api.example.com/products/" + id, {
    signal: AbortSignal.timeout(5000),        // fail fast after 5s
  });

  if (res.status === 404) notFound();
  if (!res.ok) throw new Error("Product API error " + res.status);

  return res.json();
}

// In a list page
if (products.length === 0) {
  return <p>No products match your filters. Try clearing them.</p>;
}`
    },
    {
      heading: "13. Practical: A Streaming Analytics Dashboard",
      content: `This dashboard puts the patterns together: the page shell renders instantly, three independent widgets fetch **in parallel** (each starts as soon as the page renders), and each **streams in** on its own schedule with a skeleton fallback. A failure in one widget is isolated by its own error boundary.`,
      codeSnippet: `// app/dashboard/page.js
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary"; // or a segment-level error.js
import { getRevenue, getSignups, getTopPages } from "@/lib/data/analytics";

async function Revenue() {
  const r = await getRevenue();
  return <Card title="Revenue" value={"₹" + r.total.toLocaleString("en-IN")} />;
}
async function Signups() {
  const s = await getSignups();
  return <Card title="New signups" value={s.count} />;
}
async function TopPages() {
  const pages = await getTopPages();
  return (
    <ol>
      {pages.map((p) => <li key={p.path}>{p.path} — {p.views} views</li>)}
    </ol>
  );
}

export default function Dashboard() {
  return (
    <main>
      <h1>Analytics</h1>
      <div className="grid">
        <Suspense fallback={<CardSkeleton />}><Revenue /></Suspense>
        <Suspense fallback={<CardSkeleton />}><Signups /></Suspense>
      </div>
      <ErrorBoundary fallback={<p>Top pages are unavailable right now.</p>}>
        <Suspense fallback={<ListSkeleton />}><TopPages /></Suspense>
      </ErrorBoundary>
    </main>
  );
}`
    },
    {
      heading: "14. Summary",
      content: `• Server Components are async — fetch data directly where you render it, with \`fetch\` or your database.
• \`fetch\` is **not data-cached** by default in Next.js 16 (but static routes bake results in at build time); identical requests in one render are memoized.
• Put database access in a \`server-only\` data access layer.
• Avoid accidental waterfalls: start independent requests together with \`Promise.all\`.
• Stream slow sections with \`<Suspense>\` and meaningful skeletons.
• Pass promises to Client Components and unwrap them with \`use()\`.
• Use React \`cache()\` for per-request memoization of non-fetch functions, and the preload pattern to start requests early.
• Use SWR/TanStack Query only for genuinely client-side data; never call your own API from a Server Component.
• Check \`res.ok\`, use \`notFound()\` for missing data, and let unexpected errors reach \`error.js\`.
**Next lecture:** caching and revalidation in Next.js 16 — Cache Components, \`"use cache"\`, \`cacheLife\`, \`cacheTag\`, \`updateTag\` and Partial Prerendering.`
    }
  ]
};
