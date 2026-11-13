/*
 * Lead popup: appears after 20 seconds of active time on the page and sends the lead to /api/lead,
 * which emails it to the site owner. Used on /templates, /prompts, /prompts/[slug] and every demo in /demos.
 *
 * Polite by design:
 *  - shown at most once per visit, and never again after someone submits it
 *  - after "close" or "maybe later" it stays hidden for 3 days
 *  - only counts time while the tab is visible; skipped on ?preview / ?capture screenshot URLs
 *  - closes with Esc, the close button or a click outside; lives in a Shadow DOM so page CSS can't break it
 */
(() => {
  if (window.__rnjLeadPopup) return;
  window.__rnjLeadPopup = true;

  const KEY = "rnj-lead";
  const qsTest = new URLSearchParams(location.search).has("leadtest"); // for testing: shows after 1.5 s
  const DELAY = qsTest ? 1500 : 20000;
  const SNOOZE = 3 * 24 * 60 * 60 * 1000;
  const qs = new URLSearchParams(location.search);
  if (qs.has("preview") || qs.has("capture") || (navigator.webdriver && !qsTest)) return;

  const read = () => { try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; } };
  const write = (v) => { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch {} };
  const state = read();
  if (qsTest) { try { localStorage.removeItem(KEY); sessionStorage.removeItem(KEY + "-seen"); } catch {} }
  if (!qsTest && state.done) return;
  if (state.snoozed && Date.now() - state.snoozed < SNOOZE) return;
  try { if (sessionStorage.getItem(KEY + "-seen")) return; } catch {}

  const isDemo = location.pathname.startsWith("/demos/");
  const copy = isDemo
    ? { eyebrow: "Like this website?", title: "I'll build one like it for your brand", text: "Leave your name and a way to reach you. I'll get back within 24 hours with ideas and a free quote." }
    : { eyebrow: "Need it built for you?", title: "Get your website or app made by me", text: "Tell me how to reach you and I'll get back within 24 hours with a free consultation and quote." };

  // ---------- count visible time, then open ----------
  let shown = false, elapsed = 0, last = document.visibilityState === "visible" ? Date.now() : 0;
  const tick = () => {
    if (shown) return;
    if (document.visibilityState === "visible") {
      if (last) elapsed += Date.now() - last;
      last = Date.now();
      if (elapsed >= DELAY) { open(); return; }
    } else last = 0;
    setTimeout(tick, 1000);
  };
  document.addEventListener("visibilitychange", () => { last = document.visibilityState === "visible" ? Date.now() : 0; });
  setTimeout(tick, 1000);

  // ---------- UI ----------
  const css = `
    :host { all: initial; }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: Poppins, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; text-transform: none; letter-spacing: 0; }
    .backdrop { position: fixed; inset: 0; z-index: 2147483000; display: grid; place-items: center; padding: 20px; background: rgba(4, 10, 30, .55); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); opacity: 0; transition: opacity .3s ease; }
    .backdrop.in { opacity: 1; }
    .card { position: relative; width: min(440px, 100%); max-height: calc(100vh - 40px); overflow: auto; padding: 30px 28px 24px; border-radius: 22px; background: #fff; color: #0f1630; box-shadow: 0 40px 90px -20px rgba(0, 20, 60, .55); transform: translateY(24px) scale(.97); transition: transform .4s cubic-bezier(.2, .9, .3, 1.2); }
    .backdrop.in .card { transform: none; }
    .close { position: absolute; right: 14px; top: 14px; width: 36px; height: 36px; border-radius: 50%; border: 0; background: #f1f2f8; color: #2b3150; font-size: 20px; line-height: 1; cursor: pointer; display: grid; place-items: center; }
    .close:hover { background: #e4e6f1; }
    .badge { display: inline-flex; align-items: center; gap: 8px; padding: 6px 12px; border-radius: 99px; background: #fff3e6; color: #c25a00; font-size: 12.5px; font-weight: 700; }
    .badge i { width: 7px; height: 7px; border-radius: 50%; background: #ff7b00; box-shadow: 0 0 0 4px rgba(255, 123, 0, .2); }
    h2 { margin-top: 12px; font-size: 23px; line-height: 1.25; font-weight: 800; color: #002057; }
    p.lead { margin-top: 8px; font-size: 14.5px; line-height: 1.6; color: #5b6178; }
    form { display: grid; gap: 12px; margin-top: 18px; }
    label { display: grid; gap: 6px; font-size: 13px; font-weight: 700; color: #2b3150; }
    input, select { width: 100%; padding: 12px 14px; border-radius: 12px; border: 1.5px solid #dfe2ee; background: #fafbfe; font-size: 15px; color: #0f1630; }
    input:focus, select:focus { outline: none; border-color: #2506ad; background: #fff; box-shadow: 0 0 0 3px rgba(37, 6, 173, .12); }
    .hp { position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; }
    .send { margin-top: 4px; padding: 14px 18px; border: 0; border-radius: 99px; background: #2506ad; color: #fff; font-size: 15px; font-weight: 700; cursor: pointer; box-shadow: 0 12px 26px -10px rgba(37, 6, 173, .7); transition: transform .2s, background .2s; }
    .send:hover { background: #1a047e; transform: translateY(-1px); }
    .send[disabled] { opacity: .7; cursor: wait; transform: none; }
    .later { justify-self: center; border: 0; background: none; color: #6b7190; font-size: 13.5px; font-weight: 600; cursor: pointer; text-decoration: underline; text-underline-offset: 3px; }
    .err { min-height: 18px; font-size: 13px; color: #b42318; font-weight: 600; }
    .fine { margin-top: 2px; font-size: 11.5px; line-height: 1.5; color: #8a8fa6; text-align: center; }
    .fine a { color: #2506ad; }
    .done { text-align: center; padding: 10px 0 4px; }
    .tick { width: 64px; height: 64px; margin: 6px auto 12px; border-radius: 50%; display: grid; place-items: center; background: #ecfdf5; color: #059669; font-size: 32px; font-weight: 800; }
    .done h2 { margin-top: 0; }
    @media (max-width: 560px) {
      .backdrop { place-items: end center; padding: 0; }
      .card { width: 100%; border-radius: 22px 22px 0 0; padding: 26px 20px 20px; max-height: 92vh; transform: translateY(100%); }
    }
    @media (prefers-reduced-motion: reduce) { .backdrop, .card { transition: none; } }
  `;

  let host, root, lastFocus;
  function close(snooze = true) {
    if (!host) return;
    if (snooze) write({ ...read(), snoozed: Date.now() });
    const bd = root.querySelector(".backdrop");
    bd.classList.remove("in");
    document.removeEventListener("keydown", onKey, true);
    setTimeout(() => { host.remove(); host = null; lastFocus?.focus?.(); }, 300);
  }
  function onKey(e) {
    if (e.key === "Escape") { e.stopPropagation(); close(); }
    if (e.key === "Tab") {
      const f = [...root.querySelectorAll("button, input, select, a")].filter((el) => !el.disabled && el.offsetParent !== null && !el.classList.contains("hp"));
      if (!f.length) return;
      const first = f[0], lastEl = f[f.length - 1], active = root.activeElement;
      if (e.shiftKey && active === first) { e.preventDefault(); lastEl.focus(); }
      else if (!e.shiftKey && active === lastEl) { e.preventDefault(); first.focus(); }
    }
  }

  function open() {
    shown = true;
    try { sessionStorage.setItem(KEY + "-seen", "1"); } catch {}
    lastFocus = document.activeElement;
    host = document.createElement("div");
    host.setAttribute("data-lead-popup", "");
    root = host.attachShadow({ mode: "open" });
    root.innerHTML = `<style>${css}</style>
      <div class="backdrop" part="backdrop">
        <div class="card" role="dialog" aria-modal="true" aria-labelledby="lp-title" aria-describedby="lp-text">
          <button class="close" type="button" aria-label="Close">×</button>
          <div class="body">
            <span class="badge"><i></i>${copy.eyebrow}</span>
            <h2 id="lp-title">${copy.title}</h2>
            <p class="lead" id="lp-text">${copy.text}</p>
            <form novalidate>
              <label>Your name<input name="name" autocomplete="name" maxlength="80" placeholder="e.g. Priya Sharma" required /></label>
              <label>Email or WhatsApp number<input name="contact" autocomplete="email" maxlength="120" placeholder="you@example.com or 98xxx xxxxx" required /></label>
              <label>What do you need? <select name="interest">
                <option value="">Choose one (optional)</option>
                <option>A website like this one</option>
                <option>A full website or web app</option>
                <option>A mobile app</option>
                <option>An AI feature or chatbot</option>
                <option>Just exploring</option>
              </select></label>
              <input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" />
              <p class="err" role="alert"></p>
              <button class="send" type="submit">Get my free quote</button>
              <button class="later" type="button">Maybe later</button>
              <p class="fine">I'll only use this to reply to you. No spam, no sharing. <a href="/privacy-policy" target="_blank" rel="noopener">Privacy policy</a></p>
            </form>
          </div>
        </div>
      </div>`;
    document.body.appendChild(host);

    const bd = root.querySelector(".backdrop");
    requestAnimationFrame(() => bd.classList.add("in"));
    root.querySelector(".close").addEventListener("click", () => close());
    root.querySelector(".later").addEventListener("click", () => close());
    bd.addEventListener("mousedown", (e) => { if (e.target === bd) close(); });
    document.addEventListener("keydown", onKey, true);
    setTimeout(() => root.querySelector('input[name="name"]').focus({ preventScroll: true }), 350);

    const form = root.querySelector("form"), err = root.querySelector(".err"), btn = root.querySelector(".send");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      const name = (data.name || "").trim(), contact = (data.contact || "").trim();
      const digits = contact.replace(/\D/g, "");
      const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contact), okPhone = !okEmail && digits.length >= 10 && digits.length <= 15;
      if (name.length < 2) { err.textContent = "Please enter your name."; return; }
      if (!okEmail && !okPhone) { err.textContent = "Please enter a valid email or a 10-digit phone number."; return; }
      err.textContent = ""; btn.disabled = true; btn.textContent = "Sending…";
      try {
        const res = await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, page: location.href, title: document.title }) });
        const out = await res.json().catch(() => ({}));
        if (!res.ok || !out.success) throw new Error(out.error || "Something went wrong. Please try again.");
        write({ done: Date.now() });
        root.querySelector(".body").innerHTML = `<div class="done"><div class="tick">✓</div><h2>Thank you, ${name.split(" ")[0].replace(/[<>&"]/g, "")}!</h2><p class="lead">I've got your details and will reach out within 24 hours.</p><button class="send" type="button" style="margin-top:18px;width:100%">Back to the page</button></div>`;
        root.querySelector(".done .send").addEventListener("click", () => close(false));
        root.querySelector(".done .send").focus();
      } catch (ex) {
        err.textContent = ex.message; btn.disabled = false; btn.textContent = "Get my free quote";
      }
    });
  }
})();
