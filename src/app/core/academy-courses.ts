export interface AcademyCourseImage {
  readonly src: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
}

export interface AcademyCourse {
  readonly id: string;
  readonly number: string;
  readonly title: string;
  readonly topic: string;
  readonly description: string;
  readonly status: string;
  readonly platformUrl: string | null;
  readonly image: AcademyCourseImage | null;
}

/**
 * Aggiornare qui titolo, argomento, descrizione, immagine e URL quando i corsi
 * saranno pronti sulla piattaforma. Le card diventano automaticamente link.
 */
export const academyCourses: readonly AcademyCourse[] = [
  {
    id: 'corso-01',
    number: '01',
    title: 'Corso 01',
    topic: 'Programma in definizione',
    description: 'Stiamo preparando argomento, programma e modalità di accesso. Tutti i dettagli saranno pubblicati qui.',
    status: 'In arrivo',
    platformUrl: null,
    image: null,
  },
  {
    id: 'corso-02',
    number: '02',
    title: 'Corso 02',
    topic: 'Programma in definizione',
    description: 'Stiamo preparando argomento, programma e modalità di accesso. Tutti i dettagli saranno pubblicati qui.',
    status: 'In arrivo',
    platformUrl: null,
    image: null,
  },
  {
    id: 'corso-03',
    number: '03',
    title: 'Corso 03',
    topic: 'Programma in definizione',
    description: 'Stiamo preparando argomento, programma e modalità di accesso. Tutti i dettagli saranno pubblicati qui.',
    status: 'In arrivo',
    platformUrl: null,
    image: null,
  },
];
