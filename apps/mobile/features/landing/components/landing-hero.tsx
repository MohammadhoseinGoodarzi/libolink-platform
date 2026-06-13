import { useDictionary } from '@repo/i18n';
import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { Button } from '@/shared/components/ui/button';
import { ROUTES } from '@/shared/constants';

export function LandingHero() {
  const t = useDictionary('Landing');
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center gap-6 px-6">
      <Text className="text-center font-bold text-4xl text-foreground">{t('headline')}</Text>
      <Text className="text-center text-lg text-muted-foreground">{t('subheadline')}</Text>
      <View className="w-full gap-3">
        <Button size="lg" onPress={() => router.push(ROUTES.signup)}>
          {t('getStarted')}
        </Button>
        <Button size="lg" variant="outline" onPress={() => router.push(ROUTES.login)}>
          {t('signIn')}
        </Button>
      </View>
    </View>
  );
}
