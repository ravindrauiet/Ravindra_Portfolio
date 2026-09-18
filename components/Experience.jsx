export default function Experience() {
  const experiences = [
    {
      role: "Team Lead & Full Stack Developer Specialist",
      company: "Townmanor Technology",
      period: "Sept 2024 - Present",
      location: "Faridabad, India",
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

  return (
    <section className="experience" id="experience">
      <h2 className="heading">
        <i className="fas fa-briefcase"></i> Experience & <span>Education</span>
      </h2>

      <div className="timeline">
        <div className="container left">
          <div className="content">
            <div className="tag">
              <h2>Work Experience</h2>
            </div>
            {experiences.map((exp, idx) => (
              <div key={idx} className="desc" style={{ marginBottom: "2rem" }}>
                <h3>{exp.role}</h3>
                <p style={{ color: "#2506ad", fontWeight: 700 }}>
                  {exp.company} | <span>{exp.period}</span>
                </p>
                <ul style={{ paddingLeft: "1.5rem", marginTop: "0.8rem" }}>
                  {exp.details.map((item, dIdx) => (
                    <li key={dIdx} style={{ fontSize: "0.95rem", marginBottom: "0.4rem" }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="container right" id="education">
          <div className="content">
            <div className="tag">
              <h2>Education</h2>
            </div>
            {education.map((edu, idx) => (
              <div key={idx} className="desc">
                <h3>{edu.degree}</h3>
                <p style={{ color: "#2506ad", fontWeight: 700 }}>
                  {edu.institution} | <span>{edu.period}</span>
                </p>
                <p style={{ marginTop: "0.6rem", fontWeight: 600 }}>{edu.score}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
