"use client";

import { useEffect, useState } from "react";
import { Check, ChevronDown, RotateCcw } from "lucide-react";
import Image from "next/image";
import CopyButton from "@/components/library/CopyButton";

// Step-by-step build prompts with per-visitor progress (kept in localStorage, optional).
export default function BuildSteps({ slug, steps }) {
  const storageKey = `build-steps:${slug}`;
  const [done, setDone] = useState([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
      if (Array.isArray(saved)) setDone(saved);
    } catch {
      // storage unavailable: progress simply isn't remembered
    }
  }, [storageKey]);

  function save(next) {
    setDone(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      // ignore
    }
  }

  const toggle = (number) => save(done.includes(number) ? done.filter((n) => n !== number) : [...done, number]);
  const nextStep = steps.find((step) => !done.includes(step.number));
  const percent = Math.round((done.length / steps.length) * 100);

  const allText = steps
    .map((step) => `===== STEP ${step.number} of ${steps.length}: ${step.title} =====\n\n${step.prompt}`)
    .join("\n\n\n");

  const phases = [];
  for (const step of steps) {
    const last = phases[phases.length - 1];
    if (last && last.name === step.phase) last.steps.push(step);
    else phases.push({ name: step.phase, steps: [step] });
  }

  return (
    <div className="bs">
      <div className="bs-bar">
        <div className="bs-progress">
          <div className="bs-progress-text">
            <strong>
              {done.length} of {steps.length} steps done
            </strong>
            <span>{nextStep ? `Next: step ${nextStep.number}, ${nextStep.title}` : "All steps done. Your website is ready to launch."}</span>
          </div>
          <div className="bs-track" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} aria-label="Build progress">
            <span style={{ width: `${percent}%` }} />
          </div>
        </div>
        <div className="bs-bar-actions">
          {done.length > 0 && (
            <button type="button" className="lib-copy" onClick={() => save([])}>
              <RotateCcw size={15} aria-hidden="true" /> Reset
            </button>
          )}
          <CopyButton text={allText} label="Copy all steps" copiedLabel="All steps copied" />
        </div>
      </div>

      {phases.map((phase) => (
        <div key={phase.name} className="bs-phase">
          <h3 className="bs-phase-title">
            {phase.name}
            <span>
              {phase.steps.length} {phase.steps.length === 1 ? "step" : "steps"}
            </span>
          </h3>
          <ol className="bs-list">
            {phase.steps.map((step) => {
              const isDone = done.includes(step.number);
              const isNext = nextStep?.number === step.number;
              return (
                <li key={step.number} className={`bs-step${isDone ? " is-done" : ""}${isNext ? " is-next" : ""}`}>
                  <div className="bs-step-head">
                    <button
                      type="button"
                      className="bs-num"
                      onClick={() => toggle(step.number)}
                      aria-pressed={isDone}
                      aria-label={isDone ? `Mark step ${step.number} as not done` : `Mark step ${step.number} as done`}
                    >
                      {isDone ? <Check size={18} strokeWidth={2.5} aria-hidden="true" /> : step.number}
                    </button>
                    <div className="bs-step-text">
                      <h4>
                        {step.title}
                        {isNext && <span className="bs-next">Up next</span>}
                      </h4>
                      <p>{step.outcome}</p>
                    </div>
                    <div className="bs-step-actions">
                      <CopyButton text={step.prompt} label={`Copy step ${step.number}`} copiedLabel="Copied" />
                    </div>
                  </div>
                  <div className={`bs-body${step.image ? "" : " no-img"}`}>
                    {step.image && (
                      <figure className="bs-shot">
                        <div className="bs-shot-bar" aria-hidden="true">
                          <i />
                          <i />
                          <i />
                          <span>What this step builds</span>
                        </div>
                        <Image
                          src={step.image.src}
                          alt={`Preview of step ${step.number}: ${step.title}`}
                          width={step.image.width}
                          height={step.image.height}
                          sizes="(max-width: 900px) 100vw, 520px"
                        />
                      </figure>
                    )}
                    <div className="bs-side">
                    {step.image && (
                      <div className="bs-hint">
                        <p>
                          Copy step {step.number}, paste it into your AI tool in the same chat, and you will get a result like the
                          preview{step.number === 1 ? "" : ", in your own colours and content"}.
                        </p>
                        <CopyButton text={step.prompt} label="Copy this prompt" copiedLabel="Copied" className="lib-copy-primary" />
                      </div>
                    )}
                    <details className="bs-details" open={step.number === 1}>
                      <summary>
                        <ChevronDown size={16} aria-hidden="true" /> Show the prompt for step {step.number}
                      </summary>
                      <pre tabIndex={0}>{step.prompt}</pre>
                      <div className="bs-details-foot">
                        <button type="button" className="bs-done-btn" onClick={() => toggle(step.number)}>
                          <Check size={15} aria-hidden="true" /> {isDone ? "Done. Undo" : "I've done this step"}
                        </button>
                      </div>
                    </details>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      ))}
    </div>
  );
}
