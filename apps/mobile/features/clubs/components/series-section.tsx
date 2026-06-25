import { useDictionary } from '@repo/i18n';
import { formatCompactNumber } from '@repo/utils';
import { Pressable, ScrollView, View } from 'react-native';
import { Text } from '@/shared/components/ui';
import { useShadow } from '@/shared/theme';
import type { SeriesSectionProps } from '../types';
import { ClubBanner } from './club-banner';
import { ClubsSection } from './section';

// Book Series Fan Clubs (handoff §6.5): tall gradient posters with a legibility
// scrim and the club name + member count overlaid.
function SeriesSection({ series, onSeeAll, onOpen }: SeriesSectionProps) {
  const t = useDictionary('Clubs');
  const shadow = useShadow('card');
  return (
    <ClubsSection title={t('series')} sub={t('seriesSub')} action={t('seeAll')} onAction={onSeeAll}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-3 px-[18px] pb-1"
      >
        {series.map((c) => (
          <Pressable
            key={c.id}
            accessibilityRole="button"
            accessibilityLabel={c.name}
            onPress={() => onOpen(c.id)}
            style={shadow}
            className="w-[164px] rounded-lg active:opacity-80"
          >
            <ClubBanner tone={c.tone} icon={c.icon} height={206} radius={20}>
              <View
                className="absolute inset-x-0 bottom-0 px-3.5 pt-9 pb-3.5"
                style={{ backgroundColor: 'rgba(0,0,0,0.42)' }}
              >
                <Text
                  numberOfLines={2}
                  className="font-sans-bold text-[15.5px] leading-[19px] text-white"
                >
                  {c.name}
                </Text>
                <Text
                  style={{ color: 'rgba(255,255,255,0.82)' }}
                  className="mt-0.5 font-sans text-[11.5px]"
                >
                  {formatCompactNumber(c.members)} {t('members')}
                </Text>
              </View>
            </ClubBanner>
          </Pressable>
        ))}
      </ScrollView>
    </ClubsSection>
  );
}

export { SeriesSection };
