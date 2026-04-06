/* ====================================================================
   SHARED 3D / AI EFFECTS — Skills · Projects · Experience
   Automatically detects which page it's on and applies relevant FX
   ==================================================================== */
(function SharedEffects() {
  'use strict';

  /* ── Detect current page ── */
  const PAGE = window.location.pathname.replace(/\//g, '') || 'home';

  /* ════════════════════════════════════════
     1. MATRIX BINARY RAIN (all pages)
  ════════════════════════════════════════ */
  (function matrixRain() {
    const c = document.createElement('canvas');
    c.id = 'matrix-rain-sub';
    c.style.cssText = `
      position:fixed;top:0;left:0;width:100%;height:100%;
      pointer-events:none;z-index:0;opacity:0.04;
    `;
    document.body.insertBefore(c, document.body.firstChild);

    const ctx = c.getContext('2d');
    let cols, drops;

    function resize() {
      c.width = window.innerWidth;
      c.height = window.innerHeight;
      cols = Math.floor(c.width / 16);
      drops = Array(cols).fill(Math.random() * 30 | 0);
    }
    resize();
    window.addEventListener('resize', resize);

    const chars = '01アイウエオABCDEFGHI∑∆∫√∞≈JKLMNOPQRSTUVWXYZ0123456789';

    setInterval(() => {
      ctx.fillStyle = 'rgba(15,23,42,0.07)';
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.fillStyle = '#00f2fe';
      ctx.font = '13px monospace';
      drops.forEach((y, i) => {
        ctx.globalAlpha = Math.random() * 0.6 + 0.2;
        ctx.fillText(chars[Math.random() * chars.length | 0], i * 16, y * 16);
        ctx.globalAlpha = 1;
        if (y * 16 > c.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
    }, 55);
  })();

  /* ════════════════════════════════════════
     2. AI GLOW CURSOR (all pages)
  ════════════════════════════════════════ */
  (function aiCursor() {
    if (document.getElementById('ai-cursor-outer')) return;

    const outer = document.createElement('div');
    outer.id = 'ai-cursor-outer';
    const inner = document.createElement('div');
    inner.id = 'ai-cursor-inner';
    document.body.appendChild(outer);
    document.body.appendChild(inner);

    const st = document.createElement('style');
    st.textContent = `
      body { cursor: none !important; }
      #ai-cursor-inner {
        position:fixed; width:9px; height:9px;
        background:#00f2fe; border-radius:50%;
        pointer-events:none; z-index:999999;
        transform:translate(-50%,-50%);
        box-shadow:0 0 12px #00f2fe, 0 0 28px rgba(0,242,254,0.4);
        transition: width .15s, height .15s;
      }
      #ai-cursor-outer {
        position:fixed; width:36px; height:36px;
        border:2px solid rgba(0,242,254,0.5);
        border-radius:50%; pointer-events:none;
        z-index:999998; transform:translate(-50%,-50%);
        mix-blend-mode:screen;
        transition: width .25s, height .25s, background .25s, border-color .25s;
      }
      body.c-hover #ai-cursor-outer {
        width:52px; height:52px;
        background:rgba(0,242,254,0.07);
        border-color:#00f2fe;
      }
      body.c-hover #ai-cursor-inner { width:5px; height:5px; }
      body.c-click #ai-cursor-outer {
        transform:translate(-50%,-50%) scale(0.75);
        background:rgba(0,242,254,0.18);
      }
      @media(max-width:768px) {
        #ai-cursor-inner,#ai-cursor-outer { display:none !important; }
        body { cursor:auto !important; }
      }
    `;
    document.head.appendChild(st);

    let ox = 0, oy = 0, tx = 0, ty = 0;
    document.addEventListener('mousemove', e => {
      tx = e.clientX; ty = e.clientY;
      inner.style.left = tx + 'px';
      inner.style.top  = ty + 'px';
    });
    document.addEventListener('mousedown', () => document.body.classList.add('c-click'));
    document.addEventListener('mouseup',   () => document.body.classList.remove('c-click'));

    // Hover on interactive elements
    function addHover() {
      document.querySelectorAll(
        'a, button, .btn, .skill-item, .skill-box, .project-card, .work-card, ' +
        '.filter-btn, .experience-card, .game-tab, .showcase-item, .project-item'
      ).forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('c-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('c-hover'));
      });
    }
    addHover();
    // Re-run after DOM updates (for dynamically rendered content)
    setTimeout(addHover, 1500);

    function follow() {
      ox += (tx - ox) * 0.12;
      oy += (ty - oy) * 0.12;
      outer.style.left = ox + 'px';
      outer.style.top  = oy + 'px';
      requestAnimationFrame(follow);
    }
    follow();
  })();

  /* ════════════════════════════════════════
     3. PAGE HERO 3D PARTICLE CANVAS
  ════════════════════════════════════════ */
  (function heroParticles() {
    // Find hero section (works across pages with different class names)
    const hero = document.querySelector(
      '.skills-hero, .projects-hero, .experience-hero, section:first-of-type'
    );
    if (!hero) return;

    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
      position:absolute;top:0;left:0;width:100%;height:100%;
      pointer-events:none;z-index:0;
    `;
    hero.style.position = 'relative';
    hero.style.overflow = 'hidden';
    hero.insertBefore(canvas, hero.firstChild);

    const ctx = canvas.getContext('2d');
    let W, H, particles;

    function resize() {
      W = canvas.width  = hero.offsetWidth;
      H = canvas.height = hero.offsetHeight;
      particles = Array.from({ length: 55 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        opacity: Math.random() * 0.6 + 0.2,
      }));
    }
    resize();
    window.addEventListener('resize', resize);

    let animT = 0;
    function draw() {
      animT++;
      ctx.clearRect(0, 0, W, H);

      // Draw connections
      particles.forEach((p, i) => {
        particles.slice(i + 1).forEach(q => {
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0,242,254,${0.12 * (1 - d / 120)})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        });
      });

      // Draw & move particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;

        const pulse = p.opacity * (0.7 + 0.3 * Math.sin(animT * 0.04 + p.x));
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        g.addColorStop(0, `rgba(0,242,254,${pulse})`);
        g.addColorStop(1, 'rgba(0,242,254,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fill();

        // Core dot
        ctx.fillStyle = `rgba(255,255,255,${pulse * 0.9})`;
        ctx.shadowColor = '#00f2fe';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      requestAnimationFrame(draw);
    }
    draw();
  })();

  /* ════════════════════════════════════════
     4. SECTION GLOW DIVIDERS
  ════════════════════════════════════════ */
  (function glowDividers() {
    const st = document.createElement('style');
    st.textContent = `
      section, .skills-section, .projects-section, .experience-section {
        position: relative;
      }
      section::after {
        content: '';
        display: block;
        position: absolute;
        bottom: 0; left: 50%;
        transform: translateX(-50%);
        width: 55%;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(0,242,254,0.45), transparent);
        pointer-events: none;
      }
    `;
    document.head.appendChild(st);
  })();

  /* ════════════════════════════════════════
     5. GSAP SCROLL ANIMATIONS
  ════════════════════════════════════════ */
  (function gsapAnimations() {
    // Load GSAP dynamically if not present
    function loadScript(src, cb) {
      if (document.querySelector(`script[src="${src}"]`)) { cb && cb(); return; }
      const s = document.createElement('script');
      s.src = src;
      s.onload = cb;
      document.head.appendChild(s);
    }

    loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js', () => {
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js', () => {
        if (typeof gsap === 'undefined') return;
        gsap.registerPlugin(ScrollTrigger);

        /* ── Page hero heading ── */
        gsap.fromTo(
          '.skills-hero .hero-content, .projects-hero .hero-content, .experience-hero .hero-content, section:first-of-type h1',
          { opacity: 0, y: 60, skewY: 3 },
          { opacity: 1, y: 0, skewY: 0, duration: 1.1, ease: 'power3.out', delay: 0.2 }
        );

        /* ── Section headings ── */
        document.querySelectorAll('h2.heading, .section-title, .category-header h2').forEach(el => {
          gsap.fromTo(el,
            { opacity: 0, y: 45, skewY: 2 },
            { opacity: 1, y: 0, skewY: 0, duration: 0.9, ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
            }
          );
        });

        /* ── Skill items ── */
        document.querySelectorAll('.skill-item, .skill-box').forEach((el, i) => {
          gsap.fromTo(el,
            { opacity: 0, scale: 0.75, rotateY: 35, y: 30 },
            { opacity: 1, scale: 1, rotateY: 0, y: 0,
              duration: 0.65, delay: (i % 6) * 0.07, ease: 'back.out(1.5)',
              scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none reverse' }
            }
          );
        });

        /* ── Project cards ── */
        document.querySelectorAll('.project-card, .work-card, .showcase-item').forEach((el, i) => {
          const fromLeft = i % 2 === 0;
          gsap.fromTo(el,
            { opacity: 0, x: fromLeft ? -70 : 70, rotateY: fromLeft ? 10 : -10, scale: 0.92 },
            { opacity: 1, x: 0, rotateY: 0, scale: 1,
              duration: 0.75, delay: (i % 3) * 0.1, ease: 'power2.out',
              scrollTrigger: { trigger: el, start: 'top 87%', toggleActions: 'play none none reverse' }
            }
          );
        });

        /* ── Experience timeline cards ── */
        document.querySelectorAll('.experience-card, .timeline .container').forEach((el, i) => {
          gsap.fromTo(el,
            { opacity: 0, x: i % 2 === 0 ? -80 : 80, rotateY: i % 2 === 0 ? 12 : -12 },
            { opacity: 1, x: 0, rotateY: 0,
              duration: 0.8, ease: 'power2.out',
              scrollTrigger: { trigger: el, start: 'top 86%', toggleActions: 'play none none reverse' }
            }
          );
        });

        /* ── Testimonial cards ── */
        document.querySelectorAll('.testimonial-card').forEach((el, i) => {
          gsap.fromTo(el,
            { opacity: 0, y: 50, scale: 0.9 },
            { opacity: 1, y: 0, scale: 1,
              duration: 0.7, delay: i * 0.12, ease: 'back.out(1.3)',
              scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' }
            }
          );
        });

        /* ── Stat numbers in experience page ── */
        document.querySelectorAll('.stat-number, .stat-count, [data-count]').forEach(el => {
          const target = parseInt(el.dataset.count || el.textContent) || 0;
          ScrollTrigger.create({
            trigger: el,
            start: 'top 85%',
            once: true,
            onEnter: () => {
              let cur = 0;
              const step = target / 50;
              const t = setInterval(() => {
                cur += step;
                if (cur >= target) { cur = target; clearInterval(t); }
                el.textContent = Math.floor(cur) + (el.dataset.suffix || '+');
              }, 35);
            }
          });
        });
      });
    });
  })();

  /* ════════════════════════════════════════
     6. 3D TILT ON CARDS
  ════════════════════════════════════════ */
  (function tilt3D() {
    const cards = document.querySelectorAll(
      '.project-card, .skill-item, .experience-card, .showcase-item, .testimonial-card'
    );

    cards.forEach(card => {
      card.style.transition = 'transform 0.1s ease, box-shadow 0.3s ease';
      card.style.willChange = 'transform';
      card.style.transformStyle = 'preserve-3d';

      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const cx   = rect.left + rect.width / 2;
        const cy   = rect.top  + rect.height / 2;
        const dx   = (e.clientX - cx) / (rect.width / 2);
        const dy   = (e.clientY - cy) / (rect.height / 2);
        const rotX = -dy * 8;
        const rotY =  dx * 8;
        card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.03)`;
        card.style.boxShadow = `${-dx * 8}px ${-dy * 8}px 25px rgba(0,242,254,0.18), 0 15px 35px rgba(0,0,0,0.4)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
        card.style.boxShadow = '';
      });
    });
  })();

  /* ════════════════════════════════════════
     7. FLOATING TECH TAGS (hero sections)
  ════════════════════════════════════════ */
  (function floatingTags() {
    const hero = document.querySelector('.skills-hero, .projects-hero, .experience-hero');
    if (!hero) return;

    const tagSets = {
      skills:     ['⚡ React', '🧠 Node.js', '☁️ AWS', '📱 Flutter', '🔬 MongoDB', '🚀 MERN', '⚛️ Redux', '🌐 GraphQL'],
      projects:   ['🏗️ Full Stack', '🤖 AI/ML', '📊 Analytics', '☁️ Cloud', '🔐 Auth', '💳 Payments', '📱 Mobile', '🌐 PWA'],
      experience: ['💼 Leadership', '🧑‍💻 Mentoring', '🔧 DevOps', '🧪 Testing', '📈 Growth', '🤝 Agile', '🚀 CI/CD', '⚡ Perf'],
    };

    const tags = tagSets[PAGE] || tagSets['skills'];

    const wrap = document.createElement('div');
    wrap.className = 'floating-tags-hero';
    wrap.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:1;overflow:hidden;';

    tags.forEach((tag, i) => {
      const el = document.createElement('span');
      el.textContent = tag;
      el.style.cssText = `
        position:absolute;
        padding:0.4rem 1rem;
        background:rgba(0,242,254,0.06);
        border:1px solid rgba(0,242,254,0.2);
        border-radius:20px;
        font-family:Inter,sans-serif;
        font-size:1.1rem;
        font-weight:600;
        color:rgba(0,242,254,0.7);
        white-space:nowrap;
        animation: ftag ${6 + i * 1.1}s ease-in-out infinite alternate;
        animation-delay: ${i * 0.6}s;
        left: ${5 + (i % 4) * 23}%;
        top:  ${10 + Math.floor(i / 4) * 55}%;
      `;
      wrap.appendChild(el);
    });

    if (!document.getElementById('ftag-kf')) {
      const kf = document.createElement('style');
      kf.id = 'ftag-kf';
      kf.textContent = `
        @keyframes ftag {
          0%   { transform:translateY(0)    rotate(-1deg); opacity:.3;  }
          50%  { transform:translateY(-16px) rotate(1deg);  opacity:.82; }
          100% { transform:translateY(-8px)  rotate(0deg);  opacity:.5;  }
        }
        @media(max-width:768px){ .floating-tags-hero { display:none; } }
      `;
      document.head.appendChild(kf);
    }
    hero.appendChild(wrap);
  })();

  /* ════════════════════════════════════════
     8. NEON SCROLL-TO-TOP BUTTON
  ════════════════════════════════════════ */
  (function scrollTop() {
    const btn = document.getElementById('scroll-top');
    if (!btn) return;
    const st = document.createElement('style');
    st.textContent = `
      #scroll-top {
        background: linear-gradient(135deg, rgba(0,242,254,0.15), rgba(79,172,254,0.1)) !important;
        border: 1px solid rgba(0,242,254,0.4) !important;
        box-shadow: 0 0 20px rgba(0,242,254,0.25) !important;
        color: #00f2fe !important;
        transition: all 0.3s ease !important;
      }
      #scroll-top:hover {
        box-shadow: 0 0 35px rgba(0,242,254,0.55) !important;
        transform: translateY(-3px) !important;
        border-color: #00f2fe !important;
      }
      #scroll-top.active {
        animation: scrollBtnPulse 2s ease infinite;
      }
      @keyframes scrollBtnPulse {
        0%,100% { box-shadow: 0 0 20px rgba(0,242,254,0.25); }
        50%      { box-shadow: 0 0 40px rgba(0,242,254,0.6); }
      }
    `;
    document.head.appendChild(st);
  })();

  /* ════════════════════════════════════════
     9. PAGE-SPECIFIC: SKILLS RADAR GLOW
  ════════════════════════════════════════ */
  (function skillsGlow() {
    if (!document.querySelector('.skills-hero, .skills-section')) return;

    const st = document.createElement('style');
    st.textContent = `
      .skill-item, .skill-box {
        transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease !important;
      }
      .skill-item:hover, .skill-box:hover {
        border-color: rgba(0,242,254,0.5) !important;
        box-shadow: 0 0 25px rgba(0,242,254,0.2), 0 8px 30px rgba(0,0,0,0.3) !important;
      }
      .skill-bar .bar span {
        position: relative;
        overflow: hidden;
      }
      .skill-bar .bar span::after {
        content: '';
        position: absolute;
        top: 0; left: -100%;
        width: 60%; height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
        animation: barShimmer 2.5s infinite;
      }
      @keyframes barShimmer { 0%{left:-100%} 100%{left:200%} }

      /* Progress bar neon glow */
      .skill-bar .bar span {
        box-shadow: 0 0 8px rgba(0,242,254,0.5), 0 0 20px rgba(79,172,254,0.2) !important;
      }
    `;
    document.head.appendChild(st);
  })();

  /* ════════════════════════════════════════
     10. PAGE-SPECIFIC: PROJECTS FILTER GLOW
  ════════════════════════════════════════ */
  (function projectsGlow() {
    if (!document.querySelector('.projects-section, .work-section')) return;

    const st = document.createElement('style');
    st.textContent = `
      .filter-btn, .filter-button {
        transition: all 0.3s ease !important;
      }
      .filter-btn:hover, .filter-btn.active,
      .filter-button:hover, .filter-button.active {
        box-shadow: 0 0 20px rgba(0,242,254,0.35) !important;
        border-color: rgba(0,242,254,0.6) !important;
      }
      .project-card, .work-card {
        transition: transform 0.35s ease, box-shadow 0.35s ease !important;
      }
      /* Neon tag badges */
      .project-card .tech-tag, .work-card .tag {
        background: rgba(0,242,254,0.08) !important;
        border: 1px solid rgba(0,242,254,0.2) !important;
        color: rgba(0,242,254,0.85) !important;
      }
    `;
    document.head.appendChild(st);
  })();

  /* ════════════════════════════════════════
     11. PAGE-SPECIFIC: EXPERIENCE TIMELINE
  ════════════════════════════════════════ */
  (function experienceGlow() {
    if (!document.querySelector('.experience-section, section#experience')) return;

    const st = document.createElement('style');
    st.textContent = `
      /* Timeline line glow */
      .timeline::before {
        box-shadow: 0 0 12px rgba(0,242,254,0.4) !important;
        background: linear-gradient(180deg, transparent, #00f2fe, transparent) !important;
      }
      /* Timeline node pulse */
      .timeline .container::before, .timeline .left::before, .timeline .right::before {
        animation: timelinePulse 2s ease infinite !important;
        box-shadow: 0 0 0 4px rgba(0,242,254,0.15) !important;
      }
      @keyframes timelinePulse {
        0%,100% { box-shadow: 0 0 0 4px rgba(0,242,254,0.15); }
        50%      { box-shadow: 0 0 0 8px rgba(0,242,254,0.05), 0 0 15px rgba(0,242,254,0.3); }
      }
      .experience-card {
        transition: transform 0.3s ease, box-shadow 0.3s ease !important;
      }
      .experience-card:hover {
        box-shadow: 0 0 30px rgba(0,242,254,0.2), 0 15px 40px rgba(0,0,0,0.4) !important;
      }
    `;
    document.head.appendChild(st);
  })();

  /* ════════════════════════════════════════
     12. TYPING EFFECT on page hero subtitles
  ════════════════════════════════════════ */
  (function heroTyping() {
    const subtitle = document.querySelector('.skills-hero p, .projects-hero p, .experience-hero p');
    if (!subtitle) return;

    const original = subtitle.textContent.trim();
    subtitle.textContent = '';

    let i = 0;
    function type() {
      if (i <= original.length) {
        subtitle.textContent = original.slice(0, i) + (i < original.length ? '|' : '');
        i++;
        setTimeout(type, 38);
      } else {
        // Blinking cursor at end
        setInterval(() => {
          subtitle.textContent = original + (subtitle.textContent.endsWith('|') ? '' : '|');
        }, 600);
      }
    }
    setTimeout(type, 600);
  })();

  /* ════════════════════════════════════════
     13. SPARKLE CLICK EFFECT (all pages)
  ════════════════════════════════════════ */
  (function sparkleClick() {
    const st = document.createElement('style');
    st.textContent = `
      .sparkle-particle {
        position:fixed;
        width:6px; height:6px;
        border-radius:50%;
        pointer-events:none;
        z-index:999997;
        background:#00f2fe;
        box-shadow:0 0 8px #00f2fe;
        animation: sparkleAnim 0.7s ease-out forwards;
      }
      @keyframes sparkleAnim {
        0%   { transform:scale(1) translate(0,0); opacity:1; }
        100% { transform:scale(0) translate(var(--sx),var(--sy)); opacity:0; }
      }
    `;
    document.head.appendChild(st);

    document.addEventListener('click', e => {
      const colors = ['#00f2fe','#4facfe','#ffd700','#06d6a0','#ffffff'];
      for (let i = 0; i < 8; i++) {
        const el = document.createElement('div');
        el.className = 'sparkle-particle';
        const angle = (i / 8) * Math.PI * 2;
        const dist  = 30 + Math.random() * 40;
        el.style.setProperty('--sx', `${Math.cos(angle) * dist}px`);
        el.style.setProperty('--sy', `${Math.sin(angle) * dist}px`);
        el.style.left  = e.clientX + 'px';
        el.style.top   = e.clientY + 'px';
        el.style.background = colors[i % colors.length];
        el.style.boxShadow  = `0 0 8px ${colors[i % colors.length]}`;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 750);
      }
    });
  })();

  /* ════════════════════════════════════════
     14. HEADER SCROLL SHRINK + GLOW
  ════════════════════════════════════════ */
  (function headerScroll() {
    const header = document.querySelector('header');
    if (!header) return;

    const st = document.createElement('style');
    st.textContent = `
      header.scrolled {
        padding: 0.8rem 10% !important;
        box-shadow: 0 4px 30px rgba(0,242,254,0.12) !important;
        border-bottom-color: rgba(0,242,254,0.2) !important;
      }
      header { transition: padding 0.3s ease, box-shadow 0.3s ease !important; }
    `;
    document.head.appendChild(st);

    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  })();

  console.log(`%c✨ Shared Effects Active — ${PAGE} page`, 'color:#00f2fe;font-weight:bold;font-size:13px;');
})();
