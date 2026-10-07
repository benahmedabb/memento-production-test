import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../app.routes';
import { catalogHubs, catalogPages } from '../core/service-catalog';
import { serviceRedirects } from '../core/service-redirects';
import { CatalogPageComponent } from './catalog-page.component';
import { ContactPageComponent } from './contact-page.component';
import { NotFoundPageComponent } from './not-found-page.component';

// Real route transitions catch stale content/metadata when one template serves many pages.
describe('Service catalog navigation and SEO', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes), provideHttpClient()] });
  });

  it('renders every canonical page with distinct content, title and breadcrumb schema', async () => {
    const harness = await RouterTestingHarness.create();
    const titles = new Set<string>();
    for (const page of catalogPages) {
      await harness.navigateByUrl(page.path, CatalogPageComponent);
      expect(harness.routeNativeElement?.querySelectorAll('h1')).toHaveLength(1);
      expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toContain(page.heading);
      expect(harness.routeNativeElement?.textContent).toContain(page.intro);
      expect(document.title).toBe(page.title);
      expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(page.description);
      expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
        `https://mementoproduction.it${page.path}`,
      );
      const schema = JSON.parse(document.getElementById('memento-structured-data')!.textContent!);
      expect(schema[0]['@type']).toBe(page.kind === 'hub' ? 'CollectionPage' : 'Service');
      expect(schema[1].itemListElement.at(-1).item).toBe(`https://mementoproduction.it${page.path}`);
      expect(schema[1].itemListElement).toHaveLength(page.kind === 'hub' ? 3 : 4);
      titles.add(document.title);
    }
    expect(titles.size).toBe(catalogPages.length);
  });

  it('keeps every legacy address working without showing duplicate content', async () => {
    const harness = await RouterTestingHarness.create();
    for (const { from, to } of serviceRedirects) {
      await harness.navigateByUrl(from, CatalogPageComponent);
      expect(TestBed.inject(Router).url).toBe(to);
      expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
        `https://mementoproduction.it${to}`,
      );
    }
  });

  it('links each hub to its specializations and preselects the requested service', async () => {
    const harness = await RouterTestingHarness.create();
    for (const hub of catalogHubs) {
      await harness.navigateByUrl(hub.path, CatalogPageComponent);
      const children = catalogPages.filter((page) => page.kind === 'detail' && page.category === hub.category);
      expect(harness.routeNativeElement?.querySelectorAll('.specialty-card')).toHaveLength(children.length);
      for (const page of children) {
        expect(harness.routeNativeElement?.querySelector(`a.specialty-card[href="${page.path}"]`)).toBeTruthy();
      }
    }
    await harness.navigateByUrl('/foto/food-photography-torino', CatalogPageComponent);
    const cta = harness.routeNativeElement!.querySelector<HTMLAnchorElement>('.catalog-actions a.button')!;
    const contact = await harness.navigateByUrl(cta.getAttribute('href')!, ContactPageComponent);
    expect(contact.form.controls.service.value).toBe('Food & Drinks');
    expect(harness.routeNativeElement?.querySelector<HTMLSelectElement>('#service')?.value).toBe('Food & Drinks');
    expect(contact.form.controls.message.value).toBe('');
    expect(contact.form.controls.privacyAccepted.value).toBe(false);
  });

  it('does not create indexable pages for unknown specializations', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/foto/inesistente', NotFoundPageComponent);
    expect(TestBed.inject(Router).url).toBe('/404');
    expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toContain('noindex');
  });
});
