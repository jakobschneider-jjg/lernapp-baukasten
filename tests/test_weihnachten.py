"""Klicktest „Weihnachten im Stall“ (apps/weihnachten-im-stall).
Teil 1: alle 16 Türen auf allen 4 Stufen wie ein Kind (echte Taps): Fehler → Hilfe → richtig, Lösung nach 2. Fehler,
        Datumssperre, Lehrkraft-Code, Stufenwahl, Löschen, Tafel.
Teil 2: nachgebautes LearningView (Schüler, Neuladen, Einzelansicht, Klassenübersicht, Vorschau, fremde Nachrichten).
Aufruf: python3 tests/test_weihnachten.py <html> <code>"""
import asyncio, json, sys, os, time
from playwright.async_api import async_playwright
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from helpers import Check
HTML, CODE = os.path.abspath(sys.argv[1]), sys.argv[2]
ck = Check()
async def scr(pg): return await pg.evaluate("document.querySelector('.screen.on').id")
VORSCHLAEGE = []
async def kind_wahl(pg):
    """Stufenwahl beim ersten Start: Stufe 2 · sanfter Vorschlag: „Ich bleibe“"""
    await pg.wait_for_function("typeof VORSCHLAG==='undefined' || !VORSCHLAG || document.querySelector('.screen.on').id!=='start' || !!document.getElementById('stufeWahl')", timeout=5000)
    if await pg.locator('#stufeWahl [data-v="nein"]').count(): VORSCHLAEGE.append(1); await pg.click('#stufeWahl [data-v="nein"]')
    if await pg.locator('#stufeWahl .wahl[data-l="s2"]').count(): await pg.click('#stufeWahl .wahl[data-l="s2"]')
async def teacher(pg, stufe=None, alle=None, reset=False):
    await kind_wahl(pg)
    await pg.click('#infoBtn')
    for k in CODE: await pg.click('#pinPad button[data-k="%s"]' % k)
    await pg.wait_for_selector('#teachOpen:not([hidden])')
    if alle is not None:
        on = await pg.evaluate("document.getElementById('swAll').classList.contains('on')")
        if on != alle: await pg.click('#swAll')
    if stufe: await pg.click('.stufebtn[data-l="s%d"]' % stufe)
    if reset: await pg.click('#resetAll'); await pg.click('#resetYes')
    await pg.click('#closeInfo')
async def unlocked(pg): await pg.wait_for_function("!document.getElementById('answers').classList.contains('locked')", timeout=12000)
async def wrong(pg):
    isb = await pg.evaluate("!!M.tasks[M.i].build")
    if isb:
        ans = await pg.evaluate("M.tasks[M.i].build.answer")
        for v in reversed(ans): await pg.click('.bpal .ans[data-v="%s"]' % v)
        await pg.click('#bCheck')
    else:
        a = await pg.evaluate("String(M.tasks[M.i].answer)")
        for b in await pg.query_selector_all('#answers .ans'):
            if await b.get_attribute('data-v') != a and 'wrong' not in (await b.get_attribute('class') or ''):
                await b.click(); return
async def right(pg):
    isb = await pg.evaluate("!!M.tasks[M.i].build")
    if isb:
        for s in await pg.query_selector_all('#answers [data-slot]'):
            if await s.query_selector('svg'): await s.click()
        ans = await pg.evaluate("M.tasks[M.i].build.answer")
        for v in ans: await pg.click('.bpal .ans[data-v="%s"]' % v)
        await pg.click('#bCheck')
    else:
        a = await pg.evaluate("String(M.tasks[M.i].answer)")
        await pg.click('#answers .ans[data-v="%s"]' % a)
async def hint(pg):
    for t in await pg.query_selector_all('#show .tp'): await t.click()
    await unlocked(pg)
async def play(pg, door, mode):
    """mode: ok | hilfe (1. Aufgabe: falsch, Hilfe, richtig) | loesung (1. Aufgabe zweimal falsch)"""
    await kind_wahl(pg)
    await pg.click('.ktuer[data-n="%d"]' % door)
    assert await scr(pg) == 'door', 'Tür-Seite fehlt'
    await pg.click('#btnAufg')
    first, n = True, 0
    while await scr(pg) == 'task':
        n += 1
        if first and mode != 'ok':
            await wrong(pg); await pg.wait_for_timeout(120)
            locked = await pg.evaluate("document.getElementById('answers').classList.contains('locked')")
            if not locked: raise Exception('Tür %d: nach Fehler nicht gesperrt' % door)
            await hint(pg)
            if mode == 'loesung':
                await wrong(pg); await pg.click('#nextBtn'); first = False; continue
        first = False
        await unlocked(pg); await right(pg); await pg.click('#nextBtn')
        if n > 12: raise Exception('Endlosschleife Tür %d' % door)
    st = await pg.inner_text('#doneStars')
    await pg.click('#doneNext'); await pg.wait_for_timeout(80)
    return st, n
async def teil1():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width': 1180, 'height': 820})
        errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file://' + HTML); await pg.wait_for_timeout(300)
        ck('Start: Kalender mit 16 Türen', await pg.locator('.ktuer').count() == 16)
        ck('Erststart: Kind wählt seine Stufe', await pg.locator('#stufeWahl .wahl').count() == 4)
        await pg.click('#stufeWahl .wahl[data-l="s2"]')
        zu = await pg.locator('.ktuer.zu').count(); heute_vor = await pg.evaluate("Date.now() < new Date(2026,11,1).getTime()")
        if heute_vor:
            ck('vor dem 1.12.: alle Türen zu', zu == 16)
            await pg.click('.ktuer[data-n="1"]'); ck('gesperrte Tür öffnet nicht', await scr(pg) == 'start')
        # Datum: Uhr auf 8.12.2026 stellen -> Türen 1–6 offen
        pg2 = await b.new_page(); await pg2.clock.install(time='2026-12-08T09:00:00'); await pg2.goto('file://' + HTML); await pg2.wait_for_timeout(300)
        ck('8.12.: 6 Türen offen, 10 zu', await pg2.locator('.ktuer.offen').count() == 6 and await pg2.locator('.ktuer.zu').count() == 10, str(await pg2.locator('.ktuer.offen').count()))
        ck('8.12.: Tür 6 ist „heute“', await pg2.locator('.ktuer.heute[data-n="6"]').count() == 1)
        await pg2.close()
        # falscher Lehrkraft-Code
        await pg.click('#infoBtn')
        for k in '0000': await pg.click('#pinPad button[data-k="%s"]' % k)
        await pg.wait_for_timeout(900); ck('falscher Code öffnet nicht', await pg.is_hidden('#teachOpen')); await pg.click('#closeInfo')
        await teacher(pg, alle=True)
        ck('Schalter: alle Türen offen', await pg.locator('.ktuer.offen').count() == 16)
        ck('gewählte Stufe 2 gilt', await pg.evaluate("lvl()") == 's2')
        for st in (1, 2, 3, 4):
            await teacher(pg, stufe=st)
            for d in range(1, 17):
                mode = 'loesung' if d in (2, 4, 9) else 'hilfe' if d % 2 else 'ok'
                try:
                    stars, n = await play(pg, d, mode)
                    base = 3 if d in (4, 9, 14, 16) else 2
                    exp = '%d / %d' % (base - (1 if mode == 'loesung' else 0), base)
                    ck('Stufe %d Tür %d (%s): %s' % (st, d, mode, stars), stars.strip() == exp and n == base + (1 if mode == 'loesung' else 0), 'erwartet ' + exp + ', Aufgaben ' + str(n))
                except Exception as e:
                    ck('Stufe %d Tür %d (%s)' % (st, d, mode), False, str(e)[:200]); await pg.goto('file://' + HTML); await pg.wait_for_timeout(200)
            if st == 1:
                ck('nach Stufe 1: 16 Türen fertig', await pg.locator('.ktuer.fertig').count() == 16)
                ck('Kachel-Wert = 1', await pg.evaluate("scoreScaled()") == 1)
        # zwei Antworten: nach Fehler nichts ausgegraut
        await teacher(pg, stufe=1); await pg.click('.ktuer[data-n="1"]'); await pg.click('#btnAufg'); await wrong(pg); await pg.wait_for_timeout(100)
        ck('zwei Antworten: keine ausgegraut', await pg.locator('#answers .ans.wrong').count() == 0)
        await pg.click('#taskBack'); ck('Zurück aus Aufgabe → Tür-Seite', await scr(pg) == 'door'); await pg.click('#tuerZurueck'); ck('Zurück → Kalender', await scr(pg) == 'start')
        # Gebärden-Video ohne Adresse: Hinweis
        await pg.click('.ktuer[data-n="2"]'); await pg.click('#btnDgs'); ck('Video-Knopf ohne Adresse: Hinweis', 'kommt bald' in await pg.inner_text('#note')); await pg.click('#tuerZurueck')
        # Neuladen: Stand bleibt
        await pg.reload(); await pg.wait_for_timeout(300)
        ck('nach Neuladen: 16 Türen fertig, Stufe 1', await pg.locator('.ktuer.fertig').count() == 16 and await pg.evaluate("S.level") == 's1')
        # Löschen behält die Stufe
        await teacher(pg, reset=True)
        ck('Löschen: 0 fertig, Stufe bleibt', await pg.locator('.ktuer.fertig').count() == 0 and await pg.evaluate("S.level") == 's1')
        # Tafel
        await pg.click('#toBoard'); ck('Tafel öffnet', await scr(pg) == 'board'); await pg.click('#bReveal'); ck('Tafel: Lösung sichtbar', await pg.locator('#reveal.on').count() == 1)
        for dk in ('w2', 'w3', 'w4', 'hilft'): await pg.click('.deck[data-d="%s"]' % dk); await pg.click('#bNext')
        ck('sanfter Vorschlag kam (und wurde abgelehnt)', len(VORSCHLAEGE) >= 1, str(len(VORSCHLAEGE)))
        ck('keine Skriptfehler', not errs, str(errs[:3]))
        await b.close()
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
    await ctx.clock.install(time="2026-12-10T09:00:00")  # Türen 1–8 offen
    await ctx.add_init_script(INIT)
    await ctx.route("https://learningview.org/**", lambda r: r.fulfill(status=200, content_type="text/html", body=PARENT))
    await ctx.route("https://content.test/**", lambda r: r.fulfill(status=200, content_type="text/html", body=APP_HTML))
    pg = await ctx.new_page(); errs = []
    pg.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
    pg.on("pageerror", lambda e: errs.append(str(e)))
    await pg.goto("https://learningview.org/mock")
    await pg.evaluate("cfg=>setup(cfg)", cfg)
    await pg.wait_for_timeout(600)
    fr = [f for f in pg.frames if "content.test" in f.url][0]
    return b, pg, fr, errs
async def types(pg):
    out = []
    for x in await pg.evaluate("LOG"):
        d = x["d"]
        out.append(d.get("type", "result" if "result" in d else "?") if isinstance(d, dict) else str(d))
    return out
async def teil2():
    c = ck
    async with async_playwright() as p:
        print("A Schüler, erster Start")
        b, pg, fr, errs = await open_lv(p, {"mode": "student"}); await pg.wait_for_timeout(500)
        c("A Startseite mit Kalender", await scr(fr) == "start" and await fr.locator(".ktuer.offen").count() == 8)
        await play(fr, 1, "hilfe"); await play(fr, 2, "ok"); await pg.wait_for_timeout(5500)
        st = json.loads(await pg.evaluate("STORE"))
        c("A Lernstand gespeichert (Stufe 2, Tür 1 und 2)", st["prog"]["s2"]["t1"]["done"] and st["prog"]["s2"]["t2"]["stars"] == 2)
        c("A Statistik gespeichert", st["stats"]["s2"]["hint"] == 1)
        sc = await pg.evaluate("SCORES")
        c("A Ergebnis gesendet: 2 von 16 Türen", len(sc) >= 2 and abs(sc[-1] - 0.125) < 1e-6 and sc == sorted(sc), sc)
        c("A Speicherregeln (eins zur Zeit, ≥ 2 s)", await pg.evaluate("VIOL") == [], await pg.evaluate("VIOL"))
        t = await types(pg)
        c("A Ablauf setDialogSize → getAnswerData → saveAnswerData", t[:2] == ["setDialogSize", "getAnswerData"] and "saveAnswerData" in t, t)
        c("A keine Namen im Lernstand", not any(k in json.dumps(st) for k in ('"name"', '"surname"', '"studentId"')))
        c("A keine JS-Fehler", not errs, errs)
        saved = await pg.evaluate("STORE"); await b.close()

        print("B Neu öffnen mit gespeichertem Stand")
        b, pg, fr, errs = await open_lv(p, {"mode": "student", "initData": saved}); await pg.wait_for_timeout(500)
        c("B zwei Türen wieder fertig", await fr.locator(".ktuer.fertig").count() == 2)
        await b.close()

        print("C Speicherfehler → neuer Versuch")
        b, pg, fr, errs = await open_lv(p, {"mode": "student", "saveFailOnce": True}); await pg.wait_for_timeout(500)
        await play(fr, 3, "ok"); await pg.wait_for_timeout(900)
        c("C Fehler angezeigt", await fr.evaluate("LV.statusCode") == "SAVE_FAILED")
        await pg.wait_for_timeout(7000)
        c("C nach neuem Versuch gespeichert", await pg.evaluate("STORE!==null") and await fr.evaluate("LV.statusCode") == "ok")
        await b.close()

        print("D Lehrkraft sieht Lernstand (nur lesen)")
        b, pg, fr, errs = await open_lv(p, {"mode": "studentReview", "initData": saved}); await pg.wait_for_timeout(900)
        c("D Einzelansicht", await scr(fr) == "lvreview")
        c("D Stand-Text", "Stufe 2 (selbst gewählt) · 2/16 Türen" in await fr.evaluate("$('rvReached').textContent"))
        c("D speichert nichts", "saveAnswerData" not in await types(pg) and "result" not in await types(pg))
        c("D keine JS-Fehler", not errs, errs)
        await b.close()

        print("E Klassenübersicht")
        s4 = json.dumps({"level": "s4", "prog": {"s4": {"t5": {"stars": 2, "total": 2, "done": True}}}, "stats": {"s4": {"n": 2, "first": 1, "hint": 1, "sol": 0}}, "t": int(time.time() * 1000)})
        cls = [{"studentId": 1, "name": "Mia", "surname": "Becker", "data": saved}, {"studentId": 2, "name": "<b>Ali</b>", "surname": "Arslan", "data": ""},
               {"studentId": 3, "name": "Tom", "surname": "Zander", "data": s4}, {"studentId": 4, "name": "Lea", "surname": "Kaya", "data": "{kaputt"},
               {"studentId": 5, "name": "<img src=x onerror=alert(1)>", "surname": "Quast", "data": s4}, {"studentId": 6, "name": "Tom", "surname": "Albers", "data": s4}]
        b, pg, fr, errs = await open_lv(p, {"mode": "class", "classData": cls}); await pg.wait_for_timeout(300)
        c("E Hinweis während Freigabe", "Freigabe" in await fr.evaluate("$('lvMsg').textContent"))
        await pg.wait_for_timeout(1800)
        rows = await fr.evaluate("[...document.querySelectorAll('#lvTable tr')].map(r=>r.innerText.replace(/\\s+/g,' ').trim())")
        c("E 6 Zeilen + Kopf", len(rows) == 7, rows)
        c("E Namen nicht als HTML", await fr.evaluate("!document.querySelector('#lvTable b') && !document.querySelector('#lvTable td img')"))
        c("E Stand je Kind (Stufe · Türen)", any("Stufe 2 (selbst gewählt) · 2/16 Türen" in r for r in rows) and any("Stufe 4 (selbst gewählt) · 1/16 Türen" in r for r in rows), rows)
        c("E nicht begonnen / unlesbar", "noch nicht begonnen" in " ".join(rows) and "nicht lesbar" in " ".join(rows))
        await pg.screenshot(path=os.path.join(os.path.dirname(HTML), "shot_klasse.png"))
        c("E Klassenhimmel-Knopf über der Tabelle", await fr.locator('#lvTable #btnHimmel').count() == 1)
        await fr.click('#btnHimmel'); await pg.wait_for_timeout(5000)
        namen = await fr.evaluate("[...document.querySelectorAll('#himmel .ksname')].map(x=>x.textContent)")
        c("E Himmel: ein Stern je Kind, das mitgemacht hat (4)", len(namen) == 4, namen)
        c("E Himmel: nur Vornamen, gleiche Vornamen mit Initiale", "Mia" in namen and "Tom A." in namen and "Tom Z." in namen and not any("Becker" in n for n in namen), namen)
        c("E Himmel: Namen nur als Text", "<img src=x onerror=alert(1)>" in namen and await fr.evaluate("document.querySelectorAll('#himmel .ksname img').length") == 0)
        c("E Himmel: alle Sterne gleich groß", len(set(await fr.evaluate("[...document.querySelectorAll('#himmel .ksbild')].map(x=>x.offsetWidth)"))) == 1)
        await pg.screenshot(path=os.path.join(os.path.dirname(HTML), "shot_himmel.png"))
        await fr.click('#hZu'); c("E Himmel schließt", await fr.locator('#himmel').count() == 0)
        c("E Klassenansicht speichert nichts", "saveAnswerData" not in await types(pg))
        c("E keine JS-Fehler", not errs, errs)
        await b.close()

        print("I Licht-Abenteuer im LearningView-Rahmen (Sandbox)")
        b, pg, fr, errs = await open_lv(p, {"mode": "student", "initData": saved}); await pg.wait_for_timeout(500)
        await fr.click('.ktuer[data-n="4"]'); await fr.click('#btnLicht'); await pg.wait_for_timeout(2500)
        ef = [f for f in pg.frames if f.parent_frame == fr]
        c("I Rahmen lädt, Karte mit Station 1 offen", len(ef) == 1 and await ef[0].locator('.wegpunkt.offen').count() == 1)
        if ef: await ef[0].dispatch_event('#infoBtn', 'click'); await pg.wait_for_timeout(400)
        c("I „◀ Kalender“ schließt", await fr.locator('#escRahmen').count() == 0 and await scr(fr) == "door")
        errs = [e for e in errs if "Permissions policy violation" not in e]   # Chrome-Hinweis: Neigungssensor im Test-Rahmen nicht freigegeben (Wischen geht)
        c("I keine JS-Fehler", not errs, errs)
        await b.close()

        print("F Vorschau")
        b, pg, fr, errs = await open_lv(p, {"mode": "preview"}); await pg.wait_for_timeout(400)
        await play(fr, 1, "ok"); await pg.wait_for_timeout(2500)
        t = await types(pg)
        c("F speichert nicht, sendet kein Ergebnis", "saveAnswerData" not in t and "result" not in t, t)
        await b.close()

        print("G Im Rahmen, aber LearningView antwortet nicht")
        b, pg, fr, errs = await open_lv(p, {"mode": "none", "silent": True}); await pg.wait_for_timeout(1000)
        c("G wartet zuerst", await scr(fr) == "loading")
        await pg.wait_for_timeout(8000)
        c("G danach spielbar mit Warnung", await scr(fr) == "start" and "nicht verbunden" in await fr.evaluate("$('lvstat').textContent"))
        await b.close()

        print("H Fremde Nachrichten werden ignoriert")
        b, pg, fr, errs = await open_lv(p, {"mode": "student", "initData": saved}); await pg.wait_for_timeout(500)
        await fr.evaluate('''()=>{const f=document.createElement("iframe");f.srcdoc=%s;document.body.appendChild(f)}''' % json.dumps(FAKE))
        await pg.wait_for_timeout(600)
        c("H Lernstand nicht von fremder Quelle überschrieben", await fr.locator(".ktuer.fertig").count() == 2)
        await b.close()

APP_HTML = open(HTML, "rb").read()
async def main():
    which = sys.argv[3] if len(sys.argv) > 3 else "alle"
    if which in ("alle", "1"): await teil1()
    if which in ("alle", "2"): await teil2()
    ck.done()
asyncio.run(main())
