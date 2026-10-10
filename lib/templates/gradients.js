// Gradient library. Each entry is compact; index.js expands it into a full template
// (HTML, CSS, AI prompt and build steps) so every gradient gets its own page.

const g = (slug, name, tone, background, colors, tags, note, extraCss = "") => ({
  slug,
  name,
  tone,
  background,
  colors,
  tags,
  note,
  extraCss,
});

export const gradients = [
  g(
    "indigo-sunset-gradient",
    "Indigo Sunset",
    "dark",
    "linear-gradient(135deg, #002057 0%, #2506ad 55%, #ff7b00 100%)",
    ["#002057", "#2506ad", "#ff7b00"],
    ["linear", "brand", "hero"],
    "A deep navy-to-indigo sweep that ends in a warm orange glow. Strong enough for a hero section with white text."
  ),
  g(
    "aurora-mesh-gradient",
    "Aurora Mesh",
    "dark",
    "radial-gradient(at 20% 20%, #5b21b6 0px, transparent 50%), radial-gradient(at 80% 10%, #0ea5e9 0px, transparent 50%), radial-gradient(at 70% 80%, #10b981 0px, transparent 50%), radial-gradient(at 10% 90%, #1d4ed8 0px, transparent 50%), #020617",
    ["#5b21b6", "#0ea5e9", "#10b981", "#020617"],
    ["mesh", "radial", "ai", "saas"],
    "Four soft radial glows layered over near-black create the mesh-gradient look used on AI and SaaS landing pages."
  ),
  g(
    "peach-cream-gradient",
    "Peach Cream",
    "light",
    "linear-gradient(120deg, #fff1eb 0%, #ffd8c2 45%, #ffb199 100%)",
    ["#fff1eb", "#ffd8c2", "#ffb199"],
    ["linear", "soft", "pastel"],
    "A warm pastel blend for friendly, approachable brands. Pair it with dark navy text."
  ),
  g(
    "ocean-depth-gradient",
    "Ocean Depth",
    "dark",
    "linear-gradient(180deg, #0f172a 0%, #0c4a6e 50%, #0891b2 100%)",
    ["#0f172a", "#0c4a6e", "#0891b2"],
    ["linear", "vertical", "blue"],
    "A top-to-bottom dive from midnight navy into teal. Works well behind dashboards and data products."
  ),
  g(
    "mint-sky-gradient",
    "Mint Sky",
    "light",
    "linear-gradient(135deg, #d9f99d 0%, #a7f3d0 45%, #bae6fd 100%)",
    ["#d9f99d", "#a7f3d0", "#bae6fd"],
    ["linear", "fresh", "pastel", "health"],
    "Lime into mint into sky blue. A fresh, clean feel for health, wellness and productivity products."
  ),
  g(
    "royal-conic-gradient",
    "Royal Conic",
    "dark",
    "conic-gradient(from 210deg at 50% 50%, #002057, #2506ad, #7c3aed, #ff7b00, #002057)",
    ["#002057", "#2506ad", "#7c3aed", "#ff7b00"],
    ["conic", "bold", "brand"],
    "A conic gradient rotates colour around a centre point instead of along a line, giving a spotlight-wheel effect."
  ),
  g(
    "soft-lavender-gradient",
    "Soft Lavender",
    "light",
    "linear-gradient(160deg, #faf5ff 0%, #e9d5ff 50%, #c4b5fd 100%)",
    ["#faf5ff", "#e9d5ff", "#c4b5fd"],
    ["linear", "soft", "purple"],
    "A gentle purple wash for calm, premium interfaces. Subtle enough to sit behind long-form content."
  ),
  g(
    "ember-glow-gradient",
    "Ember Glow",
    "dark",
    "radial-gradient(circle at 50% 110%, #ff7b00 0%, #b91c1c 30%, #1c1917 70%)",
    ["#ff7b00", "#b91c1c", "#1c1917"],
    ["radial", "warm", "dramatic"],
    "A radial glow rising from below the fold, like light from embers. Great behind a centred headline."
  ),
  g(
    "glacier-gradient",
    "Glacier",
    "light",
    "linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #c7d2fe 100%)",
    ["#f8fafc", "#e0f2fe", "#c7d2fe"],
    ["linear", "cool", "minimal", "saas"],
    "An almost-white icy blend. Use it when you want a background that feels designed but stays out of the way."
  ),
  g(
    "midnight-violet-gradient",
    "Midnight Violet",
    "dark",
    "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
    ["#0f0c29", "#302b63", "#24243e"],
    ["linear", "dark", "elegant"],
    "A low-contrast dark gradient. It adds depth to dark-mode pages without drawing attention to itself."
  ),
  g(
    "sunrise-gradient",
    "Sunrise",
    "light",
    "linear-gradient(to top, #fde68a 0%, #fca5a5 50%, #c4b5fd 100%)",
    ["#fde68a", "#fca5a5", "#c4b5fd"],
    ["linear", "vertical", "warm"],
    "Yellow at the horizon rising through coral into violet, like an early morning sky."
  ),
  g(
    "emerald-night-gradient",
    "Emerald Night",
    "dark",
    "linear-gradient(135deg, #022c22 0%, #065f46 55%, #34d399 100%)",
    ["#022c22", "#065f46", "#34d399"],
    ["linear", "green", "fintech"],
    "Deep forest green brightening to emerald. A natural fit for fintech, sustainability and growth themes."
  ),
  g(
    "candy-pop-gradient",
    "Candy Pop",
    "light",
    "linear-gradient(90deg, #f9a8d4 0%, #fcd34d 50%, #67e8f9 100%)",
    ["#f9a8d4", "#fcd34d", "#67e8f9"],
    ["linear", "playful", "bright"],
    "A bright horizontal blend of pink, yellow and cyan for playful products and creative portfolios."
  ),
  g(
    "animated-flow-gradient",
    "Animated Flow",
    "dark",
    "linear-gradient(120deg, #002057, #2506ad, #7c3aed, #ff7b00, #2506ad, #002057)",
    ["#002057", "#2506ad", "#7c3aed", "#ff7b00"],
    ["animated", "linear", "hero"],
    "The gradient is drawn four times wider than the screen and slowly slides sideways, so the colours appear to flow.",
    "\n  background-size: 400% 400%;\n  animation: flow 14s ease infinite;\n}\n\n@keyframes flow {\n  0% { background-position: 0% 50%; }\n  50% { background-position: 100% 50%; }\n  100% { background-position: 0% 50%; }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .gradient { animation: none; }"
  ),
  g(
    "steel-mono-gradient",
    "Steel Mono",
    "dark",
    "linear-gradient(145deg, #111827 0%, #374151 50%, #1f2937 100%)",
    ["#111827", "#374151", "#1f2937"],
    ["linear", "neutral", "minimal"],
    "A neutral grey gradient with a soft highlight through the middle. Reads as brushed metal behind product shots."
  ),
  g(
    "coral-reef-gradient",
    "Coral Reef",
    "light",
    "radial-gradient(at 0% 0%, #fecdd3 0px, transparent 55%), radial-gradient(at 100% 0%, #bfdbfe 0px, transparent 55%), radial-gradient(at 50% 100%, #fde68a 0px, transparent 55%), #ffffff",
    ["#fecdd3", "#bfdbfe", "#fde68a", "#ffffff"],
    ["mesh", "radial", "pastel"],
    "A light mesh gradient: three pastel glows in the corners fading into white."
  ),
];
