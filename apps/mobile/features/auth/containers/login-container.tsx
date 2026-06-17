import { LoginForm } from '../components/login-form';
import { useLoginForm } from '../hooks/use-login-form';

export function LoginContainer() {
  const { form, onSubmit, isSubmitting, hasError } = useLoginForm();
  return (
    <LoginForm form={form} onSubmit={onSubmit} isSubmitting={isSubmitting} hasError={hasError} />
  );
}
