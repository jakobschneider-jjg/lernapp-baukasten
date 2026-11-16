/* ==========================================================================
   WEIHNACHTEN IM STALL – Adventskalender-App (16 Türen, 4 Niveaustufen)
   Grundlage: Astrid Lindgren, „Weihnachten im Stall“ (Oetinger). Alle Texte sind
   eigene, vereinfachte Nacherzählungen; alle Bilder sind eigene Zeichnungen.
   Gebärden: Feld sign: "WORT" – Bilder kommen beim Bauen aus einem LOKALEN Ordner
   (--signs), nie aus dem Repository.
   ========================================================================== */

/* ---------- 1. Zeichnungen (flach, kräftige Kontur, ohne Verläufe und ohne ids) ---------- */
const K = 'stroke="#1b2636" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"';
const SKIN = "#f4cfa6";
function at(x, y, s, frag, o) {
  o = o || {};
  return '<g transform="translate(' + x + ',' + y + ')' + (o.rot ? ' rotate(' + o.rot + ')' : '') + ' scale(' + (o.flip ? -s : s) + ',' + s + ')">' + frag + '</g>';
}
function face(cx, cy, r, o) {
  o = o || {};
  const e = r * .36, ey = cy - r * .08;
  const eyes = o.sleep
    ? '<path d="M' + (cx - e - 3) + ',' + ey + ' q3,3 6,0 M' + (cx + e - 3) + ',' + ey + ' q3,3 6,0" fill="none" stroke="#1b2636" stroke-width="2" stroke-linecap="round"/>'
    : '<circle cx="' + (cx - e) + '" cy="' + ey + '" r="1.9" fill="#1b2636"/><circle cx="' + (cx + e) + '" cy="' + ey + '" r="1.9" fill="#1b2636"/>';
  return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + SKIN + '" ' + K + '/>' + eyes
    + '<path d="M' + (cx - r * .3) + ',' + (cy + r * .42) + ' q' + (r * .3) + ',' + (r * .28) + ' ' + (r * .6) + ',0" fill="none" stroke="#1b2636" stroke-width="2" stroke-linecap="round"/>';
}
function star8(r, fill) {
  const p = []; for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8 - Math.PI / 2, q = i % 2 ? r * .45 : r; p.push((q * Math.cos(a)).toFixed(1) + "," + (q * Math.sin(a)).toFixed(1)); }
  return '<polygon points="' + p.join(" ") + '" fill="' + (fill || "#ffd94a") + '" stroke="#b98600" stroke-width="2.5" stroke-linejoin="round"/>';
}
const ART = {
  frau(o) {
    o = o || {};
    return '<path d="M-15,-12 L15,-12 L24,50 L-24,50 Z" fill="#3d3a52" ' + K + '/>'
      + '<circle cx="0" cy="-28" r="17" fill="#ebe6d8" ' + K + '/>' + face(0, -27, 11.5, o)
      + '<path d="M-16,-15 L16,-15 L21,6 L0,-3 L-21,6 Z" fill="#ebe6d8" ' + K + '/>'
      + (o.baby ? at(2, 12, .62, ART.baby()) : "")
      + (o.arm ? '<path d="M14,-4 L40,-14" fill="none" stroke="#1b2636" stroke-width="11" stroke-linecap="round"/><path d="M14,-4 L40,-14" fill="none" stroke="#3d3a52" stroke-width="6" stroke-linecap="round"/><circle cx="42" cy="-15" r="5" fill="' + SKIN + '" ' + K + '/>' : "")
      + (o.cup ? '<path d="M14,-2 L26,-16" fill="none" stroke="#1b2636" stroke-width="11" stroke-linecap="round"/><path d="M14,-2 L26,-16" fill="none" stroke="#3d3a52" stroke-width="6" stroke-linecap="round"/><path d="M17,-27 h16 l-2,12 h-12 Z" fill="#fff" ' + K + '/>' : "");
  },
  mann(o) {
    o = o || {};
    return '<rect x="-14" y="20" width="12" height="30" fill="#7a4f2a" ' + K + '/><rect x="2" y="20" width="12" height="30" fill="#7a4f2a" ' + K + '/>'
      + '<path d="M-17,-13 L17,-13 L19,25 L-19,25 Z" fill="#2f5d9b" ' + K + '/>' + face(0, -27, 12)
      + '<path d="M-13.5,-30 A13.5,13 0 0 1 13.5,-30 Z" fill="#1f3a66" ' + K + '/>'
      + (o.lat ? '<path d="M15,-6 L33,-24" fill="none" stroke="#1b2636" stroke-width="11" stroke-linecap="round"/><path d="M15,-6 L33,-24" fill="none" stroke="#2f5d9b" stroke-width="6" stroke-linecap="round"/>' + at(35, -4, .55, ART.laterne({ glow: true })) : "");
  },
  mutter() {
    return '<circle cx="0" cy="-45" r="7" fill="#7a4a22" ' + K + '/><circle cx="0" cy="-29" r="15.5" fill="#7a4a22" ' + K + '/>'
      + '<path d="M-15,-12 L15,-12 L24,50 L-24,50 Z" fill="#c9463d" ' + K + '/>' + face(0, -26, 11.5);
  },
  kind() {
    return '<rect x="-11" y="22" width="9" height="28" fill="#44506a" ' + K + '/><rect x="2" y="22" width="9" height="28" fill="#44506a" ' + K + '/>'
      + '<path d="M-14,-6 L14,-6 L15,26 L-15,26 Z" fill="#3f8fd4" ' + K + '/>' + face(0, -22, 14)
      + '<path d="M-15,-24 A15,15 0 0 1 15,-24 Q0,-32 -15,-24 Z" fill="#f2c84b" ' + K + '/>';
  },
  baby(o) {
    return '<ellipse cx="6" cy="8" rx="30" ry="17" fill="#fff" ' + K + '/><path d="M-12,-4 Q8,10 30,-2" fill="none" stroke="#c8d0dc" stroke-width="2.5"/>'
      + face(-22, 0, 13, { sleep: true });
  },
  hirte(o) {
    o = o || {};
    return '<path d="M22,50 L22,-46" fill="none" stroke="#1b2636" stroke-width="7" stroke-linecap="round"/><path d="M22,50 L22,-46" fill="none" stroke="#9a6a3c" stroke-width="3" stroke-linecap="round"/>'
      + '<rect x="-12" y="24" width="10" height="26" fill="#4a3b2c" ' + K + '/><rect x="2" y="24" width="10" height="26" fill="#4a3b2c" ' + K + '/>'
      + '<path d="M-16,-12 L16,-12 L21,30 L-21,30 Z" fill="' + (o.c || "#8b7355") + '" ' + K + '/>' + face(0, -26, 12)
      + '<ellipse cx="0" cy="-35" rx="19" ry="4.5" fill="#4a3b2c" ' + K + '/><path d="M-11,-36 Q-11,-49 0,-49 Q11,-49 11,-36 Z" fill="#4a3b2c" ' + K + '/>'
      + (o.point ? '<path d="M-14,-4 L-42,-24" fill="none" stroke="#1b2636" stroke-width="11" stroke-linecap="round"/><path d="M-14,-4 L-42,-24" fill="none" stroke="' + (o.c || "#8b7355") + '" stroke-width="6" stroke-linecap="round"/>' : "");
  },
  pferd() {
    return '<path d="M-36,0 Q-54,10 -47,38" fill="none" stroke="#1b2636" stroke-width="12" stroke-linecap="round"/><path d="M-36,0 Q-54,10 -47,38" fill="none" stroke="#f0dba8" stroke-width="7" stroke-linecap="round"/>'
      + [-29, -15, 13, 26].map(x => '<rect x="' + x + '" y="16" width="10" height="34" fill="#8f5530" ' + K + '/>').join("")
      + '<ellipse cx="0" cy="5" rx="39" ry="22" fill="#a8683c" ' + K + '/>'
      + '<path d="M17,-9 L39,-44 L54,-36 L37,6 Z" fill="#a8683c" ' + K + '/>'
      + '<path d="M47,-52 l4,-11 l6,10 Z" fill="#a8683c" ' + K + '/>'
      + '<ellipse cx="55" cy="-38" rx="17" ry="10.5" transform="rotate(28 55 -38)" fill="#a8683c" ' + K + '/>'
      + '<path d="M61,-40 l8,5 l-3,5 l-7,-4 Z" fill="#fff" stroke="#1b2636" stroke-width="2" stroke-linejoin="round"/>'
      + '<circle cx="54" cy="-42" r="2.2" fill="#1b2636"/>'
      + '<path d="M38,-48 L47,-50 L26,-6 L12,-10 Z" fill="#f0dba8" ' + K + '/>';
  },
  kuh() {
    return '<path d="M-38,-4 Q-50,10 -46,30" fill="none" stroke="#1b2636" stroke-width="5" stroke-linecap="round"/>'
      + [-29, -15, 13, 26].map(x => '<rect x="' + x + '" y="16" width="10" height="34" fill="#9a5530" ' + K + '/>').join("")
      + '<path d="M-22,24 q8,14 18,0 Z" fill="#f1b9b0" ' + K + '/>'
      + '<ellipse cx="0" cy="5" rx="40" ry="22" fill="#b9683c" ' + K + '/>'
      + '<ellipse cx="-12" cy="0" rx="13" ry="9" fill="#f6ead6"/><ellipse cx="17" cy="11" rx="9" ry="6" fill="#f6ead6"/>'
      + '<path d="M36,-30 q-8,-10 -2,-16 M56,-30 q8,-10 2,-16" fill="none" stroke="#1b2636" stroke-width="7" stroke-linecap="round"/><path d="M36,-30 q-8,-10 -2,-16 M56,-30 q8,-10 2,-16" fill="none" stroke="#f6ead6" stroke-width="3.5" stroke-linecap="round"/>'
      + '<ellipse cx="29" cy="-24" rx="8" ry="4.5" fill="#b9683c" ' + K + '/><ellipse cx="63" cy="-24" rx="8" ry="4.5" fill="#b9683c" ' + K + '/>'
      + '<ellipse cx="46" cy="-14" rx="14" ry="17" fill="#b9683c" ' + K + '/><ellipse cx="46" cy="-2" rx="11" ry="7.5" fill="#f1b9b0" ' + K + '/>'
      + '<circle cx="40" cy="-19" r="2.2" fill="#1b2636"/><circle cx="52" cy="-19" r="2.2" fill="#1b2636"/><circle cx="42" cy="-2" r="1.5" fill="#1b2636"/><circle cx="50" cy="-2" r="1.5" fill="#1b2636"/>';
  },
  huhn() {
    return '<path d="M-6,34 L-8,50 M6,34 L8,50" fill="none" stroke="#d9920a" stroke-width="4" stroke-linecap="round"/>'
      + '<path d="M-20,12 L-40,-4 L-34,24 Z" fill="#7189b0" ' + K + '/>'
      + '<ellipse cx="0" cy="18" rx="25" ry="19" fill="#8fa3c4" ' + K + '/>'
      + '<path d="M13,-14 q3,-9 7,-1 q4,-8 7,1 Z" fill="#d83a2e" ' + K + '/>'
      + '<circle cx="20" cy="-3" r="11" fill="#8fa3c4" ' + K + '/><path d="M30,-5 l11,4 l-11,5 Z" fill="#f2b530" ' + K + '/>'
      + '<circle cx="22" cy="-5" r="2" fill="#1b2636"/><path d="M-12,14 q10,12 20,2" fill="none" stroke="#1b2636" stroke-width="2.5" stroke-linecap="round"/>';
  },
  kueken() {
    return '<circle cx="0" cy="38" r="11" fill="#f7d54a" ' + K + '/><circle cx="8" cy="24" r="7.5" fill="#f7d54a" ' + K + '/><path d="M14,23 l7,2 l-7,3 Z" fill="#e58a1f" ' + K + '/><circle cx="9" cy="22" r="1.5" fill="#1b2636"/>';
  },
  schaf(o) {
    o = o || {};
    return [-19, -8, 6, 17].map(x => '<rect x="' + x + '" y="24" width="7" height="26" fill="#4b4b55" ' + K + '/>').join("")
      + [[-22, 10, 14], [-8, -2, 15], [9, -2, 15], [22, 9, 14], [-12, 18, 14], [10, 18, 14]].map(c => '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="' + c[2] + '" fill="#fff" ' + K + '/>').join("")
      + '<ellipse cx="0" cy="9" rx="25" ry="14" fill="#fff"/>'
      + '<ellipse cx="34" cy="2" rx="10" ry="13" fill="#4b4b55" ' + K + '/><ellipse cx="25" cy="-6" rx="6" ry="3.5" fill="#4b4b55" ' + K + '/>'
      + (o.sleep ? '<path d="M32,0 q3,3 6,0" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/>' : '<circle cx="36" cy="-1" r="2" fill="#fff"/>');
  },
  hund() {
    return '<path d="M-24,16 Q-38,4 -34,-8" fill="none" stroke="#1b2636" stroke-width="7" stroke-linecap="round"/>'
      + [-18, -8, 8, 17].map(x => '<rect x="' + x + '" y="26" width="7" height="24" fill="#2b2b33" ' + K + '/>').join("")
      + '<ellipse cx="0" cy="22" rx="27" ry="13" fill="#2b2b33" ' + K + '/><ellipse cx="17" cy="26" rx="8" ry="8" fill="#fff"/>'
      + '<path d="M18,-8 l4,-13 l8,10 Z" fill="#2b2b33" ' + K + '/><circle cx="27" cy="4" r="12" fill="#2b2b33" ' + K + '/>'
      + '<ellipse cx="36" cy="8" rx="8" ry="6" fill="#fff" ' + K + '/><circle cx="41" cy="6" r="2" fill="#1b2636"/><circle cx="28" cy="0" r="2" fill="#fff"/>';
  },
  laterne(o) {
    o = o || {};
    return (o.glow ? '<circle cx="0" cy="6" r="46" fill="#ffd766" opacity=".28"/><circle cx="0" cy="6" r="28" fill="#ffe89a" opacity=".4"/>' : "")
      + '<path d="M-10,-22 Q0,-42 10,-22" fill="none" stroke="#1b2636" stroke-width="3.5" stroke-linecap="round"/>'
      + '<path d="M-14,-12 L14,-12 L9,-23 L-9,-23 Z" fill="#7a4f2a" ' + K + '/><rect x="-12" y="-12" width="24" height="34" fill="#ffe58a" ' + K + '/>'
      + '<path d="M0,14 q-7,-9 0,-18 q7,9 0,18 Z" fill="#f08a1c" stroke="#1b2636" stroke-width="1.5"/><rect x="-15" y="22" width="30" height="7" rx="2" fill="#7a4f2a" ' + K + '/>';
  },
  stern(o) {
    o = o || {};
    return (o.glow === false ? "" : '<circle r="50" fill="#fff6c9" opacity=".16"/><circle r="34" fill="#fff6c9" opacity=".3"/>') + star8(22);
  },
  krippe(o) {
    o = o || {};
    return '<path d="M-30,22 L-18,50 M30,22 L18,50 M-24,50 L24,22 M24,50 L-24,22" fill="none" stroke="#1b2636" stroke-width="9" stroke-linecap="round"/><path d="M-24,50 L24,22 M24,50 L-24,22" fill="none" stroke="#9a6a3c" stroke-width="4.5" stroke-linecap="round"/>'
      + '<path d="M-42,-6 L42,-6 L32,24 L-32,24 Z" fill="#9a6a3c" ' + K + '/><path d="M-36,8 L36,8" stroke="#1b2636" stroke-width="2" opacity=".5"/>'
      + '<path d="M-42,-6 q6,-12 14,-4 q6,-13 16,-3 q8,-12 16,-2 q8,-11 14,0 q8,-8 10,9 Z" fill="#e8c24a" ' + K + '/>'
      + (o.baby ? at(2, -16, .78, ART.baby()) : "");
  },
  stroh() {
    return '<path d="M-56,22 Q-40,-14 -8,-6 Q22,-20 56,22 Z" fill="#e8c24a" ' + K + '/><path d="M-30,10 l10,-12 M-6,12 l6,-13 M18,10 l12,-12 M34,16 l8,-8" fill="none" stroke="#b98a17" stroke-width="2.5" stroke-linecap="round"/>';
  },
  milch() {
    return '<path d="M-22,-10 Q0,-44 22,-10" fill="none" stroke="#1b2636" stroke-width="3.5" stroke-linecap="round"/>'
      + '<path d="M-24,-12 L24,-12 L18,36 L-18,36 Z" fill="#b9c2cf" ' + K + '/><ellipse cx="0" cy="-12" rx="24" ry="8" fill="#fff" ' + K + '/><path d="M-21,10 L21,10" stroke="#1b2636" stroke-width="2" opacity=".45"/>';
  },
  tuer() {
    return '<rect x="-30" y="-48" width="60" height="98" fill="#5b3a22" ' + K + '/><rect x="-23" y="-41" width="46" height="91" fill="#9a6a3c" ' + K + '/>'
      + '<path d="M-8,-41 V50 M8,-41 V50" stroke="#1b2636" stroke-width="2" opacity=".5"/><circle cx="15" cy="6" r="4" fill="#f2b530" ' + K + '/>';
  },
  stall(o) {
    o = o || {};
    const w = o.light === false ? "#57503f" : "#ffd766";
    return '<rect x="-70" y="-8" width="140" height="58" fill="#5b3a22" ' + K + '/>'
      + '<path d="M-70,6 H70 M-70,20 H70 M-70,34 H70" stroke="#1b2636" stroke-width="1.6" opacity=".45"/>'
      + '<rect x="-52" y="6" width="22" height="20" fill="' + w + '" ' + K + '/><rect x="30" y="6" width="22" height="20" fill="' + w + '" ' + K + '/>'
      + '<path d="M-41,6 V26 M41,6 V26" stroke="#1b2636" stroke-width="2"/>'
      + '<rect x="-12" y="8" width="24" height="42" fill="' + (o.open ? "#ffe89a" : "#3d2716") + '" ' + K + '/>'
      + '<path d="M-82,-6 L0,-50 L82,-6 L70,-6 L0,-36 L-70,-6 Z" fill="#fff" ' + K + '/><path d="M-70,-7 L0,-36 L70,-7 Z" fill="#6b4528" ' + K + '/>';
  },
  haus(o) {
    o = o || {};
    return '<rect x="-26" y="6" width="52" height="34" fill="#39445c" ' + K + '/><path d="M-32,8 L0,-18 L32,8 Z" fill="#fff" ' + K + '/>'
      + '<rect x="-8" y="16" width="16" height="14" fill="' + (o.lit ? "#ffd766" : "#1c2438") + '" ' + K + '/>';
  },
  baum() {
    return '<path d="M0,50 V-10 M0,10 L-22,-18 M0,0 L20,-26 M0,-10 L-10,-38 M0,-10 L8,-42 M-22,-18 L-32,-22 M20,-26 L32,-28" fill="none" stroke="#1b2636" stroke-width="5" stroke-linecap="round"/>'
      + '<path d="M-22,-19 l-8,-4 M20,-27 l10,-2 M-10,-39 l2,5 M8,-43 l-1,6" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>';
  },
  flocke(c) {
    return '<path d="M0,-14 V14 M-12,-7 L12,7 M-12,7 L12,-7" fill="none" stroke="' + (c || "#4f8fd0") + '" stroke-width="4" stroke-linecap="round"/>';
  },
  schnee() { return at(-34, -22, 1.5, ART.flocke()) + at(30, -34, 1.1, ART.flocke()) + at(18, 22, 1.8, ART.flocke()) + at(-40, 36, 1, ART.flocke()); },
  thermo(col, lvl) {
    return '<rect x="-9" y="-48" width="18" height="74" rx="9" fill="#fff" ' + K + '/><rect x="-4" y="' + (20 - lvl) + '" width="8" height="' + lvl + '" fill="' + col + '"/><circle cx="0" cy="34" r="16" fill="' + col + '" ' + K + '/>';
  },
  kalt() { return at(-22, 0, 1, ART.thermo("#3f8fd4", 14)) + at(34, -14, 1.7, ART.flocke()); },
  warm() { return at(-22, 0, 1, ART.thermo("#d83a2e", 58)) + '<path d="M22,26 q-9,-11 0,-22 q9,-11 0,-22 M44,26 q-9,-11 0,-22 q9,-11 0,-22" fill="none" stroke="#e5701c" stroke-width="5" stroke-linecap="round"/>'; },
  hand() {
    return [[-22, -22, 30], [-9, -36, 44], [4, -32, 40], [17, -20, 28]].map(f => '<rect x="' + f[0] + '" y="' + f[1] + '" width="11" height="' + f[2] + '" rx="5.5" fill="' + SKIN + '" ' + K + '/>').join("")
      + '<path d="M-30,10 l-14,-14" fill="none" stroke="#1b2636" stroke-width="14" stroke-linecap="round"/><path d="M-30,10 l-14,-14" fill="none" stroke="' + SKIN + '" stroke-width="8.5" stroke-linecap="round"/>'
      + '<rect x="-24" y="0" width="54" height="44" rx="14" fill="' + SKIN + '" ' + K + '/>';
  },
  mond() { return '<path d="M8,-30 A32,32 0 1 0 30,22 A26,26 0 1 1 8,-30 Z" fill="#ffe58a" stroke="#b98600" stroke-width="2.5" stroke-linejoin="round"/>'; },
  nacht() {
    return '<rect x="-58" y="-58" width="116" height="116" rx="18" fill="#1c2b4a" ' + K + '/>' + at(-6, 4, 1, ART.mond())
      + [[34, -34], [40, 10], [-38, -36], [20, 40]].map(p => '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="3" fill="#fff"/>').join("");
  },
  gesicht(o) {
    o = o || {};
    return '<circle cx="0" cy="0" r="46" fill="' + SKIN + '" ' + K + '/>'
      + (o.sleep ? '<path d="M-26,-8 q8,8 16,0 M10,-8 q8,8 16,0" fill="none" stroke="#1b2636" stroke-width="4" stroke-linecap="round"/>' : '<circle cx="-17" cy="-8" r="4.5" fill="#1b2636"/><circle cx="17" cy="-8" r="4.5" fill="#1b2636"/>')
      + (o.mouth || '<path d="M-12,20 q12,8 24,0" fill="none" stroke="#1b2636" stroke-width="4" stroke-linecap="round"/>');
  },
  still() {
    return ART.gesicht({ mouth: '<path d="M-10,22 h20" fill="none" stroke="#1b2636" stroke-width="4" stroke-linecap="round"/>' })
      + '<rect x="-7" y="4" width="14" height="52" rx="7" fill="' + SKIN + '" ' + K + '/>';
  },
  schlafen() {
    return ART.gesicht({ sleep: true, mouth: '<ellipse cx="0" cy="22" rx="6" ry="5" fill="#1b2636"/>' })
      + '<path d="M40,-40 h14 l-14,16 h14 M60,-58 h9 l-9,10 h9" fill="none" stroke="#2a5fc4" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>';
  },
  muede() {
    return ART.gesicht({ mouth: '<ellipse cx="0" cy="22" rx="11" ry="13" fill="#1b2636"/>' }).replace(/<circle cx="-17"[^>]*><circle cx="17"[^>]*>/, '<path d="M-27,-8 h18 M9,-8 h18" fill="none" stroke="#1b2636" stroke-width="4.5" stroke-linecap="round"/><path d="M-27,-15 q9,-5 18,0 M9,-15 q9,-5 18,0" fill="none" stroke="#1b2636" stroke-width="2.5" stroke-linecap="round"/>');
  },
  hunger() {
    return '<path d="M-44,-4 H44 Q40,36 0,36 Q-40,36 -44,-4 Z" fill="#fff" ' + K + '/><ellipse cx="0" cy="-4" rx="44" ry="9" fill="#eef1f6" ' + K + '/>'
      + '<path d="M30,-50 L52,-12" fill="none" stroke="#1b2636" stroke-width="8" stroke-linecap="round"/><path d="M30,-50 L52,-12" fill="none" stroke="#b9c2cf" stroke-width="4" stroke-linecap="round"/><ellipse cx="27" cy="-54" rx="8" ry="11" transform="rotate(-30 27 -54)" fill="#b9c2cf" ' + K + '/>';
  },
  weihnachten() { return at(0, 22, .85, ART.stall({ open: true })) + at(0, -44, .8, ART.stern()); },
  hirten() { return at(-36, 4, .8, ART.hirte({ c: "#6f7f8f" })) + at(34, 4, .8, ART.hirte({ c: "#a0563b" })) + at(-2, 14, .9, ART.hirte()); },
  schafe() { return at(-34, -10, .75, ART.schaf()) + at(30, -8, .75, ART.schaf()) + at(-4, 22, .85, ART.schaf()); },
  herz() { return '<path d="M0,12 C-22,-6 -10,-22 0,-10 C10,-22 22,-6 0,12 Z" fill="#e2546b" stroke="#1b2636" stroke-width="2.5" stroke-linejoin="round"/>'; },
  zzz() { return '<path d="M-14,-6 h14 l-14,16 h14 M8,-24 h9 l-9,10 h9" fill="none" stroke="#cfe0ff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>'; },
  spuren() { return [0, 1, 2, 3, 4, 5].map(i => '<ellipse cx="' + (i * 16) + '" cy="' + (i % 2 ? 5 : -3) + '" rx="5" ry="2.6" fill="#b7c6dc"/>').join(""); },
  fenster3() {
    return '<rect x="-52" y="-34" width="104" height="68" fill="#1c2b4a" ' + K + '/>'
      + [[-30, "#6f7f8f"], [0, "#8b7355"], [30, "#a0563b"]].map(h => '<path d="M' + (h[0] - 15) + ',34 q15,-26 30,0 Z" fill="' + h[1] + '" ' + K + '/>' + face(h[0], 4, 11) + '<ellipse cx="' + h[0] + '" cy="-5" rx="15" ry="3.5" fill="#4a3b2c" ' + K + '/><path d="M' + (h[0] - 9) + ',-6 q9,-14 18,0 Z" fill="#4a3b2c" ' + K + '/>').join("")
      + '<path d="M-52,-34 H52 V34 H-52 Z M-17,-34 V34 M17,-34 V34" fill="none" stroke="#7a4f2a" stroke-width="6" stroke-linejoin="round"/><rect x="-60" y="34" width="120" height="8" fill="#7a4f2a" ' + K + '/>';
  }
};

/* ---------- 2. Bildwörter (Piktogramm + Wort + Gebärde) ---------- */
const W = {
  mutter: { w: "Mutter", sign: "MUTTER", d: () => at(0, 4, 1.6, ART.mutter()) },
  kind: { w: "Kind", sign: "KIND", d: () => at(0, 14, 1.5, ART.kind()) },
  mann: { w: "Mann", sign: "MANN", d: () => at(0, 4, 1.6, ART.mann()) },
  frau: { w: "Frau", sign: "FRAU", d: () => at(0, 4, 1.6, ART.frau()) },
  baby: { w: "Baby", sign: "BABY", d: () => at(6, 0, 2, ART.baby()) },
  hirten: { w: "Hirten", sign: "HIRTE", d: () => at(0, 0, 1.15, ART.hirten()) },
  pferd: { w: "Pferd", sign: "PFERD", d: () => at(-8, 4, 1.45, ART.pferd()) },
  kuh: { w: "Kuh", sign: "KUH", d: () => at(-8, 0, 1.45, ART.kuh()) },
  huhn: { w: "Huhn", sign: "HUHN", d: () => at(-6, -6, 2, ART.huhn()) },
  schaf: { w: "Schaf", sign: "SCHAF", d: () => at(-8, -8, 2, ART.schaf()) },
  schafe: { w: "Schafe", sign: "SCHAF", d: () => at(0, 0, 1.25, ART.schafe()) },
  hund: { w: "Hund", sign: "HUND", d: () => at(-6, -24, 2.1, ART.hund()) },
  stall: { w: "Stall", sign: "STALL", d: () => at(0, 0, 1.1, ART.stall({ open: true })) },
  laterne: { w: "Laterne", sign: "LATERNE", d: () => at(0, 8, 2.2, ART.laterne()) },
  tuer: { w: "Tür", sign: "TUER", d: () => at(0, 0, 1.6, ART.tuer()) },
  stroh: { w: "Stroh", sign: "STROH", d: () => at(0, 0, 1.5, ART.stroh()) },
  krippe: { w: "Krippe", sign: "KRIPPE", d: () => at(0, -14, 1.7, ART.krippe()) },
  milch: { w: "Milch", sign: "MILCH", d: () => at(0, 8, 2, ART.milch()) },
  stern: { w: "Stern", sign: "STERN", d: () => at(0, 0, 2.6, ART.stern()) },
  schnee: { w: "Schnee", sign: "SCHNEE", d: () => at(0, 0, 1.4, ART.schnee()) },
  kalt: { w: "kalt", sign: "KALT", d: () => at(0, 4, 1.5, ART.kalt()) },
  warm: { w: "warm", sign: "WARM", d: () => at(-6, 4, 1.5, ART.warm()) },
  hand: { w: "Hand", sign: "HAND", d: () => at(4, 0, 1.9, ART.hand()) },
  nacht: { w: "Nacht", sign: "NACHT", d: () => at(0, 0, 1.4, ART.nacht()) },
  still: { w: "still", sign: "STILL", d: () => at(0, -6, 1.5, ART.still()) },
  schlafen: { w: "schlafen", sign: "SCHLAFEN", d: () => at(-10, 10, 1.45, ART.schlafen()) },
  muede: { w: "müde", sign: "MUEDE", d: () => at(0, 0, 1.6, ART.muede()) },
  hunger: { w: "Hunger", sign: "HUNGER", d: () => at(-6, 14, 1.7, ART.hunger()) },
  weihnachten: { w: "Weihnachten", sign: "WEIHNACHTEN", d: () => at(0, 10, 1.25, ART.weihnachten()) }
};
function pic(key, cls) { return '<svg class="' + (cls || "vis") + ' pic" viewBox="0 0 200 200">' + at(100, 100, 1, W[key].d()) + '</svg>'; }
/* Gebärdenbild nur zeigen, wenn es eingebettet ist (sonst nichts – keine Platzhalter in der Kinderansicht) */
function gb(key, cls) { const s = W[key] && W[key].sign; return (s && typeof SIGNS !== "undefined" && SIGNS[s]) ? sign(s, cls) : ""; }
function wordHTML(key) { return gb(key) + '<span class="name">' + W[key].w + '</span>'; }
function picWord(key) { return pic(key) + wordHTML(key); }

/* ---------- 3. Szenenbilder (400 × 260) ---------- */
const STARS = [[22, 20], [60, 48], [95, 16], [130, 40], [165, 14], [205, 34], [238, 12], [300, 44], [345, 18], [382, 40], [18, 74], [150, 70], [372, 82], [262, 60], [50, 100]];
const BG = {
  nacht(o) {
    o = o || {};
    return '<rect width="400" height="260" fill="#1c2b4a"/>'
      + (o.stars ? STARS.map((p, i) => '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + (i % 3 ? 2 : 3) + '" fill="#fff"/>').join("") : "")
      + (o.big ? at(o.big[0], o.big[1], o.big[2] || 1, ART.stern()) : "")
      + '<path d="M0,' + (o.h || 190) + ' Q100,' + ((o.h || 190) - 18) + ' 200,' + ((o.h || 190) - 4) + ' T400,' + ((o.h || 190) - 10) + ' V260 H0 Z" fill="#eef3fa" stroke="#1b2636" stroke-width="3"/>';
  },
  innen() {
    return '<rect width="400" height="260" fill="#c99b62"/><path d="M0,45 H400 M0,90 H400 M0,135 H400" stroke="#8a5a34" stroke-width="2.5"/>'
      + '<path d="M70,0 V180 M330,0 V180" stroke="#7a4f2a" stroke-width="9"/><rect x="0" y="180" width="400" height="80" fill="#e9cf8e"/><path d="M0,180 H400" stroke="#1b2636" stroke-width="3"/>'
      + '<path d="M20,205 l14,-8 M90,232 l16,-6 M190,212 l14,-8 M300,238 l16,-7 M350,204 l12,-7 M140,246 l14,-6" stroke="#b98a17" stroke-width="2.5" stroke-linecap="round"/>';
  },
  stube() {
    return '<rect width="400" height="260" fill="#f3dcae"/><rect x="0" y="200" width="400" height="60" fill="#b9814e"/><path d="M0,200 H400" stroke="#1b2636" stroke-width="3"/>'
      + '<rect x="36" y="34" width="120" height="110" fill="#1c2b4a" ' + K + '/><path d="M36,116 q30,-14 60,-4 t60,-6 V144 H36 Z" fill="#eef3fa"/>'
      + '<circle cx="62" cy="60" r="2.5" fill="#fff"/><circle cx="120" cy="52" r="2.5" fill="#fff"/><circle cx="138" cy="86" r="2.5" fill="#fff"/><circle cx="84" cy="92" r="2.5" fill="#fff"/>'
      + '<path d="M36,34 H156 V144 H36 Z M96,34 V144 M36,89 H156" fill="none" stroke="#fff" stroke-width="7" stroke-linejoin="round"/><path d="M36,34 H156 V144 H36 Z" fill="none" ' + K + '/><rect x="26" y="144" width="140" height="10" fill="#fff" ' + K + '/>'
      + '<rect x="66" y="126" width="8" height="18" fill="#fff" ' + K + '/><path d="M70,126 q-5,-7 0,-13 q5,6 0,13 Z" fill="#f08a1c" stroke="#1b2636" stroke-width="1.5"/>';
  },
  /* Stall im Schnitt: man sieht hinein */
  schnitt(o) {
    o = o || {};
    return BG.nacht({ stars: o.stars, big: o.big, h: 214 })
      + '<rect x="96" y="104" width="232" height="128" fill="' + (o.lit ? "#e6bd7c" : "#4a3a2e") + '" ' + K + '/>'
      + (o.lit ? '<path d="M96,146 H328 M96,188 H328" stroke="#8a5a34" stroke-width="2" opacity=".6"/><path d="M96,214 H328 V232 H96 Z" fill="#e9cf8e" stroke="#1b2636" stroke-width="2"/>' : "")
      + '<path d="M78,108 L212,44 L346,108 L328,108 L212,62 L96,108 Z" fill="#fff" ' + K + '/><path d="M96,107 L212,62 L328,107 Z" fill="#6b4528" ' + K + '/>'
      + '<rect x="90" y="104" width="12" height="128" fill="#5b3a22" ' + K + '/><rect x="322" y="104" width="12" height="128" fill="#5b3a22" ' + K + '/>';
  }
};
/* Stall-Bild der Startseite: wächst mit jeder gelösten Tür. has(n) = Tür n ist gelöst. */
function homeItems(has) {
  const it = [], lit = has(3), born = has(11);
  if (has(1)) it.push(["haus", "haus", 40, 196, .8, { lit: true }]);
  if (has(4)) it.push(["baum", "baum", 372, 176, .9]);
  if (has(10)) it.push(["nacht", "mond", 60, 50, .7]);
  if (has(2) && !lit) { it.push(["spuren", "spuren", 8, 240, .8]); it.push(["frau", "frau", 46, 222, .55]); it.push(["mann", "mann", 70, 221, .55, { lat: true }]); }
  if (lit) it.push(["laterne", "laterne", 212, 124, .5, { glow: true }]);
  if (has(8)) it.push(["stroh", "stroh", 150, 222, .7]);
  if (has(5)) { it.push(["pferd", "pferd", 136, 176, .62]); it.push(["kuh", "kuh", 186, 196, .5]); it.push(["huhn", "huhn", 112, 220, .32]); it.push(["schafe", "schaf", 150, 222, .3]); it.push(["schafe", "schaf", 178, 226, .3]); }
  if (has(8)) { it.push(["schafe", "schaf", 206, 224, .3]); it.push(["schafe", "schaf", 124, 228, .3, { sleep: true }]); it.push(["schafe", "schaf", 232, 228, .3, { sleep: true }]); }
  if (has(9)) { it.push(["huhn", "kueken", 100, 222, .32]); it.push(["huhn", "kueken", 108, 228, .28]); }
  if (has(6)) it.push(["warm", "herz", 150, 132, .7]);
  if (has(7)) it.push(["milch", "milch", 228, 218, .28]);
  if (has(15)) it.push(["krippe", "krippe", 252, 204, .52, { baby: true }]);
  if (lit) { it.push(["frau", "frau", 284, 202, .6, { baby: born && !has(15) }]); it.push(["mann", "mann", 308, 201, .6]); }
  if (has(12) && !has(13)) { it.push(["hirten", "hirte", 362, 208, .3]); it.push(["hirten", "hirte", 380, 212, .3, { c: "#6f7f8f" }]); }
  if (has(13)) { it.push(["hirten", "hirte", 350, 218, .5, { c: "#6f7f8f" }]); it.push(["hirten", "hirte", 376, 222, .5, { c: "#a0563b" }]); }
  if (has(14)) it.push(["hund", "hund", 60, 232, .4]);
  if (has(16)) it.push(["herz", "herz", 252, 160, .8]);
  return { bg: "schnitt", bgo: { lit, stars: born, big: born ? [212, 26, .8] : null }, items: it };
}
const ALLE = () => true;
/* Szene je Tür: items = [Schlüssel, Zeichnung, x, y, Maßstab, Optionen] */
const SZENE = {
  1: { bg: "stube", items: [["mutter", "mutter", 262, 150, 1.7], ["kind", "kind", 224, 168, 1.15]] },
  2: { bg: "nacht", bgo: { h: 200 }, items: [["haus", "haus", 60, 178, .7], ["haus", "haus", 330, 176, .6], ["baum", "baum", 372, 190, 1], ["schnee", "spuren", 30, 236, 1.2], ["frau", "frau", 170, 178, 1.25], ["mann", "mann", 225, 176, 1.25, { lat: true }]] },
  3: { bg: "nacht", bgo: { h: 200 }, items: [["baum", "baum", 40, 190, 1.1], ["stall", "stall", 262, 150, 1.55, { open: true }], ["frau", "frau", 110, 196, 1.05], ["mann", "mann", 160, 194, 1.05, { lat: true }]] },
  5: { bg: "innen", items: [["pferd", "pferd", 96, 128, 1.15], ["kuh", "kuh", 232, 132, 1.1], ["huhn", "huhn", 344, 196, .8], ["schafe", "schaf", 44, 214, .6], ["schafe", "schaf", 112, 222, .6], ["schafe", "schaf", 180, 214, .6], ["schafe", "schaf", 244, 224, .6], ["schafe", "schaf", 300, 150, .6]] },
  6: { bg: "innen", items: [["pferd", "pferd", 150, 152, 1.9], ["frau", "frau", 318, 168, 1.5, { arm: true, flip: true }], ["warm", "herz", 226, 44, 1.6]] },
  7: { bg: "innen", items: [["kuh", "kuh", 132, 150, 1.8], ["milch", "milch", 240, 216, .9], ["frau", "frau", 318, 166, 1.5, { cup: true, flip: true }]] },
  8: { bg: "innen", items: [["stroh", "stroh", 200, 200, 2.4], ["frau", "frau", 196, 176, 1.25, { rot: -90, sleep: true }], ["schafe", "schaf", 70, 214, .85, { sleep: true }], ["schafe", "schaf", 316, 210, .85, { flip: true, sleep: true }], ["schafe", "schaf", 150, 232, .7, { sleep: true }], ["schafe", "schaf", 250, 234, .7, { flip: true, sleep: true }]] },
  10: { bg: "nacht", bgo: { h: 196 }, items: [["baum", "baum", 60, 186, 1.1], ["baum", "baum", 350, 182, .9], ["stall", "stall", 204, 150, 1.5, { light: false }], ["still", "zzz", 250, 60, 1.6]] },
  11: (() => { const h = homeItems(n => [3, 5, 8, 11].includes(n)); return h; })(),
  12: { bg: "nacht", bgo: { stars: true, big: [322, 60, 1.1], h: 190 }, items: [["stall", "stall", 322, 172, .55, { open: true }], ["hirten", "hirte", 60, 150, 1.05, { c: "#6f7f8f" }], ["hirten", "hirte", 116, 152, 1.05, { c: "#a0563b" }], ["hirten", "hirte", 180, 150, 1.05, { point: true, flip: true }], ["hund", "hund", 226, 196, .8], ["schafe", "schaf", 60, 232, .6], ["schafe", "schaf", 130, 236, .6]] },
  13: { bg: "innen", items: [["hirten", "fenster3", 120, 84, 1.25], ["laterne", "laterne", 216, 206, .8, { glow: true }], ["mann", "mann", 262, 160, 1.4], ["frau", "frau", 330, 164, 1.4, { baby: true }]] },
  15: { bg: "innen", items: [["pferd", "pferd", 300, 120, 1.3, { flip: true }], ["frau", "frau", 82, 162, 1.45], ["krippe", "krippe", 204, 176, 1.75, { baby: true }], ["laterne", "laterne", 150, 34, .7, { glow: true }]] },
  16: homeItems(ALLE)
};
function drawScene(sc, o) {
  o = o || {};
  let h = BG[sc.bg](sc.bgo), ring = "";
  sc.items.forEach(i => {
    const io = i[5] || {};
    const frag = at(i[2], i[3], i[4], ART[i[1]](io), io);
    if (o.taps && i[0] === o.taps) h += '<g class="tp" data-k="s">' + frag + '<circle cx="' + i[2] + '" cy="' + (i[3] + 8 * i[4]) + '" r="' + (44 * i[4]) + '" fill="transparent"/><circle class="mk" cx="' + i[2] + '" cy="' + (i[3] + 10 * i[4]) + '" r="11" fill="#fff" stroke="#c9245a" stroke-width="4" stroke-opacity=".6"/></g>';
    else h += frag;
    if (o.hl && i[0] === o.hl) ring += '<circle class="hlring" cx="' + i[2] + '" cy="' + (i[3] - 4 * i[4]) + '" r="' + Math.max(22, 56 * i[4]) + '" fill="none" stroke="#ff3d7f" stroke-width="5" stroke-dasharray="10 7"/>';
  });
  if (o.hl === "stern" && sc.bgo && sc.bgo.big) ring += '<circle class="hlring" cx="' + sc.bgo.big[0] + '" cy="' + sc.bgo.big[1] + '" r="34" fill="none" stroke="#ff3d7f" stroke-width="5" stroke-dasharray="10 7"/>';
  return '<svg class="' + (o.cls || "szene") + '" viewBox="0 0 400 260">' + h + ring + '</svg>';
}
function scene(d, o) { return drawScene(SZENE[d], o); }
function homeScene(has, o) { return drawScene(homeItems(has), o); }

/* ---------- 4. Türen, Texte und Aufgaben-Daten ----------
   Tage = Schultage im Dezember 2026 (ohne Wochenenden). rev = Wiederholungs-Tür ohne neuen Text.
   Texte je Stufe: 1 = Bildwörter, 2–4 = Sätze (einzeln, damit die Hilfe einen Satz markieren kann). */
const JAHR = 2026;
const TUEREN = [
  { n: 1, tag: 1, wt: "Di", titel: "Mutter und Kind" },
  { n: 2, tag: 2, wt: "Mi", titel: "Der Weg im Dunkeln" },
  { n: 3, tag: 3, wt: "Do", titel: "Der Stall und die Laterne" },
  { n: 4, tag: 4, wt: "Fr", titel: "Weißt du es noch?", rev: [1, 2, 3] },
  { n: 5, tag: 7, wt: "Mo", titel: "Die Tiere wachen auf" },
  { n: 6, tag: 8, wt: "Di", titel: "Das Pferd wärmt" },
  { n: 7, tag: 9, wt: "Mi", titel: "Die Kuh gibt Milch" },
  { n: 8, tag: 10, wt: "Do", titel: "Die Schafe wärmen" },
  { n: 9, tag: 11, wt: "Fr", titel: "Wer hilft der Frau?", rev: [6, 7, 8] },
  { n: 10, tag: 14, wt: "Mo", titel: "Die Nacht" },
  { n: 11, tag: 15, wt: "Di", titel: "Das Kind und der Stern" },
  { n: 12, tag: 16, wt: "Mi", titel: "Die Hirten sehen den Stern" },
  { n: 13, tag: 17, wt: "Do", titel: "Die Hirten finden das Kind" },
  { n: 14, tag: 18, wt: "Fr", titel: "Weißt du es noch?", rev: [10, 11, 12, 13] },
  { n: 15, tag: 21, wt: "Mo", titel: "Die Krippe" },
  { n: 16, tag: 22, wt: "Di", titel: "Das allererste Weihnachten" }
];
const TUER = n => TUEREN[n - 1];

const TEXT = {
  1: { 1: ["mutter", "kind"],
    2: ["Da ist eine Mutter.", "Da ist ein Kind.", "Die Mutter erzählt."],
    3: ["Ein Kind sitzt bei der Mutter auf dem Schoß.", "Das Kind sagt: „Erzähl von Weihnachten!“", "Die Mutter erzählt eine Geschichte.", "Die Geschichte ist sehr alt."],
    4: ["Ein Kind saß bei seiner Mutter auf dem Schoß.", "Es wollte etwas über Weihnachten hören.", "Also erzählte die Mutter eine Geschichte von früher.", "Das Kind konnte sich alles genau vorstellen."] },
  2: { 1: ["mann", "frau", "schnee", "kalt"],
    2: ["Es ist Winter.", "Es ist kalt.", "Ein Mann und eine Frau gehen.", "Sie sind müde."],
    3: ["Es ist Winter und schon dunkel.", "Ein Mann und eine Frau gehen durch den Schnee.", "Sie sind sehr müde.", "Sie möchten schlafen.", "Aber wo?", "Am Himmel ist kein Stern."],
    4: ["Es war ein kalter Winterabend vor langer Zeit.", "Ein Mann und eine Frau waren schon sehr weit gegangen.", "Nun suchten sie einen Platz zum Schlafen.", "In allen Häusern war das Licht schon aus, und niemand half ihnen.", "Am Himmel leuchtete kein einziger Stern."] },
  3: { 1: ["stall", "laterne", "tuer"],
    2: ["Da ist ein Stall.", "Der Mann hat eine Laterne.", "Er macht die Tür auf."],
    3: ["Am Weg steht ein Stall.", "Der Mann öffnet die Tür.", "Er leuchtet mit der Laterne hinein.", "Er denkt: Vielleicht sind hier Tiere.", "Bei Tieren ist es warm."],
    4: ["Da entdeckten die beiden einen Stall am Weg.", "Der Mann öffnete die Tür und hielt seine Laterne hinein.", "Ob dort Tiere schliefen?", "Wo Tiere sind, ist es warm – und die beiden froren sehr."] },
  5: { 1: ["pferd", "kuh", "huhn", "schaf"],
    2: ["Im Stall sind Tiere.", "1 Pferd, 1 Kuh, 1 Huhn und 5 Schafe.", "Die Tiere wachen auf."],
    3: ["Im Stall sind Tiere: ein Pferd, eine Kuh, ein Huhn und fünf Schafe.", "Die Tiere schlafen.", "Da knarrt die Tür.", "Jetzt sind die Tiere wach.", "Sie sehen den Mann und die Frau."],
    4: ["Ja, im Stall gab es Tiere: ein Pferd, eine Kuh, ein Huhn und fünf Schafe.", "Sie schliefen schon.", "Doch als die Tür knarrte, wurden sie wach.", "Im Licht der Laterne sahen sie die Frau.", "Die Tiere wunderten sich: Wer kommt mitten in der Nacht?"] },
  6: { 1: ["pferd", "hand", "warm"],
    2: ["Die Frau friert.", "Die Hände sind kalt.", "Das Pferd ist warm."],
    3: ["Die Frau friert.", "Ihre Hände sind ganz kalt.", "Sie geht zum Pferd.", "Sie legt die Hände unter die Mähne.", "Das Pferd bleibt ruhig stehen.", "Jetzt sind die Hände warm."],
    4: ["Die Frau fror.", "Sie war müde und hatte Hunger.", "Spürten die Tiere das?", "Das Pferd blieb jedenfalls ganz still stehen, als die Frau ihre eiskalten Finger in seiner dicken Mähne wärmte."] },
  7: { 1: ["kuh", "milch"],
    2: ["Die Frau hat Hunger.", "Die Kuh hat Milch.", "Die Frau trinkt Milch."],
    3: ["Die Frau hat Hunger.", "Sie geht zur Kuh und melkt sie.", "Die Kuh bleibt ruhig stehen.", "Die Frau trinkt die warme Milch."],
    4: ["Auch die Kuh schien zu verstehen, was die Frau brauchte.", "Sie hielt ganz still, während die Frau sie melkte.", "Die warme Milch tat der Frau gut."] },
  8: { 1: ["schafe", "stroh", "schlafen"],
    2: ["Die Frau ist müde.", "Sie schläft im Stroh.", "Die Schafe sind warm."],
    3: ["Die Frau ist sehr müde.", "Sie legt sich ins Stroh.", "Die Schafe kommen und legen sich zu ihr.", "So ist es warm.", "Die Frau schläft."],
    4: ["Und die Schafe?", "Als die Frau sich zum Schlafen ins Stroh legte, rückten sie ganz nah an sie heran.", "Mit ihrer dicken Wolle hielten sie die Frau warm."] },
  10: { 1: ["nacht", "still"],
    2: ["Es ist Nacht.", "Alle schlafen.", "Es ist still."],
    3: ["Jetzt ist es Nacht.", "Es ist dunkel und ganz still.", "Alle im Stall schlafen.", "Im Stall ist es warm."],
    4: ["Dann wurde es Nacht.", "Still und dunkel lag der Stall im Schnee.", "Alle, die darin waren, ruhten sich aus."] },
  11: { 1: ["baby", "stern"],
    2: ["In der Nacht kommt ein Baby.", "Alle Sterne leuchten.", "Ein Stern ist ganz hell."],
    3: ["Mitten in der Nacht bekommt die Frau ein Baby.", "Da leuchten alle Sterne am Himmel.", "Ein Stern ist besonders groß und hell.", "Er steht über dem Stall."],
    4: ["Mitten in der Nacht bekam die Frau ein Kind.", "Plötzlich leuchteten alle Sterne am Himmel.", "Am hellsten von allen strahlte ein großer Stern – genau über dem Stall."] },
  12: { 1: ["hirten", "hund", "stern"],
    2: ["Da sind Hirten.", "Sie sehen den Stern.", "Sie gehen zum Stall."],
    3: ["In der Nacht sind Hirten auf dem Feld.", "Sie holen ihre Schafe.", "Da sehen sie den hellen Stern.", "Er steht über ihrem Stall!", "Die Hirten fragen: „Warum leuchtet der Stern da?“", "Sie gehen zu ihrem Stall."],
    4: ["In dieser Nacht waren Hirten draußen auf den Feldern.", "Es war schon Winter, und sie wollten die letzten Schafe heimbringen.", "Da sahen sie den Stern über ihrem eigenen Stall, und der ganze Himmel war hell.", "„Was ist dort geschehen?“, fragten sie sich.", "Schnell liefen sie durch den Schnee zu ihrem Stall."] },
  13: { 1: ["hirten", "baby", "mutterbaby"],
    2: ["Die Hirten sind im Stall.", "Da ist ein Baby.", "Die Hirten staunen."],
    3: ["Die Hirten kommen in ihren Stall.", "Dort finden sie ein Baby.", "Es liegt bei der Mutter im Arm.", "Die Hirten sagen: „Der Stern leuchtet für das Baby.“"],
    4: ["Im Stall fanden die Hirten ein neugeborenes Kind in den Armen seiner Mutter.", "Da verstanden sie: Der Stern leuchtete wegen dieses Kindes.", "In ihrem Stall war noch nie ein Kind zur Welt gekommen."] },
  15: { 1: ["krippe", "baby", "pferd"],
    2: ["Das Baby ist müde.", "Da ist kein Bett.", "Das Baby schläft in der Krippe."],
    3: ["Das Baby muss schlafen.", "Aber im Stall gibt es kein Bett.", "Es gibt nur eine Krippe.", "Die Mutter legt das Baby hinein.", "Das Pferd steht daneben und schaut zu."],
    4: ["Nun sollte das Kind schlafen.", "Doch ein Bettchen gab es im Stall nicht, nur die Futterkrippe.", "Dort hinein legte die Mutter ihr Kind.", "Das Pferd stand still daneben, als ob es wüsste, dass das Kind seine Krippe jetzt brauchte."] },
  16: { 1: ["stern", "weihnachten"],
    2: ["Das Baby schläft.", "Alle sind still.", "Der Stern leuchtet.", "Das ist Weihnachten."],
    3: ["Das Baby schläft in der Krippe.", "Die Tiere und die Hirten sind ganz still.", "Über dem Stall leuchtet der Stern.", "Das ist Weihnachten – das allererste Weihnachten.", "Jetzt ist die Geschichte der Mutter zu Ende."],
    4: ["Die ganze Nacht schlief das Kind in der Krippe.", "Niemand sprach ein Wort, Tiere und Hirten schauten nur.", "Hell stand der Stern über dem Stall.", "So war es damals, beim allerersten Weihnachten.", "Und die Mutter? Sie war mit ihrer Geschichte fertig."] }
};
W.mutterbaby = { w: "Mutter", sign: "MUTTER", d: () => at(0, 4, 1.6, ART.frau({ baby: true })) };

/* Aufgaben-Daten je Tür und Stufe (je 2 Aufgaben):
   Stufe 1: im = Bildwort, das im Szenenbild ist (hl = markierter Teil), nicht = Bildwort, das nicht im Bild ist; wort = Bildwort, x = falsches Bild
   Stufe 2: bild → drei Wörter (a = richtig); satz → drei Bilder; zahl = Zählaufgabe
   Stufe 3: st = Aussage (ok true/false), q = Frage mit a (richtig) und x (falsch); h = Nummer des Satzes, den die Hilfe markiert
   Stufe 4: q = Warum-Frage; teil = Satzanfang mit drei Enden */
const AUFG = {
  1: { 1: [{ im: "mutter", nicht: "pferd" }, { wort: "kind", x: "huhn" }],
    2: [{ bild: "kind", w: ["kind", "mutter", "baby"] }, { satz: "Die Mutter erzählt.", b: ["mutter", "pferd", "hirten"] }],
    3: [{ st: "Das Kind erzählt eine Geschichte.", ok: false, h: 2 }, { q: "Wer erzählt?", a: "die Mutter", x: ["das Kind", "der Mann"], h: 2 }],
    4: [{ q: "Warum erzählte die Mutter eine Geschichte?", a: "Das Kind wollte etwas über Weihnachten hören.", x: ["Das Kind konnte nicht schlafen.", "Die Mutter hatte ein neues Buch."], h: 1 },
      { teil: "Das Kind saß …", a: "bei seiner Mutter auf dem Schoß.", x: ["bei den Hirten auf dem Feld.", "bei den Schafen im Stroh."], h: 0 }] },
  2: { 1: [{ im: "frau", nicht: "kuh" }, { wort: "schnee", x: "stroh" }],
    2: [{ bild: "schnee", w: ["schnee", "stroh", "stern"] }, { satz: "Es ist kalt.", b: ["kalt", "warm", "milch"] }],
    3: [{ st: "Am Himmel sind viele Sterne.", ok: false, h: 5 }, { q: "Wie sind der Mann und die Frau?", a: "sehr müde", x: ["sehr froh", "sehr laut"], h: 2 }],
    4: [{ q: "Warum half niemand dem Mann und der Frau?", a: "Die Menschen in den Häusern schliefen schon.", x: ["Die Menschen feierten ein Fest.", "Die Menschen suchten ihre Schafe."], h: 3 },
      { teil: "Der Mann und die Frau suchten …", a: "einen Platz zum Schlafen.", x: ["ihre Schafe im Schnee.", "einen Stern am Himmel."], h: 2 }] },
  3: { 1: [{ im: "laterne", hl: "mann", nicht: "milch" }, { wort: "stall", x: "krippe" }],
    2: [{ bild: "laterne", w: ["laterne", "stern", "tuer"] }, { satz: "Da ist ein Stall.", b: ["stall", "krippe", "tuer"] }],
    3: [{ st: "Der Mann öffnet die Tür.", ok: true, h: 1 }, { q: "Womit leuchtet der Mann?", a: "mit der Laterne", x: ["mit dem Stern", "mit dem Feuer"], h: 2 }],
    4: [{ q: "Warum hoffte der Mann auf Tiere im Stall?", a: "Wo Tiere sind, ist es warm.", x: ["Er wollte ein Pferd kaufen.", "Er hatte Angst vor Tieren."], h: 3 },
      { teil: "Der Mann öffnete die Tür …", a: "und hielt seine Laterne hinein.", x: ["und legte sich ins Stroh.", "und melkte die Kuh."], h: 1 }] },
  5: { 1: [{ im: "huhn", nicht: "hund" }, { wort: "pferd", x: "kuh" }],
    2: [{ zahl: "schafe", n: 5, w: [4, 5, 6] }, { bild: "huhn", w: ["huhn", "hund", "kuh"] }],
    3: [{ zahl: "schafe", n: 5, w: [3, 4, 5, 6] }, { st: "Im Stall ist ein Hund.", ok: false, h: 0 }],
    4: [{ q: "Warum wurden die Tiere wach?", a: "Die Tür knarrte.", x: ["Das Baby weinte.", "Der Hund bellte."], h: 2 },
      { teil: "Im Licht der Laterne …", a: "sahen die Tiere die Frau.", x: ["melkte der Mann die Kuh.", "zählten die Hirten die Schafe."], h: 3 }] },
  6: { 1: [{ im: "pferd", nicht: "huhn" }, { wort: "warm", x: "kalt" }],
    2: [{ satz: "Das Pferd ist warm.", b: ["pferd", "kuh", "huhn"] }, { bild: "hand", w: ["hand", "hund", "huhn"] }],
    3: [{ st: "Die Frau legt die Hände unter die Mähne.", ok: true, h: 3 }, { q: "Wer wärmt die Hände der Frau?", a: "das Pferd", x: ["die Kuh", "der Mann"], h: 2 }],
    4: [{ q: "Warum schob die Frau ihre Finger in die Mähne?", a: "Ihre Finger waren eiskalt.", x: ["Sie wollte das Pferd kämmen.", "Sie wollte auf dem Pferd reiten."], h: 3 },
      { teil: "Das Pferd blieb ganz still stehen, …", a: "als die Frau ihre Finger in seiner Mähne wärmte.", x: ["als die Hirten den Stern sahen.", "als die Kuh Milch gab."], h: 3 }] },
  7: { 1: [{ im: "milch", nicht: "stern" }, { wort: "kuh", x: "pferd" }],
    2: [{ satz: "Die Frau trinkt Milch.", b: ["milch", "stroh", "laterne"] }, { bild: "kuh", w: ["kuh", "huhn", "pferd"] }],
    3: [{ st: "Die Milch ist kalt.", ok: false, h: 3 }, { q: "Was trinkt die Frau?", a: "Milch", x: ["Wasser", "Tee"], h: 3 }],
    4: [{ q: "Warum tat die Milch der Frau gut?", a: "Die Frau hatte Hunger und fror.", x: ["Die Frau mochte keine Milch.", "Die Frau wollte nach Hause."], h: 2 },
      { teil: "Die Kuh hielt ganz still, …", a: "während die Frau sie melkte.", x: ["während das Kind in der Krippe schlief.", "während die Hirten nach Hause liefen."], h: 1 }] },
  8: { 1: [{ im: "schaf", hl: "schafe", nicht: "kuh" }, { wort: "stroh", x: "schnee" }],
    2: [{ satz: "Sie schläft im Stroh.", b: ["stroh", "schnee", "krippe"] }, { bild: "schafe", w: ["schafe", "schnee", "stall"] }],
    3: [{ st: "Die Schafe legen sich zu der Frau.", ok: true, h: 2 }, { q: "Wo schläft die Frau?", a: "im Stroh", x: ["im Bett", "im Schnee"], h: 1 }],
    4: [{ q: "Warum war der Frau im Stroh warm?", a: "Die Schafe wärmten sie mit ihrer Wolle.", x: ["Im Stall brannte ein Feuer.", "Der Mann gab ihr eine Decke."], h: 2 },
      { teil: "Die Schafe rückten ganz nah an die Frau heran, …", a: "als sie sich ins Stroh legte.", x: ["als sie die Kuh melkte.", "als sie die Tür öffnete."], h: 1 }] },
  10: { 1: [{ im: "stall", nicht: "hirten" }, { wort: "nacht", x: "laterne" }],
    2: [{ satz: "Es ist Nacht.", b: ["nacht", "milch", "hand"] }, { bild: "still", w: ["still", "warm", "kalt"] }],
    3: [{ st: "Im Stall ist es kalt.", ok: false, h: 3 }, { q: "Was machen alle im Stall?", a: "Sie schlafen.", x: ["Sie essen.", "Sie singen."], h: 2 }],
    4: [{ q: "Warum war es im Stall so still?", a: "Alle ruhten sich aus.", x: ["Alle waren weggegangen.", "Alle warteten auf die Hirten."], h: 2 },
      { teil: "Still und dunkel …", a: "lag der Stall im Schnee.", x: ["leuchtete der Stern am Himmel.", "knarrte die Tür im Wind."], h: 1 }] },
  11: { 1: [{ im: "stern", nicht: "hund" }, { wort: "baby", x: "mann" }],
    2: [{ bild: "stern", w: ["stern", "stall", "stroh"] }, { satz: "In der Nacht kommt ein Baby.", b: ["baby", "kind", "hirten"] }],
    3: [{ st: "Der große Stern steht über dem Stall.", ok: true, h: 3 }, { q: "Wann kommt das Baby?", a: "mitten in der Nacht", x: ["am Morgen", "am Mittag"], h: 0 }],
    4: [{ q: "Warum leuchteten plötzlich alle Sterne?", a: "Das Kind war geboren.", x: ["Die Nacht war vorbei.", "Der Mann zündete die Laterne an."], h: 0 },
      { teil: "Am hellsten strahlte ein großer Stern …", a: "genau über dem Stall.", x: ["weit hinten über dem Wald.", "tief unten im Schnee."], h: 2 }] },
  12: { 1: [{ im: "hund", nicht: "kuh" }, { wort: "hirten", x: "frau" }],
    2: [{ bild: "hirten", w: ["hirten", "hund", "huhn"] }, { satz: "Sie sehen den Stern.", b: ["stern", "laterne", "stroh"] }],
    3: [{ st: "Die Hirten sehen den Stern.", ok: true, h: 2 }, { q: "Wohin gehen die Hirten?", a: "zu ihrem Stall", x: ["in den Wald", "in die Stadt"], h: 5 }],
    4: [{ q: "Warum waren die Hirten in der Nacht auf den Feldern?", a: "Sie wollten die letzten Schafe heimbringen.", x: ["Sie wollten den Stern suchen.", "Sie konnten nicht schlafen."], h: 1 },
      { teil: "Schnell liefen die Hirten …", a: "durch den Schnee zu ihrem Stall.", x: ["über die Felder in die Stadt.", "mit der Laterne in den Wald."], h: 4 }] },
  13: { 1: [{ im: "baby", hl: "frau", nicht: "milch" }, { wort: "hirten", x: "schafe" }],
    2: [{ satz: "Die Hirten sind im Stall.", b: ["hirten", "schafe", "kuh"] }, { bild: "baby", w: ["baby", "kind", "mann"] }],
    3: [{ st: "Das Baby liegt im Stroh.", ok: false, h: 2 }, { q: "Was finden die Hirten im Stall?", a: "ein Baby", x: ["ein Schaf", "einen Stern"], h: 1 }],
    4: [{ q: "Warum leuchtete der Stern über dem Stall?", a: "Im Stall war ein Kind geboren.", x: ["Im Stall brannte eine Laterne.", "Die Hirten hatten sich verlaufen."], h: 1 },
      { teil: "Die Hirten fanden ein neugeborenes Kind …", a: "in den Armen seiner Mutter.", x: ["auf dem Rücken des Pferdes.", "draußen im tiefen Schnee."], h: 0 }] },
  15: { 1: [{ im: "pferd", nicht: "kuh" }, { wort: "krippe", x: "stroh" }],
    2: [{ bild: "krippe", w: ["krippe", "stroh", "stall"] }, { satz: "Das Baby schläft in der Krippe.", b: ["krippe", "stroh", "tuer"] }],
    3: [{ st: "Im Stall gibt es ein Bett.", ok: false, h: 1 }, { q: "Wer schaut zu?", a: "das Pferd", x: ["die Kuh", "das Huhn"], h: 4 }],
    4: [{ q: "Warum legte die Mutter das Kind in die Krippe?", a: "Im Stall gab es kein Bettchen.", x: ["Das Pferd hatte keinen Hunger.", "Das Kind wollte beim Pferd sein."], h: 1 },
      { teil: "Das Pferd stand still daneben, …", a: "als ob es wüsste, dass das Kind die Krippe brauchte.", x: ["weil es Angst vor den Hirten hatte.", "bis die Kuh es weckte."], h: 3 }] },
  16: { 1: [{ im: "baby", hl: "krippe", nicht: "tuer" }, { wort: "weihnachten", x: "nacht" }],
    2: [{ satz: "Der Stern leuchtet.", b: ["stern", "schnee", "stroh"] }, { satz: "Alle sind still.", b: ["still", "hunger", "kalt"] }],
    3: [{ st: "Die Tiere und die Hirten sind ganz still.", ok: true, h: 1 }, { q: "Wo schläft das Baby?", a: "in der Krippe", x: ["im Stroh", "im Bett"], h: 0 }],
    4: [{ q: "Warum heißt die Geschichte „Weihnachten im Stall“?", a: "Das allererste Weihnachten war in einem Stall.", x: ["Die Mutter wohnt in einem Stall.", "Im Stall steht ein Weihnachtsbaum."], h: 3 },
      { teil: "Die ganze Nacht schlief das Kind …", a: "in der Krippe.", x: ["auf dem Feld.", "im Schnee."], h: 0 }] }
};
/* Tür 9 „Wer hilft der Frau?“: Was braucht die Frau → wer hilft */
const HILFE = [
  { not: "kalt", notW: "Die Hände sind kalt.", tier: "pferd", s3: "Die Hände der Frau sind kalt. Wer hilft?", a3: "das Pferd", s4: "Die Frau hatte eiskalte Finger. Wer half ihr – und wie?", a4: "Das Pferd: Sie wärmte die Finger in seiner Mähne.", tuer: 6 },
  { not: "hunger", notW: "Die Frau hat Hunger.", tier: "kuh", s3: "Die Frau hat Hunger. Wer hilft?", a3: "die Kuh", s4: "Die Frau hatte Hunger. Wer half ihr – und wie?", a4: "Die Kuh: Sie gab der Frau warme Milch.", tuer: 7 },
  { not: "muede", notW: "Die Frau ist müde.", tier: "schafe", s3: "Die Frau ist müde und will schlafen. Wer hilft?", a3: "die Schafe", s4: "Die Frau wollte im Stroh schlafen. Wer half ihr – und wie?", a4: "Die Schafe: Sie hielten die Frau mit ihrer Wolle warm.", tuer: 8 }
];
/* Reihenfolge-Aufgaben der Wiederholungs-Türen und der letzten Tür, je Stufe */
const FOLGE = {
  4: { 1: [1, 3], 2: [1, 2, 3], 3: [1, 2, 3], 4: [1, 2, 3] },
  14: { 1: [10, 13], 2: [10, 11, 13], 3: [10, 11, 12, 13], 4: [10, 11, 12, 13] },
  16: { 1: [3, 15], 2: [2, 5, 11], 3: [2, 6, 11, 13], 4: [3, 8, 12, 15] }
};

/* ---------- 5. Medien: gebärdete Fassung (YouTube) und Vorlese-Aufnahme ----------
   video: Adresse des YouTube-Videos (leer = „Video kommt bald“); vMarke: Tür → Startsekunde.
   audioUrl: Adresse der ganzen Aufnahme für die Weitergabe-Fassung (leer = Knopf fehlt); aMarke: Tür → Startsekunde.
   Eingebettete Aufnahmen je Tür (nur Klassen-Fassung): imgSrc-Tabelle TON (siehe build.py --images). */
const MEDIEN = { video: "", vMarke: {}, audioUrl: "", aMarke: {} };

/* ---------- 6. Aufgaben bauen ---------- */
const STUFEN = ["s1", "s2", "s3", "s4"];
const stufeNr = l => STUFEN.indexOf(l) + 1;
const P = t => '<span class="ptext">' + t + '</span>';
const satzBox = t => '<div class="satz">' + t + '</div>';
const EYE = ms => ({ icon: ICON.eye, text: "", ms: ms || 3000 });
/* Text einer Tür; hl = Nummer des Satzes, der gelb markiert wird */
function textHTML(d, lv, hl) {
  const t = TEXT[d][lv];
  if (lv === 1) return '<div class="wchips">' + t.map(k => '<span class="chip1">' + pic(k, "cpic") + gb(k, "mini") + '<b>' + W[k].w + '</b></span>').join("") + '</div>';
  return '<div class="lesetext st' + lv + '">' + t.map((s, i) => '<span class="' + (i === hl ? "mark" : "") + '">' + s + '</span>').join(" ") + '</div>';
}
function textAns(a, x, cls) {
  return shuffle([{ v: "a", html: '<span class="' + cls + '">' + a + '</span>' }].concat(x.map((t, i) => ({ v: "x" + i, html: '<span class="' + cls + '">' + t + '</span>' }))));
}
function zaehlen(d, t) {
  return { prompt: pic("schaf", "mini") + P("Wie viele Schafe?"), show: scene(d), layout: "nums",
    answers: t.w.map(v => ({ v: String(v), html: '<span class="num">' + v + '</span>' })), answer: String(t.n),
    hint: { tap: { show: scene(d, { taps: t.zahl }), target: t.n, sign: pic("schaf", "mini"), text: "Tippe jedes Schaf an." } },
    sol: { show: scene(d, { taps: t.zahl }), text: t.n + " Schafe" } };
}
function aufgabe(d, lv, i) {
  const t = AUFG[d][lv][i];
  if (t.zahl) return zaehlen(d, t);
  if (lv === 1 && t.im) {
    const hl = t.hl || t.im;
    return { prompt: '<span class="pico">' + ICON.eye + '</span>' + P("Was ist im Bild?"), show: scene(d), layout: "two",
      answers: shuffle([t.im, t.nicht]).map(v => ({ v, html: pic(v) })), answer: t.im,
      hint: { wait: Object.assign(EYE(2500), { show: scene(d, { hl }) }) }, sol: { show: scene(d, { hl }), text: picWord(t.im) } };
  }
  if (lv === 1) return { prompt: (gb(t.wort) || pic(t.wort, "mini")) + P(W[t.wort].w), show: "", layout: "two", /* mit Gebärde: Gebärde → Bild; ohne: Bild → gleiches Bild */
    answers: shuffle([t.wort, t.x]).map(v => ({ v, html: pic(v) })), answer: t.wort,
    hint: { wait: Object.assign(EYE(2500), { show: scene(d, { hl: t.wort }) }) }, sol: { text: picWord(t.wort) } };
  if (t.bild) {
    const opts = shuffle(t.w);
    return { prompt: P("Was ist das?"), show: pic(t.bild), layout: "names",
      answers: opts.map(v => ({ v, html: wordHTML(v) })), answer: t.bild,
      hint: { wait: Object.assign(EYE(3000), { answers: opts.map(v => ({ v, html: pic(v, "apic") + wordHTML(v) })) }) }, sol: { text: picWord(t.bild) } };
  }
  if (t.satz) {
    const opts = shuffle(t.b);
    return { prompt: P(t.satz), show: "", layout: "wide",
      answers: opts.map(v => ({ v, html: pic(v) })), answer: t.b[0],
      hint: { wait: Object.assign(EYE(3000), { show: scene(d), answers: opts.map(v => ({ v, html: pic(v) + wordHTML(v) })) }) }, sol: { show: scene(d), text: picWord(t.b[0]) } };
  }
  const hilfe = textHTML(d, lv, t.h);
  if (t.st) return { prompt: P("Stimmt das?"), show: satzBox(t.st), layout: "two",
    answers: [{ v: "ja", html: '<span class="jn ja">' + ICON.ok + '</span><span class="name">stimmt</span>' }, { v: "nein", html: '<span class="jn nein">' + KREUZ + '</span><span class="name">stimmt nicht</span>' }], answer: t.ok ? "ja" : "nein",
    hint: { wait: Object.assign(EYE(4500), { show: satzBox(t.st) + hilfe }) }, sol: { show: satzBox(t.st) + hilfe, text: t.ok ? "Das stimmt." : "Das stimmt nicht." } };
  if (t.teil) return { prompt: P("Wie geht der Satz weiter?"), show: satzBox(t.teil), layout: "col",
    answers: textAns(t.a, t.x, "lang"), answer: "a",
    hint: { wait: Object.assign(EYE(5000), { show: satzBox(t.teil) + hilfe }) }, sol: { show: hilfe, text: t.a } };
  return { prompt: P(t.q), show: "", layout: lv === 4 ? "col" : "wide", /* kein Szenenbild: es würde die Antwort verraten */
    answers: textAns(t.a, t.x, lv === 4 ? "lang" : "kurz"), answer: "a",
    hint: { wait: Object.assign(EYE(lv === 4 ? 5000 : 4500), { show: hilfe }) }, sol: { show: hilfe, text: t.a } };
}
const KREUZ = '<svg viewBox="0 0 40 40" fill="none" stroke="#9c2a1f" stroke-width="5" stroke-linecap="round"><path d="M10 10l20 20M30 10L10 30"/></svg>';
const thumb = d => scene(d, { cls: "thumb" });
/* Reihenfolge: Stufe 1 = „Was war zuerst?“ (zwei Bilder), ab Stufe 2 Bilder in Kästchen legen */
function folge(liste, lv) {
  if (lv === 1) return { prompt: '<span class="pico">' + ICON.eye + '</span>' + P("Was war zuerst?"), show: "", layout: "two",
    answers: shuffle(liste).map(v => ({ v: String(v), html: thumb(v) })), answer: String(liste[0]),
    hint: { wait: EYE(2500) }, sol: { text: "" } };
  return { prompt: P("Was passiert zuerst? Lege die Bilder der Reihe nach."), show: "", layout: "folge",
    build: { n: liste.length, answer: liste.map(String),
      view: arr => '<div class="fslots">' + arr.map((v, i) => '<button class="fslot" data-slot="' + i + '"><b>' + (i + 1) + '</b>' + (v ? thumb(+v) : "") + '</button>').join("") + '</div>',
      palette: shuffle(liste).map(v => ({ v: String(v), html: thumb(v) })) },
    hint: ctx => { ctx.setShow('<div class="erst"><b>1</b>' + scene(liste[0]) + '</div>'); ctx.waitHint(ICON.eye, "Das war zuerst.", 3000); },
    sol: { text: "" } };
}
function werHilft(h, lv) {
  const tiere = ["pferd", "kuh", "schafe"];
  if (lv === 1) { const x = tiere.filter(t => t !== h.tier)[Math.floor(Math.random() * 2)];
    return { prompt: '<span class="pico">' + ART_HERZ + '</span>' + P("Wer hilft?"), show: pic(h.not) + '<div class="unter">' + wordHTML(h.not) + '</div>', layout: "two",
      answers: shuffle([h.tier, x]).map(v => ({ v, html: pic(v) })), answer: h.tier,
      hint: { wait: Object.assign(EYE(3000), { show: scene(h.tuer) }) }, sol: { show: scene(h.tuer), text: picWord(h.tier) } }; }
  if (lv === 2) return { prompt: P(h.notW + " Wer hilft?"), show: pic(h.not), layout: "wide",
    answers: shuffle(tiere).map(v => ({ v, html: pic(v) })), answer: h.tier,
    hint: { wait: Object.assign(EYE(3000), { show: scene(h.tuer) }) }, sol: { show: scene(h.tuer), text: picWord(h.tier) } };
  const a = lv === 3 ? HILFE.map(x => [x.tier, x.a3]) : HILFE.map(x => [x.tier, x.a4]);
  return { prompt: P(lv === 3 ? h.s3 : h.s4), show: pic(h.not), layout: lv === 4 ? "col" : "wide",
    answers: shuffle(a).map(x => ({ v: x[0], html: '<span class="' + (lv === 4 ? "lang" : "kurz") + '">' + x[1] + '</span>' })), answer: h.tier,
    hint: { wait: Object.assign(EYE(4000), { show: scene(h.tuer) }) }, sol: { show: scene(h.tuer), text: lv === 3 ? h.a3 : h.a4 } };
}
const ART_HERZ = '<svg viewBox="-26 -26 52 52">' + ART.herz() + '</svg>';
function tuerAufgaben(n, lv) {
  if (n === 4) return [folge(FOLGE[4][lv], lv), aufgabe(1, lv, 1), aufgabe(3, lv, 0)];
  if (n === 9) return shuffle(HILFE).map(h => werHilft(h, lv));
  if (n === 14) return [folge(FOLGE[14][lv], lv), aufgabe(11, lv, 1), aufgabe(13, lv, 0)];
  if (n === 16) return [aufgabe(16, lv, 0), aufgabe(16, lv, 1), folge(FOLGE[16][lv], lv)];
  return [aufgabe(n, lv, 0), aufgabe(n, lv, 1)];
}

/* ---------- 7. Kalender, Tür-Seite, Lehrkraft ---------- */
let TUER_NR = 1, FRISCH = 0;
const lvl = () => STUFEN.includes(S.level) ? S.level : "s2";
function fertig(n, st) { st = st || S; return STUFEN.some(l => { const p = (st.prog || {})[l]; return !!(p && p["t" + n] && p["t" + n].done); }); }
function anzahlFertig(st) { return TUEREN.filter(t => fertig(t.n, st)).length; }
function tagOffen(t) { return !!S.unlockAll || Date.now() >= new Date(JAHR, 11, t.tag).getTime(); }
function istHeute(t) { const d = new Date(); return d.getFullYear() === JAHR && d.getMonth() === 11 && d.getDate() === t.tag; }
const SVG_TON = '<svg viewBox="0 0 40 40" fill="none" stroke="#1b2636" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"><path d="M6 15h7l9-8v26l-9-8H6z" fill="#fff"/><path d="M27 14q5 6 0 12M31 9q9 11 0 22"/></svg>';
const SVG_DGS = '<svg viewBox="0 0 40 40">' + at(11, 22, .3, ART.hand()) + at(29, 18, .3, ART.hand(), { flip: true }) + '</svg>';
const SVG_STERN = '<svg viewBox="-26 -26 52 52">' + star8(22) + '</svg>';

function renderKalender(box) {
  const has = n => fertig(n), nf = anzahlFertig();
  let cells = '<span class="kwt">Mo</span><span class="kwt">Di</span><span class="kwt">Mi</span><span class="kwt">Do</span><span class="kwt">Fr</span><span class="kleer"></span>';
  TUEREN.forEach(t => {
    const off = tagOffen(t), f = has(t.n);
    cells += '<button class="ktuer' + (f ? " fertig" : off ? " offen" : " zu") + (istHeute(t) && !f ? " heute" : "") + '" data-n="' + t.n + '" aria-label="Tür ' + t.n + '">'
      + '<b>' + t.n + '</b>' + (f ? '<span class="kst">' + SVG_STERN + '</span>' : off ? "" : '<span class="kdat">' + t.tag + '.12.</span>') + '</button>';
  });
  box.innerHTML = '<div class="wis"><div class="wisbild card' + (FRISCH ? " frisch" : "") + '">' + homeScene(has)
    + '<div class="wisz"><span class="kst">' + SVG_STERN + '</span><b>' + nf + '</b> / 16</div></div><div class="kal">' + cells + '</div></div>';
  box.querySelectorAll(".ktuer").forEach(b => b.onclick = () => {
    const t = TUER(+b.dataset.n);
    if (!tagOffen(t)) { note("Diese Tür öffnet sich am " + t.tag + ". Dezember."); return; }
    TUER_NR = t.n; go("door");
  });
  if (FRISCH) { if (FRISCH === 16) confetti(160); FRISCH = 0; }
}
function renderTuer() {
  const t = TUER(TUER_NR), lv = stufeNr(lvl()), f = fertig(t.n), p = (S.prog[lvl()] || {})["t" + t.n];
  $("tuerTitel").textContent = "Tür " + t.n + " · " + t.titel;
  const ton = (typeof TON !== "undefined" && TON[t.n]) || "";
  let links, rechts;
  if (t.rev) {
    links = '<div class="revbilder">' + t.rev.map(d => thumb(d)).join("") + '</div>';
    rechts = '<div class="wchips"><span class="chip1">' + SVG_STERN.replace("<svg", '<svg class="cpic"') + '<b>' + t.titel + '</b></span></div>';
  } else { links = scene(t.n); rechts = textHTML(t.n, lv) + (lv > 1 && TEXT[t.n][1].some(k => gb(k)) ? '<div class="wchips klein">' + TEXT[t.n][1].map(k => '<span class="chip1">' + gb(k, "mini") + '<b>' + W[k].w + '</b></span>').join("") + '</div>' : ""); }
  $("tuerBody").innerHTML = '<div class="tuerbild card">' + links + '</div><div class="tuertext card">' + rechts + '</div>';
  $("tuerKnoepfe").innerHTML = (t.rev ? "" : (ton || MEDIEN.audioUrl ? '<button class="medbtn" id="btnTon">' + SVG_TON + '<span>Vorlesen</span></button>' : "")
    + '<button class="medbtn" id="btnDgs">' + SVG_DGS + '<span>Gebärden-Video</span></button>')
    + (p && p.done ? '<span class="tuerfertig"><span class="kst">' + SVG_STERN + '</span>' + p.stars + ' / ' + sizeOf(lvl(), "t" + t.n) + '</span>' : "")
    + '<button class="next" id="btnAufg">' + (f ? "Nochmal" : "Aufgaben") + ' ' + ICON.next + '</button>';
  $("btnAufg").onclick = () => { stopTon(); S.level = lvl(); startMission("t" + t.n); };
  const bd = $("btnDgs"); if (bd) bd.onclick = () => {
    if (!MEDIEN.video) { note("Das Gebärden-Video kommt bald."); return; }
    const sek = MEDIEN.vMarke[t.n] || 0, u = MEDIEN.video + (MEDIEN.video.includes("?") ? "&" : "?") + "t=" + sek + "s&z=" + Date.now();
    let w = null; try { w = window.open(u, "_blank"); } catch (e) { } if (!w) note("Das Video lässt sich hier nicht öffnen.");
  };
  const bt = $("btnTon"); if (bt) bt.onclick = () => {
    if (ton) { const a = $("tuerTon"); if (a.dataset.n !== String(t.n)) { a.src = ton; a.dataset.n = String(t.n); }
      if (a.paused) { a.play().catch(() => note("Der Ton lässt sich gerade nicht abspielen.")); bt.classList.add("an"); a.onended = () => bt.classList.remove("an"); } else { a.pause(); bt.classList.remove("an"); } return; }
    let w = null; try { w = window.open(MEDIEN.audioUrl + (MEDIEN.aMarke[t.n] ? "#t=" + MEDIEN.aMarke[t.n] : ""), "_blank"); } catch (e) { } if (!w) note("Die Aufnahme lässt sich hier nicht öffnen.");
  };
}
function stopTon() { const a = $("tuerTon"); if (a && !a.paused) a.pause(); }
/* eigener Bildschirm „Tür“ (der Baukasten kennt ihn über APP.route / APP.onScreen) */
(function () {
  const s = document.createElement("section"); s.id = "door"; s.className = "screen";
  s.innerHTML = '<div class="top"><button class="iconbtn" id="tuerZurueck" aria-label="Zurück"></button><div class="prompt card" style="margin:0;flex:1"><span class="ptext" id="tuerTitel"></span></div></div>'
    + '<div class="tuerbody" id="tuerBody"></div><div class="tuerknoepfe" id="tuerKnoepfe"></div><audio id="tuerTon" preload="none"></audio>';
  document.body.insertBefore(s, document.getElementById("info"));
  s.querySelector("#tuerZurueck").innerHTML = ICON.back;
  s.querySelector("#tuerZurueck").onclick = () => { stopTon(); go("start"); };
})();

/* ---------- 8. App-Beschreibung (Vertrag mit dem Baukasten) ---------- */
const zahlIcon = n => '<circle cx="100" cy="100" r="80" fill="#1c2b4a" stroke="#1b2636" stroke-width="8"/><text x="100" y="132" text-anchor="middle" font-size="92" font-weight="800" fill="#ffd94a" font-family="system-ui,sans-serif">' + n + '</text>';
const TMISS = TUEREN.map(t => "t" + t.n);
const APP = {
  id: "weihnachten-im-stall",
  title: "Weihnachten im Stall",
  subtitle: "Öffne jeden Tag eine Tür.",
  credit: "mit KI erstellt · geprüft: J. Schneider · nach Astrid Lindgren, „Weihnachten im Stall“ (Oetinger) · Schrift: Andika (SIL OFL)" + (hasSigns() ? " · Gebärdenbilder: © Verlag Karin Kestner, kestner.app" : ""),
  crownLabel: "Das allererste Weihnachten",
  hero: () => "",
  parallel: true,
  unlockAllLabel: "Alle Türen öffnen (ohne Datum)",
  keepOnReset: ["level"],
  levels: STUFEN.map((id, i) => ({ id, marks: "★".repeat(i + 1), label: "Stufe " + (i + 1), missions: TMISS })),
  missions: TUEREN.reduce((m, t) => { m["t" + t.n] = { name: "Tür " + t.n + " · " + t.titel, icon: () => zahlIcon(t.n) }; return m; }, {}),
  buildTasks(level, mid) { return tuerAufgaben(+mid.slice(1), stufeNr(level)); },
  renderStart: renderKalender,
  route(id) { if (id === "map") { if (FRISCH) return "start"; return "door"; } return id; },
  onScreen(id) { if (id === "door") renderTuer(); },
  onMissionDone(o) { FRISCH = +o.mid.slice(1); },
  score: st => anzahlFertig(st) / 16,
  reached: st => "Stufe " + (STUFEN.includes(st.level) ? stufeNr(st.level) : 2) + " · " + anzahlFertig(st) + "/16 Türen" + (st.unlockAll ? " (alle offen)" : ""),
  teacher: {
    html: () => '<p class="lchead">Lesestufe dieses Kindes</p><div class="stufenwahl">' + STUFEN.map((l, i) => '<button class="stufebtn" data-l="' + l + '"><b>' + (i + 1) + '</b><span>' + ["Bildwörter", "kurze Sätze", "Sätze", "Präteritum"][i] + '</span></button>').join("") + '</div>',
    wire(root) { root.querySelectorAll(".stufebtn").forEach(b => b.addEventListener("click", () => { S.level = b.dataset.l; save(); renderSwitches(); toast("Stufe " + stufeNr(S.level) + " eingestellt."); })); },
    render(root) { root.querySelectorAll(".stufebtn").forEach(b => b.classList.toggle("on", b.dataset.l === lvl())); }
  },
  board: {
    w1: { label: "Tür 1–3", cards: () => tafelKarten([1, 2, 3]) },
    w2: { label: "Tür 5–8", cards: () => tafelKarten([5, 6, 7, 8]) },
    w3: { label: "Tür 10–13", cards: () => tafelKarten([10, 11, 12, 13]) },
    w4: { label: "Tür 15–16", cards: () => tafelKarten([15, 16]) },
    hilft: { label: "Wer hilft?", cards: () => shuffle(HILFE).map(h => ({ html: pic(h.not, "big") + '<div class="satz">' + h.notW + '</div>', reveal: '<div class="rv">' + pic(h.tier) + wordHTML(h.tier) + '</div>' })) }
  },
  info: '<p><b>Adventskalender zur Geschichte:</b> 16 Türen für die Schultage vom 1. bis 22. Dezember ' + JAHR + '. Jede Tür öffnet sich an ihrem Tag und bleibt offen; verpasste Türen können jederzeit nachgeholt werden. Mit dem Schalter „Alle Türen öffnen“ ist die App frei nutzbar.</p>'
    + '<p><b>Eine Tür:</b> Bild und Text der Szene ansehen (dazu Gebärden-Video und Vorlesen, sobald hinterlegt), dann 2–3 Aufgaben. Für jede gelöste Tür kommt im Stall-Bild der Startseite etwas dazu. Türen 4, 9 und 14 wiederholen.</p>'
    + '<p><b>Vier Lesestufen</b> (oben einstellen, gilt für dieses Kind): 1 = Bildwörter, immer zwei Antworten · 2 = Zwei- bis Dreiwortsätze · 3 = kurze Sätze im Präsens · 4 = längere Sätze im Präteritum. Ohne Einstellung gilt Stufe 2. Die Stufe kann jederzeit gewechselt werden; eine Tür gilt als gelöst, wenn sie auf irgendeiner Stufe gelöst wurde.</p>'
    + '<p><b>Texte:</b> eigene, vereinfachte Nacherzählung nach dem Bilderbuch von Astrid Lindgren (Oetinger). Bilder: eigene Zeichnungen.</p>'
};
function tafelKarten(tueren) {
  const k = [];
  tueren.forEach(d => AUFG[d][3].filter(t => t.st).forEach(t => k.push({ html: scene(d, { cls: "szene tafel" }) + '<div class="satz">' + t.st + '</div>',
    reveal: '<div class="rv">' + (t.ok ? '<span class="jn ja">' + ICON.ok + '</span>Das stimmt.' : '<span class="jn nein">' + KREUZ + '</span>Das stimmt nicht.') + '</div>' })));
  return shuffle(k);
}
