"use client";

import { useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

export default function CopyButton({ text, label = "Copy", copiedLabel = "Copied", className = "" }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for browsers or contexts without the async clipboard API
      const area = document.createElement("textarea");
      area.value = text;
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      className={`lib-copy ${copied ? "is-copied" : ""} ${className}`}
      onClick={handleCopy}
      aria-live="polite"
    >
      {copied ? (
        <Check size={16} strokeWidth={2.25} aria-hidden="true" />
      ) : (
        <Copy size={16} strokeWidth={2} aria-hidden="true" />
      )}
      {copied ? copiedLabel : label}
    </button>
  );
}
