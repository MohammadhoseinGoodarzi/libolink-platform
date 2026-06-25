import { useConversationList } from '@repo/hooks';
import { useDictionary } from '@repo/i18n';
import type { ChatMessage } from '@repo/types';
import { getInitials } from '@repo/utils';
import { useRouter } from 'expo-router';
import { Ban, ChevronDown, Lock } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar, BookCover, Button, Text } from '@/shared/components/ui';
import { useShadow, useThemeColors } from '@/shared/theme';
import { useConversation, useThread } from '../hooks/use-conversations';
import { messagesClient } from '../services/messages-service';
import { REPLY_SNIPPETS } from '../services/thread-data';
import type { ChatViewProps } from '../types';
import { ChatComposer } from './chat-composer';
import { ChatHeader } from './chat-header';
import { MessageRow } from './message-row';

// Chat detail (handoff §6.3): header, end-to-end-encryption banner, the thread
// (or a "say hello" empty state), and the composer. Data flows through the
// shared @repo/api thread factory; sent messages append locally for now. The
// long-press menu and share-in-chat sheet land in phase-2.
export function ChatView({ id, seed }: ChatViewProps) {
  const router = useRouter();
  const t = useDictionary('Messages');
  const tCommon = useDictionary('Common');
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { conversation, isLoading: conversationLoading } = useConversation(id, seed);
  const { toggleBlock } = useConversationList(messagesClient);
  const thread = useThread(id);
  const scrollRef = useRef<ScrollView>(null);
  const shadow = useShadow('card');
  const [sent, setSent] = useState<ChatMessage[]>([]);
  const [theyTyping, setTheyTyping] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Show the jump-to-latest button once scrolled a screenful up from the bottom.
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const fromBottom = contentSize.height - (contentOffset.y + layoutMeasurement.height);
    setShowScrollDown(fromBottom > 240);
  };

  // Clear any pending typing/reply timers on unmount.
  useEffect(() => {
    const pending = timers.current;
    return () => {
      for (const id of pending) {
        clearTimeout(id);
      }
    };
  }, []);

  const messages: ChatMessage[] = [...(thread.data ?? []), ...sent];
  const isEmpty = !thread.isLoading && messages.length === 0;

  const send = (text: string) => {
    setSent((prev) => [
      ...prev,
      { id: `u${Date.now()}`, kind: 'text', from: 'me', time: t('now'), read: false, text },
    ]);
    // Simulate the peer typing, then replying (no backend yet) so the thread
    // feels alive. Swap for real presence/messages when the backend exists.
    const typing = setTimeout(() => setTheyTyping(true), 700);
    const reply = setTimeout(() => {
      setTheyTyping(false);
      const snippet = REPLY_SNIPPETS[Math.floor(Math.random() * REPLY_SNIPPETS.length)] ?? '👍';
      setSent((prev) => [
        ...prev,
        { id: `t${Date.now()}`, kind: 'text', from: 'them', time: t('now'), text: snippet },
      ]);
    }, 2600);
    timers.current.push(typing, reply);
  };

  if (conversationLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!conversation) {
    return (
      <View className="flex-1 items-center justify-center gap-3 bg-background px-8">
        <Text className="text-center font-sans text-[14px] text-muted-foreground">
          {t('conversationNotFound')}
        </Text>
        <Button variant="outline" size="sm" onPress={() => router.back()}>
          {tCommon('back')}
        </Button>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ChatHeader
        conversation={conversation}
        onBack={() => router.back()}
        typing={theyTyping}
        onOpenProfile={() =>
          // Keyed by the conversation id: a DM opens the contact page (/user/[id]
          // = ContactView, which itself links on to the full reader profile), a
          // club/group opens the community detail.
          conversation.kind === 'dm'
            ? router.push({ pathname: '/user/[id]', params: { id } })
            : router.push({ pathname: '/club/[id]', params: { id } })
        }
      />

      {isEmpty ? (
        <View className="flex-1 items-center justify-center gap-3 px-8">
          {conversation.kind === 'club' && conversation.book ? (
            <BookCover title={conversation.book.title} width={56} radius={14} />
          ) : (
            <Avatar
              initials={getInitials(conversation.title)}
              name={conversation.title}
              size={68}
              group={conversation.kind === 'group'}
            />
          )}
          <Text className="font-sans-bold text-[16px] text-foreground">{conversation.title}</Text>
          <Text className="max-w-[240px] text-center font-sans text-[13px] text-muted-foreground">
            {t('sayHello')}
          </Text>
        </View>
      ) : (
        <View className="flex-1">
          <ScrollView
            ref={scrollRef}
            onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
            onScroll={onScroll}
            scrollEventThrottle={32}
            showsVerticalScrollIndicator={false}
            contentContainerClassName="gap-2.5 px-3.5 py-2"
            className="flex-1"
          >
            <View className="my-1 max-w-[300px] flex-row items-center gap-1.5 self-center rounded-[16px] bg-primary/5 px-3.5 py-2">
              <Lock size={13} color={colors.primary} />
              <Text className="shrink text-center font-sans text-[11.5px] text-muted-foreground">
                {t('encryptedBanner')}
              </Text>
            </View>

            {messages.map((m) =>
              m.kind === 'day' ? (
                <View key={m.id} className="my-0.5 self-center rounded-full bg-primary/5 px-3 py-1">
                  <Text className="font-sans-semibold text-[11px] text-muted-foreground">
                    {m.label}
                  </Text>
                </View>
              ) : (
                <MessageRow key={m.id} message={m} />
              ),
            )}
          </ScrollView>

          {showScrollDown ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('scrollToLatest')}
              onPress={() => scrollRef.current?.scrollToEnd({ animated: true })}
              style={shadow}
              className="absolute right-3.5 bottom-3 h-11 w-11 items-center justify-center rounded-full border border-border bg-card active:opacity-80"
            >
              <ChevronDown size={24} color={colors.foreground} />
            </Pressable>
          ) : null}
        </View>
      )}

      {conversation.blocked ? (
        <View
          style={{ paddingBottom: insets.bottom }}
          className="border-border border-t bg-card px-4 pt-3"
        >
          <View className="flex-row items-center gap-2 pb-2.5">
            <Ban size={16} color={colors.destructive} />
            <Text className="flex-1 font-sans text-[13px] text-muted-foreground">
              {t('blockedComposer')}
            </Text>
          </View>
          <Button variant="outline" size="sm" onPress={() => toggleBlock(id)}>
            {t('unblock')}
          </Button>
        </View>
      ) : (
        <ChatComposer onSend={send} />
      )}
    </View>
  );
}
