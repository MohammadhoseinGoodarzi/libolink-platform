import { useDictionary } from '@repo/i18n';
import { Text, View } from 'react-native';

export function HomeView() {
  const t = useDictionary('Home');
  return (
    <View className="gap-6">
      <Text className="font-semibold text-2xl text-foreground">{t('feedTitle')}</Text>
      <View className="rounded-lg border border-border border-dashed p-8">
        <Text className="text-center text-muted-foreground">{t('emptyFeed')}</Text>
      </View>
    </View>
  );
}
