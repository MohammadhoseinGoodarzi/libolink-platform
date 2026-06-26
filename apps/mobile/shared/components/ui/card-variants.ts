import { cva, type VariantProps } from 'class-variance-authority';

// Card surface variants (kept in a non-component module, mirroring Button/Chip).
// `elevated` (default) = the soft-shadow white surface (handoff §6); `flat` = a
// bordered, shadowless surface used for inline content cards (bio, About,
// currently-reading). `padded` adds the common 16px inset so callers stop
// hand-rolling `… p-4`.
export const cardVariants = cva('bg-card', {
  variants: {
    variant: {
      elevated: 'rounded-lg',
      flat: 'rounded-2xl border border-border',
    },
    padded: {
      true: 'p-4',
      false: '',
    },
  },
  defaultVariants: { variant: 'elevated', padded: false },
});

export type CardVariantProps = VariantProps<typeof cardVariants>;
