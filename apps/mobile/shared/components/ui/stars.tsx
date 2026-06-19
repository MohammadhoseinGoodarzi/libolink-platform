import { Star } from 'lucide-react-native';
import { View } from 'react-native';
import { useThemeColors } from '@/shared/theme';
import type { StarsProps } from './types';

const POSITIONS = [1, 2, 3, 4, 5];

// Five-star rating display (handoff §6.4). Filled stars use crimson by default;
// empty stars use the border tone. Read-only — taps belong to a future rating UI.
function Stars({ count, size = 13, color }: StarsProps) {
  const colors = useThemeColors();
  const fill = color ?? colors.destructive;
  return (
    <View className="flex-row items-center" style={{ gap: 1.5 }}>
      {POSITIONS.map((i) => {
        const on = i <= count;
        return (
          <Star
            key={i}
            size={size}
            color={on ? fill : colors.border}
            fill={on ? fill : 'transparent'}
          />
        );
      })}
    </View>
  );
}

export { Stars };
