import Link from "next/link";
import { ChevronRight } from "lucide-react";

// Shared layout for About, Contact, Terms and Disclaimer: breadcrumb, title block, readable prose column
export default function InfoPage({ eyebrow, title, intro, updated, children }) {
  return (
    <div className="info-page">
      <div className="info-wrap">
        <nav className="info-crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <ChevronRight size={14} aria-hidden="true" />
          <span aria-current="page">{title}</span>
        </nav>
        <div className="info-head">
          {eyebrow ? <span className="svc-eyebrow">{eyebrow}</span> : null}
          <h1>{title}</h1>
          {intro ? <p className="info-intro">{intro}</p> : null}
          {updated ? <p className="info-updated">Last updated: {updated}</p> : null}
        </div>
        <div className="info-body">{children}</div>
      </div>
    </div>
  );
}
