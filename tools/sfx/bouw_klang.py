#!/usr/bin/env python3
"""Ausgewählte Aufnahmen (picks.json) → js/klang-daten.js (base64, AAC).

    python3 tools/sfx/bouw_klang.py

Pro Rolle: Stille am Anfang abschneiden, auf `max` Sekunden kürzen (weiches
Ausblenden), auf `level` dB RMS bringen (Spitze unter -0,5 dBFS), als kleines
Mono-AAC kodieren. Rollen mit "synth" bleiben live erzeugt (js/klang.js).
Die Aufnahmen stammen aus ElevenLabs (Flow „Phishing Challenge – SFX“) bzw.
aus der Quiz-Blitz-Sammlung (qb-…). Auswahl anhören: tools/sfx/klangwahl.html
"""
import base64, json, math, pathlib, struct, subprocess, tempfile, wave

hier = pathlib.Path(__file__).resolve().parent
wurzel = hier.parent.parent
wahl = {k: v for k, v in json.loads((hier / 'picks.json').read_text()).items() if not k.startswith('_')}
aus, summe = {}, 0
with tempfile.TemporaryDirectory() as tmp:
    tmp = pathlib.Path(tmp)
    for rolle, p in wahl.items():
        if p['datei'] == 'synth':
            continue
        roh = tmp / f'{rolle}-roh.wav'
        subprocess.run(['afconvert', '-f', 'WAVE', '-d', 'LEI16@44100', '-c', '1', str(hier / 'raw' / (p['datei'] + '.mp3')), str(roh)], check=True)
        with wave.open(str(roh)) as w:
            n, sr = w.getnframes(), w.getframerate()
            x = [v / 32768 for v in struct.unpack('<%dh' % n, w.readframes(n))]
        fen = int(sr * 0.005)
        hk = [math.sqrt(sum(v * v for v in x[i:i + fen]) / fen) for i in range(0, n - fen, fen)]
        spitze = max(hk) or 1e-9
        start = max(0, next(i for i, e in enumerate(hk) if e > spitze * 0.08) * fen - int(sr * 0.003))
        ende = min(n, start + int(sr * p['max'])) if p.get('max') else n
        y = x[start:ende]
        aus_n = min(len(y) // 3, int(sr * 0.05))
        for i in range(aus_n):
            y[-1 - i] *= i / aus_n
        for i in range(min(int(sr * 0.002), len(y))):
            y[i] *= i / (sr * 0.002)
        koerper = [v for v in y if abs(v) > 1e-4] or y
        rms = math.sqrt(sum(v * v for v in koerper) / len(koerper)) or 1e-9
        verst = min(10 ** (p['level'] / 20) / rms, 0.944 / (max(abs(v) for v in y) or 1e-9))
        y = [v * verst for v in y]
        wav = tmp / f'{rolle}.wav'
        with wave.open(str(wav), 'wb') as w:
            w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
            w.writeframes(struct.pack('<%dh' % len(y), *[max(-32767, min(32767, int(v * 32767))) for v in y]))
        m4a = tmp / f'{rolle}.m4a'
        subprocess.run(['afconvert', '-f', 'm4af', '-d', 'aac', '-b', '64000', str(wav), str(m4a)], check=True)
        daten = m4a.read_bytes()
        summe += len(daten)
        aus[rolle] = base64.b64encode(daten).decode()
        print(f'{rolle:9} {p["datei"]:14} {len(y) / sr:.2f}s  {20 * math.log10(verst):+5.1f} dB  {len(daten) / 1024:5.1f} kB')

js = ('/* klang-daten.js – erzeugt von tools/sfx/bouw_klang.py aus tools/sfx/picks.json.\n'
      '   Nicht von Hand ändern. Leer = alle Klänge live erzeugt (js/klang.js). */\n'
      'window.KLANG_DATEN = ' + json.dumps(aus, separators=(',', ':')) + ';\n')
(wurzel / 'js' / 'klang-daten.js').write_text(js)
print(f'js/klang-daten.js – {len(aus)} Aufnahmen, {summe / 1024:.0f} kB')
