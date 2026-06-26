import { cva, type VariantProps } from 'class-variance-authority';

// One chip family: a rounded-full pill that is either a static label (`tone` =
// colour scheme) or an interactive, toggleable filter (`selectable`). Mirrors the
// Button base + cva split (kept in a non-component module). The `selected` tone
// is internal — a selectable chip's active state; callers pass one of the static
// tones via ChipProps.tone.
export const chipVariants = cva('flex-row items-center gap-1.5 rounded-full', {
  variants: {
    tone: {
      neutral: 'bg-secondary',
      muted: 'bg-secondary',
      primary: 'bg-secondary',
      accent: 'bg-secondary',
      selected: 'bg-primary',
    },
    size: {
      sm: 'h-[22px] px-2.5',
      default: 'h-8 px-3',
    },
  },
  defaultVariants: { tone: 'neutral', size: 'default' },
});

export const chipTextVariants = cva('font-sans-medium', {
  variants: {
    tone: {
      neutral: 'text-foreground',
      muted: 'text-muted-foreground',
      primary: 'text-primary',
      accent: 'text-link',
      selected: 'font-sans-semibold text-primary-foreground',
    },
    size: {
      sm: 'text-[11px]',
      default: 'text-xs',
    },
  },
  defaultVariants: { tone: 'neutral', size: 'default' },
});

export type ChipVariantProps = VariantProps<typeof chipVariants>;
