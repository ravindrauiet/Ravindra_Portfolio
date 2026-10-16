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
    </div>
  );
}
