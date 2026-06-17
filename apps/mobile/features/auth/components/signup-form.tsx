import { useDictionary } from '@repo/i18n';
import { useRouter } from 'expo-router';
import { AtSign, Gift, Lock, Mail } from 'lucide-react-native';
import { Controller } from 'react-hook-form';
import { View } from 'react-native';
import { useGoogleAuth } from '@/features/auth/hooks/use-google-auth';
import { useUsernameStatus } from '@/features/auth/hooks/use-username-status';
import type { SignUpFormProps } from '@/features/auth/types';
import { Text } from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import { AuthButton } from './auth-button';
import { AuthField } from './auth-field';
import { AuthHeading } from './auth-heading';
import { AuthScreen } from './auth-screen';
import { Checkbox } from './checkbox';
import { FooterPrompt } from './footer-prompt';
import { GoogleButton } from './google-button';
import { OrDivider } from './or-divider';
import { PasswordStrength } from './password-strength';

export function SignUpForm({ form, onSubmit, isSubmitting }: SignUpFormProps) {
  const t = useDictionary('Auth');
  const router = useRouter();
  const onGoogle = useGoogleAuth();
  const {
    control,
    watch,
    formState: { errors, isValid },
  } = form;

  const username = watch('username');
  const password = watch('password');
  const confirmPassword = watch('confirmPassword');
  const referral = watch('referral') ?? '';
  const usernameStatus = useUsernameStatus(username);

  const usernameError =
    usernameStatus === 'taken'
      ? t('usernameTaken')
      : usernameStatus === 'invalid'
        ? t('usernameInvalid')
        : errors.username
          ? t('usernameTooShort')
          : '';
  const usernameOk = usernameStatus === 'available' && !errors.username;
  const confirmOk = confirmPassword.length > 0 && password === confirmPassword;
  const referralOk = referral.trim().length >= 4;

  return (
    <AuthScreen
      showBack
      padTop={108}
      footer={
        <FooterPrompt
          text={t('haveAccount')}
          action={t('signIn')}
          onPress={() => router.replace(ROUTES.login)}
        />
      }
    >
      <AuthHeading title={t('createAccountTitle')} subtitle={t('createAccountSubtitle')} />

      <View className="gap-[15px]">
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Controller
              control={control}
              name="firstName"
              render={({ field }) => (
                <AuthField
                  label={t('firstName')}
                  value={field.value}
                  onChangeText={field.onChange}
                  placeholder={t('firstNamePlaceholder')}
                  error={errors.firstName ? t('nameRequired') : ''}
                />
              )}
            />
          </View>
          <View className="flex-1">
            <Controller
              control={control}
              name="lastName"
              render={({ field }) => (
                <AuthField
                  label={t('lastName')}
                  value={field.value}
                  onChangeText={field.onChange}
                  placeholder={t('lastNamePlaceholder')}
                  error={errors.lastName ? t('nameRequired') : ''}
                />
              )}
            />
          </View>
        </View>

        <Controller
          control={control}
          name="username"
          render={({ field }) => (
            <AuthField
              label={t('usernameLabel')}
              icon={AtSign}
              prefix="@"
              value={field.value}
              onChangeText={field.onChange}
              placeholder={t('usernamePlaceholder')}
              autoCapitalize="none"
              ok={usernameOk}
              error={usernameError}
            />
          )}
        />

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
              ok={!errors.email && field.value.length > 0}
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
                placeholder={t('createPasswordPlaceholder')}
                secure
                autoCapitalize="none"
              />
            )}
          />
          <PasswordStrength password={password} />
        </View>

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field }) => (
            <AuthField
              label={t('confirmPasswordLabel')}
              icon={Lock}
              value={field.value}
              onChangeText={field.onChange}
              placeholder={t('confirmPasswordPlaceholder')}
              secure
              autoCapitalize="none"
              ok={confirmOk}
              error={errors.confirmPassword ? t('passwordsDoNotMatch') : ''}
            />
          )}
        />

        <Controller
          control={control}
          name="referral"
          render={({ field }) => (
            <AuthField
              label={t('referralLabel')}
              icon={Gift}
              value={field.value ?? ''}
              onChangeText={field.onChange}
              placeholder={t('referralPlaceholder')}
              autoCapitalize="none"
              ok={referralOk}
              hint={t('referralHint')}
            />
          )}
        />

        <Controller
          control={control}
          name="agree"
          render={({ field }) => (
            <Checkbox checked={field.value} onChange={field.onChange}>
              <Text className="text-[13.5px] leading-5 text-muted-foreground">
                {t('agreePrefix')}{' '}
                <Text className="font-sans-semibold text-link">{t('terms')}</Text> {t('and')}{' '}
                <Text className="font-sans-semibold text-link">{t('privacy')}</Text>.
              </Text>
            </Checkbox>
          )}
        />

        <AuthButton
          onPress={onSubmit}
          loading={isSubmitting}
          disabled={!isValid || usernameStatus === 'taken'}
        >
          {t('createAccount')}
        </AuthButton>
        <OrDivider />
        <GoogleButton onPress={onGoogle} />
      </View>
    </AuthScreen>
  );
}
