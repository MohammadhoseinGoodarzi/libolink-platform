'use client';

import { useDictionary } from '@repo/i18n';
import Link from 'next/link';
import type { SignInFormProps } from '@/features/auth/types';
import { Button } from '@/shared/components/ui/button';
import { FormField } from '@/shared/components/ui/form-field';
import { Input } from '@/shared/components/ui/input';
import { PasswordInput } from '@/shared/components/ui/password-input';
import { ROUTES } from '@/shared/constants/routes';
import { SocialAuthButtons } from './social-auth-buttons';

export function SignInForm({ form, onSubmit, isSubmitting, hasError }: SignInFormProps) {
  const t = useDictionary('Auth');
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="grid gap-6">
      <h1 className="text-center font-semibold text-2xl">{t('signInTitle')}</h1>

      <form onSubmit={onSubmit} className="grid gap-4" noValidate>
        <FormField
          label={t('emailLabel')}
          htmlFor="email"
          error={errors.email ? t(errors.email.message as 'invalidEmail') : undefined}
        >
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder={t('emailPlaceholder')}
            aria-invalid={Boolean(errors.email)}
            {...register('email')}
          />
        </FormField>

        <FormField
          label={t('passwordLabel')}
          htmlFor="password"
          error={errors.password ? t(errors.password.message as 'passwordTooShort') : undefined}
        >
          <PasswordInput
            id="password"
            autoComplete="current-password"
            aria-invalid={Boolean(errors.password)}
            {...register('password')}
          />
        </FormField>

        {hasError ? (
          <p role="alert" className="text-destructive text-sm">
            {t('signInFailed')}
          </p>
        ) : null}

        <Button type="submit" variant="destructive" className="w-full" disabled={isSubmitting}>
          {t('signIn')}
        </Button>
      </form>

      <SocialAuthButtons />

      <p className="text-center text-muted-foreground text-sm">
        {t('noAccount')}{' '}
        <Link href={ROUTES.signup} className="text-primary underline-offset-4 hover:underline">
          {t('signUp')}
        </Link>
      </p>
    </div>
  );
}
