#!/usr/bin/env python3
"""Bereitet Videos aus dem Wörterbuchpaket von gebaerdenlernen.de für die Lesewerkstatt vor (lokal, nie ins Repository).

  python3 apps/lesewerkstatt/videos_vorbereiten.py --quelle "<…>/Gebaerden/video" --ziel ~/lw-videos --liste apps/lesewerkstatt/woerter.csv
  python3 apps/lesewerkstatt/videos_vorbereiten.py --quelle "<…>/Gebaerden/video" --ziel ~/lw-videos hund katze   (einzelne Wörter)

Mit --liste: Spalten id, wort, video der Wortliste (Video = Dateiname im Paket, Fingeralphabet = das geschriebene Wort).
Für jedes Wort entstehen zwei Dateien im Zielordner:
  HUND.mp4     die Gebärde, auf die Bewegung zugeschnitten (Ruhe vorher/nachher weg), 360 × 270, ohne Ton
  FA_HUND.mp4  das Wort im Fingeralphabet: die Buchstabenvideos (a.mp4 …, sch.mp4, ch.mp4, ae/oe/ue, sz) auf die
               gehaltene Handform gekürzt, auf Hand und Gesicht zugeschnitten und aneinandergehängt
Dann bauen mit:  tools/build.py apps/lesewerkstatt --videos ~/lw-videos --video-size 360x270 …

Erkennung (an den Aufnahmen von gebaerdenlernen.de eingestellt, Nov. 2026):
  Wort: Bewegung von Bild zu Bild (Abstand 2 Bilder); Anfang/Ende = erstes/letztes Bild über 15 % des Höchstwerts.
  Buchstabe: Hand im Ausschnitt neben dem Kinn (x 100–340, y 80–260 bei 640 × 480); längster Abschnitt über 50 %.
Braucht ffmpeg und numpy. Lizenz der Videos: CC BY-NC-SA 3.0 DE (Henrike Maria Falke, gebaerdenlernen.de) – Quelle in der App nennen.
"""
import argparse, os, subprocess, tempfile
import numpy as np

FPS = 25
HAND = (100, 80, 240, 180)   # x, y, b, h im Original 640 × 480
ENC = ["-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", "-preset", "medium", "-an", "-r", str(FPS)]


def grau(pfad, vf, b, h):
    out = subprocess.run(["ffmpeg", "-v", "error", "-i", pfad, "-vf", vf + ",scale=%d:%d,format=gray" % (b, h), "-f", "rawvideo", "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(out, np.uint8).reshape(-1, h, b).astype(np.float32)


def wort_abschnitt(pfad):
    a = grau(pfad, "null", 128, 96)
    d = np.r_[0, 0, (np.abs(a[2:] - a[:-2]) > 20).reshape(len(a) - 2, -1).mean(1)]
    d = np.convolve(d, np.ones(5) / 5, "same"); an = np.where(d > 0.15 * d.max())[0]
    return max(0, an[0] / FPS - 0.1), min(len(a) / FPS, an[-1] / FPS + 0.2)


def buchstabe_abschnitt(pfad):
    x, y, b, h = HAND
    a = grau(pfad, "crop=%d:%d:%d:%d" % (b, h, x, y), 60, 45)
    ref = np.median(a[:8], 0); da = (np.abs(a - ref) > 30).reshape(len(a), -1).mean(1)
    an = np.where(da > 0.5 * da.max())[0]
    teile = np.split(an, np.where(np.diff(an) > 2)[0] + 1); t = max(teile, key=len)
    return t[0] / FPS + 0.08, t[-1] / FPS - 0.04


def zeichen(wort):
    """Wort in Fingeralphabet-Zeichen zerlegen: sch, ch, ä/ö/ü, ß als eigene Handformen (Dateien ae, oe, ue, sz)."""
    w, out, i = wort.lower(), [], 0
    um = {"ä": "ae", "ö": "oe", "ü": "ue", "ß": "sz"}
    while i < len(w):
        if w.startswith("sch", i): out.append("sch"); i += 3
        elif w.startswith("ch", i): out.append("ch"); i += 2
        else: out.append(um.get(w[i], w[i])); i += 1
    return out


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--quelle", required=True, help="Ordner video/ des Wörterbuchpakets")
    ap.add_argument("--ziel", required=True, help="Zielordner (lokal)")
    ap.add_argument("--liste", help="Wortliste (CSV mit Semikolon, Spalten id;wort;…;video)")
    ap.add_argument("--nur-neue", action="store_true", help="Wörter überspringen, deren Videos schon im Zielordner liegen")
    ap.add_argument("woerter", nargs="*", help="Dateinamen ohne .mp4, z. B. hund katze (ohne --liste)")
    a = ap.parse_args()
    if a.liste:
        import csv
        eintraege = [(r["id"], r["wort"], r["video"]) for r in csv.DictReader(open(a.liste, encoding="utf-8-sig"), delimiter=";") if r.get("id")]
    else:
        eintraege = [(w, w, w) for w in a.woerter]
    q, z = os.path.expanduser(a.quelle), os.path.expanduser(a.ziel); os.makedirs(z, exist_ok=True)
    cache = {}
    for ident, w, datei in eintraege:
        if a.nur_neue and os.path.exists(os.path.join(z, ident.upper() + ".mp4")) and os.path.exists(os.path.join(z, "FA_" + ident.upper() + ".mp4")):
            continue
        s, e = wort_abschnitt(os.path.join(q, datei + ".mp4"))
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", "%.2f" % s, "-to", "%.2f" % e, "-i", os.path.join(q, datei + ".mp4"), "-vf", "scale=360:270", *ENC,
                        os.path.join(z, ident.upper() + ".mp4")], check=True)
        with tempfile.TemporaryDirectory() as t:
            teile = []
            for k, c in enumerate(zeichen(w)):
                if c not in cache: cache[c] = buchstabe_abschnitt(os.path.join(q, c + ".mp4"))
                bs, be = cache[c]; p = os.path.join(t, "%02d.mp4" % k)
                subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", "%.2f" % bs, "-to", "%.2f" % be, "-i", os.path.join(q, c + ".mp4"),
                                "-vf", "crop=%d:%d:%d:%d,scale=360:270" % (HAND[2], HAND[3], HAND[0], HAND[1]), *ENC, p], check=True)
                teile.append(p)
            liste = os.path.join(t, "liste.txt"); open(liste, "w").write("".join("file '%s'\n" % p for p in teile))
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", liste, "-c", "copy", os.path.join(z, "FA_" + ident.upper() + ".mp4")], check=True)
        print("%-10s Gebärde %.1f–%.1f s · Fingeralphabet %s" % (w, s, e, "-".join(zeichen(w))))


if __name__ == "__main__":
    main()
