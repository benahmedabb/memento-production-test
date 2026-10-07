# Materiali reali nelle pagine dei servizi

Integrazione del 7 ottobre 2026 dai link forniti nell’email dell’agenzia. La cartella riservata con nuovi materiali e case study è esclusa, come richiesto dall’utente. Non sono stati aggiunti risultati commerciali o metriche non documentati.

## Distribuzione

| Pagina                                               | Materiale                                                                         |
| ---------------------------------------------------- | --------------------------------------------------------------------------------- |
| `/foto`                                              | Anteprima di tre scatti immobiliari e rimando alla galleria completa              |
| `/foto/fotografia-immobiliare-torino`                | Cinque foto: soggiorno, cucina, camera, esterno e drone; quattro film immobiliari |
| `/video`                                             | Tre film aziendali, quattro film immobiliari, selezione di tre Reel               |
| `/video/video-aziendali-torino`                      | Tre film aziendali                                                                |
| `/video/reel-social-torino`                          | Quattro Reel: tre player locali e un collegamento Instagram                       |
| `/video/video-animati-torino`                        | Reel animato Speed Trasporti                                                      |
| `/video/video-corsi-testimonial-torino`              | Testimonianza esistente del Dr. Alessio Vainella                                  |
| `/social`, `/social/gestione-social-organica-torino` | Tre esempi di contenuti social, con rimando alla selezione completa               |
| `/social/facebook-instagram-torino`                  | Quattro Reel                                                                      |

Gli esempi di Instagram non sono attribuiti a TikTok. Non sono usati video come fotografie corporate o lavori di grafica stampata. Restano presenti testi, FAQ, processo, CTA, collegamenti e progetti di portfolio già pubblicati.

## Fotografie

Fonte: [cartella Professionecasa](https://drive.google.com/drive/folders/1EaJjQFJHqihHMekKT4Y6R19DKV4q7QC4). Sono state consultate le case 49, 56, 65, 77, 87 e 89; scelti cinque scatti complessivi dagli immobili indicati. Per la casa 89 sono stati usati i JPEG finalizzati della sottocartella `Done`, non i RAW.

| Soggetto / file nel sito       | Casa | File originale                                  | ID Drive                            |
| ------------------------------ | ---- | ----------------------------------------------- | ----------------------------------- |
| `soggiorno-villa-cantalupa`    | 56   | `DSC06982-HDR.jpg`                              | `1vFsL5QyMKAhvOAzMwY82YHC3gSWs_Ee9` |
| `cucina-appartamento-pinerolo` | 77   | `77. Appartamento Pinerolo-17.jpg`              | `17kf8jeTGZ02cKO4Kj2IImFYinq0Rme32` |
| `camera-villa-cantalupa`       | 89   | `89. Professione Casa - Villa Cantalupa-29.jpg` | `1DXnucHztnBUpF6WFdt4dcXSeh1vOnms4` |
| `esterno-villa-cumiana`        | 87   | `87. Villa Cumiana-59.jpg`                      | `12hEnyiS-B4E_NZztKXPM5lT3B3QVwP7c` |
| `drone-villa-piscina`          | 49   | `49.Villa Piscina-38.jpg`                       | `11XsQsC0cAKVbUJqq2GUutB9aQvC7a4M8` |

Copie WebP in `public/images/servizi/`, larghezze 640, 1200 e 1920 pixel. Nessuna rimozione dei marchi sulle immagini. Didascalie e alt descrivono ciò che è visibile. La galleria supporta dialogo nativo, frecce, Escape e ritorno del focus; i link alle immagini restano utilizzabili senza JavaScript.

## Film YouTube

Metadati pubblici verificati: disponibilità dell’embed, durata e data di pubblicazione. Copertine locali WebP a 640 e 1280 pixel. Il titolo editoriale del secondo film aziendale resta generico perché quello pubblicato su YouTube è soltanto `10 febbraio 2024`: non è stato inventato un nome cliente.

| ID YouTube    | Contenuto             | Durata |
| ------------- | --------------------- | ------ |
| `_iw7KThOjP8` | Villa Cantalupa       | 1:44   |
| `0unB4I4tnFo` | Villa Frossasco       | 0:49   |
| `pyai3WjaXAE` | Riva di Pinerolo      | 1:25   |
| `IG-Wl8tMakg` | Esterni Villa Cumiana | 0:39   |
| `Ude7C8Ae4Us` | Terravision           | 2:40   |
| `XV3brJ2u3zg` | Racconto aziendale    | 1:02   |
| `_UV66vGu1Xs` | Villaggio Salute 2025 | 1:12   |

I player `youtube-nocookie.com` sono creati solo dopo la richiesta di riproduzione e il consenso ai contenuti esterni. Chiudere le preferenze annulla la richiesta; revocare il consenso rimuove il player. Il collegamento al video originale rimane sempre visibile.

## Reel Instagram

La selezione esclude i due Reel del Master dedicati a drink e aperitivo. Le gallerie, le anteprime e i dati strutturati usano i lavori su benessere e logistica; le relative copertine e i video del Master sono stati rimossi dagli asset pubblici.

| ID Instagram  | Cliente / contenuto                | Fruizione                       |
| ------------- | ---------------------------------- | ------------------------------- |
| `DZaBhL4oxDw` | Arabian Luxury Beauty              | MP4 locale                      |
| `DbYnt8pAvgN` | Centro Benessere Life              | Copertina locale e link al post |
| `DclvAv2oB-b` | Speed Trasporti, animazione        | MP4 locale                      |
| `DbIgzo_Igur` | Speed Trasporti, logistica inversa | MP4 locale                      |

Tre file MP4 recuperati dalle pagine pubbliche di incorporamento di Instagram e ottimizzati con H.264/AAC, lato massimo 720 × 1280 e `faststart`, mantenendo audio e sequenza. Totale circa 12,2 MB, caricati soltanto quando si avvia un Reel. Nessuna richiesta a Instagram o YouTube per mostrare le copertine. Per Speed Trasporti le copertine sono fotogrammi del video (animazione a 9 secondi, logistica a 2 secondi), al posto delle anteprime iniziali a tinta unita. I post originali sono sempre collegati, senza parametri di tracciamento.

La risposta pubblica dell’embed di Centro Benessere Life segnala `copyright_blocked: true` e non rende disponibile il video. Il sito mostra quindi un collegamento esplicito a Instagram, senza un player destinato a fallire né tentativi di aggirare il blocco. Per riprodurlo localmente in futuro occorre un file utilizzabile sul sito fornito dall’agenzia.

## SEO e prestazioni

La configurazione è in `src/app/core/service-media.ts`, caricata insieme alle pagine del catalogo. La Home e la navigazione iniziale non importano i dati dei nuovi media. Le nuove anteprime sostituiscono le illustrazioni soltanto nei servizi con materiale pertinente.

- Titoli, canonical, H1 e breadcrumb del catalogo sono conservati.
- Titoli, descrizioni, immagini e link dei lavori sono presenti nel markup reso dal server.
- Immagini con dimensioni esplicite, `srcset` per le foto e i film orizzontali, lazy loading sotto la hero e priorità alta solo per l’immagine iniziale.
- Anteprime Open Graph specifiche nelle pagine arricchite.
- `ImageObject` per le fotografie e `VideoObject` con copertine locali, date verificate, durata e indirizzo dell’embed o del file. Il Reel disponibile solo tramite collegamento è escluso da `VideoObject`.
- Cinque immagini aggiunte alla voce della fotografia immobiliare nella sitemap, con l’estensione `image:image`.

Riferimenti: [immagini in Google Search](https://developers.google.com/search/docs/appearance/google-images), [sitemap immagini](https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps), [metadati video](https://developers.google.com/search/docs/appearance/structured-data/video). Queste sono pagine di servizi con esempi multimediali; i dati strutturati non garantiscono risultati avanzati o l’indicizzazione come pagine dedicate alla visione di un video.

## Verifiche

Controlli effettuati senza build o commit: template e tipi con `ngc --noEmit`, SCSS compilati in memoria, catalogo e sitemap, test Angular eseguiti direttamente con Vitest. Sul server locale già aperto: layout a 1440, 768, 390 e 320 pixel, immagini caricate, canonical e H1, assenza di richieste video prima del clic, riproduzione locale effettiva, consenso YouTube, lightbox con tastiera e ritorno del focus. Nessun deploy eseguito.
