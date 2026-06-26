import { useDictionary } from '@repo/i18n';
import { cn } from '@repo/utils';
import { Clock, UserPlus } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable } from 'react-native';
import { Text, useToast } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import type { AddButtonProps } from '../types';

// Connect affordance (handoff Friends): Add → Requested. The request state is a
// local toggle (the real connect mutation lands with the backend).
function AddButton({ name, size = 'sm', icon = true }: AddButtonProps) {
  const t = useDictionary('Friends');
  const colors = useThemeColors();
  const toast = useToast();
  const [sent, setSent] = useState(false);
  const press = () =>
    setSent((v) => {
      toast.show(v ? t('requestCancelled') : t('requestSent'));
      return !v;
    });
  const Icon = sent ? Clock : UserPlus;
  const glyph = size === 'md' ? 16 : 14;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${t('add')} ${name}`}
      onPress={press}
      className={cn(
        'flex-row items-center justify-center gap-1.5 rounded-full',
        size === 'md' ? 'h-[38px] px-4' : 'h-8 px-3',
        sent ? 'bg-secondary' : 'border border-border',
      )}
    >
      {icon ? <Icon size={glyph} color={colors.primary} /> : null}
      <Text
        className={cn(
          'font-sans-semibold text-primary',
          size === 'md' ? 'text-[13.5px]' : 'text-[12.5px]',
        )}
      >
        {sent ? t('requested') : t('add')}
      </Text>
    </Pressable>
  );
}

export { AddButton };
