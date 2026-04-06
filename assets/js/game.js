/* ============================================================
   RAVINDRA PORTFOLIO — ARCADE GAME ENGINE
   3 Games: Neon Snake | Space Code (Invaders) | Block Buster
   ============================================================ */

(function PortfolioArcade() {
  'use strict';

  /* ── DOM refs ── */
  const launcher   = document.getElementById('game-launcher');
  const modal      = document.getElementById('game-modal');
  const closeBtn   = document.getElementById('game-close');
  const canvas     = document.getElementById('game-canvas');
  const ctx        = canvas.getContext('2d');
  const overlay    = document.getElementById('game-overlay');
  const startBtn   = document.getElementById('start-game-btn');
  const tabs       = document.querySelectorAll('.game-tab');
  const scoreEl   = document.getElementById('score-val');
  const bestEl    = document.getElementById('best-val');
  const titleEl   = document.getElementById('game-title');
  const subtitleEl = document.getElementById('game-subtitle');
  const overlayTitle = document.getElementById('overlay-title');
  const overlayMsg   = document.getElementById('overlay-msg');
  const overlayScore = document.getElementById('overlay-score-msg');

  if (!launcher || !modal || !canvas) return;

  /* ── State ── */
  let currentGame = 'snake';
  let gameLoop = null;
  let paused   = false;
  let score    = 0;
  let bests    = { snake: 0, invaders: 0, breakout: 0 };
  let gameRunning = false;

  /* ── Game descriptions ── */
  const GAMES = {
    snake:    { title: 'Neon Snake',    subtitle: 'Arrow / WASD to move • Eat orbs to grow', desc: 'Dodge walls & yourself. Eat glowing orbs. Level up!' },
    invaders: { title: 'Space Code',    subtitle: 'Arrow to aim • Space to fire',             desc: 'Destroy the invaders before they reach Earth!' },
    breakout: { title: 'Block Buster',  subtitle: 'Arrow / Mouse to move paddle',             desc: 'Break all blocks without dropping the ball!' },
  };

  /* ───────────────────────────
     LAUNCH BUTTON – Pulse ring
  ─────────────────────────── */
  launcher.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

  function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    showOverlay();
  }
  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    stopGame();
  }

  /* ── Tab switching ── */
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentGame = tab.dataset.game;
      const g = GAMES[currentGame];
      titleEl.textContent    = g.title;
      subtitleEl.textContent = g.subtitle;
      overlayTitle.textContent = g.title;
      overlayMsg.textContent   = g.desc;
      overlayScore.textContent = '';
      scoreEl.textContent = '0';
      bestEl.textContent  = bests[currentGame];
      score = 0;
      stopGame();
      showOverlay();
    });
  });

  startBtn.addEventListener('click', () => {
    hideOverlay();
    startGame(currentGame);
  });

  /* ── Keyboard ── */
  document.addEventListener('keydown', e => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'p' || e.key === 'P') togglePause();
    if (e.key === 'r' || e.key === 'R') { stopGame(); startGame(currentGame); }
    if (e.key === 'Escape') closeModal();
  });

  /* ─────────────────────────
     OVERLAY helpers
  ───────────────────────── */
  function showOverlay() { overlay.style.display = 'flex'; }
  function hideOverlay() { overlay.style.display = 'none'; }

  function gameOver(finalScore) {
    gameRunning = false;
    if (finalScore > bests[currentGame]) {
      bests[currentGame] = finalScore;
      bestEl.textContent = finalScore;
    }
    overlayTitle.textContent = '💀 Game Over';
    overlayMsg.textContent   = 'Better luck next time!';
    overlayScore.textContent = `Score: ${finalScore}  |  Best: ${bests[currentGame]}`;
    startBtn.textContent = 'PLAY AGAIN';
    showOverlay();
    stopGame();
  }

  function stopGame() {
    cancelAnimationFrame(gameLoop);
    gameLoop    = null;
    gameRunning = false;
    paused      = false;
    startBtn.textContent = 'START GAME';
  }

  function togglePause() {
    if (!gameRunning) return;
    paused = !paused;
    if (!paused) startCurrentLoop();
  }

  function startGame(name) {
    stopGame();
    score = 0;
    scoreEl.textContent = '0';
    gameRunning = true;
    if      (name === 'snake')    initSnake();
    else if (name === 'invaders') initInvaders();
    else if (name === 'breakout') initBreakout();
  }

  function startCurrentLoop() {
    if (currentGame === 'snake')    loopSnake();
    else if (currentGame === 'invaders') loopInvaders();
    else if (currentGame === 'breakout') loopBreakout();
  }

  function addScore(n) {
    score += n;
    scoreEl.textContent = score;
    if (score > bests[currentGame]) {
      bests[currentGame] = score;
      bestEl.textContent = score;
    }
  }

  /* ════════════════════════════════════════
     GAME 1: NEON SNAKE
  ════════════════════════════════════════ */
  let snake, dir, nextDir, food, foodTimer, level;
  const CELL = 20;
  const COLS  = Math.floor(500 / CELL);
  const ROWS  = Math.floor(420 / CELL);

  function initSnake() {
    snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    dir = { x: 1, y: 0 };
    nextDir = { x: 1, y: 0 };
    level = 1;
    placeFood();
    document.addEventListener('keydown', onSnakeKey);
    loopSnake();
  }

  function onSnakeKey(e) {
    if (!gameRunning || currentGame !== 'snake') return;
    const map = {
      ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 },
      ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 },
      w: { x: 0, y: -1 }, s: { x: 0, y: 1 },
      a: { x: -1, y: 0 }, d: { x: 1, y: 0 },
    };
    if (map[e.key] && !(map[e.key].x === -dir.x && map[e.key].y === -dir.y)) {
      nextDir = map[e.key];
      e.preventDefault();
    }
  }

  function placeFood() {
    let pos;
    do {
      pos = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
    } while (snake.some(s => s.x === pos.x && s.y === pos.y));
    food = pos;
    foodTimer = 0;
  }

  let snakeTick = 0;
  function loopSnake() {
    if (!gameRunning || paused) return;
    snakeTick++;
    const speed = Math.max(4, 9 - Math.floor(score / 50));
    if (snakeTick % speed === 0) updateSnake();
    drawSnake();
    gameLoop = requestAnimationFrame(loopSnake);
  }

  function updateSnake() {
    dir = { ...nextDir };
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
    // Wall collision
    if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) { gameOver(score); return; }
    // Self collision
    if (snake.some(s => s.x === head.x && s.y === head.y)) { gameOver(score); return; }
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      addScore(10 + level * 2);
      if (score % 100 === 0) level++;
      placeFood();
    } else {
      snake.pop();
    }
    foodTimer++;
  }

  function drawSnake() {
    // Background
    ctx.fillStyle = '#0a0e1a';
    ctx.fillRect(0, 0, 500, 420);

    // Grid
    ctx.strokeStyle = 'rgba(0,242,254,0.04)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= COLS; x++) { ctx.beginPath(); ctx.moveTo(x * CELL, 0); ctx.lineTo(x * CELL, 420); ctx.stroke(); }
    for (let y = 0; y <= ROWS; y++) { ctx.beginPath(); ctx.moveTo(0, y * CELL); ctx.lineTo(500, y * CELL); ctx.stroke(); }

    // Snake body
    snake.forEach((seg, i) => {
      const ratio = 1 - i / snake.length;
      const g = ctx.createRadialGradient(
        seg.x * CELL + CELL / 2, seg.y * CELL + CELL / 2, 1,
        seg.x * CELL + CELL / 2, seg.y * CELL + CELL / 2, CELL
      );
      g.addColorStop(0, `rgba(0,242,254,${0.9 * ratio})`);
      g.addColorStop(1, `rgba(79,172,254,${0.3 * ratio})`);
      ctx.fillStyle = g;
      ctx.shadowColor = '#00f2fe';
      ctx.shadowBlur  = i === 0 ? 18 : 8 * ratio;
      roundRect(ctx, seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2, 5);
      ctx.fill();
    });

    // Eyes on head
    const h = snake[0];
    ctx.fillStyle = '#fff';
    ctx.shadowBlur = 0;
    ctx.beginPath(); ctx.arc(h.x * CELL + CELL * 0.3, h.y * CELL + CELL * 0.35, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(h.x * CELL + CELL * 0.7, h.y * CELL + CELL * 0.35, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#00f2fe';
    ctx.beginPath(); ctx.arc(h.x * CELL + CELL * 0.3, h.y * CELL + CELL * 0.35, 1.2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(h.x * CELL + CELL * 0.7, h.y * CELL + CELL * 0.35, 1.2, 0, Math.PI * 2); ctx.fill();

    // Food (pulsing orb)
    const pulse = 0.7 + 0.3 * Math.sin(foodTimer * 0.15);
    const fg = ctx.createRadialGradient(
      food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, 1,
      food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL * pulse
    );
    fg.addColorStop(0, '#fffde7');
    fg.addColorStop(0.4, '#ffe066');
    fg.addColorStop(1, 'rgba(255,200,0,0)');
    ctx.fillStyle  = fg;
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur  = 20 * pulse;
    ctx.beginPath();
    ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL * 0.38 * pulse, 0, Math.PI * 2);
    ctx.fill();

    // Level indicator
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(0,242,254,0.5)';
    ctx.font = 'bold 11px Inter,sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`LVL ${level}`, 490, 415);
    ctx.textAlign = 'left';
  }

  /* ════════════════════════════════════════
     GAME 2: SPACE CODE (INVADERS)
  ════════════════════════════════════════ */
  let player2, bullets, invaders2, invBullets, invDir, invTimer, stars2;
  const INV_ROWS = 4, INV_COLS = 9;

  function initInvaders() {
    player2 = { x: 230, y: 380, w: 40, h: 25, speed: 5 };
    bullets  = [];
    invBullets = [];
    stars2 = Array.from({ length: 60 }, () => ({
      x: Math.random() * 500,
      y: Math.random() * 420,
      r: Math.random() * 1.5,
      speed: 0.3 + Math.random() * 0.7
    }));
    invaders2 = [];
    invDir = 1;
    invTimer = 0;
    for (let r = 0; r < INV_ROWS; r++) {
      for (let c = 0; c < INV_COLS; c++) {
        invaders2.push({ x: 30 + c * 50, y: 40 + r * 38, w: 28, h: 20, alive: true, row: r });
      }
    }
    document.addEventListener('keydown', onInvaderKey);
    document.addEventListener('keyup', onInvaderKeyUp);
    loopInvaders();
  }

  const invKeyState = {};
  function onInvaderKey(e)    { invKeyState[e.key] = true;  if (e.key === ' ') fireInvader(); }
  function onInvaderKeyUp(e)  { invKeyState[e.key] = false; }

  function fireInvader() {
    if (!gameRunning || currentGame !== 'invaders') return;
    bullets.push({ x: player2.x + player2.w / 2, y: player2.y, speed: 8 });
  }

  function loopInvaders() {
    if (!gameRunning || paused) return;
    updateInvaders();
    drawInvaders();
    gameLoop = requestAnimationFrame(loopInvaders);
  }

  function updateInvaders() {
    // Move player
    if ((invKeyState['ArrowLeft'] || invKeyState['a']) && player2.x > 0) player2.x -= player2.speed;
    if ((invKeyState['ArrowRight'] || invKeyState['d']) && player2.x + player2.w < 500) player2.x += player2.speed;

    // Move bullets
    bullets.forEach(b => b.y -= b.speed);
    bullets = bullets.filter(b => b.y > 0);

    // Move invader bullets
    invBullets.forEach(b => b.y += b.speed);
    invBullets = invBullets.filter(b => b.y < 420);

    // Move invaders
    invTimer++;
    const speed = Math.max(8, 20 - Math.floor(score / 30));
    if (invTimer % speed === 0) {
      const alive = invaders2.filter(i => i.alive);
      const maxX = Math.max(...alive.map(i => i.x + i.w));
      const minX = Math.min(...alive.map(i => i.x));
      if (maxX >= 495 || minX <= 5) {
        invDir *= -1;
        invaders2.forEach(i => { if (i.alive) i.y += 15; });
      } else {
        invaders2.forEach(i => { if (i.alive) i.x += invDir * 10; });
      }

      // Random invader fires
      if (Math.random() < 0.4) {
        const shooters = alive.filter(i => !alive.some(j => j.alive && j.x === i.x && j.y > i.y));
        if (shooters.length) {
          const shooter = shooters[Math.floor(Math.random() * shooters.length)];
          invBullets.push({ x: shooter.x + shooter.w / 2, y: shooter.y + shooter.h, speed: 3.5 });
        }
      }
    }

    // Bullet vs invader
    bullets.forEach(b => {
      invaders2.forEach(inv => {
        if (inv.alive && b.x > inv.x && b.x < inv.x + inv.w && b.y > inv.y && b.y < inv.y + inv.h) {
          inv.alive = false;
          b.y = -100;
          addScore(10 + (3 - inv.row) * 10);
        }
      });
    });

    // Invader bullet vs player
    invBullets.forEach(b => {
      if (b.x > player2.x && b.x < player2.x + player2.w && b.y > player2.y && b.y < player2.y + player2.h) {
        gameOver(score);
      }
    });

    // Win condition
    if (invaders2.every(i => !i.alive)) {
      addScore(200);
      initInvaders(); // next wave
    }

    // Invaders reach bottom
    if (invaders2.some(i => i.alive && i.y + i.h > 370)) gameOver(score);

    // Scroll stars
    stars2.forEach(s => { s.y += s.speed; if (s.y > 420) { s.y = 0; s.x = Math.random() * 500; } });
  }

  function drawInvaders() {
    ctx.fillStyle = '#050a14';
    ctx.fillRect(0, 0, 500, 420);

    // Stars
    stars2.forEach(s => {
      ctx.fillStyle = `rgba(255,255,255,${0.3 + s.r * 0.4})`;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
    });

    // Draw invaders
    invaders2.forEach(inv => {
      if (!inv.alive) return;
      const colors = ['#ff6b6b', '#ffd166', '#06d6a0', '#4facfe'];
      const col = colors[inv.row % colors.length];
      ctx.shadowColor = col; ctx.shadowBlur = 10;
      ctx.fillStyle = col;
      // Alien body
      ctx.beginPath();
      ctx.roundRect(inv.x, inv.y, inv.w, inv.h, 4);
      ctx.fill();
      // Eyes
      ctx.fillStyle = '#fff';
      ctx.shadowBlur = 0;
      ctx.fillRect(inv.x + 5, inv.y + 4, 5, 5);
      ctx.fillRect(inv.x + 18, inv.y + 4, 5, 5);
      // Tentacles
      ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.shadowColor = col; ctx.shadowBlur = 5;
      ctx.beginPath(); ctx.moveTo(inv.x + 4, inv.y + inv.h); ctx.lineTo(inv.x + 4, inv.y + inv.h + 6); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(inv.x + inv.w / 2, inv.y + inv.h); ctx.lineTo(inv.x + inv.w / 2, inv.y + inv.h + 6); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(inv.x + inv.w - 4, inv.y + inv.h); ctx.lineTo(inv.x + inv.w - 4, inv.y + inv.h + 6); ctx.stroke();
    });

    // Player ship
    ctx.shadowColor = '#00f2fe'; ctx.shadowBlur = 20;
    ctx.fillStyle = '#00f2fe';
    ctx.beginPath();
    ctx.moveTo(player2.x + player2.w / 2, player2.y);
    ctx.lineTo(player2.x, player2.y + player2.h);
    ctx.lineTo(player2.x + player2.w, player2.y + player2.h);
    ctx.closePath(); ctx.fill();
    // Engine glow
    const eg = ctx.createRadialGradient(player2.x + player2.w / 2, player2.y + player2.h, 0, player2.x + player2.w / 2, player2.y + player2.h, 12);
    eg.addColorStop(0, 'rgba(255,100,50,0.9)');
    eg.addColorStop(1, 'rgba(255,50,0,0)');
    ctx.fillStyle = eg;
    ctx.beginPath(); ctx.arc(player2.x + player2.w / 2, player2.y + player2.h, 12, 0, Math.PI * 2); ctx.fill();

    // Bullets
    bullets.forEach(b => {
      ctx.fillStyle = '#00f2fe'; ctx.shadowColor = '#00f2fe'; ctx.shadowBlur = 12;
      ctx.fillRect(b.x - 2, b.y, 4, 14);
    });

    // Invader bullets
    invBullets.forEach(b => {
      ctx.fillStyle = '#ff4d4d'; ctx.shadowColor = '#ff0000'; ctx.shadowBlur = 10;
      ctx.fillRect(b.x - 2, b.y, 4, 12);
    });

    // Ground line
    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(0,242,254,0.25)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, 375); ctx.lineTo(500, 375); ctx.stroke();
  }

  /* ════════════════════════════════════════
     GAME 3: BLOCK BUSTER (BREAKOUT)
  ════════════════════════════════════════ */
  let paddle, ball, blocks, bkTrail;
  const PAD_W = 80, PAD_H = 12;
  const BLK_ROWS = 5, BLK_COLS = 9;
  const BLK_W = 48, BLK_H = 18, BLK_GAP = 6;
  let mouseX3 = 250;

  function initBreakout() {
    paddle = { x: 210, y: 395, w: PAD_W, h: PAD_H };
    ball   = { x: 250, y: 370, r: 8, vx: 3.5, vy: -4.5 };
    bkTrail = [];
    blocks  = [];
    const colors = ['#ff6b6b','#ff9f43','#ffd166','#06d6a0','#4facfe'];
    for (let r = 0; r < BLK_ROWS; r++) {
      for (let c = 0; c < BLK_COLS; c++) {
        blocks.push({
          x: 14 + c * (BLK_W + BLK_GAP),
          y: 45  + r * (BLK_H + BLK_GAP),
          w: BLK_W, h: BLK_H,
          alive: true,
          color: colors[r % colors.length],
          hits: r < 2 ? 1 : (r < 4 ? 2 : 3)
        });
      }
    }
    canvas.addEventListener('mousemove', onBreakoutMouse);
    document.addEventListener('keydown', onBreakoutKey);
    loopBreakout();
  }

  function onBreakoutMouse(e) {
    const rect = canvas.getBoundingClientRect();
    mouseX3 = e.clientX - rect.left;
    if (gameRunning && currentGame === 'breakout') {
      paddle.x = Math.max(0, Math.min(500 - paddle.w, mouseX3 - paddle.w / 2));
    }
  }

  function onBreakoutKey(e) {
    if (!gameRunning || currentGame !== 'breakout') return;
    if (e.key === 'ArrowLeft'  || e.key === 'a') paddle.x = Math.max(0, paddle.x - 10);
    if (e.key === 'ArrowRight' || e.key === 'd') paddle.x = Math.min(500 - paddle.w, paddle.x + 10);
  }

  function loopBreakout() {
    if (!gameRunning || paused) return;
    updateBreakout();
    drawBreakout();
    gameLoop = requestAnimationFrame(loopBreakout);
  }

  function updateBreakout() {
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Trail
    bkTrail.push({ x: ball.x, y: ball.y, age: 0 });
    bkTrail.forEach(t => t.age++);
    bkTrail = bkTrail.filter(t => t.age < 12);

    // Wall bounces
    if (ball.x - ball.r < 0)   { ball.x = ball.r; ball.vx *= -1; }
    if (ball.x + ball.r > 500) { ball.x = 500 - ball.r; ball.vx *= -1; }
    if (ball.y - ball.r < 0)   { ball.y = ball.r; ball.vy *= -1; }

    // Floor — lose
    if (ball.y + ball.r > 420) { gameOver(score); return; }

    // Paddle collision
    if (ball.y + ball.r >= paddle.y &&
        ball.y - ball.r <= paddle.y + paddle.h &&
        ball.x > paddle.x &&
        ball.x < paddle.x + paddle.w) {
      ball.y = paddle.y - ball.r;
      const hit = (ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2);
      ball.vx = hit * 6;
      ball.vy = -Math.abs(ball.vy);
    }

    // Block collisions
    blocks.forEach(b => {
      if (!b.alive) return;
      if (ball.x + ball.r > b.x && ball.x - ball.r < b.x + b.w &&
          ball.y + ball.r > b.y && ball.y - ball.r < b.y + b.h) {
        b.hits--;
        if (b.hits <= 0) { b.alive = false; addScore(30); }
        // Determine bounce side
        const overlapL = ball.x + ball.r - b.x;
        const overlapR = b.x + b.w - (ball.x - ball.r);
        const overlapT = ball.y + ball.r - b.y;
        const overlapB = b.y + b.h - (ball.y - ball.r);
        const minO = Math.min(overlapL, overlapR, overlapT, overlapB);
        if (minO === overlapT || minO === overlapB) ball.vy *= -1;
        else ball.vx *= -1;
      }
    });

    // Speed up over time
    const spd = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
    if (spd < 5 + score / 60) {
      ball.vx *= 1.002;
      ball.vy *= 1.002;
    }

    // Win
    if (blocks.every(b => !b.alive)) {
      addScore(300);
      initBreakout();
    }
  }

  function drawBreakout() {
    ctx.fillStyle = '#07090f';
    ctx.fillRect(0, 0, 500, 420);

    // Background grid
    ctx.strokeStyle = 'rgba(0,242,254,0.04)'; ctx.lineWidth = 1;
    for (let x = 0; x < 500; x += 25) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 420); ctx.stroke(); }
    for (let y = 0; y < 420; y += 25) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(500, y); ctx.stroke(); }

    // Blocks
    blocks.forEach(b => {
      if (!b.alive) return;
      const alpha = b.hits === 3 ? 1 : b.hits === 2 ? 0.7 : 0.45;
      ctx.shadowColor = b.color; ctx.shadowBlur = 12;
      ctx.fillStyle = b.color;
      ctx.globalAlpha = alpha;
      ctx.beginPath(); ctx.roundRect(b.x, b.y, b.w, b.h, 4); ctx.fill();
      ctx.globalAlpha = 1;
      // Crack overlay for damaged blocks
      if (b.hits === 1 || b.hits === 2) {
        ctx.strokeStyle = 'rgba(0,0,0,0.4)'; ctx.lineWidth = 2; ctx.shadowBlur = 0;
        ctx.beginPath(); ctx.moveTo(b.x + b.w * 0.3, b.y + 2); ctx.lineTo(b.x + b.w * 0.5, b.y + b.h - 2); ctx.stroke();
      }
    });

    // Ball trail
    bkTrail.forEach((t, i) => {
      ctx.globalAlpha = (1 - t.age / 12) * 0.5;
      ctx.fillStyle = '#00f2fe';
      ctx.shadowColor = '#00f2fe'; ctx.shadowBlur = 5;
      ctx.beginPath(); ctx.arc(t.x, t.y, ball.r * (1 - t.age / 14), 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = 1;

    // Ball
    const bg = ctx.createRadialGradient(ball.x - 2, ball.y - 2, 1, ball.x, ball.y, ball.r);
    bg.addColorStop(0, '#ffffff');
    bg.addColorStop(0.5, '#00f2fe');
    bg.addColorStop(1, '#4facfe');
    ctx.fillStyle = bg; ctx.shadowColor = '#00f2fe'; ctx.shadowBlur = 25;
    ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2); ctx.fill();

    // Paddle
    const pg = ctx.createLinearGradient(paddle.x, paddle.y, paddle.x + paddle.w, paddle.y);
    pg.addColorStop(0, '#4facfe');
    pg.addColorStop(0.5, '#00f2fe');
    pg.addColorStop(1, '#4facfe');
    ctx.fillStyle = pg; ctx.shadowColor = '#00f2fe'; ctx.shadowBlur = 18;
    ctx.beginPath(); ctx.roundRect(paddle.x, paddle.y, paddle.w, paddle.h, 6); ctx.fill();
  }

  /* ── Utility ── */
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  /* ── Polyfill for roundRect if unavailable ── */
  if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
      roundRect(this, x, y, w, h, r); return this;
    };
  }

  /* ── Touch controls (mobile) ── */
  let touchStartX = 0;
  canvas.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; e.preventDefault(); }, { passive: false });
  canvas.addEventListener('touchmove', e => {
    const dx = e.touches[0].clientX - touchStartX;
    if (currentGame === 'snake') {
      if (Math.abs(dx) > 20) nextDir = dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 };
    } else if (currentGame === 'invaders') {
      if (dx > 0) invKeyState['ArrowRight'] = true; else invKeyState['ArrowLeft'] = true;
    } else if (currentGame === 'breakout') {
      paddle.x = Math.max(0, Math.min(500 - paddle.w, e.touches[0].clientX - canvas.getBoundingClientRect().left - paddle.w / 2));
    }
    e.preventDefault();
  }, { passive: false });
  canvas.addEventListener('touchend', () => { invKeyState['ArrowLeft'] = false; invKeyState['ArrowRight'] = false; });

  /* ── Fire on touch for invaders ── */
  canvas.addEventListener('touchstart', () => { if (currentGame === 'invaders') fireInvader(); }, { passive: true });

  console.log('%c🎮 Arcade Engine Ready — 3 Games Loaded', 'color:#00f2fe;font-size:14px;font-weight:bold;');
})();
