import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../core/seo.service';
import { pageMetadata } from '../core/site.config';
import { PageMotionDirective } from '../shared/page-motion.directive';

@Component({
  imports: [PageMotionDirective, RouterLink],
  template: `
    <section class="not-found">
      <div class="shell not-found__content">
        <p appPageMotion="hero" [motionDelay]="140" class="eyebrow">Errore 404</p>
        <h1 appPageMotion="hero" [motionDelay]="330">Questa scena non è più qui.</h1>
        <p appPageMotion="hero" [motionDelay]="560">La pagina che stai cercando potrebbe essere stata spostata o non essere mai esistita.</p>
        <a appPageMotion="hero" [motionDelay]="760" class="button" routerLink="/">Torna alla home <span aria-hidden="true">→</span></a>
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
