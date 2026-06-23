import { cn } from '@repo/utils';
import { Pressable } from 'react-native';
import type { IconButtonProps } from './types';

// Round, transparent icon button (handoff §2 small icon buttons = pill). Press
// feedback is opacity only (§3.4 / §12 — no springs).
function IconButton({
  children,
  accessibilityLabel,
  onPress,
  size = 40,
  className,
}: IconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      hitSlop={6}
      style={{ width: size, height: size }}
      className={cn('items-center justify-center rounded-full active:opacity-60', className)}
    >
      {children}
    </Pressable>
  );
}

export { IconButton };
