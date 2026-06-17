import { Pressable } from 'react-native';
import { Text } from '@/shared/components/ui';

export function TextLink({
  children,
  onPress,
}: {
  children: string;
  onPress?: (() => void) | undefined;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      hitSlop={6}
      className="active:opacity-60"
    >
      <Text className="font-sans-bold text-[14.5px] text-link">{children}</Text>
    </Pressable>
  );
}
