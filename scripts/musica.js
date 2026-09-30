const ESCALA = [0, 3, 5, 7, 10];
const TONICA = 293.66;
const VOLUME = 0.75;
const FRASES = [
  [0, 2, 1, 0],
  [2, 3, 2, 1, 0],
  [3, 4, 3, 2],
  [5, 4, 3, 2, 3],
  [1, 2, 0, -1, 0],
  [2, 4, 5, 4, 2],
  [0, -1, -2, 0]
];

let ctx = null;
let mestre = null;
let envioReverb = null;
let ruidoBase = null;
let ligado = false;
let agendador = 0;
let proximaFrase = 0;
let proximoKoto = 0;
const cordas = new Map();

const acaso = (min, max) => min + Math.random() * (max - min);
const escolher = (lista) => lista[(Math.random() * lista.length) | 0];

function frequencia(grau, base = TONICA) {
  const oitava = Math.floor(grau / 5);
  return base * 2 ** (oitava + ESCALA[((grau % 5) + 5) % 5] / 12);
}

function criarImpulso(segundos, decaimento) {
  const taxa = ctx.sampleRate;
  const total = (taxa * segundos) | 0;
  const buffer = ctx.createBuffer(2, total, taxa);
  for (let c = 0; c < 2; c++) {
    const dados = buffer.getChannelData(c);
    for (let i = 0; i < total; i++) dados[i] = (Math.random() * 2 - 1) * (1 - i / total) ** decaimento;
  }
  return buffer;
}

function criarRuido(segundos) {
  const total = (ctx.sampleRate * segundos) | 0;
  const buffer = ctx.createBuffer(1, total, ctx.sampleRate);
  const dados = buffer.getChannelData(0);
  for (let i = 0; i < total; i++) dados[i] = Math.random() * 2 - 1;
  return buffer;
}

function conectar(no, pan, envio) {
  const panner = ctx.createStereoPanner();
  panner.pan.value = pan;
  no.connect(panner);
  panner.connect(mestre);
  const reverb = ctx.createGain();
  reverb.gain.value = envio;
  panner.connect(reverb);
  reverb.connect(envioReverb);
}

function sopro(quando, duracao, freq, nivel, q) {
  const fonte = ctx.createBufferSource();
  fonte.buffer = ruidoBase;
  fonte.loop = true;
  const banda = ctx.createBiquadFilter();
  banda.type = "bandpass";
  banda.frequency.value = freq;
  banda.Q.value = q;
  const ganho = ctx.createGain();
  ganho.gain.value = nivel;
  fonte.connect(banda);
  banda.connect(ganho);
  fonte.start(quando, acaso(0, 4));
  fonte.stop(quando + duracao);
  return ganho;
}

function tocarShakuhachi(grau, quando, duracao, forca) {
  const alvo = frequencia(grau);
  const meri = Math.random() < 0.55;
  const inicioBend = meri ? 0.93 : 0.985;
  const tempoBend = meri ? acaso(0.5, 0.9) : 0.18;
  const queda = acaso(0.965, 0.99);
  const osc = ctx.createOscillator();
  const segundo = ctx.createOscillator();
  for (const [o, mult] of [[osc, 1], [segundo, 2]]) {
    o.type = "sine";
    o.frequency.setValueAtTime(alvo * mult * inicioBend, quando);
    o.frequency.exponentialRampToValueAtTime(alvo * mult, quando + tempoBend);
    o.frequency.setValueAtTime(alvo * mult, quando + duracao * 0.8);
    o.frequency.exponentialRampToValueAtTime(alvo * mult * queda, quando + duracao);
  }

  const vibrato = ctx.createOscillator();
  vibrato.frequency.value = acaso(4.2, 5.4);
  const profundidade = ctx.createGain();
  profundidade.gain.setValueAtTime(0, quando);
  profundidade.gain.setValueAtTime(0, quando + duracao * 0.45);
  profundidade.gain.linearRampToValueAtTime(alvo * 0.011, quando + duracao * 0.85);
  vibrato.connect(profundidade);
  profundidade.connect(osc.frequency);

  const ganhoSegundo = ctx.createGain();
  ganhoSegundo.gain.value = 0.12;
  segundo.connect(ganhoSegundo);

  const tom = ctx.createBiquadFilter();
  tom.type = "lowpass";
  tom.frequency.value = alvo * 3.2;
  tom.Q.value = 0.3;

  const envelope = ctx.createGain();
  envelope.gain.setValueAtTime(0.0001, quando);
  envelope.gain.exponentialRampToValueAtTime(0.085 * forca, quando + acaso(0.35, 0.7));
  envelope.gain.exponentialRampToValueAtTime(0.06 * forca, quando + duracao * 0.5);
  envelope.gain.exponentialRampToValueAtTime(0.075 * forca, quando + duracao * 0.8);
  envelope.gain.exponentialRampToValueAtTime(0.0001, quando + duracao);

  const respiro = sopro(quando, duracao, alvo * 1.5, 0.18, 3);
  const ataque = sopro(quando, 0.5, alvo * 2.4, 0.9, 1.2);
  const ataqueEnvelope = ctx.createGain();
  ataqueEnvelope.gain.setValueAtTime(0.0001, quando);
  ataqueEnvelope.gain.exponentialRampToValueAtTime(0.05 * forca, quando + 0.06);
  ataqueEnvelope.gain.exponentialRampToValueAtTime(0.0001, quando + 0.45);
  ataque.connect(ataqueEnvelope);

  osc.connect(tom);
  ganhoSegundo.connect(tom);
  respiro.connect(tom);
  tom.connect(envelope);
  conectar(envelope, acaso(-0.12, 0.12), 1.1);
  conectar(ataqueEnvelope, 0, 0.8);

  for (const no of [osc, vibrato, segundo]) {
    no.start(quando);
    no.stop(quando + duracao + 0.05);
  }
}

function corda(freq) {
  const chave = Math.round(freq * 10);
  const salvo = cordas.get(chave);
  if (salvo) return salvo;
  const taxa = ctx.sampleRate;
  const total = (taxa * 6) | 0;
  const periodo = Math.max(2, Math.round(taxa / freq));
  const linha = new Float32Array(periodo);
  for (let i = 0; i < periodo; i++) linha[i] = Math.random() * 2 - 1;
  for (let passe = 0; passe < 3; passe++) {
    for (let i = 1; i < periodo; i++) linha[i] = (linha[i] + linha[i - 1]) * 0.5;
  }
  const buffer = ctx.createBuffer(1, total, taxa);
  const saida = buffer.getChannelData(0);
  let indice = 0;
  for (let i = 0; i < total; i++) {
    const proximo = indice + 1 === periodo ? 0 : indice + 1;
    const valor = linha[indice];
    saida[i] = valor;
    linha[indice] = (valor + linha[proximo]) * 0.4992;
    indice = proximo;
  }
  cordas.set(chave, buffer);
  return buffer;
}

function tocarKoto(grau, quando) {
  const fonte = ctx.createBufferSource();
  fonte.buffer = corda(frequencia(grau, TONICA / 2));
  const filtro = ctx.createBiquadFilter();
  filtro.type = "lowpass";
  filtro.frequency.value = 1400;
  const ganho = ctx.createGain();
  ganho.gain.setValueAtTime(0.16, quando);
  ganho.gain.exponentialRampToValueAtTime(0.0005, quando + 5.8);
  fonte.connect(filtro);
  filtro.connect(ganho);
  conectar(ganho, acaso(-0.4, 0.4), 0.7);
  fonte.start(quando);
  fonte.stop(quando + 6);
}

function criarFundo() {
  const drone = ctx.createGain();
  drone.gain.value = 0.022;
  const filtro = ctx.createBiquadFilter();
  filtro.type = "lowpass";
  filtro.frequency.value = 300;
  drone.connect(filtro);
  conectar(filtro, 0, 0.7);
  for (const freq of [TONICA / 4, TONICA / 4 * 1.498, TONICA / 4 * 1.004]) {
    const osc = ctx.createOscillator();
    osc.frequency.value = freq;
    osc.connect(drone);
    osc.start();
  }
  const respiro = ctx.createOscillator();
  respiro.frequency.value = 0.05;
  const respiroGanho = ctx.createGain();
  respiroGanho.gain.value = 0.012;
  respiro.connect(respiroGanho);
  respiroGanho.connect(drone.gain);
  respiro.start();

  const vento = ctx.createBufferSource();
  vento.buffer = ruidoBase;
  vento.loop = true;
  const ventoFiltro = ctx.createBiquadFilter();
  ventoFiltro.type = "bandpass";
  ventoFiltro.frequency.value = 420;
  ventoFiltro.Q.value = 0.6;
  const rajada = ctx.createOscillator();
  rajada.frequency.value = 0.04;
  const rajadaGanho = ctx.createGain();
  rajadaGanho.gain.value = 240;
  rajada.connect(rajadaGanho);
  rajadaGanho.connect(ventoFiltro.frequency);
  const ventoGanho = ctx.createGain();
  ventoGanho.gain.value = 0.012;
  vento.connect(ventoFiltro);
  ventoFiltro.connect(ventoGanho);
  conectar(ventoGanho, 0, 0.3);
  vento.start();
  rajada.start();
}

function agendarFrase(inicio) {
  const frase = escolher(FRASES);
  let tempo = inicio;
  frase.forEach((grau, i) => {
    const ultima = i === frase.length - 1;
    const duracao = ultima ? acaso(4.5, 6.5) : escolher([1.6, 2.2, 2.8, 3.4]);
    tocarShakuhachi(grau, tempo, duracao, ultima ? 0.85 : acaso(0.8, 1));
    tempo += duracao + acaso(0.15, 0.5);
  });
  return tempo;
}

function agendar() {
  const horizonte = ctx.currentTime + 1.5;
  if (proximaFrase < horizonte) proximaFrase = agendarFrase(proximaFrase) + acaso(4, 8);
  if (proximoKoto < horizonte) {
    tocarKoto(escolher([0, 2, 3, 5]), proximoKoto);
    if (Math.random() < 0.4) tocarKoto(escolher([4, 5, 7]), proximoKoto + acaso(0.8, 1.6));
    proximoKoto += acaso(9, 16);
  }
}

function preparar() {
  const Contexto = window.AudioContext || window.webkitAudioContext;
  if (!Contexto) return false;
  ctx = new Contexto();
  ruidoBase = criarRuido(6);
  mestre = ctx.createGain();
  mestre.gain.value = 0;
  const compressor = ctx.createDynamicsCompressor();
  compressor.threshold.value = -20;
  compressor.ratio.value = 3;
  mestre.connect(compressor);
  compressor.connect(ctx.destination);
  const convolver = ctx.createConvolver();
  convolver.buffer = criarImpulso(6, 2.2);
  const atraso = ctx.createDelay(2);
  atraso.delayTime.value = 0.55;
  const retorno = ctx.createGain();
  retorno.gain.value = 0.3;
  const retornoFiltro = ctx.createBiquadFilter();
  retornoFiltro.type = "lowpass";
  retornoFiltro.frequency.value = 2200;
  envioReverb = ctx.createGain();
  envioReverb.gain.value = 0.85;
  envioReverb.connect(convolver);
  envioReverb.connect(atraso);
  atraso.connect(retornoFiltro);
  retornoFiltro.connect(retorno);
  retorno.connect(atraso);
  retorno.connect(convolver);
  convolver.connect(mestre);
  criarFundo();
  proximaFrase = ctx.currentTime + 1.5;
  proximoKoto = ctx.currentTime + 6;
  return true;
}

export function ligar() {
  if (!ctx && !preparar()) return false;
  ctx.resume();
  const agora = ctx.currentTime;
  mestre.gain.cancelScheduledValues(agora);
  mestre.gain.setValueAtTime(mestre.gain.value, agora);
  mestre.gain.linearRampToValueAtTime(VOLUME, agora + 3);
  if (proximaFrase < agora) proximaFrase = agora + 1;
  if (proximoKoto < agora) proximoKoto = agora + 5;
  clearInterval(agendador);
  agendador = setInterval(agendar, 250);
  ligado = true;
  return true;
}

export function desligar() {
  if (!ctx) return;
  const agora = ctx.currentTime;
  mestre.gain.cancelScheduledValues(agora);
  mestre.gain.setValueAtTime(mestre.gain.value, agora);
  mestre.gain.linearRampToValueAtTime(0, agora + 1.2);
  clearInterval(agendador);
  ligado = false;
  setTimeout(() => { if (!ligado) ctx.suspend(); }, 1300);
}

export const estaLigado = () => ligado;

export function tocarCorte() {
  if (!ligado) return;
  const agora = ctx.currentTime;
  const ruido = ctx.createBufferSource();
  ruido.buffer = ruidoBase;
  const banda = ctx.createBiquadFilter();
  banda.type = "bandpass";
  banda.frequency.setValueAtTime(900, agora);
  banda.frequency.exponentialRampToValueAtTime(6000, agora + 0.18);
  banda.Q.value = 1.4;
  const ganhoRuido = ctx.createGain();
  ganhoRuido.gain.setValueAtTime(0.0001, agora);
  ganhoRuido.gain.exponentialRampToValueAtTime(0.3, agora + 0.05);
  ganhoRuido.gain.exponentialRampToValueAtTime(0.0001, agora + 0.3);
  ruido.connect(banda);
  banda.connect(ganhoRuido);
  conectar(ganhoRuido, 0.2, 0.4);
  ruido.start(agora, acaso(0, 4));
  ruido.stop(agora + 0.35);

  for (const [freq, nivel] of [[2637, 0.04], [3951, 0.028], [5274, 0.018]]) {
    const osc = ctx.createOscillator();
    osc.frequency.value = freq * acaso(0.99, 1.01);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, agora + 0.06);
    g.gain.exponentialRampToValueAtTime(nivel, agora + 0.08);
    g.gain.exponentialRampToValueAtTime(0.0001, agora + 1.6);
    osc.connect(g);
    conectar(g, 0.3, 0.7);
    osc.start(agora + 0.06);
    osc.stop(agora + 1.7);
  }
}
