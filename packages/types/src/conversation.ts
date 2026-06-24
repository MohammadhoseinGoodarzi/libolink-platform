import type { Nullable } from './common';
import type { PostBook } from './post';

// A messages list entry (handoff §6.3). DM = a person; group/club = a community
// (club carries its current-read book for the row thumbnail).
export type ConversationKind = 'dm' | 'group' | 'club';

export interface Conversation {
  id: string;
  kind: ConversationKind;
  /** Display name — the person, group, or club. */
  title: string;
  handle: string;
  /** DM only — counterpart presence. */
  online: boolean;
  /** group/club only — member count shown after the name. */
  memberCount: Nullable<number>;
  /** club only — current read, rendered as the row thumbnail. */
  book: Nullable<PostBook>;
  preview: string;
  lastActivityAt: string;
  unreadCount: number;
  pinned: boolean;
  muted: boolean;
  typing: boolean;
  /** Last message was sent by me — show the read receipt on the preview. */
  lastMessageMine: boolean;
  lastMessageRead: boolean;
  /** Hidden from the main list into the Archived folder. */
  archived: boolean;
  /** The other party is blocked — chat is read-only until unblocked. */
  blocked: boolean;
}

// A startable conversation target in the new-message sheet (handoff §6.3): a
// reader, friend, book club, or community you can open a fresh chat with. Carries
// just enough to render the picker row and synthesize a fresh Conversation when
// the chat opens (no inbox metadata — preview/unread/etc. only exist once a
// conversation is under way).
export interface ConversationCandidate {
  id: string;
  kind: ConversationKind;
  title: string;
  handle: string;
  online: boolean;
  memberCount: Nullable<number>;
  book: Nullable<PostBook>;
}
