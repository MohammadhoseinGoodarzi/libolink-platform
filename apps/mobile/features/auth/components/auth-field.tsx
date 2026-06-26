import { useDictionary } from '@repo/i18n';
import { cn } from '@repo/utils';
import { Check, Eye, EyeOff } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { InputBase, Text } from '@/shared/components/ui';
import { oklchToHex, useThemeColors } from '@/shared/theme';
import type { AuthFieldProps } from '../types';

// Brighter success green for the inline "valid" check (matches the prototype).
const SUCCESS = oklchToHex(0.6, 0.15, 150);

// Filled, native-feel field with inline validation (handoff auth kit): recessed
// fill, 16px radius, 52px tall, leading icon, focus/error ring, ok check, secure
// toggle, and an error/hint line.
export function AuthField({
  value,
  onChangeText,
  label,
  placeholder,
  icon: Icon,
  prefix,
  secure = false,
  ok = false,
  error,
  hint,
  ...inputProps
}: AuthFieldProps) {
  const colors = useThemeColors();
  const tCommon = useDictionary('Common');
  const [focused, setFocused] = useState(false);
  const [reveal, setReveal] = useState(false);

  const borderColor = error ? colors.destructive : focused ? colors.primary : colors.border;
  const iconColor = focused ? colors.primary : colors.mutedForeground;

  return (
    <View>
      {label ? (
        <Text className="mb-1.5 font-sans-semibold text-[12px] uppercase tracking-wide text-muted-foreground">
          {label}
        </Text>
      ) : null}

      <InputBase
        containerClassName="h-[52px] gap-2.5 rounded-2xl bg-secondary px-3.5"
        containerStyle={{ borderWidth: focused || error ? 1.5 : 1, borderColor }}
        left={
          <>
            {Icon ? <Icon size={19} color={iconColor} /> : null}
            {prefix ? (
              <Text className="font-sans-medium text-base text-muted-foreground">{prefix}</Text>
            ) : null}
          </>
        }
        right={
          <>
            {ok && !secure ? <Check size={18} color={SUCCESS} /> : null}
            {secure ? (
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
            ) : null}
          </>
        }
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secure && !reveal}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="h-full font-sans-medium"
        {...inputProps}
      />

      {error || hint ? (
        <Text
          className={cn(
            'mt-1.5 px-0.5 text-[12px] leading-4',
            error ? 'text-destructive' : 'text-muted-foreground',
          )}
        >
          {error || hint}
        </Text>
      ) : null}
    </View>
  );
}
