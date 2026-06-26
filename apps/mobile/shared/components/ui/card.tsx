import { cn } from '@repo/utils';
import { View } from 'react-native';
import { useShadow } from '@/shared/theme';
import { cardVariants } from './card-variants';
import type { CardProps } from './types';

// White surface (handoff §6). `elevated` (default) carries the soft green-tinted
// shadow; `flat` is bordered + shadowless for inline content cards. Internal
// padding is the caller's unless `padded` (16px). 20px radius family.
function Card({
  className,
  variant = 'elevated',
  padded = false,
  shadow = 'card',
  style,
  ...props
}: CardProps) {
  const shadowStyle = useShadow(shadow === false ? 'card' : shadow);
  const elevated = variant === 'elevated' && shadow !== false;
  return (
    <View
      className={cn(cardVariants({ variant, padded }), className)}
      style={[elevated ? shadowStyle : null, style]}
      {...props}
    />
  );
}

export { Card };
