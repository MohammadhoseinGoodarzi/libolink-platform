import { useDictionary } from '@repo/i18n';
import { PlaceholderScreen } from '@/shared/components/placeholder-screen';

// Chat detail is the next Messages slice; this keeps row taps navigable (push +
// back) in the meantime, matching the placeholder pattern for unbuilt routes.
export default function ChatScreen() {
  const t = useDictionary('Messages');
  return <PlaceholderScreen title={t('chat')} back />;
}
