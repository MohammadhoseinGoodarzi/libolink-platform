import { useDictionary } from '@repo/i18n';
import type { NotificationType } from '@repo/types';
import { cn, getInitials } from '@repo/utils';
import {
  AtSign,
  Bookmark,
  Heart,
  type LucideIcon,
  MessageCircle,
  UserPlus,
  UsersRound,
  X,
} from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { Avatar, Text } from '@/shared/components/ui';
import { type ThemeColors, useThemeColors } from '@/shared/theme';
import type { NotificationRowProps } from '../types';

// Lucide glyph per notification type (handoff §6.2 NOTIF_ICON).
const TYPE_ICON: Record<NotificationType, LucideIcon> = {
  like: Heart,
  comment: MessageCircle,
  mention: AtSign,
  follow: UserPlus,
  request: UserPlus,
  reading: Bookmark,
  club: UsersRound,
  declined: X,
};

// Badge tint: likes crimson, reading/club navy, everything else brand green.
function badgeColor(type: NotificationType, colors: ThemeColors): string {
  if (type === 'like') {
    return colors.destructive;
  }
  if (type === 'reading' || type === 'club') {
    return colors.link;
  }
  return colors.primary;
}

// One notification line: avatar + type badge, actor + summary, time, an unread
// dot, and Confirm/Delete actions for a friend request.
export function NotificationRow({ notification, onRespond }: NotificationRowProps) {
  const t = useDictionary('Notifications');
  const colors = useThemeColors();
  const { id, type, actor, text, time, unread } = notification;
  const Icon = TYPE_ICON[type];
  const isRequest = type === 'request';

  return (
    <View
      className={cn(
        'flex-row items-center gap-3 border-border border-b px-4 py-3',
        unread && 'bg-primary/5',
      )}
    >
      <View className="relative">
        <Avatar initials={getInitials(actor.name)} name={actor.name} hue={actor.hue} size={44} />
        <View
          className="absolute -right-0.5 -bottom-0.5 h-5 w-5 items-center justify-center rounded-full"
          style={{
            backgroundColor: badgeColor(type, colors),
            borderWidth: 2,
            borderColor: colors.background,
          }}
        >
          <Icon size={11} color={colors.primaryForeground} />
        </View>
      </View>

      <View className="min-w-0 flex-1">
        <Text className="font-sans text-[13.5px] leading-[19px] text-foreground">
          <Text className="font-sans-bold text-[13.5px] text-foreground">{actor.name}</Text> {text}
        </Text>
        <Text className="mt-0.5 font-sans text-[11.5px] text-muted-foreground">{time}</Text>

        {isRequest ? (
          <View className="mt-2 flex-row gap-2">
            <Pressable
              accessibilityRole="button"
              onPress={() => onRespond(id, true)}
              className="h-8 items-center justify-center rounded-full bg-destructive px-4 active:opacity-90"
            >
              <Text className="font-sans-bold text-[12.5px] text-destructive-foreground">
                {t('confirm')}
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => onRespond(id, false)}
              className="h-8 items-center justify-center rounded-full border border-border px-4 active:opacity-70"
            >
              <Text className="font-sans-bold text-[12.5px] text-foreground">{t('delete')}</Text>
            </Pressable>
          </View>
        ) : null}
      </View>

      {unread && !isRequest ? <View className="h-2.5 w-2.5 rounded-full bg-destructive" /> : null}
    </View>
  );
}
