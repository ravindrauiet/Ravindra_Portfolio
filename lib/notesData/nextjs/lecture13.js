export const lecture13 = {
  slug: "lecture-13",
  number: 13,
  title: "Complete Next.js Course — Lecture 13: Performance, Testing & Deployment",
  summary: "Ship with confidence: Core Web Vitals and how Next.js helps each one, measuring with Lighthouse and useReportWebVitals, bundle analysis with next experimental-analyze, optimizePackageImports and the React Compiler, after() and instrumentation, testing with Vitest and Playwright, and deploying to Vercel, a Node.js server, Docker (standalone output) or a static export — plus a production checklist.",
  readTime: "30 min read",
  difficulty: "Advanced",
  date: "2026-10-04",
  sections: [
    {
      heading: "1. Core Web Vitals: What \"Fast\" Means",
      content: `Google measures real-user experience with three **Core Web Vitals**. They affect search ranking and, more importantly, conversions.
• **LCP — Largest Contentful Paint** (good ≤ 2.5s): when the main content (usually the hero image or heading) appears. Helped by server rendering, \`next/image\` with \`preload\`, \`next/font\`, streaming and CDN caching.
• **INP — Interaction to Next Paint** (good ≤ 200ms): how quickly the page responds to clicks and typing. Helped by shipping less client JavaScript (Server Components), code splitting (\`next/dynamic\`), \`useTransition\`, and lazy third-party scripts.
• **CLS — Cumulative Layout Shift** (good ≤ 0.1): how much content jumps around while loading. Helped by \`next/image\` reserving space, \`next/font\` size-adjusted fallbacks, and skeletons that match the final layout.
Also watch **TTFB** (Time to First Byte) — improved by static prerendering, caching and Partial Prerendering.`
    },
    {
      heading: "2. Measuring Performance",
      content: `Measure before optimizing — and measure the **production build**, never \`next dev\` (dev mode is intentionally slower).
• **Lighthouse** (Chrome DevTools → Lighthouse) — lab scores and concrete suggestions. Run it in an incognito window on \`npm run build && npm run start\`.
• **PageSpeed Insights** — Lighthouse plus **real-user data** from the Chrome UX Report for your live URL.
• **Vercel Speed Insights / Analytics** — real-user Core Web Vitals per route if you deploy on Vercel.
• **\`useReportWebVitals\`** — send real-user metrics to your own analytics.
**Note:** Next.js 16 removed the \`size\` and \`First Load JS\` columns from \`next build\` output because they were inaccurate with Server Components. Use the bundle analyzer (section 3) and real-user metrics instead.`,
      codeSnippet: `// app/components/WebVitals.jsx
"use client";
import { useReportWebVitals } from "next/web-vitals";

export default function WebVitals() {
  useReportWebVitals((metric) => {
    // metric.name: "LCP" | "INP" | "CLS" | "FCP" | "TTFB"
    const body = JSON.stringify({ name: metric.name, value: metric.value, rating: metric.rating, page: location.pathname });
    navigator.sendBeacon?.("/api/vitals", body) ||
      fetch("/api/vitals", { method: "POST", body, keepalive: true });
  });
  return null;
}

// app/layout.js → render <WebVitals /> once inside <body>`
    },
    {
      heading: "3. Analyzing Bundles",
      content: `Large client bundles hurt INP and load time. Find out what's inside:
• **\`npx next experimental-analyze\`** (Next.js 16.1+) — the built-in **Turbopack bundle analyzer**. It opens an interactive UI where you can filter modules, see their size in client and server bundles, and trace **import chains** to learn *why* a module was included. Add \`--output\` to write results to \`.next/diagnostics/analyze\` for comparing before/after a refactor.
• **\`@next/bundle-analyzer\`** — the classic plugin, for projects building with Webpack (\`--webpack\`).
**What to look for:**
• A big library in the client bundle that's only needed on the server → move that code into a Server Component.
• A Client Component boundary placed too high (Lecture 5) → push \`"use client"\` down.
• Heavy widgets that aren't visible initially → \`next/dynamic\`.
• Duplicate libraries doing the same job (two date libraries, two icon packs).`,
      codeSnippet: `# Interactive analysis of the production bundles (Turbopack)
npx next experimental-analyze

# Save results to compare later
npx next experimental-analyze --output
cp -r .next/diagnostics/analyze ./analyze-before

# After your optimization, run again and compare the two folders`
    },
    {
      heading: "4. Built-in Optimizations You Can Turn On",
      content: `• **\`optimizePackageImports\`** — for libraries that export hundreds of modules (icon sets, utility libraries), Next.js only loads the modules you actually use. Many popular packages (e.g. \`lucide-react\`, \`date-fns\`, \`lodash-es\`) are optimized automatically; add others to the list.
• **React Compiler** (\`reactCompiler: true\`, stable in Next.js 16) — automatically memoizes components and hooks, removing most manual \`useMemo\`/\`useCallback\`/\`React.memo\`. Install \`babel-plugin-react-compiler\`. Expect slightly slower builds.
• **\`serverExternalPackages\`** — keep heavy Node-only packages (e.g. \`sharp\`, \`puppeteer\`) out of the server bundle and load them from \`node_modules\` at runtime.
• **Turbopack file-system cache** — \`experimental.turbopackFileSystemCacheForDev\` keeps compiler artifacts between \`next dev\` restarts for faster startup.`,
      codeSnippet: `// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,                                  // npm i -D babel-plugin-react-compiler
  experimental: {
    optimizePackageImports: ["@acme/icons", "my-ui-kit"],
    turbopackFileSystemCacheForDev: true,
  },
  serverExternalPackages: ["sharp"],
};

export default nextConfig;`
    },
    {
      heading: "5. Performance Patterns Recap",
      content: `Most performance wins come from patterns you've already learned:
• **Server Components by default**; Client Components only at interactive leaves.
• **Prerender** what you can (static routes, \`generateStaticParams\`, \`"use cache"\`), and **stream** the rest with \`<Suspense>\`.
• **Parallel data fetching** with \`Promise.all\`; avoid waterfalls; preload.
• **\`next/image\`** with correct \`sizes\` and \`preload\` on the LCP image.
• **\`next/font\`** instead of external font links.
• **\`next/script\`** with \`lazyOnload\` for non-critical third parties.
• **\`next/dynamic\`** for heavy, below-the-fold Client Components.
• **\`<Link>\` prefetching** for instant navigations; \`prefetch={false}\` for huge link lists.
• **Caching + revalidation** so expensive work isn't repeated per request.`
    },
    {
      heading: "6. Running Work After the Response with after()",
      content: `Some work shouldn't make the user wait: logging, analytics events, sending a notification, syncing to a search index. \`after()\` from \`next/server\` schedules a callback to run **after the response has been sent** (or after prerendering finishes).
It works in Server Components (including \`generateMetadata\`), Server Actions, Route Handlers and Proxy. Inside Server Actions and Route Handlers you can still read \`cookies()\` and \`headers()\` within the callback.`,
      codeSnippet: `// app/actions/checkout.js
"use server";
import { after } from "next/server";

export async function placeOrder(cart) {
  const order = await db.order.create({ data: cart });   // the user waits only for this

  after(async () => {
    await sendOrderConfirmationEmail(order.id);           // runs after the response
    await analytics.track("order_placed", { orderId: order.id, total: order.total });
  });

  return { orderId: order.id };
}`
    },
    {
      heading: "7. Monitoring with instrumentation.js",
      content: `\`instrumentation.js\` in the project root exports a \`register()\` function that runs **once when a server instance starts** — the place to initialize monitoring tools like **OpenTelemetry**, Sentry or Datadog.
It can also export **\`onRequestError\`**, called whenever the server catches an error (in Server Components, Route Handlers, Server Actions or Proxy), with details about the route — perfect for reporting errors with context.
\`instrumentation-client.js\` is the browser-side equivalent for client monitoring and analytics that must start before the app becomes interactive.`,
      codeSnippet: `// instrumentation.js (project root)
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./monitoring/otel-node"); // initialize OpenTelemetry / Sentry for Node
  }
}

export async function onRequestError(error, request, context) {
  await fetch("https://logs.example.com/errors", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: error.message,
      digest: error.digest,          // matches error.digest shown in error.js
      path: request.path,
      routeType: context.routeType,  // "render" | "route" | "action" | "proxy"
    }),
  });
}`
    },
    {
      heading: "8. Testing Strategy for Next.js Apps",
      content: `Use the **testing pyramid** — many fast tests at the bottom, a few realistic ones at the top:
• **Unit tests** — pure functions, Zod schemas, data transformers, utility helpers. Tools: **Vitest** or **Jest**.
• **Component tests** — Client Components and synchronous Server Components rendered with React Testing Library.
• **End-to-end (E2E) tests** — real browser against a running app: login flows, checkout, forms. Tools: **Playwright** or **Cypress**.
**Important limitation:** async Server Components are new to the React ecosystem, and unit-testing tools don't fully support rendering them yet. The official recommendation is to cover **async Server Components with E2E tests**, and to unit-test the data functions they call.`
    },
    {
      heading: "9. Unit & Component Tests with Vitest",
      content: `Vitest is fast, ESM-native and has a Jest-compatible API. Set it up with the React plugin and \`jsdom\`, then test logic and Client Components.`,
      codeSnippet: `# Install
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom vite-tsconfig-paths

// vitest.config.mjs
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: { environment: "jsdom" },
});

// lib/__tests__/slugify.test.js — unit test
import { expect, test } from "vitest";
import { slugify } from "../slugify";

test("creates URL-safe slugs", () => {
  expect(slugify("Hello Next.js 16!")).toBe("hello-next-js-16");
});

// app/components/__tests__/Counter.test.jsx — component test
import { render, screen, fireEvent } from "@testing-library/react";
import { expect, test } from "vitest";
import Counter from "../Counter";

test("increments on click", () => {
  render(<Counter />);
  fireEvent.click(screen.getByRole("button"));
  expect(screen.getByRole("button").textContent).toContain("1");
});

// package.json → "test": "vitest"`
    },
    {
      heading: "10. End-to-End Tests with Playwright",
      content: `Playwright drives real Chromium, Firefox and WebKit browsers. Point it at your app and test complete user journeys — the only way to fully test async Server Components, Server Actions, redirects and Proxy together.
Run E2E tests against a **production build** in CI for realistic behaviour. Playwright's \`webServer\` option can build and start the app automatically.`,
      codeSnippet: `# Install
npm init playwright@latest

// playwright.config.js (excerpt)
export default {
  webServer: {
    command: "npm run build && npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
  use: { baseURL: "http://localhost:3000" },
};

// e2e/contact.spec.js
import { test, expect } from "@playwright/test";

test("visitor can open notes and read a lecture", async ({ page }) => {
  await page.goto("/notes");
  await page.getByRole("link", { name: /Next\\.js/ }).first().click();
  await expect(page).toHaveURL(/\\/notes\\/nextjs/);
});

test("protected page redirects to login", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\\/login/);
});`
    },
    {
      heading: "11. Deployment Options",
      content: `Next.js can run almost anywhere. Choose based on the features you need:
• **Vercel** — zero-config deployments from Git, preview URLs for every pull request, global CDN, ISR and Cache Components handled automatically, built-in analytics. The easiest option.
• **Node.js server** — \`npm run build\` then \`npm run start\` on any VPS or PaaS (Railway, Render, DigitalOcean, AWS EC2). **Supports all features.**
• **Docker** — containerize the app (ideally with \`output: "standalone"\`) and run it on Kubernetes, AWS ECS, Google Cloud Run, Fly.io, etc. **Supports all features.**
• **Static export** — \`output: "export"\` produces plain HTML/CSS/JS for any static host (S3, GitHub Pages, Netlify static). **Limited**: no server — so no Server Actions, Route Handlers with dynamic logic, Proxy, ISR, cookies or on-demand image optimization.
• **Adapters** — platform-specific adapters (Netlify, Cloudflare, AWS Amplify, etc.) built on Next.js's Build Adapters API; feature support varies by platform.`
    },
    {
      heading: "12. Docker with Standalone Output",
      content: `\`output: "standalone"\` makes \`next build\` produce \`.next/standalone\` — a minimal folder containing only the files and \`node_modules\` the server actually needs, plus a small \`server.js\`. Docker images shrink from gigabytes to roughly 150–250 MB.
Copy \`public/\` and \`.next/static/\` into the image yourself (or serve them from a CDN) — the standalone folder doesn't include them by default.
**Self-hosting notes:**
• Image optimization uses \`sharp\`, installed automatically by modern Next.js versions.
• Running **multiple instances**? Set \`NEXT_SERVER_ACTIONS_ENCRYPTION_KEY\` so all instances share the same Server Action encryption key, configure a shared **cache handler** (e.g. Redis) for consistent caching, and set a \`deploymentId\` to handle version skew between deployments.`,
      codeSnippet: `// next.config.mjs
const nextConfig = { output: "standalone" };
export default nextConfig;

# Dockerfile (multi-stage)
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000 HOSTNAME=0.0.0.0
CMD ["node", "server.js"]

# Build & run
# docker build -t my-next-app .
# docker run -p 3000:3000 --env-file .env.production my-next-app`
    },
    {
      heading: "13. Deploying to Vercel & CI Basics",
      content: `**Vercel in four steps:**
1. Push your project to GitHub/GitLab/Bitbucket.
2. Import the repository at vercel.com → framework is detected automatically.
3. Add **environment variables** (e.g. \`EMAIL_USER\`, \`EMAIL_PASS\`, \`SESSION_SECRET\`) in Project Settings — they're not read from your local \`.env\` files.
4. Deploy. Every push to \`main\` deploys production; every pull request gets a **preview URL**.
**A minimal CI pipeline** (GitHub Actions or similar) should run on every pull request: install → lint (\`next build\` no longer lints in v16) → type-check → unit tests → build → E2E tests. Cache \`.next/cache\` between runs to speed up builds.`,
      codeSnippet: `# .github/workflows/ci.yml
name: CI
on: [pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - uses: actions/cache@v4
        with:
          path: .next/cache
          key: nextjs-\${{ hashFiles('package-lock.json') }}-\${{ github.sha }}
          restore-keys: nextjs-\${{ hashFiles('package-lock.json') }}-
      - run: npm ci
      - run: npx eslint .
      - run: npx vitest run
      - run: npm run build
      - run: npx playwright install --with-deps && npx playwright test`
    },
    {
      heading: "14. Production Checklist",
      content: `Before launch, go through this list:
• **Build & run locally** with \`npm run build && npm run start\`; fix every build warning.
• **Environment variables** set on the host (not just locally); no secrets in \`NEXT_PUBLIC_\` variables; \`.env\` files not committed.
• **Error handling**: \`error.js\`, \`global-error.js\` and \`not-found.js\` exist and look good; errors are reported (\`onRequestError\`, Sentry).
• **Security**: auth checks in every Server Action and Route Handler; security headers; rate limiting on public forms; dependencies updated.
• **SEO**: unique titles/descriptions, canonical URLs, Open Graph images, \`sitemap.js\`, \`robots.js\`, JSON-LD; staging is \`noindex\`.
• **Performance**: Lighthouse ≥ 90 on key pages; LCP image preloaded; fonts via \`next/font\`; third-party scripts deferred; bundle analyzed.
• **Caching**: correct static vs. dynamic routes in the build output; revalidation wired to your CMS/admin actions.
• **Accessibility**: semantic HTML, alt text, keyboard navigation, focus states, sufficient contrast.
• **Monitoring**: analytics and Core Web Vitals collection; uptime checks.
• **Forms tested end-to-end in production** — e.g. submit your contact form on the live site and confirm the email arrives.`
    },
    {
      heading: "15. Core Course Wrap-Up: What You've Learned",
      content: `Congratulations — you've completed the **core** Next.js 16 course! You can now:
• Set up and structure a Next.js 16 project with the App Router and Turbopack (Lecture 1).
• Build any routing structure — layouts, dynamic and catch-all routes, groups, parallel and intercepting routes (Lectures 2–4).
• Design with Server and Client Components, keeping JavaScript minimal (Lecture 5).
• Fetch data efficiently with streaming, parallel requests and memoization (Lecture 6).
• Cache and revalidate with Cache Components, \`"use cache"\`, \`cacheLife\`, \`cacheTag\` and \`updateTag\` (Lecture 7).
• Mutate data with Server Actions and accessible, progressively enhanced forms (Lecture 8).
• Build APIs with Route Handlers and request logic with Proxy (Lecture 9).
• Style and optimize images, fonts and scripts (Lecture 10), and make pages discoverable with metadata and SEO (Lecture 11).
• Secure your app with sessions, a Data Access Layer and proper authorization (Lecture 12).
• Measure, test and deploy to production (Lecture 13).
**Keep going with the advanced lectures:** internationalization (14), databases end to end (15), MDX, CMS and Draft Mode (16), View Transitions and React 19.2 (17), and static exports, SPAs and PWAs (18).
**Then build something real.** A portfolio with a blog and notes section (like this site), a SaaS dashboard with auth, or an e-commerce store will exercise every lecture. Keep the official docs bundled in \`node_modules/next/dist/docs\` handy — they always match your installed version.`
    }
  ]
};
