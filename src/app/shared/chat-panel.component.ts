import { Component, ElementRef, OnDestroy, afterNextRender, inject, output, signal, viewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { siteConfig } from '../core/site.config';
import { exactAnswer, fallback, MAX_MESSAGE } from '../../../chatbot/shared/protocol';
import type { ChatReply, Knowledge } from '../../../chatbot/shared/protocol';

interface TurnstileApi {
  render(element: HTMLElement, options: Record<string, unknown>): string;
  remove(id: string): void;
}
interface ChatWindow extends Window { turnstile?: TurnstileApi }
interface Message { role: 'user' | 'assistant'; text: string; sources?: ChatReply['sources'] }
interface ChatConfig { apiUrl: string; turnstileSiteKey: string; allowedOrigins: string[] }

@Component({
  selector: 'app-chat-panel',
  imports: [RouterLink],
  templateUrl: './chat-panel.component.html',
  styleUrl: './chat-panel.component.scss',
})
export class ChatPanelComponent implements OnDestroy {
  readonly dismiss = output<void>();
  readonly messages = signal<Message[]>([]);
  readonly busy = signal(false);
  readonly ready = signal(false);
  readonly draft = signal('');
  readonly status = signal('');
  readonly maxMessage = MAX_MESSAGE;
  readonly contact = siteConfig.contact;
  readonly suggestions = ['Quali servizi offrite?', 'Dove vi trovate?', 'Come posso contattarvi?'];
  private readonly router = inject(Router);
  private readonly input = viewChild<ElementRef<HTMLTextAreaElement>>('input');
  private readonly log = viewChild<ElementRef<HTMLElement>>('log');
  private readonly challenge = viewChild<ElementRef<HTMLElement>>('challenge');
  private knowledge: Knowledge = { entries: [], version: 'unavailable' };
  private config: ChatConfig = { apiUrl: '', turnstileSiteKey: '', allowedOrigins: [] };
  private epoch = 0;
  private controller = new AbortController();
  private widget?: string;
  private cancelChallenge?: () => void;

  constructor() {
    afterNextRender(() => {
      this.input()?.nativeElement.focus();
      void this.initialize();
    });
  }

  private async initialize(): Promise<void> {
    const signal = this.controller.signal;
    const results = await Promise.allSettled([
      fetch('/chatbot/faq.json', { signal: AbortSignal.any([signal, AbortSignal.timeout(5000)]) }).then(response => response.ok ? response.json() : Promise.reject()),
      fetch('/chatbot/config.json', { cache: 'no-store', signal: AbortSignal.any([signal, AbortSignal.timeout(5000)]) }).then(response => response.ok ? response.json() : Promise.reject()),
    ]);
    if (signal.aborted) return;
    if (results[0].status === 'fulfilled' && Array.isArray(results[0].value?.entries)) this.knowledge = results[0].value;
    if (results[1].status === 'fulfilled') {
      const config = results[1].value;
      try {
        const url = new URL(config.apiUrl);
        const local = ['localhost', '127.0.0.1'].includes(location.hostname) && ['localhost', '127.0.0.1'].includes(url.hostname);
        // Avoid a challenge on preview hosts that have no matching server/widget configuration.
        // This is only a UI check; the server independently enforces origin and Turnstile.
        if (url.pathname === '/v1/chat' && (url.protocol === 'https:' || (local && url.protocol === 'http:')) && !url.username && !url.password && !url.search && typeof config.turnstileSiteKey === 'string' && Array.isArray(config.allowedOrigins) && config.allowedOrigins.includes(location.origin)) this.config = config;
      } catch { /* Unconfigured: FAQ and contact links still work. */ }
    }
    this.ready.set(true);
  }

  onEnter(event: Event): void {
    const key = event as KeyboardEvent;
    if (!key.shiftKey && !key.isComposing) { event.preventDefault(); void this.send(); }
  }

  async send(suggestion?: string): Promise<void> {
    const message = (suggestion ?? this.draft()).trim();
    if (!this.ready() || this.busy() || !message || message.length > MAX_MESSAGE) return;
    const epoch = this.epoch;
    const previous = this.messages().slice(-4).map(item => ({ role: item.role, content: item.text.slice(0, MAX_MESSAGE) }));
    this.messages.update(items => [...items.slice(-39), { role: 'user', text: message }]);
    this.draft.set('');
    this.busy.set(true);
    this.status.set('Sto cercando una risposta…');
    this.scrollToEnd();
    const page = this.router.url.split(/[?#]/)[0];
    let reply = exactAnswer(this.knowledge, message, page) ?? fallback(this.knowledge.version);
    try {
      if (reply.mode === 'fallback' && this.config.apiUrl && this.config.turnstileSiteKey) {
        this.status.set('Verifica di sicurezza in corso…');
        const token = await this.turnstileToken();
        if (epoch !== this.epoch) return;
        this.status.set('Sto cercando una risposta…');
        const response = await fetch(this.config.apiUrl, {
          method: 'POST', credentials: 'omit', headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ message, page, history: previous, turnstileToken: token }),
          signal: AbortSignal.any([this.controller.signal, AbortSignal.timeout(25_000)]),
        });
        const data = await response.json();
        if (this.isReply(data)) reply = data;
      }
    } catch { /* Offline, blocked challenge or quota: preserve local contact fallback. */ }
    finally {
      if (epoch === this.epoch) {
        this.removeChallenge();
        this.messages.update(items => [...items, { role: 'assistant', text: reply.text, sources: reply.sources }]);
        this.busy.set(false);
        this.status.set('');
        this.scrollToEnd();
        this.input()?.nativeElement.focus();
      }
    }
  }

  private isReply(value: unknown): value is ChatReply {
    const reply = value as ChatReply | null;
    return !!reply && typeof reply.text === 'string' && reply.text.length <= 4000 &&
      ['faq', 'ai', 'fallback', 'clarification'].includes(reply.mode) && Array.isArray(reply.sources) && reply.sources.length <= 3 &&
      reply.sources.every(source => typeof source.title === 'string' && source.title.length <= 200 && typeof source.path === 'string' && /^\/[a-z0-9/-]*(#[a-z0-9-]+)?$/.test(source.path));
  }

  private async turnstileToken(): Promise<string> {
    const win = window as ChatWindow;
    const signal = this.controller.signal;
    if (!win.turnstile) {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        const timer = setTimeout(() => { script.remove(); reject(new Error('challenge')); }, 10_000);
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true;
        script.onload = () => { clearTimeout(timer); resolve(); };
        script.onerror = () => { clearTimeout(timer); script.remove(); reject(new Error('challenge')); };
        document.head.appendChild(script);
      });
    }
    if (signal.aborted || !win.turnstile || !this.challenge()) throw new Error('closed');
    return new Promise<string>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('challenge')), 60_000);
      const fail = () => { clearTimeout(timer); reject(new Error('challenge')); };
      this.cancelChallenge = fail;
      this.widget = win.turnstile!.render(this.challenge()!.nativeElement, {
        sitekey: this.config.turnstileSiteKey, action: 'memento_chat', theme: 'light', size: 'flexible',
        callback: (token: string) => { clearTimeout(timer); resolve(token); },
        'error-callback': fail, 'expired-callback': fail, 'timeout-callback': fail,
      });
    });
  }

  private removeChallenge(): void {
    this.cancelChallenge?.();
    this.cancelChallenge = undefined;
    if (this.widget !== undefined) (window as ChatWindow).turnstile?.remove(this.widget);
    this.widget = undefined;
  }

  reset(): void {
    this.epoch++;
    this.controller.abort();
    this.controller = new AbortController();
    this.removeChallenge();
    this.messages.set([]); this.draft.set(''); this.busy.set(false); this.status.set('');
    this.input()?.nativeElement.focus();
    if (!this.ready()) void this.initialize();
  }

  close(): void { this.dismiss.emit(); }
  ngOnDestroy(): void { this.epoch++; this.controller.abort(); this.removeChallenge(); }
  private scrollToEnd(): void {
    setTimeout(() => { const log = this.log()?.nativeElement; if (log) log.scrollTop = log.scrollHeight; });
  }
}
