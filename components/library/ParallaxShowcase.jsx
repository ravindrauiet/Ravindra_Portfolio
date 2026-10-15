import Image from "next/image";
import { ArrowUpRight, Layers3, MousePointer2 } from "lucide-react";
import CopyButton from "./CopyButton";

// demos: PARALLAX_DEMOS from lib/demos.js
export default function ParallaxShowcase({ demos }) {
  const [featured, ...rest] = demos;

  return (
    <div className="pl-section" id="parallax-websites">
      <div className="pl-head">
        <span className="svc-eyebrow">Parallax websites</span>
        <h2>
          Full websites that <span>move in depth</span>
        </h2>
        <p>
          Complete, working websites built around parallax scrolling. Open one, scroll slowly, and watch every layer move at
          its own speed.
        </p>
      </div>

      <div className="pxs-list">
        {[featured].map((demo) => (
          <article key={demo.slug} className="pxs-card">
            <a
              href={demo.href}
              target="_blank"
              rel="noopener noreferrer"
              className="pxs-visual"
              aria-label={`Open the ${demo.name} website in a new tab`}
            >
              <div className="pxs-frame">
                <div className="pl-win-bar" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                  <span>{demo.slug.replace("parallax-", "")}.store</span>
                </div>
                <div className="pxs-shot">
                  <Image
                    src={demo.image}
                    alt={`${demo.name} parallax website preview`}
                    width={1440}
                    height={900}
                    sizes="(max-width: 1100px) 100vw, 55vw"
                  />
                </div>
              </div>
              <span className="pxs-live" aria-hidden="true">
                <i /> Live website
              </span>
              <span className="pxs-open" aria-hidden="true">
                Open website <ArrowUpRight size={16} strokeWidth={2.2} />
              </span>
            </a>

            <div className="pxs-body">
              <span className="pl-card-industry">{demo.category}</span>
              <h3>{demo.name}</h3>
              <p>{demo.description}</p>
              <ul className="pxs-effects">
                {demo.effects.map((effect) => (
                  <li key={effect}>
                    <Layers3 size={15} strokeWidth={2} aria-hidden="true" />
                    {effect}
                  </li>
                ))}
              </ul>
              <div className="pxs-meta">
                <span className="pl-card-palette" aria-label="Colour palette">
                  {demo.palette.map((color) => (
                    <i key={color} style={{ background: color }} />
                  ))}
                </span>
                <span>{demo.stack}</span>
              </div>
              <div className="pxs-actions">
                <a href={demo.href} target="_blank" rel="noopener noreferrer" className="pl-btn pl-btn-primary">
                  Open full website <ArrowUpRight size={17} strokeWidth={2.2} aria-hidden="true" />
                </a>
                <CopyButton text={demo.prompt} label="Copy AI prompt" copiedLabel="Prompt copied" className="pxs-copy" />
              </div>
              <p className="pxs-hint">
                <MousePointer2 size={14} strokeWidth={2} aria-hidden="true" /> Opens in a new tab. Scroll slowly and move your
                mouse over the hero.
              </p>
            </div>
          </article>
        ))}
      </div>

      {rest.length > 0 ? (
        <div className="pxs-grid">
          {rest.map((demo) => (
            <article key={demo.slug} className="pxs-mini">
              <a
                href={demo.href}
                target="_blank"
                rel="noopener noreferrer"
                className="pxs-visual pxs-mini-visual"
                aria-label={`Open the ${demo.name} website in a new tab`}
              >
                <div className="pxs-frame">
                  <div className="pl-win-bar" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                    <span>{demo.slug.replace("parallax-", "")}.site</span>
                  </div>
                  <div className="pxs-shot">
                    <Image
                      src={demo.image}
                      alt={`${demo.name} parallax website preview`}
                      width={1440}
                      height={900}
                      sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                    />
                  </div>
                </div>
                <span className="pxs-open" aria-hidden="true">
                  Open website <ArrowUpRight size={16} strokeWidth={2.2} />
                </span>
              </a>
              <div className="pxs-mini-body">
                <span className="pl-card-industry">{demo.category}</span>
                <h3>{demo.name}</h3>
                <p>{demo.description}</p>
                <ul className="pl-card-chips">
                  {demo.effects.slice(0, 3).map((effect) => (
                    <li key={effect}>{effect}</li>
                  ))}
                </ul>
                <div className="pxs-mini-foot">
                  <a href={demo.href} target="_blank" rel="noopener noreferrer" className="pxs-mini-open">
                    Open website <ArrowUpRight size={15} strokeWidth={2.2} aria-hidden="true" />
                  </a>
                  <CopyButton text={demo.prompt} label="Copy prompt" copiedLabel="Copied" className="pl-card-copy" />
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </div>
  );
}
