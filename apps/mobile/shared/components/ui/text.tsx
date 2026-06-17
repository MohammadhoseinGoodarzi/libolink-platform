import { cn } from '@repo/utils';
import type { ComponentProps } from 'react';
import { Text as RNText } from 'react-native';

// Enforces Vazirmatn everywhere (handoff §3.5). Defaults to the 400 weight;
// override with font-sans-medium / font-sans-semibold / font-sans-bold. Always
// use this instead of RN's <Text> so no screen leaks the system font.
function Text({ className, ...props }: ComponentProps<typeof RNText>) {
  return <RNText className={cn('font-sans text-base text-foreground', className)} {...props} />;
}

export { Text };
