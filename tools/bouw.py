#!/usr/bin/env python3
"""Baut die Phishing Challenge für LMS und Vorschau.

    python3 tools/bouw.py              Deutsch, SCORM 1.2
    python3 tools/bouw.py en           Englisch (braucht js/inhalt.en.js)
    python3 tools/bouw.py de --2004    zusätzlich ein SCORM-2004-Paket

Ergebnis in dist/:
    Phishing_Challenge_Opus_DE_SCORM12.zip   imsmanifest.xml + index.html, direkt im Zip-Wurzelverzeichnis
    de/index.html                         dieselbe Seite einzeln (zum Testen im Browser)
    artifact/index.html                   Seite ohne <html>/<head>/<body> (für die Claude-Vorschau)

Die index.html ist komplett eigenständig: CSS, JavaScript und Bilder sind eingebettet,
es gibt keine einzige externe Adresse. Genau das macht das Paket in jedem LMS gleich.
Vor dem Bauen wird der Inhalt geprüft (tools/pruefen.js); bei Fehlern bricht der Bau ab.
"""
import base64
import os
import re
import shutil
import subprocess
import sys
import zipfile

HIER = os.path.dirname(os.path.abspath(__file__))
P = os.path.dirname(HIER)
DIST = os.path.join(P, 'dist')

args = [a for a in sys.argv[1:] if not a.startswith('--')]
SPRACHE = (args[0] if args else 'de').lower()
MIT_2004 = '--2004' in sys.argv

inhalt_datei = os.path.join(P, 'js', f'inhalt.{SPRACHE}.js')
if not os.path.exists(inhalt_datei):
    sys.exit(f'Inhalt fehlt: js/inhalt.{SPRACHE}.js')


def lies(pfad):
    with open(os.path.join(P, pfad), encoding='utf-8') as f:
        return f.read()


# ---------- 1. Inhalt prüfen ----------
def finde_node():
    for kandidat in [shutil.which('node'),
                     '/Applications/Ableton Live 12 Suite.app/Contents/App-Resources/Max/Max.app/Contents/Resources/C74/packages/Node for Max/source/bin/osx/node/node']:
        if kandidat and os.path.exists(kandidat):
            return kandidat
    return None


node = finde_node()
if node:
    ref = [] if SPRACHE == 'de' else [os.path.join(P, 'js', 'inhalt.de.js')]
    print(f'Prüfe js/inhalt.{SPRACHE}.js' + (' gegen das deutsche Original' if ref else '') + ' …', flush=True)
    r = subprocess.run([node, os.path.join(HIER, 'pruefen.js'), inhalt_datei] + ref)
    if r.returncode != 0:
        sys.exit('Abbruch: Bitte erst die Fehler im Inhalt beheben.')
else:
    print('Hinweis: Node nicht gefunden – Inhalt bitte im Browser prüfen (test/lms.html zeigt den Prüfbericht).')

# ---------- 2. Eine eigenständige Seite bauen ----------
html = lies('index.html')
html = html.replace('<link rel="stylesheet" href="css/style.css">', '<style>\n' + lies('css/style.css') + '\n</style>')


def skript(m):
    pfad = m.group(1)
    if pfad == 'js/inhalt.de.js':
        pfad = f'js/inhalt.{SPRACHE}.js'
    code = lies(pfad).replace('</script', '<\\/script')
    return '<script>\n' + code + '\n</script>'


html = re.sub(r'<script src="(js/[^"]+)"></script>', skript, html)

TYPEN = {'png': 'image/png', 'webp': 'image/webp', 'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'svg': 'image/svg+xml'}


def bild(m):
    pfad = m.group(0)
    endung = pfad.rsplit('.', 1)[1].lower()
    with open(os.path.join(P, pfad), 'rb') as f:
        return f'data:{TYPEN[endung]};base64,' + base64.b64encode(f.read()).decode()


html = re.sub(r'assets/[\w.-]+\.(?:png|webp|jpe?g|svg)', bild, html)

# Sprache ins <html lang> schreiben
html = re.sub(r'<html lang="\w+">', f'<html lang="{SPRACHE}">', html, count=1)

# ---------- 3. Selbstkontrolle: nichts darf von außen nachladen ----------
probleme = []
for muster, was in [(r'<(?:script|img|iframe|audio|video|source)[^>]+src="(?!data:|\$\{)[^"]+"', 'src auf eine Datei/URL'),
                    (r'<link[^>]+href="(?!data:)', '<link> auf eine Datei/URL'),
                    (r'url\(\s*["\']?(?!data:|#)[a-z]+:', 'CSS-url() nach außen'),
                    (r'@import', 'CSS-@import'),
                    (r'fonts\.googleapis|cdn\.|unpkg|jsdelivr|cdnjs', 'CDN-Adresse')]:
    for treffer in re.findall(muster, html):
        probleme.append(f'{was}: {treffer[:80]}')
if 'assets/' in html:
    probleme.append('Verweis auf assets/ übrig geblieben')
if probleme:
    print('\n'.join('  FEHLER: ' + p for p in probleme))
    sys.exit('Abbruch: Die Seite ist nicht eigenständig.')

# ---------- 4. Ausgabe ----------
os.makedirs(DIST, exist_ok=True)
ziel = os.path.join(DIST, SPRACHE)
shutil.rmtree(ziel, ignore_errors=True)
os.makedirs(ziel)
with open(os.path.join(ziel, 'index.html'), 'w', encoding='utf-8') as f:
    f.write(html)

# Titel und Bestehensgrenze aus dem Inhalt lesen
inhalt = lies(f'js/inhalt.{SPRACHE}.js')
produkt = re.search(r"produkt:\s*'([^']+)'", inhalt).group(1)
grenze = int(re.search(r'bestehensgrenze:\s*(\d+)', inhalt).group(1))
titel = produkt                                              # wie im LMS angezeigt: „Phishing Challenge“
kennung = f'CCT_PHISHING_CHALLENGE_2026_{SPRACHE.upper()}'     # neue Kurs-ID (nicht die des alten Pakets)


def xml(s):
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


MANIFEST_12 = f'''<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="{kennung}" version="2.0"
          xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
          xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd
                              http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>1.2</schemaversion>
  </metadata>
  <organizations default="org_1">
    <organization identifier="org_1">
      <title>{xml(titel)}</title>
      <item identifier="item_1" identifierref="res_1">
        <title>{xml(titel)}</title>
        <adlcp:masteryscore>{grenze}</adlcp:masteryscore>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="res_1" type="webcontent" adlcp:scormtype="sco" href="index.html">
      <file href="index.html"/>
    </resource>
  </resources>
</manifest>
'''

MANIFEST_2004 = f'''<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="{kennung}" version="2.0"
          xmlns="http://www.imsglobal.org/xsd/imscp_v1p1"
          xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_v1p3"
          xmlns:adlseq="http://www.adlnet.org/xsd/adlseq_v1p3"
          xmlns:imsss="http://www.imsglobal.org/xsd/imsss"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://www.imsglobal.org/xsd/imscp_v1p1 imscp_v1p1.xsd
                              http://www.adlnet.org/xsd/adlcp_v1p3 adlcp_v1p3.xsd
                              http://www.imsglobal.org/xsd/imsss imsss_v1p0.xsd">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>2004 4th Edition</schemaversion>
  </metadata>
  <organizations default="org_1">
    <organization identifier="org_1">
      <title>{xml(titel)}</title>
      <item identifier="item_1" identifierref="res_1">
        <title>{xml(titel)}</title>
        <imsss:sequencing>
          <imsss:objectives>
            <imsss:primaryObjective objectiveID="bestanden" satisfiedByMeasure="true">
              <imsss:minNormalizedMeasure>{grenze / 100:.2f}</imsss:minNormalizedMeasure>
            </imsss:primaryObjective>
          </imsss:objectives>
        </imsss:sequencing>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="res_1" type="webcontent" adlcp:scormType="sco" href="index.html">
      <file href="index.html"/>
    </resource>
  </resources>
</manifest>
'''


def paket(name, manifest):
    pfad = os.path.join(DIST, name)
    with zipfile.ZipFile(pfad, 'w', zipfile.ZIP_DEFLATED) as z:
        z.writestr('imsmanifest.xml', manifest)          # im Wurzelverzeichnis, nicht in einem Unterordner
        z.write(os.path.join(ziel, 'index.html'), 'index.html')
    print(f'  {name}  ({os.path.getsize(pfad) // 1024} KB)')


print(f'Gebaut: dist/{SPRACHE}/index.html ({os.path.getsize(os.path.join(ziel, "index.html")) // 1024} KB, eigenständig)')
paket(f'Phishing_Challenge_Opus_{SPRACHE.upper()}_SCORM12.zip', MANIFEST_12)
if MIT_2004:
    paket(f'Phishing_Challenge_Opus_{SPRACHE.upper()}_SCORM2004.zip', MANIFEST_2004)

# Vorschau für die Claude-Artifact-Plattform: ohne Dokument-Gerüst
kopf = re.search(r'<head>(.*?)</head>', html, re.S).group(1)
kopf = re.sub(r'\s*<meta (charset|name="viewport")[^>]*>', '', kopf)
rumpf = re.search(r'<body>(.*?)</body>', html, re.S).group(1)
os.makedirs(os.path.join(DIST, 'artifact'), exist_ok=True)
with open(os.path.join(DIST, 'artifact', 'index.html'), 'w', encoding='utf-8') as f:
    f.write(kopf.strip() + '\n' + rumpf.strip() + '\n')
print('  artifact/index.html (Vorschau)')

# Website für Cloudflare Workers (wrangler.jsonc zeigt auf dist/site):
# Deutsch unter /, weitere Sprachen unter /<sprache>/
ikon = ('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 32 32%22%3E'
        '%3Crect width=%2232%22 height=%2232%22 rx=%228%22 fill=%22%230B003A%22/%3E'
        '%3Cpath d=%22M16 5 26 9v7c0 6-4 10-10 12C10 26 6 22 6 16V9l10-4Z%22 fill=%22%23FF4F86%22/%3E'
        '%3Cpath d=%22m11.5 16 3 3 6-6.5%22 stroke=%22%23fff%22 stroke-width=%222.6%22 fill=%22none%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/%3E%3C/svg%3E')
web = html.replace('<link rel="stylesheet"', '<link rel="icon" href="' + ikon + '">\n<link rel="stylesheet"', 1)
if '<link rel="icon"' not in web:
    web = web.replace('</title>', '</title>\n<link rel="icon" href="' + ikon + '">', 1)
site = os.path.join(DIST, 'site') if SPRACHE == 'de' else os.path.join(DIST, 'site', SPRACHE)
os.makedirs(site, exist_ok=True)
with open(os.path.join(site, 'index.html'), 'w', encoding='utf-8') as f:
    f.write(web)
print(f'  {os.path.relpath(site, P)}/index.html (Website)')
