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
  {
    slug: "particle-network-background",
    name: "Constellation Particle Network",
    tone: "dark",
    tags: ["canvas", "particles", "interactive", "network", "javascript"],
    description:
      "A constellation of floating nodes on an HTML canvas that connect with proximity lines. Moving the mouse draws connective bonds to the cursor.",
    html: `<div class="network-wrap">
  <canvas id="networkCanvas"></canvas>
  <div class="content">
    <span class="badge">Connected Nodes</span>
    <h1>Particle Network</h1>
    <p>Move mouse to attract and connect nodes.</p>
  </div>
</div>`,
    css: `.network-wrap {
  position: relative;
  min-height: 100vh;
  background: radial-gradient(circle at 50% 40%, #0d122b 0%, #050714 80%);
  display: grid;
  place-items: center;
  overflow: hidden;
  font-family: system-ui, -apple-system, sans-serif;
}

#networkCanvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.content {
  position: relative;
  z-index: 1;
  text-align: center;
  color: #fff;
  padding: 24px;
  pointer-events: none;
}

.badge {
  display: inline-block;
  padding: 5px 14px;
  border-radius: 999px;
  background: rgba(37, 6, 173, 0.4);
  border: 1px solid rgba(255, 123, 0, 0.4);
  color: #ff7b00;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.content h1 {
  font-size: clamp(2rem, 6vw, 4rem);
  margin: 16px 0 0;
  letter-spacing: -0.02em;
}

.content p {
  opacity: 0.75;
  margin-top: 8px;
  font-size: 1.1rem;
}`,
    js: `var canvas = document.getElementById("networkCanvas");
var ctx = canvas.getContext("2d");
var particles = [];
var mouse = { x: null, y: null };
var DIST_MAX = 120;
var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function resize() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  initParticles();
}

function initParticles() {
  particles = [];
  var count = Math.floor((canvas.width * canvas.height) / 9000);
  for (var i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.9,
      vy: (Math.random() - 0.5) * 0.9,
      radius: Math.random() * 1.8 + 1.2
    });
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (var i = 0; i < particles.length; i++) {
    var p = particles[i];

    if (!reduceMotion) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    }

    // Draw particle node
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#818cf8";
    ctx.fill();

    // Connect to mouse
    if (mouse.x !== null) {
      var dxM = mouse.x - p.x;
      var dyM = mouse.y - p.y;
      var distM = Math.sqrt(dxM * dxM + dyM * dyM);
      if (distM < 160) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = "rgba(255, 123, 0, " + (1 - distM / 160) * 0.6 + ")";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    // Connect between particles
    for (var j = i + 1; j < particles.length; j++) {
      var p2 = particles[j];
      var dx = p.x - p2.x;
      var dy = p.y - p2.y;
      var dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < DIST_MAX) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = "rgba(129, 140, 248, " + (1 - dist / DIST_MAX) * 0.35 + ")";
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  }

  if (!reduceMotion) requestAnimationFrame(animate);
}

window.addEventListener("resize", resize);
window.addEventListener("pointermove", function(e) {
  var rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});
window.addEventListener("pointerleave", function() {
  mouse.x = null;
  mouse.y = null;
});

resize();
animate();`,
    prompt: `Create an interactive constellation particle network background using an HTML canvas and vanilla JavaScript.

Requirements:
- A full-viewport container with deep dark radial-gradient background.
- Canvas that resizes dynamically to fit viewport.
- Generate particles based on screen area (roughly 1 node per 9000 square pixels) with random positions and velocities.
- In requestAnimationFrame loop, move particles and bounce off canvas boundaries.
- For each pair of nodes within DIST_MAX (120px), draw a connecting line whose opacity scales inversely with distance.
- When cursor moves over the canvas, connect nearby nodes to cursor position with an orange glowing line.
- Center a title and description with pointer-events: none.
- Prefers-reduced-motion: render static constellation without animation loop.

Return one HTML file with <style> and <script> tags.`,
    steps: [
      "Set up a canvas covering the entire viewport, resizing its buffer on window resize.",
      "Initialize particle objects with coordinates, small velocities, and radii.",
      "In the render loop, update particle positions and bounce off screen edges.",
      "Calculate pairwise Euclidean distance between nodes to draw connecting line segments.",
      "Track pointer position to draw interactive connector lines between cursor and nearby nodes.",
    ],
    tips: [
      "Keep DIST_MAX around 120px to avoid quadratic rendering bottlenecks.",
      "Use pointer events so interactive mouse connections work across touch and trackpad.",
      "Adding a second warm highlight color for mouse links makes the user's cursor feel like an active node.",
    ],
  },
  {
    slug: "cyber-hex-grid-background",
    name: "Cyber Hexagon Matrix",
    tone: "dark",
    tags: ["pattern", "hex", "futuristic", "svg", "css"],
    description:
      "A futuristic honeycomb hexagon grid pattern with a radial focal glow and animated scanning sweep, built with pure inline SVG and CSS.",
    html: `<div class="hex-wrap">
  <div class="hex-glow"></div>
  <div class="hex-grid"></div>
  <div class="hex-scan"></div>
  <div class="content">
    <div class="terminal-tag">SYSTEM ONLINE</div>
    <h1>Hexagon Matrix</h1>
    <p>Pure SVG honeycomb pattern &bull; Zero dependencies</p>
  </div>
</div>`,
    css: `.hex-wrap {
  position: relative;
  min-height: 100vh;
  background: #04060d;
  display: grid;
  place-items: center;
  overflow: hidden;
  font-family: system-ui, -apple-system, sans-serif;
}

.hex-glow {
  position: absolute;
  width: 70vw;
  height: 70vw;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(37, 6, 173, 0.45) 0%, rgba(255, 123, 0, 0.2) 50%, transparent 70%);
  filter: blur(80px);
  pointer-events: none;
}

.hex-grid {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='56' height='96' viewBox='0 0 56 96'><path d='M28 0 L56 16 L56 48 L28 64 L0 48 L0 16 Z M28 48 L56 64 L56 96 L28 112 L0 96 L0 64 Z' fill='none' stroke='rgba(255,255,255,0.08)' stroke-width='1.5'/></svg>");
  background-size: 56px 96px;
  mask-image: radial-gradient(ellipse at center, #000 40%, transparent 80%);
  -webkit-mask-image: radial-gradient(ellipse at center, #000 40%, transparent 80%);
}

.hex-scan {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(255, 123, 0, 0.08) 50%, transparent 100%);
  background-size: 100% 200%;
  animation: scan 8s linear infinite;
  pointer-events: none;
}

@keyframes scan {
  from { background-position: 0 -100%; }
  to   { background-position: 0 100%; }
}

.content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: #fff;
  padding: 24px;
}

.terminal-tag {
  display: inline-block;
  padding: 4px 14px;
  border-radius: 4px;
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.4);
  color: #34d399;
  font-family: monospace;
  font-size: 0.8rem;
  letter-spacing: 0.15em;
  font-weight: 700;
}

.content h1 {
  font-size: clamp(2rem, 6vw, 4.2rem);
  margin: 16px 0 0;
  letter-spacing: -0.02em;
}

.content p {
  color: #94a3b8;
  margin-top: 10px;
  font-size: 1.1rem;
}

@media (prefers-reduced-motion: reduce) {
  .hex-scan { animation: none; }
}`,
    prompt: `Create a futuristic cyberpunk hexagon honeycomb background using pure SVG and CSS.

Requirements:
- Full-viewport container with dark obsidian background (#04060d).
- A central blurred radial glow aura (indigo and orange).
- A repeating honeycomb hexagon grid using an inline SVG data URL in background-image, tiled with background-size 56px 96px.
- Fade out the hexagon grid towards outer edges with a radial mask-image.
- An animated subtle vertical scan line sweep using linear-gradient and keyframe animation.
- Centered terminal badge ("SYSTEM ONLINE") in monospace emerald green, with heading and subtitle.
- No JavaScript, no external images.

Return one HTML file with a <style> block.`,
    steps: [
      "Create a repeating hexagon tile using an SVG path that draws a regular hexagon and repeats at 56px by 96px.",
      "Embed the SVG directly as a data URL in background-image so no external image file is requested.",
      "Add a radial mask-image to fade the pattern gracefully towards the screen edges.",
      "Layer a soft blurred gradient behind the grid to act as an ambient light source.",
      "Animate a subtle vertical linear-gradient sweep to simulate a scanning beam.",
    ],
    tips: [
      "Use SVG data URLs with URL-encoded hex colors (%23 instead of #) for cross-browser safety.",
      "Change the stroke color to neon cyan or lime to suit your cyber/gaming brand aesthetic.",
      "Pure CSS and SVG ensures zero runtime JavaScript overhead.",
    ],
  },
  {
    slug: "cyber-perspective-grid-background",
    name: "3D Cyber Perspective Grid",
    tone: "dark",
    tags: ["grid", "3d", "cyberpunk", "perspective", "retro", "synthwave"],
    description:
      "A receding 3D perspective wireframe grid moving infinitely toward a glowing neon horizon using pure CSS 3D transforms.",
    html: `<div class="grid-scene">
  <div class="horizon-glow"></div>
  <div class="grid-plane"></div>
  <div class="content">
    <span class="badge">Next-Gen Interface</span>
    <h1>Infinite Horizons</h1>
    <p>Pure CSS 3D perspective plane with smooth continuous forward travel.</p>
  </div>
</div>`,
    css: `.grid-scene {
  font-family: system-ui, -apple-system, sans-serif;
  position: relative;
  min-height: 100vh;
  background: #03040b;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  perspective: 500px;
}

.horizon-glow {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background: #06b6d4;
  box-shadow: 0 0 60px 20px #06b6d4, 0 0 120px 40px #8b5cf6;
  z-index: 1;
}

.grid-plane {
  position: absolute;
  bottom: -40%;
  left: -50%;
  right: -50%;
  height: 120%;
  background-image:
    linear-gradient(to right, rgba(6, 182, 212, 0.4) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(6, 182, 212, 0.4) 1px, transparent 1px);
  background-size: 60px 60px;
  transform: rotateX(75deg);
  transform-origin: center bottom;
  animation: gridMove 2.5s linear infinite;
  mask-image: linear-gradient(to top, rgba(0, 0, 0, 1) 40%, transparent 95%);
  -webkit-mask-image: linear-gradient(to top, rgba(0, 0, 0, 1) 40%, transparent 95%);
  z-index: 1;
}

@keyframes gridMove {
  0% { transform: rotateX(75deg) translateY(0); }
  100% { transform: rotateX(75deg) translateY(60px); }
}

.content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 0 20px;
}

.badge {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #38bdf8;
  padding: 6px 14px;
  border-radius: 999px;
  background: rgba(6, 182, 212, 0.12);
  border: 1px solid rgba(6, 182, 212, 0.3);
  margin-bottom: 16px;
}

.content h1 {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 800;
  margin: 0;
  letter-spacing: -1px;
  background: linear-gradient(180deg, #ffffff 40%, #94a3b8);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.content p {
  color: #94a3b8;
  font-size: 17px;
  max-width: 500px;
  margin: 14px auto 0;
  line-height: 1.55;
}

@media (prefers-reduced-motion: reduce) {
  .grid-plane { animation: none; }
}`,
    prompt: `Create a retro-futuristic 3D perspective grid background using pure HTML and CSS.

Requirements:
- Deep dark backdrop (#03040b) with CSS perspective on the parent container.
- An animated grid plane rotated on the X-axis (rotateX: 75deg) using dual linear-gradient grid lines.
- Smooth infinite translateY animation that loops cleanly at background-size intervals (60px).
- A glowing horizontal neon beam across the horizon (cyan and purple box-shadow).
- A vertical mask-image fade so the grid fades naturally into the horizon.
- Centered typography badge, heading, and subtitle.
- Zero JavaScript, respect prefers-reduced-motion.

Return one HTML file with a <style> block.`,
    steps: [
      "Set perspective: 500px on the container to establish 3D viewport depth.",
      "Draw the grid mesh using intersecting linear-gradient background patterns.",
      "Rotate the plane on the X axis to create the illusion of a ground floor.",
      "Animate translateY by the exact repeat size (60px) for seamless looping.",
      "Position a glowing horizon line at the vanishing midpoint.",
    ],
    tips: [
      "Set mask-image gradient so grid lines fade smoothly into the horizon rather than cutting abruptly.",
      "Use tabular numbers or fixed pixel background-size to prevent jump artifacts in the animation.",
    ],
  },
  {
    slug: "floating-constellation-network",
    name: "Interactive Star Constellation",
    tone: "dark",
    tags: ["constellation", "particles", "canvas", "interactive", "space", "stars"],
    description:
      "A dynamic canvas particle constellation with floating star nodes that automatically draw connecting lines when within proximity.",
    html: `<div class="constellation-wrap">
  <canvas id="starCanvas"></canvas>
  <div class="content">
    <span class="badge">Dynamic Neural Mesh</span>
    <h1>Connected Nodes</h1>
    <p>Fluid HTML5 canvas particle network with responsive connection bridges.</p>
  </div>
</div>`,
    css: `.constellation-wrap {
  font-family: system-ui, -apple-system, sans-serif;
  position: relative;
  min-height: 100vh;
  background: #050713;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
}

#starCanvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
}

.content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 0 20px;
  pointer-events: none;
}

.badge {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #818cf8;
  padding: 6px 14px;
  border-radius: 999px;
  background: rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(99, 102, 241, 0.35);
  margin-bottom: 16px;
}

.content h1 {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 800;
  margin: 0;
  letter-spacing: -1px;
}

.content p {
  color: #94a3b8;
  font-size: 17px;
  max-width: 500px;
  margin: 14px auto 0;
  line-height: 1.55;
}`,
    js: `var canvas = document.getElementById("starCanvas");
var ctx = canvas.getContext("2d");
var width = (canvas.width = window.innerWidth);
var height = (canvas.height = window.innerHeight);

window.addEventListener("resize", function() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

var particles = [];
var count = Math.floor(Math.min(width, 1200) / 18);

for (var i = 0; i < count; i++) {
  particles.push({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.8,
    vy: (Math.random() - 0.5) * 0.8,
    radius: Math.random() * 2 + 1.2
  });
}

function draw() {
  ctx.clearRect(0, 0, width, height);

  for (var i = 0; i < particles.length; i++) {
    for (var j = i + 1; j < particles.length; j++) {
      var dx = particles[i].x - particles[j].x;
      var dy = particles[i].y - particles[j].y;
      var dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = "rgba(129, 140, 248, " + (1 - dist / 120) * 0.3 + ")";
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  }

  for (var k = 0; k < particles.length; k++) {
    var p = particles[k];
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > width) p.vx *= -1;
    if (p.y < 0 || p.y > height) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#818cf8";
    ctx.fill();
  }

  requestAnimationFrame(draw);
}

draw();`,
    prompt: `Create an interactive star constellation particle mesh on HTML5 canvas with JavaScript and CSS.

Requirements:
- Fullscreen dark canvas backdrop (#050713).
- Responsive particle count based on screen width.
- Dynamic distance calculation between nodes with connecting strokes that fade out as distance increases.
- Smooth bouncing off viewport boundaries.
- Centered typography badge and title above canvas.

Return one HTML file with <style> and <script> tags.`,
    steps: [
      "Initialize canvas full width and height with resize listener.",
      "Populate particle array with random positions and velocities.",
      "Calculate euclidean distance in nested loop and render connecting line bridges.",
      "Update particle coordinates in requestAnimationFrame loop.",
    ],
    tips: [
      "Keep connecting distance below 130px to maintain clean readability.",
      "Add pointer-events: none on overlay text so canvas click/hover events pass through.",
    ],
  },
  {
    slug: "retro-crt-scanline-backdrop",
    name: "Retro CRT Terminal Backdrop",
    tone: "dark",
    tags: ["retro", "crt", "scanline", "terminal", "matrix", "hacker"],
    description:
      "A vintage CRT monitor effect with animated horizontal scanlines, radial edge vignette, and glowing phosphorescent green text.",
    html: `<div class="crt-screen">
  <div class="scanlines"></div>
  <div class="crt-vignette"></div>
  <div class="crt-terminal">
    <div class="crt-code">&gt; SYSTEM ARCHITECTURE READY...</div>
    <div class="crt-code">&gt; RUNNING PROTOCOL 0x4829F...</div>
    <h1>TERMINAL ONLINE</h1>
    <p>Phosphor green scanline raster simulation in pure CSS.</p>
  </div>
</div>`,
    css: `.crt-screen {
  font-family: monospace;
  position: relative;
  min-height: 100vh;
  background: #020b05;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #34d399;
}

.scanlines {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    rgba(18, 16, 16, 0) 50%,
    rgba(0, 0, 0, 0.4) 50%
  );
  background-size: 100% 4px;
  pointer-events: none;
  z-index: 2;
}

.crt-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, transparent 60%, rgba(0, 0, 0, 0.8) 100%);
  pointer-events: none;
  z-index: 3;
}

.crt-terminal {
  position: relative;
  z-index: 1;
  text-align: center;
  text-shadow: 0 0 10px rgba(52, 211, 153, 0.8);
  padding: 0 20px;
}

.crt-code {
  font-size: 14px;
  color: #10b981;
  margin-bottom: 8px;
}

.crt-terminal h1 {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  letter-spacing: 4px;
  margin: 16px 0;
}

.crt-terminal p {
  font-size: 16px;
  color: #6ee7b7;
  max-width: 500px;
  margin: 0 auto;
}`,
    prompt: `Create a retro CRT terminal monitor background with scanlines and green phosphor glow in pure HTML and CSS.

Requirements:
- Deep dark green monitor background (#020b05).
- Tiled scanline pattern using a 4px linear-gradient with pointer-events: none.
- Radial gradient vignette around viewport edges to mimic curved glass monitors.
- Phosphor green typography with matching text-shadow glow effect.
- Zero JavaScript.

Return one HTML file with a <style> block.`,
    steps: [
      "Layer a repeating horizontal scanline gradient across the full viewport.",
      "Add a radial vignette overlay darkening the four outer corners.",
      "Apply neon text-shadow to typography to mimic cathode ray tube phosphor blooming.",
    ],
    tips: [
      "Use background-size: 100% 4px to keep scanline rows tight and authentic.",
    ],
  },
  {
    slug: "aurora-borealis-waves",
    name: "Aurora Borealis Waves",
    tone: "dark",
    tags: ["aurora", "waves", "northern-lights", "animated", "background"],
    colors: ["#020617", "#10b981", "#06b6d4", "#8b5cf6"],
    description: "Multi-layered undulating aurora wave ribbons with glowing emerald, cyan, and violet gradients flowing over an arctic night sky.",
    html: `<div class="aurora-wrapper">
  <div class="aurora-sky">
    <div class="aurora-layer a1"></div>
    <div class="aurora-layer a2"></div>
    <div class="aurora-layer a3"></div>
  </div>
  <div class="aurora-content">
    <span class="aurora-badge">Ethereal Motion</span>
    <h1>Northern Lights</h1>
    <p>Pure CSS animated mesh gradients simulating geomagnetic luminescence in the upper atmosphere.</p>
  </div>
</div>`,
    css: `.aurora-wrapper {
  position: relative;
  min-height: 100vh;
  background: #020617;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #ffffff;
}

.aurora-sky {
  position: absolute;
  inset: -50%;
  pointer-events: none;
  filter: blur(60px);
  opacity: 0.75;
}

.aurora-layer {
  position: absolute;
  inset: 0;
  border-radius: 40%;
}

.a1 {
  background: radial-gradient(ellipse at 40% 30%, rgba(16, 185, 129, 0.6) 0%, transparent 60%);
  animation: auroraFloat1 16s ease-in-out infinite alternate;
}

.a2 {
  background: radial-gradient(ellipse at 70% 60%, rgba(6, 182, 212, 0.6) 0%, transparent 60%);
  animation: auroraFloat2 20s ease-in-out infinite alternate;
}

.a3 {
  background: radial-gradient(ellipse at 30% 80%, rgba(139, 92, 246, 0.5) 0%, transparent 60%);
  animation: auroraFloat3 18s ease-in-out infinite alternate;
}

@keyframes auroraFloat1 {
  0%   { transform: rotate(0deg) scale(1) translate(0, 0); }
  100% { transform: rotate(45deg) scale(1.25) translate(8%, 10%); }
}

@keyframes auroraFloat2 {
  0%   { transform: rotate(180deg) scale(1.1) translate(-5%, -5%); }
  100% { transform: rotate(135deg) scale(0.9) translate(10%, -10%); }
}

@keyframes auroraFloat3 {
  0%   { transform: rotate(-90deg) scale(0.95) translate(10%, 5%); }
  100% { transform: rotate(-45deg) scale(1.2) translate(-10%, -8%); }
}

.aurora-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 600px;
  padding: 0 24px;
}

.aurora-badge {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #6ee7b7;
  padding: 5px 16px;
  border-radius: 999px;
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.3);
  margin-bottom: 20px;
}

.aurora-content h1 {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 900;
  letter-spacing: -2px;
  margin: 0 0 16px;
  background: linear-gradient(135deg, #ffffff 40%, #6ee7b7 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.aurora-content p {
  font-size: 18px;
  color: #94a3b8;
  line-height: 1.6;
  margin: 0;
}

@media (prefers-reduced-motion: reduce) {
  .aurora-layer { animation: none; }
}`,
    prompt: `Create a glowing Aurora Borealis waves background in HTML and CSS.

Requirements:
- Deep night sky background (#020617).
- Multiple blurred radial-gradient layers (emerald, cyan, violet) with heavy blur (filter: blur(60px)).
- Smooth organic keyframe rotation and translation mimicking shifting polar lights.
- Centered typography with gradient clipped text.
- prefers-reduced-motion support.

Return one HTML file with a <style> block.`,
    steps: [
      "Layer multiple radial gradient elements with oversized dimensions inside an absolute wrapper.",
      "Apply heavy blur filter on parent container for liquid light diffusion.",
      "Animate layers with varying duration and alternate directions for non-repeating flow.",
    ],
    tips: [
      "Using inset: -50% ensures blurred edges never clip against the viewport borders.",
    ],
  },
  {
    slug: "isometric-3d-grid",
    name: "Isometric 3D Wireframe Grid",
    tone: "dark",
    tags: ["grid", "isometric", "perspective", "wireframe", "background"],
    colors: ["#050814", "#3b82f6", "#1d4ed8", "#60a5fa"],
    description: "A perspective-tilted 3D wireframe plane with cyber coordinate lines and depth fade for infrastructure interfaces.",
    html: `<div class="iso-wrapper">
  <div class="iso-plane"></div>
  <div class="iso-vignette"></div>
  <div class="iso-content">
    <div class="iso-pill">Infrastructure Plane</div>
    <h1>Global Mesh Fabric</h1>
    <p>Perspective-projected coordinate terrain with infinite distance horizon fade.</p>
  </div>
</div>`,
    css: `.iso-wrapper {
  position: relative;
  min-height: 100vh;
  background: #050814;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 800px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #ffffff;
}

.iso-plane {
  position: absolute;
  width: 200%;
  height: 200%;
  top: -50%;
  left: -50%;
  background-image: 
    linear-gradient(to right, rgba(59, 130, 246, 0.25) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(59, 130, 246, 0.25) 1px, transparent 1px);
  background-size: 60px 60px;
  transform: rotateX(65deg) translateZ(0);
  transform-origin: center center;
  animation: isoScroll 20s linear infinite;
}

@keyframes isoScroll {
  from { background-position: 0 0; }
  to   { background-position: 0 600px; }
}

.iso-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 30%, #050814 85%);
  pointer-events: none;
}

.iso-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 620px;
  padding: 0 24px;
}

.iso-pill {
  display: inline-block;
  font-size: 11.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #60a5fa;
  padding: 4px 14px;
  border-radius: 999px;
  background: rgba(59, 130, 246, 0.12);
  border: 1px solid rgba(59, 130, 246, 0.35);
  margin-bottom: 18px;
}

.iso-content h1 {
  font-size: clamp(2.5rem, 5.5vw, 4.2rem);
  font-weight: 800;
  letter-spacing: -1.5px;
  margin: 0 0 16px;
}

.iso-content p {
  font-size: 17.5px;
  color: #94a3b8;
  line-height: 1.6;
  margin: 0;
}

@media (prefers-reduced-motion: reduce) {
  .iso-plane { animation: none; }
}`,
    prompt: `Create a perspective 3D isometric wireframe grid background in HTML and CSS.

Requirements:
- Dark space background (#050814).
- 3D perspective plane with rotateX(65deg) creating an infinite floor effect.
- Tiled 60px grid pattern created using two linear-gradient strokes.
- Linear vertical animation scrolling forward smoothly.
- Radial vignette mask on top to fade horizon and edges into black.

Return one HTML file with a <style> block.`,
    steps: [
      "Set perspective on wrapper and rotate plane with transform: rotateX(65deg).",
      "Generate grid with two perpendicular linear gradients.",
      "Animate background-position along Y axis for endless forward movement.",
    ],
    tips: [
      "Add a radial vignette overlay so the sharp grid edges fade seamlessly at the horizon.",
    ],
  },
  {
    slug: "interactive-spotlight-beam",
    name: "Interactive Spotlight Beam",
    tone: "dark",
    tags: ["spotlight", "interactive", "flashlight", "mouse", "background"],
    colors: ["#090d16", "#38bdf8", "#0284c7", "#ffffff"],
    description: "A mouse-following radial flashlight beam illuminating an underlying dark dot matrix pattern in real time.",
    html: `<div class="spot-wrapper" id="spotContainer">
  <div class="spot-grid"></div>
  <div class="spot-light" id="spotLight"></div>
  <div class="spot-content">
    <div class="spot-badge">Mouse Reactive</div>
    <h1>Hover to Illuminate</h1>
    <p>Move your cursor anywhere across the canvas to aim the concentrated optical spotlight beam.</p>
  </div>
</div>`,
    css: `.spot-wrapper {
  position: relative;
  min-height: 100vh;
  background: #090d16;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #ffffff;
}

.spot-grid {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255, 255, 255, 0.12) 1.5px, transparent 1.5px);
  background-size: 28px 28px;
  pointer-events: none;
}

.spot-light {
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.22) 0%, rgba(56, 189, 248, 0.05) 45%, transparent 70%);
  pointer-events: none;
  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;
  transition: width 0.3s ease, height 0.3s ease;
}

.spot-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 580px;
  padding: 0 24px;
  pointer-events: none;
}

.spot-badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #38bdf8;
  padding: 4px 14px;
  border-radius: 999px;
  background: rgba(56, 189, 248, 0.1);
  border: 1px solid rgba(56, 189, 248, 0.3);
  margin-bottom: 18px;
}

.spot-content h1 {
  font-size: clamp(2.4rem, 5vw, 4rem);
  font-weight: 800;
  letter-spacing: -1.5px;
  margin: 0 0 16px;
}

.spot-content p {
  font-size: 17px;
  color: #94a3b8;
  line-height: 1.6;
  margin: 0;
}`,
    js: `var container = document.getElementById("spotContainer");
var light = document.getElementById("spotLight");

container.addEventListener("mousemove", function(e) {
  var rect = container.getBoundingClientRect();
  var x = e.clientX - rect.left;
  var y = e.clientY - rect.top;
  light.style.left = x + "px";
  light.style.top = y + "px";
});`,
    prompt: `Create an interactive mouse-following spotlight background in HTML, CSS and vanilla JavaScript.

Requirements:
- Dark background (#090d16) with subtle dot-matrix pattern.
- Glowing radial gradient circle positioned absolutely with pointer-events: none.
- JavaScript mousemove listener tracking pointer coordinates and updating beam position in real time.
- Centered typography on top.

Return one HTML file with <style> and <script> tags.`,
    steps: [
      "Create dot grid backdrop using radial-gradient background-image.",
      "Add radial gradient spotlight element centered with transform: translate(-50%, -50%).",
      "Update spotlight left and top inline styles on container mousemove event.",
    ],
    tips: [
      "Set pointer-events: none on spotlight element to avoid intercepting cursor interactions.",
    ],
  },
  {
    slug: "cyberpunk-rain-matrix",
    name: "Cyberpunk Digital Rain Canvas",
    tone: "dark",
    tags: ["matrix", "digital-rain", "canvas", "cyberpunk", "background"],
    colors: ["#000000", "#10b981", "#22c55e", "#052e16"],
    description: "A classic Matrix-inspired falling digital rain background rendered on an HTML5 canvas with fading phosphorescent green trails.",
    html: `<div class="matrix-stage">
  <canvas id="matrixCanvas" class="matrix-canvas"></canvas>
  <div class="matrix-overlay"></div>
  <div class="matrix-content">
    <div class="matrix-badge">System Protocol v4.2</div>
    <h1>Decrypted Stream</h1>
    <p>High-frequency digital phosphor waterfall rendered with native 60fps HTML5 Canvas API.</p>
  </div>
</div>`,
    css: `.matrix-stage {
  position: relative;
  min-height: 100vh;
  background: #000000;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #ffffff;
}

.matrix-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.matrix-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, transparent 30%, rgba(0, 0, 0, 0.85) 90%);
  pointer-events: none;
}

.matrix-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 580px;
  padding: 0 24px;
}

.matrix-badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #34d399;
  padding: 4px 14px;
  border-radius: 999px;
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.35);
  margin-bottom: 18px;
}

.matrix-content h1 {
  font-size: clamp(2.5rem, 6vw, 4.2rem);
  font-weight: 900;
  letter-spacing: -1.5px;
  margin: 0 0 16px;
  color: #ffffff;
  text-shadow: 0 0 20px rgba(52, 211, 153, 0.6);
}

.matrix-content p {
  font-size: 17px;
  color: #a7f3d0;
  line-height: 1.6;
  margin: 0;
}`,
    js: `var canvas = document.getElementById("matrixCanvas");
var ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

var chars = "0123456789ABCDEFｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ";
var fontSize = 16;
var cols = Math.floor(canvas.width / fontSize);
var drops = [];
for (var i = 0; i < cols; i++) {
  drops[i] = Math.random() * -100;
}

function draw() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#10b981";
  ctx.font = fontSize + "px monospace";

  for (var i = 0; i < drops.length; i++) {
    var text = chars[Math.floor(Math.random() * chars.length)];
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
  requestAnimationFrame(draw);
}
draw();`,
    prompt: `Create a classic Matrix cyberpunk digital rain canvas background in HTML, CSS and vanilla JavaScript.

Requirements:
- HTML5 canvas filling full viewport.
- Falling character streams using alphanumeric and katakana glyphs.
- Semi-transparent black fillRect on each animation frame to create phosphorescent green fading trails.
- Responsive window resize listener.
- Dark radial vignette overlay keeping center text legible.

Return one HTML file with <style> and <script> tags.`,
    steps: [
      "Initialize canvas and calculate columns = canvas.width / fontSize.",
      "Store drop Y positions in an array.",
      "In draw loop, fade previous frame with rgba(0, 0, 0, 0.05) and draw random characters in green.",
    ],
    tips: [
      "Use requestAnimationFrame instead of setInterval for smooth 60fps rendering without jank.",
    ],
  },
  {
    slug: "fluid-blob-mesh",
    name: "Fluid Morphing Blob Mesh",
    tone: "dark",
    tags: ["blobs", "morphing", "fluid", "animated", "background"],
    colors: ["#020617", "#ec4899", "#8b5cf6", "#38bdf8"],
    description: "Organic fluid morphing CSS blob shapes with fluid border-radius animations and glowing color gradients.",
    html: `<div class="blob-wrapper">
  <div class="blob-stage">
    <div class="morph-blob mb-1"></div>
    <div class="morph-blob mb-2"></div>
    <div class="morph-blob mb-3"></div>
  </div>
  <div class="blob-glass"></div>
  <div class="blob-content">
    <span class="blob-badge">Organic Physics</span>
    <h1>Liquid Morphology</h1>
    <p>Pure CSS border-radius morphing keyframes simulating molten fluid dynamics.</p>
  </div>
</div>`,
    css: `.blob-wrapper {
  position: relative;
  min-height: 100vh;
  background: #020617;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #ffffff;
}

.blob-stage {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.morph-blob {
  position: absolute;
  border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  filter: blur(50px);
  opacity: 0.65;
}

.mb-1 {
  width: 480px;
  height: 480px;
  background: linear-gradient(135deg, #ec4899, #be185d);
  animation: blobMorph 12s ease-in-out infinite alternate, blobSpin 24s linear infinite;
}

.mb-2 {
  width: 420px;
  height: 420px;
  background: linear-gradient(135deg, #8b5cf6, #3b82f6);
  animation: blobMorph 16s ease-in-out infinite alternate-reverse, blobSpin 30s linear infinite reverse;
}

.mb-3 {
  width: 360px;
  height: 360px;
  background: linear-gradient(135deg, #38bdf8, #06b6d4);
  animation: blobMorph 14s ease-in-out infinite alternate;
}

@keyframes blobMorph {
  0%   { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
  50%  { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
  100% { border-radius: 70% 30% 50% 50% / 30% 40% 60% 70%; }
}

@keyframes blobSpin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

.blob-glass {
  position: absolute;
  inset: 0;
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  background: rgba(2, 6, 23, 0.4);
}

.blob-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 600px;
  padding: 0 24px;
}

.blob-badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #f472b6;
  padding: 4px 14px;
  border-radius: 999px;
  background: rgba(236, 72, 153, 0.12);
  border: 1px solid rgba(236, 72, 153, 0.35);
  margin-bottom: 18px;
}

.blob-content h1 {
  font-size: clamp(2.5rem, 6vw, 4.4rem);
  font-weight: 900;
  letter-spacing: -2px;
  margin: 0 0 16px;
}

.blob-content p {
  font-size: 17.5px;
  color: #94a3b8;
  line-height: 1.6;
  margin: 0;
}

@media (prefers-reduced-motion: reduce) {
  .morph-blob { animation: none; }
}`,
    prompt: `Create an animated fluid morphing blob mesh background in HTML and CSS.

Requirements:
- Organic blob elements animating border-radius between asymmetric percentages.
- Combination of rotating transform and morphing keyframes.
- Heavy blur filter (filter: blur(50px)) and top frosted glass overlay.
- Centered typography on top.
- prefers-reduced-motion compatibility.

Return one HTML file with a <style> block.`,
    steps: [
      "Use 8-value border-radius (e.g. 60% 40% 30% 70% / 60% 30% 70% 40%) to create organic asymmetric blobs.",
      "Animate border-radius across keyframes for fluid stretching.",
      "Layer multiple colorful blobs and add backdrop-filter blur for luminous glow.",
    ],
    tips: [
      "Pair border-radius morphing with a slow rotate(360deg) animation for seamless organic variation.",
    ],
  },
  {
    slug: "hexagonal-honeycomb-pattern",
    name: "Futuristic Honeycomb Grid Backdrop",
    tone: "dark",
    tags: ["hex", "honeycomb", "pattern", "cyber", "background"],
    colors: ["#080c14", "#0284c7", "#38bdf8", "#ffffff"],
    description: "A geometric dark hexagonal honeycomb pattern with glowing cyan coordinates and responsive vignette fade.",
    html: `<div class="hex-pattern-stage">
  <div class="hex-grid-layer"></div>
  <div class="hex-vignette-layer"></div>
  <div class="hex-pattern-content">
    <div class="hp-badge">Cyber Grid Architecture</div>
    <h1>Hexagonal Matrix</h1>
    <p>Modular tessellated geometry engineered for deep tech and Web3 enterprise platforms.</p>
  </div>
</div>`,
    css: `.hex-pattern-stage {
  position: relative;
  min-height: 100vh;
  background: #080c14;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #ffffff;
}

.hex-grid-layer {
  position: absolute;
  inset: 0;
  background-color: #080c14;
  background-image: 
    radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.15) 1.5px, transparent 1.5px),
    linear-gradient(60deg, rgba(2, 132, 199, 0.08) 25%, transparent 25.5%, transparent 75%, rgba(2, 132, 199, 0.08) 75.5%),
    linear-gradient(120deg, rgba(2, 132, 199, 0.08) 25%, transparent 25.5%, transparent 75%, rgba(2, 132, 199, 0.08) 75.5%);
  background-size: 56px 97px;
  opacity: 0.8;
}

.hex-vignette-layer {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, transparent 35%, #080c14 90%);
  pointer-events: none;
}

.hex-pattern-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 580px;
  padding: 0 24px;
}

.hp-badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #38bdf8;
  padding: 4px 14px;
  border-radius: 999px;
  background: rgba(56, 189, 248, 0.1);
  border: 1px solid rgba(56, 189, 248, 0.3);
  margin-bottom: 18px;
}

.hex-pattern-content h1 {
  font-size: clamp(2.4rem, 5.5vw, 4.2rem);
  font-weight: 900;
  letter-spacing: -1.5px;
  margin: 0 0 16px;
}

.hex-pattern-content p {
  font-size: 17.5px;
  color: #94a3b8;
  line-height: 1.6;
  margin: 0;
}`,
    prompt: `Create a futuristic dark honeycomb grid background in pure HTML and CSS.

Requirements:
- Seamless tessellated hexagonal texture using CSS linear-gradient angles (60deg and 120deg).
- Center starlight dot accents.
- Radial dark vignette keeping center typography legible.
- Zero JavaScript, lightweight, and scalable.

Return one HTML file with a <style> block.`,
    steps: [
      "Combine 60deg and 120deg linear gradients with repeating background-size.",
      "Add radial-gradient dots at the vertex intersections.",
      "Layer a radial vignette mask over top to soften the pattern toward the edges.",
    ],
    tips: [
      "Using background-size: 56px 97px preserves mathematical hexagonal proportions (sqrt(3)/2).",
    ],
  },
  {
    slug: "starlight-twinkle-canvas",
    name: "Deep Space Starlight Canvas",
    tone: "dark",
    tags: ["stars", "canvas", "space", "starlight", "background"],
    colors: ["#02040a", "#38bdf8", "#818cf8", "#ffffff"],
    description: "A rich cosmic starfield canvas with twinkling stars of varying brightness and occasional shooting star streaks.",
    html: `<div class="space-stage">
  <canvas id="spaceCanvas" class="space-canvas"></canvas>
  <div class="space-overlay"></div>
  <div class="space-content">
    <div class="space-badge">Deep Space Orbit</div>
    <h1>Interstellar Horizon</h1>
    <p>Dynamic procedural starfield simulation with realistic stellar magnitude and atmospheric scintillation.</p>
  </div>
</div>`,
    css: `.space-stage {
  position: relative;
  min-height: 100vh;
  background: #02040a;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #ffffff;
}

.space-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.space-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(129, 140, 248, 0.08) 0%, transparent 70%);
  pointer-events: none;
}

.space-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 580px;
  padding: 0 24px;
}

.space-badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #a5b4fc;
  padding: 4px 14px;
  border-radius: 999px;
  background: rgba(129, 140, 248, 0.12);
  border: 1px solid rgba(129, 140, 248, 0.3);
  margin-bottom: 18px;
}

.space-content h1 {
  font-size: clamp(2.5rem, 6vw, 4.2rem);
  font-weight: 900;
  letter-spacing: -1.5px;
  margin: 0 0 16px;
  background: linear-gradient(135deg, #ffffff 40%, #c7d2fe 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.space-content p {
  font-size: 17.5px;
  color: #94a3b8;
  line-height: 1.6;
  margin: 0;
}`,
    js: `var canvas = document.getElementById("spaceCanvas");
var ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

var stars = [];
var starCount = 200;
for (var i = 0; i < starCount; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 1.5 + 0.5,
    alpha: Math.random(),
    speed: Math.random() * 0.02 + 0.005
  });
}

function animateStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (var i = 0; i < stars.length; i++) {
    var s = stars[i];
    s.alpha += s.speed;
    if (s.alpha > 1 || s.alpha < 0) s.speed = -s.speed;

    ctx.beginPath();
    ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, " + Math.abs(s.alpha) + ")";
    ctx.fill();
  }
  requestAnimationFrame(animateStars);
}
animateStars();`,
    prompt: `Create a twinkling starlight canvas background in HTML, CSS and vanilla JavaScript.

Requirements:
- Fullscreen HTML5 canvas element with deep space backdrop (#02040a).
- Array of star objects with randomized X, Y, radius, and oscillating alpha opacity.
- 60fps requestAnimationFrame loop.
- Responsive resize handler.
- Centered typography on top.

Return one HTML file with <style> and <script> tags.`,
    steps: [
      "Generate an array of star coordinates with random radius and scintillation rates.",
      "In animation loop, update opacity values with sine-like oscillation.",
      "Draw stars using context.arc() and rgba() fillStyle.",
    ],
    tips: [
      "Vary star radii between 0.5px and 2px to mimic genuine astronomical apparent magnitude.",
    ],
  },
];
