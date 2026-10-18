import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | FITKEY - Gym & Fitness Pass (com.fitkey.fitkey_user)",
  description:
    "Official Privacy Policy and Google Play Data Safety disclosure for FITKEY - Gym & Fitness Pass mobile application (com.fitkey.fitkey_user).",
  alternates: {
    canonical: "https://www.ravindranathjha.in/privacy-policy/fitkey",
  },
};

export default function FitKeyPrivacyPolicy() {
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        padding: "10rem 1.5rem 5rem 1.5rem",
        textTransform: "none",
      }}
    >
      <div
        style={{
          maxWidth: "920px",
          margin: "0 auto",
          background: "#ffffff",
          borderRadius: "16px",
          padding: "3.5rem 3rem",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.06)",
          border: "1px solid #e2e8f0",
          textTransform: "none",
        }}
      >
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: "2rem", textTransform: "none" }}>
          <Link
            href="/privacy-policy"
            style={{
              color: "#2506ad",
              fontSize: "1.4rem",
              fontWeight: 600,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            ← Back to Privacy Center
          </Link>
        </div>

        {/* Header */}
        <header
          style={{
            borderBottom: "2px solid #e2e8f0",
            paddingBottom: "2rem",
            marginBottom: "2.5rem",
            textTransform: "none",
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: "#ffedd5",
              color: "#c2410c",
              fontSize: "1.2rem",
              fontWeight: 700,
              padding: "0.4rem 1rem",
              borderRadius: "9999px",
              marginBottom: "1rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Health &amp; Fitness Application
          </div>
          <h1
            style={{
              fontSize: "3.2rem",
              fontWeight: 800,
              color: "#0f172a",
              lineHeight: 1.2,
              marginBottom: "1.2rem",
              textTransform: "none",
            }}
          >
            Privacy Policy for FITKEY
          </h1>
          <p
            style={{
              fontSize: "1.6rem",
              color: "#64748b",
              lineHeight: 1.6,
              marginBottom: "1.5rem",
              textTransform: "none",
            }}
          >
            <strong>FITKEY - Gym &amp; Fitness Pass</strong> is dedicated to protecting your personal information, workout history, and attendance records.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1.5rem",
              fontSize: "1.3rem",
              color: "#64748b",
              textTransform: "none",
            }}
          >
            <div>
              <strong style={{ color: "#334155" }}>Package Name:</strong>{" "}
              <code
                style={{
                  background: "#f1f5f9",
                  padding: "0.2rem 0.6rem",
                  borderRadius: "4px",
                  color: "#0f172a",
                  fontFamily: "monospace",
                }}
              >
                com.fitkey.fitkey_user
              </code>
            </div>
            <div>
              <strong style={{ color: "#334155" }}>Effective Date:</strong> October 18, 2026
            </div>
            <div>
              <strong style={{ color: "#334155" }}>Contact:</strong> support@fitkey.in
            </div>
          </div>
        </header>

        {/* Content Body */}
        <article
          style={{
            color: "#334155",
            fontSize: "1.5rem",
            lineHeight: 1.8,
            textTransform: "none",
          }}
        >
          {/* Quick Notice Card */}
          <div
            style={{
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: "12px",
              padding: "1.8rem 2rem",
              marginBottom: "2.5rem",
              textTransform: "none",
            }}
          >
            <h3 style={{ color: "#166534", fontSize: "1.7rem", fontWeight: 700, margin: "0 0 0.5rem 0" }}>
              Data Safety Commitment
            </h3>
            <p style={{ margin: 0, color: "#14532d", fontSize: "1.4rem" }}>
              • All network traffic is encrypted using <strong>TLS/HTTPS</strong>.<br />
              • We do <strong>not</strong> sell or rent your personal information to third parties or advertisers.<br />
              • Camera access is used <strong>solely</strong> to scan partner venue QR codes for check-in.<br />
              • You can permanently delete your account &amp; data at any time via in-app settings or our{" "}
              <Link href="/privacy-policy/fitkey/delete-account" style={{ color: "#15803d", fontWeight: 700, textDecoration: "underline" }}>
                Account Deletion Portal
              </Link>.
            </p>
          </div>

          {/* Section 1: Introduction */}
          <section style={{ marginBottom: "2.5rem", textTransform: "none" }}>
            <h2 style={{ fontSize: "2rem", color: "#0f172a", fontWeight: 700, marginBottom: "1rem" }}>
              1. Introduction &amp; Scope
            </h2>
            <p style={{ marginBottom: "1rem" }}>
              This Privacy Policy applies to the <strong>FITKEY - Gym &amp; Fitness Pass</strong> mobile application (package ID <code>com.fitkey.fitkey_user</code>) developed by Ravindra Nath Jha and operated under FITKEY (&ldquo;FITKEY&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;). FITKEY provides flexible multi-venue gym and fitness studio access passes, instant QR-based check-in, on-demand workout sessions (FitKey Studio), and attendance tracking across partner gyms, swimming pools, yoga studios, and combat centres.
            </p>
            <p>
              By downloading, creating an account, or using the FITKEY mobile application, you agree to the collection and use of information in accordance with this Privacy Policy.
            </p>
          </section>

          {/* Section 2: Data Collected */}
          <section style={{ marginBottom: "2.5rem", textTransform: "none" }}>
            <h2 style={{ fontSize: "2rem", color: "#0f172a", fontWeight: 700, marginBottom: "1rem" }}>
              2. Data We Collect &amp; Google Play Data Safety
            </h2>
            <p style={{ marginBottom: "1.2rem" }}>
              In compliance with Google Play Developer Program Policies, the table below provides complete transparency on the categories of data collected and their operational purposes:
            </p>

            <div style={{ overflowX: "auto", marginBottom: "1.5rem" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "1.35rem",
                  textAlign: "left",
                  border: "1px solid #e2e8f0",
                }}
              >
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                    <th style={{ padding: "12px 14px", color: "#0f172a" }}>Data Category</th>
                    <th style={{ padding: "12px 14px", color: "#0f172a" }}>Data Type</th>
                    <th style={{ padding: "12px 14px", color: "#0f172a" }}>Collection</th>
                    <th style={{ padding: "12px 14px", color: "#0f172a" }}>Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <td style={{ padding: "12px 14px", fontWeight: 600 }}>Personal Info</td>
                    <td style={{ padding: "12px 14px" }}>Phone Number</td>
                    <td style={{ padding: "12px 14px" }}>Required</td>
                    <td style={{ padding: "12px 14px" }}>Secure OTP authentication &amp; account management</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid #e2e8f0", background: "#fafafa" }}>
                    <td style={{ padding: "12px 14px", fontWeight: 600 }}>Personal Info</td>
                    <td style={{ padding: "12px 14px" }}>Full Name</td>
                    <td style={{ padding: "12px 14px" }}>Required</td>
                    <td style={{ padding: "12px 14px" }}>User identification at partner gym check-ins</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <td style={{ padding: "12px 14px", fontWeight: 600 }}>Personal Info</td>
                    <td style={{ padding: "12px 14px" }}>User ID</td>
                    <td style={{ padding: "12px 14px" }}>Required</td>
                    <td style={{ padding: "12px 14px" }}>Account management, membership validation &amp; security</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid #e2e8f0", background: "#fafafa" }}>
                    <td style={{ padding: "12px 14px", fontWeight: 600 }}>Health &amp; Fitness</td>
                    <td style={{ padding: "12px 14px" }}>Check-ins &amp; Attendance Logs</td>
                    <td style={{ padding: "12px 14px" }}>Collected</td>
                    <td style={{ padding: "12px 14px" }}>QR pass validation, membership count &amp; workout history</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <td style={{ padding: "12px 14px", fontWeight: 600 }}>Photos &amp; Videos</td>
                    <td style={{ padding: "12px 14px" }}>Profile Photo</td>
                    <td style={{ padding: "12px 14px" }}>Optional</td>
                    <td style={{ padding: "12px 14px" }}>In-app profile avatar customization</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "12px 14px", fontWeight: 600 }}>Diagnostics</td>
                    <td style={{ padding: "12px 14px" }}>Crash Logs &amp; Metrics</td>
                    <td style={{ padding: "12px 14px" }}>Optional</td>
                    <td style={{ padding: "12px 14px" }}>App performance diagnostics and bug fixing</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: "1.35rem", color: "#64748b" }}>
              * We do <strong>not</strong> share your personal info, attendance records, or health logs with third-party advertisers or external data brokers.
            </p>
          </section>

          {/* Section 3: Device Permissions */}
          <section style={{ marginBottom: "2.5rem", textTransform: "none" }}>
            <h2 style={{ fontSize: "2rem", color: "#0f172a", fontWeight: 700, marginBottom: "1rem" }}>
              3. Device Permissions &amp; Hardware Usage
            </h2>
            <ul style={{ paddingLeft: "2.5rem", marginBottom: "1rem" }}>
              <li style={{ marginBottom: "1rem" }}>
                <strong>Camera Permission (<code>android.permission.CAMERA</code>):</strong><br />
                FITKEY requests camera access strictly for the in-app QR scanner to check you in when arriving at a partnered gym, pool, or fitness studio. We do <strong>not</strong> record videos, capture continuous photos, or access your camera background streams.
              </li>
              <li style={{ marginBottom: "1rem" }}>
                <strong>Internet Access (<code>android.permission.INTERNET</code>):</strong><br />
                Used to communicate securely with our cloud servers to verify active memberships, load venue directories, stream on-demand workout videos, and log your attendance.
              </li>
              <li>
                <strong>Storage / Media (Optional):</strong><br />
                Used solely if you choose to select and upload a profile picture from your gallery.
              </li>
            </ul>
          </section>

          {/* Section 4: Payments */}
          <section style={{ marginBottom: "2.5rem", textTransform: "none" }}>
            <h2 style={{ fontSize: "2rem", color: "#0f172a", fontWeight: 700, marginBottom: "1rem" }}>
              4. In-App Payments &amp; Membership Purchases
            </h2>
            <p style={{ marginBottom: "1rem" }}>
              The FITKEY application is free to download. Users purchase fitness passes, single-day venue visits, or monthly/annual memberships inside the app.
            </p>
            <p>
              All financial transactions are processed securely through certified, PCI-DSS compliant third-party payment gateways (e.g., Razorpay / Stripe / Google Play In-App Billing). <strong>FITKEY never stores or has access to your full debit/credit card numbers, CVVs, or net banking passwords.</strong>
            </p>
          </section>

          {/* Section 5: Health & Fitness Disclaimer */}
          <section style={{ marginBottom: "2.5rem", textTransform: "none" }}>
            <h2 style={{ fontSize: "2rem", color: "#0f172a", fontWeight: 700, marginBottom: "1rem" }}>
              5. Health &amp; Medical Disclaimer
            </h2>
            <p style={{ marginBottom: "1rem" }}>
              FITKEY provides fitness studio access and tracking tools. FITKEY is <strong>not</strong> a medical provider, and our content (including FitKey Studio on-demand workouts) does not constitute medical diagnosis, treatment, or clinical advice.
            </p>
            <p>
              Always consult with a licensed physician or healthcare professional before beginning any new exercise regimen, strength routine, or physical activity, especially if you have pre-existing medical conditions or physical limitations.
            </p>
          </section>

          {/* Section 6: Data Deletion & Account Erasure */}
          <section
            id="delete-account"
            style={{
              marginBottom: "2.5rem",
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              borderRadius: "14px",
              padding: "2.5rem 2rem",
              textTransform: "none",
            }}
          >
            <h2 style={{ fontSize: "2.2rem", color: "#1e3a8a", fontWeight: 700, marginBottom: "1rem" }}>
              6. Account Deletion &amp; Data Erasure (Google Play Requirement)
            </h2>
            <p style={{ marginBottom: "1.2rem" }}>
              In full compliance with Google Play&apos;s Account Deletion Policy, FITKEY provides a direct and effortless pathway for all users to permanently delete their account and associated personal data, both inside the app and via the web without needing to reinstall the app.
            </p>

            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
                padding: "1.5rem",
                marginBottom: "1.5rem",
                fontSize: "1.4rem",
              }}
            >
              <h4 style={{ color: "#0f172a", marginBottom: "0.8rem", fontWeight: 700, fontSize: "1.5rem" }}>
                What happens when you request deletion:
              </h4>
              <ul style={{ paddingLeft: "2rem", margin: 0 }}>
                <li style={{ marginBottom: "0.5rem" }}>
                  <strong>Permanently Erased:</strong> Your profile details, registered phone number, full name, profile picture, QR check-in history, attendance records, and active login sessions.
                </li>
                <li style={{ marginBottom: "0.5rem" }}>
                  <strong>Retention for Legal/Tax Compliance:</strong> Past payment transaction invoices may be retained securely for statutory accounting and tax compliance as mandated by law.
                </li>
                <li>
                  <strong>Timeframe:</strong> Account deletion requests are permanently executed within <strong>30 days</strong>.
                </li>
              </ul>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "1.2rem" }}>
              <Link
                href="/privacy-policy/fitkey/delete-account"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.8rem",
                  background: "#dc2626",
                  color: "#ffffff",
                  padding: "1.2rem 2.2rem",
                  borderRadius: "8px",
                  fontWeight: 700,
                  fontSize: "1.5rem",
                  textDecoration: "none",
                  boxShadow: "0 4px 12px rgba(220, 38, 38, 0.25)",
                }}
              >
                <span>🗑️</span> Open Web Account Deletion Portal →
              </Link>
            </div>

            <p style={{ margin: 0, fontSize: "1.35rem", color: "#475569" }}>
              You may also delete your account inside the mobile app by navigating to <strong>Profile &gt; Settings &gt; Delete Account</strong>, or by emailing{" "}
              <a href="mailto:support@fitkey.in?subject=FITKEY%20Account%20Deletion%20Request" style={{ color: "#2506ad", fontWeight: 700 }}>
                support@fitkey.in
              </a>.
            </p>
          </section>

          {/* Section 7: Security */}
          <section style={{ marginBottom: "2.5rem", textTransform: "none" }}>
            <h2 style={{ fontSize: "2rem", color: "#0f172a", fontWeight: 700, marginBottom: "1rem" }}>
              7. Data Security
            </h2>
            <p>
              We implement industry-standard security safeguards to protect your personal data against unauthorized access, loss, or alteration. All client-server communications are protected by TLS 1.3 encryption. Internal access to user databases is restricted to authorized operations personnel on a need-to-know basis.
            </p>
          </section>

          {/* Section 8: Children's Privacy */}
          <section style={{ marginBottom: "2.5rem", textTransform: "none" }}>
            <h2 style={{ fontSize: "2rem", color: "#0f172a", fontWeight: 700, marginBottom: "1rem" }}>
              8. Children&apos;s Privacy
            </h2>
            <p>
              FITKEY is intended for individuals aged 18 and older (and teenagers aged 13–17 with parental consent where permitted by gym venue rules). We do not knowingly collect personal identifiable information from children under the age of 13. If you believe a child has provided us with personal information, please contact us immediately for deletion.
            </p>
          </section>

          {/* Section 9: Contact */}
          <section
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "14px",
              padding: "2.2rem",
              textTransform: "none",
            }}
          >
            <h2 style={{ fontSize: "2rem", color: "#0f172a", fontWeight: 700, marginBottom: "1rem" }}>
              9. Contact Details &amp; Developer Information
            </h2>
            <p style={{ marginBottom: "1.2rem" }}>
              For questions regarding this policy, venue partnerships, or your personal data rights:
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "1.2rem",
                fontSize: "1.4rem",
              }}
            >
              <div>
                <strong style={{ color: "#64748b" }}>App Name:</strong>
                <div style={{ color: "#0f172a", fontWeight: 600 }}>FITKEY - Gym &amp; Fitness Pass</div>
              </div>
              <div>
                <strong style={{ color: "#64748b" }}>Support Email:</strong>
                <div>
                  <a href="mailto:support@fitkey.in" style={{ color: "#2506ad", fontWeight: 700 }}>
                    support@fitkey.in
                  </a>
                </div>
              </div>
              <div>
                <strong style={{ color: "#64748b" }}>Developer Contact:</strong>
                <div>
                  <a href="mailto:ravindranathjha76@gmail.com" style={{ color: "#2506ad", fontWeight: 700 }}>
                    ravindranathjha76@gmail.com
                  </a>
                </div>
              </div>
              <div>
                <strong style={{ color: "#64748b" }}>Official Website:</strong>
                <div>
                  <a href="https://fitkey.in" target="_blank" rel="noopener noreferrer" style={{ color: "#2506ad", fontWeight: 700 }}>
                    https://fitkey.in
                  </a>
                </div>
              </div>
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}
