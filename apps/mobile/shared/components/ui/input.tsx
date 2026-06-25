import { cn } from '@repo/utils';
import type { ComponentProps } from 'react';
import { TextInput } from 'react-native';
import { useThemeColors } from '@/shared/theme';

// Filled native-feel field (handoff auth Field): recessed secondary fill, 16px
// radius, 52px tall, Vazirmatn medium, body-gray placeholder.
function Input({ className, style, ...props }: ComponentProps<typeof TextInput>) {
  const colors = useThemeColors();
  return (
    <TextInput
      placeholderTextColor={colors.mutedForeground}
      // Tight glyph box (no Android font padding) + a 1px top nudge so text and
      // placeholder sit on the optical centre — same recipe as SearchInput.
      // (textAlignVertical is multiline-only on Android, so it can't center this.)
      style={[{ includeFontPadding: false, paddingTop: 1, paddingBottom: 0 }, style]}
      className={cn(
        'h-[52px] rounded-2xl bg-secondary px-3.5 font-sans-medium text-base text-foreground',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
