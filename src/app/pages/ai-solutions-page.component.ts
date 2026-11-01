import { DOCUMENT } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../core/seo.service';
import { serviceAreas } from '../core/site-schema';
import { pageMetadata, siteConfig } from '../core/site.config';
import { TrackingService } from '../core/tracking.service';
import { PageMotionDirective } from '../shared/page-motion.directive';
import { ScrollSceneDirective } from '../shared/scroll-scene.directive';

const DEMO_ORIGIN = 'https://memento-production-test-2.vercel.app';

@Component({
  imports: [RouterLink, PageMotionDirective, ScrollSceneDirective],
  styleUrl: './ai-solutions-page.component.scss',
  template: `
    <article class="ai-page">
      <section class="ai-hero" aria-labelledby="ai-title" appScrollScene="hero">
        <img class="ai-hero__image" src="/images/soluzioni-ia-rete-neurale-hero.webp" alt="" width="1672" height="941" fetchpriority="high" />
        <div class="ai-hero__shade" aria-hidden="true"></div>
        <div class="ai-hero__orbit" aria-hidden="true"><span></span><span></span><span></span></div>
        <div class="shell ai-hero__inner">
          <nav class="ai-breadcrumb" aria-label="Percorso di navigazione"><a routerLink="/">Home</a><span aria-hidden="true">/</span><a routerLink="/servizi">Servizi</a><span aria-hidden="true">/</span><span>Soluzioni IA</span></nav>
          <div class="ai-hero__copy">
            <p appPageMotion="hero" [motionDelay]="100" class="eyebrow eyebrow--gold">Soluzioni IA per aziende · Torino</p>
            <h1 id="ai-title" appPageMotion="hero" [motionDelay]="210">Le domande arrivano sempre. <em>Facciamo trovare una risposta.</em></h1>
            <p appPageMotion="hero" [motionDelay]="330" class="ai-hero__lead">Il cliente vuole capire se sei la scelta giusta. Il tuo team non può ripetere le stesse risposte tutto il giorno. Progettiamo assistenti IA che conoscono la tua attività, orientano le persone e sanno quando passare la conversazione a te.</p>
            <div appPageMotion="hero" [motionDelay]="450" class="ai-hero__actions">
              <a class="button button--gold" routerLink="/contatti" [queryParams]="{ servizio: '/soluzioni-ia-torino' }" (click)="tracking.trackQuote('ai_hero')">Parliamo del tuo caso <span aria-hidden="true">↗&#xFE0E;</span></a>
              <button class="ai-hero__demo" type="button" (click)="openDemo()">Prova l'assistente del sito <span aria-hidden="true">→</span></button>
            </div>
          </div>
          <p class="ai-hero__index" aria-hidden="true">INTELLIGENZA UTILE / 01</p>
        </div>
      </section>

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

      <section class="ai-example ai-section" aria-labelledby="ai-example-title" appScrollScene>
        <div class="shell ai-example__grid">
          <div appPageMotion="rise"><p class="eyebrow">Un esempio concreto</p><h2 id="ai-example-title">Dal «mi serve un sito» a una conversazione che ha già un punto di partenza.</h2><p>Un assistente ben progettato non forza una vendita. Aiuta a chiarire il bisogno e lascia alle persone il confronto che conta.</p><button type="button" class="text-link" (click)="openDemo()">Prova la nostra demo <span aria-hidden="true">↗&#xFE0E;</span></button></div>
          <div class="ai-conversation" appPageMotion="rise" [motionDelay]="170" aria-label="Esempio illustrativo di conversazione"><p class="ai-conversation__label">Una conversazione possibile <span>● Demo illustrativa</span></p><div class="ai-bubble ai-bubble--user">Il mio sito è vecchio, ma non so se rifarlo da zero.</div><div class="ai-bubble ai-bubble--assistant"><span>Assistente</span>Possiamo partire da quello che oggi non funziona: aspetto, contenuti o richieste che arrivano dal sito. Se vuoi, ti mostro come affrontiamo un restyling.</div><div class="ai-bubble ai-bubble--user">Soprattutto non mi arrivano contatti.</div><div class="ai-bubble ai-bubble--assistant"><span>Assistente</span>Allora guarderei prima il percorso che porta al contatto. Memento può aiutarti a rivedere struttura, messaggi e punti di conversione. Per capire da dove iniziare, puoi parlarne direttamente con il team.</div><div class="ai-conversation__handoff">La conversazione passa a una persona quando serve.</div></div>
        </div>
      </section>

      <section class="ai-method ai-section" aria-labelledby="ai-method-title" appScrollScene><div class="shell"><div class="ai-method__head"><p class="eyebrow eyebrow--gold">Il nostro metodo</p><h2 id="ai-method-title">Prima il problema. Poi il sistema.</h2><p>Ogni azienda ha parole, clienti e processi diversi. La soluzione prende forma da ciò che deve davvero rendere più semplice.</p></div><ol class="ai-method__steps">@for (step of steps; track step.number) { <li appPageMotion="rise" [motionDelay]="$index * 100"><span>{{ step.number }}</span><div><h3>{{ step.title }}</h3><p>{{ step.text }}</p></div></li> }</ol></div></section>

      <section class="ai-faq ai-section" aria-labelledby="ai-faq-title" appScrollScene><div class="shell ai-faq__grid"><div><p class="eyebrow">Domande frequenti</p><h2 id="ai-faq-title">Quello che vorresti sapere prima di partire.</h2></div><div class="ai-faq__items">@for (faq of faqs; track faq.question) { <details><summary>{{ faq.question }}<span aria-hidden="true">+</span></summary><p>{{ faq.answer }}</p></details> }</div></div></section>

      <section class="ai-closing ai-section" aria-labelledby="ai-closing-title" appScrollScene><div class="shell ai-closing__inner"><p class="eyebrow eyebrow--gold">Il prossimo passo</p><h2 id="ai-closing-title">Quale domanda prende più tempo al tuo team?</h2><p>Raccontacela. Da lì possiamo capire se un assistente IA è utile, quali informazioni servono e come inserirlo nel tuo sito.</p><a class="button button--gold" routerLink="/contatti" [queryParams]="{ servizio: '/soluzioni-ia-torino' }" (click)="tracking.trackQuote('ai_closing')">Parliamo del progetto <span aria-hidden="true">↗&#xFE0E;</span></a></div></section>
    </article>
  `,
})
export class AiSolutionsPageComponent implements OnInit {
  readonly tracking = inject(TrackingService);
  private readonly seo = inject(SeoService);
  private readonly document = inject(DOCUMENT);
  readonly problems = [
    { number: '01', title: 'Le stesse domande, ogni giorno', text: 'Il team ripete informazioni già presenti, ma difficili da trovare al momento giusto.' },
    { number: '02', title: 'Un cliente pronto, fuori orario', text: 'La persona ha una domanda semplice, ma non trova un primo orientamento.' },
    { number: '03', title: 'Richieste senza contesto', text: 'Prima di capire cosa serve davvero, iniziano scambi di messaggi evitabili.' },
  ];
  readonly steps = [
    { number: '01', title: 'Ascoltiamo', text: 'Individuiamo le domande ricorrenti e il punto del percorso in cui le persone si fermano.' },
    { number: '02', title: 'Diamo ordine alle informazioni', text: 'Selezioniamo contenuti affidabili, tono di voce, risposte consentite e casi da passare al team.' },
    { number: '03', title: 'Progettiamo e proviamo', text: 'Costruiamo l’esperienza sul sito e la testiamo anche con domande incomplete, ambigue o fuori tema.' },
    { number: '04', title: 'Miglioriamo', text: 'Rivediamo le conversazioni in forma compatibile con le scelte privacy e aggiorniamo i contenuti quando cambiano.' },
  ];
  readonly faqs = [
    { question: 'È un chatbot con risposte preimpostate?', answer: 'No. L’assistente interpreta la domanda e formula una risposta usando le informazioni approvate per il progetto. Definiamo comunque limiti e controlli per ridurre risposte non pertinenti.' },
    { question: 'Può rispondere quando l’ufficio è chiuso?', answer: 'Può offrire un primo orientamento anche fuori orario, quando il servizio è disponibile. Le richieste che richiedono una persona vengono indirizzate al team.' },
    { question: 'Può inventare informazioni sulla mia azienda?', answer: 'Un sistema di IA può sbagliare. Per questo lavoriamo su fonti selezionate, limiti di risposta, test e aggiornamenti. Non promettiamo accuratezza assoluta: progettiamo come gestire anche i casi incerti.' },
    { question: 'Serve rifare il sito per aggiungerlo?', answer: 'Dipende da come è costruito il sito e dalle integrazioni necessarie. Valutiamo prima la soluzione tecnica più adatta e il lavoro richiesto.' },
    { question: 'Come vengono trattati i dati delle conversazioni?', answer: 'Definiamo quali dati sono davvero necessari, dove vengono elaborati e come informare gli utenti. Le scelte tecniche e privacy dipendono dal progetto e vengono concordate prima della pubblicazione.' },
  ];

  ngOnInit(): void {
    const pageUrl = `${DEMO_ORIGIN}${pageMetadata.aiSolutions.path}`;
    this.seo.setPage(pageMetadata.aiSolutions, [
      { '@context': 'https://schema.org', '@type': 'WebPage', name: pageMetadata.aiSolutions.title, description: pageMetadata.aiSolutions.description, url: pageUrl, inLanguage: 'it-IT', primaryImageOfPage: `${DEMO_ORIGIN}${pageMetadata.aiSolutions.socialImage.src}` },
      { '@context': 'https://schema.org', '@type': 'Service', name: 'Assistenti IA e automazioni per aziende', description: pageMetadata.aiSolutions.description, serviceType: 'Assistenti IA per il sito web e automazione del primo contatto', provider: { '@id': `${siteConfig.origin}/#organization` }, areaServed: serviceAreas, url: pageUrl },
      { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: DEMO_ORIGIN },
        { '@type': 'ListItem', position: 2, name: 'Servizi', item: `${DEMO_ORIGIN}/servizi` },
        { '@type': 'ListItem', position: 3, name: 'Soluzioni IA', item: pageUrl },
      ] },
    ], DEMO_ORIGIN);
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
