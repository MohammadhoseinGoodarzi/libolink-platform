import { useDictionary } from '@repo/i18n';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { BrandLogo } from '@/shared/components/brand-logo';
import { Button, Text, useToast } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import { useClubs } from '../hooks/use-clubs';
import { AdaptationsSection } from './adaptations-section';
import { AuthorSection } from './author-section';
import { ClubsSponsoredCard } from './clubs-sponsored-card';
import { DirectoryIntro } from './directory-intro';
import { MyClubsSection } from './my-clubs-section';
import { PublisherSection } from './publisher-section';
import { SeriesSection } from './series-section';

// Clubs & Communities directory orchestrator (handoff §6.5): loads the directory
// via the shared @repo/api factory and stacks the read-surface sections. Search,
// Create, club-detail and see-all are clubs phase-2 and acknowledge taps.
export function ClubsView() {
  const t = useDictionary('Clubs');
  const tCommon = useDictionary('Common');
  const colors = useThemeColors();
  const toast = useToast();
  const { data, isLoading, isError, refetch } = useClubs();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View className="flex-1 items-center justify-center gap-3 bg-background px-8">
        <Text className="text-center font-sans text-[14px] text-muted-foreground">
          {tCommon('genericError')}
        </Text>
        <Button variant="outline" size="sm" onPress={() => void refetch()}>
          {tCommon('retry')}
        </Button>
      </View>
    );
  }

  const directory = data;
  const comingSoon = () => toast.show(tCommon('comingSoon'));

  return (
    <ScrollView
      className="flex-1 bg-background"
      showsVerticalScrollIndicator={false}
      contentContainerClassName="pb-6"
    >
      <DirectoryIntro onSearch={comingSoon} onCreate={comingSoon} />
      <MyClubsSection clubs={directory.myClubs} onSeeAll={comingSoon} />
      <PublisherSection publishers={directory.publishers} onSeeAll={comingSoon} />
      <ClubsSponsoredCard onPress={comingSoon} />
      <SeriesSection series={directory.series} onSeeAll={comingSoon} />
      <AdaptationsSection adaptations={directory.adaptations} onSeeAll={comingSoon} />
      <AuthorSection authors={directory.authors} onSeeAll={comingSoon} />

      <View className="items-center gap-1.5 px-6 pt-8 pb-2">
        <BrandLogo height={18} />
        <Text className="text-center font-sans text-[11.5px] text-muted-foreground">
          {t('footer')}
        </Text>
      </View>
    </ScrollView>
  );
}
