import { useDictionary } from '@repo/i18n';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { Text } from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import { useThemeColors } from '@/shared/theme';
import type { FeedAd } from '../types';

// Feed-native sponsored card, injected after every 6 posts (handoff §6.2). The
// "Remove ads" link routes to Subscription; Premium removes these entirely.
export function SponsoredBanner({ ad }: { ad: FeedAd }) {
  const t = useDictionary('Home');
  const router = useRouter();
  const colors = useThemeColors();

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
          onPress={() => router.push(ROUTES.subscription)}
          className="flex-row items-center gap-0.5 active:opacity-60"
        >
          <Text className="font-sans-bold text-[11.5px] text-link">{t('removeAds')}</Text>
          <ChevronRight size={13} color={colors.link} />
        </Pressable>
      </View>

      <View className="flex-row items-center gap-3">
        <View className="h-[54px] w-[54px] items-center justify-center rounded-[12px] bg-primary">
          <Text className="font-sans-bold text-[22px] text-primary-foreground">{ad.letter}</Text>
        </View>
        <View className="min-w-0 flex-1">
          <Text className="font-sans-bold text-[14.5px] leading-[18px] text-foreground">
            {ad.title}
          </Text>
          <Text className="mt-0.5 font-sans text-[12px] leading-[17px] text-muted-foreground">
            {ad.body}
          </Text>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${ad.cta} · ${ad.brand}`}
        className="mt-3 h-10 items-center justify-center rounded-[20px] bg-primary active:opacity-90"
      >
        <Text className="font-sans-bold text-[13.5px] text-primary-foreground">
          {ad.cta} · {ad.brand}
        </Text>
      </Pressable>
    </View>
  );
}
