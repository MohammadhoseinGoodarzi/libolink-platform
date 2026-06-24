import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { ProfileView } from '@/features/profile';

// A reader's full app profile in visitor mode — pushed over the chat/contact
// page (handoff §6.4). Opened from the contact page's "View Profile" button.
export default function ReaderProfileScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  if (!id) {
    return null;
  }

  return (
    <View className="flex-1 bg-background">
      <ProfileView readerId={id} />
    </View>
  );
}
