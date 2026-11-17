#!/usr/bin/env python3
"""Baut „Ein Licht für den Stall“ (Escape Room zu „Weihnachten im Stall“) als EINE HTML-Datei.
Aufruf (im Repository-Ordner): python3 frei/licht-fuer-den-stall/bauen.py --code 1234 [--out Datei.html]
Der Lehrkraft-Code steht nur in der gebauten Datei, nie im Repository."""
import argparse, os, re, subprocess, sys, tempfile
H = os.path.dirname(os.path.abspath(__file__)); F = os.path.dirname(H)
ap = argparse.ArgumentParser(); ap.add_argument("--code", required=True); ap.add_argument("--out", default=os.path.join(os.path.dirname(F), "dist", "Ein-Licht-fuer-den-Stall.html")); a = ap.parse_args()
if not re.fullmatch(r"\d{4,8}", a.code): sys.exit("--code: 4–8 Ziffern")
lies = lambda p: open(p, encoding="utf-8").read()
js = '"use strict";\n' + lies(os.path.join(F, "kreide.js")) + "".join(lies(os.path.join(H, "src", f)) for f in ["buehne.js", "szenen.js", "texte.js", "stationen.js", "spiel.js"])
js = js.replace("__TEACH_CODE__", a.code)
with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False) as t: t.write(js)
r = subprocess.run(["node", "--check", t.name], capture_output=True, text=True); os.unlink(t.name)
if r.returncode: sys.exit(r.stderr)
html = lies(os.path.join(H, "src", "vorlage.html")).replace("{{FONT}}", lies(os.path.join(H, "src", "andika.woff2.b64"))).replace("{{ROUGH}}", "/* rough.js – MIT, © Preet Shihn */\n" + lies(os.path.join(F, "rough.js"))).replace("{{JS}}", js)
os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True); open(a.out, "w", encoding="utf-8").write(html); print("Gebaut:", a.out, len(html) // 1024, "KB")
