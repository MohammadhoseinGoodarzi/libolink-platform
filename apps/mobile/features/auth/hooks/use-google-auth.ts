import { useAuth } from '@repo/hooks';
import { useRouter } from 'expo-router';
import { ROUTES } from '@/shared/constants';
import { authClient } from '../services/auth-service';

// Mocked "Continue with Google" (handoff §6.1): seeds a session via the mock
// client and lands on Home. Swap for expo-auth-session/Google when wiring OAuth.
export function useGoogleAuth() {
  const router = useRouter();
  const { signIn } = useAuth(authClient);
  return () => {
    signIn.mutate(
      { email: 'mehrab.k@gmail.com', password: 'google-oauth' },
      { onSuccess: () => router.replace(ROUTES.home) },
    );
  };
}
