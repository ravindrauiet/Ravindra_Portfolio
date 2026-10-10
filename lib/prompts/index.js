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
