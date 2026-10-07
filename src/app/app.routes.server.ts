import { catalogLinks } from './core/service-navigation';
import { serviceRedirects } from './core/service-redirects';
import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'agenzia', renderMode: RenderMode.Prerender },
  { path: 'servizi', renderMode: RenderMode.Prerender },
  ...catalogLinks.map(page => ({ path: page.path.slice(1), renderMode: RenderMode.Prerender as const })),
  ...serviceRedirects.map(({ from }) => ({ path: from.slice(1), renderMode: RenderMode.Prerender as const })),
  { path: 'google-meta-ads', renderMode: RenderMode.Prerender },
  { path: 'portfolio', renderMode: RenderMode.Prerender },
  { path: 'recensioni', renderMode: RenderMode.Prerender },
  { path: 'contatti', renderMode: RenderMode.Prerender },
  { path: 'privacy-policy', renderMode: RenderMode.Prerender },
  { path: '404', renderMode: RenderMode.Prerender },
  { path: '**', renderMode: RenderMode.Client },
];
