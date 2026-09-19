import Link from "next/link";
import { getAllTechStacks } from "@/lib/notesData";

export const metadata = {
  title: "Tech Notes & Free Developer Tutorials",
  description: "Comprehensive developer notes, lecture series, and code guides for React.js, Next.js, Java, Python, and Artificial Intelligence by Ravindra Nath Jha.",
  alternates: {
    canonical: "https://ravindranathjha.in/notes",
  },
  openGraph: {
    title: "Tech Notes & Free Developer Tutorials | Ravindra Nath Jha",
    description: "Comprehensive developer notes, lecture series, and code guides for React.js, Next.js, Java, Python, and Artificial Intelligence.",
    url: "https://ravindranathjha.in/notes",
  },
};

export default function NotesPage() {
  const stacks = getAllTechStacks();

  return (
    <section className="notes-container container" style={{ paddingTop: "8rem", paddingBottom: "6rem" }}>
      <div className="notes-header">
        <span className="services-header-tag">KNOWLEDGE REPOSITORY</span>
        <h1 className="heading" style={{ margin: "0.5rem 0" }}>
          Developer <span>Tech Notes</span> & Tutorials
        </h1>
        <p className="services-sub-heading">
          In-depth technical guides, architecture breakdowns, lecture notes, and production code patterns for modern software developers.
        </p>
      </div>

      <div className="bento-services-grid" style={{ marginTop: "3rem" }}>
        {stacks.map((stack) => (
          <Link
            key={stack.id}
            href={`/notes/${stack.slug}`}
            className="bento-card"
            style={{ display: "block", textDecoration: "none", color: "inherit", cursor: "pointer" }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "16px",
                  background: "#0f172a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.8rem",
                  color: stack.iconColor
                }}
              >
                <i className={stack.icon}></i>
              </div>
              <span className="modal-tech-badge" style={{ background: "#2506ad", color: "#fff", fontSize: "0.8rem", padding: "0.3rem 0.8rem" }}>
                {stack.badge}
              </span>
            </div>

            <h2 style={{ fontSize: "1.6rem", fontWeight: "700", color: "#002057", marginBottom: "0.8rem" }}>
              {stack.name}
            </h2>

            <p style={{ color: "#475569", fontSize: "1rem", lineHeight: "1.6", marginBottom: "1.5rem" }}>
              {stack.description}
            </p>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "1rem", borderTop: "1px solid #e2e8f0" }}>
              <span style={{ fontSize: "0.9rem", color: "#64748b", fontWeight: "600" }}>
                📚 {stack.totalLectures} Lecture{stack.totalLectures > 1 ? "s" : ""} Available
              </span>
              <span style={{ fontSize: "0.95rem", color: "#2506ad", fontWeight: "700" }}>
                Explore Notes <i className="fas fa-arrow-right" style={{ marginLeft: "4px" }}></i>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
