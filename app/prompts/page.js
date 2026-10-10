import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, ChevronDown, MousePointerClick, PencilLine, Rocket, Sparkles } from "lucide-react";
import CopyButton from "@/components/library/CopyButton";
import PromptGallery from "@/components/library/PromptGallery";
import { INDUSTRIES, getAllPrompts, getPrompt } from "@/lib/prompts";

const SITE = "https://ravindranathjha.in";

export const metadata = {
  title: "Free AI Website Prompts: Build Full Websites with Claude, ChatGPT & Cursor",
  description:
    "Copy-paste AI prompts that generate complete websites: SaaS landing pages, portfolios, restaurant sites, dashboards, e-commerce pages and more. Each prompt includes the tech stack, sections, how-to steps and follow-up prompts.",
  alternates: { canonical: `${SITE}/prompts` },
  openGraph: {
    title: "Free AI Website Prompts | Ravindra Nath Jha",
    description:
      "Detailed, tested prompts for building full websites with AI coding tools, with step-by-step instructions.",
    url: `${SITE}/prompts`,
    images: [{ url: `${SITE}/assets/images/prompts/saas-landing-page-prompt.png`, width: 1280, height: 800 }],
  },
};

const AI_TOOLS = ["Claude", "ChatGPT", "Cursor", "v0", "Bolt", "Gemini"];
const FEATURED_SLUG = "ai-startup-landing-page-prompt";

const STEPS = [
  { icon: MousePointerClick, title: "Choose a prompt", text: "Pick the kind of website you want and open its page." },
  { icon: PencilLine, title: "Make it yours", text: "Swap the sample business name, colours and details for your own." },
  { icon: Sparkles, title: "Paste and generate", text: "Run it in Claude, ChatGPT, Cursor, v0 or any AI coding tool." },
  { icon: Rocket, title: "Refine and publish", text: "Add features with the follow-up prompts, then deploy for free." },
];

const FAQS = [
  {
    q: "Are these website prompts free to use?",
    a: "Yes. Every prompt is free to copy and use for personal projects and client work. There is no sign-up and nothing to download.",
  },
  {
    q: "Which AI tools do the prompts work with?",
    a: "They work with Claude, ChatGPT, Gemini, Cursor, v0 and Bolt. Tools that can create files, such as Cursor, Claude Code, v0 and Bolt, are the most convenient because they write the whole project for you.",
  },
  {
    q: "Do I need to know how to code?",
    a: "No coding is needed to generate the website. Basic knowledge helps when you run and publish it, and every prompt page has step-by-step instructions for that part.",
  },
  {
    q: "Will my website look exactly like the preview image?",
    a: "The previews are examples of what each prompt describes. Results vary a little between AI tools, so use the follow-up prompts on each page to adjust the design until it matches what you want.",
  },
  {
    q: "Can I change the tech stack or the colours?",
    a: "Yes. Each prompt has a clear tech stack line and a visual style line with colour codes. Edit those lines before you paste the prompt and the AI will follow your choices.",
  },
];

// Prevents "</script>" inside content from breaking out of the JSON-LD tag
const jsonLd = (data) => JSON.stringify(data).replace(/</g, "\\u003c");

function Shot({ slug, name, className = "", preload = false }) {
  return (
    <div className={`pl-win ${className}`}>
      <div className="pl-win-bar" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <Image
        src={`/assets/images/prompts/${slug}.png`}
        alt={`${name} generated from an AI prompt`}
        width={1280}
        height={800}
        sizes="(max-width: 900px) 70vw, 34vw"
        preload={preload}
      />
    </div>
  );
}

export default function PromptsPage() {
  const prompts = getAllPrompts();
  const featured = getPrompt(FEATURED_SLUG) ?? prompts[0];
  const totalSections = prompts.reduce((sum, prompt) => sum + prompt.sections.length, 0);

  const items = prompts.map((prompt) => ({
    slug: prompt.slug,
    name: prompt.name,
    industry: prompt.industry,
    tone: prompt.tone,
    palette: prompt.palette,
    stack: prompt.stack.startsWith("Next.js") ? "Next.js + Tailwind" : "HTML + CSS",
    description: prompt.description,
    sectionCount: prompt.sections.length,
    prompt: prompt.prompt,
  }));

  const stats = [
    { value: prompts.length, label: "Website prompts" },
    { value: totalSections, label: "Sections specified" },
    { value: AI_TOOLS.length, label: "AI tools supported" },
    { value: "Free", label: "No sign-up" },
  ];

  const listSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Free AI website prompts",
    itemListElement: prompts.map((prompt, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `${prompt.name} AI prompt`,
      url: `${SITE}/prompts/${prompt.slug}`,
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
              AI Prompt Library · {prompts.length} free prompts
            </span>
            <h1>
              Build a full website <span>from one prompt</span>
            </h1>
            <p className="pl-lead">
              Detailed prompts for complete websites. Each one sets the tech stack, every section, the visual style and
              the interactions, so your AI tool produces something usable the first time.
            </p>
            <div className="pl-actions">
              <a href="#prompt-gallery" className="pl-btn pl-btn-primary">
                Browse prompts <ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" />
              </a>
              <a href="#how-it-works" className="pl-btn pl-btn-ghost">
                How it works
              </a>
            </div>
            <div className="pl-tools">
              <span>Works with</span>
              <ul>
                {AI_TOOLS.map((tool) => (
                  <li key={tool}>{tool}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pl-stage">
            <div className="pl-stage-inner">
              <Shot slug="developer-portfolio-prompt" name="Developer portfolio website" className="pl-win-b" />
              <Shot slug="travel-agency-website-prompt" name="Travel agency website" className="pl-win-c" />
              <Shot slug="saas-landing-page-prompt" name="SaaS landing page" className="pl-win-a" preload />
              <div className="pl-float pl-float-copied" aria-hidden="true">
                <span>
                  <Check size={14} strokeWidth={3} />
                </span>
                Prompt copied
              </div>
              <div className="pl-float pl-float-prompt" aria-hidden="true">
                <small>Your prompt</small>
                <p>
                  Build a landing page for a project tool called &quot;Flowboard&quot;<i />
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
              From idea to live website <span>in four steps</span>
            </h2>
          </div>
          <ol className="pl-steps">
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

        {/* Featured prompt */}
        <div className="pl-section">
          <div className="pl-feature">
            <div className="pl-feature-shot">
              <Shot slug={featured.slug} name={featured.name} />
            </div>
            <div className="pl-feature-body">
              <span className="svc-eyebrow">Featured prompt</span>
              <h2>{featured.name}</h2>
              <p>{featured.description}</p>
              <div className="pl-term">
                <div className="pl-term-bar">
                  <span>prompt.txt</span>
                  <CopyButton text={featured.prompt} label="Copy" className="lib-copy-dark" />
                </div>
                <pre>{featured.prompt.slice(0, 520)}</pre>
              </div>
              <div className="pl-feature-foot">
                <ul>
                  <li>{featured.stack}</li>
                  <li>{featured.sections.length} sections</li>
                </ul>
                <Link href={`/prompts/${featured.slug}`} className="pl-btn pl-btn-primary">
                  Open full prompt <ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="pl-section" id="prompt-gallery">
          <div className="pl-head">
            <span className="svc-eyebrow">The library</span>
            <h2>
              Pick a website <span>to build</span>
            </h2>
            <p>Every card shows the site that prompt creates. Copy it straight from the card, or open it for the steps.</p>
          </div>
          <PromptGallery items={items} industries={INDUSTRIES} />
        </div>

        {/* FAQ */}
        <div className="pl-section">
          <div className="pl-head">
            <span className="svc-eyebrow">Questions</span>
            <h2>
              Good to know <span>before you start</span>
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
            <h2>Building it by hand instead?</h2>
            <p>The Templates library has ready-made sections, backgrounds, gradients and 3D scenes with full code.</p>
          </div>
          <Link href="/templates" className="lib-banner-btn">
            Browse templates <ArrowRight size={17} strokeWidth={2} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
