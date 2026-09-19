import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConsentBannerComponent } from './shared/consent-banner.component';
import { FloatingWhatsappComponent } from './shared/floating-whatsapp.component';
import { SiteFooterComponent } from './shared/site-footer.component';
import { SiteHeaderComponent } from './shared/site-header.component';

@Component({
  imports: [
    RouterOutlet,
    SiteHeaderComponent,
    SiteFooterComponent,
    ConsentBannerComponent,
    FloatingWhatsappComponent,
  ],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {}
