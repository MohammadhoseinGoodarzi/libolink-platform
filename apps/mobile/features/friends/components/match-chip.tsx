import { useDictionary } from '@repo/i18n';
import { View } from 'react-native';
import { Text } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import { matchColor, matchLabelKey } from '../lib/match';
import type { MatchChipProps } from '../types';

// Inline "{score}% {Match}" pill carrying the match flavour as a coloured dot +
// text (handoff Friends). Distinct from the shared Chip — its accent is dynamic.
function MatchChip({ score, kind }: MatchChipProps) {
  const t = useDictionary('Friends');
  const colors = useThemeColors();
  const col = matchColor(kind, colors);
  return (
    <View className="h-[22px] flex-row items-center gap-1.5 self-start rounded-full bg-secondary px-2.5">
      <View className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: col }} />
      <Text className="font-sans-semibold text-[11.5px]" style={{ color: col }}>
        {score}% {t(matchLabelKey(kind))}
      </Text>
    </View>
  );
}

export { MatchChip };
