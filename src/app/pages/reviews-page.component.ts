import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../core/seo.service';
import { pageMetadata, siteConfig } from '../core/site.config';
import { TrackingService } from '../core/tracking.service';
import { PageMotionDirective } from '../shared/page-motion.directive';
import { KineticTextComponent } from '../shared/kinetic-text.component';
import { ScrollSceneDirective } from '../shared/scroll-scene.directive';

@Component({
  imports: [KineticTextComponent, ScrollSceneDirective, PageMotionDirective, RouterLink],
  template: `
    <section class="page-hero page-hero--reviews chapter-hero" appScrollScene="hero">
      <span class="chapter-hero__frame" aria-hidden="true"></span>
      <div class="page-hero__image" aria-hidden="true">
        <img src="/images/hero-recensioni-verde-oro.webp" alt="" width="1600" height="900" fetchpriority="high" />
      </div>
      <span class="reviews-hero__quote" aria-hidden="true">“</span>
      <div class="shell page-hero__content">
        <p appPageMotion="hero" [motionDelay]="140" class="eyebrow">Testimonianze</p>
        <h1><app-kinetic-text text="Esperienze reali, raccontate da chi ha lavorato con noi." [delay]="160" /></h1>
        <p appPageMotion="hero" [motionDelay]="560">Dalle produzioni fotografiche alla gestione social, ogni progetto nasce da un rapporto diretto. Qui trovi alcune recensioni condivise dai clienti su Google.</p>
      </div>
    </section>

    <section class="section reviews-intro section--sage">
      <div class="shell reviews-intro__grid">
        <div>
          <p class="eyebrow">Oltre le parole</p>
          <h2><app-kinetic-text mode="ink" text="Non sono slogan. Sono segnali di fiducia costruiti nel lavoro quotidiano." /></h2>
        </div>
        <div appPageMotion="rise" [motionDelay]="180" class="reviews-intro__pillars" aria-label="Valori ricorrenti nelle recensioni">
          <span>Cura</span>
          <span>Continuità</span>
          <span>Presenza</span>
        </div>
      </div>
    </section>

    <section class="section reviews-section reviews-scene section--sage-soft" appScrollScene>
      <span class="reviews-scene__quote" aria-hidden="true">“</span>
      <div class="shell reviews-grid">
        @for (review of config.reviews; track review.person) {
          <blockquote appPageMotion="fan" [motionDelay]="($index % 3) * 120" [style.--fan-angle]="$index % 2 === 0 ? '-3deg' : '3deg'" class="review-card">
            <div class="review-card__top">
              <span class="review-card__mark" aria-hidden="true">{{ review.person.slice(0, 1) }}</span>
              <div>
                <div class="review-card__rating" role="img" [attr.aria-label]="review.rating + ' stelle su 5'"><span aria-hidden="true">★&#xFE0E;★&#xFE0E;★&#xFE0E;★&#xFE0E;★&#xFE0E;</span></div>
                <span class="review-card__source">Recensione Google</span>
              </div>
            </div>
            <p>“{{ review.content }}”</p>
            <footer><cite>{{ review.person }}</cite></footer>
          </blockquote>
        }
      </div>
    </section>

    <section class="section section--accent reviews-cta chapter-closing" appScrollScene>
      <div class="cta-band__image" aria-hidden="true">
        <img src="/images/banner-prossimo-progetto-verde-oro.webp" alt="" loading="lazy" decoding="async" width="2048" height="768" />
      </div>
      <div class="shell reviews-cta__inner">
        <div appPageMotion="rise">
          <p class="eyebrow">Il prossimo racconto</p>
          <h2><app-kinetic-text text="Vuoi capire che forma può avere il tuo progetto?" /></h2>
          <p>Partiamo da una conversazione concreta: obiettivi, materiali disponibili e canali più adatti.</p>
        </div>
        <div appPageMotion="rise" [motionDelay]="180" class="button-row">
          <a class="button button--ink" routerLink="/contatti">Apri i contatti <span aria-hidden="true">↗&#xFE0E;</span></a>
          <a class="text-link" [href]="config.contact.whatsappUrl" target="_blank" rel="noopener noreferrer" (click)="tracking.trackContact('whatsapp', 'reviews_cta')">WhatsApp <span aria-hidden="true">→&#xFE0E;</span></a>
        </div>
      </div>
    </section>
  `,
})
export class ReviewsPageComponent implements OnInit {
  readonly config = siteConfig;
  readonly tracking = inject(TrackingService);
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.setPage(pageMetadata.reviews, {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: pageMetadata.reviews.title,
      url: `${siteConfig.origin}${pageMetadata.reviews.path}`,
      isPartOf: { '@id': `${siteConfig.origin}/#organization` },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.origin },
          { '@type': 'ListItem', position: 2, name: 'Recensioni', item: `${siteConfig.origin}${pageMetadata.reviews.path}` },
        ],
      },
    });
  }
}
