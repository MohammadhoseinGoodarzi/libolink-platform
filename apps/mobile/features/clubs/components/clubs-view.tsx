import { useDictionary } from '@repo/i18n';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { BrandLogo } from '@/shared/components/brand-logo';
import { Button, Text, useToast } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import { useClubs } from '../hooks/use-clubs';
import type { DirectoryCategory } from '../types';
import { AdaptationsSection } from './adaptations-section';
import { AuthorSection } from './author-section';
import { ClubSearchResults } from './club-search-results';
import { ClubsSponsoredCard } from './clubs-sponsored-card';
import { DirectoryIntro } from './directory-intro';
import { MyClubsSection } from './my-clubs-section';
import { PublisherSection } from './publisher-section';
import { SeriesSection } from './series-section';

// Clubs & Communities directory orchestrator (handoff §6.5): loads the directory
// via the shared @repo/api factory. A fixed header (title + in-page search) sits
// over either the stacked read-surface sections or, while searching, a flat
// filtered results list. Create and see-all are phase-2 and acknowledge taps.
export function ClubsView() {
  const t = useDictionary('Clubs');
  const tCommon = useDictionary('Common');
  const colors = useThemeColors();
  const router = useRouter();
  const toast = useToast();
  const { data, isLoading, isError, refetch } = useClubs();
  const [query, setQuery] = useState('');

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
  const openClub = (id: string) => router.push({ pathname: '/club/[id]', params: { id } });
  const seeAll = (section: DirectoryCategory) =>
    router.push({ pathname: '/clubs/[section]', params: { section } });
  const searching = query.trim().length > 0;

  return (
    <View className="flex-1 bg-background">
      {searching ? (
        // Active search: keep the title + search pinned above the (virtualized)
        // results list so the query stays editable.
        <>
          <DirectoryIntro query={query} onQueryChange={setQuery} onCreate={comingSoon} />
          <ClubSearchResults directory={directory} query={query} onOpen={openClub} />
        </>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-6">
          {/* title + search scroll with the directory, not pinned */}
          <DirectoryIntro query={query} onQueryChange={setQuery} onCreate={comingSoon} />
          <MyClubsSection
            clubs={directory.myClubs}
            onSeeAll={() => seeAll('my-clubs')}
            onOpen={openClub}
          />
          <PublisherSection
            publishers={directory.publishers}
            onSeeAll={() => seeAll('publishers')}
            onOpen={openClub}
          />
          <ClubsSponsoredCard onPress={comingSoon} />
          <SeriesSection
            series={directory.series}
            onSeeAll={() => seeAll('series')}
            onOpen={openClub}
          />
          <AdaptationsSection
            adaptations={directory.adaptations}
            onSeeAll={() => seeAll('adaptations')}
            onOpen={openClub}
          />
          <AuthorSection
            authors={directory.authors}
            onSeeAll={() => seeAll('authors')}
            onOpen={openClub}
          />

          <View className="items-center gap-1.5 px-6 pt-8 pb-2">
            <BrandLogo height={18} />
            <Text className="text-center font-sans text-[11.5px] text-muted-foreground">
              {t('footer')}
            </Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
}
