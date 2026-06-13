import { cn } from '@repo/utils';
import type { ComponentProps } from 'react';
import { TextInput } from 'react-native';

function Input({ className, ...props }: ComponentProps<typeof TextInput>) {
  return (
    <TextInput
      // Muted placeholder mirrors the web --muted-foreground token.
      placeholderTextColor="#9ca3af"
      className={cn(
        'h-[42px] rounded-md border border-input bg-background px-3 text-base text-foreground',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
