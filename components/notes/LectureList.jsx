"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, ListChecks, Search } from "lucide-react";

const LEVELS = ["Beginner", "Intermediate", "Advanced"];

// "Beginner to Intermediate" -> "beginner" (used for the coloured level dot)
const levelKey = (difficulty) => difficulty.split(" ")[0].toLowerCase();

// lectures: [{ slug, number, topic, module, summary, readTime, difficulty, sectionCount }]
export default function LectureList({ stackSlug, lectures }) {
  const [level, setLevel] = useState("all");
  const [query, setQuery] = useState("");

  const levels = useMemo(
    () =>
      LEVELS.map((name) => ({
        name,
        count: lectures.filter((lecture) => lecture.difficulty.includes(name)).length,
      })).filter((entry) => entry.count > 0),
    [lectures]
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return lectures.filter((lecture) => {
      if (level !== "all" && !lecture.difficulty.includes(level)) return false;
      if (!q) return true;
      return lecture.topic.toLowerCase().includes(q) || lecture.summary.toLowerCase().includes(q);
    });
  }, [lectures, level, query]);

  // Keep lectures in order, grouped under their module when the course has modules
  const groups = useMemo(() => {
    const list = [];
    for (const lecture of visible) {
      const last = list[list.length - 1];
      if (last && last.module === lecture.module) last.lectures.push(lecture);
      else list.push({ module: lecture.module, lectures: [lecture] });
    }
    return list;
  }, [visible]);

  return (
    <div className="crs-list">
      <div className="pl-filter">
        <label className="pl-search">
          <Search size={20} strokeWidth={2} aria-hidden="true" />
          <span className="lib-sr-only">Search lectures</span>
          <input
            type="search"
            placeholder="Search lectures by topic"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <span className="pl-search-count" aria-live="polite">
            {visible.length} of {lectures.length}
          </span>
        </label>
        <div className="pl-chips" role="toolbar" aria-label="Filter by level">
          <button
            type="button"
            className={`pl-chip ${level === "all" ? "is-active" : ""}`}
            aria-pressed={level === "all"}
            onClick={() => setLevel("all")}
          >
            All levels <span>{lectures.length}</span>
          </button>
          {levels.map(({ name, count }) => (
            <button
              key={name}
              type="button"
              className={`pl-chip ${level === name ? "is-active" : ""}`}
              aria-pressed={level === name}
              onClick={() => setLevel(name)}
            >
              {name} <span>{count}</span>
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="lib-empty">
          <p>No lectures match that search.</p>
          <button
            type="button"
            onClick={() => {
              setLevel("all");
              setQuery("");
            }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        groups.map((group) => (
          <div key={`${group.module ?? "all"}-${group.lectures[0].slug}`} className="crs-group">
            {group.module ? (
              <div className="crs-module">
                <h3>Module {group.module}</h3>
                <span>
                  {group.lectures.length} {group.lectures.length === 1 ? "lecture" : "lectures"}
                </span>
              </div>
            ) : null}
            <div className="crs-grid">
              {group.lectures.map((lecture) => (
                <article key={lecture.slug} className="crs-card">
                  <span className="crs-num" aria-hidden="true">
                    {String(lecture.number).padStart(2, "0")}
                  </span>
                  <div className="crs-card-body">
                    <span className="crs-card-kicker">Lecture {lecture.number}</span>
                    <h4>
                      <Link href={`/notes/${stackSlug}/${lecture.slug}`} className="crs-card-link">
                        {lecture.topic}
                      </Link>
                    </h4>
                    <p>{lecture.summary}</p>
                    <ul className="crs-card-meta">
                      <li>
                        <Clock size={14} strokeWidth={2} aria-hidden="true" /> {lecture.readTime}
                      </li>
                      <li>
                        <ListChecks size={14} strokeWidth={2} aria-hidden="true" /> {lecture.sectionCount} topics
                      </li>
                      <li>
                        <i className={`crs-dot crs-dot-${levelKey(lecture.difficulty)}`} aria-hidden="true" />
                        {lecture.difficulty}
                      </li>
                    </ul>
                  </div>
                  <span className="crs-card-go" aria-hidden="true">
                    <ArrowRight size={18} strokeWidth={2.2} />
                  </span>
                </article>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
