'use client';

import { useAuth } from '@repo/hooks';
import { type SignUpInput, signUpSchema, valibotResolver } from '@repo/validators';
import { useForm } from 'react-hook-form';
import { httpClient } from '@/shared/services/http-client';

export function useSignUpForm() {
  const { signUp } = useAuth(httpClient);

  const form = useForm<SignUpInput>({
    resolver: valibotResolver(signUpSchema),
    defaultValues: { email: '', username: '', password: '', confirmPassword: '' },
  });

  const onSubmit = form.handleSubmit((values) => {
    signUp.mutate({
      email: values.email,
      username: values.username,
      password: values.password,
    });
  });

  return {
    form,
    onSubmit,
    isSubmitting: signUp.isPending,
    hasError: signUp.isError,
  };
}
