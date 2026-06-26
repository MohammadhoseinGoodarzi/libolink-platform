import { useDictionary } from '@repo/i18n';
import { cn } from '@repo/utils';
import { Check } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { Text } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import type { PlanSelectorProps } from '../types';

// Plan selector (handoff Subscription): two selectable rows, annual default.
function PlanSelector({ plans, selected, onSelect }: PlanSelectorProps) {
  const t = useDictionary('Subscription');
  const colors = useThemeColors();
  // The best plan's strike-through is the standard monthly rate, sourced from the
  // plans payload rather than hardcoded.
  const compareAt = plans.find((plan) => plan.key === 'monthly')?.price ?? null;
  return (
    <View className="gap-3 px-4 pt-3.5">
      {plans.map((plan) => {
        const on = plan.key === selected;
        const annual = plan.key === 'annual';
        return (
          <Pressable
            key={plan.key}
            accessibilityRole="radio"
            accessibilityState={{ selected: on }}
            onPress={() => onSelect(plan.key)}
            className={cn(
              'flex-row items-center gap-3.5 rounded-2xl border-2 p-4',
              on ? 'border-primary bg-secondary' : 'border-border bg-card',
            )}
          >
            <View
              className={cn(
                'h-6 w-6 items-center justify-center rounded-full',
                on ? 'bg-primary' : 'border-2 border-border',
              )}
            >
              {on ? <Check size={15} color={colors.primaryForeground} /> : null}
            </View>
            <View className="min-w-0 flex-1">
              <View className="flex-row items-center gap-2">
                <Text className="font-sans-bold text-[16.5px] text-foreground">
                  {annual ? t('planAnnual') : t('planMonthly')}
                </Text>
                {plan.best ? (
                  <View className="h-5 items-center justify-center rounded-full bg-destructive px-2.5">
                    <Text className="font-sans-bold text-[10.5px] text-destructive-foreground">
                      {t('bestValue')}
                    </Text>
                  </View>
                ) : null}
              </View>
              <Text className="mt-0.5 font-sans text-[12.5px] text-muted-foreground">
                {annual ? t('planAnnualSub') : t('planMonthlySub')}
              </Text>
            </View>
            <View className="items-end">
              <View className="flex-row items-baseline gap-1">
                {plan.best && compareAt != null ? (
                  <Text className="font-sans-semibold text-[14px] text-muted-foreground line-through">
                    ${compareAt}
                  </Text>
                ) : null}
                <Text className="font-sans-bold text-[23px] text-foreground">${plan.price}</Text>
                <Text className="font-sans-semibold text-[13px] text-muted-foreground">
                  {t('perMonth')}
                </Text>
              </View>
              <Text className="mt-0.5 font-sans text-[11px] text-muted-foreground">
                {annual ? t('planAnnualBilled') : t('planMonthlyBilled')}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

export { PlanSelector };
