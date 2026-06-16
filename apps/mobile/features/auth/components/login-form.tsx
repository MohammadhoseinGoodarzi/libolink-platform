import { useDictionary } from '@repo/i18n';
import { useRouter } from 'expo-router';
import { Lock, Mail } from 'lucide-react-native';
import { Controller } from 'react-hook-form';
import { View } from 'react-native';
import { useGoogleAuth } from '@/features/auth/hooks/use-google-auth';
import type { LoginFormProps } from '@/features/auth/types';
import { BrandLogo } from '@/shared/components/brand-logo';
import { useToast } from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import { AuthButton } from './auth-button';
import { AuthField } from './auth-field';
import { AuthHeading } from './auth-heading';
import { AuthScreen } from './auth-screen';
import { FooterPrompt } from './footer-prompt';
import { GoogleButton } from './google-button';
import { OrDivider } from './or-divider';
import { TextLink } from './text-link';

export function LoginForm({ form, onSubmit, isSubmitting, hasError }: LoginFormProps) {
  const t = useDictionary('Auth');
  const tCommon = useDictionary('Common');
  const router = useRouter();
  const toast = useToast();
  const onGoogle = useGoogleAuth();
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <AuthScreen
      showBack
      padTop={108}
      footer={
        <FooterPrompt
          text={t('noAccount')}
          action={t('createAccount')}
          onPress={() => router.replace(ROUTES.signup)}
        />
      }
    >
      <View className="mb-6">
        <BrandLogo variant="mark" height={46} />
      </View>
      <AuthHeading title={t('welcomeBack')} subtitle={t('welcomeBackSubtitle')} />

      <View className="gap-4">
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <AuthField
              label={t('emailLabel')}
              icon={Mail}
              value={field.value}
              onChangeText={field.onChange}
              placeholder={t('emailPlaceholder')}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email ? t('invalidEmail') : ''}
            />
          )}
        />

        <View>
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <AuthField
                label={t('passwordLabel')}
                icon={Lock}
                value={field.value}
                onChangeText={field.onChange}
                placeholder={t('passwordPlaceholder')}
                secure
                autoCapitalize="none"
                error={errors.password ? t('passwordTooShort') : hasError ? t('signInFailed') : ''}
              />
            )}
          />
          <View className="mt-2 flex-row justify-end">
            <TextLink onPress={() => toast.show(tCommon('comingSoon'))}>
              {t('forgotPassword')}
            </TextLink>
          </View>
        </View>

        <AuthButton onPress={onSubmit} loading={isSubmitting}>
          {t('signIn')}
        </AuthButton>
        <OrDivider />
        <GoogleButton onPress={onGoogle} />
      </View>
    </AuthScreen>
  );
}
