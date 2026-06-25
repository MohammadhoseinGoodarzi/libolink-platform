import { useDictionary } from '@repo/i18n';
import { formatCompactNumber } from '@repo/utils';
import { ChevronRight } from 'lucide-react-native';
import { Pressable, ScrollView, View } from 'react-native';
import { Card, Text } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import type { PublisherSectionProps } from '../types';
import { ClubLogo } from './club-logo';
import { ClubsSection } from './section';

// Publisher Communities (handoff §6.5): a carousel of the houses behind the books.
function PublisherSection({ publishers, onSeeAll, onOpen }: PublisherSectionProps) {
  const t = useDictionary('Clubs');
  const colors = useThemeColors();
  return (
    <ClubsSection
      title={t('publishers')}
      sub={t('publishersSub')}
      action={t('seeAll')}
      onAction={onSeeAll}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-3 px-[18px] pb-1"
      >
        {publishers.map((c) => (
          <Pressable
            key={c.id}
            accessibilityRole="button"
            accessibilityLabel={c.name}
            onPress={() => onOpen(c.id)}
            className="active:opacity-70"
          >
            <Card className="w-[230px] flex-row items-center gap-3 p-4">
              <ClubLogo label={c.logo} tone={c.tone} size={48} radius={14} />
              <View className="min-w-0 flex-1">
                <Text
                  numberOfLines={2}
                  className="font-sans-bold text-[14.5px] leading-[18px] text-foreground"
                >
                  {c.name}
                </Text>
                <Text className="mt-0.5 font-sans text-[12px] text-muted-foreground">
                  {formatCompactNumber(c.followers)} {t('followers')}
                </Text>
              </View>
              <ChevronRight size={18} color={colors.mutedForeground} />
            </Card>
          </Pressable>
        ))}
      </ScrollView>
    </ClubsSection>
  );
}

export { PublisherSection };
