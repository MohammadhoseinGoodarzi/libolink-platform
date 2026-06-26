import { useDictionary } from '@repo/i18n';
import { useRouter } from 'expo-router';
import { MapPin, MessageCircle, User, UserMinus, UserPlus } from 'lucide-react-native';
import { Pressable, ScrollView, useWindowDimensions, View } from 'react-native';
import { Avatar, BookCover, BottomSheet, Card, Chip, Text, useToast } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import { matchLabelKey } from '../lib/match';
import type { ReaderSheetProps } from '../types';

// Reader preview (handoff Friends): a bottom-sheet profile card with the match
// score, shared literary ground, why-you-match reasons, mutual stats, and the
// connect/message actions (friend mode vs discover mode).
function ReaderSheet({ reader, open, onClose }: ReaderSheetProps) {
  const t = useDictionary('Friends');
  const colors = useThemeColors();
  const router = useRouter();
  const toast = useToast();
  const { height } = useWindowDimensions();

  const goMessages = () => {
    onClose();
    router.push('/messages');
  };
  const goProfile = () => {
    onClose();
    router.push('/profile');
  };

  const bookTitle = reader?.sharedBook ?? reader?.book?.title ?? '';
  const stats = reader
    ? [
        { value: reader.mutualFriends, label: t('mutualReaders') },
        { value: reader.mutualClubs, label: t('sharedClubs') },
        { value: reader.sharedBooks, label: t('sharedBooks') },
      ].filter((s): s is { value: number; label: string } => s.value != null)
    : [];

  return (
    <BottomSheet open={open} onClose={onClose} label={t('readerProfile')}>
      {reader ? (
        <ScrollView style={{ maxHeight: height * 0.72 }} showsVerticalScrollIndicator={false}>
          <View className="flex-row items-center gap-4 bg-primary px-5 py-5">
            <Avatar initials={reader.initials} hue={reader.hue} size={72} online={reader.online} />
            <View className="min-w-0 flex-1">
              <Text
                numberOfLines={1}
                className="font-sans-bold text-[20px] text-primary-foreground"
              >
                {reader.name}
              </Text>
              <Text
                numberOfLines={1}
                className="mt-1 font-sans text-[13px] text-primary-foreground/60"
              >
                {reader.role}
              </Text>
              {reader.country ? (
                <View className="mt-1.5 flex-row items-center gap-1.5">
                  <MapPin size={13} color={colors.primaryForeground} />
                  <Text className="font-sans text-[12.5px] text-primary-foreground/60">
                    {reader.country}
                  </Text>
                </View>
              ) : null}
            </View>
            {reader.score != null ? (
              <Text className="font-sans-bold text-[22px] text-primary-foreground">
                {reader.score}%
              </Text>
            ) : null}
          </View>

          <View className="px-5 pb-5">
            {reader.score != null && reader.kind ? (
              <Text className="mt-4 text-center font-sans-semibold text-[13px] text-link">
                {reader.score}% {t(matchLabelKey(reader.kind))} {t('withYou')}
              </Text>
            ) : null}

            {bookTitle ? (
              <View className="mt-4">
                <Text className="font-sans-bold text-[15.5px] text-foreground">
                  {t('sharedGround')}
                </Text>
                <Card variant="flat" padded className="mt-2.5 flex-row items-center gap-3.5">
                  <BookCover
                    title={bookTitle}
                    author={reader.book?.author ?? ''}
                    width={52}
                    tone={reader.book?.tone ?? 0}
                    radius={12}
                  />
                  <View className="min-w-0 flex-1">
                    <Text className="font-sans text-[11px] text-muted-foreground">
                      {reader.sharedBook ? t('youBothLove') : t('favouriteBook')}
                    </Text>
                    <Text
                      numberOfLines={2}
                      className="mt-0.5 font-sans-bold text-[15px] text-foreground"
                    >
                      {bookTitle}
                    </Text>
                    {reader.book?.author ? (
                      <Text className="mt-0.5 font-sans text-[12.5px] text-muted-foreground">
                        {reader.book.author}
                      </Text>
                    ) : null}
                  </View>
                </Card>
              </View>
            ) : null}

            {reader.basis ? (
              <View className="mt-4">
                <Text className="font-sans-bold text-[15.5px] text-foreground">
                  {t('whyMatch')}
                </Text>
                <View className="mt-2.5 flex-row flex-wrap gap-2">
                  {reader.basis.map((reason) => (
                    <Chip key={reason} label={reason} tone="accent" />
                  ))}
                </View>
              </View>
            ) : null}

            {stats.length > 0 ? (
              <View className="mt-4 flex-row gap-2.5">
                {stats.map((stat) => (
                  <Card key={stat.label} variant="flat" padded className="flex-1 items-center">
                    <Text className="font-sans-bold text-[18px] text-foreground">{stat.value}</Text>
                    <Text className="mt-0.5 text-center font-sans text-[10.5px] text-muted-foreground">
                      {stat.label}
                    </Text>
                  </Card>
                ))}
              </View>
            ) : null}

            <View className="mt-5 flex-row gap-2.5">
              {reader.isFriend ? (
                <>
                  <Pressable
                    accessibilityRole="button"
                    onPress={goProfile}
                    className="h-[52px] flex-1 flex-row items-center justify-center gap-1.5 rounded-2xl border border-border"
                  >
                    <User size={18} color={colors.primary} />
                    <Text className="font-sans-semibold text-[14.5px] text-primary">
                      {t('profile')}
                    </Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    onPress={goMessages}
                    className="h-[52px] flex-1 flex-row items-center justify-center gap-2 rounded-2xl bg-destructive"
                  >
                    <MessageCircle size={19} color={colors.destructiveForeground} />
                    <Text className="font-sans-bold text-[15px] text-destructive-foreground">
                      {t('message')}
                    </Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={t('removeFriend')}
                    onPress={() => {
                      onClose();
                      toast.show(t('removedFriend'));
                    }}
                    className="h-[52px] w-14 items-center justify-center rounded-2xl border border-border"
                  >
                    <UserMinus size={20} color={colors.destructive} />
                  </Pressable>
                </>
              ) : (
                <>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => {
                      onClose();
                      toast.show(t('requestSent'));
                    }}
                    className="h-[52px] flex-1 flex-row items-center justify-center gap-2 rounded-2xl bg-destructive"
                  >
                    <UserPlus size={19} color={colors.destructiveForeground} />
                    <Text className="font-sans-bold text-[15px] text-destructive-foreground">
                      {t('addFriend')}
                    </Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={t('message')}
                    onPress={goMessages}
                    className="h-[52px] w-14 items-center justify-center rounded-2xl border border-border"
                  >
                    <MessageCircle size={20} color={colors.primary} />
                  </Pressable>
                </>
              )}
            </View>
          </View>
        </ScrollView>
      ) : null}
    </BottomSheet>
  );
}

export { ReaderSheet };
