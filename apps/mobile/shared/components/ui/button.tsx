import { cn } from '@repo/utils';
import { Slot } from '@rn-primitives/slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ReactNode } from 'react';
import { Pressable, type PressableProps, Text } from 'react-native';

// Variant + size names mirror the web Button exactly — identical developer
// experience, different (RN) implementation.
const buttonVariants = cva('flex-row items-center justify-center gap-2 rounded-md', {
  variants: {
    variant: {
      default: 'bg-primary',
      outline: 'border border-input bg-background',
      ghost: 'bg-transparent',
      destructive: 'bg-destructive',
      post: 'bg-primary shadow-lg shadow-primary/50',
    },
    size: {
      default: 'h-[42px] px-6',
      sm: 'h-8 px-3',
      lg: 'h-[52px] px-8',
      icon: 'h-9 w-9',
      'icon-sm': 'h-8 w-8',
      post: 'h-[19px] px-2.5',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

const buttonTextVariants = cva('font-medium text-sm', {
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
