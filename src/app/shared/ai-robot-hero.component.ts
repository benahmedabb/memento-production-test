import { DOCUMENT } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, NgZone, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TrackingService } from '../core/tracking.service';
import type { AiRobotScene } from './ai-robot-scene';

type Connection = { saveData?: boolean; effectiveType?: string };

@Component({
  selector: 'app-ai-robot-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './ai-robot-hero.component.html',
  styleUrl: './ai-robot-hero.component.scss',
})
export class AiRobotHeroComponent {
  readonly demoRequested = output<void>();
  readonly ready = signal(false);
  readonly tracking = inject(TrackingService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly document = inject(DOCUMENT);
  private readonly zone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    // Browser-only enhancement: the server sends complete copy and a light poster.
    afterNextRender(() => this.zone.runOutsideAngular(() => this.initialise()));
  }

  private initialise(): void {
    const win = this.document.defaultView;
    const root = this.host.nativeElement;
    const canvas = root.querySelector<HTMLCanvasElement>('canvas');
    if (!win || !canvas || !win.matchMedia || !win.IntersectionObserver || !win.ResizeObserver) return;
    const media = win.matchMedia('(min-width: 900px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    const connection = (win.navigator as Navigator & { connection?: Connection }).connection;
    const constrained = connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType ?? '') || (win.navigator.hardwareConcurrency > 0 && win.navigator.hardwareConcurrency < 4);
    let scene: AiRobotScene | undefined;
    let destroyed = false, failed = false, visible = false, loading = false;
    let idle = 0, timer = 0, revealFrame = 0;
    let request: AbortController | undefined;
    const allowed = () => !destroyed && !failed && !constrained && media.matches;
    const active = () => allowed() && visible && this.document.visibilityState !== 'hidden';

    const cancelSchedule = () => {
      if (idle) win.cancelIdleCallback(idle);
      win.clearTimeout(timer);
      idle = timer = 0;
    };
    const release = () => {
      cancelSchedule();
      win.cancelAnimationFrame(revealFrame);
      request?.abort();
      request = undefined;
      scene?.dispose();
      scene = undefined;
      this.ready.set(false);
    };
    const load = async () => {
      idle = timer = 0;
      if (!active() || scene || loading) return;
      // A development hot-reload may replace the view while an import is pending.
      if (!canvas.isConnected) { failed = true; return; }
      loading = true;
      const controller = new AbortController();
      request = controller;
      try {
        const { createAiRobotScene } = await import('./ai-robot-scene');
        if (!active() || controller.signal.aborted) return;
        const created = await createAiRobotScene(canvas, controller.signal);
        if (!active() || controller.signal.aborted || !canvas.isConnected) {
          created.dispose();
          if (!canvas.isConnected) failed = true;
          return;
        }
        scene = created;
        scene.setActive(true);
        revealFrame = win.requestAnimationFrame(() => {
          revealFrame = win.requestAnimationFrame(() => { if (scene && !destroyed) this.ready.set(true); });
        });
      } catch {
        // WebGL is optional: keep a complete, useful hero if it is unavailable.
        if (!controller.signal.aborted) { failed = true; release(); }
      } finally {
        loading = false;
        if (request === controller) request = undefined;
        if (active() && !scene && !failed) sync();
      }
    };
    const sync = () => {
      if (!allowed()) { release(); return; }
      scene?.setActive(active());
      if (!active()) { cancelSchedule(); request?.abort(); return; }
      if (scene || loading || idle || timer || this.document.readyState !== 'complete') return;
      if ('requestIdleCallback' in win) idle = win.requestIdleCallback(() => void load(), { timeout: 1800 });
      else timer = window.setTimeout(() => void load(), 350);
    };
    const intersection = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      sync();
    }, { threshold: 0 });
    intersection.observe(root);
    const resize = new ResizeObserver(() => scene?.resize());
    resize.observe(canvas);
    let pointerX = Number.NaN, pointerY = Number.NaN;
    const point = (event: PointerEvent) => {
      if (!active() || !scene || event.pointerType !== 'mouse') return;
      if (event.clientX === pointerX && event.clientY === pointerY) return;
      pointerX = event.clientX; pointerY = event.clientY;
      const bounds = canvas.getBoundingClientRect();
      scene.point((event.clientX - bounds.left) / bounds.width * 2 - 1, 1 - (event.clientY - bounds.top) / bounds.height * 2);
    };
    const reset = () => {
      pointerX = pointerY = Number.NaN;
      scene?.reset();
    };
    const contextLost = (event: Event) => { event.preventDefault(); failed = true; release(); };
    win.addEventListener('pointermove', point, { passive: true });
    this.document.documentElement.addEventListener('pointerleave', reset);
    canvas.addEventListener('webglcontextlost', contextLost);
    win.addEventListener('blur', reset);
    win.addEventListener('load', sync, { once: true });
    media.addEventListener('change', sync);
    this.document.addEventListener('visibilitychange', sync);
    sync();
    this.destroyRef.onDestroy(() => {
      destroyed = true;
      release();
      intersection.disconnect();
      resize.disconnect();
      win.removeEventListener('pointermove', point);
      this.document.documentElement.removeEventListener('pointerleave', reset);
      canvas.removeEventListener('webglcontextlost', contextLost);
      win.removeEventListener('blur', reset);
      win.removeEventListener('load', sync);
      media.removeEventListener('change', sync);
      this.document.removeEventListener('visibilitychange', sync);
    });
  }
}
