import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { siteConfig } from '../core/site.config';
import { PageMotionDirective } from './page-motion.directive';

@Component({
  selector: 'app-agency-people',
  imports: [RouterLink, PageMotionDirective],
  template: `
    <section id="chi-siamo" class="people-opening" aria-labelledby="people-title">
      <div class="shell people-opening__topline">
        <p class="eyebrow">Chi siamo / Memento Production</p>
        <span>Moncalieri, Torino · Dal 2022</span>
      </div>
      <div class="shell people-opening__layout">
        <div class="people-opening__copy" appPageMotion="rise">
          <p class="people-opening__accent">Un po’ di noi</p>
          <h2 id="people-title" class="people-opening__title">Non solo<br /><span class="people-opening__outline">numeri,</span><br />ma <em>persone.</em></h2>
          <div class="people-opening__intro">
            <p><strong>Stefan ed Elena, alla guida di una squadra.</strong> Circa 8 professionisti, competenze diverse e un’unica regia per la tua comunicazione.</p>
            <a class="text-link" routerLink="/agenzia" fragment="squadra">Conosci il team Memento <span aria-hidden="true">↓&#xFE0E;</span></a>
          </div>
        </div>
        <figure class="people-opening__portrait" appPageMotion="rise" [motionDelay]="120">
          <div class="people-opening__image">
            <img [src]="portrait.src" [srcset]="portrait.srcset" sizes="(min-width: 1260px) 570px, (min-width: 860px) 47vw, calc(100vw - 2.5rem)" [alt]="portrait.alt" width="1280" height="1920" loading="lazy" decoding="async" />
            <span class="people-opening__photo-note" aria-hidden="true">Le persone dietro la visione.</span>
            <div class="people-opening__stamp"><span>Una squadra.</span><strong>Una visione.</strong><svg viewBox="0 0 40 40" width="32" height="32" aria-hidden="true"><path d="M20 3v34M3 20h34M8 8l24 24M8 32 32 8" /></svg></div>
          </div>
          <figcaption><span><strong>Elena</strong>Strategia & gestione social</span><span><strong>Stefan</strong>Founder & direzione creativa</span></figcaption>
        </figure>
      </div>
      <div class="shell people-opening__footline">
        <span>Agenzia di comunicazione e marketing a Torino</span>
        <a routerLink="/agenzia" fragment="chiavi-in-mano">Dall’idea al risultato. Chiavi in mano. <span aria-hidden="true">↘&#xFE0E;</span></a>
      </div>
    </section>
  `,
})
export class AgencyPeopleComponent {
  readonly portrait = siteConfig.agencyPortrait;
}
