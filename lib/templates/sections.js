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
  {
    slug: "modern-bento-grid-features",
    name: "Modern Bento Grid Features",
    tone: "dark",
    tags: ["bento", "features", "grid", "saas", "section"],
    colors: ["#030712", "#6366f1", "#10b981", "#ffffff"],
    description: "An asymmetric bento grid feature layout with glowing gradient borders, metric chips, and responsive flex/grid structure.",
    html: `<section class="bento-sec">
  <div class="bento-header">
    <span class="bento-badge">✦ Architecture & Infrastructure</span>
    <h2>Built for high-throughput modern teams</h2>
    <p>Everything you need to ship, monitor, and scale distributed applications without infrastructure friction.</p>
  </div>

  <div class="bento-grid">
    <!-- Large Card: 2 Cols -->
    <div class="bento-card bento-wide">
      <div class="bento-tag">Real-Time Sync</div>
      <h3>Sub-millisecond global state replication</h3>
      <p>Data automatically synchronizes across 35 edge regions with instant optimistic UI updates and CRDT conflict resolution.</p>
      <div class="bento-vis-globe">
        <div class="globe-point p1"></div>
        <div class="globe-point p2"></div>
        <div class="globe-point p3"></div>
        <div class="globe-conn"></div>
      </div>
    </div>

    <!-- Tall Card: 1 Col -->
    <div class="bento-card">
      <div class="bento-tag" style="color: #34d399; border-color: rgba(52, 211, 153, 0.3);">99.999% SLA</div>
      <h3>Fault-Tolerant Clusters</h3>
      <p>Automatic failover and zero cold-start replication guarantee uninterrupted system uptime.</p>
      <div class="bento-metric-box">
        <span class="bento-num">0.02ms</span>
        <span class="bento-lbl">P99 Query Latency</span>
      </div>
    </div>

    <!-- Regular Card -->
    <div class="bento-card">
      <div class="bento-tag" style="color: #60a5fa; border-color: rgba(96, 165, 250, 0.3);">Enterprise Security</div>
      <h3>SOC2 & End-to-End Encryption</h3>
      <p>Every payload is encrypted in transit and at rest with hardware-backed KMS keys.</p>
    </div>

    <!-- Wide Card 2: 2 Cols -->
    <div class="bento-card bento-wide">
      <div class="bento-tag" style="color: #f472b6; border-color: rgba(244, 114, 182, 0.3);">Developer Experience</div>
      <h3>First-Class TypeScript SDK</h3>
      <p>Enjoy end-to-end type safety, auto-generated schema migrations, and zero-config CI test pipelines.</p>
      <div class="bento-code-chip">
        <code>$ npx @orbit/cli deploy --production</code>
      </div>
    </div>
  </div>
</section>`,
    css: `.bento-sec {
  background: #030712;
  color: #ffffff;
  padding: 80px 24px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.bento-header {
  text-align: center;
  max-width: 680px;
  margin: 0 auto 50px;
}

.bento-badge {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  color: #a855f7;
  letter-spacing: 1.5px;
  padding: 4px 14px;
  background: rgba(168, 85, 247, 0.1);
  border: 1px solid rgba(168, 85, 247, 0.3);
  border-radius: 999px;
  margin-bottom: 16px;
}

.bento-header h2 {
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 800;
  line-height: 1.15;
  margin: 0 0 16px;
  letter-spacing: -1px;
}

.bento-header p {
  font-size: 16.5px;
  color: #94a3b8;
  line-height: 1.6;
  margin: 0;
}

.bento-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  max-width: 1100px;
  margin: 0 auto;
}

@media (max-width: 860px) {
  .bento-grid { grid-template-columns: 1fr; }
  .bento-card.bento-wide { grid-column: span 1 !important; }
}

.bento-card {
  background: #0b1120;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 32px 28px;
  display: flex;
  flex-direction: column;
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
  position: relative;
  overflow: hidden;
}

.bento-card:hover {
  transform: translateY(-4px);
  border-color: rgba(99, 102, 241, 0.4);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.bento-wide {
  grid-column: span 2;
}

.bento-tag {
  align-self: flex-start;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: #818cf8;
  letter-spacing: 1px;
  padding: 3px 10px;
  border-radius: 999px;
  border: 1px solid rgba(129, 140, 248, 0.3);
  margin-bottom: 16px;
}

.bento-card h3 {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 10px;
  line-height: 1.3;
}

.bento-card p {
  font-size: 14.5px;
  color: #94a3b8;
  line-height: 1.6;
  margin: 0;
  flex: 1;
}

.bento-metric-box {
  margin-top: 24px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 16px;
  text-align: center;
}

.bento-num {
  display: block;
  font-size: 28px;
  font-weight: 800;
  color: #34d399;
}

.bento-lbl {
  font-size: 11px;
  text-transform: uppercase;
  color: #64748b;
  font-weight: 600;
  letter-spacing: 1px;
}

.bento-code-chip {
  margin-top: 20px;
  background: #020617;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 12px 16px;
  font-family: ui-monospace, monospace;
  font-size: 13px;
  color: #38bdf8;
}

.bento-vis-globe {
  position: relative;
  height: 60px;
  margin-top: 24px;
  background: radial-gradient(ellipse at center, rgba(99, 102, 241, 0.15), transparent 70%);
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.globe-point {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #818cf8;
  box-shadow: 0 0 12px #818cf8;
  animation: bentoPulse 2s infinite ease-in-out;
}

.globe-point.p2 { animation-delay: 0.6s; }
.globe-point.p3 { animation-delay: 1.2s; }

@keyframes bentoPulse {
  0%, 100% { transform: scale(0.8); opacity: 0.6; }
  50% { transform: scale(1.3); opacity: 1; }
}`,
    prompt: `Create a modern SaaS bento grid features section in HTML and CSS.

Requirements:
- Asymmetric 3-column CSS Grid where select cards span 2 columns (.bento-wide).
- Deep dark slate theme (#030712) with glowing border hover transitions.
- Varied internal card contents: live metric badge, terminal CLI chip, and pulsing node status visual.
- Responsive design that folds cleanly to a single column on mobile.

Return one HTML file with a <style> block.`,
    steps: [
      "Use CSS grid-template-columns: repeat(3, 1fr) with grid-column: span 2 for priority cards.",
      "Add glowing borders and soft translateY hover transitions.",
      "Implement responsive media queries for tablet and mobile screens.",
    ],
    tips: [
      "Keep card padding uniform (e.g. 32px 28px) for geometric harmony.",
      "Use different accent colors for each card tag to establish visual hierarchy.",
    ],
  },
  {
    slug: "infinite-logo-marquee",
    name: "Infinite Logo Ticker Marquee",
    tone: "dark",
    tags: ["marquee", "logos", "social-proof", "ticker", "section"],
    colors: ["#090d16", "#64748b", "#ffffff", "#3b82f6"],
    description: "An infinite looping customer and partner brand logo marquee with edge gradient fade masks and pause-on-hover.",
    html: `<section class="marquee-sec">
  <div class="marquee-intro">
    <span>Trusted by engineering teams worldwide</span>
  </div>
  
  <div class="marquee-container">
    <div class="marquee-track">
      <div class="logo-item">✦ ACME Corp</div>
      <div class="logo-item">▲ Vercel</div>
      <div class="logo-item">◆ Supabase</div>
      <div class="logo-item">⚡ Stripe</div>
      <div class="logo-item">● Raycast</div>
      <div class="logo-item">■ Linear</div>
      <div class="logo-item">◈ Cloudflare</div>
      <div class="logo-item">★ Datadog</div>

      <!-- Duplicate for seamless infinite loop -->
      <div class="logo-item">✦ ACME Corp</div>
      <div class="logo-item">▲ Vercel</div>
      <div class="logo-item">◆ Supabase</div>
      <div class="logo-item">⚡ Stripe</div>
      <div class="logo-item">● Raycast</div>
      <div class="logo-item">■ Linear</div>
      <div class="logo-item">◈ Cloudflare</div>
      <div class="logo-item">★ Datadog</div>
    </div>
  </div>
</section>`,
    css: `.marquee-sec {
  background: #090d16;
  padding: 60px 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  overflow: hidden;
  text-align: center;
}

.marquee-intro {
  margin-bottom: 28px;
}

.marquee-intro span {
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #64748b;
}

.marquee-container {
  position: relative;
  width: 100%;
  overflow: hidden;
  mask-image: linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%);
  -webkit-mask-image: linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%);
}

.marquee-track {
  display: flex;
  width: max-content;
  gap: 60px;
  animation: logoScroll 24s linear infinite;
}

.marquee-container:hover .marquee-track {
  animation-play-state: paused;
}

.logo-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  font-weight: 700;
  color: #64748b;
  letter-spacing: -0.5px;
  white-space: nowrap;
  transition: color 0.2s ease, transform 0.2s ease;
  cursor: pointer;
}

.logo-item:hover {
  color: #ffffff;
  transform: scale(1.06);
}

@keyframes logoScroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

@media (prefers-reduced-motion: reduce) {
  .marquee-track { animation: none; flex-wrap: wrap; justify-content: center; width: 100%; }
}`,
    prompt: `Create an infinite looping partner logo ticker marquee in HTML and CSS.

Requirements:
- Seamless infinite horizontal scroll using CSS keyframes translateX(0) to translateX(-50%).
- Duplicated item list so the transition has zero visible seam or hitch.
- Edge mask gradient using mask-image: linear-gradient() to fade out left and right edges smoothly.
- Pause scroll animation when the user hovers over the container.
- Respect prefers-reduced-motion by wrapping items statically.

Return one HTML file with a <style> block.`,
    steps: [
      "Duplicate the logo list once inside a flex container with width: max-content.",
      "Animate the track from translateX(0) to translateX(-50%) infinitely.",
      "Apply linear-gradient mask-image on container to fade out edges.",
    ],
    tips: [
      "Set animation-play-state: paused on container hover for interactive pause.",
      "Keep speed around 20-30 seconds so company logos remain legible.",
    ],
  },
  {
    slug: "stat-counter-ribbon",
    name: "Stat Milestone Counter Ribbon",
    tone: "dark",
    tags: ["stats", "metrics", "counter", "milestones", "section"],
    colors: ["#0b0f19", "#38bdf8", "#818cf8", "#ffffff"],
    description: "A high-conversion 4-column metric ribbon with bold gradient typography, milestone labels, and sleek border dividers.",
    html: `<section class="stats-sec">
  <div class="stats-container">
    <div class="stat-col">
      <div class="stat-num grad-blue">99.99%</div>
      <div class="stat-label">System Uptime</div>
      <div class="stat-sub">Zero scheduled downtime over 3 years</div>
    </div>

    <div class="stat-col">
      <div class="stat-num grad-purple">120M+</div>
      <div class="stat-label">API Calls Daily</div>
      <div class="stat-sub">Across 180+ global server nodes</div>
    </div>

    <div class="stat-col">
      <div class="stat-num grad-emerald">&lt; 15ms</div>
      <div class="stat-label">Edge Response Time</div>
      <div class="stat-sub">Optimized with localized DNS routing</div>
    </div>

    <div class="stat-col">
      <div class="stat-num grad-amber">4.9 / 5</div>
      <div class="stat-label">Developer Rating</div>
      <div class="stat-sub">From 14,000+ verified enterprise users</div>
    </div>
  </div>
</section>`,
    css: `.stats-sec {
  background: #0b0f19;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding: 50px 24px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  max-width: 1160px;
  margin: 0 auto;
}

@media (max-width: 900px) {
  .stats-container { grid-template-columns: repeat(2, 1fr); gap: 32px 0; }
}

@media (max-width: 540px) {
  .stats-container { grid-template-columns: 1fr; gap: 32px; }
}

.stat-col {
  padding: 0 32px;
  text-align: center;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
}

.stat-col:last-child {
  border-right: none;
}

@media (max-width: 900px) {
  .stat-col:nth-child(2) { border-right: none; }
}

@media (max-width: 540px) {
  .stat-col { border-right: none; padding: 0; }
}

.stat-num {
  font-size: clamp(2.4rem, 4vw, 3.2rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -1.5px;
  margin-bottom: 8px;
}

.grad-blue {
  background: linear-gradient(135deg, #38bdf8, #2563eb);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.grad-purple {
  background: linear-gradient(135deg, #c084fc, #9333ea);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.grad-emerald {
  background: linear-gradient(135deg, #34d399, #059669);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.grad-amber {
  background: linear-gradient(135deg, #fbbf24, #d97706);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.stat-label {
  font-size: 15px;
  font-weight: 700;
  color: #f1f5f9;
  margin-bottom: 6px;
}

.stat-sub {
  font-size: 13px;
  color: #64748b;
  line-height: 1.4;
}`,
    prompt: `Create a 4-column metric milestone statistics ribbon in HTML and CSS.

Requirements:
- Dark navy background (#0b0f19) with top and bottom borders.
- 4 columns separated by subtle vertical borders.
- Bold numbers using CSS background-clip: text gradient styling.
- Responsive layout converting cleanly to 2 columns on tablet and 1 column on mobile.

Return one HTML file with a <style> block.`,
    steps: [
      "Use CSS grid with 4 equal columns and dividing right borders.",
      "Apply gradient text using -webkit-background-clip: text and color: transparent.",
      "Add media queries to drop dividing borders appropriately on responsive breakpoints.",
    ],
    tips: [
      "Use clamp() for typography sizing so numbers fit comfortably on all mobile viewports.",
    ],
  },
  {
    slug: "comparison-matrix-table",
    name: "Feature Comparison Matrix Table",
    tone: "dark",
    tags: ["comparison", "table", "pricing", "features", "section"],
    colors: ["#090d16", "#3b82f6", "#10b981", "#ffffff"],
    description: "A comprehensive SaaS feature comparison matrix table with plan headers, checkmark rows, and highlighted recommended column.",
    html: `<section class="matrix-sec">
  <div class="matrix-header">
    <span class="matrix-badge">Compare Features</span>
    <h2>Pick the plan that scales with you</h2>
    <p>All plans include full API access, edge CDN caching, and 99.9% uptime SLA.</p>
  </div>

  <div class="matrix-wrap">
    <table class="matrix-table">
      <thead>
        <tr>
          <th class="th-feat">Core Features</th>
          <th class="th-plan">
            <div class="plan-name">Starter</div>
            <div class="plan-cost">$0 <small>/mo</small></div>
            <button class="m-btn btn-ghost">Start Free</button>
          </th>
          <th class="th-plan th-rec">
            <span class="rec-pill">Most Popular</span>
            <div class="plan-name">Pro</div>
            <div class="plan-cost">$49 <small>/mo</small></div>
            <button class="m-btn btn-primary">Upgrade to Pro</button>
          </th>
          <th class="th-plan">
            <div class="plan-name">Enterprise</div>
            <div class="plan-cost">Custom</div>
            <button class="m-btn btn-ghost">Contact Sales</button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Monthly Active Users</td>
          <td>1,000</td>
          <td class="td-rec">50,000</td>
          <td>Unlimited</td>
        </tr>
        <tr>
          <td>Edge CDN Regions</td>
          <td>5 regions</td>
          <td class="td-rec">35+ global nodes</td>
          <td>Dedicated cluster</td>
        </tr>
        <tr>
          <td>Custom Domain & SSL</td>
          <td><span class="chk">✓</span></td>
          <td class="td-rec"><span class="chk">✓</span></td>
          <td><span class="chk">✓</span></td>
        </tr>
        <tr>
          <td>Role-Based Access Control</td>
          <td><span class="dash">—</span></td>
          <td class="td-rec"><span class="chk">✓</span></td>
          <td><span class="chk">✓</span></td>
        </tr>
        <tr>
          <td>Audit Logs (SIEM Export)</td>
          <td><span class="dash">—</span></td>
          <td class="td-rec">30 days</td>
          <td>1 year retention</td>
        </tr>
        <tr>
          <td>24/7 Dedicated Slack Channel</td>
          <td><span class="dash">—</span></td>
          <td class="td-rec"><span class="dash">—</span></td>
          <td><span class="chk">✓</span></td>
        </tr>
      </tbody>
    </table>
  </div>
</section>`,
    css: `.matrix-sec {
  background: #090d16;
  color: #ffffff;
  padding: 80px 24px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.matrix-header {
  text-align: center;
  max-width: 650px;
  margin: 0 auto 50px;
}

.matrix-badge {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  color: #38bdf8;
  letter-spacing: 1.5px;
  padding: 4px 14px;
  background: rgba(56, 189, 248, 0.1);
  border: 1px solid rgba(56, 189, 248, 0.3);
  border-radius: 999px;
  margin-bottom: 16px;
}

.matrix-header h2 {
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 800;
  margin: 0 0 16px;
  letter-spacing: -1px;
}

.matrix-header p {
  font-size: 16.5px;
  color: #94a3b8;
  line-height: 1.6;
  margin: 0;
}

.matrix-wrap {
  max-width: 960px;
  margin: 0 auto;
  overflow-x: auto;
}

.matrix-table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
  font-size: 14.5px;
}

.matrix-table th, .matrix-table td {
  padding: 18px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.th-feat {
  text-align: left;
  font-size: 16px;
  font-weight: 700;
  color: #94a3b8;
  width: 38%;
}

.th-plan {
  width: 20%;
  vertical-align: bottom;
  padding-bottom: 24px;
}

.th-rec {
  position: relative;
  background: rgba(37, 99, 235, 0.08);
  border-top: 2px solid #3b82f6;
  border-left: 1px solid rgba(59, 130, 246, 0.3);
  border-right: 1px solid rgba(59, 130, 246, 0.3);
}

.td-rec {
  background: rgba(37, 99, 235, 0.05);
  border-left: 1px solid rgba(59, 130, 246, 0.2);
  border-right: 1px solid rgba(59, 130, 246, 0.2);
  font-weight: 600;
}

.rec-pill {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: #2563eb;
  color: #ffffff;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 3px 12px;
  border-radius: 999px;
  white-space: nowrap;
}

.plan-name {
  font-size: 18px;
  font-weight: 800;
  margin-bottom: 6px;
}

.plan-cost {
  font-size: 26px;
  font-weight: 800;
  margin-bottom: 16px;
}

.plan-cost small {
  font-size: 13px;
  font-weight: normal;
  color: #94a3b8;
}

.m-btn {
  width: 100%;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-ghost {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #ffffff;
}

.btn-ghost:hover { background: rgba(255, 255, 255, 0.12); }

.btn-primary {
  background: #2563eb;
  border: none;
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4);
}

.btn-primary:hover { background: #1d4ed8; }

.matrix-table tbody tr td:first-child {
  text-align: left;
  font-weight: 500;
  color: #cbd5e1;
}

.chk { color: #10b981; font-weight: 800; font-size: 18px; }
.dash { color: #475569; font-weight: 700; font-size: 16px; }`,
    prompt: `Create a SaaS plan feature comparison table section in HTML and CSS.

Requirements:
- Centered header with category pill.
- Responsive table comparing Starter, Pro, and Enterprise tiers.
- Highlighted Pro column with colored background, border accents, and "Most Popular" floating badge.
- Green checkmarks (✓) for included features and soft dashes (—) for omitted features.

Return one HTML file with a <style> block.`,
    steps: [
      "Structure HTML table with thead for tier pricing and tbody for features.",
      "Add .th-rec and .td-rec styles with borders and subtle gradient tint to highlight featured tier.",
      "Wrap table in an overflow-x: auto container for mobile horizontal scroll support.",
    ],
    tips: [
      "Use white-space: nowrap on table header titles to prevent awkward line breaks.",
    ],
  },
  {
    slug: "testimonials-avatar-bubble-wall",
    name: "Social Proof Testimonial Wall",
    tone: "dark",
    tags: ["testimonials", "reviews", "social-proof", "cards", "section"],
    colors: ["#030712", "#ec4899", "#8b5cf6", "#ffffff"],
    description: "A high-conversion customer review wall with verified customer badges, star ratings, and subtle hover elevation.",
    html: `<section class="review-sec">
  <div class="review-header">
    <span class="review-badge">Verified Reviews</span>
    <h2>Loved by developers, trusted by leaders</h2>
    <p>Read honest reviews from engineering managers and founders who build on our stack daily.</p>
  </div>

  <div class="review-grid">
    <div class="review-card">
      <div class="rc-stars">★★★★★</div>
      <p class="rc-text">"We cut our cloud egress bills by 40% in week one. The developer experience and instant deployment feedback loops are unmatched."</p>
      <div class="rc-author">
        <div class="rc-avatar av-pink">SK</div>
        <div>
          <div class="rc-name">Sarah Kim</div>
          <div class="rc-role">VP of Eng · CloudScale</div>
        </div>
      </div>
    </div>

    <div class="review-card rc-glow">
      <div class="rc-stars">★★★★★</div>
      <p class="rc-text">"Hands down the cleanest API and documentation we have integrated. Our team migrated 12 microservices without a single hiccup."</p>
      <div class="rc-author">
        <div class="rc-avatar av-violet">MR</div>
        <div>
          <div class="rc-name">Marcus Reed</div>
          <div class="rc-role">CTO · Hyperion Labs</div>
        </div>
      </div>
    </div>

    <div class="review-card">
      <div class="rc-stars">★★★★★</div>
      <p class="rc-text">"Zero maintenance headaches. Whenever our marketing campaigns go viral on HackerNews, the infrastructure handles 100k req/sec effortlessly."</p>
      <div class="rc-author">
        <div class="rc-avatar av-blue">EL</div>
        <div>
          <div class="rc-name">Elena Rostova</div>
          <div class="rc-role">Founder · SynthAudio</div>
        </div>
      </div>
    </div>
  </div>
</section>`,
    css: `.review-sec {
  background: #030712;
  color: #ffffff;
  padding: 80px 24px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.review-header {
  text-align: center;
  max-width: 650px;
  margin: 0 auto 50px;
}

.review-badge {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  color: #ec4899;
  letter-spacing: 1.5px;
  padding: 4px 14px;
  background: rgba(236, 72, 153, 0.1);
  border: 1px solid rgba(236, 72, 153, 0.3);
  border-radius: 999px;
  margin-bottom: 16px;
}

.review-header h2 {
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 800;
  margin: 0 0 16px;
  letter-spacing: -1px;
}

.review-header p {
  font-size: 16.5px;
  color: #94a3b8;
  line-height: 1.6;
  margin: 0;
}

.review-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  max-width: 1100px;
  margin: 0 auto;
}

@media (max-width: 860px) {
  .review-grid { grid-template-columns: 1fr; }
}

.review-card {
  background: #0b1120;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 32px 28px;
  display: flex;
  flex-direction: column;
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
}

.review-card:hover {
  transform: translateY(-5px);
  border-color: rgba(236, 72, 153, 0.4);
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.5);
}

.rc-glow {
  border-color: rgba(139, 92, 246, 0.3);
  background: linear-gradient(180deg, rgba(139, 92, 246, 0.08), #0b1120 70%);
}

.rc-stars {
  color: #f59e0b;
  font-size: 16px;
  letter-spacing: 2px;
  margin-bottom: 16px;
}

.rc-text {
  font-size: 15px;
  line-height: 1.65;
  color: #cbd5e1;
  font-style: italic;
  margin: 0 0 24px;
  flex: 1;
}

.rc-author {
  display: flex;
  align-items: center;
  gap: 14px;
}

.rc-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 15px;
  color: #ffffff;
}

.av-pink { background: linear-gradient(135deg, #ec4899, #be185d); }
.av-violet { background: linear-gradient(135deg, #8b5cf6, #6d28d9); }
.av-blue { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }

.rc-name {
  font-size: 14.5px;
  font-weight: 700;
  color: #ffffff;
}

.rc-role {
  font-size: 12.5px;
  color: #64748b;
}`,
    prompt: `Create a dark social proof testimonial review section in HTML and CSS.

Requirements:
- 3-column responsive card layout.
- Star ratings in golden amber.
- Real client quote copy with italic styling.
- Author metadata footer with stylized avatar gradient circles.
- Smooth hover elevation with glowing border accents.

Return one HTML file with a <style> block.`,
    steps: [
      "Use CSS grid with repeat(3, 1fr) and media query to fold to single column on mobile.",
      "Add flex column inside each card with flex: 1 on quote text to ensure uniform card heights.",
    ],
    tips: [
      "Highlight the middle testimonial card with a subtle gradient wash to attract visual focus.",
    ],
  },
  {
    slug: "roadmap-timeline-section",
    name: "Interactive Product Roadmap Timeline",
    tone: "dark",
    tags: ["roadmap", "timeline", "milestones", "product", "section"],
    colors: ["#050814", "#3b82f6", "#10b981", "#8b5cf6"],
    description: "A vertical product development roadmap with connected milestone spine, status badges ('Live', 'In Progress', 'Planned'), and deliverable lists.",
    html: `<section class="road-sec">
  <div class="road-header">
    <span class="road-badge">Quarterly Milestones</span>
    <h2>2026 Product Architecture Roadmap</h2>
    <p>Transparent look at our shipped features, current sprint priorities, and upcoming research.</p>
  </div>

  <div class="road-timeline">
    <div class="road-item is-live">
      <div class="road-dot">✓</div>
      <div class="road-card">
        <div class="road-meta">
          <span class="r-badge rb-live">Q1 2026 · Shipped</span>
          <span class="r-date">Jan - Mar</span>
        </div>
        <h3>Edge AI Model Ingestion</h3>
        <p>Launched serverless streaming inference endpoints with WebGPU fallback and sub-30ms cold-start latency.</p>
      </div>
    </div>

    <div class="road-item is-current">
      <div class="road-dot">●</div>
      <div class="road-card">
        <div class="road-meta">
          <span class="r-badge rb-prog">Q2 2026 · In Progress</span>
          <span class="r-date">Apr - Jun</span>
        </div>
        <h3>Distributed Vector Sharding</h3>
        <p>Horizontal partitioning for multi-billion vector collections with automated cosine index rebalancing.</p>
      </div>
    </div>

    <div class="road-item is-future">
      <div class="road-dot">○</div>
      <div class="road-card">
        <div class="road-meta">
          <span class="r-badge rb-plan">Q3 2026 · Planned</span>
          <span class="r-date">Jul - Sep</span>
        </div>
        <h3>Autonomous Multi-Agent Mesh</h3>
        <p>Protocol layer allowing decoupled AI workers to negotiate API contracts and resolve tasks collaboratively.</p>
      </div>
    </div>
  </div>
</section>`,
    css: `.road-sec {
  background: #050814;
  color: #ffffff;
  padding: 80px 24px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.road-header {
  text-align: center;
  max-width: 650px;
  margin: 0 auto 50px;
}

.road-badge {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  color: #60a5fa;
  letter-spacing: 1.5px;
  padding: 4px 14px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 999px;
  margin-bottom: 16px;
}

.road-header h2 {
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 800;
  margin: 0 0 16px;
  letter-spacing: -1px;
}

.road-header p {
  font-size: 16.5px;
  color: #94a3b8;
  line-height: 1.6;
  margin: 0;
}

.road-timeline {
  position: relative;
  max-width: 720px;
  margin: 0 auto;
  padding-left: 36px;
}

.road-timeline::before {
  content: "";
  position: absolute;
  top: 10px;
  bottom: 10px;
  left: 17px;
  width: 2px;
  background: linear-gradient(180deg, #10b981 0%, #3b82f6 50%, rgba(255, 255, 255, 0.1) 100%);
}

.road-item {
  position: relative;
  margin-bottom: 32px;
}

.road-item:last-child {
  margin-bottom: 0;
}

.road-dot {
  position: absolute;
  left: -36px;
  top: 16px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #0f172a;
  border: 2px solid #334155;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 800;
  color: #94a3b8;
  z-index: 2;
}

.road-item.is-live .road-dot {
  background: #10b981;
  border-color: #34d399;
  color: #ffffff;
  box-shadow: 0 0 12px rgba(16, 185, 129, 0.5);
}

.road-item.is-current .road-dot {
  background: #2563eb;
  border-color: #60a5fa;
  color: #ffffff;
  box-shadow: 0 0 12px rgba(37, 99, 235, 0.6);
  animation: roadPulse 2s infinite ease-in-out;
}

@keyframes roadPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}

.road-card {
  background: #0c1322;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 24px 28px;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.road-card:hover {
  transform: translateX(6px);
  border-color: rgba(59, 130, 246, 0.4);
}

.road-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.r-badge {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 3px 10px;
  border-radius: 999px;
}

.rb-live {
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #34d399;
}

.rb-prog {
  background: rgba(37, 99, 235, 0.15);
  border: 1px solid rgba(37, 99, 235, 0.3);
  color: #60a5fa;
}

.rb-plan {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #94a3b8;
}

.r-date {
  font-size: 12px;
  color: #64748b;
  font-family: ui-monospace, monospace;
}

.road-card h3 {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 8px;
}

.road-card p {
  font-size: 14.5px;
  color: #94a3b8;
  line-height: 1.6;
  margin: 0;
}`,
    prompt: `Create a vertical product roadmap timeline section in HTML and CSS.

Requirements:
- Continuous vertical progress line with connected milestone nodes.
- Status states: Shipped (green checkmark), In Progress (blue pulsing dot), and Planned (outlined node).
- Cards beside each node with quarter badge, release dates, and technical deliverable descriptions.
- Hover transition that shifts cards horizontally (translateX(6px)).

Return one HTML file with a <style> block.`,
    steps: [
      "Use ::before pseudo-element with linear-gradient background to create glowing timeline spine.",
      "Position milestone circle nodes absolutely over the spine.",
      "Add milestone cards with status badges and deliverable copy.",
    ],
    tips: [
      "Animate current in-progress milestone node with a subtle scale pulse to indicate active development.",
    ],
  },
  {
    slug: "newsletter-cta-card-section",
    name: "High-Conversion Newsletter CTA Banner",
    tone: "dark",
    tags: ["newsletter", "cta", "email", "banner", "section"],
    colors: ["#020617", "#6366f1", "#a855f7", "#ffffff"],
    description: "A high-conversion email capture section with gradient glow backdrop, responsive inline input button, and live subscriber counter.",
    html: `<section class="cta-sec">
  <div class="cta-card">
    <div class="cta-glow"></div>
    <div class="cta-inner">
      <span class="cta-pill">✦ Weekly Engineering Digest</span>
      <h2>Stay ahead of the generative AI curve</h2>
      <p>Join 14,000+ engineers receiving curated system design breakdowns, benchmark tests, and production code snippets every Thursday.</p>

      <form class="cta-form" id="newsletterForm" onsubmit="event.preventDefault(); document.getElementById('ctaSuccess').style.display='block';">
        <input type="email" class="cta-input" placeholder="Enter your work email..." required />
        <button type="submit" class="cta-btn">Subscribe Free &rarr;</button>
      </form>
      <div class="cta-success" id="ctaSuccess">✓ You're in! Check your inbox for the welcome issue.</div>
      <div class="cta-subtext">No spam ever · Unsubscribe anytime with 1 click · 100% free</div>
    </div>
  </div>
</section>`,
    css: `.cta-sec {
  background: #020617;
  padding: 80px 24px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #ffffff;
}

.cta-card {
  position: relative;
  max-width: 860px;
  margin: 0 auto;
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 24px;
  padding: 56px 40px;
  overflow: hidden;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6);
  text-align: center;
}

.cta-glow {
  position: absolute;
  top: -100px;
  left: 50%;
  transform: translateX(-50%);
  width: 500px;
  height: 300px;
  background: radial-gradient(ellipse at center, rgba(99, 102, 241, 0.35) 0%, transparent 70%);
  pointer-events: none;
}

.cta-inner {
  position: relative;
  z-index: 2;
  max-width: 620px;
  margin: 0 auto;
}

.cta-pill {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  color: #a855f7;
  letter-spacing: 1.5px;
  padding: 4px 14px;
  background: rgba(168, 85, 247, 0.1);
  border: 1px solid rgba(168, 85, 247, 0.3);
  border-radius: 999px;
  margin-bottom: 20px;
}

.cta-inner h2 {
  font-size: clamp(2rem, 4.5vw, 2.8rem);
  font-weight: 800;
  letter-spacing: -1px;
  margin: 0 0 16px;
  line-height: 1.15;
}

.cta-inner p {
  font-size: 16.5px;
  color: #94a3b8;
  line-height: 1.6;
  margin: 0 0 32px;
}

.cta-form {
  display: flex;
  gap: 10px;
  max-width: 480px;
  margin: 0 auto 16px;
}

@media (max-width: 600px) {
  .cta-form { flex-direction: column; }
}

.cta-input {
  flex: 1;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 13px 18px;
  font-size: 14.5px;
  color: #ffffff;
  outline: none;
  transition: border-color 0.2s ease;
}

.cta-input:focus {
  border-color: #6366f1;
}

.cta-input::placeholder { color: #64748b; }

.cta-btn {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  border: none;
  color: #ffffff;
  padding: 13px 24px;
  border-radius: 12px;
  font-size: 14.5px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(99, 102, 241, 0.4);
  transition: opacity 0.2s ease;
  white-space: nowrap;
}

.cta-btn:hover { opacity: 0.92; }

.cta-success {
  display: none;
  color: #34d399;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 12px;
}

.cta-subtext {
  font-size: 12px;
  color: #64748b;
}`,
    prompt: `Create a high-converting newsletter call-to-action card section in HTML and CSS.

Requirements:
- Enclosed card with top radial glow backdrop.
- Headline, benefits description, and inline email subscription form.
- Input with custom placeholder and vibrant gradient submit button.
- Anti-spam reassurance subtext and instant success message display.

Return one HTML file with a <style> block.`,
    steps: [
      "Center card with max-width: 860px and top radial glow filter.",
      "Design flexible inline email input with mobile column stacking fallback.",
      "Show instant success confirmation on form submit.",
    ],
    tips: [
      "Ensure input contrast and font size (at least 16px on mobile) prevents iOS automatic zoom on focus.",
    ],
  },
  {
    slug: "split-hero-badge-mockup-section",
    name: "Split Hero with App Mockup",
    tone: "dark",
    tags: ["hero", "mockup", "saas", "landing", "section"],
    colors: ["#030712", "#3b82f6", "#8b5cf6", "#ffffff"],
    description: "A modern split landing hero with animated announcement pill, high-converting value copy, dual CTAs, and a floating perspective app preview card.",
    html: `<section class="s-hero-sec">
  <div class="s-hero-container">
    <div class="s-hero-text">
      <div class="s-badge">✦ Version 3.0 Released · Sub-millisecond compute</div>
      <h1>Intelligent Edge Storage for <b>AI Native Apps</b></h1>
      <p>Store, query, and synchronize vector embeddings and structured JSON records across 35 edge regions with automated multi-master replication.</p>
      
      <div class="s-hero-ctas">
        <a href="#" class="sh-btn-primary">Start Building Free &rarr;</a>
        <a href="#" class="sh-btn-secondary">Read Documentation</a>
      </div>

      <div class="s-proof">
        <span>Trusted by 10,000+ teams</span>
        <div class="sp-logos">
          <span>ACME</span><span>◈ VECT</span><span>▲ HYPER</span>
        </div>
      </div>
    </div>

    <div class="s-hero-mockup">
      <div class="mockup-frame">
        <div class="mf-bar">
          <div class="mf-dots"><span></span><span></span><span></span></div>
          <div class="mf-title">api-cluster-prod-us-east</div>
        </div>
        <div class="mf-body">
          <div class="mf-metric-row">
            <div class="mf-stat"><small>THROUGHPUT</small><b>48.2k req/s</b></div>
            <div class="mf-stat"><small>LATENCY P99</small><b>1.4 ms</b></div>
          </div>
          <div class="mf-code-preview">
            <span class="m-comment">// Instant edge replication</span><br/>
            <span class="m-kw">await</span> db.vectors.<span class="m-fn">upsert</span>({<br/>
            &nbsp;&nbsp;id: <span class="m-str">"emb_8941"</span>,<br/>
            &nbsp;&nbsp;values: [0.041, -0.198, 0.884],<br/>
            &nbsp;&nbsp;namespace: <span class="m-str">"production"</span><br/>
            });
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`,
    css: `.s-hero-sec {
  background: radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.15) 0%, #030712 60%);
  color: #ffffff;
  padding: 100px 24px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  overflow: hidden;
}

.s-hero-container {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  align-items: center;
  gap: 60px;
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 960px) {
  .s-hero-container { grid-template-columns: 1fr; gap: 40px; }
}

.s-badge {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #818cf8;
  padding: 5px 16px;
  border-radius: 999px;
  background: rgba(99, 102, 241, 0.12);
  border: 1px solid rgba(99, 102, 241, 0.35);
  margin-bottom: 24px;
}

.s-hero-text h1 {
  font-size: clamp(2.5rem, 5vw, 3.8rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -1.5px;
  margin: 0 0 20px;
}

.s-hero-text h1 b {
  background: linear-gradient(90deg, #60a5fa, #c084fc);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.s-hero-text p {
  font-size: 18px;
  color: #94a3b8;
  line-height: 1.6;
  margin: 0 0 32px;
}

.s-hero-ctas {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 36px;
}

.sh-btn-primary {
  background: #2563eb;
  color: #ffffff;
  padding: 13px 28px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 15px;
  text-decoration: none;
  box-shadow: 0 10px 25px rgba(37, 99, 235, 0.4);
  transition: background 0.2s ease;
}

.sh-btn-primary:hover { background: #1d4ed8; }

.sh-btn-secondary {
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
  padding: 13px 26px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 15px;
  text-decoration: none;
}

.s-proof {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 12px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.sp-logos {
  display: flex;
  gap: 16px;
  font-weight: 800;
  color: #94a3b8;
}

.mockup-frame {
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6);
  transform: perspective(1000px) rotateY(-8deg) rotateX(4deg);
  transition: transform 0.3s ease;
}

.mockup-frame:hover {
  transform: perspective(1000px) rotateY(0deg) rotateX(0deg);
}

.mf-bar {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #141e33;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  gap: 12px;
}

.mf-dots { display: flex; gap: 6px; }
.mf-dots span { width: 9px; height: 9px; border-radius: 50%; background: #475569; }
.mf-title { font-size: 11px; font-family: ui-monospace, monospace; color: #64748b; }

.mf-body { padding: 24px; }

.mf-metric-row {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.mf-stat {
  flex: 1;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 12px;
}

.mf-stat small { display: block; font-size: 10px; color: #64748b; font-weight: 700; margin-bottom: 4px; }
.mf-stat b { font-size: 17px; color: #34d399; }

.mf-code-preview {
  background: #020617;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 16px;
  font-family: ui-monospace, monospace;
  font-size: 12px;
  line-height: 1.6;
  color: #cbd5e1;
}

.m-comment { color: #64748b; }
.m-kw { color: #f43f5e; }
.m-fn { color: #38bdf8; }
.m-str { color: #34d399; }`,
    prompt: `Create a modern SaaS split hero landing page section with an interactive perspective app mockup in HTML and CSS.

Requirements:
- Split two-column grid layout (left: announcement pill, headline, dual CTAs; right: 3D perspective mockup).
- 3D perspective mockup card with perspective(1000px) rotateY(-8deg) that straightens on hover.
- Mockup includes terminal header dots, live telemetry metrics, and syntax highlighted SDK code.

Return one HTML file with a <style> block.`,
    steps: [
      "Use CSS grid with 1.15fr and 0.85fr column split.",
      "Apply 3D transform on the right mockup card with smooth hover transition.",
      "Add responsive breakpoint to stack vertically on mobile screens.",
    ],
    tips: [
      "Use background radial gradients in the section corner to softly backlight the mockup.",
    ],
  },
  {
    slug: "pricing-toggle-annual-section",
    name: "Pricing Cards with Annual Toggle",
    tone: "dark",
    tags: ["pricing", "toggle", "annual", "cards", "section"],
    colors: ["#090d16", "#2563eb", "#10b981", "#ffffff"],
    description: "A 3-tier SaaS pricing section with an interactive monthly/annual discount switch (Save 20%) and highlighted featured card.",
    html: `<section class="pt-sec">
  <div class="pt-header">
    <span class="pt-badge">Transparent Pricing</span>
    <h2>Simple plans for teams of every size</h2>
    <p>Deploy for free today. Upgrade when your throughput demands dedicated clusters.</p>

    <div class="pt-toggle-row">
      <span class="pt-lbl is-active" id="ptMonthlyLbl">Monthly</span>
      <div class="pt-switch" id="ptSwitch">
        <div class="pt-thumb"></div>
      </div>
      <span class="pt-lbl" id="ptAnnualLbl">Annual</span>
      <span class="pt-discount">SAVE 20%</span>
    </div>
  </div>

  <div class="pt-cards">
    <div class="pt-card">
      <div class="pt-tier">Developer</div>
      <div class="pt-price"><span class="price-val" data-m="0" data-a="0">$0</span><small>/mo</small></div>
      <p class="pt-desc">Everything needed for personal side projects and hobby apps.</p>
      <button class="pt-btn btn-outline">Deploy Free</button>
    </div>

    <div class="pt-card pt-featured">
      <div class="pt-pop">Most Popular</div>
      <div class="pt-tier">Pro Team</div>
      <div class="pt-price"><span class="price-val" data-m="49" data-a="39">$49</span><small>/mo</small></div>
      <p class="pt-desc">High performance edge storage with automated failover clusters.</p>
      <button class="pt-btn btn-blue">Upgrade to Pro</button>
    </div>

    <div class="pt-card">
      <div class="pt-tier">Scale</div>
      <div class="pt-price"><span class="price-val" data-m="199" data-a="159">$199</span><small>/mo</small></div>
      <p class="pt-desc">Dedicated single-tenant infrastructure with custom SLA guarantees.</p>
      <button class="pt-btn btn-outline">Scale Now</button>
    </div>
  </div>
</section>`,
    css: `.pt-sec {
  background: #090d16;
  color: #ffffff;
  padding: 80px 24px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.pt-header {
  text-align: center;
  max-width: 650px;
  margin: 0 auto 50px;
}

.pt-badge {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  color: #60a5fa;
  letter-spacing: 1.5px;
  padding: 4px 14px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 999px;
  margin-bottom: 16px;
}

.pt-header h2 {
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 800;
  margin: 0 0 16px;
  letter-spacing: -1px;
}

.pt-header p {
  font-size: 16.5px;
  color: #94a3b8;
  line-height: 1.6;
  margin: 0 0 32px;
}

.pt-toggle-row {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}

.pt-lbl {
  font-size: 14.5px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: color 0.2s ease;
}

.pt-lbl.is-active { color: #ffffff; }

.pt-switch {
  width: 52px;
  height: 28px;
  border-radius: 999px;
  background: #1e293b;
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 3px;
  cursor: pointer;
}

.pt-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #2563eb;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.pt-switch.is-annual .pt-thumb {
  transform: translateX(24px);
  background: #10b981;
}

.pt-discount {
  font-size: 11px;
  font-weight: 800;
  color: #34d399;
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.3);
  padding: 3px 8px;
  border-radius: 999px;
}

.pt-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  max-width: 1050px;
  margin: 0 auto;
}

@media (max-width: 860px) {
  .pt-cards { grid-template-columns: 1fr; }
}

.pt-card {
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 36px 30px;
  display: flex;
  flex-direction: column;
}

.pt-featured {
  position: relative;
  border-color: #2563eb;
  background: linear-gradient(180deg, rgba(37, 99, 235, 0.08), #0f172a 60%);
  box-shadow: 0 20px 50px rgba(37, 99, 235, 0.15);
}

.pt-pop {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: #2563eb;
  color: #ffffff;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 3px 12px;
  border-radius: 999px;
}

.pt-tier {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
}

.pt-price {
  font-size: 42px;
  font-weight: 800;
  margin-bottom: 14px;
}

.pt-price small { font-size: 15px; font-weight: normal; color: #94a3b8; }

.pt-desc {
  font-size: 14px;
  color: #94a3b8;
  line-height: 1.5;
  margin: 0 0 28px;
  flex: 1;
}

.pt-btn {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-blue {
  background: #2563eb;
  border: none;
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4);
}

.btn-blue:hover { background: #1d4ed8; }

.btn-outline {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #ffffff;
}

.btn-outline:hover { background: rgba(255, 255, 255, 0.06); }`,
    js: `var ptSwitch = document.getElementById("ptSwitch");
var monthlyLbl = document.getElementById("ptMonthlyLbl");
var annualLbl = document.getElementById("ptAnnualLbl");
var prices = document.querySelectorAll(".price-val");
var isAnnual = false;

function togglePricing() {
  isAnnual = !isAnnual;
  ptSwitch.classList.toggle("is-annual", isAnnual);
  monthlyLbl.classList.toggle("is-active", !isAnnual);
  annualLbl.classList.toggle("is-active", isAnnual);

  prices.forEach(function(p) {
    var val = isAnnual ? p.getAttribute("data-a") : p.getAttribute("data-m");
    p.textContent = "$" + val;
  });
}

ptSwitch.addEventListener("click", togglePricing);
monthlyLbl.addEventListener("click", function() { if (isAnnual) togglePricing(); });
annualLbl.addEventListener("click", function() { if (!isAnnual) togglePricing(); });`,
    prompt: `Create a responsive 3-tier SaaS pricing section with an interactive monthly/annual discount toggle switch in HTML, CSS and vanilla JavaScript.

Requirements:
- 3 pricing tiers (Developer $0, Pro Team $49, Scale $199).
- Monthly / Annual toggle switch with "SAVE 20%" discount badge.
- When toggled to annual, prices update dynamically to discounted values ($39/mo, $159/mo).
- Featured tier with blue gradient accent and "Most Popular" floating pill.

Return one HTML file with <style> and <script> tags.`,
    steps: [
      "Store monthly and annual rate in data-m and data-a attributes on price values.",
      "Add click event on toggle switch to update price textContent dynamically.",
      "Add .is-annual class to translate switch thumb and update active label colors.",
    ],
    tips: [
      "Keep price updates synchronous to prevent layout shifts during interaction.",
    ],
  },
  {
    slug: "developer-changelog-feed-section",
    name: "Developer Product Changelog Feed",
    tone: "dark",
    tags: ["changelog", "updates", "release-notes", "feed", "section"],
    colors: ["#090d16", "#38bdf8", "#10b981", "#ffffff"],
    description: "A GitHub/Linear inspired developer product changelog feed with version pills, release dates, and structured update cards.",
    html: `<section class="cl-sec">
  <div class="cl-header">
    <span class="cl-badge">Changelog & Releases</span>
    <h2>Latest Product Improvements</h2>
    <p>Everything shipped across our core CLI, API platform, and console dashboards.</p>
  </div>

  <div class="cl-feed">
    <article class="cl-entry">
      <div class="cl-sidebar">
        <span class="cl-ver-pill">v2.4.0</span>
        <time class="cl-time">Oct 20, 2026</time>
      </div>
      <div class="cl-content">
        <h3>WebAssembly Vector Indexing & SIMD Acceleration</h3>
        <p>This release introduces client-side SIMD instructions inside our WebAssembly parser, cutting local nearest-neighbor search times by 3.2x.</p>
        <ul class="cl-bullets">
          <li>Added automatic hardware AVX-512 detection.</li>
          <li>Reduced memory footprint by 40% for quantized 8-bit embeddings.</li>
          <li>Fixed edge-case connection dropouts during TLS renegotiation.</li>
        </ul>
      </div>
    </article>

    <article class="cl-entry">
      <div class="cl-sidebar">
        <span class="cl-ver-pill">v2.3.2</span>
        <time class="cl-time">Oct 04, 2026</time>
      </div>
      <div class="cl-content">
        <h3>Zero-Config Next.js 16 Edge Middleware Support</h3>
        <p>Full support for Next.js 16 Turbopack streaming sessions and automated cookie signature verification.</p>
      </div>
    </article>
  </div>
</section>`,
    css: `.cl-sec {
  background: #090d16;
  color: #ffffff;
  padding: 80px 24px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.cl-header {
  text-align: center;
  max-width: 650px;
  margin: 0 auto 50px;
}

.cl-badge {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  color: #38bdf8;
  letter-spacing: 1.5px;
  padding: 4px 14px;
  background: rgba(56, 189, 248, 0.1);
  border: 1px solid rgba(56, 189, 248, 0.3);
  border-radius: 999px;
  margin-bottom: 16px;
}

.cl-header h2 {
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 800;
  margin: 0 0 16px;
  letter-spacing: -1px;
}

.cl-header p {
  font-size: 16.5px;
  color: #94a3b8;
  line-height: 1.6;
  margin: 0;
}

.cl-feed {
  max-width: 780px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 36px;
}

.cl-entry {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 32px;
  padding-bottom: 36px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

@media (max-width: 650px) {
  .cl-entry { grid-template-columns: 1fr; gap: 14px; }
}

.cl-sidebar {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cl-ver-pill {
  align-self: flex-start;
  font-size: 12px;
  font-weight: 800;
  font-family: ui-monospace, monospace;
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.1);
  border: 1px solid rgba(56, 189, 248, 0.25);
  padding: 3px 10px;
  border-radius: 6px;
}

.cl-time {
  font-size: 12.5px;
  color: #64748b;
}

.cl-content h3 {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 10px;
  color: #ffffff;
}

.cl-content p {
  font-size: 15px;
  color: #94a3b8;
  line-height: 1.65;
  margin: 0 0 16px;
}

.cl-bullets {
  margin: 0;
  padding-left: 20px;
  font-size: 14px;
  color: #cbd5e1;
  line-height: 1.8;
}`,
    prompt: `Create a clean developer product changelog feed in HTML and CSS.

Requirements:
- 2-column layout with release tag (e.g. v2.4.0) and date on the left, release notes on the right.
- Markdown-style bullet points with custom indentation.
- Dark theme (#090d16) with subtle divider borders between releases.

Return one HTML file with a <style> block.`,
    steps: [
      "Use CSS grid with 140px sidebar for release version metadata.",
      "Add semantic <time> elements for ISO dates.",
      "Collapse to single column on mobile screens.",
    ],
    tips: [
      "Use monospace font on version tags for consistent technical aesthetic.",
    ],
  },
  {
    slug: "curated-team-leadership-grid",
    name: "Team & Leadership Showcase Grid",
    tone: "dark",
    tags: ["team", "leadership", "grid", "about", "section"],
    colors: ["#090d16", "#3b82f6", "#8b5cf6", "#ffffff"],
    description: "An engineering and executive team showcase grid with monochrome-to-color hover transitions and social profile links.",
    html: `<section class="team-sec">
  <div class="team-header">
    <span class="team-badge">Core Builders</span>
    <h2>Built by engineers, for engineers</h2>
    <p>Our team previously scaled distributed systems at leading research labs and cloud providers.</p>
  </div>

  <div class="team-grid">
    <div class="team-card">
      <div class="team-photo tp-1">
        <span class="tp-emoji">👨‍💻</span>
      </div>
      <div class="team-name">Ravindra Nath Jha</div>
      <div class="team-role">Founder & AI Architect</div>
      <div class="team-socials">
        <span>GitHub</span> · <span>X</span> · <span>LinkedIn</span>
      </div>
    </div>

    <div class="team-card">
      <div class="team-photo tp-2">
        <span class="tp-emoji">👩‍💻</span>
      </div>
      <div class="team-name">Elena Rostova</div>
      <div class="team-role">Head of Infrastructure</div>
      <div class="team-socials">
        <span>GitHub</span> · <span>X</span>
      </div>
    </div>

    <div class="team-card">
      <div class="team-photo tp-3">
        <span class="tp-emoji">⚡</span>
      </div>
      <div class="team-name">Devon Vance</div>
      <div class="team-role">Lead Systems Engineer</div>
      <div class="team-socials">
        <span>GitHub</span> · <span>LinkedIn</span>
      </div>
    </div>
  </div>
</section>`,
    css: `.team-sec {
  background: #090d16;
  color: #ffffff;
  padding: 80px 24px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.team-header {
  text-align: center;
  max-width: 650px;
  margin: 0 auto 50px;
}

.team-badge {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  color: #818cf8;
  letter-spacing: 1.5px;
  padding: 4px 14px;
  background: rgba(129, 140, 248, 0.1);
  border: 1px solid rgba(129, 140, 248, 0.3);
  border-radius: 999px;
  margin-bottom: 16px;
}

.team-header h2 {
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 800;
  margin: 0 0 16px;
  letter-spacing: -1px;
}

.team-header p {
  font-size: 16.5px;
  color: #94a3b8;
  line-height: 1.6;
  margin: 0;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  max-width: 1050px;
  margin: 0 auto;
}

@media (max-width: 780px) {
  .team-grid { grid-template-columns: 1fr; }
}

.team-card {
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 28px;
  text-align: center;
  transition: transform 0.25s ease, border-color 0.25s ease;
}

.team-card:hover {
  transform: translateY(-5px);
  border-color: rgba(99, 102, 241, 0.4);
}

.team-photo {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
}

.tp-1 { background: linear-gradient(135deg, #1e3a8a, #3b82f6); }
.tp-2 { background: linear-gradient(135deg, #4c1d95, #8b5cf6); }
.tp-3 { background: linear-gradient(135deg, #064e3b, #10b981); }

.tp-emoji { font-size: 42px; }

.team-name {
  font-size: 18px;
  font-weight: 800;
  margin-bottom: 4px;
}

.team-role {
  font-size: 13.5px;
  color: #94a3b8;
  margin-bottom: 16px;
}

.team-socials {
  font-size: 12px;
  color: #64748b;
  font-weight: 600;
}

.team-socials span {
  cursor: pointer;
  transition: color 0.2s ease;
}

.team-socials span:hover { color: #ffffff; }`,
    prompt: `Create a responsive 3-column team leadership section in HTML and CSS.

Requirements:
- Centered header with category pill.
- 3 cards with avatar photo, name, engineering title, and social links.
- Soft translateY lift on card hover.

Return one HTML file with a <style> block.`,
    steps: [
      "Set up 3-column grid that folds to single column on tablet/mobile.",
      "Add circular gradient avatars with shadow.",
    ],
    tips: [
      "Keep social links understated with muted gray that highlights on hover.",
    ],
  },
  {
    slug: "interactive-tabbed-code-preview-section",
    name: "Interactive Tabbed Code Showcase",
    tone: "dark",
    tags: ["code", "tabs", "developer", "api", "section"],
    colors: ["#030712", "#3b82f6", "#10b981", "#ffffff"],
    description: "A developer API section with interactive language tabs (cURL, TypeScript, Python), syntax highlights, and live JSON response preview.",
    html: `<section class="tab-code-sec">
  <div class="tc-header">
    <span class="tc-badge">Developer First API</span>
    <h2>Integrate in three lines of code</h2>
    <p>Official client libraries available for Node.js, Python, Go, and Rust with full type inference.</p>
  </div>

  <div class="tc-editor-card">
    <div class="tc-top-bar">
      <div class="tc-tabs" id="codeTabGroup">
        <button class="tc-tab is-active" data-lang="ts">TypeScript</button>
        <button class="tc-tab" data-lang="py">Python</button>
        <button class="tc-tab" data-lang="curl">cURL</button>
      </div>
      <button class="tc-copy-btn" id="tcCopyBtn">Copy Code</button>
    </div>

    <div class="tc-code-body">
      <pre class="tc-pre" id="tcPre"><code><span class="c-kw">import</span> { EdgeDB } <span class="c-kw">from</span> <span class="c-str">"@orbit/sdk"</span>;

<span class="c-kw">const</span> client = <span class="c-kw">new</span> <span class="c-fn">EdgeDB</span>({ apiKey: process.env.API_KEY });
<span class="c-kw">const</span> response = <span class="c-kw">await</span> client.embeddings.<span class="c-fn">create</span>({
  input: <span class="c-str">"High throughput vector search"</span>,
  model: <span class="c-str">"text-embedding-3-small"</span>
});</code></pre>
    </div>
  </div>
</section>`,
    css: `.tab-code-sec {
  background: #030712;
  color: #ffffff;
  padding: 80px 24px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.tc-header {
  text-align: center;
  max-width: 650px;
  margin: 0 auto 50px;
}

.tc-badge {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  color: #38bdf8;
  letter-spacing: 1.5px;
  padding: 4px 14px;
  background: rgba(56, 189, 248, 0.1);
  border: 1px solid rgba(56, 189, 248, 0.3);
  border-radius: 999px;
  margin-bottom: 16px;
}

.tc-header h2 {
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 800;
  margin: 0 0 16px;
  letter-spacing: -1px;
}

.tc-header p {
  font-size: 16.5px;
  color: #94a3b8;
  line-height: 1.6;
  margin: 0;
}

.tc-editor-card {
  max-width: 760px;
  margin: 0 auto;
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6);
}

.tc-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: #141e33;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.tc-tabs {
  display: flex;
  gap: 6px;
}

.tc-tab {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 13px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tc-tab:hover { color: #ffffff; }

.tc-tab.is-active {
  background: rgba(255, 255, 255, 0.08);
  color: #38bdf8;
}

.tc-copy-btn {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #cbd5e1;
  font-size: 12px;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tc-copy-btn:hover { background: rgba(255, 255, 255, 0.15); color: #ffffff; }

.tc-code-body {
  padding: 24px;
  font-family: ui-monospace, "SF Mono", monospace;
  font-size: 14px;
  line-height: 1.7;
  overflow-x: auto;
}

.tc-pre { margin: 0; }
.c-kw { color: #f43f5e; font-weight: 600; }
.c-fn { color: #38bdf8; }
.c-str { color: #34d399; }`,
    js: `var tabs = document.querySelectorAll(".tc-tab");
var pre = document.getElementById("tcPre");

var snippets = {
  ts: '<span class="c-kw">import</span> { EdgeDB } <span class="c-kw">from</span> <span class="c-str">"@orbit/sdk"</span>;\\n\\n<span class="c-kw">const</span> client = <span class="c-kw">new</span> <span class="c-fn">EdgeDB</span>({ apiKey: process.env.API_KEY });\\n<span class="c-kw">const</span> response = <span class="c-kw">await</span> client.embeddings.<span class="c-fn">create</span>({\\n  input: <span class="c-str">"High throughput vector search"</span>,\\n  model: <span class="c-str">"text-embedding-3-small"</span>\\n});',
  py: '<span class="c-kw">from</span> orbit_sdk <span class="c-kw">import</span> EdgeDB\\n\\nclient = EdgeDB(api_key=os.environ[<span class="c-str">"API_KEY"</span>])\\nresponse = client.embeddings.create(\\n    input=<span class="c-str">"High throughput vector search"</span>,\\n    model=<span class="c-str">"text-embedding-3-small"</span>\\n)',
  curl: 'curl https://api.orbit.dev/v1/embeddings \\\\\\n  -H <span class="c-str">"Authorization: Bearer $API_KEY"</span> \\\\\\n  -H <span class="c-str">"Content-Type: application/json"</span> \\\\\\n  -d <span class="c-str">\'{"input": "High throughput vector search"}\'</span>'
};

tabs.forEach(function(tab) {
  tab.addEventListener("click", function() {
    tabs.forEach(function(t) { t.classList.remove("is-active"); });
    tab.classList.add("is-active");
    var lang = tab.getAttribute("data-lang");
    pre.innerHTML = '<code>' + snippets[lang] + '</code>';
  });
});`,
    prompt: `Create an interactive tabbed code preview section in HTML, CSS and vanilla JavaScript.

Requirements:
- Centered header with API description.
- Top bar with clickable language tabs (TypeScript, Python, cURL).
- Instant syntax code swap on tab selection without page reload.
- One-click copy code button.

Return one HTML file with <style> and <script> tags.`,
    steps: [
      "Store code snippets for each language in a JavaScript lookup map.",
      "Update innerHTML on tab button click.",
      "Toggle .is-active tab styling.",
    ],
    tips: [
      "Preserve escaped newlines and syntax spans in code templates.",
    ],
  },
  {
    slug: "customer-logos-bento-grid-section",
    name: "Enterprise Customer Bento Wall",
    tone: "dark",
    tags: ["bento", "customers", "logos", "social-proof", "section"],
    colors: ["#030712", "#6366f1", "#10b981", "#ffffff"],
    description: "An asymmetric social proof bento grid featuring enterprise metrics (+140% speedup), customer quotes, and client logos.",
    html: `<section class="cust-bento-sec">
  <div class="cb-header">
    <span class="cb-badge">Enterprise Impact</span>
    <h2>Empowering industry-defining systems</h2>
    <p>Discover how teams accelerate delivery velocity and reduce cloud infrastructure spend.</p>
  </div>

  <div class="cb-grid">
    <div class="cb-card cb-featured">
      <div class="cb-metric">+140%</div>
      <div class="cb-metric-label">Query throughput speedup</div>
      <p class="cb-quote">"Orbit allowed our engineering org to decommission 16 redundant Redis instances and cut latency down to 2ms."</p>
      <div class="cb-author">Engineering Lead · CloudScale Systems</div>
    </div>

    <div class="cb-card">
      <div class="cb-stat-num">99.999%</div>
      <div class="cb-stat-title">Cluster Availability</div>
      <p>Zero unplanned outages across 3 years of production workloads.</p>
    </div>

    <div class="cb-card">
      <div class="cb-stat-num">35+</div>
      <div class="cb-stat-title">Global Edge Nodes</div>
      <p>Automatic low-latency routing to the nearest regional data center.</p>
    </div>
  </div>
</section>`,
    css: `.cust-bento-sec {
  background: #030712;
  color: #ffffff;
  padding: 80px 24px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.cb-header {
  text-align: center;
  max-width: 650px;
  margin: 0 auto 50px;
}

.cb-badge {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  color: #818cf8;
  letter-spacing: 1.5px;
  padding: 4px 14px;
  background: rgba(129, 140, 248, 0.1);
  border: 1px solid rgba(129, 140, 248, 0.3);
  border-radius: 999px;
  margin-bottom: 16px;
}

.cb-header h2 {
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 800;
  margin: 0 0 16px;
  letter-spacing: -1px;
}

.cb-header p {
  font-size: 16.5px;
  color: #94a3b8;
  line-height: 1.6;
  margin: 0;
}

.cb-grid {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

@media (max-width: 800px) {
  .cb-grid { grid-template-columns: 1fr; }
}

.cb-card {
  background: #0b1120;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 32px 28px;
  display: flex;
  flex-direction: column;
}

.cb-featured {
  grid-row: span 2;
  border-color: rgba(99, 102, 241, 0.3);
  background: linear-gradient(180deg, rgba(99, 102, 241, 0.08), #0b1120 60%);
}

.cb-metric {
  font-size: 54px;
  font-weight: 900;
  color: #34d399;
  line-height: 1;
  margin-bottom: 8px;
}

.cb-metric-label {
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 24px;
}

.cb-quote {
  font-size: 16px;
  font-style: italic;
  color: #cbd5e1;
  line-height: 1.6;
  margin: 0 0 24px;
  flex: 1;
}

.cb-author {
  font-size: 13px;
  color: #64748b;
  font-weight: 600;
}

.cb-stat-num {
  font-size: 32px;
  font-weight: 800;
  color: #60a5fa;
  margin-bottom: 6px;
}

.cb-stat-title {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 8px;
}

.cb-card p {
  font-size: 14px;
  color: #94a3b8;
  line-height: 1.5;
  margin: 0;
}`,
    prompt: `Create an asymmetric customer social proof bento grid section in HTML and CSS.

Requirements:
- Asymmetric grid where featured card spans 2 rows (grid-row: span 2).
- Large highlighted percentage stat (+140%) and italicized quote.
- Smaller companion cards with technical SLA metrics.
- Dark theme with indigo and green accents.

Return one HTML file with a <style> block.`,
    steps: [
      "Use CSS grid with grid-template-columns: 1.3fr 1fr.",
      "Apply grid-row: span 2 to featured testimonial card.",
      "Add responsive media query to fold to single column on mobile.",
    ],
    tips: [
      "Keep metric numbers bold and clear with line-height: 1.",
    ],
  },
  {
    slug: "gradient-cta-contact-section",
    name: "Gradient Contact & Booking Banner",
    tone: "dark",
    tags: ["contact", "cta", "booking", "gradient", "section"],
    colors: ["#030712", "#ec4899", "#8b5cf6", "#ffffff"],
    description: "A high-conversion consultation and contact banner with response time guarantees, quick-booking trigger, and email input.",
    html: `<section class="gc-sec">
  <div class="gc-card">
    <div class="gc-glow"></div>
    <div class="gc-content">
      <div class="gc-badge">⚡ Rapid Technical Advisory</div>
      <h2>Ready to optimize your architecture?</h2>
      <p>Schedule a 30-minute 1-on-1 architecture review with our principal engineers. No commitments.</p>

      <div class="gc-actions">
        <button class="gc-btn-primary">Book Technical Consultation &rarr;</button>
        <span class="gc-guarantee">● Average response time under 15 minutes</span>
      </div>
    </div>
  </div>
</section>`,
    css: `.gc-sec {
  background: #030712;
  padding: 80px 24px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #ffffff;
}

.gc-card {
  position: relative;
  max-width: 900px;
  margin: 0 auto;
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 24px;
  padding: 60px 48px;
  overflow: hidden;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6);
  text-align: center;
}

.gc-glow {
  position: absolute;
  top: -80px;
  left: 50%;
  transform: translateX(-50%);
  width: 550px;
  height: 250px;
  background: radial-gradient(ellipse at center, rgba(236, 72, 153, 0.3) 0%, rgba(139, 92, 246, 0.2) 50%, transparent 70%);
  pointer-events: none;
}

.gc-content {
  position: relative;
  z-index: 2;
  max-width: 650px;
  margin: 0 auto;
}

.gc-badge {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  color: #f472b6;
  letter-spacing: 1.5px;
  padding: 4px 14px;
  background: rgba(236, 72, 153, 0.12);
  border: 1px solid rgba(236, 72, 153, 0.3);
  border-radius: 999px;
  margin-bottom: 20px;
}

.gc-content h2 {
  font-size: clamp(2.2rem, 5vw, 3rem);
  font-weight: 800;
  letter-spacing: -1.5px;
  margin: 0 0 16px;
  line-height: 1.15;
}

.gc-content p {
  font-size: 17px;
  color: #94a3b8;
  line-height: 1.6;
  margin: 0 0 32px;
}

.gc-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.gc-btn-primary {
  background: linear-gradient(135deg, #ec4899, #8b5cf6);
  color: #ffffff;
  border: none;
  padding: 15px 32px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(236, 72, 153, 0.4);
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.gc-btn-primary:hover {
  opacity: 0.94;
  transform: translateY(-2px);
}

.gc-guarantee {
  font-size: 12.5px;
  color: #34d399;
  font-weight: 600;
}`,
    prompt: `Create a high-converting gradient contact and consultation booking banner section in HTML and CSS.

Requirements:
- Card with top radiant fuchsia/violet mesh glow backdrop.
- Headline, value proposition, and prominent primary booking CTA.
- SLA response time guarantee tag ("Average response under 15 mins").
- Responsive padding.

Return one HTML file with a <style> block.`,
    steps: [
      "Center card with max-width: 900px and border radius 24px.",
      "Add radial gradient glow backdrop centered behind headline.",
      "Style primary CTA button with fuchsia/violet gradient and hover lift.",
    ],
    tips: [
      "Keep response time guarantees green (#34d399) to communicate speed and reliability.",
    ],
  },
  {
    slug: "key-metrics-grid-with-graphs",
    name: "Analytics Metrics Grid with Sparklines",
    tone: "dark",
    tags: ["metrics", "analytics", "dashboard", "sparklines", "section"],
    colors: ["#090d16", "#3b82f6", "#10b981", "#ffffff"],
    description: "A 3-card analytics dashboard section with metric figures, monthly percentage gains, and CSS sparkline bars.",
    html: `<section class="metrics-grid-sec">
  <div class="mg-header">
    <span class="mg-badge">Telemetry & Health</span>
    <h2>Real-Time Network Performance</h2>
  </div>

  <div class="mg-cards">
    <div class="mg-card">
      <div class="mg-top">
        <span class="mg-title">Total Edge Queries</span>
        <span class="mg-gain">+24.8%</span>
      </div>
      <div class="mg-val">1.48B</div>
      <div class="mg-spark">
        <div class="sp-bar" style="height: 35%;"></div>
        <div class="sp-bar" style="height: 50%;"></div>
        <div class="sp-bar" style="height: 40%;"></div>
        <div class="sp-bar" style="height: 65%;"></div>
        <div class="sp-bar" style="height: 80%;"></div>
        <div class="sp-bar sp-hi" style="height: 100%;"></div>
      </div>
    </div>

    <div class="mg-card">
      <div class="mg-top">
        <span class="mg-title">Avg Vector Latency</span>
        <span class="mg-gain mg-green">-18.4%</span>
      </div>
      <div class="mg-val">1.2ms</div>
      <div class="mg-spark">
        <div class="sp-bar" style="height: 85%;"></div>
        <div class="sp-bar" style="height: 70%;"></div>
        <div class="sp-bar" style="height: 55%;"></div>
        <div class="sp-bar" style="height: 40%;"></div>
        <div class="sp-bar" style="height: 30%;"></div>
        <div class="sp-bar sp-green" style="height: 20%;"></div>
      </div>
    </div>

    <div class="mg-card">
      <div class="mg-top">
        <span class="mg-title">Global Cache Hit Rate</span>
        <span class="mg-gain">+4.2%</span>
      </div>
      <div class="mg-val">99.4%</div>
      <div class="mg-spark">
        <div class="sp-bar" style="height: 90%;"></div>
        <div class="sp-bar" style="height: 92%;"></div>
        <div class="sp-bar" style="height: 94%;"></div>
        <div class="sp-bar" style="height: 96%;"></div>
        <div class="sp-bar" style="height: 98%;"></div>
        <div class="sp-bar sp-hi" style="height: 100%;"></div>
      </div>
    </div>
  </div>
</section>`,
    css: `.metrics-grid-sec {
  background: #090d16;
  color: #ffffff;
  padding: 80px 24px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.mg-header {
  text-align: center;
  max-width: 600px;
  margin: 0 auto 40px;
}

.mg-badge {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  color: #38bdf8;
  letter-spacing: 1.5px;
  padding: 4px 14px;
  background: rgba(56, 189, 248, 0.1);
  border: 1px solid rgba(56, 189, 248, 0.3);
  border-radius: 999px;
  margin-bottom: 16px;
}

.mg-header h2 {
  font-size: clamp(2rem, 4vw, 2.5rem);
  font-weight: 800;
  margin: 0;
  letter-spacing: -1px;
}

.mg-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  max-width: 1050px;
  margin: 0 auto;
}

@media (max-width: 780px) {
  .mg-cards { grid-template-columns: 1fr; }
}

.mg-card {
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 24px;
  display: flex;
  flex-direction: column;
}

.mg-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.mg-title {
  font-size: 13.5px;
  color: #94a3b8;
  font-weight: 600;
}

.mg-gain {
  font-size: 12px;
  font-weight: 700;
  color: #34d399;
  background: rgba(16, 185, 129, 0.1);
  padding: 2px 8px;
  border-radius: 6px;
}

.mg-val {
  font-size: 38px;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 20px;
  line-height: 1;
}

.mg-spark {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  height: 48px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 8px 12px;
}

.sp-bar {
  flex: 1;
  background: #1e293b;
  border-radius: 3px;
}

.sp-hi { background: #38bdf8; box-shadow: 0 0 8px rgba(56, 189, 248, 0.5); }
.sp-green { background: #34d399; box-shadow: 0 0 8px rgba(52, 211, 153, 0.5); }`,
    prompt: `Create a 3-card analytics metrics dashboard section with CSS sparklines in HTML and CSS.

Requirements:
- 3 responsive cards displaying key telemetry figures.
- Top row with metric title and percentage gain pill.
- Large numerical readout.
- Mini bar sparklines inside each card showing trend progression.

Return one HTML file with a <style> block.`,
    steps: [
      "Use CSS grid with repeat(3, 1fr) for metric cards.",
      "Build mini sparkline container with display: flex and align-items: flex-end.",
      "Assign height percentage inline on each bar to represent data trends.",
    ],
    tips: [
      "Highlight the final bar with an accent color and glow to represent current real-time data.",
    ],
  },
  {
    slug: "interactive-live-calculator-section",
    name: "Interactive SaaS ROI & Cost Calculator",
    tone: "dark",
    tags: ["calculator", "roi", "pricing", "slider", "section"],
    colors: ["#090d16", "#10b981", "#3b82f6", "#ffffff"],
    description: "An interactive cloud cost savings calculator where adjusting monthly request volume dynamically calculates annual dollar savings.",
    html: `<section class="calc-sec">
  <div class="calc-header">
    <span class="calc-badge">Cloud Cost Economics</span>
    <h2>Estimate your infrastructure savings</h2>
    <p>See how much your organization saves by consolidating vector caching and storage into Orbit.</p>
  </div>

  <div class="calc-card">
    <div class="calc-left">
      <div class="calc-field">
        <div class="cf-header">
          <label>Monthly Vector Queries</label>
          <span class="cf-val" id="queryCountVal">10,000,000</span>
        </div>
        <input type="range" id="querySlider" min="1000000" max="50000000" step="1000000" value="10000000" class="cf-slider" />
      </div>

      <div class="calc-stats-row">
        <div>
          <small>CURRENT CLOUD BILL</small>
          <b id="currentCostVal">$4,200/mo</b>
        </div>
        <div>
          <small>ORBIT ESTIMATED COST</small>
          <b class="c-green" id="orbitCostVal">$1,450/mo</b>
        </div>
      </div>
    </div>

    <div class="calc-right">
      <div class="cr-label">ANNUAL INFRASTRUCTURE SAVINGS</div>
      <div class="cr-amount" id="savingsVal">$33,000</div>
      <div class="cr-sub">Saved per year on data egress & managed clusters</div>
      <button class="cr-btn">Start Saving Today &rarr;</button>
    </div>
  </div>
</section>`,
    css: `.calc-sec {
  background: #090d16;
  color: #ffffff;
  padding: 80px 24px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.calc-header {
  text-align: center;
  max-width: 650px;
  margin: 0 auto 50px;
}

.calc-badge {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  color: #34d399;
  letter-spacing: 1.5px;
  padding: 4px 14px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 999px;
  margin-bottom: 16px;
}

.calc-header h2 {
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 800;
  margin: 0 0 16px;
  letter-spacing: -1px;
}

.calc-header p {
  font-size: 16.5px;
  color: #94a3b8;
  line-height: 1.6;
  margin: 0;
}

.calc-card {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  max-width: 960px;
  margin: 0 auto;
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6);
}

@media (max-width: 780px) {
  .calc-card { grid-template-columns: 1fr; }
}

.calc-left {
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.cf-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.cf-header label {
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
}

.cf-val {
  font-size: 18px;
  font-weight: 800;
  color: #38bdf8;
  font-family: ui-monospace, monospace;
}

.cf-slider {
  width: 100%;
  height: 8px;
  background: #1e293b;
  border-radius: 999px;
  outline: none;
  cursor: pointer;
  accent-color: #38bdf8;
  margin-bottom: 36px;
}

.calc-stats-row {
  display: flex;
  gap: 32px;
}

.calc-stats-row small {
  display: block;
  font-size: 11px;
  color: #64748b;
  font-weight: 700;
  letter-spacing: 1px;
  margin-bottom: 6px;
}

.calc-stats-row b {
  font-size: 22px;
  color: #cbd5e1;
}

.c-green { color: #34d399 !important; }

.calc-right {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(15, 23, 42, 0.95));
  border-left: 1px solid rgba(255, 255, 255, 0.08);
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}

.cr-label {
  font-size: 11.5px;
  font-weight: 800;
  letter-spacing: 1.5px;
  color: #34d399;
  margin-bottom: 8px;
}

.cr-amount {
  font-size: clamp(2.5rem, 5vw, 3.8rem);
  font-weight: 900;
  color: #ffffff;
  line-height: 1.1;
  margin-bottom: 12px;
}

.cr-sub {
  font-size: 13.5px;
  color: #94a3b8;
  line-height: 1.5;
  margin-bottom: 28px;
}

.cr-btn {
  background: #10b981;
  border: none;
  color: #ffffff;
  padding: 14px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.35);
  transition: background 0.2s ease;
}

.cr-btn:hover { background: #059669; }`,
    js: `var slider = document.getElementById("querySlider");
var queryText = document.getElementById("queryCountVal");
var currentText = document.getElementById("currentCostVal");
var orbitText = document.getElementById("orbitCostVal");
var savingsText = document.getElementById("savingsVal");

function calculate() {
  var count = parseInt(slider.value, 10);
  queryText.textContent = count.toLocaleString();

  var currentMonthly = (count / 1000000) * 420;
  var orbitMonthly = (count / 1000000) * 145;
  var annualSavings = (currentMonthly - orbitMonthly) * 12;

  currentText.textContent = "$" + Math.round(currentMonthly).toLocaleString() + "/mo";
  orbitText.textContent = "$" + Math.round(orbitMonthly).toLocaleString() + "/mo";
  savingsText.textContent = "$" + Math.round(annualSavings).toLocaleString();
}

slider.addEventListener("input", calculate);
calculate();`,
    prompt: `Create an interactive SaaS ROI and cloud cost savings calculator section in HTML, CSS and vanilla JavaScript.

Requirements:
- Range slider selecting monthly query volume from 1M to 50M.
- Real-time computation of legacy monthly bill vs optimized rate.
- Right highlight card displaying total annual savings in large bold typography.
- "Start Saving Today" action button.

Return one HTML file with <style> and <script> tags.`,
    steps: [
      "Bind input event to range slider.",
      "Calculate monthly difference and multiply by 12 for annual savings.",
      "Update DOM text nodes using toLocaleString() for currency formatting.",
    ],
    tips: [
      "Dynamic calculators dramatically boost landing page conversion by quantifying customer value.",
    ],
  },
  {
    slug: "step-by-step-process-section",
    name: "Connected Pipeline Workflow Process",
    tone: "dark",
    tags: ["process", "workflow", "steps", "pipeline", "section"],
    colors: ["#090d16", "#3b82f6", "#8b5cf6", "#ffffff"],
    description: "A 4-step horizontal workflow pipeline with numbered glowing nodes, connecting dashed lines, and progressive feature descriptions.",
    html: `<section class="proc-sec">
  <div class="proc-header">
    <span class="proc-badge">How It Works</span>
    <h2>From local code to edge deployment</h2>
    <p>Four streamlined steps to ship low-latency vector search across 35 global nodes.</p>
  </div>

  <div class="proc-grid">
    <div class="proc-card">
      <div class="proc-num">01</div>
      <h3>Connect Data Source</h3>
      <p>Link your existing PostgreSQL, MongoDB, or S3 bucket with one-click CDC streaming.</p>
    </div>

    <div class="proc-card">
      <div class="proc-num">02</div>
      <h3>Generate Embeddings</h3>
      <p>Automated batch ingestion transforms raw text and image chunks into optimized vector floats.</p>
    </div>

    <div class="proc-card">
      <div class="proc-num">03</div>
      <h3>Index & Shard</h3>
      <p>Hierarchical Navigable Small World (HNSW) graph indexing with SIMD acceleration.</p>
    </div>

    <div class="proc-card">
      <div class="proc-num">04</div>
      <h3>Query Globally</h3>
      <p>Deliver sub-2ms nearest-neighbor inference queries from the user's nearest regional edge node.</p>
    </div>
  </div>
</section>`,
    css: `.proc-sec {
  background: #090d16;
  color: #ffffff;
  padding: 80px 24px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.proc-header {
  text-align: center;
  max-width: 650px;
  margin: 0 auto 50px;
}

.proc-badge {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  color: #818cf8;
  letter-spacing: 1.5px;
  padding: 4px 14px;
  background: rgba(129, 140, 248, 0.1);
  border: 1px solid rgba(129, 140, 248, 0.3);
  border-radius: 999px;
  margin-bottom: 16px;
}

.proc-header h2 {
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 800;
  margin: 0 0 16px;
  letter-spacing: -1px;
}

.proc-header p {
  font-size: 16.5px;
  color: #94a3b8;
  line-height: 1.6;
  margin: 0;
}

.proc-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  max-width: 1100px;
  margin: 0 auto;
}

@media (max-width: 900px) {
  .proc-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 540px) {
  .proc-grid { grid-template-columns: 1fr; }
}

.proc-card {
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.proc-card:hover {
  transform: translateY(-4px);
  border-color: rgba(59, 130, 246, 0.4);
}

.proc-num {
  font-size: 28px;
  font-weight: 900;
  color: #38bdf8;
  font-family: ui-monospace, monospace;
  margin-bottom: 16px;
}

.proc-card h3 {
  font-size: 17px;
  font-weight: 700;
  margin: 0 0 10px;
}

.proc-card p {
  font-size: 14px;
  color: #94a3b8;
  line-height: 1.55;
  margin: 0;
}`,
    prompt: `Create a 4-step connected pipeline workflow process section in HTML and CSS.

Requirements:
- 4-column responsive grid layout.
- Monospace step indicators (01, 02, 03, 04) with vibrant blue color.
- Structured process titles and concise architectural explanations.
- Hover lift transitions.

Return one HTML file with a <style> block.`,
    steps: [
      "Use CSS grid with repeat(4, 1fr) that adapts to 2 columns on tablet and 1 on mobile.",
      "Highlight step numbers with monospace font and high-contrast color.",
    ],
    tips: [
      "Keep text descriptions concise so all 4 cards retain balanced heights.",
    ],
  },
  {
    slug: "feature-tabs-with-carousel-section",
    name: "Interactive Feature Selector Showcase",
    tone: "dark",
    tags: ["features", "tabs", "selector", "saas", "section"],
    colors: ["#030712", "#3b82f6", "#8b5cf6", "#ffffff"],
    description: "An enterprise feature selector section with active tab buttons on the left and dynamic screenshot cards on the right.",
    html: `<section class="ftab-sec">
  <div class="ftab-header">
    <span class="ftab-badge">Control Plane</span>
    <h2>Deep observability across your clusters</h2>
  </div>

  <div class="ftab-layout">
    <div class="ftab-nav" id="ftabNav">
      <div class="ftab-btn is-active" data-idx="0">
        <h4>Real-Time Telemetry</h4>
        <p>Live request histograms and P99 latency tracking across 35 regions.</p>
      </div>
      <div class="ftab-btn" data-idx="1">
        <h4>Automated Rebalancing</h4>
        <p>Zero-downtime shard migration during traffic surges or hardware failover.</p>
      </div>
      <div class="ftab-btn" data-idx="2">
        <h4>Role-Based Access</h4>
        <p>Granular IAM access policies with hardware-backed WebAuthn authentication.</p>
      </div>
    </div>

    <div class="ftab-preview">
      <div class="ftab-screen" id="ftabScreen">
        <div class="fts-header">
          <div class="fts-dots"><span></span><span></span><span></span></div>
          <span id="ftsTitle">telemetry-dashboard-prod</span>
        </div>
        <div class="fts-body" id="ftsBody">
          <div class="fts-graphic">📊</div>
          <div class="fts-caption" id="ftsCaption">P99 Latency: 1.2ms · Cluster Load: 42%</div>
        </div>
      </div>
    </div>
  </div>
</section>`,
    css: `.ftab-sec {
  background: #030712;
  color: #ffffff;
  padding: 80px 24px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.ftab-header {
  text-align: center;
  max-width: 600px;
  margin: 0 auto 50px;
}

.ftab-badge {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  color: #60a5fa;
  letter-spacing: 1.5px;
  padding: 4px 14px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 999px;
  margin-bottom: 16px;
}

.ftab-header h2 {
  font-size: clamp(2rem, 4vw, 2.6rem);
  font-weight: 800;
  margin: 0;
  letter-spacing: -1px;
}

.ftab-layout {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 40px;
  align-items: center;
  max-width: 1050px;
  margin: 0 auto;
}

@media (max-width: 860px) {
  .ftab-layout { grid-template-columns: 1fr; }
}

.ftab-nav {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ftab-btn {
  background: #0b1120;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 20px 24px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.ftab-btn:hover {
  background: #0f172a;
}

.ftab-btn.is-active {
  border-color: #3b82f6;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), #0f172a);
}

.ftab-btn h4 {
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 6px;
}

.ftab-btn p {
  font-size: 13.5px;
  color: #94a3b8;
  line-height: 1.5;
  margin: 0;
}

.ftab-preview {
  position: relative;
}

.ftab-screen {
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6);
}

.fts-header {
  display: flex;
  align-items: center;
  padding: 12px 18px;
  background: #141e33;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  gap: 14px;
  font-size: 11px;
  color: #64748b;
  font-family: ui-monospace, monospace;
}

.fts-dots { display: flex; gap: 6px; }
.fts-dots span { width: 9px; height: 9px; border-radius: 50%; background: #475569; }

.fts-body {
  height: 260px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 24px;
  background: radial-gradient(circle at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
}

.fts-graphic { font-size: 54px; }
.fts-caption { font-size: 14px; font-weight: 700; color: #38bdf8; font-family: ui-monospace, monospace; }`,
    js: `var btns = document.querySelectorAll(".ftab-btn");
var title = document.getElementById("ftsTitle");
var caption = document.getElementById("ftsCaption");

var data = [
  { title: "telemetry-dashboard-prod", caption: "P99 Latency: 1.2ms · Cluster Load: 42%", icon: "📊" },
  { title: "auto-rebalance-worker", caption: "12 Shards balanced across 35 nodes (0 errors)", icon: "🔄" },
  { title: "iam-security-policies", caption: "RBAC Enforced · 0 Unauthorized Invocations", icon: "🛡️" }
];

btns.forEach(function(btn) {
  btn.addEventListener("click", function() {
    btns.forEach(function(b) { b.classList.remove("is-active"); });
    btn.classList.add("is-active");
    var idx = parseInt(btn.getAttribute("data-idx"), 10);
    title.textContent = data[idx].title;
    caption.textContent = data[idx].caption;
    document.querySelector(".fts-graphic").textContent = data[idx].icon;
  });
});`,
    prompt: `Create an interactive feature tab selector with synchronized preview card in HTML, CSS and vanilla JavaScript.

Requirements:
- Left column with 3 clickable feature list items.
- Active item highlights with border-color and subtle gradient.
- Right column mock screen updates title, metric caption, and graphic on tab switch.

Return one HTML file with <style> and <script> tags.`,
    steps: [
      "Store preview metadata in JavaScript array.",
      "Bind click events on nav tabs to swap active classes and update preview card elements.",
    ],
    tips: [
      "A 2-column feature selector is one of the highest-converting section layouts for B2B SaaS.",
    ],
  },
  {
    slug: "app-download-badges-section",
    name: "Mobile App Download Showcase Banner",
    tone: "dark",
    tags: ["mobile", "app", "download", "banner", "section"],
    colors: ["#020617", "#3b82f6", "#ffffff"],
    description: "A mobile application showcase banner with App Store and Google Play buttons, QR code download scan card, and 4.9-star ratings.",
    html: `<section class="app-down-sec">
  <div class="ad-card">
    <div class="ad-content">
      <span class="ad-pill">📱 iOS & Android Apps Live</span>
      <h2>Take your AI models anywhere</h2>
      <p>Monitor cluster telemetry, approve production deploys, and test prompts on the go with zero latency.</p>

      <div class="ad-rating">
        <span class="ad-stars">★★★★★</span>
        <span>4.9 / 5 rating across 12,000+ app store reviews</span>
      </div>

      <div class="ad-badges">
        <a href="#" class="store-badge">
          <span class="sb-icon"></span>
          <div class="sb-text"><small>Download on the</small><b>App Store</b></div>
        </a>
        <a href="#" class="store-badge">
          <span class="sb-icon">▶</span>
          <div class="sb-text"><small>Get it on</small><b>Google Play</b></div>
        </a>
      </div>
    </div>

    <div class="ad-qr-box">
      <div class="qr-mock">
        <div class="qr-pixel-grid">📱</div>
      </div>
      <div class="qr-label">Scan to install directly</div>
    </div>
  </div>
</section>`,
    css: `.app-down-sec {
  background: #020617;
  padding: 80px 24px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #ffffff;
}

.ad-card {
  display: grid;
  grid-template-columns: 1.3fr 0.7fr;
  align-items: center;
  gap: 40px;
  max-width: 960px;
  margin: 0 auto;
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 50px 48px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6);
}

@media (max-width: 780px) {
  .ad-card { grid-template-columns: 1fr; text-align: center; padding: 36px 28px; }
  .ad-badges { justify-content: center; }
  .ad-rating { justify-content: center; }
}

.ad-pill {
  display: inline-block;
  font-size: 11.5px;
  font-weight: 700;
  text-transform: uppercase;
  color: #60a5fa;
  letter-spacing: 1px;
  padding: 4px 12px;
  background: rgba(59, 130, 246, 0.12);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 999px;
  margin-bottom: 16px;
}

.ad-content h2 {
  font-size: clamp(2rem, 4vw, 2.6rem);
  font-weight: 800;
  letter-spacing: -1px;
  margin: 0 0 16px;
  line-height: 1.15;
}

.ad-content p {
  font-size: 16px;
  color: #94a3b8;
  line-height: 1.6;
  margin: 0 0 20px;
}

.ad-rating {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: #cbd5e1;
  margin-bottom: 28px;
}

.ad-stars { color: #f59e0b; letter-spacing: 2px; }

.ad-badges {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.store-badge {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #020617;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 12px;
  padding: 10px 18px;
  text-decoration: none;
  color: #ffffff;
  transition: all 0.2s ease;
}

.store-badge:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.3);
}

.sb-icon { font-size: 24px; }
.sb-text small { display: block; font-size: 10px; color: #94a3b8; text-transform: uppercase; }
.sb-text b { font-size: 15px; }

.ad-qr-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 24px;
}

.qr-mock {
  width: 130px;
  height: 130px;
  background: #ffffff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 52px;
  margin-bottom: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.qr-label {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 600;
}`,
    prompt: `Create a mobile app store download section banner in HTML and CSS.

Requirements:
- Split layout: headline and store badges on left, QR download card on right.
- Official App Store and Google Play stylized action button cards.
- Star ratings and social proof caption.
- Dark theme styling.

Return one HTML file with a <style> block.`,
    steps: [
      "Structure 2-column flex or grid container.",
      "Style store badge buttons with SVG or glyph icons and dual-line text.",
      "Add QR code preview card for instant desktop-to-mobile conversion.",
    ],
    tips: [
      "Providing both direct store links and a QR code accommodates desktop visitors wanting to download on mobile immediately.",
    ],
  },
];
