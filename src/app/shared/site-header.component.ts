import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { serviceEntries } from '../core/site.config';

@Component({
  selector: 'app-site-header',
  imports: [RouterLink, RouterLinkActive],
  styleUrl: './site-header.component.scss',
  host: {
    '(document:click)': 'onDocumentClick($event)',
  },
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
            @if (item.path === '/servizi') {
              <div #servicesMenu class="nav-services" [class.is-open]="servicesOpen()" routerLinkActive="is-active"
                (pointerenter)="onServicesPointerEnter($event)" (pointerleave)="onServicesPointerLeave($event)"
                (focusout)="onServicesFocusOut($event)" (keydown.escape)="onServicesEscape($event)"
                (keydown.arrowdown)="onServicesArrowDown($event)">
                <div class="nav-services__trigger">
                  <a class="nav-services__link" routerLink="/servizi" routerLinkActive="is-active" ariaCurrentWhenActive="page" (click)="closeMenu()">Servizi</a>
                  <button #servicesToggle class="nav-services__toggle" type="button" [attr.aria-expanded]="servicesOpen()"
                    aria-controls="services-navigation" aria-label="Mostra o nascondi i servizi" (click)="toggleServices()">
                    <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true" focusable="false"><path d="m4 6 4 4 4-4" /></svg>
                  </button>
                </div>
                <div id="services-navigation" class="nav-services__panel" [inert]="!servicesOpen()">
                  <ul class="nav-services__list" aria-label="I nostri servizi">
                    @for (entry of services; track entry.key) {
                      <li>
                        <a class="nav-services__item" [routerLink]="entry.path" routerLinkActive="is-active" ariaCurrentWhenActive="page" (click)="closeMenu()">
                          <span class="nav-services__number" aria-hidden="true">0{{ $index + 1 }}</span>
                          <span>{{ entry.service.shortTitle }}</span>
                          <svg class="nav-services__arrow" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false"><path d="M3 13 13 3M3 3h10v10" /></svg>
                        </a>
                      </li>
                    }
                  </ul>
                </div>
              </div>
            } @else {
              <a [routerLink]="item.path" routerLinkActive="is-active" ariaCurrentWhenActive="page" [routerLinkActiveOptions]="{ exact: item.path === '/' }" (click)="closeMenu()">
                {{ item.label }}
              </a>
            }
          }
          <a class="button button--small nav-cta" routerLink="/contatti" (click)="closeMenu()">Parliamone</a>
        </nav>
      </div>
    </header>
  `,
})
export class SiteHeaderComponent {
  readonly menuOpen = signal(false);
  readonly servicesOpen = signal(false);
  readonly services = serviceEntries;

  @ViewChild('servicesMenu') private servicesMenu?: ElementRef<HTMLElement>;
  @ViewChild('servicesToggle') private servicesToggle?: ElementRef<HTMLButtonElement>;
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
    this.servicesOpen.set(false);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
    this.servicesOpen.set(false);
  }

  toggleServices(): void {
    this.servicesOpen.update((open) => !open);
  }

  onServicesPointerEnter(event: PointerEvent): void {
    if (event.pointerType === 'mouse' && window.matchMedia('(min-width: 860px) and (hover: hover)').matches) {
      this.servicesOpen.set(true);
    }
  }

  onServicesPointerLeave(event: PointerEvent): void {
    const menu = this.servicesMenu?.nativeElement;
    if (event.pointerType === 'mouse' && !menu?.contains(menu.ownerDocument.activeElement)) {
      this.servicesOpen.set(false);
    }
  }

  onServicesFocusOut(event: FocusEvent): void {
    if (!this.servicesMenu?.nativeElement.contains(event.relatedTarget as Node | null)) {
      this.servicesOpen.set(false);
    }
  }

  onServicesEscape(event: Event): void {
    if (this.servicesOpen()) {
      event.stopPropagation();
      this.servicesOpen.set(false);
      this.servicesToggle?.nativeElement.focus();
    }
  }

  onServicesArrowDown(event: Event): void {
    if ((event.target as HTMLElement).closest('.nav-services__trigger')) {
      event.preventDefault();
      this.servicesOpen.set(true);
      // Wait for Angular to remove inert before moving keyboard focus into the list.
      setTimeout(() => {
        if (this.servicesOpen()) {
          this.servicesMenu?.nativeElement.querySelector<HTMLAnchorElement>('.nav-services__item')?.focus();
        }
      });
    }
  }

  onDocumentClick(event: MouseEvent): void {
    if (this.servicesOpen() && !this.servicesMenu?.nativeElement.contains(event.target as Node)) {
      this.servicesOpen.set(false);
    }
  }
}
