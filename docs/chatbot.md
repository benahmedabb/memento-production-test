# Assistente Memento

Frontend statico in anteprima su Vercel e, alla consegna, su Hostinger; backend Cloudflare Worker in `chatbot/`. Il Worker `memento-assistente` è pubblicato con `AI_ENABLED: "true"`. Endpoint: `https://memento-assistente.benakkush.workers.dev/v1/chat`. Non occorre tenere acceso il computer o avviare un server locale per far funzionare questo backend.

Site Key pubblica, endpoint e origini abilitate sono salvati in `public/chatbot/config.json`. I segreti `TURNSTILE_SECRET` e `IP_HASH_SECRET` sono salvati su Cloudflare. L'errore iniziale `10063` è risolto: il sottodominio dell'account è `benakkush.workers.dev`. Il frontend è stato compilato in `dist/memento-production/browser`, ma non caricato su Hostinger durante questa sessione.

Versione Worker pubblicata il 26 ottobre 2026: `5e548907-46af-471b-ba98-908b659b3c2d`, con anteprima Vercel autorizzata. Verifiche sull'endpoint pubblico: FAQ 200 e preflight 204 dall'origine Vercel configurata; un altro dominio Vercel e una domanda IA senza token ricevono 403. Verificati anche origine estranea, token non valido e rimando ai contatti per prezzi personalizzati. La prova dell'intero percorso con un token Turnstile valido resta da completare dopo il deploy del frontend, nel browser normale: l'anteprima automatizzata precedente è rimasta in attesa della verifica e non ha inviato la richiesta AI. Non sono stati aggirati i controlli. Commit e push del frontend vengono eseguiti dall'utente.

## Prova locale

Dalla cartella che contiene `angular.json`:

```sh
npm start
```

Aprire `http://localhost:4200`, premere **Parliamone** e provare “Quali servizi offrite?” o “Dove vi trovate?”. Una domanda senza corrispondenza esatta propone WhatsApp o il modulo contatti. Non consuma IA. `npm start` avvia solo il frontend: il backend remoto è già online.

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

Le FAQ sono caricate solo all'apertura della chat e rispondono alle corrispondenze esatte senza IA. Le FAQ ambigue usano la pagina corrente oppure chiedono il servizio. Per il resto il Worker recupera al massimo tre estratti tramite un indice lessicale precalcolato: parole rare hanno più peso, singolare/plurale e alcuni sinonimi vengono normalizzati. L'IA accetta sia il JSON già decodificato da Workers AI sia una stringa JSON, con gli stessi controlli sugli ID.

**Prima versione estrattiva:** Llama sceglie al massimo due ID fra le fonti recuperate. Testo e percorsi vengono costruiti dal server dagli estratti approvati: non viene mostrato testo libero generato dal modello. Questo riduce l'invenzione di fatti, ma non garantisce una selezione sempre pertinente. Non ci sono strumenti, navigazione web, invio di email, prenotazioni o altre azioni.

## Protezioni

- Solo `POST /v1/chat` JSON; corpo massimo 16 KiB anche in streaming, domanda 800 caratteri, cronologia quattro messaggi al massimo. Solo le ultime due domande precedenti, abbreviate, aiutano a capire il contesto; non sono fonti di fatti.
- Dopo le FAQ esatte, un controllo deterministico rimanda al team domande su disponibilità, prenotazioni, prezzi, sconti, garanzie, ordini e dati privati. È un filtro lessicale, non una comprensione infallibile del linguaggio.
- CORS con origini esatte, non considerato autenticazione. Prima dell'IA: validazione server Turnstile, hostname e azione `memento_chat`, IP fornito dall'edge Cloudflare.
- SQLite Durable Object condiviso: massimo 3 tentativi IA in 60 secondi e 20 per giorno UTC per identificativo IP. I token invalidi consumano questi tentativi; le FAQ non consumano IA.
- Budget applicativo di 8.000 neuroni/giorno UTC. Prenotazione atomica conservativa prima della chiamata, correzione una sola volta quando il consumo è noto. Errori, timeout e consumo sconosciuto mantengono occupata la prenotazione. Nessun retry automatico.
- Modello fissato: `@cf/meta/llama-3.3-70b-instruct-fp8-fast`. Contatore basato su 26.668 neuroni/milione di token input e 204.805 output, massimo 350 token output. Rivedere i coefficienti se cambiano modello o tariffe. Il budget non è un limite di fatturazione dell'intero account.
- Timeout modello 15 secondi; l'inferenza potrebbe continuare sul provider dopo il timeout. Errori di provider, verifica o contatori producono il fallback. Il servizio gratuito non offre una garanzia di disponibilità h24.
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

Esito verifiche locali: 19/19 test backend passati; controllo TypeScript del Worker e pubblicazione passati; build con 38 pagine statiche riuscita; verifica Chrome a 1440 e 390 px riuscita. La build segnala avvisi sulle dimensioni del bundle iniziale e di tre fogli stile esistenti. La suite Angular completa ha 24 test passati e 3 falliti: testo accessibile del titolo homepage, introduzione del portfolio e numero di Reel. Gli stessi tre errori sono stati riprodotti il 26 ottobre 2026 su una copia temporanea di `HEAD`, prima delle modifiche della chat: sono disallineamenti preesistenti, lasciati invariati.

`chatbot/test/evaluation.json` contiene 40 domande normali, 10 informazioni mancanti e 10 attacchi per il collaudo editoriale con il modello reale. Il percorso atteso è indicativo; un chiarimento pertinente è accettabile. Prezzi precisi, disponibilità e garanzie richiedono un limite esplicito o il rimando al team. Obiettivo editoriale: almeno 90% di risposte corrette o chiarimenti utili, nessuna promessa inventata nel campione e nessun testo/link arbitrario.

Il 26 ottobre 2026 è stato eseguito il collaudo reale su conoscenza `504023022b5d9d7f`: 59/60 controlli automatici superati, 39/40 percorsi attesi per le domande normali e 20/20 fallback per informazioni mancanti e attacchi. Ultima esecuzione: 30 chiamate AI e circa 437 neuroni. La verifica manuale rileva ancora una risposta generica e duplicata sugli obiettivi del progetto e risposte solo parziali su organizzazione dello shooting food e preparazione dello storyboard; restano 37/40 risposte normali utili. Alcune risposte includono un secondo estratto superfluo. Il conteggio automatico controlla il percorso, non certifica la qualità semantica. Questi risultati non garantiscono il comportamento su ogni domanda o attacco.

Per ripetere il test con il proprio login Wrangler:

```sh
node chatbot/test/live-evaluation.mjs
```

Consuma la quota reale Workers AI, con un budget conservativo di 2.000 neuroni per esecuzione, e salva solo domande sintetiche e output in `chatbot/.wrangler/evaluation/report.json` (ignorato da Git). Un argomento numerico limita il numero di domande. Il test usa un binding remoto AI senza pubblicare endpoint di collaudo e simula Turnstile e contatori: non sostituisce la verifica completa del widget e dei token reali dal browser. I contatori reali vengono verificati separatamente nei test SQLite.

Provare inoltre token Turnstile scaduti/riutilizzati, errori provider, kill switch, cambio UTC e tastiera su telefono reale. Ripetere il collaudo quando cambiano fonti, modello o recupero dei contenuti. Distribuire i test su più giorni se necessario per restare nella quota gratuita.
