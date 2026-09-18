"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={scrolled ? "scrolled" : ""}>
      <Link href="/" className="logo">
        <i className="fab fa-node-js" style={{ color: "#43a047", marginRight: "6px" }}></i> Ravindra
      </Link>

      <div
        id="menu"
        className={`fas ${menuOpen ? "fa-times" : "fa-bars"}`}
        onClick={() => setMenuOpen(!menuOpen)}
      ></div>

      <nav className={`navbar ${menuOpen ? "nav-toggle" : ""}`}>
        <ul>
          <li>
            <Link
              className={pathname === "/" ? "active" : ""}
              href="/#home"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
          </li>
          <li>
            <Link href="/#about" onClick={() => setMenuOpen(false)}>
              About
            </Link>
          </li>
          <li>
            <Link
              className={pathname === "/skills" ? "active" : ""}
              href="/skills"
              onClick={() => setMenuOpen(false)}
            >
              Skills
            </Link>
          </li>
          <li>
            <Link href="/#education" onClick={() => setMenuOpen(false)}>
              Education
            </Link>
          </li>
          <li>
            <Link
              className={pathname === "/projects" ? "active" : ""}
              href="/projects"
              onClick={() => setMenuOpen(false)}
            >
              Work
            </Link>
          </li>
          <li>
            <Link
              className={pathname === "/experience" ? "active" : ""}
              href="/experience"
              onClick={() => setMenuOpen(false)}
            >
              Experience
            </Link>
          </li>
          <li>
            <Link href="/#contact" onClick={() => setMenuOpen(false)}>
              Contact
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

