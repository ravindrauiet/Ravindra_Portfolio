"use client";

import Link from "next/link";
import { ArrowRight, RotateCcw } from "lucide-react";
import { useCompleted, useLastLecture } from "./progress";

// lectures: [{ slug, number, topic }]
// Shown in the course hero once the visitor has opened or completed a lecture
export default function CourseProgress({ stackSlug, lectures }) {
  const { completed } = useCompleted(stackSlug);
  const last = useLastLecture(stackSlug);

  const count = lectures.filter((lecture) => completed.has(lecture.slug)).length;
  if (!last && count === 0) return null;

  // Continue with the first unfinished lecture from the last one opened
  const lastIndex = Math.max(0, lectures.findIndex((lecture) => lecture.slug === last));
  const ordered = [...lectures.slice(lastIndex), ...lectures.slice(0, lastIndex)];
  const resume = ordered.find((lecture) => !completed.has(lecture.slug));
  const percent = Math.round((count / lectures.length) * 100);

  return (
    <div className="crs-resume">
      <div className="crs-resume-text">
        <span>
          {count === lectures.length ? "Course complete" : "Welcome back"} · {count} of {lectures.length} done
        </span>
        <div className="crs-resume-bar" aria-hidden="true">
          <i style={{ width: `${percent}%` }} />
        </div>
      </div>
      {resume ? (
        <Link href={`/notes/${stackSlug}/${resume.slug}`} className="crs-resume-btn">
          Continue: Lecture {resume.number} <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
        </Link>
      ) : (
        <Link href={`/notes/${stackSlug}/${lectures[0].slug}`} className="crs-resume-btn">
          <RotateCcw size={16} strokeWidth={2.2} aria-hidden="true" /> Review from lecture 1
        </Link>
      )}
    </div>
  );
}
