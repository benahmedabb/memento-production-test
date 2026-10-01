import { afterNextRender, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, NgZone } from '@angular/core';
import type { CameraScene } from './camera-scene';

@Component({
  selector: 'app-hero-camera',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './hero-camera.component.scss',
  host: { 'aria-hidden': 'true' },
  template: '<div class="hero-camera__viewport"><canvas></canvas></div>',
})
export class HeroCameraComponent {
  private readonly element: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly zone = inject(NgZone);

  constructor() {
    afterNextRender(() => this.zone.runOutsideAngular(() => this.setup()));
  }

  private setup(): void {
    const host = this.element.nativeElement;
    if (!window.matchMedia || !window.IntersectionObserver || !window.ResizeObserver) {
      host.classList.add('is-fallback');
      return;
    }
    const stage = host.closest<HTMLElement>('.cinema__stage');
    const canvas = host.querySelector('canvas');
    if (!stage || !canvas) return;

    const preference = window.matchMedia('(min-width: 860px) and (pointer: fine) and (hover: hover) and (prefers-reduced-motion: no-preference)');
    let scene: CameraScene | undefined;
    let visible = false;
    let loading = false;
    let failed = false;
    let destroyed = false;
    let generation = 0;
    const isActive = () => preference.matches && visible && !document.hidden && !destroyed && !failed;
    const teardown = () => {
      generation++;
      loading = false;
      host.classList.remove('is-ready');
      scene?.dispose();
      scene = undefined;
    };

    const sync = async () => {
      if (destroyed) return;
      if (!preference.matches) { teardown(); return; }
      scene?.setActive(isActive());
      if (!isActive() || scene || loading) return;
      loading = true;
      const request = ++generation;
      try {
        const { createCameraScene } = await import('./camera-scene');
        if (destroyed || request !== generation || !isActive()) return;
        scene = createCameraScene(canvas);
        scene.setActive(true);
        host.classList.add('is-ready');
      } catch {
        // WebGL unavailable, context failure or chunk download failure: retain the photo.
        if (request === generation) { failed = true; host.classList.add('is-fallback'); teardown(); }
      } finally {
        if (request === generation) loading = false;
      }
    };

    const onPointer = (event: PointerEvent) => {
      if (!scene || !isActive() || event.pointerType !== 'mouse') return;
      const bounds = canvas.getBoundingClientRect();
      const clamp = (n: number) => Math.min(1, Math.max(-1, n));
      scene.point(
        clamp((event.clientX - bounds.left) / bounds.width * 2 - 1),
        clamp(1 - (event.clientY - bounds.top) / bounds.height * 2),
      );
    };
    const reset = () => scene?.reset();
    const onClick = (event: MouseEvent) => {
      if (!scene || !isActive() || event.button !== 0 || event.detail === 0) return;
      const target = event.target;
      if (target instanceof Element && target.closest('a, button, input, textarea, select, [role="button"], [contenteditable], h1, p')) return;
      if (window.getSelection()?.toString()) return;
      const bounds = canvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      scene.shoot((event.clientX - bounds.left) / bounds.width * 2 - 1,
        1 - (event.clientY - bounds.top) / bounds.height * 2);
    };
    const clearFocus = () => scene?.clearFocus();
    const contextLost = (event: Event) => {
      event.preventDefault();
      failed = true;
      host.classList.add('is-fallback');
      teardown();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      void sync();
    });
    const sizeObserver = new ResizeObserver(() => scene?.resize());
    observer.observe(stage);
    sizeObserver.observe(canvas);
    // Follow the pointer across adjacent sections while the hero is visible.
    window.addEventListener('pointermove', onPointer, { passive: true });
    stage.addEventListener('click', onClick);
    document.documentElement.addEventListener('pointerleave', reset);
    window.addEventListener('blur', reset);
    window.addEventListener('scroll', clearFocus, { passive: true });
    canvas.addEventListener('webglcontextlost', contextLost);
    document.addEventListener('visibilitychange', sync);
    preference.addEventListener('change', sync);

    this.destroyRef.onDestroy(() => {
      destroyed = true;
      observer.disconnect();
      sizeObserver.disconnect();
      window.removeEventListener('pointermove', onPointer);
      stage.removeEventListener('click', onClick);
      document.documentElement.removeEventListener('pointerleave', reset);
      window.removeEventListener('blur', reset);
      window.removeEventListener('scroll', clearFocus);
      canvas.removeEventListener('webglcontextlost', contextLost);
      document.removeEventListener('visibilitychange', sync);
      preference.removeEventListener('change', sync);
      teardown();
    });
  }
}
