"use client";

import { useState } from "react";
import CopyButton from "./CopyButton";

// files: [{ id, label, code }]
export default function CodeTabs({ files }) {
  const [activeId, setActiveId] = useState(files[0].id);
  const active = files.find((file) => file.id === activeId) ?? files[0];

  return (
    <div className="lib-code">
      <div className="lib-code-bar">
        <div className="lib-code-tabs" role="tablist" aria-label="Code files">
          {files.map((file) => (
            <button
              key={file.id}
              type="button"
              role="tab"
              aria-selected={file.id === active.id}
              className={`lib-code-tab ${file.id === active.id ? "is-active" : ""}`}
              onClick={() => setActiveId(file.id)}
            >
              {file.label}
            </button>
          ))}
        </div>
        <CopyButton text={active.code} label={`Copy ${active.label}`} className="lib-copy-dark" />
      </div>
      <pre className="lib-code-pre" tabIndex={0}>
        <code>{active.code}</code>
      </pre>
    </div>
  );
}
