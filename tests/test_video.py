"""Test des Bausteins Gebärdenvideo (core/video.js) an der Beispiel-App.
Aufruf: python3 tests/test_video.py dist/test_video.html 0000
(gebaut mit --videos <Ordner mit FRAGE_ECKEN.mp4>; run_all.sh erzeugt dafür ein Testbild-Video mit ffmpeg)
"""
import asyncio, sys, os
from playwright.async_api import async_playwright
sys.path.insert(0, os.path.dirname(__file__))
from helpers import Check, screen, enter_pin

HTML, CODE = os.path.abspath(sys.argv[1]), sys.argv[2]

async def main():
    c = Check()
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={"width": 1180, "height": 820}, has_touch=True)
        errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        await pg.goto("file://" + HTML); await pg.wait_for_timeout(300)
        c("Videos eingebettet", await pg.evaluate("hasVideos()"))
        await enter_pin(pg.main_frame, CODE)
        c("Schalter Gebärdenvideos an", await pg.evaluate("$('swVid').classList.contains('on')"))
        await pg.click("#closeInfo")
        await pg.click("[data-l=start]"); await pg.click('[data-m="ecken"]'); await pg.wait_for_timeout(1200)
        v = await pg.evaluate("(()=>{const v=document.querySelector('#prompt .pvid video');return v?{rs:v.readyState,p:v.paused,t:v.currentTime,m:v.muted}:null})()")
        c("Video in der Frage läuft stumm", bool(v) and v["rs"] >= 2 and not v["p"] and v["t"] > 0 and v["m"], v)
        await pg.click("#prompt .pvid")
        c("großes Fenster", await pg.is_visible("#vfl"))
        r = await pg.evaluate("(()=>{const r=$('vfl').getBoundingClientRect();return [r.left,r.top,r.right,r.bottom]})()")
        c("Fenster im Bild", r[0] >= 0 and r[1] >= 0 and r[2] <= 1180 and r[3] <= 820, r)
        c("Video im Fenster läuft weiter", await pg.evaluate("!document.querySelector('#vflSt video').paused"))
        await pg.click("#vflSlow"); c("Langsam", await pg.evaluate("document.querySelector('#vflSt video').playbackRate") == 0.5)
        await pg.click("#vflPlay"); c("Pause", await pg.evaluate("document.querySelector('#vflSt video').paused"))
        await pg.click("#vflPlay")
        w = await pg.evaluate("$('vfl').offsetWidth"); await pg.click("#vflLarge"); c("größer", await pg.evaluate("$('vfl').offsetWidth") > w)
        await pg.click("#vflSmall"); await pg.click("#vflSmall")
        g = await pg.evaluate("(()=>{const r=document.querySelector('#vfl .grip').getBoundingClientRect();return [r.left+20,r.top+r.height/2]})()")
        f0 = await pg.evaluate("(()=>{const r=$('vfl').getBoundingClientRect();return [r.left,r.top]})()")
        await pg.mouse.move(*g); await pg.mouse.down(); await pg.mouse.move(g[0] - f0[0] + 10, g[1] - f0[1] + 10, steps=6); await pg.mouse.up()
        c("verschiebbar", await pg.evaluate("$('vfl').getBoundingClientRect().left") < f0[0] - 50)
        a = await pg.evaluate("String(M.tasks[M.i].answer)")
        await pg.click('#answers .ans[data-v="%s"]' % a); await pg.click("#nextBtn"); await pg.wait_for_timeout(300)
        c("nächste Aufgabe: Fenster bleibt mit Video", await pg.is_visible("#vfl") and await pg.evaluate("!!document.querySelector('#vflSt video')"))
        await pg.click("#vflClose")
        c("zurück ins kleine Feld", not await pg.is_visible("#vfl") and await pg.evaluate("!!document.querySelector('#prompt .pvid video')"))
        await pg.click("#prompt .pvid"); await pg.evaluate("$('taskBack').click()")
        c("Verlassen schließt Fenster", not await pg.is_visible("#vfl"))
        await pg.click("#map [data-go=start]")
        await enter_pin(pg.main_frame, CODE); await pg.click("#swVid"); await pg.click("#closeInfo")
        c("Schalter aus gespeichert", await pg.evaluate("S.vidOff===true"))
        await pg.click("[data-l=start]"); await pg.click('[data-m="ecken"]'); await pg.wait_for_timeout(200)
        c("aus: Ersatz statt Video", not await pg.query_selector("#prompt .pvid") and await pg.query_selector("#prompt .signph") is not None)
        await pg.evaluate("$('taskBack').click()"); await pg.click("#map [data-go=start]")
        await enter_pin(pg.main_frame, CODE); await pg.click("#resetAll"); await pg.click("#resetYes")
        c("Löschen behält Video-Einstellung", await pg.evaluate("S.vidOff===true"))
        c("Quellenangabe im Fuß", "Gebärdenvideos" in await pg.inner_text("#ki"))
        c("keine JS-Fehler", not errs, errs)
        await b.close()
    c.done()

asyncio.run(main())
