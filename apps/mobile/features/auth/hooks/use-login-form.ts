import { useAuth } from '@repo/hooks';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { type SignInInput, signInSchema, valibotResolver } from '@/features/auth/validations';
import { ROUTES } from '@/shared/constants';
import { authClient } from '../services/auth-service';

export function useLoginForm() {
  const router = useRouter();
  const { signIn } = useAuth(authClient);

  const form = useForm<SignInInput>({
    resolver: valibotResolver(signInSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onTouched',
  });

  const onSubmit = form.handleSubmit((values) => {
    signIn.mutate(values, { onSuccess: () => router.replace(ROUTES.home) });
  });

  return { form, onSubmit, isSubmitting: signIn.isPending, hasError: signIn.isError };
}
