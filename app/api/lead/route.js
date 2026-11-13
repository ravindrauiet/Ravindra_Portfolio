import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Lead capture from the 20-second popup (public/lead-popup.js) on the templates, prompts and demo pages.
// Sends each lead to the same inbox as the contact form (EMAIL_USER in .env).

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX = { name: 80, contact: 120, interest: 80, page: 300, title: 200 };

// Small in-memory rate limit: at most 5 leads per IP per 10 minutes (resets when the server restarts)
const hits = new Map();
function limited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return list.length > 5;
}

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const clean = (v, max) => String(v ?? "").replace(/[\r\n\t]+/g, " ").trim().slice(0, max);

export async function POST(request) {
  try {
    const ip = (request.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
    if (limited(ip)) {
      return NextResponse.json({ success: false, error: "Too many requests. Please try again in a few minutes." }, { status: 429 });
    }

    const body = await request.json().catch(() => ({}));
    // Honeypot: real people never fill the hidden "website" field
    if (body.website) return NextResponse.json({ success: true });

    const name = clean(body.name, MAX.name);
    const contact = clean(body.contact, MAX.contact);
    const interest = clean(body.interest, MAX.interest);
    const rawPage = clean(body.page, MAX.page);
    const page = /^https?:\/\//i.test(rawPage) ? rawPage : "";
    const title = clean(body.title, MAX.title);

    const digits = contact.replace(/\D/g, "");
    const isEmail = EMAIL_RE.test(contact);
    const isPhone = !isEmail && digits.length >= 10 && digits.length <= 15 && /^[+\d\s()-]+$/.test(contact);

    if (name.length < 2) {
      return NextResponse.json({ success: false, error: "Please enter your name." }, { status: 400 });
    }
    if (!isEmail && !isPhone) {
      return NextResponse.json({ success: false, error: "Please enter a valid email or a 10-digit phone number." }, { status: 400 });
    }

    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;
    if (!user || !pass) {
      console.error("Lead received but EMAIL_USER / EMAIL_PASS are not set:", { name, contact, page });
      return NextResponse.json({ success: false, error: "Sorry, this form is not available right now." }, { status: 503 });
    }

    const transporter = nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
    const when = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" });
    const contactLink = isEmail
      ? `<a href="mailto:${esc(contact)}">${esc(contact)}</a>`
      : `<a href="tel:${esc(digits)}">${esc(contact)}</a> · <a href="https://wa.me/${esc(digits.length === 10 ? "91" + digits : digits)}">WhatsApp</a>`;

    await transporter.sendMail({
      from: `"Website lead" <${user}>`,
      to: user,
      ...(isEmail ? { replyTo: contact } : {}),
      subject: `New lead: ${name}${interest ? ` · ${interest}` : ""}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;padding:22px;border:1px solid #e2e8f0;border-radius:12px;color:#1f2937">
          <h2 style="margin:0 0 16px;color:#2506ad">New lead from your website</h2>
          <p style="margin:6px 0"><strong>Name:</strong> ${esc(name)}</p>
          <p style="margin:6px 0"><strong>${isEmail ? "Email" : "Phone"}:</strong> ${contactLink}</p>
          ${interest ? `<p style="margin:6px 0"><strong>Interested in:</strong> ${esc(interest)}</p>` : ""}
          <hr style="border:0;border-top:1px solid #e2e8f0;margin:16px 0" />
          <p style="margin:6px 0;color:#64748b"><strong>Page:</strong> ${title ? esc(title) + "<br/>" : ""}<a href="${esc(page)}">${esc(page)}</a></p>
          <p style="margin:6px 0;color:#64748b"><strong>Time:</strong> ${esc(when)} IST</p>
        </div>`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lead form error:", error);
    return NextResponse.json({ success: false, error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
