#!/usr/bin/env python3
"""Sicherheits- und Funktionsprüfung aller Pakete vor einer Lieferung.

    python3 tools/sicherheitscheck.py                 prüft dist/*.zip, Bericht in dist/pruefung/
    python3 tools/sicherheitscheck.py ORDNER_MIT_ZIPS [BERICHTORDNER]
    … --schnell                                       ohne Bildschirmfotos (nur Paket- und LMS-Prüfung)

Was geprüft wird (Punkte der Security-Checkliste):
  1  Dateien im Paket nur aus der erlaubten Liste; alle Formate einer Sprache enthalten dieselbe index.html
  2  Keine ladenden Verweise ins Internet (Schriften, Skripte, Bilder, CSS); Netzwerk-Aufrufe im Code aufgelistet
  3  Keine Schlüssel/Passwörter (gitleaks + eigene Muster)
  4  Alle Adressen, Links und QR-Codes aufgelistet (QR-Codes werden lokal ausgelesen, nichts wird geöffnet)
  5  Metadaten in Bildern; riskanter Code (eval, document.write …) gezählt
  6  Virenscan (ClamAV)
  7  Abgeschotteter Browser: alles außer dem eigenen Rechner ist gesperrt, jeder Verbindungsversuch wird notiert.
     Je Format ein kompletter Durchlauf mit nachgebautem LMS (SCORM 1.2, 2004 3rd/4th, xAPI) und Prüfung von
     Status, Punktzahl, Antworten und Zwischenstand; je Sprache Bildschirmfotos aller Seiten in drei Größen.
  8  SHA-256-Prüfsummen der Pakete

Braucht: Google Chrome, Python-Paket playwright, gitleaks, clamav, exiftool, zbar (brew install gitleaks clamav exiftool zbar).
Fehlt ein Werkzeug, wird der Punkt übersprungen und im Bericht als „nicht geprüft“ markiert.
"""
import base64
import datetime
import functools
import hashlib
import html
import http.server
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import threading
import zipfile

HIER = os.path.dirname(os.path.abspath(__file__))
P = os.path.dirname(HIER)
args = [a for a in sys.argv[1:] if not a.startswith('--')]
QUELLE = os.path.abspath(args[0]) if args else os.path.join(P, 'dist')
ZIEL = os.path.abspath(args[1]) if len(args) > 1 else os.path.join(P, 'dist', 'pruefung')
SCHNELL = '--schnell' in sys.argv
CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

ERLAUBT = {'index.html', 'imsmanifest.xml', 'tincan.xml'}
ERLAUBT_ENDUNG = ('.html', '.js', '.css', '.json', '.xml', '.xsd', '.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif',
                  '.mp3', '.m4a', '.ogg', '.wav', '.mp4', '.webm', '.vtt', '.woff2', '.woff')
# Kennungen, die nur als Name dienen und nie geladen werden
NUR_KENNUNG = ('http://www.w3.org/', 'http://www.imsproject.org/', 'http://www.imsglobal.org/', 'http://www.adlnet.org/',
               'http://adlnet.gov/expapi/', 'https://w3id.org/xapi/', 'http://projecttincan.com/',
               'https://phishing-challenge-opus.arnebenoist.workers.dev/xapi/')

ergebnisse = []        # (punkt, titel, status ok|warn|fehler|aus, details-html)
def melde(punkt, titel, status, details=''):
    ergebnisse.append((punkt, titel, status, details))
    zeichen = {'ok': 'OK    ', 'warn': 'PRÜFEN', 'fehler': 'FEHLER', 'aus': 'AUS   '}[status]
    print(f'  [{zeichen}] {punkt} {titel}')

def werkzeug(name):
    return shutil.which(name) or (f'/opt/homebrew/bin/{name}' if os.path.exists(f'/opt/homebrew/bin/{name}') else None)

def liste(eintraege, leer='–'):
    if not eintraege:
        return f'<p class="leer">{leer}</p>'
    return '<ul>' + ''.join(f'<li>{e}</li>' for e in eintraege) + '</ul>'

e = html.escape

# ---------- Pakete einlesen ----------
zips = sorted(f for f in os.listdir(QUELLE) if f.lower().endswith('.zip'))
if not zips:
    sys.exit(f'Keine ZIP-Dateien in {QUELLE}')
os.makedirs(ZIEL, exist_ok=True)
arbeit = tempfile.mkdtemp(prefix='pruefung-')
pakete = {}           # name → {pfad, sprache, format, ordner, dateien}
for z in zips:
    m = re.search(r'_([A-Z]{2})_(SCORM12|SCORM2004_3rd|SCORM2004_4th|SCORM2004|xAPI)\.zip$', z)
    ordner = os.path.join(arbeit, z[:-4])
    with zipfile.ZipFile(os.path.join(QUELLE, z)) as zf:
        namen = zf.namelist()
        for n in namen:      # keine Pfade nach außerhalb
            if n.startswith('/') or '..' in n.split('/'):
                sys.exit(f'{z}: verdächtiger Pfad {n}')
        zf.extractall(ordner)
    pakete[z] = {'pfad': os.path.join(QUELLE, z), 'sprache': m[1].lower() if m else '?', 'format': m[2] if m else '?',
                 'ordner': ordner, 'dateien': namen}
print(f'{len(pakete)} Pakete aus {QUELLE}')

# ---------- 1. Dateien ----------
fremd = []
for z, p in pakete.items():
    for n in p['dateien']:
        basis = n.split('/')[-1]
        if n.endswith('/'):
            continue
        if basis.startswith('.') or '__MACOSX' in n or not (basis in ERLAUBT or basis.lower().endswith(ERLAUBT_ENDUNG)):
            fremd.append(f'{e(z)}: <code>{e(n)}</code>')
melde('1', 'Nur erlaubte Dateien im Paket', 'fehler' if fremd else 'ok',
      liste(fremd, 'Alle Dateien sind Kursdateien (index.html + Manifest).'))
gleich, ungleich = [], []
for sprache in sorted({p['sprache'] for p in pakete.values()}):
    hashes = {}
    for z, p in pakete.items():
        if p['sprache'] == sprache:
            hashes[p['format']] = hashlib.sha256(open(os.path.join(p['ordner'], 'index.html'), 'rb').read()).hexdigest()[:12]
    (gleich if len(set(hashes.values())) == 1 else ungleich).append(f'{sprache.upper()}: ' + ', '.join(f'{k} {v}' for k, v in hashes.items()))
melde('1', 'Alle Formate einer Sprache haben denselben Kursinhalt', 'warn' if ungleich else 'ok',
      liste(ungleich or gleich) + '<p class="info">Gleicher Inhalt heißt: Inhalt und Darstellung müssen nur je Sprache geprüft werden, das LMS-Verhalten nur je Format.</p>')

# ---------- 2.–5. Inhalt der index.html (je Sprache einmal) ----------
je_sprache = {}
for z, p in pakete.items():
    je_sprache.setdefault(p['sprache'], p)
LADEND = [
    (r'''<(?:script|img|link|iframe|audio|video|source|embed|object|track|image|use)\b[^>]*?\s(?:src|href|srcset|poster|data|xlink:href)\s*=\s*["']\s*(?:https?:)?//[^"']+''', 'Element lädt externe Datei'),
    (r'''url\(\s*["']?\s*(?:https?:)?//[^)"']+''', 'CSS lädt externe Datei'),
    (r'''@import\s+(?:url\()?\s*["']?\s*(?:https?:)?//[^;"')]+''', 'CSS @import extern'),
    (r'fonts\.googleapis|fonts\.gstatic|use\.typekit|cdn\.jsdelivr|cdnjs\.cloudflare|unpkg\.com|googletagmanager|google-analytics|hotjar|facebook\.net', 'bekannter externer Dienst'),
]
NETZ = r'\b(fetch\s*\(|XMLHttpRequest|sendBeacon|new\s+WebSocket|new\s+EventSource|importScripts\s*\(|navigator\.serviceWorker)'
RISKANT = {'eval(': r'\beval\s*\(', 'new Function(': r'new\s+Function\s*\(', 'document.write(': r'document\.write\s*\(',
           'setTimeout mit Text': r'setTimeout\s*\(\s*["\']', 'postMessage': r'\.postMessage\s*\(', "addEventListener('message')": r'''addEventListener\(\s*['"]message['"]'''}
GEHEIM = [(r'AIza[0-9A-Za-z_\-]{35}', 'Google-API-Schlüssel'), (r'\bsk-[A-Za-z0-9]{20,}', 'OpenAI-Schlüssel'),
          (r'\bsk_[0-9a-f]{40,}', 'ElevenLabs-Schlüssel'), (r'xi-api-key', 'ElevenLabs-Kopfzeile'), (r'AKIA[0-9A-Z]{16}', 'AWS-Schlüssel'),
          (r'-----BEGIN [A-Z ]*PRIVATE KEY-----', 'privater Schlüssel'), (r'\bBearer\s+[A-Za-z0-9\-_.=]{16,}', 'Bearer-Token'),
          (r'''(?i)(?:passwor[dt]|api[_-]?key|secret|token)\s*[:=]\s*["'][^"']{6,}["']''', 'Passwort/Schlüssel im Code'),
          (r'eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}', 'JWT-Token')]

ladend, netz, riskant, geheim, adressen, qr, meta = [], [], {}, [], {}, [], []
for sprache, p in sorted(je_sprache.items()):
    text = open(os.path.join(p['ordner'], 'index.html'), encoding='utf-8', errors='replace').read()
    ohne_daten = re.sub(r'data:[a-z/+.-]+;base64,[A-Za-z0-9+/=]+', 'data:…', text)
    for muster, art in LADEND:
        for t in re.finditer(muster, ohne_daten, re.I):
            ladend.append(f'{sprache.upper()} – {art}: <code>{e(t.group(0)[:140])}</code>')
    if sprache == sorted(je_sprache)[0]:          # Code ist in allen Sprachen gleich: einmal auflisten
        for t in re.finditer(NETZ, ohne_daten):
            umfeld = ohne_daten[max(0, t.start() - 160):t.end() + 60]
            erwartet = 'X.endpoint' in umfeld or 'xAnfrage' in umfeld
            netz.append(('erwartet' if erwartet else 'PRÜFEN') + f': <code>{e(t.group(0))}</code> … <small>{e(" ".join(umfeld.split())[-160:])}</small>')
        for name, muster in RISKANT.items():
            n = len(re.findall(muster, ohne_daten))
            if n:
                riskant[name] = n
        riskant['innerHTML (Info)'] = len(re.findall(r'\.innerHTML\s*=|insertAdjacentHTML', ohne_daten))
    for muster, art in GEHEIM:
        for t in re.finditer(muster, ohne_daten):
            geheim.append(f'{sprache.upper()} – {art}: <code>{e(t.group(0)[:40])}…</code>')
    for t in re.finditer(r'https?://[^\s"\'<>`)\\]+', ohne_daten):
        u = t.group(0).rstrip('.,;:')
        if u.startswith(NUR_KENNUNG):
            continue
        adressen.setdefault(re.sub(r'^https?://([^/]+).*', r'\1', u), set()).add(sprache)
    # eingebettete Bilder: QR-Codes und Metadaten
    bilder = os.path.join(arbeit, f'bilder-{sprache}')
    os.makedirs(bilder, exist_ok=True)
    for i, t in enumerate(re.finditer(r'data:image/(png|jpeg|jpg|webp|gif);base64,([A-Za-z0-9+/=]+)', text)):
        open(os.path.join(bilder, f'bild{i}.{t.group(1)}'), 'wb').write(base64.b64decode(t.group(2)))
    if werkzeug('zbarimg'):
        from PIL import Image
        for f in sorted(os.listdir(bilder)):
            png = os.path.join(arbeit, 'qr-probe.png')           # zbar liest kein WebP
            try:
                bild = Image.open(os.path.join(bilder, f)).convert('RGBA')   # Transparenz auf Weiß, sonst sieht zbar nur Schwarz
                weiss = Image.new('RGBA', bild.size, 'white'); weiss.alpha_composite(bild); weiss.convert('RGB').save(png)
            except OSError:
                continue
            r = subprocess.run([werkzeug('zbarimg'), '-q', '--raw', png], capture_output=True, text=True)
            for zeile in r.stdout.strip().splitlines():
                qr.append(f'{sprache.upper()}: <code>{e(zeile)}</code>')
    if werkzeug('exiftool'):
        r = subprocess.run([werkzeug('exiftool'), '-j', '-q', '-Author', '-Artist', '-Creator', '-Copyright', '-GPS*', '-Comment',
                            '-UserComment', '-XPAuthor', '-OwnerName', '-SerialNumber', '-Make', '-Model', '-Software', bilder],
                           capture_output=True, text=True)
        try:
            for d in json.loads(r.stdout or '[]'):
                felder = {k: v for k, v in d.items() if k != 'SourceFile'}
                if felder:
                    meta.append(f'{sprache.upper()} {e(os.path.basename(d["SourceFile"]))}: ' + e(', '.join(f'{k}={v}' for k, v in felder.items())))
        except json.JSONDecodeError:
            pass

melde('2', 'Keine ladenden Verweise ins Internet', 'fehler' if ladend else 'ok',
      liste(ladend, 'Keine Schriften, Skripte, Bilder oder Stile von fremden Servern.'))
melde('2', 'Netzwerk-Aufrufe im Code', 'warn' if any(n.startswith('PRÜFEN') for n in netz) else 'ok',
      liste(netz, 'Keine.') + '<p class="info">„erwartet“ = xAPI-Schnittstelle: sendet nur, wenn das LMS beim Start eine LRS-Adresse mitgibt.</p>')
gitleaks_funde, gitleaks_ignoriert = [], []
if werkzeug('gitleaks'):
    for sprache, p in sorted(je_sprache.items()):
        bericht = os.path.join(arbeit, f'gitleaks-{sprache}.json')
        subprocess.run([werkzeug('gitleaks'), 'dir', p['ordner'], '--no-banner', '--report-format', 'json', '--report-path', bericht],
                       capture_output=True, text=True)
        try:
            for f in json.load(open(bericht)):
                geheimnis = f.get('Secret') or ''
                if re.fullmatch(r'[a-z]+(?:[A-Z][a-z]+)*', geheimnis):     # nur ein Name im Code (z. B. geraetLinkedin), kein Schlüssel
                    gitleaks_ignoriert.append(f'{sprache.upper()} – {e(f.get("RuleID", ""))}: <code>{e(geheimnis)}</code>')
                    continue
                gitleaks_funde.append(f'{sprache.upper()} – gitleaks {e(f.get("RuleID", ""))}: <code>{e((f.get("Match") or "")[:60])}</code>')
        except (OSError, json.JSONDecodeError):
            pass
alle_geheim = geheim + gitleaks_funde
melde('3', 'Keine Schlüssel oder Passwörter', 'fehler' if alle_geheim else ('ok' if werkzeug('gitleaks') else 'warn'),
      liste(alle_geheim, 'Nichts gefunden (eigene Muster' + (' + gitleaks' if werkzeug('gitleaks') else '; gitleaks nicht installiert') + ').') +
      (f'<p class="info">Ignoriert, weil nur ein Programmname: {", ".join(sorted(set(gitleaks_ignoriert)))}</p>' if gitleaks_ignoriert else ''))
adr = [f'<code>{e(d)}</code> <small>({", ".join(sorted(s)).upper()})</small>' for d, s in sorted(adressen.items())]
melde('4', 'Adressen im Kurs (Link-Ziele der Übungen, Absender)', 'warn',
      liste(adr) + '<p class="info">Diese Adressen werden nie geladen, sie stehen nur als Text oder Link-Ziel in den Übungen (Klick zeigt nur das Ziel). '
      'Bitte prüfen: Gehört jede Domain einer harmlosen oder bewusst fiktiven Übung?</p>')
melde('4', 'QR-Codes (lokal ausgelesen)', 'warn' if qr else ('ok' if werkzeug('zbarimg') else 'aus'),
      liste(qr, 'Kein lesbarer QR-Code: Abbildungen von QR-Codes im Kurs lassen sich nicht scannen, führen also nirgendwohin.' if werkzeug('zbarimg') else 'zbar nicht installiert.') + '<p class="info">Inhalt prüfen: darf auf keine echte gefährliche Seite führen.</p>')
melde('5', 'Metadaten in Bildern', 'warn' if meta else ('ok' if werkzeug('exiftool') else 'aus'),
      liste(meta, 'Keine Autoren-, Geräte- oder Ortsangaben.' if werkzeug('exiftool') else 'exiftool nicht installiert.'))
r_text = [f'<code>{e(k)}</code>: {v}×' for k, v in riskant.items()]
melde('5', 'Riskanter Code (für den Entwickler)', 'warn' if any(k != 'innerHTML (Info)' for k in riskant) else 'ok',
      liste(r_text) + '<p class="info">innerHTML ist im Kurs üblich (Texte werden vorher maskiert) und nur zur Info gezählt. '
      'Alles andere bitte von einem Entwickler ansehen lassen.</p>')

# ---------- 6. Virenscan ----------
if werkzeug('clamscan'):
    r = subprocess.run([werkzeug('clamscan'), '-r', '-i', '--no-summary', QUELLE], capture_output=True, text=True)
    funde = [l for l in r.stdout.splitlines() if l.strip()]
    melde('6', 'Virenscan (ClamAV)', 'fehler' if r.returncode == 1 else ('ok' if r.returncode == 0 else 'warn'),
          liste([e(f) for f in funde], 'Keine Funde.') if r.returncode in (0, 1) else f'<pre>{e(r.stderr[-400:])}</pre>')
else:
    melde('6', 'Virenscan (ClamAV)', 'aus', '<p>ClamAV nicht installiert: <code>brew install clamav</code></p>')

# ---------- 7. Abgeschotteter Browser ----------
class Leise(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass
server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Leise, directory=arbeit))
threading.Thread(target=server.serve_forever, daemon=True).start()
BASIS = f'http://127.0.0.1:{server.server_address[1]}'

STUB = r'''
(() => {
  const ver = %s; if (!ver) return;
  const daten = {}; const log = window.__lms = { ver, calls: [], daten };
  const f = (name, fn) => (...a) => { log.calls.push([name, ...a]); return fn(...a); };
  const api = ver === '2004' ? {
    Initialize: f('Initialize', () => 'true'), Terminate: f('Terminate', () => 'true'), Commit: f('Commit', () => 'true'),
    GetValue: f('GetValue', k => k === 'cmi.learner_name' ? 'Test, Anna' : (daten[k] || '')),
    SetValue: f('SetValue', (k, v) => { daten[k] = String(v); return 'true'; }),
    GetLastError: () => '0', GetErrorString: () => '', GetDiagnostic: () => '' } : {
    LMSInitialize: f('LMSInitialize', () => 'true'), LMSFinish: f('LMSFinish', () => 'true'), LMSCommit: f('LMSCommit', () => 'true'),
    LMSGetValue: f('LMSGetValue', k => k === 'cmi.core.student_name' ? 'Test, Anna' : (daten[k] || '')),
    LMSSetValue: f('LMSSetValue', (k, v) => { daten[k] = String(v); return 'true'; }),
    LMSGetLastError: () => '0', LMSGetErrorString: () => '', LMSGetDiagnostic: () => '' };
  if (ver === '2004') window.API_1484_11 = api; else window.API = api;
})();
'''
STILL = '*, *::before, *::after { animation-duration: 0s !important; animation-delay: 0s !important; transition: none !important; }'

# ein Schritt des Durchlauf-Bots: richtige Antwort geben, sonst den nächsten Knopf drücken
SCHRITT = r'''
(n) => {
  const I = window.PC_INHALT, U = I.ui;
  const sc = [...document.querySelectorAll('.screen:not(.raus)')].pop();
  if (!sc) return 'warte';
  document.querySelectorAll('.rein').forEach(x => x.classList.remove('rein'));
  const sichtbar = b => b && !b.disabled && b.offsetParent !== null;
  if (sc.classList.contains('s-finale')) return 'fertig';
  if (sc.classList.contains('s-profil')) {
    const name = sc.querySelector('#p-name'); if (name && !name.value) { name.value = 'Anna Test'; name.dispatchEvent(new Event('input', { bubbles: true })); }
    const firma = sc.querySelector('#p-firma'); if (firma && !firma.value) { firma.value = 'beispiel.de'; firma.dispatchEvent(new Event('input', { bubbles: true })); }
    const email = sc.querySelector('#p-email'); if (email && !email.value) { email.value = 'anna.test@beispiel.de'; email.dispatchEvent(new Event('input', { bubbles: true })); }
    const b = sc.querySelector('button[type=submit]'); if (sichtbar(b)) { b.click(); return 'profil'; } return 'warte';
  }
  const antwort = sc.querySelector('.antwort[data-antwort="phishing"]');
  if (sichtbar(antwort)) {
    const alle = I.levels.flatMap(l => l.nachrichten), m = alle[n];
    if (!m) return 'unbekannte Nachricht';
    sc.querySelector(`.antwort[data-antwort="${m.phishing ? 'phishing' : 'echt'}"]`).click();
    return 'antwort';
  }
  for (const s of ['.fb-skip', '.btn-weiter', '#le-weiter', '#n-weiter', '#i-los', '#b-los', '#s-los', '#s-weiter', 'button.btn-mint', 'button.btn-primaer']) {
    const b = [...document.querySelectorAll('.screen:not(.raus) ' + s)].find(sichtbar);
    if (b) { b.click(); return 'knopf ' + s; }
  }
  return 'warte';
}
'''


def durchlauf(browser, paket):
    """Ein kompletter Kursdurchlauf im abgeschotteten Browser mit nachgebautem LMS."""
    fmt = paket['format']
    ver = '"2004"' if fmt.startswith('SCORM2004') else ('"1.2"' if fmt == 'SCORM12' else 'null')
    gesperrt, aussagen, state = [], [], {}
    kontext = browser.new_context(viewport={'width': 1280, 'height': 800})
    kontext.add_init_script(STUB % ver)

    def netz(route):
        url = route.request.url
        if url.startswith(BASIS):
            return route.continue_()
        if url.startswith('http://lrs.invalid/'):            # nachgebautes LRS für xAPI, verlässt den Rechner nicht
            if '/statements' in url and route.request.method == 'POST':
                aussagen.append(json.loads(route.request.post_data or '{}'))
                return route.fulfill(status=200, body='["ok"]', headers={'Access-Control-Allow-Origin': '*'})
            if '/activities/state' in url:
                if route.request.method == 'PUT':
                    state['stand'] = route.request.post_data
                    return route.fulfill(status=204, headers={'Access-Control-Allow-Origin': '*'})
                if route.request.method == 'GET' and state.get('stand'):
                    return route.fulfill(status=200, body=state['stand'], headers={'Access-Control-Allow-Origin': '*'})
                return route.fulfill(status=404 if route.request.method == 'GET' else 204, headers={'Access-Control-Allow-Origin': '*'})
            return route.fulfill(status=204, headers={'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*',
                                                      'Access-Control-Allow-Methods': '*'})
        if not url.startswith('data:'):
            gesperrt.append(url)
        return route.abort()
    kontext.route('**/*', netz)
    seite = kontext.new_page()
    fehler = []
    seite.on('pageerror', lambda x: fehler.append(str(x)))
    url = f'{BASIS}/{os.path.basename(paket["ordner"])}/index.html'
    if fmt == 'xAPI':
        akteur = json.dumps({'name': 'Anna Test', 'mbox': 'mailto:anna.test@beispiel.de'})
        url += ('?endpoint=http%3A%2F%2Flrs.invalid%2Fxapi%2F&auth=Basic%20dGVzdA%3D%3D&registration=00000000-0000-4000-8000-000000000001'
                '&actor=' + __import__('urllib.parse').parse.quote(akteur))
    seite.goto(url)
    seite.add_style_tag(content=STILL)
    n, schritte, letzt = 0, 0, ''
    while schritte < 600:
        schritte += 1
        r = seite.evaluate(SCHRITT, n)
        if r == 'antwort':
            n += 1
        if r == 'fertig':
            break
        seite.wait_for_timeout(1500 if r == 'antwort' else 450)
        letzt = r
    fertig = r == 'fertig'
    seite.wait_for_timeout(1500)
    lms = seite.evaluate('window.__lms ? {ver: window.__lms.ver, daten: window.__lms.daten, calls: window.__lms.calls.map(c => c[0])} : null')
    seite.close()                     # löst pagehide aus → Terminate / LMSFinish / terminated
    kontext.close()
    befunde, ok = [], fertig and not gesperrt and not fehler
    befunde.append(f'Durchlauf: {"bis zum Abschluss" if fertig else "abgebrochen bei „" + e(letzt) + "“"}, {n} Antworten, {schritte} Schritte')
    if lms:
        d = lms['daten']
        if lms['ver'] == '2004':
            soll = {'cmi.completion_status': 'completed', 'cmi.success_status': 'passed', 'cmi.score.raw': '100'}
        else:
            soll = {'cmi.core.lesson_status': 'passed', 'cmi.core.score.raw': '100'}
        for k, v in soll.items():
            gut = d.get(k) == v
            ok &= gut
            befunde.append(f'{"✓" if gut else "✗"} <code>{k}</code> = {e(d.get(k, "–"))} (soll {v})')
        anzahl = len({k.split('.')[2] for k in d if k.startswith('cmi.interactions.') and k.endswith('.id')})
        ok &= anzahl == 15
        befunde.append(f'{"✓" if anzahl == 15 else "✗"} {anzahl} Antworten als Interaktion gemeldet (soll 15)')
        sd = len(d.get('cmi.suspend_data', ''))
        grenze = 4096 if lms['ver'] == '1.2' else 64000
        ok &= sd <= grenze
        befunde.append(f'{"✓" if sd <= grenze else "✗"} Zwischenstand {sd} Zeichen (Grenze {grenze})')
    elif fmt == 'xAPI':
        verben = [a.get('verb', {}).get('id', '').split('/')[-1] for a in aussagen]
        zahl = {v: verben.count(v) for v in set(verben)}
        for v, soll in [('initialized', 1), ('answered', 15), ('completed', 1), ('passed', 1)]:
            gut = zahl.get(v, 0) >= soll
            ok &= gut
            befunde.append(f'{"✓" if gut else "✗"} {v}: {zahl.get(v, 0)} (soll ≥ {soll})')
        punkte = next((a['result']['score']['raw'] for a in aussagen if a.get('verb', {}).get('id', '').endswith('passed')), None)
        befunde.append(f'{"✓" if punkte == 100 else "✗"} Punktzahl {punkte} (soll 100)')
        ok &= punkte == 100 and bool(state.get('stand'))
        befunde.append(f'{"✓" if state.get("stand") else "✗"} Zwischenstand in der State API gespeichert')
    befunde.append(('✗ ' if gesperrt else '✓ ') + f'{len(gesperrt)} Verbindungsversuche nach außen' +
                   (': ' + ', '.join(f'<code>{e(u[:90])}</code>' for u in gesperrt[:8]) if gesperrt else ''))
    if fehler:
        befunde.append('✗ JavaScript-Fehler: ' + '; '.join(e(x[:120]) for x in fehler[:5]))
    return ok, befunde


SEITEN = ['start', 'profil'] + [f'l{l}n{m}' for l in (1, 2, 3) for m in range(1, 6)] + ['k1', 'k2', 'ende']
GROESSEN = [('Telefon', 375, 812, True), ('Tablet', 768, 1024, True), ('Desktop', 1280, 800, False)]


def fotos(browser, paket, ordner):
    """Bildschirmfotos aller Seiten in drei Größen; misst dabei Überlauf. Gibt (Befunde, Kontaktbögen) zurück."""
    from PIL import Image, ImageDraw
    sprache = paket['sprache'].upper()
    befunde, boegen, gesperrt = [], [], []
    for gname, w, h, mobil in GROESSEN:
        kontext = browser.new_context(viewport={'width': w, 'height': h}, is_mobile=mobil, has_touch=mobil, device_scale_factor=1)
        kontext.route('**/*', lambda r: r.continue_() if r.request.url.startswith(BASIS) else (gesperrt.append(r.request.url), r.abort()))
        # Zeitgeber zehnmal schneller, damit Chat-Nachrichten und Zähler auf dem Foto schon fertig sind
        kontext.add_init_script('(() => { const st = window.setTimeout; window.setTimeout = (f, d, ...a) => st(f, (d || 0) / 10, ...a); })();')
        seite = kontext.new_page()
        bilder = []
        for s in SEITEN:
            seite.goto(f'{BASIS}/{os.path.basename(paket["ordner"])}/index.html?neu#{s}')
            seite.add_style_tag(content=STILL)
            seite.wait_for_timeout(2600 if s == 'ende' else 900)
            seite.evaluate("document.querySelectorAll('.rein').forEach(x => x.classList.remove('rein'))")
            seite.wait_for_timeout(150)
            ueber = seite.evaluate('''() => {
              const r = [];
              if (document.documentElement.scrollWidth > innerWidth + 1) r.push('Seite breiter als das Fenster');
              document.querySelectorAll('.screen:not(.raus) .g-betreff, .screen:not(.raus) .mail-von, .screen:not(.raus) .lage-titel, .screen:not(.raus) .btn')
                .forEach(x => { if (x.scrollWidth > x.clientWidth + 2 && getComputedStyle(x).overflow !== 'visible') r.push('abgeschnitten: ' + (x.className.split(' ')[0])); });
              return r; }''')
            for u in ueber:
                befunde.append(f'{sprache} {gname} <code>#{s}</code>: {e(u)}')
            datei = os.path.join(ordner, f'{sprache}_{gname}_{s}.png')
            seite.screenshot(path=datei)
            bilder.append((s, datei))
        kontext.close()
        # Kontaktbogen: alle Seiten einer Größe auf einem Blatt
        spalten = 5 if w < 900 else 4
        breite = 260 if w < 900 else 340
        hoehe = int(breite * h / w)
        bogen = Image.new('RGB', (spalten * (breite + 12) + 12, ((len(bilder) + spalten - 1) // spalten) * (hoehe + 34) + 12), '#101018')
        zeichnen = ImageDraw.Draw(bogen)
        for i, (s, datei) in enumerate(bilder):
            x, y = 12 + (i % spalten) * (breite + 12), 12 + (i // spalten) * (hoehe + 34)
            bogen.paste(Image.open(datei).convert('RGB').resize((breite, hoehe)), (x, y + 20))
            zeichnen.text((x, y + 4), f'#{s}', fill='#c9c4ec')
        name = f'Kontaktbogen_{sprache}_{gname}.jpg'
        bogen.save(os.path.join(ZIEL, name), quality=82)
        boegen.append(name)
    if gesperrt:
        befunde.append(f'{sprache}: {len(gesperrt)} Verbindungsversuche nach außen gesperrt: ' + ', '.join(f'<code>{e(u[:80])}</code>' for u in gesperrt[:5]))
    return befunde, boegen


boegen = []
try:
    from playwright.sync_api import sync_playwright
    with sync_playwright() as pw:
        browser = pw.chromium.launch(channel='chrome', headless=True, args=['--mute-audio'])
        sprache1 = sorted(je_sprache)[0]
        for z, p in sorted(pakete.items()):
            if p['sprache'] != sprache1:
                continue
            ok, befunde = durchlauf(browser, p)
            melde('7', f'Kompletter Durchlauf {p["format"]} ({p["sprache"].upper()}) im abgeschotteten Browser', 'ok' if ok else 'fehler', liste(befunde))
        if not SCHNELL:
            fotoordner = os.path.join(ZIEL, 'fotos')
            os.makedirs(fotoordner, exist_ok=True)
            alle = []
            for sprache, p in sorted(je_sprache.items()):
                b, bo = fotos(browser, p, fotoordner)
                alle += b
                boegen += bo
            melde('7', f'Darstellung: {len(SEITEN)} Seiten × 3 Größen × {len(je_sprache)} Sprachen', 'warn' if alle else 'ok',
                  liste(alle, 'Nichts abgeschnitten, keine Seite breiter als das Fenster, keine Verbindung nach außen.') +
                  '<p class="info">Kontaktbögen unten bitte kurz ansehen: stimmt die Darstellung in jeder Sprache?</p>')
        browser.close()
except ImportError:
    melde('7', 'Abgeschotteter Browser', 'aus', '<p>playwright nicht installiert: <code>python3 -m pip install --user playwright</code></p>')
server.shutdown()

# ---------- 8. Prüfsummen ----------
summen = []
for z, p in sorted(pakete.items()):
    s = hashlib.sha256(open(p['pfad'], 'rb').read()).hexdigest()
    summen.append(f'<code>{s}</code>  {e(z)}')
open(os.path.join(ZIEL, 'SHA256SUMS.txt'), 'w').write('\n'.join(re.sub(r'<[^>]+>', '', x).replace('  ', '  ') for x in summen) + '\n')
melde('8', 'SHA-256-Prüfsummen (für die Liefer-Mail)', 'ok', liste(summen) + '<p class="info">Auch als Datei SHA256SUMS.txt im Berichtsordner.</p>')

# ---------- Bericht ----------
jetzt = datetime.datetime.now().strftime('%d.%m.%Y %H:%M')
symbol = {'ok': '✅', 'warn': '🔎', 'fehler': '❌', 'aus': '⏸'}
zahl = {k: sum(1 for x in ergebnisse if x[2] == k) for k in symbol}
gesamt = 'Bestanden – bitte die 🔎-Punkte kurz ansehen' if not zahl['fehler'] else f'{zahl["fehler"]} Fehler – nicht liefern'
zeilen = ''.join(f'<section class="{s}"><h3>{symbol[s]} {e(t)} <small>Punkt {p}</small></h3>{d}</section>' for p, t, s, d in ergebnisse)
bilder = ''.join(f'<figure><figcaption>{e(b)}</figcaption><a href="{e(b)}"><img src="{e(b)}" loading="lazy"></a></figure>' for b in boegen)
open(os.path.join(ZIEL, 'Pruefbericht.html'), 'w', encoding='utf-8').write(f'''<!doctype html><html lang="de"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><title>Prüfbericht</title><style>
body{{font:16px/1.5 system-ui,-apple-system,Segoe UI,sans-serif;margin:0 auto;max-width:1100px;padding:24px 20px 60px;color:#1a1a2e;background:#fafaff}}
h1{{margin:0;color:#1b1257}} .kopf{{color:#5b5f73;margin:4px 0 20px}} .gesamt{{font-size:20px;font-weight:700;padding:14px 18px;border-radius:12px;background:{'#e6f7ef' if not zahl['fehler'] else '#fde7e7'};margin-bottom:22px}}
section{{background:#fff;border:1px solid #e3e1f0;border-left:6px solid #17b890;border-radius:10px;padding:10px 18px;margin:12px 0}}
section.warn{{border-left-color:#e8a317}} section.fehler{{border-left-color:#d6246e}} section.aus{{border-left-color:#999}}
h3{{margin:6px 0;font-size:17px}} h3 small{{color:#8a8aa0;font-weight:500;margin-left:8px}} code{{font-size:13px;background:#f1f0f8;padding:1px 5px;border-radius:4px;word-break:break-all}}
ul{{margin:6px 0;padding-left:20px}} li{{margin:3px 0}} .info,.leer{{color:#5b5f73;font-size:14px;margin:6px 0}}
figure{{margin:16px 0}} figure img{{width:100%;border-radius:8px;border:1px solid #ddd}} figcaption{{font-weight:600;margin-bottom:6px}}
</style></head><body><h1>Prüfbericht SCORM-/xAPI-Pakete</h1>
<p class="kopf">{jetzt} · {len(pakete)} Pakete aus <code>{e(QUELLE)}</code></p>
<div class="gesamt">{gesamt} &nbsp;·&nbsp; ✅ {zahl['ok']} &nbsp; 🔎 {zahl['warn']} &nbsp; ❌ {zahl['fehler']} &nbsp; ⏸ {zahl['aus']}</div>
{zeilen}<h2>Kontaktbögen</h2>{bilder or '<p class="leer">Keine (Option --schnell).</p>'}</body></html>''')
shutil.rmtree(arbeit, ignore_errors=True)
print(f'\n{gesamt}\nBericht: {os.path.join(ZIEL, "Pruefbericht.html")}')
sys.exit(1 if zahl['fehler'] else 0)
