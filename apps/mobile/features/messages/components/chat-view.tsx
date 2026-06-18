import { useDictionary } from '@repo/i18n';
import type { ChatMessage } from '@repo/types';
import { getInitials } from '@repo/utils';
import { useRouter } from 'expo-router';
import { Lock } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { Avatar, BookCover, Text } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import { useConversation, useThread } from '../hooks/use-conversations';
import { ChatComposer } from './chat-composer';
import { ChatHeader } from './chat-header';
import { MessageRow } from './message-row';

// Chat detail (handoff §6.3): header, end-to-end-encryption banner, the thread
// (or a "say hello" empty state), and the composer. Data flows through the
// shared @repo/api thread factory; sent messages append locally for now. The
// long-press menu and share-in-chat sheet land in phase-2.
export function ChatView({ id }: { id: string }) {
  const router = useRouter();
  const t = useDictionary('Messages');
  const colors = useThemeColors();
  const { conversation } = useConversation(id);
  const thread = useThread(id);
  const scrollRef = useRef<ScrollView>(null);
  const [sent, setSent] = useState<ChatMessage[]>([]);

  const messages: ChatMessage[] = [...(thread.data ?? []), ...sent];
  const isEmpty = !thread.isLoading && messages.length === 0;

  const send = (text: string) => {
    setSent((prev) => [
      ...prev,
      { id: `u${Date.now()}`, kind: 'text', from: 'me', time: t('now'), read: false, text },
    ]);
  };

  if (!conversation) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-background"
    >
      <ChatHeader conversation={conversation} onBack={() => router.back()} />

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
        <ScrollView
          ref={scrollRef}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
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
      )}

      <ChatComposer onSend={send} />
    </KeyboardAvoidingView>
  );
}
