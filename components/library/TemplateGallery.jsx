"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ArrowUpRight } from "lucide-react";

const TONES = [
  { id: "all", label: "All tones" },
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
];

// items: [{ slug, name, category, categoryLabel, tone, tags, description, background?, doc? }]
export default function TemplateGallery({ items, categories }) {
  const [category, setCategory] = useState("all");
  const [tone, setTone] = useState("all");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const map = { all: items.length };
    for (const item of items) map[item.category] = (map[item.category] || 0) + 1;
    return map;
  }, [items]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (category !== "all" && item.category !== category) return false;
      if (tone !== "all" && item.tone !== tone) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.tags.some((tag) => tag.includes(q)) ||
        item.categoryLabel.toLowerCase().includes(q)
      );
    });
  }, [items, category, tone, query]);

  const tabs = [{ id: "all", label: "All" }, ...categories];

  return (
    <div className="lib-gallery">
      <div className="lib-toolbar">
        <div className="lib-tabs" role="toolbar" aria-label="Filter by type">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`lib-tab ${category === tab.id ? "is-active" : ""}`}
              aria-pressed={category === tab.id}
              onClick={() => setCategory(tab.id)}
            >
              {tab.label} <span>{counts[tab.id] || 0}</span>
            </button>
          ))}
        </div>

        <div className="lib-filters">
          <label className="lib-search">
            <Search size={16} strokeWidth={2} aria-hidden="true" />
            <span className="lib-sr-only">Search templates</span>
            <input
              type="search"
              placeholder="Search templates"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <div className="lib-tones" role="toolbar" aria-label="Filter by tone">
            {TONES.map((option) => (
              <button
                key={option.id}
                type="button"
                className={tone === option.id ? "is-active" : ""}
                aria-pressed={tone === option.id}
                onClick={() => setTone(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="lib-count" aria-live="polite">
        Showing {visible.length} of {items.length} templates
      </p>

      {visible.length === 0 ? (
        <div className="lib-empty">
          <p>No templates match those filters.</p>
          <button
            type="button"
            onClick={() => {
              setCategory("all");
              setTone("all");
              setQuery("");
            }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="lib-grid">
          {visible.map((item) => (
            <Link key={item.slug} href={`/templates/${item.slug}`} className="lib-card">
              <div className={`lib-thumb lib-thumb-${item.category}`}>
                {item.background ? (
                  <div className="lib-thumb-fill" style={{ background: item.background }} />
                ) : (
                  <iframe
                    title={`${item.name} preview`}
                    srcDoc={item.doc}
                    sandbox="allow-scripts"
                    loading="lazy"
                    tabIndex={-1}
                    aria-hidden="true"
                  />
                )}
                <span className="lib-thumb-open" aria-hidden="true">
                  <ArrowUpRight size={18} strokeWidth={2} />
                </span>
              </div>
              <div className="lib-card-body">
                <div className="lib-card-row">
                  <h3>{item.name}</h3>
                  <span className={`lib-tone lib-tone-${item.tone}`}>{item.tone}</span>
                </div>
                <p className="lib-card-meta">{item.categoryLabel} · Code + AI prompt</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
