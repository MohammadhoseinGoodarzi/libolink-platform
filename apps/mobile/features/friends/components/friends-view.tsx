import { useDictionary } from '@repo/i18n';
import type { NetworkReader } from '@repo/types';
import { Search } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { BrandLogo } from '@/shared/components/brand-logo';
import { Header } from '@/shared/components/shell';
import { Button, IconButton, Text, useToast } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import { useNetwork } from '../hooks/use-network';
import { CompatibilitySection } from './compatibility-section';
import { MayKnowSection } from './may-know-section';
import { MyFriendsSection } from './my-friends-section';
import { ReaderSheet } from './reader-sheet';
import { RequestsSection } from './requests-section';
import { UniversitySection } from './university-section';

// Reader Network orchestrator (handoff Friends): loads the discovery surface via
// the shared @repo/api factory and renders the intro + Requests / My Friends /
// May Know / Compatibility / University sections. Tapping a reader opens the
// preview sheet. The search overlay and See-all screens are phase-2.
export function FriendsView() {
  const t = useDictionary('Friends');
  const tCommon = useDictionary('Common');
  const colors = useThemeColors();
  const toast = useToast();
  const { data, isLoading, isError, refetch } = useNetwork();
  const [reader, setReader] = useState<NetworkReader | null>(null);

  const headerRight = (
    <IconButton
      accessibilityLabel={tCommon('search')}
      onPress={() => toast.show(tCommon('comingSoon'))}
    >
      <Search size={21} color={colors.primary} />
    </IconButton>
  );

  if (isLoading) {
    return (
      <View className="flex-1 bg-background">
        <Header right={headerRight} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.primary} />
        </View>
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View className="flex-1 bg-background">
        <Header right={headerRight} />
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

  return (
    <View className="flex-1 bg-background">
      <Header right={headerRight} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-8">
        <View className="px-5 pt-4">
          <Text
            className="font-sans-bold text-[26px] text-foreground"
            style={{ letterSpacing: -0.6 }}
          >
            {t('introTitle')}
          </Text>
          <Text className="mt-1.5 font-sans text-[13.5px] text-muted-foreground">
            {t('introBody')}
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => toast.show(tCommon('comingSoon'))}
            className="mt-3.5 h-12 flex-row items-center gap-2.5 rounded-2xl bg-secondary px-4"
          >
            <Search size={19} color={colors.mutedForeground} />
            <Text className="font-sans text-[14.5px] text-muted-foreground">
              {t('searchPlaceholder')}
            </Text>
          </Pressable>
        </View>

        <RequestsSection requests={data.requests} />
        <MyFriendsSection friends={data.friends} onOpen={setReader} />
        <MayKnowSection readers={data.mayKnow} onOpen={setReader} />
        <CompatibilitySection matches={data.topMatches} onOpen={setReader} />
        <UniversitySection readers={data.university} onOpen={setReader} />

        <View className="items-center gap-1.5 px-6 pt-8 pb-2">
          <BrandLogo height={18} />
          <Text className="text-center font-sans text-[11.5px] text-muted-foreground">
            {t('footer')}
          </Text>
        </View>
      </ScrollView>

      <ReaderSheet reader={reader} open={reader !== null} onClose={() => setReader(null)} />
    </View>
  );
}
