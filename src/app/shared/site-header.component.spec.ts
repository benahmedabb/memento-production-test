import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { routes } from '../app.routes';
import { catalogPages } from '../core/service-catalog';
import { SiteHeaderComponent } from './site-header.component';

describe('Service navigation disclosures', () => {
  it('exposes every service as a real link and preserves the agency anchors', async () => {
    TestBed.configureTestingModule({ imports: [SiteHeaderComponent], providers: [provideRouter(routes)] });
    const fixture = TestBed.createComponent(SiteHeaderComponent);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    for (const page of catalogPages) {
      expect(root.querySelector(`#services-navigation a[href="${page.path}"]`)?.textContent).toContain(page.label);
    }
    for (const fragment of ['metodo', 'chi-siamo', 'chiavi-in-mano']) {
      expect(root.querySelector(`#agency-navigation a[href="/agenzia#${fragment}"]`)).toBeTruthy();
    }
    const servicesToggle = root.querySelector<HTMLButtonElement>('button[aria-controls="services-navigation"]')!;
    servicesToggle.click();
    await fixture.whenStable();
    expect(servicesToggle.getAttribute('aria-expanded')).toBe('true');
    expect(root.querySelector('#services-navigation')?.hasAttribute('inert')).toBe(false);
    const categoryToggle = root.querySelector<HTMLButtonElement>('.nav-service-group__toggle')!;
    categoryToggle.click();
    await fixture.whenStable();
    expect(categoryToggle.getAttribute('aria-expanded')).toBe('true');
    const group = categoryToggle.closest('.nav-service-group')!;
    expect(group.classList.contains('is-expanded')).toBe(true);
    root.querySelector<HTMLAnchorElement>('#services-navigation a[href="/foto/fotografia-corporate-torino"]')!.click();
    await fixture.whenStable();
    expect(servicesToggle.getAttribute('aria-expanded')).toBe('false');
    expect(fixture.componentInstance.menuOpen()).toBe(false);
    expect(fixture.componentInstance.openServiceGroup()).toBeNull();
  });

  it('closes an open dropdown with Escape and returns focus to its trigger', async () => {
    TestBed.configureTestingModule({ imports: [SiteHeaderComponent], providers: [provideRouter(routes)] });
    const fixture = TestBed.createComponent(SiteHeaderComponent);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const toggle = root.querySelector<HTMLButtonElement>('button[aria-controls="services-navigation"]')!;
    toggle.click();
    await fixture.whenStable();
    root
      .querySelector('.nav-dropdown--services')!
      .dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await fixture.whenStable();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(toggle);
  });
});
