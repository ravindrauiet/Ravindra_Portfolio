/* =====================================================
   AI/ML 3D EXPERIENCE — Ravindra Portfolio
   Three.js Neural Network + Matrix Rain + AI Cursor + GSAP
   ===================================================== */

/* ---------- NEURAL NETWORK (Three.js) ---------- */
(function initNeuralNetwork() {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 28;

  // ---- Nodes ----
  const NODE_COUNT = 80;
  const nodePositions = [];
  const nodeGeo = new THREE.SphereGeometry(0.15, 8, 8);
  const nodeMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe, transparent: true, opacity: 0.85 });
  const nodeGroup = new THREE.Group();

  for (let i = 0; i < NODE_COUNT; i++) {
    const mesh = new THREE.Mesh(nodeGeo, nodeMat.clone());
    const x = (Math.random() - 0.5) * 50;
    const y = (Math.random() - 0.5) * 30;
    const z = (Math.random() - 0.5) * 20;
    mesh.position.set(x, y, z);
    nodePositions.push(new THREE.Vector3(x, y, z));
    nodeGroup.add(mesh);
  }
  scene.add(nodeGroup);

  // ---- Edges (connections within threshold distance) ----
  const THRESHOLD = 12;
  const edgesGroup = new THREE.Group();
  const edgeMatBase = new THREE.LineBasicMaterial({ color: 0x4facfe, transparent: true, opacity: 0.18 });

  for (let i = 0; i < NODE_COUNT; i++) {
    for (let j = i + 1; j < NODE_COUNT; j++) {
      if (nodePositions[i].distanceTo(nodePositions[j]) < THRESHOLD) {
        const geo = new THREE.BufferGeometry().setFromPoints([nodePositions[i], nodePositions[j]]);
        edgesGroup.add(new THREE.Line(geo, edgeMatBase.clone()));
      }
    }
  }
  scene.add(edgesGroup);

  // ---- Pulsing "signal" sphere ----
  const pulseGeo = new THREE.SphereGeometry(0.4, 16, 16);
  const pulseMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe, transparent: true, opacity: 0.9 });
  const pulseSphere = new THREE.Mesh(pulseGeo, pulseMat);
  scene.add(pulseSphere);

  // ---- Floating AI labels (sprite textures) ----
  function makeSprite(text) {
    const c = document.createElement('canvas');
    c.width = 256; c.height = 64;
    const ctx = c.getContext('2d');
    ctx.fillStyle = 'rgba(0,242,254,0.0)';
    ctx.fillRect(0, 0, 256, 64);
    ctx.font = 'bold 22px Inter, sans-serif';
    ctx.fillStyle = 'rgba(0,242,254,0.7)';
    ctx.textAlign = 'center';
    ctx.fillText(text, 128, 42);
    const tex = new THREE.CanvasTexture(c);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(6, 1.5, 1);
    return sprite;
  }

  const labels = ['AI', 'ML', '3D', 'React', 'Node.js', 'AWS', 'Flutter', 'MERN', 'Deep Learning', 'Neural Net'];
  labels.forEach(txt => {
    const s = makeSprite(txt);
    s.position.set((Math.random() - 0.5) * 48, (Math.random() - 0.5) * 28, (Math.random() - 0.5) * 8);
    scene.add(s);
  });

  // ---- Animation signal path ----
  let pathIndex = 0;
  pulseSphere.position.copy(nodePositions[0]);

  // ---- Mouse parallax ----
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ---- Resize ----
  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  // ---- Animate ----
  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.008;

    // Gentle camera parallax follow mouse
    camera.position.x += (mouseX * 4 - camera.position.x) * 0.04;
    camera.position.y += (mouseY * 2 - camera.position.y) * 0.04;
    camera.lookAt(scene.position);

    // Rotate network slowly
    nodeGroup.rotation.y = t * 0.12;
    edgesGroup.rotation.y = t * 0.12;
    nodeGroup.rotation.x = Math.sin(t * 0.05) * 0.15;
    edgesGroup.rotation.x = Math.sin(t * 0.05) * 0.15;

    // Pulse signal along edges
    const next = nodePositions[(pathIndex + 1) % nodePositions.length];
    pulseSphere.position.lerp(next, 0.03);
    if (pulseSphere.position.distanceTo(next) < 0.5) {
      pathIndex = (pathIndex + 1) % nodePositions.length;
    }
    pulseMat.opacity = 0.6 + 0.4 * Math.sin(t * 4);

    // Node pulse
    nodeGroup.children.forEach((m, i) => {
      m.material.opacity = 0.5 + 0.5 * Math.sin(t * 2 + i * 0.5);
    });

    renderer.render(scene, camera);
  }
  animate();
})();

/* ---------- MATRIX BINARY RAIN ---------- */
(function initMatrixRain() {
  const canvas = document.createElement('canvas');
  canvas.id = 'matrix-rain';
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:0.04;';
  document.body.insertBefore(canvas, document.body.firstChild);

  const ctx = canvas.getContext('2d');
  let cols, drops;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cols = Math.floor(canvas.width / 18);
    drops = Array(cols).fill(1);
  }
  resize();
  window.addEventListener('resize', resize);

  const chars = '01アイウエオカキクケコ∑∆∫√≈≠∞ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  function drawMatrix() {
    ctx.fillStyle = 'rgba(15,23,42,0.06)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00f2fe';
    ctx.font = '13px monospace';
    drops.forEach((y, i) => {
      const ch = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(ch, i * 18, y * 18);
      if (y * 18 > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    });
  }
  setInterval(drawMatrix, 55);
})();

/* ---------- AI CURSOR ---------- */
(function initAICursor() {
  const cursorOuter = document.createElement('div');
  cursorOuter.id = 'ai-cursor-outer';
  const cursorInner = document.createElement('div');
  cursorInner.id = 'ai-cursor-inner';
  document.body.appendChild(cursorOuter);
  document.body.appendChild(cursorInner);

  const style = document.createElement('style');
  style.textContent = `
    #ai-cursor-outer {
      position: fixed;
      width: 38px; height: 38px;
      border: 2px solid rgba(0,242,254,0.6);
      border-radius: 50%;
      pointer-events: none;
      z-index: 99999;
      transform: translate(-50%,-50%);
      transition: width .25s, height .25s, border-color .25s, background .25s;
      mix-blend-mode: screen;
    }
    #ai-cursor-inner {
      position: fixed;
      width: 8px; height: 8px;
      background: #00f2fe;
      border-radius: 50%;
      pointer-events: none;
      z-index: 99999;
      transform: translate(-50%,-50%);
      box-shadow: 0 0 10px #00f2fe, 0 0 25px rgba(0,242,254,0.5);
    }
    body.hovering #ai-cursor-outer {
      width: 60px; height: 60px;
      background: rgba(0,242,254,0.07);
      border-color: #00f2fe;
    }
    @media (max-width: 768px) {
      #ai-cursor-outer, #ai-cursor-inner { display: none; }
    }
  `;
  document.head.appendChild(style);

  let ox = 0, oy = 0;
  document.addEventListener('mousemove', e => {
    cursorInner.style.left = e.clientX + 'px';
    cursorInner.style.top  = e.clientY + 'px';
    ox += (e.clientX - ox) * 0.15;
    oy += (e.clientY - oy) * 0.15;
    cursorOuter.style.left = ox + 'px';
    cursorOuter.style.top  = oy + 'px';
  });

  function lagFollow() {
    requestAnimationFrame(lagFollow);
    cursorOuter.style.left = ox + 'px';
    cursorOuter.style.top  = oy + 'px';
  }
  lagFollow();

  document.addEventListener('mousemove', e => {
    ox += (e.clientX - ox) * 0.12;
    oy += (e.clientY - oy) * 0.12;
  });

  document.querySelectorAll('a, button, .btn, .filter-btn, .skill-box, .project-card, .experience-card, .work-card')
    .forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });
})();

/* ---------- FLOATING AI TAGS in Hero ---------- */
(function initFloatingTags() {
  const section = document.querySelector('.home');
  if (!section) return;

  const tags = ['⚡ AI', '🧠 ML', '☁️ AWS', '⚛️ React', '📱 Flutter', '🌐 Node.js', '🔬 Deep Learning', '🚀 MERN'];
  const container = document.createElement('div');
  container.className = 'floating-tags-container';
  container.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;overflow:hidden;';

  tags.forEach((tag, i) => {
    const el = document.createElement('div');
    el.className = 'floating-tag';
    el.textContent = tag;
    el.style.cssText = `
      position:absolute;
      padding:0.5rem 1.2rem;
      background:rgba(0,242,254,0.07);
      border:1px solid rgba(0,242,254,0.2);
      border-radius:20px;
      font-family:Inter,sans-serif;
      font-size:1.2rem;
      font-weight:600;
      color:rgba(0,242,254,0.7);
      white-space:nowrap;
      animation: floatTag ${6 + i}s ease-in-out infinite alternate;
      animation-delay:${i * 0.7}s;
      left:${8 + (i % 4) * 22}%;
      top:${10 + Math.floor(i / 4) * 55}%;
    `;
    container.appendChild(el);
  });

  const keyframes = document.createElement('style');
  keyframes.textContent = `
    @keyframes floatTag {
      0%   { transform: translateY(0px)   rotate(-1deg); opacity:0.4; }
      50%  { transform: translateY(-15px) rotate(1deg);  opacity:0.9; }
      100% { transform: translateY(-8px)  rotate(0deg);  opacity:0.6; }
    }
    @media(max-width:768px){ .floating-tags-container { display:none; } }
  `;
  document.head.appendChild(keyframes);
  section.appendChild(container);
})();

/* ---------- GSAP SCROLL REVEAL ANIMATIONS ---------- */
(function initGSAP() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // Heading reveal
  gsap.utils.toArray('.heading').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 50, skewY: 4 },
      {
        opacity: 1, y: 0, skewY: 0,
        duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
      }
    );
  });

  // Skill cards stagger
  gsap.utils.toArray('.skill-box').forEach((box, i) => {
    gsap.fromTo(box,
      { opacity: 0, scale: 0.85, y: 40 },
      {
        opacity: 1, scale: 1, y: 0,
        duration: 0.6, delay: i * 0.06, ease: 'back.out(1.4)',
        scrollTrigger: { trigger: box, start: 'top 90%', toggleActions: 'play none none reverse' }
      }
    );
  });

  // Project cards fly-in
  gsap.utils.toArray('.work-card, .project-card').forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, x: i % 2 === 0 ? -60 : 60, rotateY: i % 2 === 0 ? -8 : 8 },
      {
        opacity: 1, x: 0, rotateY: 0,
        duration: 0.7, delay: (i % 3) * 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none reverse' }
      }
    );
  });

  // Experience timeline cards
  gsap.utils.toArray('.timeline .container').forEach((c, i) => {
    gsap.fromTo(c,
      { opacity: 0, x: i % 2 === 0 ? -80 : 80 },
      {
        opacity: 1, x: 0,
        duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: c, start: 'top 85%', toggleActions: 'play none none reverse' }
      }
    );
  });

  // About section image
  const aboutImg = document.querySelector('.about .image');
  if (aboutImg) {
    gsap.fromTo(aboutImg,
      { opacity: 0, scale: 0.8, rotate: -5 },
      {
        opacity: 1, scale: 1, rotate: 0,
        duration: 0.9, ease: 'back.out(1.2)',
        scrollTrigger: { trigger: aboutImg, start: 'top 80%', toggleActions: 'play none none reverse' }
      }
    );
  }

  // Hero content entrance
  const heroContent = document.querySelector('.home .content');
  if (heroContent) {
    gsap.fromTo(heroContent,
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.3 }
    );
  }

  // Section divider glow lines
  gsap.utils.toArray('section').forEach(sec => {
    ScrollTrigger.create({
      trigger: sec,
      start: 'top 70%',
      onEnter: () => sec.classList.add('in-view'),
      onLeave: () => sec.classList.remove('in-view'),
      onEnterBack: () => sec.classList.add('in-view'),
      onLeaveBack: () => sec.classList.remove('in-view'),
    });
  });
})();

/* ---------- HERO COUNTER STATS ---------- */
(function initHeroStats() {
  // Add stats below buttons if hero exists
  const heroContent = document.querySelector('.home .content');
  if (!heroContent) return;
  if (document.querySelector('.hero-stats')) return;

  const statsDiv = document.createElement('div');
  statsDiv.className = 'hero-stats';
  statsDiv.innerHTML = `
    <div class="hero-stat"><span class="stat-num" data-target="5">0</span><span class="stat-label">Years Exp.</span></div>
    <div class="hero-stat"><span class="stat-num" data-target="50">0</span><span class="stat-label">Projects Done</span></div>
    <div class="hero-stat"><span class="stat-num" data-target="30">0</span><span class="stat-label">Happy Clients</span></div>
  `;

  const style = document.createElement('style');
  style.textContent = `
    .hero-stats {
      display: flex;
      gap: 2.5rem;
      margin-top: 2.5rem;
      flex-wrap: wrap;
    }
    .hero-stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: rgba(0,242,254,0.06);
      border: 1px solid rgba(0,242,254,0.18);
      border-radius: 12px;
      padding: 1rem 1.8rem;
      min-width: 9rem;
      transition: all 0.3s ease;
    }
    .hero-stat:hover {
      background: rgba(0,242,254,0.12);
      transform: translateY(-4px);
      box-shadow: 0 8px 20px rgba(0,242,254,0.15);
    }
    .hero-stat .stat-num {
      font-size: 2.8rem;
      font-weight: 800;
      font-family: 'Outfit', sans-serif;
      background: linear-gradient(135deg, #00f2fe, #4facfe);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      line-height: 1;
    }
    .hero-stat .stat-num::after {
      content: '+';
      font-size: 2rem;
    }
    .hero-stat .stat-label {
      font-size: 1.1rem;
      color: #94a3b8;
      margin-top: 0.4rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-weight: 600;
    }
    #neural-canvas {
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      z-index: 0;
      pointer-events: none;
    }
    .home .content, .home .image { position: relative; z-index: 2; }
    .home #particles-js { z-index: 1; }
  `;
  document.head.appendChild(style);
  heroContent.appendChild(statsDiv);

  // Animate numbers on scroll into view
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.stat-num').forEach(num => {
          const target = parseInt(num.dataset.target);
          let current = 0;
          const step = target / 40;
          const timer = setInterval(() => {
            current += step;
            if (current >= target) { current = target; clearInterval(timer); }
            num.textContent = Math.floor(current);
          }, 40);
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.5 });

  observer.observe(statsDiv);
})();

/* ---------- GLITCH TEXT EFFECT on Name ---------- */
(function initGlitch() {
  const h2 = document.querySelector('.home .content h2');
  if (!h2) return;

  const style = document.createElement('style');
  style.textContent = `
    .home .content h2 {
      position: relative;
      display: inline-block;
    }
    @keyframes glitch1 {
      0%,100% { clip-path: inset(0 0 98% 0); transform: translate(-3px, 0); }
      20%      { clip-path: inset(30% 0 50% 0); transform: translate(3px, 0); }
      40%      { clip-path: inset(60% 0 20% 0); transform: translate(-2px, 0); }
      60%      { clip-path: inset(10% 0 70% 0); transform: translate(2px, 0); }
      80%      { clip-path: inset(50% 0 10% 0); transform: translate(-1px, 0); }
    }
    @keyframes glitch2 {
      0%,100% { clip-path: inset(0 0 98% 0); transform: translate(3px, 0); }
      20%      { clip-path: inset(60% 0 10% 0); transform: translate(-3px, 0); }
      40%      { clip-path: inset(10% 0 70% 0); transform: translate(2px, 0); }
      60%      { clip-path: inset(40% 0 40% 0); transform: translate(-2px, 0); }
      80%      { clip-path: inset(80% 0 5%  0); transform: translate(1px, 0); }
    }
    .home .content h2::before,
    .home .content h2::after {
      content: attr(data-text);
      position: absolute;
      top: 0; left: 0;
      width: 100%;
      color: #00f2fe;
      pointer-events: none;
    }
    .home .content h2::before {
      animation: glitch1 5s infinite steps(1);
      color: #4facfe;
      opacity: 0.5;
    }
    .home .content h2::after  {
      animation: glitch2 5s infinite steps(1) 0.1s;
      color: #00f2fe;
      opacity: 0.4;
    }
  `;
  document.head.appendChild(style);
  h2.dataset.text = h2.textContent;

  // Trigger random glitch
  setInterval(() => {
    h2.classList.add('glitching');
    setTimeout(() => h2.classList.remove('glitching'), 300);
  }, 8000);
})();

/* ---------- HOLOGRAPHIC SKILL PROGRESS BARS ---------- */
(function initHoloBars() {
  document.querySelectorAll('.skill-bar .bar span').forEach(bar => {
    const width = bar.dataset.width || bar.style.width || '70%';
    bar.style.cssText += `
      box-shadow: 0 0 10px rgba(0,242,254,0.6), 0 0 25px rgba(79,172,254,0.3);
      position: relative;
      overflow: hidden;
    `;
    const shimmer = document.createElement('div');
    shimmer.style.cssText = `
      position:absolute;top:0;left:-100%;width:60%;height:100%;
      background:linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent);
      animation:shimmer 2.5s infinite;
    `;
    bar.appendChild(shimmer);
  });

  const shimStyle = document.createElement('style');
  shimStyle.textContent = `@keyframes shimmer { 0%{left:-100%} 100%{left:200%} }`;
  document.head.appendChild(shimStyle);
})();

console.log('%c🧠 AI/ML 3D Engine Initialized', 'color:#00f2fe;font-size:16px;font-weight:bold;');
