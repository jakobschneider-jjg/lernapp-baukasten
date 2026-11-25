/* ==========================================================================
   Lesewerkstatt: Tierbilder im Kreidestil (eigene Zeichnungen, rough.js).
   Nutzt FIG und Z() aus frei/kreide.js. Raster 400 × 400, x,y = Fußpunkt.
   ========================================================================== */
const FIG_LW = {
  maus(z, x, y, k) {   /* Seitenansicht: große runde Ohren, spitze Nase, Schnurrhaare, langer Schwanz */
    const f = "#9aa1ad", d = "#7b8290";
    z.path("M" + (x - 80 * k) + " " + (y - 40 * k) + " q-60 10 -80 -30 q-14 -30 10 -50", { strokeWidth: 6, stroke: "#e8a0a8" });   /* Schwanz */
    [-40, -10, 30, 56].forEach(e => z.line(x + e * k, y - 20 * k, x + e * k + 4, y, { strokeWidth: 6, stroke: "#e8a0a8" }));
    z.path("M" + (x - 90 * k) + " " + (y - 30 * k) + " Q" + (x - 80 * k) + " " + (y - 130 * k) + " " + (x + 20 * k) + " " + (y - 120 * k)
      + " Q" + (x + 110 * k) + " " + (y - 110 * k) + " " + (x + 140 * k) + " " + (y - 50 * k) + " Q" + (x + 60 * k) + " " + (y - 14 * k) + " " + (x - 90 * k) + " " + (y - 30 * k) + " Z", { fill: f, fillStyle: "solid" });
    z.mal("ellipse", [x - 4 * k, y - 66 * k, 170 * k, 70 * k], [f, d]);
    z.circ(x + 46 * k, y - 132 * k, 74 * k, { fill: f, fillStyle: "solid" }); z.circ(x + 46 * k, y - 132 * k, 44 * k, { fill: "#f4b6c0", fillStyle: "solid", stroke: "none" });   /* Ohr */
    z.circ(x + 140 * k, y - 52 * k, 16 * k, { fill: "#e2546b", fillStyle: "solid", strokeWidth: 2 });   /* Nase */
    z.circ(x + 92 * k, y - 82 * k, 12 * k, { fill: C.ink, fillStyle: "solid" });
    [[-10, -8], [0, 0], [10, 8]].forEach(([a, b]) => { z.line(x + 128 * k, y - 50 * k + a * k, x + 190 * k, y - 62 * k + b * 2 * k, { strokeWidth: 2 }); });
  },
  hund(z, x, y, k) {   /* hellbraun, Schlappohr, lange Schnauze, Zunge, Halsband, Schwanz hoch */
    const f = "#c98a4b", d = "#9a6230";
    z.path("M" + (x - 80 * k) + " " + (y - 80 * k) + " q-30 -40 -10 -90", { strokeWidth: 12, stroke: d });   /* Schwanz */
    [-60, -34, 30, 56].forEach(e => z.line(x + e * k, y - 50 * k, x + e * k, y, { strokeWidth: 14, stroke: d }));
    z.ell(x, y - 80 * k, 180 * k, 84 * k, { fill: f, fillStyle: "solid" });
    z.mal("ellipse", [x, y - 80 * k, 170 * k, 74 * k], [f, d]);
    z.ell(x + 96 * k, y - 140 * k, 92 * k, 84 * k, { fill: f, fillStyle: "solid" });   /* Kopf */
    z.ell(x + 150 * k, y - 124 * k, 74 * k, 44 * k, { fill: "#e0b483", fillStyle: "solid" });   /* Schnauze */
    z.circ(x + 184 * k, y - 132 * k, 20 * k, { fill: C.ink, fillStyle: "solid" });   /* Nase */
    z.path("M" + (x + 150 * k) + " " + (y - 104 * k) + " q8 30 22 0", { fill: "#e2546b", fillStyle: "solid", strokeWidth: 2.4 });   /* Zunge */
    z.ell(x + 70 * k, y - 120 * k, 36 * k, 78 * k, { fill: "#6b3f1c", fillStyle: "solid" });   /* Schlappohr */
    z.circ(x + 108 * k, y - 156 * k, 12 * k, { fill: C.ink, fillStyle: "solid" });
    z.line(x + 56 * k, y - 96 * k, x + 104 * k, y - 92 * k, { strokeWidth: 9, stroke: "#d8432f" });   /* Halsband */
  },
  katze(z, x, y, k) {
    const f = "#e8913a", d = "#b9661f";
    z.path("M" + (x - 70 * k) + " " + (y - 40 * k) + " q-60 -10 -50 -90 q4 -24 18 -10", { strokeWidth: 12, stroke: d });   /* Schwanz */
    [-50, -26, 26, 50].forEach(e => z.line(x + e * k, y - 40 * k, x + e * k, y, { strokeWidth: 12, stroke: d }));
    z.ell(x, y - 62 * k, 160 * k, 80 * k, { fill: f, fillStyle: "solid" });
    z.mal("ellipse", [x, y - 62 * k, 150 * k, 70 * k], [f, d]);
    z.circ(x + 78 * k, y - 120 * k, 86 * k, { fill: f, fillStyle: "solid" });
    z.poly([[x + 44 * k, y - 140 * k], [x + 50 * k, y - 196 * k], [x + 80 * k, y - 158 * k]], { fill: f, fillStyle: "solid" });
    z.poly([[x + 112 * k, y - 140 * k], [x + 108 * k, y - 196 * k], [x + 80 * k, y - 158 * k]], { fill: f, fillStyle: "solid" });
    z.circ(x + 62 * k, y - 126 * k, 12 * k, { fill: "#3d7a3a", fillStyle: "solid" }); z.circ(x + 96 * k, y - 126 * k, 12 * k, { fill: "#3d7a3a", fillStyle: "solid" });
    z.poly([[x + 72 * k, y - 110 * k], [x + 86 * k, y - 110 * k], [x + 79 * k, y - 101 * k]], { fill: "#e2546b", fillStyle: "solid", strokeWidth: 2 });
    [[-1, -6], [-1, 4], [1, -6], [1, 4]].forEach(([s, dy]) => z.line(x + 79 * k + s * 12 * k, y - 104 * k + dy * k, x + 79 * k + s * 64 * k, y - 112 * k + dy * 2 * k, { strokeWidth: 2.2 }));
  },
  schwein(z, x, y, k) {
    const f = "#f4a9b8", d = "#e0849a";
    [-56, -30, 28, 54].forEach(e => z.line(x + e * k, y - 40 * k, x + e * k, y, { strokeWidth: 14, stroke: d }));
    z.path("M" + (x - 92 * k) + " " + (y - 80 * k) + " q-26 -6 -18 -26 q14 -10 16 10", { strokeWidth: 5, stroke: d });   /* Ringelschwanz */
    z.ell(x, y - 74 * k, 190 * k, 100 * k, { fill: f, fillStyle: "solid" });
    z.mal("ellipse", [x, y - 74 * k, 180 * k, 90 * k], [f, d]);
    z.circ(x + 96 * k, y - 100 * k, 84 * k, { fill: f, fillStyle: "solid" });
    z.poly([[x + 70 * k, y - 134 * k], [x + 66 * k, y - 170 * k], [x + 92 * k, y - 140 * k]], { fill: d, fillStyle: "solid" });
    z.poly([[x + 104 * k, y - 140 * k], [x + 124 * k, y - 170 * k], [x + 122 * k, y - 132 * k]], { fill: d, fillStyle: "solid" });
    z.ell(x + 130 * k, y - 94 * k, 40 * k, 30 * k, { fill: "#f7c3cd", fillStyle: "solid" });
    z.circ(x + 124 * k, y - 94 * k, 6 * k, { fill: C.ink, fillStyle: "solid" }); z.circ(x + 138 * k, y - 94 * k, 6 * k, { fill: C.ink, fillStyle: "solid" });
    z.circ(x + 96 * k, y - 116 * k, 9 * k, { fill: C.ink, fillStyle: "solid" });
  },
  ente(z, x, y, k) {
    const f = "#f6f1e6", g = "#3f8a58";
    z.path("M" + (x - 150 * k) + " " + (y - 6 * k) + " q40 -18 80 0 q40 18 80 0 q40 -18 80 0 q40 18 80 0", { strokeWidth: 6, stroke: C.blau });   /* Wasser */
    z.ell(x - 10 * k, y - 58 * k, 180 * k, 90 * k, { fill: f, fillStyle: "solid" });
    z.mal("ellipse", [x - 10 * k, y - 58 * k, 170 * k, 80 * k], ["#ddd6c6"], { gap: 7 });
    z.ell(x - 20 * k, y - 66 * k, 90 * k, 44 * k, { fill: "#cfc5b0", fillStyle: "solid" });   /* Flügel */
    z.circ(x + 64 * k, y - 120 * k, 74 * k, { fill: g, fillStyle: "solid" });
    z.poly([[x + 94 * k, y - 126 * k], [x + 142 * k, y - 116 * k], [x + 94 * k, y - 104 * k]], { fill: C.orange, fillStyle: "solid", strokeWidth: 2.4 });
    z.circ(x + 72 * k, y - 130 * k, 9 * k, { fill: C.ink, fillStyle: "solid" });
    z.line(x + 40 * k, y - 86 * k, x + 84 * k, y - 86 * k, { strokeWidth: 5, stroke: "#fff" });
  },
  fisch(z, x, y, k) {
    const f = "#f39a2b", d = "#d8432f";
    z.poly([[x - 90 * k, y - 90 * k], [x - 150 * k, y - 140 * k], [x - 140 * k, y - 40 * k]], { fill: d, fillStyle: "solid" });
    z.ell(x, y - 90 * k, 200 * k, 110 * k, { fill: f, fillStyle: "solid" });
    z.mal("ellipse", [x, y - 90 * k, 190 * k, 100 * k], [f, "#e07f1c"]);
    z.poly([[x - 20 * k, y - 140 * k], [x + 10 * k, y - 176 * k], [x + 30 * k, y - 140 * k]], { fill: d, fillStyle: "solid" });
    z.path("M" + (x + 40 * k) + " " + (y - 130 * k) + " q-20 40 0 80", { strokeWidth: 3 });
    z.circ(x + 66 * k, y - 104 * k, 22 * k, { fill: "#fff", fillStyle: "solid" }); z.circ(x + 70 * k, y - 104 * k, 10 * k, { fill: C.ink, fillStyle: "solid" });
    [[150, -170], [176, -210], [140, -230]].forEach(([dx, dy], i) => z.circ(x + dx * k, y + dy * k, (14 - i * 3) * k, { stroke: C.blau, strokeWidth: 2.6 }));
  },
  vogel(z, x, y, k) {
    const f = "#3d6fb8", b = "#e2546b";
    z.line(x - 150 * k, y - 20 * k, x + 150 * k, y - 34 * k, { strokeWidth: 12, stroke: "#6b4a2a" });   /* Ast */
    z.line(x - 10 * k, y - 56 * k, x - 14 * k, y - 26 * k, { strokeWidth: 4, stroke: C.orange }); z.line(x + 14 * k, y - 56 * k, x + 12 * k, y - 28 * k, { strokeWidth: 4, stroke: C.orange });
    z.poly([[x - 60 * k, y - 100 * k], [x - 130 * k, y - 120 * k], [x - 120 * k, y - 80 * k]], { fill: f, fillStyle: "solid" });
    z.ell(x, y - 100 * k, 130 * k, 96 * k, { fill: f, fillStyle: "solid" });
    z.mal("ellipse", [x, y - 100 * k, 120 * k, 86 * k], [f, C.blauD]);
    z.ell(x + 10 * k, y - 86 * k, 70 * k, 50 * k, { fill: b, fillStyle: "solid" });   /* Brust */
    z.circ(x + 50 * k, y - 160 * k, 76 * k, { fill: f, fillStyle: "solid" });
    z.poly([[x + 82 * k, y - 166 * k], [x + 116 * k, y - 158 * k], [x + 82 * k, y - 148 * k]], { fill: C.gelb, fillStyle: "solid", strokeWidth: 2.4 });
    z.circ(x + 62 * k, y - 170 * k, 10 * k, { fill: C.ink, fillStyle: "solid" });
  },
  hase(z, x, y, k) {
    const f = "#b9a58c", d = "#8f7a60";
    z.ell(x - 40 * k, y - 34 * k, 90 * k, 50 * k, { fill: f, fillStyle: "solid" });   /* Hinterbein */
    z.ell(x, y - 70 * k, 150 * k, 110 * k, { fill: f, fillStyle: "solid" });
    z.mal("ellipse", [x, y - 70 * k, 140 * k, 100 * k], [f, d]);
    z.circ(x - 78 * k, y - 76 * k, 36 * k, { fill: "#fbf7ee", fillStyle: "solid" });   /* Puschelschwanz */
    z.ell(x + 46 * k, y - 236 * k, 34 * k, 120 * k, { fill: f, fillStyle: "solid" }); z.ell(x + 46 * k, y - 236 * k, 14 * k, 90 * k, { fill: "#f1b1a2", fillStyle: "solid", stroke: "none" });
    z.ell(x + 84 * k, y - 230 * k, 34 * k, 120 * k, { fill: f, fillStyle: "solid" }); z.ell(x + 84 * k, y - 230 * k, 14 * k, 90 * k, { fill: "#f1b1a2", fillStyle: "solid", stroke: "none" });
    z.circ(x + 66 * k, y - 140 * k, 90 * k, { fill: f, fillStyle: "solid" });
    z.circ(x + 84 * k, y - 150 * k, 11 * k, { fill: C.ink, fillStyle: "solid" });
    z.circ(x + 108 * k, y - 128 * k, 12 * k, { fill: "#e2546b", fillStyle: "solid", strokeWidth: 2 });
    z.ell(x + 30 * k, y - 8 * k, 50 * k, 18 * k, { fill: f, fillStyle: "solid" });
  }
};

/* Bildwörter: Wort, Gebärdenvideo-Name, Zeichnung (Raster 400 × 400) */
const TIERE = {
  hund: { w: "Hund", d: z => FIG_LW.hund(z, 150, 345, 1.05) },
  katze: { w: "Katze", d: z => FIG_LW.katze(z, 150, 340, 1.15) },
  maus: { w: "Maus", d: z => FIG_LW.maus(z, 175, 320, 1.1) },
  kuh: { w: "Kuh", d: z => FIG.kuh(z, 150, 350, 1.25) },
  pferd: { w: "Pferd", d: z => FIG.pferd(z, 150, 375, 1.2) },
  schaf: { w: "Schaf", d: z => FIG.schaf(z, 175, 330, 2.6) },
  huhn: { w: "Huhn", d: z => FIG.huhn(z, 200, 345, 2.5) },
  schwein: { w: "Schwein", d: z => FIG_LW.schwein(z, 140, 330, 1.15) },
  ente: { w: "Ente", d: z => FIG_LW.ente(z, 170, 330, 1.2) },
  fisch: { w: "Fisch", d: z => FIG_LW.fisch(z, 180, 310, 1.1) },
  vogel: { w: "Vogel", d: z => FIG_LW.vogel(z, 190, 340, 1.25) },
  hase: { w: "Hase", d: z => FIG_LW.hase(z, 150, 365, 1.15) }
};
const BILD = {};
function tierBild(key) {
  if (BILD[key]) return BILD[key];
  const c = document.createElement("canvas"); c.width = c.height = 300; const ctx = c.getContext("2d");
  ctx.setTransform(.75, 0, 0, .75, 0, 0); ctx.lineCap = "round"; ctx.lineJoin = "round";
  SEED = 300 + key.length * 13 + key.charCodeAt(0); TIERE[key].d(Z(ctx)); korn(ctx, .16);
  return (BILD[key] = c.toDataURL("image/png"));
}
