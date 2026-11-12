// Renders one preview image per build step for every prompt on /prompts/[slug].
//
//   node scripts/capture-step-previews.mjs            all prompts
//   node scripts/capture-step-previews.mjs saas       only slugs containing "saas"
//
// Each step gets a mockup drawn in the prompt's own palette, fonts and brand name (the kind of
// mockup comes from getBuildPlan's `kind`). Output: public/assets/images/prompts/steps/<slug>-<n>.webp
// plus lib/prompts/stepImages.json with the image sizes. Hero steps reuse <slug>.png.
// Needs Microsoft Edge or Google Chrome (headless, driven over the DevTools protocol; no npm packages).
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { getAllPrompts } from "../lib/prompts/index.js";
import { getBuildPlan } from "../lib/prompts/buildPlan.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const previewDir = join(root, "scripts", "prompt-previews");
const outDir = join(root, "public", "assets", "images", "prompts", "steps");
const manifestPath = join(root, "lib", "prompts", "stepImages.json");
const WIDTH = 1200;
const SCALE = 0.75; // saved images are 900px wide

const browser = [
  process.env.BROWSER_PATH,
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
]
  .filter(Boolean)
  .find((path) => existsSync(path));
if (!browser) {
  console.error("No Edge or Chrome found. Set BROWSER_PATH to the browser executable.");
  process.exit(1);
}

/* ---------------------------------------------------------------- content helpers */

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const PEOPLE = [
  ["Ananya Sharma", "Product Lead"],
  ["Rohit Verma", "Founder"],
  ["Meera Iyer", "Designer"],
  ["Arjun Nair", "Engineer"],
  ["Kavya Reddy", "Marketing Head"],
  ["Sana Khan", "Operations"],
  ["Vikram Singh", "Director"],
  ["Priya Menon", "Consultant"],
];
const initials = (name) => name.split(" ").map((w) => w[0]).join("");

function items(detail = "", n, fallback, useQuotes = true) {
  const clean = (s) => cap(s.replace(/^(a|an|the|and|or)\s+/i, "").replace(/[."']/g, "").trim()).slice(0, 26);
  let found = [];
  for (const m of detail.matchAll(/\(([^()]{4,})\)/g)) {
    const parts = m[1].split(/,\s*|\s+and\s+|\s*\/\s*/).map((s) => s.trim()).filter((s) => s && s.split(" ").length <= 4 && !/\d+px|e\.g/i.test(s));
    if (parts.length >= 2) {
      found = parts;
      break;
    }
  }
  if (found.length < 2 && useQuotes) {
    const quoted = [...detail.matchAll(/"([^"]{2,28})"/g)].map((m) => m[1]);
    if (quoted.length >= 2) found = quoted;
  }
  const out = [...new Set(found.map(clean).filter(Boolean))];
  for (const f of fallback) if (out.length < n && !out.includes(f)) out.push(f);
  return out.slice(0, n);
}
const quoted = (detail = "", fallback) => detail.match(/"([^"]{2,24})"/)?.[1] || fallback;
const lastQuoted = (detail = "", fallback) => [...detail.matchAll(/"([^"]{2,24})"/g)].pop()?.[1] || fallback;
const prices = (detail = "", fallback) => {
  const found = [...detail.matchAll(/(?:₹|\$|Rs\.?\s?)\s?[\d,]+(?:\.\d+)?/g)].map((m) => m[0].replace(/\s/g, ""));
  return found.length >= 2 ? found : fallback;
};

const lines = (widths) => widths.map((w) => `<i class="ln" style="width:${w}%"></i>`).join("");
const ph = (i, extra = "") => `<div class="ph ph${i % 4} ${extra}"><span></span></div>`;
const head = (eyebrow, title, center = true) =>
  `<div class="sh ${center ? "c" : ""}"><span class="eb">${esc(eyebrow)}</span><h2>${title}</h2>${lines(center ? [46] : [70])}</div>`;
const btn = (label, cls = "") => `<span class="btn ${cls}">${esc(label)}</span>`;
const icon = (i) => `<span class="ic">${["◆", "●", "▲", "■", "✦", "◉"][i % 6]}</span>`;

/* ---------------------------------------------------------------- mockups per kind */

function render(step, ctx) {
  const d = step.detail || "";
  const B = esc(ctx.brand);
  const logo = `<div class="logo"><i></i>${B}</div>`;
  const navLinks = ctx.navLinks;
  const navbar = (cta = step.kind === "nav" ? lastQuoted(d, ctx.navCta) : ctx.navCta) =>
    `<div class="nav">${logo}${navLinks.map((l) => `<span>${esc(l)}</span>`).join("")}<span class="sp"></span>${btn(cta)}</div>`;

  switch (step.kind) {
    case "styleguide":
      return `<div class="pad sg">
        <div class="sg-col">
          <span class="eb">Colours</span>
          <div class="sw">${ctx.palette.map((c, i) => `<div><b style="background:${c}"></b><em>${["Background", "Text", "Primary", "Accent"][i]}</em><code>${c}</code></div>`).join("")}</div>
          <span class="eb" style="margin-top:34px">Buttons &amp; badges</span>
          <div class="row">${btn("Primary")}${btn("Secondary", "sec")}${btn("Ghost", "ghost")}<span class="badge">New</span></div>
        </div>
        <div class="sg-col">
          <span class="eb">Typography</span>
          <div class="type"><div class="aa">Aa</div><div><h1 class="t1">${B}</h1><h3>Heading 3 · ${esc(ctx.headFont)}</h3><p>Body text · ${esc(ctx.bodyFont)}</p></div></div>
          <span class="eb" style="margin-top:28px">Card</span>
          <div class="card">${icon(0)}<h4>Reusable card</h4>${lines([90, 70])}</div>
        </div></div>`;

    case "nav":
      return `<div>${navbar()}<div class="ghostpage">${lines([40])}${lines([60, 52])}</div></div>`;

    case "strip":
      return `<div><div class="strip">${esc(cap((d.split(/[.;]/)[0] || step.title).slice(0, 90)))} <b>→</b></div>${navbar()}<div class="ghostpage">${lines([44])}${lines([62, 50])}</div></div>`;

    case "logos": {
      const names = items(d, 6, ["Acme", "Lumen", "Kite", "Orbit", "Pixelco", "Northwind"]);
      return `<div class="pad c"><span class="eb">${esc(step.title)}</span><p class="lead">Trusted by teams who ship every week</p><div class="logos">${names
        .map((n, i) => `<span>${icon(i)}${esc(n)}</span>`)
        .join("")}</div></div>`;
    }

    case "stats": {
      const labels = items(d, 4, ["Happy customers", "Years of experience", "Average rating", "Cities served"]);
      const nums = ["12k+", "15+", "4.9★", "25"];
      return `<div class="pad"><div class="stats">${labels.map((l, i) => `<div><strong>${nums[i]}</strong><span>${esc(l)}</span></div>`).join("")}</div></div>`;
    }

    case "chart":
    case "app": {
      const nav = items(d, 6, ["Dashboard", "Orders", "Projects", "Customers", "Reports", "Settings"]);
      return `<div class="appw"><aside>${logo}${nav.map((n, i) => `<span class="${i === 0 ? "on" : ""}">${icon(i)}${esc(n)}</span>`).join("")}</aside>
        <div class="appm"><div class="appbar"><h3>${esc(/login|sign/i.test(step.title) ? "Welcome back, Ananya" : step.title.replace(/\s*\(.*?\)/g, ""))}</h3><span class="search">Search…</span><span class="av">AS</span></div>
        <div class="kpis">${["Revenue", "Active users", "Orders", "Conversion"].map((k, i) => `<div class="card"><span>${k}</span><strong>${["₹4.2L", "1,284", "362", "3.8%"][i]}</strong><em>${i === 3 ? "▼ 0.4%" : "▲ " + (8 + i * 3) + "%"}</em></div>`).join("")}</div>
        <div class="card chart"><svg viewBox="0 0 600 160" preserveAspectRatio="none"><path d="M0 130 C60 120 90 80 150 90 S260 40 320 60 S430 20 480 34 S560 10 600 18 L600 160 L0 160Z" fill="var(--soft)"/><path d="M0 130 C60 120 90 80 150 90 S260 40 320 60 S430 20 480 34 S560 10 600 18" fill="none" stroke="var(--pri)" stroke-width="4"/></svg></div></div></div>`;
    }

    case "sidebar":
      return render({ ...step, kind: "app" }, ctx);

    case "auth":
      return `<div class="pad auth"><div class="card authc">${logo}<h2>Welcome back</h2><p class="lead sm">Sign in to your ${B} account</p><span class="btn sec full">G&nbsp; Continue with Google</span><div class="or"><i></i>or<i></i></div><label>Email<span class="in"></span></label><label>Password<span class="in"></span></label>${btn("Sign in", "full")}<p class="lead sm">New here? <b>Create an account</b></p></div></div>`;

    case "code": {
      const tabs = items(d, 3, ["JavaScript", "Python", "cURL"]);
      const id = ctx.brand.toLowerCase().replace(/[^a-z]/g, "");
      return `<div class="pad split">
        <div>${head(step.title, `Build on ${B} in minutes`, false)}<ul class="checks">${["Typed SDKs", "Webhooks with signatures", "99.99% uptime"].map((t) => `<li>${t}</li>`).join("")}</ul></div>
        <div class="code"><div class="tabs">${tabs.map((t, i) => `<span class="${i ? "" : "on"}">${esc(t)}</span>`).join("")}</div>
<pre><b class="k">import</b> { ${cap(id)} } <b class="k">from</b> <b class="s">"@${id}/sdk"</b>;

<b class="k">const</b> client = <b class="k">new</b> ${cap(id)}({ apiKey: process.env.<b class="v">API_KEY</b> });

<b class="k">const</b> result = <b class="k">await</b> client.<b class="f">run</b>({
  input: <b class="s">"Hello from ${B}"</b>,
  stream: <b class="v">true</b>,
});
console.<b class="f">log</b>(result.<b class="v">output</b>);</pre></div></div>`;
    }

    case "pricing": {
      const plans = items(d, 3, ["Starter", "Pro", "Business"]);
      const amounts = prices(d, ["₹0", "₹999", "₹2,499"]);
      return `<div class="pad">${head(step.title, "Simple, honest pricing")}<div class="toggle"><span class="on">Monthly</span><span>Yearly −20%</span></div><div class="g3">${plans
        .map(
          (p, i) =>
            `<div class="card plan ${i === 1 ? "hl" : ""}">${i === 1 ? '<span class="badge">Most popular</span>' : ""}<h4>${esc(p)}</h4><strong>${esc(amounts[i] || amounts[amounts.length - 1])}<small>/mo</small></strong><ul class="checks">${["Everything to start", "Email support", "Unlimited updates"]
              .slice(0, 2 + (i > 0))
              .map((f) => `<li>${f}</li>`)
              .join("")}</ul>${btn(i === 1 ? "Choose plan" : "Get started", i === 1 ? "" : "sec")}</div>`
        )
        .join("")}</div></div>`;
    }

    case "faq": {
      const qs = ["How do I get started?", "Is there a free trial?", "Can I cancel anytime?", "Do you offer support in India?", "Is my data secure?"];
      return `<div class="pad narrow">${head(step.title, "Frequently asked questions")}<div class="faq">${qs
        .map((q, i) => `<div class="card q ${i ? "" : "open"}"><h4>${q}<b>${i ? "+" : "−"}</b></h4>${i ? "" : lines([92, 74])}</div>`)
        .join("")}</div></div>`;
    }

    case "steps": {
      const labels = items(d, 3, ["Tell us what you need", "We set everything up", "Launch and grow"]);
      return `<div class="pad">${head(step.title, `How ${B} works`)}<div class="steps">${labels
        .map((l, i) => `<div><span class="num">${i + 1}</span><h4>${esc(l)}</h4>${lines([80, 60])}</div>`)
        .join('<i class="arrow"></i>')}</div></div>`;
    }

    case "testimonials":
      return `<div class="pad">${head(step.title, "Loved by people like you")}<div class="g3">${PEOPLE.slice(0, 3)
        .map(
          ([n, r]) =>
            `<div class="card quote"><div class="stars">★★★★★</div>${lines([96, 88, 64])}<div class="who"><span class="av">${initials(n)}</span><div><b>${n}</b><small>${r}</small></div></div></div>`
        )
        .join("")}</div></div>`;

    case "team": {
      const roles = items(d, 4, PEOPLE.slice(0, 4).map((p) => p[1]));
      return `<div class="pad">${head(step.title, `Meet the ${esc(step.title.split(" ").pop().toLowerCase())}`)}<div class="g4">${PEOPLE.slice(2, 6)
        .map(([n], i) => `<div class="card person">${ph(i, "portrait")}<b>${n}</b><small>${esc(roles[i])}</small></div>`)
        .join("")}</div></div>`;
    }

    case "table":
    case "listing": {
      const cols = ["Name", "Category", "Date", "Status"];
      const rows = ["Morning batch", "Pro plan", "Weekend special", "Enterprise", "Evening batch"];
      const filters = step.kind === "listing" ? `<div class="chips">${["All", "Popular", "New", "Under ₹2,000"].map((c, i) => `<span class="${i ? "" : "on"}">${c}</span>`).join("")}<span class="search">Search…</span></div>` : "";
      return `<div class="pad">${head(step.title, step.kind === "listing" ? "Browse everything" : "At a glance", false)}${filters}<div class="card tbl"><div class="tr th">${cols.map((c) => `<span>${esc(c)}</span>`).join("")}</div>${rows
        .map((r, i) => `<div class="tr"><span><b>${r}</b></span><span>${esc(cols[1] === "Category" ? ["Classes", "Plans", "Offers", "Teams", "Classes"][i] : "—")}</span><span>${["12 Nov", "14 Nov", "18 Nov", "21 Nov", "25 Nov"][i]}</span><span><em class="st s${i % 3}">${["Open", "Few left", "Full"][i % 3]}</em></span></div>`)
        .join("")}</div></div>`;
    }

    case "media":
      return `<div class="pad split"><div class="player">${ph(1, "wide")}<span class="play">▶</span><div class="bar"><i style="width:38%"></i></div></div><div>${head(step.title, "Watch it in action", false)}<div class="list">${["Introduction", "The big idea", "Live walkthrough", "Questions"].map((c, i) => `<div class="card li"><span class="num sm">${i + 1}</span><b>${c}</b><small>${["00:00", "04:12", "11:40", "23:05"][i]}</small></div>`).join("")}</div></div></div>`;

    case "map":
      return `<div class="pad split"><div class="map"><span class="pin">●</span><span class="pin p2">●</span></div><div>${head(step.title, "Come and see us", false)}<div class="card">${["Address", "Opening hours", "Phone"].map((l, i) => `<div class="kv"><b>${l}</b><span>${["14 MG Road, Bengaluru 560001", "Mon–Sun · 9 am – 10 pm", "+91 98765 43210"][i]}</span></div>`).join("")}</div>${btn("Get directions")}</div></div>`;

    case "countdown":
      return `<div class="pad c">${head(step.title, "The big day is almost here")}<div class="count">${["42", "08", "15", "30"].map((n, i) => `<div class="card"><strong>${n}</strong><span>${["Days", "Hours", "Minutes", "Seconds"][i]}</span></div>`).join("")}</div></div>`;

    case "form": {
      const fields = items(d, 4, ["Full name", "Phone number", "Preferred date", "Message"]);
      const submit = quoted(d, /book|reserv/i.test(step.title) ? "Confirm booking" : "Send request");
      return `<div class="pad split"><div>${head(step.title, /book|reserv|appoint/i.test(step.title + d) ? "Book in under a minute" : "Let's talk", false)}<ul class="checks">${["Reply within 24 hours", "No spam, ever", "Free first consultation"].map((t) => `<li>${t}</li>`).join("")}</ul></div><div class="card form">${fields
        .map((f, i) => `<label>${esc(f)}<span class="in ${i === 3 ? "ta" : ""}"></span></label>`)
        .join("")}${btn(submit, "full")}</div></div>`;
    }

    case "cta": {
      const email = /email|newsletter|waitlist|signup|subscribe/i.test(step.title + d);
      return `<div class="pad"><div class="ctab"><h2>${email ? "Get early access" : `Ready to start with ${B}?`}</h2>${lines([40])}<div class="row c">${email ? `<span class="in light">you@example.com</span>` : ""}${btn(quoted(d, email ? "Join the list" : "Get started"), "inv")}</div></div></div>`;
    }

    case "story":
      return `<div class="pad split">${ph(2, "tall")}<div>${head(step.title, `The story behind ${B}`, false)}${lines([96, 92, 88, 70])}<br/>${lines([94, 60])}<p class="sig">— ${PEOPLE[1][0]}, ${PEOPLE[1][1]}</p></div></div>`;

    case "menu": {
      const tabs = items(d, 4, ["Starters", "Mains", "Desserts", "Drinks"]);
      const dishes = ["Chef's signature", "House special", "Seasonal plate", "Classic favourite", "Today's fresh", "Sweet finish"];
      return `<div class="pad">${head(step.title, "Fresh every day")}<div class="toggle">${tabs.map((t, i) => `<span class="${i ? "" : "on"}">${esc(t)}</span>`).join("")}</div><div class="g2">${dishes
        .map((n, i) => `<div class="card dish">${ph(i, "thumb")}<div><b>${n}</b>${lines([80])}</div><strong>₹${[320, 450, 280, 390, 260, 210][i]}</strong></div>`)
        .join("")}</div></div>`;
    }

    case "gallery":
      return `<div class="pad">${head(step.title, "A closer look")}<div class="mas">${[0, 1, 2, 3, 4].map((i) => ph(i, `m${i}`)).join("")}</div></div>`;

    case "grid":
    case "detail":
    case "blog":
    case "features":
    default: {
      if (step.kind === "detail") {
        return `<div class="pad split">${'<div class="gal">' + ph(0, "big") + '<div class="thumbs">' + [1, 2, 3].map((i) => ph(i)).join("") + "</div></div>"}<div><span class="eb">${esc(step.title)}</span><h2>${B} signature</h2><div class="stars">★★★★★ <small>4.8 · 312 reviews</small></div><strong class="price">₹12,999</strong>${lines([96, 84, 70])}<div class="row">${btn("Add to cart")}${btn("Enquire", "sec")}</div></div></div>`;
      }
      if (step.kind === "blog") {
        return `<div class="pad">${head(step.title, "Notes and stories")}<div class="g3">${["How we work", "A beginner's guide", "What we learned this year"].map((t, i) => `<div class="card tile">${ph(i)}<small>${["5", "8", "6"][i]} min read</small><h4>${t}</h4>${lines([90, 66])}</div>`).join("")}</div></div>`;
      }
      if (step.kind === "grid" || step.kind === "listing") {
        const names = items(d, 4, ["Signature", "Essential", "Premium", "Classic"]);
        return `<div class="pad">${head(step.title, "Handpicked for you")}<div class="g4">${names
          .map((n, i) => `<div class="card tile">${ph(i)}<h4>${esc(n)}</h4>${lines([80])}<div class="meta"><strong>₹${["2,499", "1,299", "4,999", "999"][i]}</strong><span class="badge">${["New", "Popular", "Limited", "Sale"][i]}</span></div></div>`)
          .join("")}</div></div>`;
      }
      const feats = items(d, 5, ["Fast setup", "Works everywhere", "Secure by default", "Real support", "Smart automation", "Clear reports"]);
      return `<div class="pad">${head(step.title, `Why people choose ${B}`)}<div class="bento">${feats
        .map((f, i) => `<div class="card f ${i === 0 ? "big" : ""}">${icon(i)}<h4>${esc(f)}</h4>${lines(i === 0 ? [90, 80, 56] : [86, 60])}</div>`)
        .join("")}</div></div>`;
    }

    case "footer": {
      const cols = ["Product", "Company", "Resources", "Legal"];
      return `<div class="foot"><div class="fgrid"><div>${logo}${lines([80, 60])}<div class="soc">${"in x ig yt".split(" ").map((s) => `<span>${s}</span>`).join("")}</div></div>${cols
        .map((c) => `<div><b>${c}</b>${[0, 1, 2, 3].map((i) => lines([50 + ((c.length * 7 + i * 13) % 30)])).join("")}</div>`)
        .join("")}</div><div class="fbot"><span>© 2026 ${B}. All rights reserved.</span><span>Privacy · Terms</span></div></div>`;
    }

    case "motion":
      return `<div class="pad c">${head(step.title, "Subtle motion, never in the way")}<div class="motion"><div class="card f">${icon(0)}<h4>Fade up on scroll</h4>${lines([80])}<span class="arrow-up">↑</span></div><div class="card f lift">${icon(1)}<h4>Lift on hover</h4>${lines([76])}<svg class="cursor" viewBox="0 0 24 24"><path d="M4 2l16 9-7 2-3 7z" fill="var(--ink)" stroke="var(--bg)" stroke-width="1.5"/></svg></div><div class="card f">${icon(2)}<h4>Smooth anchors</h4>${lines([70])}</div></div><p class="note">Respects “reduce motion” settings</p></div>`;

    case "devices":
      return `<div class="pad devs"><div class="dv desk"><div class="mini">${navbar()}<div class="mh"><h3>${B}</h3>${lines([50, 40])}${btn("Get started")}</div></div></div><div class="dv tab"><div class="mini"><div class="nav sm">${logo}<span class="sp"></span><span class="burger">≡</span></div><div class="mh"><h3>${B}</h3>${lines([70, 56])}${btn("Get started")}</div></div></div><div class="dv phone"><div class="mini"><div class="nav sm">${logo}<span class="sp"></span><span class="burger">≡</span></div><div class="mh"><h3>${B}</h3>${lines([86, 70])}${btn("Start")}</div></div></div><div class="a11y">${["Keyboard ✓", "Contrast 4.5:1 ✓", "Alt text ✓", "Focus visible ✓"].map((t) => `<span>${t}</span>`).join("")}</div></div>`;

    case "seo": {
      const domain = ctx.brand.toLowerCase().replace(/[^a-z0-9]+/g, "") + ".com";
      return `<div class="pad split"><div class="card serp"><span class="search wide">${B}</span><div class="res"><small>https://${domain}</small><h4>${B} — ${esc(ctx.short)}</h4><p>${esc(ctx.description.slice(0, 150))}…</p></div><div class="res dim">${lines([40])}${lines([70, 90])}</div></div><div class="scores">${["Performance", "Accessibility", "Best practices", "SEO"].map((l, i) => `<div><span class="ring">${[98, 100, 100, 100][i]}</span><small>${l}</small></div>`).join("")}</div></div>`;
    }

    case "launch": {
      const domain = ctx.brand.toLowerCase().replace(/[^a-z0-9]+/g, "") + ".com";
      return `<div class="pad split"><div class="win"><div class="wbar"><i></i><i></i><i></i><span>🔒 https://${domain}</span></div><div class="mini">${navbar()}<div class="mh"><h3>${B}</h3>${lines([50, 40])}${btn("Get started")}</div></div></div><div><div class="card dep"><span class="dot"></span><div><b>Deployment ready</b><small>main · built in 42s · HTTPS on</small></div></div><ul class="checks big">${["Pushed to GitHub", "Deployed on Vercel", "Custom domain connected", "Sitemap sent to Google"].map((t) => `<li>${t}</li>`).join("")}</ul></div></div>`;
    }
  }
}

/* ---------------------------------------------------------------- page styles */

function styles(ctx) {
  const [bg, ink, pri, acc] = ctx.palette;
  return `
:root{--bg:${bg};--ink:${ink};--pri:${pri};--acc:${acc};
--mut:color-mix(in srgb,var(--ink) 60%,var(--bg));--line:color-mix(in srgb,var(--ink) 12%,var(--bg));
--card:${ctx.dark ? "color-mix(in srgb,var(--ink) 6%,var(--bg))" : "#fff"};--soft:color-mix(in srgb,var(--pri) 14%,var(--bg));
--on:${ctx.onPri};--hf:${ctx.headCss};--bf:${ctx.bodyCss}}
*{box-sizing:border-box;margin:0;padding:0}
body{width:${WIDTH}px;background:#888;font-family:var(--bf);color:var(--ink)}
.shot{width:${WIDTH}px;background:var(--bg);overflow:hidden;margin-bottom:40px;max-height:720px}
h1,h2,h3,h4{font-family:var(--hf);color:var(--ink);letter-spacing:-.01em}
h2{font-size:40px;line-height:1.1;margin:10px 0 14px}
h4{font-size:19px}
.pad{padding:60px 72px}.c{text-align:center}.narrow{padding-left:220px;padding-right:220px}
.eb{display:block;font-size:13px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--pri)}
.sh{margin-bottom:34px}.sh.c .ln{margin:0 auto}
.ln{display:block;height:11px;border-radius:6px;background:var(--line);margin:9px 0}
.lead{font-size:22px;color:var(--mut);margin:8px 0 30px}
.btn{display:inline-flex;align-items:center;justify-content:center;padding:13px 24px;border-radius:999px;background:var(--pri);color:var(--on);font-weight:700;font-size:15px;white-space:nowrap}
.btn.sec{background:transparent;color:var(--ink);border:1.5px solid var(--line)}
.btn.ghost{background:transparent;color:var(--pri)}
.btn.inv{background:var(--bg);color:var(--ink)}
.btn.full{width:100%;margin-top:6px}
.badge{display:inline-block;padding:5px 12px;border-radius:999px;background:var(--soft);color:var(--pri);font-size:12px;font-weight:700}
.row{display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-top:22px}.row.c{justify-content:center}
.card{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:24px}
.ic{display:grid;place-items:center;width:46px;height:46px;border-radius:13px;background:var(--soft);color:var(--pri);font-size:18px;margin-bottom:16px}
.logo{display:flex;align-items:center;gap:10px;font-family:var(--hf);font-weight:800;font-size:21px;color:var(--ink)}
.logo i{width:26px;height:26px;border-radius:8px;background:linear-gradient(135deg,var(--pri),var(--acc))}
.nav{display:flex;align-items:center;gap:34px;padding:22px 72px;border-bottom:1px solid var(--line);background:var(--bg)}
.nav>span:not(.btn){font-size:15px;font-weight:500;color:var(--mut)}.nav .sp{flex:1}
.nav.sm{padding:14px 18px;gap:10px}.nav.sm .logo{font-size:14px}.nav.sm .logo i{width:16px;height:16px;border-radius:5px}
.burger{font-size:22px;color:var(--ink)!important}
.ghostpage{padding:44px 72px 40px;opacity:.55}.ghostpage .ln:first-child{height:34px;border-radius:10px;margin-bottom:22px}
.strip{background:var(--pri);color:var(--on);text-align:center;padding:12px 20px;font-size:15px;font-weight:600}
.logos{display:flex;justify-content:center;gap:48px;flex-wrap:wrap;font-family:var(--hf);font-weight:800;font-size:22px;color:var(--mut)}
.logos span{display:flex;align-items:center;gap:10px}.logos .ic{margin:0;width:34px;height:34px;filter:grayscale(1)}
.stats{display:grid;grid-template-columns:repeat(4,1fr);border:1px solid var(--line);border-radius:22px;background:var(--card)}
.stats div{padding:40px 28px;text-align:center;border-right:1px solid var(--line)}.stats div:last-child{border:0}
.stats strong{display:block;font-family:var(--hf);font-size:48px;color:var(--pri)}.stats span{color:var(--mut);font-size:15px}
.g2,.g3,.g4{display:grid;gap:20px}.g2{grid-template-columns:1fr 1fr}.g3{grid-template-columns:repeat(3,1fr)}.g4{grid-template-columns:repeat(4,1fr)}
.bento{display:grid;grid-template-columns:2fr 1fr 1fr;gap:18px}.bento .big{grid-row:span 2;background:var(--soft);border-color:transparent}
.bento .big h4{font-size:26px;margin-top:70px}
.split{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center}
.ph{position:relative;border-radius:14px;height:170px;overflow:hidden;background:linear-gradient(135deg,color-mix(in srgb,var(--pri) 55%,var(--bg)),color-mix(in srgb,var(--acc) 45%,var(--bg)))}
.ph1{background:linear-gradient(160deg,color-mix(in srgb,var(--acc) 55%,var(--bg)),color-mix(in srgb,var(--pri) 30%,var(--bg)))}
.ph2{background:linear-gradient(200deg,color-mix(in srgb,var(--pri) 35%,var(--bg)),color-mix(in srgb,var(--ink) 30%,var(--bg)))}
.ph3{background:linear-gradient(120deg,color-mix(in srgb,var(--ink) 25%,var(--bg)),color-mix(in srgb,var(--acc) 50%,var(--bg)))}
.ph span{position:absolute;width:55%;aspect-ratio:1;border-radius:50%;right:-10%;bottom:-25%;background:rgba(255,255,255,.22)}
.ph::after{content:"";position:absolute;left:12%;top:18%;width:22%;aspect-ratio:1;border-radius:50%;background:rgba(255,255,255,.28)}
.ph.tall{height:440px;border-radius:22px}.ph.wide{height:300px}.ph.portrait{height:200px;margin-bottom:14px}.ph.thumb{width:84px;height:84px;flex:none}.ph.big{height:380px}
.tile .ph{margin-bottom:16px}.tile h4{margin-top:6px}.tile small{display:block;margin-top:4px;color:var(--mut)}
.meta{display:flex;justify-content:space-between;align-items:center;margin-top:12px}.meta strong{font-size:18px}
.toggle{display:flex;justify-content:center;gap:6px;margin:-12px auto 30px;padding:6px;border-radius:999px;background:var(--card);border:1px solid var(--line);width:max-content}
.toggle span{padding:9px 20px;border-radius:999px;font-weight:600;font-size:14px;color:var(--mut)}.toggle .on{background:var(--pri);color:var(--on)}
.plan{text-align:left}.plan h4{font-size:18px;color:var(--mut)}.plan strong{display:block;font-family:var(--hf);font-size:44px;margin:10px 0 16px}.plan small{font-size:16px;color:var(--mut);font-weight:500}
.plan.hl{border:2px solid var(--pri);box-shadow:0 24px 50px color-mix(in srgb,var(--pri) 22%,transparent);transform:translateY(-10px)}.plan .btn{width:100%;margin-top:16px}.plan .badge{margin-bottom:10px}
.checks{list-style:none;display:grid;gap:10px;margin-top:8px}.checks li{font-size:15px;color:var(--mut)}.checks li::before{content:"✓";color:var(--pri);font-weight:800;margin-right:10px}
.checks.big li{font-size:18px;color:var(--ink)}
.faq{display:grid;gap:12px}.q{padding:20px 24px}.q h4{display:flex;justify-content:space-between;font-size:17px}.q b{color:var(--pri)}.q.open{border-color:var(--pri)}
.steps{display:flex;align-items:flex-start;gap:16px;text-align:center}.steps>div{flex:1}.steps .ln{margin:9px auto}
.num{display:grid;place-items:center;width:58px;height:58px;margin:0 auto 18px;border-radius:50%;background:var(--pri);color:var(--on);font-weight:800;font-size:22px}
.num.sm{width:32px;height:32px;font-size:14px;margin:0}
.arrow{flex:0 0 80px;height:2px;margin-top:29px;background:repeating-linear-gradient(90deg,var(--line) 0 8px,transparent 8px 14px)}
.quote .stars,.stars{color:#f5a524;letter-spacing:2px;font-size:17px;margin-bottom:12px}.stars small{color:var(--mut);letter-spacing:0;font-size:14px}
.who{display:flex;gap:12px;align-items:center;margin-top:20px}.who b{display:block;font-size:15px}.who small{color:var(--mut)}
.av{display:grid;place-items:center;width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,var(--pri),var(--acc));color:#fff;font-weight:700;font-size:14px;flex:none}
.person{text-align:center;padding:16px}.person b{display:block}.person small{color:var(--mut)}
.chips{display:flex;gap:8px;margin:-14px 0 20px;align-items:center}.chips span{padding:8px 16px;border-radius:999px;border:1px solid var(--line);font-size:14px;font-weight:600;color:var(--mut)}.chips .on{background:var(--ink);color:var(--bg);border-color:var(--ink)}
.chips .search{margin-left:auto;width:260px}
.search{display:inline-block;padding:11px 18px;border-radius:999px;border:1px solid var(--line);background:var(--card);color:var(--mut);font-size:14px}
.tbl{padding:0;overflow:hidden}.tr{display:grid;grid-template-columns:2fr 1.2fr 1fr 1fr;padding:16px 24px;border-top:1px solid var(--line);font-size:15px;color:var(--mut)}
.tr b{color:var(--ink)}.th{border:0;background:color-mix(in srgb,var(--ink) 4%,var(--card));font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:.06em}
.st{font-style:normal;padding:4px 12px;border-radius:999px;font-size:13px;font-weight:700}.s0{background:#dcfce7;color:#166534}.s1{background:#fef3c7;color:#92400e}.s2{background:#fee2e2;color:#991b1b}
.code{border-radius:18px;background:#0f172a;overflow:hidden;box-shadow:0 30px 60px rgba(0,0,0,.25)}.code .tabs{display:flex;gap:4px;padding:10px;background:#1e293b}
.code .tabs span{padding:7px 14px;border-radius:8px;color:#94a3b8;font-size:13px;font-weight:600}.code .tabs .on{background:#0f172a;color:#fff}
.code pre{padding:24px;color:#e2e8f0;font:15px/1.7 Consolas,monospace;white-space:pre}.k{color:#c084fc;font-weight:400}.s{color:#86efac;font-weight:400}.v{color:#7dd3fc;font-weight:400}.f{color:#fde68a;font-weight:400}
.appw{display:grid;grid-template-columns:230px 1fr;min-height:560px}.appw aside{padding:22px 16px;border-right:1px solid var(--line);background:var(--card);display:grid;align-content:start;gap:4px}
.appw aside .logo{margin:0 8px 22px;font-size:18px}.appw aside span{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:10px;font-size:14px;font-weight:600;color:var(--mut)}
.appw aside .ic{width:26px;height:26px;margin:0;font-size:11px;border-radius:7px}.appw aside .on{background:var(--soft);color:var(--pri)}
.appm{padding:26px 32px;display:grid;gap:20px;align-content:start}.appbar{display:flex;align-items:center;gap:14px}.appbar h3{flex:1;font-size:24px}.appbar .av{width:38px;height:38px}
.kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.kpis .card{padding:18px}.kpis span{font-size:13px;color:var(--mut)}.kpis strong{display:block;font-family:var(--hf);font-size:28px;margin:6px 0}
.kpis em{font-style:normal;font-size:13px;font-weight:700;color:#059669}.kpis .card:last-child em{color:#dc2626}
.chart{padding:18px;height:220px}.chart svg{width:100%;height:100%}
.player{position:relative}.play{position:absolute;left:50%;top:150px;transform:translate(-50%,-50%);display:grid;place-items:center;width:76px;height:76px;border-radius:50%;background:#fff;color:var(--pri);font-size:26px;box-shadow:0 10px 30px rgba(0,0,0,.25)}
.player .bar{height:6px;border-radius:6px;background:var(--line);margin-top:14px}.player .bar i{display:block;height:100%;border-radius:6px;background:var(--pri)}
.list{display:grid;gap:10px}.li{display:flex;align-items:center;gap:14px;padding:14px 18px}.li b{flex:1;font-size:15px}.li small{color:var(--mut)}
.map{position:relative;height:420px;border-radius:22px;border:1px solid var(--line);background:linear-gradient(var(--line) 1px,transparent 1px) 0 0/48px 48px,linear-gradient(90deg,var(--line) 1px,transparent 1px) 0 0/48px 48px,var(--soft)}
.map::before{content:"";position:absolute;inset:40% -10% auto -10%;height:26px;background:var(--card);transform:rotate(-12deg)}
.pin{position:absolute;left:46%;top:38%;font-size:40px;color:var(--pri);filter:drop-shadow(0 6px 8px rgba(0,0,0,.25))}.pin.p2{left:68%;top:62%;font-size:26px;color:var(--acc)}
.kv{display:flex;justify-content:space-between;gap:20px;padding:12px 0;border-bottom:1px solid var(--line);font-size:15px}.kv:last-child{border:0}.kv span{color:var(--mut)}
.split>div>.btn{margin-top:20px}
.count{display:flex;justify-content:center;gap:18px}.count .card{width:150px;padding:28px 10px}.count strong{display:block;font-family:var(--hf);font-size:56px;color:var(--pri)}.count span{color:var(--mut);font-size:14px;text-transform:uppercase;letter-spacing:.1em}
.form{display:grid;gap:14px;box-shadow:0 24px 60px color-mix(in srgb,var(--ink) 10%,transparent)}.form label{font-size:14px;font-weight:600}
.in{display:block;height:46px;border-radius:12px;border:1.5px solid var(--line);background:var(--bg);margin-top:6px}.in.ta{height:90px}
.in.light{display:inline-flex;align-items:center;width:340px;height:auto;padding:13px 20px;border-radius:999px;margin:0;color:var(--mut);font-size:15px;border-color:transparent}
.ctab{border-radius:28px;padding:64px;text-align:center;background:linear-gradient(135deg,var(--pri),color-mix(in srgb,var(--pri) 60%,var(--acc)))}.ctab h2{color:var(--on);font-size:44px}
.ctab .ln{margin:12px auto;background:color-mix(in srgb,var(--on) 35%,transparent)}
.auth{display:grid;place-items:center;background:var(--soft)}.authc{width:440px;display:grid;gap:14px;padding:36px}.authc h2{font-size:30px;margin:10px 0 0}.authc label{font-size:14px;font-weight:600}.lead.sm{font-size:15px;margin:0}.lead b{color:var(--pri)}
.or{display:flex;align-items:center;gap:12px;color:var(--mut);font-size:13px}.or i{flex:1;height:1px;background:var(--line)}
.sig{margin-top:22px;font-style:italic;color:var(--mut)}
.dish{display:flex;gap:16px;align-items:center;padding:14px}.dish>div{flex:1}.dish strong{color:var(--pri);font-size:18px}
.mas{display:grid;grid-template-columns:repeat(4,1fr);grid-auto-rows:150px;gap:14px}.mas .ph{height:auto}.m0{grid-row:span 2;grid-column:span 2}
.gal{display:grid;gap:12px}.thumbs{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.thumbs .ph{height:100px}
.price{display:block;font-family:var(--hf);font-size:36px;margin:12px 0}
.foot{background:color-mix(in srgb,var(--ink) 92%,var(--pri));color:color-mix(in srgb,var(--bg) 70%,transparent);padding:56px 72px 26px}
.foot .logo{color:var(--bg);margin-bottom:12px}.foot .ln{background:color-mix(in srgb,var(--bg) 20%,transparent)}
.fgrid{display:grid;grid-template-columns:1.6fr repeat(4,1fr);gap:36px}.fgrid b{display:block;color:var(--bg);margin-bottom:12px}
.soc{display:flex;gap:8px;margin-top:16px}.soc span{display:grid;place-items:center;width:34px;height:34px;border-radius:50%;border:1px solid color-mix(in srgb,var(--bg) 25%,transparent);font-size:12px;font-weight:700}
.fbot{display:flex;justify-content:space-between;margin-top:44px;padding-top:20px;border-top:1px solid color-mix(in srgb,var(--bg) 18%,transparent);font-size:14px}
.motion{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;text-align:left;margin-top:10px}.motion .card{position:relative}
.motion .card:first-child{opacity:.55;transform:translateY(22px)}.arrow-up{position:absolute;right:20px;top:18px;color:var(--pri);font-size:24px;font-weight:800}
.lift{transform:translateY(-12px);box-shadow:0 30px 50px color-mix(in srgb,var(--ink) 16%,transparent);border-color:var(--pri)}.cursor{position:absolute;width:34px;right:30px;bottom:-6px}
.note{margin-top:34px;color:var(--mut);font-size:15px}
.devs{display:flex;align-items:flex-end;justify-content:center;gap:28px;flex-wrap:wrap}
.dv{border:10px solid #1f2937;border-radius:18px;overflow:hidden;background:var(--bg)}.dv.desk{width:600px;height:380px}.dv.tab{width:250px;height:330px;border-radius:22px}.dv.phone{width:150px;height:300px;border-radius:26px;border-width:8px}
.mini .nav{gap:16px;padding:12px 18px}.mini .nav>span:not(.btn){font-size:11px}.mini .nav .btn{padding:7px 12px;font-size:11px}.mini .logo{font-size:14px}.mini .logo i{width:16px;height:16px}
.mh{padding:34px 26px;text-align:center}.mh h3{font-size:32px;margin-bottom:12px}.mh .ln{margin:8px auto}.mh .btn{margin-top:14px;padding:9px 16px;font-size:12px}
.tab .mh h3{font-size:24px}.phone .mh{padding:24px 12px}.phone .mh h3{font-size:18px}
.a11y{width:100%;display:flex;justify-content:center;gap:12px;margin-top:6px}.a11y span{padding:8px 16px;border-radius:999px;background:#dcfce7;color:#166534;font-weight:700;font-size:14px}
.serp{display:grid;gap:22px}.search.wide{display:block;font-size:16px;color:var(--ink)}.res small{color:#16a34a;font-size:14px}.res h4{color:#1a0dab;font-family:Arial,sans-serif;font-size:21px;font-weight:400;margin:4px 0}
.res p{font-size:14px;color:#4d5156;line-height:1.5;font-family:Arial,sans-serif}.dim{opacity:.5}
${ctx.dark ? ".serp{background:#fff;color:#202124}.serp .search{background:#fff;color:#202124;border-color:#dfe1e5}.serp .ln{background:#e8eaed}" : ""}
.scores{display:grid;grid-template-columns:1fr 1fr;gap:26px;justify-items:center}.scores div{text-align:center}.scores small{display:block;margin-top:10px;color:var(--mut);font-size:15px}
.ring{display:grid;place-items:center;width:110px;height:110px;border-radius:50%;border:8px solid #22c55e;font-size:32px;font-weight:800;color:#16a34a;background:#f0fdf4}
.win{border-radius:16px;overflow:hidden;border:1px solid var(--line);box-shadow:0 30px 60px color-mix(in srgb,var(--ink) 18%,transparent)}
.wbar{display:flex;gap:7px;align-items:center;padding:12px 16px;background:var(--card);border-bottom:1px solid var(--line)}.wbar i{width:11px;height:11px;border-radius:50%;background:var(--line)}
.wbar span{margin-left:14px;padding:6px 16px;border-radius:999px;background:var(--bg);font-size:13px;color:var(--mut);flex:1}
.dep{display:flex;gap:14px;align-items:center;margin-bottom:24px}.dep b{display:block}.dep small{color:var(--mut)}.dot{width:14px;height:14px;border-radius:50%;background:#22c55e;box-shadow:0 0 0 6px #bbf7d0}
.sg{display:grid;grid-template-columns:1fr 1fr;gap:56px}.sw{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:12px}
.sw b{display:block;height:90px;border-radius:14px;border:1px solid var(--line)}.sw em{display:block;font-style:normal;font-weight:700;font-size:13px;margin-top:8px}.sw code{font-size:12px;color:var(--mut)}
.type{display:flex;gap:24px;align-items:center;margin-top:12px}.aa{font-family:var(--hf);font-size:110px;line-height:1;color:var(--pri)}.t1{font-size:38px}.type h3{font-size:18px;margin:6px 0;color:var(--mut)}.type p{color:var(--mut)}
.sg .card{margin-top:12px}
`;
}

/* ---------------------------------------------------------------- per-prompt context */

function luminance(hex) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [n >> 16, (n >> 8) & 255, n & 255].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function context(prompt, plan) {
  const previewFile = [join(previewDir, `${prompt.slug}.html`), prompt.demo && join(root, "public", prompt.demo)].find((f) => f && existsSync(f));
  const preview = previewFile ? readFileSync(previewFile, "utf8") : "";
  const fontLinks = [...preview.matchAll(/<link[^>]+fonts\.googleapis\.com[^>]+>/g)].map((m) => m[0]).join("\n");
  const families = [...preview.matchAll(/font-family:\s*([^;}]+)/g)].map((m) => m[1].trim());
  const bodyCss = preview.match(/body\s*\{[^}]*font-family:\s*([^;}]+)/)?.[1]?.trim() || families[0] || "Inter, system-ui, sans-serif";
  const headCss =
    preview.match(/h1[^{]*\{[^}]*font-family:\s*([^;}]+)/)?.[1]?.trim() ||
    families.find((f) => f !== bodyCss && !/mono|cursive/i.test(f)) ||
    bodyCss;
  const name = (css) => css.split(",")[0].replace(/["']/g, "").trim();
  const nav = plan.find((s) => s.kind === "nav");
  const navLinks = ["Features", "Pricing", "About", "Contact"];
  return {
    brand: plan[0].brand,
    palette: prompt.palette,
    dark: prompt.tone === "dark",
    onPri: luminance(prompt.palette[2]) > 0.45 ? "#111111" : "#ffffff",
    fontLinks,
    headCss,
    bodyCss,
    headFont: name(headCss),
    bodyFont: name(bodyCss),
    navLinks: nav ? items(nav.detail || "", 4, navLinks, false) : navLinks,
    navCta: (nav && lastQuoted(nav.detail || "", "")) || "Get started",
    description: prompt.description,
    short: prompt.name,
  };
}

/* ---------------------------------------------------------------- DevTools driver */

async function startBrowser() {
  const profile = mkdtempSync(join(tmpdir(), "step-shots-"));
  const port = 9300 + Math.floor(Math.random() * 400);
  const proc = spawn(browser, ["--headless=new", "--disable-gpu", "--hide-scrollbars", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "about:blank"], { stdio: "ignore" });
  let target;
  for (let i = 0; i < 50 && !target; i++) {
    await new Promise((r) => setTimeout(r, 200));
    try {
      target = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === "page");
    } catch {}
  }
  if (!target) throw new Error("Could not connect to the browser");
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener("open", r, { once: true }));
  let id = 0;
  const pending = new Map();
  const listeners = [];
  ws.addEventListener("message", (e) => {
    const msg = JSON.parse(e.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve: ok, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? reject(new Error(msg.error.message)) : ok(msg.result);
    } else if (msg.method) listeners.forEach((fn) => fn(msg));
  });
  const send = (method, params = {}) =>
    new Promise((ok, reject) => {
      pending.set(++id, { resolve: ok, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  const close = () => {
    ws.close();
    proc.kill();
    setTimeout(() => rmSync(profile, { recursive: true, force: true }), 1500);
  };
  return { send, close, listeners };
}

/* ---------------------------------------------------------------- main */

const filter = process.argv[2];
const prompts = getAllPrompts().filter((p) => !filter || p.slug.includes(filter));
mkdirSync(outDir, { recursive: true });
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, "utf8")) : {};
const work = mkdtempSync(join(tmpdir(), "step-pages-"));
const cdp = await startBrowser();
await cdp.send("Page.enable");
await cdp.send("Emulation.setDeviceMetricsOverride", { width: WIDTH, height: 900, deviceScaleFactor: 1, mobile: false });

for (const prompt of prompts) {
  const plan = getBuildPlan(prompt);
  const ctx = context(prompt, plan);
  const shots = plan.filter((s) => s.kind !== "hero");
  const html = `<!doctype html><html><head><meta charset="utf-8">${ctx.fontLinks}<style>${styles(ctx)}</style></head><body>${shots
    .map((s) => `<div class="shot" id="s${s.number}">${render(s, ctx)}</div>`)
    .join("\n")}</body></html>`;
  const file = join(work, `${prompt.slug}.html`);
  writeFileSync(file, html);

  const loaded = new Promise((r) => {
    const fn = (m) => m.method === "Page.loadEventFired" && (cdp.listeners.splice(cdp.listeners.indexOf(fn), 1), r());
    cdp.listeners.push(fn);
  });
  await cdp.send("Page.navigate", { url: pathToFileURL(file).href });
  await loaded;
  await cdp.send("Runtime.evaluate", { expression: "document.fonts.ready.then(() => true)", awaitPromise: true });
  const { result } = await cdp.send("Runtime.evaluate", {
    expression: `JSON.stringify([...document.querySelectorAll('.shot')].map(e => { const r = e.getBoundingClientRect(); return [e.id, r.top + scrollY, r.height]; }))`,
    returnByValue: true,
  });
  const entry = {};
  for (const [id, top, height] of JSON.parse(result.value)) {
    const n = Number(id.slice(1));
    const h = Math.ceil(height);
    const { data } = await cdp.send("Page.captureScreenshot", {
      format: "webp",
      quality: 80,
      captureBeyondViewport: true,
      clip: { x: 0, y: top, width: WIDTH, height: h, scale: SCALE },
    });
    writeFileSync(join(outDir, `${prompt.slug}-${n}.webp`), Buffer.from(data, "base64"));
    entry[n] = [Math.round(WIDTH * SCALE), Math.round(h * SCALE)];
  }
  manifest[prompt.slug] = entry;
  console.log(`ok  ${prompt.slug}  ${Object.keys(entry).length} images`);
}

cdp.close();
rmSync(work, { recursive: true, force: true });
writeFileSync(manifestPath, JSON.stringify(manifest, null, 0).replace(/\},"/g, '},\n"') + "\n");
console.log(`manifest: ${Object.keys(manifest).length} prompts → lib/prompts/stepImages.json`);
