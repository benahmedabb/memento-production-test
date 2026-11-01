import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, OnDestroy, PLATFORM_ID, inject, signal } from '@angular/core';

interface ConsentPreferences {
  readonly analytics: boolean;
  /** Consent for external platform content (Iubenda purpose 3: Experience). */
  readonly marketing: boolean;
}

interface IubendaPreferences {
  readonly consent?: boolean;
  readonly purposes?: Record<string, boolean>;
}

interface IubendaWindow extends Window {
  _iub?: {
    cs?: {
      api?: {
        getPreferences?: () => IubendaPreferences | null | false;
        openPreferences?: () => void;
      };
    };
  };
}

const IUBENDA_PREFERENCES_EVENT = 'memento:iubenda-preferences-changed';
const IUBENDA_READY_RETRIES = 40;
const IUBENDA_RETRY_DELAY_MS = 250;

@Injectable({ providedIn: 'root' })
export class ConsentService implements OnDestroy {
  readonly preferencesOpen = signal(false);
  readonly preferences = signal<ConsentPreferences>({ analytics: false, marketing: false });

  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private initialized = false;
  private syncTimer: ReturnType<typeof setTimeout> | undefined;
  private openTimer: ReturnType<typeof setTimeout> | undefined;
  private readonly handleIubendaPreferencesChanged = () => {
    this.preferencesOpen.set(false);
    this.syncFromIubenda();
  };

  initialize(): void {
    if (this.initialized || !isPlatformBrowser(this.platformId)) {
      return;
    }

    this.initialized = true;
    window.addEventListener(IUBENDA_PREFERENCES_EVENT, this.handleIubendaPreferencesChanged);
    this.syncFromIubenda(0);
  }

  openPreferences(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.preferencesOpen.set(true);
    this.openIubendaPreferences(0);
  }

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    window.removeEventListener(IUBENDA_PREFERENCES_EVENT, this.handleIubendaPreferencesChanged);
    if (this.syncTimer) clearTimeout(this.syncTimer);
    if (this.openTimer) clearTimeout(this.openTimer);
  }

  private syncFromIubenda(attempt = IUBENDA_READY_RETRIES): void {
    const stored = (window as IubendaWindow)._iub?.cs?.api?.getPreferences?.();

    if (!stored) {
      if (attempt < IUBENDA_READY_RETRIES) {
        this.syncTimer = setTimeout(
          () => this.syncFromIubenda(attempt + 1),
          IUBENDA_RETRY_DELAY_MS,
        );
      }
      return;
    }

    const previous = this.preferences();
    const purposes = stored.purposes;
    const allOptionalAccepted = stored.consent === true && !purposes;
    const current = {
      analytics: purposes?.['4'] === true || allOptionalAccepted,
      marketing: purposes?.['3'] === true || allOptionalAccepted,
    };

    this.preferences.set(current);
    if (!previous.analytics && current.analytics) this.trackGooglePageView();
  }

  private openIubendaPreferences(attempt: number): void {
    const api = (window as IubendaWindow)._iub?.cs?.api;

    if (api?.openPreferences) {
      api.openPreferences();
      return;
    }

    if (attempt < IUBENDA_READY_RETRIES) {
      this.openTimer = setTimeout(
        () => this.openIubendaPreferences(attempt + 1),
        IUBENDA_RETRY_DELAY_MS,
      );
    } else {
      this.preferencesOpen.set(false);
    }
  }

  private trackGooglePageView(): void {
    window.gtag?.('event', 'page_view', {
      page_location: window.location.href,
      page_path: window.location.pathname,
      page_title: this.document.title,
    });
  }
}
