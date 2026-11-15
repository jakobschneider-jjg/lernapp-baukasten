"""Gemeinsame Test-Helfer (Playwright, Chromium). Klickt wie ein Kind: echte Taps auf Knöpfe."""
import json

class Fail(Exception):
    pass

class Check:
    def __init__(self):
        self.ok, self.bad = 0, []
    def __call__(self, name, cond, info=""):
        if cond:
            self.ok += 1; print("  ok  ", name)
        else:
            self.bad.append(name); print("  FEHL", name, info)
    def done(self):
        print("\n%d Prüfungen bestanden, %d fehlgeschlagen" % (self.ok, len(self.bad)))
        if self.bad:
            for b in self.bad: print("   -", b)
            raise SystemExit(1)

async def screen(fr):
    return await fr.evaluate("document.querySelector('.screen.on').id")

async def wait_unlocked(fr, ms=6000):
    await fr.wait_for_function("!document.getElementById('answers').classList.contains('locked')", timeout=ms)

async def use_hint(fr):
    """Nach einem Fehler: Zählhilfe (alle .tp antippen) oder Wartehilfe abwarten."""
    tps = await fr.query_selector_all("#show .tp")
    if tps and await fr.evaluate("document.getElementById('answers').classList.contains('dim')"):
        for t in tps:
            await t.click()
    await wait_unlocked(fr)

async def click_wrong(fr):
    a = await fr.evaluate("String(M.tasks[M.i].answer)")
    for bt in await fr.query_selector_all("#answers .ans"):
        if await bt.get_attribute("data-v") != a and "wrong" not in (await bt.get_attribute("class") or ""):
            await bt.click(); return True
    return False

async def play(fr, mid, wrong_first=False, fail_first=False):
    """Mission durchspielen. wrong_first: 1. Aufgabe erst falsch, Hilfe nutzen, dann richtig.
    fail_first: 1. Aufgabe zweimal falsch -> Lösung, Aufgabe kommt am Ende wieder."""
    await fr.click('[data-m="%s"]' % mid)
    first = True
    while await screen(fr) == "task":
        a = await fr.evaluate("String(M.tasks[M.i].answer)")
        if first and (wrong_first or fail_first):
            await click_wrong(fr)
            await use_hint(fr)
            if fail_first:
                await click_wrong(fr)
                await fr.click("#nextBtn"); first = False; continue
        first = False
        await wait_unlocked(fr)
        await fr.click('#answers .ans[data-v="%s"]' % a)
        await fr.click("#nextBtn")
    await fr.click("#doneNext")

async def enter_pin(fr, code):
    await fr.click("#infoBtn")
    for k in code:
        await fr.click('#pinPad button[data-k="%s"]' % k)
    await fr.wait_for_timeout(350)
