import { Component, OnInit, inject } from '@angular/core';
import { ConsentService } from '../core/consent.service';
import { SeoService } from '../core/seo.service';
import { pageMetadata, siteConfig } from '../core/site.config';
import { TrackingService } from '../core/tracking.service';
import { PageMotionDirective } from '../shared/page-motion.directive';
import { KineticTextComponent } from '../shared/kinetic-text.component';
import { ScrollSceneDirective } from '../shared/scroll-scene.directive';
import { BrandOrbitComponent } from '../shared/brand-orbit.component';

@Component({
  imports: [BrandOrbitComponent, KineticTextComponent, ScrollSceneDirective, PageMotionDirective],
  template: `
    <section class="page-hero page-hero--policy chapter-hero" appScrollScene="hero">
      <span class="chapter-hero__frame" aria-hidden="true"></span>
      <app-brand-orbit />
      <div class="shell page-hero__content">
        <p appPageMotion="hero" [motionDelay]="140" class="eyebrow">Trasparenza</p>
        <h1><app-kinetic-text text="Privacy e Cookie Policy" [delay]="160" /></h1>
        <p appPageMotion="hero" [motionDelay]="560">Qui trovi i collegamenti alle informative pubblicate e gli strumenti per modificare le preferenze relative ai cookie.</p>
      </div>
    </section>

    <section class="section policy-section section--sage-soft">
      <div class="shell policy-grid">
        <article appPageMotion="rise" class="policy-card">
          <p class="eyebrow">Privacy</p>
          <h2><app-kinetic-text text="Informativa sul trattamento dei dati" /></h2>
          <p>L’informativa completa descrive i dati trattati, le finalità, i diritti dell’interessato e i contatti del titolare.</p>
          <a class="button button--outline" [href]="config.iubenda.privacyPolicyUrl" target="_blank" rel="noopener noreferrer">Apri Privacy Policy <span aria-hidden="true">↗</span></a>
        </article>
        <article appPageMotion="rise" [motionDelay]="180" class="policy-card">
          <p class="eyebrow">Cookie</p>
          <h2><app-kinetic-text text="Informativa cookie e preferenze" /></h2>
          <p>Puoi consultare l’informativa cookie o modificare in ogni momento le preferenze memorizzate sul dispositivo.</p>
          <div class="button-row"><a class="button button--outline" [href]="config.iubenda.cookiePolicyUrl" target="_blank" rel="noopener noreferrer">Apri Cookie Policy <span aria-hidden="true">↗</span></a><button type="button" class="text-link" (click)="consent.openPreferences()">Modifica preferenze <span aria-hidden="true">→</span></button></div>
        </article>
      </div>

      <div appPageMotion="rise" class="shell policy-notice">
        <p><strong>Titolare del trattamento:</strong> {{ config.contact.legalName }} · P. IVA {{ config.contact.vatNumber }} · {{ config.contact.address }} · <a [href]="'mailto:' + config.contact.email" (click)="tracking.trackContact('email', 'privacy_policy')">{{ config.contact.email }}</a></p>
        <p>Questa pagina rende disponibili le informative ufficiali; non ne sostituisce il contenuto.</p>
      </div>
    </section>
  `,
})
export class PolicyPageComponent implements OnInit {
  readonly config = siteConfig;
  readonly consent = inject(ConsentService);
  readonly tracking = inject(TrackingService);
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.setPage(pageMetadata.policy, {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: pageMetadata.policy.title,
      url: `${siteConfig.origin}${pageMetadata.policy.path}`,
    });
  }
}
