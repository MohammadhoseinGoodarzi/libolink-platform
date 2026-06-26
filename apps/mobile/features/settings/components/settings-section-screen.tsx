import { useDictionary } from '@repo/i18n';
import { View } from 'react-native';
import { Text } from '@/shared/components/ui';
import { SETTINGS_SECTION_TITLES } from '../constants';
import type { SettingsSectionScreenProps } from '../types';
import { AppearanceScreen } from './appearance-screen';
import { NotificationsScreen } from './notifications-screen';
import { SettingsScreenShell } from './settings-screen-shell';

// Push-detail section router (handoff Settings). Maps the /settings/[section]
// param to its screen; sections not built yet render the coming-soon shell so the
// index rows can already push to a titled screen with a working back button.
export function SettingsSectionScreen({ section }: SettingsSectionScreenProps) {
  const t = useDictionary('Settings');

  if (section === 'appearance') {
    return <AppearanceScreen />;
  }
  if (section === 'notifications') {
    return <NotificationsScreen />;
  }

  const titleKey = (section && SETTINGS_SECTION_TITLES[section]) || 'title';
  return (
    <SettingsScreenShell title={t(titleKey)}>
      <View className="items-center px-8 pt-16">
        <Text className="text-center font-sans text-[14px] text-muted-foreground leading-[20px]">
          {t('comingSoonBody')}
        </Text>
      </View>
    </SettingsScreenShell>
  );
}
