import { useDictionary } from '@repo/i18n';
import { accountProfileAtom, sessionAtom, userAtom } from '@repo/stores';
import type { PronounKey } from '@repo/types';
import { useRouter } from 'expo-router';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { CalendarDays, UserCog } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';
import { ActionSheet, Button, Card, useToast } from '@/shared/components/ui';
import { PRONOUN_OPTIONS } from '../constants';
import { useSelectSheet } from '../hooks/use-select-sheet';
import { GroupCard } from './group-card';
import { SettingsField } from './settings-field';
import { SettingsNote } from './settings-note';
import { SettingsRow } from './settings-row';
import { SettingsScreenShell } from './settings-screen-shell';

const BIO_LIMIT = 160;

// Edit Personal Info (handoff Account). Identity fields (displayName, bio) write
// back to the session user; the extra profile fields (fullName, location,
// website, pronouns) write to the shared accountProfileAtom. Birthday needs a
// native date picker (no new dep yet) — it acknowledges for now.
export function AccEditScreen() {
  const t = useDictionary('Settings');
  const tCommon = useDictionary('Common');
  const toast = useToast();
  const router = useRouter();
  const user = useAtomValue(userAtom);
  const setSession = useSetAtom(sessionAtom);
  const [profile, setProfile] = useAtom(accountProfileAtom);
  const { sheet, openSelect, closeSheet } = useSelectSheet();

  const [fullName, setFullName] = useState(profile.fullName);
  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [location, setLocation] = useState(profile.location);
  const [website, setWebsite] = useState(profile.website);
  const [pronouns, setPronouns] = useState<PronounKey>(profile.pronouns);

  const pronounLabelKey =
    PRONOUN_OPTIONS.find((option) => option.key === pronouns)?.label ?? 'pronounUnspecified';

  const save = () => {
    setProfile((prev) => ({ ...prev, fullName, location, website, pronouns }));
    setSession((prev) =>
      prev ? { ...prev, user: { ...prev.user, displayName, bio: bio.trim() || null } } : prev,
    );
    toast.show(t('accProfileUpdated'));
    if (router.canGoBack()) {
      router.back();
    }
  };

  const pickPronouns = () =>
    openSelect<PronounKey>(
      t('accPronouns'),
      PRONOUN_OPTIONS.map((option) => ({ key: option.key, label: t(option.label) })),
      pronouns,
      setPronouns,
    );

  return (
    <SettingsScreenShell title={t('accEditTitle')}>
      <View className="px-4">
        <Card className="gap-4 p-4">
          <SettingsField
            label={t('accFullName')}
            value={fullName}
            onChangeText={setFullName}
            placeholder={t('accFullNamePh')}
          />
          <SettingsField
            label={t('accDisplayName')}
            value={displayName}
            onChangeText={setDisplayName}
            placeholder={t('accDisplayNamePh')}
          />
          <SettingsField
            label={t('accBio')}
            value={bio}
            onChangeText={setBio}
            placeholder={t('accBioPh')}
            multiline
            maxLength={BIO_LIMIT}
            hint={`${bio.length}/${BIO_LIMIT}`}
          />
        </Card>
      </View>

      <View className="h-4" />
      <View className="px-4">
        <Card className="gap-4 p-4">
          <SettingsField
            label={t('accLocation')}
            value={location}
            onChangeText={setLocation}
            placeholder={t('accLocationPh')}
          />
          <SettingsField
            label={t('accWebsite')}
            value={website}
            onChangeText={setWebsite}
            placeholder={t('accWebsitePh')}
          />
        </Card>
      </View>

      <View className="h-5" />
      <GroupCard>
        <SettingsRow
          first
          icon={UserCog}
          title={t('accPronouns')}
          value={t(pronounLabelKey)}
          onPress={pickPronouns}
        />
        <SettingsRow
          icon={CalendarDays}
          title={t('accBirthday')}
          value={profile.birthday || t('accBirthdayUnset')}
          onPress={() => toast.show(tCommon('comingSoon'))}
        />
      </GroupCard>
      <SettingsNote>{t('accBirthdayNote')}</SettingsNote>

      <View className="px-4 pt-5">
        <Button onPress={save}>{t('accSaveChanges')}</Button>
      </View>

      <ActionSheet
        open={sheet !== null}
        onClose={closeSheet}
        title={sheet?.title ?? ''}
        actions={sheet?.actions ?? []}
      />
    </SettingsScreenShell>
  );
}
