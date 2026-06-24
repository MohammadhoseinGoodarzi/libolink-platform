// View-only types for the Messages feature (handoff §6.3). Domain shapes
// (Conversation, ChatMessage, …) live in @repo/types and are consumed directly.
import type { ConversationCandidate } from '@repo/types';

// Conversation-list filter tabs (no "Groups" tab — handoff §6.3).
export type FilterKey = 'all' | 'unread' | 'friends' | 'clubs';

export interface NewMessageSheetProps {
  open: boolean;
  onClose: () => void;
}

export interface CandidateRowProps {
  candidate: ConversationCandidate;
  onPick: (candidate: ConversationCandidate) => void;
}

export interface GroupSectionProps {
  label: string;
  rows: ConversationCandidate[];
  onPick: (candidate: ConversationCandidate) => void;
}
