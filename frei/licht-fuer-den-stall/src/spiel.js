
/* ---------- Zustand, Speichern (Gerät oder LearningView) ---------- */
const APP_ID = "licht-fuer-den-stall";
const TEACH_CODE = "__TEACH_CODE__";
const STATIONEN = [1, 2, 3, 4, 5, 6, 7];
/* Eingebettet in den Adventskalender „Weihnachten im Stall“ (srcdoc-Rahmen): der Kalender speichert, diese Datei meldet nur */
const EMB = !!window.ESC_EMB;
const E = { gruppen: [[1, 2, 3, 4, 5, 6, 7]], erlaubt: [1, 2, 3, 4, 5, 6, 7], tuer: {} };
function melde(m) { if (EMB) try { window.parent.postMessage(m, "*"); } catch (e) { } }
function gruppeVon(nr) { return E.gruppen.find(g => g.includes(nr)) || [nr]; }
let S = { v: 1, stufe: 2, fertig: {}, alleOffen: false, fehl: {}, tipps: {}, t: 0 };
function zustandSetzen(o) { S = Object.assign({ v: 1, stufe: 2, fertig: {}, alleOffen: false, fehl: {}, tipps: {}, t: 0 }, o && typeof o === "object" ? o : {}); ["fertig", "fehl", "tipps"].forEach(k => { if (!S[k] || typeof S[k] !== "object") S[k] = {}; }); }
const LVO = "https://learningview.org";
const LV = { rahmen: false, modus: "lokal", geladen: false, unterwegs: false, wartend: null, zuletzt: 0, timer: null };
try { LV.rahmen = window.parent !== window; } catch (e) { LV.rahmen = true; }
(function () { let m = null; try { m = window.learningView && window.learningView.mode; } catch (e) { } LV.modus = LV.rahmen ? (["student", "studentReview", "class", "preview"].includes(m) ? m : "student") : "lokal"; })();
function lvSend(m) { if (LV.rahmen) try { window.parent.postMessage(m, LVO); } catch (e) { } }
function speichern() {
  S.t = Date.now();
  if (EMB) return;
  if (LV.modus === "lokal") { try { localStorage.setItem(APP_ID, JSON.stringify(S)); } catch (e) { } return; }
  if (LV.modus !== "student" || !LV.geladen) return;
  LV.wartend = JSON.stringify(S); lvPumpe();
  lvSend({ result: { score: { scaled: Math.round(anzahlFertig(S) / 7 * 1000) / 1000 } } });
}
function lvPumpe() {   /* eine Speicherung zur Zeit, mindestens 2,4 s Abstand */
  if (LV.unterwegs || LV.wartend === null || LV.timer) return;
  LV.timer = setTimeout(() => { LV.timer = null; if (LV.unterwegs || LV.wartend === null) return; LV.unterwegs = true; LV.zuletzt = Date.now(); const d = LV.wartend; LV.wartend = null; lvSend({ type: "saveAnswerData", data: d }); LV.wd = setTimeout(() => lvAntwort(false, d), 20000); }, Math.max(300, LV.zuletzt + 2400 - Date.now()));
}
function lvAntwort(ok, d) { clearTimeout(LV.wd); LV.unterwegs = false; if (!ok && LV.wartend === null && d) LV.wartend = d; lvPumpe(); }
function anzahlFertig(st) { return STATIONEN.filter(n => st.fertig && st.fertig[n]).length; }
function lvStart(weiter) {
  window.addEventListener("message", e => {
    if (e.source !== window.parent || e.origin !== LVO) return;
    const d = e.data;
    if (d === "SAVED") { lvAntwort(true); return; }
    if (d === "SAVE_FAILED" || d === "ANSWER_DATA_TOO_LARGE") { lvAntwort(false); return; }
    if (!d || typeof d !== "object") return;
    const typ = d.type || d.action;
    if (typ === "saveAnswerDataError") { lvAntwort(false); return; }
    if (typ === "sendAnswerData" && !LV.geladen) { let o = null; try { o = d.data ? JSON.parse(d.data) : null; } catch (x) { } zustandSetzen(o); LV.geladen = true; clearTimeout(LV.lt); if (LV.modus === "studentReview") zeigeLernstand(); else weiter(); return; }
    if (typ === "classDataConsentPending") { $("lvText").textContent = "Bitte in LearningView die Freigabe für die Klassendaten bestätigen."; return; }
    if (typ === "sendClassAnswerData" && LV.modus === "class") klassenTabelle(d.data, d.error);
  });
  if (LV.modus === "lokal") { try { zustandSetzen(JSON.parse(localStorage.getItem(APP_ID) || "null")); } catch (e) { } LV.geladen = true; weiter(); return; }
  lvSend({ type: "setDialogSize", size: "max" });
  if (LV.modus === "preview") { LV.geladen = true; weiter(); return; }
  if (LV.modus === "class") { $("lvBox").hidden = false; $("lvText").textContent = "Klassendaten werden geladen …"; lvSend({ type: "getClassAnswerData" }); return; }
  lvSend({ type: "getAnswerData" });
  LV.lt = setTimeout(() => { if (!LV.geladen) { LV.geladen = true; LV.modus = "preview"; weiter(); hinweis("Lernstand nicht verbunden – es wird nichts gespeichert."); } }, 8000);
}
function standText(st) { return "Stufe " + (st.stufe || 2) + " · " + anzahlFertig(st) + " von 7 Stationen" + (st.alleOffen ? " (alle offen)" : ""); }
function zeigeLernstand() { $("lvBox").hidden = false; $("lvText").textContent = "Lernstand (nur lesen): " + standText(S) + ". Geschafft: " + (STATIONEN.filter(n => S.fertig[n]).map(n => TX[n].titel).join(", ") || "noch keine Station") + "."; }
function klassenTabelle(rows, fehler) {
  const box = $("lvTab"); box.textContent = "";
  if (fehler) { $("lvText").textContent = fehler === "CLASS_DATA_CONSENT_DENIED" ? "Die Freigabe für die Klassendaten wurde abgelehnt (neu freigeben: Aufgabe in der Vorschau öffnen)." : "Klassendaten nicht verfügbar (" + fehler + ")."; return; }
  $("lvText").textContent = "Klassenübersicht";
  const tb = document.createElement("table"); const kopf = document.createElement("tr");
  ["Name", "Stand", "Fehlversuche", "Tipps", "zuletzt aktiv"].forEach(h => { const th = document.createElement("th"); th.textContent = h; kopf.appendChild(th); }); tb.appendChild(kopf);
  (Array.isArray(rows) ? rows : []).forEach(rw => {
    const tr = document.createElement("tr"); let st = null; try { st = rw.data ? JSON.parse(rw.data) : null; } catch (e) { st = "x"; }
    const zelle = t => { const td = document.createElement("td"); td.textContent = t; tr.appendChild(td); };
    zelle(((rw.name || "") + " " + (rw.surname || "")).trim());
    if (!st || typeof st !== "object") { zelle(st === "x" ? "Lernstand nicht lesbar" : "noch nicht begonnen"); zelle("–"); zelle("–"); zelle("–"); }
    else { zelle(standText(st)); zelle(String(Object.values(st.fehl || {}).reduce((a, b) => a + b, 0))); zelle(String(Object.values(st.tipps || {}).reduce((a, b) => a + b, 0))); zelle(st.t ? new Date(st.t).toLocaleString("de-DE", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) : "–"); }
    tb.appendChild(tr);
  });
  box.appendChild(tb);
}

/* ---------- Karten, Text, Hinweise ---------- */
function zeilen(arr) { return arr.map(s => "<p>" + s + "</p>").join(""); }
function lesen(nr, teil, extra) { const s = S.stufe, t = TX[nr][teil]; return s === 1 ? (extra || "") : '<div class="lesen st' + s + '">' + zeilen(t[s]) + '</div>'; }
function bildreihe(liste) { return '<div class="bildreihe">' + liste.map(x => x === "→" ? '<span class="pfeil">→</span>' : x.startsWith("<") ? x : img(x, "gross")).join("") + '</div>'; }
function karte(html, knoepfe) {
  $("karte").innerHTML = '<div class="papier">' + html + '<div class="kknoepfe">' + (knoepfe || '<button class="kbtn" data-k="zu">OK</button>') + '</div></div>';
  $("karte").hidden = false;
  return new Promise(res => $("karte").querySelectorAll("[data-k]").forEach(b => b.onclick = () => { $("karte").hidden = true; res(b.dataset.k); }));
}
function hinweis(t) { const n = $("hinweis"); n.textContent = t; n.hidden = false; clearTimeout(hinweis.t); hinweis.t = setTimeout(() => n.hidden = true, 3200); }
function sprech(ebeneId, x, y, html, ms) { const d = frei(ebeneId, x, y, "sprech", html); setTimeout(() => d.remove(), ms || 2600); return d; }
function wackeln(el) { el.classList.remove("wackelt"); void el.offsetWidth; el.classList.add("wackelt"); }

/* ---------- Ablauf einer Station ---------- */
let ST = null;   /* laufende Station */
const BILD_INTRO = { 1: ["spuren", "→", "schloss"], 2: ["laterne", "→", "schloss"], 3: ["hand", "hunger", "muede", "→", "herz"], 4: ["baby", "→", "stern"], 5: ["hirte", "→", "stern"], 6: ["baby", "→", "bett"], 7: ["weihnachten"] };
const BILD_TIPPS = {
  1: [["auge", "spuren"], ["spuren", "→", "<b class='zahlen'>1 2 3</b>"], ["rechts"]], 2: [["auge", "→", "fenster"], ["pferd", "kuh", "huhn", "schaf"], ["pferd", "kuh", "huhn"]],
  3: [["pferd", "kuh", "schaf", "huhn"], ["hand", "→", "pferd"], ["hand", "→", "pferd"]], 4: [["stern"], ["stern"], ["stern"]], 5: [["auge", "stern"], ["hirte", "→", "stern"], ["rechts"]], 6: [["laterne"], ["bett"], ["krippe"]]
};
async function starteStation(nr) {
  ST = { nr, fehl: 0, gesperrt: false, tipp: 0, schritt: 0 };
  $("laden").hidden = false; await new Promise(r => setTimeout(r, 30));
  freiAlle(); $("aktion").hidden = true; $("zurueck").hidden = true; STATION[nr].aufbau(); $("laden").hidden = true;
  $("titel").textContent = TX[nr].titel; $("hilfe").hidden = nr === 7; $("zurKarte").hidden = false; leiste();
  const s = S.stufe;
  await karte('<div class="kopf">' + img(TX[nr].icon, "kopfico") + '<h2>' + TX[nr].titel + '</h2></div>' + (s === 1 ? bildreihe(BILD_INTRO[nr]) : lesen(nr, "intro") + (TX[nr].auftrag ? '<div class="auftrag">' + lesen(nr, "auftrag") + '</div>' : "")),
    '<button class="kbtn gross" data-k="los">Los ' + img("stern", "mini") + '</button>');
  neigenErlauben();
}
function hilfe() {
  if (!ST || ST.nr === 7) return;
  ST.tipp = Math.min(ST.tipp + 1, 3); ST.gesperrt = false; schlossStatus();
  S.tipps[ST.nr] = (S.tipps[ST.nr] || 0) + 1; speichern(); melde({ typ: "esc-stat", nr: ST.nr, k: "tipp" });
  const s = S.stufe, i = ST.tipp - 1;
  const inhalt = s === 1 ? bildreihe(BILD_TIPPS[ST.nr][i]) : '<div class="lesen st' + s + '"><p>' + TX[ST.nr].tipps[s][i] + '</p></div>';
  karte('<div class="kopf">' + img("laterne", "kopfico") + '<h2>Tipp ' + ST.tipp + '</h2></div>' + inhalt).then(() => STATION[ST.nr].tipp && STATION[ST.nr].tipp(i));
}
function fehler() { ST.fehl++; S.fehl[ST.nr] = (S.fehl[ST.nr] || 0) + 1; speichern(); melde({ typ: "esc-stat", nr: ST.nr, k: "fehl" }); }
async function geschafft() {
  const nr = ST.nr; S.fertig[nr] = true; speichern(); leiste(); melde({ typ: "esc-fertig", nr });
  await new Promise(r => setTimeout(r, 1500));
  const s = S.stufe;
  await karte('<div class="kopf">' + img("stern", "kopfico") + '<h2>Geschafft!</h2></div>' + (s === 1 ? bildreihe([TX[nr].icon, "→", "stern"]) : lesen(nr, "fertig")),
    '<button class="kbtn gross" data-k="weiter">Weiter ' + img("stern", "mini") + '</button>');
  const g = gruppeVon(nr);
  if (EMB && g[g.length - 1] === nr && g.every(n => S.fertig[n])) {   /* alle Stationen dieser Kalendertür geschafft */
    zeigeKarte(); const t = E.tuer[nr];
    const k = await karte('<div class="kopf">' + img("stall", "kopfico") + '<h2>Abenteuer geschafft!</h2></div>' + (s === 1 ? bildreihe(["stern", "→", "stall"]) : '<div class="lesen st' + s + '"><p>' + "Super! Jetzt geht es weiter." + '</p></div>'),
      '<button class="kbtn" data-k="zu">Karte</button><button class="kbtn gross" data-k="kal">Weiter ' + img("stern", "mini") + '</button>');
    if (k === "kal") melde({ typ: "esc-zu", weiter: true });   /* „Weiter“ nach der letzten Station dieser Tür: zum Üben */
    return;
  }
  /* Kalender: noch eine Station an dieser Tür? Dann leuchtet sie auf der Karte. */
  const naechste = EMB ? g.find(n => !S.fertig[n]) : null;
  zeigeKarte(naechste || nr);
}

/* ---------- Schloss (Zahlen-, Pfeil-, Bilderschloss) ---------- */
let SCHLOSS = null;
function schloss(def) {
  SCHLOSS = def; def.wert = def.wert || def.raeder.map(() => 0);
  const zeichne = () => {
    $("schloss").innerHTML = '<div class="bügel"></div><div class="koerper">' + def.raeder.map((rd, i) =>
      '<div class="rad" data-i="' + i + '">' + rd.label + '<button class="pf hoch" data-d="-1">▲</button><div class="wert">' + rd.werte[def.wert[i]].html + '</div><button class="pf runter" data-d="1">▼</button></div>').join("") +
      '</div><div class="srow"><button class="kbtn" id="sZu">Zurück</button><button class="kbtn gross" id="sOk">Öffnen ' + img("schloss", "mini") + '</button></div><div class="smeld" id="sMeld"></div>';
    $("schloss").querySelectorAll(".rad").forEach(rd => rd.querySelectorAll(".pf").forEach(p => p.onclick = () => {
      if (ST.gesperrt) return; const i = +rd.dataset.i, n = def.raeder[i].werte.length; def.wert[i] = (def.wert[i] + +p.dataset.d + n) % n; rd.querySelector(".wert").innerHTML = def.raeder[i].werte[def.wert[i]].html;
    }));
    $("sZu").onclick = () => { $("schlossBox").hidden = true; };
    $("sOk").onclick = pruefen; schlossStatus();
  };
  zeichne(); $("schlossBox").hidden = false;
}
function schlossStatus() {
  const m = $("sMeld"); if (!m) return;
  $("schloss").classList.toggle("gesperrt", !!(ST && ST.gesperrt));
  m.innerHTML = ST && ST.gesperrt ? img("laterne", "mini") + (S.stufe === 1 ? "→ ?" : "Fragt erst die Laterne um Hilfe.") : "";
}
function pruefen() {
  if (ST.gesperrt) { schlossStatus(); return; }
  const d = SCHLOSS;
  if (d.raeder.every((rd, i) => rd.werte[d.wert[i]].v === d.code[i])) { $("schlossBox").hidden = true; d.onOk(); return; }
  fehler(); wackeln($("schloss"));
  if (ST.fehl % 2 === 0) { ST.gesperrt = true; schlossStatus(); }
}
const ZAHLEN = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => ({ v: n, html: '<b class="zahl">' + n + '</b>' }));
const TIERWERTE = ["pferd", "kuh", "schaf", "huhn"].map(t => ({ v: t, html: img(t, "rbild") }));
const PFEILE = ["rechts", "hoch", "links", "runter"].map(t => ({ v: t, html: img(t, "rbild") }));
const NAME = { pferd: ["Pferd", "Pferde"], kuh: ["Kuh", "Kühe"], huhn: ["Huhn", "Hühner"], schaf: ["Schaf", "Schafe"] };
function radLabel(bild, wort) { const s = S.stufe; return '<div class="rlabel">' + (s <= 3 && bild ? img(bild, "lbild") : "") + (s >= 3 && wort ? '<i>' + wort + '</i>' : "") + '</div>'; }

/* ---------- Szenen umschalten ---------- */
function freiAlle() { $("welt").textContent = ""; B.ebenen = []; B.dunkel = 0; B.schnee = false; B.blitz = false; $("zaehler").hidden = true; document.body.classList.remove("offen", "fertig"); }
function szene(name) { baueSzene(name); }

/* ---------- Wegkarte (Start) ---------- */
function offen(nr) {
  if (S.alleOffen) return true;
  if (EMB) { if (!E.erlaubt.includes(nr)) return false; const g = gruppeVon(nr); return g[0] === nr || !!S.fertig[nr - 1] || !!S.fertig[nr]; }
  return nr === 1 || !!S.fertig[nr - 1] || !!S.fertig[nr];
}
function zeigeKarte(neu) {
  ST = null; freiAlle(); szene("karte");
  $("titel").textContent = "Ein Licht für den Stall"; $("hilfe").hidden = true; $("zurKarte").hidden = true; $("aktion").hidden = true; leiste();
  KARTE_PUNKTE.forEach((p, i) => {
    const nr = i + 1, f = !!S.fertig[nr], o = offen(nr);
    const b = spot("weg", p[0], p[1] - 40, 150, 150, "wegpunkt" + (f ? " fertig" : o ? " offen" : " zu") + (neu === nr ? " neu" : ""), () => {
      neigenErlauben();
      if (!offen(nr)) { hinweis(S.stufe === 1 ? "🔒" : EMB && !E.erlaubt.includes(nr) ? "Diese Station kommt mit Tür " + E.tuer[nr] + "." : "Diese Station ist noch zu. Löst zuerst Station " + (nr - 1) + "."); wackeln(b); return; }
      starteStation(nr);
    });
    b.innerHTML = img(TX[nr].icon, "wpbild") + '<b>' + (nr === 7 ? "★" : nr) + '</b>' + (f ? img("stern", "wpstern") : !o ? img("schloss", "wpschloss") : "");
  });
  if (anzahlFertig(S) === 7) document.body.classList.add("fertig");
}
function leiste() {
  $("lichtSlots").innerHTML = [1, 2, 3, 4, 5, 6].map(n => img(S.fertig[n] ? "stern" : "sternLeer", "slot" + (S.fertig[n] ? " an" : ""))).join("");
}

/* ---------- Lehrkraft ---------- */
let PIN = "";
function lehrkraft() {
  $("info").hidden = false; PIN = ""; $("lkOffen").hidden = true; $("lkCode").hidden = false; pinZeigen();
}
function pinZeigen() { $("pinShow").innerHTML = TEACH_CODE.split("").map((_, i) => '<i class="' + (i < PIN.length ? "f" : "") + '"></i>').join(""); }
function lkAufbau() {
  $("pinPad").innerHTML = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "⌫", "0", ""].map(k => k ? '<button data-k="' + k + '">' + k + '</button>' : '<span></span>').join("");
  $("pinPad").querySelectorAll("button").forEach(b => b.onclick = () => {
    const k = b.dataset.k; if (k === "⌫") { PIN = PIN.slice(0, -1); pinZeigen(); return; }
    if (PIN.length >= TEACH_CODE.length) return; PIN += k; pinZeigen();
    if (PIN.length === TEACH_CODE.length) setTimeout(() => { if (PIN === TEACH_CODE) { $("lkCode").hidden = true; $("lkOffen").hidden = false; lkZeigen(); } else { wackeln($("pinShow")); PIN = ""; setTimeout(pinZeigen, 400); } }, 200);
  });
  $("lkStufen").innerHTML = [1, 2, 3, 4].map(n => '<button class="stufebtn" data-s="' + n + '"><b>' + n + '</b><span>' + ["Bilder", "kurze Sätze", "Sätze", "Präteritum"][n - 1] + '</span></button>').join("");
  $("lkStufen").querySelectorAll("button").forEach(b => b.onclick = () => { S.stufe = +b.dataset.s; speichern(); lkZeigen(); });
  $("lkAlle").onclick = () => { S.alleOffen = !S.alleOffen; speichern(); lkZeigen(); };
  $("lkLoeschen").onclick = () => { $("lkJa").hidden = false; };
  $("lkJa").onclick = () => { const st = S.stufe; zustandSetzen({ stufe: st }); speichern(); $("lkJa").hidden = true; lkZeigen(); };
  $("lkZu").onclick = () => { $("info").hidden = true; if (!ST) zeigeKarte(); };
  $("infoBtn").onclick = lehrkraft;
}
function lkZeigen() {
  $("lkStufen").querySelectorAll("button").forEach(b => b.classList.toggle("on", +b.dataset.s === S.stufe));
  $("lkAlle").classList.toggle("on", !!S.alleOffen);
  $("lkSpeicher").textContent = LV.modus === "lokal" ? "Speicherort: nur dieses Gerät." : LV.modus === "preview" ? "Vorschau: Es wird nichts gespeichert." : "Speicherort: LearningView.";
}

/* ---------- Start ---------- */
function start() {
  baueRahmen(); eingabe(); requestAnimationFrame(parallaxe);
  if (!EMB) lkAufbau();
  $("hilfe").innerHTML = img("laterne"); $("hilfe").onclick = hilfe;
  $("zurueck").onclick = () => { $("zurueck").hidden = true; $("zurKarte").hidden = false; aussen(); };
  $("zurKarte").innerHTML = "◀ Karte"; $("zurKarte").onclick = () => { $("schlossBox").hidden = true; $("zurueck").hidden = true; zeigeKarte(); };
  if (EMB) {
    $("infoBtn").textContent = "◀ Kalender"; $("infoBtn").classList.add("kalbtn"); $("infoBtn").onclick = () => melde({ typ: "esc-zu" });
    window.addEventListener("message", e => {
      if (e.source !== window.parent || !e.data || e.data.typ !== "esc-start") return;
      const d = e.data; zustandSetzen({ stufe: d.stufe, fertig: d.fertig, alleOffen: !!d.alleOffen });
      E.gruppen = d.gruppen; E.erlaubt = d.erlaubt; E.tuer = d.tuer;
      $("laden").hidden = true; document.body.classList.add("bereit"); zeigeKarte(d.fokus);
    });
    melde({ typ: "esc-bereit" }); return;
  }
  lvStart(() => { $("laden").hidden = true; document.body.classList.add("bereit"); zeigeKarte(); });
}
window.addEventListener("load", () => { if (document.fonts && document.fonts.ready) document.fonts.ready.then(start); else start(); });
