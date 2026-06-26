import { cn } from '@repo/utils';
import { ChevronRight } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { Text } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import type { SettingsRowProps } from '../types';

// A single settings row (handoff Settings): rounded-square icon, title + optional
// subtitle, optional trailing value, chevron. Rows stack inside a GroupCard.
function SettingsRow({
  icon: Icon,
  title,
  subtitle,
  value,
  first,
  danger,
  onPress,
}: SettingsRowProps) {
  const colors = useThemeColors();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className={cn(
        'flex-row items-center gap-3.5 px-4 py-3.5',
        !first && 'border-border border-t',
      )}
    >
      <View className="h-9 w-9 items-center justify-center rounded-xl bg-secondary">
        <Icon size={19} color={danger ? colors.destructive : colors.primary} />
      </View>
      <View className="min-w-0 flex-1">
        <Text
          className={cn(
            'font-sans-semibold text-[15px]',
            danger ? 'text-destructive' : 'text-foreground',
          )}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text className="mt-0.5 font-sans text-[12px] text-muted-foreground">{subtitle}</Text>
        ) : null}
      </View>
      {value ? (
        <Text className="font-sans text-[13.5px] text-muted-foreground">{value}</Text>
      ) : null}
      <ChevronRight size={18} color={colors.mutedForeground} />
    </Pressable>
  );
}

export { SettingsRow };
