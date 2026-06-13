import { Slot } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeToggle } from '@/shared/components/theme-toggle';

export default function LandingLayout() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center justify-between px-6 py-4">
        <Text className="font-semibold text-lg text-primary">Libolink</Text>
        <ThemeToggle />
      </View>
      <View className="flex-1">
        <Slot />
      </View>
    </SafeAreaView>
  );
}
