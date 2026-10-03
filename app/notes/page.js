import Link from "next/link";
import { ArrowRight, BookOpen, Clock, Layers, PlayCircle } from "lucide-react";
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

// "30 min read" -> 30
const readMinutes = (lecture) => parseInt(lecture.readTime, 10) || 0;

export default function NotesPage() {
  const stacks = getAllTechStacks()
    .map((stack) => ({
      ...stack,
      lectureCount: stack.lectures.length,
      minutes: stack.lectures.reduce((sum, l) => sum + readMinutes(l), 0)
    }))
    .sort((a, b) => b.lectureCount - a.lectureCount);

  const [featured, ...others] = stacks;
  const totalLectures = stacks.reduce((sum, s) => sum + s.lectureCount, 0);
  const totalHours = Math.round(stacks.reduce((sum, s) => sum + s.minutes, 0) / 60);

  const stats = [
    { Icon: Layers, value: stacks.length, label: "Tech tracks" },
    { Icon: BookOpen, value: totalLectures, label: "Lectures" },
    { Icon: Clock, value: `${totalHours}+ hrs`, label: "Reading time" }
  ];

  return (
    <section className="notes-page">
      <div className="nts-wrap">
        {/* Hero */}
        <div className="nts-hero">
          <div className="nts-hero-text">
            <span className="svc-eyebrow">Knowledge Repository</span>
            <h1 className="heading">
              Developer <span>Tech Notes</span> &amp; Tutorials
            </h1>
            <p className="nts-subheading">
              In-depth technical guides, architecture breakdowns, lecture notes, and production code
              patterns for modern software developers.
            </p>
            <ul className="nts-stats">
              {stats.map(({ Icon, value, label }) => (
                <li key={label}>
                  <span className="nts-stat-icon">
                    <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <span>
                    <strong>{value}</strong>
                    <small>{label}</small>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Decorative 3D stack of note cards, one per track */}
          <div className="nts-visual" aria-hidden="true">
            <div className="nts-stack">
              {[...stacks].reverse().map((stack, i) => (
                <div
                  key={stack.id}
                  className={`nts-layer ${i === stacks.length - 1 ? "nts-layer-top" : ""}`}
                  style={{ "--i": i }}
                >
                  <span className="nts-layer-icon" style={{ color: stack.iconColor }}>
                    <i className={stack.icon}></i>
                  </span>
                  <span className="nts-layer-text">
                    <strong>{stack.name}</strong>
                    <small>{stack.lectureCount} lecture{stack.lectureCount > 1 ? "s" : ""}</small>
                  </span>
                  <span className="nts-layer-lines">
                    <span />
                    <span />
                    <span />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tracks */}
        <div className="nts-grid">
          <Link href={`/notes/${featured.slug}`} className="nts-card nts-card-featured">
            <div className="nts-card-top">
              <span className="nts-icon" style={{ color: featured.iconColor }}>
                <i className={featured.icon}></i>
              </span>
              <span className="svc-highlight">Most Lectures</span>
            </div>
            <span className="nts-badge">{featured.badge}</span>
            <h2>{featured.name}</h2>
            <p className="nts-desc">{featured.description}</p>

            <ol className="nts-preview">
              {featured.lectures.slice(0, 3).map((lecture) => (
                <li key={lecture.slug}>
                  <span className="nts-preview-num">{String(lecture.number).padStart(2, "0")}</span>
                  <span className="nts-preview-title">{lecture.title}</span>
                </li>
              ))}
            </ol>

            <div className="nts-card-footer">
              <span className="nts-meta">
                <BookOpen size={15} strokeWidth={2} aria-hidden="true" /> {featured.lectureCount} lectures
                <Clock size={15} strokeWidth={2} aria-hidden="true" /> {featured.minutes} min
              </span>
              <span className="nts-start">
                <PlayCircle size={17} strokeWidth={2} aria-hidden="true" /> Explore Track
              </span>
            </div>
          </Link>

          {others.map((stack) => (
            <Link key={stack.id} href={`/notes/${stack.slug}`} className="nts-card">
              <div className="nts-card-top">
                <span className="nts-icon" style={{ color: stack.iconColor }}>
                  <i className={stack.icon}></i>
                </span>
                <span className="nts-badge">{stack.badge}</span>
              </div>
              <h2>{stack.name}</h2>
              <p className="nts-desc">{stack.description}</p>
              <div className="nts-card-footer">
                <span className="nts-meta">
                  <BookOpen size={15} strokeWidth={2} aria-hidden="true" /> {stack.lectureCount} lecture
                  {stack.lectureCount > 1 ? "s" : ""}
                  <Clock size={15} strokeWidth={2} aria-hidden="true" /> {stack.minutes} min
                </span>
                <span className="nts-explore">
                  Explore <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
