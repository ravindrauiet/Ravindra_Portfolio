import Link from "next/link";
import { ArrowRight, BookOpen, Clock } from "lucide-react";
import { getAllTechStacks } from "@/lib/notesData";

// "Course Lecture 3: JSX Deep Dive" -> "JSX Deep Dive"
const topicOf = (title) => (title.match(/Lecture \d+:\s*(.+)$/)?.[1] ?? title).trim();

const formatDate = (value) => {
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
};

// Home page section that surfaces the newest lectures, so visitors see the site's written content
export default function LatestNotes() {
  const stacks = getAllTechStacks();
  const latest = stacks
    .flatMap((stack) => stack.lectures.map((lecture) => ({ stack, lecture })))
    .filter(({ lecture }) => lecture.date)
    .sort((a, b) => b.lecture.date.localeCompare(a.lecture.date))
    .slice(0, 6);
  const total = stacks.reduce((sum, stack) => sum + stack.lectures.length, 0);

  return (
    <section className="latest-notes" aria-labelledby="latest-notes-title">
      <div className="ln-wrap">
        <div className="ln-head">
          <div>
            <span className="svc-eyebrow">From the notes</span>
            <h2 id="latest-notes-title" className="heading">
              Latest <span>lectures</span>
            </h2>
            <p>
              Free, in-depth programming notes I write and update: {total} lectures across{" "}
              {stacks.map((stack) => stack.name).join(", ")}.
            </p>
          </div>
          <Link href="/notes" className="ln-all">
            All courses <ArrowRight size={17} strokeWidth={2} aria-hidden="true" />
          </Link>
        </div>

        <div className="ln-grid">
          {latest.map(({ stack, lecture }) => (
            <article key={`${stack.slug}-${lecture.slug}`} className="ln-card">
              <p className="ln-meta">
                <span>{stack.name}</span>
                <time dateTime={lecture.date}>{formatDate(lecture.date)}</time>
              </p>
              <h3>
                <Link href={`/notes/${stack.slug}/${lecture.slug}`} className="ln-link">
                  {topicOf(lecture.title)}
                </Link>
              </h3>
              <p className="ln-summary">{lecture.summary}</p>
              <p className="ln-foot">
                <span>
                  <Clock size={14} strokeWidth={2} aria-hidden="true" /> {lecture.readTime}
                </span>
                <span>
                  <BookOpen size={14} strokeWidth={2} aria-hidden="true" /> Lecture {lecture.number}
                </span>
                <span className="ln-by">by Ravindra Nath Jha</span>
              </p>
            </article>
          ))}
        </div>

        <p className="ln-more">
          Also free: <Link href="/templates">UI templates with code</Link>,{" "}
          <Link href="/templates#parallax-websites">parallax website demos</Link> and{" "}
          <Link href="/prompts">AI website prompts</Link>.
        </p>
      </div>
    </section>
  );
}
