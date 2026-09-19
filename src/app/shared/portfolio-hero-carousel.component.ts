import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, PLATFORM_ID, ViewChild, inject } from '@angular/core';
import { PortfolioProject } from '../core/site.config';
import { ScrollSceneDirective } from './scroll-scene.directive';

@Component({
  selector: 'app-portfolio-hero-carousel',
  imports: [ScrollSceneDirective],
  template: `
    <section
      #carouselRoot
      class="page-hero page-hero--portfolio portfolio-carousel chapter-hero"
      appScrollScene="hero"
      role="region"
      aria-roledescription="carousel"
      aria-label="Copertine dei progetti Memento Production"
      (mouseenter)="setPointerPause(true)"
      (mouseleave)="setPointerPause(false)"
      (focusin)="setFocusPause(true)"
      (focusout)="setFocusPause($event)"
    >
      <div class="portfolio-carousel__slides" aria-live="off">
        @for (project of projects; track project.client; let index = $index) {
          <div class="portfolio-carousel__slide" [class.is-active]="index === activeIndex" [attr.aria-hidden]="index !== activeIndex">
            <img [src]="project.coverUrl" alt="" width="1200" height="675" decoding="async" [attr.fetchpriority]="index === 0 ? 'high' : null" />
          </div>
        }
      </div>
      <div class="portfolio-carousel__wash" aria-hidden="true"></div>
      <span class="chapter-hero__frame" aria-hidden="true"></span>

      <div class="portfolio-carousel__content">
        <ng-content />
      </div>

      @if (projects.length > 1) {
        @if (!prefersReducedMotion) {
          <button class="portfolio-carousel__pause" type="button" [attr.aria-pressed]="userPaused" (click)="togglePlayback()">{{ userPaused ? 'Riprendi slideshow' : 'Pausa slideshow' }}</button>
        }
        <span class="portfolio-carousel__caption" aria-hidden="true">0{{ activeIndex + 1 }} / {{ projects[activeIndex].client }}</span>
        <button class="portfolio-carousel__arrow portfolio-carousel__arrow--previous" type="button" (click)="previous()" aria-label="Mostra la copertina precedente"><span aria-hidden="true">←&#xFE0E;</span></button>
        <button class="portfolio-carousel__arrow portfolio-carousel__arrow--next" type="button" (click)="next()" aria-label="Mostra la copertina successiva"><span aria-hidden="true">→&#xFE0E;</span></button>
        <div class="portfolio-carousel__dots" role="group" aria-label="Selezione copertina">
          @for (project of projects; track project.client; let index = $index) {
            <button class="portfolio-carousel__dot" type="button" [class.is-active]="index === activeIndex" [attr.aria-label]="'Mostra la copertina di ' + project.client" [attr.aria-current]="index === activeIndex ? 'true' : null" (click)="goTo(index)"><span class="sr-only">{{ project.client }}</span></button>
          }
        </div>
      }
    </section>
  `,
})
export class PortfolioHeroCarouselComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) projects: readonly PortfolioProject[] = [];

  activeIndex = 0;
  prefersReducedMotion = false;
  userPaused = false;

  @ViewChild('carouselRoot') private readonly carouselRoot?: ElementRef<HTMLElement>;

  private readonly platformId = inject(PLATFORM_ID);
  private readonly changeDetector = inject(ChangeDetectorRef);
  private interval?: number;
  private motionQuery?: MediaQueryList;
  private isBrowser = false;
  private isPointerPaused = false;
  private isFocusPaused = false;
  private isVisible = true;
  private visibilityObserver?: IntersectionObserver;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.isBrowser = true;
    this.motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.prefersReducedMotion = this.motionQuery.matches;
    this.motionQuery.addEventListener('change', this.handleMotionPreferenceChange);
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    if ('IntersectionObserver' in window && this.carouselRoot) {
      this.visibilityObserver = new IntersectionObserver(([entry]) => {
        this.isVisible = entry.isIntersecting;
        this.syncAutoAdvance();
      });
      this.visibilityObserver.observe(this.carouselRoot.nativeElement);
    }
    this.syncAutoAdvance();
    this.changeDetector.detectChanges();
  }

  ngOnDestroy(): void {
    this.clearAutoAdvance();
    this.visibilityObserver?.disconnect();
    this.motionQuery?.removeEventListener('change', this.handleMotionPreferenceChange);

    if (this.isBrowser) {
      document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    }
  }

  previous(): void {
    this.goTo((this.activeIndex - 1 + this.projects.length) % this.projects.length);
  }

  next(): void {
    this.goTo((this.activeIndex + 1) % this.projects.length);
  }

  goTo(index: number): void {
    this.activeIndex = index;
    this.syncAutoAdvance();
    this.changeDetector.markForCheck();
  }

  togglePlayback(): void {
    this.userPaused = !this.userPaused;
    this.syncAutoAdvance();
  }

  setPointerPause(isPaused: boolean): void {
    this.isPointerPaused = isPaused;
    this.syncAutoAdvance();
  }

  setFocusPause(isPaused: boolean | FocusEvent): void {
    if (typeof isPaused === 'boolean') {
      this.isFocusPaused = isPaused;
    } else {
      const nextTarget = isPaused.relatedTarget;
      this.isFocusPaused = nextTarget instanceof Node && Boolean(this.carouselRoot?.nativeElement.contains(nextTarget));
    }

    this.syncAutoAdvance();
  }

  private readonly handleMotionPreferenceChange = (event: MediaQueryListEvent): void => {
    this.prefersReducedMotion = event.matches;
    this.syncAutoAdvance();
    this.changeDetector.markForCheck();
  };

  private readonly handleVisibilityChange = (): void => this.syncAutoAdvance();

  private syncAutoAdvance(): void {
    this.clearAutoAdvance();

    if (!this.isBrowser || this.projects.length < 2 || this.prefersReducedMotion || this.userPaused || !this.isVisible || this.isPointerPaused || this.isFocusPaused || document.hidden) {
      return;
    }

    this.interval = window.setInterval(() => this.next(), 5000);
  }

  private clearAutoAdvance(): void {
    if (this.interval !== undefined) {
      clearInterval(this.interval);
      this.interval = undefined;
    }
  }
}
