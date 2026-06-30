import { useLocalSearchParams } from 'expo-router';
import { SettingsDetailScreen } from '@/features/settings';

// Settings deep sub-screen route (account forms, etc.). The screen key
// (acc_edit/acc_username/…) selects the screen; unbuilt keys render a coming-soon
// shell. Mirrors the /settings/[section] route + registry pattern.
export default function SettingsDetailRoute() {
  const params = useLocalSearchParams<{ screen?: string | string[] }>();
  const screen = Array.isArray(params.screen) ? params.screen[0] : params.screen;
  return <SettingsDetailScreen screen={screen} />;
}
