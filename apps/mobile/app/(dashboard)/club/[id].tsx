import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { ClubDetailView } from '@/features/clubs';

// A community's detail page (handoff §6.5 phase-2). Opened from any Clubs
// directory tile and from a club conversation's "View Club".
export default function ClubDetailScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  if (!id) {
    return null;
  }

  return (
    <View className="flex-1 bg-background">
      <ClubDetailView id={id} />
    </View>
  );
}
