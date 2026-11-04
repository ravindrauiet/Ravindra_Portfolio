import Link from "next/link";
import InfoPage from "@/components/site/InfoPage";

const SITE = "https://www.ravindranathjha.in";

export const metadata = {
  title: "Disclaimer",
  description:
    "Disclaimer for ravindranathjha.in: the notes and code are educational, may become outdated, and are provided as is. Advertising, external links and affiliations explained.",
  alternates: { canonical: `${SITE}/disclaimer` },
};

export default function DisclaimerPage() {
  return (
    <InfoPage
      eyebrow="Legal"
      title="Disclaimer"
      updated="4 November 2026"
      intro="Please read this before relying on the notes, code or prompts published on www.ravindranathjha.in."
    >
      <h2>Educational content</h2>
      <p>
        The notes, tutorials and examples are written for learning. They reflect my understanding and experience at the time
        of writing. Frameworks and libraries change quickly, so some details may become outdated even though I update pages
        when I learn about changes.
      </p>

      <h2>Code is provided as is</h2>
      <p>
        Code samples, templates and demo websites are provided without warranty. Review and test them before using them in a
        real project, especially anything involving security, payments, authentication or personal data.
      </p>

      <h2>AI prompts and AI-generated output</h2>
      <p>
        The <Link href="/prompts">prompts</Link> are instructions for AI coding tools. What those tools generate can differ
        between runs and tools and can contain mistakes. You are responsible for reviewing generated code before you use or
        publish it.
      </p>

      <h2>Not professional advice</h2>
      <p>
        Nothing on this site is legal, financial or other professional advice. Opinions are my own and do not represent my
        employer or any company I have worked with.
      </p>

      <h2>Advertising and external links</h2>
      <p>
        The site may display ads served by Google AdSense. Ads are chosen by Google, not by me, and showing an ad is not an
        endorsement. The site also links to external websites, which I do not control and am not responsible for. I do not
        currently use affiliate links; if that changes, they will be clearly marked.
      </p>

      <h2>Demo websites</h2>
      <p>
        The parallax demo websites are design examples for fictional businesses. Names, prices, addresses, phone numbers and
        reviews in them are invented, and forms in them do not send any data.
      </p>

      <h2>Corrections</h2>
      <p>
        If you find an error, please <Link href="/contact">let me know</Link> with the page link and I will correct it.
      </p>
    </InfoPage>
  );
}
