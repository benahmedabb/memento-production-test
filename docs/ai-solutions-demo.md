# Soluzioni IA — sito ufficiale e anteprima

La pagina `/soluzioni-ia-torino` presenta un servizio costruito intorno ai problemi dei clienti: domande ripetute, richieste fuori orario e contatti con poco contesto. È collegata dalla Home, dalla navbar, dal menu Servizi, dalla pagina Servizi e dal footer. Il modulo Contatti include l'opzione “Soluzioni IA” e la preseleziona dai pulsanti della pagina. “Prova l'assistente” apre il chatbot già presente nella demo.

La base di conoscenza locale e il Worker Cloudflare già pubblicato includono il servizio. Il deploy del frontend non aggiorna da solo il Worker quando la base di conoscenza cambia.

## Pubblicazione

`src/app/core/ai-service-availability.ts` abilita la pagina sia sulla demo Vercel sia nella build Hostinger. La configurazione Hostinger include le due immagini e la pagina. La build Hostinger include anche l'assistente; il backend resta sul Worker Cloudflare.

Il canonical, gli URL Open Graph e i dati strutturati puntano a `https://mementoproduction.it/soluzioni-ia-torino`; la pagina è indicizzabile e presente nella sitemap pubblica. La demo Vercel usa lo stesso canonical ufficiale, così la pagina di prova non compete con il sito principale.

Prima di caricare la nuova build sul sito ufficiale:

1. Verificare con l'agenzia il testo dell'offerta, i confini del servizio e il passaggio al team.
2. Verificare gli hostname ufficiali nel widget Cloudflare Turnstile e aggiornare l'informativa Iubenda per l'uso dell'assistente.
3. Caricare tutti i file di `dist/memento-production-hostinger/browser`, incluse le cartelle `chatbot`, `images` e `models`.

## Immagini

Le immagini sono state create con il tool integrato imagegen e poi ottimizzate in WebP:

- `public/images/soluzioni-ia-rete-neurale-hero.webp`: cervello neurale astratto in vetro e metallo, rete di sinapsi verdi e dorate su fondo verde scuro, composizione panoramica con spazio a sinistra per il titolo. Nessun testo o logo.
- `public/images/soluzioni-ia-flusso-neurale.webp`: rete di cellule traslucide con segnali convergenti in un nodo e pochi percorsi ordinati in uscita, materiali fotografici, palette verde bosco e oro. Nessun testo o logo.

Le scene sono immagini concettuali. La conversazione mostrata nella pagina è segnalata come esempio illustrativo, senza attribuirla a un cliente reale.

## Robot 3D nella hero

La hero usa il modello Higgsfield fornito il 4 novembre 2026, `hf_20261104_002829_9a0e8a1a-628c-405b-8bb1-cf69d6bd0caf.glb`. L'originale nei Download non viene modificato. Non viene usato il precedente robot procedurale.

- `public/models/ai-assistant.glb`: versione web da 3.558.716 byte (3,6 MB; originale 20,2 MB), 62.235 triangoli, geometria compressa con Meshopt e texture WebP. Nessuna semplificazione della mesh; quantizzazione delle coordinate a 14 bit. Texture colore a 2048 px, normale a 1536 px, metallicità/ruvidità a 1024 px, emissione a 512 px. Rispetto alla prima versione web, le texture conservano più dettaglio nelle parti meccaniche senza aumentare i triangoli.
- `public/images/ai-robot-poster.webp`: immagine trasparente da circa 60 KB, renderizzata dallo stesso modello con visiera spenta. È visibile durante il caricamento e rimane su mobile, con movimento ridotto, risparmio dati, connessione 2G o WebGL indisponibile.
- `src/app/shared/ai-robot-hero.component.*`: layout, accessibilità, caricamento e ciclo di vita. Contenuti, link e pulsanti esistono anche senza WebGL; la CTA apre il chatbot esistente. Sotto i 900 px il poster è sovrapposto allo sfondo della hero, dietro al testo con una sfumatura per la leggibilità, senza aggiungere un blocco sotto i contenuti.
- `src/app/shared/ai-robot-scene.ts`: importazione GLB, illuminazione e interazione. Il modello e Three.js vengono richiesti solo su desktop con puntatore preciso, dopo il caricamento della pagina e quando la hero è visibile. Il download è annullabile; scena e risorse vengono rilasciate all'uscita dalla pagina.

Il GLB originale contiene una sola mesh, senza scheletro. `ai-robot-rig.ts` aggiunge al caricamento due ossa: busto fisso e testa. I pesi sono calibrati sulle coordinate di questo modello: sfumano soltanto nella zona del collo, escludendo spalle e collare laterale. Il volto rimane rigido. La testa segue il mouse con limiti di circa 15° orizzontali e 6° verticali; il busto mantiene la posa iniziale. Non vengono aggiunti occhi o bocca.

La visiera usa la linea azzurra già presente nella texture: il materiale la rende scura a riposo e luminosa durante il movimento del mouse, con un alone leggero sulla superficie adiacente. L'accensione è progressiva: da spenta raggiunge la piena luminosità in circa 3 secondi di movimento continuo. Dopo 130 ms senza spostamenti inizia una dissolvenza lenta e uniforme di circa 3 secondi dalla piena luminosità; il puntatore fermo su un pulsante non mantiene accesa la luce. Le durate sono regolabili con `VISOR_FADE_IN_SECONDS` e `VISOR_FADE_OUT_SECONDS` in `ai-robot-scene.ts`. Uscita dalla finestra, scheda nascosta e hero fuori schermo interrompono l'attività. L'effetto non usa bloom né un ulteriore passaggio di rendering.

Il rendering è limitato a circa 30 fotogrammi al secondo durante il movimento, si arresta quando la posa si stabilizza e si sospende fuori schermo o con scheda nascosta. Non ci sono ombre in tempo reale né postproduzione. Il canvas è decorativo; i metadati, il canonical, i dati strutturati e la sitemap restano quelli della pagina esistente.

La compressione è stata eseguita con glTF Transform, Meshoptimizer e Sharp in una cartella temporanea di strumenti, senza aggiungere dipendenze al progetto. Per sostituire il GLB occorre controllare nuovamente inquadratura, dimensioni, materiali e poster.

Il test `node --test scripts/test/ai-robot-rig.test.mjs` verifica la posa iniziale, l'immobilità di busto e spalle e la rigidità del volto durante la rotazione, anche con le trasformazioni della mesh quantizzata. Le verifiche nel browser coprono la visiera accesa durante il movimento, spenta allo stop e l'arresto del rendering a riposo.
