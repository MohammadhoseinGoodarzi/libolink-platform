import { type MessageKey, useDictionary } from '@repo/i18n';
import { Sparkles } from 'lucide-react-native';
import { View } from 'react-native';
import { BrandGradient, Card, Text, VerifiedBadge } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import { BENEFIT_COPY, BENEFIT_ICONS, CHIP_ICONS } from '../constants';
import type { BenefitCardProps } from '../types';

// A membership benefit (handoff Subscription): gradient icon tile + title (with
// the verified seal / "Members only" tag) + description, plus early-access chips.
function BenefitCard({ benefit }: BenefitCardProps) {
  const t = useDictionary('Subscription');
  const colors = useThemeColors();
  const copy = BENEFIT_COPY[benefit.key];
  const Icon = BENEFIT_ICONS[benefit.icon] ?? Sparkles;

  return (
    <Card padded>
      <View className="flex-row items-start gap-3.5">
        <BrandGradient className="h-[46px] w-[46px] items-center justify-center rounded-2xl">
          <Icon size={23} color="#FFFFFF" />
        </BrandGradient>
        <View className="min-w-0 flex-1">
          <View className="flex-row flex-wrap items-center gap-2">
            <Text className="font-sans-bold text-[16px] text-foreground">{t(copy.title)}</Text>
            {benefit.verified ? <VerifiedBadge size={20} /> : null}
            {benefit.membersOnly ? (
              <View className="h-[19px] items-center justify-center rounded-full bg-secondary px-2">
                <Text className="font-sans-bold text-[10.5px] text-primary">
                  {t('membersOnly')}
                </Text>
              </View>
            ) : null}
          </View>
          <Text className="mt-1.5 font-sans text-[13.5px] text-muted-foreground leading-[21px]">
            {t(copy.desc)}
          </Text>
          {benefit.chips.length > 0 ? (
            <View className="mt-2.5 flex-row flex-wrap gap-2">
              {benefit.chips.map((chip) => {
                const ChipIcon = CHIP_ICONS[chip] ?? Sparkles;
                // chip is authored to match a Subscription i18n key.
                const label = t(chip as MessageKey<'Subscription'>);
                return (
                  <View
                    key={chip}
                    className="h-7 flex-row items-center gap-1.5 rounded-full bg-secondary px-3"
                  >
                    <ChipIcon size={14} color={colors.primary} />
                    <Text className="font-sans-semibold text-[12px] text-foreground">{label}</Text>
                    <Text
                      className="font-sans-bold text-[9.5px] text-muted-foreground"
                      style={{ letterSpacing: 0.4 }}
                    >
                      {t('soon')}
                    </Text>
                  </View>
                );
              })}
            </View>
          ) : null}
        </View>
      </View>
    </Card>
  );
}

export { BenefitCard };
