import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { ClubCategoryView } from '@/features/clubs';

// "See all" for one Clubs directory carousel (handoff §6.5 phase-2). Pushed over
// the Clubs tab; the section key selects which carousel to list in full.
export default function ClubCategoryScreen() {
  const params = useLocalSearchParams<{ section?: string | string[] }>();
  const section = Array.isArray(params.section) ? params.section[0] : params.section;

  if (!section) {
    return null;
  }

  return (
    <View className="flex-1 bg-background">
      <ClubCategoryView section={section} />
    </View>
  );
}
