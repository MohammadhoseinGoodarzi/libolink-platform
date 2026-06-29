import { cn } from '@repo/utils';
import { Pressable, View } from 'react-native';
import { Text } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import type { SegmentProps, TileSegmentProps } from '../types';

// Horizontal pill segmented control, 2–3 options (handoff Settings kit) — the
// selected segment lifts onto a card surface.
function Segment<K extends string>({ options, value, onChange }: SegmentProps<K>) {
  return (
    <View className="flex-row gap-1 rounded-2xl bg-secondary p-1">
      {options.map((option) => {
        const on = option.key === value;
        return (
          <Pressable
            key={option.key}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
            onPress={() => onChange(option.key)}
            className={cn(
              'h-9 flex-1 items-center justify-center rounded-xl',
              on ? 'bg-card' : 'bg-transparent',
            )}
          >
            <Text
              className={cn(
                'font-sans-semibold text-[13.5px]',
                on ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// Tall icon tiles (handoff Settings kit) — used for the theme picker; the
// selected tile fills brand green.
function TileSegment<K extends string>({ options, value, onChange }: TileSegmentProps<K>) {
  const colors = useThemeColors();
  return (
    <View className="flex-row gap-2 rounded-2xl bg-secondary p-2">
      {options.map((option) => {
        const on = option.key === value;
        const Icon = option.icon;
        return (
          <Pressable
            key={option.key}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
            onPress={() => onChange(option.key)}
            className={cn(
              'h-[76px] flex-1 items-center justify-center gap-2 rounded-xl',
              on ? 'bg-primary' : 'bg-transparent',
            )}
          >
            <Icon size={20} color={on ? colors.primaryForeground : colors.mutedForeground} />
            <Text
              className={cn(
                'font-sans-semibold text-[12.5px]',
                on ? 'text-primary-foreground' : 'text-muted-foreground',
              )}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export { Segment, TileSegment };
