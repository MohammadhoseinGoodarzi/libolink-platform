import { type MessageKey, useDictionary } from '@repo/i18n';
import { passwordStrength } from '@repo/utils';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { Button, Card, Text, useToast } from '@/shared/components/ui';
import { oklchToHex, useThemeColors } from '@/shared/theme';
import { SettingsField } from './settings-field';
import { SettingsNote } from './settings-note';
import { SettingsScreenShell } from './settings-screen-shell';

const STRENGTH_LABELS: MessageKey<'Auth'>[] = [
  'pwTooWeak',
  'pwWeak',
  'pwFair',
  'pwGood',
  'pwStrong',
];
const BARS = ['a', 'b', 'c', 'd'] as const;

// Change Password (handoff Account): current + new (with strength meter) + confirm
// (match check). Scoring is the shared @repo/utils fn; the meter UI is local
// (auth's lives in its own feature). Mock save — no real credential change yet.
export function AccPasswordScreen() {
  const t = useDictionary('Settings');
  const tAuth = useDictionary('Auth');
  const colors = useThemeColors();
  const toast = useToast();
  const router = useRouter();

  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');

  const score = passwordStrength(next);
  const palette = [
    colors.destructive,
    colors.destructive,
    '#C9A227',
    oklchToHex(0.66, 0.14, 150),
    oklchToHex(0.6, 0.16, 150),
  ];
  const strengthColor = palette[score] ?? colors.destructive;
  const matches = next.length > 0 && next === confirm;
  const ok = current.length >= 6 && score >= 2 && matches;

  const save = () => {
    toast.show(t('accPasswordUpdated'));
    if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <SettingsScreenShell title={t('accPasswordTitle')}>
      <View className="px-4">
        <Card className="p-4">
          <SettingsField
            label={t('accCurrentPassword')}
            value={current}
            onChangeText={setCurrent}
            placeholder={t('accCurrentPasswordPh')}
            secure
            autoFocus
          />
        </Card>
      </View>

      <View className="h-4" />
      <View className="px-4">
        <Card className="gap-4 p-4">
          <View>
            <SettingsField
              label={t('accNewPassword')}
              value={next}
              onChangeText={setNext}
              placeholder={t('accNewPasswordPh')}
              secure
            />
            {next.length > 0 ? (
              <View className="mt-3">
                <View className="flex-row gap-1.5">
                  {BARS.map((id, index) => (
                    <View
                      key={id}
                      className="h-1.5 flex-1 rounded-full"
                      style={{ backgroundColor: index < score ? strengthColor : colors.secondary }}
                    />
                  ))}
                </View>
                <Text
                  className="mt-1.5 font-sans-semibold text-[11.5px]"
                  style={{ color: strengthColor }}
                >
                  {tAuth(STRENGTH_LABELS[score] ?? 'pwTooWeak')}
                </Text>
              </View>
            ) : null}
          </View>
          <SettingsField
            label={t('accConfirmNewPassword')}
            value={confirm}
            onChangeText={setConfirm}
            placeholder={t('accConfirmNewPasswordPh')}
            secure
            hint={confirm.length > 0 && !matches ? t('accPasswordMismatch') : undefined}
            hintTone="error"
          />
        </Card>
      </View>
      <SettingsNote>{t('accPasswordNote')}</SettingsNote>

      <View className="px-4 pt-5">
        <Button disabled={!ok} onPress={save}>
          {t('accUpdatePassword')}
        </Button>
      </View>
    </SettingsScreenShell>
  );
}
