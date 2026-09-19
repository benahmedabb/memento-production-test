import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConsentService } from '../core/consent.service';
import { siteConfig } from '../core/site.config';
import { TrackingService } from '../core/tracking.service';

@Component({
  selector: 'app-site-footer',
  imports: [RouterLink],
  template: `
    <footer class="site-footer">
      <div class="shell footer-grid">
        <div>
          <a class="footer-logo" routerLink="/" aria-label="Memento Production, home">
            <img src="/images/logo-memento-footer.png" alt="" width="1350" height="1200" />
          </a>
          <p class="footer-intro">Comunicazione, immagini e sistemi digitali per brand che vogliono lasciare un segno.</p>
        </div>

        <div class="footer-column">
          <h2>Esplora</h2>
          <a routerLink="/agenzia">Agenzia</a>
          <a routerLink="/servizi">Servizi</a>
          <a routerLink="/portfolio">Portfolio</a>
          <a routerLink="/contatti">Contatti</a>
        </div>

        <div class="footer-column">
          <h2>Contatti</h2>
          <a [href]="config.contact.phoneHref" (click)="tracking.trackContact('phone', 'footer')">{{ config.contact.phoneDisplay }}</a>
          <a [href]="'mailto:' + config.contact.email" (click)="tracking.trackContact('email', 'footer')">{{ config.contact.email }}</a>
          <a [href]="config.contact.whatsappUrl" target="_blank" rel="noopener noreferrer" (click)="tracking.trackContact('whatsapp', 'footer')">WhatsApp</a>
          <address>{{ config.contact.address }}</address>
        </div>
      </div>

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
  readonly currentYear = new Date().getFullYear();
  readonly consent = inject(ConsentService);
  readonly tracking = inject(TrackingService);
}
