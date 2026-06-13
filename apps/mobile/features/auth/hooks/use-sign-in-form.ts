import { useAuth } from '@repo/hooks';
import { type SignInInput, signInSchema, valibotResolver } from '@repo/validators';
import { useForm } from 'react-hook-form';
import { httpClient } from '@/shared/services/http-client';

export function useSignInForm() {
  const { signIn } = useAuth(httpClient);

  const form = useForm<SignInInput>({
    resolver: valibotResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = form.handleSubmit((values) => {
    signIn.mutate(values);
  });

  return {
    form,
    onSubmit,
    isSubmitting: signIn.isPending,
    hasError: signIn.isError,
  };
}
