// Chat thread messages (handoff §6.3). A discriminated union over the message
// kinds; presentation-only details (gradient tone, waveform) live in the UI.
// Rich share-types (post/profile/link/gif) land with the share-in-chat sheet.

export interface ChatReaction {
  emoji: string;
  mine: boolean;
}

export interface ChatBook {
  title: string;
  author: string;
  rating?: number;
  note?: string;
}

export interface ChatReplyRef {
  name: string;
  text: string;
}

interface ChatMessageBase {
  id: string;
  from: 'me' | 'them';
  /** Display time label, e.g. "10:24" or "now". */
  time: string;
  read?: boolean;
  reactions?: ChatReaction[];
}

export type ChatMessage =
  | { id: string; kind: 'day'; label: string }
  | (ChatMessageBase & { kind: 'text'; text: string })
  | (ChatMessageBase & { kind: 'emoji'; text: string })
  | (ChatMessageBase & { kind: 'reply'; text: string; replyTo: ChatReplyRef })
  | (ChatMessageBase & { kind: 'book'; book: ChatBook })
  | (ChatMessageBase & { kind: 'image'; caption?: string })
  | (ChatMessageBase & { kind: 'voice'; duration: string });
