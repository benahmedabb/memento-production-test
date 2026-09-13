import { Component, ElementRef, OnInit, ViewChild, computed, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { ConsentService } from '../core/consent.service';
import { SeoService } from '../core/seo.service';
import { pageMetadata, siteConfig } from '../core/site.config';
import { TrackingService } from '../core/tracking.service';
import { AnimatedMetricComponent } from '../shared/animated-metric.component';
import { PageMotionDirective } from '../shared/page-motion.directive';

type VideoProject = (typeof siteConfig.portfolio)[number];

@Component({
  imports: [AnimatedMetricComponent, PageMotionDirective, RouterLink],
  template: `
    <section class="hero hero--home">
      <img appPageMotion="hero" class="hero-media" [src]="config.images.hero.src" [srcset]="config.images.hero.srcset" [sizes]="config.images.hero.sizes" [alt]="config.images.hero.alt" width="1920" height="1080" fetchpriority="high" />
      <div class="hero-wash"></div>
      <div class="shell hero-content">
        <p appPageMotion="hero" [motionDelay]="140" class="eyebrow eyebrow--light">Memento Production</p>
        <h1 appPageMotion="hero" [motionDelay]="330">Le immagini cambiano il modo in cui un brand viene ricordato.</h1>
        <p appPageMotion="hero" [motionDelay]="560" class="hero-lead">Produzione, strategia e design per costruire una presenza che non passa inosservata.</p>
        <div appPageMotion="hero" [motionDelay]="800" class="button-row">
          <a class="button" routerLink="/contatti">Iniziamo una conversazione <span aria-hidden="true">↗</span></a>
          <a class="text-link text-link--light" routerLink="/portfolio">Guarda i lavori <span aria-hidden="true">↓</span></a>
        </div>
      </div>
      <a class="hero-credit" [href]="config.images.hero.sourceUrl" target="_blank" rel="noopener noreferrer">Foto: {{ config.images.hero.credit }}</a>
    </section>

    <section class="section">
      <div class="shell section-heading section-heading--stack-mobile">
        <div appPageMotion="rise">
          <p class="eyebrow">Progetti selezionati</p>
          <h2>Quando il messaggio trova la sua forma.</h2>
        </div>
        <a appPageMotion="rise" [motionDelay]="180" class="text-link" routerLink="/portfolio">Apri il portfolio <span aria-hidden="true">→</span></a>
      </div>
      <div class="shell video-case-rail" aria-label="Video case study">
        @for (project of config.portfolio; track project.client) {
          <article appPageMotion="rise" [motionDelay]="$index * 200" class="video-case">
            <button class="video-case__trigger" type="button" aria-haspopup="dialog" [attr.aria-label]="'Guarda il video ' + project.title + ' per ' + project.client" (click)="openVideo(project, $event)">
              <span class="video-case__media">
                <img [src]="project.coverUrl" [alt]="'Copertina del video ' + project.title + ' per ' + project.client" loading="lazy" width="1280" height="720" />
                <span class="video-case__top"><span class="video-case__play" aria-hidden="true">▶</span></span>
              </span>
              <span class="video-case__body">
                <span class="video-case__client">{{ project.client }}</span>
                <span class="video-case__title">{{ project.title }}</span>
                <span class="video-case__cta">Guarda il video <span aria-hidden="true">↗</span></span>
              </span>
            </button>
            <div class="video-case__results">
              <dl class="video-case__stats">
                @for (stat of project.stats; track stat.label) {
                  <div class="video-case__metric">
                    <dd><app-animated-metric [metric]="stat" [delay]="$index * 200" /></dd>
                    <dt>{{ stat.label }}</dt>
                  </div>
                }
              </dl>
            </div>
          </article>
        }
      </div>
    </section>

    <section class="section section--dark services-showcase">
      <div class="shell section-heading">
        <div appPageMotion="rise">
          <p class="eyebrow eyebrow--gold">Cosa facciamo</p>
          <h2>Strumenti diversi. Una presenza più nitida.</h2>
        </div>
        <a appPageMotion="rise" [motionDelay]="180" class="text-link text-link--light" routerLink="/servizi">Tutti i servizi <span aria-hidden="true">→</span></a>
      </div>
      <div class="shell service-grid">
        @for (service of serviceEntries; track service.key) {
          @let image = config.images[service.service.image];
          <a appPageMotion="rise" [motionDelay]="$index * 360" class="service-card" [routerLink]="service.path" [attr.aria-label]="'Scopri il servizio ' + service.service.shortTitle">
            <span class="service-card__media">
              <img [src]="image.src" [srcset]="image.srcset" [sizes]="image.sizes" [alt]="image.alt" width="1280" height="801" loading="lazy" decoding="async" />
            </span>
            <span class="service-card__body">
              <h3>{{ service.service.shortTitle }}</h3>
              <p>{{ service.service.description }}</p>
              <span class="card-arrow" aria-hidden="true">↗</span>
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
                <a class="text-link" [href]="project.instagramPostUrl" target="_blank" rel="noopener noreferrer">Apri Instagram <span aria-hidden="true">↗</span></a>
              </div>
            </div>
          }
        </section>
      </div>
    }

    <section class="section section--accent cta-band cta-band--home-project">
      <div class="cta-band__image" aria-hidden="true">
        <img src="/images/banner-prossimo-progetto-verde-oro.webp" alt="" loading="lazy" decoding="async" width="2048" height="768" />
      </div>
      <div class="shell cta-band__inner">
        <div appPageMotion="rise">
          <p class="eyebrow">Il prossimo progetto</p>
          <h2>Diamo alla tua idea una direzione memorabile.</h2>
        </div>
        <div appPageMotion="rise" [motionDelay]="180" class="cta-band__links">
          <a class="button button--ink" routerLink="/contatti">Parla con noi <span aria-hidden="true">↗</span></a>
          <a class="text-link" [href]="config.contact.whatsappUrl" target="_blank" rel="noopener noreferrer" (click)="tracking.trackContact('whatsapp', 'home_cta')">WhatsApp <span aria-hidden="true">→</span></a>
        </div>
      </div>
    </section>
  `,
})
export class HomePageComponent implements OnInit {
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
  readonly serviceEntries = [
    { key: 'production', path: '/produzione-video-fotografia', service: siteConfig.services.production },
    { key: 'social', path: '/social-media', service: siteConfig.services.social },
    { key: 'ads', path: '/google-meta-ads', service: siteConfig.services.ads },
    { key: 'branding', path: '/branding-siti-web', service: siteConfig.services.branding },
  ];

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
