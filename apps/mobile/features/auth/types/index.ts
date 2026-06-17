import type { UseFormReturn } from 'react-hook-form';
import type { SignInInput, SignUpFormInput } from '@/features/auth/validations';

export interface LoginFormProps {
  form: UseFormReturn<SignInInput>;
  onSubmit: () => void;
  isSubmitting: boolean;
  hasError: boolean;
}

export interface SignUpFormProps {
  form: UseFormReturn<SignUpFormInput>;
  onSubmit: () => void;
  isSubmitting: boolean;
  hasError: boolean;
}
