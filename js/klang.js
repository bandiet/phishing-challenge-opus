/* ------------------------------------------------------------------
   Klang – kleine UI-Geräusche, live erzeugt mit Web Audio.
   Keine Audiodateien: nichts kann im LMS fehlen, nichts muss laden.
   Der AudioContext startet erst beim ersten Klick (Autoplay-Regeln).
   ------------------------------------------------------------------ */
window.Klang = (function () {
  'use strict';
  var ctx = null, master = null, an = true;
  try { an = localStorage.getItem('pc2-ton') !== '0'; } catch (e) {}

  function init() {
    if (ctx) return;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    try {
      ctx = new AC();
      var komp = ctx.createDynamicsCompressor();
      komp.threshold.value = -18; komp.ratio.value = 4;
      master = ctx.createGain();
      master.gain.value = 0.55;
      master.connect(komp); komp.connect(ctx.destination);
    } catch (e) { ctx = null; }
  }
  function wecken() {
    init();
    if (ctx && ctx.state === 'suspended') { try { ctx.resume(); } catch (e) {} }
  }
  ['pointerdown', 'keydown', 'touchstart'].forEach(function (t) {
    document.addEventListener(t, wecken, { capture: true, passive: true });
  });

  function bereit() { return an && ctx && ctx.state === 'running'; }

  // Ein Ton mit weicher Hüllkurve
  function ton(f, t0, dauer, o) {
    o = o || {};
    var t = ctx.currentTime + (t0 || 0);
    var osc = ctx.createOscillator(), g = ctx.createGain();
    osc.type = o.typ || 'sine';
    osc.frequency.setValueAtTime(f, t);
    if (o.nach) osc.frequency.exponentialRampToValueAtTime(o.nach, t + dauer);
    if (o.vibrato) {
      var lfo = ctx.createOscillator(), lg = ctx.createGain();
      lfo.frequency.value = o.vibrato; lg.gain.value = f * 0.03;
      lfo.connect(lg); lg.connect(osc.frequency); lfo.start(t); lfo.stop(t + dauer + 0.05);
    }
    var vol = o.vol || 0.15, att = o.att || 0.006;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + att);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dauer);
    var ziel = master;
    if (o.lp) {
      var fl = ctx.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.value = o.lp;
      fl.connect(master); ziel = fl;
    }
    osc.connect(g); g.connect(ziel);
    osc.start(t); osc.stop(t + dauer + 0.02);
  }

  // Gefiltertes Rauschen (Wisch, Marker)
  var rauschPuffer = null;
  function rauschen(t0, dauer, o) {
    o = o || {};
    if (!rauschPuffer) {
      rauschPuffer = ctx.createBuffer(1, ctx.sampleRate * 1, ctx.sampleRate);
      var d = rauschPuffer.getChannelData(0);
      for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    var t = ctx.currentTime + (t0 || 0);
    var src = ctx.createBufferSource(); src.buffer = rauschPuffer;
    var fl = ctx.createBiquadFilter(); fl.type = o.typ || 'bandpass'; fl.Q.value = o.q || 1.2;
    fl.frequency.setValueAtTime(o.von || 800, t);
    fl.frequency.exponentialRampToValueAtTime(o.bis || 3000, t + dauer);
    var g = ctx.createGain(), vol = o.vol || 0.08;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + dauer * 0.35);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dauer);
    src.connect(fl); fl.connect(g); g.connect(master);
    src.start(t); src.stop(t + dauer + 0.02);
  }

  function spiel(fn) { return function () { if (bereit()) { try { fn.apply(null, arguments); } catch (e) {} } }; }

  return {
    an: function () { return an; },
    setzeAn: function (wert) {
      an = !!wert;
      try { localStorage.setItem('pc2-ton', an ? '1' : '0'); } catch (e) {}
      if (an) wecken();
    },
    wecken: wecken,
    // leiser Klick für Knöpfe
    klick: spiel(function () { ton(1400, 0, 0.05, { typ: 'triangle', vol: 0.05, nach: 900 }); }),
    // neue Nachricht trifft ein
    ping: spiel(function () {
      ton(988, 0, 0.18, { vol: 0.09 }); ton(1480, 0.07, 0.32, { vol: 0.08 });
    }),
    // Bildschirmwechsel
    wisch: spiel(function () { rauschen(0, 0.32, { von: 500, bis: 2600, vol: 0.05 }); }),
    // Sprechblase / Chat-Nachricht
    blase: spiel(function () { ton(620, 0, 0.09, { typ: 'sine', vol: 0.07, nach: 900 }); }),
    richtig: spiel(function () {
      ton(659, 0, 0.22, { vol: 0.11 }); ton(988, 0.09, 0.3, { vol: 0.11 }); ton(1319, 0.18, 0.45, { vol: 0.07 });
    }),
    falsch: spiel(function () {
      ton(247, 0, 0.22, { typ: 'triangle', vol: 0.13, lp: 1200 }); ton(196, 0.13, 0.36, { typ: 'triangle', vol: 0.12, lp: 1000 });
    }),
    // Textmarker streicht über eine Stelle
    marker: spiel(function (n) { rauschen(0, 0.2, { typ: 'highpass', von: 2500, bis: 5200, vol: 0.035 }); }),
    // Hinweis wechselt
    tipp: spiel(function () { ton(1175, 0, 0.08, { typ: 'sine', vol: 0.05 }); }),
    // Hacker freut sich
    hackerHaha: spiel(function () {
      [0, 0.11, 0.22].forEach(function (t, i) { ton(523 - i * 60, t, 0.09, { typ: 'square', vol: 0.035, lp: 2200 }); });
      ton(330, 0.36, 0.3, { typ: 'square', vol: 0.03, lp: 1600, vibrato: 9 });
    }),
    // Hacker ärgert sich
    hackerGrr: spiel(function () {
      ton(196, 0, 0.32, { typ: 'sawtooth', vol: 0.05, nach: 98, lp: 900 });
      rauschen(0.05, 0.25, { von: 1500, bis: 300, vol: 0.04 });
    }),
    serie: spiel(function () {
      [784, 988, 1175, 1568].forEach(function (f, i) { ton(f, i * 0.06, 0.25, { vol: 0.06 }); });
    }),
    zaehler: spiel(function () { ton(1568, 0, 0.05, { typ: 'triangle', vol: 0.04 }); }),
    // Stempel knallt auf die Nachricht
    stempel: spiel(function () {
      ton(110, 0, 0.22, { typ: 'sine', vol: 0.32, nach: 55 });
      rauschen(0, 0.12, { typ: 'lowpass', von: 1800, bis: 300, vol: 0.16, q: 0.7 });
      ton(1400, 0.02, 0.05, { typ: 'triangle', vol: 0.03 });
    }),
    // Konfetti-Kanonen
    konfetti: spiel(function () {
      rauschen(0, 0.25, { typ: 'highpass', von: 900, bis: 4000, vol: 0.09 });
      rauschen(0.08, 0.25, { typ: 'highpass', von: 1000, bis: 4500, vol: 0.08 });
      [0.2, 0.3, 0.38, 0.5, 0.62].forEach(function (t, i) { ton(1800 + i * 260, t, 0.06, { typ: 'triangle', vol: 0.025 }); });
    }),
    level: spiel(function () {
      [523, 659, 784, 1047].forEach(function (f, i) { ton(f, i * 0.1, 0.5, { vol: 0.08 }); });
      ton(1568, 0.42, 0.7, { vol: 0.04 });
    }),
    levelNein: spiel(function () {
      [392, 330, 262].forEach(function (f, i) { ton(f, i * 0.14, 0.35, { typ: 'triangle', vol: 0.09, lp: 1400 }); });
    }),
    stern: spiel(function (i) { ton(880 * Math.pow(1.26, i || 0), 0, 0.3, { vol: 0.07 }); }),
    finale: spiel(function () {
      [523, 659, 784, 1047, 1319].forEach(function (f, i) { ton(f, i * 0.09, 0.6, { vol: 0.07 }); });
      [1047, 1319, 1568].forEach(function (f) { ton(f, 0.55, 1.1, { vol: 0.045 }); });
    })
  };
})();
