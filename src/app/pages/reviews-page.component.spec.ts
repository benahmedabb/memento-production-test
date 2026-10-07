import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../app.routes';
import { siteConfig } from '../core/site.config';
import { HomePageComponent } from './home-page.component';
import { ReviewsPageComponent } from './reviews-page.component';

describe('Video testimonial navigation and SEO', () => {
  it('links from Home to the video, preserves Google reviews and publishes verified video metadata', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes), provideHttpClient()] });
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/', HomePageComponent);
    const link = harness.routeNativeElement!.querySelector('.home-testimonial__link')!;
    expect(link.getAttribute('href')).toBe('/recensioni#video-recensione');

    await harness.navigateByUrl(link.getAttribute('href')!, ReviewsPageComponent);
    const page = harness.routeNativeElement!;
    expect(page.querySelectorAll('h1')).toHaveLength(1);
    expect(page.querySelector('#video-recensione')?.textContent).toContain('Dr. Alessio Vainella');
    expect(page.querySelectorAll('.review-card')).toHaveLength(siteConfig.reviews.length);
    expect(page.querySelector('iframe')).toBeNull();
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      `${siteConfig.origin}/recensioni`,
    );
    const schema = JSON.parse(document.getElementById('memento-structured-data')!.textContent!);
    const video = schema.find((item: Record<string, unknown>) => item['@type'] === 'VideoObject');
    expect(video).toMatchObject({
      '@id': `${siteConfig.origin}/recensioni#video-recensione`,
      name: 'Dr. Alessio Vainella: la sua esperienza con Memento Production',
      duration: 'PT1M8S',
      uploadDate: '2026-09-25T07:49:52-07:00',
      thumbnailUrl: `${siteConfig.origin}/images/testimonianza-alessio-vainella-memento.jpg`,
      embedUrl: 'https://www.youtube-nocookie.com/embed/AK2Dz4vgTr8',
    });

    await harness.navigateByUrl('/', HomePageComponent);
    expect(document.getElementById('memento-structured-data')!.textContent).not.toContain(
      'VideoObject',
    );
  });
});
