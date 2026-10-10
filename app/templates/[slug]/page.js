import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import CodeTabs from "@/components/library/CodeTabs";
import CopyButton from "@/components/library/CopyButton";
import PreviewPanel from "@/components/library/PreviewPanel";
import {
  buildDocument,
  getAllTemplates,
  getCategory,
  getRelatedTemplates,
  getTemplate,
} from "@/lib/templates";

const SITE = "https://ravindranathjha.in";
const AI_TOOLS = ["Claude", "ChatGPT", "Cursor", "v0", "Bolt", "Gemini"];

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllTemplates().map((template) => ({ slug: template.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const template = getTemplate(slug);
  if (!template) return {};

  const category = getCategory(template.category);
  const tech = template.module ? "Three.js" : template.js ? "HTML, CSS & JavaScript" : "HTML & CSS";
  const title = `${template.name} — Free ${tech} Code + AI Prompt`;
  const description = `${template.description} Free ${category.singular.toLowerCase()} with live preview, full source code and step-by-step build guide.`.slice(0, 300);

  return {
    title,
    description,
    keywords: [...template.tags, category.singular.toLowerCase(), "css", "html", "ai prompt", "free template"],
    alternates: { canonical: `${SITE}/templates/${template.slug}` },
    openGraph: {
      title: `${title} | Ravindra Nath Jha`,
      description,
      url: `${SITE}/templates/${template.slug}`,
      type: "article",
    },
  };
}

// Prevents "</script>" inside content from breaking out of the JSON-LD tag
const jsonLd = (data) => JSON.stringify(data).replace(/</g, "\\u003c");

export default async function TemplateDetailPage({ params }) {
  const { slug } = await params;
  const template = getTemplate(slug);
  if (!template) notFound();

  const category = getCategory(template.category);
  const doc = buildDocument(template);
  const related = getRelatedTemplates(template, 3);

  const files = [
    { id: "html", label: "HTML", code: template.html },
    { id: "css", label: "CSS", code: template.css },
    ...(template.js ? [{ id: "js", label: "JavaScript", code: template.js }] : []),
    { id: "full", label: "Full file", code: doc },
  ];

  const sourceSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: template.name,
    description: template.description,
    programmingLanguage: template.js ? ["HTML", "CSS", "JavaScript"] : ["HTML", "CSS"],
    codeSampleType: "full solution",
    isAccessibleForFree: true,
    keywords: template.tags.join(", "),
    url: `${SITE}/templates/${template.slug}`,
    author: { "@type": "Person", name: "Ravindra Nath Jha", url: SITE },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      { "@type": "ListItem", position: 2, name: "Templates", item: `${SITE}/templates` },
      { "@type": "ListItem", position: 3, name: template.name, item: `${SITE}/templates/${template.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(sourceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema) }} />

      <article className="lib-page lib-detail">
        <div className="lib-wrap">
          <nav className="lib-crumbs" aria-label="Breadcrumb">
            <Link href="/templates">Templates</Link>
            <ChevronRight size={14} aria-hidden="true" />
            <span>{category.label}</span>
            <ChevronRight size={14} aria-hidden="true" />
            <span aria-current="page">{template.name}</span>
          </nav>

          <div className="lib-detail-head">
            <div>
              <span className="svc-eyebrow">Free {category.singular}</span>
              <h1>{template.name}</h1>
              <p className="lib-detail-desc">{template.description}</p>
              <ul className="lib-tags">
                <li className={`lib-tone lib-tone-${template.tone}`}>{template.tone}</li>
                {template.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </div>
            <div className="lib-detail-actions">
              <CopyButton text={doc} label="Copy full code" copiedLabel="Code copied" className="lib-copy-primary" />
              <CopyButton text={template.prompt} label="Copy AI prompt" copiedLabel="Prompt copied" />
            </div>
          </div>

          <PreviewPanel doc={doc} title={template.name} />

          {template.colors && (
            <section className="lib-block">
              <h2>Colours in this gradient</h2>
              <ul className="lib-swatches">
                {template.colors.map((color) => (
                  <li key={color}>
                    <span style={{ background: color }} />
                    <code>{color}</code>
                  </li>
                ))}
              </ul>
              <div className="lib-inline-code">
                <code>background: {template.background};</code>
                <CopyButton text={`background: ${template.background};`} label="Copy CSS" />
              </div>
            </section>
          )}

          <section className="lib-block">
            <h2>The code</h2>
            <p className="lib-block-intro">
              {`Plain ${template.js ? "HTML, CSS and JavaScript" : "HTML and CSS"}${
                template.dependencies
                  ? `. Uses ${template.dependencies}, so there is nothing to install`
                  : " with no dependencies"
              }. Copy a single`}{" "}
              file, or choose &quot;Full file&quot; for a complete page you can save as <code>index.html</code> and open in a
              browser.
            </p>
            <CodeTabs files={files} />
          </section>

          <section className="lib-block">
            <h2>The AI prompt</h2>
            <p className="lib-block-intro">
              {`Paste this into an AI coding tool to generate the same ${category.singular.toLowerCase()}, then ask it to adapt`}{" "}
              the colours, text or framework to your project.
            </p>
            <div className="lib-prompt">
              <div className="lib-prompt-bar">
                <span>Works with {AI_TOOLS.join(" · ")}</span>
                <CopyButton text={template.prompt} label="Copy prompt" className="lib-copy-dark" />
              </div>
              <pre tabIndex={0}>{template.prompt}</pre>
            </div>
          </section>

          <section className="lib-block">
            <h2>How to build it, step by step</h2>
            <ol className="lib-steps">
              {template.steps.map((step, index) => (
                <li key={index}>
                  <span className="lib-step-num">{index + 1}</span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="lib-block">
            <h2>Customisation tips</h2>
            <ul className="lib-tips">
              {template.tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </section>

          {related.length > 0 && (
            <section className="lib-block">
              <h2>More {category.label.toLowerCase()}</h2>
              <div className="lib-grid">
                {related.map((item) => (
                  <Link key={item.slug} href={`/templates/${item.slug}`} className="lib-card">
                    <div className={`lib-thumb lib-thumb-${item.category}`}>
                      {item.category === "gradients" ? (
                        <div className="lib-thumb-fill" style={{ background: item.background }} />
                      ) : (
                        <iframe
                          title={`${item.name} preview`}
                          srcDoc={buildDocument(item)}
                          sandbox="allow-scripts"
                          loading="lazy"
                          tabIndex={-1}
                          aria-hidden="true"
                        />
                      )}
                    </div>
                    <div className="lib-card-body">
                      <div className="lib-card-row">
                        <h3>{item.name}</h3>
                        <span className={`lib-tone lib-tone-${item.tone}`}>{item.tone}</span>
                      </div>
                      <p className="lib-card-meta">{category.singular} · Code + AI prompt</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <div className="lib-detail-foot">
            <Link href="/templates">← All templates</Link>
            <Link href="/prompts">Full website prompts →</Link>
          </div>
        </div>
      </article>
    </>
  );
}
