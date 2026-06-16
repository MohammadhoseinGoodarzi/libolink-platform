import { cn } from '@repo/utils';
import { Check } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { useThemeColors } from '@/shared/theme';

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
};

export function Checkbox({ checked, onChange, children }: CheckboxProps) {
  const colors = useThemeColors();
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      onPress={() => onChange(!checked)}
      className="w-full flex-row items-start gap-3 active:opacity-60"
    >
      <View
        className={cn(
          'mt-0.5 h-6 w-6 items-center justify-center',
          checked ? 'bg-primary' : 'border-[1.5px] border-border',
        )}
        style={{ borderRadius: 8 }}
      >
        {checked ? <Check size={15} color={colors.primaryForeground} /> : null}
      </View>
      <View className="flex-1">{children}</View>
    </Pressable>
  );
}
