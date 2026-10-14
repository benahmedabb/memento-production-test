import { emailPhotos } from './email-photos.generated';
import { photoSource, photoSrcset, type ServicePhoto } from './service-photo';
import { siteConfig, type CaseStudyMetric } from './site.config';

interface PortfolioCover {
  readonly src: string;
  readonly srcset?: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
}

interface PortfolioResults {
  readonly context: string;
  readonly source: { readonly label: string; readonly document: string; readonly section: string };
  readonly period?: string;
  readonly metrics: readonly CaseStudyMetric[];
}

interface PortfolioCaseStudy {
  readonly slug: string;
  readonly client: string;
  readonly title: string;
  readonly summary: string;
  readonly paragraphs: readonly string[];
  readonly tags: readonly string[];
  readonly sector: string;
  readonly location: string;
  readonly mediaCaption: string;
  readonly tone: 'sage' | 'sand' | 'rose' | 'ink';
  readonly results?: PortfolioResults;
  readonly coverUrl?: string;
  readonly coverPhoto?: ServicePhoto;
  readonly coverImage?: PortfolioCover;
  readonly coverPosition?: string;
  readonly featuredOnHome?: boolean;
  readonly gallery?: readonly ServicePhoto[];
  readonly url: string;
  readonly linkLabel: string;
  readonly testimonial?: boolean;
}

// Editorial summaries of the six Pages documents supplied in 05_Portfolio.
// Results must have an explicit source and context. Never inherit legacy stats
// from siteConfig: those values have not been reconciled with the supplied files.
export const portfolioCaseStudies: readonly PortfolioCaseStudy[] = [
  {
    slug: 'speed-trasporti',
    client: 'Speed Trasporti',
    sector: 'Logistica & trasporti',
    location: 'Torino',
    mediaCaption: 'Il team Speed Trasporti durante Transpotec Logitec.',
    tone: 'sage',
    title: 'La logistica, raccontata dalle persone.',
    summary:
      'Per Speed Trasporti abbiamo costruito una strategia di comunicazione B2B che mette al centro competenza, flotta e persone.',
    paragraphs: [
      'Il lavoro parte dal posizionamento del brand e da un tono di voce diretto e professionale. Il piano editoriale alterna contenuti informativi, consulenza tecnica e racconti del lavoro quotidiano.',
      'I video verticali rendono accessibili anche gli argomenti più tecnici, come il funzionamento del retarder. La produzione comprende inoltre la direzione creativa e la copertura degli eventi di settore.',
    ],
    tags: ['Strategia B2B', 'Social media', 'Video', 'Eventi'],
    coverImage: {
      src: '/images/servizi/speed-trasporti-transpotec.webp',
      alt: 'Il team di Speed Trasporti allo stand Transpotec Logitec a Milano',
      width: 640,
      height: 1138,
    },
    coverPosition: '50% 45%',
    featuredOnHome: true,
    results: {
      context: 'Il video sul retarder',
      source: {
        label: 'Case study Speed Trasporti',
        document: 'SPEED.pages',
        section: 'Video Marketing e Successi Virali Organici',
      },
      metrics: [
        { value: 400, suffix: 'K+', decimals: 0, label: 'visualizzazioni organiche', displayValue: '400K+' },
        { value: 1, suffix: 'K+', decimals: 0, label: 'nuovi follower', displayValue: '1K+' },
      ],
    },
    url: siteConfig.portfolio[0].instagramPostUrl,
    linkLabel: 'Guarda il contenuto sul retarder',
  },
  {
    slug: 'il-forte',
    client: 'Il Forte 2.0',
    sector: 'Ristorazione',
    location: 'Gavi',
    mediaCaption: 'La cucina de Il Forte 2.0, raccontata da vicino.',
    tone: 'sand',
    title: 'Il gusto ha una voce.',
    summary:
      'Per Il Forte 2.0, a Gavi, abbiamo sviluppato una comunicazione che unisce cucina, persone e atmosfera del locale.',
    paragraphs: [
      'Strategia social, scrittura e produzione video accompagnano il racconto del ristorante: dietro le quinte in cucina, interazioni con lo staff, ingredienti e tecniche di preparazione.',
      'Il piano editoriale per Instagram e Facebook alterna contenuti sul prodotto, intrattenimento e promozione di eventi e menu stagionali, con un tono professionale ma vicino alle persone.',
    ],
    tags: ['Food & Beverage', 'Social media', 'Video', 'Copywriting'],
    coverPhoto: emailPhotos.food[4],
    featuredOnHome: true,
    results: {
      context: 'Il racconto delle persone del locale',
      source: {
        label: 'Case study Il Forte 2.0',
        document: 'Senza nome.pages',
        section: 'Risultati Chiave e Metriche di Successo',
      },
      metrics: [
        { value: 100, suffix: 'K+', decimals: 0, label: 'visualizzazioni organiche', displayValue: '100K+' },
      ],
    },
    url: siteConfig.portfolio[2].instagramPostUrl,
    linkLabel: 'Guarda il contenuto social',
  },
  {
    slug: 'master',
    client: 'Master Pinerolo',
    sector: 'Food & nightlife',
    location: 'Pinerolo',
    mediaCaption: 'Mixology, atmosfera e materiali coordinati per Master.',
    tone: 'ink',
    title: 'Il locale, dentro e fuori dal feed.',
    summary:
      'Una presenza digitale coordinata per raccontare la mixology, il food e gli spazi di Master a Pinerolo.',
    paragraphs: [
      'Shooting fotografici e riprese in location valorizzano cocktail, proposte food e atmosfera. Dalla direzione artistica al montaggio dei Reel, seguiamo la produzione dei contenuti e la loro identità visiva.',
      'Alla gestione dei canali social affianchiamo campagne Meta geolocalizzate dedicate ai servizi del locale e alle sale per feste private ed eventi, con contatti tramite messaggi e chiamate.',
    ],
    tags: ['Fotografia', 'Reel', 'Social media', 'Meta Ads'],
    coverPhoto: emailPhotos.food[3],
    coverPosition: '50% 55%',
    featuredOnHome: true,
    url: 'https://www.instagram.com/__master__pinerolo/',
    linkLabel: 'Scopri Master su Instagram',
  },
  {
    slug: 'rare',
    client: 'RARE',
    sector: 'Moda & lifestyle',
    location: 'Piemonte',
    mediaCaption: 'Dal monogramma alle applicazioni: l’identità di RARE.',
    tone: 'rose',
    title: 'La nascita di un brand.',
    summary:
      'Dall’idea iniziale all’identità completa di un servizio privato di noleggio di abiti di lusso in Piemonte.',
    paragraphs: [
      'Abbiamo progettato il logo, il monogramma e una palette di toni nude e rosati, costruendo un linguaggio visivo coerente sul sito, sui social e sui materiali del brand.',
      'La strategia comprende analisi del mercato, piano editoriale e produzione di Reel, caroselli e testi. Il sito presenta il catalogo degli abiti e accompagna la richiesta di una consulenza tramite WhatsApp.',
    ],
    tags: ['Logo', 'Brand identity', 'Social media', 'Sito web'],
    coverPhoto: emailPhotos.logos[1],
    featuredOnHome: true,
    gallery: [emailPhotos.logos[0], emailPhotos.logos[2]],
    url: 'https://youarerare.it/',
    linkLabel: 'Visita il sito di RARE',
  },
  {
    slug: 'treccagas',
    client: 'TreccaGas',
    sector: 'Energia & servizi',
    location: 'Pinerolo',
    mediaCaption: 'Un volto riconoscibile per parlare di energia e servizi.',
    tone: 'sand',
    title: 'L’energia spiegata con semplicità.',
    summary:
      'Una strategia di comunicazione per TreccaGas, punto vendita Edison e realtà specializzata in soluzioni energetiche a Pinerolo.',
    paragraphs: [
      'Il piano editoriale per Facebook e Instagram traduce riscaldamento, climatizzazione, rinnovabili e servizi per la casa in contenuti comprensibili. Nei video è il volto dell’azienda a parlare, con un registro diretto e quotidiano.',
      'Il progetto comprende ideazione, script e montaggio dei Reel, contenuti per la ricerca di personale e campagne pubblicitarie geolocalizzate per generare contatti sul territorio.',
    ],
    tags: ['Strategia social', 'Video', 'Branding', 'Lead generation'],
    coverPhoto: emailPhotos.trecca[0],
    coverPosition: '50% 25%',
    featuredOnHome: true,
    gallery: emailPhotos.trecca.slice(1),
    url: 'https://www.instagram.com/treccagas/',
    linkLabel: 'Scopri TreccaGas su Instagram',
  },
  {
    slug: 'alessio-vainella',
    client: 'Dott. Alessio Vainella · Shibumi Med',
    sector: 'Medicina estetica',
    location: 'Torino',
    mediaCaption: 'Alessio Vainella, nel suo ambiente a Shibumi Med.',
    tone: 'sage',
    title: 'Una comunicazione responsabile.',
    summary:
      'Per il Dott. Alessio Vainella e Shibumi Med a Torino abbiamo sviluppato una strategia digitale centrata su autorevolezza, chiarezza e trasparenza.',
    paragraphs: [
      'Il progetto parte dal posizionamento e dal tono di voce, con un piano editoriale che rende accessibili i temi della medicina estetica e dà spazio alle domande e alle aspettative delle persone.',
      'Gestione di Instagram e Facebook, copywriting, infografiche e video verticali lavorano insieme. Seguiamo la scrittura e la direzione dei contenuti, mantenendo il professionista al centro del racconto.',
    ],
    tags: ['Brand positioning', 'Social media', 'Video', 'Content strategy'],
    coverPhoto: emailPhotos.corporate[2],
    featuredOnHome: true,
    url: 'https://www.instagram.com/openthedoc/',
    linkLabel: 'Scopri il progetto su Instagram',
    testimonial: true,
  },
  {
    slug: 'dora-events',
    client: 'Dora Events',
    sector: 'Eventi & automotive',
    location: 'Dora Motor’s Experience',
    mediaCaption: 'Il progetto video per Dora Motor’s Experience.',
    tone: 'ink',
    title: 'L’evento comincia dal racconto.',
    summary: siteConfig.portfolio[1].summary,
    paragraphs: [],
    tags: ['Eventi', 'Video promozionale'],
    coverUrl: siteConfig.portfolio[1].coverUrl,
    url: siteConfig.portfolio[1].instagramPostUrl,
    linkLabel: 'Guarda il video dell’evento',
  },
];

// Home and portfolio share the same editorial content and cover images.
export const homeCaseStudies = portfolioCaseStudies.filter((project) => project.featuredOnHome);

export function portfolioCover(project: PortfolioCaseStudy): PortfolioCover {
  if (project.coverImage) return project.coverImage;

  if (project.coverPhoto) {
    return {
      src: photoSource(project.coverPhoto),
      srcset: photoSrcset(project.coverPhoto),
      alt: project.coverPhoto.alt,
      width: project.coverPhoto.width,
      height: project.coverPhoto.height,
    };
  }

  return {
    src: project.coverUrl!,
    alt: `Copertina del progetto ${project.title} per ${project.client}`,
    width: 1200,
    height: 675,
  };
}
