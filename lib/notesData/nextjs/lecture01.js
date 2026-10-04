export const lecture01 = {
  slug: "lecture-1",
  number: 1,
  title: "Complete Next.js Course — Lecture 1: Introduction to Next.js 16 & Project Setup",
  summary: "What Next.js is, why teams choose it over plain React, every rendering strategy explained (CSR, SSR, SSG, ISR, Streaming, PPR), what changed in Next.js 16, and a step-by-step project setup with a full tour of the folder structure.",
  readTime: "28 min read",
  difficulty: "Beginner",
  date: "2026-10-04",
  sections: [
    {
      heading: "1. What is Next.js?",
      content: `**Next.js** is a full-stack React framework built by Vercel. React gives you a way to build user interfaces out of components; Next.js gives you everything else a real production application needs around those components.
• **Routing** — every folder inside \`app/\` becomes a URL automatically. No router library to configure.
• **Rendering on the server** — pages can be rendered to HTML on the server, at build time, or streamed in pieces, instead of shipping an empty \`<div id="root">\` to the browser.
• **Data fetching** — components can be \`async\` and read from a database or API directly.
• **Backend code** — Server Actions and Route Handlers let you write APIs and form handlers in the same project.
• **Optimizations** — images, fonts, scripts, code splitting and caching are handled by built-in components and the compiler.
**Simple definition:** React is the engine; Next.js is the complete car built around it — routing, rendering, data, backend and performance included.`
    },
    {
      heading: "2. Why Next.js? Problems It Solves Over Plain React",
      content: `A plain React app built with Vite is a **Single Page Application (SPA)**. The server sends an almost empty HTML file plus a large JavaScript bundle, and the browser builds the page. That works, but it creates real problems at scale:
• **SEO & social previews** — search engines and link-preview bots see an empty page until JavaScript runs. Next.js sends fully rendered HTML.
• **Slow first load** — users stare at a blank screen while the bundle downloads and executes. Server rendering shows content immediately.
• **Data waterfalls** — component mounts → \`useEffect\` → fetch → render child → fetch again. Server Components fetch data on the server, close to the database.
• **Too much JavaScript** — every component ships to the browser. In Next.js, Server Components ship **zero** client JavaScript.
• **Glue code** — routing, code splitting, API servers, image optimization and environment handling all need separate libraries in a SPA. Next.js includes them.
**Who uses it:** Netflix, TikTok, Twitch, Notion, Hulu, Nike, OpenAI, Anthropic, and this very portfolio — the notes you are reading are rendered by Next.js.`
    },
    {
      heading: "3. Rendering Strategies Explained (CSR, SSR, SSG, ISR, Streaming, PPR)",
      content: `Understanding **where and when HTML is produced** is the single most important concept in Next.js.
• **CSR — Client-Side Rendering**: the browser downloads JavaScript and renders everything. Used for highly interactive widgets inside a page.
• **SSR — Server-Side Rendering**: HTML is generated on the server **for every request**. Always fresh, good for personalized pages (dashboards, carts).
• **SSG — Static Site Generation**: HTML is generated **once at build time** and served from a CDN. Fastest possible, ideal for blogs, docs and marketing pages.
• **ISR — Incremental Static Regeneration**: static pages that **regenerate in the background** after a time interval or on demand. Static speed with fresh-enough data.
• **Streaming**: the server sends the page in chunks. The shell appears instantly and slow sections stream in later, using React \`<Suspense>\`.
• **PPR — Partial Prerendering**: one page mixes a **static shell** (prerendered) with **dynamic holes** that stream at request time. In Next.js 16 this is the default model when you enable Cache Components (Lecture 7).
**Key idea:** in Next.js you rarely pick one mode for the whole app. Each route — and even each component — gets the strategy it needs.`
    },
    {
      heading: "4. App Router vs. Pages Router",
      content: `Next.js has two routers. New projects should use the **App Router**.
• **App Router (\`app/\` directory)** — built on React Server Components. Supports nested layouts, streaming, Server Actions, the new caching model and every Next.js 16 feature. This entire course uses it.
• **Pages Router (\`pages/\` directory)** — the original router (Next.js 1–12 era) using \`getServerSideProps\` and \`getStaticProps\`. Still supported for existing apps, but it receives no new architecture features.
Both routers can live in one project during a migration, but a route must exist in only one of them.`
    },
    {
      heading: "5. What's New in Next.js 16",
      content: `Next.js 16 is a major release. If you learned Next.js from older tutorials, these are the changes you must know:
• **Turbopack is the default bundler** for both \`next dev\` and \`next build\` — no more \`--turbopack\` flag. Use \`--webpack\` to opt out.
• **Cache Components** — enable \`cacheComponents: true\` to get the \`"use cache"\` directive and Partial Prerendering as the default rendering model.
• **\`middleware\` renamed to \`proxy\`** — the file is now \`proxy.js\` and the exported function is \`proxy\`. It runs on the Node.js runtime.
• **Async Request APIs only** — \`params\`, \`searchParams\`, \`cookies()\`, \`headers()\` and \`draftMode()\` must be awaited. Synchronous access is removed.
• **New caching APIs** — \`updateTag()\` (read-your-writes), \`refresh()\`, and \`revalidateTag(tag, profile)\` now needs a second argument. \`cacheLife\` and \`cacheTag\` are stable.
• **React 19.2** — View Transitions, \`useEffectEvent\` and \`<Activity>\`.
• **React Compiler support is stable** via \`reactCompiler: true\` (opt-in).
• **Faster navigation** — layouts are deduplicated during prefetching and only missing parts are fetched.
• **Removed**: AMP, the \`next lint\` command (use ESLint directly), and \`serverRuntimeConfig\` / \`publicRuntimeConfig\` (use environment variables).
• **Parallel routes** now require an explicit \`default.js\` in every slot.`
    },
    {
      heading: "6. Prerequisites & System Requirements",
      content: `Before starting, make sure your machine meets the Next.js 16 minimums:
• **Node.js 20.9 or newer** (Node 18 is no longer supported). Check with \`node -v\`.
• **TypeScript 5.1+** if you use TypeScript.
• **Browsers**: Chrome/Edge/Firefox 111+, Safari 16.4+.
**Knowledge you should have:** modern JavaScript (arrow functions, destructuring, modules, \`async/await\`, promises) and React basics (components, props, state, hooks). If you need a refresher, complete the React track on this site first.`
    },
    {
      heading: "7. Creating Your First Next.js Project",
      content: `The official CLI \`create-next-app\` scaffolds a project with sensible defaults. Run it with \`npx\` so you always get the latest version.
The CLI asks a few questions. Recommended answers for this course:
• **TypeScript?** Your choice — examples here use JavaScript so beginners can follow; everything works the same in TypeScript.
• **ESLint?** Yes.
• **Tailwind CSS?** Optional (covered in Lecture 10).
• **\`src/\` directory?** Optional — it only moves \`app/\` inside \`src/\`.
• **App Router?** **Yes** (required for this course).
• **Import alias?** Keep the default \`@/*\`, which lets you write \`import Navbar from "@/components/Navbar"\` instead of long relative paths.`,
      codeSnippet: `# Create a new project (interactive prompts)
npx create-next-app@latest my-next-app

# Or skip the prompts with the recommended defaults
npx create-next-app@latest my-next-app --yes

# Move into the project and start the dev server
cd my-next-app
npm run dev

# Open http://localhost:3000 in your browser`
    },
    {
      heading: "8. Project Structure Tour",
      content: `A fresh project looks like this. Knowing what each item does saves hours of confusion later:
• **\`app/\`** — the App Router. Folders become routes; special files (\`page.js\`, \`layout.js\`, ...) define UI.
• **\`app/layout.js\`** — the **root layout**, required. It must render \`<html>\` and \`<body>\` and wraps every page.
• **\`app/page.js\`** — the home page at \`/\`.
• **\`app/globals.css\`** — global styles imported once in the root layout.
• **\`public/\`** — static files served from the site root: \`public/logo.png\` is available at \`/logo.png\`.
• **\`next.config.js\` / \`.mjs\` / \`.ts\`** — framework configuration.
• **\`package.json\`** — dependencies and the \`dev\`, \`build\`, \`start\` scripts.
• **\`jsconfig.json\` / \`tsconfig.json\`** — editor settings and the \`@/*\` path alias.
• **\`.next/\`** — build output generated by Next.js. Never edit or commit it. In Next.js 16, \`next dev\` writes to \`.next/dev\` so dev and build can run at the same time.
• **\`.env*\` files** — environment variables (Lecture 12). Keep them out of git.`,
      codeSnippet: `my-next-app/
├── app/
│   ├── layout.js        # Root layout (html + body) — required
│   ├── page.js          # Home page  →  /
│   ├── globals.css      # Global styles
│   └── favicon.ico
├── public/              # Static assets → served at /
│   └── next.svg
├── next.config.mjs      # Next.js configuration
├── jsconfig.json        # "@/*" import alias
├── package.json
└── .gitignore           # Already ignores .next/, node_modules/, .env*`
    },
    {
      heading: "9. Special File Conventions at a Glance",
      content: `Inside \`app/\`, file **names** have meaning. You will learn each in detail, but here is the map:
• **\`page.js\`** — the UI for a route; makes the folder publicly accessible.
• **\`layout.js\`** — shared UI that wraps child routes and keeps state between navigations.
• **\`template.js\`** — like a layout, but re-mounts on every navigation.
• **\`loading.js\`** — instant loading UI shown while a route segment loads (Suspense).
• **\`error.js\`** — error boundary for a segment.
• **\`global-error.js\`** — error boundary for the root layout.
• **\`not-found.js\`** — UI for \`notFound()\` and unmatched URLs.
• **\`route.js\`** — an API endpoint (Route Handler) instead of a page.
• **\`default.js\`** — fallback UI for parallel route slots.
Any other file (components, utils, styles) inside \`app/\` is **not** routable unless it is named \`page.js\` or \`route.js\`, so you can safely colocate code next to the routes that use it.`
    },
    {
      heading: "10. Development, Build & Production Scripts",
      content: `Three scripts cover the whole lifecycle:
• **\`npm run dev\`** — starts the development server with **Turbopack**, Fast Refresh (instant updates on save) and detailed error overlays.
• **\`npm run build\`** — creates an optimized production build: prerenders static routes, bundles and minifies code, and prints a route summary showing which routes are static and which are dynamic.
• **\`npm run start\`** — serves the production build. Always test with \`build\` + \`start\` before deploying; dev mode is intentionally slower and behaves differently (no prefetching, extra checks).
**Note:** \`next build\` no longer runs the linter in Next.js 16. Run \`npx eslint .\` (or your \`lint\` script) separately in CI.`,
      codeSnippet: `// package.json (comments added for explanation — real JSON cannot contain comments)
{
  "scripts": {
    "dev": "next dev",        // Turbopack by default in Next.js 16
    "build": "next build",    // Production build (also Turbopack)
    "start": "next start",    // Serve the production build
    "lint": "eslint ."        // next lint was removed in v16
  }
}

// Need Webpack for a legacy plugin? Opt out per command:
// "build": "next build --webpack"`
    },
    {
      heading: "11. Hands-On: Your First Layout and Pages",
      content: `Let's replace the starter files with our own. The root layout renders a navigation bar on every page; two pages render inside it through the \`children\` prop.
Notice three things:
• \`metadata\` is a plain exported object — Next.js turns it into \`<title>\` and \`<meta>\` tags (Lecture 11).
• Pages are **Server Components** by default, so they can be \`async\` and no JavaScript is shipped for them.
• \`<Link>\` from \`next/link\` gives instant client-side navigation instead of full page reloads.`,
      codeSnippet: `// app/layout.js — Root layout (required)
import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "My Next.js App",
  description: "Learning Next.js 16 step by step",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
        </nav>
        <main style={{ padding: "1rem" }}>{children}</main>
      </body>
    </html>
  );
}

// app/page.js — Home page  →  /
export default function HomePage() {
  return <h1>Welcome to Next.js 16 🚀</h1>;
}

// app/about/page.js — About page  →  /about
export default async function AboutPage() {
  // Server Components can be async and fetch data directly
  const res = await fetch("https://api.github.com/repos/vercel/next.js");
  const repo = await res.json();

  return (
    <section>
      <h1>About</h1>
      <p>Next.js has {repo.stargazers_count.toLocaleString()} GitHub stars.</p>
    </section>
  );
}`
    },
    {
      heading: "12. next.config.js Essentials",
      content: `The config file controls framework behaviour. You will add to it throughout the course; the most common options are:
• **\`images.remotePatterns\`** — allow \`next/image\` to optimize images from external domains (\`images.domains\` is deprecated).
• **\`redirects()\` / \`rewrites()\` / \`headers()\`** — URL rules applied before routing.
• **\`cacheComponents\`** — enables \`"use cache"\` and Partial Prerendering.
• **\`reactCompiler\`** — automatic memoization with the React Compiler.
• **\`turbopack\`** — Turbopack options (top-level in v16, no longer under \`experimental\`).
• **\`output: "standalone"\`** — minimal server bundle for Docker deployments (Lecture 13).`,
      codeSnippet: `// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },

  async redirects() {
    return [
      { source: "/blog/:slug", destination: "/notes/:slug", permanent: true },
    ];
  },

  // Opt-in features (covered later in the course)
  // cacheComponents: true,
  // reactCompiler: true,
};

export default nextConfig;`
    },
    {
      heading: "13. Summary & What's Next",
      content: `• Next.js is a full-stack React framework: routing, server rendering, data fetching, backend code and optimizations in one tool.
• It solves SPA problems — SEO, slow first load, data waterfalls and oversized bundles.
• Each route can use the rendering strategy it needs: static, dynamic, ISR, streaming or partial prerendering.
• Always use the **App Router** for new projects.
• Next.js 16 brings Turbopack by default, Cache Components, \`proxy\` instead of \`middleware\`, and async-only request APIs.
• \`create-next-app\` scaffolds a project; \`dev\`, \`build\` and \`start\` cover the lifecycle.
**Next lecture:** file-system routing in depth — pages, nested layouts, linking, programmatic navigation, route groups and private folders.`
    }
  ]
};
