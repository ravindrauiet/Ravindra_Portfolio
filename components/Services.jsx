"use client";
import { useState } from "react";
import Link from "next/link";
import {
  MonitorSmartphone,
  BrainCircuit,
  ServerCog,
  CloudCog,
  TrendingUp,
  Rocket,
  Clock,
  ShieldCheck,
  Handshake
} from "lucide-react";

const serviceIcons = {
  "web-mobile": MonitorSmartphone,
  ai: BrainCircuit,
  backend: ServerCog,
  cloud: CloudCog,
  seo: TrendingUp
};

export default function Services() {
  const [activeFilter, setActiveFilter] = useState("all");

  const services = [
    {
      id: "web-mobile",
      featured: true,
      category: "web-mobile",
      iconClass: "fas fa-laptop-code",
      badgeType: "primary-badge",
      statTag: "Most Requested",
      pillTag: "Full-Stack",
      title: "Web & Mobile App Development",
      summary:
        "Designing and engineering high-performance, responsive web applications and native cross-platform iOS & Android mobile apps tailored for growth.",
      features: [
        { icon: "fas fa-globe", label: "Business Portfolios" },
        { icon: "fas fa-shopping-cart", label: "E-Commerce Stores" },
        { icon: "fas fa-utensils", label: "Food Delivery Apps" },
        { icon: "fas fa-chart-line", label: "Enterprise CRMs" },
        { icon: "fab fa-android", label: "iOS & Android Apps" }
      ],
      techStack: [
        { icon: "fab fa-react", label: "React / React Native" },
        { icon: "fab fa-node-js", label: "Node.js" },
        { icon: "fab fa-python", label: "Python" },
        { icon: "fab fa-php", label: "PHP" },
        { icon: "fas fa-mobile-alt", label: "Flutter" }
      ],
      guarantee: "100% Custom Code"
    },
    {
      id: "ai",
      featured: false,
      category: "ai",
      iconClass: "fas fa-robot",
      badgeType: "ai-badge",
      pillTag: "Next-Gen",
      title: "AI & Smart Agent Solutions",
      summary:
        "Integrating intelligent AI agents, customer support chatbots, and automated ML workflows directly into modern platforms.",
      features: [
        { icon: "fas fa-comments", label: "AI Support Chatbots" },
        { icon: "fas fa-brain", label: "OpenAI & Gemini API" },
        { icon: "fas fa-cogs", label: "Automated Workflows" }
      ],
      techStack: [
        { icon: "fab fa-python", label: "Python" },
        { icon: "fas fa-robot", label: "OpenAI" },
        { icon: "fas fa-brain", label: "Gemini" }
      ]
    },
    {
      id: "backend",
      featured: false,
      category: "backend",
      iconClass: "fas fa-plug",
      badgeType: "api-badge",
      pillTag: "Scalable",
      title: "API & Backend Systems",
      summary:
        "Architecting secure, lightning-fast RESTful APIs, microservices, authentication systems, and optimized database schemas.",
      features: [
        { icon: "fas fa-exchange-alt", label: "RESTful Services" },
        { icon: "fas fa-shield-alt", label: "JWT Security" },
        { icon: "fas fa-database", label: "MongoDB & MySQL" }
      ],
      techStack: [
        { icon: "fab fa-node-js", label: "Node / Express" },
        { icon: "fab fa-python", label: "Django" },
        { icon: "fas fa-database", label: "MongoDB" }
      ]
    },
    {
      id: "cloud",
      featured: false,
      category: "cloud",
      iconClass: "fas fa-cloud",
      badgeType: "cloud-badge",
      pillTag: "DevOps",
      title: "Cloud & DevOps Deployment",
      summary:
        "Deploying web applications with zero downtime, VPS managed hosting, Cloudflare security, and GitHub Actions CI/CD pipelines.",
      features: [
        { icon: "fab fa-aws", label: "AWS & Firebase" },
        { icon: "fas fa-server", label: "VPS Hosting" },
        { icon: "fab fa-github", label: "CI/CD Automation" }
      ],
      techStack: [
        { icon: "fab fa-aws", label: "AWS" },
        { icon: "fas fa-fire", label: "Firebase" },
        { icon: "fab fa-cloudflare", label: "Cloudflare" }
      ]
    },
    {
      id: "seo",
      featured: false,
      category: "seo",
      iconClass: "fas fa-search",
      badgeType: "seo-badge",
      pillTag: "Growth",
      title: "SEO & Performance Optimization",
      summary:
        "Optimizing page load speed, technical sitemaps, on-page search engine indexing, and Google Analytics conversion tracking.",
      features: [
        { icon: "fas fa-tachometer-alt", label: "Speed Audit" },
        { icon: "fas fa-sitemap", label: "Technical SEO" },
        { icon: "fas fa-chart-pie", label: "Analytics Setup" }
      ],
      techStack: [
        { icon: "fab fa-google", label: "Analytics" },
        { icon: "fab fa-searchengin", label: "SEO Tools" }
      ]
    }
  ];

  const tabs = [
    { id: "all", label: "All Services" },
    { id: "web-mobile", label: "Web & Mobile" },
    { id: "ai", label: "AI & Smart" },
    { id: "backend", label: "API & Backend" },
    { id: "cloud", label: "Cloud & DevOps" },
    { id: "seo", label: "SEO & Analytics" }
  ];

  const reasons = [
    {
      Icon: Rocket,
      label: "Top Quality",
      title: "Expert Full-Stack Development",
      text: "Clean, maintainable code architecture engineered with modern web and mobile frameworks."
    },
    {
      Icon: Clock,
      label: "On-Time",
      title: "Agile & Timely Delivery",
      text: "Milestone-driven progress with regular updates and fast, predictable project turnaround times."
    },
    {
      Icon: ShieldCheck,
      label: "Tested",
      title: "Rigorous Quality Assurance",
      text: "Comprehensive automated testing, continuous monitoring, and free post-launch support."
    },
    {
      Icon: Handshake,
      label: "5.0 ★ Rating",
      title: "100% Client Satisfaction",
      text: "Transparent communication, full code ownership, and dedicated post-deployment support."
    }
  ];

  const filteredServices =
    activeFilter === "all"
      ? services
      : services.filter((s) => s.category === activeFilter);

  return (
    <section className="services" id="services">
      <div className="svc-wrap">
        <div className="svc-header">
          <span className="svc-eyebrow">Professional Services</span>
          <h2 className="heading">
            Freelancing <span>Services</span>
          </h2>
          <p className="svc-subheading">
            End-to-end web, mobile, AI &amp; cloud solutions engineered for startups &amp; modern enterprises.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="svc-tabs" role="toolbar" aria-label="Filter services">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`svc-tab ${activeFilter === tab.id ? "is-active" : ""}`}
              aria-pressed={activeFilter === tab.id}
              onClick={() => setActiveFilter(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Service Cards */}
        <div className="svc-grid">
          {filteredServices.map((svc) => {
            const ServiceIcon = serviceIcons[svc.id];
            return (
              <article
                key={svc.id}
                className={`svc-card ${svc.featured ? "svc-card-featured" : ""}`}
              >
                <div className="svc-card-top">
                  <div className="svc-icon">
                    <ServiceIcon size={26} strokeWidth={1.75} aria-hidden="true" />
                  </div>
                  {svc.statTag ? (
                    <span className="svc-highlight">{svc.statTag}</span>
                  ) : (
                    <span className="svc-label">{svc.pillTag}</span>
                  )}
                </div>
  
                <h3>{svc.title}</h3>
                <p className="svc-summary">{svc.summary}</p>
  
                <ul className="svc-features">
                  {svc.features.map((feat) => (
                    <li key={feat.label}>
                      <i className="fas fa-check"></i> {feat.label}
                    </li>
                  ))}
                </ul>
  
                <p className="svc-stack">
                  <span>Stack</span>
                  {svc.techStack.map((tech) => tech.label).join(" · ")}
                </p>
  
                <div className="svc-card-footer">
                  <Link href="#contact" className={svc.featured ? "svc-btn" : "svc-link"}>
                    {svc.featured ? "Start a Project" : "Hire Me"}{" "}
                    <i className="fas fa-arrow-right"></i>
                  </Link>
                  {svc.guarantee && (
                    <span className="svc-guarantee">
                      <i className="fas fa-shield-alt"></i> {svc.guarantee}
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {/* Why Choose My Services */}
        <div className="svc-why">
          <div className="svc-why-header">
            <h3>
              Why Choose <span>My Services?</span>
            </h3>
            <p>
              Delivering high-performance, scalable, and secure digital solutions tailored to your business goals.
            </p>
          </div>
          <div className="svc-why-grid">
            {reasons.map((r) => (
              <div key={r.title} className="svc-why-card">
                <div className="svc-why-icon">
                  <r.Icon size={22} strokeWidth={1.75} aria-hidden="true" />
                </div>
                <span className="svc-why-label">{r.label}</span>
                <h4>{r.title}</h4>
                <p>{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
