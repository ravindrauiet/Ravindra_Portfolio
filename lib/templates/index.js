import { gradients } from "./gradients";
import { backgrounds } from "./backgrounds";
import { sections } from "./sections";
import { components } from "./components";
import { scenes } from "./scenes";

export const CATEGORIES = [
  {
    id: "scenes",
    label: "3D Scenes",
    singular: "3D Scene",
    description: "Interactive 3D built with CSS transforms, canvas maths and Three.js (WebGL).",
  },
  {
    id: "gradients",
    label: "Gradients",
    singular: "Gradient",
    description: "Copy-paste CSS gradients: linear, radial, conic, mesh and animated.",
  },
  {
    id: "backgrounds",
    label: "Backgrounds",
    singular: "Background",
    description: "Animated and patterned full-screen backdrops in CSS and vanilla JavaScript.",
  },
  {
    id: "sections",
    label: "Sections",
    singular: "Section",
    description: "Responsive landing-page sections: hero, pricing, features, FAQ and more.",
  },
  {
    id: "components",
    label: "Components",
    singular: "Component",
    description: "Buttons, cards, loaders, form controls and other reusable UI pieces.",
  },
];

// Gradients are stored compactly; expand each into a full template with code, prompt and steps.
function expandGradient(g) {
  const kind = g.tags.includes("mesh")
    ? "mesh"
    : g.tags.includes("conic")
      ? "conic"
      : g.tags.includes("radial")
        ? "radial"
        : "linear";
  const animated = g.tags.includes("animated");

  const css = `.gradient {
  min-height: 100vh;
  background: ${g.background};${g.extraCss}
}`;

  const kindSteps = {
    linear: "Use linear-gradient(). The first value is the direction (an angle such as 135deg, or a keyword such as 'to top'); the rest are colour stops with optional positions.",
    radial: "Use radial-gradient(). The colour spreads outward from a centre point that you set with 'at X Y'; here the centre is placed outside the box so only part of the glow is visible.",
    conic: "Use conic-gradient(). Colours rotate around a centre point like a colour wheel. Repeat the first colour at the end so the seam is invisible.",
    mesh: "Layer several radial-gradient() values in one background, separated by commas. Each one is a soft coloured glow at a different corner that fades to transparent, with a solid base colour last.",
  };

  return {
    slug: g.slug,
    name: `${g.name} Gradient`,
    category: "gradients",
    tone: g.tone,
    tags: g.tags,
    colors: g.colors,
    background: g.background,
    description: `${g.note} Copy the CSS below or use the AI prompt to generate variations.`,
    html: `<div class="gradient"></div>`,
    css,
    prompt: `Create a full-screen ${animated ? "animated " : ""}${kind} CSS gradient background called "${g.name}".

Requirements:
- A single div that fills the viewport (min-height: 100vh).
- Use this exact background value:
  ${g.background}
- Colours used: ${g.colors.join(", ")}.${
      animated
        ? "\n- Set background-size to 400% 400% and animate background-position from 0% 50% to 100% 50% and back over 14 seconds (ease, infinite) so the colours appear to flow.\n- Disable the animation when the user has prefers-reduced-motion set."
        : ""
    }
- No images and no JavaScript.
- Also give me the same gradient as a Tailwind CSS arbitrary value class and as a CSS custom property (--gradient-${g.slug.replace(/-gradient$/, "")}) I can reuse.

Return one HTML file with the CSS in a <style> tag.`,
    steps: [
      "Create an element to hold the gradient and give it a size. A gradient is a background image, so an element with no height shows nothing.",
      kindSteps[kind],
      `Add the colour stops: ${g.colors.join(" → ")}. Where no position is given, the browser spaces the stops evenly.`,
      ...(animated
        ? [
            "Make the background larger than the element with background-size: 400% 400%, so only part of the gradient is visible at once.",
            "Animate background-position between the two ends. Moving a large gradient is how you get a flowing effect, because gradients themselves cannot be transitioned.",
          ]
        : []),
      "Check text contrast. Place your real heading on top and make sure it stays readable across the whole gradient, not just in one corner.",
    ],
    tips: [
      "Store the gradient in a CSS custom property so every section uses the same value.",
      g.tone === "dark"
        ? "Use white or very light text on this gradient."
        : "Use dark navy or near-black text on this gradient.",
      "Add a subtle noise texture on top (see the Film Grain background) to remove visible colour banding on large screens.",
    ],
  };
}

const withCategory = (items, category) => items.map((item) => ({ ...item, category }));

export const templates = [
  ...withCategory(scenes, "scenes"),
  ...gradients.map(expandGradient),
  ...withCategory(backgrounds, "backgrounds"),
  ...withCategory(sections, "sections"),
  ...withCategory(components, "components"),
];

export function getAllTemplates() {
  return templates;
}

export function getTemplate(slug) {
  return templates.find((t) => t.slug === slug);
}

export function getCategory(id) {
  return CATEGORIES.find((c) => c.id === id);
}

export function getRelatedTemplates(template, limit = 3) {
  return templates
    .filter((t) => t.category === template.category && t.slug !== template.slug)
    .map((t) => ({ t, shared: t.tags.filter((tag) => template.tags.includes(tag)).length }))
    .sort((a, b) => b.shared - a.shared)
    .slice(0, limit)
    .map(({ t }) => t);
}

// A complete, standalone HTML document for a template: used for the live preview iframe
// and offered as the "full file" to copy.
export function buildDocument(template) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${template.name}</title>
<style>
*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; }

${template.css}
</style>
</head>
<body>
${template.html}
${template.js ? `<script${template.module ? ' type="module"' : ""}>\n${template.js}\n</script>\n` : ""}</body>
</html>`;
}
