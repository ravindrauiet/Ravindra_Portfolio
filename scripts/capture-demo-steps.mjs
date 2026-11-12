// For prompts that have a live demo (the `demo` field), replaces the generic step mockups with real
// screenshots of the matching section of that demo. Run it AFTER capture-step-previews.mjs, with the
// site running locally (npx next start -p 3100):
//
//   node scripts/capture-demo-steps.mjs [baseUrl]
//
// Writes public/assets/images/prompts/steps/<slug>-<step>.webp and updates lib/prompts/stepImages.json.
import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "assets", "images", "prompts", "steps");
const manifestPath = join(root, "lib", "prompts", "stepImages.json");
const BASE = process.argv[2] || "http://localhost:3100";
const W = 1440, H = 900, SCALE = 0.625; // saved images are 900px wide

// step number → [selector or "top", extra scroll in px, crop height in px (default full viewport)]
// A step mapped to null loses its image (used for steps with no matching section).
const SHOTS = {
  "wedding-day-website-prompt": {
    demo: "/demos/parallax-shaadi/index.html",
    steps: { 2: ["top", 0, 300], 3: ["top", 0], 4: ["#intro", 40], 5: ["#baraat", 700], 6: ["#pheras", 1500], 7: ["#rituals", 0], 8: ["#travel", 0], 9: [".band", 0], 10: ["#rsvp", 40], 11: ["footer", 0], 13: null },
  },
  "haldi-ceremony-website-prompt": {
    demo: "/demos/parallax-haldi/index.html",
    steps: { 2: ["top", 0, 300], 3: ["top", 0], 4: ["#intro", 40], 5: ["#ubtan", 1200], 6: ["#splash", 150], 7: ["#schedule", 200], 8: ["#dress", 0], 9: ["#games", 0], 10: ["#rsvp", 40], 11: ["footer", 0], 13: null },
  },
  "sangeet-night-website-prompt": {
    demo: "/demos/parallax-sangeet/index.html",
    steps: { 2: ["top", 0, 300], 3: ["top", 0], 4: ["#intro", 40], 5: ["#lineup", 700], 6: ["#beat", 1000], 7: ["#mehendi", 40], 8: ["#requests", 0], 9: ["#night", 0], 10: ["#rsvp", 40], 11: ["footer", 0], 13: null },
  },
};

const browser = [
  process.env.BROWSER_PATH,
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
].filter(Boolean).find((p) => existsSync(p));
if (!browser) { console.error("No Edge or Chrome found. Set BROWSER_PATH."); process.exit(1); }

const profile = mkdtempSync(join(tmpdir(), "demo-steps-"));
const port = 9700 + Math.floor(Math.random() * 200);
const proc = spawn(browser, ["--headless=new", "--disable-gpu", "--hide-scrollbars", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "about:blank"], { stdio: "ignore" });
let target;
for (let i = 0; i < 60 && !target; i++) {
  await new Promise((r) => setTimeout(r, 200));
  try { target = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === "page"); } catch {}
}
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
let id = 0; const pending = new Map();
ws.addEventListener("message", (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); } });
const send = (method, params = {}) => new Promise((r) => { pending.set(++id, r); ws.send(JSON.stringify({ id, method, params })); });
const ev = async (expression) => (await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true })).result?.value;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

await send("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: 1, mobile: false });
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

for (const [slug, { demo, steps }] of Object.entries(SHOTS)) {
  await send("Page.navigate", { url: `${BASE}${demo}?capture&preview` });
  await wait(4500);
  await ev("document.fonts.ready.then(() => true)");
  manifest[slug] ||= {};
  for (const [step, spec] of Object.entries(steps)) {
    const file = join(outDir, `${slug}-${step}.webp`);
    if (spec === null) { delete manifest[slug][step]; rmSync(file, { force: true }); continue; }
    const [sel, extra, crop = H] = spec;
    const y = sel === "top" ? 0 : await ev(`(document.querySelector(${JSON.stringify(sel)})?.getBoundingClientRect().top || 0) + scrollY + ${extra}`);
    await ev(`window.scrollTo(0, ${Math.max(0, y)})`);
    await wait(1100);
    const top = await ev("scrollY"); // clip coordinates are page coordinates
    const shot = await send("Page.captureScreenshot", { format: "webp", quality: 80, clip: { x: 0, y: top, width: W, height: crop, scale: SCALE } });
    writeFileSync(file, Buffer.from(shot.data, "base64"));
    manifest[slug][step] = [Math.round(W * SCALE), Math.round(crop * SCALE)];
  }
  console.log("ok", slug);
}

writeFileSync(manifestPath, JSON.stringify(manifest, null, 0).replace(/\},"/g, '},\n"') + "\n");
ws.close(); proc.kill();
setTimeout(() => rmSync(profile, { recursive: true, force: true }), 1500);
