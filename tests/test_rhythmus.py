"""Klicktest Rhythmus-Baukasten (Gerätespeicher). Aufruf: python3 tests/test_rhythmus.py <html> <code> [shotdir]"""
import asyncio, sys, os
from playwright.async_api import async_playwright
sys.path.insert(0, os.path.dirname(__file__))
from helpers import Check, screen, enter_pin

HTML, CODE = os.path.abspath(sys.argv[1]), sys.argv[2]
SHOTS = sys.argv[3] if len(sys.argv) > 3 else os.path.dirname(HTML)
os.makedirs(SHOTS, exist_ok=True)

async def unlocked_answers(fr, ms=12000):
    await fr.wait_for_function("!document.getElementById('answers').classList.contains('locked')", timeout=ms)

async def is_build(fr):
    return await fr.evaluate("!!M.tasks[M.i].build")

async def set_build(fr, target):
    """Bau-Fläche über echte Taps auf target bringen."""
    b = await fr.evaluate("(()=>{const B=M.tasks[M.i].build;return {cycle:B.cycle||null,n:B.n}})()")
    if b["cycle"]:
        cyc = b["cycle"]
        for i, v in enumerate(target):
            for _ in range(len(cyc)):
                cur = await fr.evaluate("M.cur[%d]" % i)
                if cur == v: break
                await fr.click('#bview [data-slot="%d"] >> nth=0' % i)
    else:
        for i in range(b["n"]):
            if await fr.evaluate("M.cur[%d]" % i):
                await fr.click('#bview [data-slot="%d"]' % i)
        for v in target:
            await fr.click('#answers .bp[data-v="%s"]' % v)
    await fr.click("#bCheck")

async def wrong_build(fr):
    ans = await fr.evaluate("M.tasks[M.i].build.answer")
    b = await fr.evaluate("(()=>{const B=M.tasks[M.i].build;return B.cycle||B.palette.map(p=>p.v)})()")
    w = list(ans); alt = [x for x in b if x != w[0]]; w[0] = alt[-1]
    await set_build(fr, w)

async def perform(fr, right=True):
    """Mitspielen: Los antippen, dann im Seiten-Takt die Trommel(n) antippen (PointerEvents zur richtigen Zeit)."""
    await unlocked_answers(fr, 15000)
    await fr.click("#spGo")
    await fr.evaluate("""(right)=>{const t=M.tasks[M.i];t.sp.ev.forEach((e,i)=>{if(!right&&i===0)return;const at=SP.t0+e.t*SP.beat-performance.now()+(right?0:15);
      setTimeout(()=>{const pad=document.querySelector('.pad[data-pad="'+(t.sp.two?e.s:'F')+'"]');pad.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,cancelable:true}));},Math.max(0,at));});}""", right)
    await fr.wait_for_function("SP.running", timeout=5000)
    await fr.wait_for_function("!SP.running", timeout=25000)
    await fr.page.wait_for_timeout(200)

async def answer_task(fr, right=True):
    if await fr.evaluate("!!M.tasks[M.i].custom"):
        await perform(fr, right); return
    if await is_build(fr):
        if right: await set_build(fr, await fr.evaluate("M.tasks[M.i].build.answer"))
        else: await wrong_build(fr)
        return
    a = await fr.evaluate("String(M.tasks[M.i].answer)")
    if right:
        await fr.click('#answers .ans[data-v="%s"]' % a); return
    for bt in await fr.query_selector_all("#answers .ans"):
        if await bt.get_attribute("data-v") != a and "wrong" not in (await bt.get_attribute("class") or ""):
            await bt.click(); return

async def use_hint(fr):
    tps = await fr.query_selector_all("#show .tp")
    if tps and await fr.evaluate("document.getElementById('answers').classList.contains('dim')"):
        for t in tps: await t.click()
    await unlocked_answers(fr)

PLAYED = {}
STICKERS = []
async def play(fr, mid, mode="", shot=None):
    await fr.click('[data-m="%s"]' % mid)
    first = True
    while await screen(fr) == "task":
        if first and shot:
            await fr.page.wait_for_timeout(1300); await fr.page.screenshot(path=os.path.join(SHOTS, shot))
        if first and mode in ("hint", "fail"):
            await answer_task(fr, False)
            await use_hint(fr)
            if mode == "fail":
                await answer_task(fr, False)
                if shot: await fr.page.screenshot(path=os.path.join(SHOTS, "sol_" + shot))
                await fr.click("#nextBtn"); first = False; continue
        first = False
        await unlocked_answers(fr)
        await answer_task(fr, True)
        pb = await fr.query_selector("#fb .playbuilt")
        if pb and not PLAYED.get(mid):
            PLAYED[mid] = True; await pb.click()
            try:
                await fr.wait_for_function("document.querySelectorAll('#bview .now').length>0", timeout=8000); PLAYED["lit"] = PLAYED.get("lit", 0) + 1
            except Exception: pass
            if shot: await fr.page.screenshot(path=os.path.join(SHOTS, "along_" + shot))
        await fr.click("#nextBtn")
    await fr.page.wait_for_timeout(300)
    if await fr.evaluate("!!document.getElementById('stkPick')"):
        STICKERS.append(mid)
        if shot: await fr.page.screenshot(path=os.path.join(SHOTS, "stk_" + shot))
        await fr.click('#stkPick [data-stk="rakete"]'); await fr.page.wait_for_timeout(800)
    await fr.click("#doneNext")

async def code(fr, keys):
    for k in keys:
        await fr.click('#codeKeys .ans[data-k="%s"]' % k)
    await fr.page.wait_for_timeout(1300)

async def main():
    c = Check()
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={"width": 1180, "height": 820}, has_touch=True)
        errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
        await pg.goto("file://" + HTML); fr = pg.main_frame
        await pg.wait_for_timeout(400)
        c("Startseite", await screen(fr) == "start")
        await pg.screenshot(path=os.path.join(SHOTS, "01_start.png"))
        c("Stufe 1 gesperrt", await fr.evaluate("document.querySelector('[data-l=s1]').disabled"))
        c("Extras sichtbar", await fr.evaluate("document.querySelectorAll('#extras .extrabtn').length") == 3)

        await fr.click("[data-l=start]")
        await pg.screenshot(path=os.path.join(SHOTS, "02_map_start.png"))
        await play(fr, "st_puls", "", "03a_puls.png")
        c("Puls: 5 Sterne", await fr.evaluate("S.prog.start.st_puls.stars") == 5)
        c("Puls fehlerfrei -> Sticker gewählt", "st_puls" in STICKERS and await fr.evaluate("S.stk['start|st_puls']") == "rakete")
        await play(fr, "st_spielen", "hint", "03_spielen.png")
        c("Mitspielen mit Fehler -> kein Sticker", "st_spielen" not in STICKERS)
        c("Mitspielen: Hilfe -> 5 Sterne", await fr.evaluate("S.prog.start.st_spielen.stars") == 5, await fr.evaluate("S.prog.start.st_spielen"))
        await play(fr, "st_finden", "hint", "04_finden.png")
        c("Finden: 5 Sterne", await fr.evaluate("S.prog.start.st_finden.stars") == 5)
        await play(fr, "st_bauen", "fail", "05_bauen.png")
        c("Nachbauen: Lösung -> 4 Sterne", await fr.evaluate("S.prog.start.st_bauen.stars") == 4)
        st = await fr.evaluate("S.stats.start")
        c("Statistik Hilfe/Lösung", st["hint"] == 3 and st["sol"] == 1, st)

        await fr.click("#map [data-go=start]")
        c("Stufe 1 wartet auf Code", await fr.evaluate("document.querySelector('[data-l=s1]').classList.contains('codewait')"))
        await pg.screenshot(path=os.path.join(SHOTS, "06_start_codewait.png"))
        await fr.click("[data-l=s1]")
        c("Code-Bildschirm", await screen(fr) == "code")
        await code(fr, ["pauke", "pauke", "pauke"])
        c("falscher Code öffnet nicht", not await fr.evaluate("unlocked('s1')"))
        await code(fr, ["baer", "schlange", "loewe"])
        c("richtiger Code öffnet Stufe 1", await fr.evaluate("unlocked('s1')") and await screen(fr) == "map" and await fr.evaluate("S.level") == "s1")
        for m in ["s1_spielen", "s1_finden", "s1_bauen"]:
            await play(fr, m, "", "07_%s.png" % m if m != "s1_finden" else None)
        c("Stufe 1 voll", await fr.evaluate("totalStars('s1')") == 15)
        c("Ziel-Leiste zeigt Code-Knopf", await fr.evaluate("!!document.getElementById('goCode')"))
        await fr.click("#goCode"); await code(fr, ["schlange", "baer", "pauke"])
        c("Stufe 2 offen", await fr.evaluate("S.level") == "s2" and await screen(fr) == "map")
        await play(fr, "s2_spielen", "fail", "08a_s2_spielen.png")
        await play(fr, "s2_uebersetzen", "hint", "08_uebersetzen.png")
        await play(fr, "s2_finden", "", "09_s2_finden.png")
        await play(fr, "s2_bauen", "fail", "10_s2_bauen.png")
        c("Stufe 2 Sterne", await fr.evaluate("totalStars('s2')") == 18, await fr.evaluate("totalStars('s2')"))
        await fr.click("#goCode"); await code(fr, ["pauke", "loewe", "pauke"])
        c("Stufe 3 offen", await fr.evaluate("S.level") == "s3")
        await play(fr, "s3_spielen", "hint", "11_s3_spielen.png")
        await play(fr, "s3_finden", "hint", "12_s3_finden.png")
        await play(fr, "s3_bauen", "fail", "13_s3_bauen.png")
        c("Krone bei allen Abzeichen", await fr.evaluate("document.getElementById('crown').classList.contains('on')"))
        c("Score 0..1", 0.9 < await fr.evaluate("scoreScaled()") <= 1, await fr.evaluate("scoreScaled()"))
        await pg.screenshot(path=os.path.join(SHOTS, "14_map_s3.png"))

        # Extras
        await fr.click("#map [data-go=start]")
        await fr.click('#extras [data-x="frei"]')
        c("Frei bauen", await screen(fr) == "extra")
        for v in ["b", "l", "s", "b"]:
            await fr.click('#extraBody .bp[data-v="%s"]' % v)
        await fr.click("#freiPlay")
        await pg.wait_for_timeout(1900)
        c("Frei bauen: Lauflicht läuft", await fr.evaluate("document.querySelectorAll('#freiRp .now').length") > 0)
        await pg.screenshot(path=os.path.join(SHOTS, "15_frei_play.png"))
        await pg.wait_for_timeout(8500)
        c("Frei bauen: Jetzt du!", await fr.evaluate("!!document.querySelector('.jetztdu')"))
        await pg.screenshot(path=os.path.join(SHOTS, "16_frei_jetztdu.png"))
        await fr.click("#extra [data-go=start]")
        await fr.click('#extras [data-x="trommeln"]')
        await fr.click('#trKind button[data-v="zwei"]')
        await fr.click("#trPlay")
        try:
            await fr.wait_for_function("document.querySelector('#trRp .countin').classList.contains('on')", timeout=4000); ci = True
        except Exception: ci = False
        c("Trommeln: Einzählen sichtbar", ci)
        await pg.screenshot(path=os.path.join(SHOTS, "17_trommeln_countin.png"))
        await pg.wait_for_timeout(4200)
        await pg.screenshot(path=os.path.join(SHOTS, "18_trommeln_play.png"))
        await fr.click("#trStop")
        await fr.click('#trKind button[data-v="tier"]')
        await fr.click('#trHelp button[data-v="4"]')
        await fr.click("#trPlay")
        await pg.wait_for_timeout(5600)
        c("Hilfe 4: Noten verschwinden", await fr.evaluate("document.getElementById('trNot').classList.contains('gone')"))
        await fr.click("#trStop")
        c("Stopp zeigt Noten wieder", not await fr.evaluate("document.getElementById('trNot').classList.contains('gone')"))
        await fr.click("#extra [data-go=start]")

        # Tafel
        await fr.click("#toBoard")
        for d in await fr.evaluate("Object.keys(APP.board)"):
            await fr.click('#decks .deck[data-d="%s"]' % d)
            await fr.click("#bReveal")
            await pg.screenshot(path=os.path.join(SHOTS, "19_tafel_%s.png" % d))
            c("Tafel " + d, await fr.evaluate("$('bshow').innerHTML.length") > 200)
        await fr.click("#board [data-go=start]")

        # Das kann ich
        await fr.click('#extras [data-x="karte"]')
        n_done = await fr.evaluate("ORDER().reduce((a,l)=>a+levelDef(l).missions.filter(m=>S.prog[l]&&S.prog[l][m]&&S.prog[l][m].done).length,0)")
        c("Karte: Stempel = geschaffte Missionen", await fr.evaluate("document.querySelectorAll('.kc-stamp.on').length") == n_done, n_done)
        c("Karte: Sticker sichtbar", await fr.evaluate("document.querySelectorAll('.kc .stk').length") == len(STICKERS), STICKERS)
        await pg.screenshot(path=os.path.join(SHOTS, "24_karte.png"), full_page=True)
        await fr.click("#extra [data-go=start]")
        # nochmal Puls fehlerfrei -> kein zweiter Sticker
        await fr.click("[data-l=start]"); before = len(STICKERS)
        await play(fr, "st_puls")
        c("Sticker nur einmal pro Mission", len(STICKERS) == before)
        await fr.click("#map [data-go=start]")

        # Lehrkraft: Codes sichtbar, Schiene
        await enter_pin(fr, CODE)
        c("Codes im Lehrkraft-Bereich", await fr.evaluate("document.querySelectorAll('#lockCodes .lcrow').length") == 3)
        await pg.screenshot(path=os.path.join(SHOTS, "20_lehrkraft.png"))
        await fr.click("#swTrack"); await fr.click("#closeInfo")
        c("Schiene: nur ein Knopf + Karte + Frei bauen", await fr.evaluate("document.querySelectorAll('#levels .levelbtn').length") == 1 and await fr.evaluate("document.querySelectorAll('#extras .extrabtn').length") == 2)
        await pg.screenshot(path=os.path.join(SHOTS, "21_schiene_start.png"))
        await fr.click("#levels .levelbtn")
        await play(fr, "ge_spielen", "", "22a_ge_spielen.png")
        await play(fr, "ge_finden", "hint", "22_ge_finden.png")
        await play(fr, "ge_wer", "fail", "23_ge_wer.png")
        c("Schiene Score 0..1", 0.8 <= await fr.evaluate("scoreScaled()") <= 1)
        c("Spiel mit! nach Nachbauen: Lauflicht", PLAYED.get("lit", 0) > 0, PLAYED)
        c("keine JS-Fehler", not errs, errs)
        await b.close()
    c.done()

asyncio.run(main())
