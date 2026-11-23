/* ==========================================================================
   Baukasten: Stufen, Missionen, Aufgaben, Hilfen, Abzeichen
   Inhalt kommt aus APP (apps/<name>/content.js), siehe README.
   ========================================================================== */
const ORDER = () => APP.levels.map(l => l.id);
function levelDef(id) { if (APP.track && id === APP.track.id) return APP.track; return APP.levels.find(l => l.id === id); }
const SIZE = {};
function computeSizes() {
  const all = APP.levels.concat(APP.track ? [APP.track] : []);
  all.forEach(L => L.missions.forEach(m => { SIZE[L.id + "|" + m] = APP.buildTasks(L.id, m).length; }));
}
function sizeOf(l, m) { return SIZE[l + "|" + m] || 0; }

function prog(level, mid) { S.prog[level] = S.prog[level] || {}; S.prog[level][mid] = S.prog[level][mid] || { stars: 0, total: 0, done: false }; return S.prog[level][mid]; }
function starsOf(st, l) { const p = (st.prog || {})[l] || {}; return Object.values(p).reduce((a, x) => a + (x && x.stars || 0), 0); }
function badgesOf(st, l) { const p = (st.prog || {})[l] || {}; return levelDef(l).missions.filter(m => p[m] && p[m].done).length; }
function totalStars(l) { return starsOf(S, l); }
function levelTotalAll(l) { return levelDef(l).missions.reduce((a, m) => a + sizeOf(l, m), 0); }

/* Freischalt-Codes (z. B. „Netz-Schlüssel“): Missionen bleiben gesperrt, bis der Code eingegeben ist */
function lockOf(mid) { const L = APP.locks || {}; for (const id in L) if (L[id].missions.includes(mid)) return id; return null; }
function isLocked(mid) { const id = lockOf(mid); return !!(id && !S.locksOpen[id]); }

/* nächste Stufe öffnet sich mit Anteil der Sterne der vorigen (nur zugängliche Missionen zählen) */
function levelTotal(l) { return levelDef(l).missions.filter(m => !isLocked(m)).reduce((a, m) => a + sizeOf(l, m), 0); }
function need(l) { return Math.ceil(levelTotal(l) * (APP.unlockShare || 0.7)); }
/* Stufe mit Code-Sperre (levels[i].lock = Schlüssel aus APP.locks): öffnet sich erst, wenn Sterne UND Code da sind */
function levelCodeOk(l) { const L = levelDef(l); return !L || !L.lock || !!S.locksOpen[L.lock]; }
function starsOk(l) { const o = ORDER(), i = o.indexOf(l); if (i <= 0) return true; const prev = o[i - 1]; return unlocked(prev) && totalStars(prev) >= need(prev); }
function codeWaiting(l) { return !unlocked(l) && starsOk(l) && !levelCodeOk(l); }
function unlocked(l) {
  const o = ORDER(), i = o.indexOf(l); if (i <= 0 || S.unlockAll || APP.parallel) return true; /* APP.parallel: Stufen sind Niveaus nebeneinander, keine Sperre */
  if (S.opened[l]) return true;
  const ok = starsOk(l) && levelCodeOk(l);
  if (ok) { S.opened[l] = true; save(); } return ok;
}
function scoreScaled() {
  if (APP.score) return Math.max(0, Math.min(1, APP.score(S))); /* eigene Berechnung des Kachel-Werts */
  if (S.track && APP.track) return Math.min(1, starsOf(S, APP.track.id) / Math.max(1, levelTotalAll(APP.track.id)));
  const tot = ORDER().reduce((a, l) => a + levelTotalAll(l), 0);
  return Math.min(1, ORDER().reduce((a, l) => a + starsOf(S, l), 0) / Math.max(1, tot));
}
function stat(level) { S.stats[level] = S.stats[level] || { n: 0, first: 0, hint: 0, sol: 0 }; return S.stats[level]; }

function badgeSVG(mid, big) {
  const m = APP.missions[mid];
  return '<svg class="' + (big ? "bigbadge" : "") + '" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#fff4cc" stroke="#e0a400" stroke-width="6"/><g transform="translate(18,18) scale(.32)">' + m.icon() + '</g></svg>';
}

/* ---------- Startseite ---------- */
function renderStart() {
  const trackOn = !!(S.track && APP.track);
  document.body.classList.toggle("trackmode", trackOn);
  $("appTitle").textContent = APP.title; $("appSub").textContent = APP.subtitle || "";
  $("hero").innerHTML = APP.hero ? APP.hero() : "";
  renderExtras(trackOn);
  if (APP.renderStart) { APP.renderStart($("levels")); renderLvStatus(); return; } /* eigene Startseite (z. B. Kalender) */
  if (trackOn) {
    const T = APP.track;
    $("levels").innerHTML = '<button class="levelbtn card trackbtn" data-l="' + T.id + '">' + (T.startHTML ? T.startHTML() : '<span class="marks">' + (T.marks || "") + '</span>' + T.label) + '<span class="lvinfo"><span class="sti">' + ICON.star + '</span>' + totalStars(T.id) + '</span></button>';
    $("levels").querySelector("button").onclick = () => { S.level = T.id; save(); go("map"); };
    renderLvStatus(); return;
  }
  const o = ORDER();
  $("levels").innerHTML = o.map((k, i) => {
    const L = levelDef(k), open = unlocked(k), st = totalStars(k), cw = !open && codeWaiting(k);
    const icons = '<span class="lvicons">' + (L.icons ? L.icons() : "") + '</span>';
    const info = open ? '<span class="lvinfo"><span class="sti">' + ICON.star + '</span>' + st + '</span>'
      : cw ? '<span class="lvinfo codeinfo">' + ICON.lock + ICON.key + '</span>'
      : '<span class="lvinfo">' + ICON.lock + '<span class="sti">' + ICON.star + '</span>' + totalStars(o[i - 1]) + ' / ' + need(o[i - 1]) + '</span>';
    return '<button class="levelbtn card' + (open ? "" : cw ? " codewait" : " locked") + '" data-l="' + k + '"' + (open || cw ? "" : " disabled") + '><span class="marks">' + (L.marks || "") + '</span>' + L.label + icons + info + '</button>';
  }).join('<span class="arrow">' + ICON.next.replace('#fff', '#9aa6b6') + '</span>');
  $("levels").querySelectorAll("button:not([disabled])").forEach(b => b.onclick = () => {
    const k = b.dataset.l; if (b.classList.contains("codewait")) { openLock(levelDef(k).lock, k); return; }
    S.level = k; save(); go("map");
  });
  renderLvStatus();
}

/* ---------- Missionsübersicht ---------- */
function renderMap() {
  const L = levelDef(S.level), isTrack = !!(APP.track && S.level === APP.track.id);
  const o = ORDER(), i = o.indexOf(S.level), nxt = isTrack ? null : o[i + 1];
  $("mapMarks").innerHTML = isTrack && APP.track.mapHTML ? APP.track.mapHTML() : (L.marks || "");
  $("mapStars").textContent = totalStars(S.level);
  $("missions").innerHTML = L.missions.map(mid => {
    const m = APP.missions[mid], p = prog(S.level, mid), n = sizeOf(S.level, mid), lk = isLocked(mid);
    let dots = ""; for (let k = 0; k < n; k++) dots += '<span class="dot ' + (k < p.stars ? "s" : "") + '"></span>';
    return '<button class="mission card ' + (p.done ? "done" : "") + (lk ? " locked" : "") + '" data-m="' + mid + '">' + (lk ? '<span class="lockov">' + ICON.lock + '</span>' : "")
      + '<span class="badge">' + badgeSVG(mid) + '</span><svg class="ico" viewBox="0 0 200 200">' + m.icon() + '</svg><span class="mname">' + m.name + '</span><span class="prog">' + dots + '</span></button>';
  }).join("");
  $("missions").querySelectorAll(".mission").forEach(b => b.onclick = () => b.classList.contains("locked") ? openLock(lockOf(b.dataset.m)) : startMission(b.dataset.m));
  const g = $("goal");
  if (nxt) {
    const have = totalStars(S.level), nd = need(S.level), pc = Math.min(100, Math.round(have / Math.max(1, nd) * 100)), open = unlocked(nxt);
    g.innerHTML = '<span class="sti">' + ICON.star + '</span><div class="bar"><div style="width:' + pc + '%"></div></div><b>' + Math.min(have, nd) + ' / ' + nd + '</b>'
      + '<span class="gnext ' + (open ? "open" : "") + '">' + (open ? ICON.unlock : ICON.lock) + '<span class="marks">' + (levelDef(nxt).marks || "") + '</span></span>'
      + (open ? '<button class="next" id="goNext">' + levelDef(nxt).label + ' ' + ICON.next + '</button>'
        : codeWaiting(nxt) ? '<button class="next" id="goCode">' + ICON.key + '</button>' : "");
    g.style.display = "";
    const gn = $("goNext"); if (gn) gn.onclick = () => { S.level = nxt; save(); go("map"); };
    const gc = $("goCode"); if (gc) gc.onclick = () => openLock(levelDef(nxt).lock, nxt);
  } else g.style.display = "none";
  const rows = isTrack ? [APP.track.id] : o;
  $("slots").innerHTML = rows.map(l => levelDef(l).missions.map(mid => '<div class="slot">' + (prog(l, mid).done ? badgeSVG(mid) : "") + '</div>').join("")).join('<span class="sep"></span>');
  const all = rows.every(l => levelDef(l).missions.every(mid => prog(l, mid).done));
  $("crown").classList.toggle("on", all); $("crown").querySelector(".cr").innerHTML = ICON.crown;
  $("crownLabel").textContent = APP.crownLabel || APP.title;
}

/* ---------- Mission und Aufgaben ---------- */
let M = null;
function startMission(mid) { const tasks = APP.buildTasks(S.level, mid); M = { mid, tasks, base: tasks.length, i: 0, stars: 0, res: [], err: 0 }; go("task"); renderTask(); }
function renderDots() {
  $("pdots").innerHTML = M.tasks.map((t, i) => { const r = M.res[i]; return '<span class="dot ' + (r === "s" ? "s" : r === "d" ? "d" : r === "r" ? "r" : "") + (t.again ? " again" : "") + '" style="' + (i === M.i ? "outline:3px solid var(--accent);outline-offset:2px" : "") + '"></span>'; }).join("");
  $("taskStars").textContent = totalStars(S.level) + M.stars;
}
function uniqueUrl(u) { const h = u.indexOf("#"), base = h < 0 ? u : u.slice(0, h), hash = h < 0 ? "" : u.slice(h); return base + (base.includes("?") ? "&" : "?") + "t=" + Date.now() + hash; }

function renderTask() {
  const t = M.tasks[M.i]; let tries = 0;
  M.cur = null; M.sel = null;
  renderDots();
  const fb = $("fb"); fb.className = "fb"; fb.innerHTML = "";
  const show = $("show"), ans = $("answers"), pr = $("prompt");
  ans.className = "answers " + (t.layout || "grid");
  const helpUrl = APP.helpLink ? APP.helpLink(t) : null;
  const helpBtn = helpUrl ? '<button class="iconbtn helpbtn" id="helpBtn" aria-label="Hilfe">' + ICON.help + '</button>' : "";
  pr.innerHTML = (t.again ? '<span class="againtag">' + ICON.again + '</span>' : "") + (t.prompt || "");
  const setShow = html => { show.style.display = html ? "" : "none"; show.innerHTML = (html || "") + (html ? helpBtn : ""); const hb = $("helpBtn"); if (hb) hb.onclick = openHelp; vidMountAll($("task")); };
  function openHelp() { let w = null; try { w = window.open(uniqueUrl(helpUrl), "_blank"); } catch (e) { } if (!w) note("Die Hilfe-Seite lässt sich hier nicht öffnen."); }
  setShow(t.show);
  const answer = String(t.answer);
  const drawAnswers = list => { ans.innerHTML = list.map(a => '<button class="ans" data-v="' + a.v + '">' + a.html + '</button>').join(""); wire(); };

  function runHint() {
    const h = t.hint;
    if (!h) return;
    if (typeof h === "function") { h({ task: t, show, answers: ans, setShow, drawAnswers, waitHint, tapHint }); return; }
    if (h.tap) { setShow(h.tap.show); tapHint(show.querySelectorAll(".tp"), h.tap.target, h.tap.sign || "", h.tap.text || "", h.tap.kinds); return; }
    if (h.wait) {
      if (h.wait.show) setShow(h.wait.show);
      if (h.wait.answers) { const wrong = [...ans.querySelectorAll(".ans.wrong")].map(b => b.dataset.v); drawAnswers(h.wait.answers); ans.querySelectorAll(".ans").forEach(b => { if (wrong.includes(b.dataset.v)) b.classList.add("wrong"); }); }
      waitHint(h.wait.icon || ICON.eye, h.wait.text || "", h.wait.ms || 3000);
    }
  }
  function good(node) {
    node.classList.add("right"); M.locked = true;
    if (!t.again) { M.stars++; M.res[M.i] = "s"; const st = stat(S.level); st.n++; if (tries === 0) st.first++; } else M.res[M.i] = "r";
    renderDots(); burst(node);
    showFb("good", '<span class="fbicon">' + (t.again ? ICON.ok : ICON.star) + '</span><span class="grow">Richtig!' + (t.goodText ? " " + t.goodText : "") + '</span>');
  }
  function bad(node, grey) {
    tries++; M.err++; node.classList.add("shake"); setTimeout(() => node.classList.remove("shake"), 400);
    if (grey) node.classList.add("wrong");
    if (!t.again) { const st = stat(S.level); if (tries === 1) st.hint++; if (tries === 2) { st.sol++; st.n++; } }
    if (tries < 2) { runHint(); return; }
    M.locked = true; M.res[M.i] = t.again ? "r" : "d"; clearTimeout(M.wt);
    ans.classList.remove("locked", "dim");
    if (t.build) { M.cur = t.build.answer.slice(); drawBuild(true); }
    else if (t.custom) { if (t.custom.solution) t.custom.solution(ctx); }
    else ans.querySelectorAll(".ans").forEach(b => { if (b.dataset.v === answer) b.classList.add("right", "solution"); });
    if (t.sol && t.sol.show) setShow(t.sol.show);
    let extra = "";
    if (!t.again) { const c = Object.assign({}, t, { again: true, answers: t.answers ? shuffle(t.answers) : t.answers }); M.tasks.push(c); extra = '<span class="againnote">' + ICON.again + 'kommt nochmal</span>'; }
    renderDots(); showFb("sol", '<span class="grow">' + ((t.sol && t.sol.text) || "") + '</span>' + extra);
  }
  function wire() {
    ans.querySelectorAll(".ans").forEach(btn => btn.onclick = () => {
      if (M.locked || ans.classList.contains("locked")) return;
      if (btn.dataset.v === answer) good(btn);
      else bad(btn, ans.querySelectorAll(".ans").length > 2); /* bei zwei Antworten bleiben beide: sonst wäre der 2. Versuch geschenkt */
    });
  }
  /* Bau-Aufgabe: t.build = { n, answer:[…], view(arr, {sel, solution}) -> HTML mit [data-slot],
     palette:[{v, html}] (Kästchen füllen)  ODER  cycle:["", "x", …] (Kästchen antippen schaltet weiter) } */
  function drawBuild(solution) {
    const B = t.build; if (!M.cur) M.cur = Array(B.n).fill(B.cycle ? B.cycle[0] : "");
    const arr = M.cur, full = B.cycle ? true : arr.every(v => v !== "");
    ans.className = "answers build " + (t.layout || "") + (ans.classList.contains("locked") ? " locked" : "");
    ans.innerHTML = '<div class="bview' + (solution ? " right solution" : "") + '" id="bview">' + B.view(arr, { sel: M.sel, solution: !!solution }) + '</div>'
      + '<div class="brow">' + (B.palette ? '<div class="bpal">' + B.palette.map(p => '<button class="ans bp" data-v="' + p.v + '">' + p.html + '</button>').join("") + '</div>' : '<div class="bpal"></div>')
      + '<button class="bcheck' + (full ? "" : " off") + '" id="bCheck" aria-label="Fertig">' + ICON.ok + '</button></div>';
    if (solution) return;
    const busy = () => M.locked || ans.classList.contains("locked");
    ans.querySelectorAll("[data-slot]").forEach(s => s.onclick = () => {
      if (busy()) return; const i = +s.dataset.slot;
      if (B.cycle) { const k = B.cycle.indexOf(arr[i]); arr[i] = B.cycle[(k + 1) % B.cycle.length]; }
      else { arr[i] = ""; M.sel = i; }
      drawBuild();
    });
    ans.querySelectorAll(".bp").forEach(b => b.onclick = () => {
      if (busy()) return;
      const i = (M.sel !== null && arr[M.sel] === "") ? M.sel : arr.indexOf(""); if (i < 0) return;
      arr[i] = b.dataset.v; M.sel = null; drawBuild();
    });
    $("bCheck").onclick = () => {
      if (busy() || !(B.cycle || arr.every(v => v !== ""))) return;
      if (arr.join("|") === B.answer.join("|")) { drawBuild(); good($("bview")); } else bad($("bview"), false);
    };
  }
  /* Eigene Aufgabenform: t.custom = { render(ctx), solution(ctx) }. render baut die Antwortfläche selbst
     und meldet ctx.good(node) bzw. ctx.bad(node). ctx.busy() = gerade gesperrt (Hilfe läuft / erledigt). */
  const ctx = { task: t, show, answers: ans, setShow, waitHint, tapHint, good, bad: n => bad(n, false), busy: () => M.locked || ans.classList.contains("locked") };
  M.locked = false;
  if (t.build) drawBuild(); else if (t.custom) { ans.className = "answers custom " + (t.layout || ""); ans.innerHTML = ""; t.custom.render(ctx); } else drawAnswers(t.answers);
}
/* Hilfe mit Wartezeit: Antworten kurz gesperrt, damit erst geschaut wird */
function waitHint(icon, text, ms) {
  const ans = $("answers"), fb = $("fb"); ms = ms || 3000;
  ans.classList.add("locked"); fb.className = "fb on hint";
  fb.innerHTML = '<span class="fbicon wide">' + icon + '</span><span class="grow">' + (text || "") + '</span><span class="wait"><i style="animation-duration:' + ms + 'ms"></i></span>';
  clearTimeout(M.wt); M.wt = setTimeout(() => { ans.classList.remove("locked"); const w = fb.querySelector(".wait"); if (w) w.remove(); }, ms);
}
/* Tipp-/Zählhilfe: jedes Element antippen, erst dann wieder antworten. kinds: {Schlüssel: Symbol-HTML} für Zählung nach Art (data-k) */
function tapHint(items, target, signHTML, text, kinds) {
  const ans = $("answers"), fb = $("fb"); ans.classList.add("locked", "dim"); fb.className = "fb on hint";
  const render = () => {
    const on = [...items].filter(e => e.classList.contains("on"));
    let k = "";
    if (kinds) { const c = {}; on.forEach(e => { const x = e.dataset.k; c[x] = (c[x] || 0) + 1; }); k = '<span class="chips">' + Object.entries(c).map(([x, n]) => '<span class="chip">' + (kinds[x] || x) + n + '</span>').join("") + '</span>'; }
    const done = on.length === target;
    fb.innerHTML = '<span class="fbicon">' + ICON.tap + '</span><span class="counter"><b>' + on.length + '</b>' + signHTML + '</span>' + k
      + '<span class="grow">' + (done ? '<span class="okline">' + ICON.ok + 'Jetzt antworten!</span>' : text) + '</span>';
    ans.classList.toggle("locked", !done); ans.classList.toggle("dim", !done);
  };
  items.forEach(e => e.addEventListener("click", ev => { ev.stopPropagation(); e.classList.toggle("on"); render(); }));
  render();
}
function showFb(cls, html) {
  const fb = $("fb"); fb.className = "fb on " + cls;
  fb.innerHTML = html + '<button class="next" id="nextBtn">Weiter ' + ICON.next + '</button>';
  $("nextBtn").onclick = nextTask; setTimeout(() => fb.scrollIntoView({ behavior: "smooth", block: "nearest" }), 50);
}
function nextTask() {
  clearTimeout(M.wt); M.i++;
  if (M.i < M.tasks.length) { renderTask(); return; }
  const o = ORDER(), i = o.indexOf(S.level), nxt = o[i + 1], before = nxt ? unlocked(nxt) : true;
  const p = prog(S.level, M.mid); p.total = M.base; p.stars = Math.max(p.stars, M.stars); p.done = true; save(); sendScore();
  $("doneUnlock").innerHTML = (nxt && !before && unlocked(nxt)) ? '<div class="unlockmsg">' + ICON.unlock + '<span class="marks">' + (levelDef(nxt).marks || "") + '</span>' + levelDef(nxt).label + ' ist frei!</div>' : "";
  $("doneBadge").innerHTML = badgeSVG(M.mid, true); $("doneStars").textContent = M.stars + " / " + M.base;
  go("done"); confetti(140);
  /* optionaler Haken für Apps: perfect = alle Aufgaben im 1. Versuch */
  if (APP.onMissionDone) APP.onMissionDone({ level: S.level, mid: M.mid, perfect: !M.err });
}

/* ---------- Freischalt-Code eingeben ---------- */
let LOCK = null, LOCK_LEVEL = null, LOCK_FROM = "map", codeIn = [];
function keyHTML(L, id) { const k = L.keys.find(x => x.id === id); return k ? k.html : id; }
function openLock(id, level) {
  LOCK = id; LOCK_LEVEL = level || null; const cur = document.querySelector(".screen.on"); LOCK_FROM = cur && cur.id === "start" ? "start" : "map";
  codeIn = []; $("codeTitle").textContent = APP.locks[id].label; renderCode(); go("code");
}
function renderCode() {
  const L = APP.locks[LOCK];
  $("codeSlots").innerHTML = L.code.map((x, i) => '<div class="cslot">' + (codeIn[i] ? '<div class="kv">' + keyHTML(L, codeIn[i]) + '</div>' : '<span>' + (i + 1) + '</span>') + '</div>').join("");
  $("codeKeys").innerHTML = L.keys.map(k => '<button class="ans" data-k="' + k.id + '"><div class="kv">' + k.html + '</div></button>').join("");
  $("codeKeys").querySelectorAll(".ans").forEach(b => b.onclick = () => {
    if (codeIn.length >= L.code.length) return; codeIn.push(b.dataset.k); renderCode();
    if (codeIn.length === L.code.length) setTimeout(() => {
      if (codeIn.join() === L.code.join()) {
        S.locksOpen[LOCK] = true; if (LOCK_LEVEL && unlocked(LOCK_LEVEL)) S.level = LOCK_LEVEL;
        save(); sendScore(); confetti(120); go(LOCK_LEVEL && S.level !== LOCK_LEVEL ? "start" : "map");
      }
      else { $("codeSlots").classList.add("shake"); setTimeout(() => { $("codeSlots").classList.remove("shake"); codeIn = []; renderCode(); }, 500); }
    }, 350);
  });
}

/* ---------- Extra-Bereiche (APP.extras): freie Spiel- und Übungsflächen ohne Sterne ----------
   APP.extras = [{ id, label, icon: () => "<svg-Inhalt im 200er-Raster>", render(el), track: true|false }] */
function renderExtras(trackOn) {
  const box = $("extras"); if (!box) return;
  const list = (APP.extras || []).filter(x => trackOn ? x.track : true);
  box.innerHTML = list.map(x => '<button class="extrabtn card" data-x="' + x.id + '"><svg viewBox="0 0 200 200">' + x.icon() + '</svg><span>' + x.label + '</span></button>').join("");
  box.querySelectorAll(".extrabtn").forEach(b => b.onclick = () => openExtra(b.dataset.x));
}
function openExtra(id) {
  const x = (APP.extras || []).find(e => e.id === id); if (!x) return;
  go("extra"); $("extraTitle").textContent = x.label; const body = $("extraBody"); body.innerHTML = ""; x.render(body);
}
