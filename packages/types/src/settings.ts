// Live app-settings state (handoff Settings push-detail). The user's theme lives
// separately in `themeAtom` (@repo/stores) since it predates this and drives the
// no-flash theme system; everything else the Settings screens own is here.

export type FontSizeLevel = 0 | 1 | 2 | 3 | 4;
export type Density = 'comfortable' | 'compact';

export type ProfileVisibility = 'public' | 'followers' | 'private';
export type ActivityVisibility = 'everyone' | 'followers' | 'me';
export type ListVisibility = 'public' | 'followers' | 'private';
export type LanguageCode = 'en' | 'fa' | 'es' | 'fr' | 'ar' | 'de' | 'tr' | 'zh';
export type AutoplayMode = 'wifi' | 'always' | 'never';
export type SensitiveMode = 'off' | 'limit' | 'show';
export type TwoFactorMethod = 'app' | 'sms' | 'email';

export interface AccessibilitySettings {
  boldText: boolean;
  largerText: boolean;
  reduceMotion: boolean;
  increaseContrast: boolean;
  reduceTransparency: boolean;
}

export interface NotificationSettings {
  allow: boolean;
  // delivery channels
  push: boolean;
  email: boolean;
  inapp: boolean;
  // categories
  messages: boolean;
  friends: boolean;
  comments: boolean;
  likes: boolean;
  mentions: boolean;
  clubs: boolean;
  reminders: boolean;
  followers: boolean;
  recs: boolean;
  // alert style
  sounds: boolean;
  badges: boolean;
  preview: boolean;
  // quiet hours
  quiet: boolean;
  quietFrom: string;
  quietTo: string;
}

// The boolean-valued notification keys (excludes the quietFrom/quietTo times) —
// the only fields a notification toggle row may flip.
export type NotificationBooleanKey = {
  [K in keyof NotificationSettings]: NotificationSettings[K] extends boolean ? K : never;
}[keyof NotificationSettings];

export interface PrivacySettings {
  profileVis: ProfileVisibility;
  activityVis: ActivityVisibility;
  listVis: ListVisibility;
  searchable: boolean;
  onlineStatus: boolean;
  readReceipts: boolean;
  loginAlerts: boolean;
}

export interface TwoFactorSettings {
  enabled: boolean;
  method: TwoFactorMethod;
}

export interface ContentSettings {
  appLanguage: LanguageCode;
  translateTo: LanguageCode;
  autoTransPosts: boolean;
  autoTransComments: boolean;
  showOriginal: boolean;
  sensitive: SensitiveMode;
  mature: boolean;
  hideRead: boolean;
}

export interface DataSettings {
  dataSaver: boolean;
  autoplay: AutoplayMode;
  hiQualityAudio: boolean;
  downloadWifiOnly: boolean;
}

export interface AppSettings {
  fontSize: FontSizeLevel;
  density: Density;
  accessibility: AccessibilitySettings;
  notif: NotificationSettings;
  privacy: PrivacySettings;
  twofa: TwoFactorSettings;
  content: ContentSettings;
  data: DataSettings;
}
