/* ==========================================================================
   RHYTHMUS-TRAINER – Tiernotation → Trommelraster (Bibi Kl. 3, Rhythmik)
   Lehrplan: rh-34-2 (Trommelschule: Bass/Slap), rh-34-3 (Notationssymbole erkennen und umsetzen)
   Ein Kästchen = eine Zählzeit. Jedes Tier füllt genau ein Kästchen:
     Bär = 1 Schlag, Löwe = 2, Klapperschlange = 4.
   Trommelraster: 8 Spalten (1 + 2 + 3 + 4 +), Zeilen Bass / Slap / Tap; rot = rechts, blau = links.
   Stufe 3: Hand auf dem Fell (Zeile 1, rot) + Stick am Rand (Zeile 2, blau).
   Tier-Symbole: eigene Zeichnungen. Klassen-Fassung: Worksheet-Crafter-Bilder (Erlaubnis Nov. 2026) nur lokal über
   build.py --images; die Fassung zum Weitergeben ohne --images und mit --no-signs bauen.
   ========================================================================== */

/* ---------- Tiere ---------- */
const TIERE = {
  b: { name: "Bär", sign: "BAER", hits: [0], arcs: 1 },
  l: { name: "Löwe", sign: "LOEWE", hits: [0, .5], arcs: 2 },
  s: { name: "Klapperschlange", sign: "KLAPPERSCHLANGE", hits: [0, .25, .5, .75], arcs: 4 }
};
const ANIMAL_SVG = {
  b: '<g stroke="#3b2414" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"><rect x="22" y="58" width="12" height="26" rx="5" fill="#8a5a2b"/><rect x="58" y="58" width="12" height="26" rx="5" fill="#8a5a2b"/><ellipse cx="46" cy="52" rx="34" ry="22" fill="#a86b35"/><circle cx="72" cy="22" r="5" fill="#a86b35"/><circle cx="76" cy="36" r="15" fill="#a86b35"/><ellipse cx="89" cy="41" rx="8" ry="6.5" fill="#dcae7a"/></g><circle cx="79" cy="32" r="2.8" fill="#1b1b1b"/><circle cx="95" cy="39" r="2.6" fill="#1b1b1b"/>',
  l: '<g stroke="#6b3a10" stroke-width="4" stroke-linejoin="round"><circle cx="50" cy="50" r="42" fill="#d9822b"/><circle cx="31" cy="33" r="8" fill="#f2c063"/><circle cx="69" cy="33" r="8" fill="#f2c063"/><circle cx="50" cy="55" r="26" fill="#f2c063"/></g><circle cx="41" cy="50" r="3.4" fill="#1b1b1b"/><circle cx="59" cy="50" r="3.4" fill="#1b1b1b"/><path d="M43 60 L57 60 L50 67 Z" fill="#6b3a10"/><path d="M50 67 Q45 74 39 70 M50 67 Q55 74 61 70" fill="none" stroke="#6b3a10" stroke-width="3" stroke-linecap="round"/>',
  s: '<path d="M24 86 L68 86 C92 86 92 64 66 64 C38 64 34 50 44 40 C52 31 58 27 54 17" fill="none" stroke="#24451f" stroke-width="17" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 86 L68 86 C92 86 92 64 66 64 C38 64 34 50 44 40 C52 31 58 27 54 17" fill="none" stroke="#5fae4c" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><g stroke="#6b5a2a" stroke-width="3"><ellipse cx="17" cy="86" rx="5" ry="7" fill="#ead6a4"/><ellipse cx="9" cy="86" rx="4.5" ry="6" fill="#ead6a4"/></g><ellipse cx="55" cy="14" rx="11" ry="8.5" fill="#5fae4c" stroke="#24451f" stroke-width="4"/><circle cx="59" cy="11" r="2.4" fill="#1b1b1b"/><path d="M66 15 L76 12 M66 15 L76 19" stroke="#d1262c" stroke-width="2.6" stroke-linecap="round"/>'
};
/* Klassen-Fassung: lizenzierte Tierbilder (build.py --images) ersetzen die eigenen Zeichnungen überall (100er-Raster) */
const TIER_IMG = { b: imgSrc("BAER"), l: imgSrc("LOEWE"), s: imgSrc("KLAPPERSCHLANGE") };
const HAS_TIER_IMG = !!(TIER_IMG.b && TIER_IMG.l && TIER_IMG.s);
if (HAS_TIER_IMG) Object.keys(TIER_IMG).forEach(k => { ANIMAL_SVG[k] = '<image href="' + TIER_IMG[k] + '" x="0" y="0" width="100" height="100" preserveAspectRatio="xMidYMid meet"/>'; });
const animal = (k, cls) => '<svg class="tier ' + (cls || "") + '" viewBox="0 0 100 100" aria-label="' + TIERE[k].name + '">' + ANIMAL_SVG[k] + '</svg>';
const PAUKE_SVG = '<ellipse cx="100" cy="92" rx="78" ry="26" fill="#f6efe2" stroke="#1b2636" stroke-width="6"/><path d="M22 92 C26 150 60 176 100 176 C140 176 174 150 178 92" fill="#c9733a" stroke="#1b2636" stroke-width="6"/><path d="M40 160 L28 196 M160 160 L172 196 M100 176 L100 198" stroke="#1b2636" stroke-width="6" stroke-linecap="round"/>';
const HAND_PATH = '<path d="M-7 9 C-12 3 -13 -3 -11 -6 C-9 -8 -7 -6 -6 -3 L-6 -14 C-6 -17 -2 -17 -2 -14 L-2 -6 L-2 -17 C-2 -20 2 -20 2 -17 L2 -6 L2 -15 C2 -18 6 -18 6 -15 L6 -5 L6 -11 C6 -14 10 -14 10 -11 L10 4 C10 10 6 14 0 14 C-3 14 -5 12 -7 9 Z" fill="#fff" stroke="#1b2636" stroke-width="1.6" stroke-linejoin="round"/>';
const STICK_PATH = '<path d="M-14 14 L13 -13" stroke="#8b5a2b" stroke-width="4" stroke-linecap="round"/><circle cx="13" cy="-13" r="3" fill="#8b5a2b"/>';
const RED = "#e5355f", BLUE = "#1a8ccc";
function hitSym(kind) {
  /* kind: R = rechte Hand (rot), L = linke Hand (blau), F = Fell (rot, Hand), K = Rand (blau, Stick) */
  const col = (kind === "R" || kind === "F") ? RED : BLUE, stick = kind === "K";
  return '<svg class="hs" viewBox="-20 -20 40 40"><circle r="17" fill="' + col + '"/>' + (stick ? STICK_PATH : HAND_PATH) + '</svg>';
}
const ICONS = {
  play: '<svg viewBox="0 0 24 24"><path d="M7 4.5v15l12.5-7.5z" fill="#fff"/></svg>',
  stop: '<svg viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2" fill="#fff"/></svg>',
  snd: '<svg viewBox="0 0 24 24" fill="none" stroke="#1b2636" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h4l5-4v14l-5-4H4z" fill="#fff"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11"/></svg>',
  mute: '<svg viewBox="0 0 24 24" fill="none" stroke="#1b2636" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h4l5-4v14l-5-4H4z" fill="#fff"/><path d="M17 9l5 6M22 9l-5 6" stroke="#9c2a1f"/></svg>',
  clap: '<svg viewBox="0 0 100 100" fill="#f6d2b0" stroke="#1b2636" stroke-width="4" stroke-linejoin="round"><path d="M30 86 C18 70 16 50 22 30 C24 24 31 25 31 31 L33 46 L36 16 C37 9 45 10 45 17 L45 44 L50 12 C51 5 59 6 59 13 L57 46 L64 22 C66 16 73 18 72 24 L66 60 C64 76 54 88 42 90 Z"/><path d="M78 30 L90 22 M80 44 L94 42 M76 16 L82 6" stroke="#c9245a" stroke-width="5" stroke-linecap="round" fill="none"/></svg>',
  drum: '<svg viewBox="0 0 200 200">' + PAUKE_SVG + '</svg>'
};

/* ---------- Rhythmus-Daten ----------
   Tier-Muster: ["b","l","b","b"]. Ereignisse: [{t: Zeit in Zählzeiten, s: "F"|"K", h: Index des Symbols}] */
function tierEvents(p) { const ev = []; p.forEach((k, i) => TIERE[k].hits.forEach(x => ev.push({ t: i + x, s: "F" }))); ev.forEach((e, i) => e.h = i); return ev; }
/* Raster: 8 Zellen; "" leer, "x" Schlag (Bass-Zeile), Stufe 3: "F" Fell / "K" Rand */
function tierToCells(p) { const c = Array(8).fill(""); p.forEach((k, i) => { c[2 * i] = "x"; if (k === "l") c[2 * i + 1] = "x"; }); return c; }
function cellEvents(c) { const ev = []; c.forEach((v, i) => { if (v) ev.push({ t: i / 2, s: v === "K" ? "K" : "F" }); }); ev.forEach((e, i) => e.h = i); return ev; }
function countHits(p) { return p.reduce((a, k) => a + TIERE[k].hits.length, 0); }

/* ---------- Darstellung: Tierkarte (grün/blau, Silbenbögen) ---------- */
function arcs(n) { let d = ""; const w = 100 / n; for (let i = 0; i < n; i++) d += '<path d="M' + (i * w + w * .18) + ' 4 Q' + (i * w + w / 2) + ' 22 ' + (i * w + w * .82) + ' 4" fill="none" stroke="#1b2636" stroke-width="3.2" stroke-linecap="round"/>'; return '<svg class="arcs" viewBox="0 0 100 20" preserveAspectRatio="none">' + d + '</svg>'; }
function tierCard(p, o) {
  o = o || {}; let h = 0;
  const boxes = p.map((k, i) => {
    const col = i % 2 ? "kb-b" : "kb-g";
    if (k === "" || k === undefined) return '<div class="kb ' + col + ' empty' + (o.sel === i ? " sel" : "") + '"' + (o.slots ? ' data-slot="' + i + '"' : "") + ' data-bt="' + i + '"><span class="q">?</span></div>';
    const T = TIERE[k], parts = T.hits.map(() => { const hi = h++; const inner = animal(k); return '<span class="part' + (o.taps ? " tp" : "") + '" data-h="' + hi + '"' + (o.taps ? ' data-k="t"' : "") + '>' + inner + (o.taps ? '<span class="mk"></span>' : "") + '</span>'; }).join("");
    return '<div class="kb ' + col + ' n' + T.hits.length + (o.sel === i ? " sel" : "") + '"' + (o.slots ? ' data-slot="' + i + '"' : "") + ' data-bt="' + i + '"><div class="parts">' + parts + '</div>'
      + (o.noWord ? "" : '<div class="word' + (k === "s" ? " long" : "") + '">' + T.name + '</div>' + arcs(T.arcs))
      + (o.counts ? '<div class="cnt">' + T.hits.length + '</div>' : "") + '</div>';
  }).join("");
  return '<div class="tk' + (o.small ? " small" : "") + '">' + boxes + '</div>';
}

/* ---------- Darstellung: Trommelraster ---------- */
function handsFor(c) { let r = true; return c.map(v => { if (v === "x") { const k = r ? "R" : "L"; r = !r; return k; } return v === "F" ? "F" : v === "K" ? "K" : ""; }); }
function gridCard(c, o) {
  o = o || {}; const hs = handsFor(c); let h = 0;
  const head = ["1", "+", "2", "+", "3", "+", "4", "+"].map((x, i) => '<th data-bt="' + Math.floor(i / 2) + '">' + x + '</th>').join("");
  const rows = [0, 1, 2].map(r => '<tr>' + c.map((v, i) => {
    const k = hs[i]; let sym = "";
    if (k && ((r === 0 && k !== "K") || (r === 1 && k === "K"))) sym = '<span class="gh' + (o.taps && (!o.tapOnly || o.tapOnly === k) ? " tp" : "") + '" data-h="' + (h++) + '" data-k="' + k + '">' + hitSym(k) + (o.taps && (!o.tapOnly || o.tapOnly === k) ? '<span class="mk"></span>' : "") + '</span>';
    return '<td class="' + (i % 2 ? "plus" : "beat") + '" data-bt="' + Math.floor(i / 2) + '"' + (o.slots ? ' data-slot="' + i + '"' : "") + '>' + sym + '</td>';
  }).join("") + '</tr>').join("");
  /* data-h muss in Zeitreihenfolge stehen: Spalten zuerst, dann Zeilen → neu nummerieren */
  let html = '<table class="raster' + (o.small ? " small" : "") + '"><thead><tr>' + head + '</tr></thead><tbody>' + rows + '</tbody></table>';
  const order = []; c.forEach((v, i) => { if (v) order.push(i); });
  let n = 0; const map = {};
  [0, 1, 2].forEach(r => c.forEach((v, i) => { const k = hs[i]; if (k && ((r === 0 && k !== "K") || (r === 1 && k === "K"))) map[n++] = order.indexOf(i); }));
  html = html.replace(/data-h="(\d+)"/g, (m, x) => 'data-h="' + map[+x] + '"');
  return html;
}

/* ---------- Abspieler (Bild immer, Ton zuschaltbar) ---------- */
function player(ev, o) {
  o = o || {};
  const boxes = [0, 1, 2, 3].map(i => '<div class="rpb ' + (i % 2 ? "kb-b" : "kb-g") + '" data-bt="' + i + '"><div class="rpt" data-bt="' + i + '"></div></div>').join("");
  return '<div class="rp' + (o.small ? " small" : "") + '" data-ev=\'' + JSON.stringify(ev.map(e => [e.t, e.s, e.h])) + '\' data-beat="' + (o.beat || BEAT) + '"' + (o.traces ? ' data-traces="1"' : "") + (o.auto ? ' data-auto="1"' : "") + '>'
    + '<div class="rp-puls">' + boxes + '</div>'
    + '<div class="rp-drum"><svg viewBox="0 0 200 200">' + PAUKE_SVG + '<ellipse class="fl" cx="100" cy="92" rx="70" ry="21" fill="' + RED + '"/><ellipse class="rd" cx="100" cy="92" rx="78" ry="26" fill="none" stroke="' + BLUE + '" stroke-width="12"/>'
    + '<g class="fh" transform="translate(100 82) scale(1.9)"><circle r="17" fill="' + RED + '"/>' + HAND_PATH + '</g><g class="rh" transform="translate(168 70) scale(1.6)"><circle r="17" fill="' + BLUE + '"/>' + STICK_PATH + '</g></svg></div>'
    + '<div class="rp-ctl"><button class="rp-go" aria-label="Abspielen">' + ICONS.play + '</button><button class="rp-snd" aria-label="Ton">' + (S.mute ? ICONS.mute : ICONS.snd) + '</button></div></div>';
}
const BEAT = 1000, BEAT_SLOW = 1400, LEAD = 700;
const SND = {
  ctx: null,
  get() { try { if (!this.ctx) { const C = window.AudioContext || window.webkitAudioContext; if (!C) return null; this.ctx = new C(); } if (this.ctx.state === "suspended") this.ctx.resume(); } catch (e) { return null; } return this.ctx; },
  hit(kind) {
    if (S.mute) return; const c = this.get(); if (!c) return; const t = c.currentTime;
    if (kind === "K") {
      const len = Math.floor(c.sampleRate * .05), buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
      const src = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
      src.buffer = buf; f.type = "highpass"; f.frequency.value = 1800; g.gain.value = .9;
      src.connect(f); f.connect(g); g.connect(c.destination); src.start(t);
    } else {
      const o = c.createOscillator(), g = c.createGain();
      o.type = "sine"; o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(55, t + .25);
      g.gain.setValueAtTime(.001, t); g.gain.exponentialRampToValueAtTime(.9, t + .01); g.gain.exponentialRampToValueAtTime(.001, t + .45);
      o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + .5);
    }
  }
};
/* spielt Ereignisse in einem Element ab: [data-bt] leuchtet je Zählzeit, [data-h] blitzt je Schlag, .rp-drum zeigt Fell/Rand */
function rpStop(root) { (root._tm || []).forEach(clearTimeout); root._tm = []; root.classList.remove("playing"); root.querySelectorAll(".now,.hit").forEach(e => e.classList.remove("now", "hit")); const d = root.querySelector(".rp-drum"); if (d) d.classList.remove("hitF", "hitK"); }
function rpPlay(root, opt) {
  opt = opt || {}; rpStop(root);
  const ev = JSON.parse(root.dataset.ev || "[]"), beat = +(opt.beat || root.dataset.beat || BEAT), traces = opt.traces !== undefined ? opt.traces : root.dataset.traces === "1";
  const loops = opt.loops || 1, lead = opt.lead !== undefined ? opt.lead : LEAD, nb = opt.beats || 4, light = opt.light !== false, flash = opt.flash !== false;
  const at = (ms, fn) => root._tm.push(setTimeout(() => { if (root.isConnected) fn(); }, ms));
  root.querySelectorAll(".rpt").forEach(t => t.innerHTML = "");
  root.classList.add("playing");
  if (opt.countIn) { const ci = root.querySelector(".countin"); for (let k = 0; k < nb; k++) at(lead + k * beat, () => { if (ci) { ci.textContent = String(k + 1); ci.classList.add("on"); } }); at(lead + nb * beat, () => { if (ci) ci.classList.remove("on"); }); }
  const start = lead + (opt.countIn ? nb * beat : 0);
  for (let L = 0; L < loops; L++) {
    const off = start + L * nb * beat;
    if (light) for (let k = 0; k < nb; k++) at(off + k * beat, () => { root.querySelectorAll(".now").forEach(e => e.classList.remove("now")); root.querySelectorAll('[data-bt="' + k + '"]').forEach(e => e.classList.add("now")); });
    ev.forEach(([t, s, h]) => at(off + t * beat, () => {
      if (!opt.silent) SND.hit(s);
      if (flash) root.querySelectorAll('[data-h="' + h + '"]').forEach(e => { e.classList.add("hit"); setTimeout(() => e.classList.remove("hit"), 220); });
      const d = root.querySelector(".rp-drum"); if (d) { d.classList.add(s === "K" ? "hitK" : "hitF"); setTimeout(() => d.classList.remove("hitF", "hitK"), 200); }
      if (traces && L === 0) { const b = Math.floor(t + 1e-6), tr = root.querySelector('.rpt[data-bt="' + b + '"]'); if (tr) { const x = (t - b) * 100; tr.insertAdjacentHTML("beforeend", '<i class="' + (s === "K" ? "k" : "f") + '" style="left:calc(' + (x + 6) + '% )"></i>'); } }
    }));
  }
  at(start + loops * nb * beat + 150, () => { root.querySelectorAll(".now").forEach(e => e.classList.remove("now")); root.classList.remove("playing"); if (opt.done) opt.done(); });
}
function rpDuration(beat, lead) { return (lead === undefined ? LEAD : lead) + 4 * beat + 300; }
/* Knöpfe in allen Abspielern (auch auf der Tafel) */
document.addEventListener("click", e => {
  const go = e.target.closest(".rp-go"); if (go) { const r = go.closest(".rp"); if (r) { SND.get(); rpPlay(r); } return; }
  const sn = e.target.closest(".rp-snd"); if (sn) { S.mute = !S.mute; save(); document.querySelectorAll(".rp-snd").forEach(b => b.innerHTML = S.mute ? ICONS.mute : ICONS.snd); if (!S.mute) SND.get(); }
});
/* iPad/Safari gibt Ton erst nach einer Berührung frei: bei jedem Antippen den Ton-Kontext wecken */
document.addEventListener("pointerdown", () => { if (!S.mute) SND.get(); }, true);
/* Abspieler mit data-auto starten von selbst, sobald sie erscheinen */
new MutationObserver(() => {
  document.querySelectorAll('.rp[data-auto="1"]:not([data-started])').forEach(r => { r.dataset.started = "1"; setTimeout(() => { if (r.isConnected) rpPlay(r); }, 250); });
}).observe(document.body, { childList: true, subtree: true });

/* ---------- Zufall ---------- */
const pick = a => a[Math.floor(Math.random() * a.length)];
const same = (a, b) => a.join() === b.join();
function rndPat(an, must) { let p, guard = 0; do { p = [0, 1, 2, 3].map(() => pick(an)); guard++; } while (guard < 50 && ((must && !p.includes(must)) || p.every(x => x === p[0]))); return p; }
function mutate(p, an) { const q = p.slice(), i = Math.floor(Math.random() * 4); q[i] = pick(an.filter(x => x !== p[i])); return q; }
function distractors(p, n, an, gen) { const out = []; let guard = 0; while (out.length < n && guard++ < 200) { const q = (out.length === 0 && Math.random() < .7) ? mutate(p, an) : gen(); if (!same(q, p) && !out.some(x => same(x, q))) out.push(q); } return out; }
function uniqueSeq(n, gen) { const out = []; let g = 0; while (out.length < n && g++ < 300) { const q = gen(); if (!out.some(x => same(x, q))) out.push(q); } while (out.length < n) out.push(gen()); return out; }
function nums(correct, lo, hi) { const c = [correct]; const cand = shuffle([correct - 2, correct - 1, correct + 1, correct + 2].filter(x => x >= lo && x <= hi)); while (c.length < 3 && cand.length) c.push(cand.shift()); return shuffle(c).map(x => ({ v: String(x), html: '<span class="num">' + x + '</span>' })); }
/* Stufe 3: Bausteine je Zählzeit (2 Zellen): Fell, Rand, Fell-Fell, Fell-Rand */
const S3_BLOCKS = [["F", ""], ["K", ""], ["F", "F"], ["F", "K"]];
function rndCells3() { let c, g = 0; do { c = [].concat(...[0, 1, 2, 3].map(() => pick(S3_BLOCKS))); g++; } while (g < 50 && (!c.includes("K") || !c.includes("F"))); return c; }
function mutateCells3(c) { const q = c.slice(), i = Math.floor(Math.random() * 4); const cur = q.slice(2 * i, 2 * i + 2).join(); const nb = pick(S3_BLOCKS.filter(b => b.join() !== cur)); q[2 * i] = nb[0]; q[2 * i + 1] = nb[1]; return q; }
const AN = { start: ["b", "l"], s1: ["b", "l", "s"], s2: ["b", "l"] };

/* ---------- Aufgabenbausteine ---------- */
const P = (icon, signHTML, text) => '<span class="pico">' + icon + '</span>' + signHTML + '<span class="ptext">' + text + '</span>';
const EYE_DRUM = '<svg viewBox="0 0 200 200"><g transform="translate(20 50) scale(.8)">' + PAUKE_SVG + '</g><path d="M95 42s25-30 52-30 52 30 52 30-25 30-52 30-52-30-52-30z" fill="#fff" stroke="#1b2636" stroke-width="7"/><circle cx="147" cy="42" r="13" fill="#2a5fc4"/></svg>';
const TAP_ICON = '<svg viewBox="0 0 40 40" fill="none" stroke="#1b2636" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M16 22V9a3 3 0 0 1 6 0v10l7 2a3 3 0 0 1 2 3.5L29 34H17l-6-7a3 3 0 0 1 4-4z" fill="#fff"/><path d="M12 6l-3-3M27 6l3-3M19 2V0" stroke="#c9245a"/></svg>';
const BUILD_ICON = '<svg viewBox="0 0 200 200"><rect x="10" y="60" width="44" height="70" rx="6" fill="#86ef7d" stroke="#1b2636" stroke-width="6"/><rect x="56" y="60" width="44" height="70" rx="6" fill="#4c86e3" stroke="#1b2636" stroke-width="6"/><rect x="102" y="60" width="44" height="70" rx="6" fill="#fff" stroke="#1b2636" stroke-width="6" stroke-dasharray="10 8"/><rect x="148" y="60" width="44" height="70" rx="6" fill="#fff" stroke="#1b2636" stroke-width="6" stroke-dasharray="10 8"/><path d="M124 180 L124 140 M110 154 L124 140 L138 154" stroke="#c9245a" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const SLOW_HINT = (ev, extra) => ctx => { ctx.setShow((extra || "") + player(ev, { auto: true, beat: BEAT_SLOW, traces: true })); ctx.waitHint(ICON.eye, "", rpDuration(BEAT_SLOW)); };

function tFindenTier(an, must) {
  const p = rndPat(an, must), ds = distractors(p, 2, an, () => rndPat(an, must)), all = shuffle([p].concat(ds)), ev = tierEvents(p);
  return { prompt: P(EYE_DRUM, sign("ANSCHAUEN"), "Welche Karte?"), show: player(ev, { auto: true }), layout: "rows",
    answers: all.map(q => ({ v: q.join(""), html: tierCard(q, { small: true }) })), answer: p.join(""), hint: SLOW_HINT(ev), sol: { text: "" } };
}
function tBauenTier(an, must) {
  const p = rndPat(an, must), ev = tierEvents(p);
  return { prompt: P(BUILD_ICON, sign("BAUEN"), "Bau nach!"), show: player(ev, { auto: true }), layout: "side",
    build: { n: 4, answer: p, palette: an.map(k => ({ v: k, html: animal(k, "pal") + '<span class="pname">' + TIERE[k].name + '</span>' })), view: (arr, o) => playable(tierCard(arr, { slots: !o.solution, sel: o.sel }), arr.every(x => x) ? tierEvents(arr) : []) },
    hint: SLOW_HINT(ev), sol: { text: "" }, goodText: PLAY_ALONG };
}
function tUebersetzen() {
  const an = AN.s2, p = rndPat(an), ds = distractors(p, 2, an, () => rndPat(an));
  const toGrid = Math.random() < .5, ev = tierEvents(p);
  const hint = ctx => { const sh = toGrid ? tierCard(p) : gridCard(tierToCells(p)); ctx.setShow('<div class="rp lauf" data-ev=\'' + JSON.stringify(ev.map(e => [e.t, e.s, e.h])) + '\' data-beat="' + BEAT_SLOW + '" data-auto="1">' + sh + '</div>'); ctx.waitHint(ICON.eye, "", rpDuration(BEAT_SLOW)); };
  if (toGrid) return { prompt: P('<svg viewBox="0 0 100 100">' + ANIMAL_SVG.b + '</svg>', sign("VERGLEICHEN"), "Welches Raster?"), show: tierCard(p), layout: "rows",
    answers: shuffle([p].concat(ds)).map(q => ({ v: q.join(""), html: gridCard(tierToCells(q), { small: true }) })), answer: p.join(""), hint, sol: { text: "" } };
  return { prompt: P('<svg viewBox="-20 -20 40 40"><circle r="17" fill="' + RED + '"/>' + HAND_PATH + '</svg>', sign("VERGLEICHEN"), "Welche Tiere?"), show: gridCard(tierToCells(p)), layout: "rows",
    answers: shuffle([p].concat(ds)).map(q => ({ v: q.join(""), html: tierCard(q, { small: true }) })), answer: p.join(""), hint, sol: { text: "" } };
}
function tFindenRaster(three) {
  let c, ds;
  if (three) { c = rndCells3(); ds = []; let g = 0; while (ds.length < 2 && g++ < 200) { const q = (ds.length === 0 && Math.random() < .7) ? mutateCells3(c) : rndCells3(); if (!same(q, c) && !ds.some(x => same(x, q))) ds.push(q); } }
  else { const p = rndPat(AN.s2); c = tierToCells(p); ds = distractors(p, 2, AN.s2, () => rndPat(AN.s2)).map(tierToCells); }
  const ev = cellEvents(c);
  return { prompt: P(EYE_DRUM, sign("ANSCHAUEN"), "Welches Raster?"), show: player(ev, { auto: true }), layout: "rows",
    answers: shuffle([c].concat(ds)).map(q => ({ v: q.join("-"), html: gridCard(q, { small: true }) })), answer: c.join("-"), hint: SLOW_HINT(ev), sol: { text: "" } };
}
function tBauenRaster(three) {
  const c = three ? rndCells3() : tierToCells(rndPat(AN.s2)), ev = cellEvents(c);
  return { prompt: P(BUILD_ICON, sign("BAUEN"), "Bau nach!"), show: player(ev, { auto: true }), layout: "side",
    build: { n: 8, answer: c, cycle: three ? ["", "F", "K"] : ["", "x"], view: (arr, o) => playable(gridCard(arr, { slots: !o.solution }), cellEvents(arr)) },
    hint: SLOW_HINT(ev), sol: { text: "" }, goodText: PLAY_ALONG };
}
/* Karte, die sich abspielen lässt (Lauflicht + Einzählen) */
const evAttr = ev => JSON.stringify(ev.map(e => [e.t, e.s, e.h]));
function playable(card, ev, beat) { return '<div class="rp lauf"' + (beat ? ' data-beat="' + beat + '"' : "") + ' data-ev=\'' + evAttr(ev) + '\'><div class="countin"></div>' + card + '</div>'; }
const CLAP_DRUM = '<span class="tmic">' + ICONS.drum + ICONS.clap + '</span>';
const PLAY_ALONG = '<span class="along">' + CLAP_DRUM + '<button class="bigplay small playbuilt" aria-label="Mitspielen">' + ICONS.play + '</button></span>';
document.addEventListener("click", e => {
  const b = e.target.closest(".playbuilt"); if (!b) return;
  const r = document.querySelector("#bview .rp"); if (r) { SND.get(); rpPlay(r, { countIn: true, loops: 2 }); }
});

/* ---------- Mitspielen: im Puls-Licht auf der Trommel tippen; die App prüft die Schläge ----------
   Toleranz je Schlag: 45 % des Abstands zum Nachbarschlag, mindestens 90 ms, höchstens 230 ms.
   Richtig: alle Schläge getroffen und höchstens 1 Extra-Schlag. Nach der Hilfe: langsamer und mit Schlag-Blitz. */
const SP = { helped: false, running: false, taps: [], t0: 0, beat: 0, cues: [] };
const SPIEL_ICON = '<svg viewBox="0 0 200 200"><g transform="translate(10 40) scale(.8)">' + PAUKE_SVG + '</g><g transform="translate(120 70) scale(2.6)"><circle r="17" fill="' + RED + '"/>' + HAND_PATH + '</g></svg>';
function spNotation(t, auto, beat) { const r = playable(t.sp.card, t.sp.ev, beat || t.sp.beat); return auto ? r.replace('<div class="rp lauf"', '<div class="rp lauf spnot" id="spRp" data-auto="1"') : r.replace('<div class="rp lauf"', '<div class="rp lauf spnot" id="spRp"'); }
function spPads(two) {
  if (two) return '<div class="pads two"><button class="pad" data-pad="F" aria-label="Fell"><svg viewBox="-20 -20 40 40"><circle r="19" fill="' + RED + '"/>' + HAND_PATH + '</svg><span class="pname">Fell</span></button>'
    + '<button class="pad" data-pad="K" aria-label="Rand"><svg viewBox="-20 -20 40 40"><circle r="19" fill="' + BLUE + '"/>' + STICK_PATH + '</svg><span class="pname">Rand</span></button></div>';
  return '<div class="pads"><button class="pad big" data-pad="F" aria-label="Trommel"><svg viewBox="0 0 200 200">' + PAUKE_SVG + '</svg></button></div>';
}
function spCue(t, beat, offset) {
  /* Trommel-Fläche leuchtet zu jedem Schlag auf (Hilfe: „hier und jetzt tippen“) */
  t.sp.ev.forEach(e => SP.cues.push(setTimeout(() => { const pad = document.querySelector('.pad[data-pad="' + (t.sp.two ? e.s : "F") + '"]'); if (pad) { pad.classList.add("cue"); setTimeout(() => pad.classList.remove("cue"), 260); } }, offset + e.t * beat)));
}
function spRender(ctx) {
  const t = ctx.task; SP.helped = false; SP.running = false; (SP.cues || []).forEach(clearTimeout); SP.cues = [];
  ctx.answers.innerHTML = spPads(t.sp.two) + '<div class="sprow"><button class="bigplay" id="spGo" aria-label="Los">' + ICONS.play + '</button>' + CLAP_DRUM + '</div>';
  ctx.answers.querySelectorAll(".pad").forEach(p => p.addEventListener("pointerdown", ev => {
    ev.preventDefault(); const k = p.dataset.pad; SND.hit(k);
    p.classList.add("hit"); setTimeout(() => p.classList.remove("hit"), 140);
    if (SP.running) SP.taps.push({ t: performance.now() - SP.t0, p: k });
  }));
  if (t.sp.demo) {
    /* Schau zu: die App spielt einmal vor (mit Schlag-Blitz und Trommel-Hinweis), erst dann geht es los */
    const root = $("spRp"), beat = t.sp.beat;
    ctx.waitHint(ICON.eye, "", rpDuration(beat) + 200);
    setTimeout(() => { if (root && root.isConnected) { rpPlay(root, { beat, flash: true }); spCue(t, beat, LEAD); } }, 250);
  }
  $("spGo").onclick = () => {
    if (ctx.busy() || SP.running) return;
    const root = $("spRp"); if (!root) return;
    root.querySelectorAll(".ok,.miss").forEach(e => e.classList.remove("ok", "miss"));
    const beat = Math.round(t.sp.beat * (SP.helped ? 1.25 : 1)); SP.beat = beat; SP.taps = []; SP.running = true;
    const flash = SP.helped || !!t.sp.flash, light = SP.helped || t.sp.light !== false;
    ctx.answers.classList.add("running");
    SP.t0 = performance.now() + LEAD + 4 * beat;
    if (flash) spCue(t, beat, LEAD + 4 * beat);
    rpPlay(root, { beat, countIn: true, silent: true, flash, light, done: () => setTimeout(() => spCheck(ctx, root), 300) });
  };
}
function spCheck(ctx, root) {
  const t = ctx.task, beat = SP.beat, ev = t.sp.ev, used = new Set();
  SP.running = false; ctx.answers.classList.remove("running");
  if (!root.isConnected) return;
  let hitAll = true;
  ev.forEach((e, i) => {
    const at = e.t * beat, gp = i ? at - ev[i - 1].t * beat : beat, gn = i < ev.length - 1 ? ev[i + 1].t * beat - at : beat;
    const tol = Math.max(90, Math.min(230, .45 * Math.min(gp, gn)));
    let best = -1, bd = 1e9;
    SP.taps.forEach((x, j) => { if (used.has(j) || (t.sp.two && x.p !== e.s)) return; const d = Math.abs(x.t - at); if (d <= tol && d < bd) { bd = d; best = j; } });
    const ok = best >= 0; if (ok) used.add(best); else hitAll = false;
    root.querySelectorAll('[data-h="' + e.h + '"]').forEach(n => n.classList.add(ok ? "ok" : "miss"));
  });
  const extra = SP.taps.filter((x, j) => !used.has(j) && x.t > -250).length;
  const pads = ctx.answers.querySelector(".pads");
  if (hitAll && extra <= 1) ctx.good(pads); else ctx.bad(pads);
}
const spHint = c => { const t = c.task; SP.helped = true; c.setShow(spNotation(t, true, BEAT_SLOW)); c.waitHint(ICON.eye, "", rpDuration(BEAT_SLOW)); };
/* opt: { pat: Tiermuster, demo: erst vorspielen, flash: Schlag-Blitz + Trommel-Hinweis, light: Puls-Licht (Standard an) } */
function tSpielen(kind, opt) {
  opt = opt || {}; let card, ev, beat, two = false;
  if (opt.pat) { card = tierCard(opt.pat); ev = tierEvents(opt.pat); beat = kind === "ge" ? 1150 : 1050; }
  else if (kind === "start" || kind === "s1") { const p = rndPat(AN[kind], kind === "s1" ? "s" : null); card = tierCard(p); ev = tierEvents(p); beat = 1050; }
  else if (kind === "s2") { const c = tierToCells(rndPat(AN.s2)); card = gridCard(c); ev = cellEvents(c); beat = 1000; }
  else if (kind === "s3") { const c = rndCells3(); card = gridCard(c); ev = cellEvents(c); beat = 1050; two = true; }
  const t = { prompt: P(SPIEL_ICON, sign("TROMMELN"), "Spiel mit!"), layout: "spielen", sol: { text: "" }, hint: spHint, sp: { card, ev, beat, two, demo: !!opt.demo, flash: !!opt.flash, light: opt.light !== false },
    custom: { render: spRender, solution: c => c.setShow(spNotation(c.task, true, BEAT_SLOW)) } };
  t.show = spNotation(t, false); return t;
}
const BBBB = ["b", "b", "b", "b"];
/* Puls: vorspielen + Blitz → nur Blitz → nur Puls-Licht → ohne Licht (Hilfen zurücknehmen) */
const PULS_STEPS = [{ demo: true, flash: true }, { flash: true }, {}, {}, { light: false }];
function oneLion() { const p = BBBB.slice(); p[1 + Math.floor(Math.random() * 3)] = "l"; return p; }
function upToTwoLions() { const p = oneLion(); if (Math.random() < .6) { const free = [0, 1, 2, 3].filter(i => p[i] === "b"); p[pick(free)] = "l"; } return p; }
function startSpielen(i) { return i < 2 ? tSpielen("start", { pat: oneLion(), demo: i === 0 }) : i < 4 ? tSpielen("start", { pat: upToTwoLions() }) : tSpielen("start"); }

/* GE-Schiene: Bär oder Klapperschlange, immer zwei Antworten */
function tGeFinden(k) {
  const p = [k, k, k, k], other = k === "b" ? "s" : "b", ev = tierEvents(p);
  return { prompt: P(EYE_DRUM, sign("ANSCHAUEN"), ""), show: player(ev, { auto: true }), layout: "two",
    answers: shuffle([k, other]).map(x => ({ v: x, html: animal(x, "big") + '<span class="pname">' + TIERE[x].name + '</span>' })), answer: k, hint: SLOW_HINT(ev), sol: { text: "" } };
}
function tGeWer(k) {
  return { prompt: P('<svg viewBox="0 0 100 100">' + ANIMAL_SVG[k] + '</svg>', sign("WER"), ""), show: '<div class="gepic">' + animal(k, "huge") + '</div>', layout: "two",
    answers: shuffle(["b", "s"]).map(x => ({ v: x, html: sign(x === "b" ? "BAER" : "KLAPPERSCHLANGE") + '<span class="pname">' + TIERE[x].name + '</span>' })), answer: k,
    hint: { wait: { show: '<div class="gepic">' + animal(k, "huge") + '<div class="pname">' + TIERE[k].name + '</div></div>', ms: 2500 } }, sol: { text: "" } };
}
const N = 5;
const many = (fn) => { const out = []; for (let i = 0; i < N; i++) out.push(fn(i)); return out; };

/* ---------- Mission-Symbole (200er-Raster) ---------- */
const MI = {
  puls: () => [0, 1, 2, 3].map(i => '<rect x="' + (12 + i * 46) + '" y="120" width="40" height="40" rx="6" fill="' + (i % 2 ? "#5b93e8" : "#86ef7d") + '" stroke="#1b2636" stroke-width="5"/><g transform="translate(' + (14 + i * 46) + ' 124) scale(.36)">' + ANIMAL_SVG.b + '</g>').join("") + '<g transform="translate(55 0) scale(.45)">' + PAUKE_SVG + '</g>',
  spielen: () => '<g transform="translate(10 40) scale(.8)">' + PAUKE_SVG + '</g><g transform="translate(120 70) scale(2.6)"><circle r="17" fill="' + RED + '"/>' + HAND_PATH + '</g>',
  finden: () => EYE_DRUM.slice(EYE_DRUM.indexOf(">") + 1).replace("</svg>", ""),
  bauen: () => BUILD_ICON.slice(BUILD_ICON.indexOf(">") + 1).replace("</svg>", ""),
  uebersetzen: () => '<g transform="translate(0 40) scale(.8)">' + ANIMAL_SVG.b + '</g><path d="M86 80 L116 80 M104 66 L118 80 L104 94" stroke="#c9245a" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/><g transform="translate(124 40)"><rect width="70" height="80" fill="#fff" stroke="#1b2636" stroke-width="5"/><path d="M35 0V80M0 27H70M0 54H70" stroke="#1b2636" stroke-width="3"/><g transform="translate(17 13) scale(.6)"><circle r="17" fill="' + RED + '"/>' + HAND_PATH + '</g></g>',
  wer: () => '<g transform="translate(20 20) scale(1.6)">' + ANIMAL_SVG.s + '</g>'
};

/* ---------- Freischalt-Codes (an der Tafel zeigen) ---------- */
const KEYS = [
  { id: "baer", html: '<svg viewBox="0 0 100 100">' + ANIMAL_SVG.b + '</svg>' },
  { id: "loewe", html: '<svg viewBox="0 0 100 100">' + ANIMAL_SVG.l + '</svg>' },
  { id: "schlange", html: '<svg viewBox="0 0 100 100">' + ANIMAL_SVG.s + '</svg>' },
  { id: "pauke", html: '<svg viewBox="0 0 200 200">' + PAUKE_SVG + '</svg>' }
];

/* ---------- Extra 1: Frei bauen (ohne Sterne) ---------- */
function renderFreiBauen(el) {
  const an = (unlocked("s1") || S.unlockAll) ? ["b", "l", "s"] : ["b", "l"];
  let arr = ["", "", "", ""], sel = null;
  const draw = (done) => {
    const ev = tierEvents(arr.filter(x => x).length === 4 ? arr : arr.map(x => x || "b"));
    el.innerHTML = '<div class="frei">'
      + '<div class="rp lauf" id="freiRp" data-ev=\'' + JSON.stringify(ev.map(e => [e.t, e.s, e.h])) + '\' data-beat="' + BEAT + '">' + tierCard(arr, { slots: true, sel }) + '</div>'
      + '<div class="brow"><div class="bpal">' + an.map(k => '<button class="ans bp" data-v="' + k + '">' + animal(k, "pal") + '<span class="pname">' + TIERE[k].name + '</span></button>').join("") + '</div>'
      + '<button class="bigplay' + (arr.every(x => x) ? "" : " off") + '" id="freiPlay" aria-label="Abspielen">' + ICONS.play + '</button></div>'
      + '<div class="freictl"><button class="smallbtn big" id="freiNeu">Neu</button><button class="rp-snd smallbtn big" aria-label="Ton">' + (S.mute ? ICONS.mute : ICONS.snd) + '</button></div>'
      + (done ? '<div class="jetztdu card"><span class="jd-ic">' + ICONS.drum + '</span><span class="jd-ic">' + ICONS.clap + '</span><span class="jd-t">Jetzt du!</span></div>' : "")
      + '</div>';
    el.querySelectorAll("[data-slot]").forEach(s => s.onclick = () => { const i = +s.dataset.slot; arr[i] = ""; sel = i; draw(); });
    el.querySelectorAll(".bp").forEach(b => b.onclick = () => { const i = (sel !== null && arr[sel] === "") ? sel : arr.indexOf(""); if (i < 0) return; arr[i] = b.dataset.v; sel = null; draw(); });
    $("freiNeu").onclick = () => { arr = ["", "", "", ""]; sel = null; draw(); };
    $("freiPlay").onclick = () => { if (!arr.every(x => x)) return; SND.get(); rpPlay($("freiRp"), { loops: 2, done: () => { if ($("freiRp")) draw(true); } }); };
  };
  draw();
}

/* ---------- Extra 2: Trommeln (Mitspielen / Trommel-Tafel mit Hilfestufen) ---------- */
const TR = { kind: "tier", help: 1, beat: BEAT, pat: null };
function trNew() {
  if (TR.kind === "tier") TR.pat = rndPat((unlocked("s1") || S.unlockAll) ? AN.s1 : AN.start);
  else if (TR.kind === "raster") TR.pat = tierToCells(rndPat(AN.s2));
  else TR.pat = rndCells3();
}
function renderTrommeln(el) {
  if (!TR.pat) trNew();
  const seg = (id, opts, cur) => '<div class="seg" id="' + id + '">' + opts.map(([v, l]) => '<button data-v="' + v + '" class="' + (String(cur) === String(v) ? "on" : "") + '">' + l + '</button>').join("") + '</div>';
  const notation = TR.kind === "tier" ? tierCard(TR.pat) : gridCard(TR.pat);
  const ev = TR.kind === "tier" ? tierEvents(TR.pat) : cellEvents(TR.pat);
  el.innerHTML = '<div class="trom">'
    + '<div class="trset">' + seg("trKind", [["tier", "Tiere"], ["raster", "Raster"], ["zwei", "Fell + Rand"]], TR.kind)
    + seg("trHelp", [[1, "Hilfe 1"], [2, "Hilfe 2"], [3, "Hilfe 3"], [4, "Hilfe 4"]], TR.help)
    + seg("trBeat", [[1500, "langsam"], [1000, "mittel"], [750, "schneller"]], TR.beat) + '</div>'
    + '<div class="trhelp">' + ["", "Licht + Schlag", "nur Puls-Licht", "nur Noten", "Noten verschwinden"][TR.help] + '</div>'
    + '<div class="rp lauf trbig' + (TR.help >= 3 ? " nolight" : "") + '" id="trRp" data-ev=\'' + JSON.stringify(ev.map(e => [e.t, e.s, e.h])) + '\'><div class="countin"></div><div class="trnot" id="trNot">' + notation + '</div></div>'
    + '<div class="trctl"><button class="bigplay" id="trPlay" aria-label="Start">' + ICONS.play + '</button><button class="bigplay stop" id="trStop" aria-label="Stopp">' + ICONS.stop + '</button>'
    + '<button class="smallbtn big" id="trNew">Neuer Rhythmus</button><button class="rp-snd smallbtn big" aria-label="Ton">' + (S.mute ? ICONS.mute : ICONS.snd) + '</button></div></div>';
  const wire = (id, key, num) => el.querySelectorAll("#" + id + " button").forEach(b => b.onclick = () => { TR[key] = num ? +b.dataset.v : b.dataset.v; if (key === "kind") trNew(); renderTrommeln(el); });
  wire("trKind", "kind"); wire("trHelp", "help", true); wire("trBeat", "beat", true);
  $("trNew").onclick = () => { trNew(); renderTrommeln(el); };
  $("trStop").onclick = () => { rpStop($("trRp")); $("trNot").classList.remove("gone"); };
  $("trPlay").onclick = () => {
    SND.get(); const r = $("trRp"), nt = $("trNot"); nt.classList.remove("gone");
    rpPlay(r, { beat: TR.beat, loops: 4, countIn: true, light: TR.help <= 2, flash: TR.help === 1, done: () => { if ($("trNot")) $("trNot").classList.remove("gone"); } });
    if (TR.help === 4) r._tm.push(setTimeout(() => { if (nt.isConnected) nt.classList.add("gone"); }, LEAD + 4 * TR.beat));
  };
}

/* ---------- Tafel: Klasse gegen Lehrkraft ---------- */
function boardFinden(raster) {
  return () => many(() => {
    const an = raster ? AN.s2 : AN.s1, p = rndPat(an), ds = distractors(p, 2, an, () => rndPat(an));
    const conv = q => raster ? tierToCells(q) : q, all = shuffle([p].concat(ds)), letters = ["A", "B", "C"], ev = raster ? cellEvents(tierToCells(p)) : tierEvents(p);
    return { html: '<div class="bfind">' + player(ev, { small: true }) + '<div class="bcards">' + all.map((q, i) => '<div class="bcard"><b>' + letters[i] + '</b>' + (raster ? gridCard(conv(q), { small: true }) : tierCard(q, { small: true })) + '</div>').join("") + '</div></div>',
      reveal: '<span class="bigletter">' + letters[all.findIndex(q => same(q, p))] + '</span>' };
  });
}
function boardLesen() {
  return () => many(i => { const p = rndPat(i % 2 ? AN.s1 : AN.start), ev = tierEvents(p); return { html: tierCard(p), reveal: player(ev, {}) }; });
}

/* ---------- „Das kann ich“-Karte mit Super-Stickern ----------
   Ein Stempel je geschaffter Mission. Super-Sticker: nur wenn alle Aufgaben einer Mission im 1. Versuch gelingen,
   einmal pro Mission, vom Kind aus 6 festen Motiven gewählt (kein Zufall, keine Seltenheit, nichts zu verlieren). */
const STK = {
  stern: '<svg viewBox="0 0 100 100"><path d="M50 6l12.5 26 28.5 3.5-21 19.5 5.5 28.5L50 69.5 24.5 83.5 30 55 9 35.5 37.5 32z" fill="#ffcf33" stroke="#b07d00" stroke-width="5" stroke-linejoin="round"/></svg>',
  herz: '<svg viewBox="0 0 100 100"><path d="M50 88C20 66 8 48 8 32 8 18 19 9 31 9c9 0 15 5 19 12 4-7 10-12 19-12 12 0 23 9 23 23 0 16-12 34-42 56z" fill="#ff5c8a" stroke="#a3204a" stroke-width="5" stroke-linejoin="round"/></svg>',
  rakete: '<svg viewBox="0 0 100 100"><path d="M50 6c16 12 22 30 18 54H32C28 36 34 18 50 6z" fill="#e9eef7" stroke="#1b2636" stroke-width="5" stroke-linejoin="round"/><circle cx="50" cy="36" r="8" fill="#5b93e8" stroke="#1b2636" stroke-width="4"/><path d="M32 52L18 70l16-2M68 52l14 18-16-2" fill="#e5355f" stroke="#1b2636" stroke-width="4" stroke-linejoin="round"/><path d="M40 62l10 30 10-30z" fill="#ffb020" stroke="#c45a00" stroke-width="3" stroke-linejoin="round"/></svg>',
  blitz: '<svg viewBox="0 0 100 100"><path d="M58 4L20 56h24L36 96l44-58H54z" fill="#ffe14d" stroke="#a37b00" stroke-width="5" stroke-linejoin="round"/></svg>',
  krone: '<svg viewBox="0 0 64 64"><path d="M8 48 L4 18 L20 30 L32 10 L44 30 L60 18 L56 48 Z" fill="#e0a400" stroke="#a87800" stroke-width="3" stroke-linejoin="round"/><rect x="8" y="48" width="48" height="8" rx="2" fill="#c98f00"/></svg>',
  trommel: '<svg viewBox="0 0 200 200">' + PAUKE_SVG + '</svg>'
};
const STK_ORDER = ["stern", "herz", "rakete", "blitz", "krone", "trommel"];
const INK = { start: "#2a5fc4", s1: "#157a44", s2: "#7b4bc4", s3: "#c9245a", ge: "#d9670a" };
const ROWLABEL = { start: "Bär · Löwe", s1: "Klapperschlange", s2: "Trommelraster", s3: "Fell · Rand", ge: "Starter" };
function missionSign(mid) {
  if (/puls|spielen/.test(mid)) return sign("TROMMELN");
  if (/finden/.test(mid)) return sign("ANSCHAUEN");
  if (/bauen/.test(mid)) return sign("BAUEN");
  if (/uebersetzen/.test(mid)) return sign("VERGLEICHEN");
  if (/wer/.test(mid)) return sign("WER");
  return "";
}
const stkKey = (l, m) => l + "|" + m;
function renderKannIch(el) {
  S.stk = S.stk || {};
  const trackOn = !!(S.track && APP.track), levels = trackOn ? [APP.track.id] : ORDER();
  el.innerHTML = '<div class="kc">' + levels.map(l => {
    const L = levelDef(l), open = trackOn || unlocked(l);
    return '<div class="kc-row' + (open ? "" : " locked") + '"><div class="kc-head"><span class="marks">' + (L.marks || "") + '</span><span class="lvicons">' + (L.icons ? L.icons() : (L.startHTML ? "" : "")) + '</span><span class="kc-lab">' + (ROWLABEL[l] || L.label) + '</span></div><div class="kc-stamps">'
      + L.missions.map(m => { const done = !!(S.prog[l] && S.prog[l][m] && S.prog[l][m].done), st = S.stk[stkKey(l, m)];
        return '<div class="kc-slot" data-kc="' + stkKey(l, m) + '"><div class="kc-stamp' + (done ? " on" : "") + '" style="--ink:' + (INK[l] || "#2a5fc4") + '"><svg viewBox="0 0 200 200">' + APP.missions[m].icon() + '</svg>' + (done ? '<span class="kc-ok">' + ICON.ok + '</span>' : "") + '</div>'
          + (st && STK[st] ? '<span class="stk">' + STK[st] + '</span>' : "") + '<div class="kc-verb">' + missionSign(m) + '<span>' + APP.missions[m].name + '</span></div></div>'; }).join("")
      + '</div></div>';
  }).join("") + '</div>';
}
function stickerPicker(key, mid) {
  const old = $("stkPick"); if (old) old.remove();
  const box = document.createElement("div"); box.id = "stkPick"; box.className = "pick";
  box.innerHTML = '<div class="pickbox"><div class="pickhead">' + STK.stern + '<span>Alles beim 1. Versuch!</span></div>'
    + '<div class="kc-stamp on" style="--ink:#2a5fc4;width:96px;height:96px"><svg viewBox="0 0 200 200">' + APP.missions[mid].icon() + '</svg></div>'
    + '<div class="picks">' + STK_ORDER.map(k => '<button data-stk="' + k + '" aria-label="' + k + '">' + STK[k] + '</button>').join("") + '</div></div>';
  document.body.appendChild(box);
  box.querySelectorAll("[data-stk]").forEach(b => b.onclick = () => {
    if (LV.readOnly) { box.remove(); return; }
    S.stk = S.stk || {}; S.stk[key] = b.dataset.stk; save(); b.classList.add("sel"); burst(b);
    setTimeout(() => box.remove(), 600);
  });
}
function onMissionDone(o) {
  const key = stkKey(o.level, o.mid); S.stk = S.stk || {};
  if (o.perfect && !S.stk[key] && !LV.readOnly) stickerPicker(key, o.mid);
}
const KARTE_ICON = () => '<rect x="20" y="30" width="160" height="140" rx="14" fill="#fff" stroke="#1b2636" stroke-width="7"/><circle cx="65" cy="80" r="26" fill="none" stroke="#2a5fc4" stroke-width="8"/><circle cx="135" cy="80" r="26" fill="none" stroke="#157a44" stroke-width="8"/><circle cx="65" cy="140" r="20" fill="none" stroke="#c3cddb" stroke-width="6" stroke-dasharray="8 7"/><circle cx="135" cy="140" r="20" fill="none" stroke="#c3cddb" stroke-width="6" stroke-dasharray="8 7"/><path d="M50 80l11 11 20-22" fill="none" stroke="#2a5fc4" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><path d="M122 80l9 9 16-17" fill="none" stroke="#157a44" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>';

/* ---------- App ---------- */
const APP = {
  id: "rhythmus-baukasten",
  title: "Rhythmus-Trainer",
  subtitle: "Bär, Löwe, Klapperschlange – und die Trommel.",
  credit: "mit KI erstellt · geprüft: J. Schneider · " + (HAS_TIER_IMG ? "Tierbilder: Material mit freundlicher Genehmigung von www.worksheetcrafter.com" : "Tier-Symbole: eigene Zeichnungen") + (hasSigns() ? " · Gebärdenbilder: © Verlag Karin Kestner, kestner.app" : ""),
  crownLabel: "Rhythmus-Profi",
  hero: () => '<svg viewBox="0 0 420 120" style="width:min(100%,420px)"><g transform="translate(10 10)">' + ANIMAL_SVG.b + '</g><g transform="translate(120 10)">' + ANIMAL_SVG.l + '</g><g transform="translate(230 10)">' + ANIMAL_SVG.s + '</g><g transform="translate(330 8) scale(.52)">' + PAUKE_SVG + '</g></svg>',
  unlockShare: 0.7,
  levels: [
    { id: "start", marks: "★", label: "Start", icons: () => animal("b", "mini") + animal("l", "mini"), missions: ["st_puls", "st_spielen", "st_finden", "st_bauen"] },
    { id: "s1", marks: "●", label: "Stufe 1", lock: "k1", icons: () => animal("s", "mini"), missions: ["s1_spielen", "s1_finden", "s1_bauen"] },
    { id: "s2", marks: "●●", label: "Stufe 2", lock: "k2", icons: () => '<span class="mini">' + hitSym("R") + '</span>' + '<span class="mini">' + hitSym("L") + '</span>', missions: ["s2_spielen", "s2_uebersetzen", "s2_finden", "s2_bauen"] },
    { id: "s3", marks: "●●●", label: "Stufe 3", lock: "k3", icons: () => '<span class="mini">' + hitSym("F") + '</span>' + '<span class="mini">' + hitSym("K") + '</span>', missions: ["s3_spielen", "s3_finden", "s3_bauen"] }
  ],
  track: { id: "ge", label: "Starter", switchLabel: "Starter-Schiene (Puls, Bär / Klapperschlange) auf diesem Gerät", missions: ["ge_spielen", "ge_finden", "ge_wer"],
    startHTML: () => '<span class="lvicons">' + animal("b", "mini") + animal("s", "mini") + '</span>Starter' },
  missions: {
    st_puls: { name: "Puls", icon: MI.puls }, st_spielen: { name: "Mitspielen", icon: MI.spielen }, st_finden: { name: "Finden", icon: MI.finden }, st_bauen: { name: "Nachbauen", icon: MI.bauen },
    s1_spielen: { name: "Mitspielen", icon: MI.spielen }, s1_finden: { name: "Finden", icon: MI.finden }, s1_bauen: { name: "Nachbauen", icon: MI.bauen },
    s2_spielen: { name: "Mitspielen", icon: MI.spielen }, s2_uebersetzen: { name: "Übersetzen", icon: MI.uebersetzen }, s2_finden: { name: "Finden", icon: MI.finden }, s2_bauen: { name: "Nachbauen", icon: MI.bauen },
    s3_spielen: { name: "Mitspielen", icon: MI.spielen }, s3_finden: { name: "Finden", icon: MI.finden }, s3_bauen: { name: "Nachbauen", icon: MI.bauen },
    ge_spielen: { name: "Puls", icon: MI.puls }, ge_finden: { name: "Finden", icon: MI.finden }, ge_wer: { name: "Wer ist das?", icon: MI.wer }
  },
  buildTasks(level, mid) {
    switch (mid) {
      case "st_puls": return PULS_STEPS.map(o => tSpielen("start", Object.assign({ pat: BBBB }, o)));
      case "st_spielen": return many(startSpielen);
      case "st_finden": return many(() => tFindenTier(AN.start));
      case "st_bauen": return many(() => tBauenTier(AN.start));
      case "s1_spielen": return many(() => tSpielen("s1"));
      case "s1_finden": return many(() => tFindenTier(AN.s1, "s"));
      case "s1_bauen": return many(() => tBauenTier(AN.s1, "s"));
      case "s2_spielen": return many(() => tSpielen("s2"));
      case "s2_uebersetzen": return many(() => tUebersetzen());
      case "s2_finden": return many(() => tFindenRaster(false));
      case "s2_bauen": return many(() => tBauenRaster(false));
      case "s3_spielen": return many(() => tSpielen("s3"));
      case "s3_finden": return many(() => tFindenRaster(true));
      case "s3_bauen": return many(() => tBauenRaster(true));
      case "ge_spielen": return [{ demo: true, flash: true }, { flash: true }, { flash: true }, {}, {}].map(o => tSpielen("ge", Object.assign({ pat: BBBB }, o)));
      case "ge_finden": return shuffle(["b", "s", "b", "s", pick(["b", "s"])]).map(tGeFinden);
      case "ge_wer": return shuffle(["b", "s", "b", "s", pick(["b", "s"])]).map(tGeWer);
    }
    return [];
  },
  locks: {
    k1: { label: "Stufe 1: Klapperschlange", switchLabel: "Code Stufe 1 (Klapperschlange) eingegeben", missions: [], code: ["baer", "schlange", "loewe"], keys: KEYS },
    k2: { label: "Stufe 2: Trommelraster", switchLabel: "Code Stufe 2 (Trommelraster) eingegeben", missions: [], code: ["schlange", "baer", "pauke"], keys: KEYS },
    k3: { label: "Stufe 3: Fell und Rand", switchLabel: "Code Stufe 3 (Fell und Rand) eingegeben", missions: [], code: ["pauke", "loewe", "pauke"], keys: KEYS }
  },
  onMissionDone,
  extras: [
    { id: "karte", label: "Das kann ich", track: true, icon: KARTE_ICON, render: renderKannIch },
    { id: "frei", label: "Frei bauen", track: true, icon: () => BUILD_ICON.slice(BUILD_ICON.indexOf(">") + 1).replace("</svg>", ""), render: renderFreiBauen },
    { id: "trommeln", label: "Trommeln", track: false, icon: () => PAUKE_SVG, render: renderTrommeln }
  ],
  board: {
    tiere: { label: "Tiere finden", cards: boardFinden(false) },
    raster: { label: "Raster finden", cards: boardFinden(true) },
    lesen: { label: "Lesen und trommeln", cards: boardLesen() }
  },
  info: '<p><b>Idee:</b> Die App übt Notation lesen, erkennen, bauen und mitspielen. Getrommelt wird an der Trommel; die App gibt dafür im Bereich „Trommeln“ Hilfen in vier Stufen. Fühlen geht nur analog (iPads können nicht vibrieren).</p>'
    + '<p><b>Notation:</b> Ein Kästchen = eine Zählzeit. Bär = 1 Schlag, Löwe = 2, Klapperschlange = 4. Trommelraster wie in der Trommelschule: 8 Spalten (1 + 2 + 3 + 4 +), Zeilen Bass / Slap / Tap, rot = rechte Hand, blau = linke Hand. Stufe 3: Hand auf dem Fell (Zeile 1) und Stick am Rand (Zeile 2). Die Handfarben werden gezeigt, aber nicht abgefragt.</p>'
    + '<p><b>Stufen:</b> Start Puls, Bär + Löwe · Stufe 1 + Klapperschlange · Stufe 2 Tiere ↔ Trommelraster (nur Bär/Löwe) · Stufe 3 Fell + Rand. Stufen 1–3 öffnen sich erst mit 70 % der Sterne der vorigen Stufe <b>und</b> dem Bild-Code, den du an der Tafel zeigst (Codes oben nach Eingabe des Lehrkraft-Codes).</p>'
    + '<p><b>Puls (Einstieg ins Mitspielen):</b> Bär–Bär–Bär–Bär. Aufgabe 1: Die App spielt erst vor. Aufgaben 1–2: Schlag-Blitz und die Trommel leuchtet zu jedem Schlag. Aufgaben 3–4: nur Puls-Licht. Aufgabe 5: ohne Licht, nur Einzählen.</p>'
    + '<p><b>Mitspielen:</b> Nach dem Einzählen 1–4 im Puls-Licht auf der Bildschirm-Trommel tippen. Die App prüft jeden Schlag mit Toleranz; höchstens 1 Extra-Schlag. Hilfe nach einem Fehler: Vorspielen, danach etwas langsamer mit Schlag-Blitz. Start-Mitspielen ist gestuft: erst ein Löwe, dann bis zu zwei, dann frei. Tempo: Start/Stufe 1/3 ca. 57 Schläge pro Minute, Stufe 2 60, Starter 52.</p>'
    + '<p><b>Weitere Missionen:</b> Finden (Hilfe: langsam noch einmal, Schläge bleiben als Punkte stehen) · Nachbauen (gleiche Hilfe; nach der richtigen Lösung „Spiel mit!“ zum Trommeln/Klatschen) · Übersetzen (Hilfe: Lauflicht über der Karte).</p>'
    + '<p><b>Das kann ich:</b> Stempel für jede geschaffte Mission. Gelingt eine Mission ganz im 1. Versuch, wählt das Kind einmal einen Super-Sticker (6 feste Motive). Wiederholen ist immer möglich, bringt aber keinen weiteren Sticker. Keine Tagesbelohnungen, kein Zeitdruck, kein Vergleich zwischen Kindern.</p>'
    + '<p><b>Frei bauen:</b> eigener Rhythmus mit Tieren, ohne Sterne. Danach „Jetzt du!“ – trommeln in der Schule, klatschen oder patschen zu Hause.</p>'
    + '<p><b>Starter-Schiene</b> (Schalter oben, nur auf dem Gerät des Kindes): Puls mitspielen, Bär oder Klapperschlange finden, „Wer ist das?“ – immer zwei Antworten.</p>'
};
