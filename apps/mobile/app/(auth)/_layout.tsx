import { Slot } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeToggle } from '@/shared/components/theme-toggle';

export default function AuthLayout() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="items-end px-4 pt-2">
        <ThemeToggle />
      </View>
      <View className="flex-1 justify-center px-6">
        <Slot />
      </View>
    </SafeAreaView>
  );
}
