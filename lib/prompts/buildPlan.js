// Turns one website prompt into a step-by-step build plan: a sequence of smaller prompts that
// can be pasted into an AI coding tool one after another (setup → each section → extra pages →
// polish → SEO → deploy). Everything is derived from the prompt's own text and fields.

const isNext = (prompt) => /next\.js/i.test(prompt.stack);

// Paragraph that starts with a label, e.g. "Tech stack: …" or "Visual style: …"
function paragraph(text, label) {
  const re = new RegExp(`^${label}[^\\n]*:\\s*([\\s\\S]*?)(?=\\n\\s*\\n|$)`, "im");
  return (text.match(re)?.[1] || "").trim();
}

// The numbered list under "Sections, in order:" / "Layout:" / "Structure:" etc., keeping sub-bullets
function parseSections(text) {
  const lines = text.split("\n");
  const start = lines.findIndex((l) => /^\s*(sections?\b[^:]*|layout|structure|page structure|pages?)\s*:\s*$/i.test(l));
  if (start === -1) return [];
  const items = [];
  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i];
    const numbered = line.match(/^\s*(\d+)[.)]\s+(.*)$/);
    if (numbered) {
      items.push(numbered[2].trim());
    } else if (items.length && /^\s+\S/.test(line)) {
      items[items.length - 1] += "\n" + line.trim();
    } else if (items.length && line.trim() === "") {
      // a blank line followed by another numbered item keeps the list going
      if (!/^\s*\d+[.)]\s/.test(lines[i + 1] || "")) break;
    } else if (items.length) {
      break;
    }
  }
  return items;
}

// "Sticky navbar: logo, 4 links…" -> { title: "Sticky navbar", detail: "logo, 4 links…" }
function splitTitle(item) {
  const m = item.match(/^([^:.\n]{2,60})[:.]\s*([\s\S]+)$/);
  if (m) return { title: m[1].trim(), detail: m[2].trim() };
  const title = item.replace(/\.$/, "").split(/[,.]/)[0].slice(0, 60).trim();
  const rest = item.replace(/\.$/, "").trim();
  return { title, detail: rest === title ? "" : item };
}

// First sentence of a section brief, shortened for the step card
function summary(detail) {
  if (!detail) return "";
  const line = detail.split("\n")[0].replace(/^-\s*/, "");
  let first = line.split(/(?<=\.)\s/)[0].trim();
  // Don't stop inside a quotation such as "Look good. Feel better."
  if ((first.match(/"/g) || []).length % 2) first = line.trim();
  const text = first.length > 120 ? first.slice(0, first.lastIndexOf(" ", 117)) + "…" : first;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

const componentName = (title) =>
  title
    .replace(/\(.*?\)/g, "")
    .replace(/[^a-z0-9 ]/gi, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase())
    .join("") || "Section";

// Extra pages that turn a one-page site into a complete website/app, by industry
const EXTRA_PAGES = {
  SaaS: [
    ["Features page", "/features", "a detailed features page: a short hero, alternating image/text rows for 6 key features, an integrations grid and a closing CTA."],
    ["Pricing page", "/pricing", "a full pricing page: monthly/yearly toggle, the three plans from the home page, a detailed feature comparison table and a pricing FAQ."],
    ["Login and sign-up", "/login and /signup", "login and sign-up pages with email + password fields, a 'Continue with Google' button (UI only), client-side validation messages and links between the two pages. No real authentication yet — on submit, redirect to /app."],
    ["App dashboard", "/app", "a simple logged-in app area with a sidebar layout (Dashboard, Projects, Settings), a dashboard with 4 stat cards and a recent-activity list using realistic mock data from a local data file, and a Settings page with a profile form."],
  ],
  "AI / Tech": [
    ["Product / how it works page", "/product", "a page that explains the product in depth: architecture diagram (simple boxes and arrows in SVG), use cases, and a short code or API example."],
    ["Pricing page", "/pricing", "plans with usage limits, a comparison table and an FAQ."],
    ["Sign in and playground", "/login and /app", "a sign-in page (UI only, redirects to /app) and a playground screen with an input panel, a 'Run' button and an output panel that shows a mock response after a short loading state."],
  ],
  Portfolio: [
    ["Project case study page", "/projects/[slug]", "a reusable case-study page generated from a local projects data file: problem, my role, process, screenshots, results and tech used, with next/previous project links."],
    ["Blog", "/blog and /blog/[slug]", "a blog list page and an article page that renders posts from local Markdown or a data file, with reading time and date."],
    ["Contact page", "/contact", "a contact page with a validated form (name, email, message), social links and availability."],
  ],
  Agency: [
    ["Work / case study page", "/work/[slug]", "a case-study template from a local data file: client, challenge, approach, large visuals and results in numbers."],
    ["Services page", "/services", "one section per service with deliverables, process steps and a CTA."],
    ["Contact / brief page", "/contact", "a project brief form: budget range, timeline, services needed (checkboxes) and message, with validation."],
  ],
  "E-commerce": [
    ["Catalogue page", "/shop", "a product listing page with a filter sidebar (category, price range, colour), sort options, a product grid from a local data file and pagination."],
    ["Product page", "/product/[slug]", "a product detail page generated from the same data file, reusing the gallery, variant picker and add-to-cart components."],
    ["Cart", "/cart", "a cart page backed by React context + localStorage: line items, quantity steppers, remove, coupon field (UI only), subtotal, shipping and total."],
    ["Checkout and confirmation", "/checkout and /order/success", "a checkout form (contact, address, delivery option, payment method UI only) with validation, then an order confirmation page with an order summary."],
  ],
  Hospitality: [
    ["Menu / offerings page", "/menu", "a full menu or offerings page grouped by category with prices in ₹, dietary tags and a sticky category navigation."],
    ["Booking / reservation page", "/book", "a booking form with date, time, number of guests, name and phone, client-side validation and a confirmation screen (no real backend yet)."],
    ["About and gallery", "/about", "the story, team and a responsive photo gallery with a lightbox."],
  ],
  Fintech: [
    ["Security / trust page", "/security", "how the product keeps money and data safe: encryption, compliance badges, FAQs."],
    ["Pricing / fees page", "/pricing", "a clear fees table, plan comparison and FAQ."],
    ["Sign up and app home", "/signup and /app", "a sign-up flow (phone number + OTP screen, UI only) leading to an app home screen with balance card, recent transactions and a spending chart from mock data."],
  ],
  Health: [
    ["Services / doctors page", "/services", "services with descriptions and a doctors grid (photo, specialisation, experience)."],
    ["Appointment booking", "/book", "a multi-step booking form: choose service → choose doctor and slot → patient details → confirmation, with validation."],
    ["Patient portal", "/portal", "a simple patient dashboard with upcoming appointments, past visits and a profile page, using mock data."],
  ],
  Education: [
    ["Course catalogue", "/courses", "a course listing with search, category filters and course cards from a local data file."],
    ["Course detail page", "/courses/[slug]", "curriculum accordion, instructor, price in ₹, FAQs and an enrol button."],
    ["Student dashboard", "/login and /dashboard", "a login page (UI only) and a student dashboard with enrolled courses, progress bars and upcoming live classes."],
  ],
  "Real Estate": [
    ["Listings search page", "/listings", "a search results page with filters (city, budget, BHK, property type), sort, a results grid from a local data file and a map placeholder."],
    ["Property detail page", "/listings/[slug]", "a photo gallery, price, key facts, amenities, floor plan image, location map placeholder and an enquiry form."],
    ["Agent / contact page", "/contact", "agent profiles and a validated enquiry form."],
  ],
  Personal: [
    ["About page", "/about", "a longer story with photos and key details."],
    ["Contact / RSVP page", "/contact", "a validated form that matches the purpose of the site (contact, booking or RSVP) with a thank-you state."],
  ],
};

const SLUG_PAGES = {
  "admin-dashboard-prompt": [
    ["Orders page", "/orders", "a full orders table with search, status filter, sortable columns, pagination and an order detail drawer, using mock data."],
    ["Products page", "/products", "a products grid/table with an 'Add product' form in a modal and client-side validation."],
    ["Customers page", "/customers", "a customers table with a customer profile page showing order history."],
    ["Settings page", "/settings", "tabs for Profile, Store and Notifications with forms and toggles."],
  ],
  "salon-spa-website-prompt": [
    ["Services and prices page", "/services", "a full service menu grouped by category (Hair, Skin, Nails, Spa, Bridal) with duration, price in ₹ and a 'Book' button on every service."],
    ["Online booking", "/book", "a multi-step booking flow: choose service → choose stylist and time slot (mock availability) → name and phone → confirmation screen."],
    ["Gift cards", "/gift-cards", "gift card designs and amounts (₹1,000, ₹2,500, ₹5,000, custom), recipient details and a purchase form (UI only)."],
  ],
  "yoga-wellness-studio-prompt": [
    ["Full class schedule", "/schedule", "a weekly timetable with filters by style, level and teacher, and a 'Book' button on each class."],
    ["Class booking", "/book", "a booking form for a chosen class with name, phone, first-timer checkbox and a confirmation screen showing what to bring."],
    ["Member account", "/account", "a simple member dashboard with remaining classes in the pack, upcoming bookings and a cancel option, using mock data."],
  ],
  "preschool-kindergarten-prompt": [
    ["Admissions page", "/admissions", "the admission process as steps, documents required, important dates and the enquiry form."],
    ["Fees page", "/fees", "a clear fees table per program with term-wise payment schedule and what is included."],
    ["Gallery", "/gallery", "albums for school events (Annual day, Sports day, Diwali celebration) with a lightbox."],
    ["Parent portal", "/parents", "a parent dashboard with today's activities, attendance, notices and photos from class, using mock data."],
  ],
  "personal-blog-newsletter-prompt": [
    ["Article page", "/writing/[slug]", "an article page rendered from Markdown with title, date, reading time, table of contents, a subscribe box at the end and previous/next links."],
    ["Writing archive", "/writing", "all posts grouped by year with a topic filter and search."],
    ["About page", "/about", "a longer author story, what readers can expect from the newsletter, and contact details."],
  ],
};

// Which kind of mockup illustrates a step (used for the step preview images)
const KIND_RULES = [
  ["footer", /footer/],
  ["sidebar", /sidebar/],
  ["strip", /\b(strip|ribbon|marquee|urgent|alert|hotline|announcement)\b/],
  ["nav", /\b(nav|navbar|navigation|header|top bar)\b/],
  ["hero", /\b(hero|cover)\b/],
  ["countdown", /countdown/],
  ["menu", /\bservices menu\b/],
  ["logos", /\b(insurer|insurers|brands)\b/],
  ["steps", /\b(a day at|claim support)\b/],
  ["blog", /\b(posts?|essays?|articles?|archive)\b/],
  ["testimonials", /\b(client words|reader notes)\b/],
  ["team", /\b(teachers?|stylists?)\b/],
  ["pricing", /\b(packages?)\b/],
  ["story", /\bdining\b/],
  ["gallery", /\bfacilities\b/],
  ["features", /\bexperiences\b/],
  ["cta", /\bfor employers\b/],
  ["chart", /\b(chart|analytics|dashboard|radar|kpi)\b/],
  ["stats", /\b(stats?|metrics|track record|meter|numbers|milestones)\b/],
  ["logos", /\b(logos?|logo cloud|trusted|clients|backed|press|recognition|trust badges|trust bar|compatibility|integrations?|credentials|backers)\b/],
  ["code", /\b(code|sdk|developer|api|endpoints?|docs|documentation|sandbox|webhook|benchmark)\b/],
  ["pricing", /\b(pricing|plans?|membership|tiers?|tickets?|passes|subscription|fees|insurance)\b/],
  ["faq", /\b(faq|questions)\b/],
  ["steps", /\b(how it works|process|steps?|journey)\b/],
  ["testimonials", /\b(testimonials?|reviews?|stories|quotes|wall|alumni|community|results|proof|case studies|reflections|love)\b/],
  ["map", /\b(locations?|browse by city)\b/],
  ["steps", /\b(experience|timeline)\b/],
  ["team", /\b(team|faculty|trainers?|doctors?|clinicians|partners|speakers|instructors?|agents?|guests|headliners|veterinarians?|roster|founders?)\b/],
  ["table", /\b(table|comparison|timetable|schedule|agenda|pools|syllabus|curriculum|chapters|batches|swap)\b/],
  ["media", /\b(film|video|demo|player|playlist|episodes?)\b/],
  ["map", /\b(visit|location|map|venue|neighbou?rhood|flagship|directions)\b/],
  ["form", /\b(form|contact|reservation|booking|book|inquiry|inquiries|enquiry|rsvp|estimator|calculator|appointment|trial|donation|consultation|commission|search)\b/],
  ["cta", /\b(cta|call to action|download|newsletter|signup|sign-up|waitlist|subscribe|final)\b/],
  ["features", /\b(features?|capabilities|services|bento|pillars|specialties|amenities|programs|practice areas|benefits|perks|use cases|vectors|options|areas|why|skills)\b/],
  ["story", /\b(story|about|bio|philosophy|ethos|mission|craft|craftsmanship|statement|difference|privacy|security)\b/],
  ["menu", /\b(menu|counter|roasts|tasting)\b/],
  ["gallery", /\b(gallery|before|lookbook|instagram|works|work)\b/],
];

export function sectionKind(title, detail = "") {
  const t = title.toLowerCase();
  for (const [kind, re] of KIND_RULES) if (re.test(t)) return kind;
  const d = (detail || "").toLowerCase();
  if (/\btable\b/.test(d)) return "table";
  if (/form|field/.test(d)) return "form";
  return /card|grid/.test(d) ? "grid" : "features";
}

function pageKind(title, route) {
  const t = (title + " " + route).toLowerCase();
  if (/checkout/.test(t)) return "checkout";
  if (/cart/.test(t)) return "cart";
  if (/login|sign/.test(t)) return "auth";
  if (/\/app|dashboard|portal|playground|account/.test(t)) return "app";
  if (/pricing|fees/.test(t)) return "pricing";
  if (/services and prices/.test(t)) return "menu";
  if (/schedule/.test(t)) return "table";
  if (/article|archive|\/writing/.test(t)) return "blog";
  if (/admission/.test(t)) return "form";
  if (/booking|appointment|reservation|contact|brief|rsvp|\/book/.test(t)) return "form";
  if (/\[slug\]|detail|case study/.test(t)) return "detail";
  if (/catalogue|listing|shop|courses|search|orders|customers|products/.test(t)) return "listing";
  if (/blog/.test(t)) return "blog";
  if (/gallery/.test(t)) return "gallery";
  if (/about/.test(t)) return "story";
  if (/menu/.test(t)) return "menu";
  if (/settings/.test(t)) return "app";
  return "features";
}

// Single-file HTML projects stay single-page; give them optional extra sections instead
const isSingleFile = (prompt) => /html/i.test(prompt.stack) && !isNext(prompt);

export function getBuildPlan(prompt) {
  const text = prompt.prompt.split(/\nQuality bar:/)[0];
  const intro = text.trim().split(/\n\s*\n/)[0].trim();
  const stack = paragraph(text, "Tech stack") || prompt.stack;
  const style = paragraph(text, "Visual style");
  const behaviour = paragraph(text, "(?:Interactions|Behaviour|Behavior|Motion|Animations?)");
  const brand = text.match(/called "([^"]+)"/)?.[1] || prompt.name;
  const next = isNext(prompt);

  const parsed = parseSections(text);
  const sections = (parsed.length ? parsed : prompt.sections).map((item) => splitTitle(item));

  const recap = `Project recap: we are building ${brand} — ${prompt.description} Stack: ${prompt.stack}. Keep using the design system, colours, fonts and components we already created; do not rewrite earlier sections.`;

  const steps = [];

  // 1. Setup + design system
  steps.push({
    phase: "Setup",
    kind: "styleguide",
    title: "Set up the project and design system",
    outcome: next
      ? "A running Next.js app with colours, fonts and reusable UI components, ready for sections."
      : "A clean HTML file with CSS variables, fonts and base styles, ready for sections.",
    prompt: `${intro}

We will build this step by step. In this first step, ONLY set up the project and the design system — do not build any page sections yet.

Tech stack: ${stack}

Visual style: ${style || `use this colour palette: ${prompt.palette.join(", ")}.`}

Do the following:
${
  next
    ? `1. Give me the exact commands to create the project (npx create-next-app@latest with the App Router, JavaScript or TypeScript, Tailwind CSS, ESLint) and how to run it.
2. Set up the colour palette (${prompt.palette.join(", ")}) as Tailwind theme colours / CSS variables with clear names (background, text, primary, accent, muted, border).
3. Load the fonts with next/font and set the base typography scale (h1–h4, body, small).
4. Create reusable components in components/ui: Container, SectionHeading (eyebrow + title + subtitle), Button (primary, secondary, ghost; sizes), Card and Badge.
5. Create app/layout.js with the font, metadata placeholders and a <main> wrapper, and an app/page.js that shows a temporary list of the sections we will build: ${sections.map((s) => s.title).join(", ")}.
6. Show the final folder structure.`
    : `1. Create one index.html file with a <style> block and a <script> block at the end.
2. Define the colour palette (${prompt.palette.join(", ")}) as CSS custom properties on :root with clear names, plus spacing and radius variables.
3. Load at most two Google Fonts and set the base typography scale (h1–h4, body, small).
4. Add base styles: box-sizing reset, a .container class, .btn variants (primary, secondary), .card, and a .section spacing class.
5. Add empty, clearly commented placeholders for these sections in order: ${sections.map((s) => s.title).join(", ")}.`
}

Explain briefly what each file does. Keep the code clean and commented.`,
  });

  // 2. One step per section
  sections.forEach((section, i) => {
    const name = componentName(section.title);
    steps.push({
      phase: "Home page",
      kind: sectionKind(section.title, section.detail),
      detail: section.detail,
      title: section.title,
      outcome: summary(section.detail) || `The ${section.title} section, finished and responsive.`,
      prompt: `${recap}

Now build ONLY section ${i + 1} of ${sections.length}: ${section.title}.

Requirements:
${section.detail || `The ${section.title.toLowerCase()} for this brief: ${intro} Choose sensible content and layout for it and explain your choices in one or two lines.`}

${
  next
    ? `Create it as components/${name}.jsx (a Server Component unless it needs state or event handlers — then add "use client" and keep the interactive part as small as possible), and add it to app/page.js in position ${i + 1}.`
    : `Fill in the "${section.title}" placeholder in index.html. Put its CSS next to the other section styles and any JavaScript in the existing <script> block.`
}

Rules:
- Use only the existing design tokens and UI components; add new tokens only if truly needed and tell me.
- Mobile-first and responsive at 375px, 768px and 1200px+.
- Accessible: semantic elements, correct heading level (only the hero uses h1), alt text, keyboard focus styles, labels on any form fields.
- Realistic sample content for ${brand} (no lorem ipsum).
- Show me the complete code for every file you create or change.`,
    });
  });

  // 3. Interactions
  steps.push({
    phase: "Home page",
    kind: "motion",
    title: "Interactions and animation",
    outcome: "Hover states, scroll reveals and any interactive behaviour, without hurting performance.",
    prompt: `${recap}

All sections are built. Now add the interactions and animation layer.

${behaviour ? `Required behaviour:\n${behaviour}\n\n` : ""}Also:
- Subtle hover and focus states on every link, button and card.
- Elements fade and slide up slightly as they scroll into view (IntersectionObserver${next ? " in one small client component" : ""}); run each animation once.
- Smooth scrolling for in-page links, with an offset for the sticky header.
- Every animation must be disabled when the user has prefers-reduced-motion set.
- Do not add heavy animation libraries. Show the full code of each changed file.`,
  });

  // 4. Extra pages
  const extra = SLUG_PAGES[prompt.slug] || (isSingleFile(prompt) ? [] : EXTRA_PAGES[prompt.industry] || EXTRA_PAGES.Personal);
  extra.forEach(([title, route, detail]) => {
    steps.push({
      phase: "More pages",
      kind: pageKind(title, route),
      detail,
      title,
      outcome: `A new ${route} page that matches the rest of the site.`,
      prompt: `${recap}

The home page is finished. Now add ${detail}

Route: ${route}.
${
  next
    ? `- Move the Navbar and Footer into app/layout.js (if not already there) so every page shares them, and add a link to this page in the navigation.
- Put shared mock data in a lib/ or data/ file, not inside the component.
- Give the page its own metadata (title and description).`
    : `- Create it as a separate HTML file that reuses the same CSS (move shared styles to styles.css if needed) and link to it from the navigation.`
}
- Same design system and components, responsive and accessible as before.
- Show the full code for every new or changed file.`,
    });
  });

  if (isSingleFile(prompt)) {
    steps.push({
      phase: "More pages",
      kind: "grid",
      title: "Optional extra sections",
      outcome: "More content without leaving the single-file setup.",
      prompt: `${recap}

Suggest three extra sections that would make this page more useful for its visitors, explain why in one line each, then build the one I choose. Keep everything in the same single file, in the same style.`,
    });
  }

  // 5. Responsive + accessibility review
  steps.push({
    phase: "Polish and launch",
    kind: "devices",
    title: "Responsive and accessibility review",
    outcome: "A page that works on every screen size and with a keyboard or screen reader.",
    prompt: `${recap}

Review the whole ${next ? "site" : "page"} and fix problems. Go through it at 360px, 768px, 1024px and 1440px widths and check:
- No horizontal scrolling, nothing overlapping, text never cut off, tap targets at least 44px.
- One h1 per page and a logical heading order; landmarks (header, nav, main, footer).
- Every image has meaningful alt text (or empty alt if decorative); every form field has a label and error messages are announced.
- Everything works with the keyboard alone, focus is always visible, and menus/accordions/modals manage focus and close with Escape.
- Colour contrast of at least 4.5:1 for body text.
List each issue you found and the fix, then show the changed code.`,
  });

  // 6. SEO + performance
  steps.push({
    phase: "Polish and launch",
    kind: "seo",
    title: "SEO and performance",
    outcome: "Search-friendly metadata, social previews and fast loading.",
    prompt: `${recap}

Prepare the ${next ? "site" : "page"} for search engines and fast loading:
${
  next
    ? `- Metadata for every page (title, description, canonical, Open Graph and Twitter card) using the Metadata API, and a title template.
- app/sitemap.js and app/robots.js.
- JSON-LD structured data that fits ${brand} (Organization or LocalBusiness, plus FAQPage if there is an FAQ).
- Use next/image with correct sizes for every image, preload only the hero image, and lazy-load the rest.
- Make sure no component is a Client Component unless it needs to be.`
    : `- <title>, meta description, canonical, Open Graph and Twitter card tags.
- JSON-LD structured data that fits ${brand}.
- Width/height on every image, loading="lazy" below the fold, and compressed images.
- Defer non-critical JavaScript and inline only the critical CSS.`
}
Then tell me how to check the result with Lighthouse and what score to aim for.`,
  });

  // 7. Deploy
  steps.push({
    phase: "Polish and launch",
    kind: "launch",
    title: "Launch",
    outcome: "The website live on the internet with your own domain.",
    prompt: `${recap}

The ${next ? "site" : "page"} is ready. Walk me through launching it, step by step, for a beginner:
${
  next
    ? `1. Push the project to a new GitHub repository (exact git commands).
2. Deploy it on Vercel (free plan) from that repository.
3. Connect a custom domain and set up HTTPS.
4. Add any environment variables the project needs.`
    : `1. Deploy the files for free on Netlify (drag-and-drop) or GitHub Pages.
2. Connect a custom domain and set up HTTPS.`
}
5. Submit the sitemap to Google Search Console.
6. A final pre-launch checklist: replace all sample text, images, prices and contact details with real ones, test every link and form, and check it on a real phone.`,
  });

  return steps.map((step, index) => ({ ...step, brand, number: index + 1 }));
}
