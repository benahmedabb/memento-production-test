import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ConsentService } from '../core/consent.service';
import { arabianFilm, corporateFilms, serviceMediaFor, socialFilms } from '../core/service-media';
import { TrackingService } from '../core/tracking.service';
import { ServiceFilmGalleryComponent } from './service-film-gallery.component';

describe('Service films: playback and consent', () => {
  let fixture: ComponentFixture<ServiceFilmGalleryComponent>;
  let consent: ConsentService;
  let purposes: Record<string, boolean>;
  let openPreferences: ReturnType<typeof vi.fn>;
  const players = () => fixture.nativeElement.querySelectorAll('video, iframe');
  const setConsent = (analytics: boolean, externalContent: boolean) => {
    purposes = { '3': externalContent, '4': analytics, '5': false };
    window.dispatchEvent(new CustomEvent('memento:iubenda-preferences-changed'));
    fixture.detectChanges();
  };
  const play = (id: string) => {
    fixture.nativeElement.querySelector(`#film-${id} button.film-card__poster`).click();
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
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
    TestBed.configureTestingModule({
      imports: [ServiceFilmGalleryComponent],
      providers: [provideRouter([]), { provide: TrackingService, useValue: { track: vi.fn() } }],
    });
    consent = TestBed.inject(ConsentService);
    consent.initialize();
    fixture = TestBed.createComponent(ServiceFilmGalleryComponent);
    fixture.componentRef.setInput('selections', [
      ...serviceMediaFor('/video/video-aziendali-torino').films,
      ...serviceMediaFor('/social').films,
    ]);
    fixture.componentRef.setInput('location', '/video');
    fixture.detectChanges();
  });
  afterEach(() => {
    delete (window as typeof window & { _iub?: unknown })._iub;
    vi.restoreAllMocks();
  });

  it('loads only local covers initially and plays a local Reel without external consent', () => {
    expect(players()).toHaveLength(0);
    for (const image of fixture.nativeElement.querySelectorAll('img'))
      expect(image.getAttribute('src')).toMatch(/^\/images\//);
    play(arabianFilm.id);
    expect(players()).toHaveLength(1);
    expect(players()[0].tagName).toBe('VIDEO');
    expect(players()[0].getAttribute('src')).toMatch(/^\/videos\/servizi\//);
    expect(consent.preferencesOpen()).toBe(false);
    expect(consent.preferences().marketing).toBe(false);
  });

  it('gates YouTube, cancels dismissed requests and removes the player when consent is withdrawn', () => {
    play(corporateFilms[0].id);
    expect(consent.preferencesOpen()).toBe(true);
    expect(openPreferences).toHaveBeenCalledOnce();
    expect(players()).toHaveLength(0);
    setConsent(false, false);
    setConsent(true, true);
    expect(players()).toHaveLength(0);
    setConsent(false, false);
    play(corporateFilms[0].id);
    setConsent(false, true);
    expect(players()[0].src).toContain('youtube-nocookie.com/embed/XiSIUwAxMhA');
    expect(consent.preferences().analytics).toBe(false);
    setConsent(false, false);
    expect(players()).toHaveLength(0);
  });

  it('keeps one player across all selections and replaces it when another film is chosen', () => {
    setConsent(true, true);
    play(corporateFilms[0].id);
    play(arabianFilm.id);
    expect(players()).toHaveLength(1);
    expect(players()[0].src).toContain('arabian-luxury-beauty.mp4');
    setConsent(false, false);
    expect(players()).toHaveLength(1); // Local playback does not depend on marketing consent.
    fixture.componentInstance.stop();
    fixture.detectChanges();
    expect(players()).toHaveLength(0);
  });

  it('gates Instagram embeds and keeps a direct link plus a local-video fallback', () => {
    const instagram = fixture.nativeElement.querySelector(`#film-${socialFilms[0].id}`);
    expect(instagram.querySelector('button.film-card__poster')).not.toBeNull();
    expect(instagram.querySelector('.film-card__links a').href).toBe(socialFilms[0].watchUrl);
    play(socialFilms[0].id);
    expect(consent.preferencesOpen()).toBe(true);
    expect(players()).toHaveLength(0);
    setConsent(false, true);
    expect(players()[0].src).toContain(`/reel/${socialFilms[0].id}/embed`);
    play(arabianFilm.id);
    players()[0].dispatchEvent(new Event('error'));
    fixture.detectChanges();
    expect(players()).toHaveLength(0);
    expect(fixture.nativeElement.querySelector('.film-card__error a').href).toBe(
      arabianFilm.watchUrl,
    );
  });
});
