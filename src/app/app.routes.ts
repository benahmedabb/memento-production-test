import { catalogLinks } from './core/service-navigation';
import { serviceRedirects } from './core/service-redirects';
import { Routes } from '@angular/router';
import { AgencyPageComponent } from './pages/agency-page.component';
import { ContactPageComponent } from './pages/contact-page.component';
import { HomePageComponent } from './pages/home-page.component';
import { NotFoundPageComponent } from './pages/not-found-page.component';
import { PolicyPageComponent } from './pages/policy-page.component';
import { PortfolioPageComponent } from './pages/portfolio-page.component';
import { ReviewsPageComponent } from './pages/reviews-page.component';
import { ServiceDetailPageComponent } from './pages/service-detail-page.component';
import { ServicesPageComponent } from './pages/services-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent, pathMatch: 'full' },
  { path: 'agenzia', component: AgencyPageComponent },
  { path: 'servizi', component: ServicesPageComponent },
  ...catalogLinks.map(catalogPage => ({ path: catalogPage.path.slice(1), loadComponent: () => import('./pages/catalog-page.component').then(m => m.CatalogPageComponent), data: { catalogPath: catalogPage.path } })),
  ...serviceRedirects.map(({ from, to }) => ({ path: from.slice(1), redirectTo: to, pathMatch: 'full' as const })),
  { path: 'google-meta-ads', component: ServiceDetailPageComponent, data: { serviceKey: 'ads' } },
  { path: 'portfolio', component: PortfolioPageComponent },
  { path: 'recensioni', component: ReviewsPageComponent },
  { path: 'contatti', component: ContactPageComponent },
  { path: 'privacy-policy', component: PolicyPageComponent },
  { path: '404', component: NotFoundPageComponent },
  { path: '**', redirectTo: '404' },
];
