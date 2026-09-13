import { Component, OnInit, inject } from '@angular/core';
import { ConsentService } from '../core/consent.service';
import { siteConfig } from '../core/site.config';

@Component({
  selector: 'app-consent-banner',
  template: `
    @if (consent.bannerVisible()) {
      <section class="consent-banner" role="dialog" aria-modal="true" aria-labelledby="consent-title" aria-describedby="consent-copy">
        <div>
          <p class="eyebrow">Le tue preferenze</p>
          <h2 id="consent-title">Scegli come usare i cookie</h2>
          <p id="consent-copy">Usiamo solo i cookie necessari finché non scegli diversamente. Puoi modificare le preferenze in qualsiasi momento.</p>
        </div>
        <div class="consent-actions">
          <button class="button button--quiet" type="button" (click)="consent.rejectOptional()">Rifiuta</button>
          <button class="button button--outline" type="button" (click)="consent.openPreferences()">Personalizza</button>
          <button class="button" type="button" (click)="consent.acceptAll()">Accetta</button>
        </div>
      </section>
    }

    @if (consent.preferencesOpen()) {
      <div class="consent-dialog-backdrop" (click)="consent.closePreferences()">
        <section class="consent-dialog" role="dialog" aria-modal="true" aria-labelledby="preferences-title" (click)="$event.stopPropagation()">
          <div class="dialog-heading">
            <div>
              <p class="eyebrow">Preferenze cookie</p>
              <h2 id="preferences-title">Decidi con precisione</h2>
            </div>
            <button class="icon-button" type="button" aria-label="Chiudi preferenze" (click)="consent.closePreferences()">×</button>
          </div>

          <label class="consent-option">
            <input type="checkbox" checked disabled />
            <span><strong>Necessari</strong><small>Permettono il funzionamento essenziale del sito.</small></span>
          </label>
          <label class="consent-option">
            <input #analytics type="checkbox" [checked]="consent.preferences().analytics" />
            <span><strong>Analitici</strong><small>Aiutano a comprendere in forma aggregata l’uso del sito.</small></span>
          </label>
          <label class="consent-option">
            <input #marketing type="checkbox" [checked]="consent.preferences().marketing" />
            <span><strong>Marketing</strong><small>Abilitano le funzionalità pubblicitarie di Google.</small></span>
          </label>

          <div class="dialog-actions">
            <a [href]="config.iubenda.cookiePolicyUrl" target="_blank" rel="noopener noreferrer">Leggi la Cookie Policy</a>
            <button class="button" type="button" (click)="consent.saveCustom(analytics.checked, marketing.checked)">Salva preferenze</button>
          </div>
        </section>
      </div>
    }
  `,
})
export class ConsentBannerComponent implements OnInit {
  readonly config = siteConfig;
  readonly consent = inject(ConsentService);

  ngOnInit(): void {
    this.consent.initialize();
  }
}
