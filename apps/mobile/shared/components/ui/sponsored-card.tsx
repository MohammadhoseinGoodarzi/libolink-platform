import { useDictionary } from '@repo/i18n';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { ROUTES } from '@/shared/constants';
import { useThemeColors } from '@/shared/theme';
import { Text } from './text';
import { useToast } from './toast';
import type { SponsoredCardProps } from './types';

// Reusable "Sponsored" ad card (handoff §5): surface fill, "Remove ads ›" →
// Subscription, primary monogram + CTA. Shared across the feed and messages
// list; Premium removes these entirely.
function SponsoredCard({ letter, title, body, cta, brand }: SponsoredCardProps) {
  const t = useDictionary('Common');
  const router = useRouter();
  const colors = useThemeColors();
  const toast = useToast();

  return (
    <View className="mx-3.5 my-2.5 rounded-[20px] bg-secondary p-3.5">
      <View className="mb-3 flex-row items-center justify-between">
        <View className="flex-row items-center gap-1.5">
          <View className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
          <Text className="font-sans-bold text-[10.5px] uppercase tracking-wider text-muted-foreground">
            {t('sponsored')}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('removeAds')}
          onPress={() => router.navigate(ROUTES.subscription)}
          className="flex-row items-center gap-0.5 active:opacity-60"
        >
          <Text className="font-sans-bold text-[11.5px] text-link">{t('removeAds')}</Text>
          <ChevronRight size={13} color={colors.link} />
        </Pressable>
      </View>

      <View className="flex-row items-center gap-3">
        <View className="h-[54px] w-[54px] items-center justify-center rounded-[12px] bg-primary">
          <Text className="font-sans-bold text-[22px] text-primary-foreground">{letter}</Text>
        </View>
        <View className="min-w-0 flex-1">
          <Text className="font-sans-bold text-[14.5px] leading-[18px] text-foreground">
            {title}
          </Text>
          <Text className="mt-0.5 font-sans text-[12px] leading-[17px] text-muted-foreground">
            {body}
          </Text>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={brand ? `${cta} · ${brand}` : cta}
        onPress={() => toast.show(t('openingSponsor'))}
        className="mt-3 h-10 items-center justify-center rounded-[20px] bg-primary active:opacity-90"
      >
        <Text className="font-sans-bold text-[13.5px] text-primary-foreground">
          {brand ? `${cta} · ${brand}` : cta}
        </Text>
      </Pressable>
    </View>
  );
}

export { SponsoredCard };
