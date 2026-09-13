import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { siteConfig } from './site.config';

interface ConsentPreferences {
  readonly analytics: boolean;
  readonly marketing: boolean;
}

interface IubendaWindow extends Window {
  _iub?: {
    csConfiguration?: Record<string, unknown>;
    cs?: { api?: { openPreferences: () => void } };
  };
}

const STORAGE_KEY = 'memento-consent-v1';

@Injectable({ providedIn: 'root' })
export class ConsentService {
  readonly bannerVisible = signal(false);
  readonly preferencesOpen = signal(false);
  readonly preferences = signal<ConsentPreferences>({ analytics: false, marketing: false });

  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private initialized = false;

  initialize(): void {
    if (this.initialized || !isPlatformBrowser(this.platformId)) {
      return;
    }

    this.initialized = true;

    if (siteConfig.iubenda.siteId) {
      this.loadIubenda();
      return;
    }

    const saved = this.readPreferences();

    if (saved) {
      this.preferences.set(saved);
      this.applyGoogleConsent(saved);
      return;
    }

    this.bannerVisible.set(true);
  }

  acceptAll(): void {
    this.savePreferences({ analytics: true, marketing: true });
  }

  rejectOptional(): void {
    this.savePreferences({ analytics: false, marketing: false });
  }

  openPreferences(): void {
    const iubenda = window as IubendaWindow;

    if (siteConfig.iubenda.siteId && iubenda._iub?.cs?.api?.openPreferences) {
      iubenda._iub.cs.api.openPreferences();
      return;
    }

    this.preferencesOpen.set(true);
  }

  closePreferences(): void {
    this.preferencesOpen.set(false);
  }

  saveCustom(analytics: boolean, marketing: boolean): void {
    this.savePreferences({ analytics, marketing });
  }

  private savePreferences(preferences: ConsentPreferences): void {
    this.preferences.set(preferences);
    this.applyGoogleConsent(preferences);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    this.bannerVisible.set(false);
    this.preferencesOpen.set(false);
  }

  private readPreferences(): ConsentPreferences | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (!stored) {
        return null;
      }

      const parsed = JSON.parse(stored) as ConsentPreferences;
      return typeof parsed.analytics === 'boolean' && typeof parsed.marketing === 'boolean' ? parsed : null;
    } catch {
      return null;
    }
  }

  private applyGoogleConsent(preferences: ConsentPreferences): void {
    window.gtag?.('consent', 'update', {
      analytics_storage: preferences.analytics ? 'granted' : 'denied',
      ad_storage: preferences.marketing ? 'granted' : 'denied',
      ad_user_data: preferences.marketing ? 'granted' : 'denied',
      ad_personalization: preferences.marketing ? 'granted' : 'denied',
    });
  }

  private loadIubenda(): void {
    const iubenda = window as IubendaWindow;
    iubenda._iub ??= {};
    iubenda._iub.csConfiguration = {
      lang: 'it',
      siteId: siteConfig.iubenda.siteId,
      cookiePolicyId: siteConfig.iubenda.cookiePolicyId,
      countryDetection: true,
      perPurposeConsent: true,
      consentOnContinuedBrowsing: false,
      banner: {
        acceptButtonDisplay: true,
        customizeButtonDisplay: true,
        rejectButtonDisplay: true,
      },
    };

    if (this.document.querySelector('script[data-iubenda-cs]')) {
      return;
    }

    const script = this.document.createElement('script');
    script.src = 'https://cdn.iubenda.com/cs/iubenda_cs.js';
    script.async = true;
    script.charset = 'UTF-8';
    script.dataset['iubendaCs'] = 'true';
    this.document.head.appendChild(script);
  }
}
