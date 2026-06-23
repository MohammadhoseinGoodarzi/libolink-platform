import { useSearch } from '@repo/hooks';
import { useDictionary } from '@repo/i18n';
import type { SearchResult } from '@repo/types';
import { Search } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, View } from 'react-native';
import { initialWindowMetrics, useSafeAreaInsets } from 'react-native-safe-area-context';
import { FilterChip, SearchInput, Text, useToast } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import { SEARCH_CLUBS, SEARCH_PEOPLE, SEARCH_SCOPES, SEARCH_TAGS } from '../services/search-data';
import { searchClient } from '../services/search-service';
import type { SearchOverlayProps, SearchScope } from '../types';
import { SearchResultRow } from './search-result-row';

const DEBOUNCE_MS = 250;

// Full-screen search overlay (handoff §6.2): debounced live search over people +
// tags with scope chips, an empty-query Trending/Suggested state, and loading /
// no-results states. Search logic is shared (useSearch); this is the RN UI.
export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const t = useDictionary('Search');
  const tCommon = useDictionary('Common');
  const colors = useThemeColors();
  const toast = useToast();
  const insets = useSafeAreaInsets();
  const topInset = insets.top || initialWindowMetrics?.insets.top || 0;

  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [scope, setScope] = useState<SearchScope>('all');
  const { results, isFetching } = useSearch(searchClient, debounced);

  // Reset on each open so a reopen starts fresh.
  useEffect(() => {
    if (open) {
      setQuery('');
      setDebounced('');
      setScope('all');
    }
  }, [open]);

  // Debounce the term handed to the shared search hook.
  useEffect(() => {
    const id = setTimeout(() => setDebounced(query), DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [query]);

  const scopeLabel = (s: SearchScope) =>
    s === 'all'
      ? t('scopeAll')
      : s === 'people'
        ? t('scopePeople')
        : s === 'tags'
          ? t('scopeTags')
          : t('scopeClubs');

  const inScope = (kind: SearchResult['kind']) => {
    if (scope === 'all') {
      return true;
    }
    if (scope === 'people') {
      return kind === 'person';
    }
    if (scope === 'tags') {
      return kind === 'tag';
    }
    return kind === 'club';
  };

  const typing = query.trim().length > 0;
  const pending = query.trim() !== debounced.trim();
  const loading = typing && (pending || isFetching);
  const visible = results.filter((r) => inScope(r.kind));

  const pick = () => {
    onClose();
    toast.show(tCommon('comingSoon'));
  };

  return (
    <Modal
      visible={open}
      transparent
      statusBarTranslucent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-background" style={{ paddingTop: topInset }}>
        <View className="border-border border-b px-3 pb-2.5">
          <View className="flex-row items-center gap-2">
            <View className="flex-1">
              <SearchInput
                autoFocus
                value={query}
                onChangeText={setQuery}
                placeholder={t('placeholder')}
                returnKeyType="search"
              />
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={tCommon('cancel')}
              onPress={onClose}
              className="px-1 active:opacity-60"
            >
              <Text className="font-sans-semibold text-[15px] text-primary">
                {tCommon('cancel')}
              </Text>
            </Pressable>
          </View>

          <View className="mt-2.5 flex-row gap-2">
            {SEARCH_SCOPES.map((s) => (
              <FilterChip
                key={s}
                label={scopeLabel(s)}
                active={scope === s}
                onPress={() => setScope(s)}
              />
            ))}
          </View>
        </View>

        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {!typing ? (
            <>
              {inScope('tag') ? (
                <>
                  <Text className="px-4 pt-4 pb-1 font-sans-semibold text-[12px] text-muted-foreground uppercase">
                    {t('trending')}
                  </Text>
                  {SEARCH_TAGS.slice(0, 5).map((tag) => (
                    <SearchResultRow key={tag.tag} result={tag} onPress={pick} />
                  ))}
                </>
              ) : null}
              {inScope('person') ? (
                <>
                  <Text className="px-4 pt-4 pb-1 font-sans-semibold text-[12px] text-muted-foreground uppercase">
                    {t('suggested')}
                  </Text>
                  {SEARCH_PEOPLE.slice(0, 5).map((person) => (
                    <SearchResultRow key={person.id} result={person} onPress={pick} />
                  ))}
                </>
              ) : null}
              {inScope('club') ? (
                <>
                  <Text className="px-4 pt-4 pb-1 font-sans-semibold text-[12px] text-muted-foreground uppercase">
                    {t('clubs')}
                  </Text>
                  {SEARCH_CLUBS.slice(0, 5).map((club) => (
                    <SearchResultRow key={club.id} result={club} onPress={pick} />
                  ))}
                </>
              ) : null}
            </>
          ) : loading && visible.length === 0 ? (
            <ActivityIndicator className="mt-12" color={colors.primary} />
          ) : visible.length === 0 ? (
            <View className="items-center px-8 pt-16">
              <Search size={34} color={colors.mutedForeground} />
              <Text className="mt-3 font-sans-semibold text-[15px] text-foreground">
                {t('emptyTitle')}
              </Text>
              <Text className="mt-1 text-center font-sans text-[13px] text-muted-foreground">
                {t('emptyBody')}
              </Text>
            </View>
          ) : (
            visible.map((r) => (
              <SearchResultRow key={r.kind === 'tag' ? r.tag : r.id} result={r} onPress={pick} />
            ))
          )}
          <View className="h-6" />
        </ScrollView>
      </View>
    </Modal>
  );
}
