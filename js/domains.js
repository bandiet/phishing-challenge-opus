/* ------------------------------------------------------------------
   Täusch-Domains – aus jeder Firmendomain die typischen Fälschungen
   bauen, so wie Angreifer es tun. Beispiel nordwerk.de:
     doppel  nordwerrk.de     ein (schmaler) Buchstabe doppelt
     tausch  der unauffälligste Kniff, der passt – in dieser Reihenfolge:
             Doppelbuchstabe weglassen (scheer → scher), Bindestrich
             verdoppeln (a-b → a--b), „ie“/„ei“ drehen, ähnlich aussehende
             Nachbarn tauschen (rn/ur/il …), sonst zwei Nachbarn tauschen
     glyph   nordvverk.de     Zeichen, die gleich aussehen (rn/m, vv/w, cl/d, I/l, g/q, lc/k, 0/o);
             passt keins, ein anderer feiner Kniff als bei „tausch“
   Am schwersten zu sehen sind laut Typosquatting-Werkzeugen (dnstwist) und
   Sicherheitsfirmen Doppelgänger-Zeichen und fehlende Doppelbuchstaben;
   zwei vertauschte Buchstaben fallen am ehesten auf.
     weg     norwerk.de       ein Buchstabe fehlt
     zusatz  nordwerk-it.de   offiziell klingender Zusatz
     tld     nordwerk.com     andere Endung
   Jede Fälschung gibt es auch markiert ("nordwer[r]k.de") für die
   Klarschrift-Anzeige in den Hinweisen.
   Läuft im Browser (window.PC_DOMAIN) und in Node (für Tests).
   ------------------------------------------------------------------ */
(function (wurzel) {
  'use strict';

  const ZWEISTUFIG = ['co.uk', 'org.uk', 'ac.uk', 'com.au', 'co.at', 'or.at', 'gv.at', 'ac.at', 'co.nz', 'co.za', 'com.br', 'co.jp', 'com.tr', 'com.pl', 'com.es'];
  const FREEMAIL = ['gmail.com', 'googlemail.com', 'gmx.de', 'gmx.net', 'gmx.at', 'gmx.ch', 'web.de', 'outlook.com', 'outlook.de', 'hotmail.com',
    'hotmail.de', 'live.com', 'live.de', 'yahoo.com', 'yahoo.de', 't-online.de', 'icloud.com', 'me.com', 'mail.de', 'posteo.de', 'freenet.de',
    'aol.com', 'proton.me', 'protonmail.com', 'bluewin.ch', 'hispeed.ch', 'orange.fr', 'free.fr', 'laposte.net', 'mailbox.org'];
  const RECHTSFORMEN = /\b(gmbh\s*&\s*co\.?\s*kg|gmbh|mbh|ag|kg|kgaa|se|ohg|gbr|ug|e\.?\s*v\.?|ltd\.?|limited|inc\.?|llc|plc|s\.?a\.?s?|sarl|s\.?r\.?l\.?|b\.?v\.?|n\.?v\.?|sp\.?\s*z\s*o\.?\s*o\.?|co\.?|& co\.?)\.?\s*$/i;

  function umschrift(s) {
    return String(s || '').toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
      .normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  // "Müller & Söhne GmbH" → "Müller & Söhne"
  function firmaKurz(name) {
    let s = String(name || '').trim().replace(/\s+/g, ' ');
    for (let i = 0; i < 3; i++) s = s.replace(RECHTSFORMEN, '').replace(/[\s,&+-]+$/, '').trim();
    return s || String(name || '').trim();
  }

  // "Müller & Söhne GmbH" → "mueller-soehne"
  function firmaSlug(name) {
    return umschrift(firmaKurz(name)).replace(/&/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 30).replace(/-+$/, '');
  }

  function lokalTeil(vorname, nachname) {
    const s = [vorname, nachname].filter(Boolean).map(x => umschrift(x).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')).filter(Boolean);
    return s.join('.');
  }

  function emailOk(s) { return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(String(s || '').trim()); }

  // "mail.nordwerk.co.uk" → { name: 'nordwerk', tld: 'co.uk', domain: 'nordwerk.co.uk' }
  function teile(domain) {
    const t = String(domain || '').toLowerCase().trim().replace(/^.*@/, '').replace(/\.+$/, '').split('.').filter(Boolean);
    if (t.length < 2) return { name: t[0] || 'firma', tld: 'de', domain: (t[0] || 'firma') + '.de' };
    const n = ZWEISTUFIG.includes(t.slice(-2).join('.')) && t.length >= 3 ? 2 : 1;
    const tld = t.slice(-n).join('.'), name = t[t.length - n - 1];
    return { name, tld, domain: name + '.' + tld };
  }

  const istBuchstabe = c => /[a-z]/.test(c);
  // Positionen von der Mitte nach außen: m, m+1, m-1, m+2 …  (erste Stelle bleibt unangetastet)
  function vonDerMitte(len) {
    const m = Math.floor(len / 2), r = [];
    for (let d = 0; d < len; d++) {
      for (const i of d === 0 ? [m] : [m + d, m - d]) if (i >= 1 && i < len && !r.includes(i)) r.push(i);
    }
    return r;
  }

  function doppel(n) {
    const gern = 'rlnmstpf';
    for (const runde of [gern, 'bcdfghjklmnpqrstvwxz']) {
      for (const i of vonDerMitte(n.length)) {
        const c = n[i];
        if (runde.includes(c) && n[i - 1] !== c && n[i + 1] !== c) return { neu: n.slice(0, i + 1) + c + n.slice(i + 1), mark: n.slice(0, i + 1) + '[' + c + ']' + n.slice(i + 1) };
      }
    }
    const i = Math.max(1, Math.floor(n.length / 2));
    return { neu: n.slice(0, i) + n[i - 1] + n.slice(i), mark: n.slice(0, i) + '[' + n[i - 1] + ']' + n.slice(i) };
  }

  // Feine Fälschungen, die unauffälligste zuerst (je { neu, mark })
  function feineKniffe(n) {
    const r = [];
    // 1) von einem Doppelbuchstaben einen weglassen: scheer → scher
    for (const i of vonDerMitte(n.length)) {
      if (istBuchstabe(n[i]) && n[i] === n[i - 1]) r.push({ neu: n.slice(0, i) + n.slice(i + 1), mark: n.slice(0, i) + '[·]' + n.slice(i + 1) });
    }
    // 2) Bindestrich verdoppeln: scheer-group → scheer--group
    const b = n.indexOf('-');
    if (b > 0) r.push({ neu: n.slice(0, b) + '--' + n.slice(b + 1), mark: n.slice(0, b) + '[--]' + n.slice(b + 1) });
    // 3) „ie“ ↔ „ei“
    for (const [a, z] of [['ie', 'ei'], ['ei', 'ie']]) {
      const i = n.indexOf(a, 1);
      if (i > 0) r.push({ neu: n.slice(0, i) + z + n.slice(i + 2), mark: n.slice(0, i) + '[' + z + ']' + n.slice(i + 2) });
    }
    // 4) Nachbarn tauschen, die ähnlich aussehen (r n m u v w i l)
    const aehnlich = 'rnmuvwil';
    for (const i of vonDerMitte(n.length - 1)) {
      const a = n[i], c = n[i + 1];
      if (i > 0 && a !== c && aehnlich.includes(a) && aehnlich.includes(c)) r.push({ neu: n.slice(0, i) + c + a + n.slice(i + 2), mark: n.slice(0, i) + '[' + c + a + ']' + n.slice(i + 2) });
    }
    return r;
  }

  function tausch(n) {
    const fein = feineKniffe(n);
    if (fein.length) return fein[0];
    for (const i of vonDerMitte(n.length - 1)) {
      const a = n[i], b = n[i + 1];
      if (istBuchstabe(a) && istBuchstabe(b) && a !== b) return { neu: n.slice(0, i) + b + a + n.slice(i + 2), mark: n.slice(0, i) + '[' + b + a + ']' + n.slice(i + 2) };
    }
    return doppel(n);
  }

  function weg(n) {
    if (n.length < 4) return doppel(n);
    for (const i of vonDerMitte(n.length - 1)) {
      if (istBuchstabe(n[i]) && n[i - 1] !== n[i + 1]) return { neu: n.slice(0, i) + n.slice(i + 1), mark: n.slice(0, i) + '[·]' + n.slice(i + 1) };
    }
    return doppel(n);
  }

  // Zeichen, die in normaler Schrift (fast) gleich aussehen
  const GLYPHEN = [
    { aus: 'm', ein: 'rn', info: '„rn“ statt „m“' },
    { aus: 'w', ein: 'vv', info: '„vv“ statt „w“' },
    { aus: 'rn', ein: 'm', info: '„m“ statt „rn“' },
    { aus: 'd', ein: 'cl', info: '„cl“ statt „d“' },
    { aus: 'l', ein: 'I', info: 'großes „I“ statt kleinem „l“' },
    { aus: 'i', ein: 'l', info: 'kleines „l“ statt „i“' },
    { aus: 'g', ein: 'q', info: '„q“ statt „g“' },
    { aus: 'k', ein: 'lc', info: '„lc“ statt „k“' },
    { aus: 'o', ein: '0', info: 'eine Null statt „o“' }
  ];
  // ausser: eine Fälschung, die schon vergeben ist (glyph soll anders aussehen als tausch)
  function glyph(n, ausser) {
    for (const g of GLYPHEN) {
      let i = n.indexOf(g.aus, 1);
      if (i < 0) i = n.indexOf(g.aus);
      if (i >= 0) return { neu: n.slice(0, i) + g.ein + n.slice(i + g.aus.length), mark: n.slice(0, i) + '[' + g.ein + ']' + n.slice(i + g.aus.length), info: g.info };
    }
    const fein = feineKniffe(n).find(k => k.neu !== ausser);
    if (fein) return Object.assign(fein, { info: 'kaum sichtbar verändert' });
    return { neu: n, mark: n, info: 'andere Endung', andereEndung: true };   // wie bei echtem CEO-Betrug: gleicher Name, andere Endung
  }

  function andereTld(tld) {
    return { de: 'com', com: 'de', at: 'de', ch: 'com', net: 'com', org: 'com', eu: 'com', nl: 'com', fr: 'com', uk: 'com', 'co.uk': 'com' }[tld] || 'com';
  }

  // Alle Fälschungen für eine Domain
  function faelschungen(domain, zusatz) {
    const { name, tld } = teile(domain);
    const mit = x => x + '.' + tld;
    const t = tausch(name), g = glyph(name, t.neu), w = weg(name), d = doppel(name);
    const z = zusatz || '-it', at = andereTld(tld);
    return {
      fake_doppel: mit(d.neu), fake_doppel_m: mit(d.mark),
      fake_tausch: mit(t.neu), fake_tausch_m: mit(t.mark),
      fake_glyph: g.andereEndung ? name + '.' + at : mit(g.neu), fake_glyph_m: g.andereEndung ? name + '.[' + at + ']' : mit(g.mark), glyph_info: g.info,
      fake_weg: mit(w.neu), fake_weg_m: mit(w.mark),
      fake_zusatz: name + z + '.' + tld, fake_zusatz_m: name + '[' + z + '].' + tld,
      fake_tld: name + '.' + at, fake_tld_m: name + '.[' + at + ']'
    };
  }

  // Profil → alle Platzhalterwerte (noch nicht HTML-maskiert).
  // Im Feld „Firma“ darf ein Name („Müller & Söhne GmbH“) oder direkt eine Domain („firma.de“) stehen.
  function profil(eingabe, standard) {
    standard = standard || {};
    const p = standard.person || {}, fi = standard.firma || {};
    const name = String(eingabe.name || '').trim().replace(/\s+/g, ' ').slice(0, 60);
    let vor = p.vorname || 'Max', nach = p.nachname || '';
    if (name) { const t = name.split(' '); vor = t[0]; nach = t.slice(1).join(' '); }
    const tld = fi.tld || 'de';
    const firmaRoh = String(eingabe.firma || '').trim().slice(0, 60) || fi.name || 'firma.de';
    const alsDomain = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(firmaRoh);
    const firmaDomain = alsDomain ? teile(firmaRoh).domain : (firmaSlug(firmaRoh) || 'firma') + '.' + tld;
    const firma = alsDomain ? teile(firmaRoh).name.replace(/(^|-)([a-z])/g, (m, a, b) => a + b.toUpperCase()) : firmaRoh;
    const lokal = lokalTeil(vor, nach) || 'max';
    const vorschlag = lokal + '@' + firmaDomain;
    const email = emailOk(eingabe.email) ? String(eingabe.email).trim().toLowerCase() : vorschlag;
    let dom = teile(email.split('@')[1]).domain;
    // private Adresse eingegeben? Dann die Firmendomain aus dem Feld „Firma“ nehmen
    if (FREEMAIL.includes(dom)) dom = firmaDomain;
    const tt = teile(dom);
    return Object.assign({
      vorname: vor, nachname: nach, name: nach ? vor + ' ' + nach : vor,
      email, privat: lokal + '@' + (p.privatDomain || 'mailbox.de'),
      firma, firmakurz: alsDomain ? firma : firmaKurz(firma), domain: tt.domain, tenant: tt.name
    }, faelschungen(tt.domain, fi.zusatz));
  }

  const api = { umschrift, firmaKurz, firmaSlug, lokalTeil, emailOk, teile, faelschungen, profil, FREEMAIL };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else wurzel.PC_DOMAIN = api;
})(typeof window !== 'undefined' ? window : this);
