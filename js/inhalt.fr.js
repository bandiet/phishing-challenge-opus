// Erzeugt mit tools/texte.py aus Phishing_Challenge_Texte.xlsx – nicht von Hand ändern.
// Texte ändern: Excel bearbeiten und mit „python3 tools/texte.py import …“ einlesen.
window.PC_INHALT = {
  sprache: 'fr',
  version: 'opus-1',
  firma: {
    name: 'entreprise.ch',
    tld: 'ch',
    zusatz: '-it'
  },
  person: {
    vorname: 'Jean',
    nachname: 'Dupont',
    privatDomain: 'bluewin.ch'
  },
  einstellungen: {
    zielProzent: 70,
    bestehenNoetig: true,
    hinweiseUeberspringbar: true,
    bestehensgrenze: 80,
    interaktionenMelden: true,
    jokerBei: [3, 6, 8, 10, 12, 14],
    jokerMax: 9
  },
  ui: {
    marke: 'Cyber Crime Awareness',
    produkt: 'Phishing Challenge',
    tonAn: 'Couper le son',
    tonAus: 'Activer le son',
    levelKurz: 'Niveau {{n}}',
    frageVon: 'Question {{n}} sur {{gesamt}}',
    start: {
      titel: 'Sauras-tu repérer le phishing ?',
      text: 'Teste ton flair pour distinguer les vrais messages des faux.',
      los: 'Commencer le test',
      fakten: [
        '15 messages',
        '3 niveaux',
        'env. 15 minutes'
      ],
      fortsetzenTitel: 'Reprendre la progression enregistrée ?',
      fortsetzenText: 'Bon retour, {{vorname}} ! Tu étais au niveau {{level}}, question {{nr}} sur {{gesamt}}.',
      fortsetzen: 'Continuer',
      neu: 'Recommencer',
      fertigTitel: 'Challenge terminé',
      fertigText: 'Ton résultat : {{richtig}} sur {{gesamt}} bien identifiés.',
      ergebnis: 'Voir le résultat',
      nochmal: 'Recommencer le quiz'
    },
    briefing: {
      karten: [
        {
          icon: 'postfach',
          titel: 'Ta boîte de réception',
          text: 'Tu reçois différents messages, l’un après l’autre.'
        },
        {
          icon: 'lupe',
          titel: 'Regarde attentivement',
          text: 'Un message n’est pas toujours ce qu’il semble être.'
        },
        {
          icon: 'entscheid',
          titel: 'Phishing ou authentique ?',
          text: 'Pour chaque message, à toi de décider.'
        }
      ],
      los: 'C’est parti !'
    },
    profil: {
      titel: 'Personnalise le quiz.',
      text: 'Saisis un nom, ton entreprise et une adresse e-mail – réels ou inventés. Nous les utilisons pour rendre les messages du quiz plus réalistes.',
      name: 'Nom',
      namePlatzhalter: 'Jean Dupont',
      firma: 'Entreprise',
      firmaPlatzhalter: 'entreprise.ch',
      email: 'Adresse e-mail',
      emailPlatzhalter: 'jean.dupont@entreprise.ch',
      emailHinweis: 'Créée à partir du nom et de l’entreprise – tu peux la modifier.',
      emailFehler: 'Merci d’indiquer une adresse e-mail valide.',
      weiter: 'Continuer',
      datenschutz: 'Tes données ne sont utilisées que dans ce quiz.'
    },
    hallo: {
      titel: 'Bonjour {{name}}.',
      text: 'Dans ce quiz, ton adresse e-mail est'
    },
    levelIntro: {
      kicker: 'Niveau {{n}} sur {{gesamt}}',
      titel: 'On commence le niveau {{n}} ?',
      neue: 'nouveaux messages',
      ziel: 'Objectif : {{ziel}} bonnes réponses sur {{gesamt}}',
      los: 'Ouvrir la boîte de réception'
    },
    situation: 'Situation',
    frage: 'Phishing ou authentique ?',
    phishing: 'Phishing',
    echt: 'Authentique',
    linkTipp: 'Survole les liens et les boutons avec la souris – comme dans une vraie boîte mail.',
    linkTippTouch: 'Touche les liens et les boutons pour voir leur destination.',
    linkZiel: 'Destination du lien',
    echteDomain: 'domaine réel',
    klartext: 'En clair',
    antwortAn: 'La réponse va à',
    anhangGesperrt: 'Aucun fichier n’est ouvert dans ce quiz.',
    qrGesperrt: 'Impossible de vérifier un code QR à l’avance.',
    extern: 'EXTERNE : ce message provient de l’extérieur de votre organisation.',
    an: 'À',
    heute: 'Aujourd’hui',
    nichtKontakt: 'Pas dans tes contacts',
    blockieren: 'Bloquer',
    hinzufuegen: 'Ajouter',
    textnachricht: 'SMS',
    nachrichtSchreiben: 'Écrire un message…',
    inmail: 'InMail',
    geraet: {
      antworten: 'Répondre',
      allenAntworten: 'Répondre à tous',
      weiterleiten: 'Transférer',
      suchen: 'Rechercher',
      aktivitaet: 'Activité',
      chat: 'Conversation',
      teams: 'Équipes',
      kalender: 'Calendrier',
      anrufe: 'Appels',
      freigegeben: 'Partagé',
      nachrichten: 'Messagerie'
    },
    ergebnis: {
      richtig: 'Correct !',
      falschPhishing: 'Raté',
      falschEcht: 'Fausse alerte',
      istPhishing: 'C’était du phishing.',
      istEcht: 'Ce message est authentique.'
    },
    hinweisArt: {
      warn: 'Signal d’alerte',
      ok: 'Signe d’authenticité',
      tipp: 'Bon à savoir'
    },
    hinweisZaehler: 'Indice {{n}} sur {{gesamt}}',
    weiter: 'Continuer',
    detailsAnzeigen: 'Afficher les détails',
    stempel: {
      phishing: 'Phishing',
      echt: 'Authentique'
    },
    naechsteNachricht: 'Message suivant',
    zurAuswertung: 'Afficher le bilan du niveau',
    ueberspringen: 'Passer les indices',
    levelEnde: {
      kicker: 'Niveau {{n}} sur {{gesamt}}',
      perfekt: 'Parfaitement réussi, aucun détail ne t’a échappé !',
      bestanden: 'Tu as réussi le niveau {{n}}.',
      knapp: 'Persévère et aiguise ton regard pour repérer les signaux d’alerte !',
      bestandenAb: 'Réussi dès',
      richtig: '{{richtig}} sur {{gesamt}} justes',
      abzeichen: 'Badge débloqué',
      zumNugget: 'Voir le conseil sécurité',
      naechstesLevel: 'Passer au niveau {{n}}',
      zumErgebnis: 'Quiz terminé',
      wiederholen: 'Refaire le niveau {{n}}',
      warPhishing: 'Phishing',
      warEcht: 'Authentique',
      details: 'Détails'
    },
    nugget: {
      kicker: 'Conseil sécurité',
      merke: 'À retenir',
      zurueck: 'Retour',
      weiter: 'Continuer'
    },
    finale: {
      kicker: 'Quiz terminé',
      titelTop: 'Excellent travail !',
      titelGut: 'Très bien joué !',
      titelMittel: 'Bien joué !',
      titel: 'Bel essai !',
      text: 'Tu as répondu juste à {{richtig}}/{{gesamt}} questions.',
      absatz: 'C’est en forgeant qu’on devient forgeron ! Mieux tu sais à quoi faire attention, plus tu es à l’abri des attaques de phishing.',
      abzeichen: 'Tes badges',
      mitnehmen: 'À retenir',
      merksaetze: [
        'Ce qui compte, c’est le vrai domaine – pas le nom de l’entreprise quelque part dans le lien.',
        'Vérifie l’expéditeur, le domaine et le contexte – même si le message paraît professionnel.',
        'Confirme les demandes inhabituelles ou sensibles par un deuxième canal connu.',
        'Des détails personnels ne prouvent pas qu’un message est authentique.'
      ],
      lms: 'Ta progression a bien été transmise au LMS.',
      schliessen: 'Tu peux maintenant fermer cette fenêtre pour terminer la formation.',
      nochNicht: 'Pour réussir, il te faut au moins {{grenze}} %. Il suffit de recommencer le quiz.',
      nochmal: 'Recommencer le quiz'
    },
    hacker: {
      erwischt: [
        'I love to phish 🎣',
        'Droit dans le filet ! 🎯',
        'Un clic de trop... 😈',
        'Ça a mordu ! 🐟',
        'Merci pour le clic ! 🙃',
        'Ça a marché comme sur des roulettes ! 😏',
        'Trop facile… 🤭'
      ],
      durchschaut: [
        'You got me! 🕶️',
        'Zut, démasqué ! 💨',
        'Bien vu ! 👏',
        'Pff. Pas mal. 😒',
        'Je t’aurai la prochaine fois ! 😤',
        'Rien ne t’échappe ! 🧐',
        'Encore raté… 🙄'
      ],
      finaleGut: 'J’abandonne… 🏳️',
      finale: 'À la prochaine ! 😏'
    },
    serie: {
      label: 'Série',
      titel: '{{n}} bonnes réponses d’affilée',
      erklaerung: 'Super, {{n}} bonnes réponses d’affilée ! C’est ta série – chaque bonne réponse supplémentaire fait grandir la flamme.',
      lob: [
        '{{n}} d’affilée – ta série grandit !',
        'Série {{n}} ! La flamme s’embrase.',
        '{{n}} à la suite – belle série !',
        'Continue comme ça : {{n}} bonnes réponses d’affilée !'
      ],
      verloren: 'Série terminée – ta prochaine bonne réponse en lance une nouvelle.',
      bisJokerEins: 'Encore une bonne réponse – et tu gagnes un joker !',
      bisJoker: 'Encore {{n}} bonnes réponses jusqu’au prochain joker.',
      jokerVoll: 'Tu as déjà {{n}} jokers – utilises-en un d’abord.'
    },
    joker: {
      name: 'Joker',
      tippTitel: 'Astuce du joker',
      erster: 'Tu as gagné un joker ! Clique sur moi quand tu as besoin d’une astuce pour un message.',
      neu: [
        'Encore un joker – tu en as maintenant {{n}}.',
        'Ta série te rapporte un joker. Maintenant : {{n}}.',
        'Joker numéro {{n}} – garde-le bien !'
      ],
      erinnerung: 'Jokers restants : {{n}}. Clique sur moi quand tu as besoin d’une astuce pour un message.',
      spaeter: 'Garde-moi pour le prochain message – je t’y donnerai une astuce.',
      schon: 'Tu vois déjà l’astuce pour ce message.',
      leer: 'Plus de joker. Une nouvelle série t’en rapportera d’autres.',
      titel: 'Joker : encore {{n}} – clique pour une astuce'
    }
  },
  levels: [
    {
      kicker: 'Échauffement',
      titel: 'Bases et signaux d’alerte typiques',
      badge: 'Novice anti-phishing',
      nachrichten: [
        {
          id: 'l2-msg-4',
          art: 'email',
          phishing: true,
          joker: 'Lis très attentivement l’expéditeur et le nom de la pièce jointe – jusqu’au dernier caractère.',
          titel: 'Une augmentation de salaire en vue ?',
          lage: 'Un e-mail des ressources humaines annonce une nouvelle grille salariale en pièce jointe.',
          von: {
            name: 'Ressources humaines',
            adresse: 'ressources-humaines@{{fake_doppel}}'
          },
          an: '{{email}}',
          zeit: 'Aujourd’hui, 11:00',
          betreff: 'IMPORTANT : nouvelle grille salariale et prime d’inflation 2027',
          anhang: [
            {
              name: 'Grille_salariale_2027.docx.exe',
              groesse: '2,4 Mo'
            }
          ],
          inhalt: `
<div style="color:#0f766e;font-family:Arial,Helvetica,sans-serif;font-size:.733em;font-weight:700;letter-spacing:.08em;margin:0 0 18px;">COMMUNICATION INTERNE</div>
<div style="border-left:4px solid #16c7a5;padding-left:14px;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
  <div style="margin-bottom:16px;">Chères et chers collègues,</div>
  <div>La direction a décidé d’adapter la structure salariale pour 2027. Vous trouverez en pièce jointe l’aperçu mis à jour ainsi que des informations sur la prime d’inflation.<br><br></div>
  <div>Merci de consulter les informations qui vous concernent dans le fichier joint.</div>
</div>`,
          hinweise: [
            {
              id: 'a',
              bei: 'absender',
              art: 'warn',
              titel: 'Domaine d’entreprise suspect',
              klartext: '{{fake_doppel_m}}',
              text: 'Le domaine ne diffère de {{domain}} que par une lettre supplémentaire. Même si un expéditeur te semble familier, fais attention aux petites différences dans le domaine.'
            },
            {
              id: 'b',
              bei: 'anhang',
              art: 'warn',
              titel: 'Vérifier la véritable extension du fichier',
              text: 'Malgré le « .docx » dans le nom, il s’agit d’un fichier exécutable .exe et non d’un document Word. Ce qui compte, c’est l’extension réelle, tout à la fin du nom de fichier.'
            }
          ],
          kernTitel: 'Pièce jointe déguisée provenant d’un domaine inconnu.',
          kern: 'Examine attentivement les pièces jointes inattendues et leur extension complète.'
        },
        {
          id: 'l1-amazon-delivery-sms',
          art: 'sms',
          phishing: false,
          joker: 'Le SMS correspond-il à ta situation ? Vérifie aussi où mène vraiment le lien.',
          titel: 'Le livreur m’écrit ?',
          lage: 'Tu attends un colis Amazon aujourd’hui. Peu avant la livraison, tu reçois ce SMS.',
          von: {
            name: 'Amazon'
          },
          zeit: '09:44',
          nachrichten: [
            `Chat avec le livreur&nbsp;: <mark data-h="a">un message concernant la livraison de votre colis Amazon.</mark><br><br>Appuyez ici pour répondre&nbsp;: <a data-ziel="https://amzn.eu/d/01Wc5tkv" data-h="b">https://amzn.eu/d/01Wc5tkv</a>`
          ],
          hinweise: [
            {
              id: 'a',
              art: 'tipp',
              titel: 'Contexte cohérent',
              text: 'Tu attends effectivement une livraison Amazon. Mais attention : les SMS de phishing utilisent eux aussi les annonces de colis comme appât. Un contexte cohérent ne suffit donc pas à prouver qu’un message est authentique.'
            },
            {
              id: 'b',
              art: 'ok',
              titel: 'Lien court Amazon',
              text: 'Ce lien court est utilisé par Amazon. Un lien raccourci n’est donc pas automatiquement suspect. En cas de doute, ouvre toi-même l’application Amazon et vérifie ta livraison.'
            }
          ],
          kernTitel: '',
          kern: 'Le phishing arrive aussi par SMS – par exemple avec de prétendus problèmes de livraison, des frais de douane ou des données d’adresse manquantes. Ce message est toutefois une véritable notification d’Amazon.'
        },
        {
          id: 'l2-msg-9',
          art: 'email',
          phishing: false,
          joker: 'Regarde de quel domaine provient l’e-mail et où mène le bouton.',
          titel: 'Julien Morel ? Est-ce que je le connais ?',
          lage: 'Un e-mail t’informe d’une nouvelle demande de contact sur LinkedIn.',
          von: {
            name: 'LinkedIn Network',
            adresse: 'messages-noreply@linkedin.com'
          },
          an: '{{email}}',
          zeit: 'Hier, 17:30',
          betreff: 'Julien Morel souhaite se connecter avec vous sur LinkedIn',
          inhalt: `
<div style="font-family:Arial,Helvetica,sans-serif;line-height:1.55;color:#1f2937;">
  <div style="display:flex;align-items:center;gap:10px;margin:0 0 20px 0;"><svg width="30" height="30" viewBox="0 0 24 24" style="display:block;"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="#0A66C2"></path></svg><div style="font-size:1.267em;font-weight:700;color:#0A66C2;">LinkedIn</div></div>
  <div>Bonjour {{vorname}},</div>
  <div style="margin-top:16px;background:#f3f6f8;border:1px solid #e1e6ea;border-radius:10px;padding:16px;">
    <div style="display:flex;align-items:center;gap:12px;">
      <div style="width:44px;height:44px;border-radius:50%;background:#dbeafe;color:#0A66C2;font-weight:700;display:flex;align-items:center;justify-content:center;flex:0 0 auto;">JM</div>
      <div><div style="font-weight:700;color:#111827;">Julien Morel</div><div style="font-size:.8em;color:#64748b;">Senior IT Security Manager chez CyberGuard</div></div>
    </div>
    <div style="margin-top:14px;">souhaite se connecter avec vous.</div>
  </div>
  <div style="margin-top:18px;"><a data-ziel="https://www.linkedin.com/comm/mynetwork/invite-accept/7389216054" style="display:inline-block;background:#0A66C2;color:#fff;text-decoration:none;font-weight:700;padding:10px 16px;border-radius:18px;">Accepter l’invitation</a></div>
</div>`,
          hinweise: [
            {
              id: 'a',
              bei: 'absender',
              art: 'ok',
              titel: 'Le domaine de l’expéditeur correspond',
              text: 'L’adresse de l’expéditeur utilise le domaine officiel linkedin.com. C’est un signal positif – vérifie quand même si la demande est plausible pour toi.'
            }
          ],
          kernTitel: '',
          kern: 'L’expéditeur et le message correspondent à LinkedIn. Une demande de contact inconnue n’est pas en soi un signe de phishing.'
        },
        {
          id: 'l3-msg-2',
          art: 'sms',
          phishing: true,
          joker: 'Survole le lien : le domaine juste avant l’extension appartient-il vraiment à ta banque ?',
          titel: 'Ce n’est pas mon virement !',
          lage: 'À la caisse du supermarché, ton téléphone vibre. Un SMS signale un paiement de CHF 1’250 en attente.',
          von: {
            name: 'UBS Security',
            info: '+41 77 488 12 93'
          },
          zeit: '10:20',
          nachrichten: [
            `UBS Info&nbsp;: un virement inhabituel de CHF 1’250.00 à iBanking Ltd a été enregistré. <mark data-h="b">Annulation immédiate</mark> sur&nbsp;: <a data-ziel="https://ubs-securite-service.com/annulation" data-h="a">https://ubs-securite-service.com/annulation</a>`
          ],
          hinweise: [
            {
              id: 'a',
              art: 'warn',
              titel: 'Destination du lien suspecte',
              text: 'Le domaine fait penser à UBS, mais ce n’est pas le domaine officiel ubs.com. En cas de message suspect de ta banque, ouvre toi-même l’application bancaire ou le site web au lieu de suivre le lien.'
            },
            {
              id: 'b',
              art: 'warn',
              titel: 'Pression via un prétendu virement',
              text: 'Un montant élevé et l’invitation à agir immédiatement visent à te mettre sous pression. Ne te laisse pas pousser à cliquer trop vite et vérifie l’alerte dans ton application bancaire.'
            }
          ],
          kernTitel: '',
          kern: 'En cas de message suspect de ta banque : ouvre toi-même ton application bancaire ou le site web, au lieu de suivre le lien du message.'
        },
        {
          id: 'l5-msg-10',
          art: 'email',
          phishing: false,
          joker: 'Vérifie le domaine de l’expéditeur. Et demande-toi : le message veut-il que tu fasses ou révèles quelque chose ?',
          titel: 'Un code de sécurité Microsoft arrive dans ta boîte de réception.',
          lage: '',
          von: {
            name: 'Équipe des comptes Microsoft',
            adresse: 'account-security-noreply@accountprotection.microsoft.com'
          },
          an: '{{email}}',
          zeit: 'Aujourd’hui, 14:00',
          betreff: 'Code de sécurité du compte Microsoft : 849201',
          inhalt: `
<div style="font-family:Arial,Helvetica,sans-serif;line-height:1.55;color:#1f2937;">
  <div style="display:flex;align-items:center;gap:10px;margin:0 0 22px 0;"><svg width="28" height="28" viewBox="0 0 24 24" style="display:block;"><rect x="0" y="0" width="11.3" height="11.3" fill="#F25022"/><rect x="12.7" y="0" width="11.3" height="11.3" fill="#7FBA00"/><rect x="0" y="12.7" width="11.3" height="11.3" fill="#00A4EF"/><rect x="12.7" y="12.7" width="11.3" height="11.3" fill="#FFB900"/></svg><div style="font-size:1.2em;font-weight:600;color:#444;">Microsoft</div></div>
  <div>Utilisez le code de sécurité suivant pour le compte Microsoft&nbsp;:</div>
  <div style="margin:20px 0;border:1px solid #d9dde3;background:#f7f8fa;border-radius:8px;padding:16px;text-align:center;">
    <div style="font-size:.733em;color:#6b7280;text-transform:uppercase;letter-spacing:.06em;">Code de sécurité</div>
    <div style="font-size:2em;letter-spacing:6px;color:#0078d4;font-weight:700;margin-top:5px;">849201</div>
  </div>
  <div style="color:#4b5563;"><mark data-h="b">Si vous n’avez pas demandé ce code</mark>, vous pouvez ignorer cet e-mail.</div>
</div>`,
          hinweise: [
            {
              id: 'a',
              bei: 'absender',
              art: 'ok',
              titel: 'Domaine Microsoft officiel',
              text: 'L’adresse appartient au domaine officiel microsoft.com. Cela indique que le message provient bien de Microsoft.'
            },
            {
              id: 'b',
              art: 'tipp',
              titel: 'Code non demandé ? Prudence',
              text: 'Le message peut être authentique, même si tu n’as pas demandé le code toi-même. N’utilise pas ce code, ne le communique à personne et vérifie ton compte par le chemin habituel.'
            }
          ],
          kernTitel: '',
          kern: 'L’e-mail lui-même est authentique. Mais si tu n’as pas demandé le code, cela peut indiquer une tentative de connexion par quelqu’un d’autre. Ne communique jamais ce code à personne.'
        }
      ]
    },
    {
      kicker: 'Avancé',
      titel: 'Domaines, liens et contexte',
      badge: 'Détective des liens',
      nachrichten: [
        {
          id: 'l2-msg-1',
          art: 'email',
          phishing: true,
          joker: 'Lis l’adresse de l’expéditeur caractère par caractère et vérifie où mène vraiment le bouton.',
          titel: '489 francs ? Mais je n’ai rien commandé !',
          lage: 'En consultant ta boîte de réception, tu découvres une confirmation de paiement pour un achat que tu ne connais pas.',
          von: {
            name: 'Service clients PayPal',
            adresse: 'service@paypaI.com'
          },
          an: '{{email}}',
          zeit: 'Aujourd’hui, 09:40',
          betreff: 'Confirmation de votre achat chez TechStore SA (CHF 489.00)',
          inhalt: `
<div style="font-family:Arial,Helvetica,sans-serif;line-height:1.55;color:#1f2937;">
  <div style="text-align:center;margin:0 0 22px 0;"><img src="assets/m-paypal.webp" alt="PayPal" style="display:block;margin:0 auto;max-width:140px;width:auto;height:auto;max-height:60px;object-fit:contain;"></div>
  <div>Bonjour,</div>
  <div style="margin-top:16px;">Vous avez autorisé un paiement à TechStore SA.</div>
  <div style="margin-top:16px;background:#f4f7fb;border-radius:9px;padding:15px 16px;text-align:center;">
    <div style="font-size:.8em;color:#64748b;">TechStore SA</div>
    <div style="font-size:1.8em;font-weight:700;color:#172033;margin-top:3px;">CHF 489.00</div>
  </div>
  <div style="margin-top:16px;">Si vous ne reconnaissez pas cette transaction, vérifiez les détails dans votre centre de sécurité.</div>
  <div style="margin-top:20px;text-align:center;"><a data-ziel="https://www.paypal.com.security-dispute-resolution.com/login" data-h="b" style="display:inline-block;background:#0070E0;color:#fff;padding:11px 18px;text-decoration:none;border-radius:20px;font-weight:700;">Annuler la transaction</a></div>
</div>`,
          hinweise: [
            {
              id: 'a',
              bei: 'absender',
              art: 'warn',
              titel: 'Domaine trompeusement similaire',
              klartext: 'service@paypa[I].com',
              text: 'Le prétendu « l » minuscule de paypal.com est en réalité un « I » majuscule. Ce genre de caractères qui se ressemblent peut donner à un faux domaine une apparence authentique au premier coup d’œil.'
            },
            {
              id: 'b',
              art: 'warn',
              titel: 'C’est le vrai domaine qui compte',
              text: 'Le lien contient certes paypal.com, mais le domaine réel est security-dispute-resolution.com. Il n’appartient pas à PayPal.'
            }
          ],
          kernTitel: 'Ici, il vaut la peine d’examiner le domaine de près.',
          kern: 'Les fausses adresses peuvent ressembler à s’y méprendre à des domaines connus. Vérifie donc attentivement l’expéditeur et la destination du lien.'
        },
        {
          id: 'ai-img-1790147331698',
          art: 'email',
          phishing: false,
          joker: 'Le partage correspond-il à ta journée ? Vérifie si l’expéditeur et la destination du lien appartiennent à des services connus.',
          titel: 'Un coup d’œil aux chiffres avant la réunion.',
          lage: 'Tu prépares la réunion financière quand un partage de fichier d’Anna Favre arrive.',
          von: {
            name: 'Favre, Anna',
            adresse: 'Anna.Favre@{{domain}}'
          },
          an: '{{email}}',
          zeit: 'Aujourd’hui, 07:08',
          betreff: 'Cloture_mensuelle_Q2_Confidentiel.pdf a été partagé avec vous',
          inhalt: `
<div style="background-color:#f3f3f3;color:#323130;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;padding:30px 20px;border-radius:8px;">
  <div style="max-width:550px;margin:0 auto;background-color:#ffffff;border:1px solid #d2d0ce;border-radius:8px;overflow:hidden;">
    <div style="background-color:#ffffff;text-align:center;padding:28px 24px 36px;">
      <svg width="48" height="48" viewBox="0 0 64 64" fill="none" aria-hidden="true" style="display:block;margin:0 auto 38px;"><path d="M9 22V55H46V47" stroke="#0078d4" stroke-width="3.5" stroke-linecap="square"></path><path d="M43 9L58 24L43 39V29C32 29 24 33 19 41C19 26 28 17 43 17V9Z" stroke="#0078d4" stroke-width="3.5" stroke-linejoin="miter"></path></svg>
      <h2 style="color:#323130;font-size:1.467em;font-weight:600;margin:0;line-height:1.4;">Anna Favre (Finances) a partagé un document SharePoint avec vous</h2>
    </div>
    <div style="background-color:#f8f8f8;padding:0 30px 30px;border-top:1px solid #d2d0ce;">
      <p style="color:#605e5c;font-size:.933em;margin:25px 0;">Anna Favre (Finances) a partagé le document suivant avec vous.</p>
      <div style="border:1px solid #d2d0ce;border-radius:6px;padding:15px;margin-bottom:25px;display:flex;align-items:center;justify-content:center;background-color:#ffffff;">
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="background-color:#d13438;color:white;padding:6px 9px;border-radius:4px;font-weight:bold;font-size:.8em;flex:0 0 auto;">PDF</div>
          <span style="color:#323130;font-weight:500;">Cloture_mensuelle_Q2_Confidentiel.pdf</span>
        </div>
      </div>
      <div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:25px;color:#605e5c;font-size:.8em;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
        <span>Ce document a été partagé via Microsoft SharePoint.</span>
      </div>
      <div style="text-align:center;"><a data-ziel="https://{{tenant}}.sharepoint.com/sites/finance/Documents%20partages/Cloture_mensuelle_Q2_Confidentiel.pdf" data-h="b" style="background-color:#0078d4;color:#ffffff;text-decoration:none;padding:10px 32px;border-radius:4px;font-weight:500;font-size:.933em;display:inline-block;">Ouvrir le document dans SharePoint</a></div>
    </div>
  </div>
  <div style="text-align:center;margin-top:25px;"><p style="color:#605e5c;font-size:.733em;max-width:450px;margin:0 auto;line-height:1.4;">Microsoft 365 · SharePoint</p></div>
</div>`,
          hinweise: [
            {
              id: 'a',
              bei: 'absender',
              art: 'ok',
              titel: 'Domaine d’entreprise connu',
              text: 'L’adresse de l’expéditeur utilise le domaine connu de l’entreprise. L’expéditrice indiquée, Anna Favre du service Finances, correspond aussi au motif du partage.'
            },
            {
              id: 'b',
              art: 'ok',
              titel: 'Destination officielle du lien',
              text: 'Le lien mène à une adresse Microsoft officielle sous sharepoint.com. Avec l’expéditeur et le contexte, cela plaide ici pour un partage légitime.'
            }
          ],
          kernTitel: '',
          kern: 'L’expéditeur, la destination du lien et le contexte sont plausibles et cohérents. Un partage de fichier inattendu n’est pas forcément du phishing.'
        },
        {
          id: 'l3-msg-9',
          art: 'email',
          phishing: false,
          joker: 'Attends-tu ce message d’après la situation ? Vérifie vers quel domaine pointe le lien.',
          titel: 'J’ai oublié quelque chose, non ?',
          lage: 'La note de frais de ton dernier voyage d’affaires n’a pas encore été soumise. Un rappel arrive maintenant par e-mail.',
          von: {
            name: 'Ressources humaines',
            adresse: 'hr-benefits@{{domain}}'
          },
          an: '{{email}}',
          zeit: 'Hier, 11:30',
          betreff: 'Rappel : soumission des frais de déplacement',
          inhalt: `
<div style="font-family:Arial,Helvetica,sans-serif;line-height:1.55;color:#1f2937;">
  <div style="font-size:.733em;font-weight:700;letter-spacing:.08em;color:#64748b;margin-bottom:18px;">RAPPEL INTERNE</div>
  <div>Bonjour {{name}},<br><br>N’oubliez pas de soumettre dans le portail RH, d’ici la fin du trimestre, vos notes de frais de déplacement encore en suspens pour le mois écoulé.</div>
  <div style="margin-top:18px;">Lien vers le portail&nbsp;:<br><a data-ziel="https://intranet.{{domain}}/rh/frais-de-deplacement" data-h="a" style="color:#2563eb;font-weight:700;word-break:break-word;">https://intranet.{{domain}}/rh/frais-de-deplacement</a></div>
</div>`,
          hinweise: [
            {
              id: 'a',
              art: 'ok',
              titel: 'Destination du lien cohérente',
              text: 'Le lien mène au portail interne sur le domaine connu de l’entreprise {{domain}}. Cela correspond au motif du message.'
            }
          ],
          kernTitel: '',
          kern: 'Le motif correspond à ta situation. L’expéditeur et la destination du lien sont aussi plausibles et appartiennent à l’entreprise.'
        },
        {
          id: 'ai-img-1790160787284',
          art: 'email',
          phishing: true,
          joker: 'Compare lettre par lettre le domaine de l’expéditeur avec celui de ton entreprise – et survole le lien.',
          titel: 'Est-ce que je suis aussi sur les photos ?',
          lage: 'Après la fête d’été, tu reçois une invitation à rejoindre un nouveau groupe Teams. Les photos de la fête doivent y être partagées.',
          von: {
            name: 'Microsoft Teams',
            adresse: 'teams@{{fake_tausch}}'
          },
          an: '{{email}}',
          zeit: 'Aujourd’hui, 10:53',
          betreff: 'Vous avez été ajouté à un nouveau groupe de travail dans Microsoft Teams',
          inhalt: `
<div style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#ffffff;padding:20px 0;">
  <div style="max-width:600px;margin:0 auto;background-color:#edf0f4;border-top:4px solid #5753b1;padding:22px 16px 76px;box-sizing:border-box;text-align:center;color:#19253b;">
    <h2 data-h="d" style="display:inline-block;color:#5753b1;margin:0 0 22px;font-size:1.6em;line-height:1.3;font-weight:400;">Microsoft Teams</h2>
    <h3 style="color:#19253b;font-size:1.333em;line-height:1.2;font-weight:700;margin:0 auto 24px;max-width:520px;">Vous avez été ajouté à un nouveau groupe de travail<br>«&nbsp;<mark data-h="c">Fête d’été – Photos &amp; souvenirs</mark>&nbsp;» dans Microsoft Teams.</h3>
    <div style="width:100%;max-width:292px;margin:0 auto;background-color:#ffffff;">
      <div style="padding:48px 10px 0;">
        <h4 style="color:#19253b;font-size:1.333em;line-height:1.3;margin:0 0 16px;font-weight:700;">Groupe de travail</h4>
        <p style="color:#19253b;font-size:1.2em;line-height:1.4;font-weight:700;margin:0 0 14px;">«&nbsp;Fête d’été – Photos &amp; souvenirs&nbsp;»</p>
        <p style="color:#536078;font-size:.933em;line-height:1.5;margin:0 0 12px;">38 membres</p>
        <div style="border-top:1px solid #dfe3eb;padding:13px 0;"><p style="color:#536078;font-size:.933em;line-height:1.5;margin:0;">Les plus belles photos de la fête d’été – regardez-les dès maintenant et partagez les vôtres.</p></div>
      </div>
      <a data-ziel="https://microsoft-teams.{{fake_tausch}}/join/fete-ete" data-h="b" style="display:block;background-color:#5753b1;color:#ffffff;text-decoration:none;padding:13px 10px;font-size:.933em;line-height:1.3;font-weight:600;text-align:center;">Ouvrir Microsoft Teams</a>
    </div>
  </div>
</div>`,
          hinweise: [
            {
              id: 'a',
              bei: 'absender',
              art: 'warn',
              titel: 'Domaine d’entreprise différent',
              klartext: '{{fake_tausch_m}}',
              text: 'Le domaine {{fake_tausch}} ressemble au vrai domaine de l’entreprise {{domain}}, mais c’est une autre adresse. Vérifie donc l’adresse complète de l’expéditeur et pas seulement le nom familier « Microsoft Teams ».'
            },
            {
              id: 'b',
              art: 'warn',
              titel: 'Destination du lien suspecte',
              text: '« Microsoft Teams » apparaît certes dans le lien, mais le domaine réel n’appartient pas à Microsoft. Le lien mène à une fausse page de connexion Microsoft destinée à voler tes identifiants.'
            },
            {
              id: 'c',
              art: 'tipp',
              titel: 'L’invitation correspond-elle au contexte ?',
              text: 'Y a-t-il vraiment eu une fête d’été ? Chez vous, les photos sont-elles partagées via un nouveau groupe Teams ? Un motif qui semble plausible ne prouve pas que l’invitation est authentique.'
            },
            {
              id: 'd',
              art: 'tipp',
              titel: 'Un design familier n’est pas une garantie',
              text: 'Le logo, les couleurs et la mise en page sont faciles à imiter. Ne te fie donc pas uniquement au fait qu’un message ressemble à un outil connu.'
            }
          ],
          kernTitel: 'Même des outils familiers peuvent servir d’appât.',
          kern: 'Regardons ça de plus près.'
        },
        {
          id: 'l4-msg-3',
          art: 'email',
          phishing: true,
          joker: 'Qu’est-ce qui doit changer exactement ? Réfléchis à la façon dont tu confirmerais normalement un tel changement.',
          titel: 'Le fournisseur a soudain un nouvel IBAN.',
          lage: 'Le service des achats reçoit une communication concernant des coordonnées de paiement modifiées.',
          von: {
            name: 'Matériaux Montvert SA',
            adresse: 'comptabilite@montvert-materiaux.ch'
          },
          an: 'achats@{{domain}}',
          zeit: 'Aujourd’hui, 10:45',
          betreff: 'Important : modification des coordonnées bancaires pour les factures futures',
          inhalt: `
<div style="background:#f5f8fb;color:#334155;border-left:4px solid #6487a5;padding:12px 16px;margin-bottom:24px;"><strong>Remarque&nbsp;:</strong> <mark data-h="a">Expéditeur externe – faites preuve de prudence.</mark></div>
<div style="font-family:Arial,Helvetica,sans-serif;line-height:1.55;color:#1f2937;">
  <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;padding-bottom:12px;border-bottom:2px solid #eadfc9;">
    <svg width="36" height="30" viewBox="0 0 34 30" style="display:block;"><path d="M2 25 10 8l6 9 5-13 11 21H2z" fill="#A87623"></path><path d="m10 8 6 9 2.2-4.9" fill="none" stroke="#fff" stroke-width="2"></path></svg>
    <div><div style="font-size:1.2em;font-weight:700;color:#6b4a17;">Matériaux Montvert</div><div style="font-size:.733em;color:#8a7350;">Matériaux de construction · Négoce · Logistique</div></div>
  </div>
  <div>Madame, Monsieur,</div>
  <div style="margin-top:16px;">Suite à un changement de banque, <mark data-h="b">nos coordonnées de paiement ont changé</mark>. Pour tous vos futurs virements, veuillez désormais utiliser les coordonnées bancaires suivantes&nbsp;:</div>
  <div style="margin-top:18px;background:#fbf8f2;border:1px solid #eadfc9;border-radius:8px;padding:14px 16px;">
    <div style="font-size:.733em;color:#8a7350;text-transform:uppercase;">Nouvelles coordonnées bancaires</div>
    <div style="margin-top:5px;font-weight:700;color:#2f2a24;word-break:break-word;"><mark data-h="c">ES59 9999 9999 99 1234 5678 90 (Espagne)</mark></div>
  </div>
  <div style="margin-top:18px;">Meilleures salutations,<br>Matériaux Montvert SA</div>
</div>`,
          hinweise: [
            {
              id: 'a',
              art: 'tipp',
              titel: 'Expéditeur externe',
              text: 'Certains programmes de messagerie signalent les messages provenant de l’extérieur de l’entreprise. Pour un fournisseur, c’est normal et ce n’est pas en soi un signe de phishing.'
            },
            {
              id: 'b',
              art: 'warn',
              titel: 'Coordonnées de paiement modifiées par e-mail',
              text: 'Ne modifie jamais des coordonnées de paiement sur la seule base d’un e-mail. Fais-les confirmer via des coordonnées du fournisseur que tu connais déjà.'
            },
            {
              id: 'c',
              art: 'warn',
              titel: 'Compte bancaire étranger inattendu',
              text: 'Un IBAN étranger n’est pas automatiquement suspect. Mais ici, le passage inattendu à un compte dans un autre pays est une raison supplémentaire de confirmer les nouvelles coordonnées de paiement de manière indépendante.'
            }
          ],
          kernTitel: 'En cas de changement de coordonnées bancaires, la prudence s’impose.',
          kern: 'Fais toujours confirmer un changement de coordonnées bancaires par un canal de contact que tu connais déjà – jamais via les coordonnées figurant dans le message lui-même.'
        }
      ]
    },
    {
      kicker: 'Mode expert',
      titel: 'Ingénierie sociale et vérification',
      badge: 'Pro de la sécurité',
      nachrichten: [
        {
          id: 'l5-msg-1',
          art: 'email',
          phishing: true,
          joker: 'Comment cela se configure-t-il normalement chez vous ? La voie proposée par l’e-mail y correspond-elle ?',
          titel: 'Dois-je vraiment reconfigurer mon authentification à deux facteurs ?',
          lage: 'Le matin, tu reçois un message présenté comme obligatoire pour configurer une nouvelle application d’authentification.',
          von: {
            name: 'IT Infrastructure Security',
            adresse: 'mfa-security@{{domain}}'
          },
          an: '{{email}}',
          zeit: 'Aujourd’hui, 08:00',
          betreff: 'Obligatoire : configurer la nouvelle application d’authentification',
          inhalt: `
<div style="font-family:Arial,Helvetica,sans-serif;line-height:1.55;color:#1f2937;">
  <div style="font-size:.733em;font-weight:700;letter-spacing:.08em;color:#2563eb;margin-bottom:18px;">AVIS DE SÉCURITÉ</div>
  <div>Chères collaboratrices, chers collaborateurs,</div>
  <div style="margin-top:16px;">Afin de protéger nos systèmes contre les cyberattaques, nous passons aujourd’hui à la nouvelle application d’authentification.</div>
  <div style="margin-top:16px;background:#f3f7ff;border-left:4px solid #2563eb;border-radius:8px;padding:14px 16px;">Veuillez scanner le code QR ci-dessous avec votre smartphone pour configurer l’application d’authentification.</div>
  <div class="m-qr" data-ziel="https://m365-login-proxy.auth-setup.app/qr-auth" data-h="b" style="margin:18px auto 0;width:max-content;max-width:100%;text-align:center;">
    <img src="assets/m-qr.webp" alt="Code QR" style="display:block;margin:0 auto;max-height:240px;width:auto;object-fit:contain;">
    <div style="margin-top:8px;font-size:.8em;color:#6b7280;">Scanner le code QR avec l’appareil photo</div>
  </div>
</div>`,
          hinweise: [
            {
              id: 'a',
              bei: 'absender',
              art: 'tipp',
              titel: 'Adresse d’expéditeur plausible',
              text: 'L’adresse utilise le domaine de l’entreprise et semble donc plausible. Mais cela ne suffit pas à rendre le message digne de confiance.'
            },
            {
              id: 'b',
              art: 'warn',
              titel: 'Code QR inattendu pour la 2FA',
              text: 'Une demande inattendue de reconfigurer l’authentification à deux facteurs à l’aide d’un code QR reçu par e-mail est un signal d’alerte. Lance plutôt la configuration via le portail que tu connais, ou clarifie la situation avec le service informatique.'
            }
          ],
          kernTitel: 'Prudence face aux demandes inattendues concernant l’authentification à deux facteurs.',
          kern: 'Configure l’authentification à deux facteurs uniquement par des canaux connus et fiables. Vérifie les demandes inattendues via le portail que tu connais ou directement auprès du service informatique.'
        },
        {
          id: 'l4-msg-1',
          art: 'email',
          phishing: true,
          joker: 'Vérifie bien le domaine de l’expéditeur et survole l’adresse : à qui irait ta réponse ?',
          titel: 'Un message de la direction.',
          lage: 'Peu après le début de ta journée de travail, tu reçois un e-mail de la direction qui te demande d’effectuer un virement.',
          von: {
            name: 'Philippe Mercier | Direction générale',
            adresse: 'ceo.office@{{fake_glyph}}',
            hover: 'extern.finance@protonmail.com'
          },
          an: 'finances@{{domain}}',
          zeit: 'Aujourd’hui, 08:05',
          betreff: 'Instruction de paiement urgente – rachat d’entreprise',
          inhalt: `
<div style="line-height:1.55;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
  <div style="color:#b42318;font-size:.733em;display:inline-block;background:#fff1f2;border:1px solid #fecdd3;border-radius:999px;padding:4px 9px;font-weight:700;letter-spacing:.06em;margin-bottom:18px;">STRICTEMENT CONFIDENTIEL</div>
  <div>Bonjour {{vorname}},</div>
  <div style="margin-top:16px;">Je suis actuellement en discussions confidentielles au sujet d’un possible rachat d’entreprise. Dans ce cadre, veuillez effectuer un virement de&nbsp;<strong><mark data-h="c">CHF 45’000</mark></strong> sur le compte fiduciaire suivant.<br><br></div>
  <div>IBAN&nbsp;: CH93 0076 2011 6238 5295 7</div>
  <div>Bénéficiaire&nbsp;: Apex M&amp;A Advisory Ltd.<br><br></div>
  <div><b>Les discussions n’étant pas encore publiques, veuillez traiter cette affaire de manière <mark data-h="b">strictement confidentielle</mark> et ne pas en parler à d’autres collègues pour le moment.</b></div>
  <div style="margin-top:18px;">Meilleures salutations,<br>Philippe Mercier (CEO)</div>
</div>`,
          hinweise: [
            {
              id: 'a',
              bei: 'absender',
              art: 'warn',
              titel: 'Domaine d’entreprise trompeusement similaire',
              klartext: '{{fake_glyph_m}}',
              text: 'Le domaine de l’expéditeur a été légèrement modifié par rapport à {{domain}}. De si petites différences passent facilement inaperçues.'
            },
            {
              id: 'b',
              art: 'warn',
              titel: 'Le secret comme moyen de pression',
              text: 'L’exigence de confidentialité vise à t’empêcher de vérifier en interne cet ordre de paiement inhabituel. Fais confirmer ce type d’instruction par un canal de contact connu et indépendant.'
            },
            {
              id: 'c',
              art: 'warn',
              titel: 'Instruction de paiement inhabituelle',
              text: 'N’exécute pas un paiement d’un montant inhabituellement élevé au nom de la direction sur la seule base d’un e-mail. Fais confirmer l’ordre par un canal de contact connu et indépendant.'
            }
          ],
          kernTitel: 'Ici, plusieurs signaux d’alerte indiquent une fraude.',
          kern: 'Instruction de paiement inhabituelle, autorité et confidentialité : une combinaison risquée.'
        },
        {
          id: 'l4-msg-9',
          art: 'teams',
          phishing: true,
          joker: 'Demande-toi : que dois-tu exactement transmettre ici – et à quoi cela sert-il vraiment ?',
          titel: 'L’informatique a besoin de mon code de connexion',
          lage: 'Dans un chat interne, un prétendu administrateur te demande un code à usage unique.',
          von: {
            name: 'Administrateur IT',
            info: 'Service informatique',
            initialen: 'IT'
          },
          zeit: '15:45',
          nachrichten: [
            `Salut {{vorname}}, on teste en ce moment le nouveau login SSO. <mark data-h="a">Tu peux m’envoyer rapidement le code de connexion</mark> que tu viens de recevoir&nbsp;? J’en ai besoin pour le test. Merci&nbsp;!`
          ],
          hinweise: [
            {
              id: 'a',
              art: 'warn',
              titel: 'Demande du code de connexion',
              text: 'Les codes à usage unique confirment ta connexion. Même un administrateur n’a pas besoin que tu lui donnes ce code.'
            }
          ],
          kernTitel: 'Les codes de connexion n’appartiennent qu’à toi.',
          kern: 'Les codes à usage unique confirment ta connexion. Ne les transmets jamais à personne – pas même à de prétendus administrateurs.'
        },
        {
          id: 'l3-msg-6',
          art: 'email',
          phishing: false,
          joker: 'Attends-tu ce document d’après la situation ? Vérifie le domaine de l’expéditeur et où mène le bouton.',
          titel: 'Il manque encore ma signature.',
          lage: 'Un nouveau projet démarre. Parmi tes e-mails se trouve une demande de signature d’un accord de confidentialité.',
          von: {
            name: 'Service de signature Docusign',
            adresse: 'dse@docusign.net'
          },
          an: '{{email}}',
          zeit: 'Aujourd’hui, 14:00',
          betreff: 'Veuillez signer : Accord_de_confidentialite_NDA_2026.pdf',
          inhalt: `
<div style="font-family:Arial,Helvetica,sans-serif;line-height:1.55;color:#1f2937;">
  <div style="display:flex;align-items:center;gap:10px;margin-bottom:22px;"><svg width="38" height="30" viewBox="0 0 34 28" style="display:block;"><path d="M2 2h15v7H9v8H2z" fill="#4C01FC"/><path d="M17 2h8c4 0 7 3 7 7v7h-8V9h-7z" fill="#FF5A67"/><path d="M9 17h8v9H9z" fill="#4C01FC"/></svg><div style="font-size:1.267em;font-weight:700;color:#27214f;">Docusign</div></div>
  <div>Nicolas Perret vous a envoyé un document à signer électroniquement.</div>
  <div style="margin-top:18px;background:#faf9ff;border:1px solid #ded9ff;border-radius:9px;padding:14px 16px;">
    <div style="font-size:.733em;color:#716a9a;text-transform:uppercase;">Document</div>
    <div style="font-weight:700;color:#172033;margin-top:4px;word-break:break-word;">Accord_de_confidentialite_NDA_2026.pdf</div>
  </div>
  <div style="margin-top:20px;"><a data-ziel="https://na3.docusign.net/Signing/StartInSequence.aspx?g=88123-998" style="display:inline-block;background:#4C01FC;color:#fff;text-decoration:none;font-weight:700;padding:11px 17px;border-radius:6px;">Vérifier et signer le document</a></div>
</div>`,
          hinweise: [
            {
              id: 'a',
              bei: 'absender',
              art: 'ok',
              titel: 'Domaine Docusign officiel',
              text: 'Le message utilise le domaine officiel de Docusign. De plus, la demande de signature correspond au contexte attendu du projet.'
            }
          ],
          kernTitel: '',
          kern: 'Les demandes de signature externes peuvent aussi être authentiques. Ce qui compte, c’est que l’expéditeur, la destination du lien et le contexte professionnel attendu soient cohérents.'
        },
        {
          id: 'l3-hotel-payment-phishing',
          art: 'email',
          phishing: true,
          joker: 'Souviens-toi : quand et comment voulais-tu payer ? Vérifie aussi où mène le lien.',
          titel: 'Un problème avec ma réservation d’hôtel ?',
          lage: 'Tu as réservé à l’Hôtel Vue-du-Lac et tu t’en souviens : le paiement se fait sur place. Et voilà que cet e-mail arrive.',
          von: {
            name: 'Hôtel Vue-du-Lac · Réservations',
            adresse: 'reservation@hotel-vuedulac.host'
          },
          an: '{{email}}',
          zeit: 'Aujourd’hui, 16:20',
          betreff: 'Action requise concernant votre réservation HB-72941',
          inhalt: `
<div style="background:#ffffff;color:#323130;font-family:Arial,Helvetica,sans-serif;line-height:1.6;">
  <div style="color:#345c65;border-bottom:2px solid #dce7e9;padding-bottom:16px;margin-bottom:22px;"><strong style="font-size:1.533em;">Hôtel Vue-du-Lac</strong><br><span style="font-size:.8em;">Votre réservation</span></div>
  <p>Bonjour {{name}},</p>
  <p>Nous nous réjouissons de vous accueillir. Voici les informations dont nous disposons pour votre réservation&nbsp;:</p>
  <div style="background:#f3f7f8;border:1px solid #dce7e9;border-radius:6px;padding:14px;"><mark data-h="a">HB-72941 · 16–19 octobre · Chambre double · CHF 420</mark></div>
  <p>Lors de la vérification de votre réservation, la garantie de paiement enregistrée n’a pas pu être validée. Nous vous prions donc de <mark data-h="b">confirmer à nouveau vos données de paiement</mark> afin que votre réservation soit maintenue.</p>
  <p>Merci d’effectuer cette confirmation <mark data-h="c">dans les 24 heures</mark>. À défaut, votre réservation sera automatiquement annulée.</p>
  <p style="margin:24px 0;"><a data-ziel="https://paiement-client.host/reservation/HB-72941" data-h="d" style="display:inline-block;background:#345c65;color:#ffffff;padding:12px 20px;border-radius:4px;text-decoration:none;font-weight:700;">Confirmer les données de paiement</a></p>
  <p>Merci de votre collaboration.<br>Votre équipe des réservations<br>Hôtel Vue-du-Lac</p>
</div>`,
          hinweise: [
            {
              id: 'a',
              art: 'warn',
              titel: 'Les détails de réservation ne prouvent rien',
              text: 'Les escrocs peuvent eux aussi connaître de vraies données de réservation, par exemple après le piratage d’un compte de l’hôtel. Des informations exactes ne rendent pas la demande automatiquement authentique.'
            },
            {
              id: 'b',
              art: 'warn',
              titel: 'Confirmer soudain des données de paiement ?',
              text: 'Le paiement était prévu sur place. Pourquoi te demande-t-on maintenant tes données de paiement ? Renseigne-toi via les coordonnées figurant dans ta confirmation de réservation.'
            },
            {
              id: 'c',
              art: 'warn',
              titel: 'Pression par menace d’annulation',
              text: 'Le délai de 24 heures te met sous pression. Vérifie la demande calmement avant d’agir.'
            },
            {
              id: 'd',
              art: 'warn',
              titel: 'Autre destination du lien',
              text: 'Le lien mène à paiement-client.host. C’est un autre domaine que hotel-vuedulac.ch. Vérifie la demande via ta réservation initiale.'
            }
          ],
          kernTitel: 'De vraies données de réservation ne prouvent pas l’authenticité.',
          kern: 'La demande de paiement ne correspond pas à ta réservation. Ne te laisse pas mettre sous pression et renseigne-toi via les coordonnées figurant dans ta confirmation de réservation.'
        }
      ]
    }
  ],
  nuggets: [
    {
      nachLevel: 1,
      titel: 'Repérer les faux liens',
      untertitel: 'Ne te laisse pas piéger.',
      folien: [
        {
          bild: 'assets/nugget-hover.fr.webp',
          titel: 'Vérifie où mène vraiment le lien',
          text: 'Le texte visible du lien et l’adresse de destination réelle peuvent être différents. Voici comment voir l’adresse de destination :',
          punkte: [
            'Sur ordinateur : survole le lien avec la souris sans cliquer.',
            'Sur smartphone : maintiens le doigt appuyé sur le lien.'
          ]
        },
        {
          bild: 'assets/nugget-domain.fr.webp',
          titel: 'Trouve le domaine dans l’URL',
          text: 'Regarde le domaine dans l’adresse de destination. Il t’indique vers quel site le lien mène réellement.',
          punkte: [
            'Dans order.website.com, par exemple, le domaine est website.com. order n’est que le sous-domaine.'
          ]
        },
        {
          bild: 'assets/nugget-zeichen.webp',
          titel: 'Examine attentivement le domaine',
          text: 'Une seule lettre peut faire toute la différence :',
          punkte: [
            '❌ mlcrosoft.com → ✅ microsoft.com',
            '❌ migr0s.ch → ✅ migros.ch',
            '❌ swiscom.ch → ✅ swisscom.ch'
          ]
        }
      ],
      merke: 'Ce qui compte, c’est le vrai domaine – pas le nom de l’entreprise quelque part dans le lien.',
      knopf: 'Passer au niveau 2'
    },
    {
      nachLevel: 2,
      titel: 'L’IA rend le phishing plus crédible',
      untertitel: 'Ne te fie pas uniquement aux apparences.',
      folien: [
        {
          bild: 'assets/nugget-sprache.webp',
          titel: 'Un texte bien écrit ne prouve rien',
          text: 'L’IA peut créer en quelques secondes des messages crédibles et sans fautes. Les messages de phishing peuvent ainsi paraître professionnels et authentiques.',
          schutz: 'Vérifie l’expéditeur, le domaine et le contexte – même si le message paraît professionnel.'
        },
        {
          bild: 'assets/nugget-stimme.webp',
          titel: 'Les voix et les vidéos ne prouvent rien',
          text: 'L’IA peut imiter à s’y méprendre les voix et les visages de collègues, de clients ou de partenaires commerciaux.',
          schutz: 'Confirme les demandes inhabituelles ou sensibles par un deuxième canal connu.'
        },
        {
          bild: 'assets/nugget-daten.webp',
          titel: 'Les détails personnels ne prouvent rien',
          text: 'L’IA peut intégrer dans des messages des informations publiques sur toi, ton entreprise ou tes projets en cours.',
          schutz: 'Des détails personnels ne prouvent pas qu’un message est authentique. Reste sceptique face aux demandes inhabituelles ou inattendues.'
        }
      ],
      merke: 'Plus un message paraît convaincant, plus il est important de vérifier les demandes inhabituelles.',
      knopf: 'Passer au niveau 3'
    }
  ]
};
