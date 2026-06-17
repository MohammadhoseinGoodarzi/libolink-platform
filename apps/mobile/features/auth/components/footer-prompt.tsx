import { View } from 'react-native';
import { Text } from '@/shared/components/ui';
import { TextLink } from './text-link';

export function FooterPrompt({
  text,
  action,
  onPress,
}: {
  text: string;
  action: string;
  onPress?: (() => void) | undefined;
}) {
  return (
    <View className="flex-row items-center justify-center gap-1.5 pt-1">
      <Text className="text-[14.5px] text-muted-foreground">{text}</Text>
      <TextLink onPress={onPress}>{action}</TextLink>
    </View>
  );
}
