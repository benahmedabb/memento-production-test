import {
  afterRenderEffect,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { clientTestimonial } from '../core/client-testimonial';
import { ConsentService } from '../core/consent.service';
import { TrackingService } from '../core/tracking.service';

@Component({
  selector: 'app-client-testimonial',
  styleUrl: './client-testimonial.component.scss',
  template: `
    <section id="video-recensione" class="testimonial section" aria-labelledby="testimonial-title">
      <div class="shell">
        <div class="testimonial__heading">
          <div>
            <p class="eyebrow">Una voce, un’esperienza</p>
            <h2 id="testimonial-title">Il lavoro, raccontato<br />da chi ci ha scelto.</h2>
          </div>
          <p>{{ video.description }}</p>
        </div>

        <figure class="testimonial__figure">
          <div class="testimonial__screen">
            @if (showPlayer()) {
              <iframe
                #player
                [src]="embedUrl"
                [title]="video.title"
                width="1280"
                height="720"
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen
              ></iframe>
            } @else {
              <button
                type="button"
                class="testimonial__poster"
                (click)="play()"
                [attr.aria-label]="
                  'Guarda la video recensione di ' + video.client + ', durata 1 minuto e 8 secondi'
                "
                aria-describedby="testimonial-playback-note"
              >
                <img
                  [src]="video.thumbnail"
                  [alt]="
                    'Copertina della testimonianza di ' + video.client + ' per Memento Production'
                  "
                  [width]="video.thumbnailWidth"
                  [height]="video.thumbnailHeight"
                  loading="lazy"
                  decoding="async"
                />
                <span class="testimonial__play" aria-hidden="true"
                  ><svg viewBox="0 0 24 24" width="24" height="24" focusable="false">
                    <path d="m8 4 12 8-12 8Z" /></svg
                ></span>
              </button>
            }
          </div>
          <figcaption class="testimonial__caption">
            <div>
              <span>La parola al cliente</span><strong>{{ video.client }}</strong>
            </div>
            <p>
              <span>Video recensione</span
              ><span class="testimonial__duration">{{ video.durationLabel }}</span>
            </p>
          </figcaption>
        </figure>

        <div class="testimonial__footer">
          <p id="testimonial-playback-note">
            Il video si apre qui dopo il consenso ai contenuti esterni nelle preferenze cookie.
          </p>
          <a [href]="video.watchUrl" target="_blank" rel="noopener noreferrer"
            >Guarda su YouTube <span aria-hidden="true">↗</span></a
          >
        </div>
      </div>
    </section>
  `,
})
export class ClientTestimonialComponent {
  readonly video = clientTestimonial;
  readonly consent = inject(ConsentService);
  private readonly tracking = inject(TrackingService);
  private readonly player = viewChild<ElementRef<HTMLIFrameElement>>('player');
  private readonly playRequested = signal(false);
  readonly showPlayer = computed(
    () => this.playRequested() && this.consent.preferences().marketing,
  );
  // Only this fixed, verified video is trusted; the URL never comes from visitor input.
  readonly embedUrl = inject(DomSanitizer).bypassSecurityTrustResourceUrl(
    `${clientTestimonial.embedUrl}?autoplay=1&playsinline=1&rel=0`,
  );

  constructor() {
    effect(() => {
      // Cancel a declined request, and stop playback when consent is withdrawn.
      if (
        this.playRequested() &&
        !this.consent.preferences().marketing &&
        !this.consent.preferencesOpen()
      ) {
        this.playRequested.set(false);
      }
    });
    afterRenderEffect(() => this.player()?.nativeElement.focus());
  }

  play(): void {
    this.playRequested.set(true);
    this.tracking.track('testimonial_video_request', {
      video_id: this.video.videoId,
      video_location: 'recensioni',
    });
    if (!this.consent.preferences().marketing) this.consent.openPreferences();
  }
}
