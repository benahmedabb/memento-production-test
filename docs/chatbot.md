# Assistente Memento

Frontend statico in anteprima su Vercel e, alla consegna, su Hostinger; backend Cloudflare Worker in `chatbot/`. Il Worker `memento-assistente` è pubblicato con `AI_ENABLED: "true"`. Endpoint: `https://memento-assistente.benakkush.workers.dev/v1/chat`. Non occorre tenere acceso il computer o avviare un server locale per far funzionare questo backend.

Site Key pubblica, endpoint e origini abilitate sono salvati in `public/chatbot/config.json`. I segreti `TURNSTILE_SECRET` e `IP_HASH_SECRET` sono salvati su Cloudflare. L'errore iniziale `10063` è risolto: il sottodominio dell'account è `benakkush.workers.dev`. Il frontend è stato compilato in `dist/memento-production/browser`, ma non caricato su Hostinger durante questa sessione.

Versione Worker pubblicata il 27 ottobre 2026: `f9aa3c2f-0b01-4eb1-bd30-d5f3368f76a0`. Per il collaudo sono ammesse 10 richieste IA in 60 secondi per connessione/IP e non c'è più il limite giornaliero di 20 tentativi per connessione; resta il budget condiviso di 8.000 neuroni al giorno. Le richieste estranee all'agenzia vengono classificate prima della ricerca e reindirizzate senza generare risposte su meteo, programmazione TV o altri argomenti esterni. Nei dialoghi commerciali il modello distingue ora tra un bisogno ancora vago, che richiede una sola domanda decisiva, e un bisogno già chiaro, per il quale consiglia il servizio pertinente senza aggiungere domande di cortesia. Il frontend già online punta all'endpoint corretto, quindi le modifiche al Worker sono attive senza un nuovo deploy Vercel. Dopo questo deploy sono stati superati 27/27 test backend, il controllo TypeScript, il dry-run e i collaudi mirati con il modello remoto. Durante i deploy precedenti erano stati verificati anche preflight 204, origine estranea e token non valido 403. La verifica del percorso completo con un token Turnstile valido resta da ripetere nel browser normale. Non sono stati aggirati i controlli dell'endpoint pubblico. Commit e push dei file vengono eseguiti dall'utente.

## Prova locale

Dalla cartella che contiene `angular.json`:

```sh
npm start
```

Aprire `http://localhost:4200`, premere **Parliamone** e provare “Quali servizi offrite?” o “Dove vi trovate?”. Una domanda senza corrispondenza esatta segnala che il servizio di chat non è disponibile e mantiene accessibili i contatti: localhost non è abilitato all'IA remota. Non consuma IA. `npm start` avvia solo il frontend: il backend remoto è già online.

Frontend e Worker ammettono `https://mementoproduction.it`, `https://www.mementoproduction.it` e l'anteprima stabile `https://memento-production-test-2.vercel.app`. Il frontend evita Turnstile su altre origini, compreso localhost. Gli hostname corrispondenti devono essere aggiunti anche al widget Turnstile. Per collaudare l'IA dal browser locale occorre configurare un widget di sviluppo con gli hostname `localhost` e `127.0.0.1` e un ambiente backend separato con le origini e i segreti corrispondenti. La Site Key non diventa valida in locale cambiando solo `config.json`.

Per provare anche l'endpoint locale:

```sh
npm ci --prefix chatbot
npm run chatbot:dev
```

L'ambiente `local` non ha un binding AI, quindi non può consumare inferenze. Esempio:

```sh
curl http://127.0.0.1:8787/v1/chat \
  -H 'Origin: http://localhost:4200' \
  -H 'Content-Type: application/json' \
  --data '{"message":"Dove vi trovate?"}'
```

Non serve `sudo`. Le dipendenze sono fissate in `chatbot/package-lock.json`. Node deve supportare TypeScript nativo e `registerHooks`; verifica eseguita con Node 26.3.1.

## Anteprima cliente su Vercel

Il sito di prova è [memento-production-test-2.vercel.app](https://memento-production-test-2.vercel.app/). Si usa lo stesso backend Cloudflare già pubblicato, con lo stesso budget e gli stessi contatori condivisi. Non occorre trasferire il backend su Vercel o pubblicare il frontend su Hostinger per provarlo.

1. Cloudflare → Turnstile → widget della chat → Settings → Hostname Management: aggiungere `memento-production-test-2.vercel.app`, senza protocollo e senza slash, e salvare. Si riutilizzano Site Key e secret già configurate. Aggiunta confermata dall'utente il 26 ottobre 2026.
2. Pubblicare il Worker con `npm --prefix chatbot run deploy` quando cambia `ALLOWED_ORIGINS`. La configurazione ammette l'URL stabile esatto, non tutti i domini Vercel o gli URL casuali dei singoli deploy.
3. Salvare e inviare su GitHub le modifiche della chat nel ramo collegato al progetto Vercel. Un commit solo locale non aggiorna il sito. Build command: `npm run build`; output statico: `dist/memento-production/browser`. Il generatore dei contenuti viene eseguito durante la build.
4. Dopo il deploy, aprire l'URL stabile, fare un ricaricamento completo e provare “Di cosa si occupa Elena?”. La risposta FAQ “Dove vi trovate?” non verifica l'IA perché funziona localmente.

Dopo approvazione e pagamento, compilare e caricare il frontend su Hostinger con il flusso abituale. L'indirizzo del backend rimane lo stesso; i domini finali sono già nell'elenco consentito. La gestione degli hostname è descritta nella [documentazione Turnstile](https://developers.cloudflare.com/turnstile/additional-configuration/hostname-management/); il flusso Git nella [documentazione Vercel](https://vercel.com/docs/git).

## Conoscenza e risposte

`npm run chatbot:knowledge` genera `chatbot/data/base.json` e `public/chatbot/faq.json`; viene eseguito prima di `start` e `build`. `node scripts/build-chatbot-knowledge.mjs --check` verifica gli artefatti. La versione è il digest dei contenuti.

Fonti ammesse: catalogo servizi, contatti, Ads, paragrafi statici dell'agenzia, metodo, case study attuali e recensioni. Il generatore seleziona i soli campi pubblici ed estrae il testo dei template mediante AST TypeScript e DOM. Esclude interpolazioni, configurazione EmailJS, immagini, documenti originali e metriche legacy. Nuovi componenti e contenuti dinamici devono essere aggiunti esplicitamente e revisionati: non è un crawler indiscriminato del sito o del repository.

Le FAQ sono caricate solo all'apertura della chat e rispondono alle corrispondenze esatte senza IA. Le FAQ ambigue usano la pagina corrente oppure chiedono il servizio. Per gli altri messaggi il Worker usa due chiamate al modello:

1. **Interpretazione:** legge il messaggio e il breve dialogo precedente, riconosce saluti, domande, bisogni, richieste da chiarire o da passare al team. Genera al massimo due ricerche pertinenti. Non serve enumerare le frasi che potrebbero scrivere i visitatori.
2. **Recupero e risposta:** per domande e bisogni cerca usando sia le riformulazioni sia il messaggio originale; seleziona al massimo tre estratti. Il modello formula una risposta naturale con al massimo due riferimenti alle fonti. Anche senza estratti può salutare, riconoscere una difficoltà o fare una domanda per capire meglio.

Per esempio, “Il mio sito fa schifo” viene interpretato come un bisogno da approfondire; il bot può chiedere quale aspetto non convince. Una risposta successiva come “La velocità” viene letta nel contesto della domanda precedente. La cronologia contiene messaggi dell'utente e dell'assistente, ma non costituisce una fonte di fatti sull'azienda.

Le istruzioni richiedono di interpretare anche refusi, abbreviazioni, negazioni e risposte incomplete, senza un elenco di frasi predefinite. La frase generica “Non ho informazioni sufficienti per rispondere con precisione…” è stata rimossa dal codice. L'assenza di risultati nella ricerca non interrompe la generazione: il modello può proseguire il dialogo o spiegare quale fatto specifico non può confermare. Le FAQ esatte restano la scorciatoia senza consumo IA.

I guasti non vengono presentati come mancanza di conoscenza. Il backend restituisce un campo opzionale `error.code` e uno stato HTTP: `rate_limit` e `budget_exhausted` (429, con `Retry-After`); `verification_failed` (403); `unavailable` (503); `timeout` (504); `invalid_model_response` (502); `personal_data` (422). Il precedente codice `daily_limit` rimane riconosciuto dal protocollo per compatibilità, ma il contatore non lo emette più durante il collaudo. Il widget distingue anche verifica fallita, timeout e problemi di connessione locali. Gli avvisi tecnici sono fissi perché in quei casi non è disponibile una risposta valida del modello. I tentativi falliti restano visibili, ma sono esclusi dalla cronologia inviata al modello: un retry conserva gli ultimi quattro messaggi utili. Nessun retry automatico e nessun transcript registrato per la diagnosi.

**Risposta generativa con fonti:** questa versione sostituisce la precedente selezione di soli estratti. Il testo viene generato dal modello; fonti e link restano vincolati agli ID recuperati. Le istruzioni richiedono che ogni fatto aziendale sia sostenuto dalle fonti. Formato, lunghezza, riferimenti, URL, alcuni prezzi e impegni vengono controllati anche dal server. Questi controlli non dimostrano che ogni frase sia vera: rimane possibile una riformulazione imprecisa o non sostenuta, da valutare nel collaudo editoriale. Non ci sono strumenti, navigazione web, invio di email, prenotazioni o altre azioni. Entrambe le chiamate usano [JSON strutturato di Workers AI](https://developers.cloudflare.com/workers-ai/features/json-mode/) e validazione indipendente sul server.

## Protezioni

- Solo `POST /v1/chat` JSON; corpo massimo 16 KiB anche in streaming, domanda 800 caratteri, cronologia quattro messaggi al massimo, abbreviati a 400 caratteri ciascuno prima dell'IA. Aiuta a capire il contesto, non è una fonte di fatti aziendali.
- Dopo l'interpretazione, un controllo deterministico forza il rinvio al team per disponibilità, prenotazioni, prezzi, sconti, garanzie, fatturato e dati privati. La spiegazione può essere dinamica, ma il bot non può negoziare o verificare un ordine. Il controllo lessicale aggiuntivo non è una comprensione infallibile del linguaggio.
- CORS con origini esatte, non considerato autenticazione. Prima dell'IA: validazione server Turnstile, hostname e azione `memento_chat`, IP fornito dall'edge Cloudflare.
- SQLite Durable Object condiviso: massimo 10 tentativi IA in 60 secondi per identificativo IP. Il precedente limite di 3 al minuto è stato aumentato e quello di 20 tentativi giornalieri per IP rimosso su richiesta dell'utente per il collaudo dell'agenzia, anche per le connessioni che lo avevano già raggiunto. I token invalidi consumano i tentativi del minuto; le FAQ non consumano IA. Restano il budget IA condiviso e le quote del provider.
- Budget applicativo di 8.000 neuroni/giorno UTC. Prenotazione atomica conservativa separata prima di **ciascuna** delle due chiamate, includendo messaggi e schema JSON; correzione una sola volta quando il consumo è noto. Errori, timeout e consumo sconosciuto mantengono occupata la prenotazione. La seconda chiamata non parte se il budget è esaurito. Nessun retry automatico.
- Modello fissato: `@cf/meta/llama-3.3-70b-instruct-fp8-fast`. Contatore basato su 26.668 neuroni/milione di token input e 204.805 output, massimo 220 token per l'interpretazione e 350 per la risposta. Rivedere i coefficienti se cambiano modello o tariffe. Il budget non è un limite di fatturazione dell'intero account.
- Timeout modello 10 secondi per l'interpretazione e 15 per la risposta; timeout HTTP del frontend 45 secondi, inclusi verifiche e contatori. L'inferenza potrebbe continuare sul provider dopo un timeout. Errori di provider, verifica o contatori producono un avviso tecnico, distinto dalle risposte conversazionali. Il servizio gratuito non offre una garanzia di disponibilità h24.
- Nessun transcript archiviato, log di prompt o evento analitico della chat. Storia solo in memoria del browser: sopravvive alla navigazione SPA, si cancella a chiusura, ricaricamento o reset. Identificativo IP tramite HMAC con giorno UTC e segreto; contatori attivi eliminati con allarme al cambio giorno. Conservazione e backup del fornitore vanno verificati nell'informativa.
- Messaggi renderizzati come testo Angular, mai `innerHTML`. URL prodotti dal server e validati anche dal client. WhatsApp e modulo contatti restano accessibili senza IA.

Un attacco distribuito può esaurire la quota e rendere temporaneamente indisponibile l'IA. Utenti con lo stesso IP condividono i limiti. Mantenere **Workers Free**, senza attivare fatturazione a consumo, per l'obiettivo di zero costi aggiuntivi. Al superamento delle quote Free Cloudflare blocca le operazioni; anche altre applicazioni dell'account condividono la quota AI.

Fonti: [Workers AI, quote e tariffe](https://developers.cloudflare.com/workers-ai/platform/pricing/), [validazione Turnstile](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/), [Durable Objects SQLite](https://developers.cloudflare.com/durable-objects/api/sqlite-storage-api/).

## Pubblicazione e aggiornamenti

Configurazione Cloudflare, segreti e pubblicazione del backend sono già completati per questo account. I passaggi seguenti documentano anche una nuova installazione. Per aggiornare i contenuti, eseguire `npm run chatbot:knowledge`, verificare, pubblicare il Worker e ricompilare/caricare il frontend: le due copie delle FAQ devono restare allineate.

Su un account nuovo, aprire prima la pagina **Workers / Workers & Pages** nel pannello Cloudflare: inizializza il sottodominio `workers.dev` richiesto dal backend. Se `wrangler deploy` restituisce `10063`, completare questo passaggio prima di riprovare.

1. Cloudflare **Turnstile → Add widget**: nome `Memento chat`, modalità **Managed**, hostname `mementoproduction.it` e `www.mementoproduction.it`. Si ottengono una site key pubblica e una secret key privata. Non inserire la secret key nel frontend o nelle conversazioni.
2. Dopo la revisione del deploy, pubblicare prima il Worker con IA disabilitata tramite `npm --prefix chatbot run deploy`. Dalla cartella `chatbot`, salvare la chiave privata con `npx wrangler secret put TURNSTILE_SECRET --env=''`.
3. Generare il segreto anti-abuso e inviarlo direttamente a Wrangler senza stamparlo:

   ```sh
   node -e "process.stdout.write(require('node:crypto').randomBytes(32).toString('hex'))" | npx wrangler secret put IP_HASH_SECRET --env=''
   ```

4. Aggiornare l'informativa Iubenda per i trattamenti effettivi di Workers AI, Turnstile e contatori. La nota aggiunta alla pagina locale non aggiorna Iubenda e non costituisce una verifica legale.
5. Collaudare l'IA sull'anteprima Vercel descritta sopra prima di consegnare il frontend su Hostinger. Questa configurazione condivide backend e quote. Se in futuro si crea un ambiente di staging indipendente, replicare esplicitamente binding e segreti, non tutti ereditati tra ambienti Wrangler, e usare widget e hostname dedicati.
6. Dopo il collaudo, impostare `AI_ENABLED: "true"` nell'ambiente scelto. `npm --prefix chatbot run dry-run` prepara il pacchetto senza pubblicare; `npm --prefix chatbot run deploy` pubblica il backend e restituisce l'indirizzo `*.workers.dev`.
7. Compilare `public/chatbot/config.json`: `apiUrl` uguale a `https://<worker>.<account>.workers.dev/v1/chat`, `turnstileSiteKey` uguale alla chiave pubblica, `allowedOrigins` uguale alle origini del sito effettivamente configurate nel backend e nel widget. Nessun segreto nel file. Eseguire `npm run build` e caricare il contenuto di `dist/memento-production/browser` su Hostinger con il flusso abituale.

Se si introduce una Content Security Policy, consentire Worker e domini Turnstile secondo la documentazione ufficiale. Lo script Turnstile viene caricato solo quando una domanda richiede il backend.

Kill switch: ripristinare `AI_ENABLED: "false"` e ridistribuire. Per scollegare il backend dal sito, svuotare `apiUrl` e `turnstileSiteKey` e aggiornare il file pubblico. FAQ e contatti continuano a funzionare.

## Verifica

```sh
npm run chatbot:test
npm --prefix chatbot run check
npm --prefix chatbot run dry-run
npm test -- --watch=false
npm run build
```

I test backend simulano il provider e usano un runtime SQLite/Miniflare reale per i contatori: non consumano IA. Coprono validazione, CORS, Turnstile, concorrenza, budget, doppia contabilizzazione, cancellazione, errori e output non ammesso. La verifica browser copre desktop/mobile, FAQ, fallback, navigazione, focus, testo HTML e cancellazione.

Esito delle verifiche dopo la correzione del dialogo: 26/26 test backend passati, 3/3 test mirati del widget passati (`npm test -- --watch=false --include=src/app/shared/chat-panel.component.spec.ts`), controllo TypeScript, dry-run del Worker e build con 38 pagine statiche riusciti. I nuovi test coprono cronologia completa dello scambio sul design, generazione senza fonti, errori distinti, timeout senza retry e recupero del dialogo dopo errori HTTP/rete/Turnstile. La verifica Chrome a 1440 e 390 px della precedente versione del widget era riuscita. La build segnala avvisi sulle dimensioni del bundle iniziale e di tre fogli stile esistenti. La suite Angular completa verificata durante l'introduzione della chat aveva 24 test passati e 3 falliti: testo accessibile del titolo homepage, introduzione del portfolio e numero di Reel. Gli stessi tre errori erano stati riprodotti su una copia temporanea di `HEAD`, prima delle modifiche della chat: sono disallineamenti preesistenti, lasciati invariati; la suite completa non è stata ripetuta per questa correzione.

`chatbot/test/evaluation.json` contiene 12 casi di dialogo (saluti, affermazioni, messaggi misti e risposte con cronologia), 40 domande normali, 10 informazioni mancanti, 10 attacchi e 3 regressioni (casi 73–75: scambio sul design, refusi con negazione e orari assenti dalle fonti). Il percorso atteso è indicativo; un chiarimento pertinente è accettabile. Prezzi precisi, disponibilità e garanzie richiedono un limite esplicito o il rimando al team. Obiettivo editoriale: almeno 90% di risposte corrette o chiarimenti utili, nessuna promessa inventata nel campione e nessun testo/link arbitrario.

Primo collaudo completo della versione generativa del 26 ottobre 2026, conoscenza `504023022b5d9d7f`: 72 casi, 117 chiamate, circa 3.184 neuroni, 65 controlli automatici superati. Il controllo automatico di dialogo (12/12) verifica modalità e presenza della domanda, non la pertinenza di ogni frase. La revisione manuale ha evidenziato un'attribuzione errata del logo, una fonte non adeguata sul fondatore e sul packaging e un rinvio poco esplicito per gli sconti. Le risposte su prezzi, orari, fatturato e garanzie dichiaravano invece correttamente i limiti, pur usando una modalità diversa da quella attesa dal vecchio controllo. Sono stati corretti prompt, ricerca e trattamento delle richieste commerciali, con una nuova esecuzione mirata dei casi interessati. I risultati del primo collaudo sono salvati localmente in `chatbot/.wrangler/evaluation/dialogue-full-report.json`; quelli dell'ultima esecuzione in `report.json`. Non costituiscono una garanzia su ogni domanda o attacco.

Ricontrollo mirato finale: 29 casi, 56 chiamate, circa 1.531 neuroni; 26 controlli automatici superati, inclusi tutti i 12 dialoghi e i riferimenti corretti a fondatore e packaging. Due controlli segnalano risposte su orari e ordini che rimandano correttamente al team ma hanno modalità `ai`; resta poco specifica la risposta generica sul metodo di definizione degli obiettivi, basata su fonti del servizio video. La revisione del testo è indispensabile: il solo punteggio automatico non è una misura sufficiente della qualità.

Per ripetere il test con il proprio login Wrangler:

```sh
node chatbot/test/live-evaluation.mjs
```

Collaudo della correzione: prima riproduzione del caso 73 sul modello precedente, due chiamate e circa 80 neuroni; il messaggio viene già interpretato correttamente come bisogno sul design. Non è quindi possibile attribuire retroattivamente il fallback segnalato a mancata comprensione: il vecchio protocollo nascondeva anche errori e quote dietro lo stesso testo. Dopo le modifiche sono stati provati i casi 73–75 (circa 221 neuroni), poi ricontrollati con il caso 64 di richiesta del prompt interno (4/4 controlli superati, otto chiamate, circa 271 neuroni). Il test distingue ora status HTTP ed errori dalle risposte valide, e registra i tempi delle sole chiamate sintetiche. La revisione conferma il riconoscimento dei refusi, del logo da conservare e degli orari sconosciuti, senza informazioni inventate in questi esempi. Lo stile può ancora risultare generico: per gli orari il modello suggerisce anche il sito oltre al team; questi pochi casi non dimostrano una qualità uniforme su tutte le conversazioni.

Consuma la quota reale Workers AI, con un budget conservativo di 4.000 neuroni per esecuzione, e salva solo domande sintetiche e output in `chatbot/.wrangler/evaluation/report.json` (ignorato da Git). Un argomento numerico limita il numero di casi; `--cases=1,5,11` seleziona casi specifici (numerazione da 1). Il test usa un binding remoto AI senza pubblicare endpoint di collaudo e simula Turnstile e contatori: non sostituisce la verifica completa del widget e dei token reali dal browser. I contatori reali vengono verificati separatamente nei test SQLite. Non ripetere l'intero collaudo più volte senza tenere conto del consumo complessivo dell'account.

Provare inoltre token Turnstile scaduti/riutilizzati, errori provider, kill switch, cambio UTC e tastiera su telefono reale. Ripetere il collaudo quando cambiano fonti, modello o recupero dei contenuti. Distribuire i test su più giorni se necessario per restare nella quota gratuita.
