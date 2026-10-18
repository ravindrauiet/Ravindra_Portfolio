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
];
