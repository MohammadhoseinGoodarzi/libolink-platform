import { useDictionary } from '@repo/i18n';
import { ScrollView, View } from 'react-native';
import { Text } from '@/shared/components/ui';
import { allListings } from '../lib/directory-items';
import type { ClubSearchResultsProps } from '../types';
import { ClubListRow } from './club-list-row';

// In-page directory search (handoff §6.5) — mirrors the Messages list: typing in
// the directory field filters every community kind by name into one flat list.
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
    <ScrollView
      className="flex-1"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerClassName="py-1.5"
    >
      {results.map((it) => (
        <ClubListRow key={it.id} item={it} onOpen={onOpen} />
      ))}
    </ScrollView>
  );
}

export { ClubSearchResults };
