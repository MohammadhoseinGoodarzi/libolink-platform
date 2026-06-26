import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { Header } from '@/shared/components/shell';
import { ScreenScrollView } from '@/shared/components/ui';
import type { SettingsScreenShellProps } from '../types';

// The shell every Settings detail screen sits in (handoff Settings kit): a
// back-titled Header over a bottom-safe scroll area. Detail screens are pushed,
// so the back button returns to the index (or the previous detail).
function SettingsScreenShell({ title, children }: SettingsScreenShellProps) {
  const router = useRouter();
  return (
    <View className="flex-1 bg-background">
      <Header title={title} showBack onBack={() => router.back()} />
      <ScreenScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pt-4">
        {children}
      </ScreenScrollView>
    </View>
  );
}

export { SettingsScreenShell };
