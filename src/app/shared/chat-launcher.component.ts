import { Component, ElementRef, signal, viewChild } from '@angular/core';
import { ChatPanelComponent } from './chat-panel.component';

@Component({
  selector: 'app-chat-launcher',
  imports: [ChatPanelComponent],
  template: `
    <button #launcher type="button" class="chat-launcher" aria-label="Apri l’assistente Memento" aria-haspopup="dialog" [attr.aria-expanded]="opened()" (click)="opened.set(!opened())">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v12H9l-5 4V4Z"/><path d="M8 8h8M8 12h5"/></svg>
      <span>Parliamone</span>
    </button>
    @defer (when opened()) {
      @if (opened()) { <app-chat-panel (dismiss)="close()" /> }
    }
  `,
  styles: `
    .chat-launcher { position: fixed; z-index: 40; right: 1rem; bottom: 1.4rem; display: flex; gap: .6rem; align-items: center; min-height: 3.5rem; padding: .8rem 1.1rem; color: var(--paper); background: var(--green-deep); border: 1px solid var(--gold); border-radius: 2rem; box-shadow: 0 8px 25px #11241d30; font-size: .85rem; }
    svg { width: 1.4rem; height: 1.4rem; stroke: var(--gold); fill: none; stroke-width: 1.5; }
    @media (prefers-reduced-motion: no-preference) { .chat-launcher { transition: background .2s; } }
    .chat-launcher:hover { background: var(--green); }
  `,
})
export class ChatLauncherComponent {
  readonly opened = signal(false);
  private readonly launcher = viewChild<ElementRef<HTMLButtonElement>>('launcher');
  close(): void { this.opened.set(false); this.launcher()?.nativeElement.focus(); }
}
