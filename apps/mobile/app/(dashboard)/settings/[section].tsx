import { useLocalSearchParams } from 'expo-router';
import { SettingsSectionScreen } from '@/features/settings';

// Settings push-detail route. The section key (account/notifications/appearance/…)
// selects the screen; unbuilt sections render a coming-soon shell.
export default function SettingsSectionRoute() {
  const params = useLocalSearchParams<{ section?: string | string[] }>();
  const section = Array.isArray(params.section) ? params.section[0] : params.section;
  return <SettingsSectionScreen section={section} />;
}
