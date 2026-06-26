import { useDictionary } from '@repo/i18n';
import { formatCompactNumber } from '@repo/utils';
import { ChevronRight, Film } from 'lucide-react-native';
import { Pressable, ScrollView, View } from 'react-native';
import { BookCover, Card, Chip, Text } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import type { AdaptationsSectionProps } from '../types';
import { ClubsSection } from './section';

// Books On Screen (handoff §6.5): book cover + a screen tag (film/TV) + members.
function AdaptationsSection({ adaptations, onSeeAll, onOpen }: AdaptationsSectionProps) {
  const t = useDictionary('Clubs');
  const colors = useThemeColors();
  return (
    <ClubsSection
      title={t('adaptations')}
      sub={t('adaptationsSub')}
      action={t('seeAll')}
      onAction={onSeeAll}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-3 px-[18px] pb-1"
      >
        {adaptations.map((c) => (
          <Pressable
            key={c.id}
            accessibilityRole="button"
            accessibilityLabel={c.name}
            onPress={() => onOpen(c.id)}
            className="active:opacity-70"
          >
            <Card className="w-[240px] flex-row gap-3 p-4">
              <BookCover
                title={c.book}
                author={c.author}
                width={64}
                tone={c.bookTone}
                radius={12}
              />
              <View className="min-w-0 flex-1">
                <Text
                  numberOfLines={2}
                  className="font-sans-bold text-[15px] leading-[18px] text-foreground"
                >
                  {c.name}
                </Text>
                <Chip
                  label={c.screen}
                  icon={Film}
                  iconSize={13}
                  tone="accent"
                  size="sm"
                  className="mt-2 self-start"
                />
                <View className="mt-auto flex-row items-center justify-between pt-3">
                  <Text className="font-sans text-[12px] text-muted-foreground">
                    {formatCompactNumber(c.members)} {t('members')}
                  </Text>
                  <ChevronRight size={18} color={colors.mutedForeground} />
                </View>
              </View>
            </Card>
          </Pressable>
        ))}
      </ScrollView>
    </ClubsSection>
  );
}

export { AdaptationsSection };
