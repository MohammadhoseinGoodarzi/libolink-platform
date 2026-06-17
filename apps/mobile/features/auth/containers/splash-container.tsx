import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef } from 'react';
import { ROUTES } from '@/shared/constants';
import { SplashView } from '../components/splash-view';

const SPLASH_MS = 2000;

export function SplashContainer() {
  const router = useRouter();
  const advanced = useRef(false);

  const goWelcome = useCallback(() => {
    if (advanced.current) {
      return;
    }
    advanced.current = true;
    router.replace(ROUTES.welcome);
  }, [router]);

  useEffect(() => {
    const id = setTimeout(goWelcome, SPLASH_MS);
    return () => clearTimeout(id);
  }, [goWelcome]);

  return <SplashView onContinue={goWelcome} />;
}
