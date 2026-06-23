import { useDictionary } from '@repo/i18n';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Modal, Pressable, useWindowDimensions, View } from 'react-native';
import { useBottomInset } from '@/shared/hooks/use-bottom-inset';
import { useKeyboardHeight } from '@/shared/hooks/use-keyboard-height';
import { useThemeColors } from '@/shared/theme';

// Soft ease-out (no spring/bounce, handoff §3.8) matching the prototype curve.
const EASE = Easing.bezier(0.32, 0.72, 0, 1);

type BottomSheetProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Accessible label for the dialog. */
  label?: string;
  /** Fixed (non-scrolling) region rendered below the grabber, above children —
      e.g. a sheet title bar. Stays put while the body scrolls, and is counted
      against the sheet's height so the body never overflows the 90% box. */
  header?: ReactNode;
};

// Bottom sheet shell (handoff §5): grabber, ease slide-up, scrim. Built on RN
// Modal + Animated (no gesture-handler dep). Dismiss via the scrim tap or a
// close control in the header/children. (Drag-to-dismiss was attempted and
// removed — see docs/ENGINEERING_LOG.md 2026-06-22.)
function BottomSheet({ open, onClose, children, label, header }: BottomSheetProps) {
  const colors = useThemeColors();
  const t = useDictionary('Common');
  const bottomInset = useBottomInset();
  const keyboardHeight = useKeyboardHeight();
  const { height: windowHeight } = useWindowDimensions();
  const translateY = useRef(new Animated.Value(windowHeight)).current;
  const scrim = useRef(new Animated.Value(0)).current;
  // Dedicated fade value, so the sheet visibly eases in/out rather than tracking
  // the slide's ease-out position (which snaps to opaque almost instantly).
  const opacity = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = useState(open);

  useEffect(() => {
    if (open) {
      setMounted(true);
      translateY.setValue(windowHeight);
      opacity.setValue(0);
      Animated.parallel([
        Animated.timing(scrim, { toValue: 1, duration: 1000, easing: EASE, useNativeDriver: true }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1000,
          easing: EASE,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 1000,
          easing: EASE,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scrim, { toValue: 0, duration: 750, easing: EASE, useNativeDriver: true }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 750,
          easing: EASE,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: windowHeight,
          duration: 750,
          easing: EASE,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) {
          setMounted(false);
        }
      });
    }
  }, [open, windowHeight, scrim, translateY, opacity]);

  if (!mounted) {
    return null;
  }

  return (
    <Modal visible transparent animationType="none" statusBarTranslucent onRequestClose={onClose}>
      <View className="flex-1 justify-end">
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: scrim,
            backgroundColor: colors.scrim,
          }}
        >
          <Pressable accessibilityLabel={t('close')} className="flex-1" onPress={onClose} />
        </Animated.View>

        <Animated.View
          accessibilityViewIsModal
          accessibilityLabel={label}
          style={{
            transform: [{ translateY }],
            opacity,
            maxHeight: '90%',
            backgroundColor: colors.background,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            // Closed: clear the Android nav bar. Open: the Modal doesn't resize
            // for the keyboard, so pad by the measured keyboard overlap to sit
            // the composer exactly on top of it (the comments sheet shrinks to
            // match). The overlap already spans any nav bar, so no extra gap.
            paddingBottom: keyboardHeight > 0 ? keyboardHeight : bottomInset,
          }}
        >
          {/* Grabber handle — visual affordance for the sheet. */}
          <View className="items-center pt-3 pb-3">
            <View className="h-1.5 w-12 rounded-full bg-primary" />
          </View>
          {header}
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

export { BottomSheet };
