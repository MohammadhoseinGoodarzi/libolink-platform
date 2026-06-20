import { useCommentThread } from '@repo/hooks';
import { useDictionary } from '@repo/i18n';
import { userAtom } from '@repo/stores';
import type { Comment } from '@repo/types';
import { cn, formatShortRelativeTime, getInitials } from '@repo/utils';
import { useAtomValue } from 'jotai';
import { Send, X } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Pressable, ScrollView, useWindowDimensions, View } from 'react-native';
import {
  ActionSheet,
  type ActionSheetAction,
  Avatar,
  BottomSheet,
  Input,
  Text,
  useToast,
} from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import { MENTION_USERS } from '../services/comments-data';
import { ME } from '../services/feed-data';
import { feedClient } from '../services/feed-service';
import type { CommentsSheetProps } from '../types';
import { CommentRow } from './comment-row';

const MENTION_RE = /@([\w.]*)$/;

// Comments bottom sheet (handoff §6.2): pinned post, nested thread, @mention
// autocomplete, reply/edit context, a fixed composer, and a per-comment action
// sheet. The thread + persistence live in the shared useCommentThread hook.
export function CommentsSheet({ post, open, onClose }: CommentsSheetProps) {
  const t = useDictionary('Comments');
  const tCommon = useDictionary('Common');
  const colors = useThemeColors();
  const toast = useToast();
  const { height } = useWindowDimensions();
  const me = useAtomValue(userAtom) ?? ME;
  const { thread, total, addComment, toggleLike, editComment, deleteComment } = useCommentThread(
    feedClient,
    post.id,
    me,
  );

  const scrollRef = useRef<ScrollView>(null);
  const [draft, setDraft] = useState('');
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const [replyRoot, setReplyRoot] = useState<string | null>(null);
  const [editing, setEditing] = useState<Comment | null>(null);
  const [menuFor, setMenuFor] = useState<Comment | null>(null);
  const [menuRoot, setMenuRoot] = useState<string | null>(null);
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);

  const clearContext = () => {
    setReplyTo(null);
    setReplyRoot(null);
    setEditing(null);
  };

  const startReply = (node: Comment, rootId: string) => {
    setEditing(null);
    setReplyTo(node);
    setReplyRoot(rootId);
    setDraft(`@${node.author.username} `);
  };

  const onDraft = (value: string) => {
    setDraft(value);
    const match = value.match(MENTION_RE);
    setMentionQuery(match ? (match[1] ?? '') : null);
  };

  const pickMention = (username: string) => {
    setDraft((d) => d.replace(MENTION_RE, `@${username} `));
    setMentionQuery(null);
  };

  const submit = () => {
    const value = draft.trim();
    if (!value) {
      return;
    }
    if (editing) {
      editComment(editing.id, value);
      toast.show(t('updated'));
      setEditing(null);
      setDraft('');
      return;
    }
    addComment(value, replyTo && replyRoot ? replyRoot : undefined);
    const wasTopLevel = !replyTo;
    clearContext();
    setDraft('');
    if (wasTopLevel) {
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
    }
  };

  const mentions =
    mentionQuery != null
      ? MENTION_USERS.filter(
          (u) =>
            u.username.toLowerCase().includes(mentionQuery) ||
            u.displayName.toLowerCase().includes(mentionQuery),
        ).slice(0, 4)
      : [];

  const menuActions: ActionSheetAction[] = menuFor
    ? menuFor.mine
      ? [
          {
            label: t('edit'),
            onPress: () => {
              if (!menuFor) {
                return;
              }
              clearContext();
              setEditing(menuFor);
              setDraft(menuFor.content);
            },
          },
          { label: t('copyText'), onPress: () => toast.show(t('copied')) },
          {
            label: t('delete'),
            danger: true,
            onPress: () => {
              if (menuFor) {
                deleteComment(menuFor.id);
                toast.show(t('deleted'));
              }
            },
          },
        ]
      : [
          {
            label: t('reply'),
            onPress: () => {
              if (menuFor) {
                startReply(menuFor, menuRoot ?? menuFor.id);
              }
            },
          },
          { label: t('copyText'), onPress: () => toast.show(t('copied')) },
          { label: t('report'), danger: true, onPress: () => toast.show(t('reported')) },
        ]
    : [];

  const canSend = draft.trim().length > 0;

  return (
    <BottomSheet open={open} onClose={onClose} label={t('title')}>
      <View style={{ height: height * 0.84 }}>
        {/* header */}
        <View className="flex-row items-center justify-center border-border border-b px-4 pb-3">
          <Text className="font-sans-bold text-[15px] text-foreground">
            {total} {t('title')}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={tCommon('close')}
            onPress={onClose}
            className="absolute right-3 h-8 w-8 items-center justify-center rounded-full bg-secondary active:opacity-70"
          >
            <X size={17} color={colors.foreground} />
          </Pressable>
        </View>

        {/* pinned post + thread */}
        <ScrollView
          ref={scrollRef}
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row gap-2.5 border-border border-b-[6px] bg-card px-4 py-3">
            <Avatar
              initials={getInitials(post.author.displayName)}
              name={post.author.displayName}
              size={36}
            />
            <View className="min-w-0 flex-1">
              <Text className="font-sans text-[13.5px] text-foreground">
                <Text className="font-sans-bold text-[13.5px] text-foreground">
                  {post.author.displayName}
                </Text>
                <Text className="text-muted-foreground">
                  {' '}
                  · {formatShortRelativeTime(post.createdAt)}
                </Text>
              </Text>
              <Text
                numberOfLines={3}
                className="mt-0.5 font-sans text-[13.5px] leading-[20px] text-foreground"
              >
                {post.content}
              </Text>
            </View>
          </View>

          <View className="px-4 pt-1 pb-3">
            {thread.length === 0 ? (
              <Text className="py-10 text-center font-sans text-[13.5px] text-muted-foreground">
                {t('empty')}
              </Text>
            ) : (
              thread.map((node) => (
                <CommentRow
                  key={node.id}
                  node={node}
                  depth={0}
                  rootId={node.id}
                  onLike={toggleLike}
                  onReply={startReply}
                  onMenu={(target, rootId) => {
                    setMenuFor(target);
                    setMenuRoot(rootId);
                  }}
                />
              ))
            )}
          </View>
        </ScrollView>

        {/* @mention autocomplete */}
        {mentions.length > 0 ? (
          <View className="border-border border-t bg-card" style={{ maxHeight: 168 }}>
            <ScrollView keyboardShouldPersistTaps="handled">
              {mentions.map((u) => (
                <Pressable
                  key={u.username}
                  accessibilityRole="button"
                  onPress={() => pickMention(u.username)}
                  className="flex-row items-center gap-2.5 px-4 py-2 active:opacity-70"
                >
                  <Avatar initials={getInitials(u.displayName)} name={u.displayName} size={32} />
                  <View>
                    <Text className="font-sans-semibold text-[13.5px] text-foreground">
                      {u.displayName}
                    </Text>
                    <Text className="font-sans text-[12px] text-muted-foreground">
                      @{u.username}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        ) : null}

        {/* reply / edit context */}
        {replyTo || editing ? (
          <View className="flex-row items-center justify-between border-border border-t bg-card px-4 py-2">
            <Text className="font-sans text-[12.5px] text-muted-foreground">
              {editing ? t('editing') : `${t('replyingTo')} @${replyTo?.author.username}`}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={tCommon('cancel')}
              onPress={() => {
                clearContext();
                setDraft('');
              }}
              className="h-7 w-7 items-center justify-center active:opacity-60"
            >
              <X size={16} color={colors.mutedForeground} />
            </Pressable>
          </View>
        ) : null}

        {/* composer */}
        <View className="flex-row items-center gap-2.5 border-border border-t bg-card px-3 py-2.5">
          <Avatar initials={getInitials(me.displayName)} name={me.displayName} size={32} />
          <Input
            value={draft}
            onChangeText={onDraft}
            placeholder={t('placeholder')}
            className="h-[42px] flex-1 rounded-full border border-border bg-background px-4 font-sans text-[14px]"
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('send')}
            disabled={!canSend}
            onPress={submit}
            className={cn(
              'h-[42px] w-[42px] items-center justify-center rounded-full bg-destructive active:opacity-90',
              !canSend && 'opacity-60',
            )}
          >
            <Send size={17} color={colors.destructiveForeground} />
          </Pressable>
        </View>
      </View>

      <ActionSheet
        open={!!menuFor}
        onClose={() => setMenuFor(null)}
        title={menuFor ? menuFor.author.displayName : ''}
        actions={menuActions}
      />
    </BottomSheet>
  );
}
