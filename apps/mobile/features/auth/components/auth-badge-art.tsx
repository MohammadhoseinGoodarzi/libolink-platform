import type { ComponentType } from 'react';
import { View } from 'react-native';
import { BrandGradient } from '@/shared/components/ui';

// Concentric rings + green→navy gradient disc with a glyph (verify / success art).
export function AuthBadgeArt({
  icon: Icon,
  size = 104,
}: {
  icon: ComponentType<{ size?: number; color?: string }>;
  size?: number;
}) {
  return (
    <View className="items-center justify-center" style={{ height: size + 72, marginBottom: 4 }}>
      <View className="items-center justify-center" style={{ width: size, height: size }}>
        <View
          className="absolute rounded-full border border-border"
          style={{ width: size + 28, height: size + 28 }}
        />
        <View
          className="absolute rounded-full border border-border opacity-60"
          style={{ width: size + 60, height: size + 60 }}
        />
        <BrandGradient
          className="items-center justify-center rounded-full"
          style={{ width: size, height: size }}
        >
          <Icon size={Math.round(size * 0.42)} color="#FFFFFF" />
        </BrandGradient>
      </View>
    </View>
  );
}
