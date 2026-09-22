import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-client-logos',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './client-logos.component.scss',
  template: `
    <section class="client-logos" aria-label="I nostri clienti">
      <div class="client-logos__viewport">
        <div class="client-logos__track" [class.client-logos__track--paused]="paused()">
          @for (copy of [0, 1]; track copy) {
            <ul class="client-logos__group" [class.client-logos__group--copy]="copy === 1" [attr.aria-hidden]="copy === 1 ? 'true' : null" role="list">
              @for (logo of logos; track logo.src) {
                <li class="client-logos__item" [class.client-logos__item--compact]="logo.compact" [class.client-logos__item--padded]="logo.padded">
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
  readonly logos = [
    { src: '/images/Logotipo bianco.png', name: 'AgriDora Società Agricola', width: 917, height: 230, compact: false, padded: false },
    { src: '/images/Logo bianco.png', name: "Dora Motor’s Experience", width: 1086, height: 366, compact: false, padded: false },
    { src: '/images/Logotipo bianco (1).png', name: 'Villa Dora Country House', width: 996, height: 286, compact: false, padded: false },
    { src: '/images/Logo bianco (1).png', name: 'Novaera Immobiliare — logo completo', width: 2087, height: 1538, compact: true, padded: false },
    { src: '/images/Logotipo bianco (3).png', name: 'Bioveil', width: 1052, height: 210, compact: false, padded: false },
    { src: '/images/Logotipo bianco (4).png', name: 'Artema', width: 1000, height: 215, compact: false, padded: false },
    { src: '/images/Pittogramma bianco.png', name: 'Monogramma C4', width: 670, height: 498, compact: true, padded: false },
    { src: '/images/Logotipo bianco (2).png', name: 'Novaera Immobiliare — logotipo', width: 2087, height: 474, compact: false, padded: false },
    { src: '/images/TEMP RA.png', name: 'Regrowth Alliance', width: 1390, height: 1390, compact: false, padded: true },
  ] as const;

  togglePause(): void {
    this.paused.update((paused) => !paused);
  }
}
