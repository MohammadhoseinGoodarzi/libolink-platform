import { useDictionary } from '@repo/i18n';
import { sessionAtom, userAtom } from '@repo/stores';
import type { PlanKey } from '@repo/types';
import { useRouter } from 'expo-router';
import { useAtomValue, useSetAtom } from 'jotai';
import { Check, Crown, Lock, Zap } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { BrandLogo } from '@/shared/components/brand-logo';
import { Header } from '@/shared/components/shell';
import { Button, Text, useToast } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import { usePremiumOffer } from '../hooks/use-premium-offer';
import { BenefitCard } from './benefit-card';
import { CheckoutSheet } from './checkout-sheet';
import { CompareTable } from './compare-table';
import { PlanSelector } from './plan-selector';
import { PremiumHero } from './premium-hero';
import { SectionHead } from './section-head';

// Premium / Subscription orchestrator (handoff Subscription): loads the offer via
// the shared @repo/api factory, then renders the hero, plan selector, primary CTA,
// benefits and the Free-vs-Premium comparison. Confirming checkout flips the
// session user to premium (mock); premium users see a current-member CTA instead.
export function SubscriptionView() {
  const t = useDictionary('Subscription');
  const tCommon = useDictionary('Common');
  const colors = useThemeColors();
  const router = useRouter();
  const toast = useToast();
  const user = useAtomValue(userAtom);
  const setSession = useSetAtom(sessionAtom);
  const { data, isLoading, isError, refetch } = usePremiumOffer();
  const [planKey, setPlanKey] = useState<PlanKey>('annual');
  const [checkout, setCheckout] = useState(false);
  const isPremium = user?.isPremium ?? false;

  if (isLoading) {
    return (
      <View className="flex-1 bg-background">
        <Header showBack onBack={() => router.back()} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.primary} />
        </View>
      </View>
    );
  }

  const plan = data?.plans.find((p) => p.key === planKey) ?? data?.plans[0];
  if (isError || !data || !plan) {
    return (
      <View className="flex-1 bg-background">
        <Header showBack onBack={() => router.back()} />
        <View className="flex-1 items-center justify-center gap-3 px-8">
          <Text className="text-center font-sans text-[14px] text-muted-foreground">
            {tCommon('genericError')}
          </Text>
          <Button variant="outline" size="sm" onPress={() => void refetch()}>
            {tCommon('retry')}
          </Button>
        </View>
      </View>
    );
  }

  const priceLabel = `$${plan.price}${t('perMonth')}`;

  const confirm = () => {
    setCheckout(false);
    setSession((prev) => (prev ? { ...prev, user: { ...prev.user, isPremium: true } } : prev));
    toast.show(t('welcomePremium'));
  };

  return (
    <View className="flex-1 bg-background">
      <Header showBack onBack={() => router.back()} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-8">
        <PremiumHero />

        <SectionHead overline={t('planOverline')} title={t('planTitle')} />
        <PlanSelector plans={data.plans} selected={planKey} onSelect={setPlanKey} />

        <View className="px-4 pt-4">
          {isPremium ? (
            <View className="h-14 flex-row items-center justify-center gap-2 rounded-2xl bg-secondary">
              <Check size={20} color={colors.primary} />
              <Text className="font-sans-bold text-[16px] text-primary">{t('youArePremium')}</Text>
            </View>
          ) : (
            <Pressable
              accessibilityRole="button"
              onPress={() => setCheckout(true)}
              className="h-14 flex-row items-center justify-center gap-2 rounded-2xl bg-destructive"
            >
              <Crown size={20} color={colors.destructiveForeground} />
              <Text className="font-sans-bold text-[17px] text-destructive-foreground">
                {t('getPremium')} · {priceLabel}
              </Text>
            </Pressable>
          )}
          <View className="mt-3.5 flex-row items-center justify-center gap-5">
            <View className="flex-row items-center gap-1.5">
              <Lock size={14} color={colors.mutedForeground} />
              <Text className="font-sans-semibold text-[12px] text-muted-foreground">
                {t('securePayment')}
              </Text>
            </View>
            <View className="flex-row items-center gap-1.5">
              <Zap size={14} color={colors.mutedForeground} />
              <Text className="font-sans-semibold text-[12px] text-muted-foreground">
                {t('instantAccess')}
              </Text>
            </View>
          </View>
        </View>

        <SectionHead overline={t('benefitsOverline')} title={t('benefitsTitle')} />
        <View className="gap-3 px-4 pt-3.5">
          {data.benefits.map((benefit) => (
            <BenefitCard key={benefit.key} benefit={benefit} />
          ))}
        </View>

        <SectionHead overline={t('compareOverline')} title={t('compareTitle')} />
        <CompareTable rows={data.comparison} />

        <View className="items-center gap-1.5 px-6 pt-8 pb-2">
          <View className="flex-row items-center gap-2">
            <BrandLogo height={18} />
            <Text
              className="font-sans-bold text-[13px] text-primary"
              style={{ letterSpacing: 0.3 }}
            >
              {t('premium')}
            </Text>
          </View>
          <Text className="text-center font-sans text-[11.5px] text-muted-foreground">
            {t('footerTagline')}
          </Text>
        </View>
      </ScrollView>

      <CheckoutSheet
        open={checkout}
        onClose={() => setCheckout(false)}
        plan={plan}
        onConfirm={confirm}
      />
    </View>
  );
}
