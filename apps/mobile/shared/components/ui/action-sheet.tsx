import { useDictionary } from '@repo/i18n';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Modal, Pressable, useWindowDimensions, View } from 'react-native';
import { useBottomInset } from '@/shared/hooks/use-bottom-inset';
import { useThemeColors } from '@/shared/theme';
import { Text } from './text';
import type { ActionSheetProps } from './types';

const EASE = Easing.bezier(0.32, 0.72, 0, 1);

// iOS-style contextual menu (handoff §5): grouped action card + separate Cancel.
// Danger actions are crimson; everything else is brand green.
function ActionSheet({ open, onClose, title, actions }: ActionSheetProps) {
  const colors = useThemeColors();
  const t = useDictionary('Common');
  const bottomInset = useBottomInset();
  const { height: windowHeight } = useWindowDimensions();
  const translateY = useRef(new Animated.Value(windowHeight)).current;
  const scrim = useRef(new Animated.Value(0)).current;
  // Dedicated fade value, so the menu visibly eases in/out rather than tracking
  // the slide's ease-out position (which snaps to opaque almost instantly).
  const opacity = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = useState(open);

  useEffect(() => {
    if (open) {
      setMounted(true);
      translateY.setValue(windowHeight);
      opacity.setValue(0);
      Animated.parallel([
        Animated.timing(scrim, { toValue: 1, duration: 800, easing: EASE, useNativeDriver: true }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          easing: EASE,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 800,
          easing: EASE,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scrim, { toValue: 0, duration: 500, easing: EASE, useNativeDriver: true }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 500,
          easing: EASE,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: windowHeight,
          duration: 500,
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
          style={{
            transform: [{ translateY }],
            opacity,
            paddingBottom: bottomInset + 8,
          }}
          className="px-2"
        >
          <View className="mb-2 overflow-hidden rounded-lg border border-border bg-card">
            {title ? (
              <View className="border-border border-b px-4 py-3">
                <Text className="text-center text-[12.5px] text-muted-foreground">{title}</Text>
              </View>
            ) : null}
            {actions.map((action, index) => (
              <Pressable
                key={action.label}
                accessibilityRole="button"
                onPress={() => {
                  onClose();
                  action.onPress?.();
                }}
                className={cnRow(index)}
              >
                {action.icon ? (
                  <action.icon
                    size={20}
                    color={action.danger ? colors.destructive : colors.primary}
                  />
                ) : null}
                <Text
                  className={
                    action.danger
                      ? 'text-[17px] text-destructive font-sans-medium'
                      : 'text-[17px] text-primary font-sans-medium'
                  }
                  style={action.bold ? boldStyle : undefined}
                >
                  {action.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={onClose}
            className="h-14 items-center justify-center rounded-lg bg-card"
          >
            <Text className="text-[17px] text-primary font-sans-bold">{t('cancel')}</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const boldStyle = { fontFamily: 'Vazirmatn-Bold' } as const;

function cnRow(index: number): string {
  return index === 0
    ? 'h-14 flex-row items-center justify-center gap-2'
    : 'h-14 flex-row items-center justify-center gap-2 border-border border-t';
}

export { ActionSheet };
