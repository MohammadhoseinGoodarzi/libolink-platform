import { cn } from '@repo/utils';
import { Search } from 'lucide-react-native';
import type { ComponentProps } from 'react';
import { TextInput, View } from 'react-native';
import { useThemeColors } from '@/shared/theme';

// Pill search field (handoff §5): 44px, rounded-full, secondary fill, leading
// icon. The icon and input are flex-row siblings in an items-center box (the same
// structure as the auth field), so the icon and the text/placeholder share one
// vertically-centered lane.
function SearchInput({ className, ...props }: ComponentProps<typeof TextInput>) {
  const colors = useThemeColors();
  return (
    <View className="h-11 flex-row items-center gap-2.5 rounded-full bg-secondary px-4">
      <Search size={18} color={colors.mutedForeground} />
      <TextInput
        placeholderTextColor={colors.mutedForeground}
        // Auto-height (no h-full) + a tight glyph box (no font padding, no vertical
        // padding), centered by the row's items-center. This is the reliable way to
        // vertically center a single-line TextInput on Android — textAlignVertical
        // is multiline-only, so it can't center this.
        style={{ includeFontPadding: false, paddingTop: 1, paddingBottom: 0 }}
        className={cn('flex-1 font-sans text-base text-foreground', className)}
        {...props}
      />
    </View>
  );
}

export { SearchInput };
