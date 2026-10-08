export const lecture16 = {
  slug: "lecture-16",
  number: 16,
  title: "Complete Next.js Course — Lecture 16: Content Sites — MDX, Headless CMS & Draft Mode",
  summary: "Build content-driven sites the Next.js 16 way: Markdown vs. MDX, setting up @next/mdx with the required mdx-components file, file-based and imported MDX, dynamic MDX blogs with generateStaticParams, metadata and frontmatter, remark/rehype plugins under Turbopack, remote MDX, integrating a headless CMS with cache tags and webhooks, and secure Draft Mode previews for editors.",
  readTime: "29 min read",
  difficulty: "Advanced",
  date: "2026-10-08",
  sections: [
    {
      heading: "1. Content Strategies for Next.js Sites",
      content: `Blogs, documentation, marketing pages and course notes are **content-driven**: the content changes more often than the code, and often non-developers write it. There are three main ways to manage it:
• **Content in code (data files)** — JavaScript/JSON objects in the repo. Simple and fully typed. **This website's notes work this way**: each lecture is a JS object in \`lib/notesData/\`.
• **Content in files (Markdown/MDX)** — \`.md\` / \`.mdx\` files in the repo. Pleasant to write, versioned in git, reviewed in pull requests. Ideal for developer blogs and docs.
• **Content in a headless CMS** — Sanity, Contentful, Strapi, Payload, Storyblok, Hygraph, WordPress (headless). Editors get a web UI, workflows and media management; Next.js fetches content via API.
All three end up the same way in Next.js: **prerendered static pages**, revalidated when content changes.`
    },
    {
      heading: "2. Markdown vs. MDX",
      content: `• **Markdown** — a lightweight syntax that converts to HTML: \`# Heading\`, \`**bold**\`, lists, links, code blocks. Great for prose.
• **MDX** — Markdown **plus JSX**. You can import and render React components directly inside your content: an interactive chart, a callout box, a live code playground, a newsletter signup.
MDX files compile to React components at build time. In the App Router they render as **Server Components** by default, so MDX pages ship no extra JavaScript unless you include interactive Client Components.`,
      codeSnippet: `{/* content/hello.mdx */}
import { Callout } from "@/components/mdx/Callout";
import Counter from "@/components/Counter";

# Hello, MDX 👋

This is **Markdown** — paragraphs, lists and links all work.

<Callout type="tip">
  Components render right inside the content.
</Callout>

Here's an interactive component:

<Counter initial={3} />`
    },
    {
      heading: "3. Setting Up @next/mdx",
      content: `The official \`@next/mdx\` package compiles MDX during the build. Setup has three parts:
1. **Install** \`@next/mdx\`, \`@mdx-js/loader\`, \`@mdx-js/react\` (and \`@types/mdx\` for TypeScript).
2. **Configure** \`next.config.mjs\` with \`createMDX\` and add \`md\`/\`mdx\` to \`pageExtensions\` if you want MDX files to act as routes.
3. **Create \`mdx-components.js\`** in the project root (next to \`app/\`, or inside \`src/\`). This file is **required** for \`@next/mdx\` to work with the App Router — it maps Markdown elements to your own components.
The config must be **\`.mjs\`** (or \`.ts\`) because the remark/rehype ecosystem is ESM-only.`,
      codeSnippet: `# 1. Install
npm install @next/mdx @mdx-js/loader @mdx-js/react

// 2. next.config.mjs
import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

const withMDX = createMDX({
  // extension: /\\.(md|mdx)$/,   // uncomment to also compile plain .md files
});

export default withMDX(nextConfig);

// 3. mdx-components.js (project root) — required
export function useMDXComponents() {
  return {};
}`
    },
    {
      heading: "4. Styling Markdown Elements with mdx-components",
      content: `\`useMDXComponents\` returns a map from HTML element names to components. Every \`# heading\` becomes your \`h1\`, every image becomes \`next/image\`, every link can become \`next/link\` for internal URLs.
This is how you give all content a consistent design without adding classes in every file — and how you get optimized images automatically.
You can also register **custom components** (like \`Callout\`) here so authors can use them in any MDX file without importing them.`,
      codeSnippet: `// mdx-components.js
import Image from "next/image";
import Link from "next/link";
import { Callout } from "@/components/mdx/Callout";

const components = {
  h1: ({ children }) => <h1 style={{ fontSize: 40, color: "#002057", fontWeight: 800 }}>{children}</h1>,
  h2: ({ children }) => <h2 style={{ fontSize: 28, color: "#002057", marginTop: 40 }}>{children}</h2>,
  p: ({ children }) => <p style={{ fontSize: 17, lineHeight: 1.8, color: "#334155" }}>{children}</p>,
  a: ({ href = "", children }) =>
    href.startsWith("/") ? <Link href={href}>{children}</Link> : <a href={href} target="_blank" rel="noreferrer">{children}</a>,
  img: (props) => (
    <Image sizes="100vw" style={{ width: "100%", height: "auto", borderRadius: 16 }} width={1200} height={630} {...props} />
  ),
  pre: ({ children }) => <pre style={{ background: "#0f172a", color: "#f8fafc", padding: 20, borderRadius: 12, overflowX: "auto" }}>{children}</pre>,
  Callout, // available in every MDX file without importing
};

export function useMDXComponents() {
  return components;
}`
    },
    {
      heading: "5. Rendering MDX: File-Based Routes and Imports",
      content: `Two simple ways to use MDX:
• **As a page** — name the file \`page.mdx\` inside a route folder (\`app/about/page.mdx\` → \`/about\`). Requires \`mdx\` in \`pageExtensions\`. Perfect for one-off content pages.
• **As an import** — keep content in a \`content/\` folder and import it into a normal \`page.js\` like any component. This keeps routing logic in JavaScript and content separate, and lets you wrap it in a layout.
MDX files can **export metadata** just like pages, so imported posts can carry their own title and description.`,
      codeSnippet: `app/
├── about/
│   └── page.mdx            →  /about  (MDX as a route)
└── blog/
    └── welcome/
        └── page.js         →  /blog/welcome (imports the MDX below)
content/
└── welcome.mdx

// content/welcome.mdx
export const metadata = {
  title: "Welcome to my blog",
  description: "Why I started writing about Next.js",
  date: "2026-10-08",
};

# Welcome!

Thanks for reading.

// app/blog/welcome/page.js
import Welcome, { metadata as post } from "@/content/welcome.mdx";

export const metadata = { title: post.title, description: post.description };

export default function Page() {
  return (
    <article>
      <p>{post.date}</p>
      <Welcome />
    </article>
  );
}`
    },
    {
      heading: "6. A Dynamic MDX Blog with generateStaticParams",
      content: `For a real blog you don't want a folder per post. Use a dynamic \`[slug]\` route that **dynamically imports** the matching MDX file, and \`generateStaticParams\` to prerender every post at build time.
• List posts by reading the \`content/blog\` directory with Node's \`fs\` at build time.
• Set \`dynamicParams = false\` so a URL without a matching file returns a 404 instead of crashing.
• Read each file's exported \`metadata\` for the listing page and for \`generateMetadata\`.`,
      codeSnippet: `// lib/posts.js
import "server-only";
import fs from "node:fs";
import path from "node:path";

const DIR = path.join(process.cwd(), "content/blog");

export function getPostSlugs() {
  return fs.readdirSync(DIR).filter((f) => f.endsWith(".mdx")).map((f) => f.replace(/\\.mdx$/, ""));
}

export async function getPost(slug) {
  // A template literal with a static prefix lets the bundler include every .mdx file in the folder
  const mod = await import(\`@/content/blog/\${slug}.mdx\`);
  return { slug, Content: mod.default, meta: mod.metadata };
}

export async function getAllPosts() {
  const posts = await Promise.all(getPostSlugs().map(getPost));
  return posts.sort((a, b) => new Date(b.meta.date) - new Date(a.meta.date));
}

// app/blog/[slug]/page.js
import { getPost, getPostSlugs } from "@/lib/posts";

export const dynamicParams = false;

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { meta } = await getPost(slug);
  return { title: meta.title, description: meta.description };
}

export default async function PostPage({ params }) {
  const { slug } = await params;
  const { Content, meta } = await getPost(slug);
  return (
    <article>
      <h1>{meta.title}</h1>
      <time dateTime={meta.date}>{meta.date}</time>
      <Content />
    </article>
  );
}`
    },
    {
      heading: "7. Frontmatter vs. Exported Metadata",
      content: `Many Markdown tools use **frontmatter** — a YAML block at the top of the file:
\`---\` / \`title: Hello\` / \`date: 2026-10-08\` / \`---\`
**\`@next/mdx\` does not support frontmatter by default.** You have two options:
• **Export a JavaScript object** from the MDX file (\`export const metadata = {...}\`) — supported out of the box, typed, and importable (used in this lecture).
• **Add plugins** like \`remark-frontmatter\` + \`remark-mdx-frontmatter\` to turn YAML frontmatter into an export — useful when migrating existing Markdown content from another blog engine.
If your content team already writes frontmatter, or the files come from somewhere else, a remote-MDX library (section 9) usually parses frontmatter for you.`
    },
    {
      heading: "8. Remark and Rehype Plugins (with Turbopack)",
      content: `MDX compiles in two stages, each with a plugin ecosystem:
• **remark** plugins transform the **Markdown** syntax tree — e.g. \`remark-gfm\` adds GitHub Flavored Markdown (tables, strikethrough, task lists, autolinks).
• **rehype** plugins transform the **HTML** syntax tree — e.g. \`rehype-slug\` adds \`id\`s to headings, \`rehype-autolink-headings\` makes them linkable, \`rehype-pretty-code\` or \`rehype-highlight\` add syntax highlighting, \`rehype-katex\` renders math.
**Turbopack note (default in Next.js 16):** JavaScript functions can't be passed from the Next.js config to Turbopack's Rust core. So with Turbopack, specify plugins **by package name as strings** (with options in a tuple). Plugins whose options aren't serializable (they contain functions) can't be used with Turbopack yet.`,
      codeSnippet: `// npm install remark-gfm rehype-slug rehype-autolink-headings

// next.config.mjs
import createMDX from "@next/mdx";

const nextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx"],
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      "remark-gfm",                                  // string = works with Turbopack
    ],
    rehypePlugins: [
      "rehype-slug",
      ["rehype-autolink-headings", { behavior: "wrap" }], // [name, serializable options]
    ],
  },
});

export default withMDX(nextConfig);`
    },
    {
      heading: "9. Remote MDX: Content from a Database or CMS",
      content: `\`@next/mdx\` compiles **local files** at build time. When MDX lives elsewhere — a database, a GitHub repo, a CMS field — compile it at request or build time with a remote-MDX library such as **\`next-mdx-remote-client\`** or **\`next-mdx-remote\`**. They expose an async Server Component that takes the MDX string and your components.
**Security warning:** compiling MDX **executes JavaScript**. Only render MDX from **trusted** sources (your own team). Never compile MDX that untrusted users can submit — that's remote code execution. For user-generated content, use plain Markdown rendered to sanitized HTML instead.
Combine remote MDX with caching (\`"use cache"\` + \`cacheTag\`) so content is compiled once, not on every request.`,
      codeSnippet: `// npm install next-mdx-remote-client
// app/docs/[slug]/page.js
import { MDXRemote } from "next-mdx-remote-client/rsc";
import { cacheLife, cacheTag } from "next/cache";
import { Callout } from "@/components/mdx/Callout";

async function getDoc(slug) {
  "use cache";
  cacheLife("days");
  cacheTag("docs", "doc-" + slug);
  const res = await fetch("https://cms.example.com/api/docs/" + slug);
  return res.json(); // { title, mdx }  — written by YOUR team only
}

export default async function DocPage({ params }) {
  const { slug } = await params;
  const doc = await getDoc(slug);
  return (
    <article>
      <h1>{doc.title}</h1>
      <MDXRemote source={doc.mdx} components={{ Callout }} />
    </article>
  );
}`
    },
    {
      heading: "10. Integrating a Headless CMS",
      content: `A headless CMS stores content and exposes it via a REST or GraphQL API; Next.js renders it. The production pattern:
1. **Fetch** content in Server Components through a small \`lib/cms.js\` client (API token in a server-only env var).
2. **Cache** every read with \`"use cache"\`, a long \`cacheLife\` (\`"days"\` or \`"max"\`), and **tags** per content type and entry (\`posts\`, \`post-my-slug\`).
3. **Prerender** pages with \`generateStaticParams\` (fetch the list of slugs from the CMS).
4. **Revalidate on publish**: configure a **webhook** in the CMS that calls a Route Handler, which verifies a secret and calls \`revalidateTag(tag, "max")\`.
Result: pages are static and instant, yet an editor's change appears on the live site within seconds of clicking "Publish" — no rebuild needed.`,
      codeSnippet: `// lib/cms.js
import "server-only";
import { cacheLife, cacheTag } from "next/cache";

async function cmsFetch(path) {
  const res = await fetch("https://api.example-cms.com/v1" + path, {
    headers: { Authorization: "Bearer " + process.env.CMS_API_TOKEN },
  });
  if (!res.ok) throw new Error("CMS request failed: " + res.status);
  return res.json();
}

export async function getPosts() {
  "use cache";
  cacheLife("max");
  cacheTag("posts");
  return cmsFetch("/posts?status=published");
}

export async function getPost(slug) {
  "use cache";
  cacheLife("max");
  cacheTag("posts", "post-" + slug);
  return cmsFetch("/posts/" + slug);
}

// app/api/revalidate/route.js — called by the CMS webhook on publish
import { revalidateTag } from "next/cache";

export async function POST(request) {
  if (request.headers.get("x-webhook-secret") !== process.env.CMS_WEBHOOK_SECRET) {
    return Response.json({ error: "Invalid secret" }, { status: 401 });
  }
  const { type, slug } = await request.json();   // e.g. { type: "post", slug: "hello" }
  revalidateTag(type + "s", "max");
  if (slug) revalidateTag(type + "-" + slug, "max");
  return Response.json({ revalidated: true });
}`
    },
    {
      heading: "11. Draft Mode: Previewing Unpublished Content",
      content: `Editors want to see a draft **on the real site** before publishing — but your pages are static and cached. **Draft Mode** solves this: when enabled for a browser, Next.js **bypasses the caches and renders pages at request time** for that browser only, so you can fetch draft content.
How it works:
• \`(await draftMode()).enable()\` sets a special cookie (\`__prerender_bypass\`). Requests carrying it skip the static and data caches.
• In pages, read \`(await draftMode()).isEnabled\` and fetch **draft** content from the CMS when true.
• \`disable()\` removes the cookie.
Draft Mode is not available in a static export (Lecture 18) — it needs a server.`
    },
    {
      heading: "12. Implementing Draft Mode Securely",
      content: `The flow, step by step:
1. In the CMS, configure a **preview URL** like \`https://yoursite.com/api/draft?secret=TOKEN&slug=my-post\`.
2. A Route Handler **verifies the secret** (stored in an env var, never hard-coded) and that the slug exists, then enables Draft Mode and redirects to the post.
3. The page checks \`isEnabled\` and requests the **draft** version from the CMS.
4. A **banner** in the root layout tells editors they're in preview, with an **exit** button (a Server Action that calls \`disable()\`).
**Security:** validate the slug against the CMS before redirecting — otherwise attackers can abuse the endpoint as an open redirect. Use a long random secret and rotate it if leaked.`,
      codeSnippet: `// app/api/draft/route.js
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { getPostForPreview } from "@/lib/cms";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const slug = searchParams.get("slug");

  if (secret !== process.env.DRAFT_SECRET || !slug) {
    return new Response("Invalid token", { status: 401 });
  }

  const post = await getPostForPreview(slug);          // verify the slug really exists
  if (!post) return new Response("Invalid slug", { status: 401 });

  (await draftMode()).enable();
  redirect("/blog/" + post.slug);                     // trusted path, not the raw query value
}

// app/blog/[slug]/page.js
import { draftMode } from "next/headers";
import { getPost, getDraftPost } from "@/lib/cms";

export default async function PostPage({ params }) {
  const { slug } = await params;
  const { isEnabled } = await draftMode();
  const post = isEnabled ? await getDraftPost(slug) : await getPost(slug);
  return <article><h1>{post.title}</h1></article>;
}

// app/components/PreviewBanner.jsx — render in the root layout
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

async function exitPreview() {
  "use server";
  (await draftMode()).disable();
  redirect("/");
}

export async function PreviewBanner() {
  const { isEnabled } = await draftMode();
  if (!isEnabled) return null;
  return (
    <aside role="status">
      Preview mode is on.
      <form action={exitPreview}><button type="submit">Exit preview</button></form>
    </aside>
  );
}`
    },
    {
      heading: "13. Draft Mode with Cache Components",
      content: `With \`cacheComponents: true\`, you can read \`isEnabled\` from \`draftMode()\` **inside** a \`"use cache"\` scope — the one runtime API allowed there. When Draft Mode is on, the cache is still **bypassed**, so the cached component re-executes for the editor and can show a "Draft preview" label, while regular visitors keep getting the cached version.
Other runtime APIs (\`cookies()\`, \`headers()\`) remain off-limits inside \`"use cache"\` — read them outside and pass values in as arguments (Lecture 7).`,
      codeSnippet: `import { draftMode } from "next/headers";
import { cacheLife, cacheTag } from "next/cache";

async function Post({ slug }) {
  "use cache";
  cacheLife("max");
  cacheTag("post-" + slug);

  const { isEnabled } = await draftMode();           // allowed inside "use cache"
  const post = await fetch(
    "https://cms.example.com/posts/" + slug + (isEnabled ? "?draft=true" : "")
  ).then((r) => r.json());

  return (
    <article>
      {isEnabled && <p role="status">Draft preview</p>}
      <h1>{post.title}</h1>
    </article>
  );
}`
    },
    {
      heading: "14. Practical: A Developer Blog with MDX + CMS Preview",
      content: `A complete content setup that scales from a personal blog to a team publication:
• **Local MDX** for long-form technical articles written by developers, with \`remark-gfm\`, heading anchors and a styled \`mdx-components.js\`.
• **CMS** for short news posts written by non-developers, cached with tags and revalidated by webhook.
• **Draft Mode** so editors preview CMS drafts on the real site.
• **SEO** from Lecture 11: \`generateMetadata\` per post, \`opengraph-image.js\`, and a sitemap that merges MDX and CMS posts.`,
      codeSnippet: `next.config.mjs                 // createMDX with "remark-gfm", "rehype-slug" (string plugins)
mdx-components.js               // headings, links, next/image, Callout
content/blog/*.mdx              // developer articles with export const metadata
lib/posts.js                    // getPostSlugs, getPost (dynamic import), getAllPosts
lib/cms.js                      // cmsFetch + "use cache" + cacheTag
app/blog/[slug]/page.js         // MDX posts: generateStaticParams, dynamicParams = false
app/news/[slug]/page.js         // CMS posts: draftMode() → draft or published
app/api/revalidate/route.js     // webhook → revalidateTag(tag, "max")
app/api/draft/route.js          // secret + slug check → draftMode().enable()
app/components/PreviewBanner.jsx
app/sitemap.js                  // MDX slugs + CMS slugs`
    },
    {
      heading: "15. Summary",
      content: `• Content can live in code, in Markdown/MDX files, or in a headless CMS — all render to prerendered static pages.
• MDX = Markdown + JSX; it compiles to Server Components and can embed interactive Client Components.
• \`@next/mdx\` needs \`createMDX\` in \`next.config.mjs\`, \`pageExtensions\` for MDX routes, and a **required** \`mdx-components.js\`.
• Use \`mdx-components\` to style elements globally and swap in \`next/image\` / \`next/link\`.
• Build blogs with a dynamic route, dynamic \`import()\` of MDX files, \`generateStaticParams\` and \`dynamicParams = false\`.
• \`@next/mdx\` has no frontmatter by default — export metadata objects or add remark frontmatter plugins.
• With Turbopack, pass remark/rehype plugins as **strings** with serializable options.
• Remote MDX executes code — only render trusted content.
• CMS pattern: cached reads with tags + webhook calling \`revalidateTag(tag, "max")\`.
• Draft Mode bypasses caches per browser for previews; protect the entry route with a secret and slug validation.
**Next lecture:** View Transitions and React 19.2 features — animated navigations, \`<Activity>\`, \`useEffectEvent\` and how Next.js preserves UI state.`
    }
  ]
};
