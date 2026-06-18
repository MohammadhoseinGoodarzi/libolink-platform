import { useLocalSearchParams } from 'expo-router';
import { ChatView } from '@/features/messages';

// Chat detail — pushed over the tabs (handoff §6.3). Opened from a conversation
// row with the conversation id.
export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ChatView id={id} />;
}
