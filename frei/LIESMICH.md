# Freie Apps (ohne Baukasten-Kern)

Apps, die eine eigene Struktur brauchen (z. B. Escape Room mit Räumen und Schlössern statt Stufen und Missionen).

* `kreide.js` – gemeinsame Zeichnungen im Kreide-Stil (Kinderzeichnung mit Wachsmalkreide), auch von
  `apps/weihnachten-im-stall` genutzt. Gezeichnet mit `rough.js` (MIT, © Preet Shihn, siehe `rough-LICENSE.txt`).
* `licht-fuer-den-stall/` – Escape Room „Ein Licht für den Stall“ (6 Stationen + Finale, 4 Lesestufen, Guckkasten mit
  Parallaxe, Laternenlicht, LearningView-Schnittstelle).
  Bauen: `python3 frei/licht-fuer-den-stall/bauen.py --code <Code>`; Tests: `tests/test_klick.py <Stufe> "" <html>`,
  Eingebettete Fassung für den Adventskalender `apps/weihnachten-im-stall`: `bauen.py --eingebettet` (ohne Lehrkraft-Bereich und LearningView; der Kalender lädt sie als `srcdoc`-Rahmen, gibt Stufe, Stand und offene Stationen per `postMessage` mit und speichert selbst). Tür 4: Stationen 1+2 · Tür 9: 3 · Tür 14: 4+5 · Tür 16: 6+Finale.
  `tests/test_learningview.py <html>`.

mit KI erstellt (Claude) · geprüft: J. Schneider
