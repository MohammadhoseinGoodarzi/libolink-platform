import { useDictionary } from '@repo/i18n';
import { Check, Crown } from 'lucide-react-native';
import { View } from 'react-native';
import { BrandGradient, Text } from '@/shared/components/ui';

// Premium hero (handoff Subscription): the sanctioned green→navy gradient card
// (same as the AI assistant) with the headline price. White-on-gradient text uses
// colour alphas (not element opacity), which the locked rules allow.
function PremiumHero() {
  const t = useDictionary('Subscription');
  return (
    <BrandGradient className="mx-4 mt-4 overflow-hidden rounded-2xl">
      <View className="p-5">
        <View className="flex-row items-center gap-2.5">
          <View className="h-[38px] w-[38px] items-center justify-center rounded-xl bg-white/10">
            <Crown size={21} color="#FFFFFF" />
          </View>
          <Text
            className="font-sans-bold text-[12.5px] text-white/70 uppercase"
            style={{ letterSpacing: 1.4 }}
          >
            {t('heroOverline')}
          </Text>
        </View>

        <Text
          className="mt-4 font-sans-bold text-[30px] text-white"
          style={{ letterSpacing: -0.6 }}
        >
          {t('heroTitle')}
        </Text>
        <Text className="mt-2 font-sans text-[14.5px] text-white/80 leading-[22px]">
          {t('heroBody')}
        </Text>

        <View className="mt-4 flex-row items-center gap-4">
          <View>
            <View className="flex-row items-baseline gap-1">
              <Text className="font-sans-semibold text-[15px] text-white/50 line-through">$10</Text>
              <Text
                className="font-sans-bold text-[32px] text-white"
                style={{ letterSpacing: -0.8 }}
              >
                $8
              </Text>
              <Text className="font-sans-semibold text-[14px] text-white/70">{t('perMonth')}</Text>
            </View>
            <Text className="mt-0.5 font-sans text-[11.5px] text-white/60">{t('heroBilled')}</Text>
          </View>
          <View className="h-9 w-px bg-white/20" />
          <View className="flex-1 flex-row items-center gap-2">
            <View className="h-[26px] w-[26px] items-center justify-center rounded-full bg-white/10">
              <Check size={15} color="#FFFFFF" />
            </View>
            <Text className="flex-1 font-sans-semibold text-[12.5px] text-white/80">
              {t('heroTagline')}
            </Text>
          </View>
        </View>
      </View>
    </BrandGradient>
  );
}

export { PremiumHero };
