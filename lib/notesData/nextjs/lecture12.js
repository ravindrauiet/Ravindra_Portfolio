export const lecture12 = {
  slug: "lecture-12",
  number: 12,
  title: "Complete Next.js Course — Lecture 12: Authentication, Authorization & Security",
  summary: "Secure a Next.js 16 app end to end: authentication vs. authorization, signup and login with Server Actions, stateless JWT sessions in httpOnly cookies with jose, the Data Access Layer with verifySession, DTOs, protecting pages, layouts, Server Actions and Route Handlers, optimistic checks in proxy, auth libraries, environment variables, the taint API and security headers.",
  readTime: "31 min read",
  difficulty: "Advanced",
  date: "2026-10-04",
  sections: [
    {
      heading: "1. Authentication vs. Authorization vs. Session Management",
      content: `Three separate concerns that people often blur together:
• **Authentication** — *who are you?* Verifying identity with a password, OAuth (Google/GitHub), magic link or passkey.
• **Session management** — *remembering* who you are across requests, usually with a signed or encrypted cookie.
• **Authorization** — *what are you allowed to do?* Deciding whether this user may view this page, edit this post or call this action.
Most security bugs in real apps are **authorization** bugs: the user is logged in, but the code forgets to check that the record they're editing belongs to them. Keep this distinction in mind for the whole lecture.`
    },
    {
      heading: "2. Build It Yourself or Use a Library?",
      content: `Authentication is security-critical and full of edge cases: password hashing, rate limiting, OAuth flows, email verification, password resets, session rotation, account linking.
**Recommendation:** use a well-maintained auth library or service for production — for example **Auth.js (NextAuth)**, **Better Auth**, **Clerk**, **Supabase Auth**, **Kinde** or **WorkOS**. They handle the hard parts and integrate with the App Router.
**Still learn the fundamentals below**, because:
• Every library uses the same building blocks (cookies, sessions, server-side checks).
• **Authorization is always your job** — no library knows that only the author may edit a post.
• You'll understand where to put checks: the Data Access Layer, Server Actions, Route Handlers.
The examples in this lecture follow the patterns from the official Next.js authentication guide.`
    },
    {
      heading: "3. Signup with a Server Action",
      content: `The signup flow: a form → a Server Action that **validates** input, **hashes** the password, **creates** the user, **creates a session**, and **redirects**.
• Validate with Zod on the server (Lecture 8).
• **Never store plain passwords** — hash with \`bcrypt\` or \`argon2\`.
• Return validation errors as state for \`useActionState\`.
• Don't reveal whether an email exists on the **login** form ("Invalid email or password" for both cases) to prevent account enumeration.`,
      codeSnippet: `// app/actions/auth.js
"use server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { createSession, deleteSession } from "@/lib/session";
import { db } from "@/lib/db";

const SignupSchema = z.object({
  name: z.string().trim().min(2, "Name is too short"),
  email: z.string().trim().toLowerCase().email("Invalid email"),
  password: z
    .string()
    .min(8, "At least 8 characters")
    .regex(/[A-Za-z]/, "Include a letter")
    .regex(/[0-9]/, "Include a number"),
});

export async function signup(prevState, formData) {
  const parsed = SignupSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  const { name, email, password } = parsed.data;
  if (await db.user.findUnique({ where: { email } })) {
    return { errors: { email: ["An account with this email already exists"] } };
  }

  const user = await db.user.create({
    data: { name, email, passwordHash: await bcrypt.hash(password, 12), role: "user" },
  });

  await createSession(user.id, user.role);
  redirect("/dashboard");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}`
    },
    {
      heading: "4. Stateless Sessions: Signed JWTs in httpOnly Cookies",
      content: `Two session strategies:
• **Stateless** — session data (user ID, role, expiry) is stored in a **signed/encrypted cookie**. No database lookup per request. Simple and fast, but you can't instantly revoke a single session.
• **Database sessions** — the cookie holds only a random session ID; the data lives in a database table. Revocable at any time, at the cost of a lookup per request.
For a stateless session, sign a JWT with a secret using the **\`jose\`** library (works in every runtime). Generate the secret once with \`openssl rand -base64 32\` and store it in \`SESSION_SECRET\`.`,
      codeSnippet: `// lib/session.js
import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const key = new TextEncoder().encode(process.env.SESSION_SECRET);
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

export async function encrypt(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function decrypt(token = "") {
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
    return payload;
  } catch {
    return null; // missing, expired or tampered
  }
}

export async function createSession(userId, role) {
  const expiresAt = new Date(Date.now() + SEVEN_DAYS);
  const token = await encrypt({ userId, role, expiresAt });
  (await cookies()).set("session", token, {
    httpOnly: true,                                  // JavaScript can't read it (XSS protection)
    secure: process.env.NODE_ENV === "production",   // HTTPS only
    sameSite: "lax",                                 // CSRF protection for most cases
    expires: expiresAt,
    path: "/",
  });
}

export async function deleteSession() {
  (await cookies()).delete("session");
}`
    },
    {
      heading: "5. Login: Verifying Credentials",
      content: `Login mirrors signup: validate, look up the user, compare the password hash with \`bcrypt.compare\`, create a session, redirect.
**Security details that matter:**
• Return the **same generic error** for an unknown email and a wrong password.
• **Rate-limit** login attempts per IP and per account to stop brute-force attacks (e.g. with Upstash Ratelimit or a Redis counter).
• Support a safe \`next\` redirect — only allow **relative paths** so attackers can't build \`/login?next=https://evil.com\` links (open redirect).`,
      codeSnippet: `// app/actions/auth.js (continued)
const LoginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});

export async function login(prevState, formData) {
  const parsed = LoginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { message: "Invalid email or password" };

  const user = await db.user.findUnique({ where: { email: parsed.data.email } });
  const valid = user && (await bcrypt.compare(parsed.data.password, user.passwordHash));
  if (!valid) return { message: "Invalid email or password" }; // same message for both cases

  await createSession(user.id, user.role);

  const next = String(formData.get("next") || "/dashboard");
  redirect(next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard"); // block open redirects
}`
    },
    {
      heading: "6. The Data Access Layer (DAL) and verifySession",
      content: `The most important pattern in this lecture. Centralize all data access **and its authorization checks** in one server-only layer.
• \`verifySession()\` reads and verifies the session cookie, and **redirects to login** if it's missing or invalid.
• It's wrapped in React \`cache()\` so calling it from a layout, a page and three components costs **one** verification per request.
• Every data function (\`getUser\`, \`getInvoices\`, \`updatePost\`) calls \`verifySession()\` first and checks **permissions for the specific record**.
Why here and not only in pages? Because data functions are reused everywhere — pages, Server Actions, Route Handlers. If the check lives next to the data, it can't be forgotten.`,
      codeSnippet: `// lib/dal.js
import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decrypt } from "@/lib/session";
import { db } from "@/lib/db";

export const verifySession = cache(async () => {
  const token = (await cookies()).get("session")?.value;
  const session = await decrypt(token);
  if (!session?.userId) redirect("/login");
  return { userId: session.userId, role: session.role };
});

export const getCurrentUser = cache(async () => {
  const { userId } = await verifySession();
  return db.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true }, // never select passwordHash
  });
});

export async function getInvoice(invoiceId) {
  const { userId, role } = await verifySession();
  const invoice = await db.invoice.findUnique({ where: { id: invoiceId } });
  if (!invoice) return null;
  if (invoice.ownerId !== userId && role !== "admin") return null; // authorization per record
  return invoice;
}`
    },
    {
      heading: "7. Data Transfer Objects: Return Only What's Safe",
      content: `Even after authorization, don't return entire database rows to components — especially Client Components, whose props are visible in the page source.
A **Data Transfer Object (DTO)** is a function that shapes data for the viewer: it includes only the fields this user is allowed to see.
• Hide \`passwordHash\`, tokens, internal flags, other users' emails.
• Show fields conditionally by role (an admin sees the phone number; others don't).
This turns "be careful what you pass to the client" from a habit into an enforced rule.`,
      codeSnippet: `// lib/dto/user.js
import "server-only";
import { verifySession } from "@/lib/dal";
import { db } from "@/lib/db";

export async function getProfileDTO(profileId) {
  const viewer = await verifySession();
  const user = await db.user.findUnique({ where: { id: profileId } });
  if (!user) return null;

  const isSelf = viewer.userId === user.id;
  const isAdmin = viewer.role === "admin";

  return {
    id: user.id,
    name: user.name,
    avatarUrl: user.avatarUrl,
    email: isSelf || isAdmin ? user.email : null,   // private unless self/admin
    phone: isAdmin ? user.phone : null,             // admins only
    // passwordHash, resetToken, internalNotes: never included
  };
}`
    },
    {
      heading: "8. Protecting Pages and Layouts",
      content: `Call \`verifySession()\` (or a function that uses it) in the **page** that needs protection. Unauthenticated users are redirected before anything renders.
**Caution with layouts:** because layouts don't re-render on client-side navigation, an auth check only in a layout may not run on every navigation between its child pages. Use layout checks for convenience (e.g. showing the user's name), but **put the real check in pages and data functions** — the DAL makes this automatic because every data call verifies the session.
For role-based UI, render different components based on the session — and still enforce the rule on the server when data is fetched or mutated.`,
      codeSnippet: `// app/dashboard/page.js
import { verifySession, getCurrentUser } from "@/lib/dal";
import AdminPanel from "./AdminPanel";
import UserPanel from "./UserPanel";

export default async function DashboardPage() {
  const session = await verifySession();     // redirects to /login if needed
  const user = await getCurrentUser();

  return (
    <main>
      <h1>Welcome back, {user.name}</h1>
      {session.role === "admin" ? <AdminPanel /> : <UserPanel />}
    </main>
  );
}`
    },
    {
      heading: "9. Protecting Server Actions and Route Handlers",
      content: `Server Actions and Route Handlers are **public HTTP endpoints**. A hidden button is not protection — anyone can call them directly. Check inside every one:
• **Server Actions** — call \`verifySession()\` at the top, then authorize the specific operation.
• **Route Handlers** — verify the session (or an API key for machine clients) and return **401** (not logged in) or **403** (not allowed) instead of redirecting.
Remember: \`proxy.js\` can be bypassed by matcher changes and doesn't see which record is being modified, so it can never replace these checks.`,
      codeSnippet: `// app/actions/posts.js
"use server";
import { verifySession } from "@/lib/dal";
import { updateTag } from "next/cache";

export async function publishPost(postId) {
  const { userId, role } = await verifySession();
  const post = await db.post.findUnique({ where: { id: postId }, select: { authorId: true } });
  if (!post) return { error: "Post not found" };
  if (post.authorId !== userId && role !== "editor") return { error: "Not allowed" };

  await db.post.update({ where: { id: postId }, data: { published: true } });
  updateTag("posts");
  return { ok: true };
}

// app/api/invoices/[id]/route.js
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";

export async function GET(request, { params }) {
  const session = await decrypt((await cookies()).get("session")?.value);
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const invoice = await db.invoice.findUnique({ where: { id } });
  if (!invoice || invoice.ownerId !== session.userId) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }
  return Response.json(invoice);
}`
    },
    {
      heading: "10. Optimistic Checks in Proxy",
      content: `\`proxy.js\` (Lecture 9) is a good place for **fast, optimistic** checks: read the session cookie, verify its signature, and redirect anonymous users away from protected sections before any rendering work happens. This improves UX and saves server work.
Rules:
• Only read the **cookie** — don't query the database on every request in Proxy.
• Treat it as a **first filter**, never the only check.
• Exclude static assets with a matcher so it stays fast.`,
      codeSnippet: `// proxy.js
import { NextResponse } from "next/server";
import { decrypt } from "@/lib/session";

const PROTECTED = ["/dashboard", "/settings", "/admin"];
const PUBLIC_ONLY = ["/login", "/signup"];

export async function proxy(request) {
  const path = request.nextUrl.pathname;
  const session = await decrypt(request.cookies.get("session")?.value);

  if (PROTECTED.some((p) => path.startsWith(p)) && !session?.userId) {
    return NextResponse.redirect(new URL("/login?next=" + encodeURIComponent(path), request.url));
  }
  if (PUBLIC_ONLY.includes(path) && session?.userId) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\\\..*).*)"],
};`
    },
    {
      heading: "11. Environment Variables & Secrets",
      content: `Next.js loads environment variables from \`.env\` files automatically. Lookup order (first match wins): **\`process.env\`** → **\`.env.$(NODE_ENV).local\`** → **\`.env.local\`** (skipped in \`test\`) → **\`.env.$(NODE_ENV)\`** → **\`.env\`**.
Rules every developer must know:
• Variables are **server-only by default**. \`process.env.SESSION_SECRET\` is available in Server Components, Actions, Route Handlers and Proxy — and is an empty value in browser code.
• Prefix with **\`NEXT_PUBLIC_\`** to expose a value to the browser. It is **inlined into the JavaScript bundle at build time** — anyone can read it, and changing it requires a rebuild. Never put secrets in \`NEXT_PUBLIC_\` variables.
• **Never commit \`.env*\` files** with real secrets. Commit a \`.env.example\` with placeholder values instead (this portfolio does exactly that).
• Set the real values in your hosting provider's dashboard — \`.env\` files on your laptop don't deploy themselves.
• To read a variable at **request time** instead of build time, call \`await connection()\` first.
• \`serverRuntimeConfig\`/\`publicRuntimeConfig\` were **removed** in Next.js 16 — use environment variables.`,
      codeSnippet: `# .env.example — committed, no real values
SESSION_SECRET=generate-with-openssl-rand-base64-32
DATABASE_URL=postgresql://user:password@localhost:5432/app
EMAIL_USER=
EMAIL_PASS=
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# .env.local — NOT committed (already ignored by .gitignore: .env*)
SESSION_SECRET=6Jx...real-secret...Q=
DATABASE_URL=postgresql://prod-user:...@db.example.com:5432/app

// Usage
// Server:  const db = connect(process.env.DATABASE_URL);
// Client:  const url = process.env.NEXT_PUBLIC_SITE_URL;   // inlined at build time`
    },
    {
      heading: "12. Preventing Data Leaks: server-only and the Taint API",
      content: `Defense in depth against accidentally sending secrets to the browser:
• **\`import "server-only"\`** in modules with secrets or DB access — importing them into client code fails the build (Lecture 5).
• **React Taint API** — mark specific objects or values as "must never reach the client". If tainted data is passed to a Client Component, React throws an error. Enable it with \`experimental.taint: true\` and use \`experimental_taintObjectReference\` / \`experimental_taintUniqueValue\` from \`react\`.
• **DTOs** (section 7) so only safe fields leave the server.
• **Review props** of Client Components — everything you pass is in the HTML/RSC payload.`,
      codeSnippet: `// next.config.mjs
// const nextConfig = { experimental: { taint: true } };

// lib/data/user.js
import "server-only";
import { experimental_taintObjectReference, experimental_taintUniqueValue } from "react";

export async function getUserRecord(id) {
  const user = await db.user.findUnique({ where: { id } });
  experimental_taintObjectReference("Do not pass the full user record to the client", user);
  experimental_taintUniqueValue("Do not pass the API token to the client", user, user.apiToken);
  return user;
}`
    },
    {
      heading: "13. Security Headers & Other Hardening",
      content: `A few more protections for production apps:
• **Security headers** via \`headers()\` in \`next.config.js\` (or Proxy): \`X-Frame-Options: DENY\` (clickjacking), \`X-Content-Type-Options: nosniff\`, \`Referrer-Policy\`, \`Permissions-Policy\`, and \`Strict-Transport-Security\`.
• **Content Security Policy (CSP)** restricts which scripts, styles and images may load — the strongest defense against XSS. Next.js supports nonce-based CSP generated in \`proxy.js\`; see the official CSP guide.
• **Escape user content** — React escapes text automatically; be careful with \`dangerouslySetInnerHTML\`, Markdown-to-HTML and HTML emails (sanitize with a library like DOMPurify or escape manually).
• **Rate limiting** on login, signup, contact forms and expensive endpoints.
• **Keep dependencies updated** (\`npm audit\`, Dependabot) — and Next.js itself, which ships security patches regularly.
• **Log security events** (failed logins, permission denials) without logging passwords or tokens.`,
      codeSnippet: `// next.config.mjs
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;`
    },
    {
      heading: "14. Practical: The Complete Auth File Map",
      content: `Here is how the pieces fit together in a real project. Build them in this order: session helpers → DAL → signup/login actions and forms → protected pages → proxy → security headers. Then test the **negative** cases: visiting \`/dashboard\` logged out, editing another user's record by changing an ID, calling a Server Action from the browser console without a session.`,
      codeSnippet: `.env.local                    # SESSION_SECRET, DATABASE_URL (never committed)
proxy.js                      # optimistic redirect for /dashboard, /settings
next.config.mjs               # security headers
lib/
├── session.js                # encrypt / decrypt / createSession / deleteSession (server-only)
├── dal.js                    # verifySession (cached), getCurrentUser, getInvoice — auth + authz
└── dto/user.js               # safe shapes of data per viewer
app/
├── actions/auth.js           # signup, login, logout ("use server")
├── actions/posts.js          # every action starts with verifySession()
├── (auth)/login/page.js      # <LoginForm /> with useActionState
├── (auth)/signup/page.js
├── dashboard/page.js         # await verifySession() + role-based UI
└── api/invoices/[id]/route.js# 401 / 403 JSON responses`
    },
    {
      heading: "15. Summary",
      content: `• Authentication = who you are; session = remembering it; authorization = what you may do. Authorization bugs are the most common.
• Prefer an auth library in production, but authorization logic is always yours.
• Hash passwords, validate input, use generic login errors, rate-limit, and block open redirects.
• Store sessions in **httpOnly, secure, sameSite** cookies; sign them with \`jose\` and a strong \`SESSION_SECRET\`.
• Build a **Data Access Layer**: \`verifySession()\` wrapped in \`cache()\`, called by every data function, with per-record permission checks.
• Return **DTOs**, never raw rows. Use \`server-only\` and the Taint API to prevent leaks.
• Check auth inside pages, **every Server Action** and **every Route Handler**; use Proxy only for optimistic redirects.
• Server env vars stay private; \`NEXT_PUBLIC_\` values are public and inlined at build time. Never commit secrets.
• Add security headers, consider CSP, escape user HTML and keep dependencies updated.
**Next lecture:** performance, testing and deployment — taking your app to production.`
    }
  ]
};
