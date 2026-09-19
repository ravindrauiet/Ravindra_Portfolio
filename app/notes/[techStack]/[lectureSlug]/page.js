import Link from "next/link";
import { notFound } from "next/navigation";
import { getTechStack, getLecture, getAllTechStacks } from "@/lib/notesData";

export async function generateStaticParams() {
  const stacks = getAllTechStacks();
  const params = [];

  for (const stack of stacks) {
    for (const lecture of stack.lectures) {
      params.push({
        techStack: stack.slug,
        lectureSlug: lecture.slug,
      });
    }
  }

  return params;
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const stack = getTechStack(resolvedParams.techStack);
  const lecture = getLecture(resolvedParams.techStack, resolvedParams.lectureSlug);

  if (!stack || !lecture) return {};

  const pageTitle = `${lecture.title} | ${stack.name} Lecture #${lecture.number}`;
  const pageDesc = `${lecture.summary} Detailed masterclass tutorial & code examples for ${stack.name} by Ravindra Nath Jha.`;

  return {
    title: pageTitle,
    description: pageDesc,
    alternates: {
      canonical: `https://ravindranathjha.in/notes/${stack.slug}/${lecture.slug}`,
    },
    openGraph: {
      title: pageTitle,
      description: pageDesc,
      url: `https://ravindranathjha.in/notes/${stack.slug}/${lecture.slug}`,
      type: "article",
      publishedTime: lecture.date,
      authors: ["Ravindra Nath Jha"],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDesc,
    }
  };
}

function renderFormattedContent(text) {
  if (!text) return null;
  
  const paragraphs = text.split("\n");
  
  return paragraphs.map((para, idx) => {
    if (!para.trim()) return null;
    
    // Parse **bold** syntax
    const parts = para.split(/(\*\*.*?\*\*)/g);
    
    const formattedLine = parts.map((part, pIdx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={pIdx} style={{ color: "#002057", fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });

    return (
      <p key={idx} style={{ marginBottom: "0.8rem", color: "#334155", fontSize: "1.05rem", lineHeight: "1.8" }}>
        {formattedLine}
      </p>
    );
  });
}

export default async function LectureDetailPage({ params }) {
  const resolvedParams = await params;
  const stack = getTechStack(resolvedParams.techStack);
  const lecture = getLecture(resolvedParams.techStack, resolvedParams.lectureSlug);

  if (!stack || !lecture) {
    notFound();
  }

  // TechArticle JSON-LD Schema for Google Search Rich Snippets
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": lecture.title,
    "description": lecture.summary,
    "author": {
      "@type": "Person",
      "name": "Ravindra Nath Jha",
      "url": "https://ravindranathjha.in"
    },
    "publisher": {
      "@type": "Person",
      "name": "Ravindra Nath Jha"
    },
    "datePublished": lecture.date,
    "proficiencyLevel": lecture.difficulty,
    "dependencies": stack.name,
    "url": `https://ravindranathjha.in/notes/${stack.slug}/${lecture.slug}`
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://ravindranathjha.in"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Notes",
        "item": "https://ravindranathjha.in/notes"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": stack.name,
        "item": `https://ravindranathjha.in/notes/${stack.slug}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": lecture.title,
        "item": `https://ravindranathjha.in/notes/${stack.slug}/${lecture.slug}`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <article className="container" style={{ paddingTop: "7.5rem", paddingBottom: "4rem", maxWidth: "960px", margin: "0 auto", paddingLeft: "1.2rem", paddingRight: "1.2rem" }}>
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: "1.5rem" }}>
          <Link
            href={`/notes/${stack.slug}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "#2506ad",
              fontWeight: "700",
              textDecoration: "none",
              fontSize: "0.95rem",
              background: "#f1f5f9",
              padding: "0.5rem 1.2rem",
              borderRadius: "50px",
              border: "1px solid #cbd5e1"
            }}
          >
            <i className="fas fa-arrow-left"></i> Back to {stack.name} Lectures
          </Link>
        </div>

        {/* Hero Banner Card for Lecture */}
        <div
          className="lecture-banner-card"
          style={{
            background: "linear-gradient(135deg, #002057 0%, #0f172a 100%)",
            borderRadius: "20px",
            padding: "2rem 1.8rem",
            color: "#fff",
            marginBottom: "2rem",
            boxShadow: "0 15px 30px rgba(0,0,0,0.12)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "1rem", flexWrap: "wrap" }}>
            <span style={{ background: "#ff7b00", color: "#fff", padding: "0.25rem 0.8rem", borderRadius: "50px", fontSize: "0.8rem", fontWeight: "700" }}>
              Lecture #{lecture.number}
            </span>
            <span style={{ background: "rgba(255,255,255,0.15)", color: "#fff", padding: "0.25rem 0.8rem", borderRadius: "50px", fontSize: "0.8rem", fontWeight: "600" }}>
              {stack.name}
            </span>
            <span style={{ color: "#cbd5e1", fontSize: "0.85rem" }}>⏱️ {lecture.readTime}</span>
            <span style={{ color: "#cbd5e1", fontSize: "0.85rem" }}>📊 {lecture.difficulty}</span>
          </div>

          <h1 style={{ fontSize: "2.2rem", color: "#ffffff", fontWeight: "800", lineHeight: "1.3", marginBottom: "1rem" }}>
            {lecture.title}
          </h1>

          <p style={{ fontSize: "1.05rem", color: "#cbd5e1", lineHeight: "1.7", maxWidth: "840px", marginBottom: "0" }}>
            {lecture.summary}
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: "1.2rem", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.1)", fontSize: "0.9rem", color: "#94a3b8" }}>
            <span>Author: <strong style={{ color: "#fff" }}>Ravindra Nath Jha</strong></span>
            <span>•</span>
            <span>Published: <strong style={{ color: "#fff" }}>{lecture.date}</strong></span>
          </div>
        </div>

        {/* Lecture Content Sections — Uses div wrapper to prevent global section min-height:100vh rule */}
        <main style={{ display: "flex", flexDirection: "column", gap: "1.8rem" }}>
          {lecture.sections.map((section, idx) => (
            <div
              key={idx}
              className="lecture-section-card"
              style={{
                background: "#ffffff",
                padding: "1.8rem",
                borderRadius: "18px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 6px 20px rgba(0,0,0,0.03)"
              }}
            >
              <h2 style={{ fontSize: "1.6rem", color: "#002057", fontWeight: "700", marginBottom: "1rem", borderBottom: "2px solid #f1f5f9", paddingBottom: "0.5rem" }}>
                {section.heading}
              </h2>

              <div style={{ marginBottom: section.codeSnippet ? "1.2rem" : "0" }}>
                {renderFormattedContent(section.content)}
              </div>

              {section.codeSnippet && (
                <div style={{ marginTop: "1.2rem" }}>
                  <div
                    style={{
                      background: "#1e293b",
                      color: "#94a3b8",
                      padding: "0.6rem 1.2rem",
                      borderTopLeftRadius: "10px",
                      borderTopRightRadius: "10px",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <span>💻 Practical Code Example</span>
                    <span style={{ background: "#334155", color: "#cbd5e1", padding: "0.2rem 0.6rem", borderRadius: "4px", fontSize: "0.75rem" }}>
                      {stack.slug}
                    </span>
                  </div>
                  <pre
                    style={{
                      background: "#0f172a",
                      color: "#f8fafc",
                      padding: "1.2rem",
                      borderBottomLeftRadius: "10px",
                      borderBottomRightRadius: "10px",
                      overflowX: "auto",
                      fontSize: "0.9rem",
                      fontFamily: "Consolas, Monaco, 'Andale Mono', monospace",
                      lineHeight: "1.6",
                      margin: "0"
                    }}
                  >
                    <code>{section.codeSnippet}</code>
                  </pre>
                </div>
              )}
            </div>
          ))}
        </main>

        {/* Footer Navigation */}
        <footer style={{ marginTop: "3rem", paddingTop: "1.5rem", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <Link
            href={`/notes/${stack.slug}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.8rem 1.5rem",
              borderRadius: "50px",
              background: "#f1f5f9",
              color: "#002057",
              fontWeight: "700",
              textDecoration: "none",
              border: "1px solid #cbd5e1",
              fontSize: "0.95rem"
            }}
          >
            <i className="fas fa-arrow-left"></i> All {stack.name} Lectures
          </Link>

          <Link
            href="/notes"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.8rem 1.5rem",
              borderRadius: "50px",
              background: "#2506ad",
              color: "#fff",
              fontWeight: "700",
              textDecoration: "none",
              boxShadow: "0 8px 20px rgba(37, 6, 173, 0.25)",
              fontSize: "0.95rem"
            }}
          >
            Explore Other Tech Stacks <i className="fas fa-arrow-right"></i>
          </Link>
        </footer>
      </article>
    </>
  );
}
