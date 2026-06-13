import { useDictionary } from '@repo/i18n';
import { cn } from '@repo/utils';
import { Eye, EyeOff } from 'lucide-react-native';
import { type ComponentProps, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

function PasswordInput({ className, ...props }: ComponentProps<typeof TextInput>) {
  const t = useDictionary('Common');
  const [visible, setVisible] = useState(false);

  return (
    <View className="relative justify-center">
      <TextInput
        secureTextEntry={!visible}
        placeholderTextColor="#9ca3af"
        className={cn(
          'h-[42px] rounded-md border border-input bg-background px-3 pr-11 text-base text-foreground',
          className,
        )}
        {...props}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={visible ? t('hidePassword') : t('showPassword')}
        onPress={() => setVisible((value) => !value)}
        className="absolute right-3"
      >
        {visible ? <EyeOff size={18} color="#9ca3af" /> : <Eye size={18} color="#9ca3af" />}
      </Pressable>
    </View>
  );
}

export { PasswordInput };
