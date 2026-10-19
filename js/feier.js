/* ------------------------------------------------------------------
   Feier – Konfetti auf einer Leinwand über allem.
   konfetti():        Level geschafft – zwei Kanonen unten, Schnipsel
                      werden von der Luft gebremst und flattern taumelnd zu Boden.
   konfettiFinale():  Quiz geschafft – drei Salven, dazu ein Regen von oben
                      mit Sternen und Luftschlangen, mehr Gold.
   ------------------------------------------------------------------ */
window.Feier = (function () {
  'use strict';
  var FARBEN = ['#17FFC0', '#FF5C93', '#FFCF4A', '#8B6EFF', '#5CC8FF', '#FFFFFF', '#FF8278'];
  var FARBEN_FINALE = ['#FFCF4A', '#FFE27A', '#FFB020', '#17FFC0', '#FF5C93', '#8B6EFF', '#FFFFFF'];
  var cv = null, ctx = null, teile = [], lauf = 0, letzte = 0, w = 0, h = 0, dpr = 1;
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
  var aus = function (l) { return l[Math.floor(Math.random() * l.length)]; };

  function schnipsel(x, y, winkel, tempo, s, o) {
    o = o || {};
    var zufallForm = Math.random();
    return {
      x: x, y: y, a: winkel, v: tempo,
      fall: r(1.7, 2.6) * s * (o.langsam || 1),   // Sinkgeschwindigkeit, wenn die Luft gebremst hat
      wind: r(-0.5, 0.5),
      wob: r(0, 6.28), wobV: r(0.04, 0.1),         // Taumeln
      kipp: r(0, 6.28), kippV: r(0.06, 0.14) * (Math.random() < 0.5 ? -1 : 1),   // Drehen um die eigene Achse
      gr: r(6, 11) * s,
      form: o.formen ? (zufallForm < o.formen.stern ? 'stern' : zufallForm < o.formen.stern + o.formen.band ? 'band' : zufallForm < 0.82 ? 'rechteck' : 'rund')
        : (zufallForm < 0.18 ? 'rund' : 'rechteck'),
      c: aus(o.farben || FARBEN),
      t: -(o.verz || 0), dauer: r(230, 300) * (o.laenger || 1)
    };
  }
  function salve(menge, s, o) {
    for (var i = 0; i < menge; i++) {
      var links = i % 2 === 0;
      var winkel = (links ? -62 : -118) + r(-24, 24);
      teile.push(schnipsel(links ? w * 0.08 : w * 0.92, h + 10, winkel * Math.PI / 180, r(24, 50) * s, s, o));
    }
  }
  function regen(menge, s, o) {
    for (var j = 0; j < menge; j++) {
      var p = schnipsel(r(w * 0.05, w * 0.95), -20, r(70, 110) * Math.PI / 180, r(2, 6), s, o);
      p.t -= r(10, 90); teile.push(p);
    }
  }

  function konfetti(menge) {
    if (ruhig || !leinwand()) return;
    menge = menge || 100;
    var s = Math.max(0.7, Math.min(1.2, h / 820));
    salve(menge, s);
    regen(menge * 0.35, s);
    starten();
  }

  // Ende des Quiz: drei Salven nacheinander, dazu Sterne und Luftschlangen von oben
  function konfettiFinale(menge) {
    if (ruhig || !leinwand()) return;
    menge = menge || 130;
    var s = Math.max(0.7, Math.min(1.2, h / 820));
    var o = { farben: FARBEN_FINALE, formen: { stern: 0.22, band: 0.2 } };
    [0, 34, 68].forEach(function (verz) { salve(Math.round(menge * 0.4), s, { farben: o.farben, formen: o.formen, verz: verz }); });
    regen(menge * 0.7, s, { farben: o.farben, formen: o.formen, langsam: 0.8, laenger: 1.3 });
    starten();
  }

  function stern(rad) {
    ctx.beginPath();
    for (var k = 0; k < 10; k++) {
      var rr = k % 2 ? rad * 0.45 : rad, a = k * Math.PI / 5 - Math.PI / 2;
      ctx[k ? 'lineTo' : 'moveTo'](Math.cos(a) * rr, Math.sin(a) * rr);
    }
    ctx.closePath(); ctx.fill();
  }

  function starten() {
    if (lauf) return;
    cv.classList.add('an');
    letzte = performance.now();
    lauf = requestAnimationFrame(schritt);
  }
  function schritt(jetzt) {
    var k = Math.min(3, (jetzt - letzte) / 16.667); letzte = jetzt;
    ctx.clearRect(0, 0, w, h);
    for (var j = teile.length - 1; j >= 0; j--) {
      var c = teile[j];
      c.t += k;
      if (c.t < 0) continue;
      if (c.t >= c.dauer || c.y > h + 40) { teile.splice(j, 1); continue; }
      // Flug: Abschuss wird von der Luft gebremst, danach sinkt das Stück langsam und taumelt
      c.x += (Math.cos(c.a) * c.v + c.wind) * k;
      c.y += (Math.sin(c.a) * c.v + c.fall) * k;
      c.v *= Math.pow(0.915, k);
      c.wob += c.wobV * k; c.kipp += c.kippV * k;
      var b = c.gr, flach = Math.cos(c.kipp);   // Drehung um die Längsachse: mal ganz, mal nur eine Kante
      ctx.globalAlpha = Math.min(1, (1 - c.t / c.dauer) * 3);
      ctx.fillStyle = c.c;
      ctx.save();
      ctx.translate(c.x + Math.cos(c.wob) * 9, c.y + Math.sin(c.wob) * 3);
      ctx.rotate(c.kipp * 0.5 + c.wob * 0.3);
      ctx.scale(1, Math.max(0.12, Math.abs(flach)));
      if (c.form === 'rund') { ctx.beginPath(); ctx.arc(0, 0, b * 0.45, 0, 6.283); ctx.fill(); }
      else if (c.form === 'stern') stern(b * 0.75);
      else if (c.form === 'band') ctx.fillRect(-b * 0.16, -b * 1.1, b * 0.32, b * 2.2);
      else ctx.fillRect(-b / 2, -b * 0.32, b, b * 0.64);
      ctx.restore();
    }
    ctx.globalAlpha = 1;
    if (teile.length) lauf = requestAnimationFrame(schritt);
    else { lauf = 0; ctx.clearRect(0, 0, w, h); cv.classList.remove('an'); }
  }

  function stopp() {
    teile = [];
    if (lauf) cancelAnimationFrame(lauf);
    lauf = 0;
    if (ctx) ctx.clearRect(0, 0, w, h);
    if (cv) cv.classList.remove('an');
  }
  window.addEventListener('resize', function () { if (lauf) leinwand(); });

  return { konfetti: konfetti, konfettiFinale: konfettiFinale, stopp: stopp };
})();
