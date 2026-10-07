// Editorial content adapted from the agency briefs; see docs/service-catalog.md.
export type CatalogCategory = 'photo' | 'video' | 'graphic' | 'social' | 'web';
export interface CatalogPage {
  readonly path: string;
  readonly category: CatalogCategory;
  readonly kind: 'hub' | 'detail';
  readonly label: string;
  readonly heading: string;
  readonly summary: string;
  readonly title: string;
  readonly description: string;
  readonly claim: string;
  readonly intro: string;
  readonly deliverables: readonly { readonly title: string; readonly text: string }[];
  readonly sections: readonly { readonly title: string; readonly paragraphs: readonly string[] }[];
  readonly process: readonly { readonly title: string; readonly text: string }[];
  readonly faqs: readonly { readonly question: string; readonly answer: string }[];
  readonly related: readonly string[];
  readonly projectSlugs: readonly string[];
}

export const catalogPages: readonly CatalogPage[] = [
  {
    "path": "/foto",
    "category": "photo",
    "kind": "hub",
    "label": "Fotografia",
    "title": "Servizi fotografici per aziende a Torino | Memento",
    "description": "Fotografia per aziende di Torino e provincia: ritratti corporate, food photography, fotografia immobiliare e product photography. Studio a Moncalieri.",
    "claim": "Fotografia che vende, non che decora.",
    "intro": "Realizziamo servizi fotografici per aziende e professionisti di Torino, Moncalieri e provincia: ritratti corporate, food photography, fotografia immobiliare e still life di prodotto. Nel nostro studio di Moncalieri o direttamente nella vostra sede.",
    "deliverables": [],
    "sections": [
      {
        "title": "Prima dello scatto, pensiamo alla destinazione",
        "paragraphs": [
          "Una fotografia per la home, una scheda prodotto e una campagna richiedono tagli diversi. Definiamo prima formati, spazio per i testi e varianti: il servizio fotografico diventa un archivio utile alla comunicazione, pronto per i canali concordati."
        ]
      },
      {
        "title": "In studio o direttamente da voi",
        "paragraphs": [
          "Nel nostro studio a Moncalieri realizziamo ritratti, still life e set di prodotto. Per corporate, food e immobili portiamo l’attrezzatura in sede, nel locale o nella struttura. Foto e video possono essere pianificati nella stessa giornata."
        ]
      }
    ],
    "process": [],
    "faqs": [
      {
        "question": "Le foto sono nostre da usare ovunque?",
        "answer": "Concordiamo nel preventivo gli utilizzi delle immagini, i canali e gli eventuali limiti. Alla consegna avete un quadro chiaro di dove e come impiegare i file."
      },
      {
        "question": "In che formati consegnate?",
        "answer": "Alta risoluzione per la stampa e versioni già ottimizzate per il web, con nomi file leggibili. Se servono formati specifici per social o marketplace, li prepariamo noi."
      },
      {
        "question": "Quanto tempo passa dallo scatto alla consegna?",
        "answer": "Dipende dal numero di immagini e dalla post-produzione richiesta. I tempi li fissiamo prima e stanno nel preventivo."
      },
      {
        "question": "Potete fare anche i video nella stessa giornata?",
        "answer": "Sì, ed è spesso la scelta più efficiente: un solo set, due tipi di materiale."
      }
    ],
    "related": [
      "/video",
      "/grafica/grafica-stampa-torino",
      "/web/e-commerce-torino"
    ],
    "projectSlugs": [],
    "heading": "Fotografia",
    "summary": "Persone, prodotti, luoghi. Immagini pensate per la vostra comunicazione."
  },
  {
    "path": "/foto/fotografia-corporate-torino",
    "category": "photo",
    "kind": "detail",
    "label": "Fotografia corporate",
    "title": "Fotografia corporate e ritratti aziendali a Torino | Memento",
    "description": "Ritratti aziendali, foto del team e reportage in sede per aziende e professionisti di Torino. Immagini coerenti per sito, LinkedIn e comunicazione.",
    "claim": "La prima stretta di mano ormai avviene online.",
    "intro": "Realizziamo fotografia corporate per aziende e professionisti di Torino e provincia: ritratti individuali, foto del team, reportage in sede ed eventi aziendali. Immagini coerenti fra loro, pronte per il sito, LinkedIn, i comunicati e i materiali commerciali.",
    "deliverables": [
      {
        "title": "Ritratti individuali",
        "text": "per il sito, i profili LinkedIn, le firme e le presentazioni"
      },
      {
        "title": "Foto del team",
        "text": "di gruppo e per reparto, con uno stile unico per tutti"
      },
      {
        "title": "Reportage in azienda",
        "text": "uffici, produzione, laboratori, le persone al lavoro"
      },
      {
        "title": "Eventi aziendali",
        "text": "convention, inaugurazioni, premiazioni, fiere"
      },
      {
        "title": "Immagini istituzionali",
        "text": "per comunicati stampa, bilanci, brochure e candidature"
      }
    ],
    "sections": [
      {
        "title": "Un team, un’immagine coerente",
        "paragraphs": [
          "Luce, sfondo e inquadratura seguono una direzione comune: i ritratti individuali dialogano con le foto di gruppo e con il racconto dell’azienda. Documentiamo il set per mantenere coerenza anche quando arrivano nuovi collaboratori."
        ]
      },
      {
        "title": "Persone a proprio agio, anche davanti all’obiettivo",
        "paragraphs": [
          "Studi professionali, aziende B2B e team che lavorano sul recruiting hanno bisogno di mostrare le persone con naturalezza. Guidiamo le pose, concordiamo la selezione e organizziamo i turni di scatto per limitare le interruzioni della giornata lavorativa."
        ]
      }
    ],
    "process": [
      {
        "title": "Brief",
        "text": "Definiamo dove andranno le foto e che immagine deve trasmettere l’azienda: istituzionale, dinamica, informale."
      },
      {
        "title": "Set in sede",
        "text": "Portiamo luci e fondale da voi. Nessuno deve spostarsi, e la giornata lavorativa si interrompe il meno possibile."
      },
      {
        "title": "Scatto",
        "text": "Pochi minuti a persona, guidati. Chi non è abituato a posare riceve indicazioni precise, non richieste generiche di “essere naturale”"
      },
      {
        "title": "Selezione e post-produzione",
        "text": "Scegliamo insieme gli scatti migliori; ritocco naturale, senza alterare i volti."
      },
      {
        "title": "Consegna",
        "text": "File per web e stampa, già ritagliati nei formati che servono."
      }
    ],
    "faqs": [
      {
        "question": "Dobbiamo venire in studio?",
        "answer": "No, nella maggior parte dei casi veniamo noi da voi con un set portatile. Lo studio di Moncalieri è un’opzione per chi preferisce o per ritratti singoli."
      },
      {
        "question": "Quanto tempo serve per fotografare tutto il team?",
        "answer": "Dipende dal numero di persone e dai set richiesti. Per un team di medie dimensioni di solito basta mezza giornata in sede."
      },
      {
        "question": "Se assumiamo nuove persone, le foto saranno uguali alle altre?",
        "answer": "Documentiamo luce, sfondo e inquadrature per riprendere lo stesso stile anche nei servizi successivi."
      },
      {
        "question": "E se qualcuno non si piace in foto?",
        "answer": "È normale e ci lavoriamo: indicazioni precise durante lo scatto e selezione fatta insieme. Nessuno si ritrova sul sito con una foto che non ha approvato."
      }
    ],
    "related": [
      "/video",
      "/grafica/grafica-stampa-torino",
      "/web/e-commerce-torino"
    ],
    "projectSlugs": [],
    "heading": "Fotografia corporate",
    "summary": "Ritratti, team e reportage. Un volto riconoscibile per la vostra azienda."
  },
  {
    "path": "/foto/food-photography-torino",
    "category": "photo",
    "kind": "detail",
    "label": "Food & Drinks",
    "title": "Food photography a Torino per ristoranti e brand | Memento",
    "description": "Food photography per ristoranti, locali, pasticcerie e aziende alimentari di Torino: piatti, menu, ambienti e prodotti, fotografati per invogliare.",
    "claim": "Il cliente assaggia con gli occhi, prima ancora di sedersi.",
    "intro": "Realizziamo food photography per ristoranti, locali, pasticcerie e brand alimentari di Torino e provincia: piatti, menu, ambienti, staff e prodotti confezionati. Fotografie pensate per il menu, il sito, i social e le piattaforme di delivery.",
    "deliverables": [
      {
        "title": "Piatti e menu",
        "text": "per il sito, il menu stampato e quello digitale"
      },
      {
        "title": "Foto per il delivery",
        "text": "nei formati e con gli sfondi richiesti dalle piattaforme"
      },
      {
        "title": "Ambienti e staff",
        "text": "il locale, la sala, la cucina al lavoro"
      },
      {
        "title": "Prodotti alimentari confezionati",
        "text": "per e-commerce, cataloghi e packaging"
      },
      {
        "title": "Contenuti per i social",
        "text": "foto e, nella stessa giornata, video brevi per i reel"
      }
    ],
    "sections": [
      {
        "title": "Il set è pronto prima del piatto",
        "paragraphs": [
          "Coordinarsi con la cucina fa la differenza: prepariamo luce, fondali e stoviglie, poi fotografiamo i piatti nell’ordine concordato. Texture, colori e presentazione restano fedeli a quello che il cliente troverà a tavola."
        ]
      },
      {
        "title": "Dal menu al racconto del locale",
        "paragraphs": [
          "Ristoranti, cocktail bar, pasticcerie e produttori alimentari hanno esigenze diverse. Accanto al prodotto raccontiamo ambienti e persone, così menu, sito e social condividono la stessa identità. Se servono reel, li pianifichiamo insieme agli scatti."
        ]
      }
    ],
    "process": [
      {
        "title": "Lista dei piatti",
        "text": "Concordiamo con voi cosa fotografare e in che ordine, in base ai tempi della cucina."
      },
      {
        "title": "Set nel locale",
        "text": "Fuori dall’orario di servizio, con un set luci portatile. Il locale non chiude."
      },
      {
        "title": "Scatto",
        "text": "Piatto per piatto, con uno styling essenziale: stoviglie, sfondi e dettagli coerenti con l’identità del locale."
      },
      {
        "title": "Post-produzione",
        "text": "Colori fedeli: un piatto più saturo in foto che dal vivo è una promessa che il cliente vede tradita al tavolo."
      },
      {
        "title": "Consegna",
        "text": "Formati per menu, sito, social e piattaforme di delivery."
      }
    ],
    "faqs": [
      {
        "question": "Dobbiamo chiudere il locale?",
        "answer": "No. Fotografiamo fuori dall’orario di servizio se necessario, in genere al mattino o nel primo pomeriggio."
      },
      {
        "question": "I piatti fotografati sono veri?",
        "answer": "Sempre. Li prepara il vostro chef, come li prepara per i clienti."
      },
      {
        "question": "Fate anche le foto per Deliveroo, Glovo e Just Eat?",
        "answer": "Sì, rispettando i formati e le indicazioni di ciascuna piattaforma."
      },
      {
        "question": "Nella stessa giornata potete girare anche dei video?",
        "answer": "Sì. Concordiamo in anticipo la lista di scatti e riprese per ricavare foto e reel dalla stessa sessione."
      }
    ],
    "related": [
      "/video",
      "/grafica/grafica-stampa-torino",
      "/web/e-commerce-torino"
    ],
    "projectSlugs": [],
    "heading": "Food & Drinks",
    "summary": "Piatti, cocktail e ambienti. Il carattere del locale, prima dell’assaggio."
  },
  {
    "path": "/foto/fotografia-immobiliare-torino",
    "category": "photo",
    "kind": "detail",
    "label": "Fotografia immobiliare",
    "title": "Fotografia immobiliare e real estate a Torino | Memento",
    "description": "Fotografia immobiliare per agenzie, costruttori, B&B e case vacanza a Torino e provincia: interni, esterni e riprese aeree con drone.",
    "claim": "Un immobile si visita prima sullo schermo.",
    "intro": "Realizziamo fotografia immobiliare per agenzie, costruttori, B&B e strutture ricettive di Torino e provincia: interni, esterni e riprese aeree con drone. Immagini luminose e fedeli, consegnate in tempi rapidi.",
    "deliverables": [
      {
        "title": "Interni",
        "text": "con luce bilanciata fra ambienti e finestre"
      },
      {
        "title": "Esterni e contesto",
        "text": "facciate, giardini, vista, quartiere"
      },
      {
        "title": "Riprese aeree con drone",
        "text": "per ville, terreni, complessi e nuove costruzioni"
      },
      {
        "title": "Case vacanza e strutture ricettive",
        "text": "per Airbnb, Booking e siti diretti"
      },
      {
        "title": "Cantieri e nuove costruzioni",
        "text": "dall’avanzamento lavori alla consegna"
      }
    ],
    "sections": [
      {
        "title": "Luce curata, proporzioni fedeli",
        "paragraphs": [
          "Valorizziamo gli ambienti senza modificarne la percezione: prospettive corrette, colori naturali e bilanciamento fra interni e finestre. Scegliamo l’orario in base all’esposizione e prepariamo gli spazi prima di iniziare."
        ]
      },
      {
        "title": "Dagli annunci all’ospitalità",
        "paragraphs": [
          "Lavoriamo con agenzie immobiliari, costruttori, architetti e strutture ricettive. Le immagini vengono preparate per portali, siti e brochure. Per incarichi continuativi definiamo un calendario e tempi di consegna concordati; le riprese aeree dipendono dalla fattibilità del luogo."
        ]
      }
    ],
    "process": [
      {
        "title": "Briefing",
        "text": "Tipologia dell’immobile, punti di forza, uso delle foto: portale, sito, brochure."
      },
      {
        "title": "Orario giusto",
        "text": "Scegliamo quando scattare in base all’esposizione: la stessa stanza cambia completamente fra le 9 e le 17."
      },
      {
        "title": "Scatto",
        "text": "Interni, esterni e, dove serve e dove è consentito, riprese con il drone."
      },
      {
        "title": "Post-produzione",
        "text": "Correzione delle prospettive e bilanciamento fra interni e finestre, senza alterare gli ambienti."
      },
      {
        "title": "Consegna rapida",
        "text": "Nei formati richiesti dai portali, perché nell’immobiliare un giorno di ritardo è un giorno di annuncio in meno."
      }
    ],
    "faqs": [
      {
        "question": "Come va preparato l’immobile?",
        "answer": "Ordinato, luci accese, tapparelle alzate, oggetti personali ridotti al minimo. Vi guidiamo sia prima che durante il servizio."
      },
      {
        "question": "Il drone si può usare ovunque?",
        "answer": "No, esistono zone con limitazioni al volo. Verifichiamo prima del servizio e vi diciamo in anticipo se le riprese aeree sono possibili."
      },
      {
        "question": "Lavorate con agenzie in modo continuativo?",
        "answer": "Sì, con tempi e condizioni concordati per più immobili al mese."
      },
      {
        "question": "Fate anche i video degli immobili?",
        "answer": "Sì, anche nella stessa uscita."
      }
    ],
    "related": [
      "/video",
      "/grafica/grafica-stampa-torino",
      "/web/e-commerce-torino"
    ],
    "projectSlugs": [],
    "heading": "Fotografia immobiliare",
    "summary": "Interni, esterni e ospitalità. Spazi raccontati con luce e proporzioni fedeli."
  },
  {
    "path": "/foto/product-photography-torino",
    "category": "photo",
    "kind": "detail",
    "label": "Product photography",
    "title": "Product photography e still life a Torino | Memento",
    "description": "Packshot, still life e foto ambientate per e-commerce e cataloghi di aziende di Torino e provincia. Realizzate nel nostro studio di Moncalieri.",
    "claim": "Se il prodotto non convince in foto, non arriva al carrello.",
    "intro": "Realizziamo product photography e still life per e-commerce, cataloghi e campagne di aziende di Torino e provincia: packshot su fondo neutro, foto ambientate e dettagli, scattati nel nostro studio di Moncalieri.",
    "deliverables": [
      {
        "title": "Packshot su fondo bianco",
        "text": "per e-commerce e marketplace, nel rispetto dei loro requisiti"
      },
      {
        "title": "Foto ambientate",
        "text": "il prodotto nel suo contesto d’uso"
      },
      {
        "title": "Dettagli e materiali",
        "text": "trame, finiture, lavorazioni"
      },
      {
        "title": "Cataloghi e packaging",
        "text": "immagini per la stampa e per la confezione"
      },
      {
        "title": "Intere collezioni",
        "text": "decine o centinaia di prodotti con un unico stile"
      }
    ],
    "sections": [
      {
        "title": "Un catalogo coerente, scatto dopo scatto",
        "paragraphs": [
          "Impostiamo luce, angolazione e proporzioni su un campione approvato. Il set documentato permette di mantenere continuità fra prodotti, varianti e nuove collezioni: le pagine del catalogo risultano ordinate e più facili da confrontare."
        ]
      },
      {
        "title": "Mostrare ciò che conta per scegliere",
        "paragraphs": [
          "Packshot, dettagli e foto ambientate rispondono a domande diverse: com’è fatto, quali materiali usa, come si presenta nel suo contesto. Prepariamo i formati richiesti dal negozio e dai marketplace, con file organizzati per codice prodotto."
        ]
      }
    ],
    "process": [
      {
        "title": "Ricezione dei prodotti",
        "text": "Li portate o li spedite in studio, con la lista degli articoli."
      },
      {
        "title": "Prova di stile",
        "text": "Scattiamo un campione e lo approvate prima di procedere con tutto il resto."
      },
      {
        "title": "Scatto in serie",
        "text": "Set fisso, stessa luce per tutti."
      },
      {
        "title": "Post-produzione",
        "text": "Scontorno, pulizia, colore fedele."
      },
      {
        "title": "Consegna",
        "text": "File già rinominati per codice prodotto, nei formati per sito, marketplace e stampa."
      }
    ],
    "faqs": [
      {
        "question": "Dobbiamo portarvi i prodotti?",
        "answer": "Sì, per packshot e still life si lavora in studio. Per prodotti molto grandi o macchinari veniamo noi da voi."
      },
      {
        "question": "Rispettate i requisiti di Amazon e degli altri marketplace?",
        "answer": "Sì: fondo, proporzioni e dimensioni secondo le regole di ciascuna piattaforma."
      },
      {
        "question": "Quante foto servono per ogni prodotto?",
        "answer": "Per un e-commerce, in genere da tre a cinque: frontale, retro o lato, dettaglio, ambientata. Le definiamo insieme per categoria."
      },
      {
        "question": "Le foto sono già pronte da caricare?",
        "answer": "Sì, ottimizzate per il web e rinominate per codice prodotto. Se state costruendo il negozio online, possiamo occuparci anche di quello."
      }
    ],
    "related": [
      "/video",
      "/grafica/grafica-stampa-torino",
      "/web/e-commerce-torino"
    ],
    "projectSlugs": [],
    "heading": "Product photography",
    "summary": "Packshot, dettagli e ambientate. Un catalogo coerente, articolo dopo articolo."
  },
  {
    "path": "/video",
    "category": "video",
    "kind": "hub",
    "label": "Video",
    "title": "Produzione video per aziende a Torino | Memento Production",
    "description": "Video aziendali, reel per i social, video animati, corsi e testimonial per aziende di Torino e provincia. Troupe, riprese e montaggio interni.",
    "claim": "Pochi secondi di attenzione. Usiamoli bene.",
    "intro": "Produciamo video per aziende e professionisti di Torino, Moncalieri e provincia: video aziendali, reel per i social, video animati e infografiche, video corsi e testimonial. Troupe, attrezzatura e montaggio interni, dalla sceneggiatura alla consegna.",
    "deliverables": [],
    "sections": [
      {
        "title": "Dall’idea alle versioni pronte da pubblicare",
        "paragraphs": [
          "Obiettivo, pubblico e canale guidano il progetto. Seguiamo concept, scaletta, riprese, montaggio, suono e adattamenti: un unico gruppo di lavoro accompagna il video fino alla consegna. Possiamo coordinare anche fotografia, grafica e distribuzione."
        ]
      }
    ],
    "process": [
      {
        "title": "Pre-produzione",
        "text": "Messaggio, pubblico, sceneggiatura, location. È la fase in cui si decide tutto."
      },
      {
        "title": "Riprese",
        "text": "In studio a Moncalieri o nella vostra sede, con troupe e attrezzatura nostre."
      },
      {
        "title": "Montaggio",
        "text": "Prima versione, giro di revisioni concordato, grafiche e sottotitoli."
      },
      {
        "title": "Consegna",
        "text": "File nei formati previsti e indicazioni sugli utilizzi concordati."
      }
    ],
    "faqs": [
      {
        "question": "Quanto tempo passa dalle riprese alla consegna?",
        "answer": "Dipende dal tipo di video e dalla post-produzione. I tempi li fissiamo prima e stanno nel preventivo."
      },
      {
        "question": "Girate anche fuori Torino?",
        "answer": "Sì, in tutto il Piemonte. Fuori regione si valuta in base al progetto."
      },
      {
        "question": "I video sono nostri?",
        "answer": "Concordiamo nel preventivo canali, utilizzi e licenze necessarie, incluse quelle di eventuali musiche o risorse esterne."
      },
      {
        "question": "Potete anche pubblicarli e promuoverli?",
        "answer": "Sì. Gestiamo i social e le campagne con lo stesso team che produce i video."
      }
    ],
    "related": [
      "/foto",
      "/social",
      "/google-meta-ads"
    ],
    "projectSlugs": [
      "dora-events",
      "speed-trasporti"
    ],
    "heading": "Video",
    "summary": "Storie, persone e idee. Dalla scaletta all’ultima versione."
  },
  {
    "path": "/video/video-aziendali-torino",
    "category": "video",
    "kind": "detail",
    "label": "Video aziendali",
    "title": "Video aziendali a Torino | Memento Production",
    "description": "Produciamo video aziendali a Torino e provincia: istituzionali, spot, video di prodotto ed eventi. Dalla sceneggiatura al montaggio, con troupe interna.",
    "claim": "Raccontare cosa fate, senza doverlo spiegare due volte.",
    "intro": "Produciamo video aziendali per imprese di Torino e provincia: video istituzionali, spot, video di prodotto e di processo, riprese di eventi e fiere. Dalla sceneggiatura al montaggio, con troupe e attrezzatura interne.",
    "deliverables": [
      {
        "title": "Video istituzionale",
        "text": "chi siete, cosa fate, perché lavorare con voi. Il video della home e delle presentazioni commerciali"
      },
      {
        "title": "Spot",
        "text": "brevi, pensati per le campagne su Meta, Google e YouTube"
      },
      {
        "title": "Video di prodotto e di processo",
        "text": "come funziona un prodotto, come nasce, perché è fatto meglio"
      },
      {
        "title": "Eventi e fiere",
        "text": "riprese in giornata e montaggio rapido"
      },
      {
        "title": "Video per il recruiting",
        "text": "l’azienda raccontata da chi ci lavora"
      }
    ],
    "sections": [
      {
        "title": "Prima il messaggio, poi le riprese",
        "paragraphs": [
          "Un video istituzionale, uno spot e il racconto di un evento hanno ritmi e obiettivi diversi. Partiamo da ciò che deve capire chi guarda, scegliamo le scene e prepariamo una scaletta. Sul set ogni ripresa ha una funzione nel racconto."
        ]
      },
      {
        "title": "Un progetto, più occasioni d’uso",
        "paragraphs": [
          "Pianifichiamo già in partenza la versione principale e gli eventuali tagli brevi, verticali o sottotitolati. Il materiale può così vivere sul sito, nelle presentazioni commerciali e nei canali social, mantenendo coerenza di messaggio."
        ]
      }
    ],
    "process": [
      {
        "title": "Pre-produzione",
        "text": "Messaggio, sceneggiatura, lista delle inquadrature, sopralluogo se serve."
      },
      {
        "title": "Riprese",
        "text": "Una o due giornate nella maggior parte dei casi. Vi diciamo prima chi deve esserci e per quanto tempo."
      },
      {
        "title": "Montaggio",
        "text": "Prima versione, revisioni concordate, grafiche, sottotitoli e musica con licenza."
      },
      {
        "title": "Consegna",
        "text": "Versione principale più i formati per social e campagne."
      }
    ],
    "faqs": [
      {
        "question": "Quanto deve durare un video aziendale?",
        "answer": "Per il sito, in genere fra uno e due minuti. Per una campagna, fra 15 e 30 secondi. La durata la decide dove verrà visto, non quanto c’è da dire."
      },
      {
        "question": "Servono attori?",
        "answer": "Quasi mai. Le persone più credibili da inquadrare sono quelle che lavorano da voi."
      },
      {
        "question": "Serve una troupe numerosa?",
        "answer": "No. La maggior parte dei video aziendali si gira bene con una squadra ridotta, che interrompe meno il lavoro in azienda."
      },
      {
        "question": "Possiamo usarlo anche nelle campagne?",
        "answer": "Sì, e conviene prevederlo in fase di ripresa."
      }
    ],
    "related": [
      "/foto",
      "/social",
      "/google-meta-ads"
    ],
    "projectSlugs": [
      "dora-events",
      "speed-trasporti"
    ],
    "heading": "Video aziendali",
    "summary": "L’azienda, i prodotti e gli eventi, raccontati con una direzione chiara."
  },
  {
    "path": "/video/reel-social-torino",
    "category": "video",
    "kind": "detail",
    "label": "Reel per i social",
    "title": "Reel per social e video verticali a Torino | Memento",
    "description": "Reel e video verticali per aziende e professionisti di Torino: format, riprese e montaggio per Instagram, TikTok e YouTube Shorts.",
    "claim": "Tre secondi per convincere qualcuno a restare.",
    "intro": "Produciamo reel e video verticali per aziende e professionisti di Torino, Moncalieri e provincia: format ricorrenti, riprese in blocco e montaggio pensato per Instagram, TikTok e YouTube Shorts.",
    "deliverables": [
      {
        "title": "Format ricorrenti",
        "text": "rubriche riconoscibili che il pubblico impara ad aspettare"
      },
      {
        "title": "Dietro le quinte",
        "text": "il lavoro, le persone, il processo"
      },
      {
        "title": "Spiegazioni e consigli",
        "text": "il vostro sapere tradotto in 30 secondi"
      },
      {
        "title": "Lanci di prodotto e offerte",
        "text": "pensati anche per girare in sponsorizzata"
      },
      {
        "title": "Tendenze adattate",
        "text": "solo quando hanno senso per il vostro brand"
      }
    ],
    "sections": [
      {
        "title": "Format riconoscibili, senza improvvisare ogni volta",
        "paragraphs": [
          "Costruiamo rubriche intorno a prodotti, persone e domande dei clienti. Prepariamo aperture, scalette e inquadrature in funzione del formato verticale, così ogni contenuto ha un tema chiaro e un ritmo adatto al canale."
        ]
      },
      {
        "title": "Più contenuti dalla stessa giornata",
        "paragraphs": [
          "Organizziamo le riprese in blocco: backstage, spiegazioni, lanci e dimostrazioni possono condividere set e attrezzatura. Il montaggio comprende testi a schermo e sottotitoli quando previsti. Frequenza e pubblicazione si coordinano con il piano social."
        ]
      }
    ],
    "process": [
      {
        "title": "Format e aperture",
        "text": "Decidiamo cosa raccontare e scriviamo i primi secondi di ogni reel."
      },
      {
        "title": "Giornata di riprese",
        "text": "In studio o da voi, per coprire il mese."
      },
      {
        "title": "Montaggio",
        "text": "Ritmo, sottotitoli a blocchi, musica, formati per ogni piattaforma."
      },
      {
        "title": "Pubblicazione",
        "text": "Ve li consegniamo, oppure li pubblichiamo noi se seguiamo i vostri canali."
      }
    ],
    "faqs": [
      {
        "question": "Quanti reel servono al mese?",
        "answer": "Dipende dal canale e dagli obiettivi. La costanza conta più del numero: meglio pochi e regolari che molti e sporadici."
      },
      {
        "question": "Devo comparire io nei video?",
        "answer": "Aiuta, perché le persone si fidano delle persone. Ma si possono costruire format efficaci anche sul prodotto, sul processo o con una voce fuori campo."
      },
      {
        "question": "Si possono usare nelle sponsorizzate?",
        "answer": "Sì, se pianifichiamo formati e utilizzi pubblicitari, comprese le licenze audio, già in fase di produzione."
      },
      {
        "question": "Gestite anche i profili?",
        "answer": "Sì. Produzione dei contenuti e gestione social possono far parte dello stesso progetto, con un calendario e responsabilità concordati."
      }
    ],
    "related": [
      "/foto",
      "/social",
      "/google-meta-ads"
    ],
    "projectSlugs": [
      "il-forte",
      "speed-trasporti"
    ],
    "heading": "Reel per i social",
    "summary": "Format verticali, backstage e rubriche: contenuti da pubblicare con continuità."
  },
  {
    "path": "/video/video-animati-torino",
    "category": "video",
    "kind": "detail",
    "label": "Video animati",
    "title": "Video animati e infografiche a Torino | Memento Production",
    "description": "Video animati, motion graphics e infografiche animate per aziende di Torino: explainer, dati e processi resi chiari, animazioni per i vostri video.",
    "claim": "Quello che è difficile da spiegare, diventa facile da guardare.",
    "intro": "Realizziamo video animati, motion graphics e infografiche animate per aziende di Torino e provincia: explainer di prodotto e di servizio, dati e processi resi chiari, animazioni da integrare nei video girati e nei contenuti social.",
    "deliverables": [
      {
        "title": "Explainer video",
        "text": "come funziona un prodotto, un servizio, un’offerta"
      },
      {
        "title": "Infografiche animate",
        "text": "numeri, risultati e dati che si capiscono al primo colpo"
      },
      {
        "title": "Animazione del logo e dell’identità",
        "text": "per aperture, chiusure e presentazioni"
      },
      {
        "title": "Motion graphics nei video girati",
        "text": "titoli, grafiche, evidenziazioni"
      },
      {
        "title": "Video tecnici e di processo",
        "text": "quello che la telecamera non può riprendere"
      },
      {
        "title": "Contenuti animati per i social",
        "text": "brevi, in formato verticale"
      }
    ],
    "sections": [
      {
        "title": "Rendere visibile ciò che è difficile riprendere",
        "paragraphs": [
          "Servizi, dati e processi tecnici possono essere raccontati con illustrazioni e motion graphics. Prima dell’animazione definiamo messaggio, storyboard e stile visivo: è il momento giusto per verificare contenuto e direzione insieme."
        ]
      },
      {
        "title": "Il movimento segue l’identità",
        "paragraphs": [
          "Colori, caratteri, icone e ritmo si coordinano con il brand. Una voce narrante, i testi a schermo e il sound design vengono valutati in base al progetto. Consegniamo il video nei formati concordati per sito, presentazioni e social."
        ]
      }
    ],
    "process": [
      {
        "title": "Testo",
        "text": "Prima di tutto la sceneggiatura e il testo della voce. In un video animato, se il testo non funziona, nessuna animazione lo salva."
      },
      {
        "title": "Stile",
        "text": "Un paio di fotogrammi di prova da approvare prima di animare tutto."
      },
      {
        "title": "Animazione",
        "text": "Sviluppo completo, con un giro di revisioni concordato."
      },
      {
        "title": "Voce e suono",
        "text": "Voce fuori campo, musica ed effetti sonori."
      },
      {
        "title": "Consegna",
        "text": "Nei formati per sito, presentazioni e social."
      }
    ],
    "faqs": [
      {
        "question": "Servono riprese?",
        "answer": "No, un video animato si realizza interamente in post-produzione. Si possono però combinare animazione e riprese nello stesso video."
      },
      {
        "question": "Quanto dura un explainer?",
        "answer": "Spesso si parte da un formato breve, indicativamente fra 60 e 90 secondi. La durata dipende da contenuto, pubblico e contesto di visione."
      },
      {
        "question": "Si può aggiornare in futuro?",
        "answer": "Sì, ed è uno dei vantaggi dell’animazione: cambiare un dato o un passaggio è molto più semplice che rigirare delle scene."
      },
      {
        "question": "La voce fuori campo è inclusa?",
        "answer": "La prevediamo nel progetto, con voci professionali scelte insieme a voi."
      }
    ],
    "related": [
      "/foto",
      "/social",
      "/google-meta-ads"
    ],
    "projectSlugs": [],
    "heading": "Video animati",
    "summary": "Motion graphics ed explainer per rendere comprensibili servizi e processi."
  },
  {
    "path": "/video/video-corsi-testimonial-torino",
    "category": "video",
    "kind": "detail",
    "label": "Corsi & testimonial",
    "title": "Video corsi e video testimonial a Torino | Memento",
    "description": "Video testimonial e video corsi per aziende, professionisti e formatori di Torino: interviste ai clienti, casi di successo e lezioni registrate.",
    "claim": "Le persone si fidano delle persone.",
    "intro": "Produciamo video testimonial e video corsi per aziende, professionisti e formatori di Torino e provincia: interviste ai clienti, casi di successo, lezioni e percorsi formativi registrati in studio a Moncalieri o nella vostra sede.",
    "deliverables": [
      {
        "title": "Interviste ai clienti",
        "text": "il loro punto di vista, con le loro parole"
      },
      {
        "title": "Casi di successo in video",
        "text": "il problema, il lavoro, il risultato"
      },
      {
        "title": "Recensioni video",
        "text": "per il sito, YouTube e le campagne"
      },
      {
        "title": "Interviste al fondatore e al team",
        "text": "chi c’è dietro l’azienda"
      },
      {
        "title": "Corsi online",
        "text": "per professionisti e formatori che vendono il proprio sapere"
      },
      {
        "title": "Formazione interna e onboarding",
        "text": "procedure, sicurezza, prodotti, spiegati una volta e rivisti quando serve"
      },
      {
        "title": "Lezioni per piattaforme e-learning",
        "text": "nei formati richiesti"
      },
      {
        "title": "Webinar e interventi",
        "text": "registrati e rimontati per essere riutilizzati"
      }
    ],
    "sections": [
      {
        "title": "Testimonianze con le parole di chi le vive",
        "paragraphs": [
          "Prepariamo le domande e accompagniamo la persona durante l’intervista. Il montaggio organizza i passaggi senza cambiare il significato del racconto; la testimonianza viene condivisa per l’approvazione prima dell’utilizzo."
        ]
      },
      {
        "title": "Lezioni facili da seguire",
        "paragraphs": [
          "Per i corsi organizziamo il programma in moduli e curiamo in particolare la chiarezza dell’audio. Slide, schemi e grafiche entrano nel montaggio con una gerarchia leggibile. Concordiamo con voi i requisiti della piattaforma su cui verranno caricati."
        ]
      }
    ],
    "process": [
      {
        "title": "Testimonial",
        "text": "Preparazione delle domande con voi, un’ora o due di riprese dal cliente, montaggio, approvazione del cliente prima della pubblicazione."
      },
      {
        "title": "Corsi",
        "text": "Struttura in moduli, set in studio o in sede con audio curato, integrazione di slide e grafiche, consegna nei formati per la piattaforma scelta."
      }
    ],
    "faqs": [
      {
        "question": "Il cliente deve venire in studio?",
        "answer": "No, andiamo noi da lui. Una o due ore sono in genere sufficienti."
      },
      {
        "question": "Serve un copione?",
        "answer": "Per i testimonial prepariamo domande, senza imporre risposte. Per i corsi definiamo una scaletta per ogni lezione, così chi parla ha un riferimento chiaro."
      },
      {
        "question": "Su che piattaforma si caricano i corsi?",
        "answer": "Su quella che preferite: consegniamo i file nei formati richiesti. Se non avete ancora scelto, vi aiutiamo a decidere."
      },
      {
        "question": "Possiamo usare i testimonial nelle campagne?",
        "answer": "Sì, se gli utilizzi pubblicitari sono stati concordati e autorizzati dalla persona intervistata. Possiamo predisporre tagli dedicati alle campagne."
      }
    ],
    "related": [
      "/foto",
      "/social",
      "/google-meta-ads"
    ],
    "projectSlugs": [],
    "heading": "Video corsi e testimonial",
    "summary": "Interviste autentiche e lezioni curate, con un’attenzione speciale all’audio."
  },
  {
    "path": "/grafica",
    "category": "graphic",
    "kind": "hub",
    "label": "Grafica",
    "title": "Agenzia grafica e brand identity a Torino | Memento",
    "description": "Grafica per aziende di Torino e provincia: creazione loghi, brand identity, grafica per la stampa e rebranding. Un’identità coerente su ogni canale.",
    "claim": "Un’identità è quello che resta quando togli le parole.",
    "intro": "Progettiamo loghi, identità visive, materiali stampati e rebranding per aziende di Torino, Moncalieri e provincia. È il punto da cui parte tutto il resto: senza una direzione visiva, ogni contenuto diventa una decisione presa da capo.",
    "deliverables": [],
    "sections": [
      {
        "title": "Una direzione comune per ogni materiale",
        "paragraphs": [
          "Logo, colori, caratteri e impaginazione aiutano il pubblico a riconoscervi. Definire queste regole rende più semplice produrre materiali coerenti, dal biglietto da visita alla pagina social."
        ]
      },
      {
        "title": "Dall’identità alle applicazioni",
        "paragraphs": [
          "Grafici, fotografi, videomaker e sviluppatori lavorano nello stesso team. La direzione visiva può così essere applicata a fotografie, video, siti e materiali stampati, con un unico coordinamento."
        ]
      }
    ],
    "process": [],
    "faqs": [
      {
        "question": "Ho già un logo: devo rifarlo?",
        "answer": "Non necessariamente. Spesso il logo funziona e manca tutto il resto: colori, caratteri, regole d’uso. In quel caso si costruisce l’identità attorno a quello che c’è. Se invece il logo non regge più, si valuta un restyling."
      },
      {
        "question": "Mi date i file sorgente?",
        "answer": "Consegniamo i file e le varianti previsti dal progetto, accompagnati dalle regole d’uso. Formati, diritti e licenze di eventuali risorse esterne sono definiti nel preventivo."
      },
      {
        "question": "Quanto tempo serve?",
        "answer": "Dipende dal progetto: un logo e un’identità completa hanno tempi molto diversi. Li fissiamo prima e stanno nel preventivo."
      },
      {
        "question": "Potete applicare la nuova grafica anche a sito e social?",
        "answer": "Sì, è uno dei vantaggi di lavorare con un’agenzia che fa anche quello."
      }
    ],
    "related": [
      "/foto/product-photography-torino",
      "/web",
      "/social"
    ],
    "projectSlugs": [],
    "heading": "Grafica",
    "summary": "Dal primo segno a un’identità che vive su ogni supporto."
  },
  {
    "path": "/grafica/creazione-loghi-torino",
    "category": "graphic",
    "kind": "detail",
    "label": "Creazione loghi",
    "title": "Creazione loghi a Torino | Memento Production",
    "description": "Progettiamo loghi per aziende e attività di Torino e provincia: ricerca, proposte, varianti e file in tutti i formati, con le regole d’uso.",
    "claim": "Un segno che si riconosce in un secondo.",
    "intro": "Progettiamo loghi per aziende, attività e professionisti di Torino, Moncalieri e provincia. Non solo il simbolo: le varianti, le versioni per ogni supporto e le regole per usarlo senza rovinarlo.",
    "deliverables": [
      {
        "title": "Ricerca",
        "text": "settore, concorrenti, cosa il logo deve evitare di sembrare"
      },
      {
        "title": "Due o tre direzioni creative",
        "text": "distinte fra loro, non venti varianti della stessa idea"
      },
      {
        "title": "Logotipo e simbolo",
        "text": "insieme e separati"
      },
      {
        "title": "Varianti",
        "text": "orizzontale, verticale, compatta, monocromatica, in negativo"
      },
      {
        "title": "Versioni digitali",
        "text": "favicon, immagine profilo per i social, firma email"
      },
      {
        "title": "File in tutti i formati",
        "text": "vettoriali per la stampa, raster per il web"
      },
      {
        "title": "Regole d’uso essenziali",
        "text": "spazi di rispetto, dimensioni minime, cosa non fare"
      }
    ],
    "sections": [
      {
        "title": "Un segno da mettere alla prova",
        "paragraphs": [
          "Verifichiamo la leggibilità in piccolo, la resa monocromatica e l’applicazione su fondi diversi. Le proposte vengono mostrate in contesti reali — un sito, un’insegna, un biglietto — per scegliere una direzione che rappresenti l’azienda anche nell’uso quotidiano."
        ]
      }
    ],
    "process": [
      {
        "title": "Ricerca",
        "text": "Cosa fa l’azienda, a chi si rivolge, come si presentano i concorrenti."
      },
      {
        "title": "Proposte",
        "text": "Due o tre direzioni, ciascuna mostrata in contesto: insegna, biglietto, sito, profilo social. Un logo si giudica applicato, non da solo su un foglio bianco."
      },
      {
        "title": "Affinamento",
        "text": "Scelta una direzione, la portiamo a termine con i giri di revisione concordati."
      },
      {
        "title": "Consegna",
        "text": "Tutte le varianti, tutti i formati, le regole d’uso."
      }
    ],
    "faqs": [
      {
        "question": "Quante proposte vedremo?",
        "answer": "Presentiamo due o tre direzioni creative, mostrate sui supporti più utili al progetto. Il numero di proposte e revisioni viene concordato prima di iniziare."
      },
      {
        "question": "Il logo diventa nostro?",
        "answer": "La consegna include i file concordati e le condizioni di utilizzo definite nel preventivo, con indicazione di eventuali licenze di risorse esterne."
      },
      {
        "question": "Registrate anche il marchio?",
        "answer": "La registrazione la segue un consulente in proprietà industriale. Noi prepariamo i file necessari e, se serve, vi indirizziamo a chi se ne occupa."
      },
      {
        "question": "Serve anche una brand identity completa?",
        "answer": "Il logo è un primo passo. Una brand identity completa definisce anche colori, caratteri, stile delle immagini e regole di applicazione: valutiamo insieme quanto serve al vostro progetto."
      }
    ],
    "related": [
      "/foto/product-photography-torino",
      "/web",
      "/social"
    ],
    "projectSlugs": [],
    "heading": "Creazione loghi",
    "summary": "Ricerca, direzioni creative e varianti pronte all’uso."
  },
  {
    "path": "/grafica/brand-identity-torino",
    "category": "graphic",
    "kind": "detail",
    "label": "Brand identity",
    "title": "Brand identity e immagine coordinata a Torino | Memento",
    "description": "Costruiamo l’identità visiva di aziende di Torino e provincia: logo, colori, caratteri, stile fotografico e applicazioni su ogni supporto.",
    "claim": "Riconoscibili anche senza il logo in alto a sinistra.",
    "intro": "Costruiamo l’identità visiva completa di aziende di Torino, Moncalieri e provincia: sistema del logo, palette, caratteri, stile fotografico, elementi grafici e applicazioni. Il riferimento unico per chiunque comunichi a nome vostro.",
    "deliverables": [
      {
        "title": "Sistema del logo",
        "text": "con tutte le varianti"
      },
      {
        "title": "Palette cromatica",
        "text": "con i codici per stampa, schermo e web"
      },
      {
        "title": "Caratteri tipografici",
        "text": "e le gerarchie fra titoli, testi e didascalie"
      },
      {
        "title": "Stile fotografico",
        "text": "cosa si fotografa, con che luce, con che taglio"
      },
      {
        "title": "Elementi grafici ricorrenti",
        "text": "forme, pattern, icone"
      },
      {
        "title": "Applicazioni",
        "text": "biglietti, carta intestata, presentazioni, social, sito, insegne, mezzi"
      },
      {
        "title": "Manuale d’uso",
        "text": "breve e usabile"
      }
    ],
    "sections": [
      {
        "title": "Riconoscersi in ogni punto di contatto",
        "paragraphs": [
          "La stessa identità deve funzionare in un post, in una presentazione commerciale e sull’insegna. Costruiamo un sistema di colori, caratteri e immagini che rende questi materiali parte dello stesso racconto."
        ]
      },
      {
        "title": "Un manuale da usare",
        "paragraphs": [
          "Le linee guida raccolgono gerarchie, varianti, spazi di rispetto ed esempi di applicazione. Chi produce un nuovo materiale trova indicazioni operative, anche quando non ha partecipato al progetto iniziale."
        ]
      },
      {
        "title": "L’identità diventa contenuto",
        "paragraphs": [
          "Il team può applicare il sistema a sito, social, video e materiali stampati. Definiamo insieme le prime applicazioni e i modelli che vi saranno utili nel lavoro quotidiano."
        ]
      }
    ],
    "process": [
      {
        "title": "Posizionamento",
        "text": "Chi siete, a chi parlate, come volete essere percepiti."
      },
      {
        "title": "Direzione visiva",
        "text": "Riferimenti e due direzioni possibili, da discutere prima di progettare."
      },
      {
        "title": "Sistema",
        "text": "Logo, colori, caratteri, stile fotografico, elementi grafici."
      },
      {
        "title": "Applicazioni",
        "text": "Il sistema messo alla prova sui supporti reali."
      },
      {
        "title": "Manuale e file",
        "text": "Tutto quello che serve per usarla da soli."
      }
    ],
    "faqs": [
      {
        "question": "Che differenza c’è con la creazione del logo?",
        "answer": "Il logo è un elemento; la brand identity è il sistema intero in cui il logo vive. Si può fare solo il primo, ma senza il secondo ogni nuovo materiale riapre le stesse domande."
      },
      {
        "question": "Abbiamo già un logo che ci piace. Ha senso?",
        "answer": "Sì, ed è un caso frequente: si parte dal logo esistente e si costruisce tutto il resto."
      },
      {
        "question": "Ci aiutate ad applicarla?",
        "answer": "Sì, su sito, social, materiali stampati e video, con lo stesso team."
      },
      {
        "question": "Cosa riceviamo alla fine?",
        "answer": "Il manuale d’uso, tutti i file sorgente e i modelli delle applicazioni principali, pronti da usare."
      }
    ],
    "related": [
      "/foto/product-photography-torino",
      "/web",
      "/social"
    ],
    "projectSlugs": [],
    "heading": "Brand identity",
    "summary": "Colori, caratteri, immagini e regole. Un sistema che vi rappresenta."
  },
  {
    "path": "/grafica/grafica-stampa-torino",
    "category": "graphic",
    "kind": "detail",
    "label": "Grafica offline",
    "title": "Grafica per la stampa e packaging a Torino | Memento",
    "description": "Grafica offline per aziende di Torino: brochure, cataloghi, packaging, etichette, insegne e allestimenti per fiere. Dal progetto al file per la stampa.",
    "claim": "Quello che il cliente tiene in mano parla più forte.",
    "intro": "Progettiamo la grafica offline di aziende di Torino, Moncalieri e provincia: brochure e cataloghi, packaging ed etichette, biglietti da visita e carta intestata, insegne e vetrine, allestimenti per fiere e grafiche per mezzi aziendali.",
    "deliverables": [
      {
        "title": "Brochure e cataloghi",
        "text": "con la fotografia di prodotto realizzata da noi"
      },
      {
        "title": "Packaging ed etichette",
        "text": "grafica ed esecutivi sulla fustella"
      },
      {
        "title": "Biglietti da visita e carta intestata",
        "text": ""
      },
      {
        "title": "Insegne e vetrine",
        "text": "con le misure prese sul posto"
      },
      {
        "title": "Allestimenti per fiere",
        "text": "stand, pannelli, roll-up, espositori"
      },
      {
        "title": "Grafiche per mezzi aziendali",
        "text": ""
      },
      {
        "title": "Volantini, manifesti, menu",
        "text": "per negozi, locali ed eventi"
      }
    ],
    "sections": [
      {
        "title": "La cura continua negli esecutivi",
        "paragraphs": [
          "Prima della consegna controlliamo dimensioni, abbondanze, immagini e profili colore sulla base delle specifiche della tipografia. Per il packaging partiamo dalla fustella del produttore; eventuali prove e lavorazioni vengono definite nel progetto."
        ]
      },
      {
        "title": "Immagini pensate per l’impaginazione",
        "paragraphs": [
          "Fotografia e grafica possono nascere insieme: taglio delle immagini, spazio per i testi e sequenza dei prodotti vengono decisi prima degli scatti. È particolarmente utile per cataloghi, brochure e menu."
        ]
      }
    ],
    "process": [
      {
        "title": "Brief",
        "text": "Formato, tiratura, supporto, uso: un catalogo da fiera e uno da spedire si progettano in modo diverso."
      },
      {
        "title": "Progetto",
        "text": "Impaginato o grafica, con un giro di revisioni concordato."
      },
      {
        "title": "Esecutivi",
        "text": "File pronti per la stampa, verificati."
      },
      {
        "title": "Consegna",
        "text": "Esecutivi e specifiche per la tipografia scelta, secondo quanto concordato nel progetto."
      }
    ],
    "faqs": [
      {
        "question": "Stampate anche voi?",
        "answer": "Il servizio riguarda la progettazione grafica e la preparazione dei file. Produzione, prove e coordinamento con la tipografia vengono definiti separatamente nel preventivo."
      },
      {
        "question": "Potete adattare un materiale esistente a nuovi formati?",
        "answer": "Sì, a partire dai file originali o ricostruendoli se non li avete più."
      },
      {
        "question": "Per il packaging partite da zero?",
        "answer": "Di solito partiamo dalla fustella fornita dal produttore della confezione e progettiamo la grafica su quella. Se la struttura è da definire, la sviluppiamo insieme a lui."
      },
      {
        "question": "La grafica rispetta la nostra identità visiva?",
        "answer": "Sempre. Se non avete ancora un’identità definita, conviene partire da quella."
      }
    ],
    "related": [
      "/foto/product-photography-torino",
      "/web",
      "/social"
    ],
    "projectSlugs": [],
    "heading": "Grafica per la stampa",
    "summary": "Brochure, packaging e materiali fisici: dal layout agli esecutivi."
  },
  {
    "path": "/grafica/rebranding-torino",
    "category": "graphic",
    "kind": "detail",
    "label": "Rebranding",
    "title": "Rebranding e restyling del logo a Torino | Memento",
    "description": "Rebranding per aziende di Torino e provincia: restyling del logo, nuova identità visiva e piano di aggiornamento per sito, social e materiali stampati.",
    "claim": "Cambiare immagine senza perdere chi vi conosce già.",
    "intro": "Seguiamo il rebranding di aziende di Torino, Moncalieri e provincia: dal restyling del logo alla nuova identità visiva completa, fino al passaggio su sito, social, materiali stampati e punti vendita.",
    "deliverables": [
      {
        "title": "Analisi dell’identità",
        "text": "Cosa conservare e cosa aggiornare."
      },
      {
        "title": "Direzione visiva",
        "text": "Restyling o nuova identità, in base agli obiettivi."
      },
      {
        "title": "Materiali coordinati",
        "text": "Le applicazioni sui supporti scelti."
      },
      {
        "title": "Piano di passaggio",
        "text": "Priorità e sequenza degli aggiornamenti."
      }
    ],
    "sections": [
      {
        "title": "Capire cosa mantenere",
        "paragraphs": [
          "Un restyling aggiorna il marchio conservandone gli elementi riconoscibili. Un rebranding interviene più in profondità, quando cambiano posizionamento, pubblico o offerta. Partiamo dall’identità esistente per scegliere l’intervento proporzionato."
        ]
      },
      {
        "title": "Accompagnare il passaggio",
        "paragraphs": [
          "Inventariamo sito, social, insegne, mezzi e materiali stampati, poi definiamo l’ordine di aggiornamento. Un piano per priorità permette di coordinare l’uscita della nuova immagine e distribuire gli interventi nel tempo."
        ]
      }
    ],
    "process": [
      {
        "title": "Analisi",
        "text": "Cosa funziona dell’immagine attuale e va tenuto, cosa non funziona più."
      },
      {
        "title": "Strategia",
        "text": "Restyling o rebranding completo, e perché."
      },
      {
        "title": "Progettazione",
        "text": "La nuova identità, con le proposte e le revisioni concordate."
      },
      {
        "title": "Piano di passaggio",
        "text": "Inventario dei materiali e ordine di sostituzione."
      },
      {
        "title": "Applicazione",
        "text": "Sito, social, stampa, insegne: con lo stesso team."
      }
    ],
    "faqs": [
      {
        "question": "Rischiamo di confondere i clienti?",
        "answer": "Il rischio c’è se il cambio è brusco e non viene spiegato. Con un restyling che mantiene gli elementi riconoscibili e una comunicazione del cambiamento sui vostri canali, i clienti seguono l’evoluzione."
      },
      {
        "question": "Dobbiamo cambiare tutto subito?",
        "answer": "No. Il piano di passaggio stabilisce cosa cambiare prima (sito, social, materiali più visibili) e cosa può aspettare l’esaurimento delle scorte."
      },
      {
        "question": "Serve cambiare anche il nome?",
        "answer": "Quasi mai. Se lo state valutando, ne parliamo nella fase di strategia."
      },
      {
        "question": "Aggiornate anche sito e social?",
        "answer": "Sì, ed è il modo per far uscire la nuova immagine in modo coordinato."
      }
    ],
    "related": [
      "/foto/product-photography-torino",
      "/web",
      "/social"
    ],
    "projectSlugs": [],
    "heading": "Rebranding",
    "summary": "Far evolvere il brand, con un piano per accompagnare il cambiamento."
  },
  {
    "path": "/social",
    "category": "social",
    "kind": "hub",
    "label": "Social",
    "title": "Agenzia social media a Torino | Memento Production",
    "description": "Gestione social per aziende di Torino e provincia: Facebook, Instagram e TikTok, con contenuti prodotti internamente e collegamento alle campagne Meta.",
    "claim": "Esserci non basta. Bisogna avere qualcosa da dire.",
    "intro": "Gestiamo i social di aziende e professionisti di Torino, Moncalieri e provincia: strategia, piano editoriale, produzione dei contenuti, pubblicazione e community su Facebook, Instagram e TikTok. Foto, video e grafiche sono coordinati dallo stesso team.",
    "deliverables": [],
    "sections": [
      {
        "title": "Piano editoriale e produzione, insieme",
        "paragraphs": [
          "Chi definisce il calendario lavora con chi realizza foto, video e grafiche. Pianifichiamo contenuti e giornate di produzione in funzione dei temi da raccontare, così il lavoro procede con una direzione condivisa."
        ]
      },
      {
        "title": "Un collegamento con le campagne",
        "paragraphs": [
          "La gestione organica cura la presenza e la relazione con il pubblico. La pubblicità può affiancarla per obiettivi e destinatari specifici: concordiamo il ruolo di ciascuna attività e leggiamo i risultati nel loro contesto."
        ]
      }
    ],
    "process": [],
    "faqs": [
      {
        "question": "Su quali social dovremmo esserci?",
        "answer": "Su quelli dove si trovano i vostri clienti, non su tutti. Per molte aziende del Torinese bastano Instagram e Facebook; TikTok ha senso solo per alcuni settori e pubblici. Ve lo diciamo nella fase iniziale, invece di vendervi un canale in più."
      },
      {
        "question": "Gli account restano nostri?",
        "answer": "Sempre. Lavoriamo come collaboratori sui vostri profili, non creiamo account intestati a noi."
      },
      {
        "question": "Rispondete voi a commenti e messaggi?",
        "answer": "Sì, per tutto ciò che riguarda informazioni e comunicazione. Le richieste commerciali ve le giriamo subito."
      },
      {
        "question": "Quanto tempo serve per vedere risultati?",
        "answer": "Dipende dal punto di partenza, dal settore e dagli obiettivi. Concordiamo gli indicatori da osservare e li rileggiamo periodicamente: non promettiamo follower o risultati entro una scadenza fissa."
      }
    ],
    "related": [
      "/video/reel-social-torino",
      "/foto",
      "/google-meta-ads"
    ],
    "projectSlugs": [
      "il-forte",
      "speed-trasporti"
    ],
    "heading": "Social",
    "summary": "Strategia, contenuti e conversazioni, coordinati dallo stesso team."
  },
  {
    "path": "/social/gestione-social-organica-torino",
    "category": "social",
    "kind": "detail",
    "label": "Gestione organica",
    "title": "Gestione social organica per aziende a Torino | Memento",
    "description": "Social media manager per aziende di Torino: piano editoriale, contenuti, pubblicazione, community e report mensile. Collegabile alle campagne Meta.",
    "claim": "La visibilità che non si compra: si costruisce.",
    "intro": "Gestiamo la comunicazione social organica di aziende e professionisti di Torino e provincia: strategia, piano editoriale mensile, produzione dei contenuti, pubblicazione, gestione della community e report. È la base su cui poggiano anche le campagne a pagamento.",
    "deliverables": [
      {
        "title": "Analisi iniziale",
        "text": "i vostri profili, quelli dei concorrenti, cosa funziona già e cosa no"
      },
      {
        "title": "Strategia e tono di voce",
        "text": "cosa dire, a chi, con che linguaggio"
      },
      {
        "title": "Piano editoriale mensile",
        "text": "condiviso e approvato prima della pubblicazione"
      },
      {
        "title": "Produzione dei contenuti",
        "text": "foto, video, reel, grafiche e testi, realizzati da noi"
      },
      {
        "title": "Pubblicazione",
        "text": "negli orari in cui il vostro pubblico è attivo"
      },
      {
        "title": "Community",
        "text": "risposte a commenti e messaggi"
      },
      {
        "title": "Report mensile",
        "text": "Indicatori pertinenti e decisioni per il mese successivo."
      }
    ],
    "sections": [
      {
        "title": "Un profilo che racconta il presente",
        "paragraphs": [
          "Chi arriva sul profilo deve capire cosa fate, come lavorate e come contattarvi. La gestione organica dà continuità al racconto, valorizza persone e progetti e organizza contenuti che restano utili anche dopo il giorno di pubblicazione."
        ]
      },
      {
        "title": "Decisioni basate sui contenuti",
        "paragraphs": [
          "Il report mette in relazione obiettivi, pubblicazioni e risposte del pubblico. Usiamo queste indicazioni per correggere il calendario successivo e, quando previste, coordinare le campagne pubblicitarie con la comunicazione del profilo."
        ]
      }
    ],
    "process": [
      {
        "title": "Inizio mese",
        "text": "Piano editoriale condiviso: cosa esce, quando, su che canale, con quale obiettivo."
      },
      {
        "title": "Produzione",
        "text": "Una o due giornate di riprese e scatti che coprono tutto il mese."
      },
      {
        "title": "Pubblicazione",
        "text": "Usciamo noi e seguiamo commenti e messaggi."
      },
      {
        "title": "Fine mese",
        "text": "Il report: cosa ha funzionato, cosa cambiamo il mese successivo."
      }
    ],
    "faqs": [
      {
        "question": "Quanti contenuti al mese servono?",
        "answer": "Meno di quanti si pensa, e migliori. Pochi contenuti curati e regolari rendono più di tanti riempitivi. La frequenza giusta la definiamo in base a canali e obiettivi."
      },
      {
        "question": "Possiamo approvare i contenuti prima che escano?",
        "answer": "Sì, sempre. Il piano editoriale del mese viene approvato prima della pubblicazione."
      },
      {
        "question": "I nostri profili sono fermi da tempo. Si può ripartire?",
        "answer": "Sì, ed è la situazione più comune. Non cancelliamo niente: si riparte da dove eravate rimasti."
      },
      {
        "question": "Dobbiamo fare anche le campagne?",
        "answer": "Non è obbligatorio. Se l’obiettivo è farsi conoscere da chi non vi segue, però, un budget anche contenuto fa una grande differenza."
      }
    ],
    "related": [
      "/video/reel-social-torino",
      "/foto",
      "/google-meta-ads"
    ],
    "projectSlugs": [
      "il-forte",
      "speed-trasporti"
    ],
    "heading": "Gestione social organica",
    "summary": "Piano editoriale, produzione, pubblicazione e lettura dei risultati."
  },
  {
    "path": "/social/facebook-instagram-torino",
    "category": "social",
    "kind": "detail",
    "label": "Facebook & Instagram",
    "title": "Gestione Facebook e Instagram aziendali a Torino | Memento",
    "description": "Gestiamo i profili Facebook e Instagram di aziende di Torino e provincia: reel, caroselli, stories e community, con contenuti prodotti internamente.",
    "claim": "Due canali, due linguaggi, una sola voce.",
    "intro": "Gestiamo pagine Facebook e profili Instagram per aziende e professionisti di Torino, Moncalieri e provincia: reel, caroselli, stories, post e community, con contenuti prodotti da noi e un calendario condiviso.",
    "deliverables": [
      {
        "title": "Profili ottimizzati",
        "text": "biografia, immagine, storie in evidenza, link e pulsanti di contatto"
      },
      {
        "title": "Reel",
        "text": "Video verticali con un tema e un’apertura riconoscibile."
      },
      {
        "title": "Caroselli",
        "text": "per spiegare, elencare, raccontare un progetto"
      },
      {
        "title": "Stories",
        "text": "Aggiornamenti, backstage e dialogo con il pubblico."
      },
      {
        "title": "Post e grafiche",
        "text": "coerenti con la vostra identità visiva"
      },
      {
        "title": "Community",
        "text": "commenti e messaggi diretti"
      },
      {
        "title": "Report mensile",
        "text": "con i numeri che contano"
      }
    ],
    "sections": [
      {
        "title": "Due canali da progettare",
        "paragraphs": [
          "La scelta dei formati dipende dal pubblico e dall’obiettivo. Lo stesso materiale può diventare un reel, un carosello o un post, con testo e montaggio adatti al contesto: definiamo cosa pubblicare su ciascun canale."
        ]
      },
      {
        "title": "Anche il profilo ha bisogno di cura",
        "paragraphs": [
          "Biografia, link, contatti e storie in evidenza aiutano chi visita la pagina a orientarsi. Li organizziamo insieme al piano editoriale perché informazioni e contenuti raccontino la stessa azienda."
        ]
      },
      {
        "title": "Account sotto il vostro controllo",
        "paragraphs": [
          "Lavoriamo tramite accessi assegnati alla nostra squadra: pagine e account restano intestati a voi. Se sono previste campagne, coordiniamo configurazione degli strumenti e misurazione con il progetto pubblicitario."
        ]
      }
    ],
    "process": [
      {
        "title": "Direzione",
        "text": "Obiettivi, pubblico, canali e format da sviluppare."
      },
      {
        "title": "Produzione",
        "text": "Scalette, riprese e contenuti coordinati con il calendario."
      },
      {
        "title": "Approvazione e uscita",
        "text": "Materiali condivisi prima della pubblicazione."
      },
      {
        "title": "Analisi",
        "text": "Lettura dei dati e scelte per il ciclo successivo."
      }
    ],
    "faqs": [
      {
        "question": "Meglio Instagram o Facebook?",
        "answer": "Dipende dal pubblico. Per molte aziende la risposta è entrambi, con un peso diverso. Lo definiamo nella fase iniziale."
      },
      {
        "question": "Basta pubblicare o serve anche la pubblicità?",
        "answer": "Per mantenere viva e credibile la presenza basta la gestione organica. Per farsi conoscere da chi non vi segue, serve un budget, anche piccolo."
      },
      {
        "question": "Possiamo partire da profili fermi?",
        "answer": "Sì. Si riparte da dove eravate rimasti, senza cancellare niente."
      },
      {
        "question": "Chi possiede la pagina e l’account pubblicitario?",
        "answer": "Voi. Siamo collaboratori sui vostri account, mai proprietari."
      }
    ],
    "related": [
      "/video/reel-social-torino",
      "/foto",
      "/google-meta-ads"
    ],
    "projectSlugs": [
      "il-forte",
      "speed-trasporti"
    ],
    "heading": "Facebook & Instagram",
    "summary": "Reel, caroselli, stories e community. Una voce coerente su due canali."
  },
  {
    "path": "/social/tiktok-torino",
    "category": "social",
    "kind": "detail",
    "label": "TikTok",
    "title": "Agenzia TikTok a Torino: gestione e contenuti | Memento",
    "description": "Gestione TikTok per aziende di Torino e provincia: format, riprese, montaggio verticale e pubblicazione, con la produzione video fatta in casa.",
    "claim": "Il canale dove nessuno vi conosce. Ed è un vantaggio.",
    "intro": "Gestiamo TikTok per aziende e professionisti di Torino e provincia: definizione dei format, riprese, montaggio verticale e pubblicazione. Partiamo dal vostro mestiere per costruire contenuti comprensibili anche a chi incontra il brand per la prima volta.",
    "deliverables": [
      {
        "title": "Format ricorrenti",
        "text": "rubriche riconoscibili, costruite sul vostro mestiere"
      },
      {
        "title": "Riprese in blocco",
        "text": "una giornata per il materiale di più settimane"
      },
      {
        "title": "Montaggio nativo",
        "text": "ritmo, testi a schermo e audio pensati per TikTok"
      },
      {
        "title": "Pubblicazione costante",
        "text": "Un calendario sostenibile, concordato con voi."
      },
      {
        "title": "Lettura dei dati",
        "text": "quanto viene guardato ogni video, e fino a che punto"
      }
    ],
    "sections": [
      {
        "title": "Il mestiere diventa un format",
        "paragraphs": [
          "Una lavorazione, una risposta a una domanda frequente, un prodotto mostrato in uso: cerchiamo storie concrete e ripetibili. Apertura, ritmo, testi e audio vengono progettati per il video verticale, mantenendo una voce riconoscibile."
        ]
      },
      {
        "title": "Scegliere il canale con un motivo",
        "paragraphs": [
          "Valutiamo pubblico, settore e disponibilità di contenuti prima di proporre TikTok. Cucine, laboratori, negozi e processi produttivi offrono molte possibilità narrative; la scelta deve comunque sostenere un obiettivo dell’azienda."
        ]
      }
    ],
    "process": [
      {
        "title": "Direzione",
        "text": "Obiettivi, pubblico, canali e format da sviluppare."
      },
      {
        "title": "Produzione",
        "text": "Scalette, riprese e contenuti coordinati con il calendario."
      },
      {
        "title": "Approvazione e uscita",
        "text": "Materiali condivisi prima della pubblicazione."
      },
      {
        "title": "Analisi",
        "text": "Lettura dei dati e scelte per il ciclo successivo."
      }
    ],
    "faqs": [
      {
        "question": "Dobbiamo comparire nei video?",
        "answer": "Non è obbligatorio. Possiamo raccontare il prodotto, il processo o usare una voce fuori campo; valutiamo il formato con cui vi sentite a vostro agio."
      },
      {
        "question": "Quanti video servono?",
        "answer": "Definiamo una frequenza sostenibile in base agli obiettivi e al materiale disponibile. Le riprese in blocco aiutano a programmare più uscite."
      },
      {
        "question": "Possiamo usare il materiale anche su Instagram?",
        "answer": "Sì, adattando montaggio, testi e audio ai requisiti del canale. Prevediamo gli adattamenti nel piano di produzione."
      },
      {
        "question": "Dobbiamo partire con la pubblicità?",
        "answer": "Valutiamo prima obiettivi e contenuti. Un eventuale investimento pubblicitario ha un piano e un budget distinti dalla gestione organica."
      }
    ],
    "related": [
      "/video/reel-social-torino",
      "/foto",
      "/google-meta-ads"
    ],
    "projectSlugs": [],
    "heading": "TikTok",
    "summary": "Format e video verticali costruiti sul vostro mestiere."
  },
  {
    "path": "/web",
    "category": "web",
    "kind": "hub",
    "label": "Siti web",
    "title": "Siti web ed e-commerce a Torino | Memento",
    "description": "Siti web aziendali, e-commerce, landing page e restyling per aziende di Torino e provincia. Struttura, contenuti e sviluppo con un unico team.",
    "claim": "Il posto dove tutto porta.",
    "intro": "Progettiamo siti aziendali, e-commerce e landing page per le imprese di Torino e provincia. Dalla struttura ai contenuti, dal design allo sviluppo: un unico team coordina il progetto e prepara il sito per essere usato e gestito.",
    "deliverables": [],
    "sections": [
      {
        "title": "Un percorso chiaro, dalla visita al contatto",
        "paragraphs": [
          "Organizziamo pagine, contenuti e inviti all’azione attorno a ciò che cerca il visitatore. Il sito deve spiegare l’offerta, aiutare a scegliere e rendere semplice il passo successivo, da telefono e da computer."
        ]
      },
      {
        "title": "Contenuti, identità e sviluppo insieme",
        "paragraphs": [
          "Fotografie, video, testi e grafica possono essere prodotti dallo stesso team che progetta il sito. Definiamo struttura e requisiti prima di sviluppare, includendo la base tecnica per la ricerca organica e la gestione futura."
        ]
      }
    ],
    "faqs": [
      {
        "question": "Avete bisogno dei nostri testi e delle foto?",
        "answer": "Partiamo dai materiali disponibili e individuiamo ciò che manca. Copy, fotografie e video possono essere inclusi nel progetto, con attività e tempi concordati."
      },
      {
        "question": "Potremo aggiornare il sito?",
        "answer": "Definiamo quali contenuti dovrete gestire e scegliamo una soluzione adeguata. La consegna comprende le indicazioni necessarie per le attività concordate."
      },
      {
        "question": "La SEO è compresa?",
        "answer": "La progettazione considera struttura, titoli, metadati, collegamenti interni e prestazioni. Analisi e attività SEO continuative vengono definite in base agli obiettivi."
      },
      {
        "question": "Fate anche il restyling di un sito esistente?",
        "answer": "Sì. Analizziamo cosa mantenere e pianifichiamo gli aggiornamenti, compresi gli indirizzi da conservare o reindirizzare."
      }
    ],
    "process": [],
    "related": [
      "/grafica/brand-identity-torino",
      "/foto/product-photography-torino",
      "/google-meta-ads"
    ],
    "projectSlugs": [],
    "heading": "Siti web",
    "summary": "Siti, negozi e pagine che aiutano le persone a scegliere."
  },
  {
    "path": "/web/realizzazione-siti-web-torino",
    "category": "web",
    "kind": "detail",
    "label": "Siti aziendali",
    "title": "Realizzazione siti web aziendali a Torino | Memento",
    "description": "Realizzazione siti web aziendali a Torino: struttura, design responsive, contenuti e sviluppo. Un sito chiaro, dalla presentazione dei servizi al contatto.",
    "claim": "La vostra azienda, spiegata bene.",
    "intro": "Realizziamo siti web per aziende e professionisti di Torino, Moncalieri e provincia. Progettiamo struttura, contenuti e interfacce per presentare servizi e competenze e rendere semplice richiedere informazioni.",
    "deliverables": [
      {
        "title": "Architettura dei contenuti",
        "text": "Pagine e percorsi organizzati attorno all’offerta."
      },
      {
        "title": "Design responsive",
        "text": "Interfacce leggibili su smartphone, tablet e desktop."
      },
      {
        "title": "Contenuti coordinati",
        "text": "Testi, foto e grafica coerenti con l’identità."
      },
      {
        "title": "Moduli e contatti",
        "text": "Richieste chiare e recapiti facili da trovare."
      },
      {
        "title": "Base tecnica SEO",
        "text": "URL, metadati, indicizzazione e collegamenti interni."
      },
      {
        "title": "Consegna e gestione",
        "text": "Accessi e istruzioni per le attività concordate."
      }
    ],
    "sections": [
      {
        "title": "Ogni pagina ha una funzione",
        "paragraphs": [
          "La home orienta, le pagine servizio rispondono alle domande e i progetti mostrano il lavoro. Disegniamo questa gerarchia prima delle interfacce, così il visitatore può passare da un primo interesse a una richiesta consapevole."
        ]
      },
      {
        "title": "Il progetto parte anche dai contenuti",
        "paragraphs": [
          "Un sito rappresenta meglio l’azienda quando testi e immagini sono specifici. Valutiamo insieme i materiali esistenti e coordiniamo eventuali produzioni fotografiche, video o grafiche prima della messa online."
        ]
      }
    ],
    "faqs": [
      {
        "question": "Quante pagine servono?",
        "answer": "Dipende dall’offerta e dai pubblici. Partiamo dai contenuti che aiutano davvero a scegliere e definiamo una mappa del sito prima dello sviluppo."
      },
      {
        "question": "Il sito funziona da smartphone?",
        "answer": "Sì. Progettiamo e verifichiamo la navigazione, la leggibilità e i moduli anche su schermi piccoli."
      },
      {
        "question": "Potete mantenere il dominio attuale?",
        "answer": "Sì, quando ne avete la disponibilità. Prima del passaggio controlliamo accessi, indirizzi esistenti e servizi collegati."
      },
      {
        "question": "Seguite anche gli aggiornamenti?",
        "answer": "Possiamo concordare un’attività successiva di manutenzione e aggiornamento, con ambito e responsabilità definiti."
      }
    ],
    "process": [
      {
        "title": "Analisi",
        "text": "Obiettivi, materiali disponibili e requisiti del progetto."
      },
      {
        "title": "Progettazione",
        "text": "Struttura, contenuti e interfacce condivisi con voi."
      },
      {
        "title": "Sviluppo",
        "text": "Realizzazione e configurazione delle funzionalità concordate."
      },
      {
        "title": "Verifica e consegna",
        "text": "Controllo dei percorsi, pubblicazione concordata e indicazioni di gestione."
      }
    ],
    "related": [
      "/grafica/brand-identity-torino",
      "/foto/product-photography-torino",
      "/google-meta-ads"
    ],
    "projectSlugs": [],
    "heading": "Siti aziendali",
    "summary": "Servizi e competenze, organizzati in un percorso chiaro verso il contatto."
  },
  {
    "path": "/web/e-commerce-torino",
    "category": "web",
    "kind": "detail",
    "label": "E-commerce",
    "title": "Realizzazione e-commerce a Torino | Memento",
    "description": "Realizzazione e-commerce a Torino: catalogo, schede prodotto, carrello e pagamenti. Progettazione del negozio online e contenuti con un unico team.",
    "claim": "Dal prodotto al carrello, con chiarezza.",
    "intro": "Progettiamo negozi online per aziende di Torino e provincia: cataloghi ordinati, schede prodotto, carrello e percorso di acquisto. Definiamo requisiti, contenuti e gestione operativa prima di scegliere la soluzione tecnica.",
    "deliverables": [
      {
        "title": "Catalogo prodotti",
        "text": "Categorie, varianti e informazioni utili alla scelta."
      },
      {
        "title": "Schede prodotto",
        "text": "Descrizioni, fotografie e dettagli organizzati."
      },
      {
        "title": "Carrello e checkout",
        "text": "Percorso di acquisto leggibile e verificato."
      },
      {
        "title": "Pagamenti e spedizioni",
        "text": "Configurazioni in base ai servizi concordati."
      },
      {
        "title": "Gestione del negozio",
        "text": "Flussi per ordini e aggiornamenti del catalogo."
      },
      {
        "title": "Verifiche prima del lancio",
        "text": "Navigazione e ordini di prova in ambiente appropriato."
      }
    ],
    "sections": [
      {
        "title": "Organizzare il catalogo prima del design",
        "paragraphs": [
          "Numero di articoli, varianti, disponibilità e modalità di spedizione cambiano il progetto. Raccogliamo questi requisiti e costruiamo un percorso in cui categorie, filtri e schede aiutino a confrontare i prodotti."
        ]
      },
      {
        "title": "Fotografia e contenuti fanno parte dell’acquisto",
        "paragraphs": [
          "Uno scatto di insieme e un dettaglio rispondono a esigenze diverse. Possiamo coordinare il servizio fotografico di prodotto con le schede del negozio, preparando immagini e testi nei formati previsti."
        ]
      }
    ],
    "faqs": [
      {
        "question": "Possiamo partire con pochi prodotti?",
        "answer": "Sì. Dimensioniamo il progetto sul catalogo iniziale e sulle esigenze di crescita già note."
      },
      {
        "question": "Seguite anche le fotografie?",
        "answer": "Il team può realizzare packshot, dettagli e immagini ambientate, con un piano di produzione concordato."
      },
      {
        "question": "Integrate il gestionale?",
        "answer": "Verifichiamo prima la fattibilità con il software e i flussi esistenti. Le integrazioni vengono descritte e preventivate separatamente."
      },
      {
        "question": "Sono previste commissioni o abbonamenti?",
        "answer": "Dipende dalla piattaforma e dai servizi scelti, inclusi i pagamenti. Li distinguiamo dal lavoro di progettazione per chiarire i costi ricorrenti."
      }
    ],
    "process": [
      {
        "title": "Analisi",
        "text": "Obiettivi, materiali disponibili e requisiti del progetto."
      },
      {
        "title": "Progettazione",
        "text": "Struttura, contenuti e interfacce condivisi con voi."
      },
      {
        "title": "Sviluppo",
        "text": "Realizzazione e configurazione delle funzionalità concordate."
      },
      {
        "title": "Verifica e consegna",
        "text": "Controllo dei percorsi, pubblicazione concordata e indicazioni di gestione."
      }
    ],
    "related": [
      "/grafica/brand-identity-torino",
      "/foto/product-photography-torino",
      "/google-meta-ads"
    ],
    "projectSlugs": [],
    "heading": "E-commerce",
    "summary": "Catalogo, contenuti e acquisto: il prodotto al centro del percorso."
  },
  {
    "path": "/web/landing-page-torino",
    "category": "web",
    "kind": "detail",
    "label": "Landing page",
    "title": "Landing page per campagne a Torino | Memento",
    "description": "Landing page per campagne Google e Meta a Torino: copy, design mobile, moduli e misurazione. Una pagina coordinata con il messaggio pubblicitario.",
    "claim": "Un messaggio. Un passo successivo.",
    "intro": "Realizziamo landing page per campagne, lanci e servizi di aziende di Torino e provincia. Organizziamo proposta, contenuti e modulo di contatto attorno a un obiettivo preciso, in continuità con l’annuncio che porta sulla pagina.",
    "deliverables": [
      {
        "title": "Struttura della pagina",
        "text": "Offerta, benefici, prove disponibili e invito all’azione."
      },
      {
        "title": "Copy e visual",
        "text": "Un linguaggio coerente con la campagna."
      },
      {
        "title": "Modulo di contatto",
        "text": "Campi scelti in base alla richiesta."
      },
      {
        "title": "Design mobile",
        "text": "Leggibilità e interazioni pensate anche per il telefono."
      },
      {
        "title": "Misurazione concordata",
        "text": "Eventi e strumenti coerenti con gli obiettivi e le preferenze di consenso."
      }
    ],
    "sections": [
      {
        "title": "La promessa continua dopo il clic",
        "paragraphs": [
          "Annuncio e pagina devono parlare dello stesso servizio alla stessa persona. Riprendiamo il messaggio della campagna e lo sviluppiamo con informazioni concrete, domande frequenti e materiali reali del progetto."
        ]
      },
      {
        "title": "Una pagina da osservare e migliorare",
        "paragraphs": [
          "Prepariamo il percorso di contatto e definiamo quali segnali leggere. Eventuali varianti e ottimizzazioni si basano sui dati disponibili; il progetto della pagina resta coordinato con la gestione delle campagne."
        ]
      }
    ],
    "faqs": [
      {
        "question": "Serve un sito completo?",
        "answer": "Non sempre. Una landing può sostenere un’iniziativa specifica; valutiamo il rapporto con il sito e con i contenuti già presenti."
      },
      {
        "question": "Potete seguire anche le campagne?",
        "answer": "Sì, il team gestisce Google e Meta Ads. Pagina e campagne possono far parte di un progetto coordinato."
      },
      {
        "question": "Garantite un numero di contatti?",
        "answer": "No. I risultati dipendono anche da offerta, pubblico, budget e contesto. Definiamo obiettivi e criteri di lettura prima di partire."
      },
      {
        "question": "Potremo modificare la pagina?",
        "answer": "Concordiamo quali parti aggiornare e come gestirle, includendo eventuali nuove versioni per iniziative successive."
      }
    ],
    "process": [
      {
        "title": "Analisi",
        "text": "Obiettivi, materiali disponibili e requisiti del progetto."
      },
      {
        "title": "Progettazione",
        "text": "Struttura, contenuti e interfacce condivisi con voi."
      },
      {
        "title": "Sviluppo",
        "text": "Realizzazione e configurazione delle funzionalità concordate."
      },
      {
        "title": "Verifica e consegna",
        "text": "Controllo dei percorsi, pubblicazione concordata e indicazioni di gestione."
      }
    ],
    "related": [
      "/grafica/brand-identity-torino",
      "/foto/product-photography-torino",
      "/google-meta-ads"
    ],
    "projectSlugs": [],
    "heading": "Landing page",
    "summary": "Una proposta precisa, in continuità con la campagna."
  },
  {
    "path": "/web/restyling-siti-web-torino",
    "category": "web",
    "kind": "detail",
    "label": "Restyling siti web",
    "title": "Restyling siti web a Torino | Memento",
    "description": "Restyling siti web a Torino: analisi, nuova struttura, design e sviluppo. Attenzione ai contenuti esistenti, agli URL e ai reindirizzamenti.",
    "claim": "Un nuovo sito, con memoria.",
    "intro": "Rinnoviamo siti aziendali ed e-commerce per imprese di Torino e provincia. Analizziamo contenuti, navigazione e struttura esistente, poi pianifichiamo design e sviluppo con attenzione agli indirizzi e ai percorsi già utilizzati.",
    "deliverables": [
      {
        "title": "Analisi del sito",
        "text": "Contenuti, percorsi e criticità da affrontare."
      },
      {
        "title": "Nuova struttura",
        "text": "Organizzazione di pagine e navigazione."
      },
      {
        "title": "Restyling visivo",
        "text": "Interfacce allineate al brand attuale."
      },
      {
        "title": "Mappa degli indirizzi",
        "text": "URL da mantenere e reindirizzamenti da predisporre."
      },
      {
        "title": "Verifica del passaggio",
        "text": "Controllo di link, moduli, metadati e pagine principali."
      }
    ],
    "sections": [
      {
        "title": "Prima di cambiare, capire cosa funziona",
        "paragraphs": [
          "Un sito esistente contiene contenuti, link e abitudini dei visitatori. Li esaminiamo prima di proporre una nuova struttura, distinguendo ciò che conviene conservare dalle pagine da aggiornare o accorpare."
        ]
      },
      {
        "title": "La messa online è parte del progetto",
        "paragraphs": [
          "Prepariamo una mappa tra i vecchi indirizzi e le destinazioni pertinenti. Controlliamo navigazione, contatti e informazioni per i motori di ricerca; eventuali attività di monitoraggio successive vengono concordate nel piano di lavoro."
        ]
      }
    ],
    "faqs": [
      {
        "question": "Dobbiamo rifare tutto?",
        "answer": "Non necessariamente. L’analisi iniziale serve proprio a scegliere tra interventi mirati e un nuovo progetto."
      },
      {
        "question": "Possiamo conservare testi e fotografie?",
        "answer": "Sì. Verifichiamo pertinenza, qualità e disponibilità dei materiali prima di integrarli nella nuova struttura."
      },
      {
        "question": "Cosa succede ai vecchi link?",
        "answer": "Manteniamo gli URL utili e predisponiamo reindirizzamenti verso pagine pertinenti quando gli indirizzi cambiano."
      },
      {
        "question": "Il restyling mantiene il posizionamento?",
        "answer": "Nessuna migrazione garantisce posizioni immutate. Curiamo struttura, contenuti e reindirizzamenti per gestire il passaggio con attenzione."
      }
    ],
    "process": [
      {
        "title": "Analisi",
        "text": "Obiettivi, materiali disponibili e requisiti del progetto."
      },
      {
        "title": "Progettazione",
        "text": "Struttura, contenuti e interfacce condivisi con voi."
      },
      {
        "title": "Sviluppo",
        "text": "Realizzazione e configurazione delle funzionalità concordate."
      },
      {
        "title": "Verifica e consegna",
        "text": "Controllo dei percorsi, pubblicazione concordata e indicazioni di gestione."
      }
    ],
    "related": [
      "/grafica/brand-identity-torino",
      "/foto/product-photography-torino",
      "/google-meta-ads"
    ],
    "projectSlugs": [],
    "heading": "Restyling siti web",
    "summary": "Nuova struttura e design, con attenzione a ciò che esiste già."
  }
];

export const catalogHubs = catalogPages.filter(page => page.kind === 'hub');
export const catalogChildren = (path: string) => catalogPages.filter(page => page.kind === 'detail' && page.path.startsWith(`${path}/`));
