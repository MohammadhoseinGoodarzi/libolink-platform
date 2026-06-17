import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Animated, Easing, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from './text';

const EASE = Easing.bezier(0.32, 0.72, 0, 1);

type ToastContextValue = { show: (message: string) => void };

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within <ToastProvider>');
  }
  return ctx;
}

// Centered one-shot confirmation toast (handoff §5): ink pill, auto-dismiss.
export function ToastProvider({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState<string | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback(
    (next: string) => {
      setMessage(next);
      if (timer.current) {
        clearTimeout(timer.current);
      }
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        easing: EASE,
        useNativeDriver: true,
      }).start();
      timer.current = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          easing: EASE,
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (finished) {
            setMessage(null);
          }
        });
      }, 2100);
    },
    [opacity],
  );

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      <View className="flex-1">
        {children}
        {message ? (
          <Animated.View
            pointerEvents="none"
            style={{ position: 'absolute', left: 0, right: 0, bottom: insets.bottom + 90, opacity }}
            className="items-center"
          >
            <View className="max-w-[82%] rounded-full bg-foreground px-4 py-2.5">
              <Text className="text-center font-sans-semibold text-[13.5px] text-background">
                {message}
              </Text>
            </View>
          </Animated.View>
        ) : null}
      </View>
    </ToastContext.Provider>
  );
}
