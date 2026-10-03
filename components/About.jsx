import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone, CircleCheck, ArrowUpRight } from "lucide-react";

const details = [
  {
    Icon: Mail,
    label: "Email",
    value: "ravindranathjha76@gmail.com",
    href: "mailto:ravindranathjha76@gmail.com"
  },
  {
    Icon: Phone,
    label: "Phone",
    value: "+91 9354156323",
    href: "tel:9354156323"
  },
  {
    Icon: MapPin,
    label: "Location",
    value: "Faridabad, India - 121003"
  },
  {
    Icon: CircleCheck,
    label: "Availability",
    value: "Open to freelance & full-time"
  }
];

const resumeUrl =
  "https://drive.google.com/file/d/1PGb6PrPcNRpGS68vi10P8psISD2H-Wx2/view?usp=sharing";

export default function About() {
  return (
    <section className="about" id="about">
      <div className="abt-wrap">
        <div className="abt-header">
          <span className="svc-eyebrow">About Me</span>
          <h2 className="heading">
            Get to know <span>me</span>
          </h2>
        </div>

        <div className="abt-layout">
          <div className="abt-photo">
            <Image
              src="/assets/images/Ravindraprofile.jpeg"
              alt="Ravindra Nath Jha"
              width={720}
              height={1280}
              sizes="(max-width: 991px) 80vw, 420px"
              draggable={false}
            />
            <div className="abt-photo-card">
              <strong>{new Date().getFullYear() - 2021}+ years</strong>
              <span>building web &amp; mobile products</span>
            </div>
          </div>

          <div className="abt-content">
            <h3>I&apos;m Ravindra Nath Jha</h3>
            <p className="abt-role">Team Lead &amp; Full Stack Development Specialist</p>

            <div className="abt-bio">
              <p>
                As a Team Lead at Townmanor Technology and former Senior Software Engineer, I&apos;ve built
                extensive experience across diverse technology domains. My career spans leadership roles in
                established companies and startups, including significant contributions to &quot;Puja Karo&quot;
                where I helped build innovative solutions from the ground up.
              </p>
              <p>
                I&apos;ve delivered projects spanning MERN stack, Python, PHP, and mobile development using React
                Native, Flutter, and Expo. My specialty is e-commerce platforms, food delivery applications, and
                CRM systems with integrated AI capabilities using OpenAI and Gemini APIs, deployed on AWS (EC2,
                Lambda, S3), Firebase and Azure, with a focus on scalable, high-performance applications that
                drive business growth.
              </p>
            </div>

            <ul className="abt-details">
              {details.map(({ Icon, label, value, href }) => (
                <li key={label}>
                  <span className="abt-detail-icon">
                    <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <span className="abt-detail-text">
                    <span className="abt-detail-label">{label}</span>
                    {href ? (
                      <a href={href} className="abt-detail-value">
                        {value}
                      </a>
                    ) : (
                      <span className="abt-detail-value">{value}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>

            <div className="abt-ctas">
              <a href={resumeUrl} target="_blank" rel="noreferrer" className="abt-btn abt-btn-primary">
                View Resume <ArrowUpRight size={16} strokeWidth={2} aria-hidden="true" />
              </a>
              <Link href="#contact" className="abt-btn abt-btn-secondary">
                Let&apos;s Talk
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
