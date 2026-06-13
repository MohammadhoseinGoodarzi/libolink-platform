import { useDictionary } from '@repo/i18n';
import { Link } from 'expo-router';
import { Controller } from 'react-hook-form';
import { Text, View } from 'react-native';
import type { SignUpFormProps } from '@/features/auth/types';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { PasswordInput } from '@/shared/components/ui/password-input';
import { ROUTES } from '@/shared/constants';
import { SocialAuthButtons } from './social-auth-buttons';

export function SignUpForm({ form, onSubmit, isSubmitting, hasError }: SignUpFormProps) {
  const t = useDictionary('Auth');
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <View className="gap-6">
      <Text className="text-center font-semibold text-2xl text-foreground">{t('signUpTitle')}</Text>

      <View className="gap-4">
        <View className="gap-2">
          <Text className="font-medium text-foreground text-sm">{t('emailLabel')}</Text>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <Input
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder={t('emailPlaceholder')}
              />
            )}
          />
          {errors.email ? (
            <Text className="text-destructive text-sm">{t('invalidEmail')}</Text>
          ) : null}
        </View>

        <View className="gap-2">
          <Text className="font-medium text-foreground text-sm">{t('usernameLabel')}</Text>
          <Controller
            control={control}
            name="username"
            render={({ field }) => (
              <Input
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                autoCapitalize="none"
                placeholder={t('usernamePlaceholder')}
              />
            )}
          />
          {errors.username ? (
            <Text className="text-destructive text-sm">{t('usernameTooShort')}</Text>
          ) : null}
        </View>

        <View className="gap-2">
          <Text className="font-medium text-foreground text-sm">{t('passwordLabel')}</Text>
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <PasswordInput
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                autoCapitalize="none"
              />
            )}
          />
          {errors.password ? (
            <Text className="text-destructive text-sm">{t('passwordTooShort')}</Text>
          ) : null}
        </View>

        <View className="gap-2">
          <Text className="font-medium text-foreground text-sm">{t('confirmPasswordLabel')}</Text>
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field }) => (
              <PasswordInput
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                autoCapitalize="none"
              />
            )}
          />
          {errors.confirmPassword ? (
            <Text className="text-destructive text-sm">{t('passwordsDoNotMatch')}</Text>
          ) : null}
        </View>

        {hasError ? <Text className="text-destructive text-sm">{t('signInFailed')}</Text> : null}

        <Button variant="destructive" onPress={onSubmit} disabled={isSubmitting}>
          {t('signUp')}
        </Button>
      </View>

      <SocialAuthButtons />

      <View className="flex-row justify-center gap-1">
        <Text className="text-muted-foreground text-sm">{t('haveAccount')}</Text>
        <Link href={ROUTES.login} className="text-primary text-sm">
          {t('signIn')}
        </Link>
      </View>
    </View>
  );
}
