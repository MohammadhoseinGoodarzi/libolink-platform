import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ScreenScrollViewProps } from './types';

// The ONE scrollable-page primitive: a ScrollView that always reserves the
// device's bottom safe-area inset at the end of its content, so a stacked page's
// last rows clear the home indicator / gesture bar. Use this for every
// full-screen scrollable page (those WITHOUT the bottom tab bar, which handles
// its own inset) instead of a raw <ScrollView> with a hand-rolled `pb-*` — that
// is exactly how a page forgets the inset. Pass page padding via
// `contentContainerClassName` (px/pt only); the bottom is owned here.
export function ScreenScrollView({
  bottomSpacing = 24,
  contentContainerStyle,
  ...rest
}: ScreenScrollViewProps) {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      {...rest}
      contentContainerStyle={[
        { paddingBottom: insets.bottom + bottomSpacing },
        contentContainerStyle,
      ]}
    />
  );
}
