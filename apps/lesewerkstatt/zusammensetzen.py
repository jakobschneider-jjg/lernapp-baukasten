#!/usr/bin/env python3
"""Setzt content.js zusammen: frei/rough.js + frei/kreide.js + Wortliste (woerter.csv) + src/bilder.js + src/app.js.
Nach jeder Änderung an der Wortliste oder in src/ ausführen.

Wortliste (CSV, Semikolon, UTF-8, z. B. aus Excel/Numbers): id;wort;artikel;paket;video;anmerkung
  id     Kleinbuchstaben a–z (auch Schlüssel der Zeichnung in src/bilder.js und Name der Videos ID.mp4 / FA_ID.mp4)
  paket  Name des Wortpakets (= Stufe in der App, Reihenfolge wie in der Tabelle)
  video  Dateiname im Wörterbuchpaket (nur für videos_vorbereiten.py)
"""
import csv, json, os, re, sys
H = os.path.dirname(os.path.abspath(__file__)); R = os.path.dirname(os.path.dirname(H))
zeilen = [r for r in csv.DictReader(open(os.path.join(H, "woerter.csv"), encoding="utf-8-sig"), delimiter=";") if r.get("id")]
fehler = [r["id"] for r in zeilen if not re.fullmatch(r"[a-z]+", r["id"])]
if fehler: sys.exit("Fehler: ungültige id in woerter.csv: " + ", ".join(fehler))
bilder = open(os.path.join(H, "src", "bilder.js"), encoding="utf-8").read()
ohne = [r["id"] for r in zeilen if not re.search(r"\b" + r["id"] + r":\s*z\s*=>", bilder)]
if ohne: sys.exit("Fehler: keine Zeichnung in src/bilder.js für: " + ", ".join(ohne))
js = "/* Wortliste aus woerter.csv (automatisch) */\nconst WORTE = [\n" + ",\n".join(
    '  { id: %s, w: %s, art: %s, paket: %s, vid: "%s", vidFa: "FA_%s" }' % (json.dumps(r["id"]), json.dumps(r["wort"], ensure_ascii=False), json.dumps(r["artikel"]),
    json.dumps(r["paket"], ensure_ascii=False), r["id"].upper(), r["id"].upper()) for r in zeilen) + "\n];\n"
teile = [open(os.path.join(R, "frei", n), encoding="utf-8").read() for n in ("rough.js", "kreide.js")] + [js, bilder, open(os.path.join(H, "src", "app.js"), encoding="utf-8").read()]
out = "/* AUTOMATISCH ERZEUGT aus frei/rough.js, frei/kreide.js, woerter.csv, src/bilder.js, src/app.js – nicht von Hand ändern (zusammensetzen.py) */\n" + "\n".join(teile)
open(os.path.join(H, "content.js"), "w", encoding="utf-8").write(out)
pakete = []
for r in zeilen:
    if r["paket"] not in pakete: pakete.append(r["paket"])
print("content.js: %d KB · %d Wörter · Pakete: %s" % (len(out) // 1024, len(zeilen), ", ".join("%s (%d)" % (p, sum(1 for r in zeilen if r["paket"] == p)) for p in pakete)))
