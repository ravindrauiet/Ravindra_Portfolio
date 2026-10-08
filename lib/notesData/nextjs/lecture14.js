export const lecture14 = {
  slug: "lecture-14",
  number: 14,
  title: "Complete Next.js Course — Lecture 14: Internationalization (i18n) & Localized Routing",
  summary: "Build multilingual Next.js 16 apps: locale terminology, sub-path routing with a [lang] segment, detecting the visitor's language in proxy.js with Negotiator and intl-localematcher, server-only translation dictionaries, static generation per locale, a language switcher, formatting dates, numbers and currency with Intl, localized metadata and hreflang, RTL languages and when to reach for a library like next-intl.",
  readTime: "27 min read",
  difficulty: "Advanced",
  date: "2026-10-08",
  sections: [
    {
      heading: "1. Why Internationalization Matters",
      content: `**Internationalization (i18n)** is preparing your app so it can be adapted to different languages and regions. **Localization (l10n)** is the actual adaptation — translated text, local date formats, currencies.
For a developer in India, this is practical, not theoretical: a product might need **English, Hindi and a regional language**, or serve clients in the US, Europe and the Middle East.
What a properly localized app handles:
• **Translated UI text** — buttons, labels, error messages.
• **Locale-aware formatting** — 1,00,000 (India) vs 100,000 (US); ₹ vs $; 08/10/2026 vs 10/08/2026.
• **Localized URLs** — \`/hi/about\` and \`/en/about\`, so each language is indexable by search engines.
• **Direction** — right-to-left scripts like Arabic and Urdu.
• **SEO signals** — \`hreflang\` tags that tell Google which page serves which language.
**Key point for Next.js 16:** the App Router has **no built-in i18n config** (the old \`i18n\` option in \`next.config.js\` was a Pages Router feature). Instead you build localization with primitives you already know: a dynamic \`[lang]\` segment, \`proxy.js\`, Server Components and \`generateStaticParams\`.`
    },
    {
      heading: "2. Locale Terminology",
      content: `• **Locale** — an identifier for a language and formatting preferences, like \`en-US\` (English, United States), \`en-IN\` (English, India), \`hi-IN\` (Hindi, India), \`fr\` (French, any region).
• **Language tag** — the standard format for locales (BCP 47): a language code (\`en\`, \`hi\`) optionally followed by a region (\`IN\`, \`US\`) or script.
• **Default locale** — the fallback when nothing better matches.
• **Accept-Language header** — the browser sends the user's preferred languages in order, e.g. \`hi-IN,hi;q=0.9,en-US;q=0.8,en;q=0.7\`. The \`q\` values are weights.
**Choosing your locale list:** start with what you can actually translate and maintain. Two well-translated languages beat five half-finished ones.`
    },
    {
      heading: "3. Routing Strategy: Sub-Paths with a [lang] Segment",
      content: `There are three common URL strategies:
• **Sub-path**: \`example.com/en/about\`, \`example.com/hi/about\` — simplest, one domain, great for SEO. **Recommended and used in this lecture.**
• **Subdomain**: \`hi.example.com/about\` — needs DNS setup and a rewrite in Proxy.
• **Separate domains**: \`example.in\`, \`example.fr\` — strongest regional signal, most infrastructure.
For sub-paths, nest **every** route under a dynamic \`[lang]\` folder. The root layout moves inside it too, so it can set \`<html lang>\` per locale.`,
      codeSnippet: `app/
└── [lang]/
    ├── layout.js            # <html lang={lang}> — the root layout lives here
    ├── page.js              →  /en, /hi
    ├── about/
    │   └── page.js          →  /en/about, /hi/about
    ├── blog/
    │   └── [slug]/
    │       └── page.js      →  /en/blog/hello, /hi/blog/hello
    └── dictionaries.js      # loads translation files (server-only)
dictionaries/
├── en.json
└── hi.json
proxy.js                     # redirects "/" → "/en" or "/hi"`
    },
    {
      heading: "4. Detecting the User's Language in proxy.js",
      content: `When someone visits a URL **without** a locale (\`/about\`), Proxy should pick the best locale and redirect (\`/hi/about\`). Two small, battle-tested libraries do the negotiation correctly:
• **\`negotiator\`** — parses the \`Accept-Language\` header into an ordered list.
• **\`@formatjs/intl-localematcher\`** — finds the best match between what the user wants and what you support (e.g. \`hi-IN\` matches \`hi\`).
Also respect an explicit choice: if the user picked a language before, a \`NEXT_LOCALE\` cookie should win over the browser header.`,
      codeSnippet: `// npm install negotiator @formatjs/intl-localematcher

// i18n-config.js
export const i18n = {
  locales: ["en", "hi"],
  defaultLocale: "en",
};

// proxy.js
import { NextResponse } from "next/server";
import Negotiator from "negotiator";
import { match } from "@formatjs/intl-localematcher";
import { i18n } from "./i18n-config";

function getLocale(request) {
  // 1. An explicit choice saved in a cookie wins
  const saved = request.cookies.get("NEXT_LOCALE")?.value;
  if (saved && i18n.locales.includes(saved)) return saved;

  // 2. Otherwise negotiate from the Accept-Language header
  const headers = { "accept-language": request.headers.get("accept-language") ?? "" };
  const languages = new Negotiator({ headers }).languages();
  try {
    return match(languages, i18n.locales, i18n.defaultLocale);
  } catch {
    return i18n.defaultLocale; // e.g. header contains "*" only
  }
}

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const hasLocale = i18n.locales.some(
    (locale) => pathname === "/" + locale || pathname.startsWith("/" + locale + "/")
  );
  if (hasLocale) return NextResponse.next();

  const locale = getLocale(request);
  request.nextUrl.pathname = "/" + locale + pathname;   // /about → /hi/about
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Skip API routes, Next.js internals and files with an extension
  matcher: ["/((?!api|_next/static|_next/image|.*\\\\..*).*)"],
};`
    },
    {
      heading: "5. Translation Dictionaries (Server-Only)",
      content: `Store translations in JSON files — one per locale — with the **same keys** in each. Load them with a \`getDictionary(locale)\` function that uses **dynamic imports**, so each request loads only the language it needs.
Because dictionaries are loaded in **Server Components**, the translation files never ship to the browser — a page in Hindi doesn't download the English strings, and a 50-language app doesn't bloat the client bundle.
Mark the loader \`server-only\` and add a \`hasLocale\` guard so unknown locales (\`/xx/about\`) become a 404.`,
      codeSnippet: `// dictionaries/en.json
{
  "nav": { "home": "Home", "about": "About", "contact": "Contact" },
  "home": {
    "title": "Hi, I'm Ravindra",
    "subtitle": "Full Stack Developer & Team Lead",
    "cta": "Hire me"
  },
  "projects": { "count": "{count} projects delivered" }
}

// dictionaries/hi.json
{
  "nav": { "home": "होम", "about": "परिचय", "contact": "संपर्क" },
  "home": {
    "title": "नमस्ते, मैं रवींद्र हूँ",
    "subtitle": "फुल स्टैक डेवलपर और टीम लीड",
    "cta": "मुझे हायर करें"
  },
  "projects": { "count": "{count} प्रोजेक्ट पूरे किए" }
}

// app/[lang]/dictionaries.js
import "server-only";

const dictionaries = {
  en: () => import("@/dictionaries/en.json").then((m) => m.default),
  hi: () => import("@/dictionaries/hi.json").then((m) => m.default),
};

export const hasLocale = (locale) => locale in dictionaries;
export const getDictionary = async (locale) => dictionaries[locale]();`
    },
    {
      heading: "6. Using Translations in Layouts and Pages",
      content: `Every page and layout under \`[lang]\` receives \`params.lang\` (a **Promise** in Next.js 16). Validate it, load the dictionary, and render.
The **layout** is now the root layout, so it renders \`<html lang={lang}>\` — important for screen readers (correct pronunciation), browser translation prompts and SEO.
For simple placeholders like \`{count}\`, a tiny helper is enough. (Libraries add plural rules and rich formatting — see section 12.)`,
      codeSnippet: `// app/[lang]/layout.js
import { notFound } from "next/navigation";
import { hasLocale, getDictionary } from "./dictionaries";
import Navbar from "@/components/Navbar";

export default async function LangLayout({ children, params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <html lang={lang}>
      <body>
        <Navbar lang={lang} labels={dict.nav} />
        {children}
      </body>
    </html>
  );
}

// lib/i18n/format.js — replace {placeholders}
export function t(template, values = {}) {
  return template.replace(/\\{(\\w+)\\}/g, (_, key) => String(values[key] ?? ""));
}

// app/[lang]/page.js
import { getDictionary } from "./dictionaries";
import { t } from "@/lib/i18n/format";

export default async function Home({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <section>
      <h1>{dict.home.title}</h1>
      <p>{dict.home.subtitle}</p>
      <p>{t(dict.projects.count, { count: 20 })}</p>
      <a href={"/" + lang + "#contact"}>{dict.home.cta}</a>
    </section>
  );
}`
    },
    {
      heading: "7. Static Rendering for Every Locale",
      content: `Without extra work, a \`[lang]\` route renders on demand. Export **\`generateStaticParams\`** from the \`[lang]\` layout and Next.js prerenders every page **once per locale** at build time — static HTML from the CDN for every language.
For nested dynamic routes (\`[lang]/blog/[slug]\`), the child's \`generateStaticParams\` receives the parent's \`lang\`, so you can generate only the posts that exist in each language.
Combine with \`export const dynamicParams = false\` in the layout to 404 unsupported locales at the routing level.`,
      codeSnippet: `// app/[lang]/layout.js
import { i18n } from "@/i18n-config";

export const dynamicParams = false; // only the locales listed below exist

export async function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang })); // [{ lang: "en" }, { lang: "hi" }]
}

// app/[lang]/blog/[slug]/page.js
export async function generateStaticParams({ params }) {
  const { lang } = params;                         // parent's param (synchronous here)
  const posts = await getPostsForLocale(lang);     // only posts translated into this language
  return posts.map((post) => ({ slug: post.slug }));
}`
    },
    {
      heading: "8. Building a Language Switcher",
      content: `A language switcher keeps the user on the **same page** in another language: \`/en/about\` → \`/hi/about\`. It needs the current pathname, so it's a small **Client Component** using \`usePathname()\`.
Also save the choice in the \`NEXT_LOCALE\` cookie so Proxy respects it on future visits to \`/\`.
Accessibility details: label each option with the language's **own name** ("हिन्दी", not "Hindi"), and mark it with the \`lang\` attribute so screen readers pronounce it correctly.`,
      codeSnippet: `// components/LanguageSwitcher.jsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
];

export default function LanguageSwitcher({ current }) {
  const pathname = usePathname();                       // e.g. /en/about

  function pathFor(code) {
    const segments = pathname.split("/");               // ["", "en", "about"]
    segments[1] = code;
    return segments.join("/") || "/";
  }

  function remember(code) {
    document.cookie = "NEXT_LOCALE=" + code + "; path=/; max-age=31536000; samesite=lax";
  }

  return (
    <nav aria-label="Language">
      {LANGUAGES.map((l) => (
        <Link
          key={l.code}
          href={pathFor(l.code)}
          lang={l.code}
          hrefLang={l.code}
          aria-current={l.code === current ? "true" : undefined}
          onClick={() => remember(l.code)}
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}`
    },
    {
      heading: "9. Formatting Dates, Numbers and Currency with Intl",
      content: `Translation is only half of localization. Use the built-in **\`Intl\`** APIs — available in Node.js and every modern browser, no library needed:
• **\`Intl.NumberFormat\`** — grouping (\`1,00,000\` in \`en-IN\` vs \`100,000\` in \`en-US\`), currency, percentages, compact numbers ("1.2K").
• **\`Intl.DateTimeFormat\`** — dates and times in local order and language.
• **\`Intl.RelativeTimeFormat\`** — "3 days ago" / "3 दिन पहले".
• **\`Intl.PluralRules\`** — choose the correct plural form ("1 project" vs "2 projects").
**Hydration tip:** format dates on the **server** (or pass a fixed time zone). Formatting \`new Date()\` in a Client Component can produce different output on the server and in the user's browser time zone, causing hydration mismatches.`,
      codeSnippet: `// lib/i18n/intl.js
const LOCALE_MAP = { en: "en-IN", hi: "hi-IN" }; // full locales for formatting

export function formatCurrency(amount, lang, currency = "INR") {
  return new Intl.NumberFormat(LOCALE_MAP[lang], { style: "currency", currency }).format(amount);
}
export function formatDate(date, lang) {
  return new Intl.DateTimeFormat(LOCALE_MAP[lang], {
    dateStyle: "long",
    timeZone: "Asia/Kolkata",           // fixed zone → same result on server and client
  }).format(new Date(date));
}
export function formatCompact(n, lang) {
  return new Intl.NumberFormat(LOCALE_MAP[lang], { notation: "compact" }).format(n);
}

// formatCurrency(150000, "en")  → "₹1,50,000.00"   (Indian digit grouping)
// Compare: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(150000) → "$150,000.00"
// formatDate("2026-10-08", "en") → "8 October 2026"
// formatDate("2026-10-08", "hi") → "8 अक्टूबर 2026"
// formatCompact(12500, "en")     → "13K"

// Plurals
const plural = new Intl.PluralRules("en-IN");
const label = (n) => n + " " + (plural.select(n) === "one" ? "project" : "projects");`
    },
    {
      heading: "10. Localized Metadata and hreflang for SEO",
      content: `Each language version should have its **own title and description** in that language, and tell search engines about its siblings with **\`hreflang\`** alternates. Without hreflang, Google may treat translations as duplicate content or show the wrong language in results.
In Next.js, set \`alternates.languages\` in \`generateMetadata\` — Next.js renders the \`<link rel="alternate" hreflang="...">\` tags. Include an \`x-default\` entry for users whose language you don't support.
Also include every locale's URLs in \`sitemap.js\`.`,
      codeSnippet: `// app/[lang]/about/page.js
import { getDictionary } from "../dictionaries";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return {
    title: dict.about.metaTitle,
    description: dict.about.metaDescription,
    alternates: {
      canonical: "/" + lang + "/about",
      languages: {
        en: "/en/about",
        hi: "/hi/about",
        "x-default": "/en/about",
      },
    },
    openGraph: { locale: lang === "hi" ? "hi_IN" : "en_IN" },
  };
}

// Renders (with metadataBase set):
// <link rel="canonical" href="https://example.com/hi/about">
// <link rel="alternate" hreflang="en" href="https://example.com/en/about">
// <link rel="alternate" hreflang="hi" href="https://example.com/hi/about">
// <link rel="alternate" hreflang="x-default" href="https://example.com/en/about">`
    },
    {
      heading: "11. Right-to-Left (RTL) Languages",
      content: `Arabic, Urdu, Hebrew and Persian are written right to left. Supporting them is mostly about **direction**, not translation:
• Set \`dir="rtl"\` on \`<html>\` for RTL locales — the browser mirrors text alignment and inline layout automatically.
• Use **CSS logical properties** instead of left/right: \`margin-inline-start\` instead of \`margin-left\`, \`padding-inline-end\`, \`inset-inline-start\`, \`text-align: start\`. They flip automatically with direction.
• Flexbox and Grid follow the direction automatically.
• Mirror **directional icons** (arrows, "back" chevrons) but not universal ones (play buttons, logos, checkmarks).
• In Tailwind, use \`ms-4\`/\`me-4\` and \`ps-4\`/\`pe-4\`, or the \`rtl:\` variant.`,
      codeSnippet: `// app/[lang]/layout.js
const RTL_LOCALES = ["ar", "ur", "he", "fa"];

export default async function LangLayout({ children, params }) {
  const { lang } = await params;
  return (
    <html lang={lang} dir={RTL_LOCALES.includes(lang) ? "rtl" : "ltr"}>
      <body>{children}</body>
    </html>
  );
}

/* globals.css — logical properties flip automatically */
.card {
  padding-inline: 24px;           /* left + right in LTR and RTL */
  margin-inline-start: 16px;      /* left in LTR, right in RTL */
  border-inline-start: 1px solid #e8e9f0;
  text-align: start;
}
[dir="rtl"] .icon-arrow { transform: scaleX(-1); } /* mirror directional icons only */`
    },
    {
      heading: "12. When to Use an i18n Library (next-intl and Others)",
      content: `The hand-rolled approach above is great for learning and for small sites. As an app grows, a library saves time:
• **next-intl** — the most popular choice for the App Router. Works in Server and Client Components, ICU message syntax (plurals, selects, rich text), typed message keys, locale-aware navigation helpers and a routing integration with Proxy.
• **i18next / react-i18next** — huge ecosystem, many plugins, translation-management integrations.
• **Lingui** — compile-time message extraction, small runtime.
• **Paraglide** — compiles messages to tree-shakable functions.
**Signs you need a library:** complex plurals and gender forms, translators working in a translation platform (Crowdin, Lokalise), many languages, type-safe keys across a large team, or translated pathnames (\`/hi/parichay\` instead of \`/hi/about\`).
Whichever you pick, the architecture stays the same: a locale segment, Proxy for detection, server-side message loading and \`hreflang\` metadata.`
    },
    {
      heading: "13. Practical: A Bilingual Portfolio (English + Hindi)",
      content: `Put everything together for a two-language version of a portfolio. After building it:
• Visit \`/\` with your browser set to Hindi → redirected to \`/hi\`.
• Click "English" in the switcher → \`/en\` with the same page, and the cookie remembers it.
• Run \`npm run build\` → every page is prerendered twice (\`/en/...\` and \`/hi/...\`).
• View the page source → \`<html lang="hi">\`, translated title, hreflang links.`,
      codeSnippet: `// File checklist
i18n-config.js                      // { locales: ["en", "hi"], defaultLocale: "en" }
proxy.js                            // cookie → Accept-Language → redirect to /{locale}
dictionaries/en.json, hi.json       // same keys in both files
app/[lang]/dictionaries.js          // server-only getDictionary + hasLocale
app/[lang]/layout.js                // <html lang dir>, generateStaticParams, dynamicParams = false
app/[lang]/page.js                  // uses dict.home.*
app/[lang]/about/page.js            // generateMetadata with alternates.languages
components/LanguageSwitcher.jsx     // usePathname + NEXT_LOCALE cookie
lib/i18n/intl.js                    // formatCurrency, formatDate, plurals
app/sitemap.js                      // every page × every locale

// app/sitemap.js (excerpt)
import { i18n } from "@/i18n-config";
const BASE = "https://example.com";
const pages = ["", "/about", "/projects"];

export default function sitemap() {
  return pages.flatMap((page) =>
    i18n.locales.map((lang) => ({
      url: BASE + "/" + lang + page,
      alternates: {
        languages: Object.fromEntries(i18n.locales.map((l) => [l, BASE + "/" + l + page])),
      },
    }))
  );
}`
    },
    {
      heading: "14. Summary",
      content: `• The App Router has no i18n config option — build localization from a \`[lang]\` segment, \`proxy.js\`, Server Components and \`generateStaticParams\`.
• Sub-path routing (\`/en\`, \`/hi\`) is the simplest and most SEO-friendly strategy; move the root layout into \`app/[lang]/\` and set \`<html lang>\`.
• Detect the locale in Proxy: saved \`NEXT_LOCALE\` cookie first, then \`Accept-Language\` via \`negotiator\` + \`@formatjs/intl-localematcher\`.
• Load JSON dictionaries in Server Components with dynamic imports — translations never ship to the client.
• Prerender every locale with \`generateStaticParams\`; 404 unknown locales with \`dynamicParams = false\`.
• Format numbers, currency, dates and plurals with \`Intl\`; fix the time zone to avoid hydration mismatches.
• Localize metadata and add \`alternates.languages\` (hreflang) plus \`x-default\`; list every locale in the sitemap.
• Support RTL with \`dir="rtl"\` and CSS logical properties. Reach for next-intl or i18next when plurals, translators and scale demand it.
**Next lecture:** databases end to end — schema design, migrations, queries, transactions and connection management with Drizzle ORM and Prisma.`
    }
  ]
};
