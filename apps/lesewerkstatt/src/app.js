/* ==========================================================================
   Lesewerkstatt – Wort-Werkstatt (Strang „Wörter“), bilingual-bimodal
   Verkettung Gebärde ↔ Bild ↔ Schriftwort ↔ Fingeralphabet.
   Inhalt: Wortliste woerter.csv (WORTE, beim Zusammensetzen eingefügt), Zeichnungen src/bilder.js.
   Wortpakete = Stufen nebeneinander (APP.parallel); Lernstand je Wort mit Wiederholung; gestufter Fehlerablauf.
   Videos: Wörterbuchpaket von gebaerdenlernen.de, nur über build.py --videos (nie im Repository).
   ========================================================================== */
const W = {}; WORTE.forEach(x => { W[x.id] = x; });
const PAKETE = []; WORTE.forEach(x => { if (!PAKETE.includes(x.paket)) PAKETE.push(x.paket); });
const paketId = p => p.toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss").replace(/[^a-z0-9]/g, "");
const woerterVon = lid => WORTE.filter(x => paketId(x.paket) === lid).map(x => x.id);
const paketVon = id => paketId(W[id].paket);
const wortVon = id => W[id].w;
const hatVideo = n => typeof VIDEOS !== "undefined" && !!VIDEOS[n] && vidOn();
const PRO_MISSION = 8;

/* ---------- Lernstand je Wort: 0 neu · 1 geübt · 2 sicher (3× richtig ohne Hilfe) · 3 gefestigt (≥ 7 Tage später wieder richtig) ---------- */
const HEUTE = () => Math.floor(Date.now() / 864e5);
function wsVon(st, id) { const m = (st && st.ws) || {}; return m[id] || { s: 0, c: 0, d: 0 }; }
function ws(id) { if (!S.ws || typeof S.ws !== "object") S.ws = {}; return (S.ws[id] = S.ws[id] || { s: 0, c: 0, d: 0 }); }
const faellig = w => w.s === 2 && HEUTE() - w.d >= 7;
function wortErgebnis(t, res) {
  if (!t.wid) return;
  const w = ws(t.wid);
  if (res === "s") {
    w.c++; if (w.s < 1) w.s = 1;
    if (w.s === 1 && w.c >= 3) { w.s = 2; w.d = HEUTE(); }
    else if (faellig(w)) { w.s = 3; w.d = HEUTE(); }
  } else if (res === "h" || res === "d") { w.c = 0; w.s = Math.max(1, w.s - 1); }
  else if (w.s < 1) w.s = 1;
}
/* Auswahl: zuerst neue und geübte Wörter, dann fällige sichere, dann der Rest (jeweils gemischt) */
function auswahl(ids, n) {
  const rang = id => { const w = ws(id); return w.s <= 1 ? 0 : faellig(w) ? 1 : 2; };
  return shuffle(ids).sort((a, b) => rang(a) - rang(b)).slice(0, n);
}
function wiederholListe(n) {
  const alle = WORTE.map(x => x.id), geuebt = alle.filter(id => ws(id).s >= 1);
  const rang = id => { const w = ws(id); return faellig(w) ? 0 : w.s === 1 ? 1 : 2; };
  let l = shuffle(geuebt).sort((a, b) => rang(a) - rang(b)).slice(0, n);
  if (l.length < n) l = l.concat(shuffle(alle.filter(id => !l.includes(id))).slice(0, n - l.length));
  return l;
}

/* ---------- Symbole für die Aufgabenart (keine Schrift nötig) ---------- */
const SYM = {
  hand: '<svg viewBox="0 0 48 48"><path d="M14 44c-4-5-8-12-8-17 0-3 4-4 6-1l4 6V9c0-3 5-3 5 0v13V6c0-3 5-3 5 0v16V8c0-3 5-3 5 0v15-10c0-3 5-3 5 0v18c0 7-3 11-6 13z" fill="#f2c39b" stroke="#1b1b24" stroke-width="2.6" stroke-linejoin="round"/></svg>',
  bild: '<svg viewBox="0 0 48 48"><rect x="4" y="8" width="40" height="32" rx="5" fill="#fffdf6" stroke="#1b1b24" stroke-width="2.6"/><circle cx="34" cy="17" r="4" fill="#ffd257" stroke="#1b1b24" stroke-width="2"/><path d="M8 36l11-13 8 9 5-5 9 9z" fill="#3f8a58" stroke="#1b1b24" stroke-width="2.2" stroke-linejoin="round"/></svg>',
  wort: '<svg viewBox="0 0 48 48"><rect x="2" y="10" width="44" height="28" rx="6" fill="#fffdf6" stroke="#1b1b24" stroke-width="2.6"/><text x="24" y="31" text-anchor="middle" font-size="17" font-family="Andika,sans-serif" fill="#1b1b24">Abc</text></svg>',
  pfeil: '<svg viewBox="0 0 30 48" style="width:26px"><path d="M4 24h20M16 15l9 9-9 9" fill="none" stroke="#1b1b24" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  fa: '<svg viewBox="0 0 48 48"><path d="M16 44c-4-4-6-9-6-14l2-14c1-3 5-2 5 1v9V7c0-3 5-3 5 0v17l3-15c1-3 5-2 4 1l-3 16 6-10c2-3 6-1 4 2l-7 14c-2 9-6 12-13 12z" fill="#f2c39b" stroke="#1b1b24" stroke-width="2.4" stroke-linejoin="round"/></svg>',
  kreis: '<svg viewBox="0 0 48 48"><path d="M38 24a14 14 0 1 1-5-10.7" fill="none" stroke="#1b1b24" stroke-width="4" stroke-linecap="round"/><path d="M36 6v9h-9" fill="none" stroke="#1b1b24" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>'
};
const innen = svg => svg.replace(/<\/?svg[^>]*>/g, "");
const symZeile = (...teile) => '<span class="pico">' + teile.map(t => SYM[t]).join("") + '</span>';
const bildImg = id => '<img class="tb" src="' + bildURL(id) + '" alt="">';
const bildKarte = id => '<div class="bildkarte">' + bildImg(id) + '</div>';
const lang = id => wortVon(id).length > 9 ? " lang" : "";
const wortGross = id => '<span class="wortgross' + lang(id) + '">' + wortVon(id) + '</span>';
const ikon = (a, b) => '<g transform="translate(10,40) scale(1.9)">' + innen(SYM[a]) + '</g><g transform="translate(100,40) scale(1.9)">' + innen(SYM[b]) + '</g>';

/* ---------- Ablenker: Wörter desselben Pakets; bei Wort-Antworten ähnlich geschriebene (Hund/Huhn/Hase) ---------- */
function aehnlich(a, b) {
  a = a.toLowerCase(); b = b.toLowerCase(); let s = 0;
  if (a[0] === b[0]) s += 3; if (a.slice(0, 2) === b.slice(0, 2)) s += 2;
  s += 2 - Math.min(2, Math.abs(a.length - b.length));
  const m = new Set(a); new Set(b).forEach(c => { if (m.has(c)) s += 1; });
  return s + Math.random() * 1.5;
}
function ablenker(id, nachSchrift) {
  const rest = woerterVon(paketVon(id)).filter(x => x !== id);
  if (!nachSchrift) return shuffle(rest).slice(0, 3);
  return rest.map(x => [x, aehnlich(wortVon(id), wortVon(x))]).sort((p, q) => q[1] - p[1]).slice(0, 3).map(p => p[0]);
}

/* ---------- Hilfen (nach dem 2. Fehler Pflicht) ---------- */
function hilfeLangsam(ctx, id) {   /* Gebärde → Bild: Gebärde langsam und noch einmal */
  const v = W[id].vid;
  if (!hatVideo(v)) { ctx.waitHint(ICON.eye, "", 4000); return; }
  const vorher = VF.slow; VF.slow = true;
  ctx.setShow(signVid(v, ""));
  ctx.waitHint(SYM.hand, "Schau die Gebärde langsam an.", 6000);
  setTimeout(() => { VF.slow = vorher; if (VF.el) VF.el.playbackRate = vorher ? .5 : 1; }, 6000);
}
function hilfeFinger(ctx, id, oben) {   /* Wort-Aufgaben: das Wort im Fingeralphabet (Brücke Handform → Buchstabe) */
  const v = W[id].vidFa, n = wortVon(id).length;
  if (!hatVideo(v)) { ctx.setShow('<div class="zeile">' + oben + '<span class="anlaut">' + wortVon(id)[0] + '</span></div>'); ctx.waitHint(ICON.eye, "So fängt das Wort an.", 4000); return; }
  ctx.setShow('<div class="zeile">' + oben + signVid(v, "") + '</div>');
  ctx.waitHint(SYM.fa, "Schau das Fingeralphabet an.", Math.max(4000, n * 1100 + 800));
}

/* ---------- Aufgaben ---------- */
function aufgabe(id, art) {
  const loes = { show: '<div class="zeile">' + bildKarte(id) + wortGross(id) + '</div>', text: "" };
  if (art === "zeigen") return {   /* Gebärde → Bild */
    wid: id, prompt: symZeile("hand", "pfeil", "bild"), show: signVid(W[id].vid, wortGross(id)), layout: "grid",
    answers: shuffle([id].concat(ablenker(id, false))).map(x => ({ v: x, html: bildImg(x) })), answer: id,
    hint: ctx => hilfeLangsam(ctx, id), sol: loes
  };
  if (art === "finden") return {   /* Bild + Gebärde → Wort */
    wid: id, prompt: symZeile("bild", "hand", "pfeil", "wort"), show: '<div class="zeile">' + bildKarte(id) + signVid(W[id].vid, "") + '</div>', layout: "names",
    answers: (o => { const kl = o.some(x => lang(x)) ? " lang" : ""; return o.map(x => ({ v: x, html: '<span class="wort' + kl + '">' + wortVon(x) + '</span>' })); })(shuffle([id].concat(ablenker(id, true)))), answer: id,   /* alle Antworten gleich groß: die Schriftgröße verrät nichts */
    hint: ctx => hilfeFinger(ctx, id, bildKarte(id)), sol: loes
  };
  return {   /* Wort → Bild (lesen ohne Gebärde) */
    wid: id, prompt: symZeile("wort", "pfeil", "bild"), show: wortGross(id), layout: "grid",
    answers: shuffle([id].concat(ablenker(id, false))).map(x => ({ v: x, html: bildImg(x) })), answer: id,
    hint: ctx => hilfeFinger(ctx, id, wortGross(id)), sol: loes
  };
}
function tasksFor(level, mid) {
  if (level === "wdh") return wiederholListe(PRO_MISSION).map(id => aufgabe(id, ["zeigen", "finden", "lesen"][Math.floor(Math.random() * 3)]));
  const ids = woerterVon(level);
  return auswahl(ids, Math.min(PRO_MISSION, ids.length)).map(id => aufgabe(id, mid));
}

/* ---------- Extras: Wörter-Lexikon und „Meine Wörter“ ---------- */
function paketReiter(akt) {
  return '<div class="reiter">' + PAKETE.map(p => '<button data-p="' + paketId(p) + '" class="' + (paketId(p) === akt ? "on" : "") + '">' + p + '</button>').join("") + '</div>';
}
function lexikon(el) {
  let pk = paketId(PAKETE[0]), wahl = null, fa = false;
  const zeichne = () => {
    let d = "";
    if (wahl) {
      const v = fa ? W[wahl].vidFa : W[wahl].vid;
      d = '<div class="lexdetail">' + bildKarte(wahl) + wortGross(wahl)
        + (hatVideo(v) ? signVid(v, "") + '<button class="knopf" id="lexFa">' + (fa ? SYM.hand + " Gebärde" : SYM.fa + " Fingeralphabet") + '</button>' : "") + '</div>';
    }
    el.innerHTML = paketReiter(pk) + d + '<div class="lex">' + woerterVon(pk).map(id => '<button data-k="' + id + '" class="' + (id === wahl ? "on" : "") + '">' + bildImg(id) + wortVon(id) + '</button>').join("") + '</div>';
    el.querySelectorAll(".reiter button").forEach(b => b.onclick = () => { pk = b.dataset.p; wahl = null; fa = false; zeichne(); });
    el.querySelectorAll(".lex button").forEach(b => b.onclick = () => { wahl = b.dataset.k; fa = false; zeichne(); window.scrollTo(0, 0); });
    const f = el.querySelector("#lexFa"); if (f) f.onclick = () => { fa = !fa; zeichne(); };
    vidMountAll(el);
  };
  zeichne();
}
function punkte(s) { let h = ""; for (let i = 1; i <= 3; i++) h += '<i class="' + (i <= s ? "an s" + s : "") + '"></i>'; return '<span class="wsp">' + h + '</span>'; }
function meineWoerter(el) {
  el.innerHTML = PAKETE.map(p => '<h3 class="mwkopf">' + p + '</h3><div class="mw">' + woerterVon(paketId(p)).map(id => {
    const s = ws(id).s; return '<div class="mwk' + (s ? "" : " neu") + '" data-w="' + id + '" data-s="' + s + '">' + bildImg(id) + '<b>' + wortVon(id) + '</b>' + punkte(s) + '</div>';
  }).join("") + '</div>').join("") + '<p class="mwleg">' + punkte(1) + ' geübt ' + punkte(2) + ' sicher ' + punkte(3) + ' gefestigt</p>';
}
function zaehle(st) { const n = [0, 0, 0, 0]; WORTE.forEach(x => { const s = wsVon(st, x.id).s; n[s >= 0 && s <= 3 ? s : 0]++; }); return n; }

const APP = {
  id: "lesewerkstatt",
  title: "Lesewerkstatt",
  subtitle: "Gebärde · Bild · Wort",
  credit: "mit KI erstellt · geprüft: J. Schneider · Prototyp, Nov. 2026 · Zeichnungen: eigene (rough.js, MIT) · Schrift: Andika (SIL OFL)",
  videoCredit: "Gebärden- und Fingeralphabet-Videos: Henrike Maria Falke, gebaerdenlernen.de, CC BY-NC-SA 3.0 DE (geschnitten, verkleinert, ohne Ton)",
  crownLabel: "Lese-Profi",
  parallel: true,
  errorFlow: "stufen", errorWait: 5000, waitText: "Schau noch einmal genau.",
  hero: () => '<div class="herorow">' + ["schneemann", "stern", "katze"].map(bildImg).join("") + '</div>',
  levels: PAKETE.map(p => ({ id: paketId(p), marks: "", label: p, icons: () => '<span class="lvbild">' + bildImg(woerterVon(paketId(p))[0]) + '</span>', missions: ["zeigen", "finden", "lesen"] }))
    .concat([{ id: "wdh", marks: "", label: "Wiederholen", icons: () => '<span class="lvbild">' + SYM.kreis + '</span>', missions: ["mix"] }]),
  missions: {
    zeigen: { name: "Gebärde → Bild", icon: () => ikon("hand", "bild") },
    finden: { name: "Bild → Wort", icon: () => ikon("bild", "wort") },
    lesen: { name: "Wort → Bild", icon: () => ikon("wort", "bild") },
    mix: { name: "Gemischt", icon: () => '<g transform="translate(40,40) scale(2.5)">' + innen(SYM.kreis) + '</g>' }
  },
  buildTasks: tasksFor,
  onTaskResult: wortErgebnis,
  score: st => { const n = zaehle(st); return (n[1] + 2 * n[2] + 3 * n[3]) / (3 * WORTE.length); },
  reached: st => { const n = zaehle(st); return "sicher " + (n[2] + n[3]) + " · davon gefestigt " + n[3] + " · geübt " + n[1] + " (von " + WORTE.length + " Wörtern)"; },
  extras: [
    { id: "meine", label: "Meine Wörter", icon: () => '<image href="' + bildURL("stern") + '" x="10" y="10" width="180" height="180"/>', render: meineWoerter },
    { id: "lexikon", label: "Wörter-Lexikon", icon: () => '<image href="' + bildURL("hase") + '" x="10" y="10" width="180" height="180"/>', render: lexikon }
  ],
  board: Object.fromEntries(PAKETE.map(p => [paketId(p), { label: p + ": Wort lesen", cards: () => shuffle(woerterVon(paketId(p))).map(id => ({ html: '<span class="wortgross tafelwort' + lang(id) + '">' + wortVon(id) + '</span>', reveal: bildKarte(id) })) }])),
  info: '<p><b>Lesewerkstatt</b> (Wort-Werkstatt, Strang „Wörter“). Jedes Wort ist verkettet: Gebärde, Bild, Schriftwort und Fingeralphabet. '
    + 'Wortpakete: ' + PAKETE.map(p => p + " (" + woerterVon(paketId(p)).length + ")").join(", ") + '. Nur Einzahl, nur gut zeichenbare Nomen. '
    + 'Drei Aufgabenarten je Paket: Gebärde → Bild (DGS-Wortschatz), Bild + Gebärde → Wort (Ablenker sind ähnlich geschriebene Wörter), Wort → Bild (Lesen ohne Gebärde). '
    + '„Wiederholen“ mischt geübte und fällige Wörter aus allen Paketen.</p>'
    + '<p><b>Lernstand je Wort:</b> neu → geübt → sicher (dreimal hintereinander richtig ohne Hilfe) → gefestigt (frühestens 7 Tage später wieder richtig). '
    + 'Hilfe oder Lösung setzt ein Wort eine Stufe zurück. Die App wählt zuerst neue und geübte Wörter, dann fällige. Übersicht für das Kind: „Meine Wörter“; '
    + 'in der Klassenübersicht von LearningView steht je Kind, wie viele Wörter sicher sind.</p>'
    + '<p><b>Hilfen:</b> Gebärde → Bild: die Gebärde langsam. Wort-Aufgaben: das Wort im Fingeralphabet. Ohne Videos: der Anfangsbuchstabe.</p>'
    + '<p><b>Hinweis Videos:</b> „Handschuh“ und „Geschenk“ sind im Wörterbuch nur in der Mehrzahl aufgenommen (Mundbild „Handschuhe“, „Geschenke“).</p>'
};
