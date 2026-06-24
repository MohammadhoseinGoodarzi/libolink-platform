// View-only types for the Messages feature (handoff §6.3). Domain shapes
// (Conversation, ChatMessage, …) live in @repo/types and are consumed directly.
import type { ConversationCandidate } from '@repo/types';
import type { ComponentType, ReactNode } from 'react';

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
