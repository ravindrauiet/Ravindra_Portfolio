// Additional website prompts (batch added November 2026). Same shape as the entries in index.js;
// index.js appends the shared quality bar to each prompt.

export const MORE_WEBSITE_PROMPTS = [
  {
    slug: "beach-resort-hotel-prompt",
    name: "Beach Resort & Hotel",
    industry: "Hospitality",
    tone: "light",
    layout: "split",
    palette: ["#fffdf8", "#0b3b3c", "#0f766e", "#f59e0b"],
    stack: "Next.js (App Router) + Tailwind CSS",
    sections: ["Navbar with Book now", "Hero with booking bar", "Room types", "Experiences", "Dining", "Guest reviews", "Offers", "Location", "Footer"],
    description:
      "A relaxed, premium website for a beach resort or boutique hotel with a date-and-guests booking bar, room cards, experiences, dining, reviews and seasonal offers.",
    prompt: `
Build a complete website for a boutique beach resort called "Coral Cove Resort" in South Goa, India.

Tech stack: Next.js (App Router) with Tailwind CSS. Split the page into components in a components/ folder. Server Components by default; add "use client" only for the booking bar, gallery and carousel.

Visual style: calm and premium. Warm off-white background (#fffdf8), deep sea-green text (#0b3b3c), teal (#0f766e) for buttons and links, and sunset amber (#f59e0b) as a small accent. An elegant serif for headings (such as DM Serif Display) with a clean sans-serif for body text. Large photos, soft rounded corners and plenty of white space.

Sections, in order:
1. Navbar: logo, links (Rooms, Experiences, Dining, Offers, Contact) and a "Book now" button. Transparent over the hero, solid white after scrolling.
2. Hero: full-width beach photo with a soft dark gradient, headline "Slow mornings by the Arabian Sea", one supporting line, and a booking bar with check-in date, check-out date, guests and a "Check availability" button.
3. Room types: three room cards (Garden Cottage, Sea-view Suite, Private Pool Villa) with photo, size in sq ft, guests, three amenities and the price per night in rupees.
4. Experiences: a grid of six experiences (Sunrise yoga, Kayaking, Spa rituals, Spice farm tour, Beach bonfire, Cooking class) with icons and one line each.
5. Dining: two columns with the restaurant photo on one side and the story, timings and a "View menu" link on the other.
6. Guest reviews: three reviews with star rating, guest name, city and stay date, plus an overall rating badge (4.8 from 1,200+ reviews).
7. Offers: two highlighted offer cards ("Monsoon escape: 3 nights for the price of 2" and "Honeymoon package") with validity dates and a button.
8. Location: map placeholder, address, distance from Goa airport, check-in and check-out times and a "Get directions" button.
9. Footer: logo, contact details, social links, quick links and a newsletter field.

Interactions: the booking bar validates that check-out is after check-in and shows the number of nights; room cards zoom their photo slightly on hover; sections fade in as they scroll into view.`,
    followUps: [
      "Build a /rooms/[slug] page for each room with a photo gallery, full amenity list, a price calendar and a booking form.",
      "Add a multi-step booking flow: dates and room → guest details → review and confirm, with a confirmation screen.",
      "Add Hotel and LocalBusiness JSON-LD with address, price range and aggregate rating.",
      "Add a Hindi language toggle using a simple translations file.",
    ],
    tips: [
      "Use your real photos: for a hotel, photography matters more than any other part of the design.",
      "Keep the booking bar visible in the hero; most visitors come to check dates and prices.",
    ],
  },
  {
    slug: "salon-spa-website-prompt",
    name: "Salon & Spa Website",
    industry: "Health",
    tone: "light",
    layout: "split",
    palette: ["#fdf8f6", "#3f2a2e", "#be185d", "#d4a373"],
    stack: "Next.js (App Router) + Tailwind CSS",
    sections: ["Navbar with Book appointment", "Split hero", "Services menu with prices", "Packages", "Stylists", "Before and after", "Reviews", "Appointment form", "Footer"],
    description:
      "An elegant website for a hair salon, beauty studio or day spa: service menu with prices, packages, stylists, before-and-after gallery and an appointment form.",
    prompt: `
Build a complete website for a premium salon and day spa called "Lumière Salon & Spa" in Bandra, Mumbai.

Tech stack: Next.js (App Router) with Tailwind CSS. Components in a components/ folder; "use client" only for the service tabs, the before-and-after slider and the appointment form.

Visual style: soft, elegant and feminine without being sugary. Blush white background (#fdf8f6), deep plum-brown text (#3f2a2e), berry pink (#be185d) for buttons and links, and a muted gold (#d4a373) for small details. An elegant serif for headings (such as Cormorant Garamond) and a clean sans-serif for body text. Rounded image corners and thin gold divider lines.

Sections, in order:
1. Navbar: logo, links (Services, Packages, Stylists, Gallery, Contact) and a "Book appointment" button.
2. Hero: split layout with the headline "Look good. Feel better.", a short line about the salon, buttons ("Book appointment", "View services") and a tall portrait photo with a small floating card showing "4.9 rating · 2,000+ happy clients".
3. Services menu: tabs (Hair, Skin, Nails, Spa) and, under each tab, a list of services with duration and price in rupees, like a restaurant menu.
4. Packages: three cards (Bridal glow, Monthly self-care, Men's grooming) with what is included, price and a "Book package" button.
5. Stylists: four team cards with photo, name, speciality and years of experience.
6. Before and after: a draggable before/after comparison slider for two transformations.
7. Reviews: three client reviews with star rating and the service they booked.
8. Appointment form: service, preferred stylist, date, time slot, name and phone, with validation and a confirmation message.
9. Footer: address, opening hours, phone, WhatsApp link, Instagram link and a small map placeholder.

Interactions: tab switching is keyboard accessible; the before/after slider works with mouse, touch and arrow keys; cards lift slightly on hover.`,
    followUps: [
      "Add a gift card section with amounts and a purchase form (UI only).",
      "Show only available time slots for the chosen date, using mock data.",
      "Add BeautySalon JSON-LD with opening hours and price range.",
      "Add a loyalty programme section that explains points and rewards.",
    ],
    tips: [
      "Put prices on the page; clients compare salons by price and duration before calling.",
      "Use your own before-and-after photos with the client's permission.",
    ],
  },
  {
    slug: "yoga-wellness-studio-prompt",
    name: "Yoga & Wellness Studio",
    industry: "Health",
    tone: "light",
    layout: "centered",
    palette: ["#f7f5ef", "#1f2d24", "#4d7c0f", "#e07a5f"],
    stack: "Next.js (App Router) + Tailwind CSS",
    sections: ["Navbar", "Calm hero", "Class styles", "Weekly schedule", "Teachers", "Membership plans", "Retreats", "Testimonials", "Footer"],
    description:
      "A calm website for a yoga studio or wellness centre with class styles, a filterable weekly schedule, teachers, membership plans and retreats.",
    prompt: `
Build a complete website for a yoga and wellness studio called "Prana Yoga House" in Indiranagar, Bengaluru.

Tech stack: Next.js (App Router) with Tailwind CSS. Components in a components/ folder; "use client" only for the schedule filter and the plan toggle.

Visual style: calm, natural and grounded. Warm stone background (#f7f5ef), deep forest text (#1f2d24), olive green (#4d7c0f) for buttons, and terracotta (#e07a5f) as a soft accent. A gentle serif for headings (such as Fraunces) with a clean sans-serif for body text. Organic rounded shapes, lots of breathing room, no harsh shadows.

Sections, in order:
1. Navbar: logo, links (Classes, Schedule, Teachers, Pricing, Retreats) and a "Book a class" button.
2. Hero: centred headline "Breathe in. Slow down.", a supporting line, buttons ("Try your first class free", "See schedule") and a wide photo of a sunlit studio below.
3. Class styles: six cards (Hatha, Vinyasa flow, Yin, Pranayama, Prenatal, Meditation) with level and duration.
4. Weekly schedule: a timetable for Monday to Sunday with class name, time, teacher and level, filterable by level (All, Beginner, Intermediate, Advanced).
5. Teachers: four teacher cards with photo, name, style and certification (such as RYT-500).
6. Membership plans: three plans (Drop-in, 10-class pack, Unlimited monthly) with prices in rupees and a "Best value" badge on the monthly plan.
7. Retreats: two upcoming retreat cards (Rishikesh, Coorg) with dates, nights, price and seats left.
8. Testimonials: three student quotes with name and how long they have practised.
9. Footer: address, timings, contact, social links and a newsletter field.

Interactions: the schedule filter updates without reloading; today's day is highlighted in the schedule; gentle fade-in on scroll.`,
    followUps: [
      "Build a booking modal for each class in the schedule with name, phone and a spot counter.",
      "Add an online classes section with a Zoom schedule and a separate price.",
      "Add a blog with three articles about beginner yoga, built from Markdown files.",
      "Add HealthClub JSON-LD with the address and opening hours.",
    ],
    tips: [
      "Keep the free first class offer near the top; it is the easiest yes for a new student.",
      "Update the schedule in one data file so it stays easy to change every week.",
    ],
  },
  {
    slug: "photographer-portfolio-prompt",
    name: "Photographer Portfolio",
    industry: "Portfolio",
    tone: "dark",
    layout: "split",
    palette: ["#0c0c0c", "#f5f5f4", "#e9c46a", "#525252"],
    stack: "HTML, CSS and a little vanilla JavaScript",
    sections: ["Minimal navbar", "Full-screen hero", "Featured series", "Gallery with filters", "Services and packages", "About", "Client words", "Enquiry form", "Footer"],
    description:
      "A dark, image-first portfolio for a wedding, portrait or travel photographer with filterable gallery, lightbox, packages and an enquiry form.",
    prompt: `
Build a complete portfolio website for a wedding and portrait photographer called "Aarav Mehta Photography", based in Jaipur.

Tech stack: plain HTML, CSS and a small amount of vanilla JavaScript (no frameworks), so it can be hosted anywhere.

Visual style: dark and cinematic so the photos stand out. Near-black background (#0c0c0c), warm off-white text (#f5f5f4), soft gold (#e9c46a) for links and buttons, and grey (#525252) for secondary text. A refined serif for headings (such as Playfair Display) and a clean sans-serif for body text. Thin lines, wide margins and very little decoration.

Sections, in order:
1. Minimal navbar: name as a text logo, links (Work, Services, About, Contact) and an "Enquire" button.
2. Hero: one full-screen photo with the name, "Weddings · Portraits · Travel" and a scroll hint.
3. Featured series: three large story cards (A Rajasthani wedding, Monsoon in Udaipur, Studio portraits) with title, location and year.
4. Gallery: a masonry grid of 12 photos with filter buttons (All, Weddings, Portraits, Travel) and a keyboard-accessible lightbox with next/previous.
5. Services and packages: three packages (Portrait session, Pre-wedding shoot, Full wedding) with what is included and the starting price in rupees.
6. About: portrait photo, a short personal story, gear list and the cities covered.
7. Client words: three short quotes from couples and clients.
8. Enquiry form: name, email, phone, event type, event date and message, with validation and a thank-you message.
9. Footer: Instagram link, email, phone and copyright.

Interactions: images lazy-load with a gentle fade; the lightbox closes with Escape and traps focus; filters animate the grid smoothly.`,
    followUps: [
      "Add a client gallery page protected by a simple access code (front-end only, for previews).",
      "Convert images to responsive srcset with WebP versions for faster loading.",
      "Add a testimonials carousel with autoplay that pauses on hover.",
      "Add Person and LocalBusiness JSON-LD for local search.",
    ],
    tips: [
      "Pick only your best 12 photos for the gallery; a tight selection looks more professional than 100 average ones.",
      "Compress photos before uploading; large image files are the main reason photography sites feel slow.",
    ],
  },
  {
    slug: "job-board-platform-prompt",
    name: "Job Board Platform",
    industry: "SaaS",
    tone: "light",
    layout: "centered",
    palette: ["#ffffff", "#111827", "#4f46e5", "#10b981"],
    stack: "Next.js (App Router) + Tailwind CSS",
    sections: ["Navbar", "Search hero", "Popular categories", "Featured jobs", "Top companies", "How it works", "For employers", "Testimonials", "Footer"],
    description:
      "A job board website with a keyword-and-location search hero, job categories, featured job cards, company logos and a section for employers to post jobs.",
    prompt: `
Build a complete job board website called "HireLoop", focused on tech and startup jobs in India.

Tech stack: Next.js (App Router) with Tailwind CSS. Components in a components/ folder; keep job data in a local data file; "use client" only for search and filters.

Visual style: clean, friendly and trustworthy. White background (#ffffff), near-black text (#111827), indigo (#4f46e5) for buttons and links, and emerald (#10b981) for "New" and salary tags. A modern sans-serif such as Inter, rounded 14px cards with light borders.

Sections, in order:
1. Navbar: logo, links (Find jobs, Companies, Salaries, For employers), "Sign in" link and a "Post a job" button.
2. Search hero: headline "Find work you'll love", a search bar with keyword, location and experience fields and a "Search jobs" button, and popular searches as chips.
3. Popular categories: eight category tiles (Engineering, Design, Product, Data, Marketing, Sales, Support, Operations) with open-role counts.
4. Featured jobs: six job cards with company logo, title, company, location, remote/hybrid tag, salary range in LPA, posted time and a save button.
5. Top companies: a grid of eight company cards with logo, rating and number of open jobs.
6. How it works: three steps (Create a profile, Apply in one click, Get hired).
7. For employers: a two-column band with benefits and a "Post your first job free" button.
8. Testimonials: three quotes from people who got hired, with role and company.
9. Footer: four link columns, app store badges and copyright.

Interactions: saving a job toggles a filled bookmark and updates a saved count in the navbar; the search form keeps its values in the URL query string.`,
    followUps: [
      "Build /jobs with a filter sidebar (location, remote, salary, experience, job type), sort options and pagination.",
      "Build /jobs/[slug] with the full description, requirements, company card, similar jobs and an apply form with a resume upload field.",
      "Add an employer dashboard with posted jobs, applicants per job and a status pipeline.",
      "Add JobPosting JSON-LD to each job page so jobs can appear in Google for Jobs.",
    ],
    tips: [
      "JobPosting structured data is the single biggest SEO win for a job board.",
      "Show the salary range on every card; listings with salaries get far more clicks.",
    ],
  },
  {
    slug: "grocery-delivery-app-prompt",
    name: "Grocery Delivery App",
    industry: "E-commerce",
    tone: "light",
    layout: "split",
    palette: ["#f7fdf9", "#052e16", "#16a34a", "#facc15"],
    stack: "Next.js (App Router) + Tailwind CSS",
    sections: ["Navbar with cart", "Location hero", "Shop by category", "Deals of the day", "Best sellers", "How it works", "App download", "Reviews", "Footer"],
    description:
      "A quick-commerce grocery website with a delivery-location hero, categories, deals, product cards with add-to-cart steppers and an app download section.",
    prompt: `
Build a complete website for a 10-minute grocery delivery service called "Basketly", operating in Delhi NCR.

Tech stack: Next.js (App Router) with Tailwind CSS. Components in a components/ folder; product data in a local file; cart state in a small React context saved to localStorage.

Visual style: fresh, cheerful and fast. Mint white background (#f7fdf9), deep green text (#052e16), fresh green (#16a34a) for buttons, and sunny yellow (#facc15) for deal badges. A friendly rounded sans-serif such as Plus Jakarta Sans, rounded 16px cards, clear product photos on white.

Sections, in order:
1. Navbar: logo, a delivery location selector ("Delivering to Sector 62, Noida"), a product search field, "Login" and a cart button with item count and total.
2. Hero: split layout with the headline "Groceries in 10 minutes", a pincode field with a "Check delivery" button, three trust points (Fresh, Fast, Fair prices) and a photo of a filled grocery bag.
3. Shop by category: ten round category tiles (Fruits, Vegetables, Dairy, Bakery, Snacks, Beverages, Staples, Personal care, Cleaning, Baby care).
4. Deals of the day: a horizontally scrolling row of product cards with discount badge, MRP struck through and an end-of-day countdown.
5. Best sellers: a grid of eight product cards with photo, name, pack size, price and an "Add" button that turns into a quantity stepper.
6. How it works: three steps (Choose items, Pay securely, Delivered in minutes).
7. App download: a band with a phone mockup, rating and app store badges.
8. Reviews: three customer reviews with rating and area.
9. Footer: categories, company links, cities served and copyright.

Interactions: adding items updates the navbar cart count and total instantly; the stepper never goes below zero (zero removes the item); the deals countdown ticks every second.`,
    followUps: [
      "Build a slide-in cart drawer with line items, a free-delivery progress bar (free above ₹199), coupon field and checkout button.",
      "Build /category/[slug] with filters (brand, price, discount) and sort options.",
      "Build a checkout page with address selection, delivery slot and payment method (UI only).",
      "Add Product and Offer JSON-LD to product cards.",
    ],
    tips: [
      "Replace product images with real packshots on a white background; consistency makes the grid look premium.",
      "Show the delivery time and fee before checkout; surprises at checkout lose orders.",
    ],
  },
  {
    slug: "preschool-kindergarten-prompt",
    name: "Preschool & Kindergarten",
    industry: "Education",
    tone: "light",
    layout: "split",
    palette: ["#fffbeb", "#1e3a5f", "#f97316", "#22c55e"],
    stack: "Next.js (App Router) + Tailwind CSS",
    sections: ["Navbar", "Warm hero", "Programs by age", "Why parents choose us", "A day at school", "Facilities", "Teachers", "Admissions enquiry", "Footer"],
    description:
      "A warm, trustworthy website for a preschool, playschool or kindergarten with programs by age, a day-at-school timeline, facilities, teachers and an admissions form.",
    prompt: `
Build a complete website for a preschool called "Little Sprouts Preschool" in Pune.

Tech stack: Next.js (App Router) with Tailwind CSS. Components in a components/ folder; "use client" only for the admissions form.

Visual style: warm, friendly and trustworthy for parents, not childish. Cream background (#fffbeb), deep navy text (#1e3a5f), orange (#f97316) for buttons, and green (#22c55e) for small highlights. A rounded, readable font such as Nunito. Soft rounded shapes and real photos of children learning (placeholders for now).

Sections, in order:
1. Navbar: logo, links (Programs, Our day, Facilities, Teachers, Admissions) and an "Enquire now" button, plus the phone number.
2. Hero: split layout with the headline "Where curious little minds grow", a line about play-based learning, buttons ("Book a school visit", "Download brochure") and a photo, with a badge "Admissions open 2027–28".
3. Programs by age: four cards (Playgroup 1.5–2.5 yrs, Nursery 2.5–3.5 yrs, Junior KG 3.5–4.5 yrs, Senior KG 4.5–5.5 yrs) with timings and focus areas.
4. Why parents choose us: six points (Small class sizes, Trained teachers, CCTV for parents, Healthy meals, Safe transport, Daily updates app) with icons.
5. A day at school: a vertical timeline from arrival to pick-up (Circle time, Free play, Snack, Story time, Art, Outdoor play).
6. Facilities: a photo grid of classrooms, play area, library corner and art room.
7. Teachers: four teacher cards with photo, name, role and qualification.
8. Admissions enquiry: parent name, phone, email, child's age (select), preferred program and a "Request a call back" button, with validation and a thank-you message.
9. Footer: address, timings, phone, email, map placeholder and social links.

Interactions: the timeline items reveal one by one on scroll; the form shows inline errors and a friendly success state.`,
    followUps: [
      "Add a fees page with a clear table per program and a payment schedule.",
      "Add a parent testimonials video section with poster images.",
      "Add a gallery page with albums for events (Annual day, Sports day, Diwali celebration).",
      "Add Preschool (EducationalOrganization) JSON-LD with address and contact.",
    ],
    tips: [
      "Parents look for safety first: keep CCTV, transport and teacher qualifications easy to find.",
      "Make the phone number tap-to-call on mobile; many parents prefer to call.",
    ],
  },
  {
    slug: "ai-customer-support-chatbot-prompt",
    name: "AI Customer Support Chatbot",
    industry: "AI / Tech",
    tone: "dark",
    layout: "split",
    palette: ["#070b14", "#ffffff", "#22d3ee", "#a78bfa"],
    stack: "Next.js (App Router) + Tailwind CSS",
    sections: ["Navbar", "Hero with live chat demo", "Integrations", "Features bento", "How it works", "Analytics", "Pricing", "Security", "Footer"],
    description:
      "A dark, modern landing page for an AI customer support agent with an animated chat demo, integrations, features, analytics preview, pricing and security.",
    prompt: `
Build a complete landing page for an AI customer support agent called "Replyfy", which answers customer questions on websites and WhatsApp using a company's own help docs.

Tech stack: Next.js (App Router) with Tailwind CSS. Components in a components/ folder; "use client" only for the chat demo and the pricing toggle.

Visual style: dark, sharp and modern. Deep navy-black background (#070b14), white text (#ffffff), cyan (#22d3ee) for buttons and highlights, and soft violet (#a78bfa) for gradients and secondary accents. Inter for text and JetBrains Mono for small technical labels. Glassy cards with 1px borders and subtle glow, never neon overload.

Sections, in order:
1. Navbar: logo, links (Product, Integrations, Pricing, Docs), "Sign in" link and a "Start free" button.
2. Hero: split layout with the headline "Resolve 70% of support tickets instantly", a supporting line, buttons ("Start free", "Book a demo"), and on the right a chat widget demo where a customer message and an AI reply with a cited help-article link type out one after another.
3. Integrations: logos of eight tools (WhatsApp, Shopify, Zendesk, Freshdesk, Slack, Intercom, HubSpot, WordPress).
4. Features: a bento grid (Trained on your docs, Answers in 40+ languages, Human handoff, Order tracking actions, Brand tone control, Works 24/7).
5. How it works: three steps (Connect your docs, Customise the tone, Go live on web and WhatsApp).
6. Analytics: a dashboard preview with resolution rate, average response time, CSAT and a chart of conversations per day.
7. Pricing: three plans (Starter, Growth, Enterprise) with conversation limits, monthly/yearly toggle and prices in rupees.
8. Security: SOC 2, GDPR, data encryption and "your data is never used to train public models", with icons.
9. Footer: four link columns, status page link and copyright.

Interactions: the chat demo plays once when it scrolls into view and has a replay button; the pricing toggle updates prices and shows "Save 20%".`,
    followUps: [
      "Build a playground page where visitors type a question and get a mock AI answer with sources after a short loading state.",
      "Add a ROI calculator: tickets per month and cost per ticket → monthly savings.",
      "Add a case study page for one customer with before/after metrics.",
      "Add SoftwareApplication JSON-LD with pricing offers.",
    ],
    tips: [
      "Show a real-looking conversation in the hero; it explains the product faster than any headline.",
      "Be specific about data privacy; it is the first question support teams ask about AI.",
    ],
  },
  {
    slug: "insurance-comparison-prompt",
    name: "Insurance Comparison Website",
    industry: "Fintech",
    tone: "light",
    layout: "centered",
    palette: ["#f8fafc", "#0f172a", "#0e7490", "#f59e0b"],
    stack: "Next.js (App Router) + Tailwind CSS",
    sections: ["Navbar", "Quote hero with product tabs", "Insurer partners", "Why compare with us", "Plan comparison table", "Premium calculator", "Claim support", "FAQ", "Footer"],
    description:
      "A trustworthy insurance comparison website with product tabs (health, term, car, bike), a quote form, comparison table, premium calculator, claim support and FAQ.",
    prompt: `
Build a complete website for an insurance comparison platform called "CoverWise" in India.

Tech stack: Next.js (App Router) with Tailwind CSS. Components in a components/ folder; plan data in a local file; "use client" only for the quote tabs, calculator and FAQ.

Visual style: calm, clear and trustworthy. Cool white background (#f8fafc), slate-black text (#0f172a), deep teal (#0e7490) for buttons and links, and amber (#f59e0b) for "Best value" badges. Inter, rounded 14px cards, clear tables and generous spacing. Avoid any feeling of pressure selling.

Sections, in order:
1. Navbar: logo, links (Health, Term life, Car, Bike, Claims), "Talk to an advisor" phone link and a "Sign in" button.
2. Hero: headline "Compare insurance. Save up to 40%.", product tabs (Health, Term life, Car, Bike) and, under each tab, a short quote form (for Health: age, city, members covered) with a "View plans" button and the note "No spam calls. Ever."
3. Insurer partners: logos of eight insurers as a grid with "50+ insurers" text.
4. Why compare with us: four points (Unbiased comparison, Instant quotes, Free claim help, IRDAI registered broker) with icons.
5. Plan comparison table: four health plans side by side with cover amount, annual premium, waiting period, room rent limit, claim settlement ratio and a "Choose plan" button; the best one has a "Best value" badge.
6. Premium calculator: sliders for age and cover amount and a select for city tier, showing an estimated yearly premium that updates live.
7. Claim support: a three-step claim timeline and a highlighted "24x7 claim helpline" card.
8. FAQ: six common insurance questions in an accessible accordion.
9. Footer: product links, company links, IRDAI registration number placeholder, disclaimers and copyright.

Interactions: switching tabs swaps the form fields; the calculator updates as sliders move; the table scrolls horizontally on mobile with the first column fixed.`,
    followUps: [
      "Build a results page with filters (cover, premium, insurer, features), sorting and a compare-up-to-3 tray.",
      "Add a plan detail page with inclusions, exclusions, network hospitals search and a buy flow.",
      "Add FAQPage and FinancialProduct JSON-LD.",
      "Add a callback request modal that appears when the user is about to leave the page (desktop only).",
    ],
    tips: [
      "Use real registration details and clear disclaimers; insurance sites are judged on trust.",
      "Keep the first form short (three fields); ask for more details only after showing plans.",
    ],
  },
  {
    slug: "personal-blog-newsletter-prompt",
    name: "Personal Blog & Newsletter",
    industry: "Personal",
    tone: "light",
    layout: "centered",
    palette: ["#fffefb", "#1c1917", "#b45309", "#57534e"],
    stack: "Next.js (App Router) + Tailwind CSS + Markdown",
    sections: ["Navbar", "Intro hero with subscribe", "Featured essay", "Latest posts", "Topics", "Newsletter archive", "About the author", "Reader notes", "Footer"],
    description:
      "A calm, reading-first personal blog and newsletter with a subscribe hero, featured essay, latest posts, topics, newsletter archive and author section.",
    prompt: `
Build a complete personal blog and newsletter website called "The Quiet Build", written by an independent software developer about building products, careers and calm productivity.

Tech stack: Next.js (App Router) with Tailwind CSS. Posts are Markdown files in a content/ folder, read at build time. Server Components everywhere except the subscribe form.

Visual style: reading-first, warm and minimal. Paper white background (#fffefb), ink text (#1c1917), burnt amber (#b45309) for links and the subscribe button, and stone grey (#57534e) for dates and meta. A readable serif for headings and articles (such as Newsreader) with a small sans-serif for the interface. Line length around 65 characters, generous line height, no sidebars.

Sections, in order:
1. Navbar: the site name as a text logo, links (Writing, Newsletter, Topics, About) and a "Subscribe" button.
2. Intro hero: a short welcome ("Notes on building software and a calmer working life"), the number of readers ("Join 8,000+ readers"), an email field with a "Subscribe" button and "One email every Sunday. Unsubscribe anytime."
3. Featured essay: a large card with title, two-line excerpt, reading time, date and a "Read the essay" link.
4. Latest posts: a list of six posts with date, title, one-line summary and reading time.
5. Topics: tags with post counts (Product, Career, Productivity, Engineering, Writing, Tools).
6. Newsletter archive: the last five issues with issue number, title and date.
7. About the author: photo, a short bio, what the newsletter covers and links to social profiles.
8. Reader notes: three short quotes from readers.
9. Footer: RSS link, email, social links and copyright.

Interactions: the subscribe form validates the email and shows a success message; links have a subtle underline animation; the page supports a dark theme following the system setting.`,
    followUps: [
      "Build the /writing/[slug] article page with a table of contents, reading progress bar, code highlighting and previous/next links.",
      "Generate an RSS feed at /feed.xml from the Markdown posts.",
      "Connect the subscribe form to a Server Action that stores emails, with validation and duplicate checks.",
      "Add BlogPosting JSON-LD and dynamic Open Graph images for each article.",
    ],
    tips: [
      "Write five posts before launching so the site never looks empty.",
      "Keep the subscribe form both at the top and at the end of every article.",
    ],
  },
  {
    slug: "wedding-day-website-prompt",
    name: "Wedding Day (Shaadi) Website",
    industry: "Wedding & Events",
    tone: "light",
    layout: "centered",
    palette: ["#fff8ec", "#3d0710", "#7a0f1f", "#c9a227"],
    stack: "HTML, CSS, GSAP ScrollTrigger & Lenis",
    demo: "/demos/parallax-shaadi/index.html",
    sections: ["Navbar with event switcher", "Palace arch hero", "Our story", "Baraat procession", "Saat phere", "Order of ceremonies", "Travel & stay", "Blessings band", "RSVP with countdown", "Footer"],
    description:
      "A royal Indian wedding-day website with a parallax palace hero, a sideways baraat procession, the seven pheras animated around the sacred fire, ceremony timings, travel details and an RSVP.",
    prompt: `
Build a one-page Indian wedding-day website for a couple called "Ananya & Kabir", getting married at "Lakeview Haveli", Udaipur, on Saturday 13 February 2027 (baraat 6:00 pm, muhurat 8:14 pm).

Tech stack: one HTML file with inline CSS and JavaScript. Load GSAP 3.12.5 and ScrollTrigger from cdnjs and Lenis 1.1.13 from jsDelivr, and connect them (lenis.on("scroll", ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0)). Use gsap.matchMedia so phones get lighter versions without pinning.

Visual style: royal and warm. Ivory background (#fff8ec), deep maroon (#3d0710) and maroon (#7a0f1f) for text and buttons, antique gold (#c9a227) and pale gold (#f3d98b) for lines and accents, and a dusk sky from indigo to peach in the hero. Fonts: Cormorant Garamond (italic) for headings, Cinzel for small labels, Manrope for body, and Tiro Devanagari Hindi for "शुभ विवाह". Draw the palace, arch, lanterns and fire as inline SVG.

Sections, in order:
1. Navbar with event switcher: monogram "A&K", a pill switcher with links to the Haldi, Sangeet and Shaadi pages (Shaadi active), section links and a gold "RSVP" button. Dark gradient behind it so it stays readable.
2. Palace arch hero: a full-screen ivory jaali panel with a scalloped jharokha arch cut out of the middle (SVG evenodd path with gold and maroon outlines and hanging bells). Through the arch: stars, a low sun, hills, two palace silhouettes with domes, chhatris and lit arched windows, a lake with a reflection, a shimmering sun path and floating diyas. Inside the arch: "शुभ विवाह", "Ananya weds Kabir", the date and two buttons.
3. Our story: a short paragraph, four count-up stats (years together, home cities, vows, guests) and an arched photo frame with a red wax seal.
4. Baraat procession: five stop cards (Sehra bandi 5:00 pm, Ghodi chadhi 5:30 pm, Walk to the lake 6:00 pm, Dance at the gate 6:40 pm, Milni 7:00 pm) placed between SVG lanterns, a chhatri umbrella, a dhol and a marigold string, on a night sky with canvas fireworks.
5. Saat phere: a brass havan kund with animated flames, a circular path around it and seven diyas on the circle. A big counter shows "1 / 7", with the name and text of the current vow and seven progress pips.
6. Order of ceremonies: five columns (Varmala, Kanyadaan, Saat phere, Sindoor & mangalsutra, Dinner & blessings) with times and gold medallion icons on a thin gold line.
7. Travel & stay: a stylised SVG map (lake, venue pin, two guest hotels, airport) and three cards (flights, rooms, weather).
8. Blessings band: a full-width photo with a maroon overlay, "Your blessings are the only gift we need" and a short note.
9. RSVP with countdown: a live countdown to the muhurat and a form (name, phone, guests, meal, arrival day, city, room and airport-pickup checkboxes, message) that validates and shows a thank-you message.
10. Footer: two cards linking to the Haldi and Sangeet pages and a giant "Shubh Vivah".

Interactions: the hero is pinned for 150% and scrolling scales the arch to about 3.4× and fades it so you step through it, while the stars, sun, hills, far palace and near palace move at different speeds and the diyas drift. The baraat section is pinned and scrolls sideways. The saat phere section is pinned for about 420%: as you scroll, the couple (two joined circles) travels round the fire seven times, the vow text changes each round, the diyas light up one by one and a gold ring draws around the path. Medallions spin in, the giant footer letters rise, and smooth scrolling comes from Lenis. Under prefers-reduced-motion show every scene in its final state.`,
    followUps: [
      "Add a photo gallery after the ceremonies with a lightbox and a 'Pictured' caption under every photo.",
      "Turn the RSVP form into a real one: send it to a Google Sheet with a Google Apps Script web app and show the saved response.",
      "Add a Hindi / English language toggle that swaps every heading and paragraph from one translations object.",
      "Add a personalised invite: read ?guest=Name from the URL and greet the guest by name in the hero.",
    ],
    tips: [
      "Change the couple's names, venue, dates and muhurat time in the first line before you paste.",
      "Build the pinned scenes one at a time and test each on a phone; pinned sections are where most bugs hide.",
    ],
  },
  {
    slug: "haldi-ceremony-website-prompt",
    name: "Haldi Ceremony Website",
    industry: "Wedding & Events",
    tone: "light",
    layout: "centered",
    palette: ["#fff6dc", "#3a2412", "#f37021", "#ffc93c"],
    stack: "HTML, CSS, GSAP ScrollTrigger & Lenis",
    demo: "/demos/parallax-haldi/index.html",
    sections: ["Navbar with event switcher", "Marigold hero", "Intro with stats", "Ubtan bowl scene", "Splash zone", "Morning schedule", "Dress code", "Haldi games", "RSVP with countdown", "Footer"],
    description:
      "A bright, joyful haldi invitation website with flying marigolds, a pinned scene that mixes the haldi paste in a brass bowl, a kurta that gets splashed yellow as you scroll, and an RSVP.",
    prompt: `
Build a one-page haldi ceremony website for a couple called "Ananya & Kabir": Friday 12 February 2027, 10:00 am, in the courtyard of "Lakeview Haveli", Udaipur.

Tech stack: one HTML file with inline CSS and JavaScript. Load GSAP 3.12.5 and ScrollTrigger from cdnjs and Lenis 1.1.13 from jsDelivr, and connect them (lenis.on("scroll", ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0)). Use gsap.matchMedia so phones get lighter versions without pinning.

Visual style: sunny, joyful and warm. Cream background (#fff6dc), dark brown text (#3a2412), marigold orange (#f37021) for buttons, turmeric yellow (#ffc93c and #f4b400) everywhere and mango-leaf green (#2f7d32) as a small accent. Fonts: Yeseva One for headings, Caveat for handwritten words, Outfit for body. Draw a marigold as an SVG symbol from five rings of ruffled petal ellipses, and reuse it everywhere; also draw a mango leaf, a turmeric splat and a handprint.

Sections, in order:
1. Navbar with event switcher: monogram "A&K", a pill switcher with links to the Haldi, Sangeet and Shaadi pages (Haldi active), section links and an orange "RSVP" button. It turns cream with a blur after scrolling 60px.
2. Marigold hero: a sunny radial background with slowly rotating rays, a giant pale "HALDI", a toran of mango leaves and marigolds hanging just below the navbar, a string of marigolds down each side, 18 marigolds scattered at five depths (far ones small and dim, near ones large and blurred), petals falling on a canvas, and a brass bowl of haldi paste rising from the bottom. Headline "Come, turn us yellow", date, venue and two buttons.
3. Intro with stats: a short paragraph, three count-up stats (kilos of marigolds, guests, dhol players) and a tilted photo with a rotating round "Shubh Haldi" stamp.
4. Ubtan bowl scene: "Four things go into the bowl" with four steps (Haldi, Chandan, Besan, Gulab jal) and, on the right, a top-down brass bowl with a wooden spoon, a "mixed" meter and a "Ready for shagun" badge.
5. Splash zone: dark section with "Wear white. Leave yellow.", four practical tips and an SVG white kurta with a "yellow level" counter.
6. Morning schedule: five timeline cards (chai, Ganesh puja, the haldi, splash zone, lunch) alternating left and right of a centre line with a marigold on each stop.
7. Dress code: four colour swatches (haldi yellow, mulmul white, mango leaf, marigold) and a note about spare kurtas at the door.
8. Haldi games: three cards (Find the ring, Haldi tag, Dholki antakshari) with points badges and a 3D tilt on hover.
9. RSVP with countdown: a live countdown, venue card and a form (name, phone, attending chips, guest stepper, food, side, message) that validates and shows a friendly message.
10. Footer: two cards linking to the Sangeet and Shaadi pages and a giant "Haldi" in turmeric yellow.

Interactions: the hero is pinned for 120% and scrolling throws the marigolds outward and spins them by their depth, spreads the HALDI letters, lifts the bowl and fades the copy; marigolds follow the mouse on desktop. The ubtan scene is pinned for about 260%: coloured drops fall into the bowl for each ingredient, the paste circle grows and changes colour, the spoon stirs, the steps highlight in turn and the meter counts to 100%. In the splash zone, turmeric splats and handprints pop onto the kurta one by one as you scroll. The schedule line draws itself and the footer letters rise. Under prefers-reduced-motion show every scene in its final state.`,
    followUps: [
      "Add a 'Haldi playlist' section with five songs and play buttons that show an animated equalizer.",
      "Make the RSVP save to a Google Sheet through a Google Apps Script web app.",
      "Add a WhatsApp share button that shares the invite link with a short message.",
      "Add a small photo wall where guests' photos (placeholders for now) appear in a masonry grid after the event.",
    ],
    tips: [
      "The marigold SVG symbol does most of the visual work; ask for it first and reuse it in every section.",
      "Keep the number of falling petals lower on phones so the page stays smooth.",
    ],
  },
  {
    slug: "sangeet-night-website-prompt",
    name: "Sangeet Night Website",
    industry: "Wedding & Events",
    tone: "dark",
    layout: "centered",
    palette: ["#0d0620", "#fdf2ff", "#e0218a", "#f5c04a"],
    stack: "HTML, CSS, GSAP ScrollTrigger & Lenis",
    demo: "/demos/parallax-sangeet/index.html",
    sections: ["Navbar with event switcher", "Stage hero with curtains", "Intro with event pass", "Performance line-up", "Dhol beat scene", "Mehendi corner", "Song requests", "Dress code & running order", "RSVP with countdown", "Footer"],
    description:
      "A glamorous sangeet night website: velvet curtains open on a stage of lights and a disco ball, the family performance line-up slides sideways, a dhol scene builds the beat, plus song requests and an RSVP.",
    prompt: `
Build a one-page sangeet night website for a couple called "Ananya & Kabir": Friday 12 February 2027, 7:30 pm till late, on the lawn of "Lakeview Haveli", Udaipur.

Tech stack: one HTML file with inline CSS and JavaScript. Load GSAP 3.12.5 and ScrollTrigger from cdnjs and Lenis 1.1.13 from jsDelivr, and connect them (lenis.on("scroll", ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0)). Use gsap.matchMedia so phones get lighter versions without pinning.

Visual style: a glamorous night party. Deep night background (#0d0620) with plum (#2a0f4f), light lilac text (#fdf2ff), hot magenta (#e0218a) for buttons and glows, gold (#f5c04a) for highlights and cyan (#36d6e7) as a small accent. Fonts: Bodoni Moda (black and italic) for headings and Sora for body. Soft glows and a light film grain.

Sections, in order:
1. Navbar with event switcher: monogram "A&K", a pill switcher with links to the Haldi, Sangeet and Shaadi pages (Sangeet active), section links and a magenta "RSVP" button.
2. Stage hero with curtains: a scalloped valance at the top, two velvet curtains (CSS folds with a gold fringe), four coloured spotlight beams sweeping from the floor, a perspective neon floor grid, a giant outlined italic "Sangeet", an SVG disco ball with light spots turning around the room, three rows of string lights with glowing bulbs at different depths, and canvas confetti. Headline "Two families, one dance floor", date, venue and two buttons.
3. Intro with event pass: a paragraph, three count-up stats (performances, guests dancing, surprise acts) and a tilted ticket-style "Sangeet pass" with a barcode.
4. Performance line-up: eight act cards (team badge, big italic number, a spotlight cone, an animated equalizer, time, title and a one-line description), for example the bridesmaids' Bollywood medley, the cousins' bhangra battle, the parents' romantic number and the couple's first dance.
5. Dhol beat scene: an SVG dhol with ropes and two sticks, glowing rings around it, a large BPM counter, the current phase (Warm-up, Family acts, Bhangra, Open floor) with a description, a 34-bar equalizer and phase chips.
6. Mehendi corner: a henna photo in an arched frame with gold paisley line art around it, a paragraph and three time slots.
7. Song requests: a form with a song name field and vibe chips (Bollywood, Bhangra, Garba, Retro, Slow dance) that adds the song to a numbered request list on the page.
8. Dress code & running order: four jewel-tone swatches (emerald, ruby, sapphire, gold) and a four-step agenda.
9. RSVP with countdown: a live countdown, venue card and a form (name, phone, guests, side, "I'm performing" checkbox, act name, note) that validates and shows a message.
10. Footer: two cards linking to the Haldi and Shaadi pages and a giant outlined "Sangeet" with a pink glow.

Interactions: on load the curtains settle and the Sangeet letters flicker on like neon. The hero is pinned for 130% and scrolling opens the curtains fully, spreads the letters, moves each row of lights at its own speed and fades the copy. The line-up is pinned and scrolls sideways, with each card rotating as it crosses the screen. The dhol scene is pinned for about 220%: the sticks strike, rings pulse out, the BPM counts from 72 to 148, the phase changes every quarter and the equalizer grows. The mehendi photo is revealed by a growing circle while the paisleys draw themselves. Under prefers-reduced-motion show every scene in its final state.`,
    followUps: [
      "Add a voting section where guests pick their favourite performance and see live percentage bars (local state only).",
      "Store the song requests in localStorage so they survive a page refresh.",
      "Add a dark-to-light 'lights on' toggle for guests reading the page in daylight.",
      "Add a short countdown overlay that plays when the page first loads, then reveals the stage.",
    ],
    tips: [
      "Ask for the stage hero first and get the curtains, lights and beams right before anything else.",
      "Use real performance names from your family group chat; it makes the page feel personal instantly.",
    ],
  },
];
