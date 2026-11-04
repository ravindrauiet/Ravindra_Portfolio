import Link from "next/link";
import Skills from "@/components/Skills";

export const metadata = {
  title: "Skills: Full Stack, React, Next.js, Node.js & AI",
  description: "Technical skills of Ravindra Nath Jha (M.Tech AI, IIT Jodhpur): React.js, Next.js, Node.js, Express, MongoDB, Python, React Native, AWS, REST APIs, machine learning, LLMs and generative AI.",
  alternates: {
    canonical: "https://www.ravindranathjha.in/skills",
  },
  openGraph: {
    title: "Skills: Full Stack & AI | Ravindra Nath Jha",
    description: "Technical skills of Ravindra Nath Jha (M.Tech AI, IIT Jodhpur): React.js, Next.js, Node.js, Express, MongoDB, Python, React Native, AWS, REST APIs, machine learning, LLMs and generative AI.",
    url: "https://www.ravindranathjha.in/skills",
  },
};

export default function SkillsPage() {
  return (
    <div style={{ paddingTop: "6rem" }}>
      <Skills asPage />

      <div className="info-page" style={{ paddingTop: "2rem" }}>
        <div className="info-wrap">
          <div className="info-body">
            <h2>How I use this stack day to day</h2>
            <p>
              <strong>Frontend.</strong> Most of my work starts in React. I use Next.js with the App Router for anything that
              needs good SEO or server rendering, and plain React with Vite for dashboards and internal tools. I write the
              patterns I rely on most — state, effects, forms, data fetching and performance — into the{" "}
              <Link href="/notes/react">React course</Link> and the <Link href="/notes/nextjs">Next.js course</Link>.
            </p>
            <p>
              <strong>Backend.</strong> Node.js with Express and MongoDB is my default for APIs, because one language across
              the stack keeps small teams fast. For data work, automation and AI services I switch to Python and FastAPI;
              the <Link href="/notes/python">Python course</Link> follows that path from the basics to building an API.
            </p>
            <p>
              <strong>Mobile.</strong> I build cross-platform apps with React Native and Expo, sharing business logic and API
              clients with the web app where possible, and I have shipped Flutter apps where a client already used it.
            </p>
            <p>
              <strong>AI.</strong> My M.Tech in Artificial Intelligence at IIT Jodhpur covered the machine learning
              foundations; at work I mostly integrate large language models (Gemini and OpenAI) into products — search,
              summarisation, form assistants and recommendation. The <Link href="/notes/ai">AI course</Link> covers that
              journey from classical ML to prompting and LLM-powered features.
            </p>
            <p>
              <strong>Cloud and delivery.</strong> I deploy on AWS (EC2, Lambda and S3), Firebase, Vercel and Azure, with
              Docker and Git-based CI. If you want to see these tools in finished products, browse my{" "}
              <Link href="/projects">projects</Link> or the free <Link href="/templates">UI templates</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
