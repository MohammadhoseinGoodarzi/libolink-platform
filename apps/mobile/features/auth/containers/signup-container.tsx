import { SignUpForm } from '../components/signup-form';
import { useSignUpForm } from '../hooks/use-signup-form';

export function SignUpContainer() {
  const { form, onSubmit, isSubmitting, hasError } = useSignUpForm();
  return (
    <SignUpForm form={form} onSubmit={onSubmit} isSubmitting={isSubmitting} hasError={hasError} />
  );
}
