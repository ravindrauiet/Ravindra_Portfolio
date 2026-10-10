"use client";

import { useEffect, useState } from "react";

// Thin bar at the top of the window showing how far through the lecture the reader is
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = null;
    const update = () => {
      frame = null;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? Math.min(1, window.scrollY / total) : 0);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div className="lec-progress" aria-hidden="true">
      <i style={{ transform: `scaleX(${progress})` }} />
    </div>
  );
}

// items: [{ id, label }]
export default function LectureToc({ items }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const headings = items.map((item) => document.getElementById(item.id)).filter(Boolean);
    if (headings.length === 0) return undefined;

    // The active section is the last heading that has scrolled above the upper part of the window
    const update = () => {
      let current = headings[0].id;
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= 160) current = heading.id;
        else break;
      }
      setActive(current);
    };

    let frame = null;
    const schedule = () => {
      if (!frame) {
        frame = requestAnimationFrame(() => {
          frame = null;
          update();
        });
      }
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
    };
  }, [items]);

  return (
    <ol className="lec-toc-list">
      {items.map((item, index) => (
        <li key={item.id} className={active === item.id ? "is-active" : ""}>
          <a href={`#${item.id}`} aria-current={active === item.id ? "location" : undefined}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            {item.label}
          </a>
        </li>
      ))}
    </ol>
  );
}
