import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | CosmicGuide (com.cosmicguide.vedicastro)",
  description: "Official Privacy Policy for CosmicGuide Vedic Astrology mobile application by Ravindra Nath Jha.",
  alternates: {
    canonical: "https://www.ravindranathjha.in/privacy-policy/cosmic-guide",
  },
};

export default function CosmicGuidePrivacyPolicy() {
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
            ← Back to All Privacy Policies
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
              background: "#ede9fe",
              color: "#6b21a8",
              fontSize: "1.2rem",
              fontWeight: 700,
              padding: "0.4rem 1rem",
              borderRadius: "9999px",
              marginBottom: "1rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Mobile Application Privacy Policy
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
            Privacy Policy for CosmicGuide
          </h1>

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
              <strong style={{ color: "#334155" }}>Application:</strong> CosmicGuide (
              <code
                style={{
                  background: "#f1f5f9",
                  padding: "0.2rem 0.6rem",
                  borderRadius: "4px",
                  color: "#0f172a",
                  fontFamily: "monospace",
                  textTransform: "none",
                }}
              >
                com.cosmicguide.vedicastro
              </code>
              )
            </div>
            <div>
              <strong style={{ color: "#334155" }}>Effective Date:</strong> October 18, 2026
            </div>
            <div>
              <strong style={{ color: "#334155" }}>Last Updated:</strong> October 18, 2026
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
          {/* Section 1 */}
          <section style={{ marginBottom: "2.5rem", textTransform: "none" }}>
            <h2
              style={{
                fontSize: "2rem",
                color: "#1e1b4b",
                fontWeight: 700,
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.8rem",
                textTransform: "none",
              }}
            >
              <span style={{ color: "#4f46e5" }}>1.</span> Introduction
            </h2>
            <p style={{ textTransform: "none", marginBottom: "1rem" }}>
              Welcome to <strong>CosmicGuide</strong>, operated by <strong>Ravindra Nath Jha</strong> (&ldquo;we&rdquo;,
              &ldquo;our&rdquo;, or &ldquo;us&rdquo;). We respect your privacy and are committed to protecting your personal
              information. This Privacy Policy outlines our practices regarding data collection, use, and security for
              users of our mobile application and our website at{" "}
              <a
                href="https://www.ravindranathjha.in"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#2506ad", fontWeight: 600, textDecoration: "underline", textTransform: "none" }}
              >
                https://www.ravindranathjha.in
              </a>
              .
            </p>
          </section>

          {/* Section 2 */}
          <section style={{ marginBottom: "2.5rem", textTransform: "none" }}>
            <h2
              style={{
                fontSize: "2rem",
                color: "#1e1b4b",
                fontWeight: 700,
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.8rem",
                textTransform: "none",
              }}
            >
              <span style={{ color: "#4f46e5" }}>2.</span> Information We Collect
            </h2>
            <p style={{ textTransform: "none", marginBottom: "1rem" }}>
              To provide accurate Vedic astrological insights, birth Kundlis, and daily horoscopes, we may collect:
            </p>
            <ul style={{ paddingLeft: "2.5rem", marginBottom: "1rem", textTransform: "none" }}>
              <li style={{ marginBottom: "0.8rem", textTransform: "none" }}>
                <strong>Astrological Details:</strong> Date of birth, exact time of birth, and place of birth (used
                strictly for the mathematical calculation of natal charts and planetary positions).
              </li>
              <li style={{ marginBottom: "0.8rem", textTransform: "none" }}>
                <strong>Account & Identity:</strong> Name, email address, and profile identifiers when signing in via
                Google Sign-In or email.
              </li>
              <li style={{ marginBottom: "0.8rem", textTransform: "none" }}>
                <strong>Diagnostics & Analytics:</strong> Device model, OS version, and crash diagnostics to maintain
                system performance and fix bugs.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section style={{ marginBottom: "2.5rem", textTransform: "none" }}>
            <h2
              style={{
                fontSize: "2rem",
                color: "#1e1b4b",
                fontWeight: 700,
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.8rem",
                textTransform: "none",
              }}
            >
              <span style={{ color: "#4f46e5" }}>3.</span> How We Use Your Information
            </h2>
            <ul style={{ paddingLeft: "2.5rem", marginBottom: "1rem", textTransform: "none" }}>
              <li style={{ marginBottom: "0.6rem", textTransform: "none" }}>
                To calculate planetary coordinates, Nakshatras, and astrological forecasts.
              </li>
              <li style={{ marginBottom: "0.6rem", textTransform: "none" }}>
                To manage your user profile and synchronize charts across devices.
              </li>
              <li style={{ marginBottom: "0.6rem", textTransform: "none" }}>
                To deliver app updates, notifications, and responsive user support.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section style={{ marginBottom: "2.5rem", textTransform: "none" }}>
            <h2
              style={{
                fontSize: "2rem",
                color: "#1e1b4b",
                fontWeight: 700,
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.8rem",
                textTransform: "none",
              }}
            >
              <span style={{ color: "#4f46e5" }}>4.</span> Data Sharing & Third Parties
            </h2>
            <p style={{ textTransform: "none", marginBottom: "1rem" }}>
              We do <strong>not</strong> sell, rent, or trade your personal data. We interact only with trusted service
              partners required to deliver the core service:
            </p>
            <ul style={{ paddingLeft: "2.5rem", marginBottom: "1rem", textTransform: "none" }}>
              <li style={{ marginBottom: "0.6rem", textTransform: "none" }}>
                <strong>Google Identity Services:</strong> For secure authentication and account sign-in.
              </li>
              <li style={{ marginBottom: "0.6rem", textTransform: "none" }}>
                <strong>Encrypted Cloud Infrastructure:</strong> Communicating exclusively over TLS/HTTPS to securely
                store and compute astrological data.
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section style={{ marginBottom: "2.5rem", textTransform: "none" }}>
            <h2
              style={{
                fontSize: "2rem",
                color: "#1e1b4b",
                fontWeight: 700,
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.8rem",
                textTransform: "none",
              }}
            >
              <span style={{ color: "#4f46e5" }}>5.</span> Data Security
            </h2>
            <p style={{ textTransform: "none" }}>
              All data transmitted between the CosmicGuide mobile app and our backend servers is encrypted with standard{" "}
              <strong>TLS/HTTPS protocols</strong>. We follow industry best practices to prevent unauthorized access,
              alteration, disclosure, or destruction of your personal data.
            </p>
          </section>

          {/* Section 6 - Account Deletion */}
          <section
            id="delete-account"
            style={{
              marginBottom: "2.5rem",
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              borderRadius: "12px",
              padding: "2.5rem 2rem",
              textTransform: "none",
            }}
          >
            <h2
              style={{
                fontSize: "2.2rem",
                color: "#1e3a8a",
                fontWeight: 700,
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.8rem",
                textTransform: "none",
              }}
            >
              <span style={{ color: "#2563eb" }}>6.</span> User Rights &amp; Data Deletion
            </h2>
            <p style={{ textTransform: "none", marginBottom: "1.2rem" }}>
              In accordance with Google Play Data Safety requirements and user privacy laws, you have the right to request the permanent deletion of your CosmicGuide account and all associated personal data at any time without needing to reinstall the app.
            </p>

            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
                padding: "1.5rem",
                marginBottom: "1.5rem",
                fontSize: "1.4rem",
                textTransform: "none",
              }}
            >
              <h4 style={{ color: "#0f172a", marginBottom: "0.8rem", fontWeight: 700, fontSize: "1.5rem", textTransform: "none" }}>
                Data Deletion Breakdown:
              </h4>
              <ul style={{ paddingLeft: "2rem", marginBottom: "0", textTransform: "none" }}>
                <li style={{ marginBottom: "0.5rem" }}>
                  <strong>Data that will be permanently deleted:</strong> User profile, email address, Google authentication tokens, birth details (date, exact time, and birth coordinates), saved Kundlis/horoscopes, and personal astrological notes.
                </li>
                <li style={{ marginBottom: "0.5rem" }}>
                  <strong>Data that may be retained:</strong> None. All user records tied to your identity are erased. Anonymous, aggregated diagnostic crash logs that contain no personal identifiers may be kept strictly for system stability.
                </li>
                <li>
                  <strong>Retention &amp; Processing Period:</strong> All deletion requests are processed and wiped from active databases and backups within <strong>30 days</strong>.
                </li>
              </ul>
            </div>

            <p style={{ textTransform: "none", marginBottom: "1rem", fontWeight: 600, color: "#1e293b" }}>
              How to submit a deletion request:
            </p>

            <div style={{ textTransform: "none", marginBottom: "1.5rem" }}>
              <a
                href="mailto:ravindranathjha76@gmail.com?subject=Account%20%26%20Data%20Deletion%20Request%20-%20CosmicGuide&body=Hello%20Ravindra%2C%0A%0AI%20would%20like%20to%20request%20the%20permanent%20deletion%20of%20my%20CosmicGuide%20account%20and%20all%20associated%20data.%0A%0ARegistered%20Email%20%2F%20Google%20Account%3A%20%0A%0AThank%20you."
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
                  textTransform: "none",
                }}
              >
                <span>🗑️</span> Request Account &amp; Data Deletion
              </a>
            </div>

            <p style={{ textTransform: "none", fontSize: "1.35rem", color: "#475569", margin: "0" }}>
              Alternatively, send an email manually to{" "}
              <a
                href="mailto:ravindranathjha76@gmail.com?subject=Account%20%26%20Data%20Deletion%20Request"
                style={{ color: "#1d4ed8", fontWeight: 700, textDecoration: "underline", textTransform: "none" }}
              >
                ravindranathjha76@gmail.com
              </a>{" "}
              with the subject <em>&ldquo;Account &amp; Data Deletion Request - CosmicGuide&rdquo;</em> including your registered account email.
            </p>
          </section>

          {/* Section 7 */}
          <section style={{ marginBottom: "2.5rem", textTransform: "none" }}>
            <h2
              style={{
                fontSize: "2rem",
                color: "#1e1b4b",
                fontWeight: 700,
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.8rem",
                textTransform: "none",
              }}
            >
              <span style={{ color: "#4f46e5" }}>7.</span> Children&apos;s Privacy
            </h2>
            <p style={{ textTransform: "none" }}>
              CosmicGuide is not directed at children under the age of 13. We do not knowingly collect personal
              identifiable information from children under 13. If you become aware that a child has provided us with
              personal data, please contact us immediately so we can remove the data.
            </p>
          </section>

          {/* Section 8 - Contact */}
          <section
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "2rem",
              textTransform: "none",
            }}
          >
            <h2
              style={{
                fontSize: "2rem",
                color: "#1e1b4b",
                fontWeight: 700,
                marginBottom: "1.2rem",
                display: "flex",
                alignItems: "center",
                gap: "0.8rem",
                textTransform: "none",
              }}
            >
              <span style={{ color: "#4f46e5" }}>8.</span> Contact Us
            </h2>
            <p style={{ textTransform: "none", marginBottom: "1.2rem" }}>
              For any questions regarding this Privacy Policy or your personal data, please contact us:
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "1.2rem",
                fontSize: "1.4rem",
                textTransform: "none",
              }}
            >
              <div>
                <strong style={{ color: "#475569" }}>Developer / Entity:</strong>
                <div style={{ color: "#0f172a", fontWeight: 600 }}>Ravindra Nath Jha</div>
              </div>
              <div>
                <strong style={{ color: "#475569" }}>Email:</strong>
                <div>
                  <a
                    href="mailto:ravindranathjha76@gmail.com"
                    style={{ color: "#2506ad", fontWeight: 600, textTransform: "none" }}
                  >
                    ravindranathjha76@gmail.com
                  </a>
                </div>
              </div>
              <div>
                <strong style={{ color: "#475569" }}>Website:</strong>
                <div>
                  <a
                    href="https://www.ravindranathjha.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#2506ad", fontWeight: 600, textTransform: "none" }}
                  >
                    https://www.ravindranathjha.in
                  </a>
                </div>
              </div>
              <div>
                <strong style={{ color: "#475569" }}>Location:</strong>
                <div style={{ color: "#0f172a", fontWeight: 600 }}>Faridabad, India - 121003</div>
              </div>
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}
