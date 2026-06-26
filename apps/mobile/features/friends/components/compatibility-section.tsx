import { useDictionary } from '@repo/i18n';
import { BookOpen } from 'lucide-react-native';
import { Pressable, ScrollView, View } from 'react-native';
import { Card, Chip, Text } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import { matchColor, matchLabelKey } from '../lib/match';
import type { CompatibilitySectionProps } from '../types';
import { AddButton } from './add-button';
import { FriendsSection } from './friends-section';
import { MatchRing } from './match-ring';

// Reader Compatibility (handoff Friends): the signature carousel of the reader's
// strongest literary matches, each scored with the match ring + shared book.
function CompatibilitySection({ matches, onOpen }: CompatibilitySectionProps) {
  const t = useDictionary('Friends');
  const colors = useThemeColors();
  return (
    <FriendsSection title={t('compatibility')} sub={t('compatibilitySub')}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-3 px-5 pb-1"
      >
        {matches.map((reader) => {
          const kind = reader.kind ?? 'reading';
          return (
            <Pressable
              key={reader.id}
              accessibilityRole="button"
              onPress={() => onOpen(reader)}
              className="w-[258px]"
            >
              <Card padded>
                <View className="flex-row items-center gap-3.5">
                  <MatchRing score={reader.score ?? 0} kind={kind} size={62} />
                  <View className="min-w-0 flex-1">
                    <Text
                      numberOfLines={1}
                      className="font-sans-bold text-[12px] uppercase"
                      style={{ color: matchColor(kind, colors) }}
                    >
                      {t(matchLabelKey(kind))}
                    </Text>
                    <Text
                      numberOfLines={1}
                      className="mt-0.5 font-sans-bold text-[16.5px] text-foreground"
                    >
                      {reader.name}
                    </Text>
                    <Text
                      numberOfLines={1}
                      className="mt-0.5 font-sans text-[12px] text-muted-foreground"
                    >
                      {reader.role}
                    </Text>
                  </View>
                </View>

                {reader.sharedBook ? (
                  <View className="mt-3.5 rounded-2xl bg-secondary p-3">
                    <View className="flex-row items-center gap-1.5">
                      <BookOpen size={14} color={colors.mutedForeground} />
                      <Text className="font-sans text-[11.5px] text-muted-foreground">
                        {t('bothLove')}
                      </Text>
                    </View>
                    <Text
                      numberOfLines={2}
                      className="mt-1 font-sans-semibold text-[13.5px] text-foreground"
                    >
                      {reader.sharedBook}
                    </Text>
                  </View>
                ) : null}

                {reader.basis ? (
                  <View className="mt-3 flex-row flex-wrap gap-1.5">
                    {reader.basis.map((reason) => (
                      <Chip key={reason} label={reason} tone="accent" size="sm" />
                    ))}
                  </View>
                ) : null}

                <View className="mt-4 flex-row gap-2.5">
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => onOpen(reader)}
                    className="h-[38px] flex-1 items-center justify-center rounded-full border border-border"
                  >
                    <Text className="font-sans-semibold text-[13px] text-primary">
                      {t('profile')}
                    </Text>
                  </Pressable>
                  <AddButton name={reader.name} size="md" />
                </View>
              </Card>
            </Pressable>
          );
        })}
      </ScrollView>
    </FriendsSection>
  );
}

export { CompatibilitySection };
