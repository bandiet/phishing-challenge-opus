/* ------------------------------------------------------------------
   Phishing Challenge (intern: Opus) – Ablauf
   Start → Briefing → Profil → Hallo →
   (Level-Start → 5 Nachrichten → Auswertung → Sicherheitstipp) ×3 → Ergebnis
   Eine Nachricht: Situation lesen → Phishing/Echt → Ergebnis (Stempel,
   Serie, Hacker nacheinander) → „Details anzeigen“ → Hinweise der Reihe
   nach; die aktive Stelle bekommt einen Rahmen, der Rest wird dunkler.
   Joker (für eine Serie verdient) zeigen vor der Antwort einen Tipp.
   Test-Sprünge: #start #profil #l2 (Level-Start) #l2n3 (Nachricht)
   #e1 (Auswertung) #k1 (Sicherheitstipp) #ende – ?neu löscht den Stand.
   ------------------------------------------------------------------ */
(function () {
  'use strict';

  const I = window.PC_INHALT, U = I.ui, E = I.einstellungen, K = window.Klang, LMS = window.LMS, D = window.PC_DOMAIN;
  const LV = I.levels, N_LV = LV.length;
  const app = document.getElementById('app');
  const buehne = document.getElementById('buehne');

  /* ================= Helfer ================= */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const warte = ms => new Promise(r => setTimeout(r, ms));
  const ruhig = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const T = ms => (ruhig ? 0 : ms);
  const maus = window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches;
  const summe = a => a.reduce((x, y) => x + y, 0);
  function bau(html) {
    const t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  // Platzhalter füllen; Werte in V sind bereits HTML-sicher
  const V = {};
  function f(text, werte) {
    return String(text == null ? '' : text).replace(/\{\{(\w+)\}\}/g, (m, k) =>
      werte && k in werte ? werte[k] : k in V ? V[k] : m);
  }

  const ICO = {
    pfeil: '<svg class="ico pfeil" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    schildWarn: '<svg class="ico" viewBox="0 0 24 24"><path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6L12 3Z"/><path d="M12 8.5v4.2M12 15.8h.01"/></svg>',
    schildCheck: '<svg class="ico" viewBox="0 0 24 24"><path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6L12 3Z"/><path d="m8.6 12 2.4 2.4 4.4-4.9"/></svg>',
    pin: '<svg class="ico" viewBox="0 0 24 24"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.3"/></svg>',
    maus: '<svg class="ico" viewBox="0 0 24 24"><path d="M5.5 3.5 18 10.7l-5.6 1.6-2.9 5.2-4-14Z"/></svg>',
    finger: '<svg class="ico" viewBox="0 0 24 24"><path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V11m0-1.5a1.5 1.5 0 0 1 3 0V12m0-1a1.5 1.5 0 0 1 3 0v3.5a6.5 6.5 0 0 1-6.5 6.5h-.6a6 6 0 0 1-4.6-2.2L4.6 15a1.6 1.6 0 0 1 2.5-2L9 15"/></svg>',
    link: '<svg class="ico" viewBox="0 0 24 24"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>',
    mail: '<svg class="ico" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.5 7 8.5 6 8.5-6"/></svg>',
    ziel: '<svg class="ico" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/></svg>',
    orden: '<svg class="ico" viewBox="0 0 24 24"><path d="M12 3 19 6v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z"/><path d="m9.5 11.5 1.8 1.8 3.4-3.6"/></svg>',
    play: '<svg class="ico" viewBox="0 0 24 24"><path d="M8 5.5v13l10.5-6.5L8 5.5Z" fill="currentColor"/></svg>',
    chevron: '<svg class="ico h-chev" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>',
    check: '<svg class="ico" viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    kreuz: '<svg class="ico" viewBox="0 0 24 24"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/></svg>',
    warn: '<svg class="ico" viewBox="0 0 24 24"><path d="M12 4 2.8 19.5h18.4L12 4Z"/><path d="M12 10v4M12 17h.01"/></svg>',
    birne: '<svg class="ico" viewBox="0 0 24 24"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3Z"/></svg>',
    nochmal: '<svg class="ico" viewBox="0 0 24 24"><path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3L4.5 9"/><path d="M4.5 4.5V9H9"/></svg>',
    person: '<svg class="ico" viewBox="0 0 24 24"><circle cx="12" cy="9" r="3.6"/><path d="M5.5 19.5a6.5 6.5 0 0 1 13 0"/></svg>',
    zurueck: '<svg class="ico" viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>',
    kamera: '<svg class="ico" viewBox="0 0 24 24"><rect x="3" y="7" width="12" height="10" rx="2"/><path d="m15 11 6-3v8l-6-3"/></svg>',
    telefon: '<svg class="ico" viewBox="0 0 24 24"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/></svg>',
    hWarn: '<svg class="ico" viewBox="0 0 24 24"><path d="M12 4 2.8 19.5h18.4L12 4Z"/><path d="M12 10v4M12 17h.01"/></svg>',
    hOk: '<svg class="ico" viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    hTipp: '<svg class="ico" viewBox="0 0 24 24"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3Z"/></svg>',
    schutz: '<svg class="ico" viewBox="0 0 24 24"><path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6L12 3Z"/></svg>',
    schloss: '<svg class="ico" viewBox="0 0 24 24"><rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/></svg>',
    at: '<svg class="ico" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.8"/><path d="M15.8 12v1.4a2.6 2.6 0 0 0 5.2 0V12a9 9 0 1 0-3.6 7.2"/></svg>',
    status: '<svg class="ps-ico" viewBox="0 0 42 12"><g fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="6" width="3" height="6" rx="1"/><rect x="10" y="3.5" width="3" height="8.5" rx="1"/><rect x="15" y="1" width="3" height="11" rx="1"/><rect x="24" y="1.5" width="15" height="9" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.2"/><rect x="26" y="3.5" width="10" height="5" rx="1.2"/><rect x="40" y="4.5" width="1.6" height="3" rx=".8"/></g></svg>'
  };

  // Größere, plastische Symbole im Stil der Original-Challenge
  const BILD = {
    schild: `<svg viewBox="0 0 120 140" aria-hidden="true"><defs><linearGradient id="bsg" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="#FF6F9C"/><stop offset="1" stop-color="#D0124F"/></linearGradient></defs>
      <path d="M60 6 108 24v40c0 34-21 58-48 70C33 122 12 98 12 64V24L60 6Z" fill="url(#bsg)"/>
      <path d="M60 15 99 30v34c0 28-16 48-39 59" fill="none" stroke="#fff" stroke-opacity=".32" stroke-width="4" stroke-linecap="round"/>
      <path d="M46 64v-9a14 14 0 0 1 28 0v9" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round"/>
      <rect x="38" y="62" width="44" height="34" rx="8" fill="#fff"/><circle cx="60" cy="76" r="5" fill="#D0124F"/><rect x="57.5" y="78" width="5" height="10" rx="2.5" fill="#D0124F"/></svg>`,
    postfach: `<svg viewBox="0 0 140 112" aria-hidden="true"><defs><linearGradient id="bpg" x1="0" y1="0" x2=".4" y2="1"><stop offset="0" stop-color="#FF6FA4"/><stop offset="1" stop-color="#E0186A"/></linearGradient></defs>
      <rect x="8" y="22" width="112" height="80" rx="14" fill="url(#bpg)"/><path d="M14 32l43 32a12 12 0 0 0 14 0l43-32" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="118" cy="24" r="18" fill="#17FFC0" stroke="#160B4A" stroke-width="4"/><path d="M118 15v11M118 31.5v.5" stroke="#00261C" stroke-width="5" stroke-linecap="round"/></svg>`,
    level: `<svg viewBox="0 0 120 120" aria-hidden="true"><defs><linearGradient id="blg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FF4F86"/><stop offset="1" stop-color="#8F2BC9"/></linearGradient>
      <linearGradient id="ble" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6A86FF"/><stop offset="1" stop-color="#3B3FD8"/></linearGradient></defs>
      <rect width="120" height="120" rx="30" fill="url(#blg)"/><rect x="33" y="20" width="54" height="56" rx="8" fill="#fff"/>
      <path d="M60 29 75 55H45Z" fill="#F43F5E" stroke="#F43F5E" stroke-width="5" stroke-linejoin="round"/><path d="M60 37v9M60 50.5v.5" stroke="#fff" stroke-width="4.5" stroke-linecap="round"/>
      <path d="M22 58l38 26 38-26v34a8 8 0 0 1-8 8H30a8 8 0 0 1-8-8Z" fill="url(#ble)"/><path d="M22 92l28-18M98 92 70 74" stroke="#fff" stroke-opacity=".25" stroke-width="3"/></svg>`,
    haken: `<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="30" fill="#2B2963" stroke="#4B47A0" stroke-width="2"/><circle cx="38" cy="15" r="4" fill="none" stroke="#FF8278" stroke-width="4"/>
      <path d="M38 19v18a10 10 0 0 1-20 0v-4l6 5" fill="none" stroke="#FF8278" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    warnung: `<svg viewBox="0 0 64 58" aria-hidden="true"><path d="M32 6 58 52H6Z" fill="#FFCF4A" stroke="#FFCF4A" stroke-width="8" stroke-linejoin="round"/><path d="M32 22v14M32 43v.5" stroke="#3B2B00" stroke-width="6" stroke-linecap="round"/></svg>`,
    qr: `<svg viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="14" fill="#fff"/><g fill="#1B1257"><rect x="9" y="9" width="16" height="16" rx="3"/><rect x="39" y="9" width="16" height="16" rx="3"/><rect x="9" y="39" width="16" height="16" rx="3"/>
      <rect x="31" y="31" width="6" height="6"/><rect x="41" y="35" width="6" height="6"/><rect x="47" y="45" width="8" height="8"/><rect x="33" y="45" width="6" height="10"/></g><g fill="#fff"><rect x="13" y="13" width="8" height="8"/><rect x="43" y="13" width="8" height="8"/><rect x="13" y="43" width="8" height="8"/></g></svg>`
  };

  // Der Joker: kleine violette Flamme mit Gesicht
  const JOKER_SVG = `<svg class="joker-svg" viewBox="0 0 40 48" aria-hidden="true"><defs><linearGradient id="jkg" x1="0" y1="1" x2=".2" y2="0"><stop offset="0" stop-color="#5B3FE0"/><stop offset=".55" stop-color="#9B6BFF"/><stop offset="1" stop-color="#5CE1FF"/></linearGradient></defs>
    <path class="j-koerper" d="M20 46.5c-9.4 0-15.2-6.4-15.2-14.3 0-6.4 3.7-10.3 6.8-13.8 1.1 2.7 2.6 4.1 4.4 4.9-.7-6.2 1.9-12.6 7.6-19.3.3 6 3.8 9.3 6.9 12.9 2.6 3.1 4.7 6.6 4.7 11.4 0 9.6-5.8 18.2-15.2 18.2Z" fill="url(#jkg)"/>
    <path d="M20 44c-5.5 0-9.2-3.7-9.2-8.6 0-3.5 2-5.8 3.9-7.6.8 1.5 1.8 2.3 3 2.7.1-3.2 1.6-6 4-8.6.6 3 2.4 4.8 4 6.6 1.6 1.8 3.1 3.9 3.1 7 0 4.8-3.4 8.5-8.8 8.5Z" fill="#fff" opacity=".22"/>
    <g class="j-augen"><ellipse cx="15" cy="32" rx="3.1" ry="3.6" fill="#fff"/><ellipse cx="25.4" cy="32" rx="3.1" ry="3.6" fill="#fff"/>
      <g class="j-pupillen"><circle cx="15.6" cy="32.6" r="1.7" fill="#1B0F4D"/><circle cx="26" cy="32.6" r="1.7" fill="#1B0F4D"/></g></g>
    <path d="M16.6 38.6q3.6 2.8 7.2 0" fill="none" stroke="#1B0F4D" stroke-width="1.8" stroke-linecap="round"/></svg>`;

  /* ================= Profil & Platzhalter ================= */
  function setzeProfil(p) {
    const w = D.profil(p || {}, I);
    Object.keys(w).forEach(k => { V[k] = esc(w[k]); });
    return w;
  }

  /* ================= Zustand ================= */
  const S = { profil: null, level: 0, nr: 0, erg: LV.map(() => []), serie: 0, joker: 0, erklaert: 0, fertig: false };
  const ERKL = { serie: 1, joker: 2 };   // Bits in S.erklaert: was wurde schon einmal erklärt
  function neuerStand(profil) {
    S.profil = profil || S.profil; S.level = 0; S.nr = 0; S.erg = LV.map(() => []); S.serie = 0; S.joker = 0; S.fertig = false;
  }
  let testModus = false;   // Test-Sprünge (#l2n3 …) speichern nichts und melden nichts ans LMS
  function speichere() {
    if (testModus) return;
    const p = S.profil || {};
    LMS.speichern({ v: 3, p: [p.name || '', p.firma || '', p.email || ''], l: S.level, m: S.nr, e: S.erg.map(a => a.join('')), s: S.serie, j: S.joker, x: S.erklaert, f: S.fertig ? 1 : 0 },
      'L' + (S.level + 1) + '-' + Math.min(S.nr + 1, LV[S.level].nachrichten.length));
  }
  function ladeStand(d) {
    if (!d || d.v !== 3) return false;
    const p = Array.isArray(d.p) ? d.p : [];
    S.profil = { name: p[0] || '', firma: p[1] || '', email: p[2] || '' };
    S.level = Math.max(0, Math.min(N_LV - 1, d.l | 0));
    S.erg = LV.map((l, i) => (d.e && typeof d.e[i] === 'string' ? d.e[i].split('').slice(0, l.nachrichten.length).map(Number) : []));
    S.nr = S.erg[S.level].length;
    S.serie = d.s | 0;
    S.joker = Math.max(0, Math.min(E.jokerMax || 9, d.j | 0));
    S.erklaert = d.x | 0;
    S.fertig = !!d.f;
    return true;
  }
  const richtigGesamt = () => summe(S.erg.map(summe));
  const anzahlGesamt = () => summe(LV.map(l => l.nachrichten.length));
  const zielFuer = l => Math.ceil(LV[l].nachrichten.length * (E.zielProzent || 70) / 100 - 1e-9);

  /* ================= Layout: breit (Panel rechts) oder schmal (Leiste unten) ================= */
  const MQ = window.matchMedia('(min-width: 960px), (min-width: 640px) and (max-height: 560px) and (orientation: landscape)');
  function layout() {
    app.classList.toggle('breit', MQ.matches);
    app.classList.toggle('schmal', !MQ.matches);
  }
  layout();
  if (MQ.addEventListener) MQ.addEventListener('change', layout); else if (MQ.addListener) MQ.addListener(layout);

  /* ================= Bildschirmwechsel ================= */
  let aktuell = null;
  function wechsel(el, name) {
    tooltip.aus(); hacker.weg();
    if (FB && FB.sp) FB.sp.ro.disconnect();
    FB = null; NA = null;
    app.dataset.screen = name;
    el.classList.add('screen', 'rein');
    buehne.appendChild(el);
    const alt = aktuell;
    aktuell = el;
    if (alt) {
      alt.classList.add('raus');
      alt.setAttribute('aria-hidden', 'true');
      setTimeout(() => alt.remove(), T(500));
    }
    void el.offsetWidth;
    requestAnimationFrame(() => el.classList.remove('rein'));
    hud();
    K.wisch();
  }

  /* ================= HUD ================= */
  function hud() {
    const box = $('#hud-fortschritt');
    const zeigen = ['nachricht', 'levelende'].includes(app.dataset.screen);
    box.hidden = !zeigen;
    if (!zeigen) return;
    const n = LV[S.level].nachrichten.length;
    $('#hud-level').textContent = f(U.levelKurz, { n: S.level + 1 });
    $('#hud-frage').textContent = f(U.frageVon, { n: Math.min(S.nr + 1, n), gesamt: n });
    const seg = $('#hud-segmente');
    if (seg.children.length !== n) seg.innerHTML = '<i></i>'.repeat(n);
    $$('i', seg).forEach((p, i) => {
      const e = S.erg[S.level][i];
      p.className = e === 1 ? 'ja' : e === 0 ? 'nein' : i === S.nr && app.dataset.screen === 'nachricht' ? 'jetzt' : '';
    });
  }
  // Sprechblase links neben Serie/Joker (schmal: unter der Leiste). Meldungen laufen
  // nacheinander, damit Serie und Joker nicht gleichzeitig reden.
  const hudBlase = (() => {
    const bl = $('#hud-blase'), schlange = [];
    let t = 0, laeuft = false;
    function naechste() {
      const x = schlange.shift();
      if (!x) { laeuft = false; return; }
      laeuft = true;
      bl.textContent = x.text;
      bl.dataset.art = x.art;
      bl.classList.remove('an'); void bl.offsetWidth; bl.classList.add('an');
      if (x.ton) x.ton();
      clearTimeout(t);
      t = setTimeout(() => { bl.classList.remove('an'); t = setTimeout(naechste, T(260)); }, T(x.dauer || 2800));
    }
    return {
      sag(text, art, dauer, ton) { schlange.push({ text, art, dauer, ton }); if (!laeuft) naechste(); },
      weg() { schlange.length = 0; clearTimeout(t); laeuft = false; bl.classList.remove('an'); }
    };
  })();
  const zufall = l => l[Math.floor(Math.random() * l.length)];

  // Serie (Streak) oben rechts: Flamme mit Zahl; beim ersten Mal kurz erklärt
  function serieAnzeigen(neu, verloren) {
    const el = $('#serie');
    const war = !el.hidden;
    el.hidden = S.serie < 2 && !(verloren && war);
    $('#serie-zahl').textContent = S.serie;
    el.title = f(U.serie.titel, { n: S.serie });
    el.classList.toggle('gross', S.serie >= 4);
    el.classList.toggle('aus', !!verloren);
    if (verloren && war) {
      hudBlase.sag(U.serie.verloren, 'serie', 2600);
      setTimeout(() => { el.hidden = S.serie < 2; el.classList.remove('aus'); }, T(1600));
      return;
    }
    if (!neu || S.serie < 2) return;
    el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop');
    let text = '';
    if (!(S.erklaert & ERKL.serie)) { text = U.serie.erklaerung; S.erklaert |= ERKL.serie; speichere(); }
    else if (S.serie === 2) text = zufall(U.serie.zwei);
    else if (S.serie >= 4 && S.serie % 2 === 0) text = f(zufall(U.serie.vier), { n: S.serie });
    if (!text) { K.zaehler(); return; }
    hudBlase.sag(text, 'serie', text === U.serie.erklaerung ? 4200 : 2600, K.serie);
  }

  // Joker: für eine Serie verdient (einstellungen.jokerBei), ein Klick zeigt einen Tipp
  const JB = E.jokerBei || [3, 5, 7];
  const jokerFaellig = n => JB.includes(n) || n > JB[JB.length - 1];
  function jokerAnzeigen(neu) {
    const el = $('#joker');
    el.hidden = S.joker < 1 && !(S.erklaert & ERKL.joker);
    el.classList.toggle('leer', S.joker < 1);
    $('#joker-zahl').textContent = S.joker;
    const titel = f(U.joker.titel, { n: S.joker });
    el.title = titel; el.setAttribute('aria-label', titel);
    if (!neu) return;
    el.classList.remove('kommt'); void el.offsetWidth; el.classList.add('kommt');
    if (!(S.erklaert & ERKL.joker)) { S.erklaert |= ERKL.joker; speichere(); hudBlase.sag(U.joker.erster, 'joker', 4600, K.joker); }
    else hudBlase.sag(zufall(U.joker.neu), 'joker', 2400, K.joker);
  }
  function jokerEinsetzen() {
    const na = NA;
    const el = $('#joker');
    el.classList.remove('wackelt'); void el.offsetWidth;
    if (!na || na.phase !== 'antwort') { el.classList.add('wackelt'); hudBlase.weg(); hudBlase.sag(U.joker.spaeter, 'joker', 2800); K.tipp(); return; }
    if (na.joker) { el.classList.add('wackelt'); hudBlase.weg(); hudBlase.sag(U.joker.schon, 'joker', 2400); K.tipp(); return; }
    if (S.joker < 1) { el.classList.add('wackelt'); hudBlase.weg(); hudBlase.sag(U.joker.leer, 'joker', 3000); K.tipp(); return; }
    const tipp = na.m.joker;
    if (!tipp) return;
    S.joker--; na.joker = true;
    speichere();
    hudBlase.weg();
    el.classList.add('hilft');
    setTimeout(() => el.classList.remove('hilft'), T(900));
    jokerAnzeigen();
    K.jokerTipp();
    const karte = `<div class="joker-tipp"><span class="jt-kopf">${JOKER_SVG}${esc(U.joker.tippTitel)}</span><p>${f(tipp)}</p></div>`;
    $$('.lage', na.el).forEach(l => l.insertAdjacentHTML('beforeend', karte));
    ansage(U.joker.tippTitel + ': ' + tipp.replace(/<[^>]+>/g, ''));
  }

  function tonAnzeigen() {
    app.classList.toggle('stumm', !K.an());
    $('#ton').setAttribute('aria-label', K.an() ? U.tonAn : U.tonAus);
    $('#ton').title = K.an() ? U.tonAn : U.tonAus;
  }

  /* ================= Kleine Overlays ================= */
  const tooltip = (() => {
    const el = $('#tooltip'); let t = 0;
    return {
      zeige(ziel, html, bleibt) {
        el.innerHTML = html;
        const r = ziel.getBoundingClientRect();
        el.style.left = '0px'; el.style.top = '0px';
        el.classList.add('an');
        const w = el.offsetWidth, h = el.offsetHeight;
        let x = r.left + Math.min(r.width / 2, 60) - 24, y = r.bottom + 10;
        if (y + h > innerHeight - 10) y = r.top - h - 10;
        x = Math.max(10, Math.min(innerWidth - w - 10, x));
        el.style.left = x + 'px'; el.style.top = y + 'px';
        clearTimeout(t);
        if (!bleibt) t = setTimeout(() => el.classList.remove('an'), 3200);
      },
      aus() { clearTimeout(t); el.classList.remove('an'); }
    };
  })();

  function ansage(text) { const s = $('#sr'); s.textContent = ''; setTimeout(() => { s.textContent = text; }, 60); }

  // Hacker wie im Original: lugt von links ins Bild, zwinkert (hat dich erwischt)
  // oder schwitzt (durchschaut) – mit Sprechblase
  const hacker = (() => {
    const el = $('#hacker'), blase = $('#hacker-blase');
    let t = 0, t2 = 0;
    return {
      zeige(stimmung, text, dauer) {
        clearTimeout(t); clearTimeout(t2);
        blase.textContent = text || zufall(U.hacker[stimmung]);
        el.className = 'hacker ' + (stimmung === 'erwischt' ? 'freut' : 'aergert');
        void el.offsetWidth;
        el.classList.add('da');
        K.hackerWusch();
        t2 = setTimeout(() => (stimmung === 'erwischt' ? K.hackerHaha : K.hackerGrr)(), T(650));
        t = setTimeout(() => el.classList.remove('da'), T(dauer || 4800));
      },
      weg() { clearTimeout(t); clearTimeout(t2); el.classList.remove('da'); }
    };
  })();

  const konfetti = menge => window.Feier && Feier.konfetti(menge);

  /* ================= Deko-QR-Code (nicht scannbar) ================= */
  function qrSvg(saat) {
    const n = 25;
    let s = 0; for (let i = 0; i < saat.length; i++) s = (s * 31 + saat.charCodeAt(i)) >>> 0;
    const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
    const m = [], frei = [];
    for (let y = 0; y < n; y++) { m.push(new Array(n).fill(0)); frei.push(new Array(n).fill(true)); }
    const setze = (x, y, v) => { if (x >= 0 && y >= 0 && x < n && y < n) { m[y][x] = v; frei[y][x] = false; } };
    [[0, 0], [n - 7, 0], [0, n - 7]].forEach(([x0, y0]) => {
      for (let y = -1; y <= 7; y++) for (let x = -1; x <= 7; x++) {
        const rand = x === -1 || y === -1 || x === 7 || y === 7;
        const ring = x === 0 || x === 6 || y === 0 || y === 6;
        const kern = x >= 2 && x <= 4 && y >= 2 && y <= 4;
        setze(x0 + x, y0 + y, !rand && (ring || kern) ? 1 : 0);
      }
    });
    for (let i = 8; i < n - 8; i++) { setze(i, 6, i % 2 ? 0 : 1); setze(6, i, i % 2 ? 0 : 1); }
    for (let y = -2; y <= 2; y++) for (let x = -2; x <= 2; x++) setze(n - 9 + x, n - 9 + y, Math.max(Math.abs(x), Math.abs(y)) === 1 ? 0 : 1);
    let d = '';
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      if (frei[y][x]) m[y][x] = rnd() < 0.48 ? 1 : 0;
      if (m[y][x]) d += `M${x} ${y}h1v1h-1z`;
    }
    return `<svg viewBox="-2 -2 ${n + 4} ${n + 4}" shape-rendering="crispEdges" aria-hidden="true"><rect x="-2" y="-2" width="${n + 4}" height="${n + 4}" fill="#fff"/><path d="${d}" fill="#111"/></svg>`;
  }

  /* ================= Nachrichten darstellen ================= */
  // wie Outlook: erstes und letztes Wort („IT Infrastructure Security“ → IS); Titel, Rechtsform und Zusätze nach | · fallen weg
  function initialen(name) {
    const t = String(name).split(/[|·]/)[0].replace(/\b(Dr|Prof)\.\s*/g, '').replace(/\b(GmbH|AG|Ltd|Inc)\b\.?/g, '')
      .replace(/[^A-Za-zÀ-ÿ ]/g, ' ').trim().split(/\s+/).filter(Boolean);
    return ((t[0] || '?')[0] + (t.length > 1 ? t[t.length - 1][0] : '')).toUpperCase();
  }
  function anhaenge(liste) {
    return (liste || []).map((a, i) => {
      const name = f(a.name), endung = (name.split('.').pop() || '').slice(0, 4).toUpperCase();
      // Farbe wie in Outlook nach der TATSÄCHLICHEN Endung (…docx.exe ist ein Programm)
      const farbe = { DOCX: '#2B579A', DOC: '#2B579A', XLSX: '#107C41', XLS: '#107C41', PPTX: '#C43E1C', PDF: '#C4314B', ZIP: '#9A6B00' }[endung] || '#5B6170';
      return `<button type="button" class="g-anhang"${i === 0 ? ' data-bei="anhang"' : ''}>` +
        `<span class="g-anhang-ico" style="background:${farbe}">${esc(endung)}</span><span class="g-anhang-text"><b>${name}</b><small>${esc(a.groesse)}</small></span></button>`;
    }).join('');
  }

  // Farbe für Initialen-Avatare wie in Outlook/Teams: fest je Name
  const AV_FARBEN = ['#0F6CBD', '#8764B8', '#C239B3', '#CA5010', '#498205', '#038387', '#4F6BED', '#986F0B', '#B4009E'];
  function avFarbe(name) {
    let h = 0; for (const c of String(name)) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    return AV_FARBEN[h % AV_FARBEN.length];
  }

  // E-Mail im Stil eines echten Postfachs (Lesebereich mit Symbolleiste)
  function geraetMail(m) {
    const abs = f(m.von.name), roh = abs.replace(/&amp;/g, '&');
    const IC = {
      antw: '<svg viewBox="0 0 24 24"><path d="M10 8 5 12.5l5 4.5M5.5 12.5H14a5 5 0 0 1 5 5v1"/></svg>',
      alle: '<svg viewBox="0 0 24 24"><path d="M8 8l-4.5 4.5L8 17M12 8l-4.5 4.5L12 17M8 12.5h7a5 5 0 0 1 5 5v1"/></svg>',
      weiter: '<svg viewBox="0 0 24 24"><path d="M14 8l5 4.5-5 4.5M18.5 12.5H10a5 5 0 0 0-5 5v1"/></svg>',
      mehr: '<svg viewBox="0 0 24 24"><circle cx="5.5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="18.5" cy="12" r="1.4"/></svg>'
    };
    return `<article class="geraet mail">
      <div class="mail-leiste" aria-hidden="true">
        <span class="ml-k">${IC.antw}<span>Antworten</span></span><span class="ml-k">${IC.alle}<span>Allen antworten</span></span>
        <span class="ml-k">${IC.weiter}<span>Weiterleiten</span></span><span class="ml-mehr">${IC.mehr}</span>
      </div>
      <div class="mail-kopf">
        <h2 class="g-betreff" data-bei="betreff">${f(m.betreff)}</h2>
        <div class="mail-meta">
          <span class="m-av" style="--c:${avFarbe(roh)}">${esc(initialen(roh))}</span>
          <div class="mail-wer">
            <p class="mail-von"><b>${abs}</b> <span class="mail-adr" data-bei="absender"${m.von.hover ? ` data-antwort="${f(m.von.hover)}"` : ''}>&lt;${f(m.von.adresse)}&gt;</span></p>
            <p class="mail-an">${esc(U.an)}: ${f(m.an)}</p>
          </div>
          <time class="mail-zeit">${esc(m.zeit)}</time>
        </div>
        ${m.extern ? `<p class="g-extern" data-bei="banner">${ICO.warn}<span>${esc(U.extern)}</span></p>` : ''}
        ${m.anhang ? `<div class="g-anhaenge">${anhaenge(m.anhang)}</div>` : ''}
      </div>
      <div class="mail-body">${f(m.inhalt)}</div>
    </article>`;
  }

  function phoneStatus(dunkel) {
    return `<div class="phone-status${dunkel ? ' dunkel' : ''}"><span>9:41</span>${ICO.status}</div>`;
  }

  // SMS wie in iOS-Nachrichten
  function geraetSms(m) {
    const ini = m.von.initialen || (/^[+\d\s]+$/.test(m.von.name) ? '' : initialen(m.von.name));
    const blasen = m.nachrichten.map((t, i) => `<div class="blase b-anim${i === m.nachrichten.length - 1 ? ' schwanz' : ''}">${f(t)}</div>`).join('');
    return `<article class="geraet phone sms"><div class="phone-screen">
      ${phoneStatus()}
      <div class="sms-kopf">
        <span class="sms-zurueck">${ICO.zurueck}</span>
        <span class="sms-av">${ini ? `<b>${esc(ini)}</b>` : ICO.person}</span>
        <span class="sms-nummer" data-bei="absender">${f(m.von.name)}${m.von.info ? `<small>${f(m.von.info)}</small>` : ''}</span>
      </div>
      <div class="chat">
        <p class="chat-datum"><b>${esc(U.textnachricht)}</b><br>${esc(U.heute)} ${esc(m.zeit)}</p>
        ${blasen}
      </div>
      <div class="phone-eingabe"><span class="pe-plus">+</span><span class="pe-feld">${esc(U.textnachricht)}<svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/></svg></span></div>
      <i class="home-balken"></i>
    </div></article>`;
  }

  function geraetWhatsapp(m) {
    const ini = esc(m.von.initialen || initialen(m.von.info || m.von.name));
    return `<article class="geraet phone wa"><div class="phone-screen">
      ${phoneStatus(true)}
      <div class="wa-kopf">${ICO.zurueck}<span class="m-av wa-av">${ini}</span>
        <div class="wa-wer"><b>${f(m.von.name)}</b><small>${f(m.von.info || '')}</small></div>
        <span class="wa-icons">${ICO.kamera}${ICO.telefon}</span></div>
      <div class="chat wa-chat">
        <div class="wa-unbekannt" data-bei="absender"><span class="m-av wa-av-gross">${ini}</span><b>${f(m.von.name)}</b>
          <small>${f(m.von.info || '')} · ${esc(U.nichtKontakt)}</small>
          <span class="wa-knoepfe"><span>${esc(U.blockieren)}</span><span>${esc(U.hinzufuegen)}</span></span></div>
        <p class="chat-datum">${esc(U.heute)}</p>
        ${m.nachrichten.map(t => `<div class="blase b-anim">${f(t)}<time>${esc(m.zeit)}</time></div>`).join('')}
      </div>
      <div class="phone-eingabe wa-eingabe"><span>${esc(U.nachrichtSchreiben)}</span></div>
    </div></article>`;
  }

  // Microsoft Teams (neues Teams): Leiste links, Suche oben, Chat mit grauer Blase
  function geraetTeams(m) {
    const ini = esc(m.von.initialen || initialen(m.von.name));
    const farbe = avFarbe(m.von.name);
    const RAIL = [
      ['Aktivität', '<path d="M12 4a5 5 0 0 0-5 5v3.5L5.5 15h13L17 12.5V9a5 5 0 0 0-5-5ZM10 18a2 2 0 0 0 4 0"/>'],
      ['Chat', '<path d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v6a2.5 2.5 0 0 1-2.5 2.5H11l-4 3.5V15h0a2 2 0 0 1-2-2Z"/>', true],
      ['Teams', '<circle cx="9" cy="9" r="3"/><circle cx="16.5" cy="10" r="2.3"/><path d="M3.5 18.5a5.5 5.5 0 0 1 11 0M14 18.5h6.5a4 4 0 0 0-5.6-3.7"/>'],
      ['Kalender', '<rect x="4" y="5.5" width="16" height="14" rx="2.5"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4"/>'],
      ['Anrufe', '<path d="M6 4h3l1.6 4-2 1.3a10 10 0 0 0 4.2 4.2l1.3-2 4 1.6v3a2 2 0 0 1-2 2A14 14 0 0 1 4 6a2 2 0 0 1 2-2Z"/>']
    ];
    return `<article class="geraet fenster teams">
      <div class="teams-top" aria-hidden="true"><span class="tt-punkte"><i></i><i></i><i></i></span><span class="tt-suche"><svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6"/><path d="m15 15 5 5"/></svg>Suchen</span><span class="m-av tt-ich">${esc(initialen(V.name ? V.name.replace(/&amp;/g, '&') : 'Du'))}</span></div>
      <div class="teams-body">
        <nav class="teams-rail" aria-hidden="true">${RAIL.map(([n, d, an]) => `<span class="tr-k${an ? ' an' : ''}"><svg viewBox="0 0 24 24">${d}</svg><small>${n}</small></span>`).join('')}</nav>
        <div class="teams-haupt">
          <div class="teams-kopf"><span class="m-av teams-av" style="--c:${farbe}">${ini}<i class="presence"></i></span>
            <div class="teams-wer" data-bei="absender"><b>${f(m.von.name)}</b><small>${f(m.von.info || '')}</small></div>
            <span class="teams-tabs"><b>Chat</b><span>Freigegeben</span></span></div>
          <div class="chat teams-chat">
            <p class="chat-datum">${esc(U.heute)}</p>
            <div class="teams-msg"><span class="m-av teams-av klein" style="--c:${farbe}">${ini}</span>
              <div class="teams-inhalt"><p class="teams-meta"><b>${f(m.von.name)}</b><time>${esc(m.zeit)}</time></p>
                ${m.nachrichten.map(t => `<div class="teams-blase b-anim">${f(t)}</div>`).join('')}</div></div>
          </div>
          <div class="teams-eingabe"><span>${esc(U.nachrichtSchreiben)}</span><span class="te-icons"><i></i><i></i><i></i><svg viewBox="0 0 24 24"><path d="M4 12 20 4l-4.5 16-3.5-6.5L4 12Z"/></svg></span></div>
        </div>
      </div>
    </article>`;
  }

  function geraetLinkedin(m) {
    const ini = esc(m.von.initialen || initialen(m.von.name));
    return `<article class="geraet fenster li-msg">
      <div class="li-leiste"><span class="li-logo">in</span><span>Nachrichten</span></div>
      <div class="li-kopf"><span class="m-av li-av">${ini}</span>
        <div class="li-wer" data-bei="absender"><b>${f(m.von.name)}</b><small>${f(m.von.info || '')}</small></div>
        <span class="li-inmail">${esc(U.inmail)}</span></div>
      <div class="chat li-chat">
        <p class="chat-datum">${esc(U.heute)}</p>
        <div class="li-block"><span class="m-av li-av klein">${ini}</span>
          <div class="li-inhalt"><p class="li-meta"><b>${f(m.von.name)}</b> · ${esc(m.zeit)}</p>
            ${m.nachrichten.map(t => `<p class="li-absatz b-anim">${f(t)}</p>`).join('')}
            ${m.anhang ? `<div class="g-anhaenge li-anhaenge b-anim">${anhaenge(m.anhang)}</div>` : ''}</div></div>
      </div>
      <div class="li-eingabe">${esc(U.nachrichtSchreiben)}</div>
    </article>`;
  }

  function geraet(m) {
    const html = { email: geraetMail, sms: geraetSms, whatsapp: geraetWhatsapp, teams: geraetTeams, linkedin: geraetLinkedin }[m.art](m);
    const el = bau(html);
    $$('.m-qr', el).forEach(q => {
      if (q.querySelector('img')) q.classList.add('mit-bild');   // Bild aus dem Inhalt (nicht durch den Deko-Code ersetzen)
      else q.innerHTML = qrSvg(q.dataset.ziel || m.id);
      q.setAttribute('role', 'img');
    });
    m.hinweise.forEach(h => {
      if (!h.bei) return;
      const z = el.querySelector(`[data-bei="${h.bei}"]`);
      if (z) z.dataset.h = h.id;
    });
    return el;
  }

  // Smartphone vorab auf seine endgültige Größe bringen: echte Proportionen,
  // bei viel Text lieber breiter als länger – damit beim Eintippen nichts mehr wächst.
  function telefonPlanen(g) {
    if (!g || !g.classList.contains('phone')) return;
    const screen = $('.phone-screen', g);
    g.style.width = ''; screen.style.height = '';
    if (app.classList.contains('schmal')) return;
    const spalte = g.closest('.m-spalte');
    const verfuegbar = Math.max(380, spalte.clientHeight - 60);
    const max = Math.min(spalte.clientWidth - 40, 500);
    let w = g.getBoundingClientRect().width;
    const rand = w - screen.getBoundingClientRect().width;
    const inhalt = () => { screen.style.height = 'auto'; return screen.scrollHeight; };
    let h = inhalt();
    while ((h + rand) / w > 2.0 && w < max) { w = Math.min(max, w + 20); g.style.width = w + 'px'; h = inhalt(); }
    screen.style.height = Math.round(Math.max(h, Math.min(w * 1.95, verfuegbar) - rand)) + 'px';
  }

  // Hinweise in Lesereihenfolge ihrer Textstellen
  function hinweisZiele(g, m) {
    const liste = m.hinweise.map(h => ({ h, el: g.querySelector(`[data-h="${h.id}"]`) })).filter(x => x.el);
    liste.sort((a, b) => (a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
    return liste;
  }

  /* ================= Spotlight: aktive Stelle hell, Rest dunkler =================
     Eine mehrzeilige Stelle bekommt EINEN gemeinsamen Umriss (keine Linien
     zwischen den Zeilen). Die übrigen Stellen sind dünn umrandet und liegen
     unter der dunklen Fläche – als ruhiger Überblick. */
  let spotNr = 0;
  const SVGNS = 'http://www.w3.org/2000/svg';
  function spotBauen(g, liste) {
    const host = $('.phone-screen', g) || g;
    host.classList.add('spot-host');
    const id = 'spotmaske' + (++spotNr);
    const lay = bau(`<div class="spot" aria-hidden="true"><svg class="spot-dunkel"><defs><mask id="${id}" maskUnits="userSpaceOnUse">` +
      `<rect x="0" y="0" width="100%" height="100%" fill="#fff"/><path class="loch" fill="#000"/></mask></defs>` +
      `<g class="spot-alle"></g><rect class="spot-flaeche" x="0" y="0" width="100%" height="100%" mask="url(#${id})"/><path class="spot-rahmen"/></svg></div>`);
    host.appendChild(lay);
    const alle = $('.spot-alle', lay);
    const duenn = liste.map(x => {
      const pf = document.createElementNS(SVGNS, 'path');
      pf.setAttribute('class', 'spot-duenn d-' + x.h.art);
      alle.appendChild(pf);
      return pf;
    });
    const sp = { host, lay, loch: $('.loch', lay), rahmen: $('.spot-rahmen', lay), duenn, liste, aktiv: -1, loecher: [], anim: 0 };
    sp.ro = new ResizeObserver(() => spotLayout(sp));
    sp.ro.observe(host);
    return sp;
  }
  // Rechtecke einer Stelle in Koordinaten des Hosts – ein Zoom (transform: scale) wird herausgerechnet
  function spotRects(sp, el) {
    const hr = sp.host.getBoundingClientRect();
    const k = sp.host.offsetWidth / (hr.width || 1);
    const block = el.classList.contains('hl-block');
    const rs = (block ? [el.getBoundingClientRect()] : Array.from(el.getClientRects())).filter(r => r.width > 1 && r.height > 1);
    const pad = block ? 8 : 5;
    return rs.map(r => ({ x: (r.left - hr.left) * k - pad, y: (r.top - hr.top) * k - pad, w: r.width * k + pad * 2, h: r.height * k + pad * 2 }));
  }
  // Umriss aus Zeilen-Rechtecken: berührende Zeilen werden zu einer Fläche verschmolzen
  function umriss(rs, rad) {
    if (!rs.length) return '';
    const q = rs.map(r => ({ l: r.x, t: r.y, r: r.x + r.w, b: r.y + r.h })).sort((a, b) => a.t - b.t || a.l - b.l);
    const gruppen = [];
    q.forEach(z => {
      const g = gruppen[gruppen.length - 1], v = g && g[g.length - 1];
      if (v && Math.abs(z.l - v.l) < 2 && Math.abs(z.r - v.r) < 2 && Math.abs(z.t - v.t) < 2 && Math.abs(z.b - v.b) < 2) return;   // doppelt
      if (v && z.t <= v.b + 2 && z.b > v.b + .5 && Math.min(z.r, v.r) - Math.max(z.l, v.l) > rad * 2) g.push(z);
      else gruppen.push([z]);
    });
    return gruppen.map(g => {
      const band = g.map((z, i) => ({ l: z.l, r: z.r, t: i ? (g[i - 1].b + z.t) / 2 : z.t, b: i < g.length - 1 ? (z.b + g[i + 1].t) / 2 : z.b }));
      let pts = [];
      band.forEach(z => pts.push([z.r, z.t], [z.r, z.b]));
      for (let i = band.length - 1; i >= 0; i--) pts.push([band[i].l, band[i].b], [band[i].l, band[i].t]);
      // doppelte und gerade durchlaufende Punkte entfernen
      for (let n = 0; n < 3; n++) {
        pts = pts.filter((p, i) => { const o = pts[(i + 1) % pts.length]; return Math.abs(p[0] - o[0]) + Math.abs(p[1] - o[1]) > .5; });
        pts = pts.filter((p, i) => {
          const a = pts[(i - 1 + pts.length) % pts.length], c = pts[(i + 1) % pts.length];
          return !((Math.abs(a[0] - p[0]) < .5 && Math.abs(c[0] - p[0]) < .5) || (Math.abs(a[1] - p[1]) < .5 && Math.abs(c[1] - p[1]) < .5));
        });
      }
      if (pts.length < 3) return '';
      const z = v => v.toFixed(1);
      return pts.map((b, i) => {
        const a = pts[(i - 1 + pts.length) % pts.length], c = pts[(i + 1) % pts.length];
        const l1 = Math.hypot(b[0] - a[0], b[1] - a[1]), l2 = Math.hypot(c[0] - b[0], c[1] - b[1]);
        const r = Math.min(rad, l1 / 2, l2 / 2);
        const p1 = [b[0] + (a[0] - b[0]) * r / l1, b[1] + (a[1] - b[1]) * r / l1], p2 = [b[0] + (c[0] - b[0]) * r / l2, b[1] + (c[1] - b[1]) * r / l2];
        return (i ? 'L' : 'M') + z(p1[0]) + ' ' + z(p1[1]) + 'Q' + z(b[0]) + ' ' + z(b[1]) + ' ' + z(p2[0]) + ' ' + z(p2[1]);
      }).join('') + 'Z';
    }).join('');
  }
  function spotSetze(sp, rs) {
    const d = umriss(rs, 9);
    sp.rahmen.setAttribute('d', d);
    sp.loch.setAttribute('d', d);
  }
  function spotDuenn(sp) {
    sp.liste.forEach((x, j) => sp.duenn[j].setAttribute('d', j === sp.aktiv ? '' : umriss(spotRects(sp, x.el), 7)));
  }
  function spotLayout(sp) {
    if (!sp.host.isConnected || sp.aktiv < 0) return;
    spotDuenn(sp);
    if (!sp.anim) { sp.loecher = spotRects(sp, sp.liste[sp.aktiv].el); spotSetze(sp, sp.loecher); }
  }
  function spotZiel(sp, i) {
    sp.aktiv = i;
    sp.lay.classList.add('an');
    sp.lay.dataset.art = sp.liste[i].h.art;
    spotDuenn(sp);
    const ziel = spotRects(sp, sp.liste[i].el);
    const mitte = r => ({ x: r.x + r.w / 2, y: r.y + r.h / 2, w: 0, h: 0 });
    const von = sp.loecher.length ? sp.loecher : ziel.map(mitte);
    const n = Math.max(von.length, ziel.length);
    const A = Array.from({ length: n }, (_, k) => von[Math.min(k, von.length - 1)]);
    const B = Array.from({ length: n }, (_, k) => ziel[Math.min(k, ziel.length - 1)]);
    cancelAnimationFrame(sp.anim);
    if (ruhig) { sp.loecher = ziel; spotSetze(sp, ziel); return; }
    const t0 = performance.now(), dauer = 420;
    const schritt = jetzt => {
      const t = Math.min(1, (jetzt - t0) / dauer), e = 1 - Math.pow(1 - t, 3);
      if (t < 1) {
        // Zeile für Zeile gleiten; die Zeilen bleiben dabei aneinander, der Umriss bleibt eine Fläche
        const zw = A.map((a, k) => ({ x: a.x + (B[k].x - a.x) * e, y: a.y + (B[k].y - a.y) * e, w: a.w + (B[k].w - a.w) * e, h: a.h + (B[k].h - a.h) * e }));
        spotSetze(sp, zw);
        sp.anim = requestAnimationFrame(schritt);
      } else { sp.anim = 0; sp.loecher = ziel; spotSetze(sp, ziel); }
    };
    sp.anim = requestAnimationFrame(schritt);
  }

  // Leichter Zoom auf die aktive Stelle: sie rückt ein Stück zur Mitte und nach vorn.
  // Nur im breiten Layout; die Spalte scrollt dabei, falls die Stelle außerhalb liegt.
  const ZOOM = 1.05, ZUG = 0.32, ZOOM_MAX = 70;
  function zoomZu(fb, el) {
    const r = $('.m-rahmen', fb.na.el), sp = fb.spalte;
    if (!r) return;
    if (!app.classList.contains('breit') || ruhig) { r.style.transform = ''; scrollZu(sp, el); return; }
    const rr = r.getBoundingClientRect(), s0 = rr.width / (r.offsetWidth || 1);
    const tf = getComputedStyle(r).transform;
    const mx = tf && tf !== 'none' ? new DOMMatrixReadOnly(tf) : { e: 0, f: 0 };
    const ox = rr.left - mx.e, oy = rr.top - mx.f;   // Lage ohne Zoom
    const er = el.getBoundingClientRect();
    const cx = (er.left + er.width / 2 - rr.left) / s0, cy = (er.top + er.height / 2 - rr.top) / s0, hh = er.height / s0;
    const sr = sp.getBoundingClientRect();
    // erst scrollen (falls nötig), dann von der neuen Lage aus zoomen
    let neu = sp.scrollTop;
    const oben = oy + cy - hh / 2, unten = oy + cy + hh / 2;
    if (oben < sr.top + sr.height * 0.14 || unten > sr.bottom - sr.height * 0.14) neu = sp.scrollTop + (oy + cy) - (sr.top + sr.height / 2);
    neu = Math.max(0, Math.min(sp.scrollHeight - sp.clientHeight, neu));
    const oy2 = oy - (neu - sp.scrollTop);
    // nie breiter zoomen, als die Spalte Platz hat – sonst würde die Nachricht seitlich abgeschnitten
    const gl = fb.na.g.offsetLeft, gw = fb.na.g.offsetWidth;
    const z = Math.max(1, Math.min(ZOOM, (sr.width - 20) / gw));
    const lim = v => Math.max(-ZOOM_MAX, Math.min(ZOOM_MAX, v));
    let dx = lim(cx * (1 - z) + ZUG * (sr.left + sr.width / 2 - ox - cx));
    const dy = lim(cy * (1 - z) + ZUG * (sr.top + sr.height / 2 - oy2 - cy));
    const minX = sr.left + 10 - ox - z * gl, maxX = sr.right - 10 - ox - z * (gl + gw);
    dx = minX <= maxX ? Math.max(minX, Math.min(maxX, dx)) : (minX + maxX) / 2;
    r.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px) scale(${z.toFixed(3)})`;
    if (Math.abs(neu - sp.scrollTop) > 1) sp.scrollTo({ top: neu, behavior: 'smooth' });
  }

  /* ================= URL-Anzeige mit hervorgehobener Domain ================= */
  function domainVon(host) {
    const t = host.split('.');
    if (t.length <= 2) return host;
    const zwei = ['co.uk', 'com.au', 'co.at', 'or.at', 'gv.at', 'ac.uk', 'co.jp', 'com.br'];
    return zwei.includes(t.slice(-2).join('.')) ? t.slice(-3).join('.') : t.slice(-2).join('.');
  }
  function urlChip(url) {
    let proto = '', host = url, rest = '';
    const m = /^(\w+:\/\/)([^/?#]+)(.*)$/.exec(url);
    if (m) { proto = m[1]; host = m[2]; rest = m[3]; }
    const dom = domainVon(host), vor = host.slice(0, host.length - dom.length);
    if (rest.length > 34) rest = rest.slice(0, 32) + '…';
    return `<p class="url-chip"><span class="chip-label">${esc(U.linkZiel)}</span>` +
      `<code><span class="u-dim">${esc(proto + vor)}</span><b class="u-dom">${esc(dom)}</b><span class="u-dim">${esc(rest)}</span></code>` +
      `<span class="chip-fuss">↑ ${esc(U.echteDomain)}</span></p>`;
  }
  function klartext(k) {
    return `<p class="url-chip"><span class="chip-label">${esc(U.klartext)}</span><code>${f(k).replace(/\[(.+?)\]/g, '<b class="u-dom">$1</b>')}</code></p>`;
  }

  /* ================= Start ================= */
  // Flug durch den Raum: Symbole tauchen klein rund um den Text auf und gleiten
  // langsam nach außen – links nach links, rechts nach rechts, oben nach oben –
  // ohne hinter dem Text vorbeizuziehen. Dazu ein paar Sterne für die Tiefe.
  function sternenflug() {
    const teile = [
      [BILD.postfach, -1, -.32], ['<img src="assets/icon-lupe.png" alt="">', 1, -.42], [BILD.warnung, -.92, .5],
      ['<img src="assets/icon-entscheid.png" alt="">', .95, .38], [BILD.haken, -.45, -1], [BILD.qr, .5, -1],
      [`<span class="sw-chip">${ICO.link}paypaI.com</span>`, 1, .02], [BILD.level, -1, .08]
    ];
    const dauer = 15, n = teile.length;
    const symbole = teile.map(([h, x, y], i) => {
      const l = Math.hypot(x, y);
      return `<div class="flieg" style="--dx:${(x / l).toFixed(3)};--dy:${(y / l).toFixed(3)};--t:${dauer}s;--d:${(-i * dauer / n - 1).toFixed(2)}s;--r0:${((i % 2 ? 1 : -1) * 8)}deg">${h}</div>`;
    }).join('');
    let sterne = '';
    for (let i = 0; i < 22; i++) {
      const w = (i / 22) * Math.PI * 2 + Math.random() * .25;
      sterne += `<i class="stern" style="--dx:${Math.cos(w).toFixed(3)};--dy:${(Math.sin(w) * .8).toFixed(3)};--t:${(6 + Math.random() * 4).toFixed(1)}s;--d:${(-Math.random() * 10).toFixed(1)}s"></i>`;
    }
    return `<div class="sternenflug" aria-hidden="true">${sterne}${symbole}</div>`;
  }

  function zeigeStart(gespeichert) {
    const st = U.start;
    let aktion;
    if (gespeichert && S.fertig) {
      aktion = `<div class="weiter-karte karte"><div class="wk-ikon">${ICO.orden}</div>
        <p class="wk-titel">${esc(st.fertigTitel)}</p>
        <p class="wk-text">${esc(f(st.fertigText, { richtig: richtigGesamt(), gesamt: anzahlGesamt() }))}</p>
        <div class="wk-knoepfe"><button class="btn btn-sekundaer" id="s-neu" type="button">${ICO.nochmal}${esc(st.nochmal)}</button>
        <button class="btn btn-mint" id="s-ergebnis" type="button">${esc(st.ergebnis)} ${ICO.pfeil}</button></div></div>`;
    } else if (gespeichert && S.profil && (S.level > 0 || S.nr > 0)) {
      const n = LV[S.level].nachrichten.length;
      aktion = `<div class="weiter-karte karte"><div class="wk-ikon">${ICO.play}</div>
        <p class="wk-titel">${esc(st.fortsetzenTitel)}</p>
        <p class="wk-text">${esc(f(st.fortsetzenText, { level: S.level + 1, nr: Math.min(S.nr + 1, n), gesamt: n }))}</p>
        <div class="wk-knoepfe"><button class="btn btn-sekundaer" id="s-neu" type="button">${ICO.nochmal}${esc(st.neu)}</button>
        <button class="btn btn-mint" id="s-weiter" type="button">${esc(st.fortsetzen)} ${ICO.play}</button></div></div>`;
    } else {
      aktion = `<button class="btn btn-gross btn-mint btn-winkt" id="s-los" type="button">${esc(st.los)} ${ICO.pfeil}</button>`;
    }
    const el = bau(`<section class="s-start zentriert"><div class="inhalt start">
      ${sternenflug()}
      <div class="held-schild">${BILD.schild}</div>
      <h1 class="mega">${st.titel.split(' ').map(w => `<span>${esc(w)}</span>`).join(' ')}</h1>
      <p class="lead">${esc(st.text)}</p>
      <div class="start-aktion">${aktion}</div>
      ${!gespeichert ? `<ul class="start-fakten">${st.fakten.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
    </div></section>`);
    wechsel(el, 'start');

    const los = $('#s-los', el);
    if (los) los.addEventListener('click', () => { K.klick(); zeigeBriefing(); });
    const weiter = $('#s-weiter', el);
    if (weiter) weiter.addEventListener('click', () => { K.klick(); fortsetzen(); });
    const erg = $('#s-ergebnis', el);
    if (erg) erg.addEventListener('click', () => { K.klick(); zeigeFinale(true); });
    const neu = $('#s-neu', el);
    if (neu) neu.addEventListener('click', () => { K.klick(); neuerStand(S.profil); speichere(); serieAnzeigen(); jokerAnzeigen(); zeigeProfil(); });
  }

  function fortsetzen() {
    const n = LV[S.level].nachrichten.length;
    if (S.nr >= n) zeigeLevelEnde();
    else if (S.nr === 0) zeigeLevelIntro();
    else zeigeNachricht();
  }

  /* ================= Briefing ================= */
  function zeigeBriefing() {
    const b = U.briefing;
    const ICONS = { lupe: 'assets/icon-lupe.png', entscheid: 'assets/icon-entscheid.png' };
    const icon = k => k === 'postfach' ? BILD.postfach : `<img src="${ICONS[k]}" alt="">`;
    const el = bau(`<section class="s-briefing zentriert"><div class="inhalt briefing">
      <div class="b-karten">${b.karten.map((k, i) => `<article class="b-karte karte" style="--i:${i}">
        <div class="b-icon">${icon(k.icon)}</div><h2>${esc(k.titel)}</h2><p>${esc(k.text)}</p></article>`).join('')}</div>
      <button class="btn btn-gross btn-mint" id="b-los" type="button">${esc(b.los)} ${ICO.pfeil}</button>
    </div></section>`);
    wechsel(el, 'briefing');
    b.karten.forEach((k, i) => setTimeout(() => K.blase(), T(180 + i * 160)));
    $('#b-los', el).addEventListener('click', () => { K.klick(); zeigeProfil(); });
  }

  /* ================= Profil: Name, Firma, E-Mail ================= */
  function zeigeProfil() {
    const pr = U.profil;
    const lmsName = LMS.aktiv() ? LMS.name() : '';
    const vor = S.profil || { name: lmsName, firma: '', email: '' };
    const el = bau(`<section class="s-profil zentriert"><div class="inhalt">
      <form class="profil-karte karte" novalidate>
        <h1>${esc(pr.titel)}</h1>
        <p>${esc(pr.text)}</p>
        <label class="feld" style="--i:0"><span>${esc(pr.name)}</span>
          <input id="p-name" type="text" autocomplete="name" maxlength="60" placeholder="${esc(pr.namePlatzhalter)}" value="${esc(vor.name || lmsName)}"></label>
        <label class="feld" style="--i:1"><span>${esc(pr.firma)}</span>
          <input id="p-firma" type="text" autocomplete="organization" maxlength="60" placeholder="${esc(pr.firmaPlatzhalter)}" value="${esc(vor.firma)}"></label>
        <label class="feld" style="--i:2"><span>${esc(pr.email)} <em class="auto">AUTO</em></span>
          <input id="p-email" class="mono" type="email" autocomplete="off" maxlength="80" spellcheck="false" placeholder="${esc(pr.emailPlatzhalter)}" value="${esc(vor.email)}">
          <small id="p-hinweis">${esc(pr.emailHinweis)}</small></label>
        <div class="profil-aktion">
          <button class="btn btn-gross btn-mint" type="submit">${esc(pr.weiter)} ${ICO.pfeil}</button>
        </div>
        <p class="profil-fuss">${ICO.schloss} ${esc(pr.datenschutz)}</p>
      </form>
    </div></section>`);
    wechsel(el, 'profil');
    const name = $('#p-name', el), firma = $('#p-firma', el), email = $('#p-email', el), hinweis = $('#p-hinweis', el), auto = $('.auto', el);
    // Vorschlag aus Name und Firma, getrennt in [lokaler Teil, Domain]
    const vorschlag = () => {
      const e = D.profil({ name: name.value, firma: firma.value }, I).email, at = e.lastIndexOf('@');
      return [e.slice(0, at), e.slice(at + 1)];
    };
    // Teile der Adresse, die noch dem letzten Vorschlag entsprechen, wandern mit Name/Firma mit –
    // auch wenn der andere Teil schon von Hand geändert wurde.
    let alt = vorschlag();
    const leer = () => !name.value.trim() && !firma.value.trim();
    const aktualisieren = () => {
      const neu = vorschlag(), v = email.value.trim(), at = v.lastIndexOf('@');
      let mitLokal = false, mitDomain = false;
      if (!v) { email.value = leer() ? '' : neu.join('@'); mitLokal = mitDomain = true; }
      else {
        let lok = at >= 0 ? v.slice(0, at) : v, dom = at >= 0 ? v.slice(at + 1) : '';
        if (lok.toLowerCase() === alt[0]) { lok = neu[0]; mitLokal = true; }
        if (at >= 0 && dom.toLowerCase() === alt[1]) { dom = neu[1]; mitDomain = true; }
        const wert = at >= 0 ? lok + '@' + dom : lok;
        if (leer() && wert === neu.join('@')) email.value = '';   // alles gelöscht: wieder Beispiel als Platzhalter
        else if (wert !== v) email.value = wert;
      }
      alt = neu;
      auto.style.opacity = mitLokal || mitDomain ? 1 : 0;
      email.classList.remove('fehler'); hinweis.className = ''; hinweis.textContent = pr.emailHinweis;
    };
    aktualisieren();
    name.addEventListener('input', aktualisieren);
    firma.addEventListener('input', aktualisieren);
    email.addEventListener('input', () => {
      const v = email.value.trim(), at = v.lastIndexOf('@'), neu = vorschlag();
      const mit = !v || v.slice(0, at < 0 ? v.length : at).toLowerCase() === neu[0] || (at >= 0 && v.slice(at + 1).toLowerCase() === neu[1]);
      auto.style.opacity = mit ? 1 : 0;
      if (!v) aktualisieren();
    });
    $('form', el).addEventListener('submit', e => {
      e.preventDefault();
      const mail = email.value.trim();
      if (mail && !D.emailOk(mail)) {
        email.classList.remove('fehler'); void email.offsetWidth; email.classList.add('fehler');
        hinweis.className = 'fehler'; hinweis.textContent = pr.emailFehler;
        K.falsch();
        return;
      }
      const daten = { name: name.value.trim(), firma: firma.value.trim(), email: mail };
      K.klick();
      neuerStand(daten);
      setzeProfil(daten);
      speichere();
      zeigeHallo();
    });
    setTimeout(() => { if (name.isConnected && maus) name.focus({ preventScroll: true }); }, 500);
  }

  /* ================= Hallo ================= */
  function zeigeHallo() {
    const h = U.hallo;
    const el = bau(`<section class="s-hallo zentriert"><div class="inhalt">
      <h1 class="hallo-titel">${f(h.titel)}</h1>
      <p class="hallo-text">${f(h.text)}</p>
      <p class="hallo-mail" aria-label="${V.email}"></p>
      <div class="hallo-weiter" aria-hidden="true"><i></i><i></i><i></i></div>
    </div></section>`);
    wechsel(el, 'hallo');
    const mail = $('.hallo-mail', el), text = mail.getAttribute('aria-label').replace(/&amp;/g, '&');
    let weg = false;
    const weiter = () => { if (weg || !el.isConnected) return; weg = true; K.klick(); zeigeLevelIntro(); };
    (async () => {
      await warte(T(700));
      for (let i = 1; i <= text.length; i++) {
        if (!el.isConnected) return;
        mail.textContent = text.slice(0, i);
        if (i % 2) K.zaehler();
        await warte(ruhig ? 0 : 32);
      }
      mail.classList.add('fertig');
      el.classList.add('gleich');          // Punkte laufen: es geht gleich weiter
      await warte(T(1700));
      weiter();
    })();
    el.addEventListener('click', weiter);
    const taste = e => { if (app.dataset.screen === 'hallo' && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); weiter(); } };
    document.addEventListener('keydown', taste);
    setTimeout(() => document.removeEventListener('keydown', taste), 8000);
  }

  /* ================= Level-Start ================= */
  function punkte(aktiv) {
    return `<div class="punkte">${LV.map((l, i) => `<i class="${i === aktiv ? 'an' : i < aktiv ? 'fertig' : ''}"></i>`).join('')}</div>`;
  }
  function zeigeLevelIntro() {
    const lv = LV[S.level], n = lv.nachrichten.length, li = U.levelIntro;
    const el = bau(`<section class="s-intro zentriert"><div class="inhalt intro">
      <div><span class="pille-kicker">${esc(f(li.kicker, { n: S.level + 1, gesamt: N_LV }))}</span></div>
      <div class="intro-icon">${BILD.level}<span class="intro-zahl">0</span></div>
      <h1 class="titel-gross">${esc(f(li.titel, { n: S.level + 1 }))}</h1>
      <p class="untertitel">${esc(lv.kicker)}</p>
      <div class="intro-info"><span>${ICO.mail}<b class="intro-n">0</b> ${esc(li.neue)}</span><span>${ICO.ziel}${esc(f(li.ziel, { ziel: zielFuer(S.level), gesamt: n }))}</span></div>
      <button class="btn btn-gross btn-mint" id="i-los" type="button">${esc(li.los)} ${ICO.pfeil}</button>
    </div></section>`);
    wechsel(el, 'intro');
    const zahl = $('.intro-zahl', el), zahl2 = $('.intro-n', el), icon = $('.intro-icon', el);
    (async () => {
      await warte(T(900));
      zahl.classList.add('da');
      for (let i = 1; i <= n; i++) {
        if (!el.isConnected) return;
        if (!ruhig) {
          const w = Math.random() * Math.PI * 2;
          const fl = bau(`<span class="flieger" style="--fx:${Math.cos(w) * 160}px;--fy:${Math.sin(w) * 120 - 40}px">${ICO.mail}</span>`);
          icon.appendChild(fl); setTimeout(() => fl.remove(), 800);
        }
        await warte(T(260));
        zahl.textContent = i; zahl2.textContent = i;
        zahl.classList.remove('tick'); void zahl.offsetWidth; zahl.classList.add('tick');
        K.zaehler();
      }
      K.ping();
    })();
    $('#i-los', el).addEventListener('click', () => { K.klick(); zeigeNachricht(); });
    setTimeout(() => { const b = $('#i-los', el); if (b && b.isConnected) b.focus({ preventScroll: true }); }, 400);
  }

  /* ================= Nachricht ================= */
  let NA = null;   // aktuelle Nachricht (Antwortphase)
  let FB = null;   // Feedback (Hinweisphase)

  function zeigeNachricht() {
    const lv = LV[S.level], m = lv.nachrichten[S.nr];
    const lage = `<span class="pille-kicker">${esc(U.situation)}</span><h2 class="lage-titel">${f(m.titel)}</h2><p class="lage-text">${f(m.lage)}</p>`;
    const el = bau(`<section class="s-nachricht" data-phase="antwort" data-art="${m.art}">
      <div class="m-bereich">
        <div class="m-spalte">
          <div class="lage lage-oben">${lage}</div>
          <div class="m-rahmen"></div>
        </div>
      </div>
      <aside class="panel"><div class="panel-karte">
        <div class="seite frage-seite">
          <div class="lage lage-seite">${lage}</div>
          <div class="entscheidung">
            <p class="frage">${esc(U.frage)}</p>
            <div class="antworten">
              <button class="antwort a-phishing" data-antwort="phishing" type="button" disabled>${ICO.schildWarn}<span>${esc(U.phishing)}</span><kbd>P</kbd></button>
              <button class="antwort a-echt" data-antwort="echt" type="button" disabled>${ICO.schildCheck}<span>${esc(U.echt)}</span><kbd>E</kbd></button>
            </div>
            <p class="mini-tipp">${maus ? ICO.maus : ICO.finger}<span>${esc(maus ? U.linkTipp : U.linkTippTouch)}</span></p>
          </div>
        </div>
      </div></aside>
    </section>`);
    const g = geraet(m);
    $('.m-rahmen', el).appendChild(g);
    const blasen = $$('.b-anim', g);
    if (!ruhig) blasen.forEach(b => b.classList.add('wartet'));   // Platz bleibt reserviert
    wechsel(el, 'nachricht');
    telefonPlanen(g);
    NA = { el, m, g, phase: 'antwort', bereit: false };
    const na = NA;

    // Links: Ziel beim Überfahren bzw. Antippen zeigen, nie wirklich öffnen
    const spalte = $('.m-spalte', el);
    const zielHtml = a => `<small>${esc(U.linkZiel)}</small>${esc(a.dataset.ziel)}`;
    spalte.addEventListener('pointerover', e => {
      const a = e.target.closest('[data-ziel]');
      const r = e.target.closest('[data-antwort]');
      if (r && e.pointerType !== 'touch') { tooltip.zeige(r, `<small>${esc(U.antwortAn)}</small>${esc(r.dataset.antwort)}`, true); return; }
      if (a && !a.classList.contains('m-qr') && e.pointerType !== 'touch') tooltip.zeige(a, zielHtml(a), true);
    });
    spalte.addEventListener('pointerout', e => {
      const a = e.target.closest('[data-ziel], [data-antwort]');
      if (a && !a.contains(e.relatedTarget) && e.pointerType !== 'touch') tooltip.aus();
    });
    spalte.addEventListener('click', e => {
      const r = e.target.closest('[data-antwort]');
      if (r && !e.target.closest('.hl')) { tooltip.zeige(r, `<small>${esc(U.antwortAn)}</small>${esc(r.dataset.antwort)}`); return; }
      const a = e.target.closest('[data-ziel], .g-anhang');
      if (!a) return;
      e.preventDefault();
      if (a.classList.contains('hl')) return;
      if (a.classList.contains('m-qr')) tooltip.zeige(a, esc(U.qrGesperrt));
      else if (a.classList.contains('g-anhang')) tooltip.zeige(a, esc(U.anhangGesperrt));
      else tooltip.zeige(a, zielHtml(a));
    });
    spalte.addEventListener('scroll', () => tooltip.aus(), { passive: true });
    $$('.antwort', el).forEach(b => b.addEventListener('click', () => antworte(b.dataset.antwort === 'phishing')));

    // Ankunft: Nachricht springt herein, Chats tippen Blase für Blase
    (async () => {
      g.classList.add('kommt');
      await warte(T(320));
      K.ping();
      if (!ruhig && blasen.length) {
        await warte(250);
        for (const b of blasen) {
          if (!el.isConnected) return;
          if (b.classList.contains('blase') || b.classList.contains('teams-blase')) {
            const tippt = bau('<div class="tippt"><i></i><i></i><i></i></div>');
            tippt.style.left = b.offsetLeft + 'px'; tippt.style.top = b.offsetTop + 'px';
            b.parentNode.appendChild(tippt);
            await warte(440);
            tippt.remove();
          } else await warte(140);
          b.classList.remove('wartet'); b.classList.add('erscheint');
          K.blase();
          await warte(120);
        }
      }
      if (!el.isConnected) return;
      na.bereit = true;
      $$('.antwort', el).forEach(b => { b.disabled = false; });
      el.classList.add('bereit');
    })();
  }

  // Antwort in zwei Schritten:
  // 1) Ergebnis + Kernaussage im Panel, kleiner Stempel über der Nachricht; Serie, Joker
  //    und Hacker kommen nacheinander statt alle auf einmal.
  // 2) „Details anzeigen“: Stempel weg, Hinweise und Spotlight erscheinen.
  async function antworte(sagtPhishing) {
    const na = NA;
    if (!na || na.phase !== 'antwort' || !na.bereit) return;
    na.phase = 'feedback';
    const m = na.m, richtig = sagtPhishing === m.phishing;
    S.erg[S.level][S.nr] = richtig ? 1 : 0;
    const alteSerie = S.serie;
    S.serie = richtig ? S.serie + 1 : 0;
    const jokerNeu = richtig && jokerFaellig(S.serie) && S.joker < (E.jokerMax || 9);
    if (jokerNeu) S.joker++;
    speichere();
    if (E.interaktionenMelden && !testModus) LMS.interaktion(m.id, sagtPhishing ? 'phishing' : 'echt', m.phishing ? 'phishing' : 'echt', richtig);

    tooltip.aus();
    hudBlase.weg();
    const knopf = $(`.antwort[data-antwort="${sagtPhishing ? 'phishing' : 'echt'}"]`, na.el);
    knopf.classList.add('gewaehlt');
    na.el.classList.add('beantwortet');
    $$('.antwort', na.el).forEach(b => { b.disabled = true; });
    hud();
    await warte(T(380));
    if (NA !== na) return;

    // Schritt 1: Ergebnis
    const liste = hinweisZiele(na.g, m);
    const titel = richtig ? U.ergebnis.richtig : m.phishing ? U.ergebnis.falschPhishing : U.ergebnis.falschEcht;
    const seite = bau(`<div class="seite fb ${richtig ? 'fb-ja' : 'fb-nein'}" data-stufe="1">
      <div class="fb-kopf">
        <span class="fb-ikon"><svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="21"/><path d="${richtig ? 'M14.5 24.5l6.5 6.5 12.5-14' : 'M17 17l14 14M31 17 17 31'}"/></svg></span>
        <div><h2 class="fb-titel">${esc(titel)}</h2>
          <p class="fb-wahr">${esc(m.phishing ? U.ergebnis.istPhishing : U.ergebnis.istEcht)}</p></div>
      </div>
      <p class="fb-kern">${m.kernTitel ? `<b>${f(m.kernTitel)}</b> ` : ''}${f(m.kern)}</p>
      <div class="fb-hinweise">
        <div class="fb-zaehler"><span class="fb-zaehler-text"></span><span class="fb-dots">${liste.map(() => '<i></i>').join('')}</span></div>
        <ol class="h-liste">${liste.map((x, i) => {
          const h = x.h;
          const ziel = x.el.dataset.ziel ? urlChip(x.el.dataset.ziel) : '';
          return `<li class="h-karte h-${h.art}" style="--i:${i}">
            <button class="h-kopf" type="button" aria-expanded="false"><span class="h-nr">${{ warn: ICO.hWarn, ok: ICO.hOk, tipp: ICO.hTipp }[h.art] || ''}</span>
              <span class="h-kopf-text"><small class="h-art">${esc(U.hinweisArt[h.art] || '')}</small><b class="h-titel">${f(h.titel)}</b></span>${ICO.chevron}</button>
            <div class="h-body"><div class="h-body-innen"><div class="h-body-pad"><p>${f(h.text)}</p>${ziel}${h.klartext ? klartext(h.klartext) : ''}</div></div></div>
          </li>`;
        }).join('')}</ol>
        ${m.tipps && m.tipps.length ? `<div class="fb-tipp"><b>${ICO.hTipp}${esc(U.schulungstipp)}</b>${m.tipps.map(t => `<p>${f(t)}</p>`).join('')}</div>` : ''}
      </div>
      <div class="fb-aktionen">
        <button class="btn btn-gross btn-primaer btn-weiter" type="button"><span>${esc(U.detailsAnzeigen)}</span>${ICO.pfeil}</button>
        ${E.hinweiseUeberspringbar ? `<button class="link-btn fb-skip" type="button">${esc(U.ueberspringen)}</button>` : ''}
      </div>
    </div>`);
    const karte = $('.panel-karte', na.el), alt = $('.frage-seite', karte);
    alt.classList.add('weg');
    setTimeout(() => alt.remove(), T(220));
    karte.appendChild(seite);
    karte.scrollTop = 0;
    na.el.dataset.phase = 'feedback';
    (richtig ? K.richtig : K.falsch)();
    ansage(titel + ' ' + (m.phishing ? U.ergebnis.istPhishing : U.ergebnis.istEcht));

    FB = { na, liste, i: -1, stufe: 1, gesehen: new Set(), seite, sp: null, spalte: $('.m-spalte', na.el) };
    const fb = FB;
    $('.btn-weiter', seite).addEventListener('click', () => { K.klick(); weiter(); });
    const skip = $('.fb-skip', seite);
    if (skip) skip.addEventListener('click', () => { K.klick(); naechste(); });
    setTimeout(() => { if (FB === fb) $('.btn-weiter', seite).focus({ preventScroll: true }); }, T(500));

    // nacheinander: Stempel → Serie → Joker → Hacker
    const spaeter = (ms, fn) => setTimeout(() => { if (FB === fb) fn(); }, T(ms));
    spaeter(260, () => { if (fb.stufe === 1) stempel(na, m.phishing); });
    spaeter(1000, () => serieAnzeigen(S.serie > alteSerie, !richtig && alteSerie >= 2));
    if (jokerNeu) spaeter(1500, () => jokerAnzeigen(true));
    if (m.phishing) spaeter(jokerNeu ? 2100 : 1700, () => hacker.zeige(richtig ? 'durchschaut' : 'erwischt'));
  }

  // kleiner Stempel oben rechts an der Nachricht
  function stempel(na, phishing) {
    const r = $('.m-rahmen', na.el), g = na.g;
    if (!r || !g) return;
    const st = bau(`<div class="stempel ${phishing ? 'st-phishing' : 'st-echt'}" aria-hidden="true">${phishing ? ICO.schildWarn : ICO.schildCheck}<span>${esc(phishing ? U.stempel.phishing : U.stempel.echt)}</span></div>`);
    st.style.left = (g.offsetLeft + g.offsetWidth) + 'px';
    st.style.top = g.offsetTop + 'px';
    r.appendChild(st);
    na.stempel = st;
    K.stempel();
  }

  // Schritt 2: Hinweise und Spotlight
  function details() {
    const fb = FB;
    if (!fb || fb.stufe !== 1) return;
    fb.stufe = 2;
    const na = fb.na, seite = fb.seite;
    if (na.stempel) { const st = na.stempel; st.classList.add('weg'); setTimeout(() => st.remove(), T(400)); }
    seite.dataset.stufe = '2';
    fb.liste.forEach((x, i) => {
      const z = x.el;
      const block = getComputedStyle(z).display !== 'inline';
      z.classList.add('hl', 'hl-' + x.h.art, block ? 'hl-block' : 'hl-inline');
      z.style.setProperty('--i', i);
      z.setAttribute('tabindex', '0'); z.setAttribute('role', 'button');
      z.setAttribute('aria-label', (U.hinweisArt[x.h.art] || '') + ' ' + (i + 1));
      const los = e => { e.preventDefault(); e.stopPropagation(); K.klick(); aktiviere(i); };
      z.addEventListener('click', los);
      z.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') los(e); });
      x.karte = $$('.h-karte', seite)[i];
    });
    $$('.h-kopf', seite).forEach((k, i) => k.addEventListener('click', () => { K.klick(); aktiviere(i); }));
    na.g.classList.add('zeigen');
    if (!fb.liste.length) { aktiviereLeer(fb); return; }
    fb.sp = spotBauen(na.g, fb.liste);
    setTimeout(() => { if (FB === fb) aktiviere(0); }, T(220));
  }
  // Nachricht ohne markierte Stelle: gleich weiter
  function aktiviereLeer(fb) {
    const letzteNachricht = S.nr === LV[S.level].nachrichten.length - 1;
    const btn = $('.btn-weiter', fb.seite);
    $('span', btn).textContent = letzteNachricht ? U.zurAuswertung : U.naechsteNachricht;
    btn.classList.add('final');
    const tipp = $('.fb-tipp', fb.seite); if (tipp) tipp.classList.add('an');
    const skip = $('.fb-skip', fb.seite); if (skip) skip.classList.add('weg');
  }

  function scrollZu(c, el) {
    const cr = c.getBoundingClientRect(), er = el.getBoundingClientRect();
    const oben = er.top - cr.top, unten = cr.bottom - er.bottom;
    if (oben > cr.height * 0.12 && unten > cr.height * 0.12) return;
    const ziel = c.scrollTop + oben - Math.max(24, (cr.height - er.height) / 2);
    c.scrollTo({ top: Math.max(0, Math.min(c.scrollHeight - c.clientHeight, ziel)), behavior: ruhig ? 'auto' : 'smooth' });
  }

  function aktiviere(i, still) {
    const fb = FB;
    if (!fb || fb.stufe !== 2 || i < 0 || i >= fb.liste.length) return;
    fb.i = i;
    fb.gesehen.add(i);
    const n = fb.liste.length;
    fb.liste.forEach((x, j) => {
      x.el.classList.toggle('aktiv', j === i);
      x.karte.classList.toggle('aktiv', j === i);
      x.karte.classList.toggle('gesehen', fb.gesehen.has(j));
      $('.h-kopf', x.karte).setAttribute('aria-expanded', j === i ? 'true' : 'false');
    });
    $$('.fb-dots i', fb.seite).forEach((d, j) => { d.className = j === i ? 'jetzt' : fb.gesehen.has(j) ? 'an' : ''; });
    $('.fb-zaehler-text', fb.seite).textContent = f(U.hinweisZaehler, { n: i + 1, gesamt: n });

    const letzter = i === n - 1;
    const letzteNachricht = S.nr === LV[S.level].nachrichten.length - 1;
    const btn = $('.btn-weiter', fb.seite);
    $('span', btn).textContent = letzter ? (letzteNachricht ? U.zurAuswertung : U.naechsteNachricht) : U.weiter;
    btn.classList.toggle('final', letzter);
    const tipp = $('.fb-tipp', fb.seite);
    if (tipp) tipp.classList.toggle('an', letzter);
    const skip = $('.fb-skip', fb.seite);
    if (skip) skip.classList.toggle('weg', letzter);

    const x = fb.liste[i];
    zoomZu(fb, x.el);
    spotZiel(fb.sp, i);
    if (app.classList.contains('breit')) {
      // nur das Panel selbst scrollen – scrollIntoView würde im LMS auch die Seite um das iframe verschieben
      setTimeout(() => {
        const pk = $('.panel-karte', fb.na.el);
        if (!pk) return;
        const kr = x.karte.getBoundingClientRect(), lr = pk.getBoundingClientRect();
        const fuss = $('.fb-aktionen', fb.seite).offsetHeight + 12;
        let d = 0;
        if (kr.bottom > lr.bottom - fuss) d = kr.bottom - (lr.bottom - fuss);
        if (kr.top - d < lr.top + 8) d = kr.top - lr.top - 8;
        if (d) pk.scrollBy({ top: d, behavior: ruhig ? 'auto' : 'smooth' });
      }, T(380));
    } else $('.h-liste', fb.seite).scrollTop = 0;
    if (!still) K.tipp();
    ansage(f(U.hinweisZaehler, { n: i + 1, gesamt: n }) + '. ' + (U.hinweisArt[x.h.art] || '') + ': ' + x.karte.textContent.replace(/\s+/g, ' ').trim());
  }

  function weiter() {
    const fb = FB;
    if (!fb) return;
    if (fb.stufe === 1) details();
    else if (fb.i < fb.liste.length - 1) aktiviere(fb.i + 1);
    else naechste();
  }

  function naechste() {
    if (FB && FB.sp) FB.sp.ro.disconnect();
    FB = null;
    hacker.weg();
    // wer schnell weiterklickt, überspringt die Animationen – Zahlen trotzdem nachziehen
    serieAnzeigen(); jokerAnzeigen();
    S.nr++;
    speichere();
    if (S.nr < LV[S.level].nachrichten.length) zeigeNachricht();
    else zeigeLevelEnde();
  }

  /* ================= Halbkreis-Messer wie im Original ================= */
  function messer(p, grenze, mitte, label) {
    const R = 96, C = 2 * Math.PI * R, L = C * 0.75;
    const th = (135 + 270 * grenze) * Math.PI / 180, cos = Math.cos(th), sin = Math.sin(th);
    const mx = 120 + R * cos, my = 120 + R * sin, ax = 120 + (R + 16) * cos, ay = 120 + (R + 16) * sin;
    const lx = (120 + (R + 20) * cos) / 2.4, ly = (120 + (R + 20) * sin) / 2.4;
    return `<div class="messer" data-p="${p}" data-l="${L}">
      <svg viewBox="0 0 240 240"><defs><linearGradient id="messerVerlauf" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#0FE3A8"/><stop offset="1" stop-color="#5CFFD8"/></linearGradient></defs>
        <circle class="m-spur" cx="120" cy="120" r="${R}" stroke-dasharray="${L} ${C}" transform="rotate(135 120 120)"/>
        <circle class="m-wert" cx="120" cy="120" r="${R}" stroke-dasharray="${L} ${C}" style="stroke-dashoffset:${L}" transform="rotate(135 120 120)"/>
        <g class="m-marke"><line x1="${mx}" y1="${my}" x2="${ax}" y2="${ay}"/><circle cx="${mx}" cy="${my}" r="5"/></g></svg>
      <div class="m-mitte">${mitte}</div>
      <div class="m-label" style="left:${lx}%;top:${ly}%;${cos < 0 ? 'transform:translate(calc(-100% - 10px),-100%);align-items:flex-end;' : ''}">${esc(label)}<b>${Math.round(grenze * 100)} %</b></div>
    </div>`;
  }
  function messerStarten(el) {
    const ms = $('.messer', el), wert = $('.m-wert', el), zahl = $('.m-prozent', el);
    if (!ms) return;
    const p = +ms.dataset.p, L = +ms.dataset.l;
    setTimeout(() => { wert.style.strokeDashoffset = L * (1 - p); }, T(350));
    (async () => {
      await warte(T(400));
      const schritte = 26;
      for (let i = 1; i <= schritte; i++) { if (!el.isConnected) return; zahl.textContent = Math.round(p * 100 * i / schritte) + ' %'; await warte(T(1300 / schritte)); }
      zahl.textContent = Math.round(p * 100) + ' %';
    })();
  }

  /* ================= Level-Auswertung ================= */
  function abzeichen(i, an) {
    const c = [['#5CFFD2', '#0BB58E'], ['#B9A8FF', '#6D4AE6'], ['#FF8DB3', '#E11D74']][i % 3];
    return `<svg class="badge-svg${an ? ' an' : ''}" viewBox="0 0 64 72" aria-hidden="true">
      <defs><linearGradient id="bv${i}" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stop-color="${c[0]}"/><stop offset="1" stop-color="${c[1]}"/></linearGradient></defs>
      <path d="M32 3 58 13v20c0 17-11 29-26 36C17 62 6 50 6 33V13L32 3Z" fill="${an ? `url(#bv${i})` : 'rgba(255,255,255,.06)'}" stroke="${an ? 'rgba(255,255,255,.55)' : 'rgba(255,255,255,.18)'}" stroke-width="2"/>
      <path d="M32 9 52 17v16c0 13-8 23-20 29" fill="none" stroke="rgba(255,255,255,${an ? '.35' : '.06'})" stroke-width="2" stroke-linecap="round"/>
      <text x="32" y="45" text-anchor="middle" font-size="24" font-weight="800" fill="${an ? '#160B3A' : 'rgba(255,255,255,.3)'}" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif">${i + 1}</text></svg>`;
  }

  function zeigeLevelEnde() {
    const lv = LV[S.level], n = lv.nachrichten.length, le = U.levelEnde;
    const erg = S.erg[S.level], r = summe(erg), ziel = zielFuer(S.level);
    const geschafft = r >= ziel, weiterOk = geschafft || !E.bestehenNoetig, perfekt = r === n;
    const letztes = S.level === N_LV - 1;
    const nugget = I.nuggets.find(x => x.nachLevel === S.level + 1);
    const titel = perfekt ? le.perfekt : geschafft ? f(le.bestanden, { n: S.level + 1 }) : le.knapp;
    const weiterText = letztes ? le.zumErgebnis : nugget ? le.zumNugget : f(le.naechstesLevel, { n: S.level + 2 });
    S.nr = n; speichere();

    const mitte = `<span class="m-symbol ${geschafft ? '' : 'nein'}"><svg viewBox="0 0 24 24"><path d="${geschafft ? 'm5 12.5 4.5 4.5L19 7.5' : 'M6.5 6.5l11 11M17.5 6.5l-11 11'}"/></svg></span>
      <span class="m-prozent">0 %</span><span class="m-richtig">${esc(f(le.richtig, { richtig: r, gesamt: n }))}</span>`;
    const el = bau(`<section class="s-levelende zentriert"><div class="inhalt">
      <div class="le-karte karte">
        <span class="pille-kicker ohne">${esc(f(le.kicker, { n: S.level + 1, gesamt: N_LV }))}</span>${punkte(S.level)}
        <h1>${esc(titel)}</h1>
        ${messer(n ? r / n : 0, (E.zielProzent || 70) / 100, mitte, le.bestandenAb)}
        <div class="le-kacheln">${erg.map((e, i) => `<span class="le-kachel ${e ? 'ja' : 'nein'}" style="--i:${i}" title="${f(lv.nachrichten[i].titel)}">${e ? ICO.check : ICO.kreuz}</span>`).join('')}</div>
        ${geschafft ? `<div class="abzeichen-zeile"><div class="badge-wrap an">${abzeichen(S.level, true)}</div><div><small>${esc(le.abzeichen)}</small><b>${esc(lv.badge)}</b></div></div>` : ''}
        <details class="le-details"><summary>${ICO.chevron}Details</summary>
          <ol class="le-liste">${lv.nachrichten.map((m, i) => `<li class="${erg[i] ? 'ja' : 'nein'}">${erg[i] ? ICO.check : ICO.kreuz}<span class="le-titel">${f(m.titel)}</span>
            <span class="tag ${m.phishing ? 'tag-phishing' : 'tag-echt'}">${esc(m.phishing ? le.warPhishing : le.warEcht)}</span></li>`).join('')}</ol></details>
        <div class="le-fuss${weiterOk ? '' : ' allein'}">
          ${!perfekt ? `<button class="${weiterOk ? 'text-btn' : 'btn btn-gross btn-mint'}" id="le-nochmal" type="button">${ICO.nochmal}${esc(f(le.wiederholen, { n: S.level + 1 }))}</button>` : '<span></span>'}
          ${weiterOk ? `<button class="btn btn-mint" id="le-weiter" type="button">${esc(weiterText)} ${ICO.pfeil}</button>` : ''}
        </div>
      </div>
    </div></section>`);
    wechsel(el, 'levelende');
    messerStarten(el);
    setTimeout(() => (geschafft ? K.level() : K.levelNein()), T(300));
    if (geschafft) setTimeout(() => konfetti(perfekt ? 120 : 80), T(1500));

    const w = $('#le-weiter', el);
    if (w) w.addEventListener('click', () => {
      K.klick();
      if (letztes) zeigeFinale();
      else if (nugget) zeigeNugget(nugget);
      else naechstesLevel();
    });
    const nm = $('#le-nochmal', el);
    if (nm) nm.addEventListener('click', () => {
      K.klick();
      S.erg[S.level] = []; S.nr = 0; S.serie = 0; serieAnzeigen();
      speichere();
      zeigeLevelIntro();
    });
    setTimeout(() => { const b = $('#le-weiter', el) || $('#le-nochmal', el); if (b && b.isConnected) b.focus({ preventScroll: true }); }, 900);
  }

  function naechstesLevel() {
    S.level = Math.min(N_LV - 1, S.level + 1);
    S.nr = 0;
    S.erg[S.level] = [];
    speichere();
    zeigeLevelIntro();
  }

  /* ================= Sicherheitstipp: Folie für Folie ================= */
  function zeigeNugget(nu) {
    const n = nu.folien.length, U2 = U.nugget;
    const el = bau(`<section class="s-nugget zentriert"><div class="inhalt nugget">
      <div class="n-kopf"><span class="pille-kicker">${esc(U2.kicker)}</span><h1>${esc(nu.titel)}</h1><p>${esc(nu.untertitel || '')}</p></div>
      <div class="n-buehne">${nu.folien.map((fo, i) => `<article class="n-folie karte" aria-hidden="true">
        <div class="n-text"><h2><span class="n-nr">${i + 1}</span>${esc(fo.titel)}</h2><p>${esc(fo.text)}</p>
          ${fo.punkte ? `<ul>${fo.punkte.map(p => `<li>${esc(p)}</li>`).join('')}</ul>` : ''}
          ${fo.schutz ? `<p class="n-schutz">${ICO.schutz}<span>${esc(fo.schutz)}</span></p>` : ''}
          ${i === n - 1 ? `<p class="n-merke">${ICO.birne}<span><b>${esc(U2.merke)}:</b> ${esc(nu.merke)}</span></p>` : ''}</div>
        <div class="n-bild"><img src="${esc(fo.bild)}" alt=""></div></article>`).join('')}</div>
      <div class="n-fuss">
        <div class="n-nav"><button class="n-zurueck" type="button" aria-label="${esc(U2.zurueck)}">${ICO.zurueck}</button><span class="n-dots">${nu.folien.map(() => '<i></i>').join('')}</span></div>
        <button class="btn btn-gross btn-mint" id="n-weiter" type="button"><span>${esc(U2.weiter)}</span> ${ICO.pfeil}</button>
      </div>
    </div></section>`);
    wechsel(el, 'nugget');
    const folien = $$('.n-folie', el), dots = $$('.n-dots i', el), zur = $('.n-zurueck', el), btn = $('#n-weiter', el);
    let i = -1;
    const zeige = (neu, rueck) => {
      folien.forEach((fo, k) => {
        fo.classList.toggle('zurueck', rueck ? k > neu : k < neu);
        fo.classList.toggle('aktiv', k === neu);
        fo.setAttribute('aria-hidden', k === neu ? 'false' : 'true');
      });
      dots.forEach((d, k) => { d.className = k === neu ? 'an' : k < neu ? 'fertig' : ''; });
      zur.disabled = neu === 0;
      $('span', btn).textContent = neu === n - 1 ? nu.knopf : U2.weiter;
      i = neu;
      K.wisch();
    };
    zeige(0);
    btn.addEventListener('click', () => { K.klick(); if (i < n - 1) zeige(i + 1); else naechstesLevel(); });
    zur.addEventListener('click', () => { if (i > 0) { K.klick(); zeige(i - 1, true); } });
    el.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); btn.click(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); zur.click(); }
    });
    setTimeout(() => { if (btn.isConnected) btn.focus({ preventScroll: true }); }, 500);
  }

  /* ================= Ergebnis ================= */
  function zeigeFinale(nurAnsehen) {
    const r = richtigGesamt(), n = anzahlGesamt(), fi = U.finale;
    const prozent = n ? (r / n) * 100 : 0;
    const bestanden = prozent >= E.bestehensgrenze;
    let lmsOk = false;
    if (!nurAnsehen) { S.fertig = true; speichere(); lmsOk = LMS.abschliessen(prozent, bestanden); }
    else lmsOk = LMS.aktiv();
    const titel = prozent >= 90 ? fi.titelTop : prozent >= 75 ? fi.titelGut : prozent >= 50 ? fi.titelMittel : fi.titel;
    const mitte = `<span class="m-prozent">0 %</span>`;
    const el = bau(`<section class="s-finale zentriert"><div class="inhalt finale">
      <div class="f-kopf">
        ${messer(n ? r / n : 0, E.bestehensgrenze / 100, mitte, U.levelEnde.bestandenAb)}
        <div class="f-kopf-text"><span class="pille-kicker">${esc(fi.kicker)}</span><h1 class="titel-gross">${f(titel)}</h1>
          <p class="lead">${esc(f(fi.text, { richtig: r, gesamt: n }))}</p><p class="f-absatz">${esc(fi.absatz)}</p></div>
      </div>
      <div class="f-raster">
        <section class="f-block karte"><h2>${esc(fi.abzeichen)}</h2>
          <div class="f-badges">${LV.map((l, i) => {
            const an = summe(S.erg[i]) >= zielFuer(i);
            return `<div class="f-badge${an ? ' an' : ''}" style="--i:${i}"><div class="badge-wrap${an ? ' an' : ''}">${abzeichen(i, an)}</div><b>${esc(l.badge)}</b>
              <span class="f-pips">${l.nachrichten.map((m, j) => `<i class="${S.erg[i][j] === 1 ? 'ja' : S.erg[i][j] === 0 ? 'nein' : ''}"></i>`).join('')}</span></div>`;
          }).join('')}</div></section>
        <section class="f-block karte"><h2>${esc(fi.mitnehmen)}</h2>
          <ul class="f-merke">${fi.merksaetze.map((s, i) => `<li style="--i:${i}">${ICO.check}<span>${esc(s)}</span></li>`).join('')}</ul></section>
      </div>
      ${lmsOk ? `<p class="f-lms">${ICO.check}${esc(fi.lms)}</p>` : ''}
      <button class="btn btn-sekundaer" id="f-nochmal" type="button">${ICO.nochmal}${esc(fi.nochmal)}</button>
    </div></section>`);
    wechsel(el, 'finale');
    messerStarten(el);
    setTimeout(() => K.finale(), T(300));
    if (bestanden) setTimeout(() => { if (el.isConnected && window.Feier) Feier.feuerwerk(prozent >= 90 ? 9 : 6); }, T(1300));
    setTimeout(() => {
      if (el.isConnected) hacker.zeige(r >= n - 2 ? 'durchschaut' : 'erwischt', r >= n - 2 ? U.hacker.finaleGut : U.hacker.finale, 3400);
    }, T(2300));
    $('#f-nochmal', el).addEventListener('click', () => {
      K.klick();
      if (window.Feier) Feier.stopp();
      neuerStand(S.profil);
      speichere();
      serieAnzeigen(); jokerAnzeigen();
      zeigeLevelIntro();
    });
  }

  /* ================= Tastatur ================= */
  document.addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.target.closest && e.target.closest('input, textarea')) return;
    const k = e.key.toLowerCase();
    if (app.dataset.screen !== 'nachricht') return;
    if (NA && NA.phase === 'antwort') {
      if (k === 'p') antworte(true);
      else if (k === 'e') antworte(false);
      else if (k === 'j' && !$('#joker').hidden) jokerEinsetzen();
    } else if (FB) {
      if (k === 'arrowright' || k === 'arrowdown') { e.preventDefault(); weiter(); }
      else if (k === 'arrowleft' || k === 'arrowup') { e.preventDefault(); aktiviere(FB.i - 1); }
    }
  });

  // Größe ändern: Telefon neu planen (Spotlight passt sich selbst an)
  let rt = 0;
  window.addEventListener('resize', () => {
    tooltip.aus();
    clearTimeout(rt);
    rt = setTimeout(() => {
      const g = (FB && FB.na.g) || (NA && NA.g);
      if (g) telefonPlanen(g);
      if (FB && FB.stufe === 2 && FB.i >= 0) zoomZu(FB, FB.liste[FB.i].el);
    }, 160);
  });

  /* ================= Test-Sprünge (#l2n3 …) ================= */
  function route(h) {
    if (!/^(start|profil|l\dn?\d?|e\d|k\d|ende)$/.test(h)) return false;   // fremde Hashes (z. B. vom LMS) ignorieren
    if (h !== 'start' && h !== 'profil') testModus = true;
    if (!S.profil) setzeProfil({});
    let m;
    const probe = l => LV[l].nachrichten.map((x, i) => (i === 1 ? 0 : 1));
    if (h === 'start') { zeigeStart(null); return true; }
    if (h === 'profil') { zeigeProfil(); return true; }
    if ((m = /^l(\d)$/.exec(h))) { S.level = +m[1] - 1; S.nr = 0; zeigeLevelIntro(); return true; }
    if ((m = /^l(\d)n(\d)$/.exec(h))) {
      S.level = +m[1] - 1; S.nr = +m[2] - 1;
      for (let l = 0; l < S.level; l++) S.erg[l] = probe(l);
      S.erg[S.level] = probe(S.level).slice(0, S.nr);
      S.joker = Math.max(S.joker, 1); jokerAnzeigen();
      zeigeNachricht(); return true;
    }
    if ((m = /^e(\d)$/.exec(h))) { S.level = +m[1] - 1; S.erg[S.level] = probe(S.level); zeigeLevelEnde(); return true; }
    if ((m = /^k(\d)$/.exec(h))) { const nu = I.nuggets[+m[1] - 1]; if (nu) { S.level = nu.nachLevel - 1; zeigeNugget(nu); return true; } }
    if (h === 'ende') { S.erg = LV.map((l, i) => probe(i)); zeigeFinale(true); return true; }
    return false;
  }

  /* ================= Start ================= */
  function init() {
    $('#hud-titel').textContent = U.marke + ' · ' + U.produkt;
    $('#serie-label').textContent = U.serie.label;
    document.title = U.produkt;
    document.documentElement.lang = I.sprache || 'de';
    tonAnzeigen();
    $('#ton').addEventListener('click', () => { K.setzeAn(!K.an()); tonAnzeigen(); K.klick(); });

    LMS.init();
    if (/[?&]neu\b/.test(location.search)) LMS.loeschen();
    const d = LMS.laden();
    const hat = ladeStand(d);
    setzeProfil(S.profil || { name: LMS.aktiv() ? LMS.name() : '' });
    serieAnzeigen();
    $('.joker-figur').innerHTML = JOKER_SVG;
    jokerAnzeigen();
    $('#joker').addEventListener('click', () => { K.klick(); jokerEinsetzen(); });
    window.addEventListener('pagehide', () => LMS.beenden());
    window.addEventListener('beforeunload', () => LMS.beenden());

    window.addEventListener('hashchange', () => route(decodeURIComponent(location.hash.slice(1))));
    const h = decodeURIComponent(location.hash.slice(1));
    if (h && route(h)) return;
    zeigeStart(hat ? d : null);
  }
  init();
})();
