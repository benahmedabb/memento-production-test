import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../core/seo.service';
import { pageMetadata, siteConfig } from '../core/site.config';
import { PageMotionDirective } from '../shared/page-motion.directive';
import { PortfolioHeroCarouselComponent } from '../shared/portfolio-hero-carousel.component';

@Component({
  imports: [PageMotionDirective, PortfolioHeroCarouselComponent, RouterLink],
  template: `
    <app-portfolio-hero-carousel [projects]="heroProjects">
      <div class="shell page-hero__content">
        <p appPageMotion="hero" [motionDelay]="140" class="eyebrow">Portfolio</p>
        <h1 appPageMotion="hero" [motionDelay]="330">Progetti costruiti per essere visti, capiti e condivisi.</h1>
        <p appPageMotion="hero" [motionDelay]="560">Tre progetti, tre modi diversi di dare forma a un messaggio.</p>
      </div>
    </app-portfolio-hero-carousel>

    <section class="section">
      <div class="shell portfolio-stack">
        @for (project of config.portfolio; track project.client) {
          <article appPageMotion="rise" [motionDelay]="$index * 180" class="portfolio-entry">
            <div class="portfolio-index" aria-hidden="true">0{{ $index + 1 }}</div>
            <div class="portfolio-entry__media">
              <img [src]="project.coverUrl" [alt]="'Copertina del progetto ' + project.title + ' per ' + project.client" loading="lazy" decoding="async" width="1200" height="675" />
            </div>
            <div class="portfolio-entry__body">
              <p class="eyebrow">{{ project.client }}</p>
              <h2>{{ project.title }}</h2>
              <p>{{ project.summary }}</p>
              <ul class="tag-list" aria-label="Caratteristiche del progetto">
                @for (tag of project.tags; track tag) { <li>{{ tag }}</li> }
              </ul>
            </div>
            <ul class="portfolio-stats" aria-label="Metriche del progetto">
              @for (stat of project.stats; track stat.label) { <li>{{ stat.displayValue }} {{ stat.label }}</li> }
            </ul>
          </article>
        }
      </div>
    </section>

    <section class="section section--accent cta-band cta-band--portfolio-case">
      <div class="cta-band__image" aria-hidden="true">
        <img src="/images/banner-il-tuo-caso-verde-oro.webp" alt="" loading="lazy" decoding="async" width="1907" height="825" />
      </div>
      <div class="shell cta-band__inner">
        <div appPageMotion="rise"><p class="eyebrow">Il tuo caso</p><h2>Hai una storia che merita la sua forma?</h2></div>
        <a appPageMotion="rise" [motionDelay]="180" class="button button--ink" routerLink="/contatti">Contattaci <span aria-hidden="true">↗</span></a>
      </div>
    </section>
  `,
})
export class PortfolioPageComponent implements OnInit {
  readonly config = siteConfig;
  readonly heroProjects = [siteConfig.portfolio[1], siteConfig.portfolio[0], siteConfig.portfolio[2]] as const;
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.setPage(pageMetadata.portfolio, {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: pageMetadata.portfolio.title,
      url: `${siteConfig.origin}${pageMetadata.portfolio.path}`,
      isPartOf: { '@id': `${siteConfig.origin}/#organization` },
    });
  }
}
