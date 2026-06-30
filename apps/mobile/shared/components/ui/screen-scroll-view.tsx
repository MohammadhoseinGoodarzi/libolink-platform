import { cssInterop } from 'nativewind';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ScreenScrollViewProps } from './types';

// KeyboardAwareScrollView is third-party, so NativeWind doesn't auto-map its
// className props (only core RN ScrollView is). Register the SAME interop
// NativeWind uses for ScrollView so `className` → `style` and (critically)
// `contentContainerClassName` → `contentContainerStyle` keep working — otherwise
// callers' page padding (e.g. SettingsScreenShell's `pt-4`) is silently dropped.
cssInterop(KeyboardAwareScrollView, {
  className: 'style',
  contentContainerClassName: 'contentContainerStyle',
});

// The ONE scrollable-page primitive: a keyboard-aware ScrollView that always
// reserves the device's bottom safe-area inset at the end of its content, so a
// stacked page's last rows clear the home indicator / gesture bar. Use this for
// every full-screen scrollable page (those WITHOUT the bottom tab bar, which
// handles its own inset) instead of a raw <ScrollView> with a hand-rolled `pb-*` —
// that is exactly how a page forgets the inset. Pass page padding via
// `contentContainerClassName` (px/pt only); the bottom is owned here.
//
// Built on react-native-keyboard-controller's KeyboardAwareScrollView so any
// focused input on a page rises above the keyboard automatically (consistent on
// Android edge-to-edge + iOS) — no per-screen KeyboardAvoidingView. `bottomOffset`
// is the gap kept between the focused field and the keyboard top.
export function ScreenScrollView({
  bottomSpacing = 24,
  bottomOffset = 24,
  contentContainerStyle,
  ...rest
}: ScreenScrollViewProps) {
  const insets = useSafeAreaInsets();
  return (
    <KeyboardAwareScrollView
      bottomOffset={bottomOffset}
      {...rest}
      // Injected padding goes LAST so it always wins — the bottom inset is owned
      // here and must not be silently dropped by a consumer's contentContainerStyle.
      contentContainerStyle={[
        contentContainerStyle,
        { paddingBottom: insets.bottom + bottomSpacing },
      ]}
    />
  );
}
