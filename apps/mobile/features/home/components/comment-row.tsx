import { useDictionary } from '@repo/i18n';
import { formatShortRelativeTime, getInitials } from '@repo/utils';
import { Heart, MoreHorizontal } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Avatar, Text } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import type { CommentRowProps } from '../types';

// Render @mentions in brand navy; returns inline nodes for a parent <Text>.
function renderContent(text: string): ReactNode[] {
  return text.split(/(@[\w.]+)/g).map((part, index) =>
    part.startsWith('@') ? (
      <Text key={`${index}-${part}`} className="font-sans-semibold text-link">
        {part}
      </Text>
    ) : (
      part
    ),
  );
}

// One comment with its nested replies (handoff §6.2): avatar, author + body with
// @mentions, time / reply / overflow, a like heart, and a collapsible replies.
export function CommentRow({ node, depth, rootId, onLike, onReply, onMenu }: CommentRowProps) {
  const t = useDictionary('Comments');
  const colors = useThemeColors();
  const hasReplies = node.replies.length > 0;
  const [showReplies, setShowReplies] = useState(depth === 0 && node.replies.length <= 2);

  return (
    <View style={{ paddingLeft: depth * 34 }}>
      <View className="flex-row gap-2.5 py-2.5">
        <Avatar
          initials={getInitials(node.author.displayName)}
          name={node.author.displayName}
          size={depth ? 28 : 34}
        />
        <View className="min-w-0 flex-1">
          <Text className="font-sans text-[13.5px] leading-[19px] text-foreground">
            <Text className="font-sans-bold text-[13.5px] text-foreground">
              {node.author.displayName}
            </Text>
            {node.mine ? <Text className="text-muted-foreground"> · {t('you')}</Text> : null}
          </Text>
          <Text className="mt-0.5 font-sans text-[13.5px] leading-[19px] text-foreground">
            {renderContent(node.content)}
          </Text>
          <View className="mt-1.5 flex-row items-center gap-4">
            <Text className="font-sans text-[11.5px] text-muted-foreground">
              {formatShortRelativeTime(node.createdAt)}
            </Text>
            <Pressable accessibilityRole="button" onPress={() => onReply(node, rootId)}>
              <Text className="font-sans-bold text-[11.5px] text-muted-foreground">
                {t('reply')}
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('options')}
              onPress={() => onMenu(node, rootId)}
              className="active:opacity-60"
            >
              <MoreHorizontal size={15} color={colors.mutedForeground} />
            </Pressable>
          </View>
          {hasReplies ? (
            <Pressable
              accessibilityRole="button"
              onPress={() => setShowReplies((v) => !v)}
              className="mt-2 flex-row items-center gap-2 active:opacity-60"
            >
              <View className="h-px w-[18px] bg-border" />
              <Text className="font-sans-semibold text-[12px] text-muted-foreground">
                {showReplies ? t('hideReplies') : t('viewReplies')}
              </Text>
            </Pressable>
          ) : null}
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('like')}
          onPress={() => onLike(node.id)}
          className="items-center gap-0.5 active:opacity-60"
        >
          <Heart
            size={15}
            color={node.likedByMe ? colors.destructive : colors.mutedForeground}
            fill={node.likedByMe ? colors.destructive : 'transparent'}
          />
          {node.likeCount > 0 ? (
            <Text
              style={{ color: node.likedByMe ? colors.destructive : colors.mutedForeground }}
              className="font-sans-semibold text-[10.5px]"
            >
              {node.likeCount}
            </Text>
          ) : null}
        </Pressable>
      </View>

      {hasReplies && showReplies
        ? node.replies.map((reply) => (
            <CommentRow
              key={reply.id}
              node={reply}
              depth={depth + 1}
              rootId={rootId}
              onLike={onLike}
              onReply={onReply}
              onMenu={onMenu}
            />
          ))
        : null}
    </View>
  );
}
