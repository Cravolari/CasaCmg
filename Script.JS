/* ✏️ PERSONALIZE AQUI (ou use no link: ?nome=Maria&de=João) */
const params = new URLSearchParams(location.search);
const NOME = params.get('nome') || 'meu amor';
const DE   = params.get('de')   || '';

document.getElementById('titulo').textContent = NOME + ', tenho uma pergunta...';
document.getElementById('msg1').textContent = 'Você acabou de me fazer a pessoa mais feliz do mundo, ' + NOME + '.';
if (DE) document.getElementById('assina').textContent = 'Para sempre seu, ' + DE;

/* corações de fundo */
const floaty = document.getElementById('floaty');
const emojis = ['💗','💕','🌸','✨','💖','🤍'];
for (let i = 0; i < 18; i++) {
  const s = document.createElement('span');
  s.textContent = emojis[i % emojis.length];
  s.style.left = Math.random() * 100 + 'vw';
  s.style.fontSize = (16 + Math.random() * 26) + 'px';
  s.style.animationDuration = (9 + Math.random() * 10) + 's';
  s.style.animationDelay = (-Math.random() * 14) + 's';
  floaty.appendChild(s);
}

/* botão NÃO fujão */
const nao = document.getElementById('nao');
const sim = document.getElementById('sim');
const dica = document.getElementById('dica');
const frases = [
  'Ei, o botão fugiu! 🙈','Quase! Tenta de novo 😏','Esse botão é tímido…',
  'Não consegue, né? 💕','O "Sim" está tão bonitinho aí…','Tá difícil, hein?',
  'Desiste e aperta o Sim 🥺','Eu espero o tempo que for 💖'
];
let tentativas = 0;

function fugir(e){
  if (e) { e.preventDefault(); e.stopPropagation(); }
  tentativas++;
  nao.classList.add('fugindo');
  const w = nao.offsetWidth, h = nao.offsetHeight, m = 12;
  const maxX = window.innerWidth - w - m, maxY = window.innerHeight - h - m;
  const atual = nao.getBoundingClientRect();
  let x, y, t = 0;
  do {
    x = m + Math.random() * Math.max(maxX - m, 0);
    y = m + Math.random() * Math.max(maxY - m, 0);
    t++;
  } while (t < 20 && Math.hypot(x - atual.left, y - atual.top) < 140);
  nao.style.left = x + 'px';
  nao.style.top  = y + 'px';
  dica.textContent = frases[(tentativas - 1) % frases.length];
  sim.style.setProperty('--s', Math.min(1 + tentativas * 0.07, 1.6));
}
['pointerenter','pointerdown','touchstart','click'].forEach(ev =>
  nao.addEventListener(ev, fugir, { passive:false }));
window.addEventListener('resize', () => {
  if (nao.classList.contains('fugindo')) fugir();
});

/* confete */
const cv = document.getElementById('confete');
const ctx = cv.getContext('2d');
let parts = [], rodando = false;
function ajusta(){ cv.width = innerWidth * devicePixelRatio; cv.height = innerHeight * devicePixelRatio; }
ajusta(); addEventListener('resize', ajusta);
const cores = ['#ff6f9f','#ffb3cd','#ffd966','#c9a7f5','#8fd3ff','#ffffff','#ff9ec0'];

function explode(x, y, n){
  for (let i = 0; i < n; i++){
    const a = Math.random() * Math.PI * 2, v = 6 + Math.random() * 12;
    parts.push({
      x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 8,
      r: 5 + Math.random() * 7, rot: Math.random() * 6, vr: (Math.random() - .5) * .4,
      c: cores[(Math.random() * cores.length) | 0],
      heart: Math.random() < .35, life: 0
    });
  }
  if (!rodando){ rodando = true; requestAnimationFrame(loop); }
}
function coracao(r){
  ctx.beginPath();
  ctx.moveTo(0, r * .35);
  ctx.bezierCurveTo(-r, -r * .5, -r * .6, -r * 1.1, 0, -r * .45);
  ctx.bezierCurveTo(r * .6, -r * 1.1, r, -r * .5, 0, r * .35);
  ctx.closePath(); ctx.fill();
}
function loop(){
  ctx.clearRect(0, 0, cv.width, cv.height);
  const d = devicePixelRatio;
  parts = parts.filter(p => p.y < innerHeight + 40 && p.life < 420);
  for (const p of parts){
    p.vy += .28; p.vx *= .992; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life++;
    ctx.save();
    ctx.translate(p.x * d, p.y * d); ctx.rotate(p.rot); ctx.scale(d, d);
    ctx.fillStyle = p.c;
    if (p.heart) coracao(p.r * 1.4); else ctx.fillRect(-p.r / 2, -p.r / 3, p.r, p.r * .6);
    ctx.restore();
  }
  if (parts.length) requestAnimationFrame(loop); else rodando = false;
}

sim.addEventListener('click', () => {
  document.body.classList.add('yes');
  document.getElementById('card').classList.add('yes');
  const W = innerWidth, H = innerHeight;
  explode(W / 2, H * .45, 160);
  [350, 800, 1300, 1900, 2600, 3400].forEach((t, i) =>
    setTimeout(() => explode(W * (.15 + Math.random() * .7), H * (.25 + Math.random() * .3), 90), t));
});