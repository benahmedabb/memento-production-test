import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { siteConfig } from '../core/site.config';
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
            <h1 id="home-title" class="cinema__title">
              <span class="cinema__line"><span>Le immagini</span></span>
              <span class="cinema__line"><span>cambiano il modo</span></span>
              <span class="cinema__line cinema__line--small"><span>in cui un brand viene</span></span>
              <span class="cinema__line cinema__line--gold"><span>ricordato.</span></span>
            </h1>
            <span class="cinema__annotation" aria-hidden="true"><span>01 / Il primo sguardo</span><span class="cinema__cross">+</span></span>
          </div>

          <div class="cinema__outro" aria-hidden="true">
            <span class="eyebrow eyebrow--gold">Ogni dettaglio lascia una traccia.</span>
            <p>Diamo forma<br />a ciò che <em>resta.</em></p>
          </div>

          <div class="cinema__bottom">
            <p class="cinema__lead">Produzione, strategia e design per costruire una presenza che non passa inosservata.</p>
            <a class="cinema__cta" routerLink="/contatti">Iniziamo una conversazione <span aria-hidden="true">↗</span></a>
          </div>
          <div class="cinema__footnote">
            <a class="cinema__scroll" href="#progetti"><span aria-hidden="true">↓</span> Scorri per scoprire</a>
            <span class="cinema__progress" aria-hidden="true"><span></span></span>
            <a class="cinema__credit" [href]="image.sourceUrl" target="_blank" rel="noopener noreferrer">Foto: {{ image.credit }}</a>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class CinematicHeroComponent {
  readonly image = siteConfig.images.hero;
}
