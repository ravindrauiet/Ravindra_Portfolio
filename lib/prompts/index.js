// Website prompt library: complete, copy-paste prompts for building full pages with AI tools.

export const INDUSTRIES = [
  "SaaS",
  "AI / Tech",
  "Portfolio",
  "Agency",
  "E-commerce",
  "Hospitality",
  "Fintech",
  "Health",
  "Education",
  "Real Estate",
  "Personal",
];

// Shared closing block appended to every prompt so results are consistent and production-ready.
const QUALITY_BAR = `
Quality bar:
- Fully responsive: design mobile-first, then tablet (768px) and desktop (1200px).
- Accessible: semantic HTML landmarks, one h1, alt text on images, visible keyboard focus, colour contrast of at least 4.5:1 for body text.
- Fast: no heavy libraries, lazy-load images below the fold, system or two web fonts at most.
- Use placeholder images from a neutral source and realistic sample copy (no lorem ipsum).
- Respect prefers-reduced-motion for every animation.
- Keep the code clean and commented so I can edit it by hand.`;

const p = (data) => ({ ...data, prompt: data.prompt.trim() + "\n" + QUALITY_BAR });

export const prompts = [
  p({
    slug: "saas-landing-page-prompt",
    name: "SaaS Landing Page",
    industry: "SaaS",
    tone: "light",
    layout: "centered",
    palette: ["#ffffff", "#002057", "#2506ad", "#ff7b00"],
    stack: "Next.js (App Router) + Tailwind CSS",
    sections: ["Sticky navbar", "Hero with product screenshot", "Logo cloud", "Bento feature grid", "How it works (3 steps)", "Pricing (3 plans)", "Testimonials", "FAQ accordion", "CTA banner", "Footer"],
    description:
      "A complete, conversion-focused landing page for a B2B software product: hero, features, pricing, testimonials, FAQ and a final call to action.",
    prompt: `
Build a complete landing page for a B2B SaaS product called "Flowboard", a project-management tool for small teams.

Tech stack: Next.js (App Router) with Tailwind CSS. One page, split into components in a components/ folder. Server Components by default; add "use client" only where interactivity needs it.

Visual style: clean and modern on a white background. Navy (#002057) for headings, indigo (#2506ad) for primary buttons and links, orange (#ff7b00) as a sparing accent. Rounded 16px cards with a 1px light border, generous white space, a geometric sans-serif font such as Inter.

Sections, in order:
1. Sticky navbar: logo, 4 links, "Log in" text link and a "Start free" button. Collapses to a hamburger menu on mobile.
2. Hero: an announcement pill, a headline of at most 8 words, one supporting sentence, two buttons (primary "Start free trial", secondary "Watch demo"), and a large product screenshot placeholder with a soft shadow.
3. Logo cloud: "Trusted by teams at" with 6 greyscale company names.
4. Features: a bento grid with one large featured card and four smaller cards, each with an icon, title and one sentence.
5. How it works: three numbered steps in a row.
6. Pricing: three plans (Free, Pro, Team) in Indian rupees, the middle one highlighted as "Most popular", each with a feature checklist and button.
7. Testimonials: three customer quotes with name, role and company.
8. FAQ: six questions in an accessible accordion.
9. Final CTA banner with an email signup field.
10. Footer with four link columns and a copyright line.

Interactions: buttons lift slightly on hover; cards fade and slide up as they scroll into view.`,
    followUps: [
      "Add a monthly/yearly toggle to the pricing section that updates the prices and shows 'Save 20%'.",
      "Add a dark mode using CSS variables and a toggle in the navbar that remembers the choice.",
      "Connect the email signup to a Server Action that validates the email with Zod and returns a success or error message.",
      "Write SEO metadata (title, description, Open Graph) and FAQPage JSON-LD for this page.",
    ],
    tips: [
      "Replace 'Flowboard' and the one-line description with your own product before running the prompt.",
      "Generate one section at a time if the tool truncates long outputs.",
    ],
  }),
  p({
    slug: "developer-portfolio-prompt",
    name: "Developer Portfolio",
    industry: "Portfolio",
    tone: "dark",
    layout: "split",
    palette: ["#0b1020", "#ffffff", "#2506ad", "#ff7b00"],
    stack: "Next.js (App Router) + Tailwind CSS",
    sections: ["Navbar", "Hero with photo", "About", "Skills by category", "Featured projects", "Experience timeline", "Testimonials", "Contact form", "Footer"],
    description:
      "A professional personal portfolio for a software developer, with projects, skills, an experience timeline and a working contact form.",
    prompt: `
Build a personal portfolio website for a full stack developer.

About the person (replace with your own details): Ravindra Nath Jha, Team Lead and Full Stack Developer based in Faridabad, India, with 5+ years of experience in React, Next.js, Node.js, MongoDB, React Native and AWS.

Tech stack: Next.js (App Router) with Tailwind CSS. One page with anchor navigation, split into components.

Visual style: professional and restrained, dark theme. Background #0b1020, white headings, grey-blue body text, indigo (#2506ad) for buttons and orange (#ff7b00) for small accents only. Cards with a 1px translucent border and 16px radius. No cartoon illustrations and no rainbow gradients.

Sections, in order:
1. Navbar with the name as a text logo and links to each section, plus a "Hire me" button.
2. Hero: "Hi, I'm [Name]" with the role, a two-sentence summary, two buttons ("View my work", "Download resume"), social links, and a portrait photo placeholder in a rounded frame on the right. Stack on mobile with the photo first.
3. About: a short bio in two paragraphs and four quick facts (location, experience, availability, email).
4. Skills: four category cards (Frontend, Backend, Databases & Cloud, Mobile & Tools) each listing skills as small tags.
5. Featured projects: a 3-column grid of 6 project cards with screenshot placeholder, name, one-line description, tech tags and "Live demo" / "Source code" links.
6. Experience: a vertical timeline with three roles (company, title, dates, 2-3 achievement bullets). Mark the current role.
7. Testimonials: two quotes from colleagues or clients.
8. Contact: a form (name, email, message) with client-side validation and success/error states, next to direct email, phone and WhatsApp links.
9. Footer with quick links and copyright.

Interactions: smooth scrolling, active-section highlighting in the navbar, subtle fade-up on scroll.`,
    followUps: [
      "Add a /projects/[slug] case-study page template with problem, approach, result and screenshots.",
      "Make the contact form send email through a Next.js Route Handler using Nodemailer, with a honeypot field against spam.",
      "Add Person JSON-LD structured data and Open Graph tags.",
      "Add a blog section that reads MDX files from a content folder.",
    ],
    tips: [
      "Lead with outcomes in project descriptions ('cut load time by 40%') rather than a list of technologies.",
      "Three strong projects beat ten weak ones. Curate.",
    ],
  }),
  p({
    slug: "ai-startup-landing-page-prompt",
    name: "AI Startup Landing Page",
    industry: "AI / Tech",
    tone: "dark",
    layout: "centered",
    palette: ["#05060f", "#ffffff", "#7c3aed", "#06b6d4"],
    stack: "Next.js (App Router) + Tailwind CSS",
    sections: ["Navbar", "Hero with animated gradient", "Live demo input", "Capabilities grid", "Code example", "Use cases", "Pricing", "CTA", "Footer"],
    description:
      "A dark, cinematic landing page for an AI product or API, with an aurora background, an interactive demo area and a code sample for developers.",
    prompt: `
Build a landing page for an AI developer product called "Nimbus AI", an API that summarises and answers questions about documents.

Tech stack: Next.js (App Router) with Tailwind CSS, components in a components/ folder.

Visual style: dark and cinematic. Background near-black (#05060f). Accent colours violet (#7c3aed) and cyan (#06b6d4), used as soft glows rather than flat fills. Thin 1px translucent borders, glassy cards with backdrop blur, a monospace font for code and a clean sans-serif for everything else.

Sections, in order:
1. Transparent navbar that gains a blurred background after scrolling: logo, Docs, Pricing, Blog, and a "Get API key" button.
2. Hero: an animated aurora background made from two or three large blurred colour blobs drifting slowly (pure CSS). On top: a small "Now in public beta" pill, a large headline with one phrase in a violet-to-cyan gradient, a supporting sentence, and two buttons.
3. Demo: a mock chat panel showing a user question about a document and a streamed-looking answer (static content is fine), inside a glass card.
4. Capabilities: six cards in a 3x2 grid (for example: Summarise, Extract, Classify, Translate, Search, Cite sources), each with an icon and one sentence.
5. Developer section: a two-column block with a short explanation on the left and a syntax-highlighted code sample on the right, with tabs for cURL, Python and JavaScript and a copy button.
6. Use cases: three larger cards for Support, Research and Legal teams.
7. Pricing: usage-based, three tiers, clearly stating what counts as a request.
8. CTA: "Start building in 5 minutes" with a button.
9. Footer.

Interactions: a spotlight glow that follows the cursor in the hero; cards get a brighter border on hover; the code tabs switch without a page reload.`,
    followUps: [
      "Make the demo panel functional: send the question to a Route Handler that calls an LLM API and streams the reply.",
      "Add a /docs page layout with a left sidebar, content area and 'on this page' table of contents.",
      "Add a status badge in the footer that shows 'All systems operational'.",
    ],
    tips: [
      "Do not invent benchmark numbers or customer logos; use neutral placeholders until you have real ones.",
      "Heavy blur effects are GPU-intensive; ask for a simpler static gradient on small screens.",
    ],
  }),
  p({
    slug: "creative-agency-website-prompt",
    name: "Creative Agency Website",
    industry: "Agency",
    tone: "dark",
    layout: "split",
    palette: ["#0a0a0a", "#f5f5f0", "#ff7b00", "#3b3b3b"],
    stack: "Next.js (App Router) + Tailwind CSS",
    sections: ["Minimal navbar", "Oversized type hero", "Selected work grid", "Services list", "Process", "Team", "Client logos", "Contact CTA", "Footer"],
    description:
      "A bold, editorial website for a design or development agency, built around oversized typography and a large case-study grid.",
    prompt: `
Build a website home page for a small creative agency called "Studio North" that designs and builds websites for startups.

Tech stack: Next.js (App Router) with Tailwind CSS.

Visual style: bold and editorial. Near-black background (#0a0a0a), off-white text (#f5f5f0), one accent colour orange (#ff7b00). Very large headline type (up to 12vw on desktop) with tight letter-spacing, thin dividing lines, lots of empty space. Images have no rounded corners. Minimal UI chrome.

Sections, in order:
1. Minimal navbar: wordmark left, "Work, Services, About, Contact" right. On mobile, a full-screen overlay menu with large links.
2. Hero: an oversized two-line statement ("We build brands people remember."), a short paragraph and a round "Scroll" indicator.
3. Selected work: a 2-column grid of 6 case studies. Each is a large image placeholder with the client name, project type and year underneath. On hover the image scales slightly and an arrow appears.
4. Services: a numbered list (01-04) of services, each row showing the service name in large type and a short description that expands on hover or tap.
5. Process: four steps in a horizontal row (Discover, Design, Build, Launch) with a thin connecting line.
6. Team: four team members with square photos, names and roles.
7. Clients: a row of 8 client names in muted text.
8. Contact CTA: a huge "Let's talk" link with the email address below.
9. Footer: address, social links, copyright.

Interactions: text lines slide up into view on scroll; links have an underline that draws in from the left; a custom cursor is NOT needed.`,
    followUps: [
      "Add a /work/[slug] case-study page with a full-width hero image, project facts, long-form content and a 'next project' link.",
      "Add page transitions between the home page and case studies.",
      "Create a contact form page with budget and timeline select fields.",
    ],
    tips: [
      "This style depends on strong imagery. Swap the placeholders for real project screenshots early.",
      "Oversized type must still wrap well on phones; ask the tool to check 360px width.",
    ],
  }),
  p({
    slug: "restaurant-website-prompt",
    name: "Restaurant & Cafe Website",
    industry: "Hospitality",
    tone: "light",
    layout: "centered",
    palette: ["#fffaf3", "#3b2a20", "#b45309", "#166534"],
    stack: "HTML, CSS and a little vanilla JavaScript",
    sections: ["Navbar with Book a table", "Full-width photo hero", "Our story", "Menu with tabs", "Gallery", "Reviews", "Reservation form", "Location and hours", "Footer"],
    description:
      "A warm, appetising website for a restaurant or cafe, with a tabbed menu, photo gallery, reservation form and opening hours.",
    prompt: `
Build a one-page website for a restaurant called "Saffron Table", a modern Indian restaurant in Delhi.

Tech stack: plain HTML, CSS and a small amount of vanilla JavaScript in a single file (no frameworks), so it can be hosted anywhere.

Visual style: warm and inviting. Cream background (#fffaf3), deep brown text (#3b2a20), saffron-amber accent (#b45309) and a touch of green (#166534). An elegant serif font for headings and a clean sans-serif for body text. Photos with slightly rounded corners.

Sections, in order:
1. Navbar: restaurant name, links (Menu, Gallery, Reviews, Contact) and a "Book a table" button. Mobile hamburger menu.
2. Hero: a full-width food photo with a dark overlay, the restaurant name, a one-line tagline and two buttons ("View menu", "Book a table").
3. Our story: two columns, a short paragraph about the chef and a photo.
4. Menu: tabs for Starters, Mains, Breads, Desserts and Drinks. Each tab shows 6 dishes with name, short description, price in rupees, and small "veg" (green dot) or "non-veg" (red dot) indicators.
5. Gallery: a responsive masonry-style grid of 8 photos.
6. Reviews: three customer reviews with star ratings and names.
7. Reservation: a form with name, phone, date, time, number of guests and special requests, with validation messages.
8. Visit us: address, phone, opening hours table (highlight today's row with JavaScript) and an embedded map placeholder.
9. Footer with social links.

Interactions: the menu tabs switch without reloading; smooth scroll to sections; the navbar gets a solid background after scrolling past the hero.`,
    followUps: [
      "Add a 'Order on WhatsApp' button that opens WhatsApp with a pre-filled message.",
      "Add Restaurant JSON-LD structured data with address, opening hours, cuisine and price range.",
      "Add a Hindi/English language toggle for the menu.",
    ],
    tips: [
      "Use your real menu and prices; outdated menus are the most common complaint about restaurant sites.",
      "Compress photos before uploading. Food photography is heavy and slow sites lose bookings.",
    ],
  }),
  p({
    slug: "ecommerce-product-page-prompt",
    name: "E-commerce Product Page",
    industry: "E-commerce",
    tone: "light",
    layout: "product",
    palette: ["#ffffff", "#111827", "#2506ad", "#f59e0b"],
    stack: "Next.js (App Router) + Tailwind CSS",
    sections: ["Header with cart", "Breadcrumbs", "Image gallery", "Product info and variants", "Add to cart", "Tabs: description, specs, reviews", "Related products", "Footer"],
    description:
      "A complete product detail page with an image gallery, variant selectors, quantity control, reviews and related products.",
    prompt: `
Build a product detail page for an online store selling premium headphones. Product: "Aura Pro Wireless Headphones", ₹12,999 (MRP ₹15,999).

Tech stack: Next.js (App Router) with Tailwind CSS. The page is a Server Component; the gallery, variant picker and add-to-cart control are small Client Components.

Visual style: clean retail. White background, near-black text (#111827), indigo (#2506ad) for the primary button, amber (#f59e0b) for star ratings. Plenty of white space around product images.

Layout:
1. Header: logo, search field, account icon and a cart icon with an item-count badge.
2. Breadcrumbs: Home / Audio / Headphones / Aura Pro.
3. Main area, two columns on desktop:
   - Left: image gallery with one large image and four thumbnails; clicking a thumbnail swaps the main image. Swipeable on mobile.
   - Right: product name, star rating with review count, price with the MRP struck through and the percentage saved, a short description, a colour selector (three swatches), a quantity stepper, "Add to cart" and "Buy now" buttons, and delivery info (free delivery, 7-day returns, 1-year warranty) with icons. Show a pincode field to check delivery.
4. Tabs below: Description, Specifications (a two-column table) and Reviews (rating breakdown bars plus three sample reviews).
5. "You may also like": four related product cards.
6. Footer.

Behaviour: selecting a colour updates the selected state and the main image; the quantity stepper cannot go below 1; "Add to cart" shows a brief confirmation and increments the cart badge (client-side state is fine).`,
    followUps: [
      "Add Product JSON-LD structured data with price, availability and aggregate rating.",
      "Build the cart drawer that slides in from the right with line items and a subtotal.",
      "Make the mobile layout show a sticky 'Add to cart' bar at the bottom of the screen.",
      "Add an image zoom on hover for desktop.",
    ],
    tips: [
      "Show the final price including taxes and the delivery estimate early; hidden costs cause cart abandonment.",
      "Only display ratings and reviews that are real.",
    ],
  }),
  p({
    slug: "fintech-app-landing-page-prompt",
    name: "Fintech App Landing Page",
    industry: "Fintech",
    tone: "dark",
    layout: "split",
    palette: ["#022c22", "#ecfdf5", "#34d399", "#fbbf24"],
    stack: "Next.js (App Router) + Tailwind CSS",
    sections: ["Navbar", "Hero with phone mockup", "Trust bar", "Feature rows", "Security section", "How it works", "App download CTA", "FAQ", "Footer with disclosures"],
    description:
      "A trustworthy landing page for a personal-finance or payments app, with a phone mockup, security messaging and app-store calls to action.",
    prompt: `
Build a landing page for a personal finance mobile app called "Paisa", which helps users track spending and save automatically.

Tech stack: Next.js (App Router) with Tailwind CSS.

Visual style: calm and trustworthy. Deep green background (#022c22) with mint text (#ecfdf5), emerald (#34d399) for primary actions and a small amount of gold (#fbbf24) for highlights. Rounded 20px cards, clear hierarchy, no flashy effects - finance users value clarity.

Sections, in order:
1. Navbar: logo, Features, Security, FAQ, and a "Download app" button.
2. Hero, two columns: headline ("Know where every rupee goes"), one sentence, App Store and Google Play buttons, and a rating line. On the right, a CSS-drawn phone mockup showing a balance, a small spending chart and three recent transactions.
3. Trust bar: three short statements with icons (bank-grade encryption, regulated partner bank, no hidden fees).
4. Features: three alternating image-and-text rows (Track spending automatically, Set savings goals, Split bills with friends), each with a mini UI illustration built from HTML/CSS.
5. Security: a focused section explaining how data is protected, with four points in a 2x2 grid.
6. How it works: three steps (Download, Link your account, Start saving).
7. Download CTA: a large rounded panel with the app buttons and a QR-code placeholder.
8. FAQ: six questions, including fees and data privacy.
9. Footer with legal links and a clearly worded regulatory disclosure placeholder.

Interactions: numbers in the phone mockup count up when it scrolls into view; feature rows fade in.`,
    followUps: [
      "Add a savings calculator: sliders for monthly amount and years that show the projected total.",
      "Add a comparison table versus spreadsheets and traditional bank apps.",
      "Create a /security page that expands on encryption, data handling and compliance.",
    ],
    tips: [
      "Financial claims must be accurate and compliant. Replace every placeholder disclosure with wording approved for your product.",
      "Avoid promising returns. Describe features, not outcomes.",
    ],
  }),
  p({
    slug: "fitness-gym-website-prompt",
    name: "Fitness & Gym Website",
    industry: "Health",
    tone: "dark",
    layout: "centered",
    palette: ["#0c0c0c", "#ffffff", "#e11d48", "#facc15"],
    stack: "HTML, CSS and a little vanilla JavaScript",
    sections: ["Navbar", "Bold hero", "Programs", "Class timetable", "Trainers", "Membership plans", "Transformation stories", "Free trial form", "Footer"],
    description:
      "A high-energy website for a gym or fitness studio, with programs, a class timetable, trainers and membership plans.",
    prompt: `
Build a one-page website for a gym called "Iron Pulse Fitness" in Bengaluru.

Tech stack: plain HTML, CSS and vanilla JavaScript in one file.

Visual style: bold and energetic. Black background (#0c0c0c), white text, strong red accent (#e11d48) and small yellow highlights (#facc15). Heavy condensed uppercase headings, large photos with dark overlays, angular shapes rather than soft rounded ones.

Sections, in order:
1. Navbar: logo, links, and a "Free trial" button.
2. Hero: a full-screen photo with a dark gradient overlay, a three-word uppercase headline, a supporting line and two buttons ("Start free trial", "View plans").
3. Programs: four cards (Strength, Cardio, Yoga, CrossFit) with a photo, title and one line; the card lifts and shows a red underline on hover.
4. Timetable: a weekly class schedule as a responsive table (days as columns, time slots as rows). On mobile it becomes a day selector with a list for the chosen day.
5. Trainers: four trainer cards with photo, name, speciality and years of experience.
6. Membership: three plans (Monthly, Quarterly, Annual) in rupees, with the annual plan marked "Best value".
7. Results: three member stories with a quote and what they achieved.
8. Free trial form: name, phone, preferred time and goal (select). Validate the phone number.
9. Footer: address, timings, phone, social links.

Interactions: the timetable day selector works without reloading; counters (members, trainers, classes per week) animate when scrolled into view.`,
    followUps: [
      "Add a BMI calculator widget with height and weight inputs.",
      "Add a WhatsApp chat button fixed to the bottom-right corner.",
      "Add LocalBusiness JSON-LD with opening hours and location.",
    ],
    tips: [
      "Use real member results only with written permission.",
      "List actual prices; 'call for pricing' loses most visitors.",
    ],
  }),
  p({
    slug: "coaching-institute-website-prompt",
    name: "Coaching Institute & Online Course",
    industry: "Education",
    tone: "light",
    layout: "centered",
    palette: ["#f8fafc", "#0f172a", "#2563eb", "#f97316"],
    stack: "Next.js (App Router) + Tailwind CSS",
    sections: ["Navbar", "Hero with enquiry form", "Results and stats", "Courses grid", "Why choose us", "Faculty", "Student testimonials", "Batch schedule", "FAQ", "Footer"],
    description:
      "A lead-generating website for a coaching institute or online course, with an enquiry form in the hero, course cards, faculty profiles and batch schedules.",
    prompt: `
Build a website home page for a coaching institute called "CodeCraft Academy" that teaches full stack web development to college students and working professionals in India.

Tech stack: Next.js (App Router) with Tailwind CSS.

Visual style: bright, friendly and credible. Light background (#f8fafc), dark slate text (#0f172a), blue (#2563eb) for primary actions and orange (#f97316) for highlights. Rounded 16px cards, clear headings, approachable illustrations made from simple shapes.

Sections, in order:
1. Navbar: logo, Courses, Faculty, Results, Contact, and a "Book a free demo class" button.
2. Hero, two columns: on the left a headline ("Become a job-ready developer in 6 months"), three bullet benefits with check icons and a rating line; on the right an enquiry form card (name, phone, course select, "Book free demo" button).
3. Stats bar: students trained, placement partners, average rating, years running.
4. Courses: six course cards (for example React, Node.js, Full Stack MERN, Python, Data Structures, AI Engineering), each showing duration, mode (online/offline), fee in rupees, next batch date and an "Enquire" button.
5. Why choose us: six benefit tiles (live classes, projects, doubt support, mock interviews, placement help, recordings).
6. Faculty: three instructor cards with photo, experience and companies worked at.
7. Testimonials: student quotes with the company they joined.
8. Upcoming batches: a table of course, start date, timing and seats left.
9. FAQ: fees, EMI options, refund policy, prerequisites, certificates.
10. Footer with address, phone, email and social links.

Interactions: the course select in the hero pre-fills when a course card's "Enquire" button is clicked and the page scrolls to the form.`,
    followUps: [
      "Add a /courses/[slug] page with syllabus accordion, fee breakdown and an enrol button.",
      "Send the enquiry form to a Route Handler that emails the institute and shows a thank-you message.",
      "Add Course JSON-LD structured data for each course.",
      "Add a free 'lecture notes' section that links to tutorial pages for SEO.",
    ],
    tips: [
      "Placement and salary claims must be verifiable. Show real numbers with the year, or leave them out.",
      "Put the phone number in the navbar; many students prefer to call.",
    ],
  }),
  p({
    slug: "real-estate-listing-website-prompt",
    name: "Real Estate Listing Website",
    industry: "Real Estate",
    tone: "light",
    layout: "product",
    palette: ["#ffffff", "#0f172a", "#0f766e", "#f59e0b"],
    stack: "Next.js (App Router) + Tailwind CSS",
    sections: ["Navbar", "Search hero", "Featured properties", "Browse by city", "Why us", "How it works", "Agent CTA", "Testimonials", "Footer"],
    description:
      "A property search home page with a filterable search bar, property cards, city browsing and a lead form for agents.",
    prompt: `
Build the home page for a real estate platform called "NestFinder" that lists apartments and houses for sale and rent in Indian cities.

Tech stack: Next.js (App Router) with Tailwind CSS.

Visual style: clean and trustworthy. White background, dark slate text (#0f172a), teal (#0f766e) for primary actions and amber (#f59e0b) for badges. Large property photos, rounded 16px cards, clear price typography.

Sections, in order:
1. Navbar: logo, Buy, Rent, New Projects, Agents, and "List your property" button.
2. Search hero: a city skyline photo with an overlay, a headline, and a search card with tabs for Buy / Rent, a city select, a property type select (Apartment, Villa, Plot), a budget range select and a Search button.
3. Featured properties: a grid of six property cards. Each card shows a photo with a "For sale" or "For rent" badge and a save (heart) button, the price in rupees (use lakh/crore formatting), title, locality, and a row of facts (bedrooms, bathrooms, area in sq ft).
4. Browse by city: six city tiles (Delhi NCR, Mumbai, Bengaluru, Pune, Hyderabad, Chennai) with photo and number of listings.
5. Why us: four benefits (verified listings, no hidden charges, legal assistance, home loans).
6. How it works: three steps.
7. Agent CTA: a banner inviting agents to list properties, with a short lead form (name, phone, city).
8. Testimonials: three buyer stories.
9. Footer with city links (good for SEO), company links and contact details.

Behaviour: the Buy/Rent tabs change the budget options; the heart button toggles a saved state; property cards link to /property/[id].`,
    followUps: [
      "Build the /search results page with a filter sidebar, sort dropdown, result cards and pagination driven by URL search params.",
      "Build the /property/[id] page with a photo gallery, facts, amenities, map placeholder, EMI calculator and an enquiry form.",
      "Add an EMI calculator component with loan amount, interest rate and tenure sliders.",
      "Add RealEstateListing JSON-LD structured data to property pages.",
    ],
    tips: [
      "Format Indian prices the way buyers read them: ₹85 Lakh, ₹1.2 Cr.",
      "Keep filters in the URL so searches can be shared and indexed.",
    ],
  }),
  p({
    slug: "admin-dashboard-prompt",
    name: "Admin Dashboard",
    industry: "SaaS",
    tone: "light",
    layout: "dashboard",
    palette: ["#f6f7fb", "#0f172a", "#2506ad", "#10b981"],
    stack: "Next.js (App Router) + Tailwind CSS",
    sections: ["Collapsible sidebar", "Top bar with search", "KPI cards", "Revenue chart", "Recent orders table", "Activity feed", "Top products"],
    description:
      "A clean analytics dashboard layout with a collapsible sidebar, KPI cards, charts and a sortable data table.",
    prompt: `
Build an admin dashboard home screen for an e-commerce business.

Tech stack: Next.js (App Router) with Tailwind CSS. Use a shared layout for the sidebar and top bar so other dashboard pages can reuse it. Charts can be drawn with inline SVG - do not add a charting library.

Visual style: calm and data-dense but readable. Light grey app background (#f6f7fb), white cards with a 1px border and 14px radius, dark slate text (#0f172a), indigo (#2506ad) for active states and green (#10b981) / red for positive and negative changes. Numbers use tabular figures.

Layout:
1. Sidebar (240px, collapsible to 72px icons-only): logo, navigation groups (Dashboard, Orders, Products, Customers, Analytics, Settings) with icons, the active item highlighted, and a user profile block at the bottom. On mobile it becomes an off-canvas drawer.
2. Top bar: page title, search field, a notifications bell with a badge, and a user avatar menu.
3. KPI row: four cards (Revenue, Orders, Customers, Conversion rate), each with the value, the percentage change versus last month with an up/down arrow, and a tiny sparkline.
4. Main chart: revenue over the last 12 months as an SVG area chart with axis labels and a "This year / Last year" legend.
5. Two columns below:
   - Recent orders table: order ID, customer, date, amount in rupees, status badge (Paid, Pending, Refunded) and an actions menu. Column headers are sortable.
   - Activity feed: a timeline of recent events.
6. Top products: a list of five products with a thumbnail, units sold and a progress bar.

Behaviour: the sidebar collapse state persists in localStorage; clicking a table header sorts by that column; the date-range select in the top right (7 days, 30 days, 12 months) updates the KPI numbers (use sample data).`,
    followUps: [
      "Add a dark theme driven by CSS variables with a toggle in the top bar.",
      "Build the Orders page with filters, pagination and a row-detail drawer.",
      "Replace the sample data with data fetched in Server Components and add loading skeletons with Suspense.",
      "Add role-based navigation so 'Settings' only appears for admins.",
    ],
    tips: [
      "Dashboards should answer questions. Put the one number that matters most in the top-left.",
      "Do not rely on colour alone for status; pair it with text or an icon.",
    ],
  }),
  p({
    slug: "link-in-bio-page-prompt",
    name: "Link-in-Bio Page",
    industry: "Personal",
    tone: "light",
    layout: "bio",
    palette: ["#fff7ed", "#1c1917", "#ea580c", "#2506ad"],
    stack: "Single HTML file with CSS",
    sections: ["Avatar and bio", "Social icons", "Link buttons", "Featured content card", "Newsletter signup", "Footer"],
    description:
      "A fast, single-file link-in-bio page for creators and freelancers: avatar, short bio, stacked link buttons and social icons.",
    prompt: `
Build a "link in bio" page for a content creator, as a single self-contained HTML file with inline CSS and no JavaScript frameworks.

Person (replace with your own): "Priya Verma", a UI designer and YouTuber who teaches design to beginners.

Visual style: warm and friendly. Soft peach background (#fff7ed), near-black text (#1c1917), orange (#ea580c) for the primary link and indigo (#2506ad) for accents. A single centred column, max-width 480px, generous spacing, large touch targets.

Content, top to bottom:
1. Circular avatar (placeholder image) with a thin ring, name, a one-line bio and a location line.
2. A row of social icon links (YouTube, Instagram, LinkedIn, X) as inline SVGs with accessible labels.
3. A stack of 6 full-width link buttons, each with an emoji or icon, a title and an optional small subtitle. The first one is highlighted as the primary link ("Watch my latest video"). Buttons have 14px radius, a 1px border, and lift slightly with a shadow on hover and focus.
4. A featured content card with a thumbnail, title and short description.
5. A compact newsletter signup (email field and button).
6. A small footer line: "Made with HTML and CSS".

Requirements: the whole page must weigh very little and load instantly; use system fonts; each link button must be at least 52px tall; include Open Graph meta tags so the page previews nicely when shared.`,
    followUps: [
      "Add a light/dark theme toggle that respects the system preference.",
      "Add a subtle staggered fade-in animation for the link buttons on page load.",
      "Convert it to a Next.js page where the links come from a JSON file.",
      "Add click tracking using a privacy-friendly analytics snippet.",
    ],
    tips: [
      "Put your single most important link first. Most visitors only tap one.",
      "Keep it to 5-7 links; long lists reduce clicks on everything.",
    ],
  }),
  p({
    slug: "travel-agency-website-prompt",
    name: "Travel Agency Website",
    industry: "Hospitality",
    tone: "light",
    layout: "centered",
    palette: ["#f0f9ff", "#0c4a6e", "#0891b2", "#f97316"],
    stack: "Next.js (App Router) + Tailwind CSS",
    sections: ["Navbar", "Hero with trip search", "Popular destinations", "Tour packages", "Why book with us", "Traveller stories", "Newsletter", "Footer"],
    description:
      "An inspiring travel website with a trip search bar, destination cards, tour packages with pricing and traveller reviews.",
    prompt: `
Build a home page for a travel agency called "Wander India" that sells holiday packages within India and to nearby countries.

Tech stack: Next.js (App Router) with Tailwind CSS.

Visual style: bright, airy and aspirational. Sky-tinted background (#f0f9ff), deep blue text (#0c4a6e), teal (#0891b2) for actions and orange (#f97316) for offers. Large landscape photography, rounded 20px image cards, friendly sans-serif type.

Sections, in order:
1. Transparent navbar over the hero: logo, Destinations, Packages, About, Contact, and a phone number.
2. Hero: a full-width landscape photo, a headline ("Find your next escape"), and a search card with destination, travel month, number of travellers and a Search button.
3. Popular destinations: a horizontally scrollable row of eight destination cards (Goa, Kerala, Ladakh, Rajasthan, Kashmir, Andaman, Bali, Dubai), each with a photo, name and "from ₹X".
4. Tour packages: six package cards with photo, title, duration (for example 5 days / 4 nights), a list of three inclusions with icons, rating, price per person in rupees with the original price struck through, and a "View details" button.
5. Why book with us: four benefits (best price, 24x7 support, verified hotels, easy cancellation).
6. Traveller stories: three reviews with a photo, destination and rating.
7. Newsletter: "Get travel deals in your inbox" with an email field.
8. Footer with destination links, policies and contact details.

Interactions: destination cards zoom the photo slightly on hover; the destinations row can be scrolled with arrow buttons on desktop and by swiping on mobile.`,
    followUps: [
      "Build a /packages/[slug] page with a day-by-day itinerary accordion, inclusions and exclusions, a photo gallery and a booking enquiry form.",
      "Add a 'Plan my trip' multi-step form (destination, dates, budget, contact).",
      "Add TouristTrip JSON-LD structured data for each package.",
    ],
    tips: [
      "Show what is included and excluded clearly; surprises damage trust.",
      "Use photos you are licensed to use, ideally your own.",
    ],
  }),
  p({
    slug: "wedding-invitation-website-prompt",
    name: "Wedding Invitation Website",
    industry: "Personal",
    tone: "light",
    layout: "bio",
    palette: ["#fffbf5", "#4a1d24", "#be123c", "#b8860b"],
    stack: "Single HTML file with CSS and vanilla JavaScript",
    sections: ["Cover with names", "Countdown timer", "Our story", "Events schedule", "Venue and map", "Gallery", "RSVP form", "Footer"],
    description:
      "An elegant single-page digital wedding invitation with a countdown, event schedule, venue details, photo gallery and RSVP form.",
    prompt: `
Build a digital wedding invitation as a single HTML file with inline CSS and a little vanilla JavaScript.

Couple (replace with your own): Aarav and Meera, getting married on 14 February 2027 in Jaipur.

Visual style: elegant and festive. Ivory background (#fffbf5), deep maroon text (#4a1d24), rose (#be123c) and antique gold (#b8860b) accents. An ornamental serif or script font for names and headings, a clean serif for body text. Thin gold dividers and a subtle floral or paisley corner motif drawn with CSS or inline SVG.

Sections, in order:
1. Cover: "Together with their families", the couple's names in large script type, the date and city, and a "Scroll to continue" hint.
2. Countdown: days, hours, minutes and seconds until the wedding date, updating every second.
3. Our story: a short paragraph and a photo placeholder in an arched frame.
4. Events: a vertical timeline of ceremonies (Mehendi, Sangeet, Haldi, Wedding, Reception), each with date, time, venue and dress code.
5. Venue: the venue name, address, a map placeholder and an "Open in Maps" button.
6. Gallery: six photos in a responsive grid with a gentle hover zoom.
7. RSVP: a form with name, number of guests, attending yes/no and a message, plus a "Reply on WhatsApp" button that opens WhatsApp with a pre-filled message.
8. Footer: a thank-you line and a hashtag.

Requirements: mobile-first (most guests will open it on a phone from WhatsApp), light enough to load on slow connections, and with Open Graph tags so the link shows a nice preview card when shared.`,
    followUps: [
      "Add soft background music with a visible play/pause button (never autoplay with sound).",
      "Add a Hindi version and a language toggle.",
      "Add an 'Add to calendar' button that downloads an .ics file for the wedding day.",
      "Add falling petal animation in the cover section that stops for reduced-motion users.",
    ],
    tips: [
      "Test the link preview by sending it to yourself on WhatsApp before sharing widely.",
      "Do not publish home addresses or phone numbers of family members on a public page.",
    ],
  }),
  p({
    slug: "ai-agent-automation-platform-prompt",
    name: "AI Agent & Workflow Platform",
    industry: "AI / Tech",
    tone: "dark",
    layout: "centered",
    palette: ["#050816", "#ffffff", "#6366f1", "#06b6d4"],
    stack: "Next.js (App Router) + Tailwind CSS",
    sections: [
      "Sticky navbar with Docs & Launch Console button",
      "Hero with interactive agent execution visualizer",
      "Live integration logo cloud (OpenAI, Anthropic, Gemini, Groq)",
      "Bento feature matrix of agent triggers and actions",
      "Workflow canvas diagram breakdown",
      "Pay-per-execution token pricing tiers",
      "Code snippet tab (Python & TypeScript SDK)",
      "Customer case study metrics",
      "Enterprise security compliance badges",
      "Footer with status page link"
    ],
    description:
      "A high-converting landing page for an autonomous AI agent builder and workflow automation platform with live node simulations.",
    prompt: `
Build a modern, developer-centric landing page for an AI agent platform called "NexusAgent", an automation tool that lets engineers deploy autonomous multi-model agents.

Tech stack: Next.js (App Router) with Tailwind CSS. Single-page layout with modular components. Use Lucide React icons.

Visual style: deep dark theme (#050816 background). Glowing indigo (#6366f1) and cyan (#06b6d4) accent gradients. Translucent dark cards with 1px border (border-white/10) and subtle backdrop blur. Typography in Inter or JetBrains Mono for code blocks.

Sections, in order:
1. Sticky Navbar: logo with glowing agent chip, links ("Features", "Workflows", "Integrations", "Pricing", "Docs"), "Log In" link, and primary "Deploy Agent" gradient pill button.
2. Hero: badge "✦ NexusAgent 3.0 is live with multi-agent orchestration", headline "Deploy autonomous AI agents in 60 seconds", supporting text describing background workers that research, write code, and trigger webhooks. Dual CTAs ("Start Building Free", "Explore Templates"). Below CTAs, an interactive simulated terminal window showing an agent performing tasks (querying DB, calling Claude 3.5, posting results).
3. Integration Cloud: "Connects natively to your AI stack" with logos for OpenAI, Anthropic, Gemini, Groq, Pinecone, LangChain, and Slack.
4. Bento Features Grid: 5 cards including "Autonomous Tool Calling", "Persistent Memory & RAG", "Human-in-the-loop Guardrails", "Multi-model Routing", and "Telemetry & Traceability".
5. Workflow Canvas Breakdown: visual diagram showing how a user prompt triggers a supervisor agent that delegates to sub-agents (Research, Code, QA).
6. Developer SDK Code Block: tabbed code viewer (TypeScript vs Python SDK) demonstrating a 5-line agent definition with custom tools.
7. Pricing: 3 tiers (Hobbyist free, Developer $29/mo with 500k workflow runs, Enterprise custom with dedicated VPC).
8. Social Proof: 3 quotes from tech leads praising speed and reliability.
9. Final CTA: full-width dark banner with glowing border and email invite input.
10. Footer: 4 columns of navigation links and real-time API uptime status indicator (99.98% Operational).`,
    followUps: [
      "Add an interactive pricing slider based on monthly agent execution hours.",
      "Add a live interactive node-graph builder simulator where users can drag connect wires between agents.",
      "Integrate an email capture form connected to a Next.js Server Action.",
      "Implement Dark/Light mode switcher with Tailwind dark classes."
    ],
    tips: [
      "Make sure code blocks use pre and code tags with syntax coloring spans for clarity.",
      "Highlight the 'Human-in-the-loop' safety card to appeal to enterprise buyers."
    ],
  }),
  p({
    slug: "telemedicine-clinic-portal-prompt",
    name: "Telemedicine & Digital Health Portal",
    industry: "Health",
    tone: "light",
    layout: "split",
    palette: ["#ffffff", "#0f172a", "#0284c7", "#10b981"],
    stack: "Next.js (App Router) + Tailwind CSS",
    sections: [
      "Top announcement bar (24/7 Virtual Doctor Hotline)",
      "Sticky navbar with Emergency Alert button",
      "Hero with quick appointment booking widget",
      "Medical specialty selector (Primary Care, Dermatology, Mental Health)",
      "Board-certified doctor cards with rating & availability",
      "How virtual consultations work (3 steps)",
      "Patient testimonials & HIPAA security badge",
      "Insurance & flat-fee pricing breakdown",
      "Health advisory FAQ accordion",
      "Footer with medical disclaimer"
    ],
    description:
      "A compassionate, patient-first telehealth clinic website with doctor directory, specialty filters, and instant video consultation booking.",
    prompt: `
Build a modern, trustworthy telemedicine and virtual clinic landing page called "CarePulse Health".

Tech stack: Next.js (App Router) with Tailwind CSS. Clean component structure.

Visual style: welcoming and clinical. Crisp white background (#ffffff), deep navy text (#0f172a), sky blue (#0284c7) for primary actions, emerald green (#10b981) for online doctor availability indicators. Generous line-height, rounded 16px cards, and high contrast for accessibility.

Sections, in order:
1. Top Urgent Bar: "Need care right now? Average doctor connection time: 4 minutes" with direct call link.
2. Navbar: logo with medical cross mark, navigation links ("Find a Doctor", "Specialties", "How It Works", "Insurance", "Pricing"), and a "Book Consultation" button.
3. Hero: split layout. Left side: headline "Expert medical care from the comfort of your home", paragraph about board-certified physicians available 24/7 for prescriptions and advice. Right side: an instant booking card with dropdown for specialty, date picker, consultation type (Video vs Chat), and "Check Available Doctors" button.
4. Trust Badges: verified HIPAA compliant, 4.9/5 patient rating from 15,000+ consults, accredited physicians.
5. Specialties Grid: 6 circular cards with icons for General Medicine, Dermatology, Pediatrics, Mental Health, Cardiology, and Women's Health.
6. Doctor Roster: 3 featured physician cards showing doctor photo placeholder, full name, board certifications, star rating, consultation fee, and an "Available in 10 mins" green badge.
7. How It Works: 3 clean steps: 1) Choose doctor & time, 2) Join HD video call from any phone or laptop, 3) Receive digital prescription sent to your local pharmacy.
8. Insurance & Pricing: clear explanation of $39 flat-rate visits without insurance, plus list of accepted major insurance networks.
9. Patient Reviews: 3 verified patient stories with name and location.
10. Medical FAQ: 5 common questions about prescription renewals, emergency protocols, and privacy.
11. Footer: hospital disclaimers, privacy policy, state licensing statements, and copyright.`,
    followUps: [
      "Add an interactive symptom-checker modal that suggests the appropriate medical specialty.",
      "Add calendar booking slots selection with morning, afternoon, and evening availability.",
      "Integrate WhatsApp appointment confirmation button.",
      "Add Schema.org MedicalClinic and Physician structured data."
    ],
    tips: [
      "Always include prominent disclaimers that emergency conditions require dialing 911 / 112 immediately.",
      "Keep doctor profile information transparent with credentials and degrees visible."
    ],
  }),
  p({
    slug: "crypto-defi-exchange-prompt",
    name: "Web3 DeFi Protocol & Token Swap",
    industry: "Fintech",
    tone: "dark",
    layout: "centered",
    palette: ["#080a14", "#ffffff", "#8b5cf6", "#10b981"],
    stack: "Next.js (App Router) + Tailwind CSS",
    sections: [
      "Web3 navigation bar with Connect Wallet modal trigger",
      "Hero with live interactive token swap card simulator",
      "Live TVL, 24h trading volume, and protocol stats bar",
      "Top liquidity yield pools table with APY sorting",
      "Institutional security & audit badges (CertiK, OpenZeppelin)",
      "Cross-chain bridge support grid (Ethereum, Solana, Arbitrum)",
      "DAO Governance proposals vote ticker",
      "FAQ section covering slippage and gas optimization",
      "Footer with social channels (Discord, X, Telegram)"
    ],
    description:
      "A modern decentralized finance landing page featuring an interactive token swap simulator, liquidity yield pool tables, and audit badges.",
    prompt: `
Build a futuristic, high-performance decentralized finance (DeFi) web application landing page called "AetherSwap DEX".

Tech stack: Next.js (App Router) with Tailwind CSS. Component-based architecture.

Visual style: ultra-dark Web3 aesthetic (#080a14 background). Neon violet (#8b5cf6) and emerald (#10b981) highlights. Dark glassmorphic panels with subtle glowing borders (box-shadow: 0 0 40px rgba(139, 92, 246, 0.15)). Monospace fonts for numbers and wallet addresses.

Sections, in order:
1. Navbar: logo with glowing prism icon, links ("Swap", "Liquidity", "Farms", "Analytics", "Governance"), network selector pill (Ethereum, Arbitrum, Base), and "Connect Wallet" button with gradient border.
2. Hero: centered layout. Headline "Swap tokens at lightning speed with zero slippage", subtitle explaining decentralized liquidity aggregation across 14 networks.
3. Interactive Swap Card: featured directly in the hero. Top row: 'You Pay' with numerical input, currency dropdown (ETH), and wallet balance. Middle: animated circular swap direction button. Bottom row: 'You Receive' with calculated output (USDC). Slippage tolerance settings button (0.1%, 0.5%, 1.0%), estimated gas fee ($0.42), and large "Swap Now" CTA button.
4. Protocol Live Metrics: 4 stats cards: "$4.2B+ Total Value Locked (TVL)", "$890M 24h Volume", "180k+ Active Traders", "$0.001 Avg Gas Cost".
5. Yield Farming Pools Table: top 5 liquidity pools with token pair icons (ETH/USDC, SOL/USDC, WBTC/ETH), total pool liquidity, 24h volume, and dynamic APY badge (e.g. 18.4% APY in green).
6. Security & Audit Proofs: logos and audit scores from CertiK, OpenZeppelin, and Halborn, plus 100% open-source smart contract link.
7. Cross-Chain Compatibility: logos of supported L1 and L2 blockchains with sub-second finality highlights.
8. Community Governance: active DAO voting cards showing recent proposals with 'For / Against' percentage bars.
9. Footer: disclaimer about cryptographic asset risk, smart contract documentation links, and social links.`,
    followUps: [
      "Add interactive slippage tolerance configuration modal.",
      "Add simulated token price charts using a mini SVG candlestick or line graph.",
      "Integrate simulated wallet connect states (MetaMask, Phantom, WalletConnect).",
      "Add sound effects on token swap button click using Web Audio API."
    ],
    tips: [
      "Use font-variant-numeric: tabular-nums for financial values to eliminate layout shifts.",
      "Ensure color contrast remains readable even over dark glowing cards."
    ],
  }),
  p({
    slug: "luxury-car-rental-fleet-prompt",
    name: "Luxury Car Rental & Fleet Booking",
    industry: "Hospitality",
    tone: "dark",
    layout: "split",
    palette: ["#0b0f19", "#ffffff", "#f59e0b", "#64748b"],
    stack: "Next.js (App Router) + Tailwind CSS",
    sections: [
      "VIP Concierge header with direct WhatsApp booking",
      "Sticky navbar with Fleet category filters",
      "Hero with instant date & pickup location search bar",
      "Curated luxury fleet grid (Supercars, SUVs, Chauffeur sedans)",
      "Vehicle spec pills (0-100 km/h, Horsepower, Top Speed, Daily Rate)",
      "Exclusive concierge perks (Airport delivery, zero deposit options)",
      "Step-by-step reservation process",
      "Customer reviews from verified executives",
      "Booking advisory FAQ",
      "Footer with city locations"
    ],
    description:
      "A luxury car rental and chauffeur service website with vehicle category filters, performance specs, daily rates, and reservation booking flow.",
    prompt: `
Build a high-end luxury and exotic car rental website called "ApexDrive Private Fleet".

Tech stack: Next.js (App Router) with Tailwind CSS.

Visual style: sleek, prestigious dark aesthetic. Obsidian background (#0b0f19), white headings, amber/gold (#f59e0b) for accents and star ratings, muted platinum (#94a3b8) for secondary copy. Razor-sharp 12px border radius, high-resolution automobile photo placeholders, and generous padding.

Sections, in order:
1. Top Concierge Strip: "Private deliveries available in Dubai, London, Miami & Mumbai. 24/7 WhatsApp Concierge" with phone number.
2. Navbar: sleek wordmark logo, links ("Fleet", "Chauffeur", "Services", "Locations", "About"), and "Reserve Now" gold button.
3. Hero: background with moody sports car silhouette. Headline "Drive the extraordinary", subtitle explaining curated exotic sports cars and luxury SUVs delivered to your private terminal or hotel.
4. Reservation Search Bar: sleek horizontal booking bar with Pickup City dropdown, Pickup Date, Return Date, Vehicle Category (Supercar, Luxury SUV, Executive Sedan), and "Search Fleet" button.
5. Fleet Showcase: 6 vehicle cards featuring high-end cars (Porsche 911 GT3, Lamborghini Huracán, Range Rover Autobiography, Rolls Royce Ghost). Each card has: car image, make & model, daily rental rate in USD/AED, 3 spec badges (Horsepower e.g. 640 HP, 0-100 km/h e.g. 2.9s, Automatic), and "Reserve Vehicle" button.
6. The Apex Experience: 4 VIP perks: Airport tarmac drop-off, comprehensive insurance included, flexible cancelation, and 24/7 personal chauffeur on demand.
7. Simple 3-Step Process: 1) Select dream vehicle, 2) Instant identity & license verification, 3) Key handover at your chosen address.
8. Client Testimonials: 3 quotes from executive clients and luxury travelers.
9. Rental FAQ: 5 questions covering security deposits, international driving permits, and mileage policies.
10. Footer: office addresses in 4 global cities, luxury concierge contact, terms of service.`,
    followUps: [
      "Add interactive category filter buttons to swap between Supercars, SUVs, and Sedans instantly.",
      "Add an interactive deposit and daily price calculator based on rental duration.",
      "Add WhatsApp 1-click booking pre-fill with the selected car name.",
      "Add SEO schema for AutoRental and Product rich snippets."
    ],
    tips: [
      "Vehicle specifications should be prominent; renters want horsepower and 0-60 times immediately.",
      "Emphasize delivery convenience and transparent pricing without hidden surprise fees."
    ],
  }),
  p({
    slug: "app-waitlist-viral-launch-prompt",
    name: "Mobile App Waitlist & Viral Launch",
    industry: "SaaS",
    tone: "dark",
    layout: "split",
    palette: ["#030712", "#ffffff", "#ec4899", "#3b82f6"],
    stack: "Next.js (App Router) + Tailwind CSS",
    sections: [
      "Minimalist brand bar with early access badge",
      "Hero with 3D smartphone mockup and email waitlist form",
      "Live waitlist counter ('14,892 people in queue')",
      "Viral referral queue mechanism ('Invite 3 friends to skip 5,000 spots')",
      "Three core screenshot previews of app features",
      "Early adopter perks (Free lifetime Pro tier, limited founder badge)",
      "Indie creator & investor backers bar",
      "Footer with privacy policy and social handles"
    ],
    description:
      "A high-converting pre-launch waitlist page for mobile applications with viral referral gamification, live queue counter, and phone mockups.",
    prompt: `
Build a viral, high-conversion pre-launch waitlist landing page for an upcoming mobile app called "Chronos: The AI Time Optimizer".

Tech stack: Next.js (App Router) with Tailwind CSS.

Visual style: ultra-clean modern dark mode (#030712). Vibrant magenta (#ec4899) and electric blue (#3b82f6) gradients. Glassmorphic pill inputs, smooth animated borders, and smartphone frame mockup with realistic notch and shadows.

Sections, in order:
1. Header: clean logo with clock symbol, "Coming Spring 2027 to iOS & Android", and Twitter/X community link.
2. Hero: split layout.
   - Left side: badge "✦ Private Beta Opening Soon", headline "Reclaim 10 hours of your week with autonomous scheduling", paragraph explaining how Chronos blocks distraction and reschedules conflicting meetings automatically.
   - Email Signup Form: input with email placeholder, "Join Waitlist &rarr;" gradient button, and reassurance text "No spam. Unsubscribe anytime."
   - Live Counter: "14,892 founders and creators in line. Beta cohort #1 launches in 18 days."
   - Right side: sleek iPhone mockup displaying the Chronos daily timeline interface with colorful event blocks and intelligent suggestions.
3. Viral Referral Queue Gamification: interactive preview showing how users who share their custom referral link move up the waitlist: "Invite 1 friend = Skip 1,000 spots", "Invite 3 friends = Instant Beta Access", "Invite 5 friends = Free Lifetime Pro".
4. Three Core Pillars: 3 feature cards with micro-illustrations: "Zero-Click Calendar Sync", "Context-Aware Focus Modes", and "Daily Productivity Scorecard".
5. Founder Exclusive Perks: cards detailing rewards for the first 1,000 beta members (Special badge, direct access to founders Slack, locked-in lifetime discount).
6. Backed By: logos of notable angel investors and creator studios.
7. Minimal Footer: links to privacy policy, terms, and social links.`,
    followUps: [
      "Add interactive waitlist submission state with animated confetti and custom shareable referral link generator.",
      "Add a live countdown timer ticking down to the public beta launch date.",
      "Connect email submission to Supabase or Firebase waitlist table.",
      "Generate OpenGraph social card showing the user's specific waitlist rank."
    ],
    tips: [
      "Include clear social share buttons (X, LinkedIn, WhatsApp) directly upon email submission.",
      "Keep the hero form above the fold on mobile viewports for maximum conversion rate."
    ],
  }),
  p({
    slug: "corporate-law-firm-prompt",
    name: "Corporate Law Firm & Legal Advisory",
    industry: "Agency",
    tone: "light",
    layout: "split",
    palette: ["#fcfbf9", "#1c1917", "#991b1b", "#b45309"],
    stack: "Next.js (App Router) + Tailwind CSS",
    sections: [
      "Confidential consultation phone bar + Bar Association logos",
      "Classic refined navbar with Practice Area dropdowns",
      "Hero with distinguished headline and free case evaluation card",
      "Core practice areas (Mergers & Acquisitions, IP, Corporate Litigation)",
      "Notable case outcomes & settlement amounts ($120M+ recovered)",
      "Managing partner attorney profiles with education & bar admissions",
      "Client testimonials from corporate counsels and CEOs",
      "Confidential case inquiry form with file upload support",
      "Legal disclaimers & comprehensive footer"
    ],
    description:
      "A distinguished corporate law firm and litigation practice website with confidential case evaluation forms and verified settlement outcomes.",
    prompt: `
Build a prestigious, credible website for a premier corporate law firm called "Vanguard & Associates Legal Counsel".

Tech stack: Next.js (App Router) with Tailwind CSS.

Visual style: distinguished, authoritative, and elegant. Warm ivory/parchment background (#fcfbf9), dark charcoal typography (#1c1917), deep burgundy (#991b1b) for primary accents, and subtle antique gold (#b45309) for awards and borders. Sophisticated serif font (such as Playfair Display or Merriweather) for headings and clean sans-serif for body text.

Sections, in order:
1. Top Bar: "Confidential Case Inquiries: +1 (800) 555-0199 | Ranked Tier 1 by Legal 500 & Chambers USA".
2. Navbar: dignified serif logo, navigation links ("Practice Areas", "Attorneys", "Case Results", "Publications", "About"), and "Schedule Consultation" button.
3. Hero: split layout. Left side: headline "Decisive legal counsel for high-stakes corporate disputes and transactions", supporting paragraph on 30+ years protecting business enterprise interests. Right side: an inquiry form "Request a Confidential Case Review" with fields for Full Name, Corporate Entity, Practice Area, Brief Summary, and "Submit Inquiry" button.
4. Firm Track Record Bar: 4 stats: "$2.4 Billion in Total Transaction Value", "98% Litigation Success Rate", "35+ Years in Practice", "200+ Corporate Clients".
5. Practice Areas: 6 structured cards with subtle gold borders for: Mergers & Acquisitions, Intellectual Property & Patents, Commercial Litigation, Regulatory Compliance, Employment Law, and Restructuring.
6. Senior Partners: 3 attorney profile cards with portrait placeholder, name, title (e.g., Managing Partner, Former Federal Prosecutor), law school credential (e.g., Harvard Law School, J.D.), and key recognitions.
7. Significant Case Results: 3 landmark outcome summaries (e.g., "$145M patent infringement victory for semiconductor client", "Complete defense verdict in antitrust class action").
8. Client Testimonials: quotes from General Counsels praising strategic foresight and trial readiness.
9. Full Inquiry Section: address, map placeholder, phone numbers, and encrypted document submission notice.
10. Footer: comprehensive legal advertising disclaimer, attorney ethics compliance statement, and office locations.`,
    followUps: [
      "Add interactive practice area filter on case outcomes.",
      "Add Attorney bio detail modal with full list of publications and speaking engagements.",
      "Integrate an automated booking calendar for initial legal strategy sessions.",
      "Add LegalService Schema.org structured data for local search authority."
    ],
    tips: [
      "Ensure mandatory legal advertising disclaimers are prominently displayed in the footer.",
      "Maintain a clean, sophisticated serif hierarchy to convey trust, heritage, and elite capability."
    ],
  }),
  p({
    slug: "dev-tool-documentation-prompt",
    name: "Developer Tool & Open-Source Docs",
    industry: "AI / Tech",
    tone: "dark",
    layout: "split",
    palette: ["#090d16", "#ffffff", "#38bdf8", "#4ade80"],
    stack: "Next.js (App Router) + Tailwind CSS + Shiki",
    sections: [
      "Sticky navbar with GitHub stars & npm download count badges",
      "Hero with 1-click copyable terminal install command",
      "Benchmark performance chart comparison (ms vs memory)",
      "Bento feature matrix (Zero config, Type-safe, Sub-millisecond cold starts)",
      "Interactive dual-column documentation preview with tabbed code samples",
      "Ecosystem plugin and framework integration logos",
      "Sponsor tier cards and open-source contributor avatar wall",
      "Community Discord & GitHub Discussions CTA banner",
      "Footer with release changelog and license info"
    ],
    description:
      "A high-conversion developer tool and CLI library landing page with copyable terminal install, benchmark charts, and split documentation preview.",
    prompt: `
Build a modern developer tool and open-source library landing page called "HyperFetch: Next-Gen Type-Safe API Client".

Tech stack: Next.js (App Router) with Tailwind CSS. Split modular component architecture. Syntax highlighted code blocks with Shiki styling.

Visual style: hacker-grade modern dark aesthetic (#090d16 background). Electric cyan (#38bdf8) and neon emerald (#4ade80) accents. Monospace typography for terminal lines and type definitions. Translucent borders with 1px border-white/10.

Sections, in order:
1. Navbar: logo with terminal prompt symbol, navigation ("Documentation", "Benchmarks", "Ecosystem", "Changelog"), real-time GitHub Star counter pill ("★ 14.8k"), and "Get Started" button.
2. Hero: centered layout.
   - Badge: "v4.2 released with native WebAssembly SIMD acceleration".
   - Headline: "The fastest type-safe API client for modern JavaScript".
   - Subtitle: "Zero dependencies, automatic schema inference from OpenAPI, and 4x faster request serialisation than standard fetch."
   - 1-Click Terminal Command Block: dark code snippet "npx hyperfetch init" with an instant copy button that toggles to "Copied!" with an animated green checkmark.
   - Dual CTAs: "Read Documentation &rarr;" and "Explore GitHub Repo".
3. Benchmark Performance Section: interactive bar chart comparing HyperFetch vs Axios vs Ky vs native Fetch across requests/sec and memory footprint.
4. Bento Capabilities: 4 cards highlighting: 1) End-to-end TypeScript autocomplete, 2) Automatic exponential retry with jitter, 3) Offline cache invalidation, 4) Edge runtime compatible (Cloudflare Workers, Vercel, Node).
5. Interactive Documentation Preview: split view with a sidebar navigation of guide topics on the left, and a tabbed code editor on the right (TypeScript, Next.js App Router, React Native) with copy button.
6. Community & Backers: logos of tech companies running HyperFetch in production, followed by an avatar grid of 150+ community contributors.
7. Final CTA: full-width dark banner inviting developers to join 8,000+ engineers in Discord.
8. Footer: Apache 2.0 license notice, security disclosure policy, and documentation version switcher.`,
    followUps: [
      "Add an interactive sandbox where users can test an API request live in the browser.",
      "Add dynamic GitHub stars count fetching using the GitHub REST API.",
      "Add interactive benchmark slider comparing payload sizes (1KB vs 50KB vs 1MB).",
      "Implement a search bar for documentation using Cmd+K shortcut."
    ],
    tips: [
      "Include realistic TypeScript interfaces with generics in sample code blocks.",
      "Keep terminal commands copyable in 1 click without selecting the leading dollar sign."
    ],
  }),
  p({
    slug: "online-course-platform-prompt",
    name: "Online Course & Learning Platform",
    industry: "Education",
    tone: "light",
    layout: "centered",
    palette: ["#ffffff", "#0f172a", "#4f46e5", "#f59e0b"],
    stack: "Next.js (App Router) + Tailwind CSS",
    sections: [
      "Top countdown banner ('Spring Cohort closes in 3 days')",
      "Navbar with Course Catalog dropdown and Student Portal login",
      "Hero with curriculum highlights and interactive video trailer preview",
      "Skill category filter pills (Full Stack, AI Engineering, Cloud)",
      "Curated course cards with instructor avatar, lesson count, and student rating",
      "Interactive course syllabus accordion with free preview lessons",
      "Instructor credentials and alumni placement company logos",
      "Student career outcome statistics (Average salary hike, hiring rate)",
      "Cohort enrollment pricing tiers with money-back guarantee badge",
      "Student FAQ accordion and comprehensive footer"
    ],
    description:
      "An engaging e-learning LMS course portal featuring video syllabus modules, instructor credentials, skill level filters, and student reviews.",
    prompt: `
Build a high-converting, interactive online learning and cohort course website called "SkillCraft Academy: Master Modern AI & Full Stack".

Tech stack: Next.js (App Router) with Tailwind CSS. Clean component hierarchy.

Visual style: bright, credible, and energetic. Clean white background (#ffffff), dark slate headings (#0f172a), deep indigo (#4f46e5) for buttons and progress bars, amber (#f59e0b) for ratings and certification badges. Rounded 16px cards with subtle elevation shadows.

Sections, in order:
1. Top Urgent Bar: "Next live mentorship cohort begins in 6 days. Only 8 spots remaining."
2. Navbar: logo with graduation cap icon, links ("Courses", "Syllabus", "Mentors", "Placements", "Pricing"), and "Enroll Now" button.
3. Hero: split layout.
   - Left side: badge "✦ Top Rated Tech Bootcamp 2026", headline "Become a senior full stack & AI engineer in 12 weeks", supporting paragraph on project-based curriculum, 1-on-1 code reviews, and guaranteed portfolio output.
   - Right side: video preview card with video player overlay showing instructor code walkthrough, play button, and badge "Watch 3-minute Course Tour".
4. Track Record Bar: 4 stats: "94% Placement Rate", "$118,000 Average Starting Salary", "4.9/5 Rating (2,400+ Alumni)", "1:8 Mentor-Student Ratio".
5. Interactive Curriculum Syllabus: 6 expandable modules (e.g., Module 1: Advanced TypeScript & Architecture, Module 2: Next.js 16 Server Components & Turbopack, Module 3: AI Agents & Vector Databases). Each module shows duration, number of projects, and a clickable 'Preview Lesson' link.
6. Featured Projects You Will Build: 3 project cards with mockups: an AI SaaS with Stripe billing, a real-time collaborative workspace, and an enterprise mobile app.
7. Lead Instructors: 3 cards showing instructor photo, title (e.g., Former Staff Engineer @ Google, M.Tech IIT), and LinkedIn profile links.
8. Alumni Whereabouts: "Our graduates work at" with logos for Microsoft, Amazon, Stripe, Uber, and top startups.
9. Pricing & Guarantees: 2 options (Self-Paced $499, Live Mentorship Cohort $1,499 with monthly EMI plans and 14-day 100% money-back guarantee).
10. FAQ: 6 questions about prerequisites, time commitment, and job assistance.
11. Footer: campus locations, accreditation details, and terms.`,
    followUps: [
      "Add interactive lesson video player modal when clicking preview buttons.",
      "Add curriculum download modal that captures student email and phone number.",
      "Add monthly EMI installment payment calculator.",
      "Add Course and LearningResource JSON-LD structured data."
    ],
    tips: [
      "Include realistic syllabus topics that reflect modern industry expectations (Next.js 16, LLMs, Vector DBs).",
      "Highlight the money-back guarantee prominently to eliminate buyer hesitation."
    ],
  }),
  p({
    slug: "architecture-interior-studio-prompt",
    name: "Architecture & Interior Studio",
    industry: "Real Estate",
    tone: "light",
    layout: "centered",
    palette: ["#f5f5f4", "#1c1917", "#78716c", "#d97706"],
    stack: "Next.js (App Router) + Tailwind CSS",
    sections: [
      "Minimalist transparent floating navigation bar",
      "Full-bleed editorial hero with architectural photography",
      "Studio design manifesto and sustainable building philosophy",
      "Featured portfolio projects gallery with filter (Residential, Commercial, Cultural)",
      "Project detail preview card with square footage, year, and location specs",
      "Architectural process (Discovery, 3D Spatial Modeling, Fabrication, Handover)",
      "International design accolades and architectural monographs",
      "Client private consultation questionnaire form",
      "Global studio addresses (New York, Milan, Kyoto)",
      "Footer with architectural license credentials"
    ],
    description:
      "A minimalist, editorial portfolio website for luxury architects and interior design practices with full-bleed imagery and project studies.",
    prompt: `
Build a breathtaking, minimalist editorial portfolio website for an architectural and interior design studio called "Studio Atelier Forma".

Tech stack: Next.js (App Router) with Tailwind CSS.

Visual style: Scandinavian/Japanese minimalist aesthetic. Warm stone background (#f5f5f4), charcoal typography (#1c1917), muted warm-grey (#78716c) for descriptions, and subtle ochre (#d97706) for award highlights. Monospaced coordinates and metadata tags, generous white space, and sharp editorial layout without clutter.

Sections, in order:
1. Floating Navbar: understated wordmark logo, links ("Portfolio", "Philosophy", "Selected Works", "Publications", "Contact"), and "Inquire" button.
2. Hero: full-bleed visual aesthetic. Large headline "Spaces designed with quiet restraint", subtitle exploring residential sanctuaries and sustainable mass-timber structures, with location indicator "New York · Milan · Kyoto".
3. Philosophy Statement: an expansive typography block exploring how natural light, raw textures, and bioclimatic ventilation define every commission.
4. Selected Works Gallery: 4 featured project showcases with photography placeholders, project title (e.g., "The Glass Pavilions — Aspen", "Casa Minori — Kyoto"), category tags (Residential, 6,200 sq.ft, Completed 2026), and "View Project Monograph" link.
5. The Architectural Process: 4 chronological stages: 1) Topographic Analysis, 2) Light & Shadow Modeling, 3) Artisanal Material Procurement, 4) Master Craft Execution.
6. Recognition & Press: architectural awards (AIA Honor Award 2026, Architectural Digest Top 100), accompanied by quote excerpts from Domus and Wallpaper*.
7. Private Commission Inquiries: a restrained, elegant form requesting Project Location, Estimated Scale, Timeline, and Concept Vision.
8. Studio Locations: 3 columns with address, local phone, and coordinates for Manhattan, Brera Milan, and Kamigyo Kyoto studios.
9. Footer: copyright, architectural registration numbers, and newsletter field for biannual monograph release.`,
    followUps: [
      "Add full-screen image lightbox modal for high-resolution project renders.",
      "Add interactive before/after renovation slider for selected interior projects.",
      "Add architectural blueprint wireframe toggle overlay on project images.",
      "Include Schema.org LocalBusiness and RealEstateAgent metadata."
    ],
    tips: [
      "Use ample white space (padding of 120px+ between sections) to evoke understated luxury.",
      "Ensure typography uses elegant letter-spacing and refined font hierarchy."
    ],
  }),
  p({
    slug: "micro-saas-tool-prompt",
    name: "Micro-SaaS Utility & Converter App",
    industry: "SaaS",
    tone: "light",
    layout: "centered",
    palette: ["#ffffff", "#1e293b", "#2563eb", "#10b981"],
    stack: "Next.js (App Router) + Tailwind CSS + WebAssembly",
    sections: [
      "Clean utility navbar with '100% Free & Private' badge",
      "Hero with drag-and-drop file upload zone",
      "Conversion output options bar (Format, DPI, Quality slider)",
      "Live conversion state simulation with progress bar & Download button",
      "How it works: 100% client-side privacy with zero server uploads",
      "Feature comparison: Free vs Pro batch processing",
      "Pro lifetime pass checkout card ($19 one-time payment)",
      "Comprehensive SEO guide on file optimization and best practices",
      "FAQ covering supported file formats and maximum upload size",
      "Footer with privacy policy and related free web tools directory"
    ],
    description:
      "A single-purpose micro-SaaS converter web app with drag-and-drop file upload, live client-side progress simulation, and Pro upgrade modal.",
    prompt: `
Build a high-converting, single-purpose micro-SaaS utility web application called "PixelCompress: Free Ultra-Fast Image & PDF Optimizer".

Tech stack: Next.js (App Router) with Tailwind CSS. High-performance client-side simulation.

Visual style: ultra-clean, functional utility tool. White background (#ffffff), dark slate headings (#1e293b), electric royal blue (#2563eb) for buttons, and vibrant emerald (#10b981) for savings metrics and success states.

Sections, in order:
1. Navbar: logo with lightning compress symbol, links ("API", "Batch Pro", "Privacy", "FAQ"), and "Upgrade to Pro" pill.
2. Hero: centered tool layout.
   - Headline: "Compress images up to 90% without quality loss".
   - Subtitle: "Fast, lossless optimization for PNG, JPEG, SVG and WebP. 100% private: files are processed right inside your browser using WebAssembly."
   - Interactive Drag & Drop Box: large dashed border dropzone with cloud upload icon, text "Drag & drop files here or browse", format badges ("PNG, JPG, SVG, WebP up to 50MB"), and a file input button.
   - Tool Options Bar: Target format dropdown (Keep Original, WebP, AVIF), Quality slider (80%), and "Optimize Now" button.
   - Live Result Card Simulation: displays file name (hero-banner.png), original size (4.8 MB), optimized size (480 KB), badge "90% Saved", and green "Download Optimized File" button.
3. Privacy Assurance: 3 security icons: 1) Zero server uploads, 2) No tracking cookies, 3) Works offline without internet.
4. Batch Processing Pro Card: comparison showing Free tier (up to 5 files at a time) vs Pro Lifetime tier (unlimited batch processing, ZIP download, CLI automation tool) for a single $19 payment.
5. Technical Comparison Table: shows how PixelCompress preserves EXIF metadata, ICC color profiles, and transparent alpha channels compared to generic compressors.
6. Step-by-Step SEO Guide: "How image compression speeds up Google Core Web Vitals (LCP & CLS)" with actionable advice for web developers.
7. FAQ: 6 questions about format conversions, browser compatibility, and commercial usage.
8. Footer: links to other micro-tools (SVG Optimizer, PDF Redactor, Favicon Generator) and copyright.`,
    followUps: [
      "Implement real in-browser image compression using the HTML Canvas API and toBlob.",
      "Add drag-and-drop file event handlers (dragover, drop) with visual highlight feedback.",
      "Connect Pro checkout button to Stripe or LemonSqueezy payment link.",
      "Add WebPage and SoftwareApplication JSON-LD schema."
    ],
    tips: [
      "Emphasize browser-side processing; privacy-conscious developers love tools that don't transmit data to third-party servers.",
      "Include a sample before-and-after download file to prove compression quality instantly."
    ],
  }),
  p({
    slug: "coffee-roastery-cafe-prompt",
    name: "Specialty Coffee Roastery & Cafe",
    industry: "Hospitality",
    tone: "dark",
    layout: "split",
    palette: ["#140f0b", "#fef3c7", "#d97706", "#78350f"],
    stack: "Next.js (App Router) + Tailwind CSS",
    sections: [
      "Top bar with weekly roast schedule ('Next batch roasted on Tuesday')",
      "Navbar with Bean Shop, Subscription, Brew Guides & Cafe Hours",
      "Hero with single-origin coffee bean bag & elevation story",
      "Curated coffee beans e-commerce grid with roast level sliders",
      "Interactive flavor notes wheel (Jasmine, Bergamot, Dark Chocolate, Blackberry)",
      "Monthly coffee subscription box builder with grind selector",
      "Step-by-step home brew tutorials (V60 Pour-over, Aeropress, Espresso)",
      "Flagship cafe location with hours, address, and Google Maps link",
      "Customer reviews from specialty coffee enthusiasts",
      "Footer with direct trade sourcing certifications"
    ],
    description:
      "A warm, sensory specialty coffee roastery website with bean subscription plans, flavor profile tasting notes, and home brew guides.",
    prompt: `
Build a warm, atmospheric specialty coffee roastery and cafe website called "Origins Roastery & Brew Lab".

Tech stack: Next.js (App Router) with Tailwind CSS.

Visual style: rich artisanal aesthetic. Deep espresso background (#140f0b), warm parchment text (#fef3c7), amber honey accents (#d97706), and roasted hazelnut borders (#78350f). Atmospheric coffee imagery, bold modern typography, and subtle craft illustrations.

Sections, in order:
1. Top Bar: "Freshly roasted in small batches every Monday & Thursday. Free shipping on orders over ₹999 / $35."
2. Navbar: logo with coffee leaf branch icon, links ("Shop Beans", "Subscription", "Flavor Guide", "Brew Lab", "Cafe Locations"), and "Cart (0)" button.
3. Hero: split layout.
   - Left side: badge "✦ Direct Trade Specialty Coffee", headline "Sourced from high-altitude farms. Roasted for extraordinary sweetness.", paragraph detailing ethical partnerships with smallholder farmers in Ethiopia, Colombia, and Chikmagalur.
   - Right side: artisanal coffee bag photo with origin label, elevation specs (1,950m MASL), variety (Geisha), and process (Natural Anaerobic).
4. Fresh Roasts Collection: 4 coffee bag cards with roast degree badge (Light, Medium-Light, Medium), tasting notes (e.g., Jasmine, Blueberry, Wild Honey), origin country flag, price, and "Add to Bag" button.
5. Interactive Tasting Notes Explorer: interactive flavor picker where clicking a flavor profile (Fruity & Floral vs Rich & Chocolatey vs Bright Citrus) highlights recommended beans.
6. Monthly Subscription Club: 3 simple steps: 1) Choose your brew method (Espresso, Pour-over, French Press, Whole Bean), 2) Pick frequency (Weekly, Bi-weekly, Monthly), 3) Receive freshly roasted bags with 20% discount.
7. Home Brew Guides: 3 quick visual guides with water ratios and grind sizes for V60 Pour-Over, AeroPress, and Cold Brew.
8. Flagship Cafe & Tasting Room: opening hours, address, parking instructions, and menu highlights (Oat flat white, Single-origin espresso flights).
9. Community Love: quotes from coffee competition judges and cafe regulars.
10. Footer: direct trade sourcing ethics, sustainable packaging pledge, and wholesale bean inquiries link.`,
    followUps: [
      "Add interactive grind size and bag quantity selector on product cards.",
      "Add coffee brewing timer tool with audio chimes for pour intervals.",
      "Add newsletter subscription form with a free 20-page Home Brewing Guide PDF download.",
      "Integrate local currency switcher (INR / USD / EUR)."
    ],
    tips: [
      "Include key coffee metrics that matter to enthusiasts: altitude (MASL), processing method, and roast date.",
      "Use rich warm tones rather than sterile clinical greys to evoke sensory taste and aroma."
    ],
  }),
  p({
    slug: "dental-clinic-practice-prompt",
    name: "Dental & Orthodontics Clinic",
    industry: "Health",
    tone: "light",
    layout: "split",
    palette: ["#ffffff", "#0c4a6e", "#0284c7", "#059669"],
    stack: "Next.js (App Router) + Tailwind CSS",
    sections: [
      "Emergency dental care top hotline bar",
      "Navbar with Treatment directory, Doctors, Financing, and Book Appointment",
      "Hero with instant dental appointment reservation card",
      "Treatment specialties grid (Invisalign, Dental Implants, Porcelain Veneers, General)",
      "Interactive Before-and-After smile transformation slider",
      "Meet our principal dental surgeons with qualifications and awards",
      "Modern clinic technology highlights (3D Digital Scanning, Painless Laser Dentistry)",
      "Transparent treatment cost breakdown & 0% APR financing options",
      "Patient video testimonials and Google 5-star review counter",
      "Clinic address, free parking directions, and appointment FAQ",
      "Footer with state dental board certifications"
    ],
    description:
      "A trustworthy cosmetic dental and orthodontics practice website with interactive smile transformation sliders and transparent treatment pricing.",
    prompt: `
Build a welcoming, modern dental and cosmetic orthodontics clinic website called "Apex Dental Studio & Smile Architecture".

Tech stack: Next.js (App Router) with Tailwind CSS.

Visual style: serene, hygienic, and comforting. Pure white background (#ffffff), deep navy text (#0c4a6e), medical sky blue (#0284c7) for actions, and soft mint green (#059669) for success badges. High-contrast typography and gentle rounded cards designed to alleviate dental anxiety.

Sections, in order:
1. Urgent Hotline Bar: "Tooth pain or dental emergency? Same-day urgent appointments available: (800) 555-DENT".
2. Navbar: logo with subtle tooth smile geometry, links ("Treatments", "Smile Gallery", "Our Team", "Pricing & Insurance", "Contact"), and "Book Online" blue button.
3. Hero: split layout.
   - Left side: badge "✦ Top Rated Cosmetic Dental Practice 2026", headline "Modern dentistry designed around your comfort", paragraph explaining pain-free techniques, noise-canceling headphones, and relaxing spa amenities during care.
   - Right side: an appointment booking card with Doctor selection, Service type (General Cleaning, Teeth Whitening, Clear Aligners, Dental Implants), Preferred Day, and "Check Real-Time Availability" button.
4. Trust & Credentials Bar: "4.9/5 Rating from 1,800+ patients", "Invisalign Diamond Provider", "Over 15,000 smiles restored", "Accepted by all major insurance networks".
5. Core Dental Services: 6 service cards with transparent pricing estimates: 1) Invisalign Clear Aligners, 2) Same-Day Dental Implants, 3) Porcelain Veneers, 4) Laser Teeth Whitening, 5) Pediatric & Family Dentistry, 6) Sedation & Sleep Dentistry.
6. Interactive Before & After Smile Gallery: split slider showcasing real clinical smile makeovers with patient case notes (e.g., "Full mouth restoration in 3 visits").
7. The Comfort Difference: 4 patient comfort features: Virtual Reality goggles during treatment, needle-free anesthesia, zero waiting times, and complimentary sedation options.
8. Meet the Surgeons: 2 doctor profile cards with portraits, credentials (DDS, FACP), advanced surgical fellowships, and philosophy of care.
9. Transparent Pricing & Financing: explanation of 0% interest monthly payment plans (CareCredit, Sunbit) with calculator starting at $99/mo.
10. Patient Reviews: 3 verified Google reviews with star ratings and reviewer photos.
11. Clinic Location & Hours: operating hours (including Saturday morning slots), address with embedded map placeholder, and subway/parking instructions.
12. Footer: emergency protocols, licensing statements, and copyright.`,
    followUps: [
      "Add an interactive draggable before-and-after image comparison slider.",
      "Add an insurance eligibility checker form where patients type their provider name.",
      "Add an interactive smile self-assessment quiz that recommends treatment options.",
      "Add Schema.org Dentist and MedicalBusiness structured data."
    ],
    tips: [
      "Acknowledge dental anxiety directly and highlight comfort amenities to build patient trust.",
      "Ensure pricing estimates are realistic and feature financing options prominently."
    ],
  }),
  p({
    slug: "b2b-logistics-freight-prompt",
    name: "B2B Freight & Logistics Tracking",
    industry: "SaaS",
    tone: "dark",
    layout: "split",
    palette: ["#070d19", "#ffffff", "#3b82f6", "#f59e0b"],
    stack: "Next.js (App Router) + Tailwind CSS",
    sections: [
      "Global supply chain live network status ticker",
      "Navbar with Track Shipment portal and Request Quote button",
      "Hero with universal container and AWB tracking search bar",
      "Live global freight route map visualizer",
      "Multimodal freight capabilities (Ocean, Air Cargo, Intermodal Rail, Cross-Border Trucking)",
      "Instant freight quote rate estimation calculator",
      "Enterprise fleet scale metrics & carbon offset monitoring",
      "Customs brokerage and international trade compliance certifications",
      "Enterprise case study metrics (99.8% on-time delivery rate)",
      "Schedule Enterprise Logistics Demo form and comprehensive footer"
    ],
    description:
      "An enterprise supply chain and container tracking platform with live shipment tracking inputs, rate calculators, and route visualizers.",
    prompt: `
Build a high-performance B2B logistics, ocean freight, and cargo tracking platform called "NexusFreight Global Supply Chain OS".

Tech stack: Next.js (App Router) with Tailwind CSS.

Visual style: commanding industrial dark mode (#070d19). Deep ocean blue (#3b82f6) and safety amber (#f59e0b) accents. Clean tabular data displays, high-contrast monospace tracking numbers, and interactive shipping status badges.

Sections, in order:
1. Top Bar: "Real-time global trade update: Ports operating at 99.4% capacity. Carbon-neutral shipping available across all routes."
2. Navbar: bold industrial logo, links ("Tracking", "Freight Solutions", "Rate Calculator", "Customs & Trade", "About"), and "Track Cargo" button.
3. Hero: centered layout.
   - Headline: "Autonomous global freight forwarding & real-time tracking".
   - Subtitle: "Connect your supply chain with end-to-end visibility across 220+ ports. Book, track, and clear customs in one unified enterprise portal."
   - Universal Tracking Search Card: high-contrast input box "Enter Container #, Bill of Lading (B/L) or Air Waybill (AWB)", with "Track Shipment &rarr;" button and quick example tags (e.g. MSKU9281924, 023-8472910).
   - Live Tracking Card Simulation: displays container route (Shanghai Port &rarr; Rotterdam), current status "In Transit - Red Sea Corridor", estimated ETA (28 Oct 2026), vessel name, and GPS coordinates.
4. Multimodal Transport Options: 4 capability cards: 1) Full Container Load (FCL) Ocean Freight, 2) Expedited Air Cargo with guaranteed capacity, 3) Intermodal Rail Logistics, 4) Temperature-Controlled Cold Chain.
5. Instant Freight Rate Estimator: interactive calculator where users pick Origin Port, Destination Port, Container Size (20ft vs 40ft), Cargo Weight, and view estimated transit days and price.
6. Enterprise Scale Metrics: 4 stats: "$14B+ Cargo Handled Annually", "2,400+ Global Trade Lanes", "99.8% On-Time Delivery", "&lt; 2hr Customs Clearance".
7. Enterprise Integrations: ERP and warehouse integration logos (SAP, Oracle, NetSuite, Shopify, Flexport).
8. Customer Case Studies: quotes from Supply Chain Directors at major manufacturers and retail brands.
9. Request Enterprise Rate Consultation: form for booking customized high-volume freight agreements.
10. Footer: port directory, customs regulations library, bill of lading terms, and international office locations.`,
    followUps: [
      "Add interactive shipment status step visualizer (Booked -> In Transit -> Customs -> Delivered).",
      "Add carbon footprint CO2 emissions calculation per shipping route.",
      "Add simulated webhook payload preview for logistics API integration.",
      "Add Schema.org Organization and LogisticsService structured data."
    ],
    tips: [
      "Use realistic container codes and shipping terminology (TEU, FCL, LCL, demurrage, incoterms).",
      "Ensure tracking inputs accept paste events and provide clear instant loading states."
    ],
  }),
  p({
    slug: "tech-conference-summit-prompt",
    name: "Tech Conference & Hackathon Event",
    industry: "Education",
    tone: "dark",
    layout: "centered",
    palette: ["#020617", "#ffffff", "#a855f7", "#ec4899"],
    stack: "Next.js (App Router) + Tailwind CSS",
    sections: [
      "Marquee ribbon with dates and host city ('18-20 November 2026 · Bengaluru & Online')",
      "Navbar with Schedule, Speakers, Hackathon, and Register Passes",
      "Hero with event teaser reel, speaker lineup, and live countdown timer",
      "Keynote speaker avatar grid with company affiliations and talk titles",
      "Multi-track interactive agenda schedule (Track A: AI Systems, Track B: Cloud & DevOps, Track C: Web3)",
      "$50,000 Hackathon bounty challenges and judging criteria",
      "Early-bird and VIP ticket tier pricing cards with pass perks",
      "Past year conference highlights video and photo recap",
      "Sponsor logo tiers (Titanium, Platinum, Community Partners)",
      "Venue directions, travel recommendations, and hotel discounts",
      "Footer with code of conduct and student scholarship application"
    ],
    description:
      "An electrifying tech summit and hackathon event page with keynote speaker lineups, multi-track agenda timelines, and ticket tier passes.",
    prompt: `
Build a high-energy, futuristic conference and hackathon event website called "NextGen AI & Cloud Summit 2026".

Tech stack: Next.js (App Router) with Tailwind CSS.

Visual style: electrifying cyber-dark aesthetic (#020617 background). Radiant ultraviolet (#a855f7) and neon fuchsia (#ec4899) gradients. Glassmorphic ticket cards, glowing interactive buttons, and high-contrast typography.

Sections, in order:
1. Top Marquee Ribbon: continuous subtle ticker "✦ 18-20 November 2026 · Palace Grounds, Bengaluru · In-Person & Global Livestream ✦".
2. Navbar: futuristic event logo, links ("Speakers", "Agenda", "Hackathon", "Sponsors", "Venue"), and "Get Tickets" gradient button.
3. Hero: centered layout.
   - Badge: "✦ Asia's Largest Developer & AI Architecture Summit".
   - Headline: "Build the future of intelligence with 5,000+ engineers".
   - Subtitle: "3 days of deep-dive keynotes, production architecture breakdowns, hands-on workshops, and a $50,000 hackathon."
   - Live Countdown Timer: countdown cards showing Days, Hours, Minutes, and Seconds until the keynote kicks off.
   - Dual CTAs: "Grab Early Bird Ticket &rarr;" and "View 60+ Speaker Lineup".
4. Headline Keynote Speakers: 6 speaker cards with high-contrast portraits, speaker name, role (e.g., VP of AI @ Anthropic, Chief Architect @ Vercel), and keynote title (e.g., "Autonomous Multi-Agent Swarms in Production").
5. Interactive Multi-Track Agenda: tabbed daily schedule (Day 1: AI & LLMs, Day 2: Scalable Cloud Architecture, Day 3: Hackathon Demo Day) showing time slots, session title, speaker, and stage room badge.
6. The $50,000 Hackathon: breakdown of prize bounties across 4 tracks: Autonomous AI Agents ($20k), Decentralized Infrastructure ($15k), Developer Productivity ($10k), and Student Innovator ($5k).
7. Ticket Pricing Passes: 3 tiers: 1) Virtual Access ($49 / ₹3,999 with 4K livestream), 2) In-Person Standard ($199 / ₹14,999 with conference kit & lunch), 3) VIP All-Access ($399 / ₹29,999 with Speaker Dinner & Workshop Pass).
8. Past Event Numbers: 4 stats: "5,400+ Attendees", "62 Global Keynotes", "120+ Venture Pitch Meetings", "99% Recommendation Score".
9. Sponsors & Partners: logo grid categorized into Titanium, Platinum, and Community Hackathon Partners.
10. Venue & Travel: interactive venue map placeholder, local hotel discounts, and public transit guide.
11. Footer: Code of Conduct, Student Scholarship Application, press kit download, and copyright.`,
    followUps: [
      "Add interactive tab switching for the 3 conference tracks.",
      "Add live ticket checkout modal with quantity selector and promo code field.",
      "Add Speaker bio detail drawer modal with full abstract description.",
      "Add Event and EventAttendanceModeSchema JSON-LD structured data."
    ],
    tips: [
      "Highlight speaker credentials and recognizable company names to drive early pass registrations.",
      "Keep ticket tier perks clear and visually distinct with checkmarks."
    ],
  }),
  p({
    slug: "boutique-fashion-store-prompt",
    name: "Boutique D2C Fashion Store",
    industry: "E-commerce",
    tone: "light",
    layout: "centered",
    palette: ["#fafaf9", "#18181b", "#71717a", "#b91c1c"],
    stack: "Next.js (App Router) + Tailwind CSS",
    sections: [
      "Free express shipping and complimentary returns banner",
      "Minimalist brand header with slide-out cart count and wishlist icon",
      "Full-height editorial seasonal lookbook hero with 'Explore Collection' CTA",
      "Category visual tiles (Tailored Outerwear, Silk Essentials, Italian Leather, Knitwear)",
      "Curated product catalog grid with interactive color swatch previews",
      "Product quick-view drawer with size selector and fabric composition",
      "Sustainable craftsmanship and ethical European mill sourcing story",
      "Customer styling lookbook grid (tagged #AtelierLiving)",
      "VIP Collector newsletter with 15% first order invitation",
      "Footer with garment care guides, size chart, and boutique locations"
    ],
    description:
      "A refined luxury D2C fashion ecommerce store featuring lookbook collections, interactive color swatch previews, and editorial styling.",
    prompt: `
Build a luxury, editorial D2C apparel and fashion boutique website called "Atelier Marais: Modern Wardrobe Essentials".

Tech stack: Next.js (App Router) with Tailwind CSS.

Visual style: Parisian luxury editorial. Warm alabaster background (#fafaf9), deep charcoal typography (#18181b), muted slate (#71717a) for descriptions, and crimson (#b91c1c) for sale tags and stock alerts. High-fashion photography framing, minimalist lines, and generous padding.

Sections, in order:
1. Top Strip: "Complimentary global shipping on all orders over $250. Duties & taxes included."
2. Header: clean centered serif wordmark logo, left links ("Collections", "New Arrivals", "Outerwear", "Tailoring"), right icons (Search, Wishlist, Bag with item counter).
3. Hero: full-height editorial campaign shot.
   - Headline: "Autumn/Winter 2026: Sculptural Wool & Cashmere".
   - Subtitle: "Hand-finished in Northern Italy with sustainable GOTS-certified fibres."
   - Dual CTAs: "Shop the Collection" and "View Autumn Lookbook".
4. Curated Collections Bento: 4 visual categories: 1) Double-Faced Cashmere Coats, 2) Tailored Pleated Trousers, 3) Raw Mulberry Silk Shirts, 4) Vegetable-Tanned Leather Goods.
5. Featured Product Grid: 4 product cards displaying: product photo, garment title (e.g., "The Oversized Camel Trench"), price ($480), interactive color swatch circles (Camel, Espresso, Obsidian) that swap preview images, size availability tags (XS to XL), and "Quick Add" hover button.
6. The Craftsmanship Ethos: 3 pillar statements explaining small-batch production runs, transparent factory wages, and lifetime garment repair warranty.
7. Customer Styling Community: 6 Instagram lookbook photo cards showing real customers wearing the collection with product tag tags.
8. VIP Access Newsletter: clean email capture card offering 15% off first order and private access to archive sample sales.
9. Footer: comprehensive navigation columns (Garment Care Guides, Traceability Map, Size & Fit Concierge, Press Inquiries) and payment method badges.`,
    followUps: [
      "Add interactive slide-out side cart drawer with item counter and free shipping progress bar.",
      "Add interactive color swatch click handlers that dynamically update the main product image.",
      "Add interactive size chart modal with unit conversion (US / UK / EU).",
      "Add Product and AggregateOffer JSON-LD structured data."
    ],
    tips: [
      "Use high-fashion photography aspect ratios (3:4 or 4:5 portrait) for product tiles.",
      "Keep typography refined with tracking-wide and uppercase category labels."
    ],
  }),
  p({
    slug: "mental-health-therapy-prompt",
    name: "Mental Health & Wellness Therapy",
    industry: "Health",
    tone: "light",
    layout: "split",
    palette: ["#fbfcf8", "#1e293b", "#0d9488", "#ca8a04"],
    stack: "Next.js (App Router) + Tailwind CSS",
    sections: [
      "Confidential care guarantee strip with 24/7 crisis support line",
      "Serene navigation bar with Specialty areas and Book Intro Session button",
      "Hero with personalized 2-minute therapist matching questionnaire card",
      "Core therapy specialties (Anxiety, Depression, Workplace Burnout, Couples)",
      "Licensed clinical psychologist and psychotherapist profile cards",
      "How virtual and in-person therapy sessions work (3 steps)",
      "Insurance coverage checker & sliding-scale fee options",
      "Client healing reflections and clinical outcome statistics",
      "Evidence-based therapeutic modalities (CBT, EMDR, Mindfulness)",
      "FAQ answering privacy, session frequency, and therapist fit concerns",
      "Footer with crisis intervention hotlines and clinical licensing info"
    ],
    description:
      "A calming, confidential mental health and psychotherapy platform with therapist matching questionnaires, insurance verification, and booking.",
    prompt: `
Build a compassionate, calming mental health and psychotherapy clinic website called "SereneMind Therapy & Wellness Clinic".

Tech stack: Next.js (App Router) with Tailwind CSS.

Visual style: tranquil, organic, and restorative. Soft sage/linen background (#fbfcf8), dark slate typography (#1e293b), calming eucalyptus teal (#0d9488) for primary buttons, and warm ochre (#ca8a04) for accreditation stars. Gentle rounded borders (20px), generous breathing room, and zero aggressive sales tactics.

Sections, in order:
1. Reassurance Strip: "100% Confidential & Secure Care. If you are experiencing a crisis, please call or text 988 immediately."
2. Navbar: gentle botanical leaf logo, links ("Specialties", "Our Therapists", "How It Works", "Insurance", "Resources"), and "Book Consultation" teal button.
3. Hero: split layout.
   - Left side: badge "✦ Licensed Clinical Psychologists", headline "Find your path to healing, clarity, and peace of mind", supporting paragraph on personalized therapy tailored to your goals in a compassionate, judgment-free space.
   - Right side: an interactive matching questionnaire card: "Find Your Ideal Therapist" with question dropdowns for What brings you in today? (Anxiety, Depression, Life Transition, Relationship), Preferred format (Virtual Video or In-Person Clinic), and "Match with a Clinician" button.
4. Practice Highlights: 4 reassurance points: "Board-Licensed Psychologists", "Virtual & In-Person Options", "Covered by Major Insurance", "Flexible Evening & Weekend Slots".
5. Specialty Focus Areas: 6 gentle cards for: 1) Anxiety & Panic Relief, 2) Depression & Burnout, 3) Couples & Relationship Counseling, 4) Trauma & EMDR Therapy, 5) Grief & Loss Support, 6) Mindfulness & Stress Regulation.
6. Meet Our Clinicians: 3 therapist cards showing photo, full name, credentials (e.g., Psy.D, Licensed Marriage & Family Therapist), areas of expertise, and an "Accepting New Clients" green badge.
7. Simple 3-Step Journey: 1) Take the 2-minute matching quiz, 2) Have a free 15-minute phone consultation to ensure right fit, 3) Begin weekly sessions online or at our peaceful clinic.
8. Insurance & Transparent Fees: clear explanation of in-network insurance partners (Blue Cross, Aetna, Cigna) and out-of-network sliding scale rates starting at $65/session.
9. Patient Reflections: 3 heartwarming, anonymous client testimonials highlighting personal growth and newfound resilience.
10. FAQ: 6 thoughtful questions covering therapist matching guarantees, privacy encryption, and what to expect during session 1.
11. Footer: emergency crisis resources, state psychology board licensing, HIPAA compliance statement, and copyright.`,
    followUps: [
      "Add interactive multi-step therapist matching quiz modal.",
      "Add insurance verification search tool where visitors check their exact co-pay.",
      "Add audio player widget with 2-minute guided breathing mindfulness exercise.",
      "Add MedicalClinic and Counselor JSON-LD structured data."
    ],
    tips: [
      "Always display the 988 Suicide & Crisis Lifeline clearly in the header and footer.",
      "Use calming, destigmatizing language that encourages seeking help with dignity."
    ],
  }),
];

export function getAllPrompts() {
  return prompts;
}

export function getPrompt(slug) {
  return prompts.find((item) => item.slug === slug);
}

export function getRelatedPrompts(prompt, limit = 3) {
  const sameIndustry = prompts.filter((item) => item.slug !== prompt.slug && item.industry === prompt.industry);
  const others = prompts.filter((item) => item.slug !== prompt.slug && item.industry !== prompt.industry);
  return [...sameIndustry, ...others].slice(0, limit);
}
