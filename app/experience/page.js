import Experience from "@/components/Experience";

export const metadata = {
  title: "Experience & Professional Journey",
  description: "Work history, leadership experience at Townmanor Technology, software engineering projects, and academic background of Ravindra Nath Jha.",
  alternates: {
    canonical: "https://ravindranathjha.in/experience",
  },
  openGraph: {
    title: "Experience & Professional Journey | Ravindra Nath Jha",
    description: "Work history, leadership experience at Townmanor Technology, software engineering projects, and academic background of Ravindra Nath Jha.",
    url: "https://ravindranathjha.in/experience",
  },
};

export default function ExperiencePage() {
  return (
    <div style={{ paddingTop: "6rem" }}>
      <Experience />
    </div>
  );
}
