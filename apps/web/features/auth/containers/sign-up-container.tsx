'use client';

import { useSignUpForm } from '@/features/auth/hooks/use-sign-up-form';
import { SignUpForm } from '../components/sign-up-form';

export function SignUpContainer() {
  const { form, onSubmit, isSubmitting, hasError } = useSignUpForm();
  return (
    <SignUpForm form={form} onSubmit={onSubmit} isSubmitting={isSubmitting} hasError={hasError} />
  );
}
