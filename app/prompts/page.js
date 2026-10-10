import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PromptGallery from "@/components/library/PromptGallery";
import { INDUSTRIES, getAllPrompts } from "@/lib/prompts";

export const metadata = {
  title: "Free AI Website Prompts: Build Full Websites with Claude, ChatGPT & Cursor",
  description:
    "Copy-paste AI prompts that generate complete websites: SaaS landing pages, portfolios, restaurant sites, dashboards, e-commerce pages and more. Each prompt includes the tech stack, sections, how-to steps and follow-up prompts.",
  alternates: { canonical: "https://ravindranathjha.in/prompts" },
  openGraph: {
    title: "Free AI Website Prompts | Ravindra Nath Jha",
    description:
      "Detailed, tested prompts for building full websites with AI coding tools, with step-by-step instructions.",
    url: "https://ravindranathjha.in/prompts",
  },
};

const STEPS = [
  { title: "Choose a prompt", text: "Pick the type of website you want to build and open its page." },
  { title: "Make it yours", text: "Swap the sample business name, colours and details for your own." },
  { title: "Paste and generate", text: "Run it in Claude, ChatGPT, Cursor, v0 or any AI coding tool." },
  { title: "Refine", text: "Use the follow-up prompts on each page to add features one at a time." },
];

export default function PromptsPage() {
  const prompts = getAllPrompts();

  const items = prompts.map((prompt) => ({
    slug: prompt.slug,
    name: prompt.name,
    industry: prompt.industry,
    tone: prompt.tone,
    layout: prompt.layout,
    palette: prompt.palette,
    description: prompt.description,
    sectionCount: prompt.sections.length,
  }));

  return (
    <section className="lib-page">
      <div className="lib-wrap">
        <div className="lib-hero">
          <span className="svc-eyebrow">AI Prompt Library</span>
          <h1 className="heading">
            Build a full website <span>from one prompt</span>
          </h1>
          <p className="lib-sub">
            {prompts.length} detailed prompts for complete websites. Each one specifies the tech stack, every section,
            the visual style and the interactions, so an AI tool produces something usable the first time.
          </p>
        </div>

        <ol className="lib-flow">
          {STEPS.map((step, index) => (
            <li key={step.title}>
              <span>{index + 1}</span>
              <div>
                <strong>{step.title}</strong>
                <p>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <PromptGallery items={items} industries={INDUSTRIES} />

        <div className="lib-banner">
          <div>
            <h2>Building it by hand instead?</h2>
            <p>The Templates library has ready-made sections, backgrounds, gradients and components with full code.</p>
          </div>
          <Link href="/templates" className="lib-banner-btn">
            Browse templates <ArrowRight size={17} strokeWidth={2} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
