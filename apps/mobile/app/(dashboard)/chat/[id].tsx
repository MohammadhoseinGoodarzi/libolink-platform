import { useLocalSearchParams } from 'expo-router';
import { ChatView } from '@/features/messages';

// Chat detail — pushed over the tabs (handoff §6.3). Opened from a conversation
// row with the conversation id. Route params can be missing or array-shaped, so
// normalize to a single string and bail if absent.
export default function ChatScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  if (!id) {
    return null;
  }

  return <ChatView id={id} />;
}
