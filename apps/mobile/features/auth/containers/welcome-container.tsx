import { useRouter } from 'expo-router';
import { ROUTES } from '@/shared/constants';
import { WelcomeView } from '../components/welcome-view';
import { useGoogleAuth } from '../hooks/use-google-auth';

export function WelcomeContainer() {
  const router = useRouter();
  const onGoogle = useGoogleAuth();
  return (
    <WelcomeView
      onCreateAccount={() => router.push(ROUTES.signup)}
      onSignIn={() => router.push(ROUTES.login)}
      onGoogle={onGoogle}
    />
  );
}
