/* ==========================================================================
   Baukasten: Hilfsfunktionen, Symbole, Effekte
   ========================================================================== */
"use strict";
const $ = id => document.getElementById(id);
function el(tag, cls, text) { const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; }
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function pickOthers(pool, correct, n) { return shuffle(pool.filter(x => x !== correct)).slice(0, n); }
function fmtTime(t) { if (!t) return "–"; try { return new Date(t).toLocaleString("de-DE", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }); } catch (e) { return "–"; } }
function pct(a, b) { return b ? Math.round(a / b * 100) + " %" : "–"; }

/* Gebärdenbild aus der beim Bauen eingebetteten Tabelle SIGNS; fehlt es, ein Platzhalter mit dem Wort.
   Im Inhalt immer als sign('WORT') schreiben: build.py sucht genau dieses Muster. */
function sign(word, cls) {
  const src = (typeof SIGNS !== "undefined") && SIGNS[word];
  return src ? '<img' + (cls ? ' class="' + cls + '"' : '') + ' src="' + src + '" alt="Gebärde ' + word + '">'
             : '<span class="signph' + (cls ? ' ' + cls : '') + '">[Gebärde: ' + word + ']</span>';
}

const ICON = {
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="#1b2636" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
  next: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>',
  star: '<svg viewBox="0 0 24 24"><path d="M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17l-5.9 3.3 1.3-6.5L2.5 9.3l6.6-.8z" fill="#e0a400" stroke="#a87800" stroke-width="1.2" stroke-linejoin="round"/></svg>',
  help: '<svg viewBox="0 0 24 24" fill="none" stroke="#2a5fc4" stroke-width="2.6" stroke-linecap="round"><circle cx="12" cy="12" r="9.5"/><path d="M9.3 9.3a2.8 2.8 0 1 1 3.8 2.6c-.7.3-1.1.9-1.1 1.6v.6"/><circle cx="12" cy="17.4" r=".6" fill="#2a5fc4"/></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="none" stroke="#56657a" stroke-width="2.6" stroke-linecap="round"><rect x="5" y="11" width="14" height="10" rx="2" fill="#dfe7f2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
  unlock: '<svg viewBox="0 0 24 24" fill="none" stroke="#157a44" stroke-width="2.6" stroke-linecap="round"><rect x="5" y="11" width="14" height="10" rx="2" fill="#e3f4ea"/><path d="M8 11V8a4 4 0 0 1 7.6-1.8"/></svg>',
  crown: '<svg viewBox="0 0 64 64"><path d="M8 48 L4 18 L20 30 L32 10 L44 30 L60 18 L56 48 Z" fill="#e0a400" stroke="#a87800" stroke-width="3" stroke-linejoin="round"/><rect x="8" y="48" width="48" height="8" rx="2" fill="#c98f00"/></svg>',
  tap: '<svg viewBox="0 0 40 40" fill="none" stroke="#1b2636" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M16 22V9a3 3 0 0 1 6 0v10l7 2a3 3 0 0 1 2 3.5L29 34H17l-6-7a3 3 0 0 1 4-4z" fill="#fff"/><path d="M12 6l-3-3M27 6l3-3M19 2V0" stroke="#c9245a"/></svg>',
  eye: '<svg viewBox="0 0 40 40" fill="none" stroke="#1b2636" stroke-width="3"><path d="M3 20s6-11 17-11 17 11 17 11-6 11-17 11S3 20 3 20z" fill="#fff"/><circle cx="20" cy="20" r="6" fill="#2a5fc4"/></svg>',
  again: '<svg viewBox="0 0 40 40" fill="none" stroke="#9c2a1f" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M32 20a12 12 0 1 1-4-9"/><path d="M30 4v8h-8"/></svg>',
  ok: '<svg viewBox="0 0 40 40" fill="none" stroke="#157a44" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21l8 8 16-17"/></svg>',
  key: '<svg viewBox="0 0 24 24" fill="none" stroke="#a87800" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="12" r="4.5" fill="#fff4cc"/><path d="M12.5 12H21M18 12v3M21 12v2"/></svg>'
};

/* Bildschirmwechsel: Startseite je nach LearningView-Modus umleiten */
function go(id) {
  if (id === "start" && typeof LV !== "undefined" && LV.mode === "class") id = "lvclass";
  if (id === "start" && typeof LV !== "undefined" && LV.mode === "studentReview") id = "lvreview";
  document.querySelectorAll(".screen").forEach(s => s.classList.toggle("on", s.id === id));
  window.scrollTo(0, 0);
  if (id === "map") renderMap();
  if (id === "start") renderStart();
}

/* kurzer Hinweis unten (keine Browser-Dialoge verwenden) */
function note(t) {
  let n = $("note"); if (!n) { n = el("div", "note"); n.id = "note"; document.body.appendChild(n); }
  n.textContent = t; n.hidden = false; clearTimeout(note.t); note.t = setTimeout(() => n.hidden = true, 3500);
}

/* Konfetti */
const FX = { parts: [], raf: null, cv: null, cx: null };
function fxInit() { FX.cv = $("confetti"); FX.cx = FX.cv.getContext("2d"); const sz = () => { FX.cv.width = innerWidth * devicePixelRatio; FX.cv.height = innerHeight * devicePixelRatio; }; addEventListener("resize", sz); sz(); }
const FX_COLS = ["#2a5fc4", "#d9670a", "#c9245a", "#e0a400", "#157a44"];
function fxSpawn(x, y, n, spread) { for (let i = 0; i < n; i++) FX.parts.push({ x, y, vx: (Math.random() - .5) * spread, vy: -Math.random() * spread * .9 - 2, r: 4 + Math.random() * 5, c: FX_COLS[i % 5], a: Math.random() * 6, life: 90 + Math.random() * 40 }); if (!FX.raf) fxLoop(); }
function fxLoop() {
  const cx = FX.cx, d = devicePixelRatio; cx.clearRect(0, 0, FX.cv.width, FX.cv.height);
  FX.parts.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += .35; p.a += .15; p.life--; cx.save(); cx.translate(p.x * d, p.y * d); cx.rotate(p.a); cx.fillStyle = p.c; cx.fillRect(-p.r * d, -p.r * d / 2, p.r * 2 * d, p.r * d); cx.restore(); });
  FX.parts = FX.parts.filter(p => p.life > 0 && p.y < innerHeight + 40);
  FX.raf = FX.parts.length ? requestAnimationFrame(fxLoop) : null; if (!FX.raf) cx.clearRect(0, 0, FX.cv.width, FX.cv.height);
}
const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
function burst(node) { if (reducedMotion()) return; const r = node.getBoundingClientRect(); fxSpawn(r.left + r.width / 2, r.top + r.height / 2, 24, 12); }
function confetti(n) { if (reducedMotion()) return; for (let i = 0; i < 6; i++) fxSpawn(innerWidth * (i + .5) / 6, innerHeight * .35, n / 6, 18); }
