import { useDictionary } from '@repo/i18n';
import type { Post } from '@repo/types';
import { formatCompactNumber, formatShortRelativeTime, getInitials } from '@repo/utils';
import { Bookmark, Heart, MessageCircle, MoreHorizontal, Share2 } from 'lucide-react-native';
import { useId } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { Avatar, Text, useToast, VerifiedBadge } from '@/shared/components/ui';
import { useShadow, useThemeColors } from '@/shared/theme';
import { usePostCard } from '../hooks/use-feed';
import type { FeedCover } from '../types';

// Fixed brand-hex gradient pairs for the book banner (handoff §3.1 — no new hex).
const COVERS: Record<FeedCover, readonly [string, string]> = {
  greenNavy: ['#023618', '#1D3557'],
  navyCrimson: ['#1D3557', '#C14953'],
  greenCrimson: ['#023618', '#C14953'],
};
const COVER_KEYS: readonly FeedCover[] = ['greenNavy', 'navyCrimson', 'greenCrimson'];

function coverFor(title: string): FeedCover {
  let hash = 0;
  for (let i = 0; i < title.length; i += 1) {
    hash = (hash * 17 + title.charCodeAt(i)) % COVER_KEYS.length;
  }
  return COVER_KEYS[hash] as FeedCover;
}

// Book/media banner: a brand gradient with a dark scrim and the title/author
// (matches the prototype's generated post media). Real photos come later.
function PostMedia({ title, author }: { title: string; author: string }) {
  const [from, to] = COVERS[coverFor(title)];
  const fillId = `pm${useId().replace(/:/g, '')}`;
  const scrimId = `ps${useId().replace(/:/g, '')}`;
  return (
    <View className="px-3.5 pt-2.5">
      <View className="h-[178px] justify-end overflow-hidden rounded-[14px]">
        <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient id={fillId} x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0" stopColor={from} />
              <Stop offset="1" stopColor={to} />
            </LinearGradient>
            <LinearGradient id={scrimId} x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0" stopColor="#023618" stopOpacity="0" />
              <Stop offset="1" stopColor="#023618" stopOpacity="0.72" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${fillId})`} />
          <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${scrimId})`} />
        </Svg>
        <View className="px-3.5 pt-6 pb-3">
          <Text className="font-sans-bold text-[15.5px] text-white">{title}</Text>
          <Text className="font-sans text-[12px] text-white/80">{author}</Text>
        </View>
      </View>
    </View>
  );
}

function Stat({
  icon: Icon,
  label,
  active,
  activeColor,
  onPress,
}: {
  icon: typeof Heart;
  label?: string;
  active?: boolean;
  activeColor?: string;
  onPress?: () => void;
}) {
  const colors = useThemeColors();
  const color = active && activeColor ? activeColor : colors.mutedForeground;
  const content = (
    <>
      <Icon size={20} color={color} fill={active ? color : 'transparent'} />
      {label != null ? (
        <Text style={{ color }} className="font-sans-semibold text-[13px]">
          {label}
        </Text>
      ) : null}
    </>
  );
  if (!onPress) {
    return <View className="flex-row items-center gap-1.5">{content}</View>;
  }
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="flex-row items-center gap-1.5 active:opacity-60"
    >
      {content}
    </Pressable>
  );
}

// One feed post (handoff §6.2): author + verified badge, body, optional book
// banner, and like/comment/share/save. Like + save are optimistic and persisted
// through the shared usePostActions mutations; the comment sheet lands next.
export function PostCard({ post }: { post: Post }) {
  const t = useDictionary('Home');
  const colors = useThemeColors();
  const shadow = useShadow('card');
  const toast = useToast();
  const { liked, likeCount, saved, toggleLiked, toggleSaved } = usePostCard(post);

  const onSave = () => {
    const nowSaved = toggleSaved();
    toast.show(nowSaved ? t('saved') : t('removedFromSaved'));
  };

  return (
    <View
      className="mx-3.5 mt-3 overflow-hidden rounded-[20px] border border-border bg-card"
      style={shadow}
    >
      <View className="flex-row items-center gap-2.5 px-3.5 pt-3.5">
        <Avatar
          initials={getInitials(post.author.displayName)}
          name={post.author.displayName}
          size={40}
        />
        <View className="min-w-0 flex-1">
          <View className="flex-row items-center gap-1">
            <Text className="font-sans-bold text-[14px] text-foreground">
              {post.author.displayName}
            </Text>
            {post.author.verified ? <VerifiedBadge size={15} /> : null}
          </View>
          <Text className="font-sans text-[12px] text-muted-foreground">
            @{post.author.username} · {formatShortRelativeTime(post.createdAt)}
          </Text>
        </View>
        <View className="h-[30px] w-[30px] items-center justify-center">
          <MoreHorizontal size={19} color={colors.mutedForeground} />
        </View>
      </View>

      <View className="px-3.5 pt-2.5">
        <Text className="font-sans text-[14px] leading-[22px] text-foreground">{post.content}</Text>
      </View>

      {post.book ? <PostMedia title={post.book.title} author={post.book.author} /> : null}

      <View className="flex-row items-center gap-5 px-3.5 pt-3 pb-3.5">
        <Stat
          icon={Heart}
          label={formatCompactNumber(likeCount)}
          active={liked}
          activeColor={colors.destructive}
          onPress={toggleLiked}
        />
        <Stat icon={MessageCircle} label={formatCompactNumber(post.commentCount)} />
        <Stat icon={Share2} label={formatCompactNumber(post.shareCount)} />
        <View className="flex-1" />
        <Stat icon={Bookmark} active={saved} activeColor={colors.primary} onPress={onSave} />
      </View>
    </View>
  );
}
