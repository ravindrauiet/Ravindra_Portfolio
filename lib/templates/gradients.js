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
  g(
    "cyberpunk-neon-gradient",
    "Cyberpunk Neon",
    "dark",
    "linear-gradient(135deg, #0f051d 0%, #3b0764 40%, #c026d3 75%, #06b6d4 100%)",
    ["#0f051d", "#3b0764", "#c026d3", "#06b6d4"],
    ["linear", "neon", "cyberpunk", "bold"],
    "An electric blend from deep obsidian violet to intense magenta and cyan, designed for high-energy tech interfaces."
  ),
  g(
    "cosmic-nebula-gradient",
    "Cosmic Nebula",
    "dark",
    "radial-gradient(at 15% 25%, #6366f1 0px, transparent 55%), radial-gradient(at 85% 15%, #ec4899 0px, transparent 50%), radial-gradient(at 75% 85%, #f59e0b 0px, transparent 50%), radial-gradient(at 20% 80%, #06b6d4 0px, transparent 50%), #05060f",
    ["#6366f1", "#ec4899", "#f59e0b", "#06b6d4", "#05060f"],
    ["mesh", "radial", "cosmic", "ai"],
    "Four vivid starlight glows over deep void black, delivering an interstellar nebula look for generative AI heroes."
  ),
  g(
    "nordic-frost-gradient",
    "Nordic Frost",
    "light",
    "linear-gradient(150deg, #f0fdf4 0%, #e0f2fe 45%, #e0e7ff 100%)",
    ["#f0fdf4", "#e0f2fe", "#e0e7ff"],
    ["linear", "minimal", "light", "saas"],
    "An ethereal cool-mint to ice-blue gradient. Clean, calm and subtle enough to sit behind dense typography."
  ),
  g(
    "solar-flare-gradient",
    "Solar Flare",
    "dark",
    "linear-gradient(125deg, #180500 0%, #831843 40%, #ea580c 75%, #facc15 100%)",
    ["#180500", "#831843", "#ea580c", "#facc15"],
    ["linear", "warm", "bold", "hero"],
    "A rich sunrise fusion from burnt charcoal through crimson into brilliant amber gold."
  ),
  g(
    "animated-emerald-gradient",
    "Animated Emerald Mesh",
    "dark",
    "linear-gradient(135deg, #022c22, #047857, #10b981, #064e3b, #022c22)",
    ["#022c22", "#047857", "#10b981", "#064e3b"],
    ["animated", "green", "fintech", "hero"],
    "A deep fluid emerald mesh gradient that shifts position smoothly over time, creating a liquid silk appearance.",
    "\n  background-size: 300% 300%;\n  animation: emeraldShift 12s ease infinite;\n}\n\n@keyframes emeraldShift {\n  0% { background-position: 0% 50%; }\n  50% { background-position: 100% 50%; }\n  100% { background-position: 0% 50%; }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .gradient { animation: none; }"
  ),
  g(
    "sunset-vaporwave-gradient",
    "Sunset Vaporwave",
    "dark",
    "linear-gradient(135deg, #180928 0%, #581c87 35%, #db2777 70%, #f59e0b 100%)",
    ["#180928", "#581c87", "#db2777", "#f59e0b"],
    ["linear", "vaporwave", "sunset", "bold"],
    "A rich synthwave sunset flowing from deep midnight plum through vibrant magenta into neon amber."
  ),
  g(
    "frosted-mint-gradient",
    "Frosted Mint",
    "light",
    "linear-gradient(135deg, #f0fdf4 0%, #d1fae5 45%, #ecfdf5 75%, #ffffff 100%)",
    ["#f0fdf4", "#d1fae5", "#ecfdf5", "#ffffff"],
    ["linear", "light", "mint", "clean", "minimal"],
    "An ultra-clean, serene frosted mint and eucalyptus gradient for wellness, health, and modern calm SaaS."
  ),
  g(
    "animated-aurora-mesh-gradient",
    "Animated Aurora Mesh",
    "dark",
    "linear-gradient(125deg, #0f172a, #0369a1, #0d9488, #4f46e5, #0f172a)",
    ["#0f172a", "#0369a1", "#0d9488", "#4f46e5"],
    ["animated", "mesh", "aurora", "hero"],
    "A dynamic liquid aurora mesh that flows continuously across deep ocean blue, teal, and indigo.",
    "\n  background-size: 300% 300%;\n  animation: auroraMeshShift 15s ease infinite;\n}\n\n@keyframes auroraMeshShift {\n  0% { background-position: 0% 50%; }\n  50% { background-position: 100% 50%; }\n  100% { background-position: 0% 50%; }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .gradient { animation: none; }"
  ),
  g(
    "deep-amethyst-velvet",
    "Deep Amethyst Velvet",
    "dark",
    "linear-gradient(135deg, #0a0518 0%, #2e0854 40%, #6b21a8 75%, #a855f7 100%)",
    ["#0a0518", "#2e0854", "#6b21a8", "#a855f7"],
    ["linear", "purple", "luxury", "bold"],
    "A deep regal amethyst gradient transitioning from obsidian plum through royal purple into luminous violet."
  ),
  g(
    "sunset-peach-blush",
    "Sunset Peach Blush",
    "light",
    "linear-gradient(140deg, #fff1f2 0%, #ffe4e6 35%, #fed7aa 70%, #ffffff 100%)",
    ["#fff1f2", "#ffe4e6", "#fed7aa", "#ffffff"],
    ["linear", "light", "warm", "pastel", "minimal"],
    "A warm, inviting pastel gradient blending delicate petal rose into sunlit golden peach and cream."
  ),
  g(
    "animated-oceanic-abyss",
    "Animated Oceanic Abyss",
    "dark",
    "linear-gradient(135deg, #030712, #0c4a6e, #0284c7, #0369a1, #030712)",
    ["#030712", "#0c4a6e", "#0284c7", "#0369a1"],
    ["animated", "ocean", "deep", "hero"],
    "An animated deep-ocean trench gradient drifting smoothly between midnight black and sapphire abyss.",
    "\n  background-size: 300% 300%;\n  animation: oceanicShift 14s ease infinite;\n}\n\n@keyframes oceanicShift {\n  0% { background-position: 0% 50%; }\n  50% { background-position: 100% 50%; }\n  100% { background-position: 0% 50%; }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .gradient { animation: none; }"
  ),
  g(
    "aurora-borealis-spectral",
    "Aurora Borealis Spectral",
    "dark",
    "linear-gradient(135deg, #020b14 0%, #064e3b 35%, #0891b2 70%, #7c3aed 100%)",
    ["#020b14", "#064e3b", "#0891b2", "#7c3aed"],
    ["linear", "aurora", "green", "cyan", "bold"],
    "A radiant polar sky gradient shifting from pitch black through emerald pine and electric cyan into celestial violet."
  ),
  g(
    "cyber-infrared-thermal",
    "Cyber Infrared Thermal",
    "dark",
    "linear-gradient(135deg, #050508 0%, #3b0764 30%, #be123c 60%, #eab308 100%)",
    ["#050508", "#3b0764", "#be123c", "#eab308"],
    ["linear", "infrared", "thermal", "bold", "hero"],
    "A thermal imaging-inspired spectrum blending dark indigo through crimson into radiant solar yellow."
  ),
  g(
    "animated-hyperdrive-mesh",
    "Animated Hyperdrive Mesh",
    "dark",
    "linear-gradient(125deg, #020617, #1e1b4b, #2563eb, #db2777, #020617)",
    ["#020617", "#1e1b4b", "#2563eb", "#db2777"],
    ["animated", "hyperdrive", "mesh", "hero"],
    "A vibrant liquid hyperdrive mesh gradient that cycles rapidly across midnight indigo, cobalt, and hot pink.",
    "\n  background-size: 300% 300%;\n  animation: hyperdriveShift 12s ease infinite;\n}\n\n@keyframes hyperdriveShift {\n  0% { background-position: 0% 50%; }\n  50% { background-position: 100% 50%; }\n  100% { background-position: 0% 50%; }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .gradient { animation: none; }"
  ),
];
