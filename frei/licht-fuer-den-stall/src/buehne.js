
/* ==========================================================================
   „Ein Licht für den Stall“ – Escape Room zu Astrid Lindgren, „Weihnachten im Stall“
   Bühne: Guckkasten aus gemalten Ebenen, Parallaxe (Wischen/Neigen), Schnee, Laternenlicht.
   ========================================================================== */
"use strict";
const W = 1600, H = 1000, OVER = 0.2;
const MARGIN_X = W * OVER / 2, MARGIN_Y = H * OVER / 2;
const $ = id => document.getElementById(id);
const PCT = (x, y) => ({ left: ((x + MARGIN_X) / (W * (1 + OVER)) * 100) + "%", top: ((y + MARGIN_Y) / (H * (1 + OVER)) * 100) + "%" });
const B = { szene: null, ebenen: [], px: 0, py: 0, tx: 0, ty: 0, fx: null, fy: null, dunkel: 0, schnee: false, blitz: false };

/* Szene aufbauen: nur die aktuelle Szene liegt im Speicher (iPad) */
function baueSzene(name) {
  const box = $("welt"); box.textContent = "";
  B.ebenen.forEach(e => { const c = e.el.querySelector("canvas"); if (c) { c.width = 0; c.height = 0; } });
  const stage = $("stage"), cw = stage.clientWidth, dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const def = SZENEN[name];
  B.szene = name; B.schnee = !!def.schnee; B.dunkel = def.dunkel || 0;
  B.ebenen = def.ebenen.map((e, i) => {
    const el = document.createElement("div"); el.className = "ebene"; el.dataset.id = e.id;
    const cv = document.createElement("canvas"), sc = cw * (e.res === 1 ? Math.min(dpr, 1.1) : dpr) / W;
    cv.width = Math.round(W * (1 + OVER) * sc); cv.height = Math.round(H * (1 + OVER) * sc);
    const ctx = cv.getContext("2d"); ctx.setTransform(sc, 0, 0, sc, MARGIN_X * sc, MARGIN_Y * sc); ctx.lineCap = "round"; ctx.lineJoin = "round";
    SEED = 1000 + i * 77 + name.length * 31; const z = Z(ctx); e.draw(z, ctx); korn(ctx, .28);
    el.appendChild(cv); box.appendChild(el);
    return { def: e, el };
  });
  document.body.dataset.szene = name;
}
function ebene(id) { const e = B.ebenen.find(x => x.def.id === id); return e ? e.el : null; }
function spot(ebeneId, x, y, w, h, cls, onTap) {
  const b = document.createElement("button"), p = PCT(x - w / 2, y - h / 2);
  b.className = "spot " + (cls || ""); b.style.left = p.left; b.style.top = p.top;
  b.style.width = (w / (W * (1 + OVER)) * 100) + "%"; b.style.height = (h / (H * (1 + OVER)) * 100) + "%";
  b.addEventListener("click", e => { e.stopPropagation(); onTap(b); });
  ebene(ebeneId).appendChild(b); return b;
}
function frei(ebeneId, x, y, cls, html, w, h) {   /* Element in einer Ebene, Mitte bei x,y; Größe w×h in Entwurfs-Einheiten */
  const d = document.createElement("div"), p = PCT(x, y); d.className = "frei " + cls; d.style.left = p.left; d.style.top = p.top; if (html) d.innerHTML = html;
  if (w) { d.style.width = (w / (W * (1 + OVER)) * 100) + "%"; d.style.height = (h / (H * (1 + OVER)) * 100) + "%"; }
  ebene(ebeneId).appendChild(d); return d;
}
function setzePos(el, x, y) { const p = PCT(x, y); el.style.left = p.left; el.style.top = p.top; }
/* kleine Figur als eigenes Bild (z. B. Maus, Baby, Hirten-Spielstein) */
function sprite(ebeneId, x, y, w, h, malen, cls) {
  const c = document.createElement("canvas"); c.width = Math.round(w * 1.2); c.height = Math.round(h * 1.2);
  const ctx = c.getContext("2d"); ctx.scale(1.2, 1.2); ctx.lineCap = "round"; ctx.lineJoin = "round"; SEED = 900 + Math.round(x); malen(Z(ctx), ctx); korn(ctx, .2);
  const d = frei(ebeneId, x, y, "sprite " + (cls || ""), "", w, h); d.appendChild(c); return d;
}

/* Rahmen des Guckkastens (steht still) */
function baueRahmen() {
  const stage = $("stage"), cv = $("rahmen"), dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  cv.width = Math.round(stage.clientWidth * dpr); cv.height = Math.round(stage.clientHeight * dpr);
  const sc = cv.width / W, ctx = cv.getContext("2d"); ctx.setTransform(sc, 0, 0, sc, 0, 0); SEED = 4242; const z = Z(ctx), b = 34;
  ctx.fillStyle = "#5a3418"; ctx.fillRect(0, 0, W, b); ctx.fillRect(0, H - b, W, b); ctx.fillRect(0, 0, b, H); ctx.fillRect(W - b, 0, b, H);
  z.mal("rectangle", [0, 0, W, b], ["#7a4a26", "#4b2b14"], { gap: 5 }); z.mal("rectangle", [0, H - b, W, b], ["#7a4a26", "#4b2b14"], { gap: 5 });
  z.mal("rectangle", [0, 0, b, H], ["#7a4a26", "#4b2b14"], { gap: 5 }); z.mal("rectangle", [W - b, 0, b, H], ["#7a4a26", "#4b2b14"], { gap: 5 });
  z.rect(b, b, W - 2 * b, H - 2 * b, { strokeWidth: 5, fill: undefined });
  const pts = [[0, 0]]; for (let x = 0; x <= W; x += 80) pts.push([x, 26 + r(0, 22)]); pts.push([W, 0]);
  z.poly(pts, { fill: C.schnee, fillStyle: "solid", strokeWidth: 3 }); korn(ctx, .25);
}

/* Parallaxe: Wischen (Finger) oder Neigen (iPad), weich nachgeführt */
function parallaxe() {
  B.px += (B.tx - B.px) * .1; B.py += (B.ty - B.py) * .1;
  const w = $("stage").clientWidth, m = w * OVER / 2;
  B.ebenen.forEach(({ def, el }) => { el.style.transform = "translate3d(" + (-B.px * def.f * m * 1.8).toFixed(1) + "px," + (-B.py * def.f * m * 1.1).toFixed(1) + "px,0)"; });
  $("welt").style.transform = "rotateY(" + (B.px * 4).toFixed(2) + "deg) rotateX(" + (-B.py * 2.2).toFixed(2) + "deg)";
  schnee(); laterne();
  requestAnimationFrame(parallaxe);
}
function eingabe() {
  const st = $("stage");
  const setz = e => { const r = st.getBoundingClientRect(); B.tx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - .5) * 2)); B.ty = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - .5) * 2)); B.fx = e.clientX - r.left; B.fy = e.clientY - r.top; };
  st.addEventListener("pointermove", setz); st.addEventListener("pointerdown", setz);
  window.addEventListener("deviceorientation", e => {
    if (e.gamma == null) return;
    const quer = Math.abs(window.orientation || 0) === 90 || (screen.orientation && /landscape/.test(screen.orientation.type));
    const a = quer ? e.beta : e.gamma, b = quer ? -e.gamma : e.beta - 45;
    B.tx = Math.max(-1, Math.min(1, a / 14)); B.ty = Math.max(-1, Math.min(1, b / 18));
  });
}
function neigenErlauben() { try { if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === "function") DeviceOrientationEvent.requestPermission().catch(() => { }); } catch (e) { } }

const FLOCKEN = [];
function schnee() {
  const cv = $("schnee"), ctx = cv.getContext("2d");
  if (cv.width !== cv.clientWidth) { cv.width = cv.clientWidth; cv.height = cv.clientHeight; FLOCKEN.length = 0; }
  ctx.clearRect(0, 0, cv.width, cv.height); if (!B.schnee) return;
  if (!FLOCKEN.length) for (let i = 0; i < 90; i++) FLOCKEN.push({ x: Math.random() * cv.width, y: Math.random() * cv.height, r: 1.5 + Math.random() * 3.5, v: .3 + Math.random() * .8, p: Math.random() * 6 });
  ctx.fillStyle = "rgba(255,255,255,.85)"; const ruhig = matchMedia("(prefers-reduced-motion: reduce)").matches;
  FLOCKEN.forEach(f => {
    if (!ruhig) { f.y += f.v; f.p += .02; f.x += Math.sin(f.p) * .4; }
    if (f.y > cv.height + 5) { f.y = -5; f.x = Math.random() * cv.width; }
    const ox = -B.px * f.r * 9; ctx.beginPath(); ctx.arc(((f.x + ox) % cv.width + cv.width) % cv.width, f.y, f.r, 0, 6.3); ctx.fill();
  });
}
/* Dunkelheit: der Finger ist das Laternenlicht (B.dunkel = Deckkraft der Nacht, 0 = aus) */
function laterne() {
  const cv = $("dunkel"), ctx = cv.getContext("2d");
  if (!B.dunkel) { if (cv.width) cv.width = 0; return; }
  if (cv.width !== cv.clientWidth) { cv.width = cv.clientWidth; cv.height = cv.clientHeight; }
  const x = B.fx == null ? cv.width * .5 : B.fx, y = B.fy == null ? cv.height * .7 : B.fy, rad = cv.width * (B.blitz ? 2 : .16);
  ctx.globalCompositeOperation = "source-over"; ctx.clearRect(0, 0, cv.width, cv.height);
  ctx.fillStyle = "rgba(6,8,22," + B.dunkel + ")"; ctx.fillRect(0, 0, cv.width, cv.height);
  ctx.globalCompositeOperation = "destination-out";
  const g = ctx.createRadialGradient(x, y, rad * .2, x, y, rad); g.addColorStop(0, "rgba(0,0,0,1)"); g.addColorStop(.7, "rgba(0,0,0,.75)"); g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, rad, 0, 6.3); ctx.fill();
  ctx.globalCompositeOperation = "source-over";
  const w = ctx.createRadialGradient(x, y, 0, x, y, rad); w.addColorStop(0, "rgba(255,200,90,.18)"); w.addColorStop(1, "rgba(255,200,90,0)"); ctx.fillStyle = w; ctx.beginPath(); ctx.arc(x, y, rad, 0, 6.3); ctx.fill();
}

/* kleine Bildsymbole (für Schlösser, Karten, Wegkarte) */
const ICON_CACHE = {};
function iconURL(typ) {
  if (ICON_CACHE[typ]) return ICON_CACHE[typ];
  const c = document.createElement("canvas"); c.width = c.height = 220; const ctx = c.getContext("2d"); ctx.lineCap = "round"; ctx.lineJoin = "round"; const z = Z(ctx); SEED = 99 + typ.length * 7;
  ctx.translate(110, 110);
  const pfeil = rot => { ctx.save(); ctx.rotate(rot); z.poly([[-70, -22], [20, -22], [20, -56], [84, 0], [20, 56], [20, 22], [-70, 22]], { fill: "#3d6fb8", fillStyle: "solid", strokeWidth: 5 }); z.mal("polygon", [[[-64, -16], [16, -16], [16, -44], [74, 0], [16, 44], [16, 16], [-64, 16]]], ["#5a8cd6"], { gap: 7 }); ctx.restore(); };
  ({
    pferd: () => FIG.pferd(z, -40, 70, .62), kuh: () => FIG.kuh(z, -44, 64, .62), huhn: () => FIG.huhn(z, -12, 70, 1.25),
    schaf: () => FIG.schaf(z, -10, 60, 1.35), laterne: () => FIG.laterne(z, 0, -70, 1.9),
    auge: () => { z.ell(0, 0, 170, 90, { fill: "#fff", fillStyle: "solid", strokeWidth: 5 }); z.circ(0, 0, 66, { fill: C.blau, fillStyle: "solid" }); z.circ(0, 0, 26, { fill: C.ink, fillStyle: "solid" }); },
    fenster: () => { z.rect(-80, -70, 160, 140, { fill: "#1e2340", fillStyle: "solid", strokeWidth: 6 }); z.line(0, -70, 0, 70, { strokeWidth: 6, stroke: C.holzD }); z.line(-80, 0, 80, 0, { strokeWidth: 6, stroke: C.holzD }); },
    schloss: () => { z.path("M-44 0 V-40 Q-44 -88 0 -88 Q44 -88 44 -40 V0", { strokeWidth: 14, stroke: "#9aa3b2" }); z.rect(-74, -6, 148, 110, { fill: "#e3a920", fillStyle: "solid", strokeWidth: 5 }); z.circ(0, 40, 26, { fill: C.ink, fillStyle: "solid" }); },
    stern: () => FIG.stern(z, 0, 0, 1.3),
    sternLeer: () => z.poly(sternPunkte(0, 0, 92, 40, 5), { stroke: "#7f8fb5", strokeWidth: 5, fill: undefined }),
    spuren: () => { for (let i = 0; i < 4; i++) { const y = 70 - i * 46, x = i % 2 ? 26 : -26; z.ell(x, y, 34, 52, { fill: "#a9bbd8", fillStyle: "solid", strokeWidth: 3 }); [-12, 0, 12].forEach(d => z.circ(x + d, y - 34, 11, { fill: "#a9bbd8", fillStyle: "solid", strokeWidth: 2 })); } },
    herz: () => FIG.herz(z, 0, 0, 1.6), hirte: () => FIG.hirte(z, -10, 100, .9), krippe: () => FIG.krippe(z, 0, 80, .9, true),
    stall: () => { FIG.stall(z, 0, 90, .4, { offen: true }); FIG.stern(z, 0, -70, .5); },
    hand: () => { FIG.hand(z, 0, 10, 1); flockeK(z, 70, -70, 1.1); }, hunger: () => { z.path("M-90 0 H90 Q84 80 0 80 Q-84 80 -90 0 Z", { fill: "#fff", fillStyle: "solid", strokeWidth: 5 }); z.ell(0, 0, 180, 34, { fill: "#eef1f6", fillStyle: "solid", strokeWidth: 5 }); z.line(40, -90, 80, -10, { strokeWidth: 10, stroke: "#9aa3b2" }); },
    muede: () => { z.circ(0, 0, 170, { fill: C.haut, fillStyle: "solid", strokeWidth: 5 }); z.path("M-56 -10 q20 14 40 0 M16 -10 q20 14 40 0", { strokeWidth: 6 }); z.ell(0, 40, 34, 44, { fill: C.ink, fillStyle: "solid" }); z.path("M60 -96 h30 l-30 34 h30", { strokeWidth: 7, stroke: "#2a5fc4" }); },
    links: () => pfeil(Math.PI), rechts: () => pfeil(0), hoch: () => pfeil(-Math.PI / 2), runter: () => pfeil(Math.PI / 2),
    milch: () => FIG.eimer(z, 0, 80, 1.6), wolle: () => { FIG.schaf(z, -10, 60, 1.35, true); }, ei: () => { z.ell(0, 0, 100, 130, { fill: "#fbf3e2", fillStyle: "solid", strokeWidth: 5 }); },
    stroh: () => FIG.stroh(z, 0, 50, .8),
    maehne: () => { FIG.pferd(z, -100, 120, .75); }, baby: () => FIG.baby(z, 0, 0, 1.3), bett: () => FIG.krippe(z, 0, 80, .95, false),
    weihnachten: () => { FIG.stall(z, 0, 100, .42, { offen: true }); FIG.stern(z, 0, -66, .6, true); }
  })[typ]();
  korn(ctx, .18);
  return (ICON_CACHE[typ] = c.toDataURL());
}
function flockeK(z, x, y, k) { const s = 26 * k; [[0, -s, 0, s], [-s * .87, -s / 2, s * .87, s / 2], [-s * .87, s / 2, s * .87, -s / 2]].forEach(l => z.line(x + l[0], y + l[1], x + l[2], y + l[3], { strokeWidth: 6, stroke: "#4f8fd0" })); }
function img(typ, cls) { return '<img class="' + (cls || "ico") + '" src="' + iconURL(typ) + '" alt="">'; }
