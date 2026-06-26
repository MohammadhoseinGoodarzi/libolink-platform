import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Text } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import { matchColor } from '../lib/match';
import type { MatchRingProps } from '../types';

// The signature Reader Compatibility ring (handoff Friends): a circular score
// gauge whose accent carries the match flavour. Drawn with react-native-svg (no
// new deps), like the profile reading-goal ring.
function MatchRing({ score, kind, size = 58 }: MatchRingProps) {
  const colors = useThemeColors();
  const stroke = 5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);
  const col = matchColor(kind, colors);

  return (
    <View style={{ width: size, height: size }} className="items-center justify-center">
      <Svg
        width={size}
        height={size}
        style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}
      >
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.border}
          strokeWidth={stroke}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={col}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          fill="none"
        />
      </Svg>
      <Text className="font-sans-bold text-foreground" style={{ fontSize: size * 0.3 }}>
        {score}
      </Text>
    </View>
  );
}

export { MatchRing };
