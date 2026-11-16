#!/usr/bin/env python3
"""Baut aus core/ + apps/<name>/ EINE eigenständige HTML-Datei (offline, für LearningView/iPad).

Aufruf:
  python3 tools/build.py apps/beispiel-formen --code 0000
  python3 tools/build.py apps/<name> --code 1234 --signs ~/Gebaerden --out ~/Apps/<name>.html

  --code   Lehrkraft-Code (nur Ziffern, 4–8 Stellen). Wird NUR in die gebaute Datei geschrieben,
           nie ins Repository. Ohne --code: Zufallscode, der in der Konsole angezeigt wird.
  --signs  Lokaler Ordner mit Gebärdenbildern (WORT.jpg/.jpeg/.png). Eingebettet werden nur
           Wörter, die im Inhalt als sign('WORT') oder als Feld sign: "WORT" vorkommen. Lizenzierte Bilder (z. B. Kestner)
           gehören NIE ins Repository; dist/ ist deshalb in .gitignore.
  --out    Zieldatei (Standard: dist/<app-id>.html)
  --images Lokaler Ordner mit lizenzierten App-Bildern (NAME.png); eingebettet für imgSrc('NAME'). Nie ins Repository.
  --no-signs  Gebärdenfelder ganz weglassen (Fassung zum Weitergeben ohne lizenzierte Gebärdenbilder)

Prüfungen: alle Platzhalter ersetzt, Syntaxprüfung mit node --check, fehlende Gebärden werden gemeldet.
"""
import argparse, base64, io, json, os, re, secrets, subprocess, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CORE_JS = ["ui.js", "lv.js", "game.js", "teacher.js", "board.js", "classview.js"]  # Reihenfolge wichtig
BOOT_JS = "boot.js"


def read(p):
    with open(p, encoding="utf-8") as f:
        return f.read()


def sign_data(path, max_w=360, max_h=270, q=72):
    """Bild verkleinern und als JPEG-Daten-URI zurückgeben (Pillow, falls vorhanden)."""
    try:
        from PIL import Image
        im = Image.open(path).convert("RGB")
        im.thumbnail((max_w, max_h))
        b = io.BytesIO(); im.save(b, "JPEG", quality=q, optimize=True)
        return "data:image/jpeg;base64," + base64.b64encode(b.getvalue()).decode()
    except ImportError:
        ext = os.path.splitext(path)[1].lower().lstrip(".")
        mime = "image/png" if ext == "png" else "image/jpeg"
        return "data:%s;base64,%s" % (mime, base64.b64encode(open(path, "rb").read()).decode())


def image_data(path, max_side=320):
    """App-Bild als PNG (Transparenz bleibt) verkleinern und als Daten-URI zurückgeben."""
    try:
        from PIL import Image
        im = Image.open(path).convert("RGBA")
        im.thumbnail((max_side, max_side))
        b = io.BytesIO(); im.save(b, "PNG", optimize=True)
        return "data:image/png;base64," + base64.b64encode(b.getvalue()).decode()
    except ImportError:
        return "data:image/png;base64," + base64.b64encode(open(path, "rb").read()).decode()

def find_sign(folder, word):
    for name in os.listdir(folder):
        stem, ext = os.path.splitext(name)
        if stem.upper() == word.upper() and ext.lower() in (".jpg", ".jpeg", ".png"):
            return os.path.join(folder, name)
    return None


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("app", help="Ordner der App, z. B. apps/beispiel-formen")
    ap.add_argument("--code", help="Lehrkraft-Code (Ziffern)")
    ap.add_argument("--signs", help="lokaler Ordner mit Gebärdenbildern")
    ap.add_argument("--out", help="Zieldatei")
    ap.add_argument("--images", help="lokaler Ordner mit lizenzierten App-Bildern (NAME.png), eingebettet für imgSrc('NAME')")
    ap.add_argument("--no-signs", action="store_true", help="Gebärdenfelder ganz weglassen (z. B. Fassung zum Weitergeben)")
    a = ap.parse_args()

    app_dir = os.path.abspath(a.app)
    content = read(os.path.join(app_dir, "content.js"))
    m = re.search(r'id:\s*"([a-z0-9-]+)"', content)
    if not m:
        sys.exit("Fehler: In content.js fehlt APP.id (nur a–z, 0–9, -).")
    app_id = m.group(1)
    t = re.search(r'title:\s*"([^"]+)"', content)
    title = t.group(1) if t else app_id

    code = a.code
    if code is None:
        code = "".join(secrets.choice("0123456789") for _ in range(4))
        print("Hinweis: kein --code angegeben. Zufälliger Lehrkraft-Code:", code)
    if not re.fullmatch(r"\d{4,8}", code):
        sys.exit("Fehler: --code muss aus 4–8 Ziffern bestehen.")

    css = read(os.path.join(ROOT, "core", "base.css"))
    extra_css = os.path.join(app_dir, "app.css")
    if os.path.exists(extra_css):
        css += "\n/* ---- app.css ---- */\n" + read(extra_css)

    js_parts = ["/* ---- core/%s ---- */\n%s" % (n, read(os.path.join(ROOT, "core", n))) for n in CORE_JS]
    js_parts.append("/* ---- %s/content.js ---- */\n%s" % (os.path.basename(app_dir), content))
    js_parts.append("/* ---- core/%s ---- */\n%s" % (BOOT_JS, read(os.path.join(ROOT, "core", BOOT_JS))))
    js = "\n".join(js_parts)
    if js.count("__TEACH_CODE__") != 1:
        sys.exit("Fehler: Platzhalter __TEACH_CODE__ muss genau einmal vorkommen (core/teacher.js).")
    js = js.replace("__TEACH_CODE__", code)

    # Gebärden-Wörter: sign('WORT') direkt oder als Feld sign: "WORT" (für sign(F[x].sign)); Kommentare zählen nicht
    scan = re.sub(r"/\*.*?\*/", "", content, flags=re.S)
    words = sorted(set(re.findall(r"sign\(\s*[\"']([A-Z0-9_ÄÖÜ]+)[\"']", scan)) | set(re.findall(r"\bsign:\s*[\"']([A-Z0-9_ÄÖÜ]+)[\"']", scan)))
    signs, missing = {}, []
    if a.signs:
        folder = os.path.expanduser(a.signs)
        for w in words:
            p = find_sign(folder, w)
            if p: signs[w] = sign_data(p)
            else: missing.append(w)
    else:
        missing = words
    if a.no_signs:
        signs, missing = {}, []
    # App-Bilder (z. B. lizenzierte Illustrationen): imgSrc('NAME') im Inhalt; PNG mit Transparenz, max. 320 px
    inames = sorted(set(re.findall(r"imgSrc\(\s*[\"']([A-Z0-9_ÄÖÜ]+)[\"']", scan)))
    images, imissing = {}, []
    if a.images:
        folder = os.path.expanduser(a.images)
        for w in inames:
            p = find_sign(folder, w)
            if p: images[w] = image_data(p)
            else: imissing.append(w)
    signs_js = "const SIGNS=" + json.dumps(signs, ensure_ascii=False) + ";const SIGNS_OFF=" + ("true" if a.no_signs else "false") + ";const IMAGES=" + json.dumps(images, ensure_ascii=False) + ";"

    html = read(os.path.join(ROOT, "core", "shell.html"))
    for k, v in (("{{TITLE}}", title), ("{{CSS}}", css), ("{{SIGNS}}", signs_js), ("{{JS}}", js)):
        html = html.replace(k, v)
    if re.search(r"\{\{[A-Z]+\}\}", html):
        sys.exit("Fehler: nicht ersetzter Platzhalter in shell.html.")

    # Syntaxprüfung (fängt z. B. '//'-Kommentare in einzeiligem Code ab)
    with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False, encoding="utf-8") as f:
        f.write(signs_js + "\n" + js); tmp = f.name
    try:
        r = subprocess.run(["node", "--check", tmp], capture_output=True, text=True)
        if r.returncode != 0:
            sys.exit("Syntaxfehler im JavaScript:\n" + r.stderr)
    except FileNotFoundError:
        print("Warnung: node nicht gefunden – Syntaxprüfung übersprungen.")
    finally:
        os.unlink(tmp)

    out = a.out or os.path.join(ROOT, "dist", app_id + ".html")
    os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
    with open(out, "w", encoding="utf-8") as f:
        f.write(html)
    print("Gebaut:", out, "(%d KB)" % (len(html.encode()) // 1024))
    print("Gebärden eingebettet: %d · Platzhalter: %d%s" % (len(signs), len(missing), (" (" + ", ".join(missing) + ")") if missing else "") + (" · Gebärdenfelder aus" if a.no_signs else ""))
    if a.images or inames:
        print("App-Bilder eingebettet: %d%s" % (len(images), (" · fehlen: " + ", ".join(imissing)) if imissing else "") + ("" if a.images else " (ohne --images: eigene Zeichnungen)"))


if __name__ == "__main__":
    main()
