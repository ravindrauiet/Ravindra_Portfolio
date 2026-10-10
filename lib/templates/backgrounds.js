// Background library: full-screen backdrops. Each item is real HTML + CSS (+ optional JS)
// that is both rendered in the live preview and shown as copyable code.

export const backgrounds = [
  {
    slug: "aurora-blobs-background",
    name: "Aurora Blobs",
    tone: "dark",
    tags: ["animated", "blur", "ai", "hero"],
    description:
      "Three large blurred colour blobs drift slowly behind your content, creating the soft aurora glow seen on modern AI and SaaS sites. Pure CSS, no JavaScript.",
    html: `<div class="aurora">
  <span class="blob blob-1"></span>
  <span class="blob blob-2"></span>
  <span class="blob blob-3"></span>
  <div class="content">
    <h1>Aurora Blobs</h1>
    <p>Soft animated glow, pure CSS.</p>
  </div>
</div>`,
    css: `.aurora {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: #050816;
  display: grid;
  place-items: center;
}

.blob {
  position: absolute;
  width: 45vw;
  height: 45vw;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.55;
  animation: drift 18s ease-in-out infinite alternate;
}
.blob-1 { background: #2506ad; top: -10%; left: -5%; }
.blob-2 { background: #ff7b00; bottom: -15%; right: -5%; animation-delay: -6s; }
.blob-3 { background: #06b6d4; top: 30%; left: 40%; animation-delay: -12s; }

@keyframes drift {
  0%   { transform: translate(0, 0) scale(1); }
  50%  { transform: translate(8vw, -6vh) scale(1.15); }
  100% { transform: translate(-6vw, 8vh) scale(0.95); }
}

.content {
  position: relative;
  text-align: center;
  color: #fff;
  font-family: system-ui, sans-serif;
}
.content h1 { font-size: clamp(2rem, 6vw, 4rem); margin: 0; }
.content p { opacity: 0.75; margin-top: 0.5rem; }

@media (prefers-reduced-motion: reduce) {
  .blob { animation: none; }
}`,
    prompt: `Create a full-screen "aurora" background using only HTML and CSS.

Requirements:
- A container that fills the viewport (min-height: 100vh) with a near-black navy background (#050816) and overflow hidden.
- Three absolutely positioned circular blobs, each about 45vw wide, coloured indigo (#2506ad), orange (#ff7b00) and cyan (#06b6d4).
- Apply filter: blur(90px) and opacity around 0.55 so they read as soft glows, not circles.
- Animate each blob with a slow (18s) ease-in-out keyframe animation that translates and slightly scales it, alternating direction. Give each blob a different negative animation-delay so they never move in sync.
- Centre a heading and a short paragraph above the blobs (position: relative so it sits on top), white text.
- Respect prefers-reduced-motion by disabling the animation.
- No JavaScript and no external libraries.

Return one HTML file with the CSS in a <style> tag.`,
    steps: [
      "Create a wrapper with position: relative, min-height: 100vh and overflow: hidden. The overflow rule stops the blobs from causing scrollbars when they move off-screen.",
      "Add three empty span elements for the blobs and position them absolutely in different corners.",
      "Make each blob a circle with border-radius: 50%, then apply filter: blur(90px). The blur is what turns a hard circle into a glow.",
      "Write one keyframe animation that moves and scales a blob, and apply it to all three with animation-direction: alternate so the motion reverses smoothly.",
      "Give each blob a different negative animation-delay. A negative delay starts the animation part-way through, so the blobs are already out of sync on first paint.",
      "Place your content in a child with position: relative so it stacks above the absolutely positioned blobs.",
    ],
    tips: [
      "Change the three blob colours to match your brand; keep one warm and two cool colours for depth.",
      "Lower the opacity to 0.35 for a subtler effect behind long text.",
      "Large blurs are GPU-heavy. On low-end phones reduce the blur to 60px or hide one blob with a media query.",
    ],
  },
  {
    slug: "grid-fade-background",
    name: "Grid Fade",
    tone: "dark",
    tags: ["grid", "pattern", "saas", "developer"],
    description:
      "A fine line grid that fades out towards the edges using a radial mask. The classic developer-tool hero background, built with two CSS gradients and a mask.",
    html: `<div class="grid-bg">
  <div class="content">
    <span class="pill">v2.0 is live</span>
    <h1>Grid Fade</h1>
    <p>Two gradients and one mask.</p>
  </div>
</div>`,
    css: `.grid-bg {
  position: relative;
  min-height: 100vh;
  background: #0b1020;
  display: grid;
  place-items: center;
  overflow: hidden;
}

/* The grid lives on a pseudo-element so the mask does not hide the content */
.grid-bg::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
  background-size: 48px 48px;
  -webkit-mask-image: radial-gradient(ellipse at center, #000 30%, transparent 75%);
  mask-image: radial-gradient(ellipse at center, #000 30%, transparent 75%);
}

.content {
  position: relative;
  text-align: center;
  color: #fff;
  font-family: system-ui, sans-serif;
}
.pill {
  display: inline-block;
  padding: 6px 14px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 999px;
  font-size: 13px;
  color: #c7d2fe;
}
.content h1 { font-size: clamp(2rem, 6vw, 4rem); margin: 16px 0 0; }
.content p { opacity: 0.7; margin-top: 8px; }`,
    prompt: `Build a full-screen dark hero background with a fading line grid, using only HTML and CSS.

Requirements:
- Wrapper: min-height 100vh, background #0b1020, content centred with CSS grid.
- Draw the grid on a ::before pseudo-element that covers the wrapper (inset: 0).
- Use two layered linear-gradients as background-image: one horizontal 1px line and one vertical 1px line in rgba(255,255,255,0.08), with background-size 48px 48px, so they repeat into a grid.
- Fade the grid towards the edges with mask-image: radial-gradient(ellipse at center, #000 30%, transparent 75%). Include the -webkit- prefix.
- Above the grid, show a small rounded "pill" label, a large heading and a subtitle in white.
- No images, no JavaScript.

Return a single HTML file with a <style> block.`,
    steps: [
      "Give the wrapper a dark solid colour and position: relative so the pseudo-element can be positioned inside it.",
      "Create a ::before pseudo-element with inset: 0. Drawing the grid here, rather than on the wrapper, means the mask in step 4 will not affect your text.",
      "Draw the lines with two linear-gradients. Each gradient paints a 1px line then goes transparent; one is rotated 90deg to make vertical lines.",
      "Set background-size: 48px 48px so the two gradients tile, producing a grid of 48px squares.",
      "Add a radial mask-image. Where the mask is black the grid shows; where it is transparent the grid disappears, giving the fade.",
      "Put the content in a relatively positioned child so it sits above the pseudo-element.",
    ],
    tips: [
      "Change background-size to 24px for a denser grid or 80px for a more open one.",
      "For a light version use background #ffffff and lines in rgba(0,0,0,0.06).",
      "Move the mask centre (for example 'ellipse at top') to make the grid fade downward from a navbar.",
    ],
  },
  {
    slug: "dot-matrix-background",
    name: "Dot Matrix",
    tone: "light",
    tags: ["dots", "pattern", "minimal"],
    description:
      "A calm repeating dot pattern on a light surface, made from a single radial-gradient. A good neutral backdrop for content-heavy pages.",
    html: `<div class="dots">
  <div class="card">
    <h1>Dot Matrix</h1>
    <p>One radial gradient, repeated.</p>
  </div>
</div>`,
    css: `.dots {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background-color: #f7f7f7;
  background-image: radial-gradient(#c7cbe0 1.5px, transparent 1.5px);
  background-size: 22px 22px;
  font-family: system-ui, sans-serif;
}

.card {
  padding: 40px 56px;
  background: #fff;
  border: 1px solid #e8e9f0;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 18px 40px rgba(0, 32, 87, 0.08);
}
.card h1 { margin: 0; color: #002057; font-size: clamp(1.8rem, 5vw, 3rem); }
.card p { margin: 8px 0 0; color: #5b6178; }`,
    prompt: `Create a light dotted background pattern with pure CSS.

Requirements:
- Full-viewport container with background-color #f7f7f7.
- Draw the dots using one radial-gradient as background-image: a 1.5px dot in #c7cbe0, transparent outside it.
- Repeat it with background-size: 22px 22px.
- Centre a white card (1px #e8e9f0 border, 16px radius, soft shadow) containing a navy (#002057) heading and grey subtitle.
- No images or JavaScript.

Return one HTML file with CSS in a <style> tag.`,
    steps: [
      "Set a solid background-color first; the dots are painted on top of it.",
      "Add background-image: radial-gradient(colour 1.5px, transparent 1.5px). The hard stop at 1.5px draws a crisp dot.",
      "Set background-size to the spacing you want (22px here). The browser repeats the gradient automatically, creating the pattern.",
      "Centre your content with display: grid and place-items: center.",
    ],
    tips: [
      "Increase the dot radius to 2px and the spacing to 28px for a bolder pattern.",
      "Use background-position: 11px 11px on a second layer to create an offset (staggered) dot grid.",
      "For dark mode use background #0b1020 with dots in rgba(255,255,255,0.15).",
    ],
  },
  {
    slug: "starfield-canvas-background",
    name: "Starfield",
    tone: "dark",
    tags: ["canvas", "animated", "javascript", "space"],
    description:
      "Hundreds of twinkling stars drift slowly on an HTML canvas. Lightweight JavaScript with no libraries; it pauses automatically for visitors who prefer reduced motion.",
    html: `<div class="space">
  <canvas id="stars"></canvas>
  <div class="content">
    <h1>Starfield</h1>
    <p>Canvas, 40 lines of JavaScript.</p>
  </div>
</div>`,
    css: `.space {
  position: relative;
  min-height: 100vh;
  background: radial-gradient(ellipse at bottom, #1b2735 0%, #050816 100%);
  display: grid;
  place-items: center;
  overflow: hidden;
}
#stars {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.content {
  position: relative;
  text-align: center;
  color: #fff;
  font-family: system-ui, sans-serif;
}
.content h1 { font-size: clamp(2rem, 6vw, 4rem); margin: 0; }
.content p { opacity: 0.7; margin-top: 8px; }`,
    js: `var canvas = document.getElementById("stars");
var ctx = canvas.getContext("2d");
var stars = [];
var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function resize() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  stars = [];
  var count = Math.floor((canvas.width * canvas.height) / 4000);
  for (var i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.3,
      speed: Math.random() * 0.25 + 0.05,
      phase: Math.random() * Math.PI * 2
    });
  }
}

function draw(time) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (var i = 0; i < stars.length; i++) {
    var s = stars[i];
    var twinkle = 0.5 + 0.5 * Math.sin(time / 600 + s.phase);
    ctx.globalAlpha = 0.3 + 0.7 * twinkle;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
    s.y -= s.speed;
    if (s.y < 0) s.y = canvas.height;
  }
  if (!reduceMotion) requestAnimationFrame(draw);
}

window.addEventListener("resize", resize);
resize();
requestAnimationFrame(draw);`,
    prompt: `Create an animated starfield background with an HTML canvas and vanilla JavaScript (no libraries).

Requirements:
- A full-viewport wrapper with a radial-gradient night sky (#1b2735 at the bottom to #050816).
- A canvas absolutely positioned to fill the wrapper.
- On load and on window resize, set the canvas size to its displayed size and generate stars: roughly one star per 4000 square pixels, each with random x, y, radius (0.3-1.7px), upward speed and a random phase.
- In a requestAnimationFrame loop: clear the canvas, draw each star as a white circle whose opacity twinkles using a sine wave of time plus its phase, move it upward by its speed and wrap it to the bottom when it leaves the top.
- If the user has prefers-reduced-motion: reduce, draw a single static frame and do not loop.
- Centre a white heading and subtitle above the canvas.

Return a single HTML file with <style> and <script> tags.`,
    steps: [
      "Add a canvas inside a relatively positioned wrapper and stretch it with position: absolute and inset: 0.",
      "In a resize function, set canvas.width and canvas.height to the element's displayed size. Without this the canvas keeps its default 300x150 resolution and looks blurry.",
      "Generate star objects with random position, size, speed and phase. Scale the count with the canvas area so large screens are not sparse.",
      "In the draw loop, clear the canvas, then draw each star with ctx.arc. Vary ctx.globalAlpha with Math.sin(time + phase) to make stars twinkle independently.",
      "Move each star up a little every frame and wrap it back to the bottom when it leaves the top.",
      "Schedule the next frame with requestAnimationFrame, but skip the loop when prefers-reduced-motion is set.",
    ],
    tips: [
      "Change s.y -= s.speed to s.x += s.speed for horizontal drift.",
      "Tint a few stars: pick the fill colour from an array such as ['#fff', '#c7d2fe', '#fde68a'].",
      "Stop the loop with an IntersectionObserver when the section scrolls out of view to save battery.",
    ],
  },
  {
    slug: "layered-waves-background",
    name: "Layered Waves",
    tone: "light",
    tags: ["svg", "animated", "waves", "footer"],
    description:
      "Three translucent SVG waves slide across the bottom of the section at different speeds, creating a parallax water effect. Ideal above a footer or behind a call to action.",
    html: `<div class="wave-section">
  <div class="content">
    <h1>Layered Waves</h1>
    <p>One SVG path, three speeds.</p>
  </div>
  <svg class="waves" viewBox="0 24 150 28" preserveAspectRatio="none" aria-hidden="true">
    <defs>
      <path id="wave" d="M-160 44c30 0 58-18 88-18s58 18 88 18 58-18 88-18 58 18 88 18v44h-352z" />
    </defs>
    <g class="wave-layers">
      <use href="#wave" x="48" y="0" fill="rgba(37, 6, 173, 0.25)" />
      <use href="#wave" x="48" y="3" fill="rgba(37, 6, 173, 0.45)" />
      <use href="#wave" x="48" y="6" fill="#2506ad" />
    </g>
  </svg>
</div>`,
    css: `.wave-section {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(180deg, #ffffff 0%, #eef2ff 100%);
  display: grid;
  place-items: center;
  overflow: hidden;
  font-family: system-ui, sans-serif;
}
.content { text-align: center; padding-bottom: 12vh; }
.content h1 { margin: 0; color: #002057; font-size: clamp(2rem, 6vw, 4rem); }
.content p { margin-top: 8px; color: #5b6178; }

.waves {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 22vh;
  min-height: 90px;
}

.wave-layers > use {
  animation: slide 22s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;
}
.wave-layers > use:nth-child(1) { animation-delay: -2s; animation-duration: 9s; }
.wave-layers > use:nth-child(2) { animation-delay: -4s; animation-duration: 14s; }
.wave-layers > use:nth-child(3) { animation-delay: -6s; animation-duration: 22s; }

@keyframes slide {
  0%   { transform: translate3d(-90px, 0, 0); }
  100% { transform: translate3d(85px, 0, 0); }
}

@media (prefers-reduced-motion: reduce) {
  .wave-layers > use { animation: none; }
}`,
    prompt: `Create an animated layered-wave background using inline SVG and CSS only.

Requirements:
- A full-viewport section with a subtle white-to-#eef2ff vertical gradient.
- An inline SVG pinned to the bottom (position absolute, width 100%, height about 22vh) with viewBox "0 24 150 28" and preserveAspectRatio="none".
- Define one wave path in <defs> and reuse it three times with <use>, each a little lower (y = 0, 3, 6) and more opaque, filled with indigo #2506ad at 25%, 45% and 100% opacity.
- Animate each <use> horizontally with a translate3d keyframe from -90px to 85px, infinite, with different durations (9s, 14s, 22s) and negative delays so the layers move at different speeds (parallax).
- Disable the animation under prefers-reduced-motion.
- Centre a navy heading and grey subtitle above the waves.

Return a single HTML file with a <style> block.`,
    steps: [
      "Define a single repeating wave shape as an SVG path inside defs. The path is wider than the viewBox so there is always wave to slide into view.",
      "Reuse the path three times with the use element, offsetting each one slightly lower and giving it a more opaque fill.",
      "Set preserveAspectRatio to none so the waves stretch to any screen width.",
      "Animate each layer with the same horizontal keyframes but a different duration. The front layer moves slowest, which reads as depth.",
      "Pin the SVG to the bottom of the section with position: absolute.",
    ],
    tips: [
      "Flip the waves to the top of a section with transform: rotate(180deg) on the SVG.",
      "Match the solid front wave colour to the next section's background for a seamless transition.",
      "Increase the SVG height to 35vh for bigger, more dramatic waves.",
    ],
  },
  {
    slug: "film-grain-background",
    name: "Film Grain",
    tone: "dark",
    tags: ["noise", "texture", "svg", "premium"],
    description:
      "A gradient with a fine film-grain texture laid over it. The grain is generated by an inline SVG noise filter, so there is no image file to download.",
    html: `<div class="grain">
  <div class="content">
    <h1>Film Grain</h1>
    <p>SVG noise over a gradient.</p>
  </div>
</div>`,
    css: `.grain {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, #1e1b4b 0%, #7c2d12 100%);
  display: grid;
  place-items: center;
  overflow: hidden;
}

/* The noise is an SVG feTurbulence filter encoded as a data URL */
.grain::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.5'/></svg>");
  mix-blend-mode: overlay;
  opacity: 0.6;
  pointer-events: none;
}

.content {
  position: relative;
  z-index: 1;
  text-align: center;
  color: #fff;
  font-family: system-ui, sans-serif;
}
.content h1 { font-size: clamp(2rem, 6vw, 4rem); margin: 0; }
.content p { opacity: 0.75; margin-top: 8px; }`,
    prompt: `Create a gradient background with a film-grain noise texture using only CSS (no image files).

Requirements:
- Full-viewport wrapper with a diagonal gradient from deep indigo (#1e1b4b) to burnt orange (#7c2d12).
- Add the grain with a ::after pseudo-element covering the wrapper (inset: 0, pointer-events: none).
- Its background-image is an inline SVG data URL containing an feTurbulence filter (type fractalNoise, baseFrequency 0.9, numOctaves 3, stitchTiles stitch) applied to a full-size rect.
- Blend it with mix-blend-mode: overlay at about 0.6 opacity.
- Centre white heading text above the grain (z-index 1).
- No JavaScript.

Return one HTML file with CSS in a <style> tag.`,
    steps: [
      "Start with a normal gradient background on the wrapper.",
      "Add a ::after pseudo-element that covers the whole wrapper and set pointer-events: none so it never blocks clicks.",
      "Write a tiny SVG that uses the feTurbulence filter to generate noise, and embed it as a data URL in background-image. The # in url(#n) must be written as %23 inside a data URL.",
      "Set mix-blend-mode: overlay so the noise lightens and darkens the gradient instead of covering it.",
      "Tune opacity until the grain is visible but subtle.",
    ],
    tips: [
      "Lower baseFrequency to 0.6 for coarser grain, raise it to 1.2 for finer grain.",
      "Try mix-blend-mode: soft-light for a gentler texture on light backgrounds.",
      "The same ::after rule can be added to any existing section to give it texture.",
    ],
  },
  {
    slug: "cursor-spotlight-background",
    name: "Cursor Spotlight",
    tone: "dark",
    tags: ["interactive", "javascript", "mouse", "hero"],
    description:
      "A soft spotlight follows the visitor's cursor across a dark surface. Two CSS variables are updated from a few lines of JavaScript; the gradient does the rest.",
    html: `<div class="spotlight" id="spotlight">
  <div class="content">
    <h1>Cursor Spotlight</h1>
    <p>Move your mouse around.</p>
  </div>
</div>`,
    css: `.spotlight {
  --x: 50%;
  --y: 50%;
  min-height: 100vh;
  display: grid;
  place-items: center;
  background:
    radial-gradient(circle 320px at var(--x) var(--y), rgba(37, 6, 173, 0.55), transparent 70%),
    #05060f;
  font-family: system-ui, sans-serif;
}
.content { text-align: center; color: #fff; }
.content h1 { font-size: clamp(2rem, 6vw, 4rem); margin: 0; }
.content p { opacity: 0.7; margin-top: 8px; }`,
    js: `var el = document.getElementById("spotlight");

el.addEventListener("pointermove", function (event) {
  var rect = el.getBoundingClientRect();
  el.style.setProperty("--x", event.clientX - rect.left + "px");
  el.style.setProperty("--y", event.clientY - rect.top + "px");
});`,
    prompt: `Create a dark hero background where a soft spotlight follows the mouse cursor. Use HTML, CSS and a few lines of vanilla JavaScript.

Requirements:
- A full-viewport container with background #05060f.
- Define two CSS custom properties on it, --x and --y, both defaulting to 50%.
- Layer a radial-gradient on top of the solid colour: circle 320px at var(--x) var(--y), indigo rgba(37, 6, 173, 0.55) fading to transparent at 70%.
- In JavaScript, listen for pointermove on the container, calculate the pointer position relative to the container with getBoundingClientRect, and write the values to --x and --y with style.setProperty.
- Centre a white heading and subtitle.
- No libraries.

Return a single HTML file with <style> and <script> tags.`,
    steps: [
      "Declare --x and --y custom properties on the container with a default of 50% so the spotlight starts in the centre.",
      "Use those variables as the position of a radial-gradient layered over a solid dark colour.",
      "Listen for pointermove (it covers mouse, pen and touch).",
      "Convert the pointer's page position into a position inside the element by subtracting getBoundingClientRect().left and .top.",
      "Write the result into the CSS variables with style.setProperty. The browser repaints the gradient at the new position automatically.",
    ],
    tips: [
      "Change the circle size (320px) to make the spotlight tighter or wider.",
      "Apply the same technique to a card for a 'glow follows cursor' hover effect.",
      "You don't need a CSS transition here: updating the variables on every pointer event is already smooth.",
    ],
  },
  {
    slug: "diagonal-stripes-background",
    name: "Diagonal Stripes",
    tone: "light",
    tags: ["stripes", "pattern", "animated", "playful"],
    description:
      "Subtle diagonal stripes that scroll continuously, made with a repeating-linear-gradient and one background-position animation.",
    html: `<div class="stripes">
  <div class="card">
    <h1>Diagonal Stripes</h1>
    <p>repeating-linear-gradient in motion.</p>
  </div>
</div>`,
    css: `.stripes {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background-color: #fff7ed;
  background-image: repeating-linear-gradient(
    45deg,
    rgba(255, 123, 0, 0.12) 0,
    rgba(255, 123, 0, 0.12) 20px,
    transparent 20px,
    transparent 40px
  );
  background-size: 56.57px 56.57px;
  animation: move 3s linear infinite;
  font-family: system-ui, sans-serif;
}

@keyframes move {
  to { background-position: 56.57px 0; }
}

.card {
  padding: 40px 56px;
  background: #fff;
  border: 1px solid #fed7aa;
  border-radius: 16px;
  text-align: center;
}
.card h1 { margin: 0; color: #002057; font-size: clamp(1.8rem, 5vw, 3rem); }
.card p { margin: 8px 0 0; color: #5b6178; }

@media (prefers-reduced-motion: reduce) {
  .stripes { animation: none; }
}`,
    prompt: `Create an animated diagonal-stripe background with pure CSS.

Requirements:
- Full-viewport container with background-color #fff7ed.
- Use repeating-linear-gradient at 45deg: a 20px stripe of rgba(255,123,0,0.12) followed by a 20px transparent gap.
- Set background-size to 56.57px 56.57px (40px times the square root of 2) so the pattern tiles seamlessly.
- Animate background-position from 0 to 56.57px 0 over 3s, linear, infinite, so the stripes scroll without a visible jump.
- Disable the animation under prefers-reduced-motion.
- Centre a white card with a navy heading.

Return one HTML file with CSS in a <style> tag.`,
    steps: [
      "Create the stripes with repeating-linear-gradient at 45 degrees: 20px of colour, then 20px of transparent.",
      "Calculate the tile size. A 40px stripe period at 45 degrees repeats every 40 x 1.4142 = 56.57px horizontally.",
      "Set background-size to that value so the browser tiles the pattern cleanly.",
      "Animate background-position by exactly one tile width. Because the end frame looks identical to the start frame, the loop is seamless.",
    ],
    tips: [
      "Make the stripes bolder by raising the alpha from 0.12 to 0.25.",
      "Reverse the direction with animation-direction: reverse.",
      "Use this on a progress bar: apply the same rules to the bar's fill element.",
    ],
  },
  {
    slug: "floating-bubbles-background",
    name: "Floating Bubbles",
    tone: "dark",
    tags: ["animated", "particles", "css", "playful"],
    description:
      "Translucent bubbles of different sizes rise from the bottom of the screen and fade out. Ten elements and one keyframe animation, no JavaScript.",
    html: `<div class="bubbles">
  <span style="--size: 60px; --left: 8%;  --time: 14s; --delay: 0s;"></span>
  <span style="--size: 24px; --left: 20%; --time: 9s;  --delay: -3s;"></span>
  <span style="--size: 90px; --left: 32%; --time: 18s; --delay: -6s;"></span>
  <span style="--size: 36px; --left: 45%; --time: 11s; --delay: -1s;"></span>
  <span style="--size: 70px; --left: 58%; --time: 16s; --delay: -8s;"></span>
  <span style="--size: 20px; --left: 68%; --time: 8s;  --delay: -4s;"></span>
  <span style="--size: 48px; --left: 78%; --time: 13s; --delay: -10s;"></span>
  <span style="--size: 100px; --left: 88%; --time: 20s; --delay: -5s;"></span>
  <div class="content">
    <h1>Floating Bubbles</h1>
    <p>CSS variables drive every bubble.</p>
  </div>
</div>`,
    css: `.bubbles {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: linear-gradient(180deg, #002057 0%, #2506ad 100%);
  display: grid;
  place-items: center;
}

.bubbles > span {
  position: absolute;
  bottom: -120px;
  left: var(--left);
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.25);
  animation: rise var(--time) linear infinite;
  animation-delay: var(--delay);
}

@keyframes rise {
  0%   { transform: translateY(0) scale(0.8); opacity: 0; }
  10%  { opacity: 1; }
  100% { transform: translateY(-125vh) scale(1.2); opacity: 0; }
}

.content {
  position: relative;
  text-align: center;
  color: #fff;
  font-family: system-ui, sans-serif;
}
.content h1 { font-size: clamp(2rem, 6vw, 4rem); margin: 0; }
.content p { opacity: 0.75; margin-top: 8px; }

@media (prefers-reduced-motion: reduce) {
  .bubbles > span { animation: none; display: none; }
}`,
    prompt: `Create a floating-bubbles background using only HTML and CSS.

Requirements:
- Full-viewport container with a vertical gradient from navy #002057 to indigo #2506ad, overflow hidden.
- Eight span elements, each configured with inline CSS custom properties: --size (20px to 100px), --left (horizontal position as a percentage), --time (animation duration 8s to 20s) and --delay (a negative delay).
- Style every span as a translucent white circle (rgba(255,255,255,0.12) fill, 1px lighter border) positioned below the bottom edge.
- One keyframe animation "rise" moves a bubble up by 125vh, scales it from 0.8 to 1.2 and fades it in then out. Apply it with animation: rise var(--time) linear infinite and animation-delay: var(--delay).
- Hide the bubbles under prefers-reduced-motion.
- Centre a white heading above the bubbles.

Return a single HTML file with a <style> block.`,
    steps: [
      "Create one CSS rule for all bubbles that reads its size, position and timing from CSS custom properties.",
      "Set those custom properties inline on each span. This gives every bubble different behaviour without writing eight separate CSS rules.",
      "Start the bubbles below the container (bottom: -120px) and hide the overflow so they appear to rise into view.",
      "Write one keyframe animation that translates upward and fades the bubble out near the top.",
      "Use negative delays so the screen is already full of bubbles when the page loads.",
    ],
    tips: [
      "Add more spans for a denser effect; each needs only the four variables.",
      "Add a slight horizontal sway by animating translateX in a second keyframe animation.",
      "Swap border-radius: 50% for 20% to turn bubbles into floating rounded squares.",
    ],
  },
  {
    slug: "rotating-beam-background",
    name: "Rotating Beam",
    tone: "dark",
    tags: ["conic", "animated", "glow", "premium"],
    description:
      "A slow-turning conic-gradient beam glows behind a dark panel, giving a premium 'light sweep' effect often used around feature cards and hero sections.",
    html: `<div class="beam-wrap">
  <div class="beam"></div>
  <div class="panel">
    <h1>Rotating Beam</h1>
    <p>A blurred conic gradient, turning slowly.</p>
  </div>
</div>`,
    css: `.beam-wrap {
  position: relative;
  min-height: 100vh;
  background: #06070d;
  display: grid;
  place-items: center;
  overflow: hidden;
}

.beam {
  position: absolute;
  width: 140vmax;
  height: 140vmax;
  background: conic-gradient(
    from 0deg,
    transparent 0deg,
    rgba(37, 6, 173, 0.7) 60deg,
    transparent 120deg,
    transparent 180deg,
    rgba(255, 123, 0, 0.55) 240deg,
    transparent 300deg
  );
  filter: blur(60px);
  animation: spin 16s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.panel {
  position: relative;
  padding: 48px 64px;
  border-radius: 20px;
  background: rgba(10, 12, 24, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(12px);
  text-align: center;
  color: #fff;
  font-family: system-ui, sans-serif;
}
.panel h1 { margin: 0; font-size: clamp(1.8rem, 5vw, 3.2rem); }
.panel p { margin: 8px 0 0; opacity: 0.7; }

@media (prefers-reduced-motion: reduce) {
  .beam { animation: none; }
}`,
    prompt: `Create a dark background with a slowly rotating light beam, using only HTML and CSS.

Requirements:
- Full-viewport wrapper, background #06070d, overflow hidden, content centred.
- A "beam" element, absolutely positioned and very large (140vmax square), whose background is a conic-gradient with two coloured wedges - indigo rgba(37,6,173,0.7) around 60deg and orange rgba(255,123,0,0.55) around 240deg - and transparent everywhere else.
- Blur the beam heavily (filter: blur(60px)) and rotate it 360 degrees over 16s, linear, infinite.
- In front, a centred glass panel: semi-transparent dark background, 1px light border, 20px radius, backdrop-filter blur, containing a white heading and subtitle.
- Stop the rotation under prefers-reduced-motion.

Return a single HTML file with a <style> block.`,
    steps: [
      "Create a square element much larger than the screen (140vmax) so its corners never show while it rotates.",
      "Paint it with a conic-gradient that is transparent except for two coloured wedges on opposite sides.",
      "Blur it heavily so the wedges become soft beams of light.",
      "Rotate the element with a simple 360-degree keyframe animation.",
      "Place a semi-transparent panel with backdrop-filter on top so the light shows through as a glow.",
    ],
    tips: [
      "Slow the rotation to 30s for a calmer, more premium feel.",
      "Use a single wedge instead of two for a lighthouse-style sweep.",
      "Shrink the beam and place it inside a card with overflow: hidden to make an animated card border glow.",
    ],
  },
];
