"use client";
import { useState } from "react";
import Link from "next/link";

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

  const filteredServices =
    activeFilter === "all"
      ? services
      : services.filter((s) => s.category === activeFilter);

  return (
    <section className="services" id="services">
      <div className="services-header-tag">
        <i className="fas fa-sparkles"></i> PROFESSIONAL SERVICES
      </div>
      <h2 className="heading">
        <i className="fas fa-briefcase"></i> Freelancing <span>Services</span>
      </h2>
      <p className="services-sub-heading">
        End-to-end web, mobile, AI & cloud solutions engineered for startups & modern enterprises.
      </p>

      <div className="container">
        {/* Filter Tabs */}
        <div className="service-category-tabs">
          {[
            { id: "all", label: "All Services", icon: "fas fa-th-large" },
            { id: "web-mobile", label: "Web & Mobile", icon: "fas fa-laptop-code" },
            { id: "ai", label: "AI & Smart", icon: "fas fa-robot" },
            { id: "backend", label: "API & Backend", icon: "fas fa-plug" },
            { id: "cloud", label: "Cloud & DevOps", icon: "fas fa-cloud" },
            { id: "seo", label: "SEO & Analytics", icon: "fas fa-search" }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`svc-tab-btn ${activeFilter === tab.id ? "active" : ""}`}
              onClick={() => setActiveFilter(tab.id)}
            >
              <i className={tab.icon}></i> {tab.label}
            </button>
          ))}
        </div>

        {/* Bento Grid */}
        <div className="bento-services-grid">
          {filteredServices.map((svc) => (
            <div
              key={svc.id}
              className={`bento-card ${svc.featured ? "bento-featured" : ""}`}
            >
              <div className="bento-card-top">
                <div className={`bento-icon-badge ${svc.badgeType}`}>
                  <i className={svc.iconClass}></i>
                </div>
                <div className="bento-meta-tags">
                  {svc.statTag && (
                    <span className="bento-stat-chip">
                      <i className="fas fa-crown"></i> {svc.statTag}
                    </span>
                  )}
                  <span className="bento-tag-pill">{svc.pillTag}</span>
                </div>
              </div>

              <div className="bento-card-body">
                <h3>{svc.title}</h3>
                <p className="bento-summary">{svc.summary}</p>

                <div className="bento-feature-pills">
                  {svc.features.map((feat, idx) => (
                    <span key={idx} className="pill-badge">
                      <i className={feat.icon}></i> {feat.label}
                    </span>
                  ))}
                </div>

                <div className="bento-tech-stack">
                  {svc.techStack.map((tech, idx) => (
                    <span key={idx} className="tech-chip">
                      <i className={tech.icon}></i> {tech.label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bento-card-footer">
                <Link href="#contact" className={svc.featured ? "bento-btn" : "bento-link"}>
                  {svc.featured ? (
                    <>
                      <i className="fas fa-paper-plane"></i> Start a Project{" "}
                      <i className="fas fa-arrow-right"></i>
                    </>
                  ) : (
                    <>
                      Hire Me <i className="fas fa-arrow-right"></i>
                    </>
                  )}
                </Link>
                {svc.guarantee && (
                  <span className="bento-guarantee-tag">
                    <i className="fas fa-shield-alt"></i> {svc.guarantee}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Why Choose My Services */}
        <div className="services-info">
          <div className="why-choose-header">
            <h3>
              <i className="fas fa-star"></i> Why Choose <span>My Services?</span>
            </h3>
            <p className="why-choose-subtitle">
              Delivering high-performance, scalable, and secure digital solutions tailored to your business goals.
            </p>
          </div>
          <div className="bento-why-grid">
            <div className="bento-why-card">
              <div className="why-card-top">
                <div className="why-icon-badge">
                  <i className="fas fa-rocket"></i>
                </div>
                <span className="why-stat-badge">Top Quality</span>
              </div>
              <h4>Expert Full-Stack Development</h4>
              <p>Clean, maintainable code architecture engineered with modern web and mobile frameworks.</p>
            </div>
            <div className="bento-why-card">
              <div className="why-card-top">
                <div className="why-icon-badge">
                  <i className="fas fa-clock"></i>
                </div>
                <span className="why-stat-badge">On-Time</span>
              </div>
              <h4>Agile & Timely Delivery</h4>
              <p>Milestone-driven progress with regular updates and fast, predictable project turnaround times.</p>
            </div>
            <div className="bento-why-card">
              <div className="why-card-top">
                <div className="why-icon-badge">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <span className="why-stat-badge">Tested</span>
              </div>
              <h4>Rigorous Quality Assurance</h4>
              <p>Comprehensive automated testing, continuous monitoring, and free post-launch support.</p>
            </div>
            <div className="bento-why-card">
              <div className="why-card-top">
                <div className="why-icon-badge">
                  <i className="fas fa-handshake"></i>
                </div>
                <span className="why-stat-badge">5.0 ★ Rating</span>
              </div>
              <h4>100% Client Satisfaction</h4>
              <p>Transparent communication, full code ownership, and dedicated post-deployment support.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
