import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Ravindra Nath Jha",
  description:
    "Privacy policies and data terms for Ravindra Nath Jha's portfolio and mobile applications, including CosmicGuide (com.cosmicguide.vedicastro).",
  alternates: {
    canonical: "https://www.ravindranathjha.in/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
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
          maxWidth: "1000px",
          margin: "0 auto",
          textTransform: "none",
        }}
      >
        {/* Page Heading */}
        <div style={{ textAlign: "center", marginBottom: "3rem", textTransform: "none" }}>
          <h1
            style={{
              fontSize: "3.5rem",
              fontWeight: 800,
              color: "#0f172a",
              marginBottom: "1rem",
              textTransform: "none",
            }}
          >
            Privacy Policy Center
          </h1>
          <p
            style={{
              fontSize: "1.6rem",
              color: "#64748b",
              maxWidth: "700px",
              margin: "0 auto",
              textTransform: "none",
              lineHeight: 1.6,
            }}
          >
            We are committed to data transparency and protecting your privacy. Below you can find policies for our portfolio website and mobile applications.
          </p>
        </div>

        {/* Application Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2rem",
            marginBottom: "3.5rem",
            textTransform: "none",
          }}
        >
          {/* Card 1: CosmicGuide */}
          <div
            style={{
              background: "#ffffff",
              border: "2px solid #6366f1",
              borderRadius: "14px",
              padding: "2.2rem",
              boxShadow: "0 10px 25px rgba(99, 102, 241, 0.12)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              textTransform: "none",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-block",
                  background: "#e0e7ff",
                  color: "#4338ca",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  padding: "0.3rem 0.8rem",
                  borderRadius: "9999px",
                  marginBottom: "1rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Mobile Application
              </div>
              <h3
                style={{
                  fontSize: "2.2rem",
                  fontWeight: 700,
                  color: "#1e1b4b",
                  marginBottom: "0.5rem",
                  textTransform: "none",
                }}
              >
                CosmicGuide
              </h3>
              <p
                style={{
                  fontSize: "1.3rem",
                  color: "#64748b",
                  marginBottom: "1rem",
                  textTransform: "none",
                }}
              >
                Package: <code style={{ color: "#4f46e5", fontWeight: 600 }}>com.cosmicguide.vedicastro</code>
              </p>
              <p
                style={{
                  fontSize: "1.4rem",
                  color: "#334155",
                  lineHeight: 1.6,
                  marginBottom: "1.5rem",
                  textTransform: "none",
                }}
              >
                Vedic astrology, Kundli generation, and daily horoscopes privacy policy, data deletion rights, and encryption details.
              </p>
            </div>
            <Link
              href="/privacy-policy/cosmic-guide"
              style={{
                display: "inline-block",
                textAlign: "center",
                background: "#4f46e5",
                color: "#ffffff",
                padding: "1rem 1.5rem",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "1.4rem",
                textDecoration: "none",
                textTransform: "none",
              }}
            >
              View CosmicGuide Policy →
            </Link>
          </div>

          {/* Card 2: Delhi Metro & Bus Navigation */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "14px",
              padding: "2.2rem",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.04)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              textTransform: "none",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-block",
                  background: "#f1f5f9",
                  color: "#475569",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  padding: "0.3rem 0.8rem",
                  borderRadius: "9999px",
                  marginBottom: "1rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Mobile Application
              </div>
              <h3
                style={{
                  fontSize: "2.2rem",
                  fontWeight: 700,
                  color: "#0f172a",
                  marginBottom: "0.5rem",
                  textTransform: "none",
                }}
              >
                Delhi Metro &amp; Bus Navigation
              </h3>
              <p
                style={{
                  fontSize: "1.3rem",
                  color: "#64748b",
                  marginBottom: "1rem",
                  textTransform: "none",
                }}
              >
                Public Transit Navigation
              </p>
              <p
                style={{
                  fontSize: "1.4rem",
                  color: "#334155",
                  lineHeight: 1.6,
                  marginBottom: "1.5rem",
                  textTransform: "none",
                }}
              >
                Privacy policy covering GPS transit location tracking, route search analytics, and offline cache usage.
              </p>
            </div>
            <a
              href="/privacy-policy.html"
              style={{
                display: "inline-block",
                textAlign: "center",
                background: "#0f172a",
                color: "#ffffff",
                padding: "1rem 1.5rem",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "1.4rem",
                textDecoration: "none",
                textTransform: "none",
              }}
            >
              View Delhi Metro Policy →
            </a>
          </div>

          {/* Card 3: FITKEY - Gym & Fitness Pass */}
          <div
            style={{
              background: "#ffffff",
              border: "2px solid #ea580c",
              borderRadius: "14px",
              padding: "2.2rem",
              boxShadow: "0 10px 25px rgba(234, 88, 12, 0.12)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              textTransform: "none",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-block",
                  background: "#ffedd5",
                  color: "#c2410c",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  padding: "0.3rem 0.8rem",
                  borderRadius: "9999px",
                  marginBottom: "1rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Health &amp; Fitness App
              </div>
              <h3
                style={{
                  fontSize: "2.2rem",
                  fontWeight: 700,
                  color: "#0f172a",
                  marginBottom: "0.5rem",
                  textTransform: "none",
                }}
              >
                FITKEY
              </h3>
              <p
                style={{
                  fontSize: "1.3rem",
                  color: "#64748b",
                  marginBottom: "1rem",
                  textTransform: "none",
                }}
              >
                Package: <code style={{ color: "#ea580c", fontWeight: 600 }}>com.fitkey.fitkey_user</code>
              </p>
              <p
                style={{
                  fontSize: "1.4rem",
                  color: "#334155",
                  lineHeight: 1.6,
                  marginBottom: "1.5rem",
                  textTransform: "none",
                }}
              >
                Multi-venue gym &amp; studio pass privacy policy, QR check-in camera disclosure, TLS data encryption, and account deletion portal.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              <Link
                href="/privacy-policy/fitkey"
                style={{
                  display: "inline-block",
                  textAlign: "center",
                  background: "#ea580c",
                  color: "#ffffff",
                  padding: "1rem 1.5rem",
                  borderRadius: "8px",
                  fontWeight: 600,
                  fontSize: "1.4rem",
                  textDecoration: "none",
                  textTransform: "none",
                }}
              >
                View FITKEY Policy →
              </Link>
              <Link
                href="/privacy-policy/fitkey/delete-account"
                style={{
                  display: "inline-block",
                  textAlign: "center",
                  background: "#fee2e2",
                  color: "#b91c1c",
                  padding: "0.7rem 1.5rem",
                  borderRadius: "8px",
                  fontWeight: 600,
                  fontSize: "1.3rem",
                  textDecoration: "none",
                  textTransform: "none",
                }}
              >
                Delete Account &amp; Data ↗
              </Link>
            </div>
          </div>
        </div>

        {/* Section: Website Privacy Policy */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "16px",
            padding: "3.5rem 3rem",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
            border: "1px solid #e2e8f0",
            textTransform: "none",
            marginBottom: "3.5rem",
          }}
        >
          <h2
            style={{
              fontSize: "2.4rem",
              color: "#0f172a",
              fontWeight: 800,
              marginBottom: "1.5rem",
              textTransform: "none",
            }}
          >
            Portfolio Website Privacy Policy
          </h2>
          <p style={{ color: "#475569", fontSize: "1.5rem", lineHeight: 1.8, marginBottom: "2rem", textTransform: "none" }}>
            Your privacy is critically important to us. This Privacy Policy outlines the personal information received and collected by{" "}
            <strong>Ravindra Nath Jha&apos;s Portfolio (www.ravindranathjha.in)</strong> and how it is protected.
          </p>

          <h3 style={{ fontSize: "1.8rem", color: "#2506ad", marginTop: "2rem", marginBottom: "1rem", textTransform: "none" }}>
            Information We Collect
          </h3>
          <p style={{ color: "#475569", fontSize: "1.45rem", lineHeight: 1.7, textTransform: "none" }}>
            We only collect personal information when you voluntarily submit it through our contact form (such as your name, email address, phone number, and project message details).
          </p>

          <h3 style={{ fontSize: "1.8rem", color: "#2506ad", marginTop: "2rem", marginBottom: "1rem", textTransform: "none" }}>
            How We Use Information
          </h3>
          <p style={{ color: "#475569", fontSize: "1.45rem", lineHeight: 1.7, textTransform: "none" }}>
            The information submitted is exclusively used to respond to your inquiry, discuss software development and freelancing requirements, or provide requested consultation. We never sell, rent, or share your data with third parties.
          </p>

          <h3 style={{ fontSize: "1.8rem", color: "#2506ad", marginTop: "2rem", marginBottom: "1rem", textTransform: "none" }}>
            Contact Us
          </h3>
          <p style={{ color: "#475569", fontSize: "1.45rem", lineHeight: 1.7, textTransform: "none" }}>
            If you have questions regarding this Privacy Policy, please reach out directly at{" "}
            <a href="mailto:ravindranathjha76@gmail.com" style={{ color: "#2506ad", fontWeight: 700, textTransform: "none" }}>
              ravindranathjha76@gmail.com
            </a>
            .
          </p>
        </div>

        {/* Embedded Full CosmicGuide Section for Direct Reference */}
        <div
          id="cosmic-guide"
          style={{
            background: "#ffffff",
            borderRadius: "16px",
            padding: "3.5rem 3rem",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
            border: "1px solid #e2e8f0",
            textTransform: "none",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            <h2
              style={{
                fontSize: "2.6rem",
                color: "#1e1b4b",
                fontWeight: 800,
                textTransform: "none",
              }}
            >
              Privacy Policy for CosmicGuide
            </h2>
            <Link
              href="/privacy-policy/cosmic-guide"
              style={{
                color: "#4f46e5",
                fontSize: "1.4rem",
                fontWeight: 600,
                textDecoration: "underline",
                textTransform: "none",
              }}
            >
              Open Dedicated Page ↗
            </Link>
          </div>

          <div
            style={{
              fontSize: "1.3rem",
              color: "#64748b",
              marginBottom: "2rem",
              paddingBottom: "1.5rem",
              borderBottom: "1px solid #e2e8f0",
              textTransform: "none",
            }}
          >
            <strong>Application:</strong> CosmicGuide (<code>com.cosmicguide.vedicastro</code>) |{" "}
            <strong>Effective &amp; Last Updated:</strong> October 18, 2026 |{" "}
            <strong>Developer:</strong> Ravindra Nath Jha
          </div>

          <div style={{ color: "#334155", fontSize: "1.45rem", lineHeight: 1.8, textTransform: "none" }}>
            <h4 style={{ fontSize: "1.6rem", fontWeight: 700, color: "#1e1b4b", marginTop: "1.5rem", marginBottom: "0.5rem" }}>
              1. Introduction
            </h4>
            <p style={{ marginBottom: "1rem" }}>
              Welcome to CosmicGuide, operated by Ravindra Nath Jha (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;). We respect your privacy and are committed to protecting your personal information. This Privacy Policy outlines our practices regarding data collection, use, and security for users of our mobile application and website at{" "}
              <a href="https://www.ravindranathjha.in" target="_blank" rel="noopener noreferrer" style={{ color: "#2506ad", fontWeight: 600 }}>
                https://www.ravindranathjha.in
              </a>.
            </p>

            <h4 style={{ fontSize: "1.6rem", fontWeight: 700, color: "#1e1b4b", marginTop: "1.5rem", marginBottom: "0.5rem" }}>
              2. Information We Collect
            </h4>
            <p style={{ marginBottom: "0.5rem" }}>
              To provide accurate Vedic astrological insights, birth Kundlis, and daily horoscopes, we may collect:
            </p>
            <ul style={{ paddingLeft: "2rem", marginBottom: "1rem" }}>
              <li><strong>Astrological Details:</strong> Date of birth, exact time of birth, and place of birth (used strictly for mathematical calculation of natal charts).</li>
              <li><strong>Account &amp; Identity:</strong> Name, email address, and profile identifiers when signing in via Google Sign-In or email.</li>
              <li><strong>Diagnostics &amp; Analytics:</strong> Device model, OS version, and crash diagnostics to maintain system performance.</li>
            </ul>

            <h4 style={{ fontSize: "1.6rem", fontWeight: 700, color: "#1e1b4b", marginTop: "1.5rem", marginBottom: "0.5rem" }}>
              3. How We Use Your Information
            </h4>
            <ul style={{ paddingLeft: "2rem", marginBottom: "1rem" }}>
              <li>To calculate planetary coordinates, Nakshatras, and astrological forecasts.</li>
              <li>To manage your user profile and synchronize charts across devices.</li>
              <li>To deliver app updates, notifications, and responsive user support.</li>
            </ul>

            <h4 style={{ fontSize: "1.6rem", fontWeight: 700, color: "#1e1b4b", marginTop: "1.5rem", marginBottom: "0.5rem" }}>
              4. Data Sharing &amp; Third Parties
            </h4>
            <p style={{ marginBottom: "0.5rem" }}>
              We do not sell, rent, or trade your personal data. We interact only with trusted service partners required to deliver the service:
            </p>
            <ul style={{ paddingLeft: "2rem", marginBottom: "1rem" }}>
              <li><strong>Google Identity Services:</strong> For secure authentication.</li>
              <li><strong>Encrypted cloud infrastructure:</strong> Communicating exclusively over TLS/HTTPS.</li>
            </ul>

            <h4 style={{ fontSize: "1.6rem", fontWeight: 700, color: "#1e1b4b", marginTop: "1.5rem", marginBottom: "0.5rem" }}>
              5. Data Security
            </h4>
            <p style={{ marginBottom: "1rem" }}>
              All data transmitted between the CosmicGuide mobile app and our backend servers is encrypted with TLS/HTTPS. We follow industry best practices to prevent unauthorized access or disclosure.
            </p>

            <h4 style={{ fontSize: "1.6rem", fontWeight: 700, color: "#1e1b4b", marginTop: "1.5rem", marginBottom: "0.5rem" }}>
              6. User Rights &amp; Data Deletion
            </h4>
            <p style={{ marginBottom: "0.8rem" }}>
              You have the right to request the permanent deletion of your CosmicGuide account and all associated astrological data at any time.
            </p>
            <div style={{ marginBottom: "1rem" }}>
              <a
                href="mailto:ravindranathjha76@gmail.com?subject=Account%20%26%20Data%20Deletion%20Request%20-%20CosmicGuide&body=Hello%20Ravindra%2C%0A%0AI%20would%20like%20to%20request%20the%20permanent%20deletion%20of%20my%20CosmicGuide%20account%20and%20all%20associated%20data.%0A%0ARegistered%20Email%20%2F%20Google%20Account%3A%20%0A%0AThank%20you."
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  background: "#dc2626",
                  color: "#ffffff",
                  padding: "0.8rem 1.6rem",
                  borderRadius: "6px",
                  fontWeight: 700,
                  fontSize: "1.35rem",
                  textDecoration: "none",
                }}
              >
                <span>🗑️</span> Request Account &amp; Data Deletion
              </a>
            </div>
            <p style={{ marginBottom: "0.5rem", fontSize: "1.35rem", color: "#64748b" }}>
              All user profile data, coordinates, and natal charts will be permanently wiped within 30 days.
            </p>

            <h4 style={{ fontSize: "1.6rem", fontWeight: 700, color: "#1e1b4b", marginTop: "1.5rem", marginBottom: "0.5rem" }}>
              7. Children&apos;s Privacy
            </h4>
            <p style={{ marginBottom: "1rem" }}>
              CosmicGuide is not directed at children under the age of 13. We do not knowingly collect personal information from children under 13.
            </p>

            <h4 style={{ fontSize: "1.6rem", fontWeight: 700, color: "#1e1b4b", marginTop: "1.5rem", marginBottom: "0.5rem" }}>
              8. Contact Us
            </h4>
            <p>
              For questions regarding this policy or your personal data, reach us at:
              <br />
              <strong>Developer / Entity:</strong> Ravindra Nath Jha
              <br />
              <strong>Email:</strong> <a href="mailto:ravindranathjha76@gmail.com" style={{ color: "#2506ad" }}>ravindranathjha76@gmail.com</a>
              <br />
              <strong>Website:</strong> <a href="https://www.ravindranathjha.in" target="_blank" rel="noopener noreferrer" style={{ color: "#2506ad" }}>https://www.ravindranathjha.in</a>
              <br />
              <strong>Location:</strong> Faridabad, India - 121003
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
