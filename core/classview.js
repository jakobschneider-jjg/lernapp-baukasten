/* ==========================================================================
   Baukasten: Klassenübersicht und Einzelansicht für LearningView
   Alle Namen und Daten aus LearningView werden nur per textContent eingesetzt
   (nie innerHTML), damit fremde Inhalte keinen Code ausführen können.
   ========================================================================== */
function levelName(l) { const L = levelDef(l); return ((L.marks ? L.marks + " " : "") + L.label).trim(); }
function sumStats(st, levels) { const r = { n: 0, first: 0, hint: 0, sol: 0 }; levels.forEach(l => { const x = (st.stats || {})[l]; if (x) for (const k in r) r[k] += x[k] || 0; }); return r; }
function levelsOf(st) { return (st.track && APP.track) ? [APP.track.id] : ORDER(); }
function reachedText(st) {
  if (APP.reached) return String(APP.reached(st)); /* eigener Text für die Spalte „Stand“ (nur Text, kein HTML) */
  if (st.track && APP.track) return APP.track.label;
  const o = st.opened || {}, ord = ORDER(); let t = levelName(ord[0]);
  ord.forEach(l => { if (o[l]) t = levelName(l); });
  if (st.unlockAll) t += " (alle offen)"; return t;
}
function cellBar(have, tot) {
  const td = el("td", "num"); if (!tot) { td.textContent = "–"; return td; }
  const w = el("div", "mbar"), f = el("i"); f.style.width = Math.min(100, Math.round(have / tot * 100)) + "%"; w.appendChild(f);
  td.appendChild(el("span", null, have + "/" + tot)); td.appendChild(w); return td;
}
function tableHead() {
  const tr = el("tr");
  ["Name", "Stand"].concat(ORDER().map(levelName), ["Abzeichen", "1. Versuch richtig", "Hilfe genutzt", "Lösung gezeigt", "zuletzt aktiv"]).forEach(h => tr.appendChild(el("th", null, h)));
  return tr;
}
function summaryRow(name, raw) {
  const cols = ORDER().length + 7, tr = el("tr"); tr.appendChild(el("td", "name", name));
  let st = null; if (raw) { try { st = JSON.parse(raw); } catch (e) { st = "bad"; } }
  if (!st || typeof st !== "object") { const td = el("td", "empty", st === "bad" ? "Lernstand nicht lesbar" : "noch nicht begonnen"); td.colSpan = cols; tr.appendChild(td); return tr; }
  tr.appendChild(el("td", null, reachedText(st)));
  if (st.track && APP.track) { tr.appendChild(cellBar(starsOf(st, APP.track.id), levelTotalAll(APP.track.id))); for (let i = 1; i < ORDER().length; i++) tr.appendChild(el("td", "num", "–")); }
  else ORDER().forEach(l => tr.appendChild(cellBar(starsOf(st, l), levelTotalAll(l))));
  const lv = levelsOf(st), nb = lv.reduce((a, l) => a + levelDef(l).missions.length, 0), b = lv.reduce((a, l) => a + badgesOf(st, l), 0);
  tr.appendChild(el("td", "num", b + "/" + nb));
  const x = sumStats(st, lv);
  tr.appendChild(el("td", "num", x.n ? pct(x.first, x.n) : "–"));
  tr.appendChild(el("td", "num", x.n ? String(x.hint) : "–"));
  tr.appendChild(el("td", "num", x.n ? String(x.sol) : "–"));
  tr.appendChild(el("td", "num", fmtTime(st.t)));
  return tr;
}
function renderClass(rows) {
  const box = $("lvTable"); box.textContent = "";
  const tb = el("table", "lvtab"); tb.appendChild(tableHead());
  rows.slice().sort((a, b) => String(a.surname || "").localeCompare(String(b.surname || ""), "de") || String(a.name || "").localeCompare(String(b.name || ""), "de"))
    .forEach(r => tb.appendChild(summaryRow(((r.name || "") + " " + (r.surname || "")).trim() || "(ohne Namen)", r.data)));
  box.appendChild(tb);
  if (!rows.length) box.appendChild(el("p", "lvmsg", "In diesem Kurs sind keine Lernenden eingetragen."));
}
function classMsg(t, kind) { const m = $("lvMsg"); m.textContent = t || ""; m.className = "lvmsg" + (kind ? " " + kind : ""); m.hidden = !t; }
function requestClass() {
  classMsg("Klassendaten werden geladen …"); $("lvTable").textContent = "";
  clearTimeout(LV.classTimer); LV.classTimer = setTimeout(() => classMsg("LearningView antwortet nicht. Bitte „Aktualisieren“ tippen.", "err"), 12000);
  lvSend({ type: "getClassAnswerData" });
}
const CLASS_ERR = {
  CLASS_DATA_CONSENT_DENIED: "Die Freigabe für die Klassendaten wurde abgelehnt. Die Übersicht kann deshalb nichts anzeigen – das heißt nicht, dass die Kinder nichts bearbeitet haben. Neue Freigabe: Aufgabe in der Vorschau öffnen.",
  CLASS_ANSWER_DATA_UNAVAILABLE: "Klassendaten sind hier nicht verfügbar. Voraussetzungen: Klassenansicht ohne ausgewählte Person und Abgabeform der Aufgabe „keine“."
};
function onClassData(data, error) {
  clearTimeout(LV.classTimer);
  if (error) { classMsg(CLASS_ERR[error] || ("Klassendaten nicht verfügbar (" + error + ")."), "err"); return; }
  classMsg(""); renderClass(Array.isArray(data) ? data : []);
}
function renderReview() {
  $("rvReached").textContent = reachedText(S);
  const box = $("rvTable"); box.textContent = "";
  const tb = el("table", "lvtab"), h = el("tr"); ["Stufe", "Mission", "Sterne", "Abzeichen"].forEach(x => h.appendChild(el("th", null, x))); tb.appendChild(h);
  levelsOf(S).forEach(l => levelDef(l).missions.forEach(m => {
    const p = (S.prog[l] || {})[m] || {}, tr = el("tr");
    tr.appendChild(el("td", null, levelName(l))); tr.appendChild(el("td", null, APP.missions[m].name));
    tr.appendChild(cellBar(p.stars || 0, sizeOf(l, m))); tr.appendChild(el("td", "num", p.done ? "✓" : "–")); tb.appendChild(tr);
  }));
  box.appendChild(tb);
  const x = sumStats(S, levelsOf(S));
  $("rvStats").textContent = x.n ? ("Beantwortete Aufgaben: " + x.n + " · im 1. Versuch richtig: " + pct(x.first, x.n) + " · Hilfe genutzt: " + x.hint + " · Lösung gezeigt: " + x.sol) : "Noch keine Aufgaben bearbeitet.";
  const flags = Object.entries(APP.locks || {}).map(([id, L]) => L.label + (S.locksOpen[id] ? " offen" : " gesperrt"));
  if (S.unlockAll) flags.push("alle Stufen offen (Lehrkraft)");
  flags.push("zuletzt aktiv: " + fmtTime(S.t));
  $("rvFlags").textContent = flags.join(" · ");
}
