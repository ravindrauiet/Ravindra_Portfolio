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
];
