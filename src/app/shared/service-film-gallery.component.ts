import {
  afterRenderEffect,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { ConsentService } from '../core/consent.service';
import { FilmSelection, ServiceFilm } from '../core/service-media';
import { TrackingService } from '../core/tracking.service';

@Component({
  selector: 'app-service-film-gallery',
  imports: [RouterLink],
  templateUrl: './service-film-gallery.component.html',
  styleUrl: './service-film-gallery.component.scss',
})
export class ServiceFilmGalleryComponent {
  readonly selections = input.required<readonly FilmSelection[]>();
  readonly location = input.required<string>();
  private readonly consent = inject(ConsentService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly tracking = inject(TrackingService);
  private readonly requested = signal<ServiceFilm | null>(null);
  private readonly player = viewChild<ElementRef<HTMLVideoElement | HTMLIFrameElement>>('player');
  readonly failedId = signal<string | null>(null);
  readonly active = computed(() => {
    const film = this.requested();
    return film?.provider === 'youtube' && !this.consent.preferences().marketing ? null : film;
  });
  readonly embedUrl = computed(() => {
    const film = this.active();
    // Only IDs in the editorial catalog can reach this player; no visitor-supplied URLs.
    return film?.provider === 'youtube' && /^[\w-]{11}$/.test(film.id)
      ? this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://www.youtube-nocookie.com/embed/${film.id}?autoplay=1&playsinline=1&rel=0`,
        )
      : null;
  });

  constructor() {
    effect(() => {
      if (
        this.requested()?.provider === 'youtube' &&
        !this.consent.preferences().marketing &&
        !this.consent.preferencesOpen()
      )
        this.requested.set(null);
    });
    afterRenderEffect(() => {
      const player = this.player()?.nativeElement;
      player?.focus();
      if (player?.tagName === 'VIDEO')
        void (player as HTMLVideoElement).play().catch(() => {
          /* Native controls remain available if autoplay is restricted. */
        });
    });
  }

  play(film: ServiceFilm): void {
    if (film.provider === 'instagram-link') return;
    this.failedId.set(null);
    this.requested.set(film);
    this.tracking.track('service_video_request', {
      video_id: film.id,
      video_location: this.location(),
    });
    if (film.provider === 'youtube' && !this.consent.preferences().marketing)
      this.consent.openPreferences();
  }

  stop(): void {
    this.requested.set(null);
  }
}
