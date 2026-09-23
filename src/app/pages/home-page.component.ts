import { Component, ElementRef, OnInit, ViewChild, computed, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { ConsentService } from '../core/consent.service';
import { SeoService } from '../core/seo.service';
import { pageMetadata, serviceEntries, siteConfig } from '../core/site.config';
import { TrackingService } from '../core/tracking.service';
import { AnimatedMetricComponent } from '../shared/animated-metric.component';
import { PageMotionDirective } from '../shared/page-motion.directive';
import { CinematicHeroComponent } from '../shared/cinematic-hero.component';
import { ClientLogosComponent } from '../shared/client-logos.component';
import { ScrollSceneDirective } from '../shared/scroll-scene.directive';

type VideoProject = (typeof siteConfig.portfolio)[number];

@Component({
  imports: [AnimatedMetricComponent, PageMotionDirective, RouterLink, CinematicHeroComponent, ClientLogosComponent, ScrollSceneDirective],
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
              <span aria-hidden="true" [style.--word-index]="$index">{{ word }} </span>
            }
          </h2>
          <div class="memory-statement__footer" appPageMotion="rise">
            <p>Ogni progetto parte da una domanda sola: cosa deve restare, a chi, e perché. Da lì nascono video, fotografia, social e identità visiva come un solo linguaggio, non pezzi affidati a fornitori diversi. Lavoriamo così con le aziende di Torino, Moncalieri e provincia che non vogliono solo farsi vedere: vogliono essere riconosciute.</p>
            <a class="text-link" routerLink="/agenzia">Dentro Memento <span aria-hidden="true">↗&#xFE0E;</span></a>
          </div>
        </div>
      </div>
      <div class="memory-statement__rule" aria-hidden="true"></div>
    </section>

    <section id="progetti" class="section home-projects section--sage-soft">
      <div class="shell section-heading section-heading--stack-mobile">
        <div appPageMotion="rise">
          <p class="eyebrow">Progetti selezionati</p>
          <h2>Quando il messaggio trova la sua forma.</h2>
          <p class="home-projects__intro">Alcuni progetti recenti per aziende di Torino e provincia: video, fotografia, campagne e siti nati dalla stessa idea di partenza. Guarda il risultato.</p>
        </div>
        <a appPageMotion="rise" [motionDelay]="180" class="text-link" routerLink="/portfolio">Apri il portfolio <span aria-hidden="true">→&#xFE0E;</span></a>
      </div>
      <div class="shell project-preview-grid" aria-label="Esplora i progetti selezionati">
        @for (preview of projectPreviews; track preview.project.slug) {
          <a class="project-preview" routerLink="/portfolio" [fragment]="preview.project.slug" [attr.aria-labelledby]="'preview-' + preview.project.slug">
            <div class="project-preview__media">
              <img [src]="preview.image.src" [srcset]="preview.image.srcset" sizes="(min-width: 860px) 30vw, (min-width: 600px) 45vw, 100vw" alt="" width="640" height="400" loading="lazy" decoding="async" />
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
      <div class="shell home-projects__video-heading">
        <p class="eyebrow">Dentro i progetti</p>
        <p>I video. Le reazioni. I risultati.</p>
      </div>
      <div class="shell project-preview-grid" aria-label="Video case study">
        @for (project of config.portfolio; track project.client) {
          <button class="project-preview project-preview--video" type="button" aria-haspopup="dialog" [attr.aria-label]="'Guarda il video ' + project.title + ' per ' + project.client" (click)="openVideo(project, $event)">
              <span class="project-preview__media">
                <img [src]="project.coverUrl" alt="" loading="lazy" decoding="async" width="1280" height="720" />
                <span class="project-preview__index" aria-hidden="true">0{{ $index + 1 }}</span>
                <span class="project-preview__category">Video · {{ project.client }}</span>
              </span>
              <span class="project-preview__body">
                <span class="project-preview__title">{{ project.client }}</span>
                <span class="project-preview__description">{{ project.title }}</span>
                <span class="project-preview__link">Guarda il video <span aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" focusable="false"><path d="M8 5v14l11-7z" /></svg></span></span>
              </span>
          </button>
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

    @if (activeProject(); as project) {
      <div class="video-dialog-backdrop" (click)="closeVideo()">
        <section #videoDialog class="video-dialog" role="dialog" aria-modal="true" aria-labelledby="video-dialog-title" tabindex="-1" (click)="$event.stopPropagation()" (keydown.escape)="closeVideo()">
          <div class="video-dialog__heading">
            <div><p class="eyebrow">{{ project.client }}</p><h2 id="video-dialog-title">{{ project.title }}</h2></div>
            <button class="icon-button" type="button" aria-label="Chiudi video" (click)="closeVideo()">×</button>
          </div>
          <div class="video-dialog__results">
            <dl class="video-case__stats" aria-label="Risultati del progetto">
              @for (stat of project.stats; track stat.label) {
                <div class="video-case__metric">
                  <dd><app-animated-metric [metric]="stat" [delay]="$index * 90" /></dd>
                  <dt>{{ stat.label }}</dt>
                </div>
              }
            </dl>
          </div>

          @if (consent.preferences().marketing) {
            <iframe class="video-dialog__embed" [src]="videoEmbedUrl()" [title]="'Video Instagram: ' + project.title" loading="eager" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
          } @else {
            <div class="video-dialog__privacy">
              <p class="eyebrow">Contenuto esterno</p>
              <h3>Per riprodurre il video serve il consenso marketing.</h3>
              <p>L’embed Instagram viene caricato solo dopo il consenso. Puoi anche aprire il post direttamente su Instagram.</p>
              <div class="button-row">
                <button class="button" type="button" (click)="openConsentPreferences()">Modifica preferenze</button>
                <a class="text-link" [href]="project.instagramPostUrl" target="_blank" rel="noopener noreferrer">Apri Instagram <span aria-hidden="true">↗&#xFE0E;</span></a>
              </div>
            </div>
          }
        </section>
      </div>
    }

    <section class="section section--accent cta-band cta-band--home-project home-closing" appScrollScene>
      <div class="cta-band__image" aria-hidden="true">
        <img src="/images/banner-prossimo-progetto-verde-oro.webp" alt="" loading="lazy" decoding="async" width="2048" height="768" />
      </div>
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
  readonly projectPreviews = [
    { project: siteConfig.portfolio[0], image: siteConfig.images.production, category: 'Video · Storytelling' },
    { project: siteConfig.portfolio[1], image: siteConfig.images.ads, category: 'Eventi · Promozione' },
    { project: siteConfig.portfolio[2], image: siteConfig.images.social, category: 'Social · Contenuti' },
  ];
  readonly tracking = inject(TrackingService);
  readonly consent = inject(ConsentService);
  readonly activeProject = signal<VideoProject | null>(null);
  readonly videoEmbedUrl = computed<SafeResourceUrl | null>(() => {
    const project = this.activeProject();
    return project ? this.sanitizer.bypassSecurityTrustResourceUrl(project.instagramEmbedUrl) : null;
  });

  private readonly seo = inject(SeoService);
  private readonly sanitizer = inject(DomSanitizer);
  private videoTrigger: HTMLButtonElement | null = null;

  @ViewChild('videoDialog') private videoDialog?: ElementRef<HTMLElement>;
  readonly serviceEntries = serviceEntries;

  openVideo(project: VideoProject, event: MouseEvent): void {
    this.videoTrigger = event.currentTarget as HTMLButtonElement;
    this.activeProject.set(project);
    this.tracking.track('video_case_open', { case_study: project.client, video_provider: 'instagram' });
    setTimeout(() => this.videoDialog?.nativeElement.focus());
  }

  closeVideo(): void {
    this.activeProject.set(null);
    queueMicrotask(() => this.videoTrigger?.focus());
  }

  openConsentPreferences(): void {
    this.activeProject.set(null);
    this.consent.openPreferences();
  }

  ngOnInit(): void {
    this.seo.setPage(pageMetadata.home, [
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${siteConfig.origin}/#website`,
        name: 'Memento Production',
        url: siteConfig.origin,
        publisher: { '@id': `${siteConfig.origin}/#organization` },
      },
    ]);
  }
}
