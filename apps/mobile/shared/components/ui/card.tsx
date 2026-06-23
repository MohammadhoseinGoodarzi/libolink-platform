import { cn } from '@repo/utils';
import { View } from 'react-native';
import { useShadow } from '@/shared/theme';
import type { CardProps } from './types';

// White surface, 20px radius, soft green-tinted shadow (handoff §6). Internal
// padding is left to the caller (16px min, 24px typical).
function Card({ className, shadow = 'card', style, ...props }: CardProps) {
  const shadowStyle = useShadow(shadow === false ? 'card' : shadow);
  return (
    <View
      className={cn('rounded-lg bg-card', className)}
      style={[shadow === false ? null : shadowStyle, style]}
      {...props}
    />
  );
}

export { Card };
