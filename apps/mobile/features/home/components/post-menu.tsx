import { useDictionary } from '@repo/i18n';
import { Bookmark, Flag, Languages, Link, Send, UserCheck, UserPlus } from 'lucide-react-native';
import { useState } from 'react';
import { ActionSheet, type ActionSheetAction, useToast } from '@/shared/components/ui';
import type { PostMenuProps } from '../types';

// Post ⋯ options (handoff §6.2): Follow/Unfollow · Share via DM · Save · Copy
// Link · Translate · Report, in the shared ActionSheet. Save is the real
// optimistic toggle and Share opens the DM share sheet; Follow is a local toggle
// until a shared follow mutation exists; the rest are mocked via toast.
export function PostMenu({
  post,
  open,
  onClose,
  saved,
  onToggleSave,
  onShareViaDm,
}: PostMenuProps) {
  const t = useDictionary('PostMenu');
  const toast = useToast();
  const [following, setFollowing] = useState(false);

  const handle = `@${post.author.username}`;

  const toggleFollow = () => {
    // `following` is the pre-toggle value, so the toast describes the new state.
    toast.show(following ? t('unfollowed') : `${t('following')} ${handle}`);
    setFollowing((f) => !f);
  };

  const actions: ActionSheetAction[] = [
    {
      label: `${following ? t('unfollow') : t('follow')} ${handle}`,
      icon: following ? UserCheck : UserPlus,
      onPress: toggleFollow,
    },
    { label: t('shareViaDm'), icon: Send, onPress: onShareViaDm },
    {
      label: saved ? t('removeFromSaved') : t('savePost'),
      icon: Bookmark,
      onPress: onToggleSave,
    },
    { label: t('copyLink'), icon: Link, onPress: () => toast.show(t('linkCopied')) },
    { label: t('translate'), icon: Languages, onPress: () => toast.show(t('translated')) },
    {
      label: t('reportPost'),
      icon: Flag,
      danger: true,
      onPress: () => toast.show(t('postReported')),
    },
  ];

  return <ActionSheet open={open} onClose={onClose} actions={actions} />;
}
