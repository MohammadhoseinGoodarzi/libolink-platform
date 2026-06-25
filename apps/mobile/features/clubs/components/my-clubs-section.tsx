import { useDictionary } from '@repo/i18n';
import { formatCompactNumber } from '@repo/utils';
import { Check, ChevronRight } from 'lucide-react-native';
import { Pressable, ScrollView, View } from 'react-native';
import { Card, Text } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import type { MyClubsSectionProps } from '../types';
import { ClubLogo } from './club-logo';
import { ClubsSection } from './section';

// My Clubs (handoff §6.5): a carousel of the reader's own communities, each with
// a static "Joined" chip.
function MyClubsSection({ clubs, onSeeAll, onOpen }: MyClubsSectionProps) {
  const t = useDictionary('Clubs');
  const colors = useThemeColors();
  return (
    <ClubsSection
      title={t('myClubs')}
      sub={t('myClubsSub')}
      action={t('seeAll')}
      onAction={onSeeAll}
      first
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-3 px-[18px] pb-1"
      >
        {clubs.map((c) => (
          <Pressable
            key={c.id}
            accessibilityRole="button"
            accessibilityLabel={c.name}
            onPress={() => onOpen(c.id)}
            className="active:opacity-70"
          >
            <Card className="w-[200px] p-4">
              <View className="flex-row items-center justify-between">
                <ClubLogo label={c.logo} tone={c.tone} size={50} radius={16} />
                <ChevronRight size={18} color={colors.mutedForeground} />
              </View>
              <Text
                numberOfLines={2}
                style={{ minHeight: 38 }}
                className="mt-3 font-sans-bold text-[15.5px] leading-[19px] text-foreground"
              >
                {c.name}
              </Text>
              <Text className="mt-1 font-sans text-[12px] text-muted-foreground">
                {formatCompactNumber(c.members)} {t('members')}
              </Text>
              <View className="mt-3 h-[26px] flex-row items-center gap-1 self-start rounded-full bg-secondary px-2.5">
                <Check size={14} color={colors.primary} />
                <Text className="font-sans-semibold text-[12px] text-primary">{t('joined')}</Text>
              </View>
            </Card>
          </Pressable>
        ))}
      </ScrollView>
    </ClubsSection>
  );
}

export { MyClubsSection };
