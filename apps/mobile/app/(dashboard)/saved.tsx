import { useDictionary } from '@repo/i18n';
import { PlaceholderScreen } from '@/shared/components/placeholder-screen';

export default function SavedScreen() {
  const t = useDictionary('Shell');
  return <PlaceholderScreen title={t('drawerSaved')} back />;
}
