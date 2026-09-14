import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, PLATFORM_ID, QueryList, Renderer2, RendererStyleFlags2, ViewChild, ViewChildren, inject } from '@angular/core';
import { KineticTextComponent } from './kinetic-text.component';

interface AgencyProcessStage {
  readonly number: string;
  readonly title: string;
  readonly description: string;
  readonly progress: number;
}

const processStages: readonly AgencyProcessStage[] = [
  {
    number: '01',
    title: 'Ascolto',
    description: 'Mettiamo in comune obiettivi, pubblico, materiale esistente e contesto competitivo.',
    progress: 0.02,
  },
  {
    number: '02',
    title: 'Direzione',
    description: 'Trasformiamo le priorità in un impianto creativo, editoriale o digitale concreto.',
    progress: 0.35,
  },
  {
    number: '03',
    title: 'Produzione',
    description: 'Coordiniamo persone, immagini, copy e canali per arrivare a un risultato coerente.',
    progress: 0.68,
  },
  {
    number: '04',
    title: 'Evoluzione',
    description: 'Osserviamo ciò che accade e usiamo i segnali utili per scegliere il passo successivo.',
    progress: 1,
  },
];

@Component({
  selector: 'app-agency-process-timeline',
  imports: [KineticTextComponent],
  template: `
    <section #timelineRoot class="section section--dark agency-process" [class.agency-process--enhanced]="isEnhanced" [class.agency-process--ready]="isReady">
      <div class="shell">
        <header class="agency-process__intro">
          <p class="eyebrow eyebrow--gold">Metodo</p>
          <h2><app-kinetic-text text="Un processo chiaro, senza formule preconfezionate." /></h2>
        </header>

        <div class="agency-process__timeline">
          <svg class="agency-process__track agency-process__track--desktop" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
            <path class="agency-process__track-base" pathLength="1" d="M38 12.5 C38 20 62 30 62 37.5 C62 45 38 55 38 62.5 C38 70 62 80 62 87.5" />
            <path class="agency-process__track-progress" pathLength="1" d="M38 12.5 C38 20 62 30 62 37.5 C62 45 38 55 38 62.5 C38 70 62 80 62 87.5" />
          </svg>
          <svg class="agency-process__track agency-process__track--mobile" viewBox="0 0 24 1000" preserveAspectRatio="none" aria-hidden="true" focusable="false">
            <path class="agency-process__track-base" pathLength="1" d="M12 0 V1000" />
            <path class="agency-process__track-progress" pathLength="1" d="M12 0 V1000" />
          </svg>

          <ol class="agency-process__steps">
            @for (stage of stages; track stage.number; let index = $index) {
              <li #stageElement class="agency-process__step" [class.agency-process__step--complete]="index <= completedIndex" [class.agency-process__step--active]="index === completedIndex">
                <span class="agency-process__node" aria-hidden="true"><span></span></span>
                <article class="agency-process__card">
                  <p class="agency-process__number" aria-hidden="true">{{ stage.number }}</p>
                  <div>
                    <h3>{{ stage.title }}</h3>
                    <p>{{ stage.description }}</p>
                  </div>
                </article>
              </li>
            }
          </ol>
        </div>
      </div>
    </section>
  `,
})
export class AgencyProcessTimelineComponent implements AfterViewInit, OnDestroy {
  readonly stages = processStages;
  completedIndex = 0;
  isEnhanced = false;
  isReady = false;

  @ViewChild('timelineRoot') private readonly timelineRoot?: ElementRef<HTMLElement>;
  @ViewChildren('stageElement') private readonly stageElements!: QueryList<ElementRef<HTMLElement>>;

  private readonly platformId = inject(PLATFORM_ID);
  private readonly renderer = inject(Renderer2);
  private readonly changeDetector = inject(ChangeDetectorRef);
  private observer?: IntersectionObserver;
  private animationFrame?: number;
  private readonly fullyVisibleStages = new Set<HTMLElement>();

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId) || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    this.setCompletedIndex(this.getInitialIndex(), true);
    this.isEnhanced = true;
    this.changeDetector.detectChanges();

    this.observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const stage = entry.target as HTMLElement;

        if (entry.isIntersecting && entry.intersectionRatio >= 1) {
          this.fullyVisibleStages.add(stage);
        } else {
          this.fullyVisibleStages.delete(stage);
        }
      }

      this.setCompletedIndex(this.getFullyVisibleIndex());
    }, { threshold: [0, 1] });

    this.stageElements.forEach(({ nativeElement }) => this.observer?.observe(nativeElement));
    this.animationFrame = requestAnimationFrame(() => {
      this.isReady = true;
      this.changeDetector.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();

    if (this.animationFrame !== undefined) {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  private getInitialIndex(): number {
    let index = 0;

    this.stageElements.forEach(({ nativeElement }, stageIndex) => {
      const bounds = nativeElement.getBoundingClientRect();
      const visibleHeight = Math.max(0, Math.min(bounds.bottom, window.innerHeight) - Math.max(bounds.top, 0));

      if (visibleHeight / bounds.height >= 1) {
        index = stageIndex;
      }
    });

    return index;
  }

  private getFullyVisibleIndex(): number {
    if (!this.fullyVisibleStages.size) {
      return this.completedIndex;
    }

    let index = this.completedIndex;

    this.stageElements.forEach(({ nativeElement }, stageIndex) => {
      if (this.fullyVisibleStages.has(nativeElement)) {
        index = stageIndex;
      }
    });

    return index;
  }

  private setCompletedIndex(index: number, force = false): void {
    const nextIndex = force ? index : Math.max(this.completedIndex, index);

    if (!force && nextIndex === this.completedIndex) {
      return;
    }

    this.completedIndex = nextIndex;
    const stage = this.stages[nextIndex];

    if (stage && this.timelineRoot) {
      this.renderer.setStyle(this.timelineRoot.nativeElement, '--agency-process-progress', stage.progress.toString(), RendererStyleFlags2.DashCase);
    }

    if (this.isEnhanced) {
      this.changeDetector.detectChanges();
    }
  }
}
