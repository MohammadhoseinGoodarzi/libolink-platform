import { useRef } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { Text } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import type { OtpInputProps } from '../types';

const CELLS = ['c0', 'c1', 'c2', 'c3', 'c4', 'c5'] as const;

// 6-digit code input (handoff auth kit): a hidden field captures input; the
// cells render the digits with an active/error ring.
export function OtpInput({ value, onChange, error = false, autoFocus = false }: OtpInputProps) {
  const colors = useThemeColors();
  const ref = useRef<TextInput>(null);
  const active = value.length;

  return (
    <Pressable onPress={() => ref.current?.focus()}>
      <TextInput
        ref={ref}
        value={value}
        onChangeText={(text) => onChange(text.replace(/\D/g, '').slice(0, CELLS.length))}
        keyboardType="number-pad"
        autoFocus={autoFocus}
        maxLength={CELLS.length}
        textContentType="oneTimeCode"
        style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }}
      />
      <View className="flex-row justify-between gap-2">
        {CELLS.map((cell, i) => {
          const char = value[i];
          const isActive = i === active;
          const borderColor = error
            ? colors.destructive
            : isActive || char
              ? colors.primary
              : colors.border;
          return (
            <View
              key={cell}
              className="aspect-[1/1.18] flex-1 items-center justify-center rounded-[15px] bg-secondary"
              style={{ maxWidth: 50, borderWidth: isActive || char ? 1.8 : 1, borderColor }}
            >
              <Text className="font-sans-bold text-2xl text-foreground">{char ?? ''}</Text>
            </View>
          );
        })}
      </View>
    </Pressable>
  );
}
