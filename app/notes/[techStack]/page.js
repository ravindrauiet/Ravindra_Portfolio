import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BookOpen, ChevronRight, Clock, GraduationCap, Sparkles } from "lucide-react";
import LectureList from "@/components/notes/LectureList";
import { getTechStack, getAllTechStacks } from "@/lib/notesData";

const SITE = "https://ravindranathjha.in";

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
    title: `${stack.name} Course Notes & Tutorials (${stack.lectures.length} ${stack.lectures.length === 1 ? "Lecture" : "Lectures"})`,
    description: `Free ${stack.name} course with ${stack.lectures.length} detailed ${stack.lectures.length === 1 ? "lecture" : "lectures"}, code examples, interview questions and hands-on exercises. ${stack.description}`,
    alternates: {
      canonical: `${SITE}/notes/${stack.slug}`,
    },
    openGraph: {
      title: `${stack.name} Notes & Lectures | Ravindra Nath Jha`,
      description: stack.description,
      url: `${SITE}/notes/${stack.slug}`,
    },
  };
}

// "Complete React Course — Module 1: Lecture 3: JSX Deep Dive" -> "JSX Deep Dive"
function topicOf(title) {
  const match = title.match(/Lecture \d+:\s*(.+)$/);
  return match ? match[1].trim() : title;
}

// "… — Module 4: Lecture 13: …" -> 4 (null when the course has no modules)
function moduleOf(title) {
  const match = title.match(/Module (\d+):/);
  return match ? Number(match[1]) : null;
}

// "30 min read" -> 30
const readMinutes = (lecture) => parseInt(lecture.readTime, 10) || 0;

// Prevents "</script>" inside content from breaking out of the JSON-LD tag
const jsonLd = (data) => JSON.stringify(data).replace(/</g, "\\u003c");

export default async function TechStackPage({ params }) {
  const resolvedParams = await params;
  const stack = getTechStack(resolvedParams.techStack);

  if (!stack) {
    notFound();
  }

  const lectures = stack.lectures.map((lecture) => ({
    slug: lecture.slug,
    number: lecture.number,
    topic: topicOf(lecture.title),
    module: moduleOf(lecture.title),
    summary: lecture.summary,
    readTime: lecture.readTime,
    difficulty: lecture.difficulty,
    sectionCount: lecture.sections.length,
  }));

  const first = lectures[0];
  const totalMinutes = stack.lectures.reduce((sum, lecture) => sum + readMinutes(lecture), 0);
  const hours = Math.max(1, Math.round(totalMinutes / 60));
  const totalTopics = lectures.reduce((sum, lecture) => sum + lecture.sectionCount, 0);
  const moduleCount = new Set(lectures.map((lecture) => lecture.module).filter(Boolean)).size;
  const pathPreview = lectures.slice(0, 4);
  const others = getAllTechStacks().filter((other) => other.slug !== stack.slug);

  const stats = [
    { Icon: BookOpen, value: lectures.length, label: lectures.length === 1 ? "Lecture" : "Lectures" },
    { Icon: Clock, value: `${hours}+ hrs`, label: "Reading time" },
    { Icon: GraduationCap, value: totalTopics, label: "Topics covered" },
  ];

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: `${stack.name} Course Notes`,
    description: stack.description,
    url: `${SITE}/notes/${stack.slug}`,
    isAccessibleForFree: true,
    provider: { "@type": "Person", name: "Ravindra Nath Jha", url: SITE },
    hasPart: lectures.map((lecture) => ({
      "@type": "LearningResource",
      position: lecture.number,
      name: lecture.topic,
      url: `${SITE}/notes/${stack.slug}/${lecture.slug}`,
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      { "@type": "ListItem", position: 2, name: "Notes", item: `${SITE}/notes` },
      { "@type": "ListItem", position: 3, name: stack.name, item: `${SITE}/notes/${stack.slug}` },
    ],
  };

  return (
    <section className="lib-page pl-page crs-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(courseSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema) }} />

      <div className="pl-glow" aria-hidden="true" />

      <div className="lib-wrap">
        <nav className="lib-crumbs" aria-label="Breadcrumb">
          <Link href="/notes">Notes</Link>
          <ChevronRight size={14} aria-hidden="true" />
          <span aria-current="page">{stack.name}</span>
        </nav>

        {/* Hero */}
        <div className="crs-hero">
          <div className="crs-hero-text">
            <div className="crs-title-row">
              <span className="crs-icon" aria-hidden="true">
                <i className={stack.icon} style={{ color: stack.iconColor }} />
              </span>
              <span className="crs-badge">
                <Sparkles size={14} strokeWidth={2.2} aria-hidden="true" />
                {stack.badge} · Free course
              </span>
            </div>
            <h1>
              {stack.name} <span>Course Notes</span>
            </h1>
            <p className="crs-lead">{stack.description}</p>
            <div className="pl-actions">
              <Link href={`/notes/${stack.slug}/${first.slug}`} className="pl-btn pl-btn-primary">
                Start with lecture 1 <ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" />
              </Link>
              <a href="#lectures" className="pl-btn crs-btn-ghost">
                See all {lectures.length} lectures
              </a>
            </div>
            <ul className="crs-stats">
              {stats.map(({ Icon, value, label }) => (
                <li key={label}>
                  <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
                  <div>
                    <strong>{value}</strong>
                    <span>{label}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="crs-visual" aria-hidden="true">
            <div className="crs-path">
              <div className="crs-path-head">
                <strong>Your learning path</strong>
                <span>{moduleCount > 1 ? `${moduleCount} modules` : `${lectures.length} lectures`}</span>
              </div>
              <div className="crs-path-bar">
                <i />
              </div>
              <ol>
                {pathPreview.map((lecture) => (
                  <li key={lecture.slug}>
                    <span>{String(lecture.number).padStart(2, "0")}</span>
                    <p>{lecture.topic}</p>
                    <small>{lecture.readTime.replace(" read", "")}</small>
                  </li>
                ))}
              </ol>
              {lectures.length > pathPreview.length ? (
                <p className="crs-path-more">+ {lectures.length - pathPreview.length} more lectures</p>
              ) : null}
            </div>
            <div className="crs-chip crs-chip-free">100% free · No sign-up</div>
            <div className="crs-chip crs-chip-icon">
              <i className={stack.icon} style={{ color: stack.iconColor }} />
            </div>
          </div>
        </div>

        {/* Lectures */}
        <div className="pl-section" id="lectures">
          <div className="pl-head">
            <span className="svc-eyebrow">Course syllabus</span>
            <h2>
              {lectures.length} {lectures.length === 1 ? "lecture" : "lectures"}, <span>start to finish</span>
            </h2>
            <p>
              Each lecture has detailed notes, code examples, interview questions and practice exercises. Follow them in
              order, or jump to the topic you need.
            </p>
          </div>
          <LectureList stackSlug={stack.slug} lectures={lectures} />
        </div>

        {/* Other courses */}
        {others.length > 0 ? (
          <div className="pl-section">
            <div className="pl-head">
              <span className="svc-eyebrow">Keep learning</span>
              <h2>
                More free <span>courses</span>
              </h2>
            </div>
            <div className="crs-others">
              {others.map((other) => (
                <Link key={other.slug} href={`/notes/${other.slug}`} className="crs-other">
                  <span className="crs-other-icon">
                    <i className={other.icon} style={{ color: other.iconColor }} aria-hidden="true" />
                  </span>
                  <strong>{other.name}</strong>
                  <small>{other.badge}</small>
                  <span className="crs-other-go">
                    {other.lectures.length} lectures <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        <div className="lib-banner pl-banner">
          <div>
            <h2>Ready to build something?</h2>
            <p>Put the notes into practice with free UI templates and full-website AI prompts you can copy.</p>
          </div>
          <Link href="/templates" className="lib-banner-btn">
            Browse templates <ArrowRight size={17} strokeWidth={2} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
