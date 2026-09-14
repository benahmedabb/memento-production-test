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
  { path: 'produzione-video-fotografia', component: ServiceDetailPageComponent, data: { serviceKey: 'production' } },
  { path: 'social-media', component: ServiceDetailPageComponent, data: { serviceKey: 'social' } },
  { path: 'google-meta-ads', component: ServiceDetailPageComponent, data: { serviceKey: 'ads' } },
  { path: 'grafica-branding', component: ServiceDetailPageComponent, data: { serviceKey: 'branding' } },
  { path: 'siti-web-ecommerce', component: ServiceDetailPageComponent, data: { serviceKey: 'web' } },
  { path: 'branding-siti-web', redirectTo: 'grafica-branding', pathMatch: 'full' },
  { path: 'portfolio', component: PortfolioPageComponent },
  { path: 'recensioni', component: ReviewsPageComponent },
  { path: 'contatti', component: ContactPageComponent },
  { path: 'privacy-policy', component: PolicyPageComponent },
  { path: '**', component: NotFoundPageComponent },
];
