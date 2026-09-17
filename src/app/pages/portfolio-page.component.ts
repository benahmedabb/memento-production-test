import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../core/seo.service';
import { pageMetadata, siteConfig } from '../core/site.config';
import { PageMotionDirective } from '../shared/page-motion.directive';
import { KineticTextComponent } from '../shared/kinetic-text.component';
import { ScrollSceneDirective } from '../shared/scroll-scene.directive';
import { AnimatedMetricComponent } from '../shared/animated-metric.component';
import { PortfolioHeroCarouselComponent } from '../shared/portfolio-hero-carousel.component';

@Component({
  imports: [AnimatedMetricComponent, KineticTextComponent, ScrollSceneDirective, PageMotionDirective, PortfolioHeroCarouselComponent, RouterLink],
  template: `
    <app-portfolio-hero-carousel [projects]="heroProjects">
      <div class="shell page-hero__content">
        <p appPageMotion="hero" [motionDelay]="140" class="eyebrow">Portfolio</p>
        <h1><app-kinetic-text text="Progetti costruiti per essere visti, capiti e condivisi." [delay]="160" /></h1>
        <p appPageMotion="hero" [motionDelay]="560">Tre progetti, tre modi diversi di dare forma a un messaggio.</p>
      </div>
    </app-portfolio-hero-carousel>

    <section class="section portfolio-gallery section--sage-soft">
      <div class="shell portfolio-stack">
        @for (project of config.portfolio; track project.client) {
          <article class="portfolio-entry" appScrollScene>
            <div class="portfolio-index" aria-hidden="true"><span>0{{ $index + 1 }}</span> / {{ project.client }}</div>
            <div class="portfolio-entry__visual"><div appPageMotion="mask" class="portfolio-entry__media">
              <img [src]="project.coverUrl" [alt]="'Copertina del progetto ' + project.title + ' per ' + project.client" loading="lazy" decoding="async" width="1200" height="675" />
            </div></div>
            <div class="portfolio-entry__body">
              <p class="eyebrow">{{ project.client }}</p>
              <h2><app-kinetic-text [text]="project.title" /></h2>
              <p>{{ project.summary }}</p>
              <ul class="tag-list" aria-label="Caratteristiche del progetto">
                @for (tag of project.tags; track tag) { <li>{{ tag }}</li> }
              </ul>
              <dl class="portfolio-numbers" aria-label="Metriche del progetto">
                @for (stat of project.stats; track stat.label) {
                  <div><dd><app-animated-metric [metric]="stat" [delay]="$index * 120" /></dd><dt>{{ stat.label }}</dt></div>
                }
              </dl>
              <a class="text-link" [href]="project.instagramPostUrl" target="_blank" rel="noopener noreferrer">Guarda il progetto <span aria-hidden="true">↗</span></a>
            </div>
          </article>
        }
      </div>
    </section>

    <section class="section section--accent cta-band cta-band--portfolio-case chapter-closing" appScrollScene>
      <div class="cta-band__image" aria-hidden="true">
        <img src="/images/banner-il-tuo-caso-verde-oro.webp" alt="" loading="lazy" decoding="async" width="1907" height="825" />
      </div>
      <div class="shell cta-band__inner">
        <div><p class="eyebrow">Il tuo caso</p><h2><app-kinetic-text text="Hai una storia che merita la sua forma?" /></h2></div>
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
