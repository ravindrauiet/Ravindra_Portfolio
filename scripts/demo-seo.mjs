// Adds a consistent SEO head block and a visible author credit to every parallax demo page.
// Safe to re-run: everything it writes sits between seo:start / seo:end markers and is replaced.
//
//   node scripts/demo-seo.mjs
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const { PARALLAX_DEMOS } = await import(pathToFileURL(join(root, "lib", "demos.js")).href);

const SITE = "https://www.ravindranathjha.in";
const AUTHOR = "Ravindra Nath Jha";
const ROLE = "Full Stack Developer & AI Engineer";

const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const jsonLd = (data) => JSON.stringify(data, null, 1).replace(/</g, "\\u003c");

for (const demo of PARALLAX_DEMOS) {
  const file = join(root, "public", demo.href);
  if (!existsSync(file)) {
    console.log("missing", demo.href);
    continue;
  }
  let html = readFileSync(file, "utf8");

  const url = `${SITE}${demo.href}`;
  const image = `${SITE}${demo.image}`;
  const title = `${demo.name} — Parallax Website by ${AUTHOR}`;
  const description = `${demo.description} Designed and coded by ${AUTHOR}, ${ROLE} (M.Tech AI, IIT Jodhpur).`;
  const keywords = [
    AUTHOR,
    `${AUTHOR} portfolio`,
    `${AUTHOR} parallax website`,
    "parallax website",
    `${demo.category} website`,
    `${demo.category} website design`,
    "GSAP ScrollTrigger",
    "scroll animation website",
    "free website template",
  ].join(", ");

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title,
      description,
      url,
      image,
      inLanguage: "en",
      genre: "Parallax website demo",
      keywords,
      author: {
        "@type": "Person",
        name: AUTHOR,
        url: SITE,
        jobTitle: ROLE,
        alumniOf: { "@type": "CollegeOrUniversity", name: "Indian Institute of Technology Jodhpur" },
        sameAs: ["https://www.linkedin.com/in/ravindra-jha75/", "https://github.com/ravindrauiet"],
      },
      creator: { "@type": "Person", name: AUTHOR, url: SITE },
      isPartOf: { "@type": "WebSite", name: `${AUTHOR} Portfolio`, url: SITE },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: AUTHOR, item: SITE },
        { "@type": "ListItem", position: 2, name: "Templates", item: `${SITE}/templates` },
        { "@type": "ListItem", position: 3, name: "Parallax websites", item: `${SITE}/templates#parallax-websites` },
        { "@type": "ListItem", position: 4, name: demo.name, item: url },
      ],
    },
  ];

  // Remove tags this block replaces (from earlier hand-written heads or a previous run)
  html = html.replace(/\s*<!-- seo:start -->[\s\S]*?<!-- seo:end -->/g, "");
  html = html.replace(/\s*<title>[\s\S]*?<\/title>/i, "");
  html = html.replace(/\s*<meta\s+name="(description|author|keywords|robots)"[^>]*>/gi, "");
  html = html.replace(/\s*<meta\s+(property|name)="(og|twitter):[^"]*"[^>]*>/gi, "");
  html = html.replace(/\s*<link\s+rel="canonical"[^>]*>/gi, "");

  const head = `
<!-- seo:start -->
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}" />
<meta name="author" content="${AUTHOR}" />
<meta name="keywords" content="${esc(keywords)}" />
<meta name="robots" content="index, follow, max-image-preview:large" />
<link rel="canonical" href="${url}" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="${AUTHOR} Portfolio" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(description)}" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${image}" />
<meta property="og:image:width" content="1440" />
<meta property="og:image:height" content="900" />
<meta property="og:image:alt" content="${esc(`${demo.name} parallax website by ${AUTHOR}`)}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(title)}" />
<meta name="twitter:description" content="${esc(description)}" />
<meta name="twitter:image" content="${image}" />
<script type="application/ld+json">
${jsonLd(schema)}
</script>
<!-- seo:end -->`;

  const viewport = html.match(/<meta\s+name="viewport"[^>]*>/i);
  if (viewport) html = html.replace(viewport[0], viewport[0] + head);
  else html = html.replace(/<head>/i, "<head>" + head);

  // Visible credit at the very bottom: real text Google reads, linking back to the portfolio
  const credit = `
<!-- seo:start -->
<div class="rnj-credit" style="position:relative;z-index:5;padding:18px 20px 84px;background:#0b0b10;color:#c9cbd6;font:500 13px/1.6 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;text-align:center;letter-spacing:0;text-transform:none">
  Designed and coded by <a href="${SITE}" style="color:#fff;font-weight:700;text-decoration:underline">${AUTHOR}</a>, ${esc(ROLE)} · M.Tech AI, IIT Jodhpur.
  <a href="${SITE}/templates#parallax-websites" style="color:#ff9d4d;margin-left:6px;text-decoration:underline">More parallax websites</a>
</div>
<!-- seo:end -->`;
  html = html.replace(/<\/body>/i, credit + "\n</body>");

  // Badge text carries the full name
  html = html.replace(/Demo by Ravindra(?! Nath)/g, `Demo by ${AUTHOR}`);

  writeFileSync(file, html);
  console.log("ok", demo.slug);
}
