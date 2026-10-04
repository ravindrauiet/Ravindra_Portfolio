export const lecture11 = {
  slug: "lecture-11",
  number: 11,
  title: "Complete Next.js Course — Lecture 11: Metadata, SEO & Open Graph Images",
  summary: "Make every page discoverable and shareable: the static metadata object and generateMetadata, title templates, metadataBase, canonical URLs, Open Graph and Twitter cards, generated OG images with ImageResponse, favicons, sitemap.js, robots.js, manifest.js, viewport and themeColor, and safe JSON-LD structured data.",
  readTime: "25 min read",
  difficulty: "Intermediate",
  date: "2026-10-04",
  sections: [
    {
      heading: "1. Why Metadata Matters",
      content: `Metadata is information **about** a page that browsers, search engines and social networks read from the \`<head>\`:
• **\`<title>\` and description** — what appears in Google results and browser tabs. Directly affects click-through rate.
• **Open Graph & Twitter tags** — the title, description and image shown when your link is shared on LinkedIn, WhatsApp, X or Slack.
• **Canonical URL** — tells search engines which URL is the "real" one when content is reachable at several URLs.
• **Robots directives** — whether a page may be indexed.
• **Structured data (JSON-LD)** — machine-readable facts that enable rich results (articles, products, FAQs, breadcrumbs).
Because Next.js renders on the server, all of this is present in the **initial HTML** — crawlers and link-preview bots see it without running JavaScript. That's a huge SEO advantage over client-rendered SPAs.`
    },
    {
      heading: "2. Static Metadata with the metadata Object",
      content: `Export a \`metadata\` object from a \`layout.js\` or \`page.js\` (Server Components only). Next.js turns it into the correct \`<head>\` tags and **automatically deduplicates and merges** metadata from layouts down to the page.
Common fields: \`title\`, \`description\`, \`keywords\`, \`authors\`, \`alternates.canonical\`, \`openGraph\`, \`twitter\`, \`robots\`, \`icons\`, \`verification\`.
Two \`<meta>\` tags are always added for you: \`charset\` and \`viewport\`.`,
      codeSnippet: `// app/about/page.js
export const metadata = {
  title: "About",
  description: "Full stack developer and team lead specialising in React, Next.js and Node.js.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Ravindra Nath Jha",
    description: "Team Lead & Full Stack Developer.",
    url: "/about",
    type: "profile",
  },
};

export default function AboutPage() {
  return <h1>About me</h1>;
}`
    },
    {
      heading: "3. Title Templates & metadataBase",
      content: `Set site-wide defaults once in the **root layout**:
• **\`title.default\`** — used when a page doesn't set a title.
• **\`title.template\`** — wraps child titles: \`"%s | Ravindra Nath Jha"\` turns a page title "About" into "About | Ravindra Nath Jha".
• **\`title.absolute\`** — in a child, ignores the template entirely.
• **\`metadataBase\`** — the base URL for all relative URLs in metadata (canonical, Open Graph images). Without it, relative image URLs in social tags won't resolve.
**This website's root layout** uses exactly this pattern: \`metadataBase: new URL("https://ravindranathjha.in")\` with a title template.`,
      codeSnippet: `// app/layout.js
export const metadata = {
  metadataBase: new URL("https://ravindranathjha.in"),
  title: {
    default: "Ravindra Nath Jha | Full Stack Developer",
    template: "%s | Ravindra Nath Jha",
  },
  description: "Portfolio of Ravindra Nath Jha — React, Next.js, Node.js and mobile development.",
  openGraph: {
    siteName: "Ravindra Nath Jha Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

// app/notes/page.js → <title>Tech Notes | Ravindra Nath Jha</title>
export const metadata = { title: "Tech Notes" };

// app/landing/page.js → ignores the template
export const metadata = { title: { absolute: "Hire a Next.js Developer in India" } };`
    },
    {
      heading: "4. Dynamic Metadata with generateMetadata",
      content: `When metadata depends on data — a blog post's title, a product's price — export an async **\`generateMetadata\`** function instead of the object. It receives the same \`params\` and \`searchParams\` (**Promises** in Next.js 16) as the page.
• Data requests inside it are **memoized** with the page's requests (\`fetch\` automatically, or React \`cache()\` for DB calls) — no double fetching.
• **Streaming metadata:** for regular browsers, Next.js can send the initial UI first and stream the metadata in afterwards, so a slow \`generateMetadata\` doesn't delay the page. For crawlers that only read static HTML (the \`htmlLimitedBots\` list), it waits so the tags are in the initial \`<head>\`. Keep it fast anyway.
• You can't export both \`metadata\` and \`generateMetadata\` from the same file.
**Real example:** every notes page on this site uses \`generateMetadata\` to build a unique title, description, canonical URL and Open Graph article data per lecture.`,
      codeSnippet: `// app/blog/[slug]/page.js
import { notFound } from "next/navigation";
import { getPost } from "@/lib/data/posts"; // wrapped in React cache()

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post not found" };

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: "/blog/" + slug },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      authors: ["Ravindra Nath Jha"],
      images: [{ url: post.coverImage, width: 1200, height: 630, alt: post.title }],
    },
  };
}

export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = await getPost(slug); // memoized — no second query
  if (!post) notFound();
  return <article><h1>{post.title}</h1></article>;
}`
    },
    {
      heading: "5. Open Graph & Twitter Cards",
      content: `Social cards decide whether people click your shared link. Best practices:
• **Image size 1200×630** (1.91:1) works across LinkedIn, Facebook, WhatsApp and X. Keep important text away from the edges.
• **Unique title and description** per page — not the same site tagline everywhere.
• Set \`twitter.card: "summary_large_image"\` for a big preview on X.
• Child pages **replace** (not merge) the parent's \`openGraph\` object — if you set \`openGraph\` in a page, include every field you need, or spread shared values from a common object.
• Test with LinkedIn Post Inspector, the Facebook Sharing Debugger, or by pasting the link into a private chat.`,
      codeSnippet: `// lib/seo.js — shared Open Graph defaults
export const sharedOpenGraph = {
  siteName: "Ravindra Nath Jha Portfolio",
  locale: "en_US",
  type: "website",
};

// app/projects/page.js
import { sharedOpenGraph } from "@/lib/seo";

export const metadata = {
  title: "Projects",
  description: "MERN, AI and React Native projects I've designed and shipped.",
  openGraph: {
    ...sharedOpenGraph,               // keep shared fields
    title: "Projects | Ravindra Nath Jha",
    url: "/projects",
    images: ["/og/projects.png"],     // resolved against metadataBase
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects | Ravindra Nath Jha",
    images: ["/og/projects.png"],
  },
};`
    },
    {
      heading: "6. Generating Open Graph Images with Code",
      content: `Designing an image for every blog post doesn't scale. Add an **\`opengraph-image.js\`** file to a route and Next.js generates the image **from JSX** using \`ImageResponse\` from \`next/og\` — and wires up the \`og:image\` tags automatically.
• Export \`alt\`, \`size\` and \`contentType\` alongside the default function.
• Use flexbox and inline styles (a subset of CSS is supported); custom fonts can be loaded from files.
• In Next.js 16 the image function's \`params\` is a **Promise**.
• Add a \`twitter-image.js\` the same way, or let X fall back to the Open Graph image.
• Generated images are statically optimized at build time when they don't use request-time data.`,
      codeSnippet: `// app/blog/[slug]/opengraph-image.js
import { ImageResponse } from "next/og";
import { getPost } from "@/lib/data/posts";

export const alt = "Blog post cover";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }) {
  const { slug } = await params;           // Promise in Next.js 16
  const post = await getPost(slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column",
          justifyContent: "space-between", padding: 72, background: "#002057", color: "#fff",
        }}
      >
        <div style={{ fontSize: 28, color: "#ff7b00", fontWeight: 700 }}>ravindranathjha.in</div>
        <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.15 }}>{post.title}</div>
        <div style={{ fontSize: 28, opacity: 0.8 }}>By Ravindra Nath Jha · {post.readTime}</div>
      </div>
    ),
    { ...size }
  );
}`
    },
    {
      heading: "7. Favicons and App Icons",
      content: `Instead of manually adding \`<link rel="icon">\` tags, drop special files into \`app/\` and Next.js generates the tags:
• **\`app/favicon.ico\`** — the classic favicon.
• **\`app/icon.png\`** / \`icon.svg\` — modern icons (you can add several, e.g. \`icon1.png\`, \`icon2.png\`).
• **\`app/apple-icon.png\`** — the iOS home-screen icon (180×180).
• **\`icon.js\` / \`apple-icon.js\`** — generate icons with code using \`ImageResponse\`.
Alternatively, set \`metadata.icons\` explicitly — this portfolio does that because its favicon lives in \`public/assets/images/\`.`,
      codeSnippet: `app/
├── favicon.ico          → <link rel="icon" href="/favicon.ico" sizes="any" />
├── icon.svg             → <link rel="icon" href="/icon.svg" type="image/svg+xml" />
└── apple-icon.png       → <link rel="apple-touch-icon" href="/apple-icon.png" />

// Or explicitly:
export const metadata = {
  icons: {
    icon: [{ url: "/assets/images/favicon.png", type: "image/png" }],
    apple: "/assets/images/favicon.png",
  },
};`
    },
    {
      heading: "8. sitemap.js: Help Search Engines Find Every Page",
      content: `A sitemap lists your URLs so crawlers discover them quickly. Create **\`app/sitemap.js\`** that returns an array of entries; Next.js serves it at \`/sitemap.xml\`.
• Generate entries from your data — every blog post, product or lecture — so the sitemap is never out of date.
• Each entry can include \`lastModified\`, \`changeFrequency\` and \`priority\`.
• For very large sites (50,000+ URLs), split into multiple sitemaps with \`generateSitemaps\` (its \`id\` argument is a Promise in Next.js 16).
This portfolio has an \`app/sitemap.js\` that builds the sitemap including every notes lecture.`,
      codeSnippet: `// app/sitemap.js
import { getAllTechStacks } from "@/lib/notesData";

const BASE = "https://ravindranathjha.in";

export default function sitemap() {
  const staticPages = ["", "/projects", "/skills", "/experience", "/notes"].map((path) => ({
    url: BASE + path,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.8,
  }));

  const lectures = getAllTechStacks().flatMap((stack) =>
    stack.lectures.map((lecture) => ({
      url: BASE + "/notes/" + stack.slug + "/" + lecture.slug,
      lastModified: new Date(lecture.date),
      changeFrequency: "yearly",
      priority: 0.6,
    }))
  );

  return [...staticPages, ...lectures];
}`
    },
    {
      heading: "9. robots.js: Crawling Rules",
      content: `**\`app/robots.js\`** generates \`/robots.txt\`, telling crawlers which paths they may visit and where your sitemap lives.
• Disallow private or useless paths: \`/api/\`, \`/admin/\`, internal search result pages.
• Point to the sitemap.
• Generate it with code so you can, for example, block all crawling on staging deployments.
**Remember:** \`robots.txt\` is a request, not security. Protect private pages with authentication, and use \`robots: { index: false }\` metadata (a \`noindex\` tag) to keep a reachable page out of search results.`,
      codeSnippet: `// app/robots.js
export default function robots() {
  const isProduction = process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";

  if (!isProduction) {
    return { rules: { userAgent: "*", disallow: "/" } }; // never index staging
  }

  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/admin/"] }],
    sitemap: "https://ravindranathjha.in/sitemap.xml",
  };
}

// Keep one page out of search results
// export const metadata = { robots: { index: false, follow: true } };`
    },
    {
      heading: "10. manifest.js, viewport & themeColor",
      content: `• **\`app/manifest.js\`** generates a Web App Manifest (\`/manifest.webmanifest\`) — name, icons, colours and display mode for "Add to Home Screen" and PWAs.
• **Viewport and theme colour** are configured with a separate **\`viewport\`** export (or \`generateViewport\`), not inside \`metadata\`. It sets the \`<meta name="viewport">\` and \`<meta name="theme-color">\` tags — the browser UI colour on mobile.
Both exports are only supported in Server Components, and you can't export \`viewport\` and \`generateViewport\` from the same segment.`,
      codeSnippet: `// app/manifest.js
export default function manifest() {
  return {
    name: "Ravindra Nath Jha — Portfolio",
    short_name: "Ravindra",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f7f7",
    theme_color: "#002057",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}

// app/layout.js
export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#002057" },
  ],
};`
    },
    {
      heading: "11. Structured Data with JSON-LD (Safely)",
      content: `**JSON-LD** describes your content in a vocabulary search engines understand (schema.org): \`Person\`, \`Article\`, \`Product\`, \`BreadcrumbList\`, \`FAQPage\`... It can earn **rich results** like breadcrumbs and article cards.
Render it as a \`<script type="application/ld+json">\` tag inside your page component.
**Security:** \`JSON.stringify\` does not escape \`<\`. If any value contains user-controlled text like \`</script><script>...\`, it could break out of the tag (XSS). The official recommendation is to replace \`<\` with its Unicode escape \`\\u003c\`.
**Tip:** this website's lecture pages emit \`TechArticle\` and \`BreadcrumbList\` JSON-LD — view the page source to see them. Validate yours with Google's Rich Results Test.`,
      codeSnippet: `// app/blog/[slug]/page.js
export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    author: { "@type": "Person", name: "Ravindra Nath Jha", url: "https://ravindranathjha.in" },
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\\\u003c"), // prevent </script> injection
        }}
      />
      <h1>{post.title}</h1>
    </article>
  );
}`
    },
    {
      heading: "12. SEO Checklist for Next.js Apps",
      content: `• **Unique \`title\` (50–60 chars) and \`description\` (120–160 chars)** for every indexable page.
• **\`metadataBase\` + canonical URLs** on every page to avoid duplicate-content issues (with/without trailing slash, query params).
• **Server-render important content** — don't hide main text behind client-only fetching.
• **One \`<h1>\` per page**, logical heading order, descriptive link text (not "click here").
• **\`alt\` text** on every meaningful image; use \`next/image\` for performance.
• **Sitemap and robots** generated from data; submit the sitemap in Google Search Console.
• **Open Graph images** at 1200×630 for every shareable page.
• **JSON-LD** for articles, products, breadcrumbs and your \`Person\`/\`Organization\`.
• **Fast Core Web Vitals** — LCP, INP and CLS are ranking signals (Lecture 13).
• **Proper status codes** — \`notFound()\` for 404s, \`permanentRedirect()\` for moved URLs.
• **\`noindex\` staging and preview deployments.**`
    },
    {
      heading: "13. Practical: Full SEO Setup for a Blog",
      content: `This file set gives a blog production-grade SEO: site-wide defaults with a title template, per-post dynamic metadata, a generated OG image per post, an automatic sitemap, robots rules and article JSON-LD. Each piece was covered above — here they work together.`,
      codeSnippet: `app/
├── layout.js                 # metadataBase, title template, default OG + twitter card
├── sitemap.js                # every post from the database
├── robots.js                 # disallow /api, link sitemap, noindex staging
├── manifest.js               # PWA basics
└── blog/
    ├── page.js               # metadata: { title: "Blog", alternates: { canonical: "/blog" } }
    └── [slug]/
        ├── page.js           # generateMetadata + Article JSON-LD
        └── opengraph-image.js# per-post 1200×630 image with the post title

// Quick verification after "npm run build && npm run start":
//   curl -s http://localhost:3000/blog/hello | grep -E "<title>|og:image|canonical"
//   open http://localhost:3000/sitemap.xml
//   open http://localhost:3000/robots.txt
//   open http://localhost:3000/blog/hello/opengraph-image`
    },
    {
      heading: "14. Summary",
      content: `• Export \`metadata\` (static) or \`generateMetadata\` (dynamic, with async \`params\`) from layouts and pages; Next.js merges them down the tree.
• Use \`title.template\` and \`metadataBase\` in the root layout; set canonical URLs everywhere.
• Open Graph images should be 1200×630; child \`openGraph\` objects replace the parent's, so spread shared defaults.
• \`opengraph-image.js\` + \`ImageResponse\` generate social images from JSX.
• Icons, \`sitemap.js\`, \`robots.js\` and \`manifest.js\` are file conventions that generate the right files and tags.
• Configure \`themeColor\` with the separate \`viewport\` export.
• Render JSON-LD in a script tag and escape \`<\` as \`\\u003c\` to prevent XSS.
**Next lecture:** authentication, authorization and security — sessions, the Data Access Layer, protecting pages and actions, and environment variables.`
    }
  ]
};
