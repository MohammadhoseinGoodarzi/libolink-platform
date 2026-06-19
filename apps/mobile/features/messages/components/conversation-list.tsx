import { type MessageKey, useDictionary } from '@repo/i18n';
import type { Conversation } from '@repo/types';
import { useRouter } from 'expo-router';
import { Lock, Pin } from 'lucide-react-native';
import { Fragment, useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { Button, FilterChip, SearchInput, SponsoredCard, Text } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import { useConversations } from '../hooks/use-conversations';
import { MESSAGES_AD } from '../services/messages-data';
import type { FilterKey } from '../types';
import { ConversationRow } from './conversation-row';

const FILTERS: { key: FilterKey; labelKey: MessageKey<'Messages'> }[] = [
  { key: 'all', labelKey: 'filterAll' },
  { key: 'unread', labelKey: 'filterUnread' },
  { key: 'friends', labelKey: 'filterFriends' },
  { key: 'clubs', labelKey: 'filterClubs' },
];

function matchesFilter(c: Conversation, filter: FilterKey): boolean {
  if (filter === 'unread') {
    return c.unreadCount > 0;
  }
  if (filter === 'friends') {
    return c.kind === 'dm';
  }
  if (filter === 'clubs') {
    return c.kind === 'club';
  }
  return true;
}

function SectionLabel({ icon, children }: { icon?: React.ReactNode; children: string }) {
  return (
    <View className="flex-row items-center gap-1.5 px-4 pt-3.5 pb-1.5">
      {icon}
      <Text className="font-sans-bold text-[12.5px] uppercase tracking-wide text-muted-foreground">
        {children}
      </Text>
    </View>
  );
}

// Messages list (handoff §6.3): big title + unread count, search, filter chips,
// Pinned / All Messages sections, a Sponsored card at the list midpoint, and an
// end-to-end-encryption footer. Data flows through shared @repo/api via
// useConversations. Row tap pushes the chat screen.
export function ConversationList() {
  const t = useDictionary('Messages');
  const tCommon = useDictionary('Common');
  const colors = useThemeColors();
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useConversations();

  const [filter, setFilter] = useState<FilterKey>('all');
  const [query, setQuery] = useState('');

  const conversations = data?.items ?? [];
  const totalUnread = conversations.filter((c) => c.unreadCount > 0).length;

  const q = query.trim().toLowerCase();
  const filtered = conversations
    .filter((c) => matchesFilter(c, filter))
    .filter((c) => !q || c.title.toLowerCase().includes(q) || c.preview.toLowerCase().includes(q));
  const pinned = filtered.filter((c) => c.pinned);
  const rest = filtered.filter((c) => !c.pinned);
  const adAt = rest.length > 1 ? Math.floor(rest.length / 2) : -1;

  const open = (id: string) => router.push({ pathname: '/chat/[id]', params: { id } });

  return (
    <View className="flex-1 bg-background">
      {/* title + search + filters (fixed above the scrolling list) */}
      <View className="px-4 pt-1.5">
        <View className="mb-2 flex-row items-baseline gap-2">
          <Text className="font-sans-bold text-[27px] text-foreground">{t('title')}</Text>
          {totalUnread > 0 ? (
            <Text className="font-sans-semibold text-[13.5px] text-muted-foreground">
              {totalUnread} {t('unread')}
            </Text>
          ) : null}
        </View>
        <SearchInput
          value={query}
          onChangeText={setQuery}
          placeholder={t('searchPlaceholder')}
          autoCapitalize="none"
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-2 py-2.5"
        >
          {FILTERS.map((f) => (
            <FilterChip
              key={f.key}
              label={t(f.labelKey)}
              active={filter === f.key}
              count={f.key === 'unread' ? totalUnread : 0}
              onPress={() => setFilter(f.key)}
            />
          ))}
        </ScrollView>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : isError ? (
        <View className="flex-1 items-center justify-center gap-3 px-8">
          <Text className="text-center font-sans text-[14px] text-muted-foreground">
            {tCommon('genericError')}
          </Text>
          <Button variant="outline" size="sm" onPress={() => void refetch()}>
            {tCommon('retry')}
          </Button>
        </View>
      ) : filtered.length === 0 ? (
        <View className="flex-1 items-center justify-center px-10">
          <Text className="text-center font-sans text-[14px] text-muted-foreground">
            {filter === 'unread' ? t('emptyUnread') : t('emptyAll')}
          </Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-4">
          {pinned.length > 0 ? (
            <>
              <SectionLabel icon={<Pin size={13} color={colors.mutedForeground} />}>
                {t('pinned')}
              </SectionLabel>
              {pinned.map((c) => (
                <ConversationRow key={c.id} conversation={c} onOpen={open} />
              ))}
            </>
          ) : null}

          {rest.length > 0 ? (
            <>
              {pinned.length > 0 ? <SectionLabel>{t('allMessages')}</SectionLabel> : null}
              {rest.map((c, index) => (
                <Fragment key={c.id}>
                  <ConversationRow conversation={c} onOpen={open} />
                  {index === adAt ? (
                    <SponsoredCard
                      letter={MESSAGES_AD.letter}
                      title={MESSAGES_AD.title}
                      body={MESSAGES_AD.body}
                      cta={MESSAGES_AD.cta}
                    />
                  ) : null}
                </Fragment>
              ))}
            </>
          ) : null}

          <View className="flex-row items-center justify-center gap-1.5 px-6 pt-4 pb-2">
            <Lock size={13} color={colors.mutedForeground} />
            <Text className="text-center font-sans text-[11.5px] text-muted-foreground">
              {t('encrypted')}
            </Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
}
