import { useDictionary } from '@repo/i18n';
import { FlatList, View } from 'react-native';
import { Text } from '@/shared/components/ui';
import { allListings } from '../lib/directory-items';
import type { ClubSearchResultsProps } from '../types';
import { ClubListRow } from './club-list-row';

// In-page directory search (handoff §6.5) — mirrors the Messages list: typing in
// the directory field filters every community kind by name into one flat list.
// Virtualized (FlatList) like the see-all screen so rows mount lazily.
function ClubSearchResults({ directory, query, onOpen }: ClubSearchResultsProps) {
  const t = useDictionary('Clubs');

  const q = query.trim().toLowerCase();
  const results = allListings(directory).filter((it) => it.name.toLowerCase().includes(q));

  if (results.length === 0) {
    return (
      <View className="flex-1 items-center justify-center px-10">
        <Text className="text-center font-sans text-[14px] text-muted-foreground">
          {t('noResults')}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      className="flex-1"
      data={results}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ClubListRow item={item} onOpen={onOpen} />}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerClassName="py-1.5"
    />
  );
}

export { ClubSearchResults };
