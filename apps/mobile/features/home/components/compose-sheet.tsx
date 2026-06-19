import { useDictionary } from '@repo/i18n';
import { userAtom } from '@repo/stores';
import { cn, getInitials } from '@repo/utils';
import { useAtomValue } from 'jotai';
import { Bookmark, ImageIcon, MapPin } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Avatar, BottomSheet, Input, Text, useToast } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import type { ComposeSheetProps } from '../types';

// New-post composer sheet (handoff §6.2): Cancel / title / Post, an autofocus
// textarea, and attach affordances (phase-2). Submitting hands the text up to
// the shared create-post mutation.
export function ComposeSheet({ open, onClose, onSubmit }: ComposeSheetProps) {
  const t = useDictionary('Home');
  const tCommon = useDictionary('Common');
  const colors = useThemeColors();
  const toast = useToast();
  const user = useAtomValue(userAtom);
  const [text, setText] = useState('');
  const canPost = text.trim().length > 0;

  const submit = () => {
    const value = text.trim();
    if (!value) {
      return;
    }
    onSubmit(value);
    setText('');
    onClose();
  };

  // Attachments land in a later pass; acknowledge the tap for now.
  const attachSoon = () => toast.show(tCommon('comingSoon'));

  return (
    <BottomSheet open={open} onClose={onClose} label={t('newPost')}>
      <View className="flex-row items-center justify-between border-border border-b px-3.5 pb-3">
        <Pressable accessibilityRole="button" onPress={onClose}>
          <Text className="font-sans text-[14px] text-muted-foreground">{tCommon('cancel')}</Text>
        </Pressable>
        <Text className="font-sans-bold text-[15px] text-foreground">{t('newPost')}</Text>
        <Pressable
          accessibilityRole="button"
          disabled={!canPost}
          onPress={submit}
          className={cn(
            'rounded-full bg-destructive px-4 py-1.5 active:opacity-90',
            !canPost && 'opacity-60',
          )}
        >
          <Text
            className="font-sans-bold text-[13.5px]"
            style={{ color: colors.destructiveForeground }}
          >
            {t('post')}
          </Text>
        </Pressable>
      </View>

      <View className="flex-row gap-3 px-3.5 pt-3.5">
        <Avatar
          initials={getInitials(user?.displayName)}
          name={user?.displayName ?? ''}
          size={40}
        />
        <Input
          value={text}
          onChangeText={setText}
          placeholder={t('composerPlaceholder')}
          multiline
          autoFocus
          style={{ textAlignVertical: 'top' }}
          className="h-auto min-h-[104px] flex-1 rounded-none bg-transparent px-0 py-0 font-sans text-[15px]"
        />
      </View>

      <View className="flex-row items-center gap-1.5 px-3.5 pt-3 pb-4">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('addPhoto')}
          onPress={attachSoon}
          className="h-10 w-10 items-center justify-center rounded-[12px] bg-secondary active:opacity-70"
        >
          <ImageIcon size={19} color={colors.primary} />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('addLocation')}
          onPress={attachSoon}
          className="h-10 w-10 items-center justify-center rounded-[12px] bg-secondary active:opacity-70"
        >
          <MapPin size={19} color={colors.primary} />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('addBook')}
          onPress={attachSoon}
          className="h-10 w-10 items-center justify-center rounded-[12px] bg-secondary active:opacity-70"
        >
          <Bookmark size={19} color={colors.primary} />
        </Pressable>
      </View>
    </BottomSheet>
  );
}
