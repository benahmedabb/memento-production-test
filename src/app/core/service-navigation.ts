// Lightweight navigation keeps editorial copy out of the initial application payload.
import type { CatalogCategory } from './service-catalog';
export interface CatalogLink {
  readonly path: string;
  readonly category: CatalogCategory;
  readonly kind: 'hub' | 'detail';
  readonly label: string;
}

export const catalogLinks: readonly CatalogLink[] = [
  { path: '/foto', category: 'photo', kind: 'hub', label: 'Fotografia' },
  { path: '/foto/fotografia-corporate-torino', category: 'photo', kind: 'detail', label: 'Fotografia corporate' },
  { path: '/foto/food-photography-torino', category: 'photo', kind: 'detail', label: 'Food & Drinks' },
  { path: '/foto/fotografia-immobiliare-torino', category: 'photo', kind: 'detail', label: 'Fotografia immobiliare' },
  { path: '/foto/product-photography-torino', category: 'photo', kind: 'detail', label: 'Product photography' },
  { path: '/video', category: 'video', kind: 'hub', label: 'Video' },
  { path: '/video/video-aziendali-torino', category: 'video', kind: 'detail', label: 'Video aziendali' },
  { path: '/video/reel-social-torino', category: 'video', kind: 'detail', label: 'Reel per i social' },
  { path: '/video/video-animati-torino', category: 'video', kind: 'detail', label: 'Video animati' },
  { path: '/video/video-corsi-testimonial-torino', category: 'video', kind: 'detail', label: 'Corsi & testimonial' },
  { path: '/grafica', category: 'graphic', kind: 'hub', label: 'Grafica' },
  { path: '/grafica/creazione-loghi-torino', category: 'graphic', kind: 'detail', label: 'Creazione loghi' },
  { path: '/grafica/brand-identity-torino', category: 'graphic', kind: 'detail', label: 'Brand identity' },
  { path: '/grafica/grafica-stampa-torino', category: 'graphic', kind: 'detail', label: 'Grafica offline' },
  { path: '/grafica/rebranding-torino', category: 'graphic', kind: 'detail', label: 'Rebranding' },
  { path: '/social', category: 'social', kind: 'hub', label: 'Social' },
  { path: '/social/gestione-social-organica-torino', category: 'social', kind: 'detail', label: 'Gestione organica' },
  { path: '/social/facebook-instagram-torino', category: 'social', kind: 'detail', label: 'Facebook & Instagram' },
  { path: '/social/tiktok-torino', category: 'social', kind: 'detail', label: 'TikTok' },
  { path: '/web', category: 'web', kind: 'hub', label: 'Siti web' },
  { path: '/web/realizzazione-siti-web-torino', category: 'web', kind: 'detail', label: 'Siti aziendali' },
  { path: '/web/e-commerce-torino', category: 'web', kind: 'detail', label: 'E-commerce' },
  { path: '/web/landing-page-torino', category: 'web', kind: 'detail', label: 'Landing page' },
  { path: '/web/restyling-siti-web-torino', category: 'web', kind: 'detail', label: 'Restyling siti web' },
];
export const catalogHubs = catalogLinks.filter((page) => page.kind === 'hub');
export const catalogChildren = (path: string) =>
  catalogLinks.filter((page) => page.kind === 'detail' && page.path.startsWith(`${path}/`));
