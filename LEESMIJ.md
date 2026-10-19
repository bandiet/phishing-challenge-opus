# Phishing Challenge – „Opus“ (CCT)

Intern „Opus“: die bewährten Inhalte der ursprünglichen Phishing Challenge (Nachrichten, Situationen, Warnsignale, Feedback, Sicherheitstipps 1:1) in der neuen Oberfläche. Korrekturen am Original sind in `js/inhalt.de.js` mit `// Korrektur:` markiert. Die Variante mit neuen Nachrichten liegt daneben in `PhishingChallenge/` (2.0).

Start (Symbole gleiten ruhig nach außen, wie ein Flug durch den Raum) → Briefing → Profil (Name, Firma, E-Mail; leer = Max Mustermann, firma.de; die E-Mail folgt Name und Firma, solange der jeweilige Teil nicht von Hand geändert wurde) → Hallo → 3 Level mit je 5 Nachrichten, nach Level 1 und 2 ein Sicherheitstipp (Folie für Folie).

Pro Nachricht (E-Mail wie in einem echten Postfach, SMS wie auf dem iPhone, Teams wie im neuen Teams):
1. Situation lesen → **Phishing** oder **Echt**.
2. Ergebnis + Kernaussage im Panel, kleiner Stempel oben rechts an der Nachricht. Danach – nacheinander, nicht gleichzeitig – Serie, Joker und (bei Phishing) der Hacker.
3. **Details anzeigen** → Stempel weg, Hinweise der Reihe nach: die aktive Stelle bekommt einen gemeinsamen Umriss (auch über mehrere Zeilen), die übrigen sind dünn umrandet, der Rest ist abgedunkelt; im breiten Layout zoomt die Nachricht leicht auf die Stelle.

**Serie** (Flamme oben rechts): richtige Antworten in Folge; ein Klick sagt, wie viele noch bis zum nächsten Joker fehlen. **Joker** (violette Flamme daneben): verdient bei Serie 3, 6, 8, 10, 12, 14 (`einstellungen.jokerBei`, höchstens `jokerMax`). Ein Klick vor der Antwort zeigt den `joker`-Tipp der Nachricht (verrät die Antwort nicht). Joker und „schon erklärt“ stehen in den suspend_data.

**Wer meldet sich?** Nach einer Antwort höchstens einer – oft auch keiner: der Hacker (wenn man reingefallen ist, sonst ab und zu bei durchschauten Phishing-Mails), der Joker (nur über den Joker: erster Joker stellt sich vor, später „neuer Joker“, einmal pro Durchgang Erinnerung an ungenutzte Joker) oder die Serie (nur über die Serie: erste Serie erklärt, später ab und zu Lob für die Serie, „Serie beendet“). Wer zuletzt sprach, setzt beim nächsten Mal aus. Serie und Joker bleiben in ihrem Kreis; die Sprechblase hängt mit einer Spitze direkt darunter und bleibt immer ganz im Bild.

**Hinweise:** Mobil stehen in Schritt 2 nur noch die Hinweise (ohne Ergebnis-Kopf und allgemeines Feedback); sie gleiten seitlich weiter. Das Panel scrollt nach jedem Schritt so, dass der Weiter-Knopf zu sehen ist – außer der aktive Hinweis würde dabei oben verschwinden.

**Täusch-Domains** (`js/domains.js`): die unauffälligsten Kniffe zuerst – Doppelgänger-Zeichen (rn/m, vv/w, cl/d, I/l, g/q, lc/k), fehlender Doppelbuchstabe, doppelter Bindestrich; vertauschte Buchstaben nur, wenn nichts anderes passt.

**Hintergrund** ruhig ohne Linien: im Quiz zwei schwache Lichter (Petrol links, Magenta rechts), beim Sicherheitstipp Navy mit blauem Schimmer wie in der ursprünglichen Schulung (Überblendung über `data-screen`).

**Hacker** wie im Original (SVG, ca. 3,8 s sichtbar): lugt von links herein, zwinkert mit Funkeln (hat dich erwischt) oder bekommt große Augen und Schweiß (durchschaut). **Konfetti** nach einem geschafften Level, am Ende eine festlichere Variante mit drei Salven, Sternen und Luftschlangen (beides `js/feier.js`, eine Leinwand). Neue Nachrichten kommen mit dem Whoosh aus der ursprünglichen Challenge (`tools/sfx/raw/message_whosh.mp3`, Lautstärke wie die Synth-Klänge).

## Ordner

| Datei | Inhalt |
|---|---|
| `js/inhalt.de.js` | **Alle Texte**: Oberfläche, 15 Nachrichten, Hinweise, Sicherheitstipps, Standard-Profil, Einstellungen |
| `js/domains.js` | baut aus Name/Firma/E-Mail die Platzhalter und die Täusch-Domains (doppelt, vertauscht, rn/m, vv/w, cl/d, -it, andere Endung) – für jede Domain |
| `js/app.js` | Ablauf, Darstellung der Nachrichten, Hinweise mit Spotlight und Zoom, Stempel, Serie, Joker, Hacker |
| `js/feier.js` | Konfetti (Level) und Feuerwerk (Ende) auf einer Leinwand |
| `js/lms.js` | SCORM 1.2 + 2004 (sucht das API selbst), ohne LMS: localStorage |
| `js/klang.js` | Geräusche, live erzeugt; einzelne Rollen können durch Aufnahmen ersetzt werden |
| `js/klang-daten.js` | ausgewählte Aufnahmen (base64), erzeugt von `tools/sfx/bouw_klang.py` – leer = alles live erzeugt |
| `tools/sfx/` | ElevenLabs-Aufnahmen (`raw/`), Auswahl `picks.json`, Anhör-Seite `klangwahl.html` (http://127.0.0.1:8811/tools/sfx/klangwahl.html) |
| `css/style.css` | Gestaltung; `.breit` = Panel rechts, `.schmal` = Bedienung unten |
| `tools/pruefen.js` | Inhaltsprüfung (auch für Übersetzungen) |
| `tools/bouw.py` | baut SCORM-Paket und Website (dist/site) |
| `test/lms.html` | LMS-Simulator |

## Lokal ansehen

Launch-Konfiguration `phishing-opus` (Port 8811) oder `python3 serve.py`.

Test-Sprünge: `#profil`, `#l2` (Level-Start 2), `#l2n3` (Level 2, Nachricht 3), `#e1` (Auswertung Level 1), `#k1` / `#k2` (Sicherheitstipps), `#ende`. Diese Sprünge speichern nichts. `?neu` löscht den gespeicherten Stand.

## SCORM bauen

```
python3 tools/bouw.py            # Deutsch, SCORM 1.2
python3 tools/bouw.py de --2004  # zusätzlich SCORM 2004
```

Ergebnis: `dist/Phishing_Challenge_Opus_DE_SCORM12.zip`, darin nur `imsmanifest.xml` und `index.html`. Diese `index.html` ist komplett eigenständig: CSS, JavaScript und Bilder sind eingebettet, es gibt keine Webfonts, kein CDN und keine externen Adressen. Der Bau prüft das selbst und bricht ab, falls doch etwas von außen geladen würde.

Warum das wichtig ist: Das alte Paket lud Tailwind, Google Fonts und jsDelivr aus dem Netz. Blockiert ein LMS (oder ein Firmennetz) diese Adressen, sieht das Layout anders aus.

## Vor dem Hochladen testen

`http://127.0.0.1:8811/test/lms.html` simuliert ein LMS:

- SCORM 1.2 oder 2004, Name aus dem LMS („Nachname, Vorname“)
- Fenstergrößen: LMS 1024×600, Laptop, Full HD, 2560, Tablet, Handy, Handy quer
- „Neu laden“ testet das Fortsetzen, rechts stehen Status, Punktzahl, suspend_data und jeder SCORM-Aufruf
- Prüfbericht des Inhalts
- „Paket: Gebaut“ lädt genau die Datei, die ins Zip kommt

## Übersetzen (EN/FR/…)

1. `js/inhalt.de.js` kopieren nach `js/inhalt.en.js`, `sprache: 'en'` setzen.
2. Nur Texte übersetzen. **Nicht ändern:** `id`, `art`, `phishing`, `extern`, `bei`, `data-h`, `data-ziel`, `{{platzhalter}}`.
3. `python3 tools/bouw.py en` – prüft automatisch gegen das deutsche Original (gleiche Hinweise, gleiche Markierungen, keine fehlenden Texte) und baut `Phishing_Challenge_Opus_EN_SCORM12.zip`.

Die Täusch-Domains (`fake1`, `fake2`) und Beispielnamen können je Sprache/Kunde angepasst werden (Abschnitt `firma` und `person`).

## Neue Runde mit anderen Nachrichten

Nur `js/inhalt.de.js` austauschen. Jede Nachricht braucht: `id`, `art` (email, sms, whatsapp, teams, linkedin), `phishing`, `titel`, `lage`, `kern` und 2–4 Hinweise (am besten 3). Eine Textstelle wird mit `<mark data-h="b">…</mark>` markiert, ein Link mit `<a data-ziel="https://…" data-h="c">…</a>`, Kopf-Felder mit `bei: 'absender' | 'anhang' | 'banner'`. Die Prüfung meldet fehlende oder doppelte Markierungen.

## Einstellungen (`einstellungen` in der Inhaltsdatei)

- `zielProzent: 70`: Level bestanden ab 70 % (wie im Original; bei 5 Nachrichten = 4 richtig)
- `bestehenNoetig: true`: ohne Ziel geht es nicht ins nächste Level
- `hinweiseUeberspringbar: true`: kleiner Link „Hinweise überspringen“
- `bestehensgrenze: 80`: Prozent für „passed“ (steht auch im Manifest)
- `interaktionenMelden: true`: jede Antwort als `cmi.interactions` (Auswertung pro Nachricht im LMS)

## Website (Cloudflare Workers)

`tools/bouw.py` schreibt zusätzlich `dist/site/index.html` (Deutsch unter `/`, weitere Sprachen unter `/<sprache>/`). `wrangler.jsonc` zeigt auf diesen Ordner, Worker-Name `phishing-challenge-opus`. In Cloudflare: Workers → Import a repository → dieses Repo, Build-Befehl leer, Deploy-Befehl `npx wrangler deploy`. Nach einer Änderung: bauen, `dist/site` mit committen, pushen.

Ohne LMS merkt sich die Website den Stand im Browser (localStorage).
