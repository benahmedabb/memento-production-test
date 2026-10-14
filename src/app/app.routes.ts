import { catalogLinks } from './core/service-navigation';
import { serviceRedirects } from './core/service-redirects';
import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page.component';

// Keep Home eager; other pages must not delay its camera on slow connections.
export const routes: Routes = [
  { path: '', component: HomePageComponent, pathMatch: 'full' },
  { path: 'agenzia', loadComponent: () => import('./pages/agency-page.component').then(m => m.AgencyPageComponent) },
  { path: 'servizi', loadComponent: () => import('./pages/services-page.component').then(m => m.ServicesPageComponent) },
  ...catalogLinks.map(catalogPage => ({ path: catalogPage.path.slice(1), loadComponent: () => import('./pages/catalog-page.component').then(m => m.CatalogPageComponent), data: { catalogPath: catalogPage.path } })),
  ...serviceRedirects.map(({ from, to }) => ({ path: from.slice(1), redirectTo: to, pathMatch: 'full' as const })),
  { path: 'google-meta-ads', loadComponent: () => import('./pages/service-detail-page.component').then(m => m.ServiceDetailPageComponent), data: { serviceKey: 'ads' } },
  { path: 'portfolio', loadComponent: () => import('./pages/portfolio-page.component').then(m => m.PortfolioPageComponent) },
  { path: 'recensioni', loadComponent: () => import('./pages/reviews-page.component').then(m => m.ReviewsPageComponent) },
  { path: 'contatti', loadComponent: () => import('./pages/contact-page.component').then(m => m.ContactPageComponent) },
  { path: 'privacy-policy', loadComponent: () => import('./pages/policy-page.component').then(m => m.PolicyPageComponent) },
  { path: '404', loadComponent: () => import('./pages/not-found-page.component').then(m => m.NotFoundPageComponent) },
  { path: '**', redirectTo: '404' },
];
