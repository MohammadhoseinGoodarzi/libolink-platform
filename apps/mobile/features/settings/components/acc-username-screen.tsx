import { type MessageKey, useDictionary } from '@repo/i18n';
import { sessionAtom, userAtom } from '@repo/stores';
import { useRouter } from 'expo-router';
import { useAtomValue, useSetAtom } from 'jotai';
import { useState } from 'react';
import { View } from 'react-native';
import { Button, Card, useToast } from '@/shared/components/ui';
import { type UsernameStatusKey, usernameStatus } from '../services/username-status';
import type { SettingsFieldHintTone } from '../types';
import { SettingsField } from './settings-field';
import { SettingsNote } from './settings-note';
import { SettingsScreenShell } from './settings-screen-shell';

// status key → its hint string + tone (handoff Account · Change Username).
const STATUS: Record<
  UsernameStatusKey,
  { label: MessageKey<'Settings'>; tone: SettingsFieldHintTone }
> = {
  current: { label: 'accUsernameCurrent', tone: 'muted' },
  tooShort: { label: 'accUsernameTooShort', tone: 'muted' },
  invalid: { label: 'accUsernameInvalid', tone: 'error' },
  taken: { label: 'accUsernameTaken', tone: 'error' },
  available: { label: 'accUsernameAvailable', tone: 'success' },
};

// Change Username (handoff Account): live availability check against a mock taken
// set; Save is disabled until the entry is valid + free. Writes the new handle to
// the session user.
export function AccUsernameScreen() {
  const t = useDictionary('Settings');
  const toast = useToast();
  const router = useRouter();
  const user = useAtomValue(userAtom);
  const setSession = useSetAtom(sessionAtom);

  const current = user?.username ?? '';
  const [value, setValue] = useState(current);
  const clean = value.trim().toLowerCase();
  const status = usernameStatus(clean, current);
  const ok = status === 'available';

  const save = () => {
    setSession((prev) => (prev ? { ...prev, user: { ...prev.user, username: clean } } : prev));
    toast.show(t('accUsernameUpdated'));
    if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <SettingsScreenShell title={t('accUsernameTitle')}>
      <View className="px-4">
        <Card className="p-4">
          <SettingsField
            label={t('accUsernameLabel')}
            value={value}
            onChangeText={setValue}
            placeholder={t('accUsernamePh')}
            prefix="@"
            autoCapitalize="none"
            autoFocus
            hint={t(STATUS[status].label)}
            hintTone={STATUS[status].tone}
          />
        </Card>
      </View>
      <SettingsNote>{t('accUsernameNote')}</SettingsNote>
      <View className="px-4 pt-5">
        <Button disabled={!ok} onPress={save}>
          {t('accSaveUsername')}
        </Button>
      </View>
    </SettingsScreenShell>
  );
}
