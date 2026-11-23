/* ==========================================================================
   Baukasten: Gebärdenvideos
   - Im Inhalt: signVid('NAME', ersatz) – kleines Video (stumm, Schleife), antippen = großes,
     verschiebbares Fenster (Pause, Langsam, Größe, Schließen). Ohne Video oder bei
     ausgeschaltetem Schalter erscheint `ersatz` (z. B. sign('WORT')).
   - Videos kommen beim Bauen aus einem LOKALEN Ordner (build.py --videos), nie aus dem Repository.
   - Ein Video erklärt die FRAGE, nicht die Lösung: immer verfügbar, unabhängig von der Antwortsperre.
   - Kein <dialog>, kein Vollbild (iPad); Wiedergabe über Blob-URL, Rückfall auf data:-URL.
   ========================================================================== */
const hasVideos = () => typeof VIDEOS !== "undefined" && Object.keys(VIDEOS).length > 0;
const vidOn = () => hasVideos() && !S.vidOff;
function signVid(name, fallback) {
  if (!vidOn() || !VIDEOS[name]) return fallback || "";
  return '<button type="button" class="pvid" data-vid="' + name + '" aria-label="Gebärdenvideo groß zeigen"></button>';
}
const VI = {
  big: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/></svg>',
  grip: '<svg viewBox="0 0 24 24" fill="#fff"><circle cx="8" cy="6" r="1.8"/><circle cx="16" cy="6" r="1.8"/><circle cx="8" cy="12" r="1.8"/><circle cx="16" cy="12" r="1.8"/><circle cx="8" cy="18" r="1.8"/><circle cx="16" cy="18" r="1.8"/></svg>',
  pause: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4.5" width="4.2" height="15" rx="1"/><rect x="13.8" y="4.5" width="4.2" height="15" rx="1"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>'
};
const VF = { open: false, key: null, el: null, tile: null, slow: false, paused: false, size: 1, pos: null, urls: {} };
const VSIZES = [.42, .6, .85];
function vidUrl(k) {
  if (VF.urls[k]) return VF.urls[k];
  const d = VIDEOS[k];
  try { const b = atob(d.slice(d.indexOf(",") + 1)), a = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) a[i] = b.charCodeAt(i); VF.urls[k] = URL.createObjectURL(new Blob([a], { type: "video/mp4" })); }
  catch (e) { VF.urls[k] = d; }
  return VF.urls[k];
}
function vidMake(k) {
  const v = document.createElement("video");
  v.muted = true; v.defaultMuted = true; v.loop = true; v.autoplay = true; v.playsInline = true;
  v.setAttribute("playsinline", ""); v.setAttribute("muted", ""); v.preload = "auto"; v.setAttribute("aria-label", "Gebärdenvideo");
  v.src = vidUrl(k);
  v.onerror = () => { if (v.src !== VIDEOS[k]) { v.src = VIDEOS[k]; v.play().catch(() => { }); } };
  v.addEventListener("loadedmetadata", () => { v.playbackRate = VF.slow ? .5 : 1; });
  return v;
}
function vidPlay(v) { v.playbackRate = VF.slow ? .5 : 1; if (!VF.paused) v.play().catch(() => { }); }
/* alle Video-Kacheln in einem Bereich starten (nach jedem Neuzeichnen aufrufen); höchstens ein Video zur Zeit */
function vidMountAll(root) {
  const tiles = [...(root || document).querySelectorAll(".pvid[data-vid]")];
  if (!tiles.length) { if (VF.open && !document.querySelector(".pvid[data-vid]")) vidClose(false); return; }
  tiles.forEach((t, i) => { if (i === 0) vidMount(t); else { t.innerHTML = '<span class="vbig">' + VI.big + '</span>'; t.onclick = () => { VF.key = null; vidMount(t); if (!VF.open) vidOpen(); }; } });
}
function vidMount(tile) {
  const k = tile.dataset.vid; VF.tile = tile;
  if (VF.key !== k || !VF.el) { VF.key = k; VF.el = vidMake(k); VF.paused = false; }
  if (VF.open) {
    $("vflSt").innerHTML = ""; $("vflSt").appendChild(VF.el); vidPlay(VF.el); vidBtns();
    tile.classList.add("away"); tile.innerHTML = '<span class="vaway">groß geöffnet</span>';
  } else {
    tile.classList.remove("away"); tile.innerHTML = ""; tile.appendChild(VF.el);
    tile.insertAdjacentHTML("beforeend", '<span class="vbig">' + VI.big + '</span>'); vidPlay(VF.el);
  }
  tile.onclick = () => { if (!VF.open) vidOpen(); };
}
function vidBuild() {
  if ($("vfl")) return;
  const f = el("div", "vfl"); f.id = "vfl"; f.hidden = true;
  f.innerHTML = '<div class="vbar" id="vflBar"><span class="grip">' + VI.grip + '<span>Gebärde</span></span>'
    + '<button type="button" id="vflPlay"></button><button type="button" id="vflSlow" aria-pressed="false" aria-label="Zeitlupe">Langsam</button>'
    + '<button type="button" id="vflSmall" aria-label="Video kleiner">−</button><button type="button" id="vflLarge" aria-label="Video größer">+</button>'
    + '<button type="button" id="vflClose" aria-label="Video wieder klein">' + VI.close + '</button></div><div class="vst" id="vflSt"></div>';
  document.body.appendChild(f);
  $("vflPlay").onclick = () => { VF.paused = !VF.paused; if (VF.el) { if (VF.paused) VF.el.pause(); else VF.el.play().catch(() => { }); } vidBtns(); };
  $("vflSlow").onclick = () => { VF.slow = !VF.slow; if (VF.el) VF.el.playbackRate = VF.slow ? .5 : 1; vidBtns(); };
  $("vflSmall").onclick = () => vidResize(-1); $("vflLarge").onclick = () => vidResize(1); $("vflClose").onclick = () => vidClose(true);
  const bar = $("vflBar"); let d = null;
  bar.addEventListener("pointerdown", e => { if (e.target.closest("button")) return; const r = f.getBoundingClientRect(); d = { x: e.clientX - r.left, y: e.clientY - r.top }; bar.setPointerCapture(e.pointerId); e.preventDefault(); });
  bar.addEventListener("pointermove", e => { if (d) vidPlace(e.clientX - d.x, e.clientY - d.y); });
  const end = () => { d = null; }; bar.addEventListener("pointerup", end); bar.addEventListener("pointercancel", end);
  addEventListener("resize", () => { if (VF.open) { vidSizeApply(); vidPlace(VF.pos.x, VF.pos.y); } });
}
function vidBtns() {
  $("vflPlay").innerHTML = VF.paused ? VI.play : VI.pause; $("vflPlay").setAttribute("aria-label", VF.paused ? "Video abspielen" : "Video anhalten");
  $("vflSlow").setAttribute("aria-pressed", VF.slow); $("vflSmall").disabled = VF.size === 0; $("vflLarge").disabled = VF.size === VSIZES.length - 1;
}
function vidSizeApply() { const w = Math.min(innerWidth - 16, Math.max(260, innerWidth * VSIZES[VF.size]), (innerHeight - 70) * 16 / 9); $("vfl").style.width = Math.round(w) + "px"; }
function vidPlace(x, y) {
  const f = $("vfl"), w = f.offsetWidth;
  x = Math.max(8 - w + 120, Math.min(innerWidth - 120, x)); y = Math.max(8, Math.min(innerHeight - 50, y));
  VF.pos = { x, y }; f.style.left = Math.round(x) + "px"; f.style.top = Math.round(y) + "px";
}
function vidResize(dir) {
  const f = $("vfl"), r = f.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  VF.size = Math.max(0, Math.min(VSIZES.length - 1, VF.size + dir)); vidSizeApply(); vidPlace(cx - f.offsetWidth / 2, cy - f.offsetHeight / 2); vidBtns();
}
function vidOpen() {
  vidBuild(); VF.open = true; const f = $("vfl"); f.hidden = false; vidSizeApply();
  if (VF.pos) vidPlace(VF.pos.x, VF.pos.y); else vidPlace((innerWidth - f.offsetWidth) / 2, Math.max(8, (innerHeight - f.offsetHeight) / 2));
  if (VF.tile) vidMount(VF.tile); vidBtns(); $("vflClose").focus();
}
function vidClose(back) {
  if (!VF.open) return; VF.open = false; $("vfl").hidden = true; $("vflSt").innerHTML = "";
  if (back && VF.tile && document.body.contains(VF.tile)) vidMount(VF.tile);
}
