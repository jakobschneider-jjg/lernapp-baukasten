/* ==========================================================================
   Baukasten: Zustand und LearningView-Schnittstelle
   Referenz: https://learningview.org/embed-api.php
   - Modi: student | studentReview | class | preview (aus window.learningView.mode)
   - außerhalb eines Rahmens: "local" (Browser-Speicher, nur als Notlösung)
   ========================================================================== */
const DEFAULT_STATE = () => ({ v: 1, level: null, prog: {}, unlockAll: false, opened: {}, locksOpen: {}, track: false, vidOff: false, stats: {}, t: 0 });
let S = DEFAULT_STATE();
function applyState(o) {
  const d = DEFAULT_STATE(); S = Object.assign(d, (o && typeof o === "object") ? o : {});
  ["prog", "opened", "stats", "locksOpen"].forEach(k => { if (!S[k] || typeof S[k] !== "object") S[k] = {}; });
}
const STORE_KEY = () => "lernapp-" + APP.id;

const LV_ORIGIN = "https://learningview.org";
const LV = { inFrame: false, mode: "local", loaded: false, readOnly: false, fallback: false, statusCode: "", lastOk: 0, loadTimer: null, classTimer: null };
try { LV.inFrame = window.parent !== window; } catch (e) { LV.inFrame = true; }
(function () {
  let m = null; try { m = window.learningView && window.learningView.mode; } catch (e) { }
  if (LV.inFrame) LV.mode = ["student", "studentReview", "class", "preview"].includes(m) ? m : "student"; else LV.mode = "local";
  LV.readOnly = (LV.mode === "studentReview" || LV.mode === "class" || LV.mode === "preview");
})();
function lvSend(msg) { if (!LV.inFrame) return; try { window.parent.postMessage(msg, LV_ORIGIN); } catch (e) { } }

/* Speichern: eine Übertragung zur Zeit, nach "SAVED" die nächste, mind. 2 s Abstand (2,4 s mit Sicherheitsabstand) */
const Saver = {
  pending: null, inFlight: null, last: 0, timer: null, wd: null,
  request(str) { this.pending = str; this.kick(); },
  kick() {
    if (this.inFlight !== null || this.timer || this.pending === null) return;
    const wait = Math.max(500, this.last + 2400 - Date.now());
    this.timer = setTimeout(() => { this.timer = null; this.flush(); }, wait);
  },
  flush() {
    if (this.inFlight !== null || this.pending === null) return;
    const s = this.pending; let bytes = 0;
    try { bytes = new TextEncoder().encode(s).length; } catch (e) { bytes = s.length * 3; }
    if (bytes > 1048576) { this.pending = null; lvStatus("err", "ANSWER_DATA_TOO_LARGE"); return; }
    this.pending = null; this.inFlight = s; this.last = Date.now(); lvStatus("saving");
    lvSend({ type: "saveAnswerData", data: s });
    this.wd = setTimeout(() => this.fail("TIMEOUT"), 20000);
  },
  ok() { clearTimeout(this.wd); this.inFlight = null; LV.lastOk = Date.now(); lvStatus("ok"); this.kick(); },
  fail(code) {
    clearTimeout(this.wd); const s = this.inFlight; this.inFlight = null; lvStatus("err", code);
    if (code !== "ANSWER_DATA_TOO_LARGE" && this.pending === null && typeof s === "string") this.pending = s;
    this.last = Date.now() + 3000; this.kick();
  }
};
function save() {
  S.t = Date.now();
  if (LV.mode === "local") { try { localStorage.setItem(STORE_KEY(), JSON.stringify(S)); } catch (e) { } return; }
  if (LV.mode === "student" && LV.loaded && !LV.readOnly) Saver.request(JSON.stringify(S));
}
function lvStatus(st, code) { LV.statusCode = st === "err" ? (code || "SAVE_FAILED") : st; renderLvStatus(); }
function renderLvStatus() {
  const n = $("lvstat"); if (!n) return; n.className = "lvstat"; n.textContent = "";
  if (LV.mode === "preview") { n.textContent = "Vorschau – es wird nichts gespeichert"; n.classList.add("info"); return; }
  if (LV.mode === "student" && LV.fallback) { n.textContent = "Lernstand nicht verbunden"; n.classList.add("err"); return; }
  if (LV.mode === "student" && String(LV.statusCode).length > 3 && !["ok", "saving"].includes(LV.statusCode)) { n.textContent = "Speichern gerade nicht möglich – neuer Versuch läuft"; n.classList.add("err"); }
}
function lvStorageText() {
  if (LV.mode === "local") return "Speicherort: nur dieses Gerät (außerhalb von LearningView geöffnet).";
  if (LV.mode === "preview") return "LearningView-Vorschau: Es wird nichts gespeichert.";
  if (LV.fallback) return "LearningView hat keinen Lernstand geliefert. Der Fortschritt wird gerade nicht gespeichert.";
  if (["ok", "saving", ""].includes(LV.statusCode)) return "Speicherort: LearningView." + (LV.lastOk ? " Zuletzt gespeichert: " + new Date(LV.lastOk).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }) + " Uhr." : "");
  return "Speicherort: LearningView. Letzter Fehler: " + LV.statusCode + " (wird automatisch erneut versucht).";
}

/* Ergebnis auf der Aufgabenkachel: erreichte Sterne / mögliche Sterne */
function sendScore() {
  if (LV.mode !== "student" || LV.fallback || !LV.loaded) return;
  lvSend({ result: { score: { scaled: Math.round(scoreScaled() * 1000) / 1000 } } });
}

function onAnswerData(raw) {
  if (LV.loaded && !(LV.fallback && S.t === 0)) return; /* spät eingetroffen und schon weitergearbeitet: nicht überschreiben */
  clearTimeout(LV.loadTimer);
  let obj = null; if (raw) { try { obj = JSON.parse(raw); } catch (e) { obj = null; lvStatus("err", "DATEN_UNLESBAR"); } }
  applyState(obj); LV.loaded = true; LV.fallback = false; renderLvStatus();
  if (LV.mode === "studentReview") { renderReview(); go("lvreview"); return; }
  sendScore(); go("start");
}

function lvInit() {
  window.addEventListener("message", e => {
    if (e.source !== window.parent || e.origin !== LV_ORIGIN) return;
    const d = e.data;
    if (d === "SAVED") { Saver.ok(); return; }
    if (d === "SAVE_FAILED" || d === "ANSWER_DATA_TOO_LARGE") { Saver.fail(d); return; }
    if (!d || typeof d !== "object") return;
    const type = d.type || d.action;
    if (type === "saveAnswerDataError") { Saver.fail(d.error || "SAVE_FAILED"); return; }
    if (type === "sendAnswerData") { if (LV.mode === "student" || LV.mode === "studentReview") onAnswerData(typeof d.data === "string" ? d.data : ""); return; }
    if (type === "classDataConsentPending") { clearTimeout(LV.classTimer); classMsg("Bitte in LearningView die Freigabe für die Klassendaten bestätigen.", "info"); return; }
    if (type === "sendClassAnswerData") { if (LV.mode === "class") onClassData(d.data, d.error); return; }
  });
  document.body.classList.add("lv-" + LV.mode);
  if (LV.mode === "local") { try { const r = localStorage.getItem(STORE_KEY()); if (r) applyState(JSON.parse(r)); } catch (e) { } LV.loaded = true; go("start"); return; }
  lvSend({ type: "setDialogSize", size: "max" });
  if (LV.mode === "preview") { LV.loaded = true; renderLvStatus(); go("start"); return; }
  if (LV.mode === "class") { go("lvclass"); requestClass(); return; }
  go("loading");
  lvSend({ type: "getAnswerData" });
  LV.loadTimer = setTimeout(() => { /* keine Antwort: weiterarbeiten, aber nichts überschreiben */
    if (LV.loaded) return;
    if (LV.mode === "studentReview") { $("loadMsg").textContent = "LearningView hat keinen Lernstand geliefert."; return; }
    LV.loaded = true; LV.fallback = true; renderLvStatus(); go("start");
  }, 8000);
}
