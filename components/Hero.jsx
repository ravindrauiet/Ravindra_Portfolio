"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function Hero() {
  const roles = [
    "Web Development",
    "frontend development",
    "backend development",
    "MERN Stack Specialist",
    "Machine Learning"
  ];
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const canvasRef = useRef(null);

  // Typing effect
  useEffect(() => {
    const currentRole = roles[roleIndex];
    let speed = isDeleting ? 40 : 80;

    if (!isDeleting && displayText === currentRole) {
      speed = 1800; // Pause at full word
    } else if (isDeleting && displayText === "") {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % roles.length);
      speed = 200;
    }

    const timer = setTimeout(() => {
      setDisplayText((prev) =>
        isDeleting
          ? currentRole.substring(0, prev.length - 1)
          : currentRole.substring(0, prev.length + 1)
      );
      if (!isDeleting && displayText === currentRole) {
        setIsDeleting(true);
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, roleIndex, roles]);

  // Particles JS & Lottie loader
  useEffect(() => {
    // 1. Canvas particle constellation effect
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    let width = (canvas.width = canvas.parentElement.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement.offsetHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement.offsetHeight || window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const particlesCount = Math.floor(Math.min(width, 1400) / 14);
    const particles = [];

    for (let i = 0; i < particlesCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        radius: Math.random() * 2 + 1.5
      });
    }

    let mouseX = -1000;
    let mouseY = -1000;
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    canvas.parentElement.addEventListener("mousemove", handleMouseMove);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const alpha = (1 - dist / 130) * 0.35;
            ctx.strokeStyle = `rgba(100, 100, 100, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Mouse repulse
        const mdx = p.x - mouseX;
        const mdy = p.y - mouseY;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 100) {
          const angle = Math.atan2(mdy, mdx);
          const force = (100 - mdist) * 0.05;
          p.x += Math.cos(angle) * force;
          p.y += Math.sin(angle) * force;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(60, 60, 60, 0.6)";
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    // 2. Load Lottie animation into container
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.9.6/lottie.min.js";
    script.async = true;
    script.onload = () => {
      const container = document.getElementById("hero-lottie-container");
      if (window.lottie && container) {
        container.innerHTML = "";
        window.lottie.loadAnimation({
          container: container,
          renderer: "svg",
          loop: true,
          autoplay: true,
          path: "https://assets8.lottiefiles.com/private_files/lf30_WdTEui.json"
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (canvas.parentElement) {
        canvas.parentElement.removeEventListener("mousemove", handleMouseMove);
      }
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <section className="home" id="home">
      {/* Particles Mesh Background */}
      <div id="particles-js">
        <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
      </div>

      <div className="content">
        <h2>
          Hi There,
          <br /> I'm Ravindra <span style={{ color: "#ff7b00", fontWeight: 800 }}>Nath</span> Jha
        </h2>
        <p style={{ fontSize: "2.5rem", color: "#000", fontWeight: 600, padding: "1rem 0" }}>
          I Am Into{" "}
          <span className="typing-text" style={{ color: "rgb(148, 8, 8)", fontWeight: 600 }}>
            {displayText}
          </span>
          <span className="cursor-blink" style={{ color: "rgb(148, 8, 8)" }}>|</span>
        </p>

        {/* CTA Button and Lottie Illustration Row */}
        <div className="cta-buttons" style={{ display: "flex", alignItems: "center", gap: "2rem", marginTop: "1.5rem" }}>
          <Link href="#contact" className="btn hire-btn" style={{ position: "relative" }}>
            <span>Hire Me</span>
            <i className="fas fa-briefcase" style={{ marginLeft: "0.5rem" }}></i>
          </Link>
          <div className="hero-lottie" style={{ width: "160px", height: "120px" }}>
            <div id="hero-lottie-container" className="lottie-container" style={{ width: "100%", height: "100%" }}></div>
          </div>
        </div>

        {/* Social Icons */}
        <div className="socials" style={{ marginTop: "2.5rem" }}>
          <ul className="social-icons">
            <li>
              <a
                href="https://github.com/ravindrauiet"
                className="github"
                aria-label="GitHub"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fab fa-github"></i>
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/ravindra-jha75/"
                className="linkedin"
                aria-label="LinkedIn"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fab fa-linkedin"></i>
              </a>
            </li>
            <li>
              <a
                href="mailto:ravindranathjha76@gmail.com"
                className="mail"
                aria-label="Mail"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fas fa-envelope"></i>
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com/"
                className="twitter"
                aria-label="Twitter"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fab fa-twitter"></i>
              </a>
            </li>
            <li>
              <a
                href="https://t.me/"
                className="telegram"
                aria-label="Telegram"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fab fa-telegram-plane"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom-left floating chat widget */}
      <a
        href="#contact"
        aria-label="Chat"
        style={{
          position: "fixed",
          bottom: "25px",
          left: "25px",
          width: "50px",
          height: "50px",
          backgroundColor: "#ffc107",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
          zIndex: 9999,
          color: "#000",
          fontSize: "1.5rem"
        }}
      >
        <i className="fas fa-comment"></i>
      </a>
    </section>
  );
}
