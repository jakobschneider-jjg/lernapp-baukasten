/* ==========================================================================
   Lesewerkstatt: Bilder im Kreidestil (eigene Zeichnungen, rough.js).
   Nutzt FIG und Z() aus frei/kreide.js. Raster 400 × 400, x,y = Fußpunkt.
   ========================================================================== */
const FIG_LW = {
  /* ---------- Winter ---------- */
  schneemann(z, x, y, k) {
    z.circ(x, y - 70 * k, 140 * k, { fill: C.schnee, fillStyle: "solid", strokeWidth: 3 }); z.mal("circle", [x, y - 70 * k, 130 * k], [C.schnee2], { gap: 9, fw: 1.6 });
    z.circ(x, y - 180 * k, 104 * k, { fill: C.schnee, fillStyle: "solid", strokeWidth: 3 }); z.mal("circle", [x, y - 180 * k, 96 * k], [C.schnee2], { gap: 9, fw: 1.6 });
    z.circ(x, y - 268 * k, 80 * k, { fill: C.schnee, fillStyle: "solid", strokeWidth: 3 });
    z.line(x - 50 * k, y - 190 * k, x - 120 * k, y - 240 * k, { strokeWidth: 6, stroke: "#6b4a2a" }); z.line(x + 50 * k, y - 190 * k, x + 120 * k, y - 240 * k, { strokeWidth: 6, stroke: "#6b4a2a" });
    [-160, -195, -225].forEach(d => z.circ(x, y + d * k, 11 * k, { fill: C.ink, fillStyle: "solid" }));
    z.circ(x - 16 * k, y - 280 * k, 10 * k, { fill: C.ink, fillStyle: "solid" }); z.circ(x + 16 * k, y - 280 * k, 10 * k, { fill: C.ink, fillStyle: "solid" });
    z.poly([[x - 4 * k, y - 266 * k], [x + 50 * k, y - 258 * k], [x - 4 * k, y - 252 * k]], { fill: C.orange, fillStyle: "solid", strokeWidth: 2 });
    z.rect(x - 34 * k, y - 360 * k, 68 * k, 50 * k, { fill: C.ink, fillStyle: "solid" }); z.rect(x - 54 * k, y - 314 * k, 108 * k, 12 * k, { fill: C.ink, fillStyle: "solid" });
  },
  muetze(z, x, y, k) {
    const f = "#d8432f";
    z.path("M" + (x - 110 * k) + " " + (y - 40 * k) + " Q" + (x - 110 * k) + " " + (y - 230 * k) + " " + x + " " + (y - 230 * k) + " Q" + (x + 110 * k) + " " + (y - 230 * k) + " " + (x + 110 * k) + " " + (y - 40 * k) + " Z", { fill: f, fillStyle: "solid" });
    z.mal("ellipse", [x, y - 130 * k, 190 * k, 170 * k], [f, "#a8352e"]);
    z.rect(x - 124 * k, y - 60 * k, 248 * k, 56 * k, { fill: C.schnee, fillStyle: "solid" });
    for (let i = -5; i <= 5; i++) z.line(x + i * 21 * k, y - 56 * k, x + i * 21 * k, y - 8 * k, { strokeWidth: 2.4, stroke: C.schnee2 });
    z.circ(x, y - 250 * k, 70 * k, { fill: C.schnee, fillStyle: "solid" }); z.mal("circle", [x, y - 250 * k, 60 * k], [C.schnee2], { gap: 6 });
  },
  schal(z, x, y, k) {
    const f = "#3d6fb8", g = "#ffd257";
    z.path("M" + (x - 150 * k) + " " + (y - 260 * k) + " Q" + x + " " + (y - 330 * k) + " " + (x + 150 * k) + " " + (y - 260 * k) + " L" + (x + 130 * k) + " " + (y - 210 * k)
      + " Q" + x + " " + (y - 270 * k) + " " + (x - 130 * k) + " " + (y - 210 * k) + " Z", { fill: f, fillStyle: "solid" });   /* um den Hals */
    z.poly([[x + 40 * k, y - 240 * k], [x + 100 * k, y - 250 * k], [x + 110 * k, y - 50 * k], [x + 50 * k, y - 40 * k]], { fill: f, fillStyle: "solid" });   /* hängendes Ende */
    [-200, -150, -100].forEach(d => z.line(x + 44 * k, y + (d + 2) * k, x + 106 * k, y + (d - 6) * k, { strokeWidth: 12, stroke: g }));
    for (let i = 0; i < 5; i++) z.line(x + (54 + i * 12) * k, y - 42 * k, x + (52 + i * 12) * k, y - 6 * k, { strokeWidth: 4, stroke: f });   /* Fransen */
  },
  handschuh(z, x, y, k) {   /* Fäustling */
    const f = "#3f8a58";
    z.path("M" + (x - 70 * k) + " " + (y - 70 * k) + " L" + (x - 80 * k) + " " + (y - 230 * k) + " Q" + (x - 70 * k) + " " + (y - 330 * k) + " " + (x + 10 * k) + " " + (y - 330 * k)
      + " Q" + (x + 80 * k) + " " + (y - 330 * k) + " " + (x + 80 * k) + " " + (y - 230 * k) + " L" + (x + 74 * k) + " " + (y - 70 * k) + " Z", { fill: f, fillStyle: "solid" });
    z.mal("ellipse", [x, y - 200 * k, 140 * k, 220 * k], [f, "#2f6b45"]);
    z.path("M" + (x - 76 * k) + " " + (y - 190 * k) + " Q" + (x - 150 * k) + " " + (y - 210 * k) + " " + (x - 140 * k) + " " + (y - 260 * k) + " Q" + (x - 120 * k) + " " + (y - 290 * k) + " " + (x - 80 * k) + " " + (y - 250 * k), { fill: f, fillStyle: "solid" });   /* Daumen */
    z.rect(x - 84 * k, y - 80 * k, 166 * k, 70 * k, { fill: C.schnee, fillStyle: "solid" });
    for (let i = -3; i <= 3; i++) z.line(x + i * 22 * k, y - 76 * k, x + i * 22 * k, y - 14 * k, { strokeWidth: 2.4, stroke: C.schnee2 });
  },
  stiefel(z, x, y, k) {
    const f = "#6b4a2a";
    z.path("M" + (x - 90 * k) + " " + (y - 300 * k) + " L" + (x + 10 * k) + " " + (y - 300 * k) + " L" + (x + 20 * k) + " " + (y - 110 * k) + " Q" + (x + 140 * k) + " " + (y - 100 * k) + " " + (x + 150 * k) + " " + (y - 40 * k)
      + " L" + (x + 150 * k) + " " + (y - 10 * k) + " L" + (x - 100 * k) + " " + (y - 10 * k) + " Z", { fill: f, fillStyle: "solid" });
    z.mal("polygon", [[[x - 84 * k, y - 290 * k], [x + 4 * k, y - 290 * k], [x + 14 * k, y - 100 * k], [x + 140 * k, y - 40 * k], [x - 94 * k, y - 20 * k]]], [f, "#4b2b14"]);
    z.rect(x - 104 * k, y - 26 * k, 260 * k, 24 * k, { fill: C.ink, fillStyle: "solid" });   /* Sohle */
    z.ell(x - 40 * k, y - 300 * k, 130 * k, 44 * k, { fill: "#f0e6cf", fillStyle: "solid" }); z.mal("ellipse", [x - 40 * k, y - 300 * k, 120 * k, 36 * k], ["#d9cba8"], { gap: 5 });   /* Fell */
  },
  schlitten(z, x, y, k) {
    const h = "#a5682f";
    z.path("M" + (x - 160 * k) + " " + (y - 20 * k) + " L" + (x + 120 * k) + " " + (y - 20 * k) + " Q" + (x + 180 * k) + " " + (y - 20 * k) + " " + (x + 170 * k) + " " + (y - 80 * k), { strokeWidth: 9, stroke: C.ink });   /* Kufe */
    [-120, -40, 40, 110].forEach(d => z.line(x + d * k, y - 20 * k, x + d * k, y - 90 * k, { strokeWidth: 9, stroke: h }));
    z.rect(x - 150 * k, y - 120 * k, 290 * k, 34 * k, { fill: h, fillStyle: "solid" }); z.mal("rectangle", [x - 146 * k, y - 116 * k, 282 * k, 26 * k], [h, C.holz]);
    z.path("M" + (x + 140 * k) + " " + (y - 100 * k) + " q60 -20 40 -80", { strokeWidth: 4, stroke: C.rot });   /* Seil */
  },
  /* ---------- Weihnachten ---------- */
  kerze(z, x, y, k) {
    glanz(z.ctx, x, y - 300 * k, 120 * k, "255,214,120", .5);
    z.ell(x, y - 20 * k, 220 * k, 40 * k, { fill: C.gelb, fillStyle: "solid" });
    z.rect(x - 44 * k, y - 250 * k, 88 * k, 230 * k, { fill: "#fbf3d9", fillStyle: "solid" }); z.mal("rectangle", [x - 40 * k, y - 246 * k, 80 * k, 222 * k], ["#e9dcb8"], { gap: 7 });
    z.line(x, y - 250 * k, x, y - 270 * k, { strokeWidth: 3 });
    z.path("M" + x + " " + (y - 340 * k) + " Q" + (x + 30 * k) + " " + (y - 290 * k) + " " + x + " " + (y - 266 * k) + " Q" + (x - 30 * k) + " " + (y - 290 * k) + " " + x + " " + (y - 340 * k) + " Z", { fill: C.orange, fillStyle: "solid", stroke: "#c4621a", strokeWidth: 2 });
    z.ell(x, y - 290 * k, 14 * k, 30 * k, { fill: "#ffe48a", fillStyle: "solid", stroke: "none" });
  },
  geschenk(z, x, y, k) {
    const f = "#3d6fb8", b = "#d8432f";
    z.rect(x - 130 * k, y - 200 * k, 260 * k, 190 * k, { fill: f, fillStyle: "solid" }); z.mal("rectangle", [x - 126 * k, y - 196 * k, 252 * k, 182 * k], [f, C.blauD]);
    z.rect(x - 140 * k, y - 236 * k, 280 * k, 44 * k, { fill: f, fillStyle: "solid" });
    z.rect(x - 18 * k, y - 236 * k, 36 * k, 226 * k, { fill: b, fillStyle: "solid" });
    z.ell(x - 50 * k, y - 262 * k, 90 * k, 50 * k, { fill: b, fillStyle: "solid" }); z.ell(x + 50 * k, y - 262 * k, 90 * k, 50 * k, { fill: b, fillStyle: "solid" });
    z.circ(x, y - 252 * k, 30 * k, { fill: b, fillStyle: "solid" });
  },
  keks(z, x, y, k) {
    const f = "#d9a35a";
    z.circ(x, y - 150 * k, 280 * k, { fill: f, fillStyle: "solid", strokeWidth: 3 }); z.mal("circle", [x, y - 150 * k, 266 * k], [f, "#b9813e"], { gap: 7 });
    [[-60, -60], [40, -90], [70, 10], [-20, 40], [-80, 40], [10, -20], [80, -50]].forEach(([a, b]) => z.ell(x + a * k, y - 150 * k + b * k, 26 * k, 20 * k, { fill: "#4b2b14", fillStyle: "solid", strokeWidth: 1.6 }));
  },
  weihnachtsmann(z, x, y, k) {
    const r = "#d8432f";
    z.line(x - 26 * k, y - 60 * k, x - 30 * k, y, { strokeWidth: 16, stroke: C.ink }); z.line(x + 26 * k, y - 60 * k, x + 30 * k, y, { strokeWidth: 16, stroke: C.ink });
    z.poly([[x - 90 * k, y - 50 * k], [x + 90 * k, y - 50 * k], [x + 70 * k, y - 210 * k], [x - 70 * k, y - 210 * k]], { fill: r, fillStyle: "solid" });
    z.mal("polygon", [[[x - 84 * k, y - 54 * k], [x + 84 * k, y - 54 * k], [x + 66 * k, y - 206 * k], [x - 66 * k, y - 206 * k]]], [r, "#a8352e"]);
    z.rect(x - 86 * k, y - 120 * k, 172 * k, 24 * k, { fill: C.ink, fillStyle: "solid" }); z.rect(x - 16 * k, y - 124 * k, 32 * k, 32 * k, { fill: C.gelb, fillStyle: "solid", strokeWidth: 2 });
    z.rect(x - 92 * k, y - 60 * k, 184 * k, 18 * k, { fill: C.schnee, fillStyle: "solid" });
    gesicht(z, x, y - 260 * k, 84 * k);
    z.path("M" + (x - 46 * k) + " " + (y - 250 * k) + " Q" + (x - 50 * k) + " " + (y - 160 * k) + " " + x + " " + (y - 150 * k) + " Q" + (x + 50 * k) + " " + (y - 160 * k) + " " + (x + 46 * k) + " " + (y - 250 * k)
      + " Q" + x + " " + (y - 226 * k) + " " + (x - 46 * k) + " " + (y - 250 * k) + " Z", { fill: C.schnee, fillStyle: "solid", strokeWidth: 2.4 });   /* Bart */
    z.path("M" + (x - 50 * k) + " " + (y - 290 * k) + " Q" + (x + 10 * k) + " " + (y - 380 * k) + " " + (x + 90 * k) + " " + (y - 330 * k) + " L" + (x + 50 * k) + " " + (y - 290 * k) + " Z", { fill: r, fillStyle: "solid" });   /* Mütze */
    z.rect(x - 56 * k, y - 302 * k, 112 * k, 20 * k, { fill: C.schnee, fillStyle: "solid" }); z.circ(x + 92 * k, y - 330 * k, 30 * k, { fill: C.schnee, fillStyle: "solid" });
  },
  esel(z, x, y, k) {   /* grau, lange Ohren */
    const f = "#9a9aa4", d = "#6f6f7a";
    [-58, -36, 34, 56].forEach(e => z.line(x + e * k, y - 56 * k, x + e * k + r(-4, 4), y, { strokeWidth: 11, stroke: d }));
    z.ell(x, y - 84 * k, 166 * k, 82 * k, { fill: f, fillStyle: "solid" }); z.mal("ellipse", [x, y - 84 * k, 156 * k, 72 * k], [f, d]);
    z.path("M" + (x - 80 * k) + " " + (y - 96 * k) + " q-20 30 -10 60", { strokeWidth: 5, stroke: d });
    z.poly([[x + 50 * k, y - 104 * k], [x + 84 * k, y - 170 * k], [x + 110 * k, y - 156 * k], [x + 84 * k, y - 92 * k]], { fill: f, fillStyle: "solid" });
    z.ell(x + 116 * k, y - 160 * k, 70 * k, 42 * k, { fill: f, fillStyle: "solid" }); z.ell(x + 140 * k, y - 152 * k, 28 * k, 26 * k, { fill: "#cfcfd6", fillStyle: "solid" });
    z.ell(x + 84 * k, y - 210 * k, 18 * k, 80 * k, { fill: f, fillStyle: "solid" }); z.ell(x + 104 * k, y - 206 * k, 18 * k, 80 * k, { fill: f, fillStyle: "solid" });
    z.circ(x + 112 * k, y - 168 * k, 7 * k, { fill: C.ink, fillStyle: "solid" });
  },
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

function flocke(z, x, y, k, c) { const s = 26 * k; [[0, -s, 0, s], [-s * .87, -s / 2, s * .87, s / 2], [-s * .87, s / 2, s * .87, -s / 2]].forEach(l => z.line(x + l[0], y + l[1], x + l[2], y + l[3], { strokeWidth: 6, stroke: c || "#4f8fd0" })); }

/* Zeichnung je Wort (Schlüssel = id in woerter.csv; Raster 400 × 400) */
const BILDER = {
  schnee: z => { flocke(z, 110, 110, 1.6); flocke(z, 290, 90, 1.1); flocke(z, 250, 220, 1.9); flocke(z, 90, 250, 1.2); flocke(z, 190, 170, .9); z.path("M20 380 Q120 300 220 340 Q300 300 380 380 Z", { fill: C.schnee, fillStyle: "solid", strokeWidth: 3 }); },
  schneemann: z => FIG_LW.schneemann(z, 200, 392, 1.02),
  muetze: z => FIG_LW.muetze(z, 200, 340, 1.05),
  schal: z => FIG_LW.schal(z, 190, 360, 1.05),
  handschuh: z => FIG_LW.handschuh(z, 220, 375, 1.05),
  stiefel: z => FIG_LW.stiefel(z, 170, 370, 1.05),
  schlitten: z => FIG_LW.schlitten(z, 190, 300, 1.05),
  tanne: z => FIG.tanne(z, 200, 390, 1.65),
  stern: z => FIG.stern(z, 200, 200, 2.3, true),
  kerze: z => FIG_LW.kerze(z, 200, 380, 1),
  geschenk: z => FIG_LW.geschenk(z, 200, 360, 1.1),
  keks: z => FIG_LW.keks(z, 200, 350, 1.1),
  weihnachtsmann: z => FIG_LW.weihnachtsmann(z, 200, 395, 1),
  krippe: z => FIG.krippe(z, 200, 360, 1.6),
  stall: z => FIG.stall(z, 200, 372, .6, { offen: true }),
  baby: z => FIG.baby(z, 200, 220, 2.4),
  esel: z => FIG_LW.esel(z, 140, 350, 1.25),
  hirte: z => FIG.hirte(z, 175, 392, 1.65),
  hund: z => FIG_LW.hund(z, 150, 345, 1.05),
  katze: z => FIG_LW.katze(z, 150, 340, 1.15),
  maus: z => FIG_LW.maus(z, 175, 320, 1.1),
  kuh: z => FIG.kuh(z, 150, 350, 1.25),
  pferd: z => FIG.pferd(z, 150, 375, 1.2),
  schaf: z => FIG.schaf(z, 175, 330, 2.6),
  huhn: z => FIG.huhn(z, 200, 345, 2.5),
  schwein: z => FIG_LW.schwein(z, 140, 330, 1.15),
  ente: z => FIG_LW.ente(z, 170, 330, 1.2),
  fisch: z => FIG_LW.fisch(z, 180, 310, 1.1),
  vogel: z => FIG_LW.vogel(z, 190, 340, 1.25),
  hase: z => FIG_LW.hase(z, 150, 365, 1.15)
};
const BILD = {};
function bildURL(key) {
  if (BILD[key]) return BILD[key];
  const c = document.createElement("canvas"); c.width = c.height = 300; const ctx = c.getContext("2d");
  ctx.setTransform(.75, 0, 0, .75, 0, 0); ctx.lineCap = "round"; ctx.lineJoin = "round";
  SEED = 300 + key.length * 13 + key.charCodeAt(0); BILDER[key](Z(ctx)); korn(ctx, .16);
  return (BILD[key] = c.toDataURL("image/png"));
}
