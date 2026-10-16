import Experience from "@/components/Experience";

export const metadata = {
  title: "Experience & Education: Team Lead, M.Tech AI from IIT Jodhpur",
  description: "Career and education of Ravindra Nath Jha: Team Lead at Townmanor Technology, Senior Software Engineer, M.Tech in Artificial Intelligence from IIT Jodhpur and B.Tech in Computer Science from UIET, MDU.",
  alternates: {
    canonical: "https://www.ravindranathjha.in/experience",
  },
  openGraph: {
    title: "Experience & Education | Ravindra Nath Jha, M.Tech AI IIT Jodhpur",
    description: "Career and education of Ravindra Nath Jha: Team Lead at Townmanor Technology, Senior Software Engineer, M.Tech in Artificial Intelligence from IIT Jodhpur and B.Tech in Computer Science from UIET, MDU.",
    url: "https://www.ravindranathjha.in/experience",
  },
};

export default function ExperiencePage() {
  return (
    <div style={{ paddingTop: "6rem" }}>
      <Experience asPage />
    </div>
  );
}
