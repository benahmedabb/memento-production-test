import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../core/seo.service';
import { pageMetadata, siteConfig } from '../core/site.config';
import { PageMotionDirective } from '../shared/page-motion.directive';

@Component({
  imports: [PageMotionDirective, RouterLink],
  template: `
    <section class="page-hero page-hero--services">
      <div class="page-hero__image" aria-hidden="true">
        <img src="/images/memento-ufficio-hero.webp" alt="" width="1537" height="1023" fetchpriority="high" />
      </div>
      <div class="shell page-hero__content">
        <p appPageMotion="hero" [motionDelay]="140" class="eyebrow">Servizi</p>
        <h1 appPageMotion="hero" [motionDelay]="330">La tua comunicazione, vista nel suo insieme.</h1>
        <p appPageMotion="hero" [motionDelay]="560">Dall’immagine alla campagna, costruiamo un percorso su misura intorno al carattere e agli obiettivi del tuo brand.</p>
      </div>
    </section>

    <section class="section">
      <div class="shell services-list">
        @for (item of services; track item.path) {
          <article appPageMotion="rise" [motionDelay]="$index * 180" class="service-row">
            <span class="service-number">0{{ $index + 1 }}</span>
            <div><p class="eyebrow">{{ item.service.eyebrow }}</p><h2>{{ item.service.shortTitle }}</h2><p>{{ item.service.description }}</p></div>
            <a class="round-link" [routerLink]="item.path" [attr.aria-label]="'Scopri ' + item.service.shortTitle">↗</a>
          </article>
        }
      </div>
    </section>

    <section class="section section--dark">
      <div class="shell two-column two-column--offset">
        <div appPageMotion="rise"><p class="eyebrow eyebrow--gold">Come lavoriamo</p><h2>Ogni servizio è più efficace quando sa dialogare con gli altri.</h2></div>
        <div appPageMotion="rise" [motionDelay]="180" class="intro-copy intro-copy--light"><p>Possiamo intervenire su un singolo progetto o costruire un percorso più ampio. In entrambi i casi, iniziamo da una priorità chiara e scegliamo solo gli strumenti utili.</p><a class="button button--gold" routerLink="/contatti">Raccontaci il progetto <span aria-hidden="true">→</span></a></div>
      </div>
    </section>
  `,
})
export class ServicesPageComponent implements OnInit {
  private readonly seo = inject(SeoService);
  readonly services = [
    { path: '/produzione-video-fotografia', service: siteConfig.services.production },
    { path: '/social-media', service: siteConfig.services.social },
    { path: '/google-meta-ads', service: siteConfig.services.ads },
    { path: '/branding-siti-web', service: siteConfig.services.branding },
  ];

  ngOnInit(): void {
    this.seo.setPage(pageMetadata.services, {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: pageMetadata.services.title,
      url: `${siteConfig.origin}${pageMetadata.services.path}`,
    });
  }
}
