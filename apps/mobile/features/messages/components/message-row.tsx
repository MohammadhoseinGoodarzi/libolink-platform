import { useDictionary } from '@repo/i18n';
import type { ChatBook, ChatMessage, ChatReaction, ChatReplyRef } from '@repo/types';
import { cn } from '@repo/utils';
import { BookOpen, CheckCheck, Play, Star } from 'lucide-react-native';
import { View } from 'react-native';
import { BookCover, BrandGradient, Text } from '@/shared/components/ui';
import { useShadow, useThemeColors } from '@/shared/theme';

// Static voice waveform (handoff §6.3). Stable keys avoid index-as-key.
const WAVE = [8, 14, 20, 12, 24, 16, 10, 22, 14, 9, 18, 12, 7, 16, 11, 20, 13, 8].map((h, i) => ({
  id: `w${i}`,
  h,
}));

function ReplyQuote({ mine, replyTo }: { mine: boolean; replyTo: ChatReplyRef }) {
  return (
    <View className={cn('mb-1.5 border-l-2 pl-2', mine ? 'border-white/60' : 'border-link')}>
      <Text className={cn('font-sans-bold text-[12px]', mine ? 'text-white/90' : 'text-link')}>
        {replyTo.name}
      </Text>
      <Text
        numberOfLines={1}
        className={cn('font-sans text-[12px]', mine ? 'text-white/75' : 'text-muted-foreground')}
      >
        {replyTo.text}
      </Text>
    </View>
  );
}

function VoiceMessage({ mine, duration }: { mine: boolean; duration: string }) {
  const colors = useThemeColors();
  return (
    <View className="min-w-[180px] flex-row items-center gap-2.5">
      <View
        className={cn(
          'h-9 w-9 items-center justify-center rounded-full',
          mine ? 'bg-white/20' : 'bg-primary',
        )}
      >
        <Play size={16} color={mine ? '#FFFFFF' : colors.primaryForeground} />
      </View>
      <View className="flex-1 flex-row items-center gap-[2.5px]">
        {WAVE.map((bar) => (
          <View
            key={bar.id}
            style={{
              width: 2.5,
              height: bar.h,
              borderRadius: 9999,
              backgroundColor: mine ? 'rgba(255,255,255,0.45)' : colors.border,
            }}
          />
        ))}
      </View>
      <Text
        className={cn('text-[11.5px]', mine ? 'text-primary-foreground' : 'text-muted-foreground')}
      >
        {duration}
      </Text>
    </View>
  );
}

function BookRecCard({ book }: { book: ChatBook }) {
  const colors = useThemeColors();
  const shadow = useShadow('card');
  const t = useDictionary('Messages');
  return (
    <View
      style={shadow}
      className="w-[248px] overflow-hidden rounded-[20px] border border-border bg-card"
    >
      <View className="flex-row gap-3 p-3">
        <BookCover title={book.title} author={book.author} width={56} radius={12} />
        <View className="min-w-0 flex-1">
          <Text className="font-sans-bold text-[10.5px] uppercase tracking-wide text-link">
            {book.note ? t('recommendation') : t('sharedBook')}
          </Text>
          <Text className="mt-1 font-sans-bold text-[14.5px] leading-[18px] text-foreground">
            {book.title}
          </Text>
          <Text className="font-sans text-[12px] text-muted-foreground">{book.author}</Text>
          {book.rating != null ? (
            <View className="mt-1.5 flex-row items-center gap-1">
              <Star size={13} color={colors.destructive} fill={colors.destructive} />
              <Text className="font-sans-bold text-[12px] text-destructive">{book.rating}</Text>
            </View>
          ) : null}
        </View>
      </View>
      {book.note ? (
        <Text className="px-3 pb-2.5 font-sans text-[12.5px] italic leading-[18px] text-muted-foreground">
          “{book.note}”
        </Text>
      ) : null}
      <View className="h-10 flex-row items-center justify-center gap-1.5 border-border border-t">
        <BookOpen size={15} color={colors.primary} />
        <Text className="font-sans-bold text-[13.5px] text-primary">{t('viewBook')}</Text>
      </View>
    </View>
  );
}

function ImageMessage({ caption }: { caption?: string | undefined }) {
  return (
    <View className="w-[224px] overflow-hidden rounded-[20px]">
      <BrandGradient className="h-[224px] w-full justify-end">
        {caption ? (
          <View className="p-3">
            <Text className="font-sans text-[12.5px] text-white">{caption}</Text>
          </View>
        ) : null}
      </BrandGradient>
    </View>
  );
}

function ReactionPill({ reactions, mine }: { reactions: ChatReaction[]; mine: boolean }) {
  return (
    <View
      className={cn(
        '-bottom-2.5 absolute flex-row gap-0.5 rounded-full border border-border bg-card px-1.5 py-0.5',
        mine ? 'left-2' : 'right-2',
      )}
    >
      {reactions.map((r) => (
        <Text key={r.emoji} className="text-[12px]">
          {r.emoji}
        </Text>
      ))}
    </View>
  );
}

// One message (handoff §6.3). Text/reply/voice sit in a bubble; book/image are
// standalone cards; emoji renders large. Reactions overlap the corner; mine
// shows a read receipt. The 'day' separator is handled by ChatView.
export function MessageRow({ message: m }: { message: ChatMessage }) {
  const colors = useThemeColors();
  const shadow = useShadow('card');

  if (m.kind === 'day') {
    return null;
  }

  const mine = m.from === 'me';
  const hasReactions = (m.reactions?.length ?? 0) > 0;

  let inner: React.ReactNode;
  if (m.kind === 'book') {
    inner = <BookRecCard book={m.book} />;
  } else if (m.kind === 'image') {
    inner = <ImageMessage caption={m.caption} />;
  } else if (m.kind === 'emoji') {
    inner = <Text className="px-1 text-[44px] leading-[52px]">{m.text}</Text>;
  } else {
    inner = (
      <View
        style={shadow}
        className={cn(
          'rounded-lg px-3.5 py-2.5',
          mine ? 'rounded-br-[6px] bg-primary' : 'rounded-bl-[6px] border border-border bg-card',
        )}
      >
        {m.kind === 'voice' ? (
          <VoiceMessage mine={mine} duration={m.duration} />
        ) : (
          <>
            {m.kind === 'reply' ? <ReplyQuote mine={mine} replyTo={m.replyTo} /> : null}
            <Text
              className={cn(
                'text-[15px] leading-[22px]',
                mine ? 'text-primary-foreground' : 'text-card-foreground',
              )}
            >
              {m.text}
            </Text>
          </>
        )}
      </View>
    );
  }

  return (
    <View className={cn('max-w-[84%]', mine ? 'items-end self-end' : 'items-start self-start')}>
      <View className="relative">
        {inner}
        {hasReactions && m.reactions ? <ReactionPill reactions={m.reactions} mine={mine} /> : null}
      </View>
      <View className={cn('flex-row items-center gap-1 px-1', hasReactions ? 'mt-3' : 'mt-1')}>
        <Text className="text-[11px] text-muted-foreground">{m.time}</Text>
        {mine ? (
          <CheckCheck size={13} color={m.read ? colors.link : colors.mutedForeground} />
        ) : null}
      </View>
    </View>
  );
}
