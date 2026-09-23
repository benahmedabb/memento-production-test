import { afterNextRender, DestroyRef, Directive, ElementRef, inject, Input, NgZone } from '@angular/core';
import { lightweightMotionQuery } from '../core/motion.config';

/** Native scrolling drives a CSS variable; nothing runs while the scene is off screen. */
@Directive({ selector: '[appScrollScene]' })
export class ScrollSceneDirective {
  @Input('appScrollScene') mode: 'cover' | 'passage' | 'hero' | '' = 'passage';

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
    let visible = true;
    let frame = 0;
    let observing = false;
    let lastProgress = '';

    const update = () => {
      frame = 0;
      if (preference.matches) return;

      const bounds = host.getBoundingClientRect();
      const viewport = window.innerHeight;
      const header = document.querySelector('.site-header')?.getBoundingClientRect().height ?? 0;
      const progress = this.mode === 'cover'
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
      if (visible && !frame && !preference.matches) frame = requestAnimationFrame(update);
    };

    const syncPreference = () => {
      host.classList.toggle('scroll-scene--active', !preference.matches);
      if (preference.matches) {
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
    syncPreference();

    this.destroyRef.onDestroy(() => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      preference.removeEventListener('change', syncPreference);
    });
  }
}
