import { cn } from '@repo/utils';
import { Slot } from '@rn-primitives/slot';
import { Pressable, Text } from 'react-native';
import { buttonTextVariants, buttonVariants } from './button-variants';
import type { ButtonProps } from './types';

// Variant + size names mirror the web Button exactly (see ./button-variants).
function Button({
  className,
  textClassName,
  variant,
  size,
  asChild = false,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : Pressable;
  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), disabled && 'opacity-50', className)}
      disabled={disabled}
      {...props}
    >
      {typeof children === 'string' ? (
        <Text className={cn(buttonTextVariants({ variant }), textClassName)}>{children}</Text>
      ) : (
        children
      )}
    </Comp>
  );
}

export { Button, buttonTextVariants, buttonVariants };
