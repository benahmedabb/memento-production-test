import { clientTestimonial } from './client-testimonial';
import { siteConfig } from './site.config';

export interface ServicePhoto {
  readonly slug: string;
  readonly title: string;
  readonly location: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
}

export interface ServiceFilm {
  readonly id: string;
  readonly provider: 'youtube' | 'local' | 'instagram-link';
  readonly title: string;
  readonly client: string;
  readonly description: string;
  readonly poster: string;
  readonly posterSrcset?: string;
  readonly width: number;
  readonly height: number;
  readonly watchUrl: string;
  readonly source?: string;
  readonly uploadDate: string;
  readonly duration: string;
  readonly durationLabel: string;
}

export interface FilmSelection {
  readonly id: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly format: 'landscape' | 'portrait';
  readonly films: readonly ServiceFilm[];
  readonly more?: { readonly path: string; readonly label: string };
}

export interface PhotoSelection {
  readonly title: string;
  readonly description: string;
  readonly photos: readonly ServicePhoto[];
  readonly more?: { readonly path: string; readonly label: string };
}

export interface ServiceMedia {
  readonly photography?: PhotoSelection;
  readonly films: readonly FilmSelection[];
}

const imageRoot = '/images/servizi/';
export const photoSource = (photo: ServicePhoto, width = 1200) =>
  `${imageRoot}${photo.slug}-${width}.webp`;
export const photoSrcset = (photo: ServicePhoto) =>
  [640, 1200, 1920].map((width) => `${photoSource(photo, width)} ${width}w`).join(', ');

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

function reel(
  id: string,
  slug: string,
  title: string,
  client: string,
  description: string,
  uploadDate: string,
  seconds: number,
  externalOnly = false,
): ServiceFilm {
  return {
    id,
    provider: externalOnly ? 'instagram-link' : 'local',
    title,
    client,
    description,
    poster: `${imageRoot}${slug}.webp`,
    width: 640,
    height: id === 'DZaBhL4oxDw' ? 1136 : 1138,
    watchUrl: `https://www.instagram.com/reel/${id}/`,
    ...(!externalOnly ? { source: `/videos/servizi/${slug}.mp4` } : {}),
    uploadDate,
    duration: `PT${seconds}S`,
    durationLabel: `${Math.floor(Math.round(seconds) / 60)}:${String(Math.round(seconds) % 60).padStart(2, '0')}`,
  };
}

export const socialFilms = [
  reel(
    'DZaBhL4oxDw',
    'arabian-luxury-beauty',
    'Il benessere si racconta',
    'Arabian Luxury Beauty',
    'Un Reel di presentazione di Arabian Luxury Beauty, centro estetico e benessere a Torino.',
    '2026-06-10',
    59.866,
  ),
  reel(
    'DbYnt8pAvgN',
    'centro-benessere-life',
    'Ogni esigenza, il suo trattamento',
    'Centro Benessere Life',
    'Il Reel di Centro Benessere Life dedicato ai suoi trattamenti. Guarda il contenuto sul profilo Instagram del centro.',
    '2026-07-29',
    34.201,
    true,
  ),
  reel(
    'DclvAv2oB-b',
    'speed-trasporti-animazione',
    'La cura viaggia con la merce',
    'Speed Trasporti · Animazione',
    'Un Reel animato di Speed Trasporti dedicato all’attenzione nel trasporto delle merci delicate.',
    '2026-08-28',
    17.625,
  ),
  reel(
    'DbIgzo_Igur',
    'speed-trasporti-logistica',
    'Anche il ritorno conta',
    'Speed Trasporti',
    'Un contenuto social di Speed Trasporti che racconta la logistica inversa: resi, ritiri e rientri della merce.',
    '2026-07-23',
    18.875,
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
  title: 'Prima della visita, uno sguardo.',
  description:
    'Tre interni, due prospettive all’aperto. Una selezione di fotografie realizzate per Professionecasa tra Cantalupa, Pinerolo, Cumiana e Piscina.',
  photos: propertyPhotos,
};
const corporate: FilmSelection = {
  id: 'film-aziendali',
  eyebrow: 'Produzioni aziendali',
  title: 'Le storie hanno un volto.',
  description:
    'Presentazioni, persone ed eventi. Tre produzioni per vedere come un’identità prende forma in video.',
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
    'Benessere e servizi: quattro esempi di contenuti realizzati per i social, ognuno con il linguaggio del proprio brand.',
  format: 'portrait',
  films: socialFilms,
};
const socialSelection: FilmSelection = {
  ...reels,
  description:
    'Tre esempi di contenuti social tra benessere, animazione e logistica: linguaggi diversi per raccontare ogni attività.',
  films: [socialFilms[0], socialFilms[2], socialFilms[3]],
  more: { path: '/video/reel-social-torino', label: 'Esplora tutti i Reel' },
};

const mediaByPath: Readonly<Record<string, ServiceMedia>> = {
  '/foto': {
    photography: {
      ...photography,
      photos: [propertyPhotos[0], propertyPhotos[3], propertyPhotos[4]],
      description:
        'Luce, architettura e contesto: alcuni scatti dei servizi immobiliari realizzati per Professionecasa.',
      more: {
        path: '/foto/fotografia-immobiliare-torino',
        label: 'Guarda il servizio immobiliare',
      },
    },
    films: [],
  },
  '/foto/fotografia-immobiliare-torino': { photography, films: [properties] },
  '/video': {
    films: [
      corporate,
      properties,
      {
        ...socialSelection,
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
          'Il Reel animato di Speed Trasporti: un esempio di come la grafica in movimento può raccontare un servizio.',
        format: 'portrait',
        films: [socialFilms[2]],
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
          'Il Dr. Alessio Vainella racconta il lavoro con Memento Production. Un esempio di video testimonianza già presente nelle nostre recensioni.',
        format: 'landscape',
        films: [testimonial],
        more: { path: '/recensioni', label: 'Leggi anche le recensioni' },
      },
    ],
  },
  '/social': { films: [socialSelection] },
  '/social/gestione-social-organica-torino': {
    films: [
      {
        ...socialSelection,
        description:
          'Una selezione di contenuti pubblicati sui profili dei clienti: esempi di produzione per la comunicazione organica.',
      },
    ],
  },
  '/social/facebook-instagram-torino': { films: [reels] },
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
      caption: `${photo.location} · Professionecasa`,
      contentUrl: `${siteConfig.origin}${photoSource(photo, 1920)}`,
      thumbnailUrl: `${siteConfig.origin}${photoSource(photo, 640)}`,
      width: photo.width,
      height: photo.height,
      creator: { '@id': `${siteConfig.origin}/#organization` },
    })) ?? [];
  const films = media.films.flatMap((selection) => selection.films);
  const uniqueFilms = [...new Map(films.map((film) => [film.id, film])).values()];
  return [
    ...images,
    ...uniqueFilms
      .filter((film) => film.provider !== 'instagram-link')
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
