# Regeln für Lern-Apps aus dem Baukasten

Erfahrungen aus dem Einsatz (Kl. 3/4, Förderschwerpunkt Hören und Kommunikation, iPad + LearningView).
Neue Erfahrungen hier ergänzen – mit Datum und Quelle (z. B. „Reflexion Geometrie, Nov. 2026“).

## Didaktik

1. **Visuell vor Text.** Frage als Gebärdenbild + Symbol, nicht als Satz. Text nur als Ergänzung für Erwachsene.
2. **Hilfe muss etwas tun lassen.** Eine Text-Hilfe nützt Kindern mit geringer Lesekompetenz nicht.
   Zählhilfe (alles antippen) oder Wartehilfe (anderes Bild, kurz hinschauen) verwenden.
3. **Raten verhindern.** Nach dem 1. Fehler Antworten sperren, bis die Hilfe genutzt wurde.
   Nach dem 2. Fehler Lösung zeigen, kein Stern, Aufgabe kommt am Ende nochmal.
4. **Zwei Antworten = keine ausgrauen.** Sonst ist der 2. Versuch geschenkt.
5. **Keine verräterischen Unterschiede.** Antwortbilder gleich groß, gleich gefärbt, gleich skaliert
   (Beispiel: Quader-Netze in unterschiedlicher Größe verrieten die Lösung).
6. **Stufen bauen aufeinander auf.** Start ist Pflicht; 70 % der Sterne öffnen die nächste Stufe; einmal offen bleibt offen.
   Spätere Stufen nutzen frühere Inhalte als Ablenker.
7. **Sperren an Unterrichtsphasen koppeln.** Was erst nach einer analogen Phase Sinn ergibt (z. B. Netze nach dem Falten),
   mit Bild-Code sperren; den Code zeigt die Lehrkraft an der Tafel.
8. **Schiene für stark abweichende Lernziele** (z. B. Förderschwerpunkt GE): eigene Missionen, immer zwei Antworten,
   kein Zählen, nur auf dem Gerät des Kindes einschalten. Namensgebärde des Kindes nur lokal einbauen
   (`--signs`), nie ins Repository.
9. **Tafel-Showdown** für den gemeinsamen Einstieg/Abschluss: ohne Hilfen, Klasse gegen Lehrkraft.
10. Wirkung jeder neuen Hilfeform in der Reflexion abfragen und hier festhalten.

## Technik

1. Eine HTML-Datei, alles eingebettet (Gebärden als JPEG-Daten, 360 × 270, Qualität 72). Läuft offline.
2. **iPad/Safari:** kein `<dialog>`, `confirm()`, `prompt()`, `alert()` – reagieren nicht zuverlässig. Eigene Overlays verwenden.
3. Externe Links mit `?t=Zeitstempel` vor dem `#` öffnen, sonst springt Safari nur in den alten Tab.
4. GitHub-Pages-Adressen sind **groß-/kleinschreibungsabhängig** – Adresse aus dem Browser kopieren, nicht ableiten.
5. Keine `//`-Kommentare in einzeilig zusammengezogenem Code (kommentiert den Rest der Zeile aus) → `/* */`.
   `build.py` prüft mit `node --check`.
6. Lehrkraft-Schalter immer mit Code; Code nur beim Bauen einsetzen.
7. LearningView: nur Nachrichten von `https://learningview.org` aus `window.parent` annehmen; eine Speicherung zur Zeit,
   mind. 2 s Abstand (Baukasten: 2,4 s); Lernstand ≤ 1 MiB; spät eintreffende Daten überschreiben keinen neueren Stand;
   Namen nur per `textContent`.
8. Vorschau, Einzelansicht und Klassenansicht speichern nie.
9. Vor der Weitergabe: `./run_all.sh` bzw. eigene Tests + Tap-Test auf dem iPad.

## Offene Fragen (bitte bei Gelegenheit testen)

* Bleiben Lernstände erhalten, wenn an derselben LearningView-Aufgabe eine **neue HTML-Version** angehängt wird?
  (Bis dahin: neue Version nur zwischen zwei Reihen austauschen.)
* Was ermöglicht `DOWNLOADFILE|` in LearningView (z. B. Urkunde als Datei)?
