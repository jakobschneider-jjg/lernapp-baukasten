# Lernapp-Baukasten

Baukasten für kleine Übungs-Apps im Unterricht (iPad, digitale Tafel, LearningView).
Entstanden an einer Förderschule mit dem Förderschwerpunkt Hören und Kommunikation; geeignet für alle Klassen, in denen
Aufgaben **visuell, gebärdenunterstützt und ohne viel Text** funktionieren sollen.

Jede App wird zu **einer einzigen HTML-Datei** gebaut: läuft offline, ohne Server, ohne Anmeldung, und kann in LearningView als
Aufgabe angehängt werden. Dann speichert LearningView den Lernstand jedes Kindes und zeigt der Lehrkraft eine Klassenübersicht.

> mit KI erstellt (Claude) · geprüft: J. Schneider · Lizenz: MIT (nur der Code, siehe unten)

## Was jede App mitbringt

| Baustein | Was er tut |
|---|---|
| Stufen | ★ Start → ● Stufe 1 → ●● Stufe 2 … Die nächste Stufe öffnet sich mit 70 % der Sterne der vorigen. Einmal offen bleibt offen. Optional zusätzlich mit Bild-Code (`levels[i].lock`): Die Stufe öffnet sich erst, wenn die Klasse den Code von der Tafel eingegeben hat. |
| Aufgabenarten | Auswahl (Antwortkarten), Bau-Aufgabe (`build`: Kästchen füllen oder Zellen antippen) und eigene Aufgabe (`custom`: App baut die Antwortfläche selbst, z. B. Mitspielen im Takt). Alle nutzen dieselben Hilfen, Sterne und Wiederholungen. |
| Extra-Bereiche | Freie Flächen ohne Sterne (`extras`), z. B. „Frei bauen“, „Trommeln“, „Das kann ich“-Karte. Knöpfe auf der Startseite. |
| Missionen | Aufgabenreihen mit Fortschrittspunkten, Abzeichen am Ende, Krone bei allen Abzeichen. |
| Hilfen statt Raten | Nach dem 1. Fehler sind die Antworten gesperrt, bis die Hilfe genutzt wurde (Zählhilfe: alles antippen · Wartehilfe: kurz hinschauen). Nach dem 2. Fehler zeigt die App die Lösung, die Aufgabe kommt am Ende ohne Stern noch einmal. |
| Freischalt-Codes | Missionen bleiben gesperrt, bis die Klasse einen Bild-Code eingibt (z. B. erst nach dem Falten in der Stunde). |
| Schiene | Stark reduzierte eigene Spur für ein Kind (z. B. Förderschwerpunkt Geistige Entwicklung), nur auf dessen Gerät eingeschaltet. |
| Tafel | „Klasse gegen Lehrkraft“ mit Kartenstapeln für die digitale Tafel. |
| Lehrkraft-Bereich | „Info“ → Code → Schalter (alle Stufen, Sperren, Schiene, Fortschritt löschen) und die Bild-Codes zum Zeigen an der Tafel. |
| LearningView | Lernstand speichern und laden, Prozentwert auf der Kachel, Klassenübersicht, Einzelansicht, Vorschau. |

## Ordner

```
core/        gemeinsamer Code (nicht pro App ändern)
  base.css     Gestaltung
  ui.js        Hilfsfunktionen, Symbole, sign('WORT'), Konfetti
  lv.js        Zustand + LearningView-Schnittstelle
  game.js      Stufen, Missionen, Aufgaben, Hilfen, Codes
  teacher.js   Lehrkraft-Bereich (Code wird beim Bauen eingesetzt)
  board.js     Tafel-Modus
  classview.js Klassenübersicht / Einzelansicht
  boot.js      Start
  shell.html   HTML-Gerüst
apps/
  beispiel-formen/content.js   Beispiel-App „Formen-Profi“ = Vorlage
  rhythmus/content.js, app.css Rhythmus-Baukasten (Tiernotation → Trommelraster, Mitspielen, „Das kann ich“-Karte)
tools/build.py                 baut dist/<app>.html
tests/                         Klicktests (Playwright), LearningView-Nachbau
run_all.sh                     baut die Beispiel-App und führt alle Tests aus
REGELN.md                      Gestaltungs- und Technikregeln
```

## Neue App in 5 Schritten

```bash
cp -r apps/beispiel-formen apps/meine-app        # 1. Vorlage kopieren
# 2. apps/meine-app/content.js anpassen (id, title, Stufen, Missionen, Aufgaben)
python3 tools/build.py apps/meine-app --code 1234 --signs ~/Gebaerden   # 3. bauen
python3 tests/test_learningview.py dist/meine-app.html                  # 4. prüfen (oder eigene Tests)
# 5. dist/meine-app.html in LearningView als Anhang einer Aufgabe hochladen (Abgabeform „keine“)
```

* `--code` – Lehrkraft-Code (4–8 Ziffern). Steht **nur** in der gebauten Datei, nie im Repository.
* `--signs` – **lokaler** Ordner mit Gebärdenbildern `WORT.jpg/.png`. Eingebettet werden nur Wörter, die im Inhalt als
  `sign('WORT')` oder als Feld `sign: "WORT"` vorkommen. Ohne Ordner erscheinen gestrichelte Platzhalter.
* Ergebnis: `dist/<id>.html` (Ordner `dist/` wird nicht eingecheckt).

Voraussetzungen: Python 3, Node.js (Syntaxprüfung), für Tests `pip install playwright && playwright install chromium`.
Optional Pillow (verkleinert Gebärdenbilder auf 360 × 270 px).

## Vertrag: `APP` in `content.js`

```js
const APP = {
  id: "formen-profi",              // a–z, 0–9, -  (Speicherschlüssel, Dateiname)
  title: "Formen-Profi", subtitle: "…", credit: "mit KI erstellt · geprüft: …", crownLabel: "…",
  hero: () => "<svg…>",            // Bild oben auf der Startseite
  unlockShare: 0.7,                // Anteil Sterne für die nächste Stufe
  levels: [ { id, marks: "★", label: "Start", icons: () => "<svg…>", missions: ["namen", …] },
            { id: "s1", …, lock: "k1" }, … ],   // lock (optional): Stufe braucht zusätzlich den Code locks.k1
  track:  { id: "ge", label, switchLabel, missions: [...], startHTML: () => "…" },   // optional
  missions: { namen: { name: "Namen", icon: () => "<svg-Inhalt im 200er-Raster>" }, … },
  buildTasks(levelId, missionId) { return [Aufgabe, …]; },   // bei jedem Start neu (gemischt)
  locks: { muster: { label, switchLabel, missions: ["muster"], code: ["dreieck","kreis","quadrat"],
                     keys: [{ id: "kreis", html: "<svg…>" }, …] } },                 // optional
  board: { namen: { label: "Namen", cards: () => [{ html, reveal }] } },               // optional
  helpLink: t => "https://…/#" + …,  // optional: ?-Knopf öffnet Erklärseite in neuem Tab
  extras: [ { id, label, icon: () => "<svg-Inhalt>", render(el), track: true|false } ],   // optional: freie Bereiche
  onMissionDone({ level, mid, perfect }) { … },   // optional: nach jeder Mission; perfect = alles im 1. Versuch
  info: "<p>…</p>"                   // Erklärung im Lehrkraft-Bereich
};
```

### Aufgabe

```js
{
  prompt: sign("ECKE") + " ?",      // kurze Frage, möglichst Gebärde/Bild statt Text
  show: "<svg class='vis'…>",       // was betrachtet wird ("" = nichts)
  layout: "names" | "nums" | "grid" | "wide" | "two",
  answers: [ { v: "4", html: "<span class='num'>4</span>" }, … ],
  answer: "4",                      // v der richtigen Antwort
  hint: …,                          // siehe unten
  sol: { show: "…", text: "…" },    // nach dem 2. Fehler
  goodText: ""                      // optional nach „Richtig!“
}
```

Hilfen (`hint`):

* **Zählhilfe** `{ tap: { show, target, sign, text, kinds } }` – `show` enthält antippbare Elemente
  `<g class="tp" data-k="e">…<circle class="mk" …/></g>`. Antworten bleiben gesperrt, bis `target` Elemente markiert sind.
  `kinds` (optional) zählt getrennt nach `data-k`.
* **Wartehilfe** `{ wait: { icon, text, ms, show, answers } }` – zeigt ggf. anderes Bild/andere Antwortbilder; Antworten
  `ms` Millisekunden gesperrt.
* **eigene Funktion** `hint: ctx => { … }` mit `ctx.setShow`, `ctx.drawAnswers`, `ctx.waitHint`, `ctx.tapHint`.

Bei nur zwei Antworten wird eine falsche nicht ausgegraut (sonst wäre der 2. Versuch geschenkt).

Weitere Aufgabenarten (statt `answers`/`answer`):

* **Bau-Aufgabe** `build: { n, answer: [...], view(arr, {sel, solution}) -> HTML mit [data-slot], palette: [{v, html}] | cycle: ["", "x", …] }`
  – `palette`: Kästchen mit Bausteinen füllen (antippen leert ein Kästchen); `cycle`: jedes Antippen schaltet weiter.
  Prüfen über den Haken-Knopf; nach dem 2. Fehler zeigt die App die Lösung im selben Feld.
* **Eigene Aufgabe** `custom: { render(ctx), solution(ctx) }` – `render` baut die Antwortfläche und meldet `ctx.good(node)`
  oder `ctx.bad(node)`; `ctx.busy()` ist wahr, solange eine Hilfe läuft oder die Aufgabe erledigt ist.
  Hilfe (`hint` als Funktion) und Wiederholung am Ende funktionieren wie bei Auswahl-Aufgaben.

## LearningView einrichten

1. Aufgabe anlegen, gebaute HTML-Datei als **Anhang** hochladen, **Abgabeform „keine“**.
2. Aufgabe einmal in der **Vorschau** öffnen → Freigabe für Klassendaten bestätigen.
   Jede neue HTML-Version braucht eine neue Freigabe.
3. Kinder öffnen die Aufgabe; der Lernstand wird automatisch gespeichert (höchstens alle 2,4 s, max. 1 MiB).
4. Lehrkraft: Klassenansicht der Aufgabe → Klassenübersicht (Sterne je Stufe, Abzeichen, Hilfe/Lösung, zuletzt aktiv).

Schnittstelle: <https://learningview.org/embed-api.php>. Die App nimmt nur Nachrichten von `https://learningview.org`
aus dem Elternfenster an und schreibt Namen aus LearningView nur als Text (nie als HTML) in die Tabelle.

## Datenschutz und Lizenzen

* Gespeichert werden nur Sterne, Abzeichen, Schalter, Zähler und ein Zeitstempel – **keine Namen, keine freien Texte,
  keine Fotos**. Namen sieht nur die Lehrkraft in der Klassenübersicht, sie kommen von LearningView.
* **Gebärdenbilder** sind meist lizenziert (z. B. © Verlag Karin Kestner: nur für den eigenen Unterricht).
  Sie gehören **nicht** in dieses Repository und nicht in öffentlich geteilte Builds. Deshalb `--signs` mit lokalem Ordner
  und `dist/` in `.gitignore`.
* Lehrkraft-Codes nie einchecken.
* Code: MIT-Lizenz (siehe `LICENSE`).

## Tests

```bash
./run_all.sh
```

* `tests/test_lokal.py` – spielt alle Missionen wie ein Kind (Fehler, Hilfe, Lösung, Wiederholung), Freischalt-Code,
  Lehrkraft-Code, Schiene, Löschen, Tafel.
* `tests/test_rhythmus.py <html> <code> [bildordner]` – Klicktest der Rhythmus-App: alle Missionen (auch Mitspielen mit
  getakteten Taps), Codes, Extras, Karte und Sticker, Tafel, Starter-Schiene; Bildschirmfotos in den Bildordner.
* `tests/test_learningview.py <html>` – für jede App nutzbar (wählt selbst Auswahl-Missionen der ersten Stufe):
  nachgebautes LearningView (Herkunft `https://learningview.org`, sandbox-iframe):
  Schüler-Modus, Neuladen, Speicherfehler, Einzelansicht, Klassenübersicht (inkl. HTML in Namen, kaputte Daten,
  abgelehnte Freigabe), Vorschau, keine Antwort, fremde Nachrichten.

Auf dem iPad zusätzlich von Hand prüfen: alle Knöpfe antippen, Lehrkraft-Schalter, Hilfe-Link zweimal öffnen.
