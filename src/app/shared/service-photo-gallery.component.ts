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
            <p class="eyebrow">{{ selection().eyebrow }}</p>
            <h2 id="photo-gallery-title">{{ selection().title }}</h2>
          </div>
          <p>{{ selection().description }}</p>
        </div>
        <div
          class="photo-gallery__grid"
          [class.photo-gallery__grid--preview]="selection().photos.length === 3"
          [class.photo-gallery__grid--single]="selection().photos.length === 1"
          [class.photo-gallery__grid--comparison]="selection().layout === 'comparison'"
          [class.photo-gallery__grid--uniform]="selection().layout === 'uniform'"
          [class.photo-gallery__grid--uniform-four]="selection().layout === 'uniform' && selection().photos.length === 4"
        >
          @for (photo of selection().photos; track photo.slug) {
            <figure [class.photo-gallery__logo]="photo.contain">
              <a
                [href]="source(photo, 1920)"
                (click)="open($event, $index)"
                aria-haspopup="dialog"
                [attr.aria-label]="'Ingrandisci: ' + photo.alt"
              >
                <img
                  [src]="source(photo)"
                  [srcset]="srcset(photo)"
              [attr.sizes]="selection().layout === 'uniform'
                ? selection().photos.length === 4
                  ? '(max-width: 480px) 92vw, 45vw'
                  : '(max-width: 480px) 92vw, (max-width: 1099px) 45vw, 30vw'
                : '(max-width: 480px) 92vw, (max-width: 1099px) 92vw, 45vw'"
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
          <span>{{ selection().credit }}</span>
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
      [attr.aria-label]="'Galleria: ' + selection().title"
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
            aria-label="Chiudi l’immagine"
          >
            Chiudi <span aria-hidden="true">×</span>
          </button>
          <img
            [src]="source(photo, 1920)"
            [alt]="photo.alt"
            [width]="photo.width"
            [height]="photo.height"
            [class.photo-lightbox__logo]="photo.contain"
          />
          <div class="photo-lightbox__caption">
            <button type="button" (click)="move($event, -1)" aria-label="Immagine precedente">
              ←
            </button>
            <p aria-live="polite">
              <strong>{{ photo.location }}</strong
              ><span>{{ (selectedIndex() ?? 0) + 1 }} / {{ selection().photos.length }}</span>
            </p>
            <button type="button" (click)="move($event, 1)" aria-label="Immagine successiva">
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
