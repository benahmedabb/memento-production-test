import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-site-header',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="site-header">
      <div class="shell header-inner">
        <a class="brand-logo" routerLink="/" aria-label="Memento Production, home">
          <img src="/images/logo-memento-navbar.png" alt="" width="640" height="560" />
        </a>

        <button
          class="menu-toggle"
          type="button"
          [attr.aria-expanded]="menuOpen()"
          aria-controls="primary-navigation"
          (click)="toggleMenu()"
        >
          <span class="sr-only">{{ menuOpen() ? 'Chiudi' : 'Apri' }} menu</span>
          <span aria-hidden="true"></span><span aria-hidden="true"></span>
        </button>

        <nav id="primary-navigation" class="primary-nav" [class.is-open]="menuOpen()" aria-label="Navigazione principale">
          @for (item of items; track item.path) {
            <a [routerLink]="item.path" routerLinkActive="is-active" [routerLinkActiveOptions]="{ exact: item.path === '/' }" (click)="closeMenu()">
              {{ item.label }}
            </a>
          }
          <a class="button button--small nav-cta" routerLink="/contatti" (click)="closeMenu()">Parliamone</a>
        </nav>
      </div>
    </header>
  `,
})
export class SiteHeaderComponent {
  readonly menuOpen = signal(false);
  readonly items = [
    { label: 'Home', path: '/' },
    { label: 'Agenzia', path: '/agenzia' },
    { label: 'Servizi', path: '/servizi' },
    { label: 'Portfolio', path: '/portfolio' },
    { label: 'Recensioni', path: '/recensioni' },
    { label: 'Contatti', path: '/contatti' },
  ];

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }
}
