import { useDictionary } from '@repo/i18n';
import { ArrowRight, BookOpen, Check } from 'lucide-react-native';
import { Fragment } from 'react';
import { ScrollView, View } from 'react-native';
import { BookCover, Card, Stars, Text, useToast } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import type { ReadingJourneyProps } from '../types';
import { CoverCard } from './cover-card';
import { ProgressBar } from './progress-bar';
import { Section } from './section';

// Reading journey (handoff §6.4): currently-reading cards with progress, an
// "Up Next" card, and a recently-finished carousel.
function ReadingJourney({ currentlyReading, upNext, recentlyFinished }: ReadingJourneyProps) {
  const t = useDictionary('Profile');
  const tCommon = useDictionary('Common');
  const colors = useThemeColors();
  const toast = useToast();
  const upNextTone = upNext.tone == null ? {} : { tone: upNext.tone };

  return (
    <Fragment>
      <Section title={t('currentlyReading')} icon={BookOpen}>
        <View className="gap-3 px-4">
          {currentlyReading.map((b) => {
            const tone = b.tone == null ? {} : { tone: b.tone };
            return (
              <Card key={b.title} className="p-4">
                <View className="flex-row gap-3.5">
                  <BookCover title={b.title} author={b.author} width={60} radius={12} {...tone} />
                  <View className="flex-1 justify-center">
                    <Text className="font-sans-bold text-[15.5px] leading-[19px] text-foreground">
                      {b.title}
                    </Text>
                    <Text className="mt-0.5 font-sans text-[12.5px] text-muted-foreground">
                      {b.author}
                    </Text>
                    <View className="mt-3">
                      <ProgressBar pct={b.pct} />
                      <View className="mt-1.5 flex-row justify-between">
                        <Text className="font-sans-semibold text-[11.5px] text-primary">
                          {b.pct}%
                        </Text>
                        <Text className="font-sans text-[11.5px] text-muted-foreground">
                          {t('pageLabel')} {b.page} {t('ofLabel')} {b.pages}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </Card>
            );
          })}

          {/* up next */}
          <Card
            shadow={false}
            className="flex-row items-center gap-3.5 border border-border border-dashed p-4"
          >
            <BookCover
              title={upNext.title}
              author={upNext.author}
              width={52}
              radius={12}
              {...upNextTone}
            />
            <View className="flex-1">
              <Text className="font-sans-bold text-[10.5px] uppercase tracking-wide text-link">
                {t('upNext')}
              </Text>
              <Text className="mt-0.5 font-sans-bold text-[15px] leading-[18px] text-foreground">
                {upNext.title}
              </Text>
              <Text className="mt-0.5 font-sans text-[12.5px] text-muted-foreground">
                {upNext.author} · {upNext.note}
              </Text>
            </View>
            <View className="h-[34px] w-[34px] items-center justify-center rounded-full bg-primary">
              <ArrowRight size={17} color={colors.primaryForeground} />
            </View>
          </Card>
        </View>
      </Section>

      <Section
        title={t('recentlyFinished')}
        icon={Check}
        action={t('seeAll')}
        onAction={() => toast.show(tCommon('comingSoon'))}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-3 px-4 pb-1"
        >
          {recentlyFinished.map((b, i) => (
            <CoverCard
              key={`${b.title}-${i}`}
              title={b.title}
              author={b.author}
              tone={b.tone}
              width={102}
            >
              {b.rating != null ? (
                <View className="mt-1.5">
                  <Stars count={b.rating} size={11} />
                </View>
              ) : null}
            </CoverCard>
          ))}
        </ScrollView>
      </Section>
    </Fragment>
  );
}

export { ReadingJourney };
