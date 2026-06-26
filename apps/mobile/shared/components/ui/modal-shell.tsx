import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Modal, Pressable, useWindowDimensions, View } from 'react-native';
import { useThemeColors } from '@/shared/theme';
import type { ModalShellProps } from './types';

// Soft ease-out (no spring/bounce, handoff §3.8) matching the prototype curve.
const EASE = Easing.bezier(0.32, 0.72, 0, 1);

// The one overlay primitive: Modal + scrim + slide/fade + mount-while-animating
// lifecycle. A single 0→1 `progress` drives the scrim opacity, the panel slide
// (per placement) and the panel fade, all on the native driver. Variants pass
// only their surface (panelClassName/panelStyle) + children — BottomSheet,
// ActionSheet, the drawer and the full-screen screens all build on this so the
// Modal/Animated plumbing lives in exactly one place. Dismiss via the scrim tap,
// the hardware back button (onRequestClose) or a close control in the children.
// (Drag-to-dismiss is intentionally absent — see docs/ENGINEERING_LOG.md 2026-06-22.)
function ModalShell({
  open,
  onClose,
  children,
  placement = 'bottom',
  scrim,
  closeLabel,
  fadePanel,
  slideDistance = 320,
  panelClassName,
  panelStyle,
  label,
  enterDuration = 800,
  exitDuration = 500,
  easing = EASE,
}: ModalShellProps) {
  const colors = useThemeColors();
  const { height: windowHeight } = useWindowDimensions();
  const progress = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = useState(open);

  useEffect(() => {
    if (open) {
      setMounted(true);
      Animated.timing(progress, {
        toValue: 1,
        duration: enterDuration,
        easing,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(progress, {
        toValue: 0,
        duration: exitDuration,
        easing,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          setMounted(false);
        }
      });
    }
  }, [open, progress, enterDuration, exitDuration, easing]);

  if (!mounted) {
    return null;
  }

  const showScrim = scrim ?? placement !== 'full';
  const fade = fadePanel ?? placement !== 'left';

  const transform =
    placement === 'bottom'
      ? [
          {
            translateY: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [windowHeight, 0],
            }),
          },
        ]
      : placement === 'left'
        ? [
            {
              translateX: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [-slideDistance, 0],
              }),
            },
          ]
        : undefined;

  // The panel's structural box per placement; the surface (bg, radius, padding)
  // comes from the variant via panelClassName/panelStyle.
  const placementStyle =
    placement === 'left'
      ? ({ position: 'absolute', left: 0, top: 0, bottom: 0, width: slideDistance } as const)
      : placement === 'full'
        ? ({ flex: 1 } as const)
        : undefined;

  return (
    <Modal visible transparent animationType="none" statusBarTranslucent onRequestClose={onClose}>
      <View className={placement === 'bottom' ? 'flex-1 justify-end' : 'flex-1'}>
        {showScrim ? (
          <Animated.View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: progress,
              backgroundColor: colors.scrim,
            }}
          >
            <Pressable accessibilityLabel={closeLabel} className="flex-1" onPress={onClose} />
          </Animated.View>
        ) : null}

        <Animated.View
          accessibilityViewIsModal
          accessibilityLabel={label}
          {...(panelClassName ? { className: panelClassName } : {})}
          style={[placementStyle, { transform, opacity: fade ? progress : 1 }, panelStyle]}
        >
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

export { ModalShell };
