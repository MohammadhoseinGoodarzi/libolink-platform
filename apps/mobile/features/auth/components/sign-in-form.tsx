import { useDictionary } from '@repo/i18n';
import { Link } from 'expo-router';
import { Controller } from 'react-hook-form';
import { Text, View } from 'react-native';
import type { SignInFormProps } from '@/features/auth/types';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { PasswordInput } from '@/shared/components/ui/password-input';
import { ROUTES } from '@/shared/constants';
import { SocialAuthButtons } from './social-auth-buttons';

export function SignInForm({ form, onSubmit, isSubmitting, hasError }: SignInFormProps) {
  const t = useDictionary('Auth');
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <View className="gap-6">
      <Text className="text-center font-semibold text-2xl text-foreground">{t('signInTitle')}</Text>

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

        {hasError ? <Text className="text-destructive text-sm">{t('signInFailed')}</Text> : null}

        <Button variant="destructive" onPress={onSubmit} disabled={isSubmitting}>
          {t('signIn')}
        </Button>
      </View>

      <SocialAuthButtons />

      <View className="flex-row justify-center gap-1">
        <Text className="text-muted-foreground text-sm">{t('noAccount')}</Text>
        <Link href={ROUTES.signup} className="text-primary text-sm">
          {t('signUp')}
        </Link>
      </View>
    </View>
  );
}
