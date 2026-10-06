import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollSceneDirective } from './scroll-scene.directive';

@Component({
  selector: 'app-agency-team',
  imports: [RouterLink, ScrollSceneDirective],
  template: `
    <section id="squadra" class="people-team" appScrollScene="cover" [scrollSceneOnMobile]="true" aria-labelledby="people-team-title">
      <div class="people-team__stage">
        <div class="shell">
          <header class="people-team__heading">
            <div><p class="eyebrow eyebrow--gold">Le persone fanno la differenza</p><h2 id="people-team-title">Più talenti.<br /><em>Una sola direzione.</em></h2></div>
            <p>Content creator, strategist, graphic designer e web developer. Una squadra che si costruisce attorno alle esigenze del tuo progetto.</p>
          </header>
          <div class="people-team__composition">
            <div class="people-team__count"><span>Circa</span><strong>8</strong><span>professionisti.<br />Un team, davvero.</span><div class="people-team__dots" aria-hidden="true">@for (dot of dots; track $index) { <i [style.--dot-index]="$index"></i> }</div></div>
            <div class="people-team__flow">
              <ul class="people-team__roles" aria-label="Le competenze del team">
                @for (role of roles; track role.title) {
                  <li [style.--role-index]="$index"><a [routerLink]="role.path"><span class="people-team__role-number" aria-hidden="true">0{{ $index + 1 }}</span><span><strong>{{ role.title }}</strong><small>{{ role.description }}</small></span><span class="people-team__role-arrow" aria-hidden="true">↗&#xFE0E;</span></a></li>
                }
              </ul>
              <svg class="people-team__connections" viewBox="0 0 160 360" preserveAspectRatio="none" fill="none" aria-hidden="true"><path class="people-team__wire" d="M0 45H35Q70 45 70 90V145Q70 180 105 180H160M0 135H40Q75 135 75 160Q75 180 105 180M0 225H40Q75 225 75 200Q75 180 105 180M0 315H35Q70 315 70 270V215Q70 180 105 180" /><path class="people-team__current" pathLength="1" d="M0 45H35Q70 45 70 90V145Q70 180 105 180H160M0 135H40Q75 135 75 160Q75 180 105 180M0 225H40Q75 225 75 200Q75 180 105 180M0 315H35Q70 315 70 270V215Q70 180 105 180" /></svg>
              <a class="people-team__destination" routerLink="/agenzia" fragment="chiavi-in-mano">
                <span class="people-team__key" aria-hidden="true"><svg viewBox="0 0 100 100" fill="none"><circle cx="36" cy="36" r="18" /><circle cx="36" cy="36" r="5" /><path d="m49 49 32 32 9-9-8-8-7 7-8-8 7-7-8-8" /></svg></span>
                <span class="people-team__destination-label">Il tuo progetto</span><strong>Chiavi<br />in mano.</strong><span class="people-team__destination-link">Una regia unica <span aria-hidden="true">↘&#xFE0E;</span></span>
              </a>
            </div>
          </div>
          <div class="people-team__footline"><p>Tu parli con noi. Noi mettiamo in connessione tutte le competenze.</p><a routerLink="/google-meta-ads">Anche le tue campagne Google e Meta Ads <span aria-hidden="true">↗&#xFE0E;</span></a></div>
        </div>
      </div>
    </section>
  `,
})
export class AgencyTeamComponent {
  readonly dots = Array.from({ length: 8 });
  readonly roles = [
    { title: 'Content creator', description: 'Fotografia & videomaking', path: '/produzione-video-fotografia' },
    { title: 'Strategist', description: 'Strategia & gestione social', path: '/social-media' },
    { title: 'Graphic designer', description: 'Identità visiva & branding', path: '/grafica-branding' },
    { title: 'Web developer', description: 'Siti web & e-commerce', path: '/siti-web-ecommerce' },
  ];
}
