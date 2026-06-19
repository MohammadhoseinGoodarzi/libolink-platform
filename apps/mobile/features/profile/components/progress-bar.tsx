import { View } from 'react-native';
import { BrandGradient } from '@/shared/components/ui';
import type { ProgressBarProps } from '../types';

// Slim reading-progress track with the brand gradient fill (handoff §6.4).
function ProgressBar({ pct }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <View className="h-[7px] overflow-hidden rounded-full bg-muted">
      <BrandGradient style={{ width: `${clamped}%` }} className="h-full rounded-full" />
    </View>
  );
}

export { ProgressBar };
