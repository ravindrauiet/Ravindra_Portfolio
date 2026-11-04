import Image from "next/image";
import Link from "next/link";
import InfoPage from "@/components/site/InfoPage";
import { getAllTechStacks } from "@/lib/notesData";
import { getAllTemplates } from "@/lib/templates";
import { getAllPrompts } from "@/lib/prompts";
import { PARALLAX_DEMOS } from "@/lib/demos";

const SITE = "https://www.ravindranathjha.in";

export const metadata = {
  title: "About Ravindra Nath Jha — Full Stack Developer & AI Engineer",
  description:
    "Who I am and what this site is: Ravindra Nath Jha, full stack developer and team lead with an M.Tech in Artificial Intelligence from IIT Jodhpur, writing free programming notes, UI templates and AI website prompts.",
  alternates: { canonical: `${SITE}/about` },
  openGraph: {
    title: "About Ravindra Nath Jha",
    description: "Full stack developer and AI engineer (M.Tech AI, IIT Jodhpur). The person behind these notes, templates and prompts.",
    url: `${SITE}/about`,
    type: "profile",
  },
};

const jsonLd = (data) => JSON.stringify(data).replace(/</g, "\\u003c");

export default function AboutPage() {
  const stacks = getAllTechStacks();
  const lectureCount = stacks.reduce((sum, stack) => sum + stack.lectures.length, 0);
  const templateCount = getAllTemplates().length;
  const promptCount = getAllPrompts().length;
  const demoCount = PARALLAX_DEMOS.length;

  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: `${SITE}/about`,
    mainEntity: {
      "@type": "Person",
      name: "Ravindra Nath Jha",
      url: SITE,
      image: `${SITE}/assets/images/Ravindraprofile.jpeg`,
      jobTitle: "Full Stack Developer, AI Engineer & Team Lead",
      worksFor: { "@type": "Organization", name: "Townmanor Technology" },
      alumniOf: [
        { "@type": "CollegeOrUniversity", name: "Indian Institute of Technology Jodhpur" },
        { "@type": "CollegeOrUniversity", name: "University Institute of Engineering and Technology, Maharshi Dayanand University" },
      ],
      sameAs: ["https://www.linkedin.com/in/ravindra-jha75/", "https://github.com/ravindrauiet"],
    },
  };

  return (
    <InfoPage
      eyebrow="About"
      title="About Ravindra Nath Jha"
      intro="I'm a full stack developer and team lead from Faridabad, India. This site is where I publish what I learn while building real products: programming notes, ready-to-use UI templates and AI prompts for building websites."
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />

      <div className="info-profile">
        <Image src="/assets/images/Ravindraprofile.jpeg" alt="Ravindra Nath Jha" width={220} height={220} preload />
        <ul>
          <li>
            <strong>Role</strong> Team Lead &amp; Full Stack Developer, Townmanor Technology (Sept 2024 – present)
          </li>
          <li>
            <strong>Education</strong> M.Tech, Artificial Intelligence — IIT Jodhpur; B.Tech, Computer Science — UIET, Maharshi
            Dayanand University
          </li>
          <li>
            <strong>Based in</strong> Faridabad, Haryana, India
          </li>
          <li>
            <strong>Find me on</strong>{" "}
            <a href="https://www.linkedin.com/in/ravindra-jha75/" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>{" "}
            ·{" "}
            <a href="https://github.com/ravindrauiet" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </li>
        </ul>
      </div>

      <h2>What I do</h2>
      <p>
        I lead a full stack team at Townmanor Technology, where we build AI-driven real estate platforms with React, Node.js
        and React Native, and integrate models such as Gemini and OpenAI into everyday products. Before that I was a senior
        software engineer at PujaKaro, where I built the booking and e-commerce platform from scratch on the MERN stack and
        Firebase, and I spent several years delivering web and mobile apps for startups and freelance clients.
      </p>
      <p>
        My M.Tech in Artificial Intelligence at IIT Jodhpur shapes how I approach AI features: I care about where a model
        genuinely helps a user, how to evaluate it, and how to ship it reliably rather than as a demo.
      </p>

      <h2>What you will find on this site</h2>
      <ul className="info-list">
        <li>
          <Link href="/notes">Programming notes</Link> — {lectureCount} lectures across {stacks.length} courses (
          {stacks.map((stack) => stack.name).join(", ")}). Each lecture explains a topic step by step with code you can run,
          common mistakes and practice questions.
        </li>
        <li>
          <Link href="/templates">UI templates</Link> — {templateCount} free sections, components, backgrounds and 3D scenes,
          each with a live preview, the full source code and an explanation of how it works.
        </li>
        <li>
          <Link href="/templates#parallax-websites">Parallax websites</Link> — {demoCount} complete demo websites built around
          scroll animation, with the prompt to rebuild each one.
        </li>
        <li>
          <Link href="/prompts">AI website prompts</Link> — {promptCount} detailed prompts for building complete websites with
          AI coding tools, with step-by-step instructions and follow-up prompts.
        </li>
      </ul>

      <h2>How I write and maintain the content</h2>
      <p>
        I write from the stack I use at work, and I keep examples runnable and up to date with current versions (for example
        Next.js 16 and React 19). I use AI tools to help draft and check material, the same way I use them when coding, and I
        correct pages when frameworks change or when readers report a problem. If you spot an error, outdated code or a broken
        link, please <Link href="/contact">tell me</Link> and I will fix it.
      </p>
      <p>
        Everything here is free to read and use. The site may show advertising to cover hosting costs; ads never decide what I
        write about. See the <Link href="/privacy-policy">privacy policy</Link>, <Link href="/terms">terms of use</Link> and{" "}
        <Link href="/disclaimer">disclaimer</Link> for details.
      </p>

      <h2>Work with me</h2>
      <p>
        I take on selected freelance projects: web and mobile apps, AI integrations and performance work. Have a look at my{" "}
        <Link href="/projects">projects</Link> and <Link href="/experience">experience</Link>, or{" "}
        <Link href="/contact">get in touch</Link>.
      </p>
    </InfoPage>
  );
}
