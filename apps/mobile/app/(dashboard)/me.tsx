import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { ProfileView } from '@/features/profile';
import { Header } from '@/shared/components/shell';

// The owner's own profile as a pushed (stacked) screen — opened from
// Settings → View Profile. Distinct from the Profile *tab*: pushing this keeps a
// real history entry, so hardware back returns to the previous page (Settings)
// instead of rewinding to the singleton tab navigator's Home root.
export default function MyProfileScreen() {
  const router = useRouter();
  return (
    <View className="flex-1 bg-background">
      <Header showBack onBack={() => router.back()} />
      <ProfileView standalone />
    </View>
  );
}
