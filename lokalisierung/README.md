# Lokalisierung (EN / FR / IT)

Das Deutsche (`js/inhalt.de.js`) ist die Vorlage. Die Übersetzungen stehen in `js/inhalt.en.js`, `.fr.js`, `.it.js` –
diese Dateien werden erzeugt, bitte nicht von Hand ändern.

## Ablauf
1. **Excel für die Übersetzung erzeugen:** `python3 tools/texte.py export` → `lokalisierung/Phishing_Challenge_Texte.xlsx`
   - kein HTML: ein Text pro Zeile, Mails in Absätze, Überschriften und Schaltflächen zerlegt
   - `[[…]]` = hervorgehobene Stelle (Hinweis-Markierung, Link, fett), Spalte „Hinweis zur Übersetzung“ sagt, welche
   - Link-Ziele und Bildbeschreibungen haben eigene Zeilen; Zeilenumbrüche sind echte Umbrüche in der Zelle
   - Spalte „Stand“: neu / v1 angepasst / v1 / Deutsch geändert
2. **Zurückgekommene Excel einlesen:** `python3 tools/texte.py import datei.xlsx`
   (einzelne Sprachen aus getrennten Dateien: `--en a.xlsx --fr b.xlsx --it c.xlsx`).
   Prüft Platzhalter, `[[…]]` und Link-Ziele je Zeile, baut die Sprachdateien und prüft sie mit `tools/pruefen.js`.
   Bei einem Fehler wird nichts geschrieben.
3. **Bauen:** `python3 tools/bouw.py en --2004` (ebenso `de`, `fr`, `it`).
4. **Test der Werkzeuge:** `python3 tools/texte.py test` (Excel raus und wieder rein = unverändert).

## Dateien
- `notizen.json` – Hinweise für die Übersetzung, „Stand“ je Zeile, Blatt „Lokalisierung“.
- `stand.json` – auf welchem deutschen Text jede Übersetzung beruht. Ändert sich das Deutsche,
  markiert der nächste Export die Zeile mit „Deutsch geändert“.
- Bilder mit Text: `assets/nugget-hover.<sprache>.webp`, `assets/nugget-domain.<sprache>.webp`.
  Liegt eine solche Datei vor, nimmt die Sprachfassung sie automatisch.

## Lokalisierung
EN = Vereinigtes Königreich, FR und IT = Schweiz (Banken, Firmen, Personen, Beträge, Domains – siehe Blatt „Lokalisierung“).
Werkzeuge: openpyxl (`pip install --user openpyxl`) und Node (wie für `tools/pruefen.js`).
