import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { academyCourses } from '../core/academy-courses';
import { SeoService } from '../core/seo.service';
import { pageMetadata, siteConfig } from '../core/site.config';
import { KineticTextComponent } from '../shared/kinetic-text.component';
import { PageMotionDirective } from '../shared/page-motion.directive';
import { ScrollSceneDirective } from '../shared/scroll-scene.directive';

@Component({
  imports: [RouterLink, KineticTextComponent, PageMotionDirective, ScrollSceneDirective],
  styleUrl: './academy-page.component.scss',
  template: `
    <section class="academy-hero" appScrollScene="hero" aria-labelledby="academy-title">
      <div class="academy-hero__image">
        <img
          src="/images/memento-ufficio-hero.webp"
          alt="Interno degli uffici di Memento Production a Moncalieri"
          width="1537"
          height="1023"
          fetchpriority="high"
        />
      </div>
      <span class="academy-hero__wash" aria-hidden="true"></span>
      <span class="academy-hero__mark" aria-hidden="true">A</span>
      <div class="shell academy-hero__content">
        <p class="eyebrow eyebrow--gold" appPageMotion="hero" [motionDelay]="120">Formazione / Coming soon</p>
        <h1 id="academy-title"><app-kinetic-text text="Memento Academy. Imparare apre nuove possibilità." [delay]="150" /></h1>
        <p appPageMotion="hero" [motionDelay]="520">
          Sta arrivando uno spazio dedicato alla formazione. Tre nuovi corsi sono in preparazione:
          presto pubblicheremo argomenti, programmi e modalità di accesso.
        </p>
        <a class="academy-hero__scroll" href="#corsi" appPageMotion="hero" [motionDelay]="680">
          Scopri i corsi in arrivo <span aria-hidden="true">↓&#xFE0E;</span>
        </a>
      </div>
    </section>

    <section id="corsi" class="academy-catalog" aria-labelledby="academy-courses-title" appScrollScene>
      <div class="shell">
        <header class="academy-catalog__heading">
          <div appPageMotion="rise">
            <p class="eyebrow">I prossimi percorsi</p>
            <h2 id="academy-courses-title"><app-kinetic-text text="Tre corsi. Tutto da scoprire." /></h2>
          </div>
          <p appPageMotion="rise" [motionDelay]="150">
            Stiamo definendo i contenuti insieme alla piattaforma che li ospiterà. Questa pagina
            verrà aggiornata appena programmi e iscrizioni saranno disponibili.
          </p>
        </header>

        <div class="academy-grid">
          @for (course of courses; track course.id) {
            <article class="academy-card" appPageMotion="rise" [motionDelay]="$index * 110">
              <div class="academy-card__visual">
                @if (course.image; as image) {
                  <img
                    [src]="image.src"
                    [alt]="image.alt"
                    [width]="image.width"
                    [height]="image.height"
                    loading="lazy"
                    decoding="async"
                  />
                } @else {
                  <span class="academy-card__number" aria-hidden="true">{{ course.number }}</span>
                  <span class="academy-card__orbit" aria-hidden="true"></span>
                }
              </div>
              <div class="academy-card__body">
                <div class="academy-card__meta">
                  <span>Academy / {{ course.number }}</span>
                  <span>{{ course.status }}</span>
                </div>
                <p class="academy-card__topic">{{ course.topic }}</p>
                <h3>{{ course.title }}</h3>
                <p>{{ course.description }}</p>
                @if (course.platformUrl) {
                  <a
                    class="academy-card__link"
                    [href]="course.platformUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    [attr.aria-label]="'Vai al corso ' + course.title + ' sulla piattaforma esterna (si apre in una nuova scheda)'"
                  >
                    Vai al corso <span aria-hidden="true">↗&#xFE0E;</span>
                  </a>
                } @else {
                  <span class="academy-card__pending">
                    Iscrizioni non ancora aperte <span aria-hidden="true">—</span>
                  </span>
                }
              </div>
            </article>
          }
        </div>
      </div>
    </section>

    <section class="academy-closing" aria-labelledby="academy-closing-title" appScrollScene>
      <div class="shell academy-closing__inner">
        <div appPageMotion="rise">
          <p class="eyebrow eyebrow--gold">Memento Academy</p>
          <h2 id="academy-closing-title"><app-kinetic-text mode="ink" text="La formazione sta prendendo forma." /></h2>
          <p>Vuoi ricevere informazioni sui corsi quando saranno disponibili? Scrivici e raccontaci cosa vorresti imparare.</p>
        </div>
        <a class="button button--gold" routerLink="/contatti" appPageMotion="rise" [motionDelay]="160">
          Contatta Memento <span aria-hidden="true">→&#xFE0E;</span>
        </a>
      </div>
    </section>
  `,
})
export class AcademyPageComponent implements OnInit {
  readonly courses = academyCourses;
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    const origin = siteConfig.origin;
    const url = `${origin}${pageMetadata.academy.path}`;
    const availableCourses = academyCourses.filter(course => course.platformUrl);

    this.seo.setPage(pageMetadata.academy, [{
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${url}#webpage`,
      name: pageMetadata.academy.title,
      description: pageMetadata.academy.description,
      url,
      inLanguage: 'it-IT',
      isPartOf: { '@id': `${origin}/#website` },
      about: { '@id': `${origin}/#organization` },
      breadcrumb: { '@id': `${url}#breadcrumb` },
      ...(availableCourses.length ? {
        mainEntity: {
          '@type': 'ItemList',
          name: 'Corsi Memento Academy',
          itemListElement: availableCourses.map((course, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'Course',
              name: course.title,
              description: course.description,
              url: course.platformUrl,
              provider: { '@id': `${origin}/#organization` },
              ...(course.image ? { image: `${origin}${course.image.src}` } : {}),
            },
          })),
        },
      } : {}),
    }, {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
        { '@type': 'ListItem', position: 2, name: 'Memento Academy', item: url },
      ],
    }]);
  }
}
