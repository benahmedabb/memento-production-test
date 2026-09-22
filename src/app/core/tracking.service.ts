import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Router } from '@angular/router';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (command: string, action: string, payload: Record<string, string>) => void;
  }
}

@Injectable({ providedIn: 'root' })
export class TrackingService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);

  track(event: string, details: Record<string, string> = {}): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    window.dataLayer ??= [];
    window.dataLayer.push({ event, page_path: this.router.url, ...details });
  }

  trackContact(method: 'phone' | 'email' | 'whatsapp', location: string): void {
    this.track(`contact_${method}_click`, { contact_method: method, link_location: location });
  }

  trackQuote(location: string, service?: string): void {
    this.track('quote_request_click', { link_location: location, ...(service ? { service } : {}) });
  }
}
