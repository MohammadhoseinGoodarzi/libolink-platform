import { useDictionary } from '@repo/i18n';
import { Crown, Lock } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { BottomSheet, BrandGradient, Text } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import type { CheckoutSheetProps } from '../types';

// Checkout confirmation (handoff Subscription): a summary sheet with the selected
// plan, the total today, and Subscribe / Not now. Payment is mocked.
function CheckoutSheet({ open, onClose, plan, onConfirm }: CheckoutSheetProps) {
  const t = useDictionary('Subscription');
  const colors = useThemeColors();
  const annual = plan.key === 'annual';
  // billedYearly is nullable in the contract — fall back to the monthly rate × 12
  // so the summary never renders "$null".
  const yearly = plan.billedYearly ?? plan.price * 12;
  const total = annual ? `$${yearly} ${t('perYear')}` : `$${plan.price} ${t('perMonth')}`;
  const cta = annual ? `$${yearly}${t('perYear')}` : `$${plan.price}${t('perMonth')}`;

  return (
    <BottomSheet open={open} onClose={onClose} label={t('checkoutTitle')}>
      <View className="px-5 pt-1">
        <View className="items-center">
          <BrandGradient className="h-[52px] w-[52px] items-center justify-center rounded-2xl">
            <Crown size={26} color="#FFFFFF" />
          </BrandGradient>
          <Text className="mt-3 font-sans-bold text-[20px] text-foreground">
            {t('checkoutTitle')}
          </Text>
          <Text className="mt-1 font-sans text-[13px] text-muted-foreground">
            {t('checkoutBody')}
          </Text>
        </View>

        <View className="mt-4 rounded-2xl bg-secondary p-4">
          <View className="flex-row items-center justify-between">
            <Text
              className="font-sans-bold text-[11.5px] text-muted-foreground uppercase"
              style={{ letterSpacing: 0.6 }}
            >
              {annual ? t('planAnnual') : t('planMonthly')} {t('planWord')}
            </Text>
            <Text className="font-sans-bold text-[13px] text-foreground">
              ${plan.price}
              {t('perMonth')}
            </Text>
          </View>
          <View className="my-3 h-px bg-border" />
          <View className="flex-row items-center justify-between">
            <Text className="font-sans-bold text-[14px] text-foreground">{t('totalToday')}</Text>
            <Text className="font-sans-bold text-[15px] text-primary">{total}</Text>
          </View>
        </View>

        <View className="mt-3.5 flex-row items-center gap-2">
          <Lock size={15} color={colors.mutedForeground} />
          <Text className="flex-1 font-sans text-[12px] text-muted-foreground">
            {t('secureCancel')}
          </Text>
        </View>
      </View>

      <View className="px-5 pt-4">
        <Pressable
          accessibilityRole="button"
          onPress={onConfirm}
          className="h-[54px] flex-row items-center justify-center gap-2 rounded-2xl bg-destructive"
        >
          <Crown size={19} color={colors.destructiveForeground} />
          <Text className="font-sans-bold text-[16.5px] text-destructive-foreground">
            {t('subscribe')} — {cta}
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={onClose}
          className="mt-2 h-[46px] items-center justify-center rounded-2xl"
        >
          <Text className="font-sans-semibold text-[14.5px] text-muted-foreground">
            {t('notNow')}
          </Text>
        </Pressable>
      </View>
    </BottomSheet>
  );
}

export { CheckoutSheet };
