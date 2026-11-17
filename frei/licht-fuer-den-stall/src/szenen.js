
/* ---------- Szenen: Ebenen (f = Parallaxe-Faktor) ---------- */
const XL = -MARGIN_X, XR = W + MARGIN_X, YT = -MARGIN_Y, YB = H + MARGIN_Y;
function himmel(z, ctx, o) {
  o = o || {};
  const g = ctx.createLinearGradient(0, YT, 0, H); g.addColorStop(0, "#0b1430"); g.addColorStop(1, "#22386a");
  ctx.fillStyle = g; ctx.fillRect(XL, YT, XR - XL, YB - YT);
  z.mal("rectangle", [XL, YT, XR - XL, 760], [C.nacht2, C.nacht], { gap: 7, fw: 3.4 });
  [[260, 150, 420, 90], [900, 110, 520, 100], [1380, 220, 380, 80], [560, 300, 300, 60]].forEach(w => z.mal("ellipse", w, ["#33497d", "#2a3d6c"], { gap: 6 }));
  if (o.sterne) [[90, 80], [240, 190], [380, 64], [520, 160], [660, 56], [1010, 70], [1200, 176], [1380, 72], [1530, 160], [70, 300], [600, 280], [1490, 330], [1050, 240], [200, 400], [1300, 400], [760, 380]].forEach(p => FIG.sternchen(z, p[0], p[1], 1.3));
  if (o.stern) FIG.stern(z, o.stern[0], o.stern[1], o.stern[2] || 1.4, true);
}
function huegel(z, y0, haeuser) {
  const pts = [[XL, y0 + 40]]; for (let x = XL; x <= XR; x += 120) pts.push([x, y0 + Math.sin(x / 260) * 36 + r(-10, 10)]);
  pts.push([XR, YB], [XL, YB]);
  z.poly(pts, { fill: C.schnee2, fillStyle: "solid", strokeWidth: 3 }); z.mal("polygon", [pts], [C.schneeS, "#b7c7e3"], { gap: 8 });
  (haeuser || []).forEach(h => FIG.haus(z, h[0], h[1], h[2]));
}
function schneeFeld(z, y0, amp) {
  const pts = [[XL, y0 + 20]]; for (let x = XL; x <= XR; x += 100) pts.push([x, y0 + Math.sin(x / 190) * (amp || 22) + r(-6, 6)]);
  pts.push([XR, YB], [XL, YB]);
  z.poly(pts, { fill: C.schnee, fillStyle: "solid", strokeWidth: 3 }); z.mal("polygon", [pts], ["#dbe5f4"], { gap: 9 });
}
function vorneSchnee(z, zaun) {
  const pts = [[XL, 930], [200, 900], [420, 950], [700, 990], [1000, 985], [1250, 960], [1500, 930], [XR, 900], [XR, YB], [XL, YB]];
  z.poly(pts, { fill: C.schnee, fillStyle: "solid", strokeWidth: 3 }); z.mal("polygon", [pts], ["#d6e1f2"], { gap: 10 });
  if (zaun === false) return;
  for (let x = -60; x < 420; x += 90) { z.line(x, 990, x + r(-6, 6), 850, { strokeWidth: 13, stroke: "#4b3020" }); z.path("M" + (x - 12) + " 852 q12 -12 24 0", { stroke: C.schnee, strokeWidth: 8 }); }
  z.line(-90, 880, 430, 890, { strokeWidth: 9, stroke: "#4b3020" }); z.line(-90, 930, 430, 938, { strokeWidth: 9, stroke: "#4b3020" });
  for (let x = 1500; x < 1720; x += 90) { z.line(x, 1000, x + r(-6, 6), 870, { strokeWidth: 13, stroke: "#4b3020" }); z.path("M" + (x - 12) + " 872 q12 -12 24 0", { stroke: C.schnee, strokeWidth: 8 }); }
  z.line(1470, 900, 1720, 892, { strokeWidth: 9, stroke: "#4b3020" });
}
function wand(z, ctx, fensterNacht) {
  ctx.fillStyle = "#6e4526"; ctx.fillRect(XL, YT, XR - XL, YB - YT);
  z.mal("rectangle", [XL, YT, XR - XL, 800 + MARGIN_Y], ["#8a5a32", "#6e4526"], { gap: 6, fw: 3.6 });
  for (let x = XL; x < XR; x += 110) z.line(x + r(-4, 4), YT, x + r(-4, 4), 780, { strokeWidth: 3, stroke: C.holzD });
  z.rect(720, 120, 170, 130, { fill: "#16203f", fillStyle: "solid", strokeWidth: 5 });
  if (fensterNacht) FIG.sternchen(z, 760, 160, 1.4);
  z.line(805, 122, 805, 248, { strokeWidth: 5, stroke: C.holzD }); z.line(722, 185, 888, 185, { strokeWidth: 5, stroke: C.holzD });
  z.rect(80, 220, 260, 110, { fill: "#4b2b14", fillStyle: "hachure", hachureGap: 14, hachureAngle: 90 });
  z.path("M90 230 q40 -40 70 0 q40 -46 80 0 q30 -36 80 4", { fill: C.stroh, fillStyle: "solid", strokeWidth: 2.4 });
}
function boden(z) {
  const pts = [[XL, 760], [XR, 740], [XR, YB], [XL, YB]];
  z.poly(pts, { fill: "#d9a83a", fillStyle: "solid", strokeWidth: 3 }); z.mal("polygon", [pts], [C.stroh, "#c9962e"], { gap: 5 });
  for (let i = 0; i < 70; i++) { const x = r(-60, 1660), y = r(780, 1060); z.line(x, y, x + r(-26, 26), y + r(-12, 4), { strokeWidth: 2.4, stroke: "#a87a1c" }); }
}
function pfosten(z) {
  z.rect(-80, YT, 70, YB - YT, { fill: "#4b2b14", fillStyle: "solid" }); z.mal("rectangle", [-80, YT, 70, YB - YT], ["#5d3a1e"], { gap: 6 });
  z.rect(1610, YT, 70, YB - YT, { fill: "#4b2b14", fillStyle: "solid" }); z.mal("rectangle", [1610, YT, 70, YB - YT], ["#5d3a1e"], { gap: 6 });
  z.rect(-100, -40, 1800, 60, { fill: "#4b2b14", fillStyle: "solid" });
}
function spur(z, x, y, winkel) {   /* ein Fußabdruck, Zehen in Laufrichtung */
  const c = Math.cos(winkel), s = Math.sin(winkel);
  z.ell(x, y, 30 + 12 * Math.abs(c), 30 + 12 * Math.abs(s), { fill: "#9fb3d6", fillStyle: "solid", stroke: "#7f95bd", strokeWidth: 2 });
  [-1, 0, 1].forEach(d => z.circ(x + c * 26 - s * d * 11, y + s * 26 + c * d * 11, 11, { fill: "#9fb3d6", fillStyle: "solid", stroke: "#7f95bd", strokeWidth: 1.6 }));
}
/* Spuren-Weg in Station 1: drei Abschnitte → ↑ → */
const SPUR_WEG = [[[680, 905], [1000, 905]], [[1040, 878], [1060, 700]], [[1100, 680], [1420, 680]]];

const SZENEN = {
  karte: { schnee: true, ebenen: [
    { id: "himmel", f: .03, res: 1, draw: (z, ctx) => himmel(z, ctx) },
    { id: "berge", f: .08, res: 1, draw: z => huegel(z, 560, [[180, 600, .7], [1460, 580, .6]]) },
    { id: "weg", f: .16, draw(z) {
      schneeFeld(z, 640, 18);
      const p = KARTE_PUNKTE; z.curve(p.map(q => [q[0], q[1] + 20]), { stroke: "#b9c9e2", strokeWidth: 46, roughness: 1.2 }); z.curve(p.map(q => [q[0], q[1] + 20]), { stroke: "#dfe8f6", strokeWidth: 26, roughness: 1.6 });
      FIG.tanne(z, 90, 760, 1.2); FIG.baum(z, 1560, 800, 1.1); FIG.tanne(z, 540, 690, .9); FIG.tanne(z, 1180, 640, .8);
      FIG.stall(z, 1470, 590, .42, { offen: false });
    } },
    { id: "vorne", f: .45, draw: z => vorneSchnee(z, false) }
  ] },
  weg: { schnee: true, ebenen: [
    { id: "himmel", f: .03, res: 1, draw: (z, ctx) => himmel(z, ctx) },
    { id: "berge", f: .08, res: 1, draw: z => huegel(z, 560, [[150, 600, .8], [1420, 570, .7], [1520, 590, .6]]) },
    { id: "mitte", f: .16, draw(z) {
      schneeFeld(z, 620, 14); FIG.baum(z, 1530, 660, 1.1); FIG.tanne(z, 1600, 650, 1.0); FIG.tanne(z, 560, 640, .9);
      SPUR_WEG.forEach(seg => { const [a, b] = seg, n = 6, w = Math.atan2(b[1] - a[1], b[0] - a[0]); for (let i = 0; i < n; i++) { const t = i / (n - 1), x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t, q = (i % 2 ? 1 : -1) * 16; spur(z, x - Math.sin(w) * q, y + Math.cos(w) * q, w); } });
    } },
    { id: "wegweiser", f: .26, draw(z) {
      z.line(200, 940, 206, 660, { strokeWidth: 16, stroke: "#5a3418" });
      z.poly([[120, 690], [300, 690], [330, 720], [300, 750], [120, 750]], { fill: C.holz2, fillStyle: "solid", strokeWidth: 4 });
      z.poly([[90, 770], [110, 740], [290, 740], [290, 800], [110, 800]], { fill: C.holz2, fillStyle: "solid", strokeWidth: 4 });
      z.path("M110 682 q90 -16 196 2", { stroke: C.schnee, strokeWidth: 8 });
    } },
    { id: "figuren", f: .36, draw(z) { FIG.frau(z, 420, 960, 1.05); FIG.mannMitLaterne(z, 540, 965, 1.1); } },
    { id: "vorne", f: .55, draw: z => vorneSchnee(z) }
  ] },
  draussen: { schnee: true, ebenen: [
    { id: "himmel", f: .03, res: 1, draw: (z, ctx) => himmel(z, ctx) },
    { id: "berge", f: .08, res: 1, draw: z => huegel(z, 600, [[150, 640, .8], [1420, 610, .7], [1520, 630, .6]]) },
    { id: "mitte", f: .16, draw(z) { schneeFeld(z, 740); FIG.baum(z, 300, 790, 1.25); FIG.tanne(z, 470, 780, 1.1); FIG.tanne(z, 1460, 770, 1.3); FIG.tanne(z, 1590, 790, 1.05); } },
    { id: "stall", f: .26, draw(z) {
      z.ell(840, 806, 640, 60, { fill: "#cfdbee", fillStyle: "solid", stroke: "none" });
      FIG.stall(z, 840, 804, 1);
      z.rect(670, 600, 140, 204, { fill: C.holzD, fillStyle: "solid" });
    } },
    { id: "figuren", f: .36, draw(z) {
      for (let i = 0; i < 9; i++) { const x = 1620 - i * 46, y = 900 + (i % 2 ? 10 : -6); z.ell(x, y, 22, 10, { fill: "#a9bbd8", fillStyle: "solid", stroke: "none" }); }
      FIG.frau(z, 1150, 880, 1.05); FIG.mannMitLaterne(z, 1270, 884, 1.1);
    } },
    { id: "vorne", f: .55, draw: z => vorneSchnee(z) }
  ] },
  drinnen: { dunkel: .9, ebenen: [
    { id: "wand", f: .04, res: 1, draw: (z, ctx) => { wand(z, ctx); FIG.laterne(z, 1240, 80, .9); } },
    { id: "boden", f: .1, res: 1, draw: z => boden(z) },
    { id: "tiere", f: .2, draw(z) {
      FIG.pferd(z, 380, 770, 1.3, true); FIG.kuh(z, 1100, 770, 1.25, true);
      z.rect(1360, 640, 140, 124, { fill: C.holz2, fillStyle: "solid" }); z.line(1360, 702, 1500, 702, { strokeWidth: 3, stroke: C.holzD });
      FIG.huhn(z, 1420, 640, .95, true); FIG.eimer(z, 650, 770, .9);
    } },
    { id: "schafe", f: .3, draw(z) { TIERE_INNEN.filter(t => t.typ === "schaf").forEach(t => FIG.schaf(z, t.x, t.y, t.s, true, t.sp)); } },
    { id: "pfosten", f: .5, draw: z => pfosten(z) }
  ] },
  frau: { ebenen: [
    { id: "wand", f: .04, res: 1, draw: (z, ctx) => { wand(z, ctx); FIG.laterne(z, 1240, 80, .9); glanz(ctx, 1240, 200, 420, "255,200,110", .35); } },
    { id: "boden", f: .1, res: 1, draw: z => boden(z) },
    { id: "tiere", f: .2, draw(z) {
      FIG.pferd(z, 300, 770, 1.3); FIG.kuh(z, 1130, 770, 1.25);
      z.rect(1400, 640, 140, 124, { fill: C.holz2, fillStyle: "solid" }); z.line(1400, 702, 1540, 702, { strokeWidth: 3, stroke: C.holzD }); FIG.huhn(z, 1460, 640, .95);
    } },
    { id: "frau", f: .28, draw(z) { FIG.stroh(z, 800, 950, 1.3); FIG.frau(z, 800, 930, 1.35); } },
    { id: "schafe", f: .36, draw(z) { FIG.schaf(z, 520, 960, 1, false); FIG.schaf(z, 1060, 980, 1, false, true); FIG.schaf(z, 1220, 960, .9, false, true); } },
    { id: "pfosten", f: .5, draw: z => pfosten(z) }
  ] },
  himmel: { ebenen: [
    { id: "nacht", f: .03, res: 1, draw: (z, ctx) => himmel(z, ctx) },
    { id: "berge", f: .08, res: 1, draw: z => huegel(z, 660, [[150, 700, .8], [1460, 690, .7]]) },
    { id: "sterne", f: .12, res: 1, draw() { } },
    { id: "stall", f: .24, draw(z, ctx) { schneeFeld(z, 820, 10); glanz(ctx, 800, 820, 240, "255,200,110", .45); FIG.stall(z, 800, 900, .62, { licht: true }); FIG.tanne(z, 360, 880, 1); FIG.tanne(z, 1280, 870, 1.1); } },
    { id: "vorne", f: .5, draw: z => vorneSchnee(z) }
  ] },
  felder: { schnee: true, ebenen: [
    { id: "nacht", f: .03, res: 1, draw: (z, ctx) => himmel(z, ctx, { sterne: true, stern: [1330, 150, 1.5] }) },
    { id: "feld", f: .12, draw(z, ctx) {
      schneeFeld(z, 380, 30);
      z.ell(780, 960, 260, 90, { fill: "#cfe3f5", fillStyle: "solid", strokeWidth: 4 }); z.mal("ellipse", [780, 960, 240, 76], ["#a9cbe8"], { gap: 9 });   /* Teich */
      [[420, 470, .9], [500, 500, .8], [360, 520, .8], [560, 470, .7]].forEach(t => FIG.tanne(z, t[0], t[1], t[2]));   /* Wald */
      [[1330, 800, 70], [1390, 820, 50], [1280, 830, 46]].forEach(s => z.ell(s[0], s[1], s[2] * 1.6, s[2], { fill: "#9aa3b2", fillStyle: "solid", strokeWidth: 4 }));   /* Steine */
      FELD_WEGE.forEach(w => { z.curve(w, { stroke: "#b9c9e2", strokeWidth: 40, roughness: 1.2 }); z.curve(w, { stroke: "#e6eef9", strokeWidth: 22, roughness: 1.6 }); });
      glanz(ctx, 1330, 480, 200, "255,200,110", .4); FIG.stall(z, 1330, 520, .4, { offen: true });
    } },
    { id: "vorne", f: .45, draw: z => vorneSchnee(z, false) }
  ] },
  krippe: { dunkel: .88, ebenen: [
    { id: "wand", f: .04, res: 1, draw: (z, ctx) => { wand(z, ctx, true); FIG.laterne(z, 1240, 80, .9); } },
    { id: "boden", f: .1, res: 1, draw: z => boden(z) },
    { id: "dinge", f: .2, draw(z) {
      FIG.pferd(z, 1250, 760, 1.15, false);
      z.rect(500, 700, 150, 110, { fill: C.holz2, fillStyle: "solid" }); z.line(500, 750, 650, 750, { strokeWidth: 3, stroke: C.holzD });   /* Kiste */
      FIG.eimer(z, 380, 800, 1.1);
      z.line(1010, 820, 960, 520, { strokeWidth: 8, stroke: "#6b4a2a" }); [-1, 0, 1].forEach(d => z.line(960 + d * 16, 520, 952 + d * 22, 450, { strokeWidth: 5, stroke: "#8f98a8" }));   /* Heugabel */
      z.poly([[1460, 820], [1540, 820], [1560, 700], [1500, 660], [1440, 700]], { fill: "#c9b48a", fillStyle: "solid" });   /* Sack */
      FIG.krippe(z, 760, 880, 1.25, false);
      FIG.stroh(z, 220, 960, 1.2);
    } },
    { id: "frau", f: .3, draw(z) { FIG.mann(z, 1080, 960, 1.15); FIG.frau(z, 560, 975, 1.25); } },
    { id: "pfosten", f: .5, draw: z => pfosten(z) }
  ] },
  finale: { schnee: true, ebenen: [
    { id: "nacht", f: .03, res: 1, draw: (z, ctx) => himmel(z, ctx, { sterne: true }) },
    { id: "berge", f: .08, res: 1, draw: z => huegel(z, 640, [[150, 680, .8], [1460, 670, .7]]) },
    { id: "stall", f: .2, draw(z, ctx) {
      schneeFeld(z, 860, 8);
      z.rect(380, 420, 840, 480, { fill: "#e6bd7c", fillStyle: "solid", strokeWidth: 4 }); z.mal("rectangle", [386, 426, 828, 468], ["#f0cc8a", "#e0b26a"], { gap: 7 });
      z.rect(386, 830, 828, 70, { fill: C.stroh, fillStyle: "solid", strokeWidth: 2 });
      glanz(ctx, 800, 560, 520, "255,200,110", .45); FIG.laterne(z, 800, 450, 1);
      FIG.pferd(z, 520, 860, 1.0, true); FIG.kuh(z, 760, 870, .9, true); FIG.krippe(z, 960, 890, 1.0, true);
      FIG.schaf(z, 480, 890, .7, true); FIG.schaf(z, 640, 900, .7, true, true); FIG.huhn(z, 420, 860, .7, true);
      FIG.frau(z, 1090, 890, 1.15); FIG.mann(z, 1170, 892, 1.15);
      z.poly([[300, 432], [800, 190], [1300, 432], [1220, 432], [800, 262], [380, 432]], { fill: C.schnee, fillStyle: "solid", strokeWidth: 3 });
      z.poly([[380, 430], [800, 262], [1220, 430]], { fill: C.dach, fillStyle: "solid", strokeWidth: 3 }); z.mal("polygon", [[[396, 426], [800, 270], [1204, 426]]], ["#6d3c1c"], { gap: 7 });
      z.rect(356, 416, 48, 494, { fill: C.holzD, fillStyle: "solid" }); z.rect(1196, 416, 48, 494, { fill: C.holzD, fillStyle: "solid" });
    } },
    { id: "hirten", f: .32, draw(z) { FIG.hirte(z, 1340, 940, 1.1, { c: "#6f7f8f" }); FIG.hirte(z, 1470, 950, 1.1, { c: "#a0563b" }); FIG.hund(z, 1300, 975, .8); FIG.schaf(z, 1530, 985, .8); } },
    { id: "vorne", f: .55, draw: z => vorneSchnee(z) }
  ] }
};
/* Wegkarte: Punkte der Stationen (Entwurfs-Koordinaten) */
const KARTE_PUNKTE = [[160, 900], [400, 790], [640, 860], [880, 720], [1110, 800], [1300, 690], [1470, 600]];
/* Station 2 drinnen: Tiere */
const TIERE_INNEN = [
  { typ: "pferd", ebene: "tiere", x: 400, y: 770, w: 330, h: 270 },
  { typ: "kuh", ebene: "tiere", x: 1140, y: 770, w: 330, h: 230 },
  { typ: "huhn", ebene: "tiere", x: 1420, y: 640, w: 150, h: 120 },
  { typ: "schaf", ebene: "schafe", x: 560, y: 865, s: .9, w: 150, h: 110 },
  { typ: "schaf", ebene: "schafe", x: 780, y: 900, s: .95, sp: true, w: 150, h: 110 },
  { typ: "schaf", ebene: "schafe", x: 990, y: 865, s: .9, w: 150, h: 110 },
  { typ: "schaf", ebene: "schafe", x: 300, y: 920, s: .85, w: 150, h: 110 },
  { typ: "schaf", ebene: "schafe", x: 1230, y: 915, s: .9, sp: true, w: 150, h: 110 }
];
/* Station 5: Wege über die Felder. Gabeln mit richtigem Abzweig (gut) und Sackgasse (falsch) */
const FELD_START = [190, 930];
const GABELN = [
  { an: [420, 840], gut: [[420, 840], [530, 760], [640, 700]], falsch: [[420, 840], [560, 900], [700, 955]], wo: "Teich" },
  { an: [640, 700], gut: [[640, 700], [800, 660], [960, 620]], falsch: [[640, 700], [560, 600], [470, 540]], wo: "Wald" },
  { an: [960, 620], gut: [[960, 620], [1150, 560], [1310, 520]], falsch: [[960, 620], [1140, 720], [1300, 800]], wo: "Steine" }
];
const FELD_WEGE = [[FELD_START, [300, 890], [420, 840]]].concat(...GABELN.map(g => [g.gut, g.falsch]));
