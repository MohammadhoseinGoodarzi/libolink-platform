import { useDictionary } from '@repo/i18n';
import { View } from 'react-native';
import { Text } from '@/shared/components/ui';
import type { SettingsDetailScreenProps } from '../types';
import { AccConnectedScreen } from './acc-connected-screen';
import { AccEditScreen } from './acc-edit-screen';
import { AccEmailScreen } from './acc-email-screen';
import { AccPasswordScreen } from './acc-password-screen';
import { AccUsernameScreen } from './acc-username-screen';
import { AccVerifyScreen } from './acc-verify-screen';
import { SettingsScreenShell } from './settings-screen-shell';

// Push-detail sub-screen router (handoff Settings). Maps the
// /settings/screen/[screen] param to its screen; anything unbuilt renders the
// coming-soon shell so a row can already push to a titled, back-able screen.
export function SettingsDetailScreen({ screen }: SettingsDetailScreenProps) {
  const t = useDictionary('Settings');

  if (screen === 'acc_edit') {
    return <AccEditScreen />;
  }
  if (screen === 'acc_username') {
    return <AccUsernameScreen />;
  }
  if (screen === 'acc_email') {
    return <AccEmailScreen />;
  }
  if (screen === 'acc_password') {
    return <AccPasswordScreen />;
  }
  if (screen === 'acc_verify') {
    return <AccVerifyScreen />;
  }
  if (screen === 'acc_connected') {
    return <AccConnectedScreen />;
  }

  return (
    <SettingsScreenShell title={t('title')}>
      <View className="items-center px-8 pt-16">
        <Text className="text-center font-sans text-[14px] text-muted-foreground leading-[20px]">
          {t('comingSoonBody')}
        </Text>
      </View>
    </SettingsScreenShell>
  );
}
