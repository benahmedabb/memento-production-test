import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsentService } from '../core/consent.service';
import { TrackingService } from '../core/tracking.service';
import { ClientTestimonialComponent } from './client-testimonial.component';

describe('Client testimonial playback', () => {
  let fixture: ComponentFixture<ClientTestimonialComponent>;
  let consent: ConsentService;
  let purposes: Record<string, boolean>;
  let openPreferences: ReturnType<typeof vi.fn>;
  const iframe = () => fixture.nativeElement.querySelector('iframe') as HTMLIFrameElement | null;
  const setConsent = (analytics: boolean, externalContent: boolean) => {
    purposes = { '3': externalContent, '4': analytics, '5': false };
    window.dispatchEvent(new CustomEvent('memento:iubenda-preferences-changed'));
    fixture.detectChanges();
  };
  const play = () => {
    fixture.nativeElement.querySelector('.testimonial__poster').click();
    fixture.detectChanges();
  };

  beforeEach(() => {
    purposes = { '3': false, '4': false, '5': false };
    openPreferences = vi.fn();
    Object.assign(window, {
      _iub: {
        cs: { api: { getPreferences: () => ({ purposes }), openPreferences } },
      },
    });
    TestBed.configureTestingModule({
      imports: [ClientTestimonialComponent],
      providers: [{ provide: TrackingService, useValue: { track: vi.fn() } }],
    });
    consent = TestBed.inject(ConsentService);
    consent.initialize();
    fixture = TestBed.createComponent(ClientTestimonialComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    delete (window as typeof window & { _iub?: unknown })._iub;
  });

  it('uses a local cover and waits for a play request even with existing consent', () => {
    expect(iframe()).toBeNull();
    expect(fixture.nativeElement.querySelector('img').getAttribute('src')).toMatch(/^\/images\//);
    setConsent(true, true);
    expect(iframe()).toBeNull();

    play();
    expect(iframe()?.src).toBe(
      'https://www.youtube-nocookie.com/embed/AK2Dz4vgTr8?autoplay=1&playsinline=1&rel=0',
    );
    expect(iframe()?.title).toContain('Alessio Vainella');
  });

  it('opens preferences first, then plays with external-content consent without enabling analytics', () => {
    play();
    expect(consent.preferencesOpen()).toBe(true);
    expect(openPreferences).toHaveBeenCalledOnce();
    expect(iframe()).toBeNull();

    setConsent(false, true);
    expect(iframe()).not.toBeNull();
    expect(consent.preferences().analytics).toBe(false);
  });

  it('cancels a pending play request when external-content consent is declined', () => {
    play();
    setConsent(false, false);
    setConsent(true, true);
    expect(iframe()).toBeNull();

    setConsent(false, false);
    play();
    setConsent(false, false);
    setConsent(true, true);
    expect(iframe()).toBeNull();
  });

  it('removes the player on consent withdrawal and requires a new play request', () => {
    setConsent(true, true);
    play();
    expect(iframe()).not.toBeNull();
    setConsent(false, false);
    expect(iframe()).toBeNull();

    setConsent(true, true);
    expect(iframe()).toBeNull();
  });
});
