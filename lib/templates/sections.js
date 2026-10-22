// Section library: complete, responsive page sections in plain HTML + CSS.

const FONT = "font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;";

export const sections = [
  {
    slug: "saas-hero-section",
    name: "SaaS Hero",
    tone: "light",
    tags: ["hero", "saas", "landing page", "cta"],
    description:
      "A centred hero section with an announcement pill, a large headline, supporting text, two call-to-action buttons and a row of trust stats. The standard opening for a SaaS landing page.",
    html: `<section class="hero">
  <a class="pill" href="#">New &middot; AI reports are here &rarr;</a>
  <h1>Ship your product <span>twice as fast</span></h1>
  <p>Plan, build and launch with one workspace your whole team actually enjoys using.</p>
  <div class="actions">
    <a class="btn primary" href="#">Start free trial</a>
    <a class="btn ghost" href="#">Watch demo</a>
  </div>
  <ul class="stats">
    <li><strong>12k+</strong><span>teams</span></li>
    <li><strong>4.9/5</strong><span>rating</span></li>
    <li><strong>99.9%</strong><span>uptime</span></li>
  </ul>
</section>`,
    css: `.hero {
  ${FONT}
  min-height: 100vh;
  padding: 96px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: radial-gradient(circle at 50% 0%, #eef2ff 0%, #ffffff 60%);
}

.pill {
  padding: 6px 16px;
  border-radius: 999px;
  border: 1px solid #c7d2fe;
  background: #fff;
  color: #2506ad;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
}

.hero h1 {
  max-width: 14ch;
  margin: 24px 0 0;
  font-size: clamp(2.4rem, 7vw, 4.5rem);
  line-height: 1.05;
  letter-spacing: -0.03em;
  color: #002057;
}
.hero h1 span { color: #ff7b00; }

.hero p {
  max-width: 52ch;
  margin: 20px 0 0;
  font-size: 1.15rem;
  line-height: 1.6;
  color: #5b6178;
}

.actions { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; margin-top: 32px; }
.btn {
  padding: 14px 28px;
  border-radius: 999px;
  font-weight: 700;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.btn:hover { transform: translateY(-2px); }
.btn.primary { background: #2506ad; color: #fff; box-shadow: 0 10px 24px rgba(37, 6, 173, 0.3); }
.btn.ghost { border: 1.5px solid #002057; color: #002057; }

.stats {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 40px;
  margin: 56px 0 0;
  padding: 0;
  list-style: none;
}
.stats strong { display: block; font-size: 1.6rem; color: #002057; }
.stats span { font-size: 0.9rem; color: #8a8fa3; }`,
    prompt: `Build a responsive SaaS landing-page hero section in plain HTML and CSS (no framework, no JavaScript).

Layout, top to bottom, all centred:
1. A small rounded "announcement pill" link: "New · AI reports are here →".
2. A large headline, max about 14 characters wide so it wraps onto two or three lines: "Ship your product twice as fast" with the last three words in orange (#ff7b00).
3. One sentence of supporting text in grey, max 52 characters wide.
4. Two pill-shaped buttons: a solid indigo (#2506ad) primary "Start free trial" with a soft shadow, and an outlined navy "Watch demo". Both lift 2px on hover.
5. A row of three trust stats (12k+ teams, 4.9/5 rating, 99.9% uptime), number in bold navy above a small grey label.

Styling:
- Section fills the viewport height, content vertically centred, 96px/24px padding.
- Background: radial-gradient from #eef2ff at the top centre to white.
- Headline uses clamp(2.4rem, 7vw, 4.5rem), line-height 1.05, tight letter-spacing, colour #002057.
- System font stack. Buttons and stats wrap on small screens.

Return one HTML file with the CSS in a <style> tag.`,
    steps: [
      "Use a flex column with align-items and justify-content set to center, plus min-height: 100vh, to centre everything in the viewport.",
      "Size the headline with clamp() so it scales smoothly from mobile to desktop without media queries.",
      "Limit line length with max-width in ch units (14ch for the headline, 52ch for the paragraph). Short lines are easier to read and wrap more attractively.",
      "Highlight part of the headline by wrapping it in a span with the accent colour.",
      "Put the two buttons in a flex container with flex-wrap so they stack on narrow screens.",
      "Build the stats as a list with flex and gap; each item has a strong number and a span label.",
    ],
    tips: [
      "Replace the stats with customer logos for early-stage products that do not have numbers yet.",
      "Add a product screenshot below the stats with a large border-radius and shadow.",
      "Keep one primary action. The second button should be visually quieter, as the outline style is here.",
    ],
  },
  {
    slug: "split-hero-section",
    name: "Split Hero with Mockup",
    tone: "dark",
    tags: ["hero", "two column", "app", "dark"],
    description:
      "A two-column dark hero: headline and call to action on the left, a CSS-drawn app window mockup on the right. Stacks into one column on mobile.",
    html: `<section class="split">
  <div class="copy">
    <span class="eyebrow">Analytics, simplified</span>
    <h1>Understand your users in minutes, not weeks</h1>
    <p>Connect your data once and get dashboards your team will actually open.</p>
    <a class="btn" href="#">Get started free</a>
    <small>No credit card required</small>
  </div>
  <div class="window" aria-hidden="true">
    <div class="bar"><i></i><i></i><i></i></div>
    <div class="body">
      <div class="chart">
        <span style="height: 40%"></span><span style="height: 65%"></span>
        <span style="height: 50%"></span><span style="height: 85%"></span>
        <span style="height: 70%"></span><span style="height: 95%"></span>
      </div>
      <div class="rows"><b></b><b></b><b></b></div>
    </div>
  </div>
</section>`,
    css: `.split {
  ${FONT}
  min-height: 100vh;
  padding: 80px 6vw;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  align-items: center;
  gap: 56px;
  background: #002057;
  color: #fff;
}

.eyebrow { color: #ff7b00; font-weight: 700; font-size: 0.85rem; letter-spacing: 0.12em; text-transform: uppercase; }
.split h1 { margin: 16px 0 0; font-size: clamp(2rem, 4.6vw, 3.6rem); line-height: 1.1; letter-spacing: -0.02em; }
.split p { margin: 20px 0 0; max-width: 46ch; font-size: 1.1rem; line-height: 1.6; color: rgba(255, 255, 255, 0.75); }
.btn {
  display: inline-block;
  margin-top: 32px;
  padding: 14px 28px;
  border-radius: 999px;
  background: #fff;
  color: #002057;
  font-weight: 700;
  text-decoration: none;
}
.btn:hover { background: #ff7b00; color: #fff; }
.split small { display: block; margin-top: 12px; color: rgba(255, 255, 255, 0.55); }

/* CSS-only app window */
.window {
  border-radius: 16px;
  background: #0b1535;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.45);
  overflow: hidden;
}
.bar { display: flex; gap: 6px; padding: 12px 14px; background: rgba(255, 255, 255, 0.06); }
.bar i { width: 10px; height: 10px; border-radius: 50%; background: rgba(255, 255, 255, 0.25); }
.body { padding: 24px; }
.chart { display: flex; align-items: flex-end; gap: 10px; height: 180px; }
.chart span { flex: 1; border-radius: 6px 6px 0 0; background: linear-gradient(180deg, #ff7b00, #2506ad); }
.rows { display: grid; gap: 10px; margin-top: 24px; }
.rows b { height: 12px; border-radius: 6px; background: rgba(255, 255, 255, 0.1); }
.rows b:nth-child(2) { width: 80%; }
.rows b:nth-child(3) { width: 55%; }

@media (max-width: 860px) {
  .split { grid-template-columns: 1fr; }
}`,
    prompt: `Build a responsive two-column dark hero section in plain HTML and CSS.

Left column:
- Small uppercase orange eyebrow label "Analytics, simplified".
- Headline "Understand your users in minutes, not weeks" in white, clamp(2rem, 4.6vw, 3.6rem).
- A grey-white supporting sentence, max 46ch.
- A white pill button "Get started free" (navy text) that turns orange with white text on hover.
- Small note beneath: "No credit card required".

Right column:
- A CSS-only "app window" mockup (no images): rounded dark panel with a title bar containing three dots, a bar chart of six bars with different heights filled with an orange-to-indigo gradient, and three skeleton text rows of decreasing width.

Styling:
- Section background navy #002057, min-height 100vh, padding 80px 6vw.
- CSS grid with columns 1.1fr 0.9fr, 56px gap, vertically centred; collapses to one column below 860px.
- The mockup has a large soft shadow and a 1px translucent border.

Return a single HTML file with a <style> block.`,
    steps: [
      "Create a two-column CSS grid and centre the items vertically with align-items: center.",
      "Build the copy column: eyebrow, headline, paragraph, button and a small reassurance line.",
      "Draw the mockup with nested divs instead of an image: a title bar with three dots, then a body.",
      "Make the bar chart with a flex row and align-items: flex-end. Each bar's height is an inline percentage, so it is easy to change.",
      "Add skeleton rows (plain rounded rectangles of different widths) to suggest content.",
      "Add one media query that switches the grid to a single column on small screens.",
    ],
    tips: [
      "Swap the mockup for a real screenshot using an img with the same border-radius and shadow.",
      "Add aria-hidden='true' to decorative mockups, as done here, so screen readers skip them.",
      "Reverse the columns on desktop by giving the mockup order: -1.",
    ],
  },
  {
    slug: "bento-features-section",
    name: "Bento Feature Grid",
    tone: "light",
    tags: ["features", "bento", "grid", "cards"],
    description:
      "A bento-style feature grid where one large card spans two columns and smaller cards fill the rest. Fully responsive with CSS grid and no JavaScript.",
    html: `<section class="features">
  <header>
    <span class="eyebrow">Features</span>
    <h2>Everything you need to launch</h2>
  </header>
  <div class="grid">
    <article class="card wide dark">
      <h3>Realtime collaboration</h3>
      <p>See every change as it happens. Comments, cursors and history are built in.</p>
    </article>
    <article class="card">
      <div class="icon">&#9889;</div>
      <h3>Fast by default</h3>
      <p>Pages load in under a second on any device.</p>
    </article>
    <article class="card">
      <div class="icon">&#128274;</div>
      <h3>Secure</h3>
      <p>SSO, audit logs and encryption at rest.</p>
    </article>
    <article class="card">
      <div class="icon">&#128202;</div>
      <h3>Insightful</h3>
      <p>Dashboards that answer real questions.</p>
    </article>
    <article class="card">
      <div class="icon">&#128279;</div>
      <h3>Connected</h3>
      <p>200+ integrations, plus a full API.</p>
    </article>
  </div>
</section>`,
    css: `.features {
  ${FONT}
  min-height: 100vh;
  padding: 88px 6vw;
  background: #f7f7f7;
}
.features header { text-align: center; margin-bottom: 48px; }
.eyebrow { color: #ff7b00; font-weight: 700; font-size: 0.8rem; letter-spacing: 0.2em; text-transform: uppercase; }
.features h2 { margin: 10px 0 0; font-size: clamp(1.8rem, 4vw, 2.8rem); color: #002057; }

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  max-width: 1100px;
  margin: 0 auto;
}

.card {
  padding: 28px;
  border-radius: 16px;
  background: #fff;
  border: 1px solid #e8e9f0;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.card:hover { transform: translateY(-4px); box-shadow: 0 18px 40px rgba(0, 32, 87, 0.08); }
.card h3 { margin: 16px 0 0; font-size: 1.2rem; color: #002057; }
.card p { margin: 8px 0 0; line-height: 1.6; color: #5b6178; }

.icon {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: rgba(37, 6, 173, 0.07);
  font-size: 22px;
}

/* The featured card spans two columns */
.card.wide { grid-column: span 2; display: flex; flex-direction: column; justify-content: flex-end; min-height: 220px; }
.card.dark { background: #002057; border-color: #002057; }
.card.dark h3 { color: #fff; font-size: 1.6rem; margin-top: 0; }
.card.dark p { color: rgba(255, 255, 255, 0.75); max-width: 44ch; }

@media (max-width: 900px) { .grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) {
  .grid { grid-template-columns: 1fr; }
  .card.wide { grid-column: span 1; }
}`,
    prompt: `Build a responsive "bento grid" features section in plain HTML and CSS.

Content:
- Centred header: small uppercase orange eyebrow "Features" and heading "Everything you need to launch".
- Five feature cards. The first is a featured card ("Realtime collaboration") that spans two columns with a navy (#002057) background and white text. The other four are white cards, each with an emoji icon in a tinted rounded square, a title and one sentence.

Styling:
- Section background #f7f7f7, padding 88px 6vw.
- CSS grid: three equal columns, 20px gap, max-width 1100px, centred.
- Cards: 28px padding, 16px radius, 1px #e8e9f0 border; lift 4px with a soft shadow on hover.
- Responsive: two columns below 900px, one column below 600px (the featured card stops spanning).
- System font stack. No JavaScript.

Return one HTML file with a <style> block.`,
    steps: [
      "Lay out the cards with CSS grid: grid-template-columns: repeat(3, 1fr).",
      "Make the featured card larger with grid-column: span 2. The remaining cards flow around it automatically.",
      "Style all cards from one shared .card rule, then override colours for the dark featured card.",
      "Add a hover lift using transform: translateY(-4px) and a box-shadow, both with a transition.",
      "Reduce the columns with two media queries, and reset the span to 1 on mobile so the wide card does not overflow.",
    ],
    tips: [
      "Add grid-row: span 2 to another card to create a tall tile for a more varied bento layout.",
      "Replace emoji with inline SVG icons for consistent rendering across devices.",
      "Put a small product screenshot inside the featured card to make it the focal point.",
    ],
  },
  {
    slug: "pricing-table-section",
    name: "Pricing Table",
    tone: "light",
    tags: ["pricing", "plans", "saas", "cards"],
    description:
      "A three-plan pricing table with a highlighted 'most popular' plan, feature lists with check marks and clear call-to-action buttons.",
    html: `<section class="pricing">
  <h2>Simple, honest pricing</h2>
  <p class="sub">Start free. Upgrade when you are ready.</p>
  <div class="plans">
    <article class="plan">
      <h3>Starter</h3>
      <p class="price">&#8377;0<span>/month</span></p>
      <ul><li>1 project</li><li>Community support</li><li>Basic analytics</li></ul>
      <a class="btn" href="#">Get started</a>
    </article>
    <article class="plan popular">
      <span class="badge">Most popular</span>
      <h3>Pro</h3>
      <p class="price">&#8377;999<span>/month</span></p>
      <ul><li>Unlimited projects</li><li>Priority support</li><li>Advanced analytics</li><li>Custom domain</li></ul>
      <a class="btn" href="#">Start free trial</a>
    </article>
    <article class="plan">
      <h3>Team</h3>
      <p class="price">&#8377;2,499<span>/month</span></p>
      <ul><li>Everything in Pro</li><li>10 team members</li><li>SSO and audit logs</li></ul>
      <a class="btn" href="#">Contact sales</a>
    </article>
  </div>
</section>`,
    css: `.pricing {
  ${FONT}
  min-height: 100vh;
  padding: 88px 6vw;
  background: #fff;
  text-align: center;
}
.pricing h2 { margin: 0; font-size: clamp(1.8rem, 4vw, 2.8rem); color: #002057; }
.sub { margin: 10px 0 0; color: #5b6178; font-size: 1.1rem; }

.plans {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  max-width: 1040px;
  margin: 56px auto 0;
  align-items: center;
  text-align: left;
}

.plan {
  position: relative;
  padding: 32px;
  border-radius: 16px;
  border: 1px solid #e8e9f0;
  background: #fff;
}
.plan h3 { margin: 0; font-size: 1.1rem; color: #5b6178; font-weight: 600; }
.price { margin: 12px 0 0; font-size: 2.6rem; font-weight: 800; color: #002057; }
.price span { font-size: 1rem; font-weight: 500; color: #8a8fa3; }

.plan ul { margin: 24px 0; padding: 0; list-style: none; display: grid; gap: 12px; }
.plan li { padding-left: 28px; position: relative; color: #2b3150; }
.plan li::before { content: "\\2713"; position: absolute; left: 0; color: #2506ad; font-weight: 700; }

.btn {
  display: block;
  padding: 13px;
  border-radius: 999px;
  border: 1.5px solid #002057;
  color: #002057;
  font-weight: 700;
  text-align: center;
  text-decoration: none;
}
.btn:hover { background: #002057; color: #fff; }

/* Highlighted plan */
.plan.popular { background: #002057; border-color: #002057; padding: 44px 32px; box-shadow: 0 30px 60px rgba(0, 32, 87, 0.25); }
.plan.popular h3 { color: rgba(255, 255, 255, 0.7); }
.plan.popular .price, .plan.popular li { color: #fff; }
.plan.popular .price span { color: rgba(255, 255, 255, 0.6); }
.plan.popular li::before { color: #ff7b00; }
.plan.popular .btn { background: #fff; border-color: #fff; }
.plan.popular .btn:hover { background: #ff7b00; border-color: #ff7b00; color: #fff; }
.badge {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 4px 12px;
  border-radius: 999px;
  background: #ff7b00;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
}

@media (max-width: 860px) {
  .plans { grid-template-columns: 1fr; max-width: 420px; }
}`,
    prompt: `Build a responsive three-tier pricing section in plain HTML and CSS.

Content:
- Centred heading "Simple, honest pricing" and subtitle "Start free. Upgrade when you are ready."
- Three plans in Indian rupees: Starter (₹0/month), Pro (₹999/month, highlighted as "Most popular") and Team (₹2,499/month). Each has a short feature list and a full-width pill button.

Styling:
- White section, plans in a 3-column grid (max-width 1040px, 24px gap), vertically centred so the highlighted plan looks taller.
- Plan cards: 32px padding, 16px radius, 1px #e8e9f0 border. Price in 2.6rem extra-bold navy with a small grey "/month".
- Feature list items show a check mark using a ::before pseudo-element (content "\\2713") in indigo.
- Outlined navy buttons that fill navy on hover.
- The Pro plan is navy (#002057) with white text, extra vertical padding, a large soft shadow, orange check marks, a white button that turns orange on hover, and an orange "Most popular" badge in the top-right corner.
- Single column (max 420px, centred) below 860px.

Return one HTML file with a <style> block.`,
    steps: [
      "Place the three plans in a three-column grid and set align-items: center. Giving the popular plan more padding then makes it stand taller than its neighbours.",
      "Build each plan from the same markup: name, price, feature list, button.",
      "Add check marks with a ::before pseudo-element on each list item, so the HTML stays clean.",
      "Create a .popular modifier class that changes the background, text colours and shadow.",
      "Position the badge absolutely in the top-right of the card (the card needs position: relative).",
      "Collapse to a single centred column on mobile.",
    ],
    tips: [
      "Add a monthly/yearly toggle with a checkbox and the :has() selector, or a few lines of JavaScript.",
      "Keep feature lists to the 3-5 differences that matter; link to a full comparison table for the rest.",
      "State the currency and billing period next to every price to avoid confusion.",
    ],
  },
  {
    slug: "testimonial-cards-section",
    name: "Testimonial Cards",
    tone: "light",
    tags: ["testimonials", "social proof", "reviews"],
    description:
      "Three customer testimonial cards with star ratings, quotes and avatar initials. Simple social proof that works on any landing page.",
    html: `<section class="testimonials">
  <h2>Loved by developers</h2>
  <div class="grid">
    <figure class="quote">
      <div class="stars" aria-label="5 out of 5 stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
      <blockquote>We replaced three tools with this one. Onboarding took an afternoon.</blockquote>
      <figcaption><span class="avatar">AS</span><div><strong>Ananya Sharma</strong><small>CTO, Finlite</small></div></figcaption>
    </figure>
    <figure class="quote">
      <div class="stars" aria-label="5 out of 5 stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
      <blockquote>The best developer experience I have had in years. Support replies in minutes.</blockquote>
      <figcaption><span class="avatar">RK</span><div><strong>Rohit Kumar</strong><small>Lead Engineer, Shopwave</small></div></figcaption>
    </figure>
    <figure class="quote">
      <div class="stars" aria-label="5 out of 5 stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
      <blockquote>Our release cycle went from monthly to weekly. The team is happier too.</blockquote>
      <figcaption><span class="avatar">MP</span><div><strong>Meera Patel</strong><small>Product Manager, Carely</small></div></figcaption>
    </figure>
  </div>
</section>`,
    css: `.testimonials {
  ${FONT}
  min-height: 100vh;
  padding: 88px 6vw;
  background: #f7f7f7;
}
.testimonials h2 { margin: 0 0 48px; text-align: center; font-size: clamp(1.8rem, 4vw, 2.8rem); color: #002057; }

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  max-width: 1100px;
  margin: 0 auto;
}

.quote {
  margin: 0;
  padding: 28px;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  background: #fff;
  border: 1px solid #e8e9f0;
}
.stars { color: #ff7b00; letter-spacing: 2px; }
.quote blockquote { margin: 16px 0 24px; font-size: 1.05rem; line-height: 1.65; color: #2b3150; }

.quote figcaption { display: flex; align-items: center; gap: 12px; margin-top: auto; }
.avatar {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #002057;
  color: #fff;
  font-weight: 700;
  font-size: 0.85rem;
}
.quote strong { display: block; color: #002057; }
.quote small { color: #8a8fa3; }`,
    prompt: `Build a responsive testimonials section in plain HTML and CSS.

Content:
- Centred heading "Loved by developers".
- Three testimonial cards. Each has five orange stars, a one-or-two sentence quote, and an author row with a circular avatar showing the person's initials, their name in bold and their role and company in small grey text. Use Indian names.

Markup and accessibility:
- Use <figure>, <blockquote> and <figcaption> for each testimonial.
- Give the star row an aria-label such as "5 out of 5 stars".

Styling:
- Section background #f7f7f7, padding 88px 6vw.
- Grid: repeat(auto-fit, minmax(280px, 1fr)) with 24px gap, max-width 1100px - so it needs no media queries.
- Cards: white, 28px padding, 16px radius, 1px #e8e9f0 border, flex column so the author row sits at the bottom (margin-top: auto).
- Avatar: 44px navy circle with white initials.

Return one HTML file with a <style> block.`,
    steps: [
      "Use semantic markup: figure for the testimonial, blockquote for the words, figcaption for the author.",
      "Create a responsive grid with repeat(auto-fit, minmax(280px, 1fr)). Cards wrap to fewer columns automatically as space shrinks.",
      "Make each card a flex column and give the author row margin-top: auto so authors line up at the bottom even when quotes differ in length.",
      "Draw the avatar as a circle with centred initials, which avoids needing photos.",
      "Add an aria-label to the star row so screen readers announce the rating instead of reading five star characters.",
    ],
    tips: [
      "Use real photos with img and border-radius: 50% when you have permission to show them.",
      "Only publish testimonials you can back up; link to the original review where possible.",
      "Add a company logo row above the cards for extra credibility.",
    ],
  },
  {
    slug: "cta-banner-section",
    name: "Call-to-Action Banner",
    tone: "dark",
    tags: ["cta", "banner", "conversion"],
    description:
      "A bold rounded call-to-action banner with a headline, supporting line and an email signup form. Place it near the end of a page to convert readers.",
    html: `<section class="cta-wrap">
  <div class="cta">
    <h2>Ready to build something great?</h2>
    <p>Join 12,000+ developers who ship faster every week.</p>
    <form class="signup" onsubmit="return false">
      <label class="sr-only" for="email">Email address</label>
      <input id="email" type="email" placeholder="you@example.com" required />
      <button type="submit">Get early access</button>
    </form>
    <small>Free for 14 days. Cancel any time.</small>
  </div>
</section>`,
    css: `.cta-wrap {
  ${FONT}
  min-height: 100vh;
  padding: 64px 5vw;
  display: grid;
  place-items: center;
  background: #f7f7f7;
}

.cta {
  width: 100%;
  max-width: 1000px;
  padding: clamp(40px, 7vw, 88px) 24px;
  border-radius: 28px;
  text-align: center;
  color: #fff;
  background:
    radial-gradient(circle at 85% 15%, rgba(255, 123, 0, 0.45), transparent 45%),
    radial-gradient(circle at 10% 90%, rgba(37, 6, 173, 0.8), transparent 50%),
    #002057;
}
.cta h2 { margin: 0; font-size: clamp(1.8rem, 4.5vw, 3rem); letter-spacing: -0.02em; }
.cta p { margin: 12px 0 0; font-size: 1.1rem; color: rgba(255, 255, 255, 0.8); }

.signup {
  display: flex;
  gap: 8px;
  max-width: 460px;
  margin: 32px auto 0;
  padding: 6px;
  border-radius: 999px;
  background: #fff;
}
.signup input {
  flex: 1;
  min-width: 0;
  padding: 0 16px;
  border: 0;
  outline: 0;
  background: transparent;
  font-size: 1rem;
}
.signup button {
  padding: 12px 22px;
  border: 0;
  border-radius: 999px;
  background: #ff7b00;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
}
.signup button:hover { background: #e06c00; }
.signup:focus-within { box-shadow: 0 0 0 4px rgba(255, 123, 0, 0.35); }

.cta small { display: block; margin-top: 14px; color: rgba(255, 255, 255, 0.6); }

.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }

@media (max-width: 480px) {
  .signup { flex-direction: column; border-radius: 20px; padding: 10px; }
  .signup input { padding: 12px; text-align: center; }
}`,
    prompt: `Build a call-to-action banner section with an email signup form in plain HTML and CSS.

Content:
- Heading "Ready to build something great?", supporting line "Join 12,000+ developers who ship faster every week."
- An inline email form: one email input and an orange "Get early access" button, inside a single white pill-shaped container.
- Small reassurance text: "Free for 14 days. Cancel any time."

Styling:
- Outer section #f7f7f7, banner centred, max-width 1000px, 28px radius.
- Banner background: navy #002057 with two radial-gradient glows layered on top (orange in the top-right, indigo in the bottom-left).
- Form: flex row, white pill, 6px inner padding; the input has no border or outline; the button is an orange pill. Show a soft orange focus ring around the whole pill using :focus-within.
- Below 480px the form stacks vertically.

Accessibility:
- Include a visually hidden <label> for the email input (an .sr-only class).

Return one HTML file with a <style> block.`,
    steps: [
      "Create the banner as a rounded block and layer two radial-gradients over a solid colour for depth.",
      "Wrap the input and button in one pill-shaped flex container so they look like a single control.",
      "Remove the input's own border and outline, then restore a visible focus state on the wrapper with :focus-within.",
      "Add a visually hidden label so the field is announced correctly by screen readers.",
      "Stack the form on small screens with a media query.",
    ],
    tips: [
      "Connect the form to a Server Action or API route to actually collect emails.",
      "Use one clear action per banner; competing buttons reduce conversions.",
      "Repeat this banner at the end of long pages, where interested readers finish.",
    ],
  },
  {
    slug: "faq-accordion-section",
    name: "FAQ Accordion",
    tone: "light",
    tags: ["faq", "accordion", "details", "no javascript"],
    description:
      "An accessible FAQ accordion built with the native details and summary elements. It opens and closes with no JavaScript and works with the keyboard out of the box.",
    html: `<section class="faq">
  <h2>Frequently asked questions</h2>
  <div class="list">
    <details open>
      <summary>Is there a free plan?</summary>
      <p>Yes. The Starter plan is free forever and includes one project and basic analytics.</p>
    </details>
    <details>
      <summary>Can I cancel at any time?</summary>
      <p>You can cancel from your account settings in two clicks. You keep access until the end of the billing period.</p>
    </details>
    <details>
      <summary>Do you offer student discounts?</summary>
      <p>Students and teachers get 50% off the Pro plan. Verify with your college email address.</p>
    </details>
    <details>
      <summary>Which payment methods do you accept?</summary>
      <p>UPI, all major credit and debit cards, and net banking for annual plans.</p>
    </details>
  </div>
</section>`,
    css: `.faq {
  ${FONT}
  min-height: 100vh;
  padding: 88px 6vw;
  background: #fff;
}
.faq h2 { margin: 0 0 40px; text-align: center; font-size: clamp(1.8rem, 4vw, 2.8rem); color: #002057; }

.list { max-width: 760px; margin: 0 auto; display: grid; gap: 12px; }

details {
  border: 1px solid #e8e9f0;
  border-radius: 14px;
  background: #fff;
  transition: border-color 0.2s ease;
}
details[open] { border-color: rgba(37, 6, 173, 0.35); }

summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  font-size: 1.05rem;
  font-weight: 600;
  color: #002057;
  cursor: pointer;
  list-style: none;
}
summary::-webkit-details-marker { display: none; }

/* Plus icon that rotates into a cross when open */
summary::after {
  content: "+";
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: rgba(37, 6, 173, 0.07);
  color: #2506ad;
  font-size: 1.2rem;
  transition: transform 0.25s ease;
}
details[open] summary::after { transform: rotate(45deg); }

summary:focus-visible { outline: 2px solid #2506ad; outline-offset: 2px; border-radius: 14px; }

details p { margin: 0; padding: 0 24px 22px; line-height: 1.7; color: #5b6178; }`,
    prompt: `Build an accessible FAQ accordion section using only HTML and CSS (no JavaScript).

Requirements:
- Use the native <details> and <summary> elements for each question so it works with keyboard and screen readers automatically. The first item is open by default.
- Four questions about a SaaS product: free plan, cancelling, student discounts, payment methods (mention UPI).
- Centred heading "Frequently asked questions"; the list is max 760px wide with 12px gaps.

Styling:
- Each item: 1px #e8e9f0 border, 14px radius. When open, the border becomes translucent indigo.
- Summary: flex row with the question on the left and a circular "+" icon on the right, created with summary::after. Hide the default disclosure triangle (list-style: none and ::-webkit-details-marker).
- Rotate the "+" by 45 degrees when the item is open so it becomes an "x".
- Visible focus outline on summary:focus-visible.
- Answer text in grey with 1.7 line-height.

Return one HTML file with a <style> block.`,
    steps: [
      "Use details and summary. The browser handles open/close, keyboard support (Enter and Space) and accessibility for free.",
      "Remove the default triangle with list-style: none on summary plus the ::-webkit-details-marker rule for Safari.",
      "Add your own indicator with summary::after and lay out the summary with flex and space-between.",
      "Use the details[open] attribute selector to style the open state and rotate the icon.",
      "Keep a clear focus-visible outline so keyboard users can see where they are.",
    ],
    tips: [
      "Give several details elements the same name attribute to make only one open at a time (an exclusive accordion) in modern browsers.",
      "Add FAQPage JSON-LD structured data with the same questions to become eligible for rich results in search.",
      "Write questions the way customers ask them, not the way your team describes the feature.",
    ],
  },
  {
    slug: "stats-strip-section",
    name: "Stats Strip",
    tone: "dark",
    tags: ["stats", "numbers", "social proof"],
    description:
      "A horizontal strip of four key numbers with labels, separated by thin dividers. A compact way to show traction between larger sections.",
    html: `<section class="stats-wrap">
  <div class="stats">
    <div><strong>20+</strong><span>Projects delivered</span></div>
    <div><strong>5 yrs</strong><span>Experience</span></div>
    <div><strong>98%</strong><span>Client satisfaction</span></div>
    <div><strong>24h</strong><span>Average response</span></div>
  </div>
</section>`,
    css: `.stats-wrap {
  ${FONT}
  min-height: 100vh;
  padding: 48px 5vw;
  display: grid;
  place-items: center;
  background: #f7f7f7;
}

.stats {
  width: 100%;
  max-width: 1040px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-radius: 20px;
  background: #002057;
  color: #fff;
  overflow: hidden;
}

.stats > div {
  padding: 40px 24px;
  text-align: center;
  border-left: 1px solid rgba(255, 255, 255, 0.12);
}
.stats > div:first-child { border-left: 0; }

.stats strong {
  display: block;
  font-size: clamp(2rem, 4.5vw, 3rem);
  font-weight: 800;
  letter-spacing: -0.02em;
}
.stats strong::first-letter { color: #ff7b00; }
.stats span { display: block; margin-top: 6px; font-size: 0.95rem; color: rgba(255, 255, 255, 0.7); }

@media (max-width: 720px) {
  .stats { grid-template-columns: repeat(2, 1fr); }
  .stats > div { border-left: 0; border-top: 1px solid rgba(255, 255, 255, 0.12); }
  .stats > div:nth-child(-n + 2) { border-top: 0; }
  .stats > div:nth-child(even) { border-left: 1px solid rgba(255, 255, 255, 0.12); }
}`,
    prompt: `Build a responsive "stats strip" section in plain HTML and CSS.

Content: four statistics - "20+ Projects delivered", "5 yrs Experience", "98% Client satisfaction", "24h Average response".

Styling:
- A rounded (20px) navy #002057 bar, max-width 1040px, centred on a #f7f7f7 section.
- Four equal columns using CSS grid; each cell has 40px vertical padding, centred text and a thin 1px translucent white divider on its left (none on the first cell).
- The number is large (clamp(2rem, 4.5vw, 3rem)), extra bold, white, with its first character coloured orange #ff7b00 using ::first-letter. The label is smaller and 70% white.
- Below 720px it becomes a 2x2 grid with dividers between rows and columns only.

Return one HTML file with a <style> block.`,
    steps: [
      "Use a four-column grid inside a rounded container with overflow: hidden so the dividers respect the rounded corners.",
      "Add dividers with border-left on each cell and remove it from the first cell.",
      "Size the numbers with clamp() so they scale between mobile and desktop.",
      "Accent the first character of each number with the ::first-letter pseudo-element instead of extra markup.",
      "Switch to two columns on small screens and adjust which borders are shown using nth-child selectors.",
    ],
    tips: [
      "Use real, verifiable numbers. Rounded figures like '20+' are fine; invented precision is not.",
      "Animate the numbers counting up with a small IntersectionObserver script when the strip scrolls into view.",
      "Three stats often read better than four on narrow layouts.",
    ],
  },
  {
    slug: "responsive-navbar-section",
    name: "Responsive Navbar",
    tone: "light",
    tags: ["navbar", "navigation", "header", "mobile menu"],
    description:
      "A sticky navigation bar with logo, links and a call-to-action button. On mobile the links collapse into a menu that opens with a CSS-only checkbox toggle.",
    html: `<header class="nav">
  <a class="logo" href="#"><span>R</span>avindra</a>
  <input type="checkbox" id="menu-toggle" class="toggle" aria-label="Toggle menu" />
  <label for="menu-toggle" class="burger" aria-hidden="true"><i></i><i></i><i></i></label>
  <nav class="links">
    <a href="#" class="active">Home</a>
    <a href="#">Work</a>
    <a href="#">Notes</a>
    <a href="#">About</a>
    <a href="#" class="btn">Hire me</a>
  </nav>
</header>
<main class="demo">
  <h1>Responsive Navbar</h1>
  <p>Resize the preview to see the mobile menu.</p>
</main>`,
    css: `body { ${FONT} background: #f7f7f7; }

.nav {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 6vw;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e8e9f0;
}

.logo { font-size: 1.3rem; font-weight: 800; color: #002057; text-decoration: none; }
.logo span { color: #ff7b00; }

.links { display: flex; align-items: center; gap: 28px; }
.links a { color: #3b4160; font-weight: 600; text-decoration: none; }
.links a:hover, .links a.active { color: #2506ad; }
.links .btn { padding: 10px 20px; border-radius: 999px; background: #002057; color: #fff; }
.links .btn:hover { background: #2506ad; color: #fff; }

/* The checkbox is the state; the label is the visible button */
.toggle { position: absolute; opacity: 0; pointer-events: none; }
.burger { display: none; width: 28px; cursor: pointer; }
.burger i { display: block; height: 3px; margin: 5px 0; border-radius: 2px; background: #002057; transition: transform 0.25s ease, opacity 0.25s ease; }

.demo { min-height: 90vh; display: grid; place-content: center; text-align: center; }
.demo h1 { margin: 0; color: #002057; font-size: clamp(1.8rem, 5vw, 3rem); }
.demo p { color: #5b6178; }

@media (max-width: 720px) {
  .burger { display: block; }
  .links {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    padding: 8px 6vw 20px;
    background: #fff;
    border-bottom: 1px solid #e8e9f0;
    display: none;
  }
  .links a { padding: 14px 0; }
  .links .btn { margin-top: 8px; text-align: center; }

  .toggle:checked ~ .links { display: flex; }
  .toggle:checked ~ .burger i:nth-child(1) { transform: translateY(8px) rotate(45deg); }
  .toggle:checked ~ .burger i:nth-child(2) { opacity: 0; }
  .toggle:checked ~ .burger i:nth-child(3) { transform: translateY(-8px) rotate(-45deg); }
}`,
    prompt: `Build a responsive sticky navigation bar in plain HTML and CSS, with a mobile menu that works without JavaScript.

Desktop:
- A header with the logo "Ravindra" on the left (first letter orange) and links on the right: Home (active), Work, Notes, About, plus a navy pill button "Hire me".
- position: sticky at the top, semi-transparent white background with backdrop-filter blur, 1px bottom border.
- Links are dark grey, turning indigo #2506ad on hover or when active.

Mobile (below 720px):
- Hide the links and show a three-line hamburger icon.
- Use the "checkbox hack": a visually hidden <input type="checkbox">, a <label> styled as the hamburger, and the sibling selector .toggle:checked ~ .links to show the menu as a full-width dropdown under the bar.
- Animate the hamburger into an "x" when checked (rotate the top and bottom bars, fade the middle one).

Also include a simple placeholder <main> below the header so the sticky behaviour is visible.

Return one HTML file with a <style> block.`,
    steps: [
      "Lay out the header with flex and space-between: logo on one side, links on the other.",
      "Make it sticky with position: sticky and top: 0; a translucent background with backdrop-filter gives the frosted look.",
      "Add a hidden checkbox before the links and a label (the hamburger) that toggles it.",
      "On mobile, hide the links by default and show them when the checkbox is checked, using the general sibling selector (~).",
      "Animate the three hamburger bars into a cross using transforms on nth-child.",
    ],
    tips: [
      "In a React or Next.js app, replace the checkbox with useState for better control and to close the menu after navigation.",
      "Add aria-current='page' to the active link for assistive technology.",
      "Keep the number of top-level links to about five; move the rest into the footer.",
    ],
  },
  {
    slug: "simple-footer-section",
    name: "Site Footer",
    tone: "dark",
    tags: ["footer", "links", "navigation"],
    description:
      "A complete site footer with a brand blurb, three link columns, social icons and a copyright bar. Responsive from four columns down to one.",
    html: `<div class="page">
  <footer class="footer">
    <div class="top">
      <div class="brand">
        <a class="logo" href="#"><span>R</span>avindra</a>
        <p>Full stack developer building fast, scalable web and mobile products.</p>
      </div>
      <nav aria-label="Product">
        <h4>Explore</h4>
        <a href="#">Projects</a><a href="#">Notes</a><a href="#">Templates</a>
      </nav>
      <nav aria-label="Company">
        <h4>About</h4>
        <a href="#">Experience</a><a href="#">Skills</a><a href="#">Contact</a>
      </nav>
      <nav aria-label="Legal">
        <h4>Legal</h4>
        <a href="#">Privacy</a><a href="#">Terms</a>
      </nav>
    </div>
    <div class="bottom">
      <small>&copy; 2026 Ravindra Nath Jha. All rights reserved.</small>
      <div class="social">
        <a href="#" aria-label="GitHub">GH</a>
        <a href="#" aria-label="LinkedIn">in</a>
        <a href="#" aria-label="Email">@</a>
      </div>
    </div>
  </footer>
</div>`,
    css: `.page {
  ${FONT}
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background: #f7f7f7;
}

.footer { background: #002057; color: rgba(255, 255, 255, 0.75); padding: 64px 6vw 0; }

.top {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr 1fr;
  gap: 40px;
  max-width: 1100px;
  margin: 0 auto;
  padding-bottom: 48px;
}

.logo { font-size: 1.4rem; font-weight: 800; color: #fff; text-decoration: none; }
.logo span { color: #ff7b00; }
.brand p { margin: 14px 0 0; max-width: 32ch; line-height: 1.6; }

.footer h4 { margin: 0 0 14px; color: #fff; font-size: 0.85rem; letter-spacing: 0.1em; text-transform: uppercase; }
.footer nav a { display: block; padding: 6px 0; color: rgba(255, 255, 255, 0.75); text-decoration: none; }
.footer nav a:hover { color: #ff7b00; }

.bottom {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

.social { display: flex; gap: 10px; }
.social a {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  font-size: 0.8rem;
  font-weight: 700;
  text-decoration: none;
}
.social a:hover { background: #ff7b00; border-color: #ff7b00; }

@media (max-width: 760px) {
  .top { grid-template-columns: 1fr 1fr; }
  .brand { grid-column: span 2; }
}`,
    prompt: `Build a responsive website footer in plain HTML and CSS.

Content:
- Brand column: logo "Ravindra" (first letter orange) and a one-line description.
- Three link columns with uppercase headings: Explore (Projects, Notes, Templates), About (Experience, Skills, Contact), Legal (Privacy, Terms). Each column is a <nav> with an aria-label.
- Bottom bar: copyright text on the left, three circular social links on the right (GitHub, LinkedIn, Email) with aria-labels.

Styling:
- Footer background navy #002057, text 75% white, links turn orange #ff7b00 on hover.
- Top area: CSS grid with columns 1.6fr 1fr 1fr 1fr, 40px gap, max-width 1100px.
- Bottom bar separated by a 1px translucent top border, flex with space-between, wraps on small screens.
- Social links: 38px circles with a 1px translucent border that fill orange on hover.
- Below 760px: two columns, with the brand column spanning both.
- Wrap it in a full-height flex column page so the footer sits at the bottom.

Return one HTML file with a <style> block.`,
    steps: [
      "Split the footer into a top area (brand plus link columns) and a bottom bar (copyright plus social links).",
      "Lay out the top area with CSS grid, giving the brand column more space with a larger fr value.",
      "Use nav elements with aria-labels for each link group so screen-reader users can jump between them.",
      "Style links as block elements with vertical padding to make them easy to tap on mobile.",
      "Collapse to two columns on small screens and let the brand column span both.",
      "To pin a footer to the bottom of short pages, make the page a flex column with min-height: 100vh.",
    ],
    tips: [
      "Replace the text social labels with inline SVG icons.",
      "Generate the year automatically in your framework so the copyright never goes stale.",
      "Link every important page from the footer; it helps both visitors and search engines.",
    ],
  },
  {
    slug: "logo-cloud-marquee-section",
    name: "Infinite Logo Cloud Marquee",
    tone: "dark",
    tags: ["logos", "social proof", "marquee", "animation", "hero"],
    description:
      "A dual-row infinite logo marquee with edge fade masks, trust badge, and hover pause. Built with CSS keyframe animation and SVG logos, zero dependencies.",
    html: `<section class="marquee-section">
  <div class="marquee-header">
    <span class="badge">Trusted by Industry Leaders</span>
    <h2>Powering engineering teams worldwide</h2>
  </div>

  <div class="marquee-container" aria-label="Customer logos">
    <div class="marquee-track row-left">
      <div class="logo-group">
        <div class="logo-item"><span class="logo-icon">&#9670;</span><b>VERCEL</b></div>
        <div class="logo-item"><span class="logo-icon">&#9632;</span><b>STRIPE</b></div>
        <div class="logo-item"><span class="logo-icon">&#9650;</span><b>SUPABASE</b></div>
        <div class="logo-item"><span class="logo-icon">&#9679;</span><b>GITHUB</b></div>
        <div class="logo-item"><span class="logo-icon">&#9733;</span><b>LINEAR</b></div>
        <div class="logo-item"><span class="logo-icon">&#9878;</span><b>DATADOG</b></div>
      </div>
      <div class="logo-group" aria-hidden="true">
        <div class="logo-item"><span class="logo-icon">&#9670;</span><b>VERCEL</b></div>
        <div class="logo-item"><span class="logo-icon">&#9632;</span><b>STRIPE</b></div>
        <div class="logo-item"><span class="logo-icon">&#9650;</span><b>SUPABASE</b></div>
        <div class="logo-item"><span class="logo-icon">&#9679;</span><b>GITHUB</b></div>
        <div class="logo-item"><span class="logo-icon">&#9733;</span><b>LINEAR</b></div>
        <div class="logo-item"><span class="logo-icon">&#9878;</span><b>DATADOG</b></div>
      </div>
    </div>

    <div class="marquee-track row-right">
      <div class="logo-group">
        <div class="logo-item"><span class="logo-icon">&#9881;</span><b>POSTHOG</b></div>
        <div class="logo-item"><span class="logo-icon">&#10070;</span><b>RESEND</b></div>
        <div class="logo-item"><span class="logo-icon">&#9673;</span><b>CLOUDFLARE</b></div>
        <div class="logo-item"><span class="logo-icon">&#9660;</span><b>AWS</b></div>
        <div class="logo-item"><span class="logo-icon">&#9633;</span><b>RENDER</b></div>
        <div class="logo-item"><span class="logo-icon">&#10022;</span><b>PRISMA</b></div>
      </div>
      <div class="logo-group" aria-hidden="true">
        <div class="logo-item"><span class="logo-icon">&#9881;</span><b>POSTHOG</b></div>
        <div class="logo-item"><span class="logo-icon">&#10070;</span><b>RESEND</b></div>
        <div class="logo-item"><span class="logo-icon">&#9673;</span><b>CLOUDFLARE</b></div>
        <div class="logo-item"><span class="logo-icon">&#9660;</span><b>AWS</b></div>
        <div class="logo-item"><span class="logo-icon">&#9633;</span><b>RENDER</b></div>
        <div class="logo-item"><span class="logo-icon">&#10022;</span><b>PRISMA</b></div>
      </div>
    </div>
  </div>
</section>`,
    css: `.marquee-section {
  ${FONT}
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #060914;
  color: #fff;
  padding: 80px 0;
  overflow: hidden;
}

.marquee-header {
  text-align: center;
  margin-bottom: 56px;
  padding: 0 24px;
}

.badge {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 999px;
  background: rgba(255, 123, 0, 0.12);
  border: 1px solid rgba(255, 123, 0, 0.3);
  color: #ff7b00;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.marquee-header h2 {
  margin: 16px 0 0;
  font-size: clamp(1.8rem, 4.5vw, 3rem);
  letter-spacing: -0.02em;
}

.marquee-container {
  width: 100%;
  max-width: 1200px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
  mask-image: linear-gradient(to right, transparent 0%, #000 15%, #000 85%, transparent 100%);
  -webkit-mask-image: linear-gradient(to right, transparent 0%, #000 15%, #000 85%, transparent 100%);
}

.marquee-track {
  display: flex;
  width: max-content;
  user-select: none;
}

.marquee-track:hover {
  animation-play-state: paused;
}

.row-left {
  animation: scroll-left 25s linear infinite;
}

.row-right {
  animation: scroll-right 28s linear infinite;
}

.logo-group {
  display: flex;
  align-items: center;
  gap: 24px;
  padding-right: 24px;
}

.logo-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 28px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #94a3b8;
  font-size: 1.1rem;
  letter-spacing: 0.08em;
  white-space: nowrap;
  transition: all 0.25s ease;
}

.logo-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.22);
  color: #fff;
  transform: translateY(-2px);
}

.logo-icon {
  font-size: 1.3rem;
  color: #ff7b00;
}

@keyframes scroll-left {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

@keyframes scroll-right {
  from { transform: translateX(-50%); }
  to   { transform: translateX(0); }
}

@media (prefers-reduced-motion: reduce) {
  .marquee-track { animation: none; flex-wrap: wrap; justify-content: center; width: 100%; }
  .marquee-container { mask-image: none; -webkit-mask-image: none; }
}`,
    prompt: `Create a dual-row infinite logo cloud marquee with edge fade masks in plain HTML and CSS.

Requirements:
- Centered header with a pill badge "Trusted by Industry Leaders" and a strong headline.
- Two horizontal rows of logo cards: top row scrolls left, bottom row scrolls right.
- Both rows duplicate their items with aria-hidden="true" on the clone to ensure an endless loop without jumps.
- Gradient fade masks on left and right edges (mask-image: linear-gradient(to right, transparent, #000 15%, #000 85%, transparent)) so cards dissolve smoothly into the margins.
- Pause the animation on hover.
- Full responsive support and prefers-reduced-motion fallback where cards wrap statically.

Return one HTML file with a <style> block.`,
    steps: [
      "Duplicate the logo set inside a flex container so that translating by -50% lines up seamlessly with the start.",
      "Animate translateX from 0 to -50% for leftward scrolling, and from -50% to 0 for rightward scrolling.",
      "Add a CSS linear-gradient mask-image on the parent container to create soft edge vignettes without extra HTML overlays.",
      "Use animation-play-state: paused on hover so visitors can inspect logos.",
      "Mark cloned duplicate elements with aria-hidden='true' to prevent redundant screen reader announcements.",
    ],
    tips: [
      "Adjust marquee speed by tweaking duration (e.g., 20s to 35s).",
      "Using CSS mask-image avoids placing opaque png overlays, keeping transparency intact over gradients.",
      "Replace text brands with monochrome SVG logos matching your real partners.",
    ],
  },
  {
    slug: "before-after-slider-section",
    name: "Before & After Image Comparison",
    tone: "light",
    tags: ["comparison", "slider", "interactive", "showcase"],
    description:
      "An interactive split-screen comparison slider with a draggable handle. Lets visitors slide between two layers (e.g. before/after design or raw code vs final render).",
    html: `<section class="compare-section">
  <div class="compare-head">
    <span class="eyebrow">Transformation</span>
    <h2>See the difference for yourself</h2>
    <p>Drag the slider to compare raw data with interactive dashboards.</p>
  </div>

  <div class="slider-box" id="sliderBox">
    <!-- Bottom layer: After -->
    <div class="layer layer-after">
      <div class="visual visual-after">
        <div class="badge-tag after-tag">Clean Dashboard</div>
        <div class="chart-mockup">
          <div class="chart-metric"><strong>$128,450</strong><span>Total Revenue (+34%)</span></div>
          <div class="chart-bars">
            <span style="height: 45%"></span>
            <span style="height: 60%"></span>
            <span style="height: 85%"></span>
            <span style="height: 70%"></span>
            <span style="height: 100%"></span>
          </div>
        </div>
      </div>
    </div>

    <!-- Top layer: Before, clipped by percentage -->
    <div class="layer layer-before" id="layerBefore">
      <div class="visual visual-before">
        <div class="badge-tag before-tag">Raw CSV Data</div>
        <div class="raw-data-mockup">
          <code>id,date,user,amount,status<br>101,2026-10-01,usr_92,120.00,PAID<br>102,2026-10-02,usr_44,450.50,PENDING<br>103,2026-10-03,usr_18,89.00,PAID<br>104,2026-10-04,usr_62,1200.00,PAID<br>105,2026-10-05,usr_77,340.20,FAILED</code>
        </div>
      </div>
    </div>

    <!-- Slider divider bar -->
    <div class="divider" id="sliderDivider">
      <div class="divider-line"></div>
      <div class="divider-handle" aria-label="Drag to compare before and after">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m8 6-6 6 6 6M16 6l6 6-6 6"/></svg>
      </div>
    </div>
  </div>
</section>`,
    css: `.compare-section {
  ${FONT}
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #f8fafc;
  padding: 80px 24px;
}

.compare-head {
  text-align: center;
  max-width: 640px;
  margin-bottom: 48px;
}

.eyebrow {
  color: #2506ad;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.compare-head h2 {
  margin: 12px 0 0;
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  color: #002057;
}

.compare-head p {
  margin: 10px 0 0;
  color: #5b6178;
  font-size: 1.05rem;
}

.slider-box {
  position: relative;
  width: min(92vw, 760px);
  aspect-ratio: 16 / 10;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 60px rgba(0, 32, 87, 0.12);
  border: 1px solid #e2e8f0;
  user-select: none;
  touch-action: pan-y;
  cursor: ew-resize;
}

.layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.visual {
  position: absolute;
  top: 0;
  left: 0;
  width: 760px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 36px;
}

.visual-after {
  background: linear-gradient(135deg, #0b1228 0%, #171d3a 100%);
  color: #fff;
}

.visual-before {
  background: #f1f5f9;
  color: #0f172a;
}

.layer-before {
  width: 50%;
  overflow: hidden;
  z-index: 2;
  border-right: 1px solid rgba(255, 255, 255, 0.2);
}

.badge-tag {
  position: absolute;
  top: 20px;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.after-tag {
  right: 20px;
  background: rgba(37, 6, 173, 0.4);
  color: #ff7b00;
  border: 1px solid rgba(255, 123, 0, 0.4);
}

.before-tag {
  left: 20px;
  background: #e2e8f0;
  color: #475569;
  border: 1px solid #cbd5e1;
}

.chart-mockup {
  width: min(80%, 420px);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 16px;
  padding: 24px;
}

.chart-metric strong {
  display: block;
  font-size: 1.8rem;
  color: #fff;
}
.chart-metric span {
  font-size: 0.85rem;
  color: #10b981;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  height: 110px;
  margin-top: 18px;
}
.chart-bars span {
  flex: 1;
  background: linear-gradient(180deg, #ff7b00, #2506ad);
  border-radius: 6px 6px 0 0;
}

.raw-data-mockup {
  width: min(80%, 420px);
  background: #fff;
  border: 1px solid #cbd5e1;
  border-radius: 14px;
  padding: 20px;
  font-family: monospace;
  font-size: 0.8rem;
  line-height: 1.7;
  color: #334155;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.divider {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 4px;
  margin-left: -2px;
  z-index: 10;
  pointer-events: none;
}

.divider-line {
  position: absolute;
  inset: 0;
  background: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.35);
}

.divider-handle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #2506ad;
  border: 3px solid #fff;
  color: #fff;
  display: grid;
  place-items: center;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.4);
}`,
    js: `var box = document.getElementById("sliderBox");
var layerBefore = document.getElementById("layerBefore");
var divider = document.getElementById("sliderDivider");
var dragging = false;

function setPosition(clientX) {
  var rect = box.getBoundingClientRect();
  var percent = (clientX - rect.left) / rect.width;
  percent = Math.max(0.05, Math.min(0.95, percent));
  var pVal = (percent * 100) + "%";

  layerBefore.style.width = pVal;
  divider.style.left = pVal;
}

box.addEventListener("pointerdown", function(e) {
  dragging = true;
  setPosition(e.clientX);
  box.setPointerCapture(e.pointerId);
});

box.addEventListener("pointermove", function(e) {
  if (dragging) setPosition(e.clientX);
});

box.addEventListener("pointerup", function() { dragging = false; });
box.addEventListener("pointercancel", function() { dragging = false; });`,
    prompt: `Create an interactive before-and-after comparison slider section with HTML, CSS and vanilla JavaScript.

Requirements:
- A responsive card container (max 760px wide, aspect-ratio 16:10, rounded corners) with two stacked visual layers.
- The bottom layer displays "After" (e.g. interactive chart dashboard on dark background).
- The top layer displays "Before" (e.g. raw CSV data on light background) and is clipped by setting width as a percentage (starts at 50%).
- A vertical divider bar with a circular draggable handle icon sits at the split position.
- JavaScript listens for pointer events (pointerdown, pointermove, pointerup) to smoothly update the split percentage across mouse and touch.
- Centered section header with eyebrow and description.

Return one HTML file with <style> and <script> tags.`,
    steps: [
      "Layer two full-size visuals on top of each other using position: absolute.",
      "Wrap the top layer in an element with overflow: hidden, and adjust its width from 0% to 100% to reveal the layer underneath.",
      "Give the inner visual fixed width (equal to the container's max width) so it does not distort as the parent width changes.",
      "Move the divider line and handle to the same percentage position.",
      "Use Pointer Events with setPointerCapture so drag interactions remain smooth even if the cursor leaves the element.",
    ],
    tips: [
      "Set touch-action: pan-y on the container so vertical page scrolling works while horizontal dragging controls the slider.",
      "Clamp the drag position between 5% and 95% so neither side completely vanishes.",
      "Use this for portfolio case studies to demonstrate design refactors.",
    ],
  },
  {
    slug: "pricing-calculator-section",
    name: "Interactive Pricing Calculator",
    tone: "light",
    tags: ["pricing", "calculator", "slider", "interactive", "saas"],
    description:
      "A dynamic pricing slider allowing users to estimate monthly bill based on monthly active users, featuring a yearly discount toggle and feature tier breakdowns.",
    html: `<section class="calc-section">
  <div class="calc-head">
    <span class="eyebrow">Predictable Pricing</span>
    <h2>Pay only for what you use</h2>
    <p>Scale your plan seamlessly as your business grows.</p>
  </div>

  <div class="calc-card">
    <div class="billing-switch">
      <span class="billing-opt active" id="btnMonthly">Monthly</span>
      <button class="toggle-pill" id="billingToggle" aria-label="Toggle annual billing discount">
        <span class="toggle-thumb"></span>
      </button>
      <span class="billing-opt" id="btnYearly">Yearly <small class="save-tag">20% OFF</small></span>
    </div>

    <div class="slider-group">
      <div class="slider-header">
        <span>Monthly Active Users</span>
        <strong id="usersDisplay">50,000 MAU</strong>
      </div>
      <input type="range" id="mauSlider" min="5000" max="250000" step="5000" value="50000" class="mau-range" aria-label="Monthly Active Users" />
      <div class="slider-ticks">
        <span>5k</span>
        <span>50k</span>
        <span>100k</span>
        <span>250k+</span>
      </div>
    </div>

    <div class="calc-divider"></div>

    <div class="price-summary">
      <div class="price-val-wrap">
        <span class="currency">&#8377;</span>
        <strong id="priceDisplay">1,999</strong>
        <span class="period" id="periodDisplay">/ month</span>
      </div>
      <p class="bill-note" id="billNote">Billed monthly. Cancel anytime.</p>
      <a href="#" class="calc-cta-btn">Start 14-day Free Trial &rarr;</a>
    </div>

    <ul class="features-checklist">
      <li>&#10003; Full platform access with zero limits</li>
      <li>&#10003; 99.95% guaranteed SLA uptime</li>
      <li>&#10003; Dedicated Slack support channel</li>
    </ul>
  </div>
</section>`,
    css: `.calc-section {
  ${FONT}
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #f8fafc;
  padding: 80px 24px;
}

.calc-head {
  text-align: center;
  max-width: 600px;
  margin-bottom: 40px;
}

.eyebrow {
  color: #2506ad;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.calc-head h2 {
  margin: 12px 0 0;
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  color: #002057;
}

.calc-head p {
  margin: 10px 0 0;
  color: #5b6178;
  font-size: 1.05rem;
}

.calc-card {
  width: min(92vw, 560px);
  background: #fff;
  border-radius: 24px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 20px 50px rgba(0, 32, 87, 0.08);
  padding: 40px 36px;
}

.billing-switch {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin-bottom: 36px;
}

.billing-opt {
  font-size: 0.95rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
}

.billing-opt.active {
  color: #002057;
}

.save-tag {
  background: #dcfce7;
  color: #15803d;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
}

.toggle-pill {
  width: 50px;
  height: 28px;
  border-radius: 999px;
  background: #e2e8f0;
  border: none;
  cursor: pointer;
  position: relative;
  transition: background 0.25s ease;
  outline: none;
}

.toggle-pill.checked {
  background: #2506ad;
}

.toggle-thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: transform 0.25s ease;
}

.toggle-pill.checked .toggle-thumb {
  transform: translateX(22px);
}

.slider-group {
  margin-bottom: 30px;
}

.slider-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
  color: #002057;
  font-weight: 600;
}

.slider-header strong {
  font-size: 1.15rem;
  color: #2506ad;
}

.mau-range {
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: #e2e8f0;
  outline: none;
  accent-color: #2506ad;
  cursor: pointer;
}

.slider-ticks {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 600;
}

.calc-divider {
  height: 1px;
  background: #f1f5f9;
  margin: 28px 0;
}

.price-summary {
  text-align: center;
  margin-bottom: 28px;
}

.price-val-wrap {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
}

.currency {
  font-size: 1.8rem;
  font-weight: 700;
  color: #002057;
}

.price-val-wrap strong {
  font-size: 3.2rem;
  font-weight: 800;
  color: #002057;
  line-height: 1;
}

.period {
  font-size: 1rem;
  color: #64748b;
  font-weight: 600;
}

.bill-note {
  margin: 6px 0 24px;
  font-size: 0.85rem;
  color: #64748b;
}

.calc-cta-btn {
  display: block;
  width: 100%;
  padding: 16px;
  border-radius: 14px;
  background: #2506ad;
  color: #fff;
  font-size: 1.05rem;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.2s ease;
  box-shadow: 0 10px 24px rgba(37, 6, 173, 0.25);
}

.calc-cta-btn:hover {
  background: #19047a;
  transform: translateY(-2px);
  box-shadow: 0 14px 30px rgba(37, 6, 173, 0.35);
}

.features-checklist {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 10px;
  font-size: 0.9rem;
  color: #475569;
}`,
    js: `var slider = document.getElementById("mauSlider");
var usersDisplay = document.getElementById("usersDisplay");
var priceDisplay = document.getElementById("priceDisplay");
var periodDisplay = document.getElementById("periodDisplay");
var billNote = document.getElementById("billNote");
var toggle = document.getElementById("billingToggle");
var btnMonthly = document.getElementById("btnMonthly");
var btnYearly = document.getElementById("btnYearly");

var isYearly = false;

function calculatePrice() {
  var mau = Number(slider.value);
  usersDisplay.textContent = mau.toLocaleString("en-IN") + " MAU";

  // Base tier formula: base ₹499 + ₹30 per 1000 MAU
  var monthlyCost = 499 + Math.round((mau / 1000) * 30);

  if (isYearly) {
    var discounted = Math.round(monthlyCost * 0.8);
    priceDisplay.textContent = discounted.toLocaleString("en-IN");
    periodDisplay.textContent = "/ month";
    billNote.textContent = "Billed annually (₹" + (discounted * 12).toLocaleString("en-IN") + "/yr). Save 20%.";
  } else {
    priceDisplay.textContent = monthlyCost.toLocaleString("en-IN");
    periodDisplay.textContent = "/ month";
    billNote.textContent = "Billed monthly. Cancel anytime.";
  }
}

slider.addEventListener("input", calculatePrice);

function setAnnual(val) {
  isYearly = val;
  toggle.classList.toggle("checked", isYearly);
  btnMonthly.classList.toggle("active", !isYearly);
  btnYearly.classList.toggle("active", isYearly);
  calculatePrice();
}

toggle.addEventListener("click", function() { setAnnual(!isYearly); });
btnMonthly.addEventListener("click", function() { setAnnual(false); });
btnYearly.addEventListener("click", function() { setAnnual(true); });

calculatePrice();`,
    prompt: `Create an interactive SaaS pricing calculator section with an active user range slider and billing discount switch.

Requirements:
- Centered header with subtitle on a subtle grey background.
- A card container (max 560px wide) with a monthly/yearly toggle pill (20% OFF discount badge on yearly).
- An <input type="range"> slider for Monthly Active Users from 5k to 250k with tick markers.
- Dynamic price formula in Indian rupees that updates instantly on slider input or annual billing switch.
- Calculated price formatted with toLocaleString("en-IN").
- Primary pill button "Start 14-day Free Trial" with subtle hover lift and shadow.
- Feature checklist below the CTA with check marks.

Return one HTML file with <style> and <script> tags.`,
    steps: [
      "Set up an input range slider for user volume with accessible labels.",
      "Write a pricing function that computes cost based on slider value and applies a 20% discount if annual is selected.",
      "Format numerical outputs with toLocaleString() for readability.",
      "Update text labels dynamically on slider input and toggle click.",
      "Style the range thumb and track with accent-color: #2506ad.",
    ],
    tips: [
      "Use step increments on the slider so numbers round to clean milestones (e.g. 5,000 MAU).",
      "Highlight the annual discount badge with high contrast green to encourage yearly subscriptions.",
      "Provide reassurance copy ('Cancel anytime') directly beneath the total price.",
    ],
  },
  {
    slug: "ai-chat-interface-section",
    name: "AI Copilot Workspace Section",
    tone: "dark",
    tags: ["ai", "chat", "copilot", "interface", "split", "interactive"],
    description:
      "A split landing page section showcasing an interactive AI assistant workspace with quick prompt chips, real-time message bubble simulation, and code responses.",
    html: `<section class="ai-sec">
  <div class="ai-wrap">
    <div class="ai-content">
      <span class="ai-eyebrow">Autonomous Intelligence</span>
      <h2>Code, debug &amp; deploy with an AI partner</h2>
      <p>Connect your repositories and chat directly with a context-aware model that understands your exact codebase, dependencies, and architecture.</p>
      <div class="ai-perks">
        <div class="perk"><span>⚡</span> 40ms average response latency</div>
        <div class="perk"><span>🔒</span> Zero data retention on private code</div>
        <div class="perk"><span>🧩</span> Integrates with GitHub, GitLab &amp; Slack</div>
      </div>
      <a href="#" class="ai-btn">Try Playground Free &rarr;</a>
    </div>

    <div class="ai-chatbox">
      <div class="chat-top">
        <div class="chat-title">
          <span class="chat-bot-icon">✦</span>
          <div>
            <strong>Copilot v3.4</strong>
            <span class="chat-status">Active in #backend-api</span>
          </div>
        </div>
        <span class="chat-model-badge">DeepSeek / Claude 3.5</span>
      </div>

      <div class="chat-messages" id="chatMsgs">
        <div class="msg msg-ai">
          <div class="msg-author">AI Assistant</div>
          <div class="msg-bubble">How can I assist your deployment pipeline today?</div>
        </div>
        <div class="msg msg-user">
          <div class="msg-bubble">Can you generate an optimized MongoDB aggregation pipeline for user retention cohorts?</div>
        </div>
        <div class="msg msg-ai">
          <div class="msg-author">AI Assistant</div>
          <div class="msg-bubble">
            Here is the pipeline with indexed $match and $facet stages for 30-day retention:
            <pre><code>[
  { $match: { createdAt: { $gte: ISODate("2026-01-01") } } },
  { $group: { _id: "$cohortWeek", activeUsers: { $addToSet: "$userId" } } }
]</code></pre>
          </div>
        </div>
      </div>

      <div class="chat-chips">
        <button class="chip" data-query="Explain time complexity">Explain time complexity</button>
        <button class="chip" data-query="Add unit test with Jest">Add Jest test</button>
        <button class="chip" data-query="Audit security vulnerabilities">Audit security</button>
      </div>

      <div class="chat-input-bar">
        <input type="text" id="chatInput" placeholder="Ask anything about your architecture..." />
        <button id="sendBtn" class="chat-send">Send</button>
      </div>
    </div>
  </div>
</section>`,
    css: `.ai-sec {
  ${FONT}
  min-height: 100vh;
  background: #060913;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
}

.ai-wrap {
  max-width: 1200px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1.15fr;
  gap: 56px;
  align-items: center;
}

@media (max-width: 960px) {
  .ai-wrap { grid-template-columns: 1fr; gap: 40px; }
}

.ai-eyebrow {
  display: inline-block;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #818cf8;
  margin-bottom: 12px;
}

.ai-content h2 {
  font-size: clamp(2rem, 3.8vw, 3rem);
  line-height: 1.15;
  margin: 0 0 18px;
  color: #ffffff;
  letter-spacing: -0.5px;
}

.ai-content p {
  font-size: 17px;
  line-height: 1.6;
  color: #94a3b8;
  margin: 0 0 28px;
}

.ai-perks {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 32px;
}

.perk {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14.5px;
  color: #cbd5e1;
}

.ai-btn {
  display: inline-flex;
  padding: 14px 28px;
  border-radius: 999px;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 10px 25px rgba(99, 102, 241, 0.4);
  transition: transform 0.2s ease;
}

.ai-btn:hover { transform: translateY(-2px); }

/* Chat Card */
.ai-chatbox {
  background: #0d1222;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 22px;
  padding: 24px;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  height: 520px;
}

.chat-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 16px;
}

.chat-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.chat-bot-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.chat-title strong {
  display: block;
  font-size: 15px;
  color: #ffffff;
}

.chat-status {
  font-size: 12px;
  color: #10b981;
}

.chat-model-badge {
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #94a3b8;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-right: 6px;
}

.msg {
  display: flex;
  flex-direction: column;
  max-width: 86%;
}

.msg-author {
  font-size: 11.5px;
  color: #818cf8;
  margin-bottom: 4px;
  font-weight: 600;
}

.msg-bubble {
  padding: 12px 16px;
  border-radius: 14px;
  font-size: 13.5px;
  line-height: 1.5;
}

.msg-ai .msg-bubble {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #e2e8f0;
}

.msg-ai pre {
  margin: 10px 0 0;
  padding: 10px;
  background: #070a12;
  border-radius: 8px;
  overflow-x: auto;
  font-family: monospace;
  font-size: 12px;
  color: #38bdf8;
}

.msg-user {
  align-self: flex-end;
}

.msg-user .msg-bubble {
  background: #6366f1;
  color: #ffffff;
  border-bottom-right-radius: 4px;
}

.chat-chips {
  display: flex;
  gap: 8px;
  margin: 14px 0 10px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.chip {
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #94a3b8;
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.chip:hover {
  background: rgba(99, 102, 241, 0.2);
  border-color: #6366f1;
  color: #ffffff;
}

.chat-input-bar {
  display: flex;
  gap: 10px;
}

.chat-input-bar input {
  flex: 1;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  color: #ffffff;
  font-size: 14px;
  outline: none;
}

.chat-input-bar input:focus { border-color: #6366f1; }

.chat-send {
  padding: 10px 20px;
  border-radius: 12px;
  background: #6366f1;
  border: none;
  color: #ffffff;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}

.chat-send:hover { background: #4f46e5; }`,
    js: `var chatMsgs = document.getElementById("chatMsgs");
var chatInput = document.getElementById("chatInput");
var sendBtn = document.getElementById("sendBtn");
var chips = document.querySelectorAll(".chip");

function appendMsg(text, isUser) {
  var msgDiv = document.createElement("div");
  msgDiv.className = isUser ? "msg msg-user" : "msg msg-ai";
  if (!isUser) {
    var author = document.createElement("div");
    author.className = "msg-author";
    author.textContent = "AI Assistant";
    msgDiv.appendChild(author);
  }
  var bubble = document.createElement("div");
  bubble.className = "msg-bubble";
  bubble.textContent = text;
  msgDiv.appendChild(bubble);
  chatMsgs.appendChild(msgDiv);
  chatMsgs.scrollTop = chatMsgs.scrollHeight;
}

function handleSend(text) {
  var content = text || chatInput.value.trim();
  if (!content) return;
  appendMsg(content, true);
  chatInput.value = "";

  setTimeout(function() {
    appendMsg("Analyzing your request: \\"" + content + "\\". Generated optimized solution ready to review.", false);
  }, 600);
}

sendBtn.addEventListener("click", function() { handleSend(); });
chatInput.addEventListener("keydown", function(e) {
  if (e.key === "Enter") handleSend();
});

chips.forEach(function(chip) {
  chip.addEventListener("click", function() {
    var q = chip.getAttribute("data-query");
    handleSend(q);
  });
});`,
    prompt: `Create a split landing-page section with an interactive AI assistant chat workspace in HTML, CSS and vanilla JavaScript.

Requirements:
- Split layout: marketing value proposition on the left (eyebrow, title, benefits list with icons, CTA button).
- Interactive simulated chat card on the right (dark navy #0d1222, 22px radius, model version badge).
- Chat stream with distinct user (purple bubble, aligned right) and assistant messages (glass bubble, aligned left, formatted code blocks).
- Quick prompt chips above the input bar that insert realistic developer questions when clicked.
- Working message input that appends user message and simulates an automated AI reply after 600ms.

Return one HTML file with <style> and <script> tags.`,
    steps: [
      "Set up a 2-column CSS grid that stacks responsively on mobile viewports.",
      "Design the chat UI with header status, scrollable conversation viewport, chips bar, and input form.",
      "Style user and assistant message bubbles with high contrast color coding.",
      "Write JavaScript to append messages dynamically and auto-scroll to the latest message.",
      "Add quick-suggestion chips that dispatch sample queries on click.",
    ],
    tips: [
      "Use overflow-y: auto with scroll-behavior: smooth so conversation scrolling feels natural.",
      "Sanitize or escape user text if rendering dynamic HTML in production.",
    ],
  },
  {
    slug: "comparison-matrix-section",
    name: "Feature Comparison Matrix",
    tone: "light",
    tags: ["comparison", "table", "pricing", "matrix", "features", "saas"],
    description:
      "A clear 'Us vs Competitors' comparison table section highlighting distinct advantages, checkmarks, cross marks, and category rows.",
    html: `<section class="cmp-sec">
  <div class="cmp-wrap">
    <div class="cmp-head">
      <span class="cmp-eyebrow">Why Choose Us</span>
      <h2>See how we compare</h2>
      <p>Transparent feature breakdown against traditional alternatives and legacy enterprise tools.</p>
    </div>

    <div class="cmp-table-wrap">
      <table class="cmp-table">
        <thead>
          <tr>
            <th class="cmp-feature-col">Feature &amp; Capability</th>
            <th class="cmp-col-us">
              <span class="cmp-badge">Recommended</span>
              <strong>Our Platform</strong>
            </th>
            <th>Traditional Tools</th>
            <th>Legacy Enterprise</th>
          </tr>
        </thead>
        <tbody>
          <tr class="cmp-cat"><td colspan="4">Performance &amp; Speed</td></tr>
          <tr>
            <td>Average Query Response Time</td>
            <td class="cmp-us"><strong>&lt; 50ms</strong></td>
            <td>350ms - 800ms</td>
            <td>1.5s - 3s</td>
          </tr>
          <tr>
            <td>Real-time Collaborative Sync</td>
            <td class="cmp-us"><span class="chk">&#10003; Yes (Instant)</span></td>
            <td><span class="cross">&#10007; Polling</span></td>
            <td><span class="cross">&#10007; Manual</span></td>
          </tr>
          <tr>
            <td>Edge Deployment Across 300+ Cities</td>
            <td class="cmp-us"><span class="chk">&#10003; Built-in</span></td>
            <td><span class="cross">&#10007; Extra Addon</span></td>
            <td><span class="chk">&#10003; High Cost</span></td>
          </tr>

          <tr class="cmp-cat"><td colspan="4">Developer Experience &amp; AI</td></tr>
          <tr>
            <td>Native AI Copilot &amp; Automations</td>
            <td class="cmp-us"><span class="chk">&#10003; Included</span></td>
            <td><span class="cross">&#10007; None</span></td>
            <td><span class="cross">&#10007; Separate Contract</span></td>
          </tr>
          <tr>
            <td>One-Click Git &amp; CI/CD Integration</td>
            <td class="cmp-us"><span class="chk">&#10003; Yes</span></td>
            <td><span class="chk">&#10003; Yes</span></td>
            <td><span class="cross">&#10007; Complex Setup</span></td>
          </tr>
          <tr>
            <td>Transparent Usage-Based Pricing</td>
            <td class="cmp-us"><span class="chk">&#10003; Pay as you scale</span></td>
            <td><span class="cross">&#10007; Seat Lock-in</span></td>
            <td><span class="cross">&#10007; Annual Commit</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</section>`,
    css: `.cmp-sec {
  ${FONT}
  background: #f8fafc;
  padding: 80px 24px;
}

.cmp-wrap {
  max-width: 1040px;
  margin: 0 auto;
}

.cmp-head {
  text-align: center;
  max-width: 600px;
  margin: 0 auto 48px;
}

.cmp-eyebrow {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: #2506ad;
}

.cmp-head h2 {
  font-size: clamp(2rem, 3.5vw, 2.7rem);
  color: #0f172a;
  margin: 10px 0 14px;
}

.cmp-head p {
  font-size: 16px;
  color: #64748b;
  margin: 0;
}

.cmp-table-wrap {
  overflow-x: auto;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
}

.cmp-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 680px;
  font-size: 14.5px;
}

.cmp-table th {
  padding: 24px 20px;
  text-align: left;
  border-bottom: 2px solid #e2e8f0;
  color: #334155;
  font-size: 15px;
  background: #f8fafc;
}

.cmp-col-us {
  background: rgba(37, 6, 173, 0.04) !important;
  border-left: 2px solid #2506ad;
  border-right: 2px solid #2506ad;
  position: relative;
}

.cmp-badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  color: #ffffff;
  background: #2506ad;
  padding: 3px 10px;
  border-radius: 999px;
  margin-bottom: 6px;
}

.cmp-col-us strong {
  display: block;
  font-size: 17px;
  color: #2506ad;
}

.cmp-table td {
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
  color: #64748b;
}

.cmp-table tbody tr:hover td {
  background: #fafafa;
}

.cmp-table td.cmp-us {
  background: rgba(37, 6, 173, 0.02);
  border-left: 2px solid #2506ad;
  border-right: 2px solid #2506ad;
  color: #0f172a;
  font-weight: 600;
}

.cmp-cat td {
  background: #f1f5f9 !important;
  color: #0f172a !important;
  font-weight: 700;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  padding: 12px 20px;
}

.chk {
  color: #10b981;
  font-weight: 600;
}

.cross {
  color: #94a3b8;
}`,
    prompt: `Create a clean, responsive SaaS comparison matrix table section in HTML and CSS.

Requirements:
- Centered section header with eyebrow and title.
- Comparison table comparing 'Our Platform' vs 'Traditional Tools' vs 'Legacy Enterprise'.
- Highlight our column with an indigo accent border, recommended badge, and soft tinted background.
- Categorized rows (e.g. Performance & Speed, Developer Experience).
- Green checkmarks for supported features, grey cross markers for missing features.
- Horizontal scroll wrap for seamless mobile viewing without breaking layout.

Return one HTML file with a <style> block.`,
    steps: [
      "Lay out the table inside a container with overflow-x: auto for mobile responsiveness.",
      "Style table header with clear column titles and a distinct 'Recommended' badge over your column.",
      "Add category spacer rows spanning all 4 columns with distinct background tints.",
      "Use green checkmark and muted cross symbols for rapid visual comparison.",
    ],
    tips: [
      "Keep column widths consistent using fixed percentage or table-layout: fixed.",
      "Highlight your column with a continuous vertical border to anchor the reader's eye.",
    ],
  },
  {
    slug: "customer-wall-of-love-section",
    name: "Customer Wall of Love",
    tone: "dark",
    tags: ["testimonials", "social proof", "reviews", "masonry", "wall of love"],
    description:
      "A responsive multi-column masonry wall of customer love featuring verified avatars, star ratings, quotes, and role badges.",
    html: `<section class="wall-sec">
  <div class="wall-wrap">
    <div class="wall-head">
      <span class="wall-eyebrow">Social Proof</span>
      <h2>Loved by 25,000+ developers worldwide</h2>
      <p>Here is what founders, engineering leads, and indie hackers say about shipping with our tools.</p>
    </div>

    <div class="wall-grid">
      <article class="wall-card">
        <div class="wall-user">
          <div class="wall-avatar" style="background: #3b82f6;">SK</div>
          <div>
            <strong>Sarah Kovacs</strong>
            <span>VP of Engineering @ Lumina</span>
          </div>
        </div>
        <div class="wall-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
        <p>"We cut our release cycle from 3 weeks to 2 days after migrating to this stack. The developer experience is unmatched."</p>
        <span class="wall-tag">#Velocity</span>
      </article>

      <article class="wall-card wall-featured">
        <div class="wall-user">
          <div class="wall-avatar" style="background: #8b5cf6;">AR</div>
          <div>
            <strong>Aarav Sharma</strong>
            <span>Founder &amp; CTO @ Flowbyte</span>
          </div>
        </div>
        <div class="wall-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
        <p>"Saved us at least two full-time engineering hires. The AI prompts and components are production-ready right out of the box."</p>
        <span class="wall-tag">#StartupGrowth</span>
      </article>

      <article class="wall-card">
        <div class="wall-user">
          <div class="wall-avatar" style="background: #10b981;">EM</div>
          <div>
            <strong>Elena Moreno</strong>
            <span>Senior Frontend Architect</span>
          </div>
        </div>
        <div class="wall-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
        <p>"Clean, accessible HTML and vanilla CSS without bloatware or 500 npm dependencies. Exactly what the web needs."</p>
        <span class="wall-tag">#CleanCode</span>
      </article>

      <article class="wall-card">
        <div class="wall-user">
          <div class="wall-avatar" style="background: #f59e0b;">ML</div>
          <div>
            <strong>Marcus Lindqvist</strong>
            <span>Tech Lead @ Nordik Labs</span>
          </div>
        </div>
        <div class="wall-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
        <p>"Our Lighthouse performance score jumped from 62 to 96 on mobile after applying these structural guidelines."</p>
        <span class="wall-tag">#Performance</span>
      </article>

      <article class="wall-card">
        <div class="wall-user">
          <div class="wall-avatar" style="background: #ec4899;">PR</div>
          <div>
            <strong>Priya Raman</strong>
            <span>Full Stack Developer</span>
          </div>
        </div>
        <div class="wall-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
        <p>"The notes and templates are goldmines for interview prep and shipping client MVPs. Truly exceptional quality."</p>
        <span class="wall-tag">#Community</span>
      </article>

      <article class="wall-card">
        <div class="wall-user">
          <div class="wall-avatar" style="background: #6366f1;">DK</div>
          <div>
            <strong>David Kim</strong>
            <span>Product Designer</span>
          </div>
        </div>
        <div class="wall-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
        <p>"The 3D canvas and gradient templates gave our landing page that crisp tier-1 Silicon Valley finish."</p>
        <span class="wall-tag">#DesignSystems</span>
      </article>
    </div>
  </div>
</section>`,
    css: `.wall-sec {
  ${FONT}
  background: #090d16;
  color: #ffffff;
  padding: 80px 24px;
}

.wall-wrap {
  max-width: 1200px;
  margin: 0 auto;
}

.wall-head {
  text-align: center;
  max-width: 640px;
  margin: 0 auto 52px;
}

.wall-eyebrow {
  color: #a855f7;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.2px;
}

.wall-head h2 {
  font-size: clamp(2rem, 3.8vw, 3rem);
  margin: 12px 0 16px;
  color: #ffffff;
}

.wall-head p {
  font-size: 16.5px;
  color: #94a3b8;
  line-height: 1.6;
}

.wall-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

@media (max-width: 900px) {
  .wall-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 600px) {
  .wall-grid { grid-template-columns: 1fr; }
}

.wall-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  transition: transform 0.25s ease, border-color 0.25s ease;
}

.wall-card:hover {
  transform: translateY(-4px);
  border-color: rgba(168, 85, 247, 0.4);
}

.wall-featured {
  background: linear-gradient(180deg, rgba(168, 85, 247, 0.08), rgba(255, 255, 255, 0.02));
  border-color: rgba(168, 85, 247, 0.25);
}

.wall-user {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.wall-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wall-user strong {
  display: block;
  font-size: 15px;
  color: #ffffff;
}

.wall-user span {
  font-size: 12px;
  color: #94a3b8;
}

.wall-stars {
  color: #fbbf24;
  font-size: 14px;
  margin-bottom: 12px;
  letter-spacing: 2px;
}

.wall-card p {
  font-size: 14.5px;
  line-height: 1.6;
  color: #cbd5e1;
  margin: 0 0 16px;
  flex: 1;
}

.wall-tag {
  font-size: 12px;
  color: #a855f7;
  font-weight: 600;
}`,
    prompt: `Create a dark modern Wall of Love customer testimonials section in HTML and CSS.

Requirements:
- Centered header with subtitle on a dark navy (#090d16) background.
- Responsive 3-column grid of testimonial cards with subtle translucent borders.
- Each card has: user avatar circle with initials, name, title/company, 5 gold stars, quotation text, and a hashtag topic badge.
- Featured card with a soft purple gradient background tint.
- Subtle upward lift and purple border highlight on card hover.

Return one HTML file with a <style> block.`,
    steps: [
      "Set up a 3-column CSS grid with responsive media queries for tablets and mobile.",
      "Style cards with dark glassmorphic borders and soft box shadows.",
      "Add user metadata (avatar, name, role) and gold star ratings.",
      "Add interactive hover transforms for tactile feedback.",
    ],
    tips: [
      "Use flex: 1 on the quote paragraph so card heights align naturally across grid rows.",
      "Highlight key customer wins with hashtag pills at the bottom of each card.",
    ],
  },
  {
    slug: "developer-cli-quickstart-section",
    name: "Developer CLI Quickstart Section",
    tone: "dark",
    tags: ["terminal", "cli", "developer", "quickstart", "code", "npm"],
    description:
      "A developer-first quickstart section featuring package manager tabs (npm, pnpm, yarn, bun), a 1-click copyable terminal command, and ASCII art banner.",
    html: `<section class="cli-sec">
  <div class="cli-wrap">
    <div class="cli-head">
      <span class="cli-badge">Developer Quickstart</span>
      <h2>Start building in 30 seconds</h2>
      <p>Initialize a production-ready template with our interactive CLI wizard. Zero configuration required.</p>
    </div>

    <div class="term-window">
      <div class="term-bar">
        <div class="term-dots">
          <span class="d-red"></span><span class="d-yellow"></span><span class="d-green"></span>
        </div>
        <div class="term-tabs" id="pkgTabs">
          <button class="t-btn is-active" data-cmd="npm create hyper-app@latest">npm</button>
          <button class="t-btn" data-cmd="pnpm create hyper-app">pnpm</button>
          <button class="t-btn" data-cmd="yarn create hyper-app">yarn</button>
          <button class="t-btn" data-cmd="bun create hyper-app">bun</button>
        </div>
        <button class="term-copy" id="copyCmdBtn">Copy</button>
      </div>

      <div class="term-body">
        <div class="term-prompt-line">
          <span class="p-sign">&gt;</span>
          <span class="p-code" id="cmdText">npm create hyper-app@latest</span>
        </div>
        <pre class="ascii-art">
   __  __                       ___
  / / / /_  ______  ___  _____ /   |  ____  ____
 / /_/ / / / / __ \\/ _ \\/ ___// /| | / __ \\/ __ \\
/ __  / /_/ / /_/ /  __/ /   / ___ |/ /_/ / /_/ /
/_/ /_/\\__, / .___/\\___/_/   /_/  |_/ .___/ .___/
      /____/_/                     /_/   /_/
        </pre>
        <div class="term-status">
          <span class="s-dot"></span> Interactive scaffolding initialized for Next.js 16 + Tailwind CSS.
        </div>
      </div>
    </div>
  </div>
</section>`,
    css: `.cli-sec {
  ${FONT}
  background: #060913;
  color: #ffffff;
  padding: 80px 24px;
}

.cli-wrap {
  max-width: 900px;
  margin: 0 auto;
}

.cli-head {
  text-align: center;
  max-width: 640px;
  margin: 0 auto 40px;
}

.cli-badge {
  display: inline-block;
  font-size: 12.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: #38bdf8;
  margin-bottom: 12px;
}

.cli-head h2 {
  font-size: clamp(2rem, 3.6vw, 2.8rem);
  margin: 0 0 14px;
  color: #ffffff;
}

.cli-head p {
  font-size: 16.5px;
  color: #94a3b8;
  line-height: 1.6;
  margin: 0;
}

.term-window {
  background: #090e1c;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.7);
}

.term-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px;
  background: #0f172a;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.term-dots {
  display: flex;
  gap: 7px;
}

.term-dots span {
  width: 11px;
  height: 11px;
  border-radius: 50%;
}

.d-red { background: #ef4444; }
.d-yellow { background: #f59e0b; }
.d-green { background: #10b981; }

.term-tabs {
  display: flex;
  gap: 4px;
  background: rgba(0, 0, 0, 0.3);
  padding: 3px;
  border-radius: 8px;
}

.t-btn {
  background: transparent;
  border: none;
  padding: 5px 12px;
  border-radius: 6px;
  color: #94a3b8;
  font-size: 12.5px;
  font-family: monospace;
  cursor: pointer;
  transition: all 0.2s ease;
}

.t-btn.is-active {
  background: #1e293b;
  color: #38bdf8;
  font-weight: 700;
}

.term-copy {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 6px;
  color: #cbd5e1;
  padding: 5px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.term-copy:hover {
  background: rgba(255, 255, 255, 0.16);
}

.term-body {
  padding: 24px;
  font-family: "JetBrains Mono", monospace;
  font-size: 14px;
}

.term-prompt-line {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.p-sign {
  color: #38bdf8;
  font-weight: 800;
}

.p-code {
  color: #ffffff;
  font-weight: 700;
}

.ascii-art {
  color: #38bdf8;
  font-size: 11px;
  line-height: 1.25;
  margin: 0 0 20px;
  user-select: none;
  opacity: 0.85;
}

.term-status {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: #94a3b8;
}

.s-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 8px #10b981;
}`,
    js: `var tabs = document.querySelectorAll(".t-btn");
var cmdText = document.getElementById("cmdText");
var copyBtn = document.getElementById("copyCmdBtn");

tabs.forEach(function(tab) {
  tab.addEventListener("click", function() {
    tabs.forEach(function(t) { t.classList.remove("is-active"); });
    tab.classList.add("is-active");
    cmdText.textContent = tab.getAttribute("data-cmd");
  });
});

copyBtn.addEventListener("click", function() {
  navigator.clipboard.writeText(cmdText.textContent).then(function() {
    copyBtn.textContent = "Copied!";
    copyBtn.style.background = "#10b981";
    setTimeout(function() {
      copyBtn.textContent = "Copy";
      copyBtn.style.background = "rgba(255, 255, 255, 0.08)";
    }, 1500);
  });
});`,
    prompt: `Create a developer CLI quickstart terminal section in HTML, CSS and vanilla JavaScript.

Requirements:
- Centered section header on dark background (#060913).
- Realistic macOS terminal window with window control dots, package manager tabs (npm, pnpm, yarn, bun), and 1-click copy button.
- Clicking package manager tabs dynamically switches the command string (e.g. npm create vs pnpm create).
- Copy button copies the active command to clipboard and displays feedback.
- ASCII art logo banner in cyan monospace inside the terminal body.

Return one HTML file with <style> and <script> tags.`,
    steps: [
      "Style a terminal card with window chrome bar and control dots.",
      "Add interactive package manager tabs with data-cmd attributes.",
      "Update command text on tab click.",
      "Wire up navigator.clipboard.writeText with visual copied state.",
    ],
    tips: [
      "Use user-select: none on ASCII art so users selecting text copy only commands.",
      "Include a pulsing green status dot to reinforce active system health.",
    ],
  },
  {
    slug: "interactive-faq-search-section",
    name: "Interactive FAQ Search Section",
    tone: "light",
    tags: ["faq", "accordion", "search", "filter", "questions", "support"],
    description:
      "A customer support FAQ section featuring a live real-time search input that filters question accordions on keypress.",
    html: `<section class="faq-s-sec">
  <div class="faq-s-wrap">
    <div class="faq-s-head">
      <span class="faq-s-badge">Help Center</span>
      <h2>Frequently Asked Questions</h2>
      <p>Have questions? Search our knowledge base or browse popular topics below.</p>
      <div class="faq-search-bar">
        <input type="search" id="faqSearchInput" placeholder="Search questions: pricing, API, security..." />
      </div>
    </div>

    <div class="faq-accordions" id="faqAccordionList">
      <details class="faq-item" data-q="how do subscriptions and billing work monthly annual refund">
        <summary>How does the billing and refund policy work?</summary>
        <div class="faq-answer">
          We offer transparent monthly and annual billing in both USD and INR. You can cancel your subscription at any time with one click. If you are unsatisfied within the first 14 days, contact support for a no-questions-asked refund.
        </div>
      </details>

      <details class="faq-item" data-q="can i use templates for commercial client work projects copyright">
        <summary>Can I use these UI templates for commercial client work?</summary>
        <div class="faq-answer">
          Yes! All templates and components are 100% free for both personal and commercial client projects. No attribution is required, though sharing a link back is always appreciated.
        </div>
      </details>

      <details class="faq-item" data-q="which ai tools are supported claude cursor chatgpt v0 bolt">
        <summary>Which AI coding tools work with the prompts?</summary>
        <div class="faq-answer">
          The prompts are tested and tuned for Claude 3.5 Sonnet, ChatGPT (GPT-4o), Cursor, v0, Bolt, and Google Gemini. Tools that support file scaffolding like Cursor and v0 work best for full website generation.
        </div>
      </details>

      <details class="faq-item" data-q="what happens if my api rate limit is exceeded usage">
        <summary>What happens if my team exceeds the monthly execution limits?</summary>
        <div class="faq-answer">
          We never shut down production traffic. If your usage exceeds plan capacity, we notify you and bill soft overages at standard pay-as-you-go rates without disruption.
        </div>
      </details>
    </div>
  </div>
</section>`,
    css: `.faq-s-sec {
  ${FONT}
  background: #f8fafc;
  padding: 80px 24px;
}

.faq-s-wrap {
  max-width: 820px;
  margin: 0 auto;
}

.faq-s-head {
  text-align: center;
  margin-bottom: 40px;
}

.faq-s-badge {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  color: #2563eb;
  letter-spacing: 1px;
}

.faq-s-head h2 {
  font-size: clamp(2rem, 3.5vw, 2.8rem);
  color: #0f172a;
  margin: 10px 0 14px;
}

.faq-s-head p {
  font-size: 16.5px;
  color: #64748b;
  margin: 0 0 24px;
}

.faq-search-bar input {
  width: 100%;
  max-width: 520px;
  padding: 14px 20px;
  border-radius: 12px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  font-size: 15px;
  color: #0f172a;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
  outline: none;
}

.faq-search-bar input:focus {
  border-color: #2563eb;
}

.faq-accordions {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.faq-item {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
  transition: border-color 0.2s ease;
}

.faq-item[open] {
  border-color: #2563eb;
}

.faq-item summary {
  padding: 18px 22px;
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  cursor: pointer;
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.faq-item summary::-webkit-details-marker {
  display: none;
}

.faq-item summary::after {
  content: "+";
  font-size: 20px;
  color: #64748b;
  font-weight: 400;
}

.faq-item[open] summary::after {
  content: "−";
  color: #2563eb;
}

.faq-answer {
  padding: 0 22px 20px;
  font-size: 15px;
  line-height: 1.6;
  color: #475569;
}`,
    js: `var search = document.getElementById("faqSearchInput");
var items = document.querySelectorAll(".faq-item");

search.addEventListener("input", function() {
  var q = search.value.trim().toLowerCase();
  items.forEach(function(item) {
    var text = (item.getAttribute("data-q") + " " + item.textContent).toLowerCase();
    item.style.display = (!q || text.includes(q)) ? "block" : "none";
  });
});`,
    prompt: `Create a responsive FAQ section with instant live client-side search in HTML, CSS and vanilla JavaScript.

Requirements:
- Centered header with search input box.
- List of questions using native semantic <details> and <summary> tags.
- Custom open/close plus/minus icon indicators on summary.
- JavaScript input listener that filters questions instantly based on keywords.

Return one HTML file with <style> and <script> tags.`,
    steps: [
      "Use semantic <details> and <summary> for accessible, native accordion behavior.",
      "Add data-q search attribute with keywords for each item.",
      "Filter item display on input keypress using JavaScript.",
    ],
    tips: [
      "Semantic HTML details elements work even if JavaScript fails to load.",
    ],
  },
];
