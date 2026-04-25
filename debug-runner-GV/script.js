"use strict";

/* =============================================================
   DEBUG RUNNER — 3-Lane Perspective Runner
   ============================================================= */

// ── Config ──────────────────────────────────────────────────
const CONFIG = {
  lanes: 3,
  baseSpeed: 0.0065, // z-units per frame at speedMult 1.0
  speedRamp: 0.00035, // speedMult increase per frame
  maxSpeed: 3.0,
  jumpDuration: 45, // frames for full jump arc
  jumpHeightRatio: 0.36, // jump height as fraction of (NEAR_Y - VP.y)
  laneChangeLerp: 0.13, // lerp factor for lane transitions
  spawnZ: 0.04, // z position where objects are spawned
  collideZMin: 0.82, // start checking obstacle collision
  collideZMax: 1.02,
  collectZMin: 0.8, // start checking collectible pickup
  collectZMax: 1.02,
  collectPoints: 50,
  spawnMin: 55, // min frames between spawns
  spawnMax: 115,
  collectChance: 0.45, // probability of collectible alongside obstacle
  bgSpawnFrames: 30, // frames between background token spawns
};

// ── Palette ─────────────────────────────────────────────────
const PAL = {
  bg0: "#020408",
  bg1: "#060c14",
  green: "#39ff14",
  blue: "#00cfff",
  purple: "#bf5fff",
  yellow: "#f0e040",
  red: "#ff3c3c",
  orange: "#ff8c42",
  dimLine: "#0c1e2e",
};

// ── DOM ─────────────────────────────────────────────────────
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const overlay = document.getElementById("overlay");
const startBtn = document.getElementById("start-btn");
const scoreEl = document.getElementById("score");
const speedEl = document.getElementById("speed");
const finalScoreEl = document.getElementById("final-score");
const scoreMsgEl = document.getElementById("overlay-score-msg");
const subtitleEl = document.getElementById("overlay-subtitle");
const nameSectionEl   = document.getElementById("name-section");
const nameInputEl     = document.getElementById("player-name");
const submitNameBtn   = document.getElementById("submit-name-btn");
const rankingSectionEl = document.getElementById("ranking-section");
const rankingBodyEl   = document.getElementById("ranking-body");
const clearRankingBtn = document.getElementById("clear-ranking-btn");

// ── Ranking ─────────────────────────────────────────────────
const RANKING_KEY = 'debugRunnerRanking';
const RANKING_MAX = 5;

function loadRanking() {
  try {
    return JSON.parse(localStorage.getItem(RANKING_KEY)) || [];
  } catch (_) {
    return [];
  }
}

function saveEntry(name, score) {
  const entries = loadRanking();
  entries.push({ name: name.trim() || 'Anonymous', score: Math.floor(score) });
  entries.sort((a, b) => b.score - a.score);
  const top = entries.slice(0, RANKING_MAX);
  localStorage.setItem(RANKING_KEY, JSON.stringify(top));
  return top;
}

function clearRanking() {
  localStorage.removeItem(RANKING_KEY);
  renderRanking([]);
}

function renderRanking(entries) {
  rankingBodyEl.innerHTML = '';
  if (entries.length === 0) {
    rankingBodyEl.innerHTML =
      '<tr><td id="ranking-empty" colspan="3">No scores yet.</td></tr>';
    return;
  }
  entries.forEach((entry, i) => {
    const tr = document.createElement('tr');
    if (i === 0) tr.classList.add('rank-first');
    const tdRank  = document.createElement('td');
    const tdName  = document.createElement('td');
    const tdScore = document.createElement('td');
    tdRank.textContent  = i + 1;
    tdName.textContent  = entry.name;          // safe: textContent, no XSS
    tdScore.textContent = entry.score.toLocaleString();
    tr.append(tdRank, tdName, tdScore);
    rankingBodyEl.appendChild(tr);
  });
}

function submitName() {
  const name = nameInputEl.value.trim() || 'Anonymous';
  const entries = saveEntry(name, S.score);
  renderRanking(entries);
  nameSectionEl.classList.add('hidden');
  startBtn.classList.remove('hidden');
  startBtn.textContent = '[ RESTART ]';
}

// ── Layout (recomputed on resize) ───────────────────────────
const VP = { x: 0, y: 0 }; // vanishing point
let NEAR_Y = 0; // Y coordinate of the near / player plane
let LANE_W = 0; // lane spacing at the near plane
let W = 0,
  H = 0;

// ── Label banks ─────────────────────────────────────────────
const BUGS = [
  "null",
  "undefined",
  "NaN",
  "ERROR",
  "404",
  "TypeError",
  "throw",
  "loop()",
  "SEGFAULT",
  "panic!",
  "FATAL",
];
const TOKENS = [
  "fix()",
  "pass",
  "patch",
  "debug",
  "++pts",
  "resolved",
  "// ok",
  "push()",
];
const CODE = [
  "const",
  "let",
  "var",
  "if (",
  "} else {",
  "return",
  "async",
  "await",
  "===",
  "!==",
  "null",
  "true",
  "false",
  "() =>",
  ".map(",
  ".filter(",
  "{...}",
  "[ ]",
  "0xFF",
  "#!",
];

// ── State ───────────────────────────────────────────────────
let S;

function resetState() {
  S = {
    running: false,
    gameOver: false,
    score: 0,
    frame: 0,
    speedMult: 1.0,
    nextSpawn: 90,

    player: {
      lane: 1,
      targetLane: 1,
      lerpX: 0, // visual X (lerped each frame)
      isJumping: false,
      jumpFrame: 0,
      jumpY: 0, // 0=ground, 1=peak (normalised sine arc)
    },

    obstacles: [],
    collectibles: [],
    particles: [],
    bgTokens: [],
  };
}

// ── Resize ──────────────────────────────────────────────────
function resize() {
  const wrap = canvas.parentElement;
  W = canvas.width = wrap.clientWidth;
  H = canvas.height = wrap.clientHeight;

  VP.x = W / 2;
  VP.y = H * 0.19;
  NEAR_Y = H * 0.87;
  LANE_W = Math.min(W * 0.21, 145);

  if (S) S.player.lerpX = laneToX(S.player.targetLane);
}

window.addEventListener("resize", resize);

/** Screen X of lane centre at the near plane */
function laneToX(lane) {
  return VP.x + (lane - 1) * LANE_W;
}

/**
 * Perspective-project a world position onto the screen.
 * z: 0 = far (vanishing point)  …  1 = near (player plane)
 */
function project(lane, z) {
  return {
    x: VP.x + (lane - 1) * LANE_W * z,
    y: VP.y + (NEAR_Y - VP.y) * z,
    scale: 0.1 + 0.9 * z,
  };
}

// ── Input ───────────────────────────────────────────────────
const held = new Set();

document.addEventListener("keydown", (e) => {
  // Never block keyboard shortcuts while focus is on an editable element
  const tag = document.activeElement && document.activeElement.tagName;
  const isEditing = tag === "INPUT" || tag === "TEXTAREA";
  if (!isEditing && ["Space", "ArrowLeft", "ArrowRight", "ArrowUp"].includes(e.code))
    e.preventDefault();
  if (held.has(e.code)) return;
  held.add(e.code);
  handleKey(e.code);
});

document.addEventListener("keyup", (e) => held.delete(e.code));

// Touch / swipe
let tx0 = 0,
  ty0 = 0;
canvas.addEventListener(
  "touchstart",
  (e) => {
    tx0 = e.touches[0].clientX;
    ty0 = e.touches[0].clientY;
    e.preventDefault();
  },
  { passive: false },
);

canvas.addEventListener(
  "touchend",
  (e) => {
    const dx = e.changedTouches[0].clientX - tx0;
    const dy = e.changedTouches[0].clientY - ty0;
    if (Math.abs(dx) > Math.abs(dy)) {
      handleKey(dx < -30 ? "ArrowLeft" : "ArrowRight");
    } else if (dy < -30) {
      handleKey("ArrowUp");
    }
    e.preventDefault();
  },
  { passive: false },
);

function handleKey(code) {
  if (!S.running || S.gameOver) return;
  const p = S.player;
  if ((code === "Space" || code === "ArrowUp") && !p.isJumping) {
    startJump();
  } else if (code === "ArrowLeft" && p.targetLane > 0) {
    p.targetLane--;
  } else if (code === "ArrowRight" && p.targetLane < CONFIG.lanes - 1) {
    p.targetLane++;
  }
}

startBtn.addEventListener("click", startGame);
submitNameBtn.addEventListener("click", submitName);
nameInputEl.addEventListener("keydown", (e) => {
  if (e.code === "Enter") { e.preventDefault(); submitName(); }
});
clearRankingBtn.addEventListener("click", clearRanking);

// ── Lifecycle ───────────────────────────────────────────────
function startGame() {
  resetState();
  resize();
  S.player.lerpX = laneToX(1);
  S.running = true;
  overlay.classList.remove("visible");
  scoreMsgEl.classList.add("hidden");
  nameSectionEl.classList.add("hidden");
  rankingSectionEl.classList.add("hidden");
  startBtn.classList.remove("hidden");
  subtitleEl.textContent = "Navigate through the code. Dodge the bugs.";
  startBtn.textContent = "[ START ]";
  requestAnimationFrame(loop);
}

function endGame() {
  S.gameOver = true;
  spawnDeathParticles();
  finalScoreEl.textContent = Math.floor(S.score);
  scoreMsgEl.classList.remove("hidden");
  subtitleEl.textContent = "A bug caught you. Game over.";
  // Keep loop running briefly so death particles animate, then show overlay
  setTimeout(() => {
    S.running = false;
    // Prepare name-input flow
    nameInputEl.value = "";
    nameSectionEl.classList.remove("hidden");
    startBtn.classList.add("hidden");
    // Show ranking with current saved data
    rankingSectionEl.classList.remove("hidden");
    renderRanking(loadRanking());
    overlay.classList.add("visible");
    nameInputEl.focus();
  }, 650);
}

// ── Jump ────────────────────────────────────────────────────
function startJump() {
  const p = S.player;
  p.isJumping = true;
  p.jumpFrame = 0;
  emitParticles(p.lerpX, NEAR_Y, PAL.blue, 7);
}

function tickJump() {
  const p = S.player;
  if (!p.isJumping) {
    p.jumpY = 0;
    return;
  }
  p.jumpFrame++;
  const t = p.jumpFrame / CONFIG.jumpDuration;
  if (t >= 1) {
    p.isJumping = false;
    p.jumpFrame = 0;
    p.jumpY = 0;
  } else {
    p.jumpY = Math.sin(t * Math.PI); // smooth 0 → 1 → 0 arc
  }
}

// ── Spawning ────────────────────────────────────────────────
function nextInterval() {
  return (
    CONFIG.spawnMin +
    Math.floor(Math.random() * (CONFIG.spawnMax - CONFIG.spawnMin))
  );
}

function spawnObstacle() {
  const lane = Math.floor(Math.random() * CONFIG.lanes);
  // Prevent clustering: skip if there's already a nearby obstacle in this lane
  if (S.obstacles.some((o) => o.lane === lane && o.z < 0.28)) return;
  S.obstacles.push({
    lane,
    z: CONFIG.spawnZ,
    label: BUGS[Math.floor(Math.random() * BUGS.length)],
    color: Math.random() < 0.55 ? PAL.red : PAL.purple,
    passed: false,
  });
}

function spawnCollectible() {
  S.collectibles.push({
    lane: Math.floor(Math.random() * CONFIG.lanes),
    z: CONFIG.spawnZ,
    label: TOKENS[Math.floor(Math.random() * TOKENS.length)],
    pulse: Math.random() * Math.PI * 2,
  });
}

function spawnBgToken() {
  S.bgTokens.push({
    x: Math.random() * W,
    y: 0,
    text: CODE[Math.floor(Math.random() * CODE.length)],
    alpha: 0.04 + Math.random() * 0.07,
    vy: 0.5 + Math.random() * 1.1,
    color: Math.random() < 0.7 ? PAL.green : PAL.blue,
  });
}

// ── Particles ───────────────────────────────────────────────
function emitParticles(x, y, color, count = 8) {
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const s = 1.5 + Math.random() * 4;
    S.particles.push({
      x,
      y,
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s - 2,
      life: 1,
      decay: 0.028 + Math.random() * 0.04,
      color,
      r: 2 + Math.random() * 3,
    });
  }
}

function spawnDeathParticles() {
  const p = S.player;
  const dy = NEAR_Y - (NEAR_Y - VP.y) * CONFIG.jumpHeightRatio * p.jumpY;
  emitParticles(p.lerpX, dy, PAL.red, 28);
  emitParticles(p.lerpX, dy, PAL.orange, 14);
}

// ── Update ──────────────────────────────────────────────────
function update() {
  // After game over: only advance particles for the death animation
  if (S.gameOver) {
    S.particles = S.particles.filter((pt) => {
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.vy += 0.18;
      pt.life -= pt.decay;
      return pt.life > 0;
    });
    return;
  }

  S.frame++;
  S.speedMult = Math.min(CONFIG.maxSpeed, 1.0 + S.frame * CONFIG.speedRamp);
  const dz = CONFIG.baseSpeed * S.speedMult;
  S.score += dz * 100;

  scoreEl.textContent = Math.floor(S.score);
  speedEl.textContent = S.speedMult.toFixed(1);

  // ── Player ──
  const p = S.player;
  const tx = laneToX(p.targetLane);
  p.lerpX += (tx - p.lerpX) * CONFIG.laneChangeLerp;
  if (Math.abs(p.lerpX - tx) < 2) p.lane = p.targetLane;
  tickJump();

  // ── Spawn ──
  if (--S.nextSpawn <= 0) {
    spawnObstacle();
    if (Math.random() < CONFIG.collectChance) spawnCollectible();
    S.nextSpawn = nextInterval();
  }

  // ── Background tokens ──
  if (S.frame % CONFIG.bgSpawnFrames === 0) spawnBgToken();
  S.bgTokens = S.bgTokens.filter((t) => {
    t.y += t.vy;
    return t.y < H + 20;
  });

  // ── Obstacles ──
  S.obstacles = S.obstacles.filter((obs) => {
    obs.z += dz;
    if (obs.z > CONFIG.collideZMax) return false;
    if (!obs.passed && obs.z >= CONFIG.collideZMin) {
      // Collision: player in same lane AND not airborne enough
      if (p.targetLane === obs.lane && p.jumpY < 0.25) {
        endGame();
        return false;
      }
      if (obs.z >= 0.96) obs.passed = true;
    }
    return true;
  });

  // ── Collectibles ──
  S.collectibles = S.collectibles.filter((col) => {
    col.z += dz;
    col.pulse += 0.1;
    if (col.z > CONFIG.collectZMax) return false;
    if (col.z >= CONFIG.collectZMin && p.targetLane === col.lane) {
      S.score += CONFIG.collectPoints;
      const proj = project(col.lane, col.z);
      emitParticles(proj.x, proj.y - 20, PAL.yellow, 10);
      return false;
    }
    return true;
  });

  // ── Particles ──
  S.particles = S.particles.filter((pt) => {
    pt.x += pt.vx;
    pt.y += pt.vy;
    pt.vy += 0.18;
    pt.life -= pt.decay;
    return pt.life > 0;
  });
}

// ── Draw ────────────────────────────────────────────────────
function draw() {
  // Background gradient
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, PAL.bg0);
  bg.addColorStop(0.5, "#030a10");
  bg.addColorStop(1, PAL.bg1);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  drawBgTokens();
  drawFloor();
  drawLaneIndicators();
  drawObjects();
  drawPlayer();
  drawParticles();
}

function drawBgTokens() {
  ctx.font = "11px 'Courier New', monospace";
  S.bgTokens.forEach((t) => {
    ctx.save();
    ctx.globalAlpha = t.alpha;
    ctx.fillStyle = t.color;
    ctx.fillText(t.text, t.x, t.y);
    ctx.restore();
  });
}

function drawFloor() {
  ctx.save();
  const lx = VP.x - 1.5 * LANE_W;
  const rx = VP.x + 1.5 * LANE_W;

  // Floor trapezoid tint
  const fill = ctx.createLinearGradient(0, VP.y, 0, NEAR_Y);
  fill.addColorStop(0, "rgba(0, 207, 255, 0.02)");
  fill.addColorStop(1, "rgba(0, 207, 255, 0.08)");
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(VP.x, VP.y);
  ctx.lineTo(rx, NEAR_Y);
  ctx.lineTo(lx, NEAR_Y);
  ctx.closePath();
  ctx.fill();

  // Perspective horizontal grid lines
  [0.11, 0.22, 0.34, 0.47, 0.61, 0.75, 0.89].forEach((z) => {
    const y = VP.y + (NEAR_Y - VP.y) * z;
    const xl = VP.x - 1.5 * LANE_W * z;
    const xr = VP.x + 1.5 * LANE_W * z;
    ctx.beginPath();
    ctx.moveTo(xl, y);
    ctx.lineTo(xr, y);
    ctx.strokeStyle = `rgba(0, 207, 255, ${0.04 + z * 0.1})`;
    ctx.lineWidth = 0.5 + z * 0.5;
    ctx.shadowBlur = 0;
    ctx.stroke();
  });

  // Lane divider lines (4 edges for 3 lanes)
  [-1.5, -0.5, 0.5, 1.5].forEach((offset, i) => {
    const nearX = VP.x + offset * LANE_W;
    const isEdge = i === 0 || i === 3;
    ctx.beginPath();
    ctx.moveTo(VP.x, VP.y);
    ctx.lineTo(nearX, NEAR_Y);
    ctx.strokeStyle = isEdge ? PAL.blue : PAL.dimLine;
    ctx.lineWidth = isEdge ? 1.5 : 0.8;
    ctx.shadowColor = isEdge ? PAL.blue : "transparent";
    ctx.shadowBlur = isEdge ? 8 : 0;
    ctx.stroke();
  });

  // Near-edge glow bar
  ctx.beginPath();
  ctx.moveTo(lx, NEAR_Y);
  ctx.lineTo(rx, NEAR_Y);
  ctx.strokeStyle = PAL.blue;
  ctx.lineWidth = 2;
  ctx.shadowColor = PAL.blue;
  ctx.shadowBlur = 16;
  ctx.stroke();

  // Vanishing-point dot
  ctx.beginPath();
  ctx.arc(VP.x, VP.y, 3, 0, Math.PI * 2);
  ctx.fillStyle = PAL.blue;
  ctx.shadowColor = PAL.blue;
  ctx.shadowBlur = 16;
  ctx.fill();

  ctx.restore();
}

/** Subtle glow ellipses at near edge showing which lane is active */
function drawLaneIndicators() {
  [0, 1, 2].forEach((lane) => {
    const x = laneToX(lane);
    const active = S.player.targetLane === lane;
    ctx.save();
    ctx.globalAlpha = active ? 0.35 : 0.1;
    ctx.fillStyle = active ? PAL.green : PAL.blue;
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = active ? 18 : 0;
    ctx.beginPath();
    ctx.ellipse(x, NEAR_Y + 5, LANE_W * 0.34, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

function drawObjects() {
  // Sort far → near so closer objects render on top
  const all = [
    ...S.obstacles.map((o) => ({ ...o, kind: "obs" })),
    ...S.collectibles.map((c) => ({ ...c, kind: "col" })),
  ].sort((a, b) => a.z - b.z);

  all.forEach((obj) => {
    if (obj.kind === "obs") drawObstacle(obj);
    else drawCollectible(obj);
  });
}

function drawObstacle(obs) {
  const { x, y, scale } = project(obs.lane, obs.z);
  const w = (obs.label.length * 8 + 26) * scale;
  const h = 32 * scale;
  const bx = x - w / 2;
  const by = y - h;

  ctx.save();
  ctx.shadowColor = obs.color;
  ctx.shadowBlur = 14 * scale;
  pathRoundRect(bx, by, w, h, 4 * scale);
  ctx.fillStyle = obs.color + "28";
  ctx.fill();
  ctx.strokeStyle = obs.color;
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  const fs = Math.max(8, Math.round(13 * scale));
  ctx.font = `bold ${fs}px 'Courier New', monospace`;
  ctx.fillStyle = obs.color;
  ctx.textAlign = "center";
  ctx.shadowBlur = 6 * scale;
  ctx.fillText(obs.label, x, by + h * 0.65);
  ctx.restore();
}

function drawCollectible(col) {
  const { x, y, scale } = project(col.lane, col.z);
  const pulse = 0.7 + Math.sin(col.pulse) * 0.3;
  const sz = 28 * scale;
  const bx = x - sz / 2;
  const by = y - sz * 3.2; // float above the lane floor

  ctx.save();
  ctx.globalAlpha = pulse;
  ctx.shadowColor = PAL.yellow;
  ctx.shadowBlur = 12 * scale;
  pathRoundRect(bx, by, sz, sz, 4 * scale);
  ctx.fillStyle = PAL.yellow + "30";
  ctx.fill();
  ctx.strokeStyle = PAL.yellow;
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  const fs = Math.max(7, Math.round(11 * scale));
  ctx.font = `bold ${fs}px 'Courier New', monospace`;
  ctx.fillStyle = PAL.yellow;
  ctx.textAlign = "center";
  ctx.shadowBlur = 8 * scale;
  ctx.fillText(col.label, x, by + sz * 0.65);
  ctx.restore();
}

function drawPlayer() {
  if (!S) return;
  const p = S.player;
  const jumpH = (NEAR_Y - VP.y) * CONFIG.jumpHeightRatio * p.jumpY;
  const px = p.lerpX;
  const py = NEAR_Y - jumpH;
  const pw = 30,
    ph = 40;

  ctx.save();
  ctx.shadowColor = PAL.blue;
  ctx.shadowBlur = 18;

  pathRoundRect(px - pw / 2, py - ph, pw, ph, 5);
  ctx.fillStyle = PAL.blue + "2a";
  ctx.fill();
  ctx.strokeStyle = PAL.blue;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Blinking cursor bar (always visible while jumping)
  if (p.isJumping || Math.floor(Date.now() / 500) % 2 === 0) {
    ctx.fillStyle = PAL.blue;
    ctx.shadowBlur = 8;
    ctx.fillRect(px - 4, py - ph + 9, 3, ph - 18);
  }

  // Forward arrow
  ctx.font = "bold 10px 'Courier New', monospace";
  ctx.fillStyle = PAL.blue;
  ctx.textAlign = "center";
  ctx.shadowBlur = 6;
  ctx.fillText("\u25B6", px + 7, py - ph / 2 + 4);

  ctx.restore();

  // Airborne shadow on ground
  if (p.isJumping && p.jumpY > 0.05) {
    const shadowAlpha = 0.35 * (1 - p.jumpY);
    const shadowW = pw * (0.3 + 0.7 * (1 - p.jumpY));
    ctx.save();
    ctx.globalAlpha = shadowAlpha;
    ctx.fillStyle = PAL.blue;
    ctx.shadowColor = PAL.blue;
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.ellipse(px, NEAR_Y + 3, shadowW / 2, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawParticles() {
  S.particles.forEach((pt) => {
    ctx.save();
    ctx.globalAlpha = pt.life;
    ctx.fillStyle = pt.color;
    ctx.shadowColor = pt.color;
    ctx.shadowBlur = 5;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

// ── Utility ─────────────────────────────────────────────────
/** Sets the canvas path to a rounded rectangle (caller must fill/stroke). */
function pathRoundRect(x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
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

// ── Loop ────────────────────────────────────────────────────
function loop() {
  if (!S.running) return;
  update();
  draw();
  requestAnimationFrame(loop);
}

// ── Boot ────────────────────────────────────────────────────
resetState();
resize();
S.player.lerpX = laneToX(1);
draw(); // static first frame (overlay covers it)
