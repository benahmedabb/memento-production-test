import { Component, ElementRef, signal, viewChild } from '@angular/core';
import { ChatPanelComponent } from './chat-panel.component';

@Component({
  selector: 'app-chat-launcher',
  imports: [ChatPanelComponent],
  template: `
    <button #launcher type="button" class="chat-launcher" [attr.aria-label]="opened() ? 'Chiudi l’assistente Memento' : 'Apri l’assistente Memento'" aria-haspopup="dialog" [attr.aria-expanded]="opened()" (click)="opened.set(!opened())">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 13v-2a8 8 0 0 1 16 0v2" />
        <path d="M4 13a2 2 0 0 1 2-2h1v6H6a2 2 0 0 1-2-2v-2Zm16 0a2 2 0 0 0-2-2h-1v6h1a2 2 0 0 0 2-2v-2Z" />
        <path d="M17 17c0 2-1.6 3-4 3h-1" />
      </svg>
    </button>
    @defer (when opened()) {
      @if (opened()) { <app-chat-panel (dismiss)="close()" /> }
    }
  `,
  styles: `
    .chat-launcher { position: fixed; z-index: 40; right: 1.5rem; bottom: calc(4.5rem + env(safe-area-inset-bottom)); display: grid; width: 3.75rem; height: 3.75rem; place-items: center; padding: 0; color: var(--green-deep); background: var(--gold); border: 1px solid rgba(17, 36, 29, .12); border-radius: 50%; box-shadow: 0 12px 28px rgba(17, 36, 29, .26); }
    svg { width: 1.65rem; height: 1.65rem; stroke: currentColor; fill: none; stroke-linecap: round; stroke-linejoin: round; stroke-width: 1.7; }
    @media (prefers-reduced-motion: no-preference) { .chat-launcher { transition: background-color 180ms ease, color 180ms ease, transform 180ms ease, box-shadow 180ms ease; } }
    .chat-launcher:hover { color: var(--paper); background: var(--green); box-shadow: 0 15px 34px rgba(17, 36, 29, .32); transform: translateY(-2px); }
    @media (max-width: 480px) { .chat-launcher { right: 1rem; bottom: calc(4.25rem + env(safe-area-inset-bottom)); } }
  `,
})
export class ChatLauncherComponent {
  readonly opened = signal(false);
  private readonly launcher = viewChild<ElementRef<HTMLButtonElement>>('launcher');
  close(): void { this.opened.set(false); this.launcher()?.nativeElement.focus(); }
}
