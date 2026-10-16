# Phishing Challenge – „Opus“ (CCT)

Intern „Opus“: die bewährten Inhalte der ursprünglichen Phishing Challenge (Nachrichten, Situationen, Warnsignale, Feedback, Sicherheitstipps 1:1) in der neuen Oberfläche. Korrekturen am Original sind in `js/inhalt.de.js` mit `// Korrektur:` markiert. Die Variante mit neuen Nachrichten liegt daneben in `PhishingChallenge/` (2.0).

Start (Symbole fliegen durch den Raum) → Briefing → Profil (Name, Firma, E-Mail; leer = Max Mustermann, firma.de) → Hallo → 3 Level mit je 5 Nachrichten, nach Level 1 und 2 ein Sicherheitstipp (Folie für Folie). Pro Nachricht: Situation lesen → **Phishing** oder **Echt** → Hinweise der Reihe nach; die aktive Stelle bekommt einen Rahmen, der Rest wird abgedunkelt. Serie (Flamme) oben rechts, Hacker bei Phishing-Nachrichten (ab 768 px Breite, 4,3 s wie im Original).

## Ordner

| Datei | Inhalt |
|---|---|
| `js/inhalt.de.js` | **Alle Texte**: Oberfläche, 15 Nachrichten, Hinweise, Sicherheitstipps, Standard-Profil, Einstellungen |
| `js/domains.js` | baut aus Name/Firma/E-Mail die Platzhalter und die Täusch-Domains (doppelt, vertauscht, rn/m, vv/w, cl/d, -it, andere Endung) – für jede Domain |
| `js/app.js` | Ablauf, Darstellung der Nachrichten, Hinweise mit Spotlight, Stempel, Hacker, Daumen, Konfetti |
| `js/lms.js` | SCORM 1.2 + 2004 (sucht das API selbst), ohne LMS: localStorage |
| `js/klang.js` | Geräusche, live erzeugt (keine Audiodateien) |
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
