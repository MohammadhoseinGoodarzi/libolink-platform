import { useDictionary } from '@repo/i18n';
import { useRouter } from 'expo-router';
import { Sparkles } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { ClubsView } from '@/features/clubs';
import { GlobalSearch } from '@/features/search';
import { Header } from '@/shared/components/shell';
import { BrandGradient, Text } from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';

// Brand-gradient "Premium" pill (handoff §6.5) — a custom gradient affordance
// the Button atom can't express, so a Pressable wraps BrandGradient with a role.
function PremiumPill() {
  const t = useDictionary('Clubs');
  const router = useRouter();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('premium')}
      onPress={() => router.push(ROUTES.subscription)}
      className="active:opacity-90"
    >
      <BrandGradient className="h-[30px] flex-row items-center gap-1.5 rounded-full px-3">
        <Sparkles size={14} color="#FFFFFF" />
        <Text className="font-sans-bold text-[12.5px] text-white">{t('premium')}</Text>
      </BrandGradient>
    </Pressable>
  );
}

function ClubsHeaderActions() {
  return (
    <View className="flex-row items-center gap-1">
      <PremiumPill />
      <GlobalSearch />
    </View>
  );
}

export default function ClubsScreen() {
  return (
    <View className="flex-1 bg-background">
      <Header right={<ClubsHeaderActions />} />
      <ClubsView />
    </View>
  );
}
