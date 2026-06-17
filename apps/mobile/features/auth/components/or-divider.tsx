import { useDictionary } from '@repo/i18n';
import { View } from 'react-native';
import { Text } from '@/shared/components/ui';

export function OrDivider() {
  const t = useDictionary('Auth');
  return (
    <View className="my-1 flex-row items-center gap-3">
      <View className="h-px flex-1 bg-border" />
      <Text className="font-sans-semibold text-[12.5px] text-muted-foreground">{t('or')}</Text>
      <View className="h-px flex-1 bg-border" />
    </View>
  );
}
