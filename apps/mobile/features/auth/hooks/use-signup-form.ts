import { useAuth } from '@repo/hooks';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import {
  type SignUpFormInput,
  signUpFormSchema,
  valibotResolver,
} from '@/features/auth/validations';
import { ROUTES } from '@/shared/constants';
import { authClient } from '../services/auth-service';

export function useSignUpForm() {
  const router = useRouter();
  const { signUp } = useAuth(authClient);

  const form = useForm<SignUpFormInput>({
    resolver: valibotResolver(signUpFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      referral: '',
      agree: false,
    },
    mode: 'onChange',
  });

  const onSubmit = form.handleSubmit((values) => {
    // Maps the richer mobile form to the shared SignUpPayload, then continues the
    // onboarding flow: verify → complete profile → success.
    signUp.mutate(
      { email: values.email, username: values.username, password: values.password },
      {
        onSuccess: () => router.push({ pathname: ROUTES.verify, params: { email: values.email } }),
      },
    );
  });

  return { form, onSubmit, isSubmitting: signUp.isPending, hasError: signUp.isError };
}
