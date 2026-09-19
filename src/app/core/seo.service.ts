import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { PageMetadata, siteConfig } from './site.config';

type JsonLd = Record<string, unknown> | readonly Record<string, unknown>[];

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly document = inject(DOCUMENT);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);

  setPage(metadata: PageMetadata, schema: JsonLd): void {
    const canonicalUrl = `${siteConfig.origin}${metadata.path}`;
    const socialPreviewImage = `${siteConfig.origin}${siteConfig.socialPreviewImage}`;

    this.title.setTitle(metadata.title);
    this.updateName('description', metadata.description);
    this.updateName('twitter:card', 'summary_large_image');
    this.updateName('twitter:title', metadata.title);
    this.updateName('twitter:description', metadata.description);
    this.updateProperty('og:type', metadata.type ?? 'website');
    this.updateProperty('og:locale', 'it_IT');
    this.updateProperty('og:site_name', 'Memento Production');
    this.updateProperty('og:title', metadata.title);
    this.updateProperty('og:description', metadata.description);
    this.updateProperty('og:url', canonicalUrl);
    this.updateProperty('og:image', socialPreviewImage);
    this.updateProperty('og:image:secure_url', socialPreviewImage);
    this.updateProperty('og:image:type', 'image/png');
    this.updateProperty('og:image:width', '1672');
    this.updateProperty('og:image:height', '941');
    this.updateName('twitter:image', socialPreviewImage);
    this.updateName('robots', metadata.noIndex ? 'noindex, nofollow' : 'index, follow');
    this.updateCanonical(canonicalUrl);
    this.updateSchema(schema);
  }

  private updateName(name: string, content: string): void {
    this.meta.updateTag({ name, content }, `name='${name}'`);
  }

  private updateProperty(property: string, content: string): void {
    this.meta.updateTag({ property, content }, `property='${property}'`);
  }

  private updateCanonical(href: string): void {
    let canonical = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    if (!canonical) {
      canonical = this.document.createElement('link');
      canonical.rel = 'canonical';
      this.document.head.appendChild(canonical);
    }

    canonical.href = href;
  }

  private updateSchema(schema: JsonLd): void {
    const scriptId = 'memento-structured-data';
    let script = this.document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!script) {
      script = this.document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      this.document.head.appendChild(script);
    }

    script.text = JSON.stringify(schema);
  }
}
