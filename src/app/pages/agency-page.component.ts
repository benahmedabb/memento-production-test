import { Component, OnInit, inject } from '@angular/core';
import { SeoService } from '../core/seo.service';
import { pageMetadata, siteConfig } from '../core/site.config';
import { AgencyProcessTimelineComponent } from '../shared/agency-process-timeline.component';
import { AgencyOpeningComponent } from '../shared/agency-opening.component';
import { PageMotionDirective } from '../shared/page-motion.directive';
import { KineticTextComponent } from '../shared/kinetic-text.component';
import { ScrollSceneDirective } from '../shared/scroll-scene.directive';

@Component({
  imports: [AgencyOpeningComponent, KineticTextComponent, ScrollSceneDirective, AgencyProcessTimelineComponent, PageMotionDirective],
  template: `
    <app-agency-opening />

    <section class="section agency-manifesto section--sage" appScrollScene>
      <div class="shell two-column two-column--offset">
        <div><p class="eyebrow">Il nostro punto di vista</p><h2><app-kinetic-text mode="ink" text="Estetica e strategia non sono due reparti separati." /></h2></div>
        <div appPageMotion="rise" [motionDelay]="180" class="intro-copy"><p>Lavoriamo sulle domande prima dei deliverable: cosa deve restare impresso, a chi stiamo parlando e come una singola idea può vivere bene su più canali.</p><p>Il risultato è un sistema di comunicazione più coerente, dove contenuti, campagne e touchpoint digitali parlano la stessa lingua.</p></div>
      </div>
    </section>

    <app-agency-process-timeline />
  `,
})
export class AgencyPageComponent implements OnInit {
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
