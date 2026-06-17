import type { ComponentType } from 'react';
import { View } from 'react-native';
import { useThemeColors } from '@/shared/theme';

// 56px rounded fill with a green glyph (Forgot / New Password header art).
export function AuthIconBadge({
  icon: Icon,
}: {
  icon: ComponentType<{ size?: number; color?: string }>;
}) {
  const colors = useThemeColors();
  return (
    <View className="h-14 w-14 items-center justify-center rounded-[18px] bg-secondary">
      <Icon size={26} color={colors.primary} />
    </View>
  );
}
