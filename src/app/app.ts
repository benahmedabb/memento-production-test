import { ViewportScroller } from '@angular/common';
import { Component, DOCUMENT, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConsentBannerComponent } from './shared/consent-banner.component';
import { FloatingWhatsappComponent } from './shared/floating-whatsapp.component';
import { PointerHaloComponent } from './shared/pointer-halo.component';
import { SiteFooterComponent } from './shared/site-footer.component';
import { SiteHeaderComponent } from './shared/site-header.component';

@Component({
  imports: [
    RouterOutlet,
    SiteHeaderComponent,
    SiteFooterComponent,
    ConsentBannerComponent,
    FloatingWhatsappComponent,
    PointerHaloComponent,
  ],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  constructor() {
    const document = inject(DOCUMENT);
    // Keep linked portfolio projects visible below the sticky navigation.
    inject(ViewportScroller).setOffset(() => [
      0,
      (document.querySelector('.site-header')?.getBoundingClientRect().height ?? 0) + 24,
    ]);
  }
}
