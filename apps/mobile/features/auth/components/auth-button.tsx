import { cn } from '@repo/utils';
import type { ReactNode } from 'react';
import { ActivityIndicator, type ViewStyle } from 'react-native';
import { Button } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';

type AuthButtonProps = {
  children: ReactNode;
  onPress?: () => void;
  variant?: 'primary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
};

// Auth CTA (handoff §6.1): primary = crimson with a soft glow; outline = green.
// 54px tall, 20px radius, bold. Wraps the shared Button (no raw Pressable).
export function AuthButton({
  children,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
}: AuthButtonProps) {
  const colors = useThemeColors();

  if (variant === 'outline') {
    return (
      <Button
        variant="outline"
        size="lg"
        onPress={onPress}
        disabled={disabled}
        className="h-[54px] w-full rounded-lg border-[1.5px] border-primary"
        textClassName="font-sans-bold text-[16.5px] text-primary"
      >
        {children}
      </Button>
    );
  }

  const glow: ViewStyle | undefined =
    disabled || loading
      ? undefined
      : {
          shadowColor: colors.destructive,
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.4,
          shadowRadius: 12,
          elevation: 6,
        };

  return (
    <Button
      variant="destructive"
      size="lg"
      onPress={onPress}
      disabled={disabled || loading}
      style={glow}
      className={cn('h-[54px] w-full rounded-lg')}
      textClassName="font-sans-bold text-[16.5px]"
    >
      {loading ? <ActivityIndicator color="#FFFFFF" /> : children}
    </Button>
  );
}
