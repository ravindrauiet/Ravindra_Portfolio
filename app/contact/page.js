import InfoPage from "@/components/site/InfoPage";
import Contact from "@/components/Contact";

const SITE = "https://www.ravindranathjha.in";

export const metadata = {
  title: "Contact Ravindra Nath Jha",
  description:
    "Get in touch with Ravindra Nath Jha for freelance web, mobile and AI projects, to report an error in the notes, or with questions about the templates and prompts.",
  alternates: { canonical: `${SITE}/contact` },
  openGraph: {
    title: "Contact Ravindra Nath Jha",
    description: "Freelance projects, corrections and questions about the notes, templates and prompts.",
    url: `${SITE}/contact`,
  },
};

const jsonLd = (data) => JSON.stringify(data).replace(/</g, "\\u003c");

export default function ContactPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    url: `${SITE}/contact`,
    mainEntity: {
      "@type": "Person",
      name: "Ravindra Nath Jha",
      email: "ravindranathjha76@gmail.com",
      telephone: "+919354156323",
      address: { "@type": "PostalAddress", addressLocality: "Faridabad", addressRegion: "Haryana", addressCountry: "IN" },
    },
  };

  return (
    <>
      <InfoPage
        eyebrow="Contact"
        title="Contact"
        intro="Whether you have a project in mind, found a mistake in a lecture, or have a question about a template or prompt, I read every message and usually reply within two working days."
      >
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />

        <div className="info-cards">
          <div>
            <h2>Email</h2>
            <p>
              <a href="mailto:ravindranathjha76@gmail.com">ravindranathjha76@gmail.com</a>
            </p>
            <p className="info-muted">Best for project enquiries and corrections.</p>
          </div>
          <div>
            <h2>Phone &amp; WhatsApp</h2>
            <p>
              <a href="tel:+919354156323">+91 93541 56323</a> ·{" "}
              <a href="https://wa.me/919354156323" target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </p>
            <p className="info-muted">Monday to Saturday, 10 am – 7 pm IST.</p>
          </div>
          <div>
            <h2>Social</h2>
            <p>
              <a href="https://www.linkedin.com/in/ravindra-jha75/" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>{" "}
              ·{" "}
              <a href="https://github.com/ravindrauiet" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </p>
            <p className="info-muted">Faridabad, Haryana, India – 121003</p>
          </div>
        </div>

        <h2>Reporting an error in the notes</h2>
        <p>
          Please include the page link, the section heading and what looks wrong (for example a code sample that no longer
          runs on the current version). Corrections are usually published within a few days.
        </p>
      </InfoPage>
      <Contact />
    </>
  );
}
