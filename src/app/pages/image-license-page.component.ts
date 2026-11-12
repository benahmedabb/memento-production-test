import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../core/seo.service';
import { pageMetadata, siteConfig } from '../core/site.config';
import { PageMotionDirective } from '../shared/page-motion.directive';
import { KineticTextComponent } from '../shared/kinetic-text.component';
import { ScrollSceneDirective } from '../shared/scroll-scene.directive';

@Component({
  imports: [RouterLink, KineticTextComponent, ScrollSceneDirective, PageMotionDirective],
  template: `
    <section class="page-hero page-hero--policy chapter-hero" appScrollScene="hero">
      <span class="chapter-hero__frame" aria-hidden="true"></span>
      <div class="shell page-hero__content">
        <p appPageMotion="hero" [motionDelay]="140" class="eyebrow">Diritti e utilizzo</p>
        <h1><app-kinetic-text text="Licenza delle immagini" [delay]="160" /></h1>
        <p appPageMotion="hero" [motionDelay]="560">
          Le condizioni che regolano l’utilizzo delle fotografie, delle grafiche e degli altri
          contenuti visivi pubblicati su questo sito.
        </p>
      </div>
    </section>

    <section class="section policy-section section--sage-soft">
      <div class="shell policy-grid">
        <article appPageMotion="rise" class="policy-card">
          <p class="eyebrow">Condizioni d’uso</p>
          <h2><app-kinetic-text text="Tutti i diritti riservati" /></h2>
          <p>
            Salvo diversa indicazione, i contenuti visivi accreditati a Memento Production sono
            protetti dal diritto d’autore. La pubblicazione sul sito non concede automaticamente il
            diritto di copiarli, modificarli, distribuirli, ripubblicarli o utilizzarli per finalità
            commerciali.
          </p>
          <p>
            Ogni utilizzo richiede un’autorizzazione scritta. Alcuni contenuti possono inoltre
            includere marchi, opere, persone o materiali appartenenti a clienti e terzi, per i quali
            possono essere necessari ulteriori consensi.
          </p>
        </article>
        <article appPageMotion="rise" [motionDelay]="180" class="policy-card">
          <p class="eyebrow">Richiedi un’autorizzazione</p>
          <h2><app-kinetic-text text="Raccontaci come vuoi usare l’immagine" /></h2>
          <p>
            Indica l’immagine o l’indirizzo della pagina, la finalità, i canali, il territorio e la
            durata prevista. Verificheremo i diritti disponibili e comunicheremo per iscritto
            eventuali condizioni, crediti e costi.
          </p>
          <a class="button button--outline" routerLink="/contatti"
            >Contatta Memento <span aria-hidden="true">→&#xFE0E;</span></a
          >
        </article>
      </div>

      <div appPageMotion="rise" class="shell policy-notice">
        <p>
          <strong>Titolare dei contenuti accreditati:</strong> {{ config.contact.legalName }} · P.
          IVA {{ config.contact.vatNumber }} ·
          <a [href]="'mailto:' + config.contact.email">{{ config.contact.email }}</a>
        </p>
        <p>
          Queste condizioni si applicano ai contenuti accreditati a Memento Production. Se un
          contenuto riporta un credito differente, valgono i diritti e le condizioni indicati dal
          relativo titolare.
        </p>
      </div>
    </section>
  `,
})
export class ImageLicensePageComponent implements OnInit {
  readonly config = siteConfig;
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    const url = `${siteConfig.origin}${pageMetadata.imageLicense.path}`;
    this.seo.setPage(pageMetadata.imageLicense, {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: pageMetadata.imageLicense.title,
      description: pageMetadata.imageLicense.description,
      url,
      inLanguage: 'it-IT',
      isPartOf: { '@id': `${siteConfig.origin}/#website` },
      about: { '@id': `${siteConfig.origin}/#organization` },
    });
  }
}
