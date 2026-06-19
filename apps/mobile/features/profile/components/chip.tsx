import { View } from 'react-native';
import { Text } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import type { ChipProps } from '../types';

// Static display chip (handoff §6.4) — interests, genres, languages. Distinct
// from the interactive FilterChip atom; this one never toggles.
function Chip({ label, icon: Icon }: ChipProps) {
  const colors = useThemeColors();
  return (
    <View className="h-8 flex-row items-center gap-1.5 rounded-full bg-secondary px-3">
      {Icon ? <Icon size={14} color={colors.foreground} /> : null}
      <Text className="font-sans-medium text-[12.5px] text-foreground">{label}</Text>
    </View>
  );
}

export { Chip };
