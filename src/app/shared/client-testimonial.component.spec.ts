import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsentService } from '../core/consent.service';
import { TrackingService } from '../core/tracking.service';
import { ClientTestimonialComponent } from './client-testimonial.component';

describe('Client testimonial playback', () => {
  let fixture: ComponentFixture<ClientTestimonialComponent>;
  let consent: ConsentService;
  const iframe = () => fixture.nativeElement.querySelector('iframe') as HTMLIFrameElement | null;
  const play = () => {
    fixture.nativeElement.querySelector('.testimonial__poster').click();
    fixture.detectChanges();
  };

  beforeEach(() => {
    vi.stubGlobal('localStorage', { getItem: vi.fn(() => null), setItem: vi.fn() });
    TestBed.configureTestingModule({
      imports: [ClientTestimonialComponent],
      providers: [{ provide: TrackingService, useValue: { track: vi.fn() } }],
    });
    consent = TestBed.inject(ConsentService);
    fixture = TestBed.createComponent(ClientTestimonialComponent);
    fixture.detectChanges();
  });

  afterEach(() => vi.unstubAllGlobals());

  it('uses a local cover and waits for a play request even with existing consent', () => {
    expect(iframe()).toBeNull();
    expect(fixture.nativeElement.querySelector('img').getAttribute('src')).toMatch(/^\/images\//);
    consent.acceptAll();
    fixture.detectChanges();
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
    expect(iframe()).toBeNull();

    consent.saveCustom(false, true);
    fixture.detectChanges();
    expect(iframe()).not.toBeNull();
    expect(consent.preferences().analytics).toBe(false);
  });

  it('cancels a pending play request when preferences are dismissed or consent is declined', () => {
    play();
    consent.closePreferences();
    fixture.detectChanges();
    consent.acceptAll();
    fixture.detectChanges();
    expect(iframe()).toBeNull();

    consent.rejectOptional();
    fixture.detectChanges();
    play();
    consent.saveCustom(false, false);
    fixture.detectChanges();
    consent.acceptAll();
    fixture.detectChanges();
    expect(iframe()).toBeNull();
  });

  it('removes the player on consent withdrawal and requires a new play request', () => {
    consent.acceptAll();
    play();
    expect(iframe()).not.toBeNull();
    consent.rejectOptional();
    fixture.detectChanges();
    expect(iframe()).toBeNull();

    consent.acceptAll();
    fixture.detectChanges();
    expect(iframe()).toBeNull();
  });
});
