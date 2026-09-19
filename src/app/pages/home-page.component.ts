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
import { ScrollSceneDirective } from '../shared/scroll-scene.directive';

type VideoProject = (typeof siteConfig.portfolio)[number];

@Component({
  imports: [AnimatedMetricComponent, PageMotionDirective, RouterLink, CinematicHeroComponent, ScrollSceneDirective],
  template: `
    <app-cinematic-hero />

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
            <p>Uniamo immagini, strategia e identità. Per trasformare l’attenzione di un momento in un’impressione che dura.</p>
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
        </div>
        <a appPageMotion="rise" [motionDelay]="180" class="text-link" routerLink="/portfolio">Apri il portfolio <span aria-hidden="true">→&#xFE0E;</span></a>
      </div>
      <div class="shell video-case-rail" aria-label="Video case study">
        @for (project of config.portfolio; track project.client) {
          <article appPageMotion="rise" [motionDelay]="$index * 200" class="video-case">
            <button class="video-case__trigger" type="button" aria-haspopup="dialog" [attr.aria-label]="'Guarda il video ' + project.title + ' per ' + project.client" (click)="openVideo(project, $event)">
              <span appPageMotion="mask" [motionDelay]="$index * 120" class="video-case__media">
                <img [src]="project.coverUrl" [alt]="'Copertina del video ' + project.title + ' per ' + project.client" loading="lazy" width="1280" height="720" />
                <span class="video-case__top"><span class="video-case__play" aria-hidden="true">▶</span></span>
              </span>
              <span class="video-case__body">
                <span class="video-case__client">{{ project.client }}</span>
                <span class="video-case__title">{{ project.title }}</span>
                <span class="video-case__cta">Guarda il video <span aria-hidden="true">↗&#xFE0E;</span></span>
              </span>
            </button>
            <div class="video-case__results">
              <dl class="video-case__stats">
                @for (stat of project.stats; track stat.label) {
                  <div class="video-case__metric">
                    <dd><app-animated-metric [metric]="stat" [delay]="$index * 90" /></dd>
                    <dt>{{ stat.label }}</dt>
                  </div>
                }
              </dl>
            </div>
          </article>
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

    @if (activeProject(); as project) {
      <div class="video-dialog-backdrop" (click)="closeVideo()">
        <section #videoDialog class="video-dialog" role="dialog" aria-modal="true" aria-labelledby="video-dialog-title" tabindex="-1" (click)="$event.stopPropagation()" (keydown.escape)="closeVideo()">
          <div class="video-dialog__heading">
            <div><p class="eyebrow">{{ project.client }}</p><h2 id="video-dialog-title">{{ project.title }}</h2></div>
            <button class="icon-button" type="button" aria-label="Chiudi video" (click)="closeVideo()">×</button>
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
          <a class="button button--ink" routerLink="/contatti">Parla con noi <span aria-hidden="true">↗&#xFE0E;</span></a>
          <a class="text-link" [href]="config.contact.whatsappUrl" target="_blank" rel="noopener noreferrer" (click)="tracking.trackContact('whatsapp', 'home_cta')">WhatsApp <span aria-hidden="true">→&#xFE0E;</span></a>
        </div>
      </div>
    </section>
  `,
})
export class HomePageComponent implements OnInit {
  readonly statementWords = ['Non', 'basta', 'farsi', 'vedere.', 'Bisogna', 'farsi', 'ricordare.'];
  readonly config = siteConfig;
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
        '@type': 'ProfessionalService',
        '@id': `${siteConfig.origin}/#organization`,
        name: 'Memento Production',
        url: siteConfig.origin,
        email: siteConfig.contact.email,
        telephone: '+393295571533',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Via Fortunato Postiglione 46',
          addressLocality: 'Moncalieri',
          addressRegion: 'TO',
          addressCountry: 'IT',
        },
        areaServed: { '@type': 'Country', name: 'Italia' },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Memento Production',
        url: siteConfig.origin,
      },
    ]);
  }
}
