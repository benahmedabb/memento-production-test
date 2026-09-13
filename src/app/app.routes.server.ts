import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'agenzia', renderMode: RenderMode.Prerender },
  { path: 'servizi', renderMode: RenderMode.Prerender },
  { path: 'produzione-video-fotografia', renderMode: RenderMode.Prerender },
  { path: 'social-media', renderMode: RenderMode.Prerender },
  { path: 'google-meta-ads', renderMode: RenderMode.Prerender },
  { path: 'branding-siti-web', renderMode: RenderMode.Prerender },
  { path: 'portfolio', renderMode: RenderMode.Prerender },
  { path: 'recensioni', renderMode: RenderMode.Prerender },
  { path: 'contatti', renderMode: RenderMode.Prerender },
  { path: 'privacy-policy', renderMode: RenderMode.Prerender },
  { path: '**', renderMode: RenderMode.Server, status: 404 },
];
