import { cn } from '@repo/utils';
import { Slot } from '@rn-primitives/slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ReactNode } from 'react';
import { Pressable, type PressableProps, Text } from 'react-native';

// Variant + size names mirror the web Button exactly — identical developer
// experience, different (RN) implementation.
const buttonVariants = cva('flex-row items-center justify-center gap-2', {
  variants: {
    variant: {
      default: 'bg-primary',
      outline: 'border border-input bg-background',
      ghost: 'bg-transparent',
      destructive: 'bg-destructive',
      post: 'bg-primary shadow-lg shadow-primary/50',
    },
    // Radius lives per-size (handoff §3.3): container buttons use the 20px
    // family (rounded-lg == --radius); icon/pill buttons stay fully round.
    size: {
      default: 'h-[42px] rounded-lg px-6',
      sm: 'h-8 rounded-md px-3',
      lg: 'h-[52px] rounded-lg px-8',
      icon: 'h-9 w-9 rounded-full',
      'icon-sm': 'h-8 w-8 rounded-full',
      post: 'h-[19px] rounded-full px-2.5',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

const buttonTextVariants = cva('font-sans-medium text-sm', {
  variants: {
    variant: {
      default: 'text-primary-foreground',
      outline: 'text-primary',
      ghost: 'text-primary',
      destructive: 'text-destructive-foreground',
      post: 'text-primary-foreground text-xs',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

type ButtonProps = Omit<PressableProps, 'children'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    className?: string;
    textClassName?: string;
    children?: ReactNode;
  };

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
