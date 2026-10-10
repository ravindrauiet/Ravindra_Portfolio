// 3D scene library. Three techniques are covered:
//   1. CSS 3D transforms (no JavaScript or very little)
//   2. 3D maths projected onto a 2D canvas (no libraries)
//   3. WebGL with Three.js, loaded as an ES module from a CDN (module: true)

const FONT = `font-family: system-ui, -apple-system, "Segoe UI", sans-serif;`;

const STAGE = `html { overflow: hidden; }
body {
  min-height: 100vh;
  display: grid;
  place-items: center;
  overflow: hidden;
  background: radial-gradient(circle at 50% 30%, #1a2350 0%, #060816 70%);
  ${FONT}
}`;

const THREE_CDN = "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

export const scenes = [
  {
    slug: "rotating-3d-cube",
    name: "Rotating 3D Cube",
    tone: "dark",
    tags: ["css 3d", "cube", "transform", "animation", "no javascript"],
    description:
      "A true 3D cube built from six HTML elements and CSS transforms. It spins continuously and pauses on hover. No JavaScript, no canvas, no libraries.",
    html: `<div class="scene">
  <div class="cube">
    <div class="face front">Front</div>
    <div class="face back">Back</div>
    <div class="face right">Right</div>
    <div class="face left">Left</div>
    <div class="face top">Top</div>
    <div class="face bottom">Bottom</div>
  </div>
</div>`,
    css: `${STAGE}

/* 1. The scene sets the camera distance */
.scene {
  width: 200px;
  height: 200px;
  perspective: 800px;
}

/* 2. The cube keeps its children in 3D space and spins */
.cube {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  animation: spin 12s linear infinite;
}
.scene:hover .cube { animation-play-state: paused; }

/* 3. Every face is the same square, moved to a different side */
.face {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  border: 2px solid rgba(255, 255, 255, 0.6);
  background: rgba(37, 6, 173, 0.55);
  color: #fff;
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 0.05em;
}
.front  { transform: rotateY(0deg)   translateZ(100px); }
.back   { transform: rotateY(180deg) translateZ(100px); }
.right  { transform: rotateY(90deg)  translateZ(100px); }
.left   { transform: rotateY(-90deg) translateZ(100px); }
.top    { transform: rotateX(90deg)  translateZ(100px); background: rgba(255, 123, 0, 0.6); }
.bottom { transform: rotateX(-90deg) translateZ(100px); background: rgba(255, 123, 0, 0.6); }

@keyframes spin {
  from { transform: rotateX(-20deg) rotateY(0deg); }
  to   { transform: rotateX(-20deg) rotateY(360deg); }
}

@media (prefers-reduced-motion: reduce) {
  .cube { animation: none; transform: rotateX(-20deg) rotateY(30deg); }
}`,
    prompt: `Create a rotating 3D cube using only HTML and CSS (no JavaScript, no canvas, no libraries).

Requirements:
- A "scene" wrapper, 200px square, with perspective: 800px.
- Inside it a "cube" element with transform-style: preserve-3d that holds six absolutely positioned "face" divs labelled Front, Back, Right, Left, Top and Bottom.
- Position each face with a rotation followed by translateZ(100px) (half the cube size): front rotateY(0), back rotateY(180deg), right rotateY(90deg), left rotateY(-90deg), top rotateX(90deg), bottom rotateX(-90deg).
- Faces are semi-transparent indigo (rgba(37,6,173,0.55)) with a 2px translucent white border and white bold labels; the top and bottom faces are semi-transparent orange.
- Animate the cube with a keyframe animation that keeps rotateX(-20deg) and rotates rotateY from 0 to 360deg over 12 seconds, linear, infinite. Pause it on hover.
- Under prefers-reduced-motion, stop the animation and show the cube at a fixed angle.
- Centre it on a dark radial-gradient page.

Return one HTML file with the CSS in a <style> tag.`,
    steps: [
      "Add perspective to a parent element. Perspective is the distance between the viewer and the scene; without it, 3D rotations look flat. Smaller values exaggerate the depth.",
      "Give the cube transform-style: preserve-3d. By default a browser flattens children into their parent's plane; this property keeps them in real 3D space.",
      "Stack all six faces in the same place with position: absolute and inset: 0.",
      "Move each face outward. The order matters: rotate the face to point in its direction first, then translateZ by half the cube's size to push it out along that direction.",
      "Animate the cube element, not the faces. Rotating the parent rotates all six faces together as one solid object.",
      "Keep a constant rotateX in both keyframes so you look slightly down at the cube and can see its top.",
    ],
    tips: [
      "To resize the cube, change the scene width and height and set every translateZ to half that value.",
      "Put images or content inside the faces to make a 3D product box or image cube.",
      "Add backface-visibility: hidden with opaque backgrounds for a solid cube where you cannot see through to the back.",
    ],
  },
  {
    slug: "3d-flip-card",
    name: "3D Flip Card",
    tone: "dark",
    tags: ["css 3d", "card", "flip", "hover", "no javascript"],
    description:
      "A card that flips over in 3D to reveal its back when hovered, tapped or focused with the keyboard. Useful for pricing reveals, team profiles and flashcards.",
    html: `<div class="flip" tabindex="0" role="button" aria-label="Flip card: hover or focus to see the back">
  <div class="flip-inner">
    <div class="side front">
      <span class="badge">Hover me</span>
      <h3>Pro Plan</h3>
      <p>Everything you need to ship.</p>
    </div>
    <div class="side back">
      <h3>&#8377;999 / month</h3>
      <ul>
        <li>Unlimited projects</li>
        <li>Priority support</li>
        <li>Custom domain</li>
      </ul>
    </div>
  </div>
</div>`,
    css: `${STAGE}

.flip {
  width: min(84vw, 300px);
  aspect-ratio: 3 / 4;
  perspective: 1000px;
  cursor: pointer;
  outline: none;
}

.flip-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.8s cubic-bezier(0.2, 0.7, 0.2, 1);
}

/* Flip on hover, and on keyboard focus for accessibility */
.flip:hover .flip-inner,
.flip:focus-visible .flip-inner {
  transform: rotateY(180deg);
}
.flip:focus-visible .side { outline: 3px solid #ff7b00; outline-offset: 4px; }

.side {
  position: absolute;
  inset: 0;
  padding: 28px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  border-radius: 22px;
  color: #fff;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.45);
}

.front { background: linear-gradient(150deg, #2506ad, #002057); }

/* The back starts already turned around, so it faces us after the flip */
.back {
  background: linear-gradient(150deg, #ff7b00, #b45309);
  transform: rotateY(180deg);
  justify-content: center;
}

.badge {
  align-self: flex-start;
  margin-bottom: auto;
  padding: 5px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  font-size: 0.75rem;
  font-weight: 700;
}
.side h3 { margin: 0; font-size: 1.7rem; }
.side p { margin: 6px 0 0; opacity: 0.8; }
.side ul { margin: 16px 0 0; padding-left: 18px; line-height: 1.9; }

@media (prefers-reduced-motion: reduce) {
  .flip-inner { transition-duration: 0.01s; }
}`,
    prompt: `Create a 3D flip card using only HTML and CSS (no JavaScript).

Requirements:
- A wrapper (min(84vw, 300px) wide, aspect-ratio 3/4) with perspective: 1000px, tabindex="0", role="button" and an aria-label.
- An inner element with transform-style: preserve-3d and a 0.8s transform transition.
- Two absolutely positioned sides, "front" and "back", both with backface-visibility: hidden (plus the -webkit- prefix), 22px radius and a deep shadow.
- The front has an indigo-to-navy gradient, a "Hover me" pill badge at the top, a heading "Pro Plan" and one line of text at the bottom.
- The back has an orange gradient, is pre-rotated with transform: rotateY(180deg), and shows a price in rupees with a three-item feature list.
- On :hover and :focus-visible of the wrapper, rotate the inner element rotateY(180deg). Show a visible focus outline.
- Under prefers-reduced-motion, make the flip effectively instant.
- Centre it on a dark background.

Return one HTML file with a <style> block.`,
    steps: [
      "Set perspective on the outer wrapper so the flip has depth.",
      "Put both sides inside an inner element with transform-style: preserve-3d. This inner element is what rotates.",
      "Place the front and back on top of each other with position: absolute.",
      "Rotate the back face 180 degrees in advance. It now faces away from you, back to back with the front.",
      "Add backface-visibility: hidden to both sides. A side becomes invisible when it faces away, so you only ever see the one pointing at you.",
      "Rotate the inner element 180 degrees on hover. The front turns away and disappears; the back turns towards you.",
      "Add tabindex and a :focus-visible rule so keyboard users can flip the card too.",
    ],
    tips: [
      "Use rotateX instead of rotateY for a vertical flip.",
      "On touch devices, hover is unreliable: toggle a class on click with one line of JavaScript.",
      "Keep both sides the same size; the container does not grow to fit absolutely positioned children.",
    ],
  },
  {
    slug: "3d-carousel-ring",
    name: "3D Carousel Ring",
    tone: "dark",
    tags: ["css 3d", "carousel", "gallery", "animation", "no javascript"],
    description:
      "Eight panels arranged in a circle in 3D space, rotating like a carousel. The radius is calculated with trigonometry so the panels meet edge to edge.",
    html: `<div class="stage">
  <div class="ring">
    <div class="panel" style="--i: 0">React</div>
    <div class="panel" style="--i: 1">Next.js</div>
    <div class="panel" style="--i: 2">Node.js</div>
    <div class="panel" style="--i: 3">MongoDB</div>
    <div class="panel" style="--i: 4">Python</div>
    <div class="panel" style="--i: 5">AWS</div>
    <div class="panel" style="--i: 6">Docker</div>
    <div class="panel" style="--i: 7">AI</div>
  </div>
</div>`,
    css: `${STAGE}

.stage {
  width: 170px;
  height: 220px;
  perspective: 1100px;
}

.ring {
  --count: 8;
  --radius: 235px; /* (panel width / 2) / tan(180deg / count) + a small gap */
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  animation: turn 24s linear infinite;
}
.stage:hover .ring { animation-play-state: paused; }

.panel {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: linear-gradient(160deg, #2506ad, #002057);
  color: #fff;
  font-size: 1.2rem;
  font-weight: 700;
  /* Hide panels that face away, so the back of the ring does not show through */
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  /* Turn each panel to its angle, then push it out to the edge of the ring */
  transform: rotateY(calc(var(--i) * 360deg / var(--count))) translateZ(var(--radius));
}
.panel:nth-child(even) {
  background: linear-gradient(160deg, #ff7b00, #b45309);
}

@keyframes turn {
  from { transform: translateZ(-235px) rotateY(0deg); }
  to   { transform: translateZ(-235px) rotateY(-360deg); }
}

@media (prefers-reduced-motion: reduce) {
  .ring { animation: none; transform: translateZ(-235px) rotateY(-20deg); }
}`,
    prompt: `Create a rotating 3D carousel ring using only HTML and CSS (no JavaScript).

Requirements:
- A stage, 170px wide and 220px tall, with perspective: 1100px.
- A "ring" element with transform-style: preserve-3d that contains eight panels (labels: React, Next.js, Node.js, MongoDB, Python, AWS, Docker, AI). Give each panel an inline CSS variable --i from 0 to 7.
- Each panel is absolutely positioned to fill the stage and transformed with rotateY(calc(var(--i) * 360deg / 8)) translateZ(235px), so the eight panels form a circle. (235px is roughly (170 / 2) / tan(22.5deg) plus a small gap.)
- Panels have an 18px radius, a translucent white border, white bold text and alternate between a solid indigo gradient and a solid orange gradient. Add backface-visibility: hidden (with the -webkit- prefix) so panels facing away from the viewer are hidden and their mirrored text never shows through.
- Animate the ring with keyframes from "translateZ(-235px) rotateY(0deg)" to "translateZ(-235px) rotateY(-360deg)" over 24 seconds, linear, infinite. The negative translateZ moves the ring back so the front panel sits at the screen plane. Pause on hover.
- Respect prefers-reduced-motion by showing a static angle.
- Centre it on a dark background.

Return one HTML file with a <style> block.`,
    steps: [
      "Give every panel an index with an inline CSS variable (--i). One CSS rule can then position all of them.",
      "Rotate each panel around the Y axis by its share of the circle: index x (360 / number of panels).",
      "After rotating, translateZ pushes the panel outward along the direction it now faces, placing it on the circumference.",
      "Work out the radius with trigonometry: radius = (panel width / 2) / tan(180 / count). For 8 panels of 170px that is about 205px; add a little for gaps.",
      "Move the whole ring back by the same radius with translateZ(-radius) so the nearest panel is at normal size instead of zoomed in.",
      "Rotate the ring, not the panels, to spin the carousel.",
      "Add backface-visibility: hidden to the panels. Panels on the far side face away from you, so this hides them and keeps the front of the ring clean.",
    ],
    tips: [
      "Change the panel count by updating --count, the --i values and the radius formula.",
      "Replace the labels with images for a 3D photo gallery.",
      "Add Previous and Next buttons that change a --step variable and use rotateY(calc(var(--step) * -45deg)) with a transition instead of the animation.",
    ],
  },
  {
    slug: "isometric-layer-stack",
    name: "Isometric Layer Stack",
    tone: "dark",
    tags: ["css 3d", "isometric", "layers", "hover", "no javascript"],
    description:
      "Flat cards stacked in an isometric 3D view that float apart when you hover. A popular way to illustrate architecture layers, tech stacks or product tiers.",
    html: `<div class="iso" tabindex="0" aria-label="Technology stack, hover to expand">
  <div class="layer" style="--i: 0"><b>Database</b><span>PostgreSQL</span></div>
  <div class="layer" style="--i: 1"><b>API</b><span>Node.js</span></div>
  <div class="layer" style="--i: 2"><b>Framework</b><span>Next.js</span></div>
  <div class="layer top" style="--i: 3"><b>Interface</b><span>React</span></div>
</div>`,
    css: `${STAGE}

.iso {
  --gap: 34px;
  position: relative;
  width: 240px;
  height: 150px;
  margin-top: 60px;
  transform-style: preserve-3d;
  /* Tip the flat cards back and turn them to get the isometric look */
  transform: rotateX(58deg) rotateZ(-40deg);
  outline: none;
}
.iso:hover,
.iso:focus-visible { --gap: 70px; }

.layer {
  position: absolute;
  inset: 0;
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid #d5d9e6;
  box-shadow: 0 0 0 1px rgba(0, 32, 87, 0.04), 12px 18px 30px rgba(0, 0, 0, 0.35);
  color: #002057;
  /* Each layer is lifted by its index */
  transform: translateZ(calc(var(--i) * var(--gap)));
  transition: transform 0.6s cubic-bezier(0.2, 0.7, 0.2, 1);
}
.layer b { font-size: 1.05rem; }
.layer span { font-size: 0.8rem; color: #5b6178; }

.layer.top { background: #2506ad; border-color: #2506ad; color: #fff; }
.layer.top span { color: rgba(255, 255, 255, 0.75); }

@media (prefers-reduced-motion: reduce) {
  .layer { transition: none; }
}`,
    prompt: `Create an isometric 3D stack of cards using only HTML and CSS (no JavaScript).

Requirements:
- A container, 240px by 150px, with transform-style: preserve-3d and transform: rotateX(58deg) rotateZ(-40deg) to create an isometric viewing angle. It has tabindex="0".
- Four absolutely positioned "layer" cards inside it, each with an inline CSS variable --i from 0 to 3 and two lines of text: a bold layer name (Database, API, Framework, Interface) and a technology (PostgreSQL, Node.js, Next.js, React).
- Each layer is lifted with transform: translateZ(calc(var(--i) * var(--gap))) where --gap is a variable on the container, 34px by default.
- On :hover and :focus-visible of the container, change --gap to 70px so the layers float apart. Animate with a 0.6s transition on transform.
- Layers are white with a light border, 16px radius and a soft offset shadow; the top layer is indigo #2506ad with white text.
- Disable the transition under prefers-reduced-motion.
- Centre it on a dark background.

Return one HTML file with a <style> block.`,
    steps: [
      "Stack the cards exactly on top of each other with position: absolute.",
      "Rotate the container with rotateX and rotateZ. Tilting it back and turning it gives the classic isometric angle with no perspective property needed.",
      "Add transform-style: preserve-3d to the container so the children can move in the third dimension.",
      "Lift each card with translateZ multiplied by its index variable. Because the container is rotated, 'up' along Z appears as up and to the side on screen.",
      "Store the spacing in one CSS variable and change only that variable on hover; every layer updates together.",
      "Transition the transform for a smooth expansion.",
    ],
    tips: [
      "Add more layers by adding elements with the next --i value.",
      "Animate --gap with a keyframe animation for a gentle breathing effect.",
      "Use this to explain anything layered: an app architecture, the OSI model or a pricing ladder.",
    ],
  },
  {
    slug: "parallax-depth-hero",
    name: "Parallax Depth Hero",
    tone: "dark",
    tags: ["css 3d", "parallax", "mouse", "hero", "javascript"],
    description:
      "A hero scene whose layers shift by different amounts as you move the mouse, creating real depth. The whole scene also tilts slightly towards the cursor.",
    html: `<div class="parallax" id="parallax">
  <div class="scene">
    <span class="layer orb orb-a" data-depth="20"></span>
    <span class="layer orb orb-b" data-depth="45"></span>
    <div class="layer ring" data-depth="70"></div>
    <div class="layer copy" data-depth="110">
      <h1>Depth you can feel</h1>
      <p>Move your mouse across the scene.</p>
    </div>
    <span class="layer chip chip-a" data-depth="170">React</span>
    <span class="layer chip chip-b" data-depth="210">Three.js</span>
  </div>
</div>`,
    css: `html { overflow: hidden; }
body {
  margin: 0;
  min-height: 100vh;
  overflow: hidden;
  background: #060816;
  ${FONT}
}

.parallax {
  min-height: 100vh;
  display: grid;
  place-items: center;
  perspective: 1200px;
}

.scene {
  position: relative;
  width: min(92vw, 720px);
  height: min(70vh, 420px);
  transform-style: preserve-3d;
  transition: transform 0.2s ease-out;
}

.layer {
  position: absolute;
  transition: transform 0.2s ease-out;
  will-change: transform;
}

.orb { border-radius: 50%; filter: blur(50px); opacity: 0.7; }
.orb-a { width: 260px; height: 260px; left: 4%; top: 8%; background: #2506ad; }
.orb-b { width: 220px; height: 220px; right: 6%; bottom: 4%; background: #ff7b00; }

.ring {
  left: 50%;
  top: 50%;
  width: 300px;
  height: 300px;
  margin: -150px 0 0 -150px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.25);
}

.copy { inset: 0; display: grid; place-content: center; text-align: center; color: #fff; }
.copy h1 { margin: 0; font-size: clamp(1.8rem, 5vw, 3.4rem); letter-spacing: -0.02em; }
.copy p { margin: 10px 0 0; color: rgba(255, 255, 255, 0.7); }

.chip {
  padding: 9px 16px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.95);
  color: #002057;
  font-weight: 700;
  font-size: 0.9rem;
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.35);
}
.chip-a { left: 8%; bottom: 18%; }
.chip-b { right: 10%; top: 16%; }`,
    js: `var root = document.getElementById("parallax");
var scene = root.querySelector(".scene");
var layers = Array.prototype.slice.call(root.querySelectorAll(".layer"));
var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function update(x, y) {
  // x and y run from -0.5 to 0.5, with 0 at the centre
  scene.style.transform = "rotateY(" + x * 14 + "deg) rotateX(" + -y * 14 + "deg)";
  layers.forEach(function (layer) {
    var depth = Number(layer.dataset.depth);
    layer.style.transform =
      "translate3d(" + x * depth * -0.5 + "px, " + y * depth * -0.5 + "px, " + depth + "px)";
  });
}

if (!reduceMotion) {
  root.addEventListener("pointermove", function (event) {
    var rect = root.getBoundingClientRect();
    update((event.clientX - rect.left) / rect.width - 0.5, (event.clientY - rect.top) / rect.height - 0.5);
  });
  root.addEventListener("pointerleave", function () { update(0, 0); });
}
update(0, 0);`,
    prompt: `Create a mouse-driven 3D parallax hero using HTML, CSS and a little vanilla JavaScript (no libraries).

Structure:
- A full-viewport container with perspective: 1200px and a near-black background (#060816).
- A "scene" element (max 720px wide, about 420px tall) with transform-style: preserve-3d.
- Six absolutely positioned layers inside it, each with a data-depth attribute: two large blurred colour orbs (indigo #2506ad at depth 20, orange #ff7b00 at depth 45), a thin white circular ring (depth 70), the centred heading "Depth you can feel" with a subtitle (depth 110), and two white rounded "chips" labelled React (depth 170) and Three.js (depth 210).

Behaviour (JavaScript):
- On pointermove over the container, compute x and y from -0.5 to 0.5 relative to its centre.
- Rotate the scene: rotateY(x * 14deg) rotateX(-y * 14deg).
- For each layer, set transform to translate3d(x * depth * -0.5px, y * depth * -0.5px, depth px). Layers with a larger depth sit closer to the viewer and move more.
- On pointerleave, return everything to the centre. Use a 0.2s ease-out transition on transforms.
- If the user prefers reduced motion, do not attach the listeners.

Return a single HTML file with <style> and <script> tags.`,
    steps: [
      "Give the container perspective and the scene transform-style: preserve-3d so child layers can sit at different depths.",
      "Assign each layer a depth number with a data attribute. Use it twice: as the translateZ distance and as the multiplier for how far the layer shifts.",
      "Convert the pointer position to a range of -0.5 to 0.5 so the centre of the scene means 'no movement'.",
      "Shift each layer opposite to the pointer, scaled by its depth. Near layers move a lot, far layers barely move: that difference is parallax.",
      "Tilt the whole scene a few degrees towards the pointer to strengthen the 3D impression.",
      "Reset on pointerleave and skip the effect entirely for reduced-motion users.",
    ],
    tips: [
      "On phones, drive the same update function from the deviceorientation event instead of the pointer.",
      "Keep the tilt small (10-15 degrees). Large angles make text hard to read.",
      "Replace the chips with product screenshots to make a layered product hero.",
    ],
  },
  {
    slug: "3d-extruded-text",
    name: "3D Extruded Text",
    tone: "dark",
    tags: ["css 3d", "text", "typography", "shadow", "no javascript"],
    description:
      "Bold headline text with a solid 3D extrusion made from stacked text-shadows, gently rocking in perspective. Pure CSS that works with any font.",
    html: `<div class="wrap">
  <h1 class="extrude" aria-label="3D Text">3D TEXT</h1>
  <p>Pure CSS. No images, no canvas.</p>
</div>`,
    css: `${STAGE}

.wrap { text-align: center; perspective: 900px; }

.extrude {
  margin: 0;
  font-size: clamp(3.5rem, 15vw, 9rem);
  font-weight: 900;
  letter-spacing: 0.02em;
  line-height: 1;
  color: #ffffff;
  /* Each shadow is one pixel further away: together they read as a solid side.
     The last two shadows are the soft drop shadow on the ground. */
  text-shadow:
    1px 1px 0 #ff9a3d,
    2px 2px 0 #ff8f29,
    3px 3px 0 #ff8414,
    4px 4px 0 #ff7b00,
    5px 5px 0 #eb7100,
    6px 6px 0 #d66700,
    7px 7px 0 #c25d00,
    8px 8px 0 #ad5300,
    9px 9px 0 #994900,
    10px 10px 0 #853f00,
    18px 22px 30px rgba(0, 0, 0, 0.55),
    30px 40px 60px rgba(0, 0, 0, 0.35);
  animation: rock 6s ease-in-out infinite alternate;
}

.wrap p { margin: 34px 0 0; color: rgba(255, 255, 255, 0.65); font-size: 1.05rem; }

@keyframes rock {
  from { transform: rotateX(18deg) rotateY(-22deg); }
  to   { transform: rotateX(8deg) rotateY(22deg); }
}

@media (prefers-reduced-motion: reduce) {
  .extrude { animation: none; transform: rotateX(12deg) rotateY(-14deg); }
}`,
    prompt: `Create a 3D extruded text headline using only HTML and CSS.

Requirements:
- A heading that reads "3D TEXT", white, font-weight 900, size clamp(3.5rem, 15vw, 9rem), on a dark radial-gradient background.
- Create the 3D depth with a stack of ten hard text-shadows, each offset one pixel further down and right than the previous (1px 1px, 2px 2px ... 10px 10px) with zero blur, in orange shades that get gradually darker from #ff9a3d to #853f00.
- Add two more soft, blurred, dark shadows after the stack to act as a drop shadow on the ground.
- Wrap the heading in an element with perspective: 900px and animate the heading with a keyframe animation that rocks it between rotateX(18deg) rotateY(-22deg) and rotateX(8deg) rotateY(22deg) over 6 seconds, ease-in-out, alternating forever.
- Under prefers-reduced-motion, stop the animation and show a fixed tilt.
- Add a short grey caption underneath.

Return one HTML file with a <style> block.`,
    steps: [
      "Start with thick, heavy text. Extrusion needs a bold weight (800 or 900) to look solid.",
      "Add a text-shadow offset by 1px in both directions with no blur. It looks like a thin edge.",
      "Repeat it at 2px, 3px and so on. Because each layer touches the next, the eye reads them as one continuous side wall.",
      "Darken the colour step by step towards the back to imitate shading.",
      "Finish with one or two large, blurred, dark shadows so the text appears to sit above a surface.",
      "Rotate the text inside a perspective container to show off the depth.",
    ],
    tips: [
      "More layers give a deeper extrusion; generate long stacks with a Sass loop or a small script.",
      "Flip the offset signs (for example -1px 1px) to extrude in another direction.",
      "This works on any live text, so it stays selectable, translatable and readable by search engines.",
    ],
  },
  {
    slug: "3d-push-button",
    name: "3D Push Button",
    tone: "light",
    tags: ["css 3d", "button", "press", "interaction", "no javascript"],
    description:
      "A chunky button that physically presses down when clicked. It is built from three layers: a shadow, an edge and a front face that moves.",
    html: `<button class="pushable">
  <span class="shadow"></span>
  <span class="edge"></span>
  <span class="front">Push me</span>
</button>`,
    css: `body {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #f7f7f7;
  ${FONT}
}

.pushable {
  position: relative;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  outline-offset: 6px;
  -webkit-tap-highlight-color: transparent;
}

/* Layer 1: soft shadow on the ground */
.shadow {
  position: absolute;
  inset: 0;
  border-radius: 16px;
  background: rgba(0, 32, 87, 0.3);
  filter: blur(4px);
  transform: translateY(4px);
  transition: transform 0.5s cubic-bezier(0.3, 0.7, 0.4, 1);
}

/* Layer 2: the darker side of the button */
.edge {
  position: absolute;
  inset: 0;
  border-radius: 16px;
  background: linear-gradient(to left, #12035c 0%, #1a047e 8%, #1a047e 92%, #12035c 100%);
}

/* Layer 3: the face, raised above the edge */
.front {
  position: relative;
  display: block;
  padding: 18px 46px;
  border-radius: 16px;
  background: #2506ad;
  color: #fff;
  font-size: 1.3rem;
  font-weight: 800;
  transform: translateY(-6px);
  transition: transform 0.5s cubic-bezier(0.3, 0.7, 0.4, 1);
}

.pushable:hover .front  { transform: translateY(-8px); transition-duration: 0.25s; }
.pushable:hover .shadow { transform: translateY(6px);  transition-duration: 0.25s; }

/* Pressed: the face drops almost to the base, quickly */
.pushable:active .front  { transform: translateY(-2px); transition-duration: 0.03s; }
.pushable:active .shadow { transform: translateY(1px);  transition-duration: 0.03s; }

.pushable:focus-visible { outline: 3px solid #ff7b00; }

@media (prefers-reduced-motion: reduce) {
  .front, .shadow { transition: none; }
}`,
    prompt: `Create a 3D "pushable" button using only HTML and CSS (no JavaScript).

Structure: a <button class="pushable"> containing three spans in this order: "shadow", "edge" and "front" (the front holds the label "Push me").

Requirements:
- The button itself has no background, border or padding; position: relative.
- "shadow": absolutely fills the button, 16px radius, translucent navy, blur(4px), translateY(4px).
- "edge": absolutely fills the button, 16px radius, a dark indigo horizontal gradient that is slightly darker at the left and right ends, representing the side of the button.
- "front": position relative, 18px 46px padding, 16px radius, indigo #2506ad, white extra-bold text, raised with translateY(-6px).
- Hover: front moves to translateY(-8px) and shadow to translateY(6px) with a 0.25s transition.
- Active (pressed): front drops to translateY(-2px) and shadow to translateY(1px) with a very fast 0.03s transition, then springs back slowly (0.5s cubic-bezier(0.3, 0.7, 0.4, 1)) on release.
- A visible orange outline on :focus-visible. No transitions under prefers-reduced-motion.
- Centre it on a light grey page.

Return one HTML file with a <style> block.`,
    steps: [
      "Split the button into three stacked layers: a shadow, an edge (the side wall) and a front face.",
      "Raise the front face with translateY(-6px). The edge layer, slightly darker, shows beneath it and reads as thickness.",
      "On :active, move the face down to almost meet the base. It looks and feels like a physical press.",
      "Use different transition speeds: very fast going down, slower and springy coming back up. Real buttons behave this way.",
      "Move the shadow in the opposite direction so it tightens when pressed and spreads when the button rises.",
      "Keep a clear :focus-visible outline for keyboard users.",
    ],
    tips: [
      "Change the three colours together: face, edge (about 15% darker) and edge ends (darker again).",
      "Increase the resting offset to -10px for an arcade-style button.",
      "Use a real button element so it works with the keyboard and forms.",
    ],
  },
  {
    slug: "3d-opening-book",
    name: "3D Opening Book",
    tone: "dark",
    tags: ["css 3d", "book", "hover", "product", "no javascript"],
    description:
      "A 3D book whose cover swings open on hover to reveal the first page. A strong way to present an e-book, course, case study or documentation.",
    html: `<div class="book" tabindex="0" aria-label="Book: hover or focus to open">
  <div class="page">
    <h4>Chapter 1</h4>
    <p>Server Components render on the server and send zero JavaScript to the browser.</p>
  </div>
  <div class="cover">
    <div class="cover-front">
      <span>Free course</span>
      <h3>Next.js 16<br />Complete Guide</h3>
      <small>Ravindra Nath Jha</small>
    </div>
    <div class="cover-back"></div>
  </div>
</div>`,
    css: `${STAGE}

.book {
  position: relative;
  width: 220px;
  height: 300px;
  perspective: 1400px;
  transform: rotateX(8deg);
  cursor: pointer;
  outline: none;
}

/* The page that is revealed */
.page {
  position: absolute;
  inset: 4px 4px 4px 0;
  padding: 28px 22px;
  border-radius: 2px 10px 10px 2px;
  background: linear-gradient(90deg, #e9e2d3 0%, #fbf8f1 12%);
  color: #2b3150;
  box-shadow: 12px 18px 40px rgba(0, 0, 0, 0.5);
}
.page h4 { margin: 0 0 10px; color: #002057; }
.page p { margin: 0; font-size: 0.85rem; line-height: 1.6; }

/* The cover hinges on its left edge */
.cover {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  transform-origin: left center;
  transition: transform 0.9s cubic-bezier(0.2, 0.7, 0.2, 1);
}
.book:hover .cover,
.book:focus-visible .cover {
  transform: rotateY(-150deg);
}

.cover-front,
.cover-back {
  position: absolute;
  inset: 0;
  border-radius: 4px 12px 12px 4px;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.cover-front {
  padding: 26px 22px;
  display: flex;
  flex-direction: column;
  background: linear-gradient(120deg, #002057 0%, #2506ad 100%);
  color: #fff;
  /* The dark band on the left imitates the spine */
  box-shadow: inset 10px 0 12px -6px rgba(0, 0, 0, 0.55);
}
.cover-front span {
  align-self: flex-start;
  padding: 4px 10px;
  border-radius: 999px;
  background: #ff7b00;
  font-size: 0.7rem;
  font-weight: 700;
}
.cover-front h3 { margin: auto 0 0; font-size: 1.5rem; line-height: 1.2; }
.cover-front small { margin-top: 12px; opacity: 0.7; }

/* Inside of the cover, visible once it is open */
.cover-back {
  background: #001640;
  transform: rotateY(180deg);
}

@media (prefers-reduced-motion: reduce) {
  .cover { transition-duration: 0.01s; }
}`,
    prompt: `Create a 3D book that opens on hover using only HTML and CSS (no JavaScript).

Structure:
- A "book" wrapper (220px by 300px, tabindex="0") with perspective: 1400px and a slight rotateX(8deg).
- A "page" element behind the cover: cream paper gradient with a darker strip at the left (the gutter), a heading "Chapter 1" and two lines of text.
- A "cover" element on top containing two faces: "cover-front" and "cover-back".

Requirements:
- The cover has transform-style: preserve-3d, transform-origin: left center, and a 0.9s transform transition.
- On :hover and :focus-visible of the book, rotate the cover rotateY(-150deg) so it swings open like a real book.
- Both cover faces are absolutely positioned with backface-visibility: hidden. The back face is pre-rotated rotateY(180deg) and coloured dark navy, so the inside of the cover is visible when it is open.
- The front cover has a navy-to-indigo gradient, an inset dark shadow along the left edge to suggest a spine, a small orange "Free course" pill at the top, the title "Next.js 16 Complete Guide" at the bottom and an author line.
- The page has a soft drop shadow. Respect prefers-reduced-motion.
- Centre it on a dark background.

Return one HTML file with a <style> block.`,
    steps: [
      "Layer two things: the inner page underneath and the cover on top.",
      "Set transform-origin: left center on the cover. Rotations happen around this point, so the cover swings on its spine instead of spinning around its middle.",
      "Rotate the cover with a negative rotateY on hover; with perspective on the parent it swings towards the viewer and open.",
      "Give the cover two faces with backface-visibility: hidden, the second one pre-rotated 180 degrees, so the inside of the cover has its own colour.",
      "Add an inset shadow on the spine side of the cover and a gradient gutter on the page. Small details like these sell the illusion.",
      "Support keyboard users with tabindex and :focus-visible.",
    ],
    tips: [
      "Stack several pages with slightly different rotation angles for a fanned-pages effect.",
      "Use a real cover image as the background of the front face.",
      "Link the whole book to your course or download page by wrapping it in an anchor.",
    ],
  },
  {
    slug: "rotating-dot-globe",
    name: "Rotating Dot Globe",
    tone: "dark",
    tags: ["canvas", "3d maths", "globe", "interactive", "javascript"],
    description:
      "A globe made of hundreds of dots that rotates on its own and can be dragged with the mouse or a finger. Written from scratch on a 2D canvas, so it shows exactly how 3D projection works.",
    html: `<div class="wrap">
  <canvas id="globe" aria-label="Rotating globe made of dots. Drag to rotate."></canvas>
  <div class="label">
    <h1>Dot Globe</h1>
    <p>Drag to rotate</p>
  </div>
</div>`,
    css: `html { overflow: hidden; }
body {
  margin: 0;
  min-height: 100vh;
  background: radial-gradient(circle at 50% 40%, #131b45 0%, #05060f 70%);
  overflow: hidden;
  ${FONT}
}
.wrap { position: relative; height: 100vh; }
#globe { width: 100%; height: 100%; display: block; cursor: grab; touch-action: none; }
#globe:active { cursor: grabbing; }
.label {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 6vh;
  text-align: center;
  color: #fff;
  pointer-events: none;
}
.label h1 { margin: 0; font-size: clamp(1.4rem, 4vw, 2.2rem); }
.label p { margin: 4px 0 0; color: rgba(255, 255, 255, 0.6); font-size: 0.95rem; }`,
    js: `var canvas = document.getElementById("globe");
var ctx = canvas.getContext("2d");
var points = [];
var COUNT = 700;
var rotY = 0;      // rotation around the vertical axis
var rotX = -0.35;  // tilt
var velocity = 0.004;
var dragging = false;
var lastX = 0;
var lastY = 0;
var width, height, radius, dpr;

// 1. Spread points evenly over a sphere (Fibonacci sphere)
var golden = Math.PI * (3 - Math.sqrt(5));
for (var i = 0; i < COUNT; i++) {
  var y = 1 - (i / (COUNT - 1)) * 2;       // from 1 down to -1
  var r = Math.sqrt(1 - y * y);            // radius of the circle at that height
  var theta = golden * i;
  points.push({ x: Math.cos(theta) * r, y: y, z: Math.sin(theta) * r });
}

function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = canvas.clientWidth;
  height = canvas.clientHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  radius = Math.min(width, height) * 0.34;
}

function draw() {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  var sinY = Math.sin(rotY), cosY = Math.cos(rotY);
  var sinX = Math.sin(rotX), cosX = Math.cos(rotX);
  var cameraDistance = 3; // in sphere radii

  for (var i = 0; i < points.length; i++) {
    var p = points[i];

    // 2. Rotate the point around the Y axis, then around the X axis
    var x1 = p.x * cosY + p.z * sinY;
    var z1 = -p.x * sinY + p.z * cosY;
    var y1 = p.y * cosX - z1 * sinX;
    var z2 = p.y * sinX + z1 * cosX;

    // 3. Perspective projection: things further away are drawn smaller
    var scale = cameraDistance / (cameraDistance + z2);
    var sx = width / 2 + x1 * radius * scale;
    var sy = height / 2 + y1 * radius * scale;

    // 4. Depth cue: points at the back are dimmer and smaller
    var depth = (1 - z2) / 2; // 1 = nearest, 0 = furthest
    ctx.globalAlpha = 0.15 + depth * 0.85;
    ctx.fillStyle = depth > 0.5 ? "#ffb066" : "#8fa0ff";
    ctx.beginPath();
    ctx.arc(sx, sy, 0.6 + depth * 1.8, 0, Math.PI * 2);
    ctx.fill();
  }

  if (!dragging) rotY += velocity;
  requestAnimationFrame(draw);
}

canvas.addEventListener("pointerdown", function (e) {
  dragging = true;
  lastX = e.clientX;
  lastY = e.clientY;
  canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener("pointermove", function (e) {
  if (!dragging) return;
  rotY += (e.clientX - lastX) * 0.006;
  rotX += (e.clientY - lastY) * 0.006;
  rotX = Math.max(-1.3, Math.min(1.3, rotX)); // stop it flipping over the poles
  lastX = e.clientX;
  lastY = e.clientY;
});
canvas.addEventListener("pointerup", function () { dragging = false; });
canvas.addEventListener("pointercancel", function () { dragging = false; });

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) velocity = 0;

window.addEventListener("resize", resize);
resize();
draw();`,
    prompt: `Create an interactive rotating globe made of dots on an HTML canvas, using vanilla JavaScript only (no Three.js, no libraries). The goal is to show how 3D works with plain maths.

Requirements:
- A full-viewport canvas on a dark radial-gradient background, with a small centred title "Dot Globe" and the hint "Drag to rotate" near the bottom.
- Generate 700 points evenly distributed on a unit sphere using the Fibonacci sphere method (golden angle = PI * (3 - sqrt(5))).
- Keep two angles: rotY (spin) and rotX (tilt, starting at -0.35 radians).
- Every frame, for each point: rotate it around the Y axis and then the X axis using sine and cosine, then apply perspective projection with scale = cameraDistance / (cameraDistance + z), where cameraDistance is 3 sphere radii, and convert to screen coordinates around the canvas centre. The sphere radius on screen is 34% of the smaller canvas dimension.
- Draw each point as a small circle. Use depth for realism: nearer points are larger (up to about 2.4px) and more opaque and coloured warm orange (#ffb066); farther points are smaller, dimmer and bluish (#8fa0ff).
- Auto-rotate slowly. Let the user drag with pointer events (pointerdown / pointermove / pointerup with setPointerCapture) to change rotY and rotX; clamp rotX so the globe cannot flip over. Set touch-action: none on the canvas.
- Handle high-DPI screens by sizing the canvas with devicePixelRatio (capped at 2) and handle window resize.
- Stop the auto-rotation if the user prefers reduced motion.

Return a single HTML file with <style> and <script> tags, with comments explaining the rotation and projection maths.`,
    steps: [
      "Create the 3D data first: an array of points, each with x, y and z between -1 and 1. The Fibonacci sphere formula spaces them evenly instead of bunching at the poles.",
      "Rotate each point every frame. Rotation around the Y axis mixes x and z using cos and sin of the angle; rotation around the X axis mixes y and z the same way.",
      "Project 3D to 2D with perspective: divide by distance. scale = camera / (camera + z) makes far points shrink towards the centre, exactly as a camera does.",
      "Convert to pixels by multiplying by the globe radius and adding the centre of the canvas.",
      "Add depth cues. Since a canvas has no real depth, draw far points smaller, dimmer and in a cooler colour so the brain reads the shape as a sphere.",
      "For dragging, record the pointer position on pointerdown and add the movement to the rotation angles on pointermove.",
      "Multiply the canvas size by devicePixelRatio and scale the context so dots stay sharp on high-resolution screens.",
    ],
    tips: [
      "Raise COUNT to 2000 for a denser globe; a 2D canvas handles this comfortably.",
      "Connect nearby points with thin lines to make a network globe.",
      "Replace the generated points with real latitude and longitude coordinates to plot cities.",
    ],
  },
  {
    slug: "warp-speed-tunnel",
    name: "Warp Speed Tunnel",
    tone: "dark",
    tags: ["canvas", "3d maths", "stars", "animation", "javascript"],
    description:
      "Stars streak towards the viewer as if flying through space at warp speed. Each star has a real depth value; the streaks come from perspective projection on a 2D canvas.",
    html: `<div class="wrap">
  <canvas id="warp"></canvas>
  <div class="content">
    <h1>Warp Speed</h1>
    <p>Hold the mouse button to go faster</p>
  </div>
</div>`,
    css: `html { overflow: hidden; }
body { margin: 0; min-height: 100vh; background: #02030a; overflow: hidden; ${FONT} }
.wrap { position: relative; height: 100vh; }
#warp { width: 100%; height: 100%; display: block; }
.content {
  position: absolute;
  inset: 0;
  display: grid;
  place-content: center;
  text-align: center;
  color: #fff;
  pointer-events: none;
}
.content h1 { margin: 0; font-size: clamp(2rem, 7vw, 4.5rem); letter-spacing: 0.04em; text-shadow: 0 0 30px rgba(37, 6, 173, 0.9); }
.content p { margin: 10px 0 0; color: rgba(255, 255, 255, 0.65); }`,
    js: `var canvas = document.getElementById("warp");
var ctx = canvas.getContext("2d");
var stars = [];
var STAR_COUNT = 600;
var DEPTH = 1000;     // how far away a star can be
var speed = 6;
var targetSpeed = 6;
var width, height, dpr;

function resetStar(star, anyDepth) {
  // x and y are positions in 3D space; z is the distance from the viewer
  star.x = (Math.random() - 0.5) * width * 2;
  star.y = (Math.random() - 0.5) * height * 2;
  star.z = anyDepth ? Math.random() * DEPTH : DEPTH;
  star.pz = star.z; // previous depth, used to draw the streak
}

function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = canvas.clientWidth;
  height = canvas.clientHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  stars = [];
  for (var i = 0; i < STAR_COUNT; i++) {
    var star = {};
    resetStar(star, true);
    stars.push(star);
  }
}

function draw() {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  // A translucent fill instead of clearRect leaves short fading trails
  ctx.fillStyle = "rgba(2, 3, 10, 0.35)";
  ctx.fillRect(0, 0, width, height);

  speed += (targetSpeed - speed) * 0.05; // ease towards the target speed
  var cx = width / 2;
  var cy = height / 2;
  var focal = width * 0.5;

  for (var i = 0; i < stars.length; i++) {
    var s = stars[i];
    s.pz = s.z;
    s.z -= speed;
    if (s.z < 1) { resetStar(s, false); continue; }

    // Perspective projection: divide by depth
    var x = cx + (s.x / s.z) * focal;
    var y = cy + (s.y / s.z) * focal;
    var px = cx + (s.x / s.pz) * focal;
    var py = cy + (s.y / s.pz) * focal;

    if (x < 0 || x > width || y < 0 || y > height) { resetStar(s, false); continue; }

    var nearness = 1 - s.z / DEPTH; // 0 far away, 1 right in front
    ctx.strokeStyle = "rgba(" + (180 + nearness * 75) + ", " + (190 + nearness * 40) + ", 255, " + nearness + ")";
    ctx.lineWidth = 0.4 + nearness * 2.2;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(x, y);
    ctx.stroke();
  }
  requestAnimationFrame(draw);
}

window.addEventListener("pointerdown", function () { targetSpeed = 34; });
window.addEventListener("pointerup", function () { targetSpeed = 6; });
window.addEventListener("pointercancel", function () { targetSpeed = 6; });

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  speed = targetSpeed = 0.6;
  window.addEventListener("pointerdown", function () { targetSpeed = 0.6; });
}

window.addEventListener("resize", resize);
resize();
draw();`,
    prompt: `Create a "warp speed" starfield tunnel on an HTML canvas with vanilla JavaScript (no libraries).

Requirements:
- A full-viewport canvas on a near-black background with a centred title "Warp Speed" and the hint "Hold the mouse button to go faster".
- 600 stars. Each star has a 3D position: x and y random within twice the screen size around the centre, and z (depth) between 1 and 1000. Also store pz, the depth on the previous frame.
- Every frame: fill the canvas with rgba(2, 3, 10, 0.35) instead of clearing it, so streaks leave short fading trails. Decrease each star's z by the current speed.
- Project with perspective: screenX = centreX + (x / z) * focal and screenY = centreY + (y / z) * focal, where focal is half the canvas width. Do the same with pz to get the previous screen position, and draw a line between the two points: that line is the streak.
- Make nearer stars brighter and thicker (line width 0.4 to 2.6, alpha from 0 to 1) and slightly whiter.
- When a star's z goes below 1 or it leaves the screen, reset it to the far distance with a new random x and y.
- Speed is 6 by default; while a pointer is held down, ease towards 34 (speed += (target - speed) * 0.05), and ease back on release.
- Handle devicePixelRatio (capped at 2) and window resize. Under prefers-reduced-motion keep the speed very low.

Return a single HTML file with <style> and <script> tags, with comments explaining the projection.`,
    steps: [
      "Give every star a position in 3D: x and y spread around the centre, and z for how far away it is.",
      "Each frame, reduce z. The star is now closer to the viewer.",
      "Project to the screen by dividing x and y by z. As z shrinks, the result grows, so the star slides outwards from the centre faster and faster.",
      "Remember the previous depth and project it too. Drawing a line from the old screen position to the new one creates the streak.",
      "Fill the canvas with a translucent colour instead of clearing it to leave short motion trails.",
      "Recycle stars that pass the viewer or leave the screen by sending them back to the far distance.",
      "Ease the speed towards a target value so acceleration feels smooth.",
    ],
    tips: [
      "Lower STAR_COUNT on phones to save battery.",
      "Tie the speed to scroll position to make a scroll-driven warp transition between sections.",
      "Tint the streaks with your brand colours by changing the strokeStyle formula.",
    ],
  },
  {
    slug: "threejs-torus-knot",
    name: "Three.js Torus Knot",
    tone: "dark",
    module: true,
    dependencies: "Three.js r160, loaded from a CDN",
    tags: ["three.js", "webgl", "3d model", "lighting", "interactive"],
    description:
      "A glossy 3D torus knot rendered with WebGL, lit by coloured lights, that rotates and leans towards the cursor. A complete, minimal Three.js scene to learn from.",
    html: `<canvas id="scene"></canvas>
<div class="overlay">
  <span>Three.js &middot; WebGL</span>
  <h1>Real-time 3D in the browser</h1>
</div>`,
    css: `html, body { height: 100%; overflow: hidden; }
body { margin: 0; background: #05060f; ${FONT} }
#scene { position: fixed; inset: 0; width: 100%; height: 100%; display: block; }
.overlay {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 7vh;
  text-align: center;
  color: #fff;
  pointer-events: none;
}
.overlay span { color: #ff7b00; font-weight: 700; font-size: 0.8rem; letter-spacing: 0.2em; text-transform: uppercase; }
.overlay h1 { margin: 8px 0 0; font-size: clamp(1.3rem, 4vw, 2.4rem); }`,
    js: `import * as THREE from "${THREE_CDN}";

const canvas = document.getElementById("scene");

// 1. Renderer: draws the scene into the canvas using WebGL
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 2. Scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
camera.position.set(0, 0, 6);

// 3. Mesh = geometry (the shape) + material (the surface)
const geometry = new THREE.TorusKnotGeometry(1.2, 0.4, 220, 32);
const material = new THREE.MeshStandardMaterial({
  color: 0x2506ad,
  metalness: 0.65,
  roughness: 0.2,
});
const knot = new THREE.Mesh(geometry, material);
scene.add(knot);

// 4. Lights: a standard material is black without them
scene.add(new THREE.AmbientLight(0xffffff, 0.35));
const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
keyLight.position.set(3, 4, 5);
scene.add(keyLight);
const warmLight = new THREE.PointLight(0xff7b00, 40, 20);
warmLight.position.set(-4, -2, 3);
scene.add(warmLight);
const coolLight = new THREE.PointLight(0x06b6d4, 30, 20);
coolLight.position.set(4, 2, -3);
scene.add(coolLight);

// 5. Keep the canvas and camera in sync with the window size
function resize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}
window.addEventListener("resize", resize);
resize();

// 6. Pointer position, from -1 to 1
const pointer = { x: 0, y: 0 };
window.addEventListener("pointermove", (event) => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
});

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const clock = new THREE.Clock();

// 7. Render loop
function animate() {
  const elapsed = clock.getElapsedTime();
  if (!reduceMotion) {
    knot.rotation.y = elapsed * 0.4;
    knot.rotation.x = elapsed * 0.2;
  }
  // Ease the whole mesh towards the pointer
  knot.position.x += (pointer.x * 0.6 - knot.position.x) * 0.05;
  knot.position.y += (-pointer.y * 0.4 - knot.position.y) * 0.05;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();`,
    prompt: `Create a minimal Three.js scene showing a glossy rotating torus knot, in a single HTML file.

Setup:
- Load Three.js as an ES module inside <script type="module"> with: import * as THREE from "${THREE_CDN}";
- A full-screen fixed <canvas id="scene"> on a #05060f background, with a small overlay at the bottom: an uppercase orange label "Three.js · WebGL" and the heading "Real-time 3D in the browser".

Scene:
- WebGLRenderer using the canvas, with antialias and alpha enabled, and pixel ratio capped at 2.
- PerspectiveCamera with a 45 degree field of view, positioned at z = 6.
- A Mesh made from TorusKnotGeometry(1.2, 0.4, 220, 32) and a MeshStandardMaterial with colour 0x2506ad, metalness 0.65 and roughness 0.2.
- Lights: an AmbientLight at intensity 0.35, a white DirectionalLight (intensity 2.2) from the upper right, an orange PointLight (0xff7b00) from the lower left and a cyan PointLight (0x06b6d4) from the right rear.

Behaviour:
- A resize function that calls renderer.setSize(width, height, false), updates camera.aspect and calls camera.updateProjectionMatrix(); run it on load and on window resize.
- A requestAnimationFrame loop using THREE.Clock: rotate the knot on the Y axis at 0.4 radians per second and on the X axis at 0.2, and ease its position towards the pointer (x up to 0.6, y up to 0.4 units) with a 0.05 easing factor.
- Skip the automatic rotation if the user prefers reduced motion.

Add numbered comments explaining each part: renderer, scene, camera, mesh, lights, resize, loop.`,
    steps: [
      "Load Three.js as an ES module. In a plain HTML file, use a script tag with type='module' and import from a CDN; in a React or Next.js project, install it with npm install three.",
      "Create the three core objects: a Scene (the world), a Camera (the viewpoint) and a WebGLRenderer (which draws what the camera sees into a canvas).",
      "Build a Mesh from a Geometry, which defines the shape, and a Material, which defines how the surface reacts to light.",
      "Add lights. MeshStandardMaterial is physically based, so with no lights the object renders black. Coloured point lights on opposite sides give the glossy two-tone look.",
      "Handle resizing: update the renderer size, the camera's aspect ratio and its projection matrix, or the image will stretch.",
      "Animate in a requestAnimationFrame loop: change rotation or position a little, then call renderer.render(scene, camera).",
      "Cap the pixel ratio at 2. Rendering at 3x on some phones triples the work for no visible gain.",
    ],
    tips: [
      "Swap TorusKnotGeometry for IcosahedronGeometry, SphereGeometry or a loaded GLTF model; everything else stays the same.",
      "In React, use React Three Fiber (@react-three/fiber) to write the same scene as components.",
      "In Next.js, load the 3D component with next/dynamic and ssr: false, because WebGL needs the browser.",
      "Pause the loop with an IntersectionObserver when the canvas is off screen to save battery.",
    ],
  },
  {
    slug: "threejs-particle-wave",
    name: "Three.js Particle Wave",
    tone: "dark",
    module: true,
    dependencies: "Three.js r160, loaded from a CDN",
    tags: ["three.js", "webgl", "particles", "animation", "hero"],
    description:
      "Ten thousand glowing particles arranged in a grid that ripples like the surface of water. A classic WebGL hero background, driven by one buffer of positions updated every frame.",
    html: `<canvas id="scene"></canvas>
<div class="overlay">
  <h1>Particle Wave</h1>
  <p>10,000 points, one draw call</p>
</div>`,
    css: `html, body { height: 100%; overflow: hidden; }
body { margin: 0; background: linear-gradient(180deg, #05060f 0%, #0b1238 100%); ${FONT} }
#scene { position: fixed; inset: 0; width: 100%; height: 100%; display: block; }
.overlay {
  position: fixed;
  inset: 0;
  display: grid;
  place-content: center;
  text-align: center;
  color: #fff;
  pointer-events: none;
}
.overlay h1 { margin: 0; font-size: clamp(2rem, 7vw, 4.2rem); letter-spacing: -0.02em; }
.overlay p { margin: 8px 0 0; color: rgba(255, 255, 255, 0.65); }`,
    js: `import * as THREE from "${THREE_CDN}";

const canvas = document.getElementById("scene");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 200);
camera.position.set(0, 9, 26);
camera.lookAt(0, 0, 0);

// 1. Build a flat grid of points. Positions live in one typed array: x, y, z, x, y, z ...
const GRID = 100;      // 100 x 100 = 10,000 particles
const SPACING = 0.6;
const positions = new Float32Array(GRID * GRID * 3);

let index = 0;
for (let ix = 0; ix < GRID; ix++) {
  for (let iz = 0; iz < GRID; iz++) {
    positions[index++] = (ix - GRID / 2) * SPACING; // x
    positions[index++] = 0;                         // y (animated below)
    positions[index++] = (iz - GRID / 2) * SPACING; // z
  }
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

// 2. One material for every point
const material = new THREE.PointsMaterial({
  color: 0x8fa0ff,
  size: 0.12,
  transparent: true,
  opacity: 0.9,
  sizeAttenuation: true, // points further away are drawn smaller
});

const points = new THREE.Points(geometry, material);
scene.add(points);

function resize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}
window.addEventListener("resize", resize);
resize();

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const clock = new THREE.Clock();

// 3. Each frame, recalculate only the height (y) of every point
function animate() {
  const time = reduceMotion ? 0 : clock.getElapsedTime();
  const array = geometry.attributes.position.array;

  let i = 0;
  for (let ix = 0; ix < GRID; ix++) {
    for (let iz = 0; iz < GRID; iz++) {
      // Two sine waves travelling in different directions
      array[i + 1] =
        Math.sin(ix * 0.3 + time * 1.2) * 0.9 +
        Math.sin(iz * 0.25 + time * 0.9) * 0.9;
      i += 3;
    }
  }
  // Tell Three.js the buffer changed so it is sent to the GPU again
  geometry.attributes.position.needsUpdate = true;

  points.rotation.y = time * 0.05;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();`,
    prompt: `Create an animated particle-wave hero background with Three.js in a single HTML file.

Setup:
- Load Three.js as an ES module inside <script type="module"> with: import * as THREE from "${THREE_CDN}";
- A full-screen fixed <canvas id="scene"> over a dark vertical gradient (#05060f to #0b1238), with a centred overlay heading "Particle Wave" and the subtitle "10,000 points, one draw call".

Scene:
- WebGLRenderer (antialias, alpha, pixel ratio capped at 2) and a PerspectiveCamera (60 degree field of view) at position (0, 9, 26) looking at the origin.
- Build a 100 x 100 grid of points with 0.6 spacing, centred on the origin, by filling a Float32Array of positions (x, y, z per point) and attaching it to a BufferGeometry as the "position" attribute.
- Render it as THREE.Points with a PointsMaterial: colour 0x8fa0ff, size 0.12, transparent, opacity 0.9, sizeAttenuation true.

Animation:
- Use THREE.Clock. Each frame, loop over the grid and set each point's y to sin(ix * 0.3 + time * 1.2) * 0.9 + sin(iz * 0.25 + time * 0.9) * 0.9.
- Set geometry.attributes.position.needsUpdate = true after updating, slowly rotate the whole Points object around Y, then render.
- Include a resize handler that updates the renderer size and the camera aspect.
- If the user prefers reduced motion, keep time at 0 so the wave is static.

Add comments explaining the buffer layout and why needsUpdate is required.`,
    steps: [
      "Store every particle position in one Float32Array: three numbers (x, y, z) per point. Typed arrays are what the GPU reads directly.",
      "Wrap the array in a BufferAttribute and attach it to a BufferGeometry under the name 'position'.",
      "Use THREE.Points with a PointsMaterial. All 10,000 particles are drawn in a single draw call, which is why it stays fast.",
      "Animate by changing only the y values in the array. Adding two sine waves that depend on the grid index and on time produces the rolling surface.",
      "Set needsUpdate = true on the attribute. Without this flag Three.js does not re-upload the changed data and nothing moves.",
      "Place the camera above and behind the grid, looking at the centre, so you see the wave in perspective.",
    ],
    tips: [
      "Move the wave calculation into a vertex shader (ShaderMaterial) to animate hundreds of thousands of points on the GPU.",
      "Add a per-point 'color' attribute and set vertexColors: true to colour particles by height.",
      "Lower GRID to 60 on mobile devices for better battery life.",
      "Add THREE.FogExp2 to the scene so distant particles fade into the background.",
    ],
  },
];
