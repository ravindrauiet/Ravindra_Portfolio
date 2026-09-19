export const metadata = {
  title: "Privacy Policy",
  description: "Privacy policy and terms of use for Ravindra Nath Jha's portfolio website.",
  alternates: {
    canonical: "https://ravindranathjha.in/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <section className="container" style={{ padding: "10rem 2rem 5rem 2rem", maxWidth: "1000px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "3rem", color: "#002057", marginBottom: "1.5rem", fontWeight: 800 }}>
        Privacy Policy
      </h1>
      <p style={{ color: "#475569", fontSize: "1.1rem", lineHeight: 1.8, marginBottom: "2rem" }}>
        Your privacy is critically important to us. This Privacy Policy document outlines the types of personal information that is received and collected by <strong>Ravindra Nath Jha's Portfolio</strong> and how it is used.
      </p>

      <h2 style={{ fontSize: "1.8rem", color: "#2506ad", marginTop: "2rem", marginBottom: "1rem" }}>
        Information We Collect
      </h2>
      <p style={{ color: "#475569", fontSize: "1rem", lineHeight: 1.7 }}>
        We only collect personal information when you voluntarily submit it through our contact form (e.g. name, email address, phone number, and message details).
      </p>

      <h2 style={{ fontSize: "1.8rem", color: "#2506ad", marginTop: "2rem", marginBottom: "1rem" }}>
        How We Use Information
      </h2>
      <p style={{ color: "#475569", fontSize: "1rem", lineHeight: 1.7 }}>
        The information submitted is exclusively used to respond to your inquiry, discuss freelancing project requirements, or provide requested services. We never sell or share your data with third parties.
      </p>

      <h2 style={{ fontSize: "1.8rem", color: "#2506ad", marginTop: "2rem", marginBottom: "1rem" }}>
        Contact Us
      </h2>
      <p style={{ color: "#475569", fontSize: "1rem", lineHeight: 1.7 }}>
        If you have any questions regarding this Privacy Policy, feel free to contact us directly at <a href="mailto:ravindranathjha76@gmail.com" style={{ color: "#2506ad", fontWeight: 700 }}>ravindranathjha76@gmail.com</a>.
      </p>
    </section>
  );
}
