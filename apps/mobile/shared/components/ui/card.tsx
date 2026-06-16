import { cn } from '@repo/utils';
import type { ComponentProps } from 'react';
import { View } from 'react-native';
import { useShadow } from '@/shared/theme';

type CardProps = ComponentProps<typeof View> & {
  /** Soft shadow depth (handoff §7). `false` for flat surfaces (e.g. list rows). */
  shadow?: 'card' | 'lifted' | false;
};

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
