import { cn } from '@repo/utils';
import { useId } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { CLUB_TONES } from '../constants';
import type { TonedGradientProps } from '../types';

// Per-tone diagonal gradient fill (handoff §6.5) — the base for club logos and
// banners. Mirrors BookCover's offline-safe SVG gradient approach.
function TonedGradient({ tone, className, style, children }: TonedGradientProps) {
  const id = `tg${useId().replace(/:/g, '')}`;
  // `as` cast mirrors BookCover: the modulo index is always in range, but
  // noUncheckedIndexedAccess can't prove it.
  const [from, to] = CLUB_TONES[tone % CLUB_TONES.length] as readonly [string, string];
  return (
    <View className={cn('overflow-hidden', className)} style={style}>
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0" stopColor={from} />
            <Stop offset="1" stopColor={to} />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${id})`} />
      </Svg>
      {children}
    </View>
  );
}

export { TonedGradient };
