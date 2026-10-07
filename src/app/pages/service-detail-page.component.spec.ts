import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../app.routes';
import { ContactPageComponent } from './contact-page.component';
import { HomePageComponent } from './home-page.component';
import { CatalogPageComponent } from './catalog-page.component';
import { ServicesPageComponent } from './services-page.component';

describe('Separate branding and web services', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes), provideHttpClient()] });
  });

  it('updates content and canonical metadata when navigating between the two services', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/grafica', CatalogPageComponent);
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toContain('Grafica');
    expect(harness.routeNativeElement?.textContent).toContain('Creazione loghi');
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe('https://mementoproduction.it/grafica');

    await harness.navigateByUrl('/web', CatalogPageComponent);
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toContain('Siti web');
    expect(harness.routeNativeElement?.textContent).toContain('E-commerce');
    expect(document.title).toBe('Siti web ed e-commerce a Torino | Memento');
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe('https://mementoproduction.it/web');
    const schema = JSON.parse(document.getElementById('memento-structured-data')!.textContent!);
    expect(schema[0]['@type']).toBe('CollectionPage');
    expect(schema[1].itemListElement.at(-1).item).toBe('https://mementoproduction.it/web');
  });

  it('keeps the previous combined service address working', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/branding-siti-web', CatalogPageComponent);
    expect(TestBed.inject(Router).url).toBe('/grafica');
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toContain('Grafica');
  });

  it('offers both services from the home, service directory and contact form', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/', HomePageComponent);
    expect(harness.routeNativeElement?.querySelectorAll('.service-card')).toHaveLength(6);
    expect(harness.routeNativeElement?.querySelector('a[href="/grafica"]')?.textContent).toContain('Grafica e branding');
    expect(harness.routeNativeElement?.querySelector('a[href="/web"]')?.textContent).toContain('Siti web ed e-commerce');

    await harness.navigateByUrl('/servizi', ServicesPageComponent);
    expect(harness.routeNativeElement?.querySelectorAll('.service-chapter')).toHaveLength(6);
    expect(harness.routeNativeElement?.querySelector('a[href="/grafica"]')).toBeTruthy();
    expect(harness.routeNativeElement?.querySelector('a[href="/web"]')).toBeTruthy();

    const contact = await harness.navigateByUrl('/contatti', ContactPageComponent);
    const select = harness.routeNativeElement!.querySelector<HTMLSelectElement>('#service')!;
    expect([...select.options].map((option) => option.value)).toContain('Grafica e branding');
    expect([...select.options].map((option) => option.value)).not.toContain('Branding e siti web');
    select.value = 'Siti web ed e-commerce';
    select.dispatchEvent(new Event('change'));
    expect(contact.form.controls.service.value).toBe('Siti web ed e-commerce');
  });
});
