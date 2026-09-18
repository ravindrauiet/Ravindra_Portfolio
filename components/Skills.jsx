"use client";
import Link from "next/link";

export default function Skills() {
  const skillCategories = [
    {
      title: "Frontend Development",
      icon: "fas fa-code",
      skills: [
        { name: "ReactJS", icon: "fab fa-react", projects: 5, link: "/projects?tech=react" },
        { name: "HTML5", icon: "fab fa-html5", projects: 12, link: "/projects?tech=html5" },
        { name: "CSS3", icon: "fab fa-css3-alt", projects: 12, link: "/projects?tech=css3" },
        { name: "JavaScript", icon: "fab fa-js-square", projects: 15, link: "/projects?tech=javascript" },
        { name: "TailwindCSS", icon: "fas fa-wind", projects: 4, link: "/projects?tech=tailwind" },
        { name: "Bootstrap", icon: "fab fa-bootstrap", projects: 8, link: "/projects?tech=bootstrap" },
        { name: "MaterialUI", icon: "fas fa-palette", projects: 6, link: "/projects?tech=mui" }
      ]
    },
    {
      title: "Backend Development",
      icon: "fas fa-server",
      skills: [
        { name: "NodeJS", icon: "fab fa-node-js", projects: 10, link: "/projects?tech=nodejs" },
        { name: "ExpressJS", icon: "fab fa-node", projects: 10, link: "/projects?tech=express" },
        { name: "Python", icon: "fab fa-python", projects: 6, link: "/projects?tech=python" },
        { name: "PHP", icon: "fab fa-php", projects: 4, link: "/projects?tech=php" },
        { name: "RESTful APIs", icon: "fas fa-code", projects: 12, link: "/projects?tech=api" },
        { name: "JWT Auth", icon: "fas fa-shield-alt", projects: 8, link: "/projects?tech=jwt" }
      ]
    },
    {
      title: "Databases & Cloud",
      icon: "fas fa-database",
      skills: [
        { name: "MongoDB", icon: "fas fa-database", projects: 10, link: "/projects?tech=mongodb" },
        { name: "MySQL", icon: "fas fa-server", projects: 5, link: "/projects?tech=mysql" },
        { name: "Firebase", icon: "fas fa-fire", projects: 7, link: "/projects?tech=firebase" },
        { name: "AWS EC2 / S3", icon: "fab fa-aws", projects: 6, link: "/projects?tech=aws" }
      ]
    },
    {
      title: "Mobile & Tools",
      icon: "fas fa-tools",
      skills: [
        { name: "React Native", icon: "fab fa-react", projects: 6, link: "/projects?tech=react-native" },
        { name: "Flutter", icon: "fas fa-mobile-alt", projects: 3, link: "/projects?tech=flutter" },
        { name: "Git & GitHub", icon: "fab fa-github", projects: 20, link: "/projects?tech=git" },
        { name: "Docker", icon: "fab fa-docker", projects: 4, link: "/projects?tech=docker" }
      ]
    }
  ];

  return (
    <section className="skills" id="skills">
      <h2 className="heading">
        <i className="fas fa-laptop-code"></i> Skills & <span>Abilities</span>
      </h2>

      <div className="container">
        <div className="skills-categories">
          {skillCategories.map((cat, idx) => (
            <div key={idx} className="category">
              <div className="category-header">
                <div className="category-icon-badge">
                  <i className={cat.icon}></i>
                </div>
                <h3>{cat.title}</h3>
              </div>
              <div className="skills-grid">
                {cat.skills.map((skill, sIdx) => (
                  <div key={sIdx} className="skill-bento-chip" title={skill.name}>
                    <div className="skill-chip-left">
                      <div className="skill-icon-avatar">
                        <i className={skill.icon}></i>
                      </div>
                      <div className="skill-text-details">
                        <span className="skill-name">{skill.name}</span>
                        <span className="skill-projects-count">
                          {skill.projects} Projects Completed
                        </span>
                      </div>
                    </div>
                    <Link
                      href={skill.link}
                      className="skill-view-btn"
                      title={`View projects using ${skill.name}`}
                    >
                      <i className="fas fa-arrow-right"></i>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
