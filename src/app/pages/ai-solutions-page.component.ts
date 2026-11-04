import { DOCUMENT } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { SeoService } from '../core/seo.service';
import { serviceAreas } from '../core/site-schema';
import { pageMetadata, siteConfig } from '../core/site.config';
import { PageMotionDirective } from '../shared/page-motion.directive';
import { ScrollSceneDirective } from '../shared/scroll-scene.directive';
import { AiRobotHeroComponent } from '../shared/ai-robot-hero.component';
import { AiSolutionsFollowupComponent } from './ai-solutions-followup.component';

@Component({
  imports: [AiRobotHeroComponent, PageMotionDirective, ScrollSceneDirective, AiSolutionsFollowupComponent],
  styleUrl: './ai-solutions-page.component.scss',
  template: `
    <article class="ai-page">
      <app-ai-robot-hero (demoRequested)="openDemo()" />

      <section class="ai-intro ai-section" aria-labelledby="ai-intro-title" appScrollScene>
        <div class="shell ai-intro__grid">
          <div appPageMotion="rise"><p class="eyebrow">Il problema, prima della tecnologia</p><h2 id="ai-intro-title">Il tempo del tuo team vale più di una risposta ripetuta.</h2></div>
          <div appPageMotion="rise" [motionDelay]="150" class="ai-intro__body"><p>Orari, servizi, tempi, modalità di lavoro: sono domande importanti per chi visita il sito. Quando la risposta non è immediata, la conversazione spesso si ferma. Quando arriva sempre al team, il lavoro si interrompe.</p><p>L'IA può occuparsi di questa prima parte, usando informazioni approvate da te. Le richieste particolari restano alle persone che possono davvero risolverle.</p></div>
        </div>
        <div class="shell ai-pain-list" aria-label="Esigenze che affrontiamo">
          @for (item of problems; track item.number) { <div class="ai-pain" appPageMotion="rise" [motionDelay]="$index * 90"><span class="ai-pain__number">{{ item.number }}</span><h3>{{ item.title }}</h3><p>{{ item.text }}</p></div> }
        </div>
      </section>

      <section class="ai-flow ai-section" aria-labelledby="ai-flow-title" appScrollScene>
        <div class="shell ai-flow__grid">
          <div class="ai-flow__visual" appPageMotion="mask"><img src="/images/soluzioni-ia-flusso-neurale.webp" alt="Connessioni luminose convergono in un nodo centrale e si diramano in risposte ordinate" width="1536" height="1024" loading="lazy" decoding="async" /><span class="ai-flow__visual-label" aria-hidden="true">Dalle domande alle risposte utili</span></div>
          <div class="ai-flow__copy" appPageMotion="rise" [motionDelay]="120"><p class="eyebrow eyebrow--gold">Cosa facciamo</p><h2 id="ai-flow-title">Una conversazione utile. Con una direzione precisa.</h2><p>Non partiamo da un bot generico. Organizziamo contenuti, domande frequenti e confini del servizio. Poi progettiamo come l'assistente risponde, quando chiede un dettaglio e quando è meglio coinvolgere il team.</p><ul class="ai-flow__points"><li><span>01</span><strong>Risponde con i tuoi contenuti</strong><p>Servizi, processo, contatti e informazioni che scegli di rendere disponibili.</p></li><li><span>02</span><strong>Aiuta a scegliere</strong><p>Fa poche domande utili e indirizza verso il servizio più pertinente.</p></li><li><span>03</span><strong>Riconosce i propri limiti</strong><p>Se manca un'informazione o serve una decisione umana, propone un passaggio al team.</p></li></ul></div>
        </div>
      </section>

      <app-ai-solutions-followup (demoRequested)="openDemo()" />
    </article>
  `,
})
export class AiSolutionsPageComponent implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly document = inject(DOCUMENT);
  readonly problems = [
    { number: '01', title: 'Le stesse domande, ogni giorno', text: 'Il team ripete informazioni già presenti, ma difficili da trovare al momento giusto.' },
    { number: '02', title: 'Un cliente pronto, fuori orario', text: 'La persona ha una domanda semplice, ma non trova un primo orientamento.' },
    { number: '03', title: 'Richieste senza contesto', text: 'Prima di capire cosa serve davvero, iniziano scambi di messaggi evitabili.' },
  ];

  ngOnInit(): void {
    const pageUrl = `${siteConfig.origin}${pageMetadata.aiSolutions.path}`;
    this.seo.setPage(pageMetadata.aiSolutions, [
      { '@context': 'https://schema.org', '@type': 'WebPage', name: pageMetadata.aiSolutions.title, description: pageMetadata.aiSolutions.description, url: pageUrl, inLanguage: 'it-IT', primaryImageOfPage: `${siteConfig.origin}${pageMetadata.aiSolutions.socialImage.src}` },
      { '@context': 'https://schema.org', '@type': 'Service', name: 'Assistenti IA e automazioni per aziende', description: pageMetadata.aiSolutions.description, serviceType: 'Assistenti IA per il sito web e automazione del primo contatto', provider: { '@id': `${siteConfig.origin}/#organization` }, areaServed: serviceAreas, url: pageUrl },
      { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.origin },
        { '@type': 'ListItem', position: 2, name: 'Servizi', item: `${siteConfig.origin}/servizi` },
        { '@type': 'ListItem', position: 3, name: 'Soluzioni IA', item: pageUrl },
      ] },
    ]);
  }

  openDemo(): void {
    const launcher = this.document.querySelector<HTMLButtonElement>('.chat-launcher');
    if (!launcher) return;
    if (launcher.getAttribute('aria-expanded') !== 'true') {
      launcher.click();
    } else {
      this.document.querySelector<HTMLTextAreaElement>('#chat-question')?.focus();
    }
  }
}
