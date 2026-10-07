import { afterNextRender, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { clientTestimonial } from '../core/client-testimonial';
import { siteConfig } from '../core/site.config';

@Component({
  selector: 'app-home-reviews-marquee',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="home-reviews-marquee" [class.home-reviews-marquee--paused]="paused() || !visible() || !pageVisible()" aria-labelledby="home-reviews-title">
      <span class="home-reviews-marquee__quote" aria-hidden="true">“</span>

      <div class="shell home-reviews-marquee__heading">
        <div>
          <p class="eyebrow eyebrow--gold">Dicono di noi</p>
          <h2 id="home-reviews-title">Le parole che restano dopo il progetto.</h2>
          <p>Esperienze reali, condivise dai clienti che hanno lavorato con Memento Production.</p>
        </div>
        <a class="text-link text-link--light" routerLink="/recensioni">Tutte le recensioni <span aria-hidden="true">→&#xFE0E;</span></a>
      </div>

      <div class="shell home-testimonial">
        <a class="home-testimonial__link" routerLink="/recensioni" fragment="video-recensione">
          <span class="home-testimonial__image">
            <img [src]="testimonial.thumbnail" alt="" [width]="testimonial.thumbnailWidth" [height]="testimonial.thumbnailHeight" loading="lazy" decoding="async" />
            <span class="home-testimonial__duration" aria-label="Durata: 1 minuto e 8 secondi">{{ testimonial.durationLabel }}</span>
          </span>
          <span class="home-testimonial__copy">
            <span class="home-testimonial__eyebrow">La parola al cliente</span>
            <strong>{{ testimonial.client }}</strong>
            <span>La sua esperienza con Memento Production.</span>
          </span>
          <span class="home-testimonial__action">
            <span class="home-testimonial__play" aria-hidden="true"><svg viewBox="0 0 24 24" width="16" height="16" focusable="false"><path d="m8 4 12 8-12 8Z" /></svg></span>
            Guarda la testimonianza
          </span>
        </a>
      </div>

      <div class="home-reviews-marquee__signal" aria-hidden="true">
        <div class="home-reviews-marquee__signal-track">
          @for (copy of [0, 1]; track copy) {
            <div>
              <span>Recensioni Google</span><b>✦</b><span>5 stelle</span><b>✦</b><span>Esperienze reali</span><b>✦</b>
            </div>
          }
        </div>
      </div>

      <div class="home-reviews-marquee__viewport">
        <div class="home-reviews-marquee__track">
          @for (copy of [0, 1]; track copy) {
            <div class="home-reviews-marquee__group" [class.home-reviews-marquee__group--copy]="copy === 1" [attr.aria-hidden]="copy === 1 ? 'true' : null">
              @for (review of reviews; track review.person) {
                <blockquote class="home-review-card">
                  <div class="home-review-card__top">
                    <span class="home-review-card__stars" role="img" [attr.aria-label]="review.rating + ' stelle su 5'">★★★★★</span>
                    <span>Google</span>
                  </div>
                  <p>“{{ review.content }}”</p>
                  <footer><cite>{{ review.person }}</cite></footer>
                </blockquote>
              }
            </div>
          }
        </div>
      </div>

      <div class="shell home-reviews-marquee__controls">
        <button type="button" (click)="togglePause()" [attr.aria-label]="paused() ? 'Riprendi lo scorrimento delle recensioni' : 'Metti in pausa lo scorrimento delle recensioni'">
          <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true" focusable="false">
            @if (paused()) { <path d="M4 2 13 8 4 14Z" /> } @else { <path d="M3 2h3v12H3zM10 2h3v12h-3z" /> }
          </svg>
          {{ paused() ? 'Riprendi' : 'Pausa' }}
        </button>
      </div>
    </section>
  `,
})
export class HomeReviewsMarqueeComponent {
  readonly testimonial = clientTestimonial;
  readonly reviews = siteConfig.reviews;
  readonly paused = signal(false);
  readonly visible = signal(false);
  readonly pageVisible = signal(true);

  private readonly element = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      const syncPageVisibility = () => this.pageVisible.set(!document.hidden);
      syncPageVisibility();
      document.addEventListener('visibilitychange', syncPageVisibility);

      const observer = 'IntersectionObserver' in window
        ? new IntersectionObserver(([entry]) => this.visible.set(entry.isIntersecting), { rootMargin: '150px' })
        : undefined;
      if (observer) observer.observe(this.element.nativeElement);
      else this.visible.set(true);

      this.destroyRef.onDestroy(() => {
        observer?.disconnect();
        document.removeEventListener('visibilitychange', syncPageVisibility);
      });
    });
  }

  togglePause(): void {
    this.paused.update((paused) => !paused);
  }
}
