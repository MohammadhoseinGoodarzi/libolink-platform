import { initialWindowMetrics, useSafeAreaInsets } from 'react-native-safe-area-context';

// Bottom safe-area inset that still works inside an RN Modal, where
// useSafeAreaInsets can report 0 (the modal subtree has no SafeAreaProvider).
// Falls back to the inset measured at app launch, so sheets clear the Android
// navigation bar the same way the bottom tab bar does.
export function useBottomInset(): number {
  const insets = useSafeAreaInsets();
  return insets.bottom || initialWindowMetrics?.insets.bottom || 0;
}
