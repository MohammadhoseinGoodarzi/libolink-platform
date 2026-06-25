import { useDictionary } from '@repo/i18n';
import { formatCompactNumber } from '@repo/utils';
import { ChevronRight } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { Avatar, Text } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import type { ClubListRowProps } from '../types';
import { ClubLogo } from './club-logo';

// One normalised directory row (handoff §6.5) — shared by search results and the
// "see all" list. Authors show a round avatar; every other kind a square logo.
// Publishers count followers; everyone else counts members.
function ClubListRow({ item, onOpen }: ClubListRowProps) {
  const t = useDictionary('Clubs');
  const colors = useThemeColors();
  const unit = item.kind === 'publisher' ? t('followers') : t('members');
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={item.name}
      onPress={() => onOpen(item.id)}
      className="flex-row items-center gap-3 px-[18px] py-2.5 active:opacity-70"
    >
      {item.avatar ? (
        <Avatar initials={item.avatar.initials} hue={item.avatar.hue} name={item.name} size={46} />
      ) : (
        <ClubLogo label={item.logo} icon={item.icon} tone={item.tone} size={46} radius={14} />
      )}
      <View className="min-w-0 flex-1">
        <Text numberOfLines={1} className="font-sans-bold text-[14.5px] text-foreground">
          {item.name}
        </Text>
        <Text className="mt-0.5 font-sans text-[12px] text-muted-foreground">
          {formatCompactNumber(item.count)} {unit}
        </Text>
      </View>
      <ChevronRight size={18} color={colors.mutedForeground} />
    </Pressable>
  );
}

export { ClubListRow };
