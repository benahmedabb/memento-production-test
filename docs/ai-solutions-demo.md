# Soluzioni IA — demo Vercel

La pagina `/soluzioni-ia-torino` presenta un servizio costruito intorno ai problemi dei clienti: domande ripetute, richieste fuori orario e contatti con poco contesto. È collegata dalla Home, dalla navbar, dal menu Servizi, dalla pagina Servizi e dal footer. Il modulo Contatti include l'opzione “Soluzioni IA” e la preseleziona dai pulsanti della pagina. “Prova l'assistente” apre il chatbot già presente nella demo.

La base di conoscenza locale include ora il nuovo servizio. Dopo il commit che pubblicherà la pagina su Vercel, l'eventuale Worker Cloudflare già distribuito deve essere aggiornato separatamente per usare la nuova base; il deploy del frontend non aggiorna da solo il Worker.

## Pubblicazione controllata

`src/app/core/ai-service-availability.ts` abilita la pagina sulla demo Vercel. La configurazione Hostinger sostituisce quel file con `ai-service-availability.hostinger.ts`, che la disabilita, ed esclude le due immagini dagli asset. Non caricare le nuove immagini né la pagina separatamente su Hostinger.

Durante la revisione la pagina ha `noindex, nofollow`. Il suo canonical, gli URL Open Graph e i dati strutturati della pagina puntano a `https://memento-production-test-2.vercel.app/soluzioni-ia-torino`. Non compare nella sitemap pubblica perché il servizio non è ancora disponibile su `mementoproduction.it`.

Per pubblicarla sul sito ufficiale dopo l'approvazione:

1. Abilitare la pagina anche nella variante Hostinger e includere i due file immagine.
2. Rimuovere `noIndex` da `pageMetadata.aiSolutions` e usare l'origine pubblica al posto di `DEMO_ORIGIN` nel componente.
3. Aggiungere l'URL canonico alla sitemap pubblica.
4. Verificare il testo dell'offerta con l'agenzia, soprattutto confini del servizio, privacy e passaggio al team.

## Immagini

Le immagini sono state create con il tool integrato imagegen e poi ottimizzate in WebP:

- `public/images/soluzioni-ia-rete-neurale-hero.webp`: cervello neurale astratto in vetro e metallo, rete di sinapsi verdi e dorate su fondo verde scuro, composizione panoramica con spazio a sinistra per il titolo. Nessun testo o logo.
- `public/images/soluzioni-ia-flusso-neurale.webp`: rete di cellule traslucide con segnali convergenti in un nodo e pochi percorsi ordinati in uscita, materiali fotografici, palette verde bosco e oro. Nessun testo o logo.

Le scene sono immagini concettuali. La conversazione mostrata nella pagina è segnalata come esempio illustrativo, senza attribuirla a un cliente reale.
