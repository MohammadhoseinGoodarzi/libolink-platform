import { useDictionary } from '@repo/i18n';
import { useRouter } from 'expo-router';
import { Lock, Mail } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';
import { ROUTES } from '@/shared/constants';
import { AuthButton } from '../components/auth-button';
import { AuthField } from '../components/auth-field';
import { AuthHeading } from '../components/auth-heading';
import { AuthIconBadge } from '../components/auth-icon-badge';
import { AuthScreen } from '../components/auth-screen';
import { FooterPrompt } from '../components/footer-prompt';

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function ForgotContainer() {
  const t = useDictionary('Auth');
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const valid = EMAIL_RE.test(email);

  const submit = () => {
    if (!valid) {
      return;
    }
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      router.push({ pathname: ROUTES.code, params: { email } });
    }, 600);
  };

  return (
    <AuthScreen
      showBack
      padTop={108}
      footer={
        <FooterPrompt
          text={t('rememberedIt')}
          action={t('backToSignIn')}
          onPress={() => router.back()}
        />
      }
    >
      <View className="mb-5">
        <AuthIconBadge icon={Lock} />
      </View>
      <AuthHeading title={t('forgotTitle')} subtitle={t('forgotSubtitle')} />
      <View className="gap-[18px]">
        <AuthField
          label={t('emailLabel')}
          icon={Mail}
          value={email}
          onChangeText={setEmail}
          placeholder={t('emailPlaceholder')}
          keyboardType="email-address"
          autoCapitalize="none"
          autoFocus
          ok={valid}
        />
        <AuthButton onPress={submit} loading={busy} disabled={!valid}>
          {t('sendCode')}
        </AuthButton>
      </View>
    </AuthScreen>
  );
}
