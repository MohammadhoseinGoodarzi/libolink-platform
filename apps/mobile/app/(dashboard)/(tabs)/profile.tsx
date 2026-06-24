import { useDictionary } from '@repo/i18n';
import { useRouter } from 'expo-router';
import { Sparkles } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { ProfileView } from '@/features/profile';
import { GlobalSearch } from '@/features/search';
import { Header } from '@/shared/components/shell';
import { BrandGradient, Text } from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';

// Brand-gradient "Premium" pill (handoff §6.4). A custom gradient affordance the
// Button atom can't express, so a Pressable wraps BrandGradient with a role.
function PremiumButton() {
  const t = useDictionary('Profile');
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

export default function ProfileScreen() {
  return (
    <View className="flex-1 bg-background">
      <Header
        right={
          <View className="flex-row items-center gap-1">
            <PremiumButton />
            <GlobalSearch />
          </View>
        }
      />
      <ProfileView />
    </View>
  );
}
