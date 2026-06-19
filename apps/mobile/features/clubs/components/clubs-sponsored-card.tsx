import { useDictionary } from '@repo/i18n';
import { ChevronRight } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { Card, Text } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import type { ClubsSponsoredCardProps } from '../types';
import { ClubBanner } from './club-banner';

// In-feed sponsored placement (handoff §6.5): a gradient banner promo with a
// "Presented by" line and a Learn more affordance.
function ClubsSponsoredCard({ onPress }: ClubsSponsoredCardProps) {
  const t = useDictionary('Clubs');
  const colors = useThemeColors();
  return (
    <View className="px-[18px] pt-6">
      <Text className="mb-2 pl-0.5 font-sans-bold text-[10.5px] uppercase tracking-wider text-muted-foreground">
        {t('sponsored')}
      </Text>
      <Pressable accessibilityRole="button" onPress={onPress} className="active:opacity-90">
        <Card className="overflow-hidden">
          <ClubBanner tone={5} icon="gift" height={108}>
            <View className="absolute inset-0 justify-center p-4">
              <Text
                style={{ maxWidth: 220 }}
                className="font-sans-bold text-[17px] leading-[20px] text-white"
              >
                {t('sponsoredTitle')}
              </Text>
              <Text
                style={{ maxWidth: 230, color: 'rgba(255,255,255,0.85)' }}
                className="mt-1 font-sans text-[12.5px]"
              >
                {t('sponsoredBody')}
              </Text>
            </View>
          </ClubBanner>
          <View className="flex-row items-center justify-between px-4 py-3">
            <Text className="font-sans text-[12.5px] text-muted-foreground">
              {t('sponsoredPresenter')}
            </Text>
            <View className="flex-row items-center gap-0.5">
              <Text className="font-sans-semibold text-[13.5px] text-link">{t('learnMore')}</Text>
              <ChevronRight size={15} color={colors.link} />
            </View>
          </View>
        </Card>
      </Pressable>
    </View>
  );
}

export { ClubsSponsoredCard };
