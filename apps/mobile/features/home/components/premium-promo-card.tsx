import { useDictionary } from '@repo/i18n';
import { useRouter } from 'expo-router';
import { Sparkles } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { BrandGradient, Text } from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import { useShadow } from '@/shared/theme';

// Feed-native Premium upsell shown after the stories row (handoff §6.2). Uses
// the one sanctioned green→navy gradient; taps route to the Subscription screen.
export function PremiumPromoCard() {
  const t = useDictionary('Home');
  const router = useRouter();
  const shadow = useShadow('lifted');

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('goPremium')}
      onPress={() => router.navigate(ROUTES.subscription)}
      className="mx-3.5 mt-2.5 mb-1 overflow-hidden rounded-[20px] active:opacity-90"
      style={shadow}
    >
      <BrandGradient>
        {/* decorative translucent disc (color alpha, not element opacity) */}
        <View
          className="absolute rounded-full bg-white/10"
          style={{ top: -40, right: -16, width: 120, height: 120 }}
        />
        <View className="flex-row items-center gap-3 p-[15px]">
          <View className="h-11 w-11 items-center justify-center rounded-[14px] bg-white/15">
            <Sparkles size={23} color="#FFFFFF" />
          </View>
          <View className="flex-1">
            <Text className="font-sans-bold text-[15.5px] text-white">{t('goPremium')}</Text>
            <Text className="mt-0.5 font-sans text-[12.5px] text-white/80">
              {t('goPremiumBlurb')}
            </Text>
          </View>
          <View className="h-[34px] justify-center rounded-full bg-white px-4">
            <Text className="font-sans-bold text-[13px] text-primary">{t('get')}</Text>
          </View>
        </View>
      </BrandGradient>
    </Pressable>
  );
}
