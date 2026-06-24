import { useRef } from 'react';
import { Animated, Easing, PanResponder, Pressable, View } from 'react-native';
import { Text } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import type { SwipeAction, SwipeableRowProps } from '../types';

// Soft ease-out matching the app's sheet/menu curve (handoff §3.8).
const EASE = Easing.bezier(0.32, 0.72, 0, 1);
const TRAILING_W = 78; // each trailing action (Archive / Mute / Delete)
const LEADING_W = 90; // the leading action (Read / Unread)
// How far past the threshold a release must travel to latch the row open.
const LATCH = 0.45;

function ActionButton({
  action,
  width,
  onClose,
}: {
  action: SwipeAction;
  width: number;
  onClose: () => void;
}) {
  const Icon = action.icon;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={action.label}
      onPress={() => {
        action.onPress();
        // Collapse the row after acting — non-removing actions (Read/Mute/Pin)
        // would otherwise stay open; removing ones unmount harmlessly mid-close.
        onClose();
      }}
      style={{ width, backgroundColor: action.background }}
      className="items-center justify-center gap-1 active:opacity-80"
    >
      <Icon size={20} color="#FFFFFF" />
      <Text className="font-sans-semibold text-[11px] text-white">{action.label}</Text>
    </Pressable>
  );
}

// Swipe-to-reveal row (handoff §6.3) built on PanResponder + Animated (no
// gesture-handler dep). Swipe left to reveal trailing actions, right for the
// leading action; a tap fires onPress, or closes the row when it's already open.
// Horizontal-dominant gating lets the vertical list keep scrolling.
export function SwipeableRow({
  children,
  onPress,
  leadingActions = [],
  trailingActions = [],
}: SwipeableRowProps) {
  const colors = useThemeColors();
  const translateX = useRef(new Animated.Value(0)).current;
  const startX = useRef(0);
  const openRef = useRef(false);

  const leadingWidth = leadingActions.length * LEADING_W;
  const trailingWidth = trailingActions.length * TRAILING_W;

  // Leading + trailing panels overlap in the middle on a narrow row, so show only
  // the one being revealed: leading when swiping right (translateX > 0), trailing
  // when swiping left (< 0). Otherwise the trailing panel bleeds over the leading
  // buttons (and vice-versa).
  const leadingOpacity = translateX.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const trailingOpacity = translateX.interpolate({
    inputRange: [-1, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const settle = (to: number) => {
    openRef.current = to !== 0;
    Animated.timing(translateX, {
      toValue: to,
      duration: 220,
      easing: EASE,
      useNativeDriver: true,
    }).start();
  };

  const pan = useRef(
    PanResponder.create({
      // Only claim clearly-horizontal drags so the ScrollView keeps vertical scroll.
      onMoveShouldSetPanResponder: (_e, g) =>
        Math.abs(g.dx) > 10 && Math.abs(g.dx) > Math.abs(g.dy) * 1.4,
      onPanResponderGrant: () => {
        translateX.stopAnimation((v: number) => {
          startX.current = v;
        });
      },
      onPanResponderMove: (_e, g) => {
        let next = startX.current + g.dx;
        // Clamp to the revealed width with a little rubber-band overshoot.
        next = Math.max(-trailingWidth - 24, Math.min(leadingWidth + 24, next));
        translateX.setValue(next);
      },
      onPanResponderRelease: (_e, g) => {
        const final = startX.current + g.dx;
        if (trailingWidth > 0 && final < -trailingWidth * LATCH) {
          settle(-trailingWidth);
        } else if (leadingWidth > 0 && final > leadingWidth * LATCH) {
          settle(leadingWidth);
        } else {
          settle(0);
        }
      },
      onPanResponderTerminate: () => settle(0),
    }),
  ).current;

  const handlePress = () => {
    if (openRef.current) {
      settle(0);
      return;
    }
    onPress();
  };

  return (
    <View className="relative overflow-hidden">
      {leadingActions.length > 0 ? (
        <Animated.View
          style={{ opacity: leadingOpacity }}
          className="absolute top-0 bottom-0 left-0 flex-row"
        >
          {leadingActions.map((a) => (
            <ActionButton key={a.key} action={a} width={LEADING_W} onClose={() => settle(0)} />
          ))}
        </Animated.View>
      ) : null}
      {trailingActions.length > 0 ? (
        <Animated.View
          style={{ opacity: trailingOpacity }}
          className="absolute top-0 right-0 bottom-0 flex-row"
        >
          {trailingActions.map((a) => (
            <ActionButton key={a.key} action={a} width={TRAILING_W} onClose={() => settle(0)} />
          ))}
        </Animated.View>
      ) : null}

      {/* Opaque foreground (matches the list background) so the action buttons
          behind stay hidden until the row is swiped open. */}
      <Animated.View
        style={{ transform: [{ translateX }], backgroundColor: colors.background }}
        {...pan.panHandlers}
      >
        <Pressable onPress={handlePress} className="active:opacity-70">
          {children}
        </Pressable>
      </Animated.View>
    </View>
  );
}
