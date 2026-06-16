import { useDictionary } from '@repo/i18n';
import { useRouter } from 'expo-router';
import { Lock, ShieldCheck } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';
import { useToast } from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import { AuthButton } from '../components/auth-button';
import { AuthField } from '../components/auth-field';
import { AuthHeading } from '../components/auth-heading';
import { AuthIconBadge } from '../components/auth-icon-badge';
import { AuthScreen } from '../components/auth-screen';
import {
  PasswordRequirements,
  PasswordStrength,
  pwStrength,
} from '../components/password-strength';

export function NewPasswordContainer() {
  const t = useDictionary('Auth');
  const router = useRouter();
  const toast = useToast();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);

  const strong = pwStrength(password) >= 3;
  const match = confirm.length > 0 && password === confirm;
  const valid = strong && match;

  const submit = () => {
    if (!valid) {
      return;
    }
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      toast.show(t('passwordUpdated'));
      router.replace(ROUTES.login);
    }, 800);
  };

  return (
    <AuthScreen showBack padTop={108}>
      <View className="mb-5">
        <AuthIconBadge icon={ShieldCheck} />
      </View>
      <AuthHeading title={t('newPassTitle')} subtitle={t('newPassSubtitle')} />
      <View className="gap-4">
        <View>
          <AuthField
            label={t('newPasswordLabel')}
            icon={Lock}
            value={password}
            onChangeText={setPassword}
            placeholder={t('atLeast8')}
            secure
            autoCapitalize="none"
            autoFocus
          />
          <PasswordStrength password={password} />
        </View>
        <AuthField
          label={t('confirmPasswordLabel')}
          icon={Lock}
          value={confirm}
          onChangeText={setConfirm}
          placeholder={t('confirmPasswordPlaceholder')}
          secure
          autoCapitalize="none"
          ok={match}
          error={confirm.length > 0 && !match ? t('passwordsDoNotMatch') : ''}
        />
        <View className="px-0.5 pt-1">
          <PasswordRequirements password={password} />
        </View>
        <AuthButton onPress={submit} loading={busy} disabled={!valid}>
          {t('updatePassword')}
        </AuthButton>
      </View>
    </AuthScreen>
  );
}
