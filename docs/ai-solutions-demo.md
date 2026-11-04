# Soluzioni IA — sito ufficiale e anteprima

La pagina `/soluzioni-ia-torino` presenta un servizio costruito intorno ai problemi dei clienti: domande ripetute, richieste fuori orario e contatti con poco contesto. È collegata dalla Home, dalla navbar, dal menu Servizi, dalla pagina Servizi e dal footer. Il modulo Contatti include l'opzione “Soluzioni IA” e la preseleziona dai pulsanti della pagina. “Prova l'assistente” apre il chatbot già presente nella demo.

La base di conoscenza locale e il Worker Cloudflare già pubblicato includono il servizio. Il deploy del frontend non aggiorna da solo il Worker quando la base di conoscenza cambia.

## Pubblicazione

`src/app/core/ai-service-availability.ts` abilita la pagina sia sulla demo Vercel sia nella build Hostinger. La configurazione Hostinger include le due immagini e la pagina. La build Hostinger include anche l'assistente; il backend resta sul Worker Cloudflare.

Il canonical, gli URL Open Graph e i dati strutturati puntano a `https://mementoproduction.it/soluzioni-ia-torino`; la pagina è indicizzabile e presente nella sitemap pubblica. La demo Vercel usa lo stesso canonical ufficiale, così la pagina di prova non compete con il sito principale.

Prima di caricare la nuova build sul sito ufficiale:

1. Verificare con l'agenzia il testo dell'offerta, i confini del servizio e il passaggio al team.
2. Verificare gli hostname ufficiali nel widget Cloudflare Turnstile e aggiornare l'informativa Iubenda per l'uso dell'assistente.
3. Caricare tutti i file di `dist/memento-production-hostinger/browser`, incluse le cartelle `chatbot` e `images`.

## Immagini

Le immagini sono state create con il tool integrato imagegen e poi ottimizzate in WebP:

- `public/images/soluzioni-ia-rete-neurale-hero.webp`: cervello neurale astratto in vetro e metallo, rete di sinapsi verdi e dorate su fondo verde scuro, composizione panoramica con spazio a sinistra per il titolo. Nessun testo o logo.
- `public/images/soluzioni-ia-flusso-neurale.webp`: rete di cellule traslucide con segnali convergenti in un nodo e pochi percorsi ordinati in uscita, materiali fotografici, palette verde bosco e oro. Nessun testo o logo.

Le scene sono immagini concettuali. La conversazione mostrata nella pagina è segnalata come esempio illustrativo, senza attribuirla a un cliente reale.

## Robot 3D nella hero

La hero usa il modello Higgsfield fornito il 4 novembre 2026, `hf_20261104_002829_9a0e8a1a-628c-405b-8bb1-cf69d6bd0caf.glb`. L'originale nei Download non viene modificato. Non viene usato il precedente robot procedurale.

- `public/models/ai-assistant.glb`: versione web da 2.405.968 byte (2,4 MB; originale 20,2 MB), 62.235 triangoli, geometria compressa con Meshopt e texture WebP. Nessuna semplificazione della mesh; quantizzazione delle coordinate a 14 bit. Texture colore a 1536 px, normale e metallicità/ruvidità a 1024 px, emissione a 512 px.
- `public/images/ai-robot-poster.webp`: immagine trasparente da circa 52 KB, renderizzata dallo stesso modello. È visibile durante il caricamento e rimane su mobile, con movimento ridotto, risparmio dati, connessione 2G o WebGL indisponibile.
- `src/app/shared/ai-robot-hero.component.*`: layout, accessibilità, caricamento e ciclo di vita. Contenuti, link e pulsanti esistono anche senza WebGL; la CTA apre il chatbot esistente.
- `src/app/shared/ai-robot-scene.ts`: importazione GLB, illuminazione e interazione. Il modello e Three.js vengono richiesti solo su desktop con puntatore preciso, dopo il caricamento della pagina e quando la hero è visibile. Il download è annullabile; scena e risorse vengono rilasciate all'uscita dalla pagina.

Il GLB contiene una sola mesh, senza scheletro, occhi separati o animazioni. L'interazione applica una rotazione contenuta al robot intero; **non anima occhi e collo indipendentemente**. Per quel movimento serve un modello articolato. L'illuminazione emissiva reagisce al passaggio sui pulsanti.

Il rendering è limitato a circa 30 fotogrammi al secondo durante il movimento, si arresta quando la posa si stabilizza e si sospende fuori schermo o con scheda nascosta. Non ci sono ombre in tempo reale né postproduzione. Il canvas è decorativo; i metadati, il canonical, i dati strutturati e la sitemap restano quelli della pagina esistente.

La compressione è stata eseguita con glTF Transform, Meshoptimizer e Sharp in una cartella temporanea di strumenti, senza aggiungere dipendenze al progetto. Per sostituire il GLB occorre controllare nuovamente inquadratura, dimensioni, materiali e poster.
