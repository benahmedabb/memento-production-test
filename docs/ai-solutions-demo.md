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
