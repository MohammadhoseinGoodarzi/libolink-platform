// Notification feed (handoff §6.2 social notifications): social activity, friend
// requests, and reading updates. Shared by both apps; rendering differs per app.

export type NotificationType =
  | 'like'
  | 'comment'
  | 'mention'
  | 'follow'
  | 'request'
  | 'reading'
  | 'club'
  | 'declined';

export interface NotificationActor {
  name: string;
  /** Handle without the leading @; omitted for non-person actors (e.g. clubs). */
  handle?: string;
  initials: string;
  /** Stable avatar hue 0–360. */
  hue: number;
}

export interface AppNotification {
  id: string;
  type: NotificationType;
  actor: NotificationActor;
  /** Server-provided summary line, e.g. "liked your post about Prairie Winds". */
  text: string;
  /** Relative time label, e.g. "2m", "1h". */
  time: string;
  unread: boolean;
}
