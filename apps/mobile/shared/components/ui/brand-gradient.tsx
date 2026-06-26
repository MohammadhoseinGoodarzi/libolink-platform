import { cn } from '@repo/utils';
import { useId, useState } from 'react';
import { type LayoutChangeEvent, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import type { BrandGradientProps } from './types';

// The one sanctioned decorative gradient (handoff §3.1): forest primary → navy
// link. Fixed brand colours in both themes — used for the AI-assistant tab,
// Premium hero, and Lio sheet. White content sits on top.
const GRADIENT_FROM = '#023618';
const GRADIENT_TO = '#1D3557';

function BrandGradient({ children, className, style, ...props }: BrandGradientProps) {
  const id = `bg${useId().replace(/:/g, '')}`;
  // Draw the gradient at the measured pixel size, overscanned by 1px (clipped by
  // overflow-hidden). A bare `100%` collapses on content-sized parents (e.g. the
  // profile quote card), and bare measured px can round short on the right/bottom
  // — leaving a transparent sliver (e.g. the raised AI tab circle). `100%` is the
  // first-frame fallback so fixed-size callers never flash.
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize((prev) =>
      prev && prev.width === width && prev.height === height ? prev : { width, height },
    );
  };
  const w = size ? Math.ceil(size.width) + 1 : '100%';
  const h = size ? Math.ceil(size.height) + 1 : '100%';

  return (
    <View className={cn('overflow-hidden', className)} style={style} {...props} onLayout={onLayout}>
      <Svg width={w} height={h} style={{ position: 'absolute', top: 0, left: 0 }}>
        <Defs>
          <LinearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0" stopColor={GRADIENT_FROM} />
            <Stop offset="1" stopColor={GRADIENT_TO} />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width={w} height={h} fill={`url(#${id})`} />
      </Svg>
      {children}
    </View>
  );
}

export { BrandGradient };
