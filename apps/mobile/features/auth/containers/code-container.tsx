import { useDictionary } from '@repo/i18n';
import { cn } from '@repo/utils';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Sparkles } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Text, useToast } from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import { useThemeColors } from '@/shared/theme';
import { AuthButton } from '../components/auth-button';
import { AuthHeading } from '../components/auth-heading';
import { AuthScreen } from '../components/auth-screen';
import { OtpInput } from '../components/otp-input';

const RESEND_COOLDOWN = 30;
const CODE_LENGTH = 6;

export function CodeContainer() {
  const t = useDictionary('Auth');
  const router = useRouter();
  const toast = useToast();
  const colors = useThemeColors();
  const params = useLocalSearchParams<{ email?: string }>();
  const email =
    typeof params.email === 'string' && params.email.length > 0 ? params.email : 'your email';

  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (!cooldown) {
      return;
    }
    const id = setInterval(() => setCooldown((c) => (c <= 1 ? 0 : c - 1)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const full = code.length === CODE_LENGTH;

  const submit = () => {
    if (!full) {
      return;
    }
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      // Demo invalid path; any other 6-digit code proceeds.
      if (code === '000000') {
        setError(true);
        return;
      }
      router.push(ROUTES.newPassword);
    }, 700);
  };

  const resend = () => {
    if (cooldown) {
      return;
    }
    setCooldown(RESEND_COOLDOWN);
    setCode('');
    setError(false);
    toast.show(t('newCodeSent'));
  };

  return (
    <AuthScreen showBack padTop={108}>
      <AuthHeading title={t('codeTitle')} />
      <Text className="-mt-4 mb-6 text-[15px] leading-[22px] text-muted-foreground">
        {t('codeSentTo')} <Text className="font-sans-bold text-foreground">{email}</Text>.{' '}
        {t('codeEnterBelow')}
      </Text>

      <View className="gap-4">
        <OtpInput
          value={code}
          onChange={(next) => {
            setCode(next);
            setError(false);
          }}
          error={error}
          autoFocus
        />
        {error ? (
          <Text className="text-center font-sans-semibold text-[13px] text-destructive">
            {t('codeError')}
          </Text>
        ) : null}

        <View className="flex-row items-center gap-2 self-center rounded-full bg-secondary px-4 py-2.5">
          <Sparkles size={15} color={colors.primary} />
          <Text className="text-[12.5px] text-muted-foreground">{t('codeAutofill')}</Text>
        </View>

        <AuthButton onPress={submit} loading={busy} disabled={!full}>
          {t('verifyCode')}
        </AuthButton>

        <View className="flex-row items-center justify-center gap-1.5">
          <Text className="text-[14px] text-muted-foreground">{t('didntGetIt')}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={resend}
            disabled={cooldown > 0}
            hitSlop={6}
            className="active:opacity-60"
          >
            <Text
              className={cn(
                'font-sans-bold text-[14px]',
                cooldown ? 'text-muted-foreground' : 'text-link',
              )}
            >
              {cooldown ? `${t('resendInPrefix')} ${cooldown}s` : t('resendCode')}
            </Text>
          </Pressable>
        </View>
      </View>
    </AuthScreen>
  );
}
