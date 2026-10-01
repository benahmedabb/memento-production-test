import { afterNextRender, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject } from '@angular/core';

@Component({
  selector: 'app-pointer-halo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './pointer-halo.component.scss',
  template: '<span class="pointer-halo" aria-hidden="true"></span>',
})
export class PointerHaloComponent {
  private readonly host: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      if (!('matchMedia' in window)) return;

      const halo = this.host.nativeElement.querySelector<HTMLElement>('.pointer-halo');
      if (!halo) return;

      const enabled = window.matchMedia('(pointer: fine) and (hover: hover) and (prefers-reduced-motion: no-preference)');
      let frame = 0;
      let targetX = 0;
      let targetY = 0;
      let currentX = 0;
      let currentY = 0;
      let positioned = false;
      let removePointerListeners = () => {};

      const render = () => {
        currentX += (targetX - currentX) * 0.28;
        currentY += (targetY - currentY) * 0.28;
        halo.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;

        if (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1) {
          frame = requestAnimationFrame(render);
        } else {
          currentX = targetX;
          currentY = targetY;
          halo.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
          frame = 0;
        }
      };

      const scheduleRender = () => {
        if (!frame) frame = requestAnimationFrame(render);
      };

      const hide = () => {
        halo.classList.remove('pointer-halo--visible', 'pointer-halo--interactive', 'pointer-halo--pressed');
      };

      const onPointerMove = (event: PointerEvent) => {
        if (event.pointerType !== 'mouse') {
          hide();
          return;
        }

        targetX = event.clientX;
        targetY = event.clientY;
        if (!positioned) {
          currentX = targetX;
          currentY = targetY;
          positioned = true;
        }

        const target = event.target instanceof Element ? event.target : null;
        const overTextControl = Boolean(target?.closest('input, textarea, select, [contenteditable="true"]'));
        const overInteractive = Boolean(target?.closest('a, button, summary, [role="button"], label[for]'));

        halo.classList.toggle('pointer-halo--visible', !overTextControl);
        halo.classList.toggle('pointer-halo--interactive', overInteractive && !overTextControl);
        scheduleRender();
      };

      const onPointerOut = (event: PointerEvent) => {
        if (!event.relatedTarget) hide();
      };
      const onPointerDown = (event: PointerEvent) => {
        if (event.pointerType === 'mouse') halo.classList.add('pointer-halo--pressed');
      };
      const onPointerUp = () => halo.classList.remove('pointer-halo--pressed');

      const disable = () => {
        document.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('pointerout', onPointerOut);
        document.removeEventListener('pointerdown', onPointerDown);
        document.removeEventListener('pointerup', onPointerUp);
        window.removeEventListener('blur', hide);
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        positioned = false;
        hide();
      };

      const sync = () => {
        removePointerListeners();
        removePointerListeners = () => {};
        if (!enabled.matches) {
          disable();
          return;
        }

        document.addEventListener('pointermove', onPointerMove, { passive: true });
        document.addEventListener('pointerout', onPointerOut, { passive: true });
        document.addEventListener('pointerdown', onPointerDown, { passive: true });
        document.addEventListener('pointerup', onPointerUp, { passive: true });
        window.addEventListener('blur', hide);
        removePointerListeners = disable;
      };

      enabled.addEventListener('change', sync);
      sync();

      this.destroyRef.onDestroy(() => {
        enabled.removeEventListener('change', sync);
        removePointerListeners();
      });
    });
  }
}
