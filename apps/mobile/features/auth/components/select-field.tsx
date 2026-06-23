import { cn } from '@repo/utils';
import { ChevronDown } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { Text } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import type { SelectFieldProps } from '../types';

// Filled select that opens a PickerSheet (handoff auth kit).
export function SelectField({ label, value, placeholder, icon: Icon, onPress }: SelectFieldProps) {
  const colors = useThemeColors();
  return (
    <View>
      {label ? (
        <Text className="mb-1.5 font-sans-semibold text-[12px] uppercase tracking-wide text-muted-foreground">
          {label}
        </Text>
      ) : null}
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        className="h-[52px] flex-row items-center gap-2.5 rounded-2xl border border-border bg-secondary px-3.5 active:opacity-60"
      >
        {Icon ? <Icon size={19} color={colors.mutedForeground} /> : null}
        <Text
          numberOfLines={1}
          className={cn(
            'flex-1 font-sans-medium text-base',
            value ? 'text-foreground' : 'text-muted-foreground',
          )}
        >
          {value || placeholder}
        </Text>
        <ChevronDown size={18} color={colors.mutedForeground} />
      </Pressable>
    </View>
  );
}
