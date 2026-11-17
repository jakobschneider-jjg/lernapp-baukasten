/* ==========================================================================
   Kreide-Zeichnungen (gemeinsam für Kalender-App und Escape Room)
   Stil: Kinderzeichnung mit Wachsmalkreide. Gezeichnet mit rough.js (MIT, © Preet Shihn).
   Alle Figuren sind eigene Zeichnungen. Koordinaten: x,y = Fußpunkt (Mitte unten), k = Maßstab.
   ========================================================================== */
/* Wachsmalkreide-Farben */
const C = {
  nacht: "#13203f", nacht2: "#1d2f5a", nacht3: "#2a3f72", schnee: "#eef3fb", schnee2: "#c9d6ec", schneeS: "#9fb3d6",
  holz: "#7a4a26", holz2: "#a5682f", holzD: "#4b2b14", dach: "#5a3018", gelb: "#ffd257", orange: "#f39a2b", rot: "#d8432f",
  blau: "#3d6fb8", blauD: "#24477e", haut: "#f2c39b", braun: "#8a5530", tanne: "#2f6b45", tanne2: "#3f8a58", grau: "#6f7686",
  schaf: "#f6f1e6", schafS: "#2b2b33", kuh: "#b45f2e", kuhF: "#f5e9d4", pferd: "#9b5b2c", maehne: "#f0d39a", huhn: "#c8cfdb", stroh: "#e7bd45", ink: "#1b1b24"
};

/* gleichbleibende Zufallszahlen, damit jede Zeichnung bei jedem Laden gleich aussieht */
let SEED = 7;
function rnd() { SEED = (SEED * 16807) % 2147483647; return (SEED - 1) / 2147483646; }
function r(a, b) { return a + rnd() * (b - a); }

/* Papierkorn: Sprenkel, die aus den Kreidestrichen herausgenommen werden */
let GRAIN = null;
function grain() {
  if (GRAIN) return GRAIN;
  const c = document.createElement("canvas"); c.width = c.height = 220; const x = c.getContext("2d");
  for (let i = 0; i < 2600; i++) { x.fillStyle = "rgba(0,0,0," + r(.15, .9).toFixed(2) + ")"; const s = r(.6, 2.2); x.fillRect(r(0, 220), r(0, 220), s, s * r(.5, 1.6)); }
  GRAIN = c; return c;
}

/* Hilfsfunktionen für das Zeichnen mit rough.js */
function Z(ctx) {
  const rc = rough.canvas(ctx.canvas);
  const base = { roughness: 1.9, bowing: 1.6, strokeWidth: 3, stroke: C.ink, fillStyle: "hachure", hachureGap: 5, fillWeight: 2.6, hachureAngle: -41 };
  const o = (opt) => Object.assign({ seed: Math.floor(rnd() * 1e6) + 1 }, base, opt || {});
  return {
    ctx,
    rect: (x, y, w, h, opt) => rc.rectangle(x, y, w, h, o(opt)),
    ell: (x, y, w, h, opt) => rc.ellipse(x, y, w, h, o(opt)),
    circ: (x, y, d, opt) => rc.circle(x, y, d, o(opt)),
    poly: (pts, opt) => rc.polygon(pts, o(opt)),
    line: (x1, y1, x2, y2, opt) => rc.line(x1, y1, x2, y2, o(opt)),
    curve: (pts, opt) => rc.curve(pts, o(opt)),
    path: (d, opt) => rc.path(d, o(opt)),
    /* Fläche „ausmalen“: zwei Schraffur-Durchgänge in leicht verschiedenen Tönen = Wachsmalkreide */
    mal: (shape, args, farben, opt) => {
      farben.forEach((f, i) => rc[shape](...args, o(Object.assign({ stroke: "none", fill: f, hachureAngle: (i % 2 ? 48 : -38) + r(-8, 8), hachureGap: (opt && opt.gap || 5) + i * 1.5, fillWeight: (opt && opt.fw || 3) - i * .4, roughness: 2.4 }, opt))));
    }
  };
}
/* Wachskreide-Korn über eine fertige Ebene legen */
function korn(ctx, staerke) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = "destination-out"; ctx.globalAlpha = staerke || .28;
  ctx.fillStyle = ctx.createPattern(grain(), "repeat"); ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height); ctx.restore();
}
function gesicht(z, x, y, d, o) {
  o = o || {};
  z.circ(x, y, d, { fill: C.haut, fillStyle: "solid", strokeWidth: 2.6 });
  z.mal("circle", [x, y, d * .9], ["#e9a983"], { gap: 7, fw: 1.6 });
  const e = d * .17;
  if (o.zu) { z.path("M" + (x - e - 5) + " " + (y - 2) + " q5 5 10 0", { strokeWidth: 2.4 }); z.path("M" + (x + e - 5) + " " + (y - 2) + " q5 5 10 0", { strokeWidth: 2.4 }); }
  else { z.circ(x - e, y - 3, 5, { fill: C.ink, fillStyle: "solid", strokeWidth: 1 }); z.circ(x + e, y - 3, 5, { fill: C.ink, fillStyle: "solid", strokeWidth: 1 }); }
  z.path("M" + (x - d * .15) + " " + (y + d * .18) + " q" + d * .15 + " " + d * .1 + " " + d * .3 + " 0", { strokeWidth: 2.4 });
  z.circ(x - d * .28, y + d * .1, d * .14, { fill: "#f08f86", fillStyle: "solid", stroke: "none" });
  z.circ(x + d * .28, y + d * .1, d * .14, { fill: "#f08f86", fillStyle: "solid", stroke: "none" });
}

/* ---------- Figuren und Tiere (Kinderzeichnung) ---------- */
const FIG = {
  frau(z, x, y, s) {   /* x,y = Fußpunkt */
    const k = s || 1;
    z.poly([[x - 34 * k, y], [x + 34 * k, y], [x + 18 * k, y - 120 * k], [x - 18 * k, y - 120 * k]], { fill: "#5a4a7a" });
    z.mal("polygon", [[[x - 30 * k, y - 4], [x + 30 * k, y - 4], [x + 16 * k, y - 116 * k], [x - 16 * k, y - 116 * k]]], ["#6b5a92", "#4a3c68"]);
    z.poly([[x - 40 * k, y - 96 * k], [x + 40 * k, y - 96 * k], [x, y - 150 * k]], { fill: "#e6e1d2", fillStyle: "solid" });
    z.mal("polygon", [[[x - 36 * k, y - 98 * k], [x + 36 * k, y - 98 * k], [x, y - 146 * k]]], ["#d2ccb8"]);
    z.ell(x, y - 154 * k, 66 * k, 70 * k, { fill: "#e6e1d2", fillStyle: "solid", strokeWidth: 2.8 });   /* Kopftuch hinter dem Gesicht */
    z.mal("ellipse", [x, y - 154 * k, 60 * k, 64 * k], ["#d2ccb8"], { gap: 6 });
    gesicht(z, x, y - 148 * k, 44 * k);
  },
  mann(z, x, y, s) {
    const k = s || 1;
    z.line(x - 14 * k, y - 50 * k, x - 18 * k, y, { strokeWidth: 9, stroke: C.braun }); z.line(x + 14 * k, y - 50 * k, x + 18 * k, y, { strokeWidth: 9, stroke: C.braun });
    z.ell(x - 22 * k, y + 2, 26 * k, 12 * k, { fill: C.ink, fillStyle: "solid" }); z.ell(x + 22 * k, y + 2, 26 * k, 12 * k, { fill: C.ink, fillStyle: "solid" });
    z.poly([[x - 30 * k, y - 46 * k], [x + 30 * k, y - 46 * k], [x + 26 * k, y - 132 * k], [x - 26 * k, y - 132 * k]], { fill: C.blau });
    z.mal("polygon", [[[x - 26 * k, y - 50 * k], [x + 26 * k, y - 50 * k], [x + 22 * k, y - 128 * k], [x - 22 * k, y - 128 * k]]], [C.blau, C.blauD]);
    z.line(x + 24 * k, y - 120 * k, x + 62 * k, y - 96 * k, { strokeWidth: 10, stroke: C.blauD });   /* Arm zur Laterne */
    gesicht(z, x, y - 158 * k, 50 * k);
    z.path("M" + (x - 27 * k) + " " + (y - 164 * k) + " Q" + x + " " + (y - 206 * k) + " " + (x + 27 * k) + " " + (y - 164 * k) + " Z", { fill: C.blauD, fillStyle: "solid" });
    z.circ(x, y - 192 * k, 14 * k, { fill: C.rot, fillStyle: "solid" });
  },
  laterne(z, x, y, s) {   /* x,y = Griff oben */
    const k = s || 1;
    z.path("M" + (x - 12 * k) + " " + (y + 14 * k) + " Q" + x + " " + (y - 8 * k) + " " + (x + 12 * k) + " " + (y + 14 * k), { strokeWidth: 3 });
    z.poly([[x - 18 * k, y + 26 * k], [x + 18 * k, y + 26 * k], [x + 12 * k, y + 12 * k], [x - 12 * k, y + 12 * k]], { fill: C.holzD, fillStyle: "solid" });
    z.rect(x - 16 * k, y + 26 * k, 32 * k, 40 * k, { fill: "#ffe48a", fillStyle: "solid" });
    z.ell(x, y + 48 * k, 12 * k, 22 * k, { fill: C.orange, fillStyle: "solid", stroke: "#c4621a", strokeWidth: 1.5 });
    z.rect(x - 20 * k, y + 64 * k, 40 * k, 9 * k, { fill: C.holzD, fillStyle: "solid" });
  },
  pferd(z, x, y, s, zu) {   /* x,y = Mitte unten */
    const k = s || 1;
    [-60, -38, 34, 56].forEach(d => z.line(x + d * k, y - 60 * k, x + d * k + r(-4, 4), y, { strokeWidth: 11, stroke: "#7d4520" }));
    z.ell(x, y - 88 * k, 170 * k, 86 * k, { fill: C.pferd, fillStyle: "solid" });
    z.mal("ellipse", [x, y - 88 * k, 160 * k, 76 * k], [C.pferd, "#7d4520"]);
    z.poly([[x + 52 * k, y - 112 * k], [x + 92 * k, y - 190 * k], [x + 118 * k, y - 172 * k], [x + 84 * k, y - 96 * k]], { fill: C.pferd, fillStyle: "solid" });
    z.ell(x + 120 * k, y - 182 * k, 74 * k, 40 * k, { fill: C.pferd, fillStyle: "solid" });
    z.poly([[x + 98 * k, y - 206 * k], [x + 104 * k, y - 230 * k], [x + 114 * k, y - 202 * k]], { fill: C.pferd, fillStyle: "solid" });
    z.path("M" + (x + 86 * k) + " " + (y - 196 * k) + " q-14 30 -6 50 q-12 26 -2 46", { stroke: C.maehne, strokeWidth: 12 });
    z.path("M" + (x - 82 * k) + " " + (y - 100 * k) + " q-30 20 -18 70", { stroke: C.maehne, strokeWidth: 11 });
    if (zu) z.path("M" + (x + 116 * k) + " " + (y - 190 * k) + " q6 6 12 0", { strokeWidth: 2.6 }); else z.circ(x + 122 * k, y - 190 * k, 7 * k, { fill: C.ink, fillStyle: "solid" });
  },
  kuh(z, x, y, s, zu) {
    const k = s || 1;
    [-58, -36, 32, 54].forEach(d => z.line(x + d * k, y - 56 * k, x + d * k + r(-4, 4), y, { strokeWidth: 11, stroke: "#8f4a22" }));
    z.ell(x, y - 84 * k, 176 * k, 92 * k, { fill: C.kuh, fillStyle: "solid" });
    z.mal("ellipse", [x, y - 84 * k, 166 * k, 82 * k], [C.kuh, "#94481f"]);
    z.ell(x - 30 * k, y - 96 * k, 50 * k, 32 * k, { fill: C.kuhF, fillStyle: "solid", stroke: "none" }); z.ell(x + 28 * k, y - 70 * k, 36 * k, 24 * k, { fill: C.kuhF, fillStyle: "solid", stroke: "none" });
    z.ell(x + 104 * k, y - 112 * k, 66 * k, 74 * k, { fill: C.kuh, fillStyle: "solid" });
    z.ell(x + 108 * k, y - 86 * k, 50 * k, 30 * k, { fill: "#f1b1a2", fillStyle: "solid" });
    z.path("M" + (x + 80 * k) + " " + (y - 140 * k) + " q-14 -18 -4 -30", { strokeWidth: 5, stroke: C.kuhF });
    z.path("M" + (x + 128 * k) + " " + (y - 140 * k) + " q14 -18 4 -30", { strokeWidth: 5, stroke: C.kuhF });
    if (zu) { z.path("M" + (x + 88 * k) + " " + (y - 120 * k) + " q5 5 10 0", { strokeWidth: 2.6 }); z.path("M" + (x + 112 * k) + " " + (y - 120 * k) + " q5 5 10 0", { strokeWidth: 2.6 }); }
    else { z.circ(x + 92 * k, y - 120 * k, 7 * k, { fill: C.ink, fillStyle: "solid" }); z.circ(x + 118 * k, y - 120 * k, 7 * k, { fill: C.ink, fillStyle: "solid" }); }
  },
  huhn(z, x, y, s, zu) {
    const k = s || 1;
    z.line(x - 8 * k, y - 22 * k, x - 12 * k, y, { strokeWidth: 4, stroke: C.orange }); z.line(x + 8 * k, y - 22 * k, x + 12 * k, y, { strokeWidth: 4, stroke: C.orange });
    z.poly([[x - 40 * k, y - 52 * k], [x - 74 * k, y - 82 * k], [x - 66 * k, y - 34 * k]], { fill: "#9aa5bb", fillStyle: "solid" });
    z.ell(x, y - 46 * k, 90 * k, 64 * k, { fill: C.huhn, fillStyle: "solid" });
    z.mal("ellipse", [x, y - 46 * k, 80 * k, 54 * k], ["#aeb7c9"]);
    z.circ(x + 38 * k, y - 82 * k, 40 * k, { fill: C.huhn, fillStyle: "solid" });
    z.path("M" + (x + 28 * k) + " " + (y - 100 * k) + " q4 -16 10 -2 q6 -16 10 0", { fill: C.rot, fillStyle: "solid", strokeWidth: 2 });
    z.poly([[x + 56 * k, y - 86 * k], [x + 74 * k, y - 80 * k], [x + 56 * k, y - 74 * k]], { fill: C.orange, fillStyle: "solid", strokeWidth: 2 });
    if (zu) z.path("M" + (x + 38 * k) + " " + (y - 86 * k) + " q4 4 8 0", { strokeWidth: 2.4 }); else z.circ(x + 42 * k, y - 86 * k, 6 * k, { fill: C.ink, fillStyle: "solid" });
  },
  schaf(z, x, y, s, zu, spiegel) {
    const k = s || 1, m = spiegel ? -1 : 1;
    [-26, -10, 12, 28].forEach(d => z.line(x + d * k, y - 26 * k, x + d * k, y, { strokeWidth: 8, stroke: C.schafS }));
    [[-30, -44, 50], [-8, -60, 54], [18, -58, 52], [34, -40, 46], [-14, -32, 50], [12, -30, 50]].forEach(c => z.circ(x + c[0] * k, y + c[1] * k, c[2] * k, { fill: C.schaf, fillStyle: "solid", strokeWidth: 2.4 }));
    z.ell(x + m * 50 * k, y - 50 * k, 34 * k, 42 * k, { fill: C.schafS, fillStyle: "solid" });
    z.ell(x + m * 34 * k, y - 64 * k, 18 * k, 10 * k, { fill: C.schafS, fillStyle: "solid" });
    if (zu) z.path("M" + (x + m * 50 * k - 6) + " " + (y - 54 * k) + " q6 5 12 0", { stroke: "#fff", strokeWidth: 2.6 }); else z.circ(x + m * 54 * k, y - 54 * k, 6 * k, { fill: "#fff", fillStyle: "solid", stroke: "none" });
  },
  maus(z, x, y, s) {
    const k = s || 1;
    z.ell(x, y - 12 * k, 40 * k, 24 * k, { fill: C.grau, fillStyle: "solid" }); z.circ(x + 18 * k, y - 22 * k, 16 * k, { fill: C.grau, fillStyle: "solid" });
    z.path("M" + (x - 20 * k) + " " + (y - 10 * k) + " q-20 10 -30 -6", { strokeWidth: 2.4 }); z.circ(x + 22 * k, y - 18 * k, 4 * k, { fill: C.ink, fillStyle: "solid" });
  },
  tanne(z, x, y, s) {
    const k = s || 1;
    z.rect(x - 8 * k, y - 30 * k, 16 * k, 30 * k, { fill: C.holz, fillStyle: "solid" });
    for (let i = 0; i < 3; i++) { const b = y - (30 + i * 42) * k, w = (150 - i * 38) * k; z.poly([[x - w / 2, b], [x + w / 2, b], [x, b - 84 * k]], { fill: i % 2 ? C.tanne2 : C.tanne, fillStyle: "hachure", hachureGap: 4 }); }
    z.path("M" + (x - 40 * k) + " " + (y - 70 * k) + " q40 -12 80 0", { stroke: C.schnee, strokeWidth: 7 });
    z.path("M" + (x - 28 * k) + " " + (y - 110 * k) + " q28 -10 56 0", { stroke: C.schnee, strokeWidth: 6 });
  },
  baum(z, x, y, s) {
    const k = s || 1;
    z.line(x, y, x + r(-6, 6), y - 230 * k, { strokeWidth: 12, stroke: "#3b2a22" });
    for (let i = 0; i < 7; i++) {
      const yy = y - (80 + i * 22) * k, d = (i % 2 ? 1 : -1), l = (90 - i * 9) * k;
      z.line(x, yy, x + d * l, yy - l * .8, { strokeWidth: 6 - i * .5, stroke: "#3b2a22" });
      z.line(x + d * l * .6, yy - l * .48, x + d * l * .9, yy - l * .9, { strokeWidth: 3, stroke: "#3b2a22" });
      z.line(x + d * l * .3, yy - l * .3 - 6, x + d * l * .95, yy - l * .82 - 6, { strokeWidth: 3, stroke: C.schnee2 });
    }
  },
  haus(z, x, y, s) {
    const k = s || 1;
    z.rect(x - 50 * k, y - 60 * k, 100 * k, 60 * k, { fill: "#3d3550", fillStyle: "solid" });
    z.poly([[x - 64 * k, y - 58 * k], [x + 64 * k, y - 58 * k], [x, y - 110 * k]], { fill: C.schnee, fillStyle: "solid" });
    z.rect(x - 16 * k, y - 44 * k, 30 * k, 26 * k, { fill: "#1b1830", fillStyle: "solid" });
    z.line(x - 1, y - 44 * k, x - 1, y - 18 * k, { strokeWidth: 2 });
  }
};

/* ---------- weitere Figuren (Kalender und Escape Room) ---------- */
function sternPunkte(cx, cy, ra, ri, n) { const p = []; for (let i = 0; i < 2 * (n || 5); i++) { const a = i * Math.PI / (n || 5) - Math.PI / 2, q = i % 2 ? ri : ra; p.push([cx + q * Math.cos(a), cy + q * Math.sin(a)]); } return p; }
function glanz(ctx, x, y, rad, farbe, staerke) {   /* weiches Licht (Laterne, Stern, Fenster) */
  const g = ctx.createRadialGradient(x, y, 0, x, y, rad); const f = farbe || "255,214,120";
  g.addColorStop(0, "rgba(" + f + "," + (staerke || .55) + ")"); g.addColorStop(.45, "rgba(" + f + "," + ((staerke || .55) * .4) + ")"); g.addColorStop(1, "rgba(" + f + ",0)");
  ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, rad, 0, 6.3); ctx.fill(); ctx.restore();
}
Object.assign(FIG, {
  frauMit(z, x, y, k, o) {   /* Frau mit Zusatz: arm (Hand nach rechts), becher, baby (im Arm) */
    o = o || {}; const m = o.links ? -1 : 1;
    if (o.arm) { z.line(x + m * 22 * k, y - 112 * k, x + m * 78 * k, y - 128 * k, { strokeWidth: 12 * k + 2, stroke: "#4a3c68" }); z.circ(x + m * 84 * k, y - 130 * k, 18 * k, { fill: C.haut, fillStyle: "solid" }); }
    FIG.frau(z, x, y, k);
    if (o.becher) { z.line(x + m * 16 * k, y - 104 * k, x + m * 34 * k, y - 140 * k, { strokeWidth: 12 * k + 2, stroke: "#4a3c68" }); z.poly([[x + m * 26 * k, y - 172 * k], [x + m * 58 * k, y - 172 * k], [x + m * 54 * k, y - 140 * k], [x + m * 30 * k, y - 140 * k]], { fill: "#fff", fillStyle: "solid" }); }
    if (o.baby) FIG.baby(z, x + 2 * k, y - 82 * k, k * .62);
  },
  frauLiegt(z, x, y, k) {   /* schlafend im Stroh, x,y = Mitte unten */
    z.poly([[x - 110 * k, y - 8 * k], [x + 60 * k, y - 4 * k], [x + 60 * k, y - 56 * k], [x - 100 * k, y - 60 * k]], { fill: "#5a4a7a" });
    z.mal("polygon", [[[x - 104 * k, y - 12 * k], [x + 56 * k, y - 8 * k], [x + 56 * k, y - 52 * k], [x - 96 * k, y - 56 * k]]], ["#6b5a92", "#4a3c68"]);
    z.ell(x + 92 * k, y - 34 * k, 70 * k, 64 * k, { fill: "#e6e1d2", fillStyle: "solid" });
    gesicht(z, x + 96 * k, y - 32 * k, 42 * k, { zu: true });
  },
  mannMitLaterne(z, x, y, k) { FIG.mann(z, x, y, k); FIG.laterne(z, x + 66 * k, y - 112 * k, k); },
  mutter(z, x, y, k) {
    z.poly([[x - 40 * k, y], [x + 40 * k, y], [x + 22 * k, y - 124 * k], [x - 22 * k, y - 124 * k]], { fill: "#c9463d", fillStyle: "solid" });
    z.mal("polygon", [[[x - 36 * k, y - 4], [x + 36 * k, y - 4], [x + 20 * k, y - 120 * k], [x - 20 * k, y - 120 * k]]], ["#d8564a", "#a8352e"]);
    z.circ(x, y - 182 * k, 30 * k, { fill: "#7a4a22", fillStyle: "solid" });
    z.ell(x, y - 150 * k, 58 * k, 62 * k, { fill: "#7a4a22", fillStyle: "solid" });
    gesicht(z, x, y - 146 * k, 46 * k);
  },
  kind(z, x, y, k) {
    z.line(x - 12 * k, y - 46 * k, x - 14 * k, y, { strokeWidth: 9 * k + 1, stroke: "#44506a" }); z.line(x + 12 * k, y - 46 * k, x + 14 * k, y, { strokeWidth: 9 * k + 1, stroke: "#44506a" });
    z.poly([[x - 26 * k, y - 44 * k], [x + 26 * k, y - 44 * k], [x + 24 * k, y - 108 * k], [x - 24 * k, y - 108 * k]], { fill: "#3f8fd4" });
    z.mal("polygon", [[[x - 22 * k, y - 48 * k], [x + 22 * k, y - 48 * k], [x + 20 * k, y - 104 * k], [x - 20 * k, y - 104 * k]]], ["#3f8fd4", "#2f6fae"]);
    gesicht(z, x, y - 138 * k, 54 * k);
    z.path("M" + (x - 28 * k) + " " + (y - 146 * k) + " Q" + (x - 20 * k) + " " + (y - 176 * k) + " " + x + " " + (y - 170 * k) + " Q" + (x + 24 * k) + " " + (y - 178 * k) + " " + (x + 28 * k) + " " + (y - 146 * k) + " Q" + x + " " + (y - 158 * k) + " " + (x - 28 * k) + " " + (y - 146 * k), { fill: "#f2c84b", fillStyle: "solid" });
  },
  baby(z, x, y, k) {   /* x,y = Mitte */
    z.ell(x + 14 * k, y, 120 * k, 66 * k, { fill: "#fbf7ee", fillStyle: "solid" });
    z.mal("ellipse", [x + 14 * k, y, 110 * k, 56 * k], ["#e4dccb"], { gap: 7 });
    z.path("M" + (x - 10 * k) + " " + (y - 26 * k) + " q30 24 70 -6", { strokeWidth: 2.4, stroke: "#c8bfa8" });
    gesicht(z, x - 40 * k, y - 4 * k, 46 * k, { zu: true });
  },
  hirte(z, x, y, k, o) {
    o = o || {}; const c = o.c || "#8b6a45";
    z.line(x + 34 * k, y, x + 36 * k, y - 210 * k, { strokeWidth: 8, stroke: "#6b4a2a" });
    z.path("M" + (x + 36 * k) + " " + (y - 210 * k) + " q14 -26 -6 -30", { strokeWidth: 8, stroke: "#6b4a2a" });
    z.line(x - 12 * k, y - 46 * k, x - 16 * k, y, { strokeWidth: 10 * k + 1, stroke: "#4a3b2c" }); z.line(x + 12 * k, y - 46 * k, x + 16 * k, y, { strokeWidth: 10 * k + 1, stroke: "#4a3b2c" });
    z.poly([[x - 32 * k, y - 40 * k], [x + 32 * k, y - 40 * k], [x + 24 * k, y - 132 * k], [x - 24 * k, y - 132 * k]], { fill: c });
    z.mal("polygon", [[[x - 28 * k, y - 44 * k], [x + 28 * k, y - 44 * k], [x + 20 * k, y - 128 * k], [x - 20 * k, y - 128 * k]]], [c, "#5a4632"]);
    z.line(x + 22 * k, y - 116 * k, x + 34 * k, y - 96 * k, { strokeWidth: 10 * k + 1, stroke: c });
    if (o.zeigt) z.line(x - 22 * k, y - 118 * k, x - 82 * k, y - 160 * k, { strokeWidth: 10 * k + 1, stroke: c });
    gesicht(z, x, y - 156 * k, 50 * k);
    z.ell(x, y - 176 * k, 84 * k, 18 * k, { fill: "#4a3b2c", fillStyle: "solid" }); z.path("M" + (x - 24 * k) + " " + (y - 178 * k) + " Q" + x + " " + (y - 226 * k) + " " + (x + 24 * k) + " " + (y - 178 * k) + " Z", { fill: "#4a3b2c", fillStyle: "solid" });
  },
  hund(z, x, y, k) {
    z.path("M" + (x - 50 * k) + " " + (y - 50 * k) + " q-26 -10 -24 -40", { strokeWidth: 8, stroke: C.ink });
    [-34, -18, 16, 32].forEach(d => z.line(x + d * k, y - 30 * k, x + d * k, y, { strokeWidth: 9 * k + 1, stroke: "#2b2b33" }));
    z.ell(x, y - 46 * k, 110 * k, 50 * k, { fill: "#2b2b33", fillStyle: "solid" }); z.ell(x + 22 * k, y - 38 * k, 34 * k, 24 * k, { fill: "#fff", fillStyle: "solid", stroke: "none" });
    z.circ(x + 56 * k, y - 82 * k, 50 * k, { fill: "#2b2b33", fillStyle: "solid" }); z.poly([[x + 40 * k, y - 100 * k], [x + 46 * k, y - 132 * k], [x + 62 * k, y - 104 * k]], { fill: "#2b2b33", fillStyle: "solid" });
    z.ell(x + 76 * k, y - 74 * k, 30 * k, 20 * k, { fill: "#fff", fillStyle: "solid" }); z.circ(x + 88 * k, y - 78 * k, 8 * k, { fill: C.ink, fillStyle: "solid" }); z.circ(x + 58 * k, y - 88 * k, 7 * k, { fill: "#fff", fillStyle: "solid", stroke: "none" });
  },
  krippe(z, x, y, k, baby) {
    z.line(x - 70 * k, y - 60 * k, x - 40 * k, y, { strokeWidth: 9, stroke: "#6b4a2a" }); z.line(x + 70 * k, y - 60 * k, x + 40 * k, y, { strokeWidth: 9, stroke: "#6b4a2a" });
    z.line(x - 54 * k, y - 4 * k, x + 54 * k, y - 60 * k, { strokeWidth: 8, stroke: "#6b4a2a" }); z.line(x + 54 * k, y - 4 * k, x - 54 * k, y - 60 * k, { strokeWidth: 8, stroke: "#6b4a2a" });
    z.poly([[x - 100 * k, y - 126 * k], [x + 100 * k, y - 126 * k], [x + 76 * k, y - 54 * k], [x - 76 * k, y - 54 * k]], { fill: C.holz2 });
    z.mal("polygon", [[[x - 94 * k, y - 122 * k], [x + 94 * k, y - 122 * k], [x + 72 * k, y - 58 * k], [x - 72 * k, y - 58 * k]]], [C.holz2, C.holz]);
    z.path("M" + (x - 100 * k) + " " + (y - 126 * k) + " q14 -26 32 -8 q14 -28 34 -6 q18 -26 34 -4 q18 -26 34 -2 q16 -22 30 8 Z", { fill: C.stroh, fillStyle: "solid" });
    if (baby) FIG.baby(z, x + 4 * k, y - 150 * k, k * .9);
  },
  stroh(z, x, y, k) {
    z.path("M" + (x - 130 * k) + " " + y + " Q" + (x - 90 * k) + " " + (y - 80 * k) + " " + (x - 10 * k) + " " + (y - 70 * k) + " Q" + (x + 60 * k) + " " + (y - 96 * k) + " " + (x + 130 * k) + " " + y + " Z", { fill: C.stroh, fillStyle: "solid" });
    z.mal("polygon", [[[x - 110 * k, y - 6], [x - 20 * k, y - 66 * k], [x + 110 * k, y - 6]]], ["#d9a83a", "#f0cd5e"], { gap: 5 });
    for (let i = 0; i < 9; i++) { const xx = x + r(-110, 110) * k, yy = y - r(8, 50) * k; z.line(xx, yy, xx + r(-24, 24) * k, yy - r(6, 18) * k, { strokeWidth: 2.4, stroke: "#a87a1c" }); }
  },
  eimer(z, x, y, k) {
    z.path("M" + (x - 36 * k) + " " + (y - 74 * k) + " Q" + x + " " + (y - 130 * k) + " " + (x + 36 * k) + " " + (y - 74 * k), { strokeWidth: 4 });
    z.poly([[x - 40 * k, y - 76 * k], [x + 40 * k, y - 76 * k], [x + 30 * k, y], [x - 30 * k, y]], { fill: "#b9c2cf", fillStyle: "solid" });
    z.mal("polygon", [[[x - 36 * k, y - 72 * k], [x + 36 * k, y - 72 * k], [x + 28 * k, y - 4], [x - 28 * k, y - 4]]], ["#9aa5b5"], { gap: 7 });
    z.ell(x, y - 76 * k, 80 * k, 22 * k, { fill: "#fffdf6", fillStyle: "solid" });
  },
  stern(z, x, y, k, glow) {   /* x,y = Mitte */
    if (glow) glanz(z.ctx, x, y, 170 * k, "255,236,160", .5);
    const p = sternPunkte(x, y, 70 * k, 30 * k, 5);
    z.poly(p, { fill: C.gelb, fillStyle: "solid", strokeWidth: 4 }); z.mal("polygon", [p], ["#f2b52c", "#ffe27a"], { gap: 6 });
  },
  sternchen(z, x, y, k) { z.poly(sternPunkte(x, y, 14 * k, 6 * k, 5), { fill: "#fff3b0", fillStyle: "solid", strokeWidth: 1.6, stroke: "#c9a83a" }); },
  mond(z, x, y, k) { const a = 60 * k, b = 48 * k; z.path("M" + (x + 10 * k) + " " + (y - 60 * k) + " A" + a + " " + a + " 0 1 0 " + (x + 60 * k) + " " + (y + 40 * k) + " A" + b + " " + b + " 0 1 1 " + (x + 10 * k) + " " + (y - 60 * k) + " Z", { fill: "#ffe58a", fillStyle: "solid", strokeWidth: 3 }); },
  hand(z, x, y, k) {
    [[-46, -70, 62], [-20, -98, 92], [6, -92, 86], [32, -66, 60]].forEach(f => z.rect(x + f[0] * k, y + f[1] * k, 22 * k, f[2] * k, { fill: C.haut, fillStyle: "solid" }));
    z.line(x - 54 * k, y + 14 * k, x - 88 * k, y - 22 * k, { strokeWidth: 22 * k, stroke: C.haut }); z.rect(x - 52 * k, y - 14 * k, 106 * k, 80 * k, { fill: C.haut, fillStyle: "solid" });
    z.mal("rectangle", [x - 48 * k, y - 10 * k, 98 * k, 72 * k], ["#e9a983"], { gap: 8 });
  },
  herz(z, x, y, k) { z.path("M" + x + " " + (y + 40 * k) + " C" + (x - 70 * k) + " " + (y - 10 * k) + " " + (x - 40 * k) + " " + (y - 70 * k) + " " + x + " " + (y - 30 * k) + " C" + (x + 40 * k) + " " + (y - 70 * k) + " " + (x + 70 * k) + " " + (y - 10 * k) + " " + x + " " + (y + 40 * k) + " Z", { fill: "#e2546b", fillStyle: "solid", strokeWidth: 3 }); },
  kueken(z, x, y, k) { z.circ(x, y - 22 * k, 44 * k, { fill: "#f7d54a", fillStyle: "solid" }); z.circ(x + 20 * k, y - 50 * k, 30 * k, { fill: "#f7d54a", fillStyle: "solid" }); z.poly([[x + 32 * k, y - 52 * k], [x + 46 * k, y - 48 * k], [x + 32 * k, y - 44 * k]], { fill: C.orange, fillStyle: "solid", strokeWidth: 1.6 }); z.circ(x + 24 * k, y - 54 * k, 5 * k, { fill: C.ink, fillStyle: "solid" }); },
  tuer(z, x, y, k, offen) {
    z.rect(x - 66 * k, y - 196 * k, 132 * k, 196 * k, { fill: offen ? "#ffd57a" : C.holzD, fillStyle: "solid" });
    if (!offen) { z.mal("rectangle", [x - 62 * k, y - 192 * k, 124 * k, 188 * k], [C.holz2, "#8a5226"], { gap: 5 }); z.line(x - 22 * k, y - 192 * k, x - 22 * k, y - 4, { strokeWidth: 2.4, stroke: C.holzD }); z.line(x + 22 * k, y - 192 * k, x + 22 * k, y - 4, { strokeWidth: 2.4, stroke: C.holzD }); z.circ(x + 40 * k, y - 96 * k, 14 * k, { fill: "#e3a920", fillStyle: "solid" }); }
  },
  stall(z, x, y, k, o) {   /* Stall von außen; x,y = Mitte unten. o.offen: Tür offen + Licht; o.licht: Fenster hell */
    o = o || {}; const X = v => x + (v - 840) * k, Y = v => y + (v - 804) * k;
    if (o.offen) glanz(z.ctx, X(740), Y(700), 260 * k, "255,200,110", .6);
    z.rect(X(600), Y(520), 480 * k, 284 * k, { fill: C.holz, fillStyle: "solid" });
    z.mal("rectangle", [X(604), Y(524), 472 * k, 276 * k], [C.holz2, C.holz], { gap: 5, fw: 3.4 });
    for (let v = 560; v < 800; v += 40) z.line(X(604), Y(v) + r(-3, 3), X(1076), Y(v) + r(-3, 3), { strokeWidth: 2, stroke: C.holzD });
    z.poly([[X(566), Y(528)], [X(1114), Y(528)], [X(840), Y(330)]], { fill: C.dach, fillStyle: "solid" });
    z.mal("polygon", [[[X(580), Y(524)], [X(1100), Y(524)], [X(840), Y(340)]]], ["#6d3c1c", C.dach], { gap: 6 });
    z.path("M" + X(556) + " " + Y(534) + " Q" + X(700) + " " + Y(420) + " " + X(840) + " " + Y(318) + " Q" + X(980) + " " + Y(420) + " " + X(1124) + " " + Y(534) + " Q" + X(1110) + " " + Y(552) + " " + X(1090) + " " + Y(536) + " Q" + X(980) + " " + Y(450) + " " + X(840) + " " + Y(352) + " Q" + X(700) + " " + Y(450) + " " + X(590) + " " + Y(540) + " Q" + X(568) + " " + Y(552) + " " + X(556) + " " + Y(534) + " Z", { fill: C.schnee, fillStyle: "solid", strokeWidth: 3 });
    FIG.tuer(z, X(740), Y(804), k * 1.06, o.offen);
    z.rect(X(900), Y(596), 112 * k, 90 * k, { fill: o.licht || o.offen ? "#ffd57a" : "#1e2340", fillStyle: "solid", strokeWidth: 4 });
    z.line(X(956), Y(598), X(956), Y(684), { strokeWidth: 4, stroke: C.holzD }); z.line(X(902), Y(641), X(1010), Y(641), { strokeWidth: 4, stroke: C.holzD });
    z.path("M" + X(890) + " " + Y(594) + " q" + 66 * k + " " + (-18 * k) + " " + 132 * k + " 0", { stroke: C.schnee, strokeWidth: 8 });
  }
});
