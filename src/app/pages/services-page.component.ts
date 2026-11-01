import { catalogChildren } from '../core/service-navigation';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../core/seo.service';
import { TrackingService } from '../core/tracking.service';
import { pageMetadata, serviceEntries, siteConfig } from '../core/site.config';
import { PageMotionDirective } from '../shared/page-motion.directive';
import { KineticTextComponent } from '../shared/kinetic-text.component';
import { ScrollSceneDirective } from '../shared/scroll-scene.directive';
import { BrandOrbitComponent } from '../shared/brand-orbit.component';
import { aiServiceEnabled } from '../core/ai-service-availability';

@Component({
  imports: [BrandOrbitComponent, KineticTextComponent, ScrollSceneDirective, PageMotionDirective, RouterLink],
  template: `
    <section class="page-hero page-hero--services chapter-hero" appScrollScene="hero">
      <span class="chapter-hero__frame" aria-hidden="true"></span>
      <app-brand-orbit />
      <div class="page-hero__image" aria-hidden="true">
        <img src="/images/memento-ufficio-hero.webp" alt="Interno degli uffici di Memento Production a Moncalieri" width="1537" height="1023" fetchpriority="high" />
      </div>
      <div class="shell page-hero__content">
        <p appPageMotion="hero" [motionDelay]="140" class="eyebrow">Servizi</p>
        <h1>Servizi di comunicazione e marketing a Torino.</h1>
        <p>Dalla sede di Moncalieri, video e fotografia, social media, advertising, branding e siti web per aziende di Torino, Pinerolo e Chieri. Scegli un servizio o un percorso coordinato in base al tuo obiettivo.</p>
      </div>
    </section>

    <section class="section service-chapters">
      <div class="shell service-chapters__list">
        @for (item of services; track item.path) {
          @let image = config.images[item.service.image];
          <article class="service-chapter" appScrollScene [style.--chapter-index]="$index">
            <a class="service-chapter__surface" [routerLink]="item.path" [attr.aria-label]="'Scopri ' + item.service.shortTitle">
              <div class="service-chapter__copy">
                <span class="service-chapter__number" aria-hidden="true">0{{ $index + 1 }}</span>
                <p class="eyebrow">{{ item.service.eyebrow }}</p>
                <h2><app-kinetic-text [text]="item.service.shortTitle" /></h2>
                <p>{{ item.service.description }}</p>
                <span class="service-chapter__link">Esplora il servizio <span aria-hidden="true">↗&#xFE0E;</span></span>
              </div>
              <div class="service-chapter__media"><img [src]="image.src" [srcset]="image.srcset" sizes="(min-width: 980px) 45vw, 100vw" [alt]="image.alt" loading="lazy" decoding="async" width="1200" height="800" /></div>
            </a>
            @if (item.children.length) { <nav class="service-chapter__specialties" [attr.aria-label]="'Specializzazioni ' + item.service.shortTitle">@for (child of item.children; track child.path) { <a [routerLink]="child.path">{{ child.label }} <span aria-hidden="true">↗&#xFE0E;</span></a> }</nav> }
          </article>
        }
      </div>
    </section>

    @if (aiServiceEnabled) {
      <section class="section ai-service-teaser" aria-labelledby="ai-service-teaser-title" appScrollScene>
        <div class="shell ai-service-teaser__grid">
          <div appPageMotion="rise">
            <p class="eyebrow eyebrow--gold">Un servizio in più, una frizione in meno</p>
            <h2 id="ai-service-teaser-title">Le domande arrivano. La risposta giusta può arrivare con loro.</h2>
            <p>Progettiamo assistenti IA basati sulle informazioni della tua azienda, per aiutare i clienti a orientarsi e lasciare al team le conversazioni che richiedono una persona.</p>
            <a class="button button--gold" routerLink="/soluzioni-ia-torino">Scopri le soluzioni IA <span aria-hidden="true">↗&#xFE0E;</span></a>
          </div>
          <a class="ai-service-teaser__image" routerLink="/soluzioni-ia-torino" aria-label="Scopri le soluzioni IA per le aziende">
            <img src="/images/soluzioni-ia-rete-neurale-hero.webp" alt="Rete neurale astratta in vetro, luce verde e connessioni dorate" width="1672" height="941" loading="lazy" decoding="async" />
          </a>
        </div>
      </section>
    }

    <section class="section section--dark chapter-closing" appScrollScene>
      <div class="shell two-column two-column--offset">
        <div><p class="eyebrow eyebrow--gold">Come lavoriamo</p><h2><app-kinetic-text mode="ink" text="Ogni servizio è più efficace quando sa dialogare con gli altri." /></h2></div>
        <div appPageMotion="rise" [motionDelay]="180" class="intro-copy intro-copy--light"><p>Possiamo intervenire su un singolo progetto o costruire un percorso più ampio. In entrambi i casi, iniziamo da una priorità chiara e scegliamo solo gli strumenti utili.</p><a class="button button--gold" routerLink="/contatti" (click)="tracking.trackQuote('services_cta')">Richiedi un preventivo <span aria-hidden="true">→&#xFE0E;</span></a></div>
      </div>
    </section>
  `,
})
export class ServicesPageComponent implements OnInit {
  readonly tracking = inject(TrackingService);
  readonly config = siteConfig;
  private readonly seo = inject(SeoService);
  readonly services = serviceEntries.map(item => ({ ...item, children: catalogChildren(item.path) }));
  readonly aiServiceEnabled = aiServiceEnabled;

  ngOnInit(): void {
    this.seo.setPage(pageMetadata.services, {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: pageMetadata.services.title,
      url: `${siteConfig.origin}${pageMetadata.services.path}`,
      isPartOf: { '@id': `${siteConfig.origin}/#website` },
      about: { '@id': `${siteConfig.origin}/#organization` },
      mainEntity: {
        '@type': 'OfferCatalog',
        name: 'Servizi di comunicazione e marketing',
        itemListElement: this.services.map(({ path, service }) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: service.shortTitle,
            url: `${siteConfig.origin}${path}`,
          },
        })),
      },
    });
  }
}
