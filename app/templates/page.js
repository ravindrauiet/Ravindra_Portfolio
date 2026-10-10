import Link from "next/link";
import { ArrowRight, Check, ChevronDown, Code2, Copy, Sparkles, Wand2 } from "lucide-react";
import CopyButton from "@/components/library/CopyButton";
import TemplateGallery from "@/components/library/TemplateGallery";
import { CATEGORIES, buildDocument, getAllTemplates, getCategory, getTemplate } from "@/lib/templates";

const SITE = "https://ravindranathjha.in";

export const metadata = {
  title: "Free UI Templates: 3D Scenes, Gradients, Backgrounds, Sections & Components",
  description:
    "A free library of copy-paste UI templates with live previews: interactive 3D scenes (CSS 3D, canvas and Three.js), CSS gradients, animated backgrounds, landing-page sections and components. Every template includes the full code and the AI prompt to build it.",
  alternates: { canonical: `${SITE}/templates` },
  openGraph: {
    title: "Free UI Templates with Code & AI Prompts | Ravindra Nath Jha",
    description:
      "3D scenes, gradients, backgrounds, sections and components with live previews, full source code and the AI prompt to recreate each one.",
    url: `${SITE}/templates`,
  },
};

const BUILT_WITH = ["HTML", "CSS", "JavaScript", "Canvas", "Three.js"];
const FEATURED_SLUG = "3d-carousel-ring";

// Live templates shown in the hero's 3D stack
const HERO_WINDOWS = [
  { slug: "rotating-3d-cube", className: "pl-win-b" },
  { slug: "aurora-blobs-background", className: "pl-win-c" },
  { slug: "saas-hero-section", className: "pl-win-a" },
];

const STEPS = [
  {
    icon: Sparkles,
    title: "Pick a template",
    text: "Browse by type, filter by light or dark, and open any template to see it running live.",
  },
  {
    icon: Copy,
    title: "Copy the code",
    text: "Every template is plain HTML, CSS and JavaScript you can paste into any project in one click.",
  },
  {
    icon: Wand2,
    title: "Or use the prompt",
    text: "Paste the included prompt into Claude, ChatGPT, Cursor or v0 to rebuild it in your own stack and style.",
  },
];

const FAQS = [
  {
    q: "Are these UI templates free?",
    a: "Yes. Every template is free to copy and use in personal projects and client work. There is no sign-up and nothing to install.",
  },
  {
    q: "Do I need React or another framework?",
    a: "No. Each template is plain HTML, CSS and JavaScript, so it works anywhere. To use one inside React, Next.js or Vue, paste the included AI prompt into your coding tool and ask for a component in that framework.",
  },
  {
    q: "How are the 3D scenes built?",
    a: "Three ways: CSS 3D transforms with perspective, 3D maths drawn on a canvas, and WebGL with Three.js loaded from a CDN. None of them needs a build step, and each page explains how the effect works.",
  },
  {
    q: "What is the AI prompt on each template for?",
    a: "It describes the template in enough detail for an AI tool to rebuild it. Use it when you want the same idea in a different style, colour palette or tech stack.",
  },
  {
    q: "Will the templates work on phones?",
    a: "Sections and components are responsive. Each template page has desktop, tablet and phone preview sizes so you can check before you copy.",
  },
];

// Prevents "</script>" inside content from breaking out of the JSON-LD tag
const jsonLd = (data) => JSON.stringify(data).replace(/</g, "\\u003c");

function LiveWindow({ template, className = "" }) {
  return (
    <div className={`pl-win ${className}`}>
      <div className="pl-win-bar" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <div className={`lib-thumb lib-thumb-${template.category} pl-live`}>
        <iframe
          title={`${template.name} live preview`}
          srcDoc={buildDocument(template)}
          sandbox="allow-scripts"
          tabIndex={-1}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

export default function TemplatesPage() {
  const templates = getAllTemplates();
  const featured = getTemplate(FEATURED_SLUG) ?? templates[0];
  const countOf = (id) => templates.filter((template) => template.category === id).length;

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

  const stats = [
    { value: templates.length, label: "Free templates" },
    { value: countOf("scenes"), label: "Interactive 3D scenes" },
    { value: CATEGORIES.length, label: "Categories" },
    { value: "Free", label: "No sign-up" },
  ];

  const listSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Free UI templates",
    itemListElement: templates.map((template, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: template.name,
      url: `${SITE}/templates/${template.slug}`,
    })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <section className="lib-page pl-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(listSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema) }} />

      <div className="pl-glow" aria-hidden="true" />

      <div className="lib-wrap">
        {/* Hero */}
        <div className="pl-hero">
          <div className="pl-hero-text">
            <span className="pl-badge">
              <Sparkles size={15} strokeWidth={2.2} aria-hidden="true" />
              Free UI Library · {templates.length} templates
            </span>
            <h1>
              Templates you can <span>copy, paste and learn from</span>
            </h1>
            <p className="pl-lead">
              3D scenes, gradients, backgrounds, sections and components. Each one has a live preview, the complete
              code, the AI prompt that builds it and a step-by-step explanation.
            </p>
            <div className="pl-actions">
              <a href="#template-gallery" className="pl-btn pl-btn-primary">
                Browse templates <ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" />
              </a>
              <a href="#how-it-works" className="pl-btn pl-btn-ghost">
                How it works
              </a>
            </div>
            <div className="pl-tools">
              <span>Built with</span>
              <ul>
                {BUILT_WITH.map((tool) => (
                  <li key={tool}>{tool}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pl-stage">
            <div className="pl-stage-inner">
              {HERO_WINDOWS.map(({ slug, className }) => {
                const template = getTemplate(slug);
                return template ? <LiveWindow key={slug} template={template} className={className} /> : null;
              })}
              <div className="pl-float pl-float-copied" aria-hidden="true">
                <span>
                  <Check size={14} strokeWidth={3} />
                </span>
                Code copied
              </div>
              <div className="pl-float pl-float-prompt" aria-hidden="true">
                <small>style.css</small>
                <p>
                  transform: rotateY(24deg) translateZ(80px);<i />
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <ul className="pl-stats">
          {stats.map((stat) => (
            <li key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </li>
          ))}
        </ul>

        {/* How it works */}
        <div className="pl-section" id="how-it-works">
          <div className="pl-head">
            <span className="svc-eyebrow">How it works</span>
            <h2>
              See it, copy it, <span>make it yours</span>
            </h2>
          </div>
          <ol className="pl-steps pl-steps-3">
            {STEPS.map((step, index) => (
              <li key={step.title} className="pl-step">
                <span className="pl-step-no" aria-hidden="true">
                  0{index + 1}
                </span>
                <span className="pl-step-icon">
                  <step.icon size={22} strokeWidth={1.9} aria-hidden="true" />
                </span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Featured template */}
        <div className="pl-section">
          <div className="pl-feature">
            <div className="pl-feature-shot">
              <LiveWindow template={featured} />
            </div>
            <div className="pl-feature-body">
              <span className="svc-eyebrow">Featured 3D scene</span>
              <h2>{featured.name}</h2>
              <p>{featured.description}</p>
              <div className="pl-term">
                <div className="pl-term-bar">
                  <span>style.css</span>
                  <CopyButton text={buildDocument(featured)} label="Copy full file" className="lib-copy-dark" />
                </div>
                <pre>{featured.css.slice(0, 520)}</pre>
              </div>
              <div className="pl-feature-foot">
                <ul>
                  <li>
                    <Code2 size={14} strokeWidth={2} aria-hidden="true" /> Pure CSS 3D
                  </li>
                  <li>Live preview</li>
                </ul>
                <Link href={`/templates/${featured.slug}`} className="pl-btn pl-btn-primary">
                  Open template <ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="pl-section" id="template-gallery">
          <div className="pl-head">
            <span className="svc-eyebrow">The library</span>
            <h2>
              Find a template <span>to use today</span>
            </h2>
            <p>Every preview below is running live. Pick a type, then open any card for the code and the prompt.</p>
          </div>
          <TemplateGallery items={items} categories={CATEGORIES} />
        </div>

        {/* FAQ */}
        <div className="pl-section">
          <div className="pl-head">
            <span className="svc-eyebrow">Questions</span>
            <h2>
              Good to know <span>before you copy</span>
            </h2>
          </div>
          <div className="pl-faq">
            {FAQS.map((item, index) => (
              <details key={item.q} open={index === 0}>
                <summary>
                  {item.q}
                  <ChevronDown size={20} strokeWidth={2} aria-hidden="true" />
                </summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>

        <div className="lib-banner pl-banner">
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
