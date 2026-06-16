import { cn } from '@repo/utils';
import { CheckCheck } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { View } from 'react-native';
import { useShadow, useThemeColors } from '@/shared/theme';
import { Text } from './text';

type MessageBubbleProps = {
  mine: boolean;
  text?: string;
  time?: string;
  read?: boolean;
  children?: ReactNode;
};

// Chat bubble (handoff §5 / Messages reference). Outgoing = forest fill, white
// text, 6px bottom-right tail; incoming = card surface, thin border, 6px
// bottom-left tail. Read receipt: double-check, navy when read else gray.
function MessageBubble({ mine, text, time, read = false, children }: MessageBubbleProps) {
  const colors = useThemeColors();
  const shadow = useShadow('card');

  return (
    <View className={cn('max-w-[84%]', mine ? 'self-end items-end' : 'self-start items-start')}>
      <View
        style={shadow}
        className={cn(
          'rounded-lg px-3.5 py-2.5',
          mine ? 'rounded-br-[6px] bg-primary' : 'rounded-bl-[6px] border border-border bg-card',
        )}
      >
        {children ??
          (text ? (
            <Text
              className={cn(
                'text-[15px] leading-[22px]',
                mine ? 'text-primary-foreground' : 'text-card-foreground',
              )}
            >
              {text}
            </Text>
          ) : null)}
      </View>

      <View className="mt-1 flex-row items-center gap-1 px-1">
        {time ? <Text className="text-[11px] text-muted-foreground">{time}</Text> : null}
        {mine ? <CheckCheck size={13} color={read ? colors.link : colors.mutedForeground} /> : null}
      </View>
    </View>
  );
}

export { MessageBubble };
