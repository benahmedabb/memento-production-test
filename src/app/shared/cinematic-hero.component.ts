import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { siteConfig } from '../core/site.config';
import { TrackingService } from '../core/tracking.service';
import { ScrollSceneDirective } from './scroll-scene.directive';

@Component({
  selector: 'app-cinematic-hero',
  imports: [RouterLink, ScrollSceneDirective],
  template: `
    <section class="cinema" appScrollScene="cover" aria-labelledby="home-title">
      <div class="cinema__stage">
        <div class="cinema__ambient" aria-hidden="true"></div>
        <div class="cinema__frame">
          <img class="cinema__image" [src]="image.src" [srcset]="image.srcset" [sizes]="image.sizes"
            [alt]="image.alt" width="1920" height="1080" fetchpriority="high" />
          <div class="cinema__shade" aria-hidden="true"></div>
        </div>
        <div class="cinema__grain" aria-hidden="true"></div>

        <div class="shell cinema__layout">
          <div class="cinema__topline">
            <p class="eyebrow eyebrow--gold"><span class="cinema__dot" aria-hidden="true"></span>Memento Production</p>
            <span class="cinema__edition">Strategia. Visione. Identità.</span>
          </div>

          <div class="cinema__intro">
            <div class="cinema__definition">
              <p class="cinema__entry"><span>me·mèn·to</span><span>sostantivo maschile</span></p>
              <h1 id="home-title" class="cinema__title">
                <span class="cinema__line"><span>Atto o affermazione</span></span>{{ ' ' }}
                <span class="cinema__line"><span>che ha il fine di</span></span>{{ ' ' }}
                <span class="cinema__line cinema__line--gold"><span>ricordare</span></span>{{ ' ' }}
                <span class="cinema__line cinema__line--gold"><span>qualcosa.</span></span>
              </h1>
            </div>
            <span class="cinema__annotation" aria-hidden="true"><span>01 / Il senso del nostro nome</span><span class="cinema__cross">+</span></span>
          </div>

          <div class="cinema__outro" aria-hidden="true">
            <span class="eyebrow eyebrow--gold">Ogni dettaglio lascia una traccia.</span>
            <p>Diamo forma<br />a ciò che <em>resta.</em></p>
          </div>

          <div class="cinema__bottom">
            <p class="cinema__lead">Agenzia di comunicazione e marketing a Moncalieri, per aziende di Torino, Pinerolo e Chieri. Siti web, e-commerce, gestione social, creazione contenuti, ADS, strategia e grafica a 360° per far crescere la tua azienda.</p>
            <a class="cinema__cta" routerLink="/contatti" (click)="tracking.trackQuote('home_hero')">Richiedi un preventivo <span aria-hidden="true">↗&#xFE0E;</span></a>
          </div>
          <div class="cinema__footnote">
            <a class="cinema__scroll" href="#progetti"><span aria-hidden="true">↓&#xFE0E;</span> Scorri per scoprire</a>
            <span class="cinema__progress" aria-hidden="true"><span></span></span>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class CinematicHeroComponent {
  readonly tracking = inject(TrackingService);
  readonly image = siteConfig.images.hero;
}
