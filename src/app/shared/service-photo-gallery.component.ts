import {
  afterRenderEffect,
  Component,
  ElementRef,
  computed,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { PhotoSelection, photoSource, photoSrcset } from '../core/service-media';

@Component({
  selector: 'app-service-photo-gallery',
  imports: [RouterLink],
  styleUrl: './service-photo-gallery.component.scss',
  template: `
    <section id="scatti-realizzati" class="photo-gallery" aria-labelledby="photo-gallery-title">
      <div class="shell">
        <div class="photo-gallery__heading">
          <div>
            <p class="eyebrow">Fotografia immobiliare / Professionecasa</p>
            <h2 id="photo-gallery-title">{{ selection().title }}</h2>
          </div>
          <p>{{ selection().description }}</p>
        </div>
        <div
          class="photo-gallery__grid"
          [class.photo-gallery__grid--preview]="selection().photos.length === 3"
        >
          @for (photo of selection().photos; track photo.slug) {
            <figure>
              <a
                [href]="source(photo, 1920)"
                (click)="open($event, $index)"
                aria-haspopup="dialog"
                [attr.aria-label]="'Ingrandisci: ' + photo.alt"
              >
                <img
                  [src]="source(photo)"
                  [srcset]="srcset(photo)"
                  sizes="(max-width: 600px) 92vw, (max-width: 900px) 46vw, 40vw"
                  [alt]="photo.alt"
                  [width]="photo.width"
                  [height]="photo.height"
                  loading="lazy"
                  decoding="async"
                />
                <span class="photo-gallery__expand" aria-hidden="true">↗</span>
              </a>
              <figcaption>
                <span>{{ photo.location }}</span>
                <h3>{{ photo.title }}</h3>
              </figcaption>
            </figure>
          }
        </div>
        <div class="photo-gallery__footer">
          <span>Fotografie di Memento Production per Professionecasa</span>
          @if (selection().more; as more) {
            <a class="text-link" [routerLink]="more.path"
              >{{ more.label }} <span aria-hidden="true">↗</span></a
            >
          }
        </div>
      </div>
    </section>
    <dialog
      #lightbox
      class="photo-lightbox"
      aria-label="Galleria di fotografia immobiliare"
      (close)="selectedIndex.set(null)"
      (click)="closeOnBackdrop($event)"
      (keydown.arrowLeft)="move($event, -1)"
      (keydown.arrowRight)="move($event, 1)"
    >
      @if (selectedPhoto(); as photo) {
        <div class="photo-lightbox__content">
          <button
            #closeButton
            class="photo-lightbox__close"
            type="button"
            (click)="close()"
            autofocus
            aria-label="Chiudi la fotografia"
          >
            Chiudi <span aria-hidden="true">×</span>
          </button>
          <img
            [src]="source(photo, 1920)"
            [alt]="photo.alt"
            [width]="photo.width"
            [height]="photo.height"
          />
          <div class="photo-lightbox__caption">
            <button type="button" (click)="move($event, -1)" aria-label="Fotografia precedente">
              ←
            </button>
            <p aria-live="polite">
              <strong>{{ photo.location }}</strong
              ><span>{{ (selectedIndex() ?? 0) + 1 }} / {{ selection().photos.length }}</span>
            </p>
            <button type="button" (click)="move($event, 1)" aria-label="Fotografia successiva">
              →
            </button>
          </div>
        </div>
      }
    </dialog>
  `,
})
export class ServicePhotoGalleryComponent {
  readonly selection = input.required<PhotoSelection>();
  readonly source = photoSource;
  readonly srcset = photoSrcset;
  readonly selectedIndex = signal<number | null>(null);
  readonly selectedPhoto = computed(() => {
    const index = this.selectedIndex();
    return index === null ? null : this.selection().photos[index];
  });
  private readonly lightbox = viewChild.required<ElementRef<HTMLDialogElement>>('lightbox');
  private readonly closeButton = viewChild<ElementRef<HTMLButtonElement>>('closeButton');

  constructor() {
    afterRenderEffect(() => this.closeButton()?.nativeElement.focus());
  }

  open(event: MouseEvent, index: number): void {
    // Keep the original image link usable without JavaScript, or with a modifier key.
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const dialog = this.lightbox().nativeElement;
    if (typeof dialog.showModal !== 'function') return;
    event.preventDefault();
    this.selectedIndex.set(index);
    dialog.showModal();
  }

  close(): void {
    this.lightbox().nativeElement.close();
    this.selectedIndex.set(null);
  }

  closeOnBackdrop(event: MouseEvent): void {
    if (event.target === this.lightbox().nativeElement) this.close();
  }

  move(event: Event, direction: number): void {
    event.preventDefault();
    const index = this.selectedIndex();
    if (index !== null)
      this.selectedIndex.set(
        (index + direction + this.selection().photos.length) % this.selection().photos.length,
      );
  }
}
