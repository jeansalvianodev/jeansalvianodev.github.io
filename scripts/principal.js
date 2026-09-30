import { textos, fichas, arsenal, conceitos, batalhas, publicos, virtudes, urlIcone } from "./dados.js";
import { ligar, desligar, estaLigado, tocarCorte } from "./musica.js";
import { iniciarTela, pincelar, respingar, cortar } from "./tela.js";

const IDIOMAS = ["pt", "en"];
const CHAVE_IDIOMA = "samurai.idioma";
const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const $ = (seletor) => document.querySelector(seletor);

let idioma = "pt";
let virtudeAtual = 0;
let iaiAtivo = false;

function criar(tag, classe, texto) {
  const el = document.createElement(tag);
  if (classe) el.className = classe;
  if (texto !== undefined) el.textContent = texto;
  return el;
}

function lerPreferencia() {
  try {
    const salvo = localStorage.getItem(CHAVE_IDIOMA);
    if (IDIOMAS.includes(salvo)) return salvo;
  } catch {}
  return (navigator.language || "pt").toLowerCase().startsWith("pt") ? "pt" : "en";
}

function salvarPreferencia(valor) {
  try { localStorage.setItem(CHAVE_IDIOMA, valor); } catch {}
}

function aplicarTextos() {
  const dicionario = textos[idioma];
  for (const el of document.querySelectorAll("[data-i18n]")) {
    const valor = dicionario[el.dataset.i18n];
    if (valor !== undefined) el.textContent = valor;
  }
  document.documentElement.lang = idioma === "pt" ? "pt-BR" : "en";
  $("#idioma").textContent = idioma === "pt" ? "EN" : "PT";
}

function renderizarFichas() {
  const lista = $("#fichas");
  lista.replaceChildren();
  for (const chave of fichas) {
    const bloco = criar("div");
    bloco.append(criar("dt", "", textos[idioma][`ficha.${chave}`]), criar("dd", "", textos[idioma][`ficha.${chave}.v`]));
    lista.append(bloco);
  }
}

function criarIcone(nome, caminho) {
  if (!caminho) return criar("span", "monograma", nome.charAt(0));
  const img = criar("img");
  img.src = urlIcone(caminho);
  img.alt = "";
  img.width = 22;
  img.height = 22;
  img.loading = "lazy";
  img.decoding = "async";
  img.referrerPolicy = "no-referrer";
  img.addEventListener("error", () => img.replaceWith(criar("span", "monograma", nome.charAt(0))), { once: true });
  return img;
}

function renderizarArsenal() {
  const grade = $("#arsenal-grade");
  grade.replaceChildren();
  arsenal.forEach((grupo, i) => {
    const bloco = criar("article", "arsenal-grupo revelar");
    bloco.dataset.kanji = grupo.kanji;
    bloco.style.setProperty("--atraso", i);
    const titulo = criar("h3", "", grupo.titulo[idioma]);
    titulo.append(criar("small", "", grupo.sub[idioma]));
    const lista = criar("ul", "armas");
    for (const [nome, caminho] of grupo.itens) {
      const item = criar("li", "arma");
      item.append(criarIcone(nome, caminho), criar("span", "", nome));
      lista.append(item);
    }
    bloco.append(titulo, lista);
    grade.append(bloco);
  });
  $("#conceitos").replaceChildren(...conceitos[idioma].map((c) => criar("li", "", c)));
}

function renderizarBatalhas() {
  const grade = $("#batalhas-grade");
  grade.replaceChildren();
  batalhas.forEach((b, i) => {
    const card = criar("article", "batalha revelar");
    card.style.setProperty("--atraso", i);
    const etiquetas = criar("ul", "etiquetas");
    etiquetas.append(...b.etiquetas.map((e) => criar("li", "", e)));
    card.append(
      criar("span", "batalha-num", b.num),
      criar("span", "batalha-selo", textos[idioma]["batalhas.fechado"]),
      criar("h3", "", b.titulo[idioma]),
      criar("p", "", b.texto[idioma]),
      etiquetas
    );
    grade.append(card);
  });

  const lista = $("#publicos");
  lista.replaceChildren();
  publicos.forEach((p, i) => {
    const link = criar("a", "publico revelar");
    link.href = `https://github.com/jeansalvianodev/${encodeURIComponent(p.nome)}`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.style.setProperty("--atraso", i % 3);
    link.append(criar("strong", "", p.nome), criar("span", "seta", "→"), criar("p", "", p.texto[idioma]), criar("small", "", p.linguagem));
    lista.append(link);
  });
}

function mostrarVirtude(indice, animar) {
  virtudeAtual = indice;
  const v = virtudes[indice];
  for (const [i, aba] of document.querySelectorAll(".virtude-aba").entries()) {
    const selecionada = i === indice;
    aba.setAttribute("aria-selected", String(selecionada));
    aba.tabIndex = selecionada ? 0 : -1;
  }
  $("#virtude-kanji").textContent = v.kanji;
  $("#virtude-nome").textContent = `${v.nome} · ${v.virtude[idioma]}`;
  $("#virtude-titulo").textContent = v.titulo[idioma];
  $("#virtude-texto").textContent = v.texto[idioma];
  const painel = $("#virtude-painel");
  painel.setAttribute("aria-labelledby", `aba-${indice}`);
  if (animar) {
    painel.classList.remove("trocando");
    void painel.offsetWidth;
    painel.classList.add("trocando");
  }
}

function renderizarVirtudes() {
  const lista = $("#virtudes-lista");
  lista.replaceChildren();
  virtudes.forEach((v, i) => {
    const aba = criar("button", "virtude-aba");
    aba.type = "button";
    aba.id = `aba-${i}`;
    aba.setAttribute("role", "tab");
    aba.setAttribute("aria-controls", "virtude-painel");
    aba.append(criar("b", "", v.kanji), criar("span", "", `${v.nome} · ${v.virtude[idioma]}`));
    aba.addEventListener("click", () => mostrarVirtude(i, true));
    aba.addEventListener("mouseenter", () => { if (virtudeAtual !== i) mostrarVirtude(i, true); });
    lista.append(aba);
  });
  lista.addEventListener("keydown", (e) => {
    const passo = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (!passo) return;
    e.preventDefault();
    const novo = (virtudeAtual + passo + virtudes.length) % virtudes.length;
    mostrarVirtude(novo, true);
    document.getElementById(`aba-${novo}`).focus();
  });
  mostrarVirtude(virtudeAtual, false);
}

function renderizarTudo() {
  aplicarTextos();
  renderizarFichas();
  renderizarArsenal();
  renderizarBatalhas();
  renderizarVirtudes();
  observarRevelacoes();
}

function separarNome() {
  let indice = 0;
  for (const parte of document.querySelectorAll(".nome span")) {
    const texto = parte.textContent;
    parte.textContent = "";
    parte.setAttribute("aria-hidden", "true");
    for (const letra of texto) {
      const span = criar("span", "letra", letra);
      span.style.setProperty("--i", indice++);
      parte.append(span);
    }
  }
  $(".nome").setAttribute("aria-label", "Jean Salviano");
}

let observador;

function observarRevelacoes() {
  if (reduzido || !("IntersectionObserver" in window)) {
    for (const el of document.querySelectorAll(".revelar")) el.classList.add("visivel");
    return;
  }
  observador ??= new IntersectionObserver((entradas) => {
    for (const entrada of entradas) {
      if (!entrada.isIntersecting) continue;
      entrada.target.classList.add("visivel");
      observador.unobserve(entrada.target);
    }
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
  for (const el of document.querySelectorAll(".revelar:not(.visivel)")) observador.observe(el);
}

function observarSecoes() {
  const links = new Map([...document.querySelectorAll(".trilha a")].map((a) => [a.dataset.secao, a]));
  const obs = new IntersectionObserver((entradas) => {
    for (const entrada of entradas) {
      if (!entrada.isIntersecting) continue;
      for (const a of links.values()) a.classList.remove("ativo");
      links.get(entrada.target.id)?.classList.add("ativo");
    }
  }, { rootMargin: "-45% 0px -50% 0px" });
  for (const secao of document.querySelectorAll("main > section")) obs.observe(secao);
}

function atualizarBotaoSom() {
  $("#som").setAttribute("aria-pressed", String(estaLigado()));
}

function alternarSom() {
  if (estaLigado()) desligar();
  else ligar();
  atualizarBotaoSom();
}

function entrar(comSom) {
  if (comSom) ligar();
  atualizarBotaoSom();
  const portal = $("#portal");
  portal.classList.add("saindo");
  portal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("trancado");
  document.body.classList.add("entrou");
  setTimeout(() => portal.remove(), 1300);
  window.scrollTo(0, 0);
}

function iai() {
  if (iaiAtivo) return;
  iaiAtivo = true;
  const samurai = $("#samurai");
  const caixa = samurai.getBoundingClientRect();
  samurai.classList.add("iai");
  tocarCorte();
  setTimeout(() => {
    const y = caixa.top + caixa.height * 0.3;
    cortar(-40, y + 140, window.innerWidth + 40, y - 120, true);
    const clarao = $("#clarao");
    clarao.classList.remove("ativo");
    void clarao.offsetWidth;
    clarao.classList.add("ativo");
    if (!reduzido) {
      document.body.classList.add("tremor");
      setTimeout(() => document.body.classList.remove("tremor"), 380);
    }
  }, 90);
  setTimeout(() => {
    samurai.classList.remove("iai");
    iaiAtivo = false;
  }, 950);
}

function configurarPonteiro() {
  let anterior = null;
  let inicio = null;
  let quadroPendente = false;
  let mx = 0;
  let my = 0;
  const heroi = $(".heroi");

  window.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse" && !inicio) return;
    const agora = performance.now();
    const velocidade = anterior ? Math.hypot(e.clientX - anterior.x, e.clientY - anterior.y) / Math.max(1, agora - anterior.t) * 16 : 0;
    anterior = { x: e.clientX, y: e.clientY, t: agora };
    pincelar(e.clientX, e.clientY, velocidade);
    mx = e.clientX / window.innerWidth - 0.5;
    my = e.clientY / window.innerHeight - 0.5;
    if (!quadroPendente && !reduzido) {
      quadroPendente = true;
      requestAnimationFrame(() => {
        heroi.style.setProperty("--mx", mx.toFixed(3));
        heroi.style.setProperty("--my", my.toFixed(3));
        quadroPendente = false;
      });
    }
  }, { passive: true });

  window.addEventListener("pointerdown", (e) => {
    inicio = { x: e.clientX, y: e.clientY, t: performance.now() };
  }, { passive: true });

  window.addEventListener("pointerup", (e) => {
    if (!inicio) return;
    const dx = e.clientX - inicio.x;
    const dy = e.clientY - inicio.y;
    const distancia = Math.hypot(dx, dy);
    const tempo = performance.now() - inicio.t;
    if (distancia > 90 && tempo < 450) {
      const ext = 120 / distancia;
      cortar(inicio.x - dx * ext, inicio.y - dy * ext, e.clientX + dx * ext, e.clientY + dy * ext);
      tocarCorte();
    } else if (distancia < 6 && !e.target.closest("a, button, .samurai")) {
      respingar(e.clientX, e.clientY);
    }
    inicio = null;
  }, { passive: true });

  window.addEventListener("pointercancel", () => { inicio = null; }, { passive: true });
}

function iniciar() {
  idioma = lerPreferencia();
  document.body.classList.add("trancado");
  separarNome();
  renderizarTudo();
  observarSecoes();
  iniciarTela($("#tela"), reduzido);
  configurarPonteiro();

  $("#entrar-som").addEventListener("click", () => entrar(true));
  $("#entrar-silencio").addEventListener("click", () => entrar(false));
  $("#entrar-som").focus({ preventScroll: true });
  $("#som").addEventListener("click", alternarSom);
  $("#idioma").addEventListener("click", () => {
    idioma = idioma === "pt" ? "en" : "pt";
    salvarPreferencia(idioma);
    renderizarTudo();
  });

  const samurai = $("#samurai");
  samurai.tabIndex = 0;
  samurai.addEventListener("click", iai);
  samurai.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      iai();
    }
  });
  $("#desembainhar").addEventListener("click", iai);
}

iniciar();
