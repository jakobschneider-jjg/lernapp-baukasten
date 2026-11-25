"""Test der LearningView-Schnittstelle mit einem nachgebauten LearningView-Rahmen.
Die Elternseite läuft unter https://learningview.org (Herkunftsprüfung wie echt), die App in einem
iframe mit sandbox wie bei LearningView. Modi: student, studentReview, class, preview, ohne Antwort.
Aufruf: python3 tests/test_learningview.py dist/test.html
"""
import asyncio, json, sys, os, time
from playwright.async_api import async_playwright
sys.path.insert(0, os.path.dirname(__file__))
from helpers import Check, screen, play

APP = open(sys.argv[1], "rb").read()
PARENT = '''<!doctype html><html><body style="margin:0"><script>
window.LOG=[];window.VIOL=[];window.SCORES=[];window.STORE=null;window.CFG={};
let frame,inflight=false,lastSave=0,failed=false;
const post=m=>frame.contentWindow.postMessage(m,"*");
window.setup=function(cfg){window.CFG=cfg;window.STORE=cfg.initData??null;
  frame=document.createElement("iframe");frame.setAttribute("sandbox","allow-scripts allow-popups allow-popups-to-escape-sandbox");
  frame.style="width:1180px;height:820px;border:0";frame.src="https://content.test/app.html?lvmode="+(cfg.mode||"");
  document.body.appendChild(frame);}
window.addEventListener("message",e=>{
  if(!frame||e.source!==frame.contentWindow)return;
  const d=e.data;LOG.push({t:Date.now(),d});
  if(CFG.silent)return;
  if(d&&d.type==="saveAnswerData"){
    if(inflight)VIOL.push("gleichzeitig");
    if(lastSave&&Date.now()-lastSave<2000)VIOL.push("Abstand "+(Date.now()-lastSave)+" ms");
    lastSave=Date.now();inflight=true;
    if(CFG.saveFailOnce&&!failed){failed=true;setTimeout(()=>{inflight=false;post({type:"saveAnswerDataError",error:"SAVE_FAILED"})},300);return}
    setTimeout(()=>{STORE=d.data;inflight=false;post("SAVED")},CFG.saveDelay||300);return}
  if(d&&d.type==="getAnswerData"){setTimeout(()=>post({type:"sendAnswerData",data:STORE||""}),200);return}
  if(d&&d.type==="getClassAnswerData"){setTimeout(()=>post({type:"classDataConsentPending",request:"getClassAnswerData"}),100);
    setTimeout(()=>post(CFG.deny?{type:"sendClassAnswerData",error:"CLASS_DATA_CONSENT_DENIED"}:{type:"sendClassAnswerData",data:CFG.classData||[]}),1500);return}
  if(d&&d.result)SCORES.push(d.result.score.scaled);
});
</script></body></html>'''
INIT = '''if(location.hostname==="content.test"){const m=new URLSearchParams(location.search).get("lvmode");if(m&&m!=="none")window.learningView={mode:m};}'''
FAKE = '''<!doctype html><script>window.parent.postMessage("SAVED","*");window.parent.postMessage({type:"sendAnswerData",data:'{"prog":{"start":{"namen":{"stars":99}}}}'},"*")</script>'''

async def open_lv(p, cfg):
    b = await p.chromium.launch()
    ctx = await b.new_context(viewport={"width": 1200, "height": 840})
    await ctx.add_init_script(INIT)
    await ctx.route("https://learningview.org/**", lambda r: r.fulfill(status=200, content_type="text/html", body=PARENT))
    await ctx.route("https://content.test/**", lambda r: r.fulfill(status=200, content_type="text/html", body=APP))
    pg = await ctx.new_page(); errs = []
    pg.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
    pg.on("pageerror", lambda e: errs.append(str(e)))
    await pg.goto("https://learningview.org/mock")
    await pg.evaluate("cfg=>setup(cfg)", cfg)
    await pg.wait_for_timeout(600)
    for _ in range(60):  # große Dateien (eingebettete Videos) brauchen etwas länger
        fl = [f for f in pg.frames if "content.test" in f.url]
        if fl: break
        await pg.wait_for_timeout(250)
    fr = fl[0]
    await fr.wait_for_function("typeof APP !== 'undefined' && !!document.querySelector('.screen.on')", timeout=20000)
    return b, pg, fr, errs

async def types(pg):
    out = []
    for x in await pg.evaluate("LOG"):
        d = x["d"]
        out.append(d.get("type", "result" if "result" in d else "?") if isinstance(d, dict) else str(d))
    return out

async def main():
    c = Check()
    async with async_playwright() as p:
        print("A Schüler, erster Start")
        b, pg, fr, errs = await open_lv(p, {"mode": "student"}); await pg.wait_for_timeout(500)
        await fr.wait_for_function("document.querySelector('.screen.on') && document.querySelector('.screen.on').id === 'start'", timeout=15000)
        c("A Startseite nach Laden", await screen(fr) == "start")
        global L0
        L0 = await fr.evaluate("APP.levels[0].id")  # erste Stufe (z. B. „start“ oder ein Wortpaket)
        global M1, M2
        ch = await fr.evaluate("APP.levels[0].missions.filter(m=>{const t=APP.buildTasks(APP.levels[0].id,m)[0];return t&&t.answers&&!t.build&&!t.custom})")
        M1, M2 = ch[0], (ch[1] if len(ch) > 1 else ch[0])  # nur Auswahl-Missionen; gibt es nur eine, wird sie zweimal gespielt
        n2 = await fr.evaluate("sizeOf(APP.levels[0].id, %r)" % M2)
        await fr.click("[data-l=%s]" % L0); await play(fr, M1, wrong_first=True); await play(fr, M2)
        await pg.wait_for_timeout(5000)
        st = json.loads(await pg.evaluate("STORE"))
        c("A Lernstand gespeichert", st["prog"][L0][M1]["done"] and st["prog"][L0][M2]["stars"] == n2)
        stufen = await fr.evaluate("APP.errorFlow === 'stufen'")  # Stufen-Ablauf: 1. Fehler = nur Wartezeit, keine Hilfe
        c("A Statistik gespeichert", st["stats"][L0]["hint"] == (0 if stufen else 1) and st["stats"][L0]["n"] > 0, st["stats"])
        sc = await pg.evaluate("SCORES")
        c("A Ergebnis gesendet und steigend", len(sc) >= 2 and sc[-1] > 0 and sc == sorted(sc), sc)
        c("A Speicherregeln (eins zur Zeit, ≥ 2 s)", await pg.evaluate("VIOL") == [], await pg.evaluate("VIOL"))
        t = await types(pg)
        c("A Ablauf setDialogSize → getAnswerData → saveAnswerData", t[:2] == ["setDialogSize", "getAnswerData"] and "saveAnswerData" in t, t)
        c("A keine Namen im Lernstand", not any(k in json.dumps(st) for k in ('"name"', '"surname"', '"studentId"')))
        c("A keine JS-Fehler", not errs, errs)
        STARS_A = await fr.evaluate("totalStars('%s')" % L0); OPEN_A = await fr.evaluate("unlocked(APP.levels[1].id)")
        HAS_TRACK = await fr.evaluate("!!APP.track")  # Apps ohne Schiene: Schienen-Prüfung entfällt
        TID, TM, TTOT, TLABEL = await fr.evaluate("APP.track ? [APP.track.id, APP.track.missions[0], levelTotalAll(APP.track.id), APP.track.label] : [APP.levels[0].id, APP.levels[0].missions[0], 0, '']")
        saved = await pg.evaluate("STORE"); await b.close()

        print("B Neu öffnen mit gespeichertem Stand")
        b, pg, fr, errs = await open_lv(p, {"mode": "student", "initData": saved}); await pg.wait_for_timeout(500)
        c("B Sterne wieder da", await fr.evaluate("totalStars('%s')" % L0) == STARS_A > 0)
        c("B Stufe 1 wie zuvor", await fr.evaluate("unlocked(APP.levels[1].id)") == OPEN_A)
        await b.close()

        print("C Speicherfehler → neuer Versuch")
        b, pg, fr, errs = await open_lv(p, {"mode": "student", "saveFailOnce": True}); await pg.wait_for_timeout(500)
        await fr.click("[data-l=%s]" % L0); await play(fr, M2); await pg.wait_for_timeout(900)
        c("C Fehler angezeigt", await fr.evaluate("LV.statusCode") == "SAVE_FAILED")
        await pg.wait_for_timeout(7000)
        c("C nach neuem Versuch gespeichert", await pg.evaluate("STORE!==null") and await fr.evaluate("LV.statusCode") == "ok")
        c("C Speicherregeln", await pg.evaluate("VIOL") == [], await pg.evaluate("VIOL"))
        await b.close()

        print("D Lehrkraft sieht Lernstand (nur lesen)")
        b, pg, fr, errs = await open_lv(p, {"mode": "studentReview", "initData": saved}); await pg.wait_for_timeout(900)
        c("D Einzelansicht", await screen(fr) == "lvreview")
        c("D speichert nichts", "saveAnswerData" not in await types(pg) and "result" not in await types(pg))
        c("D keine JS-Fehler", not errs, errs)
        await b.close()

        print("E Klassenübersicht")
        tr = json.dumps({"track": True, "prog": {TID: {TM: {"stars": 5, "total": 6, "done": True}}}, "stats": {TID: {"n": 6, "first": 4, "hint": 2, "sol": 1}}, "t": int(time.time() * 1000)})
        cls = [{"studentId": 1, "name": "Mia", "surname": "Becker", "data": saved}, {"studentId": 2, "name": "<b>Ali</b>", "surname": "Arslan", "data": ""},
               {"studentId": 3, "name": "Tom", "surname": "Zander", "data": tr}, {"studentId": 4, "name": "Lea", "surname": "Kaya", "data": "{kaputt"}]
        b, pg, fr, errs = await open_lv(p, {"mode": "class", "classData": cls}); await pg.wait_for_timeout(300)
        c("E Hinweis während Freigabe", "Freigabe" in await fr.evaluate("$('lvMsg').textContent"))
        await pg.wait_for_timeout(1800)
        rows = await fr.evaluate("[...document.querySelectorAll('#lvTable tr')].map(r=>r.innerText.replace(/\\s+/g,' ').trim())")
        c("E 4 Zeilen + Kopf", len(rows) == 5, rows)
        c("E sortiert nach Nachname", rows[1].startswith("<b>Ali</b> Arslan"), rows[1])
        c("E Namen nicht als HTML", await fr.evaluate("!document.querySelector('#lvTable b')"))
        c("E nicht begonnen / unlesbar", "noch nicht begonnen" in rows[1] and "nicht lesbar" in " ".join(rows))
        if HAS_TRACK: c("E Schiene erkannt", any(TLABEL in r and ("5/%d" % TTOT) in r for r in rows), rows)
        await pg.screenshot(path=os.path.join(os.path.dirname(os.path.abspath(sys.argv[1])), "shot_klasse.png"))
        await fr.click("#lvBoard"); c("E Tafel aus Klassenansicht", await screen(fr) == "board")
        await fr.click("#board [data-go=start]"); c("E zurück zur Übersicht", await screen(fr) == "lvclass")
        c("E keine JS-Fehler", not errs, errs)
        await b.close()
        b, pg, fr, errs = await open_lv(p, {"mode": "class", "deny": True}); await pg.wait_for_timeout(2200)
        c("E Freigabe abgelehnt erklärt", "abgelehnt" in await fr.evaluate("$('lvMsg').textContent"))
        await b.close()

        print("F Vorschau")
        b, pg, fr, errs = await open_lv(p, {"mode": "preview"}); await pg.wait_for_timeout(400)
        await fr.click("[data-l=%s]" % L0); await play(fr, M2); await pg.wait_for_timeout(2500)
        t = await types(pg)
        c("F speichert nicht, sendet kein Ergebnis", "saveAnswerData" not in t and "result" not in t, t)
        c("F Hinweis Vorschau", "Vorschau" in await fr.evaluate("$('lvstat').textContent"))
        await b.close()

        print("G Im Rahmen, aber LearningView antwortet nicht")
        b, pg, fr, errs = await open_lv(p, {"mode": "none", "silent": True}); await pg.wait_for_timeout(1000)
        c("G wartet zuerst", await screen(fr) == "loading")
        await pg.wait_for_timeout(8000)
        c("G danach spielbar mit Warnung", await screen(fr) == "start" and "nicht verbunden" in await fr.evaluate("$('lvstat').textContent"))
        await b.close()

        print("H Fremde Nachrichten werden ignoriert")
        b, pg, fr, errs = await open_lv(p, {"mode": "student", "initData": saved}); await pg.wait_for_timeout(500)
        await fr.evaluate('''()=>{const f=document.createElement("iframe");f.srcdoc=%s;document.body.appendChild(f)}''' % json.dumps(FAKE))
        await pg.wait_for_timeout(600)
        c("H Lernstand nicht von fremder Quelle überschrieben", await fr.evaluate("totalStars('%s')" % L0) == STARS_A)
        await b.close()
    c.done()

asyncio.run(main())
