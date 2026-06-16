import '../global.css';

import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { hideAsync, preventAutoHideAsync } from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback } from 'react';
import { View } from 'react-native';
import { FONT_MAP } from '@/shared/fonts';
import { Providers } from '@/shared/providers';
import { useThemeBootstrap } from '@/shared/theme';

// Keep the splash screen up until fonts + persisted theme are ready.
void preventAutoHideAsync();

// Lives inside <Providers> so the theme bootstrap can touch jotai + NativeWind.
function RootGate() {
  const [fontsLoaded, fontError] = useFonts(FONT_MAP);
  const themeReady = useThemeBootstrap();
  const ready = (fontsLoaded || fontError !== null) && themeReady;

  const onLayout = useCallback(() => {
    if (ready) {
      void hideAsync();
    }
  }, [ready]);

  if (!ready) {
    return null;
  }

  return (
    <View className="flex-1 bg-background" onLayout={onLayout}>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}

export default function RootLayout() {
  return (
    <Providers>
      <RootGate />
    </Providers>
  );
}
