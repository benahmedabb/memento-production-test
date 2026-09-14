import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SeoService } from '../core/seo.service';
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
    <section class="service-hero detail-scene" appScrollScene="hero">
      <div class="shell service-hero__grid">
        <div class="service-hero__content">
          <a appPageMotion="hero" [motionDelay]="100" class="back-link" routerLink="/servizi"><span aria-hidden="true">←</span> Tutti i servizi</a>
          <p appPageMotion="hero" [motionDelay]="220" class="eyebrow">{{ service.eyebrow }}</p>
          <h1><app-kinetic-text [text]="service.title" [delay]="160" /></h1>
          <p appPageMotion="hero" [motionDelay]="590">{{ service.description }}</p>
          <a appPageMotion="hero" [motionDelay]="780" class="button" routerLink="/contatti">Parliamo del progetto <span aria-hidden="true">↗</span></a>
        </div>
        <div class="detail-scene__visual"><div appPageMotion="mask" [motionDelay]="160" class="service-hero__image" [class.service-hero__image--illustration]="serviceKey === 'web'">
          <img [src]="image.src" [srcset]="image.srcset" [sizes]="image.sizes" [alt]="image.alt" loading="eager" width="1200" height="800" />
          <a class="media-credit" [href]="image.sourceUrl" target="_blank" rel="noopener noreferrer">{{ image.credit }}</a>
        </div></div>
      </div>
    </section>

    <section class="section">
      <div class="shell two-column two-column--offset">
        <div><p class="eyebrow">Cosa può includere</p><h2><app-kinetic-text mode="ink" text="Una cassetta degli attrezzi da comporre." /></h2></div>
        <ul class="detail-list detail-list--animated">
          @for (item of service.deliverables; track item) { <li appPageMotion="rise" [motionDelay]="$index * 100">{{ item }} <span aria-hidden="true">↗</span></li> }
        </ul>
      </div>
    </section>

    <section class="section section--muted detail-process" appScrollScene>
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
        <a appPageMotion="rise" [motionDelay]="360" class="button button--gold" routerLink="/contatti">Scrivici <span aria-hidden="true">→</span></a>
      </div>
    </section>
  `,
})
export class ServiceDetailPageComponent implements OnInit {
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
