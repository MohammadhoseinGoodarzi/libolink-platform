import { useDictionary } from '@repo/i18n';
import { cn } from '@repo/utils';
import { useAtom } from 'jotai';
import { Send, Sparkles } from 'lucide-react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, ScrollView, TextInput, useWindowDimensions, View } from 'react-native';
import { lioOpenAtom } from '@/shared/store/ui';
import { useThemeColors } from '@/shared/theme';
import { BottomSheet } from '../ui/bottom-sheet';
import { BrandGradient } from '../ui/brand-gradient';
import { IconButton } from '../ui/icon-button';
import { Text } from '../ui/text';
import { lioReply } from './lio-data';

type LioMessage = { id: number; role: 'lio' | 'user'; text: string };

function TypingDots() {
  const colors = useThemeColors();
  const dot0 = useRef(new Animated.Value(0.4)).current;
  const dot1 = useRef(new Animated.Value(0.4)).current;
  const dot2 = useRef(new Animated.Value(0.4)).current;
  const dots = useMemo(
    () => [
      { key: 'd0', value: dot0 },
      { key: 'd1', value: dot1 },
      { key: 'd2', value: dot2 },
    ],
    [dot0, dot1, dot2],
  );

  useEffect(() => {
    const animations = dots.map((dot, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 160),
          Animated.timing(dot.value, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(dot.value, { toValue: 0.4, duration: 300, useNativeDriver: true }),
        ]),
      ),
    );
    for (const animation of animations) {
      animation.start();
    }
    return () => {
      for (const animation of animations) {
        animation.stop();
      }
    };
  }, [dots]);

  return (
    <View className="flex-row items-center gap-1">
      {dots.map((dot) => (
        <Animated.View
          key={dot.key}
          style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: colors.mutedForeground,
            opacity: dot.value,
          }}
        />
      ))}
    </View>
  );
}

// Shared AI assistant "Lio" (handoff §5): greeting, suggestion chips (first turn),
// canned replies + typing dots. Opens from the centre tab via lioOpenAtom.
export function LioAssistant() {
  const [open, setOpen] = useAtom(lioOpenAtom);
  const colors = useThemeColors();
  const t = useDictionary('Lio');
  const { height } = useWindowDimensions();

  const counter = useRef(1);
  const [messages, setMessages] = useState<LioMessage[]>([
    { id: 0, role: 'lio', text: t('greeting') },
  ]);
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const replyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const suggestions = [
    t('suggestionRecommend'),
    t('suggestionSummarize'),
    t('suggestionBuddy'),
    t('suggestionTrending'),
  ];

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }
    const userMessage: LioMessage = { id: counter.current++, role: 'user', text: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setDraft('');
    setTyping(true);
    replyTimer.current = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: counter.current++, role: 'lio', text: lioReply(trimmed) },
      ]);
      setTyping(false);
    }, 700);
  };

  useEffect(() => {
    return () => {
      if (replyTimer.current) {
        clearTimeout(replyTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    const id = setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
    return () => clearTimeout(id);
  }, []);

  return (
    <BottomSheet open={open} onClose={() => setOpen(false)} label={t('name')}>
      <View style={{ height: height * 0.74 }}>
        {/* header */}
        <View className="flex-row items-center gap-3 border-border border-b px-4 pb-3">
          <BrandGradient className="h-9 w-9 items-center justify-center rounded-full">
            <Sparkles size={18} color="#FFFFFF" />
          </BrandGradient>
          <View className="flex-1">
            <Text className="font-sans-bold text-[15px] text-foreground">{t('name')}</Text>
            <View className="flex-row items-center gap-1.5">
              <View className="h-1.5 w-1.5 rounded-full bg-primary" />
              <Text className="text-[12px] text-muted-foreground">
                {t('online')} · {t('tagline')}
              </Text>
            </View>
          </View>
        </View>

        {/* messages */}
        <ScrollView
          ref={scrollRef}
          className="flex-1"
          contentContainerClassName="gap-3 p-4"
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((message) =>
            message.role === 'lio' ? (
              <View key={message.id} className="max-w-[88%] flex-row items-start gap-2 self-start">
                <BrandGradient className="mt-0.5 h-7 w-7 items-center justify-center rounded-full">
                  <Sparkles size={14} color="#FFFFFF" />
                </BrandGradient>
                <View className="flex-1 rounded-lg rounded-bl-[6px] border border-border bg-card px-3.5 py-2.5">
                  <Text className="text-[14.5px] leading-[21px] text-card-foreground">
                    {message.text}
                  </Text>
                </View>
              </View>
            ) : (
              <View
                key={message.id}
                className="max-w-[84%] self-end rounded-lg rounded-br-[6px] bg-primary px-3.5 py-2.5"
              >
                <Text className="text-[14.5px] leading-[21px] text-primary-foreground">
                  {message.text}
                </Text>
              </View>
            ),
          )}

          {typing ? (
            <View className="flex-row items-center gap-2 self-start">
              <BrandGradient className="h-7 w-7 items-center justify-center rounded-full">
                <Sparkles size={14} color="#FFFFFF" />
              </BrandGradient>
              <View className="rounded-lg rounded-bl-[6px] border border-border bg-card px-4 py-3">
                <TypingDots />
              </View>
            </View>
          ) : null}

          {/* suggestion chips — first turn only */}
          {messages.length === 1 ? (
            <View className="mt-1 flex-row flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <Text
                  key={suggestion}
                  onPress={() => send(suggestion)}
                  className="overflow-hidden rounded-full border border-border bg-secondary px-3 py-2 font-sans-medium text-[13px] text-primary"
                >
                  {suggestion}
                </Text>
              ))}
            </View>
          ) : null}
        </ScrollView>

        {/* input */}
        <View className="flex-row items-center gap-2 border-border border-t px-3 py-2.5">
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder={t('inputPlaceholder')}
            placeholderTextColor={colors.mutedForeground}
            onSubmitEditing={() => send(draft)}
            returnKeyType="send"
            className={cn(
              'h-11 flex-1 rounded-full bg-secondary px-4 font-sans text-base text-foreground',
            )}
          />
          <IconButton accessibilityLabel={t('send')} onPress={() => send(draft)} size={44}>
            <BrandGradient className="h-11 w-11 items-center justify-center rounded-full">
              <Send size={18} color="#FFFFFF" />
            </BrandGradient>
          </IconButton>
        </View>
      </View>
    </BottomSheet>
  );
}
