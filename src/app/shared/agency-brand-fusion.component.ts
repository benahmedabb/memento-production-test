import { Component } from '@angular/core';
import { ScrollSceneDirective } from './scroll-scene.directive';

@Component({
  selector: 'app-agency-brand-fusion',
  imports: [ScrollSceneDirective],
  styleUrl: './agency-brand-fusion.component.scss',
  template: `
    <figure class="brand-fusion" appScrollScene="passage" [scrollSceneOnMobile]="true">
      <div class="brand-fusion__legend" aria-hidden="true">
        <span><i class="brand-fusion__swatches"><i></i><i></i><i></i></i>Estetica</span>
        <span class="brand-fusion__join"></span>
        <span>Strategia<i class="brand-fusion__route"><i></i><i></i><i></i></i></span>
      </div>
      <div class="brand-fusion__frame">
        <img
          class="brand-fusion__image brand-fusion__image--right"
          [src]="image"
          [srcset]="srcset"
          [sizes]="sizes"
          width="1536"
          height="1024"
          alt="Composizione di campioni verde e oro Memento: due nastri di carta attraversano un prisma di vetro e si uniscono a una griglia progettuale."
          loading="lazy"
          decoding="async"
        />
        <img
          class="brand-fusion__image brand-fusion__image--left"
          [src]="image"
          [srcset]="srcset"
          [sizes]="sizes"
          width="1536"
          height="1024"
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
        />
        <span class="brand-fusion__light" aria-hidden="true"></span>
      </div>
      <figcaption class="brand-fusion__caption">
        <span>Il colore dà carattere.<br />La strategia gli dà una direzione.</span>
        <em>Una sola visione.</em>
      </figcaption>
    </figure>
  `,
})
export class AgencyBrandFusionComponent {
  readonly image = '/images/memento-estetica-strategia-1200.webp';
  readonly srcset = '/images/memento-estetica-strategia-640.webp 640w, /images/memento-estetica-strategia-1200.webp 1200w, /images/memento-estetica-strategia-1536.webp 1536w';
  readonly sizes = '(min-width: 1260px) 652px, (min-width: 860px) 54vw, (min-width: 760px) calc(100vw - 4rem), calc(100vw - 2.5rem)';
}
