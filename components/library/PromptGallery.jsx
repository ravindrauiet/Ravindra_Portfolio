"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import PromptPreview from "./PromptPreview";

// items: [{ slug, name, industry, tone, layout, palette, stack, description, sectionCount }]
export default function PromptGallery({ items, industries }) {
  const [industry, setIndustry] = useState("all");
  const [query, setQuery] = useState("");

  const available = useMemo(
    () => industries.filter((name) => items.some((item) => item.industry === name)),
    [industries, items]
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (industry !== "all" && item.industry !== industry) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.industry.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
    });
  }, [items, industry, query]);

  return (
    <div className="lib-gallery">
      <div className="lib-toolbar">
        <div className="lib-tabs" role="toolbar" aria-label="Filter by industry">
          <button
            type="button"
            className={`lib-tab ${industry === "all" ? "is-active" : ""}`}
            aria-pressed={industry === "all"}
            onClick={() => setIndustry("all")}
          >
            All <span>{items.length}</span>
          </button>
          {available.map((name) => (
            <button
              key={name}
              type="button"
              className={`lib-tab ${industry === name ? "is-active" : ""}`}
              aria-pressed={industry === name}
              onClick={() => setIndustry(name)}
            >
              {name}
            </button>
          ))}
        </div>
        <div className="lib-filters">
          <label className="lib-search">
            <Search size={16} strokeWidth={2} aria-hidden="true" />
            <span className="lib-sr-only">Search prompts</span>
            <input
              type="search"
              placeholder="Search prompts"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
        </div>
      </div>

      <p className="lib-count" aria-live="polite">
        Showing {visible.length} of {items.length} prompts
      </p>

      {visible.length === 0 ? (
        <div className="lib-empty">
          <p>No prompts match that search.</p>
          <button
            type="button"
            onClick={() => {
              setIndustry("all");
              setQuery("");
            }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="lib-grid">
          {visible.map((item) => (
            <Link key={item.slug} href={`/prompts/${item.slug}`} className="lib-card">
              <div className="lib-thumb lib-thumb-prompt">
                <PromptPreview palette={item.palette} layout={item.layout} tone={item.tone} />
              </div>
              <div className="lib-card-body">
                <div className="lib-card-row">
                  <h3>{item.name}</h3>
                  <span className={`lib-tone lib-tone-${item.tone}`}>{item.tone}</span>
                </div>
                <p className="lib-card-desc">{item.description}</p>
                <p className="lib-card-meta">
                  {item.industry} · {item.sectionCount} sections
                  <span className="lib-card-go">
                    View prompt <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
                  </span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
