import { Component, inject, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TrackingService } from '../core/tracking.service';
import { PageMotionDirective } from '../shared/page-motion.directive';
import { ScrollSceneDirective } from '../shared/scroll-scene.directive';

@Component({
  selector: 'app-ai-solutions-followup',
  imports: [RouterLink, PageMotionDirective, ScrollSceneDirective],
  styleUrl: './ai-solutions-followup.component.scss',
  template: `
    <section class="ai-example ai-section" aria-labelledby="ai-example-title" appScrollScene>
      <div class="shell ai-example__grid">
        <div appPageMotion="rise"><p class="eyebrow">Un esempio concreto</p><h2 id="ai-example-title">Dal «mi serve un sito» a una conversazione che ha già un punto di partenza.</h2><p>Un assistente ben progettato non forza una vendita. Aiuta a chiarire il bisogno e lascia alle persone il confronto che conta.</p><button type="button" class="text-link" (click)="demoRequested.emit()">Prova la nostra demo <span aria-hidden="true">↗&#xFE0E;</span></button></div>
        <div class="ai-conversation" appPageMotion="rise" [motionDelay]="170" aria-label="Esempio illustrativo di conversazione"><p class="ai-conversation__label">Una conversazione possibile <span>● Demo illustrativa</span></p><div class="ai-bubble ai-bubble--user">Il mio sito è vecchio, ma non so se rifarlo da zero.</div><div class="ai-bubble ai-bubble--assistant"><span>Assistente</span>Possiamo partire da quello che oggi non funziona: aspetto, contenuti o richieste che arrivano dal sito. Se vuoi, ti mostro come affrontiamo un restyling.</div><div class="ai-bubble ai-bubble--user">Soprattutto non mi arrivano contatti.</div><div class="ai-bubble ai-bubble--assistant"><span>Assistente</span>Allora guarderei prima il percorso che porta al contatto. Memento può aiutarti a rivedere struttura, messaggi e punti di conversione. Per capire da dove iniziare, puoi parlarne direttamente con il team.</div><div class="ai-conversation__handoff">La conversazione passa a una persona quando serve.</div></div>
      </div>
    </section>

    <section class="ai-method ai-section" aria-labelledby="ai-method-title" appScrollScene><div class="shell"><div class="ai-method__head"><p class="eyebrow eyebrow--gold">Il nostro metodo</p><h2 id="ai-method-title">Prima il problema. Poi il sistema.</h2><p>Ogni azienda ha parole, clienti e processi diversi. La soluzione prende forma da ciò che deve davvero rendere più semplice.</p></div><ol class="ai-method__steps">@for (step of steps; track step.number) { <li appPageMotion="rise" [motionDelay]="$index * 100"><span>{{ step.number }}</span><div><h3>{{ step.title }}</h3><p>{{ step.text }}</p></div></li> }</ol></div></section>

    <section class="ai-faq ai-section" aria-labelledby="ai-faq-title" appScrollScene><div class="shell ai-faq__grid"><div><p class="eyebrow">Domande frequenti</p><h2 id="ai-faq-title">Quello che vorresti sapere prima di partire.</h2></div><div class="ai-faq__items">@for (faq of faqs; track faq.question) { <details><summary>{{ faq.question }}<span aria-hidden="true">+</span></summary><p>{{ faq.answer }}</p></details> }</div></div></section>

    <section class="ai-closing ai-section" aria-labelledby="ai-closing-title" appScrollScene><div class="shell ai-closing__inner"><p class="eyebrow eyebrow--gold">Il prossimo passo</p><h2 id="ai-closing-title">Quale domanda prende più tempo al tuo team?</h2><p>Raccontacela. Da lì possiamo capire se un assistente IA è utile, quali informazioni servono e come inserirlo nel tuo sito.</p><a class="button button--gold" routerLink="/contatti" [queryParams]="{ servizio: '/soluzioni-ia-torino' }" (click)="tracking.trackQuote('ai_closing')">Parliamo del progetto <span aria-hidden="true">↗&#xFE0E;</span></a></div></section>
  `,
})
export class AiSolutionsFollowupComponent {
  readonly demoRequested = output<void>();
  readonly tracking = inject(TrackingService);
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
}
