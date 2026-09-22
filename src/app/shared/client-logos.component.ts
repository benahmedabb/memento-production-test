import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

interface ClientLogo {
  readonly src: string;
  readonly name: string;
  readonly width: number;
  readonly height: number;
  readonly compact?: boolean;
  readonly padded?: boolean;
  readonly darkBackground?: boolean;
  readonly solidWhite?: boolean;
}

@Component({
  selector: 'app-client-logos',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './client-logos.component.scss',
  template: `
    <section class="client-logos" aria-label="I nostri clienti">
      <svg class="client-logos__filters" width="0" height="0" aria-hidden="true" focusable="false">
        <defs>
          <filter id="client-logos-solid-white" color-interpolation-filters="sRGB">
            <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0" />
            <feComponentTransfer><feFuncA type="linear" slope="3" intercept="-0.5" /></feComponentTransfer>
          </filter>
        </defs>
      </svg>
      <div class="client-logos__viewport">
        <div class="client-logos__track" [class.client-logos__track--paused]="paused()" [style.--logo-duration]="scrollDuration">
          @for (copy of [0, 1]; track copy) {
            <ul class="client-logos__group" [class.client-logos__group--copy]="copy === 1" [attr.aria-hidden]="copy === 1 ? 'true' : null" role="list">
              @for (logo of logos; track logo.src) {
                <li class="client-logos__item" [class.client-logos__item--compact]="logo.compact" [class.client-logos__item--padded]="logo.padded" [class.client-logos__item--dark-background]="logo.darkBackground" [class.client-logos__item--solid-white]="logo.solidWhite">
                  <img [src]="logo.src" [alt]="copy === 0 ? logo.name : ''" [width]="logo.width" [height]="logo.height" decoding="async" />
                </li>
              }
            </ul>
          }
        </div>
      </div>
      <div class="shell client-logos__controls">
        <button class="client-logos__toggle" type="button" (click)="togglePause()" [attr.aria-label]="paused() ? 'Riprendi lo scorrimento dei loghi' : 'Metti in pausa lo scorrimento dei loghi'">
          <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true" focusable="false">
            @if (paused()) {
              <path d="M4 2 13 8 4 14Z" />
            } @else {
              <path d="M3 2h3v12H3zM10 2h3v12h-3z" />
            }
          </svg>
          {{ paused() ? 'Riprendi' : 'Pausa' }}
        </button>
      </div>
    </section>
  `,
})
export class ClientLogosComponent {
  readonly paused = signal(false);
  readonly logos: readonly ClientLogo[] = [
    { src: '/images/Logotipo bianco.png', name: 'AgriDora Società Agricola', width: 917, height: 230 },
    { src: '/images/Logo bianco.png', name: "Dora Motor’s Experience", width: 1086, height: 366 },
    { src: '/images/Logotipo bianco (1).png', name: 'Villa Dora Country House', width: 996, height: 286 },
    { src: '/images/Logo bianco (1).png', name: 'Novaera Immobiliare', width: 2087, height: 1538, compact: true },
    { src: '/images/Logotipo bianco (3).png', name: 'Bioveil', width: 1052, height: 210 },
    { src: '/images/Logotipo bianco (4).png', name: 'Artema', width: 1000, height: 215 },
    { src: '/images/Pittogramma bianco.png', name: 'Monogramma C4', width: 670, height: 498, compact: true },
    { src: '/images/TEMP RA.png', name: 'Regrowth Alliance', width: 1390, height: 1390, padded: true },
    { src: '/images/LOGO TRECCA VERT. BIANCO_.png', name: 'Treccagas', width: 2478, height: 1055, compact: true, solidWhite: true },
    { src: '/images/Logo V1 bianco.png', name: 'Pasticceria Primavera', width: 1572, height: 1388, compact: true },
    { src: '/images/Logo bianco (4).png', name: 'Rare', width: 1266, height: 843, compact: true },
    { src: '/images/MASTER_LOGO_BIANCO.png', name: 'Master — dall’alba al tramonto', width: 6615, height: 2505, solidWhite: true },
    { src: '/images/MEEET Logo chiaro.png', name: 'Meeet Beauty Medical Lab', width: 931, height: 670, padded: true },
    { src: '/images/WhatsApp Image 2026-01-07 at 13.22.47.jpeg', name: 'Life Benessere e Solarium', width: 1280, height: 506, darkBackground: true },
    { src: '/images/logo bianco (3).png', name: 'GR L’Immobiliare', width: 1459, height: 325 },
  ];
  readonly scrollDuration = `${this.logos.length * 7.5}s`;

  togglePause(): void {
    this.paused.update((paused) => !paused);
  }
}
