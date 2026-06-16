import { TextInput, View } from 'react-native';
import { Text } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';

type BioFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
};

export function BioField({
  label,
  value,
  onChangeText,
  placeholder,
  maxLength = 160,
}: BioFieldProps) {
  const colors = useThemeColors();
  return (
    <View>
      <Text className="mb-1.5 font-sans-semibold text-[12px] uppercase tracking-wide text-muted-foreground">
        {label}
      </Text>
      <View className="rounded-2xl border border-border bg-secondary px-3.5 py-3">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.mutedForeground}
          multiline
          maxLength={maxLength}
          textAlignVertical="top"
          className="min-h-[66px] font-sans-medium text-base text-foreground"
        />
      </View>
      <Text className="mt-1.5 text-right text-[11.5px] text-muted-foreground">
        {value.length}/{maxLength}
      </Text>
    </View>
  );
}
