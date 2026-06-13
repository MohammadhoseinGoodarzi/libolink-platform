export const AUTH_ROUTES = {
  login: '/login',
  signup: '/signup',
} as const;

export const SOCIAL_PROVIDERS = ['apple', 'google'] as const;

export type SocialProvider = (typeof SOCIAL_PROVIDERS)[number];
