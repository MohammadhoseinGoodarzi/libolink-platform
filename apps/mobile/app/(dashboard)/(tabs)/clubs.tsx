import { useDictionary } from '@repo/i18n';
import { useRouter } from 'expo-router';
import { Sparkles } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { ClubsView } from '@/features/clubs';
import { Header } from '@/shared/components/shell';
import { Text } from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';

// Solid forest-green "Premium" pill (handoff §6.5).
function PremiumPill() {
  const t = useDictionary('Clubs');
  const router = useRouter();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('premium')}
      onPress={() => router.push(ROUTES.subscription)}
      className="h-[30px] flex-row items-center gap-1.5 rounded-full bg-primary px-3 active:opacity-90"
    >
      <Sparkles size={14} color="#FFFFFF" />
      <Text className="font-sans-bold text-[12.5px] text-white">{t('premium')}</Text>
    </Pressable>
  );
}

export default function ClubsScreen() {
  return (
    <View className="flex-1 bg-background">
      <Header right={<PremiumPill />} />
      <ClubsView />
    </View>
  );
}
