/* ====================================================================
   RAVINDRA PORTFOLIO — ADVANCED 3D ENGINE v2
   Three.js: Rotating 3D Globe + DNA Helix + Neural Network
   + Matrix Rain + AI Cursor + GSAP Scroll Animations
   ==================================================================== */

/* ═══════════════════════════════════════
   1. CYBER-CORE POST-PROCESSING (right hero side)
═══════════════════════════════════════ */
(function initCyberCore() {
  const canvas = document.getElementById('globe-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const W = canvas.parentElement.offsetWidth  || 480;
  const H = canvas.parentElement.offsetHeight || 480;
  canvas.width  = W;
  canvas.height = H;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);

  // Setup Post-Processing (Bloom for glowing neon)
  const renderScene = new THREE.RenderPass(new THREE.Scene(), new THREE.PerspectiveCamera(50, W / H, 0.1, 1000));
  const scene = renderScene.scene;
  const camera = renderScene.camera;
  camera.position.set(0, 0, 5.5);

  const bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(W, H), 2.5, 0.6, 0.2); // strength, radius, threshold
  const composer = new THREE.EffectComposer(renderer);
  composer.addPass(renderScene);
  composer.addPass(bloomPass);

  // OrbitControls for true interactivity
  let controls;
  if (typeof THREE.OrbitControls !== 'undefined') {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.5;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
  }

  const coreGroup = new THREE.Group();
  scene.add(coreGroup);

  /* ── Cyber-Core Inner TorusKnot ── */
  const innerGeo = new THREE.TorusKnotGeometry(1.2, 0.35, 128, 16);
  const innerMat = new THREE.MeshBasicMaterial({ 
    color: 0x00f2fe, 
    wireframe: true, 
    transparent: true, 
    opacity: 0.15 
  });
  const torusMesh = new THREE.Mesh(innerGeo, innerMat);
  coreGroup.add(torusMesh);

  /* ── Solid Inner Plasma ── */
  const plasmaGeo = new THREE.TorusKnotGeometry(1.15, 0.32, 64, 8);
  const plasmaMat = new THREE.MeshBasicMaterial({ 
    color: 0x040814, 
    transparent: true, 
    opacity: 0.8 
  });
  coreGroup.add(new THREE.Mesh(plasmaGeo, plasmaMat));

  /* ── Outer Icosahedron Shell (Wireframe + Dots) ── */
  const shellGeo = new THREE.IcosahedronGeometry(2.4, 1);
  const shellMat = new THREE.MeshBasicMaterial({
    color: 0x4facfe, wireframe: true, transparent: true, opacity: 0.08
  });
  const shellMesh = new THREE.Mesh(shellGeo, shellMat);
  coreGroup.add(shellMesh);

  const dotMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.04, transparent: true, opacity: 0.8 });
  const shellDots = new THREE.Points(shellGeo, dotMat);
  coreGroup.add(shellDots);

  /* ── Ambient & Point Lights ── */
  scene.add(new THREE.AmbientLight(0x00f2fe, 0.5));
  const pLight = new THREE.PointLight(0x4facfe, 2, 10);
  pLight.position.set(2, 2, 4);
  scene.add(pLight);

  /* ── Particles orbiting the core ── */
  const pCount = 200;
  const pPos = new Float32Array(pCount * 3);
  const pSpeeds = [];
  for (let i = 0; i < pCount; i++) {
    const r = 2.8 + Math.random() * 1.5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    pPos[i*3] = r * Math.sin(phi) * Math.cos(theta);
    pPos[i*3+1] = r * Math.cos(phi);
    pPos[i*3+2] = r * Math.sin(phi) * Math.sin(theta);
    pSpeeds.push({ 
      rx: (Math.random() - 0.5) * 0.02, 
      ry: (Math.random() - 0.5) * 0.02 
    });
  }
  const pGeom = new THREE.BufferGeometry();
  pGeom.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMaterial = new THREE.PointsMaterial({ color: 0x00f2fe, size: 0.05, transparent: true, opacity: 0.6 });
  const particleSwarm = new THREE.Points(pGeom, pMaterial);
  scene.add(particleSwarm);

  window.addEventListener('resize', () => {
    const nW = canvas.parentElement.offsetWidth  || 480;
    const nH = canvas.parentElement.offsetHeight || 480;
    renderer.setSize(nW, nH);
    composer.setSize(nW, nH);
    camera.aspect = nW / nH;
    camera.updateProjectionMatrix();
  });

  let time = 0;
  function animateCore() {
    requestAnimationFrame(animateCore);
    time += 0.005;

    if (controls) controls.update();

    torusMesh.rotation.x = time * 0.5;
    torusMesh.rotation.y = time * 0.8;
    
    shellMesh.rotation.y = -time * 0.3;
    shellDots.rotation.y = -time * 0.3;

    // Pulse bloom strength
    bloomPass.strength = 1.8 + Math.sin(time * 3) * 0.5;

    // Swarm rotation
    particleSwarm.rotation.y = time * 0.2;
    particleSwarm.rotation.x = Math.sin(time * 0.5) * 0.1;

    composer.render();
  }
  animateCore();
})();

/* ═══════════════════════════════════════
   2. DNA DOUBLE HELIX (Canvas 2D)
═══════════════════════════════════════ */
(function initDNA() {
  const canvas = document.getElementById('dna-canvas');
  if (!canvas) return;
  canvas.width  = 120;
  canvas.height = 320;
  const ctx = canvas.getContext('2d');

  const BASES = ['A', 'T', 'G', 'C'];
  const COLORS = { A: '#00f2fe', T: '#4facfe', G: '#06d6a0', C: '#ffd166' };
  let dnaT = 0;

  function drawDNA() {
    ctx.clearRect(0, 0, 120, 320);
    const cx = 60, spacing = 18, count = 16;

    for (let i = 0; i < count; i++) {
      const phase = dnaT + i * (Math.PI * 2 / count);
      const x1 = cx + Math.cos(phase) * 40;
      const x2 = cx + Math.cos(phase + Math.PI) * 40;
      const y  = 15 + i * spacing;

      // Rung (horizontal bar)
      const base = BASES[i % 4];
      const col  = COLORS[base];
      ctx.strokeStyle = col;
      ctx.lineWidth   = 2;
      ctx.shadowColor = col;
      ctx.shadowBlur  = 8;
      ctx.globalAlpha = 0.6 + 0.4 * Math.abs(Math.cos(phase));
      ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2, y); ctx.stroke();

      // Node dots
      [x1, x2].forEach(x => {
        const g = ctx.createRadialGradient(x, y, 0, x, y, 7);
        g.addColorStop(0, col);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.shadowColor = col; ctx.shadowBlur = 12;
        ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fill();
      });

      // Base letter
      ctx.fillStyle = '#fff';
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 0.5;
      ctx.font = 'bold 8px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(base, cx, y + 3);
    }

    ctx.globalAlpha = 1;

    // Spine lines
    ['left', 'right'].forEach((side, si) => {
      ctx.beginPath();
      ctx.shadowBlur = 6; ctx.shadowColor = '#00f2fe'; ctx.strokeStyle = 'rgba(0,242,254,0.3)'; ctx.lineWidth = 2;
      for (let i = 0; i < count; i++) {
        const phase = dnaT + i * (Math.PI * 2 / count);
        const x = cx + (si === 0 ? Math.cos(phase) : Math.cos(phase + Math.PI)) * 40;
        const y = 15 + i * spacing;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    });
  }

  function loopDNA() {
    dnaT += 0.03;
    drawDNA();
    requestAnimationFrame(loopDNA);
  }
  loopDNA();
})();

/* ═══════════════════════════════════════
   3. NEURAL NETWORK (behind hero text)
═══════════════════════════════════════ */
/* ═══════════════════════════════════════
   3. NEURAL NETWORK WITH FLOCKING SWARM
═══════════════════════════════════════ */
(function initNeuralNetwork() {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 28;

  /* Nodes */
  const NODE_COUNT = 90;
  const nodes = [];
  const nodeGroup = new THREE.Group();

  for (let i = 0; i < NODE_COUNT; i++) {
    const isCore = i < 5;
    const g = new THREE.SphereGeometry(isCore ? 0.3 : 0.12, 8, 8);
    const m = new THREE.MeshBasicMaterial({ 
      color: isCore ? 0x4facfe : 0x00f2fe, 
      transparent: true, 
      opacity: isCore ? 0.9 : 0.6 
    });
    const mesh = new THREE.Mesh(g, m);
    
    // Initial random position
    const ix = (Math.random() - 0.5) * 60;
    const iy = (Math.random() - 0.5) * 35;
    const iz = (Math.random() - 0.5) * 20;
    mesh.position.set(ix, iy, iz);
    
    nodes.push({
      mesh: mesh,
      basePos: new THREE.Vector3(ix, iy, iz),
      vel: new THREE.Vector3(0, 0, 0),
      mass: isCore ? 2.5 : 1
    });
    nodeGroup.add(mesh);
  }
  scene.add(nodeGroup);

  /* Edges (Line segments updated dynamically) */
  const THRESHOLD = 14;
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00f2fe, transparent: true, opacity: 0.15 });
  const edgesGroup = new THREE.Group();
  scene.add(edgesGroup);
  
  // We'll recreate lines per frame for dynamic swarm

  /* Signal pulse */
  const pulseMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.4, 12, 12),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 })
  );
  scene.add(pulseMesh);
  let pathIdx = 0;

  /* Raycaster for Mouse Interactivity */
  const mouse = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const targetObj = new THREE.Vector3();
  let isHovering = false;

  document.addEventListener('mousemove', e => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    isHovering = true;
  });
  document.addEventListener('mouseleave', () => isHovering = false);

  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  let tN = 0;
  function animateNN() {
    requestAnimationFrame(animateNN);
    tN += 0.007;

    // 1. Calculate swarm attraction point (mouse projected onto 3D plane)
    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(plane, targetObj);

    // 2. Clear old lines
    while (edgesGroup.children.length > 0) {
      const child = edgesGroup.children[0];
      edgesGroup.remove(child);
      child.geometry.dispose();
    }

    const positions = [];
    
    // 3. Update physics for each node
    nodes.forEach((n, i) => {
      // Spring back to base position
      const force = new THREE.Vector3().subVectors(n.basePos, n.mesh.position).multiplyScalar(0.005);
      
      // If mouse is active, attract to mouse
      if (isHovering) {
        const mouseDist = n.mesh.position.distanceTo(targetObj);
        if (mouseDist < 25) {
          const attract = new THREE.Vector3().subVectors(targetObj, n.mesh.position)
            .normalize().multiplyScalar(0.08 / (mouseDist * 0.1 + 1));
          force.add(attract);
        }
      }

      n.vel.add(force);
      n.vel.multiplyScalar(0.92); // Friction
      n.mesh.position.add(n.vel);
      
      n.mesh.material.opacity = 0.4 + 0.4 * Math.sin(tN * 2 + i);
      positions.push(n.mesh.position);
    });

    // 4. Re-draw lines
    const lineGeo = new THREE.BufferGeometry();
    const linePoints = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        if (positions[i].distanceTo(positions[j]) < THRESHOLD) {
          linePoints.push(positions[i], positions[j]);
        }
      }
    }
    if (linePoints.length > 0) {
      lineGeo.setFromPoints(linePoints);
      const lines = new THREE.LineSegments(lineGeo, lineMaterial);
      edgesGroup.add(lines);
    }

    // 5. Signal pulse animation
    const next = nodes[(pathIdx + 1) % nodes.length].mesh.position;
    pulseMesh.position.lerp(next, 0.06);
    if (pulseMesh.position.distanceTo(next) < 1.0) pathIdx = (pathIdx + 1) % nodes.length;
    pulseMesh.material.opacity = 0.6 + 0.4 * Math.sin(tN * 8);

    renderer.render(scene, camera);
  }
  animateNN();
})();

/* ═══════════════════════════════════════
   4. MATRIX BINARY RAIN (fixed background)
═══════════════════════════════════════ */
(function initMatrixRain() {
  const existing = document.getElementById('matrix-rain');
  if (existing) existing.remove();

  const c = document.createElement('canvas');
  c.id = 'matrix-rain';
  c.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:0.045;';
  document.body.insertBefore(c, document.body.firstChild);

  const ctx = c.getContext('2d');
  let cols, drops;

  function resize() {
    c.width  = window.innerWidth;
    c.height = window.innerHeight;
    cols  = Math.floor(c.width / 16);
    drops = Array(cols).fill(1);
  }
  resize();
  window.addEventListener('resize', resize);

  const chars = '01アイウエオカキクケコABCDEFGHIJKLMNOPQRSTUVWXYZ∑∆∫√∞≈';

  function draw() {
    ctx.fillStyle = 'rgba(15,23,42,0.065)';
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = '#00f2fe';
    ctx.font = '13px monospace';
    drops.forEach((y, i) => {
      ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * 16, y * 16);
      if (y * 16 > c.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    });
  }
  setInterval(draw, 50);
})();

/* ═══════════════════════════════════════
   5. CUSTOM AI CURSOR
═══════════════════════════════════════ */
(function initAICursor() {
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
      box-shadow:0 0 12px #00f2fe,0 0 30px rgba(0,242,254,0.4);
      transition: width .15s, height .15s;
    }
    #ai-cursor-outer {
      position:fixed; width:36px; height:36px;
      border:2px solid rgba(0,242,254,0.55);
      border-radius:50%; pointer-events:none;
      z-index:999998; transform:translate(-50%,-50%);
      mix-blend-mode:screen;
      transition: width .25s, height .25s, background .25s;
    }
    body.cur-hover #ai-cursor-outer {
      width:55px; height:55px;
      background:rgba(0,242,254,0.06);
      border-color:#00f2fe;
    }
    body.cur-hover #ai-cursor-inner {
      width:5px; height:5px;
    }
    body.cur-click #ai-cursor-outer {
      transform:translate(-50%,-50%) scale(0.8);
      background:rgba(0,242,254,0.15);
    }
    @media(max-width:768px){ #ai-cursor-inner,#ai-cursor-outer{display:none} body{cursor:auto !important} }
  `;
  document.head.appendChild(st);

  let ox = 0, oy = 0, tx = 0, ty = 0;

  document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; inner.style.left=tx+'px'; inner.style.top=ty+'px'; });
  document.addEventListener('mousedown', () => document.body.classList.add('cur-click'));
  document.addEventListener('mouseup',   () => document.body.classList.remove('cur-click'));

  document.querySelectorAll('a,button,.btn,.skill-box,.work-card,.project-card,.filter-btn,.game-tab').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cur-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cur-hover'));
  });

  function lagFollow() {
    ox += (tx - ox) * 0.13;
    oy += (ty - oy) * 0.13;
    outer.style.left = ox + 'px';
    outer.style.top  = oy + 'px';
    requestAnimationFrame(lagFollow);
  }
  lagFollow();
})();

/* ═══════════════════════════════════════
   6. 3D PARALLAX SCROLL LAYERS
═══════════════════════════════════════ */
(function init3DParallax() {
  const sections = document.querySelectorAll('section');
  sections.forEach(sec => {
    sec.style.transformStyle = 'preserve-3d';
  });

  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    // Subtle 3D perspective tilt on sections
    sections.forEach((sec, i) => {
      const rect = sec.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const vCenter = window.innerHeight / 2;
      const dist = (center - vCenter) / window.innerHeight;
      sec.style.transform = `perspective(1200px) rotateX(${dist * 2.5}deg)`;
    });
  });

  // Hero Content Mouse Tilt
  const homeContent = document.querySelector('.home .content');
  if (homeContent) {
    homeContent.style.willChange = 'transform';
    homeContent.style.transformStyle = 'preserve-3d';
    document.addEventListener('mousemove', e => {
      const w = window.innerWidth, h = window.innerHeight;
      const mx = (e.clientX - w/2) / w;
      const my = (e.clientY - h/2) / h;
      homeContent.style.transform = `perspective(1000px) rotateY(${mx * 8}deg) rotateX(${-my * 8}deg) translateZ(10px)`;
    });
  }
})();

/* ═══════════════════════════════════════
   7. GSAP ADVANCED SCROLL CINEMATICS
═══════════════════════════════════════ */
(function initGSAP() {
  if (typeof gsap === 'undefined') return;
  if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);

  // Hero entrance
  gsap.fromTo('.home .content', { opacity: 0, y: 70, rotateX: 10 }, { opacity: 1, y: 0, rotateX: 0, duration: 1.3, ease: 'power3.out', delay: 0.3 });
  gsap.fromTo('.home .hero-3d-side', { opacity: 0, x: 80, rotateY: -15 }, { opacity: 1, x: 0, rotateY: 0, duration: 1.4, ease: 'power3.out', delay: 0.6 });

  if (typeof ScrollTrigger === 'undefined') return;

  // Headings
  gsap.utils.toArray('.heading').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 60, skewY: 5 },
      { opacity: 1, y: 0, skewY: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 82%', toggleActions: 'play none none reverse' }
      }
    );
  });

  // Skill boxes — staggered 3D flip entrance
  gsap.utils.toArray('.skill-box').forEach((box, i) => {
    gsap.fromTo(box,
      { opacity: 0, scale: 0.7, rotateY: 40 },
      { opacity: 1, scale: 1, rotateY: 0, duration: 0.7, delay: i * 0.07, ease: 'back.out(1.6)',
        scrollTrigger: { trigger: box, start: 'top 88%', toggleActions: 'play none none reverse' }
      }
    );
  });

  // Work cards — cinematic flyIn
  gsap.utils.toArray('.work-card').forEach((card, i) => {
    const fromLeft = i % 2 === 0;
    gsap.fromTo(card,
      { opacity: 0, x: fromLeft ? -80 : 80, rotateY: fromLeft ? 12 : -12, scale: 0.9 },
      { opacity: 1, x: 0, rotateY: 0, scale: 1, duration: 0.8, delay: (i % 3) * 0.12, ease: 'power2.out',
        scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none reverse' }
      }
    );
  });

  // About image
  const aboutImg = document.querySelector('.about .image');
  if (aboutImg) {
    gsap.fromTo(aboutImg,
      { opacity: 0, scale: 0.75, rotate: -8, x: -60 },
      { opacity: 1, scale: 1, rotate: 0, x: 0, duration: 1.1, ease: 'back.out(1.5)',
        scrollTrigger: { trigger: aboutImg, start: 'top 78%', toggleActions: 'play none none reverse' }
      }
    );
  }

  // Education timeline
  gsap.utils.toArray('.timeline .container').forEach((c, i) => {
    gsap.fromTo(c,
      { opacity: 0, x: i % 2 === 0 ? -90 : 90, rotateY: i % 2 === 0 ? 15 : -15 },
      { opacity: 1, x: 0, rotateY: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: c, start: 'top 84%', toggleActions: 'play none none reverse' }
      }
    );
  });

  // Services section
  gsap.utils.toArray('.services .box').forEach((box, i) => {
    gsap.fromTo(box,
      { opacity: 0, y: 50, rotateX: 20 },
      { opacity: 1, y: 0, rotateX: 0, duration: 0.7, delay: i * 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: box, start: 'top 88%', toggleActions: 'play none none reverse' }
      }
    );
  });

  // Navbar active on scroll
  const navLinks = document.querySelectorAll('header .navbar a');
  const sectionsList = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let current = '';
    sectionsList.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = '#' + sec.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === current);
    });
  });
})();

/* ═══════════════════════════════════════
   8. FLOATING AI TECH TAGS
═══════════════════════════════════════ */
(function initFloatingTags() {
  if (document.querySelector('.floating-tags-container')) return;
  const section = document.querySelector('.home');
  if (!section) return;

  const tags = ['⚡ AI', '🧠 ML', '☁️ AWS', '⚛️ React', '📱 Flutter','🔬 Deep Learning','🚀 MERN','🌐 Node.js'];
  const wrap = document.createElement('div');
  wrap.className = 'floating-tags-container';
  wrap.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:0;overflow:hidden;';

  tags.forEach((tag, i) => {
    const el = document.createElement('div');
    el.style.cssText = `
      position:absolute;
      padding:0.42rem 1rem;
      background:rgba(0,242,254,0.065);
      border:1px solid rgba(0,242,254,0.18);
      border-radius:20px;
      font-family:Inter,sans-serif;
      font-size:1.1rem;
      font-weight:600;
      color:rgba(0,242,254,0.65);
      white-space:nowrap;
      animation:floatTag ${6 + i * 1.2}s ease-in-out infinite alternate;
      animation-delay:${i * 0.65}s;
      left:${6 + (i % 4) * 23}%;
      top:${12 + Math.floor(i / 4) * 58}%;
    `;
    el.textContent = tag;
    wrap.appendChild(el);
  });

  if (!document.getElementById('float-tag-kf')) {
    const kf = document.createElement('style');
    kf.id = 'float-tag-kf';
    kf.textContent = `
      @keyframes floatTag{
        0%   {transform:translateY(0)   rotate(-1.5deg);opacity:.35}
        50%  {transform:translateY(-18px)rotate(1.5deg);opacity:.85}
        100% {transform:translateY(-9px) rotate(0);     opacity:.55}
      }
      @media(max-width:768px){.floating-tags-container{display:none}}
    `;
    document.head.appendChild(kf);
  }
  section.appendChild(wrap);
})();

/* ═══════════════════════════════════════
   9. HERO COUNTER STATS
═══════════════════════════════════════ */
(function initHeroStats() {
  if (document.querySelector('.hero-stats')) return;
  const content = document.querySelector('.home .content');
  if (!content) return;

  const stats = document.createElement('div');
  stats.className = 'hero-stats';
  stats.innerHTML = `
    <div class="hero-stat"><span class="stat-num" data-target="5">0</span><span class="stat-label">Years Exp.</span></div>
    <div class="hero-stat"><span class="stat-num" data-target="50">0</span><span class="stat-label">Projects</span></div>
    <div class="hero-stat"><span class="stat-num" data-target="30">0</span><span class="stat-label">Clients</span></div>
  `;

  const st = document.createElement('style');
  st.textContent = `
    .hero-stats{display:flex;gap:2rem;margin-top:2.5rem;flex-wrap:wrap;}
    .hero-stat{display:flex;flex-direction:column;align-items:center;background:rgba(0,242,254,0.055);border:1px solid rgba(0,242,254,0.16);border-radius:14px;padding:.9rem 1.6rem;min-width:8.5rem;transition:all .3s ease}
    .hero-stat:hover{background:rgba(0,242,254,0.1);transform:translateY(-5px);box-shadow:0 10px 25px rgba(0,242,254,0.15)}
    .stat-num{font-size:2.6rem;font-weight:800;font-family:'Outfit',sans-serif;background:linear-gradient(135deg,#00f2fe,#4facfe);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;line-height:1}
    .stat-num::after{content:'+';font-size:1.8rem}
    .stat-label{font-size:1rem;color:#94a3b8;margin-top:.3rem;text-transform:uppercase;letter-spacing:.08em;font-weight:600}
  `;
  document.head.appendChild(st);
  content.appendChild(stats);

  new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    document.querySelectorAll('.stat-num').forEach(el => {
      const target = +el.dataset.target, step = target / 42;
      let cur = 0;
      const t = setInterval(() => {
        cur += step;
        if (cur >= target) { cur = target; clearInterval(t); }
        el.textContent = Math.floor(cur);
      }, 38);
    });
  }, { threshold: 0.5 }).observe(stats);
})();

/* ═══════════════════════════════════════
   10. GLITCH NAME EFFECT (subtle, non-obstructive)
═══════════════════════════════════════ */
(function initGlitch() {
  const h2 = document.querySelector('.home .content h2');
  if (!h2 || document.getElementById('glitch-style')) return;
  const st = document.createElement('style');
  st.id = 'glitch-style';
  st.textContent = `
    .home .content h2 {
      position: relative;
      display: block;
    }
    .home .content h2::before,
    .home .content h2::after {
      content: attr(data-text);
      position: absolute;
      top: 0; left: 0;
      width: 100%;
      pointer-events: none;
      opacity: 0;
      clip-path: inset(0 0 100% 0);
    }
    .home .content h2::before { color: #4facfe; animation: glitch1 9s infinite steps(1); }
    .home .content h2::after  { color: #00f2fe; animation: glitch2 9s infinite steps(1) 0.15s; }

    @keyframes glitch1 {
      0%,93%,100% { opacity:0; clip-path:inset(0 0 100% 0); transform:none; }
      94%  { opacity:.55; clip-path:inset(22% 0 58% 0); transform:translate(-3px,0); }
      95%  { opacity:.55; clip-path:inset(58% 0 18% 0); transform:translate(3px,0); }
      96%  { opacity:.55; clip-path:inset(10% 0 72% 0); transform:translate(-2px,0); }
      97%  { opacity:0;  clip-path:inset(0 0 100% 0);  transform:none; }
    }
    @keyframes glitch2 {
      0%,93%,100% { opacity:0; clip-path:inset(0 0 100% 0); transform:none; }
      94%  { opacity:.45; clip-path:inset(62% 0  8% 0); transform:translate(3px,0); }
      95%  { opacity:.45; clip-path:inset(28% 0 48% 0); transform:translate(-3px,0); }
      96%  { opacity:.45; clip-path:inset(78% 0  6% 0); transform:translate(2px,0); }
      97%  { opacity:0;  clip-path:inset(0 0 100% 0);  transform:none; }
    }
  `;
  document.head.appendChild(st);
  h2.dataset.text = h2.textContent;
})();


/* ═══════════════════════════════════════
   11. 3D SYNTHWAVE INFINITY GRID (Background)
═══════════════════════════════════════ */
(function initSynthwaveGrid() {
  if (typeof THREE === 'undefined') return;
  
  const canvas = document.createElement('canvas');
  canvas.id = 'synthwave-grid';
  canvas.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    pointer-events: none; z-index: -2; opacity: 0; transition: opacity 1s ease;
  `;
  document.body.insertBefore(canvas, document.body.firstChild);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  // Add a dark fog to hide the horizon
  scene.fog = new THREE.FogExp2(0x020617, 0.035);

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 2.5, 5);
  camera.lookAt(0, 0, -5);

  // The glowing grid plane
  const gridGeo = new THREE.PlaneGeometry(100, 100, 40, 40);
  
  // Displacement slightly so it's not perfectly flat
  const pos = gridGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const vx = pos.getX(i);
    const vy = pos.getY(i);
    // Add tiny height variation
    pos.setZ(i, Math.sin(vx) * Math.cos(vy) * 0.3);
  }
  
  const gridMat = new THREE.MeshBasicMaterial({
    color: 0x00f2fe,
    wireframe: true,
    transparent: true,
    opacity: 0.15
  });
  
  const gridMesh = new THREE.Mesh(gridGeo, gridMat);
  gridMesh.rotation.x = -Math.PI / 2;
  scene.add(gridMesh);

  // Add floating light particles above the grid
  const pc = 150;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(pc * 3);
  for (let i = 0; i < pc; i++) {
    pPos[i*3] = (Math.random() - 0.5) * 40;
    pPos[i*3+1] = Math.random() * 8; // Height above grid
    pPos[i*3+2] = (Math.random() - 0.5) * 40;
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({ color: 0x4facfe, size: 0.1, transparent: true, opacity: 0.6 });
  const points = new THREE.Points(pGeo, pMat);
  scene.add(points);

  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  // Only show grid when scrolled down (hide on hero)
  window.addEventListener('scroll', () => {
    if (window.scrollY > window.innerHeight * 0.6) {
      canvas.style.opacity = '1';
    } else {
      canvas.style.opacity = '0';
    }
  });

  let t = 0;
  function animateGrid() {
    requestAnimationFrame(animateGrid);
    t += 0.005;

    // Move grid texture coordinates to simulate traveling forward
    // Since it's a static geometry, we move the particles and geometry offset
    gridMesh.position.z = (t * 10) % 2.5; // Loop the grid

    // Rotate camera slightly based on mouse
    camera.position.x += ((mouseXG || 0) * 1.5 - camera.position.x) * 0.05;
    camera.lookAt(0, 0, -10);

    // Slowly move particles
    points.rotation.y = Math.sin(t) * 0.1;

    renderer.render(scene, camera);
  }
  let mouseXG = 0;
  document.addEventListener('mousemove', e => {
    mouseXG = (e.clientX / window.innerWidth - 0.5) * 2;
  });
  
  animateGrid();
})();

/* ═══════════════════════════════════════
   12. HOLOGRAPHIC 3D CARD PHYSICS
═══════════════════════════════════════ */
(function initCardPhysics() {
  // Target multiple cards in the lower sections
  const cards = document.querySelectorAll(
    '.services .box, .work .box, .skills .category, .experience .content, .info-box'
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
      const rotX = -dy * 12; // tilt degrees
      const rotY =  dx * 12;
      
      card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.03)`;
      card.style.boxShadow = `${-dx * 12}px ${-dy * 12}px 30px rgba(0,242,254,0.18), 0 15px 40px rgba(0,0,0,0.5)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
      card.style.boxShadow = '';
    });
  });
})();

/* ═══════════════════════════════════════
   13. PULSING LASER SECTION DIVIDERS
═══════════════════════════════════════ */
(function initLaserDividers() {
  const st = document.createElement('style');
  st.textContent = `
    .services, .work, .skills, .experience {
      position: relative;
    }
    .services::after, .work::after, .skills::after {
      content: '';
      display: block;
      position: absolute;
      bottom: -2rem; left: 50%;
      transform: translateX(-50%);
      width: 0%;
      height: 1px;
      background: linear-gradient(90deg, transparent, #00f2fe, transparent);
      box-shadow: 0 0 15px #00f2fe, 0 0 30px #4facfe;
      transition: width 1s cubic-bezier(0.25, 1, 0.5, 1);
      z-index: 5;
    }
    .laser-active::after {
      width: 70%;
    }
  `;
  document.head.appendChild(st);

  // Use IntersectionObserver to fire the laser width when scrolled
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('laser-active');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.services, .work, .skills').forEach(sec => {
    observer.observe(sec);
  });
})();

console.log('%c🚀 3D Engine v2 + Infinity Grid Loaded', 'color:#00f2fe;font-size:16px;font-weight:bold;');

