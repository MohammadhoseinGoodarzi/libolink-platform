import { useConversationList } from '@repo/hooks';
import { useDictionary } from '@repo/i18n';
import { cn, getInitials } from '@repo/utils';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Ban,
  Bell,
  BellOff,
  Copy,
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
  Card,
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
  const { toggleMute, toggleBlock } = useConversationList(messagesClient);

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
  const blocked = conversation.blocked;
  // DMs open a reader profile; clubs and communities are both clubs (not people),
  // so they share the "View Club" label and open the community detail page.
  const isCommunity = conversation.kind !== 'dm';
  const profileLabel = isCommunity ? t('viewClub') : t('viewProfile');
  const openProfile = () => {
    if (isCommunity) {
      // Clubs/communities open the community detail page (handoff §6.5 phase-2).
      router.push({ pathname: '/club/[id]', params: { id } });
      return;
    }
    // The reader route resolves the profile by handle (api.byHandle), so pass the
    // profile handle — not the conversation id.
    router.push({ pathname: '/reader/[id]', params: { id: contact.handle } });
  };

  const copyHandle = () => {
    void Clipboard.setStringAsync(contact.handle);
    toast.show(t('copied'));
  };

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
      label: blocked ? t('unblock') : t('block'),
      icon: Ban,
      danger: true,
      onPress: () => toast.show(toggleBlock(id) ? t('blocked') : t('unblocked')),
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 28 }}
      >
        {/* identity */}
        <View className="items-center px-6 pt-6 pb-5">
          <Avatar
            initials={getInitials(contact.name)}
            name={contact.name}
            size={96}
            online={contact.online}
          />
          <Text className="mt-3 font-sans-bold text-[22px] text-foreground">{contact.name}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('copyUsername')}
            onPress={copyHandle}
            className="mt-0.5 flex-row items-center gap-1 active:opacity-60"
          >
            <Text className="font-sans text-[13.5px] text-muted-foreground">{contact.handle}</Text>
            <Copy size={13} color={colors.mutedForeground} />
          </Pressable>
          <Text
            className={cn(
              'mt-1 font-sans-medium text-[12.5px]',
              contact.online ? 'text-primary' : 'text-muted-foreground',
            )}
          >
            {contact.online ? t('online') : t('offline')}
          </Text>
        </View>

        {/* blocked banner */}
        {blocked ? (
          <View className="mx-4 mb-3 flex-row items-center gap-2 rounded-2xl bg-destructive/10 px-4 py-3">
            <Ban size={16} color={colors.destructive} />
            <Text className="flex-1 font-sans-medium text-[13px] text-destructive">
              {t('blockedBanner')}
            </Text>
          </View>
        ) : null}

        {/* view full profile (DM) / club / community */}
        <View className="px-4 pb-4">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={profileLabel}
            onPress={openProfile}
            className="h-12 flex-row items-center justify-center gap-2 rounded-2xl bg-primary active:opacity-90"
          >
            {isCommunity ? (
              <UsersRound size={18} color={colors.primaryForeground} />
            ) : (
              <UserRound size={18} color={colors.primaryForeground} />
            )}
            <Text
              className="font-sans-bold text-[15px]"
              style={{ color: colors.primaryForeground }}
            >
              {profileLabel}
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
        <Card variant="flat" padded className="mx-4">
          <Text className="font-sans-semibold text-[11.5px] uppercase tracking-wide text-muted-foreground">
            {t('bioLabel')}
          </Text>
          <Text className="mt-1.5 font-sans text-[14.5px] leading-[21px] text-foreground">
            {contact.bio}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('copyUsername')}
            onPress={copyHandle}
            className="mt-3 border-border border-t pt-3 active:opacity-60"
          >
            <Text className="font-sans-semibold text-[11.5px] uppercase tracking-wide text-muted-foreground">
              {t('usernameLabel')}
            </Text>
            <View className="mt-1 flex-row items-center gap-1.5">
              <Text className="font-sans-medium text-[14.5px] text-link">{contact.handle}</Text>
              <Copy size={14} color={colors.link} />
            </View>
          </Pressable>
        </Card>

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

        {/* block / unblock */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={blocked ? t('unblockUser') : t('blockUser')}
          onPress={() => toast.show(toggleBlock(id) ? t('blocked') : t('unblocked'))}
          className="mx-4 mt-6 flex-row items-center gap-2.5 rounded-2xl border border-border bg-card px-4 py-3.5 active:opacity-70"
        >
          <Ban size={18} color={colors.destructive} />
          <Text className="font-sans-semibold text-[14.5px] text-destructive">
            {blocked ? t('unblockUser') : t('blockUser')}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
