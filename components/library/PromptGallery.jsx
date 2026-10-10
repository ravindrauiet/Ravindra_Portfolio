"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import CopyButton from "./CopyButton";

// items: [{ slug, name, industry, tone, palette, stack, description, sectionCount, prompt }]
export default function PromptGallery({ items, industries }) {
  const [industry, setIndustry] = useState("all");
  const [query, setQuery] = useState("");

  const available = useMemo(
    () =>
      industries
        .map((name) => ({ name, count: items.filter((item) => item.industry === name).length }))
        .filter((entry) => entry.count > 0),
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
      <div className="pl-filter">
        <label className="pl-search">
          <Search size={20} strokeWidth={2} aria-hidden="true" />
          <span className="lib-sr-only">Search prompts</span>
          <input
            type="search"
            placeholder="Search for a website: portfolio, restaurant, dashboard…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <span className="pl-search-count" aria-live="polite">
            {visible.length} of {items.length}
          </span>
        </label>
        <div className="pl-chips" role="toolbar" aria-label="Filter by industry">
          <button
            type="button"
            className={`pl-chip ${industry === "all" ? "is-active" : ""}`}
            aria-pressed={industry === "all"}
            onClick={() => setIndustry("all")}
          >
            All <span>{items.length}</span>
          </button>
          {available.map(({ name, count }) => (
            <button
              key={name}
              type="button"
              className={`pl-chip ${industry === name ? "is-active" : ""}`}
              aria-pressed={industry === name}
              onClick={() => setIndustry(name)}
            >
              {name} <span>{count}</span>
            </button>
          ))}
        </div>
      </div>

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
        <div className="lib-grid pl-grid">
          {visible.map((item) => (
            <article key={item.slug} className="pl-card">
              <div className="pl-card-media">
                <div className="pl-win-bar" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                  <span>{item.slug.replace(/-prompt$/, "")}.com</span>
                </div>
                <div className="pl-card-shot">
                  <Image
                    src={`/assets/images/prompts/${item.slug}-full.png`}
                    alt={`${item.name} built from this AI prompt`}
                    fill
                    sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                  />
                  <span className="pl-card-view" aria-hidden="true">
                    View prompt <ArrowUpRight size={15} strokeWidth={2.2} />
                  </span>
                </div>
              </div>
              <div className="pl-card-body">
                <span className="pl-card-industry">{item.industry}</span>
                <h3>
                  <Link href={`/prompts/${item.slug}`} className="pl-card-link">
                    {item.name}
                  </Link>
                </h3>
                <p className="pl-card-desc">{item.description}</p>
                <ul className="pl-card-chips">
                  <li>{item.stack}</li>
                  <li>{item.sectionCount} sections</li>
                  <li>{item.tone === "dark" ? "Dark theme" : "Light theme"}</li>
                </ul>
                <div className="pl-card-foot">
                  <span className="pl-card-palette" aria-label="Colour palette">
                    {item.palette.map((color) => (
                      <i key={color} style={{ background: color }} />
                    ))}
                  </span>
                  <CopyButton text={item.prompt} label="Copy prompt" copiedLabel="Copied" className="pl-card-copy" />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
