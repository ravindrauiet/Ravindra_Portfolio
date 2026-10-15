"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUp, Check, CircleCheck, Link2 } from "lucide-react";
import CopyButton from "@/components/library/CopyButton";
import { rememberLecture, useCompleted } from "./progress";

// Sidebar card: course progress plus a mark-complete toggle
export function LectureProgressCard({ stackSlug, lectureSlug, lectureSlugs }) {
  const { completed, toggle } = useCompleted(stackSlug);
  const done = completed.has(lectureSlug);
  const count = lectureSlugs.filter((slug) => completed.has(slug)).length;
  const percent = Math.round((count / lectureSlugs.length) * 100);

  return (
    <div className="lec-progress-card">
      <div className="lec-progress-head">
        <span>Your progress</span>
        <strong>{percent}%</strong>
      </div>
      <div className="lec-progress-bar" aria-hidden="true">
        <i style={{ width: `${percent}%` }} />
      </div>
      <p>
        {count} of {lectureSlugs.length} lectures complete
      </p>
      <button
        type="button"
        className={`lec-done-btn ${done ? "is-done" : ""}`}
        aria-pressed={done}
        onClick={() => toggle(lectureSlug)}
      >
        <Check size={16} strokeWidth={2.6} aria-hidden="true" />
        {done ? "Completed" : "Mark as complete"}
      </button>
    </div>
  );
}

// End of the lecture: completion call to action and share links
export function LectureFinish({ stackSlug, lectureSlug, title, url, nextHref }) {
  const router = useRouter();
  const { completed, toggle } = useCompleted(stackSlug);
  const done = completed.has(lectureSlug);
  const text = encodeURIComponent(`${title} — free notes by Ravindra Nath Jha`);
  const link = encodeURIComponent(url);

  const shares = [
    { label: "WhatsApp", href: `https://wa.me/?text=${text}%20${link}`, icon: "fab fa-whatsapp" },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${link}`, icon: "fab fa-linkedin-in" },
    { label: "X", href: `https://twitter.com/intent/tweet?text=${text}&url=${link}`, icon: "fab fa-x-twitter" },
  ];

  return (
    <div className="lec-finish">
      <div className="lec-finish-main">
        <span className={`lec-finish-icon ${done ? "is-done" : ""}`} aria-hidden="true">
          <CircleCheck size={28} strokeWidth={2} />
        </span>
        <div>
          <h2>{done ? "Lecture complete. Nice work!" : "Finished this lecture?"}</h2>
          <p>
            {done
              ? "Your progress is saved in this browser. Keep the momentum going with the next one."
              : "Mark it complete to track your progress through the course. It is saved in this browser."}
          </p>
        </div>
        {done && nextHref ? (
          <button type="button" className="lec-done-btn is-done" onClick={() => router.push(nextHref)}>
            Next lecture
          </button>
        ) : (
          <button
            type="button"
            className={`lec-done-btn ${done ? "is-done" : ""}`}
            aria-pressed={done}
            onClick={() => toggle(lectureSlug)}
          >
            <Check size={16} strokeWidth={2.6} aria-hidden="true" />
            {done ? "Completed" : "Mark as complete"}
          </button>
        )}
      </div>
      <div className="lec-share">
        <span>Share these notes</span>
        <div>
          {shares.map((share) => (
            <a
              key={share.label}
              href={share.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Share on ${share.label}`}
              className="lec-share-btn"
            >
              <i className={share.icon} aria-hidden="true" />
            </a>
          ))}
          <CopyButton text={url} label="Copy link" copiedLabel="Link copied" className="lec-share-copy" />
        </div>
      </div>
      <span className="lec-share-hint">
        <Link2 size={13} strokeWidth={2} aria-hidden="true" /> Tip: use the ← and → keys to move between lectures.
      </span>
    </div>
  );
}

// Remembers the lecture for "continue where you left off", adds arrow-key
// navigation between lectures and a back-to-top button
export function LectureBehaviour({ stackSlug, lectureSlug, prevHref, nextHref }) {
  const router = useRouter();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    rememberLecture(stackSlug, lectureSlug);
  }, [stackSlug, lectureSlug]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      const target = event.target;
      if (target.closest?.("input, textarea, select, [contenteditable='true'], pre")) return;
      if (event.key === "ArrowLeft" && prevHref) router.push(prevHref);
      if (event.key === "ArrowRight" && nextHref) router.push(nextHref);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, prevHref, nextHref]);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 900);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      className={`lec-top ${showTop ? "is-visible" : ""}`}
      aria-label="Back to top"
      tabIndex={showTop ? 0 : -1}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <ArrowUp size={20} strokeWidth={2.4} aria-hidden="true" />
    </button>
  );
}
