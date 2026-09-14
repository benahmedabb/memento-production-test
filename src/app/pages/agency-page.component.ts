import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../core/seo.service';
import { pageMetadata, siteConfig } from '../core/site.config';
import { AgencyProcessTimelineComponent } from '../shared/agency-process-timeline.component';
import { PageMotionDirective } from '../shared/page-motion.directive';
import { KineticTextComponent } from '../shared/kinetic-text.component';
import { ScrollSceneDirective } from '../shared/scroll-scene.directive';

@Component({
  imports: [KineticTextComponent, ScrollSceneDirective, AgencyProcessTimelineComponent, PageMotionDirective, RouterLink],
  template: `
    <section class="page-hero page-hero--agency chapter-hero" appScrollScene="hero">
      <span class="chapter-hero__frame" aria-hidden="true"></span>
      <div class="page-hero__image" aria-hidden="true">
        <img src="/images/memento-ufficio-hero.webp" alt="" width="1537" height="1023" fetchpriority="high" />
      </div>
      <div class="shell page-hero__content">
        <p appPageMotion="hero" [motionDelay]="140" class="eyebrow">Agenzia</p>
        <h1><app-kinetic-text text="Non aggiungiamo rumore. Mettiamo a fuoco ciò che conta." [delay]="160" /></h1>
        <p appPageMotion="hero" [motionDelay]="560">Una media house per brand che cercano una direzione riconoscibile, dal pensiero al formato finale.</p>
      </div>
    </section>

    <section class="section">
      <div class="shell two-column two-column--offset">
        <div><p class="eyebrow">Il nostro punto di vista</p><h2><app-kinetic-text mode="ink" text="Estetica e strategia non sono due reparti separati." /></h2></div>
        <div appPageMotion="rise" [motionDelay]="180" class="intro-copy"><p>Lavoriamo sulle domande prima dei deliverable: cosa deve restare impresso, a chi stiamo parlando e come una singola idea può vivere bene su più canali.</p><p>Il risultato è un sistema di comunicazione più coerente, dove contenuti, campagne e touchpoint digitali parlano la stessa lingua.</p></div>
      </div>
    </section>

    <app-agency-process-timeline />

    <section class="section agency-image-block editorial-scene" appScrollScene>
      <div class="shell media-split">
        <div class="editorial-scene__frame"><div appPageMotion="mask" class="media-split__image"><img [src]="config.images.production.src" [srcset]="config.images.production.srcset" [sizes]="config.images.production.sizes" [alt]="config.images.production.alt" loading="lazy" width="1200" height="800" /></div></div>
        <div class="media-split__copy"><p class="eyebrow">Competenze connesse</p><h2><app-kinetic-text text="La stessa cura attraversa ogni punto di contatto." /></h2><p>Produzione audiovisiva, gestione social, advertising, grafica e branding, siti web ed e-commerce: scegliamo la combinazione che serve al progetto, non un pacchetto rigido.</p><a class="button" routerLink="/servizi">Esplora i servizi <span aria-hidden="true">→</span></a></div>
      </div>
    </section>
  `,
})
export class AgencyPageComponent implements OnInit {
  readonly config = siteConfig;
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.setPage(pageMetadata.agency, {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: pageMetadata.agency.title,
      url: `${siteConfig.origin}${pageMetadata.agency.path}`,
      about: { '@id': `${siteConfig.origin}/#organization` },
    });
  }
}
