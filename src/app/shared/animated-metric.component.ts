import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import type { CaseStudyMetric } from '../core/site.config';

@Component({
  selector: 'app-animated-metric',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: ':host { display: block; }',
  template: `<span class="case-metric__value">{{ displayedValue }}</span>`,
})
export class AnimatedMetricComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) set metric(value: CaseStudyMetric) {
    this.metricData = value;
    this.displayedValue = value.displayValue;
  }

  @Input() delay = 0;

  displayedValue = '';

  private readonly element = inject(ElementRef<HTMLElement>);
  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly platformId = inject(PLATFORM_ID);
  private metricData?: CaseStudyMetric;
  private observer?: IntersectionObserver;
  private animationFrame?: number;
  private animationStart?: number;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId) || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    this.observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) {
        return;
      }

      this.observer?.disconnect();
      this.observer = undefined;
      this.animationFrame = requestAnimationFrame((timestamp) => this.animate(timestamp));
    }, { threshold: 0.35 });

    this.observer.observe(this.element.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();

    if (this.animationFrame !== undefined) {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  private animate(timestamp: number): void {
    const metric = this.metricData;

    if (!metric) {
      return;
    }

    this.animationStart ??= timestamp + this.delay;

    if (timestamp < this.animationStart) {
      this.animationFrame = requestAnimationFrame((nextTimestamp) => this.animate(nextTimestamp));
      return;
    }

    const progress = Math.min((timestamp - this.animationStart) / 1500, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    const currentValue = metric.value * easedProgress;
    const roundedValue = metric.decimals === 1 ? currentValue.toFixed(1) : Math.round(currentValue).toString();

    this.displayedValue = progress === 1 ? metric.displayValue : `${roundedValue}${metric.suffix}`;
    this.changeDetector.markForCheck();

    if (progress < 1) {
      this.animationFrame = requestAnimationFrame((nextTimestamp) => this.animate(nextTimestamp));
    }
  }
}
