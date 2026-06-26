import { cn } from '@repo/utils';
import { Pressable, View } from 'react-native';
import { useThemeColors } from '@/shared/theme';
import { CountBadge } from './badges';
import { chipTextVariants, chipVariants } from './chip-variants';
import { Text } from './text';
import type { ChipProps } from './types';

// The one chip primitive: a rounded-full pill, static (tone = colour scheme) or
// interactive (selectable, toggles active). FilterChip is the thin selectable
// wrapper; static topic/tag/Joined/screen pills pass a tone. Mirrors Button
// (base + chip-variants cva) with the same className/textClassName escape hatches
// for the odd exact size.
function Chip({
  label,
  icon: Icon,
  iconSize = 14,
  tone = 'neutral',
  size = 'default',
  selectable = false,
  active = false,
  count,
  onPress,
  className,
  textClassName,
}: ChipProps) {
  const colors = useThemeColors();
  // A selectable chip's active state overrides its tone with the selected scheme;
  // an inactive selectable chip reads as `primary` (green text on secondary fill).
  const scheme = selectable ? (active ? 'selected' : 'primary') : tone;
  const iconColor =
    scheme === 'selected'
      ? colors.primaryForeground
      : scheme === 'muted'
        ? colors.mutedForeground
        : scheme === 'primary'
          ? colors.primary
          : scheme === 'accent'
            ? colors.link
            : colors.foreground;

  const body = (
    <>
      {Icon ? <Icon size={iconSize} color={iconColor} /> : null}
      <Text className={cn(chipTextVariants({ tone: scheme, size }), textClassName)}>{label}</Text>
      {count && count > 0 ? <CountBadge count={count} /> : null}
    </>
  );

  const classes = cn(chipVariants({ tone: scheme, size }), className);

  if (selectable || onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        className={classes}
        {...(selectable ? { accessibilityState: { selected: active } } : {})}
      >
        {body}
      </Pressable>
    );
  }
  return <View className={classes}>{body}</View>;
}

export { Chip };
