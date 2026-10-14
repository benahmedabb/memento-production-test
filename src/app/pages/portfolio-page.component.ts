import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, PLATFORM_ID, inject } from '@angular/core';
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
export class PortfolioPageComponent implements OnInit, AfterViewInit, OnDestroy {
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
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly imageSections = new Map<string, HTMLElement>();
  private imageObserver?: IntersectionObserver;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const sections = this.element.nativeElement.querySelectorAll<HTMLElement>('.work-case');
    sections.forEach((section) => this.imageSections.set(section.id, section));

    if (!('IntersectionObserver' in window)) return;

    // Start native responsive-image requests before a case enters the viewport.
    // Existing src/srcset attributes remain usable during SSR and without JS.
    this.imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) this.prepareProjectImages(entry.target.id);
      });
    }, { rootMargin: `${Math.max(1200, window.innerHeight * 2)}px 0px`, threshold: 0 });

    sections.forEach((section) => this.imageObserver?.observe(section));
  }

  prepareProjectImages(slug: string): void {
    const section = this.imageSections.get(slug);
    if (!section) return;

    section.querySelectorAll<HTMLImageElement>('img[loading="lazy"]').forEach((image) => {
      image.loading = 'eager';
    });
    this.imageObserver?.unobserve(section);
  }

  ngOnDestroy(): void {
    this.imageObserver?.disconnect();
    this.imageSections.clear();
  }

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
