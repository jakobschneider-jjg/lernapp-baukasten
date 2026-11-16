/* ==========================================================================
   Baukasten: Lehrkraft-Bereich (Info-Knopf auf der Startseite)
   - Der Code wird beim Bauen eingesetzt (tools/build.py --code 1234).
     Er steht NIE im Repository. Ohne --code erzeugt build.py einen Zufallscode
     und meldet ihn in der Konsole.
   - Schalter: alle Stufen öffnen, je Sperre (APP.locks) öffnen, Schiene (APP.track)
   - Keine <dialog>, confirm(), prompt(), alert(): reagieren auf dem iPad nicht zuverlässig.
   ========================================================================== */
const TEACH_CODE = "__TEACH_CODE__";
let pin = "";
function switchHTML(id, label) { return '<button class="switch" id="' + id + '"><span class="sw"><i></i></span><span class="lbl">' + label + '</span></button>'; }
function buildTeacher() {
  let h = switchHTML("swAll", APP.unlockAllLabel || "Alle Stufen öffnen");
  if (APP.teacher && APP.teacher.html) h += '<div id="appTeach">' + APP.teacher.html() + '</div>'; /* eigene Schalter der App */
  Object.entries(APP.locks || {}).forEach(([id, L]) => { h += switchHTML("swLock_" + id, L.switchLabel || (L.label + " öffnen")); });
  if (APP.track) h += switchHTML("swTrack", APP.track.switchLabel || (APP.track.label + " auf diesem Gerät"));
  $("switches").innerHTML = h;
  /* Codes zum Zeigen an der Tafel (nur nach Lehrkraft-Code sichtbar) */
  const lc = Object.entries(APP.locks || {});
  $("lockCodes").innerHTML = lc.length ? '<p class="lchead">' + ICON.key + 'Codes für die Tafel</p>' + lc.map(([id, L]) => '<div class="lcrow"><span class="lclabel">' + L.label + '</span><span class="lckeys">' + L.code.map(k => '<span class="lckey">' + keyHTML(L, k) + '</span>').join("") + '</span></div>').join("") : "";
  $("swAll").addEventListener("click", () => { S.unlockAll = !S.unlockAll; save(); renderSwitches(); toast(APP.unlockAllLabel ? (S.unlockAll ? "Alles offen." : "Wieder gesperrt.") : (S.unlockAll ? "Alle Stufen sind offen." : "Stufen wieder gesperrt.")); });
  if (APP.teacher && APP.teacher.wire) APP.teacher.wire($("appTeach"));
  Object.entries(APP.locks || {}).forEach(([id, L]) => $("swLock_" + id).addEventListener("click", () => {
    S.locksOpen[id] = !S.locksOpen[id]; save(); renderSwitches(); toast(S.locksOpen[id] ? L.label + ": offen." : L.label + ": wieder gesperrt.");
  }));
  if (APP.track) $("swTrack").addEventListener("click", () => {
    S.track = !S.track; save(); sendScore(); renderSwitches(); toast(S.track ? APP.track.label + " an: Startseite zeigt nur diese Schiene." : APP.track.label + " aus.");
  });
  $("pinPad").innerHTML = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "⌫", "0", ""].map(k => k ? '<button data-k="' + k + '">' + k + '</button>' : '<span></span>').join("");
  $("pinPad").querySelectorAll("button").forEach(b => b.addEventListener("click", () => {
    const k = b.dataset.k;
    if (k === "⌫") { pin = pin.slice(0, -1); renderPin(); return; }
    if (pin.length >= TEACH_CODE.length) return;
    pin += k; renderPin();
    if (pin.length === TEACH_CODE.length) setTimeout(() => {
      if (pin === TEACH_CODE) { $("teachLock").hidden = true; $("teachOpen").hidden = false; renderSwitches(); }
      else { $("pinShow").classList.add("shake"); setTimeout(() => { $("pinShow").classList.remove("shake"); pin = ""; renderPin(); }, 450); }
    }, 200);
  }));
  $("infoBtn").addEventListener("click", openInfo);
  $("closeInfo").addEventListener("click", closeInfo);
  $("resetAll").addEventListener("click", () => { $("resetYes").hidden = false; });
  $("resetYes").addEventListener("click", () => {
    const keep = { track: S.track }; (APP.keepOnReset || []).forEach(k => { keep[k] = S[k]; }); applyState(keep); save(); sendScore(); $("resetYes").hidden = true; renderSwitches(); toast("Fortschritt gelöscht.");
  });
  $("infoTitle").textContent = APP.title + " · Lehrkraft";
  $("infoBody").innerHTML = (APP.info || "") + GENERIC_INFO;
}
const GENERIC_INFO =
  '<p><b>Freischalten:</b> Die nächste Stufe öffnet sich mit einem festen Anteil der Sterne der vorigen Stufe. Einmal offen bleibt offen. Es zählt der beste Durchgang je Mission.</p>' +
  '<p><b>Sterne:</b> 1 Stern pro Aufgabe, wenn sie im 1. oder 2. Versuch gelöst wird. Nach dem 1. Fehler sind die Antworten gesperrt, bis die Hilfe genutzt wurde. Nach dem 2. Fehler zeigt die App die Lösung; die Aufgabe kommt am Ende der Mission noch einmal (ohne Stern).</p>' +
  '<p><b>Speichern:</b> In LearningView speichert die App den Lernstand dort (Abgabeform „keine“). Außerhalb nur auf diesem Gerät. Gespeichert werden nur Sterne, Abzeichen, Schalter und Zähler – keine Namen, keine freien Texte.</p>';
function renderPin() { $("pinShow").innerHTML = TEACH_CODE.split("").map((_, i) => '<i class="' + (i < pin.length ? "f" : "") + '"></i>').join(""); }
function renderSwitches() {
  $("swAll").classList.toggle("on", !!S.unlockAll);
  Object.keys(APP.locks || {}).forEach(id => $("swLock_" + id).classList.toggle("on", !!S.locksOpen[id]));
  if (APP.track) $("swTrack").classList.toggle("on", !!S.track);
  if (APP.teacher && APP.teacher.render) APP.teacher.render($("appTeach"));
}
function openInfo() { $("lvStore").textContent = lvStorageText(); pin = ""; $("teachLock").hidden = false; $("teachOpen").hidden = true; $("resetYes").hidden = true; $("toast").textContent = ""; renderPin(); $("info").hidden = false; }
function closeInfo() { $("info").hidden = true; go(document.querySelector(".screen.on").id === "map" ? "map" : "start"); }
function toast(t) { $("toast").textContent = t; clearTimeout(toast.t); toast.t = setTimeout(() => $("toast").textContent = "", 2500); }
