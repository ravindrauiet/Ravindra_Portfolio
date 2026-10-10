"use client";

import { useState } from "react";
import { Monitor, Smartphone, Tablet, RotateCw } from "lucide-react";

const SIZES = [
  { id: "desktop", label: "Desktop", width: "100%", Icon: Monitor },
  { id: "tablet", label: "Tablet", width: "768px", Icon: Tablet },
  { id: "mobile", label: "Mobile", width: "390px", Icon: Smartphone },
];

// Live preview of a template inside a sandboxed iframe, with device-width switching.
export default function PreviewPanel({ doc, title }) {
  const [size, setSize] = useState("desktop");
  const [reloadKey, setReloadKey] = useState(0);
  const active = SIZES.find((s) => s.id === size);

  return (
    <div className="lib-preview">
      <div className="lib-preview-bar">
        <span className="lib-preview-dots" aria-hidden="true">
          <i /><i /><i />
        </span>
        <div className="lib-preview-sizes" role="group" aria-label="Preview width">
          {SIZES.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              className={size === id ? "is-active" : ""}
              aria-pressed={size === id}
              aria-label={`${label} width`}
              title={label}
              onClick={() => setSize(id)}
            >
              <Icon size={16} strokeWidth={1.9} aria-hidden="true" />
            </button>
          ))}
          <button
            type="button"
            aria-label="Restart preview"
            title="Restart"
            onClick={() => setReloadKey((key) => key + 1)}
          >
            <RotateCw size={16} strokeWidth={1.9} aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="lib-preview-stage">
        <iframe
          key={reloadKey}
          title={`${title} live preview`}
          srcDoc={doc}
          sandbox="allow-scripts"
          loading="lazy"
          style={{ width: active.width }}
        />
      </div>
    </div>
  );
}
