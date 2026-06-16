import { useLocalSearchParams, useRouter } from 'expo-router';
import { ROUTES } from '@/shared/constants';
import { SuccessView } from '../components/success-view';

export function SuccessContainer() {
  const router = useRouter();
  const params = useLocalSearchParams<{ name?: string }>();
  const name = typeof params.name === 'string' && params.name.length > 0 ? params.name : 'Reader';
  return <SuccessView name={name} onStart={() => router.replace(ROUTES.home)} />;
}
