/* ------------------------------------------------------------------
   Phishing Challenge (intern: „Opus“) – Inhalt DEUTSCH
   ------------------------------------------------------------------
   Nachrichten, Situationen, Warnsignale, Feedback und Sicherheitstipps
   stammen 1:1 aus der ursprünglichen Phishing Challenge (CCT Phishing
   Challenge #1, Stand 23.09.2026). Nur offensichtliche Fehler sind
   korrigiert – jede Korrektur ist mit „// Korrektur:“ markiert.

   Für eine neue Sprache: Datei kopieren (inhalt.en.js …), nur Texte
   übersetzen; ids, data-h, data-ziel, bei, art, bild und {{platzhalter}}
   unverändert lassen. Danach: python3 tools/bouw.py en

   Platzhalter (aus dem Profil der Lernenden):
     {{vorname}} {{name}} {{email}} {{domain}} {{tenant}} {{firma}}
     Täusch-Domains: {{fake_doppel}} {{fake_tausch}} {{fake_glyph}} {{fake_weg}}
     {{fake_zusatz}} {{fake_tld}} – jeweils auch als …_m (markiert für die Klarschrift)
   Markierungen in Nachrichten:
     <mark data-h="b">…</mark>                    – Textstelle zu Hinweis b
     <a data-ziel="https://…" data-h="c">…</a>    – Link (Ziel per Hover)
     Hinweis mit bei: 'absender' | 'anhang' | 'banner' | 'betreff'
   joker: kurzer Tipp, den ein eingesetzter Joker zeigt – lenkt den Blick,
     verrät aber nicht, ob die Nachricht Phishing oder echt ist.
   ------------------------------------------------------------------ */
window.PC_INHALT = {
  sprache: 'de',
  version: 'opus-1',

  // Beispielwerte (wie im Original): Max Mustermann, firma.de
  firma: { name: 'firma.de', tld: 'de', zusatz: '-it' },
  person: { vorname: 'Max', nachname: 'Mustermann', privatDomain: 'mailbox.de' },

  einstellungen: {
    zielProzent: 70,              // Level bestanden ab … % (wie im Original)
    bestehenNoetig: true,         // ohne Ziel kein nächstes Level
    hinweiseUeberspringbar: true, // kleiner "Hinweise überspringen"-Link
    bestehensgrenze: 80,          // % für "passed" im LMS (= masteryscore im Original-Manifest)
    interaktionenMelden: true,    // jede Antwort als cmi.interaction
    jokerBei: [3, 6, 8, 10, 12, 14], // Joker bei dieser Serie (alles richtig = 6 Joker); danach alle zwei richtigen Antworten
    jokerMax: 9                   // mehr Joker kann man nicht sammeln
  },

  ui: {
    marke: 'Cyber Crime Awareness',
    produkt: 'Phishing Challenge',
    tonAn: 'Ton ausschalten',
    tonAus: 'Ton einschalten',
    levelKurz: 'Level {{n}}',
    frageVon: 'Frage {{n}} von {{gesamt}}',

    start: {
      titel: 'Erkennst du Phishing?',
      text: 'Teste dein Gespür für echte und gefälschte Nachrichten.',
      los: 'Check starten',
      fakten: ['15 Nachrichten', '3 Level', 'ca. 15 Minuten'],
      fortsetzenTitel: 'Gespeicherten Stand fortsetzen?',
      fortsetzenText: 'Willkommen zurück, {{vorname}}! Du warst in Level {{level}} bei Frage {{nr}} von {{gesamt}}.',
      fortsetzen: 'Fortsetzen',
      neu: 'Neu starten',
      fertigTitel: 'Challenge abgeschlossen',
      fertigText: 'Dein Ergebnis: {{richtig}} von {{gesamt}} richtig erkannt.',
      ergebnis: 'Ergebnis ansehen',
      nochmal: 'Quiz erneut starten'
    },

    briefing: {
      karten: [
        { icon: 'postfach', titel: 'Dein Postfach', text: 'Du erhältst nacheinander verschiedene Nachrichten.' },
        { icon: 'lupe', titel: 'Schau genau hin', text: 'Nicht jede Nachricht ist, was sie zu sein scheint.' },
        { icon: 'entscheid', titel: 'Phishing oder echt?', text: 'Triff bei jeder Nachricht deine Entscheidung.' }
      ],
      los: 'Los geht’s'
    },

    profil: {
      titel: 'Mach das Quiz persönlicher.',
      text: 'Gib einen Namen, deine Firma und eine E-Mail-Adresse ein – echt oder erfunden. Wir verwenden sie, um die Nachrichten im Quiz realistischer zu gestalten.',
      name: 'Name',
      namePlatzhalter: 'Max Mustermann',
      firma: 'Firma',
      firmaPlatzhalter: 'firma.de',
      email: 'E-Mail-Adresse',
      emailPlatzhalter: 'max.mustermann@firma.de',
      emailHinweis: 'Entsteht aus Name und Firma – du kannst sie ändern.',
      emailFehler: 'Bitte gib eine gültige E-Mail-Adresse an.',
      weiter: 'Weiter',
      datenschutz: 'Deine Angaben werden nur in diesem Quiz verwendet.'
    },

    hallo: {
      titel: 'Hallo {{name}}.',
      text: 'In diesem Quiz hast du die E-Mail-Adresse'
    },

    levelIntro: {
      kicker: 'Level {{n}} von {{gesamt}}',
      titel: 'Bereit für Level {{n}}?',
      neue: 'neue Nachrichten',
      ziel: 'Ziel: {{ziel}} von {{gesamt}} richtig',
      los: 'Posteingang öffnen'
    },

    situation: 'Situation',
    frage: 'Phishing oder echt?',
    phishing: 'Phishing',
    echt: 'Echt',
    linkTipp: 'Fahre mit der Maus über Links und Buttons – wie im echten Postfach.',
    linkTippTouch: 'Tippe auf Links und Buttons, um ihr Ziel zu sehen.',
    linkZiel: 'Link-Ziel',
    echteDomain: 'echte Domain',
    klartext: 'In Klarschrift',
    antwortAn: 'Antwort geht an',
    anhangGesperrt: 'Im Quiz werden keine Dateien geöffnet.',
    qrGesperrt: 'Einen QR-Code kannst du nicht vorab prüfen.',
    extern: 'EXTERN: Diese Nachricht stammt von außerhalb Ihrer Organisation.',
    an: 'An',
    heute: 'Heute',
    nichtKontakt: 'Nicht in deinen Kontakten',
    blockieren: 'Blockieren',
    hinzufuegen: 'Hinzufügen',
    textnachricht: 'Textnachricht',
    nachrichtSchreiben: 'Nachricht schreiben …',
    inmail: 'InMail',

    ergebnis: {
      richtig: 'Richtig!',
      falschPhishing: 'Leider daneben',
      falschEcht: 'Fehlalarm',
      istPhishing: 'Das war Phishing.',
      istEcht: 'Die Nachricht ist echt.'
    },
    hinweisArt: { warn: 'Warnsignal', ok: 'Spricht für echt', tipp: 'Gut zu wissen' },
    hinweisZaehler: 'Hinweis {{n}} von {{gesamt}}',
    weiter: 'Weiter',
    detailsAnzeigen: 'Details anzeigen',
    stempel: { phishing: 'Phishing', echt: 'Echt' },
    naechsteNachricht: 'Nächste Nachricht',
    zurAuswertung: 'Level-Auswertung anzeigen',
    ueberspringen: 'Hinweise überspringen',

    levelEnde: {
      kicker: 'Level {{n}} von {{gesamt}}',
      perfekt: 'Perfekt gelöst, dir ist kein Detail entgangen!',
      bestanden: 'Du hast Level {{n}} gemeistert.',
      knapp: 'Bleib dran und schärfe deinen Blick für Warnsignale!',
      bestandenAb: 'Bestanden ab',
      richtig: '{{richtig}} von {{gesamt}} richtig',
      abzeichen: 'Abzeichen freigeschaltet',
      zumNugget: 'Weiter zum Sicherheitstipp',
      naechstesLevel: 'Weiter zu Level {{n}}',
      zumErgebnis: 'Quiz abgeschlossen',
      wiederholen: 'Level {{n}} wiederholen',
      warPhishing: 'Phishing',
      warEcht: 'Echt'
    },

    nugget: { kicker: 'Sicherheitstipp', merke: 'Merke', zurueck: 'Zurück', weiter: 'Weiter' },

    finale: {
      kicker: 'Quiz abgeschlossen',
      titelTop: 'Ausgezeichnete Leistung!',
      titelGut: 'Sehr gut gemacht!',
      titelMittel: 'Gut gemacht!',
      titel: 'Guter Versuch!',
      text: 'Du hast {{richtig}}/{{gesamt}} richtig beantwortet.',
      absatz: 'Übung macht den Meister! Je besser du weißt, worauf du achten musst, desto sicherer bist du vor Phishing-Angriffen.',
      abzeichen: 'Deine Abzeichen',
      mitnehmen: 'Die wichtigsten Erkenntnisse',
      merksaetze: [
        'Nicht der Firmenname irgendwo im Link zählt, sondern die echte Domain.',
        'Prüfe Absender, Domain und Anlass – auch wenn die Nachricht professionell wirkt.',
        'Bestätige ungewöhnliche oder sensible Anfragen über einen zweiten, bekannten Kontaktweg.',
        'Persönliche Details sind kein Beweis für Echtheit.'
      ],
      lms: 'Dein Fortschritt wurde erfolgreich an das LMS übermittelt.',
      nochmal: 'Quiz erneut starten'
    },

    // wie im Original: eine Zeile wird zufällig gewählt
    hacker: {
      erwischt: ['I love to phish 🎣', 'Direkt ins Netz gegangen! 🎯', 'Ein Klick zu viel... 😈'],
      durchschaut: ['You got me! 🕶️', 'Mist, durchschaut! 💨', 'Gutes Auge! 👏'],
      finaleGut: 'Ich geb’s auf … 🏳️',
      finale: 'Bis zum nächsten Mal! 😏'
    },

    // Serie (Streak) oben rechts
    serie: {
      label: 'Serie',
      titel: '{{n}} richtige Antworten in Folge',
      // die Flamme spricht nur über die Serie
      erklaerung: 'Super, {{n}} richtig in Folge! Das ist deine Serie – jede weitere richtige Antwort lässt die Flamme wachsen.',
      lob: ['{{n}} richtig in Folge – deine Serie wächst!', 'Serie {{n}}! Die Flamme lodert.', '{{n}} am Stück – starke Serie!', 'Weiter so: {{n}} richtige Antworten in Folge!'],
      verloren: 'Serie beendet – die nächste richtige Antwort startet eine neue.',
      bisJokerEins: 'Noch eine richtige Antwort – dann gibt es einen Joker!',
      bisJoker: 'Noch {{n}} richtige Antworten bis zum nächsten Joker.',
      jokerVoll: 'Du hast schon {{n}} Joker – setz zuerst einen ein.'
    },

    // Joker: gibt es für eine Serie (siehe einstellungen.jokerBei); ein Klick zeigt einen Tipp zur aktuellen Nachricht
    joker: {
      name: 'Joker',
      tippTitel: 'Joker-Tipp',
      erster: 'Du hast einen Joker verdient! Klick auf mich, wenn du bei einer Nachricht einen Tipp brauchst.',
      // der Joker spricht nur über den Joker
      neu: ['Noch ein Joker – du hast jetzt {{n}}.', 'Deine Serie bringt dir einen Joker. Jetzt: {{n}}.', 'Joker Nummer {{n}} – heb ihn gut auf!'],
      erinnerung: 'Du hast {{n}} Joker. Klick auf mich, wenn du bei einer Nachricht einen Tipp brauchst.',
      spaeter: 'Heb mich für die nächste Nachricht auf – dort gebe ich dir einen Tipp.',
      schon: 'Den Tipp zu dieser Nachricht siehst du schon.',
      leer: 'Keine Joker übrig. Mit einer neuen Serie verdienst du weitere.',
      titel: 'Joker: {{n}} übrig – Klick für einen Tipp'
    }
  },

  /* ================================================================
     LEVEL 1 – Grundlagen & typische Warnsignale (Warm-up)
     ================================================================ */
  levels: [
    {
      kicker: 'Warm-up',
      titel: 'Grundlagen & typische Warnsignale',
      badge: 'Phishing-Novize',
      nachrichten: [
        {
          id: 'l2-msg-4', art: 'email', phishing: true,
          joker: 'Lies den Absender und den Namen des Anhangs ganz genau – bis zum letzten Zeichen.',
          titel: 'Bekomme ich jetzt mehr Gehalt?',
          lage: 'Eine E-Mail der Personalabteilung kündigt eine neue Gehaltstabelle im Anhang an.',
          von: { name: 'HR Personalabteilung', adresse: 'hr-abteilung@{{fake_doppel}}' },
          an: '{{email}}', zeit: 'Heute, 11:00',
          betreff: 'WICHTIG: Neue Gehaltstabelle & Inflationsprämie 2027',
          anhang: [{ name: 'Gehaltstabelle_2026.docx.exe', groesse: '2,4 MB' }],
          inhalt: `
<div style="color:#0f766e;font-family:Arial,Helvetica,sans-serif;font-size:.733em;font-weight:700;letter-spacing:.08em;margin:0 0 18px;">INTERNE MITTEILUNG</div>
<div style="border-left:4px solid #16c7a5;padding-left:14px;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
  <div style="margin-bottom:16px;">Liebe Kolleginnen und Kollegen,</div>
  <div>die Geschäftsführung hat eine Anpassung der Gehaltsstruktur für 2027 beschlossen. Die aktualisierte Übersicht sowie Informationen zur Inflationsprämie findet ihr im Anhang.<br><br></div>
  <div>Bitte prüft die für euch relevanten Informationen in der beigefügten Datei.</div>
</div>`,
          hinweise: [
            { id: 'a', bei: 'absender', art: 'warn', titel: 'Auffällige Firmen-Domain', klartext: '{{fake_doppel_m}}',
              text: 'Die Domain unterscheidet sich nur durch einen zusätzlichen Buchstaben von {{domain}}. Achte auch bei vertraut wirkenden Absendern auf kleine Abweichungen in der Domain.' },
            { id: 'b', bei: 'anhang', art: 'warn', titel: 'Tatsächliche Dateiendung prüfen',
              text: 'Trotz „.docx“ im Namen handelt es sich um eine ausführbare .exe-Datei, nicht um ein Word-Dokument. Entscheidend ist die tatsächliche Dateiendung am Ende des Dateinamens.' }
          ],
          // Korrektur: Original-Titel „Phishing-Versuch vereitelt!“ passte nicht, wenn man falsch geantwortet hat.
          kernTitel: 'Getarnter Anhang von einer fremden Domain.',
          kern: 'Prüfe unerwartete Anhänge und ihre vollständige Dateiendung genau.'
        },
        {
          id: 'l1-amazon-delivery-sms', art: 'sms', phishing: false,
          joker: 'Passt die SMS zu deiner Situation? Prüfe außerdem, wohin der Link wirklich führt.',
          titel: 'Der Fahrer schreibt mir?',
          lage: 'Du erwartest heute ein Amazon-Paket. Kurz vor der Zustellung kommt diese SMS.',
          von: { name: 'Amazon' },
          zeit: '09:44',
          nachrichten: ['Chat mit dem Fahrer: <mark data-h="a">Eine Nachricht zur Zustellung deines Amazon Pakets.</mark><br><br>Hier tippen, um zu antworten: <a data-ziel="https://amzn.eu/d/01Wc5tkv" data-h="b">https://amzn.eu/d/01Wc5tkv</a>'],
          hinweise: [
            { id: 'a', art: 'tipp', titel: 'Passender Anlass',
              text: 'Du erwartest tatsächlich eine Amazon-Lieferung. Aber Vorsicht: Auch Phishing-SMS nutzen Paketankündigungen als Köder. Ein passender Anlass allein beweist daher noch nicht, dass eine Nachricht echt ist.' },
            { id: 'b', art: 'ok', titel: 'Kurzer Amazon-Link',
              text: 'Dieser Kurzlink wird von Amazon verwendet. Ein verkürzter Link ist also nicht automatisch verdächtig. Wenn du unsicher bist, öffne die Amazon-App selbst und prüfe dort deine Lieferung.' }
          ],
          kernTitel: '',
          kern: 'Phishing kommt auch per SMS – etwa mit angeblichen Zustellproblemen, Zollgebühren oder fehlenden Adressdaten. Diese Nachricht ist jedoch eine echte Amazon-Benachrichtigung.'
        },
        {
          id: 'l2-msg-9', art: 'email', phishing: false,
          joker: 'Schau, von welcher Domain die E-Mail kommt und wohin der Button führt.',
          titel: 'Stefan Weber? Kenne ich den schon?',
          lage: 'Eine E-Mail informiert dich über eine neue Kontaktanfrage auf LinkedIn.',
          von: { name: 'LinkedIn Network', adresse: 'messages-noreply@linkedin.com' },
          an: '{{email}}', zeit: 'Gestern, 17:30',
          betreff: 'Dr. Stefan Weber möchte sich auf LinkedIn mit Ihnen vernetzen',
          // Korrektur: Link endete auf „12345“ – wirkte selbst verdächtig.
          inhalt: `
<div style="font-family:Arial,Helvetica,sans-serif;line-height:1.55;color:#1f2937;">
  <div style="display:flex;align-items:center;gap:10px;margin:0 0 20px 0;"><svg width="30" height="30" viewBox="0 0 24 24" style="display:block;"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="#0A66C2"></path></svg><div style="font-size:1.267em;font-weight:700;color:#0A66C2;">LinkedIn</div></div>
  <div>Hallo {{vorname}},</div>
  <div style="margin-top:16px;background:#f3f6f8;border:1px solid #e1e6ea;border-radius:10px;padding:16px;">
    <div style="display:flex;align-items:center;gap:12px;">
      <div style="width:44px;height:44px;border-radius:50%;background:#dbeafe;color:#0A66C2;font-weight:700;display:flex;align-items:center;justify-content:center;flex:0 0 auto;">SW</div>
      <div><div style="font-weight:700;color:#111827;">Dr. Stefan Weber</div><div style="font-size:.8em;color:#64748b;">Senior IT Security Manager bei CyberGuard</div></div>
    </div>
    <div style="margin-top:14px;">möchte sich mit Ihnen vernetzen.</div>
  </div>
  <div style="margin-top:18px;"><a data-ziel="https://www.linkedin.com/comm/mynetwork/invite-accept/7389216054" style="display:inline-block;background:#0A66C2;color:#fff;text-decoration:none;font-weight:700;padding:10px 16px;border-radius:18px;">Einladung annehmen</a></div>
</div>`,
          hinweise: [
            { id: 'a', bei: 'absender', art: 'ok', titel: 'Absender-Domain passt',
              text: 'Die Absenderadresse verwendet die offizielle Domain linkedin.com. Das ist ein positives Signal – prüfe trotzdem, ob die Anfrage für dich plausibel ist.' }
          ],
          kernTitel: '',
          kern: 'Absender und Nachricht passen zu LinkedIn. Eine unbekannte Kontaktanfrage allein ist kein Hinweis auf Phishing.'
        },
        {
          id: 'l3-msg-2', art: 'sms', phishing: true,
          joker: 'Fahre über den Link: Gehört die Domain direkt vor der Endung wirklich deiner Bank?',
          titel: 'Das ist nicht meine Überweisung!',
          lage: 'An der Supermarktkasse vibriert dein Handy. Eine SMS meldet eine vorgemerkte Zahlung über 1.250 Euro.',
          von: { name: 'Commerzbank Security', info: '+49 174 881293' },
          zeit: '10:20',
          nachrichten: ['Commerzbank Info: Eine ungewöhnliche Überweisung von 1.250,00 EUR an iBanking Ltd wurde vorgemerkt. <mark data-h="b">Stornierung sofort</mark> unter: <a data-ziel="https://commerzbank-sicherheit-service.com/storno" data-h="a">https://commerzbank-sicherheit-service.com/storno</a>'],
          hinweise: [
            { id: 'a', art: 'warn', titel: 'Verdächtiges Link-Ziel',
              text: 'Die Domain klingt nach Commerzbank, ist aber nicht die offizielle Domain commerzbank.de. Öffne bei verdächtigen Banknachrichten die Banking-App oder Website selbst, statt dem Link zu folgen.' },
            { id: 'b', art: 'warn', titel: 'Druck durch angebliche Überweisung',
              text: 'Ein hoher Betrag und die Aufforderung, sofort zu handeln, erzeugen gezielt Druck. Lass dich davon nicht zum schnellen Klicken verleiten und prüfe die Meldung über deine Banking-App.' }
          ],
          kernTitel: '',
          kern: 'Bei verdächtigen Banknachrichten: Öffne deine Banking-App oder die Website selbst, statt dem Link in der Nachricht zu folgen.'
        },
        {
          id: 'l5-msg-10', art: 'email', phishing: false,
          joker: 'Prüfe die Absender-Domain. Und frag dich: Will die Nachricht, dass du etwas tust oder preisgibst?',
          titel: 'In deinem Postfach landet ein Microsoft-Sicherheitscode.',
          lage: '',
          von: { name: 'Microsoft-Kontoteam', adresse: 'account-security-noreply@accountprotection.microsoft.com' },
          an: '{{email}}', zeit: 'Heute, 14:00',
          betreff: 'Microsoft-Konto-Sicherheitscode: 849201',
          inhalt: `
<div style="font-family:Arial,Helvetica,sans-serif;line-height:1.55;color:#1f2937;">
  <div style="display:flex;align-items:center;gap:10px;margin:0 0 22px 0;"><svg width="28" height="28" viewBox="0 0 24 24" style="display:block;"><rect x="0" y="0" width="11.3" height="11.3" fill="#F25022"/><rect x="12.7" y="0" width="11.3" height="11.3" fill="#7FBA00"/><rect x="0" y="12.7" width="11.3" height="11.3" fill="#00A4EF"/><rect x="12.7" y="12.7" width="11.3" height="11.3" fill="#FFB900"/></svg><div style="font-size:1.2em;font-weight:600;color:#444;">Microsoft</div></div>
  <div>Verwenden Sie den folgenden Sicherheitscode für das Microsoft-Konto:</div>
  <div style="margin:20px 0;border:1px solid #d9dde3;background:#f7f8fa;border-radius:8px;padding:16px;text-align:center;">
    <div style="font-size:.733em;color:#6b7280;text-transform:uppercase;letter-spacing:.06em;">Sicherheitscode</div>
    <div style="font-size:2em;letter-spacing:6px;color:#0078d4;font-weight:700;margin-top:5px;">849201</div>
  </div>
  <div style="color:#4b5563;"><mark data-h="b">Wenn Sie diesen Code nicht angefordert haben</mark>, können Sie diese E-Mail ignorieren.</div>
</div>`,
          hinweise: [
            { id: 'a', bei: 'absender', art: 'ok', titel: 'Offizielle Microsoft-Domain',
              text: 'Die Adresse gehört zur offiziellen Domain microsoft.com. Das spricht dafür, dass die Nachricht tatsächlich von Microsoft stammt.' },
            // Korrektur: im Original als Warnsignal markiert, obwohl die Nachricht echt ist – jetzt „Gut zu wissen“.
            { id: 'b', art: 'tipp', titel: 'Nicht angefordert? Aufmerksam werden',
              text: 'Die Nachricht kann echt sein, obwohl du den Code nicht selbst angefordert hast. Nutze oder teile den Code nicht und prüfe dein Konto über den bekannten Zugang.' }
          ],
          kernTitel: '',
          kern: 'Die E-Mail selbst ist echt. Hast du den Code nicht angefordert, kann das aber auf einen fremden Anmeldeversuch hindeuten. Teile den Code niemals mit anderen.'
        }
      ]
    },

    /* ================================================================
       LEVEL 2 – Domains, Links & Kontext (Fortgeschritten)
       ================================================================ */
    {
      kicker: 'Fortgeschritten',
      titel: 'Domains, Links & Kontext',
      badge: 'Link-Detektiv',
      nachrichten: [
        {
          id: 'l2-msg-1', art: 'email', phishing: true,
          joker: 'Lies die Absenderadresse Zeichen für Zeichen und prüfe, wohin der Button wirklich führt.',
          titel: '489 Euro? Ich habe doch gar nichts bestellt!',
          lage: 'Beim Blick ins Postfach entdeckst du eine Zahlungsbestätigung für einen unbekannten Einkauf.',
          von: { name: 'PayPal Kundenservice', adresse: 'service@paypaI.com' },
          an: '{{email}}', zeit: 'Heute, 09:40',
          betreff: 'Bestätigung Ihres Einkaufs bei TechStore GmbH (489,00 €)',
          inhalt: `
<div style="font-family:Arial,Helvetica,sans-serif;line-height:1.55;color:#1f2937;">
  <div style="text-align:center;margin:0 0 22px 0;"><img src="assets/m-paypal.webp" alt="PayPal" style="display:block;margin:0 auto;max-width:140px;width:auto;height:auto;max-height:60px;object-fit:contain;"></div>
  <div>Guten Tag,</div>
  <div style="margin-top:16px;">Sie haben eine Zahlung an TechStore GmbH autorisiert.</div>
  <div style="margin-top:16px;background:#f4f7fb;border-radius:9px;padding:15px 16px;text-align:center;">
    <div style="font-size:.8em;color:#64748b;">TechStore GmbH</div>
    <div style="font-size:1.8em;font-weight:700;color:#172033;margin-top:3px;">489,00 EUR</div>
  </div>
  <div style="margin-top:16px;">Falls Sie diese Transaktion nicht erkennen, prüfen Sie die Details in Ihrem Sicherheitscenter.</div>
  <div style="margin-top:20px;text-align:center;"><a data-ziel="https://www.paypal.com.security-dispute-resolution.com/login" data-h="b" style="display:inline-block;background:#0070E0;color:#fff;padding:11px 18px;text-decoration:none;border-radius:20px;font-weight:700;">Transaktion stornieren</a></div>
</div>`,
          hinweise: [
            { id: 'a', bei: 'absender', art: 'warn', titel: 'Täuschend ähnliche Domain', klartext: 'service@paypa[I].com',
              text: 'Das vermeintliche kleine „L“ in paypal.com ist tatsächlich ein großes „i“. Solche ähnlich aussehenden Zeichen können eine gefälschte Domain auf den ersten Blick echt wirken lassen.' },
            { id: 'b', art: 'warn', titel: 'Entscheidend ist die echte Domain',
              text: 'Im Link steht zwar paypal.com, die tatsächliche Domain ist aber security-dispute-resolution.com. Sie gehört nicht zu PayPal.' }
          ],
          kernTitel: 'Hier lohnt sich ein genauer Blick auf die Domain.',
          kern: 'Gefälschte Adressen können bekannten Domains täuschend ähnlich sehen. Prüfe deshalb Absender und Link-Ziel genau.'
        },
        {
          id: 'ai-img-1790147331698', art: 'email', phishing: false,
          joker: 'Passt die Freigabe zu deinem Tag? Prüfe, ob Absender und Link-Ziel zu bekannten Diensten gehören.',
          titel: 'Ein Blick auf die Zahlen vor dem Meeting.',
          lage: 'Du bereitest dich auf die Finanzbesprechung vor, als eine Dateifreigabe von Anna Müller eintrifft.',
          von: { name: 'Müller, Anna', adresse: 'Anna.Mueller@{{domain}}' },
          an: '{{email}}', zeit: 'Heute, 07:08',
          betreff: 'Monatsabschluss_Q2_Vertraulich.pdf wurde für Sie freigegeben',
          inhalt: `
<div style="background-color:#f3f3f3;color:#323130;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;padding:30px 20px;border-radius:8px;">
  <div style="max-width:550px;margin:0 auto;background-color:#ffffff;border:1px solid #d2d0ce;border-radius:8px;overflow:hidden;">
    <div style="background-color:#ffffff;text-align:center;padding:28px 24px 36px;">
      <svg width="48" height="48" viewBox="0 0 64 64" fill="none" aria-hidden="true" style="display:block;margin:0 auto 38px;"><path d="M9 22V55H46V47" stroke="#0078d4" stroke-width="3.5" stroke-linecap="square"></path><path d="M43 9L58 24L43 39V29C32 29 24 33 19 41C19 26 28 17 43 17V9Z" stroke="#0078d4" stroke-width="3.5" stroke-linejoin="miter"></path></svg>
      <h2 style="color:#323130;font-size:1.467em;font-weight:600;margin:0;line-height:1.4;">Anna Müller (Finance) hat ein SharePoint-Dokument mit Ihnen geteilt</h2>
    </div>
    <div style="background-color:#f8f8f8;padding:0 30px 30px;border-top:1px solid #d2d0ce;">
      <p style="color:#605e5c;font-size:.933em;margin:25px 0;">Anna Müller (Finance) hat das folgende Dokument für Sie freigegeben.</p>
      <div style="border:1px solid #d2d0ce;border-radius:6px;padding:15px;margin-bottom:25px;display:flex;align-items:center;justify-content:center;background-color:#ffffff;">
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="background-color:#d13438;color:white;padding:5px 7px;border-radius:3px;font-weight:bold;font-size:.733em;">PDF</div>
          <span style="color:#323130;font-weight:500;">Monatsabschluss_Q2_Vertraulich.pdf</span>
        </div>
      </div>
      <div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:25px;color:#605e5c;font-size:.8em;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
        <span>Dieses Dokument wurde über Microsoft SharePoint freigegeben.</span>
      </div>
      <div style="text-align:center;"><a data-ziel="https://{{tenant}}.sharepoint.com/sites/finance/Shared%20Documents/Monatsabschluss_Q2_Vertraulich.pdf" data-h="b" style="background-color:#0078d4;color:#ffffff;text-decoration:none;padding:10px 32px;border-radius:4px;font-weight:500;font-size:.933em;display:inline-block;">Dokument in SharePoint öffnen</a></div>
    </div>
  </div>
  <div style="text-align:center;margin-top:25px;"><p style="color:#605e5c;font-size:.733em;max-width:450px;margin:0 auto;line-height:1.4;">Microsoft 365 · SharePoint</p></div>
</div>`,
          hinweise: [
            { id: 'a', bei: 'absender', art: 'ok', titel: 'Bekannte Unternehmens-Domain',
              text: 'Die Absenderadresse verwendet die bekannte Unternehmens-Domain. Auch der genannte Absender Anna Müller aus Finance passt zum Anlass der Freigabe.' },
            { id: 'b', art: 'ok', titel: 'Offizielles Link-Ziel',
              text: 'Der Link führt zu einer offiziellen Microsoft-Adresse unter sharepoint.com. Das spricht hier zusammen mit Absender und Anlass für eine legitime Freigabe.' }
          ],
          kernTitel: '',
          kern: 'Absender, Link-Ziel und Anlass sind plausibel und passen zusammen. Nicht jede unerwartete Dateifreigabe ist Phishing.'
        },
        {
          id: 'l3-msg-9', art: 'email', phishing: false,
          joker: 'Erwartest du diese Nachricht laut Situation? Prüfe, auf welche Domain der Link zeigt.',
          titel: 'Da war doch noch was …',
          lage: 'Nach deiner letzten Dienstreise steht deine Reisekostenabrechnung noch aus. Jetzt kommt eine Erinnerung per E-Mail.',
          von: { name: 'Personalabteilung', adresse: 'hr-benefits@{{domain}}' },
          an: '{{email}}', zeit: 'Gestern, 11:30',
          betreff: 'Erinnerung: Einreichung der Reisekosten',
          inhalt: `
<div style="font-family:Arial,Helvetica,sans-serif;line-height:1.55;color:#1f2937;">
  <div style="font-size:.733em;font-weight:700;letter-spacing:.08em;color:#64748b;margin-bottom:18px;">INTERNE ERINNERUNG</div>
  <div>Guten Tag {{name}},<br><br>bitte denken Sie daran, Ihre noch offenen Reisekostenabrechnungen für den abgelaufenen Monat bis zum Ende des Quartals im HR-Portal einzureichen.</div>
  <div style="margin-top:18px;">Link zum Portal:<br><a data-ziel="https://intranet.{{domain}}/hr/reisekosten" data-h="a" style="color:#2563eb;font-weight:700;word-break:break-word;">https://intranet.{{domain}}/hr/reisekosten</a></div>
</div>`,
          hinweise: [
            { id: 'a', art: 'ok', titel: 'Passendes Link-Ziel',
              text: 'Der Link führt zum internen Portal auf der bekannten Unternehmens-Domain {{domain}}. Das passt zum Anlass der Nachricht.' }
          ],
          kernTitel: '',
          kern: 'Der Anlass passt zu deiner Situation. Auch Absender und Link-Ziel sind plausibel und gehören zum Unternehmen.'
        },
        {
          id: 'ai-img-1790160787284', art: 'email', phishing: true,
          joker: 'Vergleiche die Absender-Domain Buchstabe für Buchstabe mit deiner Firmen-Domain – und fahre über den Link.',
          titel: 'Bin ich auch auf den Fotos?',
          lage: 'Nach dem Sommerfest erhältst du eine Einladung zu einer neuen Teams-Gruppe. Dort sollen Fotos vom Fest geteilt werden.',
          von: { name: 'Microsoft Teams', adresse: 'teams@{{fake_tausch}}' },
          an: '{{email}}', zeit: 'Heute, 10:53',
          betreff: 'Sie wurden zu einer neuen Arbeitsgruppe hinzugefügt in Microsoft Teams',
          inhalt: `
<div style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#ffffff;padding:20px 0;">
  <div style="max-width:600px;margin:0 auto;background-color:#edf0f4;border-top:4px solid #5753b1;padding:22px 16px 76px;box-sizing:border-box;text-align:center;color:#19253b;">
    <h2 data-h="d" style="display:inline-block;color:#5753b1;margin:0 0 22px;font-size:1.6em;line-height:1.3;font-weight:400;">Microsoft Teams</h2>
    <h3 style="color:#19253b;font-size:1.333em;line-height:1.2;font-weight:700;margin:0 auto 24px;max-width:520px;">Sie wurden zu einer neuen Arbeitsgruppe hinzugefügt<br>„<mark data-h="c">Sommerfest – Fotos &amp; Rückblick</mark>“ in Microsoft Teams.</h3>
    <div style="width:100%;max-width:292px;margin:0 auto;background-color:#ffffff;">
      <div style="padding:48px 10px 0;">
        <h4 style="color:#19253b;font-size:1.333em;line-height:1.3;margin:0 0 16px;font-weight:700;">Arbeitsgruppe</h4>
        <p style="color:#19253b;font-size:1.2em;line-height:1.4;font-weight:700;margin:0 0 14px;">„Sommerfest – Fotos &amp; Rückblick“</p>
        <p style="color:#536078;font-size:.933em;line-height:1.5;margin:0 0 12px;">38 Mitglieder</p>
        <div style="border-top:1px solid #dfe3eb;padding:13px 0;"><p style="color:#536078;font-size:.933em;line-height:1.5;margin:0;">Die schönsten Bilder vom Sommerfest – jetzt ansehen und eigene Fotos teilen.</p></div>
      </div>
      <a data-ziel="https://microsoft-teams.{{fake_tausch}}/join/sommerfest" data-h="b" style="display:block;background-color:#5753b1;color:#ffffff;text-decoration:none;padding:13px 10px;font-size:.933em;line-height:1.3;font-weight:600;text-align:center;">Öffnen Sie Microsoft Teams</a>
    </div>
  </div>
</div>`,
          hinweise: [
            // Korrektur: Text nannte fest „unternehmen.de“ statt der eigenen Domain.
            { id: 'a', bei: 'absender', art: 'warn', titel: 'Abweichende Firmen-Domain', klartext: '{{fake_tausch_m}}',
              text: 'Die Domain {{fake_tausch}} ähnelt der echten Firmen-Domain {{domain}}, ist aber eine andere Adresse. Prüfe deshalb die vollständige Absenderadresse und nicht nur den vertrauten Namen „Microsoft Teams“.' },
            // Korrektur: Tippfehler „Verächtlicher“ → „Verdächtiger“.
            { id: 'b', art: 'warn', titel: 'Verdächtiger Link-Aufruf',
              text: '„Microsoft Teams“ taucht zwar im Link auf, die tatsächliche Domain gehört aber nicht zu Microsoft. Der Link führt auf eine gefälschte Microsoft-Anmeldeseite, die deine Zugangsdaten abgreifen soll.' },
            { id: 'c', art: 'tipp', titel: 'Passt die Einladung zum Kontext?',
              text: 'Gab es tatsächlich ein Sommerfest? Werden Fotos bei euch über eine neue Teams-Gruppe geteilt? Ein plausibel klingender Anlass ist noch kein Beweis, dass die Einladung echt ist.' },
            // Korrektur: im Original ohne Textstelle – jetzt auf das Teams-Logo gesetzt.
            { id: 'd', art: 'tipp', titel: 'Vertrautes Design ist keine Garantie',
              text: 'Logo, Farben und Gestaltung lassen sich leicht nachahmen. Verlasse dich deshalb nicht allein darauf, dass eine Nachricht wie ein bekanntes Tool aussieht.' }
          ],
          kernTitel: 'Auch vertraute Tools können als Köder dienen.',
          kern: 'Schauen wir uns das genauer an.'
        },
        {
          id: 'l4-msg-3', art: 'email', phishing: true,
          joker: 'Was genau soll sich hier ändern? Überleg, wie du so eine Änderung normalerweise bestätigen würdest.',
          titel: 'Der Lieferant hat plötzlich eine neue IBAN.',
          lage: 'In der Einkaufsabteilung kommt eine Mitteilung über geänderte Zahlungsdaten an.',
          von: { name: 'Auenberg Baustoffe GmbH', adresse: 'buchhaltung@auenberg-baustoffe.de' },
          an: 'einkauf@{{domain}}', zeit: 'Heute, 10:45',
          betreff: 'Wichtig: Geänderte Bankverbindung für künftige Rechnungen',
          inhalt: `
<div style="background:#f5f8fb;color:#334155;border-left:4px solid #6487a5;padding:12px 16px;margin-bottom:24px;"><strong>Hinweis:</strong> <mark data-h="a">Externer Absender – bitte vorsichtig sein.</mark></div>
<div style="font-family:Arial,Helvetica,sans-serif;line-height:1.55;color:#1f2937;">
  <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;padding-bottom:12px;border-bottom:2px solid #eadfc9;">
    <svg width="36" height="30" viewBox="0 0 34 30" style="display:block;"><path d="M2 25 10 8l6 9 5-13 11 21H2z" fill="#A87623"></path><path d="m10 8 6 9 2.2-4.9" fill="none" stroke="#fff" stroke-width="2"></path></svg>
    <div><div style="font-size:1.2em;font-weight:700;color:#6b4a17;">Auenberg Baustoffe</div><div style="font-size:.733em;color:#8a7350;">Baustoffe · Handel · Logistik</div></div>
  </div>
  <div>Sehr geehrte Damen und Herren,</div>
  <div style="margin-top:16px;">im Zuge einer Umstellung unserer Bankverbindung <mark data-h="b">haben sich unsere Zahlungsdaten geändert</mark>. Bitte verwenden Sie für alle zukünftigen Überweisungen ab sofort folgende Bankverbindung:</div>
  <div style="margin-top:18px;background:#fbf8f2;border:1px solid #eadfc9;border-radius:8px;padding:14px 16px;">
    <div style="font-size:.733em;color:#8a7350;text-transform:uppercase;">Neue Bankverbindung</div>
    <div style="margin-top:5px;font-weight:700;color:#2f2a24;word-break:break-word;"><mark data-h="c">ES59 9999 9999 99 1234 5678 90 (Spanien)</mark></div>
  </div>
  <div style="margin-top:18px;">Mit freundlichen Grüßen,<br>Auenberg Baustoffe GmbH</div>
</div>`,
          hinweise: [
            { id: 'a', art: 'tipp', titel: 'Externer Absender',
              text: 'Manche E-Mail-Programme kennzeichnen Nachrichten von außerhalb der eigenen Firma. Bei einem Lieferanten ist das normal und allein kein Phishing-Anzeichen.' },
            // Korrektur: im Original trugen zwei Hinweise denselben Titel.
            { id: 'b', art: 'warn', titel: 'Geänderte Zahlungsdaten per E-Mail',
              text: 'Änderungen von Zahlungsdaten solltest du nie allein aufgrund einer E-Mail übernehmen. Bestätige sie über bereits bekannte Kontaktdaten des Lieferanten.' },
            { id: 'c', art: 'warn', titel: 'Unerwartete ausländische Bankverbindung',
              text: 'Eine ausländische IBAN ist nicht automatisch verdächtig. Der unerwartete Wechsel in ein anderes Land ist hier aber ein zusätzlicher Grund, die neuen Zahlungsdaten unabhängig zu bestätigen.' }
          ],
          kernTitel: 'Bei geänderten Bankdaten ist besondere Vorsicht geboten.',
          kern: 'Bestätige geänderte Bankdaten immer über einen bereits bekannten Kontaktweg – nicht über Kontaktdaten aus der Nachricht selbst.'
        }
      ]
    },

    /* ================================================================
       LEVEL 3 – Social Engineering & Verifikation (Expertenmodus)
       ================================================================ */
    {
      kicker: 'Expertenmodus',
      titel: 'Social Engineering & Verifikation',
      badge: 'Security-Profi',
      nachrichten: [
        {
          id: 'l5-msg-1', art: 'email', phishing: true,
          joker: 'Wie wird so etwas bei euch normalerweise eingerichtet? Passt der Weg, den die E-Mail vorschlägt, dazu?',
          titel: 'Soll ich meine Zwei-Faktor-Authentifizierung wirklich neu einrichten?',
          lage: 'Am Morgen kommt eine angeblich verpflichtende Nachricht zur Einrichtung einer neuen Authenticator-App.',
          von: { name: 'IT Infrastructure Security', adresse: 'mfa-security@{{domain}}' },
          an: '{{email}}', zeit: 'Heute, 08:00',
          betreff: 'Pflicht: Neue Authenticator-App einrichten',
          inhalt: `
<div style="font-family:Arial,Helvetica,sans-serif;line-height:1.55;color:#1f2937;">
  <div style="font-size:.733em;font-weight:700;letter-spacing:.08em;color:#2563eb;margin-bottom:18px;">SICHERHEITSHINWEIS</div>
  <div>Sehr geehrte Mitarbeiterinnen und Mitarbeiter,</div>
  <div style="margin-top:16px;">um unsere Systeme vor Cyberangriffen zu schützen, stellen wir heute auf die neue Authenticator-App um.</div>
  <div style="margin-top:16px;background:#f3f7ff;border-left:4px solid #2563eb;border-radius:8px;padding:14px 16px;">Bitte scannen Sie den untenstehenden QR-Code mit Ihrem Smartphone, um die Authenticator-App einzurichten.</div>
  <div class="m-qr" data-ziel="https://m365-login-proxy.auth-setup.app/qr-auth" data-h="b" style="margin:18px auto 0;width:max-content;max-width:100%;text-align:center;">
    <img src="assets/m-qr.webp" alt="QR-Code" style="display:block;margin:0 auto;max-height:240px;width:auto;object-fit:contain;">
    <div style="margin-top:8px;font-size:.8em;color:#6b7280;">QR-Code mit Kamera scannen</div>
  </div>
</div>`,
          hinweise: [
            { id: 'a', bei: 'absender', art: 'tipp', titel: 'Plausible Absenderadresse',
              text: 'Die Adresse nutzt die Unternehmens-Domain und wirkt daher plausibel. Das allein macht die Nachricht jedoch nicht vertrauenswürdig.' },
            { id: 'b', art: 'warn', titel: 'Unerwarteter QR-Code für 2FA',
              text: 'Eine unerwartete Aufforderung, die Zwei-Faktor-Authentifizierung über einen zugesandten QR-Code neu einzurichten, ist ein Warnsignal. Starte die Einrichtung stattdessen über das bekannte Portal oder kläre sie mit der IT.' }
          ],
          kernTitel: 'Bei unerwarteten Aufforderungen zur Zwei-Faktor-Authentifizierung ist Vorsicht geboten.',
          kern: 'Richte die Zwei-Faktor-Authentifizierung nur über bekannte und vertrauenswürdige Wege ein. Prüfe unerwartete Aufforderungen über das bekannte Portal oder direkt bei der IT.'
        },
        {
          id: 'l4-msg-1', art: 'email', phishing: true,
          joker: 'Prüfe die Absender-Domain genau und fahre über die Adresse: An wen würde deine Antwort gehen?',
          titel: 'Eine Nachricht der Geschäftsführung.',
          lage: 'Kurz nach Arbeitsbeginn erhältst du eine E-Mail der Geschäftsführung mit der Bitte um eine Überweisung.',
          von: { name: 'Dr. Hans Meier | Geschäftsführung', adresse: 'ceo.office@{{fake_glyph}}', hover: 'extern.finance@protonmail.com' },
          an: 'finanzen@{{domain}}', zeit: 'Heute, 08:05',
          betreff: 'Dringende Zahlungsanweisung zur Firmenübernahme',
          inhalt: `
<div style="line-height:1.55;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
  <div style="color:#b42318;font-size:.733em;display:inline-block;background:#fff1f2;border:1px solid #fecdd3;border-radius:999px;padding:4px 9px;font-weight:700;letter-spacing:.06em;margin-bottom:18px;">STRENG VERTRAULICH</div>
  <div>Hallo {{vorname}},</div>
  <div style="margin-top:16px;">ich bin gerade in vertraulichen Gesprächen zu einer möglichen Firmenübernahme. Bitte veranlassen Sie hierfür eine Überweisung über&nbsp;<strong><mark data-h="c">45.000 €</mark></strong> auf das folgende Treuhandkonto.<br><br></div>
  <div>IBAN: DE89 1001 0010 1234 5678 90</div>
  <div>Empfänger: Apex M&amp;A Advisory Ltd.<br><br></div>
  <div><b>Da die Gespräche noch nicht öffentlich sind, behandeln Sie die Angelegenheit bitte <mark data-h="b">streng vertraulich</mark> und stimmen Sie sich vorerst nicht mit anderen Kollegen ab.</b></div>
  <div style="margin-top:18px;">Beste Grüße,<br>Dr. Hans Meier (CEO)</div>
</div>`,
          hinweise: [
            { id: 'a', bei: 'absender', art: 'warn', titel: 'Täuschend ähnliche Firmen-Domain', klartext: '{{fake_glyph_m}}',
              text: 'Die Absender-Domain wurde gegenüber {{domain}} leicht verändert. Solche kleinen Abweichungen können leicht übersehen werden.' },
            { id: 'b', art: 'warn', titel: 'Geheimhaltung als Druckmittel',
              text: 'Die Aufforderung zur Geheimhaltung soll verhindern, dass du den ungewöhnlichen Zahlungsauftrag intern überprüfst. Bestätige solche Anweisungen über einen bekannten, unabhängigen Kontaktweg.' },
            { id: 'c', art: 'warn', titel: 'Ungewöhnliche Zahlungsanweisung',
              text: 'Eine ungewöhnlich hohe Zahlung im Namen der Geschäftsführung solltest du nicht allein aufgrund einer E-Mail ausführen. Bestätige den Auftrag über einen bekannten, unabhängigen Kontaktweg.' }
          ],
          kernTitel: 'Hier sprechen mehrere Warnsignale für Betrug.',
          kern: 'Ungewöhnliche Zahlungsanweisung, Autorität und Geheimhaltung sind eine riskante Kombination.'
        },
        {
          id: 'l4-msg-9', art: 'teams', phishing: true,
          joker: 'Frag dich: Was genau sollst du hier herausgeben – und wofür ist das eigentlich gedacht?',
          titel: 'Die IT braucht meinen Anmeldecode',
          lage: 'In einem internen Chat bittet dich ein vermeintlicher Administrator um einen Einmal-Code.',
          von: { name: 'IT-Administrator', info: 'IT-Service', initialen: 'IT' },
          zeit: '15:45',
          // Korrektur: Die markierte Stelle („Einmal-Passwort (OTP) senden“) kam in der Nachricht gar nicht vor.
          nachrichten: ['Hi {{vorname}}, wir testen gerade das neue SSO-Login. <mark data-h="a">Kannst du mir kurz den Anmeldecode schicken</mark>, den du eben bekommen hast? Brauche ihn zum Testen. Danke!'],
          hinweise: [
            { id: 'a', art: 'warn', titel: 'Anmeldecode wird angefordert',
              text: 'Einmalcodes bestätigen deine Anmeldung. Auch ein Administrator braucht diesen Code nicht von dir.' }
          ],
          kernTitel: 'Anmeldecodes gehören nur dir.',
          kern: 'Einmalcodes bestätigen deine Anmeldung. Gib sie niemals an andere Personen weiter – auch nicht an vermeintliche Administratoren.'
        },
        {
          id: 'l3-msg-6', art: 'email', phishing: false,
          joker: 'Erwartest du dieses Dokument laut Situation? Prüfe die Absender-Domain und wohin der Button führt.',
          titel: 'Da fehlt noch meine Unterschrift.',
          lage: 'Ein neues Projekt steht an. Zwischen deinen E-Mails liegt eine Bitte, eine Geheimhaltungsvereinbarung zu unterschreiben.',
          von: { name: 'Docusign Signatur-Service', adresse: 'dse@docusign.net' },
          an: '{{email}}', zeit: 'Heute, 14:00',
          betreff: 'Bitte signieren Sie: Geheimhaltungsvereinbarung_NDA_2026.pdf',
          inhalt: `
<div style="font-family:Arial,Helvetica,sans-serif;line-height:1.55;color:#1f2937;">
  <div style="display:flex;align-items:center;gap:10px;margin-bottom:22px;"><svg width="38" height="30" viewBox="0 0 34 28" style="display:block;"><path d="M2 2h15v7H9v8H2z" fill="#4C01FC"/><path d="M17 2h8c4 0 7 3 7 7v7h-8V9h-7z" fill="#FF5A67"/><path d="M9 17h8v9H9z" fill="#4C01FC"/></svg><div style="font-size:1.267em;font-weight:700;color:#27214f;">Docusign</div></div>
  <div>Dr. Markus Bauer hat Ihnen ein Dokument zur elektronischen Signatur gesendet.</div>
  <div style="margin-top:18px;background:#faf9ff;border:1px solid #ded9ff;border-radius:9px;padding:14px 16px;">
    <div style="font-size:.733em;color:#716a9a;text-transform:uppercase;">Dokument</div>
    <div style="font-weight:700;color:#172033;margin-top:4px;word-break:break-word;">Geheimhaltungsvereinbarung_NDA_2026.pdf</div>
  </div>
  <div style="margin-top:20px;"><a data-ziel="https://na3.docusign.net/Signing/StartInSequence.aspx?g=88123-998" style="display:inline-block;background:#4C01FC;color:#fff;text-decoration:none;font-weight:700;padding:11px 17px;border-radius:6px;">Dokument prüfen &amp; signieren</a></div>
</div>`,
          hinweise: [
            { id: 'a', bei: 'absender', art: 'ok', titel: 'Offizielle Docusign-Domain',
              text: 'Die Nachricht verwendet die offizielle Docusign-Domain. Zusätzlich passt die Signaturanfrage zum erwarteten Projektkontext.' }
          ],
          kernTitel: '',
          kern: 'Auch externe Signaturanfragen können echt sein. Entscheidend ist, ob Absender, Link-Ziel und der erwartete Geschäftskontext zusammenpassen.'
        },
        {
          id: 'l3-hotel-payment-phishing', art: 'email', phishing: true,
          joker: 'Erinnere dich: Wann und wie wolltest du bezahlen? Prüfe außerdem, wohin der Link führt.',
          titel: 'Mit meiner Hotelbuchung stimmt etwas nicht?',
          lage: 'Du hast im Hotel Seeblick gebucht und erinnerst dich: Bezahlt wird erst vor Ort. Jetzt kommt diese E-Mail.',
          von: { name: 'Hotel Seeblick · Reservierung', adresse: 'reservierung@hotel-seeblick.host' },
          an: '{{email}}', zeit: 'Heute, 16:20',
          betreff: 'Handlungsbedarf zu Ihrer Buchung HB-72941',
          inhalt: `
<div style="background:#ffffff;color:#323130;font-family:Arial,Helvetica,sans-serif;line-height:1.6;">
  <div style="color:#345c65;border-bottom:2px solid #dce7e9;padding-bottom:16px;margin-bottom:22px;"><strong style="font-size:1.533em;">Hotel Seeblick</strong><br><span style="font-size:.8em;">Ihre Reservierung</span></div>
  <p>Guten Tag {{name}},</p>
  <p>wir freuen uns auf Ihren Aufenthalt bei uns. Zu Ihrer Reservierung liegen folgende Angaben vor:</p>
  <div style="background:#f3f7f8;border:1px solid #dce7e9;border-radius:6px;padding:14px;"><mark data-h="a">HB-72941 · 16.–19. Oktober · Doppelzimmer · 420 €</mark></div>
  <p>Bei der Überprüfung Ihrer Buchung konnte die hinterlegte Zahlungsgarantie nicht bestätigt werden. Wir bitten Sie daher, <mark data-h="b">Ihre Zahlungsdaten erneut zu bestätigen</mark>, damit Ihre Reservierung bestehen bleibt.</p>
  <p>Bitte schließen Sie die Bestätigung <mark data-h="c">innerhalb von 24 Stunden</mark> ab. Andernfalls wird Ihre Buchung automatisch storniert.</p>
  <p style="margin:24px 0;"><a data-ziel="https://gast-zahlung.host/buchung/HB-72941" data-h="d" style="display:inline-block;background:#345c65;color:#ffffff;padding:12px 20px;border-radius:4px;text-decoration:none;font-weight:700;">Zahlungsdaten bestätigen</a></p>
  <p>Vielen Dank für Ihre Mithilfe.<br>Ihr Reservierungsteam<br>Hotel Seeblick</p>
</div>`,
          hinweise: [
            { id: 'a', art: 'warn', titel: 'Buchungsdetails beweisen nichts',
              text: 'Auch Betrüger können echte Buchungsdaten kennen, etwa nach einem gehackten Hotelkonto. Richtige Angaben machen die Anfrage nicht automatisch echt.' },
            { id: 'b', art: 'warn', titel: 'Plötzlich Zahlungsdaten bestätigen?',
              text: 'Du solltest erst vor Ort zahlen. Warum werden jetzt Zahlungsdaten verlangt? Frage über die Kontaktdaten aus deiner Buchungsbestätigung nach.' },
            { id: 'c', art: 'warn', titel: 'Druck durch Stornierung',
              text: 'Die 24-Stunden-Frist setzt dich unter Druck. Prüfe die Anfrage in Ruhe, bevor du handelst.' },
            { id: 'd', art: 'warn', titel: 'Anderes Link-Ziel',
              text: 'Der Link führt zu gast-zahlung.host. Das ist eine andere Domain als hotel-seeblick.ch. Prüfe die Anfrage über deine ursprüngliche Buchung.' }
          ],
          kernTitel: 'Echte Buchungsdaten sind kein Echtheitsbeweis.',
          kern: 'Die Zahlungsaufforderung passt nicht zu deiner Buchung. Lass dich nicht unter Druck setzen und frage über die Kontaktdaten aus deiner Buchungsbestätigung nach.'
        }
      ]
    }
  ],

  /* ================================================================
     SICHERHEITSTIPPS – Folien wie im Original
     ================================================================ */
  nuggets: [
    {
      nachLevel: 1,
      titel: 'Gefälschte Links erkennen',
      untertitel: 'Lass dich nicht täuschen.',
      folien: [
        { bild: 'assets/nugget-hover.webp', titel: 'Prüfe, wohin der Link wirklich führt',
          text: 'Der sichtbare Linktext und die tatsächliche Zieladresse können unterschiedlich sein. So siehst du die Zieladresse:',
          punkte: ['Am Computer: Fahre mit der Maus über den Link, ohne zu klicken.', 'Am Smartphone: Halte den Link gedrückt.'] },
        { bild: 'assets/nugget-domain.webp', titel: 'Finde die Domain in der URL',
          text: 'Schau dir in der Zieladresse die Domain an. Sie zeigt dir, zu welcher Website der Link tatsächlich führt.',
          punkte: ['Bei order.website.com ist zum Beispiel website.com die Domain. order ist nur die Subdomain.'] },
        { bild: 'assets/nugget-zeichen.webp', titel: 'Prüfe die Domain genau',
          text: 'Schon ein einzelner Buchstabe kann den Unterschied machen:',
          punkte: ['❌ mlcrosoft.com → ✅ microsoft.com', '❌ zaland0.de → ✅ zalando.de', '❌ swiscom.ch → ✅ swisscom.ch'] }
      ],
      merke: 'Nicht der Firmenname irgendwo im Link zählt, sondern die echte Domain.',
      knopf: 'Weiter zu Level 2'
    },
    {
      nachLevel: 2,
      titel: 'KI macht Phishing glaubwürdiger',
      untertitel: 'Verlass dich nicht allein darauf, dass etwas echt wirkt.',
      folien: [
        { bild: 'assets/nugget-sprache.webp', titel: 'Gute Sprache ist kein Echtheitsbeweis',
          text: 'KI kann in Sekunden glaubwürdige, fehlerfreie Nachrichten erstellen. Auch Phishing-Nachrichten können dadurch professionell und echt wirken.',
          schutz: 'Prüfe Absender, Domain und Anlass – auch wenn die Nachricht professionell wirkt.' },
        { bild: 'assets/nugget-stimme.webp', titel: 'Stimmen und Videos sind kein Beweis',
          text: 'KI kann Stimmen und Gesichter von Kollegen, Kunden oder Geschäftspartnern täuschend echt nachahmen.',
          schutz: 'Bestätige ungewöhnliche oder sensible Anfragen über einen zweiten, bekannten Kontaktweg.' },
        { bild: 'assets/nugget-daten.webp', titel: 'Persönliche Details beweisen nichts',
          text: 'KI kann öffentlich verfügbare Informationen über dich, dein Unternehmen oder deine aktuellen Projekte in Nachrichten einbauen.',
          schutz: 'Persönliche Details sind kein Beweis für Echtheit. Bleib bei ungewöhnlichen oder unerwarteten Anfragen skeptisch.' }
      ],
      merke: 'Je überzeugender eine Nachricht wirkt, desto wichtiger ist die Prüfung bei ungewöhnlichen Anfragen.',
      knopf: 'Weiter zu Level 3'
    }
  ]
};
