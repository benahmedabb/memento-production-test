import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CatalogPage, catalogChildren, catalogHubs, catalogPages } from '../core/service-catalog';
import { SeoService } from '../core/seo.service';
import { serviceAreas } from '../core/site-schema';
import { siteConfig } from '../core/site.config';
import { TrackingService } from '../core/tracking.service';
import { ScrollSceneDirective } from '../shared/scroll-scene.directive';
import { ServiceVisualComponent } from '../shared/service-visual.component';
import {
  photoSource,
  photoSrcset,
  serviceMediaFor,
  serviceMediaSchema,
} from '../core/service-media';
import { ServicePhotoGalleryComponent } from '../shared/service-photo-gallery.component';
import { ServiceFilmGalleryComponent } from '../shared/service-film-gallery.component';

@Component({
  imports: [
    RouterLink,
    ScrollSceneDirective,
    ServiceVisualComponent,
    ServicePhotoGalleryComponent,
    ServiceFilmGalleryComponent,
  ],
  templateUrl: './catalog-page.component.html',
  host: { class: 'catalog-page' },
})
export class CatalogPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  readonly tracking = inject(TrackingService);
  readonly page = catalogPages.find(
    (page) => page.path === this.route.snapshot.data['catalogPath'],
  )!;
  readonly media = serviceMediaFor(this.page.path);
  readonly heroPhoto = this.media.photography?.photos[0];
  readonly heroFilm = this.media.films[0]?.films[0];
  readonly mediaAnchor = this.media.photography ? 'scatti-realizzati' : this.media.films[0]?.id;
  readonly photoSource = photoSource;
  readonly photoSrcset = photoSrcset;
  readonly hub = catalogHubs.find((item) => item.category === this.page.category)!;
  readonly children = catalogChildren(this.hub.path);
  readonly siblings = this.children.filter((item) => item.path !== this.page.path);
  readonly disciplineNumber = catalogHubs.indexOf(this.hub) + 1;
  readonly variant = this.children.findIndex((item) => item.path === this.page.path) + 1;
  readonly projects = siteConfig.portfolio.filter((project) =>
    this.page.projectSlugs.includes(project.slug),
  );
  readonly related = this.page.related.map((path) => {
    const page = catalogPages.find((item) => item.path === path);
    return {
      path,
      label: page?.label ?? 'Google e Meta Ads',
      summary: page?.summary ?? 'Campagne, creatività e misurazione per obiettivi precisi.',
    };
  });
  readonly breadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Servizi', path: '/servizi' },
    ...(this.page.kind === 'detail' ? [{ label: this.hub.label, path: this.hub.path }] : []),
    { label: this.page.label, path: this.page.path },
  ];

  constructor() {
    const service = (page: CatalogPage) => ({
      '@type': 'Service',
      '@id': `${siteConfig.origin}${page.path}#service`,
      name: `${page.heading} a Torino`,
      description: page.description,
      url: `${siteConfig.origin}${page.path}`,
      serviceType: page.label,
      provider: { '@id': `${siteConfig.origin}/#organization` },
      areaServed: serviceAreas,
    });
    const socialImage = this.heroPhoto
      ? {
          src: photoSource(this.heroPhoto, 1920),
          alt: this.heroPhoto.alt,
          type: 'image/webp',
          width: this.heroPhoto.width,
          height: this.heroPhoto.height,
        }
      : this.heroFilm
        ? {
            src: this.heroFilm.poster,
            alt: this.heroFilm.title,
            type: this.heroFilm.poster.endsWith('.jpg') ? 'image/jpeg' : 'image/webp',
            width: this.heroFilm.width,
            height: this.heroFilm.height,
          }
        : undefined;
    this.seo.setPage({ ...this.page, ...(socialImage ? { socialImage } : {}) }, [
      this.page.kind === 'hub'
        ? {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: this.page.title,
            description: this.page.description,
            url: `${siteConfig.origin}${this.page.path}`,
            mainEntity: {
              '@type': 'OfferCatalog',
              name: this.page.heading,
              itemListElement: this.children.map((item) => ({
                '@type': 'Offer',
                itemOffered: service(item),
              })),
            },
          }
        : { '@context': 'https://schema.org', ...service(this.page) },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: this.breadcrumbs.map((item, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: item.label,
          item: `${siteConfig.origin}${item.path === '/' ? '' : item.path}`,
        })),
      },
      ...serviceMediaSchema(this.page.path, this.media),
    ]);
  }
}
