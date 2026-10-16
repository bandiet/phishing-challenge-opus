/* ------------------------------------------------------------------
   Feier – Konfetti (Level geschafft) und Feuerwerk (Quiz geschafft)
   auf einer Leinwand über allem. Konfetti schießt aus zwei Kanonen hoch,
   wird von der Luft gebremst und flattert dann taumelnd zu Boden.
   ------------------------------------------------------------------ */
window.Feier = (function () {
  'use strict';
  var FARBEN = ['#17FFC0', '#FF5C93', '#FFCF4A', '#8B6EFF', '#5CC8FF', '#FFFFFF', '#FF8278'];
  var cv = null, ctx = null, teile = [], raketen = [], lauf = 0, letzte = 0, w = 0, h = 0, dpr = 1;
  var ruhig = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function leinwand() {
    if (!cv) { cv = document.getElementById('feier'); if (!cv) return false; ctx = cv.getContext('2d'); }
    dpr = Math.min(2, window.devicePixelRatio || 1);
    w = window.innerWidth; h = window.innerHeight;
    cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return true;
  }
  var r = function (a, b) { return a + Math.random() * (b - a); };
  var farbe = function () { return FARBEN[Math.floor(Math.random() * FARBEN.length)]; };

  /* ---------- Konfetti ---------- */
  function schnipsel(x, y, winkel, tempo, s) {
    return {
      art: 'k', x: x, y: y, a: winkel, v: tempo,
      fall: r(1.7, 2.6) * s,            // Sinkgeschwindigkeit, wenn die Luft gebremst hat
      wind: r(-0.5, 0.5),
      wob: r(0, 6.28), wobV: r(0.04, 0.1),   // Taumeln
      kipp: r(0, 6.28), kippV: r(0.06, 0.14) * (Math.random() < 0.5 ? -1 : 1),   // Drehen um die eigene Achse
      gr: r(6, 11) * s, rund: Math.random() < 0.18, c: farbe(),
      t: 0, dauer: r(230, 300)
    };
  }
  function konfetti(menge) {
    if (ruhig || !leinwand()) return;
    menge = menge || 100;
    var s = Math.max(0.7, Math.min(1.2, h / 820));
    for (var i = 0; i < menge; i++) {
      var links = i % 2 === 0;
      var x = links ? w * 0.08 : w * 0.92, y = h + 10;
      var winkel = (links ? -62 : -118) + r(-24, 24);
      teile.push(schnipsel(x, y, winkel * Math.PI / 180, r(24, 50) * s, s));
    }
    // zweite, kleinere Welle aus der Mitte oben – füllt den Himmel
    for (var j = 0; j < menge * 0.35; j++) {
      var p = schnipsel(r(w * 0.2, w * 0.8), -20, r(70, 110) * Math.PI / 180, r(2, 6), s);
      p.t = -r(20, 70); teile.push(p);
    }
    starten();
  }

  /* ---------- Feuerwerk ---------- */
  function rakete(verz) {
    var s = Math.max(0.7, Math.min(1.25, Math.min(w, h * 1.4) / 900));
    raketen.push({
      x: r(w * 0.15, w * 0.85), y: h + 10, ziel: r(h * 0.14, h * 0.42),
      v: r(10, 13) * Math.sqrt(h / 800), t: -verz, s: s,
      c1: farbe(), c2: farbe()
    });
  }
  function explodiere(k) {
    var n = Math.round(r(56, 80)), ring = Math.random() < 0.35;
    for (var i = 0; i < n; i++) {
      var a = (i / n) * Math.PI * 2 + r(-0.05, 0.05);
      var v = (ring ? r(4.6, 5.2) : r(1.2, 5.6)) * k.s;
      teile.push({ art: 'f', x: k.x, y: k.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, c: i % 3 ? k.c1 : k.c2,
        t: 0, dauer: r(60, 95), gr: r(1.6, 2.6) * k.s, funkel: Math.random() < 0.4 });
    }
    // kurzer Blitz in der Mitte
    teile.push({ art: 'b', x: k.x, y: k.y, t: 0, dauer: 14, gr: 46 * k.s, c: k.c1 });
    if (window.Klang && Klang.knall) Klang.knall();
  }
  function feuerwerk(anzahl) {
    if (ruhig || !leinwand()) return;
    anzahl = anzahl || 7;
    for (var i = 0; i < anzahl; i++) rakete(i * r(22, 34) + (i ? 6 : 0));
    starten();
  }

  /* ---------- Schleife ---------- */
  function starten() {
    if (lauf) return;
    cv.classList.add('an');
    letzte = performance.now();
    lauf = requestAnimationFrame(schritt);
  }
  function schritt(jetzt) {
    var k = Math.min(3, (jetzt - letzte) / 16.667); letzte = jetzt;
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';
    for (var i = raketen.length - 1; i >= 0; i--) {
      var q = raketen[i];
      q.t += k;
      if (q.t < 0) continue;
      q.y -= q.v * k; q.v *= Math.pow(0.985, k);
      ctx.fillStyle = q.c1; ctx.globalAlpha = 0.9;
      ctx.beginPath(); ctx.arc(q.x, q.y, 2.2 * q.s, 0, 6.283); ctx.fill();
      ctx.globalAlpha = 0.35; ctx.fillRect(q.x - 1, q.y, 2, 22 * q.s);
      if (q.y <= q.ziel || q.v < 2) { explodiere(q); raketen.splice(i, 1); }
    }
    for (var j = teile.length - 1; j >= 0; j--) {
      var p = teile[j];
      p.t += k;
      if (p.t < 0) continue;
      var rest = 1 - p.t / p.dauer;
      if (rest <= 0) { teile.splice(j, 1); continue; }
      if (p.art === 'f') {
        p.vx *= Math.pow(0.955, k); p.vy = p.vy * Math.pow(0.955, k) + 0.07 * k;
        p.x += p.vx * k; p.y += p.vy * k;
        ctx.globalAlpha = Math.min(1, rest * 1.6) * (p.funkel && Math.random() < 0.3 ? 0.25 : 1);
        ctx.fillStyle = p.c;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.gr, 0, 6.283); ctx.fill();
      } else if (p.art === 'b') {
        var g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.gr);
        g.addColorStop(0, 'rgba(255,255,255,' + (0.55 * rest) + ')'); g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.globalAlpha = 1; ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.gr, 0, 6.283); ctx.fill();
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    for (var m = 0; m < teile.length; m++) {
      var c = teile[m];
      if (c.art !== 'k' || c.t < 0) continue;
      // Flug: Abschuss wird von der Luft gebremst, danach sinkt das Stück langsam und taumelt
      c.x += (Math.cos(c.a) * c.v + c.wind) * k;
      c.y += (Math.sin(c.a) * c.v + c.fall) * k;
      c.v *= Math.pow(0.915, k);
      c.wob += c.wobV * k; c.kipp += c.kippV * k;
      var wx = Math.cos(c.wob) * 9, wy = Math.sin(c.wob) * 3;
      var breite = c.gr, flach = Math.cos(c.kipp);   // Drehung um die Längsachse: mal ganz, mal nur eine Kante
      ctx.globalAlpha = Math.min(1, (1 - c.t / c.dauer) * 3);
      ctx.fillStyle = c.c;
      ctx.save();
      ctx.translate(c.x + wx, c.y + wy);
      ctx.rotate(c.kipp * 0.5 + c.wob * 0.3);
      ctx.scale(1, Math.max(0.12, Math.abs(flach)));
      if (c.rund) { ctx.beginPath(); ctx.arc(0, 0, breite * 0.45, 0, 6.283); ctx.fill(); }
      else ctx.fillRect(-breite / 2, -breite * 0.32, breite, breite * 0.64);
      ctx.restore();
      if (c.y > h + 40) c.t = c.dauer;
    }
    ctx.globalAlpha = 1;
    if (teile.length || raketen.length) lauf = requestAnimationFrame(schritt);
    else { lauf = 0; ctx.clearRect(0, 0, w, h); cv.classList.remove('an'); }
  }

  function stopp() {
    teile = []; raketen = [];
    if (lauf) cancelAnimationFrame(lauf);
    lauf = 0;
    if (ctx) ctx.clearRect(0, 0, w, h);
    if (cv) cv.classList.remove('an');
  }
  window.addEventListener('resize', function () { if (lauf) leinwand(); });

  return { konfetti: konfetti, feuerwerk: feuerwerk, stopp: stopp };
})();
