import { useDictionary } from '@repo/i18n';
import { userAtom } from '@repo/stores';
import { getInitials } from '@repo/utils';
import { useAtomValue } from 'jotai';
import { Plus } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { Avatar, Text } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import type { ComposerBarProps } from '../types';

// Compact composer pinned above the tab bar (handoff §6.2): avatar + prompt +
// crimson new-post button. Both open the compose sheet.
export function ComposerBar({ onOpen }: ComposerBarProps) {
  const t = useDictionary('Home');
  const colors = useThemeColors();
  const user = useAtomValue(userAtom);
  return (
    <View className="flex-row items-center gap-2.5 border-border border-t bg-card px-3 py-2">
      <Avatar initials={getInitials(user?.displayName)} name={user?.displayName ?? ''} size={32} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('sharePrompt')}
        onPress={onOpen}
        className="h-[38px] flex-1 justify-center rounded-full border border-border bg-background px-3.5 active:opacity-70"
      >
        <Text className="font-sans text-[13px] text-muted-foreground">{t('sharePrompt')}</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('newPost')}
        onPress={onOpen}
        className="h-[38px] w-[38px] items-center justify-center rounded-[12px] bg-destructive active:opacity-90"
      >
        <Plus size={20} color={colors.destructiveForeground} strokeWidth={2.4} />
      </Pressable>
    </View>
  );
}
