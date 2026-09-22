import { Component, computed, input } from '@angular/core';
import { PageMotionDirective } from './page-motion.directive';
import { ScrollSceneDirective } from './scroll-scene.directive';

@Component({
  selector: 'app-kinetic-text',
  imports: [PageMotionDirective, ScrollSceneDirective],
  template: `
    @if (mode() === 'ink') {
      <span class="kinetic-ink" appScrollScene>
        <span>
          @for (word of words(); track $index) {
            <span class="kinetic-ink__word" [style.--word-start]="$index / words().length">{{ word }} </span>
          }
        </span>
      </span>
    } @else {
      <span class="kinetic-text" appPageMotion="type" [motionDelay]="delay()">
        <span>
          @for (word of words(); track $index) {
            <span class="kinetic-text__mask"><span class="kinetic-text__word" [style.--word-delay]="wordDelay($index)">{{ word }}</span></span>{{ ' ' }}
          }
        </span>
      </span>
    }
  `,
})
export class KineticTextComponent {
  readonly text = input.required<string>();
  readonly mode = input<'reveal' | 'ink'>('reveal');
  readonly delay = input(0);
  readonly words = computed(() => this.text().trim().split(/\s+/));

  wordDelay(index: number): string {
    return `${Math.min(index, 14) * 45}ms`;
  }
}
