"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CodeXml, ArrowRight } from "lucide-react";

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

const filters = [
  { id: "all", label: "All Projects" },
  { id: "mern", label: "MERN Stack" },
  { id: "ai", label: "AI & Smart" },
  { id: "android", label: "Mobile Apps" }
];

const categoryLabels = {
  mern: "MERN Stack",
  ai: "AI Product",
  android: "Mobile App"
};

const MAX_TECH = 4;

export default function Projects() {
  const [filter, setFilter] = useState("all");

  const filteredProjects =
    filter === "all"
      ? projectData
      : projectData.filter((p) => p.category === filter);

  return (
    <section className="work" id="work">
      <div className="prj-wrap">
        <div className="prj-header">
          <span className="svc-eyebrow">Portfolio</span>
          <h2 className="heading">
            Projects <span>Made</span>
          </h2>
          <p className="prj-subheading">
            A selection of web platforms, AI products and mobile apps I&apos;ve designed, built and shipped.
          </p>
        </div>

        <div className="svc-tabs" role="toolbar" aria-label="Filter projects">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`svc-tab ${filter === f.id ? "is-active" : ""}`}
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="prj-grid">
          {filteredProjects.map((project) => {
            const isMobile = project.category === "android";
            const hasDemo = project.links.view && project.links.view !== "#";
            const extraTech = project.tech_stack.length - MAX_TECH;

            return (
              <article key={project.name} className="prj-card">
                <div className={`prj-media ${isMobile ? "prj-media-mobile" : ""}`}>
                  <div className="prj-media-frame">
                    <Image
                      src={`/assets/images/projects/${project.image}`}
                      alt={`${project.name} screenshot`}
                      fill
                      sizes={isMobile ? "200px" : "(max-width: 700px) 100vw, (max-width: 1024px) 50vw, 400px"}
                      draggable={false}
                    />
                  </div>
                </div>

                <div className="prj-body">
                  <span className="prj-category">{categoryLabels[project.category]}</span>
                  <h3>{project.name}</h3>
                  <p className="prj-desc">{project.desc}</p>

                  <ul className="prj-tech">
                    {project.tech_stack.slice(0, MAX_TECH).map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                    {extraTech > 0 && <li className="prj-tech-more">+{extraTech}</li>}
                  </ul>

                  <div className="prj-links">
                    {hasDemo && (
                      <a href={project.links.view} target="_blank" rel="noreferrer" className="prj-link-primary">
                        Live Demo <ArrowUpRight size={16} strokeWidth={2} aria-hidden="true" />
                      </a>
                    )}
                    {project.links.code && (
                      <a href={project.links.code} target="_blank" rel="noreferrer" className="prj-link">
                        <CodeXml size={16} strokeWidth={2} aria-hidden="true" /> Source Code
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="prj-viewall">
          <Link href="/projects" className="prj-viewall-btn">
            View All Projects <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
