export interface ServicePhoto {
  readonly slug: string;
  readonly title: string;
  readonly location: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
  readonly widths?: readonly number[];
  readonly sourcePath?: string;
  readonly contain?: boolean;
  readonly objectPosition?: string;
}

const imageRoot = '/images/servizi/';

export const photoSource = (photo: ServicePhoto, width = 1200) => {
  if (photo.sourcePath) {
    return photo.sourcePath;
  }

  const available = photo.widths ?? [640, 1200, 1920];
  const size = available.find((size) => size >= width) ?? available[available.length - 1];
  return `${imageRoot}${photo.slug}-${size}.webp`;
};

export const photoSrcset = (photo: ServicePhoto) => {
  if (photo.sourcePath) {
    return `${photo.sourcePath} ${photo.width}w`;
  }

  return (photo.widths ?? [640, 1200, 1920])
    .map((width) => `${photoSource(photo, width)} ${width}w`)
    .join(', ');
};
