import Link from "next/link";
import { notFound } from "next/navigation";
import { getTechStack, getAllTechStacks } from "@/lib/notesData";

export async function generateStaticParams() {
  const stacks = getAllTechStacks();
  return stacks.map((stack) => ({
    techStack: stack.slug,
  }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const stack = getTechStack(resolvedParams.techStack);
  if (!stack) return {};

  return {
    title: `${stack.name} Notes & Lectures`,
    description: `Complete lecture series and tutorials for ${stack.name}. ${stack.description}`,
    alternates: {
      canonical: `https://ravindranathjha.in/notes/${stack.slug}`,
    },
    openGraph: {
      title: `${stack.name} Notes & Lectures | Ravindra Nath Jha`,
      description: stack.description,
      url: `https://ravindranathjha.in/notes/${stack.slug}`,
    },
  };
}

export default async function TechStackPage({ params }) {
  const resolvedParams = await params;
  const stack = getTechStack(resolvedParams.techStack);

  if (!stack) {
    notFound();
  }

  return (
    <section className="container" style={{ paddingTop: "8rem", paddingBottom: "6rem", maxWidth: "1100px", margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <Link href="/notes" style={{ color: "#2506ad", fontWeight: "700", textDecoration: "none", fontSize: "1rem" }}>
          <i className="fas fa-arrow-left" style={{ marginRight: "6px" }}></i> Back to All Notes
        </Link>
      </div>

      <div
        style={{
          background: "linear-gradient(135deg, #002057 0%, #0f172a 100%)",
          borderRadius: "24px",
          padding: "3rem 2.5rem",
          color: "#fff",
          marginBottom: "3rem",
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1.2rem", marginBottom: "1rem" }}>
          <i className={stack.icon} style={{ fontSize: "3rem", color: stack.iconColor }}></i>
          <div>
            <span style={{ background: "#ff7b00", color: "#fff", padding: "0.2rem 0.8rem", borderRadius: "50px", fontSize: "0.8rem", fontWeight: "700" }}>
              {stack.badge}
            </span>
            <h1 style={{ fontSize: "2.8rem", fontWeight: "800", marginTop: "0.3rem", color: "#fff" }}>
              {stack.name} Master Notes
            </h1>
          </div>
        </div>
        <p style={{ color: "#cbd5e1", fontSize: "1.2rem", lineHeight: "1.8", maxWidth: "800px" }}>
          {stack.description}
        </p>
      </div>

      <h2 style={{ fontSize: "2rem", color: "#002057", fontWeight: "800", marginBottom: "1.5rem" }}>
        Available Lectures ({stack.lectures.length})
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {stack.lectures.map((lecture) => (
          <Link
            key={lecture.slug}
            href={`/notes/${stack.slug}/${lecture.slug}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              className="bento-card"
              style={{
                transition: "all 0.3s ease",
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                cursor: "pointer"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                <span style={{ background: "#2506ad", color: "#fff", padding: "0.3rem 0.8rem", borderRadius: "6px", fontSize: "0.85rem", fontWeight: "700" }}>
                  Lecture #{lecture.number}
                </span>
                <div style={{ display: "flex", gap: "1rem", color: "#64748b", fontSize: "0.9rem" }}>
                  <span>⏱️ {lecture.readTime}</span>
                  <span>📊 {lecture.difficulty}</span>
                </div>
              </div>

              <h3 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#002057" }}>
                {lecture.title}
              </h3>

              <p style={{ color: "#475569", fontSize: "1.05rem", lineHeight: "1.7" }}>
                {lecture.summary}
              </p>

              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#2506ad", fontWeight: "700", marginTop: "0.5rem" }}>
                Read Full Lecture Notes <i className="fas fa-arrow-right"></i>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
