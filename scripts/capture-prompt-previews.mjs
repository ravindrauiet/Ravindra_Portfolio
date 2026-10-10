// Renders every HTML file in scripts/prompt-previews/ to images used on the /prompts pages.
//
//   node scripts/capture-prompt-previews.mjs            capture all previews
//   node scripts/capture-prompt-previews.mjs saas       capture only files whose name contains "saas"
//
// For each <slug>.html it writes two PNGs to public/assets/images/prompts/:
//   <slug>.png       1280x800   card thumbnail (top of the page)
//   <slug>-full.png  1280x1040  tall preview shown on the prompt's detail page
//
// Needs Microsoft Edge or Google Chrome installed (uses headless mode, no npm packages).
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = join(root, "scripts", "prompt-previews");
const outDir = join(root, "public", "assets", "images", "prompts");

const BROWSERS = [
  process.env.BROWSER_PATH,
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);

const browser = BROWSERS.find((path) => existsSync(path));
if (!browser) {
  console.error("No Edge or Chrome found. Set BROWSER_PATH to the browser executable.");
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });

const filter = process.argv[2];
const files = readdirSync(sourceDir)
  .filter((name) => name.endsWith(".html"))
  .filter((name) => !filter || name.includes(filter))
  .sort();

function capture(url, output, width, height) {
  execFileSync(
    browser,
    [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      "--force-device-scale-factor=1",
      `--window-size=${width},${height}`,
      "--virtual-time-budget=6000", // lets web fonts finish loading
      `--screenshot=${output}`,
      url,
    ],
    { stdio: "ignore" }
  );
}

let failed = 0;
for (const file of files) {
  const slug = file.replace(/\.html$/, "");
  const url = pathToFileURL(join(sourceDir, file)).href;
  try {
    capture(url, join(outDir, `${slug}.png`), 1280, 800);
    capture(url, join(outDir, `${slug}-full.png`), 1280, 1040);
    const kb = (name) => Math.round(statSync(join(outDir, name)).size / 1024);
    console.log(`ok    ${slug}  card ${kb(`${slug}.png`)} KB, full ${kb(`${slug}-full.png`)} KB`);
  } catch (error) {
    failed += 1;
    console.log(`FAIL  ${slug}  ${error.message}`);
  }
}

console.log(`${files.length - failed}/${files.length} previews captured into public/assets/images/prompts/`);
process.exit(failed ? 1 : 0);
