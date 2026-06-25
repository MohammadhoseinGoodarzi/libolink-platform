import { useDictionary } from '@repo/i18n';
import { cn } from '@repo/utils';
import { Eye, EyeOff } from 'lucide-react-native';
import { type ComponentProps, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { useThemeColors } from '@/shared/theme';

function PasswordInput({ className, style, ...props }: ComponentProps<typeof TextInput>) {
  const t = useDictionary('Common');
  const colors = useThemeColors();
  const [visible, setVisible] = useState(false);

  return (
    <View className="relative justify-center">
      <TextInput
        secureTextEntry={!visible}
        placeholderTextColor={colors.mutedForeground}
        // Tight glyph box + 1px top nudge for optical centring (same as SearchInput).
        style={[{ includeFontPadding: false, paddingTop: 1, paddingBottom: 0 }, style]}
        className={cn(
          'h-[52px] rounded-2xl bg-secondary px-3.5 pr-12 font-sans-medium text-base text-foreground',
          className,
        )}
        {...props}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={visible ? t('hidePassword') : t('showPassword')}
        onPress={() => setVisible((value) => !value)}
        className="absolute right-2 h-9 w-9 items-center justify-center rounded-full"
      >
        {visible ? (
          <EyeOff size={18} color={colors.mutedForeground} />
        ) : (
          <Eye size={18} color={colors.mutedForeground} />
        )}
      </Pressable>
    </View>
  );
}

export { PasswordInput };
