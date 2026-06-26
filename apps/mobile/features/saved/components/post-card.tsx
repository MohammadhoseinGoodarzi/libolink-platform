import { useDictionary } from '@repo/i18n';
import { formatCompactNumber, formatShortRelativeTime } from '@repo/utils';
import { Clock, Heart, MessageCircle, MoreHorizontal, Share2 } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Avatar, BookCover, Card, IconButton, Text, useToast } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import type { SavedPostCardProps } from '../types';

// A saved post (handoff Saved): author, body, optional related book, the saved-at
// line, and a like/comment/share stat row. Like is an optimistic local toggle;
// comment/share acknowledge via toast (full interactions are phase-2).
function PostCard({ post, onOpen, onMenu }: SavedPostCardProps) {
  const t = useDictionary('Saved');
  const tCommon = useDictionary('Common');
  const colors = useThemeColors();
  const toast = useToast();
  const [liked, setLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.likes);
  const like = () =>
    setLiked((v) => {
      setLikes((c) => c + (v ? -1 : 1));
      return !v;
    });

  return (
    // The ⋯ menu and the like/comment/share row are siblings of the open target,
    // not nested inside it — a tap on the post body never fires an action button.
    <Card padded className="mb-3">
      <View className="flex-row items-center gap-2.5">
        <Pressable
          accessibilityRole="button"
          onPress={onOpen}
          className="min-w-0 flex-1 flex-row items-center gap-2.5"
        >
          <Avatar initials={post.initials} hue={post.hue} size={40} online={post.online} />
          <View className="min-w-0 flex-1">
            <Text numberOfLines={1} className="font-sans-bold text-[14px] text-foreground">
              {post.author}
            </Text>
            <Text
              numberOfLines={1}
              className="mt-0.5 font-sans text-[11.5px] text-muted-foreground"
            >
              {post.role}
            </Text>
          </View>
        </Pressable>
        <IconButton accessibilityLabel={t('itemMenu')} onPress={onMenu}>
          <MoreHorizontal size={20} color={colors.mutedForeground} />
        </IconButton>
      </View>

      <Pressable accessibilityRole="button" onPress={onOpen}>
        <Text className="mt-3 font-sans text-[13.5px] leading-[20px] text-foreground">
          {post.body}
        </Text>

        {post.book ? (
          <View className="mt-3 flex-row items-center gap-3 rounded-sm bg-secondary p-3">
            <BookCover
              title={post.book.title}
              author={post.book.author}
              width={34}
              tone={post.book.tone}
              radius={8}
            />
            <View className="min-w-0 flex-1">
              <Text className="font-sans text-[10.5px] text-muted-foreground">
                {t('relatedBook')}
              </Text>
              <Text
                numberOfLines={1}
                className="mt-0.5 font-sans-semibold text-[12.5px] text-foreground"
              >
                {post.book.title}
              </Text>
            </View>
          </View>
        ) : null}

        <View className="mt-3 flex-row items-center gap-1">
          <Clock size={12} color={colors.mutedForeground} />
          <Text className="font-sans text-[11.5px] text-muted-foreground">
            {t('savedPrefix')} {formatShortRelativeTime(post.savedAt)}
          </Text>
        </View>
      </Pressable>

      <View className="mt-3 flex-row items-center gap-6 border-border border-t pt-3">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('like')}
          onPress={like}
          className="flex-row items-center gap-1.5"
        >
          <Heart
            size={20}
            color={liked ? colors.destructive : colors.mutedForeground}
            fill={liked ? colors.destructive : 'transparent'}
          />
          <Text
            className="font-sans-semibold text-[13px]"
            style={{ color: liked ? colors.destructive : colors.mutedForeground }}
          >
            {formatCompactNumber(likes)}
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('comment')}
          onPress={() => toast.show(tCommon('comingSoon'))}
          className="flex-row items-center gap-1.5"
        >
          <MessageCircle size={20} color={colors.mutedForeground} />
          <Text className="font-sans-semibold text-[13px] text-muted-foreground">
            {formatCompactNumber(post.comments)}
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('share')}
          onPress={() => toast.show(tCommon('comingSoon'))}
          className="flex-row items-center gap-1.5"
        >
          <Share2 size={20} color={colors.mutedForeground} />
          <Text className="font-sans-semibold text-[13px] text-muted-foreground">
            {formatCompactNumber(post.shares)}
          </Text>
        </Pressable>
      </View>
    </Card>
  );
}

export { PostCard };
