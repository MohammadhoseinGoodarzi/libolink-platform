import { useDictionary } from '@repo/i18n';
import { useRouter } from 'expo-router';
import { Search, Sparkles } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { ClubsView } from '@/features/clubs';
import { Header } from '@/shared/components/shell';
import { BrandGradient, IconButton, Text, useToast } from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import { useThemeColors } from '@/shared/theme';

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
  const tCommon = useDictionary('Common');
  const colors = useThemeColors();
  const toast = useToast();
  // The header search opens the phase-2 search overlay; acknowledge the tap.
  return (
    <View className="flex-row items-center gap-1">
      <PremiumPill />
      <IconButton
        accessibilityLabel={tCommon('search')}
        onPress={() => toast.show(tCommon('comingSoon'))}
      >
        <Search size={21} color={colors.primary} />
      </IconButton>
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
