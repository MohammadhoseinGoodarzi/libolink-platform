// Prop types for the shared mobile UI atoms (one organized folder, mirroring how
// @repo/types groups domain types). These reference RN/platform types, so they
// can't live in @repo/types. Component files import from here and never declare
// types inline (CLAUDE.md: no type declarations in component files).

export type SponsoredCardProps = {
  /** Monogram letter for the square mark. */
  letter: string;
  title: string;
  body: string;
  cta: string;
  /** Appended to the CTA as "{cta} · {brand}" when present. */
  brand?: string;
};
