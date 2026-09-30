const PI2 = Math.PI * 2;
const VIDA_RASTRO = 700;
const VIDA_CORTE = 650;

let canvas;
let ctx;
let largura = 0;
let altura = 0;
let dpr = 1;
let folhas = [];
let metades = [];
let rastro = [];
let cortes = [];
let gotas = [];
let vento = 0;
let rajada = 0;
let ultimo = 0;
let quadro = 0;
let ativo = false;
let reduzido = false;

const acaso = (min, max) => min + Math.random() * (max - min);

function novaFolha(topo) {
  const petala = Math.random() < 0.22;
  return {
    x: acaso(-40, largura + 40),
    y: topo ? acaso(-altura * 0.3, -10) : acaso(0, altura),
    tamanho: petala ? acaso(4, 7) : acaso(5, 11),
    vx: acaso(-0.3, 0.3),
    vy: acaso(0.35, 0.9),
    giro: acaso(0, PI2),
    velGiro: acaso(-0.03, 0.03),
    fase: acaso(0, PI2),
    velFase: acaso(0.02, 0.05),
    cor: petala ? "179,55,42" : Math.random() < 0.5 ? "21,19,16" : "74,68,61",
    alfa: petala ? acaso(0.55, 0.8) : acaso(0.35, 0.7)
  };
}

function redimensionar() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  largura = window.innerWidth;
  altura = window.innerHeight;
  canvas.width = (largura * dpr) | 0;
  canvas.height = (altura * dpr) | 0;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const alvo = reduzido ? 0 : Math.min(60, Math.round((largura * altura) / 26000));
  while (folhas.length < alvo) folhas.push(novaFolha(false));
  folhas.length = alvo;
}

function desenharFolha(f, escalaX) {
  ctx.save();
  ctx.translate(f.x, f.y);
  ctx.rotate(f.giro);
  ctx.scale(escalaX, 1);
  ctx.fillStyle = `rgba(${f.cor},${f.alfa})`;
  ctx.beginPath();
  ctx.moveTo(-f.tamanho, 0);
  ctx.quadraticCurveTo(0, -f.tamanho * 0.62, f.tamanho, 0);
  ctx.quadraticCurveTo(0, f.tamanho * 0.62, -f.tamanho, 0);
  ctx.fill();
  ctx.restore();
}

function distanciaSegmento(px, py, c) {
  const dx = c.x2 - c.x1;
  const dy = c.y2 - c.y1;
  const t = Math.max(0, Math.min(1, ((px - c.x1) * dx + (py - c.y1) * dy) / (dx * dx + dy * dy || 1)));
  return Math.hypot(px - (c.x1 + t * dx), py - (c.y1 + t * dy));
}

function partir(f, c) {
  const comp = Math.hypot(c.x2 - c.x1, c.y2 - c.y1) || 1;
  const nx = -(c.y2 - c.y1) / comp;
  const ny = (c.x2 - c.x1) / comp;
  for (const lado of [-1, 1]) {
    metades.push({
      x: f.x, y: f.y, tamanho: f.tamanho, cor: f.cor, alfa: f.alfa,
      giro: f.giro, velGiro: lado * acaso(0.08, 0.18),
      vx: nx * lado * acaso(1.5, 3.2) + (c.x2 - c.x1) / comp * 1.4,
      vy: ny * lado * acaso(1.5, 3.2) - 0.6,
      lado, vida: 1
    });
  }
  Object.assign(f, novaFolha(true));
}

function atualizar(dt, agora) {
  rajada += (Math.sin(agora / 3100) * Math.sin(agora / 1700) - rajada) * 0.01;
  vento = 0.35 + rajada * 1.1;

  for (const f of folhas) {
    f.fase += f.velFase * dt;
    f.giro += f.velGiro * dt;
    f.x += (f.vx + vento + Math.sin(f.fase) * 0.6) * dt;
    f.y += (f.vy + Math.cos(f.fase * 0.7) * 0.25) * dt;
    if (f.y > altura + 20 || f.x > largura + 60 || f.x < -60) Object.assign(f, novaFolha(true));
  }

  for (let i = metades.length - 1; i >= 0; i--) {
    const m = metades[i];
    m.vy += 0.06 * dt;
    m.vx *= 0.985;
    m.x += m.vx * dt;
    m.y += m.vy * dt;
    m.giro += m.velGiro * dt;
    m.vida -= 0.012 * dt;
    if (m.vida <= 0) metades.splice(i, 1);
  }

  for (let i = gotas.length - 1; i >= 0; i--) {
    const g = gotas[i];
    g.raio += (g.alvo - g.raio) * 0.25;
    g.vida -= 0.01 * dt;
    if (g.vida <= 0) gotas.splice(i, 1);
  }

  while (rastro.length && agora - rastro[0].t > VIDA_RASTRO) rastro.shift();
  while (cortes.length && agora - cortes[0].t > VIDA_CORTE) cortes.shift();
}

function desenhar(agora) {
  ctx.clearRect(0, 0, largura, altura);

  for (const g of gotas) {
    ctx.fillStyle = `rgba(21,19,16,${g.vida * 0.55})`;
    for (const p of g.pontos) {
      ctx.beginPath();
      ctx.arc(g.x + p.dx * g.raio, g.y + p.dy * g.raio, p.r * g.vida, 0, PI2);
      ctx.fill();
    }
  }

  for (const f of folhas) desenharFolha(f, Math.cos(f.fase));

  for (const m of metades) {
    ctx.save();
    ctx.translate(m.x, m.y);
    ctx.rotate(m.giro);
    ctx.fillStyle = `rgba(${m.cor},${m.alfa * m.vida})`;
    ctx.beginPath();
    ctx.moveTo(-m.tamanho, 0);
    ctx.quadraticCurveTo(0, m.lado * m.tamanho * 0.62, m.tamanho, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  if (rastro.length > 1) {
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (let i = 1; i < rastro.length; i++) {
      const a = rastro[i - 1];
      const b = rastro[i];
      const vida = 1 - (agora - b.t) / VIDA_RASTRO;
      if (vida <= 0) continue;
      ctx.strokeStyle = `rgba(21,19,16,${vida * 0.7})`;
      ctx.lineWidth = b.largura * vida;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
  }

  for (const c of cortes) {
    const p = (agora - c.t) / VIDA_CORTE;
    const avanco = Math.min(1, p * 4);
    const x2 = c.x1 + (c.x2 - c.x1) * avanco;
    const y2 = c.y1 + (c.y2 - c.y1) * avanco;
    const vida = 1 - p;
    ctx.lineCap = "round";
    ctx.strokeStyle = `rgba(21,19,16,${vida * 0.9})`;
    ctx.lineWidth = 9 * vida + 1;
    ctx.beginPath();
    ctx.moveTo(c.x1, c.y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.strokeStyle = `rgba(255,250,240,${vida})`;
    ctx.lineWidth = 3 * vida + 0.5;
    ctx.beginPath();
    ctx.moveTo(c.x1, c.y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    if (c.vermelho) {
      ctx.strokeStyle = `rgba(179,55,42,${vida * 0.8})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(c.x1 + 3, c.y1 + 4);
      ctx.lineTo(x2 + 3, y2 + 4);
      ctx.stroke();
    }
  }
}

function laco(agora) {
  if (!ativo) return;
  const dt = Math.min(3, (agora - (ultimo || agora)) / 16.67);
  ultimo = agora;
  atualizar(dt, agora);
  desenhar(agora);
  quadro = requestAnimationFrame(laco);
}

function iniciarLaco() {
  if (ativo) return;
  ativo = true;
  ultimo = 0;
  quadro = requestAnimationFrame(laco);
}

function pararLaco() {
  ativo = false;
  cancelAnimationFrame(quadro);
}

export function pincelar(x, y, velocidade) {
  if (reduzido) return;
  const espessura = Math.max(1.2, 7 - velocidade * 0.12);
  rastro.push({ x, y, t: performance.now(), largura: espessura });
  if (rastro.length > 80) rastro.shift();
}

export function respingar(x, y) {
  if (reduzido) return;
  const pontos = [];
  const total = 8 + ((Math.random() * 8) | 0);
  for (let i = 0; i < total; i++) {
    const ang = acaso(0, PI2);
    const dist = Math.random() ** 1.6;
    pontos.push({ dx: Math.cos(ang) * dist, dy: Math.sin(ang) * dist, r: acaso(1, 4.5) * (1.2 - dist) });
  }
  gotas.push({ x, y, raio: 2, alvo: acaso(16, 30), vida: 1, pontos });
  if (gotas.length > 20) gotas.shift();
}

export function cortar(x1, y1, x2, y2, vermelho = false) {
  const c = { x1, y1, x2, y2, t: performance.now(), vermelho };
  cortes.push(c);
  for (const f of folhas) {
    if (distanciaSegmento(f.x, f.y, c) < 26) partir(f, c);
  }
}

export function iniciarTela(elemento, movimentoReduzido) {
  canvas = elemento;
  ctx = canvas.getContext("2d");
  reduzido = movimentoReduzido;
  redimensionar();
  let espera = 0;
  window.addEventListener("resize", () => {
    clearTimeout(espera);
    espera = setTimeout(redimensionar, 150);
  }, { passive: true });
  document.addEventListener("visibilitychange", () => (document.hidden ? pararLaco() : iniciarLaco()));
  iniciarLaco();
}
