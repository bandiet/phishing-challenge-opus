/* ------------------------------------------------------------------
   Inhaltsprüfung – findet Fehler, bevor sie im LMS auffallen.
   Läuft im Browser (test/lms.html) und in Node (tools/bouw.py):
     node tools/pruefen.js js/inhalt.en.js [js/inhalt.de.js]
   Mit zweiter Datei wird eine Übersetzung gegen das Original geprüft:
   gleiche ids, gleiche Hinweise, gleiche Markierungen, keine fehlenden Texte.
   ------------------------------------------------------------------ */
(function (wurzel) {
  'use strict';

  const ARTEN = ['email', 'sms', 'whatsapp', 'teams', 'linkedin'];
  const HINWEIS = ['warn', 'ok', 'tipp'];
  const BEI = ['absender', 'anhang', 'banner', 'betreff'];
  const PLATZ = ['vorname', 'nachname', 'name', 'email', 'privat', 'firma', 'firmakurz', 'domain', 'tenant',
    'fake_doppel', 'fake_doppel_m', 'fake_tausch', 'fake_tausch_m', 'fake_glyph', 'fake_glyph_m', 'glyph_info',
    'fake_weg', 'fake_weg_m', 'fake_zusatz', 'fake_zusatz_m', 'fake_tld', 'fake_tld_m',
    'n', 'gesamt', 'ziel', 'badge', 'level', 'nr', 'richtig', 'grenze'];

  function pruefe(I, referenz, linkziele) {
    const fehler = [], warn = [];
    const F = (ort, text) => fehler.push(ort + ': ' + text);
    const W = (ort, text) => warn.push(ort + ': ' + text);
    if (!I || typeof I !== 'object') return { fehler: ['Inhalt fehlt (window.PC_INHALT)'], warnungen: [], info: {} };

    // Alle Texte einsammeln (für Platzhalter und leere Werte)
    function texte(o, pfad, fn) {
      if (typeof o === 'string') fn(o, pfad);
      else if (Array.isArray(o)) o.forEach((x, i) => texte(x, pfad + '[' + i + ']', fn));
      else if (o && typeof o === 'object') Object.keys(o).forEach(k => texte(o[k], pfad ? pfad + '.' + k : k, fn));
    }
    texte(I, '', (s, pfad) => {
      (s.match(/\{\{(\w+)\}\}/g) || []).forEach(p => {
        const k = p.slice(2, -2);
        if (!PLATZ.includes(k)) F(pfad, 'unbekannter Platzhalter ' + p);
      });
      if (/\{\{[^}]*$|^[^{]*\}\}/.test(s) && !/\{\{\w+\}\}/.test(s)) F(pfad, 'kaputter Platzhalter');
      if (!s.trim() && !/\.(adresse|info|groesse|kernTitel|lage)$|zeichen/.test(pfad)) W(pfad, 'leerer Text');
    });

    // HTML grob auf geschlossene Tags prüfen
    function htmlOk(html, ort) {
      ['mark', 'a', 'p', 'div', 'span', 'strong', 'b'].forEach(t => {
        const auf = (html.match(new RegExp('<' + t + '(\\s|>)', 'g')) || []).length;
        const zu = (html.match(new RegExp('</' + t + '>', 'g')) || []).length;
        if (auf !== zu) F(ort, `<${t}> ${auf}× geöffnet, ${zu}× geschlossen`);
      });
      if (/\shref=/.test(html)) F(ort, 'href gefunden – Links nur mit data-ziel, sonst navigiert der Klick wirklich');
      if (/<(script|iframe|link)\b/i.test(html)) F(ort, '<script>, <iframe> oder <link> sind in Nachrichten nicht erlaubt');
      (html.match(/<img\b[^>]*>/gi) || []).forEach(t => { if (!/src="(assets\/[\w.-]+\.(webp|png|jpe?g|svg)|data:image\/)/.test(t)) F(ort, 'Bilder nur aus assets/: ' + t.slice(0, 60)); });
    }

    const E = I.einstellungen || {};
    const ids = new Set();
    let anzahl = 0;
    const levels = I.levels || [];
    if (!levels.length) F('levels', 'keine Level');
    levels.forEach((lv, li) => {
      const L = `Level ${li + 1}`;
      ['kicker', 'titel', 'badge'].forEach(k => { if (!lv[k]) F(L, k + ' fehlt'); });
      const ms = lv.nachrichten || [];
      if (ms.length !== 5) W(L, ms.length + ' Nachrichten (geplant sind 5)');
      if ((E.zielProLevel || 0) > ms.length) F(L, 'zielProLevel ist größer als die Anzahl Nachrichten');
      const p = ms.filter(m => m.phishing === true).length, e = ms.filter(m => m.phishing === false).length;
      if (p < 2 || e < 1) W(L, `${p}× Phishing, ${e}× echt – unausgewogen`);
      ms.forEach((m, mi) => {
        anzahl++;
        const O = `${L} / Nachricht ${mi + 1} (${m.id || '?'})`;
        if (!m.id) F(O, 'id fehlt');
        else if (ids.has(m.id)) F(O, 'id doppelt'); else ids.add(m.id);
        if (!/^[a-z0-9-]+$/.test(m.id || '')) F(O, 'id nur mit a–z, 0–9 und Bindestrich (wird ans LMS gemeldet)');
        if (!ARTEN.includes(m.art)) F(O, 'art muss eine von ' + ARTEN.join(', ') + ' sein');
        if (typeof m.phishing !== 'boolean') F(O, 'phishing muss true oder false sein');
        ['titel', 'kern', 'zeit'].forEach(k => { if (!m[k]) F(O, k + ' fehlt'); });
        if (!m.von || !m.von.name) F(O, 'von.name fehlt');
        let html = '';
        if (m.art === 'email') {
          ['betreff', 'an', 'inhalt'].forEach(k => { if (!m[k]) F(O, k + ' fehlt'); });
          if (!m.von || !m.von.adresse) F(O, 'von.adresse fehlt');
          html = m.inhalt || '';
          htmlOk(html, O + ' inhalt');
        } else {
          if (!Array.isArray(m.nachrichten) || !m.nachrichten.length) F(O, 'nachrichten fehlen');
          (m.nachrichten || []).forEach((t, i) => htmlOk(t, O + ` nachrichten[${i}]`));
          html = (m.nachrichten || []).join('\n');
        }
        if ((m.lage || '').length > 230) W(O, `Situation ist ${m.lage.length} Zeichen lang (≤ 230 lesen sich besser)`);
        if ((m.kern || '').length > 170) W(O, `Kernsatz ist ${m.kern.length} Zeichen lang (≤ 170)`);
        if ((m.titel || '').length > 60) W(O, `Titel ist ${m.titel.length} Zeichen lang (≤ 60)`);
        if (!m.joker) W(O, 'joker-Tipp fehlt (der Joker bleibt bei dieser Nachricht wirkungslos)');
        else {
          if (m.joker.length > 140) W(O, `joker-Tipp ist ${m.joker.length} Zeichen lang (≤ 140)`);
          if (/phishing|\becht\b|gefälscht|betrug/i.test(m.joker)) W(O, 'joker-Tipp verrät womöglich die Antwort');
        }

        const hs = m.hinweise || [];
        if (hs.length < 2 || hs.length > 4) W(O, hs.length + ' Hinweise (2–4, am besten 3)');
        const hids = new Set();
        const markiert = (html.match(/data-h="([^"]+)"/g) || []).map(x => x.slice(8, -1));
        markiert.forEach((h, i) => { if (markiert.indexOf(h) !== i) F(O, `data-h="${h}" kommt doppelt vor`); });
        hs.forEach(h => {
          const H = O + ` Hinweis ${h.id}`;
          if (!h.id) F(H, 'id fehlt'); else if (hids.has(h.id)) F(H, 'id doppelt'); else hids.add(h.id);
          if (!HINWEIS.includes(h.art)) F(H, 'art muss warn, ok oder tipp sein');
          if (!h.titel) F(H, 'titel fehlt');
          if (!h.text) F(H, 'text fehlt');
          if ((h.text || '').length > 260) W(H, `Text ist ${h.text.length} Zeichen lang (≤ 260)`);
          if (h.bei) {
            if (!BEI.includes(h.bei)) F(H, 'bei muss ' + BEI.join(', ') + ' sein');
            if (h.bei === 'anhang' && !m.anhang) F(H, 'bei: anhang, aber die Nachricht hat keinen Anhang');
            if (h.bei === 'banner' && !m.extern) F(H, 'bei: banner, aber extern ist nicht gesetzt');
            if (h.bei === 'betreff' && m.art !== 'email') F(H, 'bei: betreff gibt es nur bei E-Mails');
            if (markiert.includes(h.id)) F(H, 'hat bei UND eine Markierung im Text – nur eins von beiden');
          } else if (!markiert.includes(h.id)) F(H, `keine Textstelle mit data-h="${h.id}" gefunden`);
        });
        markiert.forEach(h => { if (!hids.has(h)) F(O, `data-h="${h}" hat keinen Hinweis`); });
        if (m.phishing && !hs.some(h => h.art === 'warn')) W(O, 'Phishing ohne Warnsignal');
        if (m.phishing === false && hs.some(h => h.art === 'warn')) W(O, 'echte Nachricht mit Warnsignal – verwirrt leicht');
        (html.match(/data-ziel="([^"]+)"/g) || []).forEach(z => {
          const url = z.slice(11, -1).replace(/\{\{\w+\}\}/g, 'x');
          if (!/^https?:\/\/[^/\s]+/.test(url)) F(O, 'data-ziel ist keine vollständige URL: ' + url);
        });
      });
    });

    (I.nuggets || []).forEach((n, i) => {
      const N = `Sicherheitstipp ${i + 1}`;
      if (!(n.nachLevel >= 1 && n.nachLevel < levels.length)) F(N, 'nachLevel muss zwischen 1 und ' + (levels.length - 1) + ' liegen');
      if (!n.titel || !n.merke || !n.knopf) F(N, 'titel, merke oder knopf fehlt');
      if (!Array.isArray(n.folien) || !n.folien.length) F(N, 'folien fehlen');
      (n.folien || []).forEach((k, j) => {
        if (!k.titel || !k.text) F(N + ` Folie ${j + 1}`, 'titel oder text fehlt');
        if (!/^(assets\/[\w.-]+\.(webp|png|jpe?g|svg)|data:image\/)/.test(k.bild || '')) F(N + ` Folie ${j + 1}`, 'bild muss eine Datei in assets/ sein');
        if ((k.text || '').length > 300) W(N + ` Folie ${j + 1}`, `Text ist ${k.text.length} Zeichen lang (≤ 300)`);
      });
    });

    if (!I.firma || !I.firma.name || !I.firma.tld) F('firma', 'name und tld werden gebraucht');
    if (!I.person || !I.person.vorname) F('person', 'vorname wird gebraucht');

    // Übersetzung gegen das Original
    if (referenz) {
      const struktur = (a, b, pfad) => {
        if (typeof b === 'string') { if (typeof a !== 'string') F(pfad, 'Text fehlt in der Übersetzung'); return; }
        if (Array.isArray(b)) {
          if (!Array.isArray(a)) { F(pfad, 'Liste fehlt'); return; }
          if (a.length !== b.length && !/merksaetze|erwischt|durchschaut/.test(pfad)) W(pfad, `${a.length} statt ${b.length} Einträge`);
          b.forEach((x, i) => { if (i < a.length) struktur(a[i], x, pfad + '[' + i + ']'); });
          return;
        }
        if (b && typeof b === 'object') {
          if (!a || typeof a !== 'object') { F(pfad, 'Abschnitt fehlt'); return; }
          Object.keys(b).forEach(k => struktur(a[k], b[k], pfad ? pfad + '.' + k : k));
          Object.keys(a).forEach(k => { if (!(k in b)) W(pfad ? pfad + '.' + k : k, 'gibt es im Original nicht'); });
        }
      };
      struktur(I.ui, referenz.ui, 'ui');
      (referenz.nuggets || []).forEach((rn, i) => {
        const n = (I.nuggets || [])[i];
        if (!n) { F(`Sicherheitstipp ${i + 1}`, 'fehlt in der Übersetzung'); return; }
        if ((n.folien || []).length !== (rn.folien || []).length) F(`Sicherheitstipp ${i + 1}`, 'andere Anzahl Folien als im Original');
        (rn.folien || []).forEach((rf, j) => { const fo = (n.folien || [])[j]; if (fo && fo.bild !== rf.bild) W(`Sicherheitstipp ${i + 1} Folie ${j + 1}`, 'anderes Bild als im Original'); });
      });
      (referenz.levels || []).forEach((rl, li) => (rl.nachrichten || []).forEach((rm, mi) => {
        const m = ((I.levels || [])[li] || {}).nachrichten && I.levels[li].nachrichten[mi];
        const O = `Level ${li + 1} / Nachricht ${mi + 1}`;
        if (!m) { F(O, 'fehlt in der Übersetzung'); return; }
        if (m.id !== rm.id) F(O, `id ${m.id} statt ${rm.id}`);
        ['art', 'phishing', 'extern'].forEach(k => { if (m[k] !== rm[k]) F(O, k + ' weicht vom Original ab'); });
        const sig = x => (x.hinweise || []).map(h => h.id + ':' + h.art + ':' + (h.bei || '')).join(',');
        if (sig(m) !== sig(rm)) F(O, 'Hinweise (id/art/bei) weichen vom Original ab');
        const basis = `levels[${li}].nachrichten[${mi}]`;
        const zh = (x, lokal) => {
          const felder = x.inhalt ? [['inhalt', x.inhalt]] : (x.nachrichten || []).map((s, i) => [`nachrichten[${i}]`, s]);
          return felder.map(([feld, html]) => {
            const erlaubt = linkziele && linkziele[I.sprache] && linkziele[I.sprache][basis + '.' + feld];
            if (lokal && erlaubt) {
              const ziele = (html.match(/data-ziel="[^"]+"/g) || []).map(z => z.slice(11, -1));
              if (JSON.stringify(ziele) !== JSON.stringify(erlaubt)) F(O, 'Link-Ziele weichen von der Excel ab');
            }
            const muster = erlaubt ? /data-h="[^"]+"/g : /data-(h|ziel)="[^"]+"/g;
            return (html.match(muster) || []).sort().join(' ');
          }).join(' ');
        };
        if (zh(m, true) !== zh(rm, false)) F(O, 'Markierungen oder Link-Ziele weichen vom Original ab');
      }));
    }

    return {
      fehler, warnungen: warn,
      info: {
        level: levels.length, nachrichten: anzahl,
        phishing: levels.reduce((s, l) => s + (l.nachrichten || []).filter(m => m.phishing).length, 0),
        hinweise: levels.reduce((s, l) => s + (l.nachrichten || []).reduce((t, m) => t + (m.hinweise || []).length, 0), 0)
      }
    };
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = pruefe;
  else wurzel.PC_PRUEFEN = pruefe;

  // Kommandozeile: node tools/pruefen.js datei.js [referenz.js]
  if (typeof require !== 'undefined' && typeof module !== 'undefined' && require.main === module) {
    const fs = require('fs'), vm = require('vm');
    const lade = datei => { const w = {}; vm.runInNewContext(fs.readFileSync(datei, 'utf8'), { window: w }); return w.PC_INHALT; };
    const pfad = require('path').join(__dirname, '../lokalisierung/linkziele.json');
    const linkziele = fs.existsSync(pfad) ? JSON.parse(fs.readFileSync(pfad, 'utf8')) : null;
    const r = pruefe(lade(process.argv[2]), process.argv[3] ? lade(process.argv[3]) : null, linkziele);
    r.warnungen.forEach(x => console.log('  Warnung: ' + x));
    r.fehler.forEach(x => console.log('  FEHLER:  ' + x));
    console.log(`  ${r.info.level} Level, ${r.info.nachrichten} Nachrichten (${r.info.phishing} Phishing), ${r.info.hinweise} Hinweise – ` +
      `${r.fehler.length} Fehler, ${r.warnungen.length} Warnungen`);
    process.exit(r.fehler.length ? 1 : 0);
  }
})(typeof window !== 'undefined' ? window : this);
