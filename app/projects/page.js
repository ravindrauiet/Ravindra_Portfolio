import Projects from "@/components/Projects";

export const metadata = {
  title: "Projects: Full Stack Web, Mobile & AI Apps",
  description: "Featured projects by Ravindra Nath Jha, Full Stack Developer and AI Engineer (M.Tech AI, IIT Jodhpur): MERN stack web apps, React Native mobile apps and AI-powered products using OpenAI and Gemini.",
  alternates: {
    canonical: "https://www.ravindranathjha.in/projects",
  },
  openGraph: {
    title: "Projects: Web, Mobile & AI Apps | Ravindra Nath Jha",
    description: "Featured projects by Ravindra Nath Jha, Full Stack Developer and AI Engineer (M.Tech AI, IIT Jodhpur): MERN stack web apps, React Native mobile apps and AI-powered products using OpenAI and Gemini.",
    url: "https://www.ravindranathjha.in/projects",
  },
};

export default function ProjectsPage() {
  return (
    <div style={{ paddingTop: "6rem" }}>
      <Projects asPage />
    </div>
  );
}
