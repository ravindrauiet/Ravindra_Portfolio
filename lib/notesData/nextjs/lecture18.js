export const lecture18 = {
  slug: "lecture-18",
  number: 18,
  title: "Complete Next.js Course — Lecture 18: Static Export, Single-Page Apps & Progressive Web Apps",
  summary: "Run Next.js without a server and make it installable: when a static export is the right choice, output: 'export' and what it supports, images and dynamic routes in static builds, hosting on S3, GitHub Pages and Nginx, building SPAs with Next.js, migrating a Vite or Create React App project, and turning your app into a PWA with a manifest, service worker, push notifications and offline support.",
  readTime: "29 min read",
  difficulty: "Advanced",
  date: "2026-10-08",
  sections: [
    {
      heading: "1. Do You Need a Server at All?",
      content: `Everything in this course so far ran on a **Node.js server** (or serverless functions): Server Actions, Proxy, ISR, Draft Mode, on-demand image optimization, cookies.
But many sites don't need any of that at request time — a portfolio, documentation, a landing page, a course site, a client-side dashboard that talks to an external API. For those, Next.js can produce a **static export**: plain HTML, CSS and JavaScript files you can host **anywhere** — S3, GitHub Pages, any CDN, a basic Nginx server — often for free.
**Choose a static export when:**
• All pages can be generated at build time (or rendered in the browser).
• Data comes from build-time sources or an external API called from the client.
• You need the cheapest, simplest, most portable hosting.
**Choose a Node.js server (or Vercel / Docker) when** you need Server Actions, authentication with cookies, Proxy redirects, ISR/revalidation, Draft Mode or image optimization on the fly.`
    },
    {
      heading: "2. Enabling a Static Export",
      content: `Set \`output: "export"\` in \`next.config.js\` and run \`next build\`. Next.js writes a fully static site to the **\`out/\`** folder — one HTML file per route, plus assets.
Optional settings:
• **\`trailingSlash: true\`** — emit \`/about/index.html\` instead of \`/about.html\`, so URLs like \`/about/\` work on hosts that serve folders (GitHub Pages, S3 website hosting).
• **\`distDir\`** — change the output folder name (e.g. \`"dist"\`).
• **\`basePath\`** — serve the site from a sub-path, e.g. \`"/my-repo"\` for GitHub Pages project sites.
Run \`npx serve out\` to preview the exported site locally exactly as a static host would serve it.`,
      codeSnippet: `// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  // trailingSlash: true,     // /about → /about/index.html
  // distDir: "dist",         // default is "out"
  // basePath: "/my-repo",    // for https://username.github.io/my-repo
  images: { unoptimized: true }, // see section 4
};

export default nextConfig;

# Build and preview
npm run build        # → out/index.html, out/about.html, out/_next/static/...
npx serve out        # preview at http://localhost:3000`
    },
    {
      heading: "3. What Works in a Static Export",
      content: `More than you might expect — the App Router's model maps naturally to static output:
• **Server Components** — run **at build time**; their output becomes static HTML and RSC payloads. You can still query a database or call an API **during the build**.
• **Client Components** — work normally in the browser (state, effects, events).
• **Dynamic routes** — supported when \`generateStaticParams\` lists every path.
• **\`<Link>\` prefetching**, client-side navigation and code splitting.
• **Route Handlers** — only \`GET\` handlers that don't read the request; they're rendered to static files at build time (e.g. \`app/feed.xml/route.js\` → \`out/feed.xml\`).
• **Metadata files** — \`sitemap.js\`, \`robots.js\`, \`manifest.js\`, \`opengraph-image.js\` (when static).
• **Client-side data fetching** with SWR or TanStack Query for anything that must be fresh.
• **All styling options**, \`next/font\`, \`next/script\`, \`next/dynamic\`.`
    },
    {
      heading: "4. What Doesn't Work (and the Alternatives)",
      content: `Anything that needs a server **at request time** is unavailable:
• **Server Actions** → call an external API (or a serverless function on another platform) from Client Components.
• **Proxy, \`redirects\`, \`rewrites\`, \`headers\` in next.config** → configure redirects and headers on your host/CDN (S3 redirect rules, Netlify \`_redirects\`, Nginx config).
• **Cookies, \`headers()\`, request-dependent Route Handlers** → handle auth in the browser with a third-party auth provider's client SDK.
• **Dynamic routes without \`generateStaticParams\`**, or with \`dynamicParams: true\` → list every path, or render the variable part client-side.
• **ISR / revalidation / Draft Mode** → rebuild and redeploy when content changes (a CMS webhook can trigger your CI build).
• **Intercepting routes** → not supported.
• **Image optimization with the default loader** → use a **custom loader** that points at an image CDN (Cloudinary, Imgix, Cloudflare Images), or set \`images.unoptimized: true\` and optimize images yourself before committing them.
If you use an unsupported feature, \`next build\` fails with an error that tells you which one — so you find out at build time, not in production.`,
      codeSnippet: `// next.config.mjs — custom image loader for static export
const nextConfig = {
  output: "export",
  images: { loader: "custom", loaderFile: "./lib/image-loader.js" },
};
export default nextConfig;

// lib/image-loader.js — Cloudinary example
export default function cloudinaryLoader({ src, width, quality }) {
  const params = ["f_auto", "c_limit", "w_" + width, "q_" + (quality || "auto")];
  return "https://res.cloudinary.com/demo/image/upload/" + params.join(",") + src;
}`
    },
    {
      heading: "5. Dynamic Routes and Data in a Static Export",
      content: `For a static export, every URL must exist as a file after the build:
• Export \`generateStaticParams\` from every dynamic segment and return **all** paths.
• Unknown paths should 404 — the host serves your \`404.html\` (generated from \`not-found.js\`).
• Data fetched in Server Components is frozen at **build time**. That's perfect for blog posts and docs; for prices, stock or user data, fetch on the **client**.
**This portfolio's notes section is a good example of export-friendly design**: all lectures come from local data files and \`generateStaticParams\` lists every lecture, so every notes page is prebuilt as static HTML.`,
      codeSnippet: `// app/notes/[techStack]/[lectureSlug]/page.js — export-friendly
export const dynamicParams = false;   // only the listed paths exist

export function generateStaticParams() {
  return getAllTechStacks().flatMap((stack) =>
    stack.lectures.map((l) => ({ techStack: stack.slug, lectureSlug: l.slug }))
  );
}

// A fresh value fetched in the browser on a static page
"use client";
import useSWR from "swr";

export function LiveStars() {
  const { data } = useSWR("https://api.github.com/repos/vercel/next.js", (u) => fetch(u).then((r) => r.json()));
  return <span>⭐ {data ? data.stargazers_count.toLocaleString() : "…"}</span>;
}`
    },
    {
      heading: "6. Hosting a Static Export",
      content: `Upload the \`out/\` folder to any static host:
• **GitHub Pages** — free; use \`basePath\` for project sites and \`trailingSlash: true\`. Add an empty \`.nojekyll\` file so folders starting with \`_\` (like \`_next\`) are served.
• **AWS S3 + CloudFront** — cheap and fast at scale; set the 404 page to \`404.html\`.
• **Netlify / Cloudflare Pages** — connect the repo, build command \`npm run build\`, publish directory \`out\`.
• **Your own Nginx server** — serve \`out/\` and map clean URLs to \`.html\` files.
Remember: redirects, security headers and caching rules now live in the **host's** configuration, not \`next.config.js\`.`,
      codeSnippet: `# nginx.conf — serve a Next.js static export with clean URLs
server {
  listen 80;
  server_name example.com;
  root /var/www/out;

  location / {
    try_files $uri $uri.html $uri/ =404;   # /about → about.html
  }

  # Long cache for hashed build assets
  location /_next/static/ {
    add_header Cache-Control "public, max-age=31536000, immutable";
  }

  error_page 404 /404.html;
}`
    },
    {
      heading: "7. Building Single-Page Applications with Next.js",
      content: `A strict **SPA** renders entirely in the browser and fetches data from an API. Why use Next.js for that instead of plain Vite?
• **Automatic code splitting per route** — users download only the JavaScript for the page they're on, instead of one giant bundle.
• **Fast first paint** — even client-heavy pages get prerendered HTML shells at build time.
• **File-system routing**, \`next/image\`, \`next/font\`, metadata — included.
• **A path to grow** — when you later need server features, they're already there; you migrate route by route.
Next.js SPAs work with or without a static export: start fully client-side and add server rendering only where it pays off.`
    },
    {
      heading: "8. SPA Patterns: Client Data, Browser-Only Code and Shallow Routing",
      content: `Common patterns from the official SPA guide:
• **Client data libraries** — SWR or TanStack Query handle caching and revalidation in the browser.
• **Start fetching early** — kick off a request in a Server Component (or root layout) and pass the **promise** through Context; components read it with \`use()\` inside \`<Suspense>\`.
• **Browser-only components** — wrap components that touch \`window\` on first render with \`next/dynamic\` and \`{ ssr: false }\` (inside a Client Component).
• **Shallow routing** — update the URL without a navigation using the native \`window.history.pushState\` / \`replaceState\`. Next.js integrates these with \`usePathname\` and \`useSearchParams\`, so your components stay in sync — ideal for filters, tabs and sort orders.`,
      codeSnippet: `"use client";
import { useSearchParams } from "next/navigation";

export default function SortProducts() {
  const searchParams = useSearchParams();

  function updateSort(order) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", order);
    window.history.pushState(null, "", "?" + params.toString()); // no server request
  }

  return (
    <>
      <button onClick={() => updateSort("asc")}>Sort ascending</button>
      <button onClick={() => updateSort("desc")}>Sort descending</button>
      <p>Current: {searchParams.get("sort") ?? "none"}</p>   {/* stays in sync */}
    </>
  );
}`
    },
    {
      heading: "9. Migrating a Vite or Create React App Project",
      content: `Create React App is deprecated, and many Vite SPAs eventually need SEO or server features. The official migration strategy is **incremental**:
1. Install Next.js and add \`output: "export"\` so behaviour stays SPA-like.
2. Create a root layout (\`app/layout.js\`) with the contents of your old \`index.html\` \`<head>\`.
3. Create an **optional catch-all route** \`app/[[...slug]]/page.js\` that renders your **entire existing app** as a client-only component (\`next/dynamic\` with \`ssr: false\`). Your React Router setup keeps working.
4. Run it — the app works exactly as before, now built by Next.js.
5. **Move routes one at a time** from React Router into real \`app/\` routes, gaining code splitting and server rendering page by page.
6. When everything is migrated, remove React Router and the catch-all — and drop \`output: "export"\` if you want server features.`,
      codeSnippet: `// app/[[...slug]]/page.js — catches every URL during migration
import "../../index.css";
import { ClientOnly } from "./client";

export function generateStaticParams() {
  return [{ slug: [""] }]; // generate a single entry page
}

export default function Page() {
  return <ClientOnly />;
}

// app/[[...slug]]/client.js
"use client";
import dynamic from "next/dynamic";

const App = dynamic(() => import("../../App"), { ssr: false }); // your existing SPA root

export function ClientOnly() {
  return <App />;
}`
    },
    {
      heading: "10. What Makes a Progressive Web App (PWA)?",
      content: `A **PWA** is a website that can be **installed** on phones and desktops and behaves like a native app: its own icon on the home screen, a standalone window without browser UI, push notifications, and (optionally) offline support.
The building blocks:
• **HTTPS** — required for service workers and push.
• **Web App Manifest** — name, icons, colours, display mode. Enables "Install app" / "Add to Home Screen".
• **Service worker** — a script that runs in the background, separate from the page. It can receive push messages, cache assets and serve the app offline.
Why teams choose PWAs: **one codebase** for web, Android and desktop; **no app-store review or fees** for updates; instant updates on deploy. iOS supports installed PWAs and web push (iOS 16.4+, for apps added to the Home Screen).
Note: installability doesn't require offline support — a manifest plus HTTPS is enough for an install prompt in most browsers.`
    },
    {
      heading: "11. Step 1: The Web App Manifest",
      content: `Create \`app/manifest.js\` (Lecture 11) — Next.js serves it at \`/manifest.webmanifest\` and links it automatically.
Provide at least a **192×192** and a **512×512** PNG icon; add a **maskable** icon so Android can crop it into any shape. Choose \`display: "standalone"\` for an app-like window.`,
      codeSnippet: `// app/manifest.js
export default function manifest() {
  return {
    name: "Ravindra Nath Jha — Dev Notes",
    short_name: "Dev Notes",
    description: "Free Next.js, React and JavaScript lecture notes",
    start_url: "/notes",
    display: "standalone",
    background_color: "#f7f7f7",
    theme_color: "#002057",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}`
    },
    {
      heading: "12. Step 2: Web Push Notifications",
      content: `Push lets you notify users even when the site isn't open. The pieces:
1. **VAPID keys** identify your server to push services. Generate once with \`npx web-push generate-vapid-keys\`; store the public key in \`NEXT_PUBLIC_VAPID_PUBLIC_KEY\` and the private key in \`VAPID_PRIVATE_KEY\` (server only).
2. **Register a service worker** (\`public/sw.js\`) and **subscribe** the user with \`registration.pushManager.subscribe()\` — only after a clear user action (a button), never on page load.
3. **Store the subscription** on the server (a Server Action saving it to your database).
4. **Send** notifications from the server with the \`web-push\` library.
5. The service worker's \`push\` event **shows** the notification; \`notificationclick\` opens the right page.
Test locally over HTTPS with \`next dev --experimental-https\`.`,
      codeSnippet: `// app/actions/push.js
"use server";
import webpush from "web-push";

webpush.setVapidDetails(
  "mailto:you@example.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export async function subscribeUser(subscription) {
  await db.pushSubscription.create({ data: { endpoint: subscription.endpoint, json: JSON.stringify(subscription) } });
  return { ok: true };
}

export async function sendNotification(subscriptionJson, message) {
  await webpush.sendNotification(
    JSON.parse(subscriptionJson),
    JSON.stringify({ title: "New lecture published", body: message, icon: "/icons/icon-192.png" })
  );
}

// public/sw.js
self.addEventListener("push", (event) => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(self.registration.showNotification(data.title, { body: data.body, icon: data.icon }));
});
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow("/notes"));
});`
    },
    {
      heading: "13. Subscribing from the Client",
      content: `A Client Component registers the service worker, asks for permission when the user clicks, subscribes, and sends the subscription to the Server Action. Check for support first — not every browser (or every iOS context) supports push.
The service worker file should **never be cached** long-term, so users always get the latest version. Set headers for \`/sw.js\` in \`next.config.js\` (on a static export, configure them on your host instead).`,
      codeSnippet: `// app/components/PushToggle.jsx
"use client";
import { useEffect, useState } from "react";
import { subscribeUser } from "@/app/actions/push";

function urlBase64ToUint8Array(base64) {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + padding).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

export default function PushToggle() {
  const [supported, setSupported] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setSupported(true);
      navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" });
    }
  }, []);

  async function subscribe() {
    const registration = await navigator.serviceWorker.ready;
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY),
    });
    await subscribeUser(JSON.parse(JSON.stringify(sub))); // plain, serializable object
    setSubscribed(true);
  }

  if (!supported) return <p>Notifications aren't supported in this browser.</p>;
  return subscribed ? <p>🔔 You'll be notified about new lectures.</p> : <button onClick={subscribe}>Notify me</button>;
}

// next.config.mjs — headers for the service worker
// async headers() {
//   return [{ source: "/sw.js", headers: [
//     { key: "Content-Type", value: "application/javascript; charset=utf-8" },
//     { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
//     { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self'" },
//   ]}];
// }`
    },
    {
      heading: "14. Offline Support and Caching Strategies",
      content: `To work offline, the service worker must **cache** your app's files and data and serve them when the network is unavailable. Common strategies:
• **Cache first** — serve from cache, fall back to network. For versioned static assets (\`/_next/static/*\`, fonts, icons).
• **Network first** — try the network, fall back to cache. For HTML pages and API data that should be fresh but still work offline.
• **Stale-while-revalidate** — serve from cache instantly and update it in the background. For content like lecture pages.
• **Offline fallback page** — a friendly "You're offline" page for routes that were never cached.
Writing this by hand is error-prone. **Serwist** (the maintained successor to next-pwa) generates a service worker with precaching and runtime caching for Next.js. **Note:** at the time of writing its Next.js plugin requires a **Webpack** build, so with Next.js 16 you'd build with \`next build --webpack\` — check Serwist's docs for current Turbopack support.
Be careful what you cache: never cache authenticated, per-user API responses in a shared cache, and version your caches so old assets are cleaned up after deployments.`
    },
    {
      heading: "15. Practical: An Installable, Static Notes App",
      content: `Turn a notes/documentation site into a fast, installable app that costs nothing to host:
• \`output: "export"\` with \`generateStaticParams\` for every lecture; \`trailingSlash: true\`.
• \`images.unoptimized: true\` (or an image CDN loader).
• \`app/manifest.js\` with icons and \`display: "standalone"\` → install prompt on Android and desktop.
• A service worker with stale-while-revalidate caching for lecture pages → readable offline on the train.
• Deploy \`out/\` to GitHub Pages or Cloudflare Pages; configure headers there.
Then check it with **Lighthouse** (it reports PWA installability) and in DevTools → **Application** (Manifest, Service Workers, Cache Storage).`,
      codeSnippet: `next.config.mjs        // output: "export", trailingSlash: true, images.unoptimized: true
app/manifest.js        // name, icons (192, 512, maskable), display: "standalone", theme_color
app/notes/.../page.js  // generateStaticParams + dynamicParams = false
public/sw.js           // (or Serwist-generated) precache + stale-while-revalidate for /notes/*
public/icons/*.png
app/components/RegisterSW.jsx  // "use client" — navigator.serviceWorker.register("/sw.js")

# Build, preview, deploy
npm run build && npx serve out
# upload out/ to your static host`
    },
    {
      heading: "16. Summary",
      content: `• A **static export** (\`output: "export"\`) builds plain files into \`out/\` that any static host can serve — ideal for portfolios, docs and client-side apps.
• Server Components run at build time; Client Components, \`<Link>\`, static GET Route Handlers and metadata files all work.
• Unavailable: Server Actions, Proxy, next.config redirects/rewrites/headers, cookies, ISR, Draft Mode, intercepting routes and default image optimization — use host config, client-side APIs, rebuilds and image CDN loaders instead.
• Every dynamic path needs \`generateStaticParams\`; fresh data is fetched on the client.
• Next.js makes better SPAs thanks to per-route code splitting; migrate Vite/CRA apps incrementally via an optional catch-all route with a client-only app.
• A **PWA** needs HTTPS, a manifest (\`app/manifest.js\`) and a service worker; add web push with VAPID keys and \`web-push\`, and offline support with caching strategies (e.g. via Serwist).
**🎓 Course complete!** With these 18 lectures you've covered Next.js 16 from setup to production: routing, rendering, data, caching, mutations, APIs, styling, SEO, security, databases, content, motion, internationalization and deployment — static, serverless or self-hosted. Now build something and ship it.`
    }
  ]
};
