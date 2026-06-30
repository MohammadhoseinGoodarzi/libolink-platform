import { useDictionary } from '@repo/i18n';
import { userAtom } from '@repo/stores';
import { useRouter } from 'expo-router';
import { useAtomValue } from 'jotai';
import { AtSign, KeyRound, Mail, PenLine, ShieldCheck, UserCog } from 'lucide-react-native';
import { View } from 'react-native';
import type { SettingsDetailKey } from '../types';
import { GroupCard } from './group-card';
import { SettingsGroupLabel } from './settings-group-label';
import { SettingsNote } from './settings-note';
import { SettingsRow } from './settings-row';
import { SettingsScreenShell } from './settings-screen-shell';

// Account (handoff): the personal + security entry points. Each opens a deeper
// form/management screen (edit info, username, email, password, verification,
// connected accounts) — those are phase-2, so the rows acknowledge for now.
// Identity is read from the shared session user.
export function AccountScreen() {
  const t = useDictionary('Settings');
  const router = useRouter();
  const user = useAtomValue(userAtom);
  // Reuse the proven /settings/[section] route + registry for the account deep
  // screens too (a separate nested route didn't deliver its param). The registry
  // delegates acc_* keys to the detail screens.
  const go = (screen: SettingsDetailKey) =>
    router.push({ pathname: '/settings/[section]', params: { section: screen } });

  return (
    <SettingsScreenShell title={t('account')}>
      <SettingsGroupLabel icon={UserCog}>{t('accountPersonal')}</SettingsGroupLabel>
      <GroupCard>
        <SettingsRow
          first
          icon={PenLine}
          title={t('editPersonalInfo')}
          subtitle={user?.displayName ?? ''}
          onPress={() => go('acc_edit')}
        />
        <SettingsRow
          icon={AtSign}
          title={t('changeUsername')}
          value={user?.username ? `@${user.username}` : ''}
          onPress={() => go('acc_username')}
        />
        <SettingsRow
          icon={Mail}
          title={t('changeEmail')}
          value={user?.email ?? ''}
          onPress={() => go('acc_email')}
        />
        <SettingsRow
          icon={KeyRound}
          title={t('changePassword')}
          onPress={() => go('acc_password')}
        />
      </GroupCard>

      <View className="h-5" />
      <SettingsGroupLabel icon={ShieldCheck}>{t('securityLinks')}</SettingsGroupLabel>
      <GroupCard>
        <SettingsRow
          first
          icon={ShieldCheck}
          title={t('accountVerification')}
          value={user?.verified ? t('verifiedBadge') : t('unverifiedBadge')}
          onPress={() => go('acc_verify')}
        />
        <SettingsRow
          icon={AtSign}
          title={t('connectedAccounts')}
          onPress={() => go('acc_connected')}
        />
      </GroupCard>
      <SettingsNote>{t('accountNote')}</SettingsNote>
    </SettingsScreenShell>
  );
}
