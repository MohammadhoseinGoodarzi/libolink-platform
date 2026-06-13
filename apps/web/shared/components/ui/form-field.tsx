import { cn } from '@repo/utils';
import type { ComponentProps, ReactNode } from 'react';

type FormFieldProps = ComponentProps<'div'> & {
  label: string;
  htmlFor: string;
  error?: string | undefined;
  children: ReactNode;
};

function FormField({ label, htmlFor, error, children, className, ...props }: FormFieldProps) {
  return (
    <div data-slot="form-field" className={cn('grid gap-2', className)} {...props}>
      <label htmlFor={htmlFor} className="font-medium text-sm leading-none">
        {label}
      </label>
      {children}
      {error ? (
        <p role="alert" className="text-destructive text-sm">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export { FormField };
