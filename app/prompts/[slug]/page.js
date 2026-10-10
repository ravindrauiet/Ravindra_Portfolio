import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import CopyButton from "@/components/library/CopyButton";
import PromptPreview from "@/components/library/PromptPreview";
import { getAllPrompts, getPrompt, getRelatedPrompts } from "@/lib/prompts";

const SITE = "https://ravindranathjha.in";
const AI_TOOLS = ["Claude", "ChatGPT", "Cursor", "v0", "Bolt", "Gemini"];

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPrompts().map((prompt) => ({ slug: prompt.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const prompt = getPrompt(slug);
  if (!prompt) return {};

  const title = `${prompt.name} AI Prompt — Build It with Claude, ChatGPT or Cursor`;
  const description = `${prompt.description} Free copy-paste AI prompt with tech stack, ${prompt.sections.length} sections, step-by-step instructions and follow-up prompts.`.slice(0, 300);

  return {
    title,
    description,
    alternates: { canonical: `${SITE}/prompts/${prompt.slug}` },
    openGraph: {
      title: `${title} | Ravindra Nath Jha`,
      description,
      url: `${SITE}/prompts/${prompt.slug}`,
      type: "article",
    },
  };
}

// Prevents "</script>" inside content from breaking out of the JSON-LD tag
const jsonLd = (data) => JSON.stringify(data).replace(/</g, "\\u003c");

function buildSteps(prompt) {
  const isNext = prompt.stack.includes("Next.js");
  return [
    {
      name: "Open an AI coding tool",
      text: `Use any capable assistant: ${AI_TOOLS.join(", ")}. Tools that can create files (Cursor, Claude Code, v0, Bolt) are the most convenient because they write the project for you.`,
    },
    {
      name: "Replace the sample details",
      text: "Copy the prompt and change the business name, location, colours and any section you do not need. The more specific your details, the better the result.",
    },
    {
      name: "Paste the prompt and generate",
      text: "Send the whole prompt in one message. If the reply is cut off, say “continue from where you stopped”, or ask for one section at a time.",
    },
    {
      name: "Run it on your computer",
      text: isNext
        ? "Create a project with “npx create-next-app@latest”, add the generated files, then run “npm run dev” and open http://localhost:3000."
        : "Save the result as index.html and open it in your browser. No installation is needed.",
    },
    {
      name: "Review and refine",
      text: "Check it on a phone-width screen, fix anything that looks off by describing it in plain words, then use the follow-up prompts below to add features one at a time.",
    },
    {
      name: "Replace placeholders and publish",
      text: "Swap in your real text and images, then deploy. Vercel and Netlify both host this kind of site for free.",
    },
  ];
}

export default async function PromptDetailPage({ params }) {
  const { slug } = await params;
  const prompt = getPrompt(slug);
  if (!prompt) notFound();

  const steps = buildSteps(prompt);
  const related = getRelatedPrompts(prompt, 3);

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to build a ${prompt.name.toLowerCase()} with an AI prompt`,
    description: prompt.description,
    tool: AI_TOOLS.map((name) => ({ "@type": "HowToTool", name })),
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      { "@type": "ListItem", position: 2, name: "Prompts", item: `${SITE}/prompts` },
      { "@type": "ListItem", position: 3, name: prompt.name, item: `${SITE}/prompts/${prompt.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema) }} />

      <article className="lib-page lib-detail">
        <div className="lib-wrap">
          <nav className="lib-crumbs" aria-label="Breadcrumb">
            <Link href="/prompts">Prompts</Link>
            <ChevronRight size={14} aria-hidden="true" />
            <span>{prompt.industry}</span>
            <ChevronRight size={14} aria-hidden="true" />
            <span aria-current="page">{prompt.name}</span>
          </nav>

          <div className="lib-detail-head">
            <div>
              <span className="svc-eyebrow">Free AI Website Prompt</span>
              <h1>{prompt.name}</h1>
              <p className="lib-detail-desc">{prompt.description}</p>
              <ul className="lib-tags">
                <li className={`lib-tone lib-tone-${prompt.tone}`}>{prompt.tone}</li>
                <li>{prompt.industry}</li>
                <li>{prompt.sections.length} sections</li>
              </ul>
            </div>
            <div className="lib-detail-actions">
              <CopyButton text={prompt.prompt} label="Copy prompt" copiedLabel="Prompt copied" className="lib-copy-primary" />
            </div>
          </div>

          <div className="lib-prompt-overview">
            <div className="lib-prompt-mock">
              <PromptPreview palette={prompt.palette} layout={prompt.layout} tone={prompt.tone} />
              <p>Layout sketch using this prompt&apos;s colour palette. Your generated site will be fully detailed.</p>
            </div>
            <dl className="lib-facts">
              <div>
                <dt>Tech stack</dt>
                <dd>{prompt.stack}</dd>
              </div>
              <div>
                <dt>Colour palette</dt>
                <dd>
                  <ul className="lib-swatches lib-swatches-compact">
                    {prompt.palette.map((color) => (
                      <li key={color}>
                        <span style={{ background: color }} />
                        <code>{color}</code>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div>
                <dt>What it builds</dt>
                <dd>
                  <ol className="lib-section-list">
                    {prompt.sections.map((section) => (
                      <li key={section}>{section}</li>
                    ))}
                  </ol>
                </dd>
              </div>
            </dl>
          </div>

          <section className="lib-block">
            <h2>The prompt</h2>
            <p className="lib-block-intro">
              Copy everything in the box. Text in quotes and the sample business details are meant to be replaced with your own.
            </p>
            <div className="lib-prompt">
              <div className="lib-prompt-bar">
                <span>Works with {AI_TOOLS.join(" · ")}</span>
                <CopyButton text={prompt.prompt} label="Copy prompt" className="lib-copy-dark" />
              </div>
              <pre tabIndex={0}>{prompt.prompt}</pre>
            </div>
          </section>

          <section className="lib-block">
            <h2>How to use this prompt</h2>
            <ol className="lib-steps">
              {steps.map((step, index) => (
                <li key={step.name}>
                  <span className="lib-step-num">{index + 1}</span>
                  <p>
                    <strong>{step.name}.</strong> {step.text}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          <section className="lib-block">
            <h2>Follow-up prompts</h2>
            <p className="lib-block-intro">
              Send these one at a time after the first version is working. Small, specific requests give much better results than one giant prompt.
            </p>
            <ul className="lib-followups">
              {prompt.followUps.map((text) => (
                <li key={text}>
                  <p>{text}</p>
                  <CopyButton text={text} label="Copy" />
                </li>
              ))}
            </ul>
          </section>

          <section className="lib-block">
            <h2>Tips for a better result</h2>
            <ul className="lib-tips">
              {prompt.tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
              <li>
                Want to hand-build a section instead? The <Link href="/templates">Templates library</Link> has heroes,
                pricing tables, FAQs and more with full code.
              </li>
            </ul>
          </section>

          <section className="lib-block">
            <h2>More website prompts</h2>
            <div className="lib-grid">
              {related.map((item) => (
                <Link key={item.slug} href={`/prompts/${item.slug}`} className="lib-card">
                  <div className="lib-thumb lib-thumb-prompt">
                    <PromptPreview palette={item.palette} layout={item.layout} tone={item.tone} />
                  </div>
                  <div className="lib-card-body">
                    <div className="lib-card-row">
                      <h3>{item.name}</h3>
                      <span className={`lib-tone lib-tone-${item.tone}`}>{item.tone}</span>
                    </div>
                    <p className="lib-card-meta">
                      {item.industry} · {item.sections.length} sections
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <div className="lib-detail-foot">
            <Link href="/prompts">← All prompts</Link>
            <Link href="/templates">UI templates with code →</Link>
          </div>
        </div>
      </article>
    </>
  );
}
