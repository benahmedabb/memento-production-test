import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SeoService } from '../core/seo.service';
import { serviceAreas } from '../core/site-schema';
import { TrackingService } from '../core/tracking.service';
import { PageMetadata, ServiceKey, pageMetadata, siteConfig } from '../core/site.config';
import { PageMotionDirective } from '../shared/page-motion.directive';
import { KineticTextComponent } from '../shared/kinetic-text.component';
import { ScrollSceneDirective } from '../shared/scroll-scene.directive';

const SERVICE_METADATA: Record<ServiceKey, PageMetadata> = {
  production: pageMetadata.production,
  social: pageMetadata.social,
  ads: pageMetadata.ads,
  branding: pageMetadata.branding,
  web: pageMetadata.web,
};

@Component({
  imports: [KineticTextComponent, ScrollSceneDirective, PageMotionDirective, RouterLink],
  template: `
    <section class="service-hero detail-scene section--sage-soft" appScrollScene="hero">
      <div class="shell service-hero__grid">
        <div class="service-hero__content">
          <a appPageMotion="hero" [motionDelay]="100" class="back-link" routerLink="/servizi"><span aria-hidden="true">←&#xFE0E;</span> Tutti i servizi</a>
          <p appPageMotion="hero" [motionDelay]="220" class="eyebrow">{{ service.eyebrow }}</p>
          <h1>{{ service.title }}</h1>
          <p>{{ service.description }}</p>
          <p class="service-area-note">Dalla sede di Moncalieri, per le aziende di Torino, Pinerolo e Chieri.</p>
          <a class="button" routerLink="/contatti" (click)="tracking.trackQuote('service_hero', serviceKey)">Richiedi un preventivo <span aria-hidden="true">↗&#xFE0E;</span></a>
        </div>
        <div class="detail-scene__visual"><div appPageMotion="mask" [motionDelay]="160" class="service-hero__image" [class.service-hero__image--illustration]="serviceKey === 'web'">
          <img [src]="image.src" [srcset]="image.srcset" [sizes]="image.sizes" [alt]="image.alt" loading="eager" fetchpriority="high" width="1200" height="800" />
          <a class="media-credit" [href]="image.sourceUrl" target="_blank" rel="noopener noreferrer">{{ image.credit }}</a>
        </div></div>
      </div>
    </section>

    <section class="section section--sage">
      <div class="shell two-column two-column--offset">
        <div><p class="eyebrow">Cosa può includere</p><h2><app-kinetic-text mode="ink" [text]="service.shortTitle + ': le attività'" /></h2></div>
        <ul class="detail-list detail-list--animated">
          @for (item of service.deliverables; track item) { <li appPageMotion="rise" [motionDelay]="$index * 100">{{ item }}</li> }
        </ul>
      </div>
    </section>

    <section class="section section--muted detail-process section--sage-soft" appScrollScene>
      <div class="shell"><div><p class="eyebrow">Il percorso</p><h2 class="section-title"><app-kinetic-text text="Dal contesto a un output pronto a vivere." /></h2></div>
        <ol class="process-list process-list--compact">
          @for (step of service.approach; track step) {
            <li appPageMotion="rise" [motionDelay]="$index * 180"><span>0{{ $index + 1 }}</span><div><h3>{{ step }}</h3></div></li>
          }
        </ol>
      </div>
    </section>

    <section class="section section--dark chapter-closing" appScrollScene>
      <div class="shell cta-centered">
        <p appPageMotion="rise" class="eyebrow eyebrow--gold">Un progetto su misura</p>
        <h2><app-kinetic-text text="Partiamo da ciò che il tuo brand deve far ricordare." /></h2>
        <a appPageMotion="rise" [motionDelay]="360" class="button button--gold" routerLink="/contatti" (click)="tracking.trackQuote('service_cta', serviceKey)">Richiedi un preventivo <span aria-hidden="true">→&#xFE0E;</span></a>
      </div>
    </section>
  `,
})
export class ServiceDetailPageComponent implements OnInit {
  readonly tracking = inject(TrackingService);
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  readonly serviceKey = this.route.snapshot.data['serviceKey'] as ServiceKey;
  readonly service = siteConfig.services[this.serviceKey];
  readonly image = siteConfig.images[this.service.image];
  readonly metadata = SERVICE_METADATA[this.serviceKey];
  ngOnInit(): void {
    this.seo.setPage(this.metadata, [
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: this.service.shortTitle,
        description: this.service.description,
        provider: { '@id': `${siteConfig.origin}/#organization` },
        areaServed: serviceAreas,
        url: `${siteConfig.origin}${this.metadata.path}`,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.origin },
          { '@type': 'ListItem', position: 2, name: 'Servizi', item: `${siteConfig.origin}/servizi` },
          { '@type': 'ListItem', position: 3, name: this.service.shortTitle, item: `${siteConfig.origin}${this.metadata.path}` },
        ],
      },
    ]);
  }
}
