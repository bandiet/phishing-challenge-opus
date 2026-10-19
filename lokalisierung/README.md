# Lokalisierung EN / FR / IT

Die 431 technischen Schlüssel im Blatt `Texte` sind die Quelle für EN (UK), FR (CH) und IT (CH). Landeswährungen und lokale Beispielprofile werden übernommen. Die Excel und die deutsche Vorlage bleiben unverändert.

## Neu erzeugen und bauen

Voraussetzungen: Python 3 und Node.js; keine zusätzlichen Python-Pakete.

```sh
python3 tools/lokalisiere.py
node tools/pruefen.js js/inhalt.en.js js/inhalt.de.js
node tools/pruefen.js js/inhalt.fr.js js/inhalt.de.js
node tools/pruefen.js js/inhalt.it.js js/inhalt.de.js
python3 tools/bouw.py en --2004
python3 tools/bouw.py fr --2004
python3 tools/bouw.py it --2004
```

Das Skript bricht bei fehlenden Übersetzungen, doppelten/ungültigen Schlüsseln, abweichenden deutschen Quelltexten, geänderten Platzhaltern oder Änderungen an HTML-Struktur und geschützten Attributen ab. Übersetzt werden auch `alt`-Texte.

## Lokalisierte Link-Ziele

Die Excel erlaubt lokalisierte `data-ziel`-Werte (z. B. HSBC/UBS statt Commerzbank). Dies weicht von der ursprünglichen Übergabe ab, die identische Link-Ziele verlangte. Damit die Nachrichten zur lokalen Bank und zu den übersetzten Dateinamen passen, werden die Excel-Werte übernommen.

`tools/lokalisiere.py` erzeugt dafür `lokalisierung/linkziele.json`. Die Node-Kontrolle lädt diese Liste automatisch und akzeptiert pro Sprache und Textfeld ausschließlich die dort aufgeführten Link-Ziele. Unerwartete Zieländerungen, fehlende Links und geänderte `data-h`-Markierungen bleiben Fehler. Die Liste immer zusammen mit den Sprachdateien neu erzeugen und versionieren. Bei direktem Aufruf der Prüffunktion ist die Liste der optionale dritte Parameter; ohne Liste bleibt der ursprüngliche strenge Vergleich aktiv.

## Ergebnisse

- `dist/Phishing_Challenge_Opus_{EN,FR,IT}_SCORM12.zip`
- `dist/Phishing_Challenge_Opus_{EN,FR,IT}_SCORM2004.zip`
- `dist/{en,fr,it}/index.html`: eigenständige Quiz-Dateien
- `dist/site/{en,fr,it}/index.html`: Website unter `/en/`, `/fr/`, `/it/`

Lokal: `python3 serve.py`, dann beispielsweise `http://127.0.0.1:8811/dist/site/en/index.html`. Der Simulator `test/lms.html` ist weiterhin auf Deutsch voreingestellt.

Die Inhaltsprüfung liefert 0 Fehler für alle drei Sprachen. EN hat 6, FR 11 und IT 9 Warnungen zu empfohlenen Textlängen oder Nachrichten mit nur einem Hinweis. Deutsch hat bereits 7 vergleichbare Warnungen. Die Übersetzungen wurden deshalb nicht eigenmächtig gekürzt.
