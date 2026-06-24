import { useLocalSearchParams } from 'expo-router';
import { ContactView } from '@/features/messages';

// Contact page — pushed over the chat (handoff §6.3). Opened by tapping the
// avatar/name in the chat header. Params can be missing or array-shaped.
export default function ContactScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  if (!id) {
    return null;
  }

  return <ContactView id={id} />;
}
