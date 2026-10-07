# Riorganizzazione dei servizi

Contenuti adattati dai documenti dell’agenzia `Foto e video.pdf`, `Grafica.pdf` e `Social.pdf`. Le pagine esistenti di Agenzia, Portfolio, Recensioni e Contatti restano presenti. Google e Meta Ads mantiene il proprio indirizzo e viene collegato ai servizi complementari.

## Struttura

| Categoria  | Indirizzo  | Specializzazioni                                           |
| ---------- | ---------- | ---------------------------------------------------------- |
| Fotografia | `/foto`    | Corporate, Food & Drinks, Immobiliare, Product photography |
| Video      | `/video`   | Aziendali, Reel, Animati, Corsi e testimonial              |
| Grafica    | `/grafica` | Loghi, Brand identity, Grafica offline, Rebranding         |
| Social     | `/social`  | Gestione organica, Facebook & Instagram, TikTok            |
| Siti web   | `/web`     | Siti aziendali, E-commerce, Landing page, Restyling        |

Cinque categorie e diciannove specializzazioni. Social ha tre pagine, come nel relativo PDF. Non essendo stato fornito un documento Web, i suoi contenuti sono una proposta editoriale ricavata dall’offerta già presente nel sito, senza impegni su piattaforme, prezzi o integrazioni specifiche.

## Scelte editoriali

- Conservati servizi, differenze fra le specializzazioni, fasi di lavoro e domande utili alla scelta.
- Accorciate ripetizioni e confronti generici con altri fornitori. Eliminate istruzioni di impaginazione e indicazioni provvisorie.
- Riformulate promesse assolute su risultati, tempi, algoritmi e diritti d’uso. Ambito e condizioni vengono concordati nel progetto.
- La gestione della stampa indicata come `[CONFERMA]` nel brief non diventa un impegno automatico: il servizio espone progettazione ed esecutivi.
- La formula chiavi in mano è esplicita: referente unico e coordinamento delle competenze, con link alla sezione dedicata di Agenzia.

## Materiali ancora da fornire

I PDF non contengono le gallerie definitive, i file video o i dati dei casi studio richiesti nelle note redazionali. Le nuove pagine usano illustrazioni SVG decorative originali e rimandi ai progetti già documentati nel Portfolio. Nessuna galleria fittizia, numero inventato o segnaposto compare al pubblico.

Per arricchire le singole specializzazioni servono selezioni approvate di fotografie, video o lavori grafici con cliente, descrizione, autorizzazioni d’uso ed eventuali risultati contestualizzati. A quel punto si possono aggiungere gallerie specifiche e, per video effettivamente incorporati con metadati completi, dati strutturati pertinenti.

## SEO e migrazione

`src/app/core/service-catalog.ts` contiene i testi e i metadati delle nuove pagine. Ogni pagina ha titolo, descrizione, canonical, Open Graph, un H1 e breadcrumb visibili. I dati strutturati descrivono una `CollectionPage` con catalogo per le categorie e un `Service` per le specializzazioni, insieme a `BreadcrumbList` e all’organizzazione esistente.

Menu e rotte di prerender derivano da `src/app/core/service-navigation.ts`, una mappa leggera controllata rispetto al catalogo. Il componente delle pagine e i relativi testi vengono caricati su richiesta, mantenendoli fuori dal caricamento iniziale della Home. `public/sitemap.xml` contiene soltanto indirizzi canonici. I vecchi URL sono gestiti dal router e da redirect HTTP 301 in `public/.htaccess` e `src/server.ts`:

| Vecchio indirizzo              | Destinazione |
| ------------------------------ | ------------ |
| `/produzione-video-fotografia` | `/video`     |
| `/grafica-branding`            | `/grafica`   |
| `/branding-siti-web`           | `/grafica`   |
| `/social-media`                | `/social`    |
| `/siti-web-ecommerce`          | `/web`       |

Su hosting statico Hostinger/Apache occorre distribuire anche `.htaccess`: il file è incluso negli asset del progetto. Su hosting diverso questi redirect vanno configurati a livello del server/CDN. Un redirect del solo router non sostituisce un HTTP 301.

## Verifiche senza build

`node scripts/check-service-catalog.mjs` controlla unicità dei metadati, collegamenti fra servizi, progetti citati, copertura della sitemap e corrispondenza fra mappa dei redirect e regole Apache. Usa il supporto TypeScript nativo di Node 22.18+.

I test Angular verificano navigazione fra le pagine, aggiornamento dei metadati, vecchi URL, 404, menu e selezione del servizio nel modulo. Durante questo intervento sono stati eseguiti direttamente con Vitest e trasformazione JIT in memoria; nessuna build di applicazione o commit è stato eseguito. Sono stati inoltre verificati i template con `ngc --noEmit`, gli SCSS e il layout del markup prodotto dai test a 1440, 860, 768, 390 e 320 pixel.

Il server di sviluppo già aperto sulla porta 4200 ha continuato a servire la versione precedente durante la verifica; non è stato riavviato. La generazione finale dei file prerender e i redirect HTTP sull’hosting non sono stati provati con una build o un deploy.
