// View-only types for the Messages feature (handoff §6.3). Domain shapes
// (Conversation, ChatMessage, …) live in @repo/types and are consumed directly.

// Conversation-list filter tabs (no "Groups" tab — handoff §6.3).
export type FilterKey = 'all' | 'unread' | 'friends' | 'clubs';

export interface NewMessageSheetProps {
  open: boolean;
  onClose: () => void;
}
