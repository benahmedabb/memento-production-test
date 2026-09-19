import { Component } from '@angular/core';
import { siteConfig } from '../core/site.config';
import { ScrollSceneDirective } from './scroll-scene.directive';

@Component({
  selector: 'app-agency-opening',
  imports: [ScrollSceneDirective],
  template: `
    <section class="agency-opening agency-scroll" appScrollScene="cover" aria-labelledby="agency-title">
      <div class="agency-opening__stage">
        <div class="agency-opening__photograph" aria-hidden="true">
          <img src="/images/memento-ufficio-hero.webp" alt="" width="1537" height="1023" fetchpriority="high" />
        </div>
        <div class="agency-opening__contact-sheet agency-opening__contact-sheet--left" aria-hidden="true">
          <img [src]="production.src" [srcset]="production.srcset" sizes="22vw" alt="" width="1200" height="800" decoding="async" />
        </div>
        <div class="agency-opening__contact-sheet agency-opening__contact-sheet--right" aria-hidden="true">
          <img [src]="branding.src" [srcset]="branding.srcset" sizes="20vw" alt="" width="1200" height="800" decoding="async" />
        </div>
        <div class="agency-opening__shade" aria-hidden="true"></div>
        <div class="agency-opening__viewfinder" aria-hidden="true"><span></span><span></span><span></span><span></span></div>

        <div class="shell agency-opening__content">
          <div class="agency-opening__top">
            <p class="eyebrow eyebrow--gold">Dentro Memento / Agenzia</p>
            <span aria-hidden="true">Una questione di sguardo.</span>
          </div>
          <h1 id="agency-title" class="agency-opening__title">
            <span class="sr-only">Non aggiungiamo rumore. Mettiamo a fuoco ciò che conta.</span>
            <span class="agency-opening__first" aria-hidden="true"><span>Non aggiungiamo</span><em>rumore.</em></span>
            <span class="agency-opening__second" aria-hidden="true"><span>Mettiamo a fuoco</span><em>ciò che conta.</em></span>
          </h1>
          <div class="agency-opening__bottom">
            <p>Una digital agency per brand che cercano una direzione riconoscibile, dal pensiero al formato finale.</p>
            <a href="/agenzia#metodo" class="agency-scroll-link">Entra nel nostro metodo <span aria-hidden="true">↓&#xFE0E;</span></a>
          </div>
          <div class="agency-opening__timeline" aria-hidden="true"><span>01 / Lo sguardo</span><div><span></span></div><span>02 / La visione</span></div>
        </div>
      </div>
    </section>
  `,
})
export class AgencyOpeningComponent {
  readonly production = siteConfig.images.production;
  readonly branding = siteConfig.images.branding;
}
