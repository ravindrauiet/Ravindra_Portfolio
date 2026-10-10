"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Blend, Box, Code2, Component, LayoutGrid, LayoutTemplate, Search, Waves } from "lucide-react";

const TONES = [
  { id: "all", label: "All" },
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
];

const CATEGORY_ICONS = {
  all: LayoutGrid,
  scenes: Box,
  gradients: Blend,
  backgrounds: Waves,
  sections: LayoutTemplate,
  components: Component,
};

// items: [{ slug, name, category, categoryLabel, tone, tags, background?, doc? }]
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

  const tabs = [{ id: "all", label: "All templates" }, ...categories];

  return (
    <div className="lib-gallery">
      <div className="pl-filter">
        <div className="pl-search">
          <Search size={20} strokeWidth={2} aria-hidden="true" />
          <label className="pl-search-field">
            <span className="lib-sr-only">Search templates</span>
            <input
              type="search"
              placeholder="Search templates: cube, pricing, loader, aurora…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <div className="pl-tones" role="toolbar" aria-label="Filter by tone">
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

        <div className="pl-cats" role="toolbar" aria-label="Filter by type">
          {tabs.map((tab) => {
            const Icon = CATEGORY_ICONS[tab.id] ?? LayoutGrid;
            return (
              <button
                key={tab.id}
                type="button"
                className={`pl-cat ${category === tab.id ? "is-active" : ""}`}
                aria-pressed={category === tab.id}
                onClick={() => setCategory(tab.id)}
              >
                <span className="pl-cat-icon">
                  <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
                </span>
                <strong>{tab.label}</strong>
                <small>{counts[tab.id] || 0} templates</small>
              </button>
            );
          })}
        </div>
      </div>

      <p className="lib-count pl-count" aria-live="polite">
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
        <div className="lib-grid pl-grid">
          {visible.map((item) => (
            <article key={item.slug} className="pl-card">
              <div className="pl-card-media">
                <div className="pl-win-bar" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                  <span>{item.slug}</span>
                </div>
                <div className={`lib-thumb lib-thumb-${item.category} pl-live`}>
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
                  <span className="pl-card-view" aria-hidden="true">
                    Open template <ArrowUpRight size={15} strokeWidth={2.2} />
                  </span>
                </div>
              </div>
              <div className="pl-card-body">
                <span className="pl-card-industry">{item.categoryLabel}</span>
                <h3>
                  <Link href={`/templates/${item.slug}`} className="pl-card-link">
                    {item.name}
                  </Link>
                </h3>
                <ul className="pl-card-chips">
                  {item.tags.slice(0, 3).map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
                <div className="pl-card-foot">
                  <span className="pl-card-note">
                    <Code2 size={15} strokeWidth={2} aria-hidden="true" /> Code + AI prompt
                  </span>
                  <span className={`lib-tone lib-tone-${item.tone}`}>{item.tone}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
