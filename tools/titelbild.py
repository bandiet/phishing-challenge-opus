#!/usr/bin/env python3
"""Titelbilder (Thumbnails, 16:9) für LMS-Plattformen in allen Sprachen.

    python3 tools/titelbild.py ZIELORDNER [Datum] [Version]

Braucht die gebauten Kurse (python3 tools/bouw.py <sprache>) und Google Chrome.
Gerendert wird tools/cover/index.html?lang=<sprache> in 1164 × 655 bei doppelter Pixeldichte (2328 × 1310 px).
Dateiname: <Datum>_Phishing-Challenge_Thumbnail_<SPRACHE>_Scheer-imc_<Version>.png
"""
import datetime
import functools
import http.server
import os
import subprocess
import sys
import threading

HIER = os.path.dirname(os.path.abspath(__file__))
P = os.path.dirname(HIER)
CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

if len(sys.argv) < 2:
    sys.exit(__doc__)
ziel = os.path.abspath(sys.argv[1])
datum = sys.argv[2] if len(sys.argv) > 2 else datetime.date.today().isoformat()
version = sys.argv[3] if len(sys.argv) > 3 else 'v1'
os.makedirs(ziel, exist_ok=True)

# eigener kleiner Server, damit Titelseite und Kurs-iframe denselben Ursprung haben
class Leise(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass
server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Leise, directory=P))
threading.Thread(target=server.serve_forever, daemon=True).start()
port = server.server_address[1]

for sprache in ('de', 'en', 'fr', 'it'):
    if not os.path.exists(os.path.join(P, 'dist', sprache, 'index.html')):
        print(f'  {sprache}: dist/{sprache}/index.html fehlt – erst bouw.py {sprache} laufen lassen'); continue
    datei = os.path.join(ziel, f'{datum}_Phishing-Challenge_Thumbnail_{sprache.upper()}_Scheer-imc_{version}.png')
    subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--hide-scrollbars', '--mute-audio',
                    '--window-size=1164,655', '--force-device-scale-factor=2', '--virtual-time-budget=7000',
                    f'--screenshot={datei}', f'http://127.0.0.1:{port}/tools/cover/index.html?lang={sprache}'],
                   capture_output=True)
    print(f'  {os.path.basename(datei)}' if os.path.exists(datei) else f'  {sprache}: fehlgeschlagen')
server.shutdown()
