import Link from "next/link";
import InfoPage from "@/components/site/InfoPage";

const SITE = "https://www.ravindranathjha.in";

export const metadata = {
  title: "Terms of Use",
  description:
    "Terms for using ravindranathjha.in, including how you may use the free programming notes, UI templates, parallax website demos and AI prompts.",
  alternates: { canonical: `${SITE}/terms` },
};

export default function TermsPage() {
  return (
    <InfoPage
      eyebrow="Legal"
      title="Terms of Use"
      updated="4 November 2026"
      intro="These terms apply to www.ravindranathjha.in (the “site”), run by Ravindra Nath Jha. By using the site you agree to them."
    >
      <h2>1. Using the content</h2>
      <p>
        The programming notes, explanations and articles are free to read for personal learning. You may quote short
        excerpts with a link back to the original page. Please do not republish whole lectures or large parts of them
        elsewhere without written permission.
      </p>

      <h2>2. Templates, demos and prompts</h2>
      <p>
        The code in the <Link href="/templates">UI templates</Link>, the <Link href="/templates#parallax-websites">parallax
        website demos</Link> and the text of the <Link href="/prompts">AI prompts</Link> may be used, modified and included in
        your own personal and commercial projects without attribution. You may not resell or redistribute them as a template
        pack, course or library on their own.
      </p>
      <p>
        Demo websites use fictional brands, prices and contact details. Photos in the demos are public-domain (CC0) images
        from StockSnap; check the licence of any image you replace them with.
      </p>

      <h2>3. No warranty</h2>
      <p>
        All content and code is provided “as is”, without warranty of any kind. Test code before using it in production. I am
        not liable for any loss or damage arising from the use of the site or its content. See the{" "}
        <Link href="/disclaimer">disclaimer</Link> for more.
      </p>

      <h2>4. Third-party services and advertising</h2>
      <p>
        The site uses third-party services such as Google Analytics, Microsoft Clarity and Google AdSense, and links to
        external websites. Those services and websites are governed by their own terms and privacy policies. How the site
        uses cookies is explained in the <Link href="/privacy-policy">privacy policy</Link>.
      </p>

      <h2>5. Acceptable use</h2>
      <p>
        Do not attempt to disrupt the site, scrape it at a rate that affects other visitors, submit spam through the contact
        form, or use the site for anything unlawful.
      </p>

      <h2>6. Changes</h2>
      <p>
        These terms may be updated from time to time. The date at the top shows the latest version. Continued use of the site
        after a change means you accept the updated terms.
      </p>

      <h2>7. Contact</h2>
      <p>
        Questions about these terms: <a href="mailto:ravindranathjha76@gmail.com">ravindranathjha76@gmail.com</a> or the{" "}
        <Link href="/contact">contact page</Link>. These terms are governed by the laws of India.
      </p>
    </InfoPage>
  );
}
