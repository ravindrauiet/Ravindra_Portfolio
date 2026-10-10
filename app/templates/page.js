import Link from "next/link";
import { ArrowRight, Code2, Copy, Sparkles } from "lucide-react";
import TemplateGallery from "@/components/library/TemplateGallery";
import { CATEGORIES, buildDocument, getAllTemplates, getCategory } from "@/lib/templates";

export const metadata = {
  title: "Free UI Templates: Gradients, Backgrounds, Sections & Components",
  description:
    "A free library of copy-paste UI templates with live previews: CSS gradients, animated backgrounds, landing-page sections and components. Every template includes the full code and the AI prompt to build it.",
  alternates: { canonical: "https://ravindranathjha.in/templates" },
  openGraph: {
    title: "Free UI Templates with Code & AI Prompts | Ravindra Nath Jha",
    description:
      "Gradients, backgrounds, sections and components with live previews, full source code and the AI prompt to recreate each one.",
    url: "https://ravindranathjha.in/templates",
  },
};

const HOW_IT_WORKS = [
  {
    Icon: Sparkles,
    title: "Pick a template",
    text: "Browse by type, filter by light or dark, and open any template to see it running live.",
  },
  {
    Icon: Copy,
    title: "Copy the code",
    text: "Every template is plain HTML and CSS you can paste into any project, with a one-click copy button.",
  },
  {
    Icon: Code2,
    title: "Or use the prompt",
    text: "Paste the included prompt into Claude, ChatGPT, Cursor or v0 to rebuild it in your own stack and style.",
  },
];

export default function TemplatesPage() {
  const templates = getAllTemplates();

  // Only send what the gallery needs to the browser
  const items = templates.map((template) => ({
    slug: template.slug,
    name: template.name,
    category: template.category,
    categoryLabel: getCategory(template.category).singular,
    tone: template.tone,
    tags: template.tags,
    background: template.category === "gradients" ? template.background : null,
    doc: template.category === "gradients" ? null : buildDocument(template),
  }));

  return (
    <section className="lib-page">
      <div className="lib-wrap">
        <div className="lib-hero">
          <span className="svc-eyebrow">Free UI Library</span>
          <h1 className="heading">
            Templates you can <span>copy, paste and learn from</span>
          </h1>
          <p className="lib-sub">
            {templates.length} gradients, backgrounds, sections and components. Each one has a live preview, the
            complete code, the AI prompt that builds it and a step-by-step explanation of how it works.
          </p>
          <ul className="lib-hero-stats">
            {CATEGORIES.map((category) => (
              <li key={category.id}>
                <strong>{templates.filter((t) => t.category === category.id).length}</strong>
                <span>{category.label}</span>
              </li>
            ))}
            <li>
              <strong>100%</strong>
              <span>Free</span>
            </li>
          </ul>
        </div>

        <TemplateGallery items={items} categories={CATEGORIES} />

        <div className="lib-how">
          <h2>How it works</h2>
          <div className="lib-how-grid">
            {HOW_IT_WORKS.map(({ Icon, title, text }, index) => (
              <div key={title} className="lib-how-card">
                <span className="lib-how-icon">
                  <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
                </span>
                <h3>
                  {index + 1}. {title}
                </h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lib-banner">
          <div>
            <h2>Need a whole website, not just a section?</h2>
            <p>The Prompts library has complete, tested prompts for full pages: SaaS, portfolio, restaurant, dashboard and more.</p>
          </div>
          <Link href="/prompts" className="lib-banner-btn">
            Browse website prompts <ArrowRight size={17} strokeWidth={2} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
