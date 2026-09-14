import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SeoService } from '../core/seo.service';
import { pageMetadata, serviceEntries, siteConfig } from '../core/site.config';
import { TrackingService } from '../core/tracking.service';
import { PageMotionDirective } from '../shared/page-motion.directive';
import { KineticTextComponent } from '../shared/kinetic-text.component';
import { ScrollSceneDirective } from '../shared/scroll-scene.directive';
import { BrandOrbitComponent } from '../shared/brand-orbit.component';

type SubmissionState = 'idle' | 'unconfigured' | 'sending' | 'success' | 'error';

@Component({
  imports: [BrandOrbitComponent, KineticTextComponent, ScrollSceneDirective, PageMotionDirective, ReactiveFormsModule],
  template: `
    <section class="page-hero page-hero--contact chapter-hero contact-opening" appScrollScene="hero">
      <app-brand-orbit />
      <div class="shell page-hero__content">
        <p appPageMotion="hero" class="eyebrow">Contatti / Il prossimo capitolo</p>
        <h1><app-kinetic-text text="Parliamo di ciò che verrà." [delay]="120" /></h1>
        <p appPageMotion="hero" [motionDelay]="320">Ogni progetto comincia con una conversazione. La prossima potrebbe essere la nostra.</p>
        <a class="text-link contact-opening__link" href="#raccontaci">Raccontaci la tua idea <span aria-hidden="true">↓</span></a>
      </div>
    </section>
    <section id="raccontaci" class="section contact-section" appScrollScene>
      <div class="shell contact-grid">
        <aside class="contact-details">
          <div appPageMotion="rise" class="contact-signature" aria-hidden="true">
            <img src="/images/logo-memento-footer.png" alt="" width="1350" height="1200" />
          </div>
          <div appPageMotion="rise" [motionDelay]="180" class="contact-details__content">
            <p class="eyebrow">Contatti diretti</p>
            <h2><app-kinetic-text text="Preferisci parlarne subito?" /></h2>
            <a [href]="config.contact.phoneHref" (click)="tracking.trackContact('phone', 'contacts')"><span>Telefono</span>{{ config.contact.phoneDisplay }}</a>
            <a [href]="'mailto:' + config.contact.email" (click)="tracking.trackContact('email', 'contacts')"><span>Email</span>{{ config.contact.email }}</a>
            <a [href]="config.contact.whatsappUrl" target="_blank" rel="noopener noreferrer" (click)="tracking.trackContact('whatsapp', 'contacts')"><span>WhatsApp</span>Apri la chat</a>
            <p class="contact-address"><span>Sede</span>{{ config.contact.address }}</p>
          </div>
        </aside>

        <form appPageMotion="rise" [motionDelay]="180" class="contact-form" [formGroup]="form" (ngSubmit)="submit()" novalidate>
          <div class="form-grid">
            <div class="field"><label for="name">Nome e cognome <b aria-hidden="true">*</b></label><input id="name" type="text" formControlName="name" autocomplete="name" />@if (showError('name')) { <small>Inserisci il tuo nome.</small> }</div>
            <div class="field"><label for="email">Email <b aria-hidden="true">*</b></label><input id="email" type="email" formControlName="email" autocomplete="email" />@if (showError('email')) { <small>Inserisci un indirizzo email valido.</small> }</div>
            <div class="field"><label for="phone">Telefono</label><input id="phone" type="tel" formControlName="phone" autocomplete="tel" /></div>
            <div class="field"><label for="company">Azienda</label><input id="company" type="text" formControlName="company" autocomplete="organization" /></div>
            <div class="field field--full"><label for="service">Di cosa hai bisogno?</label><select id="service" formControlName="service"><option value="">Seleziona un ambito</option>@for (entry of serviceEntries; track entry.key) { <option [value]="entry.service.eyebrow">{{ entry.service.eyebrow }}</option> }<option value="Altro">Altro</option></select></div>
            <div class="field field--full"><label for="message">Raccontaci il progetto <b aria-hidden="true">*</b></label><textarea id="message" rows="6" formControlName="message"></textarea>@if (showError('message')) { <small>Scrivi qualche dettaglio del progetto.</small> }</div>
          </div>
          <label class="privacy-check"><input type="checkbox" formControlName="privacyAccepted" /><span>Ho letto la <a [href]="config.iubenda.privacyPolicyUrl" target="_blank" rel="noopener noreferrer">Privacy Policy</a> e autorizzo il trattamento della richiesta. <b aria-hidden="true">*</b></span></label>
          @if (showError('privacyAccepted')) { <p class="form-error" role="alert">Per procedere è necessario prendere visione dell’informativa.</p> }
          @if (state() === 'unconfigured') { <p class="form-status" role="status">Il modulo è in attesa di collegamento. Puoi contattarci via email, telefono o WhatsApp.</p> }
          @if (state() === 'success') { <p class="form-status form-status--success" role="status">Grazie, la richiesta è stata inviata.</p> }
          @if (state() === 'error') { <p class="form-status form-status--error" role="alert">L’invio non è riuscito. Riprovare oppure usa uno dei contatti diretti.</p> }
          <button class="button" type="submit" [disabled]="state() === 'sending'">{{ state() === 'sending' ? 'Invio in corso…' : 'Invia richiesta' }} <span aria-hidden="true">↗</span></button>
        </form>
      </div>
    </section>
  `,
})
export class ContactPageComponent {
  readonly config = siteConfig;
  readonly serviceEntries = serviceEntries;
  readonly state = signal<SubmissionState>('idle');
  readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    phone: new FormControl('', { nonNullable: true }),
    company: new FormControl('', { nonNullable: true }),
    service: new FormControl('', { nonNullable: true }),
    message: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    privacyAccepted: new FormControl(false, { nonNullable: true, validators: [Validators.requiredTrue] }),
  });

  readonly tracking = inject(TrackingService);
  private readonly http = inject(HttpClient);
  private readonly seo = inject(SeoService);

  constructor() {
    this.seo.setPage(pageMetadata.contact, {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: pageMetadata.contact.title,
      url: `${siteConfig.origin}${pageMetadata.contact.path}`,
      mainEntity: { '@id': `${siteConfig.origin}/#organization` },
    });
  }

  showError(controlName: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.touched || this.state() === 'error');
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.tracking.track('contact_form_submit', { form_location: 'contatti', form_status: 'attempt' });

    if (!siteConfig.formEndpoint) {
      this.state.set('unconfigured');
      this.tracking.track('contact_form_unconfigured', { form_location: 'contatti' });
      return;
    }

    this.state.set('sending');
    this.http.post(siteConfig.formEndpoint, this.form.getRawValue()).subscribe({
      next: () => {
        this.state.set('success');
        this.tracking.track('contact_form_success', { form_location: 'contatti' });
        this.form.reset({ name: '', email: '', phone: '', company: '', service: '', message: '', privacyAccepted: false });
      },
      error: () => {
        this.state.set('error');
        this.tracking.track('contact_form_error', { form_location: 'contatti' });
      },
    });
  }
}
