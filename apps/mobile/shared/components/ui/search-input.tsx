import { cn } from '@repo/utils';
import { Search } from 'lucide-react-native';
import type { ComponentProps } from 'react';
import { TextInput, View } from 'react-native';
import { useThemeColors } from '@/shared/theme';

// Pill search field (handoff §5): 44px, rounded-full, secondary fill, left
// icon, body-gray placeholder.
function SearchInput({ className, ...props }: ComponentProps<typeof TextInput>) {
  const colors = useThemeColors();
  return (
    <View className="relative justify-center">
      <View className="absolute left-3.5 z-10">
        <Search size={18} color={colors.mutedForeground} />
      </View>
      <TextInput
        placeholderTextColor={colors.mutedForeground}
        className={cn(
          'h-11 rounded-full bg-secondary pl-11 pr-4 font-sans text-base text-foreground',
          className,
        )}
        {...props}
      />
    </View>
  );
}

export { SearchInput };
