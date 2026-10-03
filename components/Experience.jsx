import {
  Briefcase,
  GraduationCap,
  MapPin,
  CalendarDays,
  Award,
  ArrowUpRight
} from "lucide-react";

const experiences = [
  {
    role: "Team Lead & Full Stack Developer Specialist",
    company: "Townmanor Technology",
    period: "Sept 2024 - Present",
    location: "Faridabad, India",
    current: true,
    details: [
      "Leading full-stack engineering team building AI-driven real estate platforms.",
      "Architecting React.js & Node.js web applications and React Native mobile apps.",
      "Integrating Gemini & OpenAI APIs, AWS deployment pipelines, and database optimization."
    ]
  },
  {
    role: "Senior Software Engineer",
    company: "PujaKaro",
    period: "Nov 2023 - Aug 2024",
    location: "Faridabad, India",
    details: [
      "Built core e-commerce & booking platform from scratch using MERN stack & Firebase.",
      "Engineered scalable admin dashboards, payment gateway integrations, and mobile APIs."
    ]
  },
  {
    role: "Full Stack Software Developer",
    company: "Tech Startups & Freelancing",
    period: "2021 - 2023",
    location: "India",
    details: [
      "Delivered 20+ custom web and mobile apps for e-commerce, CRM, and food delivery clients.",
      "Configured AWS EC2 hosting, CI/CD automation, and on-page technical SEO."
    ]
  }
];

const education = [
  {
    degree: "Bachelor of Technology (B.Tech) - Computer Science Engineering",
    institution: "UIET, Maharshi Dayanand University",
    period: "2018 - 2022",
    score: "First Class with Distinction"
  }
];

const resumeUrl =
  "https://drive.google.com/file/d/1PGb6PrPcNRpGS68vi10P8psISD2H-Wx2/view?usp=sharing";

export default function Experience() {
  return (
    <section className="experience" id="experience">
      <div className="exp-wrap">
        <div className="exp-header">
          <span className="svc-eyebrow">Career Journey</span>
          <h2 className="heading">
            Experience &amp; <span>Education</span>
          </h2>
          <p className="exp-subheading">
            Where I&apos;ve worked, what I&apos;ve led, and the foundation behind it.
          </p>
        </div>

        <div className="exp-layout">
          {/* Left: work experience timeline */}
          <div className="exp-col">
            <div className="exp-col-title">
              <span className="exp-col-icon">
                <Briefcase size={20} strokeWidth={1.75} aria-hidden="true" />
              </span>
              <h3>Work Experience</h3>
            </div>

            <ol className="exp-timeline">
              {experiences.map((exp) => (
                <li
                  key={exp.company}
                  className={`exp-item ${exp.current ? "is-current" : ""}`}
                >
                  <span className="exp-dot" aria-hidden="true" />
                  <div className="exp-card">
                    <div className="exp-card-top">
                      <span className="exp-period">
                        <CalendarDays size={14} strokeWidth={2} aria-hidden="true" />
                        {exp.period}
                      </span>
                      {exp.current && <span className="exp-current">Current</span>}
                    </div>
                    <h4>{exp.role}</h4>
                    <p className="exp-company">
                      <strong>{exp.company}</strong>
                      <span>
                        <MapPin size={14} strokeWidth={2} aria-hidden="true" />
                        {exp.location}
                      </span>
                    </p>
                    <ul className="exp-points">
                      {exp.details.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Right: education */}
          <aside className="exp-col exp-side" id="education">
            <div className="exp-col-title">
              <span className="exp-col-icon">
                <GraduationCap size={20} strokeWidth={1.75} aria-hidden="true" />
              </span>
              <h3>Education</h3>
            </div>

            {education.map((edu) => (
              <div key={edu.degree} className="exp-card edu-card">
                <span className="exp-period">
                  <CalendarDays size={14} strokeWidth={2} aria-hidden="true" />
                  {edu.period}
                </span>
                <h4>{edu.degree}</h4>
                <p className="edu-institution">{edu.institution}</p>
                <span className="edu-score">
                  <Award size={16} strokeWidth={2} aria-hidden="true" />
                  {edu.score}
                </span>
              </div>
            ))}

            <div className="exp-resume">
              <p className="exp-resume-title">Want the full picture?</p>
              <p className="exp-resume-text">
                Download my resume for a detailed overview of my projects, skills and responsibilities.
              </p>
              <a href={resumeUrl} target="_blank" rel="noreferrer" className="exp-resume-btn">
                View Resume <ArrowUpRight size={16} strokeWidth={2} aria-hidden="true" />
              </a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
