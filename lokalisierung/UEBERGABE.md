# Übergabe: Phishing Challenge lokalisieren (EN / FR / IT)

Ziel: aus `lokalisierung/Phishing_Challenge_Texte_DE_EN_FR_IT.xlsx` drei Sprachdateien
`js/inhalt.en.js`, `js/inhalt.fr.js`, `js/inhalt.it.js` erzeugen und je Sprache SCORM + Website bauen.
**Im Quellcode arbeiten, nicht im SCORM-Paket** – das SCORM (`dist/…zip`) ist eine generierte Einzeldatei.

## Aufbau
- `js/inhalt.de.js` = ALLE Texte (Objekt `window.PC_INHALT`). Der Code (`js/app.js`) enthält keine Texte.
- Die Excel (Blatt „Texte“): Spalte D = Schlüssel = Pfad in `PC_INHALT`, z. B.
  `ui.joker.erster`, `levels[1].nachrichten[3].inhalt`, `nuggets[0].folien[2].punkte[1]`.
  Spalten F/G/H = EN / FR / IT.

## Vorgehen
1. Skript schreiben (z. B. `tools/lokalisiere.py` mit openpyxl, oder Node):
   - `js/inhalt.de.js` als Vorlage nehmen (Struktur, ids, `art`, `bei`, `phishing`, `einstellungen`, Bildpfade bleiben).
   - Für jede Zeile den Wert unter dem Schlüssel durch die Übersetzung ersetzen.
   - `sprache: 'en'` (bzw. `fr`, `it`) setzen; Datei als `js/inhalt.<sprache>.js` schreiben (gleiche Form wie die deutsche Datei: `window.PC_INHALT = {…};`).
   - Schlüssel `firma.*` / `person.*` sind Beispielprofil/Lokalisierung (z. B. `company.co.uk`, `John Smith`) – ebenfalls übernehmen.
2. Prüfen: `node tools/pruefen.js js/inhalt.en.js js/inhalt.de.js` → 0 Fehler (vergleicht ids, Hinweise, Markierungen, Platzhalter mit dem Deutschen).
3. Bauen: `python3 tools/bouw.py en --2004` (ebenso `fr`, `it`) → `dist/Phishing_Challenge_Opus_EN_SCORM12.zip` / `…SCORM2004.zip` und `dist/site/en/index.html`.
   Der Bau ersetzt `inhalt.de.js` automatisch durch die Sprachdatei und setzt `<html lang>`.
4. Testen: `python3 serve.py` (Port 8811), dann `http://127.0.0.1:8811/dist/en/index.html` oder LMS-Simulator `test/lms.html`.
   Test-Sprünge: `#l2n3` (Level 2, Nachricht 3), `#e1`, `#k1`, `#ende`; `?neu` setzt zurück.

## Regeln (wichtig)
- `{{platzhalter}}` unverändert lassen (`{{name}} {{vorname}} {{email}} {{domain}} {{tenant}} {{fake_…}} {{n}} {{gesamt}} …`).
- Mail-HTML (`…inhalt`, `…nachrichten[0]`): nur Text ändern; `<mark data-h="x">`, `data-h`, `data-ziel`, `class`, `style`, Bildpfade behalten. Jede `data-h`-Markierung muss erhalten bleiben (sonst meldet `pruefen.js` Fehler).
- Keine weiteren Codeänderungen nötig. Bekannte Kleinigkeit: `js/domains.js` erzeugt Täusch-Domains sprachunabhängig – passt.
- Klänge, Bilder, Layout sind sprachneutral (Bilder der Sicherheitstipps enthalten nur Domains).
- Website (Cloudflare): nach dem Bauen `dist/site` mit committen und pushen; Sprachen liegen unter `/en/`, `/fr/`, `/it/`.

## Offene Entscheidung des Auftraggebers
In der Excel stehen CEO-Mail (Betrag/IBAN) und Bank-SMS in Landeswährung (GBP bzw. CHF) – Zeilen mit Hinweis „bitte prüfen“.
