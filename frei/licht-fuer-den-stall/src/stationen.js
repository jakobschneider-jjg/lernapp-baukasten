
/* ---------- Die Stationen ---------- */
const STATION = {
  /* 1 Der Weg im Dunkeln: Spuren lesen, Pfeilschloss am Wegweiser */
  1: {
    aufbau() {
      szene("weg");
      frei("figuren", 612, 852, "glut", "", 700, 700);
      frei("wegweiser", 210, 730, "schlossbild", img("schloss"), 70, 70);
      const marken = SPUR_WEG.map((seg, i) => frei("mitte", (seg[0][0] + seg[1][0]) / 2 + (i === 1 ? 70 : 0), (seg[0][1] + seg[1][1]) / 2 - (i === 1 ? 0 : 70), "spurmarke", '<b>' + (i + 1) + '</b>' + img(["rechts", "hoch", "rechts"][i], "mini"), 120, 80));
      ST.marken = marken; ST.spurGlanz = frei("mitte", 760, 800, "spurglanz", "", 1000, 320);
      spot("wegweiser", 210, 740, 280, 240, "s-weiser", oeffne);
      function oeffne() {
        schloss({ raeder: [1, 2, 3].map(i => ({ label: '<div class="rlabel"><b class="rnr">' + i + '</b></div>', werte: PFEILE })), code: ["rechts", "hoch", "rechts"],
          onOk: () => { document.body.classList.add("offen"); ST.spurGlanz.classList.add("an"); geschafft(); } });
      }
      $("aktion").innerHTML = img("schloss"); $("aktion").hidden = false; $("aktion").onclick = oeffne;
    },
    tipp(i) {
      if (i === 0) { ST.spurGlanz.classList.add("an"); setTimeout(() => ST.spurGlanz.classList.remove("an"), 3000); }
      if (i >= 1) ST.marken.forEach((m, k) => { if (i === 1 || k === 0) m.classList.add("an"); });
    }
  },
  /* 2 Die Stalltür: Tiere im dunklen Stall zählen, Zahlenschloss mit Tierbildern */
  2: {
    aufbau() {
      ST.gezaehlt = {}; ST.drinnen = false; aussen();
    },
    tipp(i) {
      if (i === 0 && !ST.drinnen) { const f = document.querySelector(".s-fenster"); if (f) f.classList.add("zeig"); }
      if (i >= 1) { ST.zaehlerSichtbar = true; zaehler(); }
      if (i === 1 && ST.drinnen) { B.blitz = true; setTimeout(() => B.blitz = false, 1400); }
    }
  },
  /* 3 Wer hilft der Frau? Tiere befragen, Bilderschloss Bedürfnis → Tier */
  3: {
    aufbau() {
      szene("frau");
      const blasen = [["hand", 600, 480], ["hunger", 800, 420], ["muede", 1000, 480]].map(b => frei("frau", b[1], b[2], "blase", img(b[0], "bbild"), 150, 130));
      ST.blasen = blasen;
      const tiere = { pferd: [[300, 640, 360, 300]], kuh: [[1170, 650, 360, 260]], schaf: [[520, 900, 160, 120], [1060, 920, 160, 120], [1220, 900, 150, 110]], huhn: [[1470, 590, 150, 130]] };
      ST.tierSpots = [];
      Object.entries(tiere).forEach(([t, liste]) => liste.forEach(a => {
        const eb = t === "schaf" ? "schafe" : "tiere";
        ST.tierSpots.push(spot(eb, a[0], a[1], a[2], a[3], "tierspot t-" + t, b => fragen(t, b)));
      }));
      function fragen(t, b) {
        const T = TX[3].tiere[t], s = S.stufe;
        b.classList.add("gefragt");
        karte('<div class="kopf">' + img(t, "kopfico") + '<h2>' + (s === 1 ? "" : NAME[t][t === "schaf" ? 1 : 0]) + '</h2></div>' + bildreihe(T.bild) + (s === 1 ? "" : '<div class="lesen st' + s + '"><p>' + T[s] + '</p></div>'));
      }
      const oeffne = () => schloss({ raeder: [["hand", "kalte Hände"], ["hunger", "Hunger"], ["muede", "müde"]].map(x => ({ label: radLabel(x[0], x[1]), werte: TIERWERTE })), code: ["pferd", "kuh", "schaf"],
        onOk: () => { ST.blasen.forEach(b => b.classList.add("geloest")); [["tiere", 420, 380], ["tiere", 1240, 420], ["schafe", 1060, 760]].forEach(h => frei(h[0], h[1], h[2], "herzflug", img("herz", "mini"))); geschafft(); } });
      blasen.forEach(b => { b.style.pointerEvents = "auto"; b.onclick = oeffne; });
      $("aktion").innerHTML = img("schloss"); $("aktion").hidden = false; $("aktion").onclick = oeffne;
    },
    tipp(i) {
      if (i === 0) ST.tierSpots.forEach(s => { s.classList.add("zeig"); setTimeout(() => s.classList.remove("zeig"), 3500); });
      if (i >= 1) { ST.tierSpots.filter(s => s.classList.contains("t-pferd")).forEach(s => s.classList.add("zeig")); ST.blasen[0].classList.add("zeig"); }
    }
  },
  /* 4 Der Stern: Sterne der Reihe nach verbinden */
  4: {
    aufbau() {
      szene("himmel");
      const s = S.stufe, kurz = s <= 2, cx = 800, cy = 410, R = 235, Ri = 98;
      const pkt = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, q = i % 2 ? Ri : R; pkt.push([cx + q * Math.cos(a), cy + q * Math.sin(a)]); }
      const folge = kurz ? [0, 4, 8, 2, 6].map(i => pkt[i]) : pkt;
      const WORT = ["eins", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun", "zehn"];
      const ns = "http://www.w3.org/2000/svg", lay = ebene("sterne"), svg = document.createElementNS(ns, "svg");
      svg.setAttribute("viewBox", (-MARGIN_X) + " " + (-MARGIN_Y) + " " + (W * (1 + OVER)) + " " + (H * (1 + OVER))); svg.setAttribute("class", "linien"); lay.appendChild(svg);
      const linie = document.createElementNS(ns, "polyline"); linie.setAttribute("class", "sternlinie"); svg.appendChild(linie);
      ST.folge = folge; ST.k = 0; ST.pts = [];
      ST.knoepfe = folge.map((p, i) => {
        const b = spot("sterne", p[0], p[1], 140, 140, "sternpunkt", () => tippen(i, b));
        b.innerHTML = img("stern", "spbild") + '<b class="' + (s === 4 ? "wort" : "") + '">' + (s === 4 ? WORT[i] : i + 1) + '</b>'; return b;
      });
      ST.gross = frei("sterne", cx, cy, "grossstern", img("stern", "gsbild"), 560, 560);
      function tippen(i, b) {
        if (ST.k >= folge.length) return;
        if (i !== ST.k) { fehler(); wackeln(b); ST.reihe = (ST.reihe || 0) + 1; if (ST.reihe >= 2) blink(); return; }
        ST.reihe = 0; b.classList.add("an"); b.classList.remove("blink"); ST.pts.push(folge[i]); ST.k++;
        const p = ST.pts.concat(ST.k === folge.length ? [folge[0]] : []); linie.setAttribute("points", p.map(q => q.join(",")).join(" "));
        if (ST.k === folge.length) { setTimeout(() => { ST.gross.classList.add("an"); document.body.classList.add("offen"); }, 500); geschafft(); }
      }
      function blink() { const n = ST.knoepfe[ST.k]; if (n) n.classList.add("blink"); }
      ST.blink = blink;
    },
    tipp() { ST.blink(); }
  },
  /* 5 Die Hirten: an jeder Kreuzung den Weg zum Stern wählen */
  5: {
    aufbau() {
      szene("felder");
      ST.figur = sprite("feld", FELD_START[0], FELD_START[1] - 90, 300, 250, (z) => { FIG.hirte(z, 70, 196, .75, { c: "#6f7f8f" }); FIG.hirte(z, 140, 198, .78, { c: "#a0563b" }); FIG.schaf(z, 200, 196, .55); }, "hirten");
      ST.g = 0; ST.fehlHier = 0; ST.pfeile = [];
      laufe([FELD_START, [300, 890], GABELN[0].an], () => zeigeGabel());
    },
    tipp(i) { if (i >= 1) { const g = ST.pfeile.find(p => p.dataset.gut === "1"); if (g) g.classList.add("zeig"); } }
  },
  /* 6 Die Krippe: im Dunkeln suchen, mit Stroh füllen, Baby hineinlegen */
  6: {
    aufbau() {
      szene("krippe"); B.dunkel = .88; ST.phase = 0; ST.stroh = 0;
      ST.fuell = frei("dinge", 760, 742, "fuellung", "", 230, 70);
      ST.baby = sprite("frau", 600, 860, 170, 110, z => FIG.baby(z, 70, 50, .9), "baby");
      const dinge = [["eimer", 380, 740, 140, 150], ["kiste", 575, 755, 170, 130], ["gabel", 975, 640, 120, 380], ["sack", 1500, 745, 150, 170], ["pferd", 1290, 640, 330, 300], ["krippe", 760, 820, 300, 200], ["stroh", 220, 925, 300, 110]];
      ST.dinge = {};
      dinge.forEach(d => { ST.dinge[d[0]] = spot(d[0] === "stroh" ? "dinge" : "dinge", d[1], d[2], d[3], d[4], "ding d-" + d[0], b => tippe(d[0], b)); });
      spot("frau", 600, 860, 180, 120, "ding d-baby", b => tippe("baby", b));
      function tippe(was, b) {
        if (ST.phase === 0) {
          if (was === "krippe") { ST.phase = 1; b.classList.add("gefunden"); B.dunkel = .3; schritt(); return; }
          if (was === "baby" || was === "stroh") return;
          fehler(); wackeln(b); sprech("dinge", 800, 300, S.stufe === 1 ? img("bett", "mini") + " ✗" : TX[6].nein[S.stufe], 1800);
          if (ST.fehl % 2 === 0) hinweis(S.stufe === 1 ? "💡" : "Tipp: Fragt die Laterne.");
          return;
        }
        if (ST.phase === 1 && was === "stroh") { ST.stroh++; ST.fuell.style.setProperty("--h", Math.min(1, ST.stroh / 3)); ST.fuell.classList.add("an"); sprech("dinge", 300, 820, "✓", 700); if (ST.stroh >= 3) { ST.phase = 2; schritt(); } return; }
        if (ST.phase === 2 && was === "baby") { ST.phase = 3; ST.baby.classList.add("inkrippe"); setzePos(ST.baby, 765, 700); geschafft(); }
      }
      function schritt() {
        const s = S.stufe, t = TX[6].schritte;
        if (ST.phase === 1) { ST.dinge.stroh.classList.add("zeig"); karte(s === 1 ? bildreihe(["stroh", "→", "krippe"]) : '<div class="lesen st' + s + '"><p>' + t[s][0] + '</p></div>'); }
        if (ST.phase === 2) { ST.dinge.stroh.classList.remove("zeig"); document.querySelector(".d-baby").classList.add("zeig"); karte(s === 1 ? bildreihe(["baby", "→", "krippe"]) : '<div class="lesen st' + s + '"><p>' + t[s][1] + '</p></div>'); }
      }
    },
    tipp(i) { if (i === 0) { B.blitz = true; setTimeout(() => B.blitz = false, 1300); } if (i >= 1 && ST.phase === 0) ST.dinge.krippe.classList.add("zeig"); }
  },
  /* 7 Finale: das allererste Weihnachten */
  7: {
    aufbau() {
      szene("finale");
      const st = frei("nacht", 800, 175, "finalstern", img("stern", "gsbild"), 280, 280);
      spot("nacht", 800, 175, 280, 280, "s-stern", () => {
        if (document.body.classList.contains("offen")) return;
        document.body.classList.add("offen"); st.classList.add("an");
        for (let i = 0; i < 26; i++) { const f = frei("nacht", 800 + (Math.random() - .5) * 1300, 80 + Math.random() * 420, "funke", img("stern", "mini")); f.style.animationDelay = (Math.random() * 1.2) + "s"; }
        geschafft();
      }).classList.add("zeig");
    }
  }
};

/* Station 2: Bühnenwechsel draußen ↔ drinnen */
function aussen() {
  ST.drinnen = false; szene("draussen"); B.dunkel = 0;
  frei("figuren", 1342, 818, "glut", "", 760, 760);
  frei("stall", 740, 702, "tuerlicht", "", 140, 204);
  frei("stall", 956, 641, "fensterlicht", "", 108, 86);
  const tuer = frei("stall", 740, 702, "tuer", "", 140, 204);
  SEED = 5150; { const c = document.createElement("canvas"); c.width = 140; c.height = 204; const x = c.getContext("2d"); const z = Z(x);
    z.rect(4, 4, 132, 196, { fill: C.holz2, fillStyle: "solid" }); z.mal("rectangle", [6, 6, 128, 192], [C.holz2, "#8a5226"], { gap: 5 }); z.line(46, 6, 46, 198, { strokeWidth: 2.4, stroke: C.holzD }); z.line(92, 6, 92, 198, { strokeWidth: 2.4, stroke: C.holzD });
    z.line(8, 50, 132, 50, { strokeWidth: 6, stroke: C.holzD }); z.line(8, 150, 132, 150, { strokeWidth: 6, stroke: C.holzD }); korn(x, .25); tuer.appendChild(c); }
  frei("stall", 778, 716, "schlossbild", img("schloss"), 70, 70);
  frei("stall", 704, 650, "zettelbild", '<span>?</span>', 54, 66);
  spot("stall", 956, 641, 150, 130, "s-fenster", b => { b.classList.remove("zeig"); innen(); });
  spot("stall", 776, 720, 96, 110, "s-schloss", oeffne2);
  spot("stall", 704, 650, 80, 90, "s-zettel", () => {
    const s = S.stufe;
    karte('<div class="kopf"><h2>' + (s === 1 ? "?" : "Ein Zettel an der Tür") + '</h2></div>' + (s === 1 ? bildreihe(["fenster", "→"].concat(["pferd", "kuh", "huhn", "schaf"]).concat(["→", "schloss"])) : lesen(2, "auftrag")));
  });
  $("aktion").innerHTML = img("schloss"); $("aktion").hidden = false; $("aktion").onclick = oeffne2; $("zaehler").hidden = true;
  if (S.fertig[2] && ST.geoeffnet) document.body.classList.add("offen");
}
let RAD2 = null;
function oeffne2() {
  if (ST.drinnen) { aussen(); }
  schloss({ raeder: ["pferd", "kuh", "huhn", "schaf"].map(t => ({ label: radLabel(t, NAME[t][1]), werte: ZAHLEN })), code: [1, 1, 1, 5], wert: RAD2,
    onOk: () => { ST.geoeffnet = true; document.body.classList.add("offen"); geschafft(); } });
  RAD2 = SCHLOSS.wert;
}
function innen() {
  ST.drinnen = true; szene("drinnen"); B.dunkel = .9; $("aktion").hidden = true;
  { const m = sprite("schafe", 1440, 890, 110, 70, z => FIG.maus(z, 55, 62, 1), "maus"); m.id = "maus"; }
  TIERE_INNEN.forEach((t, i) => { const b = spot(t.ebene, t.x, t.y - t.h / 2 + 10, t.w, t.h, "tier t-" + t.typ, () => { b.classList.toggle("on"); ST.gezaehlt[t.typ] = (ST.gezaehlt[t.typ] || 0) + (b.classList.contains("on") ? 1 : -1); zaehler(); }); if (ST.markiert && ST.markiert[i]) b.classList.add("on"); });
  spot("schafe", 1440, 890, 90, 60, "t-maus", b => { if (b.classList.contains("weg")) return; b.classList.add("weg"); const m = $("maus"); m.classList.add("lauf"); setTimeout(() => { m.classList.remove("lauf"); b.classList.remove("weg"); }, 4200); });
  ST.markiert = ST.markiert || {}; document.querySelectorAll(".tier").forEach((b, i) => b.addEventListener("click", () => { ST.markiert[i] = b.classList.contains("on"); }));
  $("zurKarte").hidden = true; $("zurueck").hidden = false; zaehler();
}
function zaehler() {
  const z = $("zaehler"), s = S.stufe, sicht = s <= 2 || ST.zaehlerSichtbar;
  z.hidden = !ST || ST.nr !== 2 || !ST.drinnen || !sicht;
  z.innerHTML = ["pferd", "kuh", "huhn", "schaf"].map(t => { const n = ST.gezaehlt[t] || 0; return '<span class="zchip">' + img(t) + (s >= 2 ? '<i>' + NAME[t][n === 1 ? 0 : 1] + '</i>' : "") + '<b>' + n + '</b></span>'; }).join("");
}
/* Station 5: Hirten laufen lassen */
function laufe(punkte, fertigFn) {
  let i = 0; const f = ST.figur;
  (function schritt() {
    if (i >= punkte.length) { fertigFn && fertigFn(); return; }
    setzePos(f, punkte[i][0], punkte[i][1] - 90); i++; setTimeout(schritt, 650);
  })();
}
function zeigeGabel() {
  ST.pfeile.forEach(p => p.remove()); ST.pfeile = [];
  const g = GABELN[ST.g]; if (!g) return;
  [["gut", g.gut], ["falsch", g.falsch]].sort(() => Math.random() - .5).forEach(([art, weg]) => {
    const a = weg[0], b = weg[1], w = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI, x = a[0] + (b[0] - a[0]) * .7, y = a[1] + (b[1] - a[1]) * .7;
    const p = spot("feld", x, y, 130, 130, "wegpfeil", () => waehle(art, weg)); p.dataset.gut = art === "gut" ? "1" : "0";
    p.innerHTML = '<img class="pfbild" src="' + iconURL("rechts") + '" style="transform:rotate(' + w.toFixed(0) + 'deg)" alt="">'; ST.pfeile.push(p);
  });
  if (ST.fehlHier >= 2) ST.pfeile.find(p => p.dataset.gut === "1").classList.add("zeig");
}
function waehle(art, weg) {
  ST.pfeile.forEach(p => p.remove()); ST.pfeile = [];
  if (art === "falsch") {
    laufe(weg, () => {
      fehler(); ST.fehlHier++; sprech("feld", weg[2][0], weg[2][1] - 220, S.stufe === 1 ? "✗" : TX[5].sack[S.stufe], 1800);
      setTimeout(() => laufe(weg.slice().reverse(), zeigeGabel), 1500);
    });
    return;
  }
  ST.fehlHier = 0;
  laufe(weg.slice(1), () => { ST.g++; if (ST.g < GABELN.length) zeigeGabel(); else geschafft(); });
}
