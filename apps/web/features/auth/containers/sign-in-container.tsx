'use client';

import { useSignInForm } from '@/features/auth/hooks/use-sign-in-form';
import { SignInForm } from '../components/sign-in-form';

export function SignInContainer() {
  const { form, onSubmit, isSubmitting, hasError } = useSignInForm();
  return (
    <SignInForm form={form} onSubmit={onSubmit} isSubmitting={isSubmitting} hasError={hasError} />
  );
}
