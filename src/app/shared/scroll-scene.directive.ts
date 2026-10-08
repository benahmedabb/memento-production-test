import { afterNextRender, DestroyRef, Directive, ElementRef, inject, Input, NgZone } from '@angular/core';
import { lightweightMotionQuery, reducedMotionQuery } from '../core/motion.config';

/** Native scrolling drives a CSS variable; nothing runs while the scene is off screen. */
@Directive({ selector: '[appScrollScene]' })
export class ScrollSceneDirective {
  @Input('appScrollScene') mode: 'cover' | 'passage' | 'hero' | '' = 'passage';
  @Input() scrollSceneOnMobile = false;
  @Input() scrollScenePassageOnCompact = false;

  private readonly element = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);
  private readonly zone = inject(NgZone);

  constructor() {
    afterNextRender(() => this.zone.runOutsideAngular(() => this.setup()));
  }

  private setup(): void {
    if (!('IntersectionObserver' in window) || !('ResizeObserver' in window)) return;

    const host = this.element.nativeElement;
    const preference = window.matchMedia(lightweightMotionQuery);
    const reducedPreference = window.matchMedia(reducedMotionQuery);
    const compactViewport = window.matchMedia('(max-width: 1023px), (max-height: 779px)');
    let visible = true;
    let frame = 0;
    let observing = false;
    let lastProgress = '';

    const motionDisabled = () => reducedPreference.matches || (preference.matches && !this.scrollSceneOnMobile);

    const update = () => {
      frame = 0;
      if (motionDisabled()) return;

      const bounds = host.getBoundingClientRect();
      const viewport = window.innerHeight;
      const header = document.querySelector('.site-header')?.getBoundingClientRect().height ?? 0;
      const usePassageProgress = this.scrollScenePassageOnCompact && compactViewport.matches;
      const progress = this.mode === 'cover' && !usePassageProgress
        ? (header - bounds.top) / Math.max(1, bounds.height - viewport + header)
        : this.mode === 'hero'
          ? (header - bounds.top) / Math.max(1, bounds.height)
          : (viewport * 0.82 - bounds.top) / Math.max(1, bounds.height + viewport * 0.15);

      const nextProgress = Math.min(1, Math.max(0, progress)).toFixed(4);
      if (nextProgress !== lastProgress) {
        host.style.setProperty('--scene-progress', nextProgress);
        lastProgress = nextProgress;
      }
    };

    const schedule = () => {
      if (visible && !frame && !motionDisabled()) frame = requestAnimationFrame(update);
    };

    const syncPreference = () => {
      const disabled = motionDisabled();
      host.classList.toggle('scroll-scene--active', !disabled);
      if (disabled) {
        cancelAnimationFrame(frame);
        frame = 0;
        observer.disconnect();
        resizeObserver.disconnect();
        window.removeEventListener('scroll', schedule);
        window.removeEventListener('resize', schedule);
        observing = false;
        lastProgress = '';
        host.style.removeProperty('--scene-progress');
      } else {
        if (!observing) {
          visible = true;
          observer.observe(host);
          resizeObserver.observe(host);
          window.addEventListener('scroll', schedule, { passive: true });
          window.addEventListener('resize', schedule, { passive: true });
          observing = true;
        }
        schedule();
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) schedule();
    }, { rootMargin: '100px' });
    const resizeObserver = new ResizeObserver(schedule);

    preference.addEventListener('change', syncPreference);
    reducedPreference.addEventListener('change', syncPreference);
    syncPreference();

    this.destroyRef.onDestroy(() => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      preference.removeEventListener('change', syncPreference);
      reducedPreference.removeEventListener('change', syncPreference);
    });
  }
}
