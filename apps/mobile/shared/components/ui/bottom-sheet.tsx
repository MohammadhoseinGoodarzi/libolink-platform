import { useDictionary } from '@repo/i18n';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Modal,
  PanResponder,
  Pressable,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/shared/theme';

// Soft ease-out (no spring/bounce, handoff §3.8) matching the prototype curve.
const EASE = Easing.bezier(0.32, 0.72, 0, 1);
const DISMISS_THRESHOLD = 90;

type BottomSheetProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Accessible label for the dialog. */
  label?: string;
};

// Bottom sheet shell (handoff §5): grabber, ease slide-up, drag-to-dismiss,
// scrim. Built on RN Modal + Animated + PanResponder (no gesture-handler dep).
function BottomSheet({ open, onClose, children, label }: BottomSheetProps) {
  const colors = useThemeColors();
  const t = useDictionary('Common');
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const translateY = useRef(new Animated.Value(windowHeight)).current;
  const scrim = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = useState(open);

  useEffect(() => {
    if (open) {
      setMounted(true);
      translateY.setValue(windowHeight);
      Animated.parallel([
        Animated.timing(scrim, { toValue: 1, duration: 240, easing: EASE, useNativeDriver: true }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 380,
          easing: EASE,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scrim, { toValue: 0, duration: 200, easing: EASE, useNativeDriver: true }),
        Animated.timing(translateY, {
          toValue: windowHeight,
          duration: 240,
          easing: EASE,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) {
          setMounted(false);
        }
      });
    }
  }, [open, windowHeight, scrim, translateY]);

  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_evt, gesture) => gesture.dy > 4,
      onPanResponderMove: (_evt, gesture) => {
        if (gesture.dy > 0) {
          translateY.setValue(gesture.dy);
        }
      },
      onPanResponderRelease: (_evt, gesture) => {
        if (gesture.dy > DISMISS_THRESHOLD) {
          onClose();
        } else {
          Animated.timing(translateY, {
            toValue: 0,
            duration: 200,
            easing: EASE,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

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
            maxHeight: '90%',
            backgroundColor: colors.background,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingBottom: insets.bottom,
          }}
        >
          <View {...pan.panHandlers} className="items-center pt-2 pb-1.5">
            <View className="h-1.5 w-10 rounded-full bg-border" />
          </View>
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

export { BottomSheet };
