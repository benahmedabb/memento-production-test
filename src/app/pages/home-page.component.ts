import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { homeCaseStudies, portfolioCover } from '../core/portfolio-case-studies';
import { SeoService } from '../core/seo.service';
import { pageMetadata, serviceEntries, siteConfig } from '../core/site.config';
import { TrackingService } from '../core/tracking.service';
import { PageMotionDirective } from '../shared/page-motion.directive';
import { CinematicHeroComponent } from '../shared/cinematic-hero.component';
import { ClientLogosComponent } from '../shared/client-logos.component';
import { HomeReviewsMarqueeComponent } from '../shared/home-reviews-marquee.component';
import { ScrollSceneDirective } from '../shared/scroll-scene.directive';

@Component({
  imports: [PageMotionDirective, RouterLink, CinematicHeroComponent, ClientLogosComponent, HomeReviewsMarqueeComponent, ScrollSceneDirective],
  template: `
    <app-cinematic-hero />
    <app-client-logos />

    <section class="memory-statement section--sage" appScrollScene aria-labelledby="memory-title">
      <div class="shell memory-statement__inner">
        <div class="memory-statement__aside" appPageMotion="rise">
          <p class="eyebrow">Il nostro punto di vista</p>
          <span class="memory-statement__asterisk" aria-hidden="true">✳&#xFE0E;</span>
        </div>
        <div>
          <h2 id="memory-title" class="memory-statement__text" aria-label="Non basta farsi vedere. Bisogna farsi ricordare.">
            @for (word of statementWords; track $index) {
              <span aria-hidden="true" [style.--word-index]="$index">{{ word }}</span>{{ ' ' }}
            }
          </h2>
          <div class="memory-statement__footer" appPageMotion="rise">
            <p>Ogni progetto parte da una domanda sola: cosa deve restare, a chi, e perché. Da lì nascono video, fotografia, social, identità visiva e sito come un solo linguaggio, non pezzi affidati a fornitori diversi. Lavoriamo così con le aziende di Torino e provincia che non vogliono solo farsi vedere: vogliono essere riconosciute.</p>
            <a class="text-link" routerLink="/agenzia">Dentro Memento <span aria-hidden="true">↗&#xFE0E;</span></a>
          </div>
        </div>
      </div>
      <div class="memory-statement__rule" aria-hidden="true"></div>
    </section>

    <app-home-reviews-marquee />

    <section id="progetti" class="section home-projects section--sage-soft">
      <div class="shell section-heading section-heading--stack-mobile">
        <div appPageMotion="rise">
          <p class="eyebrow">Progetti selezionati</p>
          <h2>Quando il messaggio trova la sua forma.</h2>
          <p class="home-projects__intro">Sei casi studio per aziende del Piemonte: video, fotografia, campagne e identità visive nati dalla stessa idea di partenza. Guarda il risultato.</p>
        </div>
        <a appPageMotion="rise" [motionDelay]="180" class="text-link" routerLink="/portfolio">Apri il portfolio <span aria-hidden="true">→&#xFE0E;</span></a>
      </div>
      <div class="shell project-preview-grid" aria-label="Esplora i progetti selezionati">
        @for (preview of projectPreviews; track preview.project.slug) {
          <a class="project-preview" routerLink="/portfolio" [fragment]="preview.project.slug" [attr.aria-labelledby]="'preview-' + preview.project.slug">
            <div class="project-preview__media">
              <img
                [src]="preview.image.src"
                [attr.srcset]="preview.image.srcset ?? null"
                sizes="(min-width: 860px) 30vw, (min-width: 600px) 45vw, 100vw"
                [alt]="preview.image.alt"
                [width]="preview.image.width"
                [height]="preview.image.height"
                [style.object-position]="preview.project.coverPosition ?? '50% 50%'"
                loading="lazy"
                decoding="async"
              />
              <span class="project-preview__index" aria-hidden="true">0{{ $index + 1 }}</span>
              <span class="project-preview__category">{{ preview.category }}</span>
            </div>
            <div class="project-preview__body">
              <h3 [id]="'preview-' + preview.project.slug">{{ preview.project.client }}</h3>
              <p>{{ preview.project.summary }}</p>
              <span class="project-preview__link">Esplora il progetto <span aria-hidden="true">↗&#xFE0E;</span></span>
            </div>
          </a>
        }
      </div>
    </section>

    <section class="section section--dark services-showcase home-services">
      <div class="shell section-heading">
        <div appPageMotion="rise">
          <p class="eyebrow eyebrow--gold">Cosa facciamo</p>
          <h2>Strumenti diversi. Una presenza più nitida.</h2>
        </div>
        <a appPageMotion="rise" [motionDelay]="180" class="text-link text-link--light" routerLink="/servizi">Tutti i servizi <span aria-hidden="true">→&#xFE0E;</span></a>
      </div>
      <div class="shell service-grid">
        @for (service of serviceEntries; track service.key) {
          @let image = config.images[service.service.image];
          <a appPageMotion="rise" [motionDelay]="$index * 140" class="service-card" [routerLink]="service.path" [attr.aria-label]="'Scopri il servizio ' + service.service.shortTitle">
            <span class="service-card__media">
              <img [src]="image.src" [srcset]="image.srcset" [sizes]="image.sizes" [alt]="image.alt" width="1280" height="801" loading="lazy" decoding="async" />
            </span>
            <span class="service-card__body">
              <span class="service-card__number" aria-hidden="true">0{{ $index + 1 }}</span>
              <h3>{{ service.service.shortTitle }}</h3>
              <p>{{ service.service.description }}</p>
              <span class="card-arrow" aria-hidden="true">↗&#xFE0E;</span>
            </span>
          </a>
        }
      </div>
    </section>

    <section id="territorio" class="section section--sage local-presence" aria-labelledby="local-title">
      <div class="shell two-column">
        <div>
          <p class="eyebrow">La nostra zona</p>
          <h2 id="local-title">Comunicazione per le aziende di Torino e provincia.</h2>
        </div>
        <div class="local-presence__copy">
          <p>La sede di Memento Production è a Moncalieri. Affianchiamo le imprese di Torino, Pinerolo e Chieri con produzione video e fotografia, social media, campagne pubblicitarie, identità visiva e siti web.</p>
          <p>Puoi partire da un’esigenza concreta: presentare un prodotto, promuovere un servizio, rinnovare l’immagine aziendale o rendere più semplice ricevere richieste online. Definiamo attività e priorità in base al progetto; eventuali incontri e riprese vengono concordati insieme.</p>
          <ul class="local-presence__cities" aria-label="Zone servite">
            @for (city of config.serviceCities; track city) { <li>{{ city }}</li> }
          </ul>
          <div class="button-row">
            <a class="button" routerLink="/contatti" (click)="tracking.trackQuote('home_local')">Richiedi un preventivo <span aria-hidden="true">↗&#xFE0E;</span></a>
            <a class="text-link" routerLink="/recensioni">Leggi le recensioni <span aria-hidden="true">→&#xFE0E;</span></a>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--accent cta-band cta-band--graphic cta-band--home-project home-closing">
      <div class="shell cta-band__inner">
        <div appPageMotion="rise">
          <p class="eyebrow">Il prossimo progetto</p>
          <h2>Diamo alla tua idea una direzione memorabile.</h2>
        </div>
        <div appPageMotion="rise" [motionDelay]="180" class="cta-band__links">
          <a class="button button--ink" routerLink="/contatti" (click)="tracking.trackQuote('home_cta')">Richiedi un preventivo <span aria-hidden="true">↗&#xFE0E;</span></a>
          <a class="text-link" [href]="config.contact.whatsappUrl" target="_blank" rel="noopener noreferrer" (click)="tracking.trackContact('whatsapp', 'home_cta')">WhatsApp <span aria-hidden="true">→&#xFE0E;</span></a>
        </div>
      </div>
    </section>
  `,
})
export class HomePageComponent implements OnInit {
  readonly statementWords = ['Non', 'basta', 'farsi', 'vedere.', 'Bisogna', 'farsi', 'ricordare.'];
  readonly config = siteConfig;
  readonly projectPreviews = homeCaseStudies.map((project) => ({
    project,
    image: portfolioCover(project),
    category: project.tags.slice(0, 2).join(' · '),
  }));
  readonly tracking = inject(TrackingService);

  private readonly seo = inject(SeoService);
  readonly serviceEntries = serviceEntries;

  ngOnInit(): void {
    this.seo.setPage(pageMetadata.home, [
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${siteConfig.origin}/#website`,
        name: 'Memento Production',
        alternateName: 'Memento',
        url: siteConfig.origin,
        inLanguage: 'it-IT',
        publisher: { '@id': `${siteConfig.origin}/#organization` },
      },
    ]);
  }
}
