import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../app.routes';
import { ContactPageComponent } from './contact-page.component';
import { HomePageComponent } from './home-page.component';
import { ServiceDetailPageComponent } from './service-detail-page.component';
import { ServicesPageComponent } from './services-page.component';

describe('Separate branding and web services', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes), provideHttpClient()] });
  });

  it('updates content and canonical metadata when navigating between the two services', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/grafica-branding', ServiceDetailPageComponent);
    expect(harness.routeNativeElement?.textContent).toContain('Grafica e branding');
    expect(harness.routeNativeElement?.textContent).toContain('Posizionamento, logo e identità visiva');
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe('https://mementoproduction.it/grafica-branding');

    await harness.navigateByUrl('/siti-web-ecommerce', ServiceDetailPageComponent);
    expect(harness.routeNativeElement?.textContent).toContain('Siti web ed e-commerce');
    expect(harness.routeNativeElement?.textContent).toContain('E-commerce con catalogo prodotti, carrello e pagamenti');
    expect(document.title).toBe('Siti web ed e-commerce | Memento Production');
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe('https://mementoproduction.it/siti-web-ecommerce');
    const schema = JSON.parse(document.getElementById('memento-structured-data')!.textContent!);
    expect(schema[0].name).toBe('Siti web ed e-commerce');
    expect(schema[1].itemListElement.at(-1).item).toBe('https://mementoproduction.it/siti-web-ecommerce');
  });

  it('keeps the previous combined service address working', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/branding-siti-web', ServiceDetailPageComponent);
    expect(TestBed.inject(Router).url).toBe('/grafica-branding');
    expect(harness.routeNativeElement?.textContent).toContain('Grafica e branding');
  });

  it('offers both services from the home, service directory and contact form', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/', HomePageComponent);
    expect(harness.routeNativeElement?.querySelectorAll('.service-card')).toHaveLength(5);
    expect(harness.routeNativeElement?.querySelector('a[href="/grafica-branding"]')?.textContent).toContain('Grafica e branding');
    expect(harness.routeNativeElement?.querySelector('a[href="/siti-web-ecommerce"]')?.textContent).toContain('Siti web ed e-commerce');

    await harness.navigateByUrl('/servizi', ServicesPageComponent);
    expect(harness.routeNativeElement?.querySelectorAll('.service-chapter')).toHaveLength(5);
    expect(harness.routeNativeElement?.querySelector('a[href="/grafica-branding"]')).toBeTruthy();
    expect(harness.routeNativeElement?.querySelector('a[href="/siti-web-ecommerce"]')).toBeTruthy();

    const contact = await harness.navigateByUrl('/contatti', ContactPageComponent);
    const select = harness.routeNativeElement!.querySelector<HTMLSelectElement>('#service')!;
    expect([...select.options].map((option) => option.value)).toContain('Grafica e branding');
    expect([...select.options].map((option) => option.value)).not.toContain('Branding e siti web');
    select.value = 'Siti web ed e-commerce';
    select.dispatchEvent(new Event('change'));
    expect(contact.form.controls.service.value).toBe('Siti web ed e-commerce');
  });
});
