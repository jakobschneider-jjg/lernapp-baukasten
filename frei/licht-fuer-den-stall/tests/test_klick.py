"""Klicktest „Ein Licht für den Stall“: alle Stationen auf einer Stufe, mit Fehlern und Tipps."""
import asyncio, sys
from playwright.async_api import async_playwright
URL='file://'+__import__('os').path.abspath(sys.argv[3] if len(sys.argv)>3 else 'dist/Ein-Licht-fuer-den-Stall.html')
STUFE=int(sys.argv[1]) if len(sys.argv)>1 else 2
SHOT=len(sys.argv)>2 and bool(sys.argv[2])
ok=[];bad=[]
def ck(n,c,i=""):
    (ok if c else bad).append(n); print(("  ok   " if c else "  FEHL ")+n, "" if c else i)
async def tap(pg, sel): await pg.dispatch_event(sel,'click')
async def los(pg): await pg.click('[data-k="los"]')
async def zu(pg):
    for k in ('zu','weiter'):
        if await pg.locator('#karte:not([hidden]) [data-k="%s"]'%k).count(): await pg.click('#karte [data-k="%s"]'%k); return k
async def shot(pg,n):
    if SHOT: await pg.screenshot(path='shots/app-s%d-%s.png'%(STUFE,n))
async def lock_set(pg, ziel):
    for i,v in enumerate(ziel):
        for _ in range(12):
            cur=await pg.evaluate("SCHLOSS.raeder[%d].werte[SCHLOSS.wert[%d]].v"%(i,i))
            if str(cur)==str(v): break
            await pg.click('.rad[data-i="%d"] .runter'%i)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':1180,'height':820})
        errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto(URL); await pg.wait_for_selector('body.bereit')
        await tap(pg,'#infoBtn')
        for k in '0815': await pg.click('#pinPad button[data-k="%s"]'%k)
        await pg.click('.stufebtn[data-s="%d"]'%STUFE); await pg.click('#lkZu')
        ck('Karte: 7 Wegpunkte, nur 1 offen', await pg.locator('.wegpunkt').count()==7 and await pg.locator('.wegpunkt.offen').count()==1)
        await shot(pg,'0-karte')
        # 1
        await tap(pg,'.wegpunkt >> nth=0'); await pg.wait_for_selector('#karte:not([hidden])'); await shot(pg,'1-intro'); await los(pg); await pg.wait_for_timeout(300); await shot(pg,'1-szene')
        await tap(pg,'.s-weiser'); await pg.click('#sOk'); await pg.click('#sOk'); await pg.wait_for_timeout(500)
        ck('1 Schloss gesperrt nach 2 Fehlern', await pg.evaluate("ST.gesperrt"))
        await pg.click('#sZu'); await tap(pg,'#hilfe'); await zu(pg); await tap(pg,'#hilfe'); await zu(pg); await pg.wait_for_timeout(700); await shot(pg,'1-tipp2')
        await tap(pg,'.s-weiser'); await lock_set(pg,['rechts','hoch','rechts']); await shot(pg,'1-schloss'); await pg.click('#sOk')
        await pg.wait_for_selector('#karte:not([hidden]) [data-k="weiter"]', timeout=5000); await shot(pg,'1-fertig'); await zu(pg); await pg.wait_for_timeout(300)
        ck('1 geschafft, 2 offen', await pg.evaluate("S.fertig[1]===true") and await pg.locator('.wegpunkt.offen').count()==1)
        # 2
        await tap(pg,'.wegpunkt >> nth=1'); await los(pg); await pg.wait_for_timeout(300); await shot(pg,'2-szene')
        await tap(pg,'.s-zettel'); await shot(pg,'2-zettel'); await zu(pg)
        await tap(pg,'.s-fenster'); await pg.wait_for_timeout(400); await pg.mouse.move(600,600)
        for t in await pg.query_selector_all('.spot.tier'): await t.dispatch_event('click')
        await tap(pg,'.t-maus'); await pg.wait_for_timeout(900); await shot(pg,'2-drinnen')
        ck('2 Zähler', await pg.evaluate("ST.gezaehlt.schaf")==5)
        await tap(pg,'#zurueck'); await pg.wait_for_timeout(300); await tap(pg,'.s-schloss'); await lock_set(pg,[1,1,1,5]); await pg.click('#sOk')
        await pg.wait_for_selector('#karte:not([hidden]) [data-k="weiter"]', timeout=5000); await shot(pg,'2-fertig'); await zu(pg)
        # 3
        await tap(pg,'.wegpunkt >> nth=2'); await los(pg); await pg.wait_for_timeout(300); await shot(pg,'3-szene')
        await tap(pg,'.tierspot.t-pferd'); await shot(pg,'3-pferd'); await zu(pg)
        await tap(pg,'#aktion'); await lock_set(pg,['pferd','kuh','huhn']); await pg.click('#sOk'); await pg.wait_for_timeout(300)
        await lock_set(pg,['pferd','kuh','schaf']); await shot(pg,'3-schloss'); await pg.click('#sOk')
        await pg.wait_for_selector('#karte:not([hidden]) [data-k="weiter"]', timeout=5000); await zu(pg)
        # 4
        await tap(pg,'.wegpunkt >> nth=3'); await los(pg); await pg.wait_for_timeout(300); await shot(pg,'4-szene')
        n=await pg.locator('.sternpunkt').count()
        await tap(pg,'.sternpunkt >> nth=2'); await tap(pg,'.sternpunkt >> nth=3'); await pg.wait_for_timeout(200)
        ck('4 nach 2 Fehlern blinkt Stern 1', await pg.locator('.sternpunkt.blink').count()==1)
        for i in range(n):
            await tap(pg,'.sternpunkt >> nth=%d'%i)
            if i==2: await shot(pg,'4-halb')
        await pg.wait_for_timeout(900); await shot(pg,'4-stern')
        await pg.wait_for_selector('#karte:not([hidden]) [data-k="weiter"]', timeout=5000); await zu(pg)
        # 5
        await tap(pg,'.wegpunkt >> nth=4'); await los(pg); await pg.wait_for_timeout(2600); await shot(pg,'5-szene')
        for g in range(3):
            await pg.wait_for_selector('.wegpfeil', timeout=8000)
            if g==0:
                await tap(pg,'.wegpfeil[data-gut="0"]'); await pg.wait_for_timeout(2600); await shot(pg,'5-sackgasse'); await pg.wait_for_timeout(2500)
                await pg.wait_for_selector('.wegpfeil', timeout=8000)
            await tap(pg,'.wegpfeil[data-gut="1"]'); await pg.wait_for_timeout(2300)
        await pg.wait_for_selector('#karte:not([hidden]) [data-k="weiter"]', timeout=8000); await shot(pg,'5-fertig'); await zu(pg)
        # 6
        await tap(pg,'.wegpunkt >> nth=5'); await los(pg); await pg.wait_for_timeout(300); await pg.mouse.move(400,500); await shot(pg,'6-szene')
        await tap(pg,'.d-eimer'); await pg.wait_for_timeout(300); await shot(pg,'6-nein')
        await tap(pg,'.d-krippe'); await pg.wait_for_timeout(300); await shot(pg,'6-gefunden'); await zu(pg)
        for i in range(3): await tap(pg,'.d-stroh')
        await pg.wait_for_timeout(300); await zu(pg); await tap(pg,'.d-baby'); await pg.wait_for_timeout(1800); await shot(pg,'6-baby')
        await pg.wait_for_selector('#karte:not([hidden]) [data-k="weiter"]', timeout=5000); await zu(pg)
        # 7
        await tap(pg,'.wegpunkt >> nth=6'); await los(pg); await pg.wait_for_timeout(300); await shot(pg,'7-szene')
        await tap(pg,'.s-stern'); await pg.wait_for_timeout(1400); await shot(pg,'7-stern')
        await pg.wait_for_selector('#karte:not([hidden]) [data-k="weiter"]', timeout=5000); await zu(pg); await pg.wait_for_timeout(300); await shot(pg,'8-karte-fertig')
        ck('alle 7 geschafft', await pg.evaluate("anzahlFertig(S)")==7)
        await pg.reload(); await pg.wait_for_selector('body.bereit')
        ck('nach Neuladen gespeichert', await pg.evaluate("anzahlFertig(S)")==7 and await pg.evaluate("S.stufe")==STUFE)
        ck('keine Skriptfehler', not errs, errs[:3])
        await b.close()
    print(len(ok),'ok,',len(bad),'Fehler'); sys.exit(1 if bad else 0)
asyncio.run(main())
