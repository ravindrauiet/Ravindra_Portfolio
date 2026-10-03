import { PanelsTopLeft, Server, Database, Smartphone } from "lucide-react";

const skillCategories = [
  {
    title: "Frontend Development",
    Icon: PanelsTopLeft,
    skills: [
      { name: "ReactJS", icon: "fab fa-react", projects: 5 },
      { name: "HTML5", icon: "fab fa-html5", projects: 12 },
      { name: "CSS3", icon: "fab fa-css3-alt", projects: 12 },
      { name: "JavaScript", icon: "fab fa-js-square", projects: 15 },
      { name: "TailwindCSS", icon: "fas fa-wind", projects: 4 },
      { name: "Bootstrap", icon: "fab fa-bootstrap", projects: 8 },
      { name: "MaterialUI", icon: "fas fa-palette", projects: 6 }
    ]
  },
  {
    title: "Backend Development",
    Icon: Server,
    skills: [
      { name: "NodeJS", icon: "fab fa-node-js", projects: 10 },
      { name: "ExpressJS", icon: "fab fa-node", projects: 10 },
      { name: "Python", icon: "fab fa-python", projects: 6 },
      { name: "PHP", icon: "fab fa-php", projects: 4 },
      { name: "RESTful APIs", icon: "fas fa-code", projects: 12 },
      { name: "JWT Auth", icon: "fas fa-shield-alt", projects: 8 }
    ]
  },
  {
    title: "Databases & Cloud",
    Icon: Database,
    skills: [
      { name: "MongoDB", icon: "fas fa-database", projects: 10 },
      { name: "MySQL", icon: "fas fa-server", projects: 5 },
      { name: "Firebase", icon: "fas fa-fire", projects: 7 },
      { name: "AWS EC2 / S3", icon: "fab fa-aws", projects: 6 }
    ]
  },
  {
    title: "Mobile & Tools",
    Icon: Smartphone,
    skills: [
      { name: "React Native", icon: "fab fa-react", projects: 6 },
      { name: "Flutter", icon: "fas fa-mobile-alt", projects: 3 },
      { name: "Git & GitHub", icon: "fab fa-github", projects: 20 },
      { name: "Docker", icon: "fab fa-docker", projects: 4 }
    ]
  }
];

export default function Skills() {
  return (
    <section className="skills" id="skills">
      <div className="skl-wrap">
        <div className="skl-header">
          <span className="svc-eyebrow">Tech Stack</span>
          <h2 className="heading">
            Skills &amp; <span>Abilities</span>
          </h2>
          <p className="skl-subheading">
            The languages, frameworks and platforms I use to design, build and ship production software.
          </p>
        </div>

        <div className="skl-grid">
          {skillCategories.map(({ title, Icon, skills }) => (
            <div key={title} className="skl-card">
              <div className="skl-card-header">
                <div className="skl-card-icon">
                  <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
                </div>
                <h3>{title}</h3>
                <span className="skl-count">{skills.length} skills</span>
              </div>

              <ul className="skl-list">
                {skills.map((skill) => (
                  <li key={skill.name} className="skl-item">
                    <span className="skl-icon">
                      <i className={skill.icon} aria-hidden="true"></i>
                    </span>
                    <span className="skl-text">
                      <span className="skl-name">{skill.name}</span>
                      <span className="skl-projects">{skill.projects} projects</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
