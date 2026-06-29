import { cn } from '@repo/utils';
import { Check, ChevronRight } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { Switch, Text } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import type { SettingsRowProps } from '../types';

// A single settings row (handoff Settings kit): rounded-square icon, title +
// optional subtitle, and a trailing affordance — chevron (navigates), a Switch
// (toggles), a check (selection screens), an inline value, or nothing. Rows stack
// inside a GroupCard. Switch rows are non-pressable Views (only the Switch reacts).
function SettingsRow({
  icon: Icon,
  title,
  subtitle,
  value,
  first,
  danger,
  trailing = 'chevron',
  on,
  onToggle,
  toggleDisabled,
  onPress,
}: SettingsRowProps) {
  const colors = useThemeColors();
  const isSwitch = trailing === 'switch';

  const body = (
    <>
      {Icon ? (
        <View className="h-9 w-9 items-center justify-center rounded-xl bg-secondary">
          <Icon size={19} color={danger ? colors.destructive : colors.primary} />
        </View>
      ) : null}
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
      {isSwitch ? (
        <Switch
          on={on ?? false}
          onToggle={onToggle ?? (() => undefined)}
          disabled={toggleDisabled ?? false}
          accessibilityLabel={title}
        />
      ) : (
        <>
          {value ? (
            <Text
              numberOfLines={1}
              className="max-w-[160px] font-sans text-[13.5px] text-muted-foreground"
            >
              {value}
            </Text>
          ) : null}
          {trailing === 'chevron' ? (
            <ChevronRight size={18} color={colors.mutedForeground} />
          ) : null}
          {trailing === 'check' && on ? <Check size={19} color={colors.primary} /> : null}
        </>
      )}
    </>
  );

  const className = cn(
    'flex-row items-center gap-3.5 px-4 py-3.5',
    !first && 'border-border border-t',
  );

  if (isSwitch) {
    return <View className={className}>{body}</View>;
  }

  return (
    <Pressable accessibilityRole="button" onPress={onPress} className={className}>
      {body}
    </Pressable>
  );
}

export { SettingsRow };
