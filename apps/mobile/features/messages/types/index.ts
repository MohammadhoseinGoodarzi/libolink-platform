// View-only types for the Messages feature (handoff §6.3). Domain shapes
// (Conversation, ChatMessage, …) live in @repo/types and are consumed directly.
import type { ConversationCandidate, ConversationKind } from '@repo/types';
import type { ComponentType, ReactNode } from 'react';

// Conversation-list filter tabs (no "Groups" tab — handoff §6.3).
export type FilterKey = 'all' | 'unread' | 'friends' | 'clubs';

// Lightweight identity passed via route params so the chat can open for an entity
// (e.g. a club) that has no inbox conversation yet — without the Messages feature
// importing another feature. The id is the single canonical key: /chat/[id] and
// /club/[id] both accept the same club id from anywhere. With a real backend the
// chat would resolve the conversation by id and the seed becomes a hint only.
export interface ConversationSeed {
  title: string;
  kind: ConversationKind;
  memberCount?: number | null;
}

export interface ChatViewProps {
  id: string;
  /** Identity for a chat opened by id with no inbox entry yet (e.g. a club). */
  seed?: ConversationSeed;
}

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

// One revealed swipe action (handoff §6.3): icon + label over a colour fill.
export interface SwipeAction {
  key: string;
  label: string;
  icon: ComponentType<{ size?: number; color?: string }>;
  /** Fill colour behind the action. */
  background: string;
  onPress: () => void;
}

export interface SwipeableRowProps {
  children: ReactNode;
  onPress: () => void;
  /** Revealed by swiping right (sit on the leading edge) — e.g. Read/Unread. */
  leadingActions?: SwipeAction[];
  /** Revealed by swiping left (sit on the trailing edge) — e.g. Archive/Mute/Delete. */
  trailingActions?: SwipeAction[];
}
