import { cn } from '@repo/utils';
import { Search } from 'lucide-react-native';
import type { TextInputProps } from 'react-native';
import { useThemeColors } from '@/shared/theme';
import { InputBase } from './input-base';

// Pill search field (handoff §5): 44px, rounded-full, secondary fill, leading
// icon. InputBase boxes the icon and input as flex-row items-center siblings, so
// the icon and text/placeholder share one vertically-centred lane.
function SearchInput({ className, ...props }: TextInputProps) {
  const colors = useThemeColors();
  return (
    <InputBase
      left={<Search size={18} color={colors.mutedForeground} />}
      containerClassName="h-11 gap-2.5 rounded-full bg-secondary px-4"
      className={cn('font-sans', className)}
      {...props}
    />
  );
}

export { SearchInput };
