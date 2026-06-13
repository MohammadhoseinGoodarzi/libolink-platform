import { Slot } from '@radix-ui/react-slot';
import { cn } from '@repo/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm transition-all outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline: 'border border-input bg-background text-primary hover:bg-accent',
        ghost: 'text-primary hover:bg-accent hover:text-accent-foreground',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        post: 'bg-primary text-primary-foreground shadow-lg shadow-primary/50 hover:bg-primary/90',
      },
      size: {
        default: 'h-[42px] px-6 py-2 has-[>svg]:px-4',
        sm: 'h-8 gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-[52px] px-8 has-[>svg]:px-6',
        icon: 'size-9',
        'icon-sm': 'size-8',
        post: 'h-[19px] gap-1 px-2.5 text-xs',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

type ButtonProps = ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

function Button({ className, variant, size, asChild = false, type, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      // Defaults to "button" so it never submits a form unintentionally.
      // When asChild, the rendered child owns its own semantics.
      type={asChild ? type : (type ?? 'button')}
      {...props}
    />
  );
}

export { Button, buttonVariants };
