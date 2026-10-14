import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { portfolioCaseStudies, portfolioCover } from '../core/portfolio-case-studies';
import { SeoService } from '../core/seo.service';
import { photoSource, photoSrcset } from '../core/service-photo';
import { pageMetadata, siteConfig } from '../core/site.config';
import { TrackingService } from '../core/tracking.service';
import { PageMotionDirective } from '../shared/page-motion.directive';

@Component({
  imports: [PageMotionDirective, RouterLink],
  templateUrl: './portfolio-page.component.html',
})
export class PortfolioPageComponent implements OnInit {
  readonly projects = portfolioCaseStudies.map((project, index) => {
    const image = portfolioCover(project);
    return {
      ...project,
      image,
      number: String(index + 1).padStart(2, '0'),
      shortClient: project.client.split(' · ')[0],
      portrait: image.height > image.width,
      gallery: (project.gallery ?? []).map((photo) => ({
        ...photo,
        src: photoSource(photo),
        srcset: photoSrcset(photo),
        fullSize: photoSource(photo, 1920),
      })),
    };
  });
  readonly projectCount = String(this.projects.length).padStart(2, '0');
  readonly heroProjects = ['master', 'rare', 'speed-trasporti'].flatMap((slug) =>
    this.projects.filter((project) => project.slug === slug),
  );
  readonly tracking = inject(TrackingService);
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.setPage(pageMetadata.portfolio, {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: pageMetadata.portfolio.title,
      url: `${siteConfig.origin}${pageMetadata.portfolio.path}`,
      isPartOf: { '@id': `${siteConfig.origin}/#website` },
      about: { '@id': `${siteConfig.origin}/#organization` },
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: this.projects.length,
        itemListElement: this.projects.map((project, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'CreativeWork',
            name: `${project.client} — ${project.title}`,
            description: project.summary,
            url: `${siteConfig.origin}/portfolio#${project.slug}`,
            image: project.image.src.startsWith('/')
              ? `${siteConfig.origin}${project.image.src}`
              : project.image.src,
          },
        })),
      },
    });
  }
}
