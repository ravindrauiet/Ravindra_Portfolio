import Projects from "@/components/Projects";

export const metadata = {
  title: "Projects & Portfolio Work",
  description: "Featured full-stack web applications, MERN stack software, React Native mobile apps, and AI solutions developed by Ravindra Nath Jha.",
  alternates: {
    canonical: "https://ravindranathjha.in/projects",
  },
  openGraph: {
    title: "Projects & Portfolio Work | Ravindra Nath Jha",
    description: "Featured full-stack web applications, MERN stack software, React Native mobile apps, and AI solutions developed by Ravindra Nath Jha.",
    url: "https://ravindranathjha.in/projects",
  },
};

export default function ProjectsPage() {
  return (
    <div style={{ paddingTop: "6rem" }}>
      <Projects />
    </div>
  );
}
