import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, PLATFORM_ID, Renderer2, inject } from '@angular/core';

export type PageMotionVariant = 'hero' | 'rise' | 'mask' | 'type' | 'fan';

@Directive({
  selector: '[appPageMotion]',
  host: { class: 'page-motion-target' },
})
export class PageMotionDirective implements AfterViewInit, OnDestroy {
  @Input('appPageMotion') variant: PageMotionVariant = 'rise';
  @Input() motionDelay = 0;

  private readonly element = inject(ElementRef<HTMLElement>);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly renderer = inject(Renderer2);
  private observer?: IntersectionObserver;
  private animationFrames: number[] = [];
  private hasRevealed = false;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId) || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const host = this.element.nativeElement;
    this.renderer.setStyle(host, '--page-motion-delay', `${this.motionDelay}ms`);
    this.renderer.addClass(host, 'page-motion--armed');
    this.renderer.addClass(host, `page-motion--${this.variant}`);

    this.afterInitialScroll(() => this.prepareReveal(host));
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.animationFrames.forEach((frame) => cancelAnimationFrame(frame));
    this.animationFrames = [];
  }

  private prepareReveal(host: HTMLElement): void {
    if (this.hasRevealed) {
      return;
    }

    const bounds = host.getBoundingClientRect();

    if (this.variant === 'hero' || (bounds.top < window.innerHeight && bounds.bottom > 0)) {
      this.reveal();
      return;
    }

    this.observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) {
        return;
      }

      this.observer?.disconnect();
      this.observer = undefined;
      this.reveal();
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    // A fully clipped image cannot intersect until its mask opens. Observe its
    // visible container so the reveal can start as it enters the viewport.
    this.observer.observe(this.variant === 'mask' ? host.parentElement ?? host : host);
  }

  private reveal(): void {
    if (this.hasRevealed) {
      return;
    }

    this.hasRevealed = true;
    this.queueFrame(() => {
      this.renderer.addClass(this.element.nativeElement, 'page-motion--revealed');
    });
  }

  private afterInitialScroll(callback: () => void): void {
    this.queueFrame(() => this.queueFrame(callback));
  }

  private queueFrame(callback: () => void): void {
    const frame = requestAnimationFrame(() => {
      this.animationFrames = this.animationFrames.filter((pendingFrame) => pendingFrame !== frame);
      callback();
    });

    this.animationFrames.push(frame);
  }
}
