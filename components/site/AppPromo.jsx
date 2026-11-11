import Image from "next/image";
import { ArrowUpRight, Check, Globe, Sparkles } from "lucide-react";

const PLAY_ID = "com.cosmicguide.vedicastro";
const WEB_URL = "https://cosmicguide.ravindranathjha.in/";

// The Play Store reads utm values from `referrer`, so installs from each page show up in the Play Console
const playUrl = (source) =>
  `https://play.google.com/store/apps/details?id=${PLAY_ID}&referrer=${encodeURIComponent(
    `utm_source=ravindranathjha.in&utm_medium=website&utm_campaign=${source}`,
  )}`;
const webUrl = (source) =>
  `${WEB_URL}?utm_source=ravindranathjha.in&utm_medium=website&utm_campaign=${source}#/home`;

const FEATURES = [
  "Free Kundli & AI astrologer",
  "36-guna Gun Milan in seconds",
  "Daily, weekly & monthly forecast",
  "Panchang, Muhurat & temple trips",
];

const SCREENS = [
  { src: "ask-ai", alt: "CosmicGuide AI astrologer chat screen", className: "cgp-phone-l" },
  { src: "home", alt: "CosmicGuide app home screen with Kundli, Panchang and Ask AI", className: "cgp-phone-c" },
  { src: "forecast", alt: "CosmicGuide daily forecast screen with a score out of 100", className: "cgp-phone-r" },
];

function PlayMark() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path fill="#00d7fe" d="M3.6 2.3 13.8 12 3.6 21.7a1.6 1.6 0 0 1-.6-1.3V3.6c0-.5.2-1 .6-1.3Z" />
      <path fill="#ffce00" d="m17.2 15.4-3.4-3.4 3.4-3.4 4 2.3c1.1.6 1.1 1.7 0 2.3l-4 2.2Z" />
      <path fill="#ff3a44" d="M17.2 15.4 13.8 12 3.6 21.7c.4.4 1 .4 1.7.1l11.9-6.4Z" />
      <path fill="#00f076" d="M17.2 8.6 5.3 2.2c-.7-.4-1.3-.3-1.7.1L13.8 12l3.4-3.4Z" />
    </svg>
  );
}

/** Inline, non-blocking promo for the author's CosmicGuide app. `source` tags the clicks per page. */
export default function AppPromo({ source = "site" }) {
  return (
    <aside className="cgp" aria-labelledby={`cgp-title-${source}`}>
      <div className="cgp-copy">
        <span className="cgp-eyebrow">
          <Sparkles size={14} strokeWidth={2.2} aria-hidden="true" />
          From the author · Free app
        </span>
        <h2 id={`cgp-title-${source}`}>
          CosmicGuide: <span>AI Vedic astrology</span> in your pocket
        </h2>
        <p>
          I built CosmicGuide, an app that puts your Kundli, an AI astrologer you can ask anything, Gun Milan, Panchang
          and a daily forecast written for your own chart in one place.
        </p>
        <ul className="cgp-features">
          {FEATURES.map((feature) => (
            <li key={feature}>
              <Check size={15} strokeWidth={2.6} aria-hidden="true" />
              {feature}
            </li>
          ))}
        </ul>
        <div className="cgp-actions">
          <a className="cgp-play" href={playUrl(source)} target="_blank" rel="noopener">
            <PlayMark />
            <span>
              <small>Get it free on</small>
              Google Play
            </span>
          </a>
          <a className="cgp-web" href={webUrl(source)} target="_blank" rel="noopener">
            <Globe size={16} strokeWidth={2} aria-hidden="true" />
            Or use it in your browser
            <ArrowUpRight size={15} strokeWidth={2} aria-hidden="true" />
          </a>
        </div>
      </div>

      <a className="cgp-stage" href={playUrl(source)} target="_blank" rel="noopener" tabIndex={-1} aria-hidden="true">
        {SCREENS.map((screen) => (
          <span key={screen.src} className={`cgp-phone ${screen.className}`}>
            <Image
              src={`/assets/images/cosmicguide/${screen.src}.jpg`}
              alt={screen.alt}
              width={440}
              height={901}
              sizes="(max-width: 700px) 30vw, 200px"
            />
          </span>
        ))}
      </a>
    </aside>
  );
}
