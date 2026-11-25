"""Klicktest der Lesewerkstatt (Prototyp) mit gestuftem Fehlerablauf (APP.errorFlow = "stufen").
Aufruf: python3 tests/test_lesewerkstatt.py <html> <code> [bildordner]
Prüft: Wartezeit nach dem 1. Fehler, Pflicht-Hilfe nach dem 2., Lösung nach dem 3., Sterne, nichts ausgegraut,
Wiederholung am Ende, Wartezeit im Lehrkraft-Bereich, alle Missionen beider Stufen, Lexikon, Tafel, Videos.
"""
import asyncio, sys, os
from playwright.async_api import async_playwright
sys.path.insert(0, os.path.dirname(__file__))
from helpers import Check, screen, enter_pin, wait_unlocked

HTML, CODE = os.path.abspath(sys.argv[1]), sys.argv[2]
SHOTS = sys.argv[3] if len(sys.argv) > 3 else None

async def shot(pg, name):
    if SHOTS:
        os.makedirs(SHOTS, exist_ok=True); await pg.screenshot(path=os.path.join(SHOTS, name + ".png"))

async def wrong(fr, avoid=None):
    a = await fr.evaluate("String(M.tasks[M.i].answer)")
    for bt in await fr.query_selector_all("#answers .ans"):
        v = await bt.get_attribute("data-v")
        if v != a and v != avoid:
            await bt.click(); return v

async def right(fr):
    a = await fr.evaluate("String(M.tasks[M.i].answer)")
    await fr.click('#answers .ans[data-v="%s"]' % a)

async def locked(fr):
    return await fr.evaluate("$('answers').classList.contains('locked')")

async def main():
    c = Check()
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={"width": 1180, "height": 820}, has_touch=True)
        errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
        await pg.goto("file://" + HTML); fr = pg.main_frame
        await pg.wait_for_timeout(500)
        c("Startseite", await screen(fr) == "start")
        await shot(pg, "01_start")

        # Lehrkraft: Wartezeit 5 s -> 8 s -> 3 s, Infotext zum Stufen-Ablauf
        await enter_pin(fr, CODE)
        c("Schalter Wartezeit da", await fr.evaluate("!!$('swWait')"))
        c("Standard 5 s", "5 s" in await fr.inner_text("#swWaitL"))
        await fr.click("#swWait"); await fr.click("#swWait")
        c("Wartezeit auf 3 s gestellt", await fr.evaluate("waitMs()") == 3000, await fr.evaluate("waitMs()"))
        c("Infotext beschreibt Erprobung", "Erprobung" in await fr.evaluate("$('infoBody').textContent") and "3. Fehler" in await fr.evaluate("$('infoBody').textContent"))
        c("Gebärdenvideos-Schalter da", await fr.evaluate("!!$('swVid')"))
        await shot(pg, "02_lehrkraft")
        await fr.click("#closeInfo")

        # Mission „Wort → Bild“: alle drei Fehlerstufen
        await fr.click("[data-l=start]"); await fr.click('[data-m="lesen"]')
        c("Aufgabe offen", await screen(fr) == "task")
        c("Wort groß gezeigt", await fr.evaluate("!!document.querySelector('#show .wortgross')"))
        n0 = await fr.evaluate("M.tasks.length")
        w1 = await wrong(fr)
        c("1. Fehler: gesperrt mit Zeitbalken", await locked(fr) and await fr.evaluate("!!document.querySelector('#fb .wait')"))
        c("1. Fehler: nichts ausgegraut", await fr.evaluate("!document.querySelector('#answers .ans.wrong')"))
        await shot(pg, "03_wartezeit")
        await fr.click('#answers .ans[data-v="%s"]' % (await fr.evaluate("String(M.tasks[M.i].answer)")), force=True)
        c("während der Wartezeit zählt kein Tipp", await fr.evaluate("M.res[M.i] === undefined"))
        await wait_unlocked(fr, 6000)
        c("nach 3 s wieder frei", not await locked(fr))
        await wrong(fr)
        c("2. Fehler: Pflicht-Hilfe (Fingeralphabet-Video)", await locked(fr) and await fr.evaluate("!!document.querySelector('#show .pvid[data-vid^=FA_]')"))
        await shot(pg, "04_hilfe_fingeralphabet")
        await wait_unlocked(fr, 12000)
        await wrong(fr)
        c("3. Fehler: Lösung markiert", await fr.evaluate("!!document.querySelector('#answers .ans.solution')"))
        c("3. Fehler: kommt nochmal", await fr.evaluate("M.tasks.length") == n0 + 1 and await fr.evaluate("M.res[M.i]") == "d")
        await shot(pg, "05_loesung")
        await fr.click("#nextBtn")

        # 2. Aufgabe: 1 Fehler, dann richtig -> Stern
        await wrong(fr); await wait_unlocked(fr, 6000); await right(fr)
        c("richtig im 2. Versuch -> Stern", await fr.evaluate("M.res[M.i]") == "s")
        await fr.click("#nextBtn")
        # 3. Aufgabe: 2 Fehler, Hilfe, dann richtig -> kein Stern
        await wrong(fr); await wait_unlocked(fr, 6000); await wrong(fr); await wait_unlocked(fr, 12000); await right(fr)
        c("richtig nach der Hilfe -> kein Stern", await fr.evaluate("M.res[M.i]") == "h" and await fr.evaluate("M.stars") == 1)
        c("Punkt für 'mit Hilfe' sichtbar", await fr.evaluate("!!document.querySelector('#pdots .dot.h')"))
        await fr.click("#nextBtn")
        while await screen(fr) == "task":
            await wait_unlocked(fr, 12000); await right(fr); await fr.click("#nextBtn")
        c("Mission fertig", await screen(fr) == "done")
        c("Sterne 4 von 6", await fr.evaluate("S.prog.start.lesen.stars") == 4, await fr.evaluate("S.prog.start.lesen"))
        st = await fr.evaluate("S.stats.start")
        c("Statistik: 2 Hilfen, 1 Lösung", st["hint"] == 2 and st["sol"] == 1, st)
        await shot(pg, "06_fertig")
        await fr.click("#doneNext")

        # übrige Missionen ohne Fehler; dann Stufe 1 frei
        for mid in ["zeigen", "finden"]:
            await fr.click('[data-m="%s"]' % mid)
            first = True
            while await screen(fr) == "task":
                if first:
                    await pg.wait_for_timeout(1500); await shot(pg, "07_" + mid)
                    if mid == "zeigen": c("Gebärdenvideo in der Frage", await fr.evaluate("!!document.querySelector('#show .pvid[data-vid] video')"))
                    if mid == "finden":
                        ws = await fr.evaluate("[...document.querySelectorAll('#answers .ans')].map(b=>b.innerText.trim())")
                        c("Wort-Antworten (4)", len(ws) == 4, ws)
                    first = False
                await right(fr); await fr.click("#nextBtn")
            await fr.click("#doneNext")
        c("Stufe 1 frei", await fr.evaluate("unlocked('s1')"))
        await fr.evaluate("S.level='s1';go('map')")
        await fr.click('[data-m="finden"]')
        c("Stufe 1: 8 Aufgaben", await fr.evaluate("M.tasks.length") == 8)
        await fr.click("#taskBack")

        # Lexikon (Extra)
        await fr.click("#map [data-go=start]")
        await fr.click('.extrabtn[data-x="lexikon"]')
        c("Lexikon: 12 Tiere", await fr.evaluate("document.querySelectorAll('.lex button').length") == 12)
        await fr.click('.lex button[data-k="schwein"]')
        c("Lexikon: Gebärdenvideo", await fr.evaluate("!!document.querySelector('.lexdetail .pvid[data-vid=SCHWEIN]')"))
        await fr.click("#lexFa")
        c("Lexikon: Fingeralphabet", await fr.evaluate("!!document.querySelector('.lexdetail .pvid[data-vid=FA_SCHWEIN]')"))
        await pg.wait_for_timeout(800); await shot(pg, "08_lexikon")

        # Tafel
        await fr.evaluate("go('start')")
        await fr.click("#toBoard")
        c("Tafel offen", await screen(fr) == "board")
        await shot(pg, "09_tafel")

        # Schalter Videos aus -> Ersatz (Wort statt Video bei Gebärde → Bild)
        await fr.evaluate("go('start')")
        await enter_pin(fr, CODE); await fr.click("#swVid"); await fr.click("#closeInfo")
        await fr.click("[data-l=start]"); await fr.click('[data-m="zeigen"]')
        c("ohne Videos: Wort als Ersatz", await fr.evaluate("!!document.querySelector('#show .wortgross') && !document.querySelector('#show .pvid')"))
        await fr.click("#taskBack")

        c("keine JS-Fehler", not errs, errs)
        await b.close()
    c.done()

asyncio.run(main())
