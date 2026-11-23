/* ==========================================================================
   BEISPIEL-APP „Formen-Profi“ – zeigt alle Bausteine an einem einfachen Inhalt
   (ebene Formen, Ecken zählen). Als Vorlage kopieren:
     cp -r apps/beispiel-formen apps/<neue-app>
   Gebärden: sign('WORT') – Bilder kommen beim Bauen aus einem LOKALEN Ordner
   (--signs), nie aus dem Repository. Ohne Ordner erscheinen Platzhalter.
   ========================================================================== */

/* ---------- Fachdaten ---------- */
const F = {
  kreis:   { name: "Kreis",   sign: "KREIS",   E: 0 },
  dreieck: { name: "Dreieck", sign: "DREIECK", E: 3 },
  quadrat: { name: "Quadrat", sign: "QUADRAT", E: 4 },
  rechteck:{ name: "Rechteck",sign: "RECHTECK",E: 4 },
  fuenfeck:{ name: "Fünfeck", sign: "FUENFECK",E: 5 },
  sechseck:{ name: "Sechseck",sign: "SECHSECK",E: 6 }
};
const ALL = Object.keys(F);
const COLORS = ["#2a5fc4", "#d9670a", "#157a44", "#c9245a", "#7b4bc4"];

/* Eckpunkte je Form (Koordinaten im 200er-Raster) */
function poly(n, r, rot) { const p = []; for (let i = 0; i < n; i++) { const a = (rot || -90) * Math.PI / 180 + i * 2 * Math.PI / n; p.push([100 + r * Math.cos(a), 100 + r * Math.sin(a)]); } return p; }
const PTS = {
  dreieck: poly(3, 80), quadrat: [[35, 35], [165, 35], [165, 165], [35, 165]], rechteck: [[15, 55], [185, 55], [185, 145], [15, 145]],
  fuenfeck: poly(5, 80), sechseck: poly(6, 80, 0)
};
/* Form als SVG. taps=true: Ecken als antippbare Punkte (.tp mit .mk) für die Zählhilfe */
function shapeSVG(id, opt) {
  opt = opt || {}; const c = opt.color || COLORS[0], cls = opt.cls || "vis", s = opt.scale || 1;
  const tr = 'transform="translate(' + (100 - 100 * s) + ',' + (100 - 100 * s) + ') scale(' + s + ')"';
  let body = id === "kreis" ? '<circle cx="100" cy="100" r="78" fill="' + c + '" fill-opacity=".25" stroke="' + c + '" stroke-width="6"/>'
    : '<polygon points="' + PTS[id].map(p => p.join(",")).join(" ") + '" fill="' + c + '" fill-opacity=".25" stroke="' + c + '" stroke-width="6" stroke-linejoin="round"/>';
  if (opt.taps && id !== "kreis") body += PTS[id].map(p => '<g class="tp" data-k="e"><circle cx="' + p[0] + '" cy="' + p[1] + '" r="22" fill="transparent"/><circle class="mk" cx="' + p[0] + '" cy="' + p[1] + '" r="11" fill="#fff" stroke="#c9245a" stroke-width="4" stroke-opacity=".6"/></g>').join("");
  return '<svg class="' + cls + '" viewBox="0 0 200 200"><g ' + tr + '>' + body + '</g></svg>';
}
function nameHTML(id) { return sign(F[id].sign) + '<span class="name">' + F[id].name + '</span>'; }
const dotsHTML = n => '<span style="font-size:30px;font-weight:800">' + n + '</span>';

/* ---------- Aufgaben je Mission ---------- */
function tNamen(id, pool) {
  const opts = shuffle([id].concat(pickOthers(pool, id, 3)));
  return { prompt: sign("WIE_HEISST"), show: shapeSVG(id, { color: COLORS[Math.floor(Math.random() * 5)] }), layout: "names",
    answers: opts.map(v => ({ v, html: nameHTML(v) })), answer: id,
    hint: { wait: { icon: ICON.eye, text: "", ms: 2500, answers: opts.map(v => ({ v, html: shapeSVG(v, { cls: "vis", scale: .6 }) + nameHTML(v) })) } },
    sol: { text: nameHTML(id) } };
}
function tEcken(id) {
  const n = F[id].E, nums = shuffle([n].concat(pickOthers([0, 3, 4, 5, 6], n, 3)));
  /* Gebärdenvideo zur Frage, falls beim Bauen mit --videos eingebettet; sonst das Gebärdenbild */
  return { prompt: signVid("FRAGE_ECKEN", sign("ECKE")) + ' <b>?</b>', show: shapeSVG(id), layout: "nums",
    answers: nums.map(v => ({ v: String(v), html: '<span class="num">' + v + '</span>' })), answer: String(n),
    hint: id === "kreis" ? { wait: { icon: ICON.eye, ms: 2500, text: "Fahre mit dem Finger am Rand entlang." } }
      : { tap: { show: shapeSVG(id, { taps: true }), target: n, sign: sign("ECKE", "mini"), text: "Tippe jede Ecke an." } },
    sol: { show: shapeSVG(id, { taps: true }), text: n + " " + sign("ECKE", "mini") } };
}
function tFinde(n) {
  const ok = ALL.filter(x => F[x].E === n), id = ok[Math.floor(Math.random() * ok.length)];
  const opts = shuffle([id].concat(pickOthers(ALL.filter(x => F[x].E !== n), id, 3)));
  return { prompt: dotsHTML(n) + sign("ECKE"), show: "", layout: "grid",
    answers: opts.map(v => ({ v, html: shapeSVG(v, { scale: .9 }) })), answer: id,
    hint: { wait: { icon: ICON.tap, ms: 3000, text: "Zähle bei jeder Form die Ecken.",
      answers: opts.map(v => ({ v, html: shapeSVG(v, { scale: .9, taps: true }) })) } },
    sol: { text: nameHTML(id) } };
}
/* Muster fortsetzen: A B A B … */
function tMuster() {
  const [a, b] = shuffle(ALL).slice(0, 2), seq = [a, b, a, b, a];
  const opts = shuffle([b].concat(pickOthers(ALL, b, 2)));
  return { prompt: sign("WAS_KOMMT"), show: '<div style="display:flex;gap:6px;align-items:center">' + seq.map(x => shapeSVG(x, { cls: "mini", scale: .8 })).join("") + '<span style="font-size:40px">?</span></div>',
    layout: "wide", answers: opts.map(v => ({ v, html: shapeSVG(v, { scale: .8 }) })), answer: b,
    hint: { wait: { icon: ICON.eye, ms: 3000, text: "Schau: Was wiederholt sich?" } }, sol: { text: nameHTML(b) } };
}
/* Schiene: nur zwei Formen, immer zwei Antworten, kein Zählen */
const ALLTAG = [
  { id: "uhr", form: "kreis", svg: '<svg class="vis" viewBox="0 0 200 200"><circle cx="100" cy="100" r="75" fill="#fff" stroke="#1b2636" stroke-width="8"/><path d="M100 100V55M100 100h35" stroke="#1b2636" stroke-width="8" stroke-linecap="round"/></svg>' },
  { id: "teller", form: "kreis", svg: '<svg class="vis" viewBox="0 0 200 200"><circle cx="100" cy="100" r="80" fill="#f1f4f8" stroke="#9aa6b6" stroke-width="6"/><circle cx="100" cy="100" r="50" fill="none" stroke="#c3cddb" stroke-width="4"/></svg>' },
  { id: "fenster", form: "quadrat", svg: '<svg class="vis" viewBox="0 0 200 200"><rect x="35" y="35" width="130" height="130" fill="#d6ecff" stroke="#56657a" stroke-width="8"/><path d="M100 35v130M35 100h130" stroke="#56657a" stroke-width="6"/></svg>' },
  { id: "kissen", form: "quadrat", svg: '<svg class="vis" viewBox="0 0 200 200"><rect x="35" y="35" width="130" height="130" rx="10" fill="#f6c9d6" stroke="#c9245a" stroke-width="6"/></svg>' }
];
function tZwei() {
  const id = Math.random() < .5 ? "kreis" : "quadrat", opts = shuffle(["kreis", "quadrat"]);
  return { prompt: "", show: shapeSVG(id, { color: COLORS[Math.floor(Math.random() * 5)], scale: .6 + Math.random() * .4 }), layout: "two",
    answers: opts.map(v => ({ v, html: shapeSVG(v, { color: "#56657a", scale: .8 }) + sign(F[v].sign) })), answer: id,
    hint: { wait: { icon: ICON.eye, ms: 2000, text: "" } }, sol: { text: sign(F[id].sign) } };
}
function tAlltag(o) {
  const opts = shuffle(["kreis", "quadrat"]);
  return { prompt: "", show: o.svg, layout: "two", answers: opts.map(v => ({ v, html: shapeSVG(v, { color: "#56657a", scale: .8 }) })), answer: o.form,
    hint: { wait: { icon: ICON.eye, ms: 2000, text: "" } }, sol: { text: sign(F[o.form].sign) } };
}

/* ---------- App-Beschreibung (Vertrag mit dem Baukasten, siehe README) ---------- */
const APP = {
  id: "formen-profi",
  title: "Formen-Profi",
  subtitle: "Starte mit ★. Sammle Sterne für die nächste Stufe.",
  credit: "mit KI erstellt · geprüft: [Lehrkraft eintragen]",
  videoCredit: "Gebärdenvideos: [Quelle eintragen, z. B. gebaerdenlernen.de, CC BY-NC-SA]",
  crownLabel: "Formen-Profi",
  hero: () => ["dreieck", "kreis", "quadrat"].map((x, i) => shapeSVG(x, { cls: "mini", color: COLORS[i] })).join(""),
  unlockShare: 0.7,
  levels: [
    { id: "start", marks: "★", label: "Start", icons: () => shapeSVG("kreis", { cls: "mini" }), missions: ["namen", "ecken"] },
    { id: "s1", marks: "●", label: "Stufe 1", icons: () => shapeSVG("sechseck", { cls: "mini" }), missions: ["finde", "muster"] }
  ],
  track: { id: "ge", label: "Schiene", switchLabel: "Einfache Schiene auf diesem Gerät", missions: ["zwei", "alltag"],
    startHTML: () => shapeSVG("kreis", { cls: "mini" }) + shapeSVG("quadrat", { cls: "mini" }) },
  missions: {
    namen:  { name: "Namen",       icon: () => '<circle cx="100" cy="100" r="70" fill="#2a5fc4" fill-opacity=".3" stroke="#2a5fc4" stroke-width="8"/>' },
    ecken:  { name: "Ecken",       icon: () => '<polygon points="100,25 175,165 25,165" fill="#d9670a" fill-opacity=".3" stroke="#d9670a" stroke-width="8"/><circle cx="100" cy="25" r="14" fill="#c9245a"/>' },
    finde:  { name: "Finde",       icon: () => '<rect x="35" y="35" width="130" height="130" fill="#157a44" fill-opacity=".3" stroke="#157a44" stroke-width="8"/>' },
    muster: { name: "Muster",      icon: () => '<circle cx="50" cy="100" r="30" fill="#2a5fc4"/><rect x="115" y="70" width="60" height="60" fill="#d9670a"/>' },
    zwei:   { name: "Kreis oder Quadrat?", icon: () => '<circle cx="60" cy="100" r="40" fill="#2a5fc4"/><rect x="110" y="60" width="80" height="80" fill="#d9670a"/>' },
    alltag: { name: "Was passt?",  icon: () => '<circle cx="100" cy="100" r="70" fill="#fff" stroke="#1b2636" stroke-width="10"/><path d="M100 100V55M100 100h35" stroke="#1b2636" stroke-width="10"/>' }
  },
  buildTasks(level, mission) {
    if (mission === "namen") return shuffle(ALL).map(id => tNamen(id, ALL));
    if (mission === "ecken") return shuffle(ALL).map(tEcken);
    if (mission === "finde") return shuffle([3, 4, 5, 6, 3, 4]).map(tFinde);
    if (mission === "muster") return [1, 2, 3, 4].map(tMuster);
    if (mission === "zwei") return [1, 2, 3, 4, 5, 6].map(tZwei);
    if (mission === "alltag") return shuffle(ALLTAG).map(tAlltag);
    return [];
  },
  locks: {
    muster: { label: "Muster-Schlüssel", switchLabel: "Muster-Mission öffnen", missions: ["muster"], code: ["dreieck", "kreis", "quadrat"],
      keys: ALL.slice(0, 4).map(id => ({ id, html: shapeSVG(id, { scale: .8 }) })) }
  },
  board: {
    namen: { label: "Namen", cards: () => shuffle(ALL).map(id => ({ html: shapeSVG(id, { cls: "big" }), reveal: '<div class="rv">' + nameHTML(id) + '</div>' })) },
    ecken: { label: "Ecken", cards: () => shuffle(ALL.filter(x => x !== "kreis")).map(id => ({ html: shapeSVG(id, { cls: "big", taps: true }), reveal: '<div class="rv">' + F[id].E + " " + sign("ECKE") + '</div>' })) },
    schluessel: { label: "Muster-Schlüssel", cards: () => [{ html: '<div class="keyrow"><span class="lockbig">' + ICON.unlock + '</span>' + ["dreieck", "kreis", "quadrat"].map((x, i) => '<div class="keyb"><b>' + (i + 1) + '</b>' + shapeSVG(x, { cls: "" }) + '</div>').join("") + '</div>' }] }
  },
  helpLink: null, /* z. B. t => "https://<konto>.github.io/<Werkstatt>/#" + ... (Groß-/Kleinschreibung beachten!) */
  info: '<p><b>Beispiel-App:</b> zeigt alle Bausteine des Lernapp-Baukastens. Start: Namen und Ecken. Stufe 1: Formen nach Eckenzahl finden, Muster fortsetzen (gesperrt bis zum Muster-Schlüssel an der Tafel). Schiene: nur Kreis/Quadrat, immer zwei Antworten.</p>'
};
