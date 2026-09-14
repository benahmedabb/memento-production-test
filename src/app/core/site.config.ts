export type ServiceKey = 'production' | 'social' | 'ads' | 'branding' | 'web';

export interface ServiceDefinition {
  readonly key: ServiceKey;
  readonly eyebrow: string;
  readonly title: string;
  readonly shortTitle: string;
  readonly description: string;
  readonly image: SiteImageKey;
  readonly deliverables: readonly string[];
  readonly approach: readonly string[];
}

export interface SiteImage {
  readonly src: string;
  readonly srcset: string;
  readonly sizes: string;
  readonly alt: string;
  readonly sourceUrl: string;
  readonly credit: string;
}

export type SiteImageKey = 'hero' | 'production' | 'social' | 'ads' | 'branding' | 'web' | 'architecture';

export interface PageMetadata {
  readonly title: string;
  readonly description: string;
  readonly path: string;
  readonly type?: 'website' | 'article';
  readonly noIndex?: boolean;
}

export interface PortfolioProject {
  readonly client: string;
  readonly title: string;
  readonly summary: string;
  readonly tags: readonly string[];
  readonly stats: readonly CaseStudyMetric[];
  readonly coverUrl: string;
  readonly instagramPostUrl: string;
  readonly instagramEmbedUrl: string;
}

export interface CaseStudyMetric {
  readonly value: number;
  readonly suffix: string;
  readonly decimals: 0 | 1;
  readonly label: string;
  readonly displayValue: string;
}

export interface Review {
  readonly person: string;
  readonly rating: 5;
  readonly content: string;
}

export const siteConfig = {
  origin: 'https://mementoproduction.it',
  analytics: {
    gtmId: 'GTM-WNM2C5VK',
  },
  iubenda: {
    siteId: undefined as number | undefined,
    cookiePolicyId: 93767367,
    privacyPolicyUrl: 'https://www.iubenda.com/privacy-policy/93767367',
    cookiePolicyUrl: 'https://www.iubenda.com/privacy-policy/93767367/cookie-policy',
  },
  formEndpoint: '',
  contact: {
    legalName: 'Memento Production di Vidinaru Stefan',
    vatNumber: '12716680017',
    phoneDisplay: '+39 329 557 1533',
    phoneHref: 'tel:+393295571533',
    whatsappUrl: 'https://wa.me/393295571533',
    email: 'info@mementoproduction.it',
    address: 'Via Fortunato Postiglione 46, Moncalieri (TO)',
    instagramUrl: 'https://www.instagram.com/memento.production/',
  },
  images: {
    hero: {
      src: 'https://images.unsplash.com/photo-1769699167906-a44d5ae50abb?auto=format&fit=crop&w=1920&q=82',
      srcset: 'https://images.unsplash.com/photo-1769699167906-a44d5ae50abb?auto=format&fit=crop&w=768&q=78 768w, https://images.unsplash.com/photo-1769699167906-a44d5ae50abb?auto=format&fit=crop&w=1280&q=80 1280w, https://images.unsplash.com/photo-1769699167906-a44d5ae50abb?auto=format&fit=crop&w=1920&q=82 1920w',
      sizes: '100vw',
      alt: 'Videocamera professionale illuminata in uno studio di produzione',
      sourceUrl: 'https://unsplash.com/photos/professional-video-camera-on-a-tripod-in-a-studio-rSZEhnhoK00',
      credit: 'Phil Hearing / Unsplash',
    },
    production: {
      src: 'https://images.unsplash.com/photo-1769699167672-9d4bddb46fd5?auto=format&fit=crop&w=1200&q=80',
      srcset: 'https://images.unsplash.com/photo-1769699167672-9d4bddb46fd5?auto=format&fit=crop&w=640&q=78 640w, https://images.unsplash.com/photo-1769699167672-9d4bddb46fd5?auto=format&fit=crop&w=1200&q=80 1200w',
      sizes: '(min-width: 900px) 45vw, 100vw',
      alt: 'Attrezzatura video professionale pronta per una ripresa',
      sourceUrl: 'https://unsplash.com/photos/professional-video-camera-on-a-tripod-in-a-studio-rSZEhnhoK00',
      credit: 'Phil Hearing / Unsplash',
    },
    social: {
      src: 'https://images.unsplash.com/photo-1781606989289-c0b535eac348?auto=format&fit=crop&w=1200&q=80',
      srcset: 'https://images.unsplash.com/photo-1781606989289-c0b535eac348?auto=format&fit=crop&w=640&q=78 640w, https://images.unsplash.com/photo-1781606989289-c0b535eac348?auto=format&fit=crop&w=1200&q=80 1200w',
      sizes: '(min-width: 900px) 45vw, 100vw',
      alt: 'Smartphone e computer per la pianificazione di contenuti social',
      sourceUrl: 'https://unsplash.com/photos/smartphone-on-tripod-displaying-social-media-next-to-a-laptop-9EeEqiQrmq0',
      credit: 'SONY / Unsplash',
    },
    ads: {
      src: '/images/memento-ads-service-v2.webp',
      srcset: '/images/memento-ads-service-v2-640.webp 640w, /images/memento-ads-service-v2.webp 1280w',
      sizes: '(min-width: 860px) 25vw, 100vw',
      alt: 'Laptop con ricerca sponsorizzata e smartphone con creatività social',
      sourceUrl: '/images/memento-ads-service-v2.webp',
      credit: 'Immagine originale Memento Production',
    },
    branding: {
      src: 'https://images.unsplash.com/photo-1548094990-c16ca90f1f0d?auto=format&fit=crop&w=1200&q=80',
      srcset: 'https://images.unsplash.com/photo-1548094990-c16ca90f1f0d?auto=format&fit=crop&w=640&q=78 640w, https://images.unsplash.com/photo-1548094990-c16ca90f1f0d?auto=format&fit=crop&w=1200&q=80 1200w',
      sizes: '(min-width: 900px) 45vw, 100vw',
      alt: 'Materiali grafici e strumenti per progettare una identità visiva',
      sourceUrl: 'https://unsplash.com/s/photos/branding-design-desk',
      credit: 'Unsplash',
    },
    web: {
      src: '/images/memento-web-ecommerce.svg',
      srcset: '',
      sizes: '(min-width: 860px) 45vw, 100vw',
      alt: 'Progetto di un negozio online su desktop e smartphone, nei colori verde e oro di Memento',
      sourceUrl: '/images/memento-web-ecommerce.svg',
      credit: 'Illustrazione Memento Production',
    },
    architecture: {
      src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      srcset: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=640&q=78 640w, https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80 1200w',
      sizes: '(min-width: 900px) 45vw, 100vw',
      alt: 'Architettura contemporanea fotografata alla luce del giorno',
      sourceUrl: 'https://unsplash.com/s/photos/modern-property',
      credit: 'Unsplash',
    },
  },
  services: {
    production: {
      key: 'production',
      eyebrow: 'Produzione video e fotografia',
      title: 'Immagini pensate per fermare lo sguardo.',
      shortTitle: 'Video e fotografia',
      description: 'Dalla direzione creativa alla consegna, costruiamo immagini con ritmo, materia e intenzione.',
      image: 'production',
      deliverables: ['Video corporate e commerciali', 'Fotografia editoriale e prodotto', 'Contenuti verticali per campagne e social', 'Riprese aeree quando pertinenti al progetto'],
      approach: ['Allineiamo linguaggio visivo e obiettivo.', 'Progettiamo riprese, set e formato.', 'Montiamo versioni coerenti con i canali di distribuzione.'],
    },
    social: {
      key: 'social',
      eyebrow: 'Social media',
      title: 'Una presenza riconoscibile, pubblicazione dopo pubblicazione.',
      shortTitle: 'Social media',
      description: 'Strategia, rubriche e contenuti che rendono il brand chiaro e costante sui canali giusti.',
      image: 'social',
      deliverables: ['Strategia e tono di voce', 'Piani editoriali e format', 'Creazione di contenuti foto e video', 'Lettura delle performance e ottimizzazioni'],
      approach: ['Definiamo il ruolo dei canali.', 'Costruiamo una grammatica editoriale.', 'Osserviamo i segnali utili per affinare il lavoro.'],
    },
    ads: {
      key: 'ads',
      eyebrow: 'Google e Meta Ads',
      title: 'Campagne con una direzione creativa e una lettura continua.',
      shortTitle: 'Google e Meta Ads',
      description: 'Progettiamo messaggi, asset e percorsi di campagna per una presenza pubblicitaria più ordinata e misurabile.',
      image: 'ads',
      deliverables: ['Architettura delle campagne', 'Creatività statiche e video', 'Copy e pagine di destinazione', 'Monitoraggio e sintesi periodiche'],
      approach: ['Partiamo dall’offerta e dal contesto.', 'Separiamo messaggi, pubblici e momenti.', 'Rileggiamo dati e creatività insieme, senza scorciatoie.'],
    },
    branding: {
      key: 'branding',
      eyebrow: 'Grafica e branding',
      title: 'Un sistema di brand che sa stare in scena.',
      shortTitle: 'Grafica e branding',
      description: 'Identità visiva, direzione artistica e materiali grafici per dare al brand un carattere chiaro e riconoscibile.',
      image: 'branding',
      deliverables: ['Posizionamento, logo e identità visiva', 'Art direction e materiali grafici', 'Grafica per stampa, campagne e canali digitali', 'Linee guida per comunicare con coerenza'],
      approach: ['Mettiamo a fuoco ciò che rende il brand riconoscibile.', 'Traduciamo la direzione in un sistema visivo.', 'Decliniamo l’identità in materiali coerenti, pronti da utilizzare.'],
    },
    web: {
      key: 'web',
      eyebrow: 'Siti web ed e-commerce',
      title: 'Il tuo brand, uno spazio da esplorare.',
      shortTitle: 'Siti web ed e-commerce',
      description: 'Progettiamo siti e negozi online che uniscono identità, chiarezza e facilità d’uso, dalla prima visita all’acquisto.',
      image: 'web',
      deliverables: ['Siti web aziendali e landing page', 'E-commerce con catalogo prodotti, carrello e pagamenti', 'Design responsive e percorsi di navigazione accessibili', 'Ottimizzazione tecnica, prestazioni e gestione dei contenuti'],
      approach: ['Definiamo obiettivi, contenuti e percorsi delle persone.', 'Progettiamo interfacce coerenti con il brand e sviluppiamo il sito.', 'Verifichiamo navigazione, moduli e acquisti prima della pubblicazione.'],
    },
  } satisfies Record<ServiceKey, ServiceDefinition>,
  portfolio: [
    {
      client: 'Speed Trasporti',
      title: 'Retarder — Il freno invisibile',
      summary: 'Un contenuto informativo dedicato a un dettaglio tecnico, presentato con un linguaggio diretto.',
      tags: ['Contenuto informativo', 'Coinvolgimento'],
      stats: [
        { value: 396, suffix: 'K+', decimals: 0, label: 'visualizzazioni', displayValue: '396K+' },
        { value: 1050, suffix: '', decimals: 0, label: 'nuovi follower', displayValue: '1050' },
        { value: 500, suffix: '+', decimals: 0, label: 'commenti', displayValue: '500+' },
      ],
      coverUrl: 'https://horizons-cdn.hostinger.com/2a652f47-fd1a-4cd2-83ec-4d9503ac3adf/eb480a89070276809df1753fddf933df.jpg',
      instagramPostUrl: 'https://www.instagram.com/p/DTx4MYgkQ2h/',
      instagramEmbedUrl: 'https://www.instagram.com/p/DTx4MYgkQ2h/embed',
    },
    {
      client: 'Dora Events',
      title: "Dora Motor's Experience — Evento unico",
      summary: 'Un progetto video promozionale per accompagnare la comunicazione di un evento automotive.',
      tags: ['Evento', 'Video promozionale'],
      stats: [
        { value: 16, suffix: 'K', decimals: 0, label: 'visite al sito', displayValue: '16K' },
        { value: 250, suffix: 'K+', decimals: 0, label: 'visualizzazioni', displayValue: '250K+' },
      ],
      coverUrl: 'https://horizons-cdn.hostinger.com/2a652f47-fd1a-4cd2-83ec-4d9503ac3adf/d4c8572f5af8c72fddf28acab61f4c2c.jpg',
      instagramPostUrl: 'https://www.instagram.com/p/DWCBNFJAi9p/',
      instagramEmbedUrl: 'https://www.instagram.com/p/DWCBNFJAi9p/embed',
    },
    {
      client: 'Il Forte 2.0',
      title: 'Da quanti anni fai questo lavoro?',
      summary: 'Un contenuto social con un tono vicino e riconoscibile, pensato per stimolare la conversazione.',
      tags: ['Social', 'Tono di voce'],
      stats: [
        { value: 134, suffix: 'K', decimals: 0, label: 'copertura', displayValue: '134K' },
        { value: 1.5, suffix: 'K', decimals: 1, label: 'condivisioni', displayValue: '1.5K' },
        { value: 42, suffix: '%', decimals: 0, label: 'engagement', displayValue: '42%' },
      ],
      coverUrl: 'https://horizons-cdn.hostinger.com/2a652f47-fd1a-4cd2-83ec-4d9503ac3adf/6f0058c9ee4e973819c6912b9579733c.jpg',
      instagramPostUrl: 'https://www.instagram.com/p/DVBRdoljJRA/',
      instagramEmbedUrl: 'https://www.instagram.com/p/DVBRdoljJRA/embed',
    },
  ] satisfies readonly PortfolioProject[],
  reviews: [
    {
      person: 'Gazmend Cekaj',
      rating: 5,
      content: 'Momento production gestisce la mia pagina Instagram e cura con estrema attenzione e costanza tutto il materiale fotografico e non solo del mio locale.',
    },
    {
      person: 'Studioesteticolife',
      rating: 5,
      content: 'Collaboriamo con Memento Production per la gestione social e la creazione dei contenuti del nostro centro estetico e non potremmo essere più soddisfatti. Stefan',
    },
    {
      person: 'Razvan Grozavu',
      rating: 5,
      content: 'Agenzia di marketing e creazione contenuti migliore a Torino! Risultati molto soddisfacenti che mi hanno portato un sacco di nuovi clienti.',
    },
    {
      person: 'Saccy Volley',
      rating: 5,
      content: 'Ottimi servizi! Stefan è un vero professionista come pochi qui in zona. Altissima qualità e attenzione al cliente! Consiglio vivamente.',
    },
    {
      person: 'Bianca Fartade',
      rating: 5,
      content: 'Attrezzatura top e affidabilità. studio fotografico che si occupa di privati, ma soprattutto di business e branding . Professionalità top',
    },
    {
      person: 'Calogero Alaimo',
      rating: 5,
      content: 'Professionisti nel curare i dettagli durante il nostro evento sportivo. Soddisfatto per la disponibilità e la professionalità che hanno mostrato. Consigliati!',
    },
    {
      person: 'Federico Simonazzi',
      rating: 5,
      content: 'Stefan persona molto competenze e attentissimo a ogni dettaglio. Anche in sevizi complessi come quello in cui abbiamo collaborato, si è dimostrato eccellente',
    },
    {
      person: 'Mary Potenza',
      rating: 5,
      content: 'I miei clienti si sono divertiti molto durante il vostro servizio! Grazie!',
    },
  ] satisfies readonly Review[],
} as const;

export const pageMetadata = {
  home: {
    title: 'Memento Production | Comunicazione, contenuti e crescita digitale',
    description: 'Memento Production unisce produzione audiovisiva, social media, advertising, grafica e branding, siti web ed e-commerce per dare forma a una presenza riconoscibile.',
    path: '/',
  },
  agency: {
    title: 'Agenzia | Memento Production',
    description: 'Scopri l’approccio di Memento Production: direzione creativa, contenuti e distribuzione in un unico processo.',
    path: '/agenzia',
  },
  services: {
    title: 'Servizi | Memento Production',
    description: 'Video e fotografia, social media, Google e Meta Ads, grafica e branding, siti web ed e-commerce: cinque servizi coordinati per il tuo brand.',
    path: '/servizi',
  },
  production: {
    title: 'Produzione video e fotografia | Memento Production',
    description: 'Video e fotografia per raccontare prodotti, persone, spazi e progetti con una direzione creativa precisa.',
    path: '/produzione-video-fotografia',
  },
  social: {
    title: 'Social media | Memento Production',
    description: 'Strategia social, piani editoriali e contenuti per costruire una presenza coerente e riconoscibile.',
    path: '/social-media',
  },
  ads: {
    title: 'Google e Meta Ads | Memento Production',
    description: 'Campagne Google e Meta Ads che connettono messaggi, creatività, pagine di destinazione e analisi.',
    path: '/google-meta-ads',
  },
  branding: {
    title: 'Grafica e branding | Memento Production',
    description: 'Logo, identità visiva, art direction e materiali grafici per far emergere il carattere del tuo brand, sulla carta e sui canali digitali.',
    path: '/grafica-branding',
  },
  web: {
    title: 'Siti web ed e-commerce | Memento Production',
    description: 'Siti web aziendali, landing page e negozi online: design responsive e sviluppo per esperienze di navigazione e acquisto semplici e coerenti con il brand.',
    path: '/siti-web-ecommerce',
  },
  portfolio: {
    title: 'Portfolio | Memento Production',
    description: 'Una selezione di progetti pubblicamente documentati da Memento Production.',
    path: '/portfolio',
  },
  reviews: {
    title: 'Recensioni | Memento Production',
    description: 'Esperienze e recensioni Google di persone che hanno lavorato con Memento Production su contenuti, social media, fotografia ed eventi.',
    path: '/recensioni',
  },
  contact: {
    title: 'Contatti | Memento Production',
    description: 'Contatta Memento Production per parlare del tuo prossimo progetto di comunicazione.',
    path: '/contatti',
  },
  policy: {
    title: 'Privacy e Cookie Policy | Memento Production',
    description: 'Accedi alle informative privacy e cookie di Memento Production e gestisci le preferenze di consenso.',
    path: '/privacy-policy',
  },
  notFound: {
    title: 'Pagina non trovata | Memento Production',
    description: 'La pagina richiesta non è disponibile.',
    path: '',
    noIndex: true,
  },
} as const satisfies Record<string, PageMetadata>;

// Keep the home, service directory and contact choices in the same order.
export const serviceEntries = Object.values(siteConfig.services).map((service) => ({
  key: service.key,
  path: pageMetadata[service.key].path,
  service,
}));
