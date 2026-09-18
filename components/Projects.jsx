"use client";
import { useState } from "react";
import Link from "next/link";

const projectData = [
  {
    name: "PujaKaro",
    desc: "MERN stack project with Firebase database integration. It features Google authentication, booking services, and an admin dashboard for streamlined management.",
    image: "pujakaro.png",
    category: "mern",
    tech_stack: ["React", "Node.js", "Express", "MongoDB", "Firebase", "Google Auth"],
    links: {
      view: "https://www.pujakaro.in/",
      code: "https://github.com/PujaKaro/frontend-vercel"
    }
  },
  {
    name: "Relove WebApp",
    desc: "An AI-based project that integrates Gemini AI to filter data and find the best products, leveraging a trained model. It also includes an AI-powered form submission feature.",
    image: "relove.png",
    category: "ai",
    tech_stack: ["React", "Node.js", "Express", "MongoDB", "Gemini AI"],
    links: {
      view: "https://gloupwebapp.vercel.app/",
      code: "https://github.com/ravindrauiet/gloupwebapp"
    }
  },
  {
    name: "Relove Mobile App",
    desc: "A comprehensive mobile application that incorporates all key features for a superior user experience, building on the functionalities of its web counterpart.",
    image: "reloveapp.png",
    category: "android",
    tech_stack: ["React Native", "Expo", "Node.js", "MongoDB", "Firebase"],
    links: {
      view: "#",
      code: "https://github.com/ravindrauiet"
    }
  },
  {
    name: "Townmanor.ai",
    desc: "A cutting-edge AI-powered platform that integrates advanced machine learning algorithms to enhance user interactions and automate real estate processes.",
    image: "townmanor.png",
    category: "ai",
    tech_stack: ["React", "Python", "Node.js", "MongoDB", "AWS"],
    links: {
      view: "https://townmanor.ai/",
      code: "https://github.com/ravindrauiet"
    }
  },
  {
    name: "Fastag Bajaj APP",
    desc: "A mobile application built with Expo and React Native, integrating with the Bajaj API to deliver fastag functionalities with seamless API connectivity.",
    image: "fastag.png",
    category: "android",
    tech_stack: ["React Native", "Expo", "Node.js", "RESTful API", "Redux"],
    links: {
      view: "#",
      code: "https://github.com/ravindrauiet/fastag_bajaj_api"
    }
  },
  {
    name: "Mobile Store CRM APP",
    desc: "A React Native (Expo) based CRM solution tailored for mobile retail stores, providing inventory management, sales tracking, and customer relationship tools.",
    image: "Mobile-Store-CRM.png",
    category: "android",
    tech_stack: ["React Native", "Expo", "Node.js", "MongoDB"],
    links: {
      view: "#",
      code: "https://github.com/ravindrauiet"
    }
  }
];

export default function Projects() {
  const [filter, setFilter] = useState("all");

  const filteredProjects =
    filter === "all"
      ? projectData
      : projectData.filter((p) => p.category === filter);

  return (
    <section className="work" id="work">
      <h2 className="heading">
        <i className="fas fa-laptop-code"></i> Projects <span>Made</span>
      </h2>

      <div className="project-filters">
        <button
          className={`filter-btn ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All Projects
        </button>
        <button
          className={`filter-btn ${filter === "mern" ? "active" : ""}`}
          onClick={() => setFilter("mern")}
        >
          MERN Stack
        </button>
        <button
          className={`filter-btn ${filter === "ai" ? "active" : ""}`}
          onClick={() => setFilter("ai")}
        >
          AI & Smart
        </button>
        <button
          className={`filter-btn ${filter === "android" ? "active" : ""}`}
          onClick={() => setFilter("android")}
        >
          Mobile Apps
        </button>
      </div>

      <div className="box-container">
        {filteredProjects.map((project, idx) => (
          <div key={idx} className="box tilt">
            <img
              draggable="false"
              src={`/assets/images/projects/${project.image}`}
              alt={project.name}
              onError={(e) => {
                e.currentTarget.src = "/assets/images/Ravindraprofile.jpeg";
              }}
            />
            <div className="content">
              <div className="tag">
                <h3>{project.name}</h3>
              </div>
              <div className="desc">
                <p>{project.desc}</p>
                <div className="tech-stack">
                  {project.tech_stack.map((t, i) => (
                    <span key={i} className="tech-badge">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="btns">
                  {project.links.view && project.links.view !== "#" && (
                    <a
                      href={project.links.view}
                      className="btn"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <i className="fas fa-eye"></i> View
                    </a>
                  )}
                  {project.links.code && (
                    <a
                      href={project.links.code}
                      className="btn"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Code <i className="fas fa-code"></i>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="viewall">
        <Link href="/projects" className="btn">
          <span>View All Projects</span>
          <i className="fas fa-arrow-right"></i>
        </Link>
      </div>
    </section>
  );
}
