import { useDictionary } from '@repo/i18n';
import { cn } from '@repo/utils';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Mail, ShieldCheck } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Text, useToast } from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import { useThemeColors } from '@/shared/theme';
import { AuthBadgeArt } from '../components/auth-badge-art';
import { AuthButton } from '../components/auth-button';
import { AuthScreen } from '../components/auth-screen';

const RESEND_COOLDOWN = 30;

export function VerifyContainer() {
  const t = useDictionary('Auth');
  const router = useRouter();
  const toast = useToast();
  const colors = useThemeColors();
  const params = useLocalSearchParams<{ email?: string }>();
  const email =
    typeof params.email === 'string' && params.email.length > 0 ? params.email : 'your email';
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (!cooldown) {
      return;
    }
    const id = setInterval(() => setCooldown((c) => (c <= 1 ? 0 : c - 1)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const resend = () => {
    if (cooldown) {
      return;
    }
    setCooldown(RESEND_COOLDOWN);
    toast.show(t('verificationSent'));
  };

  return (
    <AuthScreen
      showBack
      center
      footer={
        <View className="gap-3">
          <AuthButton onPress={() => router.push(ROUTES.complete)}>
            <View className="flex-row items-center gap-2">
              <Mail size={19} color="#FFFFFF" />
              <Text className="font-sans-bold text-[16.5px] text-destructive-foreground">
                {t('openEmailApp')}
              </Text>
            </View>
          </AuthButton>
          <Pressable
            accessibilityRole="button"
            onPress={resend}
            disabled={cooldown > 0}
            className="h-[50px] items-center justify-center active:opacity-60"
          >
            <Text
              className={cn(
                'font-sans-bold text-[15px]',
                cooldown ? 'text-muted-foreground' : 'text-link',
              )}
            >
              {cooldown ? `${t('resendInPrefix')} ${cooldown}s` : t('resendVerification')}
            </Text>
          </Pressable>
        </View>
      }
    >
      <View className="items-center">
        <AuthBadgeArt icon={Mail} />
        <Text
          className="text-center font-sans-bold text-foreground"
          style={{ fontSize: 26, lineHeight: 30, letterSpacing: -0.6 }}
        >
          {t('verifyTitle')}
        </Text>
        <Text className="mt-2.5 max-w-[300px] text-center text-[15px] leading-[22px] text-muted-foreground">
          {t('verifySentTo')} <Text className="font-sans-bold text-foreground">{email}</Text>.{' '}
          {t('verifyActivate')}
        </Text>
        <View className="mt-4 flex-row items-center gap-2 rounded-full bg-secondary px-4 py-2.5">
          <ShieldCheck size={16} color={colors.link} />
          <Text className="text-[12.5px] text-muted-foreground">{t('linkExpires')}</Text>
        </View>
      </View>
    </AuthScreen>
  );
}
