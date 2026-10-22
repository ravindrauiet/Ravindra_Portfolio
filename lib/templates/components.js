// Component library: small, reusable UI pieces in plain HTML + CSS (+ a little JS where needed).

const STAGE_LIGHT = `body {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #f7f7f7;
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
}`;

const STAGE_DARK = `body {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #0b1020;
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
}`;

export const components = [
  {
    slug: "shine-button-component",
    name: "Shine Button",
    tone: "light",
    tags: ["button", "hover", "animation", "cta"],
    description:
      "A pill button with a streak of light that sweeps across it on hover. One pseudo-element and one transition; no JavaScript.",
    html: `<a class="shine-btn" href="#">Get started <span aria-hidden="true">&rarr;</span></a>`,
    css: `${STAGE_LIGHT}

.shine-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 16px 34px;
  border-radius: 999px;
  background: #2506ad;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 700;
  text-decoration: none;
  overflow: hidden;
  box-shadow: 0 10px 24px rgba(37, 6, 173, 0.3);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

/* The streak of light starts off-screen to the left */
.shine-btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: -75%;
  width: 50%;
  height: 100%;
  background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.45), transparent);
  transform: skewX(-20deg);
  transition: left 0.6s ease;
}

.shine-btn:hover { transform: translateY(-2px); box-shadow: 0 16px 32px rgba(37, 6, 173, 0.4); }
.shine-btn:hover::before { left: 125%; }
.shine-btn span { transition: transform 0.2s ease; }
.shine-btn:hover span { transform: translateX(4px); }
.shine-btn:focus-visible { outline: 3px solid #ff7b00; outline-offset: 3px; }`,
    prompt: `Create a call-to-action button with a "shine" hover effect using only HTML and CSS.

Requirements:
- An <a> styled as a pill: indigo #2506ad background, white bold text, 16px 34px padding, soft indigo shadow. Text "Get started" followed by a right arrow.
- position: relative and overflow: hidden on the button.
- A ::before pseudo-element: 50% wide, full height, a linear-gradient that goes transparent -> white at 45% opacity -> transparent, skewed -20deg, starting at left: -75% (outside the button).
- On hover, transition the pseudo-element's left to 125% over 0.6s so the streak sweeps across; also lift the button 2px, deepen the shadow and nudge the arrow 4px right.
- A visible orange focus-visible outline for keyboard users.
- Centre it on a light grey page.

Return one HTML file with a <style> block.`,
    steps: [
      "Style a normal pill button and add position: relative with overflow: hidden. The overflow rule clips the streak to the button's shape.",
      "Create the streak with a ::before pseudo-element filled by a transparent-white-transparent gradient.",
      "Skew it with transform: skewX(-20deg) so it looks like a slanted reflection.",
      "Park it outside the left edge (left: -75%) and move it past the right edge on hover with a transition on left.",
      "Add small supporting motion: lift the button and slide the arrow.",
    ],
    tips: [
      "Loop the shine automatically with a keyframe animation to draw attention to a primary action.",
      "Change the button colour freely; the white streak works on any saturated background.",
      "Use a button element instead of a link when the action does not navigate.",
    ],
  },
  {
    slug: "glass-card-component",
    name: "Glassmorphism Card",
    tone: "dark",
    tags: ["card", "glass", "blur", "modern"],
    description:
      "A frosted-glass card that blurs whatever is behind it using backdrop-filter. Shown here over colourful shapes so the effect is visible.",
    html: `<div class="scene">
  <span class="orb orb-a"></span>
  <span class="orb orb-b"></span>
  <article class="glass">
    <span class="tag">Pro plan</span>
    <h3>Glass card</h3>
    <p>Content stays readable while the background shows through.</p>
    <a href="#">Learn more &rarr;</a>
  </article>
</div>`,
    css: `${STAGE_DARK}

.scene { position: relative; width: min(90vw, 420px); padding: 40px 0; }

.orb { position: absolute; border-radius: 50%; }
.orb-a { width: 180px; height: 180px; top: 0; left: -20px; background: #ff7b00; }
.orb-b { width: 220px; height: 220px; bottom: 0; right: -30px; background: #2506ad; }

.glass {
  position: relative;
  padding: 32px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.25);
  -webkit-backdrop-filter: blur(18px) saturate(140%);
  backdrop-filter: blur(18px) saturate(140%);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
  color: #fff;
}

.tag {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  font-size: 0.8rem;
  font-weight: 600;
}
.glass h3 { margin: 16px 0 0; font-size: 1.6rem; }
.glass p { margin: 8px 0 20px; line-height: 1.6; color: rgba(255, 255, 255, 0.8); }
.glass a { color: #fff; font-weight: 700; text-decoration: none; }
.glass a:hover { text-decoration: underline; }`,
    prompt: `Create a glassmorphism card with HTML and CSS.

Requirements:
- A dark page (#0b1020) with two solid colour circles (orange #ff7b00 and indigo #2506ad) positioned behind the card so the blur is visible.
- The card: 32px padding, 24px radius, background rgba(255,255,255,0.1), 1px border rgba(255,255,255,0.25), backdrop-filter: blur(18px) saturate(140%) (with the -webkit- prefix), and a large soft shadow.
- Inside: a small translucent pill tag "Pro plan", a heading "Glass card", one sentence of text at 80% white, and a "Learn more ->" link.
- Card width: min(90vw, 420px), centred.

Return one HTML file with a <style> block.`,
    steps: [
      "Place something colourful behind the card. Glassmorphism only shows when there is detail to blur.",
      "Give the card a semi-transparent white background (10% opacity).",
      "Add backdrop-filter: blur(). This blurs what is behind the element, unlike filter: blur() which blurs the element itself.",
      "Add a thin, light, semi-transparent border to suggest the edge of a glass pane.",
      "Include the -webkit-backdrop-filter prefix for Safari.",
    ],
    tips: [
      "Check text contrast carefully; glass over a busy image can make text hard to read.",
      "Increase background opacity to 0.2 on light pages for a milkier glass.",
      "backdrop-filter is costly on large areas; use it on cards and navbars, not full-page overlays.",
    ],
  },
  {
    slug: "tilt-3d-card-component",
    name: "3D Tilt Card",
    tone: "dark",
    tags: ["card", "3d", "interactive", "javascript", "hover"],
    description:
      "A card that tilts in 3D towards the cursor, with its content floating above the surface and a light reflection following the mouse. About 20 lines of JavaScript.",
    html: `<div class="tilt" id="tilt">
  <div class="tilt-inner">
    <span class="chip">Featured</span>
    <h3>3D Tilt Card</h3>
    <p>Move your cursor over me.</p>
  </div>
</div>`,
    css: `${STAGE_DARK}

.tilt {
  --mx: 50%;
  --my: 50%;
  position: relative;
  width: min(86vw, 340px);
  aspect-ratio: 4 / 5;
  border-radius: 24px;
  background: linear-gradient(145deg, #002057, #2506ad);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.45);
  transform-style: preserve-3d;
  transition: transform 0.5s ease;
  will-change: transform;
}

/* Light reflection that follows the cursor */
.tilt::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(circle at var(--mx) var(--my), rgba(255, 255, 255, 0.3), transparent 55%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}
.tilt:hover::after { opacity: 1; }

.tilt-inner {
  position: absolute;
  inset: 0;
  padding: 28px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  color: #fff;
  transform: translateZ(50px); /* floats above the card surface */
}
.chip {
  align-self: flex-start;
  margin-bottom: auto;
  padding: 5px 12px;
  border-radius: 999px;
  background: #ff7b00;
  font-size: 0.75rem;
  font-weight: 700;
}
.tilt-inner h3 { margin: 0; font-size: 1.7rem; }
.tilt-inner p { margin: 6px 0 0; color: rgba(255, 255, 255, 0.75); }`,
    js: `var card = document.getElementById("tilt");
var MAX = 14; // maximum tilt in degrees

card.addEventListener("pointermove", function (event) {
  var rect = card.getBoundingClientRect();
  var px = (event.clientX - rect.left) / rect.width;   // 0 to 1
  var py = (event.clientY - rect.top) / rect.height;   // 0 to 1
  var rotateY = (px - 0.5) * 2 * MAX;
  var rotateX = (0.5 - py) * 2 * MAX;

  card.style.transition = "transform 0.1s ease-out";
  card.style.transform =
    "perspective(900px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) scale(1.03)";
  card.style.setProperty("--mx", px * 100 + "%");
  card.style.setProperty("--my", py * 100 + "%");
});

card.addEventListener("pointerleave", function () {
  card.style.transition = "transform 0.5s ease";
  card.style.transform = "";
});`,
    prompt: `Create an interactive 3D tilt card with HTML, CSS and vanilla JavaScript (no libraries).

Card:
- Width min(86vw, 340px), aspect-ratio 4/5, 24px radius, navy-to-indigo gradient background, large dark shadow, centred on a dark page.
- transform-style: preserve-3d on the card; an inner content layer positioned absolutely with transform: translateZ(50px) so it floats above the card when tilted.
- Content: an orange "Featured" chip at the top, heading "3D Tilt Card" and a line of text at the bottom.
- A ::after overlay with a radial-gradient highlight positioned at CSS variables --mx and --my; opacity 0 by default, 1 on hover.

JavaScript:
- On pointermove, compute the pointer position within the card as fractions px and py (0 to 1).
- rotateY = (px - 0.5) * 2 * 14 and rotateX = (0.5 - py) * 2 * 14 (max 14 degrees).
- Set transform to "perspective(900px) rotateX(...) rotateY(...) scale(1.03)" with a quick 0.1s transition, and update --mx / --my as percentages.
- On pointerleave, reset the transform with a slower 0.5s transition.

Return a single HTML file with <style> and <script> tags.`,
    steps: [
      "Work out where the pointer is inside the card as a fraction from 0 to 1 on each axis using getBoundingClientRect.",
      "Convert that to rotation: the further from the centre, the larger the angle. Horizontal movement drives rotateY, vertical movement drives rotateX (inverted).",
      "Apply perspective() inside the transform. Without perspective, 3D rotations look flat.",
      "Add transform-style: preserve-3d to the card and translateZ() to the inner content so it separates from the surface when tilted.",
      "Feed the same pointer position into CSS variables to move a radial-gradient highlight.",
      "On pointerleave, clear the transform with a longer transition so the card settles back smoothly.",
    ],
    tips: [
      "Lower MAX to 6-8 degrees for large cards; big cards need less tilt to feel right.",
      "Skip the effect on touch devices by checking window.matchMedia('(hover: hover)').",
      "Give different children different translateZ values (30px, 50px, 70px) for a layered parallax effect.",
    ],
  },
  {
    slug: "css-loaders-component",
    name: "CSS Loaders",
    tone: "light",
    tags: ["loader", "spinner", "animation", "loading"],
    description:
      "Four pure-CSS loading indicators: a ring spinner, bouncing dots, an equaliser and a pulsing circle. Copy the one you need.",
    html: `<div class="loaders">
  <figure>
    <div class="spinner" role="status" aria-label="Loading"></div>
    <figcaption>Spinner</figcaption>
  </figure>
  <figure>
    <div class="dots" role="status" aria-label="Loading"><i></i><i></i><i></i></div>
    <figcaption>Dots</figcaption>
  </figure>
  <figure>
    <div class="bars" role="status" aria-label="Loading"><i></i><i></i><i></i><i></i></div>
    <figcaption>Bars</figcaption>
  </figure>
  <figure>
    <div class="pulse" role="status" aria-label="Loading"></div>
    <figcaption>Pulse</figcaption>
  </figure>
</div>`,
    css: `${STAGE_LIGHT}

.loaders { display: flex; flex-wrap: wrap; justify-content: center; gap: 24px; }
figure {
  margin: 0;
  width: 130px;
  height: 130px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
  border-radius: 16px;
  background: #fff;
  border: 1px solid #e8e9f0;
}
figcaption { font-size: 0.8rem; color: #8a8fa3; }

/* 1. Ring spinner */
.spinner {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 4px solid #e0e3f0;
  border-top-color: #2506ad;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* 2. Bouncing dots */
.dots { display: flex; gap: 6px; height: 40px; align-items: center; }
.dots i { width: 10px; height: 10px; border-radius: 50%; background: #2506ad; animation: bounce 0.6s ease-in-out infinite alternate; }
.dots i:nth-child(2) { animation-delay: 0.15s; }
.dots i:nth-child(3) { animation-delay: 0.3s; }
@keyframes bounce { to { transform: translateY(-12px); opacity: 0.4; } }

/* 3. Equaliser bars */
.bars { display: flex; gap: 5px; height: 40px; align-items: center; }
.bars i { width: 6px; height: 100%; border-radius: 3px; background: #ff7b00; animation: stretch 0.9s ease-in-out infinite; }
.bars i:nth-child(2) { animation-delay: 0.1s; }
.bars i:nth-child(3) { animation-delay: 0.2s; }
.bars i:nth-child(4) { animation-delay: 0.3s; }
@keyframes stretch { 0%, 100% { transform: scaleY(0.3); } 50% { transform: scaleY(1); } }

/* 4. Pulse */
.pulse { width: 40px; height: 40px; border-radius: 50%; background: #2506ad; animation: pulse 1.2s ease-out infinite; }
@keyframes pulse { 0% { transform: scale(0.4); opacity: 1; } 100% { transform: scale(1.1); opacity: 0; } }

@media (prefers-reduced-motion: reduce) {
  .spinner, .dots i, .bars i, .pulse { animation-duration: 2.4s; }
}`,
    prompt: `Create a set of four pure-CSS loading indicators in one HTML file (no JavaScript, no images).

1. Ring spinner: a 40px circle with a 4px light grey border and an indigo (#2506ad) top border, rotating 360 degrees every 0.8s.
2. Bouncing dots: three 10px indigo dots that move up 12px and fade, alternating, with staggered delays of 0.15s.
3. Equaliser bars: four 6px wide orange (#ff7b00) bars that scale vertically between 0.3 and 1, with staggered delays of 0.1s.
4. Pulse: a 40px indigo circle that scales from 0.4 to 1.1 while fading out, repeating every 1.2s.

Present each inside a 130px white tile with a 1px border, 16px radius and a small grey caption, arranged in a centred, wrapping flex row on a light grey page.
Add role="status" and aria-label="Loading" to each loader. Slow the animations under prefers-reduced-motion.

Return one HTML file with a <style> block.`,
    steps: [
      "Spinner: draw a circle with a border, colour only one side with border-top-color, and rotate it with a linear infinite animation.",
      "Dots: animate each dot with the same keyframes and stagger them using animation-delay.",
      "Bars: animate transform: scaleY() rather than height. Transforms are handled by the GPU and do not trigger layout.",
      "Pulse: combine scale and opacity so the circle grows and fades at the same time.",
      "Add role='status' and an aria-label so assistive technology announces that content is loading.",
    ],
    tips: [
      "Show loaders only after about 300ms; flashing a spinner for instant responses feels slower.",
      "For content that has a known layout, prefer skeleton placeholders over spinners.",
      "Use currentColor instead of fixed colours so a loader inherits the text colour of its container.",
    ],
  },
  {
    slug: "toggle-switch-component",
    name: "Toggle Switch",
    tone: "light",
    tags: ["form", "toggle", "switch", "checkbox", "accessible"],
    description:
      "An accessible iOS-style toggle switch built on a real checkbox, so it works with the keyboard, forms and screen readers with no JavaScript.",
    html: `<div class="settings">
  <label class="row">
    <span>Email notifications</span>
    <input type="checkbox" class="switch" checked />
  </label>
  <label class="row">
    <span>Dark mode</span>
    <input type="checkbox" class="switch" />
  </label>
  <label class="row">
    <span>Weekly summary</span>
    <input type="checkbox" class="switch" disabled />
  </label>
</div>`,
    css: `${STAGE_LIGHT}

.settings {
  width: min(90vw, 360px);
  padding: 8px 24px;
  border-radius: 16px;
  background: #fff;
  border: 1px solid #e8e9f0;
}
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  color: #002057;
  font-weight: 600;
  cursor: pointer;
}
.row + .row { border-top: 1px solid #eef0f4; }

/* The checkbox itself becomes the switch */
.switch {
  appearance: none;
  -webkit-appearance: none;
  position: relative;
  width: 48px;
  height: 28px;
  margin: 0;
  border-radius: 999px;
  background: #cfd3e1;
  cursor: pointer;
  transition: background 0.25s ease;
}
.switch::before {
  content: "";
  position: absolute;
  top: 3px;
  left: 3px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  transition: transform 0.25s ease;
}
.switch:checked { background: #2506ad; }
.switch:checked::before { transform: translateX(20px); }
.switch:focus-visible { outline: 3px solid #ff7b00; outline-offset: 2px; }
.switch:disabled { opacity: 0.45; cursor: not-allowed; }`,
    prompt: `Create an accessible toggle switch component using only HTML and CSS.

Requirements:
- Use a real <input type="checkbox"> with appearance: none so the checkbox itself is restyled as the switch. Do not hide the input and fake it with a span.
- Track: 48px by 28px, fully rounded, grey #cfd3e1 when off, indigo #2506ad when :checked, with a 0.25s background transition.
- Thumb: a ::before pseudo-element, 22px white circle with a small shadow, 3px inset, that slides 20px right when checked (transform: translateX).
- Focus: a 3px orange outline on :focus-visible.
- Disabled: 45% opacity and a not-allowed cursor.
- Demo: a white settings card with three labelled rows (Email notifications - on, Dark mode - off, Weekly summary - disabled). Wrap each row in a <label> so clicking the text toggles the switch.

Return one HTML file with a <style> block.`,
    steps: [
      "Start with a real checkbox. You keep keyboard support (Space to toggle), form submission and screen-reader semantics for free.",
      "Remove the native look with appearance: none, then size and round the input to make the track.",
      "Draw the thumb with a ::before pseudo-element positioned inside the track.",
      "Use the :checked pseudo-class to change the track colour and slide the thumb with a transform.",
      "Wrap the text and input in a label so the whole row is clickable.",
      "Style :focus-visible and :disabled states; they are part of a complete form control.",
    ],
    tips: [
      "Add role='switch' to the input if you want screen readers to announce on/off instead of checked/unchecked.",
      "Change the track width to 56px and translateX to 28px for a larger touch target.",
      "In React, control it with the checked and onChange props like any checkbox.",
    ],
  },
  {
    slug: "animated-border-card-component",
    name: "Animated Border Card",
    tone: "dark",
    tags: ["card", "border", "conic", "animation", "glow"],
    description:
      "A dark card with a glowing gradient border that rotates continuously. Uses a registered CSS custom property so the conic-gradient angle can be animated.",
    html: `<article class="glow-card">
  <h3>Animated border</h3>
  <p>A conic gradient spins behind the card and shows through a thin gap.</p>
</article>`,
    css: `${STAGE_DARK}

/* Registering the property tells the browser it is an angle, so it can be animated */
@property --angle {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}

.glow-card {
  position: relative;
  width: min(86vw, 360px);
  padding: 36px;
  border-radius: 20px;
  background: #0f1530;
  color: #fff;
}

/* The spinning gradient sits behind the card and is 2px larger on every side */
.glow-card::before,
.glow-card::after {
  content: "";
  position: absolute;
  inset: -2px;
  z-index: -1;
  border-radius: 22px;
  background: conic-gradient(from var(--angle), #2506ad, #ff7b00, #06b6d4, #2506ad);
  animation: rotate 4s linear infinite;
}
/* A blurred copy creates the outer glow */
.glow-card::after { filter: blur(24px); opacity: 0.7; }

@keyframes rotate {
  to { --angle: 360deg; }
}

.glow-card h3 { margin: 0; font-size: 1.5rem; }
.glow-card p { margin: 10px 0 0; line-height: 1.6; color: rgba(255, 255, 255, 0.72); }

@media (prefers-reduced-motion: reduce) {
  .glow-card::before, .glow-card::after { animation: none; }
}`,
    prompt: `Create a card with an animated rotating gradient border and glow, using only HTML and CSS.

Requirements:
- Register a custom property with @property --angle { syntax: "<angle>"; initial-value: 0deg; inherits: false; } so it can be animated.
- Card: width min(86vw, 360px), 36px padding, 20px radius, dark background #0f1530, white text, position: relative, on a #0b1020 page.
- ::before and ::after pseudo-elements with inset: -2px, z-index: -1, border-radius 22px, and background: conic-gradient(from var(--angle), #2506ad, #ff7b00, #06b6d4, #2506ad).
- Animate --angle from 0deg to 360deg over 4s, linear, infinite, on both pseudo-elements.
- The ::after copy is blurred (24px) at 70% opacity to create an outer glow.
- Disable the animation under prefers-reduced-motion.
- Content: heading "Animated border" and one sentence.

Return one HTML file with a <style> block.`,
    steps: [
      "Register --angle with @property. Plain custom properties are treated as strings and cannot be interpolated; a registered angle can.",
      "Place a pseudo-element behind the card, slightly larger than it (inset: -2px), and fill it with a conic-gradient that starts at var(--angle).",
      "The card's solid background covers the middle, leaving only a 2px ring of gradient visible: the border.",
      "Animate --angle from 0 to 360 degrees. The gradient appears to rotate while the element itself stays still.",
      "Duplicate the pseudo-element and blur it to produce a soft glow of the same colours.",
    ],
    tips: [
      "Increase inset to -3px for a thicker border.",
      "Run the animation only on hover by setting animation-play-state: paused and changing it to running on :hover.",
      "@property is supported in all current major browsers; older ones show a static gradient border, which is a fine fallback.",
    ],
  },
  {
    slug: "pill-tabs-component",
    name: "Pill Tabs",
    tone: "light",
    tags: ["tabs", "navigation", "javascript", "accessible"],
    description:
      "A segmented tab control with a sliding active pill and proper ARIA roles. Arrow keys move between tabs, as assistive technology users expect.",
    html: `<div class="tabs">
  <div class="tablist" role="tablist" aria-label="Pricing period">
    <button role="tab" aria-selected="true" aria-controls="panel-0" id="tab-0">Monthly</button>
    <button role="tab" aria-selected="false" aria-controls="panel-1" id="tab-1" tabindex="-1">Yearly</button>
    <button role="tab" aria-selected="false" aria-controls="panel-2" id="tab-2" tabindex="-1">Lifetime</button>
    <span class="indicator" aria-hidden="true"></span>
  </div>
  <div class="panel" role="tabpanel" id="panel-0" aria-labelledby="tab-0">&#8377;999 billed every month.</div>
  <div class="panel" role="tabpanel" id="panel-1" aria-labelledby="tab-1" hidden>&#8377;9,990 billed yearly. Two months free.</div>
  <div class="panel" role="tabpanel" id="panel-2" aria-labelledby="tab-2" hidden>&#8377;24,999 once. Yours forever.</div>
</div>`,
    css: `${STAGE_LIGHT}

.tabs { width: min(92vw, 420px); }

.tablist {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding: 5px;
  border-radius: 999px;
  background: #e9ebf3;
}

.tablist button {
  position: relative;
  z-index: 1;
  padding: 11px 0;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: #5b6178;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
  transition: color 0.25s ease;
}
.tablist button[aria-selected="true"] { color: #fff; }
.tablist button:focus-visible { outline: 3px solid #ff7b00; outline-offset: 2px; }

/* The sliding pill: one third wide, moved with a CSS variable */
.indicator {
  position: absolute;
  top: 5px;
  bottom: 5px;
  left: 5px;
  width: calc((100% - 10px) / 3);
  border-radius: 999px;
  background: #2506ad;
  transform: translateX(calc(var(--index, 0) * 100%));
  transition: transform 0.3s cubic-bezier(0.2, 0.7, 0.2, 1);
}

.panel {
  margin-top: 16px;
  padding: 24px;
  border-radius: 16px;
  background: #fff;
  border: 1px solid #e8e9f0;
  color: #002057;
  font-weight: 600;
  text-align: center;
}`,
    js: `var tablist = document.querySelector(".tablist");
var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
var panels = Array.prototype.slice.call(document.querySelectorAll('[role="tabpanel"]'));

function select(index) {
  tabs.forEach(function (tab, i) {
    var active = i === index;
    tab.setAttribute("aria-selected", active);
    tab.tabIndex = active ? 0 : -1;
    panels[i].hidden = !active;
  });
  tablist.style.setProperty("--index", index);
  tabs[index].focus();
}

tabs.forEach(function (tab, i) {
  tab.addEventListener("click", function () { select(i); });
  tab.addEventListener("keydown", function (event) {
    if (event.key === "ArrowRight") select((i + 1) % tabs.length);
    if (event.key === "ArrowLeft") select((i - 1 + tabs.length) % tabs.length);
  });
});`,
    prompt: `Create an accessible segmented "pill tabs" component with a sliding indicator, using HTML, CSS and vanilla JavaScript.

Markup:
- A container with role="tablist" holding three <button role="tab"> elements (Monthly, Yearly, Lifetime) with aria-selected, aria-controls and ids; inactive tabs have tabindex="-1".
- Three role="tabpanel" divs linked with aria-labelledby; inactive panels use the hidden attribute. Show prices in Indian rupees.
- An empty span.indicator inside the tablist.

Styling:
- Tablist: a 3-column grid, fully rounded, light grey #e9ebf3, 5px padding.
- Buttons are transparent with grey bold text; the selected one has white text.
- The indicator is absolutely positioned, one third of the inner width, indigo #2506ad, and moves with transform: translateX(calc(var(--index, 0) * 100%)) using a 0.3s cubic-bezier transition.
- Panels are white cards with a 1px border and 16px radius.

Behaviour:
- Clicking a tab selects it: update aria-selected and tabindex on all tabs, toggle hidden on panels, and set the --index CSS variable on the tablist.
- Left and Right arrow keys move to the previous/next tab, wrapping around, and move focus.

Return a single HTML file with <style> and <script> tags.`,
    steps: [
      "Mark up the tabs with the ARIA tab pattern: role='tablist', role='tab' and role='tabpanel', connected with aria-controls and aria-labelledby.",
      "Lay the buttons out in an equal-column grid and add an absolutely positioned indicator behind them.",
      "Move the indicator with translateX(index x 100%). Because it is exactly one column wide, each step lands on the next tab.",
      "Store the active index in a CSS variable so JavaScript only needs to set one value.",
      "On selection, update aria-selected, tabindex and the hidden attribute so the visual state and the accessible state always match.",
      "Handle the arrow keys: in the tab pattern, Tab moves in and out of the tablist while arrows move between tabs.",
    ],
    tips: [
      "For a different number of tabs, change the grid column count and the divisor in the indicator width.",
      "In React, keep the index in useState and pass it as style={{ '--index': index }}.",
      "Use this as a monthly/yearly switch on the Pricing Table section.",
    ],
  },
  {
    slug: "css-tooltip-component",
    name: "CSS Tooltip",
    tone: "light",
    tags: ["tooltip", "hover", "css", "accessible"],
    description:
      "A tooltip that appears above an element on hover or keyboard focus. The text comes from a data attribute, and the whole thing is CSS only.",
    html: `<div class="row">
  <button class="tip" data-tip="Copy to clipboard" aria-label="Copy to clipboard">Copy</button>
  <button class="tip" data-tip="Share this page" aria-label="Share this page">Share</button>
  <button class="tip" data-tip="Add to favourites" aria-label="Add to favourites">Save</button>
</div>`,
    css: `${STAGE_LIGHT}

.row { display: flex; gap: 16px; }

.tip {
  position: relative;
  padding: 12px 22px;
  border-radius: 12px;
  border: 1px solid #e0e3f0;
  background: #fff;
  color: #002057;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

/* Bubble */
.tip::after {
  content: attr(data-tip);
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  padding: 7px 12px;
  border-radius: 8px;
  background: #002057;
  color: #fff;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transform: translate(-50%, 6px);
  transition: opacity 0.2s ease, transform 0.2s ease;
}

/* Arrow */
.tip::before {
  content: "";
  position: absolute;
  bottom: calc(100% + 2px);
  left: 50%;
  border: 5px solid transparent;
  border-top-color: #002057;
  opacity: 0;
  transform: translate(-50%, 6px);
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.tip:hover::after,
.tip:hover::before,
.tip:focus-visible::after,
.tip:focus-visible::before {
  opacity: 1;
  transform: translate(-50%, 0);
}

.tip:focus-visible { outline: 3px solid #ff7b00; outline-offset: 2px; }`,
    prompt: `Create a pure-CSS tooltip component (no JavaScript).

Requirements:
- Any element with class "tip" and a data-tip attribute shows a tooltip above it.
- The bubble is a ::after pseudo-element with content: attr(data-tip): navy #002057 background, white 0.8rem bold text, 8px radius, 7px 12px padding, white-space: nowrap, positioned at bottom: calc(100% + 10px), horizontally centred with left: 50% and translateX(-50%).
- A small downward arrow is a ::before pseudo-element made from borders (5px transparent border with a navy top border).
- Hidden by default (opacity 0, shifted 6px down); on :hover and :focus-visible both fade in and slide up over 0.2s.
- pointer-events: none on the bubble so it never blocks the cursor.
- Demo: three white outlined buttons (Copy, Share, Save) in a row, each with a tooltip and a matching aria-label.

Return one HTML file with a <style> block.`,
    steps: [
      "Store the tooltip text in a data attribute and print it with content: attr(data-tip) in a pseudo-element.",
      "Position the bubble above the trigger with bottom: calc(100% + gap) and centre it with left: 50% plus translateX(-50%).",
      "Make the arrow from a zero-size element with transparent borders and one coloured border.",
      "Hide both with opacity: 0 and reveal them on :hover and :focus-visible so keyboard users see the tooltip too.",
      "Add an aria-label with the same text, because pseudo-element content is not reliably announced by screen readers.",
    ],
    tips: [
      "Flip it below the element by using top instead of bottom and border-bottom-color for the arrow.",
      "Keep tooltip text short. For longer help, use a popover or inline hint.",
      "Tooltips do not appear on touch screens without a tap, so never hide essential information in one.",
    ],
  },
  {
    slug: "skeleton-loader-component",
    name: "Skeleton Loader",
    tone: "light",
    tags: ["loading", "skeleton", "placeholder", "shimmer"],
    description:
      "A content placeholder with a moving shimmer, shown while real data loads. It mirrors the shape of a profile card so the layout does not jump when content arrives.",
    html: `<div class="skeleton-card" aria-busy="true" aria-label="Loading profile">
  <div class="sk avatar"></div>
  <div class="lines">
    <div class="sk line w-60"></div>
    <div class="sk line w-40"></div>
  </div>
  <div class="sk block"></div>
  <div class="sk line"></div>
  <div class="sk line w-80"></div>
</div>`,
    css: `${STAGE_LIGHT}

.skeleton-card {
  width: min(90vw, 360px);
  padding: 24px;
  display: grid;
  grid-template-columns: 56px 1fr;
  gap: 16px;
  align-items: center;
  border-radius: 16px;
  background: #fff;
  border: 1px solid #e8e9f0;
}

/* One shared shimmer for every placeholder shape */
.sk {
  border-radius: 8px;
  background: linear-gradient(90deg, #eceef4 25%, #f6f7fb 37%, #eceef4 63%);
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
}
@keyframes shimmer {
  0%   { background-position: 100% 50%; }
  100% { background-position: 0 50%; }
}

.avatar { width: 56px; height: 56px; border-radius: 50%; }
.lines { display: grid; gap: 10px; }
.line { height: 12px; }
.block { grid-column: 1 / -1; height: 140px; border-radius: 12px; }
.skeleton-card > .line { grid-column: 1 / -1; }

.w-40 { width: 40%; }
.w-60 { width: 60%; }
.w-80 { width: 80%; }

@media (prefers-reduced-motion: reduce) {
  .sk { animation: none; }
}`,
    prompt: `Create a skeleton loading placeholder for a profile card using only HTML and CSS.

Requirements:
- A white card (min(90vw, 360px) wide, 24px padding, 16px radius, 1px #e8e9f0 border) laid out with CSS grid: a 56px avatar column and a flexible column.
- Placeholders: a circular avatar, two short text lines beside it (60% and 40% wide), a 140px tall image block spanning the full width, and two more text lines (100% and 80%).
- One shared class "sk" provides the shimmer: a linear-gradient (#eceef4 -> #f6f7fb -> #eceef4), background-size 400% 100%, animated by moving background-position from 100% to 0 over 1.4s, infinite.
- Add aria-busy="true" and an aria-label on the card.
- Disable the animation under prefers-reduced-motion.

Return one HTML file with a <style> block.`,
    steps: [
      "Sketch the real component's layout with empty blocks: same sizes, same positions.",
      "Create one .sk class with a three-stop gradient that is lighter in the middle.",
      "Make the gradient four times wider than the element with background-size, then animate background-position so the light band sweeps across.",
      "Reuse .sk on every shape; only width, height and border-radius differ.",
      "Mark the container aria-busy='true' while loading and remove it when real content replaces the skeleton.",
    ],
    tips: [
      "Match the skeleton to the final layout as closely as possible to avoid layout shift (good for Core Web Vitals).",
      "In Next.js, put the skeleton in loading.js or a Suspense fallback.",
      "Use slightly darker greys (#2a3050 and #343b60) for a dark-mode skeleton.",
    ],
  },
  {
    slug: "toast-notification-component",
    name: "Toast Notification",
    tone: "light",
    tags: ["toast", "notification", "javascript", "feedback"],
    description:
      "A small notification that slides in from the corner, stays for a few seconds and dismisses itself. Includes success and error styles and a live region for screen readers.",
    html: `<div class="controls">
  <button class="btn" data-type="success" data-message="Changes saved successfully">Show success</button>
  <button class="btn outline" data-type="error" data-message="Something went wrong. Try again.">Show error</button>
</div>
<div class="toasts" id="toasts" role="status" aria-live="polite"></div>`,
    css: `${STAGE_LIGHT}

.controls { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; }
.btn {
  padding: 12px 22px;
  border-radius: 999px;
  border: 1.5px solid #2506ad;
  background: #2506ad;
  color: #fff;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}
.btn.outline { background: transparent; color: #2506ad; }

.toasts {
  position: fixed;
  right: 20px;
  bottom: 20px;
  display: grid;
  gap: 10px;
  width: min(90vw, 320px);
}

.toast {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 12px;
  background: #002057;
  color: #fff;
  font-size: 0.95rem;
  box-shadow: 0 16px 36px rgba(0, 32, 87, 0.3);
  animation: toast-in 0.35s cubic-bezier(0.2, 0.7, 0.2, 1);
}
.toast.leaving { animation: toast-out 0.3s ease forwards; }

.toast .dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; background: #34d399; }
.toast.error .dot { background: #f87171; }

@keyframes toast-in {
  from { opacity: 0; transform: translateY(16px) scale(0.96); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes toast-out {
  to { opacity: 0; transform: translateX(24px); }
}`,
    js: `var container = document.getElementById("toasts");

function showToast(message, type) {
  var toast = document.createElement("div");
  toast.className = "toast " + (type || "success");

  var dot = document.createElement("span");
  dot.className = "dot";
  var text = document.createElement("span");
  text.textContent = message; // textContent, never innerHTML, for user-provided text

  toast.appendChild(dot);
  toast.appendChild(text);
  container.appendChild(toast);

  setTimeout(function () {
    toast.classList.add("leaving");
    toast.addEventListener("animationend", function () { toast.remove(); });
  }, 3000);
}

document.querySelectorAll(".btn").forEach(function (button) {
  button.addEventListener("click", function () {
    showToast(button.dataset.message, button.dataset.type);
  });
});`,
    prompt: `Create a toast notification system with HTML, CSS and vanilla JavaScript (no libraries).

Requirements:
- A fixed container in the bottom-right corner (20px from the edges, max width 320px) with role="status" and aria-live="polite" so screen readers announce new toasts.
- A function showToast(message, type) that creates a toast element, appends it to the container, and removes it after 3 seconds.
- Toast style: navy #002057 background, white text, 12px radius, soft shadow, with a 10px status dot - green #34d399 for success, red #f87171 for error.
- Entry animation: fade in while sliding up 16px and scaling from 0.96 (0.35s). Exit animation: fade out while sliding right 24px (0.3s); remove the element on animationend.
- Set the message with textContent, not innerHTML, to avoid HTML injection.
- Demo: two buttons, "Show success" and "Show error", that read their message and type from data attributes and call showToast.

Return a single HTML file with <style> and <script> tags.`,
    steps: [
      "Create a fixed container in a corner and make it an ARIA live region so assistive technology announces each toast.",
      "Write a showToast function that builds the toast with createElement and textContent. Avoid innerHTML with dynamic text.",
      "Animate the toast in with a keyframe animation on the element itself; it runs automatically when the element is added.",
      "After a timeout, add a 'leaving' class that plays the exit animation, then remove the element when animationend fires.",
      "Stack multiple toasts with a grid gap on the container.",
    ],
    tips: [
      "Use role='alert' (assertive) only for urgent errors; 'status' is right for confirmations.",
      "Pause the dismiss timer while the toast is hovered so users can finish reading.",
      "Cap the number of visible toasts at three and queue the rest.",
    ],
  },
  {
    slug: "floating-label-input-component",
    name: "Floating Label Input",
    tone: "light",
    tags: ["form", "input", "label", "css"],
    description:
      "A text field whose label sits inside the input and floats up when the field is focused or filled. Pure CSS using the :placeholder-shown selector.",
    html: `<form class="form" onsubmit="return false">
  <div class="field">
    <input id="name" type="text" placeholder=" " autocomplete="name" />
    <label for="name">Full name</label>
  </div>
  <div class="field">
    <input id="email" type="email" placeholder=" " autocomplete="email" required />
    <label for="email">Email address</label>
  </div>
  <button type="submit">Continue</button>
</form>`,
    css: `${STAGE_LIGHT}

.form {
  width: min(90vw, 360px);
  padding: 28px;
  display: grid;
  gap: 18px;
  border-radius: 16px;
  background: #fff;
  border: 1px solid #e8e9f0;
}

.field { position: relative; }

.field input {
  width: 100%;
  padding: 22px 16px 8px;
  border: 1.5px solid #d5d9e6;
  border-radius: 12px;
  background: #fff;
  font: inherit;
  color: #002057;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.field label {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #8a8fa3;
  pointer-events: none;
  transition: top 0.2s ease, font-size 0.2s ease, color 0.2s ease;
}

/* Float the label when focused OR when the input has a value */
.field input:focus + label,
.field input:not(:placeholder-shown) + label {
  top: 14px;
  font-size: 0.75rem;
  color: #2506ad;
}

.field input:focus {
  border-color: #2506ad;
  box-shadow: 0 0 0 4px rgba(37, 6, 173, 0.12);
}

/* Show an error colour only after the user has typed something invalid */
.field input:not(:placeholder-shown):invalid { border-color: #dc2626; }
.field input:not(:placeholder-shown):invalid + label { color: #dc2626; }

.form button {
  padding: 14px;
  border: 0;
  border-radius: 999px;
  background: #2506ad;
  color: #fff;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}
.form button:hover { background: #1a047e; }`,
    prompt: `Create floating-label form inputs using only HTML and CSS.

Requirements:
- A small white form card with two fields (Full name, Email address) and a full-width indigo pill "Continue" button.
- Each field is a relatively positioned wrapper containing an <input> followed by its <label> (the label must come after the input in the HTML). Give each input placeholder=" " (a single space).
- Input: 22px top padding and 8px bottom padding to leave room for the floated label, 1.5px #d5d9e6 border, 12px radius, no default outline.
- Label: absolutely positioned, vertically centred inside the input, grey, pointer-events: none.
- When the input is focused OR not showing its placeholder (input:focus + label, input:not(:placeholder-shown) + label), move the label to top: 14px, shrink it to 0.75rem and colour it indigo #2506ad, with a 0.2s transition.
- Focus state on the input: indigo border and a 4px translucent indigo ring.
- Show a red border and label only when the field has content and is :invalid.

Return one HTML file with a <style> block.`,
    steps: [
      "Put the label after the input in the HTML so you can target it with the adjacent sibling selector (+).",
      "Give the input a placeholder containing a single space. This makes :placeholder-shown true only while the field is empty.",
      "Position the label over the input and add extra top padding to the input for the floated position.",
      "Float the label on two conditions: the input is focused, or :not(:placeholder-shown) (it has a value).",
      "Replace the default outline with a clear border colour and focus ring; never remove focus styling without a replacement.",
      "Combine :not(:placeholder-shown) with :invalid so errors appear only after the user has typed.",
    ],
    tips: [
      "Keep a real label element; placeholder text alone is not an accessible label.",
      "Use autocomplete attributes so browsers can fill the form.",
      "For server-side errors, add an aria-describedby message below the field.",
    ],
  },
  {
    slug: "typewriter-text-component",
    name: "Typewriter Text",
    tone: "dark",
    tags: ["text", "animation", "javascript", "hero"],
    description:
      "Text that types itself out, pauses, deletes and moves to the next phrase, with a blinking cursor. A small vanilla JavaScript loop you can drop into any hero section.",
    html: `<h1 class="typed">
  I build <span id="typed" class="words"></span><span class="cursor" aria-hidden="true">|</span>
</h1>`,
    css: `${STAGE_DARK}

.typed {
  margin: 0;
  padding: 0 24px;
  color: #fff;
  font-size: clamp(1.6rem, 5vw, 3.2rem);
  font-weight: 800;
  text-align: center;
}
.words { color: #ff7b00; }

.cursor {
  margin-left: 2px;
  font-weight: 400;
  color: #ff7b00;
  animation: blink 1s steps(1) infinite;
}
@keyframes blink { 50% { opacity: 0; } }`,
    js: `var phrases = ["web apps.", "mobile apps.", "REST APIs.", "AI features."];
var el = document.getElementById("typed");
var phraseIndex = 0;
var charIndex = 0;
var deleting = false;

function tick() {
  var phrase = phrases[phraseIndex];
  charIndex += deleting ? -1 : 1;
  el.textContent = phrase.slice(0, charIndex);

  var delay = deleting ? 40 : 90;

  if (!deleting && charIndex === phrase.length) {
    deleting = true;
    delay = 1600; // pause on the full phrase
  } else if (deleting && charIndex === 0) {
    deleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    delay = 300;
  }
  setTimeout(tick, delay);
}

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  el.textContent = phrases[0]; // show one phrase, no animation
} else {
  tick();
}`,
    prompt: `Create a typewriter text effect with HTML, CSS and vanilla JavaScript (no libraries).

Requirements:
- A large white heading on a dark page that reads "I build " followed by a rotating phrase in orange (#ff7b00) and a blinking "|" cursor.
- Phrases: "web apps.", "mobile apps.", "REST APIs.", "AI features."
- JavaScript loop using setTimeout: type one character at a time (90ms per character); when the phrase is complete, pause 1600ms; then delete one character at a time (40ms); when empty, pause 300ms and move to the next phrase, looping forever.
- Track state with phraseIndex, charIndex and a deleting flag; render with textContent and slice.
- The cursor blinks with a CSS animation using steps(1) and has aria-hidden="true".
- If the user prefers reduced motion, show the first phrase statically and do not animate.

Return a single HTML file with <style> and <script> tags.`,
    steps: [
      "Keep three pieces of state: which phrase, how many characters are shown, and whether you are typing or deleting.",
      "On each tick, add or remove one character and render phrase.slice(0, charIndex) with textContent.",
      "Choose the next delay based on the state: fast while deleting, slower while typing, long when a phrase is complete.",
      "Flip the deleting flag at the ends, and advance to the next phrase when the text is empty.",
      "Blink the cursor with a CSS keyframe using steps(1) so it switches on and off instead of fading.",
      "Respect prefers-reduced-motion by showing static text.",
    ],
    tips: [
      "In React, hold the state in useState and schedule ticks inside the setTimeout callback, not directly in the effect body.",
      "Put the full sentence in an aria-label on the heading so screen readers read it once instead of letter by letter.",
      "Keep phrases similar in length to reduce layout shift on the line.",
    ],
  },
  {
    slug: "command-palette-component",
    name: "Command Palette (Cmd+K)",
    tone: "dark",
    tags: ["search", "modal", "command palette", "keyboard", "accessible"],
    description:
      "A spotlight command palette popup with live filtering, keyboard arrow navigation, shortcut hints and ARIA attributes. A standard control for modern SaaS tools.",
    html: `<div class="cmd-wrap">
  <button class="trigger-btn" id="openCmd" aria-haspopup="dialog">
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
    <span>Search commands...</span>
    <kbd>Cmd K</kbd>
  </button>

  <div class="palette-backdrop" id="paletteBackdrop">
    <div class="palette-box" role="dialog" aria-modal="true" aria-label="Command Menu">
      <div class="search-row">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <input type="text" id="cmdInput" placeholder="Type a command or keyword..." autocomplete="off" />
        <span class="esc-badge" id="closeCmd">ESC</span>
      </div>
      <div class="results-list" id="resultsList" role="listbox">
        <div class="group-title">Suggestions</div>
        <div class="cmd-item active" role="option" aria-selected="true" data-label="Create New Project">
          <span class="item-icon">&#10010;</span>
          <span class="item-text">Create New Project</span>
          <kbd>&crarr;</kbd>
        </div>
        <div class="cmd-item" role="option" aria-selected="false" data-label="Search Documentation">
          <span class="item-icon">&#9776;</span>
          <span class="item-text">Search Documentation</span>
          <kbd>D</kbd>
        </div>
        <div class="group-title">Navigation</div>
        <div class="cmd-item" role="option" aria-selected="false" data-label="Go to Analytics Dashboard">
          <span class="item-icon">&#9650;</span>
          <span class="item-text">Go to Analytics Dashboard</span>
          <kbd>G A</kbd>
        </div>
        <div class="cmd-item" role="option" aria-selected="false" data-label="Manage Team Members">
          <span class="item-icon">&#9787;</span>
          <span class="item-text">Manage Team Members</span>
          <kbd>G T</kbd>
        </div>
        <div class="group-title">Account</div>
        <div class="cmd-item" role="option" aria-selected="false" data-label="Copy API Key">
          <span class="item-icon">&#9919;</span>
          <span class="item-text">Copy API Key</span>
          <kbd>C</kbd>
        </div>
      </div>
      <div class="palette-footer">
        <span>Use <kbd>&uarr;</kbd> <kbd>&darr;</kbd> to navigate</span>
        <span id="statusMessage">Press Enter to select</span>
      </div>
    </div>
  </div>
</div>`,
    css: `${STAGE_DARK}

.cmd-wrap {
  width: 100%;
  display: flex;
  justify-content: center;
}

.trigger-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.3);
}

.trigger-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.trigger-btn kbd {
  background: rgba(255, 255, 255, 0.14);
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-family: monospace;
  font-weight: 700;
  color: #94a3b8;
}

.palette-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(6, 8, 22, 0.75);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: grid;
  place-items: start center;
  padding-top: 14vh;
  z-index: 100;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}

.palette-backdrop.open {
  opacity: 1;
  pointer-events: auto;
}

.palette-box {
  width: min(92vw, 560px);
  border-radius: 20px;
  background: #0f1424;
  border: 1px solid rgba(255, 255, 255, 0.16);
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.65);
  overflow: hidden;
  transform: translateY(-8px) scale(0.98);
  transition: transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.palette-backdrop.open .palette-box {
  transform: translateY(0) scale(1);
}

.search-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: #94a3b8;
}

.search-row input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  font-family: inherit;
  font-size: 1.05rem;
}

.search-row input::placeholder {
  color: #64748b;
}

.esc-badge {
  font-size: 0.7rem;
  font-weight: 700;
  color: #64748b;
  background: rgba(255, 255, 255, 0.08);
  padding: 3px 6px;
  border-radius: 4px;
  cursor: pointer;
}

.results-list {
  max-height: 320px;
  overflow-y: auto;
  padding: 10px;
}

.group-title {
  padding: 8px 12px 4px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #64748b;
}

.cmd-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 14px;
  border-radius: 12px;
  color: #cbd5e1;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

.cmd-item.active {
  background: #2506ad;
  color: #fff;
}

.item-icon {
  font-size: 1rem;
  opacity: 0.8;
}

.item-text {
  flex: 1;
}

.cmd-item kbd {
  background: rgba(255, 255, 255, 0.12);
  padding: 2px 7px;
  border-radius: 5px;
  font-size: 0.75rem;
  font-family: monospace;
  color: inherit;
}

.palette-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: #0a0d18;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  color: #64748b;
  font-size: 0.8rem;
}

.palette-footer kbd {
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 5px;
  border-radius: 4px;
  color: #cbd5e1;
}`,
    js: `var openBtn = document.getElementById("openCmd");
var backdrop = document.getElementById("paletteBackdrop");
var closeBtn = document.getElementById("closeCmd");
var input = document.getElementById("cmdInput");
var list = document.getElementById("resultsList");
var statusMsg = document.getElementById("statusMessage");

function openPalette() {
  backdrop.classList.add("open");
  input.value = "";
  filterItems("");
  input.focus();
}

function closePalette() {
  backdrop.classList.remove("open");
  openBtn.focus();
}

openBtn.addEventListener("click", openPalette);
closeBtn.addEventListener("click", closePalette);
backdrop.addEventListener("click", function(e) {
  if (e.target === backdrop) closePalette();
});

window.addEventListener("keydown", function(e) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    if (backdrop.classList.contains("open")) closePalette();
    else openPalette();
  }
  if (e.key === "Escape" && backdrop.classList.contains("open")) {
    closePalette();
  }
});

function getVisibleItems() {
  return Array.prototype.slice.call(list.querySelectorAll(".cmd-item")).filter(function(item) {
    return item.style.display !== "none";
  });
}

function setActive(items, index) {
  items.forEach(function(item, i) {
    var isCurrent = i === index;
    item.classList.toggle("active", isCurrent);
    item.setAttribute("aria-selected", isCurrent);
    if (isCurrent) {
      item.scrollIntoView({ block: "nearest" });
      statusMsg.textContent = item.dataset.label;
    }
  });
}

input.addEventListener("keydown", function(e) {
  var items = getVisibleItems();
  if (!items.length) return;
  var currentIndex = items.findIndex(function(it) { return it.classList.contains("active"); });
  if (currentIndex === -1) currentIndex = 0;

  if (e.key === "ArrowDown") {
    e.preventDefault();
    setActive(items, (currentIndex + 1) % items.length);
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    setActive(items, (currentIndex - 1 + items.length) % items.length);
  } else if (e.key === "Enter") {
    e.preventDefault();
    var active = items[currentIndex];
    if (active) {
      statusMsg.textContent = "Triggered: " + active.dataset.label;
      setTimeout(closePalette, 300);
    }
  }
});

function filterItems(query) {
  var q = query.toLowerCase().trim();
  var items = list.querySelectorAll(".cmd-item");
  items.forEach(function(item) {
    var match = item.dataset.label.toLowerCase().indexOf(q) !== -1;
    item.style.display = match ? "flex" : "none";
  });
  var visible = getVisibleItems();
  if (visible.length) setActive(visible, 0);
}

input.addEventListener("input", function() {
  filterItems(input.value);
});

list.addEventListener("click", function(e) {
  var item = e.target.closest(".cmd-item");
  if (!item) return;
  statusMsg.textContent = "Triggered: " + item.dataset.label;
  setTimeout(closePalette, 300);
});`,
    prompt: `Create a keyboard-first command palette (Cmd+K) modal with HTML, CSS and vanilla JavaScript.

Requirements:
- A trigger button with search icon and keyboard shortcut pill "Cmd K".
- A fixed backdrop overlay with blur (backdrop-filter) and a centered dialog (max-width 560px, rounded corners, dark theme #0f1424).
- A search bar with search icon, live text input, and an ESC badge.
- A categorized results list with grouped titles (Suggestions, Navigation, Account) and option cards with icons, labels, and shortcut keys.
- Real-time search filtering as the user types into the input.
- Arrow keys (Up/Down) cycle the active item with auto-scrolling into view. Enter triggers the selected action.
- Global shortcut listener for Cmd+K / Ctrl+K and Escape key to toggle the palette open/closed.
- Accessible role="dialog", aria-modal="true", and role="option".

Return one HTML file with <style> and <script> tags.`,
    steps: [
      "Create a fixed backdrop with backdrop-filter: blur(8px) and position the command dialog near the top of the viewport.",
      "Listen for Cmd+K (Mac) or Ctrl+K (Windows/Linux) on the window to toggle open and close.",
      "Filter the items list by matching the user's input string against each item's text label.",
      "Handle Up and Down arrow keys to update the highlighted active index and scroll it into view.",
      "Handle Enter key and click to execute the chosen command and close the dialog.",
      "Restore focus to the trigger button when closing.",
    ],
    tips: [
      "In Next.js or React, implement this with an open/close boolean state and an effect hook listening to keydown.",
      "Integrate with your router to navigate to pages instantly upon selection.",
      "Add recent searches using localStorage for quick re-use.",
    ],
  },
  {
    slug: "magnetic-button-component",
    name: "Magnetic Button",
    tone: "dark",
    tags: ["button", "magnetic", "cursor", "hover", "interactive"],
    description:
      "A button that magnetically shifts towards the cursor when hovered, featuring smooth spring physics and a subtle glowing specular aura.",
    html: `<div class="mag-stage">
  <button class="mag-btn" id="magBtn">
    <span class="mag-glow"></span>
    <span class="mag-text">Explore work &rarr;</span>
  </button>
</div>`,
    css: `${STAGE_DARK}

.mag-stage {
  padding: 60px;
}

.mag-btn {
  --x: 0px;
  --y: 0px;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: #0f1424;
  border: 1.5px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  font-family: inherit;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  outline: none;
  transform: translate(var(--x), var(--y));
  transition: transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1), border-color 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.mag-btn:hover {
  border-color: #ff7b00;
  box-shadow: 0 25px 50px rgba(37, 6, 173, 0.4);
}

.mag-glow {
  position: absolute;
  inset: -10px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 123, 0, 0.35) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.mag-btn:hover .mag-glow {
  opacity: 1;
}

.mag-text {
  position: relative;
  z-index: 1;
  transition: transform 0.15s ease-out;
}

.mag-btn:focus-visible {
  outline: 3px solid #ff7b00;
  outline-offset: 6px;
}`,
    js: `var btn = document.getElementById("magBtn");
var text = btn.querySelector(".mag-text");
var BOUND = 35; // Maximum pixel pull

btn.addEventListener("pointermove", function(e) {
  var rect = btn.getBoundingClientRect();
  var cx = rect.left + rect.width / 2;
  var cy = rect.top + rect.height / 2;
  var dx = (e.clientX - cx) * 0.45;
  var dy = (e.clientY - cy) * 0.45;

  dx = Math.max(-BOUND, Math.min(BOUND, dx));
  dy = Math.max(-BOUND, Math.min(BOUND, dy));

  btn.style.setProperty("--x", dx + "px");
  btn.style.setProperty("--y", dy + "px");
  text.style.transform = "translate(" + (dx * 0.3) + "px, " + (dy * 0.3) + "px)";
});

btn.addEventListener("pointerleave", function() {
  btn.style.setProperty("--x", "0px");
  btn.style.setProperty("--y", "0px");
  text.style.transform = "translate(0px, 0px)";
});`,
    prompt: `Create a magnetic cursor-attracting circular button using HTML, CSS and vanilla JavaScript.

Requirements:
- A circular button (180px by 180px) on a dark page.
- Track pointer movement within the button's bounding box using getBoundingClientRect.
- Offset the button's translation towards the cursor by a fraction of the distance, clamped to maximum displacement (+/- 35px).
- Also slightly offset the inner text in the same direction for a layered parallax effect.
- An animated radial glow aura appears behind the button on hover.
- On pointerleave, smoothly spring back to original (0, 0) position using a cubic-bezier transition.
- Accessible focus-visible state.

Return one HTML file with <style> and <script> tags.`,
    steps: [
      "Find the center point of the button element using rect.left + width / 2 and rect.top + height / 2.",
      "Calculate displacement from center to cursor: dx = clientX - centerX, dy = clientY - centerY.",
      "Scale the displacement down and clamp it so the button moves naturally without leaping away.",
      "Write the offset to CSS variables --x and --y on the button.",
      "Reset the translation on pointerleave so the button springs back to center.",
    ],
    tips: [
      "Add window.matchMedia('(hover: hover)') to disable magnetic tracking on mobile touch devices.",
      "Use this for hero CTA buttons to create an inviting, playful interaction.",
      "Nesting an inner label that moves slightly further creates an additional depth layer.",
    ],
  },
  {
    slug: "circular-gauge-component",
    name: "Circular Progress Gauge",
    tone: "light",
    tags: ["gauge", "progress", "svg", "dashboard", "animation"],
    description:
      "A circular SVG progress meter with a gradient stroke, smooth stroke-dashoffset animation, live percentage counter, and interactive adjustment controls.",
    html: `<div class="gauge-card">
  <h3>Server Capacity</h3>
  <div class="gauge-wrap">
    <svg class="gauge-svg" viewBox="0 0 120 120" width="180" height="180">
      <defs>
        <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#2506ad" />
          <stop offset="100%" stop-color="#ff7b00" />
        </linearGradient>
      </defs>
      <circle class="gauge-track" cx="60" cy="60" r="50" />
      <circle class="gauge-bar" id="gaugeBar" cx="60" cy="60" r="50" />
    </svg>
    <div class="gauge-center">
      <strong id="gaugeValue">74%</strong>
      <small>Optimal</small>
    </div>
  </div>
  <div class="gauge-controls">
    <button class="gauge-btn" id="btnMinus" aria-label="Decrease percentage">-10%</button>
    <button class="gauge-btn" id="btnPlus" aria-label="Increase percentage">+10%</button>
  </div>
</div>`,
    css: `${STAGE_LIGHT}

.gauge-card {
  width: min(90vw, 320px);
  padding: 32px 24px;
  border-radius: 20px;
  background: #fff;
  border: 1px solid #e8e9f0;
  box-shadow: 0 16px 36px rgba(0, 32, 87, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.gauge-card h3 {
  margin: 0 0 20px;
  font-size: 1.15rem;
  color: #002057;
}

.gauge-wrap {
  position: relative;
  width: 180px;
  height: 180px;
  display: grid;
  place-items: center;
}

.gauge-svg {
  transform: rotate(-90deg);
}

.gauge-track {
  fill: none;
  stroke: #e9ebf4;
  stroke-width: 10;
}

.gauge-bar {
  fill: none;
  stroke: url(#gaugeGrad);
  stroke-width: 10;
  stroke-linecap: round;
  stroke-dasharray: 314.16;
  stroke-dashoffset: 81.68;
  transition: stroke-dashoffset 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.gauge-center {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.gauge-center strong {
  font-size: 2.2rem;
  font-weight: 800;
  color: #002057;
  line-height: 1;
}

.gauge-center small {
  margin-top: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #10b981;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.gauge-controls {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.gauge-btn {
  padding: 8px 18px;
  border-radius: 999px;
  border: 1px solid #d5d9e6;
  background: #f8fafc;
  color: #002057;
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.gauge-btn:hover {
  background: #2506ad;
  border-color: #2506ad;
  color: #fff;
}`,
    js: `var bar = document.getElementById("gaugeBar");
var valLabel = document.getElementById("gaugeValue");
var btnMinus = document.getElementById("btnMinus");
var btnPlus = document.getElementById("btnPlus");

var radius = 50;
var circumference = 2 * Math.PI * radius; // 314.159...
var percent = 74;

function updateGauge(newPercent) {
  percent = Math.max(0, Math.min(100, newPercent));
  var offset = circumference - (percent / 100) * circumference;
  bar.style.strokeDashoffset = offset;
  valLabel.textContent = Math.round(percent) + "%";
}

btnMinus.addEventListener("click", function() { updateGauge(percent - 10); });
btnPlus.addEventListener("click", function() { updateGauge(percent + 10); });
updateGauge(percent);`,
    prompt: `Create a circular progress gauge card with SVG, CSS and vanilla JavaScript.

Requirements:
- A white dashboard card (max-width 320px) with header, centered circular gauge, and +/- control buttons.
- An SVG element with viewBox="0 0 120 120", rotated -90deg so the gauge starts at the top (12 o'clock).
- An SVG linear-gradient stroke (#2506ad to #ff7b00) applied to the foreground circle.
- Calculate circumference = 2 * PI * r (approx 314.16 for r=50). Set stroke-dasharray to the circumference.
- JavaScript updates stroke-dashoffset = circumference - (percent / 100) * circumference with a smooth 0.6s cubic-bezier transition.
- Centered percentage readout in bold navy text with status chip.
- Interactive +10% and -10% buttons clamped between 0% and 100%.

Return one HTML file with a <style> block and <script> tag.`,
    steps: [
      "Draw two circles inside an SVG with identical radius and center (cx=60, cy=60, r=50).",
      "Calculate the circumference with 2 * Math.PI * radius (314.16px).",
      "Rotate the SVG by -90 degrees so progress begins at the top center.",
      "Set stroke-dasharray to the total circumference and update stroke-dashoffset to show the fraction.",
      "Add a CSS transition on stroke-dashoffset for animated changes.",
    ],
    tips: [
      "Use stroke-linecap: round for rounded bar ends.",
      "Colour code thresholds: change the gradient or text to warning red above 90%.",
      "Connect to an IntersectionObserver to animate from 0% when scrolled into view.",
    ],
  },
  {
    slug: "code-snippet-box-component",
    name: "Code Snippet Box",
    tone: "dark",
    tags: ["code", "syntax", "snippet", "copy", "developer"],
    description:
      "A developer code block with terminal dots, language tag, line numbers, syntax highlighting colours, and one-click animated copy confirmation.",
    html: `<div class="code-box" id="codeBox">
  <div class="code-header">
    <div class="code-dots"><i></i><i></i><i></i></div>
    <span class="code-lang">TypeScript</span>
    <button class="copy-code-btn" id="copyCodeBtn" aria-label="Copy code to clipboard">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
      <span class="copy-label">Copy</span>
    </button>
  </div>
  <pre class="code-pre"><code><span class="c-line"><span class="c-ln">1</span><span class="c-k">import</span> { createClient } <span class="c-k">from</span> <span class="c-s">"@supabase/supabase-js"</span>;</span>
<span class="c-line"><span class="c-ln">2</span></span>
<span class="c-line"><span class="c-ln">3</span><span class="c-k">const</span> supabase = <span class="c-f">createClient</span>(</span>
<span class="c-line"><span class="c-ln">4</span>  process.env.<span class="c-p">SUPABASE_URL</span>!,</span>
<span class="c-line"><span class="c-ln">5</span>  process.env.<span class="c-p">SUPABASE_ANON_KEY</span>!</span>
<span class="c-line"><span class="c-ln">6</span>);</span>
<span class="c-line"><span class="c-ln">7</span></span>
<span class="c-line"><span class="c-ln">8</span><span class="c-c">// Fetch realtime records</span></span>
<span class="c-line"><span class="c-ln">9</span><span class="c-k">const</span> { data, error } = <span class="c-k">await</span> supabase</span>
<span class="c-line"><span class="c-ln">10</span>  .<span class="c-f">from</span>(<span class="c-s">"templates"</span>)</span>
<span class="c-line"><span class="c-ln">11</span>  .<span class="c-f">select</span>(<span class="c-s">"*"</span>);</span></code></pre>
</div>`,
    css: `${STAGE_DARK}

.code-box {
  width: min(92vw, 540px);
  border-radius: 16px;
  background: #090d16;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6);
  overflow: hidden;
  font-family: "Courier New", Courier, monospace;
}

.code-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px;
  background: #111624;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.code-dots {
  display: flex;
  gap: 6px;
}
.code-dots i {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: block;
}
.code-dots i:nth-child(1) { background: #ef4444; }
.code-dots i:nth-child(2) { background: #f59e0b; }
.code-dots i:nth-child(3) { background: #10b981; }

.code-lang {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #64748b;
  font-family: system-ui, sans-serif;
}

.copy-code-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.06);
  color: #cbd5e1;
  font-family: system-ui, sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.copy-code-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}

.code-pre {
  margin: 0;
  padding: 18px 20px;
  overflow-x: auto;
  font-size: 0.85rem;
  line-height: 1.6;
}

.c-line {
  display: block;
}

.c-ln {
  display: inline-block;
  width: 28px;
  color: #475569;
  user-select: none;
}

.c-k { color: #f43f5e; font-weight: 700; }
.c-s { color: #a3e635; }
.c-f { color: #38bdf8; }
.c-p { color: #fb923c; }
.c-c { color: #64748b; font-style: italic; }

.copy-code-btn.copied {
  background: #10b981;
  border-color: #10b981;
  color: #fff;
}`,
    js: `var btn = document.getElementById("copyCodeBtn");
var pre = document.querySelector(".code-pre");

btn.addEventListener("click", function() {
  // Extract text excluding line numbers
  var lines = Array.prototype.slice.call(pre.querySelectorAll(".c-line"));
  var codeText = lines.map(function(line) {
    var clone = line.cloneNode(true);
    var ln = clone.querySelector(".c-ln");
    if (ln) ln.remove();
    return clone.textContent;
  }).join("\\n");

  navigator.clipboard.writeText(codeText).then(function() {
    var label = btn.querySelector(".copy-label");
    btn.classList.add("copied");
    label.textContent = "Copied!";
    setTimeout(function() {
      btn.classList.remove("copied");
      label.textContent = "Copy";
    }, 2000);
  });
});`,
    prompt: `Create a dark terminal-style code snippet block with syntax highlighting and a 1-click copy button using HTML, CSS and vanilla JavaScript.

Requirements:
- A dark card (#090d16) with 16px radius, soft drop shadow and 1px border.
- Header with red, amber, green window dots, uppercase language tag ("TypeScript"), and a "Copy" button.
- Preformatted code display with line numbers (.c-ln with user-select: none) and syntax colors for keywords, strings, functions, and comments.
- JavaScript 1-click copy: reads code text excluding line numbers using navigator.clipboard.writeText.
- Visual feedback on copy: button turns green and label switches to "Copied!" for 2 seconds.

Return one HTML file with <style> and <script> tags.`,
    steps: [
      "Lay out a dark container with a top chrome bar containing window dots and a copy button.",
      "Wrap each line in a span with a line-number child that has user-select: none so line numbers are not selected during manual copy.",
      "Highlight code tokens with semantic span classes for keywords, strings, and functions.",
      "Use navigator.clipboard.writeText to copy the code text to the clipboard.",
      "Temporarily change the copy button's appearance to provide clear user feedback.",
    ],
    tips: [
      "Use user-select: none on line numbers so visitors copying text manually get only code.",
      "Keep horizontal overflow: auto on the pre tag so long lines scroll without breaking card layout.",
      "Support keyboard copy with accessible aria-label on the button.",
    ],
  },
  {
    slug: "multi-step-form-stepper",
    name: "Interactive Form Stepper",
    tone: "dark",
    tags: ["stepper", "form", "wizard", "progress", "navigation"],
    description:
      "A sleek multi-step wizard stepper with active state rings, connecting progress fill, step labels, and animated Next/Back buttons.",
    html: `<div class="stepper-card">
  <div class="stepper-header">
    <div class="stepper-track">
      <div class="stepper-fill" id="stepFill"></div>
    </div>
    <div class="step-nodes">
      <div class="step-node is-active" data-step="1">
        <span class="step-circle"><span class="step-num">1</span></span>
        <span class="step-label">Account</span>
      </div>
      <div class="step-node" data-step="2">
        <span class="step-circle"><span class="step-num">2</span></span>
        <span class="step-label">Profile</span>
      </div>
      <div class="step-node" data-step="3">
        <span class="step-circle"><span class="step-num">3</span></span>
        <span class="step-label">Security</span>
      </div>
      <div class="step-node" data-step="4">
        <span class="step-circle"><span class="step-num">4</span></span>
        <span class="step-label">Confirm</span>
      </div>
    </div>
  </div>

  <div class="stepper-body">
    <div class="step-panel is-active" id="panel1">
      <h4>Create your account</h4>
      <p>Enter your primary work email and choose a secure password.</p>
      <input type="email" placeholder="alex@company.com" class="step-input" />
    </div>
    <div class="step-panel" id="panel2">
      <h4>Personal profile</h4>
      <p>Tell us your job title and how you plan to use the platform.</p>
      <input type="text" placeholder="Full name / Display name" class="step-input" />
    </div>
    <div class="step-panel" id="panel3">
      <h4>Security preferences</h4>
      <p>Configure two-factor authentication and alert settings.</p>
      <input type="text" placeholder="Mobile phone for SMS 2FA" class="step-input" />
    </div>
    <div class="step-panel" id="panel4">
      <h4>All set!</h4>
      <p>Review details and launch your workspace immediately.</p>
      <div class="step-summary">Ready to submit workspace setup.</div>
    </div>
  </div>

  <div class="stepper-footer">
    <button class="step-btn step-prev" id="prevBtn" disabled>Back</button>
    <button class="step-btn step-next" id="nextBtn">Continue &rarr;</button>
  </div>
</div>`,
    css: `${STAGE_DARK}

.stepper-card {
  width: min(92vw, 560px);
  background: #0d1222;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.55);
}

.stepper-header {
  position: relative;
  margin-bottom: 32px;
}

.stepper-track {
  position: absolute;
  top: 18px;
  left: 24px;
  right: 24px;
  height: 3px;
  background: rgba(255, 255, 255, 0.1);
  z-index: 1;
}

.stepper-fill {
  width: 0%;
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #a855f7);
  transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.step-nodes {
  position: relative;
  display: flex;
  justify-content: space-between;
  z-index: 2;
}

.step-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.step-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #0d1222;
  border: 2px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  color: #94a3b8;
  transition: all 0.3s ease;
}

.step-label {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  transition: color 0.3s ease;
}

.step-node.is-active .step-circle {
  border-color: #a855f7;
  background: #a855f7;
  color: #ffffff;
  box-shadow: 0 0 16px rgba(168, 85, 247, 0.5);
}

.step-node.is-active .step-label {
  color: #f1f5f9;
}

.step-node.is-done .step-circle {
  border-color: #6366f1;
  background: #6366f1;
  color: #ffffff;
}

.stepper-body {
  min-height: 140px;
  padding: 16px 0 24px;
}

.step-panel {
  display: none;
  animation: fadeIn 0.3s ease;
}

.step-panel.is-active {
  display: block;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

.step-panel h4 {
  font-size: 18px;
  color: #ffffff;
  margin: 0 0 6px;
}

.step-panel p {
  font-size: 14px;
  color: #94a3b8;
  margin: 0 0 16px;
}

.step-input {
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  color: #ffffff;
  font-size: 14px;
  box-sizing: border-box;
}

.step-input:focus {
  outline: none;
  border-color: #a855f7;
}

.step-summary {
  padding: 14px 18px;
  background: rgba(99, 102, 241, 0.12);
  border: 1px dashed rgba(99, 102, 241, 0.4);
  border-radius: 10px;
  color: #c7d2fe;
  font-size: 13.5px;
}

.stepper-footer {
  display: flex;
  justify-content: space-between;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.step-btn {
  padding: 10px 22px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
}

.step-prev {
  background: rgba(255, 255, 255, 0.07);
  color: #cbd5e1;
}

.step-prev:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.14);
}

.step-prev:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.step-next {
  background: linear-gradient(135deg, #6366f1, #a855f7);
  color: #ffffff;
  box-shadow: 0 6px 18px rgba(168, 85, 247, 0.35);
}

.step-next:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 22px rgba(168, 85, 247, 0.45);
}`,
    js: `var currentStep = 1;
var totalSteps = 4;
var prevBtn = document.getElementById("prevBtn");
var nextBtn = document.getElementById("nextBtn");
var stepFill = document.getElementById("stepFill");
var nodes = document.querySelectorAll(".step-node");

function updateStepper() {
  nodes.forEach(function(node) {
    var step = parseInt(node.getAttribute("data-step"), 10);
    node.classList.remove("is-active", "is-done");
    if (step === currentStep) {
      node.classList.add("is-active");
    } else if (step < currentStep) {
      node.classList.add("is-done");
    }
  });

  for (var i = 1; i <= totalSteps; i++) {
    var panel = document.getElementById("panel" + i);
    if (panel) {
      panel.classList.toggle("is-active", i === currentStep);
    }
  }

  var progressPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;
  stepFill.style.width = progressPercent + "%";

  prevBtn.disabled = currentStep === 1;
  if (currentStep === totalSteps) {
    nextBtn.textContent = "Finish ✓";
  } else {
    nextBtn.innerHTML = "Continue &rarr;";
  }
}

nextBtn.addEventListener("click", function() {
  if (currentStep < totalSteps) {
    currentStep++;
    updateStepper();
  } else {
    alert("Onboarding complete! Redirecting to dashboard...");
  }
});

prevBtn.addEventListener("click", function() {
  if (currentStep > 1) {
    currentStep--;
    updateStepper();
  }
});

nodes.forEach(function(node) {
  node.addEventListener("click", function() {
    var step = parseInt(node.getAttribute("data-step"), 10);
    if (step <= currentStep + 1) {
      currentStep = step;
      updateStepper();
    }
  });
});`,
    prompt: `Create an interactive multi-step wizard stepper using HTML, CSS and vanilla JavaScript.

Requirements:
- A modern dark card container with 20px radius and soft shadow.
- Header showing 4 circular numbered steps connected by a horizontal progress bar that fills dynamically.
- Steps transition through states: upcoming, active (purple glow), and completed (checked/solid blue).
- Body section that swaps visible panels with a subtle fade-and-slide animation.
- Footer with Back and Continue buttons; Back is disabled on step 1, Continue changes to 'Finish' on the final step.
- Clicking any previous step node allows jumping back.

Return one HTML file with <style> and <script> tags.`,
    steps: [
      "Create the step progress header with an absolute line track and a dynamically sized fill bar.",
      "Position step circles above the track with z-index and flexbox space-between.",
      "Toggle is-active and is-done classes based on the current step integer.",
      "Calculate the progress fill percentage: ((current - 1) / (total - 1)) * 100.",
      "Display the corresponding step panel while hiding all others.",
    ],
    tips: [
      "Use CSS transitions on the progress fill width to make navigation feel continuous and smooth.",
      "Add form validation on each panel before advancing to the next step in production forms.",
      "Include keyboard Enter key listener to advance steps conveniently.",
    ],
  },
  {
    slug: "stat-metric-counter-card",
    name: "Animated Metric KPI Card",
    tone: "dark",
    tags: ["metric", "card", "kpi", "dashboard", "analytics", "counter"],
    description:
      "A high-contrast dark dashboard metric card featuring real-time counter animation, positive trend badge, sparkline SVG, and subtle glass reflection.",
    html: `<div class="kpi-card">
  <div class="kpi-header">
    <div class="kpi-title-wrap">
      <span class="kpi-label">Monthly Recurring Revenue</span>
      <span class="kpi-live-dot" title="Live streaming data"></span>
    </div>
    <span class="kpi-badge kpi-badge-up">+28.4%</span>
  </div>

  <div class="kpi-value-row">
    <span class="kpi-currency">$</span>
    <span class="kpi-number" id="kpiCounter">0</span>
  </div>

  <div class="kpi-chart">
    <svg viewBox="0 0 280 44" fill="none" class="kpi-svg">
      <defs>
        <linearGradient id="kpiGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#10b981" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#10b981" stop-opacity="0.0"/>
        </linearGradient>
      </defs>
      <path d="M0 38 Q 45 32, 70 26 T 140 18 T 210 10 T 280 4 L 280 44 L 0 44 Z" fill="url(#kpiGrad)"/>
      <path d="M0 38 Q 45 32, 70 26 T 140 18 T 210 10 T 280 4" stroke="#10b981" stroke-width="2.5" stroke-linecap="round"/>
    </svg>
  </div>

  <div class="kpi-footer">
    <span class="kpi-sub">vs. previous 30 days ($115,480)</span>
    <a href="#" class="kpi-link">Report &rarr;</a>
  </div>
</div>`,
    css: `${STAGE_DARK}

.kpi-card {
  width: min(92vw, 360px);
  background: #0b1120;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.45);
  position: relative;
  overflow: hidden;
  transition: transform 0.25s ease, border-color 0.25s ease;
}

.kpi-card:hover {
  transform: translateY(-3px);
  border-color: rgba(16, 185, 129, 0.3);
}

.kpi-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #10b981, transparent);
  opacity: 0.6;
}

.kpi-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.kpi-title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.kpi-label {
  font-size: 13px;
  font-weight: 600;
  color: #94a3b8;
  letter-spacing: 0.3px;
}

.kpi-live-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 8px #10b981;
  animation: pulseDot 2s infinite ease-in-out;
}

@keyframes pulseDot {
  0%, 100% { opacity: 0.4; transform: scale(0.9); }
  50% { opacity: 1; transform: scale(1.15); }
}

.kpi-badge {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.kpi-badge-up {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.25);
}

.kpi-value-row {
  display: flex;
  align-items: baseline;
  gap: 3px;
  margin-bottom: 16px;
}

.kpi-currency {
  font-size: 24px;
  font-weight: 700;
  color: #64748b;
}

.kpi-number {
  font-size: 38px;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -1px;
  font-variant-numeric: tabular-nums;
}

.kpi-chart {
  margin: 6px -4px 16px;
}

.kpi-svg {
  width: 100%;
  height: 44px;
  display: block;
}

.kpi-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 12px;
}

.kpi-sub {
  color: #64748b;
}

.kpi-link {
  color: #10b981;
  text-decoration: none;
  font-weight: 600;
  transition: opacity 0.2s ease;
}

.kpi-link:hover {
  opacity: 0.8;
}`,
    js: `var target = 148290;
var counter = document.getElementById("kpiCounter");
var duration = 1800;
var start = null;

function animate(timestamp) {
  if (!start) start = timestamp;
  var progress = Math.min((timestamp - start) / duration, 1);
  // Ease-out cubic
  var ease = 1 - Math.pow(1 - progress, 3);
  var current = Math.floor(ease * target);
  counter.textContent = current.toLocaleString("en-US");
  if (progress < 1) {
    requestAnimationFrame(animate);
  }
}

requestAnimationFrame(animate);`,
    prompt: `Create a dark SaaS KPI metric card with animated counter and sparkline SVG using HTML, CSS and vanilla JavaScript.

Requirements:
- Compact card (approx 360px wide) with dark theme (#0b1120), soft border and top neon accent line.
- Header with metric label, pulsing live indicator dot, and green percentage growth badge (+28.4%).
- Large metric value ($148,290) that counts up smoothly on load using requestAnimationFrame with ease-out cubic.
- Mini sparkline chart created with inline SVG and a subtle gradient fill area.
- Footer comparing to previous period with a direct link.

Return one HTML file with <style> and <script> tags.`,
    steps: [
      "Structure the card with header, number row, SVG sparkline, and comparative footer.",
      "Style with dark navy background and top green highlight line using a ::before pseudo-element.",
      "Draw the sparkline trend with SVG path curves and a gradient area fill.",
      "Animate the number from 0 to target using requestAnimationFrame and ease-out cubic.",
      "Format the output integer with toLocaleString() for comma separation.",
    ],
    tips: [
      "Use font-variant-numeric: tabular-nums to prevent numbers from wobbling horizontally during counter animation.",
      "Combine SVG defs linearGradient with stroke-width for a professional financial dashboard aesthetic.",
      "Ensure color contrast meets WCAG AA standards against the dark background.",
    ],
  },
  {
    slug: "cookie-consent-banner",
    name: "GDPR Cookie Consent Banner",
    tone: "dark",
    tags: ["cookie", "banner", "privacy", "gdpr", "modal", "compliance"],
    description:
      "A modern floating GDPR cookie banner with category preference toggles, Accept All / Necessary Only buttons, and persistent state dismiss.",
    html: `<div class="cookie-banner" id="cookieBanner">
  <div class="cookie-top">
    <div class="cookie-icon-wrap">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 2a14.5 14.5 0 0 0 0 20 10 10 0 0 0-10-10"></path>
        <path d="M8.5 8.5v.01"></path>
        <path d="M16 15.5v.01"></path>
        <path d="M12 12v.01"></path>
      </svg>
    </div>
    <div class="cookie-text">
      <h4>We value your privacy</h4>
      <p>We use cookies to enhance navigation, analyze site traffic, and personalize content. Customize preferences anytime.</p>
    </div>
  </div>

  <div class="cookie-toggles" id="cookieToggles" style="display: none;">
    <div class="cookie-row">
      <span>Essential (Always Active)</span>
      <span class="cookie-lock">Required</span>
    </div>
    <div class="cookie-row">
      <span>Analytics & Performance</span>
      <label class="c-switch"><input type="checkbox" id="analyticsCheck" checked><span class="c-slider"></span></label>
    </div>
    <div class="cookie-row">
      <span>Marketing & Targeting</span>
      <label class="c-switch"><input type="checkbox" id="marketingCheck"><span class="c-slider"></span></label>
    </div>
  </div>

  <div class="cookie-actions">
    <button class="cookie-btn cookie-pref" id="prefBtn">Preferences</button>
    <div class="cookie-right-btns">
      <button class="cookie-btn cookie-reject" id="rejectBtn">Essential Only</button>
      <button class="cookie-btn cookie-accept" id="acceptBtn">Accept All</button>
    </div>
  </div>
</div>`,
    css: `${STAGE_DARK}

.cookie-banner {
  position: fixed;
  bottom: 24px;
  left: 24px;
  right: 24px;
  max-width: 540px;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 18px;
  padding: 22px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
  z-index: 9999;
  animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}

.cookie-top {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  margin-bottom: 16px;
}

.cookie-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(245, 158, 11, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.cookie-text h4 {
  font-size: 16px;
  color: #ffffff;
  margin: 0 0 6px;
}

.cookie-text p {
  font-size: 13.5px;
  color: #94a3b8;
  line-height: 1.5;
  margin: 0;
}

.cookie-toggles {
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cookie-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #cbd5e1;
}

.cookie-lock {
  font-size: 11px;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
}

.c-switch {
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
}

.c-switch input { opacity: 0; width: 0; height: 0; }

.c-slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background: #334155;
  border-radius: 20px;
  transition: 0.2s ease;
}

.c-slider:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  left: 3px;
  bottom: 3px;
  background: #ffffff;
  border-radius: 50%;
  transition: 0.2s ease;
}

.c-switch input:checked + .c-slider { background: #3b82f6; }
.c-switch input:checked + .c-slider:before { transform: translateX(16px); }

.cookie-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.cookie-right-btns {
  display: flex;
  gap: 8px;
}

.cookie-btn {
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
}

.cookie-pref {
  background: transparent;
  color: #94a3b8;
  padding-left: 0;
  text-decoration: underline;
}

.cookie-pref:hover { color: #f1f5f9; }

.cookie-reject {
  background: rgba(255, 255, 255, 0.08);
  color: #cbd5e1;
}

.cookie-reject:hover { background: rgba(255, 255, 255, 0.15); }

.cookie-accept {
  background: #3b82f6;
  color: #ffffff;
}

.cookie-accept:hover { background: #2563eb; }`,
    js: `var banner = document.getElementById("cookieBanner");
var prefBtn = document.getElementById("prefBtn");
var toggles = document.getElementById("cookieToggles");
var acceptBtn = document.getElementById("acceptBtn");
var rejectBtn = document.getElementById("rejectBtn");

prefBtn.addEventListener("click", function() {
  var isHidden = toggles.style.display === "none";
  toggles.style.display = isHidden ? "flex" : "none";
  prefBtn.textContent = isHidden ? "Hide Options" : "Preferences";
});

function dismissBanner(choice) {
  banner.style.transition = "opacity 0.3s ease, transform 0.3s ease";
  banner.style.opacity = "0";
  banner.style.transform = "translateY(20px)";
  setTimeout(function() {
    banner.remove();
  }, 300);
}

acceptBtn.addEventListener("click", function() { dismissBanner("all"); });
rejectBtn.addEventListener("click", function() { dismissBanner("essential"); });`,
    prompt: `Create a modern GDPR cookie consent banner in HTML, CSS and vanilla JavaScript.

Requirements:
- Floating glassmorphism card in bottom corner with 18px radius, dark navy backdrop, and blur effect.
- Header with amber cookie SVG icon, title, and concise explanation.
- Expandable preferences accordion with toggle switches for Analytics and Marketing cookies (Essential is locked).
- Action buttons: 'Preferences', 'Essential Only' (grey button), and 'Accept All' (blue button).
- Smooth entry slide animation and clean exit transition on dismissal.

Return one HTML file with <style> and <script> tags.`,
    steps: [
      "Create a fixed position floating container with high z-index and backdrop-filter blur.",
      "Add preference category rows with CSS toggle switches for granular opt-in compliance.",
      "Toggle the visibility of preferences when the user clicks 'Preferences'.",
      "Animate dismissal with opacity and translateY before removing from DOM.",
    ],
    tips: [
      "In production, persist user preferences in localStorage or cookies for 12 months.",
      "Ensure essential cookies are locked on and cannot be disabled by mistake.",
    ],
  },
  {
    slug: "floating-dock-menu",
    name: "macOS Style Floating Dock",
    tone: "dark",
    tags: ["dock", "menu", "navigation", "macos", "floating", "hover"],
    description:
      "A floating desktop icon dock inspired by macOS. Icons magnify smoothly on cursor hover with dynamic tooltips and an active dot indicator.",
    html: `<div class="dock-container">
  <nav class="dock" id="macosDock">
    <a href="#" class="dock-item" data-title="Finder">
      <span class="dock-icon">📁</span>
      <span class="dock-dot"></span>
    </a>
    <a href="#" class="dock-item" data-title="Terminal">
      <span class="dock-icon">⚡</span>
      <span class="dock-dot"></span>
    </a>
    <a href="#" class="dock-item is-active" data-title="Code Editor">
      <span class="dock-icon">💻</span>
      <span class="dock-dot"></span>
    </a>
    <a href="#" class="dock-item" data-title="Browser">
      <span class="dock-icon">🌐</span>
      <span class="dock-dot"></span>
    </a>
    <span class="dock-divider"></span>
    <a href="#" class="dock-item" data-title="Music">
      <span class="dock-icon">🎵</span>
      <span class="dock-dot"></span>
    </a>
    <a href="#" class="dock-item" data-title="Settings">
      <span class="dock-icon">⚙️</span>
      <span class="dock-dot"></span>
    </a>
    <div class="dock-tooltip" id="dockTip">Finder</div>
  </nav>
</div>`,
    css: `${STAGE_DARK}

.dock-container {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding-bottom: 24px;
  width: 100%;
}

.dock {
  position: relative;
  display: flex;
  align-items: flex-end;
  gap: 12px;
  padding: 10px 16px;
  background: rgba(30, 41, 59, 0.65);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 22px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.dock-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  transition: transform 0.2s cubic-bezier(0.2, 0, 0.2, 1);
  transform-origin: bottom center;
}

.dock-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.03));
  border: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
}

.dock-item:hover .dock-icon {
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.5);
}

.dock-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: transparent;
  margin-top: 5px;
  transition: background 0.2s ease;
}

.dock-item.is-active .dock-dot {
  background: #ffffff;
  box-shadow: 0 0 6px #ffffff;
}

.dock-divider {
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.15);
  align-self: center;
  margin: 0 4px;
}

.dock-tooltip {
  position: absolute;
  top: -38px;
  left: 0;
  padding: 5px 12px;
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  color: #ffffff;
  font-size: 12px;
  font-weight: 500;
  pointer-events: none;
  opacity: 0;
  transform: translate(-50%, 6px);
  transition: opacity 0.15s ease, transform 0.15s ease;
  white-space: nowrap;
}

.dock-tooltip.is-visible {
  opacity: 1;
  transform: translate(-50%, 0);
}`,
    js: `var dock = document.getElementById("macosDock");
var items = dock.querySelectorAll(".dock-item");
var tip = document.getElementById("dockTip");

items.forEach(function(item) {
  item.addEventListener("mouseenter", function(e) {
    var title = item.getAttribute("data-title");
    var rect = item.getBoundingClientRect();
    var dockRect = dock.getBoundingClientRect();
    var leftOffset = (rect.left + rect.width / 2) - dockRect.left;

    tip.textContent = title;
    tip.style.left = leftOffset + "px";
    tip.classList.add("is-visible");
    item.style.transform = "scale(1.3) translateY(-10px)";
  });

  item.addEventListener("mouseleave", function() {
    tip.classList.remove("is-visible");
    item.style.transform = "scale(1) translateY(0)";
  });
});`,
    prompt: `Create a macOS-style floating icon dock with magnification effect in HTML, CSS and vanilla JavaScript.

Requirements:
- Centered dock with frosted glass backdrop (backdrop-filter: blur, rounded 22px border, soft shadow).
- 6 icon items separated by a subtle vertical divider line.
- Smooth scale-up magnification (1.3x) with upward translation when hovering over an item.
- Tooltip pill that floats directly above the hovered icon with the app title.
- Small white active dot indicator underneath running apps.

Return one HTML file with <style> and <script> tags.`,
    steps: [
      "Style the dock container with fixed or centered flexbox and frosted glass aesthetics.",
      "Add icon tiles with subtle gradients and shadows.",
      "Calculate horizontal center of hovered element to position the shared tooltip precisely.",
      "Use transform: scale() and translateY() for fluid elevation.",
    ],
    tips: [
      "Keep transform-origin at bottom center so icons expand upward rather than overflowing downwards.",
      "Add tactile click bounce with transform: scale(0.95) on active state.",
    ],
  },
  {
    slug: "animated-pricing-card-3d",
    name: "3D Spotlight Pricing Card",
    tone: "dark",
    tags: ["pricing", "card", "3d", "spotlight", "hover", "saas"],
    description:
      "A dark pricing tier card with a dynamic mouse-following radial spotlight glow, animated border highlight, and recommended badge.",
    html: `<div class="spotlight-card" id="spotCard">
  <div class="card-glow" id="cardGlow"></div>
  <div class="card-inner">
    <div class="card-top">
      <span class="badge-rec">Most Popular</span>
      <h3 class="tier-name">Pro Workspace</h3>
      <p class="tier-desc">Designed for scaling teams requiring high throughput and priority support.</p>
    </div>

    <div class="price-box">
      <span class="curr">$</span>
      <span class="amount">49</span>
      <span class="per">/ month</span>
    </div>

    <ul class="features">
      <li><span>✓</span> Unlimited projects &amp; API keys</li>
      <li><span>✓</span> 1,000,000 monthly workflow executions</li>
      <li><span>✓</span> 24/7 dedicated Slack &amp; video support</li>
      <li><span>✓</span> 99.99% uptime SLA guarantee</li>
    </ul>

    <button class="cta-glow-btn">Start 14-Day Free Trial &rarr;</button>
    <div class="foot-note">No credit card required. Cancel anytime.</div>
  </div>
</div>`,
    css: `${STAGE_DARK}

.spotlight-card {
  position: relative;
  width: min(92vw, 380px);
  background: #0b1020;
  border-radius: 24px;
  padding: 1px;
  overflow: hidden;
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.6);
  transition: transform 0.25s ease;
}

.spotlight-card:hover {
  transform: translateY(-4px);
}

.card-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 250px;
  height: 250px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.spotlight-card:hover .card-glow {
  opacity: 1;
}

.card-inner {
  position: relative;
  background: #0d1326;
  border-radius: 23px;
  padding: 32px 28px;
  z-index: 1;
}

.badge-rec {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 999px;
  background: rgba(99, 102, 241, 0.2);
  border: 1px solid rgba(99, 102, 241, 0.5);
  color: #a5b4fc;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 14px;
}

.tier-name {
  font-size: 24px;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 8px;
}

.tier-desc {
  font-size: 14px;
  color: #94a3b8;
  line-height: 1.5;
  margin: 0 0 24px;
}

.price-box {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 28px;
}

.curr {
  font-size: 24px;
  font-weight: 700;
  color: #6366f1;
}

.amount {
  font-size: 48px;
  font-weight: 800;
  color: #ffffff;
  line-height: 1;
}

.per {
  font-size: 14px;
  color: #64748b;
}

.features {
  list-style: none;
  padding: 0;
  margin: 0 0 28px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.features li {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #cbd5e1;
}

.features li span {
  color: #6366f1;
  font-weight: 800;
}

.cta-glow-btn {
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  box-shadow: 0 10px 25px rgba(99, 102, 241, 0.4);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.cta-glow-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 30px rgba(99, 102, 241, 0.5);
}

.foot-note {
  text-align: center;
  font-size: 12px;
  color: #64748b;
  margin-top: 14px;
}`,
    js: `var card = document.getElementById("spotCard");
var glow = document.getElementById("cardGlow");

card.addEventListener("mousemove", function(e) {
  var rect = card.getBoundingClientRect();
  var x = e.clientX - rect.left;
  var y = e.clientY - rect.top;
  glow.style.left = x + "px";
  glow.style.top = y + "px";
});`,
    prompt: `Create a dark 3D spotlight pricing card with mouse-follow radial glow in HTML, CSS and vanilla JavaScript.

Requirements:
- Dark navy container (#0b1020) with 24px radius, soft shadow, and subtle hover elevation.
- A radial glow circle that dynamically follows the cursor across the card surface on mousemove.
- Tier name, recommended badge pill, large price display ($49/month), and feature checklist with purple checks.
- Gradient primary CTA button with hover elevation and box shadow.
- Reassurance copy beneath the button.

Return one HTML file with <style> and <script> tags.`,
    steps: [
      "Set up a card with relative positioning and overflow hidden.",
      "Position an absolute circle with radial gradient that is tracked on mousemove.",
      "Calculate local cursor offset relative to the card's getBoundingClientRect().",
      "Place text and button layers inside a z-index container so the glow remains underneath.",
    ],
    tips: [
      "Use pointer-events: none on the glow element so it doesn't interrupt card interactions.",
      "Adjust the radial-gradient alpha to create subtle sheen rather than overpowering background colors.",
    ],
  },
  {
    slug: "pulse-beacon-radar",
    name: "Live Pulse Radar Beacon",
    tone: "dark",
    tags: ["radar", "pulse", "beacon", "status", "server", "ping"],
    description:
      "A live telemetry beacon with concentric expanding ripple pulses, glowing status orb, and server latency indicator.",
    html: `<div class="beacon-wrap">
  <div class="radar-box">
    <div class="pulse-ring r1"></div>
    <div class="pulse-ring r2"></div>
    <div class="pulse-ring r3"></div>
    <div class="center-orb"></div>
  </div>
  <div class="beacon-info">
    <div class="b-title">All Systems Operational</div>
    <div class="b-meta">Global CDN · 24ms Average Latency · 99.99%</div>
  </div>
</div>`,
    css: `${STAGE_DARK}

.beacon-wrap {
  display: inline-flex;
  align-items: center;
  gap: 20px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 18px 28px;
  border-radius: 999px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}

.radar-box {
  position: relative;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.center-orb {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 12px #10b981;
  position: relative;
  z-index: 2;
}

.pulse-ring {
  position: absolute;
  inset: -6px;
  border: 1.5px solid #10b981;
  border-radius: 50%;
  animation: radarPulse 2.4s cubic-bezier(0.2, 0, 0.2, 1) infinite;
  opacity: 0;
}

.r2 { animation-delay: 0.8s; }
.r3 { animation-delay: 1.6s; }

@keyframes radarPulse {
  0% { transform: scale(0.4); opacity: 0.9; }
  100% { transform: scale(2.2); opacity: 0; }
}

.beacon-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.b-title {
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
}

.b-meta {
  font-size: 12px;
  color: #94a3b8;
  font-family: monospace;
}`,
    prompt: `Create a live system status pulse radar beacon in HTML and CSS.

Requirements:
- Compact pill-shaped dark container (#0f172a, rounded 999px, subtle border).
- Concentric circular ripple rings that expand outward continuously from a center green orb using CSS keyframe animations with staggered animation-delay.
- Status headline ("All Systems Operational") and server telemetry metrics in monospace.
- Zero JavaScript, lightweight and smooth.

Return one HTML file with a <style> block.`,
    steps: [
      "Center an emerald green orb inside a fixed-size container.",
      "Add 3 pulse rings using absolute positioning and border-radius 50%.",
      "Animate transform: scale() from 0.4 to 2.2 and opacity from 0.9 to 0.",
      "Stagger animation-delay (0s, 0.8s, 1.6s) for continuous rhythmic propagation.",
    ],
    tips: [
      "Use cubic-bezier(0.2, 0, 0.2, 1) to give the pulse realistic initial acceleration.",
      "Respect prefers-reduced-motion by pausing or stopping pulse animations.",
    ],
  },
  {
    slug: "interactive-color-picker",
    name: "Interactive Color Palette Card",
    tone: "dark",
    tags: ["color", "picker", "palette", "slider", "copy", "generator"],
    description:
      "An interactive color palette generator with dynamic HSL hue slider, HEX display, and 1-click copy feedback toast.",
    html: `<div class="color-card">
  <div class="color-preview" id="colorBox">
    <span class="color-val" id="hexText">#6366f1</span>
  </div>
  <div class="picker-body">
    <div class="picker-label">
      <span>Adjust Hue</span>
      <span id="hueDeg">239°</span>
    </div>
    <input type="range" min="0" max="360" value="239" class="hue-slider" id="hueRange" />
    <button class="copy-hex-btn" id="copyHex">Copy HEX Code</button>
  </div>
</div>`,
    css: `${STAGE_DARK}

.color-card {
  width: min(92vw, 320px);
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
}

.color-preview {
  height: 160px;
  background: #6366f1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease;
}

.color-val {
  padding: 8px 18px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  color: #ffffff;
  font-family: monospace;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.picker-body {
  padding: 22px;
}

.picker-label {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  font-weight: 600;
  color: #94a3b8;
  margin-bottom: 12px;
}

.hue-slider {
  width: 100%;
  height: 10px;
  border-radius: 999px;
  background: linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%);
  outline: none;
  -webkit-appearance: none;
  cursor: pointer;
  margin-bottom: 18px;
}

.hue-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #ffffff;
  border: 3px solid #0f172a;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}

.copy-hex-btn {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.copy-hex-btn:hover {
  background: rgba(255, 255, 255, 0.16);
}`,
    js: `var range = document.getElementById("hueRange");
var box = document.getElementById("colorBox");
var hexText = document.getElementById("hexText");
var hueDeg = document.getElementById("hueDeg");
var copyBtn = document.getElementById("copyHex");

function hslToHex(h, s, l) {
  l /= 100;
  var a = s * Math.min(l, 1 - l) / 100;
  var f = function(n) {
    var k = (n + h / 30) % 12;
    var color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return "#" + f(0) + f(8) + f(4);
}

function updateColor() {
  var hue = range.value;
  hueDeg.textContent = hue + "°";
  var hex = hslToHex(parseInt(hue, 10), 85, 65);
  box.style.background = hex;
  hexText.textContent = hex;
}

range.addEventListener("input", updateColor);

copyBtn.addEventListener("click", function() {
  navigator.clipboard.writeText(hexText.textContent).then(function() {
    copyBtn.textContent = "Copied to Clipboard!";
    copyBtn.style.background = "#10b981";
    setTimeout(function() {
      copyBtn.textContent = "Copy HEX Code";
      copyBtn.style.background = "rgba(255, 255, 255, 0.08)";
    }, 1500);
  });
});`,
    prompt: `Create an interactive color palette card with an HSL hue range slider and 1-click copy in HTML, CSS and vanilla JavaScript.

Requirements:
- Card container with large color preview swatch at top displaying current HEX code.
- Continuous rainbow gradient track for the hue range input slider (0 to 360 degrees).
- Mathematical HSL-to-HEX conversion that updates the preview and hex badge dynamically on slider input.
- Copy HEX button that writes to navigator.clipboard and provides visual feedback.

Return one HTML file with <style> and <script> tags.`,
    steps: [
      "Style the range slider with a multi-stop rainbow linear-gradient background.",
      "Calculate RGB from HSL values inside an input event handler.",
      "Update DOM background and formatted hex string in real-time.",
      "Use navigator.clipboard.writeText with temporary button state change.",
    ],
    tips: [
      "Keep saturation and lightness constant while varying hue for harmonious palette exploration.",
      "Display degree units alongside the slider for precise tuning.",
    ],
  },
  {
    slug: "segmented-pill-control",
    name: "Segmented Pill Control",
    tone: "dark",
    tags: ["segmented", "control", "tabs", "pill", "ios", "switch"],
    description:
      "An iOS-inspired segmented pill switch with a smooth sliding active background indicator that glides between options.",
    html: `<div class="segment-box">
  <div class="segment-wrap" id="segmentGroup">
    <div class="segment-slider" id="segmentGlider"></div>
    <button class="seg-btn is-active" data-idx="0">Overview</button>
    <button class="seg-btn" data-idx="1">Analytics</button>
    <button class="seg-btn" data-idx="2">Integrations</button>
    <button class="seg-btn" data-idx="3">Settings</button>
  </div>
</div>`,
    css: `${STAGE_DARK}

.segment-box {
  padding: 24px;
}

.segment-wrap {
  position: relative;
  display: inline-flex;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 999px;
  padding: 5px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
}

.segment-slider {
  position: absolute;
  top: 5px;
  bottom: 5px;
  left: 5px;
  border-radius: 999px;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
  transition: transform 0.25s cubic-bezier(0.2, 0, 0, 1), width 0.25s ease;
  z-index: 1;
}

.seg-btn {
  position: relative;
  background: transparent;
  border: none;
  padding: 10px 22px;
  font-size: 14px;
  font-weight: 600;
  color: #94a3b8;
  cursor: pointer;
  z-index: 2;
  border-radius: 999px;
  transition: color 0.2s ease;
}

.seg-btn.is-active {
  color: #ffffff;
}

.seg-btn:hover:not(.is-active) {
  color: #e2e8f0;
}`,
    js: `var group = document.getElementById("segmentGroup");
var glider = document.getElementById("segmentGlider");
var buttons = group.querySelectorAll(".seg-btn");

function setGlider(btn) {
  buttons.forEach(function(b) { b.classList.remove("is-active"); });
  btn.classList.add("is-active");
  glider.style.width = btn.offsetWidth + "px";
  glider.style.transform = "translateX(" + btn.offsetLeft + "px)";
}

buttons.forEach(function(btn) {
  btn.addEventListener("click", function() {
    setGlider(btn);
  });
});

if (buttons.length > 0) {
  setGlider(buttons[0]);
}`,
    prompt: `Create an iOS-inspired segmented control switch with a sliding background glider in HTML, CSS and vanilla JavaScript.

Requirements:
- Centered container with dark pill background and inset shadow.
- An absolute gliding pill indicator that smoothly slides beneath the selected option using CSS transform: translateX and width transition.
- 4 segmented options: Overview, Analytics, Integrations, Settings.
- Click handlers that calculate button offsetLeft and offsetWidth to position the glider precisely.

Return one HTML file with <style> and <script> tags.`,
    steps: [
      "Create a pill container with display: inline-flex and relative positioning.",
      "Add an absolute glider element styled with a vibrant gradient and box shadow.",
      "Calculate clicked button's offsetLeft and offsetWidth in JavaScript.",
      "Apply transform: translateX() and width to slide the glider seamlessly.",
    ],
    tips: [
      "Use cubic-bezier(0.2, 0, 0, 1) timing function to replicate native Apple spring physics.",
      "Add keyboard left/right arrow navigation support for enhanced accessibility.",
    ],
  },
  {
    slug: "copy-code-block-card",
    name: "Copy Code Snippet Box",
    tone: "dark",
    tags: ["code", "copy", "developer", "syntax", "component"],
    colors: ["#0f172a", "#38bdf8", "#10b981", "#ffffff"],
    description: "A developer code snippet card with file tab, language badge, syntax highlighting, and an animated one-click copy button.",
    html: `<div class="codebox-wrapper">
  <div class="codebox-card">
    <div class="codebox-header">
      <div class="codebox-dots">
        <span></span><span></span><span></span>
      </div>
      <div class="codebox-tab">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
        auth-middleware.ts
      </div>
      <button class="codebox-copy" id="codeCopyBtn" aria-label="Copy code">
        <span class="copy-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
        </span>
        <span class="copy-text">Copy</span>
      </button>
    </div>
    <div class="codebox-body">
      <div class="codebox-lines">
        <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span>
      </div>
      <pre class="codebox-pre"><code id="codeSnippetContent"><span class="c-kw">import</span> { NextResponse } <span class="c-kw">from</span> <span class="c-str">"next/server"</span>;
<span class="c-kw">import type</span> { NextRequest } <span class="c-kw">from</span> <span class="c-str">"next/server"</span>;

<span class="c-kw">export function</span> <span class="c-fn">middleware</span>(req: <span class="c-typ">NextRequest</span>) {
  <span class="c-kw">const</span> token = req.cookies.<span class="c-fn">get</span>(<span class="c-str">"session"</span>)?.value;
  <span class="c-kw">if</span> (!token) <span class="c-kw">return</span> NextResponse.<span class="c-fn">redirect</span>(<span class="c-kw">new</span> <span class="c-typ">URL</span>(<span class="c-str">"/login"</span>, req.url));
  <span class="c-kw">return</span> NextResponse.<span class="c-fn">next</span>();
}</code></pre>
    </div>
  </div>
</div>`,
    css: `.codebox-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #090d16;
  padding: 24px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.codebox-card {
  width: 100%;
  max-width: 580px;
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
}

.codebox-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: #141e33;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.codebox-dots {
  display: flex;
  gap: 6px;
}

.codebox-dots span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #334155;
}

.codebox-dots span:nth-child(1) { background: #ef4444; }
.codebox-dots span:nth-child(2) { background: #f59e0b; }
.codebox-dots span:nth-child(3) { background: #10b981; }

.codebox-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  color: #94a3b8;
  font-family: ui-monospace, "SF Mono", monospace;
}

.codebox-copy {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #cbd5e1;
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.codebox-copy:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
}

.codebox-copy.is-copied {
  background: rgba(16, 185, 129, 0.15);
  border-color: #10b981;
  color: #34d399;
}

.codebox-body {
  display: flex;
  padding: 18px 16px;
  overflow-x: auto;
  font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  font-size: 13.5px;
  line-height: 1.65;
}

.codebox-lines {
  display: flex;
  flex-direction: column;
  padding-right: 18px;
  color: #475569;
  user-select: none;
  text-align: right;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
}

.codebox-pre {
  margin: 0;
  padding-left: 18px;
  color: #e2e8f0;
}

.c-kw { color: #f43f5e; font-weight: 600; }
.c-fn { color: #38bdf8; }
.c-typ { color: #a855f7; }
.c-str { color: #34d399; }`,
    js: `var copyBtn = document.getElementById("codeCopyBtn");
var codeEl = document.getElementById("codeSnippetContent");

copyBtn.addEventListener("click", function() {
  var text = codeEl.innerText || codeEl.textContent;
  navigator.clipboard.writeText(text).then(function() {
    copyBtn.classList.add("is-copied");
    copyBtn.querySelector(".copy-text").textContent = "Copied!";
    setTimeout(function() {
      copyBtn.classList.remove("is-copied");
      copyBtn.querySelector(".copy-text").textContent = "Copy";
    }, 2000);
  });
});`,
    prompt: `Create a dark modern code snippet container card with line numbers and a one-click clipboard copy button in HTML, CSS and vanilla JavaScript.

Requirements:
- macOS style 3 colored dots (red, yellow, green) on the top bar.
- File tab showing icon and file name.
- Animated copy button using navigator.clipboard API with 2-second 'Copied!' success feedback.
- Left column with non-selectable line numbers separated by a vertical border.
- Monospace typography with clean keyword syntax highlights.

Return one HTML file with <style> and <script> tags.`,
    steps: [
      "Structure header bar with dots, tab name and copy trigger.",
      "Split code body into line counter column and syntax block.",
      "Add clipboard writeText listener with temporary active class toggling.",
    ],
    tips: [
      "Use user-select: none on line numbers so users don't accidentally copy them.",
      "Include fallback clipboard textarea logic for older iframe contexts.",
    ],
  },
  {
    slug: "animated-circular-progress",
    name: "Animated Circular Progress Ring",
    tone: "dark",
    tags: ["progress", "svg", "dashboard", "metric", "ring"],
    colors: ["#0f172a", "#6366f1", "#a855f7", "#ec4899"],
    description: "An interactive SVG circular progress gauge with vibrant gradient stroke and real-time percentage counter.",
    html: `<div class="circ-wrapper">
  <div class="circ-card">
    <div class="circ-title">Monthly Goal Progress</div>
    <div class="circ-gauge">
      <svg class="circ-svg" viewBox="0 0 160 160">
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#6366f1" />
            <stop offset="50%" stop-color="#a855f7" />
            <stop offset="100%" stop-color="#ec4899" />
          </linearGradient>
        </defs>
        <circle class="circ-bg" cx="80" cy="80" r="64" />
        <circle class="circ-bar" id="progressBar" cx="80" cy="80" r="64" />
      </svg>
      <div class="circ-info">
        <span class="circ-pct" id="progressPct">78%</span>
        <span class="circ-lbl">Completed</span>
      </div>
    </div>
    <div class="circ-actions">
      <button class="circ-btn" data-val="25">25%</button>
      <button class="circ-btn" data-val="50">50%</button>
      <button class="circ-btn" data-val="78">78%</button>
      <button class="circ-btn" data-val="100">100%</button>
    </div>
  </div>
</div>`,
    css: `.circ-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #090d16;
  padding: 24px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.circ-card {
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 32px 28px;
  text-align: center;
  width: 100%;
  max-width: 340px;
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.5);
}

.circ-title {
  color: #94a3b8;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 24px;
}

.circ-gauge {
  position: relative;
  width: 160px;
  height: 160px;
  margin: 0 auto 24px;
}

.circ-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.circ-bg {
  fill: none;
  stroke: rgba(255, 255, 255, 0.08);
  stroke-width: 12;
}

.circ-bar {
  fill: none;
  stroke: url(#ringGrad);
  stroke-width: 12;
  stroke-linecap: round;
  stroke-dasharray: 402.12;
  stroke-dashoffset: 88.46;
  transition: stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  filter: drop-shadow(0 0 8px rgba(168, 85, 247, 0.4));
}

.circ-info {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.circ-pct {
  font-size: 36px;
  font-weight: 800;
  color: #ffffff;
  line-height: 1;
}

.circ-lbl {
  font-size: 11.5px;
  color: #a855f7;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 4px;
}

.circ-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.circ-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.circ-btn:hover {
  background: #6366f1;
  border-color: #6366f1;
  color: #ffffff;
}`,
    js: `var bar = document.getElementById("progressBar");
var pctText = document.getElementById("progressPct");
var circumference = 2 * Math.PI * 64; // ~402.12

function setProgress(pct) {
  var offset = circumference - (pct / 100) * circumference;
  bar.style.strokeDashoffset = offset;
  pctText.textContent = pct + "%";
}

document.querySelectorAll(".circ-btn").forEach(function(btn) {
  btn.addEventListener("click", function() {
    var val = parseInt(btn.getAttribute("data-val"), 10);
    setProgress(val);
  });
});`,
    prompt: `Create an animated SVG circular progress gauge widget in HTML, CSS and vanilla JavaScript.

Requirements:
- SVG circular track with radius 64px rotated -90deg so progress starts at 12 o'clock.
- Gradient stroke using SVG linearGradient with glow drop-shadow filter.
- Dynamic stroke-dashoffset calculation based on 2*PI*r circumference.
- Center overlay showing live percentage and status caption.
- Interactive preset buttons to toggle between 25%, 50%, 78%, and 100%.

Return one HTML file with <style> and <script> tags.`,
    steps: [
      "Calculate circumference (2 * Math.PI * r) for SVG circle stroke-dasharray.",
      "Rotate SVG 90 degrees counter-clockwise so stroke fills starting from the top.",
      "Calculate strokeDashoffset = circumference - (percent / 100) * circumference in JavaScript.",
    ],
    tips: [
      "Add stroke-linecap: round for smooth capsule endings on the progress ring.",
      "Use SVG filter drop-shadow to give the stroke a subtle neon glow.",
    ],
  },
  {
    slug: "command-palette-kbd-modal",
    name: "Command Palette (Cmd+K) Modal",
    tone: "dark",
    tags: ["modal", "command-palette", "search", "keyboard", "shortcuts"],
    colors: ["#0f172a", "#1e293b", "#3b82f6", "#ffffff"],
    description: "A Raycast/Spotlight inspired quick launcher modal with instant search filter, keyboard shortcut badges, and category groups.",
    html: `<div class="cmd-wrapper">
  <div class="cmd-dialog">
    <div class="cmd-search-bar">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
      <input type="text" id="cmdInput" class="cmd-input" placeholder="Type a command or search..." autofocus />
      <span class="cmd-kbd">ESC</span>
    </div>
    <div class="cmd-list" id="cmdList">
      <div class="cmd-group">Actions</div>
      <div class="cmd-item is-selected" data-title="Create new project">
        <span class="cmd-icon">✨</span>
        <span class="cmd-label">Create new project</span>
        <span class="cmd-shortcut">⌘N</span>
      </div>
      <div class="cmd-item" data-title="Copy deployment URL">
        <span class="cmd-icon">🔗</span>
        <span class="cmd-label">Copy deployment URL</span>
        <span class="cmd-shortcut">⌘C</span>
      </div>
      <div class="cmd-item" data-title="Invite team members">
        <span class="cmd-icon">👥</span>
        <span class="cmd-label">Invite team members</span>
        <span class="cmd-shortcut">⌘I</span>
      </div>

      <div class="cmd-group">Navigation</div>
      <div class="cmd-item" data-title="Go to Analytics">
        <span class="cmd-icon">📊</span>
        <span class="cmd-label">Go to Analytics</span>
        <span class="cmd-shortcut">G then A</span>
      </div>
      <div class="cmd-item" data-title="Go to API Keys">
        <span class="cmd-icon">🔑</span>
        <span class="cmd-label">Go to API Keys</span>
        <span class="cmd-shortcut">G then K</span>
      </div>
      <div class="cmd-item" data-title="Account Settings">
        <span class="cmd-icon">⚙️</span>
        <span class="cmd-label">Account Settings</span>
        <span class="cmd-shortcut">⌘,</span>
      </div>
    </div>
    <div class="cmd-footer">
      <span>Navigate <b class="cmd-key">↑↓</b></span>
      <span>Select <b class="cmd-key">↵</b></span>
      <span>Close <b class="cmd-key">ESC</b></span>
    </div>
  </div>
</div>`,
    css: `.cmd-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(3, 7, 18, 0.85);
  padding: 24px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.cmd-dialog {
  width: 100%;
  max-width: 540px;
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.7);
}

.cmd-search-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.cmd-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 15px;
  color: #ffffff;
}

.cmd-input::placeholder { color: #64748b; }

.cmd-kbd {
  font-size: 10px;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  padding: 3px 6px;
  border-radius: 5px;
  font-family: ui-monospace, monospace;
}

.cmd-list {
  max-height: 320px;
  overflow-y: auto;
  padding: 10px 12px;
}

.cmd-group {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: #64748b;
  letter-spacing: 1px;
  padding: 10px 12px 6px;
}

.cmd-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s ease;
  color: #cbd5e1;
}

.cmd-item:hover, .cmd-item.is-selected {
  background: #1e293b;
  color: #ffffff;
}

.cmd-item.is-selected .cmd-icon {
  transform: scale(1.1);
}

.cmd-icon {
  font-size: 16px;
  transition: transform 0.15s ease;
}

.cmd-label {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
}

.cmd-shortcut {
  font-size: 11px;
  font-family: ui-monospace, monospace;
  color: #64748b;
  background: rgba(255, 255, 255, 0.04);
  padding: 3px 6px;
  border-radius: 4px;
}

.cmd-footer {
  display: flex;
  gap: 16px;
  padding: 12px 20px;
  background: #090e1c;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 11.5px;
  color: #64748b;
}

.cmd-key {
  color: #cbd5e1;
  background: rgba(255, 255, 255, 0.08);
  padding: 1px 5px;
  border-radius: 3px;
  font-weight: normal;
}`,
    js: `var input = document.getElementById("cmdInput");
var items = document.querySelectorAll(".cmd-item");

input.addEventListener("input", function() {
  var q = input.value.trim().toLowerCase();
  items.forEach(function(item) {
    var title = (item.getAttribute("data-title") || "").toLowerCase();
    item.style.display = (!q || title.includes(q)) ? "flex" : "none";
  });
});

items.forEach(function(item) {
  item.addEventListener("click", function() {
    items.forEach(function(i) { i.classList.remove("is-selected"); });
    item.classList.add("is-selected");
  });
});`,
    prompt: `Create a Spotlight or Raycast-inspired command palette modal in HTML, CSS and vanilla JavaScript.

Requirements:
- Centered floating dialog over a darkened backdrop.
- Search input with search icon and ESC indicator badge.
- List divided into Actions and Navigation sections with icon, label, and keyboard shortcuts.
- Live client-side text filtering as the user types.
- Footer with keyboard navigation cues (arrows, Enter, ESC).

Return one HTML file with <style> and <script> tags.`,
    steps: [
      "Build a dark floating modal card with inset shadow and subtle border glow.",
      "Add grouped action items with hotkey tags and interactive hover states.",
      "Bind input event to show/hide items matching query in JavaScript.",
    ],
    tips: [
      "Add keyboard arrow navigation listener for full accessibility compliance.",
      "In production, bind global keydown for Cmd+K (Mac) or Ctrl+K (Windows) to trigger modal visibility.",
    ],
  },
  {
    slug: "interactive-star-rating",
    name: "Interactive Star Rating Widget",
    tone: "dark",
    tags: ["rating", "reviews", "stars", "feedback", "component"],
    colors: ["#0f172a", "#f59e0b", "#fbbf24", "#ffffff"],
    description: "A 5-star customer review rating widget with golden hover effects, click selection, and dynamic text feedback.",
    html: `<div class="rating-wrapper">
  <div class="rating-card">
    <div class="rating-badge">Customer Feedback</div>
    <div class="rating-heading">How was your experience?</div>
    <div class="rating-sub">Tap a star to rate our platform</div>
    <div class="rating-stars" id="starsContainer">
      <button class="star-btn" data-rating="1" aria-label="1 star">★</button>
      <button class="star-btn" data-rating="2" aria-label="2 stars">★</button>
      <button class="star-btn" data-rating="3" aria-label="3 stars">★</button>
      <button class="star-btn" data-rating="4" aria-label="4 stars">★</button>
      <button class="star-btn" data-rating="5" aria-label="5 stars">★</button>
    </div>
    <div class="rating-feedback" id="ratingFeedback">Select a rating</div>
    <button class="rating-submit" id="ratingSubmitBtn">Submit Review</button>
  </div>
</div>`,
    css: `.rating-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #090d16;
  padding: 24px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.rating-card {
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 32px 28px;
  text-align: center;
  width: 100%;
  max-width: 360px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
}

.rating-badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: #f59e0b;
  letter-spacing: 1px;
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.25);
  padding: 4px 12px;
  border-radius: 999px;
  margin-bottom: 14px;
}

.rating-heading {
  font-size: 20px;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 6px;
}

.rating-sub {
  font-size: 13.5px;
  color: #94a3b8;
  margin-bottom: 24px;
}

.rating-stars {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 16px;
}

.star-btn {
  background: transparent;
  border: none;
  font-size: 38px;
  line-height: 1;
  color: #334155;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  padding: 0;
}

.star-btn:hover {
  transform: scale(1.25);
}

.star-btn.is-active, .star-btn.is-hovered {
  color: #f59e0b;
  text-shadow: 0 0 16px rgba(245, 158, 11, 0.6);
}

.rating-feedback {
  font-size: 14px;
  font-weight: 600;
  color: #cbd5e1;
  min-height: 22px;
  margin-bottom: 24px;
}

.rating-submit {
  width: 100%;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #ffffff;
  border: none;
  padding: 12px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3);
  transition: opacity 0.2s ease;
}

.rating-submit:hover {
  opacity: 0.92;
}`,
    js: `var stars = document.querySelectorAll(".star-btn");
var feedback = document.getElementById("ratingFeedback");
var submitBtn = document.getElementById("ratingSubmitBtn");
var currentRating = 0;

var labels = [
  "",
  "1 / 5 – Needs Improvement 😞",
  "2 / 5 – Could be Better 😐",
  "3 / 5 – Good Experience 🙂",
  "4 / 5 – Great Service! 😊",
  "5 / 5 – Outstanding & Stellar! 🤩"
];

function highlightStars(count) {
  stars.forEach(function(star) {
    var r = parseInt(star.getAttribute("data-rating"), 10);
    if (r <= count) {
      star.classList.add("is-hovered");
    } else {
      star.classList.remove("is-hovered");
    }
  });
}

stars.forEach(function(star) {
  star.addEventListener("mouseenter", function() {
    var r = parseInt(star.getAttribute("data-rating"), 10);
    highlightStars(r);
    feedback.textContent = labels[r];
  });

  star.addEventListener("click", function() {
    currentRating = parseInt(star.getAttribute("data-rating"), 10);
    stars.forEach(function(s) {
      var r = parseInt(s.getAttribute("data-rating"), 10);
      if (r <= currentRating) {
        s.classList.add("is-active");
      } else {
        s.classList.remove("is-active");
      }
    });
    feedback.textContent = labels[currentRating];
  });
});

document.getElementById("starsContainer").addEventListener("mouseleave", function() {
  stars.forEach(function(s) { s.classList.remove("is-hovered"); });
  if (currentRating > 0) {
    feedback.textContent = labels[currentRating];
  } else {
    feedback.textContent = "Select a rating";
  }
});

submitBtn.addEventListener("click", function() {
  if (currentRating === 0) {
    feedback.textContent = "Please select at least 1 star first!";
    return;
  }
  submitBtn.textContent = "Thank you for rating! ✓";
  submitBtn.style.background = "#10b981";
});`,
    prompt: `Create an interactive 5-star rating feedback widget in HTML, CSS and vanilla JavaScript.

Requirements:
- Centered card with dark theme and subtle gold accents.
- 5 star buttons that scale up on hover with gold glow text-shadow.
- Hover state illuminates all stars up to cursor position and updates description text.
- Click locks in the score and colors the stars active.
- Submit button that updates state on completion.

Return one HTML file with <style> and <script> tags.`,
    steps: [
      "Use data-rating attributes on 5 star button elements.",
      "Handle mouseenter/mouseleave for preview illumination.",
      "Handle click event to permanently store selected rating state.",
    ],
    tips: [
      "Use cubic-bezier spring easing on star hover to give bouncy tactile feel.",
      "Support keyboard arrow keys and aria-label values for accessibility.",
    ],
  },
];
