import { useDictionary } from '@repo/i18n';
import { cn } from '@repo/utils';
import { Eye, EyeOff } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, type TextInputProps } from 'react-native';
import { useThemeColors } from '@/shared/theme';
import { InputBase } from './input-base';

// Filled password field: same box as <Input> with a trailing reveal toggle laid
// out as InputBase's `right` sibling (flex-row), so the text never sits under it.
function PasswordInput({ className, ...props }: TextInputProps) {
  const t = useDictionary('Common');
  const colors = useThemeColors();
  const [visible, setVisible] = useState(false);

  return (
    <InputBase
      containerClassName="h-[52px] rounded-2xl bg-secondary px-3.5"
      className={cn('font-sans-medium', className)}
      right={
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={visible ? t('hidePassword') : t('showPassword')}
          onPress={() => setVisible((value) => !value)}
          className="ml-1 h-9 w-9 items-center justify-center rounded-full"
        >
          {visible ? (
            <EyeOff size={18} color={colors.mutedForeground} />
          ) : (
            <Eye size={18} color={colors.mutedForeground} />
          )}
        </Pressable>
      }
      {...props}
      secureTextEntry={!visible}
    />
  );
}

export { PasswordInput };
