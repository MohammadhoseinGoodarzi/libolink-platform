import { useEffect, useRef } from 'react';
import { Animated, Pressable } from 'react-native';
import { useThemeColors } from '@/shared/theme';
import type { SwitchProps } from './types';

// iOS-style toggle (handoff Settings kit): 50×30 track, 24 knob, green when on.
// The ONE switch — Settings rows and any boolean control toggle through this,
// never a hand-rolled track. Animates the knob + track colour together (JS
// driver, since backgroundColor can't run on the native driver).
export function Switch({ on, onToggle, disabled = false, accessibilityLabel }: SwitchProps) {
  const colors = useThemeColors();
  const progress = useRef(new Animated.Value(on ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: on ? 1 : 0,
      duration: 220,
      useNativeDriver: false,
    }).start();
  }, [on, progress]);

  const translateX = progress.interpolate({ inputRange: [0, 1], outputRange: [0, 20] });
  const backgroundColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.secondary, colors.primary],
  });

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: on, disabled }}
      {...(accessibilityLabel ? { accessibilityLabel } : {})}
      onPress={disabled ? undefined : onToggle}
      style={{ opacity: disabled ? 0.6 : 1 }}
    >
      <Animated.View
        style={{
          width: 50,
          height: 30,
          borderRadius: 9999,
          backgroundColor,
          justifyContent: 'center',
        }}
      >
        <Animated.View
          style={{
            width: 24,
            height: 24,
            marginLeft: 3,
            borderRadius: 9999,
            backgroundColor: '#FFFFFF',
            transform: [{ translateX }],
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3,
            elevation: 2,
          }}
        />
      </Animated.View>
    </Pressable>
  );
}
