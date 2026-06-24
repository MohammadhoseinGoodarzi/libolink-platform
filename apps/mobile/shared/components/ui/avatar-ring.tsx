import { useId } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { useThemeColors } from '@/shared/theme';
import { Avatar } from './avatar';
import type { AvatarRingProps } from './types';

// Per-variant ring + card-gap widths (px). `frame` has no gap — the card colour
// is the ring itself (the profile's thick frame).
const RING = {
  gradient: { ringWidth: 2.5, gapWidth: 2.5 },
  muted: { ringWidth: 2.5, gapWidth: 2.5 },
  frame: { ringWidth: 4, gapWidth: 0 },
} as const;

// Crimson→navy gradient fill (handoff §6.2). The parent clips to a circle
// (overflow-hidden), so this is a plain full-bleed rect — guaranteed round.
function GradientFill() {
  const colors = useThemeColors();
  const id = `ar${useId().replace(/:/g, '')}`;
  return (
    <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
      <Defs>
        <LinearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0" stopColor={colors.destructive} />
          <Stop offset="1" stopColor={colors.link} />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${id})`} />
    </Svg>
  );
}

// One ringed avatar for both the profile hero and the stories row. Concentric
// circles, each clipped to a circle (overflow-hidden), so the avatar is always
// perfectly round: outer ring → card gap → avatar.
function AvatarRing({ variant, size, initials, name, hue, children }: AvatarRingProps) {
  const colors = useThemeColors();
  const { ringWidth, gapWidth } = RING[variant];
  const outer = size + 2 * (ringWidth + gapWidth);
  const gapSize = size + 2 * gapWidth;
  const ringColor =
    variant === 'gradient' ? undefined : variant === 'muted' ? colors.border : colors.card;

  return (
    <View style={{ width: outer, height: outer }}>
      <View
        className="h-full w-full items-center justify-center overflow-hidden rounded-full"
        style={{ backgroundColor: ringColor }}
      >
        {variant === 'gradient' ? <GradientFill /> : null}
        <View
          className="items-center justify-center overflow-hidden rounded-full"
          style={{ width: gapSize, height: gapSize, backgroundColor: colors.card }}
        >
          <Avatar
            initials={initials}
            name={name}
            size={size}
            {...(hue !== undefined ? { hue } : {})}
          />
        </View>
      </View>
      {children}
    </View>
  );
}

export { AvatarRing };
