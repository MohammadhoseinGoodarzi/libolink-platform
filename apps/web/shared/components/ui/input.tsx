import { cn } from '@repo/utils';
import type { ComponentProps } from 'react';

function Input({ className, type, ...props }: ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'flex h-[42px] w-full min-w-0 rounded-md border border-input bg-background px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm',
        'placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground',
        'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-medium file:text-sm',
        'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
