import { Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { siteConfig } from '../core/site.config';
import { TrackingService } from '../core/tracking.service';

const WHATSAPP_MESSAGE = 'Ciao, vorrei ricevere maggiori informazioni sui vostri servizi.';

@Component({
  selector: 'app-floating-whatsapp',
  template: `
    @if (visible()) {
      <a
        class="whatsapp-fab"
        [href]="whatsappUrl"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Apri WhatsApp per maggiori informazioni"
        (click)="trackClick()"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path
            d="M20.52 3.48A11.91 11.91 0 0 0 12.07 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.15 1.6 5.96L.06 24l6.3-1.65a11.89 11.89 0 0 0 5.7 1.45h.01c6.56 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.16-3.45-8.42ZM12.07 21.8a9.86 9.86 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.64-.24-.38a9.88 9.88 0 1 1 8.37 4.63Zm5.42-7.39c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.64.08-.3-.15-1.24-.46-2.36-1.46a8.85 8.85 0 0 1-1.63-2.03c-.17-.3-.02-.45.13-.6.13-.13.3-.35.44-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.08-.79.38-.27.3-1.04 1.02-1.04 2.48 0 1.47 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.5.7.3 1.25.49 1.68.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z"
          />
        </svg>
        <span class="sr-only">Apri WhatsApp per maggiori informazioni</span>
      </a>
    }
  `,
})
export class FloatingWhatsappComponent {
  private readonly router = inject(Router);
  private readonly tracking = inject(TrackingService);
  private readonly currentUrl = signal(this.router.url);

  readonly visible = computed(() => this.pathWithoutQueryOrFragment() !== '/contatti');
  readonly whatsappUrl = this.createWhatsappUrl();

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.currentUrl.set(event.urlAfterRedirects);
      });
  }

  trackClick(): void {
    this.tracking.trackContact('whatsapp', 'floating_button');
  }

  private pathWithoutQueryOrFragment(): string {
    return this.currentUrl().split(/[?#]/, 1)[0].replace(/\/$/, '') || '/';
  }

  private createWhatsappUrl(): string {
    const url = new URL(siteConfig.contact.whatsappUrl);
    url.searchParams.set('text', WHATSAPP_MESSAGE);
    return url.toString();
  }
}
