"""Klicktest „Weihnachten im Stall“, Teil 3: Stufe selbst wählen, Licht-Abenteuer an den Freitags-Türen.
Aufruf: python3 tests/test_weihnachten_licht.py <html> <code> [stufe]"""
import asyncio, sys, os
from playwright.async_api import async_playwright
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from helpers import Check
HTML, CODE = os.path.abspath(sys.argv[1]), sys.argv[2]
STUFE = int(sys.argv[3]) if len(sys.argv) > 3 else 3
SHOTS = os.path.join(os.path.dirname(HTML), "shots_licht"); os.makedirs(SHOTS, exist_ok=True)
ck = Check()
async def scr(pg): return await pg.evaluate("document.querySelector('.screen.on').id")
async def shot(pg, n): await pg.screenshot(path=os.path.join(SHOTS, "s%d-%s.png" % (STUFE, n)))
async def teacher(pg, stufe=None, alle=None, fest=None):
    await pg.click('#infoBtn')
    for k in CODE: await pg.click('#pinPad button[data-k="%s"]' % k)
    await pg.wait_for_selector('#teachOpen:not([hidden])')
    if alle is not None and await pg.evaluate("S.unlockAll===true") != alle: await pg.click('#swAll')
    if stufe: await pg.click('.stufebtn[data-l="s%d"]' % stufe)
    if fest is not None and await pg.evaluate("!!S.stufeFest") != fest: await pg.click('#swFest')
    await pg.click('#closeInfo')
# ---- Escape-Rahmen ----
async def tap(f, sel): await f.dispatch_event(sel, 'click')
async def los(f): await f.click('[data-k="los"]')
async def zu(f):
    for k in ('zu', 'weiter'):
        if await f.locator('#karte:not([hidden]) [data-k="%s"]' % k).count(): await f.click('#karte [data-k="%s"]' % k); return k
async def lock_set(f, ziel):
    for i, v in enumerate(ziel):
        for _ in range(12):
            if str(await f.evaluate("SCHLOSS.raeder[%d].werte[SCHLOSS.wert[%d]].v" % (i, i))) == str(v): break
            await f.click('.rad[data-i="%d"] .runter' % i)
async def aufgaben(pg):
    while await scr(pg) == 'task':
        if await pg.evaluate("!!M.tasks[M.i].build"):
            for v in await pg.evaluate("M.tasks[M.i].build.answer"): await pg.click('.bpal .ans[data-v="%s"]' % v)
            await pg.click('#bCheck')
        else: await pg.click('#answers .ans[data-v="%s"]' % await pg.evaluate("String(M.tasks[M.i].answer)"))
        await pg.click('#nextBtn')
    await pg.click('#doneNext'); await pg.wait_for_timeout(150)
async def rahmen(pg):
    await pg.wait_for_selector('#escRahmen')
    f = await (await pg.query_selector('#escRahmen')).content_frame()
    await f.wait_for_selector('body.bereit', timeout=15000); await pg.wait_for_timeout(300); return f
async def tuer_ende(pg, f, n, geuebt=False):
    await f.wait_for_selector('#karte:not([hidden]) [data-k="kal"]', timeout=8000)
    ck('Tür %d: Abschlusskarte „Abenteuer geschafft“' % n, 'Abenteuer geschafft' in await f.inner_text('#karte'))
    await shot(pg, 't%d-ende' % n)
    await f.click('#karte [data-k="kal"]'); await pg.wait_for_timeout(500)
    if not geuebt:
        ck('Tür %d: danach direkt Üben (Pflicht), Tür noch nicht fertig' % n, await scr(pg) == 'task' and not await pg.evaluate("fertig(%d)" % n))
        await aufgaben(pg)
    ck('Tür %d: zurück im Kalender, Tür fertig' % n, await scr(pg) == 'start' and await pg.locator('#escRahmen').count() == 0 and await pg.locator('.ktuer.fertig[data-n="%d"]' % n).count() == 1)
async def oeffne(pg, n):
    await pg.click('.ktuer[data-n="%d"]' % n); await pg.click('#btnLicht'); return await rahmen(pg)

async def stufenwahl(b):
    pg = await b.new_page(viewport={'width': 1180, 'height': 820}); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    await pg.clock.install(time='2026-12-10T09:00:00'); await pg.goto('file://' + HTML); await pg.wait_for_timeout(400)
    ck('Erststart: Stufenwahl mit 4 Stufen und Probezeilen', await pg.locator('#stufeWahl .wahl').count() == 4 and await pg.locator('#stufeWahl .probe').count() == 3 and await pg.locator('#wahlZu').count() == 0)
    await shot(pg, 'wahl')
    await pg.click('.wahl[data-l="s1"]'); await pg.wait_for_timeout(200)
    ck('gewählt: Stufe 1, Wahl zu', await pg.evaluate("S.level") == 's1' and await pg.locator('#stufeWahl').count() == 0 and 'Stufe 1' in await pg.inner_text('#stufeChip'))
    await pg.click('#stufeChip'); ck('Wechseln: Wahl mit Schließen-Knopf, Stufe 1 markiert', await pg.locator('#wahlZu').count() == 1 and await pg.locator('.wahl.on[data-l="s1"]').count() == 1)
    await pg.click('#wahlZu'); ck('Schließen ändert nichts', await pg.evaluate("S.level") == 's1')
    # sanfter Vorschlag nach 3 fehlerfreien Türen
    for d in (1, 2, 3):
        await pg.click('.ktuer[data-n="%d"]' % d); await pg.click('#btnAufg')
        await aufgaben(pg)
        if await pg.locator('#stufeWahl').count() == 0: await pg.wait_for_timeout(1900)
    ck('nach 3 fehlerfreien Türen: Vorschlag Stufe 2', await pg.locator('#stufeWahl [data-v="ja"]').count() == 1 and 'Stufe 2' in await pg.inner_text('#stufeWahl'))
    await shot(pg, 'vorschlag')
    await pg.click('#stufeWahl [data-v="nein"]'); ck('„Ich bleibe“: Stufe bleibt 1', await pg.evaluate("S.level") == 's1')
    await pg.goto('file://' + HTML); await pg.wait_for_timeout(2200); ck('Vorschlag kommt nur einmal', await pg.locator('#stufeWahl').count() == 0)
    # Lehrkraft legt fest
    await teacher(pg, stufe=3, fest=True)
    ck('festgelegt: Stufe 3 mit Schloss', await pg.evaluate("S.level") == 's3' and await pg.locator('#stufeChip .fest').count() == 1)
    await pg.click('#stufeChip'); ck('Kind kann festgelegte Stufe nicht wechseln', await pg.locator('#stufeWahl').count() == 0 and 'Lehrkraft' in await pg.inner_text('#note'))
    await teacher(pg, fest=False); await pg.click('#stufeChip'); await pg.click('.wahl[data-l="s4"]')
    ck('wieder frei: Kind wählt Stufe 4', await pg.evaluate("S.level") == 's4')
    await teacher(pg, fest=True); await pg.click('#infoBtn')
    for k in CODE: await pg.click('#pinPad button[data-k="%s"]' % k)
    await pg.click('#resetAll'); await pg.click('#resetYes'); await pg.click('#closeInfo')
    ck('Löschen behält Stufe und Festlegung', await pg.evaluate("S.level") == 's4' and await pg.evaluate("S.stufeFest") is True)
    ck('keine Skriptfehler (Stufenwahl)', not errs, errs[:3])
    await pg.close()

async def licht(b):
    # 4.12.: nur Tür 4 offen (von den Freitags-Türen)
    pg = await b.new_page(viewport={'width': 1180, 'height': 820}); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    await pg.clock.install(time='2026-12-04T09:00:00'); await pg.goto('file://' + HTML); await pg.wait_for_timeout(300)
    await pg.click('.wahl[data-l="s%d"]' % STUFE)
    await pg.click('.ktuer[data-n="4"]'); await shot(pg, 't4-seite')
    ck('Tür 4: Knopf Licht-Abenteuer + Üben', await pg.locator('#btnLicht').count() == 1 and 'Üben' in await pg.inner_text('#btnAufg'))
    await pg.click('#btnLicht'); f = await rahmen(pg); await shot(pg, 'karte')
    ck('Karte: 7 Wegpunkte, nur Station 1 offen', await f.locator('.wegpunkt').count() == 7 and await f.locator('.wegpunkt.offen').count() == 1 and await f.locator('.wegpunkt.neu').count() == 1)
    ck('Stufe kommt aus dem Kalender', await f.evaluate("S.stufe") == STUFE)
    await tap(f, '.wegpunkt >> nth=2'); await pg.wait_for_timeout(200)
    ck('Station 3 am 4.12. zu (kommt mit Tür 9)', STUFE == 1 or 'Tür 9' in await f.inner_text('#hinweis'))
    await tap(f, '#infoBtn'); await pg.wait_for_timeout(300)
    ck('„◀ Kalender“ schließt ohne Änderung', await pg.locator('#escRahmen').count() == 0 and await scr(pg) == 'door')
    await pg.close()

    pg = await b.new_page(viewport={'width': 1180, 'height': 820}); pg.on('pageerror', lambda e: errs.append(str(e)))
    await pg.clock.install(time='2026-12-22T09:00:00'); await pg.goto('file://' + HTML); await pg.wait_for_timeout(300)
    await pg.click('.wahl[data-l="s%d"]' % STUFE)
    # Tür 4: Station 1 (mit 2 Fehlern, Sperre, Tipps) + Station 2
    f = await oeffne(pg, 4)
    await tap(f, '.wegpunkt >> nth=0'); await los(f); await pg.wait_for_timeout(300)
    await tap(f, '.s-weiser'); await f.click('#sOk'); await f.click('#sOk'); await pg.wait_for_timeout(400)
    ck('Station 1: nach 2 Fehlern gesperrt', await f.evaluate("ST.gesperrt"))
    await f.click('#sZu'); await tap(f, '#hilfe'); await zu(f); await tap(f, '#hilfe'); await zu(f); await pg.wait_for_timeout(600)
    await tap(f, '.s-weiser'); await lock_set(f, ['rechts', 'hoch', 'rechts']); await f.click('#sOk')
    await f.wait_for_selector('#karte:not([hidden]) [data-k="weiter"]', timeout=5000); await zu(f); await pg.wait_for_timeout(300)
    ck('Station 1 im Kalender gespeichert (+ Fehler, Tipps)', await pg.evaluate("S.esc.f[1]===1 && S.esc.fehl[1]>=2 && S.esc.tipp[1]>=2"), await pg.evaluate("JSON.stringify(S.esc)"))
    ck('Tür 4 noch nicht fertig (Station 2 fehlt)', not await pg.evaluate("fertig(4)"))
    ck('nach Station 1: Karte, Station 2 leuchtet', await pg.locator('#escRahmen').count() == 1 and await f.locator('.wegpunkt.neu').count() == 1 and await f.evaluate("document.querySelector('.wegpunkt.neu').innerText.includes('2')"))
    await tap(f, '.wegpunkt >> nth=1'); await los(f); await pg.wait_for_timeout(300)
    await tap(f, '.s-zettel'); await zu(f)
    await tap(f, '.s-fenster'); await pg.wait_for_timeout(400); await pg.mouse.move(600, 600)
    for t in await f.query_selector_all('.spot.tier'): await t.dispatch_event('click')
    await tap(f, '.t-maus'); await pg.wait_for_timeout(900)
    await tap(f, '#zurueck'); await pg.wait_for_timeout(300); await tap(f, '.s-schloss'); await lock_set(f, [1, 1, 1, 5]); await f.click('#sOk')
    await f.wait_for_selector('#karte:not([hidden]) [data-k="weiter"]', timeout=5000); await f.click('#karte [data-k="weiter"]')
    await tuer_ende(pg, f, 4)
    # Tür 9: erst Üben, dann Abenteuer
    await pg.click('.ktuer[data-n="9"]'); await pg.click('#btnAufg'); await aufgaben(pg)
    ck('Tür 9: nach Üben zurück auf der Tür-Seite, Abenteuer-Knopf leuchtet', await scr(pg) == 'door' and await pg.locator('#btnLicht.pulsiert').count() == 1 and not await pg.evaluate("fertig(9)"))
    await pg.click('#btnLicht'); f = await rahmen(pg)
    ck('Tür 9: Station 3 ist die neue', await f.locator('.wegpunkt.neu').count() == 1 and await f.locator('.wegpunkt.fertig').count() == 2)
    await tap(f, '.wegpunkt >> nth=2'); await los(f); await pg.wait_for_timeout(300)
    await tap(f, '.tierspot.t-pferd'); await zu(f)
    await tap(f, '#aktion'); await lock_set(f, ['pferd', 'kuh', 'schaf']); await f.click('#sOk')
    await f.wait_for_selector('#karte:not([hidden]) [data-k="weiter"]', timeout=5000); await f.click('#karte [data-k="weiter"]')
    await tuer_ende(pg, f, 9, geuebt=True)
    # Tür 14: Station 4 + 5
    f = await oeffne(pg, 14)
    await tap(f, '.wegpunkt >> nth=3'); await los(f); await pg.wait_for_timeout(300)
    for i in range(await f.locator('.sternpunkt').count()): await tap(f, '.sternpunkt >> nth=%d' % i)
    await f.wait_for_selector('#karte:not([hidden]) [data-k="weiter"]', timeout=5000); await zu(f)
    await tap(f, '.wegpunkt >> nth=4'); await los(f); await pg.wait_for_timeout(2600)
    for g in range(3):
        await f.wait_for_selector('.wegpfeil', timeout=8000); await tap(f, '.wegpfeil[data-gut="1"]'); await pg.wait_for_timeout(2300)
    await f.wait_for_selector('#karte:not([hidden]) [data-k="weiter"]', timeout=8000); await f.click('#karte [data-k="weiter"]')
    # Tür 14: nach dem Abenteuer „Karte“ und dann „◀ Kalender“ → Tür-Seite (nicht ins Üben), Üben leuchtet
    await f.wait_for_selector('#karte:not([hidden]) [data-k="zu"]', timeout=8000); await f.click('#karte [data-k="zu"]'); await pg.wait_for_timeout(300)
    await tap(f, '#infoBtn'); await pg.wait_for_timeout(400)
    ck('Tür 14: „◀ Kalender“ führt zur Tür-Seite, Üben leuchtet', await scr(pg) == 'door' and await pg.locator('#btnAufg.pulsiert').count() == 1 and not await pg.evaluate("fertig(14)"))
    await pg.click('#btnAufg'); await aufgaben(pg)
    ck('Tür 14: nach dem Üben fertig', await scr(pg) == 'start' and await pg.locator('.ktuer.fertig[data-n="14"]').count() == 1)
    # Tür 16: Station 6 + Finale
    f = await oeffne(pg, 16)
    await tap(f, '.wegpunkt >> nth=5'); await los(f); await pg.wait_for_timeout(300); await pg.mouse.move(400, 500)
    await tap(f, '.d-krippe'); await pg.wait_for_timeout(300); await zu(f)
    for i in range(3): await tap(f, '.d-stroh')
    await pg.wait_for_timeout(300); await zu(f); await tap(f, '.d-baby'); await pg.wait_for_timeout(1800)
    await f.wait_for_selector('#karte:not([hidden]) [data-k="weiter"]', timeout=5000); await zu(f)
    await tap(f, '.wegpunkt >> nth=6'); await los(f); await pg.wait_for_timeout(300)
    await tap(f, '.s-stern'); await pg.wait_for_timeout(1400)
    await f.wait_for_selector('#karte:not([hidden]) [data-k="weiter"]', timeout=5000); await f.click('#karte [data-k="weiter"]')
    await tuer_ende(pg, f, 16)
    ck('alle 7 Stationen gespeichert, 4 Türen fertig', await pg.evaluate("escAnzahl(S)") == 7 and await pg.evaluate("anzahlFertig(S)") == 4)
    ck('Stand-Text mit Licht-Abenteuer', '7/7' in await pg.evaluate("APP.reached(S)"))
    await pg.reload(); await pg.wait_for_timeout(400)
    ck('nach Neuladen: 4 Türen fertig', await pg.locator('.ktuer.fertig').count() == 4)
    await shot(pg, 'kalender-ende')
    ck('keine Skriptfehler (Licht-Abenteuer)', not errs, errs[:3])
    await pg.close()

async def vorlesen(b):
    pg = await b.new_page(viewport={'width': 1180, 'height': 820}); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    await pg.add_init_script("""(()=>{window.GESAGT=[];const S=window.speechSynthesis;
      S.speak=u=>{GESAGT.push(u.text);setTimeout(()=>u.onend&&u.onend(),50)};S.cancel=()=>{};S.getVoices=()=>[]})()""")
    await pg.clock.install(time='2026-12-10T09:00:00'); await pg.goto('file://' + HTML); await pg.wait_for_timeout(300)
    await pg.click('.wahl[data-l="s%d"]' % STUFE); await pg.click('.ktuer[data-n="2"]')
    await pg.click('#btnTon'); await pg.wait_for_timeout(60)
    ck('Vorlesen: erster Satz leuchtet', await pg.locator('#tuerBody .liest').count() == 1)
    await pg.wait_for_timeout(2500)
    n = await pg.locator('#tuerBody .lesetext > span, #tuerBody .tuertext .wchips:not(.klein) .chip1').count()
    ck('Vorlesen: ganzer Text der Stufe gesprochen (%d Teile)' % n, len(await pg.evaluate("GESAGT")) == n and n > 0, await pg.evaluate("GESAGT"))
    await pg.click('#tuerBody .tippbar >> nth=1'); await pg.wait_for_timeout(100)
    ck('Antippen liest einzelnen Satz/Wort', len(await pg.evaluate("GESAGT")) == n + 1)
    await pg.click('#btnAufg'); await pg.wait_for_timeout(200)
    k = await pg.locator('#task .sprich').count()
    ck('Aufgabe: Lautsprecher nur an der Frage (höchstens 1)', k <= 1 and await pg.locator('#answers .sprich').count() == 0)
    if k: await pg.click('#task .sprich'); await pg.wait_for_timeout(150); ck('Frage wird vorgelesen', len(await pg.evaluate("GESAGT")) == n + 2)
    ck('keine Skriptfehler (Vorlesen)', not errs, errs[:3])
    await pg.close()

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        await vorlesen(b); await stufenwahl(b); await licht(b)
        await b.close()
    ck.done()
asyncio.run(main())
