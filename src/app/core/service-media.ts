import { clientTestimonial } from './client-testimonial';
import { siteConfig } from './site.config';
import { emailPhotos } from './email-photos.generated';
import { photoSource, type ServicePhoto } from './service-photo';

export { photoSource, photoSrcset, type ServicePhoto } from './service-photo';

export interface ServiceFilm {
  readonly id: string;
  readonly provider: 'youtube' | 'local' | 'instagram';
  readonly title: string;
  readonly client: string;
  readonly description: string;
  readonly poster: string;
  readonly posterSrcset?: string;
  readonly width: number;
  readonly height: number;
  readonly watchUrl: string;
  readonly source?: string;
  readonly embedUrl?: string;
  readonly uploadDate?: string;
  readonly duration?: string;
  readonly durationLabel?: string;
  readonly mediaLabel?: 'Reel' | 'Post';
}

export interface FilmSelection {
  readonly id: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly format: 'landscape' | 'portrait' | 'post';
  readonly films: readonly ServiceFilm[];
  readonly more?: { readonly path: string; readonly label: string };
}

export interface PhotoSelection {
  readonly eyebrow: string;
  readonly credit: string;
  readonly title: string;
  readonly description: string;
  readonly photos: readonly ServicePhoto[];
  readonly hero?: ServicePhoto;
  readonly layout?: 'comparison';
  readonly more?: { readonly path: string; readonly label: string };
}

export interface ServiceMedia {
  readonly photography?: PhotoSelection;
  readonly films: readonly FilmSelection[];
}

const imageRoot = '/images/servizi/';

// Selection from the six properties supplied by the agency. Source file IDs are documented in docs/service-media.md.
export const propertyPhotos: readonly ServicePhoto[] = [
  {
    slug: 'soggiorno-villa-cantalupa',
    title: 'La luce negli spazi',
    location: 'Soggiorno · Cantalupa',
    alt: 'Soggiorno di una villa a Cantalupa, con divano bianco, ampie vetrate e lampadario circolare',
    width: 1920,
    height: 1280,
  },
  {
    slug: 'cucina-appartamento-pinerolo',
    title: 'Gli ambienti di ogni giorno',
    location: 'Cucina · Pinerolo',
    alt: 'Cucina contemporanea di un appartamento a Pinerolo, con penisola chiara e pavimento in legno',
    width: 1920,
    height: 1280,
  },
  {
    slug: 'camera-villa-cantalupa',
    title: 'Il carattere degli interni',
    location: 'Camera da letto · Cantalupa',
    alt: 'Camera da letto luminosa in una villa a Cantalupa, con letto bianco e pavimento in parquet',
    width: 1920,
    height: 1280,
  },
  {
    slug: 'esterno-villa-cumiana',
    title: 'L’architettura, da fuori',
    location: 'Esterno · Cumiana',
    alt: 'Esterno di una villa a Cumiana, con facciata chiara, tetto in legno e vialetto in pietra',
    width: 1920,
    height: 1280,
  },
  {
    slug: 'drone-villa-piscina',
    title: 'Una prospettiva più ampia',
    location: 'Ripresa con drone · Piscina',
    alt: 'Fotografia aerea con drone di una villa a Piscina e del suo giardino nel contesto residenziale',
    width: 1920,
    height: 1280,
  },
];

function youtube(
  id: string,
  slug: string,
  title: string,
  client: string,
  description: string,
  uploadDate: string,
  seconds: number,
): ServiceFilm {
  return {
    id,
    provider: 'youtube',
    title,
    client,
    description,
    poster: `${imageRoot}${slug}-1280.webp`,
    posterSrcset: `${imageRoot}${slug}-640.webp 640w, ${imageRoot}${slug}-1280.webp 1280w`,
    width: 1280,
    height: 720,
    watchUrl: `https://www.youtube.com/watch?v=${id}`,
    uploadDate,
    duration: `PT${seconds}S`,
    durationLabel: `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`,
  };
}

// Dates, durations and embeddability checked against YouTube's public player metadata.
export const corporateFilms = [
  youtube(
    'XiSIUwAxMhA',
    'memento-spot-aziendale',
    'Spot pubblicitario di Memento Production',
    'Memento Production',
    'Uno spot aziendale che racconta il metodo, le competenze e la produzione coordinata da Memento Production.',
    '2026-10-11T03:17:46-07:00',
    96,
  ),
  youtube(
    'Ude7C8Ae4Us',
    'terravision-video-aziendale',
    'Terravision, corporate presentation',
    'Terravision',
    'Il video di presentazione aziendale di Terravision, realizzato da Memento Production.',
    '2026-01-18T10:39:59-08:00',
    160,
  ),
  youtube(
    'XV3brJ2u3zg',
    'racconto-aziendale',
    'Un racconto aziendale',
    'Produzione Memento',
    'Un esempio di racconto aziendale realizzato da Memento Production, con le persone al centro delle immagini.',
    '2026-03-23T05:59:36-07:00',
    62,
  ),
  youtube(
    '_UV66vGu1Xs',
    'villaggio-salute-video',
    'Villaggio Salute 2025',
    'Villaggio Salute',
    'Il racconto video di Villaggio Salute 2025, realizzato da Memento Production.',
    '2026-10-07T09:57:24-07:00',
    72,
  ),
] as const;

export const propertyFilms = [
  youtube(
    '_iw7KThOjP8',
    'villa-cantalupa-video',
    'Una villa a Cantalupa',
    'Video immobiliare',
    'Il video di una villa a Cantalupa: un esempio di come raccontiamo gli immobili attraverso le immagini in movimento.',
    '2026-02-12T08:21:47-08:00',
    104,
  ),
  youtube(
    '0unB4I4tnFo',
    'villa-frossasco-video',
    'Una villa a Frossasco',
    'Video immobiliare',
    'Un video immobiliare dedicato a una villa a Frossasco, realizzato da Memento Production.',
    '2026-02-12T08:18:59-08:00',
    49,
  ),
  youtube(
    'pyai3WjaXAE',
    'villa-riva-pinerolo-video',
    'Oasi di relax a Riva di Pinerolo',
    'Video immobiliare',
    'Il racconto video di una proprietà a Riva di Pinerolo, realizzato da Memento Production.',
    '2026-02-12T08:27:10-08:00',
    85,
  ),
  youtube(
    'IG-Wl8tMakg',
    'villa-cumiana-video',
    'Gli esterni di una villa a Cumiana',
    'Video immobiliare',
    'Un film dedicato agli esterni di una villa a Cumiana, realizzato da Memento Production.',
    '2026-02-12T08:44:46-08:00',
    39,
  ),
] as const;

function localReel(
  id: string,
  slug: string,
  title: string,
  client: string,
  description: string,
  uploadDate: string,
  seconds: number,
): ServiceFilm {
  return {
    id,
    provider: 'local',
    title,
    client,
    description,
    poster: `${imageRoot}${slug}.webp`,
    width: 640,
    height: id === 'DZaBhL4oxDw' ? 1136 : 1138,
    watchUrl: `https://www.instagram.com/reel/${id}/`,
    source: `/videos/servizi/${slug}.mp4`,
    uploadDate,
    duration: `PT${seconds}S`,
    durationLabel: `${Math.floor(Math.round(seconds) / 60)}:${String(Math.round(seconds) % 60).padStart(2, '0')}`,
  };
}

function instagram(
  id: string,
  slug: string,
  title: string,
  client: string,
  description: string,
  kind: 'reel' | 'p' = 'reel',
  height = 1138,
): ServiceFilm {
  return {
    id,
    provider: 'instagram',
    title,
    client,
    description,
    poster: `${imageRoot}${slug}.webp`,
    width: 640,
    height,
    watchUrl: `https://www.instagram.com/${kind}/${id}/`,
    embedUrl: `https://www.instagram.com/${kind}/${id}/embed`,
    mediaLabel: kind === 'p' ? 'Post' : 'Reel',
  };
}

export const arabianFilm = localReel(
  'DZaBhL4oxDw',
  'arabian-luxury-beauty',
  'Il benessere si racconta',
  'Arabian Luxury Beauty',
  'Un Reel di presentazione di Arabian Luxury Beauty, centro estetico e benessere a Torino.',
  '2026-06-10',
  59.866,
);

const lifeFilm = instagram(
  'DbYnt8pAvgN',
  'centro-benessere-life',
  'Ogni esigenza, il suo trattamento',
  'Centro Benessere Life',
  'Un contenuto verticale dedicato ai trattamenti e ai servizi del centro benessere.',
);

const speedAnimationFilm = localReel(
  'DclvAv2oB-b',
  'speed-trasporti-animazione',
  'La cura viaggia con la merce',
  'Speed Trasporti · Animazione',
  'Un Reel animato di Speed Trasporti dedicato all’attenzione nel trasporto delle merci delicate.',
  '2026-08-28',
  17.625,
);

export const socialFilms = [
  instagram(
    'DeRwMGWNtjl',
    'memento-comunicazione-online',
    'Online, ogni dettaglio parla di te',
    'Memento Production',
    'Un Reel che mostra come sito, social e presenza su Google costruiscono insieme la percezione di un’attività.',
  ),
  arabianFilm,
  instagram(
    'DeHKHpGOB6k',
    'villa-dora-social-reel',
    'Il ritmo di Villa Dora',
    'Villa Dora Country House',
    'Un racconto verticale dedicato alla dimora, al parco e all’atmosfera di Villa Dora.',
  ),
  instagram(
    'DYpW7bmok7i',
    'speed-trasporti-transpotec',
    'Speed Trasporti a Transpotec',
    'Speed Trasporti',
    'La presenza dell’azienda a Transpotec Logitec 2026 raccontata con un Reel dinamico.',
  ),
] as const;

const organicPosts = [
  instagram(
    'DYChtsyCHHa',
    'master-colazione-post',
    'La colazione ha un nuovo sapore',
    'Master · Pinerolo',
    'Un contenuto statico che presenta la proposta colazione attraverso prodotto, fotografia e identità visiva.',
    'p',
    800,
  ),
  instagram(
    'Dd9VKaFuTpr',
    'rare-sito-online-post',
    'Il sito di Rare è online',
    'Rare',
    'Un post di lancio costruito per annunciare il nuovo sito e portare il pubblico al catalogo online.',
    'p',
    791,
  ),
  instagram(
    'DYFJQDGCMYM',
    'treccagas-sanificazione-post',
    'Aria più pulita, più comfort',
    'Treccagas',
    'Un contenuto informativo sulla manutenzione e la sanificazione del climatizzatore.',
    'p',
    854,
  ),
] as const;

const facebookInstagramFilms = [
  instagram(
    'DZM8gj2MkGp',
    'shibumi-med-laser',
    'Tecnologia e diagnosi per la pelle',
    'OpenTheDoc · Shibumi Med',
    'Un Reel informativo sui trattamenti laser e sul valore di una valutazione corretta.',
  ),
  instagram(
    'DW3vu8QCCDP',
    'speed-trasporti-sicurezza',
    'La sicurezza inizia prima di partire',
    'Speed Trasporti',
    'Controlli, fissaggio e verifica del carico raccontano la cura che precede ogni viaggio.',
  ),
  lifeFilm,
  instagram(
    'DZaCO9XisMH',
    'il-forte-colazione',
    'Il Forte 2.0, una nuova avventura',
    'Il Forte 2.0',
    'Un Reel di apertura che presenta l’identità e la proposta del locale di Novi.',
  ),
  instagram(
    'DdrKkv-ooXj',
    'elle-hair-salon',
    'Capelli spenti e sfibrati?',
    'Elle Hair Salon',
    'Un contenuto dedicato al trattamento professionale per ricostruire il capello in profondità.',
    'reel',
    1136,
  ),
] as const;

const tiktokFilms = [
  instagram(
    'DZcxLn8I5ob',
    'master-fan-numero-uno',
    'Fan numero uno',
    'Master · Pinerolo',
    'Un format breve e immediato, costruito sul tono spontaneo tipico dei contenuti TikTok.',
  ),
  instagram(
    'DbIieY2OB0T',
    'openthedoc-segno',
    'Se aspettavi un segno',
    'OpenTheDoc',
    'Un contenuto rapido con apertura forte e invito diretto alla consulenza.',
  ),
  instagram(
    'DZpfif-iH43',
    'arabian-beauty-tiktok',
    'Dietro le quinte, con ironia',
    'Arabian Luxury Beauty',
    'Un format leggero che usa ironia e quotidianità per rendere il brand più vicino.',
    'reel',
    1136,
  ),
  instagram(
    'Dc1MuGngxo8',
    'centro-benessere-life-manicure',
    'La risposta era ovvia',
    'Centro Benessere Life',
    'Un Reel breve dedicato alla manicure, pensato per intrattenere e portare alla prenotazione.',
  ),
] as const;

const reelSocialFilms = [
  instagram(
    'DeKJARKAFLL',
    'master-barman',
    'Le persone dietro al servizio',
    'Master · Pinerolo',
    'Un format a domanda e risposta che presenta lo staff e il lavoro dietro al servizio.',
  ),
  instagram(
    'DeKEPzyKGG1',
    'pasticceria-primavera-frutta',
    'La frutta realistica',
    'Pasticceria Primavera',
    'Un Reel di prodotto dedicato alla frutta realistica e alla frutta martorana.',
    'reel',
    1136,
  ),
  instagram(
    'DaQNNjHNoQm',
    'kristal-bottega-colori',
    'Oltre quarant’anni di storia',
    'Kristal Immobiliare',
    'Un’attività storica raccontata per presentare una nuova opportunità commerciale.',
  ),
  instagram(
    'DbF9dADtz7F',
    'memento-crescita-social',
    'Tre mosse per crescere sui social',
    'Memento Production',
    'Un contenuto educational su costanza, sperimentazione e strategia editoriale.',
  ),
  instagram(
    'DRNbwVzDCcW',
    'delias-farina',
    'La nostra farina',
    'Delia’s · Pinerolo',
    'Uno storytelling ironico che trasforma una materia prima in un tratto riconoscibile del locale.',
  ),
] as const;

const animatedFilms = [
  speedAnimationFilm,
  instagram(
    'Dcd2pQio8tm',
    'speed-trasporti-certificazione',
    'Concretizza su strada',
    'Speed Trasporti',
    'Un contenuto grafico dedicato alla certificazione CERT-ERN e ai valori di sicurezza e affidabilità.',
  ),
  instagram(
    'DaLPZuuCZLn',
    'arabian-radiofrequenza',
    'Dentro la radiofrequenza viso',
    'Arabian Luxury Beauty',
    'Un Reel che unisce trattamento, spiegazione e grafica per raccontare la radiofrequenza viso.',
  ),
  instagram(
    'Da5nqqLIYd2',
    'speed-trasporti-storia',
    'Dal 1998, in movimento',
    'Speed Trasporti',
    'Un racconto animato dell’azienda, della flotta e delle soluzioni logistiche in Italia e in Europa.',
  ),
] as const;

const courseAndTestimonialFilms = [
  instagram(
    'DdLuO9SDVNk',
    'trainmeup-roberto-testimonial',
    'Il percorso di Roberto',
    'TrainMeUP',
    'Una testimonianza personale sul valore di un percorso seguito, ascoltato e costruito sulle proprie esigenze.',
  ),
  instagram(
    'DeKHUT-oAjJ',
    'elle-hair-testimonial',
    'La parola a una cliente',
    'Elle Hair Salon',
    'Un’esperienza raccontata in prima persona per mostrare il lavoro e l’accoglienza del salone.',
    'reel',
    1136,
  ),
  instagram(
    'DWBopgQjMuW',
    'shibumi-rimozione-tatuaggio',
    'Quando un tatuaggio non ti rappresenta più',
    'OpenTheDoc · Shibumi Med',
    'Un contenuto informativo sulla rimozione laser dei tatuaggi e sul percorso di trattamento.',
  ),
  instagram(
    'DdbLAvwlCTx',
    'trainmeup-team-testimonial',
    'Dentro il team TrainMeUP',
    'TrainMeUP',
    'Personal trainer e nutrizionista raccontano il lavoro quotidiano con i clienti del centro.',
  ),
] as const;

const testimonial: ServiceFilm = {
  id: clientTestimonial.videoId,
  provider: 'youtube',
  title: clientTestimonial.title,
  client: clientTestimonial.client,
  description: clientTestimonial.description,
  poster: clientTestimonial.thumbnail,
  width: clientTestimonial.thumbnailWidth,
  height: clientTestimonial.thumbnailHeight,
  watchUrl: clientTestimonial.watchUrl,
  uploadDate: clientTestimonial.uploadDate,
  duration: clientTestimonial.duration,
  durationLabel: clientTestimonial.durationLabel,
};

const photography: PhotoSelection = {
  eyebrow: 'Fotografia immobiliare',
  credit: 'Fotografie di Memento Production',
  title: 'Prima della visita, uno sguardo.',
  description:
    'Architettura, luce e contesto. Nuovi scatti di interni ed esterni, insieme alla selezione realizzata per Professionecasa.',
  photos: [...emailPhotos.property, ...propertyPhotos],
};
const corporate: FilmSelection = {
  id: 'film-aziendali',
  eyebrow: 'Produzioni aziendali',
  title: 'Le storie hanno un volto.',
  description:
    'Spot, presentazioni, persone ed eventi. Quattro produzioni per vedere come un’identità prende forma in video.',
  format: 'landscape',
  films: corporateFilms,
};
const properties: FilmSelection = {
  id: 'video-immobiliari',
  eyebrow: 'Immobili in movimento',
  title: 'Entrare, prima di esserci.',
  description:
    'Quattro produzioni immobiliari tra Cantalupa, Frossasco, Riva di Pinerolo e Cumiana. Un altro modo di raccontare spazi e contesto.',
  format: 'landscape',
  films: propertyFilms,
};
const reels: FilmSelection = {
  id: 'reel-realizzati',
  eyebrow: 'Dal set al feed',
  title: 'Storie da guardare in verticale.',
  description:
    'Food, retail, immobiliare e strategia: cinque Reel costruiti sul linguaggio e sugli obiettivi di ogni brand.',
  format: 'portrait',
  films: reelSocialFilms,
};
const socialSelection: FilmSelection = {
  id: 'social-realizzati',
  eyebrow: 'Strategia e produzione',
  title: 'Il brand prende voce.',
  description:
    'Quattro esempi tra presenza online, benessere, hospitality ed eventi: contenuti diversi, un’identità chiara.',
  format: 'portrait',
  films: socialFilms,
};
const organicSelection: FilmSelection = {
  id: 'post-organici',
  eyebrow: 'Piano editoriale',
  title: 'Contenuti che lavorano insieme.',
  description:
    'Tre post statici pensati per informare, presentare un prodotto e accompagnare il pubblico verso un’azione concreta.',
  format: 'post',
  films: organicPosts,
};
const facebookInstagramSelection: FilmSelection = {
  id: 'facebook-instagram-realizzati',
  eyebrow: 'Formati Meta',
  title: 'Ogni brand, il suo racconto.',
  description:
    'Cinque produzioni per attività diverse: informazione, posizionamento, apertura e promozione dei servizi.',
  format: 'portrait',
  films: facebookInstagramFilms,
};
const tiktokSelection: FilmSelection = {
  id: 'tiktok-realizzati',
  eyebrow: 'Contenuti verticali',
  title: 'Veloci, riconoscibili, spontanei.',
  description:
    'Quattro esempi che usano ritmo, ironia e apertura immediata per parlare il linguaggio della piattaforma.',
  format: 'portrait',
  films: tiktokFilms,
};

const mediaByPath: Readonly<Record<string, ServiceMedia>> = {
  '/foto': {
    photography: {
      eyebrow: 'Fotografia / Memento Production',
      credit: 'Fotografie di Memento Production',
      title: 'Quattro modi di guardare.',
      photos: [
        emailPhotos.corporate[0],
        emailPhotos.food[0],
        emailPhotos.property[0],
        emailPhotos.product[0],
      ],
      description:
        'Persone, food, immobili e prodotti: una selezione dai nostri servizi fotografici. Ogni specializzazione ha la sua galleria.',
    },
    films: [],
  },
  '/foto/fotografia-immobiliare-torino': { photography, films: [properties] },
  '/foto/fotografia-corporate-torino': {
    photography: {
      eyebrow: 'Fotografia corporate',
      credit: 'Fotografie di Memento Production',
      title: 'Le persone fanno l’azienda.',
      description:
        'Ritratti professionali, team e ambienti di lavoro: immagini che danno un volto all’identità aziendale.',
      photos: emailPhotos.corporate,
    },
    films: [],
  },
  '/foto/food-photography-torino': {
    photography: {
      eyebrow: 'Food & Drinks',
      credit: 'Fotografie di Memento Production',
      title: 'Il gusto comincia dallo sguardo.',
      description:
        'Piatti, cocktail e momenti di convivialità. Fotografie che raccontano il prodotto e l’atmosfera del locale.',
      photos: emailPhotos.food,
    },
    films: [],
  },
  '/foto/product-photography-torino': {
    photography: {
      eyebrow: 'Fotografia di prodotto / Life',
      credit: 'Fotografie di Memento Production per Life',
      title: 'Ogni dettaglio conta.',
      description:
        'Una selezione di scatti dedicati ai prodotti Life: confezioni, texture, colori e composizioni.',
      photos: emailPhotos.product,
    },
    films: [],
  },
  '/grafica': {
    photography: {
      eyebrow: 'Grafica / Memento Production',
      credit: 'Progetti grafici di Memento Production',
      title: 'Un’identità prende forma.',
      description:
        'Dal nostro marchio ai progetti per RARE, Bioveil e Master: loghi, identità coordinate, packaging e materiali per la stampa.',
      photos: [
        emailPhotos.graphics[0],
        emailPhotos.logos[1],
        emailPhotos.brand[0],
        emailPhotos.offline[0],
      ],
    },
    films: [],
  },
  '/grafica/creazione-loghi-torino': {
    photography: {
      eyebrow: 'Creazione loghi / RARE',
      credit: 'Progetto grafico di Memento Production',
      title: 'Un segno riconoscibile.',
      description:
        'Il monogramma RARE e le sue applicazioni: dal logo alle confezioni e alle shopper.',
      photos: emailPhotos.logos,
    },
    films: [],
  },
  '/grafica/brand-identity-torino': {
    photography: {
      eyebrow: 'Brand identity / Bioveil',
      credit: 'Progetto grafico di Memento Production',
      title: 'La coerenza fa la differenza.',
      description:
        'Logotipo, palette e studi di packaging per Bioveil. Un linguaggio visivo che collega il marchio a ogni prodotto.',
      photos: emailPhotos.brand,
    },
    films: [],
  },
  '/grafica/grafica-stampa-torino': {
    photography: {
      eyebrow: 'Grafica offline',
      credit: 'Progetti grafici di Memento Production',
      title: 'Il progetto diventa materia.',
      description:
        'La copertina del menu Master e gli studi di etichette e packaging Bioveil: l’identità visiva fuori dallo schermo.',
      photos: emailPhotos.offline,
    },
    films: [],
  },
  '/grafica/rebranding-torino': {
    photography: {
      eyebrow: 'Rebranding / Master dei Cocktail',
      credit: 'Logo iniziale fornito dal cliente · Nuova identità di Memento Production',
      title: 'Dal primo segno alla nuova identità.',
      description:
        'Il confronto tra il logo di partenza e il marchio ridisegnato da Memento: tipografia essenziale e un calice integrato nella lettera T.',
      photos: emailPhotos.rebranding,
      hero: emailPhotos.rebranding[1],
      layout: 'comparison',
    },
    films: [],
  },
  '/video': {
    films: [
      corporate,
      properties,
      {
        ...reels,
        films: reelSocialFilms.slice(0, 3),
        more: { path: '/video/reel-social-torino', label: 'Tutti i Reel per i social' },
      },
    ],
  },
  '/video/video-aziendali-torino': { films: [corporate] },
  '/video/reel-social-torino': { films: [reels] },
  '/video/video-animati-torino': {
    films: [
      {
        id: 'animazione-realizzata',
        eyebrow: 'Un progetto animato',
        title: 'Un servizio diventa una storia.',
        description:
          'Quattro produzioni che uniscono riprese, identità visiva e grafica in movimento per rendere chiaro un servizio.',
        format: 'portrait',
        films: animatedFilms,
      },
    ],
  },
  '/video/video-corsi-testimonial-torino': {
    films: [
      {
        id: 'testimonianza-cliente',
        eyebrow: 'La parola al cliente',
        title: 'Un’esperienza, in prima persona.',
        description:
          'Il Dr. Alessio Vainella racconta il lavoro con Memento Production. La sua testimonianza resta in primo piano.',
        format: 'landscape',
        films: [testimonial],
        more: { path: '/recensioni', label: 'Leggi anche le recensioni' },
      },
      {
        id: 'corsi-testimonial-realizzati',
        eyebrow: 'Persone e percorsi',
        title: 'Esperienze che diventano racconto.',
        description:
          'Quattro esempi dedicati a percorsi, servizi e persone, costruiti per essere chiari e credibili nel feed.',
        format: 'portrait',
        films: courseAndTestimonialFilms,
      },
    ],
  },
  '/social': { films: [socialSelection] },
  '/social/gestione-social-organica-torino': {
    photography: {
      eyebrow: 'Gestione organica / Life',
      credit: 'Contenuti di Memento Production per Life',
      title: 'Un messaggio, un’identità.',
      description:
        'Una creatività per la comunicazione di Life: il tono di voce e la grafica lavorano insieme per rendere riconoscibile il servizio.',
      photos: emailPhotos.organic,
    },
    films: [organicSelection],
  },
  '/social/facebook-instagram-torino': { films: [facebookInstagramSelection] },
  '/social/tiktok-torino': { films: [tiktokSelection] },
};

export const serviceMediaFor = (path: string): ServiceMedia => mediaByPath[path] ?? { films: [] };

export function serviceMediaSchema(path: string, media: ServiceMedia): Record<string, unknown>[] {
  const pageUrl = `${siteConfig.origin}${path}`;
  const images =
    media.photography?.photos.map((photo) => ({
      '@context': 'https://schema.org',
      '@type': 'ImageObject',
      '@id': `${pageUrl}#${photo.slug}`,
      name: photo.title,
      description: photo.alt,
      caption: photo.location,
      contentUrl: `${siteConfig.origin}${photoSource(photo, 1920)}`,
      thumbnailUrl: `${siteConfig.origin}${photoSource(photo, 640)}`,
      width: photo.width,
      height: photo.height,
      // The comparison also contains the client's previous logo, not created by Memento.
      ...(media.photography?.layout === 'comparison'
        ? {}
        : { creator: { '@id': `${siteConfig.origin}/#organization` } }),
    })) ?? [];
  const films = media.films.flatMap((selection) => selection.films);
  const uniqueFilms = [...new Map(films.map((film) => [film.id, film])).values()];
  return [
    ...images,
    ...uniqueFilms
      .filter((film) => film.provider === 'youtube' || film.provider === 'local')
      .map((film) => ({
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        '@id': `${pageUrl}#film-${film.id}`,
        name: film.title,
        description: film.description,
        thumbnailUrl: `${siteConfig.origin}${film.poster}`,
        uploadDate: film.uploadDate,
        duration: film.duration,
        url: `${pageUrl}#film-${film.id}`,
        ...(film.provider === 'youtube'
          ? { embedUrl: `https://www.youtube-nocookie.com/embed/${film.id}` }
          : { contentUrl: `${siteConfig.origin}${film.source}` }),
        creator: { '@id': `${siteConfig.origin}/#organization` },
      })),
  ];
}
