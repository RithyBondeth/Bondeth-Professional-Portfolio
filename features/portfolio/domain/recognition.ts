/** A photo or scan shown alongside a recognition. Served from /public. */
export interface RecognitionImage {
  src: string;
  /** Intrinsic size, so next/image can reserve space before the file loads. */
  width: number;
  height: number;
  alt: string;
  altKm?: string;
}

/**
 * A certificate, award, or other formal recognition from an outside body.
 *
 * Khmer copy sits beside the English on each entry (like `Video`) rather than
 * in a parallel array, so reordering entries can't attach a translation to the
 * wrong one.
 */
export interface Recognition {
  id: string;
  title: string;
  titleKm?: string;
  issuer: string;
  issuerKm?: string;
  /** ISO date the recognition was presented. */
  date: string;
  /** Display dates are written out by hand: Khmer month data is patchy in Intl. */
  dateLabel: string;
  dateLabelKm?: string;
  location: string;
  locationKm?: string;
  description: string;
  descriptionKm?: string;
  /** The headline number behind the recognition, if there is one. */
  metric?: {
    value: string;
    valueKm?: string;
    label: string;
    labelKm?: string;
  };
  /** Lead image, shown large. */
  cover: RecognitionImage;
  /** The certificate itself, linked in full. */
  certificate: RecognitionImage;
  /** Further event photos, shown as thumbnails. */
  photos: RecognitionImage[];
}
