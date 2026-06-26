import { View } from 'react-native';
import { Card } from '@/shared/components/ui';
import type { GroupCardProps } from '../types';

// A grouped settings card (handoff Settings): a rounded surface holding a stack of
// SettingsRows (each draws its own divider).
function GroupCard({ children }: GroupCardProps) {
  return (
    <View className="px-4">
      <Card className="overflow-hidden">{children}</Card>
    </View>
  );
}

export { GroupCard };
