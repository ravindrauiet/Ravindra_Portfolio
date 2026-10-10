export const lecture27 = {
  slug: "lecture-27",
  number: 27,
  title: "Complete React Course — Module 10: Lecture 27: Styling, Accessibility, Deployment & Capstone Project",
  summary: "Ship a production-ready React app: compare CSS Modules, Tailwind CSS v4 and CSS-in-JS, apply accessibility essentials (semantic HTML, ARIA, keyboard focus, color contrast), use Vite environment variables, build and preview, deploy to Vercel or Netlify with SPA fallback routing, add error boundaries and plan your capstone project.",
  readTime: "55 min read",
  difficulty: "Advanced",
  date: "2026-10-09",
  sections: [
    {
      heading: "1. From a Working React App to a Shipped Product",
      content: `In the previous lecture you learned to test React applications with Vitest, React Testing Library and MSW. Your app now works and is covered by tests. This final lecture answers the question every learner eventually asks: "How do I actually put this on the internet so that other people can use it?"
A React app that runs on \`localhost:5173\` is not a product. Between "works on my laptop" and "used by real customers" there are several layers that courses often skip:
• **Styling at scale** — a single \`App.css\` file stops working once you have 40 components. You need a styling strategy: CSS Modules, Tailwind CSS v4 or a CSS-in-JS library.
• **Accessibility (a11y)** — roughly one in six people worldwide lives with a significant disability. If your app cannot be used with a keyboard or a screen reader you are excluding real users, and in many countries you are also breaking the law (India's Rights of Persons with Disabilities Act, 2016, the Americans with Disabilities Act in the USA, the European Accessibility Act in the EU).
• **Configuration** — the API URL on your laptop is \`http://localhost:4000\`; in production it is \`https://api.yourcompany.in\`. Environment variables handle that without code changes.
• **Build and deploy** — Vite turns your source into a tiny set of optimized static files, and hosts such as Vercel and Netlify serve them from a global CDN with HTTPS.
• **Resilience** — one component throwing an error must not take down the entire page. Error boundaries contain the damage.
By the end of this lecture you will have deployed a real React 19 application with a public URL, and you will have a complete plan for a capstone project that uses everything from all 27 lectures: components, state, routing, TanStack Query, Zustand, forms with Actions, performance tuning, testing and deployment.
**Prerequisites:** a Vite + React 19 project (Lecture 2), React Router v7 basics, and a free GitHub account.`
    },
    {
      heading: "2. Styling Option 1: CSS Modules in Vite",
      content: `Plain CSS has one big problem in a component-based app: **every class name is global**. If \`ProductCard.css\` and \`UserCard.css\` both define \`.title\`, the one loaded last wins and you get a bug that is very hard to trace.
**CSS Modules** fix this with zero extra libraries. Any file named \`*.module.css\` is treated specially by Vite: every class name inside it is rewritten to a unique, hashed name at build time, and the file exports a JavaScript object that maps your original names to the generated ones.
Why teams like CSS Modules:
• **Nothing new to learn** — it is ordinary CSS (plus Sass or PostCSS if you want them). Media queries, pseudo-classes, animations and CSS variables all work as usual.
• **Zero runtime cost** — the mapping is resolved at build time; the browser just receives a normal stylesheet.
• **Built into Vite** — no plugin, no configuration. Vite also supports \`.module.scss\` once you install \`sass\`.
• **Works with React Server Components** — important when you move to Next.js later, because CSS Modules do not need JavaScript to run.
Rules to remember:
• Class names are local by default. To style a global element from inside a module use \`:global(.some-class)\`.
• Use camelCase names (\`.primaryButton\`) so you can write \`styles.primaryButton\` instead of \`styles["primary-button"]\`.
• \`composes\` lets one class inherit from another, which keeps stylesheets DRY without a preprocessor.
• For conditional classes, join an array or use the tiny \`clsx\` package. Avoid string concatenation with stray spaces.
In the example below, the rendered HTML will contain something like \`class="_button_1k3f9_1 _primary_1k3f9_9"\`. The hash is derived from the file path, so the same component always produces the same class across builds, which keeps long-term caching effective.`,
      codeSnippet: `/* src/components/Button.module.css */
.button {
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  border: 1px solid transparent;
  font: inherit;
  cursor: pointer;
}
.button:focus-visible {
  outline: 3px solid #f97316;   /* visible keyboard focus ring */
  outline-offset: 2px;
}
.primary {
  composes: button;             /* inherit everything from .button */
  background: #1e3a8a;
  color: #ffffff;
}
.secondary {
  composes: button;
  background: #ffffff;
  color: #1e3a8a;
  border-color: #1e3a8a;
}
.button:disabled { opacity: 0.5; cursor: not-allowed; }

// src/components/Button.jsx
import styles from "./Button.module.css";

export default function Button({ variant = "primary", className = "", children, ...props }) {
  const classes = [styles[variant], className].filter(Boolean).join(" ");
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

// src/App.jsx
import Button from "./components/Button";

export default function App() {
  return (
    <main>
      <Button onClick={() => alert("Paid ₹499")}>Pay ₹499</Button>
      <Button variant="secondary" disabled>Cancel</Button>
    </main>
  );
}
// Rendered: <button class="_primary_1k3f9_9 _button_1k3f9_1">Pay ₹499</button>`
    },
    {
      heading: "3. Styling Option 2: Tailwind CSS v4 with Vite",
      content: `**Tailwind CSS** takes the opposite approach: instead of writing CSS files, you compose small single-purpose utility classes directly in JSX — \`flex\`, \`p-4\`, \`text-lg\`, \`bg-blue-900\`. At first it looks noisy, but it removes two hard problems: naming things and keeping unused CSS out of production.
**Tailwind v4 changed the setup significantly** compared to v3, and most online tutorials are still showing the old way. The v4 way with Vite is:
1. Install two packages: \`tailwindcss\` and \`@tailwindcss/vite\`.
2. Add the \`tailwindcss()\` plugin to \`vite.config.js\`.
3. Put a single line in your main CSS file: \`@import "tailwindcss";\` (the old \`@tailwind base; @tailwind components; @tailwind utilities;\` directives are gone).
4. There is **no \`tailwind.config.js\`** by default. Design tokens are declared in CSS with the \`@theme\` block, and Tailwind v4 automatically scans your source files for class names, so you no longer maintain a \`content\` array.
5. No PostCSS or autoprefixer setup is needed for a Vite project — the Vite plugin handles it.
Important facts about v4:
• It is built on modern CSS (cascade layers, \`@property\`, \`color-mix()\`), so it targets modern browsers only — roughly Safari 16.4+, Chrome 111+ and Firefox 128+. For very old corporate browsers, stay on v3.
• Every utility you use becomes exactly one CSS rule; a typical production stylesheet is under 10 kB compressed regardless of app size.
• Responsive and state variants are prefixes: \`md:grid-cols-3\`, \`hover:bg-blue-800\`, \`focus-visible:ring-2\`, \`dark:bg-slate-900\`.
• When a component accepts a \`className\` prop, merge classes with \`tailwind-merge\` (so \`p-4\` passed by the parent correctly overrides your default \`p-2\`).
Use \`@apply\` only for genuinely repeated patterns such as a base button; if you find yourself writing dozens of \`@apply\` rules, you probably wanted CSS Modules instead.`,
      codeSnippet: `// Terminal
// npm install tailwindcss @tailwindcss/vite

// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});

/* src/index.css — the ONLY Tailwind setup you need in v4 */
@import "tailwindcss";

@theme {
  /* custom design tokens become utilities: bg-brand, text-accent, font-heading */
  --color-brand: #1e3a8a;
  --color-accent: #f97316;
  --font-heading: "Poppins", sans-serif;
}

// src/components/PlanCard.jsx
export default function PlanCard({ name, price, features, popular = false }) {
  return (
    <article
      className={
        "rounded-2xl border p-6 shadow-sm transition hover:shadow-md " +
        (popular ? "border-accent bg-orange-50" : "border-slate-200 bg-white")
      }
    >
      <h3 className="font-heading text-xl font-semibold text-brand">{name}</h3>
      <p className="mt-2 text-3xl font-bold">
        ₹{price}
        <span className="text-base font-normal text-slate-600">/month</span>
      </p>
      <ul className="mt-4 space-y-2 text-sm text-slate-700">
        {features.map((f) => (
          <li key={f} className="flex gap-2">
            <span aria-hidden="true">✓</span>
            {f}
          </li>
        ))}
      </ul>
      <button className="mt-6 w-full rounded-lg bg-brand px-4 py-2 text-white hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
        Choose {name}
      </button>
    </article>
  );
}`
    },
    {
      heading: "4. Styling Option 3: CSS-in-JS and the Trade-offs",
      content: `**CSS-in-JS** libraries such as **styled-components** and **Emotion** let you write CSS inside JavaScript, usually as tagged template literals, and generate class names at runtime. They became popular because styles live next to the component, props can drive styles directly (\`color: \${(p) => p.active ? "red" : "grey"}\`), and theming is just a React context.
The trade-offs are real, and they matter more in 2026 than they did in 2019:
• **Runtime cost** — styles are computed and injected into a \`<style>\` tag while the app runs. Each render of a styled component does work that CSS Modules or Tailwind do at build time. On low-end Android phones, which dominate the Indian market, this is measurable.
• **Bundle size** — the library itself is typically 10–15 kB gzipped before you write any styles.
• **React Server Components** — runtime CSS-in-JS needs client-side JavaScript, so it cannot be used inside Server Components in Next.js. Every styled component must be a Client Component.
• **Maintenance status** — the styled-components maintainers have publicly moved the project into maintenance mode and recommend that new projects look at other options. Emotion is still maintained, but the ecosystem has moved on.
• **Debugging** — generated class names like \`sc-bdfBwQ\` are harder to find in DevTools than \`_primary_1k3f9_9\` or \`bg-brand\`.
If you want styles-as-code without the runtime, the modern answer is a **zero-runtime** library: **vanilla-extract** (typed CSS in \`.css.ts\` files, extracted at build), **Panda CSS** or **StyleX** (Meta's library used in facebook.com). They keep co-location and type safety but output plain static CSS.
**How to choose for a Vite + React project:**
• Most teams, most apps: **CSS Modules**. Plain CSS, zero runtime, nothing to learn, moves to Next.js unchanged.
• Fast-moving product teams, design-system consistency, lots of responsive variants: **Tailwind CSS v4**.
• Component libraries that need typed tokens and dynamic variants: **vanilla-extract** or **StyleX**.
• Legacy code already on styled-components: keep it, but do not start new apps on it.
Whichever you choose, keep one rule: **one styling approach per project**. Mixing Tailwind, CSS Modules and styled-components in the same codebase is the most common cause of "which rule is winning?" bugs.`,
      codeSnippet: `// The same badge written three ways — pick ONE approach per project

// 1) styled-components (runtime CSS-in-JS)
import styled from "styled-components";
const Badge = styled.span\`
  padding: 2px 8px;
  border-radius: 999px;
  background: \${(p) => (p.$status === "paid" ? "#dcfce7" : "#fee2e2")};
  color: \${(p) => (p.$status === "paid" ? "#166534" : "#991b1b")};
\`;
// <Badge $status="paid">Paid</Badge>

// 2) CSS Modules (static CSS, class chosen in JS)
// Badge.module.css: .badge {...} .paid {...} .due {...}
import styles from "./Badge.module.css";
export function BadgeCM({ status, children }) {
  return <span className={\`\${styles.badge} \${styles[status]}\`}>{children}</span>;
}

// 3) Tailwind v4 (utilities, merged safely with tailwind-merge + clsx)
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
const cn = (...args) => twMerge(clsx(args));
export function BadgeTW({ status, className, children }) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-xs font-medium",
        status === "paid" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800",
        className
      )}
    >
      {children}
    </span>
  );
}`
    },
    {
      heading: "5. Accessibility Essentials: Semantic HTML and ARIA in React",
      content: `**Accessibility** means people who use screen readers (NVDA, JAWS, VoiceOver, TalkBack), keyboard-only navigation, screen magnifiers or voice control can complete every task in your app. It is not a "nice to have" that you add at the end; it is a quality attribute like performance, and it is far cheaper to build in than to retrofit.
The good news: **React does not make accessibility harder, but it makes it easy to forget**, because JSX lets you build everything out of \`<div>\` and \`onClick\`. The single most effective habit is to **use the correct native HTML element**:
• A clickable thing is a \`<button>\`, not a \`<div onClick>\`. A button is focusable, announces itself as a button, and triggers on Enter and Space for free. A div does none of that.
• Navigation goes in \`<nav>\`, the main content in exactly one \`<main>\`, page sections in \`<section>\` with a heading, self-contained items in \`<article>\`.
• Headings must form an outline: one \`<h1>\`, then \`<h2>\`, then \`<h3>\` — never skip levels to get a smaller font. Use CSS for size.
• Every form control needs a \`<label>\`. In JSX the attribute is \`htmlFor\` (because \`for\` is a reserved word), and \`class\` is \`className\`.
• Images need \`alt\`. Decorative images get \`alt=""\` so screen readers skip them.
**ARIA** (Accessible Rich Internet Applications) is a set of attributes that add semantics when HTML has none. The first rule of ARIA, straight from the W3C: **if a native element already gives you the semantics, do not use ARIA**. Use ARIA for the gaps:
• \`aria-label="Close"\` on an icon-only button so it is not announced as just "button".
• \`aria-describedby\` to link a field to its hint or error text, and \`aria-invalid="true"\` when validation fails.
• \`aria-expanded\` and \`aria-controls\` on a button that toggles a menu or accordion.
• \`aria-live="polite"\` (or \`role="alert"\` for urgent messages) on a region whose text changes, such as "3 items added to cart" or "Payment failed", so screen readers announce the update.
• \`aria-hidden="true"\` on purely decorative icons.
In JSX, \`aria-*\` and \`data-*\` attributes keep their hyphenated names. Install **\`eslint-plugin-jsx-a11y\`** and most of these mistakes will be flagged while you type.`,
      codeSnippet: `// src/components/SignupForm.jsx — semantic HTML + ARIA where needed
import { useState } from "react";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!/^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(email)) {
      setError("Enter a valid email such as priya@example.com");
      return;
    }
    setError("");
    setStatus("Thanks! Check your inbox to confirm.");   // announced by aria-live
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-labelledby="signup-title">
      <h2 id="signup-title">Get weekly React tips</h2>

      <label htmlFor="email">Email address</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-describedby={error ? "email-hint email-error" : "email-hint"}
        aria-invalid={error ? "true" : undefined}
        autoComplete="email"
        required
      />
      <p id="email-hint">We send one email per week. No spam.</p>
      {error && (
        <p id="email-error" role="alert">
          {error}
        </p>
      )}

      {/* icon-only button: give it an accessible name */}
      <button type="submit" aria-label="Subscribe">
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20">
          <path d="M2 10h14M10 4l6 6-6 6" stroke="currentColor" fill="none" strokeWidth="2" />
        </svg>
      </button>

      {/* polite live region: text changes are announced without stealing focus */}
      <p aria-live="polite">{status}</p>
    </form>
  );
}`
    },
    {
      heading: "6. Keyboard Focus, Color Contrast and Accessibility Testing",
      content: `**Keyboard navigation** is the fastest accessibility test you can run: unplug your mouse and try to use your app. Every interactive element must be reachable with Tab, activated with Enter or Space, and dialogs must close with Escape. Three rules cover most problems:
1. **Never remove focus outlines without replacing them.** \`outline: none\` with no alternative is the most common accessibility bug on the web. Style \`:focus-visible\` instead — it shows a ring for keyboard users only, not for mouse clicks.
2. **Manage focus when the UI changes.** When a modal opens, focus must move inside it and stay there (focus trap); when it closes, focus must return to the button that opened it. When a route changes in a single-page app, nothing moves focus automatically — move it to the new page's heading, or screen-reader users will not know the page changed. The native \`<dialog>\` element with \`showModal()\` gives you the focus trap and the Escape key for free, which is why it is now the recommended base for React modals.
3. **Provide a skip link.** A visually hidden "Skip to main content" link as the first focusable element lets keyboard users jump past the navigation.
**Color contrast** is measured as a ratio between text and background. The WCAG 2.2 Level AA requirements, which most laws reference, are:
• **4.5:1** for normal text.
• **3:1** for large text (at least 24 px, or 18.66 px bold) and for UI component boundaries and icons.
As a practical reference: Tailwind's \`gray-500\` (\`#6b7280\`) on white is roughly 4.8:1 and passes; \`gray-400\` (\`#9ca3af\`) on white is roughly 2.5:1 and fails for text. Light-grey placeholder text and orange-on-white buttons are the usual offenders. Also never rely on color alone: a red border on an invalid field must be paired with an icon or text, because about 8% of men have some form of color-vision deficiency.
Respect \`prefers-reduced-motion\`: wrap large animations in a media query so users who get motion sickness can turn them off.
**Testing tools, from cheapest to most thorough:**
• \`eslint-plugin-jsx-a11y\` — catches missing \`alt\`, labels and bad ARIA at lint time.
• **axe DevTools** browser extension and the **Lighthouse** accessibility audit in Chrome DevTools — run on every major page; aim for an accessibility score of 100.
• **vitest-axe** — runs the axe engine inside your Vitest component tests so regressions fail CI.
• A real screen reader: NVDA is free on Windows, VoiceOver is built into macOS and iOS, TalkBack into Android. Ten minutes with one teaches you more than any article.
Automated tools catch only around 30–40% of accessibility issues; the keyboard walkthrough and screen-reader check find the rest.`,
      codeSnippet: `// src/components/ConfirmDialog.jsx — native <dialog>: focus trap + Esc for free
import { useEffect, useRef } from "react";

export default function ConfirmDialog({ open, title, onConfirm, onClose, children }) {
  const dialogRef = useRef(null);
  const openerRef = useRef(null);         // element that had focus before opening

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      openerRef.current = document.activeElement;
      dialog.showModal();                 // moves focus inside, traps it, enables Esc
    } else if (!open && dialog.open) {
      dialog.close();
      openerRef.current?.focus();         // return focus to the trigger button
    }
  }, [open]);

  return (
    <dialog ref={dialogRef} onClose={onClose} aria-labelledby="dlg-title">
      <h2 id="dlg-title">{title}</h2>
      <div>{children}</div>
      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <button onClick={onClose}>Cancel</button>
        <button onClick={onConfirm} autoFocus>Confirm</button>
      </div>
    </dialog>
  );
}

/* src/index.css — focus ring, skip link, reduced motion */
:focus-visible { outline: 3px solid #f97316; outline-offset: 2px; }

.skip-link {
  position: absolute; left: -999px; top: 8px;
  background: #1e3a8a; color: #fff; padding: 8px 12px; border-radius: 6px;
}
.skip-link:focus { left: 8px; }            /* becomes visible only when focused */

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
}

// src/App.jsx (excerpt)
// <a href="#main" className="skip-link">Skip to main content</a>
// <main id="main" tabIndex={-1}>...</main>`
    },
    {
      heading: "7. Environment Variables in Vite: The VITE_ Prefix",
      content: `Your app needs values that differ between your laptop, the staging server and production: the API base URL, a public analytics key, a feature flag. Hard-coding them means editing code before every deploy. **Environment variables** solve this.
Vite reads \`.env\` files from the project root and exposes them on \`import.meta.env\`. The crucial rule: **only variables whose names start with \`VITE_\` are exposed to your browser code.** \`VITE_API_URL\` is available; \`DATABASE_PASSWORD\` is not — and that is a safety feature, because anything on \`import.meta.env\` ends up in the JavaScript bundle that every visitor can read in DevTools. (You can change the prefix with the \`envPrefix\` option, but the default is a sensible guard.)
Vite loads these files, with later ones overriding earlier ones:
• \`.env\` — loaded in every mode. Commit it with safe defaults.
• \`.env.local\` — loaded in every mode, ignored by git (the Vite template's \`.gitignore\` excludes \`*.local\`). Your personal overrides.
• \`.env.development\` / \`.env.production\` — loaded only in that mode. \`vite\` (dev server) uses \`development\`; \`vite build\` uses \`production\`.
• \`.env.development.local\` / \`.env.production.local\` — mode-specific and git-ignored.
Vite also provides built-in values: \`import.meta.env.MODE\` (\`"development"\` or \`"production"\`), \`import.meta.env.DEV\` and \`import.meta.env.PROD\` (booleans), and \`import.meta.env.BASE_URL\`.
Two facts trip up almost everyone:
1. **Values are replaced at build time, not read at runtime.** \`vite build\` literally substitutes the string \`"https://api.example.in"\` wherever \`import.meta.env.VITE_API_URL\` appears. Changing the variable on the server later does nothing until you rebuild. On Vercel or Netlify you set the variable in the dashboard and trigger a new build.
2. **Everything is a string.** \`VITE_ENABLE_BETA=false\` gives you the string \`"false"\`, which is truthy. Parse it explicitly.
A clean pattern is a single \`src/config.js\` that reads, validates and converts every variable once, so the rest of the app imports typed values and a missing variable fails loudly at startup instead of producing a mysterious \`undefined/api/orders\` request.
Never put secrets (payment keys, database URLs, private API tokens) in a \`VITE_\` variable. Secrets belong on a server — which is one reason you will want a backend or a framework such as Next.js for real products.`,
      codeSnippet: `# .env  (committed — safe defaults for everyone)
VITE_APP_NAME=PaisaTrack
VITE_API_URL=http://localhost:4000
VITE_ENABLE_BETA=false

# .env.production  (committed — used by "vite build")
VITE_API_URL=https://api.paisatrack.in

# .env.local  (NOT committed — your personal overrides)
VITE_API_URL=http://192.168.1.7:4000

// src/config.js — read and validate once, import everywhere
function requireEnv(name) {
  const value = import.meta.env[name];
  if (value === undefined || value === "") {
    throw new Error("Missing environment variable: " + name);
  }
  return value;
}

export const config = {
  appName: requireEnv("VITE_APP_NAME"),
  apiUrl: requireEnv("VITE_API_URL").replace(/\\/$/, ""),   // strip trailing slash
  enableBeta: import.meta.env.VITE_ENABLE_BETA === "true",   // strings -> boolean
  isDev: import.meta.env.DEV,
};

// src/api/client.js
import { config } from "../config";

export async function getExpenses() {
  const res = await fetch(config.apiUrl + "/expenses");
  if (!res.ok) throw new Error("Failed to load expenses: " + res.status);
  return res.json();
}
// In dev:   GET http://localhost:4000/expenses
// In build: GET https://api.paisatrack.in/expenses`
    },
    {
      heading: "8. Production Build and Preview with Vite",
      content: `During development Vite serves your source files unbundled and transforms them on demand, which is why the dev server starts in under a second. For production it does something very different: \`vite build\` runs **Rollup** to bundle, tree-shake and minify everything into the \`dist/\` folder.
What you get in \`dist/\`:
• \`index.html\` — your HTML with the script and stylesheet tags rewritten to the built files.
• \`assets/index-BxH2k3Qp.js\` — your application code and its dependencies, minified. The random-looking part is a **content hash**: it changes only when the file's content changes, so the CDN can cache it for a year and a new deploy automatically invalidates it.
• \`assets/index-D4fR8s.css\` — all CSS (CSS Modules, Tailwind, imported stylesheets) extracted and minified.
• One extra JS chunk for every \`lazy()\` import (Lecture 23), so route code loads only when visited.
• Anything in \`public/\` copied as-is (favicon, \`robots.txt\`, \`_redirects\`).
A typical fresh React 19 app builds to about 60 kB of gzipped JavaScript; a mid-size app with React Router v7 and TanStack Query lands around 100–150 kB. Vite prints every file with its size and gzipped size, and warns when a chunk exceeds 500 kB — treat that warning as a signal to split code.
**Always run \`vite preview\` before deploying.** It serves the real \`dist/\` folder on \`http://localhost:4173\` so you can check that environment variables resolved, lazy chunks load and nothing depended on dev-only behaviour. Run Lighthouse against the preview, not the dev server, because dev builds are deliberately unoptimized.
Useful build options in \`vite.config.js\`:
• \`base\` — set to \`"/myapp/"\` when the site lives under a sub-path (GitHub Pages project sites).
• \`build.sourcemap: true\` — ship source maps if you use an error-monitoring service such as Sentry; otherwise leave them off.
• \`build.rollupOptions.output.manualChunks\` — split big vendor libraries into their own long-cached chunk.
• **rollup-plugin-visualizer** — generates an interactive treemap of what is inside your bundle; the fastest way to discover that a date library is costing you 70 kB.
Add a \`lint\`, \`test\` and \`build\` script to \`package.json\` and run all three before every deploy — later you will automate this in CI.`,
      codeSnippet: `// package.json (scripts)
// "scripts": {
//   "dev": "vite",
//   "build": "vite build",
//   "preview": "vite preview",
//   "lint": "eslint .",
//   "test": "vitest run"
// }

// vite.config.js — production tuning
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";   // npm i -D rollup-plugin-visualizer

export default defineConfig({
  plugins: [
    react(),
    visualizer({ filename: "dist/stats.html", gzipSize: true }),  // open after build
  ],
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],              // rarely changes -> cached longer
          query: ["@tanstack/react-query"],
        },
      },
    },
  },
});

// Terminal
// $ npm run build
// vite v7.x building for production...
// ✓ 142 modules transformed.
// dist/index.html                    0.46 kB │ gzip:  0.30 kB
// dist/assets/index-D4fR8s2k.css     9.12 kB │ gzip:  2.71 kB
// dist/assets/react-C0mP1L3d.js    185.40 kB │ gzip: 58.92 kB
// dist/assets/query-Qu3rY9x.js      38.11 kB │ gzip: 11.80 kB
// dist/assets/index-BxH2k3Qp.js     41.77 kB │ gzip: 13.05 kB
// ✓ built in 2.84s
//
// $ npm run preview
// ➜  Local:   http://localhost:4173/`
    },
    {
      heading: "9. Deploying a React App to Vercel and Netlify",
      content: `A Vite React app builds to static files, so it can be hosted anywhere that serves HTML — but **Vercel** and **Netlify** make the whole workflow automatic, and both have free tiers that are more than enough for portfolios and side projects.
The workflow is the same on both platforms, and it is called **Git-based deployment**:
1. Push your project to a GitHub (or GitLab/Bitbucket) repository. Make sure \`node_modules\` and \`dist\` are in \`.gitignore\` — the host builds from source.
2. Sign in to Vercel or Netlify with GitHub and click "Import project" / "Add new site".
3. The platform detects Vite and pre-fills the settings: build command \`npm run build\`, output directory \`dist\`. Confirm them.
4. Add your environment variables (\`VITE_API_URL\` and friends) in the dashboard. Remember they are baked in at build time, so changing one requires a redeploy.
5. Click Deploy. Within a minute you get a URL such as \`paisatrack.vercel.app\` or \`paisatrack.netlify.app\` with HTTPS already configured.
From then on, **every push to \`main\` triggers a production deploy**, and every pull request gets its own **preview deployment** with a unique URL that you can share with a reviewer or client before merging. This preview-per-PR workflow is one of the biggest productivity wins of modern front-end development.
Both hosts also offer a CLI (\`npm i -g vercel\` then \`vercel\`; \`npm i -g netlify-cli\` then \`netlify deploy --prod\`) for deploying from your terminal without Git, and both let you attach a custom domain (buy one from any registrar, point its DNS at the host, HTTPS is issued automatically).
Configuration lives in a file at the project root so it is versioned with the code: \`vercel.json\` for Vercel, \`netlify.toml\` for Netlify. Two things belong there for every React SPA:
• The **SPA fallback rewrite** (next section) so deep links work.
• **Cache headers** telling the CDN that hashed files in \`/assets/\` are immutable and can be cached for a year, while \`index.html\` must always be revalidated.
Alternatives worth knowing: **Cloudflare Pages** (very generous free tier, fast in India), **GitHub Pages** (free, but no server-side rewrites, so SPA routing needs a workaround), **Firebase Hosting**, and a plain **S3 + CloudFront** bucket for enterprise setups. If your team needs the app to run on its own servers, copy \`dist/\` to any Nginx or Apache box.`,
      codeSnippet: `// vercel.json  (project root)
{
  "rewrites": [
    { "source": "/((?!api/).*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/index.html",
      "headers": [{ "key": "Cache-Control", "value": "no-cache" }]
    }
  ]
}

# netlify.toml  (project root)
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

# Terminal — one-off deploy from the CLI
# $ npm run build
# $ npx vercel --prod          # or: npx netlify deploy --prod --dir=dist`
    },
    {
      heading: "10. SPA Fallback Routing: Why Refresh Gives a 404 and How to Fix It",
      content: `This is the number one post-deployment bug for React apps, and understanding it will save you hours.
Your app uses React Router v7. In the browser you click "Reports" and the URL becomes \`/dashboard/reports\`. React Router changed the URL with the History API and rendered the route — **no request was sent to the server**. Now the user presses F5, or opens that URL from a WhatsApp message. The browser sends a real HTTP request for \`/dashboard/reports\` to the host. The host looks in \`dist/\` for a folder named \`dashboard/reports/index.html\`, finds nothing, and returns **404 Not Found**. Your React code never even loads.
Why did it work locally? Because the Vite dev server and \`vite preview\` are configured as SPA servers: for any path that does not match a file, they return \`index.html\`. Production hosts are generic file servers and do not know your app's routes.
The fix is called the **SPA fallback** (or catch-all rewrite): tell the server "for any path that is not a real file, serve \`index.html\` with status 200". React Router then boots, reads the URL and renders the right route.
How to configure it on common hosts:
• **Vercel** — the \`rewrites\` entry in \`vercel.json\` from the previous section. The pattern \`/((?!api/).*)\` excludes \`/api/*\` so serverless functions still work.
• **Netlify** — either the \`[[redirects]]\` block in \`netlify.toml\` or a file \`public/_redirects\` containing one line: \`/*    /index.html   200\`. Vite copies \`public/\` into \`dist/\` so it ships automatically.
• **Nginx** — \`try_files $uri $uri/ /index.html;\` inside the \`location /\` block.
• **Apache** — an \`.htaccess\` with \`RewriteRule\` to \`index.html\`.
• **GitHub Pages** — no rewrites are possible. Either copy \`index.html\` to \`404.html\` after the build (GitHub serves it for unknown paths, with a 404 status that search engines will notice), or use \`HashRouter\` so routes live after \`#\` and never reach the server.
Two related gotchas:
1. **Sub-path deployment.** If the app is served from \`https://example.in/app/\`, set \`base: "/app/"\` in \`vite.config.js\` so asset URLs are correct, and pass \`basename="/app"\` to \`BrowserRouter\` so React Router matches routes correctly.
2. **A real 404 page.** Because the server now answers 200 for every path, your router must own the "not found" experience: add a catch-all \`path="*"\` route that renders a helpful Not Found component with a link home.`,
      codeSnippet: `# public/_redirects  (Netlify) — copied into dist/ by Vite
/*    /index.html   200

# nginx.conf (self-hosted)
server {
  listen 80;
  root /var/www/paisatrack/dist;
  index index.html;

  location /assets/ {
    add_header Cache-Control "public, max-age=31536000, immutable";
  }

  location / {
    try_files $uri $uri/ /index.html;    # SPA fallback
  }
}

// src/main.jsx — basename when deployed under a sub-path, plus a real 404 route
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router";
import App from "./App";
import Reports from "./pages/Reports";

function NotFound() {
  return (
    <main>
      <h1>Page not found</h1>
      <p>The page you asked for does not exist.</p>
      <Link to="/">Go to dashboard</Link>
    </main>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/dashboard/reports" element={<Reports />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
// vite.config.js: base: "/app/"  ->  BASE_URL === "/app/"  ->  routes match under /app`
    },
    {
      heading: "11. Error Boundaries in React 19: Containing Crashes",
      content: `By default, **an uncaught error during rendering unmounts the entire React tree**. One \`undefined.name\` inside a small sidebar widget turns the whole page white. In production this is unacceptable, and React's answer is the **error boundary**: a component that catches render errors in its subtree, logs them and shows a fallback UI while the rest of the app keeps working.
Facts you must know, because they are frequently misunderstood:
• An error boundary is still a **class component** in React 19. There is no hook equivalent; a function component cannot catch render errors. You will write exactly one such class in your whole career (or use a library), so do not worry about learning classes in depth.
• It implements \`static getDerivedStateFromError(error)\` (return new state to render the fallback) and optionally \`componentDidCatch(error, info)\` (log it; \`info.componentStack\` tells you which component threw).
• It catches errors thrown during **rendering, in lifecycle methods and in constructors** of any descendant.
• It does **not** catch: errors in event handlers (use try/catch there), errors in asynchronous code such as \`setTimeout\` or a \`fetch\` \`.then\` (they happen outside render), server-side rendering errors, or errors thrown by the boundary itself. Note that TanStack Query can route query errors to the nearest boundary with the \`throwOnError\` option, and the \`use()\` hook throws rejected promises to the boundary too.
• Place boundaries **granularly**: one at the root as a last resort, one per route so a broken page leaves the navigation working, and one around any risky third-party widget (charts, maps, embeds).
In practice most teams use the small **\`react-error-boundary\`** package, which wraps the class and adds what you actually need: a \`FallbackComponent\` that receives \`error\` and \`resetErrorBoundary\`, an \`onReset\` callback, \`resetKeys\` (automatically retry when a value such as the route changes) and \`onError\` for logging. React Router v7 also gives every route an \`errorElement\` (or an \`ErrorBoundary\` export in framework mode) that catches both render errors and loader errors.
**React 19 addition:** \`createRoot\` accepts \`onUncaughtError\` (an error no boundary caught), \`onCaughtError\` (an error a boundary caught) and \`onRecoverableError\`. These are the right place to forward errors to a monitoring service such as Sentry, LogRocket or Datadog, so you learn about crashes before your users tweet about them. In production React also no longer re-throws caught errors to the console, which makes these callbacks the single reporting point.`,
      codeSnippet: `// src/components/ErrorBoundary.jsx — the one class you will write
import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };                              // render the fallback next
  }

  componentDidCatch(error, info) {
    console.error("Caught by boundary:", error, info.componentStack);
  }

  componentDidUpdate(prevProps) {
    // reset automatically when resetKey changes (e.g. the route)
    if (this.state.error && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ error: null });
    }
  }

  render() {
    if (this.state.error) {
      return this.props.fallback({
        error: this.state.error,
        reset: () => this.setState({ error: null }),
      });
    }
    return this.props.children;
  }
}

// src/main.jsx — report everything from one place (React 19)
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root"), {
  onUncaughtError(error, info) {
    // nothing caught it: the page is gone — report with high priority
    reportToMonitoring(error, { fatal: true, stack: info.componentStack });
  },
  onCaughtError(error, info) {
    // a boundary showed a fallback — report, but the app is still usable
    reportToMonitoring(error, { fatal: false, stack: info.componentStack });
  },
}).render(<App />);

function reportToMonitoring(error, extra) {
  if (import.meta.env.PROD) {
    // Sentry.captureException(error, { extra });
  } else {
    console.warn("[monitoring]", error.message, extra);
  }
}

// Usage with the react-error-boundary package (npm i react-error-boundary)
// import { ErrorBoundary } from "react-error-boundary";
// <ErrorBoundary
//   FallbackComponent={({ error, resetErrorBoundary }) => (
//     <div role="alert">
//       <p>Could not load this section: {error.message}</p>
//       <button onClick={resetErrorBoundary}>Try again</button>
//     </div>
//   )}
//   resetKeys={[location.pathname]}
// >
//   <ExpenseChart />
// </ErrorBoundary>`
    },
    {
      heading: "12. How This Is Used in Production: A Release Checklist",
      content: `Here is how a typical product team — say a six-person front-end team at a Bengaluru fintech start-up shipping a merchant dashboard — applies everything in this lecture, so you can see that these are daily practices and not exam topics.
**Styling.** They standardised on CSS Modules plus a small \`tokens.css\` file of CSS variables (colors, spacing, radii) shared with the design team's Figma. New hires are productive on day one because it is just CSS. A separate marketing site uses Tailwind v4 because it is built mostly by one developer who values speed.
**Accessibility gate.** \`eslint-plugin-jsx-a11y\` runs in the editor and in CI. Every component test file includes one \`vitest-axe\` assertion. Before each release, one engineer does a 15-minute keyboard-only and NVDA walkthrough of the three most important flows (login, create invoice, settle payment). Their banking partner's compliance team asks for WCAG 2.2 AA evidence every quarter, so these checks are not optional.
**Environments.** Three sets of variables — \`development\`, \`staging\` and \`production\` — are configured in Vercel. Pull requests build against staging APIs; only \`main\` builds against production. Nobody has ever committed a secret, because the \`VITE_\` prefix makes it obvious that these values are public.
**CI pipeline.** GitHub Actions runs \`npm ci\`, \`npm run lint\`, \`npm test\` and \`npm run build\` on every pull request. If any step fails, the preview deployment is still created but the merge button is blocked. The build step also catches a missing environment variable because \`config.js\` throws.
**Resilience and monitoring.** A root error boundary shows a branded "Something went wrong" page, every route has its own boundary with a retry button, and \`onUncaughtError\`/\`onCaughtError\` forward to Sentry with the component stack. The team's alert rule pages someone if the error rate crosses 1% of sessions.
**Performance budget.** Lighthouse runs against the preview deployment on every PR with targets of Performance ≥ 90 and Accessibility = 100 on a simulated mid-range phone, because the majority of their merchants use ₹10,000–₹15,000 Android devices on 4G.
**Rollback.** Because every deploy is immutable, rolling back is a single click on the previous deployment in the Vercel dashboard — a 30-second recovery that no manual FTP upload could match.
Notice the pattern: every practice is cheap when automated and enforced early, and expensive when discovered by a customer.`,
      codeSnippet: `# .github/workflows/ci.yml — lint, test and build on every pull request
name: CI
on:
  pull_request:
  push:
    branches: [main]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build
        env:
          VITE_APP_NAME: PaisaTrack
          VITE_API_URL: \${{ secrets.STAGING_API_URL }}
      - uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist

# src/App.test.jsx — accessibility assertion in a normal component test
# (npm i -D vitest-axe)
# import { render } from "@testing-library/react";
# import { axe } from "vitest-axe";
# import * as matchers from "vitest-axe/matchers";
# import { expect, it } from "vitest";
# expect.extend(matchers);
#
# it("has no accessibility violations", async () => {
#   const { container } = render(<SignupForm />);
#   expect(await axe(container)).toHaveNoViolations();
# });`
    },
    {
      heading: "13. Capstone Project Plan: PaisaTrack, a Personal Finance Dashboard",
      content: `A course is only as good as what you can build at the end of it. Your capstone is **PaisaTrack**, a personal finance tracker for Indian households: record expenses and income in rupees, categorise them, see monthly summaries and set budgets. It is deliberately scoped so one person can finish it in two to three weeks of evenings, yet it exercises every lecture in the course.
**Core features (must have):**
1. **Transactions list** — add, edit, delete and filter transactions (date, amount in ₹, category, note). Lists and keys, array state, immutable updates (Lectures 7, 10–12).
2. **Add/Edit form** — built with React 19 Actions, \`useActionState\` for pending and error state, \`useFormStatus\` for the submit button, and \`useOptimistic\` so a new entry appears instantly.
3. **Routing** — React Router v7 with pages for Dashboard, Transactions, Budgets, Settings and a 404; lazy-loaded routes; a layout route with the navigation.
4. **Server data** — a mock REST API (json-server or MSW in the browser) consumed through TanStack Query v5: queries with \`staleTime\`, mutations with cache invalidation, loading and error states.
5. **Client state** — a Zustand v5 store for UI preferences (currency format, theme, selected month) with \`localStorage\` persistence; Context (Lecture 18) for the authenticated user.
6. **Dashboard** — monthly totals, top categories and a simple bar chart; expensive aggregations memoised and verified with the Profiler (Lecture 23).
7. **Quality** — Vitest + React Testing Library tests for the form, the list and one TanStack Query hook using MSW (Lecture 26); a \`vitest-axe\` check on each page.
8. **Ship it** — CSS Modules or Tailwind v4 (pick one), full keyboard support, WCAG AA contrast, \`VITE_\` config, error boundaries per route, deployed to Vercel or Netlify with SPA fallback, CI on GitHub Actions.
**Stretch goals:** dark mode with \`prefers-color-scheme\`; CSV export; recurring transactions; \`<Activity>\` to keep the Transactions page's scroll position and filters alive while the user visits Settings; a PWA manifest for "install to home screen".
**Suggested milestones:**
• Days 1–2: Vite project, styling choice, layout, routing skeleton, deploy an empty shell (deploy first, not last — it removes fear).
• Days 3–5: mock API, TanStack Query hooks, transactions list and filters.
• Days 6–8: add/edit form with Actions, optimistic updates, validation and accessible errors.
• Days 9–10: dashboard aggregations, Zustand preferences, budgets.
• Days 11–12: tests, accessibility pass, error boundaries, Lighthouse.
• Day 13: README with screenshots, live URL and a short architecture note. Put it on your resume and LinkedIn.
**Definition of done:** a stranger can open the live URL on a phone, add an expense using only the keyboard, refresh any page without a 404, and the Lighthouse accessibility score is 100.`,
      codeSnippet: `// Suggested folder structure for the PaisaTrack capstone
// paisatrack/
// ├── public/
// │   └── _redirects               # SPA fallback (Netlify)
// ├── src/
// │   ├── api/
// │   │   ├── client.js            # fetch wrapper using config.apiUrl
// │   │   └── transactions.js      # getTransactions, createTransaction, ...
// │   ├── components/
// │   │   ├── ui/                  # Button, Input, Dialog (accessible primitives)
// │   │   ├── TransactionForm.jsx  # Actions + useActionState + useOptimistic
// │   │   ├── TransactionList.jsx
// │   │   └── ErrorBoundary.jsx
// │   ├── features/
// │   │   ├── dashboard/           # aggregations, chart, useMonthlySummary.js
// │   │   └── budgets/
// │   ├── hooks/
// │   │   └── useTransactions.js   # TanStack Query hooks (queries + mutations)
// │   ├── pages/
// │   │   ├── Dashboard.jsx, Transactions.jsx, Budgets.jsx, Settings.jsx, NotFound.jsx
// │   ├── store/
// │   │   └── usePreferences.js    # Zustand v5 + persist middleware
// │   ├── config.js                # validated import.meta.env
// │   ├── router.jsx               # createBrowserRouter + lazy routes + errorElement
// │   ├── main.jsx                 # QueryClientProvider, RouterProvider, root boundary
// │   └── index.css
// ├── tests/setup.js               # RTL + MSW server + vitest-axe matchers
// ├── .env / .env.production
// ├── vercel.json or netlify.toml
// └── .github/workflows/ci.yml

// src/router.jsx — routes with per-route error handling and code splitting
import { lazy } from "react";
import { createBrowserRouter } from "react-router";
import Layout from "./pages/Layout";
import RouteError from "./pages/RouteError";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Transactions = lazy(() => import("./pages/Transactions"));
const Budgets = lazy(() => import("./pages/Budgets"));
const Settings = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <RouteError />,          // render + loader errors for this subtree
    children: [
      { index: true, element: <Dashboard /> },
      { path: "transactions", element: <Transactions /> },
      { path: "budgets", element: <Budgets /> },
      { path: "settings", element: <Settings /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);`
    },
    {
      heading: "14. Common Mistakes and How to Fix Them",
      content: `1. **Mixing three styling systems in one project.** Tailwind utilities, a few \`.module.css\` files and a styled-components theme all fighting for the same button. Fix: choose one approach per project and write it in the README; migrate stragglers in a dedicated PR.
2. **\`outline: none\` on everything.** A CSS reset that removes focus rings makes the app unusable by keyboard. Fix: style \`:focus-visible\` with a 3 px high-contrast ring; never remove an outline without replacing it.
3. **\`<div onClick>\` instead of \`<button>\`.** Not focusable, not announced, does not respond to Enter/Space. Fix: use \`<button type="button">\`; if you must style it like text, reset the button styles in CSS.
4. **Forgetting the \`VITE_\` prefix.** \`API_URL=...\` in \`.env\` and \`import.meta.env.API_URL\` is \`undefined\`, so requests go to \`undefined/orders\`. Fix: prefix with \`VITE_\`, and validate in a \`config.js\` that throws on missing values.
5. **Putting secrets in \`VITE_\` variables.** A Razorpay secret key or a database URL in the bundle is visible to every visitor within seconds. Fix: only public values in the client; secrets live on a server or in serverless functions.
6. **Changing an env variable in the Vercel dashboard and expecting it to apply.** Values are inlined at build time. Fix: trigger a redeploy after changing variables.
7. **Deep links return 404 after deployment.** Works locally, breaks in production on refresh. Fix: add the SPA fallback (\`vercel.json\` rewrites, \`_redirects\`, or Nginx \`try_files\`), and add a \`path="*"\` route for a real Not Found page.
8. **Deploying the dev build or committing \`dist/\`.** Fix: hosts build from source; keep \`dist\` in \`.gitignore\` and let CI run \`npm run build\`.
9. **A single error boundary at the root.** One broken widget still wipes the whole page. Fix: boundaries per route and around risky components, with a reset button and \`resetKeys\`.
10. **Expecting an error boundary to catch an event-handler or fetch error.** It cannot. Fix: try/catch in handlers; for data fetching let TanStack Query surface \`isError\`, or enable \`throwOnError\` to route it to the boundary deliberately.
11. **Testing accessibility only with tools.** A Lighthouse 100 does not mean a screen-reader user can finish checkout. Fix: keyboard walkthrough and a five-minute NVDA or VoiceOver pass on key flows.
12. **Caching \`index.html\` for a year.** Users keep an old HTML that references deleted hashed assets and see a blank page after each deploy. Fix: \`Cache-Control: no-cache\` for \`index.html\`, \`immutable\` only for \`/assets/*\`.`
    },
    {
      heading: "15. Frequently Asked Questions",
      content: `**Should I use Tailwind CSS or CSS Modules for a React project?**
Both are excellent and both have zero runtime cost. Use CSS Modules if your team already knows CSS well, wants to keep JSX clean, or plans to move to Next.js Server Components. Use Tailwind v4 if you want speed, a built-in design scale and easy responsive variants, especially for solo projects and marketing sites. Avoid mixing them in one project.
**Is styled-components still a good choice in 2026?**
For new projects, no. Runtime CSS-in-JS adds bundle size and per-render work, does not work in React Server Components, and the styled-components project itself is in maintenance mode. Existing apps can keep using it; new ones should pick CSS Modules, Tailwind v4, or a zero-runtime library such as vanilla-extract or StyleX.
**How do I set up Tailwind CSS v4 with Vite and React?**
Install \`tailwindcss\` and \`@tailwindcss/vite\`, add \`tailwindcss()\` to the \`plugins\` array in \`vite.config.js\`, and put \`@import "tailwindcss";\` at the top of your CSS file. There is no \`tailwind.config.js\` and no PostCSS setup; custom tokens go in an \`@theme\` block in CSS.
**Why does my React app show a 404 when I refresh the page on Vercel or Netlify?**
Because the server receives a request for a path like \`/dashboard\` and looks for a file with that name, which does not exist in a single-page app. Add an SPA fallback rewrite to \`index.html\` — \`rewrites\` in \`vercel.json\` or a \`public/_redirects\` file with \`/* /index.html 200\` on Netlify.
**How do environment variables work in Vite?**
Create \`.env\` files in the project root. Only variables starting with \`VITE_\` are exposed to the browser via \`import.meta.env.VITE_NAME\`. They are replaced at build time, are always strings, and are visible to users, so never store secrets in them.
**Can I use a hook instead of a class for an error boundary in React 19?**
No. React 19 still requires a class component with \`getDerivedStateFromError\` to catch render errors. In practice, use the \`react-error-boundary\` package or React Router's \`errorElement\` so you rarely write the class yourself.
**Is accessibility legally required for websites in India?**
The Rights of Persons with Disabilities Act, 2016 requires ICT and services to be accessible, and the Guidelines for Indian Government Websites mandate WCAG conformance for government sites. Private companies that serve banks, insurers, education or government clients are routinely asked to demonstrate WCAG 2.2 AA compliance, and global laws such as the ADA and the European Accessibility Act apply the moment you have users there.
**What is the difference between \`vite build\` and \`vite preview\`?**
\`vite build\` compiles and optimises your source into the \`dist/\` folder. \`vite preview\` starts a local static server (port 4173) that serves that \`dist/\` folder exactly as a host would, so you can verify the production build before deploying. Preview is not meant for production hosting.`
    },
    {
      heading: "16. Interview Questions and Answers",
      content: `**Q1: What problem do CSS Modules solve and how do they work in Vite?**
They solve global class-name collisions. Any \`*.module.css\` file is compiled so that each class gets a unique hashed name, and the import gives you an object mapping original names to generated ones (\`styles.primary\`). This happens at build time, so there is no runtime cost.
**Q2: What are the main drawbacks of runtime CSS-in-JS libraries?**
Extra JavaScript on every render to compute and inject styles, 10–15 kB of library code, incompatibility with React Server Components, harder debugging of generated class names, and, for styled-components specifically, maintenance-mode status. Zero-runtime alternatives (vanilla-extract, StyleX, Panda) keep the authoring benefits without the cost.
**Q3: What changed between Tailwind CSS v3 and v4 for a Vite project?**
v4 uses a dedicated \`@tailwindcss/vite\` plugin instead of PostCSS, a single \`@import "tailwindcss";\` instead of three \`@tailwind\` directives, CSS-based configuration via \`@theme\` instead of \`tailwind.config.js\`, and automatic content detection instead of a manual \`content\` array. It also requires modern browsers.
**Q4: What is the first rule of ARIA?**
"No ARIA is better than bad ARIA." If a native HTML element (\`<button>\`, \`<nav>\`, \`<dialog>\`) already provides the semantics and behaviour, use it instead of adding roles and attributes to generic elements. ARIA only changes what assistive technology is told; it does not add keyboard behaviour.
**Q5: How would you make a modal dialog accessible in React?**
Use the native \`<dialog>\` element opened with \`showModal()\`, which traps focus, closes on Escape and marks the rest of the page inert. Give it an accessible name with \`aria-labelledby\`, move focus to a sensible element inside, and return focus to the opener when it closes. Verify with keyboard only and a screen reader.
**Q6: What are the WCAG AA color contrast requirements?**
At least 4.5:1 for normal text and 3:1 for large text (24 px, or 18.66 px bold) and for meaningful UI elements such as input borders and icons. Also never convey information by color alone.
**Q7: Why must only \`VITE_\`-prefixed variables be exposed, and when are they resolved?**
Everything exposed to client code ends up in the public bundle. The prefix forces developers to consciously mark a value as public, preventing accidental leakage of server secrets. Values are statically replaced during \`vite build\`, so changing them requires a rebuild, not a restart.
**Q8: Explain why a React SPA returns 404 on page refresh in production and how to fix it.**
Client-side routing changes the URL without a server request. On refresh the browser requests that path from the server, which has no matching file. The fix is a catch-all rewrite that serves \`index.html\` with status 200 for unknown paths, configured per host (Vercel rewrites, Netlify \`_redirects\`, Nginx \`try_files\`).
**Q9: What errors does an error boundary not catch?**
Errors in event handlers, asynchronous callbacks (\`setTimeout\`, promise \`.then\`), server-side rendering, and errors thrown inside the boundary itself. Those need try/catch or a data-layer error state; TanStack Query's \`throwOnError\` can deliberately forward fetch errors to a boundary.
**Q10: What do \`onUncaughtError\` and \`onCaughtError\` in React 19's \`createRoot\` do?**
They are root-level hooks for error reporting. \`onCaughtError\` fires when an error boundary catches an error (the app is still usable); \`onUncaughtError\` fires when nothing caught it (the tree was unmounted). Teams use them to send errors with the component stack to monitoring tools such as Sentry.`
    },
    {
      heading: "17. Practical Hands-On Exercise: A Production-Ready App Shell",
      content: `Build the shell every real React app needs, then deploy it. The exercise combines an accessible layout, CSS Modules, validated environment variables, an error boundary with reset, and host configuration for SPA routing.
**Steps:**
1. Create a project: \`npm create vite@latest app-shell -- --template react\`, then \`cd app-shell && npm install\`.
2. Create the files below exactly as shown (\`.env\`, \`src/config.js\`, \`src/components/ErrorBoundary.jsx\`, \`src/App.module.css\`, \`src/App.jsx\`, \`src/main.jsx\`, \`public/_redirects\`, \`vercel.json\`).
3. Run \`npm run dev\`. Press Tab from the address bar: the skip link should appear first, then the navigation, then the buttons. Open the dialog with the keyboard, press Escape, and confirm focus returns to the button.
4. Click "Crash this widget". Only the widget should be replaced by the fallback; the header and the rest of the page must keep working. Click "Try again" to recover.
5. Run \`npm run build && npm run preview\`, open \`http://localhost:4173/reports\` directly and confirm it renders (preview supports SPA fallback).
6. Push to GitHub, import into Vercel or Netlify, set \`VITE_APP_NAME\` and \`VITE_API_URL\` in the dashboard, deploy, and open \`/reports\` on the live URL — it must not 404.
7. Run Lighthouse on the live URL; fix anything below 100 on Accessibility.
**Expected behaviour:** the header shows the app name from the environment variable, the environment badge reads "production" on the deployed site and "development" locally, and the crash button never takes down the page.`,
      codeSnippet: `# .env
VITE_APP_NAME=App Shell
VITE_API_URL=http://localhost:4000

# public/_redirects   (Netlify SPA fallback)
/*    /index.html   200

// vercel.json   (Vercel SPA fallback)
// { "rewrites": [{ "source": "/((?!api/).*)", "destination": "/index.html" }] }

// src/config.js
function requireEnv(name) {
  const v = import.meta.env[name];
  if (!v) throw new Error("Missing environment variable: " + name);
  return v;
}
export const config = {
  appName: requireEnv("VITE_APP_NAME"),
  apiUrl: requireEnv("VITE_API_URL"),
  mode: import.meta.env.MODE,
};

// src/components/ErrorBoundary.jsx
import { Component } from "react";
export default class ErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { console.error(error, info.componentStack); }
  render() {
    if (this.state.error) {
      return (
        <div role="alert" className={this.props.className}>
          <p><strong>This section failed:</strong> {this.state.error.message}</p>
          <button onClick={() => this.setState({ error: null })}>Try again</button>
        </div>
      );
    }
    return this.props.children;
  }
}

/* src/App.module.css */
.skipLink { position: absolute; left: -999px; top: 8px; background: #1e3a8a; color: #fff; padding: 8px 12px; border-radius: 6px; }
.skipLink:focus { left: 8px; }
.header { display: flex; align-items: center; gap: 16px; padding: 12px 16px; background: #1e3a8a; color: #fff; }
.header a { color: #fff; }
.badge { margin-left: auto; padding: 2px 8px; border-radius: 999px; background: #f97316; color: #1a1a1a; font-size: 12px; }
.main { max-width: 720px; margin: 24px auto; padding: 0 16px; }
.widget { border: 1px solid #cbd5e1; border-radius: 12px; padding: 16px; margin-top: 16px; }
.fallback { border: 1px solid #991b1b; background: #fee2e2; color: #7f1d1d; border-radius: 12px; padding: 16px; margin-top: 16px; }
.button { padding: 8px 14px; border-radius: 8px; border: 1px solid #1e3a8a; background: #fff; color: #1e3a8a; cursor: pointer; }
.button:focus-visible { outline: 3px solid #f97316; outline-offset: 2px; }
.dialog::backdrop { background: rgba(0,0,0,0.5); }

// src/App.jsx
import { useState, useRef, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router";
import ErrorBoundary from "./components/ErrorBoundary";
import { config } from "./config";
import styles from "./App.module.css";

function RiskyWidget() {
  const [broken, setBroken] = useState(false);
  if (broken) throw new Error("Chart data was undefined");   // render error
  return (
    <section className={styles.widget} aria-labelledby="w-title">
      <h2 id="w-title">Monthly spend: ₹12,480</h2>
      <button className={styles.button} onClick={() => setBroken(true)}>Crash this widget</button>
    </section>
  );
}

function ConfirmDialog({ open, onClose }) {
  const ref = useRef(null);
  const opener = useRef(null);
  useEffect(() => {
    const d = ref.current;
    if (open && !d.open) { opener.current = document.activeElement; d.showModal(); }
    if (!open && d.open) { d.close(); opener.current?.focus(); }
  }, [open]);
  return (
    <dialog ref={ref} className={styles.dialog} onClose={onClose} aria-labelledby="d-title">
      <h2 id="d-title">Delete all transactions?</h2>
      <p>This cannot be undone.</p>
      <button className={styles.button} onClick={onClose}>Cancel</button>{" "}
      <button className={styles.button} onClick={onClose} autoFocus>Delete</button>
    </dialog>
  );
}

function Dashboard() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <h1>Dashboard</h1>
      <p>API base URL: <code>{config.apiUrl}</code></p>
      <button className={styles.button} onClick={() => setOpen(true)}>Open confirm dialog</button>
      <ConfirmDialog open={open} onClose={() => setOpen(false)} />
      <ErrorBoundary className={styles.fallback}>
        <RiskyWidget />
      </ErrorBoundary>
    </>
  );
}

function Reports() {
  return (<><h1>Reports</h1><p>Refresh this page after deploying — it must not 404.</p></>);
}

function NotFound() {
  return (<><h1>Page not found</h1><Link to="/">Back to dashboard</Link></>);
}

function Shell() {
  const location = useLocation();
  const mainRef = useRef(null);
  useEffect(() => { mainRef.current?.focus(); }, [location.pathname]);  // focus on route change
  return (
    <>
      <a href="#main" className={styles.skipLink}>Skip to main content</a>
      <header className={styles.header}>
        <strong>{config.appName}</strong>
        <nav aria-label="Primary">
          <Link to="/">Dashboard</Link>{" | "}
          <Link to="/reports">Reports</Link>
        </nav>
        <span className={styles.badge}>{config.mode}</span>
      </header>
      <main id="main" ref={mainRef} tabIndex={-1} className={styles.main}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  );
}

// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";

createRoot(document.getElementById("root"), {
  onCaughtError: (error, info) => console.warn("[caught]", error.message, info.componentStack),
  onUncaughtError: (error, info) => console.error("[fatal]", error.message, info.componentStack),
}).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
// npm i react-router   (React Router v7 declarative mode)`
    },
    {
      heading: "18. Summary and Course Wrap-Up",
      content: `• **Styling:** CSS Modules give scoped, zero-runtime plain CSS built into Vite; Tailwind CSS v4 gives utility classes with a one-line setup (\`@import "tailwindcss"\`, \`@tailwindcss/vite\`, \`@theme\`); runtime CSS-in-JS (styled-components, Emotion) costs bundle size and performance and does not work in Server Components — prefer zero-runtime libraries if you want styles-as-code. Pick one approach per project.
• **Accessibility:** use native semantic elements first, add ARIA only for gaps (\`aria-label\`, \`aria-describedby\`, \`aria-live\`, \`aria-expanded\`), keep visible \`:focus-visible\` rings, manage focus for dialogs and route changes, meet WCAG AA contrast (4.5:1 text, 3:1 large text and UI), and test with \`eslint-plugin-jsx-a11y\`, axe, Lighthouse, the keyboard and a real screen reader.
• **Environment variables:** only \`VITE_\`-prefixed values reach the browser via \`import.meta.env\`; they are inlined at build time and are always strings; never store secrets in them; validate once in a \`config.js\`.
• **Build and preview:** \`vite build\` produces a hashed, minified \`dist/\`; \`vite preview\` serves it locally on port 4173 so you can verify before shipping; analyse with rollup-plugin-visualizer and split vendor chunks.
• **Deployment:** push to GitHub, import into Vercel or Netlify, set env variables, get a preview deployment per pull request and automatic production deploys from \`main\`; cache \`/assets/*\` as immutable and \`index.html\` as no-cache.
• **SPA fallback:** configure a catch-all rewrite to \`index.html\` (Vercel rewrites, Netlify \`_redirects\`, Nginx \`try_files\`) so deep links and refreshes work, and add a \`path="*"\` route for a real Not Found page.
• **Error boundaries:** a class with \`getDerivedStateFromError\`, or the \`react-error-boundary\` package, or React Router's \`errorElement\`; place them per route and around risky widgets; report through React 19's \`onCaughtError\` and \`onUncaughtError\`.
• **Capstone:** PaisaTrack brings together components, state, Router v7, TanStack Query v5, Zustand v5, React 19 Actions, performance work, testing and deployment into one portfolio-ready project with a live URL.
**You have completed the Complete React Course.** Across 27 lectures you went from your first JSX element to a tested, accessible, deployed React 19 application, and you learned the modern ecosystem the way it is used in production in 2026: Vite instead of Create React App, Actions and \`useActionState\` for forms, TanStack Query for server state, Zustand and Redux Toolkit for client state, the React Compiler for automatic memoisation, and Vitest with React Testing Library for confidence.
**What to learn next:** the natural next step is server rendering, Server Components, file-based routing, caching and backend integration — everything a single-page app cannot do on its own. Continue with the **Complete Next.js Course** on this site, which starts exactly where this lecture ends and reuses every React skill you now have. Build the capstone, deploy it, share the link, and keep shipping.`
    }
  ]
};
