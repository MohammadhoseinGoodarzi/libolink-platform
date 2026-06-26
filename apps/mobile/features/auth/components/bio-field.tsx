import { View } from 'react-native';
import { InputBase, Text } from '@/shared/components/ui';
import type { BioFieldProps } from '../types';

export function BioField({
  label,
  value,
  onChangeText,
  placeholder,
  maxLength = 160,
}: BioFieldProps) {
  return (
    <View>
      <Text className="mb-1.5 font-sans-semibold text-[12px] uppercase tracking-wide text-muted-foreground">
        {label}
      </Text>
      <View className="rounded-2xl border border-border bg-secondary px-3.5 py-3">
        <InputBase
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          multiline
          maxLength={maxLength}
          textAlignVertical="top"
          className="min-h-[66px] font-sans-medium"
        />
      </View>
      <Text className="mt-1.5 text-right text-[11.5px] text-muted-foreground">
        {value.length}/{maxLength}
      </Text>
    </View>
  );
}
