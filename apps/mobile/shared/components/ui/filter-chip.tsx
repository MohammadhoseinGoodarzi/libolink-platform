import { cn } from '@repo/utils';
import { Pressable } from 'react-native';
import { CountBadge } from './badges';
import { Text } from './text';
import type { FilterChipProps } from './types';

// 32px pill (handoff §5). Active = primary fill + white; inactive = secondary
// fill + green text. Optional trailing count badge (e.g. Unread · 2).
function FilterChip({ label, active = false, count, onPress }: FilterChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      className={cn(
        'h-8 flex-row items-center gap-1.5 rounded-full px-3',
        active ? 'bg-primary' : 'bg-secondary',
      )}
    >
      <Text
        className={cn(
          'text-xs',
          active ? 'font-sans-semibold text-primary-foreground' : 'font-sans-medium text-primary',
        )}
      >
        {label}
      </Text>
      {count && count > 0 ? <CountBadge count={count} /> : null}
    </Pressable>
  );
}

export { FilterChip };
