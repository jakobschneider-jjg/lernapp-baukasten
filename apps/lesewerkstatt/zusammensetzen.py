#!/usr/bin/env python3
"""Setzt content.js aus rough.js, kreide.js (frei/) und src/ zusammen. Nach jeder Änderung in src/ ausführen."""
import os
H = os.path.dirname(os.path.abspath(__file__)); R = os.path.dirname(os.path.dirname(H))
teile = [os.path.join(R, "frei", "rough.js"), os.path.join(R, "frei", "kreide.js"), os.path.join(H, "src", "tiere.js"), os.path.join(H, "src", "app.js")]
out = "/* AUTOMATISCH ERZEUGT aus frei/rough.js, frei/kreide.js, src/tiere.js, src/app.js – nicht von Hand ändern (zusammensetzen.py) */\n"
out += "\n".join(open(p, encoding="utf-8").read() for p in teile)
open(os.path.join(H, "content.js"), "w", encoding="utf-8").write(out)
print("content.js:", len(out) // 1024, "KB")
