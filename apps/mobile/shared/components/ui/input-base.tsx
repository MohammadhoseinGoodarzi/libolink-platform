import { cn } from '@repo/utils';
import { TextInput, View } from 'react-native';
import { useThemeColors } from '@/shared/theme';
import type { InputBaseProps } from './types';

// The one shared TextInput primitive: owns the lone <TextInput>, the Vazirmatn
// family, the muted placeholder colour, and the vertical-centring recipe. Two
// modes (the box affordances decide):
//   • bare  — renders just the TextInput; `className` styles it directly. Used by
//     the plain <Input> and by the multiline chat/compose/comments composers that
//     reuse <Input> and override the box via className.
//   • boxed — `‹View flex-row items-center› {left} ‹TextInput flex-1› {right}`,
//     triggered by passing any of left/right/containerClassName/containerStyle.
//     Used by leading-icon / trailing-toggle fields (Search, Password, AuthField).
function InputBase({
  left,
  right,
  containerClassName,
  containerStyle,
  className,
  style,
  ...props
}: InputBaseProps) {
  const colors = useThemeColors();
  const boxed =
    left != null || right != null || containerClassName != null || containerStyle != null;

  const field = (
    <TextInput
      placeholderTextColor={colors.mutedForeground}
      // Tight glyph box (no Android font padding) + a 1px top nudge so the text and
      // placeholder land on the optical centre. textAlignVertical is multiline-only
      // on Android, so it can't centre a single-line field — this recipe is the fix.
      style={[{ includeFontPadding: false, paddingTop: 1, paddingBottom: 0 }, style]}
      className={cn('font-sans text-base text-foreground', boxed && 'flex-1', className)}
      {...props}
    />
  );

  if (!boxed) {
    return field;
  }

  return (
    <View className={cn('flex-row items-center', containerClassName)} style={containerStyle}>
      {left}
      {field}
      {right}
    </View>
  );
}

export { InputBase };
