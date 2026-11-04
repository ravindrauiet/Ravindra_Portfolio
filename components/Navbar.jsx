"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Content first: learning sections lead, personal pages follow
const LINKS = [
  { href: "/", label: "Home", match: (p) => p === "/" },
  { href: "/notes", label: "Notes", match: (p) => p.startsWith("/notes") },
  { href: "/templates", label: "Templates", match: (p) => p.startsWith("/templates") },
  { href: "/prompts", label: "AI Prompts", match: (p) => p.startsWith("/prompts") },
  { href: "/projects", label: "Projects", match: (p) => p === "/projects" },
  { href: "/about", label: "About", match: (p) => p === "/about" },
  { href: "/contact", label: "Contact", match: (p) => p === "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
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
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                className={link.match(pathname) ? "active" : ""}
                href={link.href}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
