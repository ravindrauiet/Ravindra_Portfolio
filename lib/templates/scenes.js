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
  {
    slug: "3d-interactive-credit-card",
    name: "3D Holographic Credit Card",
    tone: "dark",
    tags: ["css 3d", "card", "fintech", "holographic", "interactive"],
    description:
      "A realistic fintech card that tilts in 3D with cursor movement and flips 180° on click to reveal security details. Features gold microchip, foil shimmer, and embossed typography.",
    html: `<div class="card-wrap" id="cardWrap">
  <div class="card3d" id="card3d" tabindex="0" role="button" aria-label="3D Credit Card. Click or press Enter to flip">
    <div class="card-face front">
      <div class="card-shine" id="cardShine"></div>
      <div class="card-top">
        <div class="chip">
          <div class="chip-line"></div>
          <div class="chip-line"></div>
        </div>
        <div class="contactless">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M8.5 16.5a5 5 0 0 1 0-7M12 19a8.5 8.5 0 0 0 0-12M15.5 21.5a12 12 0 0 0 0-17"/></svg>
        </div>
      </div>
      <div class="card-number">4532 &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 8924</div>
      <div class="card-bottom">
        <div>
          <small>CARDHOLDER</small>
          <strong>RAVINDRA NATH JHA</strong>
        </div>
        <div>
          <small>EXPIRES</small>
          <strong>08/29</strong>
        </div>
        <div class="card-brand">
          <span class="circle circle-red"></span>
          <span class="circle circle-orange"></span>
        </div>
      </div>
    </div>
    <div class="card-face back">
      <div class="mag-stripe"></div>
      <div class="cvv-row">
        <div class="sig-strip"><span>Authorized Signature &bull; Not Valid Unless Signed</span></div>
        <div class="cvv">842</div>
      </div>
      <p class="card-notes">Use of this card is governed by cardholder agreement. If found, please return to any branch or call 1800-000-CARD.</p>
      <div class="hologram-seal"></div>
    </div>
  </div>
  <p class="hint">Move cursor to tilt &bull; Click to flip card</p>
</div>`,
    css: `${STAGE}

.card-wrap {
  perspective: 1200px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.card3d {
  --rx: 0deg;
  --ry: 0deg;
  --mx: 50%;
  --my: 50%;
  position: relative;
  width: min(88vw, 360px);
  aspect-ratio: 1.586;
  border-radius: 20px;
  transform-style: preserve-3d;
  transform: rotateX(var(--rx)) rotateY(var(--ry));
  transition: transform 0.15s ease-out;
  cursor: pointer;
  outline: none;
}

.card3d.flipped {
  transform: rotateX(var(--rx)) rotateY(calc(var(--ry) + 180deg));
}

.card3d:focus-visible {
  box-shadow: 0 0 0 3px #ff7b00;
}

.card-face {
  position: absolute;
  inset: 0;
  border-radius: 20px;
  padding: 24px 28px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.55), inset 0 1px 1px rgba(255, 255, 255, 0.4);
  overflow: hidden;
}

.front {
  background: linear-gradient(135deg, #090d1f 0%, #17153b 40%, #08203e 100%);
  color: #fff;
}

.card-shine {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(circle at var(--mx) var(--my), rgba(255, 255, 255, 0.28) 0%, transparent 60%);
  pointer-events: none;
  mix-blend-mode: overlay;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chip {
  position: relative;
  width: 46px;
  height: 34px;
  border-radius: 7px;
  background: linear-gradient(135deg, #d4af37 0%, #f6e27a 40%, #aa771c 100%);
  border: 1px solid #7c5c16;
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
}

.chip::before {
  content: "";
  position: absolute;
  inset: 4px 6px;
  border: 1px solid rgba(80, 50, 10, 0.5);
  border-radius: 4px;
}

.chip-line {
  position: absolute;
  background: rgba(80, 50, 10, 0.5);
  width: 100%;
  height: 1px;
}
.chip-line:nth-child(2) {
  width: 1px;
  height: 100%;
}

.contactless {
  color: rgba(255, 255, 255, 0.8);
}

.card-number {
  font-family: "Courier New", Courier, monospace;
  font-size: 1.35rem;
  letter-spacing: 0.18em;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8), 0 0 2px rgba(255, 255, 255, 0.4);
  word-spacing: 0.1em;
}

.card-bottom {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.card-bottom small {
  display: block;
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 3px;
}

.card-bottom strong {
  font-size: 0.95rem;
  letter-spacing: 0.08em;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.7);
}

.card-brand {
  position: relative;
  display: flex;
  align-items: center;
}

.circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: inline-block;
}
.circle-red {
  background: #eb001b;
  margin-right: -10px;
}
.circle-orange {
  background: #ff5f00;
  opacity: 0.92;
}

.back {
  background: linear-gradient(135deg, #0d1117 0%, #161b22 100%);
  color: #fff;
  transform: rotateY(180deg);
  padding: 24px 0 20px;
}

.mag-stripe {
  height: 44px;
  background: #000;
  width: 100%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
}

.cvv-row {
  display: flex;
  align-items: center;
  padding: 0 24px;
  margin-top: 16px;
  gap: 12px;
}

.sig-strip {
  flex: 1;
  height: 34px;
  background: repeating-linear-gradient(45deg, #fff, #fff 4px, #e5e7eb 4px, #e5e7eb 8px);
  border-radius: 4px;
  display: flex;
  align-items: center;
  padding: 0 10px;
}

.sig-strip span {
  font-size: 0.55rem;
  color: #6b7280;
  font-style: italic;
  font-family: sans-serif;
}

.cvv {
  background: #fff;
  color: #111;
  padding: 5px 10px;
  border-radius: 4px;
  font-family: monospace;
  font-weight: 700;
  font-size: 0.9rem;
}

.card-notes {
  padding: 0 24px;
  margin: 10px 0 0;
  font-size: 0.58rem;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.5);
  text-align: left;
}

.hologram-seal {
  align-self: flex-end;
  margin-right: 24px;
  width: 38px;
  height: 26px;
  border-radius: 6px;
  background: linear-gradient(135deg, #4ade80, #06b6d4, #f43f5e);
  opacity: 0.7;
}

.hint {
  color: rgba(255, 255, 255, 0.65);
  font-size: 0.9rem;
  margin: 0;
}

@media (prefers-reduced-motion: reduce) {
  .card3d { transition: none; }
}`,
    js: `var card = document.getElementById("card3d");
var wrap = document.getElementById("cardWrap");
var isFlipped = false;
var MAX_TILT = 16;

wrap.addEventListener("pointermove", function(e) {
  var rect = card.getBoundingClientRect();
  var x = (e.clientX - rect.left) / rect.width;
  var y = (e.clientY - rect.top) / rect.height;
  var rx = (0.5 - y) * MAX_TILT;
  var ry = (x - 0.5) * MAX_TILT;

  card.style.setProperty("--rx", rx + "deg");
  card.style.setProperty("--ry", ry + "deg");
  card.style.setProperty("--mx", (x * 100) + "%");
  card.style.setProperty("--my", (y * 100) + "%");
});

wrap.addEventListener("pointerleave", function() {
  card.style.setProperty("--rx", "0deg");
  card.style.setProperty("--ry", "0deg");
});

function toggleFlip() {
  isFlipped = !isFlipped;
  card.classList.toggle("flipped", isFlipped);
}

card.addEventListener("click", toggleFlip);
card.addEventListener("keydown", function(e) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    toggleFlip();
  }
});`,
    prompt: `Create an interactive 3D holographic credit card in plain HTML, CSS and vanilla JavaScript.

Requirements:
- A wrapper with perspective: 1200px on a dark radial-gradient background.
- A card element with standard ISO credit card ratio (aspect-ratio: 1.586, max-width 360px), transform-style: preserve-3d.
- Two sides: front and back, both with backface-visibility: hidden. Back side is pre-rotated with transform: rotateY(180deg).
- Front face: gold EMV microchip with line details, contactless SVG icon, embossed 16-digit card number in monospace, cardholder name, expiry date, and overlapping dual-circle card network brand logo.
- An interactive specular shine highlight overlay positioned with CSS variables --mx and --my using mix-blend-mode: overlay.
- Back face: full-width black magnetic stripe, signature strip with safety pattern, white CVV box, small disclaimer text, and a mini rainbow hologram seal.
- JavaScript: pointermove tracks cursor across the card to apply realistic 3D tilt (rotateX and rotateY up to 16deg) and move the light reflection. Click or Enter key toggles the 180-degree flip.
- Full keyboard accessibility and prefers-reduced-motion support.

Return a single HTML file with <style> and <script> tags.`,
    steps: [
      "Set perspective on the parent container so 3D rotations show true geometric depth.",
      "Give the card transform-style: preserve-3d and create two faces (front and back) stacked with position: absolute.",
      "Add backface-visibility: hidden to both faces and rotate the back face 180 degrees around Y.",
      "Draw the EMV chip and card details with CSS gradients, rounded corners, and subtle text-shadows for the embossed effect.",
      "Use pointermove to calculate relative cursor coordinates (0 to 1) and map them to rotation angles and shine position.",
      "Toggle a .flipped class on click or keydown that adds 180deg to the Y rotation.",
    ],
    tips: [
      "Use ISO/IEC 7810 standard aspect ratio 1.586 (approx 85.6mm x 53.98mm) so the card proportions look authentic.",
      "The specular shine using mix-blend-mode: overlay mimics real PVC plastic lamination.",
      "Support both mouse tilt and keyboard flip so everyone can interact with the card.",
    ],
  },
  {
    slug: "3d-laptop-mockup",
    name: "3D Laptop Screen Reveal",
    tone: "dark",
    tags: ["css 3d", "mockup", "laptop", "hardware", "animation"],
    description:
      "A MacBook-style laptop built with pure CSS 3D transforms that opens its screen on hover. Features a glowing code editor screen, brushed aluminium body, keyboard well, and glass trackpad.",
    html: `<div class="stage">
  <div class="laptop" tabindex="0" aria-label="3D Laptop Mockup. Hover or focus to open screen">
    <div class="lid">
      <div class="screen">
        <div class="screen-bar">
          <div class="window-dots"><i></i><i></i><i></i></div>
          <span class="file-name">App.jsx &mdash; Next.js 16</span>
        </div>
        <div class="screen-code">
          <p><span class="kwd">import</span> { useState } <span class="kwd">from</span> <span class="str">"react"</span>;</p>
          <p><span class="kwd">export default function</span> <span class="fn">Hero</span>() {</p>
          <p>&nbsp;&nbsp;<span class="kwd">return</span> (</p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span class="tag">div</span> <span class="attr">className</span>=<span class="str">"canvas-3d"</span>&gt;</p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span class="tag">h1</span>&gt;Ship with 3D UI&lt;/<span class="tag">h1</span>&gt;</p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&lt;/<span class="tag">div</span>&gt;</p>
          <p>&nbsp;&nbsp;);</p>
          <p>}</p>
        </div>
      </div>
      <div class="lid-back">
        <div class="brand-glyph"></div>
      </div>
    </div>
    <div class="base">
      <div class="keyboard-well">
        <div class="kb-row"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>
        <div class="kb-row"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>
        <div class="kb-row"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>
        <div class="kb-space"></div>
      </div>
      <div class="trackpad"></div>
      <div class="thumb-notch"></div>
    </div>
  </div>
  <p class="caption">Hover or tap to open display &bull; Pure CSS 3D</p>
</div>`,
    css: `${STAGE}

.stage {
  perspective: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
}

.laptop {
  position: relative;
  width: min(86vw, 360px);
  height: 230px;
  transform-style: preserve-3d;
  transform: rotateX(60deg) rotateZ(-28deg);
  transition: transform 0.6s cubic-bezier(0.2, 0.7, 0.2, 1);
  cursor: pointer;
  outline: none;
}

.laptop:hover,
.laptop:focus-visible {
  transform: rotateX(54deg) rotateZ(-18deg) translateY(-10px);
}

/* Base / bottom chassis */
.base {
  position: absolute;
  inset: 0;
  border-radius: 16px;
  background: linear-gradient(180deg, #b0b4be 0%, #838896 100%);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 18px 24px 48px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.5);
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.keyboard-well {
  width: 90%;
  height: 120px;
  background: #1e2026;
  border-radius: 8px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.6);
}

.kb-row {
  display: flex;
  gap: 4px;
  height: 20px;
}

.kb-row span {
  flex: 1;
  background: #2b2f38;
  border-radius: 3px;
  border-bottom: 1.5px solid #17181c;
}

.kb-space {
  width: 45%;
  height: 20px;
  background: #2b2f38;
  margin: 0 auto;
  border-radius: 3px;
  border-bottom: 1.5px solid #17181c;
}

.trackpad {
  width: 100px;
  height: 60px;
  margin-top: 10px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.25);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.15);
}

.thumb-notch {
  position: absolute;
  bottom: 0;
  width: 50px;
  height: 4px;
  background: rgba(0, 0, 0, 0.35);
  border-radius: 3px 3px 0 0;
}

/* Lid / Screen hinged at top edge of base */
.lid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  border-radius: 16px;
  transform-style: preserve-3d;
  transform-origin: top center;
  transform: rotateX(-75deg);
  transition: transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.laptop:hover .lid,
.laptop:focus-visible .lid {
  transform: rotateX(-105deg);
}

.screen {
  position: absolute;
  inset: 0;
  border-radius: 16px;
  background: #090d16;
  border: 8px solid #11141c;
  box-shadow: 0 0 40px rgba(37, 6, 173, 0.25);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.screen-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: #161a24;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.window-dots {
  display: flex;
  gap: 5px;
}
.window-dots i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  display: block;
}
.window-dots i:nth-child(1) { background: #ef4444; }
.window-dots i:nth-child(2) { background: #f59e0b; }
.window-dots i:nth-child(3) { background: #10b981; }

.file-name {
  font-size: 0.65rem;
  color: #94a3b8;
  font-family: monospace;
}

.screen-code {
  padding: 12px 14px;
  font-family: "Courier New", Courier, monospace;
  font-size: 0.75rem;
  line-height: 1.5;
  color: #e2e8f0;
}

.screen-code p { margin: 0; }
.kwd { color: #f43f5e; font-weight: 700; }
.fn { color: #38bdf8; }
.str { color: #a3e635; }
.tag { color: #fb923c; }
.attr { color: #e879f9; }

.lid-back {
  position: absolute;
  inset: 0;
  border-radius: 16px;
  background: linear-gradient(180deg, #9ca3af 0%, #6b7280 100%);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transform: rotateY(180deg);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  display: grid;
  place-items: center;
}

.brand-glyph {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.7);
  box-shadow: 0 0 16px rgba(255, 255, 255, 0.8);
}

.caption {
  color: rgba(255, 255, 255, 0.65);
  font-size: 0.9rem;
  margin: 0;
}

@media (prefers-reduced-motion: reduce) {
  .laptop, .lid { transition: none; }
  .lid { transform: rotateX(-105deg); }
}`,
    prompt: `Create a 3D laptop hardware mockup that smoothly opens its screen on hover, using only HTML and CSS (no JavaScript).

Requirements:
- A stage with perspective: 1200px, dark gradient background.
- A "laptop" element transformed in isometric 3D space: rotateX(60deg) rotateZ(-28deg), with transform-style: preserve-3d.
- A "base" element with brushed aluminium gradient, keyboard well with multi-row keys and spacebar, glass trackpad, and front notch.
- A "lid" element hinged along its top edge (transform-origin: top center) with transform-style: preserve-3d, initial transform: rotateX(-75deg) (semi-closed).
- On :hover or :focus-visible of the laptop, transition the lid to rotateX(-105deg) (fully open display) over 0.8s with a realistic cubic-bezier ease.
- The lid has two faces: the inside "screen" with a dark IDE theme, traffic light window dots, and formatted React code, and the outside "lid-back" with an illuminated brand logo.
- Full responsive sizing and prefers-reduced-motion support.

Return one HTML file with a <style> block.`,
    steps: [
      "Set perspective on the stage and tip the laptop container back in 3D using rotateX and rotateZ.",
      "Style the base chassis with a grey aluminium gradient, deep keyboard well, and trackpad.",
      "Position the lid at the top edge of the base and set transform-origin: top center so it pivots on its hinge.",
      "Rotate the lid backward on hover. Because the origin is on the hinge line, it swings open naturally.",
      "Add backface-visibility: hidden to both the screen and the outer lid casing.",
      "Style the screen with an editor header and syntax-highlighted code.",
    ],
    tips: [
      "Adjust the hover angle between -95deg and -115deg to match your preferred viewing angle.",
      "Replace the code editor content with an iframe or website preview image to show off portfolio projects.",
      "Works entirely without JavaScript, making it lightweight for hero sections.",
    ],
  },
  {
    slug: "3d-orbital-atom-rings",
    name: "3D Orbital Gyroscope",
    tone: "dark",
    tags: ["css 3d", "rings", "space", "orbit", "no javascript"],
    description:
      "Three concentric 3D rings gimbaling around a glowing core at staggered rotational axes, with orbiting particle sparks. Pure CSS 3D keyframe motion.",
    html: `<div class="gyro-stage">
  <div class="gyroscope">
    <div class="core-glow"></div>
    <div class="ring-wrap ring-x">
      <div class="ring"><span class="electron"></span></div>
    </div>
    <div class="ring-wrap ring-y">
      <div class="ring"><span class="electron"></span></div>
    </div>
    <div class="ring-wrap ring-z">
      <div class="ring"><span class="electron"></span></div>
    </div>
  </div>
  <p class="gyro-caption">Concentric 3D Gimbal &bull; Pure CSS 3D</p>
</div>`,
    css: `${STAGE}

.gyro-stage {
  perspective: 1000px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 36px;
}

.gyroscope {
  position: relative;
  width: 220px;
  height: 220px;
  transform-style: preserve-3d;
  animation: gyro-float 16s ease-in-out infinite alternate;
}

.core-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 38px;
  height: 38px;
  margin: -19px 0 0 -19px;
  border-radius: 50%;
  background: radial-gradient(circle, #fff 0%, #ff7b00 45%, #2506ad 80%);
  box-shadow: 0 0 35px #ff7b00, 0 0 65px #2506ad;
  animation: pulse-core 3s ease-in-out infinite alternate;
}

.ring-wrap {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
}

.ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.45);
  transform-style: preserve-3d;
}

.electron {
  position: absolute;
  top: -6px;
  left: calc(50% - 6px);
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 12px #ff7b00, 0 0 20px #ff7b00;
}

.ring-x {
  animation: spin-x 8s linear infinite;
}
.ring-x .ring {
  border-color: rgba(255, 123, 0, 0.65);
  box-shadow: 0 0 20px rgba(255, 123, 0, 0.25);
}

.ring-y {
  animation: spin-y 11s linear infinite;
}
.ring-y .ring {
  border-color: rgba(6, 182, 212, 0.65);
  box-shadow: 0 0 20px rgba(6, 182, 212, 0.25);
}
.ring-y .electron {
  background: #67e8f9;
  box-shadow: 0 0 12px #06b6d4, 0 0 20px #06b6d4;
}

.ring-z {
  animation: spin-z 14s linear infinite;
}
.ring-z .ring {
  border-color: rgba(168, 85, 247, 0.65);
  box-shadow: 0 0 20px rgba(168, 85, 247, 0.25);
}
.ring-z .electron {
  background: #f472b6;
  box-shadow: 0 0 12px #a855f7, 0 0 20px #a855f7;
}

@keyframes spin-x {
  from { transform: rotate3d(1, 1, 0, 0deg); }
  to   { transform: rotate3d(1, 1, 0, 360deg); }
}

@keyframes spin-y {
  from { transform: rotate3d(0, 1, 1, 0deg); }
  to   { transform: rotate3d(0, 1, 1, 360deg); }
}

@keyframes spin-z {
  from { transform: rotate3d(1, 0, 1, 0deg); }
  to   { transform: rotate3d(1, 0, 1, 360deg); }
}

@keyframes gyro-float {
  0%   { transform: rotateX(20deg) rotateY(15deg); }
  100% { transform: rotateX(-20deg) rotateY(-25deg); }
}

@keyframes pulse-core {
  0%   { transform: scale(0.9); opacity: 0.85; }
  100% { transform: scale(1.15); opacity: 1; }
}

.gyro-caption {
  color: rgba(255, 255, 255, 0.65);
  font-size: 0.9rem;
  margin: 0;
}

@media (prefers-reduced-motion: reduce) {
  .gyroscope, .ring-wrap, .core-glow { animation: none; }
  .ring-x { transform: rotate3d(1, 1, 0, 45deg); }
  .ring-y { transform: rotate3d(0, 1, 1, 60deg); }
  .ring-z { transform: rotate3d(1, 0, 1, 30deg); }
}`,
    prompt: `Create a 3D orbital gyroscope with concentric spinning rings and a glowing core using only HTML and CSS (no JavaScript).

Requirements:
- A stage with perspective: 1000px, dark space background.
- A gyroscope container with transform-style: preserve-3d that gently rocks on dual axes.
- A glowing spherical core at the center with radial-gradient and glowing box-shadows.
- Three concentric circular ring wrappers rotated on distinct 3D axes (rotate3d(1, 1, 0), rotate3d(0, 1, 1), and rotate3d(1, 0, 1)) spinning continuously at different speeds (8s, 11s, 14s).
- Each ring is coloured uniquely (orange, cyan, purple) with soft neon glow, and carries a glowing "electron" bead at its perimeter.
- All rings maintain real 3D depth with transform-style: preserve-3d.
- Respect prefers-reduced-motion by freezing the rings at distinct aesthetic angles.

Return one HTML file with a <style> block.`,
    steps: [
      "Create a container with perspective and transform-style: preserve-3d.",
      "Add a pulsating radial-gradient sphere at the exact center.",
      "Build three separate ring layers and animate each on a composite 3D axis using rotate3d().",
      "Attach a small glowing bead to each ring perimeter to highlight the orbital path.",
      "Give each ring a different rotation period so their intersections never look repetitive.",
    ],
    tips: [
      "Use rotate3d(x, y, z, angle) to spin in any arbitrary 3D plane without nesting multiple elements.",
      "Add box-shadow glows matching the border colour to create a neon holographic aesthetic.",
      "Excellent as an interactive AI / quantum computing hero illustration.",
    ],
  },
  {
    slug: "perspective-mockup-tilt",
    name: "3D Perspective Mockup Tilt",
    tone: "dark",
    tags: ["css 3d", "mockup", "perspective", "tilt", "interactive", "scene"],
    colors: ["#0a0f1d", "#3b82f6", "#6366f1", "#ffffff"],
    description: "An interactive 3D application mockup card that tilts with cursor movement and reflects a dynamic specular glare.",
    html: `<div class="tilt-stage" id="tiltStage">
  <div class="tilt-card" id="tiltCard">
    <div class="tilt-glare" id="tiltGlare"></div>
    <div class="tilt-browser-bar">
      <div class="tilt-dots">
        <span></span><span></span><span></span>
      </div>
      <div class="tilt-url">https://app.vectoranalytics.ai/dashboard</div>
    </div>
    <div class="tilt-screen">
      <div class="tilt-top-stats">
        <div class="ts-box"><small>ACTIVE CLUSTERS</small><b>2,410</b></div>
        <div class="ts-box"><small>AVG LATENCY</small><b>1.8 ms</b></div>
        <div class="ts-box"><small>UPTIME</small><b>99.99%</b></div>
      </div>
      <div class="tilt-chart-mock">
        <div class="tc-bar" style="height: 45%;"></div>
        <div class="tc-bar" style="height: 65%;"></div>
        <div class="tc-bar" style="height: 40%;"></div>
        <div class="tc-bar" style="height: 85%;"></div>
        <div class="tc-bar tc-active" style="height: 100%;"></div>
        <div class="tc-bar" style="height: 75%;"></div>
        <div class="tc-bar" style="height: 90%;"></div>
      </div>
    </div>
  </div>
</div>`,
    css: `.tilt-stage {
  min-height: 100vh;
  background: radial-gradient(circle at center, #111827 0%, #030712 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1200px;
  padding: 30px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #ffffff;
  overflow: hidden;
}

.tilt-card {
  position: relative;
  width: 100%;
  max-width: 620px;
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 18px;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.7);
  transform-style: preserve-3d;
  transition: transform 0.15s ease-out;
  overflow: hidden;
}

.tilt-glare {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.15) 0%, transparent 60%);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 5;
}

.tilt-browser-bar {
  display: flex;
  align-items: center;
  padding: 12px 18px;
  background: #1e293b;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  gap: 16px;
}

.tilt-dots {
  display: flex;
  gap: 6px;
}

.tilt-dots span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #475569;
}

.tilt-dots span:nth-child(1) { background: #ef4444; }
.tilt-dots span:nth-child(2) { background: #f59e0b; }
.tilt-dots span:nth-child(3) { background: #10b981; }

.tilt-url {
  flex: 1;
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  padding: 4px 12px;
  font-size: 11.5px;
  color: #94a3b8;
  font-family: ui-monospace, monospace;
}

.tilt-screen {
  padding: 24px;
}

.tilt-top-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 24px;
}

.ts-box {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 14px;
  text-align: center;
}

.ts-box small {
  display: block;
  font-size: 10px;
  color: #64748b;
  font-weight: 700;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.ts-box b {
  font-size: 20px;
  color: #38bdf8;
}

.tilt-chart-mock {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 140px;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 16px 20px;
  gap: 12px;
}

.tc-bar {
  flex: 1;
  background: #1e293b;
  border-radius: 6px;
  transition: height 0.3s ease;
}

.tc-bar.tc-active {
  background: linear-gradient(180deg, #38bdf8, #2563eb);
  box-shadow: 0 0 15px rgba(56, 189, 248, 0.5);
}`,
    js: `var stage = document.getElementById("tiltStage");
var card = document.getElementById("tiltCard");
var glare = document.getElementById("tiltGlare");

stage.addEventListener("mousemove", function(e) {
  var rect = stage.getBoundingClientRect();
  var x = e.clientX - rect.left;
  var y = e.clientY - rect.top;
  
  var cx = rect.width / 2;
  var cy = rect.height / 2;
  
  var dx = (x - cx) / cx;
  var dy = (y - cy) / cy;
  
  var rotX = -dy * 16;
  var rotY = dx * 16;
  
  card.style.transform = "rotateX(" + rotX + "deg) rotateY(" + rotY + "deg)";
  glare.style.opacity = "1";
  glare.style.background = "radial-gradient(circle at " + (x / rect.width * 100) + "% " + (y / rect.height * 100) + "%, rgba(255,255,255,0.18) 0%, transparent 50%)";
});

stage.addEventListener("mouseleave", function() {
  card.style.transform = "rotateX(0deg) rotateY(0deg)";
  glare.style.opacity = "0";
});`,
    prompt: `Create an interactive 3D perspective dashboard mockup card that tilts with cursor movement in HTML, CSS and vanilla JavaScript.

Requirements:
- Perspective stage with perspective: 1200px.
- Card with transform-style: preserve-3d.
- Mousemove listener on container computing delta from center to calculate dynamic rotateX and rotateY angles.
- Specular glare overlay positioned dynamically based on cursor percentage.
- Browser top bar with 3 macOS-style dots and URL chip.
- Smooth return to neutral state on mouseleave.

Return one HTML file with <style> and <script> tags.`,
    steps: [
      "Set perspective on the parent stage and transform-style: preserve-3d on the card.",
      "Calculate relative mouse position from card center: dx = (x - cx) / cx.",
      "Apply rotateX(-dy * maxAngle) and rotateY(dx * maxAngle) dynamically.",
      "Update radial-gradient glare origin to match mouse position coordinates.",
    ],
    tips: [
      "Inverting dy gives natural 3D tilt towards the mouse.",
      "Use transition: transform 0.15s ease-out to eliminate jitter while maintaining responsiveness.",
    ],
  },
  {
    slug: "floating-3d-badge-hex",
    name: "Floating 3D Hexagonal Shield",
    tone: "dark",
    tags: ["css 3d", "badge", "shield", "hex", "floating", "scene"],
    colors: ["#020617", "#06b6d4", "#3b82f6", "#ffffff"],
    description: "A levitating 3D multifaceted hexagonal cyber emblem with rotational depth and glowing neon neon borders.",
    html: `<div class="hex-stage">
  <div class="hex-shield">
    <div class="hex-face hex-front">
      <div class="hex-inner">
        <div class="hex-glyph">⚡</div>
        <div class="hex-title">CORE SHIELD</div>
        <div class="hex-sub">QUANTUM LAYER</div>
      </div>
    </div>
    <div class="hex-ring"></div>
  </div>
</div>`,
    css: `.hex-stage {
  min-height: 100vh;
  background: #020617;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1000px;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #ffffff;
}

.hex-shield {
  position: relative;
  width: 220px;
  height: 250px;
  transform-style: preserve-3d;
  animation: hexLevitate 6s ease-in-out infinite, hexRotate 16s linear infinite;
}

.hex-face {
  position: absolute;
  inset: 0;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  background: linear-gradient(145deg, #0f172a, #1e293b);
  border: 2px solid #38bdf8;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 35px rgba(56, 189, 248, 0.4);
}

.hex-inner {
  text-align: center;
}

.hex-glyph {
  font-size: 48px;
  filter: drop-shadow(0 0 12px #38bdf8);
  margin-bottom: 8px;
}

.hex-title {
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 2px;
  color: #ffffff;
  margin-bottom: 2px;
}

.hex-sub {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: #38bdf8;
}

.hex-ring {
  position: absolute;
  width: 280px;
  height: 280px;
  top: -15px;
  left: -30px;
  border-radius: 50%;
  border: 1px dashed rgba(56, 189, 248, 0.4);
  transform: rotateX(75deg);
  pointer-events: none;
  animation: ringSpin 10s linear infinite;
}

@keyframes hexLevitate {
  0%, 100% { transform: translateY(0) rotateX(12deg) rotateY(18deg); }
  50%      { transform: translateY(-20px) rotateX(-8deg) rotateY(-18deg); }
}

@keyframes hexRotate {
  0%   { filter: drop-shadow(0 20px 30px rgba(56, 189, 248, 0.2)); }
  50%  { filter: drop-shadow(0 20px 45px rgba(6, 182, 212, 0.45)); }
  100% { filter: drop-shadow(0 20px 30px rgba(56, 189, 248, 0.2)); }
}

@keyframes ringSpin {
  from { transform: rotateX(75deg) rotateZ(0deg); }
  to   { transform: rotateX(75deg) rotateZ(360deg); }
}

@media (prefers-reduced-motion: reduce) {
  .hex-shield, .hex-ring { animation: none; }
}`,
    prompt: `Create a floating 3D hexagonal badge shield using only HTML and CSS.

Requirements:
- CSS polygon clip-path for authentic hexagon geometry: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%).
- 3D perspective stage with levitation keyframes altering translateY, rotateX, and rotateY.
- Dashed orbital ring spinning on an angled 3D plane around the badge.
- Glowing drop-shadow and cyber aesthetic.
- Zero JavaScript.

Return one HTML file with a <style> block.`,
    steps: [
      "Use clip-path: polygon() to produce a symmetric 6-sided hexagon.",
      "Nest the shape in a container with transform-style: preserve-3d.",
      "Animate multi-axis oscillation and floating physics with CSS keyframes.",
    ],
    tips: [
      "Add a dashed rotating ring tilted with rotateX(75deg) for a sci-fi gyro effect.",
    ],
  },
  {
    slug: "3d-floating-coin-crypto",
    name: "3D Spinning Gold Crypto Coin",
    tone: "dark",
    tags: ["css 3d", "coin", "crypto", "gold", "finance", "scene"],
    colors: ["#090d16", "#f59e0b", "#fbbf24", "#ffffff"],
    description: "A continuous 360-degree spinning 3D gold crypto currency coin with specular metallic rim and floating levitation.",
    html: `<div class="coin-stage">
  <div class="coin-container">
    <div class="coin-disc">
      <div class="coin-face coin-front">
        <div class="coin-rim"></div>
        <div class="coin-glyph">₿</div>
      </div>
      <div class="coin-face coin-back">
        <div class="coin-rim"></div>
        <div class="coin-glyph">⚡</div>
      </div>
    </div>
  </div>
  <div class="coin-shadow"></div>
</div>`,
    css: `.coin-stage {
  min-height: 100vh;
  background: radial-gradient(circle at center, #1e1b4b 0%, #090d16 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  perspective: 1000px;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #ffffff;
}

.coin-container {
  position: relative;
  width: 180px;
  height: 180px;
  transform-style: preserve-3d;
  animation: coinFloat 4s ease-in-out infinite;
}

.coin-disc {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  animation: coinSpin 8s linear infinite;
}

.coin-face {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: linear-gradient(135deg, #fef08a 0%, #f59e0b 50%, #b45309 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid #fde047;
  box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.4), 0 0 30px rgba(245, 158, 11, 0.35);
  backface-visibility: hidden;
}

.coin-front {
  transform: translateZ(6px);
}

.coin-back {
  transform: rotateY(180deg) translateZ(6px);
}

.coin-rim {
  position: absolute;
  inset: 10px;
  border-radius: 50%;
  border: 2px dashed rgba(255, 255, 255, 0.4);
}

.coin-glyph {
  font-size: 64px;
  font-weight: 900;
  color: #78350f;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.6), -1px -1px 2px rgba(0, 0, 0, 0.4);
}

.coin-shadow {
  width: 140px;
  height: 24px;
  border-radius: 50%;
  background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.6) 0%, transparent 70%);
  margin-top: 50px;
  animation: shadowPulse 4s ease-in-out infinite;
}

@keyframes coinFloat {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-24px); }
}

@keyframes coinSpin {
  from { transform: rotateY(0deg); }
  to   { transform: rotateY(360deg); }
}

@keyframes shadowPulse {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50%      { transform: scale(0.7); opacity: 0.3; }
}

@media (prefers-reduced-motion: reduce) {
  .coin-container, .coin-disc, .coin-shadow { animation: none; }
}`,
    prompt: `Create a spinning 3D gold crypto coin in pure HTML and CSS.

Requirements:
- CSS 3D perspective stage with backface-visibility: hidden.
- Front and back coin faces with translateZ(6px) depth.
- Continuous 360-degree rotateY spin animation.
- Synchronized vertical floating and floor shadow pulsation.
- Zero JavaScript.

Return one HTML file with a <style> block.`,
    steps: [
      "Create front and back circular faces separated by translateZ in a preserve-3d container.",
      "Animate rotateY from 0 to 360 degrees infinitely.",
      "Add vertical levitation with synchronized scale on the ground shadow.",
    ],
    tips: [
      "Inset dashed border creates an authentic minted coin edge rim.",
    ],
  },
  {
    slug: "3d-origami-tetrahedron",
    name: "3D Origami Geometric Crystal",
    tone: "dark",
    tags: ["css 3d", "origami", "crystal", "geometric", "scene"],
    colors: ["#020617", "#06b6d4", "#a855f7", "#ffffff"],
    description: "A rotating 3D geometric polyhedral crystal with luminous translucent faces, vertex nodes, and prismatic reflections.",
    html: `<div class="crys-stage">
  <div class="crys-poly">
    <div class="crys-face cf-1"></div>
    <div class="crys-face cf-2"></div>
    <div class="crys-face cf-3"></div>
    <div class="crys-face cf-4"></div>
  </div>
</div>`,
    css: `.crys-stage {
  min-height: 100vh;
  background: #020617;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 900px;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #ffffff;
}

.crys-poly {
  position: relative;
  width: 160px;
  height: 160px;
  transform-style: preserve-3d;
  animation: crysSpin 12s linear infinite;
}

.crys-face {
  position: absolute;
  width: 0;
  height: 0;
  border-left: 80px solid transparent;
  border-right: 80px solid transparent;
  border-bottom: 140px solid rgba(6, 182, 212, 0.45);
  filter: drop-shadow(0 0 16px rgba(6, 182, 212, 0.4));
  transform-origin: 50% 100%;
}

.cf-1 {
  transform: rotateY(0deg) translateZ(45px) rotateX(30deg);
  border-bottom-color: rgba(6, 182, 212, 0.5);
}

.cf-2 {
  transform: rotateY(120deg) translateZ(45px) rotateX(30deg);
  border-bottom-color: rgba(168, 85, 247, 0.5);
}

.cf-3 {
  transform: rotateY(240deg) translateZ(45px) rotateX(30deg);
  border-bottom-color: rgba(236, 72, 153, 0.5);
}

.cf-4 {
  transform: rotateX(90deg) translateZ(-45px);
  border-bottom-color: rgba(59, 130, 246, 0.4);
}

@keyframes crysSpin {
  0%   { transform: rotateX(15deg) rotateY(0deg) rotateZ(0deg); }
  50%  { transform: rotateX(-25deg) rotateY(180deg) rotateZ(15deg); }
  100% { transform: rotateX(15deg) rotateY(360deg) rotateZ(0deg); }
}

@media (prefers-reduced-motion: reduce) {
  .crys-poly { animation: none; transform: rotateX(20deg) rotateY(45deg); }
}`,
    prompt: `Create a rotating 3D origami geometric crystal in pure HTML and CSS.

Requirements:
- Triangular CSS border faces assembled in 3D space with preserve-3d.
- Distinct vibrant translucent faces (cyan, purple, pink, blue).
- Multi-axis 3D tumble animation.
- Zero JavaScript.

Return one HTML file with a <style> block.`,
    steps: [
      "Use transparent borders to generate equilateral triangular faces.",
      "Position faces at 120-degree intervals around Y axis with rotateX inward incline.",
      "Animate continuous multi-axis rotation.",
    ],
    tips: [
      "Translucent borders with drop-shadow filters replicate faceted mineral glass.",
    ],
  },
  {
    slug: "3d-interactive-book-flip",
    name: "3D Interactive Hardcover Book",
    tone: "dark",
    tags: ["css 3d", "book", "cover", "interactive", "scene"],
    colors: ["#0f172a", "#38bdf8", "#0284c7", "#ffffff"],
    description: "A realistic 3D perspective hardcover tech manual with a dynamic front cover that flips open smoothly on hover.",
    html: `<div class="book-stage">
  <div class="book-wrapper">
    <div class="book-cover">
      <div class="book-spine"></div>
      <div class="bc-front">
        <div class="bc-tag">SYSTEM ARCHITECTURE</div>
        <div class="bc-title">Designing Distributed AI Systems</div>
        <div class="bc-sub">Patterns for Edge Ingestion</div>
        <div class="bc-auth">Ravindra Nath Jha</div>
      </div>
      <div class="bc-back"></div>
    </div>
    <div class="book-pages">
      <div class="bp-content">
        <b>CHAPTER 1: GLOBAL STATE</b>
        <p>In distributed topologies, eventual consistency requires monotonic vector clocks to prevent race conditions during partition events...</p>
      </div>
    </div>
  </div>
</div>`,
    css: `.book-stage {
  min-height: 100vh;
  background: radial-gradient(circle at center, #1e293b 0%, #0a0e1a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1200px;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #ffffff;
}

.book-wrapper {
  position: relative;
  width: 240px;
  height: 340px;
  transform-style: preserve-3d;
  transform: rotateY(-25deg) rotateX(15deg);
  transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
  cursor: pointer;
}

.book-wrapper:hover {
  transform: rotateY(0deg) rotateX(5deg);
}

.book-cover {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  transform-origin: 0% 50%;
  transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
  z-index: 5;
}

.book-wrapper:hover .book-cover {
  transform: rotateY(-130deg);
}

.bc-front {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #0284c7 0%, #0369a1 60%, #0f172a 100%);
  border-radius: 4px 12px 12px 4px;
  padding: 24px 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
  backface-visibility: hidden;
  border-left: 6px solid #075985;
}

.bc-tag {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.5px;
  color: #7dd3fc;
  margin-bottom: 40px;
}

.bc-title {
  font-size: 20px;
  font-weight: 800;
  line-height: 1.25;
  margin-bottom: 8px;
}

.bc-sub {
  font-size: 12px;
  color: #bae6fd;
  margin-bottom: 60px;
}

.bc-auth {
  font-size: 11.5px;
  font-weight: 600;
  color: #e0f2fe;
}

.book-pages {
  position: absolute;
  inset: 5px 5px 5px 12px;
  background: #f8fafc;
  color: #0f172a;
  border-radius: 0 8px 8px 0;
  padding: 20px;
  box-shadow: inset 3px 0 10px rgba(0, 0, 0, 0.15), 5px 10px 25px rgba(0, 0, 0, 0.4);
}

.bp-content b {
  font-size: 11px;
  letter-spacing: 1px;
  color: #0284c7;
  display: block;
  margin-bottom: 8px;
}

.bp-content p {
  font-size: 11.5px;
  line-height: 1.6;
  color: #475569;
  margin: 0;
}`,
    prompt: `Create a 3D interactive hardcover book with a flipping front cover in pure HTML and CSS.

Requirements:
- Hardcover with front cover rotated on Y-axis (transform-origin: 0% 50%).
- Hover state rotates front cover open to rotateY(-130deg) to reveal internal page content.
- 3D perspective angle and realistic drop shadows.
- Zero JavaScript.

Return one HTML file with a <style> block.`,
    steps: [
      "Set perspective on the container and preserve-3d on the book wrapper.",
      "Anchor cover rotation to its left spine edge using transform-origin: 0% 50%.",
      "Rotate cover open on hover to reveal inner pages.",
    ],
    tips: [
      "Use backface-visibility: hidden on front cover so internal text doesn't show in reverse when open.",
    ],
  },
  {
    slug: "3d-floating-island-cube",
    name: "3D Low-Poly Voxel Island Block",
    tone: "dark",
    tags: ["css 3d", "voxel", "island", "cube", "game", "scene"],
    colors: ["#090d16", "#10b981", "#78350f", "#38bdf8"],
    description: "An isometric 3D floating voxel terrain island with grass surface, bedrock stratification, and hovering cloud layers.",
    html: `<div class="island-stage">
  <div class="island-world">
    <div class="voxel-cube">
      <div class="v-face v-top">🌱</div>
      <div class="v-face v-front"></div>
      <div class="v-face v-back"></div>
      <div class="v-face v-left"></div>
      <div class="v-face v-right"></div>
      <div class="v-face v-bottom"></div>
    </div>
    <div class="island-cloud ic-1">☁</div>
    <div class="island-cloud ic-2">☁</div>
  </div>
</div>`,
    css: `.island-stage {
  min-height: 100vh;
  background: radial-gradient(circle at center, #0c1527 0%, #030712 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1000px;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #ffffff;
}

.island-world {
  position: relative;
  width: 140px;
  height: 140px;
  transform-style: preserve-3d;
  transform: rotateX(60deg) rotateZ(-45deg);
  animation: islandBob 6s ease-in-out infinite alternate;
}

.voxel-cube {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
}

.v-face {
  position: absolute;
  width: 140px;
  height: 140px;
  border: 1px solid rgba(0, 0, 0, 0.2);
}

.v-top {
  transform: rotateX(0deg) translateZ(70px);
  background: #10b981;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.15);
}

.v-front {
  transform: rotateX(-90deg) translateZ(70px);
  background: linear-gradient(180deg, #059669 20%, #78350f 20%, #451a03 100%);
}

.v-back {
  transform: rotateX(90deg) translateZ(70px);
  background: linear-gradient(180deg, #059669 20%, #78350f 20%, #451a03 100%);
}

.v-left {
  transform: rotateY(-90deg) translateZ(70px);
  background: linear-gradient(180deg, #047857 20%, #5c270b 20%, #301201 100%);
}

.v-right {
  transform: rotateY(90deg) translateZ(70px);
  background: linear-gradient(180deg, #059669 20%, #78350f 20%, #451a03 100%);
}

.v-bottom {
  transform: rotateX(180deg) translateZ(70px);
  background: #301201;
}

.island-cloud {
  position: absolute;
  font-size: 32px;
  color: rgba(255, 255, 255, 0.7);
  transform-style: preserve-3d;
  pointer-events: none;
}

.ic-1 {
  top: -40px;
  left: -50px;
  transform: translateZ(90px);
  animation: cloudDrift1 10s ease-in-out infinite alternate;
}

.ic-2 {
  bottom: -40px;
  right: -50px;
  transform: translateZ(110px);
  animation: cloudDrift2 12s ease-in-out infinite alternate;
}

@keyframes islandBob {
  0%   { transform: rotateX(60deg) rotateZ(-45deg) translateZ(0); }
  100% { transform: rotateX(55deg) rotateZ(-40deg) translateZ(30px); }
}

@keyframes cloudDrift1 {
  from { transform: translateZ(90px) translateX(-20px); }
  to   { transform: translateZ(90px) translateX(30px); }
}

@keyframes cloudDrift2 {
  from { transform: translateZ(110px) translateX(20px); }
  to   { transform: translateZ(110px) translateX(-25px); }
}

@media (prefers-reduced-motion: reduce) {
  .island-world, .island-cloud { animation: none; }
}`,
    prompt: `Create a 3D isometric floating low-poly voxel terrain block with hovering clouds in HTML and CSS.

Requirements:
- True 3D cube assembled using translateZ(70px) on 6 faces.
- Isometric perspective angle: rotateX(60deg) rotateZ(-45deg).
- Top face styled with green turf, side faces with dirt/stone strata gradients.
- Floating clouds offset on Z-axis with drift animations.
- Zero JavaScript.

Return one HTML file with a <style> block.`,
    steps: [
      "Assemble 6 faces of a 140px cube inside a transform-style: preserve-3d container.",
      "Apply isometric angles rotateX(60deg) rotateZ(-45deg) on wrapper.",
      "Add vertical oscillation keyframes.",
    ],
    tips: [
      "Darken the left face slightly (e.g. #047857) to simulate directional isometric sunlight.",
    ],
  },
  {
    slug: "3d-cylinder-carousel-gallery",
    name: "3D Cylinder Ring Carousel",
    tone: "dark",
    tags: ["css 3d", "carousel", "cylinder", "gallery", "scene"],
    colors: ["#020617", "#3b82f6", "#8b5cf6", "#ec4899"],
    description: "A rotating 3D cylindrical drum carousel with 6 panels arranged radially in 360-degree perspective space.",
    html: `<div class="cyl-stage">
  <div class="cyl-ring">
    <div class="cyl-card cc-1"><span>01</span><b>AI Models</b></div>
    <div class="cyl-card cc-2"><span>02</span><b>Edge DB</b></div>
    <div class="cyl-card cc-3"><span>03</span><b>Pipelines</b></div>
    <div class="cyl-card cc-4"><span>04</span><b>Telemetry</b></div>
    <div class="cyl-card cc-5"><span>05</span><b>Security</b></div>
    <div class="cyl-card cc-6"><span>06</span><b>Analytics</b></div>
  </div>
</div>`,
    css: `.cyl-stage {
  min-height: 100vh;
  background: radial-gradient(circle at center, #0f172a 0%, #020617 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1100px;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #ffffff;
}

.cyl-ring {
  position: relative;
  width: 180px;
  height: 220px;
  transform-style: preserve-3d;
  animation: cylRotate 20s linear infinite;
}

.cyl-ring:hover {
  animation-play-state: paused;
}

.cyl-card {
  position: absolute;
  inset: 0;
  border-radius: 16px;
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.cyl-card:hover {
  border-color: #38bdf8;
}

.cyl-card span {
  font-size: 11px;
  font-family: ui-monospace, monospace;
  color: #64748b;
  font-weight: 700;
}

.cyl-card b {
  font-size: 18px;
  color: #ffffff;
}

.cc-1 { transform: rotateY(0deg) translateZ(240px); background: linear-gradient(180deg, #1e3a8a, #0f172a); }
.cc-2 { transform: rotateY(60deg) translateZ(240px); background: linear-gradient(180deg, #4c1d95, #0f172a); }
.cc-3 { transform: rotateY(120deg) translateZ(240px); background: linear-gradient(180deg, #831843, #0f172a); }
.cc-4 { transform: rotateY(180deg) translateZ(240px); background: linear-gradient(180deg, #064e3b, #0f172a); }
.cc-5 { transform: rotateY(240deg) translateZ(240px); background: linear-gradient(180deg, #78350f, #0f172a); }
.cc-6 { transform: rotateY(300deg) translateZ(240px); background: linear-gradient(180deg, #134e4a, #0f172a); }

@keyframes cylRotate {
  from { transform: rotateX(-10deg) rotateY(0deg); }
  to   { transform: rotateX(-10deg) rotateY(360deg); }
}

@media (prefers-reduced-motion: reduce) {
  .cyl-ring { animation: none; transform: rotateX(-10deg) rotateY(20deg); }
}`,
    prompt: `Create a 3D cylindrical carousel drum with 6 radially arranged card panels in HTML and CSS.

Requirements:
- 6 cards spaced at 60-degree intervals: rotateY(n * 60deg) translateZ(240px).
- Continuous 360-degree rotateY animation with -10deg pitch tilt.
- Hover pauses rotation (animation-play-state: paused).
- Distinct color themes on each panel.
- Zero JavaScript.

Return one HTML file with a <style> block.`,
    steps: [
      "Set perspective on container and preserve-3d on the central ring element.",
      "Calculate translateZ = width / (2 * tan(PI / 6)) to position cards radially without overlaps.",
      "Animate rotateY from 0 to 360 degrees.",
    ],
    tips: [
      "Setting animation-play-state: paused on hover lets users inspect individual cards.",
    ],
  },
  {
    slug: "3d-interactive-compass-gyro",
    name: "3D Navigational Compass Rose",
    tone: "dark",
    tags: ["css 3d", "compass", "navigation", "gyro", "scene"],
    colors: ["#090d16", "#38bdf8", "#f43f5e", "#ffffff"],
    description: "A 3D cybernetic navigational compass rose with directional coordinates, glowing dual needle, and floating gimbal ring.",
    html: `<div class="comp-stage">
  <div class="comp-gyro">
    <div class="comp-ring outer-ring"></div>
    <div class="comp-ring inner-ring">
      <span class="cp-dir cp-n">N</span>
      <span class="cp-dir cp-e">E</span>
      <span class="cp-dir cp-s">S</span>
      <span class="cp-dir cp-w">W</span>
    </div>
    <div class="comp-needle">
      <div class="needle-north"></div>
      <div class="needle-south"></div>
      <div class="needle-pin"></div>
    </div>
  </div>
</div>`,
    css: `.comp-stage {
  min-height: 100vh;
  background: radial-gradient(circle at center, #0f172a 0%, #030712 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 900px;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #ffffff;
}

.comp-gyro {
  position: relative;
  width: 220px;
  height: 220px;
  transform-style: preserve-3d;
  transform: rotateX(45deg) rotateZ(15deg);
  animation: gyroSway 8s ease-in-out infinite alternate;
}

.comp-ring {
  position: absolute;
  border-radius: 50%;
  transform-style: preserve-3d;
}

.outer-ring {
  inset: 0;
  border: 2px dashed rgba(56, 189, 248, 0.4);
  box-shadow: 0 0 25px rgba(56, 189, 248, 0.2);
  animation: ringTick 30s linear infinite;
}

.inner-ring {
  inset: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: radial-gradient(circle, rgba(15, 23, 42, 0.8) 0%, rgba(2, 6, 23, 0.9) 100%);
}

.cp-dir {
  position: absolute;
  font-size: 11px;
  font-weight: 800;
  color: #94a3b8;
  font-family: ui-monospace, monospace;
}

.cp-n { top: 6px; left: 50%; transform: translateX(-50%); color: #f43f5e; }
.cp-s { bottom: 6px; left: 50%; transform: translateX(-50%); }
.cp-e { right: 8px; top: 50%; transform: translateY(-50%); }
.cp-w { left: 8px; top: 50%; transform: translateY(-50%); }

.comp-needle {
  position: absolute;
  inset: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transform-style: preserve-3d;
  animation: needleSpin 12s ease-in-out infinite alternate;
}

.needle-north {
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 50px solid #f43f5e;
  filter: drop-shadow(0 0 10px rgba(244, 63, 94, 0.6));
}

.needle-south {
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 50px solid #38bdf8;
  filter: drop-shadow(0 0 10px rgba(56, 189, 248, 0.6));
}

.needle-pin {
  position: absolute;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 0 10px #ffffff;
  z-index: 5;
}

@keyframes gyroSway {
  0%   { transform: rotateX(45deg) rotateY(-10deg) rotateZ(10deg); }
  100% { transform: rotateX(35deg) rotateY(15deg) rotateZ(-15deg); }
}

@keyframes ringTick {
  from { transform: rotateZ(0deg); }
  to   { transform: rotateZ(360deg); }
}

@keyframes needleSpin {
  0%   { transform: rotateZ(0deg) translateZ(8px); }
  50%  { transform: rotateZ(75deg) translateZ(8px); }
  100% { transform: rotateZ(-40deg) translateZ(8px); }
}

@media (prefers-reduced-motion: reduce) {
  .comp-gyro, .outer-ring, .comp-needle { animation: none; }
}`,
    prompt: `Create a 3D navigational compass rose with dual-needle and rotating outer gimbal in pure HTML and CSS.

Requirements:
- 3D perspective stage with tilted compass gimbal (rotateX(45deg)).
- Outer dashed glowing ring and inner dial with N, S, E, W markers.
- Dual-color needle with red north and cyan south triangles.
- Needle search oscillation animation on Z-axis with translateZ(8px) elevation.
- Zero JavaScript.

Return one HTML file with a <style> block.`,
    steps: [
      "Layer concentric rings with transform-style: preserve-3d.",
      "Assemble triangular needles using CSS border geometry.",
      "Animate gentle compass needle oscillation to simulate magnetic search.",
    ],
    tips: [
      "Elevate the needle above the compass dial with translateZ(8px) for realistic depth.",
    ],
  },
  {
    slug: "3d-layered-glass-card-stack",
    name: "3D Layered Glass Card Fan",
    tone: "dark",
    tags: ["css 3d", "glass", "cards", "stack", "perspective", "scene"],
    colors: ["#0f172a", "#38bdf8", "#818cf8", "#ffffff"],
    description: "A deck of translucent frosted glass cards staggered in 3D perspective space that fan out smoothly on hover.",
    html: `<div class="fan-stage">
  <div class="fan-deck">
    <div class="fan-card fc-bottom">
      <div class="fc-badge">DATABASE LAYER</div>
      <b>Global Shard #03</b>
    </div>
    <div class="fan-card fc-mid">
      <div class="fc-badge">SECURITY PROXY</div>
      <b>mTLS Zero-Trust Gateway</b>
    </div>
    <div class="fan-card fc-top">
      <div class="fc-badge">API INGESTION</div>
      <b>Serverless Edge Worker</b>
    </div>
  </div>
</div>`,
    css: `.fan-stage {
  min-height: 100vh;
  background: radial-gradient(circle at center, #1e1b4b 0%, #090d16 80%);
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1200px;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #ffffff;
}

.fan-deck {
  position: relative;
  width: 260px;
  height: 340px;
  transform-style: preserve-3d;
  transform: rotateX(55deg) rotateZ(-35deg);
  transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
  cursor: pointer;
}

.fan-deck:hover {
  transform: rotateX(45deg) rotateZ(-20deg);
}

.fan-card {
  position: absolute;
  inset: 0;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.5);
  transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.fc-bottom {
  transform: translateZ(0);
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(15, 23, 42, 0.6));
}

.fc-mid {
  transform: translateZ(40px);
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(15, 23, 42, 0.6));
}

.fc-top {
  transform: translateZ(80px);
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(15, 23, 42, 0.6));
}

.fan-deck:hover .fc-mid {
  transform: translateZ(80px) translateY(-30px);
}

.fan-deck:hover .fc-top {
  transform: translateZ(160px) translateY(-60px);
}

.fc-badge {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.5px;
  color: #38bdf8;
}

.fan-card b {
  font-size: 18px;
  line-height: 1.3;
}`,
    prompt: `Create a 3D layered frosted glass card fan stack in pure HTML and CSS.

Requirements:
- 3 translucent glass cards stacked with translateZ spacing (0px, 40px, 80px).
- Isometric perspective deck: rotateX(55deg) rotateZ(-35deg).
- Hover state expands the cards vertically with increased Z elevation (translateZ(160px)).
- Zero JavaScript.

Return one HTML file with a <style> block.`,
    steps: [
      "Set perspective on container and preserve-3d on deck wrapper.",
      "Separate three glass cards using translateZ.",
      "Expand Z-translation and Y-offset smoothly on hover.",
    ],
    tips: [
      "Layering glass cards creates realistic physical refraction and depth.",
    ],
  },
  {
    slug: "3d-floating-diamond-prism",
    name: "3D Floating Gemstone Diamond Prism",
    tone: "dark",
    tags: ["css 3d", "diamond", "prism", "gemstone", "crystal", "scene"],
    colors: ["#020617", "#38bdf8", "#c084fc", "#ffffff"],
    description: "A faceted 3D diamond crystal gemstone spinning continuously on dual axes with iridescent spectrum refractions.",
    html: `<div class="dia-stage">
  <div class="dia-prism">
    <div class="dia-top">
      <div class="dt-face df-1"></div>
      <div class="dt-face df-2"></div>
      <div class="dt-face df-3"></div>
      <div class="dt-face df-4"></div>
    </div>
    <div class="dia-bot">
      <div class="db-face db-1"></div>
      <div class="db-face db-2"></div>
      <div class="db-face db-3"></div>
      <div class="db-face db-4"></div>
    </div>
  </div>
</div>`,
    css: `.dia-stage {
  min-height: 100vh;
  background: radial-gradient(circle at center, #111827 0%, #020617 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1000px;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #ffffff;
}

.dia-prism {
  position: relative;
  width: 140px;
  height: 200px;
  transform-style: preserve-3d;
  animation: diaSpin 10s linear infinite;
}

.dia-top, .dia-bot {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
}

.dt-face {
  position: absolute;
  top: 30px;
  left: 20px;
  width: 0;
  height: 0;
  border-left: 50px solid transparent;
  border-right: 50px solid transparent;
  border-bottom: 70px solid rgba(56, 189, 248, 0.45);
  transform-origin: 50% 100%;
}

.df-1 { transform: rotateY(0deg) translateZ(50px) rotateX(30deg); }
.df-2 { transform: rotateY(90deg) translateZ(50px) rotateX(30deg); border-bottom-color: rgba(192, 132, 252, 0.45); }
.df-3 { transform: rotateY(180deg) translateZ(50px) rotateX(30deg); border-bottom-color: rgba(244, 114, 182, 0.45); }
.df-4 { transform: rotateY(270deg) translateZ(50px) rotateX(30deg); border-bottom-color: rgba(56, 189, 248, 0.45); }

.db-face {
  position: absolute;
  top: 100px;
  left: 20px;
  width: 0;
  height: 0;
  border-left: 50px solid transparent;
  border-right: 50px solid transparent;
  border-top: 80px solid rgba(56, 189, 248, 0.45);
  transform-origin: 50% 0%;
}

.db-1 { transform: rotateY(0deg) translateZ(50px) rotateX(-35deg); }
.db-2 { transform: rotateY(90deg) translateZ(50px) rotateX(-35deg); border-top-color: rgba(192, 132, 252, 0.45); }
.db-3 { transform: rotateY(180deg) translateZ(50px) rotateX(-35deg); border-top-color: rgba(244, 114, 182, 0.45); }
.db-4 { transform: rotateY(270deg) translateZ(50px) rotateX(-35deg); border-top-color: rgba(56, 189, 248, 0.45); }

@keyframes diaSpin {
  0%   { transform: rotateX(15deg) rotateY(0deg); }
  50%  { transform: rotateX(-15deg) rotateY(180deg); }
  100% { transform: rotateX(15deg) rotateY(360deg); }
}

@media (prefers-reduced-motion: reduce) {
  .dia-prism { animation: none; transform: rotateX(15deg) rotateY(30deg); }
}`,
    prompt: `Create a spinning 3D diamond gemstone crystal in pure HTML and CSS.

Requirements:
- 8 triangular CSS border faces forming top and bottom bipyramidal gem facets.
- Translucent iridescent faces (cyan, violet, pink) with drop-shadow glow.
- Continuous multi-axis tumbling rotation.
- Zero JavaScript.

Return one HTML file with a <style> block.`,
    steps: [
      "Build top pyramid using upward triangles and bottom inverted pyramid with downward triangles.",
      "Offset and rotate facets by 90 degrees around Y-axis.",
      "Animate multi-axis keyframes.",
    ],
    tips: [
      "Semi-transparent borders allow inner facet intersections to shimmer through.",
    ],
  },
  {
    slug: "3d-interactive-toggle-lever",
    name: "Industrial 3D Switch Toggle Lever",
    tone: "dark",
    tags: ["css 3d", "switch", "lever", "toggle", "industrial", "scene"],
    colors: ["#090d16", "#ef4444", "#10b981", "#ffffff"],
    description: "An industrial metallic toggle switch lever in 3D perspective space that flips up and down with tactile sound effects and status LED.",
    html: `<div class="lever-stage">
  <div class="lever-panel" id="leverPanel">
    <div class="lp-screws"><span>+</span><span>+</span><span>+</span><span>+</span></div>
    <div class="lp-label" id="leverStateLabel">SYSTEM DISARMED</div>
    <div class="lever-assembly" id="leverAssembly">
      <div class="lever-base"></div>
      <div class="lever-shaft">
        <div class="lever-tip"></div>
      </div>
    </div>
    <div class="lp-led" id="leverLed"></div>
  </div>
</div>`,
    css: `.lever-stage {
  min-height: 100vh;
  background: radial-gradient(circle at center, #1e293b 0%, #090d16 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1000px;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #ffffff;
}

.lever-panel {
  position: relative;
  width: 200px;
  height: 280px;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border: 3px solid #334155;
  border-radius: 18px;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8), inset 0 2px 4px rgba(255, 255, 255, 0.1);
  transform-style: preserve-3d;
  transform: rotateX(20deg);
  cursor: pointer;
}

.lp-screws {
  position: absolute;
  inset: 8px;
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #475569;
  font-weight: 900;
  pointer-events: none;
}

.lp-label {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.5px;
  color: #ef4444;
  margin-top: 10px;
}

.lever-assembly {
  position: relative;
  width: 70px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-style: preserve-3d;
}

.lever-base {
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: radial-gradient(circle, #334155 0%, #0f172a 100%);
  border: 2px solid #475569;
}

.lever-shaft {
  position: absolute;
  width: 14px;
  height: 80px;
  background: linear-gradient(90deg, #94a3b8, #f8fafc, #64748b);
  border-radius: 999px;
  bottom: 30px;
  transform-origin: 50% 100%;
  transform: rotateX(-35deg);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
}

.lever-panel.is-active .lever-shaft {
  transform: rotateX(35deg);
}

.lever-tip {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: radial-gradient(circle, #ef4444 0%, #991b1b 100%);
  box-shadow: 0 0 10px rgba(239, 68, 68, 0.6);
  transition: background 0.3s ease, box-shadow 0.3s ease;
}

.lever-panel.is-active .lever-tip {
  background: radial-gradient(circle, #10b981 0%, #065f46 100%);
  box-shadow: 0 0 16px rgba(16, 185, 129, 0.8);
}

.lp-led {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ef4444;
  box-shadow: 0 0 10px #ef4444;
  transition: all 0.3s ease;
}

.lever-panel.is-active .lp-led {
  background: #10b981;
  box-shadow: 0 0 14px #10b981;
}`,
    js: `var panel = document.getElementById("leverPanel");
var label = document.getElementById("leverStateLabel");
var active = false;

panel.addEventListener("click", function() {
  active = !active;
  panel.classList.toggle("is-active", active);
  label.textContent = active ? "SYSTEM ARMED" : "SYSTEM DISARMED";
  label.style.color = active ? "#10b981" : "#ef4444";
});`,
    prompt: `Create a physical industrial 3D toggle switch lever in HTML, CSS and vanilla JavaScript.

Requirements:
- Metallic faceplate angled in 3D perspective space (rotateX(20deg)).
- Cylindrical lever handle flipping up and down with spring cubic-bezier timing.
- Indicator tip and LED swapping from red (#ef4444) to green (#10b981) on activation.
- Click listener toggling state.

Return one HTML file with <style> and <script> tags.`,
    steps: [
      "Build faceplate with metallic gradients and inset shadows.",
      "Anchor lever handle rotation to its base using transform-origin: 50% 100%.",
      "Toggle .is-active class on click to rotate handle and update LED status.",
    ],
    tips: [
      "Using rotateX(-35deg) to rotateX(35deg) replicates the satisfying physical arc of an industrial toggle switch.",
    ],
  },
  {
    slug: "3d-floating-portal-ring",
    name: "3D Quantum Portal Stargate",
    tone: "dark",
    tags: ["css 3d", "portal", "stargate", "scifi", "scene"],
    colors: ["#020617", "#06b6d4", "#a855f7", "#ffffff"],
    description: "A continuous 3D rotating sci-fi dimensional portal ring with runic glyph marks, energy conduits, and a shimmering vortex center.",
    html: `<div class="portal-stage">
  <div class="portal-ring-outer">
    <div class="portal-core-vortex"></div>
    <div class="portal-conduit pc-1"></div>
    <div class="portal-conduit pc-2"></div>
    <div class="portal-glyph pg-1">✦</div>
    <div class="portal-glyph pg-2">◆</div>
    <div class="portal-glyph pg-3">▲</div>
    <div class="portal-glyph pg-4">●</div>
  </div>
</div>`,
    css: `.portal-stage {
  min-height: 100vh;
  background: radial-gradient(circle at center, #0f172a 0%, #020617 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 900px;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #ffffff;
}

.portal-ring-outer {
  position: relative;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  border: 4px solid #06b6d4;
  box-shadow: 0 0 40px rgba(6, 182, 212, 0.5), inset 0 0 30px rgba(168, 85, 247, 0.5);
  transform-style: preserve-3d;
  transform: rotateX(45deg) rotateY(15deg);
  animation: portalHover 8s ease-in-out infinite alternate;
}

.portal-core-vortex {
  position: absolute;
  inset: 12px;
  border-radius: 50%;
  background: radial-gradient(circle at center, #ffffff 0%, #38bdf8 30%, #9333ea 70%, #0f172a 100%);
  animation: vortexPulse 4s ease-in-out infinite alternate;
  filter: blur(4px);
}

.portal-conduit {
  position: absolute;
  border-radius: 50%;
  border: 1px dashed rgba(255, 255, 255, 0.6);
  pointer-events: none;
}

.pc-1 {
  inset: -14px;
  animation: conduitSpin1 12s linear infinite;
}

.pc-2 {
  inset: 24px;
  border-color: rgba(6, 182, 212, 0.4);
  animation: conduitSpin1 8s linear infinite reverse;
}

.portal-glyph {
  position: absolute;
  font-size: 16px;
  color: #38bdf8;
  text-shadow: 0 0 10px #38bdf8;
}

.pg-1 { top: -14px; left: 50%; transform: translateX(-50%); }
.pg-2 { bottom: -14px; left: 50%; transform: translateX(-50%); }
.pg-3 { left: -14px; top: 50%; transform: translateY(-50%); }
.pg-4 { right: -14px; top: 50%; transform: translateY(-50%); }

@keyframes portalHover {
  0%   { transform: rotateX(45deg) rotateY(15deg) translateY(0); }
  100% { transform: rotateX(35deg) rotateY(-15deg) translateY(-24px); }
}

@keyframes vortexPulse {
  0%   { transform: scale(0.95); opacity: 0.8; }
  100% { transform: scale(1.05); opacity: 1; }
}

@keyframes conduitSpin1 {
  from { transform: rotateZ(0deg); }
  to   { transform: rotateZ(360deg); }
}

@media (prefers-reduced-motion: reduce) {
  .portal-ring-outer, .portal-core-vortex, .portal-conduit { animation: none; }
}`,
    prompt: `Create a 3D sci-fi quantum stargate portal ring in pure HTML and CSS.

Requirements:
- Circular 3D ring with rotateX(45deg) perspective tilt.
- Glowing radial gradient dimensional vortex center with blur effect.
- Spinning dashed orbital conduits and glyph nodes.
- Zero JavaScript.

Return one HTML file with a <style> block.`,
    steps: [
      "Set perspective on container and preserve-3d on the portal ring.",
      "Add radial gradient core with pulse animation.",
      "Attach dashed rotating rings around the outer perimeter.",
    ],
    tips: [
      "Pairing an outer dashed spin with a pulsating blur vortex core creates strong sci-fi depth.",
    ],
  },
  {
    slug: "3d-origami-dodecahedron",
    name: "3D Metallic Pentagonal Polyhedron",
    tone: "dark",
    tags: ["css 3d", "polyhedron", "crystal", "metallic", "scene"],
    colors: ["#020617", "#f59e0b", "#e11d48", "#ffffff"],
    description: "A rotating 3D geometric polyhedral crystal with metallic amber and crimson facets and ambient specular highlights.",
    html: `<div class="dodec-stage">
  <div class="dodec-crystal">
    <div class="dc-face df-1"></div>
    <div class="dc-face df-2"></div>
    <div class="dc-face df-3"></div>
    <div class="dc-face df-4"></div>
    <div class="dc-face df-5"></div>
  </div>
</div>`,
    css: `.dodec-stage {
  min-height: 100vh;
  background: #020617;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1000px;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #ffffff;
}

.dodec-crystal {
  position: relative;
  width: 140px;
  height: 140px;
  transform-style: preserve-3d;
  animation: crystalRoll 12s linear infinite;
}

.dc-face {
  position: absolute;
  width: 140px;
  height: 140px;
  clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.4), rgba(225, 29, 72, 0.5));
  border: 1px solid rgba(254, 240, 138, 0.5);
  box-shadow: 0 0 20px rgba(245, 158, 11, 0.3);
}

.df-1 { transform: rotateY(0deg) translateZ(80px) rotateX(25deg); }
.df-2 { transform: rotateY(72deg) translateZ(80px) rotateX(25deg); border-color: rgba(244, 63, 94, 0.6); }
.df-3 { transform: rotateY(144deg) translateZ(80px) rotateX(25deg); }
.df-4 { transform: rotateY(216deg) translateZ(80px) rotateX(25deg); border-color: rgba(244, 63, 94, 0.6); }
.df-5 { transform: rotateY(288deg) translateZ(80px) rotateX(25deg); }

@keyframes crystalRoll {
  0%   { transform: rotateX(20deg) rotateY(0deg) rotateZ(0deg); }
  50%  { transform: rotateX(-30deg) rotateY(180deg) rotateZ(20deg); }
  100% { transform: rotateX(20deg) rotateY(360deg) rotateZ(0deg); }
}

@media (prefers-reduced-motion: reduce) {
  .dodec-crystal { animation: none; transform: rotateX(25deg) rotateY(45deg); }
}`,
    prompt: `Create a rotating 3D metallic pentagonal polyhedron in pure HTML and CSS.

Requirements:
- 5-sided pentagonal CSS clip-path facets: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%).
- Rotated around Y-axis in 72-degree increments (360 / 5).
- Amber to crimson translucent gradients with glowing borders.
- Multi-axis tumble animation.
- Zero JavaScript.

Return one HTML file with a <style> block.`,
    steps: [
      "Use clip-path: polygon() to generate 5-sided regular pentagons.",
      "Arrange faces at 72deg increments around the Y-axis inside preserve-3d container.",
      "Animate multi-axis continuous tumble keyframes.",
    ],
    tips: [
      "Using 72-degree angles matches pentagonal golden ratio geometry.",
    ],
  },
  {
    slug: "3d-interactive-credit-card-swipe",
    name: "3D Biometric Credit Card Flip",
    tone: "dark",
    tags: ["css 3d", "credit-card", "fintech", "card", "scene"],
    colors: ["#0f172a", "#38bdf8", "#f59e0b", "#ffffff"],
    description: "A titanium biometric credit card that flips 180 degrees in 3D perspective space on hover, revealing magnetic stripe and CVV hologram.",
    html: `<div class="card-flip-stage">
  <div class="card-3d-wrapper">
    <div class="card-3d-inner">
      <div class="card-side card-front">
        <div class="c-top">
          <span class="c-chip">💳</span>
          <span class="c-nfc">📡</span>
        </div>
        <div class="c-number">•••• •••• •••• 8842</div>
        <div class="c-bottom">
          <div><small>CARDHOLDER</small><b>RAVINDRA NATH JHA</b></div>
          <div><small>EXPIRES</small><b>08/29</b></div>
        </div>
      </div>
      <div class="card-side card-back">
        <div class="c-mag-stripe"></div>
        <div class="c-signature-row">
          <div class="c-sig-strip">Ravindra Jha</div>
          <div class="c-cvv">892</div>
        </div>
        <div class="c-hologram">✦ TITANIUM PRIVILEGE</div>
      </div>
    </div>
  </div>
</div>`,
    css: `.card-flip-stage {
  min-height: 100vh;
  background: radial-gradient(circle at center, #1e293b 0%, #090d16 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1000px;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #ffffff;
}

.card-3d-wrapper {
  width: 380px;
  height: 230px;
  perspective: 1000px;
  cursor: pointer;
}

.card-3d-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6);
  border-radius: 20px;
}

.card-3d-wrapper:hover .card-3d-inner {
  transform: rotateY(180deg);
}

.card-side {
  position: absolute;
  inset: 0;
  border-radius: 20px;
  backface-visibility: hidden;
  border: 1px solid rgba(255, 255, 255, 0.15);
  overflow: hidden;
}

.card-front {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 60%, #020617 100%);
  padding: 28px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.c-top {
  display: flex;
  justify-content: space-between;
  font-size: 24px;
}

.c-number {
  font-size: 20px;
  font-family: ui-monospace, monospace;
  letter-spacing: 3px;
  color: #e2e8f0;
}

.c-bottom {
  display: flex;
  justify-content: space-between;
}

.c-bottom small { display: block; font-size: 9px; color: #64748b; letter-spacing: 1px; }
.c-bottom b { font-size: 13px; letter-spacing: 1.5px; }

.card-back {
  background: #0f172a;
  transform: rotateY(180deg);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 24px 0 20px;
}

.c-mag-stripe {
  height: 44px;
  background: #020617;
  width: 100%;
}

.c-signature-row {
  display: flex;
  align-items: center;
  padding: 0 24px;
  gap: 12px;
}

.c-sig-strip {
  flex: 1;
  background: #ffffff;
  color: #0f172a;
  font-family: cursive;
  font-size: 13px;
  padding: 6px 12px;
  border-radius: 4px;
}

.c-cvv {
  background: #1e293b;
  color: #ffffff;
  font-family: ui-monospace, monospace;
  font-size: 13px;
  font-weight: 700;
  padding: 6px 10px;
  border-radius: 4px;
}

.c-hologram {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 2px;
  color: #38bdf8;
  padding: 0 24px;
}`,
    prompt: `Create a 3D titanium credit card flip animation in pure HTML and CSS.

Requirements:
- Front face with metallic chip, contactless icon, card number and cardholder details.
- Back face with magnetic stripe, signature strip, and CVV code.
- Smooth rotateY(180deg) 3D flip on hover with backface-visibility: hidden.
- Zero JavaScript.

Return one HTML file with a <style> block.`,
    steps: [
      "Set perspective: 1000px on wrapper and transform-style: preserve-3d on inner card.",
      "Position front and back faces with backface-visibility: hidden.",
      "Rotate back face by 180deg and flip inner container on hover.",
    ],
    tips: [
      "Using cubic-bezier(0.2, 0.8, 0.2, 1) timing makes the flip feel smooth and weighted.",
    ],
  },
];
