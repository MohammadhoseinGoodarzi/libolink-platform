import { useDictionary } from '@repo/i18n';
import { UsersRound } from 'lucide-react-native';
import { Pressable, ScrollView, View } from 'react-native';
import { Avatar, BookCover, Card, Text, useToast } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import type { MayKnowSectionProps } from '../types';
import { AddButton } from './add-button';
import { FriendsSection } from './friends-section';
import { MatchChip } from './match-chip';

// Readers You May Know (handoff Friends): suggestion carousel matched on books,
// authors and reading history.
function MayKnowSection({ readers, onOpen }: MayKnowSectionProps) {
  const t = useDictionary('Friends');
  const tCommon = useDictionary('Common');
  const colors = useThemeColors();
  const toast = useToast();
  return (
    <FriendsSection
      title={t('mayKnow')}
      sub={t('mayKnowSub')}
      action={t('seeAll')}
      onAction={() => toast.show(tCommon('comingSoon'))}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-3 px-5 pb-1"
      >
        {readers.map((reader) => (
          <Pressable
            key={reader.id}
            accessibilityRole="button"
            onPress={() => onOpen(reader)}
            className="w-[230px]"
          >
            <Card padded>
              <View className="flex-row items-start gap-3">
                <Avatar
                  initials={reader.initials}
                  hue={reader.hue}
                  size={50}
                  online={reader.online}
                />
                <View className="min-w-0 flex-1">
                  <Text numberOfLines={1} className="font-sans-bold text-[15px] text-foreground">
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

              {reader.score != null && reader.kind ? (
                <View className="mt-3">
                  <MatchChip score={reader.score} kind={reader.kind} />
                </View>
              ) : null}

              {reader.book ? (
                <View className="mt-3 flex-row items-center gap-2.5">
                  <BookCover
                    title={reader.book.title}
                    author={reader.book.author}
                    width={38}
                    tone={reader.book.tone}
                    radius={9}
                  />
                  <View className="min-w-0 flex-1">
                    <Text className="font-sans text-[10.5px] text-muted-foreground">
                      {t('favouriteBook')}
                    </Text>
                    <Text
                      numberOfLines={2}
                      className="mt-0.5 font-sans-semibold text-[12.5px] text-foreground"
                    >
                      {reader.book.title}
                    </Text>
                  </View>
                </View>
              ) : null}

              {reader.mutualFriends != null ? (
                <View className="mt-3 flex-row items-center gap-1.5">
                  <UsersRound size={13} color={colors.mutedForeground} />
                  <Text className="font-sans text-[11.5px] text-muted-foreground">
                    {reader.mutualFriends} {t('mutual')} · {reader.mutualClubs} {t('clubs')}
                  </Text>
                </View>
              ) : null}

              <View className="mt-3 flex-row gap-2.5">
                <Pressable
                  accessibilityRole="button"
                  onPress={() => onOpen(reader)}
                  className="h-9 flex-1 items-center justify-center rounded-full border border-border"
                >
                  <Text className="font-sans-semibold text-[12.5px] text-primary">
                    {t('profile')}
                  </Text>
                </Pressable>
                <AddButton name={reader.name} />
              </View>
            </Card>
          </Pressable>
        ))}
      </ScrollView>
    </FriendsSection>
  );
}

export { MayKnowSection };
