import { useDictionary } from '@repo/i18n';
import { View } from 'react-native';
import { Text } from '@/shared/components/ui';
import { SETTINGS_SECTION_TITLES } from '../constants';
import type { SettingsSectionScreenProps } from '../types';
import { AboutScreen } from './about-screen';
import { AccountScreen } from './account-screen';
import { AppearanceScreen } from './appearance-screen';
import { ContentScreen } from './content-screen';
import { NotificationsScreen } from './notifications-screen';
import { PrivacyScreen } from './privacy-screen';
import { SettingsDetailScreen } from './settings-detail-screen';
import { SettingsScreenShell } from './settings-screen-shell';
import { StorageScreen } from './storage-screen';
import { SupportScreen } from './support-screen';

// Push-detail section router (handoff Settings). Maps the /settings/[section]
// param to its screen; sections not built yet render the coming-soon shell so the
// index rows can already push to a titled screen with a working back button.
export function SettingsSectionScreen({ section }: SettingsSectionScreenProps) {
  const t = useDictionary('Settings');

  // Account deep sub-screens (acc_*) ride this same /settings/[section] route —
  // delegate them to the detail registry (see ENGINEERING_LOG 2026-06-30: a
  // separate nested route didn't deliver its param).
  if (section?.startsWith('acc_')) {
    return <SettingsDetailScreen screen={section} />;
  }

  if (section === 'appearance') {
    return <AppearanceScreen />;
  }
  if (section === 'notifications') {
    return <NotificationsScreen />;
  }
  if (section === 'privacy') {
    return <PrivacyScreen />;
  }
  if (section === 'content') {
    return <ContentScreen />;
  }
  if (section === 'about') {
    return <AboutScreen />;
  }
  if (section === 'account') {
    return <AccountScreen />;
  }
  if (section === 'storage') {
    return <StorageScreen />;
  }
  if (section === 'support') {
    return <SupportScreen />;
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
