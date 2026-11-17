import asyncio, json, sys
from playwright.async_api import async_playwright
APP = open(sys.argv[1] if len(sys.argv)>1 else "dist/Ein-Licht-fuer-den-Stall.html","rb").read()
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

ok=[];bad=[]
def ck(n,c,i=""):
    (ok if c else bad).append(n); print(("  ok   " if c else "  FEHL ")+n, "" if c else i)
async def open_lv(p, cfg):
    b = await p.chromium.launch(); ctx = await b.new_context(viewport={"width": 1200, "height": 840})
    await ctx.add_init_script(INIT)
    await ctx.route("https://learningview.org/**", lambda r: r.fulfill(status=200, content_type="text/html", body=PARENT))
    await ctx.route("https://content.test/**", lambda r: r.fulfill(status=200, content_type="text/html", body=APP))
    pg = await ctx.new_page(); errs=[]; pg.on("pageerror", lambda e: errs.append(str(e)))
    await pg.goto("https://learningview.org/mock"); await pg.evaluate("cfg=>setup(cfg)", cfg); await pg.wait_for_timeout(1500)
    fr = [f for f in pg.frames if "content.test" in f.url][0]
    return b, pg, fr, errs
async def station1(fr):
    await fr.dispatch_event('.wegpunkt >> nth=0','click'); await fr.click('[data-k="los"]'); await fr.dispatch_event('.s-weiser','click')
    for i,v in enumerate(['rechts','hoch','rechts']):
        for _ in range(5):
            if await fr.evaluate("SCHLOSS.raeder[%d].werte[SCHLOSS.wert[%d]].v"%(i,i))==v: break
            await fr.click('.rad[data-i="%d"] .runter'%i)
    await fr.click('#sOk'); await fr.wait_for_selector('#karte:not([hidden]) [data-k="weiter"]'); await fr.click('[data-k="weiter"]')
async def main():
    async with async_playwright() as p:
        b,pg,fr,errs = await open_lv(p, {"mode":"student"})
        ck("Schüler: Karte sichtbar", await fr.locator('.wegpunkt').count()==7)
        await station1(fr); await pg.wait_for_timeout(3500)
        st=json.loads(await pg.evaluate("STORE") or "{}")
        ck("gespeichert in LearningView", st.get("fertig",{}).get("1")==True, st)
        ck("Ergebnis gesendet", (await pg.evaluate("SCORES"))[-1:]==[round(1/7,3)], await pg.evaluate("SCORES"))
        ck("Speicherregeln", await pg.evaluate("VIOL")==[], await pg.evaluate("VIOL"))
        ck("keine Namen gespeichert", "name" not in json.dumps(st))
        ck("keine Fehler", not errs, errs); saved=await pg.evaluate("STORE"); await b.close()
        b,pg,fr,errs = await open_lv(p, {"mode":"student","initData":saved})
        ck("neu geladen: Station 1 fertig", await fr.locator('.wegpunkt.fertig').count()==1); await b.close()
        b,pg,fr,errs = await open_lv(p, {"mode":"studentReview","initData":saved})
        ck("Einzelansicht", "1 von 7" in await fr.inner_text('#lvText')); await b.close()
        cls=[{"name":"<b>Mia</b>","surname":"B","data":saved},{"name":"Ali","surname":"A","data":""},{"name":"Lea","surname":"K","data":"{kaputt"}]
        b,pg,fr,errs = await open_lv(p, {"mode":"class","classData":cls}); await pg.wait_for_timeout(1500)
        t=await fr.inner_text('#lvTab')
        ck("Klassenübersicht", "1 von 7" in t and "noch nicht begonnen" in t and "nicht lesbar" in t, t)
        ck("Namen nicht als HTML", await fr.evaluate("!document.querySelector('#lvTab b')")); await b.close()
        b,pg,fr,errs = await open_lv(p, {"mode":"preview"})
        await station1(fr); await pg.wait_for_timeout(3000)
        ck("Vorschau speichert nicht", await pg.evaluate("STORE")==None); await b.close()
    print(len(ok),"ok,",len(bad),"Fehler")
asyncio.run(main())
