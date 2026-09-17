import { Component, ElementRef, ViewChild } from '@angular/core';
import { siteConfig } from '../core/site.config';
import { ScrollSceneDirective } from './scroll-scene.directive';

const stages = [
  {
    number: '01', title: 'Ascolto', label: 'Prima le domande.',
    description: 'Mettiamo in comune obiettivi, pubblico, materiale esistente e contesto competitivo.',
    detail: 'Ogni direzione comincia da una conversazione.',
    image: '/images/memento-ufficio-hero.webp', srcset: '',
    alt: 'Lo spazio di lavoro di Memento Production',
  },
  {
    number: '02', title: 'Direzione', label: 'Un’idea, una rotta.',
    description: 'Trasformiamo le priorità in un impianto creativo, editoriale o digitale concreto.',
    detail: 'Diamo un carattere preciso a ciò che vuoi comunicare.',
    image: siteConfig.images.branding.src, srcset: siteConfig.images.branding.srcset,
    alt: siteConfig.images.branding.alt,
  },
  {
    number: '03', title: 'Produzione', label: 'Il pensiero prende forma.',
    description: 'Coordiniamo persone, immagini, copy e canali per arrivare a un risultato coerente.',
    detail: 'Dal primo ciak all’ultimo dettaglio.',
    image: siteConfig.images.production.src, srcset: siteConfig.images.production.srcset,
    alt: siteConfig.images.production.alt,
  },
  {
    number: '04', title: 'Evoluzione', label: 'È solo l’inizio.',
    description: 'Osserviamo ciò che accade e usiamo i segnali utili per scegliere il passo successivo.',
    detail: 'Un progetto continua a crescere, insieme al brand.',
    image: siteConfig.images.ads.src, srcset: siteConfig.images.ads.srcset,
    alt: siteConfig.images.ads.alt,
  },
] as const;

@Component({
  selector: 'app-agency-process-timeline',
  imports: [ScrollSceneDirective],
  template: `
    <section #sequence id="metodo" class="agency-method agency-scroll" appScrollScene="cover" aria-labelledby="agency-method-title">
      <div class="agency-method__stage">
        <div class="shell agency-method__layout">
          <header class="agency-method__heading">
            <div><p class="eyebrow eyebrow--gold">Il nostro metodo</p><h2 id="agency-method-title">Un processo chiaro.<br /><em>Una visione che prende forma.</em></h2></div>
            <a class="agency-scroll-link" href="/servizi">Scopri le competenze <span aria-hidden="true">↘</span></a>
          </header>

          <ol class="agency-method__deck">
            @for (stage of stages; track stage.number; let index = $index) {
              <li class="agency-method__card" [id]="'metodo-' + stage.number" [style.--step-index]="index">
                <div class="agency-method__media"><img [src]="stage.image" [srcset]="stage.srcset" sizes="(min-width: 860px) 50vw, 100vw" [alt]="stage.alt" width="1200" height="800" loading="lazy" decoding="async" /><span class="agency-method__image-label" aria-hidden="true">Memento / {{ stage.number }}</span></div>
                <div class="agency-method__copy">
                  <span class="agency-method__number" aria-hidden="true">{{ stage.number }}</span>
                  <p class="eyebrow">{{ stage.label }}</p>
                  <h3>{{ stage.title }}</h3>
                  <p class="agency-method__description">{{ stage.description }}</p>
                  <p class="agency-method__detail">{{ stage.detail }}</p>
                </div>
              </li>
            }
          </ol>

          <nav class="agency-method__navigation" aria-label="Esplora le fasi del metodo">
            @for (stage of stages; track stage.number; let index = $index) {
              <button type="button" (click)="goToStep(index)" [attr.aria-label]="'Vai alla fase ' + stage.title"><span>{{ stage.number }}</span> {{ stage.title }}</button>
            }
            <span class="agency-method__progress" aria-hidden="true"></span>
          </nav>
        </div>
      </div>
    </section>
  `,
})
export class AgencyProcessTimelineComponent {
  readonly stages = stages;
  @ViewChild('sequence') private sequence?: ElementRef<HTMLElement>;

  goToStep(index: number): void {
    const root = this.sequence?.nativeElement;
    const stage = root?.querySelector<HTMLElement>('.agency-method__stage');
    if (!root || !stage || index < 0 || index >= this.stages.length) return;

    if (getComputedStyle(stage).position !== 'sticky') {
      root.querySelectorAll<HTMLElement>('.agency-method__card')[index]?.scrollIntoView({ block: 'start', behavior: 'auto' });
      return;
    }

    const header = parseFloat(getComputedStyle(stage).top) || 0;
    const travel = root.offsetHeight - stage.offsetHeight;
    // Cards finish arriving at index / 3.4; stop just after that point.
    const progress = Math.min(1, index / 3.4 + 0.035);
    window.scrollTo({ top: window.scrollY + root.getBoundingClientRect().top - header + travel * progress, behavior: 'auto' });
  }
}
