import type { SignInInput, SignUpInput } from '@repo/validators';
import type { UseFormReturn } from 'react-hook-form';

export interface SignInFormProps {
  form: UseFormReturn<SignInInput>;
  onSubmit: () => void;
  isSubmitting: boolean;
  hasError: boolean;
}

export interface SignUpFormProps {
  form: UseFormReturn<SignUpInput>;
  onSubmit: () => void;
  isSubmitting: boolean;
  hasError: boolean;
}
