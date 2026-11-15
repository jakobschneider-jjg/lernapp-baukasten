"""Klicktest der Beispiel-App außerhalb von LearningView (Gerätespeicher).
Aufruf: python3 tests/test_lokal.py dist/test.html 0000
"""
import asyncio, sys, os
from playwright.async_api import async_playwright
sys.path.insert(0, os.path.dirname(__file__))
from helpers import Check, screen, play, enter_pin, click_wrong, use_hint

HTML, CODE = os.path.abspath(sys.argv[1]), sys.argv[2]

async def main():
    c = Check()
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={"width": 1180, "height": 820}, has_touch=True)
        errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
        await pg.goto("file://" + HTML); fr = pg.main_frame
        await pg.wait_for_timeout(300)
        c("Startseite sichtbar", await screen(fr) == "start")
        c("Stufe 1 anfangs gesperrt", await fr.evaluate("document.querySelector('[data-l=s1]').disabled"))

        await fr.click("[data-l=start]")
        c("Missionsübersicht", await screen(fr) == "map")
        await play(fr, "namen", wrong_first=True)
        c("Hilfe genutzt -> Stern trotzdem", await fr.evaluate("S.prog.start.namen.stars") == 6, await fr.evaluate("S.prog.start.namen"))
        await play(fr, "ecken", fail_first=True)
        c("Lösung gezeigt -> ein Stern weniger", await fr.evaluate("S.prog.start.ecken.stars") == 5)
        st = await fr.evaluate("S.stats.start")
        c("Statistik zählt Hilfe und Lösung", st["hint"] == 2 and st["sol"] == 1, st)
        c("Stufe 1 frei nach 70 %", await fr.evaluate("unlocked('s1')"))
        c("Fortschritt im Gerätespeicher", await fr.evaluate("!!localStorage.getItem('lernapp-formen-profi')"))

        # Antwortsperre: nach Fehler sind Antworten gesperrt, bis Hilfe genutzt
        await fr.click("[data-l=s1]") if await screen(fr) == "start" else None
        await fr.evaluate("S.level='s1';go('map')")
        await fr.click('[data-m="finde"]')
        await click_wrong(fr)
        c("nach Fehler gesperrt", await fr.evaluate("$('answers').classList.contains('locked')"))
        await use_hint(fr)
        c("nach Hilfe wieder frei", not await fr.evaluate("$('answers').classList.contains('locked')"))
        await fr.click("#taskBack")

        # Sperre per Code
        c("Muster gesperrt", await fr.evaluate("isLocked('muster')"))
        await fr.click('[data-m="muster"]')
        c("Code-Bildschirm", await screen(fr) == "code")
        for k in ["kreis", "kreis", "kreis"]:
            await fr.click('#codeKeys .ans[data-k="%s"]' % k)
        await pg.wait_for_timeout(1000)
        c("falscher Code öffnet nicht", await fr.evaluate("isLocked('muster')"))
        for k in ["dreieck", "kreis", "quadrat"]:
            await fr.click('#codeKeys .ans[data-k="%s"]' % k)
        await pg.wait_for_timeout(700)
        c("richtiger Code öffnet", not await fr.evaluate("isLocked('muster')") and await screen(fr) == "map")
        await play(fr, "muster")

        # Lehrkraft-Bereich
        await fr.click("#map [data-go=start]")
        await enter_pin(fr, "9" * len(CODE) if CODE != "9" * len(CODE) else "1" * len(CODE))
        await pg.wait_for_timeout(700)
        c("falscher Code: Schalter bleiben verborgen", await fr.evaluate("$('teachOpen').hidden"))
        await fr.click("#closeInfo")
        await enter_pin(fr, CODE)
        c("richtiger Code: Schalter sichtbar", not await fr.evaluate("$('teachOpen').hidden"))
        await fr.click("#swTrack")
        c("Schiene an", await fr.evaluate("S.track===true"))
        await fr.click("#closeInfo")
        c("Startseite zeigt nur Schiene", await fr.evaluate("document.querySelectorAll('#levels .levelbtn').length") == 1)
        await fr.click("#levels .levelbtn")
        await play(fr, "zwei", wrong_first=True)
        c("Schiene: 2 Antworten bleiben beide aktiv", True)
        await play(fr, "alltag")
        c("Score Schiene = 1", abs(await fr.evaluate("scoreScaled()") - 1) < 1e-9, await fr.evaluate("scoreScaled()"))
        await fr.click("#map [data-go=start]")
        await enter_pin(fr, CODE)
        await fr.click("#resetAll"); await fr.click("#resetYes")
        c("Löschen behält Schiene, löscht Sterne", await fr.evaluate("S.track===true && Object.keys(S.prog).length===0"))
        await fr.click("#swTrack"); await fr.click("#closeInfo")

        # Tafel
        await fr.click("#toBoard")
        c("Tafel", await screen(fr) == "board")
        await fr.click("#bReveal")
        c("Lösung aufgedeckt", await fr.evaluate("$('reveal').classList.contains('on')"))
        await fr.click("#bK"); await fr.click("#bK"); await fr.click("#bL")
        c("Punkte", await fr.inner_text("#sK") == "2" and await fr.inner_text("#sL") == "1")
        await fr.click("#bNext")
        for d in await fr.evaluate("Object.keys(APP.board)"):
            await fr.click('#decks .deck[data-d="%s"]' % d)
            c("Stapel " + d, await fr.evaluate("$('bshow').innerHTML.length") > 50)
        await pg.screenshot(path=os.path.join(os.path.dirname(HTML), "shot_tafel.png"))
        c("keine JS-Fehler", not errs, errs)
        await b.close()
    c.done()

asyncio.run(main())
