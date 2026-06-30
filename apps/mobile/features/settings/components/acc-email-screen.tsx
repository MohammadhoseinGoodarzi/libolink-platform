import { useDictionary } from '@repo/i18n';
import { sessionAtom, userAtom } from '@repo/stores';
import { useRouter } from 'expo-router';
import { useAtomValue, useSetAtom } from 'jotai';
import { Mail } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';
import { Button, Card, useToast } from '@/shared/components/ui';
import { GroupCard } from './group-card';
import { SettingsField } from './settings-field';
import { SettingsNote } from './settings-note';
import { SettingsRow } from './settings-row';
import { SettingsScreenShell } from './settings-screen-shell';

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// Change Email (handoff Account): new address + current-password confirm. The
// address only changes after the (mock) verification link, so we toast and write
// the new email to the session user.
export function AccEmailScreen() {
  const t = useDictionary('Settings');
  const toast = useToast();
  const router = useRouter();
  const user = useAtomValue(userAtom);
  const setSession = useSetAtom(sessionAtom);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const valid = EMAIL_RE.test(email.trim()) && password.length >= 6;

  const save = () => {
    setSession((prev) => (prev ? { ...prev, user: { ...prev.user, email: email.trim() } } : prev));
    toast.show(t('accEmailSent'));
    if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <SettingsScreenShell title={t('accEmailTitle')}>
      <GroupCard>
        <SettingsRow
          first
          icon={Mail}
          title={t('accCurrentEmail')}
          value={user?.email ?? ''}
          trailing="none"
        />
      </GroupCard>

      <View className="h-5" />
      <View className="px-4">
        <Card className="gap-4 p-4">
          <SettingsField
            label={t('accNewEmail')}
            value={email}
            onChangeText={setEmail}
            placeholder={t('accNewEmailPh')}
            keyboardType="email-address"
            autoCapitalize="none"
            autoFocus
          />
          <SettingsField
            label={t('accConfirmPassword')}
            value={password}
            onChangeText={setPassword}
            placeholder={t('accConfirmPasswordPh')}
            secure
          />
        </Card>
      </View>
      <SettingsNote>{t('accEmailNote')}</SettingsNote>

      <View className="px-4 pt-5">
        <Button disabled={!valid} onPress={save}>
          {t('accUpdateEmail')}
        </Button>
      </View>
    </SettingsScreenShell>
  );
}
