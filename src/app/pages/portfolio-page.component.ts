import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../core/seo.service';
import { pageMetadata, siteConfig } from '../core/site.config';
import { PageMotionDirective } from '../shared/page-motion.directive';
import { KineticTextComponent } from '../shared/kinetic-text.component';
import { ScrollSceneDirective } from '../shared/scroll-scene.directive';
import { AnimatedMetricComponent } from '../shared/animated-metric.component';
import { PortfolioHeroCarouselComponent } from '../shared/portfolio-hero-carousel.component';
import { portfolioCaseStudies } from '../core/portfolio-case-studies';
import { photoSource, photoSrcset } from '../core/service-media';

@Component({
  imports: [
    AnimatedMetricComponent,
    KineticTextComponent,
    ScrollSceneDirective,
    PageMotionDirective,
    PortfolioHeroCarouselComponent,
    RouterLink,
  ],
  styles: `
    .portfolio-detail {
      max-width: 560px;
      color: rgba(24, 33, 30, 0.72);
    }
    .portfolio-entry__extra {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-top: 1rem;
    }
    .portfolio-entry__extra img {
      display: block;
      width: 100%;
      height: auto;
    }
    .portfolio-entry__links {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem 2rem;
    }
    .portfolio-entry__visual .portfolio-entry__media--complete {
      aspect-ratio: auto;
    }
    .portfolio-entry .portfolio-entry__media--complete img {
      display: block;
      height: auto;
      object-fit: contain;
      transform: none;
    }
  `,
  template: `
    <app-portfolio-hero-carousel [projects]="heroProjects">
      <div class="shell page-hero__content">
        <p appPageMotion="hero" [motionDelay]="140" class="eyebrow">Portfolio</p>
        <h1>
          <app-kinetic-text
            text="Progetti costruiti per essere visti, capiti e condivisi."
            [delay]="160"
          />
        </h1>
        <p appPageMotion="hero" [motionDelay]="560">
          Identità, contenuti e strategie: il lavoro prende forma nei progetti dei nostri clienti.
        </p>
      </div>
    </app-portfolio-hero-carousel>

    <section class="section portfolio-gallery section--sage-soft">
      <div class="shell portfolio-stack">
        @for (project of projects; track project.slug) {
          <article class="portfolio-entry" [id]="project.slug" appScrollScene>
            <div class="portfolio-index" aria-hidden="true">
              <span>0{{ $index + 1 }}</span> / {{ project.client }}
            </div>
            <div class="portfolio-entry__visual">
              <div
                appPageMotion="mask"
                class="portfolio-entry__media"
                [class.portfolio-entry__media--complete]="project.coverPhoto"
              >
                @if (project.coverPhoto; as photo) {
                  <img
                    [src]="photoSource(photo)"
                    [srcset]="photoSrcset(photo)"
                    sizes="(max-width: 760px) 92vw, 45vw"
                    [alt]="photo.alt"
                    [width]="photo.width"
                    [height]="photo.height"
                    loading="lazy"
                    decoding="async"
                  />
                } @else {
                  <img
                    [src]="project.coverUrl"
                    [alt]="'Copertina del progetto ' + project.title + ' per ' + project.client"
                    loading="lazy"
                    decoding="async"
                    width="1200"
                    height="675"
                  />
                }
              </div>
              @if (project.gallery; as gallery) {
                <div class="portfolio-entry__extra">
                  @for (photo of gallery; track photo.slug) {
                    <a
                      [href]="photoSource(photo, 1920)"
                      target="_blank"
                      rel="noopener"
                      [attr.aria-label]="'Ingrandisci: ' + photo.alt"
                    >
                      <img
                        [src]="photoSource(photo, 640)"
                        [alt]="photo.alt"
                        [width]="photo.width"
                        [height]="photo.height"
                        loading="lazy"
                        decoding="async"
                      />
                    </a>
                  }
                </div>
              }
            </div>
            <div class="portfolio-entry__body">
              <p class="eyebrow">{{ project.client }}</p>
              <h2><app-kinetic-text [text]="project.title" /></h2>
              <p>{{ project.summary }}</p>
              @for (paragraph of project.paragraphs; track $index) {
                <p class="portfolio-detail">{{ paragraph }}</p>
              }
              <ul class="tag-list" aria-label="Caratteristiche del progetto">
                @for (tag of project.tags; track tag) {
                  <li>{{ tag }}</li>
                }
              </ul>
              @if (project.stats.length) {
                <dl
                  class="portfolio-numbers"
                  aria-label="Metriche del contenuto social selezionato"
                >
                  @for (stat of project.stats; track stat.label) {
                    <div>
                      <dd><app-animated-metric [metric]="stat" [delay]="$index * 120" /></dd>
                      <dt>{{ stat.label }}</dt>
                    </div>
                  }
                </dl>
              }
              <div class="portfolio-entry__links">
                <a class="text-link" [href]="project.url" target="_blank" rel="noopener noreferrer"
                  >{{ project.linkLabel }} <span aria-hidden="true">↗&#xFE0E;</span></a
                >
                @if (project.testimonial) {
                  <a
                    class="text-link"
                    routerLink="/video/video-corsi-testimonial-torino"
                    fragment="testimonianza-cliente"
                    >Guarda la testimonianza <span aria-hidden="true">↗</span></a
                  >
                }
              </div>
            </div>
          </article>
        }
      </div>
    </section>

    <section class="section section--accent cta-band cta-band--graphic cta-band--portfolio-case">
      <div class="shell cta-band__inner">
        <div>
          <p class="eyebrow">Il tuo caso</p>
          <h2><app-kinetic-text text="Hai una storia che merita la sua forma?" /></h2>
        </div>
        <a
          appPageMotion="rise"
          [motionDelay]="180"
          class="button button--ink"
          routerLink="/contatti"
          >Contattaci <span aria-hidden="true">↗&#xFE0E;</span></a
        >
      </div>
    </section>
  `,
})
export class PortfolioPageComponent implements OnInit {
  readonly projects = portfolioCaseStudies;
  readonly photoSource = photoSource;
  readonly photoSrcset = photoSrcset;
  readonly heroProjects = [
    siteConfig.portfolio[1],
    siteConfig.portfolio[0],
    siteConfig.portfolio[2],
  ] as const;
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.setPage(pageMetadata.portfolio, {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: pageMetadata.portfolio.title,
      url: `${siteConfig.origin}${pageMetadata.portfolio.path}`,
      isPartOf: { '@id': `${siteConfig.origin}/#website` },
      about: { '@id': `${siteConfig.origin}/#organization` },
    });
  }
}
