import { useDictionary } from '@repo/i18n';
import type { Conversation } from '@repo/types';
import { cn, formatShortRelativeTime, getInitials } from '@repo/utils';
import { BellOff, CheckCheck, Pin, User, UsersRound } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { Avatar, BookCover, CountBadge, Text } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';

// One conversation row (handoff §6.3): person/club/group thumbnail, name + type
// icon (+ member count, mute, pin), preview with read-receipt or typing state,
// timestamp, and unread badge. Unread rows carry a subtle tint.
export function ConversationRow({
  conversation: c,
  onOpen,
}: {
  conversation: Conversation;
  onOpen: (id: string) => void;
}) {
  const colors = useThemeColors();
  const t = useDictionary('Messages');

  const isClub = c.kind === 'club';
  const isCommunity = c.kind === 'club' || c.kind === 'group';
  const unread = c.unreadCount > 0;
  const TypeIcon = isCommunity ? UsersRound : User;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={c.title}
      onPress={() => onOpen(c.id)}
      className={cn(
        'flex-row items-center gap-3 border-border border-b px-4 py-3 active:opacity-70',
        unread && 'bg-primary/5',
      )}
    >
      {isClub && c.book ? (
        <View>
          <BookCover title={c.book.title} width={44} radius={12} />
          <View
            className="absolute items-center justify-center rounded-full bg-primary"
            style={{
              right: -4,
              bottom: -4,
              width: 20,
              height: 20,
              borderWidth: 2,
              borderColor: colors.card,
            }}
          >
            <UsersRound size={11} color={colors.primaryForeground} />
          </View>
        </View>
      ) : (
        <Avatar
          initials={getInitials(c.title)}
          name={c.title}
          size={52}
          online={c.online}
          group={c.kind === 'group'}
        />
      )}

      <View className="min-w-0 flex-1">
        <View className="flex-row items-center gap-1.5">
          {c.pinned ? <Pin size={13} color={colors.mutedForeground} /> : null}
          <Text
            numberOfLines={1}
            className={cn(
              'shrink text-[15px] text-foreground',
              unread ? 'font-sans-bold' : 'font-sans-semibold',
            )}
          >
            {c.title}
          </Text>
          <View className="h-[17px] w-[17px] items-center justify-center rounded-full bg-secondary">
            <TypeIcon size={11} color={colors.link} />
          </View>
          {isClub && c.memberCount != null ? (
            <Text className="font-sans text-[11px] text-muted-foreground">· {c.memberCount}</Text>
          ) : null}
          {c.muted ? <BellOff size={13} color={colors.mutedForeground} /> : null}
        </View>

        <View className="mt-0.5 flex-row items-center gap-1.5">
          {c.lastMessageMine ? (
            <CheckCheck
              size={14}
              color={c.lastMessageRead ? colors.link : colors.mutedForeground}
            />
          ) : null}
          <Text
            numberOfLines={1}
            className={cn(
              'shrink text-[13.5px]',
              c.typing
                ? 'font-sans-medium text-primary italic'
                : unread
                  ? 'font-sans text-foreground'
                  : 'font-sans text-muted-foreground',
            )}
          >
            {c.typing ? t('typing') : c.preview}
          </Text>
        </View>
      </View>

      <View className="items-end gap-1.5">
        <Text
          className={cn(
            'text-[12px]',
            unread ? 'font-sans-semibold text-primary' : 'font-sans text-muted-foreground',
          )}
        >
          {formatShortRelativeTime(c.lastActivityAt)}
        </Text>
        {unread ? <CountBadge count={c.unreadCount} muted={c.muted} /> : <View className="h-5" />}
      </View>
    </Pressable>
  );
}
