import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../app.routes';
import { HomePageComponent } from './home-page.component';

describe('HomePageComponent content', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes), provideHttpClient()] });
  });

  it('renders the approved dictionary hero and supporting copy', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/', HomePageComponent);
    const page = harness.routeNativeElement!;

    expect(page.querySelector('.cinema__term')?.textContent?.trim()).toBe('me·mèn·to');
    expect(page.querySelector('.cinema__etymology')?.textContent?.trim()).toBe('/me’mento/ s.m. [imperat. lat. di meminisse “ricordare”, quindi “ricordati!”], invar., lett.');
    expect(page.querySelector('.cinema__meaning')?.textContent?.trim()).toBe('[atto o affermazione che ha il fine di ricordare qualcosa]');
    expect(page.querySelector('.cinema__meaning strong')?.textContent).toBe('ricordare qualcosa');
    expect(page.querySelector('.cinema__lead')?.textContent?.trim()).toBe('Agenzia di comunicazione e marketing a Moncalieri, per aziende di Torino, Pinerolo e Chieri. Siti web, e-commerce, gestione social, creazione contenuti, ADS, strategia e grafica a 360° per far crescere la tua azienda.');
    expect(page.querySelector('.memory-statement__footer p')?.textContent?.trim()).toBe('Ogni progetto parte da una domanda sola: cosa deve restare, a chi, e perché. Da lì nascono video, fotografia, social, identità visiva e sito come un solo linguaggio, non pezzi affidati a fornitori diversi. Lavoriamo così con le aziende di Torino e provincia che non vogliono solo farsi vedere: vogliono essere riconosciute.');
  });

  it('keeps the existing portfolio introduction and exactly three selected projects', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/', HomePageComponent);
    const page = harness.routeNativeElement!;
    const selectedProjects = page.querySelector('[aria-label="Esplora i progetti selezionati"]');

    expect(page.querySelector('.home-projects__intro')?.textContent?.trim()).toBe('Alcuni progetti recenti per aziende di Torino e provincia: video, fotografia, campagne e siti nati dalla stessa idea di partenza. Guarda il risultato.');
    expect(selectedProjects?.querySelectorAll('.project-preview')).toHaveLength(3);
  });
});
