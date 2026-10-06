import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../core/seo.service';
import { pageMetadata, siteConfig } from '../core/site.config';
import { TrackingService } from '../core/tracking.service';
import { AgencyOpeningComponent } from '../shared/agency-opening.component';
import { AgencyPeopleComponent } from '../shared/agency-people.component';
import { AgencyProcessTimelineComponent } from '../shared/agency-process-timeline.component';
import { KineticTextComponent } from '../shared/kinetic-text.component';
import { ScrollSceneDirective } from '../shared/scroll-scene.directive';
import { AgencyTeamComponent } from '../shared/agency-team.component';
import { PageMotionDirective } from '../shared/page-motion.directive';

@Component({
  imports: [AgencyOpeningComponent, AgencyPeopleComponent, AgencyProcessTimelineComponent, AgencyTeamComponent, KineticTextComponent, ScrollSceneDirective, PageMotionDirective, RouterLink],
  template: `
    <app-agency-opening />

    <app-agency-process-timeline />

    <section class="section agency-manifesto section--sage" appScrollScene>
      <div class="shell two-column two-column--offset">
        <div><p class="eyebrow">Il nostro punto di vista</p><h2><app-kinetic-text mode="ink" text="Estetica e strategia non sono due reparti separati." /></h2></div>
        <div appPageMotion="rise" [motionDelay]="180" class="intro-copy"><p>La nostra sede è a Moncalieri. Affianchiamo le aziende di Torino, Pinerolo e Chieri nella comunicazione: produzione video e fotografia, gestione social, campagne Google e Meta, grafica e sviluppo web.</p><p>Partiamo da ciò che deve restare impresso, dal pubblico e dall’obiettivo del progetto. Coordiniamo contenuti, identità e canali, così ogni attività contribuisce a una presenza riconoscibile.</p></div>
      </div>
    </section>

    <app-agency-people />

    <section id="un-po-di-noi" class="people-story" aria-labelledby="people-story-title">
      <div class="shell people-story__layout">
        <div class="people-story__heading" appPageMotion="rise">
          <p class="eyebrow">Un po’ di noi</p>
          <h2 id="people-story-title">L’intesa è il<br />nostro punto<br /><em>di partenza.</em></h2>
          <span class="people-story__mark" aria-hidden="true">S + E</span>
        </div>
        <div class="people-story__copy" appPageMotion="rise" [motionDelay]="120">
          <p class="people-story__lead">Una coppia nella vita.<br /><strong>Una visione condivisa nel lavoro.</strong></p>
          <p><strong>Stefan</strong> si occupa di fotografia e videomaking da quasi dieci anni. Nel <strong>2022 ha fondato Memento Production</strong>, specializzandosi in marketing e vendita: perché un contenuto deve essere bello, ma anche avere una direzione.</p>
          <p><strong>Elena</strong> guida il reparto social a livello strategico e gestionale. Dà continuità alle idee, organizza i contenuti e tiene insieme la voce del brand e gli obiettivi del progetto.</p>
          <p>Insieme anche nella vita reale, portano questa intesa in un modo di lavorare fatto di ascolto, fiducia e confronto. Attorno a loro, <strong>un team di circa 8 professionisti</strong> mette in campo le competenze che servono a ogni progetto.</p>
          <a class="text-link" routerLink="/portfolio">Guarda cosa realizziamo insieme <span aria-hidden="true">↗&#xFE0E;</span></a>
        </div>
      </div>
    </section>

    <app-agency-team />

    <section id="chiavi-in-mano" class="people-turnkey" aria-labelledby="turnkey-title">
      <div class="shell">
        <div class="people-turnkey__heading">
          <div appPageMotion="rise">
            <p class="eyebrow">La nostra formula</p>
            <h2 id="turnkey-title">Tu porti l’idea.<br /><em>Noi teniamo le fila.</em></h2>
          </div>
          <div class="people-turnkey__intro" appPageMotion="rise" [motionDelay]="120">
            <p class="people-turnkey__promise">Comunicazione e marketing.<br /><strong>Chiavi in mano.</strong></p>
            <p>Seguiamo progetti su piccola e grande scala, dalla strategia alla realizzazione. Coordiniamo persone, attività e canali: tu hai una regia unica con cui confrontarti e una comunicazione chiara ed efficiente.</p>
          </div>
        </div>
        <ol class="people-turnkey__steps">
          <li appPageMotion="rise"><span class="people-turnkey__number" aria-hidden="true">01</span><h3>Ci racconti<br />dove vuoi arrivare.</h3><p>Partiamo dalla tua attività, dal pubblico e dagli obiettivi. Definiamo insieme priorità, strumenti e direzione.</p><span class="people-turnkey__label">Ascolto & strategia</span></li>
          <li appPageMotion="rise" [motionDelay]="100"><span class="people-turnkey__number" aria-hidden="true">02</span><h3>Mettiamo al lavoro<br />la squadra giusta.</h3><p>Foto, video, social, campagne, grafica e sito: attiviamo le competenze utili al tuo progetto e ne coordiniamo ogni fase.</p><span class="people-turnkey__label">Produzione & coordinamento</span></li>
          <li appPageMotion="rise" [motionDelay]="200"><span class="people-turnkey__number" aria-hidden="true">03</span><h3>Portiamo tutto<br />nella stessa direzione.</h3><p>Dalla consegna alla pubblicazione sui canali concordati, curiamo la coerenza della comunicazione e leggiamo i risultati delle attività.</p><span class="people-turnkey__label">Consegna & continuità</span></li>
        </ol>
        <div class="people-turnkey__closing">
          <p>Il tuo punto di riferimento è Memento.<br /><strong>L’organizzazione del lavoro è affare nostro.</strong></p>
          <a class="button button--ink" routerLink="/contatti" (click)="tracking.trackQuote('agency_turnkey')">Parliamo del tuo progetto <span aria-hidden="true">↗&#xFE0E;</span></a>
        </div>
      </div>
    </section>

    <section class="people-local" aria-labelledby="people-local-title">
      <div class="shell people-local__layout">
        <div><p class="eyebrow">Vicini, anche nel modo di lavorare</p><h2 id="people-local-title">Da Moncalieri,<br />al fianco della tua azienda.</h2></div>
        <div><p>Siamo un’agenzia di comunicazione e marketing con sede a <strong>Moncalieri</strong>. Affianchiamo aziende di <strong>Torino, Pinerolo e Chieri</strong> con progetti che uniscono strategia, produzione di contenuti e presenza digitale.</p><p>Che si tratti di raccontare un’attività, lanciare un servizio o ripensare un brand, partiamo sempre dalle persone e da ciò che hanno da dire.</p><div class="button-row"><a class="text-link" routerLink="/servizi">Esplora i servizi <span aria-hidden="true">↗&#xFE0E;</span></a><a class="text-link" routerLink="/recensioni">Le parole dei clienti <span aria-hidden="true">↗&#xFE0E;</span></a></div></div>
      </div>
    </section>
  `,
})
export class AgencyPageComponent implements OnInit {
  readonly tracking = inject(TrackingService);
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    const origin = siteConfig.origin;
    const url = `${origin}${pageMetadata.agency.path}`;
    this.seo.setPage(pageMetadata.agency, [
      {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        '@id': `${url}#webpage`,
        name: pageMetadata.agency.title,
        description: pageMetadata.agency.description,
        url,
        inLanguage: 'it-IT',
        about: { '@id': `${origin}/#organization` },
        mainEntity: { '@id': `${origin}/#organization` },
        breadcrumb: { '@id': `${url}#breadcrumb` },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          contentUrl: `${origin}${siteConfig.agencyPortrait.src}`,
          caption: siteConfig.agencyPortrait.alt,
          width: 1280,
          height: 1920,
        },
        mentions: [
          { '@type': 'Person', '@id': `${url}#stefan`, name: 'Stefan Vidinaru', jobTitle: 'Fondatore e direzione creativa', worksFor: { '@id': `${origin}/#organization` } },
          { '@type': 'Person', '@id': `${url}#elena`, name: 'Elena', jobTitle: 'Responsabile strategia e gestione social', worksFor: { '@id': `${origin}/#organization` } },
        ],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
          { '@type': 'ListItem', position: 2, name: 'Agenzia', item: url },
        ],
      },
    ]);
  }
}
