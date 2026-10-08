import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConsentService } from '../core/consent.service';
import { serviceEntries, siteConfig } from '../core/site.config';
import { TrackingService } from '../core/tracking.service';

@Component({
  selector: 'app-site-footer',
  imports: [RouterLink],
  template: `
    <footer class="site-footer">
      <div class="shell footer-grid">
        <div>
          <a class="footer-logo" routerLink="/" aria-label="Memento Production, home">
            <img src="/images/logo-memento-footer.png" alt="Memento Production" width="1350" height="1200" />
          </a>
          <p class="footer-intro">Agenzia di comunicazione e marketing con sede a Moncalieri, per imprese di Torino, Pinerolo e Chieri.</p>
          <nav class="footer-socials" aria-label="Memento Production sui social media">
            <span class="footer-socials__label">Seguici</span>
            <div class="footer-socials__list">
              @for (profile of config.socialProfiles; track profile.key) {
                <a
                  [href]="profile.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  [attr.aria-label]="'Memento Production su ' + profile.label + ' (nuova scheda)'"
                  (click)="tracking.trackSocial(profile.key, 'footer')"
                >
                  @switch (profile.key) {
                    @case ('facebook') {
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path class="footer-socials__fill" d="M14.5 8H18V4h-3.5C10.9 4 9 6.2 9 9.5V12H6v4h3v6h4v-6h4l.6-4H13V9.7c0-1.1.4-1.7 1.5-1.7Z" /></svg>
                    }
                    @case ('instagram') {
                      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.4" cy="6.8" r="1" class="footer-socials__dot" /></svg>
                    }
                    @case ('youtube') {
                      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="2.5" y="5.5" width="19" height="13" rx="4" /><path d="m10 9 5 3-5 3V9Z" class="footer-socials__play" /></svg>
                    }
                  }
                  <span>{{ profile.label }}</span>
                </a>
              }
            </div>
          </nav>
        </div>

        <div class="footer-column">
          <h3>Esplora</h3>
          <a routerLink="/agenzia">Agenzia</a>
          <a routerLink="/agenzia" fragment="chi-siamo">Chi siamo</a>
          <a routerLink="/servizi">Servizi</a>
          <a routerLink="/portfolio">Portfolio</a>
          <a routerLink="/contatti">Contatti</a>
        </div>

        <div class="footer-column">
          <h3>Contatti</h3>
          <a [href]="config.contact.phoneHref" (click)="tracking.trackContact('phone', 'footer')">{{ config.contact.phoneDisplay }}</a>
          <a [href]="'mailto:' + config.contact.email" (click)="tracking.trackContact('email', 'footer')">{{ config.contact.email }}</a>
          <a [href]="config.contact.whatsappUrl" target="_blank" rel="noopener noreferrer" (click)="tracking.trackContact('whatsapp', 'footer')">WhatsApp</a>
          <address>{{ config.contact.address }}</address>
        </div>
      </div>

      <nav class="shell footer-services" aria-label="Servizi Memento">@for (entry of services; track entry.path) { <a [routerLink]="entry.path">{{ entry.service.shortTitle }}</a> }</nav>

      <div class="shell footer-bottom">
        <span>© {{ currentYear }} Memento Production · P. IVA {{ config.contact.vatNumber }}</span>
        <div class="footer-legal">
          <a routerLink="/privacy-policy">Privacy e cookie</a>
          <a [href]="config.iubenda.privacyPolicyUrl" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
          <a [href]="config.iubenda.cookiePolicyUrl" target="_blank" rel="noopener noreferrer">Cookie Policy</a>
          <button type="button" class="link-button" (click)="consent.openPreferences()">Modifica preferenze</button>
        </div>
      </div>
    </footer>
  `,
})
export class SiteFooterComponent {
  readonly config = siteConfig;
  readonly services = serviceEntries;
  readonly currentYear = new Date().getFullYear();
  readonly consent = inject(ConsentService);
  readonly tracking = inject(TrackingService);
}
