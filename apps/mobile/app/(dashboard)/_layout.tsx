import { Slot } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeToggle } from '@/shared/components/theme-toggle';

export default function DashboardLayout() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center justify-between border-border border-b px-6 py-3">
        <Text className="font-semibold text-lg text-primary">Libolink</Text>
        <ThemeToggle />
      </View>
      <View className="flex-1 px-6 py-6">
        <Slot />
      </View>
    </SafeAreaView>
  );
}
