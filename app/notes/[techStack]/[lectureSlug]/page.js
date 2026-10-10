import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BarChart3, CalendarDays, ChevronRight, Clock, ListChecks, UserRound } from "lucide-react";
import { LectureCode, LectureProse } from "@/components/notes/LectureContent";
import LectureToc, { ReadingProgress } from "@/components/notes/LectureToc";
import { getTechStack, getLecture, getAllTechStacks } from "@/lib/notesData";

const SITE = "https://ravindranathjha.in";

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

// "Complete Java Course — Lecture 7: Exception Handling" -> "Exception Handling"
function topicOf(title) {
  const match = title.match(/Lecture \d+:\s*(.+)$/);
  return match ? match[1].trim() : title;
}

// Section heading -> URL anchor, e.g. "3. Try, Catch & Finally" -> "try-catch-finally"
function anchorOf(heading) {
  return heading
    .toLowerCase()
    .replace(/^\d+\.\s*/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// "3. Try, Catch & Finally" -> "Try, Catch & Finally"
const plainHeading = (heading) => heading.replace(/^\d+\.\s*/, "");

// Keep meta descriptions within the length search engines display
function metaDescription(summary) {
  if (summary.length <= 300) return summary;
  return summary.slice(0, 297).replace(/\s+\S*$/, "") + "...";
}

// "2026-10-04" -> "4 Oct 2026"
function formatDate(value) {
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

// Prevents "</script>" inside content from breaking out of the JSON-LD tag
const jsonLd = (data) => JSON.stringify(data).replace(/</g, "\\u003c");

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const stack = getTechStack(resolvedParams.techStack);
  const lecture = getLecture(resolvedParams.techStack, resolvedParams.lectureSlug);

  if (!stack || !lecture) return {};

  // Keyword-first title; the root layout template appends "| Ravindra Nath Jha"
  const pageTitle = `${topicOf(lecture.title)} — ${stack.name} Course Lecture ${lecture.number}`;
  const pageDesc = metaDescription(lecture.summary);

  return {
    title: pageTitle,
    description: pageDesc,
    alternates: {
      canonical: `${SITE}/notes/${stack.slug}/${lecture.slug}`,
    },
    openGraph: {
      title: pageTitle,
      description: pageDesc,
      url: `${SITE}/notes/${stack.slug}/${lecture.slug}`,
      type: "article",
      publishedTime: lecture.date,
      authors: ["Ravindra Nath Jha"],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDesc,
    },
  };
}

export default async function LectureDetailPage({ params }) {
  const resolvedParams = await params;
  const stack = getTechStack(resolvedParams.techStack);
  const lecture = getLecture(resolvedParams.techStack, resolvedParams.lectureSlug);

  if (!stack || !lecture) {
    notFound();
  }

  const total = stack.lectures.length;
  const lectureIndex = stack.lectures.findIndex((l) => l.slug === lecture.slug);
  const prevLecture = lectureIndex > 0 ? stack.lectures[lectureIndex - 1] : null;
  const nextLecture = lectureIndex < total - 1 ? stack.lectures[lectureIndex + 1] : null;
  const topic = topicOf(lecture.title);
  const url = `${SITE}/notes/${stack.slug}/${lecture.slug}`;

  const tocItems = lecture.sections.map((section) => ({
    id: anchorOf(section.heading),
    label: plainHeading(section.heading),
  }));

  const meta = [
    { Icon: Clock, text: lecture.readTime },
    { Icon: BarChart3, text: lecture.difficulty },
    { Icon: ListChecks, text: `${lecture.sections.length} topics` },
    { Icon: CalendarDays, text: formatDate(lecture.date) },
    { Icon: UserRound, text: "Ravindra Nath Jha" },
  ];

  // TechArticle JSON-LD Schema for Google Search Rich Snippets
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: lecture.title,
    description: lecture.summary,
    author: { "@type": "Person", name: "Ravindra Nath Jha", url: SITE },
    publisher: { "@type": "Person", name: "Ravindra Nath Jha" },
    datePublished: lecture.date,
    proficiencyLevel: lecture.difficulty,
    dependencies: stack.name,
    url,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      { "@type": "ListItem", position: 2, name: "Notes", item: `${SITE}/notes` },
      { "@type": "ListItem", position: 3, name: stack.name, item: `${SITE}/notes/${stack.slug}` },
      { "@type": "ListItem", position: 4, name: lecture.title, item: url },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema) }} />

      <ReadingProgress />

      <article className="lib-page pl-page lec-page">
        <div className="pl-glow" aria-hidden="true" />

        <div className="lib-wrap">
          <nav className="lib-crumbs" aria-label="Breadcrumb">
            <Link href="/notes">Notes</Link>
            <ChevronRight size={14} aria-hidden="true" />
            <Link href={`/notes/${stack.slug}`}>{stack.name}</Link>
            <ChevronRight size={14} aria-hidden="true" />
            <span aria-current="page">Lecture {lecture.number}</span>
          </nav>

          {/* Hero */}
          <div className="lec-hero">
            <div className="lec-hero-top">
              <span className="lec-hero-icon" aria-hidden="true">
                <i className={stack.icon} style={{ color: stack.iconColor }} />
              </span>
              <div className="lec-hero-course">
                <span>
                  {stack.name} course · Lecture {lecture.number} of {total}
                </span>
                <div className="lec-hero-bar" aria-hidden="true">
                  <i style={{ width: `${Math.round(((lectureIndex + 1) / total) * 100)}%` }} />
                </div>
              </div>
            </div>
            <h1>{topic}</h1>
            <p className="lec-hero-summary">{lecture.summary}</p>
            <ul className="lec-hero-meta">
              {meta.map(({ Icon, text }) => (
                <li key={text}>
                  <Icon size={15} strokeWidth={2} aria-hidden="true" />
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <div className="lec-layout">
            {/* Table of contents */}
            <aside className="lec-side">
              <details className="lec-toc" open>
                <summary>
                  In this lecture <ChevronRight size={16} strokeWidth={2.2} aria-hidden="true" />
                </summary>
                <nav aria-label="Table of contents">
                  <LectureToc items={tocItems} />
                </nav>
              </details>
            </aside>

            {/* Lecture content. Sections are divs: the global CSS gives every <section> a full-screen height */}
            <div className="lec-body">
              {lecture.sections.map((section, index) => (
                <div key={index} className="lec-section">
                  <h2 id={anchorOf(section.heading)}>
                    <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                    {plainHeading(section.heading)}
                  </h2>
                  <LectureProse text={section.content} stackSlug={stack.slug} />
                  {section.codeSnippet ? <LectureCode code={section.codeSnippet} stackSlug={stack.slug} /> : null}
                </div>
              ))}

              {/* Previous / next lecture: keeps readers in the course and links every page to its neighbours */}
              {(prevLecture || nextLecture) && (
                <nav className="lec-nav" aria-label="Lecture navigation">
                  {prevLecture ? (
                    <Link href={`/notes/${stack.slug}/${prevLecture.slug}`} className="lec-nav-card">
                      <span>
                        <ArrowLeft size={16} strokeWidth={2.2} aria-hidden="true" /> Previous · Lecture {prevLecture.number}
                      </span>
                      <strong>{topicOf(prevLecture.title)}</strong>
                    </Link>
                  ) : (
                    <span />
                  )}
                  {nextLecture ? (
                    <Link href={`/notes/${stack.slug}/${nextLecture.slug}`} className="lec-nav-card lec-nav-next">
                      <span>
                        Next · Lecture {nextLecture.number} <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
                      </span>
                      <strong>{topicOf(nextLecture.title)}</strong>
                    </Link>
                  ) : (
                    <Link href={`/notes/${stack.slug}`} className="lec-nav-card lec-nav-next">
                      <span>
                        Course complete <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
                      </span>
                      <strong>Back to all {stack.name} lectures</strong>
                    </Link>
                  )}
                </nav>
              )}

              <div className="lec-foot">
                <Link href={`/notes/${stack.slug}`}>
                  <ArrowLeft size={16} strokeWidth={2.2} aria-hidden="true" /> All {stack.name} lectures
                </Link>
                <Link href="/notes">
                  Explore other courses <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
