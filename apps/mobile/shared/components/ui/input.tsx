import { cn } from '@repo/utils';
import type { ComponentProps } from 'react';
import { TextInput } from 'react-native';
import { useThemeColors } from '@/shared/theme';

// Filled native-feel field (handoff auth Field): recessed secondary fill, 16px
// radius, 52px tall, Vazirmatn medium, body-gray placeholder.
function Input({ className, ...props }: ComponentProps<typeof TextInput>) {
  const colors = useThemeColors();
  return (
    <TextInput
      placeholderTextColor={colors.mutedForeground}
      className={cn(
        'h-[52px] rounded-2xl bg-secondary px-3.5 font-sans-medium text-base text-foreground',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
