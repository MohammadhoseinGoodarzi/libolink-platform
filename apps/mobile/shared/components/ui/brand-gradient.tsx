import { cn } from '@repo/utils';
import { useId } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import type { BrandGradientProps } from './types';

// The one sanctioned decorative gradient (handoff §3.1): forest primary → navy
// link. Fixed brand colours in both themes — used for the AI-assistant tab,
// Premium hero, and Lio sheet. White content sits on top.
const GRADIENT_FROM = '#023618';
const GRADIENT_TO = '#1D3557';

function BrandGradient({ children, className, style, ...props }: BrandGradientProps) {
  const id = `bg${useId().replace(/:/g, '')}`;
  return (
    <View className={cn('overflow-hidden', className)} style={style} {...props}>
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0" stopColor={GRADIENT_FROM} />
            <Stop offset="1" stopColor={GRADIENT_TO} />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${id})`} />
      </Svg>
      {children}
    </View>
  );
}

export { BrandGradient };
