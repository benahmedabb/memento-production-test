import { catalogChildren, catalogHubs } from '../core/service-navigation';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { IsActiveMatchOptions, RouterLink, RouterLinkActive } from '@angular/router';
import { serviceEntries } from '../core/site.config';
import { TrackingService } from '../core/tracking.service';

interface NavigationLink {
  readonly label: string;
  readonly path: string;
  readonly fragment?: string;
  readonly children?: readonly NavigationLink[];
}

interface NavigationItem extends NavigationLink {
  readonly dropdown?: {
    readonly id: string;
    readonly label: string;
    readonly links: readonly NavigationLink[];
  };
}

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
          <img src="/images/logo-memento-navbar.png" alt="Memento Production" width="640" height="560" />
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
            @if (item.dropdown; as dropdown) {
              <div class="nav-dropdown" [class.nav-dropdown--services]="item.path === '/servizi'" [attr.data-menu-path]="item.path" [class.is-open]="openDropdown() === item.path" routerLinkActive="is-active"
                (pointerenter)="onDropdownPointerEnter($event, item.path)" (pointerleave)="onDropdownPointerLeave($event, item.path)"
                (focusout)="onDropdownFocusOut($event, item.path)" (keydown.escape)="onDropdownEscape($event, item.path)"
                (keydown.arrowdown)="onDropdownArrowDown($event, item.path)">
                <div class="nav-dropdown__trigger">
                  <a class="nav-dropdown__link" [routerLink]="item.path" routerLinkActive="is-active" ariaCurrentWhenActive="page" (click)="closeMenu()">{{ item.label }}</a>
                  <button class="nav-dropdown__toggle" type="button" [attr.aria-expanded]="openDropdown() === item.path"
                    [attr.aria-controls]="dropdown.id" [attr.aria-label]="'Mostra o nascondi ' + item.label" (click)="toggleDropdown(item.path)">
                    <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true" focusable="false"><path d="m4 6 4 4 4-4" /></svg>
                  </button>
                </div>
                <div [id]="dropdown.id" class="nav-dropdown__panel" [attr.inert]="openDropdown() !== item.path ? '' : null">
                  <ul class="nav-dropdown__list" [attr.aria-label]="dropdown.label">
                    @for (entry of dropdown.links; track entry.path + (entry.fragment ?? '')) {
                      <li [class.nav-service-group]="item.path === '/servizi'" [class.is-expanded]="openServiceGroup() === entry.path">
                        <div class="nav-service-group__head">
                        <a class="nav-dropdown__item" [routerLink]="entry.path" [fragment]="entry.fragment" routerLinkActive="is-active"
                          [routerLinkActiveOptions]="entry.fragment ? sectionMatchOptions : pageMatchOptions"
                          [ariaCurrentWhenActive]="entry.fragment ? 'location' : 'page'" (click)="closeMenu()">
                          <span class="nav-dropdown__number" aria-hidden="true">0{{ $index + 1 }}</span>
                          <span>{{ entry.label }}</span>
                          <svg class="nav-dropdown__arrow" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false"><path d="M3 13 13 3M3 3h10v10" /></svg>
                        </a>
                        @if (entry.children?.length) {
                          <button class="nav-service-group__toggle" type="button" [attr.aria-expanded]="openServiceGroup() === entry.path" [attr.aria-controls]="'service-group-' + $index" [attr.aria-label]="'Mostra o nascondi servizi ' + entry.label" (click)="toggleServiceGroup(entry.path)"><span aria-hidden="true">{{ openServiceGroup() === entry.path ? '−' : '+' }}</span></button>
                        }
                        </div>
                        @if (entry.children?.length) {
                          <ul class="nav-service-group__children" [id]="'service-group-' + $index" [attr.aria-label]="'Servizi ' + entry.label">
                            @for (child of entry.children; track child.path) { <li><a [routerLink]="child.path" routerLinkActive="is-active" [routerLinkActiveOptions]="pageMatchOptions" ariaCurrentWhenActive="page" (click)="closeMenu()">{{ child.label }}<span aria-hidden="true">↗</span></a></li> }
                          </ul>
                        } @else if (item.path === '/servizi') { <p class="nav-service-group__note">Creatività, campagne e misurazione.</p> }
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
          <a class="button button--small nav-cta" routerLink="/contatti" (click)="closeMenu(); tracking.trackQuote('header')">Contattaci</a>
        </nav>
      </div>
    </header>
  `,
})
export class SiteHeaderComponent {
  private dropdownCloseTimer: ReturnType<typeof setTimeout> | undefined;
  readonly tracking = inject(TrackingService);
  readonly menuOpen = signal(false);
  readonly openDropdown = signal<string | null>(null);
  readonly openServiceGroup = signal<string | null>(null);
  readonly pageMatchOptions: IsActiveMatchOptions = {
    paths: 'exact', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored',
  };
  readonly sectionMatchOptions: IsActiveMatchOptions = {
    ...this.pageMatchOptions, fragment: 'exact',
  };
  readonly items: readonly NavigationItem[] = [
    { label: 'Home', path: '/' },
    {
      label: 'Agenzia', path: '/agenzia',
      dropdown: {
        id: 'agency-navigation', label: 'Esplora la nostra agenzia',
        links: [
          { label: 'Il nostro metodo', path: '/agenzia', fragment: 'metodo' },
          { label: 'Chi siamo', path: '/agenzia', fragment: 'chi-siamo' },
          { label: 'Chiavi in mano', path: '/agenzia', fragment: 'chiavi-in-mano' },
        ],
      },
    },
    {
      label: 'Servizi', path: '/servizi',
      dropdown: {
        id: 'services-navigation', label: 'I nostri servizi',
        links: [
          ...catalogHubs.map(hub => ({ label: hub.label, path: hub.path, children: catalogChildren(hub.path).map(page => ({ label: page.label, path: page.path })) })),
          ...serviceEntries.filter(entry => entry.key === 'ads').map(entry => ({ label: entry.service.shortTitle, path: entry.path })),
        ],
      },
    },
    { label: 'Portfolio', path: '/portfolio' },
    { label: 'Recensioni', path: '/recensioni' },
  ];

  constructor() {
    inject(DestroyRef).onDestroy(() => this.cancelDropdownClose());
  }

  toggleMenu(): void {
    this.cancelDropdownClose();
    this.menuOpen.update((open) => !open);
    this.openServiceGroup.set(null);
    this.openDropdown.set(null);
  }

  closeMenu(): void {
    this.cancelDropdownClose();
    this.menuOpen.set(false);
    this.openServiceGroup.set(null);
    this.openDropdown.set(null);
  }

  toggleServiceGroup(path: string): void {
    this.openServiceGroup.update(open => open === path ? null : path);
  }

  toggleDropdown(path: string): void {
    this.cancelDropdownClose();
    this.openDropdown.update((open) => open === path ? null : path);
  }

  onDropdownPointerEnter(event: PointerEvent, path: string): void {
    if (event.pointerType === 'mouse' && window.matchMedia('(min-width: 860px) and (hover: hover)').matches) {
      this.cancelDropdownClose();
      this.openDropdown.set(path);
    }
  }

  onDropdownPointerLeave(event: PointerEvent, path: string): void {
    const menu = event.currentTarget as HTMLElement;
    if (event.pointerType === 'mouse' && !menu.contains(menu.ownerDocument.activeElement)) {
      if (path === '/servizi') {
        // Allow the pointer to cross the short gap towards any mega-menu column.
        // Re-entering the dropdown cancels this pending close.
        this.cancelDropdownClose();
        this.dropdownCloseTimer = setTimeout(() => {
          this.dropdownCloseTimer = undefined;
          this.closeDropdown(path);
        }, 200);
      } else {
        this.closeDropdown(path);
      }
    }
  }

  onDropdownFocusOut(event: FocusEvent, path: string): void {
    if (!(event.currentTarget as HTMLElement).contains(event.relatedTarget as Node | null)) {
      this.closeDropdown(path);
    }
  }

  onDropdownEscape(event: Event, path: string): void {
    if (this.openDropdown() === path) {
      event.stopPropagation();
      this.closeDropdown(path);
      (event.currentTarget as HTMLElement).querySelector<HTMLButtonElement>('.nav-dropdown__toggle')?.focus();
    }
  }

  onDropdownArrowDown(event: Event, path: string): void {
    if ((event.target as HTMLElement).closest('.nav-dropdown__trigger')) {
      event.preventDefault();
      const menu = event.currentTarget as HTMLElement;
      this.cancelDropdownClose();
      this.openDropdown.set(path);
      // Wait for Angular to remove inert before moving focus into the list.
      setTimeout(() => {
        if (this.openDropdown() === path && menu.isConnected) {
          menu.querySelector<HTMLAnchorElement>('.nav-dropdown__item')?.focus();
        }
      });
    }
  }

  onDocumentClick(event: MouseEvent): void {
    const menu = event.target instanceof Element ? event.target.closest('.nav-dropdown') : null;
    if (menu?.getAttribute('data-menu-path') !== this.openDropdown()) {
      this.cancelDropdownClose();
      this.openDropdown.set(null);
    }
  }

  private closeDropdown(path: string): void {
    if (this.openDropdown() === path) {
      this.cancelDropdownClose();
      this.openDropdown.set(null);
    }
  }

  private cancelDropdownClose(): void {
    clearTimeout(this.dropdownCloseTimer);
    this.dropdownCloseTimer = undefined;
  }
}
