import { type MessageKey, useDictionary } from '@repo/i18n';
import type { ClubGenre, ClubListing } from '@repo/types';
import { useRouter } from 'expo-router';
import { ArrowLeft, SlidersHorizontal } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BottomSheet,
  Button,
  FilterChip,
  IconButton,
  SearchInput,
  Text,
} from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import { useClubCategory } from '../hooks/use-club-category';
import { isDirectoryCategory } from '../lib/directory-items';
import type { ClubCategoryViewProps, ClubSort, ClubYear, DirectoryCategory } from '../types';
import { ClubListRow } from './club-list-row';

// Each carousel's "see all" maps to its directory header string.
const TITLE_KEY: Record<DirectoryCategory, MessageKey<'Clubs'>> = {
  'my-clubs': 'myClubs',
  publishers: 'publishers',
  series: 'series',
  adaptations: 'adaptations',
  authors: 'authors',
};

const SORTS: { key: ClubSort; labelKey: MessageKey<'Clubs'> }[] = [
  { key: 'top', labelKey: 'sortTop' },
  { key: 'trending', labelKey: 'sortTrending' },
  { key: 'new', labelKey: 'sortNew' },
  { key: 'az', labelKey: 'sortAz' },
];

const GENRES: { key: ClubGenre | 'all'; labelKey: MessageKey<'Clubs'> }[] = [
  { key: 'all', labelKey: 'filterAll' },
  { key: 'fantasy', labelKey: 'genreFantasy' },
  { key: 'mystery', labelKey: 'genreMystery' },
  { key: 'scifi', labelKey: 'genreScifi' },
  { key: 'romance', labelKey: 'genreRomance' },
  { key: 'literary', labelKey: 'genreLiterary' },
  { key: 'classics', labelKey: 'genreClassics' },
  { key: 'nonfiction', labelKey: 'genreNonfiction' },
];

const YEARS: { key: ClubYear; labelKey: MessageKey<'Clubs'> }[] = [
  { key: 'all', labelKey: 'filterAll' },
  { key: '2020s', labelKey: 'year2020s' },
  { key: '2010s', labelKey: 'year2010s' },
  { key: '2000s', labelKey: 'year2000s' },
  { key: 'classic', labelKey: 'yearClassic' },
];

// Full-list "see all" for one directory carousel (handoff §6.5 phase-2). Search +
// inline sort (top ranks / trending / newest / A–Z) + a Genre/Year filter sheet,
// all applied server-side, over an infinite-scroll FlatList. Previous results stay
// on screen while a refinement loads (keepPreviousData) so nothing blanks/jumps.
export function ClubCategoryView({ section }: ClubCategoryViewProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const t = useDictionary('Clubs');
  const tCommon = useDictionary('Common');
  const colors = useThemeColors();

  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [sort, setSort] = useState<ClubSort>('top');
  const [genre, setGenre] = useState<ClubGenre | 'all'>('all');
  const [year, setYear] = useState<ClubYear>('all');
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Debounce the search so each keystroke doesn't fire a fresh paged request.
  useEffect(() => {
    const id = setTimeout(() => setDebounced(query.trim()), 300);
    return () => clearTimeout(id);
  }, [query]);

  const category = isDirectoryCategory(section) ? section : null;
  const openClub = (id: string) => router.push({ pathname: '/club/[id]', params: { id } });
  const activeRefinements = (genre !== 'all' ? 1 : 0) + (year !== 'all' ? 1 : 0);
  const resetRefinements = () => {
    setGenre('all');
    setYear('all');
  };

  const { data, isLoading, isError, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useClubCategory(category ?? 'my-clubs', { q: debounced, sort, genre, year });

  const items: ClubListing[] = data?.pages.flatMap((p) => p.items) ?? [];

  const Header = (
    <View style={{ paddingTop: insets.top }} className="border-border border-b bg-background">
      <View className="h-14 flex-row items-center gap-1 px-1">
        <IconButton accessibilityLabel={tCommon('back')} onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.primary} />
        </IconButton>
        <Text className="ml-1 font-sans-bold text-[18px] text-foreground">
          {category ? t(TITLE_KEY[category]) : tCommon('genericError')}
        </Text>
      </View>
    </View>
  );

  if (!category) {
    return (
      <View className="flex-1 bg-background">
        {Header}
        <View className="flex-1 items-center justify-center px-10">
          <Text className="text-center font-sans text-[14px] text-muted-foreground">
            {tCommon('genericError')}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {Header}

      {/* search + Filters button (turns green with an inline count when active) */}
      <View className="flex-row items-center gap-2 px-[18px] pt-3">
        <View className="flex-1">
          <SearchInput
            value={query}
            onChangeText={setQuery}
            placeholder={t('searchInCategory')}
            autoCapitalize="none"
          />
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('filtersLabel')}
          onPress={() => setFiltersOpen(true)}
          className={
            activeRefinements > 0
              ? 'h-11 shrink-0 flex-row items-center gap-1.5 rounded-full bg-primary px-3.5 active:opacity-90'
              : 'h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary active:opacity-80'
          }
        >
          <SlidersHorizontal
            size={18}
            color={activeRefinements > 0 ? colors.primaryForeground : colors.primary}
          />
          {activeRefinements > 0 ? (
            <Text
              className="font-sans-bold text-[14px]"
              style={{ color: colors.primaryForeground }}
            >
              {activeRefinements}
            </Text>
          ) : null}
        </Pressable>
      </View>

      {/* sort chips — a wrapping row (natural height) rather than a horizontal
          ScrollView, which would grow vertically and shove the list down. */}
      <View className="flex-row flex-wrap gap-2 px-[18px] py-2.5">
        {SORTS.map((s) => (
          <FilterChip
            key={s.key}
            label={t(s.labelKey)}
            active={sort === s.key}
            onPress={() => setSort(s.key)}
          />
        ))}
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : isError ? (
        <View className="flex-1 items-center justify-center gap-3 px-8">
          <Text className="text-center font-sans text-[14px] text-muted-foreground">
            {tCommon('genericError')}
          </Text>
          <Button variant="outline" size="sm" onPress={() => void refetch()}>
            {tCommon('retry')}
          </Button>
        </View>
      ) : (
        <FlatList
          className="flex-1"
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ClubListRow item={item} onOpen={openClub} />}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + 16 }}
          onEndReachedThreshold={0.4}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              void fetchNextPage();
            }
          }}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center px-10">
              <Text className="text-center font-sans text-[14px] text-muted-foreground">
                {t('noResults')}
              </Text>
            </View>
          }
          ListFooterComponent={
            isFetchingNextPage ? (
              <View className="flex-row items-center justify-center gap-2 py-6">
                <ActivityIndicator color={colors.primary} />
                <Text className="font-sans text-[13px] text-muted-foreground">
                  {t('loadingMore')}
                </Text>
              </View>
            ) : null
          }
        />
      )}

      {/* Genre + Year refinements (bottom sheet) */}
      <BottomSheet
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        label={t('filtersLabel')}
        header={
          <View className="flex-row items-center justify-between px-5 pb-2">
            <Text className="font-sans-bold text-[17px] text-foreground">{t('filtersLabel')}</Text>
            {activeRefinements > 0 ? (
              <Pressable
                accessibilityRole="button"
                onPress={resetRefinements}
                className="px-1 py-1 active:opacity-60"
              >
                <Text className="font-sans-semibold text-[13px] text-primary">{t('reset')}</Text>
              </Pressable>
            ) : null}
          </View>
        }
      >
        <View className="px-5 pb-4">
          <Text className="pb-2 font-sans-semibold text-[11.5px] uppercase tracking-wide text-muted-foreground">
            {t('genreLabel')}
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {GENRES.map((g) => (
              <FilterChip
                key={g.key}
                label={t(g.labelKey)}
                active={genre === g.key}
                onPress={() => setGenre(g.key)}
              />
            ))}
          </View>

          <Text className="pt-5 pb-2 font-sans-semibold text-[11.5px] uppercase tracking-wide text-muted-foreground">
            {t('yearLabel')}
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {YEARS.map((y) => (
              <FilterChip
                key={y.key}
                label={t(y.labelKey)}
                active={year === y.key}
                onPress={() => setYear(y.key)}
              />
            ))}
          </View>

          <Button className="mt-6" onPress={() => setFiltersOpen(false)}>
            {t('applyFilters')}
          </Button>
        </View>
      </BottomSheet>
    </View>
  );
}
