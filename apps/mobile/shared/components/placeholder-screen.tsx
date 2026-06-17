import { useDictionary } from '@repo/i18n';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { Header } from './shell/header';
import { Text } from './ui/text';

// Temporary scaffold for routes whose feature slice isn't built yet. Each is
// replaced by its real screen as the §9 build order reaches it.
export function PlaceholderScreen({ title, back = false }: { title: string; back?: boolean }) {
  const router = useRouter();
  const tCommon = useDictionary('Common');
  return (
    <View className="flex-1 bg-background">
      <Header title={title} showBack={back} onBack={back ? () => router.back() : undefined} />
      <View className="flex-1 items-center justify-center px-8">
        <Text className="text-center text-base text-muted-foreground">
          {title} · {tCommon('comingSoon')}
        </Text>
      </View>
    </View>
  );
}
