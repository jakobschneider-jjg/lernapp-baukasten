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
11. **Hilfen innerhalb einer Mission zurücknehmen**, wenn eine Fertigkeit neu ist (Beispiel Rhythmus, Mission „Puls“):
    vorspielen + Schlag-Blitz → nur Blitz → nur Puls-Licht → ohne Licht. Einstiegsmissionen gestuft schwerer machen
    (erst ein neues Element, dann zwei, dann frei). (Rückmeldung Jakob, Nov. 2026: Einstieg ins Mitspielen war zu schwer.)
12. **Belohnungen ohne Sog-Mechanik** (Prüfung Nov. 2026 mit Radesky et al. 2022, JAMA Netw Open, und Deci/Koestner/Ryan 1999,
    Psychol Bull): keine Zufallsbelohnungen, keine Tages- oder Serien-Belohnungen, kein Zeitdruck, nichts, was man verlieren kann,
    keine Ranglisten zwischen Kindern. Erwartete, leistungsabhängige Belohnungen sparsam: z. B. Super-Sticker nur einmal pro Mission,
    frei gewählt aus festen Motiven; Wiederholen bleibt möglich, bringt aber nichts Zusätzliches. Rückmeldung über das Können
    („Das kann ich“-Karte) statt zusätzlicher Belohnungsebenen; nicht mehrere Sammel-Systeme nebeneinander (Abzeichen-Regal ausblenden,
    wenn eine Karte es ersetzt). Nach einer Mission startet nichts von selbst.
13. **Mitspielen im Takt** (Tippen auf eine Bildschirm-Trommel) nur mit großzügiger Toleranz (Rhythmus-App: 45 % des Abstands zum
    Nachbarschlag, 90–230 ms, höchstens 1 Extra-Schlag), Einzählen sichtbar 1–4, Tempo eher etwas schneller als „ganz langsam“
    (Rückmeldung Jakob: ca. 57 statt 50 Schläge pro Minute spielt sich besser). Echtes Trommeln/Klatschen kann die App nicht prüfen –
    deshalb zusätzlich ungeprüfte „Spiel mit!“-Runden anbieten.

14. **Gebärdenvideos für die Frage, nicht für die Lösung** (Körper-Profi/Körper-Werkstatt, Nov. 2026): kurz (5–10 s), ohne
    Antwortmöglichkeiten, Frage ohne Namen des Gegenstands, wenn ein Clip für viele Aufgaben passen soll (z. B. „Wie viele
    Ecken?“). Videos nur dort einsetzen, wo die Gebärde genau die Frage der Aufgabe stellt – eine abweichende Frage verwirrt.
    Klein und stumm in Schleife, antippen = groß und verschiebbar; Schalter im Lehrkraft-Bereich (z. B. aus für LS-Kinder ohne DGS).
    **Quellen:** eigene Aufnahmen nach der Drehliste; für **einzelne gebärdete Wörter** auch **gebaerdenlernen.de**
    (CC BY-NC-SA laut Jakob; Quelle nennen, nicht kommerziell, gleiche Lizenz).

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
10. **Ton auf dem iPad:** Safari gibt Web-Audio erst nach einer Berührung frei – den Audio-Kontext bei jedem `pointerdown` wecken.
    Alles muss auch ohne Ton verständlich sein.
11. **Bilder aus Worksheet Crafter nur mit Erlaubnis:** Die Nutzungsbedingungen erlauben die Weitergabe außerhalb des Programms
    nur als PDF oder Video und schließen selbst gebaute interaktive Übungen aus (Stand Nov. 2026). Für Jakobs eigene Klassen liegt
    eine Erlaubnis vor (Nov. 2026, Rhythmus-Trainer): Bilder nur über `--images` aus einem lokalen Ordner, Quellenzeile
    „Material mit freundlicher Genehmigung von www.worksheetcrafter.com“. Lizenzierte Bilder (auch Kestner) nie ins Repository.
12. **Zwei Fassungen**, wenn eine App weitergegeben werden soll: Klassen-Fassung mit lizenzierten Bildern (`--signs`, `--images`)
    und Weitergabe-Fassung mit eigenen Zeichnungen und ohne Gebärdenbilder (`--no-signs`). Kestner-Gebärdenbilder sind nur für den
    eigenen Unterricht. Beide Fassungen mit gleicher `APP.id` und LearningView-Schnittstelle; beide testen.
13. **Tests mit Zeitablauf** (Vorspielen, Mitspielen): auf das tatsächliche Ende der Runde warten, nicht auf eine sichtbare Meldung;
    Overlays nach einer Mission (z. B. Sticker-Auswahl) im Test bedienen.

14. **Videos in LearningView einbetten, nicht von YouTube laden:** LearningView lädt in eingebetteten Aufgaben keinen
    YouTube-Player (bleibt leer, keine Fehlermeldung; Test Jakob 23.11.2026). Deshalb Videos über `--videos` in die Datei
    (640 × 360, ohne Ton, CRF 26 ≈ 30–60 KB/s; Wiedergabe als Blob-URL, läuft auch im abgeschirmten Rahmen). YouTube
    (youtube-nocookie.com) nur für öffentliche Seiten wie GitHub Pages; dort die Schleife selbst steuern statt mit
    `loop=1&playlist=…` (ein Video meldete beim Neustart fälschlich „privat“).

## Offene Fragen (bitte bei Gelegenheit testen)

* ~~Bleiben Lernstände erhalten, wenn an derselben LearningView-Aufgabe eine neue HTML-Version angehängt wird?~~
  **Geklärt (15.11.2026, Test durch Jakob mit Testschüler):** Ja. `APP.id` nicht ändern und das Zustandsformat
  abwärtskompatibel halten (neue Stufen, Missionen und Felder ergänzen ist unkritisch); nach dem Austausch neu freigeben.
* Was ermöglicht `DOWNLOADFILE|` in LearningView (z. B. Urkunde als Datei)?
