export const lecture03 = {
  slug: "lecture-3",
  number: 3,
  title: "Complete Next.js Course — Lecture 3: Dynamic Routes, Params & Static Generation",
  summary: "Build data-driven URLs with dynamic segments, catch-all and optional catch-all routes. Learn the Next.js 16 async params and searchParams APIs, PageProps type helpers, useParams and useSearchParams on the client, notFound(), and prerendering pages with generateStaticParams and dynamicParams.",
  readTime: "24 min read",
  difficulty: "Intermediate",
  date: "2026-10-04",
  sections: [
    {
      heading: "1. What Are Dynamic Routes?",
      content: `Most real apps have URLs you can't know in advance: \`/blog/my-first-post\`, \`/products/42\`, \`/users/ravindra\`. Creating a folder for each one is impossible.
A **dynamic segment** is a folder name wrapped in square brackets — \`[slug]\`, \`[id]\`, \`[username]\`. It matches **any value** in that position of the URL and passes the value to your page as \`params\`.
• \`app/blog/[slug]/page.js\` matches \`/blog/hello\`, \`/blog/nextjs-16\`, ...
• \`app/shop/[category]/[product]/page.js\` matches \`/shop/shoes/air-max\` with two params.
**Real example from this website:** these notes live at \`app/notes/[techStack]/[lectureSlug]/page.js\`. The URL you are reading — \`/notes/nextjs/lecture-3\` — gives \`techStack = "nextjs"\` and \`lectureSlug = "lecture-3"\`.`
    },
    {
      heading: "2. Reading params — Async in Next.js 16",
      content: `In Next.js 16, \`params\` is a **Promise**. You must \`await\` it (or unwrap it with React's \`use()\` in a Client Component). Synchronous access, which worked with a warning in Next.js 15, has been **removed**.
Why a Promise? It lets Next.js start rendering the parts of your page that don't depend on the URL before the params are resolved, and it unlocks Partial Prerendering.
\`params\` is available in \`page.js\`, \`layout.js\`, \`route.js\`, \`default.js\`, \`generateMetadata\` and image-generation files like \`opengraph-image.js\`.`,
      codeSnippet: `// app/blog/[slug]/page.js  →  /blog/:slug
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/posts";

export default async function PostPage({ params }) {
  const { slug } = await params;          // ✅ Next.js 16
  // const { slug } = params;             // ❌ removed in Next.js 16

  const post = await getPostBySlug(slug);
  if (!post) notFound();                  // renders the nearest not-found.js

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.excerpt}</p>
    </article>
  );
}`
    },
    {
      heading: "3. Type-Safe Params with PageProps (TypeScript)",
      content: `If you use TypeScript, Next.js can generate **global type helpers** so you never hand-write param types:
• **\`PageProps<"/blog/[slug]">\`** — typed \`params\` and \`searchParams\` for a page.
• **\`LayoutProps<"/dashboard">\`** — typed \`params\` and \`children\` for a layout.
• **\`RouteContext<"/api/users/[id]">\`** — typed context for Route Handlers.
They are generated during \`next dev\` / \`next build\`, or on demand with \`npx next typegen\`. The route string is checked — a typo becomes a type error.`,
      codeSnippet: `// app/blog/[slug]/page.tsx
export default async function Page(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;      // slug: string
  const query = await props.searchParams;   // Record<string, string | string[] | undefined>
  return <h1>Blog post: {slug}</h1>;
}

// Generate the helpers without starting the server:
// npx next typegen`
    },
    {
      heading: "4. Multiple Dynamic Segments",
      content: `Nest dynamic folders to capture several values. Each folder adds one key to \`params\`. A layout receives only the params for its own segment and the segments above it.`,
      codeSnippet: `// app/shop/[category]/[product]/page.js
// /shop/shoes/air-max  →  { category: "shoes", product: "air-max" }
export default async function ProductPage({ params }) {
  const { category, product } = await params;
  return (
    <h1>
      {product} in {category}
    </h1>
  );
}

// app/shop/[category]/layout.js
// Receives { category } only — not { product }
export default async function CategoryLayout({ children, params }) {
  const { category } = await params;
  return (
    <section>
      <h2>Category: {category}</h2>
      {children}
    </section>
  );
}`
    },
    {
      heading: "5. Catch-All & Optional Catch-All Segments",
      content: `Sometimes a route must match **any depth** of URL — documentation paths, file browsers, CMS pages.
• **Catch-all \`[...slug]\`** — matches one or more segments. \`/docs/a\` → \`{ slug: ["a"] }\`, \`/docs/a/b/c\` → \`{ slug: ["a", "b", "c"] }\`. It does **not** match \`/docs\` itself.
• **Optional catch-all \`[[...slug]]\`** — same, but **also** matches the parent with no segments: \`/docs\` → \`{ slug: undefined }\`.
The value is always an **array of strings** (or \`undefined\` for the optional root).`,
      codeSnippet: `// app/docs/[[...slug]]/page.js
// /docs              → slug: undefined
// /docs/routing      → slug: ["routing"]
// /docs/api/link     → slug: ["api", "link"]
import { notFound } from "next/navigation";
import { getDoc } from "@/lib/docs";

export default async function DocsPage({ params }) {
  const { slug = [] } = await params;
  const path = slug.join("/") || "index";

  const doc = await getDoc(path);
  if (!doc) notFound();

  return (
    <article>
      <p>Breadcrumb: docs / {slug.join(" / ")}</p>
      <h1>{doc.title}</h1>
    </article>
  );
}`
    },
    {
      heading: "6. searchParams: Reading the Query String",
      content: `The query string (\`?q=react&page=2\`) is not part of the route — it is passed separately as \`searchParams\`, also a **Promise** in Next.js 16.
Important rules:
• \`searchParams\` is available **only in \`page.js\`**, not in layouts.
• Values are strings, or arrays of strings when a key repeats (\`?tag=a&tag=b\`).
• Reading \`searchParams\` makes the page **dynamic** — it renders at request time because the values are unknown at build time.
• Always validate and give defaults; anyone can type anything into the URL.`,
      codeSnippet: `// app/products/page.js  →  /products?q=shoe&sort=price&page=2
import { searchProducts } from "@/lib/products";

export default async function ProductsPage({ searchParams }) {
  const { q = "", sort = "newest", page = "1" } = await searchParams;
  const pageNumber = Math.max(1, Number(page) || 1);   // never trust the URL

  const products = await searchProducts({ q, sort, page: pageNumber });

  return (
    <section>
      <h1>Results for "{q}"</h1>
      <p>Sorted by {sort}, page {pageNumber}</p>
      <ul>
        {products.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </section>
  );
}`
    },
    {
      heading: "7. useParams & useSearchParams in Client Components",
      content: `Client Components can read the same values with hooks from \`next/navigation\`:
• **\`useParams()\`** — returns the current route's dynamic params as a plain object (no await).
• **\`useSearchParams()\`** — returns a read-only \`URLSearchParams\`. Use \`.get("q")\`, \`.getAll("tag")\`, \`.has("page")\`.
To **change** the query string, build a new \`URLSearchParams\` and navigate with \`router.replace\` or \`<Link>\`.
**Gotcha:** a Client Component using \`useSearchParams()\` on a statically rendered route should be wrapped in \`<Suspense>\`, otherwise everything up to the nearest Suspense boundary falls back to client-side rendering.`,
      codeSnippet: `// components/SortSelect.jsx
"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function onChange(e) {
    const params = new URLSearchParams(searchParams);
    params.set("sort", e.target.value);
    params.delete("page");                       // reset pagination
    router.replace(pathname + "?" + params.toString());
  }

  return (
    <select defaultValue={searchParams.get("sort") ?? "newest"} onChange={onChange}>
      <option value="newest">Newest</option>
      <option value="price">Price</option>
    </select>
  );
}

// app/products/page.js
// <Suspense fallback={null}><SortSelect /></Suspense>`
    },
    {
      heading: "8. Handling Missing Data with notFound()",
      content: `When a dynamic URL points to something that doesn't exist (\`/blog/does-not-exist\`), call \`notFound()\` from \`next/navigation\`.
• It throws internally, stopping the render — code after it never runs.
• Next.js renders the **closest \`not-found.js\`** file up the tree (or the default 404 page).
• The response gets a **404 status**, which tells search engines not to index the URL.
You can add a \`not-found.js\` inside a specific segment (e.g. \`app/blog/not-found.js\`) for a context-aware message like "This post doesn't exist — see the latest posts".`,
      codeSnippet: `// app/blog/not-found.js
import Link from "next/link";

export default function PostNotFound() {
  return (
    <div>
      <h1>Post not found</h1>
      <p>The article you're looking for was moved or never existed.</p>
      <Link href="/blog">Browse all posts →</Link>
    </div>
  );
}`
    },
    {
      heading: "9. Prerendering Dynamic Routes with generateStaticParams",
      content: `By default a dynamic route renders **on demand** because Next.js doesn't know which slugs exist. If you can list them at build time, export **\`generateStaticParams\`** and Next.js will prerender every page as static HTML — the fastest possible delivery from a CDN.
• Return an **array of params objects**, one per page.
• It runs at **build time** (and is deduplicated: identical fetches inside it are shared with the page).
• For nested dynamic segments, return all keys — or let a parent layout generate the outer param.
**This website uses exactly this pattern**: \`generateStaticParams\` loops over every tech stack and lecture, so all notes pages are prebuilt during \`next build\`.`,
      codeSnippet: `// app/notes/[techStack]/[lectureSlug]/page.js  (simplified from this site)
import { getAllTechStacks, getLecture } from "@/lib/notesData";

export async function generateStaticParams() {
  const params = [];
  for (const stack of getAllTechStacks()) {
    for (const lecture of stack.lectures) {
      params.push({ techStack: stack.slug, lectureSlug: lecture.slug });
    }
  }
  return params; // [{ techStack: "react", lectureSlug: "lecture-1" }, ...]
}

export default async function LecturePage({ params }) {
  const { techStack, lectureSlug } = await params;
  const lecture = getLecture(techStack, lectureSlug);
  return <h1>{lecture.title}</h1>;
}`
    },
    {
      heading: "10. dynamicParams: What Happens to Unknown Slugs?",
      content: `When \`generateStaticParams\` returns a list, what should happen for a slug that wasn't in it — for example a blog post published after the build?
Control it with the \`dynamicParams\` route segment config:
• **\`export const dynamicParams = true\`** (default) — unknown params are rendered **on demand** on first request (and can be cached afterwards). Good for growing content.
• **\`export const dynamicParams = false\`** — unknown params return a **404**. Good when the list is complete and fixed (e.g. a fixed set of languages or categories).
**Large sites tip:** you don't have to prerender everything. Return only the most popular 100 pages from \`generateStaticParams\` and let the rest render on demand — builds stay fast.`,
      codeSnippet: `// app/[lang]/page.js — only these languages exist
export const dynamicParams = false; // /fr works, /xx → 404

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "hi" }, { lang: "fr" }];
}

export default async function Home({ params }) {
  const { lang } = await params;
  return <h1>Language: {lang}</h1>;
}

// app/blog/[slug]/page.js — prerender top posts, render the rest on demand
export async function generateStaticParams() {
  const popular = await fetch("https://api.example.com/posts?popular=100").then((r) => r.json());
  return popular.map((post) => ({ slug: post.slug }));
}`
    },
    {
      heading: "11. Route Matching Priority",
      content: `When several routes could match a URL, Next.js chooses the most specific one:
1. **Static segments** win: \`app/blog/new/page.js\` beats \`app/blog/[slug]/page.js\` for \`/blog/new\`.
2. **Dynamic segments** \`[slug]\` come next.
3. **Catch-all** \`[...slug]\` matches what's left.
4. **Optional catch-all** \`[[...slug]]\` is the broadest.
You can't have two different dynamic names at the same level (\`[id]\` and \`[slug]\` side by side) — Next.js can't decide between them and throws an error.`
    },
    {
      heading: "12. Practical: A Static Blog with Dynamic Posts",
      content: `This complete example builds a blog index and post pages from local data. Every post is prerendered at build time, unknown slugs return a 404, and each post links to the next one.
After creating it, run \`npm run build\` and look at the route summary: the post routes are marked as prerendered (SSG), and the output lists each generated path.`,
      codeSnippet: `// lib/posts.js
export const posts = [
  { slug: "hello-nextjs", title: "Hello Next.js 16", body: "Routing is just folders." },
  { slug: "server-components", title: "Server Components", body: "Zero JS by default." },
  { slug: "caching", title: "Caching Explained", body: "use cache + cacheLife." },
];
export const getPost = (slug) => posts.find((p) => p.slug === slug);

// app/blog/page.js
import Link from "next/link";
import { posts } from "@/lib/posts";

export default function BlogIndex() {
  return (
    <ul>
      {posts.map((p) => (
        <li key={p.slug}>
          <Link href={"/blog/" + p.slug}>{p.title}</Link>
        </li>
      ))}
    </ul>
  );
}

// app/blog/[slug]/page.js
import Link from "next/link";
import { notFound } from "next/navigation";
import { posts, getPost } from "@/lib/posts";

export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const index = posts.indexOf(post);
  const next = posts[index + 1];

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
      {next && <Link href={"/blog/" + next.slug}>Next: {next.title} →</Link>}
    </article>
  );
}`
    },
    {
      heading: "13. Summary",
      content: `• \`[param]\` folders create dynamic segments; nest them for multiple params.
• \`[...slug]\` catches one or more segments; \`[[...slug]]\` also matches the parent route.
• In Next.js 16, \`params\` and \`searchParams\` are **Promises** — always \`await\` them. \`PageProps\` / \`LayoutProps\` give you full type safety.
• \`searchParams\` exist only in pages and make the route dynamic; validate every value.
• Client Components use \`useParams()\` and \`useSearchParams()\` (wrap the latter in \`<Suspense>\` on static routes).
• \`notFound()\` renders the closest \`not-found.js\` with a 404 status.
• \`generateStaticParams\` prerenders dynamic pages at build time; \`dynamicParams\` decides whether unknown params render on demand or 404.
**Next lecture:** special files — \`loading.js\`, \`error.js\`, \`not-found.js\`, templates, plus advanced routing with parallel and intercepting routes.`
    }
  ]
};
