import { emailPhotos } from './email-photos.generated';
import type { ServicePhoto } from './service-media';
import { siteConfig, type CaseStudyMetric } from './site.config';

interface PortfolioCaseStudy {
  readonly slug: string;
  readonly client: string;
  readonly title: string;
  readonly summary: string;
  readonly paragraphs: readonly string[];
  readonly tags: readonly string[];
  readonly stats: readonly CaseStudyMetric[];
  readonly coverUrl?: string;
  readonly coverPhoto?: ServicePhoto;
  readonly gallery?: readonly ServicePhoto[];
  readonly url: string;
  readonly linkLabel: string;
  readonly testimonial?: boolean;
}

// Editorial summaries of the six Pages documents supplied in 05_Portfolio.
// Existing content-specific metrics are retained; new cases do not invent results.
export const portfolioCaseStudies: readonly PortfolioCaseStudy[] = [
  {
    ...siteConfig.portfolio[0],
    title: 'La logistica, raccontata dalle persone.',
    summary:
      'Per Speed Trasporti abbiamo costruito una strategia di comunicazione B2B che mette al centro competenza, flotta e persone.',
    paragraphs: [
      'Il lavoro parte dal posizionamento del brand e da un tono di voce diretto e professionale. Il piano editoriale alterna contenuti informativi, consulenza tecnica e racconti del lavoro quotidiano.',
      'I video verticali rendono accessibili anche gli argomenti più tecnici, come il funzionamento del retarder. La produzione comprende inoltre la direzione creativa e la copertura degli eventi di settore.',
    ],
    tags: ['Strategia B2B', 'Social media', 'Video', 'Eventi'],
    url: siteConfig.portfolio[0].instagramPostUrl,
    linkLabel: 'Guarda il contenuto sul retarder',
  },
  {
    ...siteConfig.portfolio[1],
    paragraphs: [],
    url: siteConfig.portfolio[1].instagramPostUrl,
    linkLabel: 'Guarda il progetto',
  },
  {
    ...siteConfig.portfolio[2],
    title: 'Il gusto ha una voce.',
    summary:
      'Per Il Forte 2.0, a Gavi, abbiamo sviluppato una comunicazione che unisce cucina, persone e atmosfera del locale.',
    paragraphs: [
      'Strategia social, scrittura e produzione video accompagnano il racconto del ristorante: dietro le quinte in cucina, interazioni con lo staff, ingredienti e tecniche di preparazione.',
      'Il piano editoriale per Instagram e Facebook alterna contenuti sul prodotto, intrattenimento e promozione di eventi e menu stagionali, con un tono professionale ma vicino alle persone.',
    ],
    tags: ['Food & Beverage', 'Social media', 'Video', 'Copywriting'],
    coverPhoto: emailPhotos.food[4],
    url: siteConfig.portfolio[2].instagramPostUrl,
    linkLabel: 'Guarda il contenuto social',
  },
  {
    slug: 'master',
    client: 'Master Pinerolo',
    title: 'Il locale, dentro e fuori dal feed.',
    summary:
      'Una presenza digitale coordinata per raccontare la mixology, il food e gli spazi di Master a Pinerolo.',
    paragraphs: [
      'Shooting fotografici e riprese in location valorizzano cocktail, proposte food e atmosfera. Dalla direzione artistica al montaggio dei Reel, seguiamo la produzione dei contenuti e la loro identità visiva.',
      'Alla gestione dei canali social affianchiamo campagne Meta geolocalizzate dedicate ai servizi del locale e alle sale per feste private ed eventi, con contatti tramite messaggi e chiamate.',
    ],
    tags: ['Fotografia', 'Reel', 'Social media', 'Meta Ads'],
    stats: [],
    coverPhoto: emailPhotos.food[3],
    url: 'https://www.instagram.com/__master__pinerolo/',
    linkLabel: 'Scopri Master su Instagram',
  },
  {
    slug: 'rare',
    client: 'RARE',
    title: 'La nascita di un brand.',
    summary:
      'Dall’idea iniziale all’identità completa di un servizio privato di noleggio di abiti di lusso in Piemonte.',
    paragraphs: [
      'Abbiamo progettato il logo, il monogramma e una palette di toni nude e rosati, costruendo un linguaggio visivo coerente sul sito, sui social e sui materiali del brand.',
      'La strategia comprende analisi del mercato, piano editoriale e produzione di Reel, caroselli e testi. Il sito presenta il catalogo degli abiti e accompagna la richiesta di una consulenza tramite WhatsApp.',
    ],
    tags: ['Logo', 'Brand identity', 'Social media', 'Sito web'],
    stats: [],
    coverPhoto: emailPhotos.logos[1],
    url: 'https://youarerare.it/',
    linkLabel: 'Visita il sito di RARE',
  },
  {
    slug: 'treccagas',
    client: 'TreccaGas',
    title: 'L’energia spiegata con semplicità.',
    summary:
      'Una strategia di comunicazione per TreccaGas, punto vendita Edison e realtà specializzata in soluzioni energetiche a Pinerolo.',
    paragraphs: [
      'Il piano editoriale per Facebook e Instagram traduce riscaldamento, climatizzazione, rinnovabili e servizi per la casa in contenuti comprensibili. Nei video è il volto dell’azienda a parlare, con un registro diretto e quotidiano.',
      'Il progetto comprende ideazione, script e montaggio dei Reel, contenuti per la ricerca di personale e campagne pubblicitarie geolocalizzate per generare contatti sul territorio.',
    ],
    tags: ['Strategia social', 'Video', 'Branding', 'Lead generation'],
    stats: [],
    coverPhoto: emailPhotos.trecca[0],
    gallery: emailPhotos.trecca.slice(1),
    url: 'https://www.instagram.com/treccagas/',
    linkLabel: 'Scopri TreccaGas su Instagram',
  },
  {
    slug: 'alessio-vainella',
    client: 'Dott. Alessio Vainella · Shibumi Med',
    title: 'Una comunicazione responsabile.',
    summary:
      'Per il Dott. Alessio Vainella e Shibumi Med a Torino abbiamo sviluppato una strategia digitale centrata su autorevolezza, chiarezza e trasparenza.',
    paragraphs: [
      'Il progetto parte dal posizionamento e dal tono di voce, con un piano editoriale che rende accessibili i temi della medicina estetica e dà spazio alle domande e alle aspettative delle persone.',
      'Gestione di Instagram e Facebook, copywriting, infografiche e video verticali lavorano insieme. Seguiamo la scrittura e la direzione dei contenuti, mantenendo il professionista al centro del racconto.',
    ],
    tags: ['Brand positioning', 'Social media', 'Video', 'Content strategy'],
    stats: [],
    coverPhoto: emailPhotos.corporate[2],
    url: 'https://www.instagram.com/openthedoc/',
    linkLabel: 'Scopri il progetto su Instagram',
    testimonial: true,
  },
];
