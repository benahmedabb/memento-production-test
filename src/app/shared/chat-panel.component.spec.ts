import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { errorReply } from '../../../chatbot/shared/protocol';
import type { ChatRequest } from '../../../chatbot/shared/protocol';
import { ChatPanelComponent } from './chat-panel.component';

describe('Chat conversation recovery', () => {
  let fixture: ComponentFixture<ChatPanelComponent>;
  let requests: ChatRequest[];
  let challengeFails: boolean;
  const backend = vi.fn<() => Promise<Response>>();
  const dialogue = [
    { role: 'user' as const, text: 'il mio sito fa schifo' },
    { role: 'assistant' as const, text: 'Cosa non ti piace del sito?' },
    { role: 'user' as const, text: 'il design' },
    { role: 'assistant' as const, text: 'I colori o la disposizione degli elementi?' },
  ];

  beforeEach(async () => {
    requests = [];
    challengeFails = false;
    backend.mockReset();
    backend.mockImplementation(async () => Response.json({ text: 'Capito, parliamo dei colori e della disposizione. Che stile vorresti?', sources: [], version: 'test', mode: 'ai' }));
    vi.stubGlobal('fetch', vi.fn(async (url: string, init?: RequestInit) => {
      if (url === '/chatbot/faq.json') return Response.json({ entries: [], version: 'test' });
      if (url === '/chatbot/config.json') return Response.json({ apiUrl: 'https://chat.example/v1/chat', turnstileSiteKey: 'test', allowedOrigins: [location.origin] });
      expect(url).toBe('https://chat.example/v1/chat');
      requests.push(JSON.parse(String(init?.body)));
      return backend();
    }));
    vi.stubGlobal('turnstile', {
      render: (_element: HTMLElement, options: Record<string, (token?: string) => void>) => {
        queueMicrotask(() => challengeFails ? options['error-callback']() : options['callback']('test-token'));
        return 'test-widget';
      },
      remove: vi.fn(),
    });
    TestBed.configureTestingModule({ imports: [ChatPanelComponent], providers: [provideRouter([])] });
    fixture = TestBed.createComponent(ChatPanelComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    await vi.waitFor(() => expect(fixture.componentInstance.ready()).toBe(true));
    fixture.componentInstance.messages.set(dialogue);
  });

  afterEach(() => {
    fixture.destroy();
    vi.unstubAllGlobals();
  });

  it('shows the actual rate limit and preserves the last successful exchanges when retrying', async () => {
    backend.mockResolvedValueOnce(Response.json(errorReply('rate_limit', 'test', 30), { status: 429 }));
    await fixture.componentInstance.send('colori e disposizione degli elementi');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Attendi un minuto');
    expect(fixture.nativeElement.textContent).not.toContain('Non ho informazioni sufficienti');
    await fixture.componentInstance.send('colori e disposizione degli elementi');
    expect(requests).toHaveLength(2);
    for (const request of requests) {
      expect(request.history).toEqual(dialogue.map(item => ({ role: item.role, content: item.text })));
    }
    expect(fixture.componentInstance.messages().at(-1)?.failed).toBe(false);
  });

  it('reports a connection failure without treating it as missing knowledge', async () => {
    backend.mockRejectedValueOnce(new TypeError('Failed to fetch'));
    await fixture.componentInstance.send('colori e disposizione degli elementi');
    expect(fixture.componentInstance.messages().at(-1)?.text).toContain('collegarmi');
    expect(fixture.componentInstance.messages().slice(-2).every(item => item.failed)).toBe(true);
    expect(fixture.componentInstance.busy()).toBe(false);
  });

  it('reports a failed challenge without calling the backend or losing context', async () => {
    challengeFails = true;
    await fixture.componentInstance.send('colori e disposizione degli elementi');
    expect(fixture.componentInstance.messages().at(-1)?.text).toContain('verifica di sicurezza');
    expect(backend).not.toHaveBeenCalled();
    challengeFails = false;
    await fixture.componentInstance.send('colori e disposizione degli elementi');
    expect(requests[0].history).toEqual(dialogue.map(item => ({ role: item.role, content: item.text })));
  });
});
