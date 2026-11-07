/* ------------------------------------------------------------------
   LMS – SCORM 1.2, SCORM 2004 und xAPI in einem, mit lokalem Ersatz.
   Ohne LMS (Vorschau, Browser) wird der Stand im localStorage gemerkt.
   Alle Aufrufe sind abgesichert: Ein zickiges LMS darf die Challenge
   nie zum Absturz bringen.
   ------------------------------------------------------------------ */
window.LMS = (function () {
  'use strict';
  var api = null, ver = null, offen = false, beendet = false, start = Date.now();
  var LOKAL = 'pc2-stand-' + ((window.PC_INHALT && window.PC_INHALT.sprache) || 'de');
  var log = [];

  function suche(win) {
    var n = 0;
    while (win && n < 20) {
      try {
        if (win.API_1484_11) { ver = '2004'; return win.API_1484_11; }
        if (win.API) { ver = '1.2'; return win.API; }
      } catch (e) { /* fremder Ursprung */ }
      try {
        if (win.parent && win.parent !== win) win = win.parent; else break;
      } catch (e) { break; }
      n++;
    }
    return null;
  }
  function finde() {
    var a = suche(window);
    if (!a) { try { if (window.opener) a = suche(window.opener); } catch (e) {} }
    return a;
  }

  // Schlüssel je Version
  var K = {
    '1.2': {
      name: 'cmi.core.student_name', ort: 'cmi.core.lesson_location', daten: 'cmi.suspend_data',
      status: 'cmi.core.lesson_status', raw: 'cmi.core.score.raw', min: 'cmi.core.score.min', max: 'cmi.core.score.max',
      exit: 'cmi.core.exit', zeit: 'cmi.core.session_time'
    },
    '2004': {
      name: 'cmi.learner_name', ort: 'cmi.location', daten: 'cmi.suspend_data',
      status: 'cmi.completion_status', erfolg: 'cmi.success_status', raw: 'cmi.score.raw', min: 'cmi.score.min',
      max: 'cmi.score.max', skaliert: 'cmi.score.scaled', exit: 'cmi.exit', zeit: 'cmi.session_time'
    }
  };

  function hole(k) {
    if (!api) return '';
    try { return String((ver === '2004' ? api.GetValue(k) : api.LMSGetValue(k)) || ''); } catch (e) { return ''; }
  }
  function setze(k, v) {
    if (!api) return false;
    try {
      var ok = ver === '2004' ? api.SetValue(k, String(v)) : api.LMSSetValue(k, String(v));
      log.push([k, String(v).slice(0, 80), ok]);
      return ok === true || ok === 'true';
    } catch (e) { return false; }
  }
  function commit() {
    if (!api) return;
    try { if (ver === '2004') api.Commit(''); else api.LMSCommit(''); } catch (e) {}
  }

  function dauer12(ms) {
    var s = Math.floor(ms / 1000), h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60);
    s = s % 60;
    function z(x, n) { x = String(x); while (x.length < n) x = '0' + x; return x; }
    return z(h, 4) + ':' + z(m, 2) + ':' + z(s, 2);
  }
  function dauer2004(ms) {
    var s = Math.floor(ms / 1000);
    return 'PT' + Math.floor(s / 3600) + 'H' + Math.floor(s % 3600 / 60) + 'M' + (s % 60) + 'S';
  }

  var istFertig = false, interaktionen = 0;

  var X = null;   // xAPI-Verbindung (nur im xAPI-Paket gesetzt)
  /*XAPI*/
  /* ---------- xAPI (Tin Can) ----------
     Das LMS startet index.html mit endpoint, auth, actor, registration und activity_id in der Adresse
     (übliche Tin-Can-Startparameter). Aussagen gehen an <endpoint>statements, der Stand liegt in der State API.
     Nur im xAPI-Paket: bouw.py entfernt alles zwischen den XAPI-Markierungen aus den SCORM-Paketen. */
  var xWarte = null, xLaeuft = false, xStand = null;
  var XAPI_ID = 'https://phishing-challenge-opus.arnebenoist.workers.dev/xapi/' + ((window.PC_INHALT && window.PC_INHALT.sprache) || 'de');
  var XV = 'http://adlnet.gov/expapi/verbs/';

  function xStart() {
    var q, akteur;
    try { q = new URLSearchParams(location.search); } catch (e) { return null; }
    if (!q.get('endpoint') || !q.get('actor')) return null;
    try { akteur = JSON.parse(q.get('actor')); } catch (e) { return null; }
    // ältere LMS schicken Listen: {"name":["…"],"mbox":["mailto:…"],"account":[{accountServiceHomePage, accountName}]}
    ['name', 'mbox', 'mbox_sha1sum', 'openid'].forEach(function (k) { if (Array.isArray(akteur[k])) akteur[k] = akteur[k][0]; });
    if (Array.isArray(akteur.account)) akteur.account = akteur.account[0];
    if (akteur.account && akteur.account.accountName) {
      akteur.account = { homePage: akteur.account.homePage || akteur.account.accountServiceHomePage, name: akteur.account.name || akteur.account.accountName };
    }
    akteur.objectType = 'Agent';
    return { endpoint: q.get('endpoint').replace(/\/?$/, '/'), auth: q.get('auth') || '', akteur: akteur,
             registration: q.get('registration') || null, aktivitaet: q.get('activity_id') || XAPI_ID };
  }
  function xAnfrage(methode, pfad, daten, synchron) {
    var kopf = { 'X-Experience-API-Version': '1.0.3' };
    if (X.auth) kopf.Authorization = X.auth;
    if (daten !== undefined) kopf['Content-Type'] = 'application/json';
    var body = daten === undefined ? null : JSON.stringify(daten);
    if (synchron) {
      try {
        var r = new XMLHttpRequest();
        r.open(methode, X.endpoint + pfad, false);
        for (var k in kopf) r.setRequestHeader(k, kopf[k]);
        r.send(body);
        return r;
      } catch (e) { return null; }
    }
    // keepalive: die letzte Aussage kommt auch an, wenn das Fenster gerade geschlossen wird
    try { return fetch(X.endpoint + pfad, { method: methode, headers: kopf, body: body, keepalive: true, mode: 'cors' }).catch(function () {}); }
    catch (e) { return Promise.resolve(); }
  }
  function xStatePfad() {
    return 'activities/state?activityId=' + encodeURIComponent(X.aktivitaet) + '&agent=' + encodeURIComponent(JSON.stringify(X.akteur)) +
      '&stateId=pc-stand' + (X.registration ? '&registration=' + encodeURIComponent(X.registration) : '');
  }
  // Stand speichern: immer nur eine Anfrage gleichzeitig, die neueste gewinnt
  function xSpeichern() {
    if (xLaeuft || !xWarte) return;
    var d = xWarte; xWarte = null; xLaeuft = true;
    var p = xAnfrage('PUT', xStatePfad(), d);
    (p && p.then ? p : Promise.resolve()).then(function () { xLaeuft = false; xSpeichern(); });
  }
  function xKurs() {
    return { objectType: 'Activity', id: X.aktivitaet, definition: { type: 'http://adlnet.gov/expapi/activities/course',
      name: { 'de-DE': 'Phishing Challenge' } } };
  }
  function xAussage(verb, ergebnis, objekt) {
    var a = { actor: X.akteur, verb: { id: XV + verb, display: { 'en-US': verb } }, object: objekt || xKurs(), timestamp: new Date().toISOString() };
    if (ergebnis) a.result = ergebnis;
    a.context = { contextActivities: objekt ? { parent: [{ id: X.aktivitaet }] } : {} };
    if (X.registration) a.context.registration = X.registration;
    log.push(['xapi', verb, JSON.stringify(ergebnis || {}).slice(0, 80)]);
    xAnfrage('POST', 'statements', a);
  }
  var xApi = {
    init: function () {
      var r = xAnfrage('GET', xStatePfad(), undefined, true);
      if (r && r.status === 200 && r.responseText) {
        try { var d = JSON.parse(r.responseText); xStand = d.s || null; istFertig = !!d.b; } catch (e) {}
      }
      xAussage('initialized');
      return true;
    },
    name: function () { return String(X.akteur.name || ''); },
    laden: function () { return xStand; },
    speichern: function (stand) { xStand = stand; xWarte = { s: stand, b: istFertig }; xSpeichern(); },
    loeschen: function () { xStand = null; xAnfrage('DELETE', xStatePfad()); },
    interaktion: function (id, antwort, richtigeAntwort, korrekt) {
      xAussage('answered', { response: antwort, success: !!korrekt }, {
        objectType: 'Activity', id: X.aktivitaet + '/nachricht/' + encodeURIComponent(id),
        definition: { type: 'http://adlnet.gov/expapi/activities/cmi.interaction', interactionType: 'choice',
          name: { 'de-DE': id }, correctResponsesPattern: [richtigeAntwort],
          choices: [{ id: 'phishing', description: { 'de-DE': 'Phishing' } }, { id: 'echt', description: { 'de-DE': 'Echt' } }] }
      });
    },
    fortschritt: function (anteil) {
      xAussage('progressed', { extensions: { 'https://w3id.org/xapi/cmi5/result/extensions/progress': Math.round(Math.max(0, Math.min(1, anteil)) * 100) } });
    },
    abschliessen: function (prozent, bestanden) {
      var p = Math.round(prozent), wert = { scaled: p / 100, raw: p, min: 0, max: 100 };
      if (!(istFertig && !bestanden)) {
        xAussage('completed', { completion: true, score: wert });
        xAussage(bestanden ? 'passed' : 'failed', { success: !!bestanden, completion: true, score: wert });
      }
      if (bestanden) istFertig = true;
      xWarte = { s: xStand, b: istFertig }; xSpeichern();
      return true;
    },
    beenden: function () {
      if (beendet) return;
      beendet = true;
      var s = Math.floor((Date.now() - start) / 1000);
      xAussage('terminated', { duration: 'PT' + Math.floor(s / 3600) + 'H' + Math.floor(s % 3600 / 60) + 'M' + (s % 60) + 'S' });
    }
  };
  // Jede öffentliche Funktion: bei xAPI an xApi weiterreichen, sonst SCORM
  function weiter(name, scorm) {
    return function () { return X ? xApi[name].apply(null, arguments) : scorm.apply(null, arguments); };
  }
  /*/XAPI*/

  var lms = {
    log: log,
    init: function () {
      api = finde();
      if (!api) {
        /*XAPI*/ X = xStart(); if (X) return xApi.init(); /*/XAPI*/
        return false;
      }
      try {
        var r = ver === '2004' ? api.Initialize('') : api.LMSInitialize('');
        offen = r === true || r === 'true';
      } catch (e) { offen = false; }
      if (!offen) { api = null; return false; }
      var k = K[ver];
      var st = hole(k.status);
      istFertig = /passed|completed/.test(st) || (ver === '2004' && hole(k.erfolg) === 'passed');
      if (!istFertig) {
        if (ver === '2004') setze(k.status, 'incomplete');
        else if (st === '' || st === 'not attempted' || st === 'unknown') setze(k.status, 'incomplete');
      }
      setze(k.exit, 'suspend');
      try { interaktionen = parseInt(hole('cmi.interactions._count'), 10) || 0; } catch (e) {}
      commit();
      return true;
    },
    aktiv: function () { return !!api || !!X; },
    version: function () { return X ? 'xapi' : ver; },

    // "Nachname, Vorname" → "Vorname Nachname"
    name: function () {
      var roh = hole(api ? K[ver].name : '').trim();
      if (!roh || roh === 'null' || roh === 'undefined') return '';
      if (roh.indexOf(',') > -1) {
        var t = roh.split(',');
        return ((t[1] || '').trim() + ' ' + (t[0] || '').trim()).trim();
      }
      return roh;
    },

    laden: function () {
      var roh = '';
      if (api) roh = hole(K[ver].daten);
      else { try { roh = localStorage.getItem(LOKAL) || ''; } catch (e) {} }
      if (!roh) return null;
      try { return JSON.parse(roh); } catch (e) { return null; }
    },
    speichern: function (stand, ort) {
      var s = JSON.stringify(stand);
      if (api) {
        setze(K[ver].daten, s);
        if (ort) setze(K[ver].ort, ort);
        commit();
      } else {
        try { localStorage.setItem(LOKAL, s); } catch (e) {}
      }
    },
    loeschen: function () {
      if (api) { setze(K[ver].daten, ''); commit(); }
      else { try { localStorage.removeItem(LOKAL); } catch (e) {} }
    },

    // Eine Antwort als Interaktion (für Auswertungen im LMS)
    interaktion: function (id, antwort, richtigeAntwort, korrekt) {
      if (!api) return;
      var n = interaktionen++, p = 'cmi.interactions.' + n + '.';
      setze(p + 'id', id);
      setze(p + 'type', 'choice');
      // SCORM 1.2 erlaubt bei choice nur einzelne Zeichen (0–9, a–z): p = Phishing, e = echt
      var kurz = function (w) { return ver === '2004' ? w : (w === 'phishing' ? 'p' : 'e'); };
      setze(p + 'correct_responses.0.pattern', kurz(richtigeAntwort));
      if (ver === '2004') {
        setze(p + 'learner_response', antwort);
        setze(p + 'result', korrekt ? 'correct' : 'incorrect');
        setze(p + 'timestamp', new Date().toISOString().slice(0, 19));
      } else {
        setze(p + 'student_response', kurz(antwort));
        setze(p + 'result', korrekt ? 'correct' : 'wrong');
        setze(p + 'time', new Date().toTimeString().slice(0, 8));
      }
      commit();
    },

    // Fortschritt 0…1 (z. B. bestandene Level / alle Level). Nur SCORM 2004 hat dafür ein Feld.
    fortschritt: function (anteil) {
      if (!api || ver !== '2004') return;
      setze('cmi.progress_measure', String(Math.round(Math.max(0, Math.min(1, anteil)) * 100) / 100));
      commit();
    },

    // Ende der Challenge: Punktzahl + Status
    abschliessen: function (prozent, bestanden) {
      if (!api) return false;
      var k = K[ver], p = Math.round(prozent);
      // Ein früheres "passed" nie verschlechtern (z. B. nach "Nochmal spielen")
      if (!(istFertig && !bestanden)) {
        setze(k.min, '0'); setze(k.max, '100'); setze(k.raw, String(p));
        if (ver === '2004') {
          setze(k.skaliert, String(p / 100));
          setze(k.status, 'completed');
          setze(k.erfolg, bestanden ? 'passed' : 'failed');
        } else {
          setze(k.status, bestanden ? 'passed' : 'failed');
        }
      }
      if (bestanden) istFertig = true;
      setze(k.exit, ver === '2004' ? 'normal' : '');
      commit();
      return true;
    },

    beenden: function () {
      if (!api || beendet) return;
      beendet = true;
      var k = K[ver], ms = Date.now() - start;
      setze(k.zeit, ver === '2004' ? dauer2004(ms) : dauer12(ms));
      commit();
      try { if (ver === '2004') api.Terminate(''); else api.LMSFinish(''); } catch (e) {}
    }
  };
  /*XAPI*/ ['name', 'laden', 'speichern', 'loeschen', 'interaktion', 'fortschritt', 'abschliessen', 'beenden'].forEach(function (n) { lms[n] = weiter(n, lms[n]); }); /*/XAPI*/
  return lms;
})();
