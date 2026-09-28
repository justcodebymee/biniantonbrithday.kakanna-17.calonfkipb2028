const $ = (id) => document.getElementById(id);
const fill = (s) => s.replaceAll("{name}", CONFIG.recipientName);
const COLORS = ["#F0C75E","#E8945A","#F5DD8F","#FFB347","#FFD700","#F4A460","#DAA520"];
const rnd = (a, b) => a + Math.random() * (b - a);

/* ---- teks dari CONFIG ---- */
$("name").textContent = CONFIG.recipientName;
$("intro-name").textContent = CONFIG.recipientName;
$("from").textContent = "From " + CONFIG.senderName + " 🌸";
$("song-title").textContent = CONFIG.song.title;
$("song-artist").textContent = CONFIG.song.artist;
[["🌟","",""],
 ["✨","Caramu Peduli Itu Luar Biasa","Kepedulianmu terhadap orang di sekitarmu itu tulus dan bikin terharu."],
 ["🎶","Momen Biasa Jadi Istimewa","Bersamamu, hal-hal kecil jadi kenangan yang tak terlupakan."],
 ["💕","","Keberadaanmu bikin hidup lebih berwarna dan penuh makna."],
 ["🌻","Kamu Itu Unik & Istimewa","."]].forEach(([i,t,d],n)=>{
  $("reasons").insertAdjacentHTML("beforeend",
   `<div class="reason-item" style="animation-delay:${.2+n*.2}s"><span class="reason-icon">${i}</span><div class="reason-text"><h3>${t}</h3><p>${d}</p></div></div>`);
});

/* ---- intro: hujan bunga di canvas ---- */
const ic = $("intro-canvas"), ix = ic.getContext("2d");
const fit = () => { ic.width = innerWidth; ic.height = innerHeight; };
fit(); addEventListener("resize", fit);
const parts = Array.from({length: 70}, () => ({
  x: rnd(0, innerWidth), y: rnd(-innerHeight, 0), s: rnd(8, 24), v: rnd(1, 3),
  r: rnd(0, 6.28), rv: rnd(-.03, .03), c: COLORS[Math.floor(rnd(0, COLORS.length))],
  sun: Math.random() < .4, t: rnd(0, 6.28)
}));
let introOn = true;
(function loop() {
  if (!introOn) return;
  ix.clearRect(0, 0, ic.width, ic.height);
  parts.forEach((p) => {
    p.y += p.v; p.t += .02; p.x += Math.sin(p.t) * .8; p.r += p.rv;
    if (p.y > ic.height + 30) { p.y = -30; p.x = rnd(0, ic.width); }
    ix.save(); ix.translate(p.x, p.y); ix.rotate(p.r); ix.fillStyle = p.c; ix.globalAlpha = .7;
    if (p.sun) {
      for (let i = 0; i < 10; i++) { ix.rotate(Math.PI / 5); ix.beginPath(); ix.ellipse(0, -p.s * .7, p.s * .25, p.s * .55, 0, 0, 6.28); ix.fill(); }
      ix.fillStyle = "#5D4037"; ix.beginPath(); ix.arc(0, 0, p.s * .28, 0, 6.28); ix.fill();
    } else {
      ix.beginPath(); ix.moveTo(0, -p.s);
      ix.bezierCurveTo(p.s * .6, -p.s * .6, p.s * .5, p.s * .3, 0, p.s);
      ix.bezierCurveTo(-p.s * .5, p.s * .3, -p.s * .6, -p.s * .6, 0, -p.s); ix.fill();
    }
    ix.restore();
  });
  requestAnimationFrame(loop);
})();

/* ---- kelopak melayang ---- */
for (let i = 0; i < 18; i++) {
  const d = document.createElement("div");
  d.className = "petal"; d.textContent = ["🌻","🌸","🌼"][i % 3];
  d.style.cssText = `left:${rnd(0,100)}%;animation-delay:${rnd(0,12)}s;animation-duration:${rnd(10,18)}s;font-size:${rnd(8,24)}px`;
  document.body.appendChild(d);
}

/* ---- dot navigasi ---- */
const secs = [...document.querySelectorAll("main section")];
secs.forEach((s, i) => {
  const d = document.createElement("div"); d.className = "scroll-dot";
  d.onclick = () => s.scrollIntoView({ behavior: "smooth" }); $("dots").appendChild(d);
});
const io = new IntersectionObserver((es) => es.forEach((e) => {
  if (e.isIntersecting) [...$("dots").children].forEach((d, i) => d.classList.toggle("active", secs[i] === e.target));
}), { threshold: .5 });
secs.forEach((s) => io.observe(s));

/* ---- musik ---- */
const audio = $("audio");
if (CONFIG.song.src) audio.src = CONFIG.song.src;
function setPlay(on) {
  $("vinyl").classList.toggle("playing", on);
  $("play").textContent = $("music-fab").textContent = on ? "❚❚" : "▶";
  if (on) audio.play().catch(() => {}); else audio.pause();
}
$("play").onclick = $("music-fab").onclick = () => setPlay(audio.paused);

/* ---- buka intro ---- */
$("intro-btn").onclick = () => {
  introOn = false; $("intro").classList.add("hidden");
  $("main").classList.add("visible"); $("dots").classList.add("visible");
  if (CONFIG.song.src) { $("music-fab").style.display = "block"; setPlay(true); }
};

/* ---- surat ---- */
$("letter").onclick = () => {
  $("letter").innerHTML = "";
  $("letter").append(fill(CONFIG.letter));
  $("letter").insertAdjacentHTML("beforeend", `<span class="sign">— ${CONFIG.senderName}</span>`);
  $("letter").onclick = null;
};

/* ---- galeri ---- */
let gi = 0;
function gallery() {
  const g = $("gal"); g.innerHTML = "";
  CONFIG.photos.forEach((p, i) => {
    const o = i - gi, c = document.createElement("div");
    c.className = "polaroid";
    c.style.cssText = `transform:translateX(${o*14}px) rotate(${o*6}deg) scale(${o?.92:1});z-index:${10-Math.abs(o)};opacity:${Math.abs(o)>1?0:1}`;
    c.innerHTML = `<div class="ph">${p.img ? `<img src="${p.img}">` : p.emoji}</div><div class="cap">${p.caption || ""}</div>`;
    g.appendChild(c);
  });
  $("count").textContent = `${gi + 1} / ${CONFIG.photos.length}`;
}
const n = CONFIG.photos.length;
$("prev").onclick = () => { gi = (gi - 1 + n) % n; gallery(); };
$("next").onclick = () => { gi = (gi + 1) % n; gallery(); };
gallery();

/* ---- taman: ketuk untuk menanam ---- */
const gc = $("garden"), gx = gc.getContext("2d"), plants = [];
function gfit() { gc.width = gc.clientWidth; gc.height = gc.clientHeight; }
gfit(); addEventListener("resize", gfit);
gc.addEventListener("pointerdown", (e) => {
  const r = gc.getBoundingClientRect();
  plants.push({ x: (e.clientX - r.left) * gc.width / r.width, y: (e.clientY - r.top) * gc.height / r.height, e: ["🌻","🌼","🌸","🌻"][plants.length % 4], t: 0 });
});
(function garden() {
  const g = gx.createLinearGradient(0, 0, 0, gc.height);
  g.addColorStop(0, "#FFF3CD"); g.addColorStop(.7, "#F5DD8F"); g.addColorStop(1, "#A0784C");
  gx.fillStyle = g; gx.fillRect(0, 0, gc.width, gc.height);
  plants.forEach((p) => {
    p.t = Math.min(1, p.t + .04);
    gx.strokeStyle = "#6B8E23"; gx.lineWidth = 3; gx.beginPath();
    gx.moveTo(p.x, gc.height); gx.lineTo(p.x, p.y + 20 * (1 - p.t)); gx.stroke();
    gx.font = `${40 * p.t}px serif`; gx.textAlign = "center"; gx.textBaseline = "middle";
    gx.fillText(p.e, p.x, p.y + 20 * (1 - p.t));
  });
  requestAnimationFrame(garden);
})();

/* ---- kue ---- */
for (let i = 0; i < 5; i++) $("candles").insertAdjacentHTML("beforeend",
  `<div class="candle"><div class="flame" style="animation-delay:${i*.1}s"></div><div class="candle-body"></div></div>`);
let lit = true;
$("cake").onclick = () => {
  if (!lit) return; lit = false;
  document.querySelectorAll(".flame").forEach((f) => f.classList.add("blown"));
  setTimeout(() => {
    $("cake-text").style.display = $("cake-sub").style.display = "none";
    $("wish").style.display = "block"; confetti(4000);
  }, 800);
};

/* ---- konfeti ---- */
const cc = $("confetti"), cx = cc.getContext("2d");
function confetti(ms) {
  cc.width = innerWidth; cc.height = innerHeight;
  const cols = [...COLORS, "#FF6347", "#FF69B4", "#87CEEB", "#98FB98"];
  const bits = Array.from({length: 150}, () => ({ x: rnd(0, cc.width), y: rnd(-cc.height, 0), w: rnd(6, 12), h: rnd(4, 8),
    c: cols[Math.floor(rnd(0, cols.length))], vx: rnd(-1, 1), vy: rnd(2, 5), r: rnd(0, 6.28), rv: rnd(-.1, .1) }));
  const end = Date.now() + ms;
  (function f() {
    cx.clearRect(0, 0, cc.width, cc.height);
    if (Date.now() > end) return;
    bits.forEach((b) => { b.x += b.vx; b.y += b.vy; b.r += b.rv;
      cx.save(); cx.translate(b.x, b.y); cx.rotate(b.r); cx.fillStyle = b.c; cx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h); cx.restore(); });
    requestAnimationFrame(f);
  })();
}
new IntersectionObserver((es) => es[0].isIntersecting && confetti(4000), { threshold: .6 }).observe($("s8"));

$("again").onclick = () => location.reload();
