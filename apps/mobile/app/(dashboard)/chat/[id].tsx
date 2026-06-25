import type { ConversationKind } from '@repo/types';
import { useLocalSearchParams } from 'expo-router';
import { ChatView } from '@/features/messages';

const KINDS: ReadonlyArray<ConversationKind> = ['dm', 'group', 'club'];

function toKind(value: string | undefined): ConversationKind {
  // Route params arrive as plain strings; default an unknown/absent kind to a
  // community chat (the only seeded entry point today is a club's Discussion).
  return KINDS.find((k) => k === value) ?? 'club';
}

// Chat detail — pushed over the tabs (handoff §6.3). Opened from a conversation
// row with the conversation id. Route params can be missing or array-shaped, so
// normalize to a single string and bail if absent. Optional `title`/`kind` params
// seed a fresh chat opened by id from another feature (e.g. a club's "Discussion")
// where no inbox conversation exists yet.
export default function ChatScreen() {
  const params = useLocalSearchParams<{
    id?: string | string[];
    title?: string;
    kind?: string;
  }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  if (!id) {
    return null;
  }

  const seed = params.title ? { title: params.title, kind: toKind(params.kind) } : undefined;

  return <ChatView id={id} {...(seed ? { seed } : {})} />;
}
