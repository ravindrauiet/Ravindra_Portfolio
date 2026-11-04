"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";

const KIND_LABEL = { lecture: "Lecture", template: "Template", prompt: "Prompt", demo: "Website" };

// index: [{ kind, title, meta, href }]
export default function HubSearch({ index, suggestions }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (words.length === 0) return [];
    return index
      .filter((item) => {
        const text = `${item.title} ${item.meta}`.toLowerCase();
        return words.every((word) => text.includes(word));
      })
      .slice(0, 7);
  }, [index, query]);

  return (
    <div className="hub-search">
      <label className="hub-search-box">
        <Search size={20} strokeWidth={2} aria-hidden="true" />
        <span className="hub-sr">Search notes, templates and prompts</span>
        <input
          type="search"
          placeholder="Search 180+ free lectures, templates and prompts…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-controls="hub-search-results"
        />
      </label>

      {query.trim() ? (
        <ul className="hub-results" id="hub-search-results" aria-live="polite">
          {results.length === 0 ? (
            <li className="hub-results-empty">No matches. Try “react hooks”, “pricing” or “portfolio”.</li>
          ) : (
            results.map((item) => (
              <li key={item.href}>
                <Link href={item.href} {...(item.kind === "demo" ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                  <span className={`hub-kind hub-kind-${item.kind}`}>{KIND_LABEL[item.kind]}</span>
                  <span className="hub-result-title">{item.title}</span>
                  <span className="hub-result-meta">{item.meta}</span>
                  <ArrowUpRight size={15} strokeWidth={2} aria-hidden="true" />
                </Link>
              </li>
            ))
          )}
        </ul>
      ) : (
        <p className="hub-suggest">
          Popular:{" "}
          {suggestions.map((s) => (
            <button key={s} type="button" onClick={() => setQuery(s)}>
              {s}
            </button>
          ))}
        </p>
      )}
    </div>
  );
}
