import { useDictionary } from '@repo/i18n';
import { cn } from '@repo/utils';
import { Eye, EyeOff } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { InputBase, Text } from '@/shared/components/ui';
import { oklchToHex, useThemeColors } from '@/shared/theme';
import type { SettingsFieldProps } from '../types';

// Brighter success green for the "available" hint (matches the auth field).
const SUCCESS = oklchToHex(0.6, 0.15, 150);

// Labeled form field for the Account screens (handoff `ASK.Field`): uppercase
// label, recessed InputBase with a focus ring, optional prefix / secure toggle /
// multiline, and a tone-coloured hint line.
function SettingsField({
  label,
  value,
  onChangeText,
  placeholder,
  prefix,
  secure = false,
  multiline = false,
  hint,
  hintTone = 'muted',
  autoFocus,
  keyboardType,
  autoCapitalize,
  maxLength,
}: SettingsFieldProps) {
  const colors = useThemeColors();
  const tCommon = useDictionary('Common');
  const [focused, setFocused] = useState(false);
  const [reveal, setReveal] = useState(false);

  const borderColor = focused ? colors.primary : colors.border;
  const hintColor =
    hintTone === 'error'
      ? colors.destructive
      : hintTone === 'success'
        ? SUCCESS
        : colors.mutedForeground;

  return (
    <View>
      {label ? (
        <Text className="mb-1.5 font-sans-semibold text-[12px] uppercase tracking-wide text-muted-foreground">
          {label}
        </Text>
      ) : null}

      <InputBase
        containerClassName={cn(
          'gap-2.5 rounded-2xl bg-secondary px-3.5',
          multiline ? 'min-h-[96px] items-start py-3' : 'h-[52px]',
        )}
        containerStyle={{ borderWidth: focused ? 1.5 : 1, borderColor }}
        left={
          prefix ? (
            <Text className="font-sans-medium text-base text-muted-foreground">{prefix}</Text>
          ) : null
        }
        right={
          secure ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={reveal ? tCommon('hidePassword') : tCommon('showPassword')}
              onPress={() => setReveal((prev) => !prev)}
              hitSlop={8}
            >
              {reveal ? (
                <EyeOff size={18} color={colors.mutedForeground} />
              ) : (
                <Eye size={18} color={colors.mutedForeground} />
              )}
            </Pressable>
          ) : null
        }
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secure && !reveal}
        autoFocus={autoFocus}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        maxLength={maxLength}
        multiline={multiline}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={cn('font-sans-medium', !multiline && 'h-full')}
        style={multiline ? { textAlignVertical: 'top', minHeight: 72 } : undefined}
      />

      {hint ? (
        <Text className="mt-1.5 px-0.5 text-[12px] leading-4" style={{ color: hintColor }}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

export { SettingsField };
