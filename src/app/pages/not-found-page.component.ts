import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../core/seo.service';
import { pageMetadata } from '../core/site.config';
import { PageMotionDirective } from '../shared/page-motion.directive';
import { KineticTextComponent } from '../shared/kinetic-text.component';
import { ScrollSceneDirective } from '../shared/scroll-scene.directive';

@Component({
  imports: [KineticTextComponent, ScrollSceneDirective, PageMotionDirective, RouterLink],
  template: `
    <section class="not-found lost-scene" appScrollScene="hero">
      <span class="lost-scene__number" aria-hidden="true">404</span>
      <div class="shell not-found__content">
        <p appPageMotion="hero" [motionDelay]="140" class="eyebrow">Errore 404</p>
        <h1><app-kinetic-text text="Questa scena non è più qui." [delay]="160" /></h1>
        <p appPageMotion="hero" [motionDelay]="560">La pagina che stai cercando potrebbe essere stata spostata o non essere mai esistita.</p>
        <a appPageMotion="hero" [motionDelay]="760" class="button" routerLink="/">Torna alla home <span aria-hidden="true">→&#xFE0E;</span></a>
      </div>
    </section>
  `,
})
export class NotFoundPageComponent implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.setPage(pageMetadata.notFound, {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: pageMetadata.notFound.title,
    });
  }
}
