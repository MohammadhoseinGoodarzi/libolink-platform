import { useDictionary } from '@repo/i18n';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, View } from 'react-native';
import { BrandLogo } from '@/shared/components/brand-logo';
import { Text } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';

function SplashDots() {
  const colors = useThemeColors();
  const d0 = useRef(new Animated.Value(0)).current;
  const d1 = useRef(new Animated.Value(0)).current;
  const d2 = useRef(new Animated.Value(0)).current;
  const dots = [
    { key: 's0', value: d0 },
    { key: 's1', value: d1 },
    { key: 's2', value: d2 },
  ];

  useEffect(() => {
    const animations = dots.map((dot, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 160),
          Animated.timing(dot.value, { toValue: -6, duration: 300, useNativeDriver: true }),
          Animated.timing(dot.value, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.delay((2 - i) * 160),
        ]),
      ),
    );
    for (const animation of animations) {
      animation.start();
    }
    return () => {
      for (const animation of animations) {
        animation.stop();
      }
    };
  }, [dots]);

  return (
    <View className="flex-row gap-2">
      {dots.map((dot) => (
        <Animated.View
          key={dot.key}
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: colors.primary,
            transform: [{ translateY: dot.value }],
          }}
        />
      ))}
    </View>
  );
}

// Brand splash (handoff §6.1). Tapping skips the auto-advance handled upstream.
export function SplashView({ onContinue }: { onContinue: () => void }) {
  const t = useDictionary('Auth');
  return (
    <Pressable onPress={onContinue} className="flex-1 items-center justify-center bg-background">
      <View className="items-center gap-5">
        <BrandLogo height={58} />
        <Text className="font-sans-medium text-[15px] text-muted-foreground">{t('tagline')}</Text>
      </View>
      <View className="absolute bottom-16">
        <SplashDots />
      </View>
    </Pressable>
  );
}
