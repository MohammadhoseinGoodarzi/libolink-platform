import type { AppSettings } from '@repo/types';
import { atom } from 'jotai';

// Seed for the live app-settings state both apps' Settings screens read/write.
// Theme is intentionally NOT here — it lives in `themeAtom` (drives the no-flash
// theme system). Persistence (AsyncStorage on mobile) is layered app-side, the
// same way theme is, so this stays platform-agnostic.
export const DEFAULT_SETTINGS: AppSettings = {
  fontSize: 2,
  density: 'comfortable',
  accessibility: {
    boldText: false,
    largerText: false,
    reduceMotion: false,
    increaseContrast: false,
    reduceTransparency: false,
  },
  notif: {
    allow: true,
    push: true,
    email: false,
    inapp: true,
    messages: true,
    friends: true,
    comments: true,
    likes: false,
    mentions: true,
    clubs: true,
    reminders: true,
    followers: true,
    recs: true,
    sounds: true,
    badges: true,
    preview: true,
    quiet: false,
    quietFrom: '22:00',
    quietTo: '07:00',
  },
  privacy: {
    profileVis: 'public',
    activityVis: 'followers',
    listVis: 'public',
    searchable: true,
    onlineStatus: true,
    readReceipts: true,
    loginAlerts: true,
  },
  twofa: { enabled: true, method: 'app' },
  content: {
    appLanguage: 'en',
    translateTo: 'en',
    autoTransPosts: true,
    autoTransComments: false,
    showOriginal: true,
    sensitive: 'limit',
    mature: false,
    hideRead: false,
  },
  data: { dataSaver: false, autoplay: 'wifi', hiQualityAudio: true, downloadWifiOnly: true },
};

export const settingsAtom = atom<AppSettings>(DEFAULT_SETTINGS);
