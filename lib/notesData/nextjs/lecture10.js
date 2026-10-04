export const lecture10 = {
  slug: "lecture-10",
  number: 10,
  title: "Complete Next.js Course — Lecture 10: Styling, Images, Fonts, Scripts & Lazy Loading",
  summary: "Style and optimize your app: global CSS, CSS Modules, Tailwind CSS v4 and Sass; the next/image component (sizes, fill, preload, remotePatterns and the Next.js 16 image defaults); self-hosted fonts with next/font; third-party scripts with next/script strategies; and code splitting with next/dynamic.",
  readTime: "27 min read",
  difficulty: "Intermediate",
  date: "2026-10-04",
  sections: [
    {
      heading: "1. Styling Options in Next.js",
      content: `Next.js supports every mainstream styling approach. Pick one primary approach per project for consistency:
• **Global CSS** — one stylesheet for resets, variables and base styles (this portfolio uses \`app/globals.css\`).
• **CSS Modules** — locally scoped class names per component; zero runtime cost. Built in.
• **Tailwind CSS** — utility classes in your JSX; the most popular choice for new projects.
• **Sass** — CSS Modules or global styles with variables, nesting and mixins (\`npm install -D sass\`).
• **CSS-in-JS** — libraries like styled-components or Emotion work in **Client Components** with extra setup; runtime CSS-in-JS doesn't work in Server Components, so prefer zero-runtime options.`
    },
    {
      heading: "2. Global CSS",
      content: `Import global stylesheets **in the root layout** (\`app/layout.js\`) so they apply to every route. You can import them in any layout or page, but global styles are global — they affect the entire app once loaded.
Good uses: CSS resets, design tokens as CSS custom properties, typography defaults, utility classes shared everywhere.
Keep component-specific styles out of global CSS — that's what CSS Modules or Tailwind are for — otherwise the global file grows forever and class names collide.`,
      codeSnippet: `/* app/globals.css */
:root {
  --navy: #002057;
  --indigo: #2506ad;
  --orange: #ff7b00;
  --radius: 16px;
}

*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: var(--font-sans), system-ui, sans-serif; color: var(--navy); }

// app/layout.js
import "./globals.css";`
    },
    {
      heading: "3. CSS Modules: Scoped Styles",
      content: `Name a file \`*.module.css\` and import it into a component. Next.js generates **unique class names** at build time (\`Card_title__x7Yz2\`), so \`.title\` in one module never clashes with \`.title\` in another.
• Access classes as properties: \`styles.card\`, \`styles["is-active"]\`.
• Combine classes with template strings or a helper like \`clsx\`.
• Works in Server and Client Components with zero runtime JavaScript.`,
      codeSnippet: `/* app/components/Card.module.css */
.card {
  padding: 24px;
  border: 1px solid #e8e9f0;
  border-radius: 16px;
  background: #fff;
}
.title { color: var(--navy); font-size: 20px; }
.featured { background: var(--navy); color: #fff; }

// app/components/Card.jsx
import styles from "./Card.module.css";

export default function Card({ title, featured, children }) {
  return (
    <article className={featured ? styles.card + " " + styles.featured : styles.card}>
      <h3 className={styles.title}>{title}</h3>
      {children}
    </article>
  );
}`
    },
    {
      heading: "4. Tailwind CSS v4",
      content: `Tailwind v4 is configured through **CSS** instead of a JavaScript config file. Setup in an existing project takes three steps (\`create-next-app\` can do it for you):
1. Install \`tailwindcss\` and the PostCSS plugin \`@tailwindcss/postcss\`.
2. Add the plugin to \`postcss.config.mjs\`.
3. Add \`@import "tailwindcss";\` to your global CSS.
Customize your design tokens with the \`@theme\` block directly in CSS. Tailwind scans your files automatically and only generates the classes you use.`,
      codeSnippet: `# 1. Install
npm install -D tailwindcss @tailwindcss/postcss

// 2. postcss.config.mjs
export default {
  plugins: { "@tailwindcss/postcss": {} },
};

/* 3. app/globals.css */
@import "tailwindcss";

@theme {
  --color-navy: #002057;
  --color-brand: #2506ad;
  --color-accent: #ff7b00;
}

// Usage — classes like bg-navy and text-accent now exist
export default function Hero() {
  return (
    <section className="bg-navy px-6 py-20 text-white md:px-16">
      <h1 className="text-4xl font-extrabold md:text-6xl">
        Hi, I'm <span className="text-accent">Ravindra</span>
      </h1>
      <a href="#contact" className="mt-8 inline-block rounded-full bg-brand px-6 py-3 font-bold hover:opacity-90">
        Hire me
      </a>
    </section>
  );
}`
    },
    {
      heading: "5. Why next/image?",
      content: `Images are usually the heaviest part of a page and the main cause of poor **Largest Contentful Paint (LCP)** and **Cumulative Layout Shift (CLS)**. The \`<Image>\` component from \`next/image\` fixes this automatically:
• **Resizing** — serves the right size for each device instead of a 4000px original.
• **Modern formats** — converts to WebP/AVIF when the browser supports them.
• **Lazy loading** — offscreen images load only as the user scrolls near them.
• **No layout shift** — reserves space using \`width\`/\`height\` (or \`fill\`), so content doesn't jump.
• **Caching** — optimized images are cached on the server (Next.js 16 default \`minimumCacheTTL\` is 4 hours).`
    },
    {
      heading: "6. Using next/image: Local and Remote Images",
      content: `**Local images** imported statically get their \`width\`, \`height\` and a blur placeholder detected automatically.
**Remote images** need explicit \`width\` and \`height\` (or \`fill\`), and the domain must be allowed in \`next.config.js\` via **\`images.remotePatterns\`** — this prevents attackers from using your server to optimize arbitrary images. (\`images.domains\` is deprecated.)
Always write meaningful \`alt\` text — it's used by screen readers and search engines. Use \`alt=""\` only for purely decorative images.`,
      codeSnippet: `import Image from "next/image";
import profile from "@/public/assets/images/profile.jpg"; // static import

export default function About() {
  return (
    <>
      {/* Local: width/height/blur inferred */}
      <Image src={profile} alt="Ravindra Nath Jha" placeholder="blur" />

      {/* Remote: explicit dimensions + allowed domain */}
      <Image
        src="https://images.unsplash.com/photo-123?w=1200"
        alt="Developer workspace with laptop"
        width={1200}
        height={800}
      />
    </>
  );
}

// next.config.mjs
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
  },
};
export default nextConfig;`
    },
    {
      heading: "7. Responsive Images: sizes, fill and preload",
      content: `Three props control performance:
• **\`sizes\`** — tells the browser how wide the image will be at each breakpoint, so it downloads the smallest adequate file. Without it, a full-width \`srcset\` is assumed. Example: \`sizes="(max-width: 768px) 100vw, 33vw"\` for a 3-column grid.
• **\`fill\`** — the image fills its **positioned parent** (\`position: relative\`) — use when you don't know the dimensions. Combine with CSS \`object-fit: cover\`.
• **\`preload\`** — preloads the image in the document head. Use it for the **LCP image** (usually the hero image) so it starts downloading immediately. In Next.js 16, **\`preload\` replaces the deprecated \`priority\` prop**.
Other useful props: \`quality\` (Next.js 16 only allows \`[75]\` unless you configure \`images.qualities\`), \`placeholder="blur"\` with \`blurDataURL\` for remote images, and \`loading="eager"\` for above-the-fold images.`,
      codeSnippet: `import Image from "next/image";

// Hero (LCP) image: preload it
<Image src="/hero.jpg" alt="Product hero" width={1600} height={900} preload sizes="100vw" />

// Card grid: unknown aspect ratio, fill the container
<div style={{ position: "relative", aspectRatio: "16 / 10" }}>
  <Image
    src={project.image}
    alt={project.name + " screenshot"}
    fill
    sizes="(max-width: 700px) 100vw, (max-width: 1024px) 50vw, 400px"
    style={{ objectFit: "cover", objectPosition: "top" }}
  />
</div>

// next.config.mjs — allow more quality levels (Next.js 16 default is only 75)
// images: { qualities: [50, 75, 90] }`
    },
    {
      heading: "8. Fonts with next/font",
      content: `Loading fonts from Google Fonts with a \`<link>\` tag causes an extra network request to a third party and a visible font swap (layout shift). **\`next/font\`** fixes both:
• Fonts are **downloaded at build time and self-hosted** with your other static assets — no requests to Google from the browser (better privacy and speed).
• Fallback font metrics are adjusted automatically (\`size-adjust\`), so text doesn't shift when the web font loads — **zero layout shift**.
• Only the subsets and weights you use are included.
Use **\`next/font/google\`** for any Google Font, or **\`next/font/local\`** for your own font files. Variable fonts are recommended — one file covers every weight.`,
      codeSnippet: `// app/layout.js
import { Poppins, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
  variable: "--font-sans",          // expose as a CSS variable
});

const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

const brand = localFont({
  src: "./fonts/BrandDisplay.woff2",
  variable: "--font-display",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable + " " + mono.variable + " " + brand.variable}>
      <body>{children}</body>
    </html>
  );
}

/* globals.css */
/* body { font-family: var(--font-sans), sans-serif; }   code { font-family: var(--font-mono); } */`
    },
    {
      heading: "9. Third-Party Scripts with next/script",
      content: `Analytics, chat widgets, ads and maps all add scripts that can slow your page. \`<Script>\` from \`next/script\` lets you choose **when** each loads with the \`strategy\` prop:
• **\`beforeInteractive\`** — injected into the initial HTML and fetched before any Next.js code. Only for critical scripts like bot detection or cookie consent. Place it in the root layout.
• **\`afterInteractive\`** (default) — loads early, after some hydration. Good for analytics and tag managers.
• **\`lazyOnload\`** — loads during browser idle time. Best for chat widgets, social embeds, low-priority tools.
• **\`worker\`** (experimental) — offloads the script to a web worker.
Scripts are loaded **once** even when navigating between pages. Use \`onLoad\` / \`onReady\` (Client Components only) to run code after a script loads. Inline scripts need an \`id\` prop.`,
      codeSnippet: `// app/layout.js — Google Analytics (this portfolio uses this pattern)
import Script from "next/script";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX" strategy="afterInteractive" />
        <Script id="ga-init" strategy="afterInteractive">
          {"window.dataLayer = window.dataLayer || [];" +
            "function gtag(){dataLayer.push(arguments);}" +
            "gtag('js', new Date()); gtag('config', 'G-XXXXXXX');"}
        </Script>

        {/* Chat widget: not urgent */}
        <Script src="https://widget.example-chat.com/loader.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}`
    },
    {
      heading: "10. Lazy Loading Components with next/dynamic",
      content: `Server Components are already code-split and don't add client JavaScript. For heavy **Client Components** — charts, rich text editors, maps, video players — use **\`next/dynamic\`** to split them into a separate chunk that loads only when rendered.
• \`dynamic(() => import("./Chart"))\` — lazy-loads the component; you can show a \`loading\` placeholder.
• \`{ ssr: false }\` — skip server prerendering entirely, for components that need \`window\` immediately. This option **only works inside Client Components**.
• For heavy **libraries** used only on interaction, \`await import("library")\` inside an event handler loads them on demand.`,
      codeSnippet: `// app/dashboard/Charts.jsx
"use client";
import dynamic from "next/dynamic";
import { useState } from "react";

const RevenueChart = dynamic(() => import("./RevenueChart"), {
  loading: () => <div className="skeleton" style={{ height: 320 }} />,
});

const Map = dynamic(() => import("./Map"), { ssr: false }); // uses window

export default function Charts() {
  const [showMap, setShowMap] = useState(false);

  async function exportPdf() {
    const { jsPDF } = await import("jspdf"); // loaded only when clicked
    new jsPDF().text("Report", 10, 10).save("report.pdf");
  }

  return (
    <>
      <RevenueChart />
      <button onClick={() => setShowMap(true)}>Show map</button>
      {showMap && <Map />}
      <button onClick={exportPdf}>Export PDF</button>
    </>
  );
}`
    },
    {
      heading: "11. Static Assets in public/",
      content: `Files in \`public/\` are served as-is from the site root: \`public/resume.pdf\` → \`/resume.pdf\`.
• Reference them with absolute paths: \`<img src="/logo.svg" />\`, \`<Image src="/hero.jpg" ... />\`.
• Don't put a file in \`public/\` with the same name as a route — the route wins.
• Next.js can't optimize what's in \`public/\` except through \`next/image\` — prefer \`<Image>\` over \`<img>\` for photos.
• Files are cached by the browser according to your hosting; rename files (\`logo-v2.svg\`) when you change them to bust caches.
• \`robots.txt\`, \`favicon.ico\` and \`sitemap.xml\` can live in \`public/\`, but generating them with metadata files (Lecture 11) is more flexible.`
    },
    {
      heading: "12. Practical: An Optimized Project Card Grid",
      content: `A responsive project grid that combines CSS Modules, \`next/image\` with \`fill\` and \`sizes\`, a preloaded first image for LCP, and a lazily loaded "screenshot viewer" Client Component that only downloads when a user opens it.`,
      codeSnippet: `// app/projects/ProjectGrid.module.css
// .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }
// .media { position: relative; aspect-ratio: 16 / 10; border-radius: 16px 16px 0 0; overflow: hidden; }

// app/projects/page.js
import Image from "next/image";
import styles from "./ProjectGrid.module.css";
import ViewerButton from "./ViewerButton";
import { projects } from "@/lib/projects";

export default function ProjectsPage() {
  return (
    <section className={styles.grid}>
      {projects.map((p, i) => (
        <article key={p.slug}>
          <div className={styles.media}>
            <Image
              src={p.image}
              alt={p.name + " screenshot"}
              fill
              sizes="(max-width: 700px) 100vw, 400px"
              preload={i === 0}                 // only the first, above-the-fold image
              style={{ objectFit: "cover", objectPosition: "top" }}
            />
          </div>
          <h3>{p.name}</h3>
          <ViewerButton images={p.gallery} />
        </article>
      ))}
    </section>
  );
}

// app/projects/ViewerButton.jsx
"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
const Lightbox = dynamic(() => import("./Lightbox")); // separate chunk

export default function ViewerButton({ images }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>View screenshots</button>
      {open && <Lightbox images={images} onClose={() => setOpen(false)} />}
    </>
  );
}`
    },
    {
      heading: "13. Summary",
      content: `• Use global CSS for tokens and base styles; CSS Modules or Tailwind v4 for components. Runtime CSS-in-JS only works in Client Components.
• Tailwind v4: install \`tailwindcss\` + \`@tailwindcss/postcss\`, then \`@import "tailwindcss"\` and customize with \`@theme\`.
• \`next/image\` resizes, converts, lazy-loads and prevents layout shift. Configure \`remotePatterns\`, set \`sizes\`, use \`fill\` for unknown dimensions and **\`preload\`** (not \`priority\`) for the LCP image.
• Next.js 16 image defaults: \`qualities: [75]\`, \`minimumCacheTTL\` 4 hours, max 3 redirects, local IPs blocked.
• \`next/font\` self-hosts fonts with zero layout shift; expose them as CSS variables.
• \`next/script\` strategies: \`beforeInteractive\`, \`afterInteractive\` (default), \`lazyOnload\`, \`worker\`.
• \`next/dynamic\` code-splits heavy Client Components; \`ssr: false\` only works inside Client Components.
**Next lecture:** metadata and SEO — titles, Open Graph images, sitemaps, robots, JSON-LD structured data and more.`
    }
  ]
};
