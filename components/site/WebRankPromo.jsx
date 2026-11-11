import { ArrowUpRight, Gauge } from "lucide-react";

const url = (source) =>
  `https://mywebrank.tech/?utm_source=ravindranathjha.in&utm_medium=website&utm_campaign=${source}`;

const POINTS = ["Score out of 100", "Top 3 fixes", "Google + ChatGPT visibility", "No sign-up"];

/** Small card promoting MyWebRank, a free SEO / AEO / GEO website checker. */
export default function WebRankPromo({ source = "site" }) {
  return (
    <aside className="wrp" aria-label="MyWebRank free website checker">
      <span className="wrp-icon">
        <Gauge size={26} strokeWidth={1.9} aria-hidden="true" />
      </span>
      <div className="wrp-body">
        <span className="wrp-eyebrow">Built your website? Check it next</span>
        <h3>Is your site showing up on Google and in ChatGPT answers?</h3>
        <p>
          MyWebRank is a free SEO, AEO and GEO checker. Enter your URL and get one score with the three fixes that
          will move it most.
        </p>
        <ul>
          {POINTS.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </div>
      <a className="wrp-btn" href={url(source)} target="_blank" rel="noopener">
        Check my website free
        <ArrowUpRight size={17} strokeWidth={2.2} aria-hidden="true" />
      </a>
    </aside>
  );
}
