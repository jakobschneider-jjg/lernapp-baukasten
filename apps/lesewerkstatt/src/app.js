/* ==========================================================================
   Lesewerkstatt: Tiere – Prototyp der Leselern-App (Wort-Werkstatt)
   Verkettung Gebärde ↔ Bild ↔ Schriftwort ↔ Fingeralphabet, bilingual-bimodal.
   Erprobt den gestuften Fehlerablauf (APP.errorFlow = "stufen").
   Videos: Wörterbuchpaket von gebaerdenlernen.de, nur über build.py --videos (nie im Repository).
   ========================================================================== */

/* Gebärdenvideo und Fingeralphabet-Video je Tier (Namen der Dateien im Videoordner) */
const VIDS = {
  hund: { vid: "HUND", vidFa: "FA_HUND" }, katze: { vid: "KATZE", vidFa: "FA_KATZE" }, maus: { vid: "MAUS", vidFa: "FA_MAUS" },
  kuh: { vid: "KUH", vidFa: "FA_KUH" }, pferd: { vid: "PFERD", vidFa: "FA_PFERD" }, schaf: { vid: "SCHAF", vidFa: "FA_SCHAF" },
  huhn: { vid: "HUHN", vidFa: "FA_HUHN" }, schwein: { vid: "SCHWEIN", vidFa: "FA_SCHWEIN" }, ente: { vid: "ENTE", vidFa: "FA_ENTE" },
  fisch: { vid: "FISCH", vidFa: "FA_FISCH" }, vogel: { vid: "VOGEL", vidFa: "FA_VOGEL" }, hase: { vid: "HASE", vidFa: "FA_HASE" }
};
const START_TIERE = ["hund", "katze", "maus", "kuh", "schaf", "huhn"];
const ALLE_TIERE = Object.keys(TIERE);
const tiereVon = l => l === "start" ? START_TIERE : ALLE_TIERE;
const wortVon = k => TIERE[k].w;
const hatVideo = n => typeof VIDEOS !== "undefined" && !!VIDEOS[n] && vidOn();

/* kleine Symbole für die Aufgabenart (keine Schrift nötig) */
const SYM = {
  hand: '<svg viewBox="0 0 48 48"><path d="M14 44c-4-5-8-12-8-17 0-3 4-4 6-1l4 6V9c0-3 5-3 5 0v13V6c0-3 5-3 5 0v16V8c0-3 5-3 5 0v15-10c0-3 5-3 5 0v18c0 7-3 11-6 13z" fill="#f2c39b" stroke="#1b1b24" stroke-width="2.6" stroke-linejoin="round"/></svg>',
  bild: '<svg viewBox="0 0 48 48"><rect x="4" y="8" width="40" height="32" rx="5" fill="#fffdf6" stroke="#1b1b24" stroke-width="2.6"/><circle cx="34" cy="17" r="4" fill="#ffd257" stroke="#1b1b24" stroke-width="2"/><path d="M8 36l11-13 8 9 5-5 9 9z" fill="#3f8a58" stroke="#1b1b24" stroke-width="2.2" stroke-linejoin="round"/></svg>',
  wort: '<svg viewBox="0 0 48 48"><rect x="2" y="10" width="44" height="28" rx="6" fill="#fffdf6" stroke="#1b1b24" stroke-width="2.6"/><text x="24" y="31" text-anchor="middle" font-size="17" font-family="Andika,sans-serif" fill="#1b1b24">Abc</text></svg>',
  pfeil: '<svg viewBox="0 0 30 48" style="width:26px"><path d="M4 24h20M16 15l9 9-9 9" fill="none" stroke="#1b1b24" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  fa: '<svg viewBox="0 0 48 48"><path d="M16 44c-4-4-6-9-6-14l2-14c1-3 5-2 5 1v9V7c0-3 5-3 5 0v17l3-15c1-3 5-2 4 1l-3 16 6-10c2-3 6-1 4 2l-7 14c-2 9-6 12-13 12z" fill="#f2c39b" stroke="#1b1b24" stroke-width="2.4" stroke-linejoin="round"/></svg>'
};
const symZeile = (...teile) => '<span class="pico">' + teile.map(t => SYM[t]).join("") + '</span>';
const bildImg = k => '<img class="tb" src="' + tierBild(k) + '" alt="">';
const bildKarte = k => '<div class="bildkarte">' + bildImg(k) + '</div>';
const wortGross = k => '<span class="wortgross">' + wortVon(k) + '</span>';

/* Ablenker: andere Tiere derselben Stufe; bei Wort-Antworten möglichst ähnlich geschriebene Wörter (Hund/Huhn/Hase) */
function aehnlich(a, b) {
  a = a.toLowerCase(); b = b.toLowerCase(); let s = 0;
  if (a[0] === b[0]) s += 3; if (a.slice(0, 2) === b.slice(0, 2)) s += 2;
  s += 2 - Math.min(2, Math.abs(a.length - b.length));
  const m = new Set(a); new Set(b).forEach(c => { if (m.has(c)) s += 1; });
  return s + Math.random() * 1.5;
}
function ablenker(k, liste, nachSchrift) {
  const rest = liste.filter(x => x !== k);
  if (!nachSchrift) return shuffle(rest).slice(0, 3);
  return rest.map(x => [x, aehnlich(wortVon(k), wortVon(x))]).sort((p, q) => q[1] - p[1]).slice(0, 3).map(p => p[0]);
}

/* Hilfen (nach dem 2. Fehler Pflicht) */
function hilfeLangsam(ctx, k) {   /* Gebärde → Bild: Gebärde langsam und groß noch einmal */
  const v = VIDS[k].vid;
  if (!hatVideo(v)) { ctx.waitHint(ICON.eye, "", 4000); return; }
  const vorher = VF.slow; VF.slow = true;
  ctx.setShow(signVid(v, ""));
  ctx.waitHint(SYM.hand, "Schau die Gebärde langsam an.", 6000);
  setTimeout(() => { VF.slow = vorher; if (VF.el) VF.el.playbackRate = vorher ? .5 : 1; }, 6000);
}
function hilfeFinger(ctx, k, oben) {   /* Wort-Aufgaben: das Wort im Fingeralphabet (Brücke von der Handform zum Buchstaben) */
  const v = VIDS[k].vidFa, n = wortVon(k).length;
  if (!hatVideo(v)) { ctx.setShow('<div class="zeile">' + oben + '<span class="anlaut">' + wortVon(k)[0] + '</span></div>'); ctx.waitHint(ICON.eye, "So fängt das Wort an.", 4000); return; }
  ctx.setShow('<div class="zeile">' + oben + signVid(v, "") + '</div>');
  ctx.waitHint(SYM.fa, "Schau das Fingeralphabet an.", Math.max(4000, n * 1100 + 800));
}

function tasksFor(level, mid) {
  const liste = tiereVon(level), n = level === "start" ? liste.length : 8;
  return shuffle(liste).slice(0, n).map(k => {
    const andere = ablenker(k, liste, mid === "finden");
    const loes = { show: '<div class="zeile">' + bildKarte(k) + wortGross(k) + '</div>', text: "" };
    if (mid === "zeigen") return {   /* Gebärde → Bild */
      prompt: symZeile("hand", "pfeil", "bild"), show: signVid(VIDS[k].vid, wortGross(k)), layout: "grid",
      answers: shuffle([k].concat(andere)).map(x => ({ v: x, html: bildImg(x) })), answer: k,
      hint: ctx => hilfeLangsam(ctx, k), sol: loes
    };
    if (mid === "finden") return {   /* Bild + Gebärde → Wort */
      prompt: symZeile("bild", "hand", "pfeil", "wort"), show: '<div class="zeile">' + bildKarte(k) + signVid(VIDS[k].vid, "") + '</div>', layout: "names",
      answers: shuffle([k].concat(andere)).map(x => ({ v: x, html: '<span class="wort">' + wortVon(x) + '</span>' })), answer: k,
      hint: ctx => hilfeFinger(ctx, k, bildKarte(k)), sol: loes
    };
    return {   /* Wort → Bild (lesen ohne Gebärde) */
      prompt: symZeile("wort", "pfeil", "bild"), show: wortGross(k), layout: "grid",
      answers: shuffle([k].concat(andere)).map(x => ({ v: x, html: bildImg(x) })), answer: k,
      hint: ctx => hilfeFinger(ctx, k, wortGross(k)), sol: loes
    };
  });
}

/* Tier-Lexikon (Extra ohne Sterne): Bild, Wort, Gebärde, Fingeralphabet – zum Einführen und Nachschlagen */
function lexikon(el) {
  let wahl = null, fa = false;
  const zeichne = () => {
    let d = "";
    if (wahl) {
      const v = fa ? VIDS[wahl].vidFa : VIDS[wahl].vid;
      d = '<div class="lexdetail">' + bildKarte(wahl) + '<span class="wortgross">' + wortVon(wahl) + '</span>'
        + (hatVideo(v) ? signVid(v, "") + '<button class="knopf" id="lexFa">' + (fa ? SYM.hand + " Gebärde" : SYM.fa + " Fingeralphabet") + '</button>' : "") + '</div>';
    }
    el.innerHTML = d + '<div class="lex">' + ALLE_TIERE.map(k => '<button data-k="' + k + '" class="' + (k === wahl ? "on" : "") + '">' + bildImg(k) + wortVon(k) + '</button>').join("") + '</div>';
    el.querySelectorAll(".lex button").forEach(b => b.onclick = () => { wahl = b.dataset.k; fa = false; zeichne(); window.scrollTo(0, 0); });
    const f = el.querySelector("#lexFa"); if (f) f.onclick = () => { fa = !fa; zeichne(); };
    vidMountAll(el);
  };
  zeichne();
}

const APP = {
  id: "lesewerkstatt-tiere",
  title: "Lesewerkstatt: Tiere",
  subtitle: "Gebärde · Bild · Wort",
  credit: "mit KI erstellt · geprüft: J. Schneider · Prototyp, Nov. 2026 · Zeichnungen: eigene (rough.js, MIT) · Schrift: Andika (SIL OFL)",
  videoCredit: "Gebärden- und Fingeralphabet-Videos: Henrike Maria Falke, gebaerdenlernen.de, CC BY-NC-SA 3.0 DE (geschnitten, verkleinert, ohne Ton)",
  crownLabel: "Tier-Leseprofi",
  errorFlow: "stufen", errorWait: 5000, waitText: "Schau noch einmal genau.",
  hero: () => '<div class="herorow">' + ["katze", "hund", "schaf"].map(bildImg).join("") + '</div>',
  unlockShare: 0.7,
  levels: [
    { id: "start", marks: "★", label: "Start", icons: () => "", missions: ["zeigen", "finden", "lesen"] },
    { id: "s1", marks: "●", label: "Stufe 1", icons: () => "", missions: ["zeigen", "finden", "lesen"] }
  ],
  missions: {
    zeigen: { name: "Gebärde → Bild", icon: () => '<g transform="translate(10,40) scale(1.9)">' + SYM.hand.replace(/<\/?svg[^>]*>/g, "") + '</g><g transform="translate(100,40) scale(1.9)">' + SYM.bild.replace(/<\/?svg[^>]*>/g, "") + '</g>' },
    finden: { name: "Bild → Wort", icon: () => '<g transform="translate(10,40) scale(1.9)">' + SYM.bild.replace(/<\/?svg[^>]*>/g, "") + '</g><g transform="translate(100,40) scale(1.9)">' + SYM.wort.replace(/<\/?svg[^>]*>/g, "") + '</g>' },
    lesen: { name: "Wort → Bild", icon: () => '<g transform="translate(10,40) scale(1.9)">' + SYM.wort.replace(/<\/?svg[^>]*>/g, "") + '</g><g transform="translate(100,40) scale(1.9)">' + SYM.bild.replace(/<\/?svg[^>]*>/g, "") + '</g>' }
  },
  buildTasks: tasksFor,
  extras: [{ id: "lexikon", label: "Tier-Lexikon", icon: () => '<image href="' + tierBild("hase") + '" x="10" y="10" width="180" height="180"/>', render: lexikon }],
  board: {
    lesen: { label: "Wort lesen", cards: () => shuffle(ALLE_TIERE).map(k => ({ html: '<span class="wortgross tafelwort">' + wortVon(k) + '</span>', reveal: bildKarte(k) })) },
    bild: { label: "Bild → Wort", cards: () => shuffle(ALLE_TIERE).map(k => ({ html: bildKarte(k), reveal: '<span class="wortgross">' + wortVon(k) + '</span>' })) }
  },
  info: '<p><b>Prototyp der Lesewerkstatt</b> (Wort-Werkstatt, Strang „Wörter“). Jedes Tier ist verkettet: Gebärde, Bild, Schriftwort und Fingeralphabet. '
    + 'Start: 6 Tiere, Stufe 1: 12 Tiere. Drei Aufgabenarten: Gebärde → Bild (DGS-Wortschatz), Bild + Gebärde → Wort (Ablenker sind ähnlich geschriebene Wörter, z. B. Hund/Huhn/Hase), Wort → Bild (Lesen ohne Gebärde).</p>'
    + '<p><b>Hilfen:</b> Gebärde → Bild: die Gebärde langsam. Wort-Aufgaben: das Wort im Fingeralphabet (Brücke von der Handform zum Buchstaben). Ohne Videos: der Anfangsbuchstabe.</p>'
    + '<p><b>Erprobung Fehlerablauf:</b> Bitte beobachten, ob die Wartezeit das schnelle Raten bremst, ob die Pflicht-Hilfe angenommen wird und ob Kinder nach der Hilfe lesen statt raten. Ergebnisse in der Reflexion festhalten; danach Entscheidung für den Baukasten.</p>'
    + '<p><b>Tier-Lexikon:</b> zum Einführen der Wörter im Unterricht oder an der Tafel.</p>'
};
