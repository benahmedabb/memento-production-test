import { Component, Input } from '@angular/core';
import type { CatalogCategory } from '../core/service-catalog';

/** Decorative artwork: no stock images are presented as client work. */
@Component({
  selector: 'app-service-visual',
  host: { 'aria-hidden': 'true' },
  template: `
    <div class="studio-object" [attr.data-discipline]="category" [style.--variation]="variant">
      <svg viewBox="0 0 520 520" fill="none" aria-hidden="true" focusable="false">
        <path class="object-grid" d="M0 130H520M0 260H520M0 390H520M130 0V520M260 0V520M390 0V520" />
        <path class="object-corners" d="M28 76V28H76M444 28H492V76M492 444V492H444M76 492H28V444" />
        @switch (category) {
          @case ('photo') {
            <g class="lens-shell">
              <circle cx="260" cy="260" r="196" />
              <circle cx="260" cy="260" r="181" />
              <circle class="object-dashes" cx="260" cy="260" r="166" />
            </g>
            <g class="object-motion lens-blades">
              @for (angle of angles; track angle) {
                <path
                  [attr.transform]="'rotate(' + angle + ' 260 260)'"
                  d="M260 107 391 184 260 260 260 337 127 260Z"
                />
              }
            </g>
            <circle class="lens-core" cx="260" cy="260" r="53" />
            <path class="object-cross" d="M250 260H270M260 250V270" />
          }
          @case ('video') {
            <g class="object-motion film-frames">
              <rect x="52" y="122" width="260" height="185" rx="4" />
              <rect x="113" y="167" width="260" height="185" rx="4" />
              <rect x="174" y="212" width="260" height="185" rx="4" />
              <path class="object-play" d="m276 263 62 39-62 39Z" />
            </g>
            <path
              class="film-track"
              d="M42 444H478M42 455V433M78 451V437M114 451V437M150 451V437M186 451V437M222 451V437M258 455V433M294 451V437M330 451V437M366 451V437M402 451V437M438 451V437M478 455V433"
            />
            <path class="film-head" d="M328 412V475m-8-63h16l-8 10Z" />
          }
          @case ('graphic') {
            <g class="object-motion type-sheet">
              <rect x="105" y="77" width="312" height="352" />
              <path d="M125 331H396M125 145H396" />
              <text x="134" y="324">Aa</text>
              <path d="M145 116H376M145 370H290M145 390H250" />
            </g>
            <g class="swatches">
              <rect x="298" y="363" width="71" height="99" />
              <rect x="369" y="363" width="71" height="99" />
              <rect x="440" y="363" width="35" height="99" />
            </g>
            <path class="object-cross" d="M88 95H104M96 87V103M408 445H424M416 437V453" />
          }
          @case ('social') {
            <g class="social-card social-card--back">
              <rect x="73" y="136" width="180" height="270" rx="12" />
              <circle cx="112" cy="173" r="12" />
              <path d="M138 173H221M94 212H232M94 238H210M94 264H186" />
            </g>
            <g class="object-motion social-card social-card--front">
              <rect x="213" y="74" width="216" height="352" rx="18" />
              <path d="M270 98H372" />
              <rect class="social-image" x="230" y="122" width="182" height="234" rx="7" />
              <path class="object-play" d="m295 207 55 34-55 34Z" />
              <path d="M234 385H300M234 399H340" />
              <circle cx="390" cy="386" r="10" />
            </g>
            <g class="social-bubble">
              <rect x="72" y="320" width="172" height="66" rx="33" />
              <circle cx="117" cy="353" r="5" />
              <circle cx="157" cy="353" r="5" />
              <circle cx="197" cy="353" r="5" />
            </g>
          }
          @case ('web') {
            <g class="object-motion browser-sheet">
              <rect x="47" y="107" width="403" height="300" rx="8" />
              <path d="M47 147H450" />
              <circle cx="70" cy="127" r="4" />
              <circle cx="87" cy="127" r="4" />
              <circle cx="104" cy="127" r="4" />
              <path d="M81 185H182M81 210H238M81 228H209" />
              <rect class="browser-button" x="81" y="260" width="86" height="26" />
              <rect class="browser-image" x="273" y="174" width="148" height="124" />
              <path d="m293 278 37-69 29 36 23-40 23 73Z" />
              <path d="M81 333H199M81 351H211M273 333H405M273 351H382" />
            </g>
            <g class="browser-phone">
              <rect x="361" y="257" width="112" height="196" rx="13" />
              <path d="M396 274H438M377 374H456M377 391H432" />
              <rect x="377" y="294" width="79" height="62" />
              <rect class="browser-button" x="377" y="411" width="56" height="16" />
            </g>
          }
        }
      </svg>
      <div class="object-caption">
        <span>Memento / {{ labels[category] }}</span
        ><span>Studio · Torino</span>
      </div>
    </div>
  `,
  styleUrl: './service-visual.component.scss',
})
export class ServiceVisualComponent {
  @Input({ required: true }) category!: CatalogCategory;
  @Input() variant = 0;
  readonly angles = [0, 60, 120, 180, 240, 300];
  readonly labels = { photo: 'Luce', video: 'Movimento', graphic: 'Identità', social: 'Relazioni', web: 'Connessioni' };
}
