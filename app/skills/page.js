import Skills from "@/components/Skills";

export const metadata = {
  title: "Skills & Technical Stack",
  description: "Explore the technical skill matrix of Ravindra Nath Jha: React.js, Next.js, Node.js, Express, MongoDB, Python, React Native, AWS, and REST APIs.",
  alternates: {
    canonical: "https://ravindranathjha.in/skills",
  },
  openGraph: {
    title: "Skills & Technical Stack | Ravindra Nath Jha",
    description: "Explore the technical skill matrix of Ravindra Nath Jha: React.js, Next.js, Node.js, Express, MongoDB, Python, React Native, AWS, and REST APIs.",
    url: "https://ravindranathjha.in/skills",
  },
};

export default function SkillsPage() {
  return (
    <div style={{ paddingTop: "6rem" }}>
      <Skills />
    </div>
  );
}
