import { useConversationList } from '@repo/hooks';
import { useDictionary } from '@repo/i18n';
import { cn, getInitials } from '@repo/utils';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Ban,
  Bell,
  BellOff,
  MessageCircle,
  UserRound,
  UsersRound,
} from 'lucide-react-native';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Avatar,
  BookCover,
  BrandGradient,
  IconButton,
  Text,
  useToast,
} from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import { useConversation } from '../hooks/use-conversations';
import { getContact } from '../services/contacts-data';
import { messagesClient } from '../services/messages-service';

const SECTION =
  'px-4 pb-1.5 font-sans-bold text-[12.5px] uppercase tracking-wide text-muted-foreground';

// Contact page (handoff §6.3, Telegram-style): big avatar + identity, quick
// actions (Message / Mute / Block), bio, mutual clubs, shared books, shared
// media. Opened from the chat header. Data is mocked via getContact for now.
export function ContactView({ id }: { id: string }) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colors = useThemeColors();
  const t = useDictionary('Contact');
  const tCommon = useDictionary('Common');
  const tMsg = useDictionary('Messages');
  const toast = useToast();
  const { conversation, isLoading, notFound } = useConversation(id);
  const { toggleMute } = useConversationList(messagesClient);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!conversation || notFound) {
    return (
      <View className="flex-1 items-center justify-center gap-3 bg-background px-8">
        <Text className="text-center font-sans text-[14px] text-muted-foreground">
          {tMsg('conversationNotFound')}
        </Text>
      </View>
    );
  }

  const contact = getContact(conversation);
  const muted = conversation.muted;

  const actions = [
    {
      key: 'message',
      label: t('message'),
      icon: MessageCircle,
      danger: false,
      onPress: () => router.back(),
    },
    {
      key: 'mute',
      label: muted ? t('unmute') : t('mute'),
      icon: muted ? Bell : BellOff,
      danger: false,
      onPress: () => toast.show(toggleMute(id) ? tMsg('muted') : tMsg('unmuted')),
    },
    {
      key: 'block',
      label: t('block'),
      icon: Ban,
      danger: true,
      onPress: () => toast.show(t('blocked')),
    },
  ];

  return (
    <View className="flex-1 bg-background">
      <View style={{ paddingTop: insets.top }} className="border-border border-b bg-background">
        <View className="h-14 flex-row items-center px-1">
          <IconButton accessibilityLabel={tCommon('back')} onPress={() => router.back()}>
            <ArrowLeft size={24} color={colors.primary} />
          </IconButton>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-10">
        {/* identity */}
        <View className="items-center px-6 pt-6 pb-5">
          <Avatar
            initials={getInitials(contact.name)}
            name={contact.name}
            size={96}
            online={contact.online}
          />
          <Text className="mt-3 font-sans-bold text-[22px] text-foreground">{contact.name}</Text>
          <Text className="mt-0.5 font-sans text-[13.5px] text-muted-foreground">
            {contact.handle}
          </Text>
          <Text
            className={cn(
              'mt-1 font-sans-medium text-[12.5px]',
              contact.online ? 'text-primary' : 'text-muted-foreground',
            )}
          >
            {contact.online ? t('online') : t('offline')}
          </Text>
        </View>

        {/* view full app profile (visitor mode) */}
        <View className="px-4 pb-4">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('viewProfile')}
            onPress={() => router.push({ pathname: '/reader/[id]', params: { id } })}
            className="h-12 flex-row items-center justify-center gap-2 rounded-2xl bg-primary active:opacity-90"
          >
            <UserRound size={18} color={colors.primaryForeground} />
            <Text
              className="font-sans-bold text-[15px]"
              style={{ color: colors.primaryForeground }}
            >
              {t('viewProfile')}
            </Text>
          </Pressable>
        </View>

        {/* quick actions */}
        <View className="flex-row justify-center gap-3 px-6 pb-5">
          {actions.map((a) => (
            <Pressable
              key={a.key}
              accessibilityRole="button"
              accessibilityLabel={a.label}
              onPress={a.onPress}
              className="w-[92px] items-center gap-1.5 rounded-2xl border border-border bg-card py-3 active:opacity-70"
            >
              <a.icon size={22} color={a.danger ? colors.destructive : colors.primary} />
              <Text
                className={cn(
                  'font-sans-semibold text-[12px]',
                  a.danger ? 'text-destructive' : 'text-primary',
                )}
              >
                {a.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* bio + username */}
        <View className="mx-4 rounded-2xl border border-border bg-card p-4">
          <Text className="font-sans-semibold text-[11.5px] uppercase tracking-wide text-muted-foreground">
            {t('bioLabel')}
          </Text>
          <Text className="mt-1.5 font-sans text-[14.5px] leading-[21px] text-foreground">
            {contact.bio}
          </Text>
          <View className="mt-3 border-border border-t pt-3">
            <Text className="font-sans-semibold text-[11.5px] uppercase tracking-wide text-muted-foreground">
              {t('usernameLabel')}
            </Text>
            <Text className="mt-1 font-sans-medium text-[14.5px] text-link">{contact.handle}</Text>
          </View>
        </View>

        {/* mutual clubs */}
        {contact.mutualClubs.length > 0 ? (
          <View className="mt-6">
            <Text className={SECTION}>{t('mutualClubs')}</Text>
            {contact.mutualClubs.map((club) => (
              <View key={club.id} className="flex-row items-center gap-3 px-4 py-2.5">
                <View className="h-11 w-11 items-center justify-center rounded-2xl bg-secondary">
                  <UsersRound size={20} color={colors.link} />
                </View>
                <View className="min-w-0 flex-1">
                  <Text className="font-sans-semibold text-[14.5px] text-foreground">
                    {club.name}
                  </Text>
                  {club.book ? (
                    <Text numberOfLines={1} className="font-sans text-[12px] text-muted-foreground">
                      {club.book}
                    </Text>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
        ) : null}

        {/* shared books */}
        {contact.sharedBooks.length > 0 ? (
          <View className="mt-6">
            <Text className={SECTION}>{t('sharedBooks')}</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="gap-3 px-4 pt-1"
            >
              {contact.sharedBooks.map((b) => (
                <BookCover key={b.title} title={b.title} author={b.author} width={64} radius={12} />
              ))}
            </ScrollView>
          </View>
        ) : null}

        {/* shared media */}
        {contact.sharedPhotos > 0 ? (
          <View className="mt-6">
            <View className="flex-row items-center justify-between pr-4">
              <Text className={SECTION}>{t('sharedMedia')}</Text>
              <Text className="font-sans text-[12px] text-muted-foreground">
                {contact.sharedPhotos} {t('photos')}
              </Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="gap-2 px-4 pt-1"
            >
              {Array.from({ length: contact.sharedPhotos }, (_, i) => i).map((i) => (
                <View key={`photo-${i}`} className="h-20 w-20 overflow-hidden rounded-xl">
                  <BrandGradient className="h-full w-full" />
                </View>
              ))}
            </ScrollView>
          </View>
        ) : null}

        {/* block */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('blockUser')}
          onPress={() => toast.show(t('blocked'))}
          className="mx-4 mt-6 flex-row items-center gap-2.5 rounded-2xl border border-border bg-card px-4 py-3.5 active:opacity-70"
        >
          <Ban size={18} color={colors.destructive} />
          <Text className="font-sans-semibold text-[14.5px] text-destructive">
            {t('blockUser')}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
