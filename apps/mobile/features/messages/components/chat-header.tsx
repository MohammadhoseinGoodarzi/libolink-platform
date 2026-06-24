import { useDictionary } from '@repo/i18n';
import type { Conversation } from '@repo/types';
import { cn, getInitials } from '@repo/utils';
import { ArrowLeft, Lock } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar, BookCover, IconButton, Text } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';

// Chat nav bar (handoff §6.3): back · avatar/club-cover · name + lock · status.
// No voice/video. The More menu lands with the chat action sheet (phase-2).
export function ChatHeader({
  conversation: c,
  onBack,
  typing = false,
  onOpenProfile,
}: {
  conversation: Conversation;
  onBack: () => void;
  /** Simulated peer-typing override (no backend yet). */
  typing?: boolean;
  /** Tap the avatar/name → open the contact page. */
  onOpenProfile?: () => void;
}) {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const t = useDictionary('Messages');
  const tCommon = useDictionary('Common');

  const isClub = c.kind === 'club';
  const isGroup = c.kind === 'group';
  const isTyping = c.typing || typing;
  const status = isTyping
    ? t('typing')
    : isClub && c.book
      ? `${c.memberCount ?? 0} ${t('members')} · ${c.book.title}`
      : isClub || isGroup
        ? `${c.memberCount ?? 0} ${t('members')}`
        : c.online
          ? t('activeNow')
          : t('activeRecently');

  return (
    <View style={{ paddingTop: insets.top }} className="border-border border-b bg-background">
      <View className="h-14 flex-row items-center gap-1 px-1">
        <IconButton accessibilityLabel={tCommon('back')} onPress={onBack}>
          <ArrowLeft size={24} color={colors.primary} />
        </IconButton>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={c.title}
          onPress={onOpenProfile}
          disabled={!onOpenProfile}
          className="flex-1 flex-row items-center active:opacity-70"
        >
          {isClub && c.book ? (
            <BookCover title={c.book.title} width={36} radius={9} />
          ) : (
            <Avatar
              initials={getInitials(c.title)}
              name={c.title}
              size={36}
              online={c.online && !isGroup}
              group={isGroup}
            />
          )}
          <View className="ml-1.5 min-w-0 flex-1">
            <View className="flex-row items-center gap-1.5">
              <Text
                numberOfLines={1}
                className="shrink font-sans-bold text-[15.5px] text-foreground"
              >
                {c.title}
              </Text>
              <Lock size={12} color={colors.mutedForeground} />
            </View>
            <Text
              numberOfLines={1}
              className={cn(
                'text-[11.5px]',
                isTyping
                  ? 'font-sans-medium text-primary italic'
                  : 'font-sans text-muted-foreground',
              )}
            >
              {status}
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}
