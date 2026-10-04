export const lecture09 = {
  slug: "lecture-9",
  number: 9,
  title: "Complete Next.js Course — Lecture 9: Route Handlers & Proxy (formerly Middleware)",
  summary: "Build backend endpoints inside your Next.js app with Route Handlers: HTTP methods, NextRequest and NextResponse, dynamic params, caching GET handlers, CORS, webhooks, streaming and file responses. Then master proxy.js — the Next.js 16 replacement for middleware — with matchers, redirects, rewrites, headers, cookies and optimistic auth checks.",
  readTime: "28 min read",
  difficulty: "Intermediate",
  date: "2026-10-04",
  sections: [
    {
      heading: "1. What Are Route Handlers?",
      content: `A **Route Handler** is a file named \`route.js\` inside \`app/\` that responds to HTTP requests with any kind of data instead of a page — JSON, text, XML, images, files, streams.
• They use the standard Web **\`Request\`** and **\`Response\`** APIs, extended by Next.js as \`NextRequest\` and \`NextResponse\`.
• They live anywhere in \`app/\` — by convention under \`app/api/\` — but a \`route.js\` **cannot** sit in the same folder as a \`page.js\` (both would claim the same URL).
• Supported methods: **GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS**. Export a function named after each method. Unsupported methods get a **405**.
**This portfolio uses one**: the contact form posts to \`app/api/contact/route.js\`, which validates the input and sends an email with Nodemailer.`,
      codeSnippet: `// app/api/hello/route.js  →  GET /api/hello
export async function GET() {
  return Response.json({ message: "Hello from Next.js 16 👋" });
}

// app/api/echo/route.js  →  POST /api/echo
export async function POST(request) {
  const body = await request.json();
  return Response.json({ youSent: body }, { status: 201 });
}`
    },
    {
      heading: "2. When to Use Route Handlers (and When Not To)",
      content: `In the App Router you need far fewer API routes than in a SPA. Use the right tool:
• **Reading data for your own pages** → fetch directly in Server Components (Lecture 6). No API route needed.
• **Mutations from your own UI** → Server Actions (Lecture 8).
• **Route Handlers are the right choice for:**
  – **Webhooks** from third parties (Stripe, GitHub, a CMS, Razorpay).
  – **Public APIs** consumed by mobile apps, partners or other services.
  – **Non-HTML responses**: RSS feeds, file downloads, generated images or PDFs.
  – **OAuth callbacks** and auth endpoints from libraries.
  – **Endpoints called by client-side libraries** like SWR for polling.`
    },
    {
      heading: "3. Reading the Request: JSON, Form Data, Query, Headers & Cookies",
      content: `\`NextRequest\` exposes everything about the incoming request:
• **Body** — \`await request.json()\`, \`await request.formData()\`, \`await request.text()\`.
• **Query string** — \`request.nextUrl.searchParams.get("q")\`.
• **Headers** — \`request.headers.get("authorization")\`, or \`await headers()\` from \`next/headers\`.
• **Cookies** — \`request.cookies.get("session")?.value\`, or \`await cookies()\` from \`next/headers\`.
Always validate the body — a malformed or malicious request should get a **400**, not crash your handler.`,
      codeSnippet: `// app/api/search/route.js  →  GET /api/search?q=next&limit=5
import { NextResponse } from "next/server";

export async function GET(request) {
  const q = request.nextUrl.searchParams.get("q") ?? "";
  const limit = Math.min(Number(request.nextUrl.searchParams.get("limit")) || 10, 50);
  const token = request.headers.get("authorization");
  const locale = request.cookies.get("locale")?.value ?? "en";

  if (!q) {
    return NextResponse.json({ error: "Missing ?q parameter" }, { status: 400 });
  }

  const results = await searchIndex(q, { limit, locale });
  return NextResponse.json({ q, count: results.length, results });
}`
    },
    {
      heading: "4. Dynamic Route Handlers & RouteContext",
      content: `Dynamic segments work exactly like pages: \`app/api/posts/[id]/route.js\` handles \`/api/posts/123\`. The second argument (\`context\`) contains \`params\` — a **Promise** in Next.js 16. TypeScript users can type it with the generated \`RouteContext<"/api/posts/[id]">\` helper.
A RESTful resource typically exports several methods from one file.`,
      codeSnippet: `// app/api/posts/[id]/route.js
import { NextResponse } from "next/server";
import { z } from "zod";

const UpdateSchema = z.object({ title: z.string().min(1).max(200) });

export async function GET(request, { params }) {
  const { id } = await params;
  const post = await db.post.findUnique({ where: { id } });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  const parsed = UpdateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const post = await db.post.update({ where: { id }, data: parsed.data });
  return NextResponse.json(post);
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  await db.post.delete({ where: { id } });
  return new Response(null, { status: 204 });
}`
    },
    {
      heading: "5. Building Responses with NextResponse",
      content: `\`NextResponse\` adds helpers on top of the standard \`Response\`:
• **\`NextResponse.json(data, { status, headers })\`** — JSON responses.
• **\`NextResponse.redirect(new URL("/login", request.url))\`** — redirects (absolute URL required).
• **\`NextResponse.rewrite(url)\`** — serve another URL's content without changing the address bar (mainly in Proxy).
• **\`NextResponse.next()\`** — continue to the route (Proxy only).
• **\`response.cookies.set(...)\` / \`.delete(...)\`** — set cookies on the response.
• **\`response.headers.set(...)\`** — add headers like \`Cache-Control\`.
For non-JSON content, use a plain \`new Response(body, { headers })\` with the right \`Content-Type\`.`,
      codeSnippet: `// app/api/login/route.js
import { NextResponse } from "next/server";

export async function POST(request) {
  const { email, password } = await request.json();
  const user = await verifyCredentials(email, password);
  if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const response = NextResponse.json({ ok: true, name: user.name });
  response.cookies.set("session", await createSessionToken(user.id), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}

// app/feed.xml/route.js — RSS feed
export async function GET() {
  const xml = await buildRssFeed();
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml" } });
}`
    },
    {
      heading: "6. Caching GET Route Handlers",
      content: `Route Handlers are **not cached** by default, and only **GET** can ever be cached — POST, PUT, PATCH and DELETE always run.
• **Previous model:** add \`export const dynamic = "force-static"\` (optionally with \`export const revalidate = 3600\`) to prerender the GET response at build time.
• **With Cache Components:** GET handlers follow the same model as pages. A handler that uses no runtime or uncached data is **prerendered automatically**; otherwise it runs per request. Use \`"use cache"\` in a helper function to cache the expensive part.
Responses can also carry HTTP caching headers (\`Cache-Control: public, s-maxage=600\`) so CDNs cache them.`,
      codeSnippet: `// Previous model — app/api/countries/route.js
export const dynamic = "force-static";
export const revalidate = 86400; // regenerate daily

export async function GET() {
  const countries = await fetch("https://restcountries.com/v3.1/all?fields=name").then((r) => r.json());
  return Response.json(countries);
}

// Cache Components — cache the data function
import { cacheLife } from "next/cache";

async function getCountries() {
  "use cache";
  cacheLife("days");
  return fetch("https://restcountries.com/v3.1/all?fields=name").then((r) => r.json());
}

export async function GET() {
  return Response.json(await getCountries());
}`
    },
    {
      heading: "7. CORS: Allowing Other Origins",
      content: `Browsers block JavaScript on \`https://other-site.com\` from reading your API's responses unless you send **CORS headers**. If your Route Handler is consumed by another frontend, respond to the **preflight \`OPTIONS\`** request and add the headers to every response.
Only allow the specific origins you trust — \`*\` is fine for truly public, read-only, cookie-free data.`,
      codeSnippet: `// app/api/public/stats/route.js
const ALLOWED = ["https://ravindranathjha.in", "https://partner.example.com"];

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": ALLOWED.includes(origin) ? origin : ALLOWED[0],
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    Vary: "Origin",
  };
}

export async function OPTIONS(request) {
  return new Response(null, { status: 204, headers: corsHeaders(request.headers.get("origin")) });
}

export async function GET(request) {
  const stats = await getPublicStats();
  return Response.json(stats, { headers: corsHeaders(request.headers.get("origin")) });
}`
    },
    {
      heading: "8. Webhooks: Verifying Signatures",
      content: `Webhooks are POST requests from external services. Anyone can send a POST to your URL, so **verify the signature** the provider sends — usually an HMAC of the raw body using a shared secret.
Important details:
• Read the **raw body** with \`request.text()\` — re-serialized JSON won't match the signature.
• Compare signatures with \`crypto.timingSafeEqual\` to avoid timing attacks.
• Respond quickly with **2xx**; do slow work afterwards (Next.js's \`after()\` from \`next/server\` runs code after the response is sent).
• Make handlers **idempotent** — providers retry on failure, so the same event may arrive twice.`,
      codeSnippet: `// app/api/webhooks/payments/route.js
import crypto from "node:crypto";
import { after } from "next/server";
import { revalidateTag } from "next/cache";

export async function POST(request) {
  const rawBody = await request.text();
  const received = request.headers.get("x-signature") ?? "";
  const expected = crypto
    .createHmac("sha256", process.env.PAYMENT_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");

  const valid =
    received.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(received), Buffer.from(expected));
  if (!valid) return Response.json({ error: "Invalid signature" }, { status: 401 });

  const event = JSON.parse(rawBody);

  after(async () => {
    // Runs after the 200 is sent — keeps the provider's request fast
    await markOrderPaid(event.data.orderId, event.id); // idempotent by event.id
    revalidateTag("orders", "max");
  });

  return Response.json({ received: true });
}`
    },
    {
      heading: "9. Proxy: Code That Runs Before Every Request",
      content: `**Proxy** (\`proxy.js\`) runs **before a request is matched to a route**. It can redirect, rewrite, set headers and cookies, or respond directly — for many routes at once.
**Next.js 16 change:** this feature was previously called **Middleware** (\`middleware.js\`). The file and the exported function are now named **\`proxy\`**; the old name is deprecated. Proxy runs on the **Node.js runtime** (the Edge runtime isn't supported in \`proxy\`). Migrate automatically with the codemod: \`npx @next/codemod@canary upgrade latest\`.
Convention:
• One file, **\`proxy.js\`**, in the project root (next to \`app/\`, or inside \`src/\` if you use it).
• Export a function named \`proxy\` (or a default export).
• Optionally export a \`config\` object with a **\`matcher\`** to choose which paths it runs on.`,
      codeSnippet: `// proxy.js (project root)
import { NextResponse } from "next/server";

export function proxy(request) {
  // Example: redirect the old /about-us URL
  if (request.nextUrl.pathname === "/about-us") {
    return NextResponse.redirect(new URL("/about", request.url));
  }
  return NextResponse.next(); // continue normally
}

export const config = {
  matcher: ["/about-us", "/dashboard/:path*"],
};

// Migrating from Next.js 15:
//   mv middleware.js proxy.js
//   export function middleware(...)  →  export function proxy(...)`
    },
    {
      heading: "10. Matchers: Run Proxy Only Where Needed",
      content: `Without a matcher, Proxy runs on **every request** — including JavaScript chunks (\`_next/static\`), optimized images (\`_next/image\`) and \`public/\` files. That's wasteful and slows the whole site.
Matcher options:
• A single path or an array: \`"/dashboard/:path*"\` matches \`/dashboard\` and everything below it.
• \`:path*\` (zero or more), \`:path+\` (one or more), \`:path?\` (optional).
• A **negative lookahead regex** to exclude static assets — the most common production setup.
• Objects with \`has\` / \`missing\` conditions on headers, cookies or query.
Matcher values must be **constants** (statically analyzable) — variables are ignored.`,
      codeSnippet: `export const config = {
  matcher: [
    // Run on everything EXCEPT api routes, Next.js internals and static files
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\\\.(?:png|jpg|svg|webp)$).*)",
  ],
};

// Conditional matching with has / missing
export const config = {
  matcher: [
    {
      source: "/dashboard/:path*",
      missing: [{ type: "cookie", key: "session" }], // only when not logged in
    },
  ],
};`
    },
    {
      heading: "11. Common Proxy Use Cases",
      content: `Proxy is ideal for quick, request-level decisions:
• **Redirects** based on conditions (old URLs, locale, device, maintenance mode).
• **Rewrites** — serve different content at the same URL: A/B tests, multi-tenant subdomains (\`acme.app.com\` → \`/sites/acme\`), feature flags.
• **Headers** — security headers (CSP), CORS for many routes, request IDs.
• **Cookies** — set an A/B bucket or a locale preference on first visit.
• **Optimistic auth checks** — if there's no session cookie, redirect to \`/login\` before rendering anything.
**Proxy is NOT for:** slow data fetching, database queries on every request, or being your only authorization layer. Keep it fast — it runs before every matched request. Do real permission checks close to the data (Lecture 12).`,
      codeSnippet: `// proxy.js — locale redirect + A/B test + security header
import { NextResponse } from "next/server";

export function proxy(request) {
  const { pathname } = request.nextUrl;

  // 1. Locale: send / to /en or /hi based on the browser language
  if (pathname === "/") {
    const lang = request.headers.get("accept-language")?.startsWith("hi") ? "hi" : "en";
    return NextResponse.redirect(new URL("/" + lang, request.url));
  }

  // 2. A/B test: rewrite /pricing to a variant, sticky via cookie
  if (pathname === "/pricing") {
    const bucket = request.cookies.get("ab-pricing")?.value ?? (Math.random() < 0.5 ? "a" : "b");
    const response = NextResponse.rewrite(new URL("/pricing/" + bucket, request.url));
    response.cookies.set("ab-pricing", bucket, { maxAge: 60 * 60 * 24 * 30 });
    return response;
  }

  // 3. Add a header to every other matched response
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  return response;
}

export const config = { matcher: ["/", "/pricing", "/dashboard/:path*"] };`
    },
    {
      heading: "12. Optimistic Auth Checks in Proxy",
      content: `A common pattern is a fast cookie check in Proxy to redirect obviously unauthenticated users before any rendering happens. It's "optimistic" because it only checks that a session cookie exists (and optionally that its signature is valid) — **not** that the user may access a particular record.
**Important:** Server Functions are POST requests to the page they're defined on and can be missed if your matcher changes. Always re-check authentication and authorization inside pages, Server Actions and Route Handlers too.`,
      codeSnippet: `// proxy.js
import { NextResponse } from "next/server";
import { decrypt } from "@/lib/session"; // verifies the signed cookie (Lecture 12)

const protectedRoutes = ["/dashboard", "/settings"];
const authRoutes = ["/login", "/signup"];

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const session = await decrypt(request.cookies.get("session")?.value);

  const isProtected = protectedRoutes.some((r) => pathname.startsWith(r));
  if (isProtected && !session?.userId) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (authRoutes.includes(pathname) && session?.userId) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\\\.png$).*)"],
};`
    },
    {
      heading: "13. Practical: A Contact Form API (Like This Portfolio's)",
      content: `This Route Handler mirrors the one powering this website's contact form, with production improvements: Zod validation, HTML-escaping user input before putting it in an email, a honeypot field against bots, and an explicit error when email isn't configured — so visitors never see a fake "sent" message.`,
      codeSnippet: `// app/api/contact/route.js
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email(),
  phone: z.string().trim().max(20).optional().default(""),
  message: z.string().trim().min(10).max(5000),
  website: z.string().max(0).optional(), // honeypot: real users leave it empty
});

const escapeHtml = (s) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export async function POST(request) {
  const parsed = ContactSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Please check the form fields." }, { status: 400 });
  }

  const { EMAIL_USER, EMAIL_PASS } = process.env;
  if (!EMAIL_USER || !EMAIL_PASS) {
    console.error("Contact form: email credentials are not configured");
    return NextResponse.json({ success: false, error: "Messaging is temporarily unavailable." }, { status: 503 });
  }

  const { name, email, phone, message } = parsed.data;
  const transporter = nodemailer.createTransport({ service: "gmail", auth: { user: EMAIL_USER, pass: EMAIL_PASS } });

  await transporter.sendMail({
    from: EMAIL_USER,
    replyTo: email,
    to: EMAIL_USER,
    subject: "Portfolio contact: " + name,
    html:
      "<p><b>Name:</b> " + escapeHtml(name) + "</p>" +
      "<p><b>Email:</b> " + escapeHtml(email) + "</p>" +
      "<p><b>Phone:</b> " + escapeHtml(phone || "Not provided") + "</p>" +
      "<p>" + escapeHtml(message).replace(/\\n/g, "<br/>") + "</p>",
  });

  return NextResponse.json({ success: true, message: "Thanks! Your message has been sent." });
}`
    },
    {
      heading: "14. Summary",
      content: `• \`route.js\` files are Route Handlers: export \`GET\`, \`POST\`, \`PUT\`, \`PATCH\`, \`DELETE\`, \`HEAD\`, \`OPTIONS\`. A folder can't have both \`route.js\` and \`page.js\`.
• Use them for webhooks, public APIs, non-HTML responses and auth callbacks — not for your own pages' reads (Server Components) or mutations (Server Actions).
• \`NextRequest\` gives body, query, headers and cookies; \`NextResponse\` builds JSON, redirects and cookies. \`params\` is a Promise.
• Only GET can be cached: \`dynamic = "force-static"\` (previous model) or automatic prerendering / \`"use cache"\` (Cache Components).
• Handle CORS with \`OPTIONS\` + headers; verify webhook signatures on the raw body; use \`after()\` for post-response work.
• **\`proxy.js\` replaces \`middleware.js\` in Next.js 16** — runs before routing on the Node.js runtime. Always add a \`matcher\`.
• Use Proxy for redirects, rewrites, headers, cookies and optimistic auth — never as your only security layer.
**Next lecture:** styling and assets — CSS Modules, Tailwind, \`next/image\`, \`next/font\`, \`next/script\` and lazy loading.`
    }
  ]
};
