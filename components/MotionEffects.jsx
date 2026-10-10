"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Cards that tilt in 3D toward the cursor; max = maximum tilt in degrees.
// Their inner layers (icons, titles, buttons) pop forward via translateZ in CSS.
const TILT_TARGETS = [
  { selector: ".svc-card", max: 10 },
  { selector: ".prj-card", max: 12 },
  { selector: ".svc-why-card", max: 14 },
  { selector: ".exp-card", max: 6 },
  { selector: ".skl-card", max: 6 },
  { selector: ".abt-photo", max: 15 },
  { selector: ".nts-card", max: 10 },
  { selector: ".nts-visual", max: 14 }
];
const TILT_SELECTOR = TILT_TARGETS.map((t) => t.selector).join(", ");

// Elements that swing up in 3D when scrolled into view
const REVEAL_SELECTOR = [
  ".abt-header",
  ".abt-photo",
  ".abt-content",
  ".svc-header",
  ".svc-tabs",
  ".svc-card",
  ".svc-why-header",
  ".svc-why-card",
  ".prj-header",
  ".prj-card",
  ".prj-viewall",
  ".skl-header",
  ".skl-card",
  ".exp-header",
  ".exp-col-title",
  ".exp-item",
  ".edu-card",
  ".exp-resume",
  ".contact .heading",
  ".contact .container",
  ".footer .box",
  ".nts-hero-text",
  ".nts-visual",
  ".nts-card",
  ".lib-hero",
  ".lib-card",
  ".lib-how-card",
  ".lib-banner"
].join(", ");

export default function MotionEffects() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cleanups = [];

    // 1. 3D scroll reveal with a small stagger between siblings
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          revealObserver.unobserve(el);
          el.classList.add("is-visible");
          // Hand transforms back to hover/tilt once the entrance has finished
          setTimeout(() => {
            el.classList.remove("reveal", "is-visible");
            el.style.removeProperty("--reveal-delay");
          }, 1500);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );

    document.querySelectorAll(REVEAL_SELECTOR).forEach((el) => {
      // Skip anything already scrolled past (e.g. restored scroll position)
      if (el.getBoundingClientRect().bottom < 0) return;
      const index = el.parentElement
        ? Array.from(el.parentElement.children).indexOf(el)
        : 0;
      el.style.setProperty("--reveal-delay", `${(index % 4) * 110}ms`);
      el.classList.add("reveal");
      revealObserver.observe(el);
    });
    cleanups.push(() => revealObserver.disconnect());

    // 2. 3D tilt (mouse only), delegated so filtered/re-rendered cards work too
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      let current = null;

      const resetTilt = (el) => {
        el.style.transition = "transform 0.6s cubic-bezier(0.2, 0.7, 0.2, 1)";
        el.style.transform = "";
        el.classList.remove("is-tilting");
        setTimeout(() => {
          if (el !== current) el.style.transition = "";
        }, 600);
      };

      const handleTiltMove = (e) => {
        const el = e.target.closest?.(TILT_SELECTOR);
        if (current && current !== el) {
          resetTilt(current);
          current = null;
        }
        if (!el || el.classList.contains("reveal")) return;

        const target = TILT_TARGETS.find((t) => el.matches(t.selector));
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const rotateY = (px - 0.5) * 2 * target.max;
        const rotateX = (0.5 - py) * 2 * target.max;

        current = el;
        el.classList.add("is-tilting");
        el.style.transition = "transform 0.1s ease-out";
        el.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.03, 1.03, 1.03)`;
        el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
        el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
      };

      const handleTiltLeave = () => {
        if (current) {
          resetTilt(current);
          current = null;
        }
      };

      document.addEventListener("mousemove", handleTiltMove);
      document.documentElement.addEventListener("mouseleave", handleTiltLeave);
      cleanups.push(() => {
        document.removeEventListener("mousemove", handleTiltMove);
        document.documentElement.removeEventListener("mouseleave", handleTiltLeave);
      });
    }

    // 3. Hero: content rotates toward the mouse and tilts back into the
    //    screen on scroll; illustration and particles move as depth layers
    const hero = document.querySelector(".home");
    if (hero) {
      const content = hero.querySelector(".content");
      const lottie = hero.querySelector(".hero-lottie");
      const particles = hero.querySelector("#particles-js");
      let mx = 0;
      let my = 0;
      let frame = null;

      const render = () => {
        frame = null;
        const sy = Math.min(window.scrollY, window.innerHeight);
        if (content) {
          content.style.transform =
            `perspective(1200px) translate3d(${mx * -30}px, ${my * -20 + sy * 0.4}px, 0) ` +
            `rotateX(${my * -8 + sy * 0.035}deg) rotateY(${mx * 10}deg)`;
          content.style.setProperty("--hero-fade", String(Math.max(0.1, 1 - sy / 600)));
        }
        if (lottie) lottie.style.transform = `translate3d(${mx * -45}px, ${my * -30}px, 0)`;
        if (particles) particles.style.transform = `translate3d(${mx * 40}px, ${my * 28 + sy * 0.2}px, 0) scale(1.08)`;
      };
      const schedule = () => {
        if (!frame) frame = requestAnimationFrame(render);
      };

      const handleHeroMove = (e) => {
        const rect = hero.getBoundingClientRect();
        mx = (e.clientX - rect.left) / rect.width - 0.5;
        my = (e.clientY - rect.top) / rect.height - 0.5;
        schedule();
      };
      const handleHeroLeave = () => {
        mx = 0;
        my = 0;
        schedule();
      };

      render();
      hero.addEventListener("mousemove", handleHeroMove);
      hero.addEventListener("mouseleave", handleHeroLeave);
      window.addEventListener("scroll", schedule, { passive: true });
      cleanups.push(() => {
        if (frame) cancelAnimationFrame(frame);
        hero.removeEventListener("mousemove", handleHeroMove);
        hero.removeEventListener("mouseleave", handleHeroLeave);
        window.removeEventListener("scroll", schedule);
        [content, lottie, particles].forEach((el) => {
          if (el) {
            el.style.transform = "";
            el.style.removeProperty("--hero-fade");
          }
        });
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, [pathname]);

  return null;
}
